---
author: "Sunshine_Lin"
title: "「百毒不侵(七)」面试官最喜欢问的6种清除浮动和BFC"
date: 2021-07-07
description: "前言 大家好，我是林三心，清除浮动算是面试中CSS问的最多的一题了，当面试官问你请你说说如何清除浮动时，他肯定不是想让你单纯地答出浮动的清除方法，而是想让你顺带答出BFC，就算他不想让你答出，你也要自"
tags: ["前端","面试中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:278,comments:45,collects:354,views:17023,"
---
前言
--

大家好，我是林三心，`清除浮动`算是面试中CSS问的最多的一题了，当面试官问你`请你说说如何清除浮动`时，他肯定不是想让你单纯地答出浮动的清除方法，而是想让你顺带答出`BFC`，就算他不想让你答出，你也要自己主动答出`BFC`，这样才能在众多面试者中脱颖而出嘛！嘿嘿！

![image.png](/images/jueJin/aa778309fb6f436.png)

浮动
--

### 1.场景

当我们想实现以下面效果时，咱们第一时间肯定会想到浮动`float`

*   flex：不应该是第一时间想起我吗？
*   我：不，我不想
*   flex：呵，男人

![image.png](/images/jueJin/118f128d230b4f6.png)

不多BB，直接上代码

```js
<div class="box">
<div class="left"></div>
<div class="right"></div>
</div>

    .box {
    border: 1px solid black;
    padding: 5px;
    width: 450px;
}
    .left {
    width: 100px;
    height: 100px;
    background-color: red;
    float: left;
}
    .right {
    width: 100px;
    height: 100px;
    background-color: red;
    float: right;
}
```

但是却得到这样的效果：

![image.png](/images/jueJin/26fef255eff44b4.png)

WTF!!!怎么是这样呢？？？跟我想的不一样啊！！！这是为啥呢？？？

![image.png](/images/jueJin/74553a59890a47a.png)

### 2.寻找原因

原因是，浮动的元素会`脱离文档流`，什么叫`脱离文档流`呢，举个例子，有一天你跟你老板说：“老子不想干了，世界那么大，我想去看看”，那从此以后，你老板就管不了你了。`脱离文档流`同理，一个元素一旦浮动，就会脱离文档流，那么他的父元素也管不了他了，布局也会往前推进，所以才出现了上面`父元素高度坍塌`的现象。

![image.png](/images/jueJin/ed42bd04a5194f1.png)

清除浮动
----

想要解决上面的问题，那就要采取一切手段了，也就是面试官通常会问的，`说一说你平时如何清除浮动的`，这时候肯定是答得越多种越好，嘿嘿！！

![image.png](/images/jueJin/10cf683b76c3467.png)

### 1.将父级也设置成浮动

```js
    .box {
    border: 1px solid black;
    padding: 5px;
    width: 450px;
    float: left
}
```

![image.png](/images/jueJin/72820f48ba5a458.png)

缺点：这种方法肯定是弊大于利，想想都知道，父级设置成浮动了，那爷爷级肯定又会受影响，又得解决爷爷级的高度坍塌，这不是无限套娃吗？？

### 2.给父级增加定位absolute

```js
    .box {
    border: 1px solid black;
    padding: 5px;
    width: 450px;
    height: 100px
}
```

![image.png](/images/jueJin/72820f48ba5a458.png)

缺点：`position:absolute`也会`脱离文档流`啊，影响了整体布局，这不是给自己找罪受吗？

### 3.给父级设置`overflow:hidden`

```js
    .box {
    border: 1px solid black;
    padding: 5px;
    width: 450px;
    overflow:hidden
}
```

![image.png](/images/jueJin/72820f48ba5a458.png)

缺点：当文本过长，且包含过长英文时，会出现英文文本被隐藏的情况

```js
<div class="box">
<div class="left"></div>
<div class="right"></div>
<div>林三心林三心林三心林三心林三心林三心林三心林三心林三心林三心林三心林林三心林林三心林林三心林林三心林林三心林林三心林林三心林林三心林林三心林林三心林林sunshine_Linsunshine_Linsunshine_Linsunshine_Linsunshine_Linsunshine_Linsunshine_Linsunshine_Linsunshine_Linsunshine_Linsunshine_Lin心林林三心</div>
</div>
```

![image.png](/images/jueJin/b244702dc8c0497.png)

### 4.给父级设置对应的高度

```js
    .box {
    border: 1px solid black;
    padding: 5px;
    width: 450px;
    height: 100px
}
```

![image.png](/images/jueJin/5c6167b814b64c5.png)

缺点：如果浮动元素是`定宽`的，那还好，如果是`不定宽`的，那这种方式就很不灵活了，有可能今天是100px，明天是200px，后天是300px，那你不是得累死？

![image.png](/images/jueJin/279212d550d44c7.png)

### 5.末尾增加空元素进行clear

关于`clear`：

![image.png](/images/jueJin/aa44b80414c8463.png) 所以这里`bottomDiv`设置成`clear:both`，代表了它左右都不能有浮动元素，这迫使了他往下移动，进而撑开了父级盒子的高度。

```js
<div class="box">
<div class="left"></div>
<div class="right"></div>
<div class="bottomDiv"></div>
</div>

    .bottomDiv {
    clear: both;
}
```

![image.png](/images/jueJin/5c6167b814b64c5.png)

缺点：很明显，增加了一个`div`标签，增加了页面的`渲染负担`（虽然我觉得应该影响不大吧）

![image.png](/images/jueJin/8f34769277b0475.png)

### 6.给父级添加伪元素进行clear

这种方法就是用`伪元素`代替了上面的`div`标签，大家都知道，伪元素是不会被渲染出来的，所以也很好的弥补了上一种方法的缺点。

```js
    .box::after {
    content: '.';
    height: 0;
    display: block;
    clear: both;
}
```

![image.png](/images/jueJin/5c6167b814b64c5.png)

缺点：哎呀，别吹毛求疵啦！！！这个应该是目前最优解了吧。我是找不出缺点，欢迎大佬们提供缺点。

![image.png](/images/jueJin/16cf5aa21fb04f9.png)

聊聊BFC
-----

### 1.官方解释

块格式化上下文（Block Formatting Context，BFC） 是Web页面的可视CSS渲染的一部分，是块盒子的布局过程发生的区域，也是浮动元素与其他元素交互的区域。浏览器对`BFC`的限制规则是：

*   1.生成BFC元素的子元素会一个接一个的放置。
*   2.垂直方向上他们的起点是一个包含块的顶部，两个相邻子元素之间的垂直距离取决于元素的margin特性。在BFC-- 中相邻的块级元素的外边距会折叠(Mastering margin collapsing)。
*   3.生成BFC元素的子元素中，每一个子元素左外边距与包含块的左边界相接触（对于从右到左的格式化，右外边距接触右边界），即使浮动元素也是如此（尽管子元素的内容区域会由于浮动而压缩），除非这个子元素也创建了一个新的BFC（如它自身也是一个浮动元素）。 这是[MDN](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FGuide%2FCSS%2FBlock_formatting_context "https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context")上的官方解释。(⊙o⊙)…，确实挺官方的。

### 2.触发条件

*   根元素，即`HTML`标签
*   浮动元素：`float`值为`left、right`
*   `overflow`值不为 visible，为 `auto、scroll、hidden`
*   `display`值为 `inline-block、table-cell、table-caption、table、inline-table、flex、inline-flex、- - grid、inline-grid`
*   定位元素：`position`值为 `absolute、fixed`

### 3.个人理解

*   1.内部的Box会在垂直方向上一个接一个的放置
*   2.内部的Box垂直方向上的距离由margin决定。（完整的说法是：属于同一个BFC的两个相邻Box的margin会发生折叠，不同BFC不会发生折叠。）
*   3.每个元素的左外边距与包含块的左边界相接触（从左向右），即使浮动元素也是如此。（这说明BFC中子元素不会超出他的包含块，而position为absolute的元素可以超出他的包含块边界）
*   4.BFC的区域不会与float的元素区域重叠
*   5.计算BFC的高度时，浮动子元素也参与计算 第`1`点和第`3`点就不用说了，大家都懂，下面就来着重说说第`2，4，5`点吧！

### 4.解决margin重叠问题

假如我想要两个盒子之间距离20px，我这么写：

```js
<div class="box2"></div>
<div class="box3"></div>

    .box2 {
    margin-bottom: 10px;
    width: 100px;
    height: 100px;
    background-color: red;
}

    .box3 {
    margin-top: 10px;
    width: 100px;
    height: 100px;
    background-color: red;
}
```

结果发现，并没有达到预期，两个盒子的margin重叠了：

![image.png](/images/jueJin/cf479343522e421.png)

怎么解决呢？根据`个人理解`里的`第2点`可知：两个不同`BFC环境`的盒子，他们两的`margin`才不会重叠，那么我们只需触发`box3`的BFC就行

```js
    .box3 {
    margin-bottom: 10px;
    width: 100px;
    height: 100px;
    background-color: red;
    float: left;
}
```

这就实现了两个盒子中键间隔20px了

![截屏2021-07-07 下午9.26.43.png](/images/jueJin/1bd2a0c79d1847c.png)

### 5.浮动元素与BFC盒子不重叠

还是看例子：

```js
<div class="box2 w"></div>
<div class="box3 w"></div>

    .w {
    width: 100px;
    height: 100px;
}

    .box2 {
    float: left; // 触发BFC
    background: red;
}

    .box3 {
    background: green;
}
```

结果是，因为红色盒子浮动脱离文档流，导致绿色盒子向前推进，导致红色盒子盖住了绿色盒子

![截屏2021-07-07 下午9.36.16.png](/images/jueJin/4ab5ba421b694b5.png)

怎么解决呢？根据`个人理解`里的`第4点`可知：`float盒子`与`BFC盒子`不重叠，所以我们只需要把绿色盒子设置为`BFC盒子`就行

```js
    .box3 {
    background: green;
    overflow:hidden // 触发BFC
}
```

效果：

![截屏2021-07-07 下午9.38.41.png](/images/jueJin/dbd928a74fe7410.png)

### 6.利用BFC清除浮动

根据`个人理解`里的`第5点`可知：`BFC盒子`会把内部的`float盒子`算进高度中，这也是为什么前面可以通过给父级盒子设置`float: left` `position: absolute` `overflow: hidden`来解决浮动的高度塌陷问题，因为这些做法都使父级盒子变成一个`BFC盒子`，而`BFC盒子`会把内部的`float盒子`算进高度，顺势解决了高度塌陷问题

结语
--

我的专栏已更新：

*   [Vue源码解析](https://juejin.cn/column/6969563635194527758 "https://juejin.cn/column/6969563635194527758")
*   [leetcode题目解析](https://juejin.cn/column/6979408694786129928 "https://juejin.cn/column/6979408694786129928")
*   [Element源码解析](https://juejin.cn/column/6979408526711980069 "https://juejin.cn/column/6979408526711980069")
*   [面试——百毒不侵](https://juejin.cn/column/6979410414513700878 "https://juejin.cn/column/6979410414513700878")

> 如果你觉得此文对你有一丁点帮助，点个赞，鼓励一下林三心哈哈。或者加入我的群哈哈，咱们一起摸鱼一起学习 : meron857287645