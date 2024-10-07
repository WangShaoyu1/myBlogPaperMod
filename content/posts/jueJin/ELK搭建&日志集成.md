---
author: "柯苏远"
title: "ELK搭建&日志集成"
date: 2024-09-27
description: "ELK搭建&日志集成背景只是ELK的搭建和日志的简单集成，并不涉及高端知识，大佬请绕道……"
tags: ["后端","Java","程序员"]
ShowReadingTime: "阅读4分钟"
weight: 1023
---
ELK 搭建 & 日志集成
-------------

### 背景

> 突然想自己搭建一个ELK

**只是ELK的搭建和日志的简单集成，并不涉及高端知识，大佬请绕道**

### 环境

> CentoOS7

### 前置工作

> 前提要一个干净的环境。只需要一个正常可以访问的网络。如果你搭建环境已经包含前置工作中的必要内容，那么可以直接跳过。

#### 更换系统源

更换的原因是： 无法获取镜像列表。

##### 1\. **备份原有源文件**

bash

 代码解读

复制代码

`mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.bak`

##### 2\. **选择新的源**

以腾讯源为例，你可以下载腾讯的 CentOS 7 源配置文件：

bash

 代码解读

复制代码

`wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.cloud.tencent.com/repo/centos7_base.repo`

##### 3\. **更新 yum 缓存**

bash

 代码解读

复制代码

`yum makecache`

##### 4\. 更新系统软件包列表

bash

 代码解读

复制代码

   `sudo yum update`

#### **安装 net-tools 软件包**

原因： `ifconfig` 命令包含在 `net-tools` 软件包中。

bash

 代码解读

复制代码

`yum install net-tools`

#### 安装 vim 软件包

bash

 代码解读

复制代码

`sudo yum install vim`

#### 安装 telnet 软件包

bash

 代码解读

复制代码

`sudo yum install` 

#### 安装 lrzsz

“sz” 命令通常用于在 Linux 系统中通过串口或 SSH 连接将文件从服务器下载到本地。

bash

 代码解读

复制代码

`sudo yum install lrzsz`

#### 安装 wget

bash

 代码解读

复制代码

`sudo yum install wget`

#### 关闭防火墙

临时关闭：

bash

 代码解读

复制代码

   `systemctl stop firewalld.service`

永久关闭：

bash

 代码解读

复制代码

   `systemctl disable firewalld.service`

**先执行临时的再执行永久的，只执行永久的不好使，因为永久的要再下次开机才生效。**

#### 安装jdk 11环境

bash

 代码解读

复制代码

`sudo yum install -y java-11-openjdk-devel`

#### 根据端口号查找pid

bash

 代码解读

复制代码

`sudo netstat -tunlp | grep 7071`

#### 将服务器时间改成上海时间

##### 1\. 安装 `ntpdate` 工具

bash

 代码解读

复制代码

   `sudo yum install ntpdate`

##### 2\. 设置成上海时区

bash

 代码解读

复制代码

   `sudo timedatectl set-timezone Asia/Shanghai`

##### 3\. 同步时间

bash

 代码解读

复制代码

   `sudo ntpdate time.windows.com`

### CentOS 搭建ELK

> 到这里就可以开始真正的搭建ELK了

#### ELK的关系

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/b558556d2c8a40789ac66488de685f25~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5p-v6IuP6L-c:q75.awebp?rk3s=f64ab15b&x-expires=1728142352&x-signature=ZJVcoH850CufrTBCF1cyxHUQk%2B4%3D)

图是百度图片上找的，仅用于学习用途，侵权联系我，删。

#### 安装Elasticsearch

bash

 代码解读

复制代码

`# 这条命令的作用是导入 Elastic 软件库的 GPG 密钥。 # GPG 密钥用于验证软件包的完整性和来源的可靠性，确保您从可信的来源获取和安装软件。通过导入这个密钥，系统可# 以确认您即将安装的 Elastic 相关软件包是经过官方认证且未被篡改的。 sudo rpm --import https://artifacts.elastic.co/GPG-KEY-elasticsearch sudo vim /etc/yum.repos.d/elasticsearch.repo # 在文件中添加以下内容 [elasticsearch-7.x] name=Elasticsearch repository for 7.x packages baseurl=https://artifacts.elastic.co/packages/7.x/yum gpgcheck=1 gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch enabled=1 autorefresh=1 type=rpm-md ​ sudo yum install elasticsearch`

##### 修改 Elasticsearch 配置文件

bash

 代码解读

复制代码

`vim /etc/elasticsearch/elasticsearch.yml # 下面这些内容要对齐 cluster.name: my_elasticsearch_cluster # 自定义一个 node.name: node-1 network.host: 0.0.0.0 # 表示监听所有网络接口 http.port: 9200 discovery.seed_hosts: ["localhost:9200"] discovery.type: single-node #以单例es启动`

##### 启动 Elasticsearch 服务

bash

 代码解读

复制代码

`sudo systemctl start elasticsearch # 这个命令则是设置 Elasticsearch 服务在系统启动时自动启动 sudo systemctl enable elasticsearch`

