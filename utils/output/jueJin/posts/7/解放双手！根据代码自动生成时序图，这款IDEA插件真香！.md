---
author: "MacroZheng"
title: "解放双手！根据代码自动生成时序图，这款IDEA插件真香！"
date: 2022-08-23
description: "在我们平时看代码的时候，往往会遇到一些流程比较复杂的方法，此时画个时序图有助于我们理解方法的执行过程。今天给大家推荐一款IDEA插件，能直接根据方法生成时序图，极大提高效率！"
tags: ["Java","后端","IntelliJ IDEA中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:0,comments:0,collects:0,views:12311,"
---
> 在我们平时看代码的时候，往往会遇到一些流程比较复杂的方法，此时画个时序图有助于我们理解方法的执行过程。不过这些方法执行过程往往比较长，手绘时序图实在太麻烦了！今天给大家推荐一款IDEA插件，能直接根据方法生成时序图，极大提高效率！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

SequenceDiagram简介
-----------------

SequenceDiagram是一款能根据代码生成时序图的插件，它的功能十分强大，主要特性如下：

*   能直接根据代码生成时序图；
*   可以从时序图上直接导航到对应代码；
*   可以直接在时序图上编辑类和方法；
*   可以将时序图导出为图片或者PlantUML文件。

使用
--

> 下面我们来聊聊`SequenceDiagram`插件的使用，通过它来绘制一张mall项目的登录流程图。

*   首先我们需要在IDEA的插件市场中安装`SequenceDiagram`插件；

![](/images/jueJin/5d79149f7fe0412.png)

*   然后找个方法试试，这里以我的[mall项目](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")中的登录方法为例，右键方法选择生成时序图；

![](/images/jueJin/26d0088530c24e6.png)

*   此时在底部的时序图面板中可以看到生成的时序图，这里简单介绍下左侧几个按钮的用法；

![](/images/jueJin/680da3a3f103456.png)

*   点击设置按钮，我们可以进行生成层级、只显示项目中的类、跳过Getter/Setter及跳过构造函数的设置；

![](/images/jueJin/a290a9275ca6450.png)

*   在时序图中我们任选一个类或者方法，可以直接跳转到源码；

![](/images/jueJin/9b59bab53b2f4ac.png)

*   直接生成的时序图有些类和方法比较多余，我们可以使用删除节点的操作来编辑下；

![](/images/jueJin/0155bfda79c9429.png)

*   经过一番精简之后，一张流程清晰的时序图就制作好了，是不是很简单！

![](/images/jueJin/c1cedc09a5e6492.png)

*   我们可以导出为图片，目前只支持`svg`格式；

![](/images/jueJin/53aae24d0d5f4bc.png)

*   也可以导出为PlantUML文件，之前介绍过一个[非常好用的PlantUML插件](https://juejin.cn/post/7017988314053492767 "https://juejin.cn/post/7017988314053492767") ，使用它就可以对PlantUML文件进行预览和编辑了；

![](/images/jueJin/5cc41e335dd74dc.png)

*   安装成功后打开PlantUML文件进行预览，效果还是挺不错的；

![](/images/jueJin/99c0d32dabb6424.png)

*   自动生成的注释全是方法名称，如果我们想要改成有意义的中文注释，可以使用PlantUML插件进行修改，修改完成后效果如下。

![](/images/jueJin/76d5857773254db.png)

总结
--

绘制时序图，确实有助于我们对复杂方法执行流程的理解，不过手绘实在太麻烦了。我们可以通过`SequenceDiagram`来生成最初的时序图，然后去除一些无用的类和方法，再通过PlantUML插件进行修改，这样就可以快速得到一份满意的时序图了，大家感兴趣的不妨尝试下！

参考资料
----

官方网站：[github.com/Vanco/Seque…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FVanco%2FSequencePlugin "https://github.com/Vanco/SequencePlugin")