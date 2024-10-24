---
author: "政采云技术"
title: "实现jvm-sandbox-repeater的Apollo录制插件"
date: 2024-07-02
description: "政采云质量团队引入 jvm-sandbox-repeater 用于实现流量录制与回放。然而，由于该工具未提供 Apollo 的录制与回放插件，导致录制回放时存在一些不便。"
tags: ["后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:3,comments:1,collects:2,views:1077,"
---
![文章顶部.png](/images/jueJin/b637793da67b4e0.png) ![作者卡片](/images/jueJin/5947a74ac1e7493.png)

一 背景
====

政采云质量团队引入 jvm-sandbox-repeater 用于实现流量录制与回放。然而，由于该工具未提供 Apollo 的录制与回放插件，导致录制回放时存在一些不便。

本文以编写 Apollo 录制插件为例，阐述如何编写 jvm-sandbox-repeater 录制插件。

二 了解Apollo
==========

2.1 Apollo简介
------------

[Apollo](https://link.juejin.cn?target=https%3A%2F%2Fwww.apolloconfig.com%2F%23%2Fzh%2Fdesign%2Fapollo-introduction%3Fid%3D_1%25e3%2580%2581what-is-apollo "https://www.apolloconfig.com/#/zh/design/apollo-introduction?id=_1%e3%80%81what-is-apollo") （阿波罗）是一款可靠的分布式配置管理中心，诞生于携程框架研发部，能够集中化管理应用不同环境、不同集群的配置，配置修改后能够实时推送到应用端，并且具备规范的权限、流程治理等特性，适用于微服务配置管理场景。

2.2 Apollo客户端原理
---------------

详见官方文档：[Apollo 客户端的实现原理](https://link.juejin.cn?target=https%3A%2F%2Fwww.apolloconfig.com%2F%23%2Fzh%2Fdesign%2Fapollo-design "https://www.apolloconfig.com/#/zh/design/apollo-design")

0.  客户端和服务端保持了一个长连接，从而能第一时间获得配置更新的推送。（通过 Http Long Polling 实现）
1.  客户端还会定时从 Apollo 配置中心服务端拉取应用的最新配置。
2.  客户端从 Apollo 配置中心服务端获取到应用的最新配置后，会保存在内存中。
3.  客户端会把从服务端获取到的配置在本地文件系统缓存一份。
4.  应用程序可以从 Apollo 客户端获取最新的配置、订阅配置更新通知。

![image.png](/images/jueJin/2b557983687742e.png)

三 了解jvm-sandbox-repeater
========================

3.1 jvm-sandbox-repeater简介
--------------------------

[jvm-sandbox-repeater](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Falibaba%2Fjvm-sandbox-repeater "https://github.com/alibaba/jvm-sandbox-repeater") 是 [JVM-Sandbox](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Falibaba%2FJVM-Sandbox "https://github.com/alibaba/JVM-Sandbox") 生态体系下的重要模块，它具备了 JVM-Sandbox 的所有特点，插件式设计便于快速适配各种中间件，封装请求录制/回放基础协议，也提供了通用可扩展的各种丰富API。

repeater 的核心能力有3个：1）通用录制/回放能力，2）快速可扩展API实现，3）standalone 工作模式。

3.2 repeater录制原理
----------------

录制的核心逻辑是基于 JVM-Sandbox 的 BEFORE、RETRUN、THROW 事件机制进行录制流程控制。通过下方代码可很好理解前述的三种事件机制。

```kotlin
// BEFORE
    try {
    ​
    /*
    * do something...
    */
    ​
    // RETURN
    return;
    ​
        } catch (Throwable cause) {
        // THROWS
    }
```

基于 BEFORE、RETURN 和 THROWS 三个环节事件分离，沙箱的模块可以完成很多类AOP的操作。

0.  可以感知和改变方法调用的入参。
    
1.  可以感知和改变方法调用返回值和抛出的异常。
    
2.  可以改变方法执行的流程
    
    *   在方法体执行之前直接返回自定义结果对象，原有方法代码将不会被执行。
    *   在方法体返回之前重新构造新的结果对象，甚至可以改变为抛出异常。
    *   在方法体抛出异常之后重新抛出新的异常，甚至可以改变为正常返回。

四 实现Apollo录制插件
==============

实现 Apollo 录制有2个难点：1）什么时候录制；2）plugin 录制到数据怎么传递给 repeater。接下来陈述解决思路。

4.1 整体思路
--------

![image.png](/images/jueJin/479db42456ea495.png) 难点：什么时候录制？

如图①，jvm-sandbox 需在 client 请求到配置数据后进行拦截，并通过反射获取到 Apollo 最新数据。

难点：plugin 录制到的数据传递给 repeater？

如图②，获取到的最新数据后，需与上一次数据进行对比。不一致则表示有更新，写入记录文件，一致则 return。通过该文件与 repeater 进行交互。

4.2 实现录制插件
----------

Apollo 在应用启动阶段，会根据配置决定是否向 Spring 容器注入被托管的 properties 文件内容。

若配置中心有变更，client通过反射更新被标记的变量。若无变更，则和使用本地变量一样。录制实现流程如下 ![image.png](/images/jueJin/c5d0dd364d2846f.png)

插件实现如下

1、新建 ApolloPlugin.class，主要用途：配置拦截方法和拦截事件。

```scala
@MetaInfServices(InvokePlugin.class)
    public class ApolloPlugin extends AbstractInvokePluginAdapter {
    @Override
        protected List<EnhanceModel> getEnhanceModels() {
        EnhanceModel remoteConfigEM = EnhanceModel.builder()
        .classPattern("com.ctrip.framework.apollo.internals.RemoteConfigRepository")
        .methodPatterns(EnhanceModel.MethodPattern.transform(
        "loadApolloConfig"))
        .watchTypes(Event.Type.BEFORE, Event.Type.RETURN, Event.Type.THROWS)
        .build();
        return Lists.newArrayList(remoteConfigEM);
    }
}
```

2、新建 ApolloListener.class，主要用途：拦截指定方法的不同事件。

此处会创建一个Apollo数据记录文件（ /tmp/linAo.properties ），用于记录 Apollo client 获取到的数据。

```scala
    public class ApolloListener extends DefaultEventListener{
    static JSONObject jsonObject = new JSONObject();
    final String NEW_FILE = "/linAo.properties";
    final String REMOTE_CONFIG_REPOSITORY = "com.ctrip.framework.apollo.internals.RemoteConfigRepository";
    
    @Override
        protected void initContext(Event event){
            if(event.type == Event.Type.BEFORE){
            BeforeEvent beforeEvent = (BeforeEvent) event;
            Object target = beforeEvent.target;
            
                if(target.getClass().getName().equals(REMOTE_CONFIG_REPOSITORY)){
                    if (beforeEvent.javaMethodName.equals("loadApolloConfig")) {
                        try {
                        // 通过反射获取最新值
                        // 对比新老数据的md5，不一致则更新linAo.properties，一致则return
                            } catch (Exception ex) {
                            LogUtil.warn("before event: RemoteConfigRepository#loadApolloConfig exception", ex);
                        }
                    }
                }
            }
        }
    }
```

通过上述2步，Apollo 的录制插件已编写完成。接下来需要把录制到的 Apollo 数据与录制到的流量进行绑定，并存储到 repeater 的 db。

五 主调用绑定Apollo子调用
================

repeater 录制的数据由「主调用」和「子调用」两部分组成。在录制 Apollo 的数据与录制 MyBatis、Http 的方式有所不同，主要区别在于：**如果配置中心发生变更，客户端会通过反射更新已标记的变量；若无变更，则表现与使用本地变量相同。**

在生产环境中，Apollo 不会持续推送配置变更，因此被标记的变量在数据未更新时表现与本地变量相同。由于录制插件无法适配到使用本地变量的情况，因此无法捕获调用行为并生成子调用。这种情况会导致录制时无法识别、从而在回放时无法进行 Mock。

录制时无法生成Apollo子调用存在2个难点：1）如何构建 Apollo 子调用；2）构建的自定义子调用如何绑定到主调用。

接下来先简介什么是主/子调用，在讲解如何生成自定义子调用，并绑定到主调用。

5.1 什么是主/子调用
------------

```java
@RestController
    public class GreetingController {
    // 业务接口-1
    @Autowired
    BizInterface1 bizInterface1;
    ​
    // 业务接口-2
    @Autowired
    BizInterface2 bizInterface2;
    ​
    @RequestMapping("/calc")
        public Integer calc() {
        Integer i = bizInterface1.getValue();
        Integer j = bizInterface2.getValue();
        return i - j;
    }
}
```

上述示例中，http 调用是入口调用（也称为主调用），业务接口调用称为子调用。 ![image.png](/images/jueJin/4bf5048a42b24e9.png)

5.2 如何构建Apollo子调用
-----------------

难点：如何构建Apollo 子调用？

Apollo 录制插件会创建一个记录文件（ /tmp/linAo.properties ），用于存储最新的 Apollo 数据。在构建 Apollo 的子调用时，需要将记录的 Apollo 数据转换成子调用的格式。

难点：构建的自定义子调用如何绑定到主调用？

若应用下存在记录文件（ /tmp/linAo.properties ），则表示该启用了 Apollo；若无该文件，则表示未启用 Apollo。

构建并绑定代码如下

```scss
com.alibaba.jvm.sandbox.repeater.plugin.core.impl.api.DefaultInvocationListener#onInvocation
​
@Override
    public void onInvocation(Invocation invocation){
    ...
        if(invocation.isEntrance()){
        ApplicationModel am = ApplicationModel.instance();
        RecordModel recordModel = new RecordModel();
        // 存在linAo.properties，则生成自定义子调用，并添加到subInvocation
        recordModel.setSubInvocations(addApolloSubInvocation(RecordCache.getSubInvocation(invocation.getTraceId()), invocation, am.getConfig().getApolloExclusionsNameSpaces()));
        ...
    }
    ...
}
​
    List<Invocation> addApolloSubInvocation(List<Invocation> subInvocation, Invocation mainInvocation, List<String> apolloExclusionsNameSpaces) {
        try {
        Long t = System.currentTimeMillis();
        // 读取记录文件
        JSONObject jsonObject = ApolloUtil.readApolloFile();
        
            if (jsonObject != null && !jsonObject.isEmpty()) {
                for (String key : jsonObject.keySet()) {
                // 过滤没用到的namespace
                    if (apolloExclusionsNameSpaces.contains(key)) {
                    jsonObject.remove(key);
                }
            }
            ​
            // 手动构建子调用
            Invocation apolloInvocation = new Invocation();
            apolloInvocation.setIdentity(new Identity("apollo", jsonObject.keySet().toString(), "linAo", new HashMap<String, String>(1)));
            apolloInvocation.setType(InvokeType.APOLLO);
            apolloInvocation.setTraceId(subInvocation != null ? subInvocation.get(subInvocation.size() - 1).getTraceId() : mainInvocation.getTraceId());
            apolloInvocation.setIndex(subInvocation != null ? subInvocation.size() + 1 : 0);
            apolloInvocation.setResponse(jsonObject);
            apolloInvocation.setStart(t - 1);
            apolloInvocation.setEnd(t + 3);
            apolloInvocation.setInvokeId(subInvocation != null ? subInvocation.get(subInvocation.size() - 1).getInvokeId() + 1 : mainInvocation.getInvokeId() + 1);
            apolloInvocation.setProcessId(subInvocation != null ? subInvocation.get(subInvocation.size() - 1).getProcessId() + 1 : mainInvocation.getProcessId() + 1);
            apolloInvocation.setSerializeToken(subInvocation != null ? subInvocation.get(subInvocation.size() - 1).getSerializeToken() : mainInvocation.getSerializeToken());
            SerializerWrapper.inTimeSerialize(apolloInvocation);
            
                if (subInvocation == null) {
                subInvocation = new ArrayList<Invocation>();
            }
            
            // 追加Apollo子调用
            subInvocation.add(apolloInvocation);
        }
            } catch (Exception e) {
            log.error("apollo invocation serialize error", e);
        }
        return subInvocation;
    }
```

至此，录制 Apollo 数据 -> 手动构建 Apollo 子调用 -> 绑定主调用 -> 数据落库，已全部实现。最终实现如下图 ![image.png](/images/jueJin/0cd4c0e07fa748a.png)

六 尾声
====

本文只讨论 Apollo 的录制功能，由于 Apollo 不同版本之间存在差异，回放功能目前正在开发中。

在实现插件的过程中，我了解到了sandbox 的拦截原理，并且对 repeater 的部分代码进行了初步阅读。接下来，我计划利用 sandbox 来开发一些与我们业务相关的质量工具。

推荐阅读
----

[ARM架构下部署StarRocks3](https://juejin.cn/post/7306065067257856010 "https://juejin.cn/post/7306065067257856010")

[Spring Validation实践及其实现原理](https://juejin.cn/post/7303792111718973466 "https://juejin.cn/post/7303792111718973466")

[ThreadPoolExecutor杂谈](https://juejin.cn/post/7303461209142099978 "https://juejin.cn/post/7303461209142099978")

[浅谈软件架构](https://juejin.cn/post/7301579823415345178 "https://juejin.cn/post/7301579823415345178")

[你是否真的需要实现一个3D地图](https://juejin.cn/post/7301242469937348659 "https://juejin.cn/post/7301242469937348659")

招贤纳士
----

政采云技术团队（Zero），Base 杭州，一个富有激情和技术匠心精神的成长型团队。规模 500 人左右，在日常业务开发之外，还分别在云原生、区块链、人工智能、低代码平台、中间件、大数据、物料体系、工程平台、性能体验、可视化等领域进行技术探索和实践，推动并落地了一系列的内部技术产品，持续探索技术的新边界。此外，团队还纷纷投身社区建设，目前已经是 google flutter、scikit-learn、Apache Dubbo、Apache Rocketmq、Apache Pulsar、CNCF Dapr、Apache DolphinScheduler、alibaba Seata 等众多优秀开源社区的贡献者。

如果你想改变一直被事折腾，希望开始折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊……如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的技术团队的成长过程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 [zcy-tc@cai-inc.com](https://link.juejin.cn?target=mailto%3Azcy-tc%40cai-inc.com "mailto:zcy-tc@cai-inc.com")

微信公众号
-----

文章同步发布，政采云技术团队公众号，欢迎关注 ![文章顶部.png](/images/jueJin/aaafc13f1d1e414.png)