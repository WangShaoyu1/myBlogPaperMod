---
author: "MacroZheng"
title: "好用到爆！IDEA版Postman面世了，功能真心强大！"
date: 2022-05-17
description: "IDEA是最常用的开发工具，很多程序员都想把它打造成一站式开发平台，于是安装了各种各样的插件。最近发现了一款IDEA插件，细节做的真心不错，说它是IDEA版的Postman也不为过，推荐给大家！"
tags: ["Java","后端","IntelliJ IDEA中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:711,comments:123,collects:1200,views:136487,"
---
> IDEA是最常用的开发工具，很多程序员都想把它打造成一站式开发平台，于是安装了各种各样的插件。最近发现了一款IDEA插件`RestfulFastRequest`，细节做的真心不错，说它是IDEA版的Postman也不为过，推荐给大家！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

RestfulFastRequest简介
--------------------

`RestfulFastRequest`号称是IDEA版本的Postman。它是一个功能强大的Restful API工具包插件，可以根据已有的方法快速生成接口调试用例。它有一个漂亮的界面来完成请求、检查服务器响应、存储你的API请求和导出API请求，该插件能帮助你在IDEA内更快更高效地调试API！

下面是使用`RestfulFastRequest`调试[mall项目](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")API接口的一张效果图，用起来还是非常方便的！

![](/images/jueJin/5d37d36d792e4e7.png)

安装
--

> 首先我们来安装`RestfulFastRequest`插件。

*   我们可以打开IDEA的插件市场来搜索下`RestfulFastRequest`，看起来貌似是付费的插件，仔细看下插件描述可以发现，它是有免费版本的，看来作者还是比较良心的！

![](/images/jueJin/aace210a1fdd41b.png)

*   点击`免费版`连接可以直接下载插件安装包，下载地址：[github.com/dromara/fas…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdromara%2Ffast-request%2Fissues%2F61 "https://github.com/dromara/fast-request/issues/61")

![](/images/jueJin/46126caab14743a.png)

*   下载完成后，直接选择从本地磁盘安装插件即可。

![](/images/jueJin/111402f5fa8740f.png)

使用
--

> 接下来我们来使用下`RestfulFastRequest`插件，看看它是否和Postman一样好用！

### 创建项目和环境

*   点击IDEA右侧的`FastRequest`按钮即可打开该插件面板，第一次使用需要先配置项目名和环境名；

![](/images/jueJin/41fa81bd1e8b422.png)

*   点击`管理配置`按钮进行配置，配置好项目名，还有环境名，这里配置了`dev`和`prod`两个环境的访问地址；

![](/images/jueJin/549309ae246141e.png)

*   选择好项目名和环境后就可以开始调试API接口了。

![](/images/jueJin/f2ec7eabaaf9402.png)

### 调试API接口

*   点击接口左侧的`小火箭`按钮即可直接生成调用接口所需的信息，修改好参数之后就可以直接调用了；

![](/images/jueJin/735d786e5338409.png)

*   点击`小飞机`按钮发送请求，可以接收到格式化好的JSON数据。

![](/images/jueJin/0e3482b11c03406.png)

### 快速添加Header

*   学习过我的[mall项目](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")的朋友应该了解，项目中很多接口都是需要登录成功后才可以访问的，比如这个获取用户列表的接口；

![](/images/jueJin/e5d4165bdd98408.png)

*   我可以通过选择返回信息来快速添加认证头；

![](/images/jueJin/f558d678bad2431.png)

*   修改Header名称为`Authorization`，并给token添加`Bearer` 前缀即可；

![](/images/jueJin/c449f172b3694de.png)

*   接下来访问需要登录认证的接口就可以正常访问了。

![](/images/jueJin/06e65919495945c.png)

### JSON语法检查

*   值得一提的是该插件对JSON的支持还是挺好的，不仅支持高亮显示，还能支持折叠；

![](/images/jueJin/fc6f6119deb44d2.png)

*   传入JSON参数格式不正确的时候也能有所提示。

![](/images/jueJin/d5defc41dbb8441.png)

### CURL拷贝

如果你想使用CURL工具的话，也可以通过CURL按钮拷贝命令。

![](/images/jueJin/43ac638606cd4e8.png)

### API列表

在我们调试接口时，可以通过保存按钮，将接口和调试信息都保持到API列表里去。

![](/images/jueJin/64801ab489714ae.png)

### API导航

在API导航中可以查看所有接口，第一次需要点击刷新按钮加载。

![](/images/jueJin/bc181730395d45a.png)

### 反向定位API代码

双击接口信息可以直接反向定位到代码，通过接口找代码又方便了！

![](/images/jueJin/6083f9df39a84d4.png)

### API搜索

通过`搜索`按钮可以方便地进行API搜索。

![](/images/jueJin/e2989f044207404.png)

### 导出到Postman

*   如果你还是想用Postman的话，可以直接通过`导出到Postman`功能直接将接口信息进行导出；

![](/images/jueJin/47c01b6a9a1f442.png)

*   导出成功后，再在Postman中导入JSON配置文件即可使用；

![](/images/jueJin/866070402b1d4c7.png)

*   导入成功后显示效果如下，不过只能导出保存好的API，不能直接导出所有API。

![](/images/jueJin/7ab5442ba58b466.png)

总结
--

今天体验了一把`RestfulFastRequest`这个插件，体验确实不错，开发人员用来调试接口基本够用了！尤其是它能根据接口代码直接生成调试信息，并且能根据接口直接定位代码，确实提高了开发人员的效率！

参考资料
----

官方文档：[dromara.org/fast-reques…](https://link.juejin.cn?target=https%3A%2F%2Fdromara.org%2Ffast-request%2F "https://dromara.org/fast-request/")