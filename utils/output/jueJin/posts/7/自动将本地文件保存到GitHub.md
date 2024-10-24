---
author: "Java3y"
title: "自动将本地文件保存到GitHub"
date: 2020-01-13
description: "有人会好奇，为什么我要将本地文件保存到GitHub上呢？其实我的理由就只有一个：不知道为什么我的Typora有时候会出现无法响应的情况（直接卡死），这样可能会导致写了很久的内容会丢掉。 鸡蛋在前阵子也计划写文章，我看他写了两个星期的文章，在某一天告诉我：Typora的文件坏了，…"
tags: ["GitHub","Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:48,comments:8,collects:45,views:5629,"
---
前言
--

> 只有光头才能变强。

> **文本已收录至我的GitHub精选文章，欢迎Star**：[github.com/ZhongFuChen…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")

这篇文章主要讲讲如何**自动将本地文件保存到GitHub上**

有人会好奇，为什么我要将本地文件保存到GitHub上呢？其实我的理由就只有一个：不知道为什么我的**Typora**有时候会出现无法响应的情况（直接卡死），这样可能会导致写了很久的内容会丢掉。

鸡蛋在前阵子也计划写文章，我看他写了两个星期的文章，在某一天告诉我：**Typora**的文件坏了，怎么修复阿。

![](/images/jueJin/16f97ffefc1ed38.png)

最终的结果就是他写了两周的东西就这样丢了。

有的人看到这里可能就会说：**谁让你不用云笔记的产品，自动同步到云，用云笔记的会有这种事吗**？

这话也说得在理，只是Typora实在是好用（不单单是Typora，也有很多的好用产品只支持本地，没有同步云的功能）。

于是，我就打算定时将Typora的内容上传到Github，以免出现鸡蛋的那种情况。

> 电脑环境：Mac 10.15.2

这篇是**入门**的文章，你全当是**Git+Crontab**的入门教程就好了！

一、为什么GitHub？
------------

GitHub我就默认大家都知道它是什么东西了，我写过的文章都会收录到GitHub，方便我后续的查阅：

![](/images/jueJin/16f97ffefc24e18.png)

如果关注GitHub的同学会知道：GitHub给我们提供了**免费的私有仓库**（在以前都是公开仓库）。

![](/images/jueJin/16f97ffefc7f9df.png)

于是我们可以将自己不想公开的内容放到私有的仓库上。

我将本地的文件同步到GitHub的原因有两个：

1.  现在GitHub支持私有仓库
2.  Git作为程序员多多少少都会懂一些，而且它是真的方便。

二、动手
----

在动手之前，我们能猜想到：想要定时将本地保存到GitHub上，知识点大概有以下：

1.  懂一点点GitHub（拥有自己的GitHub账号，创建一个私有仓库）
2.  懂一点点Git命令（有Git环境）
3.  懂一点点Shell（定时脚本执行Git命令上传）

![](/images/jueJin/16f97ffefce9efd.png)

### 2.1 创建一个私有仓库

如何注册GitHub，在GitHub创建一个私有仓库，这里我就不多讲了。鼠标点点，就完成了

![](/images/jueJin/16f97ffeff1ef7a.png)

### 2.2 将本地文件上传到GitHub仓库

首先，我要把我的笔记目录作为Git可以管理的仓库，我的文件夹的名字叫做`markdown`

![](/images/jueJin/16f97ffeffa9fd1.png)

于是我将markdown目录变成Git可以管理的仓库

![](/images/jueJin/16f97fff26a4621.png)

先试试能不能把本地的文件push到GitHub，所以我们先`add`一下

![](/images/jueJin/16f97fff2b6946a.png)

然后`commit`一下

![](/images/jueJin/16f97fff3438196.png)

在push之前，我们需要看看自己的机器有没有跟GitHub仓库关联起来（一般第一次都没有），首先我们需要创建SSH Key。于是我们可以执行

```
ssh-keygen -t rsa -C "youremail@example.com"  --(引号的是自己的账号邮箱)
```

![](/images/jueJin/16f97fff348c4c0.png)

期间我们一路回车就好了，执行完之后，我们可以到用户主目录找到`.ssh`目录

![](/images/jueJin/16f97fff35260e4.png)

去`.ssh`目录找出公钥的文件`id_rsa.pub`

![](/images/jueJin/16f97fff35d3457.png)

将公钥的信息去GitHub上复制对应的内容就好了。对应的GitHub地址是：[github.com/settings/ke…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsettings%2Fkeys "https://github.com/settings/keys")

![](/images/jueJin/16f97fff586097d.png)

然后我们就将本地仓库与GitHub仓库关联起来：

```
git remote add origin git@github.com:ZhongFuCheng3y/markdown.git
```

![](/images/jueJin/16f97fff5836794.png)

![](/images/jueJin/16f97fff5f59390.png)

关联了以后，我们就可以将本地仓库push到远程仓库了

```
git push -u origin master
```

执行以后你可能会发现，出错了。push不上去，错误如下：

![](/images/jueJin/16f97fff5f68265.png)

我们要先把远程仓库的readme同步到本地仓库中，使用命令：

```
git pull --rebase origin master
```

![](/images/jueJin/16f97fff5f6cb4b.png)

完了以后，我们就可以看到已经把远程仓库的readme同步到本地了：

![](/images/jueJin/16f97fff6d54569.png)

然后我们再执行push命令将本地文件push到远程仓库中：

```
git push -u origin master
```

![](/images/jueJin/16f97fff8c2a06f.png)

去GitHub的仓库一看，就可以发现已经将本地文件同步到GitHub上了：

![](/images/jueJin/16f97fff8cec83c.png)

### 2.3 写脚本自动定时上传

首先，我们编写一个脚本文件，这个脚本非常简单，内容如下：

```
#!/bin/bash
cd /Users/3y/markdown
git add .
git commit -m "java3y auto save"
git push -u origin master
```

其实就是将上面的命令再写一次，然后我们就有了这个脚本了。我给这个脚本取名`autoSave.sh`。

接着，给这个脚本增加权限（为了方便我直接就是`chmod 777`)

![](/images/jueJin/16f97fff8e95981.png)

有了脚本以后，我们就可以将这个脚本放到`crontab`上执行，在mac上使用`crontab`非常方便。我们现在只需要记住两个命令：

```
crontab -e    --编辑crontab
crontab -l    --查看crontab的命令
```

ok，于是我们就可以写crontab命令了。这里是非常简单的，只要我们懂一点点`cron表达式`就好了，如果不懂也没关系，百度：“**cron 在线生成器**” 你就可以随自己喜好的时间去调用了。

![](/images/jueJin/16f97fff926b060.png)

于是我就写出了以下的cron表达式：

```
* * * * * /Users/3y/autoSave.sh > ~/b.txt 2>&1 &
```

完了以后，我们执行`crontab -l`就发现这条命令再crontab中了：

![](/images/jueJin/16f97fff931138d.png)

解释一下这条命令：

*   `* * * * *` 标志我这行命令需要在每分钟执行一次
*   `/Users/3y/autoSave.sh` 标志我的脚本位置（这里需要用**绝对路径**）
*   `> ~/b.txt 2>&1 &` 将脚本执行后的结果 输入到`b.txt`文件上

**完成**！我们就可以看到每分钟都会将本地的文件内容上传到GitHub上了

调试完成后，我们就可以将日志输出到`/dev/null`

![](/images/jueJin/16f97fff9fd1a24.png)

#### 2.3.1 可能会遇到的坑

在将命令最开始写到crontab时，我是没有打印执行的结果的。发现没有调用成功，排查了好久都没排查出来（一度怀疑是不是我的电脑crontab有问题）...

我当时还写了另一段脚本去看一下我的crontab有没有问题，再后来**才**把执行的结果写到文件上的

*   **执行一段程序也好，一段脚本也好，在最编写的时候一定要打日志**

期间也遇到过奇奇怪怪的坑，这里列一下，希望后续的人看到我这篇文章能解决掉相似的问题：

1.  脚本写完，记得加上**可执行**的权限
2.  保存crontab的时候，遇到`"/usr/bin/vi" exited with status 1`，可以尝试把crontab的进行杀掉，再重新启动。或者在`.zshrc`添加`export EDITOR=vim`
3.  如果在输出的结果上遇到**Operation not permitted**，把iTerm加上完全磁盘访问权限
    1.  打开mac的系统偏好设置 〉安全性与隐私〉隐私〉完全磁盘访问权限，加入iTerm然后勾选就行了
    2.  文件属性带有`@`，不要把脚本和文件夹放在`Download`目录下，Mac在执行crontab时会有奇奇怪怪的权限问题。

### 2.4 这次用到的命令

crontab服务:

```
开启：sudo /usr/sbin/cron start
重启：sudo /usr/sbin/cron restart
停止：sudo /usr/sbin/cron stop

编写crontab：crontab -e
查看crontab：crontab -l
```

杀死进程：

```
kill -9 pid
```

Git相关命令：

```
参考廖雪峰Git教程撸一下就可以了：
https://www.liaoxuefeng.com/wiki/896043488029600
```

最后
--

这篇文章主要是用`Mac`来讲解如何将本地文件自动同步到GitHub的，很多同学就会想：**大哥，我用的是Windows，你给我讲Mac有啥用阿**？

Mac能实现的，Windows也能实现，只不过方式和手段可能存在一点点区别而已，有兴趣的同学可以去折腾一下。

> 我在写这篇文章之前，我也不知道Mac的crontab会遇到这么多的问题，也花了我不少的时间去解决。对于这些问题，我也不懂。但是我们可以去找方案，找解决的办法，最终还是可以完成的。

可能你会看到我的**终端**花花绿绿的，我用的是`iTerm+一系列插件`组成的（Mac），想要对应的教程的同学可以在公众号下回复“**工具**”即可获取

看完这篇文章的同学可能会有很多话想说，因为crontab+脚本可以完成一系列有趣的东西，**不妨在评论区留言你用crontab做了什么有趣的事**？

参考资料：

*   [crontab无法执行脚本原因及解决方法](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2FGX_1_11_real%2Farticle%2Fdetails%2F86535942 "https://blog.csdn.net/GX_1_11_real/article/details/86535942")
    
*   [macOS中使用crontab教程以及问题解决办法](https://link.juejin.cn?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2Fa07f7ec3a55c "https://www.jianshu.com/p/a07f7ec3a55c")
    
*   [每日自动将你的网站备份到Github 告别数据丢失](https://link.juejin.cn?target=https%3A%2F%2Fmoe.best%2Fgotagota%2Fbackup-to-github.html "https://moe.best/gotagota/backup-to-github.html")
    
*   [Linux定时任务Crontab命令详解](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fshamo89%2Fp%2F10160946.html "https://www.cnblogs.com/shamo89/p/10160946.html")
    
*   [crontab 脚本错误日志和正确的输出写入到文件](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2FLI4836%2Farticle%2Fdetails%2F103835213 "https://blog.csdn.net/LI4836/article/details/103835213")
    

> **本已收录至我的GitHub精选文章，欢迎Star**：[github.com/ZhongFuChen…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")
> 
> 乐于输出**干货**的Java技术公众号：**Java3y**。公众号内**有300多篇原创**技术文章、海量视频资源、精美脑图，**关注即可获取！**

![](/images/jueJin/16f9c974e994ef9.png)

非常感谢**人才**们能看到这里，如果这个文章写得还不错，觉得「三歪」我**有点东西**的话 **求点赞** **求关注️** **求分享👥** **求留言💬** 对暖男我来说真的 **非常有用**！！！

创作不易，各位的支持和认可，就是我创作的最大动力，我们下篇文章见！