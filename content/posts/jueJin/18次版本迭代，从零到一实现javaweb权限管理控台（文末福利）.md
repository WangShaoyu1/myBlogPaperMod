---
author: "老马啸西风"
title: "18次版本迭代，从零到一实现javaweb权限管理控台（文末福利）"
date: 2020-09-26
description: "privilege-admin是一款为java设计的权限管理控台。权限作为web开发可以说是最基础，但同时也是最重要的一个环节。前端时间写了https://github.com/houbb/privilege权限管理框架，但是没有控台配置，总觉的是残缺的，于是…"
tags: ["Vue.js"]
ShowReadingTime: "阅读2分钟"
weight: 489
---
​privilege-admin
================

privilege-admin 是一款为 java 设计的权限管理控台。

特性
--

*   用户，角色，权限的管理
    
*   黑白名单管理
    
*   登入/登出日志审计
    
*   基于 auto-log 的统一日志输出
    

创作目的
----

权限作为 web 开发可以说是最基础，但同时也是最重要的一个环节。

前端时间写了 https://github.com/houbb/privilege 权限管理框架，但是没有控台配置，总觉的是残缺的，于是花时间从零实现了一个权限管理控台。

多年不接触前端，前端技术变化也比较大，此次选用 vue + element-ui + jwt 也当做练手。

技术选型
----

springboot 容器

mybatis-plus+druid+mysql 数据库

vue+element-ui 页面

hibernate-validator 参数校验

jwt 授权

auto-log 实现日志自动输出

快速开始
====

需要
--

jdk 1.7+

maven 3.x+

mysql 5.7

配置调整
----

此处使用的是 mysql-5.7，数据库脚本见 mysql-5.7.sql

在 mysql 中执行上述脚本，默认的 mysql 登录信息为 root/123456。

如果需要调整，修改 application.yml 文件。

启动
--

直接运行 Application#main() 方法，即可启动应用。

页面效果概览
======

登录页面
----

![image](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26b1e91fed034aad8d824af8ccf07a87~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

image

登录页面

默认的密码为 admin，你可以自己调整 `application.yml` 中的密码配置。

暂时加密规则：明文+MD5

角色管理
----

![image](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/903e61bd651244bbb1e2b14c7c98cdc6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

image

操作日志
----

![image](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73f8430070334ff1b77bbc5c0b3313ca~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

image

错误页面
----

![image](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db218aa7a27441fdbe123d9e2d216c99~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

image

如何获得源码
======

目前源码尚未开源，可以关注【老马啸西风】

后台回复：权限，即可领取相关资源。

后期 Road-MAP
===========

优化
--

*   \[ \] 数据库异常统一处理
    
*   \[ \] 使用 post 请求，避免 url 出现 token 信息
    

或者改写浏览器 url

安全审计
----

*   \[ \] 接口的 checksum 验签
    
*   \[ \] 操作日志表
    
*   \[ \] 元数据的管理
    

metadata 改进，支持导出。

更多特性
----

*   动态菜单的管理

tree

*   操作的权限管理
    
*   token 生成
    

生成指定权限的 token

*   对外提供接口能力

查询用户的角色+权限

判断用户是否拥有权限

*   黑白名单

黑 > 白 > 普通

*   \[ \] tag 的支持
    
*   \[ \] 用户组等模式的支持
    
*   批量
    

批量导入

数据导出

*   更新日志
    
*   关于我们
    

生态
--

*   \[ \] oracle/sql server 的脚本
    
*   \[ \] 通过 electron 打包到各个平台
    
*   \[ \] docker 的实现
    
*   \[ \] webpack 打包优化
    
*   \[ \] vue+vuex+babel+npm+nodejs 前后端分离
    

如何获得源码
======

目前源码尚未开源，可以关注【老马啸西风】

后台回复：权限，即可领取相关资源。

![深入学习](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d9820a4139b45259594392f3e474965~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

深入学习