---
author: "华为云开发者联盟"
title: "以Java项目为例，实现Jenkins对接CCE Autopilot集群"
date: 2024-07-03
description: "Jenkins是一个 CICD 工具，其masterslave架构非常适合运行分布式构建的可扩展性场景。"
tags: ["Java","容器","Kubernetes中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:1,comments:0,collects:0,views:301,"
---
本文分享自华为云社区[《Jenkins对接CCE autopilot集群实战》](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%2F429591%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs/429591?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")，作者： 可以交个朋友。

一 背景
====

鉴于日趋流行的`serverless`技术架构、以及用户经常谈及的降本的需求。考虑Jenkins主从架构的特性，slave节点可以在工作的时候部署在任意平台上执行master节点下发的任务，因此可以基于CCE Autopilot集群为Jenkins的agent节点设置运行平台。

二 简介
====

*   以java项目为例，完成java 业务从代码拉取、maven编译、构建镜像、推送镜像、修改yaml文件推送到代码仓库等一系列CI流程。
*   jenkins agent容器使用谷歌提供的`Kaniko`镜像

三 操作实践
======

提前安装好jenkis，并配置kubernetes插件。

3.1 配置jenkins连接autopilot集群
--------------------------

创建autopilot集群的连接凭据

`类型`: 选择secret file

`file`: 上传autopilot集群的kubeconfig配置文件

![image.png](/images/jueJin/6a5293aedfa4408.png)

Clouds中配置连接autopilot集群

在系统管理中选择clouds，点击新增

![image.png](/images/jueJin/77a788980697454.png)

`Cloud name`: 自定义即可

`Type`: 选择Kubernetes

![image.png](/images/jueJin/9b53226809734a9.png)

`Kubernetes地址`: 填写autopilot集群的apiserver连接地址

`Kubernetes命名空间`: 动态agent运行的命名空间，可自定义

![image.png](/images/jueJin/8bd8b015e93d42e.png)

`凭据`: 选择步骤1创建的凭据，选择完凭据之后点击测试连接，连接正常就能查看集群版本

`jenkins地址`: jenkins的访问地址

`jenkins通道`: jenkins访问的50000端口，需要创建svc开发该端口

![image.png](/images/jueJin/647eeae7070149e.png)

配置完成，最后保存即可。

3.2 配置pod模板
-----------

在Clouds中选择Pod Templates然后点击创建

![image.png](/images/jueJin/67cc3188303c4b9.png)`名称`: 可自定义

`命名空间`: 选择和Clouds配置一样即可，如:default

`用法`: 默认即可。例如: 只允许运行绑定到这台机器的job

![image.png](/images/jueJin/c1d09942f21845b.png)

配置基础镜像模版

`名称`: 填写jnlp，固定写法

`Docker镜像`: inbound镜像，执行 docker pull jenkins/inbound-agent，然后上传到swr

`工作目录`: 自定义

![image.png](/images/jueJin/939b6fa4c4f7434.png)

配置Maven打包镜像

`名称`: 填写maven，可自定义，写pipeline时会用到

`Docker镜像`: maven镜像，docker pull maven:3.8.1-jdk-8,然后又推送到swr镜像仓库

`工作目录`: 自定义

`运行命令`: sleep

`运行参数`: 9999999

![image.png](/images/jueJin/7d8ae97bacd94cc.png)

配置build镜像任务

`名称`: 填写build,可自定义，写pipeline会用到

`Docker镜像`: kaniko镜像，docker pull aiotceo/kaniko-executor,提前推送到SWR

`工作目录`: 可以自定义

`运行命令`: /busybox/cat

![image.png](/images/jueJin/0ce86d2739c6498.png)

3.3 其他配置
--------

对Maven的打包目录进行缓存

`前提`：需要前提创建一个PVC存储

`申明值`：填写创建的PVC存储名称

`挂载路径`：固定填写/root/.m2

![image.png](/images/jueJin/7e0f469d89814d2.png)

配置拉取镜像的secret

`名称`：固定填写default-secret

![image.png](/images/jueJin/76e69e6bf915441.png)

配置连接swr的secret

登录ECS服务器，配置连接autopilot集群,执行如下代码:

```ini
yum install git -y
kubectl create secret docker-registry swr-secret  \
--docker-server=https://swr.cn-******.com \
--docker-username=***** --docker-password=****** \
--dry-run=client -o json |jq -r  \
'.data.".dockerconfigjson"' |base64 -d > /tmp/config.json
kubectl create secret generic swr-secret --from-file=config.json
```

`docker-server`：填写swr的接口地址

`docker-username`：填写 region@ak，通过AK，SK获取长期登录指令。 例如： cn-north-7@HL9SLYV9UDY428M6TAJ5

`docker-password`：填写SK，通过AK，SK获取长期登录指令。

配置Secret Volume

`Secret名称`: 填写上面生成的secret名字

`挂载路径`: kaniko/.docker,固定写法

![image.png](/images/jueJin/d60640145d5b4f8.png)

3.4 编写pipeline
--------------

```vbnet
def repository_url = "swr.******.com"
def git_repo = "https://******.git"
def app_git_branch = "master"

podTemplate(
inheritFrom: 'agent',
cloud: 'test'
    ) {
        node(POD_LABEL) {
        stage('拉取代码'){‘
        echo "pull clone"'
        git branch: "${app_git_branch}", url: "${git_repo}"
    }
        container('maven'){
            stage('编译打包'){
            echo "build package"
            sh "mvn clean package -DskipTests"
        }
    }
    
        container('build'){
            stage('镜像构建'){
            echo "build images and push images"
            sh "/kaniko/executor -f Dockerfile -c . -d  ${repository_url}/tomcat:${BUILD_ID} --force"
        }
    }
}
}

```

四 结果展示
======

jenkins agent 运行在autopilot 集群中

![image.png](/images/jueJin/ca94b5412311428.png)

推送镜像到SWR镜像仓库中

![image.png](/images/jueJin/5c06033835fd40d.png)

jenkins CI阶段视图如下

![image.png](/images/jueJin/db1c8d12c80d47f.png)

[**点击关注，第一时间了解华为云新鲜技术~**](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")