正常启动之后可以访问：`http://localhost:9200`

#### 安装Logstash

bash

 代码解读

复制代码

`sudo rpm --import https://artifacts.elastic.co/GPG-KEY-elasticsearch sudo vim /etc/yum.repos.d/logstash.repo # 在文件中添加以下内容 [logstash-7.x] name=Logstash repository for 7.x packages baseurl=https://artifacts.elastic.co/packages/7.x/yum gpgcheck=1 gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch enabled=1 autorefresh=1 type=rpm-md sudo yum install logstash`

##### 创建logstash.conf配置文件

bash

 代码解读

复制代码

`touch /etc/logstash/conf.d/logstash.conf vim /etc/logstash/conf.d/logstash.conf`

带注释版本：

bash

 代码解读

复制代码

`input {  // 输入部分   file {  // 使用文件作为输入源     path => "/data/log/service/logs/app/*.log"  // 指定要读取的日志文件路径     type => "system_log"  // 为输入的日志定义一个类型标签   } } ​ filter {  // 过滤部分   if [type] == "system_log" {  // 如果输入的日志类型是"system_log"     grok {  // 使用 grok 插件进行解析       match => { "message" => "%{COMBINEDAPACHELOG}" }  // 尝试按照指定的模式解析"message"字段     }   } } ​ output {  // 输出部分   elasticsearch {  // 输出到 Elasticsearch     hosts => ["localhost:9200"]  // 指定 Elasticsearch 的主机和端口     index => "logstash-%{+YYYY.MM.dd}"  // 定义输出的索引名称，使用日期作为后缀   }   stdout { codec => rubydebug }  // 同时将处理结果输出到标准输出，使用 rubydebug 编码格式 }`

这个是直接粘贴的版本：

bash

 代码解读

复制代码

`input {  file {   path => "/data/log/service/logs/app/*.log"   type => "system_log"  } } filter {  if [type] == "system_log" {   grok {    match => { "message" => "%{COMBINEDAPACHELOG}" }   }  } } output {  elasticsearch {   hosts => ["localhost:9200"]   index => "logstash-%{+YYYY.MM.dd}"  }  stdout { codec => rubydebug } }`

##### 启动logstash服务

bash

 代码解读

复制代码

`sudo systemctl start logstash  sudo systemctl enable logstash`

是否正常启动去看日志，我的是在:`/var/log/logstash`。

#### 安装kibana

bash

 代码解读

复制代码

`sudo rpm --import https://artifacts.elastic.co/GPG-KEY-elasticsearch sudo vim /etc/yum.repos.d/kibana.repo # 在文件中添加以下内容 [kibana-7.x] name=Kibana repository for 7.x packages baseurl=https://artifacts.elastic.co/packages/7.x/yum gpgcheck=1 gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch enabled=1 autorefresh=1 type=rpm-md ​ sudo yum install kibana`

##### 修改kibana配置文件

bash

 代码解读

复制代码

`vim /etc/kibana/kibana.yml # 下面配置对齐 server.host: "0.0.0.0" elasticsearch.hosts: ["http://localhost:9200"] i18n.locale: "zh-CN"`

##### 启动kibana服务

bash

 代码解读

复制代码

`sudo systemctl start kibana sudo systemctl enable kibana`

正常启动之后可以访问：`http://localhost:5601`

##### kibana 创建索引模式

索引模式要和logstash里的`output`里对应的索引前缀相同。例如例子的应该对应的索引模式是：`logstash-*`.

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/6d627c7f4d18487f8fb0f7dcd2c16d8f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5p-v6IuP6L-c:q75.awebp?rk3s=f64ab15b&x-expires=1728142352&x-signature=2uSGy3oVuDU%2BBwNoTxyG%2FmE0GKg%3D)

### 微服务的日志集成

#### 集成微服务

这里对微服务没啥要求（随便放一个jar包运行一下就好了），唯一要求就是日志的输入文件（**在项目里的log4j.xml里配置的**）要和上面logstash中的input部分对应起来。

调用一下测试接口。

#### discover 查看日志

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/6ecd1bc405a74dd9bf6ce995a8bd0008~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5p-v6IuP6L-c:q75.awebp?rk3s=f64ab15b&x-expires=1728142352&x-signature=7h2st1qAM%2FqVWf10588Aogliq9A%3D)

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/8edddbfc21dc4c4b8d78c613cd788488~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5p-v6IuP6L-c:q75.awebp?rk3s=f64ab15b&x-expires=1728142352&x-signature=2s8mQz5ZA%2BzROcaiI0ZOHZODHk8%3D)

**我认为一个索引模式是匹配多个索引的，索引是根据logstash的out部分进行传给es的。**

索引页：

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/87be6090126e47b09bb303b93adbf945~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5p-v6IuP6L-c:q75.awebp?rk3s=f64ab15b&x-expires=1728142352&x-signature=2w9HkwLb5LI26k3g%2BMB7ZTP5PNo%3D)

### 总结

在centos7上成功搭建了ELK并且正常收集到了来自微服务的日志，以及通过kibana进行正常查询。

计划下一篇写日志和skywalking链路跟踪的集成。