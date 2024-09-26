---
author: "天天鸭"
title: "微信小程序嵌入H5页面（webview）基本用法和父子传参数说明"
date: 2024-03-28
description: "微信小程序嵌入H5页面（webview）1.小程序官网配置业务域名2.标签的用法。3.父子传参数。4.H5跳转回小程序。"
tags: ["前端","WebView"]
ShowReadingTime: "阅读2分钟"
weight: 730
---
### 背景：

最近因为公司业务需求，要实现一个功能需要在小程序嵌入其它系统内部的一个页面（用vue写的H5页面），但小程序是无法使用iframe的，所以最终选择小程序官方的webview实现，本文对基本用法和父子传参进行说明。 所以下面将说明：

1.  小程序官网配置业务域名
2.  标签的用法。
3.  父子传参数。
4.  H5 跳转回小程序。

### 一、 小程序官网配置业务域名

我当时也没有配置导致了异常，但其实这是小程序官方要求一定要配置，如果不配置在趁机上会无法打开，但在微信开发者工具正常  
**步骤：** 在微信小程序后台，**开发->开发管理->开发设置->业务域名** 这里添加需要嵌入到小程序里面 H5 页面的合法域名即被嵌入页面的URL；

### 二、标签的用法

web-view 承载网页的容器。会自动铺满整个小程序页面，不能像iframe那样能设置某个区域，所以这个标签是嵌入整个页面的，不能嵌入某个部分

ini

 代码解读

复制代码

`用法：直接使用标签即可  <web-view src="https://xxxxxxxxxx"></web-view>`

**主要属性：**

src：webview 指向网页的链接。  
bindmessage： 网页向小程序 postMessage 时，会在以下特定时机触发并收到消息  
bindload：网页加载成功时候触发此事件  
binderror：网页加载失败的时候触发此事件。  

### 三、父子传参数

以下我把本地小程序形容为父，被嵌入系统形容为子  

**父传子：**

ini

 代码解读

复制代码

 `<web-view src="{{webUrl}}"/>`

javascript

 代码解读

复制代码

`created() {      // H5获取token const wxobj = {}      window.location.href.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => (wxobj[k] = v))      if ( wxobj.token) {          store.commit( 'user/setToken', wxobj.token)      }  }`

父用url拼接过去，子通过window.location.href.replace获取到内容

**子传父：**

**在子系统（被嵌入）** 需要安装官方的weixin-js-sdk包：  
(1)安装：

csharp

 代码解读

复制代码

 `pnpm add weixin-js-sdk`

(2)使用的页面引入：

javascript

 代码解读

复制代码

`import wx from "weixin-js-sdk";`

(3)使用传参给父：

css

 代码解读

复制代码

`wx.miniProgram.postMessage({      data: { token }  });`

**父系统（小程序）**

ini

 代码解读

复制代码

`<web-view src="{{webUrl}}" bindmessage="getMessage"/>`

javascript

 代码解读

复制代码

`//接收网页数据  getMessage: function (res) {     let token = res.detail.data;     this.setData({ token });   },`

### 四、 H5 跳转回小程序。

需要用到上面引入的weixin-js-sdk包

javascript

 代码解读

复制代码

``const name = '天天' wx.miniProgram.navigateTo({   url: `/pages/my/my?name=${name}` , // 小程序地址   success () {     console.log('question success')   },   fail (error) {     console.log(error)   } })``

父系统能拿到？后面的传参数

javascript

 代码解读

复制代码

`onLoad(option) {      this.name = JSON.parse(option.name);  },`

部分常用的weixin-js-sdk包的API：

wx.miniProgram.navigateBack 、wx.miniProgram.switchTab、wx.miniProgram.redirectTo 等等，参数与小程序接口一致 ,以下为事例  

css

 代码解读

复制代码

`wx.miniProgram.navigateTo({url: '/path/to/page'}) wx.miniProgram.postMessage({ data: 'foo' }) wx.miniProgram.postMessage({ data: {foo: 'bar'} }) wx.miniProgram.getEnv(function(res) { console.log(res.miniprogram) })`

更多weixin-js-sdk包的API可以去官网查：\[点击跳去\](