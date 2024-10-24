---
author: "MacroZheng"
title: "全面升级！一套基于最新版Spring Cloud的微服务实战项目！"
date: 2024-09-05
description: "最近把mall-swarm电商实战项目升级支持了最新版Spring Cloud+Spring Boot 3+JDK17，今天就来介绍下项目做了哪些升级！"
tags: ["后端","Java","Spring Cloud中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:3,comments:0,collects:2,views:330,"
---
> 最近把mall-swarm项目升级支持了最新版Spring Cloud+Spring Boot 3+JDK17，今天就来介绍下mall-swarm项目做了哪些升级，包括依赖的升级、框架的用法升级以及运行部署的改动，希望对大家有所帮助！

mall-swarm项目简介
--------------

这里还是简单介绍下mall-swarm项目吧，mall-swarm项目（11k+star）是一套微服务商城系统，采用了Spring Cloud Alibaba、Spring Boot 3.2、JDK17、Kubernetes等核心技术，同时提供了基于Vue的管理后台方便快速搭建系统。mall-swarm在电商业务的基础集成了注册中心、配置中心、监控中心、网关等系统功能。

*   Github地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-swarm "https://github.com/macrozheng/mall-swarm")
*   Gitee地址：[gitee.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fmacrozheng%2Fmall-swarm "https://gitee.com/macrozheng/mall-swarm")
*   文档网站：[cloud.macrozheng.com](https://link.juejin.cn?target=https%3A%2F%2Fcloud.macrozheng.com "https://cloud.macrozheng.com")

### 后台管理系统演示

> 后台管理系统演示地址：[www.macrozheng.com/admin/index…](https://link.juejin.cn?target=https%3A%2F%2Fwww.macrozheng.com%2Fadmin%2Findex.html "https://www.macrozheng.com/admin/index.html")

![](/images/jueJin/1209bf432cd84ff.png)

### 移动端商城演示

> 移动端商城演示地址（浏览器切换到手机模式体验更佳)：[www.macrozheng.com/app/](https://link.juejin.cn?target=https%3A%2F%2Fwww.macrozheng.com%2Fapp%2F "https://www.macrozheng.com/app/")

![](/images/jueJin/7c4014e6068e418.png)

系统架构
----

mall-swarm采用目前`主流的微服务技术栈`实现，涵盖了一般项目中几乎所有使用的技术。同时项目业务完整，包括前台商城和后台管理系统，能支持完整订单流程，通过下面这张架构图，大家应该能对mall-swarm项目的架构有所了解了。

![](/images/jueJin/f227bf5190f74ea.png)

升级版本
----

目前项目中的依赖都已经升级到了最新主流版本，具体的版本可以参考下表。

框架

版本

说明

Spring Cloud

2021.0.3->2023.0.1

微服务框架

Spring Cloud Alibaba

2021.0.1.0->2023.0.1.0

微服务框架

Spring Boot

2.7.5->3.2.2

Java应用开发框架

Spring Boot Admin

2.7.5->3.2.2

微服务应用监控

Sa-Token

Spring Security Oauth2->Sa-Token

认证和授权框架

Nacos

2.1.0->2.3.0

微服务注册中心

MyBatis

3.5.10->3.5.14

ORM框架

MyBatisGenerator

1.4.1->1.4.2

数据层代码生成

PageHelper

5.3.2->6.1.0

MyBatis物理分页插件

Knife4j

3.0.3->4.5.0（SpringFox->SpringDoc）

文档生产工具

Druid

1.2.14->1.2.21

数据库连接池

Hutool

5.8.9->5.8.16

Java工具类库

升级用法
----

> 在mall-swarm项目升级Spring Boot 3的过程中，有些框架的用法有所改变，比如微服务权限解决方案改用了Sa-Token，微服务API文档聚合方案中的Knife4j实现改用了SpringDoc，商品搜索功能中使用了Spring Data Elasticsearch的新用法，这里我们将着重讲解这些升级的新用法！

### 微服务权限解决方案升级

> 由于之前使用的基于Spring Security Oauth2权限解决方案已经不再支持Spring Boot 3，这里改用了Sa-Token提供的微服务权限解决方案。

*   在mall-gateway网关服务上进行了比较大的改动，比如之前使用`AuthorizationManager`来实现动态权限，现在使用了`SaReactorFilter`来实现动态权限；

```java
/**
* @auther macrozheng
* @description Sa-Token相关配置
* @date 2023/11/28
* @github https://github.com/macrozheng
*/
@Configuration
    public class SaTokenConfig {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    /**
    * 注册Sa-Token全局过滤器
    */
    @Bean
        public SaReactorFilter getSaReactorFilter(IgnoreUrlsConfig ignoreUrlsConfig) {
        return new SaReactorFilter()
        // 拦截地址
        .addInclude("/**")
        // 配置白名单路径
        .setExcludeList(ignoreUrlsConfig.getUrls())
        // 鉴权方法：每次访问进入
            .setAuth(obj -> {
            // 对于OPTIONS预检请求直接放行
            SaRouter.match(SaHttpMethod.OPTIONS).stop();
            // 登录认证：商城前台会员认证
            SaRouter.match("/mall-portal/**", r -> StpMemberUtil.checkLogin()).stop();
            // 登录认证：管理后台用户认证
            SaRouter.match("/mall-admin/**", r -> StpUtil.checkLogin());
            // 权限认证：管理后台用户权限校验
            // 获取Redis中缓存的各个接口路径所需权限规则
            Map<Object, Object> pathResourceMap = redisTemplate.opsForHash().entries(AuthConstant.PATH_RESOURCE_MAP);
            // 获取到访问当前接口所需权限（一个路径对应多个资源时，拥有任意一个资源都可以访问该路径）
            List<String> needPermissionList = new ArrayList<>();
            // 获取当前请求路径
            String requestPath = SaHolder.getRequest().getRequestPath();
            // 创建路径匹配器
            PathMatcher pathMatcher = new AntPathMatcher();
            Set<Map.Entry<Object, Object>> entrySet = pathResourceMap.entrySet();
                for (Map.Entry<Object, Object> entry : entrySet) {
                String pattern = (String) entry.getKey();
                    if (pathMatcher.match(pattern, requestPath)) {
                    needPermissionList.add((String) entry.getValue());
                }
            }
            // 接口需要权限时鉴权
                if(CollUtil.isNotEmpty(needPermissionList)){
                SaRouter.match(requestPath, r -> StpUtil.checkPermissionOr(Convert.toStrArray(needPermissionList)));
            }
            })
            // setAuth方法异常处理
            .setError(this::handleException);
        }
    }
```

*   对于需要登录认证和权限的功能的应用模块，比如mall-admin和mall-portal模块，添加了Sa-Token整合Redis的依赖，从而实现了基于Redis的分布式Session，之后需要登录用户信息的时候就可以直接从Session中去获取了；

```xml
<!-- Sa-Token 整合 Redis (使用jackson序列化方式) -->
<dependency>
<groupId>cn.dev33</groupId>
<artifactId>sa-token-redis-jackson</artifactId>
<version>${sa-token.version}</version>
</dependency>
```

*   对于认证中心mall-auth模块，之前使用Spring Security Oauth2时的登录逻辑比较复杂，现在改成了直接远程调用拥有登录逻辑的模块实现登录，代码逻辑更加简洁了。

```java
/**
* @auther macrozheng
* @description 统一认证授权接口
* @date 2024/1/30
* @github https://github.com/macrozheng
*/
@Controller
@Tag(name = "AuthController", description = "统一认证授权接口")
@RequestMapping("/auth")
    public class AuthController {
    
    @Autowired
    private UmsAdminService adminService;
    
    @Autowired
    private UmsMemberService memberService;
    
    @Operation(summary = "登录以后返回token")
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public CommonResult login(@RequestParam String clientId,
    @RequestParam String username,
        @RequestParam String password) {
            if(AuthConstant.ADMIN_CLIENT_ID.equals(clientId)){
            UmsAdminLoginParam loginParam = new UmsAdminLoginParam();
            loginParam.setUsername(username);
            loginParam.setPassword(password);
            return adminService.login(loginParam);
                }else if(AuthConstant.PORTAL_CLIENT_ID.equals(clientId)){
                return memberService.login(username,password);
                    }else{
                    return CommonResult.failed("clientId不正确");
                }
            }
        }
```

### Knife4j微服务文档聚合方案升级

> Knife4j是一个基于Swagger的API文档增强解决方案，由于之前使用的Swagger库为SpringFox，目前已经不支持Spring Boot 3了，这里迁移到了SpringDoc。

*   迁移到SpringDoc后，Knife4j API文档的使用和之前基本一致，访问地址还是原来的：[http://localhost:8201/doc.html](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8201%2Fdoc.html "http://localhost:8201/doc.html")

![](/images/jueJin/b685b95b0425419.png)

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

*   由于Knife4j的实现改用了SpringDoc，有一点需要`特别注意`，添加认证请求头时，已经无需添加`Bearer` 前缀，SpringDoc会自动帮我们添加的。

![](/images/jueJin/db9a4788132a4f3.png)

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

### 其他

*   由于Java EE已经变更为Jakarta EE，包名以`javax`开头的需要改为`jakarta`，导包时需要注意；

![](/images/jueJin/3374b6cc79d34cf.png)

*   Spring Boot 3.2 版本会有Parameter Name Retention（不会根据参数名称去寻找对应name的Bean实例）问题，添加Maven编译插件参数解决：

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

运行部署
----

### Windows

由于Spring Boot 3最低要求是`JDK17`，我们在Windows下运行项目时需要配置好项目的JDK版本，其他操作和之前版本运行一样。

![](/images/jueJin/9275e55a45c8489.png)

### Linux

在打包应用的Docker镜像时，我们也需要配置项目使用`openjdk:17`，这里在项目根目录下的`pom.xml`中修改`docker-maven-plugin`插件配置即可。

![](/images/jueJin/e4143f56970d45c.png)

由于镜像使用了`openjdk:17`，我们在打包镜像之前还许提前下载好openjdk的镜像，使用如下命令即可，其他操作和之前版本部署一样。

```bash
docker pull openjdk:17
```

总结
--

今天主要讲解了mall-swarm项目升级Spring Boot 3版本的一些注意点，这里总结下：

*   项目中使用的框架版本升级到了最新主流版本；
*   微服务权限解决方案从Spring Security Oauth2迁移到了Sa-Token；
*   微服务器API文档聚合方案Knife4j的具体实现从SpringFox迁移到了SpringDoc；
*   商品搜索功能实现采用了Spring Data ES的新用法；
*   项目运行部署时需要使用JDK 17版本。

项目地址
----

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-swarm "https://github.com/macrozheng/mall-swarm")