---
author: "白晓明"
title: "HarmonyOS地图服务：深度解析其丰富功能与精准导航实力"
date: 2024-08-21
description: "HarmonyOS为开发者和用户带来了强大的地图功能支持，其中包括地图组件`MapComponent`以及地图组件的主要功能入口类`MapComponentController`。"
tags: ["前端","HarmonyOS"]
ShowReadingTime: "阅读14分钟"
weight: 566
---
> **关于作者**
> 
> 白晓明
> 
> 宁夏图尔科技有限公司董事长兼CEO、坚果派联合创始人
> 
> 华为HDE、润和软件HiHope社区专家、鸿蒙KOL、仓颉KOL
> 
> 华为开发者学堂/51CTO学堂/CSDN学堂认证讲师
> 
> 开放原子开源基金会2023开源贡献之星
> 
> OpenHarmony三方库贡献者
> 
> 公众号：开源开发者新视界（openwatcher）

在当今高度数字化时代，精准的地图服务已然成为我们日常生活与工作中不可或缺的重要组成部分。无论是日常出项规划路线，还是在工作中进行位置定位于导航，地图服务都发挥着关键作用。而HarmonyOS提供的地图服务（Map Kit）犹如一颗璀璨的明星，为开发者提供强大而便捷的地图能力，助力全球开发者实现个性化显示地图、位置搜索和路径规划等功能。地图服务（Map Kit）提供了全球3.2亿的Poi（Point of interest，兴趣点），在地图中一个Poi代表一家商铺、一栋办公楼、一处景点等等。其强大的功能涵盖创建地图、地图交互、在地图上绘制、位置搜索、路径规划、静态图、地图Picker、通过Petal地图应用实现导航等能力、地图计算工具等等，为用户提供了全方位的地图服务体验。具有广泛的应用场景，如物流配送、旅游出行、智能交通等等。

在接下来的内容中，将深入且全面地阐述地图服务所具备的创建地图这一重要功能。通过逐步剖析创建地图功能的具体实现方式，从技术层面解读其背后的原理和机制，深入探讨这一功能在不同场景下的实际应用价值，为开发者在实际应用中更好地利用这一功能提供有力的支持和指导。

前期准备
----

实际应用开发中，当你打算使用地图服务（Map Kit）时，首先需要在[AppGallery Connect](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.huawei.com%2Fconsumer%2Fcn%2Fservice%2Fjosp%2Fagc%2Findex.html "https://developer.huawei.com/consumer/cn/service/josp/agc/index.html")平台上创建相应的应用。在创建完成后，要准确地获取“项目设置 > 常规 > 应用”的Client ID，这里需要特别注意的是，一定不能获取项目的Client ID，两者有着明确的区分。获取正确的Client ID之后，接下来要在工程`entry`模块的`module.json5`文件中进行特定的操作。具体而言，就是要在这个文件中新增`metadata`，将其配置为`name`属性设置为`client_id`，`value`属性为获取到的Client ID值。

![image20240818212742208.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/89fefd9da3394ed2aae2c4926275c40b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55m95pmT5piO:q75.awebp?rk3s=f64ab15b&x-expires=1728468547&x-signature=yKI6Nnct55jKxWNuR8cutzzAXzs%3D)

json

 代码解读

复制代码

`{   "module": {     ...     "metadata": [       {         "name": "client_id",         "value": "xxxxxx"       }     ]   } }`

当完成Client ID的配置工作后，接下来还需要在AppGallery Connect平台该应用的“项目设置 > API管理”板块中打开地图服务开关。

![image20240818213238775.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/5fe8e1ca59f643f99bfbfe1863ed8df8~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55m95pmT5piO:q75.awebp?rk3s=f64ab15b&x-expires=1728468547&x-signature=axxNR5dlSkvRgnDBizSnhi98HNo%3D)

