---
author: "Sunshine_Lin"
title: "详细记录如何使用github actions自动化部署个人博客网站"
date: 2023-07-30
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心。 个人网站的部署 相信很多前端兄弟都买过服务器，并且把自己的个人项目部署到服务器上，就比如我最近在搞个"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:22,comments:2,collects:41,views:1408,"
---
前言
--

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心。

![image.png](/images/jueJin/20f6853ab8cc450.png)

个人网站的部署
-------

相信很多前端兄弟都买过服务器，并且把自己的个人项目部署到服务器上，就比如我最近在搞个人的博客网站，我用的是腾讯云的服务器，前端用的是`vuepress`去进行当做博客的框架

但是我每次部署到服务器都要分为几步：

*   提交代码
*   本地打包，并压缩成zip
*   登录服务器宝塔，上传zip
*   解压到指定目录

这样才能在网站上看到我部署后的成果

![](/images/jueJin/8ea8f8375a5d4d1.png)

能否实现自动化
-------

我需要手动做这么多事情？那我能不能用某些方式，做到自动化呢？比如：

*   **我只需要做：** 提交代码
*   **自动化：** 打包、zip、上传、解压

也就是我只需要提交代码，剩下的事情自动化都帮我去自动完成了，如果了解过 CI/CD 的朋友就知道，其实现在市场上提供了很多很多的自动化部署工具，比如：

*   **github actions**
*   **gitlab ci**
*   **jenkins**

由于后两个都是公司项目里用的多，至于我们自己个人项目，我们用`github actions`比较方便一些，也很简单~所以我今天就教教大家怎么使用`github actions`自动化部署自己的个人项目吧！

开搞
--

### 前置知识

我们刚刚说了：

*   \*\*我只需要做：\*\*提交代码
*   \*\*自动化：\*\*打包、zip、上传、解压

![](/images/jueJin/48df5eac5c5746f.png)

那要怎么在`github`中去执行 打包、zip、上传、解压 呢？我们需要使用到 `workflows`

### github token

貌似现在终端中`github`操作使用`token`去操作会更加方便？我们可以先去`github`申请一个`token`，以后做事也方便~

![](/images/jueJin/db255c9bd1ca4b4.png)

接着进去到开发者设置，直至找到创建`token`的按钮~

![](/images/jueJin/63461c0ed2924ed.png)

![](/images/jueJin/60641c204120486.png)

这两个记得勾起来哦~不然后面搞不了`github actions`滴

![](/images/jueJin/69043696fa17471.png)

### workflows & job & step

我们需要在项目中新建`.github`文件夹，然后创建`workflows`文件夹，这个`workflows`文件夹里放的就是你要执行的一些命令，这些命令就包含 打包、zip、上传、解压 ~

当我们把这些东西提交到 `github`后， `github`会去识别`.github`中的`workflows`中的这些`yml`，并去执行它们（可以多个`yml`文件）

![](/images/jueJin/6610f14bcf5745c.png)

我们可以在`ci.yml`中先写一些测试的脚本，我们可以认识几个关键字：

*   \*\*job：\*\*可以理解为任务
*   \*\*step：\*\*可以理解为一个任务中的一些步骤
*   \*\*run：\*\*跑命令，执行

```yml
name: CI
on:
# 代码push的时候触发
push:
# main分支的时候触发
branches: main
jobs:
# 定义一个job，名字为CI
CI:
# 使用github提供给我们的机器去跑
runs-on: ubuntu-latest
# 步骤
steps:
# 步骤名为test
- name: test
# 打印哈哈
run: echo 哈哈哈
```

接着我们提交代码到`github`上，我们可以看到，在`Actions`中多了一个任务，名字是你的`commit msg`

![](/images/jueJin/0e684289ea5d4cd.png)

我们可以点进去看看这个任务的详情，我们可以看到它执行了我们写的那些命令~

![](/images/jueJin/11f793888b8d4b3.png)

### 准备一些服务器资料

其实你可以把`github actions`中跑任务的地方想成是一个终端，我们想想平时终端ssh登录你的服务器，需要用到什么东西：

*   **服务器的IP**
*   **用户名**
*   **密码**

密码又分成自己设置的密码，或者秘钥，而在`github actions`我们需要使用`秘钥`去登录~那我们要怎么获取这个`秘钥`呢？很简单，我是腾讯云，我们需要先进入腾讯云，进入秘钥，点击 创建秘钥

![](/images/jueJin/e50b0ae85cb647b.png)

一定要注意！！！！！秘钥的地域，一定要选择跟你服务器地域一样的才行！！！

![](/images/jueJin/67c0d371586a4b0.png)

