---
author: "MacroZheng"
title: "绝了！基于SpringBoot的可视化接口开发工具，不再需要Controller、Service、Dao！｜Java 开发实战"
date: 2021-06-01
description: "作为Java后端开发，平时开发API接口的时候经常需要定义Controller、Service、Dao、Mapper等Java对象。有没有什么办法可以不写这些代码，直接操作数据库生成API接口呢？"
tags: ["Java","后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:48,comments:0,collects:105,views:10984,"
---
> 本文正在参加「Java主题月 - Java 开发实战」，详情查看[活动链接](https://juejin.cn/post/6968267217121050660/ "https://juejin.cn/post/6968267217121050660/")。

摘要
--

作为Java后端开发，平时开发API接口的时候经常需要定义Controller、Service、Dao、Mapper、XML、VO等Java对象。我们甚至使用代码生成器来通过数据库生成这些代码！有没有什么办法可以让我们不写这些代码，直接操作数据库生成API接口呢？今天给大家推荐一款工具`magic-api`，来帮我们实现这个小目标！

SpringBoot实战电商项目mall（40k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

magic-api简介
-----------

`magic-api`是一个基于Java的接口快速开发框架，编写接口将通过`magic-api`提供的UI界面完成，自动映射为HTTP接口，无需定义Controller、Service、Dao、Mapper、XML、VO等Java对象。

使用
--

> 下面我们来波实战，熟悉下使用`magic-api`来开发API接口。

### 在SpringBoot中使用

> `magic-api`原生支持SpringBoot，可与SpringBoot无缝整合。

*   首先在`pom.xml`中添加`magic-api`相关依赖；

```xml
<!--接口快速开发框架 magic-api-->
<dependency>
<groupId>org.ssssssss</groupId>
<artifactId>magic-api-spring-boot-starter</artifactId>
<version>1.0.2</version>
</dependency>
```

*   在配置文件`application.yml`中添加数据源及`magic-api`相关配置；

```yaml
spring:
datasource:
url: jdbc:mysql://localhost:3306/magic_api?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
username: root
password: root

magic-api:
# 配置api管理页面入口
web: /magic/web
# 配置存储方式
resource:
# 配置接口资源存储位置，可选file、database、redis
type: database
# 存储表名
tableName: magic_api_file
# 使用database、redis存储时的key前缀
prefix: /magic-api
# 是否是只读模式
readonly: false
# 启用驼峰命名转换
sql-column-case: camel
# 分页配置
page-config:
# 页大小的请求参数名称
size: size
# 页码的请求参数名称
page: page
# 未传页码时的默认页码
default-page: 1
# 未传页大小时的默认页大小
default-size: 10
```

*   在MySQL中创建数据库`magic_api`，由于我们配置了使用数据库存储接口资源，所以需要先创建`magic_api_file`表；

```sql
CREATE TABLE `magic_api_file`
(
`id`           bigint(255) NOT NULL AUTO_INCREMENT,
`file_path`    varchar(255) DEFAULT NULL,
`file_content` text,
PRIMARY KEY (`id`)
)
```

*   再创建`pms_brand`表，用于测试；

```sql
CREATE TABLE `pms_brand` (
`id` bigint(20) NOT NULL AUTO_INCREMENT,
`big_pic` varchar(255) DEFAULT NULL,
`brand_story` varchar(255) DEFAULT NULL,
`factory_status` bit(1) DEFAULT NULL,
`first_letter` varchar(255) DEFAULT NULL,
`logo` varchar(255) DEFAULT NULL,
`name` varchar(255) DEFAULT NULL,
`product_comment_count` int(11) DEFAULT NULL,
`product_count` int(11) DEFAULT NULL,
`show_status` bit(1) DEFAULT NULL,
`sort` int(11) DEFAULT NULL,
PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;
```

*   最后启动项目，访问`magic-api`的UI界面，访问地址：[http://localhost:8080/magic/web](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Fmagic%2Fweb "http://localhost:8080/magic/web")

![](/images/jueJin/6ec570a18675463.png)

### 增删改查

> 接下来我们将以商品品牌管理为例，体验下使用`magic-api`开发接口的快感！使用`magic-api`开发API接口，仅需在界面中使用`magic-script`脚本即可。

*   首先我们来写个新增接口，先创建一个分组，然后在分组中创建一个`新增`接口，在编辑框中输入如下脚本；

```javascript
// 使用body对象可以直接获取请求body中的参数
return db.table('pms_brand').insert(body);
```

*   在底部的`接口信息`中进行如下配置，`POST`请求，请求路径为`/create`，请求参数放在`请求body`中；

![](/images/jueJin/93667943bb564dd.png)

*   再来个根据ID查询的接口，在编辑框中输入如下脚本；

```javascript
// 路径变量从path对象中获取
return db.table('pms_brand')
.where()
.eq('id',path.id)
.selectOne();
```

*   在底部的`接口信息`中进行如下配置，`GET`请求，请求路径为`/detail/{id}`，请求参数放在`路径变量`中；

![](/images/jueJin/d9ce925cd1db4e8.png)

*   再来个修改的接口，在编辑框中输入如下脚本；

```javascript
return db.table('pms_brand').primary('id',body.id).update(body);
```

*   在底部的`接口信息`中进行如下配置，`POST`请求，请求路径为`/update`，请求参数放在`请求body`中；

![](/images/jueJin/a452bd3b16854f6.png)

*   再来个分页查询查询的接口，在编辑框中输入如下脚本；

```javascript
return db.table('pms_brand').page();
```

*   在底部的`接口信息`中进行如下配置，`GET`请求，请求路径为`/page`，请求参数放在`请求参数`中（由于已经在`application.yml`中配置好了分页参数，可直接使用）；

![](/images/jueJin/c48f78839269467.png)

*   再来个根据ID删除的接口，在编辑框中输入如下脚本，删除只能使用update，这设计有点...

```javascript
return db.update('delete from pms_brand where id=#{id}');
```

*   在底部的`接口信息`中进行如下配置，`POST`请求，请求路径为`/delete/{id}`，请求参数放在`路径变量`中；

![](/images/jueJin/813c6fbdb8cb4c1.png)

### 参数验证

> 我们可以通过断言模块`assert`来进行参数验证。

*   比如新增品牌的时候名称和首字母不能为空，在编辑框中输入如下脚本；

```javascript
import assert;  //导入断言模块
//验证不通过时，会终止运行
assert.notEmpty(body.name,400,'名称不能为空！');
assert.notEmpty(body.firstLetter,400,'首字母不能为空！');
return db.table('pms_brand').insert(body);
```

*   在底部的`接口信息`中进行如下配置，`POST`请求，请求路径为`/test`，请求参数放在`请求body`中；

![](/images/jueJin/0d4df53cec6f452.png)

*   当我们不添加`name`字段时，调用接口会返回我们自己定义的错误信息和状态码。

![](/images/jueJin/47546adedcf149b.png)

### 结果转换

> 我们可以使用map方法对查询数据进行转换，返回我们想要的数据。

*   比如我们想将`showStatus`转换为中文说明，并只返回三个需要的字段，在编辑框中输入如下脚本；

```javascript
var list = db.table('pms_brand').select();
    return list.map((item)=>{
    name : item.name,
    firstLetter : item.firstLetter,
    showStatus : item.showStatus? '不显示' : '显示'
    });
```

*   访问该接口，在执行结果中可以发现，返回结果已经转换。

![](/images/jueJin/d8e46f98d7ba4bb.png)

### 使用事务

> 在我们使用Java开发接口的时候，少不了用到事务，当然`magic-api`也是支持事务的。使用`db.transaction()`方法即可，支持自动事务和手动事务。

*   还是以修改品牌为例，先查询是否存在，如果存在则更新；

```javascript
import assert;
    var val = db.transaction(()=>{
    var exist = db.table('pms_brand').where().eq('id',body.id).selectOne();
    assert.notNull(exist,404,'找不到该品牌！');
    db.table('pms_brand').primary('id',body.id).update(body);
    return v2;
    });
    return val;
```

*   在底部的`接口信息`中进行如下配置，`POST`请求，请求路径为`/test`，请求参数放在`请求body`中；

![](/images/jueJin/b902ad2b1a77429.png)

### 集成Swagger

> 写了那么多接口，都是在`magic-api`的界面中进行调试的。如果你习惯使用Swagger，`magic-api`也可以和Swagger进行无缝整合。

*   首先在`pom.xml`中添加Swagger相关依赖；

```xml
<dependencies>
<!--Swagger-UI API文档生产工具-->
<dependency>
<groupId>io.springfox</groupId>
<artifactId>springfox-swagger2</artifactId>
<version>2.9.2</version>
</dependency>
<dependency>
<groupId>io.springfox</groupId>
<artifactId>springfox-swagger-ui</artifactId>
<version>2.9.2</version>
</dependency>
</dependencies>
```

*   在配置文件`application.yml`中添加Swagger相关配置；

```yaml
magic-api:
# 集成Swagger配置
swagger-config:
# 文档名称
name: MagicAPI 测试接口
# 文档标题
title: MagicAPI Swagger Docs
# 文档描述
description: MagicAPI 测试接口信息
# 文档版本号
version: 1.0
# 文档资源位置
location: /v2/api-docs/magic-api/swagger2.json
```

*   访问Swagger界面即可查看我们在`magic-api`中写的接口了，访问地址：[http://localhost:8080/swagger-ui.html](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Fswagger-ui.html "http://localhost:8080/swagger-ui.html")

![](/images/jueJin/1f6e8d74d9a7434.png)

总结
--

`magic-api`是个很有意思的框架，可以通过在UI界面中使用简单的脚本，进行API接口的开发。不过作为一款小众框架，`magic-api`还有很长一段路要走！

参考资料
----

官方文档：[ssssssss.org/](https://link.juejin.cn?target=https%3A%2F%2Fssssssss.org%2F "https://ssssssss.org/")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-magic-api "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-magic-api")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！