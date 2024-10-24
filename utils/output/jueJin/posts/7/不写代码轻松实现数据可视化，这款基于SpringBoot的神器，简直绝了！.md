---
author: "MacroZheng"
title: "不写代码轻松实现数据可视化，这款基于SpringBoot的神器，简直绝了！"
date: 2022-01-05
description: "之前有读者问我有没有什么好用的BI工具？今天给大家推荐一款开源的数据可视化工具，基于SpringBoot实现，集成 Apache Doris + Kettle，可支持超大数据量秒级查询！"
tags: ["Java","Spring Boot","后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:156,comments:0,collects:444,views:28922,"
---
> 之前有读者问我有没有什么好用的BI（Business Intelligence）工具？BI工具简单来说就是一种数据可视化工具。今天给大家推荐一款开源的数据可视化工具`DataEase`，基于SpringBoot实现，集成 Apache Doris + Kettle，可支持超大数据量秒级查询，希望对大家有所帮助！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

简介
--

DataEase是一款号称`人人可用`的开源数据可视化分析工具，在Github上已经有4.1K+Star。致力于帮助用户快速分析数据并洞察业务趋势，从而实现业务的改进与优化。DataEase 支持丰富的数据源连接，能够通过拖拽方式快速制作图表，并可以分享给他人。

下面是一张由DataEase生成的可视化大屏，还是挺炫酷的。

![](/images/jueJin/f0a140777b554c4.png)

架构
--

> 作为一款数据可视化工具，DataEase使用了现阶段流行的大数据技术Apache Doris和Kettle，如果你想学习这两种技术的话，这个项目是个不错的选择。

### 系统架构

DataEase使用的技术栈如下：

技术

说明

SpringBoot

后端基础框架

MySQL

数据存储

Apache Doris

一个现代化的MPP分析型数据库产品。仅需亚秒级响应时间即可获得查询结果，有效地支持实时数据分析。

Kettle

一款开源的ETL（即数据抽取、转换、装载的过程）工具，纯Java编写，可以实现高效稳定的数据抽取。

Docker

容器化部署

Vue

前端基础框架

Element

前端UI框架

各种技术在DataEase中的使用场景如下：

![](/images/jueJin/025e8852137d40a.png)

### 功能架构

下面是DataEase的功能架构图，从中我们很容易看出使用DataEase我们能做什么。

![](/images/jueJin/0049011ffab5461.png)

安装
--

> DataEase提供了安装包，下载安装包，使用安装脚本`install.sh`即可完成安装，如果你的服务器`已经安装了MySQL`，需要一些额外的配置。

*   首先我们需要下载安装包，这里使用的是`v1.5.2`版本，下载地址：[github.com/dataease/da…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdataease%2Fdataease%2Freleases "https://github.com/dataease/dataease/releases")

![](/images/jueJin/20226860946c4eb.png)

*   下载完成后上传到Linux服务器，使用如下命令解压到指定目录；

```bash
tar -zxvf dataease-v1.5.2-online.tar.gz
```

*   解压完成后目录结构如下，注意`dataease`文件夹下有docker-compose部署脚本；

![](/images/jueJin/1e7cc29dab634b6.png)

*   接下来修改安装配置`install.conf`，主要修改服务运行端口`DE_PORT`和MySQL配置；

```ini
# 基础配置
## 安装目录
DE_BASE=/opt
## Service 端口（默认80，大概率冲突）
DE_PORT=8010

# 数据库配置
## 是否使用外部数据库
DE_EXTERNAL_MYSQL=false
## 数据库地址（默认mysql，之前如果用docker安装过mysql建议修改）
DE_MYSQL_HOST=mysql-de
## 数据库端口（默认3306，之前如果用docker安装过mysql建议修改）
DE_MYSQL_PORT=3307
## DataEase 数据库库名
DE_MYSQL_DB=dataease
## 数据库用户名
DE_MYSQL_USER=root
## 数据库密码
DE_MYSQL_PASSWORD=Password123@mysql
```

*   修改DataEase的docker-compose文件，路径为`dataease/docker-compose.yml`，修改MySQL依赖名称和网络配置，默认网络配置可能会引起冲突；

```yaml
services:

dataease:
image: registry.cn-qingdao.aliyuncs.com/dataease/dataease:v1.5.2
container_name: dataease
ports:
- ${DE_PORT}:8081
mem_limit: 4096m
volumes:
- ${DE_BASE}/dataease/conf:/opt/dataease/conf
- ${DE_BASE}/dataease/logs:/opt/dataease/logs
- ${DE_BASE}/dataease/plugins/thirdpart:/opt/dataease/plugins/thirdpart
- ${DE_BASE}/dataease/data/kettle:/opt/dataease/data/kettle
depends_on:
# 如果之前使用Docker安装过mysql，修改名称
mysql-de:
condition: service_healthy
networks:
- dataease-network

networks:
dataease-network:
driver: bridge
ipam:
driver: default
# 默认网段配置可能会冲突，建议修改
config:
- subnet: 172.33.0.0/16
gateway: 172.33.0.1
```

*   修改Doris的docker-compose文件，路径为`dataease/docker-compose-kettle-doris.yml`，主要修改网络配置；

```yaml
version: '2.1'
services:

doris-fe:
image: registry.cn-qingdao.aliyuncs.com/dataease/doris:0.15
container_name: doris-fe
networks:
# 修改为33网段防止冲突
dataease-network :
ipv4_address: 172.33.0.198
restart: always

doris-be:
image: registry.cn-qingdao.aliyuncs.com/dataease/doris:0.15
networks:
# 修改为33网段防止冲突
dataease-network :
ipv4_address: 172.33.0.199
restart: always
```

*   修改MySQL的docker-compose文件，路径为`dataease/docker-compose-mysql.yml`，只要修改容器名称即可；

```yaml
version: '2.1'
services:

mysql-de:
image: registry.cn-qingdao.aliyuncs.com/dataease/mysql:5.7.36
# 之前使用Docker安装过mysql，需要修改容器名称
container_name: mysql-de
env_file:
- ${DE_BASE}/dataease/conf/mysql.env
ports:
- ${DE_MYSQL_PORT}:3306
volumes:
- ${DE_BASE}/dataease/conf/my.cnf:/etc/mysql/conf.d/my.cnf
- ${DE_BASE}/dataease/bin/mysql:/docker-entrypoint-initdb.d/
- ${DE_BASE}/dataease/data/mysql:/var/lib/mysql
networks:
- dataease-network
```

*   如果你启用了firewall防火墙的话，还要开放下`8010`端口；

```bash
firewall-cmd --zone=public --add-port=8010/tcp --permanent
firewall-cmd --reload
```

*   一切准备就绪，直接运行安装目录下的`install.sh`文件进行安装；

```bash
./install.sh
```

*   安装过程涉及下载镜像，时间较长需要耐心等待，最终安装成功后显示如下；

```bash
➜  dataease-v1.5.2-online ./install.sh

Stopping doris-fe ... done
Stopping doris-be ... done
Stopping kettle   ... done
Removing doris-fe ... done
Removing doris-be ... done
Removing kettle   ... done
Removing network dataease_dataease-network
======================= 开始安装 =======================
[DATAEASE Log]: 拷贝配置文件模板文件  -> /opt/dataease/conf
[DATAEASE Log]: 根据安装配置参数调整配置文件
time: Wed Dec 22 10:59:39 CST 2021
/usr/sbin/getenforce
[DATAEASE Log]: 检测到 Docker 已安装，跳过安装步骤
[DATAEASE Log]: 启动 Docker
Redirecting to /bin/systemctl start docker.service
[DATAEASE Log]: 检测到 Docker Compose 已安装，跳过安装步骤
[DATAEASE Log]: 拉取镜像
Pulling doris-be ... done
Pulling kettle   ... done
Pulling mysql-de ... done
Pulling dataease ... done
Pulling doris-fe ... done
...省略若干日志
Name                Command                       State                         Ports
-----------------------------------------------------------------------------------------------------
dataease   /deployments/run-java.sh         Up (health: starting)   0.0.0.0:8010->8081/tcp
doris-be   /entrypoint.sh                   Up (healthy)
doris-fe   /entrypoint.sh                   Up (health: starting)
kettle     /opt/kettle/carte.sh kettl ...   Up
mysql-de   docker-entrypoint.sh mysqld      Up (healthy)            0.0.0.0:3306->3306/tcp, 33060/tcp
[DATAEASE Log]: 服务启动中，请稍候 ...
[DATAEASE Log]: 服务启动中，请稍候 ...
[DATAEASE Log]: 【警告】服务在等待时间内未完全启动！请稍后使用 dectl status 检查服务运行状况。
======================= 安装完成 =======================

请通过以下方式访问:
URL: http://$LOCAL_IP:8010
用户名: admin
初始密码: dataease
```

*   由于我们修改了MySQL的配置，还需修改安装目录`/opt`下的MySQL连接配置，文件路径为`/opt/dataease/conf/dataease.properties`，改为`mysql-de`；

```properties
# 数据库配置
spring.datasource.url=jdbc:mysql://mysql-de:3306/dataease?autoReconnect=false&useUnicode=true&characterEncoding=UTF-8&characterSetResults=UTF-8&zeroDateTimeBehavior=convertToNull&useSSL=false
```

*   然后重启`dataease`容器；

```bash
docker restart dataease
```

*   重启时使用`docker logs -f dataease`查看日志，当数据库导入完成后项目才算启动成功；

![](/images/jueJin/2ae27096989c4ce.png)

*   由于DateEase安装成功后会自动在系统中注册`dataease`服务，所以我们可以使用如下命令来操作它。

```bash
# 查看服务状态
systemctl status dataease
# 启动服务
systemctl start dataease
# 停止服务
systemctl stop dataease
```

使用
--

> 使用DataEase可以方便地实现数据可视化，接下来我们以Excel和MySQL中的数据为例，来体验下它的功能。

### 基本概念

> 在使用DataEase之前，我们得了解它的一些基本概念，这对使用它会很有帮助。

*   数据源：是后续数据分析的数据来源，指的是各种数据库连接信息，支持MySQL、Elasticsearch、MongoDB等常用数据源；
*   数据集：数据的集合，可以是Excel数据、数据库表数据、自定义SQL查询数据，是视图的数据来源；
*   视图：可视化展示的最小单元，是组成仪表板的基本元素，可以是折线图、柱状图、饼状图等；
*   仪表板： 可视化大屏，视图组合界面；
*   模板：可用来快速构建仪表板的数据及样式模板。

### Excel数据分析

> 下面我们将从Excel中获取数据，实现仪表板，来体验下DataEase的数据可视化功能。

*   DataEase启动成功后，使用账号`admin:dataease`即可登录，访问地址：[http://192.168.3.105:8010/](https://link.juejin.cn?target=http%3A%2F%2F192.168.3.105%3A8010%2F "http://192.168.3.105:8010/")

![](/images/jueJin/15d2c9e0f07747d.png)

*   由于我们之前修改了MySQL容器的名称，这里的`数据源`我们也要修改下；

![](/images/jueJin/4d750924a044430.png)

*   接下来我们需要创建一个`数据集`，使用官方的示例Excel即可，下载完成后可以打开看下，一份商品销售报表，下载地址：[dataease.io/docs/manual…](https://link.juejin.cn?target=https%3A%2F%2Fdataease.io%2Fdocs%2Fmanual_demo%2Fsales_dashboard.xlsx "https://dataease.io/docs/manual_demo/sales_dashboard.xlsx")

![](/images/jueJin/b2a94bc9f3d942d.png)

*   然后选择添加`数据集`；

![](/images/jueJin/d66305a7140349c.png)

*   新建时上传Excel，最后选择确认进行导入；

![](/images/jueJin/557cc666eef7410.png)

*   由于之前修改了Doris的网段，导入Excel数据会出现无法显示的情况，并弹出如下错误提示；

![](/images/jueJin/ba0bc2d4e9634e1.png)

*   进入`mysql-de`容器内部，输入如下命令即可解决；

```bash
# 进入内置 MySQL 容器内
docker exec -it mysql-de sh
# 进入 MySQL 容器后，连接 doris-fe
mysql -uroot -h doris-fe -P 9030
# 由于修改了doris的网段，此处也要修改
ALTER SYSTEM ADD BACKEND "172.33.0.199:9050";
SET PASSWORD FOR 'root' = PASSWORD('Password123@doris');
CREATE DATABASE dataease;
```

*   数据导入成功后，就可以开始创建`视图`了，选择我们刚刚导入的数据集；

![](/images/jueJin/c7b88a2736f2494.png)

*   再选择`视图`的类型，这里选择了表示分布的饼图；

![](/images/jueJin/a114890aebb84d5.png)

*   拖动选择维度和指标，再改改样式，最后再保存下，一张视图就完成了；

![](/images/jueJin/0babf6da3e7846b.png)

*   再多创建几个视图，然后就可以创建`仪表板`了，再通过拖拽编辑的形式，仪表板就完成了，是不是挺方便的！

![](/images/jueJin/5b099123dbcc4be.png)

### 数据库数据分析

> 当然DataEase也支持从数据库中导入数据，甚至可以自定义SQL查询，下面我们来体验下它的这些功能。

*   首先我们得新建一个数据源，可以选择各种类型数据源，支持还挺多的，这里选择MySQL；

![](/images/jueJin/80d2da2e4757464.png)

*   然后创建数据集，选择从数据库添加数据集；

![](/images/jueJin/bc362fc03508498.png)

*   再创建视图，使用上面创建的数据集即可；

![](/images/jueJin/745b819b4bba43c.png)

*   当然你也可以自定义SQL查询来添加数据集；

![](/images/jueJin/56c1f393f12a43a.png)

*   DataEase还有个比较强大的功能，可以设置各个视图直接根据某个字段进行`联动`，比如在官方示例中，我们选择了某个省份，其他视图的数据就变成了这个省份的了；

![](/images/jueJin/8151bcf546254c7.png)

*   还有个比较有意思的功能叫`下钻`，比如我们选择某个省份进行下钻，就可以查看该省份下的城市相关数据。

![](/images/jueJin/551866beb412460.png)

总结
--

总的来说，DataEase是一款非常不错的数据可视化工具。它可以让我们不写代码，就轻松实现一些数据可视化的需求，支持从各种数据源和Excel中分析数据。并且它使用了当下流行的大数据分析技术Apache Doris和Kettle，对这些技术感兴趣的朋友也可以尝试下它。

参考资料
----

*   项目地址：[github.com/dataease/da…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdataease%2Fdataease "https://github.com/dataease/dataease")
*   官方文档：[dataease.io/docs/](https://link.juejin.cn?target=https%3A%2F%2Fdataease.io%2Fdocs%2F "https://dataease.io/docs/")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！