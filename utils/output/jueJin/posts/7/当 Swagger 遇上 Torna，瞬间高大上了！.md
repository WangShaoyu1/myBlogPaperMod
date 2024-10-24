---
author: "MacroZheng"
title: "当 Swagger 遇上 Torna，瞬间高大上了！"
date: 2021-11-16
description: "Swagger作为一款非常流行的API文档生成工具，相信很多小伙们都在用！可能会觉得它界面丑、功能弱。今天给大家推荐一款工具，配合Swagger使用可以搭建界面漂亮、功能强大的API文档网站。"
tags: ["Java","后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:90,comments:7,collects:155,views:19519,"
---
> Swagger作为一款非常流行的API文档生成工具，相信很多小伙们都在用！用多了可能会觉得它界面丑、功能弱。今天给大家推荐一款工具Torna，配合Swagger使用可以搭建界面漂亮、功能强大的API文档网站，希望对大家有所帮助！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

Torna简介
-------

Torna是一套企业级接口文档解决方案，可以配合Swagger使用。它具有如下功能：

*   文档管理：支持接口文档增删改查、接口调试、字典管理及导入导出功能；
*   权限管理：支持接口文档的权限管理，同时有访客、开发者、管理员三种角色；
*   双模式：独创的双模式，`管理模式`可以用来编辑文档内容，`浏览模式`纯粹查阅文档，界面无其它元素干扰。

![](/images/jueJin/fb637540ac7f4a7.png)

Torna项目架构
---------

> Torna是一个前后端分离项目，后端使用SpringBoot+MyBatis来实现，前端使用Vue+ElementUI来实现，技术栈非常主流！它不仅可以搭建API文档网站，还是个非常好的学习项目，让我们先来看看它的项目架构。

*   首先我们需要下载Torna的源码，下载地址：[gitee.com/durcframewo…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fdurcframework%2Ftorna "https://gitee.com/durcframework/torna")

![](/images/jueJin/82c41d3c79254c9.png)

*   下载成功后，将代码导入到IDEA中，项目结构如下；

![](/images/jueJin/1bb60d3ebcd5484.png)

*   我们再来看下`server`模块的结构，一个非常标准的SpringBoot项目；

![](/images/jueJin/e3d49ab50426466.png)

*   再来看下`front`模块的结构，一个非常标准的Vue项目，值得学习！

![](/images/jueJin/117894d2cf464ea.png)

安装
--

> 接下来我们把Torna运行起来，体验一下它的功能，这里提供Windows和Linux两种安装方式。

### Windows

> 下面我们来介绍Torna在Windows下的安装方法，如果你想深入学习Torna的话可以采用此种方式。

#### 后端运行

*   首先创建一个数据库`torna`，然后导入项目中的`mysql.sql`脚本，导入成功后，表结构如下；

![](/images/jueJin/649a71a096cd4fb.png)

*   修改项目的配置文件`server/boot/src/main/resources/application.properties`，修改对应的数据库连接配置；

```properties
# Server port
server.port=7700

# MySQL host
mysql.host=localhost:3306
# Schema name
mysql.schema=torna
# Insure the account can run CREATE/ALTER sql.
mysql.username=root
mysql.password=root
```

*   然后运行项目启动类`TornaApplication`的main方法，控制台打印如下信息表示启动成功。

![](/images/jueJin/71f4af76f88c478.png)

#### 前端运行

*   进入前端项目目录`front`，运行`npm install`命令安装依赖；

![](/images/jueJin/25253e4570cc476.png)

*   此时如果遇到`node-sass`无法安装的情况，可以直接使用如下命令安装；

```bash
npm i node-sass --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
```

*   依赖安装完成后，可以通过`npm run dev`命令启动项目，启动成功后访问地址：[http://localhost:9530/](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A9530%2F "http://localhost:9530/")

![](/images/jueJin/42e0fc5647bd418.png)

*   通过体验账号密码`admin@torna.cn:123456`可以访问Torna服务，界面还是不错的！

![](/images/jueJin/95f45526291e4ce.png)

### Linux

> 在Linux下使用Docker安装Torna是非常简单的，如果你只想用Torna来做API文档服务的话可以采用这种方式。

*   首先我们需要下载Torna的Docker镜像；

```bash
docker pull tanghc2020/torna:latest
```

*   下载完成后将配置文件`application.properties`拷贝配置文件到`/mydata/torna/config`目录下，并修改数据库配置；

```properties
# Server port
server.port=7700

# MySQL host
mysql.host=192.168.3.101:3306
# Schema name
mysql.schema=torna
# Insure the account can run CREATE/ALTER sql.
mysql.username=root
mysql.password=root
```

*   然后通过如下命令运行Torna服务；

```bash
docker run -p 7700:7700 --name torna \
-v /mydata/torna/config:/torna/config \
-d tanghc2020/torna:latest
```

*   由于镜像中直接包含了前端和后端项目，所以可以直接使用，访问地址：[http://192.168.3.101:7700](https://link.juejin.cn?target=http%3A%2F%2F192.168.3.101%3A7700 "http://192.168.3.101:7700")

![](/images/jueJin/d19bfbcefe11490.png)

使用
--

> Torna支持从多种工具导入接口文档，包括Swagger、smart-doc、OpenAPI、Postman等，接下来我们来体验下它的功能！

### 结合Swagger使用

> Torna能大大增强Swagger的功能，并且界面足够美观，下面我们来体验下！

*   在使用之前，我们需要在Torna中进行配置才行，首先我们来配置一个开放用户，新建一个`macro`的账号，记住`AppKey`和`Secret`；

![](/images/jueJin/39ff638244ce471.png)

*   然后创建一个项目`mall-tiny-trona`；

![](/images/jueJin/61d32dc7d8844a1.png)

*   接下来创建一个模块，打开`OpenAPI`标签，获取`请求路径`和`token`；

![](/images/jueJin/a36182b3290c481.png)

*   之后在使用Swagger的项目中集成Torna插件，非常简单，添加如下依赖即可；

```xml
<!-- Torna Swagger 插件 -->
<dependency>
<groupId>cn.torna</groupId>
<artifactId>swagger-plugin</artifactId>
<version>1.2.6</version>
<scope>test</scope>
</dependency>
```

*   然后在`resources`目录下添加配置文件`torna.json`，配置说明参考注释即可；

```json
    {
    // 开启推送
    "enable": true,
    // 扫描package，多个用;隔开
    "basePackage": "com.macro.mall.tiny.controller",
    // 推送URL，IP端口对应Torna服务器
    "url": "http://localhost:7700/api",
    // appKey
    "appKey": "20211103905498418195988480",
    // secret
    "secret": "~#ZS~!*2B3I01vbW0f9iKH,rzj-%Xv^Q",
    // 模块token
    "token": "74365d40038d4f648ae65a077d956836",
    // 调试环境，格式：环境名称,调试路径，多个用"|"隔开
    "debugEnv": "test,http://localhost:8088",
    // 推送人
    "author": "macro",
    // 打开调试:true/false
    "debug": true,
    // 是否替换文档，true：替换，false：不替换（追加）。默认：true
    "isReplace": true
}
```

*   接下来通过调用`SwaggerPlugin`的`pushDoc`方法来推送接口文档到Torna；

```java
@RunWith(SpringRunner.class)
@SpringBootTest
    public class MallTinyApplicationTests {
    
    @Test
        public void pushDoc(){
        // 将文档推送到Torna服务中去，默认查找resources下的torna.json
        SwaggerPlugin.pushDoc();
    }
    
}
```

*   推送成功后，在接口列表将显示如下接口信息；

![](/images/jueJin/06755eb0cbd34c2.png)

*   查看一下接口的详细信息，还是很全面的，界面也不错！

![](/images/jueJin/08a232cad857442.png)

*   把我们的项目运行起来，就可以直接在上面进行接口调试了，调用下登录接口试试；

![](/images/jueJin/481035748d584e6.png)

*   如果我们想设置公共请求头的话，比如用于登录认证的`Authorization`头，可以在`模块配置`中进行配置；

![](/images/jueJin/ad401d43e94c449.png)

*   在后端接口没有完成前，我们如果需要Mock数据的话，可以使用Mock功能；

![](/images/jueJin/19e89ffbcb2941c.png)

*   这里我们对登录接口进行了一下Mock，当然你也可以使用Mock脚本，这下只要接口定义好，前端就可以使用Mock的数据联调了。

![](/images/jueJin/1f8371731d4348e.png)

### 结合smart-doc使用

> smart-doc是一款无注解侵入的API文档生成工具，具体使用可以参考[《smart-doc使用教程》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FZbRYG-_AzDotnfgouv19NA "https://mp.weixin.qq.com/s/ZbRYG-_AzDotnfgouv19NA") ，这里介绍下它与Torna结合使用。

*   首先修改`mall-tiny-smart-doc`项目的smart-doc配置文件`smart-doc.json`，添加如下关于Torna的配置；

```json
    {
    // torna平台对接appKey
    "appKey": "20211103905498418195988480",
    //torna平台appToken
    "appToken": "b6c50f442eb348f48867d85f4ef2eaea",
    //torna平台secret
    "secret": "~#ZS~!*2B3I01vbW0f9iKH,rzj-%Xv^Q",
    //torna平台地址，填写自己的私有化部署地址
    "openUrl": "http://localhost:7700/api",
    //测试项目接口环境
    "debugEnvName":"测试环境",
    //测试项目接口地址
    "debugEnvUrl":"http://localhost:8088"
}
```

*   由于smart-doc的Maven插件已经自带推送文档到Torna的功能，我们只需双击`smart-doc:torna-rest`按钮即可；

![](/images/jueJin/970be9f096534f7.png)

*   接下来在Torna中，我们就可以看到相关的接口文档了，非常方便！

![](/images/jueJin/4e25eebee63b42a.png)

总结
--

当一种工具变得越来越流行，但是某些功能需求又满足不了时，往往会有一些增强工具产生，Torna对于Swagger来说正是这样一种工具。Torna的文档界面和调试功能明显比Swagger高大上多了，而且还增加了权限管理功能，文档的安全性大大增强，大家觉得不错的话可以尝试下它！

参考资料
----

官方文档：[torna.cn/](https://link.juejin.cn?target=http%3A%2F%2Ftorna.cn%2F "http://torna.cn/")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-torna "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-torna")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！