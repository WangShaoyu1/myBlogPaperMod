---
author: "Sunshine_Lin"
title: "Web Worker：靓仔，要不要试试开个「子线程」耍耍？很快的哦！"
date: 2022-01-09
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心，今天给大家讲一个你们既熟悉又陌生的东西——Web Worker 为什么js是单线程语言？ 先给大家说说"
tags: ["前端","JavaScript","性能优化中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:69,comments:20,collects:60,views:6358,"
---
前言
--

大家好，我是林三心，**用最通俗易懂的话讲最难的知识点**是我的座右铭，**基础是进阶的前提**是我的初心，今天给大家讲一个你们既熟悉又陌生的东西——**Web Worker**

为什么js是单线程语言？
------------

先给大家说说JavaScript为啥是一个单线程语言呢？咱们都知道，JavaScript是一门以前端为主的语言，而前端的舞台就是浏览器，而浏览器通过什么取悦用户呢？通过的是一个一个的DOM节点组成的页面。所以说，JavaScript最终的目的都要以页面展现的质量为目的。

![1641539889(1).jpg](/images/jueJin/5a9840aed1b6405.png)

而JavaScript设计为单线程语言也是为了页面，咱们假设JavaScript是多线程语言，如果有一天，线程1在修改DOM节点，同时线程2也在修改同一个DOM节点，那请问页面应该听谁的？这就会造成冲突，而这在用户面前可是不被允许的，所以JavaScript设计成了单线程语言，想要操作啥，都得按着顺序来。

Web Worker？
-----------

### 背景

刚刚也说了JavaScript是单线程语言，这也造成了许多问题。不知道大家平时开发的时候，有没有遇到这样的事：处理一个超级大的数据，导致整个代码的逻辑被阻塞了一段时间

![1641539197(1).png](/images/jueJin/b00fa65cd4664e7.png)

说说我遇到的场景吧：

*   1、大文件切片上传配hash时，需处理一小段时间
*   2、树形数据前端处理时，需要处理一小段时间 而这可能导致了什么`假死`问题呢？
*   1、页面渲染的阻塞
*   2、后面代码执行的阻塞

### 是什么？

`Web Worker`为了解决浏览器`假死`这个问题而孕育而生的一项新技术。它是多线程模型，也是基于宿主。它属于JavaScript线程中的一个子线程，它完全受主线程控制，但是在`Web Worker`里面是不能操作DOM的。需要保证DOM的唯一性，因此主的基调不能改变，但是需要有一个新的线程来分担繁杂的计算任务，这个也就是`Web Worker`

![1641543329(1).jpg](/images/jueJin/cb6edb0a7ad44dd.png)

兼容性：

![image.png](/images/jueJin/3a7afe552a2f47c.png)

`Web Worker`有以下特点：

*   1、一旦新建，则不会被主线程打断。即便是主线程卡死，Web Worker仍然运行中
*   2、Web Worker也受同源策略限制，同源网页才能访问
*   3、不能操作和访问DOM，前面也说了多线程操作DOM容易造成冲突，所以禁止
*   4、不能使用全局交互方法（alert、confirm等），其他全局方法基本可以使用
*   5、不能读取本地文件（其实浏览器本身就禁止JavaScript读取本地文件，出于安全考虑）
*   6、worker线程与主线程不共享作用域与资源
*   7、Web Worker有两种：
    *   `Dedicated Web Worker`：专用线程，只能在一个网页里使用这个线程
    *   `Shared Web Worker`：共享线程，可以在多个同源的网页中共享，也是跨页面通信的手段之一

使用Web Worker
------------

### 场景

为了让大家看到`Web Worker`的效果，我新建了几个文件

```js
// index.html
<script src="./index.js"></script>
<img src="./头像.jpg" alt="">

``````js
// index.js

console.time('处理数据时间')

// 模拟数据处理
    function handleData(num) {
        for (let i = 0; i < num; i++) {
        let str = ''
            while (str.length < 150) {
            str += '哈'
        }
    }
}

handleData(2000000)
console.timeEnd('处理数据时间')
```

咱们可以看看处理数据花了多少时间：

![1641542381(1).jpg](/images/jueJin/d1931e4860a5403.png)

而图片的渲染也是在这个时间之后（渲染图片也需要一定时间，所以有差值），这也说明了刚刚的数据处理，阻塞了页面的渲染：

![1641547112(1).jpg](/images/jueJin/793c5324d78a473.png)

### Web Worker基本使用

项目开发中用`Dedicated Web Worker`，比较多，所以讲讲这个的基本使用吧

改写一下`index.js`中的代码

```js
// index.js

// 实例一个 Woeker ，并传入目标文件路径，这个目标文件将会生成一个worker线程
const worker = new Worker("data.js")
// 使用 postMessage 传输信息到目标文件
worker.postMessage(2000000)
// 使用 onmessage 接受信息
    worker.onmessage = (e) => {
    console.log(e.data)
    };
    // 使用 onerror 进行目标文件，也就是指定worker线程发生错误时的回调
        worker.onerror = function (e) {
        console.log("error at " + e.filename + ":" + e.lineno + e.message)
        };
```

然后我们创建一下目标文件`data.js`，他将会生成一个`worker线程`

```js
// 使用 importScripts 进行文件的引用，可引用 url、本地js文件
importScripts('xxxxxxx')
// importScripts('xxxxxxx', 'xxxxxxxx') 也可以传多个

// 模拟数据处理
    function handleData(num) {
        for (let i = 0; i < num; i++) {
        let str = ''
            while (str.length < 150) {
            str += '哈'
        }
    }
}

    onmessage = async (e) => {
    console.time('处理数据时间')
    const res = handleData(e.data)
    postMessage('处理完了')
    console.timeEnd('处理数据时间')
}
```

### 效果

我们再来看看代码和渲染的效果，跟刚才一开始的对比下：

![1641546740(1).jpg](/images/jueJin/60f6cd067792490.png)

图片渲染也没有被阻塞：

![1641546979(1).jpg](/images/jueJin/bb3e7addb6694aa.png)

### 取消进程

可以使用`terminate`方法结束进程

```js
    worker.onmessage = (e) => {
    // 报错时马上终止指定worker进程
    worker.terminate()
    console.log(e.data)
}
```

个人理解
----

其实`Web Worker`本质上并没有改变`JavaScript单线程`这一事实，它借助的是`浏览器的多线程`

结语
--

我是林三心，一个热心的前端菜鸟程序员。如果你上进，喜欢前端，想学习前端，那咱们可以交朋友，一起摸鱼哈哈，摸鱼群，点这个 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

![image.png](/images/jueJin/5b035c3b5a28496.png)