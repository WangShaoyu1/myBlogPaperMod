---
author: "Sunshine_Lin"
title: "「一周一个大厂」复盘一下Taptap的面经，发现不足，逐一击破！"
date: 2021-12-17
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心 一周一个大厂 是我新出的一个系列文章，大概的流程是这样的： 我会收集一些大厂的面经，并试着去回答 如果"
tags: ["面试","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:92,comments:9,collects:83,views:7751,"
---
前言
--

大家好，我是林三心，**用最通俗易懂的话讲最难的知识点**是我的座右铭，**基础是进阶的前提**是我的初心

**一周一个大厂** 是我新出的一个系列文章，大概的流程是这样的：

![1639711909(1).png](/images/jueJin/2c7eaea2a13644f.png)

*   我会收集一些大厂的面经，并试着去回答
*   如果全都会则等待下一周重新一轮
*   如果有不会的，则记录下来，并去克服它们，写成文章，然后下一轮

这个系列的目的就是：**逼自己学习，写文章巩固新知识，且复习旧知识**

掘金专栏
----

这个系列会一直这么写下去的，有兴趣的同学可以关注我的[掘金专栏：一周一个大厂](https://juejin.cn/column/7041756419602776077 "https://juejin.cn/column/7041756419602776077")，此系列的所有文章都会收录在这个专栏里

Taptap
------

今天是 **一周一个大厂** 的第一期，今天咱们来复盘一下**Taptap**的面经，发现不足，并逐一击破他们吧！

一面
--

### 1、换肤都做过什么处理，有没有处理过可能改变尺寸的换肤

我分别在在`微信小程序`和`PC管理系统`中做过换肤

*   小程序：我们公司做的是一款游戏类的小程序，这款小程序中涉及到换肤的地方是阅读故事情节的弹出抽屉，需求是通过用户点击按钮，改变三种皮肤，并且同时改变阅读文本的颜色。我的解决方案是，利用Map存储三种皮肤信息，点击按钮后会匹配Map中对应的皮肤，进行抽屉背景图片的替换，并通过正则的方式，修改阅读文本HTML代码，替换style里的color属性，达到换肤效果
    
*   PC管理系统：我们公司的一款后台管理系统，做了`黑夜模式`和`白天模式`的切换功能，跟产品确定主题色之后，开始编程工作。由于我们的系统是使用`antd`组件库进行编写的，所以需要引入`antd`相应的主题文件，并封装相应的`切换主题hook`，同时也要储存主题标识到`localStorage`中，确保刷新后主题复原。接着就是封装一个`AppDarkModeToggle`的一个切换组件，切换后触发事件，改变`html`的`data-dark`属性，通过属性选择器，触发底下标签的样式切换，同时改变`Header，Sider，Footer`等布局组件的`背景颜色、字体颜色`等的切换
    

### 2、i18n在团队内部都做了哪些实践？

#### 项目实施

`i18n`的意思是`让产品无需做大的改变就能够适应不同语言和地区的需要`。在我的项目中也做过`i18n`，我们做的是`官网`和`管理系统`的`国际化语言切换`，切换的是`中文`和`英文`两种语言，我当时的步骤是

*   1、根据设计稿确定`中文`和`英文`的文本情况
*   2、整理成两个文件夹`en`和`zh`，分别存放对应语言的资料
*   3、确定一下资料的形式是对象的键值对形式
*   4、通过`vite`的`import.meta.globEager`方法，将两种资料整理成`i18n插件`所需的格式（不同插件所需格式不同）
*   5、在项目初始化时，初始化`i18n插件`
*   6、封装对应的切换语言组件——`AppLocalePicker`，用来切换主题，同时改变`html`标签的`lang`属性
*   7、同时做好`语言标识`的初始化，避免`刷新后状态丢失`

#### 插件选择

我会选择一些使用起来比较方便的插件，来实现`i18n`

*   Vue：Vue我选择的插件是`vue-i18n`
*   React：Reacr我选择的插件是`i18next`

### 3、Webpack 迁移 Vite 遇到了哪些问题

*   1、环境变量需要`Vite_`前缀
*   2、获取环境变量方式为`import.meta`
*   3、Vue中使用tsx时报错：`React is not defined`

```js
// vite.config.ts
    esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxInject: 'import { h } from "vue";',
    },
```

*   4、主题插件`vite-plugin-theme`
*   5、windicss的插件`vite-plugin-windicss`
*   6、尽量不用`commonjs`，使用`es module`

### 4、CI/CD做过哪些实践？

*   CI代表了`持续集成`，我理解的意思就是，咱们每天都会编写代码，并且提交到主干分支上，天天如此，是一个重复性很高的操作，`持续集成`我理解就是会以最快的速度帮你把代码提交到主分支上，这样的好处就是，当开发人员数量多的时候，这样快速的集成，有利于减少开发人员代码之间的冲突
*   CD代表了`持续部署`，我理解就是既然有`持续集成`代码的话，而代码的集成肯定是为了最后的发布部署，所以`持续部署`就是在自动集成代码后，自动部署到环境上，节约了很多人力

曾经在之前的公司里参与过CI/CD的工作流程，并使用过，但是没有去深入地实现过，当时公司是使用`Jenkins`

### 5、鉴权有了解过吗？jwt如何实现踢人，session 和 jwt 鉴权的区别？

#### session鉴权

`session鉴权`是需要服务端存储的

*   1、用户登录
*   2、服务端接收到登录请求，生成相应的用户标识，存在服务端
*   3、服务端将标识传给前端，这个标识存在`Cookie`中，并存在浏览器
*   4、前端接下来每次请求都会带着这个`Cookie`去请求
*   5、服务端接收到标识，拿标识去数据库里匹配，匹配到则接受，匹配不到则不接受
*   6、用户注销时，前后端都会销毁这个标识

#### jwt鉴权

`jwt鉴权`是不需要服务端存储的

*   1、用户登录
*   2、服务端接收到登录请求，根据用户信息，生成一个`token`给前端
*   3、前端接收到`token`，存在了`浏览器本地缓存`中（例如`LocalStorage`）
*   4、接下来每次请求，都需将`token`带在`请求头`里
*   5、服务端解析前端传来的`token`，有效则接受，无效则返回`401`
*   6、用户注销时，只需要前端销毁这个`token`

#### jwt 踢人

我理解的`jwt踢人`，就是后端控制某个人的`token`无效，我能想到四种方法

*   1、服务端生成`token`的同时，生成一段`标识1`，把`标识1 + token`发给前端，当我想踢掉某个人时，后端就生成一个新的`标识2`，并修改此用户对应的token为`标识2 + token`，那么下次此用户下次带着`标识1 + token`访问时，便会检验不通过。这种方法需要用到服务端存储，违背了`jwt鉴权`的初衷
*   2、设置两个token，一个`access_token`一个`refresh_token`，前者过期时间较短，为1小时，后者过期时间较长，为一个月。将`refresh_token`存在后端数据库（例如redis），`access_token`发给前端，前端拿着`access_token`请求时，都要判断redis中`refresh_token`过期了没，没过期的话就通过，或者`access_token`过期了，只要 `refresh_token` 还没过期，就刷新 `access_token` 返回给前端。那么想要踢某人下线，就好办了，直接把`refresh_token`从redis中清除就行。缺点跟第1点一样
*   3、黑名单模式。就是把需要踢的用户的`token`放在一个数组里，此用户访问时，遍历数组看有没有这个人，有的话就踢下线
*   4、另外一种踢人模式是，在我们公司的游戏业务中，踢人下线是使用了`Websocket`的技术，实时将人踢出房间，不涉及`token`

### 6、TCP 三次握手 http1.0 http1.1 http2都有哪些区别？

HTTP一直是我的不足之处，记录下来，记录下来

### 7、https，为什么可以防止中间人攻击？

推荐我写的一篇文章[我画了13张图，用最通俗易懂的话讲HTTPS，拿下！](https://juejin.cn/post/7042158171778973732 "https://juejin.cn/post/7042158171778973732")

### 8、冒泡排序

#### 平均时间复杂度

O(n^2)

#### 思路

数组中有 n 个数，比较每相邻两个数，如果前者大于后者，就把两个数交换位置；这样一来，第一轮就可以选出一个最大的数放在最后面；那么经过 n-1（数组的 length - 1） 轮，就完成了所有数的排序。

#### 实现

```js
//从大到小排序
var array=[10,20,9,8,79,65,100];
//比较轮数
    for ( var i=0;i<array.length-1;i++){
    //每轮比较次数，次数=长度-1-此时的轮数
        for (var j=0;j<array.length-1-i;j++) {
            if (array[j] > array[j + 1]) {
            var temp = array[i];
            array[j] = array[j + 1];
            array[j + 1] = temp;
            } //end if
            }//end for 次数
            } //end for 轮数
            console.log(array);
```

二面
--

### 1、给你一个已经升序排列的数组，给一个数字，找一下这个数字在这个数组里出现了几次

#### 思路

既然是升序排列过了，那说明这个数字如果多次出现。那肯定是紧挨着的，所以不需要遍历完整个数组，只要以遇到这个数字开始，离开这个数字为结束，这段时间统计完就可以跳出遍历了，不需要做后面的无用功（这是我仅能想到的优化点）

#### 实现

```js
const arr = [1, 2, 3, 4, 5, 5, 6, 6, 7]

    const computed = (arr: number[], num: number): number => {
    let flag = false
    let sum = 0
        for (let item of arr) {
            if (item === num) {
            sum++
            flag = true
            continue
        }
        if (item !== num && flag) break
    }
    
    return sum
}

console.log(computed(arr, 5))

```

### 2、洗牌算法，如何验证这个洗牌算法可以把牌洗得足够乱

#### 1、随机索引I

*   1、创建一个空数组
*   2、生成一个`0 —— length - 1`的随机索引，并将此随机索引对应元素放到新数组里
*   3、删除原数组中此索引对应元素，原数组length更新
*   4、重复2、3，直到原数组`length === 0`
*   5、返回新数组

```js
    const shuffle = (arr: number[]) => {
if (!arr.length) return []
let random: number
let res: number[] = []
    while (arr.length) {
    random = Math.floor(Math.random() * arr.length)
    res.push(arr[random])
    arr.splice(random, 1)
}
return res
}
```

#### 2、随机索引II

*   1、选取数组(长度n)中最后一个元素`(arr[length-1])`，将其与n个元素中的任意一个交换，此时最后一个元素已经确定
*   2、选取倒数第二个元素`(arr[length-2])`，将其与`n - 1`个元素中的任意一个交换
*   3、重复第 1 2 步，直到剩下1个元素为止

```js
    const shuffle = (arr: number[]) => {
if (!arr.length) return []
let index = arr.length - 1
let random: number
    while (index) {
    random = Math.floor(Math.random() * index--)
    // 或者
    // random = (Math.random() * index--) >>> 0
const temp = arr[index]
arr[index] = arr[random]
arr[random] = temp
// 这样也行，但是我的eslint不允许哈哈
// [arr[lastIndex], arr[random]] = [arr[random], arr[lastIndex]]
}

return arr
}
```

#### 3、sort方法

```js
    const shuffle = (arr: number[]) => {
    return arr.sort(() => 0.5 - Math.random())
}
```

### 3、node stream 去取一个超大数据量的日志，由于内存限制每次只能取一部分，现在希望在全部日志中随机取一万条，如何做？

这一道题不会。。记录下来，记录下来

### 4、介绍一下项目 有哪些是由你主导提出的方案做的事情

主导过两、三个项目：

*   项目A：小程序
*   项目B：官网
*   项目C：后台管理系统

不足记录
----

*   TCP 三次握手 http1.0 http1.1 http2都有哪些区别？
*   CI/CD的实践经验不足
*   node stream的使用

结语
--

我是林三心，一个热心的前端菜鸟程序员。如果你上进，喜欢前端，想学习前端，那咱们可以交朋友，一起摸鱼哈哈，摸鱼群，点这个 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

![image.png](/images/jueJin/5b035c3b5a28496.png)

题目摘取
----

此次面经题目摘取自[时隔一年半，我，一个卑微的前端菜鸡，又来写面经了](https://juejin.cn/post/7036581158670303240 "https://juejin.cn/post/7036581158670303240")