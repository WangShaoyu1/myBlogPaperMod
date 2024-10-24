---
author: "徐小夕"
title: "5分钟教你快速掌握Github Action持续集成"
date: 2021-09-19
description: "从零教你使用github action搭建持续集成服务, 让你的开源项目智动化! 我们只需要简单的配置就能轻松的自动打包项目并将其一键发布到npm中"
tags: ["前端","GitHub","自动化运维中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:28,comments:0,collects:28,views:3605,"
---
前言
--

前端时间发布了一个滑动验证组件包 [react-slider-vertify](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Freact-slider-vertify "https://github.com/MrXujiang/react-slider-vertify") , 里面用到了 `Github Action` 作为自动化打包发布工具, 我们只需要简单的配置就能轻松的在执行 `git push`  的时候自动打包项目并将其一键发布到 `npm` 中.  

接下来我就带大家一起了解一下 `Github Action` , 并从零教大家使用 `Github Action` 高效的管理和发布自己的开源项目.

Github Action 简介
----------------

`Github Action` 是 Github 推出的持续集成工具, 每次提交代码到 Github 的仓库后，Github 都会自动创建一个虚拟机（例如 Mac / Windows / Linux），来执行一段或多段指令，例如：

```bash
npm install
npm run build
```

我们集成 `Github Action` 的做法，就是在我们仓库的根目录下，创建一个 `.github` 文件夹，里面放一个 `*.yaml` 文件, 这个 `Yaml` 文件就是我们配置 `Github Action` 所用的文件。

有关 `yaml` 更多的知识可以参考: [www.codeproject.com/Articles/12…](https://link.juejin.cn?target=https%3A%2F%2Fwww.codeproject.com%2FArticles%2F1214409%2FLearn-YAML-in-five-minutes "https://www.codeproject.com/Articles/1214409/Learn-YAML-in-five-minutes")

### Github Action 的使用限制

*   每个 Workflow 中的 job 最多可以执行 6 个小时
*   每个 Workflow 最多可以执行 72 小时
*   每个 Workflow 中的 job 最多可以排队 24 小时
*   在一个存储库所有 Action 中，一个小时最多可以执行 1000 个 API 请求
*   并发工作数：Linux：20，Mac：5

> Workflow 是由一个或多个 job 组成的可配置的自动化过程。我们通过创建 YAML 文件来创建 Workflow 配置。

从零搭建 github 持续集成项目(npm包持续集成)
----------------------------

在了解了基本的知识之后, 我将通过一个实际的项目来带大家快速上手 `Github Action` . 最终实现的目标: 当我们将代码推送到 github上后, 通过 `Github Action` 自动打包项目, 并一键发布到 `npm` 上.

![image.png](/images/jueJin/342f28ac44df460.png)

### 获取 npm token

要想让 `Github Action` 能有权利发布指定的 `npm` 包, 需要获取 `npm` 的 **通行证**. 这个**通行证**就是 `npm token`, 所以我们需要登入 `npm` 官网, 生成一个 `token` :

![image.png](/images/jueJin/8dc428b7c5514b0.png)

### 设置 github secret

 我们在拿到 `npm token` 后, 打开对应项目的 `github` 仓库, 切换到 `settings` 面板, 找到 `secrets` 子菜单, 创建一个新的 `secret`, 将 `npm token` 复制到内容区, 并命名(这个名字会在yaml文件中用到).

![image.png](/images/jueJin/9dde37c1da2a43c.png)

### 创建 Github Action

![image.png](/images/jueJin/421d57e5ccfc4d7.png)

我们切换到 `actions` 面板可以看到很多 `workflows` 模版, 我们选择如下模版:

![image.png](/images/jueJin/0bcf52ed81ce4c6.png)

当然如果属性 `yaml` 配置的也可以自己创建一个 `workflow` 供他人使用.

我们点击安装按钮之后会跳转到编辑界面, 我们可以直接点击右上放的提交按钮:

![image.png](/images/jueJin/98d49e4ff44c45d.png)

此时就创建了一个 `workflow` .

### 配置 workflows

这里我列一下 `react-slider-vertify` 的 workflow.

```yaml
name: Node.js Package

on:
pull_request:
branches:
- main
push:
branches:
- main

jobs:
build:
runs-on: ubuntu-latest
steps:
- uses: actions/checkout@v2
- uses: actions/setup-node@v2
with:
node-version: 14
- run: yarn
- run: yarn build

publish-npm:
needs: build
runs-on: ubuntu-latest
steps:
- uses: actions/checkout@v2
- uses: actions/setup-node@v2
with:
node-version: 14
registry-url: https://registry.npmjs.com/
- run: npm publish --access public
env:
NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
```

其中有几个术语和大家介绍一下:

*   **name** Workflow 的名称，Github 在存储库的 Action 页面上显示 Workflow 的名称
*   **on** 触发 Workflow 执行的 event 名称, 比如 on: push(单个事件), on: \[push, workflow\_dispatch\] - 多个事件
*   **jobs** 一个 Workflow 由一个或多个 jobs 构成，含义是一次持续集成的运行，可以完成多个任务
*   **steps** 每个 job 由多个 step 构成，它会从上至下依次执行
*   **env** 环境变量, secrets.NPM\_TOKEN就是我们之前定义的secret

### 提交测试

我们修改一下项目的代码, 然后执行:

```sql
git add .
git commit -m ':new: your first commit'
git push
```

提交成功之后我们打开项目的 `github action` 面板:

![image.png](/images/jueJin/3015e5430e38447.png)

可以看到代码线上构建的流程和状态, 是不是和我们在开发企业项目的自动化流程很像呢?

最后
--

如果大家对可视化搭建或者低代码/零代码感兴趣，也可以参考我往期的文章或者在评论区交流你的想法和心得，欢迎一起探索前端真正的技术。

> github: [react-slider-vertify](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Freact-slider-vertify "https://github.com/MrXujiang/react-slider-vertify")  
> 专栏：[lowcode可视化](https://link.juejin.cn?target=http%3A%2F%2Flowcode.dooring.cn "http://lowcode.dooring.cn")  
> 公众号: 趣谈前端

更多推荐
----

*   [从零开发一款轻量级滑动验证码插件](https://juejin.cn/post/7007615666609979400 "https://juejin.cn/post/7007615666609979400")
*   [如何设计可视化搭建平台的组件商店？](https://juejin.cn/post/6986824393653485605 "https://juejin.cn/post/6986824393653485605")
*   [从零设计可视化大屏搭建引擎](https://juejin.cn/post/6981257575425654792 "https://juejin.cn/post/6981257575425654792")
*   [从零使用electron搭建桌面端可视化编辑器Dooring](https://juejin.cn/post/6976476731662139428 "https://juejin.cn/post/6976476731662139428")
*   [(低代码)可视化搭建平台数据源设计剖析](https://juejin.cn/post/6973946702235615269 "https://juejin.cn/post/6973946702235615269")
*   [从零搭建一款PC页面编辑器PC-Dooring](https://juejin.cn/post/6950075140906418213 "https://juejin.cn/post/6950075140906418213")
*   [如何搭积木式的快速开发H5页面?](https://juejin.cn/post/6904878119724056584 "https://juejin.cn/post/6904878119724056584")