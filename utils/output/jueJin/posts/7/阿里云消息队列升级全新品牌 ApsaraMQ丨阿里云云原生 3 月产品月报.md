---
author: "阿里云云原生"
title: "阿里云消息队列升级全新品牌 ApsaraMQ丨阿里云云原生 3 月产品月报"
date: 2024-04-15
description: "云原生月度动态 云原生是企业数字创新的最短路径。 《阿里云云原生每月动态》，从趋势热点、产品新功能、服务客户、开源与开发者动态等方面，为企业提供数字化的路径与指南。 趋势热点 🥇 阿里云 Apsara"
tags: ["云原生中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:0,comments:0,collects:0,views:202,"
---
**云原生月度动态**

云原生是企业数字创新的最短路径。

《阿里云云原生每月动态》，从趋势热点、产品新功能、服务客户、开源与开发者动态等方面，为企业提供数字化的路径与指南。

趋势热点
----

### 🥇 阿里云 ApsaraMQ 率先完成消息队列全系 Serverless 化，携手 Confluent 发布新产品

3 月 29 日，在“飞天发布时刻”上，阿里云云原生应用平台负责人丁宇宣布，云消息队列产品升级全新品牌 ApsaraMQ，将围绕“高弹性低成本、更稳定更安全、智能化免运维”三大方向持续拓展突破，产品全面 Serverless 化，帮助用户降本 50%；同时与全球消息流领导者 Confluent 达成战略合作，推出云消息队列 Confluent 版，为企业和开发者提供更高效更安全的消息流服务， 已在阿里云中国站与国际站同步上线。

相关文章：[阿里云 ApsaraMQ 率先完成消息队列全系 Serverless 化，携手 Confluent 发布新产品](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzUzNzYxNjAzMg%3D%3D%26mid%3D2247563192%26idx%3D1%26sn%3Dcde3698299acfb6b36c1daaa6bf9841e%26chksm%3Dfae7fc77cd9075611b82dce8a0c873de919c1760bd5bbe93f9631b684f2e8876f6969e602fa8%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247563192&idx=1&sn=cde3698299acfb6b36c1daaa6bf9841e&chksm=fae7fc77cd9075611b82dce8a0c873de919c1760bd5bbe93f9631b684f2e8876f6969e602fa8&scene=21#wechat_redirect")

### 🥈全新架构！日志服务 SLS 自研免登录方案发布

SLS 自研了一套全新的基于 Ticket 的免登方案，支持客户能够使用 Ticket 方案将 SLS 控制台免登分享给他人或免登嵌入到第三方系统，同时可控制嵌入至第三方系统的日志服务权限。该 Ticket 方案登录过程只需要两步，第一是调用 SDK 获取免登链接，第二是使用链接直接访问 SLS，在此过程中没有任何浏览器重定向操作。有着速度快、彻底解决会话时间限制问题、不存在跨域问题等优势。

相关文章：[全新架构！日志服务 SLS 自研免登录方案发布](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzUzNzYxNjAzMg%3D%3D%26mid%3D2247562586%26idx%3D1%26sn%3D18f8269238428f11ed32db5d41a579dd%26chksm%3Dfae7fe95cd907783e6d26d1863b21ac670156055a719e08f8be9b6330a14f9dec1f04a834516%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247562586&idx=1&sn=18f8269238428f11ed32db5d41a579dd&chksm=fae7fe95cd907783e6d26d1863b21ac670156055a719e08f8be9b6330a14f9dec1f04a834516&scene=21#wechat_redirect")

产品新功能
-----

### 微服务引擎 MSE

*   云原生网关自定义插件支持访问 Redis
*   微服务治理支持按流量比例的全链路灰度能力
*   Nacos 支持对配置文件进行对比
*   分布式任务调度的任务托管 CU 全面降价

### API 网关

*   后端路由支持 Hash 分发算法
*   支持从 XFF 头中读取 IP
*   支持通过网关获取源端口号
*   专享实例最大超时时间允许设置至 120s

### 容器服务 Kubernetes 版

*   ACK AI 助手进行故障排查和智能问答
*   虚拟节点支持 Windows 节点创建，支持启用 SysOM 内核可观测性能力
*   支持 GPU 设备隔离
*   最佳实践：虚拟节点支持采集指定虚拟节点的 Metrics
*   ACK 新增 KubeConfig清除和回收站功能

### 容器服务 Edge版 ACK Edge

*   云边通信方案升级

### 分布式云容器平台 ACK One

*   支持将 MSE 云原生网关作为多集群网关，实现混合云同城容灾系统
*   注册集群增强 AI 场景支持，可使用 Fluid 加速 OSS 文件访问
*   ACK One 多集群舰队 GitOps 支持钉钉机器人通知变更

### 应用实时监控服务 ARMS

**ARMS 应用监控**

*   国际 Region 发布新版计费变更向导
*   容器部署应用的场景下，新增支持通过 Pod 环境变量方式注入自定义实例标签
*   新版控制台优化关键菜单展示

**ARMS 智能告警**

*   告警通知渠道支持 Lark
*   优化企业微信、飞书的用户认证方式，通过告警联系人手机号+验证码的方式即可完成验证并支持告警处理

**用户体验监控**

*   移动端支持卡顿、ANR、JS 错误分析
*   前端请求端到端打通，支持展示请求调用链与调用拓扑
*   新加坡、美西开服

**云拨测**

*   PING 协议支持内网拨测
*   HTTP 任务支持配置 ALPN 协议
*   开放获取拨测结果详情的 OpenAPI
*   HTTP 任务拨测结果详情支持展示 DNS 服务器 IP
*   支持配置证书到期时间告警

### 可观测监控 Prometheus 版

*   Prometheus 数据投递服务全球区域开服，支持将 Prometheus 数据通过公网或内网方式投递到阿里云消息队列 Kafka 版、阿里云云原生大数据计算服务 MaxCompute、Prometheus Remote Write 地址
*   Prometheus 实例支持 OpenTelemetry 指标上报新增国内外 20 个区域
*   新版接入金融云上线
*   针对 ASM 中自定义指标采集，在支持“启用 mTLS 证书”
*   控制台支持 Prometheus 实例粒度 RAM 策略授权
*   优化新版接入中心，接入环境如果重名报错的体验
*   云原生多模数据库 Lindorm 接入新增内置的告警规则
*   接入中心 MicroMeter 组件支持 HTTPS 协议采集
*   自定义数据采集支持基于 ECS 标签进行服务发现

### 日志服务 SLS

*   阿里云日志服务 SLS 支持导入 Amazon S3 中的日志文件。用户可以通过数据导入的方式将 Amazon S3 的日志文件导入到阿里云的日志服务，实现日志的查询分析、加工等操作
*   SLS 提供日志采集客户端 HarmonyOS SDK，支持采集各类 HarmonyOS 设备的日志。HarmonyOS SDK 通过 ArkTS 封装实现，使用 C 语言编写
*   SLS Logtail 1.8.7 版本 Logtail-ds 组件支持 ACK 场景的资源组配置
*   SLS Lens 支持一键开启日志采集功能

### 云监控

*   DDoS 原生防护监控指标上线
*   分批完成将存量用户应用分组下系统事件报警规则迁移至事件中心的事件订阅

### 服务网格 ASM

*   发布 Istio 1.20 版本
*   ASM 网关支持灰度升级和场景化限流功能
*   通过 mTLS 采集网格应用的监控指标
*   提供增强的网格拓扑功能

### 事件总线 EB

*   EventStreaming 运行状态能力发布，支持实时监控及上报任务状态
*   EventStreaming 支持数据格式配置，数据格式是针对支持二进制传递的数据源端推出的指定内容格式的编码能力；目前支持 Json，Text，Binary 三种数据格式（目前已经上线 Kafka ，MQTT Source）

### 通义灵码

*   通义灵码企业版支持私有化输出，满足大型金融类客户使用场景
*   行间生成场景模型升级为 CodeQwen2，代码生成效果更好
*   JetBrains 端优化问答区代码高亮效果，更贴合开发者 IDE 使用习惯

### 云效应用交付 AppStack

*   应用模板修改支持批量同步应用

### 云效流水线 Flow

*   流水线 YAML 支持 template 语法

优秀实战案例
------

### 爆款游戏借助 RocketMQ Serverless，打造流畅体验并节省 98% 成本

近期，某游戏客户精心打造的一款冒险闯关类游戏，游戏中的一处亮点场景具有时间短、频率低的特点，对于该业务场景呈现出的，对消息中间件使用时段高度集中、运行时长短且流量大、可用性要求高等特点，该游戏客户选择了阿里云消息队列 RocketMQ 5.0 Serverless 版本作为核心的消息中间件。阿里云消息队列 RocketMQ 5.0 Serverless 版本以其弹性伸缩与按需计费的特性，能够轻松应对短时间内突发的大规模消息处理需求。同时，阿里云消息队列 RocketMQ 5.0 Serverless 版本采用高可用架构，保证了即使在面对复杂业务场景或者部分节点故障时，整个消息队列服务依然能够持续稳定运行，提供高效及时的响应服务。云消息队列 RocketMQ 5.0 Serverless 版本按照实际使用资源量进行计费，得益于此特性，该游戏客户成功实现了每月资源成本大幅削减 98%。

相关文章：[爆款游戏如何借助 RocketMQ Serverless，打造流畅体验并节省 98% 成本？](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzUzNzYxNjAzMg%3D%3D%26mid%3D2247562548%26idx%3D1%26sn%3Dea1e327347f3580e8377a605042ebc0e%26chksm%3Dfae7fefbcd9077ed4ad7459f96ca7089d8e4e3813faf4a6f312551e72ab7e0691e00fe37dcd1%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247562548&idx=1&sn=ea1e327347f3580e8377a605042ebc0e&chksm=fae7fefbcd9077ed4ad7459f96ca7089d8e4e3813faf4a6f312551e72ab7e0691e00fe37dcd1&scene=21#wechat_redirect")

### 左手医生：医疗 AI 企业的云原生提效降本之路

左医科技秉持“打造主动式 AI、让优质医疗触手可及”的理念，推出了核心产品“左手医生” App，过去左手医生的服务采用传统方式部署在云服务器 ECS 上，随着平台的快速发展，及对医疗大数据处理需求的增长，单体架构给业务带来的挑战日益明显。为解决问题，左手医生决定采用云原生技术重构其核心医疗服务平台，通过使用 ACK、MSE、ARMS、Kafka 等阿里云产品进行业务微服务化改造和容器化部署，将原有 ECS 上的服务迁移至容器环境，实现了服务模块化、资源弹性调度、以及更为健壮的消息传递机制。通过使用阿里云云原生等产品，左手医生项目的上线时间缩短了 67%，运维效率提升 70% 左右，消息处理的效率也提升了 80% 左右。

[相关文章：左手医生：医疗 AI 企业的云原生提效降本之路](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzUzNzYxNjAzMg%3D%3D%26mid%3D2247563016%26idx%3D1%26sn%3Df444d2b4578ae12406d3abdceb3743b3%26chksm%3Dfae7fcc7cd9075d110dfc96ab4b1c6ae17875c11923919ded3b3238ada56e817e1066661e3ff%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247563016&idx=1&sn=f444d2b4578ae12406d3abdceb3743b3&chksm=fae7fcc7cd9075d110dfc96ab4b1c6ae17875c11923919ded3b3238ada56e817e1066661e3ff&scene=21#wechat_redirect")

开源与开发者动态
--------

### 用 AI 画春天，函数计算搭建 Stable Diffusion WebUI

阿里云开发者社区×函数计算发出春日主题 AI 创作挑战！基于函数计算快速部署 Stable Diffusion，三步轻松生成春日画作，在感受科技魅力的同时，速成 AIGC 创作家！

[相关文章：【体验有奖】用 AI 画春天，函数计算搭建 Stable Diffusion WebUI](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzUzNzYxNjAzMg%3D%3D%26mid%3D2247562513%26idx%3D2%26sn%3Dc6a02e083bd5e66cf1d1d328e477f6d1%26chksm%3Dfae7fedecd9077c849f36d2db9679b8a3c4431430395e88400bf0f161d39e670b7db835bcc70%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247562513&idx=2&sn=c6a02e083bd5e66cf1d1d328e477f6d1&chksm=fae7fedecd9077c849f36d2db9679b8a3c4431430395e88400bf0f161d39e670b7db835bcc70&scene=21#wechat_redirect")

### 通义灵码 3 月体验活动上线，四大经典场景一键体验

为了让更多开发者体验 AI 编码新玩法，通义灵码特别发布全民体验活动，你可以用通义灵码生成 2048 小游戏、写八皇后算法解题思路及代码、写时空穿梭机特效等等，在线玩不停。

相关文章：[嘿！AI 编码新玩法上线！](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzUzNzYxNjAzMg%3D%3D%26mid%3D2247562522%26idx%3D1%26sn%3D0466856e817479920de451f708f354f7%26chksm%3Dfae7fed5cd9077c38b147b5858cd75020d86c9d2e38c1f6899a2be8f68e2a834c403963a8a0d%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247562522&idx=1&sn=0466856e817479920de451f708f354f7&chksm=fae7fed5cd9077c38b147b5858cd75020d86c9d2e38c1f6899a2be8f68e2a834c403963a8a0d&scene=21#wechat_redirect")

### 通义灵码产品技术负责人陈鑫做客 QCon 北京特别策划圆桌节目

智能编码工具的快速普及是否会带来全新的编程模式？“大力出奇迹”的规律还将继续适用吗？阿里云通义灵码产品技术负责人陈鑫做客 QCon 北京特别策划圆桌节目，对 AI、智能编码等问题做出精彩回答。

相关文章：[微调工程师岗位可能并不存在，但使用 AI 编码工具已经成为刚需](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzUzNzYxNjAzMg%3D%3D%26mid%3D2247562951%26idx%3D1%26sn%3D7abc5277062b625ec8556b4657376e96%26chksm%3Dfae7fd08cd90741e596e4791aae7a5eb13545c0fc4327827b78f07dda7e62acfa66a7fdca883%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247562951&idx=1&sn=7abc5277062b625ec8556b4657376e96&chksm=fae7fd08cd90741e596e4791aae7a5eb13545c0fc4327827b78f07dda7e62acfa66a7fdca883&scene=21#wechat_redirect")

### AI 大模型技术周：AIGC 趋势下的软件工程重塑智能编码探索与实践

以「AI 大模型技术周：AIGC 趋势下的软件工程重塑智能编码探索与实践」为主题的专场活动成功举办，分别邀请了阿里云通义灵码技术负责人陈鑫、阿里云通义灵码工程域技术负责人林帆等人，分享关于 AI Native 研发的最新趋势和发展动态，详解通义灵码产品的核心能力和实际应用技巧，实例展示通义灵码如何有效解决五大典型研发场景问题，并结合真实场景进行实操演示。

相关文章：[谈谈我对 AIGC 趋势下软件工程重塑的理解](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzUzNzYxNjAzMg%3D%3D%26mid%3D2247562807%26idx%3D1%26sn%3D7ec01628a35b098d73959b05f8b591a3%26chksm%3Dfae7fdf8cd9074eef6455b59dd028c030bb940a530d04194b552b13f0ec7c9171bebc695ae57%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247562807&idx=1&sn=7ec01628a35b098d73959b05f8b591a3&chksm=fae7fdf8cd9074eef6455b59dd028c030bb940a530d04194b552b13f0ec7c9171bebc695ae57&scene=21#wechat_redirect")[](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzUzNzYxNjAzMg%3D%3D%26mid%3D2247562807%26idx%3D1%26sn%3D7ec01628a35b098d73959b05f8b591a3%26chksm%3Dfae7fdf8cd9074eef6455b59dd028c030bb940a530d04194b552b13f0ec7c9171bebc695ae57%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247562807&idx=1&sn=7ec01628a35b098d73959b05f8b591a3&chksm=fae7fdf8cd9074eef6455b59dd028c030bb940a530d04194b552b13f0ec7c9171bebc695ae57&scene=21#wechat_redirect")

**往期月报：**

[阿里云参编业内首个代码大模型标准丨云原生 2024 年 1 月产品技术动态](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzUzNzYxNjAzMg%3D%3D%26mid%3D2247561988%26idx%3D1%26sn%3D5e73f0d2588392c42c0f07431d94b9b8%26chksm%3Dfae7f8cbcd9071dd916c3bb88f894a114e7a84fc13d4f2983d3fac13fad7351c7d08d4080636%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247561988&idx=1&sn=5e73f0d2588392c42c0f07431d94b9b8&chksm=fae7f8cbcd9071dd916c3bb88f894a114e7a84fc13d4f2983d3fac13fad7351c7d08d4080636&scene=21#wechat_redirect")

[iLogtail 2.0 来了；通义灵码下载量破百万丨阿里云云原生 2 月产品月报](https://link.juejin.cn?target=http%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzUzNzYxNjAzMg%3D%3D%26mid%3D2247562604%26idx%3D2%26sn%3D4632256a8bdef66fa079e6fe496e4128%26chksm%3Dfae7fea3cd9077b5987e9ff803b7d885dd0a417a9cbe6b4fb5ae8566a934dba09b49efe3b7ab%26scene%3D21%23wechat_redirect "http://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247562604&idx=2&sn=4632256a8bdef66fa079e6fe496e4128&chksm=fae7fea3cd9077b5987e9ff803b7d885dd0a417a9cbe6b4fb5ae8566a934dba09b49efe3b7ab&scene=21#wechat_redirect")