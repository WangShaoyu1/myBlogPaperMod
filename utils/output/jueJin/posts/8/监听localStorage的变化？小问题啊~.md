---
author: "Sunshine_Lin"
title: "监听localStorage的变化？小问题啊~"
date: 2022-05-16
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心 背景 前几天有位兄弟问我，如何去监听localStorage的变化呢？？我确实是没遇到过这种场景，但是"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:59,comments:0,collects:68,views:6983,"
---
前言
--

大家好，我是林三心，**用最通俗易懂的话讲最难的知识点**是我的座右铭，**基础是进阶的前提**是我的初心

背景
--

前几天有位兄弟问我，如何去监听**localStorage**的变化呢？？我确实是没遇到过这种场景，但是我仔细想想，似乎想要达到这样的效果，其实也不难。

解题思路
----

### 第一种：storageEvent

其实JavaScript原生就有一个监听localStorage变化的事件——**storage**，使用方法如下

```js
    window.addEventListener('storage', () => {
    // callback
    })
```

我们来看看MDN上是怎么描述这个事件的：

![](/images/jueJin/a1fe9e09684b4aa.png)

也就是说，同域下的不同页面A、B，只有本页面修改了localStorage才会触发对方的storage事件

但是显然这种方案很不适用在现在的大部分项目中，毕竟这种方案太局限了，不能应用在本页面监听的场景

### 第二种：封装localStroage

其实就是代理一下对localStorage进行多一层的封装，使得我们每次在操作localStorage的时候，都会多走一层函数，而我们就可以在这一层中去执行监听的事件了，下面是简单的代码例子：

```js
    class CommonLocalStorage {
    private storage: Storage;
        constructor() {
        this.storage = window.localStorage;
    }
        set(key: string, value: any) {
        // 执行监听的操作
        return this.storage.setItem(`${prefix}${key}`, value);
    }
        get(key: string) {
        // 执行监听的操作
        return this.storage.getItem(`${prefix}${key}`);
    }
        del(key: string) {
        // 执行监听的操作
        return this.storage.removeItem(`${prefix}${key}`);
    }
        clear() {
        // 执行监听的操作
        this.storage.clear();
    }
}

const commonStorage =
new CommonLocalStorage();

export default commonStorage
```

这种方式也被应用于很多比较出名的项目中，大家可以去看那些开源的项目中，基本很少直接使用localStorage，而是都是会封装一层的

结语
--

我是林三心，一个热心的前端菜鸟程序员。如果你上进，喜欢前端，想学习前端，那咱们可以交朋友，一起摸鱼哈哈，摸鱼群，点这个，有5000多名前端小伙伴在等着一起学习哦 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

![image.png](/images/jueJin/5fdd45a7d7e3477.png)