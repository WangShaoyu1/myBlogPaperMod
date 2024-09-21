---
author: "闲宇非鱼"
title: "关于Spring的两三事：再谈三级缓存（上）"
date: 2024-09-20
description: "别再死盯着getSingleton方法了，我们需要从Bean创建的全流程来分析。让我们通过Spring的Bean创建过程重新审视一下三级缓存到底起到了什么作用。"
tags: ["Java","后端","Spring"]
ShowReadingTime: "阅读9分钟"
weight: 59
---
![关于Spring的两三事：再谈三级缓存.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/37394a352af84048b0897e54854d6478~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6Zey5a6H6Z2e6bG8:q75.awebp?rk3s=f64ab15b&x-expires=1727449748&x-signature=H87EXRh2FjeSo8j7tGeZCBZqtaA%3D)

> 人生苦短，不如养狗
> 
> 作者：闲宇
> 
> 公众号：Brucebat的伪技术鱼塘

一、前言
----

  在学习和研究Spring的Bean创建过程时一定绕不开这样一个概念：**三级缓存**。其实这样一个概念并不是官方给出的正式定义，而是开发者基于Spring框架的实现细节总结出来的一个用于描述Spring处理**单例Bean创建**时出现的**循环依赖**方案的术语。但在实际的探究过程中，我们会发现这样一套缓存机制的存在并不仅是为了处理循环依赖，还需要处理AOP代理机制等的延迟创建逻辑。也就是说，三级缓存实际上是为了去解决单例Bean创建过程中复杂依赖问题而诞生的。为了更好地去探究这些问题，闲宇会将这些内容分成两篇文章进行讲解，本文主要探究在Spring当中是如何处理循环依赖的。

> 以下分析基于框架版本如下：
> 
> Spring：6.1.x
> 
> SpringBoot：3.2.4

二、循环依赖
------

### 基本概念

  **循环依赖**实际上描述的是软件开发过程中一种非常特殊情况：对象A依赖对象B的同时，对象B也依赖对象A。在Spring的官方文档当中是这样描述这样一种特殊情况的：

> If you use predominantly constructor injection, it is possible to create an unresolvable circular dependency scenario.
> 
> For example: Class A requires an instance of class B through constructor injection, and class B requires an instance of class A through constructor injection. If you configure beans for classes A and B to be injected into each other, the Spring IoC container detects this circular reference at runtime, and throws a `BeanCurrentlyInCreationException`.

  从上面的描述中我们可以看到，Spring官方对待循环依赖的态度是：**运行时检测并抛出异常**。既如此在Spring当中是否就无法编写存在循环依赖的代码呢？当然不是，官方的各位大佬虽然对循环依赖持拒绝态度，但依然给我们留了一条口子：我们可以通过修改默认配置`spring.main.allow-circular-references`为`true`来让Spring框架允许我们运行存在循环依赖的代码。下面我们具体来看一下Spring当中是如何通过三级缓存来解决循环依赖的。

### Spring中的解决方案

  在Spring当中三级缓存或者说分层缓存机制并不是单纯作用于某几行代码或者某个方法当中，而是作用于整个单例Bean的创建过程，所以我们在分析时不能只着眼于某个方法或者某几个方法，而是需要高屋建瓴地从Bean的创建过程来去分析。下面我们通过一个例子来去分析一下存在循环依赖的Bean是如何创建的，这里闲宇会结合源码当中的关键方法来去分析，但不会将全部方法列举出来，大家可以自行阅读对应源码辅助理解。

#### 1\. 开始创建Bean A

![circle-dependency-1.jpg](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/38274f73590847bbaebcf029645862bb~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6Zey5a6H6Z2e6bG8:q75.awebp?rk3s=f64ab15b&x-expires=1727449748&x-signature=7mZUzmEGPAC16LsHgj9tpRhb2Hk%3D)

  这里闲宇将分析的入口定为`AbstractBeanFactory#doGetBean`方法，因为这个方法是分层机制最开始出现的地方。在BeanA第一次开始创建时，首先会通过`getSingleton`方法来去尝试获取三级缓存当中的缓存的Bean实例，这一步的主要目的是为了获取提前暴露的Bean引用，需要注意的是只有在这里的这个`getSingleton`方法是可以获取到提前暴露的Bean引用，后续的`getSingleton`都不可以获取提前暴露的Bean引用。当然，在第一次创建的过程中一定是无法获取到任何数据的。

  第二个`getSingleton`方法是用来实际获取单例Bean的方法，在这个方法当中做了两件事：

*   `createBean`：创建Bean实例
*   `addSingleton`：将创建完成的Bean实例从其他级缓存当中迁移至一级缓存`singletonObjects`当中

  第二件事情我们暂时不用考虑，继续分析创建过程。在`doCreateBean`方法当中Spring会通过`createBeanInstance`方法创建一个没有进行过属性填充的对象，在这一创建过程中Spring还会对循环依赖进行检查，如果你没有像上文中所说的修改配置，那么这里检查出循环依赖后就会抛出异常。

  在完成了空对象的创建之后，Spring就会进入到创建提前暴露的Bean的准备工作中。通过`addSingletonFactory`方法，Spring向三级缓存`singletonFactories`当中添加了一个用于创建提前暴露Bean的**factory对象**。将这个对象添加至缓存后，Bean创建流程就进入到一个非常重要的环节：**属性填充**。

#### 2\. 发现并填充Bean A中依赖的Bean B

