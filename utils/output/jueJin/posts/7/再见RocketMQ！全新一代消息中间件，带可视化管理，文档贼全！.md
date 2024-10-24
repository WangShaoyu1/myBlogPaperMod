---
author: "MacroZheng"
title: "再见RocketMQ！全新一代消息中间件，带可视化管理，文档贼全！"
date: 2021-06-17
description: "最近很火的消息中间件Pulsar，本想学习下，发现网上很多都是介绍性能和对比Kafka的文章，实践的文章很少！于是对着官方文档实践了一波，写下了这篇文章，估计是国内第一篇Pulsar实战文章了。"
tags: ["Java","后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:79,comments:10,collects:117,views:9264,"
---
> SpringBoot实战电商项目mall（40k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

最近很火的消息中间件Pulsar，本想学习下，发现网上很多都是介绍性能和对比Kafka的文章，实践的文章很少！于是对着官方文档实践了一波，写下了这篇文章，估计是国内第一篇Pulsar实战文章了，希望对大家有所帮助！

Pulsar简介
--------

Pulsar是一个用于服务端到服务端的消息中间件，具有多租户、高性能等优势。Pulsar最初由Yahoo开发，目前由Apache软件基金会管理。Pulsar采用`发布-订阅`的设计模式，Producer发布消息到Topic，Consumer订阅Topic、处理Topic中的消息。

Pulsar具有如下特性：

*   Pulsar的单个实例原生支持集群。
*   极低的发布延迟和端到端延迟。
*   可无缝扩展到超过一百万个Topic。
*   简单易用的客户端API，支持Java、Go、Python和C++。
*   支持多种Topic订阅模式（独占订阅、共享订阅、故障转移订阅）。
*   通过Apache BookKeeper提供的持久化消息存储机制保证消息传递。

Pulsar安装
--------

> 使用Docker安装Pulsar是最简单的，这次我们使用Docker来安装。

*   首先下载Pulsar的Docker镜像；

```bash
docker pull apachepulsar/pulsar:2.7.1
```

*   下载完成后运行Pulsar容器，http协议访问使用`8080`端口，pulsar协议（Java、Python等客户端）访问使用`6650`端口。

```bash
docker run --name pulsar \
-p 6650:6650 \
-p 8080:8080 \
--mount source=pulsardata,target=/pulsar/data \
--mount source=pulsarconf,target=/pulsar/conf \
-d apachepulsar/pulsar:2.7.1 \
bin/pulsar standalone
```

Pulsar可视化
---------

> `Pulsar Manager`是官方提供的可视化工具，可以对多个Pulsar进行可视化管理，虽然功能不多，但也基本够用了，支持Docker部署。

*   下载`pulsar-manager`的Docker镜像；

```bash
docker pull apachepulsar/pulsar-manager:v0.2.0
```

*   下载完成后运行`pulsar-manager`容器，从`9527`端口可以访问Web页面；

```bash
docker run -it --name pulsar-manager\
-p 9527:9527 -p 7750:7750 \
-e SPRING_CONFIGURATION_FILE=/pulsar-manager/pulsar-manager/application.properties \
-d apachepulsar/pulsar-manager:v0.2.0
```

*   运行成功后，我们刚开始无法访问，需要创建管理员账号，这里创建账号为`admin:apachepulsar`：

```bash
CSRF_TOKEN=$(curl http://localhost:7750/pulsar-manager/csrf-token)
curl \
-H "X-XSRF-TOKEN: $CSRF_TOKEN" \
-H "Cookie: XSRF-TOKEN=$CSRF_TOKEN;" \
-H 'Content-Type: application/json' \
-X PUT http://localhost:7750/pulsar-manager/users/superuser \
-d '{"name": "admin", "password": "apachepulsar", "description": "test", "email": "username@test.org"}'
```

*   创建成功后，通过登录页面进行登录，访问地址：[http://192.168.5.78:9527](https://link.juejin.cn?target=http%3A%2F%2F192.168.5.78%3A9527 "http://192.168.5.78:9527")

![](/images/jueJin/3d2fd39cb0b5476.png)

*   登录成功后我们需要先配置一个环境，就是将需要管理的Pulsar服务配置上去，配置的`Service URL`为：[http://192.168.5.78:8080](https://link.juejin.cn?target=http%3A%2F%2F192.168.5.78%3A8080 "http://192.168.5.78:8080")

![](/images/jueJin/39ba25ca0e054bf.png)

*   可以查看Tenant列表；

![](/images/jueJin/389a7ad661f9460.png)

*   可以查看Topic列表和管理Topic；

![](/images/jueJin/7c8408e5fb4e4ae.png)

*   还可以查看Topic的详细信息。

![](/images/jueJin/3ec709283d72452.png)

Pulsar结合SpringBoot使用
--------------------

> Pulsar结合SpringBoot使用也是非常简单的，我们可以使用Pulsar官方的Java SDK，也可以使用第三方的SpringBoot Starter。这里使用Starter，非常简单！

*   首先在`pom.xml`中添加Pulsar相关依赖；

```xml
<!--SpringBoot整合Pulsar-->
<dependency>
<groupId>io.github.majusko</groupId>
<artifactId>pulsar-java-spring-boot-starter</artifactId>
<version>1.0.4</version>
</dependency>
```

*   然后在`application.yml`中添加Pulsar的`Service URL`配置；

```yaml
pulsar:
service-url: pulsar://192.168.5.78:6650
```

*   再添加Pulsar的Java配置，声明两个Topic，并确定好发送的消息类型；

```java
/**
* Pulsar配置类
* Created by macro on 2021/5/21.
*/
@Configuration
    public class PulsarConfig {
    @Bean
        public ProducerFactory producerFactory() {
        return new ProducerFactory()
        .addProducer("bootTopic", MessageDto.class)
        .addProducer("stringTopic", String.class);
    }
}
```

*   创建Pulsar生产者，往Topic中发送消息，这里可以发现Pulsar是支持直接发送消息对象的；

```java
/**
* Pulsar消息生产者
* Created by macro on 2021/5/19.
*/
@Component
    public class PulsarProducer {
    @Autowired
    private PulsarTemplate<MessageDto> template;
    
        public void send(MessageDto message){
            try {
            template.send("bootTopic",message);
                } catch (PulsarClientException e) {
                e.printStackTrace();
            }
        }
    }
```

*   创建Pulsar消费者，从Topic中获取并消费消息，也是可以直接获取到消息对象的；

```java
/**
* Pulsar消息消费者
* Created by macro on 2021/5/19.
*/
@Slf4j
@Component
    public class PulsarRealConsumer {
    
    @PulsarConsumer(topic="bootTopic", clazz= MessageDto.class)
        public void consume(MessageDto message) {
        log.info("PulsarRealConsumer consume id:{},content:{}",message.getId(),message.getContent());
    }
    
}
```

*   添加测试接口，调用生产者发送消息；

```java
/**
* Pulsar功能测试
* Created by macro on 2021/5/19.
*/
@Api(tags = "PulsarController", description = "Pulsar功能测试")
@Controller
@RequestMapping("/pulsar")
    public class PulsarController {
    
    @Autowired
    private PulsarProducer pulsarProducer;
    
    @ApiOperation("发送消息")
    @RequestMapping(value = "/sendMessage", method = RequestMethod.POST)
    @ResponseBody
        public CommonResult sendMessage(@RequestBody MessageDto message) {
        pulsarProducer.send(message);
        return CommonResult.success(null);
    }
}
```

*   在Swagger中调用接口进行测试；

![](/images/jueJin/1d90f693e032472.png)

*   调用成功后，控制台将输入如下信息，表示消息已经被成功接收并消费了。

```bash
2021-05-21 16:25:07.756  INFO 11472 --- [al-listener-3-1] c.m.m.tiny.component.PulsarRealConsumer  : PulsarRealConsumer consume id:1,content:SpringBoot Message!
```

总结
--

上次写了一篇[《吊炸天的 Kafka 图形化工具 Eagle，必须推荐给你！》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FV3niDxdT_PiTbru80UGz4A "https://mp.weixin.qq.com/s/V3niDxdT_PiTbru80UGz4A")介绍了Kafka的基本使用，这里和Pulsar做个对比。Pulsar对Docker支持无疑是更好的，官方文档也更全。对比下图形化工具`Pulsar Manager`和`Kafka Eagle`，Pulsar的图形化工具感觉有点简陋。介于目前雅虎、腾讯、360等互联网大厂都在使用Pulsar，Pulsar的性能和稳定性应该是很不错的！

参考资料
----

> Pulsar的官方文档很全，样式也不错，基本照着文档来一遍就能入门了。

![](/images/jueJin/f7cb4be930dd497.png)

*   Pulsar官方文档：[pulsar.apache.org/docs/en/sta…](https://link.juejin.cn?target=https%3A%2F%2Fpulsar.apache.org%2Fdocs%2Fen%2Fstandalone-docker%2F "https://pulsar.apache.org/docs/en/standalone-docker/")
*   SpringBoot Starter官方文档：[github.com/majusko/pul…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmajusko%2Fpulsar-java-spring-boot-starter "https://github.com/majusko/pulsar-java-spring-boot-starter")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-pulsar "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-pulsar")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！