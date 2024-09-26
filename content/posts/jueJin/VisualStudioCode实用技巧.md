---
author: "请叫我小鲁同学"
title: "VisualStudioCode实用技巧"
date: 2024-02-13
description: "12个VisualStudioCode实用技巧，如快速打开文件、多光标选择、选中当前行等，快速提高工作效率。"
tags: ["VisualStudioCode"]
ShowReadingTime: "阅读2分钟"
weight: 844
---
[查看原文](https://link.juejin.cn?target=https%3A%2F%2Facnc572rk3x4.feishu.cn%2Fwiki%2FE9NfwgUWGiFqZEkZWCQcRTHwn8c%3Ffrom%3Dfrom_copylink "https://acnc572rk3x4.feishu.cn/wiki/E9NfwgUWGiFqZEkZWCQcRTHwn8c?from=from_copylink")

> 本文键盘快捷键为 Windows，其它平台可参考 [官方文档](https://link.juejin.cn?target=https%3A%2F%2Fcode.visualstudio.com%2Fdocs%2Fgetstarted%2Ftips-and-tricks%23_keyboard-reference-sheets "https://code.visualstudio.com/docs/getstarted/tips-and-tricks#_keyboard-reference-sheets")

快速打开文件
======

键盘快捷键：`Ctrl+P`

![快速打开](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/892b3347b82a4f628ebfefa15a6e7178~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1280&h=720&s=512652&e=gif&f=26&b=1e1f1c)

快速打开最近打开过的（文件夹和工作区）
===================

键盘快捷键：`Ctrl+R`

![打开最近打开过的](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2a1ceb6e04847e78bb96c94724af4e7~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1024&h=768&s=115448&e=png&b=1d1d1d)

命令行
===

VS Code 拥有功能强大的命令行界面（CLI），可以自定义启动编辑器的方式，以支持各种情况。

Shell

 代码解读

复制代码

`# open code with current directory code . # open the current directory in the most recently used code window code -r . # open diff editor code --diff <file1> <file2> # open file at specific line and column <file:line[:character]> code --goto package.json:10:5 # see help options code --help`

多光标选择
=====

要在任意位置添加光标，使用 `Alt+Click`（macOS 上使用 `Option+Click`）。

![多光标](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30bdb5b455a441349edb4f78e07009a7~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=596&h=216&s=313421&e=gif&f=225&b=22211d)

要在当前位置上方或下方设置光标，请使用：

键盘快捷键：`Ctrl+Alt+Up` 或者 `Ctrl+Alt+Down`

你可以使用 `Ctrl+Shift+L` 在当前选区的所有出现处添加其他光标。

![当前选区添加光标](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3db69c8225e341078468c14f62327c69~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=574&h=338&s=250444&e=gif&f=30&b=1e1e1e)

如果不想/添加当前选区的所有出现项，可以使用 `Ctrl+D` 代替。这只会选择所选项之后的下一个出现项，因此你可以逐个添加所选项。

![将光标逐个添加到当前选区的下一个出现项](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08a3aa67e6eb4b83b390c1b7a0c65e86~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=562&h=214&s=359753&e=gif&f=292&b=23221e)

向上/下复制行
=======

键盘快捷键：`Shift+Alt+Up` 或者 `Shift+Alt+Down`

![向下复制行](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94d0482f2e0246a9b32ecaaa7138e6e3~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=777&h=210&s=81570&e=gif&f=23&b=292a23)

向上/下移动行
=======

键盘快捷键：`Alt+Up` 或者 `Alt+Down`

![移动行](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd3ddd141209402eb1213ff62624cd74~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1039&h=1003&s=506458&e=gif&f=34&b=1f1f1f)

前往文件中的符号
========

键盘快捷键：`Ctrl+shift+O`

![通过符号查找](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1552798203842c297a2e99a9891ea4f~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=803&h=952&s=737754&e=gif&f=26&b=222222)

导航至指定行
======

键盘快捷键：`Ctrl+G`

![导航至指定行](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53140bbe89fc411ebc18f83150fee061~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=708&h=114&s=4735&e=png&b=232323)

文本转换命令
======

你可以使用命令面板中的**变换**命令将选定文本变换为大写、小写和标题大小写。

![文本转换命令](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e54cd544d4c94910a65e245de65cef25~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1205&h=227&s=5538&e=png&b=252526)

选中当前行
=====

键盘快捷键：`Ctrl+L`

![选中当前行](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9a7dab6fda14d928957dc689cfb4356~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=764&h=100&s=165362&e=gif&f=108&b=23221d)

查找所有引用
======

选择一个符号，然后键入 `Shift+Alt+F12` 打开 References 视图，该视图中会显示文件的所有符号。

![查找所有引用](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd1c2b332e844894891d44b259391c5b~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1024&h=556&s=969599&e=gif&f=348&b=201f1b)

Git 分支切换
========

通过状态栏轻松切换 Git 分支

![分支切换](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a901d71bcfab4a5685f10b65e6554eef~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1022&h=768&s=1556966&e=gif&f=410&b=1d1c19)

总结
==

本文介绍了一些 Visual Studio Code 实用技巧，更多内容请查看 [官方文档](https://link.juejin.cn?target=https%3A%2F%2Fcode.visualstudio.com%2Fdocs%2Fgetstarted%2Ftips-and-tricks "https://code.visualstudio.com/docs/getstarted/tips-and-tricks")。