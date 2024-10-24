---
author: "yck"
title: "前端前沿观察，Cookie 居然可以这样整了"
date: 2020-10-30
description: "用 JS 操作 Cookie 其实是很麻烦的，并不存在一个简单的 API 能让我们获取或者设置 Cookie。 唯一一个操作 Cookie 的 API 是 documentcookie，但是这句代码使用起来很难受。如果说我们想要获取一个需要的 Cookie，可能得先写这么一个…"
tags: ["JavaScript","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:287,comments:0,collects:241,views:23793,"
---
用 JS 操作 Cookie 其实是很麻烦的，并不存在一个简单的 API 能让我们获取或者设置 Cookie。

唯一一个操作 Cookie 的 API 是 `document.cookie`，但是这句代码使用起来很难受。如果说我们想要获取一个需要的 Cookie，可能得先写这么一个 utils 函数：

```js
    function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
```

但是在 Chrome 87 版本中我们无需再引入这样的代码了，取而代之的是新的 API：`cookieStore`。这是一个**异步**的 API，可以很方便地获取设置以及监听 Cookie 的改变。

如果你想下载 beta 版本的 Chrome，可以在 [此链接](https://link.juejin.cn?target=https%3A%2F%2Fwww.google.com%2Fintl%2Fzh-CN%2Fchrome%2Fbeta%2F "https://www.google.com/intl/zh-CN/chrome/beta/") 中获取。

以下是新内容的介绍。

获取 Cookie
---------

刚才在上文中我们已经了解到在之前获取一个需要的 Cookie 是有多麻烦，如今我们只需一句话就可以获取想要的内容了。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

`cookieStore.get` 有两种函数签名，前者我们可以通过传入 cookie 的属性去匹配想要的内容，后者则是直接传入 `name` 获取。API 很符合直觉，比之前的方式不知道好到哪里去了。

当然除了获取单个 cookie 之外，新的 API 还提供了获取多个 cookie 的方式。比如说现在我想获取所有属于某个 domain 的 cookies，就可以使用如下方式：

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

设置 Cookie
---------

在之前我们如果需要设置 Cookie 的话，应该会写以下类似的代码，还是在操作 `document.cookie`

```js
    const setCookie = (name, value, days = 7, path = '/') => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString()
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=' + path
}
```

现在我们可以通过 `cookieStore.set` 来很方便的设置 Cookie 了：

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

`set` 函数支持两种签名，前者可以设置所有 Cookie 上的内容，后者就是 `key-value` 的形式。

删除 Cookie
---------

说完获取和删除 Cookie，那么相应的删除操作肯定也是不能少的。

在这之前如果你想删除一个 Cookie，那么需要把这个 Cookie 的过期时间设置在过去，过期了自然而然就失效了。

```js
    var delete_cookie = function(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };
```

看起来很奇怪，想删除一个 Cookie 不是把字段删了，而是把它过期。现在我们有了新的 API 就不需这样做了：

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

同样的，`delete` API 也有两个函数签名，单纯字符串的时候等同于需要删除 Cookie 的 `name`，传个对象时签名略有些与之前不同，需要注意签名中可选属性都是有默认值的：

```c#
    dictionary CookieStoreDeleteOptions {
    required USVString name;
    USVString? domain = null;
    USVString path = "/";
    };
```

监听 Cookie 的改变
-------------

这个功能应该是之前没有的，如今可以通过新的 API 监听 Cookie 的改变及删除。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

当我们设置或者删除 Cookie 时对应的事件就会抛出我们所改变的内容。

最后
--

以上就是本文的内容，[该链接](https://link.juejin.cn?target=https%3A%2F%2Fwicg.github.io%2Fcookie-store%2F%23CookieStore "https://wicg.github.io/cookie-store/#CookieStore")是 `cookieStore` 的文档，有兴趣的读者可以了解下。

前端前沿观察者系列主题为关注前端方向的新 API、规范、技术等，虽然我们短期内可能享受不到这些 API 带来的好处，但是总归有一天或者说 polyfill 能让我们用到这些东西。