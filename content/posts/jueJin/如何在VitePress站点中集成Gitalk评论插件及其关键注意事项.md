---
author: "陈明勇"
title: "如何在VitePress站点中集成Gitalk评论插件及其关键注意事项"
date: 2024-09-26
description: "在本文中，我们深入探讨了如何在VitePress站点中集成Gitalk评论插件，详细介绍了准备工作和集成步骤及其关键注意事项。"
tags: ["后端","VitePress"]
ShowReadingTime: "阅读6分钟"
weight: 126
---
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af4d5f7ce922427ab24d63b526270c33~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1080&h=350&s=104940&e=png&b=fefefe)

> 最近我使用了 `Vitepress` 来构建我的开源电子书 《Go 语言成长之路：从入门到精通》（[Github 链接](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fchenmingyong0423%2Fgo-path-to-mastery-book "https://github.com/chenmingyong0423/go-path-to-mastery-book")），并引入了 `Gitalk` 评论插件。这里分享一下集成 `Gitalk` 的实现步骤和心得体会，希望对有需要的人有所帮助。

前言
--

`VitePress` 是一个静态站点生成器 (`SSG`)，非常适合用于个人博客或编写技术文档，深受很多开发者的喜爱。不过它缺少一个重要的功能——评论。

虽然 `VitePress` 没有内置评论功能，但它支持默认主题的扩展，并允许在 `markdown` 文件中嵌入 `vue` 代码。因此，我们可以自行集成评论功能。

本文将介绍如何在 `Vitepress` 站点中集成 `Gitalk` 插件，`Gitalk` 是一个基于 `GitHub Issue` 和 `Preact` 开发的评论插件。它支持使用 `GitHub` 登录、支持多语言 `[en, zh-CN, zh-TW, es-ES, fr, ru, de, pl, ko, fa, ja]`、支持个人或组织、无干扰模式（设置 `distractionFreeMode` 为 `true` 开启）、快捷键提交评论 （`cmd|ctrl + enter`）。

准备好了吗？准备一杯你最喜欢的咖啡或茶，随着本文一探究竟吧。

![请在此添加图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb87afb5a6124708b5635605a039eeb7~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=590&h=833&s=71942&e=jpg&b=fefcfc)

创建一个 github 仓库
--------------

在集成 `Gitalk` 插件之前，我们需要创建一个新的 `Github` 仓库，用于存储评论信息（以 `Issue` 的形式进行存储）。当然，如果 `Vitepress` 站点项目存储在一个 `Github` 仓库里，我们也可以将它作为存储评论信息的仓库，就不用额外创建一个新的仓库了。

创建仓库的步骤在这里就不多说了，我相信这个操作对于大家来说简直是小菜一碟，直接跳过。

注册 Github OAuth application
---------------------------

我们需要为 `vitepress` 站点创建一个 `Oauth` 应用，获取到一个 `ClientId` 和 `Client Secret`，后续集成 `gitalk` 插件的时候用到。

*   **1、进入开发者设置页面**
    *   点击右上角的头像，然后选择 `setting`。 ![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/94272348ce3246b085a667d1b60c4caf~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6ZmI5piO5YuH:q75.awebp?rk3s=f64ab15b&x-expires=1727909821&x-signature=2m0RbkMwrqTmpTawpXrKrww0Gd0%3D)
        
    *   在左侧菜单中，找到 `Developer settings` 并点击。
        
        ![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/59f6ec854f44428581d3940396635cc2~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6ZmI5piO5YuH:q75.awebp?rk3s=f64ab15b&x-expires=1727909821&x-signature=IRVItr9UmB4F7yOfVdjBf297O1I%3D)
        
