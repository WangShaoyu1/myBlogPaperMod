---
author: "Gaby"
title: "Nextjs 配置接口跨域代理转发"
date: 2021-08-17
description: "在开发Nextjs 项目中，是少不了与服务器交互的，因此跨域的情况也是在所难免，但配置也并没有想象中的那么难。来跟着我做，让开发闭环。"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读1分钟"
weight: 1
selfDefined:"likes:11,comments:0,collects:11,views:7663,"
---
**这是我参与8月更文挑战的第15天，活动详情查看：[8月更文挑战](https://juejin.cn/post/6987962113788493831 "https://juejin.cn/post/6987962113788493831")**

在开发Next.js 项目中，是少不了与服务器交互的，因此跨域的情况也是在所难免，但配置也并没有想象中的那么难。

### package.json 配置

根据配置版本对比环境是否存在差异，毕竟`http-proxy-middleware`不同版本间引入的方式有所不同，引入错了则会报错就是因为版本问题

```js
    {
    "name": "jianxl",
    "version": "0.1.0",
    "private": true,
        "scripts": {
        
        "dev": "next dev",
        "build": "next build && PORT=3000 npm start",
        "start": "next start -p $PORT",
        "server": "node server.js",
        "lint": "next lint"
        },
            "dependencies": {
            "axios": "^0.21.1",
            "express": "^4.17.1",
            "http-proxy-middleware": "^2.0.1",
            "next": "11.0.1",
            "qs": "^6.10.1",
            "react": "17.0.2",
            "react-dom": "17.0.2",
            "sass": "^1.37.5"
            },
                "devDependencies": {
                "eslint": "7.32.0",
                "eslint-config-next": "11.0.1"
            }
        }
```

### 准备

使用 `create-next-app` 创建的 `Next.js` 项目配置接口跨域代理转发需要用到 `custom` `server` 功能。先安装好 `express` 和 `http-proxy-middleware`

```js
npm install express http-proxy-middleware --save
// 或者
yarn add express http-proxy-middleware --save
```

### 创建代理配置

在根目录创建 `server.js` 文件

```js
const express = require('express')
const next = require('next')
const {createProxyMiddleware } = require('http-proxy-middleware')

    const devProxy = {
        '/api': {
        target: 'http://127.0.0.1:7001', // 端口自己配置合适的
            pathRewrite: {
            '^/api': '/'
            },
            changeOrigin: true
        }
    }
    
    const port = parseInt(process.env.PORT, 10) || 3000
    const dev = process.env.NODE_ENV !== 'production'
        const app = next({
        dev
        })
        const handle = app.getRequestHandler()
        
        app.prepare()
            .then(() => {
            const server = express()
                if (dev && devProxy) {
                    Object.keys(devProxy).forEach(function(context) {
                    server.use(createProxyMiddleware(context, devProxy[context]))
                    })
                }
                
                    server.all('*', (req, res) => {
                    handle(req, res)
                    })
                    
                        server.listen(port, err => {
                            if (err) {
                            throw err
                        }
                        console.log(`> Ready on http://localhost:${port}`)
                        })
                        })
                            .catch(err => {
                            console.log('An error occurred, unable to start the server')
                            console.log('发生错误，无法启动服务器')
                            console.log(err)
                            })
```

因为版本问题 `http-proxy-middleware` 可能会报错

```js
// 1.0.0以上引入方式:
const {createProxyMiddleware } = require('http-proxy-middleware')
// 1.0.0以下引入方式:
const createProxyMiddleware  = require('http-proxy-middleware')
```

配置完成后重启