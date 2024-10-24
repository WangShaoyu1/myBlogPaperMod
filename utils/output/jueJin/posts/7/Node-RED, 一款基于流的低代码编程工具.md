---
author: "徐小夕"
title: "Node-RED, 一款基于流的低代码编程工具"
date: 2021-04-18
description: "笔者最近在逛github社区的时候发现一个非常有意思的工具—— Node-RED, 以lowcode的形式对Nodejs应用做可视化编排"
tags: ["前端","Node.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:54,comments:0,collects:59,views:6973,"
---
![](/images/jueJin/0586e59a7ed64aa.png)

笔者最近在逛`github`社区的时候发现一个非常有意思的工具—— **Node-RED**, 官网非常简洁, 接下来我就来给大家介绍一下该工具和使用方法.

**Node-RED** 是一种编程工具，用于以新颖有趣的方式将**硬件设备**，**API**和**在线服务**连接在一起。

它提供了一个基于浏览器的编辑器，使得我们可以轻松地使用编辑面板中的各种节点将流连接在一起，只需单击即可将其部署到其运行时。界面如下:

![](/images/jueJin/ec9a77c918ec4ba.png)

### 基于浏览器的流程编辑

![](/images/jueJin/e780352ba461427.png)

**Node-RED** 可以在本地安装, 并通过浏览器来访问其可视化编排界面, 其次我们还可以使用富文本编辑器在编辑器中创建`JavaScript`函数, 内置库还允许我们保存有用的功能，模板或流程以供重复使用。如下:

![](/images/jueJin/79ab99b6527746d.png)

### 建立在Node.js之上

![](/images/jueJin/3e3a21d9173643b.png)

轻量级运行时基于`Node.js`构建，充分利用了事件驱动的非阻塞模型。这使得它非常适合在低成本的硬件（如`Raspberry Pi`）上的网络边缘以及云中运行。

`Node`的软件包存储库中有超过`225,000`个模块，可以轻松扩展面板节点的范围以添加新功能。

### 社区共享

![](/images/jueJin/c9e9a3bff71c4a8.png)

在`Node-RED`中创建的流使用`JSON`存储，可以轻松导入和导出以与他人共享。 在线流程库使我们可以与世界分享最佳流程。

### 安装和使用

`Node-RED`的安装和使用也非常简单, 笔者这里介绍一下基本的安装方式.

我们需要先在电脑中全局安装`Nodejs`, 大家可以在官网自行下载. 其次我们输入如下命令下载`Node-RED` :

```bash
sudo npm install -g --unsafe-perm node-red
```

出现如下界面就说明已经安装成功了.

![](/images/jueJin/caf7c2f63bff4f2.png)

最后执行:

```bash
node-red
```

即可启动`Node-RED`服务, 我们在浏览器输入终端打印的如下地址即可访问使用:

![](/images/jueJin/bd34be50a6ca42c.png)

运行后的界面如下:

![](/images/jueJin/144ec4669994418.png)

![](/images/jueJin/0505ef2e2fdc4f5.png)

![](/images/jueJin/4a3cb50cdfa6487.png)

### 最后

最近我们的主要方向是`H5-Dooring`编辑器2.0的开发和可视化大屏搭建平台的升级和优化, 后面会出线上版demo, 欢迎大家把玩.

更多开源可视化产品:

*   [H5-dooring H5页面编辑器](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://github.com/MrXujiang/h5-Dooring")
*   [PC-Dooring PC端页面编辑器](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fpc-Dooring "https://github.com/MrXujiang/pc-Dooring")
*   [V6.Dooring 可视化大屏编辑器](https://link.juejin.cn?target=http%3A%2F%2Fv6.dooring.cn%2Fbeta "http://v6.dooring.cn/beta")

> 觉得有用 ？喜欢就收藏，顺便点个赞吧，你的支持是我最大的鼓励！微信搜 “**趣谈前端**”，发现更多有趣的H5游戏, webpack，node，gulp，css3，javascript，nodeJS，canvas数据可视化等前端知识和实战.