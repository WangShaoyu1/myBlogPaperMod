---
author: "徐小夕"
title: "从零开发一款可视化搭建框架dooringx-lib"
date: 2021-09-02
description: "去年上线的可视化编辑器 H5-dooring 至今已有一年的时间，期间有很多热心的网友和大佬提出了非常多宝贵的建议，我们也在一步步实现中，以下是几个比较典型的低代码可视化平台需求 出码能力(即源码下"
tags: ["GitHub","前端框架","数据可视化中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读11分钟"
weight: 1
selfDefined:"likes:325,comments:0,collects:395,views:17109,"
---
> dooringx演示地址: [dooringx可视化搭建平台](https://link.juejin.cn?target=http%3A%2F%2Fx.dooring.cn "http://x.dooring.cn")  
> 注: ⚠️本文为掘金社区首发签约文章，未获授权禁止转载

去年上线的可视化编辑器 [**H5-dooring**](https://link.juejin.cn?target=http%3A%2F%2Fh5.dooring.cn%2Fh5_plus "http://h5.dooring.cn/h5_plus") 至今已有一年的时间，期间有很多热心的网友和大佬提出了非常多宝贵的建议，我们也在一步步实现中，以下是几个比较典型的低代码可视化平台需求:

*   **出码能力**(即源码下载功能)
*   **组件交互**(即组件支持业务中常用的链接跳转，弹窗交互，自定义事件等)
*   **数据源管理**(即用户创建的不同页面拥有共享数据的能力，不同组件之间也有共享数据的能力)
*   **组件商店**(即用户可以自主生产组件，定义组件，接入组件数据的能力)
*   **布局能力**(即用户可以选择不同的布局方案来设计页面)
*   **常用功能集成**(页面截图，微信分享，debug能力)

上面的这些功需求已经在 [**H5-dooring**](https://link.juejin.cn?target=http%3A%2F%2Fh5.dooring.cn%2Fh5_plus "http://h5.dooring.cn/h5_plus") 陆续实现了，在我之前的文章中也有对应的技术分享。但是为了让更多的人能低成本的拥有自己的可视化搭建系统，我们团队的大佬花了非常多的时间研究和沉淀，最近也开源了一款可视化搭建框架 [**dooringx-lib**](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FH5-Dooring%2Fdooringx "https://github.com/H5-Dooring/dooringx")，我们可以基于它轻松制作可视化编辑器，而无需考虑内部的实现细节，接下来我就和大家分享一下这款可视化框架的使用方式和实现思路，同时也非常感谢 [**dooring可视化团队**](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FH5-Dooring "https://github.com/H5-Dooring") 各位大佬们的辛勤付出。

![image.png](/images/jueJin/e85b658a896c46a.png)

可视化搭建框架基本使用和技术实现
----------------

为了让大家更好的理解可视化搭建框架，我这里举几个形象的例子:

1.  **antd** —— **antd-pro**

![image.png](/images/jueJin/96d9d90953dc40d.png) 我们都知道 **antd** 是流行的前端组件库，那么基于它上层封装的管理后台 **antd-pro** 就是它的上层应用。

2.  **GrapesJS** —— **craft.js**

![image.png](/images/jueJin/16c4ed95ad04409.png) **GrapesJS** 是一款国外的页面编辑器框架(详细介绍可参考我之前的文章 [这款国外开源框架, 让你轻松构建自己的页面编辑器](https://juejin.cn/post/6994335252508311565 "https://juejin.cn/post/6994335252508311565")) ，那么 **craft.js** 就是它的上层应用框架。

3.  **dooringx-lib** —— **dooringx**

![chrome-capture.gif](/images/jueJin/42f9050035c54f8.png)

**dooringx-lib** 是一款可视化搭建框架，同理 **dooringx** 就是基于 **dooringx-lib** 的可视化编辑器。

之所以要介绍它们的区别，是因为之前有很多朋友对这块概念理解的不是很清晰，在了解了**可视化搭建框架** 的 “内涵” 之后，我们开始今天的核心内容。

### 1.技术栈

在分享框架实现思路之前当然要自报家门，框架实现上我们还是采用熟悉的 **React** 生态，移动端组件库采用的众安团队的 **zarm**，编辑器应用层采用的 **antd**，至于其他的比如**拖拽**，**参考线**，**状态管理**，**插件机制**等都是我们团队大佬自研的方案。如果你是 **vue** 或者其他技术栈为主的团队，也可以参考实现思路，相信也会对你有一定的启发。

### 2.基本使用方式

在开始深入之前我们先看看如何使用这款框架，我们只需要按照如下方式即可安装使用:

```bash
npm/yarn  install dooringx-lib
```

同时我们还提供了基础的使用demo，方便大家在自己的工程中快速上手:

```bash
# 克隆项目
# cnpmjs
git clone https://github.com.cnpmjs.org/H5-Dooring/dooringx.git

# or
git clone https://github.com/H5-Dooring/dooringx.git


# 进入项目目录
cd dooringx

# 安装依赖
yarn install

# 启动基础示例
yarn start:example

# 启动 dooringx-lib
yarn start

# 启动 dooringx doc 文档
yarn start:doc

yarn build
```

**demo** 的 **github** 项目如下:

![image.png](/images/jueJin/97baea81b0334f2.png)

github地址: [github.com/H5-Dooring/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FH5-Dooring%2Fdooringx "https://github.com/H5-Dooring/dooringx")

在了解完使用方式之后，我们来看看基本架构和实现思路。

### 3.dooringx-lib基础架构和工作机制

![image.png](/images/jueJin/c5b30e859061480.png)

上图就是我根据目前 **dooringx-lib** 的项目架构梳理的架构图，基本包含了搭建化编辑框架的大部分必备模块。为了保证框架的灵活性，我们还可以按需安装对应的功能组件，开发自定义的组件等。如下是一个基本的导入案例:

```js
    import {
    RightConfig,
    Container,
    useStoreState,
    innerContainerDragUp,
    LeftConfig,
    ContainerWrapper,
    Control,
    } from 'dooringx-lib';
```

我们将整个框架拆分成了不同的模块，这些模块既相互独立又可以相互关联。完整的工作流程如下:

![image.png](/images/jueJin/e999388399194dc.png)

由上图可以看出，我们只需要拥有基础的业务研发能力，就可以借助 **dooringx-lib** 构建一个属于自己的搭建平台，就好比任何程序的本质: **数据**和**逻辑**。

### 4.dooringx-lib插件开发

接下来我会和大家分享 **dooringx-lib** 的插件开发方式和具体实现(如何导入插件，如何编写组件，如何注册函数等)，如果大家感兴趣的话也可以跟着下面的方式实践一下。

#### 4.1 如何导入组件

![image.png](/images/jueJin/c86c86f65f7d472.png)

我们在上图可以看到左侧是我们的组件物料区，分为**基础组件**，**媒体组件**，**可视化组件**，它们的添加会统一放在 **LeftRegistMap** 数组中来管理，其基本结构如下:

```js
    const LeftRegistMap: LeftRegistComponentMapItem[] = [
        {
        type: 'basic', // 组件类别
        component: 'button', // 组件名称
        img: 'icon-anniu', // 组件icon
        displayName: '按钮', // 组件中文名
        urlFn: () => import('./registComponents/button'),  // 注册回调
        },
        ];
```

左侧组件支持同步导入或者异步导入。

如果需要异步导入组件，则需要填写 **urlFn**，需要一个返回 **promise** 的函数。也可以支持远程载入组件，只要 **webpack** 配上即可。

如果需要同步导入组件，则需要将组件放入配置项的 **initComponentCache** 中，这样在载入时便会注册进 **componentRegister** 里。

```js
    initComponentCache: {
    modalMask: { component: MmodalMask },
    },
```

#### 4.2 如何定制左侧面板

![image.png](/images/jueJin/d678455db714483.png)

左侧面板传入 **leftRenderListCategory** 即可。

```js
    leftRenderListCategory: [
        {
        type: 'basic',
        icon: <HighlightOutlined />,
        displayName: '基础组件',
        },
            {
            type: 'xxc',
            icon: <ContainerOutlined />,
            custom: true,
            customRender: <div>我是自定义渲染</div>,
            },
            ],
```

**type** 是分类，左侧组件显示在哪个分类由该字段决定。**icon** 则是左侧分类小图标(如上图所示)。当 **custom** 为 **true** 时，可以使用 **customRender** 自定义渲染。

#### 4.3 开发一个自定义的可视化组件

组件需要导出一个由 **ComponentItemFactory** 生成的对象:

```js
const MButton = new ComponentItemFactory(
'button',
'按钮',
    {
        style: [
            createPannelOptions<FormMap, 'input'>('input', {
            receive: 'text',
            label: '文字',
            }),
            ],
            animate: [createPannelOptions<FormMap, 'animateControl'>('animateControl', {})],
            actions: [createPannelOptions<FormMap, 'actionButton'>('actionButton', {})],
            },
                {
                    props: {
                    ...
                    text:'x.dooring'// input配置项组件接收的初始值
                    },
                    },
                        (data, context, store, config) => {
                        return <ButtonTemp data={data} store={store} context={context} config={config}></ButtonTemp>;
                        },
                        true
                        );
                        
                        export default MButton;
```

其中第一个参数为组件注册名，第二个参数用来展示使用。

第三个参数用来配置右侧面板的配置项组件。其中键为右侧面板的分类，值为配置项组件数组。

第四个参数会配置组件的初始值，特别注意的是，制作组件必须要有初始宽度高度（非由内容撑开），否则会在适配时全选时产生问题。

这个初始值里有很多有用的属性，比如fixed代表使用固定定位，可以结合配置项更改该值，使得组件可以fixed定位。

还有 **canDrag** 类似于锁定命令，锁定的元素不可拖拽。

初始值里的 **rotate** 需要个对象，**value** 代表旋转角度，**canRotate** 代表是否可以操作旋转。（0.7.0版本开始支持）

第五个参数是个函数，你将获得配置项中的 **receive** 属性（暂且都默认该配置为**receive**）传来的配置，比如上例中 **receive** 的是 **text**，则该函数中 **data** 里会收到该字段。

**context** 一般只有 **preview** 和 **edit**，用来进行环境判断。

**config** 可以拿到所有数据，用来制作事件时使用。

第六个参数 **resize** 是为了判断是否能进行缩放，当为 **false** 时，无法进行缩放。

第七个参数 **needPosition**，某些组件移入画布后会默认采取拖拽的落点，该配置项默认为 **true**, 就是需要拖拽的位置，为 **false** 时将使用组件自身 **top** 和 **left** 定位来放置。

#### 4.4 事件注册

![image.png](/images/jueJin/d7855ffac84a43c.png)

1.  注册时机

事件可以细分为 **注册时机** 和 **函数**，组件内可以通过 **hook** 的方式来实现注册时机：

```js
useDynamicAddEventCenter(pr, `${pr.data.id}-init`, '初始渲染时机'); //注册名必须带id 约定！
useDynamicAddEventCenter(pr, `${pr.data.id}-click`, '点击执行时机');
```

**useDynamicAddEventCenter** 第一个参数是 **render** 的四个参数组成的对象。第二个参数是注册的时机名，必须跟 **id** 相关，这是约定，否则多个组件可能会导致名称冲突，并且方便查找该时机。

注册完时机后，我们需要将时机放入对应的触发位置上，比如这个 **button** 的点击执行时机就放到 **onclick** 中：

```html
<Button
    onClick={() => {
    eventCenter.runEventQueue(`${pr.data.id}-click`, pr.config);
}}
>
x.dooring
</Button>
```

其中第一个参数则为注册的时机名，第二个为 **render** 函数中最后一个参数 **config**

2.  函数注册

函数由组件抛出，可以加载到事件链上。比如，注册个改变文本函数，那么我可以在任意组件的时机中去调用该函数，从而触发该组件改变文本。

函数注册需要放入 **useEffect** 中，在组件卸载时需要卸载函数！否则会导致函数越来越多。

```js
    useEffect(() => {
    const functionCenter = eventCenter.getFunctionCenter();
    const unregist = functionCenter.register(
    `${pr.data.id}+改变文本函数`,
        async (ctx, next, config, args, _eventList, iname) => {
        const userSelect = iname.data;
        const ctxVal = changeUserValue(
        userSelect['改变文本数据源'],
        args,
        '_changeval',
        config,
        ctx
        );
        const text = ctxVal[0];
        setText(text);
        next();
        },
            [
                {
                name: '改变文本数据源',
                data: ['ctx', 'input', 'dataSource'],
                    options: {
                    receive: '_changeval',
                    multi: false,
                    },
                    },
                ]
                );
                    return () => {
                    unregist();
                    };
                    }, []);
```

函数中参数与配置见后面的函数开发。

#### 4.5 右侧面板开发

![chrome-capture (2).gif](/images/jueJin/93d3f6c00b94456.png)

为了开发自定义的右侧属性面板，我们只要将开发的组件配成一个对象放入 **initFormComponents** 即可。为了良好的开发体验，需要定义个 **formMap** 类型：

```ts
    export interface FormBaseType {
    receive?: string;
}
    export interface FormInputType extends FormBaseType {
    label: string;
}
export interface FormActionButtonType {}
export interface FormAnimateControlType {}
    export interface FormMap {
    input: FormInputType;
    actionButton: FormActionButtonType;
    animateControl: FormAnimateControlType;
}
```

**formMap** 的键名就是 **initFormComponents** 键名，**formMap** 的值对应组件需要收到的值。

以 **input** 组件为例，**FormInputType** 此时有2个属性: **label**, **receive**。

那么在开发该组件时，**props** 会收到：

```js
    interface MInputProps {
    data: CreateOptionsRes<FormMap, 'input'>;
    current: IBlockType;
    config: UserConfig;
}
```

也就是 **data** 是 **formMap** 类型，而 **current** 是当前点击的组件，**config** 就不用说了。

还记得在左侧组件开发中的第三个参数吗？这样就都关联起来了：

```js
    style: [
        createPannelOptions<FormMap, 'input'>('input', {
        receive: 'text',
        label: '文字'
        })
        ],
```

**createPannelOptions** 这个函数的泛型里填入对应的组件，将会给收到的配置项良好的提示。

在配置项组件里所要做的就是接收组件传来的配置项，然后去修改 **current** 的属性：

```js
    function MInput(props: MInputProps) {
        const option = useMemo(() => {
        return props.data?.option || {};
        }, [props.data]);
        return (
        <Row style={{ padding: '10px 20px' }}>
        <Col span={6} style={{ lineHeight: '30px' }}>
        {(option as any)?.label || '文字'}：
        </Col>
        <Col span={18}>
        <Input
    value={props.current.props[(option as any).receive] || ''}
        onChange={(e) => {
        const receive = (option as any).receive;
        const clonedata = deepCopy(store.getData());
            const newblock = clonedata.block.map((v: IBlockType) => {
                if (v.id === props.current.id) {
                v.props[receive] = e.target.value;
            }
            return v;
            });
            store.setData({ ...clonedata, block: [...newblock] });
        }}
        ></Input>
        </Col>
        </Row>
        );
    }
```

由于可以很轻松的拿到 **store**，所以可以在任意地方进行修改数据。

将组件的 **value** 关联 **current** 的属性，**onChange** 去修改 **store**，这样就完成了个双向绑定。

注意：如果你的右侧组件需要用到 **block** 以外的属性，可能需要去判断是否处于弹窗模式。

#### 4.6 自定义右键菜单

![chrome-capture (3).gif](/images/jueJin/b5f48b994d594b3.png)

右键菜单可以进行自定义：

```ts
// 自定义右键
const contextMenuState = config.getContextMenuState();
const unmountContextMenu = contextMenuState.unmountContextMenu;
const commander = config.getCommanderRegister();
    const ContextMenu = () => {
        const handleclick = () => {
        unmountContextMenu();
        };
        const forceUpdate = useState(0)[1];
            contextMenuState.forceUpdate = () => {
            forceUpdate((pre) => pre + 1);
            };
            return (
            <div
                style={{
                left: contextMenuState.left,
                top: contextMenuState.top,
                position: 'fixed',
                background: 'rgb(24, 23, 23)',
            }}
            >
            <div
        style={{ width: '100%' }}
            onClick={() => {
            commander.exec('redo');
            handleclick();
        }}
        >
        <Button>自定义</Button>
        </div>
        </div>
        );
        };
        contextMenuState.contextMenu = <ContextMenu></ContextMenu>;
```

先拿到 **contextMenuState**，**contextMenuState** 上有个 **unmountContextMenu** 是关闭右键菜单方法。所以在点击后需要调用关闭。同时上面的 **left** 和 **top** 是右键的位置。另外，我们还需要在组件内增加强刷，赋值给 **forceUpdate**，用于在组件移动时进行跟随。

#### 4.7 表单验证提交思路

![image.png](/images/jueJin/b29a21055e8b42f.png)

表单验证提交有非常多的做法，因为数据全部是联通的，或者直接写个表单组件也可以。在不使用表单组件时，简单的做法是为每个输入组件做个验证函数与提交函数。这样是否验证就取决于用户的选取，而抛出的输入可以让用户选择放到哪，并由用户去命名变量。

在点击提交按钮时，调用所有组件的验证函数与提交函数，使其抛给上下文，再通过上下文聚合函数聚合成对象，最后可以通过发送函数发送给对应后端，从而完成整个流程。我们可以在 [**dooringx**](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FH5-Dooring%2Fdooringx "https://github.com/H5-Dooring/dooringx") 中试下这个**demo**。

另一种方式是可以专门写个提交按钮，固定了参数，以及部分规则，比如规定在页面中的所有表单都会被收集提交。

那么我们可以利用数据源，将所有表单输出内容自动提交给数据源，最后的提交按钮按数据源规定格式的**key** 提取，发送给后端。

后期规划
----

后期我们还会在产品功能方面持续迭代优化，如果大家有好的建议, 也可以随时和我们交流, 也欢迎在 github 上积极提 [**issue**](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FH5-Dooring%2Fdooringx%2Fissues "https://github.com/H5-Dooring/dooringx/issues")。

如果大家对可视化搭建或者低代码/零代码感兴趣，也可以参考我往期的文章或者在评论区交流你的想法和心得，欢迎一起探索前端真正的技术。

> github: [dooringx | 快速高效搭建可视化拖拽平台](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FH5-Dooring%2Fdooringx "https://github.com/H5-Dooring/dooringx")  
> 首发：[掘金技术社区](https://juejin.cn "https://juejin.cn")  
> 团队：[Dooring可视化团队](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FH5-Dooring "https://github.com/H5-Dooring")  
> 专栏：[低代码可视化](https://juejin.cn/column/6963455443528056839 "https://juejin.cn/column/6963455443528056839")  
> 公众号: 趣谈前端

更多推荐
----

*   [如何设计可视化搭建平台的组件商店？](https://juejin.cn/post/6986824393653485605 "https://juejin.cn/post/6986824393653485605")
*   [从零设计可视化大屏搭建引擎](https://juejin.cn/post/6981257575425654792 "https://juejin.cn/post/6981257575425654792")
*   [从零使用electron搭建桌面端可视化编辑器Dooring](https://juejin.cn/post/6976476731662139428 "https://juejin.cn/post/6976476731662139428")
*   [(低代码)可视化搭建平台数据源设计剖析](https://juejin.cn/post/6973946702235615269 "https://juejin.cn/post/6973946702235615269")
*   [从零搭建一款PC页面编辑器PC-Dooring](https://juejin.cn/post/6950075140906418213 "https://juejin.cn/post/6950075140906418213")
*   [如何搭积木式的快速开发H5页面?](https://juejin.cn/post/6904878119724056584 "https://juejin.cn/post/6904878119724056584")