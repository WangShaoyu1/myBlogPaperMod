---
author: ""
title: "调试移动web的版本答案：whistle+chii+ppanel"
date: 2023-09-11
description: "本文介绍移动端Web开发调试工具链，包括whistle、chii和ppanel，处理常见调试问题，提升调试效率，节省时间和精力。"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:0,comments:0,collects:0,views:2812,"
---
在移动端Web开发中，特别是嵌入到应用中的Web页面，开发者通常会遇到一系列的`调试难题`。本文将为你介绍一套移动端调试的`工具链`，包括`whistle`, `chii`, 和`ppanel`。这些工具能够有效地帮助你处理`95%以上`的常见调试问题，大大提升你的`调试效率`。

这套工具链的强大之处在于，它们能够协同工作，共同处理移动端Web开发中的调试问题。无论你是在处理`网络问题`，还是在寻找代码中的`错误`，这些工具都能为你提供强大的支持。

所以，如果你正在寻找一个能够提升你移动端Web开发调试效率的`解决方案`，不妨试试这套`工具链`。它们或许能帮你在调试过程中节省大量的`时间`和`精力`。

![004DC8B8.gif](/images/jueJin/b063a360f5a847c.png)

安装
--

`whistle`是基于`Node`的，所以需要先安装Node，不过前端的同学应该默认都安装了吧？这里就跳过了

安装whistle也是非常简单滴，和常规的npm装包一样

```
npm install -g whistle
```

whistle的基本用法

启动whistle

```sql
w2 start
```

指定端口启动whistle，默认端口为8899

```css
w2 start -p 8888
```

停止whistle

```arduino
w2 stop
```

重启whistle

```
w2 restart
```

![image-20230531224427781](/images/jueJin/f829a784093e4c3.png)

whistle的面板介绍
------------

进入whistle的面板后，咱们看到如下。

左侧有4个选项

*   **Network**：网络请求界面，咱们`抓包`后的数据都统一显示在这里
*   **Rules**：规则，咱们可以在这里进行一些`规则匹配`然后`替换数据`、`注入插件`等
*   **Value**：数据，这里可以定义一些想要的结果数据，配合`Rules`中的规则`劫持`并`替换数据`
*   **Plugins**：插件列表，这里主要是安装过的所有whistle`插件面板`，需要配合`Rules`中的规则对页面进行`注入`。

![image-20230531225051024](/images/jueJin/5694be0da3ad4a3.png)

配置代理
----

咱们可以通过`SwitchOmege`这个插件快速进行配置

新建一个`情景模式`，然后类型选择代理服务器。代理服务器填写127.0.0.1（即本机或者真实的ip地址），代理服务器端口即为whistle启动的端口。

![image-20230531154555690](/images/jueJin/86a7b6504c394d2.png)

![image-20230531225243631](/images/jueJin/a490b51e392b43d.png)

在chrome上将模式切换为whistle后，既可以将chrome中的流量`代理`到whistle，不想进行抓包则切换直接连接，如果挂了魔法可以选择系统代理。

![image-20230531155132053](/images/jueJin/cc256daac7b347e.png)

手机上的话，打开wifi的`高级选项`，`配置代理`即可，其中ip需要修改为电脑主机的ip地址（whistle启动的时候可以看到）。

![image-20230531230001500](/images/jueJin/ce7f1d617f554f1.png)

配置https
-------

通过上面的配置，小伙伴们是不是发现为啥`https`的流量无法拦截呢？

![004CF328.gif](/images/jueJin/d1b7025888cf4f7.png)

莫慌，因为需要配置一下`证书`。

先点击https，然后下载证书，并进行安装，然后安装证书的时候需要选中受信任的`根证书颁发机构`。

![image-20230531225356912](/images/jueJin/c95e88d804c9415.png)

![image-20230531225531627](/images/jueJin/3c66376531f0475.png)

![image-20230531225615737](/images/jueJin/00cb18fa08414c2.png)

安卓手机安装证书

在设置中找到`安装证书`，然后选择`ca证书`，继续选择`从存储设备安装证书`即可（不同的设备名称路径可能不太一样）

![image-20230531230831577](/images/jueJin/4d6bf7550dcf41e.png)

![image-20230531230813599](/images/jueJin/b572c78cdcd9464.png)

mac电脑安装证书（待补充）

ios手机安装证书（待补充）

筛选网站
----

whistle中筛选网站是比较简单的，点击settings按钮，通过弹窗中的`exclude filter`（不包含） 和 `include filter`（包含），来过滤对应的网址。

如下图，小羽这里就是将所有包含juejin.cn的网址给筛选出来。

