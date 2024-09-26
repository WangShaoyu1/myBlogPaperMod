---
author: "tager"
title: "如何在Vite5➕React➕Ts项目中优雅的使用Mock数据？🔥"
date: 2024-03-10
description: "序言本文希望达成的目标只有两点：mock、数据。从而降低使用mock的心智负担。背景最近在vite5➕ReactTs的项目中（没错，vite早已到5.x的版本了）大量用到了Mock数据。项目在此"
tags: ["前端","JavaScript","Node.js"]
ShowReadingTime: "阅读4分钟"
weight: 823
---
序言
--

本文希望达成的目标只有两点：`mock`、`数据`。从而降低使用mock的心智负担。

背景
--

最近在`vite5➕ReactTs`的项目中（没错，vite早已到5.x的版本了）大量用到了`Mock`数据。项目在此之前要么是全局配置mock、要么是侵入式的使用mock（提测或上线前需要删除、调整代码）。

总而言之使用过程多有不便、为此做了一些优化。

通过使用import动态导入这种方式，可以同时兼顾`export`、`export default`的方式导出，再结合`Axios`配置，从而到达非侵入式按需mock的目的。

![tager_bg.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e94711af1a64433999c07022b350399~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=940&h=788&s=188307&e=gif&f=34&b=ae67de)

动态import简介
----------

动态 `import()` 是 ES2020 规范的一部分，它得到了现代浏览器的广泛支持。允许开发者在代码执行过程中按需加载模块。与静态导入（例如，使用 `import ... from ...` 语法）不同，动态导入可以在任意时间点触发，这为**代码分割（`Code Splitting`）、按需加载、懒加载、条件加载**提供了极大的灵活性和效率。

> 简单示例：

ts

 代码解读

复制代码

`// 假设我们动态导入一个模块 import('path/module').then((module) => {   // 使用模块 }).catch(console.error); // 若加载模块异常，可在catch中处理。`

