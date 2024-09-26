---
author: "橙某人"
title: "🚀🚀🚀NestJS入门秘籍🔥🔥🔥"
date: 2024-07-16
description: "Nest(NestJS)是一个用于构建高效、可扩展的Node.js服务器端应用的框架。它使用渐进式JavaScript，构建并完全支持TypeScript（但仍然允许开发者使用纯J"
tags: ["前端","JavaScript","NestJS"]
ShowReadingTime: "阅读19分钟"
weight: 469
---
### 前置条件

保证你的 `NodeJS` 版本是 >= 16 版本的❗  
保证你的 `NodeJS` 版本是 >= 16 版本的❗  
保证你的 `NodeJS` 版本是 >= 16 版本的❗  

重要的事情说三遍。

**管理 `NodeJS` 版本：**

window建议使用 `nvm` 管理：[传送门](https://juejin.cn/post/7079246681639763982 "https://juejin.cn/post/7079246681639763982")。

mac建议使用 `n` 管理：`npm install n -g`。

### 简介

一个用于构建高效、可扩展的 `NodeJs` 服务器端应用的框架。

完全使用 `TS` 进行开发，当然也可以使用纯 `JS` 编码，但最好不要呗，又不是写不起 `TS` ，是吧是吧。😁

在 `Node` 的基础上， `Nest` 又使用了 `Express(默认)/Fastify` 框架，等于它们之间的关系：

NestJS

Express/Fastify

NodeJS

`Express` 框架相信前端的小伙伴应该或多或少有所了解，如果你想构建的服务端并不是很复杂，小型的，并且你还是一名前端人员，那我直接推荐你去使用 `Express` 或 `Koa2` 就行啦😂，`NestJS` 这玩意真有点复杂。

> 本次，咱们的目标就是直接能使用起来，不去细致探究那些概念的东东了，太难懂了😔，像什么IOC-控制反转、DI-依赖注入、DTO-验证、Pipe-管道等等，还是等到使用起来了，遇到不懂的再去查[文档](https://link.juejin.cn?target=https%3A%2F%2Fnest.nodejs.cn%2F "https://nest.nodejs.cn/")吧。

### 安装与使用

全局安装 `NestJS` 脚手架：

javascript

 代码解读

复制代码

`npm i -g @nestjs/cli`

（最好这个全局脚手架还是得装起来，它就像 `Vue` 的 `vue-cli` 一样。）

创建项目：

javascript

 代码解读

复制代码

`nest new 你的项目名称`

启动项目：

javascript

 代码解读

复制代码

`npm run start:dev`

一般小编会自己再配一个相同的 `dev` 命令：

json

 代码解读

复制代码

`{   "script": {     "dev": "nest start --watch",   } }`

直接使用 `npm run dev` 就可以了。😋

默认启动的端口是 `3000` ，如果已经被占用，可以在 `main.ts` 文件中改一下（小编改成了 `3001`），然后直接在浏览器上访问 `http://localhost:3001/` 瞧瞧。

### 目录结构

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2bb3d8b497c4a578e41216a0a34a6b5~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=246&h=525&s=20212&e=png&b=22262c)

目录结构很简洁，现在只有一个根模块（`App`），后续会创建出很多各种模块 `User/Order/...` 等等，`NestJS` 可以说是通过"模块"来管理整个应用的。

文件名

描述

`main.ts`

入口文件，后续全局性的配置会在这里配置。

`app.controller.ts`

定义接口的地方，前端请求过来，最先到达这里。

`app.module.ts`

应用的根模块，后续会创建很多模块，都要在此进行管理

`app.service.ts`

管理数据库的 `CRUD` 操作

`app.controller.spec.ts`

单元测试，不用管它。

### 第一个接口

咱们来到 `app.controller.ts` 文件：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a897356410114b7a8a4888bb6a511358~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=642&h=351&s=26039&e=png&b=272b33)

可以看到，`Nest` 已经帮我们初始了一个接口，也就是我们访问 `http://localhost:3001/` 看到的内容。

咱们也可以手动定义自己的第一个接口，如：

javascript

 代码解读

复制代码

`@Get('/test') getTest(): object {   return { message: '这是我的第一个接口' }; }`

直接访问 `http://localhost:3001/test` 。🚀

`getTest` 名称可以随便取，并没有实际意义，看你心情。

是不是还挺简单😇，如果你要定义Post类型的接口，可以改成这样：

javascript

 代码解读

复制代码

`import { Controller, Get, Post } from '@nestjs/common'; @Post('/test') getTest(): object {   return { message: '这是我的第一个接口' }; }`

简直so easy！

其他类型的接口，照葫芦画瓢。✏

### 第一个模块

接口的定义咱们会了，但我们总不能把所有接口都定义在 `app.controller.ts` 文件中吧，那样太复杂了，不好维护，这个时候就要"模块"上场了。

咱们直接执行以下命令：

javascript

 代码解读

复制代码

`nest g res modules/user`

（小编会把所有模块都放到 `modules` 文件下，个人喜欢）

让你选择，直接两个回车，啥也不要管。👽

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac6854793be34216844e223bb4843dfd~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=737&h=166&s=16479&e=png&b=0d0d0d) ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/860a066faf4449249091d13432ff2d93~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=760&h=75&s=11029&e=png&b=0d0d0d)

然后你就会收获一个**完整**的 `User` 模块。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2af6c57fb82e44b89351e7cb0e74cf2c~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=272&h=411&s=17770&e=png&b=22262c)

