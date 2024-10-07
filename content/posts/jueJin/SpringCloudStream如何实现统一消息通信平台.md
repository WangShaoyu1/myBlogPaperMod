---
author: "职略"
title: "SpringCloudStream如何实现统一消息通信平台"
date: 2024-04-09
description: "SpringCloudStream是Spring家族提供的消息通信框架，而消息通信也是我们在分布式系统构建过程中的一个重要技术组件。然而，和普通的消息中间件不同，SpringCloudStre"
tags: ["Java"]
ShowReadingTime: "阅读13分钟"
weight: 255
---
Spring Cloud Stream是Spring家族提供的消息通信框架，而消息通信也是我们在分布式系统构建过程中的一个重要技术组件。然而，和普通的消息中间件不同，Spring Cloud Stream为开发人员提供的是一种跨消息中间件的统一消息通信平台。那么，它是如何做到这一点的呢？这是一个很好的话题，本文内容将围绕这一话题展开讨论。

我们知道，在分布式系统设计和开发过程中，服务与服务之间可以通过RPC实现交互。但是，RPC虽然实现起来比较简单，但却是一种耦合度较高的实现技术。为了降低服务与服务之间的耦合度，有时候我们需要引入消息通信机制，采用异步的方式来完成不同服务之间的交互。讲到这里，你可能会说，这不就是消息中间件能解决的问题吗？答案是肯定的，但还不够。

我们知道常见的消息通信规范以及中间件有很多种，代表性的规范有JMS和AMQP，对应的实现框架包括ActiveMQ和RabbitMQ等，而Kafka、RocketMQ等工具并不遵循特定的规范但也提供了消息通信的实现方案。显然，这些中间件的使用方式是完全不同的。那么，如何屏蔽这些中间件在使用上的差别，从而为开发人员提供了一套统一且高效的消息发送和接收API，这是我们今天要讨论的问题，如下图所示。

  ![1.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81733df67ce24765ab4b28bd2ec00e6d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=664&h=352&s=53628&e=jpg&b=fefaf9)

围绕统一消息平台的设计和实现，我们需要明确的是所采用的技术体系。目前，针对这个主题，我们可以参考和借鉴的框架并不多，而Spring家族中的Spring Cloud Stream是其中的代表。Spring Cloud Stream对整个消息发布和消费过程做了高度抽象，并提供了一系列核心组件，包括Binder、Channel、Source和Sink等。

让我们基于具体框架来分析底层的实现原理。在Spring Cloud Stream中，真正完成与对不同消息中间件之间的集成的是Binder组件。而不同的消息中间件具有不同的API，所以在Binder组件的设计和实现过程中，一方面需要考虑抽象，另一方面也需要针对不同中间件的特性来完成底层的交互过程。这部分内容是我们需要掌握的重点，值得深入进行学习，对于自身架构设计能力的提升有很大帮助。

消息通信技术体系
--------

### Spring家族中的消息通信解决方案

在Spring家族中，与消息通信机制相关的框架有三个，分别是Spring Messaging、Spring Integration和Spring Cloud Steam。事实上，Spring Cloud中的Spring Cloud Stream是基于Spring Integration实现了消息发布和消费机制并提供了一层封装，很多关于消息发布和消费的概念和实现方法本质上都是依赖于Spring Integration。而在Spring Integration的背后，则依赖于Spring Messaging组件来实现消息处理机制的基础设施。这三个框架之间的依赖关系如下图所示。

![2.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/caaff0cecd424577b8ad082c4cb0fcef~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=499&h=384&s=53356&e=jpg&b=fef8f6)

从依赖关系上讲，Spring Messaging 是Spring家族中处理消息通信的底层框架。而Spring Integration在定位上属于一种企业服务总线，依赖于Spring Messaging。因此，我们先来介绍Spring Messaging。

Spring Messaging是Spring框架内置的一个模块，提供了最基本的消息通信API，其中，消息这个概念由Message接口进行表示，包括一个消息头Header和一个消息体Payload，如下所示。

public interface Message {

T getPayload();

MessageHeaders getHeaders();

}  

而消息通道MessageChannel的定义也比较简单，只包含了一个用来发送消息的send方法，如下所示。

public interface MessageChannel {

long INDEFINITE\_TIMEOUT = -1;

default boolean send(Message<?> message) {

return send(message, INDEFINITE\_TIMEOUT);

}

boolean send(Message<?> message, long timeout);

}