类似的还有`require.context`，不过它是同步的、并且主要用于构建时的模块导入，可以结合使用 `require.ensure`（一个用于按需加载模块的 webpack 特有功能）来实现类似于动态 `import()` 的按需加载效果。在`tager`的这篇文章中 **[《不要再写满屏import导入啦！🔥》](https://juejin.cn/post/7344571285848768524 "https://juejin.cn/post/7344571285848768524")** 也有介绍  
（PS: 原来都写在那篇文章里，发现篇幅过长、只好拎出来🤣）

Mock使用前的配置
----------

具体使用如下（以`vite-plugin-mock`插件为例，实现**非侵入的Mock数据**）

### 1\. 在`vite.config.ts`中引入

ts

 代码解读

复制代码

`// vite.config.ts // 引入 import { viteMockServe } from 'vite-plugin-mock' import { PluginOption } from 'vite' const isDevelopment = process.env.NODE_ENV === 'development'; // 配置 {   plugin: [     isDevelopment && viteMockServe({       mockPath: 'mock', //mock文件地址       enable: true,       watchFiles: true,       logger: true, //是否在控制台显示请求日志     }),   ].filter(Boolean) as PluginOption[] }`

### 2\. 在入口文件中配置

> 自动收拢mock文件夹下的所有导入【核心代码】

在开发环境启动后会执行以下代码，随后**只管新增mock数据**文件、文件夹，立即生效。**无需模块重导**（**Re-export**）

`vite5`默认支持`Mock`数据修改自动更新、无需重启服务，另外需要说明mock服务是运行在`Node`服务中的

ts

 代码解读

复制代码

``/*  * @Description: mock/index.ts入口文件  * 自动递归导入mock文件夹下的所有（文件）模块【含export、default导出】  * 无需使用import导入  */ import fs from 'fs'; import path from 'path'; const directoryPath = path.join(__dirname); // 递归遍历文件夹 function getFilesPath(dir, filelist: string[] = []) {   const files = fs.readdirSync(dir);   files.forEach((file) => {     const filepath = path.join(dir, file);     const stat = fs.statSync(filepath);     if (stat.isDirectory()) {       filelist = getFilesPath(filepath, filelist);     } else {       filelist.push(filepath)     }   });   return filelist; } async function loadMockFiles() {   try {     const allFiles = [...new Set(getFilesPath(directoryPath).filter(file => !/index.tsx?|.mjs$/.test(file)))]     return await Promise.all(       allFiles.map(filename => {         const name = `${filename.replace(directoryPath + '/', '')}`         // PS: 这里动态import直接变量名不行，必须用./         return import(`./${name}`).then(module => {           return Array.prototype.concat(...Object.values(module))         }).catch(console.error)       }       )     );   } catch (err) {     console.log('Unable to scan directory: ' + err);     return []   } } // 自动读取mock下的文件、导出所有模块（export、default导出都支持） export default (await loadMockFiles()).flat(Infinity)``

### 3\. 在axios拦截器中处理

目的：使单个请求在指定条件下指向本地mock数据

ts

 代码解读

复制代码

`this.axiosInstance.interceptors.request.use(   // @ts-ignore   (config) => {     if (isDev && config.isMock) {       config.baseURL = ''     }     return config   }`

### 4\. 使用

使用非常简单：在请求时传入`isMock`为`true`即可使单个请求使用本地`mock`数据（只在开发环境有效），另外`mock`的`url path`和真实请求的`url path`也是完全一致的。

ts

 代码解读

复制代码

`export default [   {     url: '/user_api/v1/user/profile_id', // 匹配的请求 URL 和真实请求的URL完全一致     method: 'get', // 请求方法     response: () => {       // 返回的模拟数据       return   {         code: 0,         msg: "success",         data: {           "profile_id": "12345678"         }       }     },   }, ]`

为什么import动态导入的参数不能直接用变量？
------------------------

### 1\. 相对路径 vs 绝对路径 vs 模块解析

*   **相对路径**：以`.`或`..`开头的路径被视为相对路径。`./`表示当前目录，`../`表示父目录。使用相对路径时，导入的模块将相对于当前文件的位置进行解析。
    
*   **绝对路径**：不以`.`或`..`开头的路径被视为绝对路径。在Node.js中，绝对路径可能是从项目根目录开始的路径，或者是指向`node_modules`中模块的路径。
    
*   **模块解析**
    

1.  当路径以`./`或`../`开头时，JavaScript运行时（或打包工具，如Webpack、Vite等）将其视为相对于当前文件的相对路径，并尝试在该路径下解析模块。
2.  如果路径不以`./`、`../`或`/`开头，它通常被解释为一个**包名**或**内置模块**，运行时将尝试在`node_modules`目录或相应的内置模块库中查找该模块。

ts

 代码解读

复制代码

``// 无法解析（被作为模块解析） const name = `${filename.replace(directoryPath + '/', './')}` import(`${name}`) // 可以解析（被作为相对路径解析） const name = `${filename.replace(directoryPath + '/', '')}` import(`./${name}`)``

### 2\. 动态`import()`的特性

当使用动态`import()`导入模块时，如果不以`./`或`../`开头，JavaScript运行时可能会尝试将其视为一个包或内置模块，而不是一个相对于当前文件的相对路径。这通常不是我们想要的行为，尤其是当你试图动态导入与当前文件位于同一目录下的模块时。

小结
--

通过以上配置后、单个接口mock数据的使用过程如下：

> 1.  在mock文件夹中新增文件、文件夹  
>     导出自定义的mock数据（其数据中的api地址和接口地址完全一致）
> 2.  在接口调用处增加参数`{isMock:true}`  
>     （只对开发环境生效）
> 
> 以上两步配置好就ok了，开发环境再访问接口时使用的就是mock数据。另外修改mock数据也是自动更新的、无需重启服务。

在`mock/index.tsx`的内容相当于就是一个通用的**脚本**，负责处理mock下所有文件的导出、并自动合并成一个、无需手动再引入模块，从而减轻我们使用mock的**心智负担**

这样我们就只需要关注单一接口`是否已开启isMock` 以及 `是否已配置mock数据`、无需增删代码，也不会影响线上。

是不是超级简单了。。。

总结
--

目前有很多脚手架都支持了mock数据功能、开箱即用，或者以插件的形式提供。

正确的使用mock数据在开发过程中的确是能提升我们的开发效率的、可以让我们提前进入联调状态，提前完工。

如果想了解更多的mock知识，可以参考tager之前写过的这篇文章：[【前端MOCK数据】这么好的工具为啥不用啊？🚀](https://juejin.cn/post/7026165301255340045 "https://juejin.cn/post/7026165301255340045")