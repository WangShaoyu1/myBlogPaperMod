---
author: "海石"
title: "面试官：代码里console.log比较多，该怎么办？"
date: 2024-09-24
description: "解决标题中的问题的方法有多少种，你能想到几种，你又能动手真正地实现几种呢？本篇文章针对标题中的问题，进行了一场头脑风暴，感兴趣的话，一起来聊一聊吧~"
tags: ["前端","面试","Webpack"]
ShowReadingTime: "阅读13分钟"
weight: 174
---
前言
--

删呗，还能咋办。我来删我来删！🫡

Ctrl + Shift + F ，全局搜索启动！😠

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/baa99741840746ffad7f1e2bcae3cf63~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=K1EH55iYqNmTwZMwvS%2BguEPCwmk%3D)

Alt + R，使用正则表达式！😠

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/5c6ef6f733b948aeadc34f26a0a8b561~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=pIwZ%2BwoHkbMBjVXuy83k6QV%2BXHA%3D)

哼哼，正则表达式 `console\.log\(.*?\)` 输入！😠

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/1212cfb1a24a48839d8aff210f7c07f9~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=LoaeJVOV1nMGKSPXI4ArYB3v1qE%3D)

狠狠按下 Enter！😡

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/b324acabecac419e80346d9aab4490fc~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=mwZUmNodzZ1CDGOy07xggQkpg%2F4%3D)

然后全局替换，启动！😡

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ece3887ed6eb4ee9a602aed281d2f16a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=y8XVFyDwJT%2B2csWL3MMPUPStNsI%3D)

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/c486c6c7b1564e7ca29da0db5e99a651~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=fykPTUkaSzaaNGIaglqim1%2FEKIY%3D)

我就问你我删得快不快吧😋

我就问你我删得干净不干净吧😋

> 面试官：精彩👏，真是一场酣畅淋漓的我问你答呀，回去等通知吧😊
> 
> 我：？过奖了捏😳

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/c842ab16c9ee4438b718666e638f0585~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=Zsv8UiTcPS7ougAxtWUcVfESKoY%3D)

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/30276f0f0d5f47cfa8c014fda026dd67~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=RZfttkE2S0nqyK29y%2BjNa1yPgg0%3D)

> 面试官：我就问你我感谢信发得快不快吧😋
> 
> 我：我就问你...我一面挂得快不快吧😭😭😭

咳咳，本博主表示上面的全都是节目效果，绝对不是根据真实面试事件改编的🫠。

（如有雷同，浙A 陪1根）

好了，整活到此为止，让我们来看看面对这样的问题，我们该如何拿出能够让面试官满意的解决方案吧~

![chufa.jpg](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/fdfae833900845a9b0d02a311cc462a8~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=9oJybWsH4RZDFufjcriwBFy71AQ%3D)

（博主的水平有限，掘金上藏龙卧虎，如果大佬们有更多的奇思妙想，欢迎评论区留言！）

从 `ESLint` 入手
-------------

`ESLint` 是一个插件化的 `JavaScript` 代码检查工具，它能够帮助我们识别代码中的问题，并提供修复建议。

我们可以配置`.eslintrc.json`文件，通过添加相应的规则，来软性地禁止`console`的使用。

json

 代码解读

复制代码

`{   "rules": {     "no-console": "warn"   } }`

当我们这样配置后，代码中使用了`console`的地方会划上黄色波浪色，进行警示。

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/0f7a72b8e2e94ec18658b76e465ac57e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=poBCzmebOTpsSq7gJHP%2FS7adYO8%3D)

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ae7b1f0ef3d04f388e261369a9e6410b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=%2BR2dR2q0BJeQ4iOBZT5k2CYtJ0Y%3D)

这样虽然不能实现删除 `console.log` ，但是能一定程度上削减代码中会出现的 `console.log` 的数量。

毕竟都画黄线提示你了，总不能写完之后无视掉直接提交代码吧，那就有点小过分了。

但是毕竟这也仅仅只是起到提示的作用，真要提交了，也没办法。

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/b8cb2e3e464f45649f37f36d06b77c30~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=%2FD7k5ffLEtb7KiX%2FfjZaaQakb3I%3D)

> Git：┑(￣Д ￣)┍ 摆了~
> 
> 我：不准摆！🤯

