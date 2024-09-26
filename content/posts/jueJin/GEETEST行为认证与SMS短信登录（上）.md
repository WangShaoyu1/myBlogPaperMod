---
author: "蓝屏的钙"
title: "GEETEST行为认证与SMS短信登录（上）"
date: 2023-06-24
description: "人机行为验证+短信验证码的登录机制已成为目前主流的注册、登录方案之一，本期来聊聊企业级项目中的行为认证与短信登录服务。"
tags: ["前端","安全","API"]
ShowReadingTime: "阅读7分钟"
weight: 356
---
![38ee54b7-cd26-432d-bc6f-cb6537b7fcaf.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f429a83e28fc4c07b09667820edb7809~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

相信大家对上面这种人机行为验证 + 短信验证码的登录形式十分熟悉，这套机制已成为目前主流的注册、登录方案之一。我将分上下两期和大家一起聊聊企业级项目中的行为认证与短信登录服务。

本期主要讲一讲 GEETEST（极验）的行为认证以及在前端（Web）项目中的部署和使用。

验证码
---

爬虫、外挂、短信轰炸、批量注册账号、打骚扰电话，发垃圾短信的服务...... 这些让人咬牙切齿的行为背后都有“自动化程序”的身影。如果有黑客大量利用这些自动化程序轮番向服务器发送请求，就相当于组织了一个“僵尸网络”发动攻击，这会让很多平台的服务器瘫痪。

验证码，就是安全人员和这些“黑产”博弈的产物。验证码英文缩写 CAPTCHA，全称 Completely Automated Public Turing Test to Tell Computers and Humans Apart。大白话翻译就是：**全自动区分计算机和人类的图灵测试**。这些验证码的目的只有一个：防住这些“机器人”。

早期的验证码很简单，类似于医院的色盲检测图：

![Snipaste_2023-06-23_23-04-57.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55ab7dd238c64fc9a9e84a3716f14d19~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

但随着图像识别技术的普及，传统的图片验证码已经不能保障网站的安全了。于是乎，行为认证应运而生。

行为认证的原理
-------

行为认证就是在用户进行认证时，捕获其行为信息。如今的验证服务大都提供了无感验证，可以不需要输入验证码直接登录，比如滑动验证、文字点击等。以常见的滑动验证码为例，并不是说只要把滑块移动到指定地点就能破解了。其实在你滑动的过程中，系统会结合浏览器、网络、设备等相关信息综合判断风险情况，滑动过程中的鼠标轨迹也属于检测项之一，一般机器的滑动操作匀速且匹配完美，但人类几乎是不可能出现这样的操作。

你应该已经感觉到了，行为认证判断你是不是真人，并不是真要你答题，而是观察你有没有人类的特征。因为你再怎么努力，也很难让自己的手在屏幕上划出一条完美的直线，但机器人却可以轻松的做到，也正因为它能做到，所以机器人反而通不过测试。

这正是如今的验证码区分活人和机器人的标准之一，怎么样？是不是有点儿意思。

使用场景
----

网站和APP，在所有可能被机器行为攻击的场景，例如但不限于**注册、登录、短信接口、查询接口、营销活动、发帖评论**等等，都可以部署使用行为验证，来抵御机器批量操作。

GEETEST 极验
----------

> [GEETEST 极验](https://link.juejin.cn?target=https%3A%2F%2Fwww.geetest.com%2F "https://www.geetest.com/") 是一项可以帮助你的网站与APP识别与拦截机器程序批量自动化操作的 SaaS 应用。它是由极验开发的新一代人机验证产品，它不基于传统“问题-答案”的检测模式，而是通过利用深度学习对验证过程中产生的行为数据进行高维分析，发现人机行为模式与行为特征的差异，更加精准地区分人机行为。

这里使用的是第三代行为验，最新版本是0.4.9。

### 1\. 初始化函数

我们可以先使用官方提供的 CDN 引入一个初始化的函数，放在项目中的 `index.html` 里：

html

 代码解读

复制代码

`<!-- index.html --> <script type="module" src="https://static.geetest.com/static/js/gt.0.4.9.js"></script>`

这个 `gt.xxx.js` 文件，会往 `window` 上挂载一个 `initGeetest` 方法，用于加载对应的验证JS库。

**注： 对于同一个页面存在多个验证码场景的初始化，需要每个验证码场景调用 initGeetest 方法单独进行初始化；如果一个场景下有多个验证入口，需要进行多次初始化。**

### 2\. 准备容器

和 ECharts 一样，我们需要事先准备一个容器盒子，用以盛放里面的验证组件。你可以如开头的 GIF 图片中所示，一直显示“点击按钮开始验证”，也可以像有些极简页面，再点击获取验证码之后，再弹出验证对话框。这里，我们使用 `el-dialog` 对话框快速搭建一个容器，来实现第二种场景：

ts

 代码解读

复制代码

`// src/components/GeeTest/index.tsx import { defineComponent } from "vue"; export default defineComponent({   name: "GeeTest",   props: {     modalValue: {       type: Boolean,       default: false     }   },   emits: ["update:modalValue"],   setup(props, ctx) {     return () => (       <el-dialog         class="gee-dialog"         modalValue={props.modalValue}         onUpdate:modalValue={boolean => ctx.emit("update:modalValue", boolean)}         title="短信验证"         width={300}         alignCenter         destroyOnClose       >         <div id="captchaBox" />       </el-dialog>     );   } });`

接着在登录页面中引入该组件，准备一个受控的开关，控制组件显示和隐藏：

tsx

 代码解读

复制代码

`import GeeTest from "@/components/GeeTest"; const geeVisible = ref(false); <template>     <GeeTest v-model="geeVisible" /> </template>`

### 3\. 封装渲染函数

我们先创建一个叫 `useGeeTest` 的 hook，将所有 GEETEST 相关的处理统统放进去，方便后续的取用与维护。

先添加一个名叫 `renderGeeTest` 的渲染函数：

ts

 代码解读

复制代码

`// src/components/GeeTest/hooks/useGeeTest.ts const useGeeTest = () => {     const captchaParams = ref(""); // 极验参数     const renderGeeTest = () => {}     return {         renderGeeTest     }; }`

这里的 `captchaParams` 是我们调用后端接口时获取到的，一开始是一个 JSON 字符串，需要我们解析成对象，里面将会包含 `initGeetest` 必要的配置参数：

参数

类型

说明

gt

字符串

验证 id，极验后台申请得到

challenge

字符串

验证流水号，服务端 SDK 向极验服务器申请得到

offline

布尔

极验API服务器是否宕机

new\_captcha

布尔

宕机情况下使用，表示验证是 3.0 还是 2.0，3.0 的 sdk 该字段为 true

除了以上四个必传参数外，还有一些可选的配置参数，比如样式（width）、展现形式（product）等，可以根据自己需求添加，参见[配置参数](https://link.juejin.cn?target=https%3A%2F%2Fdocs.geetest.com%2Fsensebot%2Fapirefer%2Fapi%2Fweb%23%25E9%2585%258D%25E7%25BD%25AE%25E5%258F%2582%25E6%2595%25B0 "https://docs.geetest.com/sensebot/apirefer/api/web#%E9%85%8D%E7%BD%AE%E5%8F%82%E6%95%B0")。

接着我们来实现这个函数：

ts

 代码解读

复制代码

``interface GeeResponseData {   gtData: {     gt: string;     challenge: string; // 验证流水号     success: number; // offline 状态：1 -> 正常 0 -> 宕机     new_captcha: number; // 宕机下使用：1 -> 3.0验证 0 -> 2.0验证   }; } const renderGeeTest = (callback?: (...arg: any[]) => any) => {     document.querySelector("#captchaBox").innerHTML = "";     const geeData = JSON.parse(captchaParams.value) as GeeResponseData;     if (!geeData) throw new Error("无效的图形校验参数");     const { gt, challenge, new_captcha, success } = geeData.gtData;     if (window.initGeetest) {         window.initGeetest(         {           // 必填参数           gt,           challenge,           new_captcha: new_captcha === 1,           offline: success !== 1           // 选填参数：           width: "100%",           product: "float",         },         captchaObj => {           document.querySelector("#captchaBox").innerHTML = "";           captchaObj.appendTo("#captchaBox");           captchaObj             .onSuccess(async () => {               const {                 geetest_challenge: challenge,                 geetest_seccode: seccode,                 geetest_validate: validate               } = captchaObj.getValidate();               callback && callback({ challenge, validate, seccode });             })             .onError((error: Record<"error_code" | "msg", string>) => {               throw new Error(`${error.error_code} ${error.msg}`)             });         }         );     } };``

`captchaObj`：使用初始化函数 `initGeetest` 后，在它的第二个参数（回调函数）中，能获取到一个`验证实例`，可以通过这个实例调用很多 [Web API 的方法](https://link.juejin.cn?target=https%3A%2F%2Fdocs.geetest.com%2Fsensebot%2Fapirefer%2Fapi%2Fweb%23appendTo-position "https://docs.geetest.com/sensebot/apirefer/api/web#appendTo-position")。

`captchaObj.appnedTo`：用于将验证按钮插到宿主页面，使其显示在页面上。接受的参数可以是 id 选择器，或者 DOM 元素对象。

`captchaObj.onSuccess(callback)`：监听验证成功事件，可以在验证成功后，进行二次验证（将组件验证通过后返回的结果再传给后端）。

`captchaObj.getValidate`：获取用户进行成功验证（`onSuccess`）所得到的结果，该结果用于进行服务端 SDK 进行二次验证，该方法返回一个对象，该对象包含 `geetest_challenge`，`geetest_validate`，`geetest_seccode` 字段，其他情况下返回 `false`。

`callback`：`onSuccess` 需要的回调，可以在获取到成功的结果后，发送请求进行二次验证。

### 流程图

为了方便大家理解，可以看下调用极验的流程图：

![Snipaste_2023-06-24_19-26-32.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/990efde311fd4b3b941b433f93694329~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

总结
--

本文我们首先讲解了下验证码的由来以及行为认证的概念；

其次，在项目中使用了 GEETEST 极验这个 SaaS 应用，主要就是两点：

1.  通过 CDN 部署，挂载 initGeetest 方法；
2.  获取 initGeetest 所需的参数，注册事件，拉起极验进行验证，通过验证后，将获得的结果返回给后端，后端二次验证成功后，即可发送 SMS 短信。

前期准备工作已就绪，在下一篇中，我们将一步步完整实现与后端的整个联调过程，看看从开始点击 “发送短信” 到 60S 倒计结束这中间究竟发生了什么？敬请期待。

参考资料
----

\-[Web 端部署文档](https://link.juejin.cn?target=https%3A%2F%2Fdocs.geetest.com%2Fsensebot%2Fdeploy%2Fclient%2Fweb "https://docs.geetest.com/sensebot/deploy/client/web")

\-[API 参考文档 | Web](https://link.juejin.cn?target=https%3A%2F%2Fdocs.geetest.com%2Fsensebot%2Fdeploy%2Fclient%2Fweb "https://docs.geetest.com/sensebot/deploy/client/web")