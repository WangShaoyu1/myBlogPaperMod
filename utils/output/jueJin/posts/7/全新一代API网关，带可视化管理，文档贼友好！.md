---
author: "MacroZheng"
title: "全新一代API网关，带可视化管理，文档贼友好！"
date: 2021-07-06
description: "推荐一款功能强大的API网关`apisix`，自带可视化管理功能，多达三十种插件支持，希望对大家有所帮助！"
tags: ["Java","后端","GitHub中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:88,comments:15,collects:175,views:14965,"
---
> SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

提到API网关，大家比较熟悉的有Spring Cloud体系中的Gateway和Zuul，这些网关在使用的时候基本都要修改配置文件或自己开发功能。今天给大家介绍一款功能强大的API网关`apisix`，自带可视化管理功能，多达三十种插件支持，希望对大家有所帮助！

简介
--

apisix是一款云原生微服务API网关，可以为API提供终极性能、安全性、开源和可扩展的平台。apisix基于Nginx和etcd实现，与传统API网关相比，apisix具有动态路由和插件热加载，特别适合微服务系统下的API管理。

![](/images/jueJin/6290719135f74b3.png)

核心概念
----

> 我们先来了解下apisix的一些核心概念，对我们接下来的使用会很有帮助！

*   上游（Upstream）：可以理解为虚拟主机，对给定的多个目标服务按照配置规则进行负载均衡。
*   路由（Route）：通过定义一些规则来匹配客户端的请求，然后对匹配的请求执行配置的插件，并把请求转发给指定的上游。
*   消费者（Consumer）：作为API网关，有时需要知道API的消费方具体是谁，通常可以用来做身份认证。
*   服务（Service）： 可以理解为一组路由的抽象。它通常与上游是一一对应的，路由与服务之间，通常是多对一的关系。
*   插件（Plugin）：API网关对请求的增强操作，可以对请求增加限流、认证、黑名单等一系列功能。可以配置在消费者、服务和路由之上。

安装
--

> 由于官方提供了Docker Compose部署方案，只需一个脚本即可安装apisix的相关服务，非常方便，这里我们也采用这种方案来部署。

*   首先下载`apisix-docker`项目，其实我们只需要使用其中的`example`目录就行了，下载地址：[github.com/apache/apis…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fapache%2Fapisix-docker "https://github.com/apache/apisix-docker")

![](/images/jueJin/32e912efec014a9.png)

*   接下来我们把`example`目录上传到Linux服务器上去，来了解下这个目录里面的东西；

```bash
drwxrwxrwx. 2 root root   25 Jun 19 10:12 apisix_conf   # apisix配置文件目录
drwxrwxrwx. 2 root root   71 Jun 24 09:36 apisix_log    # apisix日志文件目录
drwxrwxrwx. 2 root root   23 Jun 23 17:10 dashboard_conf  # 可视化工具apisix-dashboard配置文件目录
-rwxrwxrwx. 1 root root 1304 Jun 19 10:12 docker-compose-alpine.yml # docker-compose 部署脚本（alpine）版本
-rwxrwxrwx. 1 root root 1453 Jun 19 10:12 docker-compose.yml # docker-compose 部署脚本
drwxrwxrwx. 2 root root   27 Jun 19 10:12 etcd_conf # ectd配置文件目录
drwxrwxrwx. 3 root root   31 Jun 23 17:06 etcd_data # ectd数据目录
drwxrwxrwx. 2 root root  107 Jun 19 10:12 mkcert
drwxrwxrwx. 2 root root   40 Jun 19 10:12 upstream # 两个测试用的Nginx服务配置
```

*   从`docker-compose.yml`中我们可以发现，该脚本不仅启动了apisix、apisix-dashboard、etcd这三个核心服务，还启动了两个测试用的Nginx服务；

```yaml
version: "3"

services:
# 可视化管理工具apisix-dashboard
apisix-dashboard:
image: apache/apisix-dashboard:2.7
restart: always
volumes:
- ./dashboard_conf/conf.yaml:/usr/local/apisix-dashboard/conf/conf.yaml
ports:
- "9000:9000"
networks:
apisix:

# 网关apisix
apisix:
image: apache/apisix:2.6-alpine
restart: always
volumes:
- ./apisix_log:/usr/local/apisix/logs
- ./apisix_conf/config.yaml:/usr/local/apisix/conf/config.yaml:ro
depends_on:
- etcd
##network_mode: host
ports:
- "9080:9080/tcp"
- "9443:9443/tcp"
networks:
apisix:

# apisix配置数据存储etcd
etcd:
image: bitnami/etcd:3.4.15
user: root
restart: always
volumes:
- ./etcd_data:/bitnami/etcd
environment:
ETCD_ENABLE_V2: "true"
ALLOW_NONE_AUTHENTICATION: "yes"
ETCD_ADVERTISE_CLIENT_URLS: "http://0.0.0.0:2379"
ETCD_LISTEN_CLIENT_URLS: "http://0.0.0.0:2379"
ports:
- "2379:2379/tcp"
networks:
apisix:

# 测试用nginx服务web1，调用返回 hello web1
web1:
image: nginx:1.19.0-alpine
restart: always
volumes:
- ./upstream/web1.conf:/etc/nginx/nginx.conf
ports:
- "9081:80/tcp"
environment:
- NGINX_PORT=80
networks:
apisix:

# 测试用nginx服务web2，调用返回 hello web2
web2:
image: nginx:1.19.0-alpine
restart: always
volumes:
- ./upstream/web2.conf:/etc/nginx/nginx.conf
ports:
- "9082:80/tcp"
environment:
- NGINX_PORT=80
networks:
apisix:

networks:
apisix:
driver: bridge
```

*   在`docker-compose.yml`文件所在目录下，使用如下命令可以一次性启动所有服务；

```bash
docker-compose -p apisix-docker up -d
```

*   启动成功后，使用如下命令可查看所有服务的运行状态；

```bash
docker-compose -p apisix-docker ps
``````bash
Name                            Command               State                       Ports
--------------------------------------------------------------------------------------------------------------------------
apisix-docker_apisix-dashboard_1   /usr/local/apisix-dashboar ...   Up      0.0.0.0:9000->9000/tcp
apisix-docker_apisix_1             sh -c /usr/bin/apisix init ...   Up      0.0.0.0:9080->9080/tcp, 0.0.0.0:9443->9443/tcp
apisix-docker_etcd_1               /opt/bitnami/scripts/etcd/ ...   Up      0.0.0.0:2379->2379/tcp, 2380/tcp
apisix-docker_web1_1               /docker-entrypoint.sh ngin ...   Up      0.0.0.0:9081->80/tcp
apisix-docker_web2_1               /docker-entrypoint.sh ngin ...   Up      0.0.0.0:9082->80/tcp
```

*   接下来就可以通过可视化工具来管理apisix了，登录账号密码为`admin:admin`，访问地址：[http://192.168.5.78:9000/](https://link.juejin.cn?target=http%3A%2F%2F192.168.5.78%3A9000%2F "http://192.168.5.78:9000/")

![](/images/jueJin/bdfe7a0d4a644c7.png)

*   登录之后看下界面，还是挺漂亮的，apisix搭建非常简单，基本无坑；

![](/images/jueJin/537cd098c0e44cf.png)

*   还有两个测试服务，`web1`访问地址：[http://192.168.5.78:9081/](https://link.juejin.cn?target=http%3A%2F%2F192.168.5.78%3A9081%2F "http://192.168.5.78:9081/")

![](/images/jueJin/0f1e55cbb56e436.png)

*   另一个测试服务`web2`访问地址：[http://192.168.5.78:9082/](https://link.juejin.cn?target=http%3A%2F%2F192.168.5.78%3A9082%2F "http://192.168.5.78:9082/")

![](/images/jueJin/1aa90680ff14419.png)

使用
--

> apisix作为新一代的网关，不仅支持基本的路由功能，还提供了丰富的插件，功能非常强大。

### 基本使用

> 我们先来体验下apisix的基本功能，之前已经启动了两个Nginx测试服务`web1`和`web2`，接下来我们将通过apisix的路由功能来访问它们。

*   首先我们需要创建上游（Upstream），上游相当于虚拟主机的概念，可以对真实的服务提供负载均衡功能；

![](/images/jueJin/7e7e353cd993485.png)

*   创建`web1`的上游，设置好名称、负载均衡算法和目标节点信息；

![](/images/jueJin/03ca404e2c4a472.png)

*   再按照上述方法创建`web2`的上游，创建完成后上游列表显示如下；

![](/images/jueJin/9285d44f69844ad.png)

*   再创建`web1`的路由（Route），路由可以用于匹配客户端的请求，然后转发到上游；

![](/images/jueJin/34827d29dc3f475.png)

*   再选择好路由的上游为`web1`；

![](/images/jueJin/d1c90c8b6de94d2.png)

*   接下来选择需要应用到路由上的插件，apisix的插件非常丰富，多达三十种，作为基本使用，我们暂时不选插件；

![](/images/jueJin/144c12a591a746e.png)

*   再创建`web2`的路由，创建完成后路由列表显示如下；

![](/images/jueJin/17e3003d3fba48a.png)

*   接下来我们通过apisix网关访问下`web1`服务：[http://192.168.5.78:9080/web1/](https://link.juejin.cn?target=http%3A%2F%2F192.168.5.78%3A9080%2Fweb1%2F "http://192.168.5.78:9080/web1/")

![](/images/jueJin/8dc4faa6e921485.png)

*   接下来我们通过apisix网关访问下`web2`服务：[http://192.168.5.78:9080/web2/](https://link.juejin.cn?target=http%3A%2F%2F192.168.5.78%3A9080%2Fweb2%2F "http://192.168.5.78:9080/web2/")

![](/images/jueJin/6e6d0a44c94c4b6.png)

### 进阶使用

> apisix通过启用插件，可以实现一系列丰富的功能，下面我们来介绍几个实用的功能。

#### 身份认证

> 使用JWT来进行身份认证是一种非常流行的方式，这种方式在apisix中也是支持的，可以通过启用`jwt-auth`插件来实现。

*   首先我们需要创建一个消费者对象（Consumer）；

![](/images/jueJin/551f8ab4ee28405.png)

*   然后在插件配置中启用`jwt-auth`插件；

![](/images/jueJin/87db7687256f420.png)

*   启用插件时配置好插件的`key`和`secret`；

![](/images/jueJin/4107b59d41734fd.png)

*   创建成功后消费者列表时显示如下；

![](/images/jueJin/83dbc0f4c599415.png)

*   之后再创建一个路由，路由访问路径匹配`/auth/*`，只需启用`jwt-auth`插件即可；

![](/images/jueJin/14afaec76c67477.png)

*   访问接口获取生成好的JWT Token，需要添加两个参数，`key`为JWT插件中配置的key，`payload`为JWT中存储的自定义负载数据，JWT Token生成地址：[http://192.168.5.78:9080/apisix/plugin/jwt/sign](https://link.juejin.cn?target=http%3A%2F%2F192.168.5.78%3A9080%2Fapisix%2Fplugin%2Fjwt%2Fsign "http://192.168.5.78:9080/apisix/plugin/jwt/sign")

![](/images/jueJin/d60ba76976bc42a.png)

*   不添加JWT Token访问路由接口，会返回401，接口地址：[http://192.168.5.78:9080/auth/](https://link.juejin.cn?target=http%3A%2F%2F192.168.5.78%3A9080%2Fauth%2F "http://192.168.5.78:9080/auth/")

![](/images/jueJin/feb4f6c9df5d42d.png)

*   在请求头`Authorization`中添加JWT Token后即可正常访问；

![](/images/jueJin/e1bd5f941770418.png)

*   当然apisix支持的身份认证并不只这一种，还有下面几种。

![](/images/jueJin/88b422d2b67b431.png)

#### 限流功能

> 有时候我们需要对网关进行限流操作，比如每个客户端IP在30秒内只能访问2次接口，可以通过启用`limit-count`插件来实现。

*   我们在创建路由的时候可以选择配置`limit-count`插件；

![](/images/jueJin/f8d64e0fc665446.png)

*   然后对`limit-count`插件进行配置，根据`remote_addr`进行限流；

![](/images/jueJin/1977b4b185874d7.png)

*   当我们在30秒内第3次调用接口时，apisix会返回503来限制我们的调用。

![](/images/jueJin/6be02a0d1c754bd.png)

#### 跨域支持

> 如果你想让网关支持跨域访问的话，可以通过启用`cors`插件来实现。

*   我们在创建路由的时候可以选择配置`cors`插件；

![](/images/jueJin/16ccd84db158432.png)

*   然后对`cors`插件进行配置，配置好跨域访问策略；

![](/images/jueJin/6d0b9bc25080437.png)

*   调用接口测试可以发现接口已经返回了CORS相关的请求头。

![](/images/jueJin/5821704dbea0486.png)

总结
--

体验了一把apisix这个全新一代的API网关，有可视化管理的网关果然不一样，简单易用，功能强大！如果你的微服务是云原生的话，可以试着用它来做网关。

其实apisix并不是个小众框架，很多国内外大厂都在使用了，如果你想知道哪些公司在使用，可以参考下面的连接。

[github.com/apache/apis…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fapache%2Fapisix%2Fblob%2Fmaster%2Fpowered-by.md "https://github.com/apache/apisix/blob/master/powered-by.md")

参考资料
----

apisix的官方文档非常友好，支持中文，简直是业界良心！过一遍官方文档基本就能掌握apisix了。

![](/images/jueJin/17a59c6d8623400.png)

官方文档：[apisix.apache.org/zh/docs/api…](https://link.juejin.cn?target=https%3A%2F%2Fapisix.apache.org%2Fzh%2Fdocs%2Fapisix%2Fgetting-started "https://apisix.apache.org/zh/docs/apisix/getting-started")

项目源码地址
------

[github.com/apache/apis…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fapache%2Fapisix-docker "https://github.com/apache/apisix-docker")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！