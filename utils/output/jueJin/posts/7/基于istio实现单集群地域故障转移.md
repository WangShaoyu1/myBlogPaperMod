---
author: "华为云开发者联盟"
title: "基于istio实现单集群地域故障转移"
date: 2024-04-10
description: "本文分享自华为云社区《基于istio实现单集群地域故障转移》，随着应用程序的增长并变得更加复杂，微服务的数量也会增加，失败的可能性也会增加。"
tags: ["微服务","Istio","敏捷开发中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:1,comments:0,collects:0,views:517,"
---
本文分享自华为云社区《[基于istio实现单集群地域故障转移](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%2F425285%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs/425285?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")》，作者：可以交个朋友。

一 背景
====

随着应用程序的增长并变得更加复杂，微服务的数量也会增加，失败的可能性也会增加。微服务的故障可能多种原因造成，例如硬件问题、网络延迟、软件错误，甚至人为错误。故障转移Failover 是系统韧性设计中的一个基础能力，它们可以确保系统在出现故障时能够继续运行，并且能够在最小化的影响下进行恢复，减少或者消除对使用方或最终用户的影响，从而提高整个系统对外的可用性。

二 简介
====

云原生K8s、istio默认使用node上特定label作为地域信息：

*   地区：代表较大的地理区域，例如 us-east。一个地区通常包含许多可用区。 在 Kubernetes 中，标签topology.kubernetes.io/region 决定了节点所在的地区。
*   区域：区域内的一组计算资源。通过在区域内的多个区域中运行服务，可以在区域内的区域之间进行故障转移， 同时保持最终用户的数据地域性。在 Kubernetes 中，标签topology.kubernetes.io/zone决定了节点所在的区域。
*   分区：允许管理员进一步细分区域，以实现更细粒度的控制，例如“相同机架”。 Kubernetes 中不存在分区的概念。所以 Istio 引入了自定义节点标签 topology.istio.io/subzone 来定义分区。

kubectl describe node xxx |grep topo

![cke_114.png](/images/jueJin/891b364f1b9b432.png)

如下图所示演示环境，helloworld作为服务端有多个实例分别部署在不同zone中（不同zone节点topology.kubernetes.io/zone的label不同）。通过istio的destinationrule中localityLbSetting.failover（故障转移策略）和outlierDetection（故障异常点检测），可以实现客户端业务访问helloworld服务时候，优先访问与客户端同可用区的服务端，当同可用区的helloworld服务端全部故障后，再访问指定可用区的服务端，实现故障转移。

![cke_115.png](/images/jueJin/46cbe80b202c43e.png)

三 实战演练
======

事先准备好kubernetes+istio作为操作环境。可用华为云CCE和ASM服务进行操作。

3.1 部署服务端
---------

1.创建sample 命名空间，并设置istio-proxy sidecar自动注入

```yaml
apiVersion: v1
kind: Namespace
metadata:
name: sample
labels:
istio-injection: enabled
```

2.部署helloworld服务 作为服务端

将根据以下脚本生成对yaml配置清单

```bash
#!/bin/bash

set -euo pipefail

    display_usage() {
    echo
    echo "USAGE: ./gen-helloworld.sh [--version] [--includeService value] [--includeDeployment value]"
    echo "    -h|--help: Prints usage information"
    echo "    --version: Specifies the version that will be returned by the helloworld service, default: 'v1'"
    echo "    --includeService: If 'true' the service will be included in the YAML, default: 'true'"
    echo "    --includeDeployment: If 'true' the deployment will be included in the YAML, default: 'true'"
}

INCLUDE_SERVICE=${INCLUDE_SERVICE:-"true"}
INCLUDE_DEPLOYMENT=${INCLUDE_DEPLOYMENT:-"true"}
SERVICE_VERSION=${SERVICE_VERSION:-"v1"}
while (( "$#" )); do
case "$1" in
-h|--help)
display_usage
exit 0
;;

--version)
SERVICE_VERSION=$2
shift 2
;;

--includeService)
INCLUDE_SERVICE=$2
shift 2
;;

--includeDeployment)
INCLUDE_DEPLOYMENT=$2
shift 2
;;

*)
echo "Error: Unsupported flag $1" >&2
display_usage
exit 1
;;
esac
done

SERVICE_YAML=$(cat <<EOF
apiVersion: v1
kind: Service
metadata:
name: helloworld
labels:
app: helloworld
service: helloworld
spec:
ports:
- port: 5000
name: http
selector:
app: helloworld
EOF
)

DEPLOYMENT_YAML=$(cat <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
name: helloworld-${SERVICE_VERSION}
labels:
app: helloworld
version: ${SERVICE_VERSION}
spec:
replicas: 1
selector:
matchLabels:
app: helloworld
version: ${SERVICE_VERSION}
template:
metadata:
labels:
app: helloworld
version: ${SERVICE_VERSION}
spec:
affinity:
nodeAffinity:
requiredDuringSchedulingIgnoredDuringExecution:
nodeSelectorTerms:
- matchExpressions:
- key: topology.istio.io/subzone
operator: In
values:
- ${SERVICE_VERSION}

containers:
- name: helloworld
env:
- name: SERVICE_VERSION
value: ${SERVICE_VERSION}
image: docker.io/istio/examples-helloworld-v1
resources:
requests:
cpu: "100m"
imagePullPolicy: IfNotPresent
ports:
- containerPort: 5000
EOF
)

OUT=""

# Add the service to the output.
if [[ "$INCLUDE_SERVICE" == "true" ]]; then
OUT="${SERVICE_YAML}"
fi

# Add the deployment to the output.
if [[ "$INCLUDE_DEPLOYMENT" == "true" ]]; then
# Add a separator
if [[ -n "$OUT" ]]; then
OUT+="
---
"
fi
OUT+="${DEPLOYMENT_YAML}"
fi

echo "$OUT"
```

执行脚本: for LOC in "beijing" "tianjin" "shenyang"; do ./genHelloWorld.sh --version "LOC"\>"helloworld−LOC" > "helloworld-LOC"\>"helloworld−{LOC}.yaml"; done 将会生成yaml配置清单，应用到集群即可。

kubectl apply -f helloworld-xxx.yaml -n sample

![cke_116.png](/images/jueJin/de63ac9460cb45d.png)

3.2 部署客户端
---------

kubectl apply -f sleep.yaml -n sample

```yaml
# Sleep service
##################################################################################################
apiVersion: v1
kind: ServiceAccount
metadata:
name: sleep
---
apiVersion: v1
kind: Service
metadata:
name: sleep
labels:
app: sleep
service: sleep
spec:
ports:
- port: 80
name: http
selector:
app: sleep
---
apiVersion: apps/v1
kind: Deployment
metadata:
name: sleep
spec:
replicas: 1
selector:
matchLabels:
app: sleep
template:
metadata:
labels:
app: sleep
spec:
terminationGracePeriodSeconds: 0
serviceAccountName: sleep
containers:
- name: sleep
image: curlimages/curl
command: ["/bin/sleep", "infinity"]
imagePullPolicy: IfNotPresent
volumeMounts:
- mountPath: /etc/sleep/tls
name: secret-volume
volumes:
- name: secret-volume
secret:
secretName: sleep-secret
optional: true
---

```

![cke_117.png](/images/jueJin/7c71b64023e44de.png)

查看客户端中的存储的cluster信息

kubectl exec -it sleep-xxx -c istio-proxy -n sample -- curl localhost:15000/clusters可以看到cluster信息中包含了实例的PodIP和位置信息

![cke_118.png](/images/jueJin/d3ab54fef2da4fa.png)

3.3 配置服务端地域故障转移规则
-----------------

istio的流量治理一般都是通过virtualservice、destinationrule 、envoyfilter等来实现，其中地域故障转移是通过destinationrule配置实现的。因为在destinationrule中可以配置outerlineDecetion进行异常点检测，只有检测到异常后，才会进行故障转移。kubectl apply -f xxx.yaml

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
name: helloworld
namespace: sample
spec:
host: helloworld.sample.svc.cluster.local
trafficPolicy:
connectionPool:
http:
maxRequestsPerConnection: 1
loadBalancer:
simple: ROUND_ROBIN
localityLbSetting:  #开启地域负载均衡
enabled: true
failover:         #配置故障转移策略，failover主要控制Region等上层位置的切换
- from: cn-north-4
to: cn-south-1
outlierDetection:    #异常点检测
consecutive5xxErrors: 1
interval: 1s
baseEjectionTime: 1m
```

以上治理策略表示：

*   异常点检测：当某个客户端访问helloworld服务时，客户端对应的envoy会根据本次访问HTTP状态码对转发的服务端进行故障检测，故障检测条件为当发生1次5xx错误时实例就会被隔离1m。
*   故障隔离：当指定region的所有后端实例均不正常，触发故障转移到下一个地域，确保了超出地区边界的故障转移将具有可预测的行为。如果位于cn-north-4 region的实例异常，流量就会发往cn-south-1 region 的实例。

3.4 验证地域负载均衡
------------

通过位于cn-north-4/cn-north-4b/tianjin 的Sleep Pod 多次调用 HelloWorld 服务，均访问成功。

![cke_119.png](/images/jueJin/05ef4877519f4ce.png)

同时可以发现服务端响应的Pod总是同一个

![cke_120.png](/images/jueJin/f595cbdc19d143f.png)

查看sleep实例的proxy日志，通过日志中的%UPSTREAM\_HOST%字段(红框标准)172.16.0.136，可以看到5个请求均被发送到相同的子区域helloworld实例（Pod IP为172.16.0.136）。

![cke_121.png](/images/jueJin/4fc55ac8df1949f.png)

这是因为istio考虑到网络开销，部署在region1/zone1上的sleep实例 大多时候只会访问部署在同Region同Zone的helloworld实例。

3.5 验证地域故障转移
------------

首先模拟故障,通过下述命令 向 enovy 的 admin port 发送请求，关闭envoy的 listener 。enovy 收到请求后，会取消端口监听，不再接收新的连接和请求。

kubectl exec helloworld-tianjin-xxx -n sample -c istio-proxy -- curl -sSL -X POST 127.0.0.1:15000/drain\_listeners

![cke_122.png](/images/jueJin/c86c74a023a2445.png)

再次通过位于cn-north-4/cn-north-4b/tianjin 的Sleep Pod 多次调用 HelloWorld 服务。

![cke_123.png](/images/jueJin/0516bfb0978c40f.png)

可以发现4个请求被以轮询的方式发往cn-north-4/cn-north-4b/beijing 和cn-north-4/cn-north-4b/shenyang的 helloworld实例。以上结果说明，在一个区域的服务实例发生故障时，可根据配置，将请求路由到其它地域的服务实例进行处理，增强服务的可靠性。在实践中可通过From、To 配置region地区信息，控制在不同地区的实例上进行故障转移。

四 备注
====

关于地域负载均衡的配置failover主要控制的是跨region的场景，因为位于region内的zone或者subzone 上的实例默认就可以切换流量。本文档的实践主要是在region内进行操作的，所以不能演示完整的跨地域故障转移。一般也多用在多集群的治理环境中。

![cke_124.png](/images/jueJin/09efd709f90d44a.png)

[**点击关注，第一时间了解华为云新鲜技术~**](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")