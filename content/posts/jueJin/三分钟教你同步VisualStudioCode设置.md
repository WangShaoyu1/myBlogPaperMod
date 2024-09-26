---
author: "橘子味汽水_"
title: "三分钟教你同步VisualStudioCode设置"
date: 2018-09-14
description: "VisualStudioCode(以下简称vsCode)现在已经渐渐成为前端开发的主力工具，谁让它这么轻便，功能又这么丰富呢。用vscodeCoding的小伙伴们也一定会装很多插件吧。但是当你准备更换电脑的时候，是不是为迁移插件和设置而烦恼？我曾经换电脑的时候，把vsCo…"
tags: ["前端","VisualStudioCode"]
ShowReadingTime: "阅读2分钟"
weight: 842
---
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/14/165d6e0871f1e1d4~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

简介
--

Visual Studio Code(以下简称vsCode)现在已经渐渐成为前端开发的主力工具，谁让它这么轻便，功能又这么丰富呢。用vscode Coding的小伙伴们也一定会装很多插件吧。但是当你准备更换电脑的时候，是不是为迁移插件和设置而烦恼？我曾经换电脑的时候，把vsCode上自己心爱的插件一个个记下，然后去新电脑上重装，太蠢了。今天我就把vsCode同步设置和插件的方法告诉大家。

### 准备工作

*   下载Settings Sync插件
*   GitHub账号

### 1.安装Settings Sync

![图1](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/14/165d6e7598d54437~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

**Setting Sync 快捷键：**

1.  上传： Shift + Alt + U (Sync: Update / Upload Settings)
    
2.  下载： Shift + Alt + D (Sync: Download Settings)
    

如果快捷键有冲突，可Ctrl + K + S快捷键设置配置其它快捷键 或 Ctrl + P / F1 在命令窗口输入 >sync 即会出现相应命令供选择

![图2](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/14/165d6e8d352cfe6e~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

### 2.打开GitHub

![图3](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/14/165d6eb17840a944~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

![图4](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/14/165d6ec28b407806~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

![图5](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/14/165d6ee9fd5c1f73~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

![图6](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/14/165d6f0da32d5d96~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

这样你就得到一个token，最好找个地方记下来。因为它就是同步设置的关键。

### 3.将token配置到vsCode

(Sync: Update / Uplaod Settings) Shift + Alt + U 在弹窗里输入你的token， 回车后会生成syncSummary.txt文件

syncSummary.txt文件会存储VSCode的设置及所安装的插件列表

**如果你使用的是新版本的vsCode**

打开设置，在搜索框中输入sync，就可以看到自己的token了

![图7](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/14/165d6f83182f24a2~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

### 4.设置同步下载设置

(Sync: Download Settings) Shift + Alt + D 在弹窗里输入你的gist值，稍后片刻便可同步成功

### 5.如果要重置同步设置，变更其它token

Ctrl+P / F1 弹出输入>sync,即可重新配置你的其它token来同步

### 6.Tips

上传同步设置的时候，vsCode底下可以看到操作信息

![图8](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/14/165d6fc193000c64~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

**Setting Sync 可同步包含的所有扩展和完整的用户文件夹**

1.  设置文件
    
2.  快捷键设置文件
    
3.  Launch File
    
4.  Snippets Folder
    
5.  VSCode 扩展设置
    
6.  工作空间
    

[博客同步更新](https://link.juejin.cn?target=http%3A%2F%2Ftimbok.top%2F2018%2F11%2F28%2Fvscode%2F%23more "http://timbok.top/2018/11/28/vscode/#more")

[参考文章](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fkenz520%2Fp%2F7416836.html "https://www.cnblogs.com/kenz520/p/7416836.html")

[Settings Sync更新说明](https://link.juejin.cn?target=http%3A%2F%2Fshanalikhan.github.io%2F2016%2F05%2F14%2FVisual-studio-code-sync-settings-release-notes.html "http://shanalikhan.github.io/2016/05/14/Visual-studio-code-sync-settings-release-notes.html")

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/17/1735a8190b5949ab~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)