---
author: "徐小夕"
title: "笛卡尔乘积的javascript版实现和应用"
date: 2019-08-31
description: "假设集合A={a, b}，集合B={0, 1, 2}，则两个集合的笛卡尔积为{(a, 0), (a, 1), (a, 2), (b, 0), (b, 1), (b, 2)}。 等等，只有你想不到的，没有它实现不了的。接下来就来看看他的具体实现吧！ 由于最近工作变动，并且准备自研…"
tags: ["JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:23,comments:3,collects:28,views:5599,"
---
> 笛卡尔乘积是指在数学中，两个集合X和Y的笛卡尓积，又称直积，表示为X × Y，第一个对象是X的成员而第二个对象是Y的所有可能有序对的其中一个成员 。

### 例子

假设集合A={a, b}，集合B={0, 1, 2}，则两个集合的笛卡尔积为{(a, 0), (a, 1), (a, 2), (b, 0), (b, 1), (b, 2)}。

![](/images/jueJin/16ce33a7d947e80.png)

一般的实现中，c语言，python，java实现的方式比较多，但是对于前端而言，也是有其实现意义的，

*   比如淘宝的sku商品订单组合的实现就需要笛卡尔乘积，根据商品的子类型和不同尺寸生成n种可能的组合
*   某些情况下用于寻找连续日期中残缺的数据，可以先笛卡尔积做一个排列组合，然后和目标表进行关联，查找哪些数据缺少了
*   MySQL的多表查询
*   生成棋牌坐标

等等，只有你想不到的，没有它实现不了的。接下来就来看看他的具体实现吧！

### 笛卡尔积的javascript实现

```
/*
* @Author: Mr Jiang.Xu
* @Date: 2019-08-31 00:05:33
* @Last Modified by:   Mr Jiang.Xu
* @Last Modified time: 2019-08-31 00:05:33
*/
    function cartesian(arr) {
    if (arr.length < 2) return arr[0] || [];
        return [].reduce.call(arr, function (col, set) {
        let res = [];
            col.forEach(c => {
                set.forEach(s => {
                let t = [].concat(Array.isArray(c) ? c : [c]);
                t.push(s);
                res.push(t);
                })
                });
                return res;
                });
            }
```

由于实现方法很多，这里就不一一举例了，上述实现方式的时间复杂度为O(n^3),还不是最优，所以有更好的实现方法欢迎留言实现哦～

如果想学习更多js算法和数据结构，可以长按关注哦～ 由于最近工作变动，并且准备自研一套CMS开源系统，所以可能文章尽量每周更新一次，欢迎大家共同学习进步。

![](/images/jueJin/16ba43b87c51361.png)

### 更多推荐

*   [JavaScript 中的二叉树以及二叉搜索树的实现及应用](https://juejin.cn/post/6844903906166718471 "https://juejin.cn/post/6844903906166718471")
*   [用 JavaScript 和 C3 实现一个转盘小游戏](https://juejin.cn/post/6844903895668375566 "https://juejin.cn/post/6844903895668375566")
*   [教你用200行代码写一个爱豆拼拼乐H5小游戏（附源码）](https://juejin.cn/post/6844903893961293831 "https://juejin.cn/post/6844903893961293831")
*   [基于react/vue生态的前端集成解决方案探索与总结](https://juejin.cn/post/6844903891893485576 "https://juejin.cn/post/6844903891893485576")
*   [9012教你如何使用gulp4开发项目脚手架](https://juejin.cn/post/6844903882124967949 "https://juejin.cn/post/6844903882124967949")
*   [如何用不到200行代码写一款属于自己的js类库)](https://juejin.cn/post/6844903880707293198 "https://juejin.cn/post/6844903880707293198")
*   [让你瞬间提高工作效率的常用js函数汇总(持续更新)](https://juejin.cn/post/6844903878362660878 "https://juejin.cn/post/6844903878362660878")
*   [一张图教你快速玩转vue-cli3](https://juejin.cn/post/6844903877133729799 "https://juejin.cn/post/6844903877133729799")
*   [3分钟教你用原生js实现具有进度监听的文件上传预览组件](https://juejin.cn/post/6844903875632168968 "https://juejin.cn/post/6844903875632168968")
*   [3分钟教你用原生js实现具有进度监听的文件上传预览组件](https://juejin.cn/post/6844903875632168968 "https://juejin.cn/post/6844903875632168968")
*   [使用Angular8和百度地图api开发《旅游清单》](https://juejin.cn/post/6844903873212055560 "https://juejin.cn/post/6844903873212055560")
*   [js基本搜索算法实现与170万条数据下的性能测试](https://juejin.cn/post/6844903866610221064 "https://juejin.cn/post/6844903866610221064")
*   [《前端算法系列》如何让前端代码速度提高60倍](https://juejin.cn/post/6844903865553256461 "https://juejin.cn/post/6844903865553256461")
*   [《前端算法系列》数组去重](https://juejin.cn/post/6844903863674208269 "https://juejin.cn/post/6844903863674208269")
*   [vue高级进阶系列——用typescript玩转vue和vuex](https://juejin.cn/post/6844903831956897806 "https://juejin.cn/post/6844903831956897806")
*   [前端三年，谈谈最值得读的5本书籍](https://juejin.cn/post/6844903824788815879 "https://juejin.cn/post/6844903824788815879")