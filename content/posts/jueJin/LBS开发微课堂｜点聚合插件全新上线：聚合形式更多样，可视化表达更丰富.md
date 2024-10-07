---
author: "百度地图开放平台"
title: "LBS开发微课堂｜点聚合插件全新上线：聚合形式更多样，可视化表达更丰富"
date: 2024-09-26
description: "地图点聚合技术在多个行业有着广泛应用，它能将大量的地理数据点聚合成簇，能够有效提提升数据的可视化效果和用户体验。"
tags: ["前端"]
ShowReadingTime: "阅读8分钟"
weight: 574
---
为了让广大的开发者

更深入地了解

百度地图开放平台的技术能力

轻松掌握满满的技术干货

更加简单地接入

开放平台的服务

我们特别推出了

“位置服务（LBS）开发微课堂”

系列技术案例

第三期的主题是

《点聚合插件全新上线》

地图点聚合技术在多个行业有着广泛应用，它能将大量的地理数据点聚合成簇，能够有效提提升数据的可视化效果和用户体验。

比如，在环境监测中可展示空气质量监测站的分布数据；快递公司能借此展示配送点的分布情况；零售连锁店可呈现其门店的分布和销售数据；旅游平台能展示各地景点和酒店的数量分布；智慧城市平台可展示公交车站、停车场等设施的分布和实时状态；房地产网站能展示各地区的房源分布和价格情况；出行平台则可显示附近的共享单车、网约车等的数量和位置。

![1.jpeg](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/edb46d0417f44d9e8dc219e4e6fe83aa~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55m-5bqm5Zyw5Zu-5byA5pS-5bmz5Y-w:q75.awebp?rk3s=f64ab15b&x-expires=1728541977&x-signature=aLU3dWLk%2FGJRoFv95%2B%2F49ehFRsg%3D)

**01** **聚合形式更多样**

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/7d0eb884605447388b5b554cb4f54297~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55m-5bqm5Zyw5Zu-5byA5pS-5bmz5Y-w:q75.awebp?rk3s=f64ab15b&x-expires=1728541977&x-signature=cf%2F7GuP6Nuy9BLT1xPmBEzqGyQA%3D)

此次推出的地图点聚合插件提供了一系列专业且灵活的聚合方式，包括基于距离的聚合、基于距离的加权聚合、基于距离的分类聚合、基于属性的分类聚合、基于地理围栏的聚合，以及可分层级设置聚合。

这些多样化的聚合策略使用户能够高效地管理和展示地理数据点，以满足复杂的空间分析与展示需求。

**1.1 实现思路**

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/88bfc4dac03444d4849110e1d8da8d0a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55m-5bqm5Zyw5Zu-5byA5pS-5bmz5Y-w:q75.awebp?rk3s=f64ab15b&x-expires=1728541977&x-signature=3UciaBZNUejjRrwaETxuzdDPVH0%3D)

首先，处理用户定义的聚合类型参数，生成一个【地图层级-聚合形式】映射表。

随后，从聚合图层的地图最大层级到最小层级，依次查询相应的「聚合形式」并执行数据聚合。

接着，我们根据地图层级和窗口的地理范围进行数据检索，以获取聚合点和离散点信息。

最后，通过对比当前渲染点数据与窗口内的点数据，并结合配置的渲染条件，执行最终的渲染操作。

分层级聚合类型设置示例：

css

 代码解读

复制代码

`[    // [开始层级，结束层级，聚合类型，限制条件]     [3,5,Cluster.ClusterType.GEO_FENCE,['京津冀','长三角']],     [6,9,Cluster.ClusterType.ATTR_REF,'province'],     [10,,Cluster.ClusterType.DIS_PIXEL,20] ]`

**1.2 按距离聚合**

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/108a0a9e720a408c837e8634822f529b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55m-5bqm5Zyw5Zu-5byA5pS-5bmz5Y-w:q75.awebp?rk3s=f64ab15b&x-expires=1728541977&x-signature=ahD5P46YhJrWuCilGO6RESR11N0%3D)

首先，生成全部离散点 k-d 树，为后续的距离点检索做准备。

