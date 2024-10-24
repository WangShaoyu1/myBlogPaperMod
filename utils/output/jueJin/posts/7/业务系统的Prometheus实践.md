---
author: "政采云技术"
title: "业务系统的Prometheus实践"
date: 2023-04-11
description: "什么是 Prometheus Prometheus（普罗米修斯）是古希腊的一个神明，名字的意思是「先见之明」。从它的名字可以看出，Prometheus 是做「先见之明」的监控告警用途。 官网描述为Fr"
tags: ["监控中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:18,comments:2,collects:34,views:4986,"
---
![文章顶部.png](/images/jueJin/aaafc13f1d1e414.png)

![author-houqin](/images/jueJin/317a48b78ec143f.png)

### 什么是 Prometheus

Prometheus（普罗米修斯）是古希腊的一个神明，名字的意思是「先见之明」。从它的名字可以看出，Prometheus 是做「先见之明」的**监控告警**用途。

官网描述为`From metrics to insight`，用指标洞察系统。

Prometheus 其实就是一个**数据监控解决方案**，它能帮你简单快速地搭建起一套可视化的监控系统。

例如研发比较关注机器的 CPU、内存、硬盘，产品和运营比较关注运营层面的指标，例如新增用户数，日活等，都可以通过 Prometheus 和 grafana 简单，直观化展示。

例如下图 JVM 的监控。

![image-20230220203958430](/images/jueJin/363b0d8ea1ef43e.png)

### 业务实践

#### 背景

公司某个业务需要 n 个评审专家对同一批 n 张业务报表批量签字。3 方签字接口只有支持单个报表签字，所以需要 `n*n` 次，单次签字逻辑复杂，流程较长，所有后台用线程池做了异步化。

签字作为业务的核心节点，不能有故障。所以怎么监控线程池的关键指标，实现动态调整参数，当任务数量过多告警，是一个需要解决的痛点。

我们通过 Prometheus 自定义线程池的指标，**grafana** 展示，**apollo** 动态调整线程池的变量，实现弹性扩展。

#### 实践

##### 线程池参数动态更新

通过接入 apollo 配置，当检测到线程池的配置变化时，重新设置：

0.  核心线程数
1.  最大线程数
2.  修改线程空闲时间

```scss
@Component
    public class ApolloRefreshConfig {
    @Resource
    private RefreshScope refreshScope;
    @Resource
    private ApplicationContext applicationContext;
    @Resource
    private ThreadPoolExecutor executorService;
    
    @ApolloConfigChangeListener
        public void onChange(ConfigChangeEvent changeEvent) {
        applicationContext.publishEvent(new EnvironmentChangeEvent(changeEvent.changedKeys()));
        refreshScope.refreshAll();
        // 刷新变量
        asyncRequestTaskConfigChange(changeEvent.changedKeys());
    }
    ​
        private void asyncRequestTaskConfigChange(Set<String> changedKeys) {
        //apollo 变更的是线程池变量
            if (changedKeys.contains(EvaluationProcessAsyncRequestTaskConfig.ASYNC_REQUEST_TASK_CHANGE_FLAG_KEY)) {
            // 核心线程数
            Integer corePoolSizeOld = executorService.getCorePoolSize();
                if (!corePoolSize.equals(corePoolSizeOld)) {
                executorService.setCorePoolSize(corePoolSize);
            }
            // 最大线程数
            Integer maximumPoolSizeOld = executorService.getMaximumPoolSize();
                if (!maximumPoolSize.equals(maximumPoolSizeOld)) {
                executorService.setMaximumPoolSize(maximumPoolSize);
            }
            // 修改线程空闲时间
            Long keepAliveTimeOld = executorService.getKeepAliveTime(TimeUnit.MINUTES);
                if (!keepAliveTime.equals(keepAliveTimeOld)) {
                executorService.setKeepAliveTime(keepAliveTime, TimeUnit.MINUTES);
            }
        }
    }
}
```

##### 线程池指标上报

在 springboot 版本 2.X 版本以后，使用 Prometheus 进行监控，只需引入 Spring Boot Actuator 相关的 jar，就可以简单集成，然后我们就可以自定义业务指标，上报 Prometheus 了

```xml
<dependency>
<groupId>cn.gov.zcy.boot</groupId>
<artifactId>spring-boot-starter-actuator</artifactId>
</dependency
```

> Prometheus 中的核心类 io.micrometer.core.instrument.MeterRegistry 中可以定制各种业务指标，也有封装的例如计数类 Counter，这里引用一个 Gauge 只定义的指标

```typescript
@Component
    public class MonitorFactory {
    ​
    @Resource
    private MeterRegistry meterRegistry;
    ​
    @Resource
    private ThreadPoolExecutor threadPoolExecutor;
    ​
    ​
    private ThreadPoolSizeMonitor threadPoolSizeMonitor = new ThreadPoolSizeMonitor(threadPoolExecutor);
    ​
    
        class ThreadPoolSizeMonitor implements ToDoubleFunction {
        private ThreadPoolExecutor executor;
        //计数
        private AtomicDouble monitor = new AtomicDouble(0);
        ​
            public Object getMonitor() {
            return monitor;
        }
        ​
            public ThreadPoolSizeMonitor(ThreadPoolExecutor executor) {
            this.executor = executor;
        }
        ​
        @Override
            public double applyAsDouble(Object o) {
            monitor.set(executor.getPoolSize());
            return monitor.get();
        }
    }
    ​
    //上报指标，初始化时注册指标
    @PostConstruct
        public void monitorThreadPool() {
        // 当前存活线程数
        Gauge.builder("ReportBatchSignPool_poolSizeMonitor", threadPoolSizeMonitor.getMonitor(), threadPoolSizeMonitor).register(meterRegistry);
        // 当前活跃（忙碌）线程数
        // 核心存活线程数
        // 提交的任务数
        // 执行完毕的任务数
        // 任务队列积压监控
    }
    ​
    //1 分钟更新一次指标数据
    @Scheduled(cron = "0 0/1 * * * ?")
        public void publishWatcher() {
        threadPoolSizeMonitor.applyAsDouble(null);
    }
    ​
}
​
```

##### Prometheus 指标展示

用 Prometheus quering 语句查询出具体数值 最后一列展示向量结果 16，查询语法如下

> [prometheus.io/docs/promet…](https://link.juejin.cn?target=https%3A%2F%2Fprometheus.io%2Fdocs%2Fprometheus%2Flatest%2Fquerying%2Fbasics%2F "https://prometheus.io/docs/prometheus/latest/querying/basics/")

![image-20230220204015590](/images/jueJin/9da2adab0f7c454.png)

##### grafana 可视化展示

![iShot_2023-03-22_21.11.49](/images/jueJin/f9f6bdf523144cc.png)

##### 告警配置

grafana 配置告警，配置具体的通知信息，触发规则，告警的通知渠道 参考官方文档

> [grafana.com/docs/grafan…](https://link.juejin.cn?target=https%3A%2F%2Fgrafana.com%2Fdocs%2Fgrafana%2Flatest%2Falerting%2F "https://grafana.com/docs/grafana/latest/alerting/")

![iShot_2023-03-22_21.06.25](/images/jueJin/aabc615e1afe461.png)

![告警配置](/images/jueJin/fd01d808a031441.png)

通知到叮叮告警群

### 总结

本文介绍了研发人员通过配置 Prometheus 自定义的业务指标，实现监控告警完整链路的大致的流程。大家也可以定制化除了系统指标（例如 CPU、JVM、IO 等）外，梳理出自己系统的核心业务，添加告警，增强系统的稳定性，做到未雨绸缪，防患于未然。

### 参考文献

> [Prometheus 官方文档](https://link.juejin.cn?target=https%3A%2F%2Fprometheus.io%2Fdocs%2Fintroduction%2Foverview%2F "https://prometheus.io/docs/introduction/overview/") [grafana 告警 文档](https://link.juejin.cn?target=https%3A%2F%2Fgrafana.com%2Fdocs%2Fgrafana%2Flatest%2Falerting%2F "https://grafana.com/docs/grafana/latest/alerting/")

推荐阅读
----

[MVCC与数据库锁](https://juejin.cn/post/7215226343713112125 "https://juejin.cn/post/7215226343713112125")

[浅谈“分布式锁”](https://juejin.cn/post/7213362932423245861 "https://juejin.cn/post/7213362932423245861")

[浅析基于Spring Security 的身份认证流程](https://juejin.cn/post/7212616585768714299 "https://juejin.cn/post/7212616585768714299")

[MySQL - InnoDB 内存结构解析](https://juejin.cn/post/7210028235621974071 "https://juejin.cn/post/7210028235621974071")

[浅谈AI目标检测技术发展史](https://juejin.cn/post/7208188644293525541 "https://juejin.cn/post/7208188644293525541")

招贤纳士
----

政采云技术团队（Zero），包含前端（ZooTeam）、后端、测试、UED 等，Base 在风景如画的杭州，一个富有激情、创造力和执行力的团队。团队现有500多名研发小伙伴，既有来自阿里、华为、网易的“老”兵，也有来自浙大、中科大、杭电等校的新人。团队在日常业务开发之外，还分别在云原生、区块链、人工智能、低代码平台、中间件、大数据、物料体系、工程平台、性能体验、可视化等领域进行技术探索和实践，推动并落地了一系列的内部技术产品，持续探索技术的新边界。此外，团队还纷纷投身社区建设，目前已经是 google flutter、scikit-learn、Apache Dubbo、Apache Rocketmq、Apache Pulsar、CNCF Dapr、Apache DolphinScheduler、alibaba Seata 等众多优秀开源社区的贡献者。

如果你想改变一直被事折腾，希望开始折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊……如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的技术团队的成长过程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 [zcy-tc@cai-inc.com](https://link.juejin.cn?target=mailto%3Azcy-tc%40cai-inc.com "mailto:zcy-tc@cai-inc.com")

微信公众号
-----

文章同步发布，政采云技术团队公众号，欢迎关注

![文章顶部.png](/images/jueJin/64412602cc6c4f3.png)