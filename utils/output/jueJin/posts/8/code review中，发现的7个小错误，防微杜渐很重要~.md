---
author: "Sunshine_Lin"
title: "code review中，发现的7个小错误，防微杜渐很重要~"
date: 2022-05-19
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心 code review 所谓code review，意思很明确，就是代码回顾，这个环节能帮你发现一些你"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:50,comments:0,collects:30,views:6398,"
---
前言
--

大家好，我是林三心，**用最通俗易懂的话讲最难的知识点**是我的座右铭，**基础是进阶的前提**是我的初心

code review
-----------

所谓`code review`，意思很明确，就是`代码回顾`，这个环节能帮你发现一些你代码中的不好的习惯，或者一些错误的行为。这个工作一般是团队的老大来做的，但是

**我们的团队人均大佬**

所以我们都是一起`code review`的，人多力量大，参加的人越多，越能让你发现自己的错误，从而能及时改正，收益颇丰！！！

![](/images/jueJin/daec293580574c7.png)

> 注：下方代码都是虚构，主要为了讲解代码错误习惯，请勿较劲~

分析一下我的错误代码行为
------------

### 1、写没必要的函数

**场景**：我需要给某个html根标签设置一个属性，而这个行为是需要在项目初始化的时候去做的，我当时的做法是：

```js
// utils
    export const setXXXyyy = () => {
    const tag = document.tag;
    const xxx = tag.getAttribute('xxx');
        if (xxx || xxx === null) {
        tag.setAttribute('xxx', 'yyy');
    }
    };
    
    // app.tsx
    import { setXXXyyy } from 'utils'
    // 初始化时
    setXXXyyy()
```

**缺陷**：可能我有考虑到以后会在此函数里去做更多事，但是现阶段这么写确实有点多余

**改正**：直接在模板html里把此属性加到标签上即可

```js
// public/index.html

<tag xxx="yyy"></tag>
```

### 2、Promise传递不明值

**场景**：我需要请求一个接口，请求返回一组数据，我需要把这组数据中的某个参数通过Promise带出去

```js
// 请求方法
    const request = () => {
        return new Promise(async (resolve) => {
        const res = await axios(...)
        resolve(res)
        })
    }
    
    // 使用
    const res = await request()
    console.log(res.data.answer)
```

**缺陷**：直接把res传递出去了，如果没有ts的限制，那么下一个使用`request`的开发人员根本不知道这个res里有什么，也自然就不知道有`answer`这个目标数据了

**改正**：直接把目标数据`answer`传递出去

```js
    const request = () => {
        return new Promise(async (resolve) => {
        const res = await axios(...)
        // 改正
        resolve(res.data.answer)
        })
    }
    
    const answer = await request()
    console.log(answer)
```

3、使用没必要try catch
----------------

**场景**：试异步操作1，如果失败的话试异步操作2，如果失败进行操作3

```js
    action1().catch(() => {
        try {
        await action2()
            }  catch(e) {
            throw e
        }
            }).catch(() => {
            action3()
            })
```

**错误**：没必要使用`try catch`，await失败之后，会自动返回一个失败的`Promise`，通过链式调用，会执行下一个`catch`

**改正**：去除`try catch`

```js
    action1().catch(() => {
    await action2()
        }).catch(() => {
        action3()
        })
```

4、Promise.all并发限制
-----------------

**场景**：我需要用`Promise.all`去进行并行执行一些异步操作，这个操作是在服务端的。。

```js
// promises可能会有几十个，几百个，上千个
await Promise.all(promises)
```

**缺陷**：众所周知，服务端有时候是很脆弱的，可能你几十个并发就会把服务端给折腾的不要不要的了，所以控制并发是很重要的

**改正**：既然承受不住，那就控制并发呗，网上很多控制并发的方案。这里我就不说哪个方案比较好了。。自己实现也行，用库也行，看你们团队需要哪个吧。。

```js
// 控制并发
await promiseAllLimit(promises)
```

### 5、Nodejs中使用过多sync函数

**场景**：在后端那边进行文件操作，由于比较喜欢用同步方法，所以用了

```js
const readData = fs.readFileSync(filepath);
fs.writeFileSync(targetPath, readData);
const workbook = xlsx.readFile(targetPath);
fs.unlinkSync(targetPath);
```

**缺陷**：Nodejs引以为傲的就是他的大部分方法都支持**异步**，所以它才能在高并发的场景中那么牛，所以尽量少用它的同步方法，性能会好一些

**改正**：使用它对应的异步方法吧，，不过要嵌套了。。很烦啊

### 6、判空要放前面

**场景**：有两个参数，我要对他们进行一系列判断：

*   1、判断数据表里有没有这两个参数
*   2、判断这两个参数是否重叠
*   3、判断这两个参数是否为空

```js
    if (usename) {
    ...
}
    if (password) {
    ...
}

    if (!username || !password) {
    ...
}
```

**缺陷**：这个顺序是不对的，如果两个参数为空，则没必要进行另外两步

**改正**：改变顺序：

*   1、这两个参数是否为空
*   2、判断数据表里有没有这两个参数
*   3、判断这两个参数是否重叠

```js
    if (!username || !password) {
    ...
}

    if (usename) {
    ...
}
    if (password) {
    ...
}
```

### 7、数据库查表习惯问题

这个只能慢慢学了，任重而道远啊，等我学成归来，再给你们分享经验~~

![](/images/jueJin/e901b9fcc895476.png)

结语
--

我是林三心，一个热心的前端菜鸟程序员。如果你上进，喜欢前端，想学习前端，那咱们可以交朋友，一起摸鱼哈哈，摸鱼群，点这个，有5000多名前端小伙伴在等着一起学习哦 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

![image.png](/images/jueJin/d9dcdd20b9e040e.png)