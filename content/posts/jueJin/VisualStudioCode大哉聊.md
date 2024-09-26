---
author: "小梦大半就是我"
title: "VisualStudioCode大哉聊"
date: 2020-05-05
description: "简称VSCode，是一个由微软开发的同时支持Windows、Linux、macOS等操作系统的代码编辑器。作为前端开发的我，在用过很多IDE之后最终选择了它，只因为它：免费且开源，整合了Terminal、Git，拥有丰富的extension，内置了Emmet、…"
tags: ["VisualStudioCode"]
ShowReadingTime: "阅读4分钟"
weight: 862
---
> 工欲善其事 必先利其器

Visual Studio Code是什么
---------------------

简称 VSCode，是一个由微软开发的同时支持 Windows、Linux、 macOS等操作系统的代码编辑器。 下文都会用 VSCode 的名称来代指 Visual Studio Code

为什么使用 VSCode
------------

> 还不是因为穷（不是）XDDD

作为前端开发的我，在用过很多 IDE 之后最终选择了它，只因为它：免费且开源，整合了 Terminal、Git，拥有丰富的 extension，内置了 Emmet、Snippets还有 IntelliSense。 支持用户个性化配置，例如改变主题颜色、键盘快捷方式等各种属性和参数。

相较于 Vim 门槛降低了不少，而且有图形化的支持，如果习惯了 Vim 上的快捷键，在 VSCode 上也有[extension](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FVSCodeVim%2FVim "https://github.com/VSCodeVim/Vim")把vim快捷方式迁移过来，使用上完全不会有问题。

相较于 sublime 比它更新快，大概每月都会有一两个更新，并且 sublime 不是开源的。

相较于 Atom , 这个现在应该就是尴尬的存在，微软收购了 Github ，Atom 又是 Github 出品的，VSCode 是微软出品的，所以。。。 在打开大文件的速度上，相比之下 VSCode 可能稍快。

相较于 WebStorm，VSCode 比它轻量，而且是免费的。

简单来说就是：别人有的，VSCode也有，如果没有，以后也会补上。

下载与安装
-----

1.  **portable** 版本，也就是下载的 **.zip** 版本 打开[Download](https://link.juejin.cn?target=https%3A%2F%2Fcode.visualstudio.com%2F%23alt-downloads "https://code.visualstudio.com/#alt-downloads")，选择 .zip 选项，根据自己的系统位数来进行下载

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/5/171e49b2e560ea62~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

下载完成之后放到自己想要的盘符来进行解压，例如 D:  
然后在目录中新建一个 data 的文件夹

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/5/171e49b2e761baaa~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

该文件夹将用于包含所有VS Code数据，包括会话状态，首选项，扩展名等。 直接双击 `Code.exe` 即可启用。 由于是便携版，失去了安装版的鼠标右键菜单，可以参考[右键打开](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fzmdblog%2Fp%2F10202193.html "https://www.cnblogs.com/zmdblog/p/10202193.html")

2.  安装版

选择 **System Installer** 来进行安装

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/5/171e49b2ec2abecb~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/5/171e49b2dc696ee1~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/5/171e49b2e90be3be~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

选择一个安装位置

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/5/171e49b2eaed1356~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

一点点设置
-----

> 许多人推荐的安装完第一件事就是装个中文扩展，我是不推荐这么做，本来英语就不好，难道不应该想着去提升？毕竟写代码与英文打交道的时候还是多，可能有时候需要读一些英文文档等等，逼迫自己一下，我觉得没什么坏处，即便碰到不会的单词也可以通过翻译来解决。 还有 Settings Sync 这个用来同步配置的扩展，装上这个是很方便，但是殊不知有很多扩展甚至是我们安装完之后用过一两次就再也没有用过的，扩展装的多了是很吃内存的，而且 VSVCode 也会变得运行也会变得缓慢，如果我们不安装 Settings Sync，而是重新开始，这样我们就能进行检视扩展，把一些没用的剔除掉，也可以让 VSCode 跑的快一些。

主题设置

这里我使用的是 [Better Solarized](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fginfuru%2Fvscode-better-solarized "https://github.com/ginfuru/vscode-better-solarized")

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/5/171e49b3c0cf52bb~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

相对来说比较柔和，对眼睛不会造成太过刺激的感觉

文件图标

[Material Icon Theme](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FPKief%2Fvscode-material-icon-theme "https://github.com/PKief/vscode-material-icon-theme")

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/5/171e49b392bd8dc2~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

字体

这里推荐一个字体预览网站 [Dev Fonts](https://link.juejin.cn?target=https%3A%2F%2Fdevfonts.gafi.dev%2F "https://devfonts.gafi.dev/")

我使用的是 [Ubuntu Mono](https://link.juejin.cn?target=https%3A%2F%2Ffonts.google.com%2Fspecimen%2FUbuntu%2BMono "https://fonts.google.com/specimen/Ubuntu+Mono")

大概长这样

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/5/171e49b391986aee~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

这些设置都是因人而定的，看各自的喜好了，根据自己喜欢的设置就好。 设置都会被写入 settings.json 文件。可以使用快捷键 Ctrl+Shift+P 输入 settings 然后选择Open Settings 来打开。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/5/171e49b38d002002~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/5/171e49b3ce1998f0~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

设置tabSize

据说有一篇报道做了一个采访把 tabSize 设为 2 的人，普遍薪水比较高，所以，想要获得高薪水你应该设置一下它（误。

使用快捷键 `Ctrl+，` 然后输入 tabsize 就可以看到了

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/5/171e49b3c4e688af~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

设置 Emmet

`"emmet.triggerExpansionOnTab": true`

有 Emmet 这样我们在输入一些代码是会有提示，但是有时候代码提示会不见，这时候我们就要重新输入一下让它出现，很不方便，设置完这个后输入完直接按 Tab 键就可以了。

信息遮挡问题

有时鼠标移到某个标签上，会弹出一些介绍信息，遮挡了一些代码，让我们阅读造成困扰，可以设置延迟显示来解决，设置的大一些

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/5/171e49b422104dc2~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

`"editor.hover.delay": 10000` 设置10秒后显示

快捷键
---

Ctrl+Shift+P 或者 Fn+F1 : 打开命令面板。

Ctrl+N：新建文件

Ctrl+D：选中内容遇到空格会中断

Ctrl+F：查找内容

Ctrl+Shit+F：在整个文件夹中查找内容

多行打 Code

Ctrl+D 连续按D

一种方式是按住 Alt+D，然后鼠标点击左键，可以用方向键控制位置。

一种方式是 Ctrl+Shift+Alt+方向上下键。

最后
--

VSCode 从第一个预览版发布至今也有五年时间，从最初的弱小，到如今一步一步发展壮大，得益于广大的社区和微软在开源方面的投入,相信在未来还会进一步持续下去。

扫码关注
====

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/5/171e4a87cda3163b~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)