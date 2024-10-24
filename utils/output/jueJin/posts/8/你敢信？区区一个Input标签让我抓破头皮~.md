---
author: "Sunshine_Lin"
title: "你敢信？区区一个Input标签让我抓破头皮~"
date: 2022-04-17
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心 自动校验 事情是这样的，上个星期，接到了一个需求，要求去除掉项目中的输入框的自动拼写检查功能，也就是下"
tags: ["前端","JavaScript","React.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:79,comments:0,collects:82,views:6396,"
---
前言
--

大家好，我是林三心，**用最通俗易懂的话讲最难的知识点**是我的座右铭，**基础是进阶的前提**是我的初心

自动校验
----

> 注：以下**输入框**包含`input、textarea`

事情是这样的，上个星期，接到了一个需求，要求去除掉项目中的输入框的**自动拼写检查**功能，也就是下图出现的红线，这个检查是浏览器自带的

![](/images/jueJin/d3f5cd9e9079484.png)

解决方法
----

其实是有解决方法的，而且也不难，很简单，只需要在**输入框**标签上加上一个属性`spellcheck=false`即可，也就是：

```html
<input spellcheck=false />
<textarea spellcheck=false />

```

解决思路
----

但是问题来了，我需要给全局的**输入框**标签都加上才行，由于本项目是使用了antd-design这个组件库，那我们来看看整个项目都有哪些组件包含了**输入框**标签呢？

*   1、Input：包含input
*   2、Select：包含input
*   3、InputNumber：包含input
*   4、Textarea：包含textarea

多种解决方法
------

### 1、ConfigProvider

![](/images/jueJin/2f102de7b1bd4bd.png)

ant-design官方提供了一个组件，可以用来为全局的组件进行统一配置，这个组件可以传入一个`input`的参数，即可配置全局的**Input**标签

![](/images/jueJin/333f8a345b8c420.png)

也就是：

```html
<ConfigProvider
input={{spellCheck: false}}>
</ConfigProvider>
```

由于这个配置只针对全局的**Input**，所以结果都有哪些组件成功去掉了拼写校验功能呢：

*   1、Input：✅
*   2、Select：❌
*   3、InputNumber：❌
*   4、Textarea：❌

### 2、修改defaultProps

大概的思路就是，修改ant-design的源码中的**input**这一部分，给`Input、Textarea`这些组件加上一个defaultProps，这个defaultProps长这样：

```js
    const defaultProps = {
    spellCheck: false
}
```

所以具体实现为以下代码

```js
// Input
import Input from 'antd/es/input';

    Input.defaultProps = {
    ...Input.defaultProps,
    ...defaultProps,
    };
    
    export default Input
    
    
    // Textarea
    import TextArea from 'antd/es/input/TextArea';
    
        TextArea.defaultProps = {
        ...TextArea.defaultProps,
        ...defaultProps,
        };
        
        export default Textarea
```

结果就是，全局的**Input、Textarea**都去除了拼接检查了，但是**Select、InputNumber**却没有去除，因为他们是依赖了**RCSelect、RCInputNumber**这两个另外的组件，所以想改这两个，就得去改他们两依赖的组件，所以结果就是：

*   1、Input：✅
*   2、Select：❌
*   3、InputNumber：❌
*   4、Textarea：✅

### 3、拦截React.createElement

我们都知道在React中，只要涉及到**JSX**语法，最终在解析时都会通过**React.createElement**方法来创建标签

![](/images/jueJin/4aacd896ef9d474.png)

所以思路就是在最终调用**React.createElement**时，判断如果是`input、textarea`这两个类型的话，就给标签加上`spellCheck: false`这个属性，具体代码为

![](/images/jueJin/d392a7af9c7a4c0.png)

这样做的结果是：

*   1、Input：✅
*   2、Select：✅
*   3、InputNumber：✅
*   4、Textarea：✅

但是总是觉得直接涉及到React自带方法的修改，有点不太好。。

### 4、全局监听input事件

思路就是全局监听`input`这个事件，并在这个事件里去给触发事件的DOM节点增加**spellCheck: false**，具体代码为：

![](/images/jueJin/51a1013278ca4e8.png)

这样做的结果是：

*   1、Input：✅
*   2、Select：✅
*   3、InputNumber：✅
*   4、Textarea：✅

### 5、MutationObserver

兼容性比较差，所以不考虑了吧~~~

![](/images/jueJin/9b01afeecf9c4a8.png)

结语
--

我是林三心，一个热心的前端菜鸟程序员。如果你上进，喜欢前端，想学习前端，那咱们可以交朋友，一起摸鱼哈哈，摸鱼群，点这个 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

![image.png](/images/jueJin/643eeecf2b0d4a3.png)