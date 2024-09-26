---
author: "tager"
title: "Javascript如何全面接管xhr请求"
date: 2021-10-17
description: "为什么需要接管xhr请求？如何监控请求的整个生命周期、真实的mock数据、制定完全可控的控制台，拦截XMLHttpRequest请求、拦截xhr、接管XMLHttpRequest请求,http请求。"
tags: ["JavaScript"]
ShowReadingTime: "阅读8分钟"
weight: 803
---
小知识，大挑战！本文正在参与「[程序员必备小知识](https://juejin.cn/post/7008476801634680869 "https://juejin.cn/post/7008476801634680869")」创作活动

本文已参与 [「掘力星计划」](https://juejin.cn/post/7012210233804079141 "https://juejin.cn/post/7012210233804079141") ，赢取创作大礼包，挑战创作激励金

背景及思考
-----

为什么需要接管xhr请求？这就需要我们了解它的一些应用场景。我们如何统一项目中xhr请求的行为，监控请求的**整个生命周期**、如何自定义拦截请求并**返回mock数据**、如何**制定完全可控的控制台**（如vconsole那样） 、如何监控**所有api请求的健康状态** 等等!

有一种最常见的情况。比如项目中发起请求的方式不一，有的在`js sdk或私有npm库`中发起、有的在引入了第三方`js cdn`中发起、有的由项目中统一的`ajax、axios`发起。如果我们需要对项目中所有请求增加某些统一的行为该如何处理了？

* * *

原生XMLHttpRequest 回顾
-------------------

### 使用xhr发起请求

注：以下只针对xhr的处理，不考虑使用`ActiveXObject`来处理兼容性，不考虑使用fetch请求。

javascript

 代码解读

复制代码

`// 创建 XMLHttpRequest 对象 var xhr = new XMLHttpRequest (); // 建立连接 xhr.open(method, url, async, username, password); // 在open后，send前 可对报文进行处理,如设置请求头 xhr.setRequestHeader('customId', 666) // 对于异步请求，绑定响应状态事件监听函数 xhr.onreadystatechange = function () {   //监听readyState状态、http状态码 	if (xhr.readyState == 4 && xhr.status == 200) {   		console.log(xhr.responseText);  // 接收数据    } } // 使用 send() 方法发送请求 xhr.send(body); //对于同步请求，可直接接收数据 console.log(xhr.responseText); //中止请求 xhr.onreadystatechange = function () {};  //清理事件响应函数(IE、火狐兼容性处理) xhr.abort();`

* * *

ES5实现局部拦截
---------

假设使用ajax、axios、原生xhr在请求时增加了自定义的请求头`custom-trace-id:'1,2'`。 我们**如何通过拦截**获取到其值，并增加两个新的请求头`'custom-a': '1'`和`'custom-b': '2'` (分割custom-trace-id的值获取到'aa'和'bb')

### 拦截项目中所有xhr, 并给有'custom-trace'的头增加新的自定义请求头（仅拦截open和setRequestHeader）

javascript

 代码解读

复制代码

`;(function (w) {   // document.getElementById('textDesc').innerHTML='ES5局部拦截XHR并添加请求头：'   w.rewriteXhr = {     // 随机生成uuid     _setUUID: function () {       return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {         var r = Math.random() * 16 | 0,           v = c == 'x' ? r : (r & 0x3 | 0x8);         return v.toString(16);       });     },     tempXhrProto: function (){       this._originXhr = w.XMLHttpRequest.prototype       this._Originopen = this._originXhr.open       this._OriginSetRequestHeader = this._originXhr.setRequestHeader     },     overWrite: function () {       var _this = this       this._originXhr.open = function () {         // note open才能获取到url等参数。         this._open_args = [...arguments];         // 可以根据return顾虑调不需要执行的return         return _this._Originopen.apply(this, arguments);       }       // 拦截setRequestHeader方法       this._originXhr.setRequestHeader = function () {         var headerKey = arguments[0]         // note: 可使用url做过滤处理         // var url = this.open_args && this.open_args[1]         if (/^custom-trace-id$/.test(headerKey)) {           var args = arguments[1] && arguments[1].split(',')           var values = {             'custom-a': args[0],             'custom-b': args[1],             'custom-uuid': _this._setUUID()           }           Object.entries(values).forEach(([key, value])=>{             // note: 用箭头函数偷一下懒             this.setRequestHeader(key, value)           })           return _this._OriginSetRequestHeader.apply(this, arguments)         }         // note: 声明时已丢失上下文，必须要使用apply、call         return _this._OriginSetRequestHeader.apply(this, arguments)       }     },     init: function () {       // 1. 存储原生的xhr原型       this.tempXhrProto()       // 2. 重写xhr       this.overWrite()     }   }   w.rewriteXhr.init() })(window) // 复制、粘贴 可直接使用`

以上，我们重新定义了`open`和`setRequestHeader`的原型方法(拦截open的目的在于只能在该方法的参数中获取到url等信息)，同时也储存了原始的`open`和`setRequestHeader`。在每次有请求调用到setRequestHeader时，实际调用的是我们自己重写的`setRequestHeader`方法，在该方法里面再去调用原始的`setRequestHeader`,从而实现拦截设置请求头的目的。

**了解了局部的xhr拦截，我们可以以此来思索如何封装实现全局的请求拦截？**

> **全局拦截需要考虑的细节：**
> 
> 1.  除了函数拦截，如何处理事件、属性的拦截？
> 2.  xhr部分属性是只读的，比如responseText，需要考虑拦截后如何修改/获取只读属性？
> 3.  如何获取原始的xhr上全部的属性、事件、方法？
> 4.  xhr在除了open外的其它 事件、方法 中怎样获取url
> 5.  如何终止/过滤用户请求
> 6.  如何取消全局的拦截 ......

* * *

ES5实现全局拦截
---------

### 在项目中`使用xhrHook`实现全局拦截

使用非常简单，直接调用xhrHook并传入对象即可（对象参数为需要拦截的属性、方法、事件）

lua

 代码解读

复制代码

`xhrHook({   open: function (args, xhr) {     console.log("open called!", args, xhr)      // return true // 返回true将终止请求，这个就是常规拦截的精髓了   },   setRequestHeader: function (args, xhr) {     console.log("setRequestHeader called!", args, xhr)          },   onload: function (xhr) {     // 对响应结果做处理     this.responseText += ' tager'   } })`

### xhrHook 的实现

在全局拦截中，我们需要考虑到实例的**属性、方法及事件**的处理。**`（核心代码）`**

javascript

 代码解读

复制代码

`// 核心拦截的handler function xhrHook(config) {   // 存储真实的xhr构造器, 在取消hook时，可恢复   window.realXhr = window.realXhr || XMLHttpRequest   // 重写XMLHttpRequest构造函数   XMLHttpRequest = function () {     var xhr = new window.realXhr()     // 真实的xhr实例存储到自定义的xhr属性中     this.xhr = xhr     // note: 遍历实例及其原型上的属性（实例和原型链上有相同属性时，取实例属性）     for (var attr in xhr) {       if (Object.prototype.toString.call(xhr[attr]) === '[object Function]') {         this[attr] = hookFunction(attr, config); // 接管xhr function       } else {         // attention: 如果重写XMLHttpRequest，必须要全部重写，否则在ajax中不会触发success、error（原因是3.x版本是在load事件中执行success）         Object.defineProperty(this, attr, { // 接管xhr attr、event           get: getterFactory(attr, config),           set: setterFactory(attr, config),           enumerable: true         })       }     }   }   return window.realXhr }`

#### xhr中的方法拦截

javascript

 代码解读

复制代码

`// xhr中的方法拦截，eg: open、send etc. function hookFunction(funcName, config) {   return function () {     var args = Array.prototype.slice.call(arguments)     // 将open参数存入xhr, 在其它事件回调中可以获取到。     if (funcName === 'open') {       this.xhr.open_args = args     }     if (config[funcName]) {       console.log(this, 'this')       // 配置的函数执行结果返回为true时终止调用       var result = config[funcName].call(this, args, this.xhr)       if (result) return result;     }     return this.xhr[funcName].apply(this.xhr, arguments);   } }`

#### xhr中的属性和事件的拦截

javascript

 代码解读

复制代码

`// xhr中的属性和事件的拦截 function getterFactory(attr, config) {   return function () {     var value = this.hasOwnProperty(attr + "_") ? this[attr + "_"] : this.xhr[attr];     var getterHook = (config[attr] || {})["getter"]     return getterHook && getterHook(value, this) || value   } } // 在赋值时触发该工厂函数（如onload等事件） function setterFactory(attr, config) {   return function (value) {     var _this = this;     var xhr = this.xhr;     var hook = config[attr]; // 方法或对象     this[attr + "_"] = value;     if (/^on/.test(attr)) {       // note：间接的在真实的xhr上给事件绑定函数       xhr[attr] = function (e) {         // e = configEvent(e, _this)         var result = hook && config[attr].call(_this, xhr, e)         result || value.call(_this, e);       }     } else {       var attrSetterHook = (hook || {})["setter"]       value = attrSetterHook && attrSetterHook(value, _this) || value       try {         // 并非xhr的所有属性都是可写的         xhr[attr] = value;       } catch (e) {         console.warn('xhr的' + attr + '属性不可写')       }     }   } }`

#### 解除xhr拦截，归还xhr管理权

javascript

 代码解读

复制代码

`// 归还xhr管理权 function unXhrHook() {   if (window[realXhr]) XMLHttpRequest = window[realXhr];   window[realXhr] = undefined; }`

* * *

### 完整代码（copy后可直接使用，生产环境使用需自检）

javascript

 代码解读

复制代码

`// xhr中的方法拦截，eg: open、send etc. function hookFunction(funcName, config) {   return function () {     var args = Array.prototype.slice.call(arguments)     // 将open参数存入xhr, 在其它事件回调中可以获取到。     if (funcName === 'open') {       this.xhr.open_args = args     }     if (config[funcName]) {       console.log(this, 'this')       // 配置的函数执行结果返回为true时终止调用       var result = config[funcName].call(this, args, this.xhr)       if (result) return result;     }     return this.xhr[funcName].apply(this.xhr, arguments);   } } // xhr中的属性和事件的拦截 function getterFactory(attr, config) {   return function () {     var value = this.hasOwnProperty(attr + "_") ? this[attr + "_"] : this.xhr[attr];     var getterHook = (config[attr] || {})["getter"]     return getterHook && getterHook(value, this) || value   } } // 在赋值时触发该工厂函数（如onload等事件） function setterFactory(attr, config) {   return function (value) {     var _this = this;     var xhr = this.xhr;     var hook = config[attr]; // 方法或对象     this[attr + "_"] = value;     if (/^on/.test(attr)) {       // note：间接的在真实的xhr上给事件绑定函数       xhr[attr] = function (e) {         // e = configEvent(e, _this)         var result = hook && config[attr].call(_this, xhr, e)         result || value.call(_this, e);       }     } else {       var attrSetterHook = (hook || {})["setter"]       value = attrSetterHook && attrSetterHook(value, _this) || value       try {         // 并非xhr的所有属性都是可写的         xhr[attr] = value;       } catch (e) {         console.warn('xhr的' + attr + '属性不可写')       }     }   } } // 核心拦截的handler function xhrHook(config) {   // 存储真实的xhr构造器, 在取消hook时，可恢复   window.realXhr = window.realXhr || XMLHttpRequest   // 重写XMLHttpRequest构造函数   XMLHttpRequest = function () {     var xhr = new window.realXhr()     // 真实的xhr实例存储到自定义的xhr属性中     this.xhr = xhr     // note: 遍历实例及其原型上的属性（实例和原型链上有相同属性时，取实例属性）     for (var attr in xhr) {       if (Object.prototype.toString.call(xhr[attr]) === '[object Function]') {         this[attr] = hookFunction(attr, config); // 接管xhr function       } else {         // attention: 如果重写XMLHttpRequest，必须要全部重写，否则在ajax中不会触发success、error（原因是3.x版本是在load事件中执行success）         Object.defineProperty(this, attr, { // 接管xhr attr、event           get: getterFactory(attr, config),           set: setterFactory(attr, config),           enumerable: true         })       }     }   }   return window.realXhr } // 解除xhr拦截，归还xhr管理权 function unXhrHook() {   if (window[realXhr]) XMLHttpRequest = window[realXhr];   window[realXhr] = undefined; }`

总结
--

xhr的全局拦截总体来说比较简单，除了对事件的托管流程稍有复杂。不管是局部还是全局处理，共同的特点是都要存储原生的xhr, 但在执行原生的属性、方法、事件时，会先执行自己的处理函数，在函数中执行一些操作，最后再去执行原生的方法。

对于事件的拦截，比如我们在定义`xhr.onload = function realLoad(){}`时，实际触发的是sdk中定义的`onload` 的`setter`方法，在该方法中会去给真实的xhr绑定回调函数onload，真实onload被触发时，会在回调函数中执行`config.onload`中的逻辑、如果`config.onload()`没有返回或返回`false`, 会最终执行用户xhr接口中绑定的realLoad函数。另外，需要注意是----执行多个xhrHook只有最后一个会生效。

如有不足之处、疑问或建议，欢迎大家留言指出。

> 作者： `tager`  
> 相关文章地址：[`https://juejin.cn/user/4353721776234743/posts`](https://juejin.cn/user/4353721776234743/posts "https://juejin.cn/user/4353721776234743/posts")  
> 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。