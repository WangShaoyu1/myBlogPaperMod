---
author: "MacroZheng"
title: "比 Elasticsearch 更快！ RediSearch + RedisJSON = 王炸！"
date: 2022-03-10
description: "最近发现Redis推出了很多增强模块，使用RediSearch可以作为搜索引擎使用，并且支持中文搜索！今天给大家带来RediSearch+RedisJSON作为搜索引擎的使用实践，希望对大家有所帮助！"
tags: ["后端","Java","Redis中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:110,comments:20,collects:263,views:23472,"
---
> Redis是开发中非常常用的内存数据存储中间件，之前基本上用它来做内存存储使用。最近发现Redis推出了很多增强模块，例如通过RedisJSON可以支持原生JSON对象的存储，使用RediSearch可以作为搜索引擎使用，并且支持中文搜索！今天给大家带来RediSearch+RedisJSON作为搜索引擎的使用实践，希望对大家有所帮助！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

RedisMod简介
----------

首先介绍下RedisMod这个东西，它是一系列Redis的增强模块。有了RedisMod的支持，Redis的功能将变得非常强大。目前RedisMod中包含了如下增强模块：

*   RediSearch：一个功能齐全的搜索引擎；
*   RedisJSON：对JSON类型的原生支持；
*   RedisTimeSeries：时序数据库支持；
*   RedisGraph：图数据库支持；
*   RedisBloom：概率性数据的原生支持；
*   RedisGears：可编程的数据处理；
*   RedisAI：机器学习的实时模型管理和部署。

安装
--

> 首先我们需要安装带所有RedisMod的Redis，使用Docker来安装非常方便的！

*   使用如下命令下载RedisMod的镜像；

```bash
docker pull redislabs/redismod:preview
```

*   在容器中运行RedisMod服务。

```bash
docker run -p 6379:6379 --name redismod \
-v /mydata/redismod/data:/data \
-d redislabs/redismod:preview
```

RedisJSON
---------

> 有了RedisJSON模块，Redis就可以存储原生JSON类型数据了，通过它你可以很方便地访问JSON中的各个属性，类似在MongoDB中那样，下面我们就来体验下，这里我们将使用[RedisInsight](https://link.juejin.cn?target=) 来操作Redis。

*   首先通过`JSON.SET`命令向Redis中添加JSON类型键值对，几个商品对象数据，由于JSON是树形结构的，使用`$`符号代表往JSON的根节点中添加数据；

```bash
JSON.SET product:1 $ '{"id":1,"productSn":"7437788","name":"小米8","subTitle":"全面屏游戏智能手机 6GB+64GB 黑色 全网通4G 双卡双待","brandName":"小米","price":2699,"count":1}'
JSON.SET product:2 $ '{"id":2,"productSn":"7437789","name":"红米5A","subTitle":"全网通版 3GB+32GB 香槟金 移动联通电信4G手机 双卡双待","brandName":"小米","price":649,"count":5}'
JSON.SET product:3 $ '{"id":3,"productSn":"7437799","name":"Apple iPhone 8 Plus","subTitle":"64GB 红色特别版 移动联通电信4G手机","brandName":"苹果","price":5499,"count":10}'
```

*   数据插入成功后，在RedisInsight中将看到如下信息，JSON数据支持格式化高亮显示；

![](/images/jueJin/561c8bc7333349f.png)

*   接下来可以通过`JSON.GET`命令获取JSON类型键值对的值；

```bash
JSON.GET product:1
```

![](/images/jueJin/ad226e0ad39c48f.png)

*   也可以只获取值的指定属性，在RedisJSON中，获取JSON对象中的属性时需要以`.`开头；

```bash
JSON.GET product:1 .name .subTitle
```

![](/images/jueJin/cd6858c3db87447.png)

*   还可以通过`JSON.TYPE`命令来获取JSON对象类型。

```bash
JSON.TYPE product:1 .
```

![](/images/jueJin/9e513d98f046434.png)

RediSearch
----------

> 通过RediSearch模块，Redis可以变成一个功能强大的全文搜索引擎，并且原生支持中文搜索，下面我们就来体验下！

*   使用RediSearch来搜索数据之前，我们得先创建下索引，建立索引的语法有点复杂，我们先来看下；

```bash
FT.CREATE {index}
[ON {data_type}]
[PREFIX {count} {prefix} [{prefix} ..]
[LANGUAGE {default_lang}]
SCHEMA {identifier} [AS {attribute}]
[TEXT | NUMERIC | GEO | TAG ] [CASESENSITIVE]
[SORTABLE] [NOINDEX]] ...
```

*   使用`FT.CREATE`命令可以建立索引，语法中的参数意义如下；
    
    *   index：索引名称；
    *   data\_type：建立索引的数据类型，目前支持JSON或者HASH两种；
    *   PREFIX：通过它可以选择需要建立索引的数据前缀，比如`PREFIX 1 "product:"`表示为键中以`product:`为前缀的数据建立索引；
    *   LANGUAGE：指定TEXT类型属性的默认语言，使用chinese可以设置为中文；
    *   identifier：指定属性名称；
    *   attribute：指定属性别名；
    *   TEXT | NUMERIC | GEO | TAG：这些都是属性可选的类型；
    *   SORTABLE：指定属性可以进行排序。
*   看了语法可能不太好理解，直接对之前的商品数据建立索引试试就懂了；
    

```bash
FT.CREATE productIdx ON JSON PREFIX 1 "product:" LANGUAGE chinese SCHEMA $.id AS id NUMERIC $.name AS name TEXT $.subTitle AS subTitle TEXT $.price AS price NUMERIC SORTABLE $.brandName AS brandName TAG
```

*   建立完索引后，我们就可以使用`FT.SEARCH`对数据进行查看了，比如使用`*`可以查询全部；

```bash
FT.SEARCH productIdx *
```

![](/images/jueJin/2aa44b56af4f4bb.png)

*   由于我们设置了`price`字段为`SORTABLE`，我们可以以`price`降序返回商品信息；

```bash
FT.SEARCH productIdx * SORTBY price DESC
```

![](/images/jueJin/8eb5f5ee6cae4ac.png)

*   还可以指定返回的字段；

```bash
FT.SEARCH productIdx * RETURN 3 name subTitle price
```

![](/images/jueJin/4d092db72d8e410.png)

*   我们把`brandName`设置为了`TAG`类型，我们可以使用如下语句查询品牌为`小米`或`苹果`的商品；

```bash
FT.SEARCH productIdx '@brandName:{小米 | 苹果}'
```

![](/images/jueJin/ec765ff77200497.png)

*   由于`price`是`NUMERIC`类型，我们可以使用如下语句查询价格在`500~1000`的商品；

```bash
FT.SEARCH productIdx '@price:[500 1000]'
```

![](/images/jueJin/d81a8a7792984bb.png)

*   还可以通过前缀进行模糊查询，类似于SQL中的`LIKE`，使用`*`表示；

```bash
FT.SEARCH productIdx '@name:小米*'
```

![](/images/jueJin/a80657114a7f46f.png)

*   在`FT.SEARCH`中直接指定搜索关键词，可以对所有`TEXT`类型的属性进行全局搜索，支持中文搜索，比如我们搜索下包含`黑色`字段的商品；

```bash
FT.SEARCH productIdx '黑色'
```

![](/images/jueJin/5a42da3318f348a.png)

*   当然我们也可以指定搜索的字段，比如搜索副标题中带有`红色`字段的商品；

```bash
FT.SEARCH productIdx '@subTitle:红色'
```

![](/images/jueJin/61f33179bcdf49b.png)

*   通过`FT.DROPINDEX`命令可以删除索引，如果加入`DD`选项的话，会连数据一起删除；

```bash
FT.DROPINDEX productIdx
```

*   通过`FT.INFO`命令可以查看索引状态；

```bash
FT.INFO productIdx
```

![](/images/jueJin/e238d25815324a7.png)

*   RediSearch的搜索语法比较复杂，不过我们可以对比SQL来使用它，具体可以参考下表。

![](/images/jueJin/34e90a5a2527471.png)

对比Elasticsearch
---------------

> Redis官方曾公布了RediSearch与Elasticsearch的性能对比测试，大家可以看下。

### 索引能力

对Wikipedia的560万（5.3GB）文档进行索引，RediSearch耗时`221s`，Elasticsearch耗时`349s`，RediSearch快了`58%`！

![](/images/jueJin/cbe0c03cd90446c.png)

### 查询能力

数据建立索引后，使用32个客户端对两个单词进行检索，RediSearch的吞吐量达到`12.5K ops/sec`，Elasticsearch的吞吐量为`3.1K ops/sec`，RediSearch比Elasticsearch要快`4倍`。同时RediSearch的延迟为`8ms`，而Elasticsearch为`10ms`，RediSearch延迟稍微低些！

![](/images/jueJin/e41afaa99111419.png)

总结
--

经过这么多年的发展，Redis的功能也越来越强大了，它已经不仅仅是个缓存工具了，更像是一个数据库了。RediSearch给了我们实现搜索功能的另一个选择，性能也非常不错，大家如果做搜索相关功能的话可以考虑下它！

如果你想了解更多Redis实战技巧的话，可以试试这个带全套教程的实战项目（50K+Star）：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

参考资料
----

*   官方文档：[developer.redis.com/howtos/redi…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.redis.com%2Fhowtos%2Fredisjson%2F "https://developer.redis.com/howtos/redisjson/")
*   参考手册：[oss.redis.com/redisearch/](https://link.juejin.cn?target=https%3A%2F%2Foss.redis.com%2Fredisearch%2F "https://oss.redis.com/redisearch/")
*   性能测试：[redis.com/blog/search…](https://link.juejin.cn?target=https%3A%2F%2Fredis.com%2Fblog%2Fsearch-benchmarking-redisearch-vs-elasticsearch%2F "https://redis.com/blog/search-benchmarking-redisearch-vs-elasticsearch/")