这里就不去一一解释每个文件的作用了，反正每次创建一个新模块，你就直接怼上这条命令就行。

> 前期咱们要的就是省事、统一，特殊的情况再特殊处理，日常业务是足够用了，反正呢，写多了、熟了你也就能懂了。👻

模块的其他相关知识：[传送门](https://link.juejin.cn?target=https%3A%2F%2Fnest.nodejs.cn%2Fmodules "https://nest.nodejs.cn/modules")

`User` 模块创建完后，咱们可以直接定义与 `User` 模块相关的接口了，什么都不用管，直接来到 `user.controller.ts` 文件：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8845be3abda434b850ef7306fbf182d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=686&h=817&s=61291&e=png&b=282c34)

默认会帮我们初始化一系列的接口，但一般用不上，全删了得了😂，咱们需要增加自己想要的接口，比如登录接口、获取用户信息接口等等。

增加后，直接就能访问 `http://localhost:3001/user/getUserInfo` 进行使用，省心省力。😌

### 常用命令

既然 `nest g res modules/user` 命令能创建模块，那肯定还有其他命令吧？

当然，你可以通过 `nest --help` 查看 `Nest` 所有相关命令。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ffb5085bd54470ebfb32569e9ba2499~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1247&h=859&s=113516&e=png&b=0d0d0d)

可以看到上面命令中 `res` 是简写，全称是 `resource`，该命令能帮我们生成一个完整的模块。

如不想要完整的模块，我们也可以通过命令手动一个文件一个文件创建，如创建 `user.controller.ts` 文件：

bash

 代码解读

复制代码

`nest g co modules/user`

创建 `user.module.ts` 文件：

bash

 代码解读

复制代码

`nest g mo modules/user`

创建 `user.service.ts` 文件：

bash

 代码解读

复制代码

`nest g s modules/user`

更多的就自己看看囖。🤠

### 配置项目别名@

因为 `Nest` 项目是使用 `TS` 来编写，所以咱们直接在其 `tsconfig.json` 配置文件一下就可以了，如下：

json

 代码解读

复制代码

`{    "compilerOptions": {     // ...     "paths": { "@/*": ["src/*"] }   }  }`

### 配置环境变量

