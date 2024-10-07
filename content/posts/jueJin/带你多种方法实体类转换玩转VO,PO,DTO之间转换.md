---
author: "小u"
title: "带你多种方法实体类转换玩转VO,PO,DTO之间转换"
date: 2024-04-20
description: "带你多种方法实体类转换玩转VO,PO,DTO之间转换前置篇首先介绍一下这些VOPODTO等等这些的概念。方便我们的理解。首先我们来说用的比较多的，就是DTO和VO随着互联网的发展"
tags: ["后端","架构","Java"]
ShowReadingTime: "阅读7分钟"
weight: 227
---
带你多种方法实体类转换 玩转VO,PO,DTO 之间转换
----------------------------

前置篇
---

首先介绍一下这些VO PO DTO 等等这些的概念。方便我们的理解。

首先我们来说用的比较多的，就是DTO 和 VO

随着互联网的发展，前后端分离的开发模式越来越流行。在前后端数据交互过程中，为了保证数据的安全性和效率，通常会采用 DTO 和 VO 来封装数据。

DTO（Data Transfer Object）和 VO（Value Object）都是一种设计模式，用于封装数据和提供服务。

> 这里需要注意的是这个VO
> 
> 我看有的地方也这样写：VO（`View Object`）：**视图对象**，用于展示层，它的作用是把某个指定页面（或组件）的所有数据封装起来。
> 
> 这个问题，我在查询了很多资料后，得到了这样的解释：
> 
> 尽管 "View Object" 也是一个有效的解释，但在面向对象设计和领域驱动设计（DDD）的上下文中，VO 通常指的是 "Value Object"。选择哪种解释取决于具体的上下文和使用场景。
> 
> *   当讨论数据结构和业务逻辑时，VO 很可能指的是 "Value Object"。
> *   当讨论用户界面和MVC架构时，VO 可能指的是 "View Object"。
> 
> 因此，我们最好是根据该上下文来判断它指的是 "Value Object" 还是 "View Object"。

它们的主要区别在于：

*   DTO：用于封装数据传输对象，可以将数据库中的数据转换为前端需要的格式，方便前后端之间的数据交互。
*   VO：用于封装值对象，可以根据具体的需求来封装不同的数据属性，方便前端页面的显示和交互。

DTO 是一种**数据传输对象**，用于将数据库中的**数据转换为前端需要的格式**，方便前后端之间的数据**交互**。而 VO 是一种值对象，用于封装不同的数据属性，方便**前端页面**的显示和交互。

这俩个也是非常容易搞混的。

可以这样说，对于绝大部分的应用场景来说，DTO和VO的属性值基本是一致的，而且他们通常都是**POJO**，那么既然有了VO，为什么还需要DTO呢？

比较常见的操作，就是**用户的数据脱敏**。

当然，在有些项目中，我见到DTO的命名规范是xxxrequest

Vo的命名规范是xxxresponse

这个只是一个命名规范。

之后我们来了解什么是PO和DAO

**PO（Persistent Object）** 通常指的是与数据库中的表相映射的Java对象。它包含与数据库表字段**相对应的私有成员变量以及相应的get和set方法**，用于封装数据库表中的一条记录。PO类通常用于数据访问层（DAO层），作为数据库与应用程序之间的**桥梁**，实现数据的持久化存储和检索。

为了防止很多人跟这个领域对象弄混。

接下来我说一下这个阿里对于领域对象的一个规范：

1） 数据对象：xxxDO，xxx 即为数据表名。 2） 数据传输对象：xxxDTO，xxx 为业务领域相关的名称。 3） 展示对象：xxxVO，xxx 一般为网页名称。 4） POJO 是 DO/DTO/BO/VO 的统称，禁止命名成 xxxPOJO。

这里的DO 就相当于是PO 是没有什么区别的，或者说是很少的。

下面我将用一个图和案例来带你首先了解这些东西。

![whiteboard_exported_image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6bc2a1262eeb4f4095b645cb4da66574~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2836&h=1504&s=151884&e=png&b=ffffff)

之后我们在通过程序来描述一下这几个的区别

首先我们来看一下数据库表：

sql

 代码解读

复制代码

`user_id     bigint                                 not null comment '用户id'         primary key,     username    varchar(255) default ''                not null comment '用户名',     password    varchar(255) default ''                not null comment '密码',     salt        varchar(255) default ''                not null comment '随机盐值',     question    varchar(255) default ''                not null comment '密保问题',     answer      varchar(255) default ''                not null comment '密保答案',     create_time datetime     default CURRENT_TIMESTAMP not null comment '创建时间',     update_time datetime     default CURRENT_TIMESTAMP not null comment '更新时间',     constraint uk_username         unique (username) comment '用户名唯一索引'`

