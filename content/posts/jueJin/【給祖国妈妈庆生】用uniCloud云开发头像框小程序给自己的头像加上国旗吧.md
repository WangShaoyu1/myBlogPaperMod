---
author: "蜡笔小心_"
title: "【給祖国妈妈庆生】用uniCloud云开发头像框小程序给自己的头像加上国旗吧"
date: 2022-09-28
description: "持续创作，加速成长！这是我参与「掘金日新计划·10月更文挑战」的第1天，点击查看活动详情开头还有两天就要到伟大的祖国73周年的生日了，为了表达自己对祖国的浓浓爱意，我们可以把社交软件上的头像"
tags: ["uni-app","微信小程序","掘金·日新计划"]
ShowReadingTime: "阅读8分钟"
weight: 909
---
持续创作，加速成长！这是我参与「掘金日新计划 · 10 月更文挑战」的第1天，[点击查看活动详情](https://juejin.cn/post/7147654075599978532 "https://juejin.cn/post/7147654075599978532")

### 开头

还有两天就要到伟大的祖国`73周年`的生日了，为了表达自己对祖国的浓浓爱意，我们可以把社交软件上的头像换成国旗边框哦。

📢 不能把自己的头像换成广告等非法信息哦，要保持对国旗的敬畏之心！

### 项目

👉 本文是使用`uniapp云开发的微信小程序`，当然你也可以直接使用静态代码在前端mock数据进行开发，毕竟云开发只是一个方式而已，并不是真实需求。

👉 在使用云开发之前，我们需要去uniapp官网注册账号、阿里云空间等信息。

👉 点击链接可以看我以前的文章，里面有介绍整个云开发的流程。[使用 Uniapp + UniCloud 云开发微信小程序获取用户信息](https://juejin.cn/post/7110896927373262884 "https://juejin.cn/post/7110896927373262884")

### 建个表用来放头像框数据

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf8e4cc317e64a048a534b1db77b6237~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

👆 点击 + 号即可新建表了。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f0163831197457dafd02687f8c99b15~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

👆 创建一个空表就行，因为我们需要自己配置表结构。

json

 代码解读

复制代码

`// 文档教程: https://uniapp.dcloud.net.cn/uniCloud/schema {     "bsonType": "object",     "required": ["image"],     "permission": {             "read": true,             "create": false,             "update": false,             "delete": false     },     "properties": {         "_id": {                 "description": "ID，系统自动生成"         },         "title": {                 "title": "边框名称",                 "bsonType": "string",                 "description": "边框名称",                 "trim": "both"         },         "origin": {                 "bsonType": "file",                 "title": "图片",                 "description": "边框图片",                 "fileMediaType": "image",                 "fileExtName": "jpg,png",                 "componentForShow": {                         "name": "image"                 }         },         "type": {                 "bsonType": "int",                 "title": "分类",                 "description": "分类",                 "foreignKey": "wz_border_image_category.type",                 "enum": {                         "collection": "wz_border_image_category",                         "field": "name as text, type as value",                         "where": "status == 1 && type > 0",                         "orderby": "sort asc"                 }         },         "hot": {                 "title": "热门推荐",                 "bsonType": "int",                 "description": "是否热门推荐",                 "enum": [{                                 "value": 1,                                 "text": "推荐"                         },                         {                                 "value": 0,                                 "text": "不推荐"                         }                 ]         },         "sort": {                 "bsonType": "int",                 "description": "值越大越靠后",                 "title": "排序"         },         "status": {                 "title": "状态",                 "bsonType": "int",                 "description": "状态",                 "enum": [{                                 "value": 1,                                 "text": "启用"                         },                         {                                 "value": 0,                                 "text": "不启用"                         },                         {                                 "value": -1,                                 "text": "删除"                         }                 ]         },         "create_at": {                 "title": "创建时间",                 "bsonType": "timestamp",                 "description": "创建时间",                 "componentForShow": {                         "name": "uni-dateformat"                 },                 "permission": {                         "read": true,                         "write": false                 },                 "forceDefaultValue": {                         "$env": "now"                 }         },         "update_at": {                 "title": "更新时间",                 "bsonType": "timestamp",                 "description": "更新时间",                 "permission": {                         "read": true,                         "write": false                 },                 "componentForShow": {                         "name": "uni-dateformat"                 },                 "forceDefaultValue": {                         "$env": "now"                 }         }     } }`

👆 表结构可以直接复制进去哦~也可以根据自己的想法增减表结构。

### 表结构建好了，不得建个项目嘛

👉 uniapp创建项目是需要下载专用的IDE的，在uniapp官方中可以找到下载路径。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e9975cbcf93440fbfb09be08579ffd5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0cc316f14d54a5db785b969d40acc7c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

👆 新建项目的时候，别忘了勾选下面的`启用uniCloud`，并使用阿里云。

新建好项目之后，就可以开发画页面咯。

页面是很简单的，只需要显示用户头像、获取头像的按钮、保存头像的按钮、头像框列表。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/36f61e1e36d3419081a8d68ddcc37657~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

页面中主要由下面几块元素组成：

1.  背景图，主要是为了凸出国庆元素
2.  跳动的文案，让页面更加灵动
3.  用户信息区域，包括用户头像、获取头像、保存头像按钮
4.  头像框元素，使用的是网上随便下载的png图片

👉 我这里不仅仅使用了国庆的头像框，还有其他元素的头像框都是类似的，只是不同的tab栏切换一下就好了。

### 图片存储

👉 由于微信小程序开发的项目大小最多只能有 2M （忽略分包的情况下），所以我们需要将所有图片元素都放在阿里云空间中。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ff74d99ce1d4db583994d1d554f7b7d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc86389415ba4122a48f6ef27a134e79~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

上面两张就是背景图和logo了，可以自行下载之后放到阿里云空间中。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ea3dd5c836846c2bb01cb331b1df062~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

背景图存储完成之后，可以把头像框素材也储存起来。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/798d5eba58a04a02aaa4dda2c647f956~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 建个表放背景图吧

👉 为了更好的拓展，所以需要建一个单独的表，毕竟还有圣诞元素、中秋元素等，都可以直接替换不同的背景和文案。

新建表和上面头像框一样，空表就行，其他的自己配置。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4dc36456e7e447539de5699492111576~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

json

 代码解读

复制代码

`// 文档教程: https://uniapp.dcloud.net.cn/uniCloud/schema { 	"bsonType": "object", 	"required": [], 	"permission": { 		"read": false, 		"create": false, 		"update": false, 		"delete": false 	}, 	"properties": { 		"_id": { 			"description": "ID，系统自动生成" 		}, 		"type": { 			"bsonType": "int", 			"title": "分类ID", 			"description": "分类ID" 		}, 		"name": { 			"title": "分类名称", 			"bsonType": "string", 			"description": "分类名称", 			"trim": "both" 		}, 		"sort": { 			"bsonType": "int", 			"description": "值越大越靠后", 			"title": "排序" 		}, 		"status": { 			"title": "状态", 			"bsonType": "int", 			"description": "状态", 			"enum": [{ 					"value": 1, 					"text": "启用" 				}, 				{ 					"value": 0, 					"text": "不启用" 				} 			] 		}, 		"create_at": { 			"title": "创建时间", 			"bsonType": "timestamp", 			"description": "创建时间", 			"permission": { 				"read": true, 				"write": false 			}, 			"forceDefaultValue": { 				"$env": "now" 			} 		}, 		"update_at": { 			"title": "更新时间", 			"bsonType": "timestamp", 			"description": "更新时间", 			"permission": { 				"read": true, 				"write": false 			}, 			"forceDefaultValue": { 				"$env": "now" 			} 		} 	} }`

### 表里面的数据

👉 在对应的表中，点击添加记录即可在弹出框中复制下面的json数据进去，保存就有对应的数据显示了。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1661994586ea4fdabcaba1a73a9195eb~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

👉 配置背景图中的数据吧

json

 代码解读

复制代码

`{     "name": "国庆",     "type": 1,     "sort": 11,     "status": 1,     "create_at": 1634191078630,     "update_at": 1634191078630,     "backgroundImg": "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-298ded81-a496-47bd-a034-ccc7f0b4eb56/033212e6-ceac-4dca-864d-20c80c15d3b3.png",     "fontColor": "#FBD39A",     "logo": "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-298ded81-a496-47bd-a034-ccc7f0b4eb56/28dd9dc2-0e4a-4a00-880d-0203845d1590.png",     "subTitle": "领取你的专属国庆元素头像" }`

👉 还有头像框的配置数据

json

 代码解读

复制代码

`{     "type": 1,     "image": "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-298ded81-a496-47bd-a034-ccc7f0b4eb56/8b68d201-0593-47c8-9300-06ec82cc8b3a.png",     "title": "国旗红色边框",     "origin": {         "url": "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-298ded81-a496-47bd-a034-ccc7f0b4eb56/8b68d201-0593-47c8-9300-06ec82cc8b3a.png"     },     "sort": 0,     "status": 1 }`

### 云函数获取背景图和头像框数据

👉 因为背景图和头像框都是只需要查询的，没有其他增删改的过程，所以我们可以写一个通用的云函数去查询就可以了。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed79585ca9224a8f88c30699bf1cc5c0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

👆 项目里面有个uniCloud文件夹，右键选择关联云空间

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8d7ff81a68f41c781c8d0c8226e315a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

👆 在弹出层中选择对应的云空间即可

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/803bc96b362848c0a56f9070b6f3b278~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

👆 云空间关联完成之后，可以在cloudfunctions文件夹上右键新建云函数

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8115b639f9041abb5f85118c1313ad8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

👆 在弹出层中给云函数取个名称就可以创建了

👇 下面就是完整云函数代码了(在函数中定义了不同的接收参数，用于不同的表进行查询数据)

js

 代码解读

复制代码

`'use strict'; const db = uniCloud.database(); const utils = require('utils'); exports.main = async (event, context) => { 	var dbName = event.dbName //集合表名 	var search = event.search //搜索 	var tags = event.tags //搜索 	var order = event.order ? event.order : {} //排序 	var filter = event.filter ? event.filter : {} //筛选条件 	var pageIndex = event.pageIndex ? event.pageIndex : 1 //当前页数 	var pageSize = event.pageSize ? event.pageSize : 15 //每页数量 	var aggregate = event.aggregate // 聚合查询 	var lookup = event.lookup // 聚合查询 	var sort = event.sort // 聚合查询 	var unwind = event.unwind // 聚合查询 	let countResult = {} 	if (search) { 		countResult = await db.collection(dbName).where({ 			"name": new RegExp(search, 'i'), 			"status": 1 		}).count() 	} else if (tags) { 		countResult = await db.collection(dbName).where({ 			"tags": new RegExp(tags, 'i'), 			"status": 1 		}).count() 	} else { 		countResult = await db.collection(dbName).where(filter).count() 	} 	const total = countResult.total //得到总记录数  	const totalPage = Math.ceil(total / pageSize) //计算页数 	let hasMore //提示前端是否还有数据 	if (pageIndex > totalPage || pageIndex == totalPage) { //如果没有数据了，就返回false 		hasMore = false 	} else { 		hasMore = true 	} 	var result = {} 	if (aggregate) { 		result = await db.collection(dbName).aggregate() 			.match(filter || {}) 			.lookup(lookup) 			.unwind(unwind) 			.sort(sort) 			.skip((pageIndex - 1) * pageSize) 			.limit(pageSize) 			.end() 	} else if (search) { 		result = await db.collection(dbName) 			.where({ 				"name": new RegExp(search, 'i'), 				"status": 1 			}) 			.skip((pageIndex - 1) * pageSize) 			.limit(pageSize) 			.get() 	} else if (tags) { 		result = await db.collection(dbName) 			.where({ 				"tags": new RegExp(tags, 'i'), 				"status": 1 			}) 			.skip((pageIndex - 1) * pageSize) 			.limit(pageSize) 			.get() 	} else { 		if (order.name && order.type) { 			result = await db.collection(dbName) 				.where(filter) 				.skip((pageIndex - 1) * pageSize) 				.limit(pageSize) 				.orderBy(order.name, order.type) 				.get() 		} else { 			result = await db.collection(dbName) 				.where(filter) 				.skip((pageIndex - 1) * pageSize) 				.limit(pageSize) 				.get() 		} 	} 	const json = await utils.success({ 			list: result.data || [], 			hasMore, 			page: { 				total, 				pageSize, 				pageIndex 			} 		}, '获取成功') 	return json };`

### 页面效果和逻辑

📢 页面效果大家可以根据自己的想法去实现样式，下面只做逻辑部分哦

👉 进入页面时就请求云函数，获取背景图、logo、头像框数据

js

 代码解读

复制代码

`// 获取背景图 async getBorderCategory() {         const {                 result         } = await uniCloud.callFunction({                 name: 'query_list',                 data: {                         dbName: "wz_border_image_category",                         filter: {                                 status: 1,                         },                         order: {                                 "name": "sort",                                 "type": "asc"                         },                         pageIndex: 1,                         pageSize: 50                 },         })         if (result.code === 0) {                 this.$data.borderCategory = result.data.list         } },`

js

 代码解读

复制代码

``// 获取头像框数据 async getBorderImage() {         const {                 result         } = await uniCloud.callFunction({                 name: 'query_list',                 data: {                         dbName: "wz_border_image_urls",                         filter,                         order: {                                 "name": "sort",                                 "type": "asc"                         },                         pageIndex: this.$data.pageIndex,                         pageSize: 100                 },         })         if (result.code === 0) {                 let list = [...(this.$data.borderList[this.$data.borderType] || []), ...(result.data.list || [])]                 this.$set(this.$data.borderList, `${this.$data.borderType}`, list)         } },``

👆 上面已经拿到头像框的数据了，接下来就可以获取用户头像信息了（具体获取方式可以参考我以前的文章） [使用 Uniapp + UniCloud 云开发微信小程序获取用户信息](https://juejin.cn/post/7110896927373262884 "https://juejin.cn/post/7110896927373262884")

👉 点击头像框时，可以做一个两张图片叠加的效果

html

 代码解读

复制代码

`<view class="page-avatar-box">         <view class="page-avatar">                 <image :src="avatarSrc" mode=""></image>                 <image :src="borderImage" mode="" class="_border-image"></image>         </view> </view>`

css

 代码解读

复制代码

`.page-avatar-box {         background-color: #fff;         padding: 8px;         border-radius: 14px;         width: 150px;         height: 150px;         overflow: hidden;         .page-avatar {                 position: relative;                 width: 100%;                 height: 100%;                 border-radius: 10px;                 background-color: #F1F1F1;                 border: 0.5px solid #f1f1f1;                 overflow: hidden;                 > image {                         display: block;                         width: 100%;                         height: 100%;                         // transform: scale(0.99);                         overflow: hidden;                         border-radius: 10px;                 }                 ._border-image {                         position: absolute;                         top: 0;                         left: 0;                         right: 0;                         bottom: 0;                         // transform: scale(1);                 }                 .avatar-hat {                         position: relative;                         // z-index: 10;                         // top: 50%;                         // left: 50%;                         width: 100px;                         height: 100px;                         // margin: -50px 0 0 -50px;                         .hat-border-box {                                 position: absolute;                                 width: 100%;                         }                         .hat-border {                                 position: absolute;                                 border: 1px dashed #000;                                 width: 100px;                                 height: 100px;                                 .scale {                                         bottom: -25px;                                         right: -25px;                                 }                                 .rotate {                                         bottom: -25px;                                         left: -25px;                                 }                                 .del {                                         top: -25px;                                         right: -25px;                                 }                                 .btn {                                         position: absolute;                                         z-index: 5;                                         width: 50px;                                         height: 50px;                                 }                                 ._icon {                                         width: 25px;                                         height: 25px;                                         background: rgba(0,0,0,0.5);                                         line-height: 25px;                                         text-align: center;                                         border-radius: 50%;                                         color: #fff;                                 }                         }                         .imghat {                                 position: absolute;                                 width: 100px;                                 height: 100px;                         }                 }                 &.edit {                         position: absolute;                         width: 300px;                         height: 300px;                         z-index: 99;                         margin: auto;                         left: 0;                         right: 0;                         top: -20px;                         bottom: 0;                         background: #fff;                         &:after {                                 content: '';                                 display: block;                                 position: fixed;                                 background-color: rgba(0,0,0,0.8);                                 top: 0;                                 left: 0;                                 width: 100%;                                 height: 100%;                                 z-index: -6;                         }                         &:before {                                 content: '';                                 position: absolute;                                 width: 300px;                                 height: 300px;                                 z-index: -1;                                 margin: auto;                                 left: 0;                                 right: 0;                                 top: 0;                                 bottom: 0;                                 background-color: #fff;                         }                         ._border-image {                                 position: absolute;                                 top: 6px;                                 left: 6px;                                 right: 6px;                                 bottom: 6px;                                 overflow: hidden;                         }                         ._close {                                 position: fixed;                                 margin-top: 30px;                                 width: 100%;                                 left: 0;                         }                         .user-hat {                                 height: 54px;                                 width: 54px;;                                 .hat{                                         width: 50px;                                         height: 50px;                                         border:dashed 2px rgb(187, 183, 183);                                 }                         }                 }                 .user-hat{                         position: absolute;                         top:0;                         left:0;                         height: 27px;                         width: 27px;;                         .hat{                                 width: 25px;                                 height: 25px;                                 border:dashed 2px rgb(187, 183, 183);                         }                         .rotate{                                 width: 20px;                                 height: 20px;                                 text-align: center;                                 line-height: 20px;                                 position: absolute;                                 right: -8px;                                 bottom: -8px;                                 background-color: #d81e06;                                 border-radius: 50%;                                 .rotate-icon{                                         width: 20px;                                         height: 20px;                                 }                         }                 }         } }`

👉 点击保存按钮时，就需要使用canvas去画成一张图进行保存了。

js

 代码解读

复制代码

``// 点击保存按钮的方法 saveAvatar() {         uni.showLoading({                 title: '正在生成头像',                 mask: true         })         this.initCanvas() }, // 开始绘画 initCanvas() {         this.$data.ctx = uni.createCanvasContext(this.$data.canvasId)         this.$data.ctx.setFillStyle(this.$data.canvas.background)         this.$data.ctx.fillRect(0, 0, this.$data.canvas.width, this.$data.canvas.height)         // 画用户头像         this.drawAvatarUrlImage() }, /* 绘制用户头像 */ drawAvatarUrlImage() {         let avatarSrc = this.$data.avatarSrc || ''         if (avatarSrc && this.$data.isUpload) {                 this.$data.ctx.drawImage(avatarSrc, this.changeSize(0), this.changeSize(0), this.$data.screenWidth, this.$data.screenWidth)                 // 画头像框                 this.drawAvatarBorderImage()         } else if (avatarSrc && this.$data.isWeChatAvatar) {                 uni.downloadFile({                         url: avatarSrc,                         success: (res) => {                                 console.log('result', res)                                 this.$data.ctx.drawImage(res.tempFilePath, this.changeSize(0), this.changeSize(0), this.$data.screenWidth, this.$data.screenWidth)                                 // 画头像框                                 this.drawAvatarBorderImage()                         },                         fail: function() {                                 uni.hideLoading()                                 uni.showModal({                                         title: '提示',                                         content: '无法下载头像',                                 })                         }                 })         } else {                 uni.hideLoading()                 uni.showModal({                         title: '提示',                         content: '请先登录或者上传头像',                 })         } }, drawAvatarBorderImage() {         let borderImg = this.$data.borderImage         // 没有头像框         if (!borderImg) {                 // 开始生成                 return this.draw()         }         // this.$data.ctx.drawImage(borderImg, this.changeSize(0), this.changeSize(0), this.$data.screenWidth, this.$data.screenWidth)         // // 开始生成         // return this.draw()         // 有头像框则继续执行         uni.downloadFile({                 url: borderImg,                 success: (result) => {                         this.$data.ctx.drawImage(result.tempFilePath, this.changeSize(0), this.changeSize(0), this.$data.screenWidth, this.$data.screenWidth)                         // 开始生成                         this.draw()                 },                 fail: function() {                         uni.hideLoading()                         uni.showModal({                                 title: '提示',                                 content: '无法下载头像框',                         })                 }         }) }, draw() {         this.$data.ctx.draw(false, () => {                 setTimeout(() => {                         this.canvasToImage()                 }, 130)         }) }, // 生成图片 canvasToImage() {         uni.canvasToTempFilePath({                 canvasId: this.$data.canvasId,                 success: (res) => {                         uni.hideLoading()                         this.$data.ctx = null                         console.log(res)                         this.$toast('生成成功,正在保存', 'center', 'success', 2000)                         this.$data.imageBill = res.tempFilePath                         uni.setStorageSync('imageBill', this.$data.imageBill)                         uni.saveImageToPhotosAlbum({                                 filePath: res.tempFilePath,                                 success: () => {                                         // this.$tips('保存成功\n不妨分享一下~', '', 3500)                                         wx.showToast({                                           title: '保存成功\n不妨分享一下~',                                           icon: 'none',                                           duration: 3000                                         })                                         uni.navigateTo({                                                 url: `/pages/avatar/result?url=${this.$data.imageBill}`                                         })                                         // // 生成以后直接预览图片                                         // uni.previewImage({                                         // 	current: res.tempFilePath,                                         // 	urls: [ res.tempFilePath ],                                         // })                                 },                                 fail: () => {                                         this.$toast('保存失败\n请授权相册权限~',  'error', 3000)                                 }                         });                 },                 fail() {                         uni.hideLoading()                         uni.showModal({                                 title: '提示',                                 content: '头像保存失败',                         })                 }         }) },``

### 头像框完美效果

![975f87972929a5d210e6fd8c842e540.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4ea308068294022a7754eef0b05a7f1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)