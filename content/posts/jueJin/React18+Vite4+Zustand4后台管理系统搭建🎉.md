---
author: "Jay丶"
title: "React18+Vite4+Zustand4后台管理系统搭建🎉"
date: 2023-05-23
description: "一个管理系统而已不是有手就行，要不是人手不够，后端也能做。看吧，前端就是这么人微言轻~该干的活还是得干！"
tags: ["前端","React.js","JavaScript"]
ShowReadingTime: "阅读4分钟"
weight: 460
---
前言
--

老板：搞个管理系统，我明天就要。  
前端：没空，谁爱做谁做！(小声bb)  
老板：（突然抬头）你说什么？  
前端：好的老板

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/695e4cb513c942278d5c6e269ac40bf1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

用后端的话来说，一个管理系统而已 要不是人手不够，后端也能做。  
看吧，前端就是这么人微言轻~ 该干的活还是得干。

起步
--

bash

 代码解读

复制代码

`# 使用ant design pro npm i @ant-design/pro-cli -g pro create myapp`

ok，启动项目，完成！但真的这么美好吗？

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc18325341d646ba9485a327806d273d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

问题
--

上面我们用了antd pro创建了一个react项目，看似很美好简单，但其实存在以下的问题(个人观点)

1.  集成了[dva](https://link.juejin.cn?target=https%3A%2F%2Fdvajs.com%2F "https://dvajs.com/")，基于 [redux](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Freduxjs%2Fredux "https://github.com/reduxjs/redux") 和 [redux-saga](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fredux-saga%2Fredux-saga "https://github.com/redux-saga/redux-saga") 的数据流方案，dva 还额外内置了 [react-router](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FReactTraining%2Freact-router "https://github.com/ReactTraining/react-router") 和 [fetch](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fgithub%2Ffetch "https://github.com/github/fetch")
2.  项目代码的配置、插件、组件过于繁琐 就好比下载一个360软件，你电脑上就会多出n个软件的感觉
3.  采用webpack打包，虽说[umi3.5](https://link.juejin.cn?target=https%3A%2F%2Fv3.umijs.org%2Fzh-CN%2Fdocs%2Fmfsu%23%25E4%25BB%2580%25E4%25B9%2588%25E6%2598%25AF-mfsu "https://v3.umijs.org/zh-CN/docs/mfsu#%E4%BB%80%E4%B9%88%E6%98%AF-mfsu")采用mfsu，但也是基于webpack5且对应的issue也是非常之多  
    

看张图感受一下👇

![Snipaste_2023-05-22_11-42-41.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33498a847f784530ba86bef2b16f22ad~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

这种数据流方案怎么样？是不是又臭又长，基本每个文件都要写  
每次都要connect、dispatch，而且这种还算好的，有的更是多的离谱！

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0b7f88df6934790b661667cbc854a06~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

方案
--

基于上面种种的不爽，所以还是自己搭建一个管理系统吧，相信你项目中的代码也会有不爽的地方可以分享下你的解决方案，欢迎下方留言探讨啊🤞

### 技术选型

*   [vite v4](https://link.juejin.cn?target=https%3A%2F%2Fcn.vitejs.dev%2F "https://cn.vitejs.dev/")：下一代的前端工具链，为开发提供极速响应
*   [react v18](https://link.juejin.cn?target=https%3A%2F%2Freact.dev%2F "https://react.dev/")：react18也是更新了很多好用的hook
*   [zustand v4](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fpmndrs%2Fzustand "https://github.com/pmndrs/zustand")：一个非常好用的状态管理库
*   [react router v6](https://link.juejin.cn?target=https%3A%2F%2Freactrouter.com%2Fen%2Fmain "https://reactrouter.com/en/main")
*   typescript

这里对zustand做个简单的了解，有点类似于mobx并且支持各种中间件

jsx

 代码解读

复制代码

`import { create } from 'zustand' const useBearStore = create((set) => ({   bears: 0,   increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),   removeAllBears: () => set({ bears: 0 }), })) function BearCounter() {   const bears = useBearStore((state) => state.bears)   return <h1>{bears} around here ...</h1> } function Controls() {   const increasePopulation = useBearStore((state) => state.increasePopulation)   return <button onClick={increasePopulation}>one up</button> }`

这就是一个最简单的store -> ui，是不是特别方便且是以hook的形式在组件中使用，对react技术栈的童鞋简直不要太友好🎉，官方也横向对比redux，Why zustand over redux? 具体可以查看[官方文档](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fpmndrs%2Fzustand "https://github.com/pmndrs/zustand")

再来看下中间件

jsx

 代码解读

复制代码

`import { create } from 'zustand' import { persist } from 'zustand/middleware' export const useBearStore = create(   persist(     (set, get) => ({       bears: 0,       addABear: () => set({ bears: get().bears + 1 }),     }),     {       name: 'food-storage',     }   ) )`

通过persist中间件，可以实现本地持久化存储，刷新页面会自动将本地数据装载到store中。以往做法，刷新页面取出localstorage中的数据存储到store中，这一套下来挺繁琐的，这样看来是不是感觉还挺棒👏👏👏

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2551015e9dc43bb8d5210671ae61b7c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### [项目地址](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fpanyushan-jade%2Freact-template-admin "https://github.com/panyushan-jade/react-template-admin")

一个轻量级 React18 后端管理模板，旨在快速搭建后端管理系统包含基础功能不做过渡封装，快速扩展。家人们，咱们主打就是简洁快速！

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1fd3b7c6b53d46888107cfbf87d87d3c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 目录结构

bash

 代码解读

复制代码

`├─ public                     # 静态资源 │   ├─ favicon.ico            # favicon图标 ├─ src                        # 项目源代码 │   ├─ components             # 全局公用组件 │   ├─ layout                 # 布局组件 │   ├─ config                 # 全局配置 │   │   └─ router.tsx         # 路由配置 │   ├─ services               # api接口 │   ├─ stores                 # 全局 store管理 │   ├─ utils                  # 全局公用方法 │   ├─ pages                  # pages 所有页面 │   ├─ App.tsx                # 入口页面 │   ├─ global.d.ts            # 全局声明文件 │   ├─ index.css              # 全局样式文件 │   └─index.tsx               # 源码入口 └── .commitlintrc.js          # 自定义commitlint └── .cz-config.js             # 自定义commitlint └── .eslintignore             # eslint忽略文件 └── .eslintrc.js              # eslint配置 └── .prettierrc.js            # prettier配置 └── vite.config.js            # vite打包配置 └── index.html                # html模板 └── package.json              # package.json`

### 安装及使用

shell

 代码解读

复制代码

`# 克隆项目 git clone https://github.com/panyushan-jade/react-template-admin.git # 进入项目目录 cd react-template-admin # 安装依赖 pnpm install(推荐使用pnpm) # 启动 pnpm start # 构建 pnpm build # 预览build产物 pnpm preview`

### 支持的功能

*    登录/退出登录
*    数据持久化存储
*    路由鉴权
*    动态主题
*    错误处理
*    axios 封装

### 预览

![preview.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e10076b00d53423a87147613a1b5a500~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 题外话

项目使用的是pnpm，pnpm对比npm和yarn有很明显的优势，建议大伙都用起来吧。`不过 建议node版本14+`。此外如果遇见node、pnpm、yarn等版本问题，这里推荐一个JavaScript工具管理器 [Volta](https://link.juejin.cn?target=https%3A%2F%2Fvolta.sh%2F "https://volta.sh/")。用了都知道，简直不要太香，nvm可以换掉了。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96176787e3b34ed4b3129c9e384734d8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

最后
--

目前项目还是在迭代和维护中，肯定有很多的不足以及问题，欢迎留言及[pr](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fpanyushan-jade%2Freact-template-admin%2Fpulls "https://github.com/panyushan-jade/react-template-admin/pulls")。非常非常非常感谢🤞🤞🤞，如果你觉得这个项目还不错，点个 star ⭐️ 支持一下 thanks~ [项目地址](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fpanyushan-jade%2Freact-template-admin "https://github.com/panyushan-jade/react-template-admin")

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/69589bd513e04789853b67a8e33fd5a9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)