除了满足以上两个条件，还需要为应用添加公钥指纹，才能够确保地图服务（Map Kit）在应用中正常使用和发挥其强大的功能。

*   在DevEco Studio中使用自动签名，对应用进行签名。

![image20240821091237287.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/30c38880223f49dda844396113824984~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55m95pmT5piO:q75.awebp?rk3s=f64ab15b&x-expires=1728468547&x-signature=qwtLQwU689pVS%2Fa5JS9p87K9vQk%3D)

*   在AppGallery Connect平台“项目设置 > 常规 > 应用”下的SHA256证书/公钥指纹中添加公钥指纹，勾选证书名称为`auto_debug_xxxx`的证书。

![image20240821091605902.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/047560ff9af94f709450bbcf7703df67~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55m95pmT5piO:q75.awebp?rk3s=f64ab15b&x-expires=1728468547&x-signature=RocGA3hCnAFtiZ%2Fsu63yKc2mISw%3D)

![image20240821091800422.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/a1b750d1cdb9407eb9fbf40058189ae2~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55m95pmT5piO:q75.awebp?rk3s=f64ab15b&x-expires=1728468547&x-signature=rTqp861hSfGA3FwEa6GmRcv5iJc%3D)

打造个性化地图：聚焦创建地图功能
----------------

HarmonyOS为开发者和用户带来了强大的地图功能支持，其中包括地图组件`MapComponent`以及地图组件的主要功能入口类`MapComponentController`。

`MapComponent`在整个体系中扮演着至关重要的角色，它能够在应用程序的页面中以直观、清晰的方式呈现地图。无论是在导航类应用中为用户指引方向，还是在生活服务类应用中展示周边的地理信息，`MapComponent`都能发挥出其独特的优势，将丰富的地图内容呈现在用户眼前。

而`MapComponentController`则作为地图操作的核心枢纽，承担着众多关键任务。它可以实现地图类型的灵活切换，比如在标准地图和空地图之间自由切换，以满足不同场景下的需求。同时，还能够精确地改变地图状态，通过调整中心点坐标和缩放级别，让用户可以聚焦于特定的区域，获取更详细的地理信息。此外，`MapComponentController`还支持添加点标记（`Marker`），可以在地图上标注出重要的地点，方便用户识别和定位。不仅如此，它还能绘制各种几何图形，如`MapPolyline`（地图折线）、`MapPolygon`（地图多边形）、`MapCircle`（地图圆形）等，为用户提供更加丰富的可视化效果。最后，`MapComponentController`还能监听各类事件，及时响应用户的操作和地图状态的变化，为用户带来更加流畅和智能的交互体验。

接下来，我将和大家一起踏上探索之旅，逐步深入地掌握创建地图功能中一系列重要的操作。首先是如何在应用中成功地显示地图，让丰富的地理信息以清晰直观的形式呈现在我们的眼前。接着，我们将学习如何切换地图类型，无论是标注地图的详细呈现，还是简洁的空地图模式，都能根据实际需求灵活切换。然后，我们还会掌握显示自己位置的方法，以便在任何时候都能准确知晓自己所处的方位。最后，我们将深入了解如何显示自定义地图，根据特定的场景和需求，打造独一无二的地图展示效果，满足个性化的使用需求。

### 导入`Map Kit`相关模块

typescript

 代码解读

复制代码

`import { MapComponent, mapCommon, map } from '@kit.MapKit'; import { AsyncCallback } from '@kit.BasicServicesKit';`

### 通过`MapOptions`初始化地图

新建地图需要传入`MapOptions`参数，`MapOptions`提供`MapComponent`组件初始化的属性，用于设置诸如地图中心点坐标、层级等。

typescript

 代码解读

复制代码

`MapComponent({ mapOptions: mapCommon.MapOptions, mapCallback: AsyncCallback<map.MapComponentController> })`

*   `mapOptions`：地图初始化参数

typescript

 代码解读

复制代码

