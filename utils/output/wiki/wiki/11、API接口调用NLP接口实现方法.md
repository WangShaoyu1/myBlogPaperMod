---
author: "王宇"
title: "11、API接口调用NLP接口实现方法"
date: 八月03,2024
description: "五、系统架构设计"
tags: ["五、系统架构设计"]
ShowReadingTime: "12s"
weight: 115
---
*   1[1\. SDK交互流程](#id-11、API接口调用NLP接口实现方法-SDK交互流程)
*   2[2\. API接口交互](#id-11、API接口调用NLP接口实现方法-API接口交互)
    *   2.1[2.1. 虚拟人鉴权](#id-11、API接口调用NLP接口实现方法-虚拟人鉴权)
        *   2.1.1[2.1.1. 请求说明](#id-11、API接口调用NLP接口实现方法-请求说明)
            *   2.1.1.1[2.1.1.1. 基本信息](#id-11、API接口调用NLP接口实现方法-基本信息)
            *   2.1.1.2[2.1.1.2. Header参数](#id-11、API接口调用NLP接口实现方法-Header参数)
            *   2.1.1.3[2.1.1.3. Query参数](#id-11、API接口调用NLP接口实现方法-Query参数)
            *   2.1.1.4[2.1.1.4. Body参数](#id-11、API接口调用NLP接口实现方法-Body参数)
            *   2.1.1.5[2.1.1.5. 请求示例](#id-11、API接口调用NLP接口实现方法-请求示例)
            *   2.1.1.6[2.1.1.6. 响应说明](#id-11、API接口调用NLP接口实现方法-响应说明)
            *   2.1.1.7[2.1.1.7. 响应示例](#id-11、API接口调用NLP接口实现方法-响应示例)
    *   2.2[2.2. NLP流程中的Q接口](#id-11、API接口调用NLP接口实现方法-NLP流程中的Q接口)
        *   2.2.1[2.2.1. 请求说明](#id-11、API接口调用NLP接口实现方法-请求说明.1)
            *   2.2.1.1[2.2.1.1. 基本信息](#id-11、API接口调用NLP接口实现方法-基本信息.1)
            *   2.2.1.2[2.2.1.2. Header参数](#id-11、API接口调用NLP接口实现方法-Header参数.1)
            *   2.2.1.3[2.2.1.3. Query参数](#id-11、API接口调用NLP接口实现方法-Query参数.1)
            *   2.2.1.4[2.2.1.4. Body参数](#id-11、API接口调用NLP接口实现方法-Body参数.1)
            *   2.2.1.5[2.2.1.5. 请求示例](#id-11、API接口调用NLP接口实现方法-请求示例.1)
            *   2.2.1.6[2.2.1.6. 响应说明](#id-11、API接口调用NLP接口实现方法-响应说明.1)
            *   2.2.1.7[2.2.1.7. 响应示例](#id-11、API接口调用NLP接口实现方法-响应示例.1)
*   3[3\. 接口合并、注意事项](#id-11、API接口调用NLP接口实现方法-接口合并、注意事项)

1\. SDK交互流程
===========

目前运用虚拟人公司SDK进行虚拟人应用开发流程如下：

步骤

详情

函数

备注

步骤

详情

函数

备注

1

SDK初始化

HaiSDK.Init()

  

2

获取授权信息

HaiSDK.GetAuthToken()

  

3

获取虚拟人相关信息（应用、虚拟人）

  

  

4

检查资源包更新情况

HaiSDK.CheckServerAsset()

  

5

下载资源包

HaiSDK.DownloadCheckedServerAsse()

  

6

创建虚拟人

HaiSDK.CreateInstanceCallback()

  

7

可与用户进行交互

  

  

  

  

  

  

     到第7步，每一步都依赖SDK内部方法的执行。那能不能不依赖SDK内部的实现逻辑，仅仅实现和用户最关心的NLP链路，结合saas后台，只需要做两步即可：

1.  获取授权信息
2.  调用NLP接口

其余的和创建3D虚拟人相关的都可略过

2\. API接口交互
===========

涉及到的接口为：

1.  鉴权接口：[https://vdh-api.test.yingzi.com/haigate/api/v1/haiAuthorize](https://vdh-api.test.yingzi.com/haigate/api/v1/haiAuthorize)
2.  NLP接口：[https://vdh-api.test.yingzi.com/haigate/api/v1/haiQtxt2Anim](https://vdh-api.test.yingzi.com/haigate/api/v1/haiQtxt2Anim)

  

2.1. 虚拟人鉴权
----------

从Init方法看，调用逻辑如下：

init()

\_init()

onProgress

onReady

onRendere

onChat

onAudioStop

onAudioPlay

onAudioPause

HiCoreBridge  
bridge to avatar engine sdk and cloud  

init()

Avatar

haicore\_sdk

haicore\_sdk.ready

设置不同环境读取文件和处理异常的方法  
Node.js、shell环境、web环境 、worker环境

初始化定义各种变量  
1、buffer, HEAP8, HEAPU8, HEAP16,   
HEAPU16, HEAP32, HEAPU32,  
 HEAPF32, HEAPF64  
2、runDependencies  
dependenciesFulfilled  
3、等等

FS.staticInit()

embind\_init\_charCodes()

init\_ClassHandle()

 init\_RegisteredPointer()

init\_embind()

init\_emval()

**各种初始化函数执行**

创建一个包含了256元素的数组，将里面的每个整数转化为对于的ASCII字符，存储起来

createWasm()

**主角登场**

胶水代码，用于js与wasm交互

auth()

1、接口：https://vdh-api.\[env\].yingzi.com/haigate/api/v1/haiAuthorize

2、入参为：{avatarId,appId,appKey,token,deviceId,sdkVer,userId}

3、具体的取值方法将详情

4、返回参数：{

    "state": true,

    "error": "normal",

    "data": {

        "accessToken": "42eRLlrLHgxr1JY2NuKkpL4SBrk5oTFU",

        "refreshToken": "gJL5u8EgZfr2BbIwyAm4VKzht6lEDOgY",

        "accessExpireTime": 1715235409,

        "refreshExpireTime": 1716235409,

        "avatarList": null

    }

}

5、将accessToken存储起来

![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuOTkgNGMwLTEuMS0uODktMi0xLjk5LTJINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNGw0IDQtLjAxLTE4ek0xOCAxNEg2di0yaDEydjJ6bTAtM0g2VjloMTJ2MnptMC0zSDZWNmgxMnYyeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4= "显示评论")

//<!\[CDATA\[ (function() { $ = AJS.$; var graphContainer = document.getElementById('drawio-macro-content-3c7d86f6-e81f-4359-b933-62033c0b9b3d'); DrawioProperties = { contextPath : AJS.contextPath(), buildNumber : 8401 }; var readerOpts = {}; readerOpts.loadUrl = '' + '/rest/drawio/1.0/diagram/crud/%48%35%5F%61%75%74%68/123649330?revision=2'; readerOpts.imageUrl = '' + '/download/attachments/123649330/H5\_auth.png' + '?version=2&api=v2'; readerOpts.editUrl = '' + '/plugins/drawio/addDiagram.action?ceoId=123649330&owningPageId=123649330&diagramName=%48%35%5F%61%75%74%68&revision=2'; readerOpts.editable = true; readerOpts.canComment = true; readerOpts.stylePath = STYLE\_PATH; readerOpts.stencilPath = STENCIL\_PATH; readerOpts.imagePath = IMAGE\_PATH + '/reader'; readerOpts.border = true; readerOpts.width = '1200'; readerOpts.simpleViewer = false; readerOpts.tbstyle = 'top'; readerOpts.links = 'auto'; readerOpts.lightbox = true; readerOpts.resourcePath = ATLAS\_RESOURCE\_BASE + '/resources/viewer'; readerOpts.disableButtons = false; readerOpts.zoomToFit = true; readerOpts.language = 'zh'; readerOpts.licenseStatus = 'OK'; readerOpts.contextPath = AJS.contextPath(); readerOpts.diagramName = decodeURIComponent('%48%35%5F%61%75%74%68'); readerOpts.diagramDisplayName = ''; readerOpts.aspect = ''; readerOpts.ceoName = '11、API接口调用NLP接口实现方法'; readerOpts.attVer = '2'; readerOpts.attId = '123649951'; readerOpts.lastModifierName = '王宇'; readerOpts.lastModified = '2024-04-28 00:42:44.183'; readerOpts.creatorName = '王宇'; //Embed macro specific info readerOpts.extSrvIntegType = '$extSrvIntegType'; readerOpts.gClientId = '$gClientId'; readerOpts.oClientId = '$oClientId'; readerOpts.service = '$service'; readerOpts.sFileId = '$sFileId'; readerOpts.odriveId = '$odriveId'; readerOpts.diagramUrl = '$diagramUrl'; readerOpts.csvFileUrl = '$csvFileUrl'; readerOpts.pageId = '$pageId' || Confluence.getContentId(); readerOpts.aspectHash = '$aspectHash'; readerOpts.useExternalImageService = '$useExternalImageService' == 'true'; readerOpts.isTemplate = '$isTemplate' == 'true'; if (readerOpts.width == '') { readerOpts.width = null; } // LATER: Check if delayed loading of resources can be used for image placeholder mode var viewerPromise = createViewer(graphContainer, readerOpts); if(readerOpts.editable) { $(graphContainer).data('viewerConfig', readerOpts); $(graphContainer).on('drawioViewerUpdate', updateDrawioViewer); } viewerPromise.done(function(viewer) { updateCachedDiagram(graphContainer, readerOpts, viewer); }); })(); //\]\]>

### 2.1.1. 请求说明

#### 2.1.1.1. 基本信息

**请求地址：** [https://vdh-api.\[env\].yingzi.com/haigate/api/v1/haiAuthorize](https://vdh-api.[env].yingzi.com/haigate/api/v1/haiAuthorize)

**请求方式：** POST

**其他请求配置**：

[?](#)

1

`mode:` `'cors'``,` `// no-cors, *cors, same-origin`

#### 2.1.1.2. Header参数

名称

值

名称

值

"Content-Type"

application/json

  

#### 2.1.1.3. Query参数

名称

类型

必填

描述

名称

类型

必填

描述

  

  

  

  

#### 2.1.1.4. Body参数

名称

类型

必填

描述

名称

类型

必填

描述

avatarId

String

是

虚拟人id

appId

String

是

应用id

appKey

String

是

应用appKey

token

String

是

md5(this.appId \+ this.appKey +Date.now()+ this.appSecret)

1、是一个md5加密后的数据，使用的[js-md](https://github.com/emn178/js-md5) 包

2、使用到了配置项目中的appSecret

deviceId

String

是

'web#' + Date.now()

sdkVer

String

否

  

userId

String

否

  

#### 2.1.1.5. 请求示例

[?](#)

1

2

3

4

5

6

7

8

9

`{`

    `"avatarId"``:` `"11100020000066800000000000000000"``,`

    `"appId"``:` `"6006805041792430"``,`

    `"appKey"``:` `"TTZ92YT1mSDRLSGs5Mv1bMYJ"``,`

    `"token"``:` `"DAFEC8BEBA71C966B4129603A6F3E96D"``,`

    `"deviceId"``:` `"web#1714354253708"``,`

    `"sdkVer"``:` `"v6.0.0"``,`

    `"userId"``:``"13155556676"`

`}`

#### 2.1.1.6. 响应说明

名称

类型

描述

名称

类型

描述

state

Boolean

认证成功标识，取值为：true 或 false

error

String

错误信息

data

json

响应体

\--accessToken

String

存储在本地，键为“user-token”，值为accessToken。

1.  针对web端，存储方法为localstorge
2.  针对Android端，存储方法为取一个内部对象存储

  

\--refreshToken

String

没用到

\--accessExpireTime

Number

过期时间，单位为秒。算出来过期时间为23天多

\--refreshExpireTime

Number

没用到

\--avatarList

Array

没用到

#### 2.1.1.7. 响应示例

[?](#)

1

2

3

4

5

6

7

8

9

10

11

`{`

    `"state"``: true,`

    `"error"``:` `"normal"``,`

    `"data"``: {`

        `"accessToken"``:` `"5fikLlCe1pBD7fJMCMaH6j0a8R8LvToK"``,`

        `"refreshToken"``:` `"DILGLFfwOxm0b0oJbdzIQljBtLAMw6Jy"``,`

        `"accessExpireTime"``:` `1715359404``,`

        `"refreshExpireTime"``:` `1716359404``,`

        `"avatarList"``:` `null`

    `}`

`}`

  

2.2. NLP流程中的Q接口
---------------

### 2.2.1. 请求说明

#### 2.2.1.1. 基本信息

**请求地址：** [https://vdh-api.\[env\].yingzi.com/haigate/api/v1/haiQtxt2Anim](https://vdh-api.[env].yingzi.com/haigate/api/v1/haiQtxt2Anim)

**请求方式：** POST

其他请求配置：

[?](#)

1

2

`mode:` `'cors'``,` `// no-cors, *cors, same-origin`

`credentials:` `"include"``,`

#### 2.2.1.2. Header参数

名称

值

名称

值

"Content-Type"

application/json

"user-token"

取出存储的值

  

#### 2.2.1.3. Query参数

名称

类型

必填

描述

名称

类型

必填

描述

  

  

  

  

#### 2.2.1.4. Body参数

名称

类型

必填

描述

名称

类型

必填

描述

text

String

是

请求文本，需要用encode处理。有两道明文加密算法在里面，具体实现方法见下面代码：

**text加密实现**

[?](#)

1

2

3

4

5

6

7

8

9

`function` `newEncode(text){`

    `const u8a =` `new` `TextEncoder().encode(text);`

    `const maxArgs = 0x1000;`

    `let strArr= [];`

    `for` `(let i = 0, l = u8a.length; i < l; i += maxArgs) {`

        `strArr.push(String.fromCharCode.apply(``null``, u8a.subarray(i, i + maxArgs)));`

    `}`

    `return` `btoa(strArr.join(``''``));`

`}`

用于对比的解码方法为：

**text加密实现**

[?](#)

1

2

3

4

5

6

7

8

9

10

11

`function` `newDecode(str) {`

    `const aotbArr = atob(str)`

    `const maxArgs = 0x1000;`

    `const byteArr = []`

    `for` `(const char of aotbArr) {`

        `byteArr.push(char.charCodeAt(0))`

    `}`

    `return` `new` `TextDecoder().decode(``new` `Uint8Array(byteArr))`

`}`

reqId

String

是

请求id，取值为：String(Date.now())

tag

Object

是

自定义参数，用来携带API调用时模型自定义的参数，以及其他透传的参数

avatarId

String

是

虚拟人id

version

String

否

虚拟人版本，非必填

sdkVer

String

否

sdk版本，非必填，默认为：'v6.0.0'

lang

String

否

语言，非必填，默认为：'cn'

  

  

  

  

encode过程

是

否

urlsafe

\_encode

是

否

\_hasBuffer

Buffer.from

const \_hasBuffer \= typeof Buffer \=== 'function';

false

是

否

\_TE

typeof TextEncoder === 'function' ? new TextEncoder() : undefined  

true

\_fromUnit8Array(\_TE.encode(s))

\_btoa

是

否

\_hasBuffer

Buffer.from(u8a).  
toString('base64')

否

是

\_hasBtoa

btoa

是

否

\_hasBuffer

Buffer.from

btoaPolyfill

text

字节序列

Unicode代码点转化为字符串

base64

TextEncoder().encode()  
  
获得encodeArray  

String.fromCharCode.apply(null, encodeArray.subarray(0, maxargs)));

文本加密过程

![](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuOTkgNGMwLTEuMS0uODktMi0xLjk5LTJINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNGw0IDQtLjAxLTE4ek0xOCAxNEg2di0yaDEydjJ6bTAtM0g2VjloMTJ2MnptMC0zSDZWNmgxMnYyeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4= "显示评论")

//<!\[CDATA\[ (function() { $ = AJS.$; var graphContainer = document.getElementById('drawio-macro-content-aff28a2a-15f4-44e1-a9b4-b60048aa3cf4'); DrawioProperties = { contextPath : AJS.contextPath(), buildNumber : 8401 }; var readerOpts = {}; readerOpts.loadUrl = '' + '/rest/drawio/1.0/diagram/crud/%E6%9C%AA%E5%91%BD%E5%90%8D%E7%BB%98%E5%9B%BE%32/123649330?revision=3'; readerOpts.imageUrl = '' + '/download/attachments/123649330/未命名绘图2.png' + '?version=3&api=v2'; readerOpts.editUrl = '' + '/plugins/drawio/addDiagram.action?ceoId=123649330&owningPageId=123649330&diagramName=%E6%9C%AA%E5%91%BD%E5%90%8D%E7%BB%98%E5%9B%BE%32&revision=3'; readerOpts.editable = true; readerOpts.canComment = true; readerOpts.stylePath = STYLE\_PATH; readerOpts.stencilPath = STENCIL\_PATH; readerOpts.imagePath = IMAGE\_PATH + '/reader'; readerOpts.border = true; readerOpts.width = '1000'; readerOpts.simpleViewer = false; readerOpts.tbstyle = 'top'; readerOpts.links = 'auto'; readerOpts.lightbox = true; readerOpts.resourcePath = ATLAS\_RESOURCE\_BASE + '/resources/viewer'; readerOpts.disableButtons = false; readerOpts.zoomToFit = true; readerOpts.language = 'zh'; readerOpts.licenseStatus = 'OK'; readerOpts.contextPath = AJS.contextPath(); readerOpts.diagramName = decodeURIComponent('%E6%9C%AA%E5%91%BD%E5%90%8D%E7%BB%98%E5%9B%BE%32'); readerOpts.diagramDisplayName = ''; readerOpts.aspect = ''; readerOpts.ceoName = '11、API接口调用NLP接口实现方法'; readerOpts.attVer = '3'; readerOpts.attId = '123651491'; readerOpts.lastModifierName = '王宇'; readerOpts.lastModified = '2024-05-05 17:30:25.745'; readerOpts.creatorName = '王宇'; //Embed macro specific info readerOpts.extSrvIntegType = '$extSrvIntegType'; readerOpts.gClientId = '$gClientId'; readerOpts.oClientId = '$oClientId'; readerOpts.service = '$service'; readerOpts.sFileId = '$sFileId'; readerOpts.odriveId = '$odriveId'; readerOpts.diagramUrl = '$diagramUrl'; readerOpts.csvFileUrl = '$csvFileUrl'; readerOpts.pageId = '$pageId' || Confluence.getContentId(); readerOpts.aspectHash = '$aspectHash'; readerOpts.useExternalImageService = '$useExternalImageService' == 'true'; readerOpts.isTemplate = '$isTemplate' == 'true'; if (readerOpts.width == '') { readerOpts.width = null; } // LATER: Check if delayed loading of resources can be used for image placeholder mode var viewerPromise = createViewer(graphContainer, readerOpts); if(readerOpts.editable) { $(graphContainer).data('viewerConfig', readerOpts); $(graphContainer).on('drawioViewerUpdate', updateDrawioViewer); } viewerPromise.done(function(viewer) { updateCachedDiagram(graphContainer, readerOpts, viewer); }); })(); //\]\]>

#### 2.2.1.5. 请求示例

[?](#)

1

2

3

4

5

6

7

8

9

10

11

12

`{`

    `"text"``:` `"5qCh5LyB5ZCI5L2c5bmz5Y+w"``,`

    `"reqId"``:` `"1714896343455"``,`

    `"tag"``: {`

        `"args"``:` `"{\"channel_id\": 4}"``,`

        `"message"``:` `"校企合作平台"``,`

        `"stream"``: false`

    `},`

    `"sdkVer"``:` `"v6.0.0"``,`

    `"avatarId"``:` `"11100040000595780000000000000000"``,`

    `"lang"``:` `"cn"`

`}`

#### 2.2.1.6. 响应说明

名称

类型

描述

名称

类型

描述

state

Boolean

认证成功标识，取值为：true 或 false

error

String

错误信息

data    

json

响应体

    --aplus

String

  

   --audio

String

  

  --cache

String

  

  --cacheUrl

String

  

  --end

Boolean

  

  --hai

String

  

  --isAplus

Boolean

是否是A+

  --motion

String

  

  --origQText

String

  

  --reqId

String

请求id。和请求参数没reqId保持一致

  --streamId

String

  

  -- text

String

  

  --timeline

String

  

  --tag

Object

  

  ----answer

String

  

  ----code

String

指令标识。service非”Instruction\_library“类型不展示该字段

  ----continue\_answer

Object

追问话术

  ----continue\_failed\_answer

Object

追问失败话术

  ----entities

String

  

  ----failed\_answer

String

执行失败话术

  ----hitBusiness

String

命中的知识库

  ----init\_state

String

  

  ----intent

String

意图名称

  ----intentType

String

意图分类。【知识库母版树状分类】

  ----isEnd

String

1.  是否结束对话，判断是否多轮时有用。
2.  ”true“、”false“，使用前需转换

  ----isMulti

String

  

  ----service

String

指令、FAQ问答等类型

  ----succeed\_answer

StringObject

回复成功话术。需要将String转化为Object格式供解析用

      ----answerId

String

  

      ----value

String

回复内容

#### 2.2.1.7. 响应示例

[?](#)

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

31

32

33

34

35

`{`

    `"state"``: true,`

    `"error"``:` `"normal"``,`

    `"data"``: {`

        `"audio"``:` `""``,`

        `"hai"``:` `""``,`

        `"text"``:` `"DEFAULT"``,`

        `"aplus"``:` `""``,`

        `"streamId"``:` `""``,`

        `"end"``: true,`

        `"reqId"``:` `"1714899256207"``,`

        `"origQText"``:` `""``,`

        `"isAplus"``: false,`

        `"timeline"``:` `null``,`

        `"motion"``:` `null``,`

        `"tag"``: {`

            `"answer"``:` `"DEFAULT"``,`

            `"code"``:` `"h5_gallery_view_exhibits"``,`

            `"continue_answer"``:` `""``,`

            `"continue_failed_answer"``:` `""``,`

            `"entities"``:` `"[{\"name\":\"产品/场景\",\"value\":\"查情宝\",\"similar_value\":\"查情宝\",\"similar_standard_value\":\"查情宝\",\"similar_target_id\":\"1\",\"answer\":{\"answerId\":\"\",\"value\":\"\",\"hidb\":\"\",\"aplusId\":\"\",\"flag\":true,\"updFlag\":false,\"cache\":false}}]"``,`

            `"failed_answer"``:` `"{\"answerId\":\"\",\"value\":\"抱歉，执行失败，请稍后再试\",\"hidb\":\"\",\"aplusId\":\"\",\"flag\":true,\"updFlag\":false,\"cache\":false}"``,`

            `"hitBusiness"``:` `"374"``,`

            `"init_state"``:` `"false"``,`

            `"intent"``:` `"查看[产品/场景]"``,`

            `"intentType"``:` `"未分类"``,`

            `"isEnd"``:` `"true"``,`

            `"isMulti"``:` `"false"``,`

            `"service"``:` `"Instruction_library"``,`

            `"succeed_answer"``:` `"{\"answerId\":\"\",\"value\":\"[\\\"查情宝\\\":[\\\"text\\\":\\\"查情宝是一款基于深度学习和机器视觉技术的智能母猪查情终端设备，可实现母猪的自动查情，发情时间判断，以及最佳配种时间推荐。智能模型精准计算母猪发情指数，最大程度地解决人工母猪查情费时费力，判断发情时间不准确，错过母猪情期等问题，有效降低猪场生产成本，提高经济效益。\\\"],\\\"精喂仪\\\":[\\\"text\\\":\\\"FPF精喂仪是一款智能饲喂助手，可实现省人工、省饲料，让母猪吃的好，不掉膘。猪只数据实时采集，根据实际采食量动态调整个体饲喂方案，智能精准饲喂，实现个体营养最优、体况最佳、成本最低。\\\"],\\\"饮水宝\\\":[\\\"text\\\":\\\"FPF饮水宝用于智能饮水量监测，可实现猪只健康在线预警，监测母猪日饮水量，实时推送猪只饮水健康状态，在线预警。\\\"],\\\"余料宝\\\":[\\\"text\\\":\\\"FPF余料宝用于智能余料检测，集成图像算法，实时监测母猪料槽余料量，按需饲喂、提高采食量，有效避免饲料浪费。\\\"],\\\"称仔器\\\":[\\\"text\\\":\\\"FPF称仔器是智能称重助手，记录每只仔猪成长每一克。实现快速称重和计数，减少仔猪应激反应。自动读取仔猪电子耳标并识别仔猪身份信息，测量体重，自动计算头数，判定弱仔，自动上传称重数据，无需人工记录。\\\"],\\\"调膘器\\\":[\\\"text\\\":\\\"FPF调膘器结合电子耳标，实现母猪个体识别。母猪自由上秤称重，自动识别个体身份，自动记录体重头数，减少母猪应激反应。实现母猪体重、胎龄、饲喂曲线智能匹配，进行母猪个体精细管理，实现智能调膘，提升母猪生产效率。\\\"],\\\"分栏器\\\":[\\\"text\\\":\\\"FPF分栏器用于智能分栏管理，实现智能调膘，根据智能身份识别，获取猪只体重、日龄，对应猪只精准饲喂，通过体重与营养管理，提升整体均匀度。打破传统小栏养殖模式，提升栏舍面积使用率。\\\"],\\\"群喂仪\\\":[\\\"text\\\":\\\"FPF群喂仪用于智能精准饲喂，根据智能身份识别，实时获取猪只采食量，平台自动计算猪只日采食量，同时支持干湿料饲喂，降低料肉比，缩短猪只出栏周期。\\\"],\\\"智能环控管家\\\":[\\\"text\\\":\\\"FPF智能环控管家可根据猪只转栏流动、入栏生长、种猪周期等动态变化，通过算法智能驱动设备，调栏舍温度、湿度、通风量等。智能动态调控可提升控制精准度，降低猪只环境应激，减少人工操作。\\\"],\\\"智能供料系统\\\":[\\\"text\\\":\\\"FPF智能供料系统，实现饲料仓储、输送的实时在线智能化管控，支持料仓到料塔、料塔到饲喂器等多段输送，实现饲料自动化精准调度输送，减少人工，避免碎料浪费和余料堆积。\\\"],\\\"智能超声一体机\\\":[\\\"text\\\":\\\"智能超声一体机采用最新无线数据传输技术，实现将检测图像等数据上传云端，APP支持连接设备并调用图像，实现孕检、背膘数据实时采集和数据在线化展示。图像更清晰细腻；结果更直观、准确、快速。\\\"],\\\"智能超声一体机\\\":[\\\"text\\\":\\\"智能超声一体机采用最新无线数据传输技术，实现将检测图像等数据上传云端，APP支持连接设备并调用图像，实现孕检、背膘数据实时采集和数据在线化展示。图像更清晰细腻；结果更直观、准确、快速。\\\"],\\\"洗消间\\\":[\\\"text\\\":\\\"FPF生物安全人员智能洗消，严格控制人员洗消过程，严管控人员洗消时间，确保洗消人员的有效洗消时间和洗消水量达到生物安全要求。从物理上切断人的传播途径，实现人员隔离整个流程全面有效的管控。\\\"],\\\"消毒间\\\":[\\\"text\\\":\\\"FPF生物安全物资智能消毒严控物资消毒过程，严管控物资实际消毒时间，放置人为异常操作，消毒过程业务参数实时在线。从物理上切断物资的传播途径，实现物资消毒整个流程全面有效的管控。\\\"],\\\"配种舍\\\":[\\\"text\\\":\\\"配种舍\\\"],\\\"怀孕舍\\\":[\\\"text\\\":\\\"怀孕舍\\\"],\\\"分娩舍\\\":[\\\"text\\\":\\\"分娩舍\\\"],\\\"保育舍\\\":[\\\"text\\\":\\\"保育舍\\\"],\\\"后备舍\\\":[\\\"text\\\":\\\"后备舍\\\"],\\\"育肥舍\\\":[\\\"text\\\":\\\"育肥舍\\\"],\\\"精喂坊\\\":[\\\"text\\\":\\\"精味坊\\\"]]\",\"hidb\":\"\",\"aplusId\":\"\",\"flag\":true,\"updFlag\":true,\"cache\":false}"`

        `},`

        `"cache"``:` `0``,`

        `"cacheUrl"``:` `""`

    `}`

`}`

  

3\. 接口合并、注意事项
=============

1.  先授权、再存储授权信息
2.  NLP接口请求headers上带上授权信息
3.  NLP入参文本要按照规定加密

  

  

  

  

  

  

  

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)