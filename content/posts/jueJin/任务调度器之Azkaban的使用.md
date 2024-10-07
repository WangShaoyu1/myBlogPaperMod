---
author: "CodeDevMaster"
title: "任务调度器之Azkaban的使用"
date: 2022-06-28
description: "Azkaban是一个批量工作流任务调度器。用于在一个工作流内以一个特定的顺序运行一组工作和流程。在大数据领域中，用于运行Hadoop作业。"
tags: ["Hadoop","Java"]
ShowReadingTime: "阅读5分钟"
weight: 660
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第33天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

Azkaban概述
=========

> Azkaban是由Linkedin开源的一个批量工作流任务调度器。用于在一个工作流内以一个特定的顺序运行一组工作和流程。

> Azkaban定义了一种KV文件(properties)格式来建立任务之间的依赖关系，并提供一个易于使用的web用户界面维护和跟踪你的工作流。

官网 : `https://azkaban.github.io/`

安装Azkaban
=========

下载

bash

 代码解读

复制代码

`wget https://github.com/azkaban/azkaban/archive/refs/tags/3.73.0.tar.gz tar -zxvf 3.73.0.tar.gz  mv azkaban-3.73.0  azkaban-src`

安装Git

bash

 代码解读

复制代码

`yum ‐y install git yum ‐y install gcc‐c++ [root@administrator program]# git version git version 1.8.3.1`

修改azkaban-src目录下的build.gradle文件，修改allprojects节点配置，指定仓库地址为阿里云仓库

bash

 代码解读

复制代码

`allprojects {     apply plugin: 'jacoco'     repositories {        maven {     	  	url 'https://maven.aliyun.com/repository/public/'    	 }     mavenLocal()     mavenCentral()     } }`

开始编译、安装并跳过测试阶段

bash

 代码解读

复制代码

 `cd azkaban/   ./gradlew  build installDist -x test`

最后编译成功

bash

 代码解读

复制代码

`BUILD SUCCESSFUL in 4m 52s 82 actionable tasks: 76 executed, 6 from cache`

编译后得到以下文件

bash

 代码解读

复制代码

`# azkaban-web-server页面显示服务 [root@administrator azkaban-src]# ls azkaban-web-server/build/distributions/ azkaban-web-server-0.1.0-SNAPSHOT.tar.gz  azkaban-web-server-0.1.0-SNAPSHOT.zip # azkaban-solo-server [root@administrator azkaban-src]# ls azkaban-solo-server/build/distributions/ azkaban-solo-server-0.1.0-SNAPSHOT.tar.gz  azkaban-solo-server-0.1.0-SNAPSHOT.zip #  azkaban-exec-server任务执行服务 [root@administrator azkaban-src]# ls azkaban-exec-server/build/distributions/ azkaban-exec-server-0.1.0-SNAPSHOT.tar.gz  azkaban-exec-server-0.1.0-SNAPSHOT.zip # two server模式需要的C程序 [root@administrator azkaban-src]# ls az-exec-util/src/main/c execute-as-user.c # 数据库脚本 [root@administrator azkaban-src]# ll azkaban-db/build/install/azkaban-db/ 总用量 112 -rw-r--r-- 1 root root 12022 3月  12 13:33 create-all-sql-0.1.0-SNAPSHOT.sql`

单服务模式
=====

> Azkaban的单服务模式使用的是一个单节点模式来进行启动服务，只需要启动安装包即可，所有数据保存在H2内存中。

准备
--

vbscript

 代码解读

复制代码

`azkaban-solo-server-0.1.0-SNAPSHOT.tar.gz`

解压
--

解压`azkaban-solo-server-0.1.0-SNAPSHOT.tar.gz`

bash

 代码解读

复制代码

`tar -zxvf  azkaban-solo-server/build/distributions/azkaban-solo-server-0.1.0-SNAPSHOT.tar.gz -C ../azkaban [root@administrator azkaban]# ls azkaban-solo-server-0.1.0-SNAPSHOT`

安装
--

修改`vim azkaban-solo-server-0.1.0-SNAPSHOT/conf/azkaban.properties`文件，保证与Linxu服务器时区一致

bash

 代码解读

复制代码

`#default.timezone.id=America/Los_Angeles  default.timezone.id=Asia/Shanghai`

