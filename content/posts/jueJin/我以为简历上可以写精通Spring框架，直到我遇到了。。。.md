---
author: "JavaSouth南哥"
title: "我以为简历上可以写精通Spring框架，直到我遇到了。。。"
date: 2024-07-11
description: "所有人都知道SpringMVC是RodJohnson是开发的，却鲜有人知道SpringMVC的理论基础来自于1978年提出MVC模式的一个老头子，他就是TrygveMikkjelHeyer"
tags: ["后端","Java"]
ShowReadingTime: "阅读7分钟"
weight: 598
---
> _点赞再看，Java进阶一大半_

所有人都知道Spring MVC是`Rod Johnson`是开发的，却鲜有人知道Spring MVC的理论基础来自于1978 年提出MVC模式的一个老头子，他就是Trygve Mikkjel Heyerdahl Reenskaug，挪威计算机科学家，[奥斯陆大学](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FUniversity_of_Oslo "https://en.wikipedia.org/wiki/University_of_Oslo")名誉教授。

![在这里插入图片描述](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/215877e5e63d45cfa3509dcfebcc6fd7~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSmF2YVNvdXRo5Y2X5ZOl:q75.awebp?rk3s=f64ab15b&x-expires=1727425535&x-signature=syNUQct26NT3G%2F9XfSyKAT0PPxU%3D)

Trygve Reenskaug的MVC架构思想早期用于图形用户界面(GUI) 的软件设计，他对MVC是这样解释的。

> MVC 被认为是解决用户控制大型复杂数据集问题的通用解决方案。最困难的部分是为不同的架构组件想出好的名字。模型-视图-编辑器是第一个。经过长时间的讨论，特别是与Adele Goldberg的讨论，我们最终采用了模型-视图-控制器这个术语。

大家好，我是南哥。

一个Java学习与进阶的领路人，今天指南的是Spring MVC，跟着南哥我们一起Java成长。

本文收录在我开源的《Java学习进阶指南》中，一份涵盖了你学习Java、成为更好的Java选手所需掌握的核心知识、面试重点。相信能帮助到大家在Java成长路上不迷茫。南哥希望收到大家的 ⭐ Star ⭐支持，这是我创作的最大动力。GitHub地址：[github.com/hdgaadd/Jav…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhdgaadd%2FJavaProGuide "https://github.com/hdgaadd/JavaProGuide")。

1\. Spring MVC概况
----------------

### 1.1 如何理解Spring MVC

大家都知道Spring MVC很强大，南哥问大家一个问题，Spring MVC为什么会出现？一项技术的出现必定是为了解决旧技术考虑不全所积累的软件熵。《程序员修炼之道》在`软件的熵`一节中对熵的解释很有冲击力，作者是这么说的，大家有没什么触动。

> 虽然软件开发不受绝大多数物理法则的约束，但我们无法躲避来自熵的增加的重击。熵是一个物理学术语，它定义了一个系统的“无序”总量。不幸的是，热力学法则决定了宇宙中的熵会趋向最大化。当软件中的无序化增加时，程序员会说“软件在腐烂”。有些人可能会用更乐观的术语来称呼它，即“技术债”，潜台词是说他们总有一天会偿还的——恐怕不会还了。

在没有出现Spring MVC之前，老一代的开发者会在`Servlet`中编写业务逻辑和控制代码，甚至属于后端的业务逻辑也会耦合在了`jSP`页面。在当时互联网不流行，业务都比较简单的年代，这样写问题不会太大，但随着时间的累积、互联网的爆发，业务复杂度也爆发式上升，这叫新来的实习生程序员怎么上手呢。缺乏统一和清晰的架构模式，会导致应用程序的可扩展性和可维护性降低。

我们先不讲Spring MVC，把**MVC**拆解出来。MVC（Model View Controller）实践上是一种软件架构思想，这个思想指导把应用程序分为了三个模块，用于编写业务逻辑的模型、用于数据呈现的视图、用于协调前两者的控制器。

在我们Java程序员第一次接触企业框架时，我们最开始一般用SSM来练练手。如果是SSM框架，充当`Model`的是编写业务逻辑Java类，充当`View`的是JSP页面，而充当`Controller`的则是Servlet。总的来说，MVC明确划分了各个模块的责任，不是你负责的东西不允许越线，这明显维护起来好看多了。

好久好久之前南哥练手的第一个项目是坦克大战，和现在一般企业业务把一个Java对象看出是需求的抽象不同，我当时的坦克大战是把一个Java对象看成是一只坦克的载体。大家第一个Java练手项目有什么故事吗？

2\. Spring MVC技术要点
------------------

### 2.1 Spring MVC工作流程

Spring MVC工作流程涉及**五大组件**，大家先预览一遍：DispatcherServlet、HandleMapping、Controller、ModelAndView、ViewResolver。

第一步用户触发浏览器时将请求发送给前端控制器DispatcherServlet，DispatcherServlet就相当于上文MVC架构的**C**，Spring源码对DispatcherServlet解释为`HTTP请求处理程序/ 控制器的中央调度程序`。有了中央调度程序大脑，下一步就可以联调其他组件了。

java

 代码解读

复制代码

`// DispatcherServlet类 package org.springframework.web.servlet; public class DispatcherServlet extends FrameworkServlet { }`

第二步，DispatcherServlet调用处理器映射器HandleMapping，根据用户请求的URL找到对应的业务控制器Contorller。

java

 代码解读

复制代码

`// HandlerMapping类 package org.springframework.web.reactive; public interface HandlerMapping { }`

