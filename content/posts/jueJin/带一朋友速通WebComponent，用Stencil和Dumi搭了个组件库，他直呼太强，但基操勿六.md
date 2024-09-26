---
author: "闲D阿强"
title: "带一朋友速通WebComponent，用Stencil和Dumi搭了个组件库，他直呼太强，但基操勿六"
date: 2022-11-04
description: "一个小兄弟，想做WebComponent，我正好也有空，就答应带他研究，奈何我本人比较懒，总摸鱼，我一摸鱼，他就督促我，也对亏这位老弟的督促，在几天内就实现了，效率惊人。"
tags: ["Vue.js","React.js","WebComponents"]
ShowReadingTime: "阅读9分钟"
weight: 839
---
> **本文为稀土掘金技术社区首发签约文章，14天内禁止转载，14天后未获授权禁止转载，侵权必究！**

事情是这样的
======

一个小兄弟，想做**Web Component**，我正好也有空，就答应带他研究，奈何我本人比较懒，总摸鱼，我一摸鱼，他就督促我，也对亏这位老弟的督促，在几天内就实现了，效率惊人。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e936f10c771412ba34e53e745c1f452~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?) ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5417e57f808d43a8a7fec454f15f5555~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/423bb5e3ae5f4beaa3539553c891fb0b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6dd5131ef233433b9f562139d300474f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad22344d0d964bff836285bec8ac1eac~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

关于Web Component，你至少要知道这些原生知识
============================

（_如果对Web Component已经很熟悉了，可以直接跳过。_）

**代码长这样**

*   js代码
    
    js
    
     代码解读
    
    复制代码
    
    `customElements.define('element-details',   class extends HTMLElement {     constructor() {       super();       const template = document         .getElementById('element-details-template')         .content;       const shadowRoot = this.attachShadow({mode: 'open'})         .appendChild(template.cloneNode(true));   } });`
    
*   模板
    
    html
    
     代码解读
    
    复制代码
    
    `<template id="element-details-template">   <div class="attributes">       <h4><span>外部插入的节点</span></h4>       <slot name="slotEle"><p>None</p></slot>   </div> </template>`
    
*   使用
    
    html
    
     代码解读
    
    复制代码
    
    `<element-details>   <dl slot="slotEle">     <dt>插入的数据</dt>   </dl> </element-details>`
    
*   然后组一下，一个Web 组件就好了
    
    html
    
     代码解读
    
    复制代码
    
    `<html>   <head>     <meta charset="utf-8">     <title></title>   </head>   <body>     <template id="element-details-template">       ...       这里写模版       ...     </template>     <element-details>       ...       这里写使用       ...     </element-details>     <script>     ...     js代码放这     ...     </script>   </body> </html>`
    

接下来我们把必要的基础，先补一下

shadowDom
---------

### shadow，意为“影”

**shadow**意为影子，如影随行，随行的是啥，是一个**dom**。 那么这个影就可以想象成一个领域，空间，与外界不发生干扰。 所以我们称之为**shadow**。

### dom，就是dom，但有一点区别

一个非常关键的区别，就是这个**dom**的最顶层根节点，是通过`HTMLElement`实例的`attachShadow`这个api创建的，官方名字叫做“**shadow root**”

确切的说更应该是**shadow dom的root**。

在了解完**shadow**和**dom**的组成结构之后，就能很清晰的理解为啥这么说了。

### shadow和dom怎么组在一起的

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ffbc7b536444093b9625a268b63d4c0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

*   左边就是一个正常**dom**，右边就是一个**shadow dom**
*   左边拿出一个节点，作为右边**shadow dom**的着陆点，这个节点叫**Shadow host**
*   **shadow dom**的根节点叫做**shadow root**

em～～～，**shadowDom**我觉得先了解这么多，够用了。

slot和template标签
---------------

这俩原生标签，在mdn上写的很详细了。

这里我结合Web Component场景，用一种轻巧直接的方式，粗暴的介绍一下。

### template标签

通过template标签包裹的内容，是不会被渲染的，但是在js里，却可以通过document获取这个节点的实例对象的。

**对于Web Component有啥用？**

有用啊，把html相关的用模版做好，可以很大程度上省去了写又复杂又不好维护的dom操作了。

**写法大体如下：**

ini

 代码解读

复制代码

`// 根据模版实例化一个元素对象 let template = document.getElementById('my-paragraph'); let templateContent = template.content; let ele = templateContent.cloneNode(true); // 注意是clone // 然后把这个元素，放入这个Shadow dom 中 const shadowRoot = this.attachShadow dom 中({mode: 'open'}).appendChild(ele);`

