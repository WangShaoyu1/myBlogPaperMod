---
author: "MacroZheng"
title: "还在用HttpUtil？试试这款优雅的HTTP客户端工具吧，跟SpringBoot绝配！"
date: 2022-02-08
description: "最近发现一款更好用的HTTP客户端工具，你只需声明接口就可发起HTTP请求，无需进行连接、结果解析之类的重复操作，用起来够优雅，推荐给大家！"
tags: ["Java","Spring Boot中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:168,comments:0,collects:322,views:20912,"
---
> 我们平时开发项目时，就算是单体应用，也免不了要调用一下其他服务提供的接口。此时就会用到HTTP客户端工具，之前一直使用的是Hutool中的HttpUtil，虽然容易上手，但用起来颇为麻烦！最近发现一款更好用的HTTP客户端工具`Retrofit`，你只需声明接口就可发起HTTP请求，无需进行连接、结果解析之类的重复操作，用起来够优雅，推荐给大家！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

简介
--

Retrofit是适用于`Android`和`Java`且类型安全的HTTP客户端工具，在Github上已经有`39k+`Star。其最大的特性的是支持通过接口的方式发起HTTP请求，类似于我们用Feign调用微服务接口的那种方式。

![](/images/jueJin/ce856bcf374f480.png)

SpringBoot是使用最广泛的Java开发框架，但是Retrofit官方并没有提供专门的Starter。于是有位老哥就开发了`retrofit-spring-boot-starter`，它实现了Retrofit与SpringBoot框架的快速整合，并且支持了诸多功能增强，极大简化开发。今天我们将使用这个第三方Starter来操作Retrofit。

![](/images/jueJin/bad21c877744482.png)

使用
--

> 在SpringBoot中使用Retrofit是非常简单的，下面我们就来体验下。

### 依赖集成

有了第三方Starter的支持，集成Retrofit仅需一步，添加如下依赖即可。

```xml
<!--Retrofit依赖-->
<dependency>
<groupId>com.github.lianjiatech</groupId>
<artifactId>retrofit-spring-boot-starter</artifactId>
<version>2.2.18</version>
</dependency>
```

### 基本使用

> 下面以调用`mall-tiny-swagger`中的接口为例，我们来体验下Retrofit的基本使用。

*   首先我们准备一个服务来方便远程调用，使用的是之前的`mall-tiny-swagger`这个Demo，打开Swagger看下，里面有一个登录接口和需要登录认证的商品品牌CRUD接口，项目地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-swagger "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-swagger")

![](/images/jueJin/e1c9920a3200439.png)

*   我们先来调用下登录接口试试，在`application.yml`中配置好`mall-tiny-swagger`的服务地址；

```yaml
remote:
baseUrl: http://localhost:8088/
```

*   再通过`@RetrofitClient`声明一个Retrofit客户端，由于登录接口是通过POST表单形式调用的，这里使用到了`@POST`和`@FormUrlEncoded`注解；

```java
/**
* 定义Http接口，用于调用远程的UmsAdmin服务
* Created by macro on 2022/1/19.
*/
@RetrofitClient(baseUrl = "${remote.baseUrl}")
    public interface UmsAdminApi {
    
    @FormUrlEncoded
    @POST("admin/login")
    CommonResult<LoginInfo> login(@Field("username") String username, @Field("password") String password);
}
```

*   如果你不太明白这些注解是干嘛的，看下下面的表基本就懂了，更具体的话可以参考Retrofit官方文档；

![](/images/jueJin/2648523231394d2.png)

*   接下来在Controller中注入`UmsAdminApi`，然后进行调用即可；

```java
/**
* Retrofit测试接口
* Created by macro on 2022/1/19.
*/
@Api(tags = "RetrofitController", description = "Retrofit测试接口")
@RestController
@RequestMapping("/retrofit")
    public class RetrofitController {
    
    @Autowired
    private UmsAdminApi umsAdminApi;
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
}
```

*   为方便后续调用需要登录认证的接口，我创建了`TokenHolder`这个类，把token存储到了Session中；

