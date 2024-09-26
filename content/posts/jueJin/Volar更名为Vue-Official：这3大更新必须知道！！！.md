---
author: "前端开发爱好者"
title: "Volar更名为Vue-Official：这3大更新必须知道！！！"
date: 2024-03-21
description: "Volar正式更名为Vue-Official！！！Vue官方语言工具2.0这个版本将VSCode插件名称从VolarLanguageFeatures(Volar)改为了"
tags: ["前端","JavaScript","VisualStudioCode"]
ShowReadingTime: "阅读2分钟"
weight: 538
---
> 哈喽,大家好 我是 `xy`👨🏻‍💻。Volar 重大更新：正式更名为 Vue - Official！！！

`Volar` 正式更名为 `Vue - Official`！！！

Vue 官方语言工具 2.0 这个版本将 VS Code 插件名称从 `Volar Language Features` (Volar)改为了 `Vue - Official`，同时 `TypeScript Vue Plugin` 扩展也被弃用了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/393c400a7d14411398d4e12480d44a04~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1052&h=748&s=59497&e=png&b=303845)

让我们一起来看看带来了哪些新功能呢？

支持 Vue3.4 新特性
-------------

例如： Vue3.4 中增加了`属性同名简写`的的写法（`PR#9451`）：

html

 代码解读

复制代码

`<!-- 原写法 --> <img :id="id" :src="src" :alt="alt"> <MyComponent :data="data" /> <!-- 新写法 --> <img :id :src :alt> <MyComponent :data />`

之前这么用的话，Volar 会报错，现在在 `Vue - Official` 中得到支持。

拖拽导入组件
------

支持通过鼠标拖拽来导入组件：

选择想要导入的组件，按住鼠标左键拖拽到想要引入的组件，`Vscode` 会提示 `按住 shift 放入编辑器中`，按住 `shift` 后放开鼠标左键即可导入

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4903de0518d443d59853ecdd44641527~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1595&h=794&s=1167805&e=gif&f=513&b=2f3744)

TypeScript Vue Plugin 扩展弃用
--------------------------

已经更新的用户可以直接卸载 `TypeScript Vue Plugin` 插件了！！！

TypeScript 语言支持已从 Vue 语言服务器迁移至 TypeScript 插件，实现了所有 TypeScript 编辑器功能的集成。

`TypeScript Vue Plugin`（也就是此前的 Volar ts 版本）被`弃用`。现在所有功能都被合并入 `Vue - Official` 了

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ac248c7d5d045b8a5f6a3353d7aea2b~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=421&h=157&s=11778&e=png&b=2d3541)

参考连接:

*   [github.com/vuejs/langu…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Flanguage-tools%2Fblob%2Fmaster%2FCHANGELOG.md "https://github.com/vuejs/language-tools/blob/master/CHANGELOG.md")

写在最后
----

> `公众号`：`前端开发爱好者` 专注分享 `web` 前端相关`技术文章`、`视频教程`资源、热点资讯等，如果喜欢我的分享，给 🐟🐟 点一个`赞` 👍 或者 ➕`关注` 都是对我最大的支持。

欢迎`长按图片加好友`，我会第一时间和你分享`前端行业趋势`，`面试资源`，`学习途径`等等。

欢迎`加我好友`，我会第一时间和你分享`前端行业趋势`，`面试资源`，`学习途径`等等。

**WX: `xuxuxu_yyy`**

关注公众号后，在首页：

*   回复 `面试题`，获取最新大厂面试资料。
*   回复`简历`，获取 3200 套 简历模板。
*   回复`React实战`，获取 React 最新实战教程。
*   回复`Vue实战`，获取 Vue 最新实战教程。
*   回复`ts`，获取 TypeScript 精讲课程。
*   回复`vite`，获取 Vite 精讲课程。
*   回复`uniapp`，获取 uniapp 精讲课程。
*   回复`js书籍`，获取 js 进阶 必看书籍。
*   回复`Node`，获取 Nodejs+koa2 实战教程。
*   回复`数据结构算法`，获取数据结构算法教程。
*   回复`架构师`，获取 架构师学习资源教程。
*   更多教程资源应有尽有，欢迎`关注获取`