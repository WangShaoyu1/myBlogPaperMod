---
author: "MacroZheng"
title: "当Swagger遇上YApi，瞬间高大上了！"
date: 2020-12-15
description: "Swagger经常被人吐槽界面不够好看、功能不够强大，其实有很多工具可以和Swagger结合使用，结合之后就会变得非常好用。之前写过一篇文章《Swagger界面丑、功能弱怎么破？用Postman增强下就给力了！》，有朋友留言说YApi也很好用。最近体验了一把YApi，发现确实不…"
tags: ["Java","Spring Boot中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:177,comments:14,collects:214,views:20482,"
---
> SpringBoot实战电商项目mall（40k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

Swagger经常被人吐槽界面不够好看、功能不够强大，其实有很多工具可以和Swagger结合使用，结合之后就会变得非常好用。之前写过一篇文章[《Swagger界面丑、功能弱怎么破？用Postman增强下就给力了！》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FrbKUJAhv6WorFWgDNUDWTg "https://mp.weixin.qq.com/s/rbKUJAhv6WorFWgDNUDWTg")，有朋友留言说YApi也很好用。最近体验了一把YApi，发现确实不错，推荐给大家！

YApi简介
------

YApi是高效、易用、功能强大的API管理平台，旨在为开发、产品、测试人员提供更优雅的接口管理服务。YApi在Github上已累计获得了18K+Star，具有优秀的交互体验，YApi不仅提供了常用的接口管理功能，还提供了权限管理、Mock数据、Swagger数据导入等功能，总之功能很强大！

安装
--

### 环境准备

> 本地部署YApi需要先安装nodejs和MongoDB，我们先把它们安装好。

*   安装nodejs，直接下载安装包双击安装即可，这里安装的是`12.14.0`版本，下载地址：[nodejs.org/dist/v12.14…](https://link.juejin.cn?target=https%3A%2F%2Fnodejs.org%2Fdist%2Fv12.14.0%2Fnode-v12.14.0-x64.msi "https://nodejs.org/dist/v12.14.0/node-v12.14.0-x64.msi");
    
*   安装MongoDB，参考[《MongoDB快速入门，掌握这些刚刚好！》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FE8sDVWkxaLBdmZPj-6om2A "https://mp.weixin.qq.com/s/E8sDVWkxaLBdmZPj-6om2A")中的安装即可，这里安装的是`4.2.5`版本。
    

### 安装yapi-cli

> `yapi-cli`是YApi官方提供的安装工具，可以通过可视化界面来部署YApi服务，非常方便！

*   使用npm命令来安装`yapi-cli`：

```bash
npm install -g yapi-cli --registry https://registry.npm.taobao.org
```

*   安装成功后控制台输出如下内容；

![](/images/jueJin/bda7a70e1124403.png)

*   安装成功后使用`yapi server`命令来启动YApi的可视化部署界面。

```bash
yapi server
```

### 安装YApi

*   通过可视化部署界面安装YApi服务，访问地址：[http://localhost:9090](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A9090 "http://localhost:9090")

![](/images/jueJin/794bb2557d5a4f3.png)

*   安装完成后会输出如下信息，提示YApi的默认管理员账号密码及访问地址；

![](/images/jueJin/ae3854abb41e42d.png)

*   进入YApi的安装目录，使用node命令启动YApi服务：

```bash
node vendors/server/app.js
```

*   启动成功后控制台输出信息如下；

![](/images/jueJin/26e0ec3e684049f.png)

*   通过页面访问Yapi，默认账号密码为`admin@admin.com:ymfe.org`，访问地址：[http://localhost:3000](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A3000 "http://localhost:3000")

![](/images/jueJin/ea969cc85db042e.png)

使用
--

### 从Swagger导入数据

*   使用管理员账号登录成功后，先创建一个`mall-tiny-group`分组；

![](/images/jueJin/c9c4214bd325491.png)

*   创建分组成功后，在该分组下点击`创建项目`，添加`mall-tiny-swagger`项目；

![](/images/jueJin/a096020eea7b470.png)

*   之后启动我们之前的`mall-tiny-swagger`项目，启动成功后Swagger接口文档访问地址：[http://localhost:8088/swagger-ui/](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8088%2Fswagger-ui%2F "http://localhost:8088/swagger-ui/")

![](/images/jueJin/c40e8e4dd0e2475.png)

*   选择好YApi的`数据管理`功能，配置好Swagger的api-docs路径，然后进行数据导入；

![](/images/jueJin/523b987c1b044d8.png)

*   至此Swagger中的API接口已成功导入到YApi，点击`接口`标签查看所有导入接口。

![](/images/jueJin/5a383ea39123494.png)

### 接口管理

*   打开`添加商品`的接口看看，可以看到非常完善的接口文档信息，注释都有了；

![](/images/jueJin/4c173ed153c24ca.png)

*   来试试接口运行功能，我们会发现默认的接口请求地址并不符合我们的要求，需要在`环境配置`中设置；

![](/images/jueJin/b8f8767066ea498.png)

*   由于是跨域请求，Chrome浏览器需要安装跨域请求插件，下载地址：[github.com/YMFE/cross-…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYMFE%2Fcross-request%2Farchive%2Fmaster.zip "https://github.com/YMFE/cross-request/archive/master.zip")

![](/images/jueJin/02752075fae94ec.png)

*   由于我们的部分接口在请求头中添加token才能访问，所以我们先调用登录接口获取token；

![](/images/jueJin/725ef6e565e047c.png)

*   之后在`设置->环境配置`中添加Authorization头；

![](/images/jueJin/ff663bb27129499.png)

*   再次调用需要登录的接口，可以正常获取到数据，返回数据虽然格式化了，但是没有折叠功能，数据太长的话就不太好看了；

![](/images/jueJin/5a0ea8d70228446.png)

### Mock功能

*   在我们调用POST接口提交JSON数据时，默认Mock的JSON数据有点不太符合我们的要求；

![](/images/jueJin/cd60a9a6f38e45b.png)

*   可以通过接口信息中的`编辑->高级设置`进行修改；

![](/images/jueJin/c146d68922794ec.png)

*   我们可以发现每一个接口信息中都有个Mock地址，当我们后台接口已经定义好格式，但是没有实现时，前端可以使用该地址来Mock数据进行调试；

![](/images/jueJin/a169bdc5bfde473.png)

*   调用Mock地址可以获取到一些测试数据，数据取值返回可以通过上面的Mock设置自行修改；

![](/images/jueJin/cbd990b0f9f9418.png)

### 从Swagger自动同步

*   当我们的接口修改了，API文档如何同步呢，我们可以通过`设置->Swagger自动同步`来开启自动同步功能，有三种数据同步模式可以选择；

![](/images/jueJin/ffff94a6e8c1448.png)

### 权限管理

> 如果有新的成员加入进来，需要查看API文档怎么办？

*   首先可以通过注册界面注册一个成员账号，此处账号为`test@qq.com:123456`；

![](/images/jueJin/fe5ec76e10874e9.png)

*   之后使用管理员账号登录，然后通过`成员列表->添加成员`，将用户添加到相应分组；

![](/images/jueJin/b1bae36ecb73442.png)

*   最后使用成员账号登录即可访问相应API文档了。

![](/images/jueJin/cd3e9c1a04494b6.png)

总结
--

YApi结合Swagger使用果然很强大！之前使用Postman结合Swagger使用时，文档查看、自动同步的问题都得到了解决，为了保证我们API文档访问的安全性还提供了权限管理功能。当API数据格式定义好后，Mock功能让前端无需后台实现也可以调试接口。不过对于JSON格式支持有点偏弱，要是能对JSON数据进行折叠显示就更好了！

参考资料
----

官方文档：[hellosean1025.github.io/yapi/docume…](https://link.juejin.cn?target=https%3A%2F%2Fhellosean1025.github.io%2Fyapi%2Fdocuments%2Findex.html "https://hellosean1025.github.io/yapi/documents/index.html")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-swagger "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-swagger")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！