![](/images/jueJin/a6025b1718aa4de.png)

创建完后，你会获取到一个秘钥，现在就可以拿这个秘钥去免密登录了~

![](/images/jueJin/9066320e81af494.png)

但是我们要怎么把这个秘钥复制出来呢？我这边是选择了去宝塔上复制的，怎么打开宝塔面板呢？我们可以先点击远程登录

![](/images/jueJin/a387ef8c8847477.png)

接着登录后，在终端输入`/etc/init.d/bt default`

![](/images/jueJin/079a88dde3b341e.png)

复制宝塔的外网链接，打开，并登录~进入之后点击 SSH安全管理

![](/images/jueJin/69cd8286ae094f7.png)

把这个秘钥给复制下来~之后的`github actions`免密登录服务器需要用到这个

![](/images/jueJin/0028c2a1356041a.png)

接着回到`github`，我们需要把这三个变量设置进`github`的 `action`中，这样我们在跑`github actions`时才能获取到这三个变量

*   \*\*D\_HOST：\*\*写上服务器ip
*   \*\*D\_USER：\*\*写上登录用户名
*   \*\*D\_PASS：\*\*写上刚刚复制的秘钥

![](/images/jueJin/0a4bbcdd229649b.png)

### ci.yml

接着我们就可以完善`ci.yml`了，我们可以使用一些`github actions`提供给我们的工具，去完成一些操作，比如：

*   \*\*actions/checkout@v2：\*\*用来拉取最新代码
*   \*\*actions/setup-node@v3：\*\*用来安装node
*   \*\*actions/cache@v3：\*\*用来缓存node\_moduls
*   \*\*easingthemes/ssh-deploy@v2.0.7：\*\*用来把产物部署到服务器

```yml
name: CI
on:
# 代码push的时候触发
push:
# main分支的时候触发
branches: main
jobs:
# 定义一个job，名字为CI
CI:
# 使用github提供给我们的机器去跑
runs-on: ubuntu-latest
# 步骤
steps:
# 拉取最新的代码
- name: Checkout repository
uses: actions/checkout@v2
# 安装node环境
- name: Use Node.js
uses: actions/setup-node@v3
with:
node-version: "16.x"
# 为node_modules设置缓存
- name: Cache
# 缓存命中结果会存储在steps.[id].outputs.cache-hit里，该变量在继后的step中可读
id: cache-dependencies
uses: actions/cache@v3
with:
# 缓存文件目录的路径
path: |
**/node_modules
key: ${{runner.OS}}
# 安装依赖
- name: Installing Dependencies
# 如果命中缓存，就不需要安装依赖，使用缓存即可
if: steps.cache-dependencies.outputs.cache-hit != 'true'
run: npm install
# 打包
- name: Build
run: |
npm run docs:build
zip -r vuepress ./vuepress/**
# 产物上传服务器
- name: Upload to Deploy Server
uses: easingthemes/ssh-deploy@v2.0.7
env:
# 免密登录的秘钥
SSH_PRIVATE_KEY: ${{ secrets.D_PASS }}
# 服务器登录用户名
REMOTE_USER: ${{ secrets.D_USER }}
# 服务器的公网IP
REMOTE_HOST: ${{ secrets.D_HOST }}
# 你打包后产物的文件夹
SOURCE: "vuepress/"
# 先清空目标目录
ARGS: "-avzr --delete"
# 上传到服务器目标目录
TARGET: "/www/vuepress"
```

接着我们修改一下代码，我给这个标题加了个 “啊”

![](/images/jueJin/f0189a7ca72947d.png)

提交代码，查看`Actions`中的任务，发现已经部署完成了

![](/images/jueJin/c536dde3a9bf466.png)

验证部署成功，我看看到线上的博客已经拥有了这个改动~

![](/images/jueJin/9bde77bf3b5e41c.png)

结语 & 加学习群 & 摸鱼群
---------------

我是林三心

*   一个待过**小型toG型外包公司、大型外包公司、小公司、潜力型创业公司、大公司**的作死型前端选手；
*   一个偏前端的全干工程师；
*   一个不正经的掘金作者；
*   一个逗比的B站up主；
*   一个不帅的小红书博主；
*   一个喜欢打铁的篮球菜鸟；
*   一个喜欢历史的乏味少年；
*   一个喜欢rap的五音不全弱鸡

如果你想一起学习前端，一起摸鱼，一起研究简历优化，一起研究面试进步，一起交流历史音乐篮球rap，可以来俺的摸鱼学习群哈哈，点这个，有7000多名前端小伙伴在等着一起学习哦 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

![image.png](/images/jueJin/f4329c0999644b1.png)