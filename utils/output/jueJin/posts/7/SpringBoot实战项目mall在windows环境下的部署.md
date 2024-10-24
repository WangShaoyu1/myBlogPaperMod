---
author: "MacroZheng"
title: "SpringBoot实战项目mall在windows环境下的部署"
date: 2019-06-26
description: "本文主要以图文的形式讲解mall项目所需环境在windows下的安装，主要包括IDEA、Mysql、Redis、Elasticsearch、Mongodb、RabbitMQ、OSS。 11至此，RabbitMQ的安装和配置完成。 在OSS产品详情页，单击立即开通。 mall项…"
tags: ["Spring Boot中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:9,comments:4,collects:10,views:8773,"
---
> SpringBoot实战电商项目mall地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

本文主要以图文的形式讲解mall项目所需环境在windows下的安装，主要包括IDEA、Mysql、Redis、Elasticsearch、Mongodb、RabbitMQ、OSS。

IDEA
----

1.关于IDEA的安装与使用具体参考[github.com/judasn/Inte…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fjudasn%2FIntelliJ-IDEA-Tutorial "https://github.com/judasn/IntelliJ-IDEA-Tutorial")

2.搜索插件仓库，安装插件lombok

![展示图片](/images/jueJin/16b93ba23106cdc.png)

3.将项目下载到本地，然后直接打开

![展示图片](/images/jueJin/16b93ba23395553.png)

![展示图片](/images/jueJin/16b93ba231ca59f.png)

Mysql
-----

1.  下载并安装mysql5.7版本，下载地址：[dev.mysql.com/downloads/i…](https://link.juejin.cn?target=https%3A%2F%2Fdev.mysql.com%2Fdownloads%2Finstaller%2F "https://dev.mysql.com/downloads/installer/")
2.  设置数据库帐号密码：root root
3.  下载并安装客户端连接工具Navicat,下载地址：[www.formysql.com/xiazai.html](https://link.juejin.cn?target=http%3A%2F%2Fwww.formysql.com%2Fxiazai.html "http://www.formysql.com/xiazai.html")
4.  创建数据库mall
5.  导入document/sql下的mall.sql文件

Redis
-----

1.下载Redis,下载地址：[github.com/MicrosoftAr…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMicrosoftArchive%2Fredis%2Freleases "https://github.com/MicrosoftArchive/redis/releases")

![展示图片](/images/jueJin/16b93ba235882b2.png)

2.下载完后解压到指定目录

![展示图片](/images/jueJin/16b93ba234f551d.png)

3.在当前地址栏输入cmd后，执行redis的启动命令：redis-server.exe redis.windows.conf

![展示图片](/images/jueJin/16b93ba235ccd0d.png)

Elasticsearch
-------------

1.下载Elasticsearch6.2.2的zip包，并解压到指定目录，下载地址：[www.elastic.co/cn/download…](https://link.juejin.cn?target=https%3A%2F%2Fwww.elastic.co%2Fcn%2Fdownloads%2Fpast-releases%2Felasticsearch-6-2-2 "https://www.elastic.co/cn/downloads/past-releases/elasticsearch-6-2-2")

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba266d0a341~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba266d0a34.png)

2.安装中文分词插件，在elasticsearch-6.2.2\\bin目录下执行以下命令：elasticsearch-plugin install [github.com/medcl/elast…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmedcl%2Felasticsearch-analysis-ik%2Freleases%2Fdownload%2Fv6.2.2%2Felasticsearch-analysis-ik-6.2.2.zip "https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v6.2.2/elasticsearch-analysis-ik-6.2.2.zip")

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba2688ac71d~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba2688ac71.png)

3.运行bin目录下的elasticsearch.bat启动Elasticsearch

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba29baf96b4~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba29baf96b.png)

4.下载Kibana,作为访问Elasticsearch的客户端，请下载6.2.2版本的zip包，并解压到指定目录，下载地址：[artifacts.elastic.co/downloads/k…](https://link.juejin.cn?target=https%3A%2F%2Fartifacts.elastic.co%2Fdownloads%2Fkibana%2Fkibana-6.2.2-windows-x86_64.zip "https://artifacts.elastic.co/downloads/kibana/kibana-6.2.2-windows-x86_64.zip")

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba29299f652~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba29299f65.png)

5.运行bin目录下的kibana.bat，启动Kibana的用户界面

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba28dc4ae74~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba28dc4ae7.png)

6.访问[http://localhost:5601](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A5601 "http://localhost:5601") 即可打开Kibana的用户界面

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba29ea62fe9~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba29ea62fe.png)

Mongodb
-------

1.下载Mongodb安装包，下载地址：[fastdl.mongodb.org/win32/mongo…](https://link.juejin.cn?target=https%3A%2F%2Ffastdl.mongodb.org%2Fwin32%2Fmongodb-win32-x86_64-2008plus-ssl-3.2.21-signed.msi "https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2008plus-ssl-3.2.21-signed.msi")

2.选择安装路径进行安装

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba2b04722ae~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba2b04722a.png)

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba2a551ba47~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba2a551ba4.png)

3.在安装路径下创建data\\db和data\\log两个文件夹

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba29f6640fd~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba29f6640f.png)

4.在安装路径下创建mongod.cfg配置文件

