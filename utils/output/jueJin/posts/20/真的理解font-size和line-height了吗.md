---
author: ""
title: "真的理解font-size和line-height了吗？"
date: 2021-06-09
description: "line-height和font-size都是大家在日常开发过程中经常用到的css属性，例如line-height设置父容器的高度来实习文本垂直居中，那它背后的原理又是怎样呢？"
tags: ["JavaScript","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:78,comments:12,collects:113,views:8990,"
---
> 希沃ENOW大前端
> 
> [公司官网：CVTE(广州视源股份)](https://link.juejin.cn?target=http%3A%2F%2Fwww.cvte.com%2F "http://www.cvte.com/")
> 
> 团队：CVTE旗下未来教育希沃软件平台中心enow团队

**本文作者：**

![龙飞名片.png](/images/jueJin/82027fb818a149a.png)

前言
--

`line-height`和`font-size`都是大家在日常开发过程中经常用到的`css`属性，但是有多少人知道`fontsize`设置`100px`，代表什么意思呢? 它跟元素高度和`line-height`是什么关系呢? 还有我们经常将line-height设置父容器的高度来实现文本垂直居中对齐，它的原理是怎样的呢，带着这些问题，我们来探讨一下。

font-size
---------

`font-size`其实代表的是字体的高度，如果不同的字体设置相同的`font-size`，字体高度会一样么，我们来举个例子看一下： 下面是一段简单的 `HTML` 代码，一个 `p` 标签包含了 3 个 `span` 标签，每个 `span` 各自有一个 `font-family`：

```html
<p>
<span class="a">Ba</span>
<span class="b">Ba</span>
<span class="c">Ba</span>
</p>
p { font-size: 100px }
.a { font-family: Helvetica }
.b { font-family: Gruppo    }
.c { font-family: Catamaran }
```

`font-size` 相同，`font-family` 不同，结果发现得到的 `span` 元素的高度也不同，经过测量发现： `Helvetica 115px，Gruppo 97px，Catamaran 164px`。

![image.png](/images/jueJin/f18dc2f4fb6d40f.png)

为什么会这样呢，想要找到答案，我们要先了解字体的原理。

### 字体原理

1.  一款字体首先会定义一个[em-square](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttp%253A%2F%2Fdesignwithfontforge.com%2Fzh-CN%2FThe_EM_Square.html "https://link.zhihu.com/?target=http%3A//designwithfontforge.com/zh-CN/The_EM_Square.html")，它是用来盛放字符的金属容器。这个 `em-square` 一般被设定为宽高均为 `1000` 相对单位，不过也可以是 `1024、2048` 相对单位。你可以理解为字体的模板（字模），如下图所示：

![image.png](/images/jueJin/41fd93c71cd04e6.png)

2.  每个字体会定义5条度量线来控制字符的位置，其中包括 `ascender、descender、capital height、x-height，baseline` 这5条度量线，这些度量的刻度是基于`1000`这个相对单位（不同字体相对单位可能不一样）来设置的，如下图所示：

![image.png](/images/jueJin/87923328e4db4db.png)

*   **Baseline：** 就是我们常说的基线，所有字母放置的水平线。它是文本中一条稳定的轴线，是校准文本与图片，文本与文本的一条重要的参考线。其他度量线都是相对基线来计算的。
*   **X-Height：** 是主要的小写字母高度（或者说是“x”字母的高度），除去上延和下延部分
*   **Cap Height：** `Cap`是`capital`（大写字母）的简称，有时也用`capital height`全称，是指H或E等直线型大写字母从基线到字母顶部的高度（大写字母高度）。而H或E等顶部这条对齐线叫作都大写线（`cap line`）
*   **Ascender：** 升部线，某些小写字母（例如`h、l`）会有一个升部（也叫上延），高度超出`x-height`，这是升部的对齐线
*   **Descender：** 降部线，某些小写字母（例如`p、y`）会有一个降部（也叫下延），沿基线往下延长的部分，这是降部的对齐线

其中，`Ascender` 与 `Descender`之差决定了字体渲染的高度（不考虑行高），也就是下文将会提到的`content-area`（内容区域）的高度

3.  在浏览器中，上面的 `1000` 相对单位会按照你需要的 `font-size` 缩放。

为了做更好的分析，我们装一下[FontForge](https://link.juejin.cn?target=https%3A%2F%2Ffontforge.org%2Fen-US%2Fdownloads%2F "https://fontforge.org/en-US/downloads/")软件，看一下具体字体的字体度量信息。

### 具体的例子

在`FontForge`软件打开某个字体，一般我们可以看到这样的设置：

![image.png](/images/jueJin/4585693de5ed477.png)

`Units Per Em`（就是上文讲到的`em-square`）表示一个字的高度有`1000`个单位，`baseline`的坐标为`0`，其它线的坐标相对于`baseline`，如下图所示：

![image.png](/images/jueJin/b803df2105574af.png) 不同字体的字体度量是不一样的，我们来分析一下上面例子用到的Catamaran字体： ![image.png](/images/jueJin/ee178034b61541b.png)

`Em Size`（也就是`em-square`）： `1000，ascender ： 1100，descender ： 540`，`macOS` 上的浏览器使用了 `HHead Ascent` 和 `HHead Descent` 值，`Windows` 上的浏览器使用了 `Win Ascent` 和 `Win Descent`（而且两个平台上的值不一样）。

这意味着 `Catamaran` 字体占据了 `1100 + 540` 个相对单位，尽管它的 `em-square` 只有 `1000` 个相对单位，所以当我们设置 `font-size:100px` 时，这个字体里的文字高度是 `1640*100/1000 = 164px` ；另外我们也能算出大写字母的高度（`cap height`）是：`680*100px/1000 = 68px`；小写字母的高度（`x-height`）是 `485*100/1000=49px`，如下图所示：

![image.png](/images/jueJin/c66b34e7531c446.png)

### 总结

1.  `fontsize` 的值不代表字体高度，也不代表的字体内容（`content-area`）高度
2.  字体内容（`content-area`）高度 与 `font-size` 和 `font-family` 相关

line-height
-----------

`line-height` ,又称行高，指的是两行文字基线之间的距离，也可以称为这行文字所占的高度。

![image.png](/images/jueJin/d98bff828b2e45d.png) 要理解line-height，我们首先要先理解行内框盒子模型，以下我们会详细介绍具体的4种盒子。

### 行内框盒子模型

1.  **内容区域（content area）**：是一种围绕文字看不见的盒子。内容区域的大小与`font-size`大小相关，也就是上文`fontsize`提到的`Ascender` 与 `Descender`之间的高度，`Ascender + Descender = conent-area`的高度，如下图所示：

![image.png](/images/jueJin/86004484c5b2444.png)

2.  **内联盒子(inline boxes)**：内联盒子不会让内容成块显示，而是排成一行。如果(文字)外部包含`inline`水平的标签(`span、a、em、strong`等)，则属于内联盒子。如果是个光秃秃的文字，则属于匿名内联盒子。图示会更清楚，下图红色虚线框部分是匿名内联盒子，实线框部分是内联盒子：

![image.png](/images/jueJin/6d27266a986448b.png)

3.  **行框盒子(line boxes)**：每一行就是一个行框盒子，每个行框盒子又是由一个一个内联盒子组成。
4.  **包含盒子(containing box)**：标签所在的包含盒子是由一行一行的行框盒子组成。

### 具体的例子

我们来考虑文本占据的高度，见下例：

![image.png](/images/jueJin/f348d152ac80431.png)

`p`标签的高度从何而来呢，是由里面的文字撑开的吗？答案：不是的，实际上**这个高度是由line-height决定的**！再看下例：

![image.png](/images/jueJin/169f280c284740c.png)

通过此例说明，**内联元素的高度是由行高决定的！**

至此，我们可以发现：

1.  行高由于其继承性，影响无处不在，即使单行文本也不例外。
2.  行高只是幕后黑手，**高度的表现不是行高**，而是**内容区域**和**行间距**。也是就说，

**内容区域高度(content area)+行间距(vertical spacing)=行高(line-height)，其中行间距分上下部分，间距对半分。**

注意：

1.  **内容区域**(`content area`)高度只与**字号**(`font-size`)以及**字体**(`font-size`)有关，与`line-height`没有任何关系。
2.  在`simsun`字体(即宋体)下，内容区域高度等于文字大小值。所以，在`simsun`字体下，**font-size+行间距=line-height**。行间距上下拆分，就有了**半行间距**；例如在`simsun`字体下，`font-size=240px`，`line-height=360px`，则半行间距是：`（360-240）/2 = 60px`

如果`line-height` 小于`font-size`，`inline box`会优先于行高，以保证`inline box`的高度正好等于行高。例：`font-size: 16px; line-height: 12px; inline box`高度为`12px`。`content area`会溢出，`inline box`的顶部和底部半行高会折叠起来，以保证`inline box`的高度。图示如下：

![image.png](/images/jueJin/52ec5e77fdd8405.png)

对于行高，我们得出以下结论：

1、行高 由 内容区域高度和行间距组成，行间距可以为负值，行间距分上下部分：上间距、下间距，它们距离相等。

2、行高用于计算 `line-box` 的高度

3、包含盒子的高度就是单行 `line-box` 高度的累加

### 属性值表现

行高支持以下种类型的属性值：

*   `normal`
*   比例值，比如`1.5`
*   具体长度值，比如`1.5em`
*   百分比值，比如`150%`

**1、normal**

`normal`是默认属性值，与字体相关联，具体怎么关联呢，我们使用`FontForge`软件打开`Catamaran`字体来看一下：

![image.png](/images/jueJin/b3ae16962e85498.png)

*   常规的 `Ascent/Descent：ascender` 是 `770，descender` 是 `230`，用于渲染字符。
*   规格 `Ascent/Descent：ascender` 是 `1100，descender` 是 `540`。用于计算 `content-area` 的高度
*   规格 `Line Gap`：用于计算 `line-height: normal`。

在 `Catamaran` 这款字体中，`Line Ga`p 的值是 `0`，那么 `line-height: normal` 的结果就跟 `content-area` 的高度一样，是 `1640` 相对单位。

为了做对比，我们再看看 `Arial` 字体，它的 em-square 是 `2048`，`ascender` 是 `1854`，`descender`是 `434`，`line gap` 是 `67`。那么当 `font-size: 100px` 时，

*   其 `content-area` 的高度就是 `100/2048*(1854+434)` = `111.72`，约为 `112px`；
*   其 `line-height: normal` 的结果就是`100/2048*(67+1854+434)` 约为 `115px`。

所有这些值都是由字体设计师设置的。

**2、比例值**

使用比例值作为行高值，例如`line-height：1.5`，这个比例值是相对当前元素的`font-size`来计算的， 假如`font-size = 20px`，那么`line-height = 1.5*20px = 30px`。

**3、具体长度值**

使用具体长度值作为行高值，比如

*   `line-height：1.5 rem/em`(相对单位)
*   `line-height：20px/pt`(固定单位)

**4、百分比值**

使用百分比值作为行高值，比如 `line-height：150%`，这个百分比也是相对当前元素的`font-size`，所以假如`fontSize = 20px`，那么`line-height = 1.5*20px = 30px`。

需要特别的注意的是，比例值和百分制从计算来看貌似没什么差别，但是最终效果是不一样的，比如：

*   `line-height：1.5`，所有可继承元素会自己的`font-size`重新计算行高，可以理解为只是继承比例值。
*   `line-height：150%`，当前元素根据`font-szie` 计算行高后，会将这个值继承给下面的元素，可以理解为继承了具体的值。

举个例子 ，看下面一段HTML代码：

```html
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<title>Document</title>
<style type="text /css">
    div {
    line-height:1.5;
    font-size:24px;
}
    p {
    font-size:60px;
}
</style>
</head>

<body>
<div>
<p>我的font-size
为60px~</p>
</div>
</body>

</html>
```

此时p标签的行高为：`1.5×60 = 90px`，两行行框盒子高度为`180px`。

当 `line-height:150%`时，此时先计算 `div` 标签的行高：`150%×24 = 36px` ，然后继承给p标签，所以两行行框高度为`72px`。

后语
--

通过对`font-size`和`line-height`的讲解，相信大家都明天它们的含义了，回到前言提到的那个问题：`line-height`设置为父容器的高度，为何能让文本垂直居中？我相信大家在阅读完这篇文章应该已经有答案了吧。