---
author: "冴羽"
title: "（技巧）当 Nextjs 遇到频繁重复的数据库操作时，记住使用 React 的 cache 函数"
date: 2024-03-21
description: "如果数据量大、操作比较费时，频繁重复的查询会浪费很多时间，为了提高性能，此时就需要加入数据缓存机制。那么该如何实现呢？这就是本篇要讲的主题之一 —— React cache。"
tags: ["前端","JavaScript","React.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:43,comments:9,collects:41,views:3383,"
---
> 本文为稀土掘金技术社区首发签约文章，30天内禁止转载，30天后未获授权禁止转载，侵权必究！

前言
--

在开发 Next.js 项目的时候，应该优先使用 fetch 获取数据，因为 Next.js 拓展了原生的 fetch，为了提高应用性能，增加了缓存和重新验证机制。

然而，也不是所有时候都能使用 fetch，就比如获取数据库中的数据，就可能需要自己使用 ORM 库（如 Prisma）查询获取。如果数据量大、操作比较费时，频繁重复的查询会浪费很多时间，为了提高性能，此时就需要加入数据缓存机制。

那么该如何实现呢？这就是本篇要讲的主题之一 —— React cache。

PS：学习 Next.js，欢迎入手小册[《Next.js 开发指南》](https://s.juejin.cn/ds/iFkbaMgM/ "https://s.juejin.cn/ds/iFkbaMgM/")。基础篇、实战篇、源码篇、面试篇四大篇章带你系统掌握 Next.js！

技巧一：React cache
---------------

React 提供了 [cache](https://link.juejin.cn?target=https%3A%2F%2Fzh-hans.react.dev%2Freference%2Freact%2Fcache "https://zh-hans.react.dev/reference/react/cache") 函数，用于缓存数据获取或计算的结果，用法如下：

```javascript
const cachedFn = cache(fn);
```

注意：

1.  cache 仅供与 React 服务端组件一起使用
2.  cache 目前仅在 React 的 Canary 和实验渠道中可用

当结合 Next.js 使用时，举个例子：

```javascript
// app/utils.js
import { cache } from 'react'

    export const getItem = cache(async (id) => {
    const item = await db.item.findUnique({ id })
    return item
    })
```

现在我们调用两次 `getItem` ：

```javascript
// app/item/[id]/layout.js
import { getItem } from '@/utils/get-item'

export const revalidate = 3600

    export default async function Layout({ params: { id } }) {
    const item = await getItem(id)
    // ...
}
``````javascript
// app/item/[id]/page.js
import { getItem } from '@/utils/get-item'

export const revalidate = 3600

    export default async function Page({ params: { id } }) {
    const item = await getItem(id)
    // ...
}
```

我们在布局和页面中各调用了一次 `getItem`，尽管 `getItem` 被调用两次，但只会产生一次数据库查询。

实战体会
----

还是让我们在实战中体会 cache 函数的作用吧。

使用 Next.js 官方脚手架创建项目：

```bash
npx create-next-app@latest
```

运行效果如下：

![image.png](/images/jueJin/2800de512038498.png)

为了样式美观，我们会用到 Tailwind CSS，所以**注意勾选 Tailwind CSS**，其他随意。

进入项目目录，开启本地模式，检查项目是否能够启动成功：

```bash
npm i && npm run dev
```

我们以实现这样一个文章页面为例进行讲解：

![image.png](/images/jueJin/f53cc8026c554dd.png)

当我们访问 `/article`路由的时候，显示一篇文章的具体信息。蓝色部分是一个通知 banner，下边的是文章的具体内容，此外还要注意页面的 title 为文章的标题。

### 静态渲染

涉及的文件和目录结构如下：

```javascript
app
└─ article
├─ layout.js
├─ page.js
└─ utils.js
```

新建 `app/article/layout.js`，代码如下：

```javascript
import { getArticle } from './utils'

export const revalidate = 10

    export default async function Layout({ children }) {
    const { title } = await getArticle()
    return (
    <div>
    <div className="bg-indigo-600">
    <div className="max-w-screen-xl mx-auto px-4 py-3 text-white sm:text-center md:px-8">
    <p className="font-medium">
您正在阅读文章 {title}
</p>
</div>
</div>
{children}
</div>
)
}
```

新建 `app/article/page.js`，代码如下：

```javascript
import { getArticle } from './utils'

    export async function generateMetadata() {
    const { title } = await getArticle()
    
        return {
        title
    }
}

    export default async function Page() {
    const { title } = await getArticle()
    return <div className="space-y-3 text-center">
    <h1 className="text-3xl text-gray-800 font-semibold mt-5">
文章标题：{title}
</h1>
<p className="text-gray-600 max-w-lg mx-auto text-lg">
Assume this is the text of the article
</p>
</div>
}
```

新建 `app/article/utils.js`，代码如下：

```javascript
import { cache } from 'react'

const sleep = ms => new Promise(r => setTimeout(r, ms));

    export const getArticleWithoutCache = async () => {
    await sleep(2000)
    console.log('执行了一次')
        return {
        title: Math.random().toString(36).slice(-6)
    }
}

export const getArticle = cache(getArticleWithoutCache)
```

为了模拟数据库操作的费时，我们用了一个 sleep 函数。为了演示数据缓存和更新的效果，每次调用的时候，我们都会随机返回一个文章标题。

此时交互效果如下：

![react-cache-1.gif](/images/jueJin/fb0d3e7f2ed4424.png) 当点击刷新按钮的时候，页面会加载 2s，然后渲染出具体的内容。我们分别在 layout、page、generateMetadata 中调用了 getArticle 函数。

如果没有做缓存，三次调用会返回不同的文章标题。但是因为使用了 React Cache 做缓存，三次调用会返回相同的文章标题。**使用 React Cache，我们就可以自由的在需要数据的地方直接查询数据，而不用担心频繁重复的查询导致性能问题，也不需要在顶层组件查询数据，然后将数据一层一层传给需要的组件。**

那如何更新数据呢？

我们在布局的代码中也加入了重新验证：

```javascript
export const revalidate = 10
```

这个配置的意思是最少 10s 进行一次重新验证。也就是说，当我们**运行生产版本**时，刷新页面，页面的数据暂时不会发生变化。10s 内页面刷新都不会发生变化，但 10s 之后的第一次刷新依然会返回之前的缓存内容，但会触发重新验证，缓存更新成功后，10s 之后的第二次刷新会返回最新的内容。交互效果如下：

![react-cache-2.gif](/images/jueJin/a64d05821ed04ef.png)

为了防止混淆，关于 React Cache，有一点要强调的是，**React Cache 函数解决的是记忆化问题，也就是在一次路由渲染中，对频繁重复的数据查询进行缓存。**

我们在这里使用 revalidate 能够触发更新，是因为 Next.js 对 `/article`进行了静态渲染，revalidate 触发了重新渲染，在渲染的时候，因为 React Cache，三次调用的返回结果才是一致的。也就是页面标题、banner 内容、文章标题，三个地方的内容一致，这是 React Cache 的功效。

### 动态渲染

让我们用下动态渲染来重新说明这点：

涉及的文件和目录结构如下：

```javascript
app
└─ article
└─ [id]
├─ layout.js
├─ page.js
└─ utils.js

```

修改 `app/article/[id]/layout.js`，代码如下：

```javascript
import { getArticle } from './utils'

export const revalidate = 10

    export default async function Layout({ children, params: { id } }) {
    const { title } = await getArticle(id)
    return (
    <div>
    <div className="bg-indigo-600">
    <div className="max-w-screen-xl mx-auto px-4 py-3 text-white sm:text-center md:px-8">
    <p className="font-medium">
您正在阅读文章 {title}
</p>
</div>
</div>
{children}
</div>
)
}
```

新建 `app/article/[id]/page.js`，代码如下：

```javascript
import { getArticle } from './utils'

    export async function generateMetadata({ params: { id } }) {
    const { title } = await getArticle(id)
    
        return {
        title
    }
}

    export default async function Page({params: { id }}) {
    const { title } = await getArticle(id)
    return <div className="space-y-3 text-center">
    <h1 className="text-3xl text-gray-800 font-semibold mt-5">
文章标题：{title}
</h1>
<p className="text-gray-600 max-w-lg mx-auto text-lg">
Assume this is the text of the article
</p>
</div>
}
```

新建 `app/article/[id]/utils.js`，代码如下：

```javascript
import { cache } from 'react'

const sleep = ms => new Promise(r => setTimeout(r, ms));

    export const getArticleWithoutCache = async (id) => {
    await sleep(2000)
    console.log('执行了一次')
        return {
        id,
        title: Math.random().toString(36).slice(-6)
    }
}

export const getArticle = cache(getArticleWithoutCache)
```

运行 `npm run build && npm run start`开启生产版本，此时交互效果如下：

![react-cache-3.gif](/images/jueJin/d5023e88121749c.png)

因为使用了动态路由，此时路由动态渲染。每次刷新页面，都会等待 2s，然后页面内容展现，三个部分的文章内容一致。

可以看出：React Cache 函数解决的是记忆化问题，也就是在一次路由渲染中，对频繁重复的数据查询进行缓存。**React 实现了 fetch 请求的自动缓存，但对于像数据库查询这种复杂费时的操作，则需要使用 React 的 cache 函数进行缓存。**

技巧二：预加载数据
---------

接下来我们讲讲第二个性能优化技巧 —— 预加载数据。

我们写代码的时候，常会遇到这样的例子：

```javascript
// app/article/[id]/page.js
import Article, { checkIsAvailable } from '@/components/Article'

    export default async function Page({ params: { id } }) {
    // 执行另一个异步任务，这里是伪代码
    const isAvailable = await checkIsAvailable()
    
    return isAvailable ? <Article id={id} /> : null
}
```

让我解释这段代码的含义：比如我们访问一个文章页面，此时需要检查用户是否有权限访问这个页面（checkIsAvailable），如果有权限，isAvailable 为 true，此时再渲染具体的文章内容，也就是 `<Article>` 组件。Article 组件会根据 id 请求具体的文章数据，我们假设调用 getArticle 方法。

这样就涉及到了 2 个接口，一个是 checkIsAvailable，一个是 getArticle，两个接口是串行的，先调用 checkIsAvailable，再调用 getArticle

有没有方法优化一下？

那就是预加载，在调用 checkIsAvailable 前其实就已经知道了文章 id，直接请求文章具体数据，然后将数据缓存，当 checkIsAvailable 返回为 true 的时候，就可以直接使用文章具体数据了。也就是：

```javascript
// app/article/[id]/page.js
import Article, { preload, checkIsAvailable } from './components/Article'

    export default async function Page({ params: { id } }) {
    preload(id)
    // 执行另一个异步任务，这里是伪代码
    const isAvailable = await checkIsAvailable()
    
    return isAvailable ? <Article id={id} /> : null
}
```

而在具体的 preload 函数中，则要搭配 cache 函数一起使用：

```javascript
// components/Article.js
import { getArticle } from '@/utils/get-article'
import { cache } from 'react'

    export const getArticle = cache(async (id) => {
    // ...
    })
    
        export const preload = (id) => {
        void getArticle(id)
    }
    
        export const checkIsAvailable = (id) => {
        // ...
    }
    
        export default async function Article({ id }) {
        const result = await getArticle(id)
        // ...
    }
```

使用这种方式，你就可以提前获取数据，缓存返回结果。

但是此时还有一个问题，那就是数据获取不一定就只发生在服务端，如果你在客户端发送了请求，尽管不会显示在页面上，但在接口中暴露了文章的具体数据，这也不好。所以还需要保证数据获取只发生在服务端。

保证代码只执行在服务端，Next.js 推荐使用 server-only 这个包，用法也很简单，导入即可：

```bash
import 'server-only'

    export async function getData() {
        const res = await fetch('https://external-service.com/data', {
            headers: {
            authorization: process.env.API_KEY,
            },
            })
            
            return res.json()
        }
```

现在，任何导入 getData() 的客户端组件都会收到一个构建时错误，说明该模块只能在服务器上使用。

那么结合 preload、React cache 函数、server-only，就可以写一个 utils 工具函数：

```javascript
// utils/get-article.js

import { cache } from 'react'
import 'server-only'

    export const preloadArticle = (id) => {
    void getArticle(id)
}

    export const getArticle = cache(async (id) => {
    // ...
    })
```

现在，你可以提前获取数据、缓存返回结果，并保证数据获取只发生在服务端。此外，布局、页面、组件都可以使用 `utils/get-article.js`

实战体会
----

还是让我们在实战中体会预加载的特性吧！

涉及的文件和目录结构如下：

```javascript
app
└─ article2
└─ [id]
├─ page.js
└─ utils.js
```

新建 `app/article2/[id]/page.js`，代码如下：

```javascript
import Article, { preloadArticle, checkIsAvailable } from './utils'

    export default async function Page({ params: { id } }) {
    preloadArticle(id)
    const isAvailable = await checkIsAvailable()
    
    return isAvailable ? <Article id={id} /> : null
}
```

新建 `app/article2/[id]/utils.js`，代码如下：

```javascript
import { cache } from 'react'
import 'server-only'

const sleep = ms => new Promise(r => setTimeout(r, ms));

    export const preloadArticle = (id) => {
    void getArticle(id)
}

    export const getArticle = cache(async (id) => {
    await sleep(5000)
        return {
        id,
        title: Math.random().toString(36).slice(-6)
    }
    })
    
        export const checkIsAvailable = async () => {
        await sleep(5000)
        return true
    }
    
        export default async function Article({ id }) {
        const { title } = await getArticle(id)
        return <div className="space-y-3 text-center">
        <h1 className="text-3xl text-gray-800 font-semibold mt-5">
    文章标题：{title}
    </h1>
    <p className="text-gray-600 max-w-lg mx-auto text-lg">
    Assume this is the text of the article
    </p>
    </div>
}
```

为了让效果更加明显，checkIsAvailable 和 getArticle 我们都加了一个 5s 延时，如果没有预加载和缓存，页面需要 10s 才能渲染内容，使用预加载和缓存后，因为接口同时请求，所以页面 5s 后就会渲染出内容。交互效果如下：

![react-cache-4.gif](/images/jueJin/02d49725ce134b7.png)

PS：你可能会有疑惑，checkIsAvailable 也可能返回 false 呀，这样不就白浪费一个接口请求了吗？所以说，这是一种取舍，如果 checkIsAvailable 这个接口常常返回 true，那么使用预加载是一个不错的选择。

总结
--

在 Next.js 项目开发中，数据库查询操作是非常常见的操作，如果重复且费时，建议加上缓存机制，此时就需要使用 React 的 cache 函数辅助实现。但是要注意，cache 函数解决的是记忆化问题，它不能像 Next.js 自身的数据缓存可以跨用户请求和部署。

基于 React 的 cache 函数，还有一种常见的性能优化策略就是 preload，它的本质上是将串行接口改为并行接口，并通过 cache 缓存数据返回。

PS：学习 Next.js，欢迎入手小册[《Next.js 开发指南》](https://s.juejin.cn/ds/iFkbaMgM/ "https://s.juejin.cn/ds/iFkbaMgM/")。基础篇、实战篇、源码篇、面试篇四大篇章带你系统掌握 Next.js！