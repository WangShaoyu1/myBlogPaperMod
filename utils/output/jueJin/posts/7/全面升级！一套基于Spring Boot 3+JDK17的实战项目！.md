---
author: "MacroZheng"
title: "全面升级！一套基于Spring Boot 3+JDK17的实战项目！"
date: 2024-05-08
description: "最近把mall项目升级支持了Spring Boot 3+JDK17，今天就来介绍下mall项目做了哪些升级，包括依赖的升级、框架的用法升级以及运行部署的改动，希望对大家有所帮助！"
tags: ["后端","Java","Spring Boot中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:21,comments:0,collects:58,views:4112,"
---
> 最近把mall项目升级支持了Spring Boot 3+JDK17，今天就来介绍下mall项目做了哪些升级，包括依赖的升级、框架的用法升级以及运行部署的改动，目前Spring Boot 3版本代码在mall项目的`dev-v3`分支下，希望对大家有所帮助！

mall项目简介
--------

这里还是先简单介绍下mall项目吧，mall项目是一套基于 SpringBoot + Vue + uni-app 实现的电商系统（Github标星60K），采用Docker容器化部署。包括前台商城项目和后台管理系统，能支持完整的订单流程！涵盖商品、订单、购物车、权限、优惠券、会员、支付等功能！

*   项目地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")
*   项目文档：[www.macrozheng.com](https://link.juejin.cn?target=https%3A%2F%2Fwww.macrozheng.com "https://www.macrozheng.com")

**项目演示：**

![](/images/jueJin/57d06b54c9fa44c.png)

升级版本
----

目前项目中的依赖都已经升级到了最新主流版本，具体的版本可以参考下表。

框架

版本

说明

SpringBoot

2.7.5->3.2.2

Java应用开发框架

SpringSecurity

5.7.4->6.2.1

认证和授权框架

MyBatis

3.5.10->3.5.14

ORM框架

MyBatisGenerator

1.4.1->1.4.2

数据层代码生成器

SprngDataRedis

2.7.5->3.2.2

Redis数据操作框架

SprngDataElasticsearch

4.4.5->5.2.2

Elasticsearch数据操作框架

SprngDataMongoDB

3.4.5->4.2.2

MongoDB数据操作框架

Druid

1.2.14->1.2.21

数据库连接池

Hutool

5.8.9->5.8.16

Java工具类库

PageHelper

5.3.2->6.1.0

MyBatis物理分页插件

Swagger-UI

SpringFox->SpringDoc

API文档生成工具

logstash-logback-encoder

7.2->7.4

Logstash日志收集插件

docker-maven-plugin

0.40.2->0.43.3

应用打包成Docker镜像的Maven插件

升级用法
----

> 在mall项目升级Spring Boot 3的过程中，有些框架的用法有所改变，比如生成API文档的库改用了SpringDoc，Spring Data Elasticsearch和Spring Security随着版本升级，用法也不同了，这里我们将着重讲解这些升级的新用法！

### 从SpringFox迁移到SpringDoc

> 由于之前使用的Swagger库为SpringFox，目前已经不支持Spring Boot 3了，这里迁移到了SpringDoc。

*   迁移到SpringDoc后，在`application.yml`需要添加SpringDoc的相关配置；

```yaml
springdoc:
swagger-ui:
# 修改Swagger UI路径
path: /swagger-ui.html
# 开启Swagger UI界面
enabled: true
# 用于配置tag和operation的展开方式，这里配置为都不展开
doc-expansion: 'none'
api-docs:
# 修改api-docs路径
path: /v3/api-docs
# 开启api-docs
enabled: true
group-configs:
- group: 'default'
packages-to-scan: com.macro.mall.controller
default-flat-param-object: false
```

*   Java配置也需要做对应修改，具体参考SpringDocConfig配置类的代码；

```java
/**
* SpringDoc相关配置
* Created by macro on 2024/3/5.
*/
@Configuration
    public class SpringDocConfig implements WebMvcConfigurer {
    
    private static final String SECURITY_SCHEME_NAME = "Authorization";
    
    @Bean
        public OpenAPI mallAdminOpenAPI() {
        return new OpenAPI()
        .info(new Info().title("mall后台系统")
        .description("mall后台相关接口文档")
        .version("v1.0.0")
        .license(new License().name("Apache 2.0")
        .url("https://github.com/macrozheng/mall-learning")))
        .externalDocs(new ExternalDocumentation()
        .description("SpringBoot实战电商项目mall（60K+Star）全套文档")
        .url("http://www.macrozheng.com"))
        .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
        .components(new Components()
        .addSecuritySchemes(SECURITY_SCHEME_NAME,
        new SecurityScheme()
        .name(SECURITY_SCHEME_NAME)
        .type(SecurityScheme.Type.HTTP)
        .scheme("bearer")
        .bearerFormat("JWT")));
    }
    
    @Override
        public void addViewControllers(ViewControllerRegistry registry) {
        //配置访问`/swagger-ui/`路径时可以直接跳转到`/swagger-ui/index.html`
        registry.addViewController("/swagger-ui/").setViewName("redirect:/swagger-ui/index.html");
    }
    
}
```

*   之前在Controller和实体类上使用的SpringFox的注解，需要改用SpringDoc的注解，注解对照关系可以参考下表；

SpringFox

SpringDoc

注解用途

@Api

@Tag

用于接口类，标识这个类是Swagger的资源，可用于给接口类添加说明

@ApiIgnore

@Parameter(hidden = true)`or`@Operation(hidden = true)`or`@Hidden

忽略该类的文档生成

@ApiImplicitParam

@Parameter

隐式指定接口方法中的参数，可给请求参数添加说明

@ApiImplicitParams

@Parameters

隐式指定接口方法中的参数集合，为上面注解的集合

@ApiModel

@Schema

用于实体类，声明一个Swagger的模型

@ApiModelProperty

@Schema

用于实体类的参数，声明Swagger模型的属性

@ApiOperation(value = "foo", notes = "bar")

@Operation(summary = "foo", description = "bar")

用于接口方法，标识这个类是Swagger的一个接口，可用于给接口添加说明

@ApiParam

@Parameter

用于接口方法参数，给请求参数添加说明

@ApiResponse(code = 404, message = "foo")

ApiResponse(responseCode = "404", description = "foo")

用于描述一个可能的返回结果

*   在我们使用SpringDoc生成的文档时，有一点需要`特别注意`，添加认证请求头时，已经无需添加`Bearer` 前缀，SpringDoc会自动帮我们添加的。

![](/images/jueJin/2ca83a3dac2d434.png)

### Spring Data Elasticsearch新用法

> Spring Data ES中基于ElasticsearchRepository的一些简单查询的用法是没变化的，对于复杂查询，由于ElasticsearchRestTemplate类已经被移除，需要使用ElasticsearchTemplate类来实现。

*   使用ElasticsearchTemplate实现的复杂查询，对比之前变化也不大，基本就是一些类和方法改了名字而已，大家可以自行参考`EsProductServiceImpl`类中源码即可；

```java
/**
* 搜索商品管理Service实现类
* Created by macro on 2018/6/19.
*/
@Service
    public class EsProductServiceImpl implements EsProductService {
    private static final Logger LOGGER = LoggerFactory.getLogger(EsProductServiceImpl.class);
    @Autowired
    private ElasticsearchTemplate elasticsearchTemplate;
    
    @Override
        public Page<EsProduct> search(String keyword, Long brandId, Long productCategoryId, Integer pageNum, Integer pageSize,Integer sort) {
        Pageable pageable = PageRequest.of(pageNum, pageSize);
        NativeQueryBuilder nativeQueryBuilder = new NativeQueryBuilder();
        //分页
        nativeQueryBuilder.withPageable(pageable);
        //过滤
            if (brandId != null || productCategoryId != null) {
                Query boolQuery = QueryBuilders.bool(builder -> {
                    if (brandId != null) {
                    builder.must(QueryBuilders.term(b -> b.field("brandId").value(brandId)));
                }
                    if (productCategoryId != null) {
                    builder.must(QueryBuilders.term(b -> b.field("productCategoryId").value(productCategoryId)));
                }
                return builder;
                });
                nativeQueryBuilder.withFilter(boolQuery);
            }
            //搜索
                if (StrUtil.isEmpty(keyword)) {
                nativeQueryBuilder.withQuery(QueryBuilders.matchAll(builder -> builder));
                    } else {
                    List<FunctionScore> functionScoreList = new ArrayList<>();
                    functionScoreList.add(new FunctionScore.Builder()
                    .filter(QueryBuilders.match(builder -> builder.field("name").query(keyword)))
                    .weight(10.0)
                    .build());
                    functionScoreList.add(new FunctionScore.Builder()
                    .filter(QueryBuilders.match(builder -> builder.field("subTitle").query(keyword)))
                    .weight(5.0)
                    .build());
                    functionScoreList.add(new FunctionScore.Builder()
                    .filter(QueryBuilders.match(builder -> builder.field("keywords").query(keyword)))
                    .weight(2.0)
                    .build());
                    FunctionScoreQuery.Builder functionScoreQueryBuilder = QueryBuilders.functionScore()
                    .functions(functionScoreList)
                    .scoreMode(FunctionScoreMode.Sum)
                    .minScore(2.0);
                    nativeQueryBuilder.withQuery(builder -> builder.functionScore(functionScoreQueryBuilder.build()));
                }
                //排序
                    if(sort==1){
                    //按新品从新到旧
                    nativeQueryBuilder.withSort(Sort.by(Sort.Order.desc("id")));
                        }else if(sort==2){
                        //按销量从高到低
                        nativeQueryBuilder.withSort(Sort.by(Sort.Order.desc("sale")));
                            }else if(sort==3){
                            //按价格从低到高
                            nativeQueryBuilder.withSort(Sort.by(Sort.Order.asc("price")));
                                }else if(sort==4){
                                //按价格从高到低
                                nativeQueryBuilder.withSort(Sort.by(Sort.Order.desc("price")));
                            }
                            //按相关度
                            nativeQueryBuilder.withSort(Sort.by(Sort.Order.desc("_score")));
                            NativeQuery nativeQuery = nativeQueryBuilder.build();
                            LOGGER.info("DSL:{}", nativeQuery.getQuery().toString());
                            SearchHits<EsProduct> searchHits = elasticsearchTemplate.search(nativeQuery, EsProduct.class);
                                if(searchHits.getTotalHits()<=0){
                                return new PageImpl<>(ListUtil.empty(),pageable,0);
                            }
                            List<EsProduct> searchProductList = searchHits.stream().map(SearchHit::getContent).collect(Collectors.toList());
                            return new PageImpl<>(searchProductList,pageable,searchHits.getTotalHits());
                        }
                    }
```

*   目前ES 7.17.3版本还是兼容的，这里测试了下ES 8.x版本，也是可以正常使用的，需要注意的是如果使用了8.x版本版本，对应的Kibana、Logstash和中文分词插件analysis-ik都需要使用8.x版本。

### Spring Security新用法

> 升级Spring Boot 3版本后Spring Security的用法也有所变化，比如某些实现动态权限的类已经被弃用了，Security配置改用了函数式编程的方式。

*   我们之前用于实现动态权限的DynamicAccessDecisionManager和DynamicSecurityFilter类实现的接口均已被弃用，取而代之的是需要实现`AuthorizationManager`接口；

![](/images/jueJin/bdb1c9622828426.png)

*   这里我们创建一个DynamicAuthorizationManager类来实现动态权限逻辑；

```java
/**
* 动态鉴权管理器，用于判断是否有资源的访问权限
* Created by macro on 2023/11/3.
*/
    public class DynamicAuthorizationManager implements AuthorizationManager<RequestAuthorizationContext> {
    
    @Autowired
    private DynamicSecurityMetadataSource securityDataSource;
    @Autowired
    private IgnoreUrlsConfig ignoreUrlsConfig;
    
    @Override
        public void verify(Supplier<Authentication> authentication, RequestAuthorizationContext object) {
        AuthorizationManager.super.verify(authentication, object);
    }
    
    @Override
        public AuthorizationDecision check(Supplier<Authentication> authentication, RequestAuthorizationContext requestAuthorizationContext) {
        HttpServletRequest request = requestAuthorizationContext.getRequest();
        String path = request.getRequestURI();
        PathMatcher pathMatcher = new AntPathMatcher();
        //白名单路径直接放行
        List<String> ignoreUrls = ignoreUrlsConfig.getUrls();
            for (String ignoreUrl : ignoreUrls) {
                if (pathMatcher.match(ignoreUrl, path)) {
                return new AuthorizationDecision(true);
            }
        }
        //对应跨域的预检请求直接放行
            if(request.getMethod().equals(HttpMethod.OPTIONS.name())){
            return new AuthorizationDecision(true);
        }
        //权限校验逻辑
        List<ConfigAttribute> configAttributeList = securityDataSource.getConfigAttributesWithPath(path);
        List<String> needAuthorities = configAttributeList.stream()
        .map(ConfigAttribute::getAttribute)
        .collect(Collectors.toList());
        Authentication currentAuth = authentication.get();
        //判定是否已经实现登录认证
            if(currentAuth.isAuthenticated()){
            Collection<? extends GrantedAuthority> grantedAuthorities = currentAuth.getAuthorities();
            List<? extends GrantedAuthority> hasAuth = grantedAuthorities.stream()
            .filter(item -> needAuthorities.contains(item.getAuthority()))
            .collect(Collectors.toList());
                if(CollUtil.isNotEmpty(hasAuth)){
                return new AuthorizationDecision(true);
                    }else{
                    return new AuthorizationDecision(false);
                }
                    }else{
                    return new AuthorizationDecision(false);
                }
            }
        }
```

*   然后在SecurityConfig中使用函数式编程来配置SecurityFilterChain，使用的方法和类和之前基本一致，只是成了函数式编程的方式而已。

```java
/**
* SpringSecurity相关配置，仅用于配置SecurityFilterChain
* Created by macro on 2019/11/5.
*/
@Configuration
@EnableWebSecurity
    public class SecurityConfig {
    
    @Autowired
    private IgnoreUrlsConfig ignoreUrlsConfig;
    @Autowired
    private RestfulAccessDeniedHandler restfulAccessDeniedHandler;
    @Autowired
    private RestAuthenticationEntryPoint restAuthenticationEntryPoint;
    @Autowired
    private JwtAuthenticationTokenFilter jwtAuthenticationTokenFilter;
    @Autowired(required = false)
    private DynamicAuthorizationManager dynamicAuthorizationManager;
    
    @Bean
        SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
            httpSecurity.authorizeHttpRequests(registry -> {
            //不需要保护的资源路径允许访问
                for (String url : ignoreUrlsConfig.getUrls()) {
                registry.requestMatchers(url).permitAll();
            }
            //允许跨域请求的OPTIONS请求
            registry.requestMatchers(HttpMethod.OPTIONS).permitAll();
            //任何请求需要身份认证
            })
            //任何请求需要身份认证
            .authorizeHttpRequests(registry-> registry.anyRequest()
            //有动态权限配置时添加动态权限管理器
            .access(dynamicAuthorizationManager==null? AuthenticatedAuthorizationManager.authenticated():dynamicAuthorizationManager)
            )
            //关闭跨站请求防护
            .csrf(AbstractHttpConfigurer::disable)
            //修改Session生成策略为无状态会话
            .sessionManagement(configurer -> configurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            //自定义权限拒绝处理类
            .exceptionHandling(configurer -> configurer.accessDeniedHandler(restfulAccessDeniedHandler).authenticationEntryPoint(restAuthenticationEntryPoint))
            //自定义权限拦截器JWT过滤器
            .addFilterBefore(jwtAuthenticationTokenFilter, UsernamePasswordAuthenticationFilter.class);
            return httpSecurity.build();
        }
        
    }
```

### 其他

*   由于Java EE已经变更为Jakarta EE，包名以`javax`开头的需要改为`jakarta`，导包时需要注意；

![](/images/jueJin/7d14ed8cfea84e8.png)

*   Spring Boot 3.2 版本会有Parameter Name Retention（不会根据参数名称去寻找对应name的Bean实例）问题，添加Maven编译插件参数解决；

```xml
<build>
<plugins>
<!--解决SpringBoot 3.2 Parameter Name Retention 问题-->
<plugin>
<groupId>org.apache.maven.plugins</groupId>
<artifactId>maven-compiler-plugin</artifactId>
<configuration>
<compilerArgs>
<arg>-parameters</arg>
</compilerArgs>
</configuration>
</plugin>
</plugins>
</build>
```

*   或者可以通过在参数上添加`@Qualifier`指定name来解决，注意如果使用此种方式，Swagger API文档中的请求参数名称也会无法推断，所以还是使用上面的方法吧。

```java
/**
* @auther macrozheng
* @description 消息队列相关配置
* @date 2018/9/14
* @github https://github.com/macrozheng
*/
@Configuration
    public class RabbitMqConfig {
    
    /**
    * 订单消息实际消费队列所绑定的交换机
    */
    @Bean
        DirectExchange orderDirect() {
        return ExchangeBuilder
        .directExchange(QueueEnum.QUEUE_ORDER_CANCEL.getExchange())
        .durable(true)
        .build();
    }
    
    /**
    * 将订单队列绑定到交换机
    */
    @Bean
    Binding orderBinding(@Qualifier("orderDirect") DirectExchange orderDirect,
        @Qualifier("orderQueue") Queue orderQueue){
        return BindingBuilder
        .bind(orderQueue)
        .to(orderDirect)
        .with(QueueEnum.QUEUE_ORDER_CANCEL.getRouteKey());
    }
}
```

运行部署
----

### Windows

由于Spring Boot 3最低要求是`JDK17`，我们在Windows下运行项目时需要配置好项目的JDK版本，其他操作和之前版本运行一样。

![](/images/jueJin/64657700ae594ed.png)

### Linux

在打包应用的Docker镜像时，我们也需要配置项目使用`openjdk:17`，这里在项目根目录下的`pom.xml`中修改`docker-maven-plugin`插件配置即可。

![](/images/jueJin/aa9524cbf694446.png)

由于镜像使用了`openjdk:17`，我们在打包镜像之前还许提前下载好openjdk的镜像，使用如下命令即可，其他操作和之前版本部署一样。

```bash
docker pull openjdk:17
```

总结
--

今天主要讲解了mall项目升级Spring Boot 3版本的一些注意点，这里总结下：

*   项目中使用的框架版本升级到了最新主流版本；
*   从SpringFox迁移到了SpringDoc；
*   商品搜索功能实现采用了Spring Data ES的新用法；
*   Spring Security使用了新用法；
*   项目运行部署时需要使用JDK 17版本。

项目源码地址
------

> 注意Spring Boot 3版本代码在`dev-v3`分支里。

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")