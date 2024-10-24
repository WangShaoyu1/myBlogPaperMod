---
author: "徐小夕"
title: "30分钟带你了解Web工程师必知的Docker知识"
date: 2020-03-13
description: "笔者之前和朋友一直在讨论web技术方向的话题，也一直想了解web运维方面的知识，所以特意请教了一下我的朋友老胡，他对web运维和后端技术有非常多的实战经验，所以在本文中他也提供了不少帮助。本文主要会介绍Docker的基础知识和应用领域，并通过实际部署一个web项目来带大家了解D…"
tags: ["Docker","自动化运维中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读11分钟"
weight: 1
selfDefined:"likes:32,comments:0,collects:67,views:4179,"
---
![](/images/jueJin/170cf3a489d93bf.png)

前言
--

笔者之前和朋友一直在讨论web技术方向的话题，也一直想了解web运维方面的知识，所以特意请教了一下我的朋友老胡，他对web运维和后端技术有非常多的实战经验，所以在本文中他也提供了不少帮助。本文主要会介绍**Docker**的基础知识和应用领域，并通过实际部署一个web项目来带大家了解**Docker**的使用方式。

作为一名前端工程师，为什么要学习**Docker**呢？首先笔者先来介绍一下**Docker**：

> Docker 是一个基于 Go 语言开发的开源应用容器引擎， 可以让我们把我们的应用和包打包到一个轻量级、可移植的**容器**中，然后发布到任何流行的 Linux 机器上，并且可以实现虚拟化。所谓**容器**，就是完全使用沙箱机制，相互之间没有任何接口,并且性能开销极低。

回忆一下，我们传统的Web应用部署方式一般都是将Web应用手动上传到服务器，并手动安装相关依赖和环境，再高级一点的我们可以用jenkins来自动化部署我们的应用，包括自动化测试等等，虽然已经解决了我们大部分部署的繁琐问题，但是如果我们服务器变更，或者遇到需要部署到多台服务器的场景，那么传统的操作将会繁琐。大家也许会问这种情况会出现吗？答案是会的。做过B端系统或有Saas系统开发经验的朋友也许会清楚其中的繁琐，为了客户安全和私有化往往需要研发人员给企业配置和部署独立的Web应用，如果你有上百家客户上千家客户，我们一个个部署显然是效率极低的，而且不能保证环境的一致性和稳定性，因为一旦我们的Web系统使用的环境或者包更新了，应用很可能不能正常Work，这种情况下采用Docker容器化技术可以很好的解决这一问题。

再者，前几年比较火的云计算服务，最为直接的要求就是**标准化**和**快速交付**，而Docker技术就非常适合这样的要求。

目前大部分企业都在采用**Docker**来实现软件开发部署中的自动化和部署效率安全等问题，作为前端工程师，也需要掌握一定的Docker技术来更好的配合后端和运维来推进这一过程。

你将收获
----

*   Docker的基本应用场景和实现架构
*   Docker的基本用法
*   使用Docker部署一个Web应用

正文
--

在开始正文之前首先我们先来了解一下**Docker**的应用场景，这样才能更好的理解为什么要使用它。

![](/images/jueJin/170d00390d313ea.png)

**Docker** 允许我们使用自己提供的应用程序或服务的本地容器在标准化环境中工作，这将大大简化我们开发的生命周期。我们还可以用Docker配合Jenkins实现更加完整高效的自动化部署方案。

**Docker** 的三个基本概念如下:

*   **镜像**（Image）：Docker 镜像（Image），相当于是一个完整的root文件系统；
*   **容器**（Container）：镜像和容器的关系，就像是面向对象程序设计中的类和实例一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等；
*   **仓库**（Repository）：可看成是一个代码控制中心，用来保存镜像。

其采用客户端-服务器 (C/S) 架构模式，使用远程API来管理和创建Docker容器。 Docker 容器通过 Docker镜像来创建。容器与镜像的关系类似于面向对象编程中的对象与类。为了方便大家理解，笔者特意画了一张Docker的架构图，如下：

![](/images/jueJin/170d027320e5c34.png)

### Docker 基础

#### 1.1主机虚拟化(vm)与操作系统虚拟化(container)

![主机虚拟化](/images/jueJin/170c9f9eaf649d4.png)

![操作系统虚拟化](/images/jueJin/170c9f9f32f35ef.png)

> 由上图对比可得，两种虚拟化技术本质的区别是：**主机虚拟化需要在父操作系统上运行一套子操作系统；而操作系统虚拟化是以进程的方式管理子容器，子容器与宿主机共用一套操作系统**。

主机虚拟化

操作系统虚拟化

隔离性

环境强隔离,父子操作系统底层无关

只能运行相似的操作系统，使用类似的库

网络

网络传输效率低，启动慢

传输效率高，启动较快，响应快

占用

必须增加操作系统的大量占用

占用较少

安全

子系统与宿主系统无关

有风险，但在可控范围 （daemon）

#### 1.2 容器化涉及内核技术

*   **namespace** —— 名称空间是提供给每个容器资源隔离的基础，提供了以下属性的隔离
    *   **UTS**:每一个NameSpace都拥有独立的主机或域名，可以把每个NameSpace认为一个独立主机。
    *   **IPC**：每个容器依旧使用linux内核中进程交互的方法，实现进程间通信
    *   **Mount**：每个容器的文件系统是独立的Net：每个容器的网络是隔离
    *   **User**:每个容器的用户和组ID是隔离，每个容器都拥有root用户
    *   **PID**：每个容器都拥有独立的进程树，由容器是物理机中的一个进程，所以容器中的进程是物理机的线程
*   **control group** ——控制组提供了对容器的资源限制
    *   **blkio** -- 这个子系统为块设备设定输入/输出限制，比如磁盘，固态硬盘，USB 等等。
    *   **cpu** -- 这个子系统使用调度程序提供对 CPU 的 cgroup 任务访问。
    *   **cpuacct** -- 这个子系统自动生成 cgroup 中任务所使用的 CPU 报告。
    *   **cpuset** -- 这个子系统为 cgroup 中的任务分配独立 CPU和内存节点。
    *   **devices** -- 这个子系统可允许或者拒绝 cgroup 中的任务访问设备。
    *   **freezer** -- 这个子系统挂起或者恢复 cgroup 中的任务。
    *   **memory** -- 这个子系统设定 cgroup 中任务使用的内存限制，并自动生成由那些任务使用的内存资源报告。
    *   **net\_cls** -- 这个子系统使用等级识别符（classid）标记网络数据包，可允许 Linux 流量控制程序（tc）识别从具体 cgroup 中生成的数据包。
    *   **ns** -- 名称空间子系统

### 运行第一个docker 程序

#### 2.1 安装docker

参照[docker官网安装文档](https://link.juejin.cn?target=https%3A%2F%2Fdocs.docker.com%2Fget-docker%2F "https://docs.docker.com/get-docker/")强烈建议不使用windows 操作（本人没有试过在windows上开发docker 相关，虽然官网提供了,但不知道），建议使用osx或linux)考虑服务器上国内使用centos 7 为大部分介绍下centos 7的安装（使用非root 账号,自行加上sudo）

```
# 1.清除旧版本的docker 安装
yum remove docker \
docker-client \
docker-client-latest \
docker-common \
docker-latest \
docker-latest-logrotate \
docker-logrotate \
docker-engine
# 2.安装依赖 官网介绍 yum-utils 为了引入yum-config-manager 其他的是docker 自身依赖
yum install -y yum-utils \
device-mapper-persistent-data \
lvm2
# 3.添加yum源
yum-config-manager \
--add-repo \
https://download.docker.com/linux/centos/docker-ce.repo
# 4.列出对应的安装版本
yum list docker-ce --showduplicates | sort -r
# 5.安装 建议根据实际情况选择版本 不要追求最新
yum install docker-ce-<VERSION_STRING> docker-ce-cli-<VERSION_STRING> containerd.io
# 6。设置开机启动docker,并启动docker
systemctl enable docker && systemctl start docker
```

#### 2.2 运行第一个docker 程序

```
# 查看docker 服务状态
systemctl docker status
# 运行 第一个应用，前端接触最多的容器就是nginx 了
# 查询官方 nginx stable 版本是1.16.1 于是选用 stable-alpine 版本
docker run -p 80:80 nginx:stable-alpine
```

### 3.docker 基本使用

#### 3.1 docker命令介绍

docker所有命令可阅读[使用docker 命令行](https://link.juejin.cn?target=https%3A%2F%2Fdocs.docker.com%2Fengine%2Freference%2Fcommandline%2Fcli%2F "https://docs.docker.com/engine/reference/commandline/cli/")并可通过docker --help 查询用法

```
docker --help

Usage:	docker [OPTIONS] COMMAND

A self-sufficient runtime for containers

Options:
--config string      Location of client config files (default "/Users/mac/.docker")
-c, --context string     Name of the context to use to connect to the daemon (overrides DOCKER_HOST env var and default context set with "docker context use")
-D, --debug              Enable debug mode
-H, --host list          Daemon socket(s) to connect to
-l, --log-level string   Set the logging level ("debug"|"info"|"warn"|"error"|"fatal") (default "info")
--tls                Use TLS; implied by --tlsverify
--tlscacert string   Trust certs signed only by this CA (default "/Users/mac/.docker/ca.pem")
--tlscert string     Path to TLS certificate file (default "/Users/mac/.docker/cert.pem")
--tlskey string      Path to TLS key file (default "/Users/mac/.docker/key.pem")
--tlsverify          Use TLS and verify the remote
-v, --version            Print version information and quit

Management Commands:
builder     Manage builds
config      Manage Docker configs
container   Manage containers
context     Manage contexts
image       Manage images
network     Manage networks
node        Manage Swarm nodes
plugin      Manage plugins
secret      Manage Docker secrets
service     Manage services
stack       Manage Docker stacks
swarm       Manage Swarm
system      Manage Docker
trust       Manage trust on Docker images
volume      Manage volumes
```

#### 3.2 docker 镜像

##### 3.2.1 常见用法

> 官方给的关于镜像的描述是:"An _image_ is a read-only template with instructions for creating a Docker container",含义是说 镜像是一个只读的用于指导创建容器的模板，相当于面向对象里的类的含义 而容器便是对应的实例,常用的命令如下

```
# 下载镜像
+ docker pull ubuntu

Using default tag: latest
latest: Pulling from library/ubuntu
423ae2b273f4: Pull complete
de83a2304fa1: Pull complete
f9a83bce3af0: Pull complete
b6b53be908de: Pull complete
Digest: sha256:04d48df82c938587820d7b6006f5071dbbffceb7ca01d2814f81857c631d44df
Status: Downloaded newer image for ubuntu:latest
docker.io/library/ubuntu:latest
# 查看镜像列表
+ docker images

REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
ubuntu              latest              72300a873c2c        2 weeks ago         64.2MB
# 导出镜像为文件，方便在不联网的机器上使用docker image
+ docker save  ubuntu -o ubuntu.tar
# 删除镜像，可见它的操作是先清除tag 如果没有其他相同image占用再清理layer
+ docker rmi ubuntu
Untagged: ubuntu:latest
Deleted: sha256:72300a873c2ca11c70d0c8642177ce76ff69ae04d61a5813ef58d40ff66e3e7c
Deleted: sha256:d3991ad41f89923dac46b632e2b9869067e94fcdffa3ef56cd2d35b26dd9bce7
Deleted: sha256:2e533c5c9cc8936671e2012d79fc6ec6a3c8ed432aa81164289056c71ed5f539
Deleted: sha256:282c79e973cf51d330b99d2a90e6d25863388f66b1433ae5163ded929ea7e64b
Deleted: sha256:cc4590d6a7187ce8879dd8ea931ffaa18bc52a1c1df702c9d538b2f0c927709d
# 从文件导入镜像，方便在不联网的机器上使用docker image
+ docker load -i ubuntu.tar

cc4590d6a718: Loading layer [=====================>]  65.58MB/65.58MB
8c98131d2d1d: Loading layer [=====================>]  991.2kB/991.2kB
03c9b9f537a4: Loading layer [=====================>]  15.87kB/15.87kB
1852b2300972: Loading layer [=====================>]  3.072kB/3.072kB
Loaded image: ubuntu:latest
# 构建镜像, 可自定义构建自己的镜像 下一部份详细讲
docker build -t $image:$tag $DockerfilePath
# 给镜像打一个新标签,一般用于推送到其他仓库
docker tag ubuntu $image:$tag
# 将镜像推送到远程registry
docker push $image:$tag

```

##### 3.2.2 自定义构建镜像

copy-on-write: docker 镜像是以层为结构的,底层一般为基础的操作系统,当文件系统发生变化时，首先从只读层复制一个文件到读写层操作当该层读写完毕并提交后即在原来基础上累加一层，当一个镜像构建时会缓存所有成功的层提升构建速度.

> 尝试通过物理安装的方式讲述一下自己构建nginx，我们在物理机上安装nginx 的步骤（源码安装能最大化保证稳定性和用到新的feature）可概括为以下几步

```
# 1. 下载源码包及依赖
yum install pcre-devel zlib-devel openssl-devel gcc make
wget http://nginx.org/download/nginx-1.16.1.tar.gz	/usr/local/source/
# 2. 设置编译nginx 的模块
./configure \
--prefix=/usr/local/nginx \
--conf-path=/usr/local/nginx/nginx.conf \
--pid-path=/usr/local/nginx/nginx.pid \
--with-http_ssl_module \
--with-pcre \
--with-http_gzip_static_module
# 3. 编译 & 安装
make && make install
# 4. 启动nginx
./nginx
```

实际在Dockerfile下也是这么完成的。

1.编辑文件命名Dockerfile

```
FROM centos:centos7.2.1511
MAINTAINER xujiang@test.com
ADD http://nginx.org/download/nginx-1.16.1.tar.gz /usr/local/source/
RUN ["bash","-c","cd /usr/local/source && \
tar -xf nginx-1.16.1.tar.gz  --strip-components 1   && \
yum update -y > /dev/null 2>&1 &&  \
yum install -y -q pcre-devel zlib-devel openssl-devel gcc make && \
./configure  --prefix=/usr/local/nginx  --with-http_ssl_module  --with-pcre  --with-				http_gzip_static_module &&  \
make && make install && \
ln -s /usr/local/nginx/sbin/nginx /usr/local/bin/nginx && \
rm -rf /usr/local/source"]
CMD ["nginx", "-g", "daemon off;"]

```

2.在当前目录下运行构建,便可构建成功 `.`表示当前目录下构建

```
+ docker build -t mynginx:20200311 .
Step 1/4 : FROM centos:centos7.2.1511
---> 9aec5c5fe4ba
Step 2/4 : ADD http://nginx.org/download/nginx-1.16.1.tar.gz /usr/local/source/
Downloading [======================================>]  1.033MB/1.033MB
---> ac3b840c5563
Step 3/4 : RUN ["bash","-c","cd /usr/local/source && tar -xf nginx-1.16.1.tar.gz  --strip-components 1   && yum update -y > /dev/null 2>&1 &&  yum install -y -q pcre-devel zlib-devel openssl-devel gcc make && ./configure  --prefix=/usr/local/nginx  --with-http_ssl_module  --with-pcre  --with-http_gzip_static_module &&  make && make install && ln -s /usr/local/nginx/sbin/nginx /usr/local/bin/nginx && rm -rf /usr/local/source"]
---> 22efc447e0c2
Step 4/4 : CMD ["nginx", "-g", "daemon off;"]
---> 8f74bded71e9
Successfully built 8f74bded71e9
Successfully tagged mynginx:20200311
```

3.运行该镜像并暴露内部80端口指向外部8000:`docker run -d -p 8000:80 --name mynginx-container mynginx:20200311`

注：实际上nginx 构建所有内容远远比这个复杂,这里可贴上nginx 构建的[Dockerfile](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fnginxinc%2Fdocker-nginx%2Fblob%2Ff7738edec51adb47470a96ad120cd63975a9d3d0%2Fstable%2Falpine%2FDockerfile "https://github.com/nginxinc/docker-nginx/blob/f7738edec51adb47470a96ad120cd63975a9d3d0/stable/alpine/Dockerfile")

​ 更多指令可参考[Dockerfile Reference](https://link.juejin.cn?target=https%3A%2F%2Fdocs.docker.com%2Fengine%2Freference%2Fbuilder%2F "https://docs.docker.com/engine/reference/builder/")

#### 3.3 docker 容器

> 上文提到容器是镜像的运行时实例，一个镜像可以通过不同的命令运行不一样的容器实例，以下是对容器的基本操作的常用命令

```
+ docker run --help
Usage:	docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
Run a command in a new container
# -d 将容器运行在后台并打印容器ID
-d, --detach  					Run container in background and print container ID
-e, --env list          Set environment variables
--env-file list         Read in a file of environment variables
--rm                    Automatically remove the container when it exits
-v, --volume list       Bind mount a volume
-w, --workdir string    Working directory inside the container
--restart string        Restart policy to apply when a container exits (default "no")
``````
# 查看当前正在运行的容器 docker ps -a 表示查看所有容器(包含已经退出)
+ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                NAMES
a5f7f9710db8        mynginx:20200311    "nginx -g 'daemon of…"   59 seconds ago      Up 58 seconds       0.0.0.0:80->80/tcp   mynginx-container
# 进入容器内部执行命令（打开标准输入流并为容器创建伪终端）
docker exec -it  mynginx-container bash
# 查看容器日志
docker logs -f  mynginx-container
```

### 4.实战案例

1.准备

```asciidoc
* 一个前端项目
* 一台安装好docker 的机器
* [docker hub](https://hub.docker.com/)查询编译所需要的镜像[node](https://hub.docker.com/_/node?tab=tags),[nginx](https://hub.docker.com/_/nginx)
``````
# 克隆antd-admin.git 项目
git clone https://github.com/zuiidea/antd-admin.git
# 使用docker 编译的优势 可以在任意一台只装了docker的环境下编译不同的语言 消除对环境依赖
docker run --network=host --rm  -v "$(cd $(dirname .);pwd):/app" -w /app node:10-alpine3.9 yarn && yarn build
```

*   准备反向代理的规则的nginx.conf

```
    server {
    listen       80;
    server_name  _;
    access_log  /var/log/nginx/host.access.log  main;
    
        location / {
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Headers X-Requested-With;
        add_header Access-Control-Allow-Methods GET,POST;
        root   /app;
        index  index.html index.htm;
    }
}
```

*   构建自己的Dockerfile 并写成脚本

```
FROM nginx:stable-alpine
ENV LANG en_US.UTF-8
COPY dist /app
COPY app.conf /etc/nginx/conf.d/default.conf
WORKDIR /app

```

*   参考脚本如下 build.sh

```
#!/bin/bash

current_dir=$(cd $(dirname .);pwd)

    function compire(){
    docker run --network=host --rm  -v "$current_dir:/app" -w /app node:10-alpine3.9 yarn && yarn build
}
    function package(){
    if [ ! -d "$current_dir/dist" ] ;then
    compire
    fi
    docker build -t myapp:`date -u +"%Y%m%d"` $current_dir
}
    function clean(){
    rm -rf $current_dir/dist
}

case "$1" in
compire)
compire
;;
package)
package
;;
clean)
clean
;;
*)
echo "USAGE:$0 package | compire | clean "
esac
```

*   运行容器`docker run -d -p 80:80 myapp:20200311`

至此，基本的配置就完成了，大家可以自己手动试试，基于Docker部署一个自己的Web应用。

本文只涉及到了Docker基本的使用配置，后期笔者有空会继续和朋友总结**编排**，**docker network**，**docker volume**，**docker daemon**等技术，并以一个node的案例部署作为实战来教大家在实际项目中去落地Docker自动化部署。

如果想获取**更多项目完整的源码**, 或者想学习更多**H5游戏**, **webpack**，**node**，**gulp**，**css3**，**javascript**，**nodeJS**，**canvas数据可视化**等前端知识和实战，欢迎在公号《趣谈前端》加入我们的技术群一起学习讨论，共同探索前端的边界。

![](/images/jueJin/170060658dd3db9.png)

更多推荐
----

*   [基于nodeJS从0到1实现一个CMS全栈项目（上）](https://juejin.cn/post/6844903952761225230 "https://juejin.cn/post/6844903952761225230")
*   [基于nodeJS从0到1实现一个CMS全栈项目（中）（含源码）](https://juejin.cn/post/6844903954522832909 "https://juejin.cn/post/6844903954522832909")
*   [CMS全栈项目之Vue和React篇（下）（含源码）](https://juejin.cn/post/6844903955797901319 "https://juejin.cn/post/6844903955797901319")
*   [从零到一教你基于vue开发一个组件库](https://juejin.cn/post/6844904085808742407 "https://juejin.cn/post/6844904085808742407")
*   [从0到1教你搭建前端团队的组件系统（高级进阶必备）](https://juejin.cn/post/6844904068431740936 "https://juejin.cn/post/6844904068431740936")
*   [10分钟教你手写8个常用的自定义hooks](https://juejin.cn/post/6844904074433789959 "https://juejin.cn/post/6844904074433789959")
*   [《彻底掌握redux》之开发一个任务管理平台（上）](https://juejin.cn/post/6844904071933984776 "https://juejin.cn/post/6844904071933984776")
*   [15分钟带你了解前端工程师必知的javascript设计模式(附详细思维导图和源码)](https://juejin.cn/post/6844904054498263053 "https://juejin.cn/post/6844904054498263053")
*   [一张图教你快速玩转vue-cli3](https://juejin.cn/post/6844903877133729799 "https://juejin.cn/post/6844903877133729799")
*   [《前端实战总结》之使用postMessage实现可插拔的跨域聊天机器人](https://juejin.cn/post/6844903989843066887 "https://juejin.cn/post/6844903989843066887")