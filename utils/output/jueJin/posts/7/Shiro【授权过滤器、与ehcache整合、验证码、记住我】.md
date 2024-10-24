---
author: "Java3y"
title: "Shiro【授权过滤器、与ehcache整合、验证码、记住我】"
date: 2018-03-22
description: "我们的授权过滤器使用的是permissionsAuthorizationFilter来进行拦截。我们可以在application-shiro中配置filter规则 5、PermissionsAuthorizationFilter对itemquery 和从realm中获取权限进…"
tags: ["Shiro","Realm","后端","数据库中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:40,comments:6,collects:20,views:2226,"
---
前言
==

本文主要讲解的知识点有以下：

*   Shiro授权过滤器使用
*   Shiro缓存
    *   与Ehcache整合
*   Shiro应用->实现验证码功能
*   记住我功能

一、授权过滤器测试
=========

我们的授权过滤器使用的是permissionsAuthorizationFilter来进行拦截。我们可以在application-shiro中配置filter规则

```

<!--商品查询需要商品查询权限 -->
/items/queryItems.action = perms[item:query]
/items/editItems.action = perms[item:edit]
```

测试流程： 1、**在applicationContext-shiro.xml中配置filter规则**

*   `<!--商品查询需要商品查询权限 -->`
*   /items/queryItems.action = perms\[item:query\]

2、**用户在认证通过后，请求/items/queryItems.action** 3、被PermissionsAuthorizationFilter拦截，**发现需要“item:query”权限** 4、PermissionsAuthorizationFilter **调用realm中的doGetAuthorizationInfo获取数据库中正确的权限** 5、PermissionsAuthorizationFilter对item:query 和从realm中获取权限进行对比，如果“item:query”在realm返回的权限列表中，授权通过。

**realm中获取认证的信息，查询出该用户对应的权限，封装到simpleAuthorizationInfo中，PermissionsAuthorizationFilter会根据对应的权限来比对。**

```

@Override
protected AuthorizationInfo doGetAuthorizationInfo(
    PrincipalCollection principals) {
    
    //从 principals获取主身份信息
    //将getPrimaryPrincipal方法返回值转为真实身份类型（在上边的doGetAuthenticationInfo认证通过填充到SimpleAuthenticationInfo中身份类型），
    ActiveUser activeUser =  (ActiveUser) principals.getPrimaryPrincipal();
    
    //根据身份信息获取权限信息
    //从数据库获取到权限数据
    List<SysPermission> permissionList = null;
        try {
        permissionList = sysService.findPermissionListByUserId(activeUser.getUserid());
            } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        //单独定一个集合对象
        List<String> permissions = new ArrayList<String>();
            if(permissionList!=null){
                for(SysPermission sysPermission:permissionList){
                //将数据库中的权限标签 符放入集合
                permissions.add(sysPermission.getPercode());
            }
        }
        
        
        /*	List<String> permissions = new ArrayList<String>();
        permissions.add("user:create");//用户的创建
        permissions.add("item:query");//商品查询权限
        permissions.add("item:add");//商品添加权限
        permissions.add("item:edit");//商品修改权限
        */		//....
        
        //查到权限数据，返回授权信息(要包括 上边的permissions)
        SimpleAuthorizationInfo simpleAuthorizationInfo = new SimpleAuthorizationInfo();
        //将上边查询到授权信息填充到simpleAuthorizationInfo对象中
        simpleAuthorizationInfo.addStringPermissions(permissions);
        
        return simpleAuthorizationInfo;
    }
```

在bean中我们已经配置了：如果没有权限，那么跳转到哪个JSP页面了

```

<!-- 通过unauthorizedUrl指定没有权限操作时跳转页面-->
<property name="unauthorizedUrl" value="/refuse.jsp" />
```

到目前为止，现在问题又来了：

1、**在applicationContext-shiro.xml中配置过虑器链接，需要将全部的url和权限对应起来进行配置，比较发麻不方便使用。**

2、**每次授权都需要调用realm查询数据库，对于系统性能有很大影响，可以通过shiro缓存来解决。**

* * *

二、使用注解式和标签式配置授权
===============

上面的那种方法，还是需要我们将全部的url和权限对应起来进行配置，是比较不方便的。我们可以使用授权的另外两种方式

*   注解式
*   标签式

2.1注解式
------

如果要使用注解式，那么就必须在Spring中**开启controller类aop支持**

```

<!-- 开启aop，对类代理 -->
<aop:config proxy-target-class="true"></aop:config>
<!-- 开启shiro注解支持 -->
<bean
class="
org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor">
<property name="securityManager" ref="securityManager" />
</bean>
```

在Controller中使用注解来进行配置就行了，就不用在我们的application-shiro中全部集中配置了

```

//商品信息方法
@RequestMapping("/queryItems")
@RequiresPermissions("item:query")//执行queryItems需要"item:query"权限
    public ModelAndView queryItems(HttpServletRequest request) throws Exception {
    
    System.out.println(request.getParameter("id"));
    
    //调用service查询商品列表
    List<ItemsCustom> itemsList = itemsService.findItemsList(null);
    
    ModelAndView modelAndView = new ModelAndView();
    modelAndView.addObject("itemsList", itemsList);
    // 指定逻辑视图名
    modelAndView.setViewName("itemsList");
    
    return modelAndView;
}
```

* * *

2.2jsp标签 授权
-----------

![这里写图片描述](/images/jueJin/1624b81ecaa2adc.png)

![这里写图片描述](/images/jueJin/1624b81ecac940e.png)

**当调用controller的一个方法，由于该 方法加了@RequiresPermissions("item:query") ，shiro调用realm获取数据库中的权限信息，看"item:query"是否在权限数据中存在，如果不存在就拒绝访问，如果存在就授权通过。**

**当展示一个jsp页面时，页面中如果遇到<shiro:hasPermission name="item:update">，shiro调用realm获取数据库中的权限信息，看item:update是否在权限数据中存在，如果不存在就拒绝访问，如果存在就授权通过。**

* * *

三、Shiro缓存
=========

**针对上边授权频繁查询数据库，需要使用shiro缓存**

3.1缓存流程
-------

shiro中提供了对认证信息和授权信息的缓存。shiro默认是关闭认证信息缓存的，**对于授权信息的缓存shiro默认开启的**。主要研究授权信息缓存，因为**授权的数据量大。**

用户认证通过。

**该用户第一次授权：调用realm查询数据库** **该用户第二次授权：不调用realm查询数据库，直接从缓存中取出授权信息（权限标识符）。**

3.2使用ehcache和Shiro整合
--------------------

导入jar包

![这里写图片描述](/images/jueJin/1624b81ecab9158.png)

**配置缓存管理器，注入到安全管理器中**

```

<!-- 缓存管理器 -->
<bean id="cacheManager" class="org.apache.shiro.cache.ehcache.EhCacheManager">
<property name="cacheManagerConfigFile" value="classpath:shiro-ehcache.xml"/>
</bean>
``````


<!-- securityManager安全管理器 -->
<bean id="securityManager" class="org.apache.shiro.web.mgt.DefaultWebSecurityManager">
<property name="realm" ref="customRealm" />
<!-- 注入缓存管理器 -->
<property name="cacheManager" ref="cacheManager"/>
</bean>
```

ehcache的配置文件**shiro-ehcache.xml**：

```
<ehcache xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:noNamespaceSchemaLocation="../config/ehcache.xsd">
<!--diskStore：缓存数据持久化的目录 地址  -->
<diskStore path="F:\develop\ehcache" />
<defaultCache
maxElementsInMemory="1000"
maxElementsOnDisk="10000000"
eternal="false"
overflowToDisk="false"
diskPersistent="false"
timeToIdleSeconds="120"
timeToLiveSeconds="120"
diskExpiryThreadIntervalSeconds="120"
memoryStoreEvictionPolicy="LRU">
</defaultCache>
</ehcache>

```

3.3缓存清空
-------

**如果用户正常退出，缓存自动清空。** **如果用户非正常退出，缓存自动清空。**

还有一种情况：

*   当管理员修改了用户的权限，但是该用户还没有退出，在默认情况下\*\*，修改的权限无法立即生效\*\*。需要手动进行编程实现：**在权限修改后调用realm的clearCache方法清除缓存。**

清除缓存：

```

//清除缓存
    public void clearCached() {
    PrincipalCollection principals = SecurityUtils.getSubject().getPrincipals();
    super.clearCache(principals);
}
```

3.4sessionManager
-----------------

和shiro整合后，**使用shiro的session管理，shiro提供sessionDao操作 会话数据。**

配置sessionManager

```

<!-- 会话管理器 -->
<bean id="sessionManager" class="org.apache.shiro.web.session.mgt.DefaultWebSessionManager">
<!-- session的失效时长，单位毫秒 -->
<property name="globalSessionTimeout" value="600000"/>
<!-- 删除失效的session -->
<property name="deleteInvalidSessions" value="true"/>
</bean>
```

注入到安全管理器中

```

<!-- securityManager安全管理器 -->
<bean id="securityManager" class="org.apache.shiro.web.mgt.DefaultWebSecurityManager">
<property name="realm" ref="customRealm" />
<!-- 注入缓存管理器 -->
<property name="cacheManager" ref="cacheManager"/>
<!-- 注入session管理器 -->
<property name="sessionManager" ref="sessionManager" />

</bean>
```

* * *

四、验证码
=====

在登陆的时候，我们一般都设置有验证码，但是我们如果使用Shiro的话，那么Shiro默认的是使用FormAuthenticationFilter进行表单认证。

而我们的验证校验的功能应该**加在FormAuthenticationFilter中，在认证之前进行验证码校验**。

FormAuthenticationFilter是Shiro默认的功能，我们想要在FormAuthenticationFilter之前进行验证码校验，就**需要继承FormAuthenticationFilter类，改写它的认证方法**！

4.1自定义Form认证类
-------------

```

    public class CustomFormAuthenticationFilter extends FormAuthenticationFilter {
    
    //原FormAuthenticationFilter的认证方法
    @Override
    protected boolean onAccessDenied(ServletRequest request,
        ServletResponse response) throws Exception {
        //在这里进行验证码的校验
        
        //从session获取正确验证码
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        HttpSession session =httpServletRequest.getSession();
        //取出session的验证码（正确的验证码）
        String validateCode = (String) session.getAttribute("validateCode");
        
        //取出页面的验证码
        //输入的验证和session中的验证进行对比
        String randomcode = httpServletRequest.getParameter("randomcode");
            if(randomcode!=null && validateCode!=null && !randomcode.equals(validateCode)){
            //如果校验失败，将验证码错误失败信息，通过shiroLoginFailure设置到request中
            httpServletRequest.setAttribute("shiroLoginFailure", "randomCodeError");
            //拒绝访问，不再校验账号和密码
            return true;
        }
        return super.onAccessDenied(request, response);
    }
    
    
}
```

4.2配置自定义类
---------

我们编写完自定义类以后，是需要在Shiro配置文件中配置我们这个自定义类的。

由于这是我们自定义的，因此**我们并不需要用户名就使用username，密码就使用password，这个也是我们可以自定义的**。

```

<!-- 自定义form认证过虑器 -->
<!-- 基于Form表单的身份验证过滤器，不配置将也会注册此过虑器，表单中的用户账号、密码及loginurl将采用默认值，建议配置 -->
<bean id="formAuthenticationFilter"
class="cn.itcast.ssm.shiro.CustomFormAuthenticationFilter ">
<!-- 表单中账号的input名称 -->
<property name="usernameParam" value="username" />
<!-- 表单中密码的input名称 -->
<property name="passwordParam" value="password" />
</bean>
```

在Shiro的bean中注入自定义的过滤器

```


<!-- 自定义filter配置 -->
<property name="filters">
<map>
<!-- 将自定义 的FormAuthenticationFilter注入shiroFilter中-->
<entry key="authc" value-ref="formAuthenticationFilter" />
</map>
</property>


```

在我们的Controller添加验证码错误的异常判断，从我们的Controller就可以发现，为什么我们要把错误信息存放在request域对象shiroLoginFailure，因为我们得在Controller中获取获取信息，从而给用户对应的提示

```


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

![这里写图片描述](/images/jueJin/1624b81ecac279f.png)

```

<TR>
<TD>验证码：</TD>
<TD><input id="randomcode" name="randomcode" size="8" /> <img
id="randomcode_img" src="${baseurl}validatecode.jsp" alt=""
width="56" height="20" align='absMiddle' /> <a
href=javascript:randomcode_refresh()>刷新</a></TD>
</TR>

```

五、记住我
=====

**Shiro还提供了记住用户名和密码的功能**！

**用户登陆选择“自动登陆”本次登陆成功会向cookie写身份信息，下次登陆从cookie中取出身份信息实现自动登陆。**

想要实现这个功能，我们的认证信息需要**实现Serializable接口**。

```


    public class ActiveUser implements java.io.Serializable {
    private String userid;//用户id（主键）
    private String usercode;// 用户账号
    private String username;// 用户名称
    
    private List<SysPermission> menus;// 菜单
    private List<SysPermission> permissions;// 权限
    
    
}
```

5.1配置rememeber管理器
-----------------

```

<!-- rememberMeManager管理器，写cookie，取出cookie生成用户信息 -->
<bean id="rememberMeManager" class="org.apache.shiro.web.mgt.CookieRememberMeManager">
<property name="cookie" ref="rememberMeCookie" />
</bean>
<!-- 记住我cookie -->
<bean id="rememberMeCookie" class="org.apache.shiro.web.servlet.SimpleCookie">
<!-- rememberMe是cookie的名字 -->
<constructor-arg value="rememberMe" />
<!-- 记住我cookie生效时间30天 -->
<property name="maxAge" value="2592000" />
</bean>


```

注入到安全管理器类上

```

<!-- securityManager安全管理器 -->
<bean id="securityManager"～～～····
<property name="cacheManager" ref="cacheManager"/>
<!-- 注入session管理器 -->
<property name="sessionManager" ref="sessionManager" />
<!-- 记住我 -->
<property name="rememberMeManager" ref="rememberMeManager"/>
</bean>



```

配置页面的input名称：

```

<tr>
<TD></TD>
<td><input type="checkbox" name="rememberMe" />自动登陆</td>
</tr>
```

如果设置了“记住我”，那么访问某些URL的时候，我们就不需要登陆了。**将记住我即可访问的地址配置让UserFilter拦截。**

```
<!-- 配置记住我或认证通过可以访问的地址 -->
/index.jsp  = user
/first.action = user
/welcome.jsp = user

```

六、总结
====

*   Shiro的授权过程和认证过程是类似的，在配置文件上配置需要授权的路径，当访问路径的时候，Shiro过滤器去找到reaml，reaml返回数据以后进行比对。
*   **Shiro支持注解式授权，直接在Controller方法上使用注解声明访问该方法需要授权**
*   Shiro还支持标签授权，但一般很少用
*   **由于每次都要对reaml查询数据库，性能会低。Shiro默认是支持授权缓存的。为了达到很好的效果，我们使用Ehcache来对Shiro的缓存进行管理**
*   配置会话管理器，对会话时间进行控制
*   **手动清空缓存**
*   由于验证用户名和密码之前，一般需要验证验证码的。所以，我们要改写表单验证的功能，先让它去看看验证码是否有错，如果验证码有错的话，那么用户名和密码就不用验证了。
*   将自定义的表单验证类配置起来。
*   使用Shiro提供的记住我功能，如果用户已经认证了，那就不用再次登陆了。可以直接访问某些页面。

> 如果文章有错的地方欢迎指正，大家互相交流。习惯在微信看技术文章，想要获取更多的Java资源的同学，可以**关注微信公众号:Java3y**