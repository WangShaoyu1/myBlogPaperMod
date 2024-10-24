---
author: "MacroZheng"
title: "再见 Jenkins ！几行脚本搞定自动化部署，这款神器有点厉害！"
date: 2021-05-18
description: "在开发或生产环境中，我们经常会搞一套自动化部署方案。比较流行的一种就是Gitlab+Jenkins实现方案，又慢又占资源。最近发现一款神器Drone，轻量级CIDI工具，推荐给大家！"
tags: ["Java","Docker中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:266,comments:27,collects:516,views:34262,"
---
> SpringBoot实战电商项目mall（40k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

在开发或生产环境中，我们经常会搞一套自动化部署方案（俗称一键部署）。比较流行的一种就是Gitlab+Jenkins实现方案，不过这种方案占用内存比较大，没有个8G内存，很难流畅运行，而且部署起来也不快。最近发现一款神器Drone，轻量级CI/DI工具，结合Gogs使用内存占用不到1G，几行脚本就能实现自动化部署，推荐给大家！

Drone简介
-------

Drone是一款基于容器技术的持续集成工具，使用简单的YAML配置文件即可完成复杂的自动化构建、测试、部署任务，在Github上已经有22K+Star。

![](/images/jueJin/7e2b6cbf773f43f.png)

Gogs安装
------

> 我们将使用轻量级的Gogs来搭建Git仓库，这里只是简单说下安装步骤，具体使用可以参考[《Github标星34K+Star，这款开源项目助你秒建Git服务！》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FWYHuAvN1pt_TGkBVWBnPSA "https://mp.weixin.qq.com/s/WYHuAvN1pt_TGkBVWBnPSA")。

*   首先需要下载Gogs的Docker镜像；

```bash
docker pull gogs/gogs
```

*   下载完成后在Docker容器中运行Gogs；

```bash
docker run -p 10022:22 -p 10080:3000 --name=gogs \
-e TZ="Asia/Shanghai" \
-v /mydata/gogs:/data  \
-d gogs/gogs
```

*   Gogs运行成功后，访问Web页面地址并注册账号：[http://192.168.5.78:10080](https://link.juejin.cn?target=http%3A%2F%2F192.168.5.78%3A10080 "http://192.168.5.78:10080")

![](/images/jueJin/8d148e7e43714b1.png)

*   然后将我们的SpringBoot项目`mall-tiny-drone`的源码上传上去即可，项目地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-drone "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-drone")

![](/images/jueJin/760fcf74a98048a.png)

Drone安装
-------

> 接下来我们安装下Drone，不愧是基于容器的CI/DI工具，使用Docker安装很方便！

*   首先下载Drone的Server和Runner的镜像；

```bash
# Drone的Server
docker pull drone/drone:1
# Drone的Runner
docker pull drone-runner-docker:1
```

*   这里有个Server和Runner的概念，我们先来理解下；
    *   Server：为Drone的管理提供了Web页面，用于管理从Git上获取的仓库中的流水线任务。
    *   Runner：一个单独的守护进程，会轮询Server，获取需要执行的流水线任务，之后执行。
*   接下来我们来安装`drone-server`，使用如下命令即可；

```bash
docker run \
-v /mydata/drone:/data \
-e DRONE_AGENTS_ENABLED=true \
-e DRONE_GOGS_SERVER=http://192.168.5.78:10080 \
-e DRONE_RPC_SECRET=dronerpc666 \
-e DRONE_SERVER_HOST=192.168.5.78:3080 \
-e DRONE_SERVER_PROTO=http \
-e DRONE_USER_CREATE=username:macro,admin:true \
-e TZ="Asia/Shanghai" \
-p 3080:80 \
--restart=always \
--detach=true \
--name=drone \
drone/drone:1
```

*   这里的配置参数比较多，下面统一解释下；
    
    *   DRONE\_GOGS\_SERVER：用于配置Gogs服务地址。
    *   DRONE\_RPC\_SECRET：Drone的共享秘钥，用于验证连接到server的rpc连接，server和runner需要提供同样的秘钥。
    *   DRONE\_SERVER\_HOST：用于配置Drone server外部可访问的地址。
    *   DRONE\_SERVER\_PROTO：用于配置Drone server外部可访问的协议，必须是http或https。
    *   DRONE\_USER\_CREATE：创建一个管理员账号，该账号需要在Gogs中注册好。
*   接下来安装`drone-runner-docker`，当有需要执行的任务时，会启动临时的容器来执行流水线任务；
    

```bash
docker run -d \
-v /var/run/docker.sock:/var/run/docker.sock \
-e DRONE_RPC_PROTO=http \
-e DRONE_RPC_HOST=192.168.5.78:3080 \
-e DRONE_RPC_SECRET=dronerpc666 \
-e DRONE_RUNNER_CAPACITY=2 \
-e DRONE_RUNNER_NAME=runner-docker \
-e TZ="Asia/Shanghai" \
-p 3000:3000 \
--restart always \
--name runner-docker \
drone/drone-runner-docker:1
```

*   这里的配置参数比较多，下面统一解释下。
    *   DRONE\_RPC\_PROTO：用于配置连接到Drone server的协议，必须是http或https。
    *   DRONE\_RPC\_HOST：用于配置Drone server的访问地址，runner会连接到server获取流水线任务并执行。
    *   DRONE\_RPC\_SECRET：用于配置连接到Drone server的共享秘钥。
    *   DRONE\_RUNNER\_CAPACITY：限制runner并发执行的流水线任务数量。
    *   DRONE\_RUNNER\_NAME：自定义runner的名称。

Drone使用
-------

*   让我们来访问下Drone的控制台页面，第一次登录需要输入账号密码（在Gogs中注册的账号），访问地址：[http://192.168.5.78:3080/](https://link.juejin.cn?target=http%3A%2F%2F192.168.5.78%3A3080%2F "http://192.168.5.78:3080/")

![](/images/jueJin/73c3719289f0457.png)

*   此时我们在Gogs中的项目会现在在列表中，如果没有的话可以点下`SYNC`按钮；

![](/images/jueJin/773bc38964dd4d9.png)

*   接下来我们需要对仓库进行设置，将仓库设置为`Trusted`（否则Drone创建的容器无法挂载目录到宿主机），最后点击`SAVE`按钮保存；

![](/images/jueJin/7f4d1ac2695246c.png)

*   保存成功后会在Gogs中自动配置一个Web钩子，当我们推送代码到Gogs中去时，会触发这个钩子，然后执行在Drone中的流水线任务；

![](/images/jueJin/9d0b68659dfe46a.png)

*   拉到最下面，我们可以发送一个测试推送，推送成功会显示绿色的√；

![](/images/jueJin/28fac6ed152c46e.png)

*   此时我们在Drone中发现其实流水线执行失败了，那是因为我们在脚本中引用了Secret中的`ssh_password`；

![](/images/jueJin/41f92320621b472.png)

*   在仓库的设置中添加一个Secret即可，Secret是专门用来存储密码的，此密码只能被使用或删除，无法被查看；

![](/images/jueJin/58e53250cb4d428.png)

*   在`ACTIVITY FEED`中使用`RESTART`可以重新执行该流水线，发现已经成功执行。

![](/images/jueJin/11eb59d33ea44b4.png)

编写脚本
----

> 当我们向Git仓库Push代码时，会自动触发Web钩子，然后Drone就会从Git仓库Clone代码，再通过项目目录下的`.drone.yml`配置，执行相应的流水线，接下来我们来看看这个脚本是如何写的。

*   首先我们来了解下在`.drone.yml`中配置的工作流都有哪些操作，看下流程图就知道了；

![](/images/jueJin/10583ed25b5a4e3.png)

*   再来一个完整的`.drone.yml`，配上详细的注解，看下就基本懂了！

```yaml
kind: pipeline # 定义对象类型，还有secret和signature两种类型
type: docker # 定义流水线类型，还有kubernetes、exec、ssh等类型
name: mall-tiny-drone # 定义流水线名称

steps: # 定义流水线执行步骤，这些步骤将顺序执行
- name: package # 流水线名称
image: maven:3-jdk-8 # 定义创建容器的Docker镜像
volumes: # 将容器内目录挂载到宿主机，仓库需要开启Trusted设置
- name: maven-cache
path: /root/.m2 # 将maven下载依赖的目录挂载出来，防止重复下载
- name: maven-build
path: /app/build # 将应用打包好的Jar和执行脚本挂载出来
commands: # 定义在Docker容器中执行的shell命令
- mvn clean package # 应用打包命令
- cp target/mall-tiny-drone-1.0-SNAPSHOT.jar /app/build/mall-tiny-drone-1.0-SNAPSHOT.jar
- cp Dockerfile /app/build/Dockerfile
- cp run.sh /app/build/run.sh

- name: build-start
image: appleboy/drone-ssh # SSH工具镜像
settings:
host: 192.168.5.78 # 远程连接地址
username: root # 远程连接账号
password:
from_secret: ssh_password # 从Secret中读取SSH密码
port: 22 # 远程连接端口
command_timeout: 5m # 远程执行命令超时时间
script:
- cd /mydata/maven/build # 进入宿主机构建目录
- chmod +x run.sh # 更改为可执行脚本
- ./run.sh # 运行脚本打包应用镜像并运行

volumes: # 定义流水线挂载目录，用于共享数据
- name: maven-build
host:
path: /mydata/maven/build # 从宿主机中挂载的目录
- name: maven-cache
host:
path: /mydata/maven/cache
```

*   `run.sh`执行脚本可以实现打包应用和运行容器镜像，之前讲过这里就不再赘述了，具体可以参考[《我常用的自动化部署技巧，贼好用，推荐给大家！》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2F2SnMlzGOl1jAvhWFBfUDoA "https://mp.weixin.qq.com/s/2SnMlzGOl1jAvhWFBfUDoA")，运行成功效果如下。

![](/images/jueJin/b25260d26ade412.png)

总结
--

对比Jenkins复杂的图形化界面操作，Drone使用脚本来定义流水线任务无疑更简单、更直观。Drone更加轻量级，内存占用少且响应速度快！自动化部署要啥Jenkins？直接给Git整个CI/DI功能难道不香么？

参考资料
----

*   官方文档：[docs.drone.io/](https://link.juejin.cn?target=https%3A%2F%2Fdocs.drone.io%2F "https://docs.drone.io/")
*   结合Maven使用：[docs.drone.io/pipeline/ku…](https://link.juejin.cn?target=https%3A%2F%2Fdocs.drone.io%2Fpipeline%2Fkubernetes%2Fexamples%2Flanguage%2Fmaven%2F "https://docs.drone.io/pipeline/kubernetes/examples/language/maven/")
*   结合SSH使用：[plugins.drone.io/appleboy/dr…](https://link.juejin.cn?target=http%3A%2F%2Fplugins.drone.io%2Fappleboy%2Fdrone-ssh%2F "http://plugins.drone.io/appleboy/drone-ssh/")
*   将容器目录挂载到宿主机：[docs.drone.io/pipeline/do…](https://link.juejin.cn?target=https%3A%2F%2Fdocs.drone.io%2Fpipeline%2Fdocker%2Fsyntax%2Fvolumes%2Fhost%2F "https://docs.drone.io/pipeline/docker/syntax/volumes/host/")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-drone "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-drone")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！