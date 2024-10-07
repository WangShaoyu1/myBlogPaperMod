---
author: "杨成功"
title: "花15分钟把Express.js搞明白，全栈没有那么难"
date: 2024-01-15
description: "Express是老牌的Node.js框架，以简单和轻量著称，几行代码就可以启动一个HTTP服务器"
tags: ["前端","JavaScript","Node.js"]
ShowReadingTime: "阅读8分钟"
weight: 768
---
> 本文截取自[《前端开发实战派》](https://link.juejin.cn?target=https%3A%2F%2Fitem.jd.com%2F14337084.html%23none "https://item.jd.com/14337084.html#none")  
> 加作者好友进 [源码实战群](https://link.juejin.cn?target=https%3A%2F%2Fstatic.ruidoc.cn%2Fruiwx.jpeg "https://static.ruidoc.cn/ruiwx.jpeg")

大家好，我是杨成功。

Express 是老牌的 Node.js 框架，以简单和轻量著称，几行代码就可以启动一个 HTTP 服务器。市面上主流的 Node.js 框架，如 Egg.js、Nest.js 等都与 Express 息息相关。

Express 框架使用标准 Node.js 语法，主要由以下 3 个核心部分组成：

*   路由。
*   中间件。
*   错误处理。

认识基本结构
------

Express 的基本结构很简单，只需要三行代码，应用就可以运行起来。

js

 代码解读

复制代码

`const express = require('express') const app = express() app.listen(9000, () => console.log('启动成功'))`

假设上述代码写在 index.js 中，我们启动该应用使用命令 `node ./index.js`，控制台会输出“启动成功”。

为了方便，我们也可以在 package.json 中创建快捷命令，如下：

json

 代码解读

复制代码

`// package.json {   "scripts": {     "start": "node ./index.js"   } }`

那么现在启动应用就可以用 `npm run start` 命令。

不过这种方式在本地运行项目时会有一个弊端，就是修改文件后不会立即生效，需要重新启动。为了提高效率，一般会使用一个名为 PM2 的模块启动 Node.js 应用。

首先全局安装 pm2：

sh

 代码解读

复制代码

`$ npm install -g pm2`

安装后在项目目录下创建启动配置文件 `ecosystem.config.js`，代码如下：

js

 代码解读

复制代码

`module.exports = {   apps: [     {       name: 'first-api',       script: './index.js',     },   ], }`

然后在项目目录下执行以下命令就可以启动项目了：

sh

 代码解读

复制代码

`$ pm2 start --watch`

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13ee4f901e0543118c36b5cfb05d19b6~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2790&h=320&s=277089&e=png&b=1d2020)

上图中的 `0` 就是启动应用的 ID，下面会用到。

PM2 常用大命令如下：

*   pm2 start：启动应用，--watch 表示监听文件修改自动重启。
*   pm2 list：查看已启动的应用列表。
*   pm2 logs <id>：查看日志输出。
*   pm2 delete <id>：查看日志输出。

应用启动成功后会监听 9000 端口，但我们访问 “[http://localhost:9000”](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A9000%25E2%2580%259D "http://localhost:9000%E2%80%9D") 会发现没有反应，这是因为没有设置如何处理请求。

Express 中通过定义路由来处理请求。

使用路由创建 API 接口
-------------

路由用于定义如何处理请求，定义方式采用以下结构：

js

 代码解读

复制代码

`app.METHOD(PATH, HANDLER)`

其中 app 表示 Express 的实例，其余的三个部分都属于路由配置，表示的含义如下：

*   METHOD：路由方法。
*   PATH：路由地址。
*   HANDLER：路由处理函数。

比如示例代码中的路由是这样子：

js

 代码解读

复制代码

`app.get('/', (req, res) => {   res.send('Hello World') })`

使用`app.get()`定义了一个 GET 请求的路由，第一个参数 “/” 为路由地址，第二个参数为路由处理函数，是一个回调函数，该函数接受两个参数分别表示请求和响应。

当路由方法和路由地址匹配到用户请求时，路由处理函数就会执行。

路由方法根据基本 API 规则支持五种，分别如下：

*   app.get()：GET 请求。
*   app.post()：POST 请求。
*   app.put()：PUT 请求。
*   app.delete()：DELETE 请求。
*   app.all()：匹配所有请求。

以上五个方法的参数都与示例路由一致。定义好路由后，我们的主要任务是在路由处理函数中编写业务代码，一般会包括接收请求参数、返回接口响应，这里要用到路由处理函数的两个参数。

### 请求对象

路由处理函数的第一个参数表示请求对象，包含客户端请求携带的相关数据，常用的属性如下：

*   req.query：URL 附加参数。
*   req.body：请求体参数。
*   req.method：请求方法。
*   req.headers：请求头对象。
*   req.params：URL 地址参数。

现在我们定义一个路由，将请求对象的这几个属性返回，看一下它们的值是什么：

js

 代码解读

复制代码

`app.post('/first/:id', (req, res) => {   let { method, query, body, params, headers } = req   res.send({ method, query, body, params, headers }) })`

在 Postman 中请求地址 “[http://localhost:9000/first/8?tag=test”](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A9000%2Ffirst%2F8%3Ftag%3Dtest%25E2%2580%259D "http://localhost:9000/first/8?tag=test%E2%80%9D") 并传入请求体参数 **{data: "xxx"}**，请求结果如下：

![2023-05-21-14-19-41.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3f2da0d9f6746e6ad130dffb6f64026~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1282&h=792&s=310558&e=png&b=fefefe)

对照请求参数和返回结果，可以发现路由地址中的 `:id` 占位符解析后被放到 “req.params” 对象下。地址参数 `?tag=test` 解析后被放到 “req.query” 对象下。

但是有一个问题：请求体没有被解析出来。

这是因为请求体是按照流处理的，无法直接获取到，我们需要一个第三方工具包协助。首先安装如下：

sh

 代码解读

复制代码

`$ yarn add body-parser`

然后在 index.js 中引入并加载：

js

 代码解读

复制代码

`const bodyParser = require('body-parser') app.use(bodyParser.json())`

现在重新请求，接可以看到 req.body 的返回结果了：

![2023-05-21-14-31-13.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/37af1d19ee624c27b4a89aa4017acf34~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1256&h=490&s=153846&e=png&b=fefefe)

### 响应对象

路由处理函数的第二个参数表示响应对象，用于向客户端返回结果，也就是定义接口的返回值。路由处理函数中必须设置响应，否则客户端请求会一直处于挂起状态，无返回值。

常用的响应方法有以下三种，用于返回不同类型的数据：

*   res.json()：发送 JSON 响应。
*   res.render()：发送视图响应（HTML）。
*   res.send()：发送各种类型的响应。

我们统一使用 res.send() 方法响应数据。一般在响应前还可以通过 res.status() 方法设置 HTTP 状态码，示例如下：

js

 代码解读

复制代码

`res.send('哈哈') // 状态码：200，返回值："哈哈" res.status(201).send({   msg: 'created', }) // 状态码：201，返回值：{msg:"created"} res.status(401).send('请登录') // 状态码：401，返回值："请登录"`

发送响应时也常常会遇到问题，以下两条原则请牢记，避免踩坑：

*   一个路由处理函数中只能响应一次，不能重复响应。
*   res.send() 不能直接返回数字。

### 分组路由

使用 app 实例注册路由固然方便，但是如果定义的路由很多，都注册在 app 实例下很可能会带来全局污染，这与全局变量一个道理。为了应用的健壮性，我们应该将路由分组。

Express 提供了 Router 类来创建模块化的路由程序，它像一个微应用，可以随时被 app 实例挂载。这样就可以把一组路由保存在一个单独的文件中，需要时加载，从而实现路由分组。

创建一个 router 文件夹用于保存路由文件，然后创建 `router/test.js` 文件，在文件中呢写入路由代码，如下：

js

 代码解读

复制代码

`// router/test.js var express = require('express') var router = express.Router() router.post('/info', (req, res) => {   res.send('TEST 路由组') }) module.exports = router`

这样一个基本的路由模块就写好了，如果让其生效，需要在主程序中加载该模块：

js

 代码解读

复制代码

`const testRouter = require('./router/test.js') app.use('/test', testRouter)`

上述代码表示请求 “/test” 时加载路由模块，访问某个路由时使用该路径拼接路由地址，像下面这样：

bash

 代码解读

复制代码

`http://localhost:9000/test/info # 返回 "TEST 路由组"`

为了开发规范，我们统一把路由定义为路由模块，而不直接在 app 下注册。

理解中间件，搞懂框架原理
------------

Express 应用是由一系列中间件构成的。中间件同样是一个听着很玄乎的词儿，但它的本质就是一个函数。我们看一个中间件函数的代码示例：

js

 代码解读

复制代码

`var myLogger = function (req, res, next) {   console.log('LOGGED')   next() }`

中间件与普通函数的区别就是它有三个参数，分别表示请求对象（req），响应对象（res）和一个 next() 函数 ——— 也许你发现了，路由处理函数也是这个结构。

没错，路由处理函数本身就是一个中间件。

将中间件挂载到应用上，使用 app.use() 方法：

js

 代码解读

复制代码

`app.use(myLogger)`

看到这里你又会发现，请求体解析包 `body-parser` 也是这么挂载的，因为该包也是一个中间件。

直接用 app.use() 挂载的中间件在收到任意请求时都会执行。如果要限定执行条件，可以添加一个路径匹配，如下：

js

 代码解读

复制代码

`app.use('/test/*', myLogger)`

这样，只有以 `/test` 开头的请求才会执行 myLogger 中间件，这看起来与路由注册很相似。其实注册路由正是这种中间件挂载方式的快捷写法，只不过多了一个请求方法的限制。

Express 应用中一切皆中间件，如果匹配到多个中间件会按照顺序依次调用。此时 next() 函数就能派上用场了，他的作用是进入下一个中间件。

比如代码中的 myLogger 中间件，将它挂载到路由之前，那么每次请求首先会打印出 “LOGGED”，然后再进入路由处理函数。

如果 myLogger 中间件中没有调用 next() 函数，请求就会被堵在这里，无法进入路由处理函数，此时请求会被挂起。

统一错误处理，提升健壮性
------------

既然一切皆中间件，那么错误处理也是一个中间件。错误处理函数与其他的中间件函数稍有不同，它多了一个 err 参数，如下：

js

 代码解读

复制代码

`app.use((err, req, res, next) => {   console.error(err.stack)   res.status(500).send('服务器出错了!') })`

err 参数表示错误信息，当发生错误时进入该中间件，此时要设置 HTTP 状态码为 500，并根据错误信息为客户端返回错误响应。

错误处理中间件是一个兜底中间件，请确保它定义在所有中间件之后，是应用中的最后一个中间件。

请求进入错误中间件，说明前面的所有中间件都没有匹配到。但是如果客户端请求地址写错而进入错误处理中间件，此时返回 500 错误显然不合理，应该是 404 资源未找到。

所以在错误处理中间件前，还应该定义一个 404 中间件。该中间件要在所有路由之后，错误处理之前，是应用的倒数第二个中间件，代码如下：

js

 代码解读

复制代码

`app.use((req, res, next) => {   res.status(404).send('Not Found') })`

好了，现在我们的应用就健壮多了。

总结
--

本文列举了 Express 框架的核心，并举例如何应用，整体并没有那么难。掌握这部分知识，可以快速拥 API 开发的思维。

本文截取自我的新书[《前端开发实战派》](https://link.juejin.cn?target=https%3A%2F%2Fitem.jd.com%2F14337084.html%23none "https://item.jd.com/14337084.html#none")，在这本书中我就用 Express + MongoDB 开发了一个复杂的全栈项目，并且开源，源码在 [GitHub](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fruidoc%2Fjueblog-combat "https://github.com/ruidoc/jueblog-combat")。

更多系列文章，查看我的公众号 [程序员成功](https://link.juejin.cn?target=https%3A%2F%2Fwww.ruims.top%2Fstatic%2Fwxpub.png "https://www.ruims.top/static/wxpub.png")。