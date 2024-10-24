---
author: "Java3y"
title: "Shiro【授权、整合Spirng、Shiro过滤器】"
date: 2018-03-21
description: "一般地，我们的权限都是从数据库中查询的，并不是根据我们的配置文件来进行配对的。因此我们需要自定义reaml，让reaml去对比的是数据库查询出来的权限 shiro也通过filter进行拦截。filter拦截后将操作权交给spring中配置的filterChain（过虑链儿） 在…"
tags: ["Shiro","Spring","安全","Realm中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读12分钟"
weight: 1
selfDefined:"likes:40,comments:0,collects:45,views:5031,"
---
前言
==

本文主要讲解的知识点有以下：

*   Shiro授权的方式简单介绍
*   与Spring整合
*   初始Shiro过滤器

一、Shiro授权
=========

上一篇我们已经讲解了Shiro的认证相关的知识了，现在我们来弄Shiro的授权

Shiro授权的流程和认证的流程其实是差不多的：

![这里写图片描述](/images/jueJin/1624850a414767f.png)

1.1Shiro支持的授权方式
---------------

Shiro支持的授权方式有三种：

```

Shiro 支持三种方式的授权：
编程式：通过写if/else 授权代码块完成：
Subject subject = SecurityUtils.getSubject();
    if(subject.hasRole(“admin”)) {
    //有权限
        } else {
        //无权限
    }
    注解式：通过在执行的Java方法上放置相应的注解完成：
    @RequiresRoles("admin")
        public void hello() {
        //有权限
    }
    JSP/GSP 标签：在JSP/GSP 页面通过相应的标签完成：
    <shiro:hasRole name="admin">
    <!— 有权限—>
    </shiro:hasRole>
```

1.2使用编程式授权
----------

同样的，我们是通过安全管理器来去授权的，因此我们还是需要配置对应的配置文件的：

shiro-permission.ini配置文件：

```

#用户
[users]
#用户zhang的密码是123，此用户具有role1和role2两个角色
zhang=123,role1,role2
wang=123,role2

#权限
[roles]
#角色role1对资源user拥有create、update权限
role1=user:create,user:update
#角色role2对资源user拥有create、delete权限
role2=user:create,user:delete
#角色role3对资源user拥有create权限
role3=user:create



#权限标识符号规则：资源:操作:实例(中间使用半角:分隔)
user：create:01  表示对用户资源的01实例进行create操作。
user:create：表示对用户资源进行create操作，相当于user:create:*，对所有用户资源实例进行create操作。
user：*：01  表示对用户资源实例01进行所有操作。


```

代码测试：

```


// 角色授权、资源授权测试
@Test
    public void testAuthorization() {
    
    // 创建SecurityManager工厂
    Factory<SecurityManager> factory = new IniSecurityManagerFactory(
    "classpath:shiro-permission.ini");
    
    // 创建SecurityManager
    SecurityManager securityManager = factory.getInstance();
    
    // 将SecurityManager设置到系统运行环境，和spring后将SecurityManager配置spring容器中，一般单例管理
    SecurityUtils.setSecurityManager(securityManager);
    
    // 创建subject
    Subject subject = SecurityUtils.getSubject();
    
    // 创建token令牌
    UsernamePasswordToken token = new UsernamePasswordToken("zhangsan",
    "123");
    
    // 执行认证
        try {
        subject.login(token);
            } catch (AuthenticationException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        
        System.out.println("认证状态：" + subject.isAuthenticated());
        // 认证通过后执行授权
        
        // 基于角色的授权
        // hasRole传入角色标识
        boolean ishasRole = subject.hasRole("role1");
        System.out.println("单个角色判断" + ishasRole);
        // hasAllRoles是否拥有多个角色
        boolean hasAllRoles = subject.hasAllRoles(Arrays.asList("role1",
        "role2", "role3"));
        System.out.println("多个角色判断" + hasAllRoles);
        
        // 使用check方法进行授权，如果授权不通过会抛出异常
        // subject.checkRole("role13");
        
        // 基于资源的授权
        // isPermitted传入权限标识符
        boolean isPermitted = subject.isPermitted("user:create:1");
        System.out.println("单个权限判断" + isPermitted);
        
        boolean isPermittedAll = subject.isPermittedAll("user:create:1",
        "user:delete");
        System.out.println("多个权限判断" + isPermittedAll);
        // 使用check方法进行授权，如果授权不通过会抛出异常
        subject.checkPermission("items:create:1");
        
    }
    
```

1.3自定义realm进行授权
---------------

一般地，我们的权限都是从数据库中查询的，并不是根据我们的配置文件来进行配对的。因此我们需要自定义reaml，让reaml去对比的是数据库查询出来的权限

shiro-realm.ini配置文件：将自定义的reaml信息注入到安全管理器中

```

[main]
#自定义 realm
customRealm=cn.itcast.shiro.realm.CustomRealm
#将realm设置到securityManager，相当 于spring中注入
securityManager.realms=$customRealm




```

我们上次已经使用过了一个自定义reaml，当时候仅仅重写了doGetAuthenticationInfo()方法，**这次我们重写doGetAuthorizationInfo()方法**

```
// 用于授权
@Override
protected AuthorizationInfo doGetAuthorizationInfo(
    PrincipalCollection principals) {
    
    //从 principals获取主身份信息
    //将getPrimaryPrincipal方法返回值转为真实身份类型（在上边的doGetAuthenticationInfo认证通过填充到SimpleAuthenticationInfo中身份类型），
    String userCode =  (String) principals.getPrimaryPrincipal();
    
    //根据身份信息获取权限信息
    //连接数据库...
    //模拟从数据库获取到数据
    List<String> permissions = new ArrayList<String>();
    permissions.add("user:create");//用户的创建
    permissions.add("items:add");//商品添加权限
    //....
    
    //查到权限数据，返回授权信息(要包括 上边的permissions)
    SimpleAuthorizationInfo simpleAuthorizationInfo = new SimpleAuthorizationInfo();
    //将上边查询到授权信息填充到simpleAuthorizationInfo对象中
    simpleAuthorizationInfo.addStringPermissions(permissions);
    
    return simpleAuthorizationInfo;
}

```

测试程序：

```

// 自定义realm进行资源授权测试
@Test
    public void testAuthorizationCustomRealm() {
    
    // 创建SecurityManager工厂
    Factory<SecurityManager> factory = new IniSecurityManagerFactory(
    "classpath:shiro-realm.ini");
    // 创建SecurityManager
    SecurityManager securityManager = factory.getInstance();
    // 将SecurityManager设置到系统运行环境，和spring后将SecurityManager配置spring容器中，一般单例管理
    SecurityUtils.setSecurityManager(securityManager);
    // 创建subject
    Subject subject = SecurityUtils.getSubject();
    
    // 创建token令牌
    UsernamePasswordToken token = new UsernamePasswordToken("zhangsan",
    "111111");
    // 执行认证
        try {
        subject.login(token);
            } catch (AuthenticationException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        
        System.out.println("认证状态：" + subject.isAuthenticated());
        // 认证通过后执行授权
        
        // 基于资源的授权，调用isPermitted方法会调用CustomRealm从数据库查询正确权限数据
        // isPermitted传入权限标识符，判断user:create:1是否在CustomRealm查询到权限数据之内
        boolean isPermitted = subject.isPermitted("user:create:1");
        System.out.println("单个权限判断" + isPermitted);
        
        boolean isPermittedAll = subject.isPermittedAll("user:create:1",
        "user:create");
        System.out.println("多个权限判断" + isPermittedAll);
        
        // 使用check方法进行授权，如果授权不通过会抛出异常
        subject.checkPermission("items:add:1");
        
    }
```

![这里写图片描述](/images/jueJin/1624850a415a5eb.png)

* * *

二、Spring与Shiro整合
================

2.1导入jar包
---------

*   shiro-web的jar、
*   shiro-spring的jar
*   shiro-code的jar

![这里写图片描述](/images/jueJin/1624850a41c9e20.png)

2.2快速入门
-------

shiro也通过filter进行拦截。**filter拦截后将操作权交给spring中配置的filterChain（过虑链儿）**

在web.xml中配置filter

```

<!-- shiro的filter -->
<!-- shiro过虑器，DelegatingFilterProxy通过代理模式将spring容器中的bean和filter关联起来 -->
<filter>
<filter-name>shiroFilter</filter-name>
<filter-class>org.springframework.web.filter.DelegatingFilterProxy</filter-class>
<!-- 设置true由servlet容器控制filter的生命周期 -->
<init-param>
<param-name>targetFilterLifecycle</param-name>
<param-value>true</param-value>
</init-param>
<!-- 设置spring容器filter的bean id，如果不设置则找与filter-name一致的bean-->
<init-param>
<param-name>targetBeanName</param-name>
<param-value>shiroFilter</param-value>
</init-param>
</filter>
<filter-mapping>
<filter-name>shiroFilter</filter-name>
<url-pattern>/*</url-pattern>
</filter-mapping>
```

在**applicationContext-shiro.xml 中配置web.xml中fitler对应spring容器中的bean**。

```

<!-- web.xml中shiro的filter对应的bean -->
<!-- Shiro 的Web过滤器 -->
<bean id="shiroFilter" class="org.apache.shiro.spring.web.ShiroFilterFactoryBean">
<property name="securityManager" ref="securityManager" />
<!-- loginUrl认证提交地址，如果没有认证将会请求此地址进行认证，请求此地址将由formAuthenticationFilter进行表单认证 -->
<property name="loginUrl" value="/login.action" />
<!-- 认证成功统一跳转到first.action，建议不配置，shiro认证成功自动到上一个请求路径 -->
<!-- <property name="successUrl" value="/first.action"/> -->
<!-- 通过unauthorizedUrl指定没有权限操作时跳转页面-->
<property name="unauthorizedUrl" value="/refuse.jsp" />
<!-- 自定义filter配置 -->
<property name="filters">
<map>
<!-- 将自定义 的FormAuthenticationFilter注入shiroFilter中-->
<entry key="authc" value-ref="formAuthenticationFilter" />
</map>
</property>

<!-- 过虑器链定义，从上向下顺序执行，一般将/**放在最下边 -->
<property name="filterChainDefinitions">
<value>
<!--所有url都可以匿名访问-->
/** = anon
</value>
</property>
</bean>
```

配置安全管理器

```

<!-- securityManager安全管理器 -->
<bean id="securityManager" class="org.apache.shiro.web.mgt.DefaultWebSecurityManager">
<property name="realm" ref="customRealm" />
</bean>
```

配置reaml

```

<!-- realm -->
<bean id="customRealm" class="cn.itcast.ssm.shiro.CustomRealm">
</bean>
```

步骤：

*   在web.xml文件中配置shiro的过滤器
*   在对应的Spring配置文件中配置与之对应的filterChain（过虑链儿）
*   配置安全管理器，注入自定义的reaml
*   配置自定义的reaml

* * *

2.3静态资源不拦截
----------

我们在spring配置过滤器链的时候，我们发现这么一行代码：

```
<!--所有url都可以匿名访问 -->
/** = anon
```

**anon其实就是shiro内置的一个过滤器**，上边的代码就代表着所有的匿名用户都可以访问

当然了，后边我们还需要配置其他的信息，**为了让页面能够正常显示，我们的静态资源一般是不需要被拦截的**。

于是我们可以这样配置：

```

<!-- 对静态资源设置匿名访问 -->
/images/** = anon
/js/** = anon
/styles/** = anon
```

三、初识shiro过滤器
============

上面我们了解到了anno过滤器的，shiro还有其他的过滤器的..我们来看看

![这里写图片描述](/images/jueJin/1624850a42087c0.png)

常用的过滤器有下面几种：

anon:例子`/admins/**=anon` 没有参数，表示可以匿名使用。 authc:例如`/admins/user/**`\=authc表示需要认证(登录)才能使用，FormAuthenticationFilter是表单认证，没有参数 perms：例子`/admins/user/**=perms[user:add:*]`,参数可以写多个，多个时必须加上引号，并且参数之间用逗号分割，例如`/admins/user/**=perms["user:add:*,user:modify:*"]`，当有多个参数时必须每个参数都通过才通过，想当于isPermitedAll()方法。 user:例如`/admins/user/**`\=user没有参数，表示必须存在用户, 身份认证通过或通过记住我认证通过的可以访问，当登入操作时不做检查

3.1登陆与退出
--------

使用FormAuthenticationFilter过虑器实现 ，原理如下：

*   当用户没有认证时，**请求loginurl进行认证【上边我们已经配置了】，用户身份和用户密码提交数据到loginurl**
*   FormAuthenticationFilter拦截住取出request中的username和password（**两个参数名称是可以配置的**）
*   FormAuthenticationFilter **调用realm传入一个token**（username和password）
*   **realm认证时根据username查询用户信息**（在Activeuser中存储，包括 userid、usercode、username、menus）。
*   如果查询不到，realm返回null，FormAuthenticationFilter向request域中填充一个参数（记录了异常信息）
*   **查询出用户的信息之后，FormAuthenticationFilter会自动将reaml返回的信息和token中的用户名和密码对比。如果不对，那就返回异常。**

### 3.1.1登陆页面

由于FormAuthenticationFilter的用户身份和密码的**input的默认值（username和password）**，**修改页面的账号和密码的input的名称为username和password**

```

<TR>
<TD>用户名：</TD>
<TD colSpan="2"><input type="text" id="usercode"
name="username" style="WIDTH: 130px" /></TD>
</TR>
<TR>
<TD>密 码：</TD>
<TD><input type="password" id="pwd" name="password" style="WIDTH: 130px" />
</TD>
</TR>
```

### 3.1.2登陆代码实现

上面我们已经说了，当用户没有认证的时候，**请求的loginurl进行认证，用户身份的用户密码提交数据到loginrul中**。

当我们提交到loginurl的时候，**表单过滤器会自动解析username和password去调用realm来进行认证。最终在request域对象中存储shiroLoginFailure认证信息，如果返回的是异常的信息，那么我们在login中抛出异常即可**

```


//登陆提交地址，和applicationContext-shiro.xml中配置的loginurl一致
@RequestMapping("login")
    public String login(HttpServletRequest request)throws Exception{
    
    //如果登陆失败从request中获取认证异常信息，shiroLoginFailure就是shiro异常类的全限定名
    String exceptionClassName = (String) request.getAttribute("shiroLoginFailure");
    //根据shiro返回的异常类路径判断，抛出指定异常信息
        if(exceptionClassName!=null){
            if (UnknownAccountException.class.getName().equals(exceptionClassName)) {
            //最终会抛给异常处理器
            throw new CustomException("账号不存在");
            } else if (IncorrectCredentialsException.class.getName().equals(
                exceptionClassName)) {
                throw new CustomException("用户名/密码错误");
                    } else if("randomCodeError".equals(exceptionClassName)){
                    throw new CustomException("验证码错误 ");
                        }else {
                        throw new Exception();//最终在异常处理器生成未知错误
                    }
                }
                //此方法不处理登陆成功（认证成功），shiro认证成功会自动跳转到上一个请求路径
                //登陆失败还到login页面
                return "login";
            }
```

配置认证过滤器

```

<value>
<!-- 对静态资源设置匿名访问 -->
/images/** = anon
/js/** = anon
/styles/** = anon

<!-- /** = authc 所有url都必须认证通过才可以访问-->
/** = authc
</value>

```

### 3.2退出

不用我们去实现退出，**只要去访问一个退出的url（该 url是可以不存在），由LogoutFilter拦截住，清除session。**

在applicationContext-shiro.xml配置LogoutFilter：

```

<!-- 请求 logout.action地址，shiro去清除session-->
/logout.action = logout
```

* * *

四、认证后信息在页面显示
============

1、认证后用户菜单在首页显示 2、认证后用户的信息在页头显示

realm从数据库查询用户信息，**将用户菜单、usercode、username等设置在SimpleAuthenticationInfo中。**

```

//realm的认证方法，从数据库查询用户信息
@Override
protected AuthenticationInfo doGetAuthenticationInfo(
    AuthenticationToken token) throws AuthenticationException {
    
    // token是用户输入的用户名和密码
    // 第一步从token中取出用户名
    String userCode = (String) token.getPrincipal();
    
    // 第二步：根据用户输入的userCode从数据库查询
    SysUser sysUser = null;
        try {
        sysUser = sysService.findSysUserByUserCode(userCode);
            } catch (Exception e1) {
            // TODO Auto-generated catch block
            e1.printStackTrace();
        }
        
        // 如果查询不到返回null
        if(sysUser==null){//
        return null;
    }
    // 从数据库查询到密码
    String password = sysUser.getPassword();
    
    //盐
    String salt = sysUser.getSalt();
    
    // 如果查询到返回认证信息AuthenticationInfo
    
    //activeUser就是用户身份信息
    ActiveUser activeUser = new ActiveUser();
    
    activeUser.setUserid(sysUser.getId());
    activeUser.setUsercode(sysUser.getUsercode());
    activeUser.setUsername(sysUser.getUsername());
    //..
    
    //根据用户id取出菜单
    List<SysPermission> menus  = null;
        try {
        //通过service取出菜单
        menus = sysService.findMenuListByUserId(sysUser.getId());
            } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        //将用户菜单 设置到activeUser
        activeUser.setMenus(menus);
        
        //将activeUser设置simpleAuthenticationInfo
        SimpleAuthenticationInfo simpleAuthenticationInfo = new SimpleAuthenticationInfo(
        activeUser, password,ByteSource.Util.bytes(salt), this.getName());
        
        return simpleAuthenticationInfo;
    }
```

配置凭配器，因为我们用到了md5和散列

```

<!-- 凭证匹配器 -->
<bean id="credentialsMatcher"
class="org.apache.shiro.authc.credential.HashedCredentialsMatcher">
<property name="hashAlgorithmName" value="md5" />
<property name="hashIterations" value="1" />
</bean>
``````

<!-- realm -->
<bean id="customRealm" class="cn.itcast.ssm.shiro.CustomRealm">
<!-- 将凭证匹配器设置到realm中，realm按照凭证匹配器的要求进行散列 -->
<property name="credentialsMatcher" ref="credentialsMatcher"/>
</bean>
```

在跳转到首页的时候，取出用户的认证信息，转发到JSP即可

```

//系统首页
@RequestMapping("/first")
    public String first(Model model)throws Exception{
    
    //从shiro的session中取activeUser
    Subject subject = SecurityUtils.getSubject();
    //取身份信息
    ActiveUser activeUser = (ActiveUser) subject.getPrincipal();
    //通过model传到页面
    model.addAttribute("activeUser", activeUser);
    
    return "/first";
}
```

五、总结
====

*   Shiro用户权限有三种方式
    *   编程式
    *   注解式
    *   标签式
*   **Shiro的reaml默认都是去找配置文件的信息来进行授权的，我们一般都是要reaml去数据库来查询对应的信息。因此，又需要自定义reaml**
*   总体上，认证和授权的流程差不多。
*   **Spring与Shiro整合，Shiro实际上的操作都是通过过滤器来干的。Shiro为我们提供了很多的过滤器。**
    *   **在web.xml中配置Shiro过滤器**
    *   **在Shiro配置文件中使用web.xml配置过的过滤器。**
*   **配置安全管理器类，配置自定义的reaml，将reaml注入到安全管理器类上。将安全管理器交由Shiro工厂来进行管理。**
*   **在过滤器链中设置静态资源不拦截。**
*   在Shiro使用过滤器来进行用户认证，流程是这样子的:
    *   配置用于认证的请求路径
    *   当访问程序员该请求路径的时候，Shiro会使用FormAuthenticationFilter会调用reaml获得用户的信息
    *   **reaml可以拿到token，通过用户名从数据库获取得到用户的信息，如果用户不存在则返回null**
    *   **FormAuthenticationFilter会将reaml返回的数据进行对比，如果不同则抛出异常**
    *   **我们的请求路径仅仅是用来检测有没有异常抛出，并不用来做校验的。**
*   **shiro还提供了退出用户的拦截器，我们配置一个url就行了。**
*   **当需要获取用户的数据用于回显的时候，我们可以在SecurityUtils.getSubject()来得到主体，再通过主体拿到身份信息。**

> 如果文章有错的地方欢迎指正，大家互相交流。习惯在微信看技术文章，想要获取更多的Java资源的同学，可以**关注微信公众号:Java3y**