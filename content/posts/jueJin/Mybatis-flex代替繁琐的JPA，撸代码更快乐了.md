---
author: "zooooooooy"
title: "Mybatis-flex代替繁琐的JPA，撸代码更快乐了"
date: 2024-07-17
description: "MyBatis-Flex是MyBatis的一个扩展库，它提供了一些额外的功能来简化数据库操作。使用MyBatis-Flex可以减少代码量，提高开发效率。腰也不疼了，腿也走的更快了。"
tags: ["MyBatis","Kotlin","SpringBoot"]
ShowReadingTime: "阅读5分钟"
weight: 299
---
1\. 前言
------

最近在新的SpringBoot项目中采用JPA来作为数据库的持久层。刚开始得益于Spring框架自带，IDEA也有丰富的支持；可以自行匹配数据库字段，接口中方法可以直接提示，支持JPQL，原生SQL等方式。写起来也是非常顺手。但是当业务中有一些复杂一点的需求，在JPA中实现就非常麻烦，且不直观。

本文不是批判JPA和Mybatis-plus的不足，也不会来对比他们的写法优劣。主要是介绍从编码生产力方面解决我日常写代码的一些问题和带来哪些便利。

2\. 使用痛点
--------

### 2.1. JpaRepository（优点）

JPA的Mapper操作类是通过继承`JpaRepository`来进行CRUD操作，同时有一个非常便捷的操作，我们只需要在接口中通过一定的规则定义方法名称，我们就可以执行对应的SQL。

kotlin

 代码解读

复制代码

`interface AppRealtimeRecordRepository: JpaRepository<AppRealtimeRecord, Int> {     fun findByCardNo(cardNo: String?): AppRealtimeRecord?     @Query("select count(1) from AppRealtimeRecord arr where " +             "arr.deviceSn = :#{#orderQueryRequest.deviceSn} AND " +             "arr.createTime BETWEEN COALESCE(:#{#orderQueryRequest.payStartTime}, arr.createTime) AND " +             "COALESCE(:#{#orderQueryRequest.payEndTime}, arr.createTime)"     )     fun summaryQuery(orderQueryRequest: OrderQueryRequest): Long }`

😀`findByCardNo`可以直接生成通过卡号查询实体的语句，非常方便。但是如果我们查询条件比较多，用这种方式就会生成非常长的方法名称，这个时候就需要通过@Query进行参数指定查询。

### 2.2. 条件查询

经常有一个需求，需要判断某一个字段存在时，在进行SQL查询。但是这种情况使用JPA会感觉非常麻烦。无论是用JPQL还是原生的SQL感觉很难比较好的实现。上面提供了一个示例是判断开始时间和结束时间是否为空，在进行比较判断。利用的数据库的判空逻辑来进行实现，感觉非常不直观，也不利于SQL调试。

#### 2.2.1. Mybatis-Flex

我们Mybatis-Flex中就非常优雅的可以实现。像写SQL一样非常直观的实现SQL的编写。

ini

 代码解读

复制代码

`QueryWrapper query = QueryWrapper.create()         .where(EMPLOYEE.LAST_NAME.like(searchWord)) //条件为null时自动忽略         .and(EMPLOYEE.GENDER.eq(1))         .and(EMPLOYEE.AGE.gt(24)); List<Employee> employees = employeeMapper.selectListByQuery(query);`

不需要判断条件，默认条件为空时，自动忽略。

### 2.3. 查询部分字段

这个又是JPA一个比较麻烦的点，JPA是以对象的形式来操作的SQL，所以每次都是查询出来全部的数据。有两种方式可以解决。

1.  查询出数据集，用List<Object\[\]>数组来接收，在转化成对应我们需要的部分数据。
2.  重新构建一个Model数据，里面只放置我们需要的数据字段，通过new Model(ParamA, ParamB)的方式来解决。

无论哪一种方式都会感觉非常别扭，只是一个很简单的需求。实现起来异常的麻烦。

#### 2.3.1. Mybatis-Flex

在Mybatis-Flex中实现非常简单。使用select方法即可，不传参数值就是查询所有字段。可以定义自己想要查询的字段即可。

scss

 代码解读