`Nest` 官方提供的配置环境变量的方式：[传送门](https://link.juejin.cn?target=https%3A%2F%2Fnest.nodejs.cn%2Ftechniques%2Fconfiguration%23%25E9%2585%258D%25E7%25BD%25AE "https://nest.nodejs.cn/techniques/configuration#%E9%85%8D%E7%BD%AE")。

但是...读起来稍微有点复杂😵。

接下来，你可以直接跟着小编操作就可以了，如果还不能满足你的需求，你可以再去瞅瞅官网的其他形式。

安装依赖：

javascript

 代码解读

复制代码

`npm install @nestjs/config cross-env -D`

创建 `utils/env.ts` 文件：

javascript

 代码解读

复制代码

`export const DEV = process.env.NODE_ENV === 'development'; export const PROD = process.env.NODE_ENV === 'production'; const envFilePath = ['.env']; if (DEV) {   envFilePath.unshift('.env.dev'); } else {   envFilePath.unshift('.env.prod'); } export default { envFilePath, DEV, PROD };`

在 `app.module.ts` 文件中配置：

javascript

 代码解读

复制代码

`// ... import { ConfigModule } from '@nestjs/config'; import env from '@/utils/env'; @Module({   imports: [     // 配置环境变量     ConfigModule.forRoot({       isGlobal: true,       envFilePath: env.envFilePath,     }),     UserModule,   ],   controllers: [AppController],   providers: [AppService], }) export class AppModule {}`

修改 `package.json` 文件命令：

javascript

 代码解读

复制代码

`{   "scripts": {     "dev": "cross-env NODE_ENV=development nest start --watch",     "build": "cross-env NODE_ENV=production nest build",     ...   } }`

最后，再创建三个配置文件。

`.env` 文件：

javascript

 代码解读

复制代码

`// 可以放一些公共的配置，如密钥等`

`.env.dev` 文件：

javascript

 代码解读

复制代码

`// 可以放置开发环境特有的配置 NAME=开发环境`

`.env.prod` 文件：

javascript

 代码解读

复制代码

`// 可以放置生产环境特有的配置 NAME=生产环境`

使用就和我们前端项目中使用 `process.env` 一致：

javascript

 代码解读

复制代码

`console.log('环境变量', process.env.NODE_ENV); console.log('环境变量', process.env.NAME);`

### 配置session

`Nest` 中的 `session` 方案可以使用 [express-session](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fexpress-session "https://www.npmjs.com/package/express-session") 或 [@fastify/secure-session](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40fastify%2Fsecure-session "https://www.npmjs.com/package/@fastify/secure-session") ，看你自己的 `Nest` 项目使用的是那个框架。

下面以 `express-session` 为例说明。

安装依赖：

javascript

 代码解读

复制代码

`npm install express-session -S`

在 `main.ts` 文件中进行全局配置：

javascript

 代码解读

复制代码

`// ... import * as session from 'express-session'; import { PROD } from '@/utils/env'; async function bootstrap() {   const app = await NestFactory.create(AppModule);   // session   app.use(     session({       name: 'connect.sid', // 设置cookie中存储sessionId的key，默认为connect.sid，在浏览器控制台的 Application-Cookies-Name 能看到这个名称       secret: '密钥', // 必填，最好存在比较安全的地方，比如环境变量       resave: false, // 是否强制保存会话，即使未被修改也要保存。默认为true       cookie: {         maxAge: 10000, // Cookie的过期时间(毫秒)          httpOnly: true, // 是否只以http(s)的形式发送cookie，对客户端js不可用（默认为true，也就是客户端不能以document.cookie查看cookie）         secure: PROD, // 仅在生产环境下开启，增加安全性       }     }),   );   await app.listen(3001); } bootstrap();`

具体使用：

javascript

 代码解读

复制代码

`@Get('/test') getHello(@Req() req): string {   if (req.session.count) {     req.session.count++;   } else {     req.session.count = 1;   }   console.log('req.session.count', req.session.count);   return req.session.count; }`

由于咱们经常会持久化 `session` ，所以一般会将它存在数据库或者 `Redis` 上，这其实也能很简单就配置完成。

以 `Redis` 为例。

安装依赖：

javascript

 代码解读

复制代码

`npm install connect-redis redis`

修改配置：

javascript

 代码解读

复制代码

`// ... import * as redis from 'redis'; import * as connectRedis from 'connect-redis'; async function bootstrap() {   const app = await NestFactory.create(AppModule);   // session   const RedisStore = connectRedis(session);    const redisClient = redis.createClient();   app.use(     session({       store: new RedisStore({ client: redisClient }),       // ...     }),   );   await app.listen(3001); } bootstrap();`

### 全局响应格式拦截器

通常情况下，后端接口会返回具有统一格式的响应数据。这种做法不仅便于前端开发人员进行操作，还能够保持接口返回数据的规范性和一致性。

在 `Nest` 中要做到这个事情，咱们有两部分内容需要处理，分别是"正常"与"异常"情况下的响应。👀

先看瞧瞧正常响应下的，这种情况，我们可以通过 `Nest` 的[拦截器](https://link.juejin.cn?target=https%3A%2F%2Fnest.nodejs.cn%2Finterceptors "https://nest.nodejs.cn/interceptors")来处理。

创建 `utils/response.ts` 文件：

javascript

 代码解读

复制代码

`import { Injectable, NestInterceptor, CallHandler } from '@nestjs/common'; import { Observable, map } from 'rxjs'; import { Reflector } from '@nestjs/core'; interface Data<T> {   data: T; } /** @name 通过拦截器统一响应格式 **/ @Injectable() export class ResponseSuccess<T = any> implements NestInterceptor {   constructor(private readonly reflector: Reflector) {}   intercept(context, next: CallHandler): Observable<Data<T>> {     return next.handle().pipe(       map((response) => {         // 在具体业务中也可以自行定制code         if (response.code) {           const { code, data, message } = response;           return {             data,             code,             message,             success: true,           };         } else {           const { data, message } = response;           return {             data: message ? data : response,             code: 0,             message: message || 'success',             success: true,           };         }       }),     );   } }`

在 `main.ts` 文件中配置使用：

javascript

 代码解读

复制代码

`// ... import { ResponseSuccess } from './utils/response'; import { Reflector } from '@nestjs/core'; async function bootstrap() {   // ...   // 响应格式拦截器   app.useGlobalInterceptors(new ResponseSuccess(new Reflector()));   await app.listen(3001); } bootstrap();`

具体的使用过程：

javascript

 代码解读

复制代码

`// modules/user/user.controller.ts import { Controller, Get, Post } from '@nestjs/common'; import { UserService } from './user.service'; @Controller('user') export class UserController {   constructor(private readonly userService: UserService) {}   @Post('add')   create() {     return '添加成功';   }   @Get('list')   findAll() {     return {       total: 0,       record: [],     };   } }`

咱们在 `modules/user/user.controller.ts` 文件下新定义了两个接口，分别是：

*   Post方式：`http://localhost:3001/user/add`
*   Get方式：`http://localhost:3001/user/list`

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/a655e1ff5a674355a1e6e6198dba854f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5qmZ5p-Q5Lq6:q75.awebp?rk3s=f64ab15b&x-expires=1727751225&x-signature=%2Babbx3X86mCvHX%2F%2BWx5XSn7%2Fctc%3D) ![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/58590431848e411e867d3e98af74965a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5qmZ5p-Q5Lq6:q75.awebp?rk3s=f64ab15b&x-expires=1727751225&x-signature=9FyxMiXawWC6YpGaTNmIFhL8Hfo%3D)

可以看到，小编将接口的响应格式统一成这种形式：

json

 代码解读

复制代码

`{   code: number,   messsage: string,   success: boolean,   data: any, }`

当然，你也可以根据你的需求自行进行调整。😋

### 全局异常过滤器

**响应格式统一**现在还没做完，上面仅是做了正常情况下的响应处理而已，对于异常情况下的响应，我们也要来处理一下。

咱们可以先来看看一些异常情况的响应格式，如：

*   访问的接口不存在

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/acd35695b58d4c20bdd575936d155286~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5qmZ5p-Q5Lq6:q75.awebp?rk3s=f64ab15b&x-expires=1727751225&x-signature=k4fkTBhfCbnQ49Qyzoq%2BL5bTYEI%3D)

*   在具体业务中抛出错误

javascript

 代码解读

复制代码

`@Post('add') create() {   // 抛出错误   throw new Error('添加失败');   return '添加成功'; }`

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/832f2d9d4be9488faa09668d2a3d72c8~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5qmZ5p-Q5Lq6:q75.awebp?rk3s=f64ab15b&x-expires=1727751225&x-signature=Fuo8WlvYoz3%2FkqNJaUdCz7kKb6s%3D)

