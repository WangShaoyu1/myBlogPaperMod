---
author: "小u"
title: "vercel推出的前端ai工具，一句话生成前端页面"
date: 2024-02-17
description: "今天来介绍一个好用工具：v0v0是Vercel推出的一款**「前端组件代码生成工具」**官方地址如下v0byVercel我们来进行一个体验我给他输入下面的指令Pleasebuild"
tags: ["前端","后端","React.js"]
ShowReadingTime: "阅读3分钟"
weight: 228
---
今天来介绍一个好用工具：v0

`v0`是`Vercel`推出的一款\*\*「前端组件代码生成工具」\*\*

官方地址如下

[v0 by Vercel](https://link.juejin.cn?target=https%3A%2F%2Fv0.dev%2F "https://v0.dev/")

我们来进行一个体验

我给他输入下面的指令

Please build a music player

也就是构建一个音乐器。

![image-20240217114709793](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3693e0442f7341f5aef3e6096bc747fb~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2461&h=886&s=79820&e=png&b=fefefe)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a74fb083ff84818a4324166bccbe755~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2461&h=886&s=79820&e=png&b=fefefe)

![image-20240217114725027](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c5fee73335a471080f426421145e45f~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2229&h=715&s=38365&e=png&b=fefefe)

可以看到他弄的这个还是比较简约的。

下面我又给了他优化建议

> I think this is too minimalist. Could you please make it more colorful and imitate the style of NetEase Cloud Music
> 
> 我觉得这个太过于简约了，请你给我弄的更加丰富多彩一点，并且模仿网易云音乐的风格

这个就是一个v1的优化版本

![image-20240217114946961](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53c63127b6454ee5b183eb53bdfa8e34~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2542&h=881&s=255545&e=png&b=fefefe)

因为我平常不怎么写前端，也不知道该如何描述一些业务的具体，我这里看了看别人生成的东西

> An ecommerce dashboard with a sidebar navigation and a table of recent orders. The side navigation should have 5 links Dashboard, Newsletters, Issues, Audience, Payments and billing. I need a sign in and register forms.
> 
> 一个电子商务仪表板，带有侧边栏导航和最近订单表。侧面导航应该有5个链接仪表板，时事通讯，问题，受众，支付和计费。我需要一份登录和登记表。

![image-20240217115113274](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dacf02710d4048f0a07f7826da71d0fa~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2540&h=904&s=115382&e=png&b=fefefe)

可以发现他生成的是真的很厉害。

目前他是支持react和html的代码

这个时候有人可能会问，

他和chatgpt有多大的区别？

我认为有下面的区别

0.  可以针对组件不同部分单独修改
1.  UI与样式分离

这里我最喜欢v0的功能就是他的可控性非常的强。

你可以单独选择一个组件进行优化迭代。

![image-20240217115718931](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6339bab2f9cc4643bd82b077c2bb7c23~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1397&h=962&s=78621&e=png&b=fefefe)

作为经常写后端的，对于前端不是很精确的人来说，

一个简单的页面，可控的页面管理，可以大大的提高开发的效率。

经过我的测试，大部分的业务上常见的界面，比如登录页，付款页，表格页等等。都是可以生成的不错的。

接下来说一下他生成的代码的一些详细。

`v0`生成的`React`组件代码中，样式与`UI`分别基于两个库：

*   样式：基于`TailwindCSS`
*   `UI`：基于[shadcn](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fui.shadcn.com%2F "https://link.zhihu.com/?target=https%3A//ui.shadcn.com/")

TailwindCSS是一种原子化的css

他的工作原理是扫描所有 HTML 文件、JavaScript 组件以及任何 模板中的 CSS 类（class）名，然后生成相应的样式代码并写入 到一个静态 CSS 文件中。

原子化这个概念是近年来兴起的

截至目前已经有部分网站借鉴或者使用原子化CSS的思想重构了自己的web网站，比较知名的网站有Facebook、Twitter、Github、swipperjs等。根据网上公开的信息，Facebook在使用原子化CSS思想重构之后，仅登录页面的413KB样式文件，减少为整个站点的74KB。

当然这个东西我在这里不做过多的讨论，这个东西我觉得值得每一个开发者去自己实践一下，前期的学习成本肯定是有的，但是非常的方便。同时也有一些缺点，比如无法实现复杂效果 这个是我再自己使用的时候发现的一个问题

css

 代码解读

复制代码

`/* 特殊伪元素 */ .list-item::before {   content: counter(name); } ​ /* 特殊伪类 */ .item:nth-child(n + 1) {   color: red; } .item:nth-child(n + 2) {   color: green; } .item:nth-child(n + 3) {   color: blue; } ​ /* 自定义动画 */ @keyframe boom {   0% {     transform: scale(1);   }   50% {     transform: scale(3);   }   100% {     transform: scale(0);   } }`

像这样一个简单的功能，用Tailwind就很难实现，当然也可能是我没找到如何实现。

对于这样的工具，我的看法就跟我看待chatgpt是一样的，他只是一个工具，无法完完全全的代替前端，与其担心会被代替，不如早点了解，早些使用，提高自己的开发效率。