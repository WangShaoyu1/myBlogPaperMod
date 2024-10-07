---
author: "前端之虎陈随易"
title: "陈随易：VSCode1.88更新记录"
date: 2024-04-05
description: "🐯关于作者大家好，我是前端之虎陈随易。目前是：农村程序员(自2020年离职至今都在农村待着)独立开发者(有多个已经在盈利中的产品)自由职业者(睡到自然醒，困就马上睡)个人创业者"
tags: ["前端","后端","程序员"]
ShowReadingTime: "阅读8分钟"
weight: 231
---
🐯 关于作者
-------

大家好，我是前端之虎陈随易。

目前是：

*   农村程序员 (自 `2020` 年离职至今都在农村待着)
*   独立开发者 (有多个已经在盈利中的产品)
*   自由职业者 (睡到自然醒，困就马上睡)
*   个人创业者 (注册了自己的公司，为产品服务)
*   自驾爱好者 (经常自驾，边看风景边敲码)
*   小说写作者 (断更 `10年`，目前构思新作品中)
*   开源推进者 (自 `2019` 年持续开源至今)

欢迎跟我交朋友：

*   微信：`chensuiyime`
*   扣扣：`24323626`
*   公众号：`陈随易`
*   网站：[陈随易的个人网站 https://chensuiyi.me](https://link.juejin.cn?target=https%3A%2F%2Fchensuiyi.me "https://chensuiyi.me")

如果微信加不上，可以公众号留言你的微信号，我加你。

让我们一起积极向上，为自己而努力奋斗！

一点碎碎念
-----

这个版本挺期待的，因为 `v1.87版本` 搭载的 `Electron` 是 `v27` 版本。

而在 `2024年4月4日` 发布了 `v1.88` 版本后，我查看了一下 `关于` 信息，显示的是 `Electron v28` 版本。

这个版本有什么特点呢？

![picture 0](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/176e8cbb6afd42b9b755a3819f20fb95~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=862&h=1329&s=184494&e=png&b=fffefe)

由以上截图可以看到，`Electron v28` 版本正式支持了 `ESM`。

那么什么是 `ESM` 呢？

这是 `JavaScript` 的官方模块化标准，其实就是用 `export`、`import` 这几个概念替换 `require`、`exports`。

同时呢，也不得不提到一个在前端界举足轻重的男人 `sindresorhus`。

![picture 1](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb16d3f8e2be4a988083bfb68ca70aea~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1474&h=1070&s=261370&e=png&b=fdfcfc)

截至目前，他一共发布了 `1234` 个 `npm包`，而且，很多包都成为了现代化前端开发的基建。

也就是说，如果他的包被删除掉，那么整个前端界将无法正常运转。

那么他在 `2021年2月28日` 创建了这个文件 [esm-package.md](https://link.juejin.cn?target=https%3A%2F%2Fgist.github.com%2Fsindresorhus%2Fa39789f98801d908bbc7ff3ecc99d99c "https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c")

倡导大家把项目和生态都变成 `ESM` 模式，以推进 `JS` 的标准化进程。

简而言之，意思就跟让大家不要用 `IE`，要用 `Chrome` 差不多。

我自己写 `VSCode` 插件的时候，是无法直接使用 `import`，`export` 语法 (`ESM`) 来发布插件的，必须被编译成 `require`，`exports` 语法 (`Commonjs`)。

怎么说呢，对于结果来说，无伤大雅，插件也可以正常运转。

但是，作为一个有着偏执症的程序员来说，有更好，更官方，更标准的语法不能使用，确实还是有那么一点点膈应。

这不，上次 `v1.87` 版本发布的时候，激动地查看了 `Electron` 版本，稍有失望地看到是 `v27` 版本。

那么本次发布了 `v1.88` 版本，看到 `Electron` 变成 `v28` 后，惊喜地以为可以在 `VSCode` 插件开发中使用 `ESM` 了。

于是马上写了个 `Demo` 测试，没想到还是不能如愿，那么继续等待吧。

那么其实，之所以费劲巴拉地说这么一段呢，是想告诉屏幕前的读者们，写代码也可以很有趣，也可以有自己的技术追求。

很多东西可能无所谓，但是也可能让我们在编程的道路上，走得更远，希望我们可以减少浮夸和躁动，发现编程之美。

那么下面正式开始介绍 `VSCode v1.88` 的本次更新内容 (`只挑选重要的分享`)

正文开始
----

### 开放编辑器的自定义标签

![picture 2](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ef6d703fff9f4c2c8964bdec833df2dc~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2560&h=1416&s=1357810&e=gif&f=649&b=23231e)

如上动图，当我们打开了几个文件，但是文件名都一样的时候，有时候就不能直观地看出，文件属于哪个目录。

那么我们就可以找到 `workbench.editor.customLabels.patterns` 配置，通过 `glob` 语法，去匹配文件，并使用 `${filename}`，`${extname}`，`${dirname}` 和 `${dirname(N)}` 这几个变量来自定义显示名称。

本功能可以通过 `workbench.editor.customLabels.enabled` 开关来启用和禁用。

**随易点评**

`VSCode` 编辑器最近的几个版本呢，在人性化体验上面真的是做得越来越棒了。

我个人也早已将 `VSCode` 作为自己写代码，写文章，写故事的唯一编辑器了。

1.  `glob` 语法
    1.  `*`：代表任意数量的字符 (包括零个字符)。例如，`*.txt` 会匹配所有以 `.txt` 结尾的文件，而 `a*` 会匹配所有以字母 `a` 开头的文件。
    2.  `?`：代表任意单个字符。例如，`a?.txt` 会匹配 `a1.txt` 或 `ab.txt` 等，但不会匹配 `abc.txt`。
    3.  `\[...\]`：代表方括号内的任意单个字符。例如，`a[bc].txt` 会匹配 `a.txt`、`ab.txt` 或 `ac.txt`，但不会匹配 `ad.txt`。
    4.  `\[^...\]` 代表不在方括号内的任意单个字符。例如，`a[^b].txt` 会匹配 `a.txt` 和 `ac.txt`，但不会匹配 `ab.txt`。

### 滚动锁定

![picture 3](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a86d325f8ff44a88c8e17b752ab2ac1~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2486&h=1402&s=939758&e=png&b=1e1e1e)

可以搜索并使用 `Toggle Locked Scrolling Across Editors` 命令，将窗口锁定，多个窗口同步滚动。

适用于不同的文件行与行对比。

**随易点评**

这个也是体验增强的内容，对 `VSCode` 越来越爱不释手了。

曾经有很多人问我，为什么不用 `WebStorm`？

我就喜欢 `VSCode` 这种，每个月月底或月初，给我不断带来惊喜的编辑器~~。

### 底部活动栏

![picture 4](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1e6fed0bd8e43b7ab708a6f1490e483~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1143&h=782&s=194754&e=png&b=1a1a1a)

可以设置 `workbench.activityBar.location` 配置为 `bottom` 或 `top`，将默认位于左侧的 `活动栏`，移动到下方或上方。

**随易点评**

这个功能我自己用不到，因为安装的插件多一点的话，横放比竖放更挤，容易误触。

不过，对于有需要的朋友来说，可以多出左侧大概 `一厘米` 的空间，还是不错的。

### 搜索编辑器单击行为

![picture 5](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/248d6a38219e47b0878affbc0a3ac4d1~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1624&h=1161&s=290045&e=png&b=282c34)

这个功能官方没有提供示意图，我测试了下，大家根据图中的标记序号看过来。

首先呢，当我们搜索关键字的时候，其实是可以点击 `(1)` 处位置，打开一个搜索编辑页面 `(2)` 的。

那么，在本次的 `v1.88` 版本更新之前呢，我们点击 `(3)` 处的文件名，是不会有任何变化的。

在 `v1.88` 版本更新之后，却可以显示一个弹框，并显示该文件的内容，鼠标滚动就能看到文件的全部内容。

![picture 6](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d060fca18d84683b8b7aeee2864cbb6~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1271&h=553&s=78658&e=png&b=282c34)

这个功能呢，我们可以通过设置 `search.searchEditor.singleClickBehaviour` 为 `peekDefinition` 来开启。

**随易点评**

爱了，爱了，如此细微之处，竟然考虑如此周到，不愧是宇宙第一编辑器！

### 搜索增强之目录吸附

![picture 7](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df41b457205d4ecfac05ae3d7f9aa9c9~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1361&h=785&s=1049774&e=gif&f=49&b=292c34)

请注意搜索框下方，在搜索文件的下拉面板中进行鼠标滚动时，该文件所属的目录并不会随着鼠标滚动，而是吸附在顶部。

这样，我们就能非常方便且直观地看到文件所属的目录啦~

**随易点评**

又是一个体验增强，看起来很小的一个改变，但是却能给用户体验带来神清气爽的感觉。

很多时候，程序员做产品，只追求功能上的强大，代码上的技巧，却忽视了用户的体验。

那么在这个方面，不放像 `VSCode` 的开发团队学学吧~

### 扩展更新重载

![picture 8](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96a83def80f0454ca3773928b60005c7~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=400&h=345&s=61991&e=png&b=f8f8f8)

当扩展更新的时候，之前是需要重新加载整个编辑器才能生效的。

那么在本次更新之后呢，我们可以仅仅只是 `重新加载扩展`，而不用重新打开一遍编辑器啦。

**随易点评**

很棒的改进，不过呢，如果你是远程开发，使用了 `WSL`，`SSH` 或者 `Dev Container` 的话，还是需要重新加载整个编辑器的。

### 小地图部分标题

![picture 9](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f00f73a269094304852c45f0a14b445d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1200&h=938&s=278428&e=png&b=fefefe)

可以在代码中使用 `//#region` 注释或 `MARK:` 标记，这样的话，将会在小地图中显示该注释或标记的名称，方便我们查看代码范围。

**随易点评**

小地图使用者的一个小惊喜，我不喜欢用小地图，因为我的屏幕就这么大。。。

### 重命名建议行为

![picture 10](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0d7a0bd128b44089c96ac1216aef137~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1828&h=532&s=960115&e=gif&f=327&b=1d1c19)

选择某个变量，按下 `F2` 后，将会出现一个输入框，同时也会显示该变量相关的建议。

当通过鼠标上下键切换列表内容时，输入框也会同步变化。

按下回车后，所有该同名变量都会同步改变。

**随易点评**

有用的功能。

### 终端粘性滚动透明度支持

![picture 11](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2435f2a2688464ebef645379c9ba2f3~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=651&h=281&s=106597&e=png&b=181818)

如上图所示，在终端显示文件列表后，鼠标滚动时，文件所在的目录也会吸附在顶部。

同时呢，目前支持该吸附行可以设置透明度啦，这样就不会挡住滚动到该位置的文件名称了。

**随易点评**

好！

### TypeScript 5.4

当前版本，内置的 `TypeScript` 升级到 `v5.4` 版本啦。

带来了类型检测和智能感知上的提升，也修复了一些语言层面的 `bug`。

### 在 Markdown 中更智能地插入图像和链接

![picture 12](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27484fa6e38549ab8f517598590f2e93~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1056&h=476&s=866513&e=gif&f=500&b=1e1d1a)

当复制并粘贴文件到 `markdown` 文件中时，可以智能地判断是否生成图片的 `markdown` 链接了。

**随易点评**

我个人不喜欢自带的这个功能，我用的是一个专门处理在 `Markdown` 文件中插入图片的一个扩展 `Markdown Image`。

扩展的地址在这 \[[marketplace.visualstudio.com/items?itemN…](https://link.juejin.cn?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Dhancel.markdown-image "https://marketplace.visualstudio.com/items?itemName=hancel.markdown-image")\] `https://marketplace.visualstudio.com/items?itemName=hancel.markdown-image`。

### 提交消息生成改进

为了提高生成的提交信息的质量，`v1.88` 版本开始，将会使用最近的 `10个` 仓库提交信息作为参考。

**随易点评**

对于不想写提交信息，又不想乱写提交信息的朋友来说，这是非常有用的改进。

不过，好像需要购买了 `Github Copilot` 套餐才可以用？

### `Electron` 更新到 `v28`

自 `VSCode v1.88` 开始，内置的 `Electron` 版本终于走到了 `v28` 了。

不过，正如我本文开头所说，开发扩展还是不支持 `ESM` 语法。

这是我最期待的 `VSCode` 更新，让我们继续拭目以待吧，希望 `VSCode` 越来越好！