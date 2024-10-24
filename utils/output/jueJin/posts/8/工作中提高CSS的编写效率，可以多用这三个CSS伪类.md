---
author: "Sunshine_Lin"
title: "工作中提高CSS的编写效率，可以多用这三个CSS伪类"
date: 2023-08-01
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心。 where 基本使用 where()  CSS 伪类函数接受选择器列表作为它的参数，将会选择所有"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:29,comments:0,collects:46,views:2655,"
---
前言
--

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心。

![](/images/jueJin/84d7bde5f63e489.png)

:where
------

### 基本使用

**`:where()`**  [CSS 伪类](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FCSS%2FPseudo-classes "https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-classes")函数接受[选择器列表](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FCSS%2FSelector_list "https://developer.mozilla.org/zh-CN/docs/Web/CSS/Selector_list")作为它的参数，将会选择所有能被该选择器列表中任何一条规则选中的元素。

以下代码，文本都会变成 yellow 颜色

```html
    :where(div p) span {
    color: yellow;
}

<div class="test-div">
<span>哈哈</span>
</div>
<p class="test-p">
<span>哈哈</span>
</p>
```

### 使用场景

其实 `:where()` 的功能本来就有，只不过有了它之后，实现起这些功能来就更加方便快捷~接下来就来讲讲它的组合/叠加功能

我们来看下面的这段 css 代码

```css
div a:hover,
li a:hover,
.cla a:hover,
.aa .bb a:hover,
    [class^='bold'] a:hover{
    color: yellow;
}
```

我们可以使用 `:where()`来简化这个写法，使用它找出 div li .cla 这三种选择器，选择器可以是标签，也可以是类名，也可以是选择器表达式

```css
    :where(div, li, .cla, .a .b, [class^='bold']) a:hover {
    color: yellow;
}
```

再来看看使用 `:where()` 的组合，完成一些功能，我们看以下的代码

```css
.dark-theme button,
.dark-theme a,
.light-theme button,
    .light-theme a{
    color: pink;
}
```

我们完全可以使用 `:where()` 简化这个写法

```css
    :where(.dark-theme, light-theme) :where(button, a) {
    color: pink;
}
```

### 优先级

`:where()`的优先级是 0，我们可以看下面代码

```css
    .test {
    color: yellow;
}
    :where(.test) {
    color: pink
}
```

最后字体颜色是 yellow

### 兼容性

全绿~

![image.png](/images/jueJin/39644a7f417d443.png)

:is
---

`:is()`跟`:where()`可以说一模一样，区别就是 `:is()`的优先级不是0，而是由传入的选择器来决定的，拿刚刚的代码来举个例子

```css
    div {
    color: yellow;
}
    :where(.test) {
    color: pink
}

<div class="test">哈哈</div>
```

这要是 `:where()`，那么字体颜色会是 yellow，因为它的优先级是 0

但是如果是 `:is()`的话，字体颜色会是 pink，因为 类选择器 优先级比 标签选择器 优先级高~

```css
    :is(.test) {
    color: pink
}
    div {
    color: yellow;
}

<div class="test">哈哈</div>
```

### 兼容性

全绿~

![image.png](/images/jueJin/7784e1be0bae4e0.png)

:has
----

### 基本使用

举一个场景例子，我们看以下代码，一个容器中，图片是可以显隐的，我想要实现：

*   图片显示时，字体大小为 12px
*   图片隐藏时，字体大小为 20px

```html
<div class="container">
哈哈哈哈哈
<img class="test-img" v-if="showImg"></img>
</div>
```

如果按照以前的做法，就是使用 动态class 的方式去玩完成这个功能，但是现在有 `:has()`可以通过 css 的方式去完成这件事~

```css
    .container {
    font-size: 20px;
}
    .container:has(img) {
    font-size: 12px;
}

或者
    .container:has(.test-img) {
    font-size: 12px;
}
```

### 组合使用

现在又有两个场景

*   判断容器有没有**子img**，有的话字体设置为 12px（上面的例子是后代选择器，不是子选择器）
*   判断容器有没有一个小相邻的img，有的话设置字体颜色为 red

我们可以这么去实现：

```css
    .container:has(>img) {
    font-size: 12px;
}

    .container:has(+img) {
    color: red;
}
```

再来一个场景，当我 hover 到 子img 上时，我想要让 container 的字体变粗，可以这么去使用~

```css
    .container:has(>img:hover) {
    color: red;
}
```

### 兼容性

还是有一些浏览器不支持

![image.png](/images/jueJin/5e1b3c16f03249b.png)

结语 & 加学习群 & 摸鱼群
---------------

我是林三心

*   一个待过**小型toG型外包公司、大型外包公司、小公司、潜力型创业公司、大公司**的作死型前端选手；
*   一个偏前端的全干工程师；
*   一个不正经的掘金作者；
*   一个逗比的B站up主；
*   一个不帅的小红书博主；
*   一个喜欢打铁的篮球菜鸟；
*   一个喜欢历史的乏味少年；
*   一个喜欢rap的五音不全弱鸡

如果你想一起学习前端，一起摸鱼，一起研究简历优化，一起研究面试进步，一起交流历史音乐篮球rap，可以来俺的摸鱼学习群哈哈，点这个，有7000多名前端小伙伴在等着一起学习哦 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

![image.png](/images/jueJin/f4329c0999644b1.png)