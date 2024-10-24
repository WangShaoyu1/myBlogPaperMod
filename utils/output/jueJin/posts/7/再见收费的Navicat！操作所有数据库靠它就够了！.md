---
author: "MacroZheng"
title: "再见收费的Navicat！操作所有数据库靠它就够了！"
date: 2021-10-20
description: "为了快速管理数据库，我们一般都会选择一款顺手的数据库管理工具。Navicat、DataGrip虽然很好用，但都是收费的。今天给大家推荐一款免费、功能强大的数据库管理工具，希望对大家有所帮助！"
tags: ["Java","后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:132,comments:57,collects:155,views:22513,"
---
> 为了快速管理数据库，我们一般都会选择一款顺手的数据库管理工具。Navicat、DataGrip虽然很好用，但都是收费的。今天给大家推荐一款免费、功能强大的数据库管理工具`DBeaver`，希望对大家有所帮助！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

DBeaver简介
---------

DBeaver是一款开源的数据库管理工具，在Github上已经有`22K+`Star。支持多达`100`种数据库，不管是关系型数据库还是非关系型数据库，基本上你能想到的数据库它都能支持，下面我们来看看它支持的数据库够不够全！

![](/images/jueJin/15732bec021946d.png)

下载安装
----

> 接下来我们来下载安装DBeaver，直接下载压缩包版本，解压即可使用。

*   首先我们从官网下载`zip`版本，下载地址：[dbeaver.io/download/](https://link.juejin.cn?target=https%3A%2F%2Fdbeaver.io%2Fdownload%2F "https://dbeaver.io/download/")

![](/images/jueJin/b30d9eb1523a4a7.png)

*   下载完成后解压到指定目录，然后双击`dbeaver.exe`即可运行；

![](/images/jueJin/f6cef2605cd2465.png)

*   运行成功后，默认可以选择创建一个测试数据库（基于SQLite的数据库），看下界面，有点像Eclipse，实际上DBeaver就是基于Eclipse开发的。

![](/images/jueJin/f408c14277f545e.png)

外观配置
----

> 我们安装工具后，免不了需要一些设置，比如设置下字体大小之类的，接下来我们来设置下DBeaver。

*   默认情况下DBeaver的字体很小，我们需要调大点，选择`窗口->首选项->外观->颜色和字体->基本->文本字体`进行设置；

![](/images/jueJin/6dbdbdae01724be.png)

*   然后双击设置字体大小即可，比如设置为`12`号字体；

![](/images/jueJin/4a7131e3aed946a.png)

*   如果你想快速熟悉DBeaver的快捷键的话，可以打开`帮助->辅助键`面板查看所有快捷键；

![](/images/jueJin/6cf718f9c9da423.png)

*   如果你习惯了深色主题，也可以将DBeaver设置为深色主题，在`窗口->首选项->外观`中可以进行主题设置，选择`Dark`即可；

![](/images/jueJin/9c3813a179054d0.png)

*   设置完成后，我们看下界面，还是挺炫酷的！

![](/images/jueJin/cf99bc51d886475.png)

创建数据源
-----

> 使用DBeaver操作数据库时，我们需要先创建数据源。

*   我们可以选择`左上角的加号->MySQL`来创建MySQL数据源；

![](/images/jueJin/8cc043bf533b4e2.png)

*   创建完成后输入连接信息即可连接，如果是第一次连接的话会提示下载JDBC驱动；

![](/images/jueJin/f314c8a1bfb74a2.png)

*   连接成功后就可以在左侧看到数据库中的数据库、表、视图、索引等相关信息了。

![](/images/jueJin/4d821a7430d54b3.png)

管理表相关操作
-------

> 数据库连接创建完成后，我们就可以对其中的表进行操作了，接下来我们来查看、创建下表试试。

*   双击一张表，选择`属性`标签，可以看到表详细的列属性；

![](/images/jueJin/27f417263a034a7.png)

*   选择`属性->DDL`可以查看详细的建表语句；

![](/images/jueJin/7d4d61bdfab54f8.png)

*   选择`数据`标签，可以分页查看表中数据；

![](/images/jueJin/4973fd5c1b6a49a.png)

*   在顶部过滤框中直接输入SQL语句中的`where`部分，可以直接过滤表数据；

![](/images/jueJin/7ba2b4f7200f45f.png)

*   如果我们不想显示某些字段，可以右键表头选择`过滤->自定义过滤`，然后把过滤字段`[v]`改成`[]`即可；

![](/images/jueJin/333634ed4e7a46a.png)

*   如果你想新建表的话，在左侧右键，选择`新建表`即可；

![](/images/jueJin/ce00e9ab10f1412.png)

*   然后右键选择添加字段，在DBeaver中，`[v]`符号代表是，`[]`代表否，这里我们创建一个主键ID，选择自增；

![](/images/jueJin/658854f0157846e.png)

*   这里需要注意的是，主键需要在约束里面创建，选择创建约束，然后将`id`选择为主键约束即可。

![](/images/jueJin/25185835a8f74d6.png)

SQL操作
-----

> 数据库表操作介绍完了，接下来介绍下如何在DBeaver中进行SQL操作。

*   右键数据库，选择`SQL编辑器`可以之间打开SQL界面进行操作；

![](/images/jueJin/1f02bfc68d5b436.png)

*   DBeaver的SQL提示功能还是挺强大的，对于SQL关键字、函数、数据库表和字段都支持了；

![](/images/jueJin/ed856016db85455.png)

*   有时候我们需要创建`insert`所有字段的语句，此时手写比较麻烦，我们可以直接使用DBeaver`生成SQL`功能，右键选择一条记录，选择`生成SQL`即可；

![](/images/jueJin/0ea502d362b14ba.png)

*   我们可以发现基于全字段的CRUD语句基本都能生成，还是挺方便的，我们生成个`insert`语句试试。

![](/images/jueJin/ab117324f9be4c1.png)

其他数据库支持
-------

> 虽说DBeaver支持多达100种数据库，但是社区版本支持的数据库并不多，常用的NoSQL数据库MongoDB和Redis都没有支持。

*   使用企业版本才可以支持Redis，创建Redis连接后即可管理Redis中的数据；

![](/images/jueJin/b9ce4ae0fe04483.png)

*   创建MongoDB连接后也可以管理MongoDB中的数据。

![](/images/jueJin/2a942bac8bae437.png)

总结
--

DBeaver确实是一款非常优秀的开源数据库管理工具，提示很全，功能也多，平时开发基本上也够用了。但是对比那些收费的工具，还是有些不足的。对比Navicat，它没有[数据库结构同步](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FKm7lg-T0p9Kzb_WeyHVaqw "https://mp.weixin.qq.com/s/Km7lg-T0p9Kzb_WeyHVaqw")的功能，也没有[数据库设计](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FSJI0x7qQw5JkCvDWou7XaQ "https://mp.weixin.qq.com/s/SJI0x7qQw5JkCvDWou7XaQ")功能。对比[DataGrip](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FGEEraxqmqqtNmYt0vXifOg "https://mp.weixin.qq.com/s/GEEraxqmqqtNmYt0vXifOg")，它的提示功能显得有点弱，函数没提示。

参考资料
----

项目官网：[github.com/dbeaver/dbe…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdbeaver%2Fdbeaver "https://github.com/dbeaver/dbeaver")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！