![image-20230531231455698](/images/jueJin/afee24d398ea43b.png)

设置拦截规则
------

whistle中可以在rules中使用`正则`的方式来拦截你想要拦截的请求。

对了，rules页面中setting中的`use multiple rules`记得勾上，这样子就可以选择多个规则啦~

![image-20230617121138459](/images/jueJin/c989bd21427d464.png)

调整接口数据
------

这是比较常用的一种情况，比如咱们在开发页面的时候需要造一些`特殊的数据`。

咱们可以先通过rules对网站进行匹配，将数据修改成自己想要的数据即可。

主要有`file`和`host`两种方式，即代理到`本地文件`或者`其他域名/主机`。

f可以这么写

```bash
# 代理到本地文件
https://api.juejin.cn/user_api/v1/user/get file://本地路径
​
# 代理到host
https://api.juejin.cn/user_api/v1/user/get www.test.com
```

但是这样子并不是我所喜欢的，因为需要单独去维护一个文件或者启动一个服务。然后翻看官方文档后发现whistle中还有`values`的方案。

写法如下：

```bash
https://api.juejin.cn/user_api/v1/user/get resBody://{test.json}
```

比如`掘金签约作者`的这个title还不够体现本人`出尘的气质`，所以咱就手动给他修改一波。

![004C1E54.gif](/images/jueJin/d64888b8ef77419.png)

wtf，超出长度限制了！！！

![image-20230617122416566](/images/jueJin/e4437926bb4e425.png)

Perfect！！!

![image-20230617122757351](/images/jueJin/1d48d783ae94404.png)

绑定hosts，替代switchhosts
---------------------

`switchhost`是一款方便管理和一键切换多个hosts的工具。但是咱们用了whistle的话，完全可以直接使用`whistle`来`替代`switchhosts，而不必再去下载一个switchhosts了。

ps：简单说下，绑定hosts对开发有什么用。比如你开发的系统（a.test.com）是需要进行`单点登录`的，返回的`token`挂载在主域名（.test.com）的cookie下，如果咱们直接用localhost、127.0.0.1+启动的端口是无法访问到的，这时候绑定host的用处就出来了。

![image-20230617111153680](/images/jueJin/3f2c846ffd5d46c.png)

那么咱们怎么使用`whistle`对`hosts`进行`管理`呢？

举个例子：比如咱们想用`juejin`的`域名`来访问我们自己的网站，那该怎么处理呢？

直接把juejin指向127.0.0.1即可，然后通过juejin.cn:端口号，直接访问就可以啦。

但是一般来说咱们是不会直接访问某个端口的，而`switchhosts`是无法对`端口`进行`绑定`的，还需要有一层`nginx/apache`等服务器对端口进行处理。

而whistle还可以添加端口等各种参数，这就比switchhosts舒服太多了，比如说咱们访问vite的默认启动端口`5173`，只要这样子配置就可以了

![image-20230617111521719](/images/jueJin/6075c2a661c4466.png)

效果如下，可以看到咱们访问的域名是juejin.cn，但是显示的内容却成了`本地的内容`了。

![image-20230617113101920](/images/jueJin/46dbe5ae68f44a5.png)

chii
----

h5页面调试有很多工具，比如有`vconsole`、`eruda`、`mdebug`。这些工具都很好，但是对比上`chii`，你就会发现`chii`用起来会更加`得心应手`，超级哇塞。

![004AA0BC.jpg](/images/jueJin/a427c273d50041d.png)

> *   **实时预览**：Chii 提供了一个实时预览功能，可以让开发者实时查看移动端页面的效果。通过 Chii 提供的预览功能，开发者可以在开发过程中随时查看页面的显示效果，及时发现并修复问题。
> *   **调试功能**：Chii 提供了强大的调试功能，包括 console 面板、elements 面板和 network 面板。console 面板可以显示控制台输出的信息，方便开发者查看运行时的日志信息。elements 面板可以显示页面元素的详细信息，包括元素的样式、属性等。network 面板可以显示网络请求的详细信息，包括请求方法、URL、状态码等。
> *   **移动端兼容性**：Chii 支持多种移动设备，包括 Android、iOS 等。开发者可以通过 Chii 查看页面在不同设备上的显示效果，并进行相应的优化。

安装

```css
npm i whistle.chii -g
```

新建一个rule，名字为掘金，内容为

```arduino
juejin.cn whistle.chii://juejin
```

![image-20230911101726200](/images/jueJin/61ce71ebdc4542f.png)

访问掘金，然后打开plugins中的chii，点击对应的inspect

![image-20230908175252130](/images/jueJin/c59b3c56499b4eb.png)

