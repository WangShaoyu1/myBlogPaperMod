---
author: "MacroZheng"
title: "IDEA中的Git操作，看这一篇就够了！"
date: 2019-08-28
description: "大家在使用Git时，都会选择一种Git客户端，在IDEA中内置了这种客户端，可以让你不需要使用Git命令就可以方便地进行操作，本文将讲述IDEA中的一些常用Git操作。 使用前需要安装一个远程的Git仓库和本地的Git客户端，具体参考：10分钟搭建自己的Git仓库。 提交代码并…"
tags: ["Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:74,comments:7,collects:183,views:47219,"
---
> SpringBoot实战电商项目mall（20k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

大家在使用Git时，都会选择一种Git客户端，在IDEA中内置了这种客户端，可以让你不需要使用Git命令就可以方便地进行操作，本文将讲述IDEA中的一些常用Git操作。

环境准备
----

*   使用前需要安装一个远程的Git仓库和本地的Git客户端，具体参考：[10分钟搭建自己的Git仓库](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2F6GyYlR9lpVcjgYmHMYLi0w "https://mp.weixin.qq.com/s/6GyYlR9lpVcjgYmHMYLi0w")。
*   由于IDEA中的Git插件需要依赖本地Git客户端，所以需要进行如下配置：

![](/images/jueJin/16cd8630f2ed527.png)

操作流程
----

> 我们这里使用mall-tiny项目的源代码来演示，尽可能还原一个正式的操作流程。

### 在Gitlab中创建一个项目并添加README文件

![](/images/jueJin/16cd8630f2f90f8.png)

### clone项目到本地

*   打开从Git检出项目的界面：

![](/images/jueJin/16cd8630f59452e.png)

*   输入Git地址进行检出：

![](/images/jueJin/16cd8630f78bfb2.png)

*   暂时不生成IDEA项目，因为项目还没初始化：

![](/images/jueJin/16cd8630f774208.png)

### 初始化项目并提交代码

*   将mall-tiny的代码复制到该目录中：

![](/images/jueJin/16cd8630f9a3834.png)

*   这里我们需要一个.gitignore文件来防止一些IDEA自动生成的代码被提交到Git仓库去：

```
# Maven #
target/

# IDEA #
.idea/
*.iml

# Eclipse #
.settings/
.classpath
.project
```

*   使用IDEA打开项目：

![](/images/jueJin/16cd863124fa7ac.png)

*   右键项目打开菜单，将所有文件添加到暂存区中：

![](/images/jueJin/16cd863128fe591.png)

*   添加注释并提交代码：

![](/images/jueJin/16cd8631279a6df.png)

### 将代码推送到远程仓库

*   点击push按钮推送代码：

![](/images/jueJin/16cd8631294e78f.png)

*   确认推送内容：

![](/images/jueJin/16cd86312d1f9c1.png)

*   查看远程仓库发现已经提交完成：

![](/images/jueJin/16cd86312ce7fee.png)

### 从远程仓库拉取代码

*   在远程仓库添加一个README-TEST.md文件：

![](/images/jueJin/16cd863151cbad8.png)

*   从远程仓库拉取代码：

![](/images/jueJin/16cd863151bc08f.png)

*   确认拉取分支信息：

![](/images/jueJin/16cd86315395719.png)

### 从本地创建分支并推送到远程

*   在本地创建dev分支，点击右下角的Git:master按钮：

![](/images/jueJin/16cd8631538b19d.png)

*   使用push将本地dev分支推送到远程：

![](/images/jueJin/16cd8631294e78f.png)

*   确认推送内容：

![](/images/jueJin/16cd863153b61fa.png)

*   查看远程仓库发现已经创建了dev分支：

![](/images/jueJin/16cd8631559fb39.png)

### 分支切换

*   从dev分支切换回master分支：

![](/images/jueJin/16cd86317cd522d.png)

### Git文件冲突问题解决

*   修改远程仓库代码：

![](/images/jueJin/16cd863182a863a.png)

*   修改本地仓库代码：

![](/images/jueJin/16cd86317ccb7ed.png)

*   提交本地仓库代码并拉取，发现代码产生冲突，点击Merge进行合并：

![](/images/jueJin/16cd863182de2fb.png)

*   点击箭头将左右两侧代码合并到中间区域：

![](/images/jueJin/16cd863182c7256.png)

*   冲突合并完成后，点击Apply生效：

![](/images/jueJin/16cd8631909e9f8.png)

*   提交代码并推送到远程。

### 从dev分支合并代码到master

*   在远程仓库修改dev分支代码：

![](/images/jueJin/16cd86319e72710.png)

*   在本地仓库拉取代码，选择从dev分支拉取并进行合并：

![](/images/jueJin/16cd8631a92a1f9.png)

*   发现产生冲突，解决后提交并推送到远程仓库即可。

![](/images/jueJin/16cd8631ae0b4a3.png)

### 查看Git仓库提交历史记录

![](/images/jueJin/16cd8631b0ef5f8.png)

公众号
---

[mall项目](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")全套学习教程连载中，**关注公众号**第一时间获取。

![公众号图片](/images/jueJin/16ccdfc88b7a3ac.png)