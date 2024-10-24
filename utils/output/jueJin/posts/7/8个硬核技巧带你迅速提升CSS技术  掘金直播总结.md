---
author: "JowayYoung"
title: "8个硬核技巧带你迅速提升CSS技术  掘金直播总结"
date: 2020-12-22
description: "前段时间笔者收到可爱漂亮的小册姐姐的邀请，做了人生首次直播分享。分享主题是《玩转CSS的艺术之美》，跟笔者在9月底发布的掘金小册同名。 9月底发布的玩转CSS的艺术之美，首日预售就达到709本，预售仅三日就破1000本。这也让笔者感到惊讶，没想到CSS技术还是那么受倔友们的欢迎…"
tags: ["HTML","CSS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读15分钟"
weight: 1
selfDefined:"likes:841,comments:0,collects:1300,views:27026,"
---
> 作者：[JowayYoung](https://link.juejin.cn?target=)  
> 仓库：[Github](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FJowayYoung "https://github.com/JowayYoung")、[CodePen](https://link.juejin.cn?target=https%3A%2F%2Fcodepen.io%2FJowayYoung "https://codepen.io/JowayYoung")  
> 博客：[官网](https://link.juejin.cn?target=https%3A%2F%2Fyangzw.vip "https://yangzw.vip")、[掘金](https://juejin.cn/user/2330620350432110 "https://juejin.cn/user/2330620350432110")、[思否](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fblog%2Fjowayyoung "https://segmentfault.com/blog/jowayyoung")、[知乎](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fc_1169597485852360704 "https://zhuanlan.zhihu.com/c_1169597485852360704")  
> 公众号：[IQ前端](https://link.juejin.cn?target=https%3A%2F%2Fp3-juejin.byteimg.com%2Ftos-cn-i-k3u1fbpfcp%2Fce29ed0ec8c546bfb687fdbdcecb1d1d~tplv-k3u1fbpfcp-zoom-1.image "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce29ed0ec8c546bfb687fdbdcecb1d1d~tplv-k3u1fbpfcp-zoom-1.image")  
> 特别声明：原创不易，未经授权不得转载或抄袭，如需转载可联系笔者授权

### 前言

前段时间笔者收到**可爱漂亮的小册姐姐**的邀请，做了人生首次直播分享。分享主题是《玩转CSS的艺术之美》，跟笔者在9月底发布的[掘金小册](https://juejin.cn/book/6850413616484040711 "https://juejin.cn/book/6850413616484040711")同名。

9月底发布的[玩转CSS的艺术之美](https://juejin.cn/book/6850413616484040711 "https://juejin.cn/book/6850413616484040711")，首日预售就达到`709本`，预售仅三日就破`1000本`。这也让笔者感到惊讶，没想到CSS技术还是那么受倔友们的欢迎，让笔者觉得熬夜半年写这本小册还是值得的，毕竟能将自己的学习心路分享出去，让更多同学学到更多东西，也是一件值得开心的事情。

由于首次做直播分享，感觉比较紧张，家里网络不是特别好，还有其他原因，导致认真准备的内容未在预料时间内完成分享，因此通过本文将来不及分享的内容整理出来。

![二期直播](/images/jueJin/5c1c2fb04fac4b3.png)

### 目录

对分享内容感兴趣的同学可关注笔者的公众号[IQ前端](https://link.juejin.cn?target=https%3A%2F%2Fyangzw.vip%2Fstatic%2Ffrontend%2Faccount%2FIQ%25E5%2589%258D%25E7%25AB%25AF%25E5%2585%25AC%25E4%25BC%2597%25E5%258F%25B7.jpg "https://yangzw.vip/static/frontend/account/IQ%E5%89%8D%E7%AB%AF%E5%85%AC%E4%BC%97%E5%8F%B7.jpg")，回复`CSSPPT`下载分享`PPT`。分享内容包含**历史背景**、**概念原理**和**开发技巧**三节。第一二节比较无聊，可自行查看PPT，在此就不多说了。主要是第三节的干货，是笔者认真准备了好几天的内容，每个主题都会有对应的源码及其效果。

![目录](/images/jueJin/07aebed589934cd.png)

笔者选择了一些常用甚至有些小册都未提及到的干货作为分享内容，相信这些内容能帮助同学们在短期内提升CSS编码素质，实现一些看似只能由JS才能实现的效果。

*    **神奇的选择器**
*    **浅谈布局那些事**
*    **绘制三角的原理**
*    **完美极致的变量**
*    **添油加醋的伪元素**
*    **灵活多变的障眼法**
*    **意向不到的内容插入**
*    **无所不能的模拟点击事件**

> 准备工作

整个分享过程不搞那些乱七八糟的环境搭建。既然只玩CSS，那只有`html文件`和`css文件`就足够了。另外还需一个浏览器`Chrome`和一个编辑器`VSCode`。

`VSCode`还需安装**Live Sass Compiler**和**Live Server**两个插件。`Live Sass Compiler`用于实时编译`sass/scss文件`为`css文件`。`Live Server`用于启动具有实时刷新功能的本地开发服务器，以处理静态页面和动态页面。

新建`index.html`和`index.scss`。为了使各大浏览器默认样式一致，还需引入一个磨平浏览器默认样式的`css文件`，同学们可下载笔者写好的[reset.css](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FJowayYoung%2Fbruce-cli%2Fblob%2Fmaster%2Ftemp%2Fassets%2Fcss%2Freset.css "https://github.com/JowayYoung/bruce-cli/blob/master/temp/assets/css/reset.css")到本地目录里。

```html
<!doctype html>
<html>

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, minimum-scale=1, maximum-scale=1">
<title>Hello CSS</title>
<link rel="stylesheet" href="./reset.css">
<link rel="stylesheet" href="./index.css">
</head>

<body class="flex-ct-x">
<!-- ... -->
</body>

</html>
``````scss
    body {
    overflow: hidden;
    height: 100vh;
}
```

上述文件骨架完成后，打开`index.scss`，按`F1`或`Cmd + Shift + P`打开命令面板，输入`Watch Sass`监听`index.scss`并生成`index.css`，再输入`Open With Live Server`启动本地开发服务器并打开浏览器。到此为止就完成了所有准备工作了。

### 神奇的选择器

很多CSS编码习惯都是清一色的类而无相应的选择器，层层嵌套的标签都包含至少一个类。`选择器`和`类`对比起来性能上确实没后者那么好，但如今浏览器对于CSS的解析速度已得到大大的提升，完全可忽略选择器那丁点的性能问题。

可是CSS模块众多，依次推出的选择器也很多。若无特别方法记熟这些选择器对应的功能，也很难将选择器发挥到最大作用。玩转CSS的最关键一步是**能熟悉大部分选择器及其功能与使用场景**。

笔者根据选择器的功能划分出八大类，每个类别的选择器都能在一个使用场景中互相组合，记熟这些类别的选择器，相信就能将选择器发挥到最大作用。以下选择器的`常用选项`里若打勾可强行记熟，这些选择器都是笔者久经沙场而标记出来且认为是最好用的选择器。

> 基础选择器

选择器

别名

说明

版本

常用

`tag`

标签选择器

指定类型的`标签`

1

√

`#id`

ID选择器

指定身份的`标签`

1

√

`.class`

类选择器

指定类名的`标签`

1

√

`*`

通配选择器

所有类型的`标签`

2

√

> 层次选择器

选择器

别名

说明

版本

常用

`elemP elemC`

`后代选择器`

元素的`后代元素`

1

√

`elemP>elemC`

`子代选择器`

元素的`子代元素`

2

√

`elem1+elem2`

`相邻同胞选择器`

元素相邻的`同胞元素`

2

√

`elem1~elem2`

`通用同胞选择器`

元素后面的`同胞元素`

3

√

> 集合选择器

选择器

别名

说明

版本

常用

`elem1,elem2`

`并集选择器`

多个指定的`元素`

1

√

`elem.class`

`交集选择器`

指定类名的`元素`

1

√

> 条件选择器

选择器

说明

版本

常用

`:lang`

指定标记语言的`元素`

2

×

`:dir()`

指定编写方向的`元素`

4

×

`:has`

包含指定元素的`元素`

4

×

`:is`

指定条件的`元素`

4

×

`:not`

非指定条件的`元素`

4

√

`:where`

指定条件的`元素`

4

×

`:scope`

指定`元素`作为参考点

4

×

`:any-link`

所有包含`href`的`链接元素`

4

×

`:local-link`

所有包含`href`且属于绝对地址的`链接元素`

4

×

> 状态选择器

选择器

说明

版本

常用

`:active`

鼠标激活的`元素`

1

×

`:hover`

鼠标悬浮的`元素`

1

√

`:link`

未访问的`链接元素`

1

×

`:visited`

已访问的`链接元素`

1

×

`:target`

当前锚点的`元素`

3

×

`:focus`

输入聚焦的`表单元素`

2

√

`:required`

输入必填的`表单元素`

3

√

`:valid`

输入合法的`表单元素`

3

√

`:invalid`

输入非法的`表单元素`

3

√

`:in-range`

输入范围以内的`表单元素`

3

×

`:out-of-range`

输入范围以外的`表单元素`

3

×

`:checked`

选项选中的`表单元素`

3

√

`:optional`

选项可选的`表单元素`

3

×

`:enabled`

事件启用的`表单元素`

3

×

`:disabled`

事件禁用的`表单元素`

3

√

`:read-only`

只读的`表单元素`

3

×

`:read-write`

可读可写的`表单元素`

3

×

`:target-within`

内部锚点元素处于激活状态的`元素`

4

×

`:focus-within`

内部表单元素处于聚焦状态的`元素`

4

√

`:focus-visible`

输入聚焦的`表单元素`

4

×

`:blank`

输入为空的`表单元素`

4

×

`:user-invalid`

输入合法的`表单元素`

4

×

`:indeterminate`

选项未定的`表单元素`

4

×

`:placeholder-shown`

占位显示的`表单元素`

4

√

`:current()`

浏览中的`元素`

4

×

`:past()`

已浏览的`元素`

4

×

`:future()`

未浏览的`元素`

4

×

`:playing`

开始播放的`媒体元素`

4

×

`:paused`

暂停播放的`媒体元素`

4

×

> 结构选择器

选择器

说明

版本

常用

`:root`

文档的`根元素`

3

×

`:empty`

无子元素的`元素`

3

√

`:nth-child(n)`

元素中指定顺序索引的`元素`

3

√

`:nth-last-child(n)`

元素中指定逆序索引的`元素`

3

×

`:first-child`

元素中为首的`元素`

2

√

`:last-child`

元素中为尾的`元素`

3

√

`:only-child`

父元素仅有该元素的`元素`

3

√

`:nth-of-type(n)`

标签中指定顺序索引的`标签`

3

√

`:nth-last-of-type(n)`

标签中指定逆序索引的`标签`

3

×

`:first-of-type`

标签中为首的`标签`

3

√

`:last-of-type`

标签中为尾`标签`

3

√

`:only-of-type`

父元素仅有该标签的`标签`

3

√

> 属性选择器

选择器

说明

版本

常用

`[attr]`

指定属性的`元素`

2

√

`[attr=val]`

属性等于指定值的`元素`

2

√

`[attr*=val]`

属性包含指定值的`元素`

3

√

`[attr^=val]`

属性以指定值开头的`元素`

3

√

`[attr$=val]`

属性以指定值结尾的`元素`

3

√

`[attr~=val]`

属性包含指定值(完整单词)的`元素`(不推荐使用)

2

×

`[attr|=val]`

属性以指定值(完整单词)开头的`元素`(不推荐使用)

2

×

> 伪元素

选择器

说明

版本

常用

`::before`

在元素前插入的`内容`

2

√

`::after`

在元素后插入的`内容`

2

√

`::first-letter`

元素的`首字母`

1

×

`::first-line`

元素的`首行`

1

×

`::selection`

鼠标选中的`元素`

3

×

`::backdrop`

全屏模式的`元素`

4

×

`::placeholder`

表单元素的`占位`

4

√

选择器真正的用处不仅仅是`说明选项`里的描述，更多是搭配起来能起到的最大作用。这些选择器组成的**选择器系统**是整个CSS体系里的核心，使用选择器能带来以下好处。

*   **清晰易读**：对于那些结构与行为分离的写法，使用`sass/less`编写属性时结构会更清晰易读，减少很多无用或少用的类，保持`css文件`的整洁性和观赏性
*   **确保一致**：减少修改类而有可能导致样式失效的问题，有时修改类但未确保HTML和CSS的一致而导致样式失效
*   **剔除累赘**：减少无实质性使用的类，例如很多层嵌套的标签，这些标签可能只使用到一个属性，就没必要新建类关联
*   **高效流畅**：使用选择器可实现一些看似只能由JS才能实现的效果，既减少代码量也减少JS对DOM的操作，使得交互效果更流畅

### 浅谈布局那些事

掌握一些常用布局是一个前端必不可少的技能。养成看设计图就能大概规划出整体布局的前提是必须熟悉这些常用布局的特点与构造。曾经需结合很多属性才能完成一个布局，如今在现代属性的加持下能更好地快速实现各种布局，节约更多时间去做更重要的事情。

##### 全屏布局

经典的**全屏布局**由`顶部`、`底部`和`主体`三部分组成，其特点为`三部分左右满屏拉伸`、`顶部底部高度固定`和`主体高度自适应`。该布局很常见，也是大部分Web应用主体的主流布局。通常使用`<header>`、`<footer>`和`<main>`三个标签语义化排版，`<main>`内还可插入`<aside>`侧栏或其他语义化标签。

![全屏布局](/images/jueJin/b027069fdce54c1.png)

```html
<div class="fullscreen-layout">
<header></header>
<main></main>
<footer></footer>
</div>
```

> position + left/right/top/bottom

三部分统一声明`left:0`和`right:0`将其左右满屏拉伸；顶部和底部分别声明`top:0`和`bottom:0`将其吸顶和吸底，并声明俩高度为固定值；将主体的`top`和`bottom`分别声明为顶部高度和底部高度。通过绝对定位的方式将三部分固定在特定位置，使其互不影响。

```scss
    .fullscreen-layout {
    position: relative;
    width: 400px;
    height: 400px;
    header,
    footer,
        main {
        position: absolute;
        left: 0;
        right: 0;
    }
        header {
        top: 0;
        height: 50px;
        background-color: #f66;
    }
        footer {
        bottom: 0;
        height: 50px;
        background-color: #66f;
    }
        main {
        top: 50px;
        bottom: 50px;
        background-color: #3c9;
    }
}
```

> flex

使用`flex`实现会更简洁。`display:flex`默认会令子节点横向排列，需声明`flex-direction:column`改变子节点排列方向为纵向排列；顶部和底部高度固定，所以主体需声明`flex:1`让高度自适应。

```scss
    .fullscreen-layout {
    display: flex;
    flex-direction: column;
    width: 400px;
    height: 400px;
        header {
        height: 50px;
        background-color: #f66;
    }
        footer {
        height: 50px;
        background-color: #66f;
    }
        main {
        flex: 1;
        background-color: #3c9;
    }
}
```

若`<main>`需表现成可滚动状态，千万不要声明`overflow:auto`让容器自适应滚动，这样做有可能因为其他格式化上下文的影响而导致自适应滚动失效或产生其他未知效果。需在`<main>`内插入一个`<div>`并声明如下。

```scss
    div {
    overflow: hidden;
    height: 100%;
}
```

##### 多列布局

###### 两列布局

经典的**两列布局**由`左右两列`组成，其特点为`一列宽度固定`、`另一列宽度自适应`和`两列高度固定且相等`。以下以左列宽度固定和右列宽度自适应为例，反之同理。

![多列布局-两列布局](/images/jueJin/12f7992b853b476.png)

```html
<div class="two-column-layout">
<div class="left"></div>
<div class="right"></div>
</div>
```

> float + margin-left/right

左列声明`float:left`和固定宽度，由于`float`使节点脱流，右列需声明`margin-left`为左列宽度，以保证两列不会重叠。

```scss
    .two-column-layout {
    width: 400px;
    height: 400px;
        .left {
        float: left;
        width: 100px;
        height: 100%;
        background-color: #f66;
    }
        .right {
        margin-left: 100px;
        height: 100%;
        background-color: #66f;
    }
}
```

> overflow + float

左列声明同上，右列声明`overflow:hidden`使其形成`BFC区域`与外界隔离。`BFC`相关详情请查看小册第4章[盒模型](https://juejin.cn/book/6850413616484040711 "https://juejin.cn/book/6850413616484040711")。

```scss
    .two-column-layout {
    width: 400px;
    height: 400px;
        .left {
        float: left;
        width: 100px;
        height: 100%;
        background-color: #f66;
    }
        .right {
        overflow: hidden;
        height: 100%;
        background-color: #66f;
    }
}
```

> flex

使用`flex`实现会更简洁。左列声明固定宽度，右列声明`flex:1`自适应宽度。

```scss
    .two-column-layout {
    display: flex;
    width: 400px;
    height: 400px;
        .left {
        width: 100px;
        background-color: #f66;
    }
        .right {
        flex: 1;
        background-color: #66f;
    }
}
```

###### 三列布局

经典的**三列布局**由`左中右三列`组成，其特点为`连续两列宽度固定`、`剩余一列宽度自适应`和`三列高度固定且相等`。以下以左中列宽度固定和右列宽度自适应为例，反之同理。整体的实现原理与上述两列布局一致。

![多列布局-三列布局](/images/jueJin/892ab25b75894be.png)

```html
<div class="three-column-layout">
<div class="left"></div>
<div class="center"></div>
<div class="right"></div>
</div>
```

为了让右列宽度自适应计算，就不使用`float + margin-left`的方式了，若使用`margin-left`还得结合左中列宽度计算。

> overflow + float

```scss
    .three-column-layout {
    width: 400px;
    height: 400px;
        .left {
        float: left;
        width: 50px;
        height: 100%;
        background-color: #f66;
    }
        .center {
        float: left;
        width: 100px;
        height: 100%;
        background-color: #66f;
    }
        .right {
        overflow: hidden;
        height: 100%;
        background-color: #3c9;
    }
}
```

> flex

```scss
    .three-column-layout {
    display: flex;
    width: 400px;
    height: 400px;
        .left {
        width: 50px;
        background-color: #f66;
    }
        .center {
        width: 100px;
        background-color: #66f;
    }
        .right {
        flex: 1;
        background-color: #3c9;
    }
}
```

###### 圣杯布局与双飞翼布局

经典的**圣杯布局**和**双飞翼布局**都是由`左中右三列`组成，其特点为`左右两列宽度固定`、`中间一列宽度自适应`和`三列高度固定且相等`。其实也是上述两列布局和三列布局的变体，整体的实现原理与上述N列布局一致，可能就是一些细节需注意。

`圣杯布局`和`双飞翼布局`在大体相同下也存在一点不同，区别在于`双飞翼布局`中间列需插入一个子节点。在常规的实现方式中也是在这个中间列里做文章，`如何使中间列内容不被左右列遮挡`。

*   相同
    *   中间列放首位且声明其宽高占满父节点
    *   被挤出的左右列使用`float`和`margin负值`将其拉回与中间列处在同一水平线上
*   不同
    *   圣杯布局：父节点声明`padding`为左右列留出空位，将左右列固定在空位上
    *   双飞翼布局：中间列插入子节点并声明`margin`为左右列让出空位，将左右列固定在空位上

![多列布局-圣杯布局](/images/jueJin/8dc38beabb574ef.png)

> 圣杯布局float + margin-left/right + padding-left/right

由于浮动节点在位置上不能高于前面或平级的非浮动节点，否则会导致浮动节点下沉。因此在编写HTML结构时，将中间列节点挪到右列节点后面。

```html
<div class="grail-layout-x">
<div class="left"></div>
<div class="right"></div>
<div class="center"></div>
</div>
``````scss
    .grail-layout-x {
    padding: 0 100px;
    width: 400px;
    height: 400px;
        .left {
        float: left;
        margin-left: -100px;
        width: 100px;
        height: 100%;
        background-color: #f66;
    }
        .right {
        float: right;
        margin-right: -100px;
        width: 100px;
        height: 100%;
        background-color: #66f;
    }
        .center {
        height: 100%;
        background-color: #3c9;
    }
}
```

> 双飞翼布局float + margin-left/right

HTML结构大体同上，只是在中间列里插入一个子节点`<div>`。根据两者区别，CSS声明会与上述圣杯布局有一点点出入，可观察对比找出不同地方。

```html
<div class="grail-layout-y">
<div class="left"></div>
<div class="right"></div>
<div class="center">
<div></div>
</div>
</div>
``````scss
    .grail-layout-y {
    width: 400px;
    height: 400px;
        .left {
        float: left;
        width: 100px;
        height: 100%;
        background-color: #f66;
    }
        .right {
        float: right;
        width: 100px;
        height: 100%;
        background-color: #66f;
    }
        .center {
        margin: 0 100px;
        height: 100%;
        background-color: #3c9;
    }
}
```

> 圣杯布局/双飞翼布局flex

使用flex实现`圣杯布局/双飞翼布局`可忽略上述分析，左右两列宽度固定，中间列宽度自适应。

```html
<div class="grail-layout">
<div class="left"></div>
<div class="center"></div>
<div class="right"></div>
</div>
``````scss
    .grail-layout {
    display: flex;
    width: 400px;
    height: 400px;
        .left {
        width: 100px;
        background-color: #f66;
    }
        .center {
        flex: 1;
        background-color: #3c9;
    }
        .right {
        width: 100px;
        background-color: #66f;
    }
}
```

###### 均分布局

经典的**均分布局**由`多列`组成，其特点为`每列宽度相等`和`每列高度固定且相等`。总体来说也是最简单的经典布局，由于每列宽度相等，所以很易找到合适的方式处理。

![多列布局-均分布局](/images/jueJin/4cd0dec75a78485.png)

```html
<div class="average-layout">
<div class="one"></div>
<div class="two"></div>
<div class="three"></div>
<div class="four"></div>
</div>
``````scss
    .one {
    background-color: #f66;
}
    .two {
    background-color: #66f;
}
    .three {
    background-color: #f90;
}
    .four {
    background-color: #09f;
}
```

> float + width

每列宽度声明为相等的百分比，若有4列则声明`width:25%`。N列就用公式`100 / n`求出最终百分比宽度，记得保留2位小数，懒人还可用`width:calc(100% / n)`自动计算呢。

```scss
    .average-layout {
    width: 400px;
    height: 400px;
        div {
        float: left;
        width: 25%;
        height: 100%;
    }
}
```

> flex

使用flex实现会更简洁。节点声明`display:flex`后，生成的`FFC容器`里所有子节点的高度都相等，因为容器的`align-items`默认为`stretch`，所有子节点将占满整个容器的高度。每列声明`flex:1`自适应宽度。

```scss
    .average-layout {
    display: flex;
    width: 400px;
    height: 400px;
        div {
        flex: 1;
    }
}
```

##### 居中布局

**居中布局**由`父容器`与`若干个子容器`组成，子容器在父容器中横向排列或竖向排列且呈水平居中或垂直居中。居中布局是一个很经典的问题，所以笔者在小册中罗列了所有居中布局方式，详情请查看小册第6章[布局方式](https://juejin.cn/book/6850413616484040711 "https://juejin.cn/book/6850413616484040711")。

![居中布局](/images/jueJin/8f5311497f6b413.png)

在此直接上一个目前最简单最高效的居中方式。`display:flex`与`margin:auto`的强行组合，同学们自行体会。

```html
<div class="center-layout">
<div></div>
</div>
``````scss
    .center-layout {
    display: flex;
    width: 400px;
    height: 400px;
    background-color: #f66;
        div {
        margin: auto;
        width: 100px;
        height: 100px;
        background-color: #66f;
    }
}
```

### 绘制三角的原理

盒模型从理论上来说是一个标准的矩形，很难将其联想到基于盒模型绘制一个三角形。当然存在一个叫`clip-path`的属性，可绘制三角形，鉴于其兼容性较差通常不会大范围使用它绘制三角形。

很多同学都会基于盒模型编写三角形，但大部分都是复制粘贴的操作。从原理上正确理解其成因，才能无需复制粘贴就能得心应手地绘制各种三角形。以下从零到一熟悉一次绘制三角形的原理。

绘制一个边框分别为四种颜色的正方形。

![三角原理-1](/images/jueJin/b2e9c42b396e465.png)

```html
<div class="triangle"></div>
``````scss
    .triangle {
    border: 50px solid;
    border-left-color: #f66;
    border-right-color: #66f;
    border-top-color: #f90;
    border-bottom-color: #09f;
    width: 200px;
    height: 200px;
}
```

分别将`width`和`height`累减到`0`，发现正方形由四个不同颜色的等腰三角形组成。

![三角原理-2](/images/jueJin/592f2bf47023480.png)

```scss
    .triangle {
    border: 50px solid;
    border-left-color: #f66;
    border-right-color: #66f;
    border-top-color: #f90;
    border-bottom-color: #09f;
    width: 0;
    height: 0;
}
```

尝试将右边框颜色声明为透明，会发现右边框隐藏起来。

![三角原理-3](/images/jueJin/87a1f3a474bb467.png)

```scss
    .triangle {
    border: 50px solid;
    border-left-color: #f66;
    border-right-color: transparent;
    border-top-color: #f90;
    border-bottom-color: #09f;
    width: 0;
    height: 0;
}
```

同样原理，将上边框颜色和下边框颜色同时声明为透明，就会得到一个指向右边的三角形。

![三角原理-4](/images/jueJin/797f903850294d7.png)

```scss
    .triangle {
    border: 50px solid;
    border-left-color: #f66;
    border-right-color: transparent;
    border-top-color: transparent;
    border-bottom-color: transparent;
    width: 0;
    height: 0;
}
```

可简写成以下代码。细心的同学可能还会发现三角形的宽是高的2倍，而高正好是边框宽度`border-width`。从中可得出一个技巧：**若绘制三角形的方向为左右上下，则将四条边框颜色声明为透明且将指定方向的反方向的边框着色，即可得到所需方向的三角形**。

```scss
    .triangle {
    border: 50px solid transparent;
    border-left-color: #f66;
    width: 0;
    height: 0;
}
```

若绘制左上角、左下角、右上角或右下角的三角形，使用上述技巧就无法完成了。可稍微变通思维，其实指向左上角的三角形是由左边框和上边框组成，其他三角形也是如此。

![三角原理-5](/images/jueJin/3f1b43bf3d5048e.png)

```scss
    .triangle {
    border: 50px solid transparent;
    border-left-color: #f66;
    border-top-color: #f66;
    width: 0;
    height: 0;
}
```

基于上述原理，可得心应手绘制出左右上下、左上角、左下角、右上角和右下角的三角形了，再结合绝对定位(`position/left/right/top/bottom`)、边距(`margin/margin-*`)或变换(`transform`)调整位置即可。

![三角原理-6](/images/jueJin/b229a9e129644d3.png)

```scss
    .triangle {
    border: 50px solid transparent;
    width: 0;
    height: 0;
        &.left {
        border-right-color: #f66;
    }
        &.right {
        border-left-color: #f66;
    }
        &.top {
        border-bottom-color: #f66;
    }
        &.bottom {
        border-top-color: #f66;
    }
        &.left-top {
        border-left-color: #f66;
        border-top-color: #f66;
    }
        &.left-bottom {
        border-left-color: #f66;
        border-bottom-color: #f66;
    }
        &.right-top {
        border-right-color: #f66;
        border-top-color: #f66;
    }
        &.right-bottom {
        border-right-color: #f66;
        border-bottom-color: #f66;
    }
}
```

### 完美极致的变量

**变量**又名**自定义属性**，指可在整个文档中重复使用的值。它由自定义属性`--var`和函数`var()`组成，`var()`用于引用自定义属性。使用变量能带来以下好处。

*   减少样式代码的重复性
*   增加样式代码的扩展性
*   提高样式代码的灵活性
*   增多一种CSS与JS的通讯方式
*   不用深层遍历DOM改变某个样式

同时变量也是`浏览器原生特性`，无需经过任何转译可直接运行，也是DOM对象，极大便利了CSS与JS间的联系。变量除了具备简洁性和复用性，在重构组件样式时能让代码更易控制，同时还隐藏了一个强大的技巧，那就是与`calc()`结合使用。

看看一个简单的例子。一个条形加载条通常由几条线条组成，每条线条对应一个存在不同时延的相同动画，通过时间差运行相同动画，从而产生加载效果。估计大部分同学可能会把代码编写成以下形式。

![条形加载条](/images/jueJin/d26b53bd0084473.png)

```html
<ul class="strip-loading">
<li></li>
<li></li>
<li></li>
<li></li>
<li></li>
<li></li>
</ul>
``````scss
    .strip-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 200px;
        li {
        border-radius: 3px;
        width: 6px;
        height: 30px;
        background-color: #f66;
        animation: beat 1s ease-in-out infinite;
            & + li {
            margin-left: 5px;
        }
            &:nth-child(2) {
            animation-delay: 200ms;
        }
            &:nth-child(3) {
            animation-delay: 400ms;
        }
            &:nth-child(4) {
            animation-delay: 600ms;
        }
            &:nth-child(5) {
            animation-delay: 800ms;
        }
            &:nth-child(6) {
            animation-delay: 1s;
        }
    }
}
    @keyframes beat {
    0%,
        100% {
        transform: scaleY(1);
    }
        50% {
        transform: scaleY(.5);
    }
}
```

分析代码发现，每个`<li>`只是`animation-delay`不同，其余代码则完全相同，换成其他类似的**List集合**，那岂不是有10个`<li>`就写10个`:nth-child(n)`。显然这种方式不灵活也不易封装成组件，若能像JS那样封装成一个函数，并根据参数输出不同样式效果，那就更棒了。

对于HTML部分的修改，让每个`<li>`拥有一个自己作用域下的变量。对于CSS部分的修改，就需分析哪些属性是随着`index`递增而发生规律变化的，对规律变化的部分使用变量表达式代替即可。当然以下`<li style="--line-index: n;"></li>`可用`React JSX`或`Vue Template`的遍历语法编写。

```html
<ul class="strip-loading">
<li style="--line-index: 1;"></li>
<li style="--line-index: 2;"></li>
<li style="--line-index: 3;"></li>
<li style="--line-index: 4;"></li>
<li style="--line-index: 5;"></li>
<li style="--line-index: 6;"></li>
</ul>
``````scss
    .strip-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 200px;
        li {
        --time: calc((var(--line-index) - 1) * 200ms);
        border-radius: 3px;
        width: 6px;
        height: 30px;
        background-color: #f66;
        animation: beat 1.5s ease-in-out var(--time) infinite;
            & + li {
            margin-left: 5px;
        }
    }
}
    @keyframes beat {
    0%,
        100% {
        transform: scaleY(1);
    }
        50% {
        transform: scaleY(.5);
    }
}
```

代码中的变量`--line-index`和`--time`使每个`<li>`拥有一个属于自己的作用域。例如第二个`<li>`，`--line-index`的值为2，`--time`的计算值为`200ms`，换成第三个`<li>`后这两个值又会不同了。这就是变量的作用范围所致(`在当前节点块作用域及其子节点块作用域下有效`)。

`calc(var(--line-index) * 200ms)`就像一个JS函数，在当前节点的作用域上读取相应的变量，从而计算出具体数值并交由浏览器初始化。从中可得出一个技巧：**List集合里具备与索引递增相关的属性值都可用变量与`calc()`结合使用生成出来**。

还记得小学时代学习圆周率的场景吗，曾经有学者将一个圆形划分为很多很小的矩形，若这些矩形划分得足够细，那么也可拼在一起变成一个圆形。

将圆形划分为360个小矩形且每个矩形相对于父容器绝对定位，声明`transform-origin`为`center bottom`将小矩形的变换基准变更为`最底部最中间`，每个小矩形按照递增角度顺时针旋转N度，就会形成一个圆形。此时按照递增角度调整小矩形的背景色相，就会看到意想不到的渐变效果了。

*   每个小矩形的递增角度：`--Θ:calc(var(--line-index) / var(--line-count) * 1turn)`
*   每个小矩形的背景色相：`filter:hue-rotate(var(--Θ))`
*   每个小矩形的旋转角度：`transform:rotate(var(--Θ))`

若将小矩形的尺寸和数量设置更细更多，整体的渐变效果就会更均匀。

![渐变圆形](/images/jueJin/3cefc7b8fd45477.png)

```html
<ul class="gradient-circular" style="--line-count: 360;">
<li style="--line-index: 1;"></li>
...
<li style="--line-index: 360;"></li>
<!-- 360个<li>，可用模板语法生成  -->
</ul>
``````scss
    .gradient-circular {
    position: relative;
    width: 4px;
    height: 200px;
        li {
        --Θ: calc(var(--line-index) / var(--line-count) * 1turn);
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #3c9;
        filter: hue-rotate(var(--Θ));
        transform-origin: center bottom;
        transform: rotate(var(--Θ));
    }
}
```

### 添油加醋的伪元素

有时为了实现某个效果而往页面里反复添加标签变得很繁琐，添加太多标签反而不好处理而变得难以维护。此时会引入`伪元素`这个概念解决上述问题。正是`伪元素`能解决一些可不添加其他标签而起到占位作用，笔者才称`伪元素`为`“添油加醋”`。

上述选择器分类有提及`伪元素`，狭义上来说选择器除了`伪元素`，其他都是`伪类`。`伪元素`和`伪类`虽然都是选择器，但它们还是存在一丝丝的差别。

*   `伪元素`通常是一些实体选择器，选择满足指定条件的DOM，例如`::selection`、`::first-letter`和`::first-line`
*   `伪类`通常是一些状态选择器，选择处于特定状态的DOM，例如`:hover`、`:focus`和`:checked`

**伪元素**指页面里不存在的元素。`伪元素`在HTML代码里未声明却能正常显示，在页面渲染时看到这些本来不存在的元素发挥着重要作用。`:before`和`:after`是两个很重要的`伪元素`，早在CSS2就出现了。

起初`伪元素`的前缀使用**单冒号语法**。随着CSS改革，`伪元素`的前缀被修改成**双冒号语法**，`:before/:after`从此变成`::before/::after`，用来区分`伪类`，未提及的`伪元素`同理。若兼容低版本浏览器，还需使用`:before`和`:after`。

两者最主要的区别就是`伪类`使用**单冒号语法**，`伪元素`使用**双冒号语法**。当然笔者还是提倡同学们使用**单冒号语法**标记`伪类`，使用**双冒号语法**标记`伪元素`，这样在代码形式上就能一眼区分出来。

`::before`和`::after`的使用场景很多，也是笔者着重研究的技巧之一。`::before/::after`必须结合`content`使用，通常用作修饰节点，为节点插入一些多余的东西，但又不想内嵌一些其他标签。若插入2个以下(包含2个)的修饰，建议使用`::before/::after`。

说时迟那时快，立马结合上述绘制三角形的原理绘制一个常用的气泡对话框，圆滚滚的身子带上一个三角形的尾巴。气泡对话框的身板就是一个圆角矩形，可用`<div>`直接绘制，小尾巴是一个三角形，可用`::after`占位并绘制。这样就无需在`<div>`里添加一个`<i>`绘制小尾巴了。

![气泡对话框](/images/jueJin/27cce8b254964ef.png)

```html
<div class="bubble-box">iCSS</div>
``````scss
    .bubble-box {
    position: relative;
    border-radius: 5px;
    width: 200px;
    height: 50px;
    background-color: #f90;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
        &::after {
        position: absolute;
        left: 100%;
        top: 50%;
        margin-top: -5px;
        border: 5px solid transparent;
        border-left-color: #f90;
        content: "";
    }
}
```

从中可得出一个技巧：**若为节点做一些修饰却不想插入其他标签，可用::before和::after代替，但适用于2个占位以下**。其实这个也不算什么特别技巧，只是很多同学都不会去注意这种用法，有需求都是直接添加标签。也许以下提及的`障眼法`和`内容插入`会让同学们对`伪元素`另眼相看。

### 灵活多变的障眼法

上述使用`::after`简单地绘制气泡对话框的尾巴，然而复杂一点的带边框气泡对话框能否也使用`伪元素`绘制呢。看到这里先不要往下看代码，自行思考1分钟想想实现方法。

![带边框气泡对话框](/images/jueJin/3b2d6565265046b.png)

答案当然是可行的。以下是整个带边框气泡对话框的拆解，整体由三部分组成：带边框圆角矩形、黑色三角形、橙色三角形。先将两个三角形错位叠加生成一个箭头状的图形，再将该图形叠加到带边框圆角矩形的右边，最后将黑色三角形着色成白色，就能得到上图的带边框气泡对话框了。

![带边框气泡对话框-原理](/images/jueJin/faa38b6fa5f9429.png)

```html
<div class="bubble-empty-box">iCSS</div>
``````scss
    .bubble-empty-box {
    position: relative;
    border: 2px solid #f90;
    border-radius: 5px;
    width: 200px;
    height: 50px;
    line-height: 46px;
    text-align: center;
    font-size: 20px;
    color: #f90;
        &::before {
        position: absolute;
        left: 100%;
        top: 50%;
        margin: -5px 0 0 2px;
        border: 5px solid transparent;
        border-left-color: #f90;
        content: "";
    }
        &::after {
        position: absolute;
        left: 100%;
        top: 50%;
        margin-top: -4px;
        border: 4px solid transparent;
        border-left-color: #fff;
        content: "";
    }
}
```

整体实现思路就是一种障眼法，正确来说就是将图形错位叠加产生另一种效果，在平面设计中叫做**占位叠加**。有了这种设计思想，其实能使用CSS创造出很多意向不到的障眼法效果。

当你遇见心仪妹纸时，心里噗通噗通地跳动，此时此刻可用纯CSS描绘你的心情。使用单个`<div>`结合`::before`和`::after`，通过错位叠加的方式生成一个心形。在叠加前看看以下图形，是不是发现很像米老鼠呢。

![动感心形-原理1](/images/jueJin/212ceb3618e4407.png)

*   声明`<div>`形状为`正方形`并以中心顺时针旋转`45deg`
*   声明`::before`和`::after`继承`<div>`尺寸并分别绝对定位到左上角和右上角
*   声明`::before`和`::after`的圆角率为`100%`

![动感心形](/images/jueJin/29af85313ca148f.png)

```html
<div class="heart-shape"></div>
``````scss
    .heart-shape {
    position: relative;
    width: 200px;
    height: 200px;
    background-color: #f66;
    transform: rotate(45deg);
    &::before,
        &::after {
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 100%;
        width: 100%;
        height: 100%;
        background-color: #f66;
        content: "";
    }
        &::before {
        transform: translateX(-50%);
    }
        &::after {
        transform: translateY(-50%);
    }
}
```

最后巧妙利用`transform`将`::before`和`::after`平移到相应位置产生叠加错觉。这时分别对`::before`和`::after`着色，看看其中的奥秘。

![动感心形-原理2](/images/jueJin/4f00d76ce1304fb.png)

在这个基础上来一个更高级的玩法，添加渐变效果让心形变得更么么哒。

*   声明`<div>`从上到下(实际效果是从右上角到左下角)渐变着色
*   由于`::before`从旋转后的`<div>`X轴往左平移过去，所以其着色效果与`<div>`一致
*   由于`::after`从旋转后的`<div>`Y轴往上平移过去，所以其中线位置渐变着色必须与`<div>`顶部渐变着色的颜色一致(具体往下分析)

整体渐变效果的重点在`::after`上，由于`::after`下半部叠加在`<div>`上，所以下半部颜色必须透明，上半部底部(中线位置)渐变着色必须与`<div>`顶部渐变着色的颜色一致，这样才能做到无缝衔接。通过`Windows系统`和`MacOS系统`的测试，在`Windows系统`下的透明渐变位置需在`51%`的地方开始，这与屏幕设备的分辨率和广色域有关。

最后为了让渐变心形看起来更具立体感，给它绘制个阴影吧。若觉得这个渐变动感心形很美，可随手转发给女友哇！

![渐变动感心形](/images/jueJin/b1c613ed0019404.png)

```html
<div class="gradient-heart-shape"></div>
``````scss
    .gradient-heart-shape {
    position: relative;
    width: 200px;
    height: 200px;
    background-image: linear-gradient(to bottom, #09f, #f66);
    box-shadow: 0 0 20px rgba(#000, .8);
    transform: rotate(45deg);
    &::before,
        &::after {
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 100%;
        width: 100%;
        height: 100%;
        content: "";
    }
        &::before {
        background-image: linear-gradient(to bottom, #09f, #f66);
        transform: translateX(-50%);
    }
        &::after {
        background-image: linear-gradient(to bottom, #3c9, #09f 50%, transparent 50%, transparent);
        transform: translateY(-50%);
    }
}
```

### 意向不到的内容插入

上述提到`::before/::after`必须结合`content`使用，那么`content`就真的只能插入普通字符串吗？`content`何止这么简单，以下推广几种少见但强大的内容插入技巧。通过这几种技巧，就能很方便地将读取到的数据动态插入到`::before`或`::after`中。

*   内容拼接
*   结合`attr()`使用
*   结合`变量`和`计数器`使用

> 内容拼接

常规操作是`content:"CSS"`，也可拼接多个字符串，有些同学可能第一时间想起`content:"Hello "+"CSS"`。拜托，这不是JS而是CSS，CSS字符串拼接当然有自己的规则。CSS字符串拼接既不能使用`+`相连也可不用`空格`间隔。

```scss
    .elem {
    content: "Hello ""CSS"; // 等价于"Hello " "CSS"
    content: "Hello" attr(data-name); // 与attr()拼接
    content: counter(progress) "%"; // 与counter()拼接
}
```

> 结合`attr()`使用

`attr()`是一个被忽略的选择器，它有着强大的属性捕获功能。有这么一个场景，一个数据集合需遍历到每个`DOM`上并把某个字段插入到其`::after`上。这该怎么办，好像`95%`的同学都不会使用JS获取节点的`::before`或`::after`。这时`attr()`就派上用场了。

```html
<li v-for="v in list" :key="v.id" :data-name="v.name">
``````scss
    li::after {
    content: attr(data-name);
}
```

一行CSS代码搞掂，还用什么JS去获取节点的`::after`呢。当然`content`和`attr()`的使用场景不止那一点。

`:hover`作用于鼠标悬浮的节点，是一个很好用的选择器。在特定场景可代替`mouseenter`和`mouseleave`两个鼠标事件，加上`transtion`让节点的动画更丝滑。结合`attr()`有一个很好用的场景，就是鼠标悬浮在某个节点上显示提示浮层，提示浮层里包含着该动作的文本。

*   给节点标记一个用户属性`data-*`
*   当鼠标悬浮在该节点上触发`:hover`
*   通过`attr()`获取`data-*`的内容
*   将`data-*`的内容赋值到`伪元素`的`content`上

![悬浮提示](/images/jueJin/389eb6f6d41b45b.png)

```html
<ul class="hover-tips">
<li data-name="姨妈红"></li>
<li data-name="基佬紫"></li>
<li data-name="箩底橙"></li>
<li data-name="姣婆蓝"></li>
<li data-name="大粪青"></li>
<li data-name="原谅绿"></li>
</ul>
``````scss
$color-list: #f66 #66f #f90 #09f #9c3 #3c9;
    .hover-tips {
    display: flex;
    justify-content: space-between;
    width: 200px;
        li {
        position: relative;
        padding: 2px;
        border: 2px solid transparent;
        border-radius: 100%;
        width: 24px;
        height: 24px;
        background-clip: content-box;
        cursor: pointer;
        transition: all 300ms;
        &::before,
            &::after {
            position: absolute;
            left: 50%;
            bottom: 100%;
            opacity: 0;
            transform: translate3d(0, -30px, 0);
            transition: all 300ms;
        }
            &::before {
            margin: 0 0 12px -35px;
            border-radius: 5px;
            width: 70px;
            height: 30px;
            background-color: rgba(#000, .5);
            line-height: 30px;
            text-align: center;
            color: #fff;
            content: attr(data-name);
        }
            &::after {
            margin-left: -6px;
            border: 6px solid transparent;
            border-top-color: rgba(#000, .5);
            width: 0;
            height: 0;
            content: "";
        }
            @each $color in $color-list {
            $index: index($color-list, $color);
                &:nth-child(#{$index}) {
                background-color: $color;
                    &:hover {
                    border-color: $color;
                }
            }
        }
            &:hover {
            &::before,
                &::after {
                opacity: 1;
                transform: translate3d(0, 0, 0);
            }
        }
    }
}
```

> 结合`变量`和`计数器`使用

现在来玩高级一点的东西，先不做任何铺垫，接着往下看即可，反正就是`content`结合`变量`和`计数器`的使用场景。

笔者想做一个实时显示进度的悬浮球，跟着笔者一起敲代码吧。先画一个绿油油的波波。

![状态悬浮球-原理1](/images/jueJin/73daebcf71ab4a3.png)

```html
<div class="state-ball">
<div class="wave"></div>
</div>
``````scss
    .state-ball {
    overflow: hidden;
    position: relative;
    padding: 5px;
    border: 3px solid #3c9;
    border-radius: 100%;
    width: 150px;
    height: 150px;
    background-color: #fff;
        .wave {
        position: relative;
        border-radius: 100%;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(to bottom, #af8 13%, #3c9 91%);
    }
}
```

进度通常都是从底部往顶部逐渐提升，可用`::before`绘制一个圆形遮罩层，进度变化时将遮罩层一直往上提升产生障眼效果。提升过程可用绝对定位将遮罩层固定在底部，通过调整`margin-bottom`平移遮罩层。

为了方便演示，注释父容器的`overflow:hidden`，通过`Chrome Devtools`微调`margin-bottom`看看整体效果。后续记得将`overflow:hidden`声明回来。

![状态悬浮球-原理2](/images/jueJin/d8c13c3840e0435.png)

```scss
    .state-ball {
    // overflow: hidden;
    // ...
        &::before {
        position: absolute;
        left: 50%;
        bottom: 5px;
        z-index: 9;
        margin-left: -100px;
        margin-bottom: 0;
        border-radius: 100%;
        width: 200px;
        height: 200px;
        background-color: #09f;
        content: "";
    }
    // ...
}
```

为了让提升过程呈现动态效果，调整`::before`的背景颜色和圆角率并追加一个旋转动画。

![状态悬浮球-原理3](/images/jueJin/73c03ccf14b64c6.png)

```scss
    .state-ball {
    // ...
        &::before {
        position: absolute;
        left: 50%;
        bottom: 5px;
        z-index: 9;
        margin-left: -100px;
        margin-bottom: 0;
        border-radius: 45%;
        width: 200px;
        height: 200px;
        background-color: rgba(#fff, .5);
        content: "";
        animation: rotate 10s linear -5s infinite;
    }
    // ...
}
    @keyframes rotate {
        to {
        transform: rotate(1turn);
    }
}
```

为了让波浪呈现立体效果，追加`::after`占位并声明整体样式与`::before`一致，在背景颜色、圆角率和动画时延上略有差异即可。另外声明`::after`的`margin-bottom`稍微比`::before`高一点，这样在旋转过程中能让波浪产生动态的立体效果。

在提升过程中，两个遮罩层位移距离应该是一致的，所以可用变量计算公式表示且`::after`比`::before`高`10px`。在这里有个值得注意的地方，若变量结合`calc()`使用，其结果必须带上单位，以这两条公式为例，其变量初始值必须为`--offset:0px`，不能为`--offset:0`。

*   `::before`：`margin-bottom:var(--offset)`
*   `::after`：`margin-bottom:calc(var(--offset) + 10px)`

![状态悬浮球-原理4](/images/jueJin/2605a0bd5c6a48b.png)

```html
<div class="state-ball" style="--offset: 0px;">
<div class="wave"></div>
</div>
``````scss
    .state-ball {
    // ...
    &::before,
        &::after {
        position: absolute;
        left: 50%;
        bottom: 5px;
        z-index: 9;
        margin-left: -100px;
        width: 200px;
        height: 200px;
        content: "";
    }
        &::before {
        margin-bottom: var(--offset);
        border-radius: 45%;
        background-color: rgba(#fff, .5);
        animation: rotate 10s linear -5s infinite;
    }
        &::after {
        margin-bottom: calc(var(--offset) + 10px);
        border-radius: 40%;
        background-color: rgba(#fff, .8);
        animation: rotate 15s infinite;
    }
    // ...
}
// ...
```

到此再优化一些细节，通过`Chrome Devtools`检查`.wave`得知其尺寸为`134x134`，每次往上平移两个伪元素只能`1px`那样递增。现在想将其平移100次就能填充整个球体，那么就需按照`134/100`这个比例改造变量计算公式。

将`--offset`声明为`--offset:0`，取值区间在`0~100`而不是`0px~100px`。

*   `::before`：`margin-bottom:calc(var(--offset) * 1.34px)`
*   `::after`：`margin-bottom:calc(var(--offset) * 1.34px + 10px)`

![状态悬浮球-原理5](/images/jueJin/9c5a3bf2fdde49d.png)

```html
<div class="state-ball" style="--offset: 0;">
<div class="wave"></div>
</div>
``````scss
    .state-ball {
    // ...
        &::before {
        margin-bottom: calc(var(--offset) * 1.34px)
        // ...
    }
        &::after {
        margin-bottom: calc(var(--offset) * 1.34px + 10px);
        // ...
    }
    // ...
}
// ...
```

现在已把位移距离控制在`0~100`的比例了，那么剩下步骤就是追加一个`<div>`，使用其`content`存放在`offset`实时显示进度了。

![状态悬浮球-原理6](/images/jueJin/af5b4496c872430.png)

```html
<div class="state-ball" style="--offset: 0;">
<div class="wave"></div>
<div class="progress"></div>
</div>
``````scss
    .state-ball {
    // ...
        .progress::after {
        display: flex;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 99;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        font-weight: bold;
        font-size: 16px;
        color: #09f;
        content: var(--offset) "%";
    }
}
// ...
```

可是发现无任何文本效果。情况是这样的，若变量是字符串类型可直接显示，若变量是数值类型则需借助`counter()`显示。而`counter()`还需使用`counter-reset`初始默认值，CSS计数器怎样用在这里就不讲解了，感兴趣的同学可自行百度。

整体改造工程就这样完成了，完整代码如下。最后通过JS操作变量`--offset`就能实时改变进度了。

![状态悬浮球](/images/jueJin/5a6ce6903cab417.png)

```html
<div class="state-ball" style="--offset: 0;">
<div class="wave"></div>
<div class="progress"></div>
</div>
``````scss
    .state-ball {
    overflow: hidden;
    position: relative;
    padding: 5px;
    border: 3px solid #3c9;
    border-radius: 100%;
    width: 150px;
    height: 150px;
    background-color: #fff;
    &::before,
        &::after {
        position: absolute;
        left: 50%;
        bottom: 5px;
        z-index: 9;
        margin-left: -100px;
        width: 200px;
        height: 200px;
        content: "";
    }
        &::before {
        margin-bottom: calc(var(--offset) * 1.34px);
        border-radius: 45%;
        background-color: rgba(#fff, .5);
        animation: rotate 10s linear -5s infinite;
    }
        &::after {
        margin-bottom: calc(var(--offset) * 1.34px + 10px);
        border-radius: 40%;
        background-color: rgba(#fff, .8);
        animation: rotate 15s infinite;
    }
        .wave {
        position: relative;
        border-radius: 100%;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(to bottom, #af8 13%, #3c9 91%);
    }
        .progress::after {
        display: flex;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 99;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        font-weight: bold;
        font-size: 16px;
        color: #09f;
        content: counter(progress) "%";
        counter-reset: progress var(--offset);
    }
}
    @keyframes rotate {
        to {
        transform: rotate(1turn);
    }
}
```

### 无所不能的模拟点击事件

`:checked`作用于选项选中的表单节点，当`<input>`的`type`设置成`radio`和`checkbox`时可用。很多同学都会使用`input:checked + div {}`或`input:checked ~ div {}`的操作模拟鼠标点击事件。要让`input:checked + div {}`或`input:checked ~ div {}`起效，其HTML结构必须像以下那样。

```html
<input type="radio">
<div></div>
```

这样就无法分离结构与行为了，导致CSS必须跟着HTML走，只能使用绝对定位将`<input>`固定到指定位置。使用`<label>`绑定`<input>`可将`<input>`的鼠标选择事件转移到`<label>`上，由`<label>`控制选中状态。那么HTML结构可改为以下那样，此时的`<input>`可设置`hidden`隐藏起来，不参与任何排版。

```html
<input type="radio" id="btn" hidden>
<div>
<label for="btn">
</div>
```

`<input>`使用`id`与`<label>`使用`for`关联起来，而`hidden`使`<input>`隐藏起来，不占用页面任何位置，此时`<label>`放置在页面任何位置都行。

```css
input:checked + div {}
input:checked ~ div {}
```

有了这样的思路，就很易实现一个纯CSS标签导航了。

![标签导航](/images/jueJin/b301d98ef2f34ff.png)

```html
<div class="tab-navbar">
<input id="tab1" type="radio" name="tabs" hidden checked>
<input id="tab2" type="radio" name="tabs" hidden>
<input id="tab3" type="radio" name="tabs" hidden>
<input id="tab4" type="radio" name="tabs" hidden>
<nav>
<label for="tab1">标题1</label>
<label for="tab2">标题2</label>
<label for="tab3">标题3</label>
<label for="tab4">标题4</label>
</nav>
<main>
<ul>
<li>内容1</li>
<li>内容2</li>
<li>内容3</li>
<li>内容4</li>
</ul>
</main>
</div>
``````scss
    .active {
    background-color: #3c9;
    color: #fff;
}
    .tab-navbar {
    display: flex;
    overflow: hidden;
    flex-direction: column-reverse;
    border-radius: 10px;
    width: 300px;
    height: 400px;
        input {
            &:nth-child(1):checked {
                & ~ nav label:nth-child(1) {
                @extend .active;
            }
                & ~ main ul {
                background-color: #f66;
                transform: translate3d(0, 0, 0);
            }
        }
            &:nth-child(2):checked {
                & ~ nav label:nth-child(2) {
                @extend .active;
            }
                & ~ main ul {
                background-color: #66f;
                transform: translate3d(-25%, 0, 0);
            }
        }
            &:nth-child(3):checked {
                & ~ nav label:nth-child(3) {
                @extend .active;
            }
                & ~ main ul {
                background-color: #f90;
                transform: translate3d(-50%, 0, 0);
            }
        }
            &:nth-child(4):checked {
                & ~ nav label:nth-child(4) {
                @extend .active;
            }
                & ~ main ul {
                background-color: #09f;
                transform: translate3d(-75%, 0, 0);
            }
        }
    }
        nav {
        display: flex;
        height: 40px;
        background-color: #f0f0f0;
        line-height: 40px;
        text-align: center;
            label {
            flex: 1;
            cursor: pointer;
            transition: all 300ms;
        }
    }
        main {
        flex: 1;
            ul {
            display: flex;
            flex-wrap: nowrap;
            width: 400%;
            height: 100%;
            transition: all 300ms;
        }
            li {
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 1;
            font-weight: bold;
            font-size: 20px;
            color: #fff;
        }
    }
}
```

笔者曾经发表过一篇[《纯CSS免费让掘金社区拥有暗黑模式切换功能》](https://juejin.cn/post/6862599699334725639 "https://juejin.cn/post/6862599699334725639")，探讨了`:checked`、`+/~`与`filter`的玩法，详情请查看原文，在此就不啰嗦了。

![暗黑模式](/images/jueJin/03b6332c4a8440f.png)

### 总结

来不及分享的内容，就用文章叙述完，那天看直播的掘友们，让你们久等了。这几年花了很多时间钻研CSS，也许写完本文就要对CSS告一段落了。虽然花了很多时间钻研CSS，但也发布了几篇爆款CSS文章和一本CSS掘金小册，也算是留下了这几年的CSS学习成果了。

**喜欢做的事情总不想留什么遗憾**。接下来也要将钻研方向转移到JS上了，还是会像钻研CSS那样认真钻研JS的`性能优化`、`设计模式`和`数据算法`三大装逼套件。期望在2021年能有新的突破吧，也感谢掘金社区让我学习到别人的知识和别人学习到我的知识。

分享源码存放在笔者的[Github](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FJowayYoung%2Fjuejin-code%2Ftree%2Fmaster%2Ficss "https://github.com/JowayYoung/juejin-code/tree/master/icss")上，有需要的同学可拷贝一份。还有就是笔者向**可爱漂亮的小册姐姐**要了100份[玩转CSS的艺术之美](https://juejin.cn/book/6850413616484040711 "https://juejin.cn/book/6850413616484040711")六折优惠码**WmOrR0hR**，对该小册感兴趣的同学可了解一下哟！

CSS是一门天马行空的语言，说它简单也行说它困难也行。想了解更多纯CSS特效，可回看笔者往期文章，也可浏览笔者个人官网的[纯CSS特效专辑](https://link.juejin.cn?target=https%3A%2F%2Fyangzw.vip%2Fidea-css "https://yangzw.vip/idea-css")，保证满足你的眼球。

*   [灵活运用CSS开发技巧](https://juejin.cn/post/6844903926110617613 "https://juejin.cn/post/6844903926110617613")：`4200+`点赞量，`125k+`阅读量
*   [妙用CSS变量，让你的CSS变得更心动](https://juejin.cn/post/6844904084936327182 "https://juejin.cn/post/6844904084936327182")：`500+`点赞量，`15k+`阅读量
*   [纯CSS免费让掘金社区拥有暗黑模式切换功能](https://juejin.cn/post/6862599699334725639 "https://juejin.cn/post/6862599699334725639")：`100+`点赞量，`5k+`阅读量

### 结语

**❤️关注+点赞+收藏+评论+转发❤️**，原创不易，鼓励笔者创作更多高质量文章

**关注公众号`IQ前端`，一个专注于CSS/JS开发技巧的前端公众号，更多前端小干货等着你喔**

*   关注后回复`资料`免费领取学习资料
*   关注后回复`进群`拉你进技术交流群
*   欢迎关注`IQ前端`，更多**CSS/JS开发技巧**只在公众号推送

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)