`let mapOptions: mapCommon.MapOptions = {   // 地图类型（可选），默认值为MapType.STANDARD（标准地图），取值还可以是MapType.NONE（空地图）、MapType.TERRAIN（地形图）   mapType: mapCommon.MapType.STANDARD,   // 地图相机位置（必填）   position: {     target: { // 地图中心位置的经纬度坐标       latitude: 38.5, // 纬度（可选），取值范围：[-90, 90]       longitude: 106.2  // 经度（可选），取值范围：[-180, 180]     },     zoom: 10, // 屏幕中心附近的缩放级别，取值范围：[2, 20]，默认值为2     tilt: 0,  // 相机的倾斜角度，即相机于垂直于地球表面的线的夹角，取值范围：[0, 75]，默认值为0     bearing: 0  // 地图以正北方向为0度顺时针旋转的角度，取值范围：[0, 360]，默认值0   },   // 地图展示边界（可选），异常值根据无边界处理   // 说明：西南角纬度不能大于东北角纬度   bounds: {     northeast: {  // 东北角经纬度（可选）       latitude: 41.5, // 纬度（可选），取值范围：[-90, 90]       longitude: 125.5  // 经度（可选），取值范围：[-180, 180]     },     southwest: {  // 西北角经纬度（可选）       latitude: 37.5, // 纬度（可选），取值范围：[-90, 90]       longitude: 100.5  // 经度（可选），取值范围：[-180, 180]     }   },   // 地图最小图层（可选），有效范围：[2, 20]，默认为2。异常值按默认值处理   minZoom: 2,   // 地图最大图层（可选），有效范围：[2, 20]，默认值20，异常值按默认值处理   maxZoom: 20,   // 是否支持旋转手势（可选），默认为true，异常值按默认值处理。true：支持；false：不支持   rotateGesturesEnabled: true,   // 是否支持滑动手势（可选），默认值为true，异常值按默认值处理。true：支持；false：不支持   scrollGesturesEnabled: true,   // 是否支持缩放手势（可选），默认值为true，异常值按默认值处理。true：支持；false：不支持   zoomGesturesEnabled: true,   // 是否支持倾斜手势（可选），默认值为true，异常值按默认值处理。true：支持；false：不支持   tiltGesturesEnabled: true,   // 是否展示缩放控件（可选），默认值为true，异常值按默认值处理。true：支持；false：不支持   zoomControlsEnabled: true,   // 是否展示定位按钮（可选），默认值为false，异常值按默认值处理。true：展示；false：不展示   myLocationControlsEnabled: false,   // 是否展示指南针控件（可选），默认值为true，异常值按默认值处理。true：展示；false：不展示   compassControlsEnabled: true,   // 是否展示比例尺（可选），默认值为false，异常值按默认值处理。true：展示；false：不展示   scaleControlsEnabled: false,   // 设置地图和边界的距离（可选），默认值为{ left: 0, top: 0, right: 0, bottom: 0 }   padding: {     left: 0,  // 在地图左侧增加的填充距离（可选），单位：px，默认值为0     top: 0, // 在地图顶部增加的填充距离（可选），单位：px，默认值为0     right: 0,   // 在地图右侧增加的填充距离（可选），单位：px，默认值为0     bottom: 0 // 在地图底部增加的填充距离（可选），单位：px，默认值为0   },   // 自定义样式ID（可选）   styleId: "xxxxx",   // 日间夜间模式（可选），默认值为DayNightMode.DAY（日间模式）   dayNightMode: mapCommon.DayNightMode.DAY,   // 是否一直显示比例尺（可选），只有比例尺启动时该参数才生效，默认值为false。true：始终显示；false：关闭始终显示   // 启动比例尺可以由地图初始化时scaleControlsEnabled属性设置为true   // 或者通过setScaleControlsEnabled方法设置为true   alwaysShowScaleEnabled: false };`

*   `mapCallback`：回调函数，返回`map.MapComponentController`

