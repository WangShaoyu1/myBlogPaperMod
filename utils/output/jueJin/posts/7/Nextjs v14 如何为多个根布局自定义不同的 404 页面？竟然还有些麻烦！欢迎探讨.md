---
author: "冴羽"
title: "Nextjs v14 如何为多个根布局自定义不同的 404 页面？竟然还有些麻烦！欢迎探讨"
date: 2024-03-28
description: "其实定义不同的 404 页面原本应该是一件非常容易的事情，但在 Nextjs 下却变得有些复杂了，使用 Nextjs 的同学，快收藏点赞这篇文章，以防日后遇到吧！"
tags: ["前端","JavaScript","React.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:38,comments:0,collects:16,views:2826,"
---
> 本文为稀土掘金技术社区首发签约文章，30天内禁止转载，30天后未获授权禁止转载，侵权必究！

前言
--

在 Next.js 中，[路由组](https://juejin.cn/book/7307859898316881957/section/7308693561648611379#heading-5 "https://juejin.cn/book/7307859898316881957/section/7308693561648611379#heading-5")这个功能非常常用，就比如我们经常会看到这样的目录结构：

```javascript
app
├─ (admin)
│  ├─ admin
│  │  └─ page.js
│  └─ layout.js
└─ (mobile)
├─ layout.js
└─ page.js
```

这里我们根据站点对路由进行了分组，`(mobile)` 负责面向用户的手机端页面，`(admin)` 负责后台管理系统。两个站点的样式和功能完全不同，所以我们使用了两个不同的根布局（layout.js）。

此时问题来了，手机端页面和后台管理系统的 404 页面也完全不同，如何自定义不同的 404 页面呢？

不要觉得这是一个简单的问题，大家所知道的 [not-found.js](https://juejin.cn/book/7307859898316881957/section/7308681814742417434#heading-13 "https://juejin.cn/book/7307859898316881957/section/7308681814742417434#heading-13") 也不能直接解决这个问题，直接写还会报错，所以才会单独写成一篇文章，而且其中还有很多值得探讨的问题。**使用 Next.js 的同学，快收藏点赞这篇文章，以防日后遇到吧！**

1\. 使用路由组定义多个根布局
----------------

先让我们写个 Demo，在实战中体会这个问题。

使用 Next.js 官方脚手架创建项目：

```bash
npx create-next-app@latest
```

运行效果如下：

![image.png](/images/jueJin/657bef5d592b404.png)

为了样式美观，我们会用到 Tailwind CSS，所以**注意勾选 Tailwind CSS**，其他随意。

进入项目目录，开启本地模式，检查项目是否能够启动成功：

```bash
npm i && npm run dev
```

涉及的目录如下：

```javascript
app
├─ (admin)
│  ├─ admin
│  │  └─ page.js
│  └─ layout.js
├─ (mobile)
│  ├─ layout.js
│  └─ page.js
├─ favicon.ico
└─ globals.css
```

删除掉原本的 `app/layout.js`和 `app/page.js`。其中 `app/(mobile)/layout.js`代码如下：

```javascript
import "../globals.css";

    export default function RootLayout({ children }) {
    return (
    <html lang="en">
    <head></head>
    <body>
    <div className="bg-indigo-600">
    <div className="max-w-screen-xl mx-auto px-4 py-3 text-white sm:text-center md:px-8">
    <p className="font-medium">
    We just launched a new version of our library! <a href="#" className="font-semibold underline duration-150 hover:text-indigo-100 inline-flex items-center gap-x-1">
    Learn more
    </a>
    </p>
    </div>
    </div>
    {children}</body>
    </html>
    );
}
```

`app/(mobile)/layout.js`代码如下：

```javascript
    export default async function Page() {
    return (
    <div className="h-60 flex-1 rounded-xl bg-teal-400 text-white flex items-center justify-center m-6 bg-indigo-400">Hello Mobile!</div>
    )
}
```

`app/(admin)/layout.js`代码如下：

```javascript
import "../globals.css";

const navigation = [{ title: "Features", path: "#" }, { title: "Integrations", path: "#" }, { title: "Customers", path: "#" }, { title: "Pricing", path: "#" }];

    export default function RootLayout({ children }) {
    return (
    <html lang="en">
    <head></head>
    <body>
    <nav className="bg-white pb-5 text-sm shadow-lg rounded-xl border mx-2 mt-2 shadow-none border-none mx-2 my-2">
    <div className="gap-x-14 items-center max-w-screen-xl mx-auto px-4 flex px-8">
    <div className="flex-1 items-center mt-8 mt-0 flex block">
    <ul className="justify-center items-center space-y-6 flex space-x-6 space-y-0">
        {navigation.map((item, idx) => {
        return (
        <li key={idx} className="text-gray-700 hover:text-gray-900"><a href={item.path} className="block">{item.title}</a></li>
        );
    })}
    </ul>
    <div className="flex-1 gap-x-6 items-center justify-end mt-6 space-y-6 flex space-y-0 mt-0">
    <a href="#" className="block text-gray-700 hover:text-gray-900"> Log in </a>
    <a href="#" className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-full inline-flex"
    > Sign in </a>
    </div>
    </div>
    </div>
    </nav>
{children}
</body>
</html>
);
}
```

`app/(admin)/admin/page.js`，代码如下：

```javascript
    export default async function Page() {
    return (
    <div className="h-60 flex-1 rounded-xl bg-teal-400 text-white flex items-center justify-center m-6">Hello Admin!</div>
    )
}
```

简单的来说，我们声明了两个根布局，然后添加了不同的样式效果。此时交互效果如下：

![next-404.gif](/images/jueJin/96dd8f0b5f82446.png)

`localhost:3000` 和 `localhost:3000/admin`分别使用了不同的布局和页面。

注：此时完整的代码地址为：[github.com/mqyqingfeng…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2Fnext-app-demo%2Ftree%2Fnext-404-1 "https://github.com/mqyqingfeng/next-app-demo/tree/next-404-1")

2\. 自定义 404 页面
--------------

自定义 404 页面，你可能会想到使用 not-found.js 这个约定文件。让我们在 `app`目录下直接添加一个 `not-found.js`，`app/not-found.js`代码如下：

```javascript
    export default function NotFound() {
    return (
    <main>
    <div className="mx-auto px-4 flex items-center justify-start px-8 mt-6">
    <div className="max-w-lg mx-auto text-center">
    <h3 className="text-gray-800 text-4xl font-semibold sm:text-5xl">
    Page not found
    </h3>
    <p className="text-gray-600 mt-3">
    Sorry, the page you are looking for could not be found or has been
    removed.
    </p>
    </div>
    </div>
    </main>
    );
}
```

随意访问一个未定义的地址，比如 [http://localhost:3000/123](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A3000%2F123 "http://localhost:3000/123")，你可能以为会正常运行，显示自定义的页面，但其实会编译错误：

![image.png](/images/jueJin/269be4b57978458.png)

报错信息提示 `not-found.js`并没有一个根布局。想想也是，我们将根布局声明在了不同的路由组中，`app`下并没有直接的 `layout.js`。

我们很自然的想到解决方法，那就将 `not-found.js` 放到其中一个路由组中，或者复制 2 份放到不同的路由组中，比如改为这种目录结构：

```javascript
app
├─ (admin)
│  ├─ admin
│  │  └─ page.js
│  ├─ layout.js
│  └─ not-found.js
├─ (mobile)
│  ├─ layout.js
│  ├─ not-found.js
│  └─ page.js
├─ favicon.ico
└─ globals.css
```

这样是不是就可以了呢？此时确实不会报错了，但却走到了默认的 404 样式上：

![image.png](/images/jueJin/14270dc24b1c441.png)

这是为什么呢？

这就要说到 `app/not-found.js` 这个约定文件的特性了。它由两种情况触发：

1.  当组件抛出了 notFound 函数的时候
2.  当路由地址不匹配的时候

**所以 `app/not-found.js` 可以修改默认 404 页面的样式。但是如果 `not-found.js`放到了任何子文件夹下的时候，它只能由 `notFound`函数手动触发。**

但因为我们使用了路由组，根布局放到了不同的路由组文件夹下，没有 `app/layout.js`这个文件。修改默认的 404 页面效果需要 `app/not-found.js`，`app/not-found.js`又需要 `app/layout.js`这个文件，没有 layout.js，编译就会报错……

那么该怎么办呢？

### 2.1. 委曲求全

一种委曲求全的方法那就是干脆不使用多个根布局了，比如改成这种目录结构：

```javascript
app
├─ (admin)
│  ├─ admin
│  │  └─ page.js
│  └─ layout.js
├─ (mobile)
│  ├─ layout.js
│  └─ page.js
├─ favicon.ico
├─ globals.css
├─ layout.js
└─ not-found.js
```

`app/layout.js`中只包含最基础的代码：

```javascript
import "../globals.css";

    export default function RootLayout({ children }) {
    return (
    <html lang="en">
    <head></head>
    <body>{children}</body>
    </html>
    );
}

```

具体导航栏和 Banner 的样式放到 `app/(admin)/layout.js`和 `app/(mobile)/layout.js`中。

这样做当然是可以的。不过因为不能再定义根布局，就不能方便的为各个根布局声明特殊的元标签或者引入文件，就像这样：

```javascript
import "./globals.css";

    export default function RootLayout({ children }) {
    return (
    <html lang="en">
    <head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
    </head>
    <body>{ children }</body>
    </html>
    );
}
```

比如移动端和后台管理系统需要引入不同的 cdn 样式或脚本文件，以及声明一些特殊的 Next.js 不支持的元数据，使用根布局是最方便的方式。如果不再使用根布局，这些问题处理起来又会麻烦一些。

### 2.2. 曲线救国

难道就没有其他的方法了吗？

一种更常用的方式是使用 [\[.... folderName\]](https://juejin.cn/book/7307859898316881957/section/7308693561648611379#heading-3 "https://juejin.cn/book/7307859898316881957/section/7308693561648611379#heading-3") 这种动态路由方式，涉及的文件和目录结构如下：

```javascript
app
├─ (admin)
│  ├─ [...not-found]
│  │  └─ page.js
│  ├─ admin
│  │  └─ page.js
│  ├─ layout.js
│  └─ not-found.js
├─ (mobile)
│  ├─ layout.js
│  └─ page.js
└─ globals.css
```

新建 `app/(admin)/[...not-found]/page.js`，代码如下：

```javascript
import { notFound } from 'next/navigation';

    export default function NotFoundDummy() {
    notFound();
}
```

`app/(admin)/not-found.js`代码跟之前一样：

```javascript
    export default function NotFound() {
    return (
    <main>
    <div className="mx-auto px-4 flex items-center justify-start px-8 mt-6">
    <div className="max-w-lg mx-auto text-center">
    <h3 className="text-gray-800 text-4xl font-semibold sm:text-5xl">
    Page not found
    </h3>
    <p className="text-gray-600 mt-3">
    Sorry, the page you are looking for could not be found or has been
    removed.
    </p>
    </div>
    </div>
    </main>
    );
}
```

此时访问 [http://localhost:3000/123](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A3000%2F123 "http://localhost:3000/123")，效果如下：

![image.png](/images/jueJin/d1afd089395849f.png)

终于看到了我们自定义的 404 页面！

原理是 \[...not-found\] 会捕获所有未定义的路由，然后抛出 notFound 函数，由同级的 not-found.js 来处理，于是展现了自定义的 404 页面。

但问题也随之而来，因为我们的 not-found.js 自定义在了 `(admin)`路由组下，所以渲染 404 页面的时候，它会被包裹在 `app/(admin)/layout.js`这个布局下。对于 `(admin)` 下的路由自然没有问题，但是对于 `(mobile)` 下的路由则有些奇怪了……

如果我们把 not-found.js 放到 `app/(mobile)` 路由组下，则还是相同的问题，（`mobile`）下没有问题，`(admin)` 就有些奇怪了……

如果要解决这个问题，我们可以再建立一个路由组，专门用来处理错误，涉及的目录结构如下：

```javascript
app
├─ (404)
│  ├─ [...not-found]
│  │  └─ page.js
│  ├─ layout.js
│  └─ not-found.js
├─ (admin)
│  ├─ admin
│  │  └─ page.js
│  └─ layout.js
├─ (mobile)
│  ├─ layout.js
│  └─ page.js
└─ globals.css
```

也就是说，我们将 404 的处理逻辑相关的文件都放到了 `(404)`路由组下，其中 `(404)/layout.js`代码如下：

```javascript
import "../globals.css";

    export default function RootLayout({ children }) {
    return (
    <html lang="en">
    <body>{children}</body>
    </html>
    )
}
```

另外两个文件代码跟之前相同。此时完整交互效果如下：

![next-404-1.gif](/images/jueJin/2da45e94a6b74e3.png)

从上图可以看出，当访问未定义的路由 [http://localhost:3000/123](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A3000%2F123 "http://localhost:3000/123") 时，自定义 404 页面并没有被包裹在布局样式中。

注：此时完整的代码地址为：[github.com/mqyqingfeng…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2Fnext-app-demo%2Ftree%2Fnext-404-2 "https://github.com/mqyqingfeng/next-app-demo/tree/next-404-2")

3\. 自定义不同的 404 页面
-----------------

回到最一开始的问题，如果我要为不同的路由组自定义不同的 404 页面呢？就比如后台管理系统和 C 端页面的 404 样式应该是不同的。

同理我们也可以使用 [\[.... folderName\]](https://juejin.cn/book/7307859898316881957/section/7308693561648611379#heading-3 "https://juejin.cn/book/7307859898316881957/section/7308693561648611379#heading-3") 这种动态路由方式，涉及的文件和目录结构如下：

```javascript
app
├─ (admin)
│  ├─ admin
│  │  ├─ [...not-found]
│  │  │  └─ page.js
│  │  ├─ not-found.js
│  │  └─ page.js
│  └─ layout.js
├─ (mobile)
│  ├─ [...not-found]
│  │  └─ page.js
│  ├─ layout.js
│  ├─ not-found.js
│  └─ page.js
└─ globals.css
```

我们分别在 `app/(mobile)`和 `app/(admin)/admin`下定义了 `[...not-found]`动态路由，使用这种方式的前提是我们约定当用户访问 `/xxxx`的时候，走到 (mobile) 路由组下，当访问 `/admin/xxx`的时候，走到 (admin) 路由组下，我们使用 \[...not-found\] 分别进行捕获，然后由各自的 not-found.js 来处理。

交互效果如下：

![next-404-2.gif](/images/jueJin/2348b5c72ef44eb.png)

注：此时完整的代码地址为：[github.com/mqyqingfeng…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2Fnext-app-demo%2Ftree%2Fnext-404-3 "https://github.com/mqyqingfeng/next-app-demo/tree/next-404-3")

同样的问题现在又来了，两个自定义的 404 页面被包裹在各自的布局中，大部分时候这并不是什么问题，甚至本来就是要这样做。但万一中的万一，产品经理就是要你不包裹在布局中，单独展示处理啊，你该怎么办呢？

你可以结合上个处理问题的方式，在每个路由组中再添加一个路由组，涉及的文件和目录结构如下：

```javascript
app
├─ (admin)
│  ├─ (404)
│  │  ├─ admin
│  │  │  └─ [...not-found]
│  │  │     └─ page.js
│  │  ├─ layout.js
│  │  └─ not-found.js
│  └─ (admin)
│     ├─ admin
│     │  └─ page.js
│     └─ layout.js
├─ (mobile)
│  ├─ (404)
│  │  ├─ [...not-found]
│  │  │  └─ page.js
│  │  ├─ layout.js
│  │  └─ not-found.js
│  └─ (mobile)
│     ├─ layout.js
│     └─ page.js
└─ globals.css
```

这个文件结构可谓是非常复杂了，我们在 (mobile) 下又添加了 (404) 和 (mobile) 路由组，由 (404) 处理自定义 404 页面，由 (mobile)/(mobile) 处理原本的路由逻辑。（admin）同理。此时交互效果如下：

![next-404-3.gif](/images/jueJin/8ec97833666d4a5.png)

这样我们就成功的排除了布局，但文件结构同时也变得复杂了，如果有更好的方法，欢迎留言讨论，最好附实现 Demo。

注：此时完整的代码地址为：[github.com/mqyqingfeng…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2Fnext-app-demo%2Ftree%2Fnext-404-4 "https://github.com/mqyqingfeng/next-app-demo/tree/next-404-4")

总结
--

其实定义不同的 404 页面原本应该是一件非常容易的事情，但在 Next.js 下却变得有些复杂了，希望未来 Next.js 会优化这部分的实现吧。

之所以会有些复杂，是因为 app/not-found.js 既可以被 notFound 函数触发，又可以在路由不匹配时触发，但 not-found.js 放在子文件的时候，只能由 notFound 函数触发。而 app/not-found.js 需要 app/layout.js，这就导致使用路由组定义多个根布局的时候会出现问题。

目前的解决方案是使用 \[...folderName\] 动态路由方式捕获不匹配的路由，手动调用 notFound 函数，再由自定义的 not-found.js 来实现样式效果。不算是一个优雅的方案，但能解决问题。希望大家不要遇到这种问题吧。

PS：学习 Next.js，欢迎入手小册[《Next.js 开发指南》](https://s.juejin.cn/ds/iFkbaMgM/ "https://s.juejin.cn/ds/iFkbaMgM/")。基础篇、实战篇、源码篇、面试篇四大篇章带你系统掌握 Next.js！