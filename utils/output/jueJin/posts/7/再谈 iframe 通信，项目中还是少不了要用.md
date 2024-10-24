---
author: "Gaby"
title: "再谈 iframe 通信，项目中还是少不了要用"
date: 2022-06-02
description: "再实际项目中，或多或少都能涉及到多个系统之间的通信，或者相互嵌套的情况，当系统并没有升级到微前端的高度的时候，iframe 则成了首选，而会 iframe 嵌套间的通信也成了必备技能之一！"
tags: ["JavaScript","面试","架构中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:10,comments:0,collects:16,views:2255,"
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第6天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

废话只说一句：码字不易求个👍，收藏 === 学会,快行动起来吧！🙇‍🙇‍🙇‍。

再实际项目中，或多或少都能涉及到多个系统之间的通信，或者相互嵌套的情况，当系统并没有升级到微前端的高度的时候，iframe 则成了首选，而会 iframe 嵌套间的通信也成了必备技能之一！不必全都熟练，但需要用到的时候得能想到解决方案，并能够根据需求进行封装成适合项目的方法。

通信方式及实例，逐步完善优化中...

通过 messenger.js
---------------

在需要通信的父窗体、和子窗体的文档中，都需要引入MessengerJS。

父窗体和子窗体各自的文档（document）中，都需要自己的Messenger与其他文档通信，父窗体和子窗体的window对象都对应着有且仅有一个Messenger对象，该Messenger对象会负责当前window的所有通信任务。因此，每个Messenger对象都需要唯一的名字，这样它们之间才可以知道是在跟谁通信。另外，MessengerJS方案推荐指定项目名称，（类似命名空间的作用），以增强代码健壮性与组件复用性，避免未来与其他项目冲突。(注意: 项目名称应使用字符串类型)

父窗体与子窗体初始化Messenger对象：

```js
import Messenger from '@/utils/messenger.js';

// 父窗口中 - 初始化Messenger对象
// 推荐指定项目名称, 避免Mashup类应用中, 多个开发商之间的冲突
var messenger = new Messenger('Parent', 'projectName');

// iframe中 - 初始化Messenger对象
// 注意! Messenger之间必须保持项目名称一致, 否则无法匹配通信
var messenger = new Messenger('iframe1', 'projectName');

// 多个iframe, 使用不同的名字
var messenger = new Messenger('iframe2', 'projectName');
```

在发现消息前，目标文档要确保已经监听了消息事件：

```js
    messenger.listen(function(msg){
    alert("收到消息: " + msg);
    });
```

发消息时，要指定messenger的名字和消息，例如父窗体要给子窗体发消息：

```js
// 父窗口中 - 向单个iframe发消息
messenger.targets['iframe1'].send(msg1);
messenger.targets['iframe2'].send(msg2);
// 父窗口中 - 向所有目标iframe广播消息
messenger.send(msg);
```

postmessage
-----------

window.postMessage方法可以安全地实现跨源通信，写明目标窗口的协议、主机地址或端口就可以发信息给它。这种是最简单的方式。

```js
// A 页面
    window.addEventListener("message", function( event ) {
    if (event.origin !== 'http://b.demo.com') return;
    toggleFullScreen()
    });
    
    // B 页面
    parent.postMessage(
    value,
    "http://a.demo.com"
    );
```

为了安全，收到信息后要检测下event.origin判断是否要收信息的窗口发过来的。

domain
------

document.domain作用是获取/设置当前文档的原始域部分，同源策略会判断两个文档的原始域是否相同来判断是否跨域。这意味着只要把这个值设置成一样就可以解决跨域问题了。

在此我将domain设置为一级域名的值，A 页面 url 为 a.xxx.com，A 页面中 iframe 引用的 B 页面 url 为 b.xxx.com，具体设置为

```js
document.domain = 'xxx.com'
```

设置完之后，在a页面的window上挂载使iframe全屏的方法

```js
// A页面
    window.toggleFullScreen = () => {
    // do something
}
```

在 B 页面上可以直接获取到 A 页面的window对象并直接调用

```js
// b页面
window.parent.toggleFullScreen()
```

但是这个值的设置也有一定限制，只能设置为当前文档的上一级域或者是跟该文档的URL的domain一致的值。如url为a.demo.com，那domain就只能设置为demo.com或者a.demo.com。因此，设置domain的方法只能用于解决主域相同而子域不同的情况。所以这种情况下在使用上还是有限制的，并不能适用于当下的项目需求。