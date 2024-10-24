---
author: "字节跳动技术团队"
title: "Traefik 科普"
date: 2022-08-04
description: "Traefik是一个云原生的新型 HTTP 反向代理、负载均衡软件。它负责接收系统的请求，然后使用合适的组件对请求进行处理，同时兼容所有主流集群技术，并可以同时处理多种方式。"
tags: ["HTTP中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:14,comments:1,collects:11,views:5756,"
---
Traefik （发音和 traffic 相同，采用 Golang 编写）是一个云原生的新型的 HTTP 反向代理、负载均衡软件。它负责接收系统的请求，然后使用合适的组件来对这些请求进行处理。Traefik 兼容所有主流的集群技术，比如 Kubernetes，Docker，Docker Swarm，AWS，Mesos，Marathon，等等；并且可以同时处理多种方式。（甚至可以用于在裸机上运行的比较旧的软件。）

> **官网地址**：[docs.traefik.io/](https://link.juejin.cn?target=https%3A%2F%2Fdocs.traefik.io%2F "https://docs.traefik.io/")
> 
> **代码托管地址**：[github.com/containous/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcontainous%2Ftraefik%25EF%25BC%258C%25E6%2588%25AA%25E6%25AD%25A2%25E7%259B%25AE%25E5%2589%258D "https://github.com/containous/traefik%EF%BC%8C%E6%88%AA%E6%AD%A2%E7%9B%AE%E5%89%8D") Star 数为 38.5k

![](/images/jueJin/82b181932edc4bf.png)

使用 Traefik，不需要维护或者同步一个独立的配置文件：因为一切都会自动配置，实时操作的（无需重新启动，不会中断连接）。使用 Traefik，你可以花更多的时间在系统的开发和新功能上面，而不是在配置和维护工作状态上面花费大量时间。

Traefik 也被称之为边缘路由器（Edge Router），是你整个平台的大门，拦截并路由每个传入的请求：它知道所有的逻辑和规则，这些规则确定哪些服务处理哪些请求；传统的反向代理需要一个配置文件，其中包含路由到你服务的所有可能路由，而 Traefik 会实时检测服务并自动更新路由规则，可以自动服务发现。

![](/images/jueJin/fb38d5816239423.png)

当启动 Traefik 时，需要定义 Entrypoints（入口点），然后根据连接到这些 Entrypoints 的路由（Routes）来分析传入的请求，来查看他们是否与一组规则（Rules）相匹配，如果匹配，则路由可能会将请求通过一系列中间件（Middlewares，相当于Java中的拦截器 Interceptor/过滤器 Filter 的概念）转换过后再转发到你的服务上去。在了解 Traefik 之前有几个核心概念我们必须要了解：

*   Providers： 用来自动发现平台上的服务，可以是编排工具、容器引擎或者 key-value 存储等，比如 Docker、Kubernetes、File。
*   Entrypoints： 监听传入的流量（端口等…），是网络入口点，它们定义了接收请求的端口（HTTP 或者 TCP）。
*   Routers：分析请求（host, path, headers, SSL, …），负责将传入请求连接到可以处理这些请求的服务上去。
*   Services： 将请求转发给你的应用（load balancing, …），负责配置如何获取最终将处理传入请求的实际服务。
*   Middlewares： 中间件，用来修改请求或者根据请求来做出一些判断（authentication, rate limiting, headers, …），中间件被附件到路由上，是一种在请求发送到你的服务之前（或者在服务的响应发送到客户端之前）调整请求的一种方法。

Traefik 主要特征如下：

*   支持动态加载配置文件和优雅重启。
*   自动的服务发现与负载均衡。
*   自动配置ACME(Let's Encrypt)证书功能。
*   支持熔断、重试。
*   内置Web UI，管理相对方便。
*   支持WebSocket、HTTP/2、gRPC。
*   metrics 的支持（Rest、Prometheus、Datalog、Statsd、InfluxDB）。
*   支持K8S、docker swarm等，和容器结合比较紧密。

接下来讲一下它的安装、基本功能以及配置。Traefik 在 v1 与 v2 版本间差异过大，本文采用了 v2。Traefik v2.0 之后的版本在修改了很多 bug 之后也增加了新的特性，比如增加了TCP的支持，并且更换了新的WEB UI界面。

快速开始
====

我们使用 traefik:v2.2.0 作为镜像启动 traefik 服务。新建 traefik-v2.2.0.yaml 配置文件，内容如下：

```bash
version: '3'
services:
reverse-proxy:
image: traefik:2.2.0
# Enables the web UI and tells Traefik to listen to docker
# 启用 webUI 并告诉 Traefik 去监听docker的容器实例
command: --api.insecure=true --providers.docker
ports:
# Traefik暴露的http端口
- "80:80"
# webUI暴露的端口(必须指定--api.insecure=true才可以访问)
- "8080:8080"
volumes:
# 指定docker的sock文件来让traefik获取docker的事件，从而实现动态负载均衡
- /var/run/docker.sock:/var/run/docker.sock
```

使用 docker-compose 命令开启 Traefik 服务：

```lua
$ docker-compose -f traefik-v2.2.0.yaml up -d reverse-proxy
```

查看使用 docker-compose启动的应用：

```bash
$ docker-compose -f traefik-v2.2.0.yaml ps
Name                        Command               State                     Ports
-------------------------------------------------------------------------------------------------------------
traefik_reverse-proxy_1   /entrypoint.sh --api.insec ...   Up      0.0.0.0:80->80/tcp, 0.0.0.0:8080->8080/tcp
```

Traefik 一般需要一个配置文件来管理路由、服务、证书等。上面示例中，我们可以通过 docker 启动。

Traefik 时来挂载配置文件。在 Traefik 中的配置可以使用两种不同的方式：

*   动态配置：完全动态的路由配置。
*   静态配置：启动配置。

**静态配置**中的元素（这些元素不会经常更改）连接到 Providers 并定义 Treafik 将要监听的 Entrypoints。在 Traefik 中有三种方式定义静态配置：在配置文件中、在命令行参数中、通过环境变量传递。

**动态配置**包含定义系统如何处理请求的所有配置内容，这些配置是可以改变的，而且是无缝热更新的，没有任何请求中断或连接损耗。

Traefik 的配置结构图如下：

![](/images/jueJin/9ea7c18a536c4e1.png)

> 使用 `docker run traefik[:version] --help`可查看 Traefik 的配置参数。

我们可以使用 `http://localhost:8080/` 来访问 Traefik 官方 Dashboard，效果图如下：

![](/images/jueJin/fbfdf59ef9b6453.png)

路由
==

接下来我们使用 docker-compose 启动一个简单的 HTTP 服务，配置文件（test-service.yaml）如下：

```yaml
version: '3'
services:
whoami:
image: containous/whoami
labels:
- "traefik.http.routers.whoami.rule=Host(`whoami.docker.localhost`)"
```

启动服务：

```bash
$ docker-compose -f test-service.yaml up -d whoami
$ docker-compose -f test-service.yaml ps
Name         Command   State   Ports
-------------------------------------------
traefik_whoami_1   /whoami   Up      80/tcp
```

whoami 这个 HTTP 服务做了什么事情呢？

1.  暴露了一个 HTTP 服务，主要提供一些 header 以及 ip 信息；
2.  配置了容器的 labels，设置该服务的 Host 为 whoami.docker.localhost，给 traefik 提供标记。

此时我们可以通过 `curl -H Host:whoami.docker.``localhosthttp://localhost` 来访问 whoami 服务，我们使用 curl 做测试：

```makefile
$ curl -H Host:whoami.docker.localhost http://localhost
Hostname: e9a4bd2e0a7a
IP: 127.0.0.1
IP: 172.19.0.3
RemoteAddr: 172.19.0.2:33358
GET / HTTP/1.1
Host: whoami.docker.localhost
User-Agent: curl/7.54.0
Accept: */*
Accept-Encoding: gzip
X-Forwarded-For: 172.19.0.1
X-Forwarded-Host: whoami.docker.localhost
X-Forwarded-Port: 80
X-Forwarded-Proto: http
X-Forwarded-Server: f660478db1e4
X-Real-Ip: 172.19.0.1
```

服务正常访问。此时如果把 Host 配置为自己的域名，则已经可以使用自己的域名来提供服务。在Dashboard中可以看到对应的 HTTP Routers：

![](/images/jueJin/18db5348121f43a.png)

如果不设置 Host，访问是会失败的。

```yaml
$ curl -i http://localhost
HTTP/1.1 404 Not Found
Content-Type: text/plain; charset=utf-8
X-Content-Type-Options: nosniff
Date: Wed, 29 Apr 2020 09:44:56 GMT
Content-Length: 19

404 page not found
```

![](/images/jueJin/4be5604d0c1f4af.png)

下表罗列了 Traefik 可用的路由规则：

规则

描述

Headers(key, value)

检查 headers 中是否有一个键为 key值为value的键值对

HeadersRegexp(key, regexp)

检查 headers 中是否有一个键为 key，值匹配正则表达式 regexp的键值对

Host([example.com](https://link.juejin.cn?target=http%3A%2F%2Fexample.com "http://example.com"), ...)

检查请求的域名是否包含在给定的 domains 域名中

HostRegexp([example.com](https://link.juejin.cn?target=http%3A%2F%2Fexample.com "http://example.com"), {subdomain:\[a-z\]+}.[example.com](https://link.juejin.cn?target=http%3A%2F%2Fexample.com "http://example.com"), ...)

检查请求的域名是否匹配给定的 regexp正则表达式

Method(GET, ...)

检查请求的方法是否包含在给定的 methods (GET, POST, PUT, DELETE, PATCH) 中

Path(/path, /articles/{cat:\[a-z\]+}/{id:\[0-9\]+}, ...)

匹配确定的请求路径，它接受一系列文字和正则表达式路径

PathPrefix(/products/, /articles/{cat:\[a-z\]+}/{id:\[0-9\]+})

匹配请求前缀路径，它接受一系列文字和正则表达式前缀路径

Query(foo=bar, bar=baz)

匹配查询字符串参数，接受key=value的键值对序列

我们可以使用 `docker-compose up --scale`命令来对容器横向扩容，下面将单机扩容成2台：

```kotlin
$ docker-compose -f test-service.yaml up -d --scale whoami=2
WARNING: Found orphan containers (traefik_reverse-proxy_1) for this project. If you removed or renamed this service in your compose file, you can run this command with the --remove-orphans flag to clean it up.
Starting traefik_whoami_1 ... done
Creating traefik_whoami_2 ... done
```

![](/images/jueJin/14a919f9b741442.png)

此时再访问 `curl ``http://localhost`` -H Host:whoami.docker. ``localhost`时就会自动负载均衡到2个不同的实例上去了。

在 Dashboard 中也有相关记录：

![](/images/jueJin/6e1716d1e218455.png)

![](/images/jueJin/e0178f9e09da425.png)

参考资料
====

1.  [docs.traefik.io/](https://link.juejin.cn?target=https%3A%2F%2Fdocs.traefik.io%2F "https://docs.traefik.io/")
2.  [www.cnblogs.com/xiao9873341…](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fxiao987334176%2Fp%2F12447783.html "https://www.cnblogs.com/xiao987334176/p/12447783.html")
3.  [www.qikqiak.com/post/traefi…](https://link.juejin.cn?target=https%3A%2F%2Fwww.qikqiak.com%2Fpost%2Ftraefik-2.1-101%2F "https://www.qikqiak.com/post/traefik-2.1-101/")
4.  [github.com/shfshanyue/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fshfshanyue%2Fop-note%2Fblob%2Fmaster%2Ftraefik.md "https://github.com/shfshanyue/op-note/blob/master/traefik.md")

**加入我们**
========

我们来自字节跳动飞书商业应用研发部(Lark Business Applications)，目前我们在北京、深圳、上海、武汉、杭州、成都、广州、三亚都设立了办公区域。我们关注的产品领域主要在企业经验管理软件上，包括飞书 OKR、飞书绩效、飞书招聘、飞书人事等 HCM 领域系统，也包括飞书审批、OA、法务、财务、采购、差旅与报销等系统。欢迎各位加入我们。

扫码发现职位&投递简历

![](/images/jueJin/89441f9ea2164d6.png)

官网投递：[job.toutiao.com/s/FyL7DRg](https://link.juejin.cn?target=https%3A%2F%2Fjob.toutiao.com%2Fs%2FFyL7DRg "https://job.toutiao.com/s/FyL7DRg")