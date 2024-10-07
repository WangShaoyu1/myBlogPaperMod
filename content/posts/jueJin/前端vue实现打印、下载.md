---
author: "天神下凡_"
title: "前端vue实现打印、下载"
date: 2022-08-14
description: "分享一下几个后台管理系统比较常用的插件：下载、打印html2canvas，jspdf，printjs"
tags: ["前端","JavaScript","Vue.js"]
ShowReadingTime: "阅读1分钟"
weight: 138
---
分享一下几个后台管理系统比较常用的插件：下载、打印

### html2canvas介绍

> [html2canvas](https://link.juejin.cn?target=http%3A%2F%2Fhtml2canvas.hertzen.com%2F "http://html2canvas.hertzen.com/")是在浏览器上对网页进行截图操作，实际上是操作DOM，这个插件也有好长时间了，比较稳定，目前使用还没有遇到什么bug

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da41a95762434a5b99b59bcd3e6ce776~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### jspdf介绍

> 如果下载出来是pdf文件，可以加上[jspdf](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fjspdf "https://www.npmjs.com/package/jspdf")插件，会先通过html2canvas把页面转化成base64图片，再通过jspdf导出

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/321370b04ca64524b996731e7b78a460~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

`安装`

js

 代码解读

复制代码

`npm i html2canvas jspdf 或 yarn add html2canvas jspdf`

`使用`

js

 代码解读

复制代码

`<template>   <div>     <h1 ref="toPdf">       导出区域     </h1>     <button @click="toPdfFn">导出pdf</button>   </div> </template> <script> import html2canvas from "html2canvas" import JSPDF from "jspdf" export default {  methods:{   toPdfFn(){    this.htmlToPdf('文件名','时间')   },   htmlToPdf(name,time){       let element = this.$refs.toPdf       html2canvas(element, {         logging: false       }).then(function(canvas) {         let pdf = new JSPDF("p", "mm", "a4") // A4纸，纵向         let ctx = canvas.getContext("2d")         let a4w = 190;         let a4h = 277 // A4大小，210mm x 297mm，四边各保留20mm的边距，显示区域190x277         let imgHeight = Math.floor(a4h * canvas.width / a4w) // 按A4显示比例换算一页图像的像素高度         let renderedHeight = 0         while (renderedHeight < canvas.height) {           let page = document.createElement("canvas")           page.width = canvas.width           page.height = Math.min(imgHeight, canvas.height - renderedHeight) // 可能内容不足一页           // 用getImageData剪裁指定区域，并画到前面创建的canvas对象中           page.getContext("2d").putImageData(ctx.getImageData(0, renderedHeight, canvas.width, Math.min(imgHeight,             canvas.height - renderedHeight)), 0, 0)           pdf.addImage(page.toDataURL("image/jpeg", 1.0), "JPEG", 10, 10, a4w, Math.min(a4h, a4w * page.height /             page.width)) // 添加图像到页面，保留10mm边距           // 如果后面还有内容，添加一个空页           renderedHeight += imgHeight           if (renderedHeight < canvas.height) {             pdf.addPage()           }         }         pdf.save(name + time)       })     }  } } </script>`

> 注意点： 1、能使用ref来获取html结构就用ref，尽量不使用id。如果使用的地方比较多可以挂载到vue实例上 2、导出的pdf空白情况：检查dom结构有没有获取到，还有就是css样式要写在导出区域内的元素中

### printjs介绍

> 之前是使用vue-print-nb插件的，但是这个插件有点猫病，有时候会出现样式跨域的问题，有时候又正常，后面在GitHub上找到的一个，用到现在也没出现过什么问题

`在utils文件里面创建一个print.js文件`

js

 代码解读

复制代码

   
`// 打印类属性、方法定义 /* eslint-disable */ const Print = function (dom, options) {   if (!(this instanceof Print)) return new Print(dom, options);   this.options = this.extend({     'noPrint': '.no-print'   }, options);   if ((typeof dom) === "string") {     this.dom = document.querySelector(dom);   } else {     this.isDOM(dom)     this.dom = this.isDOM(dom) ? dom : dom.$el;   }   this.init(); }; Print.prototype = {   init: function () {     var content = this.getStyle() + this.getHtml();     this.writeIframe(content);   },   extend: function (obj, obj2) {     for (var k in obj2) {       obj[k] = obj2[k];     }     return obj;   },   getStyle: function () {     var str = "",       styles = document.querySelectorAll('style,link');     for (var i = 0; i < styles.length; i++) {       str += styles[i].outerHTML;     }     str += "<style>" + (this.options.noPrint ? this.options.noPrint : '.no-print') + "{display:none;}</style>";     return str;   },   getHtml: function () {     var inputs = document.querySelectorAll('input');     var textareas = document.querySelectorAll('textarea');     var selects = document.querySelectorAll('select');     for (var k = 0; k < inputs.length; k++) {       if (inputs[k].type == "checkbox" || inputs[k].type == "radio") {         if (inputs[k].checked == true) {           inputs[k].setAttribute('checked', "checked")         } else {           inputs[k].removeAttribute('checked')         }       } else if (inputs[k].type == "text") {         inputs[k].setAttribute('value', inputs[k].value)       } else {         inputs[k].setAttribute('value', inputs[k].value)       }     }     for (var k2 = 0; k2 < textareas.length; k2++) {       if (textareas[k2].type == 'textarea') {         textareas[k2].innerHTML = textareas[k2].value       }     }     for (var k3 = 0; k3 < selects.length; k3++) {       if (selects[k3].type == 'select-one') {         var child = selects[k3].children;         for (var i in child) {           if (child[i].tagName == 'OPTION') {             if (child[i].selected == true) {               child[i].setAttribute('selected', "selected")             } else {               child[i].removeAttribute('selected')             }           }         }       }     }     return this.dom.outerHTML;   },   writeIframe: function (content) {     var w, doc, iframe = document.createElement('iframe'),       f = document.body.appendChild(iframe);     iframe.id = "myIframe";     //iframe.style = "position:absolute;width:0;height:0;top:-10px;left:-10px;";     iframe.setAttribute('style', 'position:absolute;width:0;height:0;top:-10px;left:-10px;');     w = f.contentWindow || f.contentDocument;     doc = f.contentDocument || f.contentWindow.document;     doc.open();     doc.write(content);     doc.close();     var _this = this     iframe.onload = function(){       _this.toPrint(w);       setTimeout(function () {         document.body.removeChild(iframe)       }, 100)     }   },   toPrint: function (frameWindow) {     try {       setTimeout(function () {         frameWindow.focus();         try {           if (!frameWindow.document.execCommand('print', false, null)) {             frameWindow.print();           }         } catch (e) {           frameWindow.print();         }         frameWindow.close();       }, 10);     } catch (err) {       console.log('err', err);     }   },   isDOM: (typeof HTMLElement === 'object') ?     function (obj) {       return obj instanceof HTMLElement;     } :     function (obj) {       return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';     } }; const MyPlugin = {} MyPlugin.install = function (Vue, options) {   // 4. 添加实例方法   Vue.prototype.$print = Print } export default MyPlugin`

> [printjs](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fxyl66%2FvuePlugs_printjs "https://github.com/xyl66/vuePlugs_printjs")源码在这里

`在main.js中注册`

js

 代码解读

复制代码

  `import Vue from "vue";   import print from "./src/utils/print.js";   Vue.use(print)`

`在需要的地方使用`

js

 代码解读

复制代码

`<template>   <div>     <h1 ref="print">       <div>打印区域</div>     </h1>     <button @click="printFn">打印</button>   </div> </template> <script> export default {   methods: {     printFn() {       //传入dom结构即可       this.$print(this.$refs.print);     },   }, }; </script> <style lang="less" scoped> @media print {   @page {     size: auto; //打印可以选择布局：横向，纵向     // size: landscape;//横向     // size: portrait;//纵向     margin: 23.5mm; //默认边距   } } </style>`

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/559b94eb15bd48b681418c348c189807~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

> 注意：需使用ref获取dom节点，若直接通过id或class获取则webpack打包部署后打印内容为空 

**指定不打印区域** 方法

方法一. 添加no-print样式类

ini

 代码解读

复制代码

`<div class="no-print">不要打印我</div>`

方法二. 自定义类名

kotlin

 代码解读

复制代码

`<div class="do-not-print-me-xxx">不要打印我</div> this.$print(this.$refs.print,{'no-print':'.do-not-print-me-xxx'}) // 使用`

> 最后环节，如果各位大佬有更好用的插件，可以分享一下，让小弟学习学习
> 
> 后续也会持续更新

`2022/11/01补充` 打印的时候如果样式有问题，只需要检查打印部分的css代码，把需要打印的样式放到里面，不需要打印的放在外面，如果是在组件里面打印，要看一下样式穿透的类名是在打印里面还是打印外面，直接在控制台查看即可

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11c9d9ab32c643069387b3869ffcbe38~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?) 第二点是打印的时候盒子模型的margin样式会有变化，最好是用padding