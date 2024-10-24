---
author: "MacroZheng"
title: "干掉Navicat！MySQL官方客户端到底行不行？"
date: 2020-12-01
description: "在我们选择工具的时候，往往会优先选择那些免费又好用的工具！Navicat作为一款付费软件，虽然功能强大，但也阻止不了我们探索新工具的步伐。最近体验了一把MySQL的官方客户端工具MySQL Workbench，本文将对其和Navicat做个对比，看看它能否取代Navicat! …"
tags: ["Java","MySQL中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:41,comments:0,collects:38,views:12904,"
---
> SpringBoot实战电商项目mall（40k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

在我们选择工具的时候，往往会优先选择那些免费又好用的工具！Navicat作为一款付费软件，虽然功能强大，但也阻止不了我们探索新工具的步伐。最近体验了一把MySQL的官方客户端工具`MySQL Workbench`，本文将对其和Navicat做个对比，看看它能否取代Navicat!

安装
--

> 我们先把`MySQL Workbench`安装好，其中有个小坑需要注意下。

*   首先我们需要下载`MySQL Workbench`的安装包，下载地址：[dev.mysql.com/downloads/w…](https://link.juejin.cn?target=https%3A%2F%2Fdev.mysql.com%2Fdownloads%2Fworkbench%2F "https://dev.mysql.com/downloads/workbench/")

![](/images/jueJin/bb32e303c27c454.png)

*   下载完成后我们双击安装会遇到一个问题，`MySQL Workbench 8.0`版本安装需要先安装`Visual C++ 2019 Redistributable Package`依赖；

![](/images/jueJin/f8e5ebab6c3246f.png)

*   下载`Visual C++ 2019 Redistributable Package`，下载地址：[support.microsoft.com/en-us/help/…](https://link.juejin.cn?target=https%3A%2F%2Fsupport.microsoft.com%2Fen-us%2Fhelp%2F2977003%2Fthe-latest-supported-visual-c-downloads "https://support.microsoft.com/en-us/help/2977003/the-latest-supported-visual-c-downloads")

![](/images/jueJin/4d598401e7b64e8.png)

*   下载完成后安装`Visual C++ 2019 Redistributable Package`，一直点击下一步即可；

![](/images/jueJin/80389d33df87407.png)

*   之后重新双击`MySQL Workbench`的安装包，一路点击下一步即可顺利安装了。

![](/images/jueJin/64c61a90824e4c1.png)

使用
--

> 接下来我们将通过基础的数据库管理功能，来体验下`MySQL Workbench`的使用。

### 建立新连接

双击打开`MySQL Workbench`，然后输入数据库连接信息即可建立新连接。

![](/images/jueJin/1b5d284be2e848d.png)

### 外观设置

由于默认的编辑器字体比较小，可以改大一些，通过`Edit->Preferences`选项来修改，不过这里只能通过输入字体名称和大小来改变，有点不太方便！

![](/images/jueJin/aad99e7041ec44e.png)

### 表管理

*   查看数据库表结构，通过右击表选择`Table Inspector`来查看；

![](/images/jueJin/8db7deeccaba42f.png)

*   修改数据库表结构，通过右击表选择`Alter Table`来修改。

![](/images/jueJin/9e1b2d2280e3435.png)

### 数据管理

*   查看表数据，通过右击表选择`Select Rows`来查看，我们可以发现在SQL编辑器中自动生成了SELECT语句；

![](/images/jueJin/69085c9d0de24bd.png)

*   修改表数据，我们需要双击需要修改的表字段，然后点击`Apply`来应用；

![](/images/jueJin/38ecfea406c844a.png)

*   我们可以发现最后工具中的修改被转化为了UPDATE语句，可见`MySQL Workbench`中的数据操作最终会转化为语句来执行。

![](/images/jueJin/b85c1cd33ed54aa.png)

### SQL操作

*   我们可以使用SQL编辑器来执行SQL语句，使用左上角的按钮可以创建一个SQL编辑器；

![](/images/jueJin/0903e5ce71ae48c.png)

*   `MySQL Workbench`的SQL提示还是挺全的，来写个SQL试试，基本能够满足平时编辑SQL的需求。

![](/images/jueJin/134a893dd561446.png)

### 实例管理

*   查看MySQL服务状态信息；

![](/images/jueJin/349db4a162c342f.png)

*   管理MySQL用户和权限；

![](/images/jueJin/8cec0d14c6044b8.png)

*   管理MySQL实例，实现启动和关闭；

![](/images/jueJin/f670dc5236bc4a8.png)

*   查看展示MySQL服务性能信息的仪表盘。

![](/images/jueJin/35913dd14a4f477.png)

对比Navicat
---------

*   Navicat中有个非常好用的数据库设计功能，为此我抛弃了笨重的PowerDesigner，很显然`MySQL Workbench`并不支持该功能。

![](/images/jueJin/40adafbab7074ea.png)

*   使用Navicat设计数据库，具体可以参考[《我用起来顺手的数据库设计工具，这次推荐给大家！》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FSJI0x7qQw5JkCvDWou7XaQ "https://mp.weixin.qq.com/s/SJI0x7qQw5JkCvDWou7XaQ")。
    
*   Navicat具有强大的数据备份和结构同步功能，平时用来数据备份，同步测试环境的数据库结构到生产环境很好用，如果使用`MySQL Workbench`估计就只能将SQL进行导入导出了。
    

![](/images/jueJin/850e870b44334ed.png)

*   使用Navicat实现数据备份和结构同步，具体可以参考[《Navicat实用功能：数据备份与结构同步》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FKm7lg-T0p9Kzb_WeyHVaqw "https://mp.weixin.qq.com/s/Km7lg-T0p9Kzb_WeyHVaqw")。
    
*   `MySQL Workbench`中特有的实例管理功能是Navicat所不具备的。
    
*   Navicat能支持MySQL、MariaDB、MongoDB、SQL Server、Oracle、PostgreSQL等多种数据库，很显然`MySQL Workbench`只能支持MySQL。
    

总结
--

总的来说，`MySQL Workbench`作为一款MySQL数据库管理工具显然足够了，但是Navicat的很多功能它是无法取代的。如果你想设计数据库，拥有更好的数据库运维功能，或者你需要使用多种不同的数据库，那还是使用Navicat吧！

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！