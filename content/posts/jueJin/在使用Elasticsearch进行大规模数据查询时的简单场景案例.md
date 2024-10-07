---
author: "一只爱撸猫的程序猿"
title: "在使用Elasticsearch进行大规模数据查询时的简单场景案例"
date: 2024-09-28
description: "在使用Elasticsearch（简称ES）进行大规模数据查询时，面对大量数据可能会遇到查询效率低的问题。我们可以通过多种手段优化查询效率，包括索引设计优化、查询语句优化、缓存机制、分页查询等。"
tags: ["Elasticsearch","SpringBoot","程序员"]
ShowReadingTime: "阅读4分钟"
weight: 233
---
在使用Elasticsearch（简称ES）进行大规模数据查询时，面对大量数据可能会遇到查询效率低的问题。我们可以通过多种手段优化查询效率，包括索引设计优化、查询语句优化、缓存机制、分页查询等。

下面的场景是一个电商平台的订单查询系统，用户可以通过前端对订单进行各种维度的查询，比如根据订单状态、订单创建时间区间、用户ID、商品ID等进行组合查询。假设订单数据量非常大，因此我们需要通过各种手段优化查询性能。

#### 关键优化点：

1.  **ES索引优化**：设置适当的分片和副本数，使用合适的mapping，避免不必要的字段进行全文检索。
2.  **查询优化**：使用`match`查询代替`term`查询，对于大数据量的情况，使用scroll分页查询或`search_after`进行深度分页优化。
3.  **缓存和异步查询**：结合Redis进行缓存，避免频繁访问ES，并通过异步查询进一步提升响应性能。

#### 实例场景：

我们创建一个Spring Boot项目，用户通过API进行订单查询，后端通过Elasticsearch查询并返回结果，同时应用缓存和分页查询进行优化。

##### 步骤1：Spring Boot 项目依赖

xml

 代码解读

复制代码

`<dependencies>     <!-- Spring Boot 依赖 -->     <dependency>         <groupId>org.springframework.boot</groupId>         <artifactId>spring-boot-starter-web</artifactId>     </dependency>     <!-- Elasticsearch 客户端 -->     <dependency>         <groupId>org.springframework.boot</groupId>         <artifactId>spring-boot-starter-data-elasticsearch</artifactId>     </dependency>     <!-- Redis 缓存 -->     <dependency>         <groupId>org.springframework.boot</groupId>         <artifactId>spring-boot-starter-data-redis</artifactId>     </dependency>     <!-- Lombok -->     <dependency>         <groupId>org.projectlombok</groupId>         <artifactId>lombok</artifactId>         <scope>provided</scope>     </dependency> </dependencies>`

##### 步骤2：ES索引Mapping设计

json

 代码解读

复制代码

`{   "mappings": {     "properties": {       "order_id": {         "type": "keyword"       },       "user_id": {         "type": "keyword"       },       "product_id": {         "type": "keyword"       },       "status": {         "type": "integer"       },       "created_at": {         "type": "date",         "format": "yyyy-MM-dd'T'HH:mm:ss.SSSZ||epoch_millis"       },       "total_price": {         "type": "double"       }     }   } }`

该索引设计中，将`order_id`、`user_id`、`product_id`等设置为`keyword`类型，不会进行全文索引，节省性能消耗。`created_at`为`date`类型，以便可以进行时间范围查询。

##### 步骤3：Spring Data Elasticsearch 配置

java

 代码解读

复制代码

`@Configuration public class ElasticSearchConfig extends AbstractElasticsearchConfiguration {     @Override     @Bean     public RestHighLevelClient elasticsearchClient() {         ClientConfiguration clientConfiguration = ClientConfiguration.builder()             .connectedTo("localhost:9200")             .build();         return RestClients.create(clientConfiguration).rest();     } }`

##### 步骤4：订单实体类

java

 代码解读

复制代码

`@Data @Document(indexName = "orders") public class Order {     @Id     private String orderId;     private String userId;     private String productId;     private Integer status;     private Date createdAt;     private Double totalPrice; }`

##### 步骤5：Repository接口

java

 代码解读

复制代码

`public interface OrderRepository extends ElasticsearchRepository<Order, String> { }`