对于这些响应形式，咱们也应该希望它能有一个统一的响应格式给到前端。😮

在 `Nest` 中有一个内置的异常层，它能帮我们捕获到这些异常，我们可以从这个方面入手，对其格式进行统一。

关于这个异常层的详情，可以自行瞅瞅哈：[传送门](https://link.juejin.cn?target=https%3A%2F%2Fnest.nodejs.cn%2Fexception-filters "https://nest.nodejs.cn/exception-filters")。🎃

接下来，来看看具体如何处理异常情况下的响应格式，还是在 `utils/response.ts` 文件：

javascript

 代码解读

复制代码

`import {   Injectable,   NestInterceptor,   CallHandler,   Catch,   ExceptionFilter,   ArgumentsHost,   HttpException,   HttpStatus,   Logger, } from '@nestjs/common'; import { Observable, map } from 'rxjs'; import { Reflector } from '@nestjs/core'; import { Request, Response } from 'express'; /** @name 通过异常过滤器统一异常格式 **/ @Catch() export class ResponseFail implements ExceptionFilter {   catch(exception: HttpException, host: ArgumentsHost): void {     // 创建一个日志     const logger = new Logger();     // 在后台输出日志     logger.error(exception);     const ctx = host.switchToHttp();     const request = ctx.getRequest<Request>();     const response = ctx.getResponse<Response>();     let status = HttpStatus.INTERNAL_SERVER_ERROR;     let message = 'Internal server error';     if (exception instanceof HttpException) {       // 正常抛出错误       status = exception.getStatus();       if (exception.message) {         message = exception.message;       }     }     response.status(status).json({       status,       message,       success: false,       path: request.url,       timestamp: new Date().getTime(),     });   } }`

在 `main.ts` 文件中配置使用：

javascript

 代码解读

复制代码

`// ... import { ResponseSuccess, ResponseFail } from './utils/response'; import { Reflector } from '@nestjs/core'; async function bootstrap() {   // ...   // 异常过滤器   app.useGlobalFilters(new ResponseFail());   await app.listen(3001); } bootstrap();`

统一异常响应格式后的效果：

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/9e7cabd81a6241ddb4e6d88b1076194b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5qmZ5p-Q5Lq6:q75.awebp?rk3s=f64ab15b&x-expires=1727751225&x-signature=7Tk4ZfzQtGYwgdFiIVEACOMaY6U%3D)![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/3d7666d6a70d40cbb95ee3319967eb8e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5qmZ5p-Q5Lq6:q75.awebp?rk3s=f64ab15b&x-expires=1727751225&x-signature=6BkDPX6rpnkAAWe81kktHiCwh%2B8%3D)

### 元数据

在 `Nest` 中，[元数据](https://link.juejin.cn?target=https%3A%2F%2Fnest.nodejs.cn%2Ffundamentals%2Fexecution-context%23%25E5%258F%258D%25E5%25B0%2584%25E5%2592%258C%25E5%2585%2583%25E6%2595%25B0%25E6%258D%25AE "https://nest.nodejs.cn/fundamentals/execution-context#%E5%8F%8D%E5%B0%84%E5%92%8C%E5%85%83%E6%95%B0%E6%8D%AE")（Metadata）是一个非常重要并基础的概念，它用于存储关于控制器、方法、参数、装饰器等方面的信息。元数据是一种在运行时用于存储和检索额外信息的数据结构，它可以帮助 `Nest` 框架执行各种操作，比如依赖注入、参数解析、中间件执行、路由处理等。

❓❓❓ 一脸懵。。。😇 还是来看看具体的应用过程吧。

创建 `utils/metadata.ts` 文件：

javascript

 代码解读

复制代码

`import { SetMetadata } from '@nestjs/common'; export const SKIP_RS_INTERCEPTOR = 'skip_response_success_interceptor'; /**  * @name 跳过全局成功响应格式拦截器  * @description 通过Metadata添加自定义的元数据、Reflector检索和解析元数据  */ export const SkipResponseSuccessInterceptor = () =>   SetMetadata(SKIP_RS_INTERCEPTOR, true);`

（小编一般会把所有的元数据都放在一个文件中，方便查找😂）

在 `modules/user/user.controller.ts` 文件中使用：

javascript

 代码解读

复制代码

`// ... import { SkipResponseSuccessInterceptor } from '@/utils/metadata'; @Controller('user') export class UserController {   constructor(private readonly userService: UserService) {}   /** @name 验证码 **/   @Get('captcha')   // 跳过响应格式化   @SkipResponseSuccessInterceptor()   captcha() {     return 'abcd';   } }`

咱们增加了一个Get方式的 `http://localhost:3001/user/captcha` 验证码接口，并且该接口多了一个 `@SkipResponseSuccessInterceptor()` 的[装饰器](https://link.juejin.cn?target=https%3A%2F%2Fnest.nodejs.cn%2Fcustom-decorators "https://nest.nodejs.cn/custom-decorators")。

再来到 `utils/response.ts` 文件中：

javascript

 代码解读

复制代码

`// ... /** @name 通过拦截器统一响应格式 **/ @Injectable() export class ResponseSuccess<T = any> implements NestInterceptor {   intercept(context, next: CallHandler): Observable<Data<T>> {     // 获取Metadata自定义元数据     const skipInterceptor = this.reflector.get<boolean>(       SKIP_RS_INTERCEPTOR,       context.getHandler(),     );     console.log(context.args[0].url, 'skipInterceptor：', skipInterceptor);          // ...   } } // ...`

分别去访问 `list` 与 `captcha` 两个接口：

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/c965f9808a574eb6b0e1496823f47d79~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5qmZ5p-Q5Lq6:q75.awebp?rk3s=f64ab15b&x-expires=1727751225&x-signature=2HXDip5dp4rnVjG8%2BhQWcP6DBN4%3D)

呃....能感受出元数据的作用了吗？😋

没有❓

来，继续把验证码接口完善好，先装一下依赖：

javascript

 代码解读

复制代码

`npm install svg-captcha`

接口生成验证码给到前端：

javascript

 代码解读

复制代码

`// modules/user/user.controller.ts // ... import * as svgCaptcha from 'svg-captcha'; @Controller('user') export class UserController {   constructor(private readonly userService: UserService) {}   /** @name 验证码 **/   @Get('captcha')   // 跳过响应格式化   @SkipResponseSuccessInterceptor()   captcha() {     const captcha = svgCaptcha.create({       size: 4,       fontSize: 60,       ignoreChars: '0o1i',       color: true,     });     // session上面咱们可讲过了哦，别忘了     req.session.captcha = captcha.text;     res.type('image/svg+xml');     res.send(captcha.data);   } }`

元数据具体应用：

javascript

 代码解读

复制代码

`// utils/response.ts // ... /** @name 通过拦截器统一响应格式 **/ @Injectable() export class ResponseSuccess<T = any> implements NestInterceptor {   intercept(context, next: CallHandler): Observable<Data<T>> {     // 获取Metadata自定义元数据     const skipInterceptor = this.reflector.get<boolean>(       SKIP_RS_INTERCEPTOR,       context.getHandler(),     );     if (skipInterceptor) {       // 特殊的请求直接跳过拦截器       return next.handle();     }     // ...   } } // ...`

访问 `http://localhost:3001/user/captcha` 验证码接口，会得一个图片数据，就不会是我们接口响应的统一格式的数据了。

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/bd216afac4a94945bc53dadbf0436e73~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5qmZ5p-Q5Lq6:q75.awebp?rk3s=f64ab15b&x-expires=1727751225&x-signature=hAvO1ld8PMeFZ1pg2AVhBd%2FbdFM%3D)

