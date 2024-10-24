---
author: "MacroZheng"
title: "MyBatis-Plus同款Elasticsearch ORM框架，用起来够优雅！"
date: 2022-10-18
description: "使用过Spring Data操作ES的小伙伴应该有所了解，它只能实现一些非常基本的数据管理工作。推荐一款最近发现的更优雅的ES ORM框架，使用它能像MyBatis-Plus一样操作ES！"
tags: ["Java","后端","Elasticsearch中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:137,comments:0,collects:338,views:16308,"
---
> 使用过Spring Data操作ES的小伙伴应该有所了解，它只能实现一些非常基本的数据管理工作，一旦遇到稍微复杂点的查询，基本都要依赖ES官方提供的RestHighLevelClient，Spring Data只是在其基础上进行了简单的封装。最近发现一款更优雅的ES ORM框架`Easy-Es`，使用它能像MyBatis-Plus一样操作ES，今天就以mall项目中的商品搜索功能为例，来聊聊它的使用！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

Easy-Es简介
---------

Easy-Es（简称EE）是一款基于Elasticsearch（简称ES）官方提供的RestHighLevelClient打造的ORM开发框架，在RestHighLevelClient的基础上，只做增强不做改变，为简化开发、提高效率而生。EE和Mybatis-Plus（简称MP）的用法非常相似，如果你之前使用过MP的话，应该能很快上手EE。EE的理念是：把简单、易用、方便留给用户，把复杂留给框架。

EE的主要特性如下：

*   全自动索引托管：开发者无需关心索引的创建、更新及数据迁移等繁琐步骤，框架能自动完成。
*   屏蔽语言差异：开发者只需要会MySQL的语法即可使用ES。
*   代码量极少：与直接使用官方提供的RestHighLevelClient相比，相同的查询平均可以节省3-5倍的代码量。
*   零魔法值：字段名称直接从实体中获取，无需手写。
*   零额外学习成本: 开发者只要会国内最受欢迎的Mybatis-Plus用法，即可无缝迁移至EE。

MySQL与Easy-Es语法对比
-----------------

首先我们来对MySQL、Easy-Es和RestHighLevelClient的语法做过对比，来快速学习下Easy-Es的语法。

MySQL

Easy-Es

es-DSL/es java api

and

and

must

or

or

should

\=

eq

term

!=

ne

boolQueryBuilder.mustNot(queryBuilder)

gt

QueryBuilders.rangeQuery('es field').gt()

\>=

ge

.rangeQuery('es field').gte()

<

lt

.rangeQuery('es field').lt()

<=

le

.rangeQuery('es field').lte()

like '%field%'

like

QueryBuilders.wildcardQuery(field,_value_)

not like '%field%'

notLike

must not wildcardQuery(field,_value_)

like '%field'

likeLeft

QueryBuilders.wildcardQuery(field,\*value)

like 'field%'

likeRight

QueryBuilders.wildcardQuery(field,value\*)

between

between

QueryBuilders.rangeQuery('es field').from(xx).to(xx)

notBetween

notBetween

must not QueryBuilders.rangeQuery('es field').from(xx).to(xx)

is null

isNull

must not QueryBuilders.existsQuery(field)

is notNull

isNotNull

QueryBuilders.existsQuery(field)

in

in

QueryBuilders.termsQuery(" xx es field", xx)

not in

notIn

must not QueryBuilders.termsQuery(" xx es field", xx)

group by

groupBy

AggregationBuilders.terms()

order by

orderBy

fieldSortBuilder.order(ASC/DESC)

min

min

AggregationBuilders.min

max

max

AggregationBuilders.max

avg

avg

AggregationBuilders.avg

sum

sum

AggregationBuilders.sum

order by xxx asc

orderByAsc

fieldSortBuilder.order(SortOrder.ASC)

order by xxx desc

orderByDesc

fieldSortBuilder.order(SortOrder.DESC)

\-

match

matchQuery

\-

matchPhrase

QueryBuilders.matchPhraseQuery

\-

matchPrefix

QueryBuilders.matchPhrasePrefixQuery

\-

queryStringQuery

QueryBuilders.queryStringQuery

select \*

matchAllQuery

QueryBuilders.matchAllQuery()

\-

highLight

HighlightBuilder.Field

...

...

...

集成及配置
-----

> 接下来把Easy-Es集成到项目中配置下就可以使用了。

*   首先需要在`pom.xml`中添加Easy-Es的相关依赖；

```xml
<dependency>
<groupId>cn.easy-es</groupId>
<artifactId>easy-es-boot-starter</artifactId>
<version>1.0.2</version>
</dependency>
```

*   由于底层使用了ES官方提供的RestHighLevelClient，这里ES的相关依赖版本需要统一下，这里使用的ES客户端版本为`7.14.0`，ES版本为`7.17.3`；

```xml
<dependencyManagement>
<dependencies>
<dependency>
<groupId>org.elasticsearch.client</groupId>
<artifactId>elasticsearch-rest-high-level-client</artifactId>
<version>7.14.0</version>
</dependency>
<dependency>
<groupId>org.elasticsearch</groupId>
<artifactId>elasticsearch</artifactId>
<version>7.14.0</version>
</dependency>
</dependencies>
</dependencyManagement>
```

*   再修改配置文件`application.yml`对Easy-Es进行配置。

```yaml
easy-es:
# 是否开启EE自动配置
enable: true
# ES连接地址+端口
address: localhost:9200
# 关闭自带banner
banner: false
```

*   添加Easy-Es的Java配置，使用`@EsMapperScan`配置好Easy-Es的Mapper接口和文档对象路径，如果你使用了MyBatis-Plus的话，需要和它的扫描路径区分开来。

```java
/**
* EasyEs配置类
* Created by macro on 2022/9/16.
*/
@Configuration
@EsMapperScan("com.macro.mall.tiny.easyes")
    public class EasyEsConfig {
}
```

使用
--

> Easy-Es集成和配置完成后，就可以开始使用了。这里还是以`mall`项目的商品搜索功能为例，聊聊Easy-Es的使用，Spring Data的实现方式可以参考[Elasticsearch项目实战，商品搜索功能设计与实现！](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FLWMfvav74SnXXwSJxVV_Fw "https://mp.weixin.qq.com/s/LWMfvav74SnXXwSJxVV_Fw") 。

### 注解的使用

> 下面我们来学习下Easy-Es中注解的使用。

*   首先我们需要创建文档对象`EsProduct`，然后给类和字段添加上Easy-Es的注解；

```java
/**
* 搜索商品的信息
* Created by macro on 2018/6/19.
*/
@Data
@EqualsAndHashCode
@IndexName(value = "pms", shardsNum = 1, replicasNum = 0)
    public class EsProduct implements Serializable {
    private static final long serialVersionUID = -1L;
    @IndexId(type = IdType.CUSTOMIZE)
    private Long id;
    @IndexField(fieldType = FieldType.KEYWORD)
    private String productSn;
    private Long brandId;
    @IndexField(fieldType = FieldType.KEYWORD)
    private String brandName;
    private Long productCategoryId;
    @IndexField(fieldType = FieldType.KEYWORD)
    private String productCategoryName;
    private String pic;
    @IndexField(fieldType = FieldType.TEXT, analyzer = "ik_max_word")
    private String name;
    @IndexField(fieldType = FieldType.TEXT, analyzer = "ik_max_word")
    private String subTitle;
    @IndexField(fieldType = FieldType.TEXT, analyzer = "ik_max_word")
    private String keywords;
    private BigDecimal price;
    private Integer sale;
    private Integer newStatus;
    private Integer recommandStatus;
    private Integer stock;
    private Integer promotionType;
    private Integer sort;
    @IndexField(fieldType = FieldType.NESTED, nestedClass = EsProductAttributeValue.class)
    private List<EsProductAttributeValue> attrValueList;
    @Score
    private Float score;
}
```

*   EsProduct中的注解具体说明如下：

注解名称

用途

参数

@IndexName

索引名注解

value：指定索引名；shardsNum：分片数；replicasNum：副本数

@IndexId

ES主键注解

type：指定注解类型，CUSTOMIZE表示自定义

@IndexField

ES字段注解

fieldType：字段在索引中的类型；analyzer：索引文档时用的分词器；nestedClass：嵌套类

@Score

得分注解

decimalPlaces：得分保留小数位，实体类中被作为ES查询得分返回的字段使用

*   EsProduct中嵌套类型EsProductAttributeValue的代码如下。

```java
/**
* 搜索商品的属性信息
* Created by macro on 2018/6/27.
*/
@Data
@EqualsAndHashCode
    public class EsProductAttributeValue implements Serializable {
    private static final long serialVersionUID = 1L;
    @IndexField(fieldType = FieldType.LONG)
    private Long id;
    @IndexField(fieldType = FieldType.KEYWORD)
    private Long productAttributeId;
    //属性值
    @IndexField(fieldType = FieldType.KEYWORD)
    private String value;
    //属性参数：0->规格；1->参数
    @IndexField(fieldType = FieldType.INTEGER)
    private Integer type;
    //属性名称
    @IndexField(fieldType=FieldType.KEYWORD)
    private String name;
}
```

### 商品信息维护

> 下面我们来实现几个简单的商品信息维护接口，包括商品信息的导入、创建和删除。

*   首先我们需要定义一个Mapper，继承BaseEsMapper；

```java
/**
* 商品ES操作类
* Created by macro on 2018/6/19.
*/
    public interface EsProductMapper extends BaseEsMapper<EsProduct> {
    
}
```

*   然后在Service实现类中直接使用EsProductMapper内置方法实现即可，是不是和MyBatis-Plus的用法一致？

```java
/**
* 搜索商品管理Service实现类
* Created by macro on 2018/6/19.
*/
@Service
    public class EsProductServiceImpl implements EsProductService {
    @Autowired
    private EsProductDao productDao;
    @Autowired
    private EsProductMapper esProductMapper;
    @Override
        public int importAll() {
        List<EsProduct> esProductList = productDao.getAllEsProductList(null);
        return esProductMapper.insertBatch(esProductList);
    }
    
    @Override
        public void delete(Long id) {
        esProductMapper.deleteById(id);
    }
    
    @Override
        public EsProduct create(Long id) {
        EsProduct result = null;
        List<EsProduct> esProductList = productDao.getAllEsProductList(id);
            if (esProductList.size() > 0) {
            result = esProductList.get(0);
            esProductMapper.insert(result);
        }
        return result;
    }
    
    @Override
        public void delete(List<Long> ids) {
            if (!CollectionUtils.isEmpty(ids)) {
            esProductMapper.deleteBatchIds(ids);
        }
    }
}
```

### 简单商品搜索

> 下面我们来实现一个最简单的商品搜索，分页搜索商品名称、副标题、关键词中包含指定关键字的商品。

*   通过QueryWrapper来构造查询条件，然后使用Mapper中的方法来进行查询，使用过MyBatis-Plus的小伙伴应该很熟悉了；

```java
/**
* 搜索商品管理Service实现类
* Created by macro on 2018/6/19.
*/
@Service
    public class EsProductServiceImpl implements EsProductService {
    @Autowired
    private EsProductMapper esProductMapper;
    @Override
        public PageInfo<EsProduct> search(String keyword, Integer pageNum, Integer pageSize) {
        LambdaEsQueryWrapper<EsProduct> wrapper = new LambdaEsQueryWrapper<>();
            if(StrUtil.isEmpty(keyword)){
            wrapper.matchAllQuery();
                }else{
                wrapper.multiMatchQuery(keyword,EsProduct::getName,EsProduct::getSubTitle,EsProduct::getKeywords);
            }
            return esProductMapper.pageQuery(wrapper, pageNum, pageSize);
        }
    }
```

*   使用Swagger访问接口后，可以在控制台输出查看生成的DSL语句，访问地址：[http://localhost:8080/swagger-ui/](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Fswagger-ui%2F "http://localhost:8080/swagger-ui/")

![](/images/jueJin/e1105f7e90ab467.png)

*   把DSL语句直接复制Kibana中即可执行查看结果了，这和我们手写DSL语句没什么两样的。

![](/images/jueJin/efe50e14700b42c.png)

### 综合商品搜索

> 下面我们来实现一个复杂的商品搜索，涉及到过滤、不同字段匹配权重不同以及可以进行排序。

*   首先来说需求，按输入的关键字搜索商品名称（权重10）、副标题（权重5）和关键词（权重2），可以按品牌和分类进行筛选，可以有5种排序方式，默认按相关度进行排序，看下接口文档有助于理解；

![](/images/jueJin/ec5f118c637d4f1.png)

*   这个功能之前使用Spring Data来实现非常复杂，使用Easy-Es来实现确实简洁不少，下面是使用Easy-Es的实现方式；

```java
/**
* 搜索商品管理Service实现类
* Created by macro on 2018/6/19.
*/
@Service
    public class EsProductServiceImpl implements EsProductService {
    @Autowired
    private EsProductMapper esProductMapper;
    @Override
        public PageInfo<EsProduct> search(String keyword, Long brandId, Long productCategoryId, Integer pageNum, Integer pageSize,Integer sort) {
        LambdaEsQueryWrapper<EsProduct> wrapper = new LambdaEsQueryWrapper<>();
        //过滤
            if (brandId != null || productCategoryId != null) {
                if (brandId != null) {
                wrapper.eq(EsProduct::getBrandId,brandId);
            }
                if (productCategoryId != null) {
                wrapper.eq(EsProduct::getProductCategoryId,productCategoryId).enableMust2Filter(true);
            }
        }
        //搜索
            if (StrUtil.isEmpty(keyword)) {
            wrapper.matchAllQuery();
                } else {
                wrapper.and(i -> i.match(EsProduct::getName, keyword, 10f)
                .or().match(EsProduct::getSubTitle, keyword, 5f)
                .or().match(EsProduct::getKeywords, keyword, 2f));
            }
            //排序
                if(sort==1){
                //按新品从新到旧
                wrapper.orderByDesc(EsProduct::getId);
                    }else if(sort==2){
                    //按销量从高到低
                    wrapper.orderByDesc(EsProduct::getSale);
                        }else if(sort==3){
                        //按价格从低到高
                        wrapper.orderByAsc(EsProduct::getPrice);
                            }else if(sort==4){
                            //按价格从高到低
                            wrapper.orderByDesc(EsProduct::getPrice);
                                }else{
                                //按相关度
                                wrapper.sortByScore(SortOrder.DESC);
                            }
                            return esProductMapper.pageQuery(wrapper, pageNum, pageSize);
                        }
                    }
```

*   再对比下之前使用Spring Data的实现方式，没有QueryWrapper来构造条件，还要硬编码字段名称，确实优雅了不少！

![](/images/jueJin/65aee214854f418.png)

### 相关商品推荐

> 当我们查看相关商品的时候，一般底部会有一些商品推荐，这里简单来实现下。

*   首先来说下需求，可以根据指定商品的ID来查找相关商品，看下接口文档有助于理解；

![](/images/jueJin/c0e4ccc1691941c.png)

*   这里我们的实现原理是这样的：首先根据ID获取指定商品信息，然后以指定商品的名称、品牌和分类来搜索商品，并且要过滤掉当前商品，调整搜索条件中的权重以获取最好的匹配度；
    
*   使用Easy-Es来实现依旧是那么简洁！
    

```java
/**
* 搜索商品管理Service实现类
* Created by macro on 2018/6/19.
*/
@Service
    public class EsProductServiceImpl implements EsProductService {
    @Autowired
    private EsProductMapper esProductMapper;
    @Override
        public PageInfo<EsProduct> recommend(Long id, Integer pageNum, Integer pageSize) {
        LambdaEsQueryWrapper<EsProduct> wrapper = new LambdaEsQueryWrapper<>();
        List<EsProduct> esProductList = productDao.getAllEsProductList(id);
            if (esProductList.size() > 0) {
            EsProduct esProduct = esProductList.get(0);
            String keyword = esProduct.getName();
            Long brandId = esProduct.getBrandId();
            Long productCategoryId = esProduct.getProductCategoryId();
            //用于过滤掉相同的商品
            wrapper.ne(EsProduct::getId,id);
            //根据商品标题、品牌、分类进行搜索
            wrapper.and(i -> i.match(EsProduct::getName, keyword, 8f)
            .or().match(EsProduct::getSubTitle, keyword, 2f)
            .or().match(EsProduct::getKeywords, keyword, 2f)
            .or().match(EsProduct::getBrandId, brandId, 5f)
            .or().match(EsProduct::getProductCategoryId, productCategoryId, 3f));
            return esProductMapper.pageQuery(wrapper, pageNum, pageSize);
        }
        return esProductMapper.pageQuery(wrapper, pageNum, pageSize);
    }
}
```

### 聚合搜索商品相关信息

> 在搜索商品时，经常会有一个筛选界面来帮助我们找到想要的商品，这里我们来简单实现下。

*   首先来说下需求，可以根据搜索关键字获取到与关键字匹配商品相关的分类、品牌以及属性，下面这张图有助于理解；

![](/images/jueJin/9d8a37a8264c442.png)

*   这里我们可以使用ES的聚合来实现，搜索出相关商品，聚合出商品的品牌、商品的分类以及商品的属性，只要出现次数最多的前十个即可；
    
*   由于Easy-Es目前只用`groupBy`实现了简单的聚合，对于我们这种有嵌套对象的聚合无法支持，所以需要使用RestHighLevelClient来实现，如果你对照之前的Spring Data实现方式的话，可以发现用法差不多，看样子Spring Data只是做了简单的封装而已。
    

```java
/**
* 搜索商品管理Service实现类
* Created by macro on 2018/6/19.
*/
@Service
    public class EsProductServiceImpl implements EsProductService {
    @Autowired
    private EsProductMapper esProductMapper;
    @Override
        public EsProductRelatedInfo searchRelatedInfo(String keyword) {
        SearchRequest searchRequest = new SearchRequest();
        searchRequest.indices("pms_*");
        SearchSourceBuilder builder = new SearchSourceBuilder();
        //搜索条件
            if (StrUtil.isEmpty(keyword)) {
            builder.query(QueryBuilders.matchAllQuery());
                } else {
                builder.query(QueryBuilders.multiMatchQuery(keyword, "name", "subTitle", "keywords"));
            }
            //聚合搜索品牌名称
            builder.aggregation(AggregationBuilders.terms("brandNames").field("brandName"));
            //集合搜索分类名称
            builder.aggregation(AggregationBuilders.terms("productCategoryNames").field("productCategoryName"));
            //聚合搜索商品属性，去除type=1的属性
            AbstractAggregationBuilder<NestedAggregationBuilder> aggregationBuilder = AggregationBuilders.nested("allAttrValues", "attrValueList")
            .subAggregation(AggregationBuilders.filter("productAttrs", QueryBuilders.termQuery("attrValueList.type", 1))
            .subAggregation(AggregationBuilders.terms("attrIds")
            .field("attrValueList.productAttributeId")
            .subAggregation(AggregationBuilders.terms("attrValues")
            .field("attrValueList.value"))
            .subAggregation(AggregationBuilders.terms("attrNames")
            .field("attrValueList.name"))));
            builder.aggregation(aggregationBuilder);
            searchRequest.source(builder);
                try {
                SearchResponse searchResponse = esProductMapper.search(searchRequest, RequestOptions.DEFAULT);
                return convertProductRelatedInfo(searchResponse);
                    } catch (IOException e) {
                    e.printStackTrace();
                }
                return null;
            }
            
            /**
            * 将返回结果转换为对象
            */
                private EsProductRelatedInfo convertProductRelatedInfo(SearchResponse response) {
                EsProductRelatedInfo productRelatedInfo = new EsProductRelatedInfo();
                Map<String, Aggregation> aggregationMap = response.getAggregations().asMap();
                //设置品牌
                Aggregation brandNames = aggregationMap.get("brandNames");
                List<String> brandNameList = new ArrayList<>();
                    for(int i = 0; i<((Terms) brandNames).getBuckets().size(); i++){
                    brandNameList.add(((Terms) brandNames).getBuckets().get(i).getKeyAsString());
                }
                productRelatedInfo.setBrandNames(brandNameList);
                //设置分类
                Aggregation productCategoryNames = aggregationMap.get("productCategoryNames");
                List<String> productCategoryNameList = new ArrayList<>();
                    for(int i=0;i<((Terms) productCategoryNames).getBuckets().size();i++){
                    productCategoryNameList.add(((Terms) productCategoryNames).getBuckets().get(i).getKeyAsString());
                }
                productRelatedInfo.setProductCategoryNames(productCategoryNameList);
                //设置参数
                Aggregation productAttrs = aggregationMap.get("allAttrValues");
                List<? extends Terms.Bucket> attrIds = ((ParsedStringTerms) ((ParsedFilter) ((ParsedNested) productAttrs).getAggregations().get("productAttrs")).getAggregations().get("attrIds")).getBuckets();
                List<EsProductRelatedInfo.ProductAttr> attrList = new ArrayList<>();
                    for (Terms.Bucket attrId : attrIds) {
                    EsProductRelatedInfo.ProductAttr attr = new EsProductRelatedInfo.ProductAttr();
                    attr.setAttrId(Long.parseLong((String) attrId.getKey()));
                    List<String> attrValueList = new ArrayList<>();
                    List<? extends Terms.Bucket> attrValues = ((ParsedStringTerms) attrId.getAggregations().get("attrValues")).getBuckets();
                    List<? extends Terms.Bucket> attrNames = ((ParsedStringTerms) attrId.getAggregations().get("attrNames")).getBuckets();
                        for (Terms.Bucket attrValue : attrValues) {
                        attrValueList.add(attrValue.getKeyAsString());
                    }
                    attr.setAttrValues(attrValueList);
                        if(!CollectionUtils.isEmpty(attrNames)){
                        String attrName = attrNames.get(0).getKeyAsString();
                        attr.setAttrName(attrName);
                    }
                    attrList.add(attr);
                }
                productRelatedInfo.setProductAttrs(attrList);
                return productRelatedInfo;
            }
        }
```

总结
--

今天将之前的使用Spring Data的商品搜索案例使用Easy-Es改写了一下，确实使用Easy-Es更简单，但是对于复杂的聚合搜索功能，两者都需要使用原生的RestHighLevelClient用法来实现。使用Easy-Es来操作ES确实足够优雅，它类似MyBatis-Plus的用法能大大降低我们的学习成本，快速完成开发工作！

参考资料
----

官方文档：[www.easy-es.cn/](https://link.juejin.cn?target=https%3A%2F%2Fwww.easy-es.cn%2F "https://www.easy-es.cn/")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-easyes "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-easyes")