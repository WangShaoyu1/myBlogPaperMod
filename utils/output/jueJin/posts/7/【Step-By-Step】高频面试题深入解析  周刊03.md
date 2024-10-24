---
author: "无名之苝"
title: "【Step-By-Step】高频面试题深入解析  周刊03"
date: 2019-06-10
description: "11 什么是XSS攻击，XSS攻击可以分为哪几类？我们如何防范XSS攻击？ 1 XSS攻击 XSS(Cross-Site Scripting，跨站脚本攻击)是一种代码注入攻击。攻击者在目标网站上注入恶意代码，当被攻击者登陆网站时就会执行这些恶意代码，这些脚本可以读取 coo…"
tags: ["JavaScript","面试中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读14分钟"
weight: 1
selfDefined:"likes:98,comments:0,collects:116,views:7707,"
---
> 本周面试题一览:

*   什么是XSS攻击，XSS 攻击可以分为哪几类？我们如何防范XSS攻击？
*   如何隐藏页面中的某个元素？
*   浏览器事件代理机制的原理是什么？
*   setTimeout 倒计时为什么会出现误差？

**更多优质文章可戳:** [github.com/YvetteLau/B…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYvetteLau%2FBlog "https://github.com/YvetteLau/Blog")

### 11\. 什么是XSS攻击，XSS攻击可以分为哪几类？我们如何防范XSS攻击？

#### 1\. XSS攻击

XSS(Cross-Site Scripting，跨站脚本攻击)是一种代码注入攻击。攻击者在目标网站上注入恶意代码，当被攻击者登陆网站时就会执行这些恶意代码，这些脚本可以读取 cookie，session tokens，或者其它敏感的网站信息，对用户进行钓鱼欺诈，甚至发起蠕虫攻击等。

XSS 的本质是：恶意代码未经过滤，与网站正常的代码混在一起；浏览器无法分辨哪些脚本是可信的，导致恶意脚本被执行。由于直接在用户的终端执行，恶意代码能够直接获取用户的信息，利用这些信息冒充用户向网站发起攻击者定义的请求。

#### XSS分类

根据攻击的来源，XSS攻击可以分为存储型(持久性)、反射型(非持久型)和DOM型三种。下面我们来详细了解一下这三种XSS攻击：

> #### 1.1 反射型XSS

当用户点击一个恶意链接，或者提交一个表单，或者进入一个恶意网站时，注入脚本进入被攻击者的网站。Web服务器将注入脚本，比如一个错误信息，搜索结果等，未进行过滤直接返回到用户的浏览器上。

> 反射型 XSS 的攻击步骤：

1.  攻击者构造出特殊的 `URL`，其中包含恶意代码。
2.  用户打开带有恶意代码的 `URL` 时，网站服务端将恶意代码从 `URL` 中取出，拼接在 HTML 中返回给浏览器。
3.  用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行。
4.  恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。

反射型 XSS 漏洞常见于通过 `URL` 传递参数的功能，如网站搜索、跳转等。由于需要用户主动打开恶意的 `URL` 才能生效，攻击者往往会结合多种手段诱导用户点击。

POST 的内容也可以触发反射型 XSS，只不过其触发条件比较苛刻（需要构造表单提交页面，并引导用户点击），所以非常少见。

如果不希望被前端拿到cookie，后端可以设置 `httpOnly` (不过这不是 `XSS攻击` 的解决方案，只能降低受损范围)

> 如何防范反射型XSS攻击

**对字符串进行编码。**

对url的查询参数进行转义后再输出到页面。

```
    app.get('/welcome', function(req, res) {
    //对查询参数进行编码，避免反射型 XSS攻击
    res.send(`${encodeURIComponent(req.query.type)}`);
    });
```

> #### 1.2 DOM 型 XSS

DOM 型 XSS 攻击，实际上就是前端 `JavaScript` 代码不够严谨，把不可信的内容插入到了页面。在使用 `.innerHTML`、`.outerHTML`、`.appendChild`、`document.write()`等API时要特别小心，不要把不可信的数据作为 HTML 插到页面上，尽量使用 `.innerText`、`.textContent`、`.setAttribute()` 等。

> DOM 型 XSS 的攻击步骤：

1.  攻击者构造出特殊数据，其中包含恶意代码。
2.  用户浏览器执行了恶意代码。
3.  恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。

> 如何防范 DOM 型 XSS 攻击

防范 DOM 型 XSS 攻击的核心就是对输入内容进行转义(DOM 中的内联事件监听器和链接跳转都能把字符串作为代码运行，需要对其内容进行检查)。

1.对于`url`链接(例如图片的`src`属性)，那么直接使用 `encodeURIComponent` 来转义。

2.非`url`，我们可以这样进行编码：

```
    function encodeHtml(str) {
    return str.replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
```

DOM 型 XSS 攻击中，取出和执行恶意代码由浏览器端完成，属于前端 JavaScript 自身的安全漏洞。

> #### 1.3 存储型XSS

恶意脚本永久存储在目标服务器上。当浏览器请求数据时，脚本从服务器传回并执行，影响范围比反射型和DOM型XSS更大。存储型XSS攻击的原因仍然是没有做好数据过滤：前端提交数据至服务端时，没有做好过滤；服务端在接受到数据时，在存储之前，没有做过滤；前端从服务端请求到数据，没有过滤输出。

> 存储型 XSS 的攻击步骤：

1.  攻击者将恶意代码提交到目标网站的数据库中。
2.  用户打开目标网站时，网站服务端将恶意代码从数据库取出，拼接在 HTML 中返回给浏览器。
3.  用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行。
4.  恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。

这种攻击常见于带有用户保存数据的网站功能，如论坛发帖、商品评论、用户私信等。

> 如何防范存储型XSS攻击：

1.  前端数据传递给服务器之前，先转义/过滤(防范不了抓包修改数据的情况)
2.  服务器接收到数据，在存储到数据库之前，进行转义/过滤
3.  前端接收到服务器传递过来的数据，在展示到页面前，先进行转义/过滤

**除了谨慎的转义，我们还需要其他一些手段来防范XSS攻击:**

**1.Content Security Policy**

在服务端使用 HTTP的 `Content-Security-Policy` 头部来指定策略，或者在前端设置 `meta` 标签。

例如下面的配置只允许加载同域下的资源：

```
Content-Security-Policy: default-src 'self'
``````
<meta http-equiv="Content-Security-Policy" content="form-action 'self';">
```

前端和服务端设置 CSP 的效果相同，但是`meta`无法使用`report`

严格的 CSP 在 XSS 的防范中可以起到以下的作用：

1.  禁止加载外域代码，防止复杂的攻击逻辑。
2.  禁止外域提交，网站被攻击后，用户的数据不会泄露到外域。
3.  禁止内联脚本执行（规则较严格，目前发现 GitHub 使用）。
4.  禁止未授权的脚本执行（新特性，Google Map 移动版在使用）。
5.  合理使用上报可以及时发现 XSS，利于尽快修复问题。

**2.输入内容长度控制**

对于不受信任的输入，都应该限定一个合理的长度。虽然无法完全防止 XSS 发生，但可以增加 XSS 攻击的难度。

**3.输入内容限制**

对于部分输入，可以限定不能包含特殊字符或者仅能输入数字等。

**4.其他安全措施**

*   HTTP-only Cookie: 禁止 JavaScript 读取某些敏感 Cookie，攻击者完成 XSS 注入后也无法窃取此 Cookie。
*   验证码：防止脚本冒充用户提交危险操作。

> [点击查看更多](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYvetteLau%2FStep-By-Step%2Fissues%2F18 "https://github.com/YvetteLau/Step-By-Step/issues/18")

### 12.如何隐藏页面中的某个元素？

#### 隐藏类型

屏幕并不是唯一的输出机制，比如说屏幕上看不见的元素（隐藏的元素），其中一些依然能够被读屏软件阅读出来（因为读屏软件依赖于可访问性树来阐述）。为了消除它们之间的歧义，我们将其归为三大类：

*   完全隐藏：元素从渲染树中消失，不占据空间。
*   视觉上的隐藏：屏幕中不可见，占据空间。
*   语义上的隐藏：读屏软件不可读，但正常占据空。

#### 完全隐藏

##### 1.`display` 属性(不占据空间)

```
display: none;
```

##### 2.hidden 属性 (不占据空间)

HTML5 新增属性，相当于 `display: none`

```
<div hidden>
</div>
```

#### 视觉上的隐藏

##### 1.利用 `position` 和 盒模型 将元素移出可视区范围

1.  设置 `posoition` 为 `absolute` 或 `fixed`，通过设置 `top`、`left` 等值，将其移出可视区域。(可视区域不占位)

```
position:absolute;
left: -99999px;
```

2.  设置 `position` 为 `relative`，通过设置 `top`、`left` 等值，将其移出可视区域。（可视区域占位）

```
position: relative;
left: -99999px;
```

如希望其在可视区域不占位置，需同时设置 `height: 0`;

3.  设置 margin 值，将其移出可视区域范围（可视区域占位）。

```
margin-left: -99999px;
```

如果希望其在可视区域不占位，需同时设置 `height: 0`;

##### 2.利用 transfrom

1.  缩放(占据空间)

```
transform: scale(0);
```

如果希望不占据空间，需同时设置 `height: 0`

2.  移动 `translateX`, `translateY`(占据空间)

```
transform: translateX(-99999px);
```

如果希望不占据空间，需同时设置 `height: 0`

3.  旋转 `rotate` (占据空间)

```
transform: rotateY(90deg);
```

##### 3.设置其大小为0

宽高为0，字体大小为0：

```
height: 0;
width: 0;
font-size: 0;
```

宽高为0，超出隐藏:

```
height: 0;
width: 0;
overflow: hidden;
```

##### 4.设置透明度为0 (占据空间)

```
opacity: 0;
```

##### 5.`visibility`属性 (占据空间)

```
visibility: hidden
```

##### 6.层级覆盖，`z-index` 属性 (占据空间)

```
position: relative;
z-index: -999;
```

再设置一个层级较高的元素覆盖在此元素上。

##### 7.clip-path 裁剪 (占据空间)

```
clip-path: polygon(0 0, 0 0, 0 0, 0 0);
```

#### 语义上的隐藏

##### aria-hidden 属性 (占据空间)

读屏软件不可读，占据空间，可见。

```
<div aria-hidden="true">
</div>
```

#### 11\. 使用JS将元素从页面中移除

> [点击查看更多](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYvetteLau%2FStep-By-Step%2Fissues%2F19 "https://github.com/YvetteLau/Step-By-Step/issues/19")

### 13.浏览器事件代理机制的原理是什么？

#### 事件流

在说浏览器事件代理机制原理之前，我们首先了解一下事件流的概念，早期浏览器，IE采用的是事件冒泡事件流，即事件开始时由最具体的元素（文档中嵌套层级最深的那个节点）接收，然后逐级向上传播到较为不具体的节点。而Netscape采用的则是事件捕获（即不太具体的节点应该最早接收到事件，而最具体的节点应该最后接收到事件）。"DOM2级事件"把事件流分为三个阶段，捕获阶段、目标阶段、冒泡阶段。现代浏览器也都遵循此规范。

![](/images/jueJin/16b3ce2474fcf21.png)

#### 事件代理机制的原理

事件代理又称为事件委托，在祖先级 DOM 元素绑定一个事件，当触发子孙级DOM元素的事件时，利用事件冒泡的原理来触发绑定在祖先级 DOM 的事件。因为事件会从目标元素一层层冒泡至 document 对象。

#### 为什么要事件代理？

1.  添加到页面上的事件数量会影响页面的运行性能，如果添加的事件过多，会导致网页的性能下降。采用事件代理的方式，可以大大减少注册事件的个数。
    
2.  事件代理的当时，某个子孙元素是动态增加的，不需要再次对其进行事件绑定。
    
3.  不用担心某个注册了事件的DOM元素被移除后，可能无法回收其事件处理程序，我们只要把事件处理程序委托给更高层级的元素，就可以避免此问题。
    
4.  允许给一个事件注册多个监听。
    
5.  提供了一种更精细的手段控制 `listener` 的触发阶段(可以选择捕获或者是冒泡)。
    
6.  对任何 `DOM` 元素都是有效的，而不仅仅是对 `HTML` 元素有效。
    

#### addEventListener

addEventListener 接受3个参数，分别是要处理的事件名、实现了 EventListener 接口的对象或者是一个函数、一个对象/一个布尔值。

```
target.addEventListener(type, listener[, options]);
target.addEventListener(type, listener[, useCapture]);
```

**options(对象) | 可选**

*   capture: `Boolean`。true 表示在捕获阶段触发，false表示在冒泡阶段触发。默认是 false。
    
*   once:`Boolean`。true 表示listener 在添加之后最多只调用一次，listener 会在其被调用之后自动移除。默认是 false。
    
*   passive: `Boolean`。true 表示 listener 永远不会调用 `preventDefault()`。如果 listener 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告。默认是 false。
    

**useCapture(Boolean) | 可选**

`useCapture` 默认为 false。表示冒泡阶段调用事件处理程序，若设置为 true，表示在捕获阶段调用事件处理程序。

> 如将页面中的所有click事件都代理到document上:

```
    document.addEventListener('click', function (e) {
    console.log(e.target);
    /**
    * 捕获阶段调用调用事件处理程序，eventPhase是 1;
    * 处于目标，eventPhase是2
    * 冒泡阶段调用事件处理程序，eventPhase是 3；
    */
    console.log(e.eventPhase);
    
    }, false);
```

与 `addEventListener` 相对应的是 `removeEventListener`,用于移除事件监听。

> [点击查看更多](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYvetteLau%2FStep-By-Step%2Fissues%2F20 "https://github.com/YvetteLau/Step-By-Step/issues/20")

### 14\. setTimeout 倒计时为什么会出现误差？

`setTimeout` 只能保证延时或间隔不小于设定的时间。因为它实际上只是将回调添加到了宏任务队列中，但是如果主线程上有任务还没有执行完成，它必须要等待。

如果你对前面这句话不是非常理解，那么有必要了解一下 JS的运行机制。

#### JS的运行机制

（1）所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）。

（2）主线程之外，还存在"任务队列"(task queue)。

（3）一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。

（4）主线程不断重复上面的第三步。

如 `setTimeout(()=>{callback();}, 1000)` ，即表示在1s之后将 `callback` 放到宏任务队列中，当1s的时间到达时，如果主线程上有其它任务在执行，那么 `callback` 就必须要等待，另外 `callback` 的执行也需要时间，因此 `setTimeout` 的时间间隔是有误差的，它只能保证延时不小于设置的时间。

#### 如何减少 `setTimeout` 的误差

我们只能减少执行多次的 `setTimeout` 的误差，例如倒计时功能。

倒计时的时间通常都是从服务端获取的。造成误差的原因：

1.没有考虑误差时间（函数执行的时间/其它代码的阻塞）

2.没有考虑浏览器的“休眠”

完全消除 `setTimeout`的误差是不可能的，但是我们减少 `setTimeout` 的误差。通过对下一次任务的调用时间进行修正，来减少误差。

```
let count = 0;
let countdown = 5000; //服务器返回的倒计时时间
let interval = 1000;
let startTime = new Date().getTime();
let timer = setTimeout(countDownStart, interval); //首次执行
//定时器测试
    function countDownStart() {
    count++;
    const offset = new Date().getTime() - (startTime + count * 1000);
    const nextInterval = interval - offset; //修正后的延时时间
        if (nextInterval < 0) {
        nextInterval = 0;
    }
    countdown -= interval;
    console.log("误差：" + offset + "ms，下一次执行：" + nextInterval + "ms后，离活动开始还有：" + countdown + "ms");
        if (countdown <= 0) {
        clearTimeout(timer);
            } else {
            timer = setTimeout(countDownStart, nextInterval);
        }
    }
    
```

如果当前页面是不可见的，那么倒计时会出现大于100ms的误差时间。因此在页面显示时，应该重新从服务端获取剩余时间进行倒计时。当然，为了更好的性能，当倒计时不可见(Tab页切换/倒计时内容不在可视区时)，可以选择停止倒计时。

为此，我们可以监听 `visibityChange` 事件进行处理。

> [点击查看更多](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYvetteLau%2FStep-By-Step%2Fissues%2F21 "https://github.com/YvetteLau/Step-By-Step/issues/21")

### 参考文章：

\[1\] [MDN addEventListener](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FEventTarget%2FaddEventListener "https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener")

\[2\] [www.ecma-international.org/ecma-262/6.…](https://link.juejin.cn?target=https%3A%2F%2Fwww.ecma-international.org%2Fecma-262%2F6.0%2F%23sec-completion-record-specification-type "https://www.ecma-international.org/ecma-262/6.0/#sec-completion-record-specification-type")

\[3\] [www.xuanfengge.com/js-realizes…](https://link.juejin.cn?target=http%3A%2F%2Fwww.xuanfengge.com%2Fjs-realizes-precise-countdown.html "http://www.xuanfengge.com/js-realizes-precise-countdown.html")

谢谢各位小伙伴愿意花费宝贵的时间阅读本文，如果本文给了您一点帮助或者是启发，请不要吝啬你的赞和Star，您的肯定是我前进的最大动力。[github.com/YvetteLau/B…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYvetteLau%2FBlog "https://github.com/YvetteLau/Blog")

### 关注公众号，加入技术交流群

![](/images/jueJin/16d1120a80282ab.png)