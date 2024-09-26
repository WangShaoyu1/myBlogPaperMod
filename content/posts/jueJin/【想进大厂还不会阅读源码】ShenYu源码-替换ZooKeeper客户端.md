---
author: "JavaSouth南哥"
title: "【想进大厂还不会阅读源码】ShenYu源码-替换ZooKeeper客户端"
date: 2024-02-22
description: "ShenYu源码阅读。相信大家碰到源码时经常无从下手，不知道从哪开始阅读😭。我认为有一种办法可以解决大家的困扰！至此，我们发现自己开始从大量堆砌的源码中脱离开来😀。ShenYu是一个异步的，高性能"
tags: ["源码阅读"]
ShowReadingTime: "阅读3分钟"
weight: 539
---
> 相信大家碰到源码一开始都是比较无从下手的🙃，不知道从哪开始阅读，面对大量代码晕头转向，索性就读不下去了，又浪费了一次提升自己的机会😭。
> 
>   
> 
> 我认为**有一种方法**，可以解决大家的困扰！**那就是通过阅读某一次开源【commit】、某一次社区【ISSUE】，从这个入口出发去阅读源码！！**
> 
>   
> 
> 至此，我们发现自己开始从大量堆砌的源码中脱离开来😀。豁然开朗，柳暗花明又一村🍀。

ShenYu是一个异步的，高性能的，跨语言的，响应式的 API 网关。有关ShenYu的介绍可以[戳这](https://link.juejin.cn?target=https%3A%2F%2Fshenyu.apache.org%2Fzh%2Fdocs%2Findex%2F "https://shenyu.apache.org/zh/docs/index/")。

一、前瞻
----

今天我们来攻克这一次开源提交：[commit链接](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fapache%2Fshenyu%2Fissues%2F3362 "https://github.com/apache/shenyu/issues/3362")

本次commit的核心内容就在下图红框中，意思很清晰明了：**替换当前的ZooKeeper客户端。**

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ea03fc94dd2451ba7177e80f13a4ce6~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=887&h=660&s=196966&e=jpg&b=1a1b1d)

**看看Magic Header是什么**

> Magic Header 通常指的是文件开头的一段特定字节序列，用来标识或确认文件的格式和类型。这些字节序列是预先定义的，不同的文件格式有不同的 Magic Header。操作系统和应用程序通过读取这些特定的字节序列来识别文件的格式，即使文件扩展名被更改或丢失。

简单来说就是用来标识文件。

我们先整体看下本次所有提交的内容，虽然看起来涉及了**大量**的模块、大量的代码，但核心其实就是红框对应的内容。既然是要替**换当前的ZooKeeper客户端**，那便是要新建**Curator**这个新的客户端，同时修改调用端的调用对象！

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c62961f6a994a1a96c290f38c7cfc14~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=611&h=527&s=167522&e=jpg&b=3b4043)

下面我们就来看看贡献者是怎么**实现替换的**！！同时上文提到`并将数据保存在没有 magic header 的 zk 中`，正确翻译应该是`保存数据在zk时，不使用magic header来标识数据`，那他又是怎么做的？？

二、探索
----

我们**参照上图**，先看下ZookeeperClient类，该类很显眼的引入了本次提交的主角**CuratorFramework**，ZookeeperClient封装了CuratorFramework作为ZooKeeper新的客户端。

java

 代码解读

复制代码

