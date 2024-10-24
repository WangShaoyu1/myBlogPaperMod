---
author: "MacroZheng"
title: "Postman：API接口调试利器"
date: 2019-08-19
description: "Postman是一款API接口调试工具，使用它可以很方便的对接口进行测试，并且后端人员可以将自己的调试结果导出，方便前端人员调试。 下载完安装包后直接双击安装即可。 这里不得不说，Postman的界面还是做的很好的，比起Swagger来说好多了，Postman默认提供了两种主题…"
tags: ["Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:24,comments:5,collects:36,views:5448,"
---
> SpringBoot实战电商项目mall（18k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

Postman是一款API接口调试工具，使用它可以很方便的对接口进行测试，并且后端人员可以将自己的调试结果导出，方便前端人员调试。

安装
--

*   下载地址：[www.getpostman.com/downloads/](https://link.juejin.cn?target=https%3A%2F%2Fwww.getpostman.com%2Fdownloads%2F "https://www.getpostman.com/downloads/")
*   下载完安装包后直接双击安装即可。

设置
--

### 主题设置

这里不得不说，Postman的界面还是做的很好的，比起Swagger来说好多了，Postman默认提供了两种主题，一种亮色和一种暗色，可以通过左上角的File->Settings按钮打开。

![展示图片](/images/jueJin/16ca9c410239546.png)

![展示图片](/images/jueJin/16ca9c410399280.png)

### 调整字体大小

可能界面默认的字体大小并不适合你，尤其是大屏幕的电脑，可以在View下的Zoom In和Zoom Out按钮进行放大和缩小。

![展示图片](/images/jueJin/16ca9c410373df0.png)

进行接口调试
------

> 测试接口均来自mall-admin后台，启动后可以直接测试。

### 调用GET请求

![展示图片](/images/jueJin/16ca9c4103aa416.png)

### 调用POST请求提交JSON格式数据

![展示图片](/images/jueJin/16ca9c4103a625a.png)

### 调用POST请求提交表单

![展示图片](/images/jueJin/16ca9c41039f326.png)

### 调用文件上传接口

![展示图片](/images/jueJin/16ca9c413342f51.png)

![展示图片](/images/jueJin/16ca9c4133555ed.png)

### 调用需要登录的接口

### 调用登录接口获取令牌

![展示图片](/images/jueJin/16ca9c413391524.png)

### 设置令牌头并调用需要登录的接口

![展示图片](/images/jueJin/16ca9c4133abc73.png)

调试文件的导入与导出
----------

### 将调试接口信息进行保存

![展示图片](/images/jueJin/16ca9c4133838d0.png)

![展示图片](/images/jueJin/16ca9c41420e23f.png)

### 导出Collection中的调试信息

![展示图片](/images/jueJin/16ca9c4153b42cb.png)

### 导入Collection中的调试信息

![展示图片](/images/jueJin/16ca9c41550dcc1.png)

![展示图片](/images/jueJin/16ca9c41571ba04.png)

使用过程中的一些技巧
----------

### 设置不同的环境

我们开发时，都会分本地环境和测试环境，本地环境用于本机调试接口，测试环境用于前后端联调接口。上面我们把http://localhost:8080这个ip端口直接写在请求路径之中，当我们要调试测试环境接口时，就会产生麻烦。定义多个环境变量，在接口地址中进行引用，可以解决这个问题。

#### 添加本地环境

![展示图片](/images/jueJin/16ca9c4158db4b2.png)

#### 添加测试环境

![展示图片](/images/jueJin/16ca9c4160f1e61.png)

#### 引用环境变量

![展示图片](/images/jueJin/16ca9c416969114.png)

#### 环境变量的切换

![展示图片](/images/jueJin/16ca9c4178439c7.png)

### 设置通用的登录令牌

当我们有很多接口需要登录令牌头时，如果以前使用的令牌失效了，那所有接口的令牌头都会需要修改，这里可以把登录令牌定义好，再引用，这样令牌失效了，只需要修改一处即可。

![展示图片](/images/jueJin/16ca9c417dce01f.png)

![展示图片](/images/jueJin/16ca9c4180f6e68.png)

公众号
---

[mall项目](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")全套学习教程连载中，**关注公众号**第一时间获取。

![公众号图片](/images/jueJin/16c9572313e42e8.png)