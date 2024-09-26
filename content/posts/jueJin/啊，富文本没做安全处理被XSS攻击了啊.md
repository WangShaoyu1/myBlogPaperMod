---
author: "天天鸭"
title: "啊，富文本没做安全处理被XSS攻击了啊"
date: 2024-09-18
description: "相信很多前端小伙伴项目中都用到了富文本，但你们有没有做防XSS攻击处理？最近的项目由于比较紧急我也没有处理而是直接正常使用，但公司内部有专门的安全部门针对测试，然后测出来富文本被XSS攻击了。"
tags: ["前端","JavaScript","Vue.js"]
ShowReadingTime: "阅读4分钟"
weight: 749
---
前言
==

相信很多前端小伙伴项目中都用到了富文本，但你们有没有做防`XSS`攻击处理？最近的项目由于比较紧急我也没有处理而是直接正常使用，但公司内部有专门的安全部门针对测试，然后测出来富文本被`XSS`攻击了，而且危险级别为高。

啊这....，那我就去解决一下吧，顺便从`XSS`和解决方案两个角度记录到下来毕竟好久没更新文章了。

先说说什么是XSS攻击？
============

**简述**：`XSS`全称`Cross-Site Scripting`也叫跨站脚本攻击，是最最最常见的网络安全漏洞，其实就是攻击者在受害者的浏览器中注入恶意脚本执行。这种攻击通常发生在 `Web` 应用程序未能正确过滤用户输入的情况下，导致恶意脚本被嵌入到合法的网页中。 执行后会产生窃取信息、篡改网页、和传播病毒与木马等危害，后果相当严重。

### `XSS`又有三大类

### 1、存储型 XSS即Stored XSS

恶意的脚本被放置在目标服务器上面，通过正常的网页请求返回给用户端执行。

**例如** 在观看某个私人博客评论中插入恶意脚本，当其他用户访问该页面时，脚本会执行危险操作。

### 2、反射型 XSS即Reflected XSS

恶意的脚本通过 `URL` 参数或一些输入的字段传递给目标的服务器，用户在正常请求时会返回并且执行。

**例如** 通过链接中的参数后面注入脚本，当用户点击此链接时，脚本就会在用户的浏览器中执行危险操作。

### 3、DOM 基于的 XSS即DOM-based XSS

恶意的脚本利用 `DOM（Document Object Model）`操作来修改页面内容。 这种类型的 `XSS` 攻击不涉及服务器端的代码操作，仅仅是通过客户端插入 `JavaScript` 代码实现操作。

富文本就是属于第一种，把脚本藏在代码中存到数据库，然后用户获取时会执行。

富文本防XSS的方式？
===========

网上一大堆不明不白的方法还有各种插件可以用，但其实自己转义一下就行，根本不需要复杂化。

当我们不做处理时传给后台的富文本数据是这样的。

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/78d632cb08bd4247b5a7acfdbbc1bb52~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5aSp5aSp6bit:q75.awebp?rk3s=f64ab15b&x-expires=1727515819&x-signature=U%2FOgmr%2BbEmJ0hTx%2BhlpLVG3afYU%3D) 上面带有标签，甚至有`src`和`script`之类的操作，在里面放一些脚本真的太简单了。

因此，我们创建富文本成功提交给后台的时候把各种`<>/\`之类危险符号转义成指定的字符就能防止脚本了。

如下所示，方法参数`value`就是要传递给后台的富文本内容。

javascript

 代码解读

复制代码

  `export const getXssFilter = (value: string): string => {     // 定义一个对象来存储特殊字符及其对应的 HTML 实体     const htmlEntities = {       '&': '&amp;',       '<': '&lt;',       '>': '&gt;',       '"': '&quot;',       '\'': '&#39;',       '\\': '&#92;',       '|': '&#124;',       ';': '&#59;',       '$': '&#36;',       '%': '&#37;',       '@': '&#64;',       '(': '&#40;',       ')': '&#41;',       '+': '&#43;',       '\r': '&#13;',       '\n': '&#10;',       ',': '&#44;',     };        // 使用正则表达式替换所有特殊字符     let result = value.replace(/[&<>"'\\|;$%@()+,]/g, function (match) {       return htmlEntities[match] || match;     });        return result;   };`

此时传给后台的富文本参数是这样的，把敏感符号全部转义。

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/6f37c566ca134c85bd5985c177a307fd~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5aSp5aSp6bit:q75.awebp?rk3s=f64ab15b&x-expires=1727515819&x-signature=SK1353V0dXkW4E7AI%2FyJ%2BntPevU%3D)

