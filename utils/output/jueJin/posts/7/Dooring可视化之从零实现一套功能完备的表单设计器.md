---
author: "徐小夕"
title: "Dooring可视化之从零实现一套功能完备的表单设计器"
date: 2020-09-06
description: "之前笔者有写过一篇如何设计动态表单配置平台的文章，但是由于笔者电脑问题代码丢失，所以后期重新实现了一套表单设计器，并优化了之前的设计方式，特地做一下总结和复盘。 上图中我们将表单设计器集成到了H5-Dooring中，使其可以实现拖拽生成表单。 其次我们可以根据右边的配置项，动态…"
tags: ["数据可视化","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:82,comments:9,collects:117,views:9017,"
---
前言
--

之前笔者有写过一篇如何设计**动态表单配置平台**的文章，但是由于笔者电脑问题代码丢失，所以后期重新实现了一套**表单设计器**，并优化了之前的设计方式，特地做一下总结和复盘。

你将收获
----

*   动态表单开发的一般思路
*   可视化领域中的表单引擎
*   从零实现一款动态表单设计器
*   利用H5-Dooring开发一款表单设计平台

正文
--

按照习惯，我们先看看**表单设计器**实现的效果展示： ![](/images/jueJin/84ea2ffd564641b.png) ![](/images/jueJin/9705ffaa01cc447.png) 上图中我们将表单设计器集成到了**H5-Dooring**中，使其可以实现拖拽生成表单。

其次我们可以根据右边的配置项，动态的添加某个表单组件或或者修改组件字段和数据源。在配置好表单之后我们还可以定制表单提交的**api**接口地址，以便实现用户数据的可溯源性。

在开发之前，我们先分析一下动态表单设计的一般实现思路。

### 动态表单开发的一般思路

**1\. 静态化配置列表** 静态化配置列表是最传统的表单配置方式之一，基本思路就是利用母表来生成配置项，进而实现表单配置。类似于以下方式： ![](/images/jueJin/c871e2ce7b3e4f4.png) 早期的网站配置就是类似于这种呢方案实现的，比如说我们要定制网站的主色，网站某些组件是否可见，是一种比较简单的方式。但是缺点是每增加一个配置属性，都要开发人员重新编写一个字段配置代码，这种方式在表单开发中非常不灵活，而且对代码层有强依赖性，所以只适合做小型配置系统。比如个人网站，简单的自定义表单。

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

以上这些基本满足我们的日常开发需求，其次我们还可以开发数据源表单组件，列表组件，比如dooring实现的那样： ![](/images/jueJin/9e0ae9888df549d.png) 类似的还有颜色面板这些，我们可以更具业务需求自行定制。

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

是不是很优雅呢？后期我们只需要在**BaseForm**里维护表单组件即可，而且还可以基于**BaseForm**对表单进行包装，实现动态删除，编辑等功能。如下： ![](/images/jueJin/c6fdadbf2dea466.png) 包装后的代码如下：

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

所以他们因该成为表单设计的通用属性，如下图所示： ![](/images/jueJin/22898c0ad595498.png) 配置出来之后的表单可能长这样： ![](/images/jueJin/087841fd2e8c486.png) 以上的表单通过**H5-Dooring**设计而来。当然我们可以利用它设计更加自定的表单页面。

最后一个比较使用的需求就是api定制，一般公司可能需要将用户的录入数据收集到自己的平台，那么这个时候我们提供一个api表单提交接口积极很有必要了，上面笔者也展示过，实现很简单，就是配置里多一个api的文本框即可。

最后一步就是实现表单的curd操作，展示如下：

编辑表单项： ![](/images/jueJin/219de195838a468.png) 删除表单项： ![](/images/jueJin/5c7eed2773264c5.png) 添加表单项： ![](/images/jueJin/07e270e5227340c.png) 具体实现也比较简单，只需要基于BaseForm进行包装，添加删除/编辑/添加按钮即可。具体可以参考我的开源项目H5-Dooring，地址：[H5-Dooring传送门](https://link.juejin.cn?target=http%3A%2F%2Fio.nainor.com%2Fh5_visible "http://io.nainor.com/h5_visible")

### 利用H5-Dooring开发一款表单设计平台

在H5编辑器**Dooring**的实现中，我们可以做抽象，每一个页面组件可以看成特定的表单组件，如下图： ![](/images/jueJin/c2033caea91b4b4.png) 我们可以利用**dooring**的能力对表单平台进行拖拽，样式设计，数据录入等等操作，感兴趣的朋友可以基于**Dooring**设计思路改造成自己的表单设计平台。在文末笔者会附上dooring的**github**地址供大家研究参考。

#### H5可视化编辑器Dooring功能迭代说明

目前笔者实现的H5可视化编辑器**H5-Dooring**功能新增如下：

*   实时保存功能
*   添加进度条组件
*   添加websocket通信
*   实现在线下载代码功能
*   添加Button组件
*   添加动态表单设计器

预览地址：[基于React+Koa实现一个h5页面可视化编辑器－Dooring](https://link.juejin.cn?target=https%3A%2F%2Fdooring.vip "https://dooring.vip")

github地址：[基于React+Koa实现一个h5页面可视化编辑器－Dooring](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://github.com/MrXujiang/h5-Dooring")

最后
--

如果想学习更多H5游戏, webpack，node，gulp，css3，javascript，nodeJS，canvas数据可视化等前端知识和实战，欢迎在《趣谈前端》一起学习讨论，共同探索前端的边界。

更多推荐
----

*   [基于React+Koa实现一个h5页面可视化编辑器－Dooring](https://juejin.im/post/6864410873709592584 "https://juejin.im/post/6864410873709592584")
*   [深度剖析github star数15.1k的开源项目redux-thunk](https://juejin.im/post/6861538848963461133 "https://juejin.im/post/6861538848963461133")
*   [TS核心知识点总结及项目实战案例分析](https://juejin.im/post/6857123751205535751 "https://juejin.im/post/6857123751205535751")