元数据在整个过程扮演了标记的角色，给特殊的接口做了一些特殊的标记，我是这么认为的🤡。当然，它还有很多的应用场景，你可以再仔细去了解一下哈。[传送门](https://link.juejin.cn?target=https%3A%2F%2Fnest.nodejs.cn%2Ffundamentals%2Fexecution-context%23%25E5%258F%258D%25E5%25B0%2584%25E5%2592%258C%25E5%2585%2583%25E6%2595%25B0%25E6%258D%25AE "https://nest.nodejs.cn/fundamentals/execution-context#%E5%8F%8D%E5%B0%84%E5%92%8C%E5%85%83%E6%95%B0%E6%8D%AE")

### 配置JWT策略

呃...关于什么是 `JWT` ❓

就不在这里多说了，应该都耳熟能详的，懂得都懂，咱们直接来看看在 `Nest` 中如何做出这么一套玩意吧。🎃

> 对，今天网上冲浪瞅到一张图，写得挺...画得挺好看💯，可以瞧瞧哈。
> 
> ![04200c758937c4e64c05143532ec28e.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/4454fb45d9fb4f2fa6f529e9b475f034~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5qmZ5p-Q5Lq6:q75.awebp?rk3s=f64ab15b&x-expires=1727751225&x-signature=1QhFbN5k3sVsbSeZMZNhViylZ3o%3D)

先来安装依赖：

javascript

 代码解读

复制代码

`npm install @nestjs/jwt passport-jwt @nestjs/passport`

创建 `utils/jwt/jwt.strategy.ts` 文件：

javascript

 代码解读

复制代码

`import { Injectable } from '@nestjs/common'; import { ConfigService } from '@nestjs/config'; import { PassportStrategy } from '@nestjs/passport'; import { ExtractJwt, Strategy } from 'passport-jwt'; @Injectable() export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {   constructor(private configService: ConfigService) {     // 校验前端传递的token     super({       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //校验逻辑token 已封装       ignoreExpiration: false,       secretOrKey: '密钥....',     });   }   async validate(payload: any) {     // token验证成功后, 会从token里面解析出用户信息, return的信息会被赋值到express的request对象上, 并且属性固定为user     return { id: payload.id, username: payload.username };   } }`

继续创建 `utils/jwt/jwt.guard.ts` 文件：

javascript

 代码解读

复制代码

`import {   ExecutionContext,   Injectable,   UnauthorizedException,   NotFoundException, } from '@nestjs/common'; import { AuthGuard } from '@nestjs/passport'; import { Reflector } from '@nestjs/core'; import { Observable } from 'rxjs'; import { SKIP_PUBLIC_TOKEN_GUARD } from '@/utils/metadata'; @Injectable() export class JwtAuthGuard extends AuthGuard('jwt') {   constructor(private reflector: Reflector) {     super();   }   /**    * @name: 该守护用于验证token    * @description: 每个守护必须实现该方法，返回一个布尔值，是否允许当前请求。https://nest.nodejs.cn/guards    */   canActivate(     context: ExecutionContext,   ): boolean | Promise<boolean> | Observable<boolean> {     // 校验是否是公共路由     const isPublic = this.reflector.getAllAndOverride<boolean>(       SKIP_PUBLIC_TOKEN_GUARD,       [context.getHandler(), context.getClass()],     );     // 公共路由直接跳过     if (isPublic) return true;     // 校验token     return super.canActivate(context);   }   /**    * @name: super.canActivate(context)验完成后调用    * @description: 验完成后调用    * @param {*} error 这是 Passport 策略执行过程中发生的任何潜在错误。如果在验证过程中没有错误发生，这个值通常是 null    * @param {*} user 这是 Passport 策略验证成功后返回的用户对象。如果验证失败，这个值可能是 false 或 null，具体取决于你使用的 Passport 策略    * @param {*} info 如果验证失败，info通常是一个error对象    */   handleRequest(error, user, info) {     if (info || error)       throw new UnauthorizedException('token校验失败，token已经过期');     if (!user) throw new NotFoundException('用户不存在');     return user;   } }`

在 `utils/metadata.ts` 文件中进行元数据配置：

javascript

 代码解读

复制代码

`import { SetMetadata } from '@nestjs/common'; export const SKIP_PUBLIC_TOKEN_GUARD = 'skip_public_token_guard'; /**  * @name 跳过全局Jwt守护  */ export const SkipPublicTokenGuard = () =>   SetMetadata(SKIP_PUBLIC_TOKEN_GUARD, true);`

具体使用，在 `app.module.ts` 文件：

javascript

 代码解读

复制代码

`// ... import { APP_GUARD } from '@nestjs/core'; // JWT import { JwtModule } from '@nestjs/jwt'; import { JwtStrategy } from '@/utils/jwt/jwt.strategy'; import { JwtAuthGuard } from '@/utils/jwt/jwt.guard'; @Module({   imports: [     // ...     // 注册Jwt     JwtModule.register({       global: true,       secret: config.token.secret,       signOptions: { expiresIn: config.token.expiresIn },     }),   ],   controllers: [AppController],   providers: [     AppService,     // 全局注入Jwt策略     JwtStrategy,     // 全局注册jwt验证守卫     {       provide: APP_GUARD,       useClass: JwtAuthGuard,     },   ], }) export class AppModule {}`

通过以上的配置后，现在就无法直接去访问接口了，访问任何接口都需要 `Token` 的验证。

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/23dae5d7c9ed42a7bff56f575d829f0e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5qmZ5p-Q5Lq6:q75.awebp?rk3s=f64ab15b&x-expires=1727751225&x-signature=qHPE%2BivPNEINLpZ361gPc9R4rE8%3D)

