---
author: "MacroZheng"
title: "取代 Postman + Swagger！这款神器功能更强，界面更炫酷！"
date: 2021-11-30
description: "作为一位后端开发，我们平时经常需要维护API文档、对API接口进行调试、有时候还得Mock数据。今天给大家推荐一款功能更强大的工具，足以满足我们对API的各种需求，希望对大家有所帮助！"
tags: ["后端","Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:175,comments:38,collects:262,views:26726,"
---
> 作为一位后端开发，我们平时经常需要维护API文档、对API接口进行调试、有时候还得Mock数据。Postman虽然作为接口调试工具非常好用，但是对于维护API文档这类工作却不太合适。今天给大家推荐一款功能更强大的工具Apifox，足以满足我们对API的各种需求，希望对大家有所帮助！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

Apifox简介
--------

Apifox 的定位是`Postman + Swagger + Mock + JMeter`，具有API文档管理、API调试、API Mock、API 自动化测试等功能。可以通过一种工具解决之前使用多种工具的数据同步问题。高效、及时、准确！

安装
--

*   Apifox的安装非常方便，直接下载安装包解压安装即可，下载地址：[www.apifox.cn/](https://link.juejin.cn?target=https%3A%2F%2Fwww.apifox.cn%2F "https://www.apifox.cn/")

![](/images/jueJin/7f5da17eec1944e.png)

*   官方非常贴心地提供了`示例项目`，直接打开即可体验Apifox的功能，看下界面还是很漂亮的；

![](/images/jueJin/9cb6b0ed7d7f452.png)

*   我们自己使用的话首先需要`新建团队`，便于团队成员之间协同工作；

![](/images/jueJin/db00c949043c4e0.png)

*   然后在团队中`新建项目`，新建成功后我们就可以开始使用Apifox的强大功能了！

![](/images/jueJin/4c04aa5a942b424.png)

API文档导入
-------

> Apifox的API文档导入功能非常强大，支持包括Swagger、Postman、YApi、ShowDoc等多达20种工具的导入。接下来我们通过使用之前`mall-tiny-swagger`项目中的接口，来体验下它的导入功能！

*   首先我们选择`新建接口`按钮，选择`导入`；

![](/images/jueJin/589363f8c25d43e.png)

*   然后打开导入界面，选择`Swagger->URL导入`，输入Swagger的数据URL；

![](/images/jueJin/3e2ecaad74234c8.png)

*   导入时将显示`导入预览`，显示要导入的`接口`和`数据模型`，Apifox将会把我们接口返回的实体类转换为数据模型，以便进行复用；

![](/images/jueJin/6b8c504dfef44c7.png)

*   导入成功后界面效果如下，Apifox将查看文档和修改文档做了区分，方便我们管理接口文档。

![](/images/jueJin/1306d12c5eb24ed.png)

接口管理
----

> 虽然从Swagger中导入的接口文档已经很详细了，但是为了体验Apifox更为强大的功能，我们有时候还是需要编辑下接口信息的。

### 接口设计

*   看下Apifox的请求参数界面，非常详细！

![](/images/jueJin/287670f00a2a4fa.png)

*   再看下Apifox返回结果界面，支持折叠，这个很多工具都是没有的；

![](/images/jueJin/a5747f8199194cf.png)

*   再看下Apifox的`修改文档`界面，支持添加状态、分组和标签。

![](/images/jueJin/be06416fa4f34dd.png)

### 接口调试

> 我们再来体验下Apifox的调试功能，比Postman更强大！

*   在我们开发接口时，很多时候需要分不同的环境，Apifox默认给我们分了`测试环境`、`正式环境`、`Mock服务`，这三个基本也够用了；

![](/images/jueJin/92cf7dbbeaf640b.png)

*   在调试接口之前，我们得先设置好环境所对应的`前置URL`，比如这里我们设置了`测试环境`的；

![](/images/jueJin/b8a53f1797d3436.png)

*   在Apifox中我们可以使用`接口用例`来调试我们的接口，接口用例可以保存我们输入的参数，以便之后测试使用；

![](/images/jueJin/f4055331661c4f4.png)

*   Apifox支持在接口调用前后做自定义操作，比如我们可以在`后置操作`中添加一个`断言`，返回结果中`code等于200`表示操作成功；

![](/images/jueJin/b96903001cce407.png)

*   此时我们输错密码来调用下接口，断言会直接提示我们结果和预期不符合；

![](/images/jueJin/89c38e5582aa415.png)

*   有些接口我们需要传入`Authorization`头才能访问；

![](/images/jueJin/9101d012a92a453.png)

*   这种访问我们可以通过`环境变量`来实现，首先在登录接口中添加`后置操作`，选择`提取变量`，将返回的token提取到环境变量`AUTH_TOKEN`中；

![](/images/jueJin/e00456000da4432.png)

*   然后修改接口文档，在`Header`中设置需要传入`Authorization`头；

![](/images/jueJin/b4669d05e1af436.png)

*   接下来在`接口用例`中通过表达式使用`Authorization`头即可正常访问需要登录认证的接口了。

![](/images/jueJin/4a4730667eed454.png)

使用脚本
----

> Apifox的自定义`前置操作`和`后置操作`非常强大，不仅支持简单的`断言`和`提取变量`，还能支持编写JS脚本。

*   例如之前我们判断操作成功，断言`code等于200`可以使用脚本这样实现；

![](/images/jueJin/e5bdfd034be644e.png)

*   此时我们输错密码来调用下接口，断言会直接提示我们结果和预期不符合。

![](/images/jueJin/34c991804f9e491.png)

Mock数据
------

> 在我们后端接口没有开发完成，前端开发需要数据时，往往可以通过Mock来提供数据，Apifox的Mock数据功能也是很强大的。

*   Apifox号称能根据你数据模型中的字段名称`智能Mock`，让我们来看看它的规则；

![](/images/jueJin/dfba10bc270a44b.png)

*   其实默认的Mock规则有时候并不是很完善，比如我们来看下它Mock的数据；

![](/images/jueJin/65b4e80a082f4e4.png)

*   此时我们可以在`数据模型`中修改，可以让Mock的数据更加人性化一点，比如我们可以将各种状态设置为枚举类型；

![](/images/jueJin/cee2be40daef4ed.png)

*   还可以将logo字段通过`@image`这种方式设置为图片类型；

![](/images/jueJin/d7fab1d128f340f.png)

*   重新设置一下之后，人性化多了；

![](/images/jueJin/153bfa20d1a9430.png)

*   接下来只需把环境改为`Mock服务`就可以调用Mock数据的接口了！

![](/images/jueJin/029d7ac1945442a.png)

测试管理
----

> Apifox不仅能支持接口调试，还支持创建测试用例进行批量测试以及性能测试。

*   首先我们可以在`测试管理`中创建测试用例；

![](/images/jueJin/d511cd32f7b3451.png)

*   之后选择`从接口用例导入`，选择好需要导入的接口用例；

![](/images/jueJin/c43a745ecb494a6.png)

*   选择好`运行环境`后，点击运行进行批量测试；

![](/images/jueJin/aa93c0092eb649c.png)

*   测试完成后即可显示测试报告；

![](/images/jueJin/612c49e2489a44f.png)

*   如果你想进行性能测试的话，在测试界面选择好`线程数`即可；

![](/images/jueJin/e7b3b48ce4e64d6.png)

*   测试完成后，可以通过`导出报告`来查看更为详细的报告信息。

![](/images/jueJin/ffe70077958d4c0.png)

主题设置
----

个人比较习惯`暗色`主题，Apifox也是可以选择`亮色`主题和主色的，直接在设置中可以进行切换。

![](/images/jueJin/49506b218d054ad.png)

总结
--

Apifox确实是一款界面漂亮、功能强大的API接口工具。Postman有的接口调试功能它基本都有，还集成了接口文档管理、数据Mock、自动化测试等功能，强烈建议大家尝试下！

参考资料
----

官方文档：[www.apifox.cn/help/](https://link.juejin.cn?target=https%3A%2F%2Fwww.apifox.cn%2Fhelp%2F "https://www.apifox.cn/help/")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-swagger "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-swagger")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！