这个是所有的字段。

之后我们先来看最简单的po层，也就是和这个数据库是一一对应的。

kotlin

 代码解读

复制代码

`@Data public class UPanUser implements Serializable {     /**      * 用户id      */     @TableId(value = "user_id")     private Long userId; ​     /**      * 用户名      */     @TableField(value = "username")     private String username; ​     /**      * 密码      */     @TableField(value = "password")     private String password; ​     /**      * 随机盐值      */     @TableField(value = "salt")     private String salt; ​     /**      * 密保问题      */     @TableField(value = "question")     private String question; ​     /**      * 密保答案      */     @TableField(value = "answer")     private String answer; ​     /**      * 创建时间      */     @TableField(value = "create_time")     private Date createTime; ​     /**      * 更新时间      */     @TableField(value = "update_time")     private Date updateTime; ​     @TableField(exist = false)     private static final long serialVersionUID = 1L; }`

之后我们用用户登陆这个案例来演示VO和DTO

VO假设我们只想返回前端一个username

那么我们的属性就只有一个username

java

 代码解读

复制代码

`@Data public class UserInfoVo implements Serializable { ​     private static final long serialVersionUID = 1226886631190798234L; ​     private String username; ​ }`

之后来看DTO

kotlin

 代码解读

复制代码

`@Data public class UserLoginPo implements Serializable {     private static final long serialVersionUID = 1L;     @NotBlank(message = "用户名不能为空")     @Pattern(regexp = "^[a-zA-Z0-9_-]{4,16}$", message = "用户名格式错误")     private String username; ​     @NotBlank(message = "密码不能为空")     @Length(min = 6, max = 20, message = "密码长度必须在6到20之间")     private String password; }`

在dto这里我们可以使用一些校验框架来限制。这个就是前端页面或者是服务调用方传给我们的参数。也就是账号和密码来完成登陆。

之后我们开始来进行转换吧。

实战篇
---

### Beanutils

这个是比较简单的一个方法。也是我经常在用的方式

下面是一个示例：

java

 代码解读

复制代码

`import org.springframework.beans.BeanUtils; ​ public class SpringBeanUtilsExample { ​     public static void main(String[] args) {         // 创建一个PO对象         UPanUser po = new UPanUser();         po.setUserId(1L);         po.setUsername("user");         po.setPassword("password");         po.setSalt("salt");         po.setQuestion("question");         po.setAnswer("answer");         po.setCreateTime(new Date());         po.setUpdateTime(new Date()); ​         // PO转换为VO         UserInfoVo vo = new UserInfoVo();         BeanUtils.copyProperties(po, vo); ​         System.out.println("PO转换为VO：" + vo.getUsername()); ​         // 创建一个DTO对象         UserLoginPo dto = new UserLoginPo();         dto.setUsername("user");         dto.setPassword("password"); ​         // DTO转换为PO         UPanUser poFromDto = new UPanUser();         BeanUtils.copyProperties(dto, poFromDto); ​         System.out.println("DTO转换为PO：" + poFromDto.getUsername());     } } ​`

这里需要注意的是。

import org.springframework.beans.BeanUtils;

我用的是这个Beanutils

如果你用的是import org.apache.commons.beanutils.BeanUtils;

这个的话，那么这俩个方法的copyProperties 的源和目标的参数的位置是相反的。

这个可以说是很简单的，如果你需要添加注释，我这里推荐一个插件是BeanUtilsHelper

他可以支持将beanutils的这个代码转换为最原始的set get到的值的方法。有兴趣的可以去试试，还可以支持很多的注解。

之后要说的是一个性能爆炸,高级优雅,大厂标准的转换方法

### MapStcurt

如果要使用 MapStruct 库进行对象之间的映射，首先需要定义一个 Mapper 接口，并在接口中编写映射方法。然后，MapStruct 库会自动生成对应的映射实现类。

首先，在 `pom.xml` 文件中添加 MapStruct 的依赖：

xml

 代码解读

复制代码

`xmlCopy code<dependency>     <groupId>org.mapstruct</groupId>     <artifactId>mapstruct</artifactId> </dependency>`

然后，定义一个 Mapper 接口：

ini

 代码解读

复制代码

`import org.mapstruct.Mapper; import org.mapstruct.Mapping; import org.mapstruct.factory.Mappers; ​ @Mapper public interface UserMapper { ​     UserMapper INSTANCE = Mappers.getMapper(UserMapper.class); ​     @Mapping(source = "username", target = "name")     UserInfoVo toUserInfoVo(UPanUser po); ​     @Mapping(source = "name", target = "username")     UPanUser toUPanUser(UserLoginPo dto); } ​`

