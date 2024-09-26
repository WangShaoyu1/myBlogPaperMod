---
author: "程序员凌览"
title: "🐂呀！这款markdown编辑器我太钟意啦！"
date: 2022-08-14
description: "📖阅读本文，您将收获了解到优秀的markdown产品wolai、notionmarkdown编辑器选型，多一个选择项学会如何使用Mildown一、markdown编辑器的槽点作为研发人员，我"
tags: ["前端","JavaScript","GitHub"]
ShowReadingTime: "阅读4分钟"
weight: 937
---
携手创作，共同成长！这是我参与「掘金日新计划 · 8 月更文挑战」的第一天，[点击查看活动详情](https://juejin.cn/post/7123120819437322247 "https://juejin.cn/post/7123120819437322247")

📖阅读本文，您将收获
-----------

*   了解到优秀的markdown产品[wolai](https://link.juejin.cn?target=https%3A%2F%2Fwww.wolai.com%2Fsignup%3Finvitation%3DI6MQISP "https://www.wolai.com/signup?invitation=I6MQISP")、[notion](https://link.juejin.cn?target=https%3A%2F%2Fwww.notion.so%2F66bed77ec85d42d9b84f3799e69dd711 "https://www.notion.so/66bed77ec85d42d9b84f3799e69dd711")
*   markdown编辑器选型，多一个选择项
*   学会如何使用`Mildown`

一、markdown编辑器的槽点
----------------

作为研发人员，我不相信您编写文档没有使用过markdown；如果使用markdown编写文档，那肯定是离不开一款markdown编辑器。

但是呢，市面上markdown编辑器又有蛮多槽点的：

*   大部分开源编辑器，它是编辑区与预览区分离 ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10e013f54d574fd7b0ec8db1bdc384fa~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?) 上图为掘金平台使用的编辑器，编辑区与预览区分离老碍眼了。古板，我觉得两者结合做到所见即所得会更好。
    
*   收费
    
    做到所见即所得的markdown编辑器，当然有，例如市面上的[Typora](https://link.juejin.cn?target=https%3A%2F%2Ftypora.io%2F "https://typora.io/")、[wolai](https://link.juejin.cn?target=https%3A%2F%2Fwww.wolai.com%2Fsignup%3Finvitation%3DI6MQISP "https://www.wolai.com/signup?invitation=I6MQISP")、[notion](https://link.juejin.cn?target=https%3A%2F%2Fwww.notion.so%2F66bed77ec85d42d9b84f3799e69dd711 "https://www.notion.so/66bed77ec85d42d9b84f3799e69dd711")。
    
    这三款编辑器产品，用过的人都说好，**强烈推荐**。
    
    它们有个共同的问题：商业化，商业化的产品目的就是搞钱，所以呢，它们有部分高级功能是需要付费的。
    
    但对大部分无特殊功能要求的人，它们已经够用了。
    
*   不开源
    
    像[Typora](https://link.juejin.cn?target=https%3A%2F%2Ftypora.io%2F "https://typora.io/")、[wolai](https://link.juejin.cn?target=https%3A%2F%2Fwww.wolai.com%2Fsignup%3Finvitation%3DI6MQISP "https://www.wolai.com/signup?invitation=I6MQISP")、[notion](https://link.juejin.cn?target=https%3A%2F%2Fwww.notion.so%2F66bed77ec85d42d9b84f3799e69dd711 "https://www.notion.so/66bed77ec85d42d9b84f3799e69dd711")产品，它们的源代码是没有开放出来的，我们想在项目中集成它们是不可能的。
    

二、新宠儿：`Milkdown`
----------------

> GitHub Star数: 6k+

`Milkdown`是什么?

官方自我介绍：

> Milkdown 是一个轻量但强大的 WYSIWYG（所见即所得）的 markdown 编辑器

为什么选择`Milkdown`?

官方理由：

*   为开发者提供一个**免费开源解决方案**
*   不同于 [Notion](https://link.juejin.cn?target=https%3A%2F%2Fnotion.so "https://notion.so") 和 [Typora](https://link.juejin.cn?target=https%3A%2F%2Ftypora.io%2F "https://typora.io/") 等商用软件，Milkdown是开源且永久免费的
*   值得信赖，有强大的社区支撑

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3544cbdeb714d659cf501087dbd3b14~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

在线体验：[milkdown.dev/zh-hans/onl…](https://link.juejin.cn?target=https%3A%2F%2Fmilkdown.dev%2Fzh-hans%2Fonline-demo "https://milkdown.dev/zh-hans/online-demo")

GitHub: [github.com/Saul-Mirone…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FSaul-Mirone%2Fmilkdown "https://github.com/Saul-Mirone/milkdown")

### 2.1 安装并运行

`Mildown`以插件驱动，它由核心模块、官方插件组成。

安装核心模块：

bash

 代码解读

复制代码

`npm i @milkdown/core @milkdown/transformer @milkdown/prose @milkdown/ctx`

创建Editor实例：

go

 代码解读

复制代码

`import { Editor } from "@milkdown/core" Editor.make().create()`

执行，两行代码就报错啦！！

*   错误1:`Uncaught (in promise) Timing InitReady timeout.`
    
    原因是缺少主题，再安装一个主题包：
    

css

 代码解读

复制代码

`npm i  @milkdown/theme-nord` 

javascript

 代码解读

复制代码

`import { Editor } from "@milkdown/core" import { nord } from "@milkdown/theme-nord" Editor.make().use(nord).create()`

 代码解读

复制代码

`再次运行，紧接着第二个报错出现。`

*   错误2:`Uncaught (in promise) RangeError: Schema is missing its top node type ('doc')`
    
    错误大概意思是缺少`doc`节点，这是原因缺少markdown预设指令插件。
    
    官方提供了两款插件：`@milkdown/preset-commonmark、@milkdown/preset-gfm`，推荐`@milkdown/preset-gfm`。
    
    同样的，下载使用：
    

javascript

 代码解读

复制代码

`import { Editor } from "@milkdown/core" import { nord } from "@milkdown/theme-nord" import {gfm} from "@milkdown/preset-gfm" Editor.make().use(nord).use(gfm).create()`

![Aug-14-2022 11-37-41.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85ca1e58200c4a9a95a69e990b142623~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?) 至此，`Milkdown`成功运行。接下来，只需要按需添加插件。

### 2.2 顶部工具栏插件

css

 代码解读

复制代码

`npm i @milkdown/plugin-menu`

还是链式调用`use` ,注册插件。

javascript

 代码解读

复制代码

`import { Editor } from "@milkdown/core" import { nord } from "@milkdown/theme-nord" import { gfm } from "@milkdown/preset-gfm" // 工具栏 import { menu } from '@milkdown/plugin-menu'; Editor     .make()     .use(nord)     .use(gfm)     .use(menu)     .create()`

但得到的是一堆英文单词：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e29ec8702ae44c099ae56af61f6e5c8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

功能是存在的，但展示有问题，需要把一堆英文单词替换成字体图标。

javascript

 代码解读

复制代码

`import { Editor ,ThemeIcon} from "@milkdown/core" import { nord } from "@milkdown/theme-nord" import { gfm } from "@milkdown/preset-gfm" // 工具栏 import { menu } from '@milkdown/plugin-menu'; import { getIcon } from "./icon" Editor     .make()     .use(nord.override((emotion, manager) => {         manager.set(ThemeIcon, (icon) => {             if (!icon) return;             return getIcon(icon);         });     }))     .use(gfm)     .use(menu)     .create()`

针对`@milkdown/theme-nord` 设置，添加一个`getIcon` 方法。

`icon` 文件内容过多此处不粘贴，请移动GitHub阅读：[github.com/CatsAndMice…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FCatsAndMice%2Fmilkdown%2Fblob%2Fmaster%2Ficon.js "https://github.com/CatsAndMice/milkdown/blob/master/icon.js")。

另外需要加载字体图标资源：

bash

 代码解读

复制代码

 `<html>  //...    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />  </html>`

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f89a2e4916d349cc8b01a88ff09f97d9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 2.3 复制粘贴插件

javascript

 代码解读

复制代码

`import { clipboard } from '@milkdown/plugin-clipboard';`

javascript

 代码解读

复制代码

`//... import { clipboard } from '@milkdown/plugin-clipboard'; Editor     .make()     .use(nord.override((emotion, manager) => {         manager.set(ThemeIcon, (icon) => {             if (!icon) return;             return getIcon(icon);         });     }))     .use(gfm)     .use(menu)     .use(clipboard)     .create()`

### 2.4 选择工具栏插件

css

 代码解读

复制代码

`npm i @milkdown/plugin-tooltip`

设置工具栏选中后置顶：

javascript

 代码解读

复制代码

`//... import { tooltipPlugin, tooltip } from '@milkdown/plugin-tooltip'; Editor     .make()     .use(nord.override((emotion, manager) => {         manager.set(ThemeIcon, (icon) => {             if (!icon) return;             return getIcon(icon);         });     }))     .use(gfm)     .use(menu)     //新增     .use(tooltip.configure(tooltipPlugin, {         top: true,     }))     .create()`

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/745797ac9c2c41c793d5bef492faeeea~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 2.5 支持`/` 命令插件

css

 代码解读

复制代码

`npm i @milkdown/plugin-slash`

输入`/`，自定义添加面板功能配置：

javascript

 代码解读

复制代码

`import { defaultValueCtx, Editor, rootCtx, ThemeIcon, themeManagerCtx } from "@milkdown/core"; //... import {slash,createDropdownItem,defaultActions,slashPlugin} from '@milkdown/plugin-slash'; Editor     .make()    // 新增   .use(slash.configure(slashPlugin, {     config: (ctx) => {       return ({ content, isTopLevel }) => {         if (!isTopLevel) return null;         if (!content) {           return { placeholder: "键入文字或'/'选择" };         }         const mapActions = (action) => {           const { id = "" } = action;           switch (id) {             case "h1":               action.dom = createDropdownItem(                 ctx.get(themeManagerCtx),                 "标题1",                 "h1"               );               return action;             //...             default:               return action;           }         };         if (content.startsWith("/")) {           return content === "/"             ? {               placeholder: " ",               actions: defaultActions(ctx).map(mapActions)             }             : {               actions: defaultActions(ctx, content).map(mapActions)             };         }         return null;       };     }   }))`

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03582030978044359c99465ee92acb92~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 2.6 设置默认内容及添加事件插件

设置默认内容是核心模块提供的功能，不必安装插件。

dart

 代码解读

复制代码

`import { defaultValueCtx, Editor, rootCtx, ThemeIcon, themeManagerCtx } from "@milkdown/core"; //... Editor.make()   .config((ctx) => {     ctx.set(rootCtx, document.querySelector('#app'));     ctx.set(defaultValueCtx, "## 点赞+评论+关注=学会");   })   //...`

添加事件:

css

 代码解读

复制代码

`npm i @milkdown/plugin-listener`

`@milkdown/plugin-listener`分别对应七个生命周期函数：

事件名

事件描述

beforeMount

挂载前

mounted

挂载后

updated

状态更新

markdownUpdated

markdown 更新

blur

失焦

focus

聚焦

destroy

销毁

javascript

 代码解读

复制代码

`//... import { listenerCtx, listener } from "@milkdown/plugin-listener" Editor.make()   .config((ctx) => {     ctx.set(rootCtx, document.querySelector('#app'));     ctx.set(defaultValueCtx, "## 点赞+评论+关注=学会");     //新增     ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {       console.log(markdown);     });   })   //...`

借助上述事件，可以自定义获取内容等功能。

Milkdown官方还有其他功能插件，例如：图片上传等，文章不逐一列举了。

文章演示代码已开放GitHub: [github.com/CatsAndMice…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FCatsAndMice%2Fmilkdown "https://github.com/CatsAndMice/milkdown")

三、结束语
-----

原创不易！如果我的文章对你有帮助，**点赞+评论+关注**就是对我的最大支持^\_^。