复制代码

`// 查询所有数据 QueryWrapper queryWrapper = QueryWrapper.create()         .select()         .where(ACCOUNT.AGE.eq(18)); Account account = accountMapper.selectOneByQuery(queryWrapper); // 查询部分字段，也可以使用Lambda表达式 select(QueryColumn("id"), QueryColumn("name"), QueryColumn("category_id"))`

### 2.4. kotlin支持

我同步也有一个Kotlin的项目用的JPA，我也一起改成了flex版本。花了不多时间就改造完成，感觉代码整个都看起来非常优雅。

#### 2.4.1. 分页查询

kotlin

 代码解读

复制代码

`fun detailList(fairyDetailParam: FairyDetailParam): List<FairyDetail> {     val paginateWith = paginate<FairyDetail>(pageNumber = fairyDetailParam.current,         pageSize = fairyDetailParam.size,         init = {             select(QueryColumn("id"), QueryColumn("name"), QueryColumn("category_id"))             whereWith {                 FairyDetail::categoryId eq fairyDetailParam.categoryId             }         }     )     return paginateWith.records }`

定义分页对象和查询条件即可，init参数传入的是QueryScope，可以自由匹配需要查询的参数。flex有一个特别好的点是，写代码和写SQL的感觉保持一致性。先写select，再写where，orderBy这些。

php

 代码解读

复制代码

`// 无需注册Mapper与APT/KSP即可查询操作 val accountList: List<Account> = query {     select(Account::id, Account::userName)     whereWith {         Account::age.isNotNull and (Account::age ge 17)     }     orderBy(-Account::id) }`

#### 2.4.2. 更新用户

sql

 代码解读

复制代码

`// 更新用户头像和昵称 update<User> {     User::avatarUrl set user.avatarUrl     whereWith {         User::openId eq user.openId     } }`

更新用户头像地址，通过OpenId。写起来非常丝滑。

### 2.5. 代码自动生成

Gradle中需要添加`annotationProcessor 'com.mybatis-flex:mybatis-flex-processor:1.9.3'`注解来进行代码生成。Maven的用户可以自行在官网查询如何配置。

目前我做的是半自动的数据生成。先手动创建实体类，在通过实体类生成对应的操作对象。

#### 2.5.1. 创建实体

kotlin

 代码解读

复制代码

`package cn.db101.jcc.entity; import java.io.Serializable; import java.util.Date; import com.mybatisflex.annotation.Id; import com.mybatisflex.annotation.KeyType; import com.mybatisflex.annotation.Table; import lombok.Data; /**  *   * @TableName t_banner  */ @Table("t_banner") @Data public class Banner {     /**      *       */     @Id(keyType = KeyType.Auto)     private Integer id;     /**      *       */     private String url;     /**      * 排序，越小越靠前      */     private Integer sort;     /**      *       */     private Date createTime; }`

#### 2.5.2. 编译项目

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/0882cf8896604a068a52457e32f82070~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgem9vb29vb29veQ==:q75.awebp?rk3s=f64ab15b&x-expires=1727853748&x-signature=n4E%2BKnac2bAtWQGXaMZCs9pzMI0%3D)

会在target或者build目录中生成对应的实体互操作类。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/b9139c0c66804d4089a1beabd9c6e4df~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgem9vb29vb29veQ==:q75.awebp?rk3s=f64ab15b&x-expires=1727853748&x-signature=8zmxlTus%2F7Urnuq37QBazgMOG8Y%3D)

默认生成的实体类和字段都是大写来进行体现。

less

 代码解读

复制代码

`/**  * 通过用户查询收藏列表  * @param userId  * @return  */ public List<Lineup> lineUpList(int userId) {     // 查询收藏的Id     List<Favorites> favoritesList = favoritesMapper.selectListByQuery(QueryWrapper.create()             .select(Favorites::getLineupId)             .from(Favorites.class)             .where(FAVORITES.USER_ID.eq(userId)));     return lineupService.listFromId(favoritesList.stream().map(Favorites::getLineupId).collect(Collectors.toList())); } /**  * 删除收藏  * @param favorites  */ public void deleteFavorites(Favorites favorites) {     favoritesMapper.deleteByQuery(QueryWrapper.create()             .where(FAVORITES.USER_ID.eq(favorites.getUserId()))             .and(FAVORITES.LINEUP_ID.eq(favorites.getLineupId()))); } public Favorites selectOne(Favorites favorites) {     return favoritesMapper.selectOneByQuery(QueryWrapper.create()             .where(FAVORITES.USER_ID.eq(favorites.getUserId()))             .and(FAVORITES.LINEUP_ID.eq(favorites.getLineupId()))); }`

