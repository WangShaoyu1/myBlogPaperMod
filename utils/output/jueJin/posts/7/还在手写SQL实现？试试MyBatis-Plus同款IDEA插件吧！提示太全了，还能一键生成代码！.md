---
author: "MacroZheng"
title: "还在手写SQL实现？试试MyBatis-Plus同款IDEA插件吧！提示太全了，还能一键生成代码！"
date: 2022-08-31
description: "偶然发现MyBatis-Plus团队也开发了一款插件MyBatisX，体验了一把确实非常好用，提示很全，而且还能通过GUI生成代码，推荐给大家！"
tags: ["Java","后端","MyBatis中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:77,comments:10,collects:178,views:9895,"
---
> 最近发现之前使用的MyBatis插件很久都没更新了，就想换个其他插件来用用。偶然发现MyBatis-Plus团队也开发了一款插件`MyBatisX`，体验了一把确实非常好用，提示很全，而且还能通过GUI生成代码，推荐给大家！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

MybatisX简介
----------

MybatisX是一款基于IDEA的快速开发插件，由MyBatis-Plus团队开发维护，为效率而生。

它的主要功能如下：

*   支持mapper.xml和Mapper接口之间方法的互相导航跳转；
*   内置代码生成器，通过使用GUI的形式，能根据数据库来生成Domain、mapper.xml、Mapper、Service和Service实现类代码；
*   可以自定义代码生成器模板；
*   可以通过类似JPA的方式，直接根据方法名称在mapper.xml中生成查询实现，同时支持提示。

使用
--

> 接下来介绍下MybatisX的使用，这里以我的脚手架项目[mall-tiny](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-tiny "https://github.com/macrozheng/mall-tiny")为例。

### 安装

在使用前我们需要在插件市场中搜索并安装MyBatisX插件。

![](/images/jueJin/6069a425401e4d5.png)

安装完成后我们会发现所有的Mapper接口和mapper.xml文件都变成了MyBatis的小鸟图标。

![](/images/jueJin/ae3e09bfd02b49f.png)

### XML与接口互跳

我们点击Mapper接口方法左侧的图标可以直接跳转到mapper.xml对应的SQL实现，在mapper.xml点击左侧图标也可以直接跳转到Mapper接口中对应的方法。

![](/images/jueJin/241ff44ec1d7451.png)

### 自动生成代码

> 还记得之前在[mall-tiny](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-tiny "https://github.com/macrozheng/mall-tiny")项目中我们手写的代码生成器么，MyBatisX直接整了个带图形化界面的，下面我们来体验下。

*   选中表以后右键可以直接生成对应表的CRUD代码，当然你也可以多选，支持一次性生成多表；

![](/images/jueJin/f28c523fee5b43c.png)

*   生成的时候可以通过GUI来修改选项，比如修改基础包路径、实体类包路径等；

![](/images/jueJin/59e30c8826f24df.png)

*   生成时选择注解和模板类型为Mybatis-Plus 3，有需要的话可以勾选Lombok选项以及修改mapper.xml的文件路径；

![](/images/jueJin/e5983fba97fa461.png)

*   点击确认后将生成如下文件，还记得之前在mall-tiny项目中用代码写的代码生成器么，有了GUI就用不着手写了！

![](/images/jueJin/be0319a5cd1e4d8.png)

### 自定义生成模板

> 如果你觉得默认的代码生成器模板不符合你的要求，还可以试试自定义模板。

*   我们一般会在实体类中加入Swagger的注解，方便API文档的生成，MyBatisX默认生成的实体类是不带Swagger注解的；

![](/images/jueJin/0dd7cee1e1d0428.png)

*   MyBatisX也提供了生成带Swagger注解的实体类模板，但是有点复杂不太符合我的要求，我们可以修改下生成模板，生成模板都在`extensions->MyBaitsX`目录下；

![](/images/jueJin/2a652286d1b6400.png)

*   这里我们修改下`domain.ftl`文件即可，最终文件内容如下；

```kotlin
package ${domain.packageName};

import java.io.Serializable;
<#list tableClass.importList as fieldType>${"\n"}import ${fieldType};</#list>
import io.swagger.annotations.ApiModelProperty;
import io.swagger.annotations.ApiModel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import com.baomidou.mybatisplus.annotation.TableName;

/**
* ${tableClass.remark!}
*/
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("${tableClass.tableName}")
@ApiModel(value="${tableClass.shortClassName}对象", description="${tableClass.remark!}")
    public class ${tableClass.shortClassName} implements Serializable {
    
    private static final long serialVersionUID=1L;
    
    <#list tableClass.allFields as field>
    @ApiModelProperty("${field.remark!}")
    private ${field.shortTypeName} ${field.fieldName};
    
    </#list>
}
```

*   然后再运行代码生成器，选择只生成带Swagger注解的实体类；

![](/images/jueJin/4f4b388310f740f.png)

*   生成完成后实体类就会带上Swagger注解了，是不是很方便！

![](/images/jueJin/d471bb6ca8834de.png)

### JPA提示

> MyBatisX还有个强大的功能，可以根据JPA风格的方法名直接生成SQL实现，无需手写SQL。

*   例如我们想写个批量插入数据方法，就可以这样来操作；

![](/images/jueJin/205a83eb036e455.png)

*   例如我们想写个根据名称查询品牌的方法，MyBatisX会像JPA一样自动提示字段，并且能自动生成SQL实现；

![](/images/jueJin/1af749c09a1d44f.png)

*   例如我们想写个根据ID修改品牌名称的方法；

![](/images/jueJin/a83435a2061f4db.png)

*   例如我们想写个根据名称删除品牌的方法，MyBatisX的JPA提示还是非常全面的！

![](/images/jueJin/1d7443ba86204e0.png)

### 图标设置

如果你不想Mapper接口和mapper.xml文件都变成小鸟图标的话，可以做在MyBatisX的设置中进行修改。

![](/images/jueJin/df3f9797752042e.png)

总结
--

MyBatisX确实是一款非常好用的IDEA插件，不仅提示全面，而且自带了图形化的代码生成器，能极大地提高我们的开发效率。MyBatisX中的JPA提示功能也非常不错，只要你的方法命名符合JPA规范，就能自动生成SQL实现，确实是个好功能。

参考资料
----

官方文档：[baomidou.com/pages/ba5b2…](https://link.juejin.cn?target=https%3A%2F%2Fbaomidou.com%2Fpages%2Fba5b24%2F "https://baomidou.com/pages/ba5b24/")