Spring Messaging把通道抽象成两种基本的表现形式，即支持轮询的PollableChannel和实现发布-订阅模式的SubscribableChannel，这两个通道都继承自具有消息发送功能的MessageChannel，如下所示。

public interface PollableChannel extends MessageChannel {

    Message<?> receive();

    Message<?> receive(long timeout);

}

public interface SubscribableChannel extends MessageChannel {

    boolean subscribe(MessageHandler handler);

    boolean unsubscribe(MessageHandler handler);

}

注意到对于PollableChannel而言才有receive的概念，代表通过轮询操作主动获取消息的过程。而SubscribableChannel则是通过注册回调函数MessageHandler来实现事件响应。MessageHandler接口定义如下所示。

public interface MessageHandler {

void handleMessage(Message<?> message) throws MessagingException;

}

在Spring家族中，Spring Integration是对Spring Messaging的扩展，提供了对《企业集成模式：设计、构建及部署消息通信解决方案》一书中各种企业集成模式的支持，通常被认为是一种ESB（Enterprise Service Bus，企业服务总线）框架。而Spring Cloud Stream则是Spring Integration的一种增强。我们先来看一下Spring Cloud Stream中与Spring Integration相关的内容。

在Spring Cloud Stream中，存在一组Source和Sink接口，其中Source接口的定义如下所示。注意到这里通过Spring Messaging提供的MessageChannel来对外发送消息。

public interface Source {

String OUTPUT = "output";

@Output(Source.OUTPUT)

MessageChannel output();

}