但展现给用户看肯定要看正常的内容啊，这里就要把内容重新还原了，这步操作可以在前端完成，也可以在后端完成。

如果是前端完成可以用以下方法把获取到的数据进行转义。

javascript

 代码解读

复制代码

`// 还原特殊字符 export const setXssFilter = (input) => {   return input   .replace(/&#124;/g, '|')   .replace(/&amp;/g, '&')   .replace(/&#59;/g, ';')   .replace(/&#36;/g, '$')   .replace(/&#37;/g, '%')   .replace(/&#64;/g, '@')   .replace(/&#39;/g, '\'')   .replace(/&quot;/g, '"')   .replace(/&#92;/g, '\\')   .replace(/&lt;/g, '<')   .replace(/&gt;/g, '>')   .replace(/&#40;/g, '(')   .replace(/&#41;/g, ')')   .replace(/&#43;/g, '+')   .replace(/&#13;/g, '\r')   .replace(/&#10;/g, '\n')   .replace(/&#44;/g, ','); }`

但是。。。。
======

上面只适合使用于纯富文本的场景，如果在普通文本的地方回显会依然触发危险脚本。如下所示

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/22d0945a66944cab871695829a626afd~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5aSp5aSp6bit:q75.awebp?rk3s=f64ab15b&x-expires=1727515819&x-signature=JAdM7OD37sk8WLNkdrSBIi4kyEY%3D)

其实直接转义后不还原即可解决，但由于是富文本这种情况比较特殊情况，不还原就失去文本样式了，怎么办？？

最终解决方案是对部分可能造成`XSS`攻击的特殊字符和标签进行转义处理，例如：`script、iframe`等。

示例代码

less

 代码解读

复制代码

  ``export const getXssFilter = (value: string): string => {     // 定义一个对象来存储特殊字符及其对应的 HTML 实体     const htmlEntities = {       '&': '&amp;',       '\'': '&#39;',       '\r': '&#13;',       '\n': '&#10;',       'script': '&#115;&#99;&#114;&#105;&#112;&#116;',       'iframe': '&#105;&#102;&#114;&#97;&#109;&#101;',       // 'img': '&#105;&#109;&#103;',       'object': '&#111;&#106;&#115;&#116;',       'embed': '&#101;&#109;&#98;&#101;&#100;',       'on': '&#111;&#110;',       'javascript': '&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;',       'expression': '&#101;&#120;&#112;&#114;&#101;&#115;&#115;&#115;&#105;&#111;&#110;',       'video': '&#118;&#105;&#100;&#101;&#111;',       'audio': '&#97;&#117;&#100;&#105;&#111;',       'svg': '&#115;&#118;&#103;',       'background-image': '&#98;&#97;&#99;&#107;&#103;&#114;&#111;&#117;&#110;&#100;-&#105;&#109;&#97;&#103;&#101;',     };        // 使用正则表达式替换所有特殊字符     let result = value.replace(/[&<>"'\\|;$%@()+,]/g, function (match) {       return htmlEntities[match] || match;     });        // 额外处理 `script`、`iframe`、`img` 等关键词     result = result.replace(/script|iframe|object|embed|on|javascript|expression|background-image/gi, function (match) {       return htmlEntities[match] || match;     });        return result;   };``

效果只会对敏感部分转义

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/4b1641208d6540628771cfe0e1887f28~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5aSp5aSp6bit:q75.awebp?rk3s=f64ab15b&x-expires=1727515819&x-signature=WcHNF4Ur%2F9QduJtb7HYCMoBtBtM%3D) 但这种方案不用还原转义，因为做的针对性限制。

小结
==

其实就是对特殊符号转换后还原的思路，相当的简单。

如果那里写的不好或者有更好的建议，欢迎大佬指点啦。