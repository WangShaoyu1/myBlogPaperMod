---
author: "前端泥瓦匠"
title: "仿百度验证码(vue+node)"
date: 2021-06-11
description: "为什么要使用验证码?不用会怎么样?假设你想要浪费xxx公司的短信验证码，你会怎么做?假设你就是这家公司的程序员，你该怎么保护公司呢?(内附上完整源码)"
tags: ["前端"]
ShowReadingTime: "阅读5分钟"
weight: 289
---
1 为什么我们要使用验证码?
--------------

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c5bef0482a374c0d8970184c649f103d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 如果你是一个只想看干货的程序员，又不想听我说废话，这里请直接滑动到最后，获取代码。

> 描述一个业务场景:
> 
> 假设你想要浪费xxx公司的短信验证码，你会怎么做?
> 
> 假设你就是这家公司的程序员，你该怎么保护公司呢?

### 1.2 设想性攻防战

#### 第一回合

攻击方: (模拟接口调用)  
使用postman工具，将发送短信的接口疯狂的调用。  

防守方: (运营商保护)  
作为后端团队，马上开启会议模式，思考如何防止呢?好，接口供应商的接口保护开启。设置一天内容同一个手机号， 只能请求10次，每个小时只能请求1次。  

* * *

#### 第二回合

攻击方: (手机号足够多呢)  
发现接口调用失败，开启了异常状态，同一手机号被限制了。好，使用手机词典模式，只要我手机号足够多，肯定就可以不停的调用你，写了一个脚本模拟调用。  

防守方: (IP地址保护)  
通过接口日志发现，居然有一个人，每秒都在调用接口，然后发送之后，并没有任何用户行为操作?通过ip监控发现，居然是来自一个IP的攻击，马上开启保护模式，限制同一IP。  

* * *

#### 第三回合

攻击方:  
突然发现电脑接口调用失败了，但是手机热点的调用却成功了。那就开启虚拟IP，接着开始调用。  

防守方:  
叫上前端，我们讨论一下，开启验证码。  

* * *

2 验证码方案
-------

作为防守方，我们要明白一个任务，我要收集用户的同时，可能更加希望对方是一个人，而不是机器。那么如何确定对方是一个人呢?

3 文字验证码
-------

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0fd2979160b942d9aff1a82f4e5defda~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

1.  随机的数字或者字母图片，这是最原始也是最简单的验证码
2.  GIF格式的随机数字或者字母图片
3.  随机数字+随机大写英文字母+随机干扰像素+随机位置BMP格式图片
4.  随机英文字母+随机颜色+随机位置+随机长度的JPG格式图片，对字母进行大小写，位置，颜色，长度等进行随机显示

(以上为间断性的方案...)

最后的结果大家，已经知道，不论是前端还是后端，都有相应的库。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6439901e4ab74f35bbb0298db27cc964~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

我们设计出了这样的方案。那么这样的方案好不好呢？ 通过了多年，人们对于模糊的文字识别技术升级后，这样的验证码技术，安全系数就耍耍的减低。

4 问题验证码
-------

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2622428807d14e0d90f51d2b740c7d14~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 将文字的验证码升级后，略带互动的形式，地理问题（如图），数学问题，常识问。然后你会发现，总有那么几个问题，真的是人也不一定答出来。

5 图片验证码
-------

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/15c2f4f8547543d8965f0afae0ae1dea~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 放上一些图片，让你找出下列的书、花、红绿灯。这是一个经典的验证码，最出名的就是现在12306采用的防刷票措施了，对于用户的来说，总有几个脸盲患者，和看走眼的时候。在保护了接口的同时，也烦躁了用户。

6 滑动验证码
-------

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8d986b74e1440cf9afcac1cb03a6a0c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

1.  将图片拖到底部
2.  将图片和缺口复合
3.  图片上开启2个缺口

对于用户的要求降低之后，用户的体验就大大升级。俗话说，用的人多了，就不是什么难点了。即使二代升级了2个缺口，利用puppeteer破解极验的滑动验证工具，也随之诞生。

7 百度验证码 (附代码)
-------------

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/856f6ad6000e4311925e0ce1d238a9f7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

这套方案，我有在py的破解方案中找到，你可以理解为，生成无数个模型找到相似的算法，进行破解图片。那么我们这时候，假设一个图片会有360个角度，我们要去掉本来不需要旋转的度数，比如340个角度，去掉旋转不多的角度，180个角度，对于破解来说，就是260张图片。那么假设我的图片库内，有1000张图片，你需要破解，则需要180000张图片来存储，而我可以选择，定期更新这些图片。

