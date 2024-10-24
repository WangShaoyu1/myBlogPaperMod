---
author: "MacroZheng"
title: "为啥人家的命令行终端如此炫酷？原来用了这款137K+Star的神器！"
date: 2021-12-15
description: "最近在研究终端工具的时候，发现人家的终端可以输出各种彩色文字，还有各种提示，自己就算用了炫酷的Tabby也无法实现。后来发现需要另外安装工具才行，今天给大家介绍下这款功能强大，插件丰富的工具！"
tags: ["Java","后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:239,comments:0,collects:356,views:33975,"
---
> 最近在研究终端工具的时候，发现人家的终端可以输出各种彩色文字，还有各种提示，自己就算用了[炫酷的Tabby](https://juejin.cn/post/7038774700830359583 "https://juejin.cn/post/7038774700830359583")也无法实现。后来发现需要在Linux上安装`OhMyZsh`才行，今天给大家介绍下这款功能强大，插件丰富的工具！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

OhMyZsh简介
---------

OhMyZsh是一款开源工具，可以用于管理Zsh（Linux命令解释器的一种）的配置。使用OhMyZsh可以让你看起来像有10年工作经验的程序员，OhMyZsh有几百种插件可以供你使用，还有各种炫酷的主题。OhMyZsh非常流行，在Github上已经有`137K+`Star！

![](/images/jueJin/f29e3ed1cc82479.png)

Zsh简介
-----

上面提到了Zsh，它是Linux命令解释器的一种，CentOS默认的命令解释器是Bash，常用的还有sh、csh和tcsh。对比默认的Bash，Zsh的功能更强大，拥有大量插件，可以实现更强大的命令补全，命令高亮等功能。

安装
--

> OhMyZsh其实是Zsh的一种管理工具，在安装OhMyZsh之前我们得先安装Zsh。

### 安装Zsh

*   安装Zsh的方法很多，使用yum来安装很方便，不过OhMyZsh官方建议安装`5.0.8`以上版本，我们先来看下yum中的zsh版本号；

```shell
yum info zsh
```

![](/images/jueJin/25064f6f7b884e5.png)

*   如果你的版本号大于`5.0.8`可以使用yum来安装，使用如下命令即可，如果小于可以使用源码来安装；

```shell
yum -y install zsh
```

*   源码安装需要先下载Zsh的源码包，下载地址：[zsh.sourceforge.io/Arc/source.…](https://link.juejin.cn?target=https%3A%2F%2Fzsh.sourceforge.io%2FArc%2Fsource.html "https://zsh.sourceforge.io/Arc/source.html")

![](/images/jueJin/9a0722edd64b468.png)

*   先把下载好的源码包放到指定目录，然后使用如下命令进行解压安装；

```shell
# 安装依赖
yum -y install gcc perl-ExtUtils-MakeMaker
yum -y install ncurses-devel
# 解压
tar xvf zsh-5.8.tar.xz
cd zsh-5.8
# 检查安装环境依赖是否完善
./configure
# 编译并安装
make && make install
```

*   安装完成后可以使用如下命令查看Zsh的路径；

```shell
whereis zsh
```

![](/images/jueJin/9c98352086c44f2.png)

*   再把Zsh的路径添加到`/etc/shells`文件中去，在这里我们可以看到系统支持的所有命令解释器；

```shell
vim /etc/shells
# 添加内容如下
/usr/local/bin/zsh
```

![](/images/jueJin/15742c01fb764f7.png)

*   最后查看下Zsh版本号，用于检测Zsh是否安装成功了。

```shell
zsh --version
```

![](/images/jueJin/09a12ebbecaa412.png)

### 安装OhMyZsh

*   接下来我们来安装OhMyZsh，直接使用如下命令安装；

```shell
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

*   如果遇到下载不下来的情况，可以先创建一个`install.sh`文件，然后从Github上复制该文件内容，再使用如下命令安装：

```shell
# install.sh 地址：https://github.com/ohmyzsh/ohmyzsh/blob/master/tools/install.sh
./install.sh
```

*   安装完成后会提示你修改Linux使用的默认shell，使用如下命令可查看修改默认shell；

```shell
# 查看当前在使用的shell
echo $SHELL
# 也可以使用下面命令自行修改默认shell
chsh -s $(which zsh)
```

![](/images/jueJin/8543c949b87543c.png)

*   安装成功后配置文件为`.zshrc`，安装目录为`.oh-my-zsh`，安装目录结构如下。

![](/images/jueJin/db650d0b2a74479.png)

使用
--

> OhMyZsh的功能强大之处在于它的插件很丰富，界面炫酷在于它的主题也很丰富，下面我们分别来介绍下。

### 主题修改

*   OhMyZsh的主题非常丰富，自带主题都在`themes`文件夹中；

![](/images/jueJin/5f621ead6b78403.png)

*   修改主题只需修改配置文件`.zshrc`的`ZSH_THEME`属性即可，下面我们把主题改为`af-magic`；

```shell
vim ~/.zshrc
# 修改如下内容
ZSH_THEME="af-magic"
# 刷新配置，每次修改后都需要
source ~/.zshrc
```

*   修改成功后主题效果如下。

![](/images/jueJin/1b03e34d114c4ac.png)

### 使用插件

> OhMyZsh光自带插件就有300多个，还有很多第三方插件，可见插件生态非常丰富，下面我们来介绍几个好用的插件。

OhMyZsh的自带插件都在`plugins`目录下，统计了下，多达305个。

![](/images/jueJin/be6f43b0670c4ad.png)

#### zsh-syntax-highlighting

> 平时我们输入Linux命令的时候，只有在执行的时候才知道输错命令了，这款插件可以实时检测命令是否出错。

*   下载插件到指定目录，使用如下命令即可；

```shell
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

*   然后修改配置文件`.zshrc`，在plugins中添加插件`zsh-syntax-highlighting`；

```ini
plugins=(
git
zsh-syntax-highlighting
)
```

*   接下来再输入命令时就有高亮提示了，正确命令会显示绿色。

![](/images/jueJin/e5b43aa2168d43f.png)

#### zsh-autosuggestions

> 自动补全插件，输入命令后会自动提示相关命令，使用方向键`→`可以实现自动补全。

*   下载插件到指定目录，使用如下命令即可；

```shell
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

*   然后修改配置文件`.zshrc`，在plugins中添加插件`zsh-autosuggestions`；
    
*   此时我们输入命令前缀就会直接提示命令，然后按方向键`→`就可以实现自动补全了。
    

![](/images/jueJin/380ea900029a48a.png)

#### zsh-history-substring-search：

> 可以搜索命令历史的插件，使用`Ctrl+R`快捷键触发，模糊搜索历时使用的命令。

*   下载插件到指定目录，使用如下命令即可；

```shell
git clone https://github.com/zsh-users/zsh-history-substring-search ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-history-substring-search
```

*   然后修改配置文件`.zshrc`，在plugins中添加插件`zsh-history-substring-search`；
    
*   接下来我们就可以通过`Ctrl+R`快捷键触发，然后进行命令搜索补全了。
    

![](/images/jueJin/cb0c07aa46e343d.png)

#### docker

> 自带插件，可以实现docker命令补全和自动提示。

*   作为自带插件无需下载，直接修改配置文件`.zshrc`，在plugins中添加插件`docker`；
    
*   当我们输入docker开头的命令时，使用`Tab`键可以出现提示并自动补全。
    

![](/images/jueJin/112d72eb75ff4c2.png)

#### git

> 自带插件，添加了很多git的快捷命令。

*   直接修改配置文件`.zshrc`，在plugins中添加插件`git`；
    
*   该插件对于Git命令提供了非常多的快捷使用方式，比如下面的常用命令；
    

快捷别名

命令

g

git

gcl

git clone

ga

git add

gc

git commit

ggp

git push

ggl

git pull

gst

git status

gb

git branch

glg

git log --stat

*   使用快捷命令还是非常方便的！

![](/images/jueJin/00bfe9e074a74c8.png)

#### z

> 自带插件，可以快速跳转到上个cd的目录下。

*   直接修改配置文件`.zshrc`，在plugins中添加插件`z`，最终配置效果如下；

```ini
plugins=(
git
zsh-syntax-highlighting
zsh-autosuggestions
zsh-history-substring-search
docker
z
)
```

*   我们先切换到`.oh-my-zsh/custom/plugins`目录下，然后再切换到其他目录下，之后直接使用`z plug`命令就可以切换回去了。

![](/images/jueJin/13531e9d9c824a8.png)

btop
----

> 我们的命令行终端已经这么炫酷了，再使用top命令来看服务器的运行状态就有点掉档次了，下面来介绍个更好用的工具`btop`。

### 简介

btop是一款服务器资源监控工具，可以用来查看服务器的CPU、内存、磁盘、网络和进程状态。

### 安装

*   首先我们需要下载btop的安装包，下载地址：[github.com/aristocrato…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Faristocratos%2Fbtop%2Freleases%2Ftag%2Fv1.1.2 "https://github.com/aristocratos/btop/releases/tag/v1.1.2")

![](/images/jueJin/ef7e642c73f649a.png)

*   下载完成后，解压到指定目录，并使用`install.sh`安装即可；

```shell
# 创建安装目录
mkdir btop
# 解压到安装目录
tar -xvf btop-1.1.2-x86_64-linux-musl.tbz -C btop
cd btop
# 安装
./install.sh
```

### 使用

*   btop使用起来非常简单，直接使用`btop`命令即可运行；

```shell
btop --utf-force
```

*   运行成功后，界面还是非常炫酷的，服务器资源信息一目了然，再也不想用top命令了；

![](/images/jueJin/f3501986a8344c3.png)

*   btop还支持鼠标交互，把单纯的命令行玩成了图形化界面的感觉，选择一个进程可以查看详细信息；

![](/images/jueJin/c1800eee839f408.png)

*   按`ESC`键可以退出、修改设置或查看帮助；

![](/images/jueJin/3763419cf4324b1.png)

*   如果你想卸载的话，可以在安装目录使用如下命令。

```shell
make uninstall
```

总结
--

OhMyZsh确实是款非常不错的工具，它极大地提高了我们的工作效率，让我们看起来更像资深程序员。btop也让我们的命令行终端更炫酷，用过之后再也不想用top命令使用了。如果你想让你的命令行终端更炫酷，不妨试试它们！

参考资料
----

*   OhMyZsh官网：[github.com/ohmyzsh/ohm…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fohmyzsh%2Fohmyzsh "https://github.com/ohmyzsh/ohmyzsh")
*   btop官网：[github.com/aristocrato…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Faristocratos%2Fbtop "https://github.com/aristocratos/btop")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！