```java
/**
* 登录token存储（在Session中）
* Created by macro on 2022/1/19.
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

*   接下来通过Swagger进行测试，调用接口就可以获取到远程服务返回的token了，访问地址：[http://localhost:8086/swagger-ui/](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8086%2Fswagger-ui%2F "http://localhost:8086/swagger-ui/")

![](/images/jueJin/4b10e8b697304ee.png)

### 注解式拦截器

> 商品品牌管理接口，需要添加登录认证头才可以正常访问，我们可以使用Retrofit中的注解式拦截器来实现。

*   首先创建一个注解式拦截器`TokenInterceptor`继承`BasePathMatchInterceptor`，然后在`doIntercept`方法中给请求添加`Authorization`头；

```java
/**
* 给请求添加登录Token头的拦截器
* Created by macro on 2022/1/19.
*/
@Component
    public class TokenInterceptor extends BasePathMatchInterceptor {
    @Autowired
    private TokenHolder tokenHolder;
    
    @Override
        protected Response doIntercept(Chain chain) throws IOException {
        Request request = chain.request();
            if (tokenHolder.getToken() != null) {
            request = request.newBuilder()
            .header("Authorization", tokenHolder.getToken())
            .build();
        }
        return chain.proceed(request);
    }
}
```

*   创建调用品牌管理接口的客户端`PmsBrandApi`，使用`@Intercept`注解配置拦截器和拦截路径；

```java
/**
* 定义Http接口，用于调用远程的PmsBrand服务
* Created by macro on 2022/1/19.
*/
@RetrofitClient(baseUrl = "${remote.baseUrl}")
@Intercept(handler = TokenInterceptor.class, include = "/brand/**")
    public interface PmsBrandApi {
    @GET("brand/list")
    CommonResult<CommonPage<PmsBrand>> list(@Query("pageNum") Integer pageNum, @Query("pageSize") Integer pageSize);
    
    @GET("brand/{id}")
    CommonResult<PmsBrand> detail(@Path("id") Long id);
    
    @POST("brand/create")
    CommonResult create(@Body PmsBrand pmsBrand);
    
    @POST("brand/update/{id}")
    CommonResult update(@Path("id") Long id, @Body PmsBrand pmsBrand);
    
    @GET("brand/delete/{id}")
    CommonResult delete(@Path("id") Long id);
}
```

*   再在Controller中注入`PmsBrandApi`实例，并添加方法调用远程服务即可；

```java
/**
* Retrofit测试接口
* Created by macro on 2022/1/19.
*/
@Api(tags = "RetrofitController", description = "Retrofit测试接口")
@RestController
@RequestMapping("/retrofit")
    public class RetrofitController {
    
    @Autowired
    private PmsBrandApi pmsBrandApi;
    
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

*   在Swagger中调用接口进行测试，发现已经可以成功调用。

![](/images/jueJin/dcd87bc896a94e0.png)

### 全局拦截器

> 如果你想给所有请求都加个请求头的话，可以使用全局拦截器。

创建`SourceInterceptor`类继承`BaseGlobalInterceptor`接口，然后在Header中添加`source`请求头。

```java
/**
* 全局拦截器，给请求添加source头
* Created by macro on 2022/1/19.
*/
@Component
    public class SourceInterceptor extends BaseGlobalInterceptor {
    @Override
        protected Response doIntercept(Chain chain) throws IOException {
        Request request = chain.request();
        Request newReq = request.newBuilder()
        .addHeader("source", "retrofit")
        .build();
        return chain.proceed(newReq);
    }
}
```

### 配置

> Retrofit的配置很多，下面我们讲讲日志打印、全局超时时间和全局请求重试这三种最常用的配置。

#### 日志打印

*   默认配置下Retrofit使用`basic`日志策略，打印的日志非常简单；

![](/images/jueJin/f49c04723cdc403.png)

*   我们可以将`application.yml`中的`retrofit.global-log-strategy`属性修改为`body`来打印最全日志；

```yaml
retrofit:
# 日志打印配置
log:
# 启用日志打印
enable: true
# 日志打印拦截器
logging-interceptor: com.github.lianjiatech.retrofit.spring.boot.interceptor.DefaultLoggingInterceptor
# 全局日志打印级别
global-log-level: info
# 全局日志打印策略
global-log-strategy: body
```

*   修改日志打印策略后，日志信息更全面了；

![](/images/jueJin/2538e99e581847d.png)

*   Retrofit支持四种日志打印策略；
    *   NONE：不打印日志；
    *   BASIC：只打印日志请求记录；
    *   HEADERS：打印日志请求记录、请求和响应头信息；
    *   BODY：打印日志请求记录、请求和响应头信息、请求和响应体信息。

#### 全局超时时间

有时候我们需要修改一下Retrofit的请求超时时间，可以通过如下配置实现。

```yaml
retrofit:
# 全局连接超时时间
global-connect-timeout-ms: 3000
# 全局读取超时时间
global-read-timeout-ms: 3000
# 全局写入超时时间
global-write-timeout-ms: 35000
# 全局完整调用超时时间
global-call-timeout-ms: 0
```

#### 全局请求重试

*   `retrofit-spring-boot-starter`支持请求重试，可以通过如下配置实现。

```yaml
retrofit:
# 重试配置
retry:
# 是否启用全局重试
enable-global-retry: true
# 全局重试间隔时间
global-interval-ms: 100
# 全局最大重试次数
global-max-retries: 2
# 全局重试规则
global-retry-rules:
- response_status_not_2xx
- occur_exception
# 重试拦截器
retry-interceptor: com.github.lianjiatech.retrofit.spring.boot.retry.DefaultRetryInterceptor
```

*   重试规则`global-retry-rules`支持如下三种配置。
    *   RESPONSE\_STATUS\_NOT\_2XX：响应状态码不是2xx时执行重试；
    *   OCCUR\_IO\_EXCEPTION：发生IO异常时执行重试；
    *   OCCUR\_EXCEPTION：发生任意异常时执行重试。

总结
--

今天体验了一把Retrofit，对比使用HttpUtil，确实优雅不少！通过接口发起HTTP请求已不再是Feign的专属，通过Retrofit我们在单体应用中照样可以使用这种方式。当然`retrofit-spring-boot-starter`提供的功能远不止于此，它还能支持微服务间的调用和熔断降级，感兴趣的朋友可以研究下！

参考资料
----

官方文档：[github.com/LianjiaTech…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FLianjiaTech%2Fretrofit-spring-boot-starter "https://github.com/LianjiaTech/retrofit-spring-boot-starter")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-retrofit "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-retrofit")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！