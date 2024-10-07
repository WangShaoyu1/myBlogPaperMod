---
author: "Justin_lu"
title: "当我入手一台MacBookPro之后"
date: 2024-08-02
description: "从M3芯片开始，很多工具都需要更新，这次mbp更换，我打算从零开始，重新蒸腾一番，顺带更新一下工具库，说干就干，Go！"
tags: ["macOS","程序员","Mac"]
ShowReadingTime: "阅读8分钟"
weight: 442
---
![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/505bcbd644e34a8aa21267c227d76777~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=2G45hHpyiDbcKjUHErs2g4AXfEE%3D) 从 13 年实习开始，开发环境从 Ubuntu 转战 MacOS，中间换了好几次电脑，每次都是直接用 Mac 自带的 Time Machine 来迁移数据，仅需一块移动硬盘或者一根 type c 线，经过一个晚上的数据迁移，第二天就可以用新电脑工作了，除了配置升级了，几乎感受不到换电脑的乐趣，并且升级过程中，也积累了不少系统升级的旧疾，这次从Intel芯片到 M3 Max 芯片，我打算从零开始，重新蒸腾一番，顺带更新一下工具库，说干就干，Go！ 先介绍下新电脑的配置

*   太空黑：从经典的银色、到太空灰，这次体验一下太空黑
*   14 寸：用了大概 3 年的 14 寸，就一直用 15/16寸，因为这台不是用于办公，考虑携带方便，所以入手 14 寸（大屏幕肯定爽，但是在家主要也是外接显示器）

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f5d6692651c243eda37da983953b8634~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=bO4ZHH1TA1Y2BYOFE6RvrUCXnn8%3D)

*   M3 Max：想要体验一下本地大模型，直接入手 Max（找个借口🤐）
*   64G 内存：一直有在 macbook 上装虚拟机（Parallels Desktop）运行 Windows的习惯，升级了一下内存
*   2TB SSD：以前 512 的时候，由于各种 npm 包、docker 镜像，还是隔一段时间就要重启一下、硬盘清理等方式来释放空间，一步到位

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f36a134d36244322b628e592bd1bb44d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=RzOXelpD7eZ33V%2FSuYwU%2F0UBWKg%3D) ![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/90bfd9d398da4ef48f8c2f066c77738e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=OPFwBSDK85dMuvg1aqfZBA9QatY%3D) ![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/3bcc62ccc0d44d9188451b7107d681b0~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=DX7%2FWdDWWfenyhL4Mo2Ftc%2B5hMM%3D) 后面还换过几台，从最开始的 touchbar ，蝶式键盘，再到取消 touchbar，这时候更多的是工作工具的更换，连拍照的激情都没有🥱🥱

### 开发工具

#### 科学上网工具

作为开发，第一件事情是需要一个趁手的科学上网工具，不然类似下载 Google Chrome、安装 Homebrew 等基础的工具都会十分麻烦 我的科学上网工具，支持按照规则配置自动代理，同时也支持终端代理，以下是终端代理，这里不方便推荐具体工具

perl

 代码解读

复制代码

`# 防止终端命令无法确定是否需要科学上网，不建议把这个命令持久化到 bashrc/zshrc,在需要时打开终端输入即可  export https_proxy=http://127.0.0.1:1235 http_proxy=http://127.0.0.1:1235 all_proxy=socks5://127.0.0.1:1234`

#### Xcode

Xcode 命令行工具，许多开发工具和依赖所需的基础，运行一下命令，选择安装，稍等一会即可

lua

 代码解读

复制代码

`xcode-select --install`

#### Homebrew

通过 homebrew 来管理一些开发工具包，如 git、node等等，由于需要下载 github 地址，这里需要借助你的翻墙工具

bash

 代码解读

复制代码