就注意通过cloneNode进行实例就行了。

### slot

叫插槽，或使用槽都行。 怎么跟你形容它是啥呢，就是：

**<web组件>**... **`这个位置就是插槽`** ...**</web组件>**

然后在web组件内部实现，就可以通过`<slot>`标签，来接了。

custom elements
---------------

js

 代码解读

复制代码

`customElements.define('element-details',       class extends HTMLElement {         constructor() {           ... 就这个           const shadowRoot = this.attachShadow({mode: 'open'})           ...       }     });`

### define参数：

*   第一个就是组件的名称，不可以大写，也就不可以驼峰，用“-”连接。
*   第二个就是实现这个组件的class

### HTMLElement实例的attachShadow

参数是一个对象，其中有个mode属性，值分别为：

*   open：可以被dom获取
*   close：不可以被dom获取

用一句话描述一下咋回事
-----------

**Web Component**可以当成是一个独立的网页，被装在了一个空间里，然后把这个空间挂载到了一母网页上，这个**Web Component**和母网页互不影响，又紧密联系，在用户看来，就是一个网页。

_`～～～等会，这跟iframe怎么那么像`_

### iframe和shadowDom啥区别？

简单说： iframe装的是网页， shadowDom装的组件， 进一步说： iframe更倾向～大，独立，完整 shadowDom更倾向～小，组成，部分

### 微前端用啥好？

所以说，在实现一个网页的组件更适合使用shadowDom 那么微前端呢？是shadowDom还是iframe？微前端我觉得更倾向作为组成部分存在吧，多个前端互相组合，彼此都是做成一部分存在，所以我觉得shadowDom更适合，那么京东就是这种策略，我喜欢。

原生虽好，但我回不去了
-----------

*   我喜欢虚拟dom
*   我喜欢响应式
*   喜欢更简洁的api
*   我喜欢拥有这一切，最后100%跟用原生一样

Stencil让我用喜欢的方式写Web Component
=============================

原生写法，对不起。。。对于我这个用惯了React和Vue，已经被框架教化的coder来说，再让我用如此原生态的写法，我是写不了的，就算写还是得封装，兜兜转转又回来了，所以：

**我需要一个可以用React或者Vue这类框架写法，开发web 组件的办法。**

