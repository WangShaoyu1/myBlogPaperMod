---
author: "MacroZheng"
title: "再见前端！纯 Java 撸个管理系统，这框架用起来贼爽！"
date: 2021-05-25
description: "一个管理系统，往往需要后端+前端一起实现。有时候我们的管理系统只需要一些简单的CRUD页面，有没有什么框架能做到不写前端代码，纯Java撸个管理系统呢？里推荐一个全栈类框架Erupt！"
tags: ["Java","Spring Boot中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:65,comments:11,collects:90,views:9043,"
---
> SpringBoot实战电商项目mall（40k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

一个管理系统，往往需要后端+前端一起实现。单表CRUD操作往往都差不多，我们可以使用代码生成器来实现。有时候我们的管理系统只需要一些简单的CRUD页面，有没有什么框架能做到不写前端代码，纯Java撸个管理系统呢？这里推荐一个全栈类框架Erupt，希望对大家有所帮助！

Erupt简介
-------

Erupt是一个低代码`全栈类`框架，它使用`Java 注解`动态生成页面以及增、删、改、查、权限控制等后台功能。零前端代码、零CURD、自动建表，仅需`一个类文件` + 简洁的注解配置，快速开发企业级后台管理系统。

基本使用
----

> 我们首先来波实战，以商品品牌管理为例，来熟悉下Erupt结合SpringBoot的基本使用！

### SpringBoot整合Erupt

> 由于Erupt原生支持SpringBoot，所以整合还是很方便的！

*   为了方便管理Erupt版本，我们先在`pom.xml`中添加Erupt的版本属性；

```xml
<properties>
<erupt.version>1.6.13</erupt.version>
</properties>
```

*   之后在`pom.xml`中添加Erupt的权限管理、数据安全、后台WEB界面及MySQL驱动依赖；

```xml
<dependencies>
<!--用户权限管理-->
<dependency>
<groupId>xyz.erupt</groupId>
<artifactId>erupt-upms</artifactId>
<version>${erupt.version}</version>
</dependency>
<!--接口数据安全-->
<dependency>
<groupId>xyz.erupt</groupId>
<artifactId>erupt-security</artifactId>
<version>${erupt.version}</version>
</dependency>
<!--后台WEB界面-->
<dependency>
<groupId>xyz.erupt</groupId>
<artifactId>erupt-web</artifactId>
<version>${erupt.version}</version>
</dependency>
<!--Mysql数据库驱动-->
<dependency>
<groupId>mysql</groupId>
<artifactId>mysql-connector-java</artifactId>
<version>8.0.15</version>
</dependency>
</dependencies>
```

*   修改项目的`application.yml`文件，添加数据源和JPA配置；

```yaml
spring:
datasource:
url: jdbc:mysql://localhost:3306/erupt?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
username: root
password: root
jpa:
show-sql: true
generate-ddl: true
database-platform: org.hibernate.dialect.MySQL5InnoDBDialect
database: mysql
```

*   在项目的`resources`目录下创建如下配置文件（拷贝`mall-tiny-erupt`中的即可）；

![](/images/jueJin/cb695672bdcf4b2.png)

*   添加Erupt的Java配置类`EruptConfig`，以启动类`MallTinyApplication`的包为准，配置包扫码路径；

```java
/**
* Created by macro on 2021/4/13.
*/
@Configuration
@ComponentScan({"xyz.erupt","com.macro.mall.tiny"})
@EntityScan({"xyz.erupt","com.macro.mall.tiny"})
@EruptScan({"xyz.erupt","com.macro.mall.tiny"})
    public class EruptConfig {
}
```

*   在MySQL中创建`erupt`数据库，之后使用启动类运行该项目，在`erupt`数据库中会自动创建如下表；

![](/images/jueJin/d712c80d4bf14e7.png)

*   项目启动成功后，可以直接访登录页，默认账号密码`erupt:erupt`，项目访问地址：[http://localhost:8080/](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2F "http://localhost:8080/")

![](/images/jueJin/c3303416ab7a4c0.png)

*   登录成功后会跳转到项目主页，我们可以发现没有写一行前端代码，却拥有了完整的权限管理和字典管理功能，是不是很棒！

![](/images/jueJin/505d3a429c7c4bb.png)

### 实现单表 CRUD

> 使用核心注解`@Erupt`和`@EruptField`定义一个实体类即可快速完成CRUD操作，让我们以商品品牌管理为例试试吧。

*   不需要Controller、Service、Dao，仅仅一个实体类即可完成CRUD，首先我们创建实体类`PmsBrand`；

```java
@Erupt(name = "商品品牌")
@Table(name = "pms_brand")
@Entity
    public class PmsBrand {
    
    @Id
    @GeneratedValue(generator = "generator")
    @GenericGenerator(name = "generator", strategy = "native")
    @Column(name = "id")
    @EruptField
    private Long id;
    
    @EruptField(
    views = @View(title = "品牌名称"),
    edit = @Edit(title = "品牌名称",notNull=true,search = @Search(vague = true))
    )
    private String name;
    
    @EruptField(
    views = @View(title = "品牌首字母"),
    edit = @Edit(title = "品牌首字母",notNull=true)
    )
    private String firstLetter;
    
    @EruptField(
    views = @View(title = "品牌LOGO"),
    edit = @Edit(title = "品牌LOGO", type = EditType.ATTACHMENT,
    attachmentType = @AttachmentType(type = AttachmentType.Type.IMAGE))
    )
    private String logo;
    
    @EruptField(
    views = @View(title = "品牌专区大图"),
    edit = @Edit(title = "品牌专区大图", type = EditType.ATTACHMENT,
    attachmentType = @AttachmentType(type = AttachmentType.Type.IMAGE))
    )
    private String bigPic;
    
    @EruptField(
    views = @View(title = "品牌故事"),
    edit = @Edit(title = "品牌故事")
    )
    private String brandStory;
    
    @EruptField(
    views = @View(title = "排序"),
    edit = @Edit(title = "排序")
    )
    private Integer sort;
    
    @EruptField(
    views = @View(title = "是否显示"),
    edit = @Edit(title = "是否显示")
    )
    private Boolean showStatus;
    
    @EruptField(
    views = @View(title = "品牌制造商"),
    edit = @Edit(title = "品牌制造商")
    )
    private Boolean factoryStatus;
    
    private Integer productCount;
    
    private Integer productCommentCount;
    
}
```

*   创建成功后重启项目，在`菜单维护`中添加一个叫`商品`的一级菜单；

![](/images/jueJin/52aca38a43ef47a.png)

*   然后再添加一个叫`品牌管理`的二级菜单，注意选择好`菜单类型`和`上级菜单`，输入`类型值`为实体类的类名称`PmsBrand`；

![](/images/jueJin/bc761d8971444fc.png)

*   菜单添加成功后，刷新页面，完整的品牌管理功能就出现了，来试下新增；

![](/images/jueJin/dc3a75c405e740c.png)

*   再看下查询列表页面，可以发现我们通过`@Edit`注解，将实体类的字段转换成了不同的输入控件，比如文本框、图片上传框、单选框和数值框。

![](/images/jueJin/9c55d37dbe4348a.png)

### 核心注解说明

> 几个Erupt的核心注解，对照PmsBrand中的代码学习即可！

#### @Erupt

*   name：功能名称
*   desc：功能描述

#### @EruptField

*   views：表格展示配置
*   edit：编辑项配置
*   sort：前端展示顺序，数字越小越靠前

#### @View

*   title：表格列名称
*   desc：表格列描述
*   type：数据展示形式，默认为AUTO，可以根据属性类型自行推断
*   show：是否显示

#### @Edit

*   title：表格列名称
*   desc：表格列描述
*   type：编辑类型，默认为AUTO，可以根据属性类型自行推断
*   show：是否显示
*   notNull：是否为必填项
*   search：是否支持搜索，search = @Search(vague = true)会启用高级查询策略

扩展模块
----

> 当然Erupt的功能远不止于此，还集成了很多实用的系统功能，包括定时任务、代码生成器、系统监控及NoSQL支持等。

### 定时任务`erupt-job`

> 通过定时任务功能，我们可以在代码中定义好定时任务，然后在图形化界面中操作任务，有点之前讲过的[PowerJob](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FCgKdYNvj7NrxE-0WFCH5yg "https://mp.weixin.qq.com/s/CgKdYNvj7NrxE-0WFCH5yg") 的感觉！

*   首先我们需要在`pom.xml`中添加`erupt-job`相关依赖；

```xml
<!--定时任务erupt-job-->
<dependency>
<groupId>xyz.erupt</groupId>
<artifactId>erupt-job</artifactId>
<version>${erupt.version}</version>
</dependency>
```

*   之后在`application.yml`中添加邮件配置（否则启动会报错）；

```yaml
spring:
mail:
username: xxxxxx@qq.com
password: 123456
host: smtp.exmail.qq.com
port: 465
properties:
mail.smtp.ssl.auth: true
mail.smtp.ssl.enable: true
mail.smtp.ssl.required: true
```

*   之后创建一个定时任务实现类`JobHandlerImpl`，在`exec`方法中添加定时任务执行代码；

```java
/**
* Created by macro on 2021/4/13.
*/
@Service
@Slf4j
    public class JobHandlerImpl implements EruptJobHandler {
    @Override
        public String exec(String code, String param) throws Exception {
        log.info("定时任务已经执行，code:{},param:{}",code,param);
        return "success";
    }
}
```

*   之后重新启动应用，在`任务维护`中添加一个定时任务，每5秒执行一次；

![](/images/jueJin/f53ce8fa4cb441b.png)

*   添加成功后，定时任务开始执行，点击任务列表中的`日志`按钮即可查看执行日志。

![](/images/jueJin/28e648281cb0418.png)

### 代码生成器`erupt-generator`

> 如果你觉得手写实体类比较麻烦的话，还可以用用Erupt中的代码生成器。

*   在`pom.xml`中添加`erupt-generator`相关依赖；

```xml
<!-- 代码生成器 erupt-generator -->
<dependency>
<groupId>xyz.erupt</groupId>
<artifactId>erupt-generator</artifactId>
<version>${erupt.version}</version>
</dependency>
```

*   在`代码生成`菜单中我们可以像在Navicat中一样，直接添加表和字段，从而生成实体类代码；

![](/images/jueJin/bf89fe6ded744b6.png)

*   我们在添加过程中可以发现，Erupt支持的`编辑类型`还挺多的，多达`30`种；

![](/images/jueJin/62e395c87d7e44b.png)

*   添加成功后，点击列表项的`代码预览`按钮可以直接生成代码，复制到自己项目下即可。

![](/images/jueJin/18038e3b88a2402.png)

### 系统监控`erupt-monitor`

> 通过使用Erupt的系统监控功能，我们可以查看服务器的配置、Redis的缓存使用情况和在线用户信息。

*   在`pom.xml`中添加`erupt-monitor`相关依赖；

```xml
<!--服务器监控 erupt-monitor-->
<dependency>
<groupId>xyz.erupt</groupId>
<artifactId>erupt-monitor</artifactId>
<version>${erupt.version}</version>
</dependency>
```

*   由于需要使用到Redis，所以要在`application.yml`中添加Redis配置，并开启Session的Redis存储功能；

```yaml
spring:
redis:
host: localhost # Redis服务器地址
database: 1 # Redis数据库索引（默认为0）
port: 6379 # Redis服务器连接端口
password: 123456 # Redis服务器连接密码（默认为空）
timeout: 3000ms # 连接超时时间
erupt:
# 开启redis方式存储session，默认false，开启后需在配置文件中添加redis配置
redisSession: true
```

*   通过`服务监控`菜单，可以查看到服务器的CPU、内存和Java虚拟机信息；

![](/images/jueJin/4dcfceaf1cc74cf.png)

*   通过`缓存监控`菜单，可以查看到Redis信息、命令统计和Redis Key统计；

![](/images/jueJin/5b7840d7c032486.png)

*   通过`在线用户`菜单，可以查看到在线用户信息，还可以让用户强行退出！

![](/images/jueJin/2d05f3f03a0c4d8.png)

### NoSQL数据源`erupt-mongodb`

> Erupt支持多种数据源，包括：MySQL、Oracle、PostgreSQL、H2，甚至支持 MongoDB。下面我们来体验下MongoDB的支持功能。

*   在`pom.xml`中添加`erupt-mongodb`相关依赖；

```xml
<!--NoSQL数据源 erupt-mongodb-->
<dependency>
<groupId>xyz.erupt</groupId>
<artifactId>erupt-mongodb</artifactId>
<version>${erupt.version}</version>
</dependency>
```

*   由于需要使用到MongoDB，所以要在`application.yml`中添加MongoDB配置；

```yaml
spring:
data:
mongodb:
host: localhost # mongodb的连接地址
port: 27017 # mongodb的连接端口号
database: erupt # mongodb的连接的数据库
```

*   以一个简化版的商品管理为例，还是熟悉的套路，添加一个`PmsProduct`实体类；

```java
/**
* Created by macro on 2021/4/13.
*/
@EruptDataProcessor(EruptMongodbImpl.MONGODB_PROCESS)  //此注解表示使用MongoDB来存储数据
@Document(collection = "product")
@Erupt(
name = "商品管理",
orderBy = "sort"
)
    public class PmsProduct {
    @Id
    @EruptField
    private String id;
    
    @EruptField(
    views = @View(title = "商品名称", sortable = true),
    edit = @Edit(title = "商品名称", search = @Search(vague = true))
    )
    private String name;
    
    @EruptField(
    views = @View(title = "副标题", sortable = true),
    edit = @Edit(title = "副标题", search = @Search(vague = true))
    )
    private String subTitle;
    
    @EruptField(
    views = @View(title = "价格", sortable = true),
    edit = @Edit(title = "价格")
    )
    private Double price;
    
    @EruptField(
    views = @View(title = "商品图片"),
    edit = @Edit(title = "商品图片", type = EditType.ATTACHMENT,
    attachmentType = @AttachmentType(type = AttachmentType.Type.IMAGE))
    )
    private String pic;
    
    @EruptField(
    views = @View(title = "状态", sortable = true),
    edit = @Edit(title = "状态",
    boolType = @BoolType(trueText = "上架", falseText = "下架"),
    search = @Search)
    )
    private Boolean publishStatus;
    
    @EruptField(
    views = @View(title = "创建时间", sortable = true),
    edit = @Edit(title = "创建时间", search = @Search(vague = true))
    )
    private Date createTime;
}
```

*   与之前操作MySQL的区别是通过`@EruptDataProcessor`注解指定用MongoDB来存储数据，`@Table`注解改为使用`@Document`注解；

```java
@EruptDataProcessor(EruptMongodbImpl.MONGODB_PROCESS)  //此注解表示使用MongoDB来存储数据
@Document(collection = "product")
@Erupt(
name = "商品管理",
orderBy = "sort"
)
    public class PmsProduct {
    //...省略若干代码
}
```

*   接下来就是在`菜单维护`里面添加一个`商品管理`的菜单，刷新一下就可以看到该功能了。

![](/images/jueJin/14717b9114f2459.png)

### 在线接口开发`erupt-magic-api`

> 最后再介绍一个神奇的功能，直接通过UI界面来开发接口，无需定义Controller、Service、Dao、Mapper、XML、VO等Java对象！

*   在`pom.xml`中添加`erupt-magic-api`相关依赖；

```xml
<!--在线接口开发 erupt-magic-api-->
<dependency>
<groupId>xyz.erupt</groupId>
<artifactId>erupt-magic-api</artifactId>
<version>${erupt.version}</version>
</dependency>
```

*   在`application.yml`中添加`magic-api`相关配置；

```yaml
erupt:
# 设置具体哪些包被jackson消息转化而不是gson
jacksonHttpMessageConvertersPackages:
- org.ssssssss

magic-api:
web: /magic/web
# 接口配置文件存放路径
resource.location: D:/erupt/magic-script
```

*   我们可以直接通过`magic-api`自己定义的脚本来实现查询，比如下面这个脚本，用于查询全部品牌；

```javascript
var sql = "select * from pms_brand";
return db.select(sql);
```

*   在`接口配置`菜单中直接添加该脚本即可实现品牌列表查询接口，无需额外编写代码；

![](/images/jueJin/2390b0fefb3941a.png)

*   在浏览器中直接访问接口，发现已经自动生成接口，是不是很棒！

![](/images/jueJin/e0de632fd404492.png)

总结
--

如果你的需求是搭建一个业务并不复杂的后台管理系统，Erupt是一个很好的选择！它能让你不写前端代码！但是如果你的需求方对界面有很多要求，而你的业务逻辑又比较复杂的话那就要自己实现前端了!

参考资料
----

官方文档：[www.yuque.com/erupts/erup…](https://link.juejin.cn?target=https%3A%2F%2Fwww.yuque.com%2Ferupts%2Ferupt "https://www.yuque.com/erupts/erupt")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-erupt "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-erupt")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！