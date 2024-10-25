---
author: "华为云开发者联盟"
title: "Java开发必读，谈谈对Spring IOC与AOP的理解"
date: 2024-06-07
description: "在Java后台开发中，Spring框架的IOC（控制反转）和AOP（面向切面编程）是两个非常重要的概念。"
tags: ["敏捷开发","Java","Spring中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:8,comments:0,collects:14,views:2544,"
---
本文分享自华为云社区[《超详细的Java后台开发面试题之Spring IOC与AOP》](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%2F428595%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs/428595?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")，作者：GaussDB 数据库。

一、前言
----

IOC和AOP是Spring中的两个核心的概念，下面谈谈对这两个概念的理解。

二、IOC（Inverse of Control）
-------------------------

控制反转，也可以称为依赖倒置。

所谓依赖，从程序的角度看，就是比如A要调用B的方法，那么A就依赖于B，反正A要用到B，则A依赖于B。所谓倒置，你必须理解如果不倒置，会怎么着，因为A必须要有B，才可以调用B，如果不倒置，意思就是A主动获取B的实例：B b = new B()，这就是最简单的获取B实例的方法（当然还有各种设计模式可以帮助你去获得B的实例，比如工厂、Locator等等），然后你就可以调用b对象了。所以，不倒置，意味着A要主动获取B，才能使用B；到了这里，就应该明白了倒置的意思了。倒置就是A要调用B的话，A并不需要主动获取B，而是由其它人自动将B送上门来。

形象的举例就是：

通常情况下，假如你有一天在家里口渴了，要喝水，那么你可以到你小区的小卖部去，告诉他们，你需要一瓶水，然后小卖部给你一瓶水！这本来没有太大问题，关键是如果小卖部很远，那么你必须知道：从你家如何到小卖部；小卖部里是否有你需要的水；你还要考虑是否开着车去；等等等等，也许有太多的问题要考虑了。也就是说，为了一瓶水，你还可能需要依赖于车等等这些交通工具或别的工具，问题是不是变得复杂了？那么如何解决这个问题呢？

解决这个问题的方法很简单：小卖部提供送货上门服务，凡是小卖部的会员，你只要告知小卖部你需要什么，小卖部将主动把货物给你送上门来！这样一来，你只需要做两件事情，你就可以活得更加轻松自在：

> 第一：向小卖部注册为会员。
> 
> 第二：告诉小卖部你需要什么。

这和Spring的做法很类似！Spring就是小卖部，你就是A对象，水就是B对象

> 第一：在Spring中声明一个类：A
> 
> 第二：告诉Spring，A需要B

假设A是UserAction类，而B是UserService类。

```ini
<bean id="userService" class="org.leadfar.service.UserService"/>
<bean id="documentService" class="org.leadfar.service.DocumentService"/>
<bean id="orgService" class="org.leadfar.service.OrgService"/>

<bean id="userAction" class="org.leadfar.web.UserAction">
<property name="userService" ref="userService"/>
</bean>
```

在Spring这个商店（工厂）中，有很多对象/服务：userService,documentService,orgService，也有很多会员：userAction等等，声明userAction需要userService即可，Spring将通过你给它提供的通道主动把userService送上门来，因此UserAction的代码示例类似如下所示：

```typescript
package org.leadfar.web;
    public class UserAction{
    private UserService userService;
        public String login(){
        userService.valifyUser(xxx);
    }
        public void setUserService(UserService userService){
        this.userService = userService;
    }
}
```

在这段代码里面，你无需自己创建UserService对象（Spring作为背后无形的手，把UserService对象通过你定义的setUserService()方法把它主动送给了你，这就叫**依赖注入**！），当然咯，我们也可以使用注解来注入。Spring依赖注入的实现技术是：**动态代理**。

三、AOP：面向切面编程
------------

面向切面编程的目标就是分离关注点。什么是关注点呢？就是你要做的事，就是关注点。假如你是个公子哥，没啥人生目标，天天就是衣来伸手，饭来张口，整天只知道玩一件事！那么，每天你一睁眼，就光想着吃完饭就去玩（你必须要做的事），但是在玩之前，你还需要穿衣服、穿鞋子、叠好被子、做饭等等等等事情，这些事情就是你的关注点，但是你只想吃饭然后玩，那么怎么办呢？这些事情通通交给别人去干。在你走到饭桌之前，有一个专门的仆人A帮你穿衣服，仆人B帮你穿鞋子，仆人C帮你叠好被子，仆人D帮你做饭，然后你就开始吃饭、去玩（这就是你一天的正事），你干完你的正事之后，回来，然后一系列仆人又开始帮你干这个干那个，然后一天就结束了！

AOP的好处就是你只需要干你的正事，其它事情别人帮你干。也许有一天，你想裸奔，不想穿衣服，那么你把仆人A解雇就是了！也许有一天，出门之前你还想带点钱，那么你再雇一个仆人E专门帮你干取钱的活！这就是AOP。每个人各司其职，灵活组合，达到一种可配置的、可插拔的程序结构。

从Spring的角度看，AOP最大的用途就在于提供了**事务管理**的能力。事务管理就是一个关注点，你的正事就是去访问数据库，而你不想管事务（太烦），所以，Spring在你访问数据库之前，自动帮你开启事务，当你访问数据库结束之后，自动帮你提交/回滚事务！

我们在使用Spring框架的过程中，其实就是为了使用IOC(**依赖注入**)和AOP(**面向切面编程)**，这两个是Spring的灵魂。主要用到的设计模式有**工厂模式**和**代理模式**。IOC就是典型的工厂模式，通过sessionfactory去注入实例;AOP就是典型的**代理模式**的体现。

代理模式是常用的java设计模式，他的特征是**代理类**与**委托类**有同样的接口，**代理类**主要负责为**委托类**预处理消息、过滤消息、把消息转发给**委托类**，以及事后处理消息等。**代理类**与**委托类**之间通常会存在关联关系，一个**代理类**对象与一个**委托类**对象关联，**代理类**对象本身并不真正实现服务，而是通过调用委托类的对象相关方法，来提供特定的服务。

Spring IoC容器是spring的核心，spring AOP是spring框架的重要组成部分。

在传统的程序设计中，当调用者需要被调用者的协助时，通常由调用者来创建被调用者的实例。但在spring里创建被调用者的工作不再由调用者来完成，因此控制反转（IoC）；创建被调用者实例的工作通常由spring容器来完成，然后注入调用者，因此也被称为依赖注入（DI），**依赖注入**和**控制反转**是同一个概念。

面向方面编程（AOP)是从另一个角度来考虑程序结构，通过分析程序结构的关注点来完善面向对象编程（OOP）。OOP将应用程序分解成各个层次的对象，而AOP将程序分解成多个切面。spring AOP只实现了方法级别的连接点，在J2EE应用中，AOP拦截到方法级别的操作就已经足够。在spring中为了使IoC方便地使用健壮、灵活的企业服务，需要利用spring AOP实现为IoC和企业服务之间建立联系。

IOC:控制反转也叫依赖注入。利用了工厂模式。

将对象交给容器管理，你只需要在spring配置文件中配置相应的bean，以及设置相关的属性，让spring容器来生成类的实例对象以及管理对象。在spring容器启动的时候，spring会把你在配置文件中配置的bean都初始化好，然后在你需要调用的时候，就把它已经初始化好的那些bean分配给你需要调用这些bean的类（假设这个类名是A），分配的方法就是调用A的setter方法来注入，而不需要你在A里面new这些bean了。

注意：面试的时候，如果有条件，画图，这样更加显得你懂了.

四、AOP（Aspect-Oriented Programming）:面向切面编程补充说明
---------------------------------------------

AOP可以说是对OOP的补充和完善。OOP引入封装、继承和多态性等概念来建立一种对象层次结构，用以模拟公共行为的一个集合。当我们需要为分散的对象引入公共行为的时候，OOP则显得无能为力。也就是说，OOP允许你定义从上到下的关系，但并不适合定义从左到右的关系。例如日志功能。日志代码往往水平地散布在所有对象层次中，而与它所散布到的对象的核心功能毫无关系。在OOP设计中，它导致了大量代码的重复，而不利于各个模块的重用。

将程序中的交叉业务逻辑（比如安全，日志，事务等），封装成一个切面，然后注入到目标对象（具体业务逻辑）中去。

实现AOP的技术，主要分为两大类：一是采用动态代理技术，利用截取消息的方式，对该消息进行装饰，以取代原有对象行为的执行；二是采用静态织入的方式，引入特定的语法创建“方面”，从而使得编译器可以在编译期间织入有关“方面”的代码.

简单点解释，比方说你想在你的biz层所有类中都加上一个打印‘你好’的功能,这时就可以用aop思想来做.你先写个类写个类方法，方法经实现打印‘你好’,然后Ioc这个类 ref＝“biz.\*”让每个类都注入即可实现。

五、Spring中对 AOP的支持
-----------------

Spring中 AOP代理由Spring IoC容器负责生成、管理，其依赖关系也由 IoC容器负责管理。因此，AOP代理可以直接使用容器中的其他 Bean实例作为目标，这种关系可由 IoC容器的依赖注入提供。Spring默认使用 Java动态代理来创建AOP代理，这样就可以为任何接口实例创建代理了。当需要代理的类不是代理接口的时候，Spring自动会切换为使用 CGLIB代理，也可强制使用 CGLIB。

### 5.1 程序员参与部分

AOP编程其实是很简单的事情。纵观 AOP编程，其中需要程序员参与的只有三个部分：

1.  定义普通业务组件。
2.  定义切入点，一个切入点可能横切多个业务组件。
3.  定义增强处理，增强处理就是在AOP框架为普通业务组件织入的处理动作。

所以进行AOP编程的关键就是定义切入点和定义增强处理。一旦定义了合适的切入点和增强处理，AOP框架将会自动生成AOP代理，即：**代理对象的方法 =增强处理 +被代理对象的方法**。

### 5.2 Spring中使用方式

基于 Annotation的“零配置”方式。

（1）启动注解，配置文件applicationContext.xml

```xml
<!-- 启动对@AspectJ注解的支持 -->
<aop:aspectj-autoproxy/>
<bean id="user" class="com.tgb.spring.aop.IUserImpl"/>
<bean id="check" class="com.tgb.spring.aop.CheckUser"/>
```

（2）编写切面类

```java
package com.tgb.spring.aop;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;

@Aspect
    public class CheckUser {
    @Pointcut("execution(* com.tgb.spring.aop.*.find*(..))")
        public void checkUser(){
        System.out.println("The System is Searching Information For You");
    }
    
    @Pointcut("execution(* com.tgb.spring.aop.*.add*(..))")
        public void checkAdd(){
        System.out.println("<< Add User >> Checking.....");
    }
    
    @Before("checkUser()")
        public void beforeCheck(){
        System.out.println(">>>>>>>> 准备搜查用户..........");
    }
    
    @After("checkUser()")
        public void afterCheck(){
        System.out.println(">>>>>>>>　搜查用户完毕..........");
    }
    
    @Before("checkAdd()")
        public void beforeAdd(){
        System.out.println(">>>>>>>>　增加用户--检查ing..........");
    }
    
    @After("checkAdd()")
        public void afterAdd(){
        System.out.println(">>>　增加用户--检查完毕！未发现异常!........");
    }
    
    //声明环绕通知
    @Around("checkUser()")
        public Object doAround(ProceedingJoinPoint pjp) throws Throwable {
        System.out.println("进入方法---环绕通知");
        Object o = pjp.proceed();
        System.out.println("退出方法---环绕通知");
        return o;
    }
}
```

（3）定义接口

```arduino
package com.tgb.spring.aop;
    public interface IUser {
    public String findUser(String username);
    public void addUser(String username);
    public void findAll();
}
```

（4）定义实现

```arduino
package com.tgb.spring.aop;
import java.util.HashMap;
import java.util.Map;
    public class IUserImpl implements IUser {
    public static Map map = null;
        public static void init(){
        String[] list = {"Lucy", "Tom", "小明", "Smith", "Hello"};
        Map tmp = new HashMap();
            for(int i=0; i<list.length; i++){
            tmp.put(list[i], list[i]+"00");
        }
        map = tmp;
    }
    
        public void addUser(String username) {
        init();
        map.put(username, username+"11");
        System.out.println("---【addUser】: "+username+" --------");
        System.out.println("【The new List:"+map+"】");
    }
    
        public void findAll() {
        init();
        System.out.println("---------------【findAll】: "+map+" ------------------");
    }
    
        public String findUser(String username) {
        init();
        String password = "没查到该用户";
            if(map.containsKey(username)){
            password = map.get(username).toString();
        }
        System.out.println("-----------------【findUser】-----------------");
        System.out.println("-----------Username:"+username+"------------");
        System.out.println("-----【Result】:"+password+"--------");
        return password;
    }
}
```

（5）测试

```ini
    public class Test {
        public static void main(String as[]){
        BeanFactory factory = new ClassPathXmlApplicationContext("applicationContext.xml");
        IUser user = (IUser) factory.getBean("user");
        user.findAll();
        User u = new User();
        //      u.setUsername("Tom");
        //      user.findUser(u.getUsername());
        /*u.setUsername("haha");
        user.addUser(u.getUsername());*/
    }
}
```

注：@Before是在所拦截方法执行之前执行一段逻辑。@After是在所拦截方法执行之后执行一段逻辑。@Around是可以同时在所拦截方法的前后执行一段逻辑。

以上是针对注解的方式来实现，那么配置文件也一样，只需要在applicationContext.xml中添加如下代码：

```ini
<!--  <aop:config>
<aop:pointcut id="find" expression="execution(* com.tgb.spring.aop.*.find*(..))" />
<aop:pointcut id="add"   expression="execution(* com.tgb.spring.aop.*.add*(..))" />
<aop:aspect id="checkUser" ref="check">
<aop:before method="beforeCheck" pointcut-ref="find"/>
<aop:after method="afterCheck" pointcut-ref="find"/>
</aop:aspect>

<aop:aspect id="checkAdd" ref="check">
<aop:before method="beforeAdd" pointcut-ref="add"/>
<aop:after method="afterAdd" pointcut-ref="add"/>
</aop:aspect>
</aop:config>-->
```

[**点击关注，第一时间了解华为云新鲜技术~**](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")