```
systemLog:
destination: file
path: D:\developer\env\MongoDB\data\log\mongod.log
storage:
dbPath: D:\developer\env\MongoDB\data\db
```

5.安装为服务（运行命令需要用管理员权限）

```
D:\developer\env\MongoDB\bin\mongod.exe --config "D:\developer\env\MongoDB\mongod.cfg" --install
```

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba2c6863ee8~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba2c6863ee.png)

6.服务相关命令

```
启动服务：net start MongoDB
关闭服务：net stop MongoDB
移除服务：D:\developer\env\MongoDB\bin\mongod.exe --remove
```

7.下载客户端程序：[download.robomongo.org/1.2.1/windo…](https://link.juejin.cn?target=https%3A%2F%2Fdownload.robomongo.org%2F1.2.1%2Fwindows%2Frobo3t-1.2.1-windows-x86_64-3e50a65.zip "https://download.robomongo.org/1.2.1/windows/robo3t-1.2.1-windows-x86_64-3e50a65.zip")

8.解压到指定目录，打开robo3t.exe并连接到localhost:27017

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba2bf53eccc~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba2bf53ecc.png)

RabbitMQ
--------

1.安装Erlang，下载地址：[erlang.org/download/ot…](https://link.juejin.cn?target=http%3A%2F%2Ferlang.org%2Fdownload%2Fotp_win64_21.3.exe "http://erlang.org/download/otp_win64_21.3.exe")

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba2c060dae9~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba2c060dae.png)

2.安装RabbitMQ，下载地址：[dl.bintray.com/rabbitmq/al…](https://link.juejin.cn?target=https%3A%2F%2Fdl.bintray.com%2Frabbitmq%2Fall%2Frabbitmq-server%2F3.7.14%2Frabbitmq-server-3.7.14.exe "https://dl.bintray.com/rabbitmq/all/rabbitmq-server/3.7.14/rabbitmq-server-3.7.14.exe")

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba2cc11097b~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba2cc11097.png)

3.安装完成后，进入RabbitMQ安装目录下的sbin目录

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba2cd9d317f~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba2cd9d317.png)

4.在地址栏输入cmd并回车启动命令行，然后输入以下命令启动管理功能：

```
rabbitmq-plugins enable rabbitmq_management
```

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba2e53bd66e~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba2e53bd66.png)

5.访问地址查看是否安装成功：[http://localhost:15672/](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A15672%2F "http://localhost:15672/")

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba2d968467e~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba2d968467.png)

6.输入账号密码并登录：guest guest

7.创建帐号并设置其角色为管理员：mall mall

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba2e315b868~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba2e315b86.png)

8.创建一个新的虚拟host为：/mall

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba2e7558693~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba2e755869.png)

9.点击mall用户进入用户配置页面

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba2efa5f52a~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba2efa5f52.png)

10.给mall用户配置该虚拟host的权限

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba2f6f8cff7~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba2f6f8cff.png)

11.至此，RabbitMQ的安装和配置完成。

OSS
---

### 开通OSS服务

*   登录阿里云官网；
*   将鼠标移至产品标签页，单击对象存储 OSS，打开OSS 产品详情页面；
*   在OSS产品详情页，单击立即开通。

### 创建存储空间

*   点击网页右上角控制台按钮进入控制台

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba2fee832ff~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba2fee832f.png)

*   选择我的云产品中的对象存储OSS

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba30225395f~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba30225395.png)

*   点击左侧存储空间的加号新建存储空间

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba30aee9b91~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba30aee9b9.png)

*   新建存储空间并设置读写权限为公共读

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba30ff77866~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba30ff7786.png)

### 跨域资源共享（CORS）的设置

*   选择一个存储空间，打开其基础设置

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba31e248b1c~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba31e248b1.png)

*   点击跨越设置的设置按钮

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba31cc2d94d~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba31cc2d94.png)

*   点击创建规则

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba32833e571~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba32833e57.png)

*   进行跨域规则设置

![https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/26/16b93ba328d31c8d~tplv-t2oaga2asx-image.image](/images/jueJin/16b93ba328d31c8.png)

mall-admin
----------

*   启动项目：直接运行com.macro.mall.MallAdminApplication的main方法即可
*   接口文档地址：[http://localhost:8080/swagger-ui.html](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Fswagger-ui.html "http://localhost:8080/swagger-ui.html")

mall-search
-----------

*   启动项目：直接运行com.macro.mall.search.MallSearchApplication的main方法即可
*   接口文档地址：[http://localhost:8081/swagger-ui.html](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8081%2Fswagger-ui.html "http://localhost:8081/swagger-ui.html")
*   使用前需要先调用接口导入数据；[http://localhost:8081/esProduct/importAll](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8081%2FesProduct%2FimportAll "http://localhost:8081/esProduct/importAll")
*   如出现无法启动的问题，可以先删除Elasticsearch里面的数据再启动

mall-portal
-----------

*   启动mall-portal项目：直接运行com.macro.mall.portal.MallPortalApplication的main方法即可
*   接口文档地址：[http://localhost:8085/swagger-ui.html](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8085%2Fswagger-ui.html "http://localhost:8085/swagger-ui.html")

公众号
---

[mall项目](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")全套学习教程连载中，**关注公众号**第一时间获取。

![公众号图片](/images/jueJin/16b794607551628.png)