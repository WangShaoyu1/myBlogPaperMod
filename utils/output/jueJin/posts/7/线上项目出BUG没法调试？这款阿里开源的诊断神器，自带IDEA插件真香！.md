---
author: "MacroZheng"
title: "线上项目出BUG没法调试？这款阿里开源的诊断神器，自带IDEA插件真香！"
date: 2022-05-31
description: "最近逛了下Arthas的官网，发现它已经支持直接集成到Spring Boot应用中去，并且还出了专用的IDEA插件。今天我们再来体验下它，看看它的功能是不是更强大了！"
tags: ["Java","后端","Spring Boot中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:158,comments:0,collects:258,views:23012,"
---
> 记得之前写过一篇[Arthas使用教程](https://juejin.cn/post/6846687603471679496 "https://juejin.cn/post/6846687603471679496") ，通过使用Arthas我们既可以实现线上调试，还可以实现热修复。最近逛了下Arthas的官网，发现它已经支持直接集成到SpringBoot应用中去，并且还出了专用的IDEA插件。今天我们再来体验下它，看看它的功能是不是更强大了！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

Arthas简介
--------

Arthas是Alibaba开源的Java诊断利器，深受开发者喜爱，目前在Github上已有`29K+Star`。它采用命令行交互模式，同时提供丰富的 Tab 自动补全功能，进一步方便进行问题的定位和诊断。

![](/images/jueJin/05b44f4eb6df486.png)

ArthasTunnel
------------

> 为了演示一个更加真实的线上环境，接下来我们将对Docker容器中的SpringBoot应用进行诊断。我们将使用`ArthasTunnel`来实现，`ArthasTunnel`相当于一个Web控制台，使用它我们无需进入应用容器即可对应用进行诊断，非常方便。

*   首先我们需要下载`ArthasTunnel`的安装包，下载地址：[github.com/alibaba/art…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Falibaba%2Farthas%2Freleases "https://github.com/alibaba/arthas/releases")

![](/images/jueJin/82489f0828ae4b3.png)

*   由于官方只提供了JAR包，如果你想通过Docker方式启动的话，可以自行打包Docker镜像，打包使用的Dockerfile脚本如下：

```dockerfile
# 该镜像需要依赖的基础镜像
FROM java:8
# 将当前目录下的jar包复制到docker容器的/目录下
ADD arthas-tunnel-server.jar /arthas-tunnel-server.jar
# 声明服务运行的端口
EXPOSE 8080 7777
# 指定docker容器启动时运行jar包
ENTRYPOINT ["java", "-jar","/arthas-tunnel-server.jar"]
# 指定维护者的名字
MAINTAINER macro
```

*   这里再提供一个一键打包运行`ArthasTunnel`容器的执行脚本`run.sh`，脚本内容如下；

```bash
#!/usr/bin/env bash
# 定义应用组名
group_name='mall-tiny'
# 定义应用名称
app_name='arthas-tunnel-server'
# 定义应用版本
app_version='1.0-SNAPSHOT'
echo '----copy jar----'
docker stop ${app_name}
echo '----stop container----'
docker rm ${app_name}
echo '----rm container----'
docker rmi ${group_name}/${app_name}:${app_version}
echo '----rm image----'
# 打包编译docker镜像
docker build -t ${group_name}/${app_name}:${app_version} .
echo '----build image----'
docker run -p 8080:8080 -p 7777:7777 --name ${app_name} \
-e TZ="Asia/Shanghai" \
-v /etc/localtime:/etc/localtime \
-v /mydata/app/${app_name}/logs:/var/logs \
-d ${group_name}/${app_name}:${app_version}
echo '----start container----'
```

*   接下来吧`ArthasTunnel`的JAR包、Dockerfile文件、执行脚本`run.sh`上传到Linux服务器上，然后使用`./run.sh`命令运行即可；

![](/images/jueJin/2563b7b1bc2143a.png)

*   运行成功后，可以直接访问`ArthasTunnel`的Web控制台，访问地址：[http://192.168.3.105:8080](https://link.juejin.cn?target=http%3A%2F%2F192.168.3.105%3A8080 "http://192.168.3.105:8080")

![](/images/jueJin/828a54e3f7fc433.png)

SpringBoot集成
------------

> 在SpringBoot应用中直接集成Arthas并使用，无疑是最方便的，接下来我们将采用此种方法。

*   首先在项目的`pom.xml`中添加如下依赖，可以对比下[Arthas使用教程](https://juejin.cn/post/6846687603471679496 "https://juejin.cn/post/6846687603471679496") 中的使用方法，直接集成确实简单不少；

```xml
<!--集成Java诊断利器Arthas-->
<dependency>
<groupId>com.taobao.arthas</groupId>
<artifactId>arthas-spring-boot-starter</artifactId>
<version>3.6.1</version>
</dependency>
```

*   然后修改配置文件`application.yml`，记住这个`agent-id`，`ArthasTunnel`连接需要使用，由于我们将会把应用容器通过`--link`的方式连接到`ArthasTunnel`容器，这里的`tunnel-server`按下面进行配置；

```yaml
management:
endpoints:
web:
exposure:
# 暴露端点`/actuator/arthas`
include: 'arthas'
arthas:
agent-id: mall-tiny-arthas
tunnel-server: ws://arthas-tunnel-server:7777/ws
```

*   接下来通过之前的Dockerfile和`run.sh`打包应用，`run.sh`与之前对比，只多了一行通过`--link`连接到`ArthasTunnel`容器的命令；

![](/images/jueJin/68a03df7d60b48f.png)

*   打包使用的Dockerfile和运行脚本`run.sh`都已经包含在示例代码中了，结构如下；

![](/images/jueJin/1321e5f4ae99448.png)

*   接下来在`ArthasTunnel`的Web控制台中输入`AgentId`为`mall-tiny-arthas`，并点击`Connect`按钮即可开始诊断Java应用了；

![](/images/jueJin/64c40fcfac224f1.png)

*   比如通过`dashboard`命令来显示当前系统的实时数据面板，包括线程信息、JVM内存信息及JVM运行时参数；

![](/images/jueJin/ebe912e2acd14a3.png)

*   再比如说使用`thread`命令查看当前线程信息，查看线程的堆栈，可以找出当前最占CPU的线程；

![](/images/jueJin/d7459232e8c34bc.png)

*   当然Arthas的功能非常强大，远不止这些，支持动态修改日志和热更新等，具体可以参考[Arthas使用教程](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FUXtSpRR82uMpeTAjRR10wg "https://mp.weixin.qq.com/s/UXtSpRR82uMpeTAjRR10wg") 。

IDEA插件
------

> 由于Arthas的功能很强大，需要记住的命令很多，有时候实在记不住，于是有了这款IDEA插件，该插件主要用于帮助生成Arthas命令。

*   直接在IDEA的插件市场搜索`arthas`即可找到该插件，然后点击安装即可；

![](/images/jueJin/90da78a8cb66441.png)

*   安装完成后我们来聊聊如何使用，比如当我们觉得线上代码和预期不一致，可以使用`jad`命令反编译下看看，直接选择类，右键选择Arthas命令然后选择Jad反编译；

![](/images/jueJin/bc27a8310f62496.png)

*   此时将会直接把命令拷贝到剪切板，然后到`ArthasTunnel`右键粘贴即可使用，比手打命令简单多了吧！

![](/images/jueJin/e1fc68408ebe481.png)

*   如果你想观察方法执行过程中的参数和返回值，可以使用`watch`命令，选择需要观察的方法右键选择即可；

![](/images/jueJin/63eb4edeb1b24ff.png)

*   这里观察下Controller中的方法的执行过程；

![](/images/jueJin/ff6b4c05b14640e.png)

*   我们还可单独修改某个类的日志级别，选中类名后右键选择`logger`命令；

![](/images/jueJin/a0cf6ae54753435.png)

*   先拷贝下`logger sc`命令查看下当前类的日志级别为`INFO`；

![](/images/jueJin/9dd1c633c22243f.png)

*   拷贝下ClassLoader的Hash值，这里由于在Linux中`Ctrl+C`键有冲突，使用`Ctrl+Insert`组合来拷贝；

![](/images/jueJin/848ed03250bb479.png)

*   接下来输入ClassLoader的Hash值，修改下日志级别，然后拷贝修改日志级别的命令；

![](/images/jueJin/cd87844bcf334e1.png)

*   执行完后再查看下日志级别，已经被改为了`DEBUG`级别

![](/images/jueJin/04aa9195107a48c.png)

总结
--

今天体验了一把新版的Arthas，搭配ArthasTunnel和IDEA插件使用，确实非常方便！并且它还能和SpringBoot无缝集成，确实非常给力，更多Arthas的使用可以参考[Arthas使用教程](https://juejin.cn/post/6846687603471679496 "https://juejin.cn/post/6846687603471679496") 。

参考资料
----

*   项目官网：[github.com/alibaba/art…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Falibaba%2Farthas "https://github.com/alibaba/arthas")
*   Arthas官方文档：[arthas.aliyun.com/doc/index.h…](https://link.juejin.cn?target=https%3A%2F%2Farthas.aliyun.com%2Fdoc%2Findex.html "https://arthas.aliyun.com/doc/index.html")
*   IDEA插件使用文档：[www.yuque.com/arthas-idea…](https://link.juejin.cn?target=https%3A%2F%2Fwww.yuque.com%2Farthas-idea-plugin "https://www.yuque.com/arthas-idea-plugin")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-arthas2 "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-arthas2")