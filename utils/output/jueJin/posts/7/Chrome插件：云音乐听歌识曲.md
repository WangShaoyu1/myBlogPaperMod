---
author: ""
title: "Chrome插件：云音乐听歌识曲"
date: 2022-05-05
description: "当你用网页在视频网站刷视频的时候，有没有碰到过一个 BGM 激起你内心的波澜，而你却不知道它的名字。此时只能打开手机进行听歌识曲，而通过一个浏览器的插件却更容易解决这个问题"
tags: ["Chrome","浏览器中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:30,comments:5,collects:21,views:3819,"
---
> 图片来源：[Chrome插件-云音乐听歌](https://link.juejin.cn?target=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2F%25E4%25BA%2591%25E9%259F%25B3%25E4%25B9%2590%25E5%2590%25AC%25E6%25AD%258C%2Fkemcalcncfhmdkgglekijclbomdoohkp%3Fhl%3Dzh-CN "https://chrome.google.com/webstore/detail/%E4%BA%91%E9%9F%B3%E4%B9%90%E5%90%AC%E6%AD%8C/kemcalcncfhmdkgglekijclbomdoohkp?hl=zh-CN")

> 本文作者：[空吾](https://link.juejin.cn?target=https%3A%2F%2Fwww.onehacker.top%2Fabout%2F "https://www.onehacker.top/about/")

当你用网页在视频网站刷视频的时候，有没有碰到过一个 BGM 激起你内心的波澜，而你却不知道它的名字。此时只能打开手机进行听歌识曲，而通过一个浏览器的插件却更容易解决这个问题。不需要繁琐的掏出手机，也不会因为需要外放而干扰他人，更不会因为环境噪音而识别困难。

> 如果你恰好也有这个需要，不妨试一下云音乐出品的 Chrome 浏览器插件[「云音乐听歌」](https://link.juejin.cn?target=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2F%25E4%25BA%2591%25E9%259F%25B3%25E4%25B9%2590%25E5%2590%25AC%25E6%25AD%258C%2Fkemcalcncfhmdkgglekijclbomdoohkp%3Fhl%3Dzh-CN "https://chrome.google.com/webstore/detail/%E4%BA%91%E9%9F%B3%E4%B9%90%E5%90%AC%E6%AD%8C/kemcalcncfhmdkgglekijclbomdoohkp?hl=zh-CN")，还可以直接进行红心收藏哦。也可以到[插件官网](https://link.juejin.cn?target=https%3A%2F%2Ffn.music.163.com%2Fg%2Fchrome-extension-home-page-beta%2F "https://fn.music.163.com/g/chrome-extension-home-page-beta/")预览实际运行的效果。

背景
--

目前 Chrome 商店上存在的听歌识曲插件，大都是国外出品，国内产品寥寥，对于国内音乐支持较差。既然云音乐有这个能力，我们希望将这样的功能覆盖每一个角落，传递音乐美好力量。与此同时市面上的插件大多还是基于 manifest v2 实现（相对于 manifest v3，安全性、性能、隐私性均较差），普遍的做法是将音频录制之后直接交给服务端，通过服务端进行指纹提取，徒增服务端计算压力，增加网络传输。 那么有没有办法既能使用 manifest v3 协议进行功能实现，同时将音频指纹提取这一计算放在前端呢？

Chrome浏览器插件新协议
--------------

本文的重心不在如何实现一个浏览器插件本身，如果你不了解插件本身的开发，可查阅 Google 官方的[开发文档](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.chrome.com%2Fdocs%2Fextensions%2Fmv3%2Fgetstarted%2F "https://developer.chrome.com/docs/extensions/mv3/getstarted/")。

特别说明的是，manifest v2（MV2） 即将被废弃，在 2022 年逐步不接受更新，2023 年将会逐步不能运行，本文所有的内容都是基于更安全、性能更好、隐私更强的 manifest v3（MV3）进行实现。

![](/images/jueJin/162b52f7fb364b8.png)

协议升级对功能的实现方式也会带来一些变化，因为 MV3 更安全的限制，一些基于 MV2 灵活的实现方式（例如：执行远程代码、可以使用 eval、new Function(...) 等不安全方法）将不能使用。而这会对听歌识曲插件带来一些实现上的难题。

**MV3 协议对插件实现核心影响点：**

*   原有的 Background Page 使用 Service Worker 进行替代，这意味着在 Background Page 不再能进行 Web API 等操作。
*   远程代码托管不再支持，无法进行动态加载代码，意味着可执行的代码都需要直接打包到插件中。
*   内容安全策略调整，不再支持不安全代码的直接执行。WASM 初始化相关函数无法直接运行。

听歌识曲的实现
-------

听歌识曲本身技术比较成熟，整体的思路是通过**音频数字采样**，进行音频**指纹的提取**，最后将指纹在数据库进行**匹配**，特征值最高的即是所认为识别到的歌曲。

![](/images/jueJin/123cd024f0e1473.png)

#### 浏览器插件中的音频提取

利用插件进行网页内的音视频录制其实非常简单，只需要 `chrome.tabCapture` API 即可实现网页本身的音频录制，获取到的流数据我们需要针对音频数据进行采样，保证计算 HASH 的规则和数据库数据保持一致。

针对获取的 stream 流可以进行音频的转录采样，一般有三种处理方式：

*   [createScriptProcessor](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FBaseAudioContext%2FcreateScriptProcessor "https://developer.mozilla.org/zh-CN/docs/Web/API/BaseAudioContext/createScriptProcessor")：此方法用于音频处理最为简单，但是此方法已经在 W3C 标准里标记为废弃。不建议使用
*   [MediaRecorder](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FMediaRecorder "https://developer.mozilla.org/zh-CN/docs/Web/API/MediaRecorder")：借助媒体 API 也可以完成音频的转录，但是没有办法做到精细处理。
*   [AudioWorkletNode](https://link.juejin.cn?target=https%3A%2F%2Fwww.w3.org%2FTR%2Fwebaudio%2F%23audioworkletnode "https://www.w3.org/TR/webaudio/#audioworkletnode")：用于替代 createScriptProcessor 进行音频处理，可以解决同步线程处理导致导致的对主线程的压力，同时可以按 bit 进行音频信号处理，这里也选择此种方式进行音频采样。

![](/images/jueJin/9dbf4ee25e5a484.png)

基于 AudioWorkletNode 实现音频的采样及采样时长控制方法：

1.  模块注册，这里的模块加载是通过文件的加载方式，PitchProcessor.js 对应的是根目录下的文件：

```javascript
    const audio_ctx = new window.AudioContext({
    sampleRate: 8000,
    });
    await audio_ctx.audioWorklet.addModule("PitchProcessor.js");
```

2.  创建 AudioWorkletNode，主要用于接收通过 `port.message` 从 WebAudio 线程传递回来的数据信息，从而可以在主线程进行数据处理：

```javascript
    class PitchNode extends AudioWorkletNode {
    // Handle an uncaught exception thrown in the PitchProcessor.
        onprocessorerror(err) {
        console.log(
        `An error from AudioWorkletProcessor.process() occurred: ${err}`
        );
    }
    
        init(callback) {
        this.callback = callback;
        this.port.onmessage = (event) => this.onmessage(event.data);
    }
    
        onmessage(event) {
            if (event.type === 'getData') {
                if (this.callback) {
                this.callback(event.result);
            }
        }
    }
}

const node = new PitchNode(audio_ctx, "PitchProcessor");
```

3.  处理 `AudioWorkletProcessor.process`，也就是 PitchProcessor.js 文件内容：

```javascript
    process(inputs, outputs) {
    const inputChannels = inputs[0];
    const inputSamples = inputChannels[0];
        if (this.samples.length < 48000) {
        this.samples = concatFloat32Array(this.samples, inputSamples);
            } else {
            this.port.postMessage({ type: 'getData', result: this.samples });
            this.samples = new Float32Array(0);
        }
        return true;
    }
```

取第一个输入通道的第一个声道进行数字信号的收集，收集到符合定义的长度（例如这里的48000）之后通知到主线程进行信号的识别处理。

> 基于 `process` 方法可以做很多有意思的尝试，比如最基础的白噪音生成等。

#### 音频指纹提取

提取到音频信号之后，下一步要做的就是对信号数据进行指纹提取，我们提取到的其实就是一段二进制数据，需要对数据进行傅里叶变换，转换为频域信息进行特征表示。具体指纹的提取的逻辑是有一套规整的复杂算法，常规的指纹提取方法：1) 基于频带能量的音频指纹；2）基于landmark的音频指纹；3）基于神经网络的音频指纹，对算法感兴趣的可以阅读相关论文，例如：[A Highly Robust Audio Fingerprinting System](https://link.juejin.cn?target=http%3A%2F%2Fciteseerx.ist.psu.edu%2Fviewdoc%2Fdownload%3Bjsessionid%3D152C085A95A4B5EF1E83E9EECC283931%3Fdoi%3D10.1.1.103.2175%26rep%3Drep1%26type%3Dpdf "http://citeseerx.ist.psu.edu/viewdoc/download;jsessionid=152C085A95A4B5EF1E83E9EECC283931?doi=10.1.1.103.2175&rep=rep1&type=pdf") 。整个运算有一定的性能要求，基于 WebAssembly 进行运算，可以获得更好的 CPU 性能。现如今，C++/C/Rust 都有比较便捷的方式编译成 WebAssembly 字节码，这里不再展开。

接下来，当你尝试通过在插件场景中运行 WASM 模块初始化的时候，你大概率会遇到如下异常：

```javascript
Refused to compile or instantiate WebAssembly module because 'wasm-eval' is not an allowed source of script in the following Content Security Policy directive: "script-src 'self' 'unsafe-inline' 'unsafe-eval' ...

```

这是因为在使用 WebAssembly 的时候需要遵循严格的 CSP 定义，对于 Chrome MV2 可以通过追加 `"content_security_policy":"script-src 'self' 'unsafe-eval';"` 进行声明解决。而在 MV3 中，由于更加严格的隐私及安全限制，已经不允许这种简单粗暴的执行方式了。 MV3 中，对于插件页面 CSP 定义中的`script-src object-src worker-src` 只允许取值为：

*   `self`
*   `none`
*   `localhost` 也就是没有办法定义 unsafe-eval 等属性，所以想单纯在插件页面里直接运行 wasm 已经不可行了。 到这似乎已经到了绝路？方法总比问题多，细品文档，发现文档有这样一句描述：

> CSP modifications for sandbox have no such new restrictions. —— [Chrome插件开发文档](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.chrome.com%2Fdocs%2Fextensions%2Fmv3%2Fintro%2Fmv3-migration%2F%23content-security-policy "https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/#content-security-policy")

也就是说这种安全限制在沙盒模式下是没有的。插件本身可以定义 [sandbox](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.chrome.com%2Fdocs%2Fapps%2Fmanifest%2Fsandbox%2F "https://developer.chrome.com/docs/apps/manifest/sandbox/") 页面，这种页面虽然无法访问 web/chrome API，但是它可以运行一些所谓“不安全”的方法，例如 `eval、new Function、WebAssembly.instantiate` 等。 所以可以借助沙盒页面进行 WASM 模块的加载及运行，将计算的结果返回给主页面，整体的指纹采集的流程就变成，如下图：

![](/images/jueJin/a453e3db7b154af.png)

对于主页面和沙盒页面如何进行数据通信，可以通过在主页面里边加载 iFrame 的方式，借助iFrame的 contentWindow 和主 window 进行数据联通，数据流程如下图：

![](/images/jueJin/f92581ccdb894ad.png)

到这里完成了基本的音频的提取及指纹提取的过程，剩下的部分就是通过指纹在数据库进行特征匹配。

#### 特征匹配

提取到的音频指纹后，接下来就是到指纹库里进行音频检索。指纹库可以用散列表实现，每个表项表示相同指纹对应的音乐ID和音乐出现的时间，构建出指纹数据库。从数据库中访问提取的指纹即可获取匹配的歌曲。当然这只是一个基本流程，具体的算法优化方式各家还是有很大的差异，除了版权原因，算法直接导致了各家匹配的效率和正确率。而插件这里的实现还是以效率优先的方式。

写在最后
----

以上大致描述了基于 `WebAssembly` 与 MV3实现听歌识曲插件的大致流程。插件虽然灵活易用，但是 Google 也意识到了插件带来的一些安全、隐私等问题，从而进行了一次大规模的迁移。MV3 协议更加具备隐私和安全性，但也限制了不少功能的实现，在2023年之后会有大批量的插件无法继续使用。

关于[听歌识曲插件](https://link.juejin.cn?target=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2F%25E4%25BA%2591%25E9%259F%25B3%25E4%25B9%2590%25E5%2590%25AC%25E6%25AD%258C%2Fkemcalcncfhmdkgglekijclbomdoohkp%3Fhl%3Dzh-CN "https://chrome.google.com/webstore/detail/%E4%BA%91%E9%9F%B3%E4%B9%90%E5%90%AC%E6%AD%8C/kemcalcncfhmdkgglekijclbomdoohkp?hl=zh-CN")目前已完成的功能包括音频识别、红心歌单收藏等，后续还将继续功能拓展，希望这个小功能可以帮助到你。

参考资料
----

*   [developer.mozilla.org/en-US/](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2F "https://developer.mozilla.org/en-US/")
*   [developer.chrome.com/docs/apps/](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.chrome.com%2Fdocs%2Fapps%2F "https://developer.chrome.com/docs/apps/")
*   [www.w3.org/TR/webaudio…](https://link.juejin.cn?target=https%3A%2F%2Fwww.w3.org%2FTR%2Fwebaudio%2F%23widl-AudioContext-createScriptProcessor-ScriptProcessorNode-unsigned-long-bufferSize-unsigned-long-numberOfInputChannels-unsigned-long-numberOfOutputChannels "https://www.w3.org/TR/webaudio/#widl-AudioContext-createScriptProcessor-ScriptProcessorNode-unsigned-long-bufferSize-unsigned-long-numberOfInputChannels-unsigned-long-numberOfOutputChannels")
*   [developer.mozilla.org/zh-CN/docs/…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWebAssembly%2FC_to_wasm "https://developer.mozilla.org/zh-CN/docs/WebAssembly/C_to_wasm")
*   [citeseerx.ist.psu.edu/viewdoc/dow…](https://link.juejin.cn?target=http%3A%2F%2Fciteseerx.ist.psu.edu%2Fviewdoc%2Fdownload%3Bjsessionid%3D152C085A95A4B5EF1E83E9EECC283931%3Fdoi%3D10.1.1.103.2175%26rep%3Drep1%26type%3Dpdf "http://citeseerx.ist.psu.edu/viewdoc/download;jsessionid=152C085A95A4B5EF1E83E9EECC283931?doi=10.1.1.103.2175&rep=rep1&type=pdf")

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！