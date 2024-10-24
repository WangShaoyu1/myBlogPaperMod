---
author: "徐小夕"
title: "用 JavaScript 和 C3 实现一个转盘小游戏"
date: 2019-07-23
description: "本文主要介绍如何使用原生javascript和Css3来实现一个在各大移动应用中经常出现的转盘游戏，由于改实现可以有不同方式，如果熟悉canvas的话也可以用canvas实现，本文采用js和css实现主要考虑到复杂度较小性能较好，所以如果有更好的方案，也可以随时和我交流。 由于…"
tags: ["JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:39,comments:0,collects:62,views:5678,"
---
本文主要介绍如何使用原生javascript和Css3来实现一个在各大移动应用中经常出现的转盘游戏，由于改实现可以有不同方式，如果熟悉canvas的话也可以用canvas实现，本文采用js和css实现主要考虑到复杂度较小性能较好，所以如果有更好的方案，也可以随时和我交流。

### 前言

本文技术路线采用和上篇文章[教你用200行代码写一个爱豆拼拼乐H5小游戏（附源码）](https://juejin.cn/post/6844903893961293831 "https://juejin.cn/post/6844903893961293831")同样的技术,即均使用本人自己写的dom库去简化dom操作,具体需要掌握的知识点有：

*   css3 背景渐变，transform，transition
*   less循环的使用
*   javascript基本随机算法
*   文档片段 documentFragment的使用

由于文章没有太高深的技术，关键是思路，所以接下来开始我们的实现介绍。

### 效果图

![](/images/jueJin/16c1f18833df5de.png)

### 实现思路

实现思路分两部分，第一部分是用css绘制转盘背景，第二部分是通过js实现转盘的转动以及转动随机性的实现。

#### 1\. 绘制转盘背景

我们采用背景渐变的方式去实现条纹交替的扇形，原理就是通过绘制一个半圆，并在半圆里加渐变来实现，如下图：

![](/images/jueJin/16c1f25e7abcd18.png)

实现将方形变成半圆的css我们通过border-radius来实现：

```
width: 150px;
height: 300px;
border-radius: 0 150px 150px 0;
```

我们再通过css的线性渐变，这样本基本上可以实现一个小的扇形区域：

![](/images/jueJin/16c1f2747e1af41.png)

渐变的代码如下：

```
background-image: linear-gradient(120deg, #f6d365, #f6d365 75px, transparent 75px);
```

实现了一个扇形，我们自然可以通过计算，比如我们扇形弧度为30deg，那么我们需要12个扇形即可组成一个圆，为了方便，我们使用less的循环来实现：

```
    .loop(@n) when (@n >= 0) {
    .loop(@n - 1);
        .piece-@{n} {
        transform: rotate(-30deg * (@n + 1));
    }
}
```

还有一个细节是，我们需要改变变换的中心点，让每个扇形都以一个中心点渲染，这样才可以组成一个完整的圆：

```
transform-origin: left center;
```

完整的css大致如下：

```
    .piece-wrap {
    position: relative;
    width: 300px;
    height: 300px;
    margin: 100px auto  auto 173px;
    transform-origin: left center;
    transition: transform 16s cubic-bezier(0,.47,.31,1.03);
        .piece {
        position: absolute;
        left: 0;
        top: 0;
        width: 150px;
        height: 300px;
        border-radius: 0 150px 150px 0;
        transform-origin: left center;
            span {
            margin-left: 16px;
            margin-top: 20px;
            display: inline-block;
            color: #fff;
        }
            &:nth-child(2n) {
            background-image: linear-gradient(120deg, #f6d365, #f6d365 75px, transparent 75px);
        }
            &:nth-child(2n+1) {
            background-image: linear-gradient(120deg, #ff5858, #ff5858 75px, transparent 75px);
        }
    }
    
        .loop(@n) when (@n >= 0) {
        .loop(@n - 1);
            .piece-@{n} {
            transform: rotate(-30deg * (@n + 1));
        }
    }
    
    .loop(11);
}
```

#### 2.javascript实现转盘逻辑

由于转盘的转动是随机的，所以我们需要每次点击开始按钮都要随机生成一个角度，但是仔细分析一些平台会发现转盘每次都至少转动n圈后才会满满开始停下，所以我们会给转盘一个初始的角度，比如720deg，1080deg，这样能保证转盘至少转动n圈才停下来。

另一个注意点是我们要如何通过转动角度知道转盘停下来后的位置？这里处于性能问题，我们尽量不操作dom，通过数据控制，我们可以通过每次随机后得到的角度和单位扇形区域的弧度来计算停下来的位置，公式如下：

totalRadis = initRadis + radis \* n + radis/2

totalRadis为转动的角度，initRadis为初始化角度，radis为扇形的角度，radis/2是中奖的范围，这里主要用来定位用的，n是随机数，接下来我将解释n的作用。

那么怎么实现随机角度呢？我们一般会想通过写个随机函数去做，不过这里有一种新的思路，就是通过随机生成中奖的位置来实现随机角度，由于我的扇形为30度，一共有12个扇形奖品区，所以索引为0-11。因此，上面讲到的n，就是我们的随机索引，我们只需要写个生成指定范围的随机数就可以了。

了解了以上知识，我们开始准备初始化数据：

```
// 转盘抽奖数据
var wards = ['1元', '2元', '3元', '5元', '再来',
'算法', '0.5元', '0.1元', '0.2元', '0.6元',
'0.5元', '来'];
```

渲染奖品数据,这里我们用了DocumentFragment，虽然对简单渲染没有必要，但是后期可能会很有用：

```
// 渲染dom
var fragment = document.createDocumentFragment();
    for(var i=0, len = wards.length; i < len; i++) {
    var piece = document.createElement('div');
    piece.className = 'piece piece-' + i;
    piece.innerHTML = '<span>' + wards[i] + '</span>';
    fragment.appendChild(piece);
}

$('#piece_wrap')[0].appendChild(fragment);
```

生成指定范围的随机数的方法：

```
// 生成从 start到end的随机数
    function randomArr(start, end) {
    return Math.round(start + Math.random()* (end - start))
}
```

当我们点击开始按钮时，我将通过改变转盘的transform来让其运动起来：

```
// 转动逻辑
var radis = 30,  // 每个扇形区域的度数
n = randomArr(0, 360/radis),  // 计算随机中奖的位置
initRadis = 720,   // 初始转动的角度
time = 16 * 1000,    // 转动时间
once = true,    // 限制一个转动周期只能点击一次
totalRadis = initRadis + radis * n + radis/2;  // 转动角度计算公式
    $('.start').on('click', function(){
        if(once) {
        once = false;
            $('#piece_wrap').css({
            'transform':'rotate(' + totalRadis + 'deg)',
            'transition': 'transform 16s cubic-bezier(0,.47,.31,1.03)'
            });
                setTimeout(function(){
                once = true;
                alert('恭喜你抽中了' + wards[n] + '!');
                    $('#piece_wrap').css({
                    'transform':'rotate(' + 0 + 'deg)',
                    'transition': 'none'
                    });
                    }, time)
                }
                
                })
```

核心代码就这些，怎么样，是不是很简单呢？如果想体验实际案例效果和技术交流，或者感受更多原创h5游戏demo，可以关注下方公众号体验哦

![](/images/jueJin/16ba43b87c51361.png)

### 更多推荐

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