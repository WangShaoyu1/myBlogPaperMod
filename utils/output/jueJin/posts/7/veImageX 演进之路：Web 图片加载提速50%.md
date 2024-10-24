---
author: "字节跳动技术团队"
title: "veImageX 演进之路：Web 图片加载提速50%"
date: 2023-09-26
description: "随着图片和视频业务的发展，用户量增长的同时也带来了 CDN 带宽成本的快速提升，该方案从体验和成本出发解读，旨在为用户提升体验的同时降低带宽成本。"
tags: ["CDN","图片资源中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读11分钟"
weight: 1
selfDefined:"likes:33,comments:0,collects:45,views:16814,"
---
> 作者：
> 
> 马超， veImageX web生态负责人；
> 
> 张锡平， veImageX 产品负责人

背景说明
====

火山引擎veImageX演进之路主要介绍了veImageX在字节内部从2012年随着字节成长过程中逐步演进的过程，演进中包括V1、V2、V3版本并最终面向行业输出；整个演进过程中包括服务端、客户端、网络库、业务场景与优化等多个角度介绍在图像处理压缩、省成本与体验优化的经验与方案；

本篇文章重点介绍在web端演进和提供的能力，图片是 Web 站点中的重要元素，图片体积、格式、分辨率以及渲染方式对用户体验有着显著影响。火山引擎veImageX 为业务提供了灵活、高效的一站式图片解决方案和静态素材托管方案，涵盖了上传、存储、处理、分发、评估等图片生产和消费阶段的全部链路。

解决的问题
=====

Web 场景下图片的应用非常广泛，从传统的图文到视频封面都有图片的身影，图片体验是用户体验中很重要的一环，常用于衡量站点性能的 [LCP](https://link.juejin.cn?target=https%3A%2F%2Fweb.dev%2Fi18n%2Fzh%2Flcp%2F "https://web.dev/i18n/zh/lcp/") 和 [CLS](https://link.juejin.cn?target=https%3A%2F%2Fweb.dev%2Fi18n%2Fzh%2Fcls%2F "https://web.dev/i18n/zh/cls/") 指标都把图片列为最重要的元素之一。 随着业务的发展，用户量增长的同时也带来了 CDN 带宽成本的快速提升，最主要的元素则是图片和视频。因此，方案从体验和成本出发，旨在为用户提升体验的同时降低带宽成本。

用户体验可视化
-------

图片体验问题通常有以下几点：

*   加载速度慢：图片体积、网络、CDN、处理耗时等因素均会影响加载耗时；
*   加载失败率高：导致图片加载失败的因素很多，重点在于如何及时定位问题；
*   渲染体验差：包括图片区域长时间空白、加载后导致页面抖动、出错后无兜底等场景；

开发者往往忽视了图片体验，也不了解图片对站点性能的影响，并且缺少可量化的数据来衡量站点的图片体验。参考 Lighthouse [性能优化指南](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.chrome.com%2Fdocs%2Flighthouse%2Fperformance%2F "https://developer.chrome.com/docs/lighthouse/performance/")，方案整合了图片压缩、图片懒加载、图片稳定性布局、错误兜底等能力，并集成了数据监控能力，可结合 火山引擎veImageX 控制台实时大盘数据查看，为业务提供数据上报、数据分析、数据追踪、数据告警等全链路支持。

带宽成本问题
------

以下问题通常会带来额外的带宽成本：

*   图片压缩率低；
*   图片原始分辨率和渲染分辨率不匹配；
*   采用传统的 PNG、JPEG 等低压缩率格式；
*   图片未进行懒加载；

除了图片压缩，方案支持了 WebP、AVIF 等高压缩率图片格式的自适应加载和图片分辨率的自适应加载，尽可能减小图片体积。同时集成了图片懒加载，避免不可见区域的图片加载，降低站点 CDN 成本，**同时也提升站点整体加载速度。根据内部业务数据，图片传输带宽和图片加载耗时通常可降低 50% 以上。**

方案架构
====

方案总体上可划分为图片加载和数据监控两个部分。

![方案架构.png](/images/jueJin/2481add5debf47f.png)

如图所示，图片加载部分支持分辨率、格式自适应以及懒加载、稳定性布局等特性，其中涉及到图片处理部分基于火山引擎veImageX 服务实现，如图片转码、缩放、压缩等。SDK 侧生成当前环境下最佳的图片格式和分辨率，从服务获取相应的图片 URL，借助云端处理能力在运行时动态生成所需的图片。

数据监控部分可分为加载耗时监控、图片详情监控、画质评估、大图监控、云控配置几部分，监控 SDK 收集相关数据，根据云端下发的配置上报数据，火山引擎veImageX 服务对数据做清洗后可在控制台侧查看数据大盘。

模块详细介绍
======

图片加载
----

### 图片格式自适应

常见的图片格式有 PNG、JPEG、GIF、WebP、AVIF、HEIC 等，其中 WebP、AVIF、HEIC 等高压缩率图片格式可显著减小图片体积。但由于不同浏览器对高压缩率格式的支持情况不同，因此在应用时需要考虑图片加载的环境。三种高压缩率格式在 Web 侧的兼容性如下：

1.  WebP

![](/images/jueJin/003cd642d5b146a.png)

2.  AVIF

![](/images/jueJin/26f5d518aac1447.png)

3.  HEIC

![](/images/jueJin/18ae9da316934f6.png)

在 APP 端，对于不支持的图片格式可采用 SDK 软解的方式进行解码、渲染，Native 侧的性能可保证图片解码的耗时和流量的节省都能有不错的收益。在 Web 侧，由于浏览器性能限制，veImageX 内部性能测试表明，SDK 软解在图片整体耗时方面的收益并不明显，尤其是多图场景下，因此在 Web 侧更适合走格式自适应的方案，即根据浏览器的支持性加载相对最优的图片格式。

常见的做法是采用 标签以实现格式的自适应， 标签有相对不错的[兼容性](https://link.juejin.cn?target=https%3A%2F%2Fcaniuse.com%2F%3Fsearch%3Dpicture "https://caniuse.com/?search=picture")，支持包含零或多个 元素和一个 ![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58) 元素来为不同的浏览器环境提供图片版本，浏览器会自上而下选择可以被渲染的图片，若没有匹配的，则选择 ![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58) 元素当中的图片作为兜底。加载 SDK 最初也采用了该方案，如下：

```html
<picture>
<source srcset="image1.webp" type="image/webp" />
<img src="image1.jpg" decoding="async" loading="lazy"/>
</picture>
```

但由于浏览器版本众多，在实际应用中，可能会出现很多预期以外的情况，比如：

*   会同时加载多个图片资源，造成带宽的浪费；
*   并非完全支持 WebP 的所有特性，存在加载失败的场景；
*   只支持 AVIF 静图格式，不支持动图；
*   ...

为了保证图片加载成功率，因此在实际应用中无法直接使用 标签，加载 SDK 目前采用格式探测 + 相结合的方式来解决该问题。同时，由于 HEIC 支持率太低，格式自适应目前只做了 WebP 和 AVIF 的自适应，同等质量下，WebP 相比 JPEG 可减少 30% 的图片体积，AVIF 则可在 WebP 的基础上再减少 20%；

### 图片分辨率自适应

分辨率自适应指的是客户端根据实际渲染的宽高获取相应分辨率的图片，从而减小图片体积。常见的做法是我们可以借助 HTML 中原生的 srcset 属性来定义图像集，以及每个图像应用的场景。由以下三部分组成：

*   文件名
    
*   空格
    
*   图像描述符，有两种描述方式
    
    *   宽度描述符 w，描述图像的固有宽度，以像素为单位。比如 480w 表示当浏览器需要 480 像素宽的图像时应该使用的图像资源
    *   像素密度描述符 x，描述了显示器的像素密度和图片资源之间的对应关系，通过`window.devicePixelRatio`可查询显示器像素密度

sizes 则定义了一组媒体条件，比如：屏幕宽度。并且指明当媒体条件为真时最佳的图片尺寸。每个条件由以下三部分组成：

*   一个媒体条件，比如`max-width:480px`，表示可视窗口的宽度不超过480像素时
*   空格
*   当媒体条件为真时，应该选用的图片大小

可以将 标签和 srcset 属性相结合，实现格式和分辨率的自适应，如下：

```html
<picture>
<source
srcset="image1.webp 200w,
image2.webp 600w"
sizes="100vw"
type="image/webp"
/>

<img
srcset="image1.jpg 200w,
image2.jpg 600w"
sizes="100vw"
decoding="async"
loading="lazy"
/>
</picture>
```

然而在实际中又会面临一些问题，如：

*   指定多个 srcset 会增加 HTML 文件大小，尤其是当 中存在多个 的场景；
*   媒体查询条件只能是屏幕宽度和像素密度，不能准确反映真实的图片渲染情况；
*   srcset 配合 sizes 使用，理解成本相对较高；
*   ...

在实际应用中，某些情况下可以提前知道图片渲染大小或者图片所在区域的大小，结合方案内置的几种布局方式以及设备像素密度等信息，加载 SDK 内部可以分析并选择出当前模块渲染的最佳分辨率。

### 图片稳定性布局

Web 侧通常基于 CLS（[Cumulative Layout Shift](https://link.juejin.cn?target=https%3A%2F%2Fweb.dev%2Fi18n%2Fen%2Fcls%2F "https://web.dev/i18n/en/cls/")，累积布局偏移）指标用于衡量页面布局的视觉稳定性。当可见元素的位置在页面生命周期内发生了变化时，就会产生布局偏移。

导致布局偏移的因素有很多（如：动态插入元素、iframe加载），无尺寸的图片是影响 CLS 指标的重要因素之一。例如下面两个页面中，右侧指定了图片宽高的页面要比左侧没有指定图片宽高的页面稳定性更好。

![](/images/jueJin/17304343b444420.png)![](/images/jueJin/e25c6cb1a2d94ed.png)

受 next/image 的启发，加载 SDK 内置了四种稳定性布局方式：intrinsic、responsive、fixed、fill，通过生成稳定的 dom 结构来提升视觉稳定性，减少业务开发量。效果如下：

![](/images/jueJin/ae37e52f4b37406.png)![](/images/jueJin/283cb6744cef45f.png)

![](/images/jueJin/e18cdd4f341a476.png)![](/images/jueJin/05d49727e39a460.png)

*   intrinsic: 若指定宽度小于容器宽度，则根据指定宽高渲染图片；反之则图片宽度为容器宽，图片高度按照比例缩小；
*   responsive: 图片渲染宽度等于容器宽度，高度按比例缩放；
*   fixed: 根据指定宽高渲染图片；
*   fill: 图片缩放以填充容器，可传入 [objectFit](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FCSS%2Fobject-fit "https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit")、[objectPosition](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FCSS%2Fobject-position "https://developer.mozilla.org/en-US/docs/Web/CSS/object-position") 属性表示不同的填充模式；

### 图片懒加载

对于图片懒加载最简单的做法是基于 ![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58) 的原生属性 loading="lazy"，但在实际的应用中也发现了两个问题：

*   该属性的兼容性不达标，多数浏览器不支持；
*   在部分 Safari 浏览器上存在 bug，可能会导致图片加载被阻塞；

因此，SDK 内部基于 IntersectionObserver API 实现，该 API 相对更可控，且可以设置懒加载的距离、目标元素等属性。

数据监控
----

![数据监控.png](/images/jueJin/72ea60207356417.png)

数据监控的整体链路为：

1.  监听全局的 Load 和 Error 事件，并筛选出属于图片的部分；
    
2.  基于 PerformanceObserver 监听图片资源加载，该事件回调中可拿到图片加载耗时相关的指标，如 DNS、TCP、SSL、请求、下载各个阶段的耗时，并且可以基于该 API 监听 CSS 中图片资源的加载；
    
3.  对于图片格式、状态码、画质打分等信息则依赖 Response Header，而拿到 Response Header 仅有 request 资源这一种方式，因此在资源加载后再去 request 本地缓存中的信息，同时为避免并发请求影响其他类型的 HTTP 请求，SDK 会根据采样率、当前请求量等信息在空闲时读取需要上报的图片的缓存；
    
4.  整合所有原始数据，根据采样率上报至 veImageX 数据服务，由数据服务对原始数据做清洗；
    
5.  经过后端服务处理后最终即可在 veImageX 质量监控大盘查看，具体支持的指标及维度如下图所示：
    
    1.  下行网络监控
    2.  ![](/images/jueJin/984830c4eee043c.png)
    3.  客户状态监控
    4.  ![](/images/jueJin/11b52cbed3254d5.png)

方案演进
====

方案致力于为 Web 场景提供极致的图片加载体验，同时在稳定性和场景覆盖上也在不断提升。

更低的错误率
------

上面提到在某些浏览器下会存在部分 WebP、AVIF 图片加载失败的场景，在监控到此类场景后加载 SDK 基于格式探测的方式最低成本的解决了此类问题，同时保证了性能。

例如：在 iOS 14.3 & 14.4 版本下的 Safari 浏览器加载部分的 WebP 失败，而 标签并不会对 WebP 的支持性做检测，其对于传入的 WebP 格式是全盘接收的，且 SDK 也无法对所有传入的图片做检测，因此只能通过构造特定图片，在业务图片加载前对其进行检测从而规避该问题，如下：

```JavaScript
    const checkWebP = () => {
        const pro: Promise<boolean> = new Promise<boolean>((resolve) => {
        if(typeof window === 'undefined') resolve(false);
            if (window['__support_webp__'] !== undefined) {
            resolve(!!window['__support_webp__']);
                } else {
                const img = new Image();
                    img.onload = () => {
                    window['__support_webp__'] = true;
                    resolve(true);
                    };
                        img.onerror = () => {
                        window['__support_webp__'] = false;
                        resolve(false);
                        };
                        img.src = 'error image';
                    }
                    });
                    return pro;
                    };
```

更多的场景覆盖
-------

目前方案支持了 React、Vue2、Vue3 以及小程序，为了保证体验的一致性、降低维护成本，加载 SDK 做了分层的设计，将核心的 Core 层抽离出来给到各个框架使用，并对各项能力做了插件化。

![场景覆盖.png](/images/jueJin/3719db885aa54d8.png)

小结
==

随着方案的迭代，我们也在尝试覆盖更多的业务场景，比如：加密图渲染、Hybrid HEIC 渲染等，火山引擎veImageX 希望给客户带来全面、稳定、流畅的图片体验，同时给业务带来极致的成本收益。

我们将如上能力封装成简单的webSDK，向行业输出，并可以免费获取和使用此SDK，更高级的能力也可以配合veImageX来使用；

webSDK接入地址：[www.volcengine.com/docs/508/17…](https://link.juejin.cn?target=https%3A%2F%2Fwww.volcengine.com%2Fdocs%2F508%2F177943 "https://www.volcengine.com/docs/508/177943")