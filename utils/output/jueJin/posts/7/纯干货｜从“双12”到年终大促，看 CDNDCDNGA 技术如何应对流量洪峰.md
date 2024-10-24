---
author: "字节跳动技术团队"
title: "纯干货｜从“双12”到年终大促，看 CDNDCDNGA 技术如何应对流量洪峰"
date: 2024-01-25
description: "本文从动态扩容、流量调度、自保能力、流量压测、加速性能 5 个方面介绍应对双 12 突发流量时火山引擎 CDNDCDNGA 提供的解决方案。"
tags: ["CDN中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读12分钟"
weight: 1
selfDefined:"likes:5,comments:0,collects:6,views:29758,"
---
12月12日，“抖音商城双12好物节”正式结束。据了解，双12期间，抖音电商推出了超值购、秒杀等多个优价频道和多个类目的主题榜单，让有消费需求的用户更高效地发现高性价比好物。除了货架场景，“抖音商城双12好物节”还发力重点达人直播间、好物直播间等内容场域，通过电商优质内容为商家和达人创造生意增量。

![](/images/jueJin/04a9051e9338498.png)

“抖音商城双12好物节”的背后是大流量、高并发对基础技术提出的挑战，保障大促期间平台的平稳运行、用户流畅的购物体验尤为重要。在经受了双十一海量流量考验的基础上，火山引擎CDN/DCDN和GA作为抖音静态/动态/长连接业务流量入口，保障了大促期间抖音电商平台的平稳运行。

下图为抖音客户端视频业务/动态接口/长连接业务主要流量架构图，客户请求通过火山引擎内容分发网络（CDN）、全站加速（DCDN）、全球加速（GA）回源到中心网关，转发到对应的业务服务。

![whiteboard_exported_image.png](/images/jueJin/715d786506c64ef.png)

技术架构
====

火山引擎CDN/DCDN和GA利用丰富的网络资源，依托边缘云全球网络（含到主要地区的合规专线）降低网络抖动、时延和丢包，显著提升传输效率，结合自研的传输优化、智能缓存、动态路由、安全防护等能力，为用户提供安全、稳定的一站式加速服务，提升用户访问体验。

*   火山引擎内容分发网络产品 CDN (Content Delivery Network）提供稳定、弹性、高性能的全球内容分发服务。
*   火山引擎全站加速产品 DCDN (Dynamic Content Delivery Network) 是一款在 CDN 静态内容加速服务的基础上，提供纯动态及动静态混合内容加速的服务。
*   火山引擎全球加速产品 GA（Global Accelerator）是一款实现全球范围网络就近接入和跨地域部署的四层网络加速服务。

![](/images/jueJin/7615c099b8f949f.png)

火山引擎CDN/DCDN/GA通过抖音集团业务和规模化ToB业务的打磨，已经形成了一套完备且具备规模商业化能力的系统。

*   资源分布：全球2500+加速节点，国内实现三大运营商本省覆盖，海外覆盖了主要国家和地区；
*   丰富协议：支持HTTP(S)、QUIC、WebSocket、TCP、UDP协议接入；
*   智能调度：保证客户就近接入，实现亿级QPS的全网调度；
*   智能路由：自研智能路由系统，保证请求最优路径回源，提升用户体验；
*   传输优化：通过协议优化、回源预建连、公网路由择优等策略，提升动态API、上传、下载等各个场景的传输速度；
*   安全防护：支持大容量的 DDoS 防护、CC 防护、Web 漏洞防护，全链路 HTTPS （支持国密协议），确保数据传输安全；
*   稳定性：通过大规模QPS的验证，稳定性经过充分验证，经历了抖音春晚红包、抖音世界杯直播、抖音电商双十一等大型活动考验。

![](/images/jueJin/c6958d4ee33d460.png)

解决方案
====

火山引擎CDN/DCDN/GA作为抖音业务动静态流量入口，在双12期间，不仅要承载常态流量，还需要应对大促带来的洪峰流量冲击，这对火山引擎CDN/DCDN/GA的容量、调度能力、容灾能力都提出了更高的要求。对此，本文从5个方面介绍应对双12突发流量时火山引擎CDN/DCDN/GA提供的解决方案。

动态扩容
----

**为了解决大促高峰时间段的资源不足问题，** **火山引擎CDN** **/DCDN/** **GA** **采用动态扩容技术。** 双12带来的流量是脉冲式流量，持续时间短，峰值高。虽然火山引擎CDN/DCDN/GA常态下会保留一定的流量冗余，但依然无法应对大促带来的突发流量。如果想要通过短时间内完成大量边缘节点扩容来解决这一问题，不仅操作难度极大，而且仅为活动进行大规模扩容，也会造成资源浪费。因此，如何动态扩容以应对短时间洪峰流量，是火山引擎CDN/DCDN/GA产品在双12遇到的主要挑战之一。

火山引擎CDN/DCDN/GA使用火山引擎边缘云统一技术底座，主要流量运行在边缘云容器/虚拟机上。因此可以在活动正式开始前，充分利用边缘容器平台的弹性能力，快速创建出一批新资源，完成资源动态扩容，满足活动期间的容量需求。在活动结束后，将扩容资源释放，实现整体容量的快速扩缩。

流量调度
----

**为了应对突发流量，** **火山引擎CDN** **/** **DCDN** **/** **GA** **引入“活动”流量模型。** 常态下，火山引擎CDN/DCDN/GA会根据业务实时以及最近几天的QPS/带宽/连接数进行调度，但面对双12带来的突发流量，这种调度模式显然无法适应。

为解决这个问题，火山引擎引入了“活动”流量模型。假设活动期间各个地区的流量分布与常态流量一致，根据业务预估的总QPS/带宽/连接数，按比例分配到不同地区。在进行调度时，将预估的活动流量一并纳入考虑，因此调度后的节点能够承载活动突发流量。同时会根据前一天的流量值修正下一次活动流量模型。

![引入“活动”的流量模型](/images/jueJin/94bbe864738e461.png)

引入“活动”的流量模型

自保能力
----

**为了应对容量风险，** **火山引擎CDN** **/DCDN/** **GA** **具备熔断能力实现自保。** 资源和调度已具备应对预估峰值的能力，但业务预估流量跟真实流量很可能存在偏差。如果业务预估比真实流量低，突发流量很有可能超出CDN/DCDN/GA服务上限，当出现短时间的可用性降低、请求耗时增加后，会触发客户端不断重试，进一步加剧服务压力，极有可能造成线上整体的雪崩，影响产品请求。

因此，为了应对极端场景的风险，CDN/DCDN/GA需具备熔断能力，当请求量达到一定阈值后，通过熔断降低系统压力，保证线上主要业务流量的稳定性。

活动期间，主要有以下容量风险：

*   CPU资源风险：大量客户端冷启，新建连接（CPS）突增，抖音支持全链路HTTPs，因此冷启客户端会进行大量的SSL握手，消耗DCDN节点大量CPU资源；
*   QPS突增风险：电商API接口请求量（QPS）突增，超过CDN/DCDN/GA处理能力上限，造成服务崩溃；
*   请求堆积风险：随着QPS突增，活动业务后端服务压力增加，响应耗时变大，造成大量请求堆积，拖垮CDN/DCDN/GA和业务服务。

为了应对上述风险，火山引擎CDN/DCDN/GA产品引入多维度熔断能力：

*   CPS熔断能力：针对最耗费CPU的SSL握手，支持针对单域名和全局SSL握手限流能力，当单个域名的SSL流量超出阈值后，将拒绝新SSL请求，避免打爆CPU；
*   QPS熔断能力：当活动域名的QPS超过设定阈值后，拒掉新请求，避免过多请求回源，保护自身和源站服务；
*   回源熔断能力：当单个域名同时回源的请求达到一定阈值后，新的回源请求会在CDN/DCDN/GA直接熔断，响应异常码，避免业务服务响应变慢后，请求堆积拖垮业务后端服务。

上述熔断能力，均支持单域名和全局粒度。

*   单域名熔断，主要针对活动域名配置，避免活动域名突增影响全局流量。
*   全局熔断能力，主要是保护DCDN服务，当超过DCDN服务能力上限后，熔断一部分流量，保证大部分流量可正常服务。

流量压测
----

**具备资源、调度、熔断能力后，还需要在活动之前对上述功能进行验证**。对此，火山引擎CDN/DCDN/GA与抖音客户端合作，进行全链路压测，利用真实的客户端请求，模拟活动期间洪峰，验证全链路的处理能力。

![](/images/jueJin/49a8243d6dfe46b.png)

流量压测曲线

加速性能
----

**性能接入是加速产品最重要的衡量指标之一**。如何更好的提升性能，也是火山引擎CDN/DCDN/GA产品持续探索的方向，经过多年的打磨，沉淀了经验，以下是火山引擎CDN/DCDN/GA产品在性能优化方面的主要策略。

### 智能调度

移动端用户通过4G/5G/WIFI无线网络访问源站应用，信号不稳定，如果直连源站，RTT较长，按照主流的基于ACK反馈或超时来判断丢包的拥塞控制算法，需要很长时间才能感知到丢包，再进行重传，导致时延非常大，如果通过更近的接入点上车，移动端和节点之间RTT更短，就可以更快感知到丢包，更快进行重传，降低时延。

火山引擎CDN/DCDN/GA自研的智能调度算法会基于用户分布情况，动态实时计算出接入质量更优的节点，例如在某城市，会根据用户分布的集中度，选择离大多数用户更近的接入点上传，相比传统的DNS调度能更好的实现就近接入，提升用户体验。

### 智能路由

广域网网路存在复杂的运营商和地域限制策略，经常出现绕路、限速等情况。针对此问题，火山引擎自研的智能选路系统可在复杂的广域网中实时选择最优路径回源，保障业务的最佳体验。智能路由解决的是多目标路径规划问题，需要兼顾性能、容量等，重点是归一化目标函数设计。火山引擎CDN/DCDN/GA综合考虑了链路质量、节点水位、亲缘性等目标，同时根据不同的业务场景（API、上传、下载等）采用不同权重值，保证各种业务场景按照最佳链路回源。

![](/images/jueJin/5cef1766003d432.png)

### 传输优化

*   **协议栈优化**：回源链路采用火山引擎自研的TTCP协议栈，TTCP具备内核插件化能力，已在火山引擎CDN/DCDN/GA全网部署，支持域名粒度控制，可根据业务场景（API、上传、下载）实现精准化的参数控制和自适应拥塞控制算法，保证最佳的访问体验。同时TTCP实现了平台化的管理，利用采集现网数据通过大数据实时分析决策动态的调整系统参数和拥塞控制算法，提升访问体验。
*   **连接优化**：火山引擎CDN/DCDN/GA产品为提升访问性能、降低中心服务的压力，采取了“预建连”优化手段。节点在没有真实请求时，主动与源站建立一批连接，维护在连接池内，当突发业务请求到达，回源时可直接复用连接，提高访问性能。通过抖音集团内部业务测试显示，采用预连接策略后，首包时间耗时从115ms 降低到54ms，降低了53%以上，效果明显。

![](/images/jueJin/a2a6806aa85140c.png)![](/images/jueJin/95dae48d1f294b3.png)

应用案例
====

火山引擎DCDN承载了双十一期间抖音业务主要API流量，在双十一的洪峰挑战中保证了用户最佳购物体验，性能、稳定性得到了充分验证。通过客户端监测数据，火山引擎DCDN活动期间服务稳定，且加速性能达到行业领先水平。

1.  抖音短视频：抖音短视频核心Feed流API请求通过开启QUIC协议，采用智能路由、预建连等优化策略，网络耗时均值降低7%以上，长尾耗时降低17%以上，人均播放时长等核心业务收益显著正向。

![](/images/jueJin/f9625e2d99a0412.png)

2.  抖音电商：结合边缘高防调度以及边缘WAF能力，解决API防护、 DDoS 和 CC 攻击、保护内容不被恶意爬取、劫持、篡改等，通过自研的传输优化、智能缓存、动态路由等技术提供了纯动态及动静态混合内容的加速服务，为用户提供更优质的访问体验。

![](/images/jueJin/0c55c046d7384ca.png)

展望未来
====

火山引擎CDN/DCDN/GA自上线以来，通过字节内部大规模QPS、亿级并发连接数的验证，经历了双十一、春节活动、世界杯等大型活动考验，经过多年的打磨，性能、稳定性达到业内领先水平，沉淀了典型应用场景的加速解决方案。火山引擎DCDN和GA先后于2021年和2022年正式ToB，把服务抖音业务的技术积累提供给更多的外部客户。

下一步，火山引擎CDN/DCDN/GA会继续进行深度优化，持续降低访问时延，比如在加速网络内部使用基于UDP的私有协议，针对动态API、上传、下载场景使用更加自助可控的丢包检测和拥塞控制算法，另外结合端上的能力，针对时延敏感性业务，比如游戏场景联动火山引擎游戏加速解决方案GNA支持全链路的加速能力，开启FEC、双通道、网络检测能力等，为用户提供极致性价比的加速服务。

> 更多点击：[bytedance.larkoffice.com/share/base/…](https://link.juejin.cn?target=https%3A%2F%2Fbytedance.larkoffice.com%2Fshare%2Fbase%2Fform%2FshrcnpgFfJqn82EscSBpgTINH3g "https://bytedance.larkoffice.com/share/base/form/shrcnpgFfJqn82EscSBpgTINH3g")