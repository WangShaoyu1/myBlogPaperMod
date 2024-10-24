---
author: "MacroZheng"
title: "再见Spring Security！推荐一款功能强大的Java权限认证框架，用起来够优雅！"
date: 2021-08-25
description: "在我们做SpringBoot项目的时候，认证授权是必不可少的功能！最近发现一款功能强大的权限认证框架Sa-Token，它使用简单、API设计优雅，推荐给大家！"
tags: ["Java","Spring Boot中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:144,comments:12,collects:287,views:14652,"
---
> 在我们做SpringBoot项目的时候，认证授权是必不可少的功能！我们经常会选择Shiro、Spring Security这类权限认证框架来实现，但这些框架使用起来有点繁琐，而且功能也不够强大。最近发现一款功能强大的权限认证框架Sa-Token，它使用简单、API设计优雅，推荐给大家！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

Sa-Token简介
----------

Sa-Token是一款轻量级的Java权限认证框架，可以用来解决登录认证、权限认证、Session会话、单点登录、OAuth2.0、微服务网关鉴权等一系列权限相关问题。

框架集成简单、开箱即用、API设计优雅，通过Sa-Token，你将以一种极其简单的方式实现系统的权限认证部分，有时候往往只需一行代码就能实现功能。

Sa-Token功能很全，具体可以参考下图。

![](/images/jueJin/b00845a31bc84a9.png)

使用
--

> 在SpringBoot中使用Sa-Token是非常简单的，接下来我们使用它来实现最常用的认证授权功能，包括登录认证、角色认证和权限认证。

### 集成及配置

> Sa-Token的集成和配置都非常简单，不愧为开箱即用。

*   首先我们需要在项目的`pom.xml`中添加Sa-Token的相关依赖；

```xml
<!-- Sa-Token 权限认证 -->
<dependency>
<groupId>cn.dev33</groupId>
<artifactId>sa-token-spring-boot-starter</artifactId>
<version>1.24.0</version>
</dependency>
```

*   然后在`application.yml`中添加Sa-Token的相关配置，考虑到要支持前后端分离项目，我们关闭从cookie中读取token，改为从head中读取token。

```yaml
# Sa-Token配置
sa-token:
# token名称 (同时也是cookie名称)
token-name: Authorization
# token有效期，单位秒，-1代表永不过期
timeout: 2592000
# token临时有效期 (指定时间内无操作就视为token过期)，单位秒
activity-timeout: -1
# 是否允许同一账号并发登录 (为false时新登录挤掉旧登录)
is-concurrent: true
# 在多人登录同一账号时，是否共用一个token (为false时每次登录新建一个token)
is-share: false
# token风格
token-style: uuid
# 是否输出操作日志
is-log: false
# 是否从cookie中读取token
is-read-cookie: false
# 是否从head中读取token
is-read-head: true
```

### 登录认证

> 在管理系统中，除了登录接口，基本都需要登录认证，在Sa-Token中使用路由拦截鉴权是最方便的，下面我们来实现下。

*   实现登录认证非常简单，首先在`UmsAdminController`中添加一个登录接口；

```java
/**
* 后台用户管理
* Created by macro on 2018/4/26.
*/
@Controller
@Api(tags = "UmsAdminController", description = "后台用户管理")
@RequestMapping("/admin")
    public class UmsAdminController {
    @Autowired
    private UmsAdminService adminService;
    
    @ApiOperation(value = "登录以后返回token")
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
        public CommonResult login(@RequestParam String username, @RequestParam String password) {
        SaTokenInfo saTokenInfo = adminService.login(username, password);
            if (saTokenInfo == null) {
            return CommonResult.validateFailed("用户名或密码错误");
        }
        Map<String, String> tokenMap = new HashMap<>();
        tokenMap.put("token", saTokenInfo.getTokenValue());
        tokenMap.put("tokenHead", saTokenInfo.getTokenName());
        return CommonResult.success(tokenMap);
    }
}
```

*   然后在`UmsAdminServiceImpl`添加登录的具体逻辑，先验证密码，然后调用`StpUtil.login(adminUser.getId())`即可实现登录，调用API一行搞定；

```java
/**
* Created by macro on 2020/10/15.
*/
@Slf4j
@Service
    public class UmsAdminServiceImpl implements UmsAdminService {
    
    @Override
        public SaTokenInfo login(String username, String password) {
        SaTokenInfo saTokenInfo = null;
        AdminUser adminUser = getAdminByUsername(username);
            if (adminUser == null) {
            return null;
        }
            if (!SaSecureUtil.md5(password).equals(adminUser.getPassword())) {
            return null;
        }
        // 密码校验成功后登录，一行代码实现登录
        StpUtil.login(adminUser.getId());
        // 获取当前登录用户Token信息
        saTokenInfo = StpUtil.getTokenInfo();
        return saTokenInfo;
    }
}
```

*   我们再添加一个测试接口用于查询当前登录状态，返回`true`表示已经登录；

```java
/**
* Created by macro on 2020/10/15.
*/
@Slf4j
@Service
    public class UmsAdminServiceImpl implements UmsAdminService {
    @ApiOperation(value = "查询当前登录状态")
    @RequestMapping(value = "/isLogin", method = RequestMethod.GET)
    @ResponseBody
        public CommonResult isLogin() {
        return CommonResult.success(StpUtil.isLogin());
    }
}
```

*   之后可以通过Swagger访问登录接口来获取Token了，使用账号为`admin:123456`，访问地址：[http://localhost:8088/swagger-ui/](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8088%2Fswagger-ui%2F "http://localhost:8088/swagger-ui/")

![](/images/jueJin/d2df553d97174b5.png)

*   然后在`Authorization`请求头中添加获取到的token；

![](/images/jueJin/75c939406e2040d.png)

*   访问`/admin/isLogin`接口，`data`属性就会返回`true`了，表示你已经是登录状态了；

![](/images/jueJin/d477debdf865443.png)

*   接下来我们需要把除登录接口以外的接口都添加登录认证，添加Sa-Token的Java配置类`SaTokenConfig`，注册一个路由拦截器`SaRouteInterceptor`，这里我们的`IgnoreUrlsConfig`配置会从配置文件中读取白名单配置；

```java
/**
* Sa-Token相关配置
*/
@Configuration
    public class SaTokenConfig implements WebMvcConfigurer {
    
    @Autowired
    private IgnoreUrlsConfig ignoreUrlsConfig;
    
    /**
    * 注册sa-token拦截器
    */
    @Override
        public void addInterceptors(InterceptorRegistry registry) {
            registry.addInterceptor(new SaRouteInterceptor((req, resp, handler) -> {
            // 获取配置文件中的白名单路径
            List<String> ignoreUrls = ignoreUrlsConfig.getUrls();
            // 登录认证：除白名单路径外均需要登录认证
            SaRouter.match(Collections.singletonList("/**"), ignoreUrls, StpUtil::checkLogin);
            })).addPathPatterns("/**");
        }
    }
```

*   `application.yml`文件中的白名单配置如下，注意开放Swagger的访问路径和静态资源路径；

```yaml
# 访问白名单路径
secure:
ignored:
urls:
- /
- /swagger-ui/
- /*.html
- /favicon.ico
- /**/*.html
- /**/*.css
- /**/*.js
- /swagger-resources/**
- /v2/api-docs/**
- /actuator/**
- /admin/login
- /admin/isLogin
```

*   由于未登录状态下访问接口，Sa-Token会抛出`NotLoginException`异常，所以我们需要全局处理下；

```java
/**
* 全局异常处理
* Created by macro on 2020/2/27.
*/
@ControllerAdvice
    public class GlobalExceptionHandler {
    
    /**
    * 处理未登录的异常
    */
    @ResponseBody
    @ExceptionHandler(value = NotLoginException.class)
        public CommonResult handleNotLoginException(NotLoginException e) {
        return CommonResult.unauthorized(e.getMessage());
    }
}
```

*   之后当我们在登录状态下访问接口时，可以获取到数据；

![](/images/jueJin/4a6d9c53e7ee4d6.png)

*   当我们未登录状态（不带token）时无法正常访问接口，返回`code`为`401`。

![](/images/jueJin/12895f41a7024dd.png)

### 角色认证

> 角色认证也就是我们定义好一套规则，比如`ROLE-ADMIN`角色可以访问`/brand`下的所有资源，而`ROLE_USER`角色只能访问`/brand/listAll`，接下来我们来实现下角色认证。

*   首先我们需要扩展Sa-Token的`StpInterface`接口，通过实现方法来返回用户的角色码和权限码；

```java
/**
* 自定义权限验证接口扩展
*/
@Component
    public class StpInterfaceImpl implements StpInterface {
    @Autowired
    private UmsAdminService adminService;
    @Override
        public List<String> getPermissionList(Object loginId, String loginType) {
        AdminUser adminUser = adminService.getAdminById(Convert.toLong(loginId));
        return adminUser.getRole().getPermissionList();
    }
    
    @Override
        public List<String> getRoleList(Object loginId, String loginType) {
        AdminUser adminUser = adminService.getAdminById(Convert.toLong(loginId));
        return Collections.singletonList(adminUser.getRole().getName());
    }
}
```

*   然后在Sa-Token的拦截器中配置路由规则，`ROLE_ADMIN`角色可以访问所有路径，而`ROLE_USER`只能访问`/brand/listAll`路径；

```java
/**
* Sa-Token相关配置
*/
@Configuration
    public class SaTokenConfig implements WebMvcConfigurer {
    
    @Autowired
    private IgnoreUrlsConfig ignoreUrlsConfig;
    
    /**
    * 注册sa-token拦截器
    */
    @Override
        public void addInterceptors(InterceptorRegistry registry) {
            registry.addInterceptor(new SaRouteInterceptor((req, resp, handler) -> {
            // 获取配置文件中的白名单路径
            List<String> ignoreUrls = ignoreUrlsConfig.getUrls();
            // 登录认证：除白名单路径外均需要登录认证
            SaRouter.match(Collections.singletonList("/**"), ignoreUrls, StpUtil::checkLogin);
            // 角色认证：ROLE_ADMIN可以访问所有接口，ROLE_USER只能访问查询全部接口
                SaRouter.match("/brand/listAll", () -> {
                StpUtil.checkRoleOr("ROLE_ADMIN","ROLE_USER");
                //强制退出匹配链
                SaRouter.stop();
                });
                SaRouter.match("/brand/**", () -> StpUtil.checkRole("ROLE_ADMIN"));
                })).addPathPatterns("/**");
            }
        }
```

*   当用户不是被允许的角色访问时，Sa-Token会抛出`NotRoleException`异常，我们可以全局处理下；

```java
/**
* 全局异常处理
* Created by macro on 2020/2/27.
*/
@ControllerAdvice
    public class GlobalExceptionHandler {
    
    /**
    * 处理没有角色的异常
    */
    @ResponseBody
    @ExceptionHandler(value = NotRoleException.class)
        public CommonResult handleNotRoleException(NotRoleException e) {
        return CommonResult.forbidden(e.getMessage());
    }
}
```

*   我们现在有两个用户，`admin`用户具有`ROLE_ADMIN`角色，`macro`用户具有`ROLE_USER`角色；

![](/images/jueJin/a5f1bfc7f20d462.png)

*   使用`admin`账号访问`/brand/list`接口可以正常访问；

![](/images/jueJin/a5fd7aeeb7df495.png)

*   使用`macro`账号访问`/brand/list`接口无法正常访问，返回`code`为`403`。

![](/images/jueJin/066563b694c24b7.png)

### 权限认证

> 当我们给角色分配好权限，然后给用户分配好角色后，用户就拥有了这些权限。我们可以为每个接口分配不同的权限，拥有该权限的用户就可以访问该接口。这就是权限认证，接下来我们来实现下它。

*   我们可以在Sa-Token的拦截器中配置路由规则，`admin`用户可以访问所有路径，而`macro`用户只有读取的权限，没有写、改、删的权限；

```java
/**
* Sa-Token相关配置
*/
@Configuration
    public class SaTokenConfig implements WebMvcConfigurer {
    
    @Autowired
    private IgnoreUrlsConfig ignoreUrlsConfig;
    
    /**
    * 注册sa-token拦截器
    */
    @Override
        public void addInterceptors(InterceptorRegistry registry) {
            registry.addInterceptor(new SaRouteInterceptor((req, resp, handler) -> {
            // 获取配置文件中的白名单路径
            List<String> ignoreUrls = ignoreUrlsConfig.getUrls();
            // 登录认证：除白名单路径外均需要登录认证
            SaRouter.match(Collections.singletonList("/**"), ignoreUrls, StpUtil::checkLogin);
            // 权限认证：不同接口, 校验不同权限
            SaRouter.match("/brand/listAll", () -> StpUtil.checkPermission("brand:read"));
            SaRouter.match("/brand/create", () -> StpUtil.checkPermission("brand:create"));
            SaRouter.match("/brand/update/{id}", () -> StpUtil.checkPermission("brand:update"));
            SaRouter.match("/brand/delete/{id}", () -> StpUtil.checkPermission("brand:delete"));
            SaRouter.match("/brand/list", () -> StpUtil.checkPermission("brand:read"));
            SaRouter.match("/brand/{id}", () -> StpUtil.checkPermission("brand:read"));
            })).addPathPatterns("/**");
        }
    }
```

*   当用户无权限访问时，Sa-Token会抛出`NotPermissionException`异常，我们可以全局处理下；

```java
/**
* 全局异常处理
* Created by macro on 2020/2/27.
*/
@ControllerAdvice
    public class GlobalExceptionHandler {
    
    /**
    * 处理没有权限的异常
    */
    @ResponseBody
    @ExceptionHandler(value = NotPermissionException.class)
        public CommonResult handleNotPermissionException(NotPermissionException e) {
        return CommonResult.forbidden(e.getMessage());
    }
}
```

*   使用`admin`账号访问`/brand/delete`接口可以正常访问；

![](/images/jueJin/1f554dcd52ea47a.png)

*   使用`macro`账号访问`/brand/delete`无法正常访问，返回`code`为`403`。

![](/images/jueJin/9526b033a01e4fd.png)

总结
--

通过对Sa-Token的一波实践，我们可以发现它的API设计非常优雅，比起Shiro和Spring Security来说确实顺手多了。Sa-Token不仅提供了一系列强大的权限相关功能，还提供了很多标准的解决方案，比如Oauth2、分布式Session会话等，大家感兴趣的话可以研究下。

参考资料
----

> Sa-Token的官方文档很全，也很良心，不仅提供了解决方式，还提供了解决思路，强烈建议大家去看下。

![](/images/jueJin/372eb851b91d442.png)

官方文档：[sa-token.dev33.cn/](https://link.juejin.cn?target=http%3A%2F%2Fsa-token.dev33.cn%2F "http://sa-token.dev33.cn/")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-sa-token "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-sa-token")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！