而要想正常访问接口，只能有两种形式，其一，携带正确的 `Token` 进行访问，其二，特殊的接口可以通过 `@SkipPublicTokenGuard()` 装饰器跳过 `Token` 的验证。

> 上面，我们通过元数据增加了一个 `@SkipPublicTokenGuard()` 装饰器，它的作用是用来跳过 `Token` 的验证，它能被作用于一些不需要 `Token` 验证的接口。

来看看如何手动跳过 `Token` 的验证：

javascript

 代码解读

复制代码

`// modules/user/user.controller.ts // ... import {   SkipResponseSuccessInterceptor,   SkipPublicTokenGuard, } from '@/utils/metadata'; @Controller('user') export class UserController {   constructor(private readonly userService: UserService) {}   /** @name 验证码 **/   @Get('captcha')   // 跳过token验证   @SkipPublicTokenGuard()   // 跳过响应格式化   @SkipResponseSuccessInterceptor()   captcha() {     const captcha = svgCaptcha.create({       size: 4,       fontSize: 60,       ignoreChars: '0o1i',       color: true,     });     // session上面咱们可讲过了哦，别忘了     req.session.captcha = captcha.text;     res.type('image/svg+xml');     res.send(captcha.data);   } }`

可以看到，验证码接口已经有两个特殊的装饰器了，这也比较符合验证码接口的实际应用逻辑。配置后，再去访问验证码接口就应该是能正确看到验证码图片返回了。

再来看看如何生成 `Token` 并进行正确的访问验证吧，先来增加一个Post方式的 `user/login` 的登录接口：

javascript

 代码解读

复制代码

`// modules/user/user.controller.ts // ... import { JwtService } from '@nestjs/jwt'; @Controller('user') export class UserController {   constructor(     private readonly userService: UserService,     // 注入JWT     private readonly jwtService: JwtService    ) {}   ** @name PC登录 **/   @Post('login')   // 跳过token验证   @SkipPublicTokenGuard()   async login(@Req() req) {     // 生成token     const token = this.jwtService.sign({       id: 1,       username: '橙某人',     });     // 存储session     req.session.token = token;     // 返回token给前端     return token;   } }`

比较简单哈，咱们直接注入 `JWT` 后，通过 `sign()` 就能生成一个 `Token` 给到前端了。

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f32e73fbf9ba47e180c6eb4ae1825d9c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5qmZ5p-Q5Lq6:q75.awebp?rk3s=f64ab15b&x-expires=1727751225&x-signature=igOdbo1CcRmOrXLtYKTWKLoee9Q%3D)

前端拿到 `Token` 后，其他接口要访问后端的话，就需要在 `headers` 身上增加一个 `Authorization` 属性用于携带 `Token` 过来给到后端。

javascript

 代码解读

复制代码