*   **2、注册新的 OAuth 应用**
    *   选择 `Oauth Apps，点击` Register a new application\` 按钮，进入到注册页面。 ![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/56d38fdc36944c0088840be8c29155ae~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6ZmI5piO5YuH:q75.awebp?rk3s=f64ab15b&x-expires=1727909821&x-signature=SjUhdh89nX4P4Mq2jO8ut%2B5BNFs%3D)
        
    *   填写应用信息
        
        *   **Application name：** 应用名称，例如 `site name comment`。
            
        *   **Homepage URL：** 站点主页 `URL`，例如 `https://yourblog.com`。
            
        *   **Application description：** 应用描述。
            
        *   **Authorization callback URL：** 一般与 `Homepage URL` 相同，填写 `https://yourblog.com`。如果你的 `vitepress` 项目部署在子路径下，需要填写完整路径，例如 `https://yourblog.com/path`。
            
        *   **Enable Device Flow**：是否允许 `OAuth` 应用通过设备流（`Device Flow`）来授权用户，本文介绍的使用场景不需要。
            
        
        ![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/d5c12e8a0f274944828ef8a01cfa2941~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6ZmI5piO5YuH:q75.awebp?rk3s=f64ab15b&x-expires=1727909821&x-signature=0dH%2BfVaNP1%2BkxGk%2FZlKhmgButsM%3D)
        
*   **3、提交信息** 最后点击 `Register application` 提交信息，之后会得到一个 `ClientId` 和 `Client Secret`。如果 `Client Secret` 没有自动生成，页面会显示生成该值的按钮，你可以手动点击按钮进行生成。离开或刷新页面之后，`Client Secret` 不会再次显示，因此你需要保存它。若忘记，只能重新生成。

在 Vitepress 项目中集成 Gitalk
------------------------

在配置 `Gitalk` 之前，确保你已经创建了一个 `vitepress` 项目。

### 安装 Gitalk

shell

 代码解读

复制代码

`npm i --save gitalk`

### 配置 Gitalk

完成以下配置后，相关的文件目录结构将包含以下部分：

txt

 代码解读

复制代码

`├── .vitepress/ │   ├── theme │   │   ├── index.ts │   │   └── MyLayout.vue │   └── gitalk.ts`

*   1、在 `.vitepress` 目录下创建 `gitalk.ts` 文件，添加以下内容：
    
    typescript
    
     代码解读
    
    复制代码
    
    `import Gitalk from 'gitalk'; import 'gitalk/dist/gitalk.css'; export default function createGitalk(path: string) {     const gitalk = new Gitalk({         clientID: 'GitHub Application Client ID',         clientSecret: 'GitHub Application Client Secret',         repo: '仓库名',         owner: '填写你的 Username',         admin: ['填写管理员的 Username'],         id: path,      // 确保唯一性和长度小于 50         distractionFreeMode: false  // 类似 facebook 的无干扰模式     });     gitalk.render('gitalk-container'); }`
    
    上面设置了 `clientID` 和 `clientSecret` 等常用的属性，除了这些属性以外，还有一些可选属性可以设置，具体请参考 [gitalk](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fgitalk%2Fgitalk%2Fblob%2Fmaster%2Freadme-cn.md%23%25E8%25AE%25BE%25E7%25BD%25AE "https://github.com/gitalk/gitalk/blob/master/readme-cn.md#%E8%AE%BE%E7%BD%AE")。
    
*   2、在 `.vitepress` 目录下创建 `theme/MyLayout.vue` 文件，添加以下内容，在每个文档末尾引入评论组件，以扩展默认主题：
    
    vue
    
     代码解读
    
    复制代码
    
    `<template>   <Layout>     <template #doc-after>       <div id="gitalk-container"></div>     </template>   </Layout> </template> <script type="ts" setup> import DefaultTheme from 'vitepress/theme' const {Layout} = DefaultTheme import {watch, nextTick, onMounted} from "vue"; import "gitalk/dist/gitalk.css"; import {useRouter} from "vitepress"; import createGitalk from "../gitalk"; let {route} = useRouter(); // 页面路由对象 // 初始化 Gitalk const initGitalk = () => {   if (typeof window !== 'undefined') {     const container = document.getElementById('gitalk-container');     if (container) {       container.innerHTML = '';       createGitalk(route.path);     }   } }; onMounted(() => {   // 初次加载时初始化 Gitalk   initGitalk();   // 监听路由变化   watch(       () => route.path,       (newPath) => {         nextTick(() => {           initGitalk();         });       }   ); }); </script>`
    
    其中 `<template #doc-after>自定义内容</template>` 的作用是在文档结尾处插入自定义内容。
    
    由于 `vitepress` 初次访问时是静态的、预呈现的 `HTML`，之后页面会变成 `Vue SPA`。因此页面初次加载时直接调用 `initGitalk()` 函数初始化 `Gitalk` 评论组件，后续通过监听路由变化为新页面重新生成 `Gitalk` 评论组件。
    
