---
author: "MacroZheng"
title: "还在用 RedisTemplate？试试 Redis 官方 ORM 框架吧，用起来够优雅！"
date: 2022-03-17
description: "对比Spring Data对MongoDB和ES的支持，使用Template的方式确实不够优雅！最近发现Redis官方新推出了Redis的专属ORM框架`RedisOM`，用起来够优雅，推荐给大家！"
tags: ["后端","Redis","Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:127,comments:22,collects:340,views:19782,"
---
> 之前在SpringBoot项目中，我一直使用RedisTemplate来操作Redis中的数据，这也是Spring官方支持的方式。对比Spring Data对MongoDB和ES的支持，这种使用Template的方式确实不够优雅！最近发现Redis官方新推出了Redis的专属ORM框架`RedisOM`，用起来够优雅，推荐给大家！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

RedisOM简介
---------

RedisOM是Redis官方推出的ORM框架，是对Spring Data Redis的扩展。由于Redis目前已经支持原生JSON对象的存储，之前使用RedisTemplate直接用字符串来存储JOSN对象的方式明显不够优雅。通过RedisOM我们不仅能够以对象的形式来操作Redis中的数据，而且可以实现搜索功能！

JDK 11安装
--------

> 由于目前RedisOM仅支持`JDK 11`以上版本，我们在使用前得先安装好它。

*   首先下载`JDK 11`，这里推荐去`清华大学开源软件镜像站`下载，下载地址：[mirrors.tuna.tsinghua.edu.cn/AdoptOpenJD…](https://link.juejin.cn?target=https%3A%2F%2Fmirrors.tuna.tsinghua.edu.cn%2FAdoptOpenJDK%2F11%2Fjdk%2Fx64%2F "https://mirrors.tuna.tsinghua.edu.cn/AdoptOpenJDK/11/jdk/x64/")

![](/images/jueJin/e40019dd110e484.png)

*   下载压缩包版本即可，下载完成后解压到指定目录；

![](/images/jueJin/fdac00cc6f6c47d.png)

*   然后在IDEA的项目配置中，将对应模块的JDK依赖版本设置为`JDK 11`即可。

![](/images/jueJin/b89be8c7f67b4f1.png)

使用
--

> 接下来我们以管理存储在Redis中的商品信息为例，实现商品搜索功能。注意安装Redis的完全体版本`RedisMod`，具体可以参考[RediSearch 使用教程](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FyP5vRyLXFHlduJ5N6SmBSQ "https://mp.weixin.qq.com/s/yP5vRyLXFHlduJ5N6SmBSQ") 。

*   首先在`pom.xml`中添加RedisOM相关依赖；

```xml
<!--Redis OM 相关依赖-->
<dependency>
<groupId>com.redis.om</groupId>
<artifactId>redis-om-spring</artifactId>
<version>0.3.0-SNAPSHOT</version>
</dependency>
```

*   由于RedisOM目前只有快照版本，还需添加快照仓库；

```xml
<repositories>
<repository>
<id>snapshots-repo</id>
<url>https://s01.oss.sonatype.org/content/repositories/snapshots/</url>
</repository>
</repositories>
```

*   然后在配置文件`application.yml`中添加Redis连接配置；

```yaml
spring:
redis:
host: 192.168.3.105 # Redis服务器地址
database: 0 # Redis数据库索引（默认为0）
port: 6379 # Redis服务器连接端口
password: # Redis服务器连接密码（默认为空）
timeout: 3000ms # 连接超时时间
```

*   之后在启动类上添加`@EnableRedisDocumentRepositories`注解启用RedisOM的文档仓库功能，并配置好文档仓库所在路径；

```java
@SpringBootApplication
@EnableRedisDocumentRepositories(basePackages = "com.macro.mall.tiny.*")
    public class MallTinyApplication {
    
        public static void main(String[] args) {
        SpringApplication.run(MallTinyApplication.class, args);
    }
    
}
```

*   然后创建商品的文档对象，使用`@Document`注解标识其为文档对象，由于我们的搜索信息中包含中文，我们需要设置语言为`chinese`；

```java
/**
* 商品实体类
* Created by macro on 2021/10/12.
*/
@Data
@EqualsAndHashCode(callSuper = false)
@Document(language = "chinese")
    public class Product {
    @Id
    private Long id;
    @Indexed
    private String productSn;
    @Searchable
    private String name;
    @Searchable
    private String subTitle;
    @Indexed
    private String brandName;
    @Indexed
    private Integer price;
    @Indexed
    private Integer count;
}
```

*   分别介绍下代码中几个注解的作用；
    *   `@Id`：声明主键，RedisOM将会通过`全类名:ID`这样的键来存储数据；
    *   `@Indexed`：声明索引，通常用在非文本类型上；
    *   `@Searchable`：声明可以搜索的索引，通常用在文本类型上。
*   接下来创建一个文档仓库接口，继承`RedisDocumentRepository`接口；

```java
/**
* 商品管理Repository
* Created by macro on 2022/3/1.
*/
    public interface ProductRepository extends RedisDocumentRepository<Product, Long> {
}
```

*   创建测试用的Controller，通过`Repository`实现对Redis中数据的创建、删除、查询及分页功能；

```java
/**
* 使用Redis OM管理商品
* Created by macro on 2022/3/1.
*/
@RestController
@Api(tags = "ProductController", description = "使用Redis OM管理商品")
@RequestMapping("/product")
    public class ProductController {
    
    @Autowired
    private ProductRepository productRepository;
    
    @ApiOperation("导入商品")
    @PostMapping("/import")
        public CommonResult importList() {
        productRepository.deleteAll();
        List<Product> productList = LocalJsonUtil.getListFromJson("json/products.json", Product.class);
            for (Product product : productList) {
            productRepository.save(product);
        }
        return CommonResult.success(null);
    }
    
    @ApiOperation("创建商品")
    @PostMapping("/create")
        public CommonResult create(@RequestBody Product entity) {
        productRepository.save(entity);
        return CommonResult.success(null);
    }
    
    @ApiOperation("删除")
    @PostMapping("/delete/{id}")
        public CommonResult delete(@PathVariable Long id) {
        productRepository.deleteById(id);
        return CommonResult.success(null);
    }
    
    @ApiOperation("查询单个")
    @GetMapping("/detail/{id}")
        public CommonResult<Product> detail(@PathVariable Long id) {
        Optional<Product> result = productRepository.findById(id);
        return CommonResult.success(result.orElse(null));
    }
    
    @ApiOperation("分页查询")
    @GetMapping("/page")
    public CommonResult<List<Product>> page(@RequestParam(defaultValue = "1") Integer pageNum,
        @RequestParam(defaultValue = "5") Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNum - 1, pageSize);
        Page<Product> pageResult = productRepository.findAll(pageable);
        return CommonResult.success(pageResult.getContent());
    }
    
}
```

*   当我们启动项目时，可以发现RedisOM会自动为文档建立索引；

![](/images/jueJin/e4fbae9aa3ac4b5.png)

*   接下来我们访问Swagger进行测试，先使用`导入商品`接口导入数据，访问地址：[http://localhost:8088/swagger-ui/](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8088%2Fswagger-ui%2F "http://localhost:8088/swagger-ui/")

![](/images/jueJin/e851eb97185d494.png)

*   导入成功后我们可以发现RedisOM已经向Redis中插入了原生JSON数据，以`全类名:ID`的形式命名了键，同时将全部的ID存储到了一个SET集合中去了；

![](/images/jueJin/622975b52454405.png)

*   我们可以通过ID来查询商品信息；

![](/images/jueJin/1fbd1bef488b414.png)

*   当然RedisOM也是支持衍生查询的，通过我们创建的方法名称就可以自动实现查询逻辑，比如根据品牌名称查询商品，根据名称和副标题关键字来搜索商品；

```java
/**
* 商品管理Repository
* Created by macro on 2022/3/1.
*/
    public interface ProductRepository extends RedisDocumentRepository<Product, Long> {
    /**
    * 根据品牌名称查询
    */
    List<Product> findByBrandName(String brandName);
    
    /**
    * 根据名称或副标题搜索
    */
    List<Product> findByNameOrSubTitle(String name, String subTitle);
}
```

*   在Controller中可以添加如下接口进行测试；

```java
/**
* 使用Redis OM管理商品
* Created by macro on 2022/3/1.
*/
@RestController
@Api(tags = "ProductController", description = "使用Redis OM管理商品")
@RequestMapping("/product")
    public class ProductController {
    
    @Autowired
    private ProductRepository productRepository;
    
    @ApiOperation("根据品牌查询")
    @GetMapping("/getByBrandName")
        public CommonResult<List<Product>> getByBrandName(String brandName) {
        List<Product> resultList = productRepository.findByBrandName(brandName);
        return CommonResult.success(resultList);
    }
    
    @ApiOperation("根据名称或副标题搜索")
    @GetMapping("/search")
        public CommonResult<List<Product>> search(String keyword) {
        List<Product> resultList = productRepository.findByNameOrSubTitle(keyword, keyword);
        return CommonResult.success(resultList);
    }
    
}
```

*   我们可以通过品牌名称来查询商品；

![](/images/jueJin/ee7e12bb331943e.png)

*   也可以通过关键字来搜索商品；

![](/images/jueJin/146f5b97d2824b3.png)

*   这类根据方法名称自动实现查询逻辑的衍生查询有什么规则呢，具体可以参考下表。

![](/images/jueJin/974f2aa95425475.png)

总结
--

今天体验了一把RedisOM，用起来确实够优雅，和使用Spring Data来操作MongoDB和ES的方式差不多。不过目前RedisOM只发布了快照版本，期待Release版本的发布，而且Release版本据说会支持`JDK 8`的！

如果你想了解更多Redis实战技巧的话，可以试试这个带全套教程的实战项目（50K+Star）：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

参考资料
----

*   项目地址：[github.com/redis/redis…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fredis%2Fredis-om-spring "https://github.com/redis/redis-om-spring")
*   官方文档：[developer.redis.com/develop/jav…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.redis.com%2Fdevelop%2Fjava%2Fspring%2Fredis-om%2Fredis-om-spring-json "https://developer.redis.com/develop/java/spring/redis-om/redis-om-spring-json")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-redis-om "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-redis-om")