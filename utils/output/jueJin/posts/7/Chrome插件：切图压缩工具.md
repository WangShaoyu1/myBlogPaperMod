---
author: ""
title: "Chrome插件：切图压缩工具"
date: 2023-04-18
description: "在前端项目开发中，尤其是活动项目，大量使用未压缩的图片必将会影响页面打开速度，降低用户体验。因此，我们需要对下载的切图进行压缩处理。"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:37,comments:9,collects:47,views:5656,"
---
> 本文作者：lkl

前言
--

在前端项目开发中，尤其是活动项目，大量使用未压缩的图片必将会影响页面打开速度，降低用户体验。因此，我们需要对下载的切图进行压缩处理。常见的图片压缩工具有 `TinyPNG` 和 `PP鸭`，但这两款软件是收费的，并且不支持定制化。使用这些软件压缩图片的过程更是复杂繁琐，如果有一款工具可以在下载切图时就帮助我们压缩图片，或直接提供压缩后的图片地址，那将会大大提高当前的工作效率。本文将介绍实现这样一个切图压缩工具的关键技术点。

获取原图片
-----

常用的设计稿软件有两个，蓝湖和 Figma。这里用蓝湖作例简述如何获取原图。首先蓝湖是一个网页，需要用 Chrome 打开。这时候就必须祭出 `F12` 这个大杀器了，直接调试源码来定位下载操作的走向。会发现在最终下载图片的代码块中有以下一段。

![image-20230210162923928](/images/jueJin/f7d2fd6f4a9db5d.png)

这里的 `t` 变量就是一个 `a` 标签，通过调用 `dispatchEvent` 方法来触发 `click` 事件进行文件下载。知道了下载方式，下一步就是如何去拦截它。直接上原型大法，把 `dispatchEvent` 方法给重写以便拿到 `a` 标签实例，来获取要下载的文件信息。

```js
const originDispatchEvent = EventTarget.prototype.dispatchEvent;
    Object.defineProperty(HTMLAnchorElement.prototype, 'dispatchEvent', {
    writable: true,
    configurable: true,
    enumerable: true,
        value: function (event) {
        const nodeName = this.nodeName;
        const href = this.href;
        const filename = this.download;
            if (nodeName === 'A' && filename && /^blob:/.test(href)) {
            console.warn(filename, href);
            return false;
        }
        return originDispatchEvent.apply(this, [event]);
    }
    });
```

把以上代码输入到控制台，点击下载图片就会看到这样的日志输出。至此便能拿到下载的切图数据了。

![image-20230210163156375](/images/jueJin/e740ec0860d6bac.png)

插件注入脚本
------

有了可以拦截下载数据的脚本，那如何把它利用起来，实现自动注入呢？这就必须使用到 Chrome 插件了。可以使用其提供的 [`scripting_api`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.chrome.com%2Fdocs%2Fextensions%2Freference%2Fscripting%2F "https://developer.chrome.com/docs/extensions/reference/scripting/") 实现。

```js
    function inject(eventName) {
    const originDispatchEvent: Function = EventTarget.prototype.dispatchEvent;
        Object.defineProperty(HTMLAnchorElement.prototype, 'dispatchEvent', {
        writable: true,
        configurable: true,
        enumerable: true,
            value: function (event) {
            const nodeName = this.nodeName;
            const href = this.href;
            const filename = this.download;
                if (nodeName === 'A' && filename && /^blob:/.test(href)) {
                // ...
                return false;
            }
            return originDispatchEvent.apply(this, [event]);
        }
        });
    }
    
    // 在网页刷新后，注入拦截脚本
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (tab.status === 'complete' && /^https?/.test(tab.url || '')) {
            // 在指定的tab页下执行函数
                chrome.scripting.executeScript({
                func: inject,
                target: { tabId },
                world: 'MAIN',
            args: [SITE_DOWN_IMAGE]
                }).catch((err) => {
                console.error(err);
                });
            }
            });
```

需要注意的是注入时配置 `world: 'MAIN'` 是必须的，否则注入的脚本将在隔离环境中运行，就无法访问页面上的 `JS` 环境了。

拦截到下载的切图数据后，可以通过 [`postMessage`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWindow%2FpostMessage "https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage") 发送给插件的内容脚本。下面就是在内容脚本中来实现图片压缩的能力。

压缩能力实现
------