第三步，DispatcherServlet请求处理器适配器HandlerAdapter执行Controller，获得**业务结果**后返回一个模型视图对象ModelAndView给到DispatcherServlet。

java

 代码解读

复制代码

`// ModelAndView类 package org.springframework.web.servlet; public class ModelAndView {`

java

 代码解读

复制代码

`// HandlerAdapter类 package org.springframework.web.servlet; public interface HandlerAdapter { }`

第四步，DispatcherServlet把ModelAndView返回给视图解析器ViewResolver，将ModelAndView解析为视图对象View。

java

 代码解读

复制代码

`// ViewResolver类 package org.springframework.web.servlet; public interface ViewResolver {`

最后一步，View会负责渲染，同时把结果返回给浏览器。

### 2.2 Spring MVC搭配Tomcat容器

大家有搭过Spring Web MVC框架的话就有印象，我们要在本机安装单独的一个Tomcat服务器，Tomcat搭配Spring框架才能让我们的Web应用程序跑起来。会不会觉得很麻烦，南哥觉得好麻烦。。

SpringBoot框架则不需要我们单独去部署一个Tomcat服务器，大家甚至在[start.spring.io/](https://link.juejin.cn?target=https%3A%2F%2Fstart.spring.io%2F "https://start.spring.io/")官网下载包后，本地启动就可以把Web程序跑起来，方便吧。

这是为什么？SpringBoot内置了一个**Servlet容器**，而上文南哥所说的Tomcat容器本质也是一个Servlet容器，SpringBoot默认为我们配置的是Tomcat。要是对Tomcat不满意，你也可以用其他Servlet容器，比如Jetty、Undertow。

Tomcat容器为我们的Spring MVC做了很多脏活，例如底层Socket连接这种麻烦工作。而上文我提到的Spring MVC五大组件本质上都是调用**Servlet API**，而Servlet API的实现也是由Tomcat容器为我们完成的。

在Spring Web MVC框架里，如果大家要单独部署Servlet容器，切记注意下Spring框架和Servlet 容器的兼容性。在[Spring官方文档](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fspring-projects%2Fspring-framework%2Fwiki%2FSpring-Framework-Versions "https://github.com/spring-projects/spring-framework/wiki/Spring-Framework-Versions")中，Spring Framework 5.3.x 支持的最后一个Servlet规范版本4.0，从 Spring Framework 6.0 开始，Servlet最低版本为Servlet 5.0。

### 2.3 Spring MVC常见注解

（1）@Controller和@RestController

把某一个Java类申明为后端接口，我们一般使用@Controller修饰该类，使用@RestController也可以，两者的差异在于后者是@Controller和@ResponseBody的组合，后端接口返回的数据格式会是ResponseBody格式的数据。

大家看下两者的源码解释，南哥把英文注释翻译为了中文。

java

 代码解读

复制代码

`// 基本 Controller 接口，表示接收HttpServletRequest和HttpServletResponse实例的组件，就像HttpServlet一样，但能够参与 MVC 工作流。 @FunctionalInterface public interface Controller { }`

java

 代码解读

复制代码

`// 便捷注释本身带有@Controller和@ResponseBody注释。 // 带有此注释的类型被视为控制器，其中@RequestMapping方法默认采用@ResponseBody语义。 @Target(ElementType.TYPE) @Retention(RetentionPolicy.RUNTIME) @Documented @Controller @ResponseBody public @interface RestController { }`

（2）@RequestMapping

这个注解的作用是把请求映射到控制器方法，例如getPerson方法，前端同学请求`/persons/{id}`就可以控制该方法执行。

java

 代码解读

复制代码

`@RestController @RequestMapping("/persons") class PersonController { 	@GetMapping("/{id}") 	public Person getPerson(@PathVariable Long id) { 		// ... 	} 	@PostMapping 	@ResponseStatus(HttpStatus.CREATED) 	public void add(@RequestBody Person person) { 		// ... 	} }`

HTTP方法有多种请求类型，Spring框架也提供了五种Mapping注解。

*   `@GetMapping`
*   `@PostMapping`
*   `@PutMapping`
*   `@DeleteMapping`
*   `@PatchMapping`

（3）@RequestParam和、@PathVariable

有个Spring MVC注解相关的小细节，当我们编写有入参的后端接口时，很多同学弄不清楚入参对应的注解要使用什么。

南哥整理了下，如果请求URL类似于`localhost:8080/test/?id=6`，使用的入参注解是@RequestParam。

java

 代码解读

复制代码

  `@PostMapping("/test")   public CommonResult publishCourse(@RequestParam String id) {   }`

如果请求URL类似于`localhost:8080/test/6`，使用的入参注解是@PathVariable。

java

 代码解读

复制代码

  `@PostMapping("/test/{id}")   public CommonResult publishCourse(@PathVariable String id) {   }`

[戳这，《JavaProGuide》作为一份涵盖Java程序员所需掌握核心知识、面试重点的Java学习~进阶指南。](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhdgaadd%2FJavaProGuide "https://github.com/hdgaadd/JavaProGuide")

![在这里插入图片描述](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f9111bc794384f00a97b5ac14035ac84~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSmF2YVNvdXRo5Y2X5ZOl:q75.awebp?rk3s=f64ab15b&x-expires=1727425535&x-signature=gB1m7WWjj%2FwGVeZSZvp0da6l%2BYs%3D)

欢迎关注南哥的公众号：Java进阶指南针。我是南哥，南就南在Get到你的有趣评论➕点赞➕关注。

> **创作不易，不妨点赞、收藏、关注支持一下，各位的支持就是我创作的最大动力**❤️