---
author: "哆啦好梦"
title: "Electron-egg，人人都会桌面软件开发"
date: 2021-10-18
description: "目前国内的开发者将近700万，桌面软件受限于学习门槛和移动化趋势，渐渐平庸。但我们日常工作中，又离不开桌面软件，因此希望有一个学习门槛低，支持多平台的软件框架。electron-egg就是在这种需求下"
tags: ["JavaScript","Electron"]
ShowReadingTime: "阅读2分钟"
weight: 399
---
目前国内的开发者将近700万，桌面软件受限于学习门槛和移动化趋势，渐渐平庸。但我们日常工作中，又离不开桌面软件，因此希望有一个学习门槛低，支持多平台的软件框架。electron-egg就是在这种需求下，诞生的。

electron-egg是一个简单、快速、功能丰富的JS跨平台桌面软件开发框架，您只需懂js语言就能开发。

*   🏆 码云最有价值开源项目
*   地址：[gitee.com/wallace5303…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fwallace5303%2Felectron-egg "https://gitee.com/wallace5303/electron-egg")

特性
--

1.  跨平台：一套代码，可以打包成windows版、Mac版、Linux版或者以web网站运行
2.  简单高效：支持vue、react、ejs等前端技术
3.  工程化：可以用服务端的开发思维，来编写桌面软件
4.  高性能：可启动多个工作进程
5.  功能丰富：服务端的技术场景都可以使用，如：路由、中间件、控制器、服务、定时任务、队列、插件等
6.  功能demo：桌面软件常见功能，后续逐步集成并完善或提供demo
7.  更多功能请看文档

最近更新
----

1.  增加chrome扩展程序
2.  增加web(html)内容嵌入
3.  增加多窗口打开
4.  增加桌面通知
5.  增加电源监控
6.  增加获取显示器信息
7.  增加系统主题设置
8.  修改功能分类

使用场景
----

### 1\. 常规桌面软件

*   demo
    
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/393943b472f2463f98c334620bff4efa~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0cf20a5f5f5c45cab86afbe97e25488b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
    

### 2\. 游戏（h5相关技术开发）

*   忍者100层
    
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9e8af827fe048c59b358f374a4a4dc7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
    

### 3\. 任意网站变桌面软件

*   Youtube
    
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52d852818e2f43c3b8499caa9f8a4a40~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
    
*   discuz-q论坛
    
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f55967f153a49aa9b0a0194b079dcab~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
    

### 4\. web项目

*   网站助手：[b.kaka996.com/](https://link.juejin.cn?target=http%3A%2F%2Fb.kaka996.com%2F "http://b.kaka996.com/")
    
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b90535f34cb4f34899a19c83052d1a1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
    

开始使用
----

1.  下载
    
    bash
    
     代码解读
    
    复制代码
    
    `# gitee git clone https://gitee.com/wallace5303/electron-egg.git # github git clone https://github.com/wallace5303/electron-egg.git`
    
2.  安装
    
    bash
    
     代码解读
    
    复制代码
    
    `# 提升安装速度，使用国内镜像； npm config set registry https://registry.npm.taobao.org # 进入目录 ./electron-egg/ npm install`
    
3.  常用命令
    
    bash
    
     代码解读
    
    复制代码
    
    `# 开发者模式     # 1：【进入前端目录】，启动vue     cd frontend && npm install && npm run serve          # 2：【根目录】，启动后端服务     cd ../ && npm run dev # 预发布模式（环境变量为：prod） npm run start # 打包-windows版本 npm run build-w (32位) npm run build-w-64 (64位) # 打包-mac版本 npm run build-m npm run build-m-arm64 (苹果M1芯片架构) # 打包-linux版本 npm run build-l # web运行-开发模式 npm run web-dev # web运行-生产者模式-启动 npm run web-start # web运行-生产者模式-停止 npm run web-stop`
    

期待您的尝试