那要如何实现一个可以在网页中使用的压缩工具呢？先看下现有的压缩工具 TinyPNG 和 PP鸭，一个是网页一个是本地 App。本地 App 肯定是不行了，TinyPNG 理论上是没问题的，其有提供压缩接口。但由于它是收费的且需要上传，也没法直接使用。经过查询资料，了解到业界开源的 `PNG` 图片压缩工具有 [`pngquant`](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fkornelski%2Fpngquant "https://github.com/kornelski/pngquant")，[`advpng`](https://link.juejin.cn?target=https%3A%2F%2Fwww.advancemame.it%2Fdoc-advpng.html "https://www.advancemame.it/doc-advpng.html")，[`oxipng`](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fshssoichiro%2Foxipng "https://github.com/shssoichiro/oxipng") 等，经过尝试，选取 `pngquant` 和 `advpng` 来进行 `PNG` 图片的压缩。

*   pngquant

这是一个命令行工具，用于 `PNG` 图片的有损压缩。其转换后的图片可以降低高达 `70%` 的大小，并且保留了完整的 `alpha` 透明度，生成的图像与所有 `Web` 浏览器和操作系统兼容。具有以下特点：

1.  使用矢量量化算法的组合，生成高质量的调色板
2.  与标准的 `Floyd-Steinberg` 相比，独特的自适应抖动算法为图像增加了更少的噪音

> 引用自 pngquant 官网简介

*   advpng

这是一个 `PNG` 图片的无损压缩库，通过移除 `PNG` 图片中的辅助块，整合 `IDAT` 数据块和使用 `7zip Deflate` 进行更高比例的压缩实现。

那如何把他们用到 Web 上呢？那必须要是 [`WebAssembly`](https://link.juejin.cn?target=https%3A%2F%2Fwebassembly.org%2F "https://webassembly.org/") 呀。首先把这两个库整合到一起，使用 `Emscripten` 编译成 `Wasm`，提供接口以便前端调用。这个过程中你可能会遇到这些问题：

1.  **内存文件转换**

由于 `pngquant` 是一个命令行工具，其压缩操作都是基于磁盘文件读写的，但是在 `WebAssembly` 传参时需要的是字节数组，都是在内存中的。就需要对源码进行一定的改造。主要是将 `fopen` 替换为 `fmemopen` 或 `open_memstream` 实现在内存数据中进行 `FILE` 的操作。如读取文件修改。

```c
FILE *infile;
    if ((infile = fopen(filename, "rb")) == NULL) {
    fprintf(stderr, "  error: cannot open %s for reading\n", filename);
    return READ_ERROR;
}
// 修改为如下
    if ((infile = fmemopen(file_buffer, file_size, "rb")) == NULL) {
    return READ_ERROR;
}
```

2.  **内置 libpng 和 zlib 包**

在通过 `emcmake` 构建时，会发现无法使用系统安装的 `libpng` 和 `zlib` 动态库。需要将这两个库的源码下载到项目中，一起进行编译。

```cmake
...
file(GLOB PNG_SOURCE libpng/*.c)
file(GLOB ZLIB_SOURCE zlib/*.c)
...
add_library(${PROJECT_NAME} STATIC pngquant.c rwpng.c ${PNG_SOURCE} ${ZLIB_SOURCE} ${QUA_SOURCE} ${ADVPNG_SOURCE})
```

在内容脚本中，就能直接通过这个 Wasm 模块来实现图片的压缩了。在蓝湖中，内容脚本直接使用 Wasm 时并不会有任何阻力，但是放到 figma 中就会被内容安全策略所禁止。因为 figma 在响应时就直接设置了[内容安全策略](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FHTTP%2FCSP "https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP")，这时候就要借助 Chrome 插件提供的 [`sandbox`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.chrome.com%2Fdocs%2Fapps%2Fmanifest%2Fsandbox%2F "https://developer.chrome.com/docs/apps/manifest/sandbox/") 能力，通过在页面中新增 iFrame 页面来实现。

到此该工具的基本能力就都已经实现了，可以把要下载的切图数据拿到，经过内容脚本压缩后再下载。为了更方便使用切图，下一步就是要把压缩后的图片上传到 CDN 并提供 URL 来进行复制。

切图上传
----

到这里就简单起来了，以上已经可以在内容脚本中获取到压缩后的切图数据，下面就是把它上传到一个合适的图床平台了。如使用七牛云，唯一可能会遇到的问题是上传接口不支持跨域。这是就需要利用 Chrome 插件的[主机权限](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.chrome.com%2Fdocs%2Fextensions%2Fmv3%2Fdeclare_permissions%2F%23host-permissions "https://developer.chrome.com/docs/extensions/mv3/declare_permissions/#host-permissions")，把用的的接口配置上。

```json
// manifest.json
    {
    ...
        "host_permissions": [
        "https://rsf-z0.qiniuapi.com/*",
        "https://*.qiniu.com/*"
    ]
    ...
}
```

关于如何直接在前端上传文件到七牛，可以参考[七牛开发者文档](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.qiniu.com%2Fkodo%2F1283%2Fjavascript "https://developer.qiniu.com/kodo/1283/javascript")。这里唯一麻烦的可能是上传凭证的生成，七牛官方推荐的是在服务端生成凭证，前端 SDK 就没直接提供生成方法。可以参考[生成算法](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.qiniu.com%2Fkodo%2Fmanual%2Fupload-token "https://developer.qiniu.com/kodo/manual/upload-token")在前端实现。

```js
import { urlSafeBase64Encode } from 'qiniu-js';
import HmacSHA1 from 'crypto-js/hmac-sha1';
import encBase64 from 'crypto-js/enc-base64';

    function getUploadToken(bucket, secretKey) {
        const returnBody = {
        key: '$(key)',
        hash: '$(etag)',
        name: '$(fname)',
        size: '$(fsize)',
        width: '$(imageInfo.width)',
        height: '$(imageInfo.height)'
        };
            const putPolicy = JSON.stringify({
            scope: bucket,
            deadline,
            returnBody: JSON.stringify(returnBody)
            });
            
            const encodedPolicy = urlSafeBase64Encode(putPolicy);
            
            const hash = HmacSHA1(encodedPolicy, secretKey);
            const encodedSigned = hash.toString(encBase64);
            
            return this.accessKey + ':' + safe64(encodedSigned) + ':' + encodedPolicy;
        }
```

切图管理
----

如果你使用的 CDN 有现成的列表接口，那直接调用就行。但如七牛并没有提供好用的列表接口，为了管理上传的图片列表，就需要在前端保存切图列表，这时你就要选择一个合适的存储。你能想到的可能会有 `localStorage`，`Cookie`，`IndexedDB`，可能还会有 `chrome.stroage`。考虑到切图列表的性质，其需要较大的存储空间并且要能方便的进行分页查询，那这样使用 `IndexedDB` 作为存储将会是一个更好的选择。

下面就来用 `IndexedDB` 实现切图管理的功能，方便查看已上传的切图列表。首先明确两个接口定义：

*   新增已上传的切图
*   分页查询已上传的切图

```ts
// 存储的数据结构
    interface ImageEntry {
    name: string
    width: number
    height: number
    size: number
    cdnUrl: string
    uploadTime: number
}

// 接口定义
    interface IImageDB {
    add(...images: ImageEntry[]): Promise<void>
    findPage(page: number, limit: number): Promise<ImageEntry>
}
```

借助开源库 [`dexie`](https://link.juejin.cn?target=https%3A%2F%2Fdexie.org%2F "https://dexie.org/") 实现起来也很简单

```js
import Dexie from 'dexie';

    export default class ImageDB {
        constructor(name = 'zimagedb') {
        let db = new Dexie(name);
            db.version(1).stores({
            images: '++_id,name,cdnUrl'
            });
            this.db = db;
        }
        
            async add(...datas) {
                for (const item of datas) {
                await this.db.images.add(item);
            }
        }
        
            async findPage(page = 0, limit = 10) {
            const offset = page * limit;
            return this.db.images.limit(limit).offset(offset).toArray();
        }
    }
```

为了能让 IndexedDB 储存唯一，你应该把它放在 Chrome 扩展的背景页内，再通过消息通信在内容脚本中使用。

```js
// 如background.js监听消息
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'getImages') {
            db.findPage(message.page).then(images => {
            sendResponse({ success: true, images });
                }).catch(err => {
                ...
                });
                return true;
            }
            });
            
            // 在content.js中查询切图列表
                function getImages(page = 0) {
                    return new Promise((resolve, reject) => {
                        chrome.runtime.sendMessage({type: 'getImages', page}, response => {
                            if (response?.success) {
                            resolve(response.images);
                                } else {
                                reject(...);
                            }
                            });
                            });
                        }
```

总结
--

以上简述了该**切图压缩工具**的一些关键技术点。涉及到有 Chrome 扩展开发，JavaScript 原型的利用，WebAssembly 开发，IndexedDB 存储等。尤其是 WebAssembly 和 IndexedDB 这让本需依赖服务端才能实现的一些功能在前端也能很好的完成，给前端带来了更多的可能性。

参考资料
----

*   [developer.chrome.com/docs/extens…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.chrome.com%2Fdocs%2Fextensions%2Fmv3%2F "https://developer.chrome.com/docs/extensions/mv3/")
*   [github.com/kornelski/p…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fkornelski%2Fpngquant "https://github.com/kornelski/pngquant")
*   [www.advancemame.it/doc-advpng.…](https://link.juejin.cn?target=https%3A%2F%2Fwww.advancemame.it%2Fdoc-advpng.html "https://www.advancemame.it/doc-advpng.html")
*   [webassembly.org/](https://link.juejin.cn?target=https%3A%2F%2Fwebassembly.org%2F "https://webassembly.org/")
*   [developer.mozilla.org/en-US/docs/…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FIndexedDB_API "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API")
*   [developer.qiniu.com/kodo/1283/j…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.qiniu.com%2Fkodo%2F1283%2Fjavascript "https://developer.qiniu.com/kodo/1283/javascript")
*   [dexie.org/](https://link.juejin.cn?target=https%3A%2F%2Fdexie.org%2F "https://dexie.org/")

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！