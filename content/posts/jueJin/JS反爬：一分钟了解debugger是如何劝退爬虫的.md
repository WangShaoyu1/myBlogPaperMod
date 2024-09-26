---
author: "毕小宝"
title: "JS反爬：一分钟了解debugger是如何劝退爬虫的"
date: 2021-02-23
description: "爬虫之前，需要先对网站请求进行梳理，F12打开浏览器的开发者模式是第一步，所以反爬虫的第一招就是，在开发者模式下让对手的浏览器进入无限循环debugger。今天继续百度“带有JS混淆加密的网站怎么破解”，看到一篇文章正打算参考测试时，浏览器就陷入了无限循环，两步之后…"
tags: ["JavaScript"]
ShowReadingTime: "阅读2分钟"
weight: 316
---
### 背景

爬虫之前，需要先对网站请求进行梳理，F12 打开浏览器的开发者模式是第一步，所以反爬虫的第一招就是，在开发者模式下让对手的浏览器进入 无限循环 debugger 。

今天继续百度 “带有JS混淆加密的网站怎么破解”，看到一篇文章正打算参考测试时，浏览器就陷入了无限循环，两步之后，网站得意地宣布 “ 俺们是为人类服务的，你这机器就知难而退吧！”。

好吧，知难而退之前，也得知道是怎么被打败的嘛。就顺道分析下人家的网站是如何反爬的，当是偷师学艺啦！

### 无限 debugger

本打算跟着一个网站看看 JS 混淆的流程，结果一打开[这个空气质量监控平台](https://link.juejin.cn?target=https%3A%2F%2Fwww.aqistudy.cn%2F "https://www.aqistudy.cn/")就进入匿名函数的无限循环中了： ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d785195a24784469a305fda0b3362748~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 进入开发者模式，就落入第一步“匿名函数” 的 debugger 无限死循环中。

点击右侧调试面板中的 Call Stack 找到调用方法： ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b07d01956c9647798d19b2050b47bc38~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 非法调试检测栈调用

被网站检测了到非法调试，调用了 `xsdefwsw()` ，利用浏览器自带的格式化工具看到函数的全貌： ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/796a63c6790a450ba6bb104bc674cee8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 这里面搞了一个定时器又调用了 `txsdefwsw()` ，在浏览器的 console 控制台重写一下这个函数：

c

 代码解读

复制代码

`function txsdefwsw(){};`

关闭之后再右键盘，提示右键被管理员禁用了，F12 也被禁用了，这个网站的管理员也真够狠的。前面是访问网站之前就开启了开发者模式，所以还没发现这一招。 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/772c568e360a4954be13d6a47198369d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 两次 debugger 继续之后，提示如下页面： ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2e65be7f64d41409326228891358ff3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 试试重写函数

重写那个 `setTimeout` 函数后，**更狠的操作来了**，控制台重写的函数被清空了： ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/290ae56036b6430f8ad095250c698af5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 原来这个 `endebug(off,code)` 函数中添加了一个立即执行的函数，它监听并清空了 window 的函数，看来重写也绕不过了啊。

### 启示录

总结这个网站的 JS 反爬虫手段，页面首页一上来就是一堆检测调试的代码：

c

 代码解读

复制代码

`<script type="text/javascript"> var debugflag = false;   endebug(false, function () {       document.write('检测到非法调试, 请关闭调试终端后刷新本页面重试!');       document.write("<br/>");       document.write("Welcome for People, Not Welcome for Machine!");       debugflag = true;   });   txsdefwsw();   document.onkeydown = function() {     if ((e.ctrlKey) && (e.keyCode == 83)) {       alert("检测到非法调试，CTRL + S被管理员禁用");       return false;     }   }   document.onkeydown = function() {     var e = window.event || arguments[0];     if (e.keyCode == 123) {       alert("检测到非法调试，F12被管理员禁用");       return false;     }   }   document.oncontextmenu = function() {     alert('检测到非法调试，右键被管理员禁用');     return false;   } 	$(function() 	{ 		if (!debugflag && !window.navigator.webdriver) {       loadTab();     } 		if(!isSupportCanvas()) 		{ 			$("#browertip").show(); 		} 	}); 	function isSupportCanvas() 	{ 	   var elem = document.createElement('canvas'); 	   return !!(elem.getContext && elem.getContext('2d')); 	} </script>`

`endebug` 又会检测控制台函数重写，并清空控制台；`txsdefwsw` 它利用定时器，让浏览器无限进入 `debugger` 操作。

好吧，禁用右键、F12、`debugger` 定时器，这一波操作成功劝退了我这个临时起意的家伙！我承认，自己是带着对这个网站开发人员满满的敬意关闭该网页的，学到了一招，也算不虚此行了！