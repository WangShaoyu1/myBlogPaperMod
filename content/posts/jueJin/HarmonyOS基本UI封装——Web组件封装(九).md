---
author: "peakmain9"
title: "HarmonyOS基本UI封装——Web组件封装(九)"
date: 2024-09-24
description: "前言BasicLibrary是一个基于API12封装的基本库未来的计划是将其打造成一个通用的UI组件+基本工具组件，目前正在完善UI组件，大家如果组件有什么需求，可以尽管提哦BasicLibr"
tags: ["HarmonyOS"]
ShowReadingTime: "阅读3分钟"
weight: 502
---
### 前言

*   BasicLibrary是一个基于API 12封装的基本库
    
*   未来的计划是将其打造成一个通用的UI组件+基本工具组件，目前正在完善UI组件，大家如果组件有什么需求，可以尽管提哦
    
*   [BasicLibrary项目地址](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fpeakmain%2Fbasic-library "https://gitee.com/peakmain/basic-library")
    
*   [BasicLibrary的openHarmony三方库中心仓](https://link.juejin.cn?target=https%3A%2F%2Fohpm.openharmony.cn%2F%23%2Fcn%2Fdetail%2F%40peakmain%252Flibrary "https://ohpm.openharmony.cn/#/cn/detail/@peakmain%2Flibrary")
    

文章系列

*   [HarmonyOS基本工具封装——BasicLibrary的基本使用(一)](https://juejin.cn/post/7359743113197273098 "https://juejin.cn/post/7359743113197273098")
*   [HarmonyOS基本UI封装——标题栏组件NavBar封装与使用(二)](https://juejin.cn/post/7360856203838783539 "https://juejin.cn/post/7360856203838783539")
*   [HarmonyOS基本UI封装——Cell单元格组件封装与使用(三)](https://juejin.cn/post/7361361507311534106 "https://juejin.cn/post/7361361507311534106")
*   [HarmonyOS基本UI封装——Dialog 弹出框、loading加载和List下拉刷新加载更多（四）](https://juejin.cn/post/7366945260792774694 "https://juejin.cn/post/7366945260792774694")
*   [HarmonyOS基本UI封装——ImageLoader 图片上传(五)](https://juejin.cn/post/7374045077452324891 "https://juejin.cn/post/7374045077452324891")
*   [HarmonyOS基本UI封装——顶部Toast、骨架屏(六)](https://juejin.cn/post/7395217248674611250 "https://juejin.cn/post/7395217248674611250")
*   [HarmonyOS基本UI封装——日历选择器(七)](https://juejin.cn/post/7397424623958179878 "https://juejin.cn/post/7397424623958179878")
*   [HarmonyOS基本UI封装——全局弹窗、日志工具类、注解功能封装(八)](https://juejin.cn/post/7414013230954332211 "https://juejin.cn/post/7414013230954332211")

### 简介

鸿蒙基本库封装，提升鸿蒙开发效率

### 安装

typescript

 代码解读

复制代码

`ohpm install @peakmain/library`

### 1\. 跳转到H5页面

导入依赖

javascript

 代码解读

复制代码

`import {JumpUtils}from '@peakmain/library'`

#### 1.1 跳转H5页面，携带token

public static jumpToH5(url: string, showTitle: boolean = true):void

##### 参数

参数

参数类型

是否必填

说明

url

string

是

跳转url

showTitle

boolean

否

是否显示导航栏，默认为true，表示显示

#### 1.2 跳转到H5页面，携带token的同时携带version

public static jumpToH5AddVersion(url: string, showTitle: boolean = true):void

##### 参数

参数

参数类型

是否必填

说明

url

string

是

跳转url

showTitle

boolean

否

是否显示导航栏，默认为true，表示显示

#### 1.3 跳转H5，拼接若干个参数

jumpToH5AddParams(url: string, showTitle: boolean = true, params: Map<string, string | number | boolean>,isAddToken: boolean = false):void

##### 参数

参数

参数类型

是否必填

说明

url

string

是

跳转url

showTitle

boolean

否

是否显示导航栏，默认为true，表示显示

params

Map<string, string | number | boolean>

是

需要拼接的参数

isAddToken

boolean

否

是否拼接token，默认是false

#### 1.4 为url添加版本号

static addVersionToUrl(url: string):string

##### 参数

参数

参数类型

是否必填

说明

url

string

是

跳转url

#### 1.5 为url添加token

static addTokenToUrl(url: string):string

##### 参数

参数

参数类型

是否必填

说明

url

string

是

跳转url

### 2\. 设置webView的userAgent

导入依赖

javascript

 代码解读

复制代码

`import {InitUtils} from '@peakmain/library';`

#### 方法

public setWebViewUserAgent(userAgent: string, isSuffix: boolean = true)：InitUtils

##### 参数

参数

参数类型

是否必填

说明

userAgent

string

是

自定义的userAgent

isSuffix

boolean

否

是否将自定义的userAgent添加到已有系统userAgent后面，默认是true

##### 示例代码

javascript

 代码解读

复制代码

 ``InitUtils.getInstance(this.context).setWebViewUserAgent(` AtourBrowser/${appVer}/Harmony`)``

### 3\. 拦截H5发的协议，替换成自己的方法

H5发的协议，通常为以下示例格式

arduino

 代码解读

复制代码

`peakmain://page/login`

对应的是

arduino

 代码解读

复制代码

`scheme://authority/path`

我们需要拦截到该协议，替换成我们自己的方法

#### 3.1 定义协议scheme和authority

类上添加@Handle

##### 参数

参数

参数类型

是否必填

说明

scheme

string

是

访问资源的协议或机制

authority

string

是

域名或 IP 地址

#### 定义协议的Path

方法上添加@HandleMethod

##### 参数

参数

参数类型

是否必填

说明

path

string

是

资源的具体位置或路径

##### 返回值

返回值

类型

说明

HandleResult

enum

NOT\_CONSUME: 系统默认处理  
CONSUMED:自己已经处理了，不交给系统处理  
CONSUMING:正在处理中,不交给系统处理

##### 示例代码

kotlin

 代码解读

复制代码

`@Handle("peakmain","page") export class PageHandler {   @HandleMethod("/login")   login(): HandleResult {     LogUtils.error("进入登录页面")     return HandleResult.CONSUMED   }   @HandleMethod("/jumpToWhere")   jumpToWhere():HandleResult{     LogUtils.error("进入jumpToWhere");     return HandleResult.CONSUMED;   } }`