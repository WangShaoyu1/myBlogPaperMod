---
author: "MacroZheng"
title: "MyBatis这样用，同事直呼哇塞，堪称最佳实践！"
date: 2022-11-01
description: "MyBatis是一款非常流行的ORM框架，相信很多小伙伴都在使用。最近总结了下MyBatis的实用用法和技巧，希望对大家有所帮助！"
tags: ["Java","后端","MyBatis中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:112,comments:0,collects:329,views:19702,"
---
> MyBatis是一款非常流行的ORM框架，相信很多小伙伴都在使用。我们经常会把它和MyBatis-Plus或者MBG一起使用，用多了之后对于其一些常规操作就不太熟悉了。最近总结了下MyBatis的实用用法和技巧，希望对大家有所帮助！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

MyBatis简介
---------

MyBatis是一款优秀的开源持久层框架，支持自定义SQL查询、存储过程和高级映射，目前在Github上已有`17k+Star`。在MyBatis中，我们可以在XML中编写SQL语句，然后绑定到Java方法中，通过参数和结果集的自动映射来实现复杂的查询逻辑。MyBatis消除了几乎所有JDBC操作和手动绑定参数操作，使用起来非常方便！

在SpringBoot中集成
--------------

> 下面我们来聊聊MyBatis在SpringBoot中的使用，首先我们需要集成它。

*   在`pom.xml`中添加MyBatis提供的Spring Boot Starter；

```xml
<dependency>
<groupId>org.mybatis.spring.boot</groupId>
<artifactId>mybatis-spring-boot-starter</artifactId>
<version>2.2.2</version>
</dependency>
```

*   然后在`application.yml`中配置好编写SQL实现的`xml`文件路径，这里我们存放在`resources/dao`目录下；

```yaml
mybatis:
mapper-locations:
- classpath:dao/*.xml
```

*   然后添加Java配置，通过`@MapperScan`配置好Dao接口路径，这样就可以开始使用了。

```java
/**
* MyBatis配置类
* Created by macro on 2019/4/8.
*/
@Configuration
@MapperScan("com.macro.mall.tiny.dao")
    public class MyBatisConfig {
}
```

基本使用
----

> 下面我们来聊聊MyBatis的基本使用方法，涵盖了基本的增删改查操作。

### 表结构说明

这里将以[mall项目](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")中权限管理模块相关表为例进行介绍，具体表结构如下。

![](/images/jueJin/0536b5da300d4f4.png)

### 项目结构说明

本文示例使用了`mall-learning`项目中的`mall-tiny-mybatis`模块代码，具体项目结构如下。

![](/images/jueJin/d456477240114a6.png)

### select

*   首先是查询操作，这里我们以后台用户表`ums_admin`为例，编写一个`根据ID查询用户`的方法，先创建实体类`UmsAdmin`；

```java
    public class UmsAdmin implements Serializable {
    private Long id;
    
    private String username;
    
    private String password;
    
    @ApiModelProperty(value = "头像")
    private String icon;
    
    @ApiModelProperty(value = "邮箱")
    private String email;
    
    @ApiModelProperty(value = "昵称")
    private String nickName;
    
    @ApiModelProperty(value = "备注信息")
    private String note;
    
    @ApiModelProperty(value = "创建时间")
    private Date createTime;
    
    @ApiModelProperty(value = "最后登录时间")
    private Date loginTime;
    
    @ApiModelProperty(value = "帐号启用状态：0->禁用；1->启用")
    private Integer status;
}
```

*   然后创建数据操作的接口`UmsAdminDao`，再添加对应的方法；

```java
/**
* 自定义UmsAdmin表查询
* Created by macro on 2022/10/20.
*/
@Repository
    public interface UmsAdminDao {
    
    /**
    * 根据ID查询用户
    */
    UmsAdmin selectByIdSimple(Long id);
}
```

*   再创建`xml`文件`UmsAdminDao.xml`，添加查询方法的SQL实现；

```xml
<select id="selectByIdSimple" resultType="com.macro.mall.tiny.model.UmsAdmin">
select * from ums_admin where id = #{id}
</select>
```

*   然后编写测试类，注入Dao，调用Dao方法来进行测试；

```java
/**
* MyBatis基本操作测试
* Created by macro on 2022/10/20.
*/
@SpringBootTest
    public class MyBatisBaseTest {
    
    private static final Logger LOGGER = LoggerFactory.getLogger(MyBatisBaseTest.class);
    
    @Autowired
    private UmsAdminDao umsAdminDao;
    
    @Test
        void testSelectByIdSimple(){
        UmsAdmin umsAdmin = umsAdminDao.selectByIdSimple(1L);
        LOGGER.info("testSelectByIdSimple result={}",umsAdmin);
    }
}
```

*   此时你会发现，对于一些数据库表中以`下划线`分割的返回字段无法自动映射，可以通过对字段取别名的方式来进行映射；

```xml
<select id="selectById" resultType="com.macro.mall.tiny.model.UmsAdmin">
select username,
password,
icon,
email,
nick_name   as nickName,
note,
create_time as createTime,
login_time  as loginTime,
status
from ums_admin
where id = #{id}
</select>
```

*   如果你觉得这种方式比较麻烦，也可以通过在`application.yml`中开启全局下划线自动转驼峰功能来解决，个人习惯使用第一种。

```yaml
mybatis:
configuration:
# 下划线自动转驼峰
map-underscore-to-camel-case: true
```

### insert

*   接下来我们来编写一个`插入单个用户`的方法；

```java
/**
* 自定义UmsAdmin表查询
* Created by macro on 2022/10/20.
*/
@Repository
    public interface UmsAdminDao {
    
    /**
    * 插入用户
    */
    int insert(UmsAdmin entity);
}
```

*   然后在xml中编写对应的SQL实现，这里需要注意的是如果想返回插入后的自增ID的话，需要使用`selectKey`标签进行配置。

```xml
<insert id="insert">
insert into ums_admin(username, password, icon, email, nick_name, note, create_time, login_time)
values (#{username}, #{password}, #{icon}, #{email}, #{nickName}, #{note}, #{createTime}, #{loginTime})
<selectKey keyColumn="id" resultType="long" keyProperty="id" order="AFTER">
SELECT LAST_INSERT_ID()
</selectKey>
</insert>
```

### update

*   接下来我们来编写一个`根据ID修改用户信息`的方法；

```java
/**
* 自定义UmsAdmin表查询
* Created by macro on 2022/10/20.
*/
@Repository
    public interface UmsAdminDao {
    /**
    * 根据ID修改用户信息
    */
    int updateById(UmsAdmin entity);
}
```

*   然后在xml中编写对应的SQL实现。

```xml
<update id="updateById">
update ums_admin
set username = #{username},
password = #{password},
icon = #{icon},
email = #{email},
nick_name = #{nickName},
note = #{note},
create_time = #{createTime},
login_time = #{loginTime}
where id = #{id}
</update>
```

### delete

*   接下来我们来编写一个`根据ID删除用户`的方法；

```java
/**
* 自定义UmsAdmin表查询
* Created by macro on 2022/10/20.
*/
@Repository
    public interface UmsAdminDao {
    /**
    * 根据ID删除用户
    */
    int deleteById(Long id);
}
```

*   然后在xml中编写对应的SQL实现。

```xml
<delete id="deleteById">
delete from  ums_admin where id = #{id}
</delete>
```

动态SQL
-----

> 通过MyBatis的动态SQL功能，我们可以灵活地在xml中实现各种复杂的操作，动态SQL功能需要依赖MyBatis的各种标签，下面我们就来学习下。

### if

*   `if`标签可以实现判断逻辑，这里我们以`根据用户名和Email模糊查询用户`为例，来聊聊它的使用；

```java
/**
* 自定义UmsAdmin表查询
* Created by macro on 2022/10/20.
*/
@Repository
    public interface UmsAdminDao {
    /**
    * 根据用户名和Email模糊查询用户
    * 不输入查询所有
    */
    List<UmsAdmin> selectByUsernameAndEmailLike(@Param("username") String username, @Param("email") String email);
}
```

*   xml中添加对应的SQL实现如下。

```xml
<select id="selectByUsernameAndEmailLike" resultType="com.macro.mall.tiny.model.UmsAdmin">
select username,
password,
icon,
email,
nick_name   as nickName,
note,
create_time as createTime,
login_time  as loginTime,
status
from ums_admin
where 1=1
<if test="username!=null and username!=''">
and username like concat('%',#{username},'%')
</if>
<if test="email!=null and email!=''">
and email like concat('%',#{email},'%')
</if>
</select>
```

### choose

*   `choose`标签也可以实现判断逻辑，上面的例子中当我们不输入用户名和Email时，会查询出全部用户，我们如果想不查询出用户，可以使用它；

```xml
<select id="selectByUsernameAndEmailLike2" resultType="com.macro.mall.tiny.model.UmsAdmin">
select username,
password,
icon,
email,
nick_name as nickName,
note,
create_time as createTime,
login_time as loginTime,
status
from ums_admin
where 1=1
<choose>
<when test="username!=null and username!=''">
and username like concat('%',#{username},'%')
</when>
<when test="email!=null and email!=''">
and email like concat('%',#{email},'%')
</when>
<otherwise>
and 1=2
</otherwise>
</choose>
</select>
```

### where

*   上面的例子中我们为了SQL拼接不出错，添加了`where 1=1`这样的语句，其实可以使用`where`标签来实现查询条件，当标签内没有内容时会自动去除`where`关键字，同时还会去除开头多余的`and`关键字。

```xml
<select id="selectByUsernameAndEmailLike3" resultType="com.macro.mall.tiny.model.UmsAdmin">
select username,
password,
icon,
email,
nick_name as nickName,
note,
create_time as createTime,
login_time as loginTime,
status
from ums_admin
<where>
<if test="username!=null and username!=''">
and username like concat('%',#{username},'%')
</if>
<if test="email!=null and email!=''">
and email like concat('%',#{email},'%')
</if>
</where>
</select>
```

### set

*   当我们拼接更新字段的语句时，也会面临同样的问题，此时可以使用`set`标签来解决，比如我们现在想写一个`根据ID选择性修改用户信息`的方法；

```java
/**
* 自定义UmsAdmin表查询
* Created by macro on 2022/10/20.
*/
@Repository
    public interface UmsAdminDao {
    /**
    * 根据ID选择性修改用户信息
    */
    int updateByIdSelective(UmsAdmin entity);
}
```

*   方法对应的SQL实现如下，这里既避免了使用`set`关键字，也会将多余的逗号去除。

```xml
<update id="updateByIdSelective">
update ums_admin
<set>
<if test="username!=null and username!=''">
username = #{username},
</if>
<if test="password!=null and password!=''">
password = #{password},
</if>
<if test="icon!=null and icon!=''">
icon = #{icon},
</if>
<if test="email!=null and email!=''">
email = #{email},
</if>
<if test="nickName!=null and nickName!=''">
nick_name = #{nickName},
</if>
<if test="note!=null and note!=''">
note = #{note},
</if>
<if test="createTime!=null">
create_time = #{createTime},
</if>
<if test="loginTime!=null">
login_time = #{loginTime},
</if>
</set>
where id = #{id}
</update>
```

### foreach

*   通过`foreach`我们可以实现一些循环拼接SQL的逻辑，例如我们现在需要编写一个`批量插入用户`的方法；

```java
/**
* 自定义UmsAdmin表查询
* Created by macro on 2022/10/20.
*/
@Repository
    public interface UmsAdminDao {
    /**
    * 批量插入用户
    */
    int insertBatch(@Param("entityList") List<UmsAdmin> adminList);
}
```

*   在xml中的对应SQL实现如下，在`foreach`标签中的内容会根据传入的集合参数进行循环拼接；

```xml
<insert id="insertBatch">
insert into ums_admin(username, password, icon, email, nick_name, note, create_time, login_time) values
<foreach collection="entityList" separator="," item="item">
(#{item.username}, #{item.password}, #{item.icon}, #{item.email}, #{item.nickName}, #{item.note}, #{item.createTime}, #{item.loginTime})
</foreach>
</insert>
```

*   再例如我们现在需要编写一个`根据用户ID批量查询`的方法；

```java
/**
* 自定义UmsAdmin表查询
* Created by macro on 2022/10/20.
*/
@Repository
    public interface UmsAdminDao {
    /**
    * 根据用户ID批量查询
    */
    List<UmsAdmin> selectByIds(@Param("ids") List<Long> ids);
}
```

*   在xml中的对应SQL实现如下，我们可以使用`open`、`close`属性指定拼接语句的前后缀。

```xml
<select id="selectByIds" resultType="com.macro.mall.tiny.model.UmsAdmin">
select username,
password,
icon,
email,
nick_name   as nickName,
note,
create_time as createTime,
login_time  as loginTime,
status
from ums_admin
where id in
<foreach collection="ids" item="item" open="(" close=")" separator=",">
#{item}
</foreach>
</select>
```

高级查询
----

> 介绍完MyBatis的基本操作后，我们再来介绍下MyBatis的高级查询功能。

### 一对一映射

*   在我们平时进行SQL查询时，往往会有`一对一`的情况，比如说我们这里有资源分类`ums_resource_category`和资源`ums_resource`两张表，资源和分类就是一对一的关系，如果你不想改动原实体类的话，可以编写一个扩展类继承`UmsResource`，并包含`UmsResourceCategory`属性；

```java
/**
* UmsResource扩展类
* Created by macro on 2022/10/20.
*/
@Data
    public class UmsResourceExt extends UmsResource {
    
    private UmsResourceCategory category;
}
```

*   例如我们需要编写一个`根据资源ID获取资源及分类信息`的方法；

```java
/**
* 自定义UmsResource表查询
* Created by macro on 2022/10/20.
*/
@Repository
    public interface UmsResourceDao {
    /**
    * 根据资源ID获取资源及分类信息
    */
    UmsResourceExt selectResourceWithCategory(Long id);
}
```

*   在xml中的具体SQL实现如下，我们可以通过给`ums_resource_category`表中字段取以`category.xxx`的别名来自动进行自动映射；

```xml
<select id="selectResourceWithCategory" resultType="com.macro.mall.tiny.domain.UmsResourceExt">
select ur.id,
ur.create_time  as createTime,
ur.name,
ur.url,
ur.description,
ur.category_id  as categoryId,
urc.id          as "category.id",
urc.name        as "category.name",
urc.sort        as "category.sort",
urc.create_time as "category.createTime"
from ums_resource ur
left join ums_resource_category urc on ur.category_id = urc.id
where ur.id = #{id}
</select>
```

*   当然除了这种方式以外，我们还可以通过`ResultMap`+`association`标签来实现，不过在此之前我们在编写xml文件的时候，一般习惯于先给当前文件写一个`BaseResultMap`，用于对当前表的字段和对象属性进行直接映射，例如在`UmsResourceCategoryDao.xml`中这样实现；

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.macro.mall.tiny.dao.UmsResourceCategoryDao">

<resultMap id="BaseResultMap" type="com.macro.mall.tiny.model.UmsResourceCategory">
<id property="id" column="id"/>
<result property="createTime" column="create_time"/>
<result property="name" column="name"/>
<result property="sort" column="sort"/>
</resultMap>
</mapper>
```

*   在`UmsResourceDao.xml`中我们可以这样实现；

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.macro.mall.tiny.dao.UmsResourceDao">

<resultMap id="BaseResultMap" type="com.macro.mall.tiny.model.UmsResource">
<id property="id" column="id"/>
<result property="createTime" column="create_time"/>
<result property="name" column="name"/>
<result property="url" column="url"/>
<result property="description" column="description"/>
<result property="categoryId" column="category_id"/>
</resultMap>
</mapper>
```

*   编写完成后，我们的一对一`ResultMap`实现就很简单了，我们可以使用`association`标签进行一对一管理，配置`columnPrefix`属性将匹配到的字段直接映射到关联对象中去；

```xml
<resultMap id="ResourceWithCategoryMap" type="com.macro.mall.tiny.domain.UmsResourceExt" extends="BaseResultMap">
<association property="category" resultMap="com.macro.mall.tiny.dao.UmsResourceCategoryDao.BaseResultMap" columnPrefix="category_"/>
</resultMap>
```

*   然后再编写下Dao中方法对应SQL实现即可，这里直接使用上面的ResultMap，同时给`ums_resource_category`表中的字段指定了`category_`前缀以便于映射。

```xml
<select id="selectResourceWithCategory2" resultMap="ResourceWithCategoryMap">
select ur.id,
ur.create_time,
ur.name,
ur.url,
ur.description,
ur.category_id,
urc.id          as category_id,
urc.name        as category_name,
urc.sort        as category_sort,
urc.create_time as category_create_time
from ums_resource ur
left join ums_resource_category urc on ur.category_id = urc.id
where ur.id = #{id}
</select>
```

### 一对多映射

*   在编写SQL查询时，一对多的情况也比较常见，例如这里的分类和资源就是一对多的情况；

```java
/**
* UmsResourceCategory扩展类
* Created by macro on 2022/10/20.
*/
@Data
    public class UmsResourceCategoryExt extends UmsResourceCategory {
    
    private List<UmsResource> resourceList;
}
```

*   例如我们现在需要编写一个`根据分类ID获取分类及对应资源`的方法；

```java
/**
* 自定义UmsResourceCategory表查询
* Created by macro on 2022/10/20.
*/
@Repository
    public interface UmsResourceCategoryDao {
    
    /**
    * 根据分类ID获取分类及对应资源
    */
    UmsResourceCategoryExt selectCategoryWithResource(Long id);
}
```

*   在实现具体SQL前，我们需要先在xml中配置一个ResultMap，通过`collection`标签建立一对多关系；

```xml
<resultMap id="selectCategoryWithResourceMap" type="com.macro.mall.tiny.domain.UmsResourceCategoryExt" extends="BaseResultMap">
<collection property="resourceList" columnPrefix="resource_" resultMap="com.macro.mall.tiny.dao.UmsResourceDao.BaseResultMap"/>
</resultMap>
```

*   然后在xml中编写具体的SQL实现，使用该ResultMap。

```xml
<select id="selectCategoryWithResource" resultMap="selectCategoryWithResourceMap">
select urc.id,
urc.create_time,
urc.name,
urc.sort,
ur.id resource_id,
ur.create_time resource_create_time,
ur.name resource_name,
ur.url resource_url,
ur.description resource_description,
ur.category_id resource_category_id
from ums_resource_category urc
left join ums_resource ur on urc.id = ur.category_id
where urc.id = #{id}
</select>
```

### 分页插件

*   我们平时实现查询逻辑时，往往还会遇到分页查询的需求，直接使用开源的`PageHelper`插件即可，首先在`pom.xml`中添加它的Starter；

```xml
<!--MyBatis分页插件-->
<dependency>
<groupId>com.github.pagehelper</groupId>
<artifactId>pagehelper-spring-boot-starter</artifactId>
<version>1.4.2</version>
</dependency>
```

*   然后在查询方法之前使用它的`startPage`方法传入分页参数即可，分页后的得到的数据可以在`PageInfo`中获取到。

```java
/**
* UmsResource的Service接口实现类
* Created by macro on 2022/10/20.
*/
@Service
    public class UmsResourceServiceImpl implements UmsResourceService {
    
    @Autowired
    private UmsResourceDao umsResourceDao;
    
    @Override
        public PageInfo<UmsResource> page(Integer pageNum, Integer pageSize,Long categoryId) {
        PageHelper.startPage(pageNum,pageSize);
        List<UmsResource> resourceList = umsResourceDao.selectListByCategoryId(categoryId);
        PageInfo<UmsResource> pageInfo = new PageInfo<>(resourceList);
        return pageInfo;
    }
}

```

总结
--

本文主要介绍了MyBatis中一些比较常规的用法，涵盖了SpringBoot集成、基本查询、动态SQL和高级查询，建议大家收藏起来，在对MyBatis的用法有所遗忘的时候拿出来看看。

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-mybatis "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-mybatis")