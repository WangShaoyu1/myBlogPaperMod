---
author: "MacroZheng"
title: "颜值爆表！这款开源的API工具用起来更优雅！"
date: 2023-08-22
description: "作为一名后端开发者，我们经常会使用API工具来调试接口，之前一直使用的Postman，用多了感觉它有点不够轻量级，有时候打开也比较慢。最近发现了一款轻量级的开源API工具，界面挺炫酷，推荐给大家！"
tags: ["后端","Java","Spring Boot中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:17,comments:4,collects:53,views:4426,"
---
> 作为一名后端开发者，我们经常会使用API工具来调试接口，之前一直使用的Postman，用多了感觉它有点不够轻量级，有时候打开也比较慢。最近发现了一款轻量级的开源API工具Insomnia，界面挺炫酷，功能也很实用，推荐给大家！

Insomnia简介
----------

Insomnia是一款开源、跨平台的API客户端工具，可以支持多种网络请求的调试，比如GraphQL、REST、WebSockets和gRPC，目前在Github上已有`29K`的Star。

下面是它的一张使用效果图，界面还是挺炫酷的。

![](/images/jueJin/35a3e91b47fa4be.png)

安装
--

Insomnia的安装是非常简单的，我们可以去它的官网下载，下载完成后双击文件即可运行，下载地址：[insomnia.rest/download](https://link.juejin.cn?target=https%3A%2F%2Finsomnia.rest%2Fdownload "https://insomnia.rest/download")

![](/images/jueJin/89c8f5d2b3bd470.png)

使用
--

> 接下来我们将通过Insomnia来调试下我的电商实战项目mall的接口，这里还是简单介绍下mall项目吧，mall项目是一套基于 SpringBoot + Vue + uni-app 的电商系统，目前在Github已有`60K的Star`，包括前台商城项目和后台管理系统，能支持完整的订单流程！涵盖商品、订单、购物车、权限、优惠券、会员等功能，功能很强大！
> 
> *   项目地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")
> *   文档网站：[www.macrozheng.com](https://link.juejin.cn?target=https%3A%2F%2Fwww.macrozheng.com "https://www.macrozheng.com")

*   首先我们打开Insomnia，然后点击加号创建一个工程；

![](/images/jueJin/4e018ca01947484.png)

*   然后启动下mall项目，打开mall项目的Swagger界面，我们将通过导入的方式往Insomnia中导入接口，mall项目Swagger接口文档地址：[http://localhost:8080/swagger-ui/](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Fswagger-ui%2F "http://localhost:8080/swagger-ui/")

![](/images/jueJin/0debff502a0d43b.png)

*   之后我们选择导入按钮，输入上图中圈出的url地址来导入接口；

![](/images/jueJin/47d9c6d6454b47e.png)

*   导入成功后，在Insomnia的项目中就会出现一个集合了；

![](/images/jueJin/a4362f6705dc4dd.png)

*   点击这个导入的集合，我们就可以看到导入的接口了；

![](/images/jueJin/148a125ad5f44b0.png)

*   在调试这些接口之前，我们还需要设置下环境变量，这里直接使用Swagger的默认环境变量就可以了；

![](/images/jueJin/78d8d1cacb82416.png)

*   之后我们还需要对这个环境变量进行设置，主要是把`base_path`设置为空；

![](/images/jueJin/d21bd9e944f34d9.png)

*   在我们访问接口之前，需要设置下`Authorization`请求头，对于不需要登录认证的接口，比如说登录接口，我们需要在访问前去除它；

![](/images/jueJin/17d36229aa6f4ab.png)

*   之后我们在请求参数中填入信息，就可以调试接口了，这里的请求参数格式Insomnia会自动填写，还是挺方便的；

![](/images/jueJin/d31b20bfdd6e4d3.png)

*   如果你想访问需要登录认证的接口，比如品牌列表接口的话，可以在环境变量中添加一个`api_key`的属性，填入登录接口访问的token；

![](/images/jueJin/9cc9831e95694c5.png)

*   这样我们就可以成功访问需要登录认证的接口了。

![](/images/jueJin/119957dd8970401.png)

设置
--

> 对于Insomnia来说，还有一些常用的设置，这里简单介绍下。

*   比如我们如果想修改工具的字体大小，可以点击左下角的设置按钮，然后修改即可；

![](/images/jueJin/600354930e454e1.png)

*   如果你想修改下Insomnia的主题的话，也可以在设置里完成，Insomnia支持多达18种主题，还是很炫酷的。

![](/images/jueJin/677c9aab56fb4c3.png)

总结
--

Insomnia确实是一款界面炫酷、功能强大的API管理功能，对比Postman它更加轻量级，其实有时候我们选择工具时，并不需要它功能很多，简单、够用、看着舒心就好。

项目地址
----

[github.com/Kong/insomn…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FKong%2Finsomnia "https://github.com/Kong/insomnia")