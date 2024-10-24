---
author: ""
title: "WebXR 技术调研 - 在浏览器中构建扩展现实应用"
date: 2022-08-12
description: "WebXR 是一组支持将渲染 3D 场景用来呈现虚拟世界（虚拟现实，也称作VR）或将图形图像添加到现实世界（增强现实，也称作AR）的标准。"
tags: ["前端","浏览器","虚拟现实中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读19分钟"
weight: 1
selfDefined:"likes:19,comments:0,collects:21,views:4494,"
---
WebXR 是一组支持将渲染 3D 场景用来呈现虚拟世界（虚拟现实，也称作VR）或将图形图像添加到现实世界（增强现实，也称作AR）的标准。 通过该 API 可以访问 VR/AR 虚拟设备和跟踪用户姿态动作。它用于替换已经废弃的 WebVR API。

Khronos 的 [OpenXR API](https://link.juejin.cn?target=https%3A%2F%2Fwww.khronos.org%2Fopenxr%2F "https://link.juejin.cn?target=https%3A%2F%2Fwww.khronos.org%2Fopenxr%2F") 基本覆盖了 WebXR API 基础功能，但是它们与 WebGL 和 OpenGL 的关系不同，WebGL 和 OpenGL 关系是 1:1 的映射，而 WebXR 和 OpenXR 是由两个不同的组织开发，所以它们之间会有一些相同概念用不同的方式来表示。

![image.png](/images/jueJin/5dcf6e20c43d499.png)

*   AR 全称 Augmented Reality，增强现实。可以让屏幕上的虚拟世界能够与现实世界场景进行结合与交互。可以参考游戏 Pokémon GO。
*   VR 全称 Virtual Reality，虚拟现实。由电脑创建虚拟的 3D 世界，用户看不到现实环境，完全沉浸在虚拟世界中。可以参考电影 头号玩家。
*   MR 全称 Mixed Reality，混合现实。可以看成 AR 和 VR 的融合，用户可以看见现实环境，和额外的虚拟物件，并可以进行交互。可以参考 Quest 的 [MR 头盔](https://link.juejin.cn?target=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DtgJ7m0Phd64 "https://link.juejin.cn?target=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DtgJ7m0Phd64")。
*   XR 全称 Extended Reality，扩展现实。它是一个总称，任何虚拟和现实等技术，如 AR、VR 和 MR 都可以看成 XR 的一部分。

WebXR 中的 X 并不是作为首字母缩略词的一部分，而是作为某种代数变量来表示，你可以将它看成任何你希望的词，例如 Extended 或 Cross。

历史
--

在 2014 年，Mozilla 工程总监 Vladimir Vukicevic 首次提出 WebVR 概念，它可以兼容PC、移动设备、VR等各种设备，无需下载和安装在浏览器即可运行 3D VR 内容。

Mozilla 提出 WebVR 后，谷歌 Chrome 团队在 2016 年也加入开发，合作推出了 WebVR API 1.0。后来部分微软员工也加入，帮助完善 WebVR API 2.0。

到了 2018 年，谷歌、Mozilla等巨头组成的 W3C Immersive Web Working Group，推动标准化 WebXR 取代 WebVR，它被设计整合 AR、VR 以及未来可能出现的现实和设备。

兼容性
---

目前 WebXR 并没有正式发布，支持 WebXR 的浏览器并不多，如下所示。

![](/images/jueJin/a22eab74347c456.png)

可以发现不是完全不支持就是需要通过实验 flag 来开启该功能，只有少数几个浏览器才支持，不过没有关系，WebXR 主要用在 VR 头盔设备上，而头盔浏览器一般都是支持 WebXR 的，例如 [Firefox Reality](https://link.juejin.cn?target=https%3A%2F%2Fmixedreality.mozilla.org%2Ffirefox-reality%2F "https://link.juejin.cn?target=https%3A%2F%2Fmixedreality.mozilla.org%2Ffirefox-reality%2F") 浏览器。

目前 Firefox Reality 浏览器已经交给了 [Igalia 继续开发](https://link.juejin.cn?target=https%3A%2F%2Fblog.mozilla.org%2Fen%2Fmozilla%2Fnews%2Fupdate-on-firefox-reality%2F "https://link.juejin.cn?target=https%3A%2F%2Fblog.mozilla.org%2Fen%2Fmozilla%2Fnews%2Fupdate-on-firefox-reality%2F")，Igalia 基于 Firefox Reality 继续开发新的 [Wolvic 浏览器](https://link.juejin.cn?target=https%3A%2F%2Fwolvic.org%2F "https://link.juejin.cn?target=https%3A%2F%2Fwolvic.org%2F") 。Mozilla 则并将业务重心转向 Web VR 社交平台 [Hubs](https://link.juejin.cn?target=https%3A%2F%2Fhubs.mozilla.com%2F "https://link.juejin.cn?target=https%3A%2F%2Fhubs.mozilla.com%2F") 。

快速体验
----

要将画面渲染到 VR 设备上，需要搭配使用 WebXR 和 WebGL API，WebXR 负责访问 VR 设备和获取传感器数据，WebGL 负责渲染画面。

要最简单的将画面渲染到 VR 设备上需要以下几步。

1.  检查当前环境是否支持 WebXR
2.  创建 XR Session
3.  创建 XR 兼容的 WebGLContext
4.  在 XRSession 的 requestAnimationFrame 回调中不断的渲染新的一帧画面
5.  用户退出或自己结束 XRSession

下面代码演示如何创建一个最简单的 VR 场景。

```javascript
    if (navigator.xr) {
    // 1. 检查是否支持 immersive-vr 模式
        navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
            if (supported) {
            const btn = document.createElement('button')
            btn.textContent = '进入 VR'
            btn.onclick = onBtnClick
            document.body.appendChild(btn)
        }
        });
    }
    
    let gl
        function onBtnClick() {
            navigator.xr.requestSession('immersive-vr').then(session => {
            // 2. 请求 VR 会话
            
            const canvas = document.createElement('canvas');
            gl = canvas.getContext('webgl', { xrCompatible: true });
            // 3. 与创建普通 WebGL 不同，这里需要设置 xrCompatible 参数
            
            session.updateRenderState({ baseLayer: new XRWebGLLayer(session, gl) });
            // 更新会话的渲染层，后续渲染会渲染在该层上
            
            session.requestAnimationFrame(onXRFrame);
            })
        }
        
            function onXRFrame(time, frame) {
            const session = frame.session;
            // 4. 这个 session 是上面请求的 session
            
            // 需要使用 session 上的 requestAnimationFrame
            // 而不是 window 上的
            session.requestAnimationFrame(onXRFrame);
            const glLayer = session.renderState.baseLayer;
            
            // 绑定 framebuffer
            gl.bindFramebuffer(gl.FRAMEBUFFER, glLayer.framebuffer);
            
            // 随着时间变化清除色
            gl.clearColor(Math.cos(time / 2000),
            Math.cos(time / 4000),
            Math.cos(time / 6000), 1.0);
            
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }
```

`navigator.xr` 是 WebXR 的入口，它是一个 XRSystem 对象，它只有两个方法，`isSessionSupported` 检查目标模式是否支持和 `requestSession` 请求目标模式会话。模式分为 ar 和 vr。

首先需要通过 `isSessionSupported` 方法检测是否支持目标模式，如果支持就可以提示用户可以进入 VR 模式。这里不能直接进入 VR 会话，需要在用户交互的回调函数中请求进入，类似于音频的自动播放限制。

用户点击按钮后，就可以通过 `requestSession` 方法请求目标模式的 XRSession，有了 XRSession 后，需要给它设置一个渲染层，后续渲染的画面会渲染到该渲染层上，和创建 WebGL 上下文一样，这里通过 canvas 元素的 `getContext` 方法获取，唯一不同的是需要传入 `xrCompatible` 参数，让 GL 上下文由 XR 适配器创建，这样才能与 XR 兼容。

最后就是利用 XRSession 上的 `requestAnimationFrame` 方法来渲染画面到 VR 设备。与 `window.requestAnimationFrame` 类似，不过它多接收一个 XRFrame 参数，上面保存了这一帧的信息，接下来渲染和 WebGL 中是一样的，不过需要将画面渲染到 XRSession 渲染层的 `framebuffer` 中。

要运行上面这个 Demo 会非常困难，在桌面浏览器中不支持 VR，需要一个 VR 头盔设备，另外 WebXR 还需要 https 环境。

不过可以安装 [WebXR 模拟器插件](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMozillaReality%2FWebXR-emulator-extension "https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMozillaReality%2FWebXR-emulator-extension")来调试开发 XR 应用，下图是在安装 XR 插件后，运行在 Chrome 浏览器中的效果。

![image.png](/images/jueJin/897d3832a4df404.png)

可能有人认为 WebXR 性能相比 Native 应用会慢很多，其实大量指标和统计数据分析显示 WebXR 并不比 Native 应用程序慢。如果有 VR 设备可以点击下方链接来体验下 Web 中的 VR 切箭头。

[moonrider.xyz/](https://link.juejin.cn?target=https%3A%2F%2Fmoonrider.xyz%2F "https://link.juejin.cn?target=https%3A%2F%2Fmoonrider.xyz%2F")

WebXR Device API
----------------

上面 WebXR 例子中，首先通过 XRSystem 对象请求创建一个新的 XRSession 对象，XRSession 对象在渲染循环中不断创建 XRFrame 对象。下面就来近距离好好看一看 WebXR 中的这些对象。

### XRSystem

XRSystem 是 WebXR 的入口，可以通过 `navigator.xr` 访问到 XRSystem 对象。该对象上面只有两个方法和一个事件，其签名如下所示。

```ini
    [SecureContext, Exposed=Window] interface XRSystem : EventTarget {
    // Methods
    Promise<boolean> isSessionSupported(XRSessionMode mode);
    [NewObject] Promise<XRSession> requestSession(XRSessionMode mode, optional XRSessionInit options = {});
    
    // Events
    attribute EventHandler ondevicechange;
    };
```

签名中的 XRSessionMode 是一个枚举字符串，它可以是下面这 3 个字符串。

1.  `inline` 渲染画面到页面上，就和使用普通 WebGL 渲染是一样的，浏览器应该支持该模式
2.  `immersive-vr` 渲染到 VR 设备
3.  `immersive-ar` 渲染到 AR 设备，该模式定义在 [WebXR Augmented Reality Module](https://link.juejin.cn?target=https%3A%2F%2Fwww.w3.org%2FTR%2Fwebxr-ar-module-1%2F "https://link.juejin.cn?target=https%3A%2F%2Fwww.w3.org%2FTR%2Fwebxr-ar-module-1%2F") 中

`isSessionSupported` 方法用于查询给定模式在当前环境下是否支持，该方法并不能给出 100% 的检测结果，但是它会非常快速，也不会激活 VR 设备。

`requestSession` 该方法请求创建 XRSession 并进入指定模式的会话，后面所有的渲染，用户位置信息等都是基于该 XRSession 对象，它的第一个参数是会话模式字符串，第二个参数是可选的功能字符串，因为不是所有 XR 设备都支持所有功能，另外有些功能会输出敏感信息，与其让用户在使用时进行权限提示，不如在一开始就一次性提示，改参数签名如下。

```ini
    dictionary XRSessionInit {
    sequence<any> requiredFeatures;
    sequence<any> optionalFeatures;
    };
```

它有两个字段，一个必选和一个可选功能，它们都是接收字符串的数组。

默认情况会自动包含 `"viewer"` 功能，如果是 AR 或 VR 会话还会自动包含 `"local"` 功能。另外还有 `"local-floor"`、`"bounded-floor"` 和 `"unbounded"` 功能，它们都需要用户同意才能使用，这些功能字符串代表的意思将在下面章节中讲解。

`ondevicechange` 事件会在设备发生变化时触发，例如本来没有 VR 设备，但是后面接入了，或者有 VR 设备但是连接断掉了。触发该事件，之前的 XRSession 会结束，渲染上下文也会被清除，都需要重新创建。

### XRSession

XRSession 表示一个 XR 会话，与 XR 设备互动就是通过该对象，所以该对象比较重要，同时也比较复杂，其签名如下。

```ini
    enum XRVisibilityState {
    "visible",
    "visible-blurred",
    "hidden",
    };
    
        [SecureContext, Exposed=Window] interface XRSession : EventTarget {
        // Attributes
        readonly attribute XRVisibilityState visibilityState;
        readonly attribute float? frameRate;
        readonly attribute Float32Array? supportedFrameRates;
        [SameObject] readonly attribute XRRenderState renderState;
        [SameObject] readonly attribute XRInputSourceArray inputSources;
        
        // Methods
        undefined updateRenderState(optional XRRenderStateInit state = {});
        Promise<undefined> updateTargetFrameRate(float rate);
        [NewObject] Promise<XRReferenceSpace> requestReferenceSpace(XRReferenceSpaceType type);
        
        unsigned long requestAnimationFrame(XRFrameRequestCallback callback);
        undefined cancelAnimationFrame(unsigned long handle);
        
        Promise<undefined> end();
        
        // Events
        attribute EventHandler onend;
        attribute EventHandler oninputsourceschange;
        attribute EventHandler onselect;
        attribute EventHandler onselectstart;
        attribute EventHandler onselectend;
        attribute EventHandler onsqueeze;
        attribute EventHandler onsqueezestart;
        attribute EventHandler onsqueezeend;
        attribute EventHandler onvisibilitychange;
        attribute EventHandler onframeratechange;
        };
```

#### 可见性

`visibilityState` 属性是 XR Session 当前显示的状态，一共有下面 3 个状态。

*   `visible` XR 渲染的画面正常展示个用户
*   `visible-blurred` 用户可以看见 XR 渲染的画面，但是失焦了，此时渲染的帧率可能会被限制，画面也可能被模糊处理
*   `hidden` 用户看不到当前画面，`requestAnimationFrame` 回调将不会被处理

可以通过 `onvisibilitychange` 事件来监听可见性变换。

#### 帧率

`frameRate` 属性是设备的名义帧率，它并不是真实渲染的帧率。

`supportedFrameRates` 属性是设备支持的目标帧率。

名义帧率发生变化时会触发 `onframeratechange` 事件。

`updateTargetFrameRate` 方法可以更新会话目标帧率，如果会话没有名义帧率或者设置的帧率不在 `supportedFrameRates` 中，会直接报错 `reject`。

#### 输入

`inputSources` 属性是摄入设备列表，例如 VR 手柄。当输入设备发生变化时会触发 `oninputsourceschange` 事件。

`onselect` 和 `onsqueeze` 等相关事件会在用户按下主功能按键或主挤压按键时触发。

#### 空间

`requestReferenceSpace` 方法会返回 `XRReferenceSpace` 对象，主要用于跟踪空间信息，后面章节将会详细讲解该对象。

#### 渲染循环

`requestAnimationFrame` 方法中需要产生新的帧给用户，它基本与 `window.requestAnimationFrame` 类似，唯一不同的是，它的回调函数的第二个参数是一个 `XRFrame` 对象。

`cancelAnimationFrame` 方法与 `window.cancelAnimationFrame` 类似。

#### 渲染状态

`renderState` 属性是 XRSession 可配置渲染参数的值，例如配置远或近的深度、FOV 等属性，该对象签名如下。

```csharp
    dictionary XRRenderStateInit {
    double depthNear;
    double depthFar;
    double inlineVerticalFieldOfView;
    XRWebGLLayer? baseLayer;
    sequence<XRLayer>? layers;
    };
    
        [SecureContext, Exposed=Window] interface XRRenderState {
        readonly attribute double depthNear;
        readonly attribute double depthFar;
        readonly attribute double? inlineVerticalFieldOfView;
        readonly attribute XRWebGLLayer? baseLayer;
        };
```

`depthNear` 是透视矩阵的近裁切面，默认为 `0.1`

`depthFar` 是透视矩阵的远裁切面，默认为 `1000`

`inlineVerticalFieldOfView` 是 `inline` 模式下的垂直 FOV，默认为 90 度弧度（其他模式为 `null`）

`baseLayer` 渲染层，是 XR 合成器获取图片的地方

`layers` 自定义合成层，目前还不支持，配置将直接报错

通过 `updateRenderState` 方法可以更新这些参数，在获取到 XRSession 后，必须更新的一个属性是 `baseLayer`，它是一个 `XRWebGLLayer` 对象，该对象下面会详细讲解，可以通过 `new XRWebGLLayer(XRSession, WebGLRenderingContext)` 来构建一个。

这里需要注意 `WebGLRenderingContext` 是需要XR 兼容的，有两种方法来创建 XR 兼容的上下文。

第一种是在创建的时候直接传入 `xrCompatible` 参数。

```ini
const canvas = document.createElement('canvas');
gl = canvas.getContext('webgl', { xrCompatible: true });
```

另一种方式是在支持 XR 的情况才使用，不支持则使用普通 WebGL 渲染。这时候可以使用 `makeXRCompatible` 方法。

```ini
const canvas = document.createElement('canvas');
gl = canvas.getContext('webgl');

    gl.makeXRCompatible().then(() => {
    xrSession.updateRenderState({ baseLayer: new XRWebGLLayer(xrSession, gl) });
    });
```

使用该方法还需要应用处理上下文丢失问题，如果不监听 `makeXRCompatible` 将会直接 `reject`。

```javascript
// 监听上下文丢失
    canvas.addEventListener("webglcontextlost", (event) => {
    // 表明自己处理上下文恢复
    event.preventDefault();
    });
    
        canvas.addEventListener("webglcontextrestored", () => {
        // 上下文恢复，重新加载必要资源
        loadSceneGraphics();
        });
        
```

### XRWebGLLayer

XRWebGLLayer 提供用于渲染的 WebGL framerbuffer，并且启用 XR 设备硬件加速 3D 渲染。签名如下。

```ini
typedef (WebGLRenderingContext or
WebGL2RenderingContext) XRWebGLRenderingContext;

    dictionary XRWebGLLayerInit {
    boolean antialias = true;
    boolean depth = true;
    boolean stencil = false;
    boolean alpha = true;
    boolean ignoreDepthValues = false;
    double framebufferScaleFactor = 1.0;
    };
    
[SecureContext, Exposed=Window]
    interface XRWebGLLayer: XRLayer {
    constructor(XRSession session,
    XRWebGLRenderingContext context,
    optional XRWebGLLayerInit layerInit = {});
    // Attributes
    readonly attribute boolean antialias;
    readonly attribute boolean ignoreDepthValues;
    attribute float? fixedFoveation;
    
    [SameObject] readonly attribute WebGLFramebuffer? framebuffer;
    readonly attribute unsigned long framebufferWidth;
    readonly attribute unsigned long framebufferHeight;
    
    // Methods
    XRViewport? getViewport(XRView view);
    
    // Static Methods
    static double getNativeFramebufferScaleFactor(XRSession session);
    };
    
```

构造函数可以接受 3 个，除了上面章节讲的 XRSession 和 WebGL 上下文，还接受一个 `XRWebGLLayerInit` 对象，其中的 `antialias`、`depth`、`stencil` 和 `alpha` 与 WebGL 中的意义一样，这里不再详细讲解。

`ignoreDepthValues` 表示 XR 合成器是否可以读取深度缓存信息来帮助合成器渲染，如果深度缓存中存储的**不是**当前的场景深度缓存，那么合成器如果读取该值，可能会造成画面出现伪影。该参数或属性表示合成器是否忽略读取深度缓存。

`framebufferScaleFactor` 属性表示对 framebuffer 的缩放，UA 会有个缩放为 1 的默认 framebuffer 大小，该大小可能和 native 大小不一致，例如有些设备推荐使用低分辨率来保证性能。通过 `framebufferScaleFactor` 参数可以设置 UA 创建 framebuffer 的大小，例如缩放 0.5 将创建宽高是默认一半的 framebuffer。

如果想创建和 native 一样大的 framebuffer，可以使用 `getNativeFramebufferScaleFactor` 静态方法获取 native 大小的缩放，如下所示。

```ini
const nativeScaleFactor = XRWebGLLayer.getNativeFramebufferScaleFactor(xrSession);
const glLayer = new XRWebGLLayer(xrSession, gl, { framebufferScaleFactor: nativeScaleFactor });
xrSession.updateRenderState({ baseLayer: glLayer });

```

framebuffer 缩放每个 XRSession 只能配置一次，如果想再次配置需要重新创建一个 XRWebGLLayer。

```ini
    function rescaleWebGLLayer(scale) {
    let glLayer = new XRWebGLLayer(xrSession, gl, { framebufferScaleFactor: scale });
    xrSession.updateRenderState({ baseLayer: glLayer });
    });
    
```

这样重新配置会比较重，对性能有影响，不应该频繁做该操作。

`fixedFoveation` 属性表示固定注视点渲染级别，0 表示最小，1 表示最大，该技术会在用户注视的地方使用高分辨率，视线边缘使用低分辨率，提高性能，如果设备不支持，该属性则为 null。该值可以动态修改，修改过后的下一帧将应用最新的值。

`framebuffer` 属性表示是最终画面要渲染到的地方，如果是 `inline` 模式该值为 null。该 framebuffer 不能被检查和操作，如果对它执行 `deleteFramebuffer`、`getFramebufferAttachmentParameter` 等方法将会直接报错，如果在`session.requestAnimationFrame` 回调函数外面操作也会报错。

`framebufferWidth` 和 `framebufferHeight` 属性分别表示 framebuffer 的宽高。

### XRFrame

XRFrame 表示 XRSession 在给定时间点所有被跟踪状态的快照。XRFrame 可以在 XRSession 的 `requestAnimationFrame` 回调函数中获取，它的签名如下。

```ini
    [SecureContext, Exposed=Window] interface XRFrame {
    [SameObject] readonly attribute XRSession session;
    readonly attribute DOMHighResTimeStamp predictedDisplayTime;
    
    XRViewerPose? getViewerPose(XRReferenceSpace referenceSpace);
    XRPose? getPose(XRSpace space, XRSpace baseSpace);
    };
    
```

XRFrame 只在 `requestAnimationFrame` 回调函数中有效，一旦控制权返回给浏览器，XRFrame 就会被标记为失效，这时候再去访问上面的方法将会直接报错。

`session` 属性是创建它的 XRSession 对象。

`predictedDisplayTime` 是预测的该帧在设备上显示的时间点，对于 `inline` 模式，该值与 `requestAnimationFrame` 第一个参数相同。

`getViewerPose` 方法返回当前 XRFrame 时间点， XR 设备关联的referenceSpace 中观察者的空间姿势信息。

`getPose` 方法返回在当前 XRFrame 时间点，给定空间相对于 baseSpace 空间的姿势信息。

### XRReferenceSpace

XRReferenceSpace 继承于 XRSpace（空对象） 用于关联用户的物理空间，XRReferenceSpace 中的坐标系与 WebGL 中一致，+X 向右，+Y 向上，+Z 向后。XRReferenceSpace 签名如下。

```csharp
    enum XRReferenceSpaceType {
    "viewer",
    "local",
    "local-floor",
    "bounded-floor",
    "unbounded"
    };
    
[SecureContext, Exposed=Window]
    interface XRReferenceSpace : XRSpace {
    [NewObject] XRReferenceSpace getOffsetReferenceSpace(XRRigidTransform originOffset);
    
    attribute EventHandler onreset;
    };
    
```

目前 XRReferenceSpaceType 分为 5 种类型，分别如下。

*   `viewer` 表示具有原生原点的跟踪空间，一般用于不进行任何跟踪场景，任何设备都应该支持该类型
*   `local` 表示只跟踪用户旋转，不跟踪位置，可以理解为坐下，只用头部来观看场景
*   `local-floor` 与 `local` 类型相似，但是它是站立着的
*   `bounded-floor` 表示在安全区内跟踪旋转和位置，用户可以完全与场景进行交互
*   `unbounded` 表示用户可以自由在场景中移动和旋转，没有安全区限制

XRReferenceSpaceType 对象一般通过 XRSession 的 requestReferenceSpace 方法获取，对于 `bounded-floor` 类型，返回的是 XRBoundedReferenceSpace 对象，该对象继承于 XRReferenceSpaceType，签名如下。

```csharp
[SecureContext, Exposed=Window]
    interface XRBoundedReferenceSpace : XRReferenceSpace {
    readonly attribute FrozenArray<DOMPointReadOnly> boundsGeometry;
    };
    
```

多出来的 `boundsGeometry` 属性用于表示安全区，它是顺时针的点的数组。 `getOffsetReferenceSpace` 方法用于对空间进行调整，例如用手柄对现有空间进行一些旋转调整。

`onreset` 事件在空间被重置时触发，例如，用户校准 XR 设备或 XR 设备重连后自动切回原点。

### XRPose

XRPose 用于描述相对于 XRSpace 空间的位置和旋转，其签名如下。

```csharp
    [SecureContext, Exposed=Window] interface XRPose {
    [SameObject] readonly attribute XRRigidTransform transform;
    [SameObject] readonly attribute DOMPointReadOnly? linearVelocity;
    [SameObject] readonly attribute DOMPointReadOnly? angularVelocity;
    
    readonly attribute boolean emulatedPosition;
    };
    
```

`transform` 属性用于描述位置和旋转。

`linearVelocity` 属性用于描述线速度，米每秒。

`angularVelocity` 属性用于描述角速度，弧度每秒。

`emulatedPosition` 属性表示 `transform` 属性中的位置信息是否是模拟估计出来的。

#### XRViewerPose

XRViewerPose 继承与 XRPose，描述用户在跟踪的 XR 场景中的状态。其签名如下。

```csharp
    [SecureContext, Exposed=Window] interface XRViewerPose : XRPose {
    [SameObject] readonly attribute FrozenArray<XRView> views;
    };
    
```

它只多出一个 `views` 属性，它表示用户左眼或右眼看到的场景，必须每个 XRView 才能在 XR 设备上正确展示场景。

### XRRigidTransform

XRRigidTransform 用于表示位置和旋转信息，旋转信息优于位置信息，先应用旋转再应用位置。其签名如下。

```ini
[SecureContext, Exposed=Window]
    interface XRRigidTransform {
    constructor(optional DOMPointInit position = {}, optional DOMPointInit orientation = {});
    [SameObject] readonly attribute DOMPointReadOnly position;
    [SameObject] readonly attribute DOMPointReadOnly orientation;
    readonly attribute Float32Array matrix;
    [SameObject] readonly attribute XRRigidTransform inverse;
    };
    
```

`position` 属性用于描述位置信息。

`orientation` 属性用于描述旋转信息，它是四元数。

`matrix` 属性是描述位置和旋转的矩阵，和 WebGL 一样是列主序。

`inverse` 属性返回当前 XRRigidTransform 对象逆对象。

### XRView

XRView 表示单个视口，XR 设备向用户呈现的图像。其签名如下。

```csharp
    enum XREye {
    "none",
    "left",
    "right"
    };
    
        [SecureContext, Exposed=Window] interface XRView {
        readonly attribute XREye eye;
        readonly attribute Float32Array projectionMatrix;
        [SameObject] readonly attribute XRRigidTransform transform;
        readonly attribute double? recommendedViewportScale;
        
        undefined requestViewportScale(double? scale);
        };
        
```

`eye` 属性用于表示该 XRView 对应的眼睛，如果设备不区分左右眼则为 `'none'` `projectionMatrix` 属性为投影矩阵。

`transform` 属性表示 `getViewerPose()` 方法中提供的旋转和位置信息。

`recommendedViewportScale` 属性为设备推荐缩放。

`requestViewportScale` 方法可以修改该 XRView 缩放，该方法可以频繁调用，直到 `xrWebGLLayer.getViewport(xrView)` 获取它的 viewport 时才生效。

### XRViewport

XRViewport 用于表示单个 XRView 表示的视口，其签名如下。

```csharp
    [SecureContext, Exposed=Window] interface XRViewport {
    readonly attribute long x;
    readonly attribute long y;
    readonly attribute long width;
    readonly attribute long height;
    };
    
```

一般利用 XRWebGLLayer 获取该对象，获取到后直接设置 WebGL 的 viewport。

```ini
    xrSession.requestAnimationFrame((time, xrFrame) => {
    const viewer = xrFrame.getViewerPose(xrReferenceSpace);
    
    gl.bindFramebuffer(xrWebGLLayer.framebuffer);
        for (xrView of viewer.views) {
        const xrViewport = xrWebGLLayer.getViewport(xrView);
        gl.viewport(xrViewport.x, xrViewport.y, xrViewport.width, xrViewport.height);
    }
    });
    
```

### XRInputSource

XRInputSource 表示一个输入源，例如 VR 手柄，其签名如下。

```csharp
    enum XRHandedness {
    "none",
    "left",
    "right"
    };
    
        enum XRTargetRayMode {
        "gaze",
        "tracked-pointer",
        "screen"
        };
        
    [SecureContext, Exposed=Window]
        interface XRInputSource {
        readonly attribute XRHandedness handedness;
        readonly attribute XRTargetRayMode targetRayMode;
        [SameObject] readonly attribute XRSpace targetRaySpace;
        [SameObject] readonly attribute XRSpace? gripSpace;
        [SameObject] readonly attribute FrozenArray<DOMString> profiles;
        };
        
```

`handedness` 属性表示该输入设备是哪个手握持，如果不区分左右手或不知道则为 `'none'` 。

`targetRayMode` 属性用于描述如何呈现目标射线，`gaze` 类型为用户注视输入，`tracked-pointer` 类型为手柄输入的激光射线，一般为从食指射出，`screen` 为 `inline` 模式下的鼠标或触屏输入。

`targetRaySpace` 是 XRSpace 对象，用于跟踪该输入源的光线的旋转和位置信息。

`gripSpace` 是 XRSpace 对象，用于跟踪该输入设备（VR 手柄）的旋转和位置信息。

`profiles` 输入源的描述信息，通过它可以获取是哪个平台的 VR 手柄，这样就可以加载不同的 VR 手柄模型。

全景 VR 图片
--------

了解完了 WebXR ，下面来利用它来实现一个全景 VR 图片查看器，它可以在 VR 设备中全景查看 VR 图片。 目前有很多 VR 看房应用，它们是在桌面浏览器或手机上通过鼠标或手指滑动来查看全景图片，在 VR 设备中查看全景图片基本与在桌面浏览器中查看差不多，在 VR 设备中全景图片会包裹用户，带来更好的沉浸感，用户通过旋转头部来查看全景图片。

防止代码太多，下面 Demo 代码中将忽略 WebGL 相关代码，WebGL 相关代码和只在桌面浏览器中渲染没有区别。

```javascript
    function main() {
    const xr = navigator.xr
    let refSpace
    
    // 第一步检查当前环境
        if (xr) {
            xr.isSessionSupported('immersive-vr').then((supported) => {
                if (supported) {
                const btn = document.createElement('button')
                btn.textContent = '进入 VR'
                btn.onclick = onBtnClick
                document.body.appendChild(btn)
                    } else {
                    document.body.innerHTML = '当前设备不支持 VR'
                }
                    }).catch(() => {
                    document.body.innerHTML = '检测失败'
                    })
                        } else {
                        document.body.innerHTML = '当前浏览器不支持 WebXR'
                    }
                    
                    // 当前支持 VR 并且用户有意进入 VR
                        function onBtnClick () {
                        // 请求进入 VR 会话
                            xr.requestSession('immersive-vr').then(session => {
                            initWebGL() // 初始化 WebGL，创建 gl 上下文 等
                            session.updateRenderState({ baseLayer: new XRWebGLLayer(session, gl) });
                            // 设置渲染层
                            
                            // 请求 local 空间，我们只需要跟踪用户头部旋转
                                session.requestReferenceSpace('local').then(s => {
                                refSpace = s
                                session.requestAnimationFrame(onXRFrame); // 开始渲染
                                })
                                })
                            }
                            
                                function onXRFrame(time, frame) {
                                const session = frame.session;
                                session.requestAnimationFrame(onXRFrame);
                                const glLayer = session.renderState.baseLayer;
                                gl.bindFramebuffer(gl.FRAMEBUFFER, glLayer.framebuffer);
                                // 设置渲染 framebuffer
                                
                                const pose = frame.getViewerPose(refSpace)
                                // 获取旋转和视图信息
                                    if (pose) {
                                        pose.views.forEach(v => {
                                        // 渲染每一个 view，左眼和右眼
                                        const vp = glLayer.getViewport(v)
                                        gl.viewport(vp.x, vp.y, vp.width, vp.height)
                                        // 设置 gl 的viewport
                                        gl.uniform1f(eyeLoc, v.eye === 'right' ? 1 : 0)
                                        // 告诉着色器是左眼还是右眼，
                                        v.transform.matrix[12] = 0
                                        v.transform.matrix[13] = 0
                                        v.transform.matrix[14] = 0
                                        // local 类型，也可能传递位置信息，这里将它去除
                                        gl.uniformMatrix4fv(martixLoc, false, mat4.mul(mat4.create(), v.transform.matrix, mat4.invert(mat4.create(), v.projectionMatrix)));
                                        // 告诉着色器矩阵信息
                                        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
                                        // 渲染模型
                                        })
                                    }
                                }
                            }
                        }
                        
```

上面例子中主要分为 3 步。

1.  检查当前环境是否支持 VR。
2.  用户点击按钮表示要进入 VR，创建好 XRSession 会话和 XRReferenceSpace 空间。
3.  循环渲染画面，获取用户左眼和右眼视图和用户头部旋转信息分别渲染不同画面。

上面例子中渲染全景图片方式使用的是 equirectangular-3d 投影，这部分代码和本篇文章关联不大，这里就忽略相关的代码。

原始图如下。

![](/images/jueJin/5fe01fd51960457.png)

最终的渲染效果如下。

![](/images/jueJin/033500c0c51b4b1.png)

总结
--

利用 WebXR Device API 可以在 Web 环境访问到 XR 设备，它主要分为 3 种模式 `inline`、`immersive-vr` 和 `immersive-ar` **，** `inline` 模式还是渲染在浏览器页面中，而 `immersive-vr` 则是访问 VR 设备，将画面渲染到 VR 设备中，整体渲染过程与普通 WebGL 程序差不多，只不过画面要渲染到 XRWebGLLayer 的 framebuffer 中，并且区分左右眼。