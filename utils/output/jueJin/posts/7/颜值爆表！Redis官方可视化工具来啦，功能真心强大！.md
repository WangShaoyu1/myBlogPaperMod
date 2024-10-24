---
author: "MacroZheng"
title: "颜值爆表！Redis官方可视化工具来啦，功能真心强大！"
date: 2022-03-08
description: "最近逛了一下Redis官方网站，发现Redis不仅推出了很多新特性，而且还发布了一款可视化工具。试用了一下感觉非常不错，最关键的是能支持RedisJSON之类的新特性，推荐给大家！"
tags: ["后端","Java","Redis中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:506,comments:0,collects:1200,views:92618,"
---
> 最近逛了一下Redis官方网站，发现Redis不仅推出了很多新特性，而且还发布了一款可视化工具`RedisInsight`。试用了一下感觉非常不错，最关键的是能支持RedisJSON之类的新特性，这是第三方工具无法比拟的。今天带大家体验一下`RedisInsight`，确实非常好用！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

RedisInsight简介
--------------

RedisInsight是Redis官方出品的可视化管理工具，可用于设计、开发、优化你的Redis应用。支持深色和浅色两种主题，界面非常炫酷！可支持String、Hash、Set、List、JSON等多种数据类型的管理，同时支持远程使用CLI功能，功能非常强大！

下面是RedisInsight的一张使用效果图，颜值不错！

![](/images/jueJin/5025c0d91b0e44d.png)

RedisMod简介
----------

Redis经过多年发展，早已不仅仅是一个内存数据库了。有了RedisMod的支持，Redis的功能将变得非常强大。RedisMod中包含了如下增强模块：

*   RediSearch：一个功能齐全的搜索引擎；
*   RedisJSON：对JSON类型的原生支持；
*   RedisTimeSeries：时序数据库支持；
*   RedisGraph：图数据库支持；
*   RedisBloom：概率性数据的原生支持；
*   RedisGears：可编程的数据处理；
*   RedisAI：机器学习的实时模型管理和部署。

安装
--

> 首先我们将使用Docker来安装Redis，注意下载Redis的完全体版本RedisMod，它是内置了所有模块的增强版Redis！

*   使用如下命令下载RedisMod的镜像；

```bash
docker pull redislabs/redismod:preview
```

*   在容器中运行RedisMod服务。

```bash
docker run -p 6379:6379 --name redismod \
-v /mydata/redismod/data:/data \
-d redislabs/redismod:preview
```

使用
--

> Redis服务安装完毕，接下来我们就使用RedisInsight来管理下它试试！

### 基本使用

*   首先下载RedisInsight的安装包，下载地址：[redis.com/redis-enter…](https://link.juejin.cn?target=https%3A%2F%2Fredis.com%2Fredis-enterprise%2Fredis-insight%2F "https://redis.com/redis-enterprise/redis-insight/")

![](/images/jueJin/63b45161a27d467.png)

*   下载完成后直接安装即可，安装完成后在主界面选择`添加Redis数据库`；

![](/images/jueJin/5dbd473ef114401.png)

*   选择`手动添加数据库`，输入Redis服务连接信息即可；

![](/images/jueJin/677e7a6615b74fc.png)

*   打开连接后即可管理Redis，右上角会显示已经安装的Redis增强模块；

![](/images/jueJin/544501911050427.png)

*   接下来我们就可以通过RedisInsight在Redis中添加键值对数据了，比如添加`String`类型键值对；

![](/images/jueJin/84c259e23d8e414.png)

*   添加Hash类型，编辑的时候可以单个属性编辑，还是挺方便的；

![](/images/jueJin/d65c04e202764b0.png)

*   添加List类型，编辑的时候可以直接Push元素进去；

![](/images/jueJin/6dc89a59e3f34b2.png)

*   添加JSON类型，安装RedisJSON模块后可支持；

![](/images/jueJin/1262efce0099419.png)

*   对原生JSON类型，不仅支持高亮预览，还能支持新增、编辑和删除单个属性，够方便！

![](/images/jueJin/bd25eb1668394e6.png)

*   另外RedisInsight还支持深色和浅色两种主题切换，在设置中即可更改。

![](/images/jueJin/a8ff30073c854c2.png)

### CLI

*   如果RedisInsight的图形化界面功能满足不了你的话，还可以试试它的`CLI`功能，点击左下角CLI标签即可打开；

![](/images/jueJin/ec9075bf9a4d470.png)

*   贴心的Redis官方怕你记不住命令，还添加了`Command Helper`这个查找命令文档的功能，比如我们可以搜索下`hget`这个命令的用法。

![](/images/jueJin/af4bb5a6553a4e5.png)

### Profiler

通过Profiler功能，我们可以查看Redis的命令执行日志，比如我们使用RedisInsight添加一个叫`testKey`的键值对，Profiler将显示如下日志。

![](/images/jueJin/a25d01d614494a8.png)

可视化监控
-----

> RedisInsight的Redis监控功能比较简单，个人比较喜欢使用Grafana来监控Redis，Grafana的具体使用可以参考[Grafana使用教程](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FF392WVfVlqBNlUQVtQUn8A "https://mp.weixin.qq.com/s/F392WVfVlqBNlUQVtQUn8A") 。

安装Grafana
---------

*   首先下载Grafana的Docker镜像；

```bash
docker pull grafana/grafana
```

*   下载完成后运行Grafana；

```bash
docker run -p 3000:3000 --name grafana \
-d grafana/grafana
```

*   接下来下载Prometheus的Docker镜像；

```bash
docker pull prom/prometheus
```

*   在`/mydata/prometheus/`目录下创建Prometheus的配置文件`prometheus.yml`：

```yaml
global:
scrape_interval: 5s
```

*   运行Prometheus，把宿主机中的配置文件`prometheus.yml`挂载到容器中去；

```bash
docker run -p 9090:9090 --name prometheus \
-v /mydata/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml \
-d prom/prometheus
```

*   进入grafana容器并安装`redis-datasource`插件，安装完成后需要重启grafana服务。

```bash
docker exec -it grafana /bin/bash
grafana-cli plugins install redis-datasource
```

### 使用

*   连接到redismod需要使用到它的容器IP地址，使用如下命令查看redismod容器的IP地址；

![](/images/jueJin/694ab65c3e084e9.png)

*   在Grafana中配置好Redis数据源，使用`admin:admin`账户登录，访问地址；[http://192.168.3.105:3000/](https://link.juejin.cn?target=http%3A%2F%2F192.168.3.105%3A3000%2F "http://192.168.3.105:3000/")

![](/images/jueJin/82b5d2c08e024ac.png)

*   配置Redis地址信息，注意使用redismod的容器IP地址；

![](/images/jueJin/999db2d961494f8.png)

*   打开Dashboard选择Redis；

![](/images/jueJin/0e0aa7b96e2442f.png)

*   接下来就可以看到一个非常完善的Redis监控仪表盘了，基本能满足Redis的监控需求。

![](/images/jueJin/1f4693e2f9fb46a.png)

总结
--

RedisInsight不愧是官方出品的可视化工具，感觉是目前用起来体验最好的Redis工具了！特别是对Redis新特性的支持，其他工具是无法比拟的！不过对Redis的监控功能确实有点简单，还是得用专业的监控工具Grafana来监控Redis！

如果你想了解更多Redis实战技巧的话，可以试试这个带全套教程的实战项目（50K+Star）：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

参考资料
----

> 感觉Redis的官方文档做的特别良心，强烈建议大家看下！

![](/images/jueJin/2cb3ea3fca3143e.png)

官方文档：[developer.redis.com/explore/red…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.redis.com%2Fexplore%2Fredisinsightv2 "https://developer.redis.com/explore/redisinsightv2")