然后，根据地图层级和页面像素单位距离，从上一层级的结果 k-d 树中遍历节点：

① 如果当前节点是否已经处理过，则跳过，否则进行下一步；

② 检索距离内的节点集合，如果用户设置了分类限制，则需要进行节点集合的过滤；

③ 遍历节点集合，统计非处理过的数据的聚合点数量；

④ 如果聚合点数量不满足最低聚合点数量要求，则不进行聚合处理，直接标记当前节点以及聚合点集合节点已经处理；

⑤ 如果聚合点数量满足最低聚合点数量要求，则进行聚合点坐标加权处理，并标记当前节点以及聚合点集合节点已经处理。

最后，聚合处理结果数据生成本层级的 k-d 树，并进行下一层级的聚合计算流程，直至距离聚合层级结束。

**1.3** **按属性分类聚合**

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/77028a1e4c4a4377a3af52b351b5ba44~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55m-5bqm5Zyw5Zu-5byA5pS-5bmz5Y-w:q75.awebp?rk3s=f64ab15b&x-expires=1728541977&x-signature=%2Fl3OVvc4NjStwwir9qHMWS3SgEk%3D)

首先，遍历离散点数据，提取每个离散点的分类属性值作为键，并将其添加到分组数据集中。

接着，根据这些键匹配相应的地理坐标数据。

最终，将分组结果映射到k-d树结构中。

**1.4** **按地理围栏聚合**

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/34810cb8e447466488bda4689d14faec~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55m-5bqm5Zyw5Zu-5byA5pS-5bmz5Y-w:q75.awebp?rk3s=f64ab15b&x-expires=1728541977&x-signature=qdns7vroQlMfZjqhyQivFydgpSM%3D)

首先，根据地理围栏标识匹配对应的地理几何范围及中心点坐标。

接着，遍历离散点数据，提取当前离散点并与地理围栏进行空间运算，将归属于特定围栏标识的点添加到分组数据集中。

最终，将得到的围栏分组结果映射到k-d树结构中。

**02** **支持聚合点数据处理**

**2.1** **累加器模式**

支持聚合点累计数据，如聚合点中可实现按属性字段分类统计。

如果产品设计需要在聚合点罗列相同类型的离散点数量，那么可以使用累加器模式。

以下图为例，POI点聚合可视化中，聚合点罗列相同类别POI数量统计的可视化效果。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/e85452123dfb4d0193b93e1bbebbf40e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55m-5bqm5Zyw5Zu-5byA5pS-5bmz5Y-w:q75.awebp?rk3s=f64ab15b&x-expires=1728541977&x-signature=ZabQu2q8sytmgT8fqhv6MUO4MfM%3D)

使用累加器可视化效果图

核心实现代码：

javascript

 代码解读

复制代码

`// 构造函数部分字段定义 {     clusterMap: (props) => { // 累加器基础单元定义         let data = {             '景点': 0,             '美食': 0,             '娱乐': 0,             '其他': 0         }         // type 为离散点属性字段， 1: 景点 2: 美食 3: 娱乐 4：其他         data[['景点', '美食', '娱乐', '其他'][props.type - 1]] += 1;         return data;     },     clusterReduce: (accumulated, props) => { // 累加器计算定义         for (let key in props) {             accumulated[key] += props[key];         }     },     renderClusterStyle: { // 聚合点样式设置         type: Cluster.ClusterRender.DOM,         inject: (props) => {             let reduces = props.reduces;                  if (reduces) {                 // 聚合点累加数据遍历                 for (let key in reduces) {                     console.log(key,reduces[key]);                 }             }                  // ......省略UI生成代码         }     } }`

**2.2** **抽取离散点**

支持聚合点展示其所聚合的部分离散点的数据。

如果产品设计需要在聚合点罗列包含的部分离散点，那么可以使用抽取离散点功能。

以下图为例，小区图点聚合可视化中，聚合点罗列其中最多3个小区图片的可视化效果。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/28c1ca0f3f7242b1b4f8d8cc0901ba1a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55m-5bqm5Zyw5Zu-5byA5pS-5bmz5Y-w:q75.awebp?rk3s=f64ab15b&x-expires=1728541977&x-signature=CQwpSxAQO8VUaEkaNx6nI1umZV8%3D)