`public class ZookeeperClient {     private static final Logger LOGGER = LoggerFactory.getLogger(ZookeeperClient.class);     private final ZookeeperConfig config;     private final CuratorFramework client;     private final Map<String, CuratorCache> caches = new ConcurrentHashMap<>();     public ZookeeperClient(final ZookeeperConfig zookeeperConfig) {         this.config = zookeeperConfig;         ExponentialBackoffRetry retryPolicy = new ExponentialBackoffRetry(config.getBaseSleepTimeMilliseconds(), config.getMaxRetries(), config.getMaxSleepTimeMilliseconds());         CuratorFrameworkFactory.Builder builder = CuratorFrameworkFactory.builder()                 .connectString(config.getServerLists())                 .retryPolicy(retryPolicy)                 .connectionTimeoutMs(config.getConnectionTimeoutMilliseconds())                 .sessionTimeoutMs(config.getSessionTimeoutMilliseconds())                 .namespace(config.getNamespace());         if (!StringUtils.isEmpty(config.getDigest())) {             builder.authorization("digest", config.getDigest().getBytes(StandardCharsets.UTF_8));         }         this.client = builder.build();     }     /**      * start.      */     public void start() {         this.client.start();         try {             this.client.blockUntilConnected();         } catch (InterruptedException e) {             LOGGER.warn("Interrupted during zookeeper client starting.");             Thread.currentThread().interrupt();         }     } }`

而ZookeeperInstanceRegisterRepository就是起到**控制器**的作用，把ZookeeperConfig类的配置注册到ZookeeperClient来**初始化我们新的客户端**。

我们在代码可以看到初始化方法init()。

java

 代码解读

复制代码

`@Join public class ZookeeperInstanceRegisterRepository implements ShenyuInstanceRegisterRepository {     private static final Logger LOGGER = LoggerFactory.getLogger(ZookeeperInstanceRegisterRepository.class);     private ZookeeperClient client;     private final Map<String, String> nodeDataMap = new HashMap<>();     @Override     public void init(final InstanceConfig config) {         Properties props = config.getProps();         int sessionTimeout = Integer.parseInt(props.getProperty("sessionTimeout", "3000"));         int connectionTimeout = Integer.parseInt(props.getProperty("connectionTimeout", "3000"));         int baseSleepTime = Integer.parseInt(props.getProperty("baseSleepTime", "1000"));         int maxRetries = Integer.parseInt(props.getProperty("maxRetries", "3"));         int maxSleepTime = Integer.parseInt(props.getProperty("maxSleepTime", String.valueOf(Integer.MAX_VALUE)));         ZookeeperConfig zkConfig = new ZookeeperConfig(config.getServerLists());         zkConfig.setBaseSleepTimeMilliseconds(baseSleepTime)                 .setMaxRetries(maxRetries)                 .setMaxSleepTimeMilliseconds(maxSleepTime)                 .setSessionTimeoutMilliseconds(sessionTimeout)                 .setConnectionTimeoutMilliseconds(connectionTimeout);         String digest = props.getProperty("digest");         if (!StringUtils.isEmpty(digest)) {             zkConfig.setDigest(digest);         }         this.client = new ZookeeperClient(zkConfig);         this.client.getClient().getConnectionStateListenable().addListener((c, newState) -> {             if (newState == ConnectionState.RECONNECTED) {                 nodeDataMap.forEach((k, v) -> {                     if (!client.isExist(k)) {                         client.createOrUpdate(k, v, CreateMode.EPHEMERAL);                         LOGGER.info("zookeeper client register instance success: {}", v);                     }                 });             }         });         client.start();     } }`

替换客户端的操作其实不会太复杂，主要就是把**所有旧的客户端入参修改为新的客户端对象**，可以看下贡献者的提交代码。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7cd8d9bd8e8d4557a0bf16409fe66e5c~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1745&h=867&s=525880&e=jpg&b=2c2c2c)

我们打开commit链接指向的[ISSUE](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fapache%2Fshenyu%2Fissues%2F3360 "https://github.com/apache/shenyu/issues/3360")

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/deb10495f3174a48a4dec694be269fe3~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=860&h=891&s=297002&e=jpg&b=1b1c1e)

意思其实是**旧的zkClient**保存数据时默认会把**magic header头信息**插入到数据中，导致了我们的**序列化数据失败**。

而贡献者本次提交把客户端**改为了Curator客户端**，也就不会有上面插入magic header头信息的操作了。

> **大家能否感受通过commit、ISSUE这种方式来阅读源码的乐趣呢！**
> 
>   
> 
> **创作不易，不妨点赞、关注、收藏支持一下，各位的支持就是我创作的最大动力**❤️