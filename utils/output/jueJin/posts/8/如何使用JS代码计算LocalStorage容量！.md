---
author: "Sunshine_Lin"
title: "如何使用JS代码计算LocalStorage容量！"
date: 2022-03-07
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心 LocalStorage 容量 localStorage的容量大家都知道是5M，但是却很少人知道怎么去"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读1分钟"
weight: 1
selfDefined:"likes:36,comments:9,collects:26,views:3868,"
---
前言
--

大家好，我是林三心，**用最通俗易懂的话讲最难的知识点**是我的座右铭，**基础是进阶的前提**是我的初心

LocalStorage 容量
---------------

`localStorage`的容量大家都知道是`5M`，但是却很少人知道怎么去验证，而且某些场景需要计算`localStorage`的剩余容量时，就需要我们掌握计算容量的技能了~~

计算总容量
-----

我们以`10KB`一个单位，也就是`10240B`，`1024B`就是`10240`个字节的大小，我们不断往`localStorage`中累加存入`10KB`，等到超出最大存储时，会报错，那个时候统计出所有累积的大小，就是总存储量了！

> 注意：计算前需要先清空`LocalStorage`

```js
let str = '0123456789'
let temp = ''
// 先做一个 10KB 的字符串
    while (str.length !== 10240) {
    str = str + '0123456789'
}

// 先清空
localStorage.clear()

    const computedTotal = () => {
        return new Promise((resolve) => {
        // 不断往 LocalStorage 中累积存储 10KB
            const timer = setInterval(() => {
                try {
                localStorage.setItem('temp', temp)
                    } catch {
                    // 报错说明超出最大存储
                    resolve(temp.length / 1024 - 10)
                    clearInterval(timer)
                    // 统计完记得清空
                    localStorage.clear()
                }
                temp += str
                }, 0)
                })
            }
            
                (async () => {
                const total = await computedTotal()
                console.log(`最大容量${total}KB`)
                })()
```

最后得出的最大存储量为`5120KB ≈ 5M`

![](/images/jueJin/509e55654b2c43c.png)

已使用容量
-----

计算已使用容量，我们只需要遍历`localStorage`身上的存储属性，并计算每一个的`length`，累加起来就是已使用的容量了~~~

```js
    const computedUse = () => {
    let cache = 0
        for(let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
            cache += localStorage.getItem(key).length
        }
    }
    return (cache / 1024).toFixed(2)
}

    (async () => {
    const total = await computedTotal()
    let o = '0123456789'
        for(let i = 0 ; i < 1000; i++) {
        o += '0123456789'
    }
    localStorage.setItem('o', o)
    const useCache = computedUse()
    console.log(`已用${useCache}KB`)
    })()
```

可以查看已用容量

![](/images/jueJin/5f2f45a8520748f.png)

剩余可用容量
------

我们已经计算出`总容量`和`已使用容量`，那么`剩余可用容量 = 总容量 - 已使用容量`

```js
    const computedsurplus = (total, use) => {
    return total - use
}

    (async () => {
    const total = await computedTotal()
    let o = '0123456789'
        for(let i = 0 ; i < 1000; i++) {
        o += '0123456789'
    }
    localStorage.setItem('o', o)
    const useCache = computedUse()
    console.log(`剩余可用容量${computedsurplus(total, useCache)}KB`)
    })()
```

可以得出剩余可用容量

![](/images/jueJin/d3f35d127a37425.png)

结语
--

我是林三心，一个热心的前端菜鸟程序员。如果你上进，喜欢前端，想学习前端，那咱们可以交朋友，一起摸鱼哈哈，摸鱼群，点这个 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

![image.png](/images/jueJin/77d684c40acf4c4.png)