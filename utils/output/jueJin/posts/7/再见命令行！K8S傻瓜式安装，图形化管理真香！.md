---
author: "MacroZheng"
title: "再见命令行！K8S傻瓜式安装，图形化管理真香！"
date: 2021-02-23
description: "之前我们一直都是使用命令行来管理K8S的，这种做法虽然对程序员来说看起来很炫酷，但有时候用起来还是挺麻烦的。今天我们来介绍一个K8S可视化管理工具Rancher，使用它可以大大减少我们管理K8S的工作量，希望对大家有所帮助！ Rancher是为使用容器的公司打造的容器管理平台。…"
tags: ["Java","Kubernetes中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:110,comments:9,collects:234,views:10540,"
---
> SpringBoot实战电商项目mall（40k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

之前我们一直都是使用命令行来管理K8S的，这种做法虽然对程序员来说看起来很炫酷，但有时候用起来还是挺麻烦的。今天我们来介绍一个K8S可视化管理工具Rancher，使用它可以大大减少我们管理K8S的工作量，希望对大家有所帮助！

Rancher简介
---------

Rancher是为使用容器的公司打造的容器管理平台。Rancher简化了使用K8S的流程，开发者可以随处运行K8S，满足IT需求规范，赋能DevOps团队。

![](/images/jueJin/947a413fb17a4fa.png)

Docker安装
--------

> 虽然Rancher的安装方法有好几种，但是使用Docker来安装无疑是最简单！没有安装Docker的朋友可以先安装下。

*   安装`yum-utils`：

```bash
yum install -y yum-utils device-mapper-persistent-data lvm2
```

*   为yum源添加docker仓库位置：

```bash
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

*   安装Docker：

```bash
yum install docker-ce
```

*   启动Docker：

```bash
systemctl start docker
```

Rancher安装
---------

> 安装完Docker之后，我们就可以开始安装Rancher了。Rancher已经内置K8S，无需再额外安装。就像我们安装好Minikube一样，K8S直接就内置了。

*   首先下载Rancher镜像；

```bash
docker pull rancher/rancher:v2.5-head
```

*   下载完成后运行Rancher容器，Rancher运行起来有点慢需要等待几分钟：

```bash
docker run -p 80:80 -p 443:443 --name rancher \
--privileged \
--restart=unless-stopped \
-d rancher/rancher:v2.5-head
```

*   运行完成后就可以访问Rancher的主页了，第一次需要设置管理员账号密码，访问地址：[https://192.168.5.46](https://link.juejin.cn?target=https%3A%2F%2F192.168.5.46 "https://192.168.5.46")

![](/images/jueJin/5cf6cafc4f3644c.png)

*   设置下Rancher的`Server URL`，一个其他Node都可以访问到的地址，如果我们要安装其他Node的话需要用到它；

![](/images/jueJin/508fd54863394aa.png)

Rancher使用
---------

> 我们首先来简单使用下Rancher。

*   在首页我们可以直接查看所有集群，当前我们只有安装了Rancher的集群；

![](/images/jueJin/9fd989fa604b47a.png)

*   点击集群名称可以查看集群状态信息，也可以点击右上角的按钮来执行`kubectl`命令；

![](/images/jueJin/0cccb1457d9c49f.png)

*   点击仪表盘按钮，我们可以查看集群的Dashboard，这里可以查看的内容就丰富多了，Deployment、Service、Pod信息都可以查看到了。

![](/images/jueJin/a2bfc2acc3b6404.png)

Rancher实战
---------

> 之前我们都是使用命令行的形式操作K8S，这次我们使用图形化界面试试。还是以部署SpringBoot应用为例，不过先得部署个MySQL。

### 部署MySQL

*   首先我们以`yaml`的形式创建Deployment，操作路径为`Deployments->创建->以YAML文件编辑`；

![](/images/jueJin/88b0ca881ec141d.png)

*   Deployment的`yaml`内容如下，注意添加`namespace: default`这行，否则会无法创建；

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
# 指定Deployment的名称
name: mysql-deployment
# 指定Deployment的空间
namespace: default
# 指定Deployment的标签
labels:
app: mysql
spec:
# 指定创建的Pod副本数量
replicas: 1
# 定义如何查找要管理的Pod
selector:
# 管理标签app为mysql的Pod
matchLabels:
app: mysql
# 指定创建Pod的模板
template:
metadata:
# 给Pod打上app:mysql标签
labels:
app: mysql
# Pod的模板规约
spec:
containers:
- name: mysql
# 指定容器镜像
image: mysql:5.7
# 指定开放的端口
ports:
- containerPort: 3306
# 设置环境变量
env:
- name: MYSQL_ROOT_PASSWORD
value: root
# 使用存储卷
volumeMounts:
# 将存储卷挂载到容器内部路径
- mountPath: /var/log/mysql
name: log-volume
- mountPath: /var/lib/mysql
name: data-volume
- mountPath: /etc/mysql
name: conf-volume
# 定义存储卷
volumes:
- name: log-volume
# hostPath类型存储卷在宿主机上的路径
hostPath:
path: /home/docker/mydata/mysql/log
# 当目录不存在时创建
type: DirectoryOrCreate
- name: data-volume
hostPath:
path: /home/docker/mydata/mysql/data
type: DirectoryOrCreate
- name: conf-volume
hostPath:
path: /home/docker/mydata/mysql/conf
type: DirectoryOrCreate
```

*   其实我们也可以通过页面来配置Deployment的属性，如果你对`yaml`中的配置不太熟悉，可以在页面中修改属性并对照下，比如`hostPath.type`这个属性，一看就知道有哪些了；

![](/images/jueJin/49a730ba73f442e.png)

*   之后以`yaml`的形式创建Service，操作路径为`Services->创建->节点端口->以YAML文件编辑`；

![](/images/jueJin/ff0a7ba16c3249d.png)

*   Service的`yaml`内容如下，`namespace`属性不能少；

```yaml
apiVersion: v1
kind: Service
metadata:
# 定义空间
namespace: default
# 定义服务名称，其他Pod可以通过服务名称作为域名进行访问
name: mysql-service
spec:
# 指定服务类型，通过Node上的静态端口暴露服务
type: NodePort
# 管理标签app为mysql的Pod
selector:
app: mysql
ports:
- name: http
protocol: TCP
port: 3306
targetPort: 3306
# Node上的静态端口
nodePort: 30306
```

*   部署完成后需要新建`mall`数据库，并导入相关表，表地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Fblob%2Fmaster%2Fdocument%2Fsql%2Fmall.sql "https://github.com/macrozheng/mall-learning/blob/master/document/sql/mall.sql")
    
