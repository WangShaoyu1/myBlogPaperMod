---
author: "小u"
title: "一个简单的TODO，原来这么好用"
date: 2023-09-10
description: "平常我们再开发的时候，遇到一些想要之后去编写的部分，或者说再开发某个模块的时候，突然被事情打断，暂时无法实现的代码，以后才会去修复的bug的时候，要如何精准快速的去定位到那个位置呢？下面来介绍一个很"
tags: ["后端","Java"]
ShowReadingTime: "阅读1分钟"
weight: 163
---
平常我们再开发的时候，遇到一些想要之后去编写的部分，或者说再开发某个模块的时候，突然被事情打断，暂时无法实现的代码，以后才会去修复的bug的时候，要如何精准快速的去定位到那个位置呢？

下面来介绍一个很多人会忽律的标记`TODO`

TODO是一个特殊的标记，用于标识需要实现但目前还未实现的功能。这是一个Javadoc的标签，因此它只能应用于类、接口和方法。

它可以帮助我们跟踪和管理开发中的待办事项。

使用方法
----

首先看一个最基本的使用方法

java

 代码解读

复制代码

`@RestController public class TestController {     @GetMapping("/hello")     public String hello(){         //TODO do something         return "Hello World";     } }`

这里我们加上TODO。之后再需要去进行修改的时候。

直接去搜索就可以了

![image-20230906195743692](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d105e865a1cc4d3a932b46aeeac270b0~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=994&h=951&s=98671&e=png&b=292b2e)

除了这个方法，还有很多隐藏的方法

进入设置

![image-20230906195949934](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff5e9c2828ce4d83b5dce05356d5e62a~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1472&h=1091&s=60080&e=png&b=2b2d30)

这里就可以自定义todo了

如果是团队协作的话，每个人可以自定义其他的todo类型。

也可以用自己喜欢的更加醒目的颜色

![image-20230906200230765](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48498daf8baa4ed28d44439c53f3d4c0~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=935&h=396&s=41442&e=png&b=212225)

同时也可以在idea中进行全局的todo查看

![image-20230906200444351](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7941a0d29804475ca655e02411cfee63~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1585&h=486&s=40600&e=png&b=2d2f32)

除了这个之外，还有过滤器，可以进行自定义的todo类型

![image-20230906200527489](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8265eea2317c4750902e20c4b17dee41~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=922&h=279&s=28544&e=png&b=2e3033)

阿里巴巴Java开发手册中对TODO的规范标注主要有以下两点：

1.  TODO：表示需要实现，但目前还未实现的功能。这个标记通常用于类、接口和方法中。
2.  FIXME：标记某代码是错误的，而且不能工作，需要及时纠正的情况。

最佳实践
----

编写一个代码模板

![image-20230906201219291](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1239ae6e273b4efca97b9368f785d9ed~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1472&h=1091&s=162630&e=png&b=2b2d30)

![image-20230906201810835](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa7c33cb7c624b1cbce39dbad44fbd30~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=897&h=88&s=14638&e=png&b=1f2023)

这样，就是一个最佳的实战了。