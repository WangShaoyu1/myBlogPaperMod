---
author: "水墨寒"
title: "VisualStudioCode入门(译)"
date: 2018-05-04
description: "查如何在命令行启动VsCode找到的，安利一下"
tags: ["前端"]
ShowReadingTime: "阅读12分钟"
weight: 847
---
实质上，Visual Studio Code是一款代码编辑器，像许多其他代码编辑器一样，VS Code的左边采用了一个共同的用户界面和资源管理器的布局，它显示了所有你可以访问的文件和文件夹,它的右边是一个编辑器，显示你打开过的文件内容。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/4/1632964da683ee96~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)_image_

### 文件，文件夹和项目

VS Code是基于文件和文件夹的，你可以用VS Code打开一个文件和文件夹。在此之上，VS Code有读取和利用由不同框架和平台定义的项目文件的优势。比如，你打开的文件包含一个或多个package.js,project.json,tsconfig.json和项目文件，VS Code能读取这些文件并使用它们来提供额外的功能。在编辑中，它们像丰富的自能感知。

### 基本布局

VS Code有一个简单直观的布局，它提供最大化的编辑空间，同时留下足够空间来浏览和访问你的文件夹或项目全部上下文。它的用户界面分为五个方面：

*   编辑器：来编辑你的文件。你可以同时打开三个的编辑。
*   侧边框：包含不同的视图。在你的项目工作的时候，视图像资源管理器来帮助你。
*   状态栏：显示打开的项目和编辑的文件的相关信息。
*   视图栏：位于最左边的视图栏，可以让你在视图之间切换并给你更多的特定于上下文指示
*   面板：在编辑区下面有不同的面板，面板有输入或调试信息，错误和警告或一个集成终端。

当你每次打开VS Code，它跟你上次关闭它时的状态一样。文件夹，布局，打开的文件都被保存。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/4/1632964da652546c~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png) _image_

VS Code允许同时打开三个可视编辑器，这样你可以编辑或查看并排一起的三个文件。在编辑区顶部区域，每个被打开的文件都有选项卡头部（Tabs）

> 提示：侧边框移动到右侧（View > Move Side Bar）,切换显示/隐藏 `⌘B` 。

### 分栏编辑

你最多可以并排的打开三个编辑器。

如果你已经打开一个编辑，你有很多方法打开其他编辑器，而且新编辑器会出现在当前编辑器一边。方法如下：

