---
author: "Java3y"
title: "Kafka丢数据、重复消费、顺序消费的问题"
date: 2021-09-01
description: "面试官：今天我想问下，你觉得Kafka会丢数据吗？ 候选者：嗯，使用Kafka时，有可能会有以下场景会丢消息 候选者：比如说，我们用Producer发消息至Broker的时候，就有可能会丢消息 候选者"
tags: ["后端","Java","Java EE中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:56,comments:0,collects:109,views:6518,"
---
**面试官**：今天我想问下，你觉得**Kafka会丢数据吗？**

**候选者**：嗯，使用Kafka时，有可能会有以下场景会丢消息

**候选者**：比如说，我们用Producer发消息至Broker的时候，就有可能会丢消息

**候选者**：如果你不想丢消息，那在发送消息的时候，需要选择带有 callBack的api进行发送

**候选者**：其实就意味着，如果你发送成功了，会回调告诉你已经发送成功了。如果失败了，那收到回调之后自己在业务上做重试就好了。

**候选者**：等到把消息发送到Broker以后，也有可能丢消息

**候选者**：一般我们的线上环境都是集群环境下嘛，但可能你发送的消息后broker就挂了，这时挂掉的broker还没来得及把数据同步给别的broker，数据就自然就丢了

**候选者**：发送到Broker之后，也不能保证数据就一定不丢了，毕竟Broker会把数据存储到磁盘之前，走的是操作系统缓存

**候选者**：也就是异步刷盘这个过程还有可能导致数据会丢

![](/images/jueJin/341da3983df04c4.png)

**候选者**：嗯，到这里其实我已经说了三个场景了，分别是：producer -> broker ，broker->broker之间同步，以及broker->磁盘

**候选者**：要解决上面所讲的问题也比较简单，这块也没什么好说的...

**候选者**：不想丢数据，那就使用带有callback的api，设置 acks、retries、factor等等些参数来保证Producer发送的消息不会丢就好啦。

**面试官**：嗯...

**候选者**：一般来说，还是client 消费 broker 丢消息的场景比较多

**面试官**：**那你们在消费数据的时候是怎么保证数据的可靠性的呢？**

**候选者**：首先，要想client端消费数据不能丢，肯定是不能使用autoCommit的，所以必须是手动提交的。

![](/images/jueJin/f7de338f7d7c44b.png)

**候选者**：我们这边是这样实现的：

**候选者**：一、从Kafka拉取消息（一次批量拉取500条，这里主要看配置）时

**候选者**：二、为每条拉取的消息分配一个msgId（递增）

**候选者**：三、将msgId存入内存队列（sortSet）中

**候选者**：四、使用Map存储msgId与msg(有offset相关的信息）的映射关系

**候选者**：五、当业务处理完消息后，ack时，获取当前处理的消息msgId，然后从sortSet删除该msgId（此时代表已经处理过了）

**候选者**：六、接着与sortSet队列的首部第一个Id比较（其实就是最小的msgId），如果当前msgId<=sort Set第一个ID，则提交当前offset

**候选者**：七、系统即便挂了，在下次重启时就会从sortSet队首的消息开始拉取，实现至少处理一次语义

**候选者**：八、会有少量的消息重复，但只要下游做好幂等就OK了。

![](/images/jueJin/c3aae748cca3499.png)

**面试官**：嗯，你也提到了幂等，你们这业务怎么实现幂等性的呢？

**候选者**：嗯，还是以处理订单消息为例好了。

**候选者**：幂等Key我们由订单编号+订单状态所组成（一笔订单的状态只会处理一次）

**候选者**：在处理之前，我们首先会去查Redis是否存在该Key，如果存在，则说明我们已经处理过了，直接丢掉

**候选者**：如果Redis没处理过，则继续往下处理，最终的逻辑是将处理过的数据插入到业务DB上，再到最后把幂等Key插入到Redis上

**候选者**：显然，单纯通过Redis是无法保证幂等的（：

**候选者**：所以，Redis其实只是一个「前置」处理，最终的幂等性是依赖数据库的唯一Key来保证的（唯一Key实际上也是订单编号+状态）

**候选者**：总的来说，就是通过Redis做前置处理，DB唯一索引做最终保证来实现幂等性的

![](/images/jueJin/b9ed84ca2a93489.png)

**面试官**：**你们那边遇到过顺序消费的问题吗？**

**候选者**：嗯，也是有的，我举个例子

**候选者**：订单的状态比如有 支付、确认收货、完成等等，而订单下还有计费、退款的消息报

**候选者**：理论上来说，支付的消息报肯定要比退款消息报先到嘛，但程序处理的过程中可不一定的嘛

**候选者**：所以在这边也是有消费顺序的问题

**候选者**：但在广告场景下不是「强顺序」的，只要保证最终一致性就好了。

**候选者**：所以我们这边处理「乱序」消息的实现是这样的：

**候选者**：一、宽表：将每一个订单状态，单独分出一个或多个独立的字段。消息来时只更新对应的字段就好，消息只会存在短暂的状态不一致问题，但是状态最终是一致的

**候选者**：二、消息补偿机制：另一个进行消费相同topic的数据，消息落盘，延迟处理。将消息与DB进行对比，如果发现数据不一致，再重新发送消息至主进程处理

**候选者**：还有部分场景，可能我们只需要把相同userId/orderId发送到相同的partition（因为一个partition由一个Consumer消费），又能解决大部分消费顺序的问题了呢。

![](/images/jueJin/dcf84b2a9bf7417.png)

**面试官**：嗯...懂了

![](/images/jueJin/5b052e2a7cb54a2.png)

欢迎关注我的微信公众号【**Java3y**】来聊聊Java面试

**[【对线面试官-移动端】系列](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fmp%2Fappmsgalbum%3F__biz%3DMzU4NzA3MTc5Mg%3D%3D%26action%3Dgetalbum%26album_id%3D1657204970858872832%23wechat_redirect "https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzU4NzA3MTc5Mg==&action=getalbum&album_id=1657204970858872832#wechat_redirect") 一周两篇持续更新中！**

**[【对线面试官-电脑端】系列](https://link.juejin.cn?target=http%3A%2F%2Fjavainterview.gitee.io%2Fluffy%2F "http://javainterview.gitee.io/luffy/") 一周两篇持续更新中！**

**原创不易！！求三连！！**