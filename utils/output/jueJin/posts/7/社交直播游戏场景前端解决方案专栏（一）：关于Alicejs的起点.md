---
author: "网易云音乐技术团队"
title: "社交直播游戏场景前端解决方案专栏（一）：关于Alicejs的起点"
date: 2023-05-29
description: "我们在React 技术体系的基础上实现DSL模式的H5游戏开发能力，包括UI构建、资源管理、动效、事件等，让熟悉JSX和Hooks语法编写的同学可以快速接入游戏场景开发，同时提供强大图形渲染性能。"
tags: ["前端","Canvas","DOM中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读20分钟"
weight: 1
selfDefined:"likes:25,comments:5,collects:35,views:3565,"
---
> 本文作者：QHC

前言：
---

长久以来，传统前端的工作大多时候在与DOM打交道，近年来，浏览器厂商也在不断努力提高DOM渲染性能，以提高用户体验。但是更多复杂场景的出现，例如近几年随着在线直播、社交娱乐、各种小游戏的火爆，前端性能的关注度持续提高。特别是游戏场景，而我们团队也面临着一大波h5游戏化场景，那么这个系列文章，将带读者朋友们一起了解，云音乐社交直播业务的游戏化场景解决方案的整体思路与落地案例分享。希望能给大家在今后的开发中带来一些启发。

一、游戏开发的技术选型
-----------

其实，在前期我们接到一些小游戏的需求时，我经常在想一个问题，就是为什么业界都主张使用Canvas来作为游戏开发的主旋律？我们对于DOM的运用和理解，在某种程度上是比较自信的。运用自己更熟悉的手段去实现需求不就可以了么？

这里主要还是涉及到性能问题和一些少见但会有的场景实现问题。下面就简单从性能和场景支持度两个角度来跟大家聊一下Canvas作为游戏开发主旋律的必要性。

#### 1.1、性能比较

首先为什么我们可以这么肯定地说Canvas的渲染性能比DOM来的优秀。浏览器厂商明明在DOM渲染上已经做了足够多的优化。比如渲染树的处理方式、重排重绘的机制优化、Chrome浏览器通过预解析技术将DOM生成速度提高了40%等等看着都挺优秀的优化。它还是不及Canvas么？答案是肯定的。因为虽然浏览器厂商在DOM渲染上做了很多优化，但是DOM元素是作为矢量图进行渲染的，每个元素的边距都需要单独处理，浏览器需要将它们全部处理成像素才能输出到屏幕上，计算量非常庞大。当页面上存在大量DOM元素时，这些内容的渲染速度就会变慢。相比之下，Canvas本质上是一张位图，浏览器在渲染Canvas时只需要在JavaScript引擎中执行绘制逻辑，在内存中构建画布，然后遍历整个画布中的像素颜色，直接输出到屏幕上即可。无论Canvas里面的元素有多少个，浏览器在渲染阶段都只需要处理一张画布。

**DOM：驻留模式**  
驻留模式（Retained Mode）是DOM在浏览器中的渲染模式。粗略工作流程如下（图片来源[zhuanlan.zhihu.com/p/400391575](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F400391575 "https://zhuanlan.zhihu.com/p/400391575")

![image.png](/images/jueJin/e44997ec5e61005.png)

**Canvas：快速模式**  
Canvas采用了和DOM不同的快速模式（Immediate Mode），粗略工作流程如下：

![image.png](/images/jueJin/ef22d780186f50e.png)

两者的区别在与驻留模式会生成一个（scene）和模型（model）存储到内存中，然后再调用系统的绘制API（如Windows程序员熟悉的GDI/GDI+），把这些中间产物绘制到屏幕。也就意味着场景中每增加一点东西就需要额外消耗一些内存。而这在即时渲染模式下是不会发生的。Canvas绘制将这些场景和模型都交给开发者在开发阶段自我实现了。

#### 1.2、场景支持能力

除了上面说的性能优势以外。在一些特定场景下，Canvas也许是唯一解。是DOM所无法替代的。比如经常出现在我们游戏场景中的一些透明视频素材的动效或者其他比如lottie等格式的动效资源播控。

#### 1.3、已有方案的选择

我们已经知道了整体的技术选型方向，接下来选择一个合适的解决方案我们认为需要考虑到以下几点要素：

**1、对需求的支持能力（简而言之就是该技术栈是否能够让我们把需求完整的落地）  
2、页面性能（即游戏帧率、卡顿比、CPU或GPU占用率等游戏相关指标）  
3、开发效率和维护成本  
4、学习成本（这里指的学习成本应该是对于整个团队而言而非个人）  
5、技术支撑、技术生态**

为此，我们做了一些简单的对比

DOM + CSS

PixiJS

Eva.js

Cocos/Egret/Phaser\*专业的H5游戏引擎

页面性能

中 \*涉及回流重绘时

高

高

高

开发效率

高

中

中

中

学习成本

低

中

中

高

技术团队支撑

社区

社区

社区

社区

功能支持

基础能力支持其他需要第三方库

缺少原生 Flex 布局、透明视频、Lottie 等动效格式支持

基本与PIXI一致

较为全面支持发布微信小游戏等平台

考虑到业务游戏场景的复杂度并没有非常高，轻量级的js库可能更适合我们这种业务场景，而专业的游戏引擎相对来说启动成本就比较高了。所以我们在后续的开发中，PixiJS和Eva.js都有使用过。在这个过程中，积累了一些经验的同时我们体验到很多对于前端开发者来说非常不友好的体验。

二、游戏开发中的痛点
----------

#### 1.1、社交直播业务中的游戏现状

与传统小游戏不同的是，在社交直播商业化玩法体系中。游戏往往是作为一个完整的需求的一部分。在一个web页面中，不仅仅是只有一整片的游戏场景构建而成的，而是伴生着很多的传统页面元素的渲染和交互在里面。第二个特点是我们的游戏场景中即时状态修改不会特别频繁（类似高频操作类），而基本都是线性的弱人机交互。以下几张截图是我们已经上线的一些小游戏

![](/images/jueJin/8134306e5673913.png) ![](/images/jueJin/1f8f2a950131aba.png) ![](/images/jueJin/067127918e2cfa0.png) ![](/images/jueJin/0ba20c16276981b.png)

同时不难看出，在游戏界面中我们还有大量的榜单、任务、聊天室、UI弹窗等传统元素的绘制与交互。这也意味着在游戏开发过程中，如果我们完全使用三方游戏引擎如Eva.js、PixiJS、cocos creator来绘制页面的话，难免会损失一定的UI排版、UI细节处理上的效率。

#### 1.2、 痛点分析

其实我们面临的一个很大的问题是，PixiJS也好、Eva.js也好，它们无非是一套基于Canvas的渲染方案，而当前端开发者沉浸于DSL开发时（比如我们团队就是以react为基础技术栈），PixiJS、Eva.js并没有提供一套与之对应的DSL开发模式。这就使得我们遭遇了几个重点难题：

**痛点1**、无法高效的去绘制一些界面内容，各种元素的绘制都需要append节点来做，非常低效，而为了解决这个问题。我们尝试将一个需求拆解为DOM层和游戏层这种分层设计，这样确实可以最大程度利用DOM的高效排版能力。可是这又带来了另外的问题；

**痛点2**、当react和这些渲染引擎的代码穿插出现在业务中的时候，往往带来的代码管理成本是非常高的。比如状态管理就无法在游戏侧和UI侧同时共享；

![image.png](/images/jueJin/77e2cb32028a824.png)

以一个卡牌类桌游场景为例。于是就有了以下这种很棘手的开发流程

![image.png](/images/jueJin/9fe9851e260cd90.png)

**痛点3**、除此之外，代码里也需要有大量的订阅发布、面向对象开发、甚至有时需要单独维护一套状态机。在使用Eva.js的过程中，我们还需要遵循ECS的架构思路来安排自己的代码。这一切，都与DSL有所割裂。而完全在需求中摒弃DSL却又会导致开发效率的直线下滑。

三、游戏UI要是能用react antd该多好
-----------------------

我想这应该是前端开发者在游戏开发过程中绕不开的一个想法。而其实PixiJS团队有提供一套react-pixi这样的库。于是我们尝试去使用了。但我们发现，它还是相对比较简单。对于需求的实现我们需要额外做很多别的事情。比如资源管理、事件管理、各种css布局能力、各种格式的动画素材播放能力、高效的缓动体系等。它都是不具备的。故此我们自研Alice.js的想法萌芽了。这里分享以下三点关于Alice.js的核心观念

**1：Alice.js的目标是什么？**

形成一套完整的 H5 小游戏解决方案。在现有的 React 技术体系下，通过框架提供的游戏研发能力，让开发同学用熟悉的 JSX 和 Hooks 语法编写动画、游戏场景的代码。

1.  贴合实际业务，与 React 生态紧密结合（数据管理和 UI 构建）
2.  支持 JSX 写法，学习成本低，会 React 就能快速上手
3.  轻量级、高性能、可扩展
4.  形成一套完整的 H5 小游戏解决方案

![image.png](/images/jueJin/490e83299950cbc.png)

**2：Alice.js的使用场景是什么？**

因为在渲染层我们采用了PixiJs来作为渲染引擎，所以如果要指定一个试用范围，我想应该是所有PixiJs可以cover的场景，都可以使用Alice.js进行开发。而对于无法单纯使用PixiJs实现的场景，通过Alice的高扩展能力也能够覆盖。当然了，因为PixiJs本身是一个2d渲染引擎。所以当我们遇到3D场景时，目前是无法覆盖的。

**3：Alice.js的优势在哪里？**

1、Alice.js将渲染引擎和传统UI框架有效的进行了融合。这使得我们可以用JSX标声明式开发游戏UI内容。也就是说，我们提供一整套DSL游戏开发模式  
2、我们提供了一整套布局方案，你可以轻松的以cssinjs的形式对游戏元素进行排版和修饰  
3、优秀的可扩展性，支持了各种类型动效素材的播控，和各种游戏常用组件的库的提供  
4、提供了一整套游戏开发必备的资源管理体系，这使得游戏的资源管理变得非常高效  
5、因为底层是借助 react-reconciler 编写自定义 renderer，所以天然支持使用各种状态管理库，技术栈割裂的现象将不复存在

四、Alice.js的架构设计
---------------

Alice的整体架构如下图：

![image.png](/images/jueJin/0984e78dd5c5bbb.png)

篇幅原因，本文主要简单介绍Alice.js的整体架构设计，在本系列后续文章中，将详细为大家讲解我们是如何将这一整套架构的实现。敬请读者朋友们期待。

### 1、架构分层-桥接层

根据我们的整体目标做一下拆解。首先，我们希望实现一整套基于React框架的声明式小游戏DSL开发模式。这也就意味着，我们需要将传统的eva.js也好还是PixiJs的语法转为React框架下的JSX语法。例如，如下代码我们实现一张canvas画布上绘制有蓝天白云、草地上有男孩、女孩。

```JSX
<Stage>
<Sky>
<Cloud /> // 云彩是动态的
</Sky>
<Background>
<Boy /> // 人物可以做一些动作，这取决于动画素材
<Girl />
</Background>
</Stage>
```

![image.png](/images/jueJin/6db944561d3c157.png)

#### 1.1 打通React和PixiJs的桥梁

为了实现这一点，我们利用了`react-reconciler`作为桥梁。`react-reconciler` 是一个抽象层，用于实现自定义的渲染器。它允许你在 React 的基础上构建自己的渲染器，例如将 React 渲染到非 DOM 环境（如移动端原生组件、Canvas 等)。