`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

然后按照提示，把命令加到 PATH

bash

 代码解读

复制代码

`(echo; echo 'eval "$(/opt/homebrew/bin/brew shellenv)"') >> ~/.zprofile eval "$(/opt/homebrew/bin/brew shellenv)"`

#### Git/Tig

bash

 代码解读

复制代码

`brew install git # brew install git-gui  # brew install tig 个人是 vim 用户，偏向这种终端 gui # 这里会自动安装 zsh 的自动补全工具，后续安装 zsh 可用 # /opt/homebrew/share/zsh/site-functions`

安装 git 和 tig 都会默认新增 zsh 的补全方法，好吧，这是提醒我要立马安装 zsh tigrc 可以用来自定义 tig 的一些配置和快捷键绑定

typescript

 代码解读

复制代码

`A sample of the default configuration has been installed to:   /opt/homebrew/opt/tig/share/tig/examples/tigrc to override the system-wide default configuration, copy the sample to:   /opt/homebrew/etc/tigrc zsh completions and functions have been installed to:   /opt/homebrew/share/zsh/site-functions`

在任意已经初始化 git 的项目，打入 tig ，然后你就可以使用 vim 的方式来操作了 jk 等等 ![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/c1684af0ca914299863f130200d6a03a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=SXNFFqZxqWSy4U%2BJwr3OwqW6NPE%3D) 另外，使用 git 我还会额外安装两个 git 相关的小插件 一个是 tj 大神开发的 git-extras

bash

 代码解读

复制代码

`brew install git-extras # 添加到 ~/.zshrc source /opt/homebrew/opt/git-extras/share/git-extras/git-extras-completion.zsh`

详细的命令可查看[文档](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ftj%2Fgit-extras%2Fblob%2Fmain%2FCommands.md "https://github.com/tj/git-extras/blob/main/Commands.md")，我比较常用了是 git summary、git undo、git setup ![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/acb3aa488d624d37b440b087f4e9f22e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=JQr42x4kTTWfZwp6u2GUWORAh70%3D) 然后通过git 的 alias 来实现一个自定义的命令，git up 来实现每次切换到一个仓库时，有意思的更新一下最新代码

css

 代码解读

复制代码

`git config --global alias.up '!git remote update -p && git pull --rebase && git submodule update --init --recursive'`

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ff23a3ead83f48178847adb3c92a9bfd~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=JAYYBoulvSTAgsKUmjyzzgEcWd0%3D)

#### iTerm

实现通过 command + ecs 键，快速切换显示/隐藏 iTerm ![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/feb90fae642e4f9ab970286678b53ffb~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=LgZ88Tzb%2B6rHvoQ%2B6ku3QNTNSr4%3D)

*   设置默认终端
*   安装 shell integration

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/8771a84b8f8a444896dda355b131d0a1~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=pTaWVVfpH97Nm6%2Fx3cStYb23FyU%3D)

*   选配色：Solarized
*   安装 oh-my-zsh

bash

 代码解读

复制代码

`sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`

*   修改主题，配置插件等等

 代码解读

复制代码

`brew install zsh-syntax-highlighting brew install zsh-autosuggestions  brew install autojump brew install fzf`

ini

 代码解读

复制代码

`#ZSH_THEME="robbyrussell" #ZSH_THEME="agnoster" #ZSH_THEME="miloshadzic" #ZSH_THEME="sunrise" # ZSH_THEME="ys" ZSH_THEME="gnzh" plugins=(git ruby autojump osx rake rails lighthouse sublime) plugins=(bgnotify) plugins=(web-search) plugins=(node) source /opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh source /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh [ -f /opt/homebrew/etc/profile.d/autojump.sh ] && . /opt/homebrew/etc/profile.d/autojump.sh source <(fzf --zsh)`

这就起飞了！看看效果 ![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/d0b9fddad47a467cbdc2a528c600bbf5~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=ata7EY1kKr9TruPqfQr4dW4iW3E%3D)

#### Docker Desktop