抽取离散点功能可视化效果图

核心实现代码：

javascript

 代码解读

复制代码

`// 构造函数部分字段定义 {      clusterListChildren: 3, // 抽取数量     renderClusterStyle: {         type: Cluster.ClusterRender.DOM,         inject: (props: Cluster.IClusterDataset) => {           // 聚合点抽取离散点数据遍历           props.listChildren.forEach((item) => {             console.log('cluster_item', item);           });           // ......省略UI生成代码         }     }, }`

**03**

**可视化表达更丰富**

此次推出的@bmapgl-plugin/cluster 插件，能够实现更为丰富的可视化表达：

*   **聚合点:** 通过使用具有不同颜色、大小或形状的图标或 UI 布局，可以清晰地表示不同数量的聚合点；
    
*   **离散点:** 可以使用不同颜色、形状的图标或者 UI 布局来表示不同类型的地图点；
    
*   **动画展示：** 可以帮助用户更直观地理解数据的分布和变化过程；
    
*   **交互式地图:** 支持放大、缩小、平移、点击等交互操作，以便用户查看不同层级的数据。
    

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/6b0338e3455f4733bed12643b6cda86d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55m-5bqm5Zyw5Zu-5byA5pS-5bmz5Y-w:q75.awebp?rk3s=f64ab15b&x-expires=1728541977&x-signature=4uvtp34Ez0nTCZTLLo19qnBvqsg%3D)

核心实现代码：

go

 代码解读

复制代码

`// 构造函数部分字段定义 {    isAnimation:true, // 是否启用动画   renderClusterStyle: {     type: Cluster.ClusterRender.DOM,     style:{         clusterAnimation:{ // 动画参数设置             duration: 400,             onlyNew: 'node_fladein', // 新节点显示动画样式名设置             delayNew: 'node_fladein-delay', // 聚合节点显示动画样式名设置             moveNew: 'node_fladein', // 离散节点显示过程动画样式名设置             delayRemove: 'node_fladeout', // 聚合节点消失动画样式名设置             moveRemove: 'node_fladeout' // 离散节点消失过程动画样式名设置         }     }, }`

**04** **性能优化，提升用户体验**

在性能方面，@bmapgl-plugin/cluster 插件也实现了显著的提升：

*   **数据缓存：** 通过构建 k-d 树结构的空间数据索引，加速数据查询和聚合运算；
    
*   **渐进式加载：** 根据地图缩放级别和视窗范围，动态加载和展示数据；
    
*   **增量式更新：** 当前展示数据与待更新数据比对，当前缺失的添加展示，多余的移除展示。
    

**4.1** **数据缓存**

k-d 树是一种用于组织 k 维空间点的二叉搜索树（BST），它被广泛应用于多维数据信息的管理和查询。

在点聚合应用中，进行范围搜索（range search）或最近邻搜索（nearest neighbor search）时，树结构允许快速排除大量不相关的区域，从而提高效率。

**4.2 渐进式加载**

在地理数据可视化中，特别是处理大型数据集时，可以先加载和显示一部分数据，然后逐步加载剩余数据。

此技术具备减少初始加载时间、提升用户体验、资源优化等优点。

**4.3 增量式更新**

在点聚合数据初始加载完成之后，地图交互发生时，只对数据的变化部分进行加载、更新和渲染，而不是重新加载整个数据集。

用户可以实时看到数据的更新，而不需要长时间等待整个数据集的重新加载或者页面渲染数据出现明显闪烁现象。

![](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ccc03ee55262438bad9b980630a465e0~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55m-5bqm5Zyw5Zu-5byA5pS-5bmz5Y-w:q75.awebp?rk3s=f64ab15b&x-expires=1728541977&x-signature=7Qf6wccK%2F0XvBKH2POnrlWgIUMc%3D)

全新的点聚合插件@bmapgl-plugin/cluster已经发布，欢迎开发者前往百度地图开放平台官网JS API开发文档查看使用。

后续更多的可视化插件，敬请期待！

·END·

你还想了解哪些技术内容？

快来评论区留言告诉我们吧！