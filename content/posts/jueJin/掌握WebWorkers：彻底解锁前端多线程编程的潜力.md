---
author: "tager"
title: "掌握WebWorkers：彻底解锁前端多线程编程的潜力"
date: 2024-04-23
description: "序言在实际项目开发中WebWorkers虽然很少用，但确实很有用（在某些场景下）。JavaScript单线程的特性意味着所有任务都在同一个线程上按顺序执行，复杂的计算可能会导致界面卡顿，影响体验"
tags: ["前端","JavaScript","性能优化"]
ShowReadingTime: "阅读5分钟"
weight: 615
---
序言
--

在实际项目开发中`web Workers`**虽然很少用，但确实很有用**（在某些场景下）。

`JavaScript`单线程的特性意味着所有任务都在同一个线程上按顺序执行，复杂的计算或大量的数据处理可能会导致界面卡顿，影响用户体验。

然而，`Web Workers`的出现彻底改变了这一局面，它允许我们在后台线程中运行脚本，避免阻塞主线程，从而提升了应用的性能和响应能力。

背景
--

在近期的项目开发实践中，我们遇到了浏览器性能瓶颈及其节能机制的严格限制等相对较棘手的问题。幸运的是，借助Web Worker这些问题都得到了有效的解决。接下来将详细分享Web Worker在这些场景中的应用及其示例，希望能为你带来启发和帮助。 ![worker2.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5252d5a64c049feb5f2b902b2767a70~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1040&h=384&s=58513&e=png&b=dcf4ff)

应用场景及示例
-------

### 《简单示例：在worker中计算两个数的和》

> **创建myWorker.js文件**

javascript

 代码解读

复制代码

`// Web Workers的部分代码（在Workers中计算两个数的和） self.onmessage = function(e) {   console.log('Message received from main script');   const result = e.data[0] + e.data[1]; // 假设我们的任务是计算两个数的和   // 将结果发送回主线程   self.postMessage(result);   console.log('Posting message back to main script'); }`

接收到的参数都挂载到了`e.data`中，无论数组或对象（主线程同理）。然后在`workers`中计算后将结果返回到主线程中使用。

> **在主线程使用**

js

 代码解读

复制代码

``<script>     if (window.Worker) {         // 创建Web Worker实例         const myWorker = new Worker('myWorker.js');         // 要计算的两个数字         const num1 = 10;         const num2 = 20;         // 监听来自Worker的消息         myWorker.onmessage = function(e) {             alert(`The sum is: ${e.data}`);         };         // 向Worker发送消息（即两个数字）         myWorker.postMessage([num1, num2]);     } else {         console.log('Your browser does not support Web Workers.');     } </script>``

该简单示例通过在后台线程执行计算任务，从而避免阻塞主线程，确保页面的响应性。

### 《简单示例：在Workers中编译scss》

> **创建myWorker.js文件（** [**sass.js源文件**](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmedialize%2Fsass.js%2Fblob%2F71d9bed2cad10969efda9905aa1bddacc480f372%2Fdist%2Fsass.worker.js "https://github.com/medialize/sass.js/blob/71d9bed2cad10969efda9905aa1bddacc480f372/dist/sass.worker.js") **）**

js

 代码解读

复制代码

`// 引入sass.js - 可以将sass.js下载到本地或上传到自己的CDN importScripts('./sass.js'); self.onmessage = function(e) {   // e.data 是从主线程接收到的SCSS代码   const scss = e.data;   // 使用sass.js编译SCSS   const SassCompile = Sass.compile || Sass.prototype.compile   SassCompile(scss, function(result) {     if (result.status === 0) {       // 编译成功，发送编译后的CSS       self.postMessage(result.text);     } else {       // 编译失败，发送错误消息       self.postMessage({ error: result.message });     }   }); }`

在`React`组件中，你可以创建一个`Web Workers`实例，发送`SCSS`代码到`Workers`，并在主线程监听来自`Workers`的编译结果。

tsx

 代码解读

复制代码

``import React, { useState, useEffect } from 'react'; import styles from "./index.module.scss"; const ScssCompiler = () => {   const [css, setCss] = useState('');   const [error, setError] = useState('');   const [scss, setScss] = useState('body { h1 { color: red; } }'); // 示例SCSS代码   useEffect(() => {     const worker = new Worker('./myWorker.js');     worker.onmessage = function(e) {       if (e.data.error) {         setError(e.data.error);       } else {         setCss(e.data);         setError('');       }     };     worker.onerror = function(e) {       setError(`Worker error: ${e.message}`);     };     // 发送SCSS代码到Worker     worker.postMessage(scss);     return () => worker.terminate(); // 组件卸载时终止Worker   }, [scss]);   return (     <div className={styles.worker}>       <textarea         value={scss}         onChange={(e) => setScss(e.target.value)}         placeholder="Enter SCSS here"       />       <div className={styles.content}>         <div>编译结果：</div>         <div>{error ? <pre>编译中...</pre> : <pre>{css}</pre>}</div>       </div>     </div>   ); }; export default ScssCompiler;``

**编译效果展示：**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/880cf2bb76ba46b0a19b1905851670de~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1620&h=562&s=913070&e=gif&f=114&b=fcfcfc)

在这个组件中，我们在useEffect钩子用于创建Web Worker实例，发送SCSS代码到Worker中进行编译，然后在`React`组件中接收编译后的`CSS`和可能的错误消息。

仅供参考，不喜勿喷😂，`sass`有很多在线编译的产品、这里只是提供在`Workers`中编译的思路，其它类似的需求同理可以在worker中实现。

### 《使用worker绕过浏览器节能机制的严格限制》

最近发现浏览器在执行定时任务时没有按预期执行，导致不可预期的结果产生。

原因是从`Chrome 88`版本开始，浏览器为了优化性能和节约能源，在**后台标签页或者最小化时**对定时器进行了限制的行为。

> 源代码：

js

 代码解读

复制代码

`let cacheTime = Date.now() setInterval(()=>{     console.log('setInterval :>>', Date.now() - cacheTime)     cacheTime = Date.now() }, 5000)`

期望是每`5秒`执行一次回调，但实际上浏览器在后台运行时`约60秒`才执行一次回调。如果使用`worker`，则可以绕过其节能限制。

> 具体实现如下：

js

 代码解读

复制代码

`// worker.js文件中 let cacheTime = Date.now() setInterval(() => {   self.postMessage(Date.now() - cacheTime)   cacheTime = Date.now() }, 5000); // 在主项目中每5秒执行一次回调 let worker = new Worker('./js/worker.js'); worker.onmessage = function (e) {   console.log('setInterval worker:>>', e.data) };`

亲测有效，效果如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6ee8b3a35ee4d2c89b0315a4e466879~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=497&h=767&s=112104&e=png&b=fefefe)

