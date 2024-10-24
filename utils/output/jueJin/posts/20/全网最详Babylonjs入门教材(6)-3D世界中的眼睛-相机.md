---
author: ""
title: "全网最详Babylonjs入门教材(6)-3D世界中的眼睛-相机"
date: 2024-10-11
description: "在现实世界中，视觉是我们感知这个世界其中的一个纬度。在 3D 世界中也是一样的，一个场景可能会很大，会有很多模型，而在屏幕上该显示什么肯定也是有一双眼睛“看着”才行，这双眼睛就是相机（Camera）。"
tags: ["JavaScript","前端","three.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读18分钟"
weight: 1
selfDefined:"likes:7,comments:6,collects:9,views:219,"
---
> Q：Babylon.js是什么？🤔️

[Babylon.js](https://link.juejin.cn?target=https%3A%2F%2Fdoc.babylonjs.com%2F "https://doc.babylonjs.com/") 是一个强大的、开源的、基于 `WebGL`和 `WebGPU`的 `3D`引擎，用于在网页上创建和渲染 `3D`图形。它提供了一套丰富的 `API`和功能，包括物理引擎、粒子系统、骨骼动画、碰撞检测、光照和阴影等，可以帮助开发者快速创建复杂的 `3D`场景和交互。

> Q：我为什么要写该系列的教材? 🤔️

因为公司业务的需要因而要在项目中使用到 `Babylon.js`，虽然官方的文档看起来覆盖面都挺全，且 [playgroud](https://link.juejin.cn?target=https%3A%2F%2Fplayground.babylonjs.com%2F "https://playground.babylonjs.com/") 上的案例也都比较多，但一些具体的 API 或者功能属性也都没有特别多详细的介绍，包括很多使用方式的很多坑都得自己去源码中或者[论坛上](https://link.juejin.cn?target=https%3A%2F%2Fforum.babylonjs.com%2F "https://forum.babylonjs.com/")找。在将其琢磨完之后, 决定写一系列关于它的教材来帮助更多 `babylon.js`的使用者或者是期于学习 `Web 3D`的开发者。同时也是自己对其的一种巩固。

3D世界中的眼睛
--------

在现实世界中，视觉是我们感知这个世界其中的一个纬度。一个房间的桌子上放了一台电脑，你必须睁着眼对着它，才能看到它的存在。在 3D 世界中也是一样的，一个场景可能会很大，会有很多模型，而在屏幕上该显示什么肯定也是有一双眼睛“看着”才行，这双眼睛就是相机（Camera）。

Babylon.js 中主要有以下几个种类的相机：

*   通用相机 `UniversalCamera`
*   弧形旋转相机 `ArcRotateCamera`
*   跟随相机 `FollowCamera`
*   飞行相机 `FlyCamera`
*   自由相机 `FreeCamera`(官方推荐使用 `UniveralCamera`代替)

以上相机类的类图关系如下：

![](/images/jueJin/e554dc7c2b644fc.png)

通用相机 Universal Camera
---------------------

先来看第一个通用相机，相信大家应该都玩过`CS`，`CF`这种第一人称射击游戏，那么通用相机的视角就类似于那样。它支持所有键盘、鼠标、触摸和游戏手柄操作，并且它作为第一人称射击游戏的首选相机，已经被官方推荐取代了早期的 `FreeCamera`自由相机。

`UniversalCamera` 类的初始化定义：

```typescript
/**
* 通用相机
* @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#universal-camera
* @param name 定义相机在场景中的名称
* @param position 定义相机在场景中的起始位置
* @param scene 定义相机所属的场景
*/
constructor
name: string,
position: Vector3,
scene?: Scene
) {}
```

### UniversalCamera 的基础案例

步骤：

*   创建一个名为 `"camera1"`的 `UniversalCamera` 对象。相机的初始位置设置为 `(0, 5, -10)`
*   将相机的目标设置为 `(0, 0, 0)`，即场景的原点，这意味着相机将会朝向场景的原点
*   然后通过 `attachControl(true)` 来启用相机的控制，使其能够响应用户输入（如键盘、鼠标、触摸等）

```typescript
// 创建相机
var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
// 设置目标为原点
camera.setTarget(BABYLON.Vector3.Zero());
// 开启用户的输入控制
camera.attachControl(true);
// 启用鼠标滚轮
camera.inputs.addMouseWheel();

// 以下为创建场景中的其它物体，方便做对比
var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 0.7;

var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
sphere.position.y = 1;

var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
```

官方在线地址：[playground.babylonjs.com/#DWPQ9R](https://link.juejin.cn?target=https%3A%2F%2Fplayground.babylonjs.com%2F%23DWPQ9R%231 "https://playground.babylonjs.com/#DWPQ9R#1")

效果如下：

![](/images/jueJin/e6bd74214da1405.png)

可以通过鼠标滚轮控制相机前进后退，或者通过键盘的上下左右键控制前后左右。

### attachControl()

默认情况下，相机创建后是不具备可操控(交互功能的)，需要通过调用 `attachControl()` 方法将相机与用户输入设备（如键盘、鼠标、触摸屏等）关联起来，使相机能够响应这些输入设备的操作。

具体的交互方式有：

*   键盘事件：用于移动相机（如前进、后退、左移、右移等）。
*   鼠标事件：用于旋转相机视角（如上下左右旋转）。
*   触摸事件：用于在触摸屏设备上控制相机。
*   游戏手柄事件：用于通过游戏手柄控制相机。

在 Babylon.js 的源码中，`acttachControl` 通过重载提供了多种调用方式，以便兼容不同版本的调用。

**示例 1：基本用法，将相机控制绑定到HTML元素**

```typescript
// 创建一个 FreeCamera 对象
var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

// 将相机控制绑定到画布元素
camera.attachControl(canvas);
```

传入 `canvas`的作用：

*   获取用户输入：绑定到 `<canvas>` 元素后，Babylon.js 可以监听该元素上的用户输入事件（如鼠标移动、点击、滚轮滚动、键盘按键等），从而控制相机的移动和旋转。
*   限制输入范围：只在指定的 `<canvas>` 元素上监听输入事件，避免干扰页面上其他元素的交互。
*   提高性能：通过只监听特定元素上的事件，可以减少不必要的事件处理，提高性能。

当然，这个参数也并非必须的，即使不传入任何参数，`attachControl`方法也会自动获取默认的 `canvas` 元素（即 `engine`初始化的 `canvas`）并绑定输入事件，从而使相机可以被控制。

**示例 2：自定义 noPreventDefault 参数**

```typescript
// 创建一个 FreeCamera 对象
var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

// 将相机控制绑定到画布元素，并设置 noPreventDefault 参数
camera.attachControl(false);
```

另一种用法是传入一个 `Boolean` 值，它是用来控制是否阻止默认的浏览器行为。类似于我们 DOM 中的 `event.preventDefault()`。

这个参数默认是 `false`，默认情况下会阻止默认的浏览器行为。

### setTarget()

`setTarget` 方法用于设置相机的目标点，使相机朝向该目标点。这个方法在 3D 场景中非常有用，特别是在需要固定视角或跟踪特定对象时。

参数为：`Vector3`, 表示相机要朝向的目标点的坐标。

**使用场景一：固定视角**

```typescript
// 创建一个 UniversalCamera 对象
var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

// 设置相机的目标为场景的原点
camera.setTarget(BABYLON.Vector3.Zero());
```

相机的位置设置为`(0, 5, -10)`，并且相机的目标设置为场景的原点`(0, 0, 0)`。

**使用场景二：跟踪移动对象**

```typescript
// 创建一个 UniversalCamera 对象
var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

// 创建一个移动的对象
var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene);

// 在每帧更新中设置相机的目标为移动对象的位置
    scene.registerBeforeRender(() => {
    camera.setTarget(sphere.position);
    });
```

创建了一个相机和一个移动的球体。在每帧更新中，相机的目标设置为球体的位置，这样相机将始终跟踪球体的移动。

**使用场景三：用户控制视角**

```typescript
// 创建一个 UniversalCamera 对象
var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

// 监听鼠标移动事件，动态调整相机的目标
    canvas.addEventListener("mousemove", (event) => {
    var pickResult = scene.pick(scene.pointerX, scene.pointerY);
        if (pickResult.hit) {
        camera.setTarget(pickResult.pickedPoint);
    }
    });
```

在这个示例中，监听鼠标移动事件，并根据鼠标指向的位置动态调整相机的目标。这样，用户可以通过移动鼠标来控制相机的视角。

### camera.inputs.addMouseWheel()

这个方法用于将鼠标滚轮输入添加到相机的输入控制中。这意味着当用户滚动鼠标滚轮时，相机会响应这些输入，通常用于缩放或移动相机视角。

弧形旋转相机 ArcRotateCamera
----------------------

第二种非常常用的相机类型是 `ArcRotateCamera`，它特别适用于需要围绕目标对象进行旋转、缩放和平移的场景。同时也提供了直观的控制方式，用户可以通过鼠标或触摸手势轻松操作相机视角。

例如我们的场景是要围绕某个目标对象进行交互，就很适合使用它。

`ArcRotateCamera`类的初始化定义：

```typescript
/**
* @param name定义摄像机的名称
* @param alpha定义相机沿纵轴旋转
* @param beta定义相机沿纬度轴旋转
* @param radius定义相机到目标的距离
* @param target定义相机目标
* @param scene定义相机所属的场景
* @param setActiveOnSceneIfNoneActive定义摄像机是否应该被标记为活动，如果没有其他活动摄像机已被定义
*/
constructor(
name: string,
alpha: number,
beta: number,
radius: number,
target: Vector3,
scene?: Scene,
setActiveOnSceneIfNoneActive = true
) {}
```

可以看到它的参数会比较多哈，也说明了它可以实现很多丰富的交互。

### ArcRotateCamera 的基础案例

先来看一下基本使用：

步骤：

*   创建一个名为 `"Camera"`的弧形旋转相机，并设置 alpha 为0，beta为0，radius为0，目标点为原点`(0, 0, 0)`
*   然后通过 `attachControl(true)`来启用相机的控制，使其能够响应用户输入（如键盘、鼠标、触摸等）

```typescript
// 创建弧度旋转相机
var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
camera.attachControl();

// 创建灯光、球、地板
var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
sphere.position.y = 1;
var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
```

效果如下：

![](/images/jueJin/32010ae89e33460.png)

可以通过键盘的上下左右，鼠标滚轮前后，来控制观察目标点不同的视角。（上面动图中看到的地板和球在旋转的现象其实不是它们本身在旋转，而是相机在绕着它们旋转）

官方也有一个案例：[playground.babylonjs.com/#SRZRWV#839](https://link.juejin.cn?target=https%3A%2F%2Fplayground.babylonjs.com%2F%23SRZRWV%23839 "https://playground.babylonjs.com/#SRZRWV#839") 可以查看一下，只不过目标对象不是球和地板，而是换成了不同颜色的面片，但是效果是一样的。

### alpha、bate、radius

前面提到了弧度旋转相机就是**围绕目标对象进行旋转、缩放和平移，** 那么相机围绕对象怎么旋转，旋转多少度，距离对象多远，这些就是靠 `alpha、bate、radius`这三个核心参数来控制的了。

官网上一张非常经典的图可以来说明它们的作用：

![](/images/jueJin/510e4c4b7d084a0.png)

#### alpha

`alpha` 表示绕着纵轴旋转，单位是弧度。它决定了相机在水平面上的位置。

*   范围：通常在 `0` 到 `2 * Math.PI` 之间。
*   效果：改变 `alpha` 值会使相机绕目标点水平旋转。例如，`alpha = 0` 时相机位于目标点的正前方，`alpha = Math.PI / 2` 时相机位于目标点的右侧。

![](/images/jueJin/eba989c027f0485.png)

来看一个案例：案例中模拟了一个白色的相机，绕着纵轴旋转。其中固定 `beta` 和 `radius`，改变 `alpha` 的值，效果如下。

![](/images/jueJin/89103d1b09034a7.png)

(以上案例为官网案例：[playground.babylonjs.com/#GB1AW7#21](https://link.juejin.cn?target=https%3A%2F%2Fplayground.babylonjs.com%2F%23GB1AW7%2321 "https://playground.babylonjs.com/#GB1AW7#21"))

**alpha 的操作:**

关于 `alpha` 的操作，在设置了 `camera.attachControl()` 的情况下，按键盘左右即可改变 `alpha` 的值。

#### beta

而 `beta` 表示绕着纬轴旋转，单位也是弧度。

它决定了相机在垂直面上的位置。

*   范围：通常在 `0` 到 `Math.PI`之间。
*   效果：改变 `beta` 值会使相机绕目标点垂直旋转。例如，`beta = 0` 时相机位于目标点的正上方，`beta = Math.PI / 2` 时相机位于目标点的水平位置，`beta = Math.PI`时相机位于目标点的正下方。

来看一个案例：固定 `alpha` 和 `radius`，改变 `beta` 的值，效果如下。

![](/images/jueJin/9ac4bf28a76842b.png)

**beta 的操作:**

在设置了 `camera.attachControl()` 的情况下，按键盘上下即可改变 `beta` 的值。

**记忆技巧：横纬竖经，beta绕着纬轴，alpha绕着纵轴。**

* * *

#### radius

再就是 `radius` 了，表示相机到 `target` 的距离，它决定的是相机离目标点的远近。

*   范围：可以是任意正数。
*   效果：改变 `radius` 值会使相机在目标点周围缩放。例如，较小的 `radius` 值会使相机靠近目标点，较大的 `radius`值会使相机远离目标点。

和 `UniversalCamera` 不同的是，操控 `ArcRotateCamera` 时，键盘的上下改变的是 `alpha` 的值，而鼠标滚轮或者 `Mac` 触控板的双指滑动才是改变 `radius` 的值。并且也不需要像 `UniversalCamera` 设置`universalCamera.inputs.addMouseWheel()`来开启鼠标滚轮的功能，只设置 `arcRotateCamera.attachControl()` 即可开启键盘左右、鼠标滚轮功能。

如下演示的是，通过鼠标滚轮控制相机离目标点的远近：

![](/images/jueJin/ef52d35e2d1a46e.png)

无论是 `alpha`、`beta`还是 `radius`，其实在一定程度上改变的都是相机的位置(`position`)，这其实也是好理解的。

### 限制相机旋转缩放的一些属性

除了上述可以控制旋转缩放的属性，还有一些属性可以限制选择缩放的最大最小值。

例如针对 `alpha`，有：

*   `lowerAlphaLimit` 和 `upperAlphaLimit`：限制 `alpha` 角度的最小值和最大值，控制相机在水平面上的旋转范围。单位也是弧度。

针对 `beta`，有：

*   `lowerBetaLimit` 和 `upperBetaLimit`：限制 `beta` 角度的最小值和最大值，控制相机在垂直面上的旋转范围。

针对 radius，有：

*   `lowerRadiusLimit` 和 `upperRadiusLimit`：限制相机与目标点之间的最小和最大距离，控制相机的缩放范围。

举例：

```typescript
// 设置相机限制
camera.lowerAlphaLimit = 0; // 最小 alpha 角度
camera.upperAlphaLimit = Math.PI; // 最大 alpha 角度
camera.lowerBetaLimit = 0; // 最小 beta 角度
camera.upperBetaLimit = Math.PI / 2; // 最大 beta 角度
camera.lowerRadiusLimit = 10; // 最小半径
camera.upperRadiusLimit = 20; // 最大半径
```

来看一下设置了`lowerRadiusLimit=10`，`upperRadiusLimit = 20`的案例，鼠标滚轮最多只能滚到距离目标`10-20`的这个区间：

![](/images/jueJin/ffa79b2c71214c4.png)

在线观看地址：[playground.babylonjs.com/#SRZRWV#197…](https://link.juejin.cn?target=https%3A%2F%2Fplayground.babylonjs.com%2F%23SRZRWV%231975 "https://playground.babylonjs.com/#SRZRWV#1975")

### 弧形旋转相机的平移

弧形相机除了用鼠标滚轮拉近拉远之外，还可以按住鼠标右键平移相机的位置。

我们来看一下案例效果：

![](/images/jueJin/ee9e58a0859e4a3.png)

为了更好的体现出相机平移的过程，我使用 `playground` 自带的生成天空盒代码的功能增加了一个场景的天空盒背景。以下为上面的案例代码：

```typescript
    var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    
    // 创建天空盒
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl();
    
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    
    light.intensity = 0.7;
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
    
    sphere.position.y = 1;
    
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
    
    return scene;
    };
```

在线观看地址：[playground.babylonjs.com/#SRZRWV#197…](https://link.juejin.cn?target=https%3A%2F%2Fplayground.babylonjs.com%2F%23SRZRWV%231974 "https://playground.babylonjs.com/#SRZRWV#1974")

（提一嘴 `babylon.js` 的 `playground`生成天空盒的代码）

![](/images/jueJin/1a7dc05c866f4ef.png)

### 控制目标点屏幕偏移量

在某些情况下，你可能有这样的需求：在不改变实际目标位置的情况下，调整相机在屏幕上的显示位置。效果和上面的按住鼠标右键进行平移还不太一样。

这时候就得依靠 `targetScreenOffset`属性了。

还是基于上面相机平移的案例，但是我多设置一个`targetScreenOffset` 属性：

```typescript
    var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0); skybox.material = skyboxMaterial;
    
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl();
    // 在屏幕上偏移目标位置
    camera.targetScreenOffset = new BABYLON.Vector2(3, 0);
    
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    
    light.intensity = 0.7;
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
    
    sphere.position.y = 1;
    
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
    
    return scene;
    
    };
```

没有设置 `targetScreenOffset` 的时候，物体是在场景的正中间的：

![](/images/jueJin/97aa4efa22db4b8.png)

设置了 `targetScreenOffset` 为 `BABYLON.Vector2(3, 0)` 之后，表示相机要相对于屏幕宽度进行偏移，初始化时的效果就变成了：

![](/images/jueJin/1a680f5fd90c4f6.png)

上面两张图的对比可能说明不了什么问题，我们来看看动图：

![](/images/jueJin/fac93cecea924d0.png)

相机依旧是绕着球和地板旋转，但是球和地板已经不在整个屏幕的中心了，而是向右边偏移。

在线预览地址：[playground.babylonjs.com/#SRZRWV#197…](https://link.juejin.cn?target=https%3A%2F%2Fplayground.babylonjs.com%2F%23SRZRWV%231976 "https://playground.babylonjs.com/#SRZRWV#1976")

### 控制相机惯性的一些属性

不知道你在操作相机的时候，是否有一种感觉：鼠标明明已经停手了，但是相机好像还是会跟着刚刚手的方向再多运动一小下，也就是类似于惯性。

在 babylon.js 中也有控制它们的一些属性：

*   `inertialAlphaOffset`: 控制 `alpha` 角度的惯性。
*   `inertialBetaOffset`: 控制 `beta`角度的惯性。
*   `inertialRadiusOffset`: 控制半径的惯性。
*   `panningInertia`: 控制平移的惯性。
*   `pinchDeltaPercentage`: 控制捏合缩放的百分比。
*   `panningSensibility`: 控制平移的灵敏度。
*   `inertia`：惯性因子，默认值为 `0.9`

关于惯性属性，有一个很重要的就是 `inertia`惯性因子，各个角度与惯性相关的值都与 `inertia`有关，有时候我们会发现怎么设置 `inertialRadiusOffset`或者 `inertialAlphaOffset`这些都没啥用，可能是因为 `inertia`太大或者太小了。经过测试发现，`inertia`值为 `0.9`和 `0.7`对相机惯性的影响都很大。

### zoomToMouseLocation

弧形相机还有一些方便且有趣的属性，例如 `zoomToMouseLocation`。设置它为 `true` 可以让鼠标滚轮以当前鼠标位置（而不是固定的 `camera.tareget` 位置）为中心放大或缩小。

这个功能类似于平板电脑上的以某个点为放大缩小。

以上面的基础案例为母本，进行修改：

```typescript
// 创建弧度旋转相机
var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
camera.attachControl();

// 设置该属性为 true
camera.zoomToMouseLocation = true;


// 创建灯光、球、地板
var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
sphere.position.y = 1;
var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
```

效果如下：

![](/images/jueJin/20f83ab164444cf.png)

默认情况下，`zoomToMouseLocation` 为 `false`，混动鼠标的滚轮，无论鼠标放在哪里，都会随着滚轮的前后而向 `target` 靠近远离。但设置 `zoomToMouseLocation` 为 `true` 后，滚轮前后会随着鼠标的位置而靠近远离。

可想而知，`zoomToMouseLocation` 设置为 `true` 后，本质上影响的是相机的 `target` 值，这点在使用的时候也是需要注意的。

在线预览地址：[playground.babylonjs.com/#SRZRWV#197…](https://link.juejin.cn?target=https%3A%2F%2Fplayground.babylonjs.com%2F%23SRZRWV%231977 "https://playground.babylonjs.com/#SRZRWV#1977")

跟随相机 FollowCamera
-----------------

再说一种相机，跟随相机，一听这个名字就知道是做啥的了。

跟随某个物体，物体到哪，它就跟随到哪。

`FollowCamera`类的初始化定义：

```typescript
/**
* @param name 定义摄像机的名称
* @param position 定义相机的位置
* @param scene 定义相机所属的场景
* @param lockedTarget 定义相机的目标
*/
constructor(
name: string,
position: Vector3,
scene?: Scene,
lockedTarget: Nullable<AbstractMesh> = null
) {}
```

功能相对还是比较简单的，我们就用一个案例来讲解一下吧。

### FollowCamera 的基础案例

既然是跟随相机，那么为了演示出它的跟随效果，我们给某个球体添加一个运动的动画，然后看看相机的表现：

1、创建一个天空盒

2、创建一个跟随相机，并设置它的一些属性

3、创建一个球体和地板

4、给球体添加动画，让它一直来回的移动

```typescript
    var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    
    // 创建天空盒
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0.11, 0.11, 0.11); skybox.material = skyboxMaterial;
    
    // 创建 FollowCamera
    var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 10, -10), scene);
    camera.attachControl();
    
    // 相机距离目标的目标距离
    camera.radius = 30;
    
    // 相机在目标局部原点（中心）上方的目标高度
    camera.heightOffset = 10;
    
    // 相机绕目标局部原点（中心）在 xy 平面的目标旋转角度
    camera.rotationOffset = 0;
    
    // 相机从当前位置移动到目标位置的加速度
    camera.cameraAcceleration = 0.005;
    
    // 加速度停止时的速度
    camera.maxCameraSpeed = 10;
    
    
    // 创建灯光、球、地板
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
    sphere.position.y = 1;
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
    
    // 设置相机的目标对象
    camera.lockedTarget = sphere;
    
    // 创建动画
    const frameRate = 10;
    
    const xSlide = new BABYLON.Animation("xSlide", "position.x", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    
    const keyFrames = [];
    
        keyFrames.push({
        frame: 0,
        value: 2
        });
        
            keyFrames.push({
            frame: frameRate,
            value: -2
            });
            
                keyFrames.push({
                frame: 2 * frameRate,
                value: 2
                });
                
                xSlide.setKeys(keyFrames);
                sphere.animations.push(xSlide);
                scene.beginAnimation(sphere, 0, 2 * frameRate, true);
                
                return scene;
                
                };
```

效果如下：

![](/images/jueJin/f40bfc035d094c9.png)

在线预览地址：[playground.babylonjs.com/#SRZRWV#197…](https://link.juejin.cn?target=https%3A%2F%2Fplayground.babylonjs.com%2F%23SRZRWV%231978 "https://playground.babylonjs.com/#SRZRWV#1978")

飞行相机 FlyCamera
--------------

上面我们介绍的 `UniversalCamera` 是用来模拟第一人称视角的，在 Babylon.js 中，还有一种相机，专为模拟飞行器的运动而设计。它允许用户在三维空间中自由飞行，具有类似于飞行模拟器的控制方式。

用户可以通过 `WSAD` 键来操控相机前进后退，还可以通过鼠标左键旋转调整相机的视角。

`FlyCamera` 类的初始化定义：

```typescript
/**
@param name 定义相机在场景中的名称。
@param position 定义相机在场景中的起始位置。
@param scene 定义相机所属的场景。
@param setActiveOnSceneIfNoneActive 定义如果没有其他相机被定义为活动相机，是否将此相机标记为活动相机。
*/
constructor(
name: string,
position: Vector3,
scene?: Scene,
setActiveOnSceneIfNoneActive = true
) {}
```

### FlyCamera 的基础案例

先来看一个基础案例

```typescript
    var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    
    // 创建天空盒
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0.11, 0.11, 0.11); skybox.material = skyboxMaterial;
    
    const camera = new BABYLON.FlyCamera("FlyCamera", new BABYLON.Vector3(0, 2, -10), scene);
    
    // 这将相机附加到画布上
    camera.attachControl(canvas, true);
    
    
    // 创建灯光、球、地板
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
    sphere.position.y = 1;
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
    
    return scene;
    
    };
```

这个案例演示了创建一个 `FlyCamera`，然后我通过键盘和鼠标来控制相机的移动。

效果如下：

![](/images/jueJin/446bc82b8d2e447.png)

在线预览地址：[playground.babylonjs.com/#SRZRWV#197…](https://link.juejin.cn?target=https%3A%2F%2Fplayground.babylonjs.com%2F%23SRZRWV%231979 "https://playground.babylonjs.com/#SRZRWV#1979")

### FlyCamera 的常用属性

`FlyCamera` 的常用属性如下：

*   ellipsoid: 定义相机的碰撞椭球体，用于模拟相机的物理体积，默认值为 new Vector3(1, 1, 1)
*   ellipsoidOffset: 定义椭球体相对于相机位置的偏移量，默认值为 new Vector3(0, 0, 0)
*   checkCollisions: 启用或禁用相机与场景对象的碰撞检测，默认值为 false。
*   applyGravity: 启用或禁用相机的重力，默认值为 false。
*   rollCorrect: 控制相机滚动校正的速度。默认值为 100，值越高，校正越慢。
*   bankedTurn: 启用或禁用倾斜转弯。默认值为 false。
*   bankedTurnLimit: 控制倾斜转弯的最大滚动角度。默认值为 Math.PI / 2（90°）。
*   bankedTurnMultiplier: 控制偏航对滚动的影响程度。默认值为1。值小于 1 会减少滚动，值大于 1 会增加滚动。

大家可以在基础案例中的在线预览地址中调试看一下这些属性。

后语
--

知识无价，支持原创！这篇文章主要是给大家介绍了一下 Babylon.js 中如何使用相机，以及常用的相机种类。掌握了这些之后，可以让我们对场景中的视角有更多的掌控。

喜欢霖呆呆的小伙伴还希望可以关注霖呆呆的公众号 LinDaiDai

我会不定时的更新一些前端方面的知识内容以及自己的原创文章🎉。

你的鼓励就是我持续创作的主要动力 😊。

其它相关文章推荐：

*   [《全网最详Babylon.js入门教材-第一个3D场景》](https://juejin.cn/post/7407256931394895883 "https://juejin.cn/post/7407256931394895883")
*   [《全网最详Babylon.js入门教材(2)-插入几何体》](https://juejin.cn/post/7409882784057622539 "https://juejin.cn/post/7409882784057622539")
*   [《全网最详Babylon.js入门教材(3)-材质与光的交响曲》](https://juejin.cn/post/7412672656363438143 "https://juejin.cn/post/7412672656363438143")
*   [《全网最详Babylon.js入门教材(4)-材质与纹理的相濡以沫》](https://juejin.cn/post/7413964058788675621 "https://juejin.cn/post/7413964058788675621")
*   [《全网最详Babylon.js入门教材(5)-设置光源》](https://juejin.cn/post/7417665616494198836 "https://juejin.cn/post/7417665616494198836")