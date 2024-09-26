---
author: "肥学"
title: "js实现滑块验证功能"
date: 2022-06-06
description: "点击查看活动详情演示前戏滑块验证码是在网站、APP等应用中常见的一种验证方式，通过按照一定规则滑动滑块到指定位置完成"
tags: ["前端","JavaScript"]
ShowReadingTime: "阅读3分钟"
weight: 399
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第10天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

演示
==

![请添加图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/375269ba3582426cb1a25f525b62d027~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

前戏
==

滑块验证码是在网站、APP等应用中常见的一种验证方式，通过按照一定规则滑动滑块到指定位置完成验证，才可以进行下一步操作。滑块验证码有两种设计，一种是在滑动框内“一滑到底”即完成验证的，还有一种是滑动滑块拼合拼图完成验证的。由于拼图式的滑块验证码安全性更高，趣味性更强，所以多数网站或APP都选择了拼图式的滑块验证码。

拼图式的滑块验证码在业务应用中有三种展现形式，触发式、嵌入式和弹出式。触发式即鼠标光标移入验证条后才显示验证拼图，不影响网页原有的排版。嵌入式即拼图验证区域直接嵌入展示在网页，清晰直观，便于用户使用。弹出式一般可以绑定自有验证方式，点击验证后才弹出滑动验证码，比如用户输入用户名和密码，点击登录后，页面弹出滑块验证码。

源码介绍
====

### 主页样式设计

css

 代码解读

复制代码

  `.bxs-row {             margin-bottom:12px;         }         .logo-box {             width:404px;             margin:120px auto;             border:1px solid #e5e5e5;             border-radius:4px;             box-shadow:0 4px 18px rgba(0,0,0,0.2);             position:relative;             overflow:hidden;             height:360px;         }         .login {             position:absolute;             width:320px;left:0;             top:0;             padding: 42px 42px 36px;             transition:all 0.8s;         }         .username,.password,.btn {             height: 44px;             width: 100%;             padding: 0 10px;             border: 1px solid #9da3a6;             background: #fff;             text-overflow: ellipsis;             -webkit-box-sizing: border-box;             -moz-box-sizing: border-box;             box-sizing: border-box;             -webkit-border-radius: 4px;             -moz-border-radius: 4px;             -khtml-border-radius: 4px;             border-radius: 4px;             -webkit-box-shadow: none;             -moz-box-shadow: none;             box-shadow: none;             color: #000;             font-size: 1em;             font-family: Helvetica,Arial,sans-serif;             font-weight: 400;             direction: ltr;             font-size:13px;         }         .submit {             background-color: #0070ba;             color:#fff;             border:1px solid #0070ba;         }         .submit:hover {             background-color:#005ea6;         }         .verBox {             position:absolute;             width:100%;             text-align:center;             left:404px;             top:0;             opacity:0;             transition:all 0.8s;             padding-top:55px;         }         .err {             margin:12px 0 0;             line-height:12px;             height:12px;             font-size:12px;             color:red;         }`

### 滑块验证部分

这里使用了一个工具`img_ver.js`网上都是关于vue的没有这个简单

javascript

 代码解读

复制代码

`imgVer({             el:'$("#imgVer")',             width:'260',             height:'116',             img:[                 'images/ver-1.png',                 'images/ver-2.png',             ],             success:function () {                 //alert('执行登录函数');                 $(".login").css({                     "left":"0",                     "opacity":"1"                 });                 $(".verBox").css({                     "left":"404px",                     "opacity":"0"                 });                 $(".tips").html('你是不是不知道账号密码！？？？');                 $("#logo").attr("src",'images/login-err.png')             },             error:function () {                 //alert('错误什么都不执行')             }         });`

### img\_ver内部

滑块移动和验证部分

javascript

 代码解读

复制代码

  `ctx.moveTo(X, Y);     ctx.lineTo(X + d, Y);     ctx.bezierCurveTo(X + d, Y - d, X + 2 * d, Y - d, X + 2 * d, Y);     ctx.lineTo(X + 3 * d, Y);     ctx.lineTo(X + 3 * d, Y + d);     ctx.bezierCurveTo(X + 2 * d, Y + d, X + 2 * d, Y + 2 * d, X + 3 * d, Y + 2 * d);     ctx.lineTo(X + 3 * d, Y + 3 * d);     ctx.lineTo(X, Y + 3 * d);  ctx_l.moveTo(X, Y);     ctx_l.lineTo(X + d, Y);     ctx_l.bezierCurveTo(X + d, Y - d, X + 2 * d, Y - d, X + 2 * d, Y);     ctx_l.lineTo(X + 3 * d, Y);     ctx_l.lineTo(X + 3 * d, Y + d);     ctx_l.bezierCurveTo(X + 2 * d, Y + d, X + 2 * d, Y + 2 * d, X + 3 * d, Y + 2 * d);     ctx_l.lineTo(X + 3 * d, Y + 3 * d);     ctx_l.lineTo(X, Y + 3 * d); ctx_s.moveTo(X, Y);     ctx_s.lineTo(X + d, Y);     ctx_s.bezierCurveTo(X + d, Y - d, X + 2 * d, Y - d, X + 2 * d, Y);     ctx_s.lineTo(X + 3 * d, Y);     ctx_s.lineTo(X + 3 * d, Y + d);     ctx_s.bezierCurveTo(X + 2 * d, Y + d, X + 2 * d, Y + 2 * d, X + 3 * d, Y + 2 * d);     ctx_s.lineTo(X + 3 * d, Y + 3 * d);     ctx_s.lineTo(X, Y + 3 * d);`

其他的我就不展示了都是位置坐标。