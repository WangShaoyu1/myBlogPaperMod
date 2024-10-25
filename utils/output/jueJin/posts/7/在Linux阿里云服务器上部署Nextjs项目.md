---
author: "Gaby"
title: "在Linux阿里云服务器上部署Nextjs项目"
date: 2021-08-06
description: "部署Next.js项目到阿里云Linux服务器，但是网上大部分文章描述的并不清晰，而且大部分为 Copy 转载，对新手并不友好，因此针对服务器部署进行了整理，方便有需求的朋友使用"
tags: ["前端","Linux中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:22,comments:3,collects:27,views:4565,"
---
### 概述

最近在做一个Nextjs项目,[官网教程](https://link.juejin.cn?target=https%3A%2F%2Fwww.nextjs.cn%2Fdocs%2Fdeployment "https://www.nextjs.cn/docs/deployment")最后一步是部署Next.js项目，但是网上大部分文章描述的并不清晰，而且大部分为 Copy 转载，对新手并不友好，因此自己针对服务器部署进行了整理，方便有自己部署需求的朋友👬🏻

### 需要准备

*   按照Nextjs官网的教程准备一个简单的Next.js APP
*   服务器安装 Node Nginx PM2，配置环境
*   运行程序，保证服务器能正常访问

### 服务器安装 node

此处不表，网上教程较多，本文以部署 Nextjs 为主要目标

### 安装PM2

安装PM2进行线程管理,[PM2官网文档](https://link.juejin.cn?target=https%3A%2F%2Fpm2.keymetrics.io%2Fdocs%2Fusage%2Fquick-start%2F "https://pm2.keymetrics.io/docs/usage/quick-start/")

```js
//全局安装PM2
npm install pm2 -g

//创建软连接 node 路径
ln -s /root/node-v10.14.2-linux-x64/bin/pm2 /usr/local/bin/

// 查看进程
pm2 list

//启动 引号内是线程名
pm2 start npm --name "nextjs" -- run start

//结束线程
pm2 delete nextjs

```

### 部署项目

按照Nextjs官网的教程准备一个简单的Next.js APP

网址：[Nextjs官网](https://link.juejin.cn?target=https%3A%2F%2Fwww.nextjs.cn%2Fdocs%2Fgetting-started "https://www.nextjs.cn/docs/getting-started")

做到打开localhost:3000能访问到页面就行。

然后使用 FTP 软件，将项目上传到服务器中 /var/www/nextjs/ 修改 package.json

```js
    "scripts": {
    "dev": "next dev",
    "build": "next build && PORT=3000 npm start",
    "start": "next start -p $PORT",
    "lint": "next lint"
    },
    
``````js
// 执行并安装相关包
npm install
//或者
yarn install
```

### 解析域名

到域名服务商控制台将域名解析指向到项目部署的服务器

![image.png](/images/jueJin/e7c706b7a15d41b.png)

### 配置 Nginx 配置文件

在nginx目录下的conf.d文件夹下 添加文件wxlvip.conf 该配置文件因每个服务器安装的服务不同，位置也可能会有所不同，按照个人路径进行修改即可

```js
    server {
    listen       80;
    server_name  www.wxlvip.com;
    
        location / {
        #root项目文件的绝对路径
        root /var/www/nextjs;
        proxy_pass http://127.0.0.1:3000/;#改成自己的host 及 端口
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

记得修改完成后，重启服务器。

### 运行项目并访问

进入/var/www/nextjs/目录执行以下命令，并访问 域名 给nextjs 目录及打包生成的目录.nexjs文件夹可写权限

```js
// 执行
pm2 start npm --name "nextjs" -- run build && pm2 save
```

🕯️： 项目已经在运行了。  
接下来打开绑定的域名，正常访问项目。  
看看我的[www.wxlvip.com/](https://link.juejin.cn?target=http%3A%2F%2Fwww.wxlvip.com%2F "http://www.wxlvip.com/")

![image.png](/images/jueJin/7a804297e08d4b9.png)

**文中如有错误，欢迎在评论区指正，如果这篇文章帮到了你，欢迎点赞👍收藏加关注😊，希望点赞多多多多...**