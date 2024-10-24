---
author: "MacroZheng"
title: "别再用过时的方式了！全新版本Spring Security，这样用才够优雅！"
date: 2022-06-07
description: "前不久Spring Boot 270 刚刚发布，升级后发现，原来一直在用的Spring Security配置方法，居然已经被弃用了。今天带大家体验下它的最新用法，看看是不是够优雅！"
tags: ["Java","后端","Spring Boot中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:304,comments:0,collects:676,views:50881,"
---
> 前不久Spring Boot 2.7.0 刚刚发布，Spring Security 也升级到了5.7.1 。升级后发现，原来一直在用的Spring Security配置方法，居然已经被弃用了。不禁感慨技术更新真快，用着用着就被弃用了！今天带大家体验下Spring Security的最新用法，看看是不是够优雅！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

基本使用
----

> 我们先对比下Spring Security提供的基本功能登录认证，来看看新版用法是不是更好。

### 升级版本

首先修改项目的`pom.xml`文件，把Spring Boot版本升级至`2.7.0`版本。

```xml
<parent>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-parent</artifactId>
<version>2.7.0</version>
<relativePath/> <!-- lookup parent from repository -->
</parent>
```

### 旧用法

在Spring Boot 2.7.0 之前的版本中，我们需要写个配置类继承`WebSecurityConfigurerAdapter`，然后重写Adapter中的三个方法进行配置；

```java
/**
* SpringSecurity的配置
* Created by macro on 2018/4/26.
*/
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
    public class OldSecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private UmsAdminService adminService;
    
    @Override
        protected void configure(HttpSecurity httpSecurity) throws Exception {
        //省略HttpSecurity的配置
    }
    
    @Override
        protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService())
        .passwordEncoder(passwordEncoder());
    }
    
    @Bean
    @Override
        public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
    
}
```

如果你在SpringBoot 2.7.0版本中进行使用的话，你就会发现`WebSecurityConfigurerAdapter`已经被弃用了，看样子Spring Security要坚决放弃这种用法了！

![](/images/jueJin/fdd5438dc6324a5.png)

### 新用法

新用法非常简单，无需再继承`WebSecurityConfigurerAdapter`，只需直接声明配置类，再配置一个生成`SecurityFilterChain`Bean的方法，把原来的HttpSecurity配置移动到该方法中即可。

```java
/**
* SpringSecurity 5.4.x以上新用法配置
* 为避免循环依赖，仅用于配置HttpSecurity
* Created by macro on 2022/5/19.
*/
@Configuration
    public class SecurityConfig {
    
    @Bean
        SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        //省略HttpSecurity的配置
        return httpSecurity.build();
    }
    
}
```

新用法感觉非常简洁干脆，避免了继承`WebSecurityConfigurerAdapter`并重写方法的操作，强烈建议大家更新一波！

高级使用
----

> 升级 Spring Boot 2.7.0版本后，Spring Security对于配置方法有了大的更改，那么其他使用有没有影响呢？其实是没啥影响的，这里再聊聊如何使用Spring Security实现动态权限控制！

### 基于方法的动态权限

> 首先来聊聊基于方法的动态权限控制，这种方式虽然实现简单，但却有一定的弊端。

*   在配置类上使用`@EnableGlobalMethodSecurity`来开启它；

```java
/**
* SpringSecurity的配置
* Created by macro on 2018/4/26.
*/
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
    public class OldSecurityConfig extends WebSecurityConfigurerAdapter {
    
}
```

*   然后在方法中使用`@PreAuthorize`配置访问接口需要的权限；

```java
/**
* 商品管理Controller
* Created by macro on 2018/4/26.
*/
@Controller
@Api(tags = "PmsProductController", description = "商品管理")
@RequestMapping("/product")
    public class PmsProductController {
    @Autowired
    private PmsProductService productService;
    
    @ApiOperation("创建商品")
    @RequestMapping(value = "/create", method = RequestMethod.POST)
    @ResponseBody
    @PreAuthorize("hasAuthority('pms:product:create')")
        public CommonResult create(@RequestBody PmsProductParam productParam, BindingResult bindingResult) {
        int count = productService.create(productParam);
            if (count > 0) {
            return CommonResult.success(count);
                } else {
                return CommonResult.failed();
            }
        }
    }
```

*   再从数据库中查询出用户所拥有的权限值设置到`UserDetails`对象中去，这种做法虽然实现方便，但是把权限值写死在了方法上，并不是一种优雅的做法。

```java
/**
* UmsAdminService实现类
* Created by macro on 2018/4/26.
*/
@Service
    public class UmsAdminServiceImpl implements UmsAdminService {
    @Override
        public UserDetails loadUserByUsername(String username){
        //获取用户信息
        UmsAdmin admin = getAdminByUsername(username);
            if (admin != null) {
            List<UmsPermission> permissionList = getPermissionList(admin.getId());
            return new AdminUserDetails(admin,permissionList);
        }
        throw new UsernameNotFoundException("用户名或密码错误");
    }
}
```

### 基于路径的动态权限

> 其实每个接口对应的路径都是唯一的，通过路径来进行接口的权限控制才是更优雅的方式。

*   首先我们需要创建一个动态权限的过滤器，这里注意下`doFilter`方法，用于配置放行`OPTIONS`和`白名单`请求，它会调用`super.beforeInvocation(fi)`方法，此方法将调用`AccessDecisionManager`中的`decide`方法来进行鉴权操作；

```java
/**
* 动态权限过滤器，用于实现基于路径的动态权限过滤
* Created by macro on 2020/2/7.
*/
    public class DynamicSecurityFilter extends AbstractSecurityInterceptor implements Filter {
    
    @Autowired
    private DynamicSecurityMetadataSource dynamicSecurityMetadataSource;
    @Autowired
    private IgnoreUrlsConfig ignoreUrlsConfig;
    
    @Autowired
        public void setMyAccessDecisionManager(DynamicAccessDecisionManager dynamicAccessDecisionManager) {
        super.setAccessDecisionManager(dynamicAccessDecisionManager);
    }
    
    @Override
        public void init(FilterConfig filterConfig) throws ServletException {
    }
    
    @Override
        public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        FilterInvocation fi = new FilterInvocation(servletRequest, servletResponse, filterChain);
        //OPTIONS请求直接放行
            if(request.getMethod().equals(HttpMethod.OPTIONS.toString())){
            fi.getChain().doFilter(fi.getRequest(), fi.getResponse());
            return;
        }
        //白名单请求直接放行
        PathMatcher pathMatcher = new AntPathMatcher();
            for (String path : ignoreUrlsConfig.getUrls()) {
                if(pathMatcher.match(path,request.getRequestURI())){
                fi.getChain().doFilter(fi.getRequest(), fi.getResponse());
                return;
            }
        }
        //此处会调用AccessDecisionManager中的decide方法进行鉴权操作
        InterceptorStatusToken token = super.beforeInvocation(fi);
            try {
            fi.getChain().doFilter(fi.getRequest(), fi.getResponse());
                } finally {
                super.afterInvocation(token, null);
            }
        }
        
        @Override
            public void destroy() {
        }
        
        @Override
            public Class<?> getSecureObjectClass() {
            return FilterInvocation.class;
        }
        
        @Override
            public SecurityMetadataSource obtainSecurityMetadataSource() {
            return dynamicSecurityMetadataSource;
        }
        
    }
```

*   接下来我们就需要创建一个类来继承`AccessDecisionManager`，通过`decide`方法对访问接口所需权限和用户拥有的权限进行匹配，匹配则放行；

```java
/**
* 动态权限决策管理器，用于判断用户是否有访问权限
* Created by macro on 2020/2/7.
*/
    public class DynamicAccessDecisionManager implements AccessDecisionManager {
    
    @Override
    public void decide(Authentication authentication, Object object,
        Collection<ConfigAttribute> configAttributes) throws AccessDeniedException, InsufficientAuthenticationException {
        // 当接口未被配置资源时直接放行
            if (CollUtil.isEmpty(configAttributes)) {
            return;
        }
        Iterator<ConfigAttribute> iterator = configAttributes.iterator();
            while (iterator.hasNext()) {
            ConfigAttribute configAttribute = iterator.next();
            //将访问所需资源或用户拥有资源进行比对
            String needAuthority = configAttribute.getAttribute();
                for (GrantedAuthority grantedAuthority : authentication.getAuthorities()) {
                    if (needAuthority.trim().equals(grantedAuthority.getAuthority())) {
                    return;
                }
            }
        }
        throw new AccessDeniedException("抱歉，您没有访问权限");
    }
    
    @Override
        public boolean supports(ConfigAttribute configAttribute) {
        return true;
    }
    
    @Override
        public boolean supports(Class<?> aClass) {
        return true;
    }
    
}
```

*   由于上面的`decide`方法中的`configAttributes`属性是从`FilterInvocationSecurityMetadataSource`的`getAttributes`方法中获取的，我们还需创建一个类继承它，`getAttributes`方法可用于获取访问当前路径所需权限值；

```java
/**
* 动态权限数据源，用于获取动态权限规则
* Created by macro on 2020/2/7.
*/
    public class DynamicSecurityMetadataSource implements FilterInvocationSecurityMetadataSource {
    
    private static Map<String, ConfigAttribute> configAttributeMap = null;
    @Autowired
    private DynamicSecurityService dynamicSecurityService;
    
    @PostConstruct
        public void loadDataSource() {
        configAttributeMap = dynamicSecurityService.loadDataSource();
    }
    
        public void clearDataSource() {
        configAttributeMap.clear();
        configAttributeMap = null;
    }
    
    @Override
        public Collection<ConfigAttribute> getAttributes(Object o) throws IllegalArgumentException {
        if (configAttributeMap == null) this.loadDataSource();
        List<ConfigAttribute>  configAttributes = new ArrayList<>();
        //获取当前访问的路径
        String url = ((FilterInvocation) o).getRequestUrl();
        String path = URLUtil.getPath(url);
        PathMatcher pathMatcher = new AntPathMatcher();
        Iterator<String> iterator = configAttributeMap.keySet().iterator();
        //获取访问该路径所需资源
            while (iterator.hasNext()) {
            String pattern = iterator.next();
                if (pathMatcher.match(pattern, path)) {
                configAttributes.add(configAttributeMap.get(pattern));
            }
        }
        // 未设置操作请求权限，返回空集合
        return configAttributes;
    }
    
    @Override
        public Collection<ConfigAttribute> getAllConfigAttributes() {
        return null;
    }
    
    @Override
        public boolean supports(Class<?> aClass) {
        return true;
    }
    
}
```

*   这里需要注意的是，所有路径对应的权限值数据来自于自定义的`DynamicSecurityService`；

```java
/**
* 动态权限相关业务类
* Created by macro on 2020/2/7.
*/
    public interface DynamicSecurityService {
    /**
    * 加载资源ANT通配符和资源对应MAP
    */
    Map<String, ConfigAttribute> loadDataSource();
}
```

*   一切准备就绪，把动态权限过滤器添加到`FilterSecurityInterceptor`之前；

```java
/**
* SpringSecurity 5.4.x以上新用法配置
* 为避免循环依赖，仅用于配置HttpSecurity
* Created by macro on 2022/5/19.
*/
@Configuration
    public class SecurityConfig {
    
    @Autowired
    private DynamicSecurityService dynamicSecurityService;
    @Autowired
    private DynamicSecurityFilter dynamicSecurityFilter;
    
    @Bean
        SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        //省略若干配置...
        //有动态权限配置时添加动态权限校验过滤器
            if(dynamicSecurityService!=null){
            registry.and().addFilterBefore(dynamicSecurityFilter, FilterSecurityInterceptor.class);
        }
        return httpSecurity.build();
    }
    
}
```

*   如果你看过这篇[仅需四步，整合SpringSecurity+JWT实现登录认证 ！](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2F4xfdeBHKa_pXabgo41z26g "https://mp.weixin.qq.com/s/4xfdeBHKa_pXabgo41z26g") 的话，就知道应该要配置这两个Bean了，一个负责获取登录用户信息，另一个负责获取存储的动态权限规则，为了适应Spring Security的新用法，我们不再继承`SecurityConfig`，简洁了不少！

```java
/**
* mall-security模块相关配置
* 自定义配置，用于配置如何获取用户信息及动态权限
* Created by macro on 2022/5/20.
*/
@Configuration
    public class MallSecurityConfig {
    
    @Autowired
    private UmsAdminService adminService;
    
    @Bean
        public UserDetailsService userDetailsService() {
        //获取登录用户信息
            return username -> {
            AdminUserDetails admin = adminService.getAdminByUsername(username);
                if (admin != null) {
                return admin;
            }
            throw new UsernameNotFoundException("用户名或密码错误");
            };
        }
        
        @Bean
            public DynamicSecurityService dynamicSecurityService() {
                return new DynamicSecurityService() {
                @Override
                    public Map<String, ConfigAttribute> loadDataSource() {
                    Map<String, ConfigAttribute> map = new ConcurrentHashMap<>();
                    List<UmsResource> resourceList = adminService.getResourceList();
                        for (UmsResource resource : resourceList) {
                        map.put(resource.getUrl(), new org.springframework.security.access.SecurityConfig(resource.getId() + ":" + resource.getName()));
                    }
                    return map;
                }
                };
            }
            
        }
```

效果测试
----

*   接下来启动我们的示例项目`mall-tiny-security`，使用如下账号密码登录，该账号只配置了访问`/brand/listAll`的权限，访问地址：[http://localhost:8088/swagger-ui/](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8088%2Fswagger-ui%2F "http://localhost:8088/swagger-ui/")

![](/images/jueJin/704e605d11964c6.png)

*   然后把返回的token放入到Swagger的认证头中；

![](/images/jueJin/2f6d0541e76145e.png)

*   当我们访问有权限的接口时可以正常获取到数据；

![](/images/jueJin/aec1ff2ed77846a.png)

*   当我们访问没有权限的接口时，返回没有访问权限的接口提示。

![](/images/jueJin/c8a468c1229b438.png)

总结
--

Spring Security的升级用法确实够优雅，够简单，而且对之前用法的兼容性也比较好！个人感觉一个成熟的框架不太会在升级过程中大改用法，即使改了也会对之前的用法做兼容，所以对于绝大多数框架来说旧版本会用，新版本照样会用！

参考资料
----

> 本文仅仅是对Spring Security新用法的总结，如果你想了解Spring Security更多用法，可以参考下之前的文章。

*   [mall整合SpringSecurity和JWT实现认证和授权（一）](https://juejin.cn/post/6844903861237317640 "https://juejin.cn/post/6844903861237317640")
*   [mall整合SpringSecurity和JWT实现认证和授权（二）](https://juejin.cn/post/6844903861384118285 "https://juejin.cn/post/6844903861384118285")
*   [仅需四步，整合SpringSecurity+JWT实现登录认证 ！](https://juejin.cn/post/6844904018972508174 "https://juejin.cn/post/6844904018972508174")
*   [手把手教你搞定权限管理，结合Spring Security实现接口的动态权限控制！](https://juejin.cn/post/6844904072479244301 "https://juejin.cn/post/6844904072479244301")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-security "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-security")