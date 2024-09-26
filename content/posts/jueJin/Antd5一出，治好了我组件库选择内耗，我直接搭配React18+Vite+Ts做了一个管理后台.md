---
author: "闲D阿强"
title: "Antd5一出，治好了我组件库选择内耗，我直接搭配React18+Vite+Ts做了一个管理后台"
date: 2022-11-19
description: "Antd5最最最吸引我的点Antd5官网又好用，又能好看。没有Antd5之前，我是选Mui的。"
tags: ["前端","React.js"]
ShowReadingTime: "阅读14分钟"
weight: 813
---
> **本文为稀土掘金技术社区首发签约文章，14天内禁止转载，14天后未获授权禁止转载，侵权必究！**

Antd5最最最吸引我的点
=============

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/140e349b3ed548f8a1b16617f21ba69d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

[Antd5 官网](https://link.juejin.cn?target=https%3A%2F%2Fant.design%2Findex-cn "https://ant.design/index-cn")

又好用，又能好看。

没有Antd5之前，我是选Mui的
-----------------

比如我要做一个对样式有很多需求的管理后台，或者一些官网主页，我都会选MUI

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e26d2610ce2b42b89a71aa5a6141dced~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

[MUI官网](https://link.juejin.cn?target=https%3A%2F%2Fmui.com%2Fzh%2F "https://mui.com/zh/")

这个才是我认为**最能变好看**的组件库，MUI走在了Antd5之前，就搞**CSS in JS**了，定制主题那叫一个容易，但有一个点就是他不是很好用。。。。

Antd5，几乎让我没理由不选，又好用，又能好看
------------------------

MUI不怎么好用，组件功能不多，远没有Antd4好用，想用只能自己动手封装，但是能让我纠结MUI和Antd选谁的主要原因，就是MUI真好看，现在Antd5有了这么好用的自定义主题的本领，一下就根治精神内耗，直接Antd5，无脑入就对了。又好用，又能好看。

ok，那么简单的介绍完我选Antd5的理由，接下来，我们就直奔主题，快速的过一下，使用React18+Antd5+Vite+Ts搭建管理后台的全过程，并在文章结尾处贴出这个项目代码地址，供大家快速上手实操，体验一下Antd5的畅快。

Antd5搭配React18+Vite+Ts开发管理后台全流程
===============================

配置vite和tsconfig准备工作
-------------------

js

 代码解读

复制代码

`import { fileURLToPath, URL } from "node:url"; import { defineConfig } from 'vite' import react from '@vitejs/plugin-react' // https://vitejs.dev/config/ export default defineConfig({   server: {     proxy: {       '/api': {         target: 'http://localhost:3120/',         changeOrigin: true,         rewrite: (path) => path.replace(/^\/api/, '')       }     }   },   plugins: [react()],   resolve: {     alias: {       "@": fileURLToPath(new URL("./src", import.meta.url)),     },   }, })`

### 配置 "@"，这样我在代码里可以畅快的引入文件了。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43faa5e8aa504384b3b1ece122eb7475~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 配置proxy，我就可以跟后台进行通信，解决开发环境的跨域问题。

`tsconfig`配置

json

 代码解读

复制代码

`{   "include": ["env.d.ts", "src/**/*"],   "exclude": ["src/**/__tests__/*"],   "compilerOptions": {     "experimentalDecorators":true,     "composite": true,     "target": "es5",     "lib": [       "dom",       "dom.iterable",       "esnext"     ],     "baseUrl": ".",     "paths": {       "@/*": ["./src/*"]     },     "jsx": "preserve"   } }`

### 加入d.ts解决大部分引入文件报错的问题

typescript

 代码解读

复制代码

`/// <reference types="node" /> /// <reference types="react" /> /// <reference types="react-dom" /> declare namespace NodeJS {   interface ProcessEnv {     readonly NODE_ENV: 'development' | 'production' | 'test';     readonly PUBLIC_URL: string;   } } declare module '*.avif' {   const src: string;   export default src; } declare module '*.bmp' {   const src: string;   export default src; } declare module '*.gif' {   const src: string;   export default src; } declare module '*.jpg' {   const src: string;   export default src; } declare module '*.jpeg' {   const src: string;   export default src; } declare module '*.png' {   const src: string;   export default src; } declare module '*.webp' {     const src: string;     export default src; } declare module '*.svg' {   import * as React from 'react';   export const ReactComponent: React.FunctionComponent<React.SVGProps<     SVGSVGElement   > & { title?: string }>;   const src: string;   export default src; } declare module '*.module.css' {   const classes: { readonly [key: string]: string };   export default classes; } declare module '*.module.scss' {   const classes: { readonly [key: string]: string };   export default classes; } declare module '*.module.sass' {   const classes: { readonly [key: string]: string };   export default classes; }`

### 约束一下node和npm的最低版本

因为用了vite，我们需要约束一下node和npm的版本，因为版本太低，跑不起来的。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51737d971e784223b79b4c58b64a39ba~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

开发登陆页
-----

![ezgif.com-gif-maker (27).gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a696916be90e4d2ebe38b925fee58b86~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 封装字体特效组件，让页面看着淡雅不俗气

js

 代码解读

复制代码

`import "react"; import { useRef } from "react"; import { useEffect } from "react"; import styles from "./index.module.scss"; let defaultRun: boolean = true; let infinite: boolean = true; let frameTime: number = 75; let endWaitStep = 3; let prefixString = ""; let runTexts = [""]; let colorTextLength = 5; let step = 1; let colors = [   "rgb(110,64,170)",   "rgb(150,61,179)",   "rgb(191,60,175)",   "rgb(228,65,157)",   "rgb(254,75,131)",   "rgb(255,94,99)",   "rgb(255,120,71)",   "rgb(251,150,51)",   "rgb(226,183,47)",   "rgb(198,214,60)",   "rgb(175,240,91)",   "rgb(127,246,88)",   "rgb(82,246,103)",   "rgb(48,239,130)",   "rgb(29,223,163)",   "rgb(26,199,194)",   "rgb(35,171,216)",   "rgb(54,140,225)",   "rgb(76,110,219)",   "rgb(96,84,200)", ]; let inst = {   text: "",   prefix: -(prefixString.length + colorTextLength),   skillI: 0,   skillP: 0,   step: step,   direction: "forward",   delay: endWaitStep, }; function randomNum(minNum: number, maxNum: number): number {   switch (arguments.length) {     case 1:       return parseInt((Math.random() * minNum + 1).toString(), 10);     case 2:       return parseInt(         (Math.random() * (maxNum - minNum + 1) + minNum).toString(),         10       );     default:       return 0;   } } let randomTime: number = randomNum(15, 150); let destroyed: boolean = false; let continue2: boolean = false; let infinite0: boolean = true; function render(dom: HTMLDivElement, t: string, ut?: string): void {   if (inst.step) {     inst.step--;   } else {     inst.step = step;     if (inst.prefix < prefixString.length) {       inst.prefix >= 0 && (inst.text += prefixString[inst.prefix]);       inst.prefix++;     } else {       switch (inst.direction) {         case "forward":           if (inst.skillP < t.length) {             inst.text += t[inst.skillP];             inst.skillP++;           } else {             if (inst.delay) {               inst.delay--;             } else {               inst.direction = "backward";               inst.delay = endWaitStep;             }           }           break;         case "backward":           if (inst.skillP > 0) {             inst.text = inst.text.slice(0, -1);             inst.skillP--;           } else {             inst.skillI = (inst.skillI + 1) % runTexts.length;             inst.direction = "forward";           }           break;         default:           break;       }     }   }   if (ut != null) {     inst.text = ut.substring(0, inst.skillP);     if (inst.skillP > ut.length) {       inst.skillP = ut.length;     }   }   dom.textContent = inst.text;   let value;   if (inst.prefix < prefixString.length) {     value = Math.min(colorTextLength, colorTextLength + inst.prefix);   } else {     value = Math.min(colorTextLength, t.length - inst.skillP);   }   dom.appendChild(fragment(value)); } function getNextColor(): string {   return colors[Math.floor(Math.random() * colors.length)]; } function getNextChar(): string {   return String.fromCharCode(94 * Math.random() + 33); } function fragment(value: number): DocumentFragment {   let f = document.createDocumentFragment();   for (let i = 0; value > i; i++) {     let span = document.createElement("span");     span.textContent = getNextChar();     span.style.color = getNextColor();     f.appendChild(span);   }   return f; } let flag = false; export default (props) => {   const { texts } = props;   let container = useRef();   let container2 = useRef();   function init(): void {     setTimeout(() => {       if (destroyed) {         return;       }       container.current && loop();     }, randomTime);   }   function loop(): void {     if (destroyed) {       return;     }     setTimeout(() => {       if (continue2 && container.current != null) {         if (destroyed) {           return;         }         let dom = container.current;         let index = inst.skillI;         let originText = texts[index];         let currentText = runTexts[index];         if (originText != currentText) {           render(dom, currentText, originText);           runTexts[index] = originText;         } else {           render(dom, currentText);         }       }       if (infinite0) {         loop();       } else {         if (inst.skillP < runTexts[0].length) {           loop();         }       }     }, frameTime);   }   useEffect(() => {    {       runTexts = texts;       continue2 = defaultRun;       infinite0 = infinite;       inst.delay = endWaitStep;       if (!infinite0) {         if (runTexts.length > 1) {           console.warn(             "在设置infinite=false的情况下，仅第一个字符串生效，后续字符串不再显示。"           );         }       }       init();     }   }, []);   return (     <div className={styles.content}>       <pre ref={container} className={styles.container} id="container"></pre>       <pre ref={container2}></pre>     </div>   ); };`

**scss**

使用的`css Module`技术

scss

 代码解读

复制代码

`.content{     color: black;     height: 100%;     width: 100%;     .container {         margin: 0;         padding: 0;         width: 100%;         height: 100%;         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';         white-space: pre-wrap;         word-wrap: break-word;     } }`

### 登陆卡片，用的Antd5中的Card组件

这没啥可说的，但是效果确实看起来舒服多了

js

 代码解读

复制代码

`import { Card } from "antd"; import type { ReactNode } from "react"; const { Meta } = Card; const App: React.FC = (props: { children: ReactNode }) => (   <Card     hoverable     style={{ width: 400 }}     cover={       <img         alt="example"         src="https://s1.imagehub.cc/images/2022/10/27/c1ede234aeb41d1a0216fe5bc4d1c642aad1eed8.jpg942w_531h_progressive.webp"       />     }   >     {props.children}   </Card> ); export default App;`

开发主页
----

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b84deb30e0cc4aa48df583646d756cf7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?) ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d0f210547e884be6b8c644708e0523ad~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

主要挑干的说说几点：

*   左侧菜单
*   tab标签
*   面包屑

别看就这几个，组合一起，实现各种功能就费劲了，接下来具体说说

### 设计路由结构配置方案

路由数据的结构是树状的，我们把这个树状结构分离出来，结构数据和内容数据

*   结构数据：描述结构关系，通过id
*   内容数据：根据id去匹配对应的数据内容

**结构数据**

js

 代码解读

复制代码

`export const RouteIds = {   hello: "hello",   sys: "sys",   role: "role",   user: "user", }; export const routesStructData = [   {     id: RouteIds.hello,   },   {     id: RouteIds.sys,     children: [{ id: RouteIds.role }, { id: RouteIds.user }],   }, ];`

**内容数据**

js

 代码解读

复制代码

`import { Login, Center, Page1, Hello, UserPage, RolePage } from "../pages"; export default {   center: {     meta: {       title: "中心",     },   },   hello: {     meta: {       title: "首页",     },     component: Hello,   },   sys: {     meta: {       title: "系统管理",     },   },   user: {     meta: {       title: "用户管理",     },     component: UserPage,   },   role: {     meta: {       title: "角色管理",     },     component: RolePage,     state: { a: 1111 },   }, };`

然后二者组成完整路由数据的基本数据，这么做的好处就是可以把关注的事情分开，有些逻辑需要结构，就用结构数据，有些地方需要内容，就通过结构的id进行获取，这样，代码组织的难度更小。

**别忘了使用的组件，要用lazy进行懒加载**

js

 代码解读

复制代码

`import { lazy } from "react"; const Center = lazy(() => import("./center")); const Login = lazy(() => import("./login")); const Page1 = lazy(() => import("./page1")); const Hello = lazy(() => import("./hello")); const UserPage = lazy(() => import("./sys/user")); const RolePage = lazy(() => import("./sys/role")); export { Center, Login, Page1, Hello, UserPage, RolePage };`

**然后设计一个递归算法，生成整个完整的路由结构数据**

js

 代码解读

复制代码

`const processRoute = (children: any[], routesData: any[], prefix: string) => {   routesData.forEach((routeItem, index) => {     const { id } = routeItem;     if (permissions.includes(id)) {       let routeData = routerConfig[id];       // 沿途记录，然后拼接成path       routeData.path = prefix + "/" + id;       routeData.routeId = id;       const { component: Component } = routeData;       if (Component) {         routeData.element = (           <Suspense>             <Component></Component>           </Suspense>         );       }       children!.push(routeData);       if (routeItem.children!?.length > 0) {         routeData.children = [];         processRoute(routeData.children, routeItem.children!, routeData.path);       }     }   }); };`

通过算法，我们尽可能少的配置数据，有些关键数据，完全可以通过这个算法计算出来。

比如路由组件的path，我们就可以通过分析结构管理，拼接起来

好处是，我们不用但系调整结构数据，连带的path命名和修改的心智负担。

### 根据路由数据驱动显示菜单

在组件内部，通过useEffect，响应路由数据的创建完成

js

 代码解读

复制代码

`useEffect(() => {     if (routerData.length) {       let result = [];       processRoute(routerData[1].children, result);       setMenuData(result);     }   }, [routerData]);`

然后下一步进行，根据路由结构数据，渲染菜单结构

js

 代码解读

复制代码

`const processRoute = (data, result: any) => {   data.forEach((item) => {     let temp: any = {       key: item.routeId,       icon: createElement(UserOutlined),       label: item.meta.title,     };     result.push(temp);     if (item?.children?.length) {       temp.children = [];       processRoute(item.children, temp.children);     }   }); };`

然后将数据通过setMenuData之后，驱动显示菜单

js

 代码解读

复制代码

`{menuData.length > 0 && (     <Menu       theme="dark"       mode="inline"       selectedKeys={defaultSelectedKeys}       defaultOpenKeys={defaultOpenKeys}       style={{ height: "100%", borderRight: 0 }}       items={menuData}       onClick={({ key }) => {         const path = routerConfig[key]?.path;         if (path) {           navigate(path);         }       }}     />   )}`

Antd5的用法没啥变化，这里说说用`selectedKeys`和`openKeys`的原因：

**`selectedKeys`和`defaultOpenKeys`需要让Menu变为可控组件** 原因就是，我需要动态响应路由的改变，就算我直接刷新，也可以选中正确的菜单项目，展开正确的折叠项

为啥是**defaultOpenKeys**，因为不这样，你都点不开折叠，当然你也可以完全设置可控。

那么说到这，我们需要实现一个监听，react路由改变的功能，你知道怎么设计么？

### 封装`useLocationListen`hook，实现路由变化监听

js

 代码解读

复制代码

`import { useEffect } from "react"; import { useLocation } from "react-router-dom"; export default (listener) => {   let location = useLocation();   useEffect(() => {     listener(location);   }, [location]); };`

然后在组件内使用

js

 代码解读

复制代码

`useLocationListen((location: Location) => {     const { pathname } = location;     let temp = pathname.split("/").filter((item) => {       return item;     });     setDefaultSelectedKeys([temp.at(-1)]);     let temp2 = temp.slice(1, temp.length - 1);     if (temp2.length) {       setDefaultOpenKeys(temp2);     }     // 这个地方就是存储tab标签记录的逻辑     globalStore.addTabHistory(location);   })`

然后传入回调函数，就能够实现响应，从而分析路由，获取**Menu**组件的展开和选中状态数据，使其完全可控。

也这是因为实现了路由的监听，菜单和下面要介绍的tab标签栏，完美联动，通过监听同一个**location**对象

### 记录路由变化，渲染标签栏

每当路由变化，都会通过一个数据存下来，而且还能够夸组件共享，那么就需要mobx这样的状态管理库了，我们安装一下mobx

csharp

 代码解读

复制代码

`yarn add mobx mobx-react`

实现一个全局仓库

typescript

 代码解读

复制代码

`import { action, makeAutoObservable, toJS } from "mobx"; import type { Location } from "react-router-dom"; // Model the application state. class Global {      ...   permissions: any[] = [];         ...   constructor() {     makeAutoObservable(this);   }   init() {   ...     this.tabsHistory = {};    ...   }   ...   addTabHistory = (newItem: Location) => {     let temp = toJS(this.tabsHistory);     temp[newItem.pathname] = newItem;     this.tabsHistory = temp;   };   deleteTabHistory = (pathName: string) => {     let temp = toJS(this.tabsHistory);     if (Object.values(temp).length > 1) {       Reflect.deleteProperty(temp, pathName);       this.tabsHistory = temp;     }   };     ... } export default new Global();`

用法相当的简单，只不过，我实现的对象的属性添加减少的监听，就算我用deep都不好使，所以我用了一个小技巧，就是我先把数据通过tojs转化成普通的数据，让后再修改，最后直接赋值给状态，这样，引用地址改变，就会触发组件的刷线，那么怎么react组件响应mobx的刷新？

react组件需要用到**mobx-react**提供的**hoc**，`observer`

ini

 代码解读

复制代码

`export default observer(() => {     ...     useEffect(() => {     let tabsHistory = Object.values(toJS(globalStore.tabsHistory));     setItems(       tabsHistory.map((item) => {         const { pathname } = item;         let routeId = pathname.split("/").at(-1);         const { meta } = routeConfig[routeId];         return { label: meta.title, key: pathname };       })     );   }, [globalStore.tabsHistory]);   ... })`

这样，在主页的组件中进行路由全局监听，当路由发生变化就会记录，然后tabs标签组件内部，就会响应更新，从而渲染数据。

js

 代码解读

复制代码

    `<Tabs       className={styles.content}       type="editable-card"       onChange={onChange}       activeKey={activeKey}       items={items}       hideAdd={true}       onEdit={(e, action) => {         if (action == "remove") {           ;           globalStore.deleteTabHistory(e);         }       }}     />`

这就是Antd5中Tabs的使用，但是我需要修改他的默认样式，因为，我仅仅需要tab3提供切换，内部没有什么内容，但是会有多余的margin，我要去覆盖掉，还不能污染全局。

scss

 代码解读

复制代码

`.content {     :global(.ant-tabs-nav) {         margin: initial !important;     } }`

使用**css module**的`:global`来搞就完了。

### KeepAlive组件

我们做的是一个管理后台，经常会有表单填写，不能我们切换标签了，再回来啥都重置了，那体验可不好，我实现了keepAlive，放置切换重置。

![ezgif.com-gif-maker (26).gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b23c6ac2242b4c15946329e54f9384d3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

keepAlive的代码，我封装在了`R6helper`里。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8476cc81a544b0eafc112fccd7c2264~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

或者你可以直接在项目实现：

js

 代码解读

复制代码

`import { useRef, useEffect, useReducer, useMemo, memo } from 'react' import { useLocation, useOutlet } from 'react-router-dom' const KeepAlive = (props: any) => {   const outlet = useOutlet()   const { include, keys } = props   const { pathname } = useLocation()   const componentList = useRef(new Map())   const forceUpdate = useReducer((bool: any) => !bool, true)[1] // 强制渲染   const cacheKey = useMemo(     () => pathname + '__' + keys[pathname],     [pathname, keys]   ) // eslint-disable-line   const activeKey = useRef<string>('')   useEffect(() => {     componentList.current.forEach(function (value, key) {       const _key = key.split('__')[0]       if (!include.includes(_key) || _key === pathname) {         this.delete(key)       }     }, componentList.current)     activeKey.current = cacheKey     if (!componentList.current.has(activeKey.current)) {       componentList.current.set(activeKey.current, outlet)     }     forceUpdate()   }, [cacheKey, include]) // eslint-disable-line   return (     <div>       {Array.from(componentList.current).map(([key, component]) => (         <div key={key}>           {key === activeKey.current ? (             <div>{component}</div>           ) : (             <div style={{ display: 'none' }}>{component}</div>           )}         </div>       ))}     </div>   ) } export default memo(KeepAlive)`

然后替换**Outlet**标签，去掉`<Outlet/>`

ini

 代码解读

复制代码

 `<KeepAlive     include={["/center/sys/user", "/center/sys/role"]}     keys={[]} ></KeepAlive>`

封装主题定制Hoc，答应我别再重复定制主题了，封装一下好么。
------------------------------

Antd定制主题真的不要太方便，方法就是通过Antd提供的`ConfigProvider`配置theme就行了

javascript

 代码解读

复制代码

`import React from 'react'; import { ConfigProvider, Button } from 'antd'; const App: React.FC = () => (   <ConfigProvider     theme={{       token: {         colorPrimary: '#00b96b',       },     }}   >     <Button />   </ConfigProvider> ); export default App;`

类似这样，但是你不能定制一个主题，就写这么一长串吧，那也太不优雅了，这你不赶紧封装一个Hoc

js

 代码解读

复制代码

`import "react"; import { ConfigProvider, Button } from "antd"; export default (Comp, theme) => {   return (props) => {     return (       <ConfigProvider theme={theme}>         <Comp {...props} />       </ConfigProvider>     );   }; };`

然后包装一下组件，从而传入theme数据，大大方便了定制过程。

css

 代码解读

复制代码

`export default themeProviderHoc(center, {   components: {     Menu: {       colorPrimary: "blue",     },   }, });`

Antd5主题，讲究了一个token，我不管它为啥这么叫，总之就是能设置样式，而且antd5还提供了，主题定制网页，

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/daee2943535d4078aabb5c162fb645fd~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

导出配置

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ce423df5be9451fb1f2e3659053688f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

拷贝过来就行了，

但是需要提示一下，就是这个配置文件是通过localStorage存储的，有记录，想清理的话，手动清理一下。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed6b04bbcae045fcbc927ebd58855641~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 权限设计，确实有点难

我目前对权限的认知，就是希望希望通过配置一个权限数据，然后传给后台，后台根据当前用户进行记录，当这个用户登陆的时候，重新获取权限然后根据权限去控制的显示和操作。

我觉得目前理解够用了，毕竟一个简单的上手模板项目，并不需要那么复杂的权限设计。

但是我遇到了一个问题，权限控制一个大工作，就是前端的路由的鉴权，这块在React上我花了不少的功夫。

### React router你就变吧，咋变你也不好用

我用的**React router** 6.4.3，咋感觉变了呢～于是我查了一下，加了不少东西啊 ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/120f48b2e9f8416b9acfba84732a7061~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

我个人观点，我就觉得react的路由不是很好用，相比Vue router体验上我觉得差很多，技术上我没能力说谁设计好，但是我就从使用下来的体验，文档的清晰度，还是Vue router更好的，可能有很多原因是vue文档是中文的，哈哈哈哈，开玩笑的，我觉得我在实现权限控制时候，让我很别扭，相比vue，直接就有api addRoute，react我找半天发现，压根就没有这玩意，233333。

[React router 6.4.3](https://link.juejin.cn?target=https%3A%2F%2Freactrouter.com%2Fen%2Fmain%2Fstart%2Foverview "https://reactrouter.com/en/main/start/overview")

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8aa3aa0443304538bf3e6add9eabd1f5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

我之前创建路由是通过在最顶层创建一个`Router`，然后在内部我再通过`useRoutes`创建`routes`和一系列`route`的，结果这次这个api，把这三个都整合了，变成了一个。

javascript

 代码解读

复制代码

`import React from "react"; import { createRoot } from "react-dom/client"; import {   createBrowserRouter,   RouterProvider,   Route,   Link, } from "react-router-dom"; const router = createBrowserRouter([   {     path: "/",     element: (       <div>         <h1>Hello World</h1>         <Link to="about">About Us</Link>       </div>     ),   },   {     path: "about",     element: <div>About</div>,   }, ]); createRoot(document.getElementById("root")).render(   <RouterProvider router={router} /> );`

通过`RouterProvider`提供一个`provider`然后再通过`createBrowserRouter`创建一个`router`。

但是这个`RouterProvider`有点意思啊，不可以传children。。。。。，好吧，你赢了。

是简洁了很多，我用起来还挺舒服，但是当我想动态设置路由的时候，我就发现，逻辑写起来怎么那么乱呢。

### 我要动态设置路由

为什么这么设计，主要觉得权限应该控制路由的创建，而不是，路由创建出来，你通过鉴权的方式去防止跳转啥的。

我觉得最好的方式，就是路由根据权限来判断是否存在。

压根就没这个路由权限，就直接连这个路由都不渲染，这不更彻底，所以我需要动态创建路由，但是`createBrowserRouter`集成在一起了，我需要分开，这样我的逻辑能更清晰。

于是我用了原滋原味的路由配置。

js

 代码解读

复制代码

 `<>       {routerData && (         <Routes>           <Route path="/" element={<Login></Login>}></Route>           <Route             path="/center"             element={<Center></Center>}             children={routerData?.[1]?.children?.map((item) => {               return toRenderRoute(item);             })}           ></Route>         </Routes>       )}     </>`

有没有中梦回React router v4的感觉，哈哈哈，一样能实现功能，这好像React router说到做到了，他一直提倡不给你全部，只给你元功能，然后让你组装，现在看来，确实有点悟了。

然后在cneter这个主要的路由上，动态配置其内部的子组件，这样就实现的React的动态路由

ini

 代码解读

复制代码

 `const toRenderRoute = (item) => {     const { children } = item;     let arr = [];     if (children) {       arr = children.map((item) => {         return toRenderRoute(item);       });     }     return (       <Route         children={arr}         key={item.path}         path={item.path}         element={item.element}       ></Route>     );   };`

上面这段就是递归创建路由的算法逻辑，这样就实现了路由的动态配置了。

当然我这种配合权限，动态设置路由的方式只是我的一种方案，仅供参考，23333。

实现monorepo，简化启动流程
-----------------

项目目前是前端+后端的项目，后端使用的koa实现的简易版nodejs服务，这两个放在了一个repo里启动的话，需要依次安装依赖并且启动，这样操作略微不方便，那么我们简单的通过yarn workspace实现一下monorepo，然后仅仅一条命令就能实现启动。

先在package.json中配置workspace

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43eb2a098b144217b7af00f173f1a5c6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

然后在项目根目录下创建packages文件，然后把前后端两个项目移动这里。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aeae76a7d8084dc4b1e0591d658baa36~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

然后执行执行：

arduino

 代码解读

复制代码

`// 第一步：安装依赖 yarn // 第二步：启动 yarn start`

通过这样的小技巧，就能快速的启动项目了，简化了开发流程。

### 但是&并行执行命令，win可是不好使的

使用命令

vbscript

 代码解读

复制代码

`yarn workspace admin-fe dev&yarn workspace admin-server dev`

在mac是可以的，能够成功跑起来前端和后端，但是在win却无法成功，所以我们需要使用`npm-run-all`这个库，并且把命令我们改造一下：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f1389c5d537427e8e107216919f7c7d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

这样就能愉快的实现win和mac同时并行启动两条命令了。

结尾
==

这篇先讲这么多，下一篇，我们具体聊聊如何设计权限管理，以及nodejs开发服务的逻辑。

项目地址 [github.com/DLand-Team/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FDLand-Team%2Fmoderate-admin-react-antd5 "https://github.com/DLand-Team/moderate-admin-react-antd5")

至此，一个对新手友好的管理后台项目就构建好了，而且还在不断完善中，未来会补全Java后端服务项目，敬请期待，有问题可以随时咨询我，或者留言，我整了个群叫闲D岛，群号551406017，结识一帮志同道合的小伙伴，交流技术，欢迎水群（我就会玩qq，整别的，我也不会，比如公众号啥的。。。哈哈哈哈）