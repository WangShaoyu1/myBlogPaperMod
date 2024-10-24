---
author: "Sunshine_Lin"
title: "哪是大神？只是用他人七夕约会时间，整理「JS避免内存泄漏」罢了"
date: 2021-08-16
description: "前言 大家七夕节过得快乐吗？快乐就好，你么快乐就是我快乐。呜呜呜 哪有什么天才？他只是把别人七夕约会的时间，用在写文章上 ——陆逊 （是的，江东陆逊） 大家好，我是林三心，上一篇我给大家讲了赠你13张"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:128,comments:15,collects:89,views:5688,"
---
前言
--

大家七夕节过得快乐吗？快乐就好，你么快乐就是我快乐。呜呜呜

哪有什么天才？他只是把别人七夕约会的时间，用在写文章上 ——陆逊 （是的，江东陆逊）

![image.png](/images/jueJin/f193195bcfca4af.png) 大家好，我是林三心，上一篇我给大家讲了[赠你13张图，助你20分钟打败了「V8垃圾回收机制」](https://juejin.cn/post/6995706341041897486 "https://juejin.cn/post/6995706341041897486")，但是关知道回收机制是不行的，V8垃圾回收机制固然很强，但是我们也不能随便就制造很多垃圾让它回收，咱们得在开发中尽量减少垃圾的数量，今天就跟大家讲一讲如何避免**JS垃圾过多，内存泄漏**吧

为什么要避免
------

什么是`内存泄漏`呢？就是有些理应被回收的垃圾，却没被回收，这就造成了垃圾越积越多。

`内存泄漏`，听起来很遥远，但其实离我们很近很近，我们平时都直接或者间接地去接触过它。例如，有时候你的页面，用着用着就卡了起来，而且随着时间的延长，越来越卡，那这个时候，就要考虑是否是`内存泄漏`问题了，`内存泄漏`是影响用户体验的重大问题，所以平时通过正确的代码习惯去避免它，是非常有必要的。

如何监控内存状况
--------

咱们一直强调内存内存，但是感觉他是很虚无缥缈的东西，至少也得让咱们见见它的真面目吧？

### 浏览器任务管理器

打开方式：在浏览器顶部`右键`，打开`任务管理器`：

![截屏2021-08-03 下午10.15.23.png](/images/jueJin/a785ae7bed13489.png)

打开后，咱们看到`内存`和`JavaScript内存(括号里)`：

*   `内存`：页面里的原始内存，也就是`DOM节点`的总占用内存
*   `JavaScript内存(括号里)`：是该页面中所有`可达对象`的总占用内存

那什么是`可达对象`呢？简单说就是：就是从初始的`根对象（window或者global）`的指针开始，向下搜索子节点，子节点被搜索到了，说明该子节点的引用对象可达，搜不到，说明该子节点对象不可达。举个例子：

```js
// 可达，可以通过window.name访问
var name = '林三心'

    function fn () {
    // 不可达，访问不了
    var name = '林三心'
}
```

回到我们的任务管理，此时我们在页面中编写一段代码：

```js
<button id="btn">点击</button>
<script>
    document.getElementById('btn').onclick = function () {
    list = new Array(1000000)
}
</script>

```

点击前：

![截屏2021-08-03 下午10.16.50.png](/images/jueJin/23daa4f35fc04f0.png)

点击后，发现内存瞬间上升：

![截屏2021-08-03 下午10.17.18.png](/images/jueJin/53fc1bf27b674d2.png)

### Performance

使用Chrome浏览器的`无痕模式`，是为了避免很多其他因素，影响咱们查看内存：

![截屏2021-08-03 下午10.39.58.png](/images/jueJin/03ccafbfab2a4ae.png)

按F12打开调试窗口，选择`Performance`

![image.png](/images/jueJin/ad798d5bcf284fa.png)

咱们就以掘金首页为例吧！**点击录制 -> 刷新掘金 -> 点击stop**，可以看到以下指标随着时间的`上下波动`：

*   `JS Heap`：JS堆
*   `Documents`: 文档
*   `Nodes`: DOM节点
*   `Listeners`: 监听器
*   `GPU Memory`: GPU内存 ![juejinperf.gif](/images/jueJin/1c8bc35ae2c64dc.png)

### 堆快照

`堆快照`，顾名思义，就是将当前某一个页面的`堆内存拍下照片`存起来，同一个页面，执行某个操作前，录制堆快照是一个样，有可能执行完后，录制的堆快照又是另外一个样。

![image.png](/images/jueJin/ca9b916efffa440.png)

还是以`掘金首页`为例，可以看到当前页面内存为`13.3M`，咱们可以选择`Statistics`，查看`数组，对象，字符串`等所占内存

![掘金堆快照.gif](/images/jueJin/f3159441afe843c.png)

如何避免
----

上面说了，其实`内存泄漏`问题离我们很近，我们可能都直接或者间接造成过。接下来就说说如何避免这个问题吧，可能也是你开发中的坏习惯哦！

### 减少全局变量

我们在开发中可能遇到过这样的代码，其实我们只是想把a当做局部变量而已，但是忘记写`var，let，const`了：

```js
    document.getElementById('btn').onclick = function () {
    // a 未在外部声明过
    a = new Array(1000000).fill('Sunshine_Lin')
}

上方代码等同于
var a
    document.getElementById('btn').onclick = function () {
    a = new Array(1000000).fill('Sunshine_Lin')
}
```

这样有什么坏处呢？咱们前面说过`可达性`，在这里就可以解释了。上方代码这么写的话，咱们可以通过`window.a`去访问到`a`这个`全局变量`，所以a是可达的，他不会被当做垃圾去回收，这导致他会一直占用内存而得不到释放，消耗性能，违背了我们的初衷。咱们可以通过`堆快照`来验证一下，步骤是：`录制 -> 点击按钮 -> 录制`，比较两次的结果，点击后，内存大了`4M`，查看`Statistics`，发现数组内存大了很多，没得到释放：

![全局变量堆快照.gif](/images/jueJin/0df19c1cee13478.png)

那应该怎么改良呢？可以加上定义变量符：

```js
    document.getElementById('btn').onclick = function () {
    let a = new Array(1000000).fill('Sunshine_Lin')
}
```

看看效果，由于局部变量，`不可达`，每执行一次函数，就会被`回收`，得到释放，所以不会一直占着内存，点击前后的内存是差不多的：

![局部变量堆快照.gif](/images/jueJin/c3d5694658ac408.png)

### 未清除定时器

请看这一段代码，在这段代码中，执行完fn1函数，按理说arr数组会被回收，但是他却回收不了。为什么呢？因为定时器里的a引用着arr，并且定时器不清除的话，`a`就不会被回收，`a`不回收就会一直引用着`arr`，那么`arr`肯定也回收不了了。

```js
    function fn() {
    let arr = new Array(1000000).fill('Sunshine_Lin')
        setInterval(() => {
        let a = arr
        }, 1000)
    }
        document.getElementById('btn').onclick = function () {
        fn()
    }
```

**Performace：录制 -> 手动垃圾回收 -> 连点五次按钮 -> 手动垃圾回收 -> 结束**

首尾两次手动垃圾回收，是为了对比首尾两次垃圾内存最低点，而如果没有内存泄漏问题的话，首尾两次最低点应该是相同的，这里可以看到，尾部比首部多出的那部分，就是没有被回收的内存量 ![定时器perf.gif](/images/jueJin/980f017b46bf480.png)

上面说了，`arr数组`为啥没被回收？是因为`定时器`没清除，导致`a`一直引用`arr`，那怎么解决呢？直接把`定时器`清除就行了。

```js
    function fn() {
    let arr = new Array(1000000).fill('Sunshine_Lin')
    let i = 0
        let timer = setInterval(() => {
        if (i > 5)  clearInterval(timer)
        let a = arr
        i++
        }, 1000)
    }
        document.getElementById('btn').onclick = function () {
        fn()
    }
```

再看看`Performance`，发现首位两次的内存量是一样的，这就说明正常了

![清除定时器perf.gif](/images/jueJin/0892e8b6aefc47b.png)

### 合理使用闭包

咱们来看这一段代码：

```js
    function fn1() {
    let arr = new Array(100000).fill('Sunshine_Lin')
    
    return arr
}
let a = []
    document.getElementById('btn').onclick = function () {
    a.push(fn1())
}
```

按理说，`fn1`执行完后，`arr`会被回收，但是在这段代码中，却是没有被回收，为什么呢？因为`fn1`执行后，将`arr`给`return`出去，然后`arr`被`push进a数组`了，而a数组是个全局变量，`a数组`是不会被回收的，那么`a数组`里的东西自然也不会被回收，这就导致`arr`不会被回收，等到点击越来越多次，不可被回收的`arr`就会越来越多，如果`a`后来没有被用到，那这些`arr`就成无用的垃圾了，咱们可以通过`Performance`和`堆快照`来验证：

**Performace：录制 -> 手动垃圾回收 -> 连点五次按钮 -> 手动垃圾回收 -> 结束**

首尾两次手动垃圾回收，是为了对比首尾两次垃圾内存最低点，而如果没有内存泄漏问题的话，首尾两次最低点应该是相同的，这里可以看到，尾部比首部多出的那部分，就是没有被回收的内存量

![闭包perfo.gif](/images/jueJin/799e9ab20b6f4d0.png)

**堆快照：第一次录制 -> 连点5次按钮 -> 第二次录制**

会发现，点击前后，内存多了很多，多出来的就是未被回收的内存量

![闭包堆快照.gif](/images/jueJin/1d979773563a497.png)

### 分离DOM

什么叫`分离DOM`呢？还是利用代码来说话：

```js
<button id="btn">点击</button>

let btn = document.getElementById('btn')
document.body.removeChild(btn)
```

虽然最后把button给删除了，但是因为全局变量`btn`对此`DOM对象`引用着，导致此`DOM`对象一直没有被回收，这个`DOM对象`就称为`分离DOM`，咱们可以通过`堆快照`来验证这个问题，在堆快照里搜索`detached(中文意思为：独立，分离)`：

![分离DOM堆快照.gif](/images/jueJin/063b58ed7fd74d0.png)

这个问题很好解决，删除button后，顺便把btn设置成`null`就行了：

```js
<button id="btn">点击</button>

let btn = document.getElementById('btn')
document.body.removeChild(btn)
btn = null
```

此时才是真的把button这个DOM，从js中彻底抹去：

![分离domnull.gif](/images/jueJin/730db6dc88f0469.png)

参考资料
----

*   [淘宝前端是怎么做优化？如何高效书写 JavaScript ？提高 JS 性能有哪些骚操作？](https://link.juejin.cn?target=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1NK4y1S7aj%3Fp%3D19 "https://www.bilibili.com/video/BV1NK4y1S7aj?p=19")
*   [一文带你了解如何排查内存泄漏导致的页面卡顿现象](https://juejin.cn/post/6947841638118998029 "https://juejin.cn/post/6947841638118998029")

结语
--

其实避免`内存泄漏`，不止这几个做法，还有很多做法，我这里列举了四个比较常见的做法，希望大家在开发中能避免，提高自己的代码质量，提高用户体验。

> 如果你觉得此文对你有一丁点帮助，点个赞，鼓励一下林三心哈哈。或者加入我的群哈哈，咱们一起摸鱼一起学习 : meron857287645