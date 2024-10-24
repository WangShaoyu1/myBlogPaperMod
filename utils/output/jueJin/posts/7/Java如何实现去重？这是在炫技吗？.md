---
author: "Java3y"
title: "Java如何实现去重？这是在炫技吗？"
date: 2023-06-05
description: "由于去重逻辑重构了几次，好多股东直呼看不懂，于是我今天再安排一波对代码的解析吧。austin支持两种去重的类型：N分钟相同内容达到N次去重和一天内N次相同渠道频次去重。 在最开始，我"
tags: ["后端","GitHub","Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:146,comments:44,collects:280,views:33451,"
---
大家好，我3y啊。由于去重逻辑重构了几次，好多股东直呼看不懂，于是我今天再安排一波对代码的解析吧。`austin`支持两种去重的类型：**N分钟相同内容达到N次**去重和**一天内N次相同渠道频次**去重。

> **Java开源项目消息推送平台🔥推送下发【邮件】【短信】【微信服务号】【微信小程序】【企业微信】【钉钉】等消息类型**。
> 
> *   [gitee.com/zhongfuchen…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fzhongfucheng%2Faustin%2F "https://gitee.com/zhongfucheng/austin/")
> *   [github.com/ZhongFuChen…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2Faustin "https://github.com/ZhongFuCheng3y/austin")

在最开始，我的第一版实现是这样的：

```java
    public void duplication(TaskInfo taskInfo) {
// 配置示例:{"contentDeduplication":{"num":1,"time":300},"frequencyDeduplication":{"num":5}}
JSONObject property = JSON.parseObject(config.getProperty(DEDUPLICATION_RULE_KEY, AustinConstant.APOLLO_DEFAULT_VALUE_JSON_OBJECT));
JSONObject contentDeduplication = property.getJSONObject(CONTENT_DEDUPLICATION);
JSONObject frequencyDeduplication = property.getJSONObject(FREQUENCY_DEDUPLICATION);
​
// 文案去重
DeduplicationParam contentParams = DeduplicationParam.builder()
.deduplicationTime(contentDeduplication.getLong(TIME))
.countNum(contentDeduplication.getInteger(NUM)).taskInfo(taskInfo)
.anchorState(AnchorState.CONTENT_DEDUPLICATION)
.build();
contentDeduplicationService.deduplication(contentParams);
​
​
// 运营总规则去重(一天内用户收到最多同一个渠道的消息次数)
Long seconds = (DateUtil.endOfDay(new Date()).getTime() - DateUtil.current()) / 1000;
DeduplicationParam businessParams = DeduplicationParam.builder()
.deduplicationTime(seconds)
.countNum(frequencyDeduplication.getInteger(NUM)).taskInfo(taskInfo)
.anchorState(AnchorState.RULE_DEDUPLICATION)
.build();
frequencyDeduplicationService.deduplication(businessParams);
}
```

那时候很简单，基本主体逻辑都写在这个入口上了，应该都能看得懂。后来，群里滴滴哥表示这种代码不行，不能一眼看出来它干了什么。于是**怒提了**一波`pull request`重构了一版，入口是这样的：

```java
    public void duplication(TaskInfo taskInfo) {
    
// 配置样例：{"contentDeduplication":{"num":1,"time":300},"frequencyDeduplication":{"num":5}}
String deduplication = config.getProperty(DeduplicationConstants.DEDUPLICATION_RULE_KEY, AustinConstant.APOLLO_DEFAULT_VALUE_JSON_OBJECT);

//去重
DEDUPLICATION_LIST.forEach(
    key -> {
    DeduplicationParam deduplicationParam = builderFactory.select(key).build(deduplication, key);
        if (deduplicationParam != null) {
        deduplicationParam.setTaskInfo(taskInfo);
        DeduplicationService deduplicationService = findService(key + SERVICE);
        deduplicationService.deduplication(deduplicationParam);
    }
}
);
}
```

我猜想他的思路就是把**构建去重参数**和**选择具体的去重服务**给封装起来了，在最外层的代码看起来就很简洁了。后来又跟他聊了下，他的设计思路是这样的：**考虑到以后会有其他规则的去重就把去重逻辑单独封装起来了，之后用策略模版的设计模式进行了重构，重构后的代码 模版不变，支持各种不同策略的去重，扩展性更高更强更简洁**

**确实牛逼**。

我基于上面的思路微改了下入口，代码最终演变成这样：

```java
    public void duplication(TaskInfo taskInfo) {
// 配置样例：{"deduplication_10":{"num":1,"time":300},"deduplication_20":{"num":5}}
String deduplicationConfig = config.getProperty(DEDUPLICATION_RULE_KEY, CommonConstant.EMPTY_JSON_OBJECT);
​
// 去重
List<Integer> deduplicationList = DeduplicationType.getDeduplicationList();
    for (Integer deduplicationType : deduplicationList) {
    DeduplicationParam deduplicationParam = deduplicationHolder.selectBuilder(deduplicationType).build(deduplicationConfig, taskInfo);
        if (Objects.nonNull(deduplicationParam)) {
        deduplicationHolder.selectService(deduplicationType).deduplication(deduplicationParam);
    }
}
}
```

到这，应该大多数人还能跟上吧？在讲具体的代码之前，我们先来简单看看去重功能的代码结构（这会对后面看代码有帮助）

![](/images/jueJin/97ae2a43eb3d4b3.png)

去重的逻辑可以**统一抽象**为：在**X时间段**内达到了**Y阈值**，还记得我曾经说过：**「去重」的本质：「业务Key」+「存储」**。那么去重实现的步骤可以简单分为（我这边存储就用的Redis）：

*   通过`Key`从`Redis`获取记录
*   判断该`Key`在`Redis`的记录是否符合条件
*   符合条件的则去重，不符合条件的则重新塞进`Redis`更新记录

为了方便调整去重的参数，我把**X时间段**和**Y阈值**都放到了配置里`{"deduplication_10":{"num":1,"time":300},"deduplication_20":{"num":5}}`。目前有两种去重的具体实现：

1、5分钟内相同用户如果收到相同的内容，则应该被过滤掉

2、一天内相同的用户如果已经收到某渠道内容5次，则应该被过滤掉

从配置中心拿到配置信息了以后，`Builder`就是根据这两种类型去构建出`DeduplicationParam`，就是以下代码：

```java
DeduplicationParam deduplicationParam = deduplicationHolder.selectBuilder(deduplicationType).build(deduplicationConfig, taskInfo);
```

`Builder`和`DeduplicationService`都用了类似的写法（**在子类初始化的时候指定类型，在父类统一接收，放到Map里管理**）

![](/images/jueJin/81306202e7a240b.png)

![](/images/jueJin/649dc5b105cd4fe.png)

而统一管理着这些服务有个中心的地方，我把这取名为`DeduplicationHolder`

```java
/**
* @author huskey
* @date 2022/1/18
*/
@Service
    public class DeduplicationHolder {
    ​
    private final Map<Integer, Builder> builderHolder = new HashMap<>(4);
    private final Map<Integer, DeduplicationService> serviceHolder = new HashMap<>(4);
    ​
        public Builder selectBuilder(Integer key) {
        return builderHolder.get(key);
    }
    ​
        public DeduplicationService selectService(Integer key) {
        return serviceHolder.get(key);
    }
    ​
        public void putBuilder(Integer key, Builder builder) {
        builderHolder.put(key, builder);
    }
    ​
        public void putService(Integer key, DeduplicationService service) {
        serviceHolder.put(key, service);
    }
}
```

前面提到的业务Key，是在`AbstractDeduplicationService`的子类下构建的：

![](/images/jueJin/d2046697594143b.png)

而具体的去重逻辑实现则都在`LimitService`下，{一天内相同的用户如果已经收到某渠道内容5次}是在`SimpleLimitService`中处理使用`mget`和`pipelineSetEX`就完成了实现。而{5分钟内相同用户如果收到相同的内容}是在`SlideWindowLimitService`中处理，使用了`lua`脚本完成了实现。

![](/images/jueJin/a5b16e89d3904d8.png)

`LimitService`的代码都来源于@[caolongxiu](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fcaolongxiu "https://gitee.com/caolongxiu")的`pull request`，**建议大家可以对比`commit`再学习一番**：[gitee.com/zhongfuchen…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fzhongfucheng%2Faustin%2Fpulls%2F19 "https://gitee.com/zhongfucheng/austin/pulls/19")

> 1、频次去重采用普通的计数去重方法，限制的是每天发送的条数。 2、内容去重采用的是新开发的基于`redis`中`zset`的滑动窗口去重，**可以做到严格控制单位时间内的频次**。 3、`redis`使用`lua`脚本来保证原子性和减少网络`io`的损耗 4、`redis`的`key`增加前缀做到数据隔离（后期可能有动态更换去重方法的需求） 5、把具体限流去重方法从`DeduplicationService`抽取出来，`DeduplicationService`只需设置构造器注入时注入的`AbstractLimitService`（具体限流去重服务）类型即可动态更换去重的方法 6、使用雪花算法生成`zset`的唯一`value`,`score`使用的是当前的时间戳

针对滑动窗口去重，有会引申出新的问题：**limit.lua的逻辑？为什么要移除时间窗口的之前的数据？为什么ARGV\[4\]参数要唯一？为什么要expire？**

![](/images/jueJin/9559bf4d73ba466.png)

**A:** 使用**滑动窗口**可以保证N分钟达到N次进行去重。滑动窗口可以回顾下`TCP`的，也可以回顾下刷`LeetCode`时的一些题，那这为什么要移除，就不陌生了。

为什么`ARGV[4]`要唯一，具体可以看看`zadd`这条命令，我们只需要保证每次`add`进窗口内的成员是唯一的，那么就**不会触发有更新的操作**（我认为这样设计会更加简单些），而唯一Key用雪花算法比较方便。

为什么`expire`？，如果这个`key`只被调用一次。那就很有可能在`redis`内存常驻了，`expire`能避免这种情况。

> **如果想学Java项目的，**强烈推荐**我的项目**消息推送平台Austin（8K stars）**，可以用作**毕业设计\*\*，可以用作**校招**，可以看看**生产环境是怎么推送消息**的。消息推送平台🔥推送下发【邮件】【短信】【微信服务号】【微信小程序】【企业微信】【钉钉】等消息类型\*\*。
> 
> *   [gitee.com/zhongfuchen…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fzhongfucheng%2Faustin%2F "https://gitee.com/zhongfucheng/austin/")
> *   [github.com/ZhongFuChen…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2Faustin "https://github.com/ZhongFuCheng3y/austin")