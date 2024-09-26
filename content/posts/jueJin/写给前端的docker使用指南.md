---
author: "白哥学前端"
title: "写给前端的docker使用指南"
date: 2022-09-05
description: "富Web时代，应用变得越来越强大，与此同时也越来越复杂。集群部署、隔离环境、灰度发布以及动态扩容缺一不可，而容器化则成为中间的必要桥梁。本文带你从0搭建一个docker环境，让你0基础入门"
tags: ["前端","Docker","Vue.js"]
ShowReadingTime: "阅读9分钟"
weight: 71
---
富 Web 时代，应用变得越来越强大，与此同时也越来越复杂。集群部署、隔离环境、灰度发布以及动态扩容缺一不可，而容器化则成为中间的必要桥梁。

docker 使应用部署更加轻量，可移植，可扩展，更好的环境隔离也更大程度地避免了生产环境与测试环境不一致的巨大尴尬。

由于 docker 轻便可移植的特点也极大促进了 CI/CD 的发展。 就让我们来探索一下 Docker 的神秘世界，从零到一掌握 Docker 的基本原理与实践操作。

讲个雨前小故事
-------

我需要盖一个房子，于是我搬石头、砍木头、画图纸、盖房子。一顿操作，终于把这个房子盖好了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3e862e1f69f42858425a502c6157a17~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

结果，住了一段时间，心血来潮想搬到海边去。这时候按以往的办法，我只能去海边，再次搬石头、砍木头、画图纸、盖房子。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c5252fa81904480bd909938e0fb0fdd~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

烦恼之际，跑来一个叫Dokcer的魔法师教会我一种魔法。这种魔法可以把我盖好的房子复制一份，做成「镜像」，放在我的背包里。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07aa240cd37145fdb0066392197886f9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

等我到了海边，就用这个「镜像」，复制一套房子，拎包入住。

是不是很神奇？对应到我们的项目中来，房子就是项目本身，镜像就是项目的复制，背包就是镜像仓库。如果要动态扩容，从仓库中取出项目镜像，随便复制就可以了。Build once，Run anywhere!

认识Docker
--------

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c09275e60e947e4836c7323809cbbec~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 术语