##### 步骤6：查询服务类

这里实现了分页查询，并使用了`search_after`进行深度分页优化，防止在大量数据时性能急剧下降。同时使用Redis缓存最近查询的结果。

java

 代码解读

复制代码

`@Service @RequiredArgsConstructor public class OrderService {     private final RestHighLevelClient client;     private final RedisTemplate<String, List<Order>> redisTemplate;     private final OrderRepository orderRepository;     public List<Order> searchOrders(String userId, String productId, Integer status, Date startTime, Date endTime, String searchAfter, int pageSize) throws IOException {         // 首先检查缓存         String cacheKey = generateCacheKey(userId, productId, status, startTime, endTime, searchAfter);         List<Order> cachedOrders = redisTemplate.opsForValue().get(cacheKey);         if (cachedOrders != null) {             return cachedOrders;         }         // 构建查询条件         BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery();         if (userId != null) {             queryBuilder.must(QueryBuilders.termQuery("user_id", userId));         }         if (productId != null) {             queryBuilder.must(QueryBuilders.termQuery("product_id", productId));         }         if (status != null) {             queryBuilder.must(QueryBuilders.termQuery("status", status));         }         if (startTime != null && endTime != null) {             queryBuilder.must(QueryBuilders.rangeQuery("created_at").gte(startTime.getTime()).lte(endTime.getTime()));         }         // 分页，使用 search_after 进行深度分页         SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()             .query(queryBuilder)             .size(pageSize)             .sort("created_at", SortOrder.DESC);         if (searchAfter != null) {             searchSourceBuilder.searchAfter(new Object[]{searchAfter});         }         SearchRequest searchRequest = new SearchRequest("orders");         searchRequest.source(searchSourceBuilder);         SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);         List<Order> orders = Arrays.stream(searchResponse.getHits().getHits())             .map(hit -> {                 // 这里可以使用 ObjectMapper 进行 JSON 到 Order 的转换                 return mapToOrder(hit.getSourceAsMap());             }).collect(Collectors.toList());         // 将查询结果缓存         redisTemplate.opsForValue().set(cacheKey, orders, 10, TimeUnit.MINUTES);         return orders;     }     private String generateCacheKey(String userId, String productId, Integer status, Date startTime, Date endTime, String searchAfter) {         return String.format("order_search:%s:%s:%d:%s:%s:%s", userId, productId, status,             startTime != null ? startTime.getTime() : "",             endTime != null ? endTime.getTime() : "",             searchAfter);     }     private Order mapToOrder(Map<String, Object> sourceMap) {         // 这里进行数据的转换，从Map到Order实体对象         Order order = new Order();         order.setOrderId((String) sourceMap.get("order_id"));         order.setUserId((String) sourceMap.get("user_id"));         order.setProductId((String) sourceMap.get("product_id"));         order.setStatus((Integer) sourceMap.get("status"));         order.setCreatedAt(new Date((Long) sourceMap.get("created_at")));         order.setTotalPrice((Double) sourceMap.get("total_price"));         return order;     } }`

##### 步骤7：控制器层

java

 代码解读

复制代码

`@RestController @RequestMapping("/api/orders") @RequiredArgsConstructor public class OrderController {     private final OrderService orderService;     @GetMapping("/search")     public List<Order> searchOrders(         @RequestParam(required = false) String userId,         @RequestParam(required = false) String productId,         @RequestParam(required = false) Integer status,         @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startTime,         @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endTime,         @RequestParam(required = false) String searchAfter,         @RequestParam(defaultValue = "10") int pageSize     ) throws IOException {         return orderService.searchOrders(userId, productId, status, startTime, endTime, searchAfter, pageSize);     } }`

#### 关键点总结：

1.  **`search_after`深度分页**：避免在大量数据情况下使用普通分页的性能问题。
2.  **Redis缓存**：对于高频查询的结果进行缓存，减少Elasticsearch查询压力。
3.  **查询优化**：通过条件组合查询，避免不必要的全局检索。

通过以上的设计，可以极大提升大数据量场景下的查询性能。在实际项目中，还可以根据需要扩展为异步查询、批量查询等。