---
author: "MacroZheng"
title: "解放双手！推荐一款阿里开源的低代码工具，YYDS！"
date: 2022-04-19
description: "之前在我印象中低代码就是通过图形化界面来生成代码而已，其实真正的低代码把它当做一站式开发平台也不为过！最近体验了一把阿里开源的低代码工具，确实是一款面向企业级的低代码解决方案，推荐给大家！"
tags: ["后端","Java","Spring Boot中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:1100,comments:172,collects:2100,views:145412,"
---
> 之前分享过一些低代码相关的文章，发现大家还是比较感兴趣的。之前在我印象中低代码就是通过图形化界面来生成代码而已，其实真正的低代码不仅要负责生成代码，还要负责代码的维护，把它当做一站式开发平台也不为过！最近体验了一把阿里开源的低代码工具`LowCodeEngine`，确实是一款面向企业级的低代码解决方案，推荐给大家！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

LowCodeEngine简介
---------------

LowCodeEngine是阿里开源的一套面向扩展设计的企业级低代码技术体系，目前在在Github上已有`4.7K+Star`。这个项目大概是今年2月中旬开源的，两个月不到收获这么多Star，确实非常厉害！

![](/images/jueJin/a4507e7c0e53416.png)

LowCodeEngine主要具有如下特性：

*   提炼自企业级低代码平台的低代码引擎，奉行高度可扩展、最小内核、最强生态的设计理念；
*   部署简单，基本上就是开箱即用，拥有完善的物料体系、功能强大的设置器、丰富的插件等；
*   可视化编辑器具有完善的工具链，支持物料体系、设置器、插件等生态元素；
*   强大的扩展能力，已支撑近 100 个各种垂直类低代码平台；
*   使用 TypeScript 开发，能生成基于React的前端代码。

下面是LowCodeEngine使用过程中的一张效果图，功能还是很强大的！

![](/images/jueJin/395487c1d87d46a.png)

搭建低代码平台
-------

> 接下来我们将使用LowCodeEngine搭建一个低代码开发平台，仅需5分钟，可以说是开箱即用！

*   首先我们需要想下载LowCodeEngine编辑器的示例代码，下载地址：[github.com/alibaba/low…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Falibaba%2Flowcode-demo "https://github.com/alibaba/lowcode-demo")

![](/images/jueJin/726b28ca9ac44bb.png)

*   下载成功后解压到指定目录，安装此项目需要使用`Node.js`和`npm`，确保已经安装完毕，由于依赖中有些`npm源`无法访问，这里推荐使用`cnpm`来安装，先使用如下命令安装`cnpm`；

```bash
npm install -g cnpm --registry=https://registry.npmmirror.com
```

*   `cnpm`安装成功后，进入解压目录使用如下命令安装依赖；

```bash
cnpm install
```

*   依赖安装完成后，使用`npm start`命令启动项目；

![](/images/jueJin/2280aa7b3c3f4ed.png)

*   项目运行成功后将运行在`5556`端口上，访问地址：[http://localhost:5556](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A5556 "http://localhost:5556")

![](/images/jueJin/0798142be6c04ae.png)

使用低代码平台
-------

> 之前在我的开源项目[mall](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")中有个品牌管理功能，接下来我们将使用LowCodeEngine来实现下它，看看低代码开发有何神奇之处！

### 目标效果

[mall](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")项目中的品牌管理功能效果如下，这里使用低代码简单实现下品牌列表功能。

![](/images/jueJin/9658706f0687495.png)

### 组件库

*   首先我们从`组件库`中选择`查询筛选`组件，通过拖拽的形式插入编辑区中；

![](/images/jueJin/cc7cf823122347c.png)

*   然后选中`查询筛选`组件，通过右侧的`设置器`进行设置；

![](/images/jueJin/ecb607544b734dd.png)

*   可以点击组件左侧的`编辑`按钮对组件进行详细设置，比如说组件外观和输入提示等；

![](/images/jueJin/5b7c3b2076f6432.png)

*   接下来再拖拽一个`高级表格`组件到编辑器中去；

![](/images/jueJin/8b2d76505b9e422.png)

*   同样选中`高级表格`组件可以对表格进行设置，我们可以通过`数据列`来设置需要显示的数据。

![](/images/jueJin/aa154000d777462.png)

### 数据源

*   由于表格中的数据需要访问接口来获取，这里我们可以通过`数据源`功能来实现，这里我们调用演示环境的API，填入请求参数即可，值得注意的是由于数据列表在`data.list`属性中，我们需要定制下请求成功的处理函数；

![](/images/jueJin/ab57510b8425473.png)

*   接下来选中`高级表格`组件，修改`表格数据源`，选择`表达式输入`，填入我们之前设置的`数据源ID`即可；

![](/images/jueJin/c5296f7705cc416.png)

*   然后修改`数据列`信息，将每个数据列`数据字段`修改为JSON数据中对应的属性即可。

![](/images/jueJin/86930bccc6a841f.png)

### 预览及出码

*   如果想查看搭建的页面效果的话，点击右上角的`预览`按钮即可；

![](/images/jueJin/ae9f4798adf44b4.png)

*   下面是由低代码生成的页面预览效果；

![](/images/jueJin/42036e947d08407.png)

*   如果你想获取工具生成的代码的话，点击右上角的`出码`按钮即可，支持直接下载。

![](/images/jueJin/77bba50e86ef407.png)

### 其他功能

*   如果你想自定义一些函数的话，可以通过`源码面板`进行自定义；

![](/images/jueJin/eb2dcb6bbcb646a.png)

*   通过`大纲视图`我们可以查看整个界面的结构。

![](/images/jueJin/4814e3fae13140c.png)

总结
--

今天体验了一把阿里开源的低代码开发工具，功能确实很强大。但是低代码并不意味着可以不写代码了，想用好低代码工具还得熟悉工具生成的代码。LowCodeEngine目前仅支持生成React的前端代码，所以想要实现更为复杂的业务系统，还得熟悉React。如果有小伙伴想更深入了解低代码的概念，推荐看下这篇文章[《阿里低代码引擎和生态建设实战及思考》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FMI6MrUKKydtnSdO4xq6jwA "https://mp.weixin.qq.com/s/MI6MrUKKydtnSdO4xq6jwA") 。

参考资料
----

*   项目地址：[github.com/alibaba/low…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Falibaba%2Flowcode-engine "https://github.com/alibaba/lowcode-engine")
*   项目官网：[lowcode-engine.cn/](https://link.juejin.cn?target=https%3A%2F%2Flowcode-engine.cn%2F "https://lowcode-engine.cn/")
*   操作指南：[www.yuque.com/lce/usage](https://link.juejin.cn?target=https%3A%2F%2Fwww.yuque.com%2Flce%2Fusage "https://www.yuque.com/lce/usage")