---
author: "jiangpan"
title: "Compose实现微信朋友圈大图查看"
date: 2024-01-14
description: "要实现这么一个需求，首先我们得知道compose的动画是怎么样玩的，因为从点击朋友圈到大图界面其实是由平移，缩放，背景渐变这三个动画同时作用完成的。然后还得知道compose的事件是怎么处理的，大图界"
tags: ["Android"]
ShowReadingTime: "阅读3分钟"
weight: 869
---
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1fff6679fad648689ab7021186e41f4e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=415&h=877&s=7128833&e=gif&f=322&b=f5d374)

要实现这么一个需求，首先我们得知道compose的动画是怎么样玩的，因为从点击朋友圈到大图界面其实是由平移，缩放，背景渐变这三个动画同时作用完成的。然后还得知道compose的事件是怎么处理的，大图界面有pager的水平滚动，还有双击，单击，双指操作单指操作，和上下拖拽隐藏界面。

进入和退出大图界面动画实现
-------------

首先得知道朋友圈的小滑稽图片在parent的相对坐标点，因为要使用平移动画，首先得知道平移的起始点吧？

使用onGloballyPositioned 函数就行了![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f665f00e7bc489e98935626a33a5314~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1061&h=290&s=35316&e=png&b=1f2023)

获取到的坐标先保存到rect变量里面，然后显示的时候把整个图片list 和 位置以及rect 传进去并执行动画。

imageViewerState 是自己定义的一个状态类，用于保存大图查看界面的一些状态，使用state注解标记可以减少一些不必要的重组。![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4023a695d4814f5db0dfb6299b042026~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1024&h=626&s=88528&e=png&b=1f2023)

其中curPosition 表示当前是第几张图片，srcRec 表示原图片的坐标rect 信息，show用来控制大图界面的显示。剩下其他的就是一些动画相关的参数。

点击图片会调用show方法，show方法主要就是执行动画。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc13444b11a244318c1b7dab7d649719~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1154&h=323&s=38899&e=png&b=1f2023)

大图界面根据动画的百分比percent来做出一系列UI的改变。比如背景渐变和平移的变化，如下

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bfeb95fdcd64c0a93a0a4f259039241~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1340&h=729&s=87934&e=png&b=1f2023)

从大图界面返回的时候要注意透明度的变化不是从1->0 ，而是从拖拽之后的透明度->0。

缩放大小改变使用size方法来处理。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a39e7e3759734433b9bf4bf8726fb236~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=665&h=265&s=20251&e=png&b=1f2023)

进入的时候从src 的大小->整个界面的大小，退出则反着来。

我们再来看下大图查看界面的事件是怎么处理的，大图查看界面的事件还是比较复杂的。

大图查看界面事件处理
----------

微信的大图查看，双指只能放大缩小图片，单指向下能拖拽图片并且到达一定距离便可退出大图界面。

图片没有缩放的情况左右滑动才可以切换图片，单击退出大图界面，双击放大图片，放大状态双击返回图片原来的大小。

别慌，我们一 一来实现。

首先实现比较简单的点击或者双击，用compose 提供的detectTapGestures 就行了

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d67fa9402e9a44758418c2ab2bd4e50b~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1044&h=448&s=38583&e=png&b=1f2023)

这个函数，原理是怎么样的？

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8b1b90135f34e97a7c1ad5946481402~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1133&h=546&s=89084&e=png&b=1f2023)

可以看到超过400毫秒就判定为长按了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b89897292dec45b6aa3ddaea8eb53fd8~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=934&h=666&s=73694&e=png&b=1f2023)

长按事件其实是通过协程的取消机制来做的，超过400ms 后超时会自动触发协程的cancel，然后会进入异常catch块触发长按事件。如果没超过，在400ms内再来了一次事件就会触发双击事件，如果400ms内只来了一次事件就会触发单击事件。

源码分析到这里，好了开始干正事，我们来实现双指操作。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92733b8e1e23449ebb0c595a801e72b1~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1125&h=723&s=70073&e=png&b=1f2023)

可以通过changes 来判断当前有几根手指头按下，如果为2就是双指了，然后通过compose 提供的calculateZoom 方法就可以知道双指操作放大或缩小的值了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d4c9bd1869e451a8c3c2754484e1ac8~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=967&h=333&s=50257&e=png&b=1f2023)

再来看下怎么处理拖拽并退出大图界面

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f7d12ad43d54e0f98a8500d6a608138~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1374&h=707&s=103347&e=png&b=1f2023)

当在y上移动的增量大于x移动的增量的2倍，并且大于touchSlop ，表示我们就要消费事件执行下拉拖拽隐藏界面了。up时，当在y轴拖动正向距离超过100dp隐藏界面，否则回到原来的位置。