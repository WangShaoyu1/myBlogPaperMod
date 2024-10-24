---
author: "MacroZheng"
title: "据说只有高端机器才配运行K8S，网友：1G内存的渣渣跑起来了！"
date: 2021-03-03
description: "记得之前使用Minikube安装K8S的时候，给分3G内存都嫌小！最近发现一个K8S的经量级实现K3S，最低05G内存就能运行起来，安装方便，和K8S用起来区别不大。推荐给大家，希望更多没高端机器的朋友也能够把K8S玩起来！ K3S是一个完全符合Kubernetes的发行版。…"
tags: ["Java","Kubernetes中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:22,comments:3,collects:40,views:3132,"
---
> SpringBoot实战电商项目mall（40k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

记得之前使用Minikube安装K8S的时候，给分3G内存都嫌小！最近发现一个K8S的经量级实现K3S，最低0.5G内存就能运行起来，安装方便，和K8S用起来区别不大。推荐给大家，希望更多没高端机器的朋友也能够把K8S玩起来！

K3S简介
-----

K3S是一个完全符合Kubernetes的发行版。可以使用单一二进制包安装（不到 100MB），安装简单，内存只有一半，最低0.5G内存就能运行。

为什么叫K3S？开发者希望K3S在内存占用方面只有K8S的一半，Kubernetes是一个10个字母的单词，简写为K8S。那么一半大小就是5个字母的单词，简写为K3S。

安装
--

> 使用官方提供的脚本安装十分方便，一个命令即可完成安装！

*   使用脚本安装K3S，同时会安装其他实用程序，包括`kubectl`、`crictl`、`ctr`、`k3s-killall.sh`和`k3s-uninstall.sh`；

```bash
curl -sfL http://rancher-mirror.cnrancher.com/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn sh -
```

*   安装完成后提示如下信息，并且会将K3S注册为Linux中的服务；

```bash
Complete!
[INFO]  Creating /usr/local/bin/kubectl symlink to k3s
[INFO]  Creating /usr/local/bin/crictl symlink to k3s
[INFO]  Skipping /usr/local/bin/ctr symlink to k3s, command exists in PATH at /usr/bin/ctr
[INFO]  Creating killall script /usr/local/bin/k3s-killall.sh
[INFO]  Creating uninstall script /usr/local/bin/k3s-uninstall.sh
[INFO]  env: Creating environment file /etc/systemd/system/k3s.service.env
[INFO]  systemd: Creating service file /etc/systemd/system/k3s.service
[INFO]  systemd: Enabling k3s unit
[INFO]  systemd: Starting k3s
```

*   可以查看下服务的运行状态，此时显示状态为`active`。

```bash
[root@linux-local k3s]# systemctl status k3s
● k3s.service - Lightweight Kubernetes
Loaded: loaded (/etc/systemd/system/k3s.service; enabled; vendor preset: disabled)
Active: active (running) since Thu 2021-01-28 10:18:39 CST; 2min 0s ago
Docs: https://k3s.io
Process: 14983 ExecStartPre=/sbin/modprobe overlay (code=exited, status=0/SUCCESS)
Process: 14981 ExecStartPre=/sbin/modprobe br_netfilter (code=exited, status=0/SUCCESS)
Main PID: 14986 (k3s-server)
Tasks: 71
Memory: 776.3M
```

使用
--

> 我们使用kubectl命令操作K3S与之前操作Minikube中的K8S并没有什么区别，这次还是创建一个Nginx的Deployment，然后通过创建Service将其暴露到外部访问。

### 创建集群

*   由于K3S默认安装了kubectl工具，我们可以直接使用它，比如查看kubectl的版本号；

```bash
kubectl version
``````bash
Client Version: version.Info{Major:"1", Minor:"20", GitVersion:"v1.20.2+k3s1", GitCommit:"1d4adb0301b9a63ceec8cabb11b309e061f43d5f", GitTreeState:"clean", BuildDate:"2021-01-14T23:52:37Z", GoVersion:"go1.15.5", Compiler:"gc", Platform:"linux/amd64"}
Server Version: version.Info{Major:"1", Minor:"20", GitVersion:"v1.20.2+k3s1", GitCommit:"1d4adb0301b9a63ceec8cabb11b309e061f43d5f", GitTreeState:"clean", BuildDate:"2021-01-14T23:52:37Z", GoVersion:"go1.15.5", Compiler:"gc", Platform:"linux/amd64"}
```

*   还可以查看集群详细信息；

```bash
kubectl cluster-info
``````bash
Kubernetes control plane is running at https://127.0.0.1:6443
CoreDNS is running at https://127.0.0.1:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
Metrics-server is running at https://127.0.0.1:6443/api/v1/namespaces/kube-system/services/https:metrics-server:/proxy
```

*   查看集群中的所有Node，可以发现K3S和之前的Minikube一样创建了一个单节点的简单集群。

```bash
kubectl get nodes
``````bash
NAME          STATUS   ROLES                  AGE   VERSION
linux-local   Ready    control-plane,master   11m   v1.20.2+k3s1
```

### 部署应用

*   指定好应用镜像并创建一个Deployment，这里创建一个Nginx应用；

```bash
kubectl create deployment nginx-deployment --image=nginx:1.10
```

*   查看所有Deployment；

```bash
kubectl get deployments
``````bash
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   1/1     1            1           6s
```

### 查看应用

*   查看Pod的详细状态，包括IP地址、占用端口、使用镜像等信息；

```bash
kubectl describe pods
``````bash
Name:         nginx-deployment-597c48c9dd-j49bc
Namespace:    default
Priority:     0
Node:         linux-local/192.168.5.15
Start Time:   Thu, 28 Jan 2021 10:53:14 +0800
Labels:       app=nginx-deployment
pod-template-hash=597c48c9dd
Annotations:  <none>
Status:       Running
IP:           10.42.0.7
IPs:
IP:           10.42.0.7
Controlled By:  ReplicaSet/nginx-deployment-597c48c9dd
Containers:
nginx:
Container ID:   containerd://560bbeefc9c5714b92ae9d0a1305c2b8746082f4aa11791a2b6e1f4288254ef0
Image:          nginx:1.10
Image ID:       docker.io/library/nginx@sha256:6202beb06ea61f44179e02ca965e8e13b961d12640101fca213efbfd145d7575
Port:           <none>
Host Port:      <none>
State:          Running
Started:      Thu, 28 Jan 2021 10:53:16 +0800
Ready:          True
Restart Count:  0
Environment:    <none>
Mounts:
/var/run/secrets/kubernetes.io/serviceaccount from default-token-fnrf7 (ro)
Conditions:
Type              Status
Initialized       True
Ready             True
ContainersReady   True
PodScheduled      True
Volumes:
default-token-fnrf7:
Type:        Secret (a volume populated by a Secret)
SecretName:  default-token-fnrf7
Optional:    false
QoS Class:       BestEffort
Node-Selectors:  <none>
Tolerations:     node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
Type    Reason     Age   From               Message
----    ------     ----  ----               -------
Normal  Scheduled  38s   default-scheduler  Successfully assigned default/nginx-deployment-597c48c9dd-j49bc to linux-local
Normal  Pulled     38s   kubelet            Container image "nginx:1.10" already present on machine
Normal  Created    38s   kubelet            Created container nginx
Normal  Started    37s   kubelet            Started container nginx
```

*   进入容器内部并执行`bash`命令，如果想退出容器可以使用`exit`命令。

```bash
kubectl exec -it nginx-deployment-597c48c9dd-j49bc -- bash
```

### 外部访问应用

*   创建一个Service来暴露`nginx-deployment`这个Deployment：

```bash
kubectl expose deployment/nginx-deployment --name="nginx-service" --type="NodePort" --port=80
```

*   查看所有Service的状态；

```bash
kubectl get services
``````bash
NAME            TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
kubernetes      ClusterIP   10.43.0.1     <none>        443/TCP        77m
nginx-service   NodePort    10.43.29.39   <none>        80:31494/TCP   10s
```

*   在Linux服务器上通过CURL命令即可访问Nginx服务，此时将打印Nginx主页信息；

```bash
curl localhost:31494
```

*   相比Minikube在虚拟机中安装容器化应用，K3S直接在本机上安装，直接打开防火墙端口即可在外部访问；

```bash
# 开启端口
firewall-cmd --zone=public --add-port=31494/tcp --permanent
# 重启防火墙
firewall-cmd --reload
```

*   在外部即可访问Nginx主页，访问地址：[http://192.168.5.15:31494](https://link.juejin.cn?target=http%3A%2F%2F192.168.5.15%3A31494 "http://192.168.5.15:31494")

![](/images/jueJin/5e234c4b589e42a.png)

总结
--

K3S确实是一个很好用的K8S发行版本，不仅安装方便，而且内存占用也降低了。由于直接在本机上安装容器化应用，外部访问也方便了！

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！