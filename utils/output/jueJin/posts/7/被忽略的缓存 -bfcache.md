---
author: "政采云技术"
title: "被忽略的缓存 -bfcache"
date: 2023-10-19
description: "同一个项目同一个页面，部署在不同的环境中，浏览器回退时，有的环境不会重新请求页面的初始化接口，而有的环境却可以。"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:28,comments:0,collects:24,views:2480,"
---
![文章顶部.png](/images/jueJin/b637793da67b4e0.png)

![痞酱.png](/images/jueJin/46d8f7b4257d4f3.png) 之前遇到过一个问题，整体表现形态是分成以下 3 种情况：

0.  同一个项目同一个页面，部署在不同的环境中，浏览器回退时，有的环境不会重新请求页面的初始化接口，而有的环境却可以。
1.  同一个项目不同的页面，部署在同一个环境中的表现也不统一。
2.  同一个项目同一个页面部署同一个环境，在 Chrome 和 Safari 中的表现也不统一。

借着这个问题，去了解了下 bfcache 的相关内容

**1\. bfcache 是什么？**
--------------------

bfcache（[Back-Forward Cache](https://link.juejin.cn?target=https%3A%2F%2Fweb.dev%2Fbfcache%2F "https://web.dev/bfcache/")）是浏览器的一种机制，在 Safari 和 Chrome 中都得到了很好的支持 (笔者在测试最新的 Firefox 发现已经禁用了 bfcache)，它利用内存缓存来存储用户访问过的页面状态。当用户在浏览器中执行后退或前进操作时，浏览器可以从 bfcache 中快速加载页面，而不是重新请求服务器并重新渲染页面。这意味着用户可以瞬间回到之前访问的页面，无需等待页面重新加载。它不是 HTTP 意义上的“缓存”，不是“磁盘缓存”意义上的“缓存”，而是将解码资源保存在内存中，以便在多个网页之间共享。

**2\. bfcache 的工作原理**
---------------------

#### 页面的生命周期：

当用户尝试离开页面时，将会触发以下事件：

*   beforeunload：用户可能会被提示确认导航。如果用户拒绝提示，导航将被中止。如果用户接受提示，导航将继续进行。
*   visibilitychange（如果页面不是隐藏状态）：页面可见性发生变化。
*   pagehide：如果浏览器尝试将页面存储在 bfcache（后退/前进缓存）中，将触发此事件。否则，将触发 unload 事件。

在触发 freeze 事件后，页面将被冻结，直到从 bfcache 中恢复页面，将不会触发任何事件。如果在此期间与页面的文档关联的任务或 Promise 准备就绪，则它们将在页面从缓存中恢复后执行。

当页面位于缓存中时，浏览器随时可以决定将页面从缓存中清除，在这种情况下，页面将被销毁，而不会触发任何通知。

当再次导航到页面时，将触发以下事件：

*   resume：恢复事件，表示页面从冻结状态恢复。
*   pageshow：页面显示事件，表示页面从缓存中恢复并重新显示。
*   visibilitychange（如果导航发生在可见选项卡中）：页面可见性发生变化

#### 其中 bfcache 的工作又可以分成以下步骤：

0.  页面进入 bfcache：当用户从一个页面导航到另一个页面时，如果浏览器支持 bfcache 并且页面符合条件，浏览器会将当前页面的状态保存在 bfcache 中，这包括 DOM 树、样式表、JavaScript 状态等。
    
1.  缓存页面资源：除了保存页面的状态，浏览器还会将与页面相关的资源（如 JavaScript 文件、样式表、图像等）保存在内存中，以便在后续加载页面时可以快速访问这些资源，而无需重新请求服务器。
    
2.  从 bfcache 恢复页面：当用户执行后退或前进操作，导航回之前访问过的页面时，浏览器可以从 bfcache 中快速恢复保存的页面状态。这意味着浏览器不需要重新请求页面的资源或重新渲染页面，而是直接加载保存在内存中的页面状态，从而实现快速导航和无缝的页面切换。
    
3.  更新页面内容：如果页面在离开期间发生了变化，例如用户在其他标签页中进行了操作，浏览器会重新加载页面，并更新 bfcache 中的状态。这确保了页面的内容是最新的，以提供一致的用户体验。(需要注意的是，bfcache 的行为可能因不同浏览器而异，而且它通常受到浏览器性能和内存管理策略的影响有些浏览器可能会更主动地检查和更新 bfcache 中的页面内容，而其他浏览器可能会更谨慎，仅在需要时才更新)
    
    ##### 具体流程如下：
    

![37dff2d3-8dcc-4aec-b088-0d0cab13da67.png](/images/jueJin/b4a568108e34488.png) 随之而来的疑问：

1、我在离开页面时，页面 Javascript 任务没有完成，会如何处理？

2、如果我页面从缓存中恢复，还会执行 load 事件吗？

排除其他可能影响的因素，单纯通过`http-server`启动本地的 html 文件来验证下问题，因为页面要进入 bfcache，首要的前提是以 http/https 协议访问

首先安装：

```arduino
npm install http-server -g // 安装
​
http-server  -p8088 // 以 8088 启动
```

测试内容：

```xml
<!DOCTYPE html>
<head>
<title>测试bfcache</title>
</head>
​
<body>
<ul id="testParentDom">
<li>1</li>
</ul>
<button onclick="testClick()">按钮点击</button>
</body>
<script>
let i = 2;
    function testClick() {
    var p = document.createElement("li");
    p.innerHTML = i;
    i++;
    document.getElementById('testParentDom').append(p)
}
// 定时器修改 dom 结构
    setInterval(() => {
    var p = document.createElement("li");
    p.innerHTML = i;
    i++;
    document.getElementById('testParentDom').append(p)
    }, 1000)
        window.addEventListener('pageshow', function (event) {
            if (event.persisted) {
            console.log('This page was restored from the bfcache.');
                } else {
                console.log('This page was loaded normally.');
            }
            });
                window.addEventListener('load', function () {
                console.log('load')
                })
                </script>
                </html>
```

桌面应用测试结果：Chrome、Safari、Microsoft Edge 表现得一致，当从缓存出来的页面都不会执行 load 事件，对任务都是会先挂起，等页面从缓存中恢复继续执行

浏览器

版本

是否缓存 DOM

是否缓存文件

是否缓存 js 任务状态

是否执行 load 事件

Chrome

115.0.5790.170（正式版本） (arm64)

是

是

是

否

Safari

15.5 (17613.2.7.1.8)

是

是

是

否

Microsoft Edge

116.0.1938.76 (正式版本) (arm64)

是

是

是

否

**3、以下情况，有些浏览器不会尝试将页面放入 bfcache**
---------------------------------

*   页面有监听 [unload](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWindow%2Funload_event "https://developer.mozilla.org/zh-CN/docs/Web/API/Window/unload_event") 或者 [beforeunload](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWindow%2Fbeforeunload_event "https://developer.mozilla.org/zh-CN/docs/Web/API/Window/beforeunload_event") 事件
    
    可以使用 pagehide 事件来代替 unload 事件。pagehide 会在每次 unload 事件触发时被触发，并且在页面缓存到 bfcache 时也会触发。
    

```javascript
// 避免
    window.addEventListener("unload", function (event) {
    console.log("unload");
    });
    ​
    //可以使用
        window.addEventListener('pagehide', function(event) {
        console.log("pagehide");
        });
        ​
        // 尽量不使用
            window.addEventListener("beforeunload", (event) => {
                if(pageHasUnsavedChanges()) {
                event.preventDefault();
                event.returnValue = 'Are you sure you want to exit?';// 新版已经不支持自定义returnValue
            }
            });
            ​
            //条件添加，不需要时移除
                function beforeUnloadListener(event) {
                event.preventDefault();
                return event.returnValue = 'Are you sure you want to exit?';
                };
                    onPageHasUnsavedChanges(() => {
                    window.addEventListener('beforeunload', beforeUnloadListener);
                    });
                        onAllChangesSaved(() => {
                        window.removeEventListener('beforeunload', beforeUnloadListener);
                        });
```

*   使用以下 API 也会影响 bfcache
    
    1.[WebSocket](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fdocs%2FWeb%2FAPI%2FWebSocket "https://developer.mozilla.org/docs/Web/API/WebSocket")或[WebRTC](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fdocs%2FWeb%2FAPI%2FWebRTC_API "https://developer.mozilla.org/docs/Web/API/WebRTC_API") 连接的页面
    
    2.[IndexDB](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FIDBOpenDBRequest "https://developer.mozilla.org/zh-CN/docs/Web/API/IDBOpenDBRequest")链接的页面
    
    3.页面有正在进行的[fetch](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fdocs%2FWeb%2FAPI%2FFetch_API "https://developer.mozilla.org/docs/Web/API/Fetch_API")或[XMLHttpRequest](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fdocs%2FWeb%2FAPI%2FXMLHttpRequest "https://developer.mozilla.org/docs/Web/API/XMLHttpRequest")的事件
    

如果你的页面正在使用这些 API 中的其中一个，最好总是在页面`pagehide`或`freeze`事件期间关闭连接并删除或断开观察者的连接。这样浏览器就可以安全地缓存页面，而不会影响其他打开的选项卡。

*   主资源 http Request Headers 设置了 Cache-Control: no-store，对于希望始终提供最新内容且内容不包含敏感信息的页面，请使用 Cache-Control: no-cache 或 Cache-Control: max-age=0，这些指示浏览器在提供内容之前重新验证内容，它们不影响页面的 bfcache 资格，页面子资源 设置 no-store/no-cache 不影响页面使用 bfcache。
    
    设置不缓存启动
    

```arduino
http-server  -p8088 -c-1 //启动
```

html 资源设置 no-store：

![d834f0d3-088f-44a0-9f53-1bd7c70c247e.png](/images/jueJin/c0a054fed2ac4ac.png)

图片资源设置 no-store：

![ac99f940-ca99-4c3e-a390-1672b81c7a04.png](/images/jueJin/07b68565850d434.png)

在原来的基础上测试，只需要启动带上-c-1 参数，代表不缓存，可以看到请求 html 带上了 no-store，而只有 html 的 cache-control 影响了 bfcache，单纯设置图片资源的 cache-control 不会影响

*   避免用 [window.open](https://link.juejin.cn?target=http%3A%2F%2F%25E9%2581%25BF%25E5%2585%258D%25E9%2580%259A%25E8%25BF%2587window.open "http://%E9%81%BF%E5%85%8D%E9%80%9A%E8%BF%87window.open") 去打开需要 bfcache 的页面，通过 window.open 打开的页面以及自身都不符合命中 bfcache 的条件，具有非空[window.opener](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fdocs%2FWeb%2FAPI%2FWindow%2Fopener "https://developer.mozilla.org/docs/Web/API/Window/opener")引用的页面不能安全地放入 bfcache 中，因为这可能会破坏任何试图访问它的页面，尽可能使用[rel="noopener"](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FHTML%2FAttributes%2Frel%2Fnoopener "https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/noopener")\` 去打开

#### **4、命中 bfcache 的同时如何更新数据**

监听 pageshow/pagehide 事件，pageshow 事件在页面正常加载时以及从 bfcache 中恢复时被触发。pagehide 事件则在页面被卸载时浏览器将页面存入 bfcache 时被触发。

pagehide 事件同样有 persisted 属性，当属性值为 false 时可以确定页面并不会进入 bfcache 缓存。而当 persisted 属性的值为 true 时，并不能保证页面一定对被缓存。这意味着浏览器试图将页面缓存，但可能会由于一些因素导致无法进行缓存。

```javascript
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
        //处理敏感数据
    }
    });
        window.addEventListener('pagehide', (event) => {
            if (event.persisted) {
            //处理敏感数据
        }
        });
```

#### 5 **、检查页面 bfcache 的情况**

Chrome DevTools 有提供相关的面板可以方便查看页面的命中情况

![ccbae2e8-bcae-4131-aae5-8449f44aca68.png](/images/jueJin/2f9caaf8aab7417.png)

成功态：

![dce27b3d-d6fc-411e-a0c6-33017a4398bf.png](/images/jueJin/5ba89ea947b9477.png)

失败态：会直接提示页面的什么 api 影响了 bfcache 的资格：

![93568b58-0bb7-4bdf-b9d3-6c9c7c706644.png](/images/jueJin/75a7c67c88fd4ec.png)

###### 回归上述遇到的问题，可以分解为下面三点：

问题一：因为在配置每个环境页面的 Request Header 时，有些环境配置了 Cache-Control: no-store，有的环境没有，想要保持效果一致，那么配置Request Header保持一致。

问题二：不同的页面中，使用的 api 不一致，有的页面监听了 unload 事件。

问题三：浏览器的兼容性。

总结
--

浏览器的 bfcache 机制为开发人员提供了一种优化网站性能和用户体验的机会。通过了解 bfcache 的工作原理和如何正确利用它，我们可以充分发挥这一机制的优势，并提供更快速的页面加载体验。然而，我们也需要注意与 bfcache 相关的常见问题，并采取适当的措施来解决这些问题。通过合理的设计和优化，我们可以为用户提供更出色的浏览体验，并满足他们对快速响应的期望。

参考文献
----

[web.dev/bfcache/](https://link.juejin.cn?target=https%3A%2F%2Fweb.dev%2Fbfcache%2F "https://web.dev/bfcache/")

[docs.google.com/document/d/…](https://link.juejin.cn?target=https%3A%2F%2Fdocs.google.com%2Fdocument%2Fd%2F1JtDCN9A_1UBlDuwkjn1HWxdhQ1H2un9K4kyPLgBqJUc%2Fedit%23heading%3Dh.58d6ijfz2say "https://docs.google.com/document/d/1JtDCN9A_1UBlDuwkjn1HWxdhQ1H2un9K4kyPLgBqJUc/edit#heading=h.58d6ijfz2say")

[webkit.org/blog/516/we…](https://link.juejin.cn?target=https%3A%2F%2Fwebkit.org%2Fblog%2F516%2Fwebkit-page-cache-ii-the-unload-event%2F "https://webkit.org/blog/516/webkit-page-cache-ii-the-unload-event/")

推荐阅读
----

[新一代vue状态管理工具Pinia](https://juejin.cn/post/7290899075347775546 "https://juejin.cn/post/7290899075347775546")

[Cola-StateMachine状态机的实战使用](https://juejin.cn/post/7290727062145499175 "https://juejin.cn/post/7290727062145499175")

[Redisson杂谈](https://juejin.cn/post/7288607047573422140 "https://juejin.cn/post/7288607047573422140")

[react-grid-layout 之核心代码分析与实践](https://juejin.cn/post/7288229413036048442 "https://juejin.cn/post/7288229413036048442")

[@Transactional注解使用以及事务失效的场景](https://juejin.cn/post/7283348301252542521 "https://juejin.cn/post/7283348301252542521")

开源作品
----

*   政采云前端小报

**开源地址 [www.zoo.team/openweekly/](https://link.juejin.cn?target=http%3A%2F%2Fzoo.zhengcaiyun.cn%2F "http://zoo.zhengcaiyun.cn/")** (小报官网首页有微信交流群)

*   商品选择 sku 插件

**开源地址 [github.com/zcy-inc/sku…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fzcy-inc%2FskuPathFinder-back "https://github.com/zcy-inc/skuPathFinder-back")**

招贤纳士
----

政采云技术团队（Zero），Base 杭州，一个富有激情和技术匠心精神的成长型团队。规模 500 人左右，在日常业务开发之外，还分别在云原生、区块链、人工智能、低代码平台、中间件、大数据、物料体系、工程平台、性能体验、可视化等领域进行技术探索和实践，推动并落地了一系列的内部技术产品，持续探索技术的新边界。此外，团队还纷纷投身社区建设，目前已经是 google flutter、scikit-learn、Apache Dubbo、Apache Rocketmq、Apache Pulsar、CNCF Dapr、Apache DolphinScheduler、alibaba Seata 等众多优秀开源社区的贡献者。

如果你想改变一直被事折腾，希望开始折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊……如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的技术团队的成长过程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 [zcy-tc@cai-inc.com](https://link.juejin.cn?target=mailto%3Azcy-tc%40cai-inc.com "mailto:zcy-tc@cai-inc.com") ![底图-v3.png](/images/jueJin/63372e91db394c6.png)