---
author: "程序猿DD"
title: "用ngrok实现内网穿透，一行命令就搞定！"
date: 2023-08-14
description: "最近在写支付的东西，调试时候需要让支付平台能够回调本地接口来更新支付成功的状态。但由于开发机器没有公网IP，所以需要使用内网穿透来让支付平台能够成功访问到本地开发机器，这样才能更高效率的进行调试。"
tags: ["Java"]
ShowReadingTime: "阅读2分钟"
weight: 655
---
最近在写支付的东西，调试时候需要让支付平台能够回调本地接口来更新支付成功的状态。但由于开发机器没有公网IP，所以需要使用内网穿透来让支付平台能够成功访问到本地开发机器，这样才能更高效率的进行调试。

推荐内网穿透的文章已经很多很多，还有很多大合集的推荐，但也因为推荐的太多，也会让人眼花缭乱，不断尝试不断受挫。有的接受不了收费、有的配置繁琐，有的运行不稳定，还有的有病毒。

这里不做过多推荐，只推荐一个个人认为最好用的，那就是：[**ngrok**](https://link.juejin.cn?target=https%3A%2F%2Fblog.didispace.com%2Fnat-traversal-ngrok%2F "https://blog.didispace.com/nat-traversal-ngrok/") 。只需要一行命令就能帮你轻松实现内网穿透！

下面你可以跟着我的操作来完成第一次使用：

注册登录账号
------

从官网（[ngrok.com/）右上角](https://link.juejin.cn?target=https%3A%2F%2Fngrok.com%2F%25EF%25BC%2589%25E5%258F%25B3%25E4%25B8%258A%25E8%25A7%2592 "https://ngrok.com/%EF%BC%89%E5%8F%B3%E4%B8%8A%E8%A7%92") Sign Up 进入，完成用户注册。如果您跟我一样是开发者的话，直接GitHub授权登录，快得很！

完成注册并登录之后，可以看到Dashboard中就给出了使用的三个步骤：

![](http://blog.didispace.com/images2/202308/nat-traversal-ngrok/1691304647365.png)

是不是超级简洁？接下来就来一起完成这三步！

安装Ngrok
-------

进入官网的下载页面：[ngrok.com/download](https://link.juejin.cn?target=https%3A%2F%2Fngrok.com%2Fdownload "https://ngrok.com/download")

官方清晰地给出了各个系统的安装方法：

![](http://blog.didispace.com/images2/202308/nat-traversal-ngrok/1691304523405.png)

**个人推荐直接下载ZIP包**，然后直接解压，这种方式最为迅速！

配置账户
----

直接复制Dashboard中第二步的`ngrok config add-authtoken xxxxx`命令，然后打开终端，定位到之前解压ngrok的位置执行它！

终端会输出为你保存的配置路径：

bash

 代码解读

复制代码

`Authtoken saved to configuration file: /Users/zhaiyongchao/Library/Application Support/ngrok/ngrok.yml`

启动ngrok
-------

执行下面的命令，为8080端口的应用启动内网穿透：

yaml

 代码解读

复制代码

`ngrok http 8080`

这里没用dashboard的80端口，因为我们写Java应用一般都是8080嘛，如果你本地的服务用了其他端口，记得修改一下就可以了。

此时，终端也变了一副画面，具体如下：

![](http://blog.didispace.com/images2/202308/nat-traversal-ngrok/1691305161041.png)

这里要关注一下其中的Forwarding内容，后面的域名就是用来通过公网访问您本地8080端口应用接口的地址了。

是不是超级方便？有没有比国内的那些换皮产品好多了？

> 欢迎关注我的公众号：程序猿DD。第一时间了解前沿行业消息、分享深度技术干货、获取优质学习资源