typescript

 代码解读

复制代码

`// 地图初始化的回调 let callback = async (err: BusinessError, mapController: map.MapComponentController) => {   if (!err) {     // 获取地图的控制器类，用来操作地图     this.mapController = mapController;   } }`

#### 切换地图类型

`Map Kit`支持以下三种地图类型：

*   `STANDARD`：标准地图，展示道路、建筑物以及河流等重要的自然特征。
*   `NONE`：空地图，没有加载任何数据的地图。
*   `TERRAIN`：地形图。

typescript

 代码解读

复制代码

`// 将默认的标准地图（STANDARD）切换地形图（TERRAIN） aboutToAppear(): void {   // 地图初始化参数，设置地图中心点及层级   this.mapOptions = {   	// 地图类型（可选），默认值为MapType.STANDARD（标准地图），取值还可以是MapType.NONE（空地图）、MapType.TERRAIN（地形图）   	mapType: mapCommon.MapType.TERRAIN,     // 地图相机位置（必填）     position: {       target: { // 地图中心位置的经纬度坐标         latitude: 38.5, // 纬度（可选），取值范围：[-90, 90]         longitude: 106.2  // 经度（可选），取值范围：[-180, 180]       },       zoom: 10, // 屏幕中心附近的缩放级别，取值范围：[2, 20]，默认值为2     },   }; }`

![image-20240821114625402.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/63c366cce63d41539f8dc27e99f7489c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55m95pmT5piO:q75.awebp?rk3s=f64ab15b&x-expires=1728468547&x-signature=0SlciHbA7yMxY3YMO04fy7nQsd4%3D)

#### 设置地图中心点及层级

typescript

 代码解读

复制代码

`aboutToAppear(): void {   // 地图初始化参数，设置地图中心点及层级   this.mapOptions = {     // 地图相机位置（必填）     position: {       target: { // 地图中心位置的经纬度坐标         latitude: 38.5, // 纬度（可选），取值范围：[-90, 90]         longitude: 106.2  // 经度（可选），取值范围：[-180, 180]       },       zoom: 10, // 屏幕中心附近的缩放级别，取值范围：[2, 20]，默认值为2     },   }; }`

![image20240821094022221.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f77813c2db1f42e19b85e62ab529fe95~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55m95pmT5piO:q75.awebp?rk3s=f64ab15b&x-expires=1728468547&x-signature=94GakM%2FeKddZKUIf98zLwNwzOTM%3D)

#### 展示定位按钮

typescript

 代码解读

复制代码

`aboutToAppear(): void {   // 地图初始化参数，设置地图中心点及层级   this.mapOptions = {     // 地图相机位置（必填）     position: {       target: { // 地图中心位置的经纬度坐标         latitude: 38.5, // 纬度（可选），取值范围：[-90, 90]         longitude: 106.2  // 经度（可选），取值范围：[-180, 180]       },       zoom: 10, // 屏幕中心附近的缩放级别，取值范围：[2, 20]，默认值为2     },     // 是否展示定位按钮（可选），默认值为false，异常值按默认值处理。true：展示；false：不展示   	myLocationControlsEnabled: true   }; }`

![image20240821121040199.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/d6f19e78883d46a8b6af71e110d34fc9~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55m95pmT5piO:q75.awebp?rk3s=f64ab15b&x-expires=1728468547&x-signature=gXV7T%2FNvs1%2FbFpp%2BUoKSwxaysnk%3D)

#### 展示比例尺

typescript

 代码解读

复制代码

