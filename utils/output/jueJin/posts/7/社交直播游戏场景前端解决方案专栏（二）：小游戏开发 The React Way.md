---
author: ""
title: "社交直播游戏场景前端解决方案专栏（二）：小游戏开发 The React Way"
date: 2023-07-13
description: "本篇中，我们会结合一个实际的案例，来介绍如何通过 Alice，使用 React 的方式高效开发 H5 小游戏。"
tags: ["前端","游戏开发中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读17分钟"
weight: 1
selfDefined:"likes:24,comments:3,collects:20,views:5936,"
---
> 本文作者：小林

前言
--

在系列上一篇文章中，我们介绍了自研 H5 小游戏引擎 Alice.js 的理念与架构设计，以及核心功能的实现。通过结合 React 生态与 WebGL 渲染能力，我们可以让熟悉 React 的开发人员低成本地入门 H5 游戏开发，在复用现有组件资产的同时，提供高性能的游戏画面，实现更复杂的视觉效果。

在本篇中，我们会结合一个实际的案例，来介绍如何通过 Alice，使用 React 的方式高效开发 H5 小游戏。

一、场景构建
------

在游戏开发中，**场景**（Scene）的搭建是十分重要的环节。就像电影中的一个场景一样，游戏场景是一系列游戏元素的集合，表达了游戏世界的一部分内容，也是我们开发时组织游戏内容的中心。

本节我们将借用 [Cocos Creator](https://link.juejin.cn?target=https%3A%2F%2Fdocs.cocos.com%2Fcreator%2Fmanual%2Fzh%2Fgetting-started%2Ffirst-game-2d%2F "https://docs.cocos.com/creator/manual/zh/getting-started/first-game-2d/") 官网的示例，制作一款简单的 2D 平台跳跃类游戏。游戏规则也很简单：

*   开始游戏后，在空中随机生成一定数量的冰块，每两块冰之间可能空 1 格或者不空
*   企鹅一次可以向右跳 1 格或者 2 格
*   企鹅跳到冰块上不会掉下去，跳到空白处就会掉下去
*   跳完全部的格子即游戏通关，中途落下则游戏失败

![小游戏完整预览图](/images/jueJin/f67b41ed37dc736.png)

_▲ 背景图素材来自 [OpenGameArt.org](https://link.juejin.cn?target=https%3A%2F%2Fopengameart.org%2Fcontent%2Ffree-platformer-game-tileset "https://opengameart.org/content/free-platformer-game-tileset")_

### 1.1 用 React 组件组织游戏物件

作为熟悉现代前端框架的前端开发，拿到上面这样的一个页面，首先想到的是什么？没错，组件化！天上的云可以是组件，空中的冰块可以是组件，中间的企鹅也可以是组件，它们共同构成了这样的一个游戏场景。**组件化、可复用**是 React 的核心思想，这在 Alice 引擎中自然也适用。

将上面的场景抽象为组件树后，就是这样的：

![Scene Graph 示意图](/images/jueJin/67941084e9745d2.png)

这样的树状结构也称为**场景图**（Scene Graph）。[场景图](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FScene_graph "https://en.wikipedia.org/wiki/Scene_graph")是一种通用的数据结构，通常用于组织 2D/3D 图形场景中节点的逻辑与空间表示。怎么样，是不是和感觉和我们的前端框架有些共通之处呢？

让我们更进一步，将其拆分为具体的 React 组件。用 JSX 表示出来就是这样的：

```jsx
// 背景图层
const Background = () => (
<View>
<Image src="assets/bg.png" />
<Image src="assets/cloud.png" />
<Image src="assets/tree.png" />
</View>
);

// 我们的主角小企鹅
const PenguinHero = () => (
<Image src="assets/penguin.png" />
);

// 冰块们
const IceBricks = () => (
<View>
{array.map(() => <Image src="assets/brick.png" />)}
</View>
);

// 组合成一个游戏场景
const Scene = () => (
<View>
<Background />
<PenguinHero />
<IceBricks />
</View>
);
```

That's it! 在 Alice 中，创建、组合组件就是这么自然，一切都和你熟悉的一样。

### 1.2 场景渲染与相机控制

一个游戏通常由许多场景构成，比如主菜单是一个场景，游戏界面是一个场景，结算界面也是一个场景。那么在 Alice 中，我们要如何控制游戏场景之间的切换呢？

答案也很简单，React 怎么做，我们就怎么做。你可以 if-else 一把梭：

```jsx
    function Game() {
    const [currentScene, setCurrentScene] = useState(SCENE.MAIN_MENU);
    
    // 游戏场景
        if (currentScene === SCENE.GAMEPLAY) {
        return <Gameplay />;
    }
    
    // 结算界面
        if (currentScene === SCENE.RESULT) {
        return <Result />;
    }
    
    // 主菜单
    return <MainMenu />;
}
```

也可以直接前端路由走起，丰俭由人。因为我们通过 [react-reconciler](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Freact-reconciler "https://www.npmjs.com/package/react-reconciler") 实现了完整的自定义 React renderer（具体可以参考本系列的上一篇专栏），所以我们完全可以复用现有 React 生态中的成熟类库。

用户需要做的就是控制组件，剩下的交给 Alice 引擎完成：

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

    function Game() {
    return (
    <BrowserRouter>
    <Routes>
    <Route path="main-menu" element={<MainMenu />} />
    <Route path="gameplay" element={<Gameplay />} />
    <Route path="result" element={<Result />} />
    </Routes>
    </BrowserRouter>
    )
}
```

除了场景的构建，在游戏中，相机控制也是一个重要的步骤。游戏中的「相机」概念类似于现实世界中的相机，主要用于捕捉场景画面，控制场景的呈现，如可视范围、投影、缩放等。

![场景相机示意图](/images/jueJin/34d8737704b4c28.png)

在 Alice 中，相机默认捕捉整个 Stage。不过这里我们需要让相机随着角色跳跃自动向前移动，也就是实现横向卷轴效果。步骤也很简单，将整个游戏场景都包裹在 `<CameraView />` 中，并指定要跟随的元素即可：

```jsx
<CameraView follow={penguinRef}>
{/* 不管整个场景有多大，我们的企鹅始终都固定在屏幕中间 */}
<Box ref={penguinRef} style={{ position: 'absolute' }}>
<Image src={resources.penguin} />
</Box>
{/* 剩下的地图场景组件…… */}
<Map />
</CameraView>
```

这里的底层原理是监听目标元素的位置变化，将其位移的相对量补偿到整个场景的容器上，即可实现跟随效果。同时配合剔除（Culling）技术，避免屏幕外不可见的对象浪费渲染与计算资源。这样我们就可以制作出比屏幕尺寸大得多的游戏场景，并让角色在其中自由行动。

### 1.3 结合原生 DOM 编写 UI

在游戏开发中，除了游戏场景、角色、动画这类频繁更新的元素之外，还有相对静态的 UI（用户界面）元素，它们共同构成了一个完整的游戏。UI 承载了游戏状态信息的展示，以及接受用户交互的功能，相关的元素包括标签、按钮、滑块、菜单、文本框等。

其中部分 UI 是静态的，或者很少更新，比如 HUD、跳转按钮、公告、设置页面等。如果是传统游戏引擎，我们可能需要使用引擎提供的 UI 组件将这些界面画出来，比较繁琐。既然我们选择了依托于 React 框架去开发游戏，那是否意味着我们也可以直接使用原生 React DOM 来编写这些 UI 呢？

答案是肯定的！Alice 支持 canvas 元素和 DOM 元素的混合开发，结合前者的高性能与后者开发速度快的优点。在开发中还可以直接复用现有的 React 组件库，编写 UI 高效快捷。

```html
<div id="root">
<!-- HUD 叠加在游戏场景的上层 -->
<div className="hud-wrapper">
<p>Write any HTML here</p>
</div>
<!-- 我是分割线，下面就是 canvas -->
<Stage className="game-wrapper">
<Image src="xxx">
<Text>Inside game we are canvas elements!</Text>
</Stage>
</div>
```

但需要注意，由于渲染顺序的限制，DOM 元素只能出现在 canvas 的上层。

![Canvas 与 DOM 混合开发示意图](/images/jueJin/06e9a063cd86f28.png)

二、节点元素
------

在 Alice 引擎中，**元素**（Element）是游戏场景的基本组成单元，这一点和 HTML 类似。

在场景中，所有物件都由元素组成，其中包括容器、图片、文字、图形等基础元素，以及帧动画、Lottie、视频、骨骼动画等动效元素。所有元素组成了树状的 Scene Graph。

### 2.1 基础元素

在 Alice 中，基础元素包括：

*   基础容器 `Box`
*   Flex 容器 `View`
*   图片 `Image`（支持精灵图集 Spritesheet）
*   文本 `Text`
*   图形 `Graphics`
*   遮罩 `Mask`
*   点九图 `NinePatch`

使用这些元素构建游戏界面就像编写传统 React 应用一样符合直觉：

![代码与场景对比示意图](/images/jueJin/88c7d85eb031807.png)

因为这些元素都是规范的 React 组件，循环渲染、条件渲染等功能自然也不在话下：

```jsx
{/* 放置一排冰块 */}
{map.map((isBrick, index) => (
<Image
key={index}
src={isBrick ? resources.brick : Texture.EMPTY}
    style={{
    position: 'absolute',
    top: 25,
    left: -35 + index * BOX_WIDTH,
    width: 76,
    height: 67,
    }} />
))}
```

### 2.2 动效元素

动效是游戏体验中十分核心的一环，适当的动效可以为游戏增色不少。Alice 目前支持添加以下格式的动效：

*   序列帧动画 `FrameAni` & `Apng`
*   Lottie 动画 `Lottie`
*   普通视频 `Video`
*   透明视频 `AlphaVideo`
*   骨骼动画 `Spine` & `DragonBones`
*   基于关键帧的过渡动画

用户可以根据需要，选择不同的动效格式。各种格式的对比大致可以参考下表：

序列帧

Apng

Lottie

普通视频

AlphaVideo

骨骼动画

过渡动画

视觉还原度

高

高

高

中: 不支持透明通道

高

高

低: 开发实现

资源文件大小

中: 不适合大尺寸动图

大: 压缩比不高

小

中: 看码率

中

小

很小

JS 体积

小

中: 需要引入解码模块

很大: 需要引入播放库

很小

小

大

小

内存占用

小

大: 需要额外存储解码帧

中

小

小

中

很小

渲染性能

很高

低

中

高

高

中

很高

内容动态替换

否

否

是

否

否

是: 非常灵活

是

兼容性

好

差: 低端机可能内存不足

好: 取决于播放库

好

中 \*WebGL

好

很好

在本系列的后续文章中，我们会介绍是如何将这些动效接入 Alice 引擎的。从我们团队的实践经验来看，在使用了 Spritesheet 格式的情况下，序列帧解析简单、实现方便、渲染性能好。在动效较短时，推荐使用序列帧作为首选动效格式（可以使用 TexturePacker 或者 Free Texture Packer 等工具生成）。

这里我们使用一个动态的企鹅动画，替换掉之前的静态图：

```diff
-<Image
-  src="assets/penguin.png"
+<FrameAni
+  src="assets/penguin-spritesheet.json"
+  ref={aniRef}
+  loop
+  autoplay
+  onComplete={() => console.log('播放完成')}
    style={{
    scale: 0.5,
    anchor: 0.5,
    }} />
    
    +aniRef.current.play()
    +aniRef.current.stop()
    +aniRef.current.currentFrame
    +aniRef.current.totalFrames
```

三、属性与变换
-------

现在，我们已经可以通过类似 HTML 的语法组织游戏元素了。那么你可能会想，既然如此，那能不能用类似 CSS 的语法来控制这些元素的样式呢？

可以！Alice 支持了大部分的基础 CSS 样式和关键帧动画，甚至提供了基于 Flexbox 的动态布局能力。

### 2.1 CSS 样式转换

要实现使用 CSS 编写样式，其核心就是将 CSS 的语法转换为底层的 PixiJS 对应属性。比如：

*   `font-size` -> `PIXI.Text#style.fontSize`
*   `height` -> `PIXI.Sprite#height`
*   `left` -> `PIXI.DisplayObject#position.x`
*   `opacity` -> `PIXI.DisplayObject#alpha`
*   `background-color` -> `PIXI.Sprite#tint`

为此，我们编写了专门的样式转换器，用户可以使用类似 React Native 的语法直接书写大部分的 CSS，无需额外的学习成本。

```jsx
<Text
    style={{
    fontFamily: "Chalkboard, 'Comic Sans MS', sans-serif",
    // 以下几种写法等价
    // color: 0xf0f8ff,
    // color: '#f0f8ff',
    // color: 'rgb(240, 248, 255)',
    // color: 'hsl(208, 100%, 97%)',
    color: 'aliceblue',
    fontSize: 30,
    fontWeight: 'bold',
    fontStyle: 'italic',
    }}>
    Will be rendered with Canvas2D internally
    </Text>
```

### 2.2 Flex 布局系统

在传统小游戏引擎中，元素的排布一般使用绝对定位（写死宽度、高度、XY 坐标），或者支持有限的自动布局。既然我们样式属性已经可以用 CSS 来写了，那么元素布局是不是也能用 CSS 的 [Flexbox 弹性布局](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FLearn%2FCSS%2FCSS_layout%2FFlexbox "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox")那一套呢？

可以！Alice 底层接入了 React Native 所使用的跨平台高性能 Flex 布局引擎，即 [Yoga Layout](https://link.juejin.cn?target=https%3A%2F%2Fyogalayout.com%2F "https://yogalayout.com/")，并集成在框架中作为可选功能提供。Yoga 引擎提供了完善的 Flex 布局功能，支持 WebAssembly，以及在旧版本浏览器上回退到纯 JS 版本。配合 `justifyContent`、`alignItems` 等 CSS 语法，几乎可以完美再现传统 React 应用的开发体验。

```jsx
<View
name="OuterView"
    style={{
    width: 500,
    height: 500,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 50,
    }}>
    <View
    name="ProfileCard"
        style={{
        width: 300,
        height: 80,
        marginBottom: 30,
        flexDirection: 'row',
        }}>
        <View
            style={{
            width: 80,
            height: 80,
            backgroundImage: 'assets/avatar.png',
            }} />
            <View
                style={{
                justifyContent: 'space-around',
                padding: '10 0 10',
                marginLeft: 20,
                }}>
                <Text style={{ fontSize: 20, color: '#0f172a' }}>
                Lorem Ipsum
                </Text>
                <Text style={{ fontSize: 16, color: '#64748b' }}>
                Alice in Wonderland
                </Text>
                </View>
                </View>
                <View name="Content" style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                {Array(14).fill(0).map((_, index) => (
                <Image
            key={index}
        style={{ width: 60, height: 60, margin: 10 }}
        src="assets/marshmallow.png" />
    ))}
    </View>
    </View>
```

![Flex 布局效果图](/images/jueJin/444ee5548402659.png)

_▲ 以上所有元素都渲染在 canvas 中。图片素材来自 [eiyoushi-hutaba.com](https://link.juejin.cn?target=https%3A%2F%2Feiyoushi-hutaba.com%2F%3Fp%3D2520 "https://eiyoushi-hutaba.com/?p=2520")_

![布局系统原理](/images/jueJin/83dfcc5be5a268f.png)

在这里，我们通过为每一个 Flex 子元素创建伴生的 Yoga 节点的方式，构造了一棵与组件树同构的布局树。当组件的布局属性发生修改（大小、位置、排列方式等）或者有节点增删时，就可以从布局树中计算出对应节点的布局信息。在本系列后续文章中，我们会另花篇幅介绍如何接入 Flex 布局引擎，并将其与 React、PixiJS 融合，敬请期待。

### 2.3 关键帧动画

说到属性与变换，自然绕不过关键帧动画这一概念。简单来说，关键帧动画就是在一组给定的「关键帧」之间（定义了时间点与属性值），对属性值的变化做插值和过渡处理。比如说这样的一个动画：

*   keyframe\[0\]: 0ms, x: 0, y: 120
*   keyframe\[1\]: 20ms, x: 0, y: 40
*   keyframe\[2\]: 40ms, x: 0, y: 120

就代表这个元素在 0～20ms 的区间内，y 值从 120 过渡到 40；在 20～40ms 的区间内，y 值从 40 过渡到 120。也就是说，这个元素原地蹦跶了一下。如果没有关键帧之间的插值和过渡，那么你看到的可能是这个元素突然闪现到了上面，又突然闪现了回来。而有了过渡帧，这个过程就是平滑的。

![属性变化曲线示意图](/images/jueJin/73b28280fd6dca9.png)

除了上文介绍的动效元素之外，关键帧动画也是常用的游戏动效形式之一。因为关键帧动画是直接根据缓动函数修改某时间点对应的属性值，可以说它有着所有动效中最好的性能（不过这也意味着它只能用于实现一些较为简单的动画）。在 Alice 中，我们可以通过类似 CSS3 `@keyframe` 的形式定义关键帧动画：

```js
    const { play } = useAliceTransition(penguinRef, {
        jump: {
            0: {
            position: [0, 120],
            rotation: 0,
            tween: 'linear',
            },
                300: {
                position: [40, 40],
                rotation: 180,
                tween: 'linear',
                },
                    600: {
                    position: [80, 120],
                    rotation: 360
                    },
                    },
                    });
                    
                    // 类比 CSS 代码：
                        // @keyframes jump {
                    //   0% { transform: rotate(0deg) translate(0, 120); }
                //   50% { transform: rotate(180deg) translate(40, 40); }
            //   100% { transform: rotate(360deg) translate(80, 120); }
        // }
            // .penguin {
            //   animation-name: jump;
            //   animation-timing-function: linear;
            //   animation-duration: 600ms;
        // }
```

随后，在用户点击屏幕时触发播放定义好的关键帧动画即可：

```jsx
onClick={() => play('jump')}
```

过渡动画也支持传入自定义参数，这里我们定义企鹅跳一步和跳两步的动画方法：

```js
const { play } = useAliceTransition(
penguinRef,
    {
    // 允许传入自定义参数，跳一步和跳两步的距离、高度不同
        jump: ({ currentX, targetX, jumpHeight }) => ({
            0: {
            position: [currentX, 0],
            tween: 'linear',
            },
                300: {
                position: [(currentX + targetX) / 2, -jumpHeight],
                tween: 'linear',
                },
                    600: {
                    position: [targetX, 0],
                    },
                    }),
                    // 可以同时播放多个动画，当跳两步的时候就让企鹅旋转跳跃闭着眼～
                        rotate: {
                        0: { rotation: 0 },
                        500: { rotation: 360 },
                        },
                        },
                            (name, args) => {
                            // 动画结束后的回调，在这里可以判断企鹅有没有掉下去
                                if (name === 'jump') {
                                onJumpEnd(args.jumpSteps);
                            }
                        }
                        );
                        
                        // 跳一步（第二个参数是播放次数）
                            play('jump', 1, {
                            jumpSteps: 1,
                            jumpHeight: 40,
                            currentX: penguin.position.x,
                            targetX: penguin.position.x + BOX_WIDTH,
                            });
                            
                            // 跳两步
                            play('rotate');
                                play('jump', 1, {
                                jumpSteps: 2,
                                jumpHeight: 60,
                                currentX: penguin.position.x,
                                targetX: penguin.position.x + BOX_WIDTH * 2,
                                });
```

另外，除了事先定义好的关键帧，Alice 也支持通过 `tween()` 缓动函数直接运动指定的元素。比如说，当缓动的属性与时间值经常变化时，使用缓动函数会更加灵活。上述两种方法主要是写法上的差异，在功能上是一致的。

这里我们定义企鹅踩空后掉下去的动画方法：

```js
// 企鹅掉出屏幕外，游戏结束
    const fallToGround = useCallback((cb) => {
    const penguin = penguinRef.current;
    
    // 内部是 tween.js 的简单封装，在 500ms 内将 y 从原始位置运动到屏幕外
    tween({ y: penguin.position.y })
    .to({ y: 250 }, 500)
    .easing(TweenEasing.Cubic.In) // 加速度
    .onUpdate((obj) => { penguin.position.y = obj.y; })
    .onComplete(cb)
    .start();
    }, []);
```

四、脚本与事件
-------

游戏场景搭建得差不多了，现在我们需要让角色动起来，这就涉及到脚本与交互事件的处理。

脚本是游戏引擎中不可缺少的一部分，它的主要用途是响应玩家的输入，并做出对应的处理，如控制场景中游戏对象的行为。或者通过注册特定的回调函数，来创建、更新、销毁元素等。比如玩家点击屏幕，企鹅需要向前跳动一格，这里的操作就是由脚本完成的。

在 Alice 中，我们没有设计独立的「脚本」类型，而是将其融入了 JavaScript 与 React Hooks 中。比如我们希望在玩家点击左侧屏幕时，企鹅跳 1 步，点击右侧屏幕时，企鹅跳 2 步：

```jsx
    const Scene = () => {
    // 游戏分数
    const [score, setScore] = useState(0);
    
    // 游戏结果
    const [gameResult, setGameResult] = useState('ready');
    
    // 保存位置状态
    const [currentPos, setCurrentPos] = useState(0);
    
    // 当前游戏的地图信息，true 表示有冰块，false 表示空气
    const [map, setMap] = useState([]);
    
    // 游戏重新开始后，重置分数和位置，生成新的随机地图
        useEffect(() => {
        resetGame();
        }, [resetGame]);
        
        // 跳跃和旋转的动效
        const { play } = useAliceTransition(/* ... */);
        
        // 企鹅跳方法
            const jump = useCallback((steps) => {
                if (gameResult !== 'playing') {
                return;
            }
            
            const penguin = penguinRef.current;
            if (!penguin) return;
            
            // 上锁，防止连点
            if (lockRef.current) return;
            lockRef.current = true;
            
            // 跳一步和跳两步的动画参数不一样
                if (steps === 1) {
                play('jump', 1, { /* ... */ });
                    } else {
                    play('rotate');
                    play('jump', 1, { /* ... */ });
                }
                }, [gameResult, play]);
                
                return (
                <React.Fragment>
            {/* 游戏场景略 */}
            <CameraView />
        {/* 触控区域，一层透明的热区盖在最上层 */}
        <View name="TouchPanel">
        <View onClick={() => jump(1)} />
        <View onClick={() => jump(2)} />
        </View>
        </React.Fragment>
        );
        };
```

Alice 支持 `click`、`pointerup`、`pointerdown`、`pointermove` 等用户输入事件，事件的监听也和 React 一样简单。跳跃结束后，还需要判断当前游戏是否结束，也就是企鹅是不是掉下去了或者跳完了所有方块：

```js
    const onJumpEnd = useCallback((steps) => {
    // 找到跳到的格子
    const targetBlock = map[currentPos + steps];
    setCurrentPos(s => s + steps);
    lockRef.current = false;
    
    // 是否跳完全部的格子
        if (currentPos + steps >= map.length) {
        setGameResult('win'); // 这会触发 DOM 层的弹窗展示
        setScore(s => s + steps);
        return;
    }
    
    // 掉下去了
        if (!targetBlock) {
            fallToGround(() => {
            setGameResult('lose');
            });
            return;
        }
        
        // 没跳完也没掉下去，更新游戏分数
        setScore(s => s + steps);
        }, [map, currentPos, setCurrentPos, setScore, setGameResult, fallToGround]);
```

如果希望在多个组件之间复用这些「游戏脚本」，同样可以遵循 **The React Way** —— 封装成 Hooks/HoC。在传统游戏引擎中，我们使用可复用的脚本组件为实体添加交互等能力，在 Alice 中我们则是通过 Hooks/HoC 为组件添加能力，他们底层的逻辑其实是类似的，composition over inheritance。

加上跳跃后的效果如下（GIF 动图）：

![跳跃演示 GIF](/images/jueJin/8e8e04c262fbf28.png)

五、调试
----

任何软件的开发都离不开调试，游戏自然也是一样。因为我们的渲染层基于 PixiJS 与 WebGL，可以使用现有的工具构建我们的调试流程。

*   浏览器 DevTools
*   React DevTools
*   [pixi-inspector](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fbfanger%2Fpixi-inspector "https://github.com/bfanger/pixi-inspector")
*   [Spector.js](https://link.juejin.cn?target=https%3A%2F%2Fspector.babylonjs.com%2F "https://spector.babylonjs.com/")

Alice 实现了 React custom renderer，因此可以直接使用 React DevTools 查看组件树、状态等调试信息。配合 pixi-inspector，可以很方便地查看当前场景下的所有底层元素和层级关系，快速检查和修改物件的属性值：

![pixi-inspector 调试示意图](/images/jueJin/b9ccf4305475d12.png)

Spector.js 可以分析当前 canvas 在渲染一帧中发起的所有 WebGL 指令、用到的顶点着色器与片元着色器、纹理、Draw Call 的次数与调用参数等。WebGL 程序的渲染性能与 Draw Call 息息相关，所以这个工具在做性能优化时非常好用：

![Spector.js 调试示意图](/images/jueJin/8311c754ad5d346.png)

结语
--

到这里，我们的平台跳跃小游戏就基本成型了，是不是感觉和传统的 React 开发其实并没有特别大的区别呢？

而且因为我们的渲染基于高性能的 canvas 与 WebGL，可以实现很多传统 DOM 难以实现的效果。比如将企鹅跳跃动画换成骨骼动画、纸娃娃换肤系统、添加粒子效果、蒙皮和网格等等，甚至是渲染超级大的地图（demo 来自 [gl-tiled](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fenglercj%2Fgl-tiled "https://github.com/englercj/gl-tiled")）：

![tilemap](/images/jueJin/3e344f5d3f62892.png)

同时，Alice 基于 React 也带来了这些好处：

*   团队学习成本低，上手无需学习新技术新语法
*   存量项目快速接入、渐进式接入，试错成本低
*   复用已有的 H5 打包构建流程，无需额外流水线
*   可复用团队现有的 React 组件库等资产
*   etc.

当然用 React 写游戏肯定也不是所有东西都和以前一样，还是有一些需要额外注意的地方。比如 React 状态的使用，众所周知在 React 中状态的更新会导致组件重渲染，引发 Fiber Tree 的更新（render/commit phase），以及 side-effects 副作用的执行。然而在一个每秒都要更新 60 甚至更多次的游戏中，为了减少不必要的性能开销，过于频繁的组件重渲染是应该避免的。例如，更新频率高的属性可以考虑使用 ref 保存，或者使用 [zustand](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fpmndrs%2Fzustand "https://github.com/pmndrs/zustand") 等支持 Transient updates 的状态解决方案。

篇幅有限，这里其实还有很多相关的内容没有讨论，比如：性能优化、资源管理与预加载、场景分包、渲染性能优化、降级渲染，等等。这些问题我们会尝试在本系列的后续文章中继续探讨。

总体来说，Alice 游戏引擎通过结合 React 理念与基于 WebGL 的高性能渲染管道，提供了丰富的游戏开发元素、熟悉的使用方法与心智模型，可以应对我们在直播游戏化趋势中遇到的绝大部分中小型 H5 游戏开发需求。

目前，Alice 已经在云音乐社交直播团队的多个项目中落地。在未来，我们会持续探索 React + WebGL 游戏开发的可能性，优化框架的功能性与易用性，希望为 H5 游戏开发的场景提供新的思考与实践。

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！