*   3、在 `.vitepress` 目录下创建 `theme/index.ts` 文件，添加以下内容，使用扩展后的主题：
    
    typescript
    
     代码解读
    
    复制代码
    
    `import DefaultTheme from 'vitepress/theme'; import MyLayout from "./MyLayout.vue"; export default {     ...DefaultTheme,     Layout: MyLayout, }`
    
*   4、验证 接下来访问某篇文章，如果看到类似下面图片的渲染效果，说明 `Gitalk` 已配置成功了：
    
    ![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/66772bcf6c12463e82f0aea7a603d05b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6ZmI5piO5YuH:q75.awebp?rk3s=f64ab15b&x-expires=1727909821&x-signature=yPHXTD0djowz0FJhZMUUXqIMTRY%3D)
    

如何有效设置 ID 属性值
-------------

在前面的代码示例中，通过 `new Gitalk({...})` 创建 `Gitalk` 实例时，我们需要显式的设置一些属性值，其中就包括了 `id`。

默认情况下，`id` 值为 `location.href`，你也可以赋值为 `route.path`，但这并非最佳实践，特别是在路径较长或复杂时。最佳做法是从 `location.href` 或 `route.path` 中提取关键且唯一的部分作为 `id`。

例如，在我的 《Go 语言成长之路：从入门到精通》 开源电子书项目中，其中一篇文章的路由是 `/book/go-basic/go-language-introduction.html`。我从中提取了 `go-language-introduction` 作为 `id`，相关函数定义如下所示：

typescript

 代码解读

复制代码

`const generateId = (path) => {   return path       .split('/') // 按照 / 切分       .pop() // 取最后一个部分       .replace(/\.html$/, ''); // 去掉结尾的 .html };`

通过这种方式，我们可以确保 `id` 既简洁又唯一，便于管理和维护。

未找到相关的 Issues 进行评论
------------------

在我看来，首次访问文章时 `Gitalk` 应该自动创建相应的 `issue` 来保存评论信息，但我却看到了 **“未找到相关的 Issues 进行评论，请联系 @xxx 初始化创建”** 的提示。查阅 `Gitalk` 的说明文档后，我了解了具体原因。首先，`createIssueManually` 是创建 `Gitalk` 实例时的一个可选属性。`Gitalk` 官方提到：

> *   createIssueManually Boolean
>     
>     Default: false.
>     
>     如果当前页面没有相应的 isssue 且登录的用户属于 admin，则会自动创建 issue。如果设置为 true，则显示一个初始化页面，创建 issue 需要点击 init 按钮。
>     

因此，当出现 **“未找到相关的 Issues 进行评论”** 的提示时，需要使用管理员 `GitHub` 账号登录，才能让 `Gitalk` 自动创建对应的 `issue`；如果 `createIssueManually` 的值为 `true`，则需要手动点击 `init` 按钮来创建 `issue` 。

小结
--

在本文中，我们深入探讨了如何在 `VitePress` 站点中集成 `Gitalk` 评论插件，详细介绍了准备工作和集成步骤及其关键注意事项。

最关键的部分在于如何优雅地将评论组件引入文档中（使用扩展默认的 `VitePress` 主题的方式），以及设置有效的 `ID` 属性值。此外，我们还需了解 `Gitalk` 触发自动创建 `issue` 操作的前提条件。

* * *

**你好，我是陈明勇，一名热爱技术、乐于分享的开发者，同时也是开源爱好者。**

**成功的路上并不拥挤，有没有兴趣结个伴？**

**关注我，加我好友，一起学习一起进步！**