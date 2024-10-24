---
author: "MacroZheng"
title: "还在用HttpUtil？SpringBoot 30全新HTTP客户端工具来了，用起来够优雅！"
date: 2022-12-13
description: "前不久SpringBoot 30发布了，出了一个Http Interface的新特性，它允许我们使用声明式服务调用的方式来调用远程接口，今天我们就来聊聊它的使用！"
tags: ["Java","后端","Spring Boot中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:77,comments:13,collects:155,views:11305,"
---
> 我们平时开发项目的时候，经常会需要远程调用下其他服务提供的接口，于是我们会使用一些HTTP工具类比如Hutool提供的HttpUtil。前不久SpringBoot 3.0发布了，出了一个`Http Interface`的新特性，它允许我们使用声明式服务调用的方式来调用远程接口，今天我们就来聊聊它的使用！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

简介
--

`Http Interface`让你可以像定义Java接口那样定义HTTP服务，而且用法和你平时写Controller中方法完全一致。它会为这些HTTP服务接口自动生成代理实现类，底层是基于Webflux的WebClient实现的。

使用声明式服务调用确实够优雅，下面是一段使用`Http Interface`声明的Http服务代码。

![](/images/jueJin/4b189ce9bf804b6.png)

使用
--

> 在SpringBoot 3.0中使用`Http Interface`是非常简单的，下面我们就来体验下。

### 依赖集成

*   首先在项目的`pom.xml`中定义好SpringBoot的版本为`3.0.0`；

```xml
<parent>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-parent</artifactId>
<version>3.0.0</version>
<relativePath/> <!-- lookup parent from repository -->
</parent>
```

*   由于SpringBoot最低要求为`Java 17`，我们需要先安装好JDK 17，安装完成后配置项目的SDK版本为`Java 17`，JDK下载地址：[www.oracle.com/cn/java/tec…](https://link.juejin.cn?target=https%3A%2F%2Fwww.oracle.com%2Fcn%2Fjava%2Ftechnologies%2Fdownloads%2F "https://www.oracle.com/cn/java/technologies/downloads/")

![](/images/jueJin/ff27e897393d47b.png)

*   由于`Http Interface`需要依赖webflux来实现，我们还需添加它的依赖。

```xml
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

### 基本使用

> 下面以调用`mall-tiny-swagger`中的接口为例，我们来体验下`Http Interface`的基本使用。

*   首先我们准备一个服务来方便远程调用，使用的是之前的`mall-tiny-swagger`这个Demo，打开Swagger看下，里面有一个登录接口和需要登录认证的商品品牌CRUD接口，项目地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-swagger "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-swagger")

![](/images/jueJin/f04d3a2252d2461.png)

*   先在`application.yml`中配置好`mall-tiny-swagger`的服务地址；

```yaml
remote:
baseUrl: http://localhost:8088/
```

*   再通过`@HttpExchange`声明一个Http服务，使用`@PostExchange`注解表示进行POST请求；

```java
/**
* @auther macrozheng
* @description 定义Http接口，用于调用远程的UmsAdmin服务
* @date 2022/1/19
* @github https://github.com/macrozheng
*/
@HttpExchange
    public interface UmsAdminApi {
    
    @PostExchange("admin/login")
    CommonResult<LoginInfo> login(@RequestParam("username") String username, @RequestParam("password") String password);
}
```

*   再创建一个远程调用品牌服务的接口，参数注解使用我们平时写Controller方法用的那些即可；

```java
/**
* @auther macrozheng
* @description 定义Http接口，用于调用远程的PmsBrand服务
* @date 2022/1/19
* @github https://github.com/macrozheng
*/
@HttpExchange
    public interface PmsBrandApi {
    @GetExchange("brand/list")
    CommonResult<CommonPage<PmsBrand>> list(@RequestParam("pageNum") Integer pageNum, @RequestParam("pageSize") Integer pageSize);
    
    @GetExchange("brand/{id}")
    CommonResult<PmsBrand> detail(@PathVariable("id") Long id);
    
    @PostExchange("brand/create")
    CommonResult create(@RequestBody PmsBrand pmsBrand);
    
    @PostExchange("brand/update/{id}")
    CommonResult update(@PathVariable("id") Long id, @RequestBody PmsBrand pmsBrand);
    
    @GetExchange("brand/delete/{id}")
    CommonResult delete(@PathVariable("id") Long id);
}
```

*   为方便后续调用需要登录认证的接口，我创建了`TokenHolder`这个类，把token存储到了Session中；

```java
/**
* @auther macrozheng
* @description 登录token存储（在Session中）
* @date 2022/1/19
* @github https://github.com/macrozheng
*/
@Component
    public class TokenHolder {
    /**
    * 添加token
    */
        public void putToken(String token) {
        RequestAttributes ra = RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = ((ServletRequestAttributes) ra).getRequest();
        request.getSession().setAttribute("token", token);
    }
    
    /**
    * 获取token
    */
        public String getToken() {
        RequestAttributes ra = RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = ((ServletRequestAttributes) ra).getRequest();
        Object token = request.getSession().getAttribute("token");
            if(token!=null){
            return (String) token;
        }
        return null;
    }
    
}
```

*   创建Java配置，配置好请求用的客户端WebClient及Http服务对象即可，由于品牌服务需要添加认证头才能正常访问，所以使用了过滤器进行统一添加；

```java
@Configuration
    public class HttpInterfaceConfig {
    
    @Value("${remote.baseUrl}")
    private String baseUrl;
    @Autowired
    private TokenHolder tokenHolder;
    
    @Bean
        WebClient webClient() {
        return WebClient.builder()
        //添加全局默认请求头
        .defaultHeader("source", "http-interface")
        //给请求添加过滤器，添加自定义的认证头
            .filter((request, next) -> {
            ClientRequest filtered = ClientRequest.from(request)
            .header("Authorization", tokenHolder.getToken())
            .build();
            return next.exchange(filtered);
            })
            .baseUrl(baseUrl).build();
        }
        
        @Bean
            UmsAdminApi umsAdminApi(WebClient client) {
            HttpServiceProxyFactory factory = HttpServiceProxyFactory.builder(WebClientAdapter.forClient(client)).build();
            return factory.createClient(UmsAdminApi.class);
        }
        
        @Bean
            PmsBrandApi pmsBrandApi(WebClient client) {
            HttpServiceProxyFactory factory = HttpServiceProxyFactory.builder(WebClientAdapter.forClient(client)).build();
            return factory.createClient(PmsBrandApi.class);
        }
    }
```

*   接下来在Controller中注入Http服务对象，然后进行调用即可；

```java
/**
* @auther macrozheng
* @description HttpInterface测试接口
* @date 2022/1/19
* @github https://github.com/macrozheng
*/
@RestController
@Api(tags = "HttpInterfaceController")
@Tag(name = "HttpInterfaceController", description = "HttpInterface测试接口")
@RequestMapping("/remote")
    public class HttpInterfaceController {
    
    @Autowired
    private UmsAdminApi umsAdminApi;
    @Autowired
    private PmsBrandApi pmsBrandApi;
    @Autowired
    private TokenHolder tokenHolder;
    
    @ApiOperation(value = "调用远程登录接口获取token")
    @PostMapping(value = "/admin/login")
        public CommonResult<LoginInfo> login(@RequestParam String username, @RequestParam String password) {
        CommonResult<LoginInfo> result = umsAdminApi.login(username, password);
        LoginInfo loginInfo = result.getData();
            if (result.getData() != null) {
            tokenHolder.putToken(loginInfo.getTokenHead() + " " + loginInfo.getToken());
        }
        return result;
    }
    
    @ApiOperation("调用远程接口分页查询品牌列表")
    @GetMapping(value = "/brand/list")
    public CommonResult<CommonPage<PmsBrand>> listBrand(@RequestParam(value = "pageNum", defaultValue = "1")
    @ApiParam("页码") Integer pageNum,
    @RequestParam(value = "pageSize", defaultValue = "3")
        @ApiParam("每页数量") Integer pageSize) {
        return pmsBrandApi.list(pageNum, pageSize);
    }
    
    @ApiOperation("调用远程接口获取指定id的品牌详情")
    @GetMapping(value = "/brand/{id}")
        public CommonResult<PmsBrand> brand(@PathVariable("id") Long id) {
        return pmsBrandApi.detail(id);
    }
    
    @ApiOperation("调用远程接口添加品牌")
    @PostMapping(value = "/brand/create")
        public CommonResult createBrand(@RequestBody PmsBrand pmsBrand) {
        return pmsBrandApi.create(pmsBrand);
    }
    
    @ApiOperation("调用远程接口更新指定id品牌信息")
    @PostMapping(value = "/brand/update/{id}")
        public CommonResult updateBrand(@PathVariable("id") Long id, @RequestBody PmsBrand pmsBrand) {
        return pmsBrandApi.update(id,pmsBrand);
    }
    
    @ApiOperation("调用远程接口删除指定id的品牌")
    @GetMapping(value = "/delete/{id}")
        public CommonResult deleteBrand(@PathVariable("id") Long id) {
        return  pmsBrandApi.delete(id);
    }
}
```

测试
--

*   下面我们通过Postman进行测试，首先调用登录接口获取到远程服务返回的token了；

![](/images/jueJin/099cfe4ab517430.png)

*   再调用下需要登录认证的品牌列表接口，发现可以正常访问。

![](/images/jueJin/75492f76dad441e.png)

总结
--

`Http Interface`让我们只需定义接口，无需定义方法实现就能进行远程HTTP调用，确实非常方便！但是其实现依赖Webflux的WebClient，在我们使用SpringMVC时会造成一定的麻烦，如果能独立出来就更好了！

参考资料
----

官方文档：[docs.spring.io/spring-fram…](https://link.juejin.cn?target=https%3A%2F%2Fdocs.spring.io%2Fspring-framework%2Fdocs%2Fcurrent%2Freference%2Fhtml%2Fintegration.html "https://docs.spring.io/spring-framework/docs/current/reference/html/integration.html")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-http-interface "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-http-interface")