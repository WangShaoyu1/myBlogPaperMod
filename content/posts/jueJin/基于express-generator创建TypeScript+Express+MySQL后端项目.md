---
author: "non_hana"
title: "基于express-generator创建TypeScript+Express+MySQL后端项目"
date: 2023-07-31
description: "简单的记录一下项目创建的历程：Express+TypeScript+Node.js+MySQL。因为目前网上的教程好像挺少的，所以决定自己写一个。希望对大家有帮助！"
tags: ["后端","TypeScript"]
ShowReadingTime: "阅读10分钟"
weight: 484
---
1\. 背景说明
--------

最近由于自己的技术栈进步需要，我在将我的前端项目从原本的`Vue2.0+Vuex+ElementUI+JavaScript`重构成了`Vue3.0+Pinia+ElementPlus+TypeScript`之后，我打算趁刚刚熟练完`TypeScript`的机会，也将我原本使用`JavaScript`编写的`Express`后端代码也一并的进行`TypeScript`的重构。

但是，众所周知，`Express`作为一个极其轻量级的`Node.js`后端框架，你只要安好`express`的依赖，就可以直接编写`app.js`然后往里面加接口、加监听，最后用`node`或者`nodemon`启动一下就好了；虽然简单易起服务，但是想要使其能够担起规范化、易维护的职责，还是需要有一套规范的框架、文件结构目录来创建。在这里，我选择了`express`官方提供的一套脚手架`express-generator`来完成初始项目的创建。但是官方貌似没有随着`TypeScript`的流行进一步的升级它们的脚手架，因此生成的目录结构还是`JavaScript`的。为了更好的配合前端接口的数据规范化，将其改造成`TypeScript`是大势所趋。

鉴于目前网络上相关的教程较少，我决定自己总结一下我的项目创建历程，供大家参考。

2\. 项目创建+改造流程说明
---------------

### 2.1 使用express-generator创建基本目录结构

首先，全局安装`express-generator`依赖（之前装过的就不用装了）：

bash

 代码解读

复制代码

`npm install express-generator -g`

安装完成之后，切到你想新建项目的文件夹里面，打开`powershell`，在里面输入如下命令：

bash

 代码解读

复制代码

`# 我这边用ts-express作为我的项目名称，实际创建时根据自身需要进行更改 express ts-express`

之后用`vscode`或者其他的`IDE`打开它，然后在终端输入`npm install`进行依赖的安装。

最终初步通过`express-generator`创建的目录结构如下图所示：

![image-20230731135027688](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ddc854be4f494205b894dd125a0a798e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=374&h=647&s=34274&e=png&b=f8f8f8)

其中：

*   bin/www：是整个项目的启动脚本，内部配置了很多和服务启动相关的选项。
*   public：公共资源，比如前端传给后端图片，后端拿到之后就放在public/images目录里面。
*   routes：路由模块，配置的就是你和前端相交互的接口。
*   views：视图模块，包括了一些基础的请求渲染视图。.jade文件是一种模板引擎文件，通常用于创建HTML文档。它以简洁、缩进层次分明的方式来表示HTML标记和结构，是一种被称为Jade的模板语言的源文件格式。当请求的接口不存在或者发生错误的时候，就会调用这些视图。
*   app.js：express的入口程序，也是整个express的核心模块。app的主要功能有：
    1.  注册第三方的Node.js插件。在创建express项目的时候，肯定要用到很多第三方的库里面提供的方法，这时候就需要先通过npm进行下载，之后在app.js里面进行引入，再通过`app.use()`进行注册。
    2.  注册路由模块。引入routes里面写好的路由接口文件，通过`app.use()`进行注册并指定请求的`url`。
    3.  配置全局错误中间件。一般发生请求错误的时候，可以直接通过在app.js里面配置全局错误中间件捕获错误并抛出，这样就不会因为请求错误而使得后端服务崩溃而自动关闭。

### 2.2 进行TypeScript改造

