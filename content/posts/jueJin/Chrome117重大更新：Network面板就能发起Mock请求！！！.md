---
author: "前端开发爱好者"
title: "Chrome117重大更新：Network面板就能发起Mock请求！！！"
date: 2023-09-22
description: "前端开发在调试过程中，经常需要各种`不同的数据`来反复调试，所以我们前端程序员会经常在脚手架中集成`mock`或者通过`代理`的方式去`hack`的实现"
tags: ["前端","Chrome"]
ShowReadingTime: "阅读4分钟"
weight: 763
---
> 哈喽,大家好 我是`xy`👨🏻‍💻。今天给大家分享一个 `Chrome 117` 更新中最实用的一个功能：`在 Network 面板中发送 mock 请求` ！！！

前端开发在调试过程中，经常需要各种`不同的数据`来反复调试，所以我们前端程序员会经常在脚手架中集成 `mock` 或者通过`代理`的方式去`hack`的实现，但是现在再也不用这么麻烦了，`Chrome 117` 原生就支持了，而且体验相当丝滑。

他可以实现什么效果呢？

*   拦截 `HTML` 文件，读本地文件
*   拦截 `Js` 文件，读本地文件
*   拦截 `Css`，读本地文件
*   拦截 `请求`，读本地文件

也就是，一个页面上所有的`资源`包括图片，理论上其内容都是可以`自由修改`，并且保存在本地的。

修改返回响应数据
--------

想要修改接口返回的数据，设置成特定的数据，首先打开 `网络(Network)` 面板，找到你需要`Mock`的接口，右键然后选择`替换内容(Override content)`：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ccf445710a474c109f5f030a021a48c6~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=956&h=636&s=122295&e=png&b=2a2a2a)

这时候浏览器会提示：`选择要用来存储替换文件的文件夹`，这个文件夹主要作用是用来`保存 Mock 的替换文件`，方便下次 `Mock` 请求直接使用

点击 `选择文件夹`:

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/344976404f134e43929857e95f28b37d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=956&h=665&s=116509&e=png&b=2a2a2a)

选择我们刚刚新建的文件夹，我是在电脑桌面上新建了一个空的文件夹 `chrome_devtools`, 选择之后会提示`允许完整的访问权限`, 一定要注意点击 `允许`:

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d33c5b0e7a31414f84de92500099c6e8~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=956&h=663&s=120765&e=png&b=2b2b2b)

这个时候 `DevTools` 会自动跳转到 `源代码/来源(Sources)` 面板，并且会生成对应请求的 Mock 文件：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f555a5720a1456da541f6f51770219b~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=956&h=636&s=55007&e=png&b=2a2a2a)

编辑 `Mock` 文件，自定义一个 `JSON` 数据格式然后保存：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ae76a2c4cdd41d48da669183cda27e7~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=956&h=636&s=53440&e=png&b=2a2a2a)

重新发起请求，发现被拦截的接口会有一个`高亮的标识`，鼠标移入会提示对应的信息，并且响应的数据已经变成了我们`修改后`的数据

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31b27b6a70534c9595714956034c8a4f~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=956&h=636&s=80704&e=png&b=292929)

当然除了修改接口返回的内容以外，我们还可以修改返回的`响应头`

修改返回的响应头
--------

想要修改接口返回的响应头，增加我们想要返回的 `key:value`，首先打开 `网络(Network)` 面板，找到你需要`Mock`的接口，右键然后选择`替换标头(Override headers)`：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6d37e780c1846099ddf5352035ea286~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=956&h=636&s=119186&e=png&b=2b2b2b)

右侧面板会直接出现 `添加标头` 按钮：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/712b98e4c4c649d5a6e5b954b63ca12d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=956&h=636&s=103359&e=png&b=2b2b2b)

点击添加，这里我们添加一个 `Test-Header: testHeader` 做个简单的测试

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88e3fd2af07242f68ccf4c49fab1a179~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=956&h=636&s=102992&e=png&b=2b2b2b)

也可以直接打开 `源代码/来源(Sources)` 面板，找到对应的文件 `.headers` 文件中直接添加，两种添加方式效果一样

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff9a0c63f9be430db0fe35c3a5ac3147~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=956&h=636&s=57420&e=png&b=2a2a2a)

再次重新发起请求，发现响应头中已经返回了我们设置的 `Test-Header: testHeader`

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8377393b66843f3bd50f2ddc5f9ed06~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=952&h=636&s=104237&e=png&b=2b2b2b)

查看我们开始新建的 `chrome_devtools` 文件夹，发现 `Mock` 的数据都已经保存到文件夹中了

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad3b4a5f2615492ab9f32735080b0ef2~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=721&h=182&s=14949&e=png&b=191919)

清除拦截的 Mock 数据
-------------

当我们 `Mock` 数据程序调试完成之后，想要调用真实的接口数据，这个时候一定要记得清除 Mock 替换文件：

打开 `源代码/来源(Sources)` 面板，取消勾选 `启用本地替换` 或者直接点击`清除`图标清除即可：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/976815727bbc42ea882f1d4eeb3f38d1~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=956&h=636&s=54255&e=png&b=2a2a2a)

写在最后
----

> `公众号`：`前端开发爱好者` 专注分享 `web` 前端相关`技术文章`、`视频教程`资源、热点资讯等，如果喜欢我的分享，给 🐟🐟 点一个`赞` 👍 或者 ➕`关注` 都是对我最大的支持。

欢迎`长按图片加好友`，我会第一时间和你分享`前端行业趋势`，`面试资源`，`学习途径`等等。

添加好友备注【**进阶学习**】拉你进技术交流群

关注公众号后，在首页：

*   回复`面试题`，获取最新大厂面试资料。
*   回复`简历`，获取 3200 套 简历模板。
*   回复`React实战`，获取 React 最新实战教程。
*   回复`Vue实战`，获取 Vue 最新实战教程。
*   回复`ts`，获取 TypeScript 精讲课程。
*   回复`vite`，获取 Vite 精讲课程。
*   回复`uniapp`，获取 uniapp 精讲课程。
*   回复`js书籍`，获取 js 进阶 必看书籍。
*   回复`Node`，获取 Nodejs+koa2 实战教程。
*   回复`数据结构算法`，获取数据结构算法教程。
*   回复`架构师`，获取 架构师学习资源教程。
*   更多教程资源应有尽有，欢迎`关注获取`