docker 的架构图如下

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b83f7ef6f44445fbbd960dfd3d656820~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 本图片来自官方文档 [Docker architecture](https://link.juejin.cn?target=https%3A%2F%2Fdocs.docker.com%2Fget-started%2Foverview%2F%23docker-architecture "https://docs.docker.com/get-started/overview/#docker-architecture")

从图中可以看出几个组成部分

*   docker client: 即 docker 命令行工具
*   docker host: 宿主机，docker daemon 的运行环境服务器
*   docker daemon: docker 的守护进程，docker client 通过命令行与 docker daemon 交互
*   image: 镜像，可以理解为一个容器的模板，通过一个镜像可以创建多个容器
*   container: 最小型的一个操作系统环境，可以对各种服务以及应用容器化，是镜像的运行实例
*   registry: 镜像仓库，存储大量镜像，可以从镜像仓库拉取和推送镜像

Docker 技术的三大核心概念，分别是：镜像 Image、容器 Container、仓库 Repository。

安装 Docker
---------

### 软件安装

在本地安装 docker/docker-compose，通过 [Docker Desktop](https://link.juejin.cn?target=https%3A%2F%2Fwww.docker.com%2Fget-started%2F "https://www.docker.com/get-started/")下载 docker 后，双击安装即可。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40673e23937943c483aaaac567b0428f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

如果是个人服务器且为 linux，可参考 [安装 docker](https://link.juejin.cn?target=https%3A%2F%2Fdocs.docker.com%2Fengine%2Finstall%2Fcentos%2F "https://docs.docker.com/engine/install/centos/") ,它将 docker 与 docker compose 一并安装。

### 命令行安装

Homebrew 的 Cask 已经支持 Docker for Mac，因此可以很方便的使用 Homebrew Cask 来进行安装，执行如下命令：

`brew cask install docker`

查看版本

`docker -v`

使用Docker启动一个vue项目
-----------------

### 新建项目

使用Vue 脚手架构建项目

`npm init vue@latest`

给项目起个名字，叫做`docker-demo-vue`

然后一路回车。运行命令：

shell

 代码解读

复制代码

  `cd docker-demo-vue   npm install   npm run dev`

等待安装完毕依赖包，打开[http://localhost:5174/，](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A5174%2F%25EF%25BC%258C "http://localhost:5174/%EF%BC%8C")

我们就能看到如下界面：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b3959745fe84ffab9b262f0b020ec7c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

项目没啥问题，我们对项目进行打包：

`npm run build`

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b59483ca8955418f929b63df4c6b7b14~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

可以看到，项目目录下的 Dist 就是我们要部署的静态资源了。

### 新建 Dockerfile

在`docker-demo-vue`根目录下执行：`touch Dockerfile`

此时的项目目录结构是这样的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3cd273772060479ba041a9ce76f3bd4e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 拉取 Nginx 镜像

首先打开你的Docker，默认会启动。

控制台拉取 Nginx 镜像：

`docker pull nginx`

出现下面的信息说明拉取Nginx镜像成功

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/acd02c73c8bd4140a7000daef4a1b858~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

在根目录创建 Nginx 配置文件：

`touch default.conf`

写入：

conf

 代码解读

复制代码

`server {     listen       80;     server_name  localhost;     #charset koi8-r;     access_log  /var/log/nginx/host.access.log  main;     error_log  /var/log/nginx/error.log  error;     location / {         root   /usr/share/nginx/html;         index  index.html index.htm;     }     error_page   500 502 503 504  /50x.html;     location = /50x.html {         root   /usr/share/nginx/html;     } }`

### 配置镜像

打开`Dockerfile`文件，写入：

javascript

 代码解读

复制代码

`FROM nginx   COPY dist/ /usr/share/nginx/html/   COPY default.conf /etc/nginx/conf.d/default.conf`  

解释一下代码：

*   `FROM nginx` 指定该镜像是基于 `nginx:latest` 镜像而构建的；
    
*   `COPY dist/ /usr/share/nginx/html/` 命令的意思是将项目根目录下 `dist` 文件夹中的所有文件复制到镜像中 `/usr/share/nginx/html/` 目录下；
    
*   `COPY default.conf /etc/nginx/conf.d/default.conf` 将 `default.conf` 复制到 `etc/nginx/conf.d/default.conf`，用本地的 `default.conf` 配置来替换 Nginx 镜像里的默认配置。
    

### 构建镜像

Docker 通过 build 命令来构建镜像：

`docker build -t docker-demo-vue .`

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72205a4bd7d645e8aba8f94f9720974b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

出现上面的信息，表示构建成成功了。

参数说明：

*   `-t` 参数给镜像命名 docker-demo-vue
    
*   `.` 是基于当前目录的 Dockerfile 来构建镜像
    

运行`docker image ls | grep docker-demo-vue`查看镜像

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b89dc49a84eb4e3f8c6a1f74f9497206~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

可以看到我们构建了一个142MB的项目镜像。

在docker中也可以查看生成的镜像

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b32a3e1fa3d41b0a6a2fabc4f78fe2d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 运行容器

`docker run -d -p 3000:80 --name docker-vue docker-demo-vue`

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f987878af7294491bddd75e68bb24e9e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

参数解释：

*   \-d 设置容器在后台运行
    
*   \-p 表示端口映射，把本机的 3000 端口映射到 container 的 80 端口（这样外网就能通过本机的 3000 端口访问了。
    
*   \--name 设置容器名 docker-vue
    
*   docker-demo-vue 是我们上面构建的镜像名字
    

可以运行`docker ps -a` 查看容器id：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bbe6a154009b48218d88c000043695ab~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

可以看到我们刚才打印的`docker-vue`的容器id为`b6c49793ad48`，跟上面的容器id`b6c49793ad48ccfc106fab63f988881a1467ae25b5c4c9cee87ad4f3515f9607`对应，默认是取了前12位。

同样的也可以在桌面端看到，正在运行的docker容器

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93e73388cc0c46d0a709be93248a4193~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 访问项目

我们打开[http://localhost:3000/](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A3000%2F "http://localhost:3000/")，就可以在浏览器中看到对应的页面，跟我们前面创建项目的时候看到的界面是一样的

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30e4d4c4caaf4d3e9803e33e5e041bf3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

也可以使用`curl -v -i localhost:3000` 去查看对应的静态文件

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f86050487dd94dbfba8ffc6e72604a6a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e025efe159cd407889d8f41bfe0cac83~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 发布镜像

如果你想为社区贡献力量，那么需要将镜像发布，方便其他开发者使用。

发布镜像需要如下步骤：

登陆 [dockerhub](https://link.juejin.cn?target=https%3A%2F%2Fhub.docker.com "https://hub.docker.com")，注册账号；

命令行执行 `docker login`，之后输入我们的账号密码，进行登录；

推送镜像之前，需要打一个 Tag，执行 `docker tag <image> <username>/<repository>:<tag>`

全流程结束，以后我们要使用，再也不需要「搬石头、砍木头、画图纸、盖房子」了，拎包入住。这也是 docker 独特魅力所在。

以上，就是如何使用docker去运行一个基础项目的示例。

[完整代码示例](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fxiumubai%2Fdocker-demo-vue "https://github.com/xiumubai/docker-demo-vue")

底层原理简介
------

`docker` 底层使用了一些 `linux` 内核的特性，大概有 `namespace`，`cgroups` 和 `ufs`。

### namespace

`docker` 使用 `linux namespace` 构建隔离的环境，它由以下 `namespace` 组成

*   `pid`: 隔离进程
*   `net`: 隔离网络
*   `ipc`: 隔离 IPC
*   `mnt`: 隔离文件系统挂载
*   `uts`: 隔离hostname
*   `user`: 隔离uid/gid

进阶技巧总结
------

### 镜像仓库与拉取

大部分时候，我们不需要自己构建镜像，我们可以在[官方镜像仓库 Docker Hub](https://link.juejin.cn?target=https%3A%2F%2Fhub.docker.com%2Fexplore%2F "https://hub.docker.com/explore/")拉取镜像。

可以简单使用命令 `docker pull` 拉取镜像。

拉取镜像后可以使用 `docker inspect` 查看镜像信息，如配置及环境变量等。

bash

 代码解读

复制代码

`# 加入拉取一个 node:alpine 的镜像 $ docker pull node:alpine # 查看镜像信息 $ docker inspect node:alpine # 列出所有镜像 $ docker images REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE node                alpine              f20a6d8b6721        13 days ago         105MB mongo               latest              965553e202a4        2 weeks ago         363MB centos              latest              9f38484d220f        8 months ago        202MB`

### 构建镜像与发布

但并不是所有的镜像都可以在镜像仓库中找到，另外我们也需要为我们自己的业务应用去构建镜像。

使用 `docker build` 构建镜像，**`docker build` 会使用当前目录的 `Dockerfile` 构建镜像**，至于 `Dockerfile` 的配置，参考下节。

bash

 代码解读

复制代码

`# -t node-base:10: 指定镜像以及版本号 # .: 指当前路径 $ docker build -t node-base:10 .`

当构建镜像成功后可以使用 `docker push` 推送到镜像仓库。

### Dockerfile

在使用 `docker` 部署自己应用时，往往需要独立构建镜像。

`docker` 使用 `Dockerfile` 作为配置文件构建镜像，简单看一个 `node` 应用构建的 `dockerfile`。

Dockerfile 的各个指令可参考 [Dockerfile Reference](https://link.juejin.cn?target=https%3A%2F%2Fdocs.docker.com%2Fengine%2Freference%2Fbuilder%2F "https://docs.docker.com/engine/reference/builder/")。

dockerfile

 代码解读

复制代码

`FROM node:alpine ADD package.json package-lock.json /code/ WORKDIR /code RUN npm install --production ADD . /code CMD npm start`

### FROM

基于一个旧有的基础镜像，格式如下。

dockerfile

 代码解读

复制代码

`FROM <image> [AS <name>] # 在多阶段构建时会用到 FROM <image>[:<tag>] [AS <name>] FROM node:16-alpine FROM nginx:alpine`

而以上所述的 node 与 nginx 基础镜像可在[Docker Hub](https://link.juejin.cn?target=https%3A%2F%2Fhub.docker.com%2F "https://hub.docker.com/")中找到。

需要了解常用的 `alpine`、`node`、`nginx` 基础镜像。

### ADD

把宿主机的文件或目录加入到镜像的文件系统中。

dockerfile

 代码解读

复制代码

`ADD [--chown=<user>:<group>] <src>... <dest> ADD . /code`

### RUN

在镜像中执行命令，由于 `ufs` 的文件系统，它会在当前镜像的顶层新增一层。

dockerfile

 代码解读

复制代码

`RUN <command> RUN npm run build`

### CMD

指定容器如何启动。

**一个 `Dockerfile` 中只允许有一个 CMD**

dockerfile

 代码解读

复制代码

`# exec form, this is the preferred form CMD ["executable","param1","param2"]  # as default parameters to ENTRYPOINT CMD ["param1","param2"] # shell form CMD command param1 param2 CMD npm start`

### 容器

镜像与容器的关系，类似于代码与进程的关系。

*   `docker run` 创建容器
*   `docker stop` 停止容器
*   `docker rm` 删除容器

### 创建容器

基于 `nginx` 镜像创建一个最简单的容器：启动一个最简单的 http 服务

使用 `docker run` 来启动容器，`docker ps` 查看容器启动状态

bash

 代码解读

复制代码

`# 启动 nginx 容器，并在本地 8888 端口进行访问 $ docker run --rm -it --name nginx -p 8888:80 nginx:alpine $ docker ps -l CONTAINER ID        IMAGE                COMMAND                  CREATED             STATUS              PORTS                    NAMES 404e88f0d90c        nginx:alpine         "nginx -g 'daemon of…"   4 minutes ago       Up 4 minutes        0.0.0.0:8888->80/tcp     nginx CONTAINER ID        IMAGE                COMMAND                  CREATED             STATUS              PORTS                    NAMES`

其中:

*   `--rm`：当停止容器时自动清楚容器
*   `-it`：可交互式、赋予 tty 的方式
*   `--name`：为容器指定名称
*   `-p host-port:container-port`：宿主机与容器端口映射，方便容器对外提供服务
*   `nginx:alpine`：基于该基础镜像创建容器

此时在宿主机使用 `curl` 测试容器提供的服务是否正常

bash

 代码解读

复制代码

`$ curl localhost:8888 <!DOCTYPE html> <html> <head> <title>Welcome to nginx!</title> <style>     body {         width: 35em;         margin: 0 auto;         font-family: Tahoma, Verdana, Arial, sans-serif;     } </style> </head> <body> <h1>Welcome to nginx!</h1> <p>If you see this page, the nginx web server is successfully installed and working. Further configuration is required.</p> <p>For online documentation and support please refer to <a href="http://nginx.org/">nginx.org</a>.<br/> Commercial support is available at <a href="http://nginx.com/">nginx.com</a>.</p> <p><em>Thank you for using nginx.</em></p> </body> </html>`

那如果要进入容器环境中呢？使用 `docker exec -it container-name` 命令

bash

 代码解读

复制代码

`$ docker exec -it nginx sh / # / # / #`

### 容器管理

`docker ps` 列出所有容器

bash

 代码解读

复制代码

`$ docker ps CONTAINER ID        IMAGE                COMMAND                  CREATED             STATUS              PORTS                    NAMES 404e88f0d90c        nginx:alpine         "nginx -g 'daemon of…"   4 minutes ago       Up 4 minutes        0.0.0.0:8888->80/tcp     nginx 498e7d74fb4f        nginx:alpine         "nginx -g 'daemon of…"   7 minutes ago       Up 7 minutes        80/tcp                   lucid_mirzakhani 2ce10556dc8f        redis:4.0.6-alpine   "docker-entrypoint.s…"   2 months ago        Up 2 months         0.0.0.0:6379->6379/tcp   apolloserverstarter_redis_1`

`docker port` 查看容器端口映射

bash

 代码解读

复制代码

`$ docker port nginx 80/tcp -> 0.0.0.0:8888`

`docker stats` 查看容器资源占用

bash

 代码解读

复制代码

`$ docker stats nginx CONTAINER ID        NAME                CPU %               MEM USAGE / LIMIT     MEM %               NET I/O             BLOCK I/O           PIDS 404e88f0d90c        nginx               0.00%               1.395MiB / 1.796GiB   0.08%               632B / 1.27kB       0B / 0B             2`

### 容器测试

如果某时某个容器出现问题，可直接进入容器内部进行调试。

bash

 代码解读

复制代码

`$ docker exec -it <container_name>`

### docker compose

在 docker compose v2 中，使用了 `docker compose` 命令去替代了 `docker-compose` 命令，可以通过 docker compose version 查看版本号。

> 尽管目前 docker compose 最新版本为 v2，但是在本系列专栏中还是使用 v1 进行演示，自行替换即可。

bash

 代码解读

复制代码

`$ docker compose version Docker Compose version v2.6.0 # 如果是 v1 版本，则需要通过 docker-compose 查看命令 $ docker-compose version docker-compose version 1.29.2, build 5becea4c docker-py version: 5.0.0 CPython version: 3.7.10 OpenSSL version: OpenSSL 1.1.0l  10 Sep 2019`

在 2022 年 4 月 26 号，compose v2 已经成为了正式版本。更多见 [Announcing Compose V2 General Availability](https://link.juejin.cn?target=https%3A%2F%2Fwww.docker.com%2Fblog%2Fannouncing-compose-v2-general-availability%2F "https://www.docker.com/blog/announcing-compose-v2-general-availability/")

bash

 代码解读

复制代码

`# 使用 docker compose ls，可列出系统全局有多少容器是根据 docker compose 启动，比 v1 版本方便很多 $ docker compose ls NAME                STATUS              CONFIG FILES cra-deploy          running(1)          /home/train/Documents/cra-deploy/domain.docker-compose.yaml traefik             running(1)          /home/train/Documents/traefik/docker-compose.yml`

在当前目录，新建配置文件为 `docker-compose.yaml`，内容如下。

yaml

 代码解读

复制代码

`version: "3" services:   app:     image: "nginx:alpine"     ports:       - 8000:80`

此时可通过 `docker compose up` 启动容器。

至此，我们的全部docker教程结束，赶快去尝试一下吧！！！

任务发布
----

1.  了解 docker 常见操作，如构建镜像、运行容器、进入容器执行命令
2.  如何进入 docker 容器中进行调试
3.  使用 docker 启动 nginx 容器，并在本地浏览器某端口可直接打开
4.  如何得知启动 nginx 容器的 IP 端口
5.  了解 docker 原理，如何模拟 docker 隔离环境及限制资源
6.  Dockerfile、Image、Container 有何区别
7.  Dockerfile 中 CMD 与 RUN 有何区别