从 `git commit` 入手
-----------------

`ESLint` 的能力有限，无法真正的拦截用户的代码提交。

那么我们就双管齐下，既在**代码编写**的时候 _提醒同事记得删除_ `console.log` ，也在**代码提交**的时候 _不允许_ 没删干净 `console.log` 的代码提交。

那么问题来了，怎么去写 `git commit` 相关的规则呢？

我们需要找到项目中的 `.git/hooks` 文件夹，这个文件夹是隐藏的，因此我们在资源管理器找它的时候，记得勾选【显示隐藏的项目】：

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/bc9bf062758044c4b4789d2652d2567f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=9B0lVtOzEhgbvLdHCyRgh9sKspE%3D)

然后我们找到 `pre-commit.sample` 文件。

（文件路径：`.git/hooks/pre-commit.sample` ）

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/d95e108a36714cab857bda6c8b655e32~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=8NzDVqWzDYiH04bmW0gAlswQykA%3D)

当我们每次提交代码时，`Git` 都会运行 `pre-commit` 这个hook，因此我们就可以在这个hook内写一些处理逻辑。

### 若提交的代码中包含 `console.log` ，则报错，提交失败。

bash

 代码解读

复制代码

`# 检查当前暂存区的文件是否包含 console.log if git diff --cached --name-only | xargs grep -E 'console\.log';  then   echo "Error: console.log is not allowed in commits."   exit 1 fi exit 0`
    

*   `git diff --cached`: 这个命令用于列出暂存区（即将被提交的文件）与最后一次提交之间的差异。
*   `--name-only`: 这个选项告诉Git只输出有差异的文件名，而不输出差异内容。
*   `|`: 这是管道操作符，它将 _前一个命令的输出_ 作为 _下一个命令的输入_ ，这样我们就能拿到这次提交的全部代码了。
*   `xargs`: 这个命令从 _标准输入_ （也就是上一个命令的输出）中读取数据，并将其作为参数传递给后面的命令。
*   `grep -E 'console.log'`: `grep`是用于搜索文本的工具，`-E`选项启用扩展的正则表达式。在我们的这种业务场景下，它就是负责搜索包含`console.log`的字符串。注意，`.`在正则表达式中是一个特殊字符，表示任意字符，因此需要用反斜杠`\`进行转义。
*   `if`语句：如果`grep`命令找到了匹配的文件，则它的退出状态为0（表示成功），`if`语句的条件为真。
*   `exit 1`: 这将终止脚本，并返回退出状态1，通常表示_一个错误_或_非正常退出_。
*   `fi`: 表示`if`语句结束。
*   `exit 0`: 以退出状态0结束，表示_成功_。

要注意，如果期望`pre-commit.sample`内部的逻辑能够生效，需要**重命名文件**，将其改为`pre-commit`：

bash

 代码解读

复制代码

`# To enable this hook, rename this file to "pre-commit".`

写好后，我们试试看是否能够校验成功：

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/3744be6ded4f4151ac875daa5ff7c1a2~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=6wTtDsOSKj6mKFAPKoAUq0m7kM4%3D)

我们往代码里加点 `console.log` ，然后提交试试：

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/598ab1825f0b4f6b82f81d9ac48a88cd~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=GdT1oBHW%2B8ZRBI2OhkET9UVhcYA%3D)

芜湖，提交 _失败_，舒服了。😊

但是，俗话说的好：“道高一尺，魔高一丈。”

我们所新增的这条规则实际上可以被轻易地绕开，那就是给指令后面加上

`--no-verify`

只要加上了这个，我们在 `pre-commit` 写的东西就统统无效了。😶

还是同样的文件，我们再写一些 `console.log`：

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/724a50d7094140a08e7f27b89d98153f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=vaWvBA6jqnCeqU38%2Bjahm32J7Es%3D)

然后尝试提交：

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/d97139ed2ae748118e1c88733ae3b044~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=8%2BE9UeK6Iy2phFMOTQik9UGnpdA%3D)

没有加上 `--no-verify` 自然提交失败。

现在我们给它加上，再看看：

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/88ee75cc42dd4a4fa58b19c3e535c813~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=XnxnHpZEg%2Bdxillmc6cBz8J95o4%3D)

提交 _成功_ 啦，难受。😫

从 `plugin` 入手
-------------

