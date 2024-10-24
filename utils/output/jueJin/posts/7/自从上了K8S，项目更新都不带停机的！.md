---
author: "MacroZheng"
title: "自从上了K8S，项目更新都不带停机的！"
date: 2021-01-27
description: "如果你看了《Kubernetes太火了！花10分钟玩转它不香么？》一文的话，基本上已经可以玩转K8S了。其实K8S中还有一些高级特性也很值得学习，比如弹性扩缩应用、滚动更新、配置管理、存储卷、网关路由等。今天我们就来了解下这些高级特性，希望对大家有所帮助！ ReplicaSet…"
tags: ["Java","Kubernetes中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:54,comments:3,collects:109,views:11049,"
---
> SpringBoot实战电商项目mall（40k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

如果你看了[《Kubernetes太火了！花10分钟玩转它不香么？》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FN-9xVPYO_VVL5JZu5UPbtQ "https://mp.weixin.qq.com/s/N-9xVPYO_VVL5JZu5UPbtQ")一文的话，基本上已经可以玩转K8S了。其实K8S中还有一些高级特性也很值得学习，比如弹性扩缩应用、滚动更新、配置管理、存储卷、网关路由等。今天我们就来了解下这些高级特性，希望对大家有所帮助！

核心概念
----

> 首先我们先来了解一些核心概念，了解这些核心概念对使用K8S的高级特性很有帮助。

### ReplicaSet

ReplicaSet确保任何时间都有指定数量的Pod副本在运行。通常用来保证给定数量的、完全相同的Pod的可用性。建议使用Deployment来管理ReplicaSet，而不是直接使用ReplicaSet。

### ConfigMap

ConfigMap是一种API对象，用来将非机密性的数据保存到键值对中。使用时，Pod可以将其用作环境变量、命令行参数或者存储卷中的配置文件。使用ConfigMap可以将你的配置数据和应用程序代码分开。

### Volume

Volume指的是存储卷，包含可被Pod中容器访问的数据目录。容器中的文件在磁盘上是临时存放的，当容器崩溃时文件会丢失，同时无法在多个Pod中共享文件，通过使用存储卷可以解决这两个问题。

常用的存储卷有如下几种：

*   configMap：configMap卷提供了向Pod注入配置数据的方法。ConfigMap对象中存储的数据可以被configMap类型的卷引用，然后被Pod中运行的容器化应用使用。
*   emptyDir：emptyDir卷可用于存储缓存数据。当Pod分派到某个Node上时，emptyDir卷会被创建，并且Pod在该节点上运行期间，卷一直存在。当Pod被从节点上删除时emptyDir卷中的数据也会被永久删除。
*   hostPath：hostPath卷能将主机节点文件系统上的文件或目录挂载到你的Pod中。在Minikube中的主机指的是Minikube所在虚拟机。
*   local：local卷所代表的是某个被挂载的本地存储设备，例如磁盘、分区或者目录。local卷只能用作静态创建的持久卷，尚不支持动态配置。
*   nfs：nfs卷能将NFS（网络文件系统）挂载到你的Pod中。
*   persistentVolumeClaim：persistentVolumeClaim卷用来将持久卷（PersistentVolume）挂载到Pod中。持久卷（PV）是集群中的一块存储，可以由管理员事先供应，或者使用存储类（Storage Class）来动态供应，持久卷是集群资源类似于节点。

### Ingress

Ingress类似于K8S中的网关服务，是对集群中服务的外部访问进行管理的API对象，典型的访问方式是HTTP。Ingress可以提供负载均衡、SSL终结和基于名称的虚拟托管。

![](/images/jueJin/24085ae44479449.png)

高级特性
----

### 扩缩应用

> 当流量增加时，我们需要扩容应用程序满足用户需求。当流量减少时，需要缩放应用以减少服务器开销。在K8S中扩缩是通过改变Deployment中的副本数量来实现的。

*   获取所有Deployment可使用如下命令：

```bash
kubectl get deployments
``````bash
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
kubernetes-nginx   1/1     1            1           43h
```

*   获取所有ReplicaSet可使用如下命令：

```bash
kubectl get rs
``````bash
NAME                          DESIRED   CURRENT   READY   AGE
kubernetes-nginx-78bcc44665   1         1         1       43h
```

*   对应用进行扩容操作，扩容到4个实例，再查看所有：

```bash
kubectl scale deployments/kubernetes-nginx --replicas=4
``````bash
[macro@linux-local root]$ kubectl get deployments
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
kubernetes-nginx   4/4     4            4           43h
```

*   查看所有Pod，发现已经有4个运行在不同的IP地址上了；

```bash
kubectl get pods -o wide
``````bash
NAME                                READY   STATUS    RESTARTS   AGE   IP           NODE       NOMINATED NODE   READINESS GATES
kubernetes-nginx-78bcc44665-8fnnn   1/1     Running   2          43h   172.17.0.3   minikube   <none>           <none>
kubernetes-nginx-78bcc44665-dvq4t   1/1     Running   0          84s   172.17.0.8   minikube   <none>           <none>
kubernetes-nginx-78bcc44665-thzg9   1/1     Running   0          84s   172.17.0.7   minikube   <none>           <none>
kubernetes-nginx-78bcc44665-w7xqd   1/1     Running   0          84s   172.17.0.6   minikube   <none>           <none>
```

*   对应用进行缩放操作，缩放到2个实例；

```bash
kubectl scale deployments/kubernetes-nginx --replicas=2
``````bash
NAME                                READY   STATUS    RESTARTS   AGE   IP           NODE       NOMINATED NODE   READINESS GATES
kubernetes-nginx-78bcc44665-8fnnn   1/1     Running   2          44h   172.17.0.3   minikube   <none>           <none>
kubernetes-nginx-78bcc44665-w7xqd   1/1     Running   0          11m   172.17.0.6   minikube   <none>           <none>
```

### 滚动更新

> 滚动更新允许通过使用新的实例逐步更新Pod实例，零停机进行Deployment更新。K8S不仅可以实现滚动更新，还可以支持回滚操作。

*   目前运行了4个Nginx`1.10`版本的实例：

```bash
[macro@linux-local root]$ kubectl get pods
NAME                                READY   STATUS    RESTARTS   AGE
kubernetes-nginx-78bcc44665-8fnnn   1/1     Running   2          44h
kubernetes-nginx-78bcc44665-jpw2g   1/1     Running   0          5s
kubernetes-nginx-78bcc44665-w7xqd   1/1     Running   0          59m
kubernetes-nginx-78bcc44665-xx8s5   1/1     Running   0          5s
```

*   可以通过`kubectl describe`命令来查看镜像版本号：

```bash
[macro@linux-local root]$ kubectl describe pods |grep Image
Image:          nginx:1.10
Image ID:       docker-pullable://nginx@sha256:6202beb06ea61f44179e02ca965e8e13b961d12640101fca213efbfd145d7575
```

*   通过`kubectl set image`命令来更新Nginx镜像的版本号为`1.19`，此时K8S会执行滚动更新，逐步停止`1.10`版本的实例并启动`1.19`版本的实例；

```bash
# 命令格式 kubectl set image Deployment的名称 容器名称=容器镜像:镜像版本号
kubectl set image deployments/kubernetes-nginx nginx=nginx:1.19
``````bash
# 停止1个旧实例并创建2个新实例
NAME                                READY   STATUS              RESTARTS   AGE
kubernetes-nginx-66f67cd758-rbcz5   0/1     ContainerCreating   0          11s
kubernetes-nginx-66f67cd758-s9ck8   0/1     ContainerCreating   0          11s
kubernetes-nginx-78bcc44665-8fnnn   1/1     Running             2          45h
kubernetes-nginx-78bcc44665-jpw2g   0/1     Terminating         0          15m
kubernetes-nginx-78bcc44665-w7xqd   1/1     Running             0          75m
kubernetes-nginx-78bcc44665-xx8s5   1/1     Running             0          15m
# 1个实例已被停止2个新实例仍创建中
NAME                                READY   STATUS              RESTARTS   AGE
kubernetes-nginx-66f67cd758-rbcz5   0/1     ContainerCreating   0          30s
kubernetes-nginx-66f67cd758-s9ck8   0/1     ContainerCreating   0          30s
kubernetes-nginx-78bcc44665-8fnnn   1/1     Running             2          45h
kubernetes-nginx-78bcc44665-w7xqd   1/1     Running             0          75m
kubernetes-nginx-78bcc44665-xx8s5   1/1     Running             0          15m
# 4个新实例均已创建完成
NAME                                READY   STATUS    RESTARTS   AGE
kubernetes-nginx-66f67cd758-jn926   1/1     Running   0          48s
kubernetes-nginx-66f67cd758-rbcz5   1/1     Running   0          3m12s
kubernetes-nginx-66f67cd758-s9ck8   1/1     Running   0          3m12s
kubernetes-nginx-66f67cd758-smr7n   1/1     Running   0          44s
```

*   此时再使用`kubectl describe`命令来查看镜像版本号，发现Nginx已经更新至`1.19`版本：

```bash
[macro@linux-local root]$ kubectl describe pods |grep Image
Image:          nginx:1.19
Image ID:       docker-pullable://nginx@sha256:4cf620a5c81390ee209398ecc18e5fb9dd0f5155cd82adcbae532fec94006fb9
```

*   如果想回滚到原来的版本的话，直接使用`kubectl rollout undo`命令即可。

```bash
kubectl rollout undo deployments/kubernetes-nginx
```

### 配置管理

> ConfigMap允许你将配置文件与镜像文件分离，以使容器化的应用程序具有可移植性。接下来我们演示下如何将ConfigMap的的属性注入到Pod的环境变量中去。

*   添加配置文件`nginx-config.yaml`用于创建ConfigMap，ConfigMap名称为`nginx-config`，配置信息存放在`data`节点下：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
name: nginx-config
namespace: default
data:
nginx-env: test
```

*   应用`nginx-config.yaml`文件创建ConfigMap：

```bash
kubectl create -f nginx-config.yaml
```

*   获取所有ConfigMap：

```bash
kubectl get configmap
``````bash
NAME               DATA   AGE
kube-root-ca.crt   1      2d22h
nginx-config       1      13s
```

*   通过`yaml`格式查看ConfigMap中的内容：

```bash
kubectl get configmaps nginx-config -o yaml
``````yaml
apiVersion: v1
data:
nginx-env: test
kind: ConfigMap
metadata:
creationTimestamp: "2021-01-08T01:49:44Z"
managedFields:
- apiVersion: v1
fieldsType: FieldsV1
fieldsV1:
f:data:
.: {}
f:nginx-env: {}
manager: kubectl-create
operation: Update
time: "2021-01-08T01:49:44Z"
name: nginx-config
namespace: default
resourceVersion: "61322"
uid: a477567f-2aff-4a04-9a49-f19220baf0d3
```

*   添加配置文件`nginx-deployment.yaml`用于创建Deployment，部署一个Nginx服务，在Nginx的环境变量中引用ConfigMap中的属性：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
name: nginx-deployment
labels:
app: nginx
spec:
replicas: 1
selector:
matchLabels:
app: nginx
template:
metadata:
labels:
app: nginx
spec:
containers:
- name: nginx
image: nginx:1.10
ports:
- containerPort: 80
env:
- name: NGINX_ENV # 在Nginx中设置环境变量
valueFrom:
configMapKeyRef:
name: nginx-config # 设置ConfigMap的名称
key: nginx-env # 需要取值的键
```

*   应用配置文件文件创建Deployment：

```bash
kubectl apply -f nginx-deployment.yaml
```

*   创建成功后查看Pod中的环境变量，发现`NGINX_ENV`变量已经被注入了；

```bash
kubectl exec deployments/nginx-deployment -- env
``````bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
HOSTNAME=nginx-deployment-66fcf997c-xxdsb
NGINX_ENV=test
```

### 存储卷使用

> 通过存储卷，我们可以把外部数据挂载到容器中去，供容器中的应用访问，这样就算容器崩溃了，数据依然可以存在。

*   记得之前我们使用Docker部署Nginx的时候，将Nginx的`html、logs、conf`目录从外部挂载到了容器中；

```bash
docker run -p 80:80 --name nginx \
-v /mydata/nginx/html:/usr/share/nginx/html \
-v /mydata/nginx/logs:/var/log/nginx  \
-v /mydata/nginx/conf:/etc/nginx \
-d nginx:1.10
```

*   Minikube可以认为是一台虚拟机，我们可以用Minikube的`ssh`命令来访问它；

```bash
minikube ssh
```

*   Minikube中默认有一个`docker`用户，我们先重置下它的密码；

```bash
sudo passwd docker
```

*   在Minikube中创建`mydata`目录；

```bash
midir /home/docker/mydata
```

*   我们需要把Nginx的数据目录复制到Minikube中去，才能实现目录的挂载，注意docker用户只能修改`/home/docker`目录中的文件，我们通过`scp`命令来复制文件；

```bash
scp -r /home/macro/mydata/nginx docker@192.168.49.2:/home/docker/mydata/nginx
```

*   添加配置文件`nginx-volume-deployment.yaml`用于创建Deployment：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
name: nginx-volume-deployment
labels:
app: nginx
spec:
replicas: 1
selector:
matchLabels:
app: nginx
template:
metadata:
labels:
app: nginx
spec:
containers:
- name: nginx
image: nginx:1.10
ports:
- containerPort: 80
volumeMounts:
- mountPath: /usr/share/nginx/html
name: html-volume
- mountPath: /var/log/nginx
name: logs-volume
- mountPath: /etc/nginx
name: conf-volume
volumes:
- name: html-volume
hostPath:
path: /home/docker/mydata/nginx/html
type: Directory
- name: logs-volume
hostPath:
path: /home/docker/mydata/nginx/logs
type: Directory
- name: conf-volume
hostPath:
path: /home/docker/mydata/nginx/conf
type: Directory
```

*   应用配置文件创建Deployment；

```bash
kubectl apply -f nginx-volume-deployment.yaml
```

*   添加配置文件`nginx-service.yaml`用于创建Service；

```yaml
apiVersion: v1
kind: Service
metadata:
name: nginx-service
spec:
type: NodePort
selector:
app: nginx
ports:
- name: http
protocol: TCP
port: 80
targetPort: 80
nodePort: 30080
```

*   应用配置文件创建Service；

```bash
kubectl apply -f nginx-service.yaml
```

*   查看下Service服务访问端口；

```bash
[macro@linux-local nginx]$ kubectl get services
NAME                      TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
kubernetes                ClusterIP   10.96.0.1       <none>        443/TCP        6d23h
kubernetes-nginx          NodePort    10.106.227.54   <none>        80:30158/TCP   5d22h
nginx-service             NodePort    10.103.72.111   <none>        80:30080/TCP   7s
```

*   通过CURL命令可以访问Nginx首页信息。

```bash
curl $(minikube ip):30080
```

### 网关路由

> Ingress可以作为K8S的网关来使用，能提供服务路由和负载均衡等功能。

*   Minikube默认没有启用Ingress插件，需要手动开启；

```bash
minikube addons enable ingress
```

*   开启Ingress过程中遇到了一个坑，会在验证的时候卡主，其实是Minikube内部无法下载Ingress镜像导致的：

```bash
[macro@linux-local ~]$ minikube addons enable ingress
* Verifying ingress addon...
```

*   解决该问题需要手动下载第三方镜像，并标记为需要的镜像，并重新启用Ingress插件；

```bash
# 查找启动有问题的Pod
kubectl get pods -n kube-system
# 查看启动失败原因
kubectl describe ingress-nginx-controller-xxx -n kube-system
# 连接到Minikube
minikube ssh
# 原来需要下载的镜像（已经无法下载）
docker pull us.gcr.io/k8s-artifacts-prod/ingress-nginx/controller:v0.40.2
# 下载第三方替代镜像（直接去DockerHub官网搜索即可）
docker pull pollyduan/ingress-nginx-controller:v0.40.2
# 修改镜像名称
docker tag pollyduan/ingress-nginx-controller:v0.40.2 us.gcr.io/k8s-artifacts-prod/ingress-nginx/controller:v0.40.2
```

*   重启插件后检查下Ingress是否在运行；

```bash
kubectl get pods -n kube-system
``````bash
NAME                                        READY   STATUS      RESTARTS   AGE
ingress-nginx-admission-create-krpgk        0/1     Completed   0          46h
ingress-nginx-admission-patch-wnxlk         0/1     Completed   3          46h
ingress-nginx-controller-558664778f-wwgws   1/1     Running     2          46h
```

*   添加配置文件`nginx-ingress.yaml`用于创建Ingress；

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
name: nginx-ingress
annotations:
nginx.ingress.kubernetes.io/rewrite-target: /$1
spec:
rules:
- host: nginx-volume.com
http:
paths:
- path: /
pathType: Prefix
backend:
service:
name: nginx-service
port:
number: 80
```

*   应用配置文件创建Ingress；

```bash
kubectl apply -f nginx-ingress.yaml
```

*   查看所有Ingress，此时我们已经可以通过`nginx-volume.com`来访问Pod中运行的Nginx服务了；

```bash
kubectl get ingress
``````bash
NAME            CLASS    HOSTS              ADDRESS        PORTS   AGE
nginx-ingress   <none>   nginx-volume.com   192.168.49.2   80      6s
```

*   需要修改下`host`文件，注意切换到`root`账号后修改：

```bash
# 切换到root用户
su -
# 修改host文件
vi /etc/hosts
# 添加如下记录
192.168.49.2 nginx-volume.com
```

*   最后通过CURL命令可以访问Nginx首页信息。

```bash
curl nginx-volume.com
```

总结
--

通过K8S扩展和管理容器化应用确实十分方便，通过几个命令我们就可以实现零停机更新，出了故障也不怕，一个命令实现回滚。但是大量的命令行操作总显得枯燥无味，要是有个可视化工具可以直接管理K8S就更好了。

参考资料
----

官方文档：[kubernetes.io/zh/docs/hom…](https://link.juejin.cn?target=https%3A%2F%2Fkubernetes.io%2Fzh%2Fdocs%2Fhome%2F "https://kubernetes.io/zh/docs/home/")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！