在进行TS改造之前，需要安装与TS相关的依赖（之前安装过的就不用装了）：

bash

 代码解读

复制代码

`npm install typescript -D npm install ts-node -g npm install ts-node-dev -g`

进行TS项目的初始化，生成`tsconfig.json`：

bash

 代码解读

复制代码

`tsc --init`

然后把原项目中所有的JS文件统统改成TS文件，把bin目录下的www改成server.ts：

![image-20230731141110016](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/06e3127de71f4557b7e78af21a629d6f~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=376&h=670&s=38114&e=png&b=f8f8f8)

之后会发现一大堆的错，慢慢来修复就可以了。

1.  app.ts改造
    
    在app.ts当中，把所有的CommonJS语法的同步引入require全部换成ES6的import异步引入即可。如：
    
    js
    
     代码解读
    
    复制代码
    
    `var express = require('express');`
    
    换成：
    
    typescript
    
     代码解读
    
    复制代码
    
    `import express from "express";`
    
    然后把末尾的模块导出也换成export default默认导出。
    
    javascript
    
     代码解读
    
    复制代码
    
    `module.exports = app;`
    
    换成：
    
    typescript
    
     代码解读
    
    复制代码
    
    `export default app;`
    
    然后把里面所有的var全部换成const。
    
    上述步骤完成之后，会发现有很多的包引入错误：
    
    ![image-20230731141702715](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71089e9d520740a7bedca3dc512ef5d5~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=598&h=265&s=41624&e=png&b=fffefe)
    
    因为我们还没有安装对应包的类型声明。
    
    运行以下命令进行安装：
    
    bash
    
     代码解读
    
    复制代码
    
    `npm install @types/node @types/express @types/http-errors @types/cookie-parser @types/morgan @types/debug -D`
    
    下面两个路由的报错，我们按照改造app.ts的前三步对路由文件进行改造就可以了，也就是把引入模块、导出模块的方式改一下，然后把var改成const就可以。
    
    把上面的类型报错解决了之后，app.ts中只剩下错误处理器的4个报错：
    
    ![image-20230731142321650](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0aef9053b9a4607bd7e676274d2d3cb~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=952&h=340&s=43046&e=png&b=ffffff)
    
    比较明显，是因为参数类型推断不出来。我们在最后加一个对这个函数的Express中错误处理函数的类型推断就可以了：
    
    typescript
    
     代码解读
    
    复制代码
    
    `// error handler app.use(function (err, req, res, next) {   // set locals, only providing error in development   res.locals.message = err.message;   res.locals.error = req.app.get("env") === "development" ? err : {};   // render the error page   res.status(err.status || 500);   res.render("error"); } as express.ErrorRequestHandler);`
    
    至此，app.ts的报错就已经全部解决了。
    
2.  server.ts改造
    
    也和改造app.ts同理，先把require换成import，然后把var全换成const。因为没有导出，所以不用改导出方式。
    
    完成后，会发现三个报错：
    
    ![20230731142921046](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9172ff2be4d0482d985788a1fbbc0eb3~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1055&h=763&s=58217&e=png&b=ffffff)
    
    其中的val和error报错，可以直接加个any解决报错；最下面的addr的报错，根据提示是因为：
    
    ![image-20230731143027257](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c3fa1b0c03f45dab29020b6587af630~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1350&h=307&s=49249&e=png&b=fefefe)
    
    因为`addr`可能为`null`，所以不能用`.`选择属性。因为我们这边确定`addr`不为`null`，所以我们只用加上非空断言操作符`!`就可以了。
    
    typescript
    
     代码解读
    
    复制代码
    
    `function onListening() {   const addr = server.address();   const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr!.port;   debug("Listening on " + bind); }`
    
    至此，server.ts的报错就已经全部解决了。
    
