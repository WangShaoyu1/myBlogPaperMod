---
author: "政采云技术"
title: "深入分析 RocketMQ 的 push 消费方式实现"
date: 2023-11-09
description: "RocketMQ 作为一款纯 Java、分布式、队列模型的开源消息中间件，支持事务消息、顺序消息、批量消息、定时消息、消息回溯等。"
tags: ["后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读16分钟"
weight: 1
selfDefined:"likes:4,comments:0,collects:9,views:2154,"
---
![文章顶部.png](/images/jueJin/aaafc13f1d1e414.png)

![越千卡片.png](/images/jueJin/e9e3069e5f04422.png)

前言
--

RocketMQ 是阿里巴巴旗下一款开源的 MQ 框架，经历过双十一考验，由 Java 编程语言实现，有非常完整的生态系统。RocketMQ 作为一款纯 Java、分布式、队列模型的开源消息中间件，支持事务消息、顺序消息、批量消息、定时消息、消息回溯等。

RocketMQ 主要由以下四个部分组成:

![image-20230629195441660](/images/jueJin/75b1716f261940e.png)

核心概念简述
------

*   **NameServer**：可以理解为是一个注册中心，主要是用来保存 Topic 路由信息，管理 Broker，支持 Broker 的动态注册和发现，保存 Topic 和 Borker 之间的关系。在 NameServer 的集群中，NameServer 与 NameServer 之间是没有任何通信的。
*   **Broker**：核心的一个角色，主要是负责消息的存储、查询消费，在启动时会向 NameServer 进行注册。Broker 实例可以有很多个，相同的 BrokerName 可以称为一个 Broker 组，每个 Broker 组只保存一部分消息。
*   **Topic**：可以理解为一个消息的集合的名字，一个 Topic 可以分布在不同的 Broker 组下。
*   **队列（Queue）** ：一个 Topic 可以有很多队列，默认是一个 Topic 在同一个 Broker 组中是4个。如果一个Topic 在2个 Broker 组中，那么就有可能有8个队列。
*   **生产者**：生产消息的一方就是生产者。
*   **生产者组**：一个生产者组可以有很多生产者，只需要在创建生产者的时候指定生产者组，那么这个生产者就在那个生产者组。
*   **消费者**：用来消费生产者消息的一方。
*   **消费者组**：跟生产者一样，每个消费者都有所在的消费者组，一个消费者组可以有很多的消费者，不同的消费者组消费消息是互不影响的。

* * *

#### MQ 的消费方式

RocketMQ 消费方式就是指消费者如何从 MQ 中获取到消息，分为两种方式，Push（推方式）和 Pull（拉方式）。

#### Push（推方式）

Push，就是推消息。当 Broker 收到生产者的消息时，会主动的将消息推送给消费者端进行消费，这种消费模式就叫 Push，也就是 MQ 将消息推给到消费者的意思。

![image-20230629195441660](/images/jueJin/5ca16242fc6d44b.png)

Push（推方式）模式的优势就是响应速度快，消息的实时性比较高，一旦 Brocker 收到消息后，就能立马将消息推送给消费者，消费者也就能立马对收到的消息进行消费。

但是这种 Push 的消费模式存在一定的缺点，就是一旦消息量比较大时，对消费者性能要求较高，由于消费者无法控制 MQ 消息的推送速度，因此一旦消息量大，那么消费者消费的压力就比较大。

此外，Push 模式还会面临以下一些问题：

**1）** Broker 端需要维护 Consumer 的状态，这不利于 Broker 支持大量 Consumer 的场景。 **2）** Consumer 的消费速度是不一致的，单独通过 Broker 推送消息，难以处理不同的 Consumer 的状况。 **3）** Broker 难以处理 Consumer 无法消费消息的情况，因为Broker 无法确定 Consumer 只是暂时的故障还是永久性的故障。

**4）** 大量的推送消息会加重 Consumer 的负载，甚至冲垮 Consumer。

#### Pull（拉方式）

Pull 刚好跟 Push 相反，就是消费者主动去 MQ 中拉取消息。

![image-20230629195533433](/images/jueJin/175e8081efe04f3.png)

自然， Pull 的优缺点也和 Push 正好相反。消费者端可以根据自身的消费状态，来决定是否去拉消息，何时去拉消息，这种主动去 MQ 拉取消息的模式，使得消费者端的压力相对较小。但是，由于拉取的时机和频率需要自己控制，拉取频繁容易造成服务端和客户端的压力，拉取间隔长又容易造成消费不及时。

Pull模式由 Consumer 主动从 Broker 获取消息，其优点为： **1）** Broker 不再需要维护 Consumer 的状态（每一次 Pull 都包含了其实偏移量等必要的信息）。

**2）** 状态维护在 Consumer，所以 Consumer 可以很容易的根据自身的负载等状态来决定从 Broker 获取消息的频率。 **3）** 因为 Broker 无法预测写一条消息产生的时间，所以在收到消息之后只能立即推送给 Consumer，所以无法对消息聚合后再推送给 Consumer。 而 Pull 模式由 Consumer 主动来获取消息，每一次 Pull 时都尽可能多的获取已经在 Broker 上的消息。

此外，Pull 模式还会面临以下一些问题：

**1）** 实时性的问题，主动的拉取消息会产生无法预测的延迟，如果单纯提升 Pull 的执行频率，可能会造成大量的无效 Pull 请求，而频率过低时，就会造成消费的延迟。

#### RocketMQ 中对于这两种消费方式的调用方式

RocketMQ 作为阿里开源的一款高性能、功能丰富的 MQ，自然同时实现了 Push 和 Pull 的两种消费方式，用户可以选择在项目中使用 Push 还是 Pull。

![image-20231030201953285](/images/jueJin/770229a68cf840a.png)

在一般情况下，项目中都是使用 Push 的方式来消费，因为 Pull 除了时实性差外，Pull 方式还得让开发人员主动去维护消息消费进度，增加额外的操作。

所以接下来就着重讲一下 RocketMQ 是如何实现 Push 的逻辑。

RocketMQ 如何实现 Push
------------------

RocketMQ 通过一种伪 Push 的模式，实现了 Brocker 和 Comsumer 之间的实时性和压力平衡，而这种伪 Push 模式其底层还是基于 Pull 来实现的。这种实现方式就称之为长轮询机制。

### 轮询与长轮询

轮询和长轮询都是基于客户端主动向服务端发送请求来主动获取数据的方式，属于一种拉取数据的实现方式。

#### 轮询

轮询是指客户端每隔一定时间发送请求，无论服务端的数据是否有更新，都会返回给客户端。这种方式可能会造成大量无用的请求，浪费服务器的资源，并且可能造成数据的延迟。

#### 长轮询

长轮询是客户端发送请求给服务端，如果服务端有数据更新，则立即返回；如果服务端没有数据更新，则将请求保持住，直到有新数据时再返回给客户端。长轮询可以解决频繁请求但无更新数据的问题，同时也能够使消费者在有新数据到达时即时获取到数据，类似于推送的效果。

需要注意的是，长轮询可能会增加服务端代码实现的复杂度，但从效果上来看，它能够解决轮询频繁请求的问题，并具有一定的即时性。

### Push消费方式源码探究

![MQ流程](/images/jueJin/37e6b8f0a5f6490.png)

**消费者长轮询逻辑**

0.  消费者调用 PullKernelImpl 发送拉取请求，调用时用 BrokerSuspendMaxTimeMillis 指定了 Broker 挂起的最长时间，默认为 20s
1.  Broker 中 PullMessageProcess 处理拉取请求，从 ConsumeQueue 中查询消息。
2.  如果没有查询到消息，判断是否启用长轮询，调用 PullRequestHoldService#SuspendPullRequest() 方法将该请求挂起。
3.  PullRequestHoldService 线程 Run() 方法循环等待轮询时间，然后周期性调用 CheckHoldRequest() 方法检查挂起的请求是否有消息可以拉取。
4.  如果检查到有新消息可以拉取，调用 NotifyMessageArriving() 方法。
5.  ReputMessageService 的 DoReput() 如果被调用，说明也有新消息到达，需要唤醒挂起的拉取请求。这里也会发送一个 Notify，进而调用 NotifyMessageArriving() 方法。
6.  NotifyMessageArriving() 方法中也会查询 ConsumeQueue 的最大 Offset，如果确实有新消息，那么将唤醒对应的拉取请求，具体的方法是调用 ExecuteRequestWhenWakeup() 方法。
7.  ExecuteRequestWhenWakeup() 方法唤醒拉取请求，调用 ProcessRequest() 方法处理该请求。

##### 1.PullMessageService#PullMessage

```java
    private void pullMessage(final PullRequest pullRequest) {
    //从pullRequest中获取消费者组
    final MQConsumerInner consumer = this.mQClientFactory.selectConsumer(pullRequest.getConsumerGroup());
        if (consumer != null) {
        //强转为push模式消费者
        DefaultMQPushConsumerImpl impl = (DefaultMQPushConsumerImpl) consumer;
        //真正执行拉取消息的方法
        impl.pullMessage(pullRequest);
            } else {
            log.warn("No matched consumer for the PullRequest {}, drop it", pullRequest);
        }
    }
    /**
    * 处理拉取消息的请求
    */
    @Override
        public void run() {
        log.info(this.getServiceName() + " service started");
        ​
        //在它的run方法中，循环不断的从pullRequestQueue中阻塞式的获取并移除队列的头部数据，即拉取消息的请求，
        // 然后调用pullMessage方法根据该请求去broker拉取消息。
            while (!this.isStopped()) {
                try {
                PullRequest pullRequest = this.pullRequestQueue.take();
                //调用pullMessage方法
                this.pullMessage(pullRequest);
                    } catch (InterruptedException ignored) {
                        } catch (Exception e) {
                        log.error("Pull Message Service Run Method exception", e);
                    }
                }
                log.info(this.getServiceName() + " service end");
            }
```

在 Consumer 端， Push 模式的消息拉取由 PullMessageService 类实现， PullMessageService 继承了 ServiceThread 类，并实现了 Run 方法，通过异步的方式，循环从 PullRequestQueue 中阻塞式的获取并移除队列头部的数据，最终调用了 DefaultMQPushConsumerImpl 类的 PullMessage 方法。其中，PullRequestQueue 队列是在负载均衡之时对于新分配到的消息队列而创建的，因此只要该队列中有拉取的请求，就会去 Brocker 拉取消息，如果没有就会阻塞。

##### 2.DefaultMQPushConsumerImpl#pullMessage

```scss
/**
* 处理正在拉取消息的代码
*/
    public void pullMessage(final PullRequest pullRequest) {
    //服务状态校验
    //...
    //流控校验
    //获得processQueue中已缓存的消息总数量
    long cachedMessageCount = processQueue.getMsgCount().get();
    //获取processQueue中已缓存的消息总大小MB
    long cachedMessageSizeInMiB = processQueue.getMsgSize().get() / (1024 * 1024);
    ​
    // 判断还未消息的数量，数量太多就等会再执行重新执行拉取消息的逻辑.
        if (cachedMessageCount > this.defaultMQPushConsumer.getPullThresholdForQueue()) {
        // 等会再执行重新执行拉取消息的逻辑.
        this.executePullRequestLater(pullRequest, PULL_TIME_DELAY_MILLS_WHEN_FLOW_CONTROL);
            if ((queueFlowControlTimes++ % 1000) == 0) {
            log.warn("the cached message count exceeds the threshold {}, so do flow control, minOffset={}, maxOffset={}, count={}, size={} MiB, pullRequest={}, flowControlTimes={}",
            this.defaultMQPushConsumer.getPullThresholdForQueue(), processQueue.getMsgTreeMap().firstKey(), processQueue.getMsgTreeMap().lastKey(), cachedMessageCount, cachedMessageSizeInMiB, pullRequest, queueFlowControlTimes);
        }
        return;
    }
    ​
    // 判断还未消息的大小，如果还未消息的消息占用的内存过大，就等会再执行重新执行拉取消息的逻辑.
        if (cachedMessageSizeInMiB > this.defaultMQPushConsumer.getPullThresholdSizeForQueue()) {
        // 等会再执行重新执行拉取消息的逻辑.
        this.executePullRequestLater(pullRequest, PULL_TIME_DELAY_MILLS_WHEN_FLOW_CONTROL);
            if ((queueFlowControlTimes++ % 1000) == 0) {
            log.warn("the cached message size exceeds the threshold {} MiB, so do flow control, minOffset={}, maxOffset={}, count={}, size={} MiB, pullRequest={}, flowControlTimes={}",
            this.defaultMQPushConsumer.getPullThresholdSizeForQueue(), processQueue.getMsgTreeMap().firstKey(), processQueue.getMsgTreeMap().lastKey(), cachedMessageCount, cachedMessageSizeInMiB, pullRequest, queueFlowControlTimes);
        }
        return;
    }
    //...
    //顺序消费和并发消费的校验
    //调用pullAPIWrapper.pullKernelImpl方法,拉取消息
}

```

承接上文，这里是 DefaultMQPushConsumerImpl 的 PullMessage 方法的源码，该类中主要做了以下操作:

0.  服务状态校验。在拉取消息之前，会对消费者的状态进行校验，如果消费者已被丢弃或者处于暂停状态，会延迟发送拉取消息的请求。
    
1.  流控校验。当消费者准备去拉消息的时候，会先去判断当前消费者消费的压力再决定是否去拉取消息。
    
    RocketMQ 提供了两种判断消费压力逻辑，一种是基于还未消费的消息的数量的大小，还有一种是基于还未消费的消息所占内存的大小。
    
    *   判断还未消费消息的数量，数量 > 1000 就等会等待 50ms，并将此次 Pull 请求放回队列中，Return 掉。并再执行重新执行拉取消息的逻辑
    *   判断还未消费消息的大小，如果还未消息的消息占用的内存过大 > 100mb，就等会再执行重新执行拉取消息的逻辑
2.  顺序消费和并发消费的校验。根据消费模式的不同，对消费消息的顺序性进行校验。如果是并发消费且未消费消息的offset跨度大于设定的阈值，则延迟发送拉取消息的请求。如果是顺序消费并且之前未锁定消费点位置，则需要设置消费点位。
    
3.  创建拉取消息的回调函数对象 PullCallback，在真正进行拉取消息的请求之前，会创建一个回调函数对象，用于在拉取请求返回后执行相应的回调操作。
    
4.  判断是否允许将消费点位上报给 Broker 进行持久化。如果是集群消费模式且本地内存中存在与当前消息队列相关的消费进度信息，则设置 CommitOffsetEnable 为 True，表示在拉取消息时可以将消费点位上报给 Broker 进行持久化。
    
5.  调用 PullAPIWrapper.PullKernelImpl() 方法来实际执行拉取消息的操作。
    
    这些步骤用于确保在拉取消息的过程中能够满足各种校验条件，并实现消息的可靠消费和流量控制等功能。
    

##### **3.PullRequestHoldService#SuspendPullRequest**

```ini
/*****************PullMessageProcessor#processRequest*****************/
case ResponseCode.PULL_NOT_FOUND:
// 消息没找到，如果允许请求挂起的话，那么就会将请求挂起，等有消息的时候，再将消息返回给客户端.
    if (brokerAllowSuspend && hasSuspendFlag) {
    long pollingTimeMills = suspendTimeoutMillisLong;
        if (!this.brokerController.getBrokerConfig().isLongPollingEnable()) {
        pollingTimeMills = this.brokerController.getBrokerConfig().getShortPollingTimeMills();
    }
    String topic = requestHeader.getTopic();
    long offset = requestHeader.getQueueOffset();
    int queueId = requestHeader.getQueueId();
    PullRequest pullRequest = new PullRequest(request, channel, pollingTimeMills,
    this.brokerController.getMessageStore().now(), offset, subscriptionData, messageFilter);
    // 将拉消息的请求存起来
    this.brokerController.getPullRequestHoldService().suspendPullRequest(topic, queueId, pullRequest);
    // response 设置为null，就不会给客户端响应的意思
    response = null;
    break;
}
​
/********************PullRequestHoldService#suspendPullRequest**************************/
​
​
protected ConcurrentMap<String, ManyPullRequest> pullRequestTable =
new ConcurrentHashMap<String, ManyPullRequest>(1024);
​
/**
* 将拉取消息的请求挂起
*
* @param topic
* @param queueId
* @param pullRequest
*/
    public void suspendPullRequest(final String topic, final int queueId, final PullRequest pullRequest) {
    String key = this.buildKey(topic, queueId);
    ManyPullRequest mpr = this.pullRequestTable.get(key);
        if (null == mpr) {
        mpr = new ManyPullRequest();
        ManyPullRequest prev = this.pullRequestTable.putIfAbsent(key, mpr);
            if (prev != null) {
            mpr = prev;
        }
    }
    mpr.addPullRequest(pullRequest);
}
```

如果在 Broker 端中没有查询到消息，会通过响应码为 ResponseCode.PULL\_NOT\_FOUND 的代码块，并且启动长轮询。该代码块会调用 PullRequestHoldService 类的 SuspendPullRequest 方法将拉取消息的请求存储起来。PullRequestHoldService 是用来存储拉取请求的类，该方法会将请求进行分类并放在一个 ConcurrentHashMap 中。

##### **4.PullRequestHoldService#NotifyMessageArriving**

```java
    protected void checkHoldRequest() {
        for (String key : this.pullRequestTable.keySet()) {
        String[] kArray = key.split(TOPIC_QUEUEID_SEPARATOR);
            if (2 == kArray.length) {
            String topic = kArray[0];
            int queueId = Integer.parseInt(kArray[1]);
            //获取 这个topic 的 这个queueId的queue消息的最大的offset
            final long offset = this.brokerController.getMessageStore().getMaxOffsetInQueue(topic, queueId);
                try {
                //尝试唤醒等待线程.
                this.notifyMessageArriving(topic, queueId, offset);
                    } catch (Throwable e) {
                    log.error("check hold request failed. topic={}, queueId={}", topic, queueId, e);
                }
            }
        }
    }
    /**
    * 这个方法也会在 {@link NotifyMessageArrivingListener} 中调用，意思就是一旦有消息来了，那么就尝试唤醒长轮询的请求
    */
    public void notifyMessageArriving(final String topic, final int queueId, final long maxOffset, final Long tagsCode,
        long msgStoreTime, byte[] filterBitMap, Map<String, String> properties) {
        String key = this.buildKey(topic, queueId);
        ManyPullRequest mpr = this.pullRequestTable.get(key);
            if (mpr != null) {
            List<PullRequest> requestList = mpr.cloneListAndClear();
                if (requestList != null) {
                List<PullRequest> replayList = new ArrayList<PullRequest>();
                    for (PullRequest request : requestList) {
                    long newestOffset = maxOffset;
                        if (newestOffset <= request.getPullFromThisOffset()) {
                        //传过来的offset小于请求拉取消息的起始的offset，那么就重新读取消息最大的offset
                        //这一步其实是为了保证一定能拉取的需要的消息
                        newestOffset = this.brokerController.getMessageStore().getMaxOffsetInQueue(topic, queueId);
                    }
                    ​
                        if (newestOffset > request.getPullFromThisOffset()) {
                        //只有当队列消息最大的offset大于消费者需要拉取的消息的offset，那么才执行
                        //其实很好理解，假设当前队列消息的最大offset是10，但是消费者要拉取第11位的消息，那么此时肯定没有消息，就不用处理了
                        boolean match = request.getMessageFilter().isMatchedByConsumeQueue(tagsCode,
                        new ConsumeQueueExt.CqExtUnit(tagsCode, msgStoreTime, filterBitMap));
                        // match by bit map, need eval again when properties is not null.
                            if (match && properties != null) {
                            match = request.getMessageFilter().isMatchedByCommitLog(null, properties);
                        }
                        ​
                            if (match) {
                                try {
                                // 重新执行一遍拉取的请求，这样就能拉取到消息了.
                                this.brokerController.getPullMessageProcessor().executeRequestWhenWakeup(
                                request.getClientChannel(),request.getRequestCommand());
                                    } catch (Throwable e) {
                                    log.error("execute request when wakeup failed.", e);
                                }
                                continue;
                            }
                            //...
                        }
                        //...
                    }
                }
            }
```

在 Broker 端，存在 PullRequestHoldService 服务来管理长轮询请求的线程。当一个拉取请求被挂起时，它将被保存在这个服务中。每隔一段时间（长轮询或短轮询等待时间），该服务会检查挂起的请求中是否有可拉取的消息。

PullRequestHoldService 会从本地缓存变量 PullRequestTable 中获取 PullRequest 请求，并检查条件是否满足轮询条件（待拉取消息的偏移量是否小于消费队列的最大偏移量）。如果条件成立，表示 Broker 端有新消息到达，那么就会通过 PullMessageProcessor 的 ExecuteRequestWhenWakeup() 方法重新尝试发起 Pull 消息的 RPC 请求。

在 ExecuteRequestWhenWakeup() 方法中，会通过业务线程池 PullMessageExecutor 异步提交重新 Pull 消息的请求任务。这个任务会再次调用 PullMessageProcessor 的 ProcessRequest() 方法，实现对 Pull 消息请求的二次处理。

这样的设计可以确保在长轮询过程中，当有新消息到达 Broker 端时，能够及时触发重新 Pull 消息的请求，使消费者能够即时获取到新消息。同时，通过异步提交任务的方式，避免了阻塞主线程，提高了系统的并发处理能力。

总结
--

本次讲解了 DefaultMQPushConsumer 消费者客户端如何发起的拉取消息请求。

大多数消息队列系统无论是 Pull 还是 Push 机制，都借鉴了一些共同的理念和思想，特别是在处理大量消息和保证消息可靠性方面的问题。类似的机制，在其他系统中也会得到应用，如 Nacos 中的 Push 和长轮询机制。

虽然在具体实现上可能会有所不同，但这些方法背后的思想相似，都是为了确保消息在传递的过程中能够高效、可靠地被处理，同时保证系统性能的高效性。对于这些机制的理解和掌握，对于开发人员来说是非常重要的。

推荐阅读
----

[浅谈MySQL分页查询的工作原理](https://juejin.cn/post/7298904569057001498 "https://juejin.cn/post/7298904569057001498")

[shardingjdbc启动优化](https://juejin.cn/post/7298241165526319113 "https://juejin.cn/post/7298241165526319113")

[权限管理——多系统下的数据权限通用控制](https://juejin.cn/post/7296373915541667874 "https://juejin.cn/post/7296373915541667874")

[SpringBoot自动装配](https://juejin.cn/post/7296037630558060553 "https://juejin.cn/post/7296037630558060553")

[Java线程和CPU调度](https://juejin.cn/post/7295669711533817893 "https://juejin.cn/post/7295669711533817893")

招贤纳士
----

政采云技术团队（Zero），Base 杭州，一个富有激情和技术匠心精神的成长型团队。规模 500 人左右，在日常业务开发之外，还分别在云原生、区块链、人工智能、低代码平台、中间件、大数据、物料体系、工程平台、性能体验、可视化等领域进行技术探索和实践，推动并落地了一系列的内部技术产品，持续探索技术的新边界。此外，团队还纷纷投身社区建设，目前已经是 google flutter、scikit-learn、Apache Dubbo、Apache Rocketmq、Apache Pulsar、CNCF Dapr、Apache DolphinScheduler、alibaba Seata 等众多优秀开源社区的贡献者。

如果你想改变一直被事折腾，希望开始折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊……如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的技术团队的成长过程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 [zcy-tc@cai-inc.com](https://link.juejin.cn?target=mailto%3Azcy-tc%40cai-inc.com "mailto:zcy-tc@cai-inc.com")

微信公众号
-----

文章同步发布，政采云技术团队公众号，欢迎关注 ![文章顶部.png](/images/jueJin/aaafc13f1d1e414.png)