作为开发，docker 技能必不可少，mac 下直接使用 docker desktop，可以省掉很多事情，特别是当你如果需要在本地跑 k8s 环境时，直接勾上 Enable Kubernetes 即可；另外新版本查看镜像，也可以扫描镜像每一层是否有安全漏洞，十分方便 ![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/04c8f696dca44576857c70d5b8faa1d1~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=DNl0T86tUDFZS3S5H7E25tl0%2FEs%3D)

#### VSCode

vscode 不仅适合前端开发，对于 Go、Rust 等开发者，整体体验都不错。安装后的第一件事，就是把 code 命令加到 Terminal ![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/a59e6a5ab96e4267b3498f1651ac0589~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=Q%2BxILB1383hcroKmucPuNLh2L9g%3D) 然后第二件事就是安装 github 的 Copilot 插件，开发、看源码现在是少不了它了 ![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/fbb339d382ec4b6aa5e267f8a9f58903~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=leQGgML6GoaGZkn2YbmAWUAbBwI%3D) 第三件事就是在 vscode 开启 vim 模式（安装 vim 插件)从 vim - sublime - vscode，一直保留 vim 的使用习惯，改不掉了😂 其他的就是各种高亮、开发辅助插件，大家按需安装即可

#### 其他

*   前端
    *   NVM：node 版本管理
    *   pnpm：上一台电脑只有 512G，在动不动就几个 G 的前端项目，硬盘一直告警，至此只用 pnpm
*   Go
    *   GVM： go 版本管理
    *   GoLand：虽然 vscode 可以开发 go，但是整体体验还是比不上收费的 goland

