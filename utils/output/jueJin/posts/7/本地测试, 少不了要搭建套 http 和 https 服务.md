---
author: "Gaby"
title: "本地测试, 少不了要搭建套 http 和 https 服务"
date: 2022-05-31
description: "为了让前端更方便的测试打包后的文件在服务器上是否能正常显示，有必要单独弄一个 `http` 和 `https` 服务进行测试用，当然有条件的，你也可以在本地部署个 `nginx` 服务，都可以。"
tags: ["前端","JavaScript","测试中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:9,comments:7,collects:9,views:2090,"
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第4天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

废话只说一句：码字不易求个👍，收藏 === 学会,快行动起来吧！🙇‍🙇‍🙇‍。

为了让前端更方便的测试打包后的文件在服务器上是否能正常显示，有必要单独弄一个 `http` 和 `https` 服务进行测试用，当然有条件的，你也可以在本地部署个 `nginx` 服务，都可以，多多益善，但是还是以简单方便为主。

首先进入要建立 HTTPS 服务的目录，并进入

### 初始化

先初始化项目，生成 `package.json` 文件

```js
// 初始化项目
yarn init -y
// or
npm init -y
```

### 安装服务

先安装 `http-server` 服务

```js
yarn add http-server
```

### 生成证书

```js
// 生成证书 命令 ①
openssl genrsa -out key.pem 1024
```

此时当前文件夹内会生成 `key.pem`

![image.png](/images/jueJin/b220679a287f4de.png)

```js
// 生成证书 命令 ②
openssl req -new -key key.pem -out csr.pem
```

执行命令按照提示填写下地址和邮箱信息，这个怎么写就随意了，也许可以一路回车下去呢！

此时当前文件夹内会生成 `csr.pem`

![image.png](/images/jueJin/dcadf9dbe3e24e1.png)

```js
// 生成证书 命令 ③
openssl x509 -req -in csr.pem -signkey key.pem -out cert.pem
```

此时当前文件夹内会生成 `cert.pem` ![image.png](/images/jueJin/2207b445d5f643f.png)

PS：这种没有经过机构验证证书浏览器会有提示信任了就好

### 配置服务

证书生成完毕后，配置启动 `http` 和 `https` 服务的命令,打开 `package.json` 文件，添加如下命令：

```js
    "scripts": {
    "http": "http-server dist",
    "https": "http-server -S dist"
}
```

其中 `dist` 文件夹是为了存放服务文件用的，比如可以将 vue 打包好的文件放到这个目录里，将这个目录名定义为 `dist`，也是为了方便测试 vue 打包后的项目。这样就可以将 vue 打包后的文件直接复制到根目录即可。

### 完工

完整的 `package.json` 文件内容如下：

```js
    {
    "name": "server",
    "version": "1.0.0",
    "main": "index.js",
    "license": "MIT",
        "scripts": {
        "dev": "http-server dist",
        "https": "http-server -S dist"
        },
            "dependencies": {
            "http-server": "^14.1.0"
        }
    }
```

整个工程目录截图放这，供参考：

![image.png](/images/jueJin/a8ed9ce1fc524c4.png)