---
author: "政采云技术"
title: "初探Web客户端追踪技术"
date: 2023-04-26
description: "前言 案例1 当我们首次浏览网站时，在网页的下方位置经常会出现提示，询问是否允许使用 Cookie 来提供服务和流量。为了不被挡住浏览的内容，我们经常会下意识地点击“接受”，然后继续浏览。看似无害而有"
tags: ["浏览器","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:34,comments:0,collects:39,views:4533,"
---
![文章顶部.png](/images/jueJin/b637793da67b4e0.png)

![阿余.png](/images/jueJin/8634ee5ae07f406.png)

> 想获取更多原创好文，请搜索公众号关注我们吧~ 本文首发于政采云前端博客：[初探Web客户端追踪技术](https://link.juejin.cn?target=http%3A%2F%2Fzoo.zhengcaiyun.cn%2Fblog%2Farticle%2Fwebclient "http://zoo.zhengcaiyun.cn/blog/article/webclient")

前言
==

案例1
---

当我们首次浏览网站时，在网页的下方位置经常会出现提示，询问是否允许使用 Cookie 来提供服务和流量。为了不被挡住浏览的内容，我们经常会下意识地点击“接受”，然后继续浏览。看似无害而有害增强你在这个网站上的体验的操作，然而很多人没有意识到，当你点下按钮后，网站会塞给你一块饼干（Cookie），接着用这个饼干来换取你的相关信息，甚至能追踪你在网站上的足迹。例如你在当前页面语言选择了“中文”，那么下次再进入到这个网站时，会默认帮你选择“中文”语言。

![2488387931.jpg](/images/jueJin/2b5d4d423e92430.png)

案例2
---

在某个网站登录账号时，用户有时候会忘记密码，输入多次后触发了网站的风险机制（如验证码校验），这个时候用户换了另外一个账号登录，然而对于新的账号登录，网站仍然会让当前设备用户处于风险机制中。其原因之一便是你的设备指纹在当前某个时间段内被列入风险用户名单中，在这段时间内，你会持续的触发风险机制。

![20230213100234.jpg](/images/jueJin/3315ed7f2a4a481.png)

常见追踪技术
======

Cookie追踪
--------

Cookie 是很多网站用于追踪用户行为的手段，服务端会在 HTTP/HTTPS 的响应头部返回 Set-Cookie 字段，浏览器将其自动保存。

对于属于当前网站的 Cookie 的所属域（Domain）中，又可以分为第一方 Cookie（以自身网址后缀存储）和第三方 Cookie（以非自身网站后缀存储）。

![2301781751.jpg](/images/jueJin/a6e5c0792fa9436.png)

当我们在微博上浏览新闻资讯，这个时候可以会刷到某购物网站内嵌的广告，这时候浏览器会同时存在微博和该购物网站的 Cookie ，并且还会惊讶的发现，微博给我们推送的资讯和推荐的广告都符合我们近期浏览的相关内容，这个时候我们便清楚，原来我们的访问行为已经被分析计算出来。

### 第一方 Cookie

第一方 Cookie 常指的是由当前用户访问的域生成的 Cookie。

当你使用账号登录后，网站会返回属于你的 Cookie，该 Cookie 的所属域是属于当前网站的，Cookie 中还记录着关于你身份的相关信息。使用明确身份在某宝PC购物网站上搜索了“充电器”，用相同的用户登录移动端APP，会得到相似类型的推荐。

![1606075787.jpg](/images/jueJin/b580eb0b001a463.png)

![image-20221120170035193_副本.png](/images/jueJin/090666623f1e43c.png)

### 第三方 Cookie

第三方 Cookie 常指某个 Cookie 的域并不是当前所访问网站的域，一般通过 JS 脚本，图片链接和 iframe 等技术生成。常见的有：

0.  广告网络商。 如熟悉的 [Google Adsense](https://link.juejin.cn?target=https%3A%2F%2Fadsense.google.com%2Fstart%2F "https://adsense.google.com/start/")，谷歌通过它们识别大量用户行为，在多个网站中进行广告投放；
1.  大平台下拥有多个子平台，进行某些用户数据跟踪。 如上购物网站，无论是 PC 还是移动端，都源于是同一个平台，即相同域下面。而第三方 Cookie 针对的是不同域下的平台，去预判用户行为和推荐用户的商品。如果在上述购物网站旗下的另一平台上，也对应着推送用户曾经浏览的商品。

![image-20221120170704254.png](/images/jueJin/68915b532da646f.png)

### Flash Cookie

我们常说的 Cookie 一般都是指基于浏览器的 HTTP Cookie。可想，一台用户电脑上安装了多个浏览器，虽然登录的身份是同一个用户，但是却对应着多个 HTTP Cookie，且 HTTP Cookie 存在着过期时间和存储大小限制，所以Cookie 存在着被自动销毁的场景，这个时候 Flash Cookie 技术便可以解决这些问题。

Flash Cookie 顾名思义即通过 Flash 插件来实现本地存储 Cookie，也称之为 Share Object。尽管各个不同的浏览器是隔离的，但是每个浏览器都可以通过Flash 获取 Cookie，除非人为主动去删除，否则 Cookie 可以被持久存储在本地共享对象中。

提及 Flash Cookie，不得不提到 Evercookie 技术。该技术于 2010 年十大黑客技术排行榜中位居第二。Evercookie 使用不同的存储技术将 Cookie 缓存在浏览器、系统中，其中包含着 HTTP Cookie， HTML5 的 LocalStorage/ SessionStorage/globalStoage，Flash Cookie 等多种技术，在用户清除了浏览器 Cookie 数据之后仍能将数据重新恢复。但随着各大浏览器不支持 Flash 技术，Flash Cookie 技术也随着不攻自破。

浏览器指纹追踪
-------

上述的 HTTP Cookie 和 Supper Cookie 都有可能存在着被删除或者禁用的风险，并且随着广告拦截器和 Cookie 清除工具越发高明，单单 Cookie 这项技术就不似那么稳妥了，于是众人又将目光投向浏览器指纹。浏览器指纹是通过对多种特征信息综合分析计算后，生成无状态的客户端指纹，指纹具有唯一性，能够被识别、追踪用户行为和隐私数据。

### 浏览器的基本特征

所有浏览器应该具备的特征信息称之为浏览器的基本特征其中包含浏览器信息，计算机信息，硬件信息等，这些特征信息综合后得出的指纹仍然会存在相同的碰撞，所以尽管基本特征已经够多，但仍然无法确定用户的身份，还需要更多的信息来参与计算得出最终唯一的指纹。[查看当前浏览器的相关信息](https://link.juejin.cn?target=https%3A%2F%2Fwww.whatismybrowser.com%2F "https://www.whatismybrowser.com/")。

特征信息

获取方式

浏览器中的浏览器扩展/插件

IE: ActiveXObject  非IE: window.navigator.plugins

浏览器是否执行 JavaScript 脚本

script标签中判断脚本是否执行

浏览器是否接受各种 Cookie 和Supper Cookie的信息

window.navigator.cookieEnabled

浏览器是否发送 Do Not Track 标头

window.navigator.doNotTrack

浏览器是否支持触屏

document.hasOwnProperty("ontouchstart")

浏览器语言

window.navigator.language

user-Agent

window.navigator.userAgent

时区偏移量

new Date().getTimezoneOffset()

地区经纬度

HTML5 Geolocation

操作系统

window.navigator.platform

屏幕信息

window.screen

b2

b3

### 硬件指纹

音频指纹：AudioContext

利用设备音频设置，把播放音频文件的方式模拟成一个正弦函数，再把正弦函数转化成哈希函数，作为附加熵，结合浏览器的基本特征信息，生成音频指纹。

使用 HTML5 AudioContext API 进行指纹识别，AudioContext 指纹是计算机音频堆栈本身的属性，并不会收集计算机播放和录制的声音。

![1393337913.jpg](/images/jueJin/60ceeb29290b423.png)

Canvas 指纹

使用 HTML5 提供的 Canvas API 绘制隐藏元素图片，相同的 Canvas 代码在不同的计算机上绘制出的结果也会出现差异，尽管在肉眼上很难看出区别。这是因为浏览器、操作系统、GPU 和图形驱动器任一设备的不同，都会导致绘制图画时渲染的方式不一样，而这恰恰是指纹的唯一识别。

![1054475719.jpg](/images/jueJin/66722bc4eb5b4b6.png)

WebRTC 指纹

浏览器提供 WebRTC 功能，通过 UDP 协议建立连接，从而获取到公共 IP 地址、本地 IP 地址和媒体设备（如摄像头、麦克风）的数量及其哈希值。由于是通过 UDP 协议，所以即便是使用了代理，网站也能够获取到真实的公共和本地 IP 地址。

![3970425793.jpg](/images/jueJin/7653e482c7fa418.png)

WebGL 指纹

0.  WebGL 是一个 JavaScript API,可在任何兼容的 Web 浏览器中渲染高性能的交互式 3D 和 2D 图形。不同组合的硬件设备会将该图形转换成唯一的hash值 综合指纹
1.  分析计算指纹的方法还有许多，以上四种巧妙的方法仍然会出现指纹碰撞的几率。但通过各种综合计算出哈希值的指纹，能够提高它的唯一性。目前已有开源的[浏览器指纹库](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffingerprintjs%2Ffingerprintjs "https://github.com/fingerprintjs/fingerprintjs") ，可查询浏览器属性并从中计算出哈希值，生成浏览器指纹。

防范措施
----

### 无痕浏览器

目前基本主流浏览器都支持无痕模式，但是只能拦截住一部分的浏览器追踪痕迹。

### 禁用 JavaScript 和 Cookie

此方法乃为杀敌一千自损八百，前端大多主流的框架都是由 JavaScript 加载执行渲染，禁用 JavaScript 可能会导致页面异常。但是可以通过禁用第三方的 JavaScript 和 Cookie，但是仍需慎用

### 禁用 WebRTC 和 Geolocation

通过浏览器的设置，禁用 WebRTC 和 Geolocation，但是此行为也会影响部分网站的体验。

### 使用防追踪浏览器

[候鸟浏览器](https://link.juejin.cn?target=https%3A%2F%2Fwww.ehouniao.com%2F "https://www.ehouniao.com/")通过欺骗站点所能够获取到的参数，修改数字指纹，使得网站读取的与你真实的指纹不同，从而达到防追踪的目的。

结论
==

浏览器的追踪技术是一把双刃剑，它建立了用户个人信息和网站之间的连接，合理地使用能够大大提高用户的体验，但是同时也存在着隐私泄漏。此前，谷歌和亚马逊均因违规使用 Cookie 而面临着巨额罚单，315 晚会上也多次曝光多家互联网公司窃取侵犯用户隐私信息。尽管这些都骇人听闻，但在国际上大部分国家抓取 Cookie 并不违法，只要合理使用，用户也不用过分恐慌，毕竟无论是 Cookie 还是浏览器指纹能提供的用户信息相对有限。尊重科学精神，提倡文明上网。

参考文献
====

*   flash cookie - 百度百科
*   [硬件指纹](https://link.juejin.cn?target=https%3A%2F%2Fdocs.multilogin.com%2Fl%2Fzh%2Farticle%2FaJHHdYrdmY-audio-context "https://docs.multilogin.com/l/zh/article/aJHHdYrdmY-audio-context")
*   [浏览器指纹解读](https://link.juejin.cn?target=https%3A%2F%2Fblog.51cto.com%2Flixi%2F5377134 "https://blog.51cto.com/lixi/5377134")
*   [WebGL](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWebGL_API%23%25E6%258C%2587%25E5%258D%2597%25E5%2592%258C%25E6%2595%2599%25E7%25A8%258B "https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API#%E6%8C%87%E5%8D%97%E5%92%8C%E6%95%99%E7%A8%8B")

推荐阅读
----

[了解 ZRender 和 Echarts](https://juejin.cn/post/7220800667590099005 "https://juejin.cn/post/7220800667590099005")

[JavaScript中的 this 指向](https://juejin.cn/post/7212990981700272186 "https://juejin.cn/post/7212990981700272186")

[0基础实现项目自动化部署](https://juejin.cn/post/7207787191623647288 "https://juejin.cn/post/7207787191623647288")

[uni-app 黑魔法探秘 （一）—— 重写内置标签](https://juejin.cn/post/7205216832834584613 "https://juejin.cn/post/7205216832834584613")

[前端 DDD 框架 Remesh 的浅析](https://juejin.cn/post/7200037182927585335 "https://juejin.cn/post/7200037182927585335")

开源作品
----

*   政采云前端小报

**开源地址 [www.zoo.team/openweekly/](https://link.juejin.cn?target=http%3A%2F%2Fzoo.zhengcaiyun.cn%2F "http://zoo.zhengcaiyun.cn/")** (小报官网首页有微信交流群)

*   商品选择 sku 插件

**开源地址 [github.com/zcy-inc/sku…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fzcy-inc%2FskuPathFinder-back "https://github.com/zcy-inc/skuPathFinder-back")**

招贤纳士
----

政采云技术团队（Zero），包含前端（ZooTeam）、后端、测试、UED 等，Base 在风景如画的杭州，一个富有激情和技术匠心精神的成长型团队。政采云前端，隶属于政采云研发部。团队现有 90 余个前端小伙伴，平均年龄 27 岁，近 3 成是全栈工程师，妥妥的青年风暴团。成员构成既有来自于阿里、网易的“老”兵，也有浙大、中科大、杭电等校的应届新人。团队在日常的业务对接之外，还在物料体系、工程平台、搭建平台、性能体验、云端应用、数据分析及可视化等方向进行技术探索和实战，推动并落地了一系列的内部技术产品，持续探索前端技术体系的新边界。

如果你想改变一直被事折腾，希望开始能折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变既定的节奏，将会是“5 年工作时间 3 年工作经验”；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊… 如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的前端团队的成长历程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 [ZooTeam@cai-inc.com](https://link.juejin.cn?target=mailto%3AZooTeam%40cai-inc.com "mailto:ZooTeam@cai-inc.com")

![底图-v3.png](/images/jueJin/63372e91db394c6.png)