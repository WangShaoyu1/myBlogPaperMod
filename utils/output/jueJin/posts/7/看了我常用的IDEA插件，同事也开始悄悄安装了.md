---
author: "MacroZheng"
title: "看了我常用的IDEA插件，同事也开始悄悄安装了"
date: 2022-09-06
description: "IDEA是程序员用的最多的开发工具，很多程序员想把它打造成一站式开发工具，于是安装了各种各样的插件。今天给大家分享下我平时常用的IDEA插件，个个是精品！"
tags: ["Java","后端","IntelliJ IDEA中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:706,comments:0,collects:2000,views:64291,"
---
> IDEA是程序员用的最多的开发工具，很多程序员想把它打造成一站式开发工具，于是安装了各种各样的插件。通过插件在IDEA中完成各种操作，无需安装其他软件，确实很方便！今天给大家分享下我平时常用的IDEA插件，个个是精品！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

Key Promoter X
--------------

> Key Promoter X 是一款帮助你快速学习IDEA快捷键的插件，当你在IDEA中用鼠标点击某些功能时，它会自动提示你使用该功能的快捷键。它能让你更轻松地摆脱使用鼠标功能，从而只使用键盘来开发，这大概是刚开始使用IDEA的程序员最需要的插件了。

![](/images/jueJin/6655cd614683409.png)

当我们使用鼠标完成某些工作时，Key Promoter X会提示对应的快捷键，方便我们更快地掌握IDEA的快捷键。

![](/images/jueJin/e63e42285b7f4b4.png)

Lombok
------

> Lombok目前已经是开发Java应用的标配了，不仅SpringBoot默认支持它，连IDEA也内置了Lombok插件，无需安装即可使用。Lombok是一款Java代码功能增强库，通过Lombok的注解，你可以不用再写getter、setter、equals等方法，Lombok将在编译时为你自动生成。

![](/images/jueJin/4d309bd1d5624ed.png)

举个例子，当我们给一个类添加@Getter和@Setter注解后；

```java
/**
* 修改订单费用信息参数
* Created by macro on 2018/10/29.
*/
@Getter
@Setter
    public class OmsMoneyInfoParam {
    @ApiModelProperty("订单ID")
    private Long orderId;
    @ApiModelProperty("运费金额")
    private BigDecimal freightAmount;
    @ApiModelProperty("管理员后台调整订单所使用的折扣金额")
    private BigDecimal discountAmount;
    @ApiModelProperty("订单状态：0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订单")
    private Integer status;
}
```

Lombok就会为我们自动生成所有属性的Getter和Setter方法，无需我们再手写，具体使用可以参考[Lombok的使用](https://juejin.cn/post/6911476307528253453 "https://juejin.cn/post/6911476307528253453") 。

![](/images/jueJin/204b8f5ecdcf424.png)

MyBatisX
--------

> MybatisX是一款基于IDEA的快速开发插件，由MyBatis-Plus团队开发维护，提示很全功能也很强大。支持xml和Mapper接口之间的跳转，自带图形化的代码生成器，可以通过类似JPA的方式，直接根据方法名称生成SQL实现。

![](/images/jueJin/63da2bc0a007473.png)

我们点击Mapper接口方法左侧的图标可以直接跳转到xml中对应的SQL实现，在xml点击左侧图标也可以直接跳转到Mapper接口中对应的方法。

![](/images/jueJin/c3504e44d86f4f9.png)

当我们创建符合JPA规范的方法时，能直接生成SQL实现无需手写，MyBatisX的功能很强大，详细使用可以参考[MybatisX插件的使用](https://juejin.cn/post/7137856634075742244 "https://juejin.cn/post/7137856634075742244") 。

![](/images/jueJin/799667ba9ba64dc.png)

RestfulFastRequest
------------------

> RestfulFastRequest号称是IDEA版本的Postman，它是一个功能强大的Restful API工具包插件，可以根据已有的方法快速生成接口调试用例。它有一个漂亮的界面来完成请求、检查服务器响应、存储你的API请求和导出API请求，该插件能帮助你在IDEA内更快更高效地调试API！

![](/images/jueJin/43adfcc32a9c4b4.png)

下面是使用RestfulFastRequest调试API接口的一张效果图，用起来还是非常方便的，具体使用可以参考[RestfulFastRequest插件的使用](https://juejin.cn/post/7098511464708702239 "https://juejin.cn/post/7098511464708702239") 。

![](/images/jueJin/d6796caa683742e.png)

PlantUML
--------

> PlantUML是一款开源的UML图绘制工具，支持通过文本来生成图形，使用起来非常高效。可以支持时序图、类图、对象图、活动图、思维导图等图形的绘制。

![](/images/jueJin/982e24eeed6f4d6.png)

下面使用PlantUML来绘制一张流程图，可以实时预览，速度也很快，具体使用可以参考[PlantUML插件的使用](https://juejin.cn/post/7017988314053492767 "https://juejin.cn/post/7017988314053492767") 。

![](/images/jueJin/0367fa769127448.png)

SequenceDiagram
---------------

> SequenceDiagram是一款能根据代码生成时序图的插件，还支持在时序图上直接导航到对应代码以及导出为图片或PlantUML文件。

![](/images/jueJin/43f874943e9049d.png)

下面是一张使用SequenceDiagram制作的时序图，还是非常不错的，具体使用可以参考[SequenceDiagram插件的使用](https://juejin.cn/post/7134877521182457869 "https://juejin.cn/post/7134877521182457869") 。

![](/images/jueJin/e7f607089a224bf.png)

GsonFormatPlus
--------------

> 一款能根据JSON字符串自动生成实体类的插件，支持Lombok。

![](/images/jueJin/6f40143654a345f.png)

选择类名，右键生成，输入JSON字符串即可快速生成对应实体类。

![](/images/jueJin/53c958376822448.png)

Json Parser
-----------

> 一款简单小巧的JSON格式化插件，还在使用在线工具格式化JSON？试试这款IDEA插件吧！

![](/images/jueJin/0ab933016db34a2.png)

直接打开右侧面板，输入JSON字符串即可快速格式化，支持折叠显示。

![](/images/jueJin/924c46a185e248b.png)

String Manipulation
-------------------

> 一款专业处理字符串的插件，支持各种格式代码命名方式的切换、支持各种语言的转义和反转义、支持字符加密、支持多个字符的排序、对齐、过滤等。总之功能很强大，有需要字符串操作时，可以试试它。

![](/images/jueJin/9cb4b3e5c0ef429.png)

选中需要处理的字符串，右键打开菜单即可开始使用。

![](/images/jueJin/81d84735c91a464.png)

MapStruct support
-----------------

> MapStruct是一款基于Java注解的对象属性映射工具，使用的时候我们只要在接口中定义好对象属性映射规则，它就能自动生成映射实现类，不使用反射，性能优秀。

![](/images/jueJin/cd1c75447577403.png)

当我们使用它的IDEA插件时，他能自动提示映射对象所包含的属性，并且在点击属性时能跳转到对应属性，具体使用可以参考[MapStruct的使用](https://juejin.cn/post/7026151729997561869 "https://juejin.cn/post/7026151729997561869") 。

![](/images/jueJin/5dad28dec6324f5.png)

Alibaba Java Coding Guidelines
------------------------------

> 阿里巴巴《Java 开发手册》配套插件，可以实时检测代码中不符合手册规约的地方，助你码出高效，码出质量。

![](/images/jueJin/bc8fa40d12d4429.png)

比如说手册里有这么一条：

![](/images/jueJin/55a9cfba6e8e42f.png)

当我们违反手册规约时，该插件会自动检测并进行提示。

![](/images/jueJin/17e4cd216e6b4b7.png)

同时提供了一键检测所有代码规约情况和切换语言的功能。

![](/images/jueJin/ec6f408f77b1427.png)

如果你想修改某条规约的检测规则的话，可以通过设置的`Editor->Inspections`进行修改。

![](/images/jueJin/80bc58282f1f4e3.png)

Alibaba Cloud Toolkit
---------------------

> CloudToolkit是阿里出品的一款IDEA插件，通过它我们可以更方便地实现自动化部署，其内置的终端工具和文件上传功能，即使用来管理服务器也非常方便！这款IDEA插件不仅功能强大，而且完全免费！

![](/images/jueJin/607cff4842ee4a5.png)

配置好服务器后，通过它可以一件打包上传到服务器，然后自动执行指定的脚本。

![](/images/jueJin/c18f37f3022946a.png)

其内置了一个终端工具，提示还挺全的，如果你想在IDEA里管理Linux服务器，不妨可以试试，具体使用可以参考[CloudToolkit插件的使用](https://juejin.cn/post/7114097885267886116 "https://juejin.cn/post/7114097885267886116") 。

![](/images/jueJin/168d3de379554df.png)

arthas idea
-----------

> 基于IDEA开发的Arthas命令生成插件，支持Arthas官方常用的命令，比如 watch、trace、ognl static、ognl bean method、field、monitor、stack 、tt等命令。

![](/images/jueJin/c848d877450b4cf.png)

直接打开右键菜单，选择Arthas命令即可快速生成命令，具体使用可以参考[Arthas使用教程](https://juejin.cn/post/7103706246586302495 "https://juejin.cn/post/7103706246586302495") 。

![](/images/jueJin/9dd6ce015bae4fb.png)

Docker
------

> IDEA官方提供的Docker插件，已内置，支持远程Docker环境的镜像和容器管理，同时支持使用Docker Compose实现批量部署。

![](/images/jueJin/6005a3bcdbba463.png)

通过它能自动打包应用的镜像，jar包会直接上传到远程服务器并打包成镜像，具体使用可以参考[IDEA官方Docker插件的使用](https://juejin.cn/post/7111500936547139614 "https://juejin.cn/post/7111500936547139614") 。

![](/images/jueJin/22529e9f4c64408.png)

Maven Helper
------------

> 解决Maven依赖冲突的好帮手，可以快速查找项目中的依赖冲突，并予以解决！

![](/images/jueJin/23181d17c27d4fc.png)

我们可以通过`pom.xml`文件底部的`依赖分析`标签页查看当前项目中的所有依赖。

![](/images/jueJin/573e13ebf1ce4b2.png)

通过`冲突`按钮我们可以筛选出所有冲突的依赖，当前项目`guava`依赖有冲突，目前使用的是`18.0`版本。

![](/images/jueJin/f4a9cc07bc684c3.png)

选中有冲突的依赖，点击`Exclude`按钮可以直接排除该依赖。

![](/images/jueJin/7c554927b837416.png)

同时`pom.xml`中也会对该依赖添加`<exclusion>`标签，是不是很方便啊！

![](/images/jueJin/6e08df5f319d4d4.png)

Grep Console
------------

> 一款帮你分析控制台日志的插件，可以对不同级别的日志进行不同颜色的高亮显示，还可以用来按关键字搜索日志内容。

![](/images/jueJin/e6966a0ed03f49f.png)

当项目打印日志的时候，可以发现不同日志级别的日志会以不同颜色来显示。

![](/images/jueJin/db8d57350491416.png)

如果你需要修改配色方案的话，可以通过`Tools`打开该插件的配置菜单。

![](/images/jueJin/230355a64d2f457.png)

然后通过配置菜单修改配色方案。

![](/images/jueJin/aa80401de02d406.png)

可以通过在控制台右键并使用`Grep`按钮来调出日志分析的窗口。

![](/images/jueJin/1850a891c02a4d7.png)

然后直接通过关键字来搜索即可。

![](/images/jueJin/a924b44f07ab45c.png)

Markdown
--------

> IDEA官方出品的一款Markdown插件，支持编辑Markdown文件并进行预览，对于习惯了使用IDEA的小伙伴还是非常方便的。

![](/images/jueJin/e112ca5dbcdc4a2.png)

使用它来编辑Markdown文件最方便的地方在于，可以直接使用IDEA提供的各种快捷键，无需适应一套新的快捷键。

![](/images/jueJin/be76d31b75664b0.png)

Translation
-----------

> 一款翻译插件，支持Google、有道、阿里、百度翻译，对我们看源码时翻译注释很有帮助！

![](/images/jueJin/4cc82747801f423.png)

直接选中需要翻译的内容，点击右键即可找到翻译按钮；

![](/images/jueJin/73a589e4671440b.png)

直接使用`翻译文档`可以将整个文档都进行翻译；

![](/images/jueJin/a2a312099d77458.png)

还可以通过右上角的翻译按钮直接翻译指定内容。

![](/images/jueJin/9d26c1b2efb2408.png)

Statistic
---------

> 一款代码统计工具，可以用来统计当前项目中代码的行数和大小。

![](/images/jueJin/f3486d0b03764b4.png)

我们可以通过顶部菜单中的`View->Tool Windows->Statistic`按钮开启该功能。

![](/images/jueJin/6182fd97839946e.png)

此时就可以看到我们项目代码的统计情况了，比如我的开源项目`mall`中`java`代码大小为`2818kB`，行数为`85645`。

![](/images/jueJin/e1abfc4a64304a8.png)

Vue.js
------

> Vue.js支持插件，写过前端的朋友肯定用过，可以根据模板创建`.vue`文件，也可以对Vue相关代码进行智能提示。

![](/images/jueJin/0242dbab0633484.png)

启用该插件后，可以根据模板新建`.vue`文件。

![](/images/jueJin/08ef0c7bdb384dc.png)

当我们在标签中写入以`v-`开头的代码时，会提示Vue中的相关指令。

![](/images/jueJin/654329f8c019461.png)

总结
--

以上是我常用的20款IDEA插件，涵盖了大部分应用场景，平时开发的时候基本上也够用了。不过IDEA插件虽然能增强它的功能，给我们提供一站式的开发体验，但是也不要安装过多，太多了容易卡！