![image-20230911101845161](/images/jueJin/bd5bd0ddd5274d9.png)

为了方便演示的截图，这里再单独开启一个edge浏览器作为移动端，模拟咱们日常调试的场景（咱们的chrome是无法直接操作edge中的内容的）。如下图，左侧是咱们的`chrome浏览器`，右侧为`edge浏览器（模拟手机端）`，可以发现edge中所有的内容都可以被咱们的chrome浏览器抓取了，并且咱们再左侧的chrome中可以快速的找到edge中对应的内容，并随意调试。(ps：若要像小羽这样抓pc端的页面，则需要添加whistle 系统代理，命令行运行：w2 prxoy)

![2023-09-11 10-21-23.2023-09-11 10_34_38](/images/jueJin/c0aee67270f14a0.png)

可能有些同学还是不太了解为啥要这样子？chrome、edge不是本来就有这个devTool吗？为啥还要一个`chii`来打开这个devtool？

嘿嘿，大兄弟，你是不是忘了这可是`移动端web`开发。 手机上的chrome好像是不能直接打开`devTool`的？ 此外你的web应用很有可能是以`webview`的方式嵌入到app中的，怎么打开这个调试工具呢？

想到这里，你是不是觉得这个工具就很`哇塞`啦~

ppanel
------

帅气的小伙伴们已经在前面的一些截图中发现了，为啥小羽的juejin里面多了这么一个东西？

![image-20230617123055704](/images/jueJin/22e3eda6f92342c.png)

这就是咱们要介绍的第三个东西啦，`ppanel`（一款高颜值的性能面板）

> 主要监控 FPS、内存使用，以及 web-vitals 相关性能参数
> 
> *   FPS：页面帧率，即 1s 内页面渲染的次数。
> *   内存：使用的内存，单位 MB
> *   LCP： 用于衡量标准报告视口内可见的最大内容元素的渲染时间。为了提供良好的用户体验，网站应努力在开始加载页面的前 `2.5` 秒内进行 `最大内容渲染` 。
> *   FID： 即记录用户和页面进行首次交互操作所花费的时间 `。FID` 指标影响用户对页面交互性和响应性的第一印象。为了提供良好的用户体验，站点应努力使首次输入延迟小于 `100` 毫秒。
> *   CLS：衡量视觉稳定性，为了提供良好的用户体验，页面的 CLS 应保持小于 0.1。
> *   FCP：代表首次内容绘制。它测量了用户单击链接或输入 URL 后第一块内容出现在用户屏幕上的时间。这是一个重要的用户体验指标，因为它有助于确定用户可以多快地查看和与您的网站交互。
> *   INP：代表交互到下一次绘制。它测量了用户与您的网站交互和下一次屏幕上进行视觉更新之间的时间。这个指标很重要，因为它有助于确定用户可以多快地与您的网站交互。
> *   TTFB：代表首字节时间。它测量了用户从服务器请求资源后，用户的浏览器接收到第一个数据字节所需的时间 。快速的 TTFB 意味着网站正在快速提供内容，这对于用户体验很重要。

小伙伴们可以通过这个面板来监听自己的页面是否有掉帧，内存是否有溢出，以及获取FPS等相关的参数，然后根据这些相关的参数来优化自己的项目。

首先咱们安装相关的npm包

```css
npm i whistle.ppanel -g
```

然后，就是配置whistle相关的`拦截规则`即可。

比如，咱们要给`juejin`整个网站加上`ppanel`，那就这样子写就阔以啦。

![image-20230617124754963](/images/jueJin/a1654f061f3145e.png)

总结
--

本文详细介绍了移动端Web开发中的调试工具链，包括`whistle`, `chii`, 和`ppanel`。这些工具能协同工作，解决请求数据问题，寻找代码中的错误，大大`提升调试效率`。

*   **whistle**是一个基于Node的调试工具，可以对`网络请求`进行拦截和修改，支持筛选网站和设置拦截规则，还可以用来替代switchhosts进行hosts管理。
*   **chii**是一个`实时预览和调试`移动端页面的工具，支持`console面板`、`elements面板`和`network面板`，可以实时查看并修改移动端页面的显示效果和数据。
*   **ppanel**是一个高颜值的性能面板，可以监控`FPS`、`内存使用`以及`web-vitals`等相关的性能参数，有助于优化项目性能。

总的来说，这套工具链能够有效地处理移动端Web开发中的调试问题，提升开发效率，值得开发者们尝试和使用。

如果看这篇文章后，感觉有收获的小伙伴们可以`点赞`+`收藏`哦~

![img](/images/jueJin/ca7efb5c1fd04b1.png)