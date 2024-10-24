---
author: "MacroZheng"
title: "SpringBoot实现Excel导入导出，好用到爆，POI可以扔掉了！"
date: 2021-10-26
description: "在我们平时工作中经常会遇到要操作Excel的功能，比如导出个用户信息或者订单信息的Excel报表。今天给大家推荐一款非常好用的Excel导入导出工具，希望对大家有所帮助！"
tags: ["Java","Spring Boot中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:157,comments:33,collects:386,views:21096,"
---
> 在我们平时工作中经常会遇到要操作Excel的功能，比如导出个用户信息或者订单信息的Excel报表。你肯定听说过POI这个东西，可以实现。但是POI实现的API确实很麻烦，它需要写那种逐行解析的代码（类似Xml解析）。今天给大家推荐一款非常好用的Excel导入导出工具EasyPoi，希望对大家有所帮助！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

EasyPoi简介
---------

用惯了SpringBoot的朋友估计会想到，有没有什么办法可以直接定义好需要导出的数据对象，然后添加几个注解，直接自动实现Excel导入导出功能？

EasyPoi正是这么一款工具，如果你不太熟悉POI，想简单地实现Excel操作，用它就对了！

EasyPoi的目标不是替代POI，而是让一个不懂导入导出的人也能快速使用POI完成Excel的各种操作，而不是看很多API才可以完成这样的工作。

集成
--

> 在SpringBoot中集成EasyPoi非常简单，只需添加如下一个依赖即可，真正的开箱即用！

```xml
<dependency>
<groupId>cn.afterturn</groupId>
<artifactId>easypoi-spring-boot-starter</artifactId>
<version>4.4.0</version>
</dependency>
```

使用
--

> 接下来介绍下EasyPoi的使用，以会员信息和订单信息的导入导出为例，分别实现下简单的单表导出和具有关联信息的复杂导出。

### 简单导出

> 我们以会员信息列表导出为例，使用EasyPoi来实现下导出功能，看看是不是够简单！

*   首先创建一个会员对象`Member`，封装会员信息；

```java
/**
* 购物会员
* Created by macro on 2021/10/12.
*/
@Data
@EqualsAndHashCode(callSuper = false)
    public class Member {
    @Excel(name = "ID", width = 10)
    private Long id;
    @Excel(name = "用户名", width = 20, needMerge = true)
    private String username;
    private String password;
    @Excel(name = "昵称", width = 20, needMerge = true)
    private String nickname;
    @Excel(name = "出生日期", width = 20, format = "yyyy-MM-dd")
    private Date birthday;
    @Excel(name = "手机号", width = 20, needMerge = true, desensitizationRule = "3_4")
    private String phone;
    private String icon;
    @Excel(name = "性别", width = 10, replace = {"男_0", "女_1"})
    private Integer gender;
}
```

*   在此我们就可以看到EasyPoi的核心注解`@Excel`，通过在对象上添加`@Excel`注解，可以将对象信息直接导出到Excel中去，下面对注解中的属性做个介绍；
    *   name：Excel中的列名；
    *   width：指定列的宽度；
    *   needMerge：是否需要纵向合并单元格；
    *   format：当属性为时间类型时，设置时间的导出导出格式；
    *   desensitizationRule：数据脱敏处理，`3_4`表示只显示字符串的前`3`位和后`4`位，其他为`*`号；
    *   replace：对属性进行替换；
    *   suffix：对数据添加后缀。
*   接下来我们在Controller中添加一个接口，用于导出会员列表到Excel，具体代码如下；

```java
/**
* EasyPoi导入导出测试Controller
* Created by macro on 2021/10/12.
*/
@Controller
@Api(tags = "EasyPoiController", description = "EasyPoi导入导出测试")
@RequestMapping("/easyPoi")
    public class EasyPoiController {
    
    @ApiOperation(value = "导出会员列表Excel")
    @RequestMapping(value = "/exportMemberList", method = RequestMethod.GET)
    public void exportMemberList(ModelMap map,
    HttpServletRequest request,
        HttpServletResponse response) {
        List<Member> memberList = LocalJsonUtil.getListFromJson("json/members.json", Member.class);
        ExportParams params = new ExportParams("会员列表", "会员列表", ExcelType.XSSF);
        map.put(NormalExcelConstants.DATA_LIST, memberList);
        map.put(NormalExcelConstants.CLASS, Member.class);
        map.put(NormalExcelConstants.PARAMS, params);
        map.put(NormalExcelConstants.FILE_NAME, "memberList");
        PoiBaseView.render(map, request, response, NormalExcelConstants.EASYPOI_EXCEL_VIEW);
    }
}
```

*   LocalJsonUtil工具类，可以直接从resources目录下获取JSON数据并转化为对象，例如此处使用的`members.json`；

![](/images/jueJin/ba3d1f0cfff34cc.png)

*   运行项目，直接通过Swagger访问接口，注意在Swagger中访问接口无法直接下载，需要点击返回结果中的下载按钮才行，访问地址：[http://localhost:8088/swagger-ui/](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8088%2Fswagger-ui%2F "http://localhost:8088/swagger-ui/")

![](/images/jueJin/1655e383c6f14a3.png)

*   下载完成后，查看下文件，一个标准的Excel文件已经被导出了。

![](/images/jueJin/ece78ff1b3254f8.png)

### 简单导入

> 导入功能实现起来也非常简单，下面以会员信息列表的导入为例。

*   在Controller中添加会员信息导入的接口，这里需要注意的是使用`@RequestPart`注解修饰文件上传参数，否则在Swagger中就没法显示上传按钮了；

```java
/**
* EasyPoi导入导出测试Controller
* Created by macro on 2021/10/12.
*/
@Controller
@Api(tags = "EasyPoiController", description = "EasyPoi导入导出测试")
@RequestMapping("/easyPoi")
    public class EasyPoiController {
    
    @ApiOperation("从Excel导入会员列表")
    @RequestMapping(value = "/importMemberList", method = RequestMethod.POST)
    @ResponseBody
        public CommonResult importMemberList(@RequestPart("file") MultipartFile file) {
        ImportParams params = new ImportParams();
        params.setTitleRows(1);
        params.setHeadRows(1);
            try {
            List<Member> list = ExcelImportUtil.importExcel(
            file.getInputStream(),
            Member.class, params);
            return CommonResult.success(list);
                } catch (Exception e) {
                e.printStackTrace();
                return CommonResult.failed("导入失败！");
            }
        }
    }
```

*   然后在Swagger中测试接口，选择之前导出的Excel文件即可，导入成功后会返回解析到的数据。

![](/images/jueJin/1f7f30dee0cc4db.png)

### 复杂导出

> 当然EasyPoi也可以实现更加复杂的Excel操作，比如导出一个嵌套了会员信息和商品信息的订单列表，下面我们来实现下！

*   首先添加商品对象`Product`，用于封装商品信息；

```java
/**
* 商品
* Created by macro on 2021/10/12.
*/
@Data
@EqualsAndHashCode(callSuper = false)
    public class Product {
    @Excel(name = "ID", width = 10)
    private Long id;
    @Excel(name = "商品SN", width = 20)
    private String productSn;
    @Excel(name = "商品名称", width = 20)
    private String name;
    @Excel(name = "商品副标题", width = 30)
    private String subTitle;
    @Excel(name = "品牌名称", width = 20)
    private String brandName;
    @Excel(name = "商品价格", width = 10)
    private BigDecimal price;
    @Excel(name = "购买数量", width = 10, suffix = "件")
    private Integer count;
}
```

*   然后添加订单对象`Order`，订单和会员是一对一关系，使用 `@ExcelEntity`注解表示，订单和商品是一对多关系，使用`@ExcelCollection`注解表示，`Order`就是我们需要导出的嵌套订单数据；

```java
/**
* 订单
* Created by macro on 2021/10/12.
*/
@Data
@EqualsAndHashCode(callSuper = false)
    public class Order {
    @Excel(name = "ID", width = 10,needMerge = true)
    private Long id;
    @Excel(name = "订单号", width = 20,needMerge = true)
    private String orderSn;
    @Excel(name = "创建时间", width = 20, format = "yyyy-MM-dd HH:mm:ss",needMerge = true)
    private Date createTime;
    @Excel(name = "收货地址", width = 20,needMerge = true )
    private String receiverAddress;
    @ExcelEntity(name = "会员信息")
    private Member member;
    @ExcelCollection(name = "商品列表")
    private List<Product> productList;
}
```

*   接下来在Controller中添加导出订单列表的接口，由于有些会员信息我们不需要导出，可以调用`ExportParams`中的`setExclusions`方法排除掉；

```java
/**
* EasyPoi导入导出测试Controller
* Created by macro on 2021/10/12.
*/
@Controller
@Api(tags = "EasyPoiController", description = "EasyPoi导入导出测试")
@RequestMapping("/easyPoi")
    public class EasyPoiController {
    
    @ApiOperation(value = "导出订单列表Excel")
    @RequestMapping(value = "/exportOrderList", method = RequestMethod.GET)
    public void exportOrderList(ModelMap map,
    HttpServletRequest request,
        HttpServletResponse response) {
        List<Order> orderList = getOrderList();
        ExportParams params = new ExportParams("订单列表", "订单列表", ExcelType.XSSF);
        //导出时排除一些字段
        params.setExclusions(new String[]{"ID", "出生日期", "性别"});
        map.put(NormalExcelConstants.DATA_LIST, orderList);
        map.put(NormalExcelConstants.CLASS, Order.class);
        map.put(NormalExcelConstants.PARAMS, params);
        map.put(NormalExcelConstants.FILE_NAME, "orderList");
        PoiBaseView.render(map, request, response, NormalExcelConstants.EASYPOI_EXCEL_VIEW);
    }
}
```

*   在Swagger中访问接口测试，导出订单列表对应Excel；

![](/images/jueJin/ffd9ecb593f741d.png)

*   下载完成后，查看下文件，EasyPoi导出复杂的Excel也是很简单的！

![](/images/jueJin/1ce785ef57e6488.png)

### 自定义处理

> 如果你想对导出字段进行一些自定义处理，EasyPoi也是支持的，比如在会员信息中，如果用户没有设置昵称，我们添加下`暂未设置`信息。

*   我们需要添加一个处理器继承默认的`ExcelDataHandlerDefaultImpl`类，然后在`exportHandler`方法中实现自定义处理逻辑；

```java
/**
* 自定义字段处理
* Created by macro on 2021/10/13.
*/
    public class MemberExcelDataHandler extends ExcelDataHandlerDefaultImpl<Member> {
    
    @Override
        public Object exportHandler(Member obj, String name, Object value) {
            if("昵称".equals(name)){
            String emptyValue = "暂未设置";
                if(value==null){
                return super.exportHandler(obj,name,emptyValue);
            }
                if(value instanceof String&&StrUtil.isBlank((String) value)){
                return super.exportHandler(obj,name,emptyValue);
            }
        }
        return super.exportHandler(obj, name, value);
    }
    
    @Override
        public Object importHandler(Member obj, String name, Object value) {
        return super.importHandler(obj, name, value);
    }
}
```

*   然后修改Controller中的接口，调用`MemberExcelDataHandler`处理器的`setNeedHandlerFields`设置需要自定义处理的字段，并调用`ExportParams`的`setDataHandler`设置自定义处理器；

```java
/**
* EasyPoi导入导出测试Controller
* Created by macro on 2021/10/12.
*/
@Controller
@Api(tags = "EasyPoiController", description = "EasyPoi导入导出测试")
@RequestMapping("/easyPoi")
    public class EasyPoiController {
    
    @ApiOperation(value = "导出会员列表Excel")
    @RequestMapping(value = "/exportMemberList", method = RequestMethod.GET)
    public void exportMemberList(ModelMap map,
    HttpServletRequest request,
        HttpServletResponse response) {
        List<Member> memberList = LocalJsonUtil.getListFromJson("json/members.json", Member.class);
        ExportParams params = new ExportParams("会员列表", "会员列表", ExcelType.XSSF);
        //对导出结果进行自定义处理
        MemberExcelDataHandler handler = new MemberExcelDataHandler();
        handler.setNeedHandlerFields(new String[]{"昵称"});
        params.setDataHandler(handler);
        map.put(NormalExcelConstants.DATA_LIST, memberList);
        map.put(NormalExcelConstants.CLASS, Member.class);
        map.put(NormalExcelConstants.PARAMS, params);
        map.put(NormalExcelConstants.FILE_NAME, "memberList");
        PoiBaseView.render(map, request, response, NormalExcelConstants.EASYPOI_EXCEL_VIEW);
    }
}
```

*   再次调用导出接口，我们可以发现昵称已经添加默认设置了。

![](/images/jueJin/d3e9c14b1c6f48f.png)

总结
--

体验了一波EasyPoi，它使用注解来操作Excel的方式确实非常好用。如果你想生成更为复杂的Excel的话，可以考虑下它的模板功能。

参考资料
----

项目官网：[gitee.com/lemur/easyp…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Flemur%2Feasypoi "https://gitee.com/lemur/easypoi")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-easypoi "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-easypoi")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！