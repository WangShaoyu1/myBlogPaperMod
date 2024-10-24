---
author: "MacroZheng"
title: "我把SpringBoot应用部署到了K8S上，怎么感觉用起来像Docker！"
date: 2021-02-02
description: "想要把一个复杂的微服务项目部署到K8S上去，首先我们得学会把单个SpringBoot应用部署上去。今天我们来讲下如何把SpringBoot应用部署到K8S上去，和使用Docker Compose部署非常类似，希望对大家有所帮助！ 推送成功以后就可以在Docker Hub中看到镜…"
tags: ["Java","Spring Boot中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:54,comments:7,collects:84,views:11071,"
---
> SpringBoot实战电商项目mall（40k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

想要把一个复杂的微服务项目部署到K8S上去，首先我们得学会把单个SpringBoot应用部署上去。今天我们来讲下如何把SpringBoot应用部署到K8S上去，和使用Docker Compose部署非常类似，希望对大家有所帮助！

学前准备
----

> 学习本文需要有一些K8S基础，对K8S还不了解的朋友可以参考如下的文章。

*   [《K8S太火了！花10分钟玩转它不香么？》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FN-9xVPYO_VVL5JZu5UPbtQ "https://mp.weixin.qq.com/s/N-9xVPYO_VVL5JZu5UPbtQ")
*   [《自从上了K8S，项目更新都不带停机的！》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FdwrxKr4ONfzCLn01QbkpQg "https://mp.weixin.qq.com/s/dwrxKr4ONfzCLn01QbkpQg")

推送镜像到Docker Hub
---------------

> 之前我们都是自建的镜像仓库，这次我们换种方式，把镜像上传到Docker Hub中去。

*   首先我们得注册个Docker Hub的账号，Docker Hub地址：[hub.docker.com/](https://link.juejin.cn?target=https%3A%2F%2Fhub.docker.com%2F "https://hub.docker.com/")

![](/images/jueJin/1b855f7e14b44ab.png)

*   部署应用使用之前的`mall-tiny-fabric`项目，先修改`pom.xml`文件，主要是添加Docker Hub的认证信息和修改下镜像前缀，具体内容如下；

```xml
<configuration>
<!-- Docker 远程管理地址-->
<dockerHost>http://192.168.5.94:2375</dockerHost>
<!-- 添加认证信息-->
<authConfig>
<push>
<!--Docker Hub 用户名-->
<username>macrodocker</username>
<!--Docker Hub 密码-->
<password>xxx</password>
</push>
</authConfig>
<images>
<image>
<!--修改镜像前缀为Docker Hub 用户名-->
<name>macrodocker/${project.name}:${project.version}</name>
</image>
</images>
</configuration>
```

*   修改完成后使用`package`命令先把镜像打包到Linux服务器，再使用`docker:push`命令把镜像推送到Docker Hub中去：

![](/images/jueJin/df4291ce2ef44fa.png)

*   推送成功以后就可以在Docker Hub中看到镜像了。

![](/images/jueJin/30a30615ba36400.png)

应用部署
----

> 接下来我们将把应用部署到K8S上去，包含SpringBoot应用的部署和MySQL的部署。

### 部署MySQL

*   首先添加配置文件`mysql-deployment.yaml`用于创建Deployment，具体说明参考注释即可；

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
# 指定Deployment的名称
name: mysql-deployment
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

*   通过应用配置文件来创建Deployment；

```bash
kubectl apply -f mysql-deployment.yaml
```

*   运行成功后查询Deployment，发现`mysql-deployment`已经就绪；

```bash
[macro@linux-local k8s]$ kubectl get deployments
NAME                      READY   UP-TO-DATE   AVAILABLE   AGE
mysql-deployment          1/1     1            1           38s
nginx-volume-deployment   2/2     2            2           6d5h
```

*   想要其他Pod可以通过服务名称访问MySQL，需要创建Service，添加配置文件`mysql-service.yaml`用于创建Service；

```yaml
apiVersion: v1
kind: Service
metadata:
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

*   通过应用配置文件来创建Service；

```bash
kubectl apply -f mysql-service.yaml
```

*   运行成功后查询Service，发现`mysql-service`已经暴露在Node的`30306`端口上了；

```bash
[macro@linux-local k8s]$ kubectl get services
NAME            TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
kubernetes      ClusterIP   10.96.0.1        <none>        443/TCP          7d23h
mysql-service   NodePort    10.107.189.51    <none>        3306:30306/TCP   7s
nginx-service   NodePort    10.101.171.181   <none>        80:30080/TCP     6d2h
```

*   部署完成后需要新建`mall`数据库，并导入相关表，表地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Fblob%2Fmaster%2Fdocument%2Fsql%2Fmall.sql "https://github.com/macrozheng/mall-learning/blob/master/document/sql/mall.sql")
    
*   这里有个比较简单的方法来导入数据库，通过Navicat创建连接，先配置一个SSH通道；
    

![](/images/jueJin/275417b08a0d4c9.png)

*   之后我们就可以像在Linux服务器上访问数据库一样访问Minikube中的数据库了，直接添加Minikube中数据库IP和端口即可。

![](/images/jueJin/fb0a2be3037e44e.png)

### 部署SpringBoot应用

*   首先添加配置文件`mall-tiny-fabric-deployment.yaml`用于创建Deployment，这里我们可以通过环境变量来覆盖SpringBoot中的默认配置；

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
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

*   通过应用配置文件来创建Deployment；

```bash
kubectl apply -f mall-tiny-fabric-deployment.yaml
```

*   我们可以通过`kubectl logs`命令来查看应用的启动日志；

```bash
[macro@linux-local k8s]$ kubectl get pods
NAME                                           READY   STATUS    RESTARTS   AGE
mall-tiny-fabric-deployment-8684857dff-pnz2t   1/1     Running   0          47s
mysql-deployment-5dccc96ccf-sfxvg              1/1     Running   0          25m
nginx-volume-deployment-6f6c89976d-nv2rn       1/1     Running   4          6d6h
nginx-volume-deployment-6f6c89976d-tmhc5       1/1     Running   4          6d5h
[macro@linux-local k8s]$ kubectl logs -f mall-tiny-fabric-deployment-8684857dff-pnz2t
```

*   如果想要从外部访问SpringBoot应用，需要创建Service，添加配置文件`mall-tiny-fabric-service.yaml`用于创建Service；

```yaml
apiVersion: v1
kind: Service
metadata:
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

*   通过应用配置文件来创建Service；

```bash
kubectl apply -f mall-tiny-fabric-service.yaml
```

*   此时服务已经暴露到了Node的`30180`端口上了；

```bash
[macro@linux-local k8s]$ kubectl get services
NAME                       TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
kubernetes                 ClusterIP   10.96.0.1        <none>        443/TCP          7d23h
mall-tiny-fabric-service   NodePort    10.100.112.84    <none>        8080:30180/TCP   5s
mysql-service              NodePort    10.107.189.51    <none>        3306:30306/TCP   13m
nginx-service              NodePort    10.101.171.181   <none>        80:30080/TCP     6d2h
```

*   在Linux服务器上，我们可以通过`curl`命令来访问下项目的Swagger页面，不过只能查看到返回的一串HTML代码。

```bash
curl $(minikube ip):30180/swagger-ui.html
```

### 外部访问应用

> 由于使用Minikube安装的K8S Node处于Linux服务器的内网环境，无法直接从外部访问，所以我们需要安装一个Nginx反向代理下才能访问。

*   首先我们需要安装Nginx，对Nginx不熟悉的朋友直接参考该文章即可：[《Nginx的这些妙用，你肯定有不知道的！》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2F9VZi2suAlomu1IRGy-qdCA "https://mp.weixin.qq.com/s/9VZi2suAlomu1IRGy-qdCA")
    
*   安装完成后添加一个Nginx的配置文件，这里我的配置路径为`/mydata/nginx/conf/conf.d/`，用于将`mall-tiny.macrozheng.com`域名的访问代理到K8S中的SpringBoot应用中去，`proxy_pass`为上面`curl`使用的路径；
    

```ini
    server {
    listen       80;
    server_name  mall-tiny.macrozheng.com; #修改域名
    
        location / {
        proxy_set_header Host $host:$server_port;
        proxy_pass   http://192.168.49.2:30180; #修改为代理服务地址
        index  index.html index.htm;
    }
    
    error_page   500 502 503 504  /50x.html;
        location = /50x.html {
        root   /usr/share/nginx/html;
    }
    
}
```

*   重启Nginx服务，再修改访问Linux服务器的本机host文件，添加如下记录；

```
192.168.5.94 mall-tiny.macrozheng.com
```

*   之后即可直接在本机上访问K8S上的SpringBoot应用了，访问地址：[mall-tiny.macrozheng.com/swagger-ui.…](https://link.juejin.cn?target=http%3A%2F%2Fmall-tiny.macrozheng.com%2Fswagger-ui.html "http://mall-tiny.macrozheng.com/swagger-ui.html")

![](/images/jueJin/5b164cc6b6d042f.png)

总结
--

通过把SpringBoot应用部署到K8S上的一顿操作，我们可以发现在K8S上部署和在Docker上部署有很多相似之处。K8S上很多部署用的脚本，直接翻译之前使用Docker Compose的脚本即可，非常类似。如果你之前用过Docker，那么你就可以轻松上手K8S！

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-fabric "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-fabric")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！