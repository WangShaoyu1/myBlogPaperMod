---
author: "MacroZheng"
title: "还在用命令行看日志？快用Kibana吧，可视化日志分析YYDS！"
date: 2022-07-13
description: "最近我把mall项目升级支持了SpringBoot 27，同时升级了整套ELK日志收集系统。今天来聊聊mall项目的日志收集机制，使用了SpringBoot支持的最新版ELK，希望对大家有所帮助！"
tags: ["Java","后端","Elasticsearch中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:61,comments:7,collects:134,views:10604,"
---
> 最近我把[mall项目升级](https://juejin.cn/post/7116694234236715038 "https://juejin.cn/post/7116694234236715038")支持了SpringBoot 2.7.0，同时升级了整套ELK日志收集系统。我发现每次升级Kibana界面都会有一定的改变，变得更现代化了吧！今天来聊聊mall项目的日志收集机制，使用了SpringBoot支持的最新版ELK，希望对大家有所帮助！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

ELK日志收集系统搭建
-----------

> 首先我们需要搭建ELK日志收集系统，这里使用在Docker环境下安装的方式。

*   安装并运行Elasticsearch容器，使用如下命令即可；

```bash
docker run -p 9200:9200 -p 9300:9300 --name elasticsearch \
-e "discovery.type=single-node" \
-e "cluster.name=elasticsearch" \
-e "ES_JAVA_OPTS=-Xms512m -Xmx1024m" \
-v /mydata/elasticsearch/plugins:/usr/share/elasticsearch/plugins \
-v /mydata/elasticsearch/data:/usr/share/elasticsearch/data \
-d elasticsearch:7.17.3
```

*   启动时会发现`/usr/share/elasticsearch/data`目录没有访问权限，只需要修改`/mydata/elasticsearch/data`目录的权限，再重新启动即可；

```bash
chmod 777 /mydata/elasticsearch/data/
```

*   安装并运行Logstash容器，使用如下命令即可，`logstash.conf`文件地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall%2Fblob%2Fmaster%2Fdocument%2Felk%2Flogstash.conf "https://github.com/macrozheng/mall/blob/master/document/elk/logstash.conf")

```bash
docker run --name logstash -p 4560:4560 -p 4561:4561 -p 4562:4562 -p 4563:4563 \
--link elasticsearch:es \
-v /mydata/logstash/logstash.conf:/usr/share/logstash/pipeline/logstash.conf \
-d logstash:7.17.3
```

*   进入容器内部，安装`json_lines`插件；

```bash
docker exec -it logstash /bin/bash
logstash-plugin install logstash-codec-json_lines
```

*   安装并运行Kibana容器，使用如下命令即可；

```bash
docker run --name kibana -p 5601:5601 \
--link elasticsearch:es \
-e "elasticsearch.hosts=http://es:9200" \
-d kibana:7.17.3
```

*   ELK日志收集系统启动完成后，就可以访问Kibana的界面了，访问地址：[http://192.168.3.105:5601](https://link.juejin.cn?target=http%3A%2F%2F192.168.3.105%3A5601 "http://192.168.3.105:5601")

![](/images/jueJin/7efc83f5860d413.png)

日志收集原理
------

日志收集系统的原理是这样的，首先应用集成了Logstash插件，通过TCP向Logstash传输日志。Logstash接收到日志后根据日志类型将日志存储到Elasticsearch的不同索引上去，Kibana从Elasticsearch中读取日志，然后我们就可以在Kibana中进行可视化日志分析了，具体流程图如下。

![](/images/jueJin/0ba38fdda5fa44c.png)

这里把日志分成了如下四种类型，方便查看：

*   调试日志（mall-debug）：所有的DEBUG级别以上日志；
*   错误日志（mall-error）：所有的ERROR级别日志；
*   业务日志（mall-business）：`com.macro.mall`包下的所有DEBUG级别以上日志；
*   记录日志（mall-record）：`com.macro.mall.tiny.component.WebLogAspect`类下所有DEBUG级别以上日志，该类是统计接口访问信息的AOP切面类。

启动应用
----

> 首先得把mall项目的三个应用启动起来，通过`--link logstash:logstash`连接到Logstash。

### mall-admin

```bash
docker run -p 8080:8080 --name mall-admin \
--link mysql:db \
--link redis:redis \
--link logstash:logstash \
-v /etc/localtime:/etc/localtime \
-v /mydata/app/admin/logs:/var/logs \
-d mall/mall-admin:1.0-SNAPSHOT
```

### mall-portal

```bash
docker run -p 8085:8085 --name mall-portal \
--link mysql:db \
--link redis:redis \
--link mongo:mongo \
--link rabbitmq:rabbit \
--link logstash:logstash \
-v /etc/localtime:/etc/localtime \
-v /mydata/app/portal/logs:/var/logs \
-d mall/mall-portal:1.0-SNAPSHOT
```

### mall-search

```bash
docker run -p 8081:8081 --name mall-search \
--link elasticsearch:es \
--link mysql:db \
--link logstash:logstash \
-v /etc/localtime:/etc/localtime \
-v /mydata/app/search/logs:/var/logs \
-d mall/mall-search:1.0-SNAPSHOT
```

### 其他组件

其他组件如MySQL和Redis的部署不再赘述，想部署全套的小伙伴可以参考部署文档。

> [www.macrozheng.com/mall/deploy…](https://link.juejin.cn?target=https%3A%2F%2Fwww.macrozheng.com%2Fmall%2Fdeploy%2Fmall_deploy_docker.html "https://www.macrozheng.com/mall/deploy/mall_deploy_docker.html")

可视化日志分析
-------

> 接下来我们体验下Kibana的可视化日志分析功能，以mall项目为例，确实很强大！

### 创建索引匹配模式

*   首先我们需要打开Kibana的`Stack管理`功能；

![](/images/jueJin/e22f6c105ed64d7.png)

*   为Kibana创建`索引匹配模式`；

![](/images/jueJin/4acdd918995e485.png)

*   大家可以看到我们之前创建的四种日志分类已经在ES中创建了索引，后缀为产生索引的日期；

![](/images/jueJin/34a0ed71ed19469.png)

*   我们需要通过表达式来匹配对应的索引，先创建`mall-debug`的索引匹配模式；

![](/images/jueJin/070480e993df4ec.png)

*   然后再创建`mall-error`、`mall-business`和`mall-record`的索引匹配模式；

![](/images/jueJin/083621ef793f4b5.png)

*   接下来打开分析中的`发现`功能，就可以看到应用中产生的日志信息了。

![](/images/jueJin/bf4496dc0b6449d.png)

### 日志分析

*   我们先来聊聊`mall-debug`日志，这类日志是最全的日志，可用于测试环境调试使用，当我们有多个服务同时产生日志时，我们可以通过过滤器来过滤出对应服务的日志；

![](/images/jueJin/78f7580758634ea.png)

*   当然你也可以使用Kibana的专用查询语句KQL来过滤；

![](/images/jueJin/8a8e8571f13a422.png)

*   还可以实现模糊查询，比如查询下`message`中包含`分页`的日志，查询速度确实很快；

![](/images/jueJin/3a782eee13cb4b7.png)

*   通过`mall-error`日志可以快速获取应用的报错信息，准确定位问题，例如把Redis服务给停了，这里就输出了日志；

![](/images/jueJin/10eb87a9f1904b2.png)

*   通过`mall-business`日志可以查看`com.macro.mall`包下的所有DEBUG级别以上日志，通过这个日志我们可以方便地查看调用接口时输出的SQL语句；

![](/images/jueJin/6fe0b6730a4e41b.png)

*   通过`mall-record`日志可以方便地查看接口请求情况，包括请求路径、参数、返回结果和耗时等信息，哪个接口访问慢一目了然；

![](/images/jueJin/62fa70f0427545d.png)

总结
--

今天给大家分享了下mall项目中的日志收集解决方案以及如何通过Kibana来进行日志分析，对比直接去服务器上用命令行看日志，确实方便多了。而且Kibana还可以对不同服务产生的日志进行聚合，同时支持全文搜索，确实功能很强大。

参考资料
----

关于如何自定义SpringBoot中的日志收集机制可以参考下[你居然还去服务器上捞日志，搭个日志收集系统难道不香么！](https://juejin.cn/post/6844904196672585741 "https://juejin.cn/post/6844904196672585741")

如果你需要对日志进行安全保护的话可以参考下[居然有人想白嫖我的日志，赶紧开启安全保护压压惊！](https://juejin.cn/post/6865462161486184456 "https://juejin.cn/post/6865462161486184456")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")