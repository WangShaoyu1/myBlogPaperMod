---
author: "MacroZheng"
title: "号称下一代可视化监控系统，结合SpringBoot使用，贼爽！"
date: 2021-07-14
description: "当面对一个复杂的系统时，我们往往需要监控工具来帮助我们解决一些性能问题。今天给大家介绍一个功能强大的监控工具Grafana，只要需要用到监控的地方，用它做可视化就对了！"
tags: ["Java","Spring Boot","后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:85,comments:6,collects:177,views:11888,"
---
> SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

当面对一个复杂的系统时，我们往往需要监控工具来帮助我们解决一些性能问题。比如之前我们使用`SpringBoot Admin`来监控应用，从而获取到`SpringBoot Actuator`暴露的指标信息。今天给大家介绍一个功能强大的监控工具Grafana，只要需要用到监控的地方，用它做可视化就对了！

Grafana简介
---------

Grafana是一款开源的数据可视化和分析工具，不管你的指标信息存储在哪里，你都可以用它来可视化这些数据。同时它还具有告警功能，当指标超出指定范围时会提醒你。

Prometheus简介
------------

Prometheus是一款时序数据库，可以简单理解为带时间的MySQL数据库。由于Grafana只能将数据转换成可视化图表，并没有存储功能，所以我们需要结合Prometheus这类时序数据库一起使用。

安装
--

> 使用Docker安装Grafana和Prometheus无疑是最简单的，我们接下来将采用此种方式。

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

*   至此安装完成，是不是很简单！可以通过如下地址访问Grafana，登录账号密码为`admin:admin`，访问地址：[http://192.168.5.78:3000/](https://link.juejin.cn?target=http%3A%2F%2F192.168.5.78%3A3000%2F "http://192.168.5.78:3000/")

![](/images/jueJin/419de6039c9d437.png)

*   登录Grafana后显示界面如下；

![](/images/jueJin/c1e8b1ff194544c.png)

*   其实Prometheus也是有可视化界面的，就是有点简陋，访问地址：[http://192.168.5.78:9090/](https://link.juejin.cn?target=http%3A%2F%2F192.168.5.78%3A9090%2F "http://192.168.5.78:9090/")

![](/images/jueJin/893e55bec8a3419.png)

使用
--

> Grafana已经安装完后，是时候来波实践了，接下来我们来介绍下使用Grafana来监控Linux系统和SpringBoot应用。

### 监控系统信息

> 使用`node_explorer`可以暴露Linux系统的指标信息，然后Prometheus就可以通过定时扫描的方式获取并存储指标信息了。

*   下载`node_explorer`的安装包，下载地址：[prometheus.io/download/#n…](https://link.juejin.cn?target=https%3A%2F%2Fprometheus.io%2Fdownload%2F%23node_exporter "https://prometheus.io/download/#node_exporter")

![](/images/jueJin/ef613e7fb7fb414.png)

*   这次我们直接把`node_explorer`安装到Linux服务器上（如果使用Docker容器安装，监控的会是Docker容器的指标信息）,将下载的安装包解压到指定目录，并修改文件夹名称：

```bash
cd /mydata
tar -zxvf node_exporter-1.1.2.linux-amd64.tar.gz
mv node_exporter-1.1.2.linux-amd64 node_exporter
```

*   进入解压目录，使用如下命令运行`node_explorer`，服务将运行在`9100`端口上；

```bash
cd node_exporter
./node_exporter >log.file 2>&1 &
```

*   使用`curl`命令访问获取指标信息接口，获取到信息表示运行成功；

```bash
curl http://localhost:9100/metrics
``````bash
# HELP promhttp_metric_handler_requests_in_flight Current number of scrapes being served.
# TYPE promhttp_metric_handler_requests_in_flight gauge
promhttp_metric_handler_requests_in_flight 1
# HELP promhttp_metric_handler_requests_total Total number of scrapes by HTTP status code.
# TYPE promhttp_metric_handler_requests_total counter
promhttp_metric_handler_requests_total{code="200"} 2175
promhttp_metric_handler_requests_total{code="500"} 0
promhttp_metric_handler_requests_total{code="503"} 0
```

*   接下来修改Prometheus的配置文件`prometheus.yml`，创建一个任务定时扫描`node_explorer`暴露的指标信息；

```yaml
scrape_configs:
- job_name: node
static_configs:
- targets: ['192.168.5.78:9100']
```

*   重启Prometheus容器，可以通过`加号->Dashboard`来创建仪表盘；

![](/images/jueJin/ceae456a7ce04b2.png)

*   当然你还可以选择去Grafana的仪表盘市场下载一个Dashboard，市场地址：[grafana.com/grafana/das…](https://link.juejin.cn?target=https%3A%2F%2Fgrafana.com%2Fgrafana%2Fdashboards "https://grafana.com/grafana/dashboards")

![](/images/jueJin/0efe6c93006944c.png)

*   这里选择了`Node Exporter Full`这个仪表盘，记住它的ID，访问地址：[grafana.com/grafana/das…](https://link.juejin.cn?target=https%3A%2F%2Fgrafana.com%2Fgrafana%2Fdashboards%2F1860 "https://grafana.com/grafana/dashboards/1860")

![](/images/jueJin/266c52b985e842a.png)

*   选择导入Dashboard并输入ID，最后点击`Load`即可；

![](/images/jueJin/cd790d7c8c104a0.png)

*   选择数据源为Prometheus，最后点击`Import`；

![](/images/jueJin/9b3a379bdcb748a.png)

*   导入成功后就可以在Grafana中看到实时监控信息了，是不是够炫酷！

![](/images/jueJin/3804679f5aa34a0.png)

### 监控SpringBoot应用

> 监控SpringBoot应用需要依靠`actuator`及`micrometer`，通过暴露`actuator`的端点，Prometheus可以定时获取并存储指标信息。

*   修改项目的`pom.xml`文件，添加`actuator`及`micrometer`依赖；

```xml
<dependencies>
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<!-- 集成micrometer，将监控数据存储到prometheus -->
<dependency>
<groupId>io.micrometer</groupId>
<artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
</dependencies>
```

*   修改应用配置文件`application.yml`，通过`actuator`暴露监控端口`/actuator/prometheus`；

```yaml
management:
endpoints:
web:
exposure:
# 暴露端点`/actuator/prometheus`
include: 'prometheus'
metrics:
tags:
application: ${spring.application.name}
```

*   在监控SpringBoot应用之前，我们需要先运行一个SpringBoot应用，使用如下命令运行即可；

```bash
docker run -p 8088:8088 --name mall-tiny-grafana \
-v /etc/localtime:/etc/localtime \
-v /mydata/app/mall-tiny-grafana/logs:/var/logs \
-e TZ="Asia/Shanghai" \
-d mall-tiny/mall-tiny-grafana:1.0-SNAPSHOT
```

*   修改Prometheus的配置文件`prometheus.yml`，创建一个任务定时扫描`actuator`暴露的指标信息，这里需要注意下，由于SpringBoot应用运行在Docker容器中，需要使用`docker inspect mall-tiny-grafana |grep IPAddress`来获取容器IP地址；

```yaml
scrape_configs:
# 采集任务名称
- job_name: 'mall-tiny-grafana'
# 采集时间间隔
scrape_interval: 5s
# 采集超时时间
scrape_timeout: 10s
# 采集数据路径
metrics_path: '/actuator/prometheus'
# 采集服务的地址
static_configs:
- targets: ['172.17.0.5:8088']
```

*   我们可以通过Prometheus的可视化界面，来确定Prometheus是否能获取到指标信息；

![](/images/jueJin/a498aa2c7971470.png)

*   同样，我们可以从仪表盘市场导入仪表盘，访问地址：[grafana.com/grafana/das…](https://link.juejin.cn?target=https%3A%2F%2Fgrafana.com%2Fgrafana%2Fdashboards%2F14370 "https://grafana.com/grafana/dashboards/14370")

![](/images/jueJin/022661423f1b436.png)

*   导入成功后就可以在Grafana中看到SpringBoot实时监控信息了，果然够炫酷！

![](/images/jueJin/8ff6917b6ff346d.png)

总结
--

通过对Grafana的一波实践，我们可以发现，使用Grafana来进行数据可视化的过程是这样的：首先我们得让被监控方将指标信息暴露出来，然后用Prometheus定时获取并存储指标信息，最后将Prometheus配置为Grafana的可视化数据源。

参考资料
----

*   Grafana官方文档：[grafana.com/docs/grafan…](https://link.juejin.cn?target=https%3A%2F%2Fgrafana.com%2Fdocs%2Fgrafana%2Flatest%2Fgetting-started%2Fgetting-started-prometheus%2F "https://grafana.com/docs/grafana/latest/getting-started/getting-started-prometheus/")
*   node-exporter的使用：[prometheus.io/docs/guides…](https://link.juejin.cn?target=https%3A%2F%2Fprometheus.io%2Fdocs%2Fguides%2Fnode-exporter%2F "https://prometheus.io/docs/guides/node-exporter/")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-grafana "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-grafana")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！