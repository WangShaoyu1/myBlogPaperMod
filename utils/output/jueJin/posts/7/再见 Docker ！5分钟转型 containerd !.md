---
author: "MacroZheng"
title: "再见 Docker ！5分钟转型 containerd !"
date: 2021-03-10
description: "containerd是一个工业级标准的容器运行时，它强调简单性、健壮性和可移植性。containerd可以在宿主机中管理完整的容器生命周期，包括容器镜像的传输和存储、容器的执行和管理、存储和网络等。 containerd是从Docker中分离出来的一个项目，可以作为一个底层容器…"
tags: ["Java","Kubernetes中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:27,comments:4,collects:33,views:3792,"
---
> SpringBoot实战电商项目mall（40k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

Docker作为非常流行的容器技术，之前经常有文章说它被K8S弃用了，取而代之的是另一种容器技术containerd！其实containerd只是从Docker中分离出来的底层容器运行时，使用起来和Docker并没有啥区别，本文主要介绍下containerd的使用，希望对大家有所帮助！

containerd简介
------------

containerd是一个工业级标准的容器运行时，它强调简单性、健壮性和可移植性。containerd可以在宿主机中管理完整的容器生命周期，包括容器镜像的传输和存储、容器的执行和管理、存储和网络等。

Docker vs containerd
--------------------

containerd是从Docker中分离出来的一个项目，可以作为一个底层容器运行时，现在它成了Kubernete容器运行时更好的选择。

不仅仅是Docker，还有很多云平台也支持containerd作为底层容器运行时，具体参考下图。

![](/images/jueJin/12c10658e162414.png)

K8S CRI
-------

K8S发布CRI（Container Runtime Interface），统一了容器运行时接口，凡是支持CRI的容器运行时，皆可作为K8S的底层容器运行时。

K8S为什么要放弃使用Docker作为容器运行时，而使用containerd呢？

如果你使用Docker作为K8S容器运行时的话，kubelet需要先要通过`dockershim`去调用Docker，再通过Docker去调用containerd。

![](/images/jueJin/85675a6ee022402.png)

如果你使用containerd作为K8S容器运行时的话，由于containerd内置了`CRI`插件，kubelet可以直接调用containerd。

![](/images/jueJin/1d9e1abf910b4da.png)

使用containerd不仅性能提高了（调用链变短了），而且资源占用也会变小（Docker不是一个纯粹的容器运行时，具有大量其他功能）。

containerd使用
------------

> 如果你之前用过Docker，你只要稍微花5分钟就可以学会containerd了，接下来我们学习下containerd的使用。

*   在之前的文章[《据说只有高端机器才配运行K8S，网友：1G内存的渣渣跑起来了！》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FiDG7Wzq9DQHLFPtnqokOxQ "https://mp.weixin.qq.com/s/iDG7Wzq9DQHLFPtnqokOxQ")中我们安装了K3S，由于K3S中默认使用containerd作为容器运行时，我们只要安装好K3S就可以使用它了；
    
*   其实只要把我们之前使用的`docker`命令改为`crictl`命令即可操作containerd，比如查看所有运行中的容器；
    

```bash
crictl ps
``````bash
CONTAINER           IMAGE               CREATED                  STATE               NAME                ATTEMPT             POD ID
4ca73ded41bb6       3b0b04aa3473f       Less than a second ago   Running             helm                20                  21103f0058872
3bb5767a81954       296a6d5035e2d       About a minute ago       Running             coredns             1                   af887263bd869
a5e34c24be371       0346349a1a640       About a minute ago       Running             nginx               1                   89defc6008501
```

*   查看所有镜像；

```bash
crictl images
``````bash
IMAGE                                      TAG                 IMAGE ID            SIZE
docker.io/library/nginx                    1.10                0346349a1a640       71.4MB
docker.io/rancher/coredns-coredns          1.8.0               296a6d5035e2d       12.9MB
docker.io/rancher/klipper-helm             v0.4.3              3b0b04aa3473f       50.7MB
docker.io/rancher/local-path-provisioner   v0.0.14             e422121c9c5f9       13.4MB
docker.io/rancher/metrics-server           v0.3.6              9dd718864ce61       10.5MB
docker.io/rancher/pause                    3.1                 da86e6ba6ca19       327kB
```

*   进入容器内部执行bash命令，这里需要注意的是只能使用容器ID，不支持使用容器名称；

```bash
crictl exec -it a5e34c24be371 /bin/bash
```

*   查看容器中应用资源占用情况，可以发现占用非常低。

```bash
crictl stats
``````bash
CONTAINER           CPU %               MEM                 DISK                INODES
3bb5767a81954       0.54                14.27MB             254B                14
a5e34c24be371       0.00                2.441MB             339B                16
```

总结
--

从Docker转型containerd非常简单，基本没有什么门槛。只要把之前Docker命令中的`docker`改为`crictl`基本就可以了，果然是同一个公司出品的东西，用法都一样。所以不管K8S到底弃用不弃用Docker，对我们开发者使用来说，基本没啥影响！

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！