#### 2.5.3. 全自动生成

通过连接数据库查询对应的表生成对应的实体，实体互操作 类，Mapper，Controller等。

scss

 代码解读

复制代码

`public class Codegen {     public static void main(String[] args) {         //配置数据源         HikariDataSource dataSource = new HikariDataSource();         dataSource.setJdbcUrl("jdbc:mysql://127.0.0.1:3306/your-database?characterEncoding=utf-8");         dataSource.setUsername("root");         dataSource.setPassword("******");         //创建配置内容，两种风格都可以。         GlobalConfig globalConfig = createGlobalConfigUseStyle1();         //GlobalConfig globalConfig = createGlobalConfigUseStyle2();         //通过 datasource 和 globalConfig 创建代码生成器         Generator generator = new Generator(dataSource, globalConfig);         //生成代码         generator.generate();     }     public static GlobalConfig createGlobalConfigUseStyle1() {         //创建配置内容         GlobalConfig globalConfig = new GlobalConfig();         //设置根包         globalConfig.setBasePackage("com.test");         //设置表前缀和只生成哪些表         globalConfig.setTablePrefix("tb_");         globalConfig.setGenerateTable("tb_account", "tb_account_session");         //设置生成 entity 并启用 Lombok         globalConfig.setEntityGenerateEnable(true);         globalConfig.setEntityWithLombok(true);         //设置项目的JDK版本，项目的JDK为14及以上时建议设置该项，小于14则可以不设置         globalConfig.setJdkVersion(17);         //设置生成 mapper         globalConfig.setMapperGenerateEnable(true);         //可以单独配置某个列         ColumnConfig columnConfig = new ColumnConfig();         columnConfig.setColumnName("tenant_id");         columnConfig.setLarge(true);         columnConfig.setVersion(true);         globalConfig.setColumnConfig("tb_account", columnConfig);         return globalConfig;     }     public static GlobalConfig createGlobalConfigUseStyle2() {         //创建配置内容         GlobalConfig globalConfig = new GlobalConfig();         //设置根包         globalConfig.getPackageConfig()                 .setBasePackage("com.test");         //设置表前缀和只生成哪些表，setGenerateTable 未配置时，生成所有表         globalConfig.getStrategyConfig()                 .setTablePrefix("tb_")                 .setGenerateTable("tb_account", "tb_account_session");         //设置生成 entity 并启用 Lombok         globalConfig.enableEntity()                 .setWithLombok(true)                 .setJdkVersion(17);         //设置生成 mapper         globalConfig.enableMapper();         //可以单独配置某个列         ColumnConfig columnConfig = new ColumnConfig();         columnConfig.setColumnName("tenant_id");         columnConfig.setLarge(true);         columnConfig.setVersion(true);         globalConfig.getStrategyConfig()                 .setColumnConfig("tb_account", columnConfig);         return globalConfig;     } }`

官网的例子，有需要的同学可以自行进行修改配置项，进行生成即可。

### 2.6. 整体使用

如果有使用过mybatis-plus经验的话，使用这个还是比较方便。官网也有对比图，在多表和易用性上还是非常不错的，虽然是造了重复的轮子，但减少的开发工作量还是很多的。

3\. 引用
------

[Mybatis-Flex](https://link.juejin.cn?target=https%3A%2F%2Fmybatis-flex.com%2Fzh%2Fintro%2Fwhat-is-mybatisflex.html "https://mybatis-flex.com/zh/intro/what-is-mybatisflex.html")

[mybatis-flex-kotlin](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fmybatis-flex%2Fmybatis-flex-kotlin "https://gitee.com/mybatis-flex/mybatis-flex-kotlin")