通过简单的分析发现，`setInterval`在浏览器后台的确没有按预期`每5秒`执行一次。但在**Worker中`始终每5秒`执行一次，即使浏览器在后台运行也是如此**。在这篇文章中有更详细的说明：[《你踩了吗？浏览器节能机制的坑》](https://juejin.cn/spost/7362576319928008755 "https://juejin.cn/spost/7362576319928008755")

### 《第三方包使用worker示例》

使用`qr-scanner`包在`webworker`中扫描二维码 后 在主线程中输出结果：

js

 代码解读

复制代码

``import QrScanner from 'qr-scanner' QrScanner.WORKER_PATH = `./js/qr-scanner-worker.min.js` QrScanner.scanImage(file)   .then(qrcodeUrl=>{     // 在主线程中输出结果     console.log(qrcodeUrl)   })   .catch(console.error)``

### 《使用worker实现文件秒传示例》

之前有写过一篇[文件秒传的文章](https://juejin.cn/post/7321049399282827274 "https://juejin.cn/post/7321049399282827274")，里面有提到文件hash计算导致浏览器崩溃的问题。如果把计算的部分放到`Workers`中实现就可以完美的解决该问题。

小结
--

在主线程使用`web Workers`时，需要注意：

1.  尽量使用`addEventListener`监听`message`事件，如果直接给`onmessage`赋值会被覆盖（只有最后一个`onmessage`有效）。
2.  `myWorker.js`文件必须和页面在同一域名下。
3.  `web Workers`接收的数据类型是有限制的，并非所有的类型和属性都可以。例如：Symbol、WeakMap、WeakSet、Dom、**Error**（虽然可以传递，但传递后的对象将失去其堆栈信息）、**File对象和Blob**（克隆的是该对象的内置属性和数据，**无法附加自定义属性**）
4.  在不使用时及时通过`worker.terminate()`销毁
5.  `Workers`创建并非越多越好，它同样的占用内存和全局环境（但是不会影响`js`的主线程）
6.  尽管现代浏览器对它的兼容性还不错，但如果你的项目对此有更高的要求，则需做好兼容处理 ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6efb91d5a7bb4f6d90359c0871ce25f0~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1382&h=543&s=99485&e=png&b=eee2cb)

未来发展
----

`Web Workers`的发展为前端多线程编程开辟了新天地，随着`Web`技术的不断进步，我们可以预见到`Web Workers`的应用场景将会更加广泛。比如，与`WebAssembly`的结合使用，可以让前端执行更接近本地应用的性能；再如，`Service Worker`的广泛应用，推动了`PWA(Progressive Web Apps)`的发展，使得`Web`应用具备了更多原生应用的特性。未来，随着浏览器对`Web Workers`支持的不断增强和优化，我们有理由相信，`Web Workers`将在提升`Web`应用性能、增强用户体验方面发挥更大的作用。

总结
--

[Web Workers](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWeb_Workers_API "https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API")作为一项强大的`Web`技术，为解决`JavaScript`单线程的局限性提供了有效的途径。

通过本文的介绍，希望你能对Web Workers有了更深入的了解，并能在实际项目中灵活运用，解锁前端多线程编程的潜力，打造更高性能、更优体验的Web应用。