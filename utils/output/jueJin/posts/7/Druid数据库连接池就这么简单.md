---
author: "Java3y"
title: "Druid数据库连接池就这么简单"
date: 2018-03-26
description: "我的知识储备数据库连接池有两种-C3P0，DBCP，可是现在看起来并不够用阿~当时学习C3P0的时候，觉得这个数据库连接池是挺强大的。看过的一些书上也是多数介绍了这两种数据库连接池，自己做的Demo也是使用C3P0。可是现在看起来这两种都不够了~业界发展得真快呀 Druid数…"
tags: ["后端","微信","数据库","Spring Boot中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:49,comments:5,collects:46,views:15079,"
---
前言
==

本章节主要讲解Druid数据库连接池，为什么要学Druid数据库连接池呢？？

我的知识储备数据库连接池有两种->C3P0，DBCP，可是现在看起来并不够用阿~当时学习C3P0的时候，觉得这个数据库连接池是挺强大的。看过的一些书上也是多数介绍了这两种数据库连接池，自己做的Demo也是使用C3P0。可是现在看起来这两种都不够了~业界发展得真快呀

![](/images/jueJin/16260ca6a7b4029.png)

![](/images/jueJin/16260ca6a7d7dd2.png)

上面的我就没有打码了，都是一些热心的开发者评论，正因为他们的评论才促使我会去学更好的东西，也希望大家多多指点~

于是乎，我就花一点时间去学习Druid数据库连接池了...如果有错的地方往指正~~

Druid数据库连接池是阿里的，因此文档是有中文版本的，英语不好学起来也不用那么头疼.

一、Druid介绍
=========

Druid一般的用处有两个：

*   替代C3P0、DBCP数据库连接池(因为它的性能更好)
*   自带监控页面，实时监控应用的连接池情况

所以本文主要是使用Druid作为数据库连接池并且使用一下实时监控应用，做个入门学习~

二、搭建Druid环境
===========

由于简化配置，我就直接实用SpringBoot和SpringData JPA的方式来搭建一个Druid的Demo了~~~

2.1引入pom
--------

```


<dependencies>
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-test</artifactId>
<scope>test</scope>
</dependency>


<dependency>
<groupId>mysql</groupId>
<artifactId>mysql-connector-java</artifactId>
</dependency>

<dependency>
<groupId>com.alibaba</groupId>
<artifactId>druid</artifactId>
<version>1.1.5</version>
</dependency>


<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
<groupId>ch.qos.logback</groupId>
<artifactId>logback-classic</artifactId>
<version>1.2.3</version>
<scope>test</scope>
</dependency>
</dependencies>

```

2.2Druid默认的配置
-------------

**配置数据源的信息(Druid),和JPA相关配置～**

```

# 数据库访问配置
# 主数据源，默认的
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/druid
spring.datasource.username=root
spring.datasource.password=root

# 下面为连接池的补充设置，应用到上面所有数据源中
# 初始化大小，最小，最大
spring.datasource.initialSize=5
spring.datasource.minIdle=5
spring.datasource.maxActive=20
# 配置获取连接等待超时的时间
spring.datasource.maxWait=60000
# 配置间隔多久才进行一次检测，检测需要关闭的空闲连接，单位是毫秒
spring.datasource.timeBetweenEvictionRunsMillis=60000
# 配置一个连接在池中最小生存的时间，单位是毫秒
spring.datasource.minEvictableIdleTimeMillis=300000
spring.datasource.validationQuery=SELECT 1 FROM DUAL
spring.datasource.testWhileIdle=true
spring.datasource.testOnBorrow=false
spring.datasource.testOnReturn=false
# 打开PSCache，并且指定每个连接上PSCache的大小
spring.datasource.poolPreparedStatements=true
spring.datasource.maxPoolPreparedStatementPerConnectionSize=20
# 配置监控统计拦截的filters，去掉后监控界面sql无法统计，'wall'用于防火墙
spring.datasource.filters=stat,wall,log4j
# 通过connectProperties属性来打开mergeSql功能；慢SQL记录
spring.datasource.connectionProperties=druid.stat.mergeSql=true;druid.stat.slowSqlMillis=5000
# 合并多个DruidDataSource的监控数据
#spring.datasource.useGlobalDataSourceStat=true


#JPA配置
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jackson.serialization.indent_output=true

```

更多的配置要去看官方文档了～不过这里一般就够用了。

2.3配置监控页面
---------

> Druid的监控统计功能是通过filter-chain扩展实现，如果你要打开监控统计功能，配置StatFilter

配置druid数据源状态监控，配置一个拦截器和一个Servlet即可～

```

package com.example.demo;

/**
* Created by ozc on 2018/3/26.
*
* @author ozc
* @version 1.0
*/

import com.alibaba.druid.support.http.StatViewServlet;
import com.alibaba.druid.support.http.WebStatFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
* druid 配置.
* <p>
* 这样的方式不需要添加注解：@ServletComponentScan
*
* @author Administrator
*/
@Configuration
    public class DruidConfiguration {
    
    /**
    * 注册一个StatViewServlet
    *
    * @return
    */
    @Bean
        public ServletRegistrationBean DruidStatViewServle2() {
        //org.springframework.boot.context.embedded.ServletRegistrationBean提供类的进行注册.
        ServletRegistrationBean servletRegistrationBean = new ServletRegistrationBean(new StatViewServlet(), "/druid/*");
        
        //添加初始化参数：initParams
        
        //白名单：
        servletRegistrationBean.addInitParameter("allow", "127.0.0.1");
        //IP黑名单 (存在共同时，deny优先于allow) : 如果满足deny的话提示:Sorry, you are not permitted to view this page.
        servletRegistrationBean.addInitParameter("deny", "192.168.1.73");
        //登录查看信息的账号密码.
        servletRegistrationBean.addInitParameter("loginUsername", "admin2");
        servletRegistrationBean.addInitParameter("loginPassword", "123456");
        //是否能够重置数据.
        servletRegistrationBean.addInitParameter("resetEnable", "false");
        return servletRegistrationBean;
    }
    
    /**
    * 注册一个：filterRegistrationBean
    *
    * @return
    */
    @Bean
        public FilterRegistrationBean druidStatFilter2() {
        
        FilterRegistrationBean filterRegistrationBean = new FilterRegistrationBean(new WebStatFilter());
        
        //添加过滤规则.
        filterRegistrationBean.addUrlPatterns("/*");
        
        //添加不需要忽略的格式信息.
        filterRegistrationBean.addInitParameter("exclusions", "*.js,*.gif,*.jpg,*.png,*.css,*.ico,/druid/*");
        return filterRegistrationBean;
    }
    
}

```

![](/images/jueJin/16260e3fbce68c0.png)

2.4JPA测试
--------

POJO:

```

@Entity
    public class User implements Serializable {
    
    /**
    * serialVersionUID.
    */
    private static final long serialVersionUID = 1L;
    
    /**
    * 主键.
    */
    @Id
    @GeneratedValue
    private String id;
    
    /**
    * 用户名.
    */
    private String userName = "";
    
    /**
    * 手机号码.
    */
    private String mobileNo = "";
    
    /**
    * 邮箱.
    */
    private String email = "";
    
    /**
    * 密码.
    */
    private String password = "";
    
    /**
    * 用户类型.
    */
    private Integer userType = 0;
    
    /**
    * 注册时间.
    */
    private Date registerTime = new Date();
    
    /**
    * 所在区域.
    */
    private String region = "";
    
    /**
    * 是否有效 0 有效 1 无效.
    */
    private Integer validity = 0;
    
    /**
    * 头像.
    */
    private String headPortrait = "";
}

```

Controller:

```

@RestController
    public class UserController {
    
    @Autowired
    private UserRepos userRepos;
    
    @RequestMapping(value="saveUser")
        public User saveUser(){
        return userRepos.save(new User());
    }
    
    @RequestMapping(value="/findByUserName")
        public List<User> findByUserName(String userName){
        return userRepos.findByUserName(userName);
    }
    
    @RequestMapping(value="findByUserNameLike")
        public List<User> findByUserNameLkie(String userName){
        return userRepos.findByUserNameLike(userName);
    }
    
    @RequestMapping(value="findByPage")
        public Page<User> findByPage(Integer userType){
        return userRepos.findByUserType(userType, new PageRequest(1, 5));
    }
    
    
    
}
```

Repository:

```

    public interface UserRepos extends JpaRepository<User, String> {
    
    /**
    * 通过用户名相等查询
    *
    * @param userName 用户名
    * @return
    */
    List<User> findByUserName(String userName);
    
    /**
    * 通过名字like查询
    *
    * @param userName 用户名
    * @return
    */
    List<User> findByUserNameLike(String userName);
    
    /**
    * 通过用户名和手机号码查询
    *
    * @param userName 用户名
    * @param mobileNo 手机号码
    * @return
    */
    User findByUserNameAndMobileNo(String userName, String mobileNo);
    
    /**
    * 根据用户类型，分页查询
    *
    * @param userType 用户类型
    * @param pageable
    * @return
    */
    Page<User> findByUserType(Integer userType, Pageable pageable);
    
    /**
    * 根据用户名，排序查询
    *
    * @param userName 用户名
    * @param sort
    * @return
    */
    List<User> findByUserName(String userName, Sort sort);
    
}


```

在页面上访问：`http://localhost:8080/findByUserName?userName=Java3y`

结果：

![](/images/jueJin/16260ca7202a5a9.png)

![](/images/jueJin/16260ca724d9a86.png)

三、最后
====

本文只是简单的对Druid进行入门，Druid是一个非常好的开源数据库连接池框架，更多的资料可看GitHub的文档。

参考资料：

*   [文档首页](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Falibaba%2Fdruid "https://github.com/alibaba/druid")
*   [GitHub文档问题](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Falibaba%2Fdruid%2Fwiki%2F%25E5%25B8%25B8%25E8%25A7%2581%25E9%2597%25AE%25E9%25A2%2598 "https://github.com/alibaba/druid/wiki/%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98")
*   [阿里druid学习，号称最好的数据库连接池](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fzcl1199%2Farticle%2Fdetails%2F53097719 "https://blog.csdn.net/zcl1199/article/details/53097719")
*   [常用数据库连接池 (DBCP、c3p0、Druid) 配置说明](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2FJavaSubin%2Fp%2F5294721.html "https://www.cnblogs.com/JavaSubin/p/5294721.html")
*   [SpringBoot学习：整合MyBatis，使用Druid连接池](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Faqsunkai%2Farticle%2Fdetails%2F69660817%3Ffps%3D1%26locationNum%3D2 "https://blog.csdn.net/aqsunkai/article/details/69660817?fps=1&locationNum=2")
*   [SpringBoot:spring boot使用Druid和监控配置](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fsnakemoving%2Farticle%2Fdetails%2F76285717 "https://blog.csdn.net/snakemoving/article/details/76285717")
*   [Spring Boot Druid数据源配置](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fliuchuanfeng%2Fp%2F7002046.html "https://www.cnblogs.com/liuchuanfeng/p/7002046.html")

**更新：经评论提醒：Druid在SpringBoot中使用properties配置的数据连接池属性无效**。

参考：https://blog.csdn.net/lijunfan\_rh/article/details/53665492

只用加入一个Durid配置类，pom添加日志的坐标即可：

```

<dependency>
<groupId>org.slf4j</groupId>
<artifactId>slf4j-nop</artifactId>
<version>1.7.5</version>
</dependency>

<dependency>
<groupId>log4j</groupId>
<artifactId>log4j</artifactId>
<version>1.2.17</version>
</dependency>
```

> 如果文章有错的地方欢迎指正，大家互相交流。习惯在微信看技术文章，想要获取更多的Java资源的同学，可以**关注微信公众号:Java3y**