3.  配置tsconfig.json输出目录+package.json启动运行脚本
    
    上面的两步都处理好之后，就可以进行编译输出目录的配置。因为最后我们启动服务还是需要采用`JavaScript`的形式，`TypeScript`只是我们编写代码的工具。
    
    打开tsconfig.json，找到"outDir"配置项，把它打开，并配置编译输出的目录"./dist"：
    
    ![image-20230731143952577](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fef93f20b7894b4daa4566a1c8ba385c~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=568&h=293&s=32833&e=png&b=ffffff)
    
    但是要注意，**ts只是将编译的文件放入到了dist中，但是public和views这些静态的资源没有被打包进去**。
    
    所以要再继续配置静态资源的打包路径。我们在这里使用`shelljs`进行配置。
    
    ShellJS是一个基于Node.js的包，它提供了一组简单的命令行工具，让你可以在Node.js环境下使用类似于Unix shell（如Bash）的命令。它在Node.js中提供了一个简单的、易于使用的接口，用于执行常见的Shell命令、操作文件系统和进行其他常见的命令行任务。
    
    安装`shelljs`及其声明文件：
    
    bash
    
     代码解读
    
    复制代码
    
    `npm i shelljs @types/shelljs -D`
    
    在根目录新建一个文件：`copyStatic.ts`，代码如下：
    
    typescript
    
     代码解读
    
    复制代码
    
    `import * as shelljs from "shelljs"; shelljs.cp("-R" , "public" , "dist"); shelljs.cp("-R" , "views" , "dist");`
    
    这段代码的用途是将当前目录中的`public`目录和`views`目录，以及它们的所有子目录和文件，递归地复制到名为`dist`的目录中。
    
    安装`nodemon`模块，可以自动监听项目文件的变化，会自动的重启项目：
    
    bash
    
     代码解读
    
    复制代码
    
    `npm install nodemon -D`
    
    完成后，在package.json内部修改脚本：
    
    json
    
     代码解读
    
    复制代码
    
    `{   // ...   "scripts": {     "start": "nodemon ./dist/bin/server.js",     "copy-static": "ts-node copyStatic.ts",     "ts-build": "tsc",     "build": "npm run ts-build && npm run copy-static"   },   // ... }`
    
    *   start：对应启动服务。
    *   copy-static：使用ts-node运行copyStatic.ts文件内容，拷贝静态文件资源到dist目录下。
    *   ts-build：运行tsc，打包ts项目，根据outDir输出到对应的目录下。在我们这边就是dist目录下。
    *   build：就是第二条+第三条命令一起运行。
    
    完成后，在tsconfig.json增加：
    
    json
    
     代码解读
    
    复制代码
    
    `{   "compilerOptions": {     //...   },   “exclude”: [     “copyStatic.ts”   ] }`
    
    以排除对copyStatic.ts文件的编译，不打到dist里面。
    
4.  和MySQL数据库建立连接
    
    上述步骤完成之后，就可以开始建立和MySQL数据库的连接了。
    
    首先安装mysql相关的依赖：
    
    bash
    
     代码解读
    
    复制代码
    
    `npm install mysql @types/mysql -D`
    
    然后在根目录下新建`database`目录，再在里面新建`index.ts`文件，之后再里面就可以配置自己想要链接的数据库选项了。下面给出模板：
    
    typescript
    
     代码解读
    
    复制代码
    
    `// 导入mysql模块 import mysql from "mysql"; // 创建数据库连接对象 const db = mysql.createPool({   host: "你想连接的数据库的IP地址，本地的就默认127.0.0.1",   user: "你的用户名",   password: "你的密码",   database: "你想连接到的数据库", }); // 向外共享db数据库连接对象 export default db;`
    
    当然，想要正式进行开发的同学可以在本地编写`.env`文件，将数据库之类的环境信息配置全部塞到这个文件里面，然后再借助如`dotenv`之类的第三方库来对你的`process.env`进行统一管理，最后把数据库的配置文件和连接文件分离，可以确保数据库连接的隐蔽性和可维护性。
    
    上述文件编写好了之后，就可以导入它，并在对应的接口中进行数据库的操作了，这个放在后面说。
    
