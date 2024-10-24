---
author: "MacroZheng"
title: "还在用Swagger？试试这款零注解侵入的API文档生成工具，跟Postman绝配！"
date: 2021-11-09
description: "前后端接口联调需要API文档，我们经常会使用工具来生成。最近发现一款好用的API文档生成工具, 它有着很多Swagger不具备的特点，推荐给大家。"
tags: ["Java","后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:90,comments:19,collects:118,views:22754,"
---
> 前后端接口联调需要API文档，我们经常会使用工具来生成。之前经常使用Swagger来生成，最近发现一款好用的API文档生成工具`smart-doc`, 它有着很多Swagger不具备的特点，推荐给大家。

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

聊聊Swagger
---------

在我们使用Swagger的时候，经常会需要用到它的注解，比如`@Api`、`@ApiOperation`这些，Swagger通过它们来生成API文档。比如下面的代码：

![](/images/jueJin/smart_doc_start.png)

Swagger对代码的入侵性比较强，有时候代码注释和注解中的内容有点重复了。有没有什么工具能实现零注解入侵，直接根据代码注释生成API文档呢？`smart-doc`恰好是这种工具！

smart-doc简介
-----------

`smart-doc`是一款API文档生成工具，无需多余操作，只要你规范地写好代码注释，就能生成API文档。同时能直接生成Postman调试文件，一键导入Postman即可调试，非常好用！

`smart-doc`具有如下优点：

![](/images/jueJin/smart_doc_start.png)

生成API文档
-------

> 接下来我们把`smart-doc`集成到SpringBoot项目中，体验一下它的API文档生成功能。

*   首先我们需要在项目中添加`smart-doc`的Maven插件，可以发现`smart-doc`就是个插件，连依赖都不用添加，真正零入侵啊；

```xml
<plugin>
<groupId>com.github.shalousun</groupId>
<artifactId>smart-doc-maven-plugin</artifactId>
<version>2.2.8</version>
<configuration>
<!--指定smart-doc使用的配置文件路径-->
<configFile>./src/main/resources/smart-doc.json</configFile>
<!--指定项目名称-->
<projectName>mall-tiny-smart-doc</projectName>
</configuration>
</plugin>
```

*   接下来在项目的`resources`目录下，添加配置文件`smart-doc.json`，属性说明直接参考注释即可；

```json
    {
    "serverUrl": "http://localhost:8088", //指定后端服务访问地址
    "outPath": "src/main/resources/static/doc", //指定文档的输出路径，生成到项目静态文件目录下，随项目启动可以查看
    "isStrict": false, //是否开启严格模式
    "allInOne": true, //是否将文档合并到一个文件中
    "createDebugPage": false, //是否创建可以测试的html页面
    "packageFilters": "com.macro.mall.tiny.controller.*", //controller包过滤
    "style":"xt256", //基于highlight.js的代码高设置
    "projectName": "mall-tiny-smart-doc", //配置自己的项目名称
    "showAuthor":false, //是否显示接口作者名称
    "allInOneDocFileName":"index.html" //自定义设置输出文档名称
}
```

*   打开IDEA的Maven面板，双击`smart-doc`插件的`smart-doc:html`按钮，即可生成API文档；

![](/images/jueJin/smart_doc_start.png)

*   此时我们可以发现，在项目的`static/doc`目录下已经生成如下文件；

![](/images/jueJin/smart_doc_start.png)

*   运行项目，访问生成的API接口文档，发现文档非常详细，包括了请求参数和响应结果的各种说明，访问地址：[http://localhost:8088/doc/index.html](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8088%2Fdoc%2Findex.html "http://localhost:8088/doc/index.html")

![](/images/jueJin/smart_doc_start.png)

*   我们回过来看下实体类的代码，可以发现我们只是规范地添加了字段注释，生成文档的时候就自动有了；

```java
    public class PmsBrand implements Serializable {
    /**
    * ID
    */
    private Long id;
    
    /**
    * 名称
    * @required
    */
    private String name;
    
    /**
    * 首字母
    * @since 1.0
    */
    private String firstLetter;
    
    /**
    * 排序
    */
    private Integer sort;
    
    /**
    * 是否为品牌制造商(0,1)
    */
    private Integer factoryStatus;
    
    /**
    * 显示状态(0,1)
    * @ignore
    */
    private Integer showStatus;
    
    /**
    * 产品数量
    */
    private Integer productCount;
    
    /**
    * 产品评论数量
    */
    private Integer productCommentCount;
    
    /**
    * 品牌logo
    */
    private String logo;
    
    /**
    * 专区大图
    */
    private String bigPic;
    
    /**
    * 品牌故事
    */
    private String brandStory;
    //省略getter、setter方法
}
```

*   再来看下Controller中代码，我们同样规范地在方法上添加了注释，生成API文档的时候也自动有了；

```java
/**
* 商品品牌管理
*/
@Controller
@RequestMapping("/brand")
    public class PmsBrandController {
    @Autowired
    private PmsBrandService brandService;
    
    /**
    * 分页查询品牌列表
    *
    * @param pageNum 页码
    * @param pageSize 分页大小
    */
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    @ResponseBody
    @PreAuthorize("hasRole('ADMIN')")
    public CommonResult<CommonPage<PmsBrand>> listBrand(@RequestParam(value = "pageNum", defaultValue = "1")
    Integer pageNum,
    @RequestParam(value = "pageSize", defaultValue = "3")
        Integer pageSize) {
        List<PmsBrand> brandList = brandService.listBrand(pageNum, pageSize);
        return CommonResult.success(CommonPage.restPage(brandList));
    }
}
```

*   当然`smart-doc`还提供了自定义注释tag，用于增强文档功能；
    *   @ignore：生成文档时是否要过滤该属性；
    *   @required：用于修饰接口请求参数是否必须；
    *   @since：用于修饰接口中属性添加的版本号。
*   为了写出优雅的API文档接口，我们经常会对返回结果进行统一封装，`smart-doc`也支持这样的设置，在`smart-doc.json`中添加如下配置即可；

```json
    {
    "responseBodyAdvice":{ //统一返回结果设置
    "className":"com.macro.mall.tiny.common.api.CommonResult" //对应封装类
}
}
```

*   我们也经常会用枚举类型来封装状态码，在`smart-doc.json`中添加如下配置即可；

```json
    {
    "errorCodeDictionaries": [{ //错误码列表设置
    "title": "title",
    "enumClassName": "com.macro.mall.tiny.common.api.ResultCode", //错误码枚举类
    "codeField": "code", //错误码对应字段
    "descField": "message" //错误码描述对应字段
}]
}
```

*   配置成功后，即可在API文档中生成`错误码列表`；

![](/images/jueJin/smart_doc_start.png)

*   有时候我们也会想给某些接口添加自定义请求头，比如给一些需要登录的接口添加`Authorization`头，在`smart-doc.json`中添加如下配置即可；

```json
    {
    "requestHeaders": [{ //请求头设置
    "name": "Authorization", //请求头名称
    "type": "string", //请求头类型
    "desc": "token请求头的值", //请求头描述
    "value":"token请求头的值", //请求头的值
    "required": false, //是否必须
    "since": "-", //添加版本
    "pathPatterns": "/brand/**", //哪些路径需要添加请求头
    "excludePathPatterns":"/admin/login" //哪些路径不需要添加请求头
}]
}
```

*   配置成功后，在接口文档中即可查看到自定义请求头信息了。

![](/images/jueJin/smart_doc_start.png)

使用Postman测试接口
-------------

> 我们使用Swagger生成文档时候，是可以直接在上面测试接口的，而`smart-doc`的接口测试能力真的很弱，这也许是它拥抱Postman的原因吧，毕竟Postman是非常好用的接口测试工具，下面我们来结合Postman使用下！

*   `smart-doc`内置了Postman的`json`生成插件，可以一键生成并导入到Postman中去，双击`smart-doc:postman`按钮即可生成；

![](/images/jueJin/smart_doc_start.png)

*   此时将在项目的`static/doc`目录下生成`postman.json`文件；

![](/images/jueJin/smart_doc_start.png)

*   将`postman.json`文件直接导入到Postman中即可使用；

![](/images/jueJin/smart_doc_start.png)

*   导入成功后，所有接口都将在Postman中显示，这下我们可以愉快地测试接口了！

![](/images/jueJin/smart_doc_start.png)

总结
--

`smart-doc`确实是一款好用的API文档生成工具，尤其是它零注解侵入的特点。虽然它的接口测试能力有所不足，但是可以一键生成JSON文件并导入到Postman中去，使用起来也是非常方便的！

参考资料
----

官方文档：[gitee.com/smart-doc-t…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fsmart-doc-team%2Fsmart-doc%2Fwikis%2FHOME "https://gitee.com/smart-doc-team/smart-doc/wikis/HOME")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-smart-doc "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-smart-doc")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！