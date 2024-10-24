---
author: "捡田螺的小男孩"
title: "Java程序员必备：查看日志常用的linux命令"
date: 2019-10-27
description: "趁周末，复习一下鸟哥的linux私房菜，看到文件内容查阅部分，做个笔记，哈哈，希望对你有帮助哦。 cat是Concatenate的缩写，主要功能是将一个文件的内容连续显示在屏幕上面。 一般文件内容行数较少时，如40行之内，适合用cat。 如果是一般的DOS文件时，就需要特别留意…"
tags: ["Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:59,comments:0,collects:135,views:8100,"
---
前言
--

趁周末，复习一下鸟哥的linux私房菜，看到文件内容查阅部分，做个笔记，哈哈，希望对你有帮助哦。

cat
---

cat : 由第一行开始显示文件所有内容

### 参数说明

```
cat [-AbEnTv]
参数：
-A : 相当于-vET 的整合参数，可列出一些特殊字符，而不是空白而已
-b ：列出行号，仅针对非空白行做行号显示，空白行不标行号
-E ：将结尾的断行字符$显示出来
-n : 打印行号，连同空白行也会有行号，与-b的参数不同
```

### 范例demo

**范例一：**

查看cattest.txt的内容

```
[root@iZ2zehkwp9rwg4azsvnjbuZ whx]# cat cattest.txt
test cat command
jaywei

#####
```

**范例二：**

查看cattest.txt的内容，并且显示行号

```
[root@iZ2zehkwp9rwg4azsvnjbuZ whx]# cat -n cattest.txt
1	test cat command
2	jaywei
3
4	#####
```

### 适用场景

*   cat是Concatenate的缩写，主要功能是将一个文件的内容连续显示在屏幕上面。
*   一般文件内容行数较少时，如40行之内，适合用cat。
*   如果是一般的DOS文件时，就需要特别留意一些奇怪的符号，例如断行与\[Tab\]等，要显示出来，就得加入-a之类的参数了。

tac
---

tac : 从最后一行开始显示，可以看出tac是cat的倒写形式

### 范例demo

```
[root@iZ2zehkwp9rwg4azsvnjbuZ whx]# tac  cattest.txt
#####

jaywei
test cat command
```

### 适用场景

*   tac 的功能跟cat相反，cat是由“第一行到最后一行连续显示在屏幕上”，而tac则是“由最后一行到第一行反向在屏幕上显示出来”。

head
----

head ：显示文件开头的内容，以行为单位，默认文件开头的前10行

### 参数说明

```
head [OPTION]... FILE...
-n<行数> 显示的行数
-q 隐藏文件名
-v 显示文件名
-c<字节> 显示字节数
```

### 范例demo

显示 sentinel.conf 文件前12行

```
[root@iZ2zehkwp9rwg4azsvnjbuZ redis-4.0.7]# head -n 12  sentinel.conf
# Example sentinel.conf

# *** IMPORTANT ***
#
# By default Sentinel will not be reachable from interfaces different than
# localhost, either use the 'bind' directive to bind to a list of network
# interfaces, or disable protected mode with "protected-mode no" by
# adding it to this configuration file.
#
# Before doing that MAKE SURE the instance is protected from the outside
# world via firewalling or other means.
#
```

tail
----

查看文件的内容，也是以行为单位，默认10行，从尾往前看。监听Java动态日志时，一般跟`-f`参数配合使用。

### 参数说明

```
tail [参数] [文件]
-f 循环读取
-q 不显示处理信息
-v 显示详细的处理信息
-c<数目> 显示的字节数
-n<行数> 显示文件的尾部 n 行内容
```

### 范例demo

**范例一**

显示sentinel.conf文件的最后12行

```
[root@iZ2zehkwp9rwg4azsvnjbuZ redis-4.0.7]# tail -n 12  sentinel.conf
# <role> is either "leader" or "observer"
#
# The arguments from-ip, from-port, to-ip, to-port are used to communicate
# the old address of the master and the new address of the elected slave
# (now a master).
#
# This script should be resistant to multiple invocations.
#
# Example:
#
# sentinel client-reconfig-script mymaster /var/redis/reconfig.sh
```

**范例二**

持续检测sentinel.conf的内容

```
[root@iZ2zehkwp9rwg4azsvnjbuZ redis-4.0.7]# tail -f sentinel.conf
# The arguments from-ip, from-port, to-ip, to-port are used to communicate
# the old address of the master and the new address of the elected slave
# (now a master).
#
# This script should be resistant to multiple invocations.
#
# Example:
#
# sentinel client-reconfig-script mymaster /var/redis/reconfig.sh
<==要等到输入[ctrl]-c 之后才离开tail 这个命令的检测
```

**范例三**

持续检测sentinel.conf的内容，并匹配redis关键字。匹配关键字，一般用`grep` ，`tail` 一般也会跟`grep` 搭档使用。

```
[root@iZ2zehkwp9rwg4azsvnjbuZ redis-4.0.7]# tail -f sentinel.conf | grep redis
# sentinel client-reconfig-script mymaster /var/redis/reconfig.sh
<==要等到输入[ctrl]-c 之后才离开tail 这个命令的检测
```

### 适用场景

*   `tial -f` 被用来动态监听Java日志，开发联调经常使用到，它一般跟`grep` 一起搭档使用。

more
----

more ：一页一页地显示文件内容

### 参数说明

```
more [-dlfpcsu] [-num] [+/pattern] [+linenum] [fileNames..]
参数：
-num ：一次显示的行数
-p ：不以卷动的方式显示每一页，而是先清除萤幕后再显示内容
-c ： 跟 -p 相似，不同的是先显示内容再清除其他旧资料
-s ： 当遇到有连续两行以上的空白行，就代换为一行的空白行
+/pattern ： 在每个文档显示前搜寻该字串（pattern），然后从该字串之后开始显示
-u ：不显示下引号 （根据环境变数 TERM 指定的 terminal 而有所不同）
+num : 从第 num 行开始显示
fileNames ：欲显示内容的文档，可为复数个数
```

### 常用操作命令

```
[root@iZ2zehkwp9rwg4azsvnjbuZ redis-4.0.7]# more sentinel.conf
# Example sentinel.conf
...(中间省略) ...
# Note that whatever is the ODOWN quorum, a Sentinel will require to
# be elected by the majority of the known Sentinels in order to
# start a failover, so no failover can be performed in minority.
#
# Slaves are auto-discovered, so you don't need to specify slaves in
--More--(29%)

```

仔细看上面的范例，如果more后面接的文件内容行数大于屏幕输出的行数时，就会出现类似上面的图示。重点在最后一行，最后一行会显示出目前显示的百分比，而且还可以在最后一行输入一些有用的命令。在more这个程序的运行过程中，你可以使用一些常用的操作命令：

*   空格键 ：代表往下翻一页
*   Enter : 代表往下滚动一行
*   /字符串 ：代表在这个显示的内容当中，向下查询“字符串” 这个关键字
*   :f :立刻显示出文件名以及目前显示的行数
*   q :代表立刻离开more，不再显示该文件内容
*   b或\[Ctrl\]-b :代表往回翻页，不过这操作只对文件有用，对管道无用。

**最常用的是**：按`q`离开，按`空格键`往下翻页，按`b`往回翻页，以及`/字符串`搜索功能，请看以下demo

### 范例demo

**范例一**

```
[root@iZ2zehkwp9rwg4azsvnjbuZ redis-4.0.7]# more -10 sentinel.conf
# Example sentinel.conf
...(此处省略)...
# Before doing that MAKE SURE the instance is protected from the outside
--More--(4%)
```

分页查看sentinel.conf文件，一页展示10行。按下`空格键`，可以往下翻页，

```
[root@iZ2zehkwp9rwg4azsvnjbuZ redis-4.0.7]# more -10 sentinel.conf
# Example sentinel.conf
...(此处省略)...
# protected-mode no
# port <sentinel-port>
# The port that this sentinel instance will run on
--More--(7%)
```

按下`b`，可以回退到上一页

```
# *** IMPORTANT ***
...(此处省略)...
# Before doing that MAKE SURE the instance is protected from the outside
# world via firewalling or other means.
--More--(5%)
```

按下`q`，可以立刻离开more

```
[root@iZ2zehkwp9rwg4azsvnjbuZ redis-4.0.7]#
```

**范例二**

如果想在sentinel.conf文件中，搜寻sentinel关键字，可以这样做

```
[root@iZ2zehkwp9rwg4azsvnjbuZ redis-4.0.7]# more -10  sentinel.conf
# Example sentinel.conf
...(此处省略)...
# Before doing that MAKE SURE the instance is protected from the outside
/sentinel  输入/之后，光标就会自动跑到最下面一行等待输入
```

如同上面的说明，输入了/之后，光标就会跑到最下面一行，并且等待你的输入，你输入了字符串并按下\[Enter\]之后，more就会开始向下查询该字符串，而重复查询同一个字符串，可以直接按下n即可。最后不想看了，就按下q离开more。

```
# Before doing that MAKE SURE the instance is protected from the outside
/sentinel
...skipping
# protected-mode no

# port <sentinel-port>
# The port that this sentinel instance will run on
port 26379

# sentinel announce-ip <ip>
# sentinel announce-port <port>
#
/
...skipping
# Example:
#
# sentinel announce-ip 1.2.3.4

# dir <working-directory>
# Every long running process should have a well-defined working directory.
# For Redis Sentinel to chdir to /tmp at startup is the simplest thing
# for the process to don't interfere with administrative tasks such as
# unmounting filesystems.
--More--(23%)
```

### 适用场景

*   more使用日志比较大的文件查看，可以一页一页查看，不会让前面的数据看不到。

less
----

less 与 more 类似，但less的用法比起more又更加有弹性。

*   若使用了less时，就可以使用下、下等按键的功能来往前往后翻看文件。
*   除此之外，在less里头可以拥有更多的查询功能。不止可以向下查询，也可以向上查询。

### 常用操作命令

*   空格键：往下翻动一页
*   \[pagedown\]： 向下翻动一页
*   \[pageup\]： 向上翻动一页
*   Enter : 代表往下滚动一行
*   y ：向前滚动一行
*   /字符串：向下搜索"字符串"的功能
*   ?字符串：向上搜索"字符串"的功能
*   n：重复前一个搜索（与 / 或 ? 有关）
*   N：反向重复前一个搜索（与 / 或 ? 有关）
*   q: 离开less这个程序
*   b 向后翻一页

### 范例demo

**范例一**

在sentinel.conf文件中，搜寻sentinel关键字，如下

```
less sentinel.conf
```

输入反斜杠`/`，输入关键字`sentinel`，回车

![](/images/jueJin/16e0c9cab9d0878.png)

重复前一个搜索，可以按n，反向重复前一个搜索，按N

**范例二**

Linux 动态查看日志文件，一般用tail -f ，但是我们也可以用less+ F 实现。

```
less + file-name + 命令 F =  tail -f + file-name
```

我们经常用tail -f +grep 关键字，动态查找报错的日志，也可以用less实现。先输入shirft+g，到达文件结尾

![](/images/jueJin/16e0caf7214d227.png)

然后输入`？`，输入搜索关键字，如`sentinel`，回车，然后按`n`键往上搜索，效果是不是也不错？尤其日志文件动态刷新太快的时候，奸笑脸。

![](/images/jueJin/16e0cb4652c3ac4.png)

### 适用场景

*   less适合日志比较大的文件查看，可以一页一页查看，并且比more更灵活，也可以动态查看日志，我一般用它查看Java日志。

小结
--

本文总结了查看文件日志的几个linux命令，cat、tac、head、tail、more、less，其中less真的很适合日常开发日志查看，非常推荐less。

参考与感谢
-----

*   《鸟哥的linux私房菜》
*   [Linux 命令大全 |菜鸟教程](https://link.juejin.cn?target=https%3A%2F%2Fwww.runoob.com%2Flinux%2Flinux-command-manual.html "https://www.runoob.com/linux/linux-command-manual.html")

个人公众号
-----

![](/images/jueJin/16c381c89b127bb.png)

*   如果你是个爱学习的好孩子，可以关注我公众号，一起学习讨论。
*   如果你觉得本文有哪些不正确的地方，可以评论，也可以关注我公众号，私聊我，大家一起学习进步哈。