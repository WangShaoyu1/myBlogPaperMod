---
author: "徐小夕"
title: "《前端实战总结》之使用postMessage实现可插拔的跨域聊天机器人"
date: 2019-11-08
description: "由于笔者之前的项目中接触过聊天机器人的项目，主要实现机器人客服模块，以及支持跨多平台使用的目的，所以特地总结一下，希望有所收获。 1 跨域技术常用方案介绍 首先要强调的是跨域的安全限制都是对浏览器端来说的，服务器端是不存在跨域安全限制的。我们常用的跨域技术主要有如下几种： J…"
tags: ["JavaScript","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:143,comments:0,collects:179,views:10908,"
---
![](/images/jueJin/16e41be48fa28dd.png)

由于笔者之前的项目中接触过聊天机器人的项目，主要实现机器人客服模块，以及支持跨多平台使用的目的，所以特地总结一下，希望有所收获。

### 你将学到

*   跨域技术常用方案介绍
*   postMessage实现跨域通信
*   如何实现聊天机器人
*   node搭建本地服务器来实现渲染页面和跨域
*   回答语料库设计思路

### 效果预览

![](/images/jueJin/16e467b1a5b2709.png)

### 正文

#### 1\. 跨域技术常用方案介绍

首先要强调的是跨域的安全限制都是对浏览器端来说的，服务器端是不存在跨域安全限制的。我们常用的跨域技术主要有如下几种：

*   JSONP跨域
*   iframe+domain跨域
*   nginx反向代理跨域
*   cors跨域
*   postMessage跨域

**JSONP实现跨域**请求的原理就是动态创建script标签，然后利用script的src 不受同源策略约束来跨域获取数据。JSONP 主要由回调函数和数据两部分组成。回调函数的名字一般是在请求中指定的。而数据就是传入回调函数中的 JSON 数据。我们一般可以在全局定义一个回调函数，然后在script标签里传入回调函数即可：

```
    window.handleData = function(data){
    // ...
}
let script = document.createElement("script");
script.src = "https://xxxx.com/v0/search?q=xuxi&callback=handleData";
document.body.insertBefore(script, document.body.firstChild);
```

这样我们就能在回调函数handleData中拿到服务器接口返回的数据了。

虽然jsonp实现跨域方式很简单，但是只支持get请求，对传输的数据量有一定限制。**cors跨域**是目前我们用的比较多的本地调试方式，原理就是在服务端设置响应头header的Access-Control-Allow-Origin字段，这样浏览器检测到header中的Access-Control-Allow-Origin，这样就可以跨域了。

至于我们设置了cors之后在network中出现了两次请求的问题，其实涉及到cors跨域的**请求预检**，分为简单请求和非简单请求两种，这块知识可以单独抽离出一篇文章，感兴趣的可以自己学习了解一下。

#### 2\. postMessage实现跨域通信

> window.postMessage() 方法可以安全地实现跨源通信。通常，对于两个不同页面的脚本，只有当执行它们的页面位于具有相同的协议，端口号以及主机 (两个页面的模数 Document.domain设置为相同的值) 时，这两个脚本才能相互通信。window.postMessage() 方法提供了一种受控机制来规避此限制，只要正确的使用，这种方法就很安全。

本质上说postMessage()是基于消息事件机制来实现跨域通信，它隶属于消息窗体本身，比如window以及window内嵌的frame的window，基本使用形式如下：

```
someWindow.postMessage(message, targetOrigin, [transfer]);
```

参数介绍：

*   **someWindow** 窗口的一个引用，比如iframe的contentWindow属性、执行window.open返回的窗口对象、或者是命名过或数值索引的window.frames
*   **message** 将要发送到其他 window的数据。意味着你可以不受什么限制的将数据对象安全的传送给目标窗口而无需自己序列化
*   **targetOrigin** 通过窗口的origin属性来指定哪些窗口能接收到消息事件，其值可以是字符串"\*"（表示无限制）。不提供确切的目标将导致数据泄露等安全问题
*   **transfer** 是一串和message 同时传递的 Transferable 对象. 这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权

我们可以通过如下方式来监听message：

```
window.addEventListener("message", receiveMessage, false);

    function receiveMessage(event){
    let origin = event.origin || event.originalEvent.origin;
    if (origin !== "http://aaa:8080")
    return;
    
    // ...
    console.log(event.data)
}

// 派发消息的页面
winB.postMessage(_({text: '休息休息'}), origin)
```

我们的event里有如下几个核心的属性：

*   **data** 从其他 window 中传递过来的对象
*   **origin** 调用 postMessage 时消息发送方窗口的 origin . 这个字符串由 协议、“://“、域名、“ : 端口号”拼接而成
*   **source** 对发送消息的窗口对象的引用; 您可以使用此来在具有不同origin的两个窗口之间建立双向通信

#### 3\. 实现聊天机器人

在熟悉以上知识点之后，我们开始来写我们聊天机器人的demo。 首先我们写两个html，分别为a.html和b.html，然后用node分别代理两个不同页面，设置不同端口：

```
// a.js
//依赖一个http模块，相当于java中的import，与C#中的using
var http = require('http');
var fs = require('fs');
var { resolve } = require('path');

//创建一个服务器对象
    server = http.createServer(function (req, res) {
    //设置请求成功时响应头部的MIME为纯文本
    res.writeHeader(200, {"Content-Type": "text/html"});
    //向客户端输出字符
    let data = fs.readFileSync(resolve(__dirname, './a.html'))
    res.end(data);
    });
    //让服务器监听本地8000端口开始运行
    server.listen(8000,'127.0.0.1');
    console.log('http://127.0.0.1:8000')
    
    // b.js
    // ...
    server.listen(8001,'127.0.0.1');
```

由上可知我们a.html代理在8000端口下，b.html代理在8001端口下，由浏览器的同源策略可知他们存在跨域问题。

跨域实现之后我们可以开始搭建页面层级了，我们这里将b页面以iframe的形式嵌入到a页面，具体结构如下：

![](/images/jueJin/16e46b8f166ba25.png)

这样我们就可以愉快的搭建postMessage体系了。

首先我们在a页面通过发送按钮和输入框将消息发送给b页面，大致结构如下：

```
<body>
<div class="wrap">
<iframe src="http://127.0.0.1:8001" frameborder="0" id="b"></iframe>
<div class="control">
<input type="text" placeholder="请输入内容" id="ipt">
<span id="send">发送</span>
</div>
</div>
<script>
    window.onload = function() {
    let origin = 'http://127.0.0.1:8001';
    let _ = (data) => JSON.stringify(data);
    let winB = document.querySelector('#b').contentWindow;
    let sendBtn = document.querySelector('#send');
        sendBtn.addEventListener('click', (e) => {
        let text = document.querySelector('#ipt');
        winB.postMessage(_({text: text.value}), origin)
        text.value = '';
        }, false)
        winB.postMessage(_({text: ''}), origin)
    }
    </script>
    </body>
```

我们可以通过iframe的contentWindow来拿到b页面窗体的引用，然后在发送按钮的点击事件中触发postMessage将数据发送给B。B页面结构如下：

```
<body>
<div class="content">
<h4>Lab智能机器人</h4>
<div class="content-inner"></div>
</div>
<script>
// 语料库
const pool = [];
window.addEventListener("message", receiveMessage, false);
let content = document.querySelector('.content-inner');
let initContentH = content.scrollHeight;
let _ = (data) => JSON.stringify(data);
    function createChat(type, mes) {
    let dialog = document.createElement('div');
    dialog.className = type === 0 ? 'dialog robot' : 'dialog user';
    let content =  type === 0 ? `
    <span class="tx">${type === 0 ? 'lab' : 'user'}</span>
    <span class="mes">${mes}</span>
    ` : `
    <span class="mes">${mes}</span>
    <span class="tx">${type === 0 ? 'lab' : 'user'}</span>
    `;
    dialog.innerHTML = content;
    return dialog
}

    function scrollTop(el, h) {
        if(el.scrollHeight !== h) {
        el.scrollTop = h + 100;
    }
}

    function receiveMessage(event){
    // 兼容其他浏览器
    let origin = event.origin || event.originalEvent.origin;
        if(origin === 'http://127.0.0.1:8000') {
        let data = JSON.parse(event.data);
            if(data && !data.text) {
            mes = { text: '你好，我是机器人Lab，请问有什么可以帮到您的吗？' };
            event.source.postMessage(_(mes), event.origin)
            content.appendChild(createChat(0, mes.text))
            
                }else {
                content.appendChild(createChat(1, data.text))
                scrollTop(content, initContentH)
                
                    setTimeout(() => {
                    
                    content.appendChild(createChat(0, '正在解决'))
                    scrollTop(content, initContentH)
                    }, 2000);
                }
            }
        }
        </script>
        </body>
```

我们在b页面中去解析a页面的数据并做出相应的回答。这样，我们的基本聊天机器人就实现了。

#### 4\. 回答语料库设计思路

至于当我们在a页面发送了一个消息，b页面如何解析并回答，可以有如下几种思路：

*   通过后端接口实现，即我们可以将a的数据作为参数传递给某个后端接口，让后端来实现返回需要的数据，这种在AI机器人中应用的很广泛。
*   纯前端实现。前端定义回答的语料库，通过关键词匹配来拿到实现应答，这种一般用于普通的预设问题的回答。

#### 5.实现可插拔式

可插拔式就是一个页面可以放在不同平台使用。这种我们可以设置origin白名单，只需要将b页面封装，其他系统可以使用类于a页面的方式，只提供发送信息的接口，这样我们就可以在不同平使用了。

![](/images/jueJin/16e46c8bfe0d95e.png)

关于本聊天程序的所有代码我已经提交到**GitHub**，感兴趣的朋友可以下载体验一下，或者基于他实现更智能的聊机器人。

### 最后

如果想了解更多webpack，node，gulp，css3，javascript，nodeJS，canvas等前端知识和实战，欢迎在公众号《趣谈前端》加入我们一起学习讨论，共同探索前端的边界。

![](/images/jueJin/16ba43b87c51361.png)

### 更多推荐

*   [《前端实战总结》之变量提升，函数声明提升及变量作用域详解](https://juejin.cn/post/6844903985695080455 "https://juejin.cn/post/6844903985695080455")
*   [《前端实战总结》如何在不刷新页面的情况下改变URL](https://juejin.cn/post/6844903984222699527 "https://juejin.cn/post/6844903984222699527")
*   [前端组件/库打包利器rollup使用与配置实战](https://juejin.cn/post/6844903970469576718 "https://juejin.cn/post/6844903970469576718")
*   [一张图教你快速玩转vue-cli3](https://juejin.cn/post/6844903877133729799 "https://juejin.cn/post/6844903877133729799")
*   [vue高级进阶系列——用typescript玩转vue和vuex](https://juejin.cn/post/6844903831956897806 "https://juejin.cn/post/6844903831956897806")
*   [快速掌握es6+新特性及es6核心语法盘点](https://juejin.cn/post/6844903952761225230 "https://juejin.cn/post/6844903952761225230")
*   [基于nodeJS从0到1实现一个CMS全栈项目（上）](https://juejin.cn/post/6844903952761225230 "https://juejin.cn/post/6844903952761225230")
*   [基于nodeJS从0到1实现一个CMS全栈项目（中）](https://juejin.im/editor/posts/5d8c7b66518825761b4c1e04 "https://juejin.im/editor/posts/5d8c7b66518825761b4c1e04")
*   [基于nodeJS从0到1实现一个CMS全栈项目（下）](https://juejin.cn/post/6844903955797901319 "https://juejin.cn/post/6844903955797901319")
*   [基于nodeJS从0到1实现一个CMS全栈项目的服务端启动细节](https://juejin.cn/post/6844903955143786510 "https://juejin.cn/post/6844903955143786510")
*   [使用Angular8和百度地图api开发《旅游清单》](https://juejin.cn/post/6844903873212055560 "https://juejin.cn/post/6844903873212055560")
*   [《javascript高级程序设计》核心知识总结](https://juejin.cn/post/6844903953671389191 "https://juejin.cn/post/6844903953671389191")
*   [用css3实现惊艳面试官的背景即背景动画（高级附源码）](https://juejin.cn/post/6844903950123188237 "https://juejin.cn/post/6844903950123188237")
*   [5分钟教你用nodeJS手写一个mock数据服务器](https://juejin.cn/post/6844903937330380814 "https://juejin.cn/post/6844903937330380814")
*   [教你用200行代码写一个爱豆拼拼乐H5小游戏（附源码）](https://juejin.cn/post/6844903893961293831 "https://juejin.cn/post/6844903893961293831")