于是我们拥有了一个自定义的renderer:

```js
import Reconciler from 'react-reconciler';
const PixiFiber = Reconciler(hostConfig);
```

接下来需要实现Stage作为整个游戏界面的载体，我们认为所有的游戏元素都应该在Stage里呈现，而Stage组件本身输出的是一个Canvas元素而已。只不过我们在Stage组件加载的各个生命周期里，需要调用我们自定义渲染器能力，以Stage所输出的Canvas元素为画布，将各种游戏元素渲染到这张画布上。

自定义渲染器关键的调用节点在`<Stage />`组件的几个重要生命周期中：`componentDidMount`、`componentDidUpdate`、`componentWillUnmount`。

1、当`<Stage />`在`componentDidMount`阶段，调用`PixiFiber.createContainer(PIXI.Application.stage)` 方法创建 React `reconciler` 根节点，将 PixiJS 的舞台作为根节点。这样，PixiJS 的渲染结果就可以与 React Fiber 进行协调，实现将 PixiJS 和 React 结合起来的能力。并通过 `PixiFiber.updateContainer` 方法更新容器内容。值得一提的是Pixi 的 [Scene Graph](https://link.juejin.cn?target=https%3A%2F%2Fpixijs.io%2Fguides%2Fbasics%2Fscene-graph.html "https://pixijs.io/guides/basics/scene-graph.html") 本身就是树结构，非常适合使用 JSX 语法构建。

![image.png](/images/jueJin/497672bdc319e40.png)

2、在`<Stage />`的 `componentDidUpdate` 生命周期方法中，根据传入的属性通过 `PixiFiber.updateContainer` 方法更新容器内容。而在`<Stage />`内部的子元素状态更新时，因为这些子元素已经处于 PixiFiber 创建的容器内了，`<Stage />`作为 React Fiber 的根节点，任何对该容器内子节点的更新都会触发 React Fiber 的 diff 算法进行协调。也就天然支持子元素的自主更新了。换句话说，当舞台（stage）中的子节点发生变化时，PixiFiber 会使用 React Fiber 的协调机制来判断哪些子节点需要更新、添加或删除，并进行相应的操作。这包括比较虚拟 DOM（Virtual DOM）的变化、调度更新任务、执行生命周期方法等。

3、在 `componentWillUnmount` 生命周期方法中，通过 `PixiFiber.updateContainer` 方法清空挂载点里的所有内容，并销毁 PIXI 应用实例。

#### 1.2 丰富的Pixi原子

我们已经知道，有一个`<Stage />`组件来作为主舞台对应`PIXI.Application.stage`，那么如何把一个PIXI元素作以子组件的方式添加到`<Stage />`呢？比如一个基本的精灵图`PIXI.Sprite`。

这里主要需要了解的是`react-reconciler`的参数`HostConfig` 对象，这个对象定义了自定义渲染器的行为。

`hostConfig` 对象的方法包括：

*   `createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle)`: 创建新的节点实例。
*   `finalizeInitialChildren(parentInstance, type, props, rootContainerInstance, hostContext)`: 在创建初始子节点后，完成初始化操作。
*   `prepareUpdate(instance, type, oldProps, newProps, rootContainerInstance, hostContext)`: 在节点更新前，准备更新所需的信息。
*   `commitUpdate(instance, updatePayload, type, oldProps, newProps, internalInstanceHandle)`: 执行节点的更新操作。
*   `appendChild(parentInstance, child): void`: 将子节点添加到父节点中。
*   `insertBefore(parentInstance, child, beforeChild): void`: 在指定子节点之前插入一个新的子节点。
*   `removeChild(parentInstance, child): void`: 从父节点中移除一个子节点。
*   `appendChildToContainer(container, child): void`: 将子节点添加到容器中。
*   `removeChildFromContainer(container, child): void`: 从容器中移除一个子节点。

这些方法的具体实现将取决于自定义的渲染器的需求和特性。`createContainer` 方法将使用你提供的 `hostConfig` 对象来执行相应的操作，并在容器中渲染和更新 React 元素。

再来看我们所抛出来的问题：**如何把一个PIXI元素作以子组件的方式添加到`<Stage />`呢？** 当我们调用`PixiFiber.updateContainer`时，就会对`<Stage />`里所有的子元素进行更新，比如`PIXI.Sprite`就是其中一个子元素，它的JSX表现形式为

```jsx
<Stage>
<Image />
</Stage>
```

当我们的自定义`PixiFiber`调度遍历到`<Image />`时，会执行我们提前设计的`HostConfig` 对象中的`createInstance`,在这个方法里，我可以做想做的任何事情，比如创建一个`PIXI.Sprite`实例并。同样的道理对于树节点的插入、移除、更新都可以利用对应的`HostConfig` 对象属性来进行操作。以下是关键节点的伪实现代码

```js
// 创建一个react虚拟dom树节点对应的pixi元素
    createInstance(type, props, rootContainer) {
    // 创建实例
    const instance = new PIXI.Sprite();
    // 设置实例在关键生命周期和属性应用时所需要执行的方法
    instance._customDidAttach = () => { ... }; // 在被挂载时执行
    instance._customWillDetach = () => { ... }; // 在被卸载时执行
    instance._customApplyProps = () => { ... }; // 将属性设置到Pixi元素上
    // 将props属性添加给Sprite实例
    instance._customApplyProps(props);
    return instance
}
// 在一个父节点中插入子节点
    appendChild(parent, child) {
    parent.addChild(child);
    // 执行子节点被挂载自带方法
    child._customDidAttach.call(child, child, parent);
}
// 在一个父节点中移除子节点
    appendChild(parent, child) {
    parent.removeChild(child);
    // 在被卸载时执行
    child._customWillDetach.call(child, child, parent);
    // 销毁子节点实例
    child.destroy();
}
...

```

如此，我们就可以成功的将一个`PIXI.Sprite`渲染到`Stage`之中。而以上代码只是简单说明了如何将单个`PIXI.Sprite`渲染出来，在实际生产中，我们可能会用到非常多的Pixi元素。所以把这些可能会用到的pixi原生元素都统一封装起来，形成一个elements集合。

![image.png](/images/jueJin/3ff80239c25c9c6.png)  
这样便极大程度丰富了Alice所支持的Pixi原子，而这些原子未来在引擎层可以封装成为更多具备定制能力的组件。

#### 1.3 定制化元素的支持

我们已经知道，在桥接层Alice提供了很多Pixi原生的元素，作为渲染节点。但是在实际生产中，往往我们需要自定义的去扩展一些定制组件，比如需要实现一个可以播放`lottie`素材的动画组件`<LottieSprite />`。那么该组件底层渲染一定也是基于PIXI去实现的，于是我们就需去做以下几个步骤来实现这样一个自定义的组件。（其实这个自定义的组件可以理解为类似于DOM里的`<div />`）

第一步：声明一个类，该类继承于桥接层所提供的原生组件`<Image />`,并且在初始化的时候具备解析lottie素材为纹理的能力。以及可以监听参数变化时触发渲染内容的更新。

第二步：通过工厂函数，输出一个具备完整生命周期的组件，这里就是在上文提到的节点的插入、移除、更新等方法。

第三步：`createInstance`的过程中能够调用这些生命周期函数，从而达到渲染到画布的效果。

为了达到这一目的，我们在桥接层提供了`PixiComponent`这样的一个注册函数（工厂函数），以实现在上层（引擎层）创建自定义元素，可以很好的被底层Pixi所渲染。

#### 1.4 桥接层的扩展性

在桥接层我们可以做很多事情，因为在本方案中，我们使用的React作为DSL技术方案，所以在桥接层我们用了`react-reconciler`作为渲染调度器。如果我们换成Vue的话呢？其实只需要将调度器换成`vue-next`基本就可以转换技术栈。

除此之外，因为我们掌握了虚拟节点树转换为真实渲染节点的完整周期，所以我们可以在周期内赋予一些其他的游戏元素能力，比如物理效果。在元素被挂载时，就可以实例一个`Matter.Engine`实例，并将一个对应的刚体加入`Matter.Composite`。同步刚体的坐标与Pixi元素的坐标，就可以实现一个简单的物理世界效果。

如果有需求，我们甚至可以依然使用这套框架去实现一个基于3d渲染的能力扩展。

### 2、架构分层-引擎层

根据架构图，我们可以发现桥接层的上层是引擎层，这也就意味着引擎层是与应用层更加接近的一层。所以在引擎层，我们增加一些业务能力比如：`基于桥接层封装了更多游戏业务常用的一些组件`、`依赖桥接层提供的自定义原生组件能力扩展了更多动画播控组件`、`基于yoga提供了强大的flex布局能力`、`基于tween.js提供了高效的缓动效果开发能力`以及各种交互事件的转发和`元素之间碰撞检测能力`。这一块内容我们会在本系列的后续文章中详细介绍其实现方案和原理。敬请期待。

### 3、完备的资源管理体系

> 在架构图中，资源管理确实是最顶端的一层。而这一小节的标题，没有带”架构分层“的字眼。

先说一下我们架构图中的资源管理层。在最开始，我们的想法比较直接，在游戏的开发过程中，一般需要使用到大量的图片、动画素材、音频等资源来丰富整个游戏内容，而大量的资源就会带来管理上的困难。因此提供了一套资源管理器来帮助开发者管理其资源的使用。开发者编写游戏时，无需关心资源的预加载、解析、纹理转换等工作。只需要在资源Map文件里声明需要预处理的资源即在项目中随处可用。与此同时，将提供丰富的加载生命周期钩子、资源插入和销毁等API。以及进度条的UI组件。

那么为什么如今我们把它从整个Alice里拿出去了呢？主要考虑到其实这套资源管理模式，不仅仅是在游戏开发中纹理转换场景可以使用。在我们常规的H5活动中，也可以把这套管理体系拿来使用以提高整个界面的流畅度和用户体验的提升。

在本系列后续文章中，会有专门一篇来介绍资源管理的方案和实现。会详细介绍它与目前我们常用的已有资源管理三方包的区别。敬请期待。

五、本篇小结
------

在本文中，我们探讨了Alice游戏引擎的架构设计，并介绍了其分层结构中的关键设计理念和功能。通过桥接层、引擎层和资源管理层的划分，Alice游戏引擎提供了灵活、可扩展的开发环境，满足了游戏开发和应用开发的不同需求。

在桥接层，我们实现了DSL与Pixi渲染能力的结合。这为声明式的游戏场景开发提供的可能性。

在引擎层，我们基于桥接层提供了丰富的业务能力和组件，包括常用游戏组件的封装、动画播放控制、灵活的布局能力以及高效的缓动效果开发能力，为开发者提供了便利和效率。

资源管理层则为开发者提供了一套完备的资源管理体系，简化了资源的加载和管理流程，不仅适用于游戏开发，还可以在其他H5活动中使用，提升界面的流畅度和用户体验。

通过对Alice游戏引擎的架构设计和功能介绍，我们可以看到它为开发者提供了比较高效的游戏场景开发模式，帮助开发者更高效地创建出丰富、流畅的游戏和应用。在后续的文章中，我们将深入探讨每个层级的具体实现方案和原理，

在未来的发展中，我们会推进更多关于Alice游戏引擎的技术探索和创新，以及它在实际项目中的应用案例。通过不断完善和扩展，期望Alice能够形成一整套H5游戏场景解决方案。

参考资料
----

*   Eva.js：[eva-engine.gitee.io](https://link.juejin.cn?target=https%3A%2F%2Feva-engine.gitee.io "https://eva-engine.gitee.io")
*   pixi-react：[github.com/pixijs/pixi…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fpixijs%2Fpixi-react "https://github.com/pixijs/pixi-react")
*   react-konva：[github.com/konvajs/rea…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fkonvajs%2Freact-konva "https://github.com/konvajs/react-konva")
*   详解Canvas优越性能: [zhuanlan.zhihu.com/p/400391575](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F400391575 "https://zhuanlan.zhihu.com/p/400391575")

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！