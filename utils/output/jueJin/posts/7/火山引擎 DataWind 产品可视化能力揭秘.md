---
author: "字节跳动技术团队"
title: "火山引擎 DataWind 产品可视化能力揭秘"
date: 2023-09-12
description: "DataWind 是一款支持千亿级别数据自助分析的一站式数据分析与协作平台。本文聚焦DataWind 产品的核心可视化能力，并为您揭秘其实现原理。"
tags: ["数据分析中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读19分钟"
weight: 1
selfDefined:"likes:35,comments:0,collects:32,views:15001,"
---
引言
==

BI是商业智能(Business Intelligence)的缩写，是一种将企业中现有的数据进行有效的整合的平台，它可以帮助企业、组织和个人更好地了解其业务状况、发现问题，并进行决策。BI产品普遍采用可视化的方式，可以帮助用户更直观、更高效、更智能地分析和呈现数据，从而提升数据驱动的决策能力，快速准确地提供报表并提供决策依据。

DataWind 是一款支持千亿级别数据自助分析的一站式数据分析与协作平台。可打通从数据接入、数据整合、查询分析到全员协同共享的全流程，以数据门户、数字大屏、管理驾驶舱等可视化形态，助力业务用户实现智能洞察，让数据发挥价值。

本文聚焦 DataWind 产品的核心可视化能力，并为您揭秘其实现原理。

![](/images/jueJin/55c417f14d944e0.png)

丰富的可视化展现形式
==========

图表是 BI 产品中最常用的数据可视化工具之一。通过图表，用户可以更直观地了解数据的趋势、关系和分布。常见的图表类型包括折线图、柱状图、饼图、散点图等等。不同的图表类型适用于不同的数据类型和分析目的。例如，折线图可以展示时间序列数据的趋势，柱状图可以比较不同类别的数据，饼图可以显示数据的占比等等，选择适合的图表类型对于用户理解数据非常重要。

可视化展现形式
-------

### 1\. 统计图表

在DataWind产品中，为用户提供了丰富的图表类型供用户使用，其中包括柱状图、条形图、折线图、面积图、双轴图、饼图、环形图、玫瑰图、散点图、填充地图、散点地图、词云图、直方图、雷达图、漏斗图、指标卡、仪表图、进度图、瀑布图等，以及关系图表类型桑基图。

![](/images/jueJin/d993c30a2d7a4cb.png)

DataWind比较具有特色的是**组合图表**与**透视图表**。

组合图表可以将多个笛卡尔坐标系下的图表并列展示，方便用户对相同维度下的不同指标进行对比观察，组合图不但提供基础图表的组合，还提供了与双轴图得组合。

而透视图表是用来观察一个整体的数据在多个维度下的切分的结果，反映在图表上就是具有树状结构的图表展示。用户可以通过引入细分的维度，观察数据在不同分面中的特征和趋势，从而从更细粒度上了解数据中包含的信息。

![](/images/jueJin/b241ce1f023d478.png)

（组合图表及透视图表）

### 2\. 表格

在DataWind中，除了基础了二维表格渲染以外，还为用户在单元格内提供条件格式的功能，包括渲染图标集、色阶、数据图等场景，以及将单元格渲染为图片、视频、链接、迷你图表等需求。并且支持在表头上进行排序、固定列、字段配置等功能菜单。

![](/images/jueJin/26977556abea44d.png)

DataWind支持了**透视表格**的制作，透视表将数据按照列维度、行维度进行汇总计算和展现。通过简单地配置列维度、行维度和指标，即可展示出透视表。与表格相比，透视表将维度区分成了行与列，在多维度情况下更利于表格呈现。并且同时支持了条件格式、内容渲染等二维表支持的特色功能。

![](/images/jueJin/bc6626335540447.png)

此外DataWind还为用户提供了**趋势分析表**的功能，趋势分析表可以支持查看核心指标按不同日期粒度聚合的数据，并可以对单个指标进一步的作对比、看趋势、求均值。

![](/images/jueJin/e99a08abae99407.png)

### 3\. Gis地图

DataWind提供了**Gis** **地图**来支持LBS需求，其中包括热力地图、散点地图、飞线地图、柱状地图等。

![](/images/jueJin/05fb2e956433495.png)

实现揭秘
----

DataWind中丰富的可视化展现形式得益于开源可视化解决方案 VisActor，DataWind 重度使用了图表组件VChart 和 多维表格组件库 VTable。

同时DataWind 研发团队与 VisActor 团队深度合作，参与开源建设，使得一些个性化需求可以得到快速满足。

[VChart](https://link.juejin.cn?target=https%3A%2F%2Fwww.visactor.io%2Fvchart "https://www.visactor.io/vchart") 几乎覆盖了所有常见的统计图表类型，并且提供了丰富的扩展接口。这使得 DataWind 在根据用户反馈扩充图表类型，增强图表能力变得非常容易。

![](/images/jueJin/26197d8fb93c4a6.png)

（VChart Gallery：[www.visactor.io/vchart/exam…](https://link.juejin.cn?target=https%3A%2F%2Fwww.visactor.io%2Fvchart%2Fexample%25EF%25BC%2589 "https://www.visactor.io/vchart/example%EF%BC%89")

表格方面，VTable组件则完全承载了业务的需求，通过Canvas对表格进行高性能渲染。实现二维表、透视表、透视图的能力以外，还支持了自定义单元格渲染，单元格渲染迷你图，树形展示、透视分析等高阶功能。

![](/images/jueJin/3b600999da694b1.png)

（在线体验：[www.visactor.io/vtable/exam…](https://link.juejin.cn?target=https%3A%2F%2Fwww.visactor.io%2Fvtable%2Fexample%25EF%25BC%2589 "https://www.visactor.io/vtable/example%EF%BC%89")

而组合图表与透视图表的实现，则是结合了VChart与VTable各自的优势特性合并而来，得益于VisActor统一的底层渲染实现，可以容易的使用VTable的布局能力，嵌套VChart的图表渲染能力实现组合图表与透视图表。

通过在VTable上注册VChart图表组件，利用VTable的透视表布局能力，将VChart图表组件渲染到单元格内，VTable则负责维护图表实例以及事件更新。

![](/images/jueJin/9845012e73674dd.png)

例如上面展示的透视图表完整实现：[codesandbox.io/s/pivotchar…](https://link.juejin.cn?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Fpivotchart-with-vtable-p8d6f6 "https://codesandbox.io/s/pivotchart-with-vtable-p8d6f6")

代码结构如下：

![](/images/jueJin/8ae52c8713fa4f1.png)

从代码中我们可以看到通过行列的定义和数据配置，可以表达数据的透视结构，同时在统计图表中使用的轴、图例、标注等组件可以完美的融合在表格中，极大增强了表格的可视化扩展能力。

由于BI 系统的复杂性，以及需要通用图表和表格能力之外的定制化可视化能力，DataWind 在VisActor的扩展机制基础上，做了一层面向BI系统的可视化封装。架构设计如下：

![](/images/jueJin/51bc581699d94bc.png)

通过以上封装，可以快速实现BI系统或类BI的指标报表平台。

适配不同场景的风格以及主题自定义
================

在DataWind产品中，面对不同的业务对象，往往采用的图表设计也不尽相同。一个好的图表应该具有清晰的结构、易于阅读的标签和轴线、合适的颜色和字体等等，并且要适配当前业务的特点。

DataWind 中图表样式，主题配置
-------------------

DataWind 支持在多个层面上灵活配置图表风格。

在图表层面，支持一键替换图表的数据色板：

![](/images/jueJin/dc7534362995447.png)

在仪表盘层面，则支持为仪表盘整体设置统一的主题样式。

![](/images/jueJin/40d18feca694464.png)

DataWind的图表主题设计遵循以下原则：

*   图表的结构和布局：图表的结构应该清晰明了，不应该有过多的元素和噪音。例如，柱状图的柱子应该有一定的间隔，以便用户更容易区分不同的数据。
    
*   标签和轴线的设计：标签和轴线应该易于阅读和理解。标签应该清晰明了，轴线应该有适当的刻度和标签。例如，时间轴应该有适当的时间间隔和标签，以便用户更好地理解数据的时间趋势。
    
*   颜色和字体的选择：颜色和字体应该适合图表的风格和主题。颜色应该有适当的对比度和饱和度，字体应该易于阅读和理解。例如，某些图表可能需要使用不同的颜色来区分不同的数据，而某些图表可能需要使用相似的颜色来强调数据的关系。
    

实现揭秘
----

VisActor提供丰富的图表样式配置。不仅限于配色主题的自定义，更有文字自适应、布局排版、动画配置等高定制内容，以适应DataWind产品中复杂的可视化需求。

下面以 VChart 的主题色板功能为例进行介绍。在对数据进行可视化的过程中，颜色是极为关键的元素。如何为图表选择合适的色彩，以突显数据的特征并搭配得体，是数据可视化中的一门艺术。VChart 为用户提供了强大且灵活的色板功能，能满足各种应用场景下的色彩需求。

VChart 支持的色板分为两大类：

*   数据色板：根据数据类别的不同，为数据项分别赋予颜色。数据色板是一个包含了若干颜色的序列。
*   语义色板：支持将常用色值语义化并在图表中随处使用，以统一色彩风格。也就是为颜色赋予有意义的名称，从而方便维护和修改。

其中，数据色板允许同时存在多套色板方案，具体应用哪个色板需要靠具体的条件（如数据类别的个数）来判断。因此 VChart 可以很轻松地实现灵活的设计需求：

![](/images/jueJin/e8b50c2cab09461.png)

VChart 中注册和应用主题的代码简单直接：

```less
    const theme = {
    name: "dark",
    background: "#202020",
        colorScheme: {
            default: {
                palette: {
                titleFontColor: "#e2e3e6",
                labelFontColor: "#888c93",
                labelReverseFontColor: "#202020",
                axisGridColor: "#404349",
                axisDomainColor: "#55595f",
                backgroundColor: "#202020"
            }
        }
    }
    };
    
    // 注册主题
    VChart.ThemeManager.registerTheme("dark_tmp", theme);
    
    const vchart = new VChart(spec, { dom: "container" });
    vchart.renderAsync();
    
    // 主题热更新
    vchart.setCurrentTheme("dark_tmp");
```

（VChart 主题完整示例地址：[codesandbox.io/s/dark-them…](https://link.juejin.cn?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Fdark-theme-whm775%25EF%25BC%2589 "https://codesandbox.io/s/dark-theme-whm775%EF%BC%89")

简单易用的交互形式
=========

DataWind 交互形式
-------------

除了设计好的图表外，图表的交互性也非常重要。通过图表的交互功能，用户可以更深入地了解数据，进行更复杂的分析和探索。

### 提示信息

当用户将鼠标悬停在图表上时，可以显示数据的详细信息和标签。即触发图表提示信息（Tooltip）。DataWind支持用户对Tooltip进行富文本渲染，甚至支持了tooltip内渲染图表的能力。

![](/images/jueJin/1ff4198d1dc6440.png)

### 缩放和平移

用户可以通过缩放和平移图表来查看更详细的数据。

![](/images/jueJin/df7585b3791e46a.png)

### 选择和过滤

用户可以选择特定的数据点或区域，并对数据进行过滤和筛选。

![](/images/jueJin/078954d135c44b0.png)

### 上卷下钻

VisActor中的大量组件都允许业务进行交互行为的定义，例如图元的点击、框选、悬停；数轴的缩放、选中；提示信息的展示、自定义；图例的选中、取消等。

通过VisActor提供的图表事件，DataWind实现了图表的探索式分析。例如上卷下钻、图表标注、参考预警等功能。

![](/images/jueJin/71d1fdc86890482.png)

实现揭秘
----

DataWind中交互功能大部分基于 VisActor 提供的各种自定义扩展能力，下面举例说明。

VisActor 内置支持的Tooltip功能有一定的自定义能力，同时还支持完全自定义渲染tooltip。DataWind便是利用了该能力进行tooltip高级定制。

通过VisActor提供的详细全面的交互事件，DataWind得以基于这些事件开发对应的数据探索式分析流程。

```php
// 注册事件
chart.on(event: string, callback: (params: EventParams) => void): void;
chart.on(event: string, query: EventQuery, callback: (params: EventParams) => void): void;
// 卸载事件
chart.off(event: string, callback: (params: EventParams) => void): void;
```

如以上接口所示：通过query参数锁定发生交互的组件，通过event明确交互事件的类型。根据以上接口即可获得用户在图表上进行的具体交互行为。详细设置参考VisActor事件介绍：[visactor.io/vchart/api/…](https://link.juejin.cn?target=https%3A%2F%2Fvisactor.io%2Fvchart%2Fapi%2FAPI%2Fevent%25E3%2580%2582 "https://visactor.io/vchart/api/API/event%E3%80%82")

![](/images/jueJin/a47ab8cde67540c.png)

以下演示了托管鼠标 hover 事件绘制自定义 tooltip 的能力，通过向图表内注册Tooltip触发的事件，即可接收到Tooltip绘制或更新的消息，并且可以通过解析该消息获得图表hover的具体信息。

示例代码如下：

```ini
    vchart.setTooltipHandler({
        showTooltip: (activeType, tooltipData, params) => {
        const tooltip = document.getElementById('tooltip');
        tooltip.style.left = params.event.x + 'px';
        tooltip.style.top = params.event.y + 'px';
        let data = [];
            if (activeType === 'dimension') {
            data = tooltipData[0]?.data[0]?.datum ?? [];
                } else if (activeType === 'mark') {
                data = tooltipData[0]?.datum ?? [];
            }
            tooltipChart.updateData(
            'tooltipData',
            data.map(({ type, value, month }) => ({ type, value, month }))
            );
            tooltip.style.visibility = 'visible';
            },
                hideTooltip: () => {
                const tooltip = document.getElementById('tooltip');
                tooltip.style.visibility = 'hidden';
                },
                    release: () => {
                    tooltipChart.release();
                    const tooltip = document.getElementById('tooltip');
                    tooltip.remove();
                }
                });
```

效果如下：

![](/images/jueJin/72196c84e454481.png)

（完整示例：[visactor.io/vchart/demo…](https://link.juejin.cn?target=https%3A%2F%2Fvisactor.io%2Fvchart%2Fdemo%2Ftooltip%2Fcustom-tooltip-handler%25EF%25BC%2589 "https://visactor.io/vchart/demo/tooltip/custom-tooltip-handler%EF%BC%89")

在BI中需要将用户对行为解析为具体的业务行为，例如点击图元发生的具体行为可能包括：图表联动、上卷下钻、维度下钻、图表标注、跳转等许多功能，通过提取事件内部的具体参数以及制定多个事件间的优先级，即可设定事件的触发规则。

此外有些业务行为是多个行为的叠加组合而来，例如：图表下钻行为，需要在交互事件触发时同时进行图表维度的更换和范围的筛选两步行为即可实现。

因此，复杂的业务行为可以通过多个基础事件的组合与叠加实现，这样不但可以使交互逻辑清晰，也可以降低持续的维护成本。

灵活、生动的叙事效果
==========

DataWind叙事
----------

DataWind 可以借助仪表盘进行灵活的可视化叙事。在单个图表中，DataWind 的叙事重点主要是数据标注。通过数据标注，可以大大降低用户阅读图表、报告或者仪表盘的成本，快速获取洞察含义。

![](/images/jueJin/90b8f967a7fb4fd.png)

实现揭秘
----

VisActor 的强大叙事能力为其提供了支撑。例如在图表中添加自定义数据标注：

![](/images/jueJin/bf5b00edacb543f.png)

核心代码如下：

```yaml
    const spec = {
    type: 'line',
        markPoint: [
            {
                coordinate: {
                year: '1878',
                population: 100
                },
                itemContent: {//文字标注
                offsetY: -100,
                type: 'richText',
                autoRotate: false,
                    richText: {
                    （...富文本配置略）
                }
                },
                itemLine: {// 线标注
                ...
                },
                    {
                    (...)
                }
                ],
                ...
                };
                const vchart = new VChart(spec, { dom: CONTAINER_ID });
                vchart.renderAsync();
```

（完整示例代码可见：[www.visactor.io/vchart/demo…](https://link.juejin.cn?target=https%3A%2F%2Fwww.visactor.io%2Fvchart%2Fdemo%2Fmarker%2Fmark-point-basic%25EF%25BC%2589 "https://www.visactor.io/vchart/demo/marker/mark-point-basic%EF%BC%89")

VisActor也可以通过动态图表和动画等功能进行独立叙事。例如用带有自动播放进度条的图表表示数据随时间迁移：

![](/images/jueJin/e34e62c1ea5c4c7.png)

（完整示例：[www.visactor.io/vchart/demo…](https://link.juejin.cn?target=https%3A%2F%2Fwww.visactor.io%2Fvchart%2Fdemo%2Fstorytelling%2Ftimeline-scatter "https://www.visactor.io/vchart/demo/storytelling/timeline-scatter"))

以及和 VRender 结合，呈现更复杂的图表叙事效果：

![](/images/jueJin/eac998f34cb14bf.png)

（完整示例：[www.visactor.io](https://link.juejin.cn?target=https%3A%2F%2Fwww.visactor.io "https://www.visactor.io"))

懂数据更懂用户的智能推荐
============

DataWind 图表推荐
-------------

智能化是BI产品的发展趋势。当图表中的字段确定后，选择合适的图表类型对数据进行展示，对于快速获取数据中的洞察信息具有十分重要的意义。DataWind中的图表推荐包括图表类型的推荐和图表字段的推荐。前者能够根据当前选择的维度和指标字段，推荐最适合进行数据展示的图表类型；后者能够在用户切换图表类型时，自动将数据字段分配到合适的视觉通道上，极大地增强用户进行探索式分析的能力，轻松制作可视化报表。

![](/images/jueJin/c52f08b372314c9.png)

（DataWind图表推荐演示）

实现揭秘
----

@VisActor/VChart提供从数据到展现的全流程解决方案，以“可视化叙事”及“智能化”为核心竞争力。大语言模型强大的生成能力为VChart提供了一个自然语言的交互接口，允许用户通过自然语言直接调用VChart的各项能力，简单、快速、高质量地完成图表生成与编辑。

@VisActor/VMind是基于VChart和大语言模型的图表智能模块，提供图表智能推荐、智能配色、对话式图表编辑等能力，能够极大地降低VChart的使用门槛，提高用户创作数据可视化作品的效率。

![](/images/jueJin/4a5940f7da9246b.png)

VMind中的图表智能推荐功能能够基于数据特性和用户意图，完成字段筛选、图表类型推荐、视觉通道映射、图表配色，从无到有生成数据图表。

![](/images/jueJin/110db67253fc4d4.png)

调用VMind 组件代码示例如下：

```javascript
import VMind from '@visactor/VMind'

const vmind = new VMind(openAIKey) //传入openAI key
const data=`品牌名称,市场份额,平均价格,净利润
Apple,0.5,7068,314531
Samsung,0.2,6059,362345
Vivo,0.05,3406,234512
Nokia,0.01,1064,-1345
Xiaomi,0.1,4087,131345
`
const describe="展示各品牌市场占有率，森林风格"
//传入csv格式的数据和图表描述，返回图表spec和图表动画时长
const { spec, time } = await vmind.generateChart(data, describe);
//调用VChart进行渲染
const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();
```

追求极致性能
======

VisActor性能体验
------------

得益于可视化渲染引擎 VRender 的优越性能以及多种优化策略， VChart 与 VTable 提供了卓越的渲染性能以及流畅的交互体验。

VChart 提供了 LTTB 的降采样方案，通过较少数据量的数据点保持了原始数据的视觉特性，从而降低渲染的计算负担。

除此之外，VChart 还支持渐进式渲染以避免大量图形的绘制导致的页面卡顿。通过渲染任务拆分，VChart 将创建好的图形元素放置在多个帧内执行渲染，从而避免过长的同步计算任务阻塞住页面逻辑，使得图表呈现流畅自如。VChart 支持在任意图表中开启渐进式渲染配置，以下图为例：

![](/images/jueJin/7641626b97fe4c0.png)

该示例核心代码如下：

```yaml
    const spec = {
    type: 'common',
        data: [
        ...
        ],
            series: [
                {
                    data: {
                    id: 'data0'
                    },
                    type: 'bar',
                    xField: 'time',
                    yField: 'value',
                    /** 是否开启大数据渲染模式，开启后会降低渲染的精度 */
                    large: false,
                    /** 开启大数据渲染优化的阀值，对应的是data的长度;推荐 largeThreshold < progressiveThreshold  */
                    largeThreshold: 500,
                    /** 分片长度 */
                    progressiveStep: 100,
                    /** 开启分片渲染的阀值，对应的是单系列data的长度 */
                    progressiveThreshold: 1000,
                    },
                    ...
                    ],
                    };
```

（完整代码：[visactor.bytedance.net/vchart/guid…](https://link.juejin.cn?target=https%3A%2F%2Fvisactor.bytedance.net%2Fvchart%2Fguide%2Ftutorial_docs%2FProgressive_Render%25EF%25BC%2589 "https://visactor.bytedance.net/vchart/guide/tutorial_docs/Progressive_Render%EF%BC%89")

VTable 支持大数据量的秒级渲染，能够快速展示庞大的数据内容。即使面对百万级数据，VTable 也能提供高效的渲染以及自由的交互体验：

![](/images/jueJin/2ced146cbe6045f.png)

（体验地址：[visactor.io/vtable/demo…](https://link.juejin.cn?target=https%3A%2F%2Fvisactor.io%2Fvtable%2Fdemo%2Fperformance%2F100W%25EF%25BC%2589 "https://visactor.io/vtable/demo/performance/100W%EF%BC%89")

DataWind 性能优化方案
---------------

除了VisActor本身的高性能渲染以外，VisActor还提供了Web Worker和图表调度技术来提升图表的并行渲染能力，以防止阻塞导致页面掉帧、卡顿。

VisActor为了充分利用CPU多核性能，支持使用Web Worker进行图表并行渲染，通过Web Worker不但可以充分利用客户端性能，也可以从根源上避免页面阻塞。DataWind 在此基础上封装了Worker Pool组件，模拟线程池概念，实现Worker的调度和复用。

此外，DataWind 还开发了图表调度器，用于图表渲染的异步调度工作，当页面在短时间内同时进入大量的渲染任务时，图表调度器将会按照图表优先级以及内部策略，依次有序的进行渲染工作的调度与分配，并且会将重复的多次无效渲染任务取消或合并，降低渲染的性能开销。

友好、丝滑的跨端体验
==========

随着移动设备的普及，越来越多的用户需要在移动设备上使用BI产品。移动端环境下的BI产品需要考虑以下因素：

*   响应式设计：BI产品的界面应该具有响应式设计，以适应不同大小的移动设备屏幕。图表中的各个元素也需要进行自适应布局
*   移动端适配：BI产品中图表的渲染、事件等都需要针对移动端进行专门适配
*   移动端优化：BI产品的界面和功能应该针对移动设备进行优化。例如，图表中数据的展示形式、各组件的布局方式都需要针对移动端进行专门优化。

DataWind 移动端体验
--------------

DataWind中的图表和仪表盘均完美适配了移动端场景，随时随地查看数据报表，打破时间与空间的壁垒。

![](/images/jueJin/aa3fd57c4a8f440.png)

实现揭秘
----

得益于图形渲染库VRender提供的强大跨端渲染能力，VChart图表支持web、node、h5、小程序等多种场景。在跨端场景中，图表可能拥有不同的交互响应和特性，适配触摸屏等移动设备的交互方式和事件。

VChart提供了lark-vchart、taro-vchart封装，使得在不同的跨端场景中使用VChart变得更加方便和简单。

针对web场景，VChart提供了React-VChart封装，它提供了一系列易于使用的 React 组件，用于方便的在 React 开发环境中创建各种类型的图表。 组件具有高度的可定制性和可扩展性，可以通过传递不同的参数和配置来实现不同的图表效果，快速创建各种类型的图表。

无论是在web端、移动端还是其它场景中，VChart图表库都能够提供高质量的图表渲染和交互效果，满足用户对数据可视化的需求。

以飞书小程序（小组件）为例，用户可以通过VChart 提供的小组件开发模版，快速将图表嵌入小组件中：

![](/images/jueJin/00488bbca6644f7.png)

以下是小程序中的代码示例:

```php
    Page({
        data: {
        canvasId: 'chartId', // canvasId 图表唯一Id
        events: [], // events 自定义事件
        styles: `
        height: 50vh;
        width: 100%
        `, // 样式字符
        // 图表配置项
            spec: {
            type: 'pie',
                data: [
                    {
                    id: 'data1',
                        values: [
                    ...]
                }
                ],
            }
            },
        onLoad: function (options) {}
        });
```

（完整教程:[www.visactor.io/vchart/guid…](https://link.juejin.cn?target=https%3A%2F%2Fwww.visactor.io%2Fvchart%2Fguide%2Ftutorial_docs%2FCross-terminal_and_Developer_Ecology%2Fmini-app%2Flark%25EF%25BC%2589 "https://www.visactor.io/vchart/guide/tutorial_docs/Cross-terminal_and_Developer_Ecology/mini-app/lark%EF%BC%89")

总结
==

未来，随着技术的发展和用户需求的不断增长，BI 产品对可视化的需求在交互、易用性、智能化、叙事特征等方面都会不断发生变化，要求会越来越高。

VisActor作为一款免费开源可视化解决方案，经过火山引擎海量真实用户场景的验证和打磨。在功能性、美观性、性能、跨端支持度上都做到了非常好的效果，能够很好的助力业务实现可视化能力的增强和落地。

DataWind 拥抱开源，与VisActor 紧密合作，互相配合，为开源产品在商业场景中的落地做了很好的示范。

欢迎交流
====

我们愿意和数据产品相关产品经理、设计师、研发同学一起做更加深入的探讨和交流：

1.  如果你对某一个方面细节的的解决方案感兴趣，需要进一步交流可以联系我们。
2.  如果你愿意分享你的产品、场景和经验，可以联系我们。
3.  如果你在可视化应用过程中有难解的问题，可以联系我们一起讨论、研究。

联系方式：

1）VisActor 微信订阅号留言（可以通过订阅号菜单加入微信群）：

![](/images/jueJin/6a8661e9f704417.png)

2）VisActor Discord 社群：[discord.gg/3wPyxVyH6m](https://link.juejin.cn?target=https%3A%2F%2Fdiscord.gg%2F3wPyxVyH6m "https://discord.gg/3wPyxVyH6m")

3）VisActor 官网及github：[www.visactor.io/](https://link.juejin.cn?target=https%3A%2F%2Fwww.visactor.io%2F "https://www.visactor.io/") [github.com/visactor](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvisactor "https://github.com/visactor")