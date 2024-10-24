---
author: "MacroZheng"
title: "再见命令行！一键部署应用到远程服务器，IDEA官方Docker插件真香！"
date: 2022-06-21
description: "Docker作为目前主流的容器技术，使用它部署应用是非常方便的！最近体验了一把IDEA官方提供的插件，确实非常好用，今天我们以SpringBoot应用的打包部署为例，来聊聊它的使用！"
tags: ["Java","后端","Docker中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:38,comments:3,collects:128,views:5088,"
---
> Docker作为目前主流的容器技术，使用它部署应用是非常方便的！对于这款主流容器技术，IDEA官方自然也是有所支持的。最近体验了一把IDEA官方提供的插件，确实非常好用，今天我们以SpringBoot应用的打包部署为例，来聊聊IDEA官方Docker插件的使用！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

插件启用
----

*   由于该插件为IDEA内置插件，直接在插件设置中启用就好了；

![](/images/jueJin/15f653d93db241b.png)

*   由于我们的Docker环境部署在远程服务器上，还需要配置下Docker的连接信息，在Docker设置里配置即可，看到`连接成功`提示后就表示配置正确了；

![](/images/jueJin/03cb6726f67247b.png)

*   接下来打开IDEA底部的`Services`面板，双击Docker图标进行连接，连接成功后就可以对远程服务器上的Docker容器和镜像进行管理了。

![](/images/jueJin/6f2e6d26fc19411.png)

镜像管理
----

*   点击`Images`按钮，输入需要下载的镜像名称和版本号就可以下载镜像了，这里IDEA还支持自动提示，实在太贴心了！

![](/images/jueJin/36affd5d2cdf4ad.png)

*   右键指定镜像打开菜单，我们还可以对其进行创建容器、查看、删除等常规操作；

![](/images/jueJin/b98fc64159f44df.png)

*   当然我们还可以使用Dockerfile来构建自己的镜像，这里以我的[mall-tiny](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2Fd91L1VRkU2m0sDpBNaJ6iQ "https://mp.weixin.qq.com/s/d91L1VRkU2m0sDpBNaJ6iQ") 脚手架项目为例，首先准备好Dockerfile脚本；

```bash
# 该镜像需要依赖的基础镜像
FROM java:8
# 将当前目录下的jar包复制到docker容器的/目录下
ADD ./mall-tiny-1.0.0-SNAPSHOT.jar /mall-tiny-1.0.0-SNAPSHOT.jar
# 声明服务运行在8080端口
EXPOSE 8080
# 指定docker容器启动时运行jar包
ENTRYPOINT ["java", "-jar","/mall-tiny-1.0.0-SNAPSHOT.jar"]
# 指定维护者的名字
MAINTAINER macrozheng
```

*   然后打开Dockfile文件，点击左侧按钮选择创建新的运行配置；

![](/images/jueJin/76b5be2a0b5a475.png)

*   接下来选择我们配置好的远程Docker服务，配置好应用打包目录及镜像名称；

![](/images/jueJin/60142fbd86b6479.png)

*   然后选择打包镜像，控制台将输出如下日志，jar包会直接上传到远程服务器并打包成镜像。

![](/images/jueJin/63690a5a4ffa43e.png)

容器管理
----

*   右键镜像打开菜单，还可以直接创建容器；

![](/images/jueJin/73fa83ceb5a5480.png)

*   由于mall-tiny项目需要用到mysql和redis服务，我们可以先启动它们；

![](/images/jueJin/f19a69259f5f429.png)

*   然后修改创建容器的配置，主要就是一些之前使用`docker run`命令的指定的一些配置；

![](/images/jueJin/77df71b0000249b.png)

*   大家直接对照下之前使用的`docker run`命令，大概就能知道这些配置的作用了；

```bash
docker run -p 8080:8080 --name mall-tiny \
--link mysql:db \
--link redis:redis \
-e 'spring.profiles.active'=prod \
-v /etc/localtime:/etc/localtime \
-v /mydata/app/mall-tiny/logs:/var/logs \
-d mall-tiny/mall-tiny:1.0.0-SNAPSHOT
```

*   运行过程中可以直接在`Log`标签中查看容器的运行日志，这确实很方便！

![](/images/jueJin/4bb9731b1f5f457.png)

与容器交互
-----

*   通过容器面板我们可以查看到很多容器内部信息，比如查看环境变量；

![](/images/jueJin/040b4c2bbcdb4cf.png)

*   还可以查看容器的端口映射配置；

![](/images/jueJin/4012ff7190b14dd.png)

*   还可以查看之前通过`docker inspect`命令获取的信息，比如查看容器运行的IP地址；

![](/images/jueJin/222bbfd20e504a8.png)

*   还可以直接进入容器内部去执行命令，还记得之前使用的`docker exec -it`命令么。

![](/images/jueJin/8d9dee46165547f.png)

Docker Compose 支持
-----------------

*   使用该插件也可以通过Docker Compose来部署应用，首先创建`docker-compose.yml`文件，由于mysql容器没有使用Docker Compose来创建，这里改用IP来访问；

```ruby
version: '3'
services:
redis:
image: redis:5
container_name: redis-tiny
command: redis-server --appendonly yes
volumes:
- /mydata/redis-tiny/data:/data #数据文件挂载
ports:
- 6379:6379
mall-tiny:
image: mall-tiny/mall-tiny:1.0.0-SNAPSHOT
container_name: mall-tiny
links:
- redis:redis
depends_on:
- redis
ports:
- 8080:8080
environment:
- 'spring.profiles.active=prod'
- 'spring.datasource.url=jdbc:mysql://192.168.3.105:3306/mall_tiny?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&useSSL=false'
- 'spring.redis.host=redis'
volumes:
- /etc/localtime:/etc/localtime
- /mydata/app/mall-tiny/logs:/var/logs
```

*   然后直接点击`docker-compose.yml`文件箭头即可将应用部署到远程服务器，确实很方便！

![](/images/jueJin/0d40ff54e760469.png)

*   部署完成后即可访问项目的Swagger页面，访问地址：[http://192.168.3.105:8080/swagger-ui/](https://link.juejin.cn?target=http%3A%2F%2F192.168.3.105%3A8080%2Fswagger-ui%2F "http://192.168.3.105:8080/swagger-ui/")

![](/images/jueJin/3718fb1e3671453.png)

总结
--

今天体验了一把IDEA的官方Docker插件，不使用命令行就可以实现远程Docker镜像与容器的管理，还支持Docker Compose部署，功能确实很强大！在平时开发过程中，使用这款插件来打包、部署、运行SpringBoot应用确实很方便，感兴趣的小伙伴可以尝试下它！

参考资料
----

官方文档：[www.jetbrains.com/help/idea/d…](https://link.juejin.cn?target=https%3A%2F%2Fwww.jetbrains.com%2Fhelp%2Fidea%2Fdocker.html "https://www.jetbrains.com/help/idea/docker.html")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-tiny "https://github.com/macrozheng/mall-tiny")