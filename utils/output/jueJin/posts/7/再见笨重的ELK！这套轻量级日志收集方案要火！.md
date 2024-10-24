---
author: "MacroZheng"
title: "再见笨重的ELK！这套轻量级日志收集方案要火！"
date: 2021-07-20
description: "之前一直使用的日志收集方案是ELK，动辄占用几个G的内存，有些配置不好的服务器有点顶不住！推荐一套轻量级日志收集方案： Loki+Promtail+Grafana（简称LPG）， 几百M内存就够了！"
tags: ["Java","后端","Elasticsearch中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:88,comments:23,collects:195,views:13289,"
---
> SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

之前一直使用的日志收集方案是ELK，动辄占用几个G的内存，有些配置不好的服务器有点顶不住！最近发现一套轻量级日志收集方案： Loki+Promtail+Grafana（简称LPG）， 几百M内存就够了，而且界面也挺不错的，推荐给大家！

简介
--

LPG日志收集方案内存占用很少，经济且高效！它不像ELK日志系统那样为日志建立索引，而是为每个日志流设置一组标签。下面分别介绍下它的核心组件：

*   Promtail：日志收集器，有点像Filebeat，可以收集日志文件中的日志，并把收集到的数据推送到Loki中去。
*   Loki：聚合并存储日志数据，可以作为Grafana的数据源，为Grafana提供可视化数据。
*   Grafana：从Loki中获取日志信息，进行可视化展示。

![日志收集流程图](/images/jueJin/loki_start_06.j.png)

安装
--

> 实现这套日志收集方案需要安装Loki、Promtail、Grafana这些服务，直接使用`docker-compose`来安装非常方便。

*   使用的`docker-compose.yml`脚本如下，直接使用`docker-compose`命令运行即可；

```yaml
version: "3"

services:
# 日志存储和解析
loki:
image: grafana/loki
container_name: lpg-loki
volumes:
- /mydata/loki/:/etc/loki/
# 修改loki默认配置文件路径
command: -config.file=/etc/loki/loki.yml
ports:
- 3100:3100

# 日志收集器
promtail:
image: grafana/promtail
container_name: lpg-promtail
volumes:
# 将需要收集的日志所在目录挂载到promtail容器中
- /mydata/app/mall-tiny-loki/logs/:/var/log/
- /mydata/promtail:/etc/promtail/
# 修改promtail默认配置文件路径
command: -config.file=/etc/promtail/promtail.yml

# 日志可视化
grafana:
image: grafana/grafana
container_name: lpg-grafana
ports:
- 3000:3000
```

*   由于我们把Loki和Promtail的配置文件挂载到了宿主机上，在运行之前，需要先准备好这两个配置文件；
    
*   Loki的配置文件`/mydata/loki/loki.yml`内容如下，使用的是默认配置（可以先不挂载配置文件运行Loki的Docker容器，然后从容器中拷贝出来即可）；
    

```yaml
auth_enabled: false

server:
http_listen_port: 3100

ingester:
lifecycler:
address: 127.0.0.1
ring:
kvstore:
store: inmemory
replication_factor: 1
final_sleep: 0s
chunk_idle_period: 1h       # Any chunk not receiving new logs in this time will be flushed
max_chunk_age: 1h           # All chunks will be flushed when they hit this age, default is 1h
chunk_target_size: 1048576  # Loki will attempt to build chunks up to 1.5MB, flushing first if chunk_idle_period or max_chunk_age is reached first
chunk_retain_period: 30s    # Must be greater than index read cache TTL if using an index cache (Default index read cache TTL is 5m)
max_transfer_retries: 0     # Chunk transfers disabled

schema_config:
configs:
- from: 2020-10-24
store: boltdb-shipper
object_store: filesystem
schema: v11
index:
prefix: index_
period: 24h

storage_config:
boltdb_shipper:
active_index_directory: /loki/boltdb-shipper-active
cache_location: /loki/boltdb-shipper-cache
cache_ttl: 24h         # Can be increased for faster performance over longer query periods, uses more disk space
shared_store: filesystem
filesystem:
directory: /loki/chunks

compactor:
working_directory: /loki/boltdb-shipper-compactor
shared_store: filesystem

limits_config:
reject_old_samples: true
reject_old_samples_max_age: 168h

chunk_store_config:
max_look_back_period: 0s

table_manager:
retention_deletes_enabled: false
retention_period: 0s

ruler:
storage:
type: local
local:
directory: /loki/rules
rule_path: /loki/rules-temp
alertmanager_url: http://localhost:9093
ring:
kvstore:
store: inmemory
enable_api: true
```

*   Promtail的配置文件`/mydata/loki/promtail.yml`内容如下，使用的也是默认配置，这里的`clients.url`需要注意下，由于我们使用的是`docker-compose`部署，所以可以将服务名称`loki`作为域名来访问Loki服务；

```yaml
server:
http_listen_port: 9080
grpc_listen_port: 0

positions:
filename: /tmp/positions.yaml

clients:
- url: http://loki:3100/loki/api/v1/push

scrape_configs:
- job_name: system
static_configs:
- targets:
- localhost
labels:
job: varlogs
__path__: /var/log/*log
```

*   运行`docker-compose.yml`脚本安装所有服务，使用如下命令即可；

```bash
docker-compose up -d
```

*   运行成功后，可以使用`docker ps |grep lpg`命令查看服务状态。

```bash
[root@local-linux lpg]# docker ps |grep lpg
64761b407423        grafana/loki                            "/usr/bin/loki -conf…"   3 minutes ago       Up 3 minutes        0.0.0.0:3100->3100/tcp                           lpg-loki
67f0f0912971        grafana/grafana                         "/run.sh"                3 minutes ago       Up 3 minutes        0.0.0.0:3000->3000/tcp                           lpg-grafana
f2d78eb188d1        grafana/promtail                        "/usr/bin/promtail -…"   3 minutes ago       Up 3 minutes                                                         lpg-promtail
```

使用
--

> 接下来我们将使用LPG日志收集系统来收集SpringBoot应用的日志，SpringBoot应用基本不用做特殊配置。

*   首先创建一个SpringBoot应用，修改配置文件`application.yml`，将日志输出到`/var/logs`目录下；

```yaml
spring:
application:
name: mall-tiny-loki

logging:
path: /var/logs
level:
com.macro.mall.tiny: debug
```

*   使用如下命令运行SpringBoot应用，并把日志目录挂载到宿主机上，这样Promtail就可以收集到日志了；

```bash
docker run -p 8088:8088 --name mall-tiny-loki \
-v /etc/localtime:/etc/localtime \
-v /mydata/app/mall-tiny-loki/logs:/var/logs \
-e TZ="Asia/Shanghai" \
-d mall-tiny/mall-tiny-loki:1.0-SNAPSHOT
```

*   运行成功后登录Grafana，账号密码为`admin:admin`，登录成功后需要添加Loki为数据源，访问地址：[http://192.168.7.149:3000/](https://link.juejin.cn?target=http%3A%2F%2F192.168.7.149%3A3000%2F "http://192.168.7.149:3000/")

![](/images/jueJin/loki_start_01.p.png)

*   在数据源选择界面中直接选择Loki，我们可以看到Grafana也支持使用Elasticsearch作为数据源；

![](/images/jueJin/loki_start_02.p.png)

*   之后设置下你的Loki访问地址，点击`Save&test`保存并测试，显示绿色提示信息表示设置成功，Loki访问地址：[http://192.168.7.149:3100](https://link.juejin.cn?target=http%3A%2F%2F192.168.7.149%3A3100 "http://192.168.7.149:3100")

![](/images/jueJin/loki_start_03.p.png)

*   接下来在`Explore`选择Loki，并输入查询表达式（Loki query）为`{filename="/var/log/spring.log"}`，就可以查看我们的SpringBoot应用输出的日志了。

![](/images/jueJin/loki_start_04.p.png)

总结
--

本文主要介绍了LPG日志系统的搭建及使用它收集SpringBoot应用的日志，LPG日志收集方案确实非常轻量级，性能也不错！不过如果你有对日志进行全文搜索的需求的话，还是得使用ELK系统。如果你对Grafana还不熟悉的话，可以参考下这篇文章[《号称下一代可视化监控系统，结合SpringBoot使用，贼爽！》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FF392WVfVlqBNlUQVtQUn8A "https://mp.weixin.qq.com/s/F392WVfVlqBNlUQVtQUn8A")。

参考资料
----

*   Loki官方文档：[grafana.com/docs/loki/l…](https://link.juejin.cn?target=https%3A%2F%2Fgrafana.com%2Fdocs%2Floki%2Flatest%2Foverview%2F "https://grafana.com/docs/loki/latest/overview/")
*   Promtail官方文档：[grafana.com/docs/loki/l…](https://link.juejin.cn?target=https%3A%2F%2Fgrafana.com%2Fdocs%2Floki%2Flatest%2Fclients%2Fpromtail%2F "https://grafana.com/docs/loki/latest/clients/promtail/")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-loki "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-loki")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！