除了上述两种方法之外，我们还能从插件入手。

插件可以是 VSCODE 的插件，

也可以是 Webpack 的插件。

### VSCODE

我们可以在插件商店中搜索 `remove-console`

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/80988b421692465dbeb923541c358bfd~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=KIrSADaTHCSgMTn6DXJd%2BIEM%2F3c%3D)

然后安装一个，找到我们有 `console.log` 的文件，然后使用插件即可。

效果演示如下：

![remove-console.gif](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/fd159c3970fd41398bd592e54f248252~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=tVo9oQqnMfBidz5c%2BNtBQ7JjdGs%3D)

有一说一，靠这个还不如哥们在【前言】章节整的活呢。😑😑😑

### Webpack

其实本文包了那么多饺子，就是为了这口醋！

前端工程化在现在的环境下，几乎是面试必问了。

因此咱们就借着这个机会，一起来手写一个 plugin，帮助我们实现在打包的时候，干掉任何的`console.log` 漏网之鱼。

#### 造轮子前，先看看现成轮子

且慢走，且慢走~

在造轮子前，我们先看看现成的轮子。

我们可以使用`'terser-webpack-plugin'`这个插件，它能够帮助我们压缩 JavaScript 代码。

如果我们的项目是基于 `create-react-app` 这个脚手架创建的，那么我们可以直接搜到它。

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/20307db54f2f4f3b8d02a9ac688716f1~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=LJwD0SHRol3vxgZBGr8nDMyqiC8%3D)

然后在使用它的地方进行相应的配置即可：

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/9a6e9235c3194088a0dd417a69e2bc37~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=eh0C5mc8Q80B1b26sM8lJTdRZNs%3D)

将 `drop_console` 的值设置为 `true`，这也就能在打包后去除全部的 `console.log` 了

举个例子，我在文件里添加了很多 `console.log`：

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/eaf863567172436d9bad8f4d42847729~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=9VOOyGmAKntbm4uUqvYKbpwG4Jo%3D)

此时我先不设置 `drop_console` 的值设置为 `true`：

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/103026a6dde0456cbcf60c40d197ec26~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=i4JnkIpiAIRbHW7Wp%2F1Z9TPTGB8%3D)

然后我运行`npm run build`，去打包，得到打包后的js文件，我们在此文件里进行搜索：

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/8ebdee6cedeb49caa7336c16d4ffc0fa~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=oFAvPuAEtQUMALaNVp8sbPa%2FD%2BU%3D)

然后，我设置 `drop_console` 的值设置为 `true`，再重新打包：

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ad71044cf1484c1c9e9a35ac4c35751f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=z6oXNAkaUmW2Y0wkZCtt1v59nUA%3D)

👆可以看到👆，这时候打包后的文件里就没有 `console.log` 了。

哇，太爽了，谁没事闲着造轮子啊，用现成的加个字段设置一下就OK了。

摆了摆了，本文到此结束。😆😆😆

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/7affe8fee6ff4b62b50758ceca699dc3~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=4frLI0pS2GQ8z8606dXzEsT1GHw%3D)

.

.

.

.

.

.

唉，不行捏，必须学，咱们今天还真就得造个轮子了！

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/d5ab3b139fd447ca8033e7e06dad684d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=%2Fjc30EXz9VOrk3e0z0vD88rLoD0%3D)

#### 总之造了再说吧，是值得的

想要亲自动手写一个 Webpack 的插件，那么我们不得不聊一下 Webpack 的构建过程。看看 plugin 是在什么阶段生效的，或者说 plugin 能生效的阶段都有哪些。

##### Webpack 的构建过程

Webpack 的构建过程可以分为以下几个主要步骤：

（下方的内容我会结合 `create-react-app` 这个脚手架去聊）