### 7.1 node 代码

1.  图片肯定必须是后端生成的。=> 生成一张图片
2.  不希望图片存储到服务器上(毕竟是临时图片) => base64就是比较好的方案=> sharp库
3.  实际上最有意义的是90-270随机数(或许可以更多，没有具体测试)=> 取随机数
4.  这里我们服务选择了koa

> 这里的随机数是存储，如果你想使用在项目中，需要存储到缓存，这里推荐redis。

javascript

 代码解读

复制代码

``const sharp = require('sharp') const Koa = require('koa'); const router = require('koa-router')() const img_name = './images/1.jpg' // 放一张图片、未来这里可以放随机一个图片 const max = 90; // 最大值 const min = 270; // 最小值 const app = new Koa(); let random = 0 // 仅仅做demo、未来存储redis这里则不需要 app.use(router.routes()) router.get('/', async (ctx) => {     ctx.body = "hello!" }) // 发起图片请求 router.get('/getImg', async (ctx) => {     // 生产一个随机数   	random = Math.ceil(Math.random() * (max - min) + min);   	// 生成一张图片、这里可以详细的看sharp的文档，比如模糊这个功能就可以开启。     await sharp(img_name)         .resize(400, 400)         .rotate(random)         .toBuffer()         .then(bitmap => {       			//              const base64str = Buffer.from(bitmap, 'binary').toString('base64'); // base64编码             ctx.body = {                 base64str: `data:image/png;base64,${base64str}`                 // id: 此处可以给予一个uuid方便查询             }         }) }) // 图片的验证 router.get('/validation', async (ctx) => {     const rotate = ctx.request.query.rotate;     console.log(Math.abs(360 - rotate - random));   	// 此处10可以修改的更大，或者更小，来调整难度     if (Math.abs(360 - rotate - random) <= 10) {         ctx.body = {             flag: true         }         return;     }     ctx.body = {         flag: false     } }) app.listen(3000, () => {     console.log('server is running at http://localhost:3000') });``

### 7.2 vue代码

> 基于vue-drag-verify开发 DragVerify.vue

vue

 代码解读

复制代码

