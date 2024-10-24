---
author: "Sunshine_Lin"
title: "所以，etarget 和 ecurrentTarget 到底有啥区别呢？"
date: 2022-02-28
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心 背景 大家开发中经常会跟DOM的事件打交道，也会经常用到etarget和ecurrentTarge"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:197,comments:0,collects:177,views:11518,"
---
前言
--

大家好，我是林三心，**用最通俗易懂的话讲最难的知识点**是我的座右铭，**基础是进阶的前提**是我的初心

背景
--

大家开发中经常会跟DOM的事件打交道，也会经常用到`e.target`和`e.currentTarget`这两个对象，但是却有很多人根本就不知道这两个有什么区别~~~

冒泡 & 捕获
-------

当你触发一个元素的事件的时候，该事件从该元素的祖先元素传递下去，此过程为`捕获`，而到达此元素之后，又会向其祖先元素传播上去，此过程为`冒泡`

```html
<div id="a">
<div id="b">
<div id="c">
<div id="d">哈哈哈哈哈</div>
</div>
</div>
</div>
```

![](/images/jueJin/a2298b84cc0e484.png)

addEventListener
----------------

`addEventListener`是为元素绑定事件的方法，他接收三个参数：

*   第一个参数：绑定的事件名
*   第二个参数：执行的函数
*   第三个参数：
    *   false：默认，代表冒泡时绑定
    *   true：代表捕获时绑定

target & currentTarget
----------------------

### false

我们给四个div元素绑定事件，且`addEventListener`第三个参数不设置，则默认设置为`false`

```js
const a = document.getElementById('a')
const b = document.getElementById('b')
const c = document.getElementById('c')
const d = document.getElementById('d')
    a.addEventListener('click', (e) => {
        const {
        target,
        currentTarget
        } = e
        console.log(`target是${target.id}`)
        console.log(`currentTarget是${currentTarget.id}`)
        })
            b.addEventListener('click', (e) => {
                const {
                target,
                currentTarget
                } = e
                console.log(`target是${target.id}`)
                console.log(`currentTarget是${currentTarget.id}`)
                })
                    c.addEventListener('click', (e) => {
                        const {
                        target,
                        currentTarget
                        } = e
                        console.log(`target是${target.id}`)
                        console.log(`currentTarget是${currentTarget.id}`)
                        })
                            d.addEventListener('click', (e) => {
                                const {
                                target,
                                currentTarget
                                } = e
                                console.log(`target是${target.id}`)
                                console.log(`currentTarget是${currentTarget.id}`)
                                })
```

现在我们点击，看看输出的东西，可以看出触发的是d，而执行的元素是冒泡的顺序

```js
target是d currentTarget是d
target是d currentTarget是c
target是d currentTarget是b
target是d currentTarget是a
```

### true

我们把四个事件第三个参数都设置为`true`，我们看看输出结果，可以看出触发的是d，而执行的元素是捕获的顺序

```js
target是d currentTarget是a
target是d currentTarget是b
target是d currentTarget是c
target是d currentTarget是d
```

### 区别

我们可以总结出：

*   `e.target`：**触发**事件的元素
*   `e.currentTarget`：**绑定**事件的元素

结语
--

我是林三心，一个热心的前端菜鸟程序员。如果你上进，喜欢前端，想学习前端，那咱们可以交朋友，一起摸鱼哈哈，摸鱼群，点这个 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

![image.png](/images/jueJin/b87a6ff6884a4c8.png)