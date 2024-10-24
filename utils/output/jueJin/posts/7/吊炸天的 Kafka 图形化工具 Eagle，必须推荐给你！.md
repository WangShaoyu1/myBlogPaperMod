---
author: "MacroZheng"
title: "吊炸天的 Kafka 图形化工具 Eagle，必须推荐给你！"
date: 2021-06-08
description: "Kafka是当下非常流行的消息中间件，据官网透露，已有成千上万的公司在使用它。最近实践了一波Kafka，确实很好很强大。今天我们来学习下Kafka：从安装到可视化管理再到实战！"
tags: ["Java","后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:73,comments:5,collects:140,views:20390,"
---
> SpringBoot实战电商项目mall（40k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

Kafka是当下非常流行的消息中间件，据官网透露，已有成千上万的公司在使用它。最近实践了一波Kafka，确实很好很强大。今天我们来从三个方面学习下Kafka：Kafaka在Linux下的安装，Kafka的可视化工具，Kafka和SpringBoot结合使用。希望大家看完后能快速入门Kafka，掌握这个流行的消息中间件！

Kafka简介
-------

Kafka是由`LinkedIn`公司开发的一款开源分布式消息流平台，由Scala和Java编写。主要作用是为处理实时数据提供一个统一、高吞吐、低延迟的平台，其本质是基于`发布订阅模式`的消息引擎系统。

Kafka具有以下特性：

*   高吞吐、低延迟：Kafka收发消息非常快，使用集群处理消息延迟可低至2ms。
*   高扩展性：Kafka可以弹性地扩展和收缩，可以扩展到上千个broker，数十万个partition，每天处理数万亿条消息。
*   永久存储：Kafka可以将数据安全地存储在分布式的，持久的，容错的群集中。
*   高可用性：Kafka在可用区上可以有效地扩展群集，某个节点宕机，集群照样能够正常工作。

Kafka安装
-------

> 我们将采用Linux下的安装方式，安装环境为CentOS 7.6。此处没有采用Docker来安装部署，个人感觉直接安装更简单（主要是官方没提供Docker镜像）！

*   首先我们需要下载Kafka的安装包，下载地址：[mirrors.bfsu.edu.cn/apache/kafk…](https://link.juejin.cn?target=https%3A%2F%2Fmirrors.bfsu.edu.cn%2Fapache%2Fkafka%2F2.8.0%2Fkafka_2.13-2.8.0.tgz "https://mirrors.bfsu.edu.cn/apache/kafka/2.8.0/kafka_2.13-2.8.0.tgz")

![](/images/jueJin/6d6ba510e7364d0.png)

*   下载完成后将Kafka解压到指定目录：

```bash
cd /mydata/kafka/
tar -xzf kafka_2.13-2.8.0.tgz
```

*   解压完成后进入到解压目录：

```bash
cd kafka_2.13-2.8.0
```

*   虽然有消息称Kafka即将移除Zookeeper，但是在Kafka最新版本中尚未移除，所以启动Kafka前还是需要先启动Zookeeper；

![](/images/jueJin/15e1cc6a6c28432.png)

*   启动Zookeeper服务，服务将运行在`2181`端口；

```bash
# 后台运行服务，并把日志输出到当前文件夹下的zookeeper-out.file文件中
nohup bin/zookeeper-server-start.sh config/zookeeper.properties > zookeeper-out.file 2>&1 &
```

*   由于目前Kafka是部署在Linux服务器上的，外网如果想要访问，需要修改Kafka的配置文件`config/server.properties`，修改下Kafka的监听地址，否则会无法连接；

```properties
############################# Socket Server Settings #############################

# The address the socket server listens on. It will get the value returned from
# java.net.InetAddress.getCanonicalHostName() if not configured.
#   FORMAT:
#     listeners = listener_name://host_name:port
#   EXAMPLE:
#     listeners = PLAINTEXT://your.host.name:9092
listeners=PLAINTEXT://192.168.5.78:9092
```

*   最后启动Kafka服务，服务将运行在`9092`端口。

```bash
# 后台运行服务，并把日志输出到当前文件夹下的kafka-out.file文件中
nohup bin/kafka-server-start.sh config/server.properties > kafka-out.file 2>&1 &
```

Kafka命令行操作
----------

> 接下来我们使用命令行来操作下Kafka，熟悉下Kafka的使用。

*   首先创建一个叫`consoleTopic`的Topic；

```bash
bin/kafka-topics.sh --create --topic consoleTopic --bootstrap-server 192.168.5.78:9092
```

*   接下来查看Topic；

```bash
bin/kafka-topics.sh --describe --topic consoleTopic --bootstrap-server 192.168.5.78:9092
```

*   会显示如下Topic信息；

```bash
Topic: consoleTopic	TopicId: tJmxUQ8QRJGlhCSf2ojuGw	PartitionCount: 1	ReplicationFactor: 1	Configs: segment.bytes=1073741824
Topic: consoleTopic	Partition: 0	Leader: 0	Replicas: 0	Isr: 0
```

*   向Topic中发送消息：

```bash
bin/kafka-console-producer.sh --topic consoleTopic --bootstrap-server 192.168.5.78:9092
```

*   直接在命令行中输入信息即可发送；

![](/images/jueJin/aba4f9525670443.png)

*   重新打开一个窗口，通过如下命令可以从Topic中获取消息：

```bash
bin/kafka-console-consumer.sh --topic consoleTopic --from-beginning --bootstrap-server 192.168.5.78:9092
```

![](/images/jueJin/bce0a0591a264fa.png)

Kafka可视化
--------

> 使用命令行操作Kafka确实有点麻烦，接下来我们试试可视化工具`kafka-eagle`。

### 安装JDK

> 如果你使用的是CentOS的话，默认没有安装完整版的JDK，需要自行安装！

*   下载JDK 8，下载地址：[mirrors.tuna.tsinghua.edu.cn/AdoptOpenJD…](https://link.juejin.cn?target=https%3A%2F%2Fmirrors.tuna.tsinghua.edu.cn%2FAdoptOpenJDK%2F "https://mirrors.tuna.tsinghua.edu.cn/AdoptOpenJDK/")

![](/images/jueJin/71980a9cce5c48b.png)

*   下载完成后将JDK解压到指定目录；

```bash
cd /mydata/java
tar -zxvf OpenJDK8U-jdk_x64_linux_xxx.tar.gz
mv OpenJDK8U-jdk_x64_linux_xxx.tar.gz jdk1.8
```

*   在`/etc/profile`文件中添加环境变量`JAVA_HOME`。

```bash
vi /etc/profile
# 在profile文件中添加
export JAVA_HOME=/mydata/java/jdk1.8
export PATH=$PATH:$JAVA_HOME/bin
# 使修改后的profile文件生效
. /etc/profile
```

### 安装`kafka-eagle`

*   下载`kafka-eagle`的安装包，下载地址：[github.com/smartloli/k…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsmartloli%2Fkafka-eagle-bin%2Freleases "https://github.com/smartloli/kafka-eagle-bin/releases")

![](/images/jueJin/c5d17fb3676e4a3.png)

*   下载完成后将`kafka-eagle`解压到指定目录；

```bash
cd /mydata/kafka/
tar -zxvf kafka-eagle-web-2.0.5-bin.tar.gz
```

*   在`/etc/profile`文件中添加环境变量`KE_HOME`；

```bash
vi /etc/profile
# 在profile文件中添加
export KE_HOME=/mydata/kafka/kafka-eagle-web-2.0.5
export PATH=$PATH:$KE_HOME/bin
# 使修改后的profile文件生效
. /etc/profile
```

*   安装MySQL并添加数据库`ke`，`kafka-eagle`之后会用到它；
    
*   修改配置文件`$KE_HOME/conf/system-config.properties`，主要是修改Zookeeper的配置和数据库配置，注释掉sqlite配置，改为使用MySQL；
    

```properties
######################################
# multi zookeeper & kafka cluster list
######################################
kafka.eagle.zk.cluster.alias=cluster1
cluster1.zk.list=localhost:2181

######################################
# kafka eagle webui port
######################################
kafka.eagle.webui.port=8048

######################################
# kafka sqlite jdbc driver address
######################################
# kafka.eagle.driver=org.sqlite.JDBC
# kafka.eagle.url=jdbc:sqlite:/hadoop/kafka-eagle/db/ke.db
# kafka.eagle.username=root
# kafka.eagle.password=www.kafka-eagle.org

######################################
# kafka mysql jdbc driver address
######################################
kafka.eagle.driver=com.mysql.cj.jdbc.Driver
kafka.eagle.url=jdbc:mysql://localhost:3306/ke?useUnicode=true&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull
kafka.eagle.username=root
kafka.eagle.password=root
```

*   使用如下命令启动`kafka-eagle`；

```bash
$KE_HOME/bin/ke.sh start
```

*   命令执行完成后会显示如下信息，但并不代表服务已经启动成功，还需要等待一会；

![](/images/jueJin/5e8db11e5563499.png)

*   再介绍几个有用的`kafka-eagle`命令：

```bash
# 停止服务
$KE_HOME/bin/ke.sh stop
# 重启服务
$KE_HOME/bin/ke.sh restart
# 查看服务运行状态
$KE_HOME/bin/ke.sh status
# 查看服务状态
$KE_HOME/bin/ke.sh stats
# 动态查看服务输出日志
tail -f $KE_HOME/logs/ke_console.out
```

*   启动成功可以直接访问，输入账号密码`admin:123456`，访问地址：[http://192.168.5.78:8048/](https://link.juejin.cn?target=http%3A%2F%2F192.168.5.78%3A8048%2F "http://192.168.5.78:8048/")

![](/images/jueJin/6659221074f2403.png)

*   登录成功后可以访问到Dashboard，界面还是很棒的！

![](/images/jueJin/a4612d09fa85422.png)

### 可视化工具使用

*   之前我们使用命令行创建了Topic，这里可以直接通过界面来创建；

![](/images/jueJin/f803f5e0cc354f4.png)

*   我们还可以直接通过`kafka-eagle`来发送消息；

![](/images/jueJin/ee26e673b93546c.png)

*   我们可以通过命令行来消费Topic中的消息；

```bash
bin/kafka-console-consumer.sh --topic testTopic --from-beginning --bootstrap-server 192.168.5.78:9092
```

*   控制台获取到信息显示如下；

![](/images/jueJin/abb171a12287484.png)

*   还有一个很有意思的功能叫`KSQL`，可以通过SQL语句来查询Topic中的消息；

![](/images/jueJin/6514e4c7ed6d467.png)

*   可视化工具自然少不了监控，如果你想开启`kafka-eagle`对Kafka的监控功能的话，需要修改Kafka的启动脚本，暴露JMX的端口；

```bash
vi kafka-server-start.sh
# 暴露JMX端口
if [ "x$KAFKA_HEAP_OPTS" = "x" ]; then
export KAFKA_HEAP_OPTS="-server -Xms2G -Xmx2G -XX:PermSize=128m -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -XX:ParallelGCThreads=8 -XX:ConcGCThreads=5 -XX:InitiatingHeapOccupancyPercent=70"
export JMX_PORT="9999"
fi
```

*   来看下监控图表界面；

![](/images/jueJin/e9066ec8e6484a7.png)

*   还有一个很骚气的监控大屏功能；

![](/images/jueJin/176005ec49094f8.png)

*   还有Zookeeper的命令行功能，总之功能很全，很强大！

![](/images/jueJin/790178e265ff487.png)

SpringBoot整合Kafka
-----------------

> 在SpringBoot中操作Kafka也是非常简单的，比如Kafka的消息模式很简单，没有队列，只有Topic。

*   首先在应用的`pom.xml`中添加Spring Kafka依赖；

```xml
<!--Spring整合Kafka-->
<dependency>
<groupId>org.springframework.kafka</groupId>
<artifactId>spring-kafka</artifactId>
<version>2.7.1</version>
</dependency>
```

*   修改应用配置文件`application.yml`，配置Kafka服务地址及consumer的`group-id`；

```yaml
server:
port: 8088
spring:
kafka:
bootstrap-servers: '192.168.5.78:9092'
consumer:
group-id: "bootGroup"
```

*   创建一个生产者，用于向Kafka的Topic中发送消息；

```java
/**
* Kafka消息生产者
* Created by macro on 2021/5/19.
*/
@Component
    public class KafkaProducer {
    @Autowired
    private KafkaTemplate kafkaTemplate;
    
        public void send(String message){
        kafkaTemplate.send("bootTopic",message);
    }
}
```

*   创建一个消费者，用于从Kafka中获取消息并消费；

```java
/**
* Kafka消息消费者
* Created by macro on 2021/5/19.
*/
@Slf4j
@Component
    public class KafkaConsumer {
    
    @KafkaListener(topics = "bootTopic")
        public void processMessage(String content) {
        log.info("consumer processMessage : {}",content);
    }
    
}
```

*   创建一个发送消息的接口，调用生产者去发送消息；

```java
/**
* Kafka功能测试
* Created by macro on 2021/5/19.
*/
@Api(tags = "KafkaController", description = "Kafka功能测试")
@Controller
@RequestMapping("/kafka")
    public class KafkaController {
    
    @Autowired
    private KafkaProducer kafkaProducer;
    
    @ApiOperation("发送消息")
    @RequestMapping(value = "/sendMessage", method = RequestMethod.GET)
    @ResponseBody
        public CommonResult sendMessage(@RequestParam String message) {
        kafkaProducer.send(message);
        return CommonResult.success(null);
    }
}
```

*   直接在Swagger中调用接口进行测试；

![](/images/jueJin/feded414c4c04e6.png)

*   项目控制台会输出如下信息，表明消息已经被接收并消费掉了。

```bash
2021-05-19 16:59:21.016  INFO 2344 --- [ntainer#0-0-C-1] c.m.mall.tiny.component.KafkaConsumer    : consumer processMessage : Spring Boot message!
```

总结
--

通过本文的一波实践，大家基本就能入门Kafka了。安装、可视化工具、结合SpringBoot，这些基本都是和开发者相关的操作，也是学习Kafka的必经之路。

参考资料
----

*   Kafka官方文档：[kafka.apache.org/quickstart](https://link.juejin.cn?target=https%3A%2F%2Fkafka.apache.org%2Fquickstart "https://kafka.apache.org/quickstart")
    
*   `kafka-eagle`官方文档：[www.kafka-eagle.org/articles/do…](https://link.juejin.cn?target=http%3A%2F%2Fwww.kafka-eagle.org%2Farticles%2Fdocs%2Fintroduce%2Fgetting-started.html "http://www.kafka-eagle.org/articles/docs/introduce/getting-started.html")
    
*   Kafka相关概念：[juejin.cn/post/684490…](https://juejin.cn/post/6844903495670169607 "https://juejin.cn/post/6844903495670169607")
    

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-kafka "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-kafka")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！