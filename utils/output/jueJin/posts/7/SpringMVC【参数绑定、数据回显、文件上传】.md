---
author: "Java3y"
title: "SpringMVC【参数绑定、数据回显、文件上传】"
date: 2018-03-17
description: "我们在Controller使用方法参数接收值，就是把web端的值给接收到Controller中处理,这个过程就叫做参数绑定 从上面的用法我们可以发现，我们可以使用request对象、Model对象等等，其实是不是可以随便把参数写上去都行？？？其实并不是的 一般地，我…"
tags: ["Java","Spring","Java EE中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:21,comments:0,collects:14,views:1270,"
---
前言
==

本文主要讲解的知识点如下：

*   参数绑定
*   数据回显
*   文件上传

参数绑定
====

我们在Controller使用方法参数接收值，就是**把web端的值给接收到Controller中处理,这个过程就叫做参数绑定**...

默认支持的参数类型
---------

从上面的用法我们可以发现，我们可以使用request对象、Model对象等等，其实是不是可以随便把参数写上去都行？？？其实并不是的...

Controller方法默认支持的参数类型有4个，这4个足以支撑我们的日常开发了

*   **HttpServletRequest**
*   **HttpServletResponse**
*   **HttpSession**
*   **Model**

参数的绑定过程
-------

**一般地，我们要用到自定义的参数绑定就是上面所讲的日期类型转换以及一些特殊的需求**....对于平常的参数绑定，我们是无需使用转换器的，SpringMVC就已经帮我们干了这个活了...

![这里写图片描述](/images/jueJin/162330e66463b11.png)

自定义绑定参数【老方式、全部Action均可使用】
-------------------------

在上一篇我们已经简单介绍了怎么把字符串转换成日期类型了【使用的是WebDataBinder方式】...其实那是一个比较老的方法，我们可以使用SpringMVC更推荐的方式...

在上次把字符串转换成日期类型，如果使用的是WebDataBinder方式的话，那么该转换仅仅只能在当前Controller使用...如果想要全部的Controller都能够使用，那么我们可以使用WebBindingInitializer方式

**如果想多个controller需要共同注册相同的属性编辑器，可以实现PropertyEditorRegistrar接口，并注入webBindingInitializer中。**

实现接口

```

    public class CustomPropertyEditor implements PropertyEditorRegistrar {
    
    @Override
        public void registerCustomEditors(PropertyEditorRegistry binder) {
        binder.registerCustomEditor(Date.class, new CustomDateEditor(
        new SimpleDateFormat("yyyy-MM-dd HH-mm-ss"), true));
        
    }
    
}
```

### **配置转换器**

注入到webBindingInitializer中

```
<!-- 注册属性编辑器 -->
<bean id="customPropertyEditor" class="cn.itcast.ssm.controller.propertyeditor.CustomPropertyEditor"></bean>


<!-- 自定义webBinder -->
<bean id="customBinder"
class="org.springframework.web.bind.support.ConfigurableWebBindingInitializer">

<!-- propertyEditorRegistrars用于属性编辑器 -->
<property name="propertyEditorRegistrars">
<list>
<ref bean="customPropertyEditor" />
</list>
</property>
</bean>


<!-- 注解适配器 -->
<bean
class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter">
<!-- 在webBindingInitializer中注入自定义属性编辑器、自定义转换器 -->
<property name="webBindingInitializer" ref="customBinder"></property>
</bean>


```

自定义参数转换器【新方式、推崇方式】
------------------

上面的方式是对象较老的，现在我们一般都是**实现Converter接口来实现自定义参数转换**...我们就来看看实现Converter比上面有什么好

配置日期转换器

```

    public class CustomDateConverter implements Converter<String, Date> {
    
    @Override
        public Date convert(String source) {
            try {
            //进行日期转换
            return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(source);
            
                } catch (Exception e) {
                e.printStackTrace();
            }
            return null;
        }
        
    }
```

配置去除字符串转换器

```

    public class StringTrimConverter implements Converter<String, String> {
    
    @Override
        public String convert(String source) {
            try {
            //去掉字符串两边空格，如果去除后为空设置为null
                if(source!=null){
                source = source.trim();
                    if(source.equals("")){
                    return null;
                }
            }
            
                } catch (Exception e) {
                e.printStackTrace();
            }
            return source;
        }
    }
    
```

从上面可以得出，我们想要转换什么内容，就直接实现接口，该接口又是支持泛型的，阅读起来就非常方便了...

### **配置转换器**

```


<!-- 转换器 -->
<bean id="conversionService"
class="org.springframework.format.support.FormattingConversionServiceFactoryBean">
<property name="converters">
<list>
<bean class="cn.itcast.ssm.controller.converter.CustomDateConverter"/>
<bean class="cn.itcast.ssm.controller.converter.StringTrimConverter"/>
</list>
</property>
</bean>


<!-- 自定义webBinder -->
<bean id="customBinder"
class="org.springframework.web.bind.support.ConfigurableWebBindingInitializer">
<!-- 使用converter进行参数转 -->
<property name="conversionService" ref="conversionService" />
</bean>


<!-- 注解适配器 -->
<bean
class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter">
<!-- 在webBindingInitializer中注入自定义属性编辑器、自定义转换器 -->
<property name="webBindingInitializer" ref="customBinder"></property>
</bean>



```

如果是基于`<mvc:annotation-driven>`的话，我们是这样配置的

```

<mvc:annotation-driven conversion-service="conversionService">
</mvc:annotation-driven>
<!-- conversionService -->
<bean id="conversionService"
class="org.springframework.format.support.FormattingConversionServiceFactoryBean">
<!-- 转换器 -->
<property name="converters">
<list>
<bean class="cn.itcast.ssm.controller.converter.CustomDateConverter"/>
<bean class="cn.itcast.ssm.controller.converter.StringTrimConverter"/>
</list>
</property>
</bean>
```

@RequestParam注解
---------------

我们一般使用的参数绑定都有遵循的规则：**方法参数名要与传递过来的name属性名相同。**

在默认的情况下，只有名字相同，SpringMVC才会帮我们进行参数绑定...

如果我们使用`@RequestParam注解`的话，我们就可以使方法参数名与传递过来的name属性名不同...

该注解有三个变量

*   **value【指定name属性的名称是什么】**
*   required【是否必须要有该参数】
*   defaultvalue设置默认值

例子：我们的方法参数叫id，而页面带过来的name属性名字叫item\_id，一定需要该参数

```

    public String editItem(@RequestParam(value="item_id",required=true) String id) {
    
}
```

Controller方法返回值
===============

Controller方法的返回值其实就几种类型，我们来总结一下....

*   void
*   String
*   ModelAndView
*   redirect重定向
*   forward转发

数据回显
====

其实数据回显我们现在的话就一点也不陌生了....我们刚使用EL表达式的时候就已经学会了数据回显了，做SSH项目的时候也有三圈问题的数据回显...

在页面上数据回显本质上就是**获取reqeust域的值**..

而在我们SpringMVC中，我们是**使用Model来把数据绑定request域对象中的**

一般地我们都是使用model.addAttribute()的方式把数据绑定到request域对象中...其实SpringMVC还支持注解的方式

`@ModelAttribute`注解
-------------------

我们可以将请求的参数放到Model中，回显到页面上

![这里写图片描述](/images/jueJin/162330e627cdedd.png)

上面这种用法和model.addAttribute()的方式是没啥区别的，也体现不了注解的方便性...

而如果我们要回显的数据是公共的话，那么我们就能够体会到注解的方便性了，我们**把公共需要显示的属性抽取成方法，将返回值返回就行了。**

![这里写图片描述](/images/jueJin/162330e626fcd16.png)

那我们**就不用在每一个controller方法通过Model将数据传到页面。**

* * *

SpringMVC文件上传
=============

我们使用Struts2的时候，觉得Struts2的文件上传方式比传统的文件上传方式好用多了...

[blog.csdn.net/hon\_3y/arti…](https://link.juejin.cn?target=http%3A%2F%2Fblog.csdn.net%2Fhon_3y%2Farticle%2Fdetails%2F71091593 "http://blog.csdn.net/hon_3y/article/details/71091593")

既然我们正在学习SpringMVC，那么我们也看一下SpringMVC究竟是怎么上传文件的...

配置虚拟目录
------

在这次，我们并不是把图片上传到我们的工程目录中...

那为啥不将图片直接上传到我们的工程目录中呢？？？我们仔细想想，按照我们之前的做法，直接把文件上传到工程目录，而我们的**工程目录是我们写代码的地方** ...往往我们**需要备份我们的工程目录。**

如果把图片都上传到工程目录中，那么就非常难以处理图片了...

因此，我们**需要配置Tomcat的虚拟目录来解决，把上传的文件放在虚拟目录上**...

又值得注意的是，**Idea使用的Tomcat并不能使用传统的配置方式，也就是修改server.xml方式来配置虚拟目录，在Idea下好像不支持这种做法**...

有兴趣的同学可以去测试一下：

[blog.csdn.net/hon\_3y/arti…](https://link.juejin.cn?target=http%3A%2F%2Fblog.csdn.net%2Fhon_3y%2Farticle%2Fdetails%2F54412484 "http://blog.csdn.net/hon_3y/article/details/54412484")

那么我在网上已经找到了对应的解决办法，就是如果在idea上配置虚拟目录

[blog.csdn.net/LABLENET/ar…](https://link.juejin.cn?target=http%3A%2F%2Fblog.csdn.net%2FLABLENET%2Farticle%2Fdetails%2F51160828 "http://blog.csdn.net/LABLENET/article/details/51160828")

检测是否配置成功：

![这里写图片描述](/images/jueJin/162330e627de72b.png)

快速入门
----

在SpringMVC中文件上传需要用到的jar包

*   **commons-fileupload-1.2.2.jar**
*   **commons-io-2.4.jar**

配置文件上传解析器

```


<!-- 文件上传 -->
<bean id="multipartResolver"
class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
<!-- 设置上传文件的最大尺寸为5MB -->
<property name="maxUploadSize">
<value>5242880</value>
</property>
</bean>
```

测试的JSP

```

<%--
Created by IntelliJ IDEA.
User: ozc
Date: 2017/8/11
Time: 9:56
To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
<title>测试文件上传</title>
</head>
<body>


<form action="${pageContext.request.contextPath}/upload.action" method="post" enctype="multipart/form-data" >
<input type="file" name="picture">
<input type="submit" value="submit">
</form>

</body>
</html>

```

值得注意的是，在JSP的name属性写的是picture，那么在Controller方法参数的名称也是要写picture的，否则是获取不到对应的文件的..

```

@Controller
    public class UploadController {
    @RequestMapping("/upload")
    //MultipartFile该对象就是封装了图片文件
        public void upload(MultipartFile picture) throws Exception {
        System.out.println(picture.getOriginalFilename());
    }
}

```

![这里写图片描述](/images/jueJin/162330e627e6e29.png)

总结
==

*   在SpringMVC中的业务方法默认支持的参数有四种
    *   request
    *   response
    *   session
    *   model
*   我们的参数绑定(自动封装参数)是由我们的转换器来进行绑定的。现在用的一般都是Converter转换器
*   在上一章中我们使用WebDataBinder方式来实现对日期格式的转化，**当时仅仅是可用于当前Action的。我们想要让全部Action都可以使用的话，有两种方式:**
    *   实现PropertyEditorRegistrar(比较老的方式)
    *   **实现Converter(新的方式)**
*   **参数绑定都有遵循的规则：方法参数名要与传递过来的name属性名相同**
    *   我们可以使用@RequestParam注解来具体指定对应的name属性名称，这样也是可以实现参数绑定的。
    *   **还能够配置该参数是否是必须的。**
*   Controller方法的返回值有5种:
    *   void
    *   String
    *   ModelAndView
    *   redirect重定向
    *   forward转发
*   Model内部就是将数据绑定到request域对象中的。
*   @ModelAttribute注解能够将数据绑定到model中(也就是request中)，**如果经常需要绑定到model中的数据，抽取成方法来使用这个注解还是不错的。**
*   **idea配置虚拟目其实就是加多一个deployment，然后配置它的应用路径**
*   **SpringMVC的文件上传就是配置一个上传解析器，使用MultipartFile来接收带过来的文件。**

* * *

> 如果文章有错的地方欢迎指正，大家互相交流。**习惯在微信看技术文章，想要获取更多的Java资源的同学，可以关注微信公众号:Java3y**