`aboutToAppear(): void {   // 地图初始化参数，设置地图中心点及层级   this.mapOptions = {     // 地图相机位置（必填）     position: {       target: { // 地图中心位置的经纬度坐标         latitude: 38.5, // 纬度（可选），取值范围：[-90, 90]         longitude: 106.2  // 经度（可选），取值范围：[-180, 180]       },       zoom: 10, // 屏幕中心附近的缩放级别，取值范围：[2, 20]，默认值为2     },     // 是否展示定位按钮（可选），默认值为false，异常值按默认值处理。true：展示；false：不展示   	myLocationControlsEnabled: true, 		// 是否展示比例尺（可选），默认值为false，异常值按默认值处理。true：展示；false：不展示   	scaleControlsEnabled: true   }; }`

![image-20240821160817875.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/2e41983667fa4903b64d87a0cbe431a4~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55m95pmT5piO:q75.awebp?rk3s=f64ab15b&x-expires=1728468547&x-signature=EJsLmCp%2F6QZ81TJ5tXL1SxduT3k%3D)

#### 指定地图的日间夜间模式

typescript

 代码解读

复制代码

`aboutToAppear(): void {   // 地图初始化参数，设置地图中心点及层级   this.mapOptions = {     // 地图相机位置（必填）     position: {       target: { // 地图中心位置的经纬度坐标         latitude: 38.5, // 纬度（可选），取值范围：[-90, 90]         longitude: 106.2  // 经度（可选），取值范围：[-180, 180]       },       zoom: 10, // 屏幕中心附近的缩放级别，取值范围：[2, 20]，默认值为2     },     // 是否展示定位按钮（可选），默认值为false，异常值按默认值处理。true：展示；false：不展示   	myLocationControlsEnabled: true, 		// 是否展示比例尺（可选），默认值为false，异常值按默认值处理。true：展示；false：不展示   	scaleControlsEnabled: true,     // 日间夜间模式（可选），默认值为DayNightMode.DAY（日间模式），指定为自动模式   	dayNightMode: mapCommon.DayNightMode.AUTO,   }; }`

### 通过`MapComponentController`对象方法控制地图

#### 切换地图类型

除在地图初始化时指定地图类型外，还可以通过`MapComponentController`对象的`setMapType`方法在地图创建后动态设置地图类型。

typescript

 代码解读

复制代码

`/**  * 设置地图类型  * mapType：地图类型  */ setMapType(mapType: mapCommon.MapType): void // 地图初始化的回调 this.callback = async (err, mapController) => {   if (!err) {     // 获取地图的控制器类，用来操作地图     this.mapController = mapController;     // 动态设置地图类型     this.mapController.setMapType(mapCommon.MapType.TERRAIN);   } }`

#### 开启3D建筑图层

调用`MapComponentController`对象的setBuildingEnabled方法开启3D建筑图层，可通过两个手指向上滑动倾斜地图查看3D建筑图层效果。

typescript

 代码解读

复制代码

`// 地图初始化的回调 this.callback = async (err, mapController) => {   if (!err) {     // 获取地图的控制器类，用来操作地图     this.mapController = mapController;     // 开启3D建筑图层     this.mapController.setBuildingEnabled(true);   } }`

![image20240821095653733.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/b7cfea0ab6fe4344a563c609d1ba4bba~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55m95pmT5piO:q75.awebp?rk3s=f64ab15b&x-expires=1728468547&x-signature=Zj7zA6%2Bu5fl45w8JCMMouU7PRR8%3D)

#### 在指定的持续时间内以动画的形式更新相机状态

typescript

 代码解读

复制代码

`/**  * 在指定的持续时间内以动画的形式更新相机状态。  * CameraUpdate: 相机状态将要发生的变化。  * duration：动画的持续时间（单位：ms），默认值为250ms，值需大于0，异常值按默认值处理。  */ animateCamera(update: CameraUpdate, duration?: number): void // 地图初始化的回调 this.callback = async (err, mapController) => {   if (!err) {     // 获取地图的控制器类，用来操作地图     this.mapController = mapController;     // 新建CameraUpdate对象     const cameraPosition: mapCommon.CameraPosition = {       target: {         latitude: 39.9,         longitude: 116.4       },       zoom: 10     };     const cameraUpdate: map.CameraUpdate = map.newCameraPosition(cameraPosition);     // 在10000ms内以动画的形式移动相机     this.mapController.animateCamera(cameraUpdate, 10000);   } }`

