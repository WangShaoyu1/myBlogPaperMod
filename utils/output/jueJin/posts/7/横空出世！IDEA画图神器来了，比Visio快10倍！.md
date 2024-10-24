---
author: "MacroZheng"
title: "横空出世！IDEA画图神器来了，比Visio快10倍！"
date: 2021-10-12
description: "程序员在工作中，经常会有绘制时序图、流程图的需求，尤其是在写文档的时候。今天给大家推荐一款UML画图工具，可以配合IDEA使用，画图更高效！"
tags: ["Java","后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:236,comments:25,collects:389,views:24811,"
---
> 程序员在工作中，经常会有绘制时序图、流程图的需求，尤其是在写文档的时候。平时我们会选择ProcessOn这类工具来绘制，但有时候用代码来画图可能会更高效一点，毕竟没有比程序员更熟悉代码的了。今天给大家推荐一款画图工具PlantUML，可以配合IDEA使用，画图更高效！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

PlantUML简介
----------

PlantUML是一款开源的UML图绘制工具，支持通过文本来生成图形，使用起来非常高效。可以支持时序图、类图、对象图、活动图、思维导图等图形的绘制。

下面使用PlantUML来绘制一张流程图，可以实时预览，速度也很快！

![](/images/jueJin/be44e813be5d458.png)

安装
--

> 通过在IDEA中安装插件来使用PlantUML无疑是最方便的，接下来我们来安装下IDEA的PlantUML插件。

*   首先在IDEA的插件市场中搜索`PlantUML`，安装这个排名第一的插件；

![](/images/jueJin/71f94b51e9854c0.png)

*   有时候网络不好的话可能下载不下来，可以点击`Plguin homepage`按钮访问插件主页，然后选择合适的版本下载压缩包；

![](/images/jueJin/620b0e69c0984de.png)

*   下载成功后，选择从本地安装即可。

![](/images/jueJin/541e2e415b724ea.png)

使用
--

> 接下来我们使用PlantUML插件分别绘制时序图、用例图、类图、活动图、思维导图，来体验下PlantUML是不是真的好用！

### 时序图

> 时序图（Sequence Diagram），是一种UML交互图。它通过描述对象之间发送消息的时间顺序显示多个对象之间的动态协作。我们在学习Oauth2的时候，第一步就是要搞懂Oauth2的流程，这时候有个时序图帮助可就大了。下面我们使用PlantUML来绘制Oauth2中使用授权码模式颁发令牌的时序图。

*   首先我们需要新建一个PlantUML文件，选择时序图；

![](/images/jueJin/f263d1366d8b45f.png)

*   我们可以通过PlantUML提供的语法来生成Oauth2的时序图，语法还是非常简单的，具体内容如下；

```puml
@startuml
title Oauth2令牌颁发之授权码模式

actor User as user
participant "User Agent" as userAgent
participant "Client" as client
participant "Auth Login" as login
participant "Auth Server" as server

autonumber
user->userAgent:访问客户端
activate userAgent
userAgent->login:重定向到授权页面+clientId+redirectUrl
activate login
login->server:用户名+密码+clientId+redirectUrl
activate server
server-->login:返回授权码
login-->userAgent:重定向到redirectUrl+授权码code
deactivate login
userAgent->client:使用授权码code换取令牌
activate client
client->server:授权码code+clientId+clientSecret
server-->client:颁发访问令牌accessToken+refreshToken
deactivate server
client-->userAgent:返回访问和刷新令牌
deactivate client
userAgent--> user:令牌颁发完成
deactivate userAgent
@enduml
```

*   该代码将生成如下时序图，用写代码的方式来画时序图，是不是够炫酷；

![](/images/jueJin/bf65595e354b41e.png)

*   本时序图关键说明如下：
    *   `title`可以用于指定UML图的标题；
    *   通过`actor`可以声明人形的参与者；
    *   通过`participant`可以声明普通类型的参与者；
    *   通过`as`可以给参与者取别名；
    *   通过`->`可以绘制参与者之间的关系，虚线箭头可以使用`-->`；
    *   在每个参与者关系后面，可以使用`:`给关系添加说明；
    *   通过`autonumber`我们可以给参与者关系自动添加序号；
    *   通过`activate`和`deactivate`可以指定参与者的生命线。
*   这里还有个比较神奇的功能，当我们右键时序图时，可以生成一个在线访问的链接；

![](/images/jueJin/57b8b21a3185413.png)

*   直接访问这个链接，可以在线访问UML时序图，并进行编辑，是不是很酷！

![](/images/jueJin/5dca21dcda45494.png)

### 用例图

> 用例图（Usecase Diagram）是用户与系统交互的最简表示形式，展现了用户和与他相关的用例之间的关系。通过用例图，我们可以很方便地表示出系统中各个角色与用例之间的关系，下面我们用PlantUML来画个用例图。

*   首先我们需要新建一个PlantUML文件，选择用例图，该用例图用于表示顾客、主厨、美食家与餐馆中各个用例之间的关系，具体内容如下；

```puml
@startuml
left to right direction
actor Guest as g
    package Professional {
    actor Chief as c
    actor "Food Critic" as fc
}
    package Restaurant {
    usecase "Eat Food" as uc1
    usecase "Pay For Food" as uc2
    usecase "Drink" as uc3
    usecase "Review" as uc4
}
g--> uc1
g--> uc2
g--> uc3
fc--> uc4
@enduml
```

*   该代码将生成如下用例图；

![](/images/jueJin/ea7365b36238424.png)

*   本用例图关键说明如下：
    *   `left to right direction`表示按从左到右的顺序绘制用例图，默认是从上到下；
    *   通过`package`可以对角色和用例进行分组；
    *   通过`actor`可以定义用户；
    *   通过`usecase`可以定义用例；
    *   角色和用例之间的关系可以使用`-->`来表示。

### 类图

> 类图（Class Diagram）可以表示类的静态结构，比如类中包含的属性和方法，还有类的继承结构。下面我们用PlantUML来画个类图。

*   首先我们需要新建一个PlantUML文件，选择类图，该图用于表示Person、Student、Teacher类的结构，具体内容如下；

```puml
@startuml
    class Person {
    # String name
    # Integer age
    + void move()
    + void say()
}
    class Student {
    - String studentNo
    + void study()
}
    class Teacher {
    - String teacherNo
    + void teach()
}
Person <|-- Student
Person <|-- Teacher
@enduml
```

*   该代码将生成如下类图，看下代码和类图，是不是发现和我们用代码定义类还挺像的；

![](/images/jueJin/f473f366070743c.png)

*   本类图关键说明如下：
    *   通过`class`可以定义类；
    *   通过在属性和方法左边加符号可以定义可见性，`-`表示`private`，`#`表示`protected`，`+`表示`public`；
    *   通过`<|--`表示类之间的继承关系。

### 活动图

> 活动图（Activity Diagram）是我们用的比较多的UML图，经常用于表示业务流程，比如电商中的下单流程就可以用它来表示。下面我们用PlantUML来画个活动图。

*   首先我们需要新建一个PlantUML文件，选择活动图，这里使用了mall项目中购物车中生成确认单的流程，具体内容如下；

```puml
@startuml
title 生成确认单流程
start
:获取购物车信息并计算好优惠;
:从ums_member_receive_address表中\n获取会员收货地址列表;
:获取该会员所有优惠券信息;
switch(根据use_type判断每个优惠券是否可用)
case(0)
:全场通用;
if (判断所有商品总金额是否\n满足使用起点金额) then (否)
:得到用户不可用优惠券列表;
stop
endif
case(-1)
:指定分类;
if (判断指定分类商品总金额\n是否满足使用起点金额) then (否)
:得到用户不可用优惠券列表;
stop
endif
case(-2)
:判断指定商品总金额是否满足使用起点金额;
if (判断指定分类商品总金额\n是否满足使用起点金额) then (否)
:得到用户不可用优惠券列表;
stop
endif
endswitch
:得到用户可用优惠券列表;
:获取用户积分;
:获取积分使用规则;
:计算总金额，活动优惠，应付金额;
stop
@enduml
```

*   该代码将生成如下活动图，在活动图中我们既可以用`if else`，又可以使用`switch`，甚至还可以使用`while循环`，功能还是挺强大的；

![](/images/jueJin/7a9b6ec5ba9c439.png)

*   本活动图关键说明如下：
    *   通过`start`和`stop`可以表示流程的开始和结束；
    *   通过`:`和`;`中间添加文字来定义活动流程节点；
    *   通过`if`+`then`+`endif`定义条件判断；
    *   通过`switch`+`case`+`endswitch`定义switch判断。

### 思维导图

> 思维导图（Mind Map），是表达发散性思维的有效图形工具，它简单却又很有效，是一种实用性的思维工具。之前在我的mall学习教程中就有很多地方用到了，下面我们用PlantUML来画个思维导图。

*   首先我们需要新建一个PlantUML文件，选择思维导图，这里使用了mall学习路线中的大纲视图，具体内容如下；

```puml
@startmindmap
+[#17ADF1] mall学习路线
++[#lightgreen] 推荐资料
++[#lightblue] 后端技术栈
+++_ 项目框架
+++_ 数据存储
+++_ 运维部署
+++_ 其他
++[#orange] 搭建项目骨架
++[#1DBAAF] 项目部署
+++_ Windows下的部署
+++_ Linux下使用Docker部署
+++_ Linux下使用Docker Compose部署
+++_ Linux下使用Jenkins自动化部署
--[#1DBAAF] 电商业务
---_ 权限管理模块
---_ 商品模块
---_ 订单模块
---_ 营销模块
--[#orange] 技术要点
--[#lightblue] 前端技术栈
--[#lightgreen] 进阶微服务
---_ Spring Cloud技术栈
---_ 项目部署
---_ 技术要点
--[#yellow] 开发工具
--[#lightgrey] 扩展学习
@endmindmap
```

*   该代码将生成如下思维导图，其实使用PlantUML我们可以自己定义图形的样式，这里我自定义了下颜色；

![](/images/jueJin/2010f7e5989a42a.png)

*   本思维导图关键说明如下：
    *   通过`+`和`-`可以表示思维导图中的节点，具有方向性；
    *   通过`[#颜色]`可以定义节点的边框颜色；
    *   通过`_`可以去除节点的边框；

总结
--

虽然目前可以绘制UML图的图形化工具很多，但是对于程序员来说，使用代码来绘图可能更直接，效率更高，尤其是配合IDEA使用。如果你想使用代码来绘图，不妨尝试下PlantUML吧。

参考资料
----

官方文档：[plantuml.com/zh/](https://link.juejin.cn?target=https%3A%2F%2Fplantuml.com%2Fzh%2F "https://plantuml.com/zh/")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！