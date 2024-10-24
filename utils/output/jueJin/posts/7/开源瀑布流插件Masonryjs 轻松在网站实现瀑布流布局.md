---
author: "徐小夕"
title: "开源瀑布流插件Masonryjs 轻松在网站实现瀑布流布局"
date: 2024-08-19
description: "Masonryjs在 github 上非常火, 目前已有 163k star, 有很多网站都采用它的方案实现瀑布流布局 在文末我会附上这个开源项目的地址, 方便大家学"
tags: ["JavaScript","前端","GitHub中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:47,comments:0,collects:79,views:1738,"
---
嗨, 大家好, 我是徐小夕.

之前一直在社区分享**零代码**&**低代码**的技术实践，也陆陆续续设计并开发了多款可视化搭建产品，比如：

*   [**H5-Dooring（页面可视化搭建平台）**](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://github.com/MrXujiang/h5-Dooring")
*   [**V6.Dooring（可视化大屏搭建平台）**](https://juejin.cn/post/6981257575425654792 "https://juejin.cn/post/6981257575425654792")
*   [**橙子试卷（表单搭建引擎）**](https://juejin.cn/post/7337575515803893786 "https://juejin.cn/post/7337575515803893786")
*   [**Nocode/WEP 文档知识引擎**](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2FNocode-Wep "https://github.com/MrXujiang/Nocode-Wep")

最近在做**无代码**平台的**模版列表**的时候, 需要使用瀑布流布局, 类似下面这种:

![图片](/images/jueJin/cb0b2f0eeed747c.png)

为了研究市面上比较成熟的瀑布流方案, 我在**github**上找呀找, 突然, 发现了一款设计非常巧妙的方案——**Masonry**.

![图片](/images/jueJin/21f2b72a983a48d.png)

**Masonry** 在 **github** 上非常火, 目前已有 **16.3k** star, 有很多网站都采用它的方案实现瀑布流布局. 在**文末**我会附上这个开源项目的地址, 方便大家学习参考.

接下来我就带大家研究一下这个库, 并快速应用到自己的项目中.

什么是 Maronry
-----------

![图片](/images/jueJin/15170ff2f0a844b.png)

**Masonry** 是一个 **JavaScript** 网格布局库。它的工作原理是根据可用的垂直空间将元素放置在最佳位置，有点像泥瓦匠在墙上安装石头。我们在互联网上也许看到过很多瀑布流的案例.

接下来给大家演示一个使用案例:

![图片](/images/jueJin/e51a827ef527419.png)

另一个比较有意思的案例:

![图片](/images/jueJin/d22a91a46c65480.png)

当我们动态添加元素的时候, 它可以智能的安排好元素的位置.

再联想一下, 我们玩的消消乐小游戏和拼图类小游戏, 是不是也能用它一键实现呢?

![图片](/images/jueJin/6446a659e1a84f7.png)

如何使用 Maronry
------------

**Maronry** 支持 **CDN** 导入和 **npm** 安装使用, 这里我介绍一下 **npm** 的安装和使用方式.

```
npm install masonry-layout
```

我们安装好之后可以先编写一下 `html` 结构:

```css
<div class="grid">
<div class="grid-item">FlowMix</div>
<div class="grid-item grid-item--width2">H5</div>
<div class="grid-item">Dooring</div>
</div>
```

接下来我们就可以直接使用这个库来初始化瀑布流布局了:

```dart
var elem = document.querySelector('.grid');
    var msnry = new Masonry( elem, {
    // options
    itemSelector: '.grid-item',
    columnWidth: 200
    });
    
    // 元素参数是一个选择器字符串
        var msnry = new Masonry( '.grid', {
        // options
        });
```

使用起来就是这么简单, 当然文档上还有很多高级用法, 我们也可以学习参考一下:

`https://masonry.desandro.com/`

分享几个更高级的案例
----------

1.  **瀑布流布局动画**
    
    ![图片](/images/jueJin/f8b1faef837f4c6.png)
    

**2\. 瀑布流3D动画**

![图片](/images/jueJin/bba2aec893be43b.png)

最后

好啦, 今天的分享就到这, 欢迎随时和我留言反馈，建议，技术交流~

上述项目的GitHub地址:

 **[github.com/desandro/ma…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdesandro%2Fmasonry "https://github.com/desandro/masonry")**