类似的，Sink接口定义如下所示，通过Spring [Messaging中的SubscribableChannel实现对来自外部消息的接收。](https://link.juejin.cn?target=mailto%3AMessaging%25E4%25B8%25AD%25E7%259A%2584SubscribableChannel%25E6%259D%25A5%25E5%25AE%259E%25E7%258E%25B0%25E6%25B6%2588%25E6%2581%25AF%25E6%258E%25A5%25E6%2594%25B6%25EF%25BC%258C%25E8%2580%258C%40Input%25E6%25B3%25A8%25E8%25A7%25A3%25EF%25BC%2588%40Input%25E6%25B3%25A8%25E8%25A7%25A3%25E5%2592%258C%25E5%2589%258D%25E9%259D%25A2%25E4%25BB%258B%25E7%25BB%258D%25E7%259A%2584%40Output%25E6%25B3%25A8%25E8%25A7%25A3%25E9%2583%25BD%25E4%25BD%258D%25E4%25BA%258Erg.springframework.cloud.stream.annotation%25E5%258C%2585%25E4%25B8%25AD%25EF%25BC%2589%25E5%25AE%259A%25E4%25B9%2589%25E4%25BA%2586%25E4%25B8%2580%25E4%25B8%25AA%25E8%25BE%2593%25E5%2585%25A5%25E9%2580%259A%25E9%2581%2593%25EF%25BC%258C%25E5%25BA%2594%25E7%2594%25A8%25E9%2580%259A%25E8%25BF%2587%25E8%25AF%25A5%25E8%25BE%2593%25E5%2585%25A5%25E9%2580%259A%25E9%2581%2593%25E6%258E%25A5%25E6%2594%25B6%25E6%259D%25A5%25E8%2587%25AA%25E5%25A4%2596%25E9%2583%25A8%25E7%259A%2584%25E6%25B6%2588%25E6%2581%25AF%25E3%2580%2582 "mailto:Messaging%E4%B8%AD%E7%9A%84SubscribableChannel%E6%9D%A5%E5%AE%9E%E7%8E%B0%E6%B6%88%E6%81%AF%E6%8E%A5%E6%94%B6%EF%BC%8C%E8%80%8C@Input%E6%B3%A8%E8%A7%A3%EF%BC%88@Input%E6%B3%A8%E8%A7%A3%E5%92%8C%E5%89%8D%E9%9D%A2%E4%BB%8B%E7%BB%8D%E7%9A%84@Output%E6%B3%A8%E8%A7%A3%E9%83%BD%E4%BD%8D%E4%BA%8Erg.springframework.cloud.stream.annotation%E5%8C%85%E4%B8%AD%EF%BC%89%E5%AE%9A%E4%B9%89%E4%BA%86%E4%B8%80%E4%B8%AA%E8%BE%93%E5%85%A5%E9%80%9A%E9%81%93%EF%BC%8C%E5%BA%94%E7%94%A8%E9%80%9A%E8%BF%87%E8%AF%A5%E8%BE%93%E5%85%A5%E9%80%9A%E9%81%93%E6%8E%A5%E6%94%B6%E6%9D%A5%E8%87%AA%E5%A4%96%E9%83%A8%E7%9A%84%E6%B6%88%E6%81%AF%E3%80%82")

public interface Sink{

String INPUT = "input";

@Input(Source.INPUT)

SubscribableChannel input();

}

### Spring Cloud Stream基本架构

Spring Cloud Stream对整个消息发布和消费过程做了高度抽象，并提供了一系列核心组件。我们先来介绍基于Spring Cloud Stream构建消息通信机制的基本工作流程。区别于直接使用RabbitMQ、Kafka等消息中间件，Spring Cloud Stream在消息生产者和消费者之间添加了一种桥梁机制，所有的消息都将通过Spring Cloud Stream进行发送和接收，如下图所示。

  ![3.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5acca3e0c5d34b33b0e34bba4bba40b3~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=985&h=438&s=92896&e=jpg&b=fef4f0)

在上图中，我们不难看出Spring Cloud Stream具备四个核心组件，分别是Binder、Channel、Source和Sink，其中Binder和Channel成对出现，而Source和Sink分别面向消息的发布者和消费者。

l Source和Sink

在Spring Cloud Stream中，Source组件是真正生成消息的组件，相当于是一个输出（Output）组件。而Sink则是真正消费消息的组件，相当于是一个输入（Input）组件。根据我们对事件驱动架构的了解，对于同一个Source组件而言，不同的服务可能会实现不同的Sink组件，分别根据自身需求进行业务上的处理。

l Channel

Channel的概念比较容易理解，就是常见的通道，这里不再展开。

l Binder

Spring Cloud Stream中最重要的概念就是Binder。所谓Binder，顾名思义就是一种黏合剂，将业务服务与消息通信系统黏合在一起。通过Binder，我们可以很方便的连接消息中间件，可以动态的改变消息的目标地址、发送方式而不需要了解各种消息中间件在实现上的差异。关于Binder是如何与不同的消息中间件进行整合的实现原理我们在接下来的内容中进行详细展开。

Spring Cloud Stream原理解析
-----------------------

### Spring Cloud Stream中的Binder

基于Spring Cloud Stream，[我们知道在发送和接收消息时，需要使用@EnableBinding](https://link.juejin.cn?target=mailto%3A%25E6%25B3%25A8%25E6%2584%258F%25E5%2588%25B0%25E8%25BF%2599%25E9%2587%258C%25E7%2594%25A8%25E5%2588%25B0%25E4%25BA%2586%40EnableBinding\(Source.class\) "mailto:%E6%B3%A8%E6%84%8F%E5%88%B0%E8%BF%99%E9%87%8C%E7%94%A8%E5%88%B0%E4%BA%86@EnableBinding(Source.class)")注解。我们可以在@EnableBinding注解中指定一个Source或Sink接口。这里以Source为例给出该接口的定义，如下所示。

public interface Source {

String OUTPUT = "output";

@Output(Source.OUTPUT)

MessageChannel output();

}

对于Source而言，消息是向外发送的，所以是Output。显然，对于Sink而言，消息是向内接收的，对应的是Input。

在Spring Cloud Stream中，BindableProxyFactory是一个用于初始化由@EnableBinding注解所提供接口的工厂类，该类的定义如下所示。

**public** **class** BindableProxyFactory **implements** MethodInterceptor, FactoryBean, Bindable, InitializingBean

注意到BindableProxyFactory同时实现了MethodInterceptor接口和Bindable接口。其中前者是AOP中的方法拦截器，而后者是一个标明能够绑定Input和Output的接口，如下图所示。

  ![4.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/202cc9f521f24a40a10a038264dcabaa~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=795&h=295&s=35484&e=jpg&b=fef7f6)

我们先来看MethodInterceptor接口中用于实现拦截的invoke方法，如下所示。

@Override

**public** **synchronized** Object invoke(MethodInvocation invocation) **throws** Throwable {

Method method = invocation.getMethod();

//从缓存中获取目标对象

Object boundTarget = targetCache.get(method);

**if** (boundTarget != **null**) {

**return** boundTarget;

}

//获取Input接口

Input input = AnnotationUtils._findAnnotation_(method, Input.**class**);

**if** (input != **null**) {

String name = BindingBeanDefinitionRegistryUtils._getBindingTargetName_(input, method);

boundTarget = **this**.inputHolders.get(name).getBoundTarget();

targetCache.put(method, boundTarget);

**return** boundTarget;

}

//获取Output接口，和获取Input接口实现方式类似

**else** {

...

}

**return** **null**;

}

这里的逻辑比较简单，可以看到BindableProxyFactory保存了一个缓存对象targetCache，如果所调用方法已经存在于缓存中，则直接返回目标对象。反之，会根据@Input和@Output注解从inputHolders和outputHolders中获取对应的目标对象并放入缓存中。至于这里提到的这个目标对象，暂时可以把它理解为就是一种MessageChannel对象。

然后我们来看Bindable接口，该接口提供了对Input和Output的绑定和解绑操作，而这些操作是通过Binder接口来完成的。Binder接口分别提供了绑定生产者和消费者的方法，如下所示。

**public** **interface** Binder<T, C **extends** ConsumerProperties, P **extends** ProducerProperties> {

//绑定生产者

Binding bindProducer(String name, T outboundBindTarget, P producerProperties);

//绑定消费者

Binding bindConsumer(String name, String group, T inboundBindTarget, C consumerProperties);

}

在Spring Cloud Stream中，Binder接口的类层关系如下所示，注意到这里还展示了RabbitMessageChannelBinder类，这个类在接下来讲到Spring Cloud Stream与RabbitMQ的集成过程时会具体展开。

![转存失败，建议直接上传图片文件](%E8%BD%AC%E5%AD%98%E5%A4%B1%E8%B4%A5%EF%BC%8C%E5%BB%BA%E8%AE%AE%E7%9B%B4%E6%8E%A5%E4%B8%8A%E4%BC%A0%E5%9B%BE%E7%89%87%E6%96%87%E4%BB%B6%20) 

针对Binder接口的实现过程，Spring Cloud Stream首先提供了一个AbstractBinder，这是一个抽象类。AbstractBinder的子类是AbstractMessageChannelBinder，它同样也是一个抽象类。我们来看它的doBindProducer方法，并对该方法中的核心语句进行提取和整理，如下所示。

@Override

**public** **final** Binding doBindProducer(**final** String destination, MessageChannel outputChannel,

**final** P producerProperties) **throws** BinderException {

…

//发送到 outputChannel通道的消息会被SendingHandler进行处理

((SubscribableChannel) outputChannel).subscribe(

**new** SendingHandler(producerMessageHandler,...);

//基于outputChannel构建Binding

Binding binding = **new** DefaultBinding(destination, **null**, outputChannel,

producerMessageHandler **instanceof** Lifecycle ? (Lifecycle) producerMessageHandler : **null**) {

…

};

**return** binding;

}

上述代码的核心逻辑在于，通过Source发送的消息会被outputChannel这个通道传递出去，而负责处理这些消息的是SendingHandler，它是一个Spring Messaging模块中的MessageHandler。

这里要注意的是，SendingHandler会使用Spring Messaging组件中的Message消息对象，而Spring Cloud Stream会把这个Message消息对象转换成对应中间件的消息数据格式并进行发送。

下面转到消息消费的场景。针对消息消费，我们可以使用@StreamListener注解。如果在一个方法上添加了@StreamListener注解，那么这个方法就可以用来接收消息，如下所示。

@StreamListener("input")

**public** **void** handleMessage(MyMessage myMessage) {

基于@StreamListener注解，在Spring Cloud Stream中存在一个StreamListenerMessageHandler类，用于订阅inputChannel消息通道中传入的消息并进行消费。

作为总结，我们可以用如下所示的流程图来概括整个消息发送和消费流程。

![5.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c50aed800454787aca9aaa24d12b7c7~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=856&h=717&s=103258&e=jpg&b=fefafa)

到目前为止，Spring Cloud Stream通过Binder组件分别完成了对RabbitMQ以及Kafka的集成。在接下来的内容中，我们将以RabbitMQ为例，给出Spring Cloud Stream集成RabbitMQ的实现过程。

### Spring Cloud Stream集成RabbitMQ

Spring Cloud Stream团队提供了spring-cloud-stream-binder-rabbit作为与RabbitMQ集成的代码工程。这个代码工程只有四个类，我们需要重点关注的就是实现了AbstractMessageChannelBinder中几个抽象方法的RabbitMessageChannelBinder类。

首先我们找到RabbitMessageChannelBinder中的createProducerMessageHandler方法，我们知道该方法用于完成消息的发送。我们在createProducerMessageHandler中找到了以下核心代码。

**final** AmqpOutboundEndpoint endpoint = **new** AmqpOutboundEndpoint( buildRabbitTemplate(producerProperties.getExtension(), errorChannel != **null**));

endpoint.setExchangeName(producerDestination.getName());

首先，在buildRabbitTemplate方法中，我们看到了RabbitTemplate的构建过程。RabbitTemplate是Spring Amqp组件提供的专门用于封装与RabbitMQ底层交互API的模板类。在构建RabbitTemplate的整个过程中，涉及到设置与RabbitMQ相关的ConnectionFactory等众多参数。

然后，我们发现RabbitMessageChannelBinder也是直接集成了Spring中用于整合AQMP协议的AmqpOutboundEndpoint，该类来自于Spring Integration框架，并提供了如下所示的send方法进行消息的发送。

**private** **void** send(String exchangeName, String routingKey,

**final** Message<?> requestMessage, CorrelationData correlationData) {

**if** (**this**.amqpTemplate **instanceof** RabbitTemplate) {

//实现消息格式的转换

MessageConverter converter = ((RabbitTemplate) **this**.amqpTemplate).getMessageConverter();

org.springframework.amqp.core.Message amqpMessage = MappingUtils.mapMessage(...);

...

//实现消息发送

((RabbitTemplate) **this**.amqpTemplate).send(exchangeName, routingKey, amqpMessage, correlationData);

}

**else** {

//实现消息转换和发送

**this**.amqpTemplate.convertAndSend(exchangeName, routingKey, requestMessage.getPayload(),

message -> {

getHeaderMapper().fromHeadersToRequest(requestMessage.getHeaders(),

message.getMessageProperties());

**return** message;

});

}

}

可以看到这里依赖于Spring Amqp提供的AmqpTemplate接口实现消息发送，而RabbitTemplate是AmqpTemplate的一个实现类。同时，我们还注意到这里通过MessageConverter工具类完成了从org.springframework.messaging.Message到org.springframework.amqp.core.Message这两个消息数据结构之间的转换。

介绍完消息发送，接下来我们来看消息的消费。RabbitMessageChannelBinder中与消息消费相关的是createConsumerEndpoint方法。类似的，这个方法中也大量使用了Spring Amqp和Spring Integration中的工具类。该方法最终返回的是一个AmqpInboundChannelAdapter对象。在Spring Integration中，AmqpInboundChannelAdapter是一种InboundChannelAdapter，代表面向输入的通道适配器，提供了消息监听功能，如下所示。

**protected** **class** Listener **implements** ChannelAwareMessageListener, RetryListener {

@Override

**public** **void** onMessage(**final** Message message, **final** Channel channel) **throws** Exception {

//省略相关实现

}

}

在这个onMessage方法内部，最关键的是用于创建消息的createMessage方法，如下所示。

**private** org.springframework.messaging.Message createMessage(Message message, Channel channel) {

//创建消息体

Object payload = AmqpInboundChannelAdapter.**this**.messageConverter.fromMessage(message);

//创建消息头

Map<String, Object> headers = AmqpInboundChannelAdapter.**this**.headerMapper .toHeadersFromRequest(message.getMessageProperties());

...

//创建消息

**final** org.springframework.messaging.Message messagingMessage = getMessageBuilderFactory()

.withPayload(payload)

.copyHeaders(headers)

.build();

**return** messagingMessage;

}

显然，在这个createMessage方法中，我们完成了消息数据格式从org.springframework.amqp.core.Message到org.springframework.messaging.Message的反向转换。

总结
--

关于如何构建一个统一化的消息通信平台，Spring Cloud Stream是我们值得深入分析和研究的一个框架。对于消息通信而言，我们需要分别实现消息的发布者和消费者。在Spring Cloud Stream中分别是Source和Sink组件。而消息的传递显然应该用到通道，所以Spring Cloud Stream也包含了Channel组件。最后，作为Spring Cloud Stream框架在设计上的一大特色，Binder组件专门用于屏蔽与各种消息中间件之间的技术差异，为开发者提供统一的API。这样，我们就把Spring Cloud Stream中的四个核心组件都梳理了一遍，分别是Binder、Channel、Source和Sink。在回答这类问题时，可以围绕Spring Cloud Stream的基本架构把这些组件都介绍到，并重点对Binder组件做细化阐述。