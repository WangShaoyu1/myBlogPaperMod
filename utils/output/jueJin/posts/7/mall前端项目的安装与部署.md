---
author: "MacroZheng"
title: "mall前端项目的安装与部署"
date: 2019-07-15
description: "本文主要讲解mall前端项目mall-admin-web(2800+star)的在Windows和Linux环境下的安装及部署。mall-admin-web是一个电商后台管理系统的前端项目，基于Vue+Element实现。主要包括商品管理、订单管理、会员管理、促销管理、运营管理…"
tags: ["Vue.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:1,comments:0,collects:3,views:4979,"
---
> SpringBoot实战电商项目mall地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

本文主要讲解mall前端项目mall-admin-web(2800+star)的在Windows和Linux环境下的安装及部署。mall-admin-web是一个电商后台管理系统的前端项目，基于Vue+Element实现。主要包括商品管理、订单管理、会员管理、促销管理、运营管理、内容管理、统计报表、财务管理、权限管理、设置等功能。

Windows下的安装及部署
--------------

### 下载nodejs并安装

下载地址：[nodejs.org/dist/v8.9.4…](https://link.juejin.cn?target=https%3A%2F%2Fnodejs.org%2Fdist%2Fv8.9.4%2Fnode-v8.9.4-x64.msi "https://nodejs.org/dist/v8.9.4/node-v8.9.4-x64.msi")

### 下载mall-admin-web的代码

*   下载地址（github）：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-admin-web "https://github.com/macrozheng/mall-admin-web")
*   下载地址（码云）：[gitee.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fmacrozheng%2Fmall-admin-web "https://gitee.com/macrozheng/mall-admin-web")

### 从IDEA中打开mall-admin-web项目

![展示图片](/images/jueJin/16bf5c5f71f8b0a.png)

### 打开控制台输入命令安装相关依赖

```
npm install
```

![展示图片](/images/jueJin/16bf5c5f7223b28.png)

![展示图片](/images/jueJin/16bf5c5f799f00a.png)

### 已经搭建了mall后台环境的启动

#### 运行本地mall-admin服务

![展示图片](/images/jueJin/16bf5c5f77db9cb.png)

#### 使用命令启动mall-admin-web

*   在IDEA控制台中输入如下命令：

```
npm run dev
```

![展示图片](/images/jueJin/16bf5c5f77ee214.png)

*   访问地址http://localhost:8090 查看效果：
    
    ![展示图片](/images/jueJin/16bf5c5f87c7cd1.png)
    
*   进行登录操作，发现调用的是本地接口：
    
    ![展示图片](/images/jueJin/16bf5c5f9031d42.png)
    

### 未搭建mall后台环境的启动

> 未搭建mall后台的需要使用线上api进行访问，线上API地址：[http://39.98.190.128:8080](https://link.juejin.cn?target=http%3A%2F%2F39.98.190.128%3A8080 "http://39.98.190.128:8080") 。

#### 修改dev.env.js文件中的BASE\_API为线上地址

![展示图片](/images/jueJin/16bf5c5f96edc17.png)

#### 使用命令启动mall-admin-web

*   在IDEA控制台中输入如下命令：

```
npm run dev
```

![展示图片](/images/jueJin/16bf5c5f77ee214.png)

*   访问地址http://localhost:8090 查看效果：
    
    ![展示图片](/images/jueJin/16bf5c5f87c7cd1.png)
    
*   进行登录操作，发现调用的是线上接口：
    
    ![展示图片](/images/jueJin/16bf5c5f978abf3.png)
    

Linux下的部署
---------

*   修改prod.env.js文件的配置
    
    ![展示图片](/images/jueJin/16bf5c5fa9a6f4d.png)
    
*   使用命令进行打包

```
npm run build
```

![展示图片](/images/jueJin/16bf5c5fa24f3e3.png)

*   打包后的代码位置
    
    ![展示图片](/images/jueJin/16bf5c5fbb7608e.png)
    
*   将dist目录打包为dist.tar.gz文件
    
    ![展示图片](/images/jueJin/16bf5c5fbb8a353.png)
    
*   Linux上nginx的安装可以参考[mall在Linux环境下的部署（基于Docker容器）](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2F0fVMK107i5bBq8kGQqg8KA "https://mp.weixin.qq.com/s/0fVMK107i5bBq8kGQqg8KA")中的nginx部分
    
*   将dist.tar.gz上传到linux服务器（nginx相关目录）
    
    ![展示图片](/images/jueJin/16bf5c5fbb8efc3.png)
    
*   使用该命令进行解压操作
    

```
tar -zxvf dist.tar.gz
```

*   删除nginx的html文件夹

```
rm -rf html
```

*   移动dist文件夹到html文件夹

```
mv dist html
```

*   运行mall-admin服务

```
docker start mall-admin
```

*   重启nginx

```
docker restart nginx
```

*   访问首页并登录：[http://192.168.3.101](https://link.juejin.cn?target=http%3A%2F%2F192.168.3.101 "http://192.168.3.101")
    
    ![展示图片](/images/jueJin/16bf5c5fc75e52a.png)
    
*   发现调用的是Linux服务器地址
    
    ![展示图片](/images/jueJin/16bf5c5fd23fee3.png)
    

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fhttps%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-admin-web "https://github.com/macrozheng/https://github.com/macrozheng/mall-admin-web")

公众号
---

[mall项目](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")全套学习教程连载中，**关注公众号**第一时间获取。

![公众号图片](/images/jueJin/16be1360a549872.png)