5.  routes和controller分离
    
    原本的express-generator给我们生成的routes目录下的文件：index.ts和users.ts都是把接口请求的url和接口的具体逻辑全部放在一起了，这样使得代码冗杂而不易于维护。因此，最好是把具体的逻辑处理函数和接口路径的注册两者分开来存放，在controller目录下定义好对应的处理函数后在末尾导出，最后在routes中对应的文件中进行引入即可。
    
    以原本的index.ts文件为例：
    
    typescript
    
     代码解读
    
    复制代码
    
    `import express from "express"; const router = express.Router(); /* GET home page. */ router.get("/", function (req, res, next) {   res.render("index", { title: "Express" }); }); export default router;`
    
    按照上述原则，我们应该把前面的url和后面的函数分开来进行存放。我们在根目录下新建controller目录，并在里面新建index.ts文件，内部具体的代码如下：
    
    typescript
    
     代码解读
    
    复制代码
    
    `import { Request, Response } from 'express'; class UserController { 	// 注册 	register = async (req: Request, res: Response) => {         // ...内部的具体注册逻辑 	}; 	// 登录 	login = async (req: Request, res: Response) => {      	// ... 内部的具体登录逻辑 	}; } // 创建一个上述类的一个实例，将其导出 export const userController = new UserController();`
    
    然后，在routes里面的index.ts文件里面引入：
    
    typescript
    
     代码解读
    
    复制代码
    
    `import express from "express"; import userController from "../controller"; const router = express.Router(); router.get("/login", userController.login); export default router;`
    
    这样，我们就实现了业务和接口本身分离的模式，易于接口的注册和业务的维护。
    
    最后，有关于db的使用方式，在这里不详细赘述（因为这单独讲会讲很多），没基础有兴趣的同学可以直接开始学习express框架，或者参考我下方的个人项目哦！包含了比较完整的`Node.js`框架开发目录。
    

### 2.3 改造完成！

经过上述步骤的改造之后，express+typescript+MySQL的项目已经基本搭建完成了，目录结构如下：

![image-20230731154712407](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3d394b117154029b00d8af2f6691560~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=377&h=866&s=46979&e=png&b=f7f7f7)

dist是打包后的代码哦！之后就可以快乐的利用TypeScript进行后端的编写了！！

**ps：鉴于大家在本地进行后端项目的调试不可能每次都打个包然后再通过nodemon来运行js代码，这样子调试既麻烦又低效。在这边推荐大家全局安装`ts-node`，这个`npm`第三方插件能够让用户直接在控制台执行`TS`代码，不用先对其进行编译了。这样子之后我们在本地的调试也可以简化为直接在根目录执行：**

bash

 代码解读

复制代码

`nodemon bin/server.ts`

**就可以直接通过`TS`开启后端服务了，调试也更加的简单了**

3\. 结语
------

希望这篇小小的教程能够带给有需要的同学帮助！我本人也是不断的试错才总结出来如上的方法，如果我哪里有写错或者是不恰当的地方，希望在评论区能够多多指正！

最后，附上我自己个人从零设计+实现的前后端分离的全栈项目：知识分享平台`littleSharing~☆`。

*   访问地址：[little-sharing.vercel.app](https://link.juejin.cn?target=https%3A%2F%2Flittle-sharing.vercel.app "https://little-sharing.vercel.app")
    
*   前端技术栈：`Vue3.0+TypeScript+ElementPlus+Pinia+Vite`
    
    前端源码：[github.com/nonhana/lit…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fnonhana%2FlittleSharing-Frontend "https://github.com/nonhana/littleSharing-Frontend")
    
*   后端技术栈：`Node.js+Express+TypeScript+MySQL`（就是按照我上述的总结方法进行重构的框架）
    
    后端源码：[github.com/nonhana/lit…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fnonhana%2FlittleSharing-Backend-TS "https://github.com/nonhana/littleSharing-Backend-TS")
    

初学Vue或者对Express框架有兴趣的小伙伴可以看一看呀！