1.  初始化阶段（Initialization）
    
    *   **启动**：webpack 通过 CLI 或 API 启动，并读取配置文件（例如 `webpack.config.js`）。
        
        *   我们会发现，在CRA中，配置文件不止一个，还存在另一个`webpackDevServer.config.js`文件，这是为什么？ ![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/a59efacdcf9843edacf3636b012ede1d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=MOhHhaONeP6gsDYdNLShmuXAaO0%3D)
        *   这其实就和 webpack 的优化有关了。通过区分环境（开发环境、生产环境），来实现优化。
            *   很多时候开发环境中一些配置的设置，比如：热模块替换（HMR）、代理设置、静态文件服务等等，是生产环境不需要的。因此根据环境区分配置，可以使项目结构更清晰、便于管理和维护。
                *   [热模块替换](https://link.juejin.cn?target=https%3A%2F%2Fwww.webpackjs.com%2Fconcepts%2Fhot-module-replacement%2F "https://www.webpackjs.com/concepts/hot-module-replacement/"): [webpack-dev-server](https://link.juejin.cn?target=https%3A%2F%2Fwww.webpackjs.com%2Fconfiguration%2Fdev-server%2F "https://www.webpackjs.com/configuration/dev-server/") 支持 `hot` 模式，在试图重新加载整个页面之前，`hot` 模式会尝试使用 HMR 来更新。
            *   从性能优化的角度来看的话，在开发环境中，也不需要生产环境所需要的一些插件，比如代码压缩、Tree Shaking等等。根据环境区分配置，可以使得在开发过程中能够避免运行一些耗时的插件。
            *   根据环境区分配置还能提升灵活性，可以在启动开发服务器时使用不同的命令行参数或环境变量。
    *   **创建 Compiler 对象**：webpack 初始化一个 `Compiler` 对象，该对象负责控制整个构建过程。
        
    *   **加载插件**：webpack 读取配置中的插件，并调用插件的 `apply` 方法，让插件可以注册钩子函数。
        
        *   这里简单的贴一下一个 plugin 的基本结构：
        
        js
        
         代码解读
        
        复制代码
        
        `class DemoPlugin {   // options: 接收 plugin 的配置项   constructor(options) {     // 获取配置项，初始化插件   }   // apply 是与 webpack 通信的桥梁   apply(compiler) {     // 获取 compiler，可以通过 compiler 对象     // 访问 compilation 对象     // do something ...         } }`
        
        *   apply 内部可以包含任何自定义逻辑，这些逻辑将在 Webpack 的特定生命周期钩子被触发时执行。插件可以利用这些钩子来修改构建结果、添加新的资产、或者执行其他任何必要的操作。
        *   比如：
        
        js
        
         代码解读
        
        复制代码
        
        `apply(compiler) {   compiler.hooks.compile.tap('DemoPlugin', (compilationParams) => {     // 在编译器开始读取 Records 之前执行的操作   });   compiler.hooks.compilation.tap('DemoPlugin', (compilation) => {     // 在创建新的 compilation 之前执行的操作   }); }`
        
2.  编译阶段（Compilation）
    
    *   **确定入口**：webpack 根据配置中的 `entry` 找到所有入口文件。
        
        ![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/b5daa1c5943d4e2eafaac1430e4be0b6~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=Awqckz9MUhlQXJqndCk3b5KeNfI%3D)
        
    *   **创建 Compilation 对象**：每当检测到文件变化时，webpack 都会创建一个新的 `Compilation` 对象，该对象包含了当前的模块资源、编译生成资源、变化的文件等。
        
    *   **编译模块**：
        
        *   **递归编译**：从入口文件开始，webpack 会递归地解析每个模块所依赖的其他模块，形成一个依赖关系图。
            
            ![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/afa1df9122de4119a5407d42f6d10de6~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=ALPW3wjAvYrtaQDPURM0WwswgDI%3D)
            
        *   **`loader`（加载器）处理**：在解析模块时，webpack 会使用配置中的 `loader` 对模块进行转换，例如通过 `ts-loader` 将 TypeScript 转换为 JavaScript。
            
        *   **构建模块**：webpack 会将模块转换后的内容封装成一个个的模块对象。
            
3.  生成资源阶段（Make）
    
    *   **完成模块编译**：在编译完所有模块后，webpack 会得到一个模块对象组成的列表。
    *   **优化模块**：webpack 可能会根据配置对模块进行优化，例如合并模块、摇树优化（Tree Shaking）等。
    *   **确定 chunks**：webpack 根据模块之间的依赖关系，将模块组合成多个 chunks，每个 chunk 对应一个输出文件。
4.  优化阶段（Seal）
    
    *   **优化 chunks**：webpack 会进一步优化 chunks，比如合并相同的模块、删除无用的代码等。
    *   **生成 chunks**：webpack 根据优化后的 chunks 生成最终输出的资源。
5.  发射阶段（Emit）
    
    *   **资源输出**：webpack 将编译和优化后的资源发射到输出目录，通常是 `dist` 文件夹。
        
        ![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f73c1ce30a054b9d9aa6e2cf267820a1~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=%2BHEFJGHvZK1R%2F%2BdLWU6eJEBkoxc%3D)
        
        在CRA中如果不明确指定的话，那就是 `'build'` 文件夹。
        
        ![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/3c4054496800490f8819172a0932da0c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=nJ21VyczrcfksK7OPLWZZN%2BEc9M%3D)
        
    *   **文件写入**：webpack 将生成的文件写入到文件系统中。
        
6.  完成阶段（After）
    
    *   **完成通知**：在所有文件写入完成后，webpack 通知插件构建过程结束。
        
    *   **清理工作**：插件可以进行清理工作，例如删除临时文件、日志记录等。
        
    *   完成阶段也可以让 plugin 介入，我们只要在 apply 中注册hook即可：
        
        js
        
         代码解读
        
        复制代码
        
        `apply(compiler) {  // 注册完成阶段的钩子  compiler.hooks.done.tap('AfterBuildPlugin', (stats) => {    // 完成通知    console.log('Webpack build is finished!');    // 清理工作    this.cleanup();  }); }`
        

OK，我们简单地回顾了一下 webpack 的构建过程。

（如有任何错误之处，还请大佬们评论区赐教）

接下来，咱们就开始正式去写一个 plugin 了。

##### 开始造轮子：

1.  **创建自定义 Webpack 插件**：
    
    在我们的项目中创建一个新的 JavaScript 文件，比如 `RemoveConsolePlugin.js`。
    
    ![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/4be347b40345476facb186a88499dee2~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=MJDpJo4JTGSVxW9GYV6Jre4S8Mc%3D)
    
2.  **编写插件代码**：
    
    在 `RemoveConsolePlugin.js` 文件中，编写一个继承自 `webpack.Plugin` 的类，并在 `apply` 方法中使用 `compiler.hooks` 来注入自定义的编译步骤。
    

js

 代码解读

复制代码

`// RemoveConsolePlugin.js class RemoveConsolePlugin { // 由于我们不需要从外部传入 options  // 因此这里就不显示地定义 constructor 了 // constructor (){...} apply(compiler) {     compiler.hooks.emit.tapAsync(       "RemoveConsolePlugin",       (compilation, callback) => {         Object.keys(compilation.assets).forEach((filename) => {           // 仅处理 .js 文件           if (filename.endsWith(".js")) {             const asset = compilation.assets[filename];             let content = asset.source();             // 使用正则表达式移除整个 console.log 语句             // 匹配 console.log( 之后的任意字符，直到遇到闭合的括号             const consoleLogRegex = new RegExp(               "console\\.log\\(.*?\\)",               "g"             );             const withoutConsole = content.replace(consoleLogRegex, "");             // 更新资源             compilation.assets[filename] = {               source: () => withoutConsole,               size: () => Buffer.byteLength(withoutConsole, "utf8"),             };           }         });         callback();       }     );   } } module.exports = RemoveConsolePlugin;`

我们来解释下上面代码的写法：

*   `compiler.hooks.emit`：在上一章节【Webpack的构建过程】里我们提到了我们可以通过 `compiler` 去获取一些hook，在这里，我们选择 `emit` 这个hook。
    
    ![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/34c165478c07414c998f07542a57bb3e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=vPX7sMNPp%2BMvk5QwgcqThRGiuMI%3D)
    
    在 `asset` 被输出到 `output` 之前，我们去完成对 `console.log` 语句的删除。
    
*   `compilation`：`compilation` 实例能够访问所有的模块和它们的依赖（大部分是循环依赖）。 它会对应用程序的依赖图中所有模块， 进行字面上的编译(literal compilation)。
    
    在这里，我们通过 `compilation` 实例获取到 `assets`，这里面就存着所有被处理的文件了。考虑到插件的运行会影响打包的速度，因此我们这里仅对`.js`文件做删除 `console.log` 语句的处理，所以加了一个 `if` 判断。
    
    我们通过调用 `asset.source()` 来获取文件的源代码。
    
    之后就是大家很熟悉的字符串的正则匹配和替换了。注意给 `.` 和 `(` 加上 `\\` 来**进行转义**。
    

3.  **在 Webpack 配置中使用插件**：
    
    接下来我们回到 `webpack.config.js` 文件中，引入 `RemoveConsolePlugin` 并添加到插件数组中。
    
    js
    
     代码解读
    
    复制代码
    
    `// webpack.config.js const RemoveConsolePlugin = require("../src/RemoveConsolePlugin"); module.exports = {   // ...其他配置...   plugins: [     new RemoveConsolePlugin(),     // ...其他插件...   ], };`
    
4.  **运行 Webpack 构建**：
    
    大功告成，接下来只要自信输入 `npm run build` 即可。
    
    然后发现g了。
    
    ![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ef70cb37a48542bf93441901a77d5cf9~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=D1TqfSz30vhUk46m6p%2FKVtJbjSU%3D)
    
    怎么cjs、js全都没了？然后我们去ouput里看下：
    
    ![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/aa517bd9f25d4fd5bf06a96e8b488643~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=9gPBW9vuUXrQr71L3yZEQAJjq%2B0%3D)
    
    `console.log`语句确实是被删除了，但是留下了_一堆逗号_，因为这一堆逗号，导致打包后的文件异常了，通过`"webpack-bundle-analyzer"` 展示的依赖图也异常，这是怎么回事？
    
    现在我们先取消使用自定义插件，再打包一次看看：
    
    ![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/91db91e08f3e40bebc9aa9e61956d352~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=EtMtSaN5jhoKBYw8sqAj4o9rIqw%3D)
    
    ![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/8e988729df6c403789040469506b24a2~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=x1aDQBiiUF3Cwl5sWIelw%2BDB4vE%3D)
    
    由上图可以看到，输出的文件里，每一行`console.log`语句后面都跟着一个逗号。这也告诉了我们，如果使用正则的方式去删除`console.log`语句，还得给正则表达式加上一个是否以逗号结尾的匹配规则：`(,|$)`。
    
    我们修改一下 `RemoveConsolePlugin.js` 的代码：
    
    js
    
     代码解读
    
    复制代码
    
    `// RemoveConsolePlugin.js class RemoveConsolePlugin { // 由于我们不需要从外部传入 options  // 因此这里就不显示地定义 constructor 了 // constructor (){...} apply(compiler) {     compiler.hooks.emit.tapAsync(       "RemoveConsolePlugin",       (compilation, callback) => {         Object.keys(compilation.assets).forEach((filename) => {           // 仅处理 .js 文件           if (filename.endsWith(".js")) {             const asset = compilation.assets[filename];             let content = asset.source();             // 使用正则表达式移除整个 console.log 语句             // 匹配 console.log( 之后的任意字符，直到遇到闭合的括号             const consoleLogRegex = new RegExp(               "console\\.log\\(.*?\\)(,|$)",               "g"             );             const withoutConsole = content.replace(consoleLogRegex, "");             // 更新资源             compilation.assets[filename] = {               source: () => withoutConsole,               size: () => Buffer.byteLength(withoutConsole, "utf8"),             };           }         });         callback();       }     );   } } module.exports = RemoveConsolePlugin;`
    
    然后再执行一次打包：
    
    ![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f547d11ccc13404084da688f87456824~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=rtiRhT%2Bm13s%2BB8I23j3zb8YHmxI%3D)
    
    依赖图很正常，我们再看看输出后的文件：
    
    ![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/662488cc227043698173ffb771c9c0dc~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rW355-z:q75.awebp?rk3s=f64ab15b&x-expires=1727762039&x-signature=%2Bt71dxPyx6NlEf2P1htqPsKUaYI%3D)
    
    不仅把 `console.log` 语句删除干净了，并且成功解决了之前的报错。
    

#### 扩展思考

动手能力强的掘友可以试试：

*   我们实现的自定义插件只是删除了console语句中的log而已，console语句还有很多种类型呢，比如 warn、debug 、info 等等。由于我们的 plugin 不支持options的配置，在功能的全面性上较差，该如何改进？
*   除了正则去删除console语句之外，还有其他方式吗？能结合ast去做这件事情不？

结语
--

多的不谈了，祝大家之后面试顺利~😉

当然，也祝我自己之后面试顺利~😋