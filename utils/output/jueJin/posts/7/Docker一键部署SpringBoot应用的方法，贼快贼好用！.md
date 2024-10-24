---
author: "MacroZheng"
title: "Docker一键部署SpringBoot应用的方法，贼快贼好用！"
date: 2021-04-20
description: "在《Gradle真能干掉Maven？今天体验了一把，贼爽！》一文中我们讲到了使用Gradle来构建SpringBoot应用，这两天又发现个Gradle插件，支持一键打包、推送Docker镜像。"
tags: ["Java","后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:23,comments:5,collects:49,views:5415,"
---
> SpringBoot实战电商项目mall（40k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

在[《Gradle真能干掉Maven？今天体验了一把，贼爽！》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2Fv14Vdze8IGRr0zQPaQZ2uw "https://mp.weixin.qq.com/s/v14Vdze8IGRr0zQPaQZ2uw")一文中我们讲到了使用Gradle来构建SpringBoot应用，这两天又发现个Gradle插件，支持一键打包、推送Docker镜像。今天我们来讲讲这个插件，希望对大家有所帮助！

Gradle Docker Plugin 简介
-----------------------

一款可以通过远程API管理Docker镜像和容器的插件，专为Java应用打造，原生支持SpringBoot。

使用该插件具有如下特性：

*   与构建工具Gradle及其DSL无缝集成。
*   在幕后处理Docker客户端和守护程序之间的复杂通信逻辑。
*   简化了复杂工作流程的定义。
*   最大程度地减少构建脚本的编写逻辑。

该插件由以下三个插件组成：

*   `com.bmuschko.docker-remote-api`：提供自定义任务，可以通过远程API与Docker进行交互。
*   `com.bmuschko.docker-java-application`：为Java应用创建并推送Docker镜像。
*   `com.bmuschko.docker-spring-boot-application`：为SpringBoot应用创建并推送Docker镜像。

操作镜像
----

> 还是以我的脚手架项目`mall-tiny`为例，让我们来看看使用该插件打包推送Docker镜像是不是够快够简单！

### 构建镜像

*   要使用该插件，我们需要在`build.gradle`中进行如下配置，这里选择使用远程API插件和SpringBoot插件；

```groovy
    plugins {
    id 'com.bmuschko.docker-remote-api' version '6.7.0'
    id 'com.bmuschko.docker-spring-boot-application' version '6.7.0'
}
```

*   然后在`ext`节点下面定义一个常量，这里定义好了镜像仓库地址，方便我们之后引用；

```groovy
    ext{
    registryUrl='192.168.5.78:5000'
}
```

*   接下来就是非常重要的插件配置了，配置好Docker远程API的访问路径，还有SpringBoot应用镜像相关配置；

```groovy
    docker {
    url = 'tcp://192.168.5.78:2375'
        springBootApplication {
        baseImage = 'java:8'
        maintainer = 'macrozheng'
    ports = [8080]
images = ["${registryUrl}/mall-tiny/${rootProject.name}:${version}"]
jvmArgs = ['-Dspring.profiles.active=prod']
}
}
```

*   接下来我们来解读下这些配置到底有什么作用；

属性

类型

作用

url

String

Docker远程API访问路径

baseImage

String

SpringBoot应用使用的基础镜像

maintainer

String

项目维护者

ports

List

镜像暴露的端口

images

Set

打包推送的镜像名称

jvmArgs

List

Java应用运行时的JVM参数

*   接下来我们直接在IDEA中使用`dockerBuildImage`命令，即可将应用镜像打包到远程服务器上去；

![](/images/jueJin/13f6eff6f17d4c9.png)

*   让我们看下控制台输出的日志，其实就是给我们默认创建了一个Dockerfile（连Dockerfile都省的写了），然后用它来打包Docker镜像；

```bash
> Task :dockerBuildImage
Building image using context 'I:\developer\gitee\mall-tiny-gradle\build\docker'.
Using images '192.168.5.78:5000/mall-tiny/mall-tiny:1.0.0-SNAPSHOT'.
Step 1/8 : FROM java:8
---> d23bdf5b1b1b
Step 2/8 : LABEL maintainer=macrozheng
---> Running in 9a63f56a03ae
Removing intermediate container 9a63f56a03ae
---> ed45af8fff90
Step 3/8 : WORKDIR /app
---> Running in 8bd4b513eb23
Removing intermediate container 8bd4b513eb23
---> d27759d1d7df
Step 4/8 : COPY libs libs/
---> 84c3a983972a
Step 5/8 : COPY resources resources/
---> c8a27f3475fc
Step 6/8 : COPY classes classes/
---> 3a76a8efc02b
Step 7/8 : ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-cp", "/app/resources:/app/classes:/app/libs/*", "com.macro.mall.tiny.MallTinyApplication"]
---> Running in e56ae56fd6eb
Removing intermediate container e56ae56fd6eb
---> 22d73f95e756
Step 8/8 : EXPOSE 8080
---> Running in b21d898456cb
Removing intermediate container b21d898456cb
---> 73684cf8c643
Successfully built 73684cf8c643
Successfully tagged 192.168.5.78:5000/mall-tiny/mall-tiny:1.0.0-SNAPSHOT
Created image with ID '73684cf8c643'.

BUILD SUCCESSFUL in 34s
5 actionable tasks: 5 executed
10:56:15: Task execution finished 'dockerBuildImage'.
```

*   在项目的`build\docker`文件夹下可以发现这个Dockerfile，具体内容如下：

```dockerfile
FROM java:8
LABEL maintainer=macrozheng
WORKDIR /app
COPY libs libs/
COPY resources resources/
COPY classes classes/
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-cp", "/app/resources:/app/classes:/app/libs/*", "com.macro.mall.tiny.MallTinyApplication"]
EXPOSE 8080
```

*   打包完镜像之后，直接使用如下命令即可运行项目，注意安装好MySQL和Redis。

```bash
docker run -p 8080:8080 --name mall-tiny \
--link mysql:db \
--link redis:redis \
-v /etc/localtime:/etc/localtime \
-v /mydata/app/mall-tiny/logs:/var/logs \
-d 192.168.5.78:mall-tiny/mall-tiny:1.0.0-SNAPSHOT
```

### 推送镜像

*   接下来我们试试推送镜像功能，不过首先需要安装一个镜像仓库，安装可视化镜像仓库可以参考[《还在手动部署SpringBoot应用？试试这个自动化插件！》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2F3X6vVdWmjmWCyiLm35jpVw "https://mp.weixin.qq.com/s/3X6vVdWmjmWCyiLm35jpVw")；
    
*   推送镜像也是非常简单的，直接在IDEA中使用`dockerPushImage`命令即可；
    

![](/images/jueJin/c7a1f39f5d2242e.png)

*   推送完成后，在我们的可视化镜像仓库中就可以看到该镜像了。

![](/images/jueJin/5d0a93d381d8492.png)

对比Maven
-------

> 我们通过把项目clean以后再打包成Docker镜像，对比下使用Gradle和Maven的速度。

*   使用Gradle进行clean并构建Docker镜像，耗时`30s`；

![](/images/jueJin/8f1867241bfd4f0.png)

*   使用Maven进行clean并构建Docker镜像，耗时`58s`，果然Gradle还是能比Maven快一倍的！

![](/images/jueJin/fdc91093b76b410.png)

总结
--

今天我们体验了一把Gradle和Docker结合使用，发现真是够快够简单。对比Maven速度快了一倍，内置了Dockerfile，大大降低了配置难度。

参考资料
----

官方文档：[bmuschko.github.io/gradle-dock…](https://link.juejin.cn?target=https%3A%2F%2Fbmuschko.github.io%2Fgradle-docker-plugin%2F "https://bmuschko.github.io/gradle-docker-plugin/")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-tiny%2Ftree%2Fgradle "https://github.com/macrozheng/mall-tiny/tree/gradle")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！