*   这里有个比较简单的方法来导入数据库，通过Navicat创建连接，先配置一个SSH通道；
    

![](/images/jueJin/0863f0008253431.png)

*   接下来要获得Rancher容器运行的IP地址（在Minikube中我们使用的使用Minikube的地址）；

```bash
[root@linux-local ~]# docker inspect rancher |grep IPAddress
"SecondaryIPAddresses": null,
"IPAddress": "172.17.0.3",
"IPAddress": "172.17.0.3",
```

*   之后我们就可以像在Linux服务器上访问数据库一样访问Rancher中的数据库了，直接添加Rancher的IP和数据库端口即可。

![](/images/jueJin/9927a1913798497.png)

### 部署SpringBoot应用

*   以`yaml`的形式创建SpringBoot应用的Deployment，操作路径为`Deployments->创建->以YAML文件编辑`，配置信息如下；

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
namespace: default
name: mall-tiny-fabric-deployment
labels:
app: mall-tiny-fabric
spec:
replicas: 1
selector:
matchLabels:
app: mall-tiny-fabric
template:
metadata:
labels:
app: mall-tiny-fabric
spec:
containers:
- name: mall-tiny-fabric
# 指定Docker Hub中的镜像地址
image: macrodocker/mall-tiny-fabric:0.0.1-SNAPSHOT
ports:
- containerPort: 8080
env:
# 指定数据库连接地址
- name: spring.datasource.url
value: jdbc:mysql://mysql-service:3306/mall?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
# 指定日志文件路径
- name: logging.path
value: /var/logs
volumeMounts:
- mountPath: /var/logs
name: log-volume
volumes:
- name: log-volume
hostPath:
path: /home/docker/mydata/app/mall-tiny-fabric/logs
type: DirectoryOrCreate
```

*   以`yaml`的形式创建Service，操作路径为`Services->创建->节点端口->以YAML文件编辑`，配置信息如下；

```yaml
apiVersion: v1
kind: Service
metadata:
namespace: default
name: mall-tiny-fabric-service
spec:
type: NodePort
selector:
app: mall-tiny-fabric
ports:
- name: http
protocol: TCP
port: 8080
targetPort: 8080
# Node上的静态端口
nodePort: 30180
```

*   创建成功后，在Deployments标签中，我们可以发现实例已经就绪了。

![](/images/jueJin/485830d98d5f408.png)

### 外部访问应用

> 依然使用Nginx反向代理的方式来访问SpringBoot应用。

*   由于Rancher服务已经占用了`80`端口，Nginx服务只能重新换个端口了，这里运行在`2080`端口上；

```bash
docker run -p 2080:2080 --name nginx \
-v /mydata/nginx/html:/usr/share/nginx/html \
-v /mydata/nginx/logs:/var/log/nginx  \
-v /mydata/nginx/conf:/etc/nginx \
-d nginx:1.10
```

*   创建完Nginx容器后，添加配置文件`mall-tiny-rancher.conf`，将`mall-tiny.macrozheng.com`域名的访问反向代理到K8S中的SpringBoot应用中去；

```ini
    server {
    listen       2080;
    server_name  mall-tiny.macrozheng.com; #修改域名
    
        location / {
        proxy_set_header Host $host:$server_port;
        proxy_pass   http://172.17.0.3:30180; #修改为代理服务地址
        index  index.html index.htm;
    }
    
    error_page   500 502 503 504  /50x.html;
        location = /50x.html {
        root   /usr/share/nginx/html;
    }
    
}
```

*   再修改访问Linux服务器的本机host文件，添加如下记录；

```
192.168.5.46 mall-tiny.macrozheng.com
```

*   之后即可直接在本机上访问K8S上的SpringBoot应用了，访问地址：[mall-tiny.macrozheng.com:2080/swagger-ui.…](https://link.juejin.cn?target=http%3A%2F%2Fmall-tiny.macrozheng.com%3A2080%2Fswagger-ui.html "http://mall-tiny.macrozheng.com:2080/swagger-ui.html")

![](/images/jueJin/9f7980a85c60426.png)

总结
--

使用Rancher可视化管理K8S还真是简单，大大降低了K8S的部署和管理难度。一个Docker命令即可完成部署，可视化界面可以查看应用运行的各种状态。K8S脚本轻松执行，不会写脚本的图形化界面设置下也能搞定。总结一句：真香！

参考资料
----

Rancher官方文档：[docs.rancher.cn/rancher2/](https://link.juejin.cn?target=https%3A%2F%2Fdocs.rancher.cn%2Francher2%2F "https://docs.rancher.cn/rancher2/")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-fabric "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-fabric")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！