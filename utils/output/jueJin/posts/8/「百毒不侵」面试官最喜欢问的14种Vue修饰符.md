---
author: "Sunshine_Lin"
title: "「百毒不侵」面试官最喜欢问的14种Vue修饰符"
date: 2021-07-06
description: "前言 大家好，我是林三心，众所周知，修饰符也是Vue的重要组成成分之一，利用好修饰符可以大大地提高开发的效率，接下来给大家介绍一下面试官最喜欢问的13种Vue修饰符 1lazy lazy修饰符作用是"
tags: ["面试","Vue.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:589,comments:0,collects:942,views:28688,"
---
「本文已参与好文召集令活动，点击查看：[后端、大前端双赛道投稿，2万元奖池等你挑战！](https://juejin.cn/post/6978685539985653767 "https://juejin.cn/post/6978685539985653767")」

前言
--

大家好，我是林三心，众所周知，`修饰符`也是Vue的重要组成成分之一，利用好`修饰符`可以大大地提高开发的效率，接下来给大家介绍一下`面试官最喜欢问的13种Vue修饰符`

![image.png](/images/jueJin/b0eac9340c824f5.png)

1.lazy
------

`lazy`修饰符作用是，改变输入框的值时value不会改变，当光标离开输入框时，`v-model`绑定的值value才会改变

```js
<input type="text" v-model.lazy="value">
<div>{{value}}</div>

    data() {
        return {
        value: '222'
    }
}
```

![lazy1.gif](/images/jueJin/746b22195638467.png)

2.trim
------

`trim`修饰符的作用类似于JavaScript中的`trim()`方法，作用是把`v-model`绑定的值的首尾空格给过滤掉。

```js
<input type="text" v-model.trim="value">
<div>{{value}}</div>

    data() {
        return {
        value: '222'
    }
}
```

![number.gif](/images/jueJin/7416025f0331406.png)

3.number
--------

`number`修饰符的作用是将值转成数字，但是先输入字符串和先输入数字，是两种情况

```js
<input type="text" v-model.number="value">
<div>{{value}}</div>

    data() {
        return {
        value: '222'
    }
}
```

> 先输入数字的话，只取前面数字部分 ![trim.gif](/images/jueJin/322016b98d2c49f.png)

> 先输入字母的话，`number`修饰符无效

![number2.gif](/images/jueJin/c3ae0a87592447d.png)

4.stop
------

`stop`修饰符的作用是阻止冒泡

```js
<div @click="clickEvent(2)" style="width:300px;height:100px;background:red">
<button @click.stop="clickEvent(1)">点击</button>
</div>

    methods: {
        clickEvent(num) {
        不加 stop 点击按钮输出 1 2
        加了 stop 点击按钮输出 1
        console.log(num)
    }
}
```

5.capture
---------

事件默认是由里往外`冒泡`，`capture`修饰符的作用是反过来，由外网内`捕获`

```js
<div @click.capture="clickEvent(2)" style="width:300px;height:100px;background:red">
<button @click="clickEvent(1)">点击</button>
</div>

    methods: {
        clickEvent(num) {
        不加 capture 点击按钮输出 1 2
        加了 capture 点击按钮输出 2 1
        console.log(num)
    }
}
```

6.self
------

`self`修饰符作用是，只有点击事件绑定的本身才会触发事件

```js
<div @click.self="clickEvent(2)" style="width:300px;height:100px;background:red">
<button @click="clickEvent(1)">点击</button>
</div>

    methods: {
        clickEvent(num) {
        不加 self 点击按钮输出 1 2
        加了 self 点击按钮输出 1 点击div才会输出 2
        console.log(num)
    }
}
```

7.once
------

`once`修饰符的作用是，事件只执行一次

```js
<div @click.once="clickEvent(2)" style="width:300px;height:100px;background:red">
<button @click="clickEvent(1)">点击</button>
</div>

    methods: {
        clickEvent(num) {
        不加 once 多次点击按钮输出 1
        加了 once 多次点击按钮只会输出一次 1
        console.log(num)
    }
}
```

8.prevent
---------

`prevent`修饰符的作用是阻止默认事件（例如a标签的跳转）

```js
<a href="#" @click.prevent="clickEvent(1)">点我</a>

    methods: {
        clickEvent(num) {
        不加 prevent 点击a标签 先跳转然后输出 1
        加了 prevent 点击a标签 不会跳转只会输出 1
        console.log(num)
    }
}
```

9.native
--------

`native`修饰符是加在自定义组件的事件上，保证事件能执行

```js
执行不了
<My-component @click="shout(3)"></My-component>

可以执行
<My-component @click.native="shout(3)"></My-component>
```

10.left，right，middle
--------------------

这三个修饰符是鼠标的左中右按键触发的事件

```js
<button @click.middle="clickEvent(1)"  @click.left="clickEvent(2)"  @click.right="clickEvent(3)">点我</button>

    methods: {
    点击中键输出1
    点击左键输出2
    点击右键输出3
        clickEvent(num) {
        console.log(num)
    }
}
```

11.passive
----------

当我们在监听元素滚动事件的时候，会一直触发onscroll事件，在pc端是没啥问题的，但是在移动端，会让我们的网页变卡，因此我们使用这个修饰符的时候，相当于给onscroll事件整了一个.lazy修饰符

```js
<div @scroll.passive="onScroll">...</div>
```

12.camel
--------

```js
不加camel viewBox会被识别成viewbox
<svg :viewBox="viewBox"></svg>

加了canmel viewBox才会被识别成viewBox
<svg :viewBox.camel="viewBox"></svg>
```

13.sync
-------

当`父组件`传值进`子组件`，子组件想要改变这个值时，可以这么做

```js
父组件里
<children :foo="bar" @update:foo="val => bar = val"></children>

子组件里
this.$emit('update:foo', newValue)
```

`sync`修饰符的作用就是，可以简写：

```js
父组件里
<children :foo.sync="bar"></children>

子组件里
this.$emit('update:foo', newValue)
```

14.keyCode
----------

当我们这么写事件的时候，无论按什么按钮都会触发事件

```js
<input type="text" @keyup="shout(4)">
```

那么想要限制成某个按键触发怎么办？这时候`keyCode`修饰符就派上用场了

```js
<input type="text" @keyup.keyCode="shout(4)">
```

Vue提供的keyCode：

```js
//普通键
.enter
.tab
.delete //(捕获“删除”和“退格”键)
.space
.esc
.up
.down
.left
.right
//系统修饰键
.ctrl
.alt
.meta
.shift
```

例如（具体的键码请看[键码对应表](https://link.juejin.cn?target=https%3A%2F%2Fzhidao.baidu.com%2Fquestion%2F266291349.html "https://zhidao.baidu.com/question/266291349.html")）

```js
按 ctrl 才会触发
<input type="text" @keyup.ctrl="shout(4)">

也可以鼠标事件+按键
<input type="text" @mousedown.ctrl.="shout(4)">

可以多按键触发 例如 ctrl + 67
<input type="text" @keyup.ctrl.67="shout(4)">
```

结语
--

我的专栏已更新：

*   [Vue源码解析](https://juejin.cn/column/6969563635194527758 "https://juejin.cn/column/6969563635194527758")
*   [leetcode题目解析](https://juejin.cn/column/6979408694786129928 "https://juejin.cn/column/6979408694786129928")
*   [Element源码解析](https://juejin.cn/column/6979408526711980069 "https://juejin.cn/column/6979408526711980069")
*   [面试——百毒不侵](https://juejin.cn/column/6979410414513700878 "https://juejin.cn/column/6979410414513700878")

> 如果你觉得此文对你有一丁点帮助，点个赞，鼓励一下林三心哈哈。或者加入我的群哈哈，咱们一起摸鱼一起学习 : meron857287645