环境搭建可参考 [Go + React 指北](https://link.juejin.cn?target=http%3A%2F%2Fjustin-lu.top%2Farchives%2F1702796481830 "http://justin-lu.top/archives/1702796481830")

### 效率工具

#### ChatGPT

说到效率工具，ChatGPT 绝对是提高效率神器，从日常问题到开发、图片生成、画图等等，哦，还可以帮忙挑西瓜🍉 ![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f3c60a80f67a43bca7938a9ce564b690~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=c5uwpC1Tuh7sarmK%2F0qlOzRuMcQ%3D) ![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/57dd82c92efe47d9b776935c28a37b9b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=p6DYuSfWb%2FAzzzmO1%2F%2FpzchU160%3D) 对了，用了苹果芯片，ChatGPT app 直接通过 option + space 即可随时调出，支持实时对话、支持截屏问问题等等，好用程度大幅上升⬆️⬆️⬆️ ![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/6423103e1c69428280ec5aa3b65f588a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=dd%2BnTD0lFJn2ITZVIFn8N2xFBM4%3D)

#### Bartender($)

吐血推荐，让你状态栏更加一目了然 支持自定义显示哪些 icon，配置哪些 icon 始终不显示，哪些第二状态栏显示 ![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/6848f96ceb7842ccb7bbcd8820479a40~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=Je4njTAiCgusOJPOvPHb%2BrrgllI%3D) 快捷键切换第二状态栏，一下子清爽颜值高 ![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/4419b09a6f5f4726aae5cfc553a16415~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=dIcqFnFBcmaz9Xz9IcJZBrPXbyE%3D)

#### [iStat Menus($)](https://link.juejin.cn?target=https%3A%2F%2Fbjango.com%2Fmac%2Fistatmenus%2F "https://bjango.com/mac/istatmenus/")

拥有时刻关注着网速、CPU使用率、内存使用率的强迫症，绝对不少 ![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/61e6f9bfa0c04ddc91721ad9ca64c81d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=ykAUnroG5xEBSd8OxPVDpYm8Hfk%3D)

#### [Yoink](https://link.juejin.cn?target=http%3A%2F%2Feternalstorms.at%2Fyoink "http://eternalstorms.at/yoink")

当你要把一个文件从一个地方移到另外一个地方时，当你想快速复制一张图片时，剪切板记录、跨设备文件接力等等，这个小小的工具都能帮助你 有时候通过截屏软件截图，可以一次性把需要的截屏操作完，然后在剪贴板直接拖下来使用，十分方便！ ![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/499b8f0b184646ca869070846f0f71bd~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=fbS6Jt9kdZJDLc4OU7Vm8YWG7Yo%3D)

#### BettersnapTool

一款小而美的工具，用来快速调整你的窗口，比如当前窗口在两个显示屏直接切换；全屏，左右分屏等等 ![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/8c79df219e234d1cb88697b72d480802~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=9ywN5nVsuIhPFr4OX5Ezlo1SkI0%3D)

#### iShot

本来我一直使用 Skitch 的，但是这次切换新电脑之后，发现它下架了，之前有朋友推荐了，也使用了一段时间，感觉很不错，除了普通的截图，还有长截图、带壳截图；还有其他的小工具，官方宣传是 截图、长截图、全屏带壳截图、贴图、标注、取色、录屏、录音、OCR、翻译一个顶十个，样样皆优秀！ ![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/a1dc663740204fa5826bfae2bcb2dfa8~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=2X0bLDSqdi3m5GQJ%2F69%2BXbXbUjQ%3D)

#### Draw.io

好吧，这个绝对画图神器，日常写文档几乎离不开他，[在线版](https://link.juejin.cn?target=https%3A%2F%2Fdraw.io%2F "https://draw.io/")直接打开即可使用，也可以安装 vscode 插件，不过我还是习惯下载一个 app，这样本地的文件，直接打开即可使用 距离成为架构师，你只差一个 draw.io ![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/b51b59069e0e4839b22dd1b1dda7bef6~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=xKzmEsc3%2BXENlhbQlE1To9ZIcJ4%3D)

#### Parallels Desktop

如果你有使用 Windows 的诉求，那么我建议你花点钱买个 pd，融合模式一开，原来我的 16 年的机器，玩个魔兽、英雄联盟完全没问题 安装直接点击下载 Windows 11，网速好的话，10 来分钟就安装成功了 ![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/92064411d84f42a29756534e669dccce~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=sVguBIC9J4GwOIs9TbvSMckhKrc%3D) 融合模式，应用和直接使用 mac 的应用没任何差别 ![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/b9f31094f8e24d5cb3a3b678b2c9e917~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=QKMoU4FLBfHTxDB4XobjUMmJqM4%3D) 全屏模式，可以看到截图的时候有一部分黑色，应该是没有兼容刘海屏的原因 ![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/4aa9a7184a9b41c9b11cf1bc9ea2333e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=jFbU9TAgjvbFqJ73rSryuIfvp3k%3D)

#### Markdown 编辑器

Quiver，原来所有的笔记、文档基本都靠它来记录，21 年的时候作者停止维护了，再加上使用纯 markdown 工具，还需要自己找图床，最后都转到语雀、飞书等在线文档 中间还用过其他的、Mweb、Typora 等等，如果自己搭建图床，推荐使用 Typora ![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ca982336135145a48dd9d7a5566c7b27~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=budawVF9AQiGEyVi5jZYP0Dhw6k%3D)

![image-20240802223626203](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/68c889b3a6d74481b9993d9ca804ccfc~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=oAiqhfl7Ta3q7fLVRs2Mh3AbYdg%3D)

![image-20240802223739246](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/734a4e8d859947a5838e0ae56896bd8b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=wvyKM5szfDRwQeWZQUMgbDd0Er8%3D)

![image-20240802223841320](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/d874031ea16e4fb8b0b6e12bcd816f85~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=z2wQwysBliMqdUvEXe5sZ1lCijw%3D)

Mweb 包含PC 和 移动端，通过 iCloud 同步，也是十分方便！

#### 图床工具

原来写 markdown 的时候，使用的是微博免费的图床，2 年后，然后发现图片都失效了！失效了！

所以，图床还是自己维护比较靠谱！

PicList，免费开源，我自己是购买了阿里云按量付费的 OSS，简单配置一下 aks，即可上传图片，配合 Typora，轻松完成写作

![image-20240802224136523](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/345bcd0913c64e6c8efc139a224cdb7d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=yKNcg5lwxOuEgfN%2BJAKU5d29KEo%3D)

配置好之后，图片拖到 markdown 编辑框，即可实现自动上传

![image-20240802224555813](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/45651a3b9be74ba4ba1265c7a76abccc~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=smSgZ%2BzM4Mnl1lmeK27z%2FP38diw%3D)

#### [BreakTime](https://link.juejin.cn?target=http%3A%2F%2Fbreaktimeapp.com%2F "http://breaktimeapp.com/") 定时提醒工具

为了你的健康，你可以让电脑提醒你，每隔30分钟休息一下，倒杯水，看看风景 ![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/2832a56153fa407c94cc6f8a17060c7c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=n%2FtHs%2Fv3OER7ohKeDrjM4nEw0XM%3D)

#### [DaisyDisk](https://link.juejin.cn?target=https%3A%2F%2Fwww.daisydiskapp.com%2F "https://www.daisydiskapp.com/") （付费）磁盘空间，文件大小分析工具

作为只能买 256G 的屌丝，每天困扰我的一件事就是磁盘空间不足 现在我是 2T 了，可以不用了 也可以使用 腾讯柠檬用过一段时间，也很好用 ![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/55718b5095244a0e8b9922bad224fbfb~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=hXfUst1jdi4aspsEWdXsWWL0wkU%3D)

#### 微信输入法

搜狗输入法、RIME、百度输入法（作恶多端，还用） 上一次推荐，我还是使用搜狗输入法，有朋友推荐微信输入法，体验了一把，简洁、功能齐全，所以手机、PC 全部改用微信输入法 推荐跨设备复制黏贴，速度比苹果自带的快了许多 ![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/bb5e5e6c90b644e395fc0f77d383853d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluX2x1:q75.awebp?rk3s=f64ab15b&x-expires=1728451432&x-signature=lw7cPC8H2rbkfDw0LHbtEFx%2FCEU%3D)

#### 思维导图：Xmind, MindNode

脑图应用，一般在项目开发过程中用于 需求分解，Model Design 等等。

#### 其他小应用

*   [Caffeine](https://link.juejin.cn?target=https%3A%2F%2Fcaffeine.en.softonic.com%2Fmac%3Fex%3DDSK-173.4 "https://caffeine.en.softonic.com/mac?ex=DSK-173.4")
*   [Manico](https://link.juejin.cn?target=https%3A%2F%2Fmanico.im%2F "https://manico.im/"), 在 macOS 强大的触摸板下，一直认为这个软件没什么用, 而且快捷键还有很多冲突
*   tmate, 搞基神器，结对编程，定位问题必备神器

### Chrome 插件推荐

*   Vimium, 通过键盘快捷键操作网页，比如打开，关闭，查找书签等等
*   FeHelper(前端助手)：JSON自动格式化、手动格式化，支持排序、解码、下载等，更多功能可在配置页按需安装
*   Axure RP Extension for Chrome
*   Grammarly for Chrome，语法检查
*   Octotree，github源码查看神器
*   OneTab，节省高达95％的内存，并减轻标签页混乱现象
*   Postman Interceptor
*   React Developer Tools
*   Redux DevTools
*   Yet Another Drag and Go：超级拖拽.向四个方向拖拽文字即可进行相应的搜索.拖拽链接可在前台/后台,左侧/右侧打开
*   掘金
*   Sider: ChatGPT 侧边栏 + GPT-4o, Claude 3.5, Gemini 1.5 & AI工具”的产品徽标图片 Sider: ChatGPT 侧边栏 + GPT-4o, Claude 3.5, Gemini 1.5 & AI工具
*   xSwitch：前端开发代理神器，在线 debug 问题，把线上资源代理到本地，方便复现问题