![output.gif](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/25ed04c7542c42308b3c633d60240648~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55m95pmT5piO:q75.awebp?rk3s=f64ab15b&x-expires=1728468547&x-signature=nWRhOtCYOgRg2H14vgPW2wgmNOE%3D)

#### 在指定的持续时间内以动画的形式更新相机状态，并返回动画结果

typescript

 代码解读

复制代码

``/**  * 在指定的持续时间内以动画的形式更新相机状态，并返回动画结果  * CameraUpdate: 相机状态将要发生的变化。  * duration：动画的持续时间（单位：ms），默认值为250ms，值需大于0，异常值按默认值处理。  * return Promise<AnimateResult> 动画结果  */ animateCameraStatus(update: CameraUpdate, duration?: number): Promise<AnimateResult>    // 地图初始化的回调 this.callback = async (err, mapController) => {   if (!err) {     // 获取地图的控制器类，用来操作地图     this.mapController = mapController;     // 新建CameraUpdate对象     const cameraPosition: mapCommon.CameraPosition = {       target: {         latitude: 39.9,         longitude: 116.4       },       zoom: 10     };     const cameraUpdate: map.CameraUpdate = map.newCameraPosition(cameraPosition);     // 在10000ms内以动画的形式移动相机     const animateResult = await this.mapController?.animateCameraStatus(cameraUpdate, 10000);     console.log(`[AppLogger]动画结果：${JSON.stringify(animateResult)}`);   } }``

![image20240821113222926.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/9273939a4d5c4c59b6998799457ccc57~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55m95pmT5piO:q75.awebp?rk3s=f64ab15b&x-expires=1728468547&x-signature=KaqdlV2IiQmQ9FqIc1DFCr49t0I%3D)

#### 设置地图的日间夜间模式

除在地图初始化时指定地图的日间夜间模式，还可以通过`MapComponentController`对象的`setDayNightMode`方法在地图创建后动态设置地图的日间夜间模式。

typescript

 代码解读

复制代码

`/**  * 设置地图的日间夜间模式  * mode：日间夜间模式。包含：DAY（日间模式）、NIGHT（夜间模式）、AUTO（自动模式）  */ setDayNightMode(mode: mapCommon.DayNightMode): void // 地图初始化的回调 this.callback = async (err, mapController) => {   if (!err) {     // 获取地图的控制器类，用来操作地图     this.mapController = mapController;     // 设置地图为夜间模式     this.mapController.setDayNightMode(mapCommon.DayNightMode.NIGHT);   } }`

![image20240821162954207.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/fe93cdaf0cb544dfa4f28174627cc034~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55m95pmT5piO:q75.awebp?rk3s=f64ab15b&x-expires=1728468547&x-signature=lK3YFLwfdcldeBkN7hv33v1qgwY%3D)

#### 地图前后切换

typescript

 代码解读

复制代码

`// 将地图切换到前台，开发者在绘制地图页面的生命周期onPageShow中调用 onPageShow(): void {   if (this.mapController !== undefined) {     this.mapController.show();   } } // 将地图切换到后台，开发者在绘制地图页面的生命周期onPageHide中调用 onPageHide(): void {   if (this.mapController !== undefined) {     this.mapController.hide();   } }`

### 地图不显示异常排查和处理

*   检查网络状态，设备是否已经正确联网。
*   检查AppGallery Connnect平台应用是否已经添加公钥指纹，如果重新进行自动签名，需要重新添加公钥指纹，公钥指纹变更后10分钟后生效。
*   检查`module.json5`配置文件中是否配置Client ID。
*   检查AppGallery Connect平台是否开通地图权限，权限开通存在延迟。

本文正在参加华为鸿蒙有奖征文征文活动