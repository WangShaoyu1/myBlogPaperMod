---
author: "徐小夕"
title: "Dooring无代码搭建平台技术演进之路"
date: 2022-06-29
description: "大家好, 我是徐小夕, 之前一直在分享可视化低代码的一些实践, 围绕 H5-Dooring 零代码搭建平台也输出了很多技术文章, 最近2.7.0 版本也顺利迭代完成, 这里详细分享一下"
tags: ["数据可视化","架构","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读22分钟"
weight: 1
selfDefined:"likes:59,comments:0,collects:85,views:4363,"
---
大家好, 我是徐小夕, 之前一直在分享`可视化低代码`的一些实践, 围绕 `H5-Dooring` 零代码搭建平台也输出了很多技术文章, 最近`2.7.0` 版本也顺利迭代完成, 这里详细分享一下 `H5-Dooring` 无代码搭建平台技术方案.

*   [H5-Dooring 开源版本](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://github.com/MrXujiang/h5-Dooring")
*   [可视化低代码技术集合](https://link.juejin.cn?target=http%3A%2F%2Fwww.lowcoder.cn "http://www.lowcoder.cn")
*   [H5-Dooring在线体验](https://link.juejin.cn?target=http%3A%2F%2Fh5.dooring.cn%2Fh5_plus "http://h5.dooring.cn/h5_plus")

Dooring无代码产品技术演进
----------------

![](/images/jueJin/e9fbf02253284f7.png)

两年前我设计了`H5-Dooring`的第一个开源版本, 之后陆陆续续迭代了两年, github star已达到6.5k+, 也找到了很多志同道合的小伙伴, 一起研发`Dooring`系的搭建产品, 如:

*   [h5-dooring | 可视化搭建解决方案](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://github.com/MrXujiang/h5-Dooring")
*   [mitu-editor | 开源图片编辑器](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FH5-Dooring%2Fmitu-editor "https://github.com/H5-Dooring/mitu-editor")
*   [v6.dooring | 可视化大屏搭建平台](https://link.juejin.cn?target=http%3A%2F%2Fv6.dooring.cn "http://v6.dooring.cn")
*   [dooringx | 可视化搭建框架](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FH5-Dooring%2Fdooringx "https://github.com/H5-Dooring/dooringx")

![image.png](/images/jueJin/f5a85f5e0b3442b.png)

从技术设计和产品规划上, 这几年也总结摸索出了一些经验和实践, 接下来我就和大家一起分享一下`H5-Dooring` 的技术架构设计与演进.

![image.png](/images/jueJin/4c9fbfcd4d424b3.png)

### 底层搭建协议标准化

我们都知道任何`低代码`或者`零代码`搭建产品都非常注重底层`搭建协议`, 这些产品通常会设计一套向上兼容且可扩展的`DSL`结构, 来实现页面`元件`的标准化配置, 并支持元件的向上扩展.

![image.png](/images/jueJin/1656dd20d9cf4c9.png)

上面这张图是我在设计 `V6.Dooring` 可视化大屏搭建平台的编辑器架构图, 这里的底层搭建协议可以认为是 `搭建基础`, 也就是我们常说的 “经济基础决定上层建筑”.

在设计`H5-Dooring` 搭建平台前, 我也参考了很多标准化软件数据协议, 给我启发最大的就是 `ODATA`, 它是`微软`于2007年发起的开放协议, 主要由以下几部分组成:

*   **核心协议**: 主要定义了开放数据协议的核心语义和行为

![image.png](/images/jueJin/f6bc64d95a40447.png)

*   **URL规范**: 主要定义了一系列推荐（非强制）采用的构建用于访问`OData`服务中的数据和模型的URL的规则

![image.png](/images/jueJin/0105edad482242a.png)

*   **通用格式定义语言（CSDL）**: 它定义了`OData`服务的**EDM**模型的一种XML格式的表现形式

![image.png](/images/jueJin/3c97f7423415460.png)

*   **扩展的巴科斯范式（ABNF）**: 定义了构建`OData`请求和响应`URL`的**巴科斯范式**

![image.png](/images/jueJin/1a04d98a8abf4e2.png)

为了让可视化搭建平台的组件数据标准化且可扩展, 这里我分享一下`H5-Dooring`的`Schema`设计.

![image.png](/images/jueJin/ac03aa39a43b4a6.png)

Schema 分两部分:

*   editData 组件可编辑属性的数组
*   config 组件真正消费的数据

#### editData 详解

`editData` 是 组件属性可编辑项的数组, 每一项里面包含了如下字段:

*   key 属性名
*   name: 属性名的中文显示
*   type: 属性的可编辑类型
*   isCrop(可选)
*   cropRate(可选)
*   range(type 为'Radio'或'Select'时的选项数组)
*   后期可能会扩展(详细结构可参考[Dooring 开源版本](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://github.com/MrXujiang/h5-Dooring"))

`key`和`name` 都可以按照组件属性的语义来定, 这里值得一提的是 `type`. 不同属性的值类型不同, 所以我们编辑项的 `type` 也不同, 所有的类型如下:

*   Upload 上传组件
*   Text 文本框
*   RichText 富文本
*   TextArea 多行文本
*   Number 数字输入框
*   DataList 列表编辑器
*   FileList 文件列表编辑器
*   InteractionData 交互设置
*   Color 颜色面板
*   MutiText 多文本
*   Select 选择下拉框
*   Radio 单选框
*   Switch 开关切换
*   CardPicker 卡片面板
*   Table 表格编辑器
*   Pos 坐标编辑器
*   FormItems 表单设计器

更详细的介绍可以访问 [dooring 开发文档](https://link.juejin.cn?target=http%3A%2F%2Fh5.dooring.cn%2Fdoc "http://h5.dooring.cn/doc")

#### config 详解

`config` 本质上是一个对象, 也就是组件所能暴露出来的属性集合, 和 `editData` 数组每一项的`key` 一致, 如下:

```js
    {
    cpName: 'Header',
    logoText: '',
    fontSize: 20,
    color: 'rgba(47,84,235,1)',
    height: 60,
    fixTop: false,
        menuList: [
            {
            id: '1',
            title: '首页',
            link: '/'
            },
                {
                id: '2',
                title: '产品介绍',
                link: '/'
                },
            ]
        }
```

我们通过以上的设计规范, 就可以轻松制作一个可实时编辑的低代码组件:

![image.png](/images/jueJin/eabbf8ce332c46d.png)

可以在Dooring官方文档体验: [低代码组件案例](https://link.juejin.cn?target=http%3A%2F%2Fh5.dooring.cn%2Fdocz%2Fcomponents%2Fintro "http://h5.dooring.cn/docz/components/intro")

### 搭建模式多元化

最开始设计`H5-Dooring`的时候为了最大限度的降低用户的搭建成本, 我采用了智能网格布局的方式来搭建页面, 用户只需要在二维空间像搭积木一样选择适合的组件就可以快速的制作页面:

![2022-06-25 11.21.00.gif](/images/jueJin/21feee76aa8a452.png) 这样虽然可以降低用户的搭建难度, 并能满足一部分受众的搭建需求, 比如说简单的官网, 活动页面制作,下面是一个我搭建的比较有代表性的例子:

![2022-06-25 11.35.45.gif](/images/jueJin/5d3cfc4d8ba5488.png)

但是对于平台方, 为了满足更多场景的页面深度制作, 就必须提供不同场景不同行业的组件物料, 这将对研发带来巨大的压力(虽然也一直在添加新组件).

另一方面, 目前上很多H5活动制作平台基本上都采用的`自由布局`的模式搭建, 好处就是可以最大限度的还原设计稿, 满足更灵活的搭建需求, 缺点就是使用成本比`网格布局`的模式要高, 还会涉及`图层`的概念.

当然综合评估下来, 确实很有必要给一部分用户提供自由布局的模式, 所以在技术层我设计同时兼容`网格布局`和`自由布局`的搭建方案. 当用户在搭建时, 可以轻松选择自己适合的搭建模式:

![image.png](/images/jueJin/416a1c88198e43a.png)

同时为了满足`自由布局`下组件的层级管理, 我又设计了`图层管理面板`和图层操作, 来快速的管理页面元素, 当然`图层管理面板` 对`网格布局` 也同样有一定积极作用, 比如快捷的操作组件.

### 可扩展的插件系统

在前面提到了可视化搭建平台的`统一搭建协议`和`搭建模式`, 在这两个核心要素完成之后, 我们就很容易的去设计我们的插件系统.

![image.png](/images/jueJin/45b614b6c74e4a9.png)

从插件系统的本质来看, 核心价值是对页面操作的整个周期里为页面赋能, 而页面的本质是数据(也就是DSL集).

![image.png](/images/jueJin/0dc65d946371410.png)

所以只要有标准的数据规范, 我们自定义的插件就可以很轻松的来对页面进行赋能, 类似于各种技术里面的`中间件`. 下面是一个例子:

```json
    {
        "pageConfig": {
        "allowOverlap": "freedom",
        "isLogin": false,
        "bgColor": "rgba(16,20,29,1)",
        "bgSize": "100%",
        "title": "H5-Dooring官网"
        },
            "tpl": [
                {
                "id": "276059",
                    "item": {
                    "category": "base",
                        "config": {
                        "cpName": "XButton",
                        "id": "",
                        "bgColor": "rgba(22,40,212,1)",
                        "width": 190,
                        "marginTop": 0,
                        "round": 16,
                        "text": "按钮",
                        "fontSize": 15,
                        "color": "rgba(255,255,255,1)",
                        "animation": "none",
                        "animationTurn": 1,
                        "delay": 0,
                            "interaction": {
                            "type": "link",
                            "title": "",
                            "params": "",
                            "content": "",
                            "height": 300,
                            "width": 300,
                            "okText": "",
                            "cancelText": "",
                            "onOk": "",
                            "btnColor": "rgba(20,54,226,100)"
                        }
                        },
                        "h": 23,
                        "type": "XButton"
                        },
                            "point": {
                            "w": 24,
                            "h": 23,
                            "x": 0,
                            "y": 0,
                            "i": "276059",
                            "moved": false,
                            "static": false,
                            "isBounded": true
                            },
                            "status": "inToCanvas"
                            },
                                {
                                "id": "260487",
                                    "item": {
                                    "category": "base",
                                        "config": {
                                        "cpName": "LongText",
                                        "id": "",
                                        "text": "我是长文本有一段故事，dooring可视化编辑器无限可能，赶快来体验吧，骚年们，奥利给~",
                                        "color": "rgba(60,60,60,1)",
                                        "fontSize": 14,
                                        "indent": 0,
                                        "lineHeight": 1.8,
                                        "textAlign": "left",
                                        "bgColor": "rgba(255,255,255,0)",
                                        "padding": 0,
                                        "radius": 0
                                        },
                                        "h": 36,
                                        "type": "LongText"
                                        },
                                            "point": {
                                            "w": 24,
                                            "h": 36,
                                            "x": 0,
                                            "y": 23,
                                            "i": "260487",
                                            "moved": false,
                                            "static": false,
                                            "isBounded": true
                                            },
                                            "status": "inToCanvas"
                                        }
                                    ]
                                }
```

上面是`H5-Dooring`生成的一个页面`DSL`结构, 如果我们要对页面元素进行统计分析, 或者实现出码, 国际化, `PSD`解析转化等功能, 只需要对数据结构进行分析和处理即可.

![image.png](/images/jueJin/1be0ddf24fe44f7.png)

所以说在`H5-Dooring`平台实现自定义的插件还是非常容易的, 也是低代码或者无代码需要重点规划的一个环节.

### 可扩展的组件编辑器

`H5-Dooring`平台的组件编辑器主要是对组件属性进行编辑,比如:

*   基本样式
*   交互设置
*   动画设置

当然还有全局的`数据源配置`. 如下:

![image.png](/images/jueJin/048636f0e89b411.png)

同时由于我们的组件数据协议高度统一, 所以如果想扩展属性配置, 也非常容易, 我们只需要按照数据协议添加属性即可:

![image.png](/images/jueJin/0772f96a17634d0.png)

同理, **v6.dooring** 也采用相似的架构, 所以我们可以轻松扩展组件的属性:

![image.png](/images/jueJin/62e36ca6065e486.png)

有关可视化大屏搭建平台的技术实践可以参考我的另一篇文章 [从零设计可视化大屏搭建引擎](https://link.juejin.cn?target=http%3A%2F%2Fwww.lowcoder.cn%2Fbest-practice%2Fdetail%3Ffid%3DNCaDwLVTwJ "http://www.lowcoder.cn/best-practice/detail?fid=NCaDwLVTwJ")

### 多端搭建支持

![image.png](/images/jueJin/036a42a8dd284ed.png)

由于Dooring的技术栈采用`React`, 并实现了标准的数据协议层, 所以我们可以利用类似 `Taro` 等跨平台框架实现多端搭建, 对于我们常用的媒介如移动端, Pad和PC端, 目前编辑器也提供了快捷的切换模式:

![image.png](/images/jueJin/468418baf12a4de.png)

所以我们可以轻松的实现不同端的搭建, 实现原理本质上是通过切换画布大小, 并同比例更新元素的计量衡.

### 图层管理, 让设计更高效

图层管理模块也是在`Dooring`支持了`自由布局`之后才上线的功能. 因为我们页面中组件的数据结构中包含统一的物理信息:

*   层级
*   可见性
*   类别
*   大小颜色等外观
*   事件 / 交互 / 动画

![image.png](/images/jueJin/304f01ac02c6491.png)

所以我们只需要分析页面的组件集合, 就可以轻松的渲染出页面中的元素图层信息:

![image.png](/images/jueJin/6a4fb11b568f460.png)

有了图层的概念我们其实可以做很多有用的事情, 比如:

*   多选组件
*   编辑组件
*   删除组件
*   锁定组件

后面 `Dooring` 也会基于图层能力迭代更多提高用户搭建销效率的功能.

### 低代码组件 & 模版生态

在`Dooring` 的迭代中花了大部分精力在优化用户搭建体验和协议标准化上, 对于组件物料的丰富上, 我也做了一些设计, 最近也发布了一套低代码组件库的原型:

![image.png](/images/jueJin/45af581f7362441.png)

我们可以轻松的像写 `React` 组件一样来实现低代码组件, 并支持线上实时编辑, 一个基本的例子如下:

```tsx
import styles from './index.less';
import React, { memo, useState } from 'react';
import { MenuOutlined } from '@ant-design/icons';
import { IHeaderConfig } from './schema';

    const Header = memo((props: IHeaderConfig) => {
        const {
        cpName,
        bgColor,
        logo,
        logoText,
        fontSize,
        color,
        showMenuBtn,
        menuColor,
        height,
        } = props;
        const [showMenu, setShowMenu] = useState(false);
            const toggleMenu = () => {
            setShowMenu(!showMenu);
            };
            return (
            <header
        className={styles.header}
    style={{ backgroundColor: bgColor, height: height + 'px' }}
    >
    <div className={styles.logo}>
    <img src={logo && logo[0] && logo[0].url} alt={logoText} />
    </div>
    <div className={styles.title} style={{ fontSize, color }}>
{logoText}
</div>
{showMenuBtn && (
<>
<div
className={styles.menuIconWrap}
onClick={toggleMenu}
style={{ color: menuColor, borderColor: menuColor }}
>
<MenuOutlined />
</div>
</>
)}
</header>
);
});

export default Header;
```

通过这种标准化的方式, 我们可以给 `Dooring` 平台提供更为丰富的组件物料.

除了基础物料组件之外, 为了从更大粒度提高用户搭建的效率, 我提供了`模版`功能, 我们可以把`重复的区块`和`可复用的页面`保存为模版:

![image.png](/images/jueJin/d1a15fd074e1491.png)

我们可以在编辑器页面轻松将页面保存为模版, 并自动生成海报封面:

![image.png](/images/jueJin/6b29e46c63a1464.png)

基于网页生成封面的方式也很简单, 我这里采用的是 `dom-to-image` 这个库, 当然搭建也可以使用`html2canvas`.

### 表单设计器 & 数据收集分析能力

表单编辑器的实现思路我之前也写过一些分享, 这里和大家再介绍一下核心的一些思路.

#### 动态表单开发的一般思路

**1\. 静态化配置列表**

静态化配置列表是最传统的表单配置方式之一，基本思路就是利用母表来生成配置项，进而实现表单配置。类似于以下方式： ![](/images/jueJin/c871e2ce7b3e4f4.png) 早期的网站配置就是类似于这种呢方案实现的，比如说我们要定制网站的主色，网站某些组件是否可见，是一种比较简单的方式。但是缺点是每增加一个配置属性，都要开发人员重新编写一个字段配置代码，这种方式在表单开发中非常不灵活，而且对代码层有强依赖性，所以只适合做小型配置系统。比如个人网站，简单的自定义表单。

**2\. 基于json schema的动态表单配置**

基于**json schema**的动态表单配置有两种实现方案， 一种就是支持在线修改json文件从而实现定制化，另一种就是完全无代码操作，但是前提都需要提供一套通用的表单模版。类似于如下案例： ![](/images/jueJin/e88fdfc57dc24bd.png) 此种方案可以实现基本的表单自治。也是本文主要实现的方案。至于在线编写json文件的方案。笔者之前也也过成熟的方案，具体可以参考：[基于jsoneditor二次封装一个可实时预览的json编辑器组件(react版)](https://juejin.im/post/6844904053781037064 "https://juejin.im/post/6844904053781037064")

**3\. 支持在线coding的混合式表单设计** 支持**在线编程**的混合式表单设计方案是终极方案，也是目前流行的无代码化平台的思想之一。一方面它提供了基于**json schema**的动态表单配置， 对于一些强定制的，需要在线设计组件方案的模式，采用在线编程，实时打包成动态组件的方式，最后根据平台的组件约定来实现组件库的方式。如下图所示： ![](/images/jueJin/4367324c929948b.png) 在线代码编辑可以使用**react-codemirror2**或者 **react-monaco-editor**插件来实现。至于在线打包，我们用**nodejs**完全可以实现，笔者在做**Dooring**项目的在线下载代码时就用到了该方案，感兴趣的可以了解一下。

### 可视化领域中的表单引擎

可视化领域一方面强调的是图形(可视化)的设计，一方面是动态表单。比如说我们想傻瓜式的改变一张图的数据，属性，交互等，我们需要通过表单这一桥梁来实现： ![](/images/jueJin/51eea09f8b694a6.png) 所以我们需要设计一款适合公司产品的“表单引擎”，来动态根据图形组件的类型渲染不同表单配置。这块思想也是表单设计器要解决的问题之一。在下面的文章中我们会详细介绍实现过程。

### 从零实现一款动态表单设计器

在实现表单设计器之前，我们先来整理一下思路和需求。在笔者的最初草图中，它长这样： ![](/images/jueJin/3ac70c197d4541b.png) 从草图中我们可以提取到如下任务信息：

*   定义一套表单组件库
*   确定表单全局属性配置
*   实现表单操作curd(增删查改)

我们这里总结了几个常用的表单组件如下：

*   单选框
*   复选框
*   单行文本
*   多行文本
*   下拉框
*   文件上传
*   日期框
*   数值输入框

以上这些基本满足我们的日常开发需求，其次我们还可以开发数据源表单组件，列表组件，比如`dooring`实现的那样：

![image.png](/images/jueJin/2b716f29bc7441d.png) 类似的还有颜色面板这些，我们可以更具业务需求自行定制。

在完成表单组件库之后，我们就需要根据配置项动态渲染了。也有两种实现思路，一种就是类似于多条件判断，如下：

```html
    {
    item.type === 'Number' &&
    <Form.Item label={item.name} name={item.key}>
    <InputNumber min={1} max={item.range && item.range[1]} step={item.step} />
    </Form.Item>
}
    {
    item.type === 'Text' &&
    <Form.Item label={item.name} name={item.key}>
    <Input />
    </Form.Item>
}
    {
    item.type === 'TextArea' &&
    <Form.Item label={item.name} name={item.key}>
    <TextArea rows={4} />
    </Form.Item>
}
```

这样做虽然可行，也有很多成熟系统采用该方案，但是一旦表单变多，比如一个页面有几十个甚至上百个表单项，那么我们将渲染**m** \*\*\* n\*\*次(m为表单组件类型数，n为配置项个数)。另一种方式笔者看来是比较优雅的，可以将复杂度降低到O(n),也就是笔者常用的对象法。思路大至如下：**将表单组件的类型作为对象的属性，属性值为对应的表单组件，这样遍历的时候只需要对应上对象的具体类型即可。** 代码如下：

```html
// 维护表单控件， 提高form渲染性能
    const BaseForm = {
        "Text": (props) => {
        const { label, placeholder, onChange } = props
        return <Cell title={label}>
        <Input type="text" placeholder={placeholder} onChange={onChange} />
        </Cell>
        },
            "Number": (props) => {
            const { label, placeholder, onChange } = props
            return <Cell title={label}>
            <Input type="number" placeholder={placeholder} onChange={onChange} />
            </Cell>
        }
    }
    
    //  动态渲染表单
        {
            formData.map((item, i) => {
        let FormItem = BaseForm[item.type]
        return <div className={styles.formItem} key={i}>
        <FormItem {...item} />
        </div>
        })
    }
```

是不是很优雅呢？后期我们只需要在**BaseForm**里维护表单组件即可，而且还可以基于**BaseForm**对表单进行包装，实现动态删除，编辑等功能。如下：

![image.png](/images/jueJin/62197ac94d26473.png)

包装后的代码如下：

```html
<div>
<div className={styles.disClick}><FormItem {...item} /></div>
<div className={styles.operationWrap}>
<span onClick={handleEditItem}><EditOutlined /></span>
<span onClick={handleDelItem}><MinusCircleOutlined /></span>
</div>
</div>
```

接下来我们看看表单的全局属性，通过实际分析我们可以知道表单有如下外观：

*   表单标题
*   表单背景图片
*   表单背景颜色
*   提交按钮样式

所以他们因该成为表单设计的通用属性，如下图所示：

![image.png](/images/jueJin/11e7f0b66f1941a.png)

以上的表单通过**H5-Dooring**设计而来。当然我们可以利用它设计更加自定的表单页面。

最后一个比较使用的需求就是api定制，一般公司可能需要将用户的录入数据收集到自己的平台，那么这个时候我们提供一个api表单提交接口积极很有必要了，上面笔者也展示过，实现很简单，就是配置里多一个api的文本框即可。

#### 利用H5-Dooring开发一款表单设计平台

在H5编辑器**Dooring**的实现中，我们可以做抽象，每一个页面组件可以看成特定的表单组件，如下图： ![](/images/jueJin/c2033caea91b4b4.png) 我们可以利用**dooring**的能力对表单平台进行拖拽，样式设计，数据录入等等操作，感兴趣的朋友可以基于**Dooring**设计思路改造成自己的表单设计平台。

对于数据收集能力, 可以参考我的另一篇文章:

[前端如何一键生成多维度数据可视化分析报表](https://juejin.cn/post/6886089003481694215 "https://juejin.cn/post/6886089003481694215")

### 协同支持

之前 `H5-Dooring` 是采用 `socket` 来实现双向通信的, 不同的用户如何想协作搭建, 可以通过 共享的`json`文件 或者 `socket` 来实现. 不过最新市面上也出了非常不错的协作方案, 大家也可以参考一下, 这块的功能设计目前我们正在确定方案.

### 出码能力

目前 `Dooring` 支持2种出码方式:

*   生成编译代码
*   生成源码

![image.png](/images/jueJin/f22dcc9ac573479.png)

以上就是我们需要做的在线实时打包下载代码的工作流，由于nodejs是单线程的，为了不阻塞进程我们可以采用父子进程通信的方式和异步模型来处理复杂耗时任务，为了通知用户任务的完成状况， 我们可以用socket做双向通信。在当前的场景下就是代码编译压缩完成之后，通知给浏览器，以便浏览器显示下载状态弹窗。一共有三种状态：**进行中**，**已完成**，**失败**。对应如下图所示界面： ![](/images/jueJin/a71d3565aa0d47d.png) ![](/images/jueJin/b241aab5b3f942f.png) 至于为什么没有出现下载失败的状态，不要问我，问就是没有失败过（完了，找虐了）。

以上就是[**H5-Dooring**](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://github.com/MrXujiang/h5-Dooring")实时编译下载的工作流设计，至于线上更多的实际需求，我们也可以参考以上设计去实现，接下来笔者来具体介绍实现过程。

### 2\. **nodejs**如何使用父子进程

我们要想实现一个自动化工作流, 要考虑的一个关键问题就是任务的执行时机以及以何种方式执行. 因为用户下载代码之前需要等H5页面打包编译压缩完成之后才能下载, 而这个过程需要一定的时间（8-30s）, 所以我们可以认定它为一个耗时任务.

当我们使用**nodejs**作为后台服务器时, 由于**nodejs**本身是单线程的,所以当用户请求传入**nodejs**时, **nodejs**不得不等待这个"耗时任务"完成才能进行其他请求的处理, 这样将会导致页面其他请求需要等待该任务执行结束才能继续进行, 所以为了更好的用户体验和流畅的响应,我们不得不考虑多进程处理. 好在nodejs设计支持子进程, 我们可以把耗时任务放入子进程中来处理,当子进程处理完成之后再通知主进程. 整个流程如下图所示: ![](/images/jueJin/23a35b8842ba438.png) **nodejs**有3种创建子进程的方式，这里笔者简单介绍一下**fork**的方式。使用方式如下：

```js
// child.js
    function computedTotal(arr, cb) {
    // 耗时计算任务
}

// 与主进程通信
// 监听主进程信号
    process.on('message', (msg) => {
        computedTotal(bigDataArr, (flag) => {
        // 向主进程发送完成信号
        process.send(flag);
        })
        });
        
        // main.js
        const { fork } = require('child_process');
        
            app.use(async (ctx, next) => {
                if(ctx.url === '/fetch') {
                const data = ctx.request.body;
                // 通知子进程开始执行任务,并传入数据
                const res = await createPromisefork('./child.js', data)
            }
            
            // 创建异步线程
                function createPromisefork(childUrl, data) {
                // 加载子进程
                const res = fork(childUrl)
                // 通知子进程开始work
                data && res.send(data)
                    return new Promise(reslove => {
                        res.on('message', f => {
                        reslove(f)
                        })
                        })
                    }
                    
                    await next()
                    })
```

在[H5-Dooring](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://github.com/MrXujiang/h5-Dooring")线上打包的工作流中，我们会用到**child\_process**的**exec**方法，来解析并执行命令行指令。至于父子进程的更多应用，大家可以自行探索。

### 3\. 使用**child\_process**的**exec**实现解析并执行命令行指令

在上面介绍的**dooring**工作流中，我们知道为了实现实时打包，我们需要一个**H5 Template**项目，作为打包的母版，当用户点击下载时，会将页面的**json schema**数据传给**node服务器**， **node服务器**再将**json schema**进行**数据清洗**最后生成**template.json**文件并移动到**H5 Template**母版中，此时母版拿到数据源并进行打包编译，最后生成可执行文件。

以上的过程很关键， 这里笔者画个大致的流程图： ![](/images/jueJin/767b98d14ad84cb.png) 为了实现以上过程，我们需要两个关键环节：

1.  将用户配置的数据进行处理并生成json文件，然后移动到**H5 Template**母版中
2.  在母版中自动执行打包编译脚本

第一个环节很好实现，我们只需要用**nodejs**的**fs**模块生成文件到指定目录即可，这里笔者重点介绍第二个环节的实现。

当我们将json数据生成到**H5 Template**中之后，就可以进行打包了，但是这个过程需要自动化的去处理，不能像我们之前启动项目一样，手动执行**npm start**或者**yarn start**。我们需要程序自动帮我们执行这个命令行指令，笔者在查**nodejs API**突然发现了**child\_process**的**exec**方法，可以用来解析指令，这个刚好能实现我们的需求，所以我们开始实现它。代码如下：

```js
import { exec } from 'child_process'
const outWorkDir = resolve(__dirname, '../h5_landing')
const fid = uuid(8, 16)
const cmdStr = `cd ${outWorkDir} && yarn build ${fid}`

// ...exec相关代码
const filePath = resolve(__dirname, '../h5_landing/src/assets/config.json')
const res = WF(filePath, data)

    exec(cmdStr, function(err,stdout,stderr){
        if(err) {
        // 错误处理
            } else {
            // 成功处理
        }
        })
```

以上代码我们不难理解，我们只需要定义好打包的指令字符串（方式和命令行操作几乎一致），然后传入给**exec**的第一个参数，他就会帮我们解析字符串并执行对应的命令行指令。在执行完成之后，我们可以根据回调函数（第二个参数）里的参数值来判断执行结果。整个过程是异步的，所以我们不用担心阻塞问题，为了实时反馈进度，我们可以用**socket**来将进度信息推送到浏览器端。

### 4\. **socket.io**实现消息实时推送

在上面介绍的 **exec实现解析并执行命令行指令** 中还有一些细节可以优化，比如代码执行进程的反馈，执行状态的反馈。因为我们用的是异步编程，所以请求不会一直等待，如果不采取任何优化措施，用户是不可能知道何时代码打包编译完成， 也不知道代码是否编译失败，所以这个时候会采取几种常用的放案：

*   客户端请求长轮询
*   postmessage消息推送
*   websocket双向通信

很明显使用**websocket双向通信**会更适合本项目。这里我们直接使用社区比较火的**socket.io**.由于官网上有很多使用介绍，这里笔者就不一一说明了。我们直接看业务里的代码使用：

```js
// node端
    exec(cmdStr, function(err,stdout,stderr){
        if(err) {
        console.log('api error:'+stderr);
        io.emit('htmlFail', { result: 'error', message: stderr })
            } else {
            io.emit('htmlSuccess', { result: dest, message: stderr })
        }
        })
        
        // 浏览器端
        const socket = io(serverUrl);
        // ...省略其他业务代码
            useEffect(() => {
                socket.on('connect', function(){
                console.log('connect')
                });
                    socket.on('htmlFail', function(data){
                    // ...
                    });
                        socket.on('disconnect', function(e){
                        console.log('disconnect', e)
                        });
                        }, [])
```

这样我们就能实现服务器任务流的状态实时反馈给浏览器端了。

### 5\. 使用**jszip**实现服务端压缩文件并支持前端下载**zip**包

实现前端下载功能其实也很简单，因为用户配置的H5项目包含了各种资源，比如**css，js，html，image**，所以为了提高下载性能和便捷性我们需要把整个网站打包，生成一个**zip**文件供用户下载。原理就是使用**jszip**将目录压缩，然后返回压缩后的路径给到前端，前端采用a标签进行下载。至于如何实现目录遍历压缩和遍历读取目录， 这里笔者就不说了，感兴趣的可以参考笔者其他的`nodejs` 的文章。

### 场景化应用落地

跌跌撞撞的迭代了2年多, 目前已经基本可以使用`Dooring`搭建大部分的场景应用了, 比如:

*   企业官网
*   H5营销页面
*   web简历
*   问卷调查
*   信息流页面
*   活动聚合页面

等等, 后期会扩展更多的场景, 持续迭代, 满足更多用户的深度定制需求.

后期规划
----

目前`Dooring` 已经完成了几个关键性的能力:

*   多模式搭建能力
*   出码能力
*   数据源(动态数据源和静态数据源)
*   表单设计能力
*   组件 / 模版 应用流
*   国际化
*   多端搭建(PC, H5, iPad)

后期会从`搭建效率`和`资源生态` 这两个维度继续迭代, 比如:

*   PSD导入
*   移动进度控制
*   营销组件丰富
*   智能模版推荐
*   参数化自动生成页面
*   以应用为单位的应用搭建平台
*   埋点和监控系统搭建
*   组件, 数据互通

如果大家感兴趣, 也欢迎随时和我交流讨论, 探索真正的技术.