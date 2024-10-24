---
author: "Sunshine_Lin"
title: "在LocalStorage犯的两个小错误，差点导致整个项目大崩溃"
date: 2022-06-16
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心。 背景 这次分享我在项目中关于localStorage犯的两个小错误，由于我所做的功能点，被应用到了项"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:26,comments:,collects:10,likes:3,259,"
---
前言
--

大家好，我是林三心，**用最通俗易懂的话讲最难的知识点**是我的座右铭，**基础是进阶的前提**是我的初心。

![](/images/jueJin/75e3de52b18747f.png)

背景
--

这次分享我在项目中关于`localStorage`犯的两个小错误，由于我所做的功能点，被应用到了项目的核心模块中，所以这两个小错误，差点导致了整个项目上线后崩掉，现在想想都可怕~

> 真的，有些错误虽小，但是一定要杜绝啊~

一错：LocalStorage变量废弃
-------------------

### 第一版

事情是这样的，我有一个需求，需要将一个`url`存进`LocalStorage`中

```js
const BASE_URL = 'baseUrl'

// 存时
    const setUrlStorage = (url: string) => {
    Storage.set(BASE_URL, url)
}

// 取时
    const getUrlStorage = () => {
    return Storage.get(BASE_URL)
}

// 使用时
const baseUrl = getUrlStorage() ??
'http://api.com'
```

并且这个代码上线了，用户也使用了这段代码的功能。。

### 第二版

后来，觉得直接存不太好，得加个时间戳，让这个`url`具有时效性，这时候我将代码改成了

```js
const BASE_URL = 'baseUrl'
// 失效时间
const TIME_OUT = 60 * 60 * 1000
// 存时
    const setUrlStorage = (url: string) => {
        Storage.set(BASE_URL, JSON.parse({
        url,
        // 添加时间
        time: Date.now()
        }))
    }
    
    // 取时
        const getUrlStorage = () => {
        const baseUrlObj =
        Storage.get(BASE_URL)
        const { url, time } =
        JSON.stringfy(baseUrlObj)
        // 判断是否失效
            if (Date.now() - time >= TIME_OUT) {
            return null
                } else {
                return url
            }
        }
        
        // 使用时
        const baseUrl = getUrlStorage() ??
        'http://api.com'
```

### 问题来了

![](/images/jueJin/0ef59814e6dd4f0.png)

由于之前上线了第一版了，所以有的用户已经将url存在了`LocalStorage`中了，这时候存储中是

```js
baseUrl -> 'http://linsanxin.api.com'
```

但是后来我改成了第二版并且上线了，这个时候用户使用第二版的代码去取第一版中的存储，会导致报错

```js
// 取时
    const getUrlStorage = () => {
    const baseUrlObj =
    Storage.get(BASE_URL)
    // 这里直接报错，取得是第一版的字符串
    // JSON.stringfy + 字符串 直接报错
    const { url, time } =
    JSON.stringfy(baseUrlObj)
    // ...coding
}

// 使用时
const baseUrl = getUrlStorage() ??
'http://api.com'
```

### 改正：变量废弃

那么应该怎么改正呢？大家要注意一个点：

> 当`LocalStorage`中某个缓存，它的数据格式改变了，那么一定要废弃他的`key`，换一个新的

所以正确改正方法是，将`baseUrl`这个变量废弃了，换个新的

```js
// 废弃 const BASE_URL = 'baseUrl'
const BASE_URL = 'baseUrlV2'
```

二错：JSON.parse无错误处理
------------------

由上一个错误，可以发现，在`JSON.parse`时进行错误处理，是非常重要的

> 注意：`JSON.parse`不止用在取`LocalStorage`时，还有其他很多使用场景

所以，每次`JSON.parse`时要做好错误的`兜底处理`，防止由于错误导致后面代码执行不下去

```js
// 取时
    const getUrlStorage = () => {
        try {
        const baseUrlObj =
        Storage.get(BASE_URL)
        const { url, time } =
        JSON.stringfy(baseUrlObj)
        return url
            } catch(e) {
            return null
        }
    }
```

![](/images/jueJin/d649796bfdf34b5.png)

结语
--

我是林三心，一个热心的前端菜鸟程序员。如果你上进，喜欢前端，想学习前端，那咱们可以交朋友，一起摸鱼哈哈，摸鱼群，点这个，有5000多名前端小伙伴在等着一起学习哦 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

![image.png](/images/jueJin/43a5272e47f943f.png)