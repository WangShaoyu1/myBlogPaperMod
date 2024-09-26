---
author: "tager"
title: "【前端MOCK数据】这么好的工具为啥不用啊？🚀"
date: 2021-11-03
description: "肯定有很多前端程序猿联调前很悠闲😌，但联调阶段持续加班，直到提测、上线。但如果我们能在联调前完成大部分工作，相信就能准点下班啦🚘。。【前端MOCK数据】这么好的工具为啥不用啊？"
tags: ["前端","JavaScript"]
ShowReadingTime: "阅读9分钟"
weight: 781
---
这是我参与11月更文挑战的第26天，活动详情查看：[2021最后一次更文挑战](https://juejin.cn/post/7023643374569816095/ "https://juejin.cn/post/7023643374569816095/")

前言
==

**工具好不好用，关键在于用。**

肯定有很多前端程序猿联调前很悠闲😌，但联调阶段持续加班，直到提测、上线。

这其中缘由不外乎需求不明确等原因，但如果我们能在联调前完成大部分工作，相信就能准点下班啦🚗。如果你也有类似的现象，希望能看完此篇，或许能让你在不协调的工作中解放出来。

可以先加个收藏（Ctrl + D 或 command + D），以备不时之需。

* * *

背景
==

在开发环境中，由于后端与前端并行开发、或者前端需要等待后台接口开发。接口直接严重依赖，生成数据的业务逻辑复杂等，严重影响了开发效率。

因此学会使用最适合自己的 Mock 数据的方法就非常重要。

下面介绍了几种常用的mock方案，通过了解自动化mock的方式，减少重复工作，减少真实联调问题，我们可以根据开发场景，选择并配置最合适自己的方案。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a3578bea4894211b72c1c5ee24bb960~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

* * *

**六类常用的MOCK方案说明**
=================

方案①：代码侵入 (实际开发中最常用，但不推荐)
------------------------

> 特点：直接在代码中写死 Mock 数据，或者请求本地的 JSON 文件  
> 优点：无  
> 缺点：
> 
> 1.  和其他方案比 Mock 效果不好
> 2.  与真实 Server 环境的切换非常麻烦，一切需要侵入代码切换环境的行为都是不好的

* * *

方案②： 接口管理工具
-----------

> #### 代表：
> 
> ##### [rap](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fthx%2FRAP "https://github.com/thx/RAP")（阿里，已停止维护，使用rap2）
> 
> ##### [swagger](https://link.juejin.cn?target=https%3A%2F%2Fswagger.io%2F "https://swagger.io/")
> 
> ##### [moco](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdreamhead%2Fmoco "https://github.com/dreamhead/moco")（[参考](https://link.juejin.cn?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2F8a8cdd9d9884 "https://www.jianshu.com/p/8a8cdd9d9884"), 和前端处理mock类似，json假数据+服务）
> 
> ##### [yapi](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYMFE%2Fyapi "https://github.com/YMFE/yapi")(去哪儿网开发[yapi 官网](https://link.juejin.cn?target=https%3A%2F%2Fhellosean1025.github.io%2Fyapi%2Fdocuments%2Findex.html "https://hellosean1025.github.io/yapi/documents/index.html"))
> 
> ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d31f7287eb814ed0822062e1dc77b0e1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
> 
> #### 优缺点(接口管理工具)
> 
> 优点：
> 
> 1.  配置功能强大，接口管理与 Mock 一体，后端修改接口 Mock 也跟着更改，可靠
> 2.  有统一的接口管理后台，查找使用方便。 缺点：
> 3.  配置复杂，依赖后端，可能会出现后端不愿意出手，或者等配置完了，接口也开发出来了的情况。mock数据都由后台控制，有什么异常情况 前端同学基本上使不上力。有背前后台分离的原则。
> 4.  一般会作为大团队的基础建设而存在， 没有这个条件的话需慎重考虑
> 5.  增加后台负担，与其让后台处理mock数据相关问题，倒不如加快提供真实接口数据。

* * *

方案③：本地 node 服务器
---------------

> 代表：[json-server](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ftypicode%2Fjson-server "https://github.com/typicode/json-server")  
> 原理：使用[lowdb](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ftypicode%2Flowdb "https://github.com/typicode/lowdb")，操作本地小型的数据库(遵循 REST API)。 特点：
> 
> *   可以独立使用，也可以作为node服务的中间件 `server.use(db)` 
> *   db可以是json文件(更直观)，也可以使js文件(灵活性更高)
> *   可以设置跨域、开启gzip、设置延时、日志、指定路由等。 `json-server [options] <source>` 
> *   可命令行启动或 `json-server.json` 配置后直接启动
> *   可以自定义路由映射(key为真实路由、value为mock路由)
> 
> #### 轻而易举的实现后台功能
> 
> ini
> 
>  代码解读
> 
> 复制代码
> 
> `过滤：GET /list?name.age=18； 分页: /users?_page=3&_limit=5 排序：/users?_sort=id&_order=desc 分隔：/users?_start=2&_end=5 运算：使用 _gte 或 _lte 选取一个范围、使用 _ne 排除一个值、使用 _like 进行模糊查找 (支持正则表达式) ......`

### 服务管理

增删改查参考postman示例。（注意body-raw要选择json模式）

优点：

1.  配置简单，json-server 甚至可以 0 代码 30 秒启动一个 REST API Server
2.  自定义程度高，一切尽在掌控中
3.  增删改查真实模拟

缺点：

1.  与接口管理工具相比，无法随着后端 API 的修改而自动修改

* * *

方案④：请求拦截\[MOCKJS\]
------------------

代表：[Mock.js](https://link.juejin.cn?target=http%3A%2F%2Fmockjs.com%2F "http://mockjs.com/")

特点：

*   通过拦截特定的AJAX请求，并生成给定的数据类型的随机数，以此来模拟后端同学提供的接口。
*   使用数据模板定义，随机生成定义数据的自由度大。使用MockJS的Random工具类的方法定义，这种方式自由度小，只能随机出MockJS提供的数据类型。
*   一般配合其它库使用或单独在项目中使用或者通过反向代理来实现。

使用格式说明:

Mock.mock( rurl?, rtype?, template|function( options ) )

*   rurl： 可选，拦截的url地址，可以是**字符串或正则**(常用)
*   rtype: 可选，拦截的请求类型，字符串（对大小写敏感，必须小写）。
*   template|function( options )：必须，拦截后返回的数据。template一般为json对象类型；function在return时需要返回template，其中option包含请求的`url`、`type` 和 `body属性`
*   `只传template，则执行Mock.mock后返回的是``template的实际结果``。`

### 简单示例展示：

#### 随机生成颜色

arduino

 代码解读

复制代码

`Mock.mock('@color')  "#f279ba"`

#### 随机生成邮箱

perl

 代码解读

复制代码

`Mock.mock('@email') "k.fxnx@newvwi.gf"`

#### 随机生成ip

arduino

 代码解读

复制代码

`Mock.mock('@ip') "44.122.28.106"`

#### 随机生成区域地址

arduino

 代码解读

复制代码

`Mock.mock('@region') "东北"`

#### 还能随机生成图片（并可传参配置图片大小、颜色等）

scss

 代码解读

复制代码

`Random.image()` 

#### 随机生成日期时间

lua

 代码解读

复制代码

`Random.date() // => "2020-10-23" Random.date('yyyy-MM-dd') // => "1998-01-29" Random.time() // => "22:44:56" Mock.mock('@time') // => "01:48:17"`

#### 按规则生成字符串

json

 代码解读

复制代码

`// 指定范围的数量 Mock.mock({ "string|1-10": "★" }) // 执行后 { "string": "★★" } // 随机生成数量为1-10个'*'字符串 // 固定数量 Mock.mock({ "string|3": "*" })  // 执行后 { "string": "***" } // 生成指定数量的'*'（示例是3个）字符串`

#### 生成指定范围内的数字

json

 代码解读

复制代码

`// 整数 Mock.mock({ "number|1-100": 100 }) // 执行后 { "number": 84 } // 生成1-100范围内的数字 // 小数 Mock.mock({ "number|1-100.1-10": 1 }) // 执行后 { "number": 72.15917 } // 生成1-100的数字，随机保留1-10位小数`

#### 生成随机的对象数量

css

 代码解读

复制代码

`Mock.mock({ "object|2-4": {  "110000": "北京市",  "120000": "天津市",  "130000": "河北省", "140000": "山西省"  }})  // 执行后，随机获取对象中的2-4项 { "object": {  "120000": "天津市",  "130000": "河北省"  } }`

#### 生成指定数量的数组

javascript

 代码解读

复制代码

`Mock.mock({ "array|1": [ "AMD", "CMD", "UMD" ] }) { "array": "CMD" } // 随机获取对象中的一项`

#### 生成对象数组

arduino

 代码解读

复制代码

`// list指定了数组当中的对象数量，最少一项，最多10项。 Mock.mock({     // 属性 list 的值是一个数组，其中含有 1 到 10 个元素     'list|1-10': [{         // 属性 id 是一个自增数，起始值为 1，每次增 1         'id|+1': 1     }] }) // 随机的结果 {     "list": [         {             "id": 1         },         {             "id": 2         }     ] }`

#### ......

[更多示例可查看官方链接](https://link.juejin.cn?target=http%3A%2F%2Fmockjs.com%2Fexamples.html "http://mockjs.com/examples.html")

### 语法规范

#### \> 数据模板定义

定义规则：'key|rules': value

属性值的数据类型可以是Number、Boolean、String、Object、Array、Function、Null，不可以是Undefined

javascript

 代码解读

复制代码

`'name|min-max': value 'name|count': value 'name|min-max.dmin-dmax': value 'name|min-max.dcount': value 'name|count.dmin-dmax': value 'name|count.dcount': value 'name|+step': value 'regexp': /\d{5,10}/,`

拦截接口返回示例：

bash

 代码解读

复制代码

`步骤： 1. 创建mock.js文件 // 正则匹配 /notification\/count/ 的接口 Mock.mock(/notification\/count/, {   "code": 200,   "msg": "success",   "data": {       "count": 3   } }) 2. 在入口中引入mock即可 其它优化： 在npm script中增加命令并添加mock环境变量，开发环境中用该命令启动。 在入口文件中使用mock环境变量判断是否加载mock.js，使mock数据和业务代码彻底分离。`

#### \> 查看和使用random

1.  **全局使用**

arduino

 代码解读

复制代码

`npm install mockjs -g random -h 查看可使用的模板`

2.  **局部使用**

随机生成数据

Mock.mock( { email: '@email' } )占位符 等同于 调用了Mock.Random.email(), 随机生成email。

还可随机生成图片、颜色、地址、网址、自增数等。

3.  **扩展模板（自定义MOCK数据的模板）**

javascript

 代码解读

复制代码

`Random.extend({     constellation: function(date) {         var constellations = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']         return this.pick(constellations)     } })`

#### \> Mock.valid(template, data) 校验数据

ini

 代码解读

复制代码

`var tempObj = {   "user|1-3" : [{'name':'@name', 'id|28-338': 88}]  };  var realData = { "user":[{'name': '张三','id':90 }]};  // 校验通过返回空数据，不通过则返回原因。（可以有多条原因，因此返回的是数组对象结构）  console.log(Mock.valid(tempObj,realData));` 

#### \> Mock.toJSONSchema( template )

把 Mock.js 风格的数据模板 `template` 转换成 [JSON Schema](https://link.juejin.cn?target=http%3A%2F%2Fjson-schema.org%2F "http://json-schema.org/")。

#### \> Mock.setup( settings )

配置拦截 Ajax 请求时的行为。支持的配置项有：`timeout`。

bash

 代码解读

复制代码

`Mock.setup({     timeout: 400 }) Mock.setup({     timeout: '200-600' })`

### 优缺点(MOCKJS)

> 优点：
> 
> 1.  与前端代码分离
> 2.  可生成随机数据 缺点：
> 3.  数据都是动态生成的假数据，无法真实模拟增删改查的情况
> 4.  只支持 ajax，不支持 fetch

* * *

方案⑤： 抓包工具
---------

> 利用 `Charles` 、`Fiddler`等代理工具，  
> 常见的处理方式有
> 
> *   将 URL 映射到本地文件；(调试APP混合开发等)
> *   debugger某个url，修改响应数据。
> *   拦截后返回本地的数据，如`Charles，`直接采用Map locale 或者 Map Remote的方式。
> 
> > 1.  右击url, copy response
> > 2.  在本地新建mock json数据，然后将response粘贴修改
> > 3.  再次访问url，观察api的变化。
> 
> ##### 优缺点：
> 
> 优点：mock便于混合开发的问题排查、线上问题排查等。  
> 缺点：调试相对繁琐。

* * *

方案⑥： 组合模式
---------

> 代表：[easy-mock](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F139940483 "https://zhuanlan.zhihu.com/p/139940483")（提供在线服务和接口代理，支持mockjs、[Swagger](https://link.juejin.cn?target=https%3A%2F%2Fswagger.io%2F "https://swagger.io/")、restapi风格）  
> node框架生成器 + [json-server](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ftypicode%2Fjson-server "https://github.com/typicode/json-server") + mockjs。

REST API
--------

URI 代表 资源/对象，METHOD 代表行为 [www.ruanyifeng.com/blog/2014/0…](https://link.juejin.cn?target=https%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2014%2F05%2Frestful_api.html "https://www.ruanyifeng.com/blog/2014/05/restful_api.html")

ruby

 代码解读

复制代码

`GET /tickets // 列表 GET /tickets/12 // 详情 POST /tickets  // 增加 PUT /tickets/12 // 替换 PATCH /tickets/12 // 修改 DELETE /tickets/12 // 删除 资源负数名称表示对应表的资源集合，方法动词。`

*   点 [我](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fq%2F1010000005685904 "https://segmentfault.com/q/1010000005685904") 了解 `patch vs put`

* * *

其它方案参考
======

*   **`apifox`** [API 文档、调试、Mock、自动化测试一体化协助平台](https://link.juejin.cn?target=https%3A%2F%2Fwww.apifox.cn%2F%3Futm_source%3Dzhihu%26utm_medium%3Darticle_10001%26utm_content%3D141425111%23 "https://www.apifox.cn/?utm_source=zhihu&utm_medium=article_10001&utm_content=141425111#")  
    看评论推荐的人还真不少😆，感兴趣的小伙伴可以尝试一下。支持 HTTP、TCP、RPC,(`2020-12-28首版发布`)

> 常用解决方案：
> 
> 1.  使用 Swagger 管理 API 文档
> 2.  使用 Postman 调试 API
> 3.  使用 RAP 等工具 Mock API 数据
> 4.  使用 JMeter 做 API 自动化测试

*   **`jsonplaceholder`** 很方便，直接fetch远程的数据即可，高效易用[jsonplaceholder官方文档](https://link.juejin.cn?target=https%3A%2F%2Fjsonplaceholder.typicode.com "https://jsonplaceholder.typicode.com")
    
*   **`JSON Schema 数据校验`**[json-schema.org](https://link.juejin.cn?target=http%3A%2F%2Fjson-schema.org "http://json-schema.org")
    

* * *

最后
==

Mock不只是mock数据，还可以mock功能的。我们通过使用Mock尽可能的完善功能，才能在联调时事半功倍。

如果觉得有帮助，不妨`点赞、关注`支持一下。如文章有不足之处、疑问或建议，希望能在下方👇🏻 留言，非常感谢。

MOCK数据原理可参考我之前写过的这篇文章：[Javascript 如何全面接管xhr请求](https://juejin.cn/post/7019704757556084750 "https://juejin.cn/post/7019704757556084750")

> 作者： `tager`  
> 相关文章地址：[`https://juejin.cn/user/4353721776234743/posts`](https://juejin.cn/user/4353721776234743/posts "https://juejin.cn/user/4353721776234743/posts")  
> 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。