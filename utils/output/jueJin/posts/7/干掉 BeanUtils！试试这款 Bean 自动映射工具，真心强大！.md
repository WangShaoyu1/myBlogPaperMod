---
author: "MacroZheng"
title: "干掉 BeanUtils！试试这款 Bean 自动映射工具，真心强大！"
date: 2021-11-03
description: "平时做项目的时候，经常需要做PO、VO、DTO之间的转换。告别手写Getter、Setter方法，今天给大家推荐一款对象自动映射工具，功能真心强大！"
tags: ["Java","Spring Boot中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:120,comments:0,collects:242,views:12263,"
---
> 平时做项目的时候，经常需要做PO、VO、DTO之间的转换。简单的对象转换，使用BeanUtils基本上是够了，但是复杂的转换，如果使用它的话又得写一堆Getter、Setter方法了。今天给大家推荐一款对象自动映射工具`MapStruct`，功能真心强大！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

关于BeanUtils
-----------

平时我经常使用Hutool中的BeanUtil类来实现对象转换，用多了之后就发现有些缺点：

*   对象属性映射使用反射来实现，性能比较低；
*   对于不同名称或不同类型的属性无法转换，还得单独写Getter、Setter方法；
*   对于嵌套的子对象也需要转换的情况，也得自行处理；
*   集合对象转换时，得使用循环，一个个拷贝。

对于这些不足，MapStruct都能解决，不愧为一款功能强大的对象映射工具！

MapStruct简介
-----------

MapStruct是一款基于Java注解的对象属性映射工具，在Github上已经有4.5K+Star。使用的时候我们只要在接口中定义好对象属性映射规则，它就能自动生成映射实现类，不使用反射，性能优秀，能实现各种复杂映射。

IDEA插件支持
--------

> 作为一款非常流行的对象映射工具，MapStruct还提供了专门的IDEA插件，我们在使用之前可以先安装好插件。

![](/images/jueJin/0bcd4afa8a7a40d.png)

项目集成
----

> 在SpingBoot中集成MapStruct非常简单，仅续添加如下两个依赖即可，这里使用的是`1.4.2.Final`版本。

```xml
<dependency>
<!--MapStruct相关依赖-->
<dependency>
<groupId>org.mapstruct</groupId>
<artifactId>mapstruct</artifactId>
<version>${mapstruct.version}</version>
</dependency>
<dependency>
<groupId>org.mapstruct</groupId>
<artifactId>mapstruct-processor</artifactId>
<version>${mapstruct.version}</version>
<scope>compile</scope>
</dependency>
</dependencies>
```

基本使用
----

> 集成完MapStruct之后，我们来体验下它的功能吧，看看它有何神奇之处！

### 基本映射

> 我们先来个快速入门，体验一下MapStruct的基本功能，并聊聊它的实现原理。

*   首先我们准备好要使用的会员PO对象`Member`；

```java
/**
* 购物会员
* Created by macro on 2021/10/12.
*/
@Data
@EqualsAndHashCode(callSuper = false)
    public class Member {
    private Long id;
    private String username;
    private String password;
    private String nickname;
    private Date birthday;
    private String phone;
    private String icon;
    private Integer gender;
}
```

*   然后再准备好会员的DTO对象`MemberDto`，我们需要将`Member`对象转换为`MemberDto`对象；

```java
/**
* 购物会员Dto
* Created by macro on 2021/10/12.
*/
@Data
@EqualsAndHashCode(callSuper = false)
    public class MemberDto {
    private Long id;
    private String username;
    private String password;
    private String nickname;
    //与PO类型不同的属性
    private String birthday;
    //与PO名称不同的属性
    private String phoneNumber;
    private String icon;
    private Integer gender;
}
```

*   然后创建一个映射接口`MemberMapper`，实现同名同类型属性、不同名称属性、不同类型属性的映射；

```java
/**
* 会员对象映射
* Created by macro on 2021/10/21.
*/
@Mapper
    public interface MemberMapper {
    MemberMapper INSTANCE = Mappers.getMapper(MemberMapper.class);
    
    @Mapping(source = "phone",target = "phoneNumber")
    @Mapping(source = "birthday",target = "birthday",dateFormat = "yyyy-MM-dd")
    MemberDto toDto(Member member);
}
```

*   接下来在Controller中创建测试接口，直接通过接口中的`INSTANCE`实例调用转换方法`toDto`；

```java
/**
* MapStruct对象转换测试Controller
* Created by macro on 2021/10/21.
*/
@RestController
@Api(tags = "MapStructController", description = "MapStruct对象转换测试")
@RequestMapping("/mapStruct")
    public class MapStructController {
    
    @ApiOperation(value = "基本映射")
    @GetMapping("/baseMapping")
        public CommonResult baseTest() {
        List<Member> memberList = LocalJsonUtil.getListFromJson("json/members.json", Member.class);
        MemberDto memberDto = MemberMapper.INSTANCE.toDto(memberList.get(0));
        return CommonResult.success(memberDto);
    }
}
```

*   运行项目后在Swagger中测试接口，发现PO所有属性已经成功转换到DTO中去了，Swagger访问地址：[http://localhost:8088/swagger-ui](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8088%2Fswagger-ui "http://localhost:8088/swagger-ui")

![](/images/jueJin/23bd9c0e698b4a5.png)

*   其实MapStruct的实现原理很简单，就是根据我们在Mapper接口中使用的`@Mapper`和`@Mapping`等注解，在运行时生成接口的实现类，我们可以打开项目的`target`目录看下；

![](/images/jueJin/6d300f2460e247a.png)

*   下面是MapStruct为`MemberMapper`生成好的对象映射代码，可以和手写Getter、Setter说再见了！

```java
    public class MemberMapperImpl implements MemberMapper {
        public MemberMapperImpl() {
    }
    
        public MemberDto toDto(Member member) {
            if (member == null) {
            return null;
                } else {
                MemberDto memberDto = new MemberDto();
                memberDto.setPhoneNumber(member.getPhone());
                    if (member.getBirthday() != null) {
                    memberDto.setBirthday((new SimpleDateFormat("yyyy-MM-dd")).format(member.getBirthday()));
                }
                
                memberDto.setId(member.getId());
                memberDto.setUsername(member.getUsername());
                memberDto.setPassword(member.getPassword());
                memberDto.setNickname(member.getNickname());
                memberDto.setIcon(member.getIcon());
                memberDto.setGender(member.getGender());
                return memberDto;
            }
        }
    }
```

### 集合映射

> MapStruct也提供了集合映射的功能，可以直接将一个PO列表转换为一个DTO列表，再也不用一个个对象转换了！

*   在`MemberMapper`接口中添加`toDtoList`方法用于列表转换；

```java
/**
* 会员对象映射
* Created by macro on 2021/10/21.
*/
@Mapper
    public interface MemberMapper {
    MemberMapper INSTANCE = Mappers.getMapper(MemberMapper.class);
    
    @Mapping(source = "phone",target = "phoneNumber")
    @Mapping(source = "birthday",target = "birthday",dateFormat = "yyyy-MM-dd")
    List<MemberDto> toDtoList(List<Member> list);
}
```

*   在Controller中创建测试接口，直接通过Mapper接口中的`INSTANCE`实例调用转换方法`toDtoList`；

```java
/**
* MapStruct对象转换测试Controller
* Created by macro on 2021/10/21.
*/
@RestController
@Api(tags = "MapStructController", description = "MapStruct对象转换测试")
@RequestMapping("/mapStruct")
    public class MapStructController {
    
    @ApiOperation(value = "集合映射")
    @GetMapping("/collectionMapping")
        public CommonResult collectionMapping() {
        List<Member> memberList = LocalJsonUtil.getListFromJson("json/members.json", Member.class);
        List<MemberDto> memberDtoList = MemberMapper.INSTANCE.toDtoList(memberList);
        return CommonResult.success(memberDtoList);
    }
}
```

*   在Swagger中调用接口测试下，PO列表已经转换为DTO列表了。

![](/images/jueJin/3485805849ed4ca.png)

### 子对象映射

> MapStruct对于对象中包含子对象也需要转换的情况也是有所支持的。

*   例如我们有一个订单PO对象`Order`，嵌套有`Member`和`Product`对象；

```java
/**
* 订单
* Created by macro on 2021/10/12.
*/
@Data
@EqualsAndHashCode(callSuper = false)
    public class Order {
    private Long id;
    private String orderSn;
    private Date createTime;
    private String receiverAddress;
    private Member member;
    private List<Product> productList;
}
```

*   我们需要转换为`OrderDto`对象，`OrderDto`中包含`MemberDto`和`ProductDto`两个子对象同样需要转换；

```java
/**
* 订单Dto
* Created by macro on 2021/10/12.
*/
@Data
@EqualsAndHashCode(callSuper = false)
    public class OrderDto {
    private Long id;
    private String orderSn;
    private Date createTime;
    private String receiverAddress;
    //子对象映射Dto
    private MemberDto memberDto;
    //子对象数组映射Dto
    private List<ProductDto> productDtoList;
}
```

*   我们只需要创建一个Mapper接口，然后通过使用`uses`将子对象的转换Mapper注入进来，然后通过`@Mapping`设置好属性映射规则即可；

```java
/**
* 订单对象映射
* Created by macro on 2021/10/21.
*/
@Mapper(uses = {MemberMapper.class,ProductMapper.class})
    public interface OrderMapper {
    OrderMapper INSTANCE = Mappers.getMapper(OrderMapper.class);
    
    @Mapping(source = "member",target = "memberDto")
    @Mapping(source = "productList",target = "productDtoList")
    OrderDto toDto(Order order);
}
```

*   接下来在Controller中创建测试接口，直接通过Mapper中的`INSTANCE`实例调用转换方法`toDto`；

```java
/**
* MapStruct对象转换测试Controller
* Created by macro on 2021/10/21.
*/
@RestController
@Api(tags = "MapStructController", description = "MapStruct对象转换测试")
@RequestMapping("/mapStruct")
    public class MapStructController {
    
    @ApiOperation(value = "子对象映射")
    @GetMapping("/subMapping")
        public CommonResult subMapping() {
        List<Order> orderList = getOrderList();
        OrderDto orderDto = OrderMapper.INSTANCE.toDto(orderList.get(0));
        return CommonResult.success(orderDto);
    }
}
```

*   在Swagger中调用接口测试下，可以发现子对象属性已经被转换了。

![](/images/jueJin/69697a47a2f14e2.png)

### 合并映射

> MapStruct也支持把多个对象属性映射到一个对象中去。

*   例如这里把`Member`和`Order`的部分属性映射到`MemberOrderDto`中去；

```java
/**
* 会员商品信息组合Dto
* Created by macro on 2021/10/21.
*/
@Data
@EqualsAndHashCode(callSuper = false)
    public class MemberOrderDto extends MemberDto{
    private String orderSn;
    private String receiverAddress;
}
```

*   然后在Mapper中添加`toMemberOrderDto`方法，这里需要注意的是由于参数中具有两个属性，需要通过`参数名称.属性`的名称来指定`source`来防止冲突（这两个参数中都有id属性）;

```java
/**
* 会员对象映射
* Created by macro on 2021/10/21.
*/
@Mapper
    public interface MemberMapper {
    MemberMapper INSTANCE = Mappers.getMapper(MemberMapper.class);
    
    @Mapping(source = "member.phone",target = "phoneNumber")
    @Mapping(source = "member.birthday",target = "birthday",dateFormat = "yyyy-MM-dd")
    @Mapping(source = "member.id",target = "id")
    @Mapping(source = "order.orderSn", target = "orderSn")
    @Mapping(source = "order.receiverAddress", target = "receiverAddress")
    MemberOrderDto toMemberOrderDto(Member member, Order order);
}
```

*   接下来在Controller中创建测试接口，直接通过Mapper中的`INSTANCE`实例调用转换方法`toMemberOrderDto`；

```java
/**
* MapStruct对象转换测试Controller
* Created by macro on 2021/10/21.
*/
@RestController
@Api(tags = "MapStructController", description = "MapStruct对象转换测试")
@RequestMapping("/mapStruct")
    public class MapStructController {
    
    @ApiOperation(value = "组合映射")
    @GetMapping("/compositeMapping")
        public CommonResult compositeMapping() {
        List<Order> orderList = LocalJsonUtil.getListFromJson("json/orders.json", Order.class);
        List<Member> memberList = LocalJsonUtil.getListFromJson("json/members.json", Member.class);
        Member member = memberList.get(0);
        Order order = orderList.get(0);
        MemberOrderDto memberOrderDto = MemberMapper.INSTANCE.toMemberOrderDto(member,order);
        return CommonResult.success(memberOrderDto);
    }
}
```

*   在Swagger中调用接口测试下，可以发现Member和Order中的属性已经被映射到MemberOrderDto中去了。

![](/images/jueJin/1257ee1c4144453.png)

进阶使用
----

> 通过上面的基本使用，大家已经可以玩转MapStruct了，下面我们再来介绍一些进阶的用法。

### 使用依赖注入

> 上面我们都是通过Mapper接口中的INSTANCE实例来调用方法的，在Spring中我们也是可以使用依赖注入的。

*   想要使用依赖注入，我们只要将`@Mapper`注解的`componentModel`参数设置为`spring`即可，这样在生成接口实现类时，MapperStruct会为其添加`@Component`注解；

```java
/**
* 会员对象映射（依赖注入）
* Created by macro on 2021/10/21.
*/
@Mapper(componentModel = "spring")
    public interface MemberSpringMapper {
    @Mapping(source = "phone",target = "phoneNumber")
    @Mapping(source = "birthday",target = "birthday",dateFormat = "yyyy-MM-dd")
    MemberDto toDto(Member member);
}
```

*   接下来在Controller中使用`@Autowired`注解注入即可使用；

```java
/**
* MapStruct对象转换测试Controller
* Created by macro on 2021/10/21.
*/
@RestController
@Api(tags = "MapStructController", description = "MapStruct对象转换测试")
@RequestMapping("/mapStruct")
    public class MapStructController {
    
    @Autowired
    private MemberSpringMapper memberSpringMapper;
    
    @ApiOperation(value = "使用依赖注入")
    @GetMapping("/springMapping")
        public CommonResult springMapping() {
        List<Member> memberList = LocalJsonUtil.getListFromJson("json/members.json", Member.class);
        MemberDto memberDto = memberSpringMapper.toDto(memberList.get(0));
        return CommonResult.success(memberDto);
    }
}
```

*   在Swagger中调用接口测试下，可以发现与之前一样可以正常使用。

![](/images/jueJin/f160d96eb599476.png)

### 使用常量、默认值和表达式

> 使用MapStruct映射属性时，我们可以设置属性为常量或者默认值，也可以通过Java中的方法编写表达式来自动生成属性。

*   例如下面这个商品类Product对象；

```java
/**
* 商品
* Created by macro on 2021/10/12.
*/
@Data
@EqualsAndHashCode(callSuper = false)
    public class Product {
    private Long id;
    private String productSn;
    private String name;
    private String subTitle;
    private String brandName;
    private BigDecimal price;
    private Integer count;
    private Date createTime;
}
```

*   我们想把Product转换为ProductDto对象，`id`属性设置为常量，`count`设置默认值为1，`productSn`设置为UUID生成；

```java
/**
* 商品Dto
* Created by macro on 2021/10/12.
*/
@Data
@EqualsAndHashCode(callSuper = false)
    public class ProductDto {
    //使用常量
    private Long id;
    //使用表达式生成属性
    private String productSn;
    private String name;
    private String subTitle;
    private String brandName;
    private BigDecimal price;
    //使用默认值
    private Integer count;
    private Date createTime;
}
```

*   创建`ProductMapper`接口，通过`@Mapping`注解中的`constant`、`defaultValue`、`expression`设置好映射规则；

```java
/**
* 商品对象映射
* Created by macro on 2021/10/21.
*/
@Mapper(imports = {UUID.class})
    public interface ProductMapper {
    ProductMapper INSTANCE = Mappers.getMapper(ProductMapper.class);
    
    @Mapping(target = "id",constant = "-1L")
    @Mapping(source = "count",target = "count",defaultValue = "1")
    @Mapping(target = "productSn",expression = "java(UUID.randomUUID().toString())")
    ProductDto toDto(Product product);
}
```

*   接下来在Controller中创建测试接口，直接通过接口中的`INSTANCE`实例调用转换方法`toDto`；

```java
/**
* MapStruct对象转换测试Controller
* Created by macro on 2021/10/21.
*/
@RestController
@Api(tags = "MapStructController", description = "MapStruct对象转换测试")
@RequestMapping("/mapStruct")
    public class MapStructController {
    @ApiOperation(value = "使用常量、默认值和表达式")
    @GetMapping("/defaultMapping")
        public CommonResult defaultMapping() {
        List<Product> productList = LocalJsonUtil.getListFromJson("json/products.json", Product.class);
        Product product = productList.get(0);
        product.setId(100L);
        product.setCount(null);
        ProductDto productDto = ProductMapper.INSTANCE.toDto(product);
        return CommonResult.success(productDto);
    }
}
```

*   在Swagger中调用接口测试下，对象已经成功转换。

![](/images/jueJin/eb96ea8bcb8d4da.png)

### 在映射前后进行自定义处理

> MapStruct也支持在映射前后做一些自定义操作，类似AOP中的切面。

*   由于此时我们需要创建自定义处理方法，创建一个抽象类`ProductRoundMapper`，通过`@BeforeMapping`注解自定义映射前操作，通过`@AfterMapping`注解自定义映射后操作；

```java
/**
* 商品对象映射（自定义处理）
* Created by macro on 2021/10/21.
*/
@Mapper(imports = {UUID.class})
    public abstract class ProductRoundMapper {
    public static ProductRoundMapper INSTANCE = Mappers.getMapper(ProductRoundMapper.class);
    
    @Mapping(target = "id",constant = "-1L")
    @Mapping(source = "count",target = "count",defaultValue = "1")
    @Mapping(target = "productSn",expression = "java(UUID.randomUUID().toString())")
    public abstract ProductDto toDto(Product product);
    
    @BeforeMapping
        public void beforeMapping(Product product){
        //映射前当price<0时设置为0
            if(product.getPrice().compareTo(BigDecimal.ZERO)<0){
            product.setPrice(BigDecimal.ZERO);
        }
    }
    
    @AfterMapping
        public void afterMapping(@MappingTarget ProductDto productDto){
        //映射后设置当前时间为createTime
        productDto.setCreateTime(new Date());
    }
}
```

*   接下来在Controller中创建测试接口，直接通过Mapper中的`INSTANCE`实例调用转换方法`toDto`；

```java
/**
* MapStruct对象转换测试Controller
* Created by macro on 2021/10/21.
*/
@RestController
@Api(tags = "MapStructController", description = "MapStruct对象转换测试")
@RequestMapping("/mapStruct")
    public class MapStructController {
    
    @ApiOperation(value = "在映射前后进行自定义处理")
    @GetMapping("/customRoundMapping")
        public CommonResult customRoundMapping() {
        List<Product> productList = LocalJsonUtil.getListFromJson("json/products.json", Product.class);
        Product product = productList.get(0);
        product.setPrice(new BigDecimal(-1));
        ProductDto productDto = ProductRoundMapper.INSTANCE.toDto(product);
        return CommonResult.success(productDto);
    }
}
```

*   在Swagger中调用接口测试下，可以发现已经应用了自定义操作。

![](/images/jueJin/c0e758f910f8400.png)

### 处理映射异常

> 代码运行难免会出现异常，MapStruct也支持处理映射异常。

*   我们需要先创建一个自定义异常类；

```java
/**
* 商品验证异常类
* Created by macro on 2021/10/22.
*/
    public class ProductValidatorException extends Exception{
        public ProductValidatorException(String message) {
        super(message);
    }
}
```

*   然后创建一个验证类，当`price`设置`小于0`时抛出我们自定义的异常；

```java
/**
* 商品验证异常处理器
* Created by macro on 2021/10/22.
*/
    public class ProductValidator {
        public BigDecimal validatePrice(BigDecimal price) throws ProductValidatorException {
            if(price.compareTo(BigDecimal.ZERO)<0){
            throw new ProductValidatorException("价格不能小于0！");
        }
        return price;
    }
}
```

*   之后我们通过`@Mapper`注解的`uses`属性运用验证类；

```java
/**
* 商品对象映射（处理映射异常）
* Created by macro on 2021/10/21.
*/
@Mapper(uses = {ProductValidator.class},imports = {UUID.class})
    public interface ProductExceptionMapper {
    ProductExceptionMapper INSTANCE = Mappers.getMapper(ProductExceptionMapper.class);
    
    @Mapping(target = "id",constant = "-1L")
    @Mapping(source = "count",target = "count",defaultValue = "1")
    @Mapping(target = "productSn",expression = "java(UUID.randomUUID().toString())")
    ProductDto toDto(Product product) throws ProductValidatorException;
}
```

*   然后在Controller中添加测试接口，设置`price`为`-1`，此时在进行映射时会抛出异常；

```java
/**
* MapStruct对象转换测试Controller
* Created by macro on 2021/10/21.
*/
@RestController
@Api(tags = "MapStructController", description = "MapStruct对象转换测试")
@RequestMapping("/mapStruct")
    public class MapStructController {
    @ApiOperation(value = "处理映射异常")
    @GetMapping("/exceptionMapping")
        public CommonResult exceptionMapping() {
        List<Product> productList = LocalJsonUtil.getListFromJson("json/products.json", Product.class);
        Product product = productList.get(0);
        product.setPrice(new BigDecimal(-1));
        ProductDto productDto = null;
            try {
            productDto = ProductExceptionMapper.INSTANCE.toDto(product);
                } catch (ProductValidatorException e) {
                e.printStackTrace();
            }
            return CommonResult.success(productDto);
        }
    }
```

*   在Swagger中调用接口测试下，发现运行日志中已经打印了自定义异常信息。

![](/images/jueJin/4b75038b4749408.png)

总结
--

通过上面对MapStruct的使用体验，我们可以发现MapStruct远比BeanUtils要强大。当我们想实现比较复杂的对象映射时，通过它可以省去写Getter、Setter方法的过程。 当然上面只是介绍了MapStruct的一些常用功能，它的功能远不止于此，感兴趣的朋友可以查看下官方文档。

参考资料
----

官方文档：[mapstruct.org/documentati…](https://link.juejin.cn?target=https%3A%2F%2Fmapstruct.org%2Fdocumentation%2Fstable%2Freference%2Fhtml "https://mapstruct.org/documentation/stable/reference/html")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-mapstruct "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-mapstruct")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！