``// 前端部分代码 axios.interceptors.request.use(   (config: AxiosRequestConfig) => {     const token = getToken();     if (token) {       if (!config.headers) {         config.headers = {};       }       config.headers.Authorization = `Bearer ${token}`;     }     return config;   },   (error) => {     return Promise.reject(error);   } );``

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/34bbee7d88f74c97b644289ef607f68f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5qmZ5p-Q5Lq6:q75.awebp?rk3s=f64ab15b&x-expires=1727751225&x-signature=k9%2B%2FAiYTNGU0eDdLnP65QNNWjNk%3D)

> 为什么前端需要在 `Token` 前面增加一个 **Bearer** 单词呢❓ [传送门](https://link.juejin.cn?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2F61d592ae33ee "https://www.jianshu.com/p/61d592ae33ee")

### 连接数据库

以 `Mysql` 为例，需要提前在自己电脑本地安装好 `Mysql` 哦，下载地址：[传送门](https://link.juejin.cn?target=https%3A%2F%2Fdev.mysql.com%2Fdownloads%2Fmysql%2F "https://dev.mysql.com/downloads/mysql/")

> 详情的 `Mysql` 安装过程：[传送门](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fm0_71422677%2Farticle%2Fdetails%2F136007088 "https://blog.csdn.net/m0_71422677/article/details/136007088")

为了更好的操作数据库，咱们可以下载一些可视化的工具来操作数据库，如：[Navicat](https://link.juejin.cn?target=https%3A%2F%2Fnavicat.com.cn%2F "https://navicat.com.cn/")。

也可以直接在 `VSCode` 中安装 `Database Client` 插件，安装之后大概是长这样子：

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/a829ccc3172542d2bd3de68a7981f3bf~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5qmZ5p-Q5Lq6:q75.awebp?rk3s=f64ab15b&x-expires=1727751225&x-signature=sCQJwC6bmZmVckX8juaizvqMSHs%3D)

具体的一些操作，如创建数据库，创建表，创建字段啥的，你就自己耍耍看吧，挺容易使用的。👻

在 `Nest` 中要连接上数据库，还是比较简单的，可以跟着[官网教程](https://link.juejin.cn?target=https%3A%2F%2Fnest.nodejs.cn%2Ftechniques%2Fdatabase "https://nest.nodejs.cn/techniques/database")一步步做就行啦，也可以来看看小编是如何做的。

先来装装依赖：

javascript

 代码解读

复制代码

`npm install @nestjs/typeorm typeorm mysql2 -S`

> 如 `npm install --save @nestjs/typeorm typeorm` 安装不了，可以切换成 `yarn` 下载。

在 `app.module.ts` 文件中配置连接信息：

javascript

 代码解读

复制代码

`// ... @Module({   imports: [     // ...     // 配置数据库连接     TypeOrmModule.forRoot({       type: 'mysql',       host: '127.0.0.1',       port: 3306,       username: 'root',       password: '123456',       database: 'test', // 数据库名       // 自动加载所有的实体类       entities: [__dirname + '/**/*.entity{.ts,.js}'],       // 同步实体类与数据库信息, 这个操作很危险，可能把数据给干没了       synchronize: false,     }),   ],   // ... }) export class AppModule {}`

一定要注意 [synchronize](https://link.juejin.cn?target=https%3A%2F%2Fnest.nodejs.cn%2Ftechniques%2Fdatabase%23sequelize-%25E9%259B%2586%25E6%2588%2590 "https://nest.nodejs.cn/techniques/database#sequelize-%E9%9B%86%E6%88%90") 属性，它用于同步实体类与数据库信息，官网与网上很多都介绍说可以在开发环境开启这个选项，在生产环境再关闭。你可以去这么做，但是，最好在你足够了解实体类与数据库关系的基础下再去开启这个选项；否则，还是建议你关闭这个选项，老老实实写实体类，通过可视化工具去操作操作数据库就行。🥶🥶🥶

然后，在 `modules/user/user.module.ts` 文件中将实体类导入：

javascript

 代码解读

复制代码

`import { Module } from '@nestjs/common'; import { UserService } from './user.service'; import { UserController } from './user.controller'; import { TypeOrmModule } from '@nestjs/typeorm'; // 实例类 import { User } from './entities/user.entity'; @Module({   // 将orm与表关联起来   imports: [TypeOrmModule.forFeature([User])],   controllers: [UserController],   providers: [UserService], }) export class UserModule {}`

前面，咱们通过 `nest g res modules/user` 创建模块，默认都会生成一个 `entities` 的文件夹，该文件夹就是用于存放该模块下的所有实体类的。

> 一直在说 "实体类"，那它是什么呢？
> 
> 可以看看官网的解释：[传送门](https://link.juejin.cn?target=https%3A%2F%2Fnest.nodejs.cn%2Ftechniques%2Fdatabase%23%25E5%25AD%2598%25E5%2582%25A8%25E5%25BA%2593%25E6%25A8%25A1%25E5%25BC%258F "https://nest.nodejs.cn/techniques/database#%E5%AD%98%E5%82%A8%E5%BA%93%E6%A8%A1%E5%BC%8F")。
> 
> 你也可以简单认为它就是数据库的表在 `Nest` 中的描述。

编写实体类：

javascript

 代码解读

复制代码

`// modules/user/entity/user.entity.ts import { Entity, Column, PrimaryGeneratedColumn, AfterLoad } from 'typeorm'; // 关联y_user表 @Entity({ name: 'y_user' }) export class User {   @PrimaryGeneratedColumn()   id: number;      @Column()   username: string; }`

假设咱们现在数据库有一个 `y_user` 表，表中只有 `id` 与 `username` 两个字段，我们想要将这个表的字段全查出来。

在 `modules/user/user.service.ts` 文件：

javascript

 代码解读

复制代码

`import { Injectable } from '@nestjs/common'; import { InjectRepository } from '@nestjs/typeorm'; import { Repository } from 'typeorm'; import { User } from './entities/user.entity'; @Injectable() export class UserService {   constructor(     // 插入User实例类     @InjectRepository(User) private readonly user: Repository<User>,   ) {}   /** @name 查找所有的用户 **/   async list() {     // 通过this.user的实例类直接去查询数据库的y_user表     const data = await this.user.find();     return data;   } }`

通过 `user/list` 接口来查询用户列表：

javascript

 代码解读

复制代码

`// ... @Controller('user') export class UserController {   constructor(     // 注入UserService     private readonly userService: UserService,     private readonly jwtService: JwtService,   ) {}   /** @name 用户列表 **/   @Get('list')   async list(@Req() req) {     // 查询用户列表     const result = await this.userService.list();     return result;   } }`

如果能正确查询到数据库的数据，就说明你的数据库已经连接上了。

> 如出现数据库连不上，可以看看连接信息的 `host` 选项配置，将 `localhost` 改成 `127.0.0.1`。 [传送门](https://link.juejin.cn?target=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F74837366%2Ferror-connect-econnrefused-127-0-0-15432-at-tcpconnectwrap-afterconnect-as-on "https://stackoverflow.com/questions/74837366/error-connect-econnrefused-127-0-0-15432-at-tcpconnectwrap-afterconnect-as-on")

### 接口文档

[nest.nodejs.cn/openapi/int…](https://link.juejin.cn?target=https%3A%2F%2Fnest.nodejs.cn%2Fopenapi%2Fintroduction "https://nest.nodejs.cn/openapi/introduction")

由于，在 `Nest` 中编写的接口都是严格遵从其规范的，所以想要生成一个接口文档，是一件很简单的事情。

安装依赖：

javascript

 代码解读

复制代码

`npm install @nestjs/swagger -S`

在 `main.ts` 文件中配置使用：

javascript

 代码解读

复制代码

`// ... import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; async function bootstrap() {   const app = await NestFactory.create(AppModule);     // 接口文档   const docConfig = new DocumentBuilder()     .setTitle('我的接口文档')     .setDescription('宾至如归，友情长存。')     .setVersion(config.version)     .addTag('hotel')     .build();   const document = SwaggerModule.createDocument(app, docConfig);   SwaggerModule.setup('doc', app, document);      // ...   await app.listen(config.post); } bootstrap();`

然后我们重启项目，直接访问 `http://localhost:3000/doc` 就能看到咱们的文档：

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/8936618104204f24a358873994647d27~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5qmZ5p-Q5Lq6:q75.awebp?rk3s=f64ab15b&x-expires=1727751225&x-signature=%2FbaV3sAw8u7LPvbxVrgY7KI7dog%3D)

挺简单，更多文档相关的配置可以看官网瞧瞧看：[传送门](https://link.juejin.cn?target=https%3A%2F%2Fnest.nodejs.cn%2Fopenapi%2Fintroduction "https://nest.nodejs.cn/openapi/introduction")

### 配置跨域

跨域，一个老生常谈的问题。在上面，咱们还没为项目配置允许跨域机制。

以我们的 `http://localhost:3000/user/captcha` 验证码接口为例，咱们在[掘金](https://juejin.cn/ "https://juejin.cn/")的页面中调出控制台，通过 `fetch` 请求一下验证码接口：

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/421ad18d13d94788aeea4f5dff881655~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5qmZ5p-Q5Lq6:q75.awebp?rk3s=f64ab15b&x-expires=1727751225&x-signature=eww%2FekDEE0OQ6uxDKhC%2FxdJIguE%3D)

果然，很明显的跨域异常。

如何在 `Nest` 中解决这个问题呢？也挺简单，在 `main.ts` 文件中：

javascript

 代码解读

复制代码

`// ... async function bootstrap() {   const app = await NestFactory.create(AppModule);   // ...   // 允许跨域   app.enableCors();   await app.listen(config.post); } bootstrap();`

增加了一个代码，配置后，再次重新访问：

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/1c8353e972cb42aaaf5def2d1af03963~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5qmZ5p-Q5Lq6:q75.awebp?rk3s=f64ab15b&x-expires=1727751225&x-signature=ct3Rchtc2WNotOs764%2FmXwhll0E%3D)

正常了。🥳

在底层，Nest 根据底层平台使用 Express [cors](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fexpressjs%2Fcors "https://github.com/expressjs/cors") 或 Fastify [@fastify/cors](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffastify%2Ffastify-cors "https://github.com/fastify/fastify-cors") 软件包。这些软件包提供了各种选项，你可以根据你的要求进行自定义。[传送门](https://link.juejin.cn?target=https%3A%2F%2Fnest.nodejs.cn%2Fsecurity%2Fcors "https://nest.nodejs.cn/security/cors")

  

* * *

  
  

至此，本篇文章就写完啦，撒花撒花。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2198fba2b674f1b935a63e4abb3cbd7~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=90&h=90&s=8866&e=png&b=fcfcfc)

希望本文对你有所帮助，如有任何疑问，期待你的留言哦。  
老样子，点赞+评论=你会了，收藏=你精通了。