![circle-dependency-2.jpg](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/b3c7763b28194ea18c9ce75918ec3fcb~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6Zey5a6H6Z2e6bG8:q75.awebp?rk3s=f64ab15b&x-expires=1727449748&x-signature=mRQKDnIke2wh%2BNe2kzavOgwO25A%3D)

  在`populateBean`方法当中，Spring会进行空对象的填充处理，也就是在这个方法当中Spring会检测到Bean A的依赖Bean B。在实际执行过程中，我们会发现存在循环依赖的对象进行属性填充时并不会简单使用`autowireByName`或者`autowireByType`来生成依赖的Bean，而是会通过Spring提供的`InstantiationAwareBeanPostProcessor`来执行`postProcessProperties`方法获取对应的Bean。通过`postProcessProperties`方法最终依然会进入到`AbstractBeanFactory#doGetBean`方法。

#### 3\. 创建Bean B，发现并填充Bean B中依赖的Bean A

![circle-dependency-3.jpg](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/3a5c0942580d4755aa7ecf9f76cce9c3~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6Zey5a6H6Z2e6bG8:q75.awebp?rk3s=f64ab15b&x-expires=1727449748&x-signature=MdyyLUQ1pIMPp0VFu5UMgb%2B%2B%2B44%3D)

  我们又一次进入到了`` `AbstractBeanFactory#doGetBean ``方法，不过这一次的主角不是Bean A，而是它的依赖对象Bean B。虽然主角不同，但是整体流程依然是一样的，这里我们就不过分析了，大家可以结合上面的图和之前分析的内容自行推敲。让我们直接进入到填充Bean A的过程。

#### 4\. 继续进行Bean A的创建

![circle-dependency-4.jpg](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/9022c83dd5da43478048759eddd88165~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6Zey5a6H6Z2e6bG8:q75.awebp?rk3s=f64ab15b&x-expires=1727449748&x-signature=sHtUB%2FIvpjV46icfrVkOFTMMxfE%3D)

  我们又又一次进入到了`AbstractBeanFactory#doGetBean`方法，这是我们在整个Bean创建过程中第三次进入到`doGetBean`方法，也是Bean A第二次进入到`doGetBean`方法。由于在之前的流程当中，Spring已经将用于创建提前暴露的Bean的factory对象缓存到三级缓存当中，所以这一次在调用`getSingleton`方法时我们是可以获取到提前暴露的Bean A对象的。在这一过程中，Spring通过缓存在三级缓存的factory对象创建了一个Bean A对象，然后将三级缓存中factory对象删除，并将创建完成的Bean A对象放置在二级缓存当中同时返回Bean A对象。至此，整个循环依赖的填充环节可以说是基本完成了。

#### 5\. 完成所有Bean的创建

  在完成Bean A的填充创建后，Spring会跳出`populateBean`方法并尝试调用`getSingleton`方法。由于此时并不能获取提前暴露的对象，所以此时`getSingleton`方法返回为null，Bean B依然使用的是`populateBean`方法填充后的对象而不是从缓存当中取出的对象。如此，Bean B的创建过程完成，进入到`addSingleton`方法将缓存中关于Bean B的二三级缓存清理，并将创建完成的Bean B对象放置到一级缓存当中。

  在创建完Bean B之后，意味着Bean A的填充逻辑也完成了，Spring会跳出`populateBean`方法并尝试调用`getSingleton`方法。和Bean B的过程不同，此时在Bean A的流程当中是可以从二级缓存当中获取到缓存的对象。需要注意的是，这里Spring抛弃了上面通过了`populateBean`方法获得对象，而是使用这里**从二级缓存当中获得的对象作为最终创建的Bean A对象**。看到这里，想必有不少同学会产生一个疑惑：这是为什么呢？其实很简单，**为了防止出现重复创建和保障依赖关系的正确**。从上面的流程我们可以看到，Bean B依赖的Bean A对象实际上是通过`getSingleton`方法从factory对象当中生成出来的，和我们最开始创建的Bean A对象可以说是毫无关系，如果我们依然使用的是最开始的Bean A对象，那么实际的依赖关系就会出现错误，同时也会出现重复创建对象的问题。

三、好像并不需要三级缓存？
-------------

  在了解完Spring创建存在循环依赖的Bean过程后，我们可能会产生这样一个问题：我们真的需要三级缓存吗？

  要想回答这个问题，我们需要先回答另一个前置问题：为什么Spring在三级缓存`singletonFactories`当中放置的是工厂对象而不是一个实际的对象？其实在理解了上面的流程之后这个问题并不难回答，如果我们一开始就将未完成的对象暴露到了缓存当中，那么在后续的操作当中这个未完成的对象状态将无法进行进一步的变更。而通过工厂对象则可以避免这一问题的出现，我们可以根据后续处理的情况在实际需要的地方使用通过工厂对象创建的Bean对象，通过这一方式实现了延迟创建和灵活性。

  由此看来，我们好像并不需要三级缓存，即使需要为工厂对象提供一级缓存层，总共加起来也不过两级。那么Spring当中为什么一定需要使用三级缓存呢？由于本文所分析的依赖关系还是比较简单，基于上面这样一个纯粹的循环依赖关系，两级缓存完全可以处理，但是更复杂的依赖关系呢？这个问题我们保留到下一篇讲述Spring处理包含代理对象的循环依赖关系的Bean创建过程时在进行进一步的分析。有兴趣的朋友也可以自行构建几种场景尝试推理一下，毕竟推理的过程还是非常有趣的。

四、总结
----

  在上面的内容当中闲宇只分析了Spring是如何利用三级缓存来处理最简单的循环依赖关系，而在下一篇博客中我们会进一步分析Spring是如何处理那些更为复杂的依赖关系，比如存在代理对象的循环依赖关系。同时我们也会最终解决上面遗留的问题：真的需要三级缓存吗？

  最后，祝大家身体健康，心想事成，早日财富自由~~