*   按住 `Ctrl` (Mac:'Cmd')，同时点击一个文件
*   `⌘`+`\` 组合可以把一个编辑器分裂为两个。
*   右击文件然后点击 `Open the side`
*   点击编辑器右上角的 `Split Editor` 按钮
*   把文件拖拽到编辑器的两侧

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/4/1632964da65008c7~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png) _image_

每次你打开一个文件的时候，编辑器将显示当前文件的内容。如果你有2个编辑器并排着，并且你想打开一个文件出现在编辑器的右边，在打开这个文件前，务必确保那个编辑器被选中（通过点击编辑器里面）。

当你有一个或多个编辑器被打开过，而且想快速在他们之间切换 `Ctrl` (Mac:'Cmd')+1，2或3

> 提示：你可以缩放编辑器，也可以对他们重新进行排序。拖拽编辑器的标题区域到其他位置。拖拽编辑器的边缘缩放编辑器。

### 资源管理器

在你的项目里，资源管理器是被用来浏览，打开，管理所有文件和文件夹的。

用VS Code打开你的文件夹后，该文件夹的内容在资源管理器里是展开的，在这儿你可以做很多操作：

*   创建，删除，重命名文件和文件夹
*   用拖拽移动文件和文件夹
*   通过右击菜单浏览所有选项

> 提示：你可以拖拽VS code外部文件到资源管理器里来复制它们

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/4/1632964da67966cc~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png) _image_

VS Code与其他工具非常和谐，特别是命令行工具，如果你想用在VS Code被打开的文件夹上下文运行一个命令行工具，右键点击文件夹并选择 `Open in Command` (mac和Linux：`Open in Termainal`)。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/4/1632964dd5150eb5~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)_image_

你也可以右击一个文件或文件夹并选择·Reveal in Explorer·（mac：`Reaveal in Finder` ,Linux: `Open Containing Folder` ）。

> 提示：用`⌘P`通过文件的名称可以快速的搜索和打开一个文件。

在默认的情况下，VS Code排除来自资源管理器的一些文件（比如：.git）。用`files.exclude` 来设置规则隐藏来自资源器的文件和文件夹。

> 提示：隐藏像Unity的 `\*.meta` ,Typescript项目里的 `\*.js` 的驱动原文件是非常有用的。在Typescript文件里，你可以修改 `"**/*.js": {"when": "$(basename).ts"}` 来排除生成的JavaScript。

### 打开编辑器

在资源管理器的顶部有标有 `OPEN EDITORS` 的部分，这是当前文件或预览列表。这些文件是你在工作中用VS Code打开过的。比如，按照下面操作，一个文件会被列到 `OPEN EDITORS` 中。

*   对文件进行更改
*   在资源管理器双击一个文件
*   打开一个不属于当前文件夹的文件

### 配置编辑器

VS Code给你许多选项来配置编辑器。你可以通过 `User Setting` 配置全局，或者通过 `Workspace Setting` 配置每个项目或者文件夹。在 `setting.json` 中值是被生效的。

*   选择 File > Preferences > User Settings （或者`⇧⌘P`跳出输入框,输入user,并且回车），打开`User Setting.json`
*   选择 File > Preferences > Workspace Settings（或者`⇧⌘P`跳出输入框,输入worksp,并且回车），`Workspace Setting.json`

> Mac用户注意：`Preferences` 菜单在 `Code`里，不是 `File`中，比如：Code > Preferences > User Settings

在窗口的左边你将看到VS Code的 `Default Setting` ,并且在窗口右边你可以编辑 `Settings.json` 。从 `Default Setting` 中你可以很容易的查看和复制配置。

编辑你的设置之后，用 `⌘S` 保存你的配置，它们会立即生效。

### 保存/自动保存

默认情况下，VS Code需要用 `⌘S` 保存重新设置的数据到磁盘里。

然而，VS Code能很容易开启自动保存，在你配置延迟后或者焦点离开编辑器后自动保存你的更改文件。自动保存一旦被开启，就不需要手动去保存文件。

打开 `User Setting` 或者 `Workspace` 配置自动保存，找到如下相关设置：

*   `files.autoSave` ：设置值为`off`表示关闭自动保存，`afterDelay` 保存文件后延迟自动保存，`onFocusChange` 焦点移出编辑器后就会自动保存。
*   `files.autoSaveDelay` ： `files.autoSave` 的值是 `afterDelay` 时，就可以设置自动保存的延迟时间。

### 搜索文件

VS Code允许你在当前被打开的文件夹里快速搜索所有文件。使用 `⇧⌘F` 并且输入你想搜索的内容。搜索结果被分组到包含的关键词的文件中，搜索结果中每个文件有包含关键词的数量以及文件位置。展开一个文件可以看到这个文件包含关键词列表。点击关键词就能在当前编辑器里查看它。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/4/1632964df590806c~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)_image_

> 提示：在搜索框里只支持正则表达式

你可以通过 `⇧⌘J` 配置高级搜索选项。这将显示附加字段配置搜索

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/4/1632964dfb6c16a7~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png) _image_

在搜索框下面有两个输入框，你可以包含和排除文件。点击输入框的右边切换glob模式：

*   `*` 匹配路径段里面0或多个除 `/` 以外的字符
*   `?` 匹配路径段里面一个除 `/` 以外的字符
*   `**` 匹配路径段的多个字符，包括 `/`
*   `{}` 用组的形式（列如： `{**/*.html,**/*.txt}` 匹配所有的HTML和文本文件）
*   `[]` 匹配指定的字符范围

VS Code可以在默认情况下排除一些你不感兴趣的文件夹（例如：`node_modules` ）来减少搜索结果的数量。可以通过设置改变 `files.exclude` 和 `search.exclude` 标题下面的规则。

> 提示：在资源管理器里右击一个文件夹并且选择 `Find in Floder` 就可以在这个文件夹内任意搜索

你也可以搜索并替换文件。展开搜索框出现替换文本框（Mac：`Cmd` + `shift` ）。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/4/1632964dfd30a553~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)_image_

当你键入文本到替换框中时，你可以看到即将更改的差异性显示。你可以通过文件替换框替换所有文件，也可以替换一个文件里所有或者替换一个单一变化，

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/4/1632964e2055e1f1~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)_image_

### 命令面板|

VS Code同样可以用键盘操作。最重要的键盘组合 `⇧⌘P` ,这将调出命令面板。从这里，你可以访问VS Code所有的功能，包含快捷键最常见的操作。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/4/1632964e29dda7b2~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)_image_

命令面板提供了许多命令。你可以执行编辑命令，打开文件，搜索符号，查看一个文件的简要概要，使用同一个交互的窗口。

*   `⌘P` 只需简单的输入它的名字就让你导航到所有文件或者符号
*   `⌃⇧Tab` 显示你最后打开的一组文件路径
*   `⇧⌘P` 调出命令面板
*   `⇧⌘O` 在一个文件里，跳到一个指定符号的位置
*   `⌃G` 在一个文件里，输入行数直接跳到指定行的位置

输入 `?` 到输入框得到可用的命令列表，你可以从这里执行：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/4/1632964e336af71b~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png) _image_

### 文件切换

当你打开一个项目的时候，资源管理器擅长文件之间的切换。然而，当你处理任务时，你将发现你自己在一组文件之间快速切换。VS Code提供两个功能强大命令通过易用的键组合来浏览不同文件。

按住 `Ctrl` 然后按 `Tab` 键来查看编辑组中打开的所有文件的列表。如果要打开其中一个文件，再次使用 `Tab` 键选择你想浏览的文件，然后松开 `ctrl` 去打开它。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/4/1632964e51cd5038~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)_image_

另外，你能使用 `⌃-` 和 `⌃⇧-` 在文件和编辑位置之间进行导航。如果你在同一个文件不同行之间跳来跳去。这些快捷键可以让你轻松地在这些位置之间进行导航。

> 提示：当你使用 `⌘P` 时，你可以通过他们的名字打开任何文件

### 文件编码

在 `User Setting` 或 `Workspace` 中通过编辑 `files.encoding` 设置全局或每个工作区域的文件编码。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/4/1632964ecaaaf3b0~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)_image_

你可以在状态栏中查看到文件编码格式

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/4/1632964ecabd1bd5~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png) _image_

点击在状态栏中的编码按钮，用不同的编码格式来重新打开或者保存当前文件。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/4/1632964efe2a52bd~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png) _image_

然后选择一个编码格式

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/4/1632964f00c899b8~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png) _image_

### 命令行启动

你可以通过命令行来启动VS Code来快速打开一个文件，文件夹，或者项目。通常情况，在一个文件范围内打开VS Code.我们发现最好的方法是在终端键入：

 代码解读

复制代码

`code .`

> 提示：对于Mac用户，我们需要通过设置使您能够从终端内启动VS Code.首选运行VS code并打开命令面板（ `⇧⌘P` ），然后输入 `shell command` 找到: Install ‘code' command in PATH 。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/4/1632964f01bb2e10~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png) _image_

Windows和Lunix用户安装过程自动把VS Code的执行代码加到 `PATH` 环境变量中。

有时你想打开或者创建一个文件。如果指定文件不存在，VS Code将会为你创建此文件。

 代码解读

复制代码

`code index.html style.css readme.md`

> 提示：你可以通过空格键来分隔许多文件名

### 额外的命令行参数

当通过 `code` 的命令行启动VS Code时你可以使用以下可选的命令行参数：

参数

描述

`-h` 或 `--help`

code使用说明

`-v`或 `--version`

VS Code版本（例如：0.10.10）

`-n` 或 `--new-window`

打开一个VS Code新的版本替代默认版本

`-r` 或 `--reuse-window`

强制打开最后活动窗口的文件或文件夹

`-g` 或 `--goto`

当和 `file:line:column?使用时` ，打开文件并定位到一个的特定行和可选的列位置的文件。

file

以一个文件名打开。如果文件不存在，此文件将被创建并标记为已编辑

`file:line:column?`

以文件的名称在指定行和可选的列的位置打开，你可以以这个方式指定多个文件。但是在使用 `file:line:column?` 之前必须使用 `-g` 参数。例如：`code -g file:10`

folder

以一个文件夹名打开。你可以指定多个文件夹。例如：`code folder folder`

`-d` 或 `--diff`

打开一个不同的编辑器。需要两个文件路径作为参数。例如：`code -d file file`

`--locale`

为VS Code设置显示语言，支持语言环境有：`en-US` (英语) ，`zh-TW` （中文繁体），`zh-CN` (中文简体)，`fr` ，`de` ，`it` ，`ja` ，`ko` ，`ru` ，`es` 。例如： `code . --locale=en-US` 设置显示语言为英语

`--disable-extensions`

禁用所有安装的插件。下拉选 `Show installed Extensions` 后插件依然可见，但是永远不会被激活。

`--list-extensions`

`code --list-extensions` 列出被安装的插件

`--install-extension`

安装一个插件。提供完整的扩展名 `publisher.extension` 作为参数。例如：`code --install-extension ms-vscode.cpptools`

`--uninstall-extension`

卸载一个插件。提供完整的扩展名 `publisher.extension` 作为参数.例如 `code --uninstall-extension ms-vscode.csharp`

`-w` 或 `--wait`

等待窗口返回之前关闭

### 打开一个项目

VS Code不区分你打开是文件夹还是项目。如果VS Code在文件夹检测到你打开一个项目（例如：一个 C# 项目），这个项目的上下文将被显示在状态栏。如果有多个项目被发现，可以从这里切换项目。  
在一个文件夹 `C:\src\WebApp` 里打开一个项目，像这里启动VS Code：

 代码解读

复制代码

`code C:\src\WebApp`

VS Code 打开之后，只需打开源文件并且使用状态栏根据需要来切换活动项目

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/4/1632964f17745235~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png) _image_

### 窗口管理

VS Code有一些选项来控制窗口应该被新建还是恢复上一次窗口。

在 `User setting`或 `Workspace setting` 中：  
`window.openFilesInNewWindow` ： 设置文件是否在一个新窗口打开，而不是在重用现有的VS Code实例。默认是 `true`, VS Code打开一个新的窗口。`false` 重用VS code最后一个活动实例并在此打开文件。

`window.reopenFolders` 设置通知VS Code怎么去恢复以前会话窗口。默认是 `one` ,VS Code将重新打开你处理过最后一个文件夹。改变设置为 `none` 不重新打开任何文件夹并始终以一个空文件打开。设置为 `all` 恢复上次会话处理过的所有文件夹