修改`vim azkaban-solo-server-0.1.0-SNAPSHOT/plugins/jobtypes/commonprivate.properties`文件

bash

 代码解读

复制代码

`# set execute-as-user execute.as.user=false # Azkaban对内存要求高，关闭内存检查 memCheck.enabled=false`

启动solo-server
-------------

bash

 代码解读

复制代码

 `cd azkaban-solo-server-0.1.0-SNAPSHOT/    bin/start-solo.sh [root@administrator azkaban-solo-server-0.1.0-SNAPSHOT]# jps 22563 AzkabanSingleServer`

访问Web
-----

浏览器访问：`IP：8081`![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17724b70e712439781a6853fc707012b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 登陆，用户名与密码：azkaban![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/863602e24d0c4a62845b3236e789be41~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

使用
--

创建 Job 描述文件 `vim test.job`

bash

 代码解读

复制代码

`type=command command=echo "hello world"`

创建一个项目 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c2bf3960f07420193cf8ab65a0205a9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 将`test.job`job资源文件打包成`test.zip`zip文件，并上传 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ad31254ca4f4a7187e50da6b6f10a90~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 启动执行job ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96414b38bcf24de380273d0f61e58770~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1e01da9a28c4d95856b744b25b7aeb0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a35214e947d94a5bb4e1f8fcbf9763be~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b15c7e4be7eb4cb080e127f9f24c9270~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

两个服务器模式
=======

准备
--

sql

 代码解读

复制代码

`azkaban-web-server-0.1.0-SNAPSHOT.tar.gz azkaban-exec-server-0.1.0-SNAPSHOT.tar.gz create-all-sql-0.1.0-SNAPSHOT.sql execute-as-user.c`

初始化数据库
------

bash

 代码解读

复制代码

`CREATE DATABASE azkaban; CREATE USER 'azkaban'@'%' IDENTIFIED BY 'azkaban'; GRANT all privileges ON azkaban.* to 'azkaban'@'%' identified by 'azkaban' WITH GRANT OPTION; flush privileges; use azkaban; source /usr/local/program/azkaban-src/azkaban-db/build/install/azkaban-db/create-all-sql-0.1.0-SNAPSHOT.sql`

解压
--

bash

 代码解读

复制代码

`tar -zxvf  azkaban-web-server/build/distributions/azkaban-web-server-0.1.0-SNAPSHOT.tar.gz   -C ../azkaban tar -zxvf  azkaban-exec-server/build/distributions/azkaban-exec-server-0.1.0-SNAPSHOT.tar.gz  -C ../azkaban [root@administrator azkaban]# ls azkaban-exec-server-0.1.0-SNAPSHOT  azkaban-solo-server-0.1.0-SNAPSHOT  azkaban-web-server-0.1.0-SNAPSHOT`

安装SSL安全认证
---------

> 安装SSL安全认证，允许使用https的方式访问azkaban的web服务

bash

 代码解读

复制代码

`[root@administrator azkaban]# keytool -keystore keystore -alias keyalias -genkey -keyalg RSA 输入密钥库口令:   再次输入新口令:  您的名字与姓氏是什么?   [Unknown]:   您的组织单位名称是什么?   [Unknown]:   您的组织名称是什么?   [Unknown]:   您所在的城市或区域名称是什么?   [Unknown]:   您所在的省/市/自治区名称是什么?   [Unknown]:   该单位的双字母国家/地区代码是什么?   [Unknown]:   CN=Unknown, OU=Unknown, O=Unknown, L=Unknown, ST=Unknown, C=Unknown是否正确?   [否]:  y 输入 <keyalias> 的密钥口令         (如果和密钥库口令相同, 按回车):   Warning: JKS 密钥库使用专用格式。建议使用 "keytool -importkeystore -srckeystore keystore -destkeystore keystore -deststoretype pkcs12" 迁移到行业标准格式 PKCS12。 [root@administrator azkaban]# ls azkaban-exec-server-0.1.0-SNAPSHOT  azkaban-solo-server-0.1.0-SNAPSHOT  azkaban-web-server-0.1.0-SNAPSHOT  keystore`

安装Azkaban Web Server
--------------------

安装`azkaban web server`，进入`cd azkaban-web-server-0.1.0-SNAPSHOT/conf`编辑 `vim azkaban.properties`

bash

 代码解读

复制代码

`#default.timezone.id=America/Los_Angeles  default.timezone.id=Asia/Shanghai #jetty.use.ssl=false jetty.use.ssl=true # ssl配置 jetty.ssl.port=8443 jetty.keystore=/usr/local/program/azkaban/keystore jetty.password=azkaban jetty.keypassword=azkaban jetty.truststore=/usr/local/program/azkaban/keystore jetty.trustpassword=azkaban # Azkaban mysql settings by default. Users should configure their own username and password. database.type=mysql mysql.port=3306 mysql.host=localhost mysql.database=azkaban mysql.user=azkaban mysql.password=azkaban mysql.numconnections=100 azkaban.executorselector.filters=StaticRemainingFlowSize,MinimumFreeMemory,CpuStatus #azkaban.executorselector.filters=StaticRemainingFlowSize,MinimumFreeMemory,CpuStatus azkaban.activeexecutor.refresh.milisecinterval=10000 azkaban.queueprocessing.enabled=true azkaban.activeexecutor.refresh.flowinterval=10 azkaban.executorinfo.refresh.maxThreads=10`

安装Azkaban Executor Server
-------------------------

安装`azkaban executor server`，进入`cd azkaban-exec-server-0.1.0-SNAPSHOT/conf`编辑`vim azkaban.properties`

bash

 代码解读

复制代码

`#default.timezone.id=America/Los_Angeles  default.timezone.id=Asia/Shanghai #jetty.use.ssl=false jetty.use.ssl=true # ssl配置 jetty.ssl.port=8443 jetty.keystore=/usr/local/program/azkaban/keystore jetty.password=azkaban jetty.keypassword=azkaban jetty.truststore=/usr/local/program/azkaban/keystore jetty.trustpassword=azkaban # Where the Azkaban web server is located #azkaban.webserver.url=http://localhost:8081 azkaban.webserver.url=http://localhost:8443 # Azkaban mysql settings by default. Users should configure their own username and password. database.type=mysql mysql.port=3306 mysql.host=localhost mysql.database=azkaban mysql.user=azkaban mysql.password=azkaban mysql.numconnections=100`

**添加插件**

> 将编译后的C文件execute-as-user.c拷贝到azkaban-exec-server-0.1.0-SNAPSHOT/plugins/jobtypes目录

bash

 代码解读

复制代码

`cp az-exec-util/src/main/c/execute-as-user.c /usr/local/program/azkaban/azkaban-exec-server-0.1.0-SNAPSHOT/plugins/jobtypes`

生成execute-as-user

bash

 代码解读

复制代码

`cd azkaban-exec-server-0.1.0-SNAPSHOT/plugins/jobtypes [root@administrator jobtypes]# yum -y install gcc-c++ [root@administrator jobtypes]# gcc execute-as-user.c  -o execute-as-user [root@administrator jobtypes]# ls commonprivate.properties  execute-as-user  execute-as-user.c [root@administrator jobtypes]# chown root execute‐as‐user [root@administrator jobtypes]# chmod 6050 execute-as-user [root@administrator jobtypes]# ll 总用量 24 -rw-rw-r-- 1 root root    44 5月  31 2019 commonprivate.properties ---Sr-s--- 1 root root 13536 3月  12 15:33 execute-as-user -rw-r--r-- 1 root root  3976 3月  12 15:30 execute-as-user.c`

修改配置文件

bash

 代码解读

复制代码

`vim commonprivate.properties  # set execute-as-user execute.as.user=false # 关闭内存检测 memCheck.enabled=false # 指定插件存放目录 azkaban.native.lib=/usr/local/program/azkaban/azkaban-exec-server-0.1.0-SNAPSHOT/plugins/jobtypes`

启动服务
----

启动`azkaban exec server`

bash

 代码解读

复制代码

`cd azkaban-exec-server-0.1.0-SNAPSHOT bin/start-exec.sh  [root@administrator azkaban-src]# jps 24655 AzkabanExecutorServer # 当azkaban-exec-server-0.1.0-SNAPSHOT目录下出现executor.port文件，说明启动成功 [root@administrator azkaban-exec-server-0.1.0-SNAPSHOT]# ls bin  conf  currentpid  executions  executor.port  executorServerLog__2022-03-12+15:57:50.out  lib  logs  plugins  projects  temp`

激活`exec-server`

bash

 代码解读

复制代码

`[root@administrator azkaban-exec-server-0.1.0-SNAPSHOT]# curl -G "node01:$(<./executor.port)/executor?action=activate" && echo {"status":"success"}`

启动`azkaban-web-server`

bash

 代码解读

复制代码

`cd azkaban-web-server-0.1.0-SNAPSHOT/ bin/start-web.sh  [root@administrator azkaban-src]# jps 11146 AzkabanWebServer`

访问Web
-----

浏览器访问`IP:8443` ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7162ed73aa224720bd5dc36b7b57d3a8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

注意：`放行端口or关闭防火墙`

bash

 代码解读

复制代码

`systemctl stop firewalld.service`

使用测试
----

将`单服务模式下的Job资源上传进行测试` ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d5faf9264dc457fb3dfb0e0263b0a90~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

任务提交与执行
=======

Command类型
---------

**1.单一Job的使用**

python

 代码解读

复制代码

`1.创建 Job 描述文件 2.将job资源文件打包成zip文件 3.创建工程并上传zip压缩包 4.启动工作流flow，执行job`

创建 Job 描述文件 `vim test.job`

bash

 代码解读

复制代码

`type=command command=echo "hello world"`

**2.多Job的使用**

python

 代码解读

复制代码

`1.创建有依赖关系的多个job描述 2.将所有job资源文件打到一个zip包中 3.创建工程并上传zip压缩包 4.启动工作流flow，执行job`

创建 Job 描述文件 `vim test1.job`

bash

 代码解读

复制代码

`type=command command=echo "test1 hello world"`

创建 Job 描述文件 `vim test2.job`

bash

 代码解读

复制代码

`type=command command=echo "test2 hello world" dependencies=test1`

上传后执行时显示依赖关系 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c548754726a44c0ba40122d78bfd548c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 执行过程与结果 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ea04d353e0c40dda9a5ba0e8a7d4d40~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

定时任务
----

> Azkaban的scheduler功能可以实现对作业任务进行定时调度功能 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4e9883b84324d75a96fde3d29ec6cd6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed574ba9bf66451ba31ba9316c111104~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

HDFS操作任务
--------

python

 代码解读

复制代码

`1.创建job描述文件 2.将job资源文件打包成zip文件 3.创建project并上传job压缩包 4.启动执行该job`

`vim hdfs.job`

bash

 代码解读

复制代码

`type=command command=/usr/local/program/hadoop/bin/hdfs dfs -mkdir /azkaban`

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0b6dc763eba4eb0948f587c1ea87f30~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

执行后查看HDFS

bash

 代码解读

复制代码

`[root@administrator hadoop]# hdfs dfs -ls / Found 6 items drwxr-xr-x   - root supergroup          0 2022-03-12 18:37 /azkaban`

MapReduce任务
-----------

1.下载`/usr/local/program/hadoop/share/hadoop/mapreduce/hadoop-mapreduce-examples-3.3.2.jar`文件

2.创建job描述文件 `vim mr.job`

bash

 代码解读

复制代码

`type=command command=/usr/local/program/hadoop/bin/hadoop jar hadoop-mapreduce-examples-3.3.2.jar pi 3 5`

3.将所有job资源文件( `vim mr.job`、`hadoop-mapreduce-examples-3.3.2.jar`)打到一个zip压缩包中

4.创建工程并上传zip包，启动job ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d95f12dd97d8430c8df81af9720a018e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

Hive 脚本任务
---------

1.准备Hive脚本： `hive.sql`

bash

 代码解读

复制代码

`create database if not exists dbazkaban; use dbazkaban; create table if not exists tbazkaban(id string,name string) row format delimited fields terminated by '\t';`

2.创建job描述文件 `hive.job`

bash

 代码解读

复制代码

`type=command command=/usr/local/program/hive/bin/hive -f 'hive.sql'`

3.将所有job资源文件打到一个zip包中

4.创建工程并上传zip包，启动job ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6aea6e3f3c34166aa1d7ab8a80bb0de~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)