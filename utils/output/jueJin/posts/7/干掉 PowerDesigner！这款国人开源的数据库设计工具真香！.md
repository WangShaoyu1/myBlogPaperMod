---
author: "MacroZheng"
title: "干掉 PowerDesigner！这款国人开源的数据库设计工具真香！"
date: 2021-11-23
description: "当我们在项目开发初期时，往往需要设计大量的表，此时使用数据库设计工具就会比较高效！今天给大家推荐一款国人开源的数据库设计工具，界面漂亮，功能强大，希望对大家有所帮助！"
tags: ["Java","后端","MySQL中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:142,comments:0,collects:246,views:18052,"
---
> 当我们在项目开发初期时，往往需要设计大量的表，此时使用数据库设计工具就会比较高效！今天给大家推荐一款国人开源的数据库设计工具`chiner`，界面漂亮，功能强大，希望对大家有所帮助！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

聊聊PowerDesigner
---------------

之前`mall`项目就是使用PowerDesigner来设计数据库的，感觉这款工具界面有点古老，有时候用起来也比较重，来看下之前使用它设计数据库的效果。

![](/images/jueJin/e9014e2f7e19431.png)

最近体验了一把chiner，设计数据库确实很方便，界面也漂亮，让我们来看下使用它设计数据库的效果，果然是一款轻量级、现代化的数据库设计工具！

![](/images/jueJin/254ff1b05014459.png)

chiner简介
--------

chiner是一款支持多种数据库，独立于具体数据库之外的数据库关系模型设计工具，使用React+Electron+Java技术栈实现。

chiner的发展历程比较坎坷，项目作者都把它的发展历程放在的README最显眼的位置上，可见开发一款好用的开源工具有多么不容易！我们来看下它的发展历程。

![](/images/jueJin/364142e18a434a5.png)

安装
--

> chiner是一款跨平台的数据库设计工具，支持Windows、Mac、Linux，下面我们来安装下。

*   我们下载安装包时需要注意，使用右键，选择`链接另存为`进行下载，下载地址：[gitee.com/robergroup/…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Frobergroup%2Fchiner%2Freleases%2Fv3.5.5 "https://gitee.com/robergroup/chiner/releases/v3.5.5")

![](/images/jueJin/bd7aa2ed5255439.png)

*   下载完成后解压到指定目录，双击`exe`执行程序即可打开；

![](/images/jueJin/c8d25fbb1b5844c.png)

*   打开界面后，可以发现非常贴心地提供了`操作手册`和`参考模板`。

![](/images/jueJin/80a89cdc0f0f433.png)

基本使用
----

> 作为一款数据库设计工具，chiner的功能还是挺强大的，下面我们通过官方提供的电商参考模板，来体验下它的基本功能。

### 基本概念

*   由于chiner需要支持多种数据库，还要能生成实体类代码，所以就有了`数据类型`这个概念，用于映射chiner中的数据类型到各种数据库和代码中，比如我们来看下`字串`这个数据类型；

![](/images/jueJin/c4455b8d50594cb.png)

*   记得我们使用其他工具设计数据库时，设置字符经常需要设置长度、设置金额需要设置长度及小数位数，在chiner中只要设置好`数据域`，就能自动生成，我们来看下数据域；

![](/images/jueJin/c69a2c75c3814d8.png)

*   这里需要注意的是`数据域`需要绑定`数据类型`；

![](/images/jueJin/c31f8245c08248b.png)

*   对于一些字段的枚举类型，chiner也提供了数据字典功能，比如我们可以设置用户状态`0->冻结`，`1->正常`。

![](/images/jueJin/26b85e62165c435.png)

### 数据表管理

*   在设计数据库时，往往会有一些公用字段，比如`创建时间`、`创建人`、`更新时间`、`更新人`这类字段，使用chiner可以自动生成，点击`设置->新建表默认字段`即可；

![](/images/jueJin/be2c09ed39c14a0.png)

*   接下来我们新增一张测试表，就可以发现公共字段已经被全部添加了；

![](/images/jueJin/ad2377ce81354a7.png)

*   细心的朋友可以发现目前字段都是设置的`大写`，我们习惯了`小写`这么办，选中`字段代码`，点击`大小写`按钮即可一键转换；

![](/images/jueJin/e2e61aa468c4461.png)

*   在我们添加字段的时候，只要直接选择`数据域`，即可自动设置数据类型和长度，比如常用的主键、名称、字串等，非常方便；

![](/images/jueJin/8e77e4157e364ac.png)

*   当然我们也可以直接选择`数据字典`，选择完后也可以直接查看数据字典。

![](/images/jueJin/83fc7108697343e.png)

### 关系图管理

*   使用chiner创建关系图也是比较方便的，点击`新增关系图`然后选择连线对象为`字段`即可；

![](/images/jueJin/833c9692da5340d.png)

*   接下来把数据库表拖拽到关系图中即可；

![](/images/jueJin/be02a85739884a7.png)

*   连接有关系的字段即可创建连线，右键连线可以编辑关系；

![](/images/jueJin/7ab9dbb4441a4a2.png)

*   来张完整的关系图看看，效果还是不错的，操作也很方便；

![](/images/jueJin/4ec0a70a4e0e422.png)

*   之前使用PowerDesigner是可以直接使用外键来生成关系图的，而chiner是不支持的，不过在阿里巴巴Java开发手册中提过`不得使用外键`，既然不使用外键了，把关系从数据库抽离到设计工具里面去，也是可以理解的。

![](/images/jueJin/ebf5ec5c62e3404.png)

导入导出使用
------

> chiner还支持数据库逆向解析、导入PowerDesigner文件、导出DDL脚本及Word文档，下面我们来体验下。

*   从数据库导入前，我们需要先配置好数据库连接信息；

![](/images/jueJin/de514d34d72146c.png)

*   然后选择从数据库导入；

![](/images/jueJin/46ff4dd63ffb4bd.png)

*   之后选择好需要导入的表即可；

![](/images/jueJin/14ba074009f1447.png)

*   当然chiner也是支持从PowerDesigner文件导入的；

![](/images/jueJin/b7cc8d58d383462.png)

*   当我们设计好数据库之后，就可以使用chiner的导出DDL功能，来将表同步到数据库中了；

![](/images/jueJin/a3789e112a874f4.png)

*   有时候可能需要数据库说明文档，直接使用chiner的导出Word文档功能即可，无需手写。

![](/images/jueJin/4bdc808aa5fd4d2.png)

总结
--

chiner确实是一款界面美观、功能强大的数据库设计工具。比起PowerDesigner来，更加轻量级、界面也高大上的多。感觉唯一不足的地方就是不能通过外键生成关系图，对于一些使用外键的项目就比较麻烦了。

参考资料
----

*   项目地址：[gitee.com/robergroup/…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Frobergroup%2Fchiner "https://gitee.com/robergroup/chiner")
*   使用手册：[www.yuque.com/chiner/docs…](https://link.juejin.cn?target=https%3A%2F%2Fwww.yuque.com%2Fchiner%2Fdocs%2Fmanual "https://www.yuque.com/chiner/docs/manual")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！