于是我遇见了[Stencil](https://link.juejin.cn?target=https%3A%2F%2Fstenciljs.com%2Fdocs%2Fgetting-started "https://stenciljs.com/docs/getting-started")

定义一下 Stencil 是什么
----------------

一个编译工具，可以把用React或者Vue这类框架写法写的组件，100%编译成原生web组件。

接下来，我们速通一下Stencil基础。28原则，先写出来组件再说。

必要的基础
-----

### 组件，看起来很直观

**组件长这样**

js

 代码解读

复制代码

`import { Component, Prop } from '@stencil/core'; declare global {   namespace JSX {     interface IntrinsicElements {       'moderate-info': {         first: string,         middle:string,         last:string,       }     }   } } @Component({   tag: 'moderate-info',   styleUrl: 'moderate-info.css',   shadow: true, }) export class ModerateInfo {   /**    * The first name    */   @Prop() first: string;   /**    * The middle name    */   @Prop() middle: string;   /**    * The last name    */   @Prop() last: string;   private getText(): string {     return this.first+this.middle+ this.last；   }   render() {     return (       <div>         <div class={'info'}>{this.getText()}</div>       </div>     );   } }`

*   装饰器写法
*   与原生神似，有host，slot等等
*   jsx写法，我贼爱～～～
*   整体代码看起来很简洁，清晰。

**对应的装饰器：**

*   **@Component**：包装组件用的，`必须加`
*   **@Prop()**：包装参数用的，`为啥加`？
    *   加了就意味着，这个web组件接受这几个参数，作为attribute
    *   而且还有ts类型提示

### 生命周期，非常全面

封装了很多生命周期，很细，思路跟vue和react差不多，也分**加载**和**渲染**，我挑了几个，我常用的：

[connectedCallback](https://link.juejin.cn?target=https%3A%2F%2Fstenciljs.com%2Fdocs%2Fcomponent-lifecycle%23connectedcallback "https://stenciljs.com/docs/component-lifecycle#connectedcallback")

> 每当web 组件每次跟主体dom连接的时候进行触发，就执行

[componentWillLoad](https://link.juejin.cn?target=https%3A%2F%2Fstenciljs.com%2Fdocs%2Fcomponent-lifecycle%23componentwillload "https://stenciljs.com/docs/component-lifecycle#componentwillload")

> 组件刚连接完，并且还没开始加载，这个时候，可以做一些请求，防止出现额外的刷新，只执行一次。

[componentDidLoad](https://link.juejin.cn?target=https%3A%2F%2Fstenciljs.com%2Fdocs%2Fcomponent-lifecycle%23componentdidload "https://stenciljs.com/docs/component-lifecycle#componentdidload")

> 只执行一次，发生在完全加载完，并且渲染开始的时候，只执行一次。

[disconnectedCallback](https://link.juejin.cn?target=https%3A%2F%2Fstenciljs.com%2Fdocs%2Fcomponent-lifecycle%23disconnectedcallback "https://stenciljs.com/docs/component-lifecycle#disconnectedcallback")

> 没当web 组件从主体dom断开就执行

demo

tsx

 代码解读

复制代码

`import { Component, State, h } from '@stencil/core'; @Component({   tag: 'custom-clock' }) export class CustomClock {   timer: number;   @State() time: number = Date.now();   connectedCallback() {     this.timer = window.setInterval(() => {       this.time = Date.now();     }, 1000);   }   disconnectedCallback() {     window.clearInterval(this.timer);   }   render() {     const time = new Date(this.time).toLocaleTimeString();     return (       <span>{ time }</span>     );   } }`

### 状态，居然是响应式

**对应的装饰器：**

*   `@state`：修饰了之后，直接就能作为响应式状态，对没错，是响应式，你修改就会触发组件刷新
    *   stencil有虚拟dom
    *   响应式，这岂不是很爽么，这点跟vue很像

### 事件，被组织的很有条理

**对应的装饰器：**

*   `@Event`：包裹一个事件
    *   注册事件
        
        tsx
        
         代码解读
        
        复制代码
        
        `@Event({     eventName: 'todoCompleted',     composed: true,     cancelable: true,     bubbles: true,   }) todoCompleted: EventEmitter<Todo>;`
        
    *   触发事件
        
        tsx
        
         代码解读
        
        复制代码
        
        `todoCompletedHandler(todo: Todo) { const event = this.todoCompleted.emit(todo); if(!event.defaultPrevented) {       // if not prevented, do some default handling code     }   }`
        
*   `@Listen()`: 传入事件名，包裹一个函数，这个函数就是回调函数。
    *   监听自定义事件
        
        tsx
        
         代码解读
        
        复制代码
        
          `@Listen('todoCompleted')   todoCompletedHandler(event: CustomEvent<Todo>) {     console.log('Received the custom todoCompleted event: ', event.detail);   }`
        
    *   监听dom event事件，比如监听“`click`”事件，回调是`handleClick`
        
        tsx
        
         代码解读
        
        复制代码
        
         ``@Listen('click', { capture: true })   handleClick() {     // whenever a click event occurs on     // the component, update `isOpen`,     // triggering the rerender     this.isOpen = !this.isOpen;   }``
        

做组件，不做组件库，说不过去的
===============

**Stencil**目前掌握的基础，可以搭配着做做组件了，不过是熟练的过程了，但是有一点就是：

**你写好了组件，怎么才能很直观的展示出来，怎么用，效果又是啥？**

所以，我们需要一个可以直观展示我们的组件效果，还能看到代码实现，方便快速cv搬砖。

**效果图：**

*   首页
    
    ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4decca32ab2944b68882309814d3ed85~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)
*   快速上手
    
    ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f0d1e71687c460a877d233277b854a9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)
*   组件开发文档
    
    ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b38a4c5959c497aa3c5d4789993a951~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

技术方案
----

*   做成库：把组件库发布到**npm**上
*   做一个组件库网站：使用dumi去搞

那么文档和组件库融合在一起，还是各自独立呢？

各自独立，做成monorepo
---------------

我觉得分开更清晰，这样文档是文档，组件是组件，维护起来更清晰，关注点集中。

### 使用yarn workSpace

*   **使用workspace的好处：**
    
    *   可以节省空间
    *   开发多个互相依赖的package时，workspace会自动对package的引用设置软链接
*   **软连接最主要**
    
    *   dumi项目直接可以引入同在一个**monorepo**下的，组件库项目
        
        ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/448a87efaba148e1b5425f9a20f781c9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)
        *   前提是你要在组件库项目执行了build，才能被软连接到
            
            ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c39bd2824ae14451b0782e0b888b3726~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)
            
            也就是组件库项目中要有dist，这样才能被直接软连接使用
            
*   **monorepo**中，可以通过 **`yarn workspace <workspace_name> <command>`**
    

来执行子包中命令. 运行组件库文档

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b1948adb9fe4911a2ad7e3c95b20fdb~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

打包组件库

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9572f20d00ad4489b021f9338c77c7a3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 使用lerna作为组件库发版工具

首先组件库发布版本，需要设置版本，通过lerna可以有几点好处

*   可以实现命令行交互的方式进行发布，方便直观
*   发布后会以版本号，创建出一个新的git分支，可以很好的追溯版本。

命令是`lerna publish`

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b84d1f2e235b4f2194728c4a8228edfc~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

执行前，记得提交本地修改。

### dumi做文档，这舒服

dumi还算简单，但这也趟了一些坑，这里我就简单介绍一下。

*   安装
    
    ruby
    
     代码解读
    
    复制代码
    
    `$ npx @umijs/create-dumi-lib --site # 初始化一个站点模式的组件库开发脚手架 # or $ yarn create @umijs/dumi-lib --site`
    
*   配置一下tsconfig中的`skipLibCheck`，设置为`true`，不然在monorepo下会因为检测其他项目的d.ts报错
    
    json
    
     代码解读
    
    复制代码
    
    `{   "compilerOptions": {     "target": "esnext",     "module": "esnext",     "moduleResolution": "node",     "jsx": "react",     "esModuleInterop": true,     "types": ["jest"],     "strict": true,     "skipLibCheck": true,     "declaration": true   } }`
    
*   配置一下logo等信息，在dumi创建的项目中的`.umirc`中配置
    
    php
    
     代码解读
    
    复制代码
    
    `import { defineConfig } from 'dumi'; export default defineConfig({   title: 'Moderate WebComp',   mode: 'site',   // more config: https://d.umijs.org/config   locales: [['zh-CN', '中文']],   logo: '/moderate-webcomp-starter/images/logo.png',   favicon: '/moderate-webcomp-starter/images/favicon.ico',   base: '/moderate-webcomp-starter',   publicPath: '/moderate-webcomp-starter/',   exportStatic: {}, // 将所有路由输出为 HTML 目录结构，以免刷新页面时 404 });`
    
*   约定是路由，挺有趣 在src下创建components，然后把组件都放在这里 ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc20d117d467488f8b1e140487aedcc6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)
    
    那么组件就会罗列出来
    
    ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/493184ba7cfd471d887daaa12197cb0f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)
    
    具体约定是路由配置，[官网有详细的配置](https://link.juejin.cn?target=https%3A%2F%2Fd.umijs.org%2Fzh-CN%2Fguide%2Fbasic%23%25E7%25BA%25A6%25E5%25AE%259A%25E5%25BC%258F%25E8%25B7%25AF%25E7%2594%25B1 "https://d.umijs.org/zh-CN/guide/basic#%E7%BA%A6%E5%AE%9A%E5%BC%8F%E8%B7%AF%E7%94%B1")，有兴趣可以看看
    

结尾
==

到这里，一个组件库简版搭建差不多就好了，我们把它发布到githubPages，这样就可以在线访问了。

也再一次感谢小老弟的参与，一起组队搞事情，体验很有趣。

这是[在线预览地址](https://link.juejin.cn?target=https%3A%2F%2Fmoderateman.github.io%2Fmoderate-webcomp-starter%2F "https://moderateman.github.io/moderate-webcomp-starter/")

这是这个monorepo组件库的[github仓库地址](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FmoderateMan%2Fmoderate-webComps "https://github.com/moderateMan/moderate-webComps")

有问题可以随时咨询我，或者留言，我整了个群，群号是551406017，结识一帮志同道合的伙伴，交流技术，欢迎水群，共同进步。

\-------------------------->>>分割线<<<--------------------------

答疑解惑
====

有掘友提问怎么运行
---------

1.  第一步，拉取github的项目到本地
2.  在项目的根目录下执行命令来安装依赖
    
    css
    
     代码解读
    
    复制代码
    
    `yarn or cnpm i`
    
3.  跑文档项目
    
    sql
    
     代码解读
    
    复制代码
    
    `yarn workspace docs start`
    
4.  如果组件库的代码发生了变动，如何在更新对应的组件文档
    
     代码解读
    
    复制代码
    
    `yarn workspace moderate-webcomp-starter build`
    
    这样构建完，文档项目软连接到的组件库就是最新的了，文档中组件的呈现也就连带更新了。