``<template>   <div class="drag-verify-container">     <div :style="dragVerifyImgStyle">       <img         ref="checkImg"         :src="imgsrc"         class="check-img"         :class="{ goOrigin: isOk }"         @load="checkimgLoaded"         :style="imgStyle"         alt=""       />       <div class="tips success" v-if="showTips && isPassing">{{ successTip }}</div>       <div class="tips danger" v-if="showTips && !isPassing && showErrorTip">{{ failTip }}</div>     </div>     <div       ref="dragVerify"       class="drag_verify"       :style="dragVerifyStyle"       @mousemove="dragMoving"       @mouseup="dragFinish"       @mouseleave="dragFinish"       @touchmove="dragMoving"       @touchend="dragFinish"     >       <div         class="dv_progress_bar"         :class="{ goFirst2: isOk }"         ref="progressBar"         :style="progressBarStyle"       >         {{ successMessage }}       </div>       <div class="dv_text" :style="textStyle" ref="message">         {{ message }}       </div>       <div         class="dv_handler dv_handler_bg"         :class="{ goFirst: isOk }"         @mousedown="dragStart"         @touchstart="dragStart"         ref="handler"         :style="handlerStyle"       >         <i :class="handlerIcon"></i>       </div>     </div>   </div> </template> <script> export default {   name: 'DragVerifyImg',   props: {     isPassing: {       type: Boolean,       default: false     },     width: {       type: Number,       default: 250     },     height: {       type: Number,       default: 40     },     text: {       type: String,       default: 'swiping to the right side'     },     successText: {       type: String,       default: 'success'     },     background: {       type: String,       default: '#eee'     },     progressBarBg: {       type: String,       default: '#76c61d'     },     completedBg: {       type: String,       default: '#76c61d'     },     circle: {       type: Boolean,       default: false     },     radius: {       type: String,       default: '4px'     },     handlerIcon: {       type: String     },     successIcon: {       type: String     },     handlerBg: {       type: String,       default: '#fff'     },     textSize: {       type: String,       default: '14px'     },     textColor: {       type: String,       default: '#333'     },     imgsrc: {       type: String     },     showTips: {       type: Boolean,       default: true     },     successTip: {       type: String,       default: '验证通过'     },     failTip: {       type: String,       default: '验证失败'     },     minDegree: {       type: Number,       default: 90     },     maxDegree: {       type: Number,       default: 270     }   },   mounted: function () {     const dragEl = this.$refs.dragVerify;     dragEl.style.setProperty('--textColor', this.textColor);     dragEl.style.setProperty('--width', Math.floor(this.width / 2) + 'px');     dragEl.style.setProperty('--pwidth', -Math.floor(this.width / 2) + 'px');   },   computed: {     handlerStyle: function () {       return {         width: this.height + 'px',         height: this.height + 'px',         background: this.handlerBg       };     },     message: function () {       return this.isPassing ? '' : this.text;     },     successMessage: function () {       return this.isPassing ? this.successText : '';     },     dragVerifyStyle: function () {       return {         width: this.width + 'px',         height: this.height + 'px',         lineHeight: this.height + 'px',         background: this.background,         borderRadius: this.circle ? this.height / 2 + 'px' : this.radius       };     },     dragVerifyImgStyle: function () {       return {         'width': this.width + 'px',         'height': this.width + 'px',         'position': 'relative',         'overflow': 'hidden',         'border-radius': '50%'       };     },     progressBarStyle: function () {       return {         background: this.progressBarBg,         height: this.height + 'px',         borderRadius: this.circle           ? this.height / 2 + 'px 0 0 ' + this.height / 2 + 'px'           : this.radius       };     },     textStyle: function () {       return {         height: this.height + 'px',         width: this.width + 'px',         fontSize: this.textSize       };     },     factor: function () {       //避免指定旋转角度时一直拖动到最右侧才验证通过       if (this.minDegree == this.maxDegree) {         return Math.floor(1 + Math.random() * 6) / 10 + 1;       }       return 1;     }   },   data() {     return {       isMoving: false,       x: 0,       isOk: false,       showBar: false,       showErrorTip: false,       ranRotate: 0,       cRotate: 0,       imgStyle: {}     };   },   methods: {     checkimgLoaded: function () {       this.ranRotate = 120;     },     dragStart: function (e) {       if (!this.isPassing) {         this.isMoving = true;         this.x = e.pageX || e.touches[0].pageX;       }       this.showBar = true;       this.showErrorTip = false;       this.$emit('handlerMove');     },     dragMoving: function (e) {       if (this.isMoving && !this.isPassing) {         var _x = (e.pageX || e.touches[0].pageX) - this.x;         var handler = this.$refs.handler;         handler.style.left = _x + 'px';         this.$refs.progressBar.style.width = _x + this.height / 2 + 'px';         var cRotate = Math.ceil((_x / (this.width - this.height)) * this.maxDegree * this.factor);         this.cRotate = cRotate;         var rotate = cRotate;         this.imgStyle = {           transform: `rotateZ(${rotate}deg)`         };       }     },     dragFinish: function () {       if (this.isMoving && !this.isPassing) {         this.$emit('postRotate', this.cRotate);         this.isMoving = false;       }     },     setFinish(val) {       if (val) {         this.passVerify();         return;       }       this.isOk = true;       this.imgStyle = {         transform: `rotateZ(${this.ranRotate}deg)`       };       const that = this;       setTimeout(function () {         const handler = that.$refs.handler;         const progressBar = that.$refs.progressBar;         handler.style.left = '0';         progressBar.style.width = '0';         that.isOk = false;       }, 500);       this.showErrorTip = true;       this.$emit('update:isPassing', false);       this.$emit('passfail');     },     passVerify: function () {       this.$emit('update:isPassing', true);       this.isMoving = false;       var handler = this.$refs.handler;       handler.children[0].className = this.successIcon;       this.$refs.progressBar.style.background = this.completedBg;       this.$refs.message.style['-webkit-text-fill-color'] = 'unset';       this.$refs.message.style.animation = 'slidetounlock2 3s infinite';       this.$refs.progressBar.style.color = '#fff';       this.$refs.progressBar.style.fontSize = this.textSize;       this.$emit('passcallback');     },     reset: function () {       this.reImg();       this.checkimgLoaded();     },     reImg: function () {       this.$emit('update:isPassing', false);       const oriData = this.$options.data();       for (const key in oriData) {         if (Object.prototype.hasOwnProperty.call(oriData, key)) {           this[key] = oriData[key];         }       }       var handler = this.$refs.handler;       var message = this.$refs.message;       handler.style.left = '0';       this.$refs.progressBar.style.width = '0';       handler.children[0].className = this.handlerIcon;       message.style['-webkit-text-fill-color'] = 'transparent';       message.style.animation = 'slidetounlock 3s infinite';       message.style.color = this.background;     },     refreshimg: function () {       this.$emit('refresh');     }   },   watch: {     imgsrc: {       immediate: false,       handler: function () {         this.reImg();       }     }   } }; </script> <style scoped> .drag_verify {   position: relative;   background-color: #e8e8e8;   text-align: center;   overflow: hidden; } .drag_verify .dv_handler {   position: absolute;   top: 0px;   left: 0px;   cursor: move; } .drag_verify .dv_handler i {   color: #666;   padding-left: 0;   font-size: 16px; } .drag_verify .dv_handler .el-icon-circle-check {   color: #6c6;   margin-top: 9px; } .drag_verify .dv_progress_bar {   position: absolute;   height: 34px;   width: 0px; } .drag_verify .dv_text {   position: absolute;   top: 0px;   color: transparent;   -moz-user-select: none;   -webkit-user-select: none;   user-select: none;   -o-user-select: none;   -ms-user-select: none;   background: -webkit-gradient(     linear,     left top,     right top,     color-stop(0, var(--textColor)),     color-stop(0.4, var(--textColor)),     color-stop(0.5, #fff),     color-stop(0.6, var(--textColor)),     color-stop(1, var(--textColor))   );   -webkit-background-clip: text;   -webkit-text-fill-color: transparent;   -webkit-text-size-adjust: none;   animation: slidetounlock 3s infinite; } .drag_verify .dv_text * {   -webkit-text-fill-color: var(--textColor); } .goFirst {   left: 0px !important;   transition: left 0.5s; } .goOrigin {   transition: transform 0.5s; } .goKeep {   transition: left 0.2s; } .goFirst2 {   width: 0px !important;   transition: width 0.5s; } .drag-verify-container {   position: relative;   line-height: 0;   border-radius: 50%; } .move-bar {   position: absolute;   z-index: 100; } .clip-bar {   position: absolute;   background: rgba(255, 255, 255, 0.8); } .refresh {   position: absolute;   right: 5px;   top: 5px;   cursor: pointer;   font-size: 20px;   z-index: 200; } .tips {   position: absolute;   bottom: 25px;   height: 20px;   line-height: 20px;   text-align: center;   width: 100%;   font-size: 12px;   z-index: 200; } .tips.success {   background: rgba(255, 255, 255, 0.6);   color: green; } .tips.danger {   background: rgba(0, 0, 0, 0.6);   color: yellow; } .check-img {   width: 140%;   margin-left: -20%;   margin-top: -20%;   border-radius: 50%;   /* width: 100%; */ } </style> <style> @-webkit-keyframes slidetounlock {   0% {     background-position: var(--pwidth) 0;   }   100% {     background-position: var(--width) 0;   } } @-webkit-keyframes slidetounlock2 {   0% {     background-position: var(--pwidth) 0;   }   100% {     background-position: var(--pwidth) 0;   } } </style>``

> app.vue

vue

 代码解读

复制代码

``<template>   <div id="app">     <drag-verify-img       ref="verify"       :imgsrc="imgsrc"       :isPassing.sync="isPassing"       text="请按住滑块拖动"       successText="验证通过"       handlerIcon="el-icon-d-arrow-right"       successIcon="el-icon-circle-check"       @postRotate="postRotate"       @passcallback="passcallback"       @passfail="passfail"     >     </drag-verify-img>   </div> </template> <script> import DragVerifyImg from './components/DragVerify.vue'; import axios from 'axios'; export default {   name: 'App',   components: {     DragVerifyImg   },   data: function () {     return {       imgsrc: '',       isPassing: false     };   },   created() {     this.getImg();   },   methods: {     async getImg() {       try {         const res = await axios.get('/api/getImg');         this.imgsrc = res.data.base64str;       } catch (error) {         console.log(error);       }     },     async postRotate(val) {       const res = await axios.get(`/api/validation?rotate=${val}`);       this.$refs.verify.setFinish(res.data.flag);     },     passcallback() {       console.log('成功');     },     passfail() {       this.$refs.verify.reset(); // 默认重置       console.log('失败');     }   } }; </script> <style lang="scss"> #app {   font-family: Avenir, Helvetica, Arial, sans-serif;   -webkit-font-smoothing: antialiased;   -moz-osx-font-smoothing: grayscale;   text-align: center;   color: #2c3e50;   margin-top: 60px; } </style>``

8 github地址
----------

> [github.com/MYQ1996/dra…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMYQ1996%2Fdrag-verify-demo.git "https://github.com/MYQ1996/drag-verify-demo.git")