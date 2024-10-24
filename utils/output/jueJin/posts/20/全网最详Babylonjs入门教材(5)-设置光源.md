---
author: ""
title: "全网最详Babylonjs入门教材(5)-设置光源"
date: 2024-09-24
description: "学习完了上一章的材质之后，再学习光源，应该会亲切很多，这一章节，我们先来学习 Babylonjs 中主要的几种光源类型，了解它们的基础用法和各自的特性，然后再来看几个由不同光组合而成的有趣的案例。"
tags: ["前端","JavaScript","WebGL中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读11分钟"
weight: 1
selfDefined:"likes:0,comments:0,collects:0,views:153,"
---
> Q：Babylon.js是什么？🤔️

[Babylon.js](https://link.juejin.cn?target=https%3A%2F%2Fdoc.babylonjs.com%2F "https://doc.babylonjs.com/") 是一个强大的、开源的、基于 `WebGL`和 `WebGPU`的 `3D`引擎，用于在网页上创建和渲染 `3D`图形。它提供了一套丰富的 `API`和功能，包括物理引擎、粒子系统、骨骼动画、碰撞检测、光照和阴影等，可以帮助开发者快速创建复杂的 `3D`场景和交互。

> Q：我为什么要写该系列的教材? 🤔️

因为公司业务的需要因而要在项目中使用到 `Babylon.js`，虽然官方的文档看起来覆盖面都挺全，且 [playgroud](https://link.juejin.cn?target=https%3A%2F%2Fplayground.babylonjs.com%2F "https://playground.babylonjs.com/") 上的案例也都比较多，但一些具体的 API 或者功能属性也都没有特别多详细的介绍，包括很多使用方式的很多坑都得自己去源码中或者[论坛上](https://link.juejin.cn?target=https%3A%2F%2Fforum.babylonjs.com%2F "https://forum.babylonjs.com/")找。在将其琢磨完之后, 决定写一系列关于它的教材来帮助更多 `babylon.js`的使用者或者是期于学习 `Web 3D`的开发者。同时也是自己对其的一种巩固。

Babylon.js中的光源类型
----------------

学习完了上一章的材质之后，再学习光源，应该会亲切很多，因为在那章里，我们无形中已经学习过很多光源了。

这一章节，我们先来学习 Babylon.js 中主要的几种光源类型，了解它们的基础用法和各自的特性，然后再来看几个由不同光组合而成的有趣的案例。

Babylon.js中主要有以下四个种类的光源：

*   `Point Light`：点光源
*   `Directional Light`：定向光
*   `Spot Light`: 聚光灯
*   `Hemispheric Light`：半球光

类型其实也不是很多，但是能应对大部分场景。关于它们共有的特性和属性，我们可以到 Babylon.js 的源码中找一找答案。

在源码中，有一个名为 `Light` 和名为 `ShadowLight` 的类。

`Light` 类是所有灯光的基类，其中包含了很多所有灯光都有的（或者说是通用）的属性，常见的例如：

`diffuse`

类型为 Color3，默认值为白色，表示漫反射的颜色

`specular`

类型为 Color3，默认值为白色，表示高光在物体上产生高光的颜色

`intensity`

类型为浮点数，默认值为 1.0，表示光的强度

`range`

类型为数字，默认值为 `Number.MAX_VALUE`。定义在场景单位中距离光源的影响距离

`ShadowLight`类继承至 `Light` 类，从命名上也可以看出来，`ShadowLight`应该是表示那些会产生阴影效果的光源。例如点光源（`PointLight`）、定向光（`DirectionalLight`）、聚光灯（`SpotLight`），而 `HemisphericLight` 是不继承 `ShadowLight` 的。

所以所有继承 `ShadowLight` 的光源，都有一个 `shadowEnabled` 属性用于控制是否启用阴影（默认为 `true`）。

以上灯光类的类图关系如下：

![](/images/jueJin/7657c6d0da6c4b3.png)

点光源 PointLight
--------------

点光源从一个点，向所有方向发出光线。它的光线强度会随着距离的增加而衰减。一个非常有代表性的使用场景就是**模拟灯泡、火把**。

`PointLight`类的初始化定义：

```typescript
/**
* 创建一个 PointLight 对象，并将其添加到场景中。
* 文档：https://doc.babylonjs.com/features/featuresDeepDive/lights/lights_introduction
* @param name 光源的名称
* @param position 点光源在场景中的位置
* @param scene 光源所属的场景
*/
constructor(
name: string,
position: Vector3,
scene?: Scene
) {}
```

### 点光源基础案例

点光源的案例：

```typescript
// 创建点光源，并设置漫反射光和高光
var light = new BABYLON.PointLight("light", new BABYLON.Vector3(0, 1, 0), scene);
light.diffuse = new BABYLON.Color3(1, 0, 0); // 红色
light.specular = new BABYLON.Color3(0, 1, 0); // 绿色

// 创建一个球体
var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {}, scene);
sphere.position.z = 1;
```

案例中，创建一个点光源并让它照射在球体上，通过学习【[材质与光的交响曲](https://juejin.cn/post/7413964058788675621 "https://juejin.cn/post/7413964058788675621")】我们知道，没给物体设置材质的话，默认会反射所有照射到它身上的光，因此效果为：

![](/images/jueJin/4225ce7aa4a74f1.png)

官网Playground链接查看：[playground.babylonjs.com/#20OAV9](https://link.juejin.cn?target=https%3A%2F%2Fplayground.babylonjs.com%2F%2320OAV9 "https://playground.babylonjs.com/#20OAV9")

上面的案例，你会发现除了灯光的 `diffuse` 漫反射属性，还有 `specular` 高光属性。诶～这个属性是不是觉得很眼熟，因为材质上也有设置高光样式的 `specularColor` 和 `specularTexture`。

两者的区别也很好理解，灯光的 `specular` 决定了光源发出的高光颜色，影响所有被该光照亮的物体的高光颜色。

而材质上的 `specularColor` 决定了物体表面反射高光的颜色，仅影响应用了该材质的物体，它们共同作用来决定物体表面的高光效果。

### 展示点光源是个“点”的案例

上面的案例可能不太看的出来点光源是一个点的效果，让我们来下面的这个：

将点光源的位置设置在世界坐标原点中心`(0, 0, 0)`，然后分别在其上下左右都增加一个小球，代码如下：

```typescript
var light = new BABYLON.PointLight("light", new BABYLON.Vector3(0, 0, 0), scene);
light.diffuse = new BABYLON.Color3(1, 0, 0);
light.specular = new BABYLON.Color3(0, 1, 0);

var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {}, scene);
sphere.position.y = 2;

var sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere2", {}, scene);
sphere2.position.y = -2;

var sphere3 = BABYLON.MeshBuilder.CreateSphere("sphere3", {}, scene);
sphere3.position.x = 2;

var sphere4 = BABYLON.MeshBuilder.CreateSphere("sphere4", {}, scene);
sphere4.position.x = -2;
```

最终的效果如下：

![](/images/jueJin/29cdc5c3943a4b3.png)

### 展示点光源是个“点”的案例二

另一个案例，我们在中心创建一个小球，还有一个地板：

```typescript
var scene = new BABYLON.Scene(engine);
var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2,  Math.PI / 2, 5, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);

// 灯光
var light = new BABYLON.PointLight("light", new BABYLON.Vector3(0, 1, 0), scene);
light.diffuse = new BABYLON.Color3(1, 0, 0); // 设置漫反射为红色
light.specular = new BABYLON.Color3(0, 1, 0); // 设置高光为绿色

// 球
var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {}, scene);

// 地板
var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 4, height: 6}, scene);
```

效果如下：

![](/images/jueJin/24a260bf781e4a8.png)

靠近中间的地方会更亮，越边缘越暗，并且高光处也是我们设置的绿色。

平行光 DirectionalLight
--------------------

`DirectionalLight`用于模拟来自无限远处的平行光线，类似于太阳光。它在场景中提供均匀的光照效果，**适用于模拟大面积的光源**。

它的主要属性除了公共的 `diffuse`、`specular`、`intensity` 以外，还有 `diection` 用于指定光源的方向，决定光线的照射方向。

`DirectionalLight`类的初始化参数为：

```typescript
/**
* 在场景中创建一个 DirectionalLight 对象，朝向传递的方向（Vector3）。
* 平行光源从所有地方向给定方向发出光线。
* 它可以投射阴影。
* 文档: https://doc.babylonjs.com/features/featuresDeepDive/lights/lights_introduction
* @param name 光源的名称
* @param direction 光的方向
* @param scene 光源所属的场景
*/
constructor(
name: string,
direction: Vector3,
scene?: Scene
) {}
```

### 展示平行光是平行的案例

我们还是以上面点光源的第三个案例来做对比，创建一个小球和一个地板，看看会有什么不同的效果。

案例代码：

```typescript
var scene = new BABYLON.Scene(engine);
var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2,  Math.PI / 2, 5, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);

// 创建平行光，且光线方向垂直朝下
var light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 0), scene);
light.diffuse = new BABYLON.Color3(1, 0, 0); // 设置漫反射为红色
light.specular = new BABYLON.Color3(0, 1, 0); // 设置高光为绿色

// 球
var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {}, scene);

// 地板
var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 4, height: 6}, scene);
```

效果如下：

![](/images/jueJin/9304972c4012453.png)

可以看到，相机视角垂直向下看的时候，除了高光处向四周有从黄到红的过程，其它视角在地板上的漫反射光照都是差不多的，都呈现出红色。

另外还有一点要注意，并不是说平行光就不会产生阴影效果，可以看到上面的小球也是会有阴影效果的。

聚光灯 SpotLight
-------------

`SpotLight`是 Babylon.js 中的一种聚光灯光源，模拟现实世界中的聚光灯效果。它从一个点发出光束，并在特定方向上逐渐扩散，形成一个锥形光束。`SpotLight`非常适合用于**模拟舞台灯光、手电筒等场景**。

对比与平行光，它多了一个 `position` 属性，用于定义光源的位置，同时它也有 `direction` 光束的方向属性。

再就是有一些关于“聚光”效果的属性，例如：

**angle**：光束的角度，以弧度表示。决定了光束的扩散范围。

```typescript
light.angle = Math.PI / 3; // 60度
```

**exponent**: 光束的衰减系数。值越大，光束边缘越柔和。

```typescript
light.exponent = 2;
```

`SpotLight` 类的初始化参数为：

```typescript
/**
* 在场景中创建一个 SpotLight 对象。聚光灯是一个简单的定向光锥。
* 它可以投射阴影。
* 文档: https://doc.babylonjs.com/features/featuresDeepDive/lights/lights_introduction
* @param name 光源的名称
* @param position 聚光灯在场景中的位置
* @param direction 光在场景中的方向
* @param angle 光锥的角度（以弧度表示）
* @param exponent 光从发射点开始的衰减速度
* @param scene 光源所属的场景
*/
constructor(
name: string,
position: Vector3,
direction: Vector3,
angle: number,
exponent: number,
scene?: Scene
) {}
```

### 聚光灯的基础案例

来看一个基础的案例：

定义了两个聚光灯，同时修改它们的 `diffuse`、`specular` 属性。

```typescript
var scene = new BABYLON.Scene(engine);
var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2,  Math.PI / 4, 5, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);

// 光的方向是从一个位置直接向下一个单位向上，衰减缓慢
var light = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(-1, 1, -1), new BABYLON.Vector3(0, -1, 0), Math.PI / 2, 10, scene);
light.diffuse = new BABYLON.Color3(1, 0, 0);
light.specular = new BABYLON.Color3(0, 1, 0);

// 光的方向是从一个位置直接向下一个单位向上，衰减快
var light1 = new BABYLON.SpotLight("spotLight1", new BABYLON.Vector3(1, 1, 1), new BABYLON.Vector3(0, -1, 0), Math.PI / 2, 50, scene);
light1.diffuse = new BABYLON.Color3(0, 1, 0);
light1.specular = new BABYLON.Color3(0, 1, 0);

var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 4, height: 4}, scene);
```

效果如下：

![](/images/jueJin/e1daa1934583425.png)

官网案例地址：[playground.babylonjs.com/#20OAV9#3](https://link.juejin.cn?target=https%3A%2F%2Fplayground.babylonjs.com%2F%2320OAV9%233 "https://playground.babylonjs.com/#20OAV9#3")

半球光 HemisphericLight
--------------------

`HemisphericLight`是 `Babylon.js` 中的一种半球光源，模拟**从天空和地面反射的环境光**。它从一个方向发出光线，并且有一个对立方向的环境光，适用于模拟自然光照效果。

这里提到的对立方向的环境光是什么意思呢？指的是它的特有属性 groundColor: 地面反射光的颜色，影响物体表面未被直接光照射部分的颜色。在等会的案例中就能看到它发挥的作用了。

`HemisphericLight` 类的初始化参数为：

```typescript
/**
* 根据传入的方向（Vector3）在场景中创建一个HemisphericLight对象。
* 该对象模拟环境光，因此传入的方向是光的反射方向，而不是入射方向。
* HemisphericLight不能投射阴影。
* 文档：https://doc.babylonjs.com/features/featuresDeepDive/lights/lights_introduction
* @param name 灯光的名称
* @param direction 灯光反射的方向
* @param scene 灯光所属的场景
*/
constructor(
name: string,
direction: Vector3,
scene?: Scene
) {}
```

### 半球光的基础案例

定义一个球，同时设置一个半球光，设置它的漫反射与高光、还有地面反射光颜色：

```typescript
var scene = new BABYLON.Scene(engine);
var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2,  Math.PI / 4, 5, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);

// 光的方向是向上和向左
var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 1, 0), scene);
light.diffuse = new BABYLON.Color3(1, 0, 0);
light.specular = new BABYLON.Color3(0, 1, 0);
light.groundColor = new BABYLON.Color3(0, 1, 0);

var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {}, scene);
```

效果如下：

![](/images/jueJin/693aa54777ce4b7.png)

可以看到，这个球的上半部分是被反射成了红色，也就是 `diffuse` 的颜色，另外一部分，靠近地面的部分被反射成了绿色，这就是 `groundColor` 的作用，你可以理解为它是来自相反方向的光。

官方案例地址：[playground.babylonjs.com/#20OAV9#5](https://link.juejin.cn?target=https%3A%2F%2Fplayground.babylonjs.com%2F%2320OAV9%235 "https://playground.babylonjs.com/#20OAV9#5")

材质对光的限制
-------

这部分直接看材质那一篇文章即可：[材质对光的限制 maxSimultaneousLights](https://juejin.cn/post/7412672656363438143#heading-21 "https://juejin.cn/post/7412672656363438143#heading-21")

开光灯 setEnabled()
----------------

使用灯上的 `setEnabled()`方法即可：

```typescript
light.setEnabled(false); // 关灯

light.setEnabled(true); // 开灯
```

调节灯光强度及到达距离
-----------

### 强度 intensity

灯光强度的调节直接设置 `intensity` 即可：

`intensity`的默认值是 1。

```typescript
light0.intensity = 0.5; // 调暗
light1.intensity = 2.4; // 调亮
```

### 到达的距离 range

对于点光源和聚光灯，还可以使用 `range` 属性设置光线到达的距离，例如：

默认值为 `Number.MAX_VALUE`，即 `JS` 中数字的最大值。

```typescript
light.range = 100;
```

案例练习
----

### 灯光案例一

实现以下效果：

![](/images/jueJin/5475e193a5f7433.png)

提示：半球光、`diffuse`、`specular`、`groundColor`、`ambientColor`。

\------------------------------- 分割线 -------------------------------

在线预览地址：

[playground.babylonjs.com/#20OAV9#14](https://link.juejin.cn?target=https%3A%2F%2Fplayground.babylonjs.com%2F%2320OAV9%2314 "https://playground.babylonjs.com/#20OAV9#14")

代码实现：

```typescript
var scene = new BABYLON.Scene(engine);
var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2,  Math.PI / 4, 5, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);

scene.ambientColor = new BABYLON.Color3(1, 1, 1);

//Light direction is up and left
var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 1, 0), scene);
light.diffuse = new BABYLON.Color3(1, 0, 0);
light.specular = new BABYLON.Color3(0, 1, 0);
light.groundColor = new BABYLON.Color3(0, 1, 0);

var redMat = new BABYLON.StandardMaterial("redMat", scene);
redMat.ambientColor = new BABYLON.Color3(1, 0, 0);

var greenMat = new BABYLON.StandardMaterial("redMat", scene);
greenMat.ambientColor = new BABYLON.Color3(0, 1, 0);

//No ambient color
var sphere0 = BABYLON.MeshBuilder.CreateSphere("sphere0", {}, scene);
sphere0.position.x = -1.5;

//Red Ambient
var sphere1 = BABYLON.MeshBuilder.CreateSphere("sphere1", {}, scene);
sphere1.material = redMat;

//Green Ambient
var sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere2", {}, scene);
sphere2.material = greenMat;
sphere2.position.x = 1.5;
```

### 灯光案例二

实现以下效果：

![](/images/jueJin/82681796783848b.png)

提示词：聚光灯、`diffuse`。

\------------------------------- 分割线 -------------------------------

在线预览地址：

[playground.babylonjs.com/#20OAV9#9](https://link.juejin.cn?target=https%3A%2F%2Fplayground.babylonjs.com%2F%2320OAV9%239 "https://playground.babylonjs.com/#20OAV9#9")

代码实现：

```typescript
var scene = new BABYLON.Scene(engine);
var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2,  Math.PI / 4, 5, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);

//red light
var light = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(-Math.cos(Math.PI/6), 1 , -Math.sin(Math.PI/6)), new BABYLON.Vector3(0, -1, 0), Math.PI / 2, 1.5, scene);
light.diffuse = new BABYLON.Color3(1, 0, 0);

//green light
var light1 = new BABYLON.SpotLight("spotLight1", new BABYLON.Vector3(0, 1, 1 - Math.sin(Math.PI / 6)), new BABYLON.Vector3(0, -1, 0), Math.PI / 2, 1.5, scene);
light1.diffuse = new BABYLON.Color3(0, 1, 0);

//blue light
var light2 = new BABYLON.SpotLight("spotLight2", new BABYLON.Vector3(Math.cos(Math.PI/6), 1, -Math.sin(Math.PI/6)), new BABYLON.Vector3(0, -1, 0), Math.PI / 2, 1.5, scene);
light2.diffuse = new BABYLON.Color3(0, 0, 1);

var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 4, height: 4}, scene);
```

后语
--

知识无价，支持原创！这篇文章主要是给大家介绍了一下 Babylon.js 中如何使用灯光，当然这些都还只是基础的用法。掌握了这些之后，起码能让我们的场景“亮堂”起来了。

喜欢霖呆呆的小伙伴还希望可以关注霖呆呆的公众号 LinDaiDai

我会不定时的更新一些前端方面的知识内容以及自己的原创文章🎉。

你的鼓励就是我持续创作的主要动力 😊。

其它相关文章推荐：

*   [《全网最详Babylon.js入门教材-第一个3D场景》](https://juejin.cn/post/7407256931394895883 "https://juejin.cn/post/7407256931394895883")
*   [《全网最详Babylon.js入门教材(2)-插入几何体》](https://juejin.cn/post/7409882784057622539 "https://juejin.cn/post/7409882784057622539")
*   [《全网最详Babylon.js入门教材(3)-材质与光的交响曲》](https://juejin.cn/post/7412672656363438143 "https://juejin.cn/post/7412672656363438143")
*   [《全网最详Babylon.js入门教材(4)-材质与纹理的相濡以沫》](https://juejin.cn/post/7413964058788675621 "https://juejin.cn/post/7413964058788675621")