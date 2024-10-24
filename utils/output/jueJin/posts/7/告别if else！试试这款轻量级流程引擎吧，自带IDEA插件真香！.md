---
author: "MacroZheng"
title: "告别if else！试试这款轻量级流程引擎吧，自带IDEA插件真香！"
date: 2022-09-27
description: "在我们平时做项目的时候，经常会遇到复杂的业务逻辑，如果使用if else来实现的话，往往会很冗长。今天给大家推荐一个轻量级流程引擎，可以优雅地实现复杂的业务逻辑！"
tags: ["Java","后端","Spring Boot中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:179,comments:0,collects:524,views:23219,"
---
> 在我们平时做项目的时候，经常会遇到复杂的业务逻辑，如果使用if else来实现的话，往往会很冗长，维护成本也很高。今天给大家推荐一个轻量级流程引擎`LiteFlow`，可以优雅地实现复杂的业务逻辑，本文将以电商项目中的订单价格计算为例来聊聊它的使用。

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

LiteFlow简介
----------

LiteFlow是一个轻量且强大的国产流程引擎框架，可用于复杂的组件化业务的编排工作。通过它我们可以把业务逻辑都定义到不同组件之中，然后使用简洁的规则文件来串联整个流程，从而实现复杂的业务逻辑。

LiteFlow主要特性如下：

*   组件定义统一：所有的逻辑都是组件，直接使用Spring原生注解`@Component`定义即可。
*   规则轻量：基于规则文件来编排流程，学习规则表达式入门仅需5分钟。
*   规则多样化：规则支持xml、json、yml三种规则文件写法，喜欢哪种用哪个。
*   任意编排：同步异步混编，再复杂的逻辑过程，都能轻易实现。
*   规则能从任意地方加载：框架中提供本地文件配置源和zk配置源的实现，也提供了扩展接口。
*   优雅热刷新机制：规则变化，无需重启应用，即时改变应用的规则。
*   支持广泛：同事支持SpringBoot，Spring或其他Java项目。

下面是使用LiteFlow来实现订单价格计算的展示页面，实现起来确实比较优雅！

![](/images/jueJin/743aa99f87d54a3.png)

IDEA插件
------

> LiteFlow还拥有自己的IDEA插件`LiteFlowX`，通过该插件能支持规则文件的智能提示、语法高亮、组件与规则文件之间的跳转及LiteFlow工具箱等功能，强烈建议大家安装下。

*   首先我们在IDEA的插件市场中安装该插件；

![](/images/jueJin/d3f8220b467a4dd.png)

*   安装好LiteFlowX插件后，我们代码中所定义的组件和规则文件都会显示特定的图标；

![](/images/jueJin/48d076980054499.png)

*   当我们编辑规则文件时，会提示我们已经定义好的组件，并支持从规则文件中跳转到组件；

![](/images/jueJin/e0e5b6702a0b49b.png)

*   还支持从右侧打开工具箱，快捷查看组件和规则文件。

![](/images/jueJin/91ee86a176aa4af.png)

规则表达式
-----

> 接下来我们学习下规则表达式，也就是规则文件的编写，入门表达式非常简单，但这对使用LiteFlow非常有帮助！

### 串行编排

当我们想要依次执行a、b、c、d四个组件时，直接使用`THEN`关键字即可。

```xml
<chain name="chain1">
THEN(a, b, c, d);
</chain>
```

### 并行编排

如果想并行执行a、b、c三个组件的话，可以使用`WHEN`关键字。

```xml
<chain name="chain1">
WHEN(a, b, c);
</chain>
```

### 选择编排

如果想实现代码中的switch逻辑的话，例如通过a组件的返回结果进行判断，如果返回的是组件名称b的话则执行b组件，可以使用`SWITCH`关键字。

```xml
<chain name="chain1">
SWITCH(a).to(b, c, d);
</chain>
```

### 条件编排

如果想实现代码中的if逻辑的话，例如当x组件返回为true时执行a，可以使用`IF`关键字。

```xml
<chain name="chain1">
IF(x, a);
</chain>
```

如果想实现if的三元运算符逻辑的话，例如x组件返回为true时执行a组件，返回为false时执行b组件，可以编写如下规则文件。

```xml
<chain name="chain1">
IF(x, a, b);
</chain>
```

如果想实现if else逻辑的话，可以使用`ELSE`关键字，和上面实现效果等价。

```xml
<chain name="chain1">
IF(x, a).ELSE(b);
</chain>
```

如果想实现else if逻辑的话，可以使用`ELIF`关键字。

```xml
<chain name="chain1">
IF(x1, a).ELIF(x2, b).ELSE(c);
</chain>
```

### 使用子流程

当某些流程比较复杂时，我们可以定义子流程，然后在主流程中引用，这样逻辑会比较清晰。

例如我们有如下子流程，执行C、D组件。

```xml
<chain name="subChain">
THEN(C, D);
</chain>
```

然后我们直接在主流程中引用子流程即可。

```xml
<chain name="mainChain">
THEN(
A, B,
subChain,
E
);
</chain>
```

使用
--

> 学习完规则表达式后，我们发现LiteFlow寥寥几个关键字，就可以实现复杂的流程了。下面我们将以订单价格计算为例，实践下LiteFlow这个流程引擎框架。

*   首先我们需要在项目中集成LiteFlow，这里以SpringBoot应用为例，在`pom.xml`中添加如下依赖即可；

```xml
<dependency>
<groupId>com.yomahub</groupId>
<artifactId>liteflow-spring-boot-starter</artifactId>
<version>2.8.5</version>
</dependency>
```

*   接下来修改配置文件`application.yml`，配置好LiteFlow的规则文件路径即可；

```yaml
server:
port: 8580
liteflow:
#规则文件路径
rule-source: liteflow/*.el.xml
```

*   这里直接使用LiteFlow官方的Demo，该案例为一个价格计算引擎，模拟了电商中对订单价格的计算，并提供了简单的界面，下载地址如下：

> [gitee.com/bryan31/lit…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fbryan31%2Fliteflow-example "https://gitee.com/bryan31/liteflow-example")

*   下载完成后，直接运行Demo，通过如下地址可以访问测试页面：[http://localhost:8580](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8580 "http://localhost:8580")

![](/images/jueJin/56b3fdde34dc40b.png)

*   这个案例通过传入的订单数据，能计算出订单的最终价格，这里涉及到会员折扣、促销优惠、优惠券抵扣、运费计算等操作，多达十几步，如果不使用流程引擎的话实现起来是非常复杂的，下面是订单价格计算中各组件执行流程图；

![](/images/jueJin/334e55084df1418.png)

*   接下来我们来聊聊如何使用LiteFlow来实现这个功能，首先我们需要定义好各个组件，普通组件需要继承`NodeComponent`并实现`process()`方法，比如这里的优惠券抵扣组件，还需设置`@Component`注解的名称，可以通过重写`isAccess`方法来决定是否执行该组件；

```java
/**
* 优惠券抵扣计算组件
*/
@Component("couponCmp")
    public class CouponCmp extends NodeComponent {
    @Override
        public void process() throws Exception {
        PriceContext context = this.getContextBean(PriceContext.class);
        
        /**这里Mock下根据couponId取到的优惠卷面值为15元**/
        Long couponId = context.getCouponId();
        BigDecimal couponPrice = new BigDecimal(15);
        
        BigDecimal prePrice = context.getLastestPriceStep().getCurrPrice();
        BigDecimal currPrice = prePrice.subtract(couponPrice);
        
        context.addPriceStep(new PriceStepVO(PriceTypeEnum.COUPON_DISCOUNT,
        couponId.toString(),
        prePrice,
        currPrice.subtract(prePrice),
        currPrice,
        PriceTypeEnum.COUPON_DISCOUNT.getName()));
    }
    
    @Override
        public boolean isAccess() {
        PriceContext context = this.getContextBean(PriceContext.class);
            if(context.getCouponId() != null){
            return true;
                }else{
                return false;
            }
        }
    }
```

*   还有一些比较特殊的组件，比如用于判断是按国内运费计算规则来计算还是境外规则的条件组件，需要继承`NodeSwitchComponent`并实现`processSwitch()`方法；

```java
/**
* 运费条件组件
*/
@Component("postageCondCmp")
    public class PostageCondCmp extends NodeSwitchComponent {
    @Override
        public String processSwitch() throws Exception {
        PriceContext context = this.getContextBean(PriceContext.class);
        //根据参数oversea来判断是否境外购，转到相应的组件
        boolean oversea = context.isOversea();
            if(oversea){
            return "overseaPostageCmp";
                }else{
                return "postageCmp";
            }
        }
    }
```

*   其他组件逻辑具体可以参考demo源码，定义好组件之后就可以通过规则文件将所有流程连接起来了，首先是促销优惠计算子流程；

```xml
<?xml version="1.0" encoding="UTF-8"?>
<flow>
<chain name="promotionChain">
THEN(fullCutCmp, fullDiscountCmp, rushBuyCmp);
</chain>
</flow>
```

*   然后是整个流程，大家可以对比下上面的流程图，基本能画出流程图的都可以用LiteFlow来实现；

```xml
<?xml version="1.0" encoding="UTF-8"?>
<flow>
<chain name="mainChain">
THEN(
checkCmp, slotInitCmp, priceStepInitCmp,
promotionConvertCmp, memberDiscountCmp,
promotionChain, couponCmp,
SWITCH(postageCondCmp).to(postageCmp, overseaPostageCmp),
priceResultCmp, stepPrintCmp
);
</chain>
</flow>
```

*   最后在Controller中添加接口，获取传入的订单数据，然后调用`FlowExecutor`类的执行方法即可；

```java
@Controller
    public class PriceExampleController {
    
    @Resource
    private FlowExecutor flowExecutor;
    
    @RequestMapping(value = "/submit", method = RequestMethod.POST)
    @ResponseBody
        public String submit(@Nullable @RequestBody String reqData) {
            try {
            PriceCalcReqVO req = JSON.parseObject(reqData, PriceCalcReqVO.class);
            LiteflowResponse response = flowExecutor.execute2Resp("mainChain", req, PriceContext.class);
            return response.getContextBean(PriceContext.class).getPrintLog();
                } catch (Throwable t) {
                t.printStackTrace();
                return "error";
            }
        }
    }
```

*   我们平时在写复杂代码时，后面一步经常会用到前面一步的结果，然而使用LiteFlow之后，组件里并没有参数传递，那么各个流程中参数是这么处理的？其实是LiteFlow中有个上下文的概念，流程中的所有数据都统一存放在此，比如上面的`PriceContext`类；

```java
    public class PriceContext {
    
    /**
    * 订单号
    */
    private String orderNo;
    
    /**
    * 是否境外购
    */
    private boolean oversea;
    
    /**
    * 商品包
    */
    private List<ProductPackVO> productPackList;
    
    /**
    * 订单渠道
    */
    private OrderChannelEnum orderChannel;
    
    /**
    * 会员CODE
    */
    private String memberCode;
    
    /**
    * 优惠券
    */
    private Long couponId;
    
    /**
    * 优惠信息
    */
    private List<PromotionPackVO> promotionPackList;
    
    /**
    * 价格步骤
    */
    private List<PriceStepVO> priceStepList = new ArrayList<>();
    
    /**
    * 订单原始价格
    */
    private BigDecimal originalOrderPrice;
    
    /**
    * 订单最终价格
    */
    private BigDecimal finalOrderPrice;
    
    /**
    * 步骤日志
    */
    private String printLog;
}
```

*   在初始化上下文的`slotInitCmp`组件中，我们早已从`getRequestData()`方法中获取到了请求的订单参数，然后设置到了`PriceContext`上下文中，流程中的其他参数和结果也存储在此了。

```java
/**
* Slot初始化组件
*/
@Component("slotInitCmp")
    public class SlotInitCmp extends NodeComponent {
    @Override
        public void process() throws Exception {
        //把主要参数冗余到slot里
        PriceCalcReqVO req = this.getRequestData();
        PriceContext context = this.getContextBean(PriceContext.class);
        context.setOrderNo(req.getOrderNo());
        context.setOversea(req.isOversea());
        context.setMemberCode(req.getMemberCode());
        context.setOrderChannel(req.getOrderChannel());
        context.setProductPackList(req.getProductPackList());
        context.setCouponId(req.getCouponId());
    }
    
    @Override
        public boolean isAccess() {
        PriceCalcReqVO req = this.getSlot().getRequestData();
            if(req != null){
            return true;
                }else{
                return false;
            }
        }
    }
```

总结
--

LiteFlow确实是一款好用的轻量级流程引擎，可以让复杂的业务逻辑变得清晰起来，便于代码维护。它的规则文件比起其他流程引擎来说，编写简单太多了，几分钟就能上手，感兴趣的朋友可以尝试下它！

参考资料
----

官网文档：[liteflow.yomahub.com/](https://link.juejin.cn?target=https%3A%2F%2Fliteflow.yomahub.com%2F "https://liteflow.yomahub.com/")

项目源码地址
------

[gitee.com/dromara/lit…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fdromara%2FliteFlow "https://gitee.com/dromara/liteFlow")