下面看一个他在spring中的应用：

kotlin

 代码解读

复制代码

`package com.xiaou.pan.server.modules.user.converter; ​ ​ import com.xiaou.pan.server.modules.file.domain.UPanUserFile; import com.xiaou.pan.server.modules.user.context.*; import com.xiaou.pan.server.modules.user.domain.UPanUser; import com.xiaou.pan.server.modules.user.po.*; import com.xiaou.pan.server.modules.user.vo.UserInfoVo; import org.mapstruct.Mapper; import org.mapstruct.Mapping; ​ /**  * 用户模块实体转换工具类  */ @Mapper(componentModel = "spring") public interface UserConverter { ​     /**      * 用户注册PO转换为用户注册上下文      *      * @param userRegisterPo      * @return      */     UserRegisterContext userRegisterPo2UserRegisterContext(UserRegisterPo userRegisterPo); ​     /**      * 用户注册上下文转换为用户注册PO      *      * @param userRegisterContext      * @return      */     @Mapping(target = "password", ignore = true)     UPanUser UserRegisterContext2UpanUser(UserRegisterContext userRegisterContext); ​     /**      * 用户登录PO转换为用户登录上下文      *      * @param userLoginPo      * @return      */     UserLoginContext userLoginPO2UserLoginContext(UserLoginPo userLoginPo); ​     /**      * 用户名校验上下文转换为用户名校验PO      *      * @param checkUserNamePo      * @return      */     CheckUserNameContext CheckUserNamePo2CheckUserNameContext(CheckUserNamePo checkUserNamePo); ​     /**      * CheckAnswerPo转CheckAnswerContext      *      * @param checkAnswerPo      * @return      */     CheckAnswerContext CheckAnswerPo2CheckAnswerContext(CheckAnswerPo checkAnswerPo); ​ ​     ResetPasswordContext ResetPasswordPo2ResetPasswordContext(ResetPasswordPo resetPasswordPo); ​     ChangePasswordContext ChangePasswordPo2ChangePasswordContext(ChangePasswordPo changePasswordPo); ​ ​     /**      * 拼装用户基本信息返回实体      * @param uPanUser      * @param uPanUserFile      * @return      */     @Mapping(source = "uPanUser.username", target = "username")     @Mapping(source = "uPanUserFile.fileId", target = "rootFileId")     @Mapping(source = "uPanUserFile.fileName", target = "rootFilename")     UserInfoVo assembleUserInfoVo(UPanUser uPanUser, UPanUserFile uPanUserFile); }`

除了这个之外，@mapping还有很多的参数，

比如说expression

ini

 代码解读

复制代码

`@Mapping(target = "userId", expression = "java(com.xiaou.pan.server.common.utils.UserIdUtil.get())")`

这个就是可以执行一个java代码。

他实际上的原理就是为我们自动书写实现类：

![image-20240420143355939](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60f7a0ea5db34ab8a4a353055624e975~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1906&h=1312&s=196438&e=png&b=212225)

### ModelMapper

java

 代码解读

复制代码

`import org.modelmapper.ModelMapper; ​ public class ModelMapperExample { ​     public static void main(String[] args) {         // 创建一个PO对象         UPanUser po = new UPanUser();         po.setUserId(1L);         po.setUsername("user");         po.setPassword("password");         po.setSalt("salt");         po.setQuestion("question");         po.setAnswer("answer");         po.setCreateTime(new Date());         po.setUpdateTime(new Date()); ​         // 创建 ModelMapper 对象         ModelMapper modelMapper = new ModelMapper(); ​         // PO转换为VO         UserInfoVo vo = modelMapper.map(po, UserInfoVo.class);         System.out.println("PO转换为VO：" + vo.getUsername()); ​         // 创建一个DTO对象         UserLoginPo dto = new UserLoginPo();         dto.setUsername("user");         dto.setPassword("password"); ​         // DTO转换为PO         UPanUser poFromDto = modelMapper.map(dto, UPanUser.class);         System.out.println("DTO转换为PO：" + poFromDto.getUsername());     } } ​`

使用 ModelMapper 可以更加灵活地定义属性映射规则，只需创建一个 ModelMapper 对象，然后调用其 `map` 方法即可实现对象之间的属性拷贝。

后记
--

最后呢，我想说，这些什么VO PO DTO 包括有什么 BO SO 什么的，如果你开发的大型项目。是需要进行一个完整的架构的，但是我们如果是一些小项目，没有必要为了设计而设计，导致的过度设计。