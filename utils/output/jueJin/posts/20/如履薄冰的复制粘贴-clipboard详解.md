---
author: ""
title: "如履薄冰的复制粘贴-clipboard详解"
date: 2020-12-08
description: "本文从纯前端出发，因此不会涉及到类似flash或者插件之类跳过浏览器安全检测的操作实现的复制粘贴，完全基于浏览器下的安全限制与一些“奇技淫巧”去实现一个相对较为完整的复制粘贴功能。 本文将从浏览器自身的复制粘贴功能出发，带领大家了解复制粘贴背后的功能实现，对比多个富文本文档实现…"
tags: ["JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读18分钟"
weight: 1
selfDefined:"likes:68,comments:0,collects:85,views:6961,"
---
> 希沃ENOW大前端
> 
> 公司官网：[CVTE(广州视源股份)](https://link.juejin.cn?target=http%3A%2F%2Fwww.cvte.com%2F "http://www.cvte.com/")
> 
> 团队：CVTE旗下未来教育希沃软件平台中心enow团队

**本文作者：** ![](/images/jueJin/7f2eb71592e741f.png)

前言
--

本文从纯前端出发，因此不会涉及到类似`flash`或者插件之类跳过浏览器安全检测的操作实现的复制粘贴，完全基于浏览器下的安全限制与一些“奇技淫巧”去实现一个相对较为完整的复制粘贴功能。  
本文将从浏览器自身的复制粘贴功能出发，带领大家了解复制粘贴背后的功能实现，对比多个富文本文档实现，在浏览器的各种限制下，如何实现一个基于`JSON-MODEL`数据并且适用于类富文本的剪切板。  
 

复制粘贴的重要性
--------

面向`Google`和`npm`的打工人不可能不了解`CV`大法有多好，而复制粘贴早已成为我们平时工作生活的一部分。实际上对于文字处理，复制粘贴功能的重要性完全不可想象。  
而在代码中，使用表单元素并不少见。在表单元素中，输入框之类可输入载体，我们或许对于内部复制粘贴实现或许不得而知：  
例如从外部复制一张图片，粘贴到输入框中，却无法实现，而文字却可以？如何实现文字携带外部样式插入，跟`word`文档一样？又是如何在富文本中实现复制粘贴图片？如何自定义我们的复制粘贴功能？

复制粘贴的三驾马车
---------

在这里我们需要先了解三个概念：****MIME****、****DataTransfer****、****clipboardEvent****：

### 媒体类型（MIME）

实际上，当我们在表单元素，例如`input`，`textarea`中实现一次完整的复制粘贴，调用的就是浏览器的默认能力。  
首先我们要先了解一下什么是MIME：  
**媒体类型（通常称为 Multipurpose Internet Mail Extensions 或 MIME 类型 ）是一种标准，用来表示文档、文件或字节流的性质和格式；**  
`MIME`的结构实际上也非常简单：由类型和子类型组成，两个字符串中间用`'/'`分割组成**type/subtype**。不允许空格存在。  
常见的MIME类型有：`text/plain，text/html，image/png，application/json`等；  
例如我们在写`script`或者`style`定义的时候：

```html
<style type="text/css"></style>
<script type="text/javascript"></script>
```

  
或者平时请求后端接口的时候：  

![](/images/jueJin/f7e727233e7a4eb.png)

  
熟悉接口规范或做过后端服务的应该都知道，`content-type`字端的定义与后端程序的解析实际上是息息相关的，在调试接口的时候，经常会出现`content-type`与发送的数据不一致的情况，例如后端需要的是`application/json`的数据，这时候如果传递的是`application/x-www-form-urlencoded`格式的话，一般会产生错误的状态码返回。这时候就需要前端针对`content-type`做相应的数据处理。  
当然还有一些特殊的实现：`Content-Type: multipart/byteranges; boundary=xxxx`去告知浏览器，数据切割成多个部分，实现类似于音视频分段加载的功能；  
也就是说浏览器想知道你的数据是什么类型的数据，需要做什么样的解析或者下载处理（例如解析到媒体或者文档文件，一般会当成资源下载），需要通过`MIME`获知；  
在复制粘贴过程中，实际上，也是需要通过`MIME`去进行对应的解析处理。

### DataTransfer

![](/images/jueJin/9f2ff79d689840d.png)

实际上，MDN上的这个解释并不完整，除了`drag events`还可以在`paste，copy,cut`等事件上获取。我更倾向于文档中的“**移动数据**”都可以用`DataTransfer`来进行定义。  
`DataTransfer`有多个属性和方法，但是大部分都是在`drag`下产生或者才能使用的。例如`files`只适用于`drag`事件，如果拖动操作不涉及拖动文件，则属性为空数组：  
所以我们只关注**items**这个属性。`items`是`Data`对象；  
还有一对方法：

*   **setData**（format，data）用于设置内容；
*   **getData**（format）获取内容；

### clipBoardEvent

`clipboardEvent`是浏览器支持的通用剪切板事件。包括了`paste、cut、copy`等事件相关；  
在复制粘贴下我们也只需要关注这两个属性：  
**type**: 描述了事件的触发类型；  
**clipboard**: 一个`DataTransfer`对象；

浏览器的默认实现
--------

在浏览器下，一般复制粘贴会使用浏览器通用的标准MIME格式（来源自MDN截图）：  

![](/images/jueJin/e457b3d5fa824b7.png)

  
例如在`input`和`textarea`复制粘贴中都只接收`text/plain`的`MIME`类型，这也可能是所有软件（还没遇见过不支持这种格式的）都会支持的默认文本格式。  
当然，如果你的`input type`设置为`file`是可以支持选择其他文件类型的，这里不多做讨论。

富文本的场景
------

在富文本中，除了纯文本也就是`text/plain`这种类型之外，一般还需要支持另外两种`MIME`类型，分别是`text/html`和`image/png`（这里单纯指复制粘贴）  
**text/html：**  
例如实现一个功能：从`word`之类的文档复制粘贴一段文本，要求样式和格式保持一致性，这应该是富文本很常见的功能；  
这时候，如果我们直接获取`text/plain`的话，只能获取到对应的纯文字版本。这时候就需要我们去拿`text/html`类型的文本。值得注意的是，一般的文字编辑器（`word，ppt`，金山文档......），获取到的并不是标准的html格式，或者说，带有大量的多余数据，这时候，我们可能需要主动去进行一次数据清洗，只保留我们需要的数据。一般可以在获取数据后，使用正则去清除多余的数据，在`ueditor、wangeditor`等常见的富文本中可以看到对应的数据处理。  
**image/png：**  
复制图片，一般是从外部进行复制粘贴；  
 

当下的场景
-----

首先我需要在一个类似`PPT`文档下实现一个复制粘贴的功能包括，可复制文本和图片并粘贴到我们的页面上，其次需要支持内部定义好的其他元素，最后需要支持跨标签页甚至是跨浏览器在我们的页面上保持一致性的复制粘贴交互；  
并且由于`JSON`数据与`html`数据之间并不相通，例如在普通的富文本编辑器中，直接复制，基本都是直接拿到的`html`数据；而当前的场景下，因为使用了`MVVM`框架的原因，我们是将所有的`dom`转化成单个的`model`数据，因此你复制出来的数据需要做单独的处理，并不能直接粘贴到任何富文本上。  
于是遇到了以下的问题：

### 1. 浏览器的剪切板安全限制

浏览器对于剪切板是有严格的安全限制的：不允许直接读取剪切板内容，除非使用提案中的`navigator.clipboard.readText / navigator.clipboard.read`进行权限的询问，用户主动通过后，可以直接读取；但是这是有风险的，首先，这个提案还是在`draft`的阶段，当然通过的几率很大，毕竟为了取代`document.execCommand`存在的，但是我们程序必须是向下兼容的。其次，倘若用户主动禁止了这个方法，那么后续的粘贴操作还是有问题。所以必须在现有的标准下操作才行；

`Google Slides`上实现：

1.  主动询问用户是否安装插件，在插件上跳过这层安全限制；
2.  不安装的情况下，在`safari`点击粘贴你会发现又弹出来一个小按钮，这是因为`safari`有可以定制化菜单的能力；

### 2. 右键菜单定制化的窘境

而且实际上，在大多数的这种情景下，右键菜单也是定制化的。一般来说，我们可以直接调用右键菜单的进行符合浏览器行为的复制粘贴，但是，如果想要定制化菜单，当然可以监听`contextMenu`事件，然后主动阻止默认行为，例如腾讯文档或者`Google Slides`那样。但是有些浏览器的行为就会被隐藏甚至无法主动调用：例如复制粘贴。甚至有些web文档点击菜单上的粘贴按钮，直接弹出提示希望用户直接使用快捷键粘贴，这当然很反人类。  
基于以上两点，是需要有自己的一套内存数据，在剪切板和右键菜单提供数据，然后在必要的时候主动更新`clipboard`，让系统的粘贴内存数据和内部的内存数据达成统一。  
这里有一个技巧，就是可以使用`document.execCommand('copy/cut')`去主动更新`clipboard`里的数据。当你在右键点击复制的时候，倘若需要主动更新数据到剪切板上，可以主动调用，获取`cut/copy`事件抛出的`clipboardData`，然后使用该对象下的`setData`，对内外数据统一，在跨标签页上保持数据的流通很有作用。

```typescript
    private bindCopy = (e) => {
    ......
    console.error('copy');
    e.preventDefault();
    this.duplicate.attemptToCopy(e, false);
    };
    
    // Duplicate类
    /**
    * 复制/剪切
    * @param e ClipboardEvent
    * @param isCut 是否为剪切
    * 1. 主动快捷键复制粘贴
    * 2. 右键菜单点击复制(不存在clipboardData对象)
    * 3. 主动塞入自定义数据
    */
        public attemptToCopy(e: ClipboardEvent | null, isCut = false) {
        this.isCutCommand = isCut;
        
            if (e && e?.clipboardData) {
            const clipboardData = this.updateStash();
            clipboardData && this.updateClipboard(e, clipboardData);
                } else {
                this.autoCopy();
            }
        }
        
        /**
        * 自动拷贝
        * 1. 支持execCommand时，相当于复制后重新走一次addEventListener('copy')
        * 这时候可以拿到e.clipboardData对象，可以执行上面的updateStash
        * 好处：可以在copy里setData，设置标志位；缺点：execCommand有风险为被废除
        * 2. 不支持时，使用writeText
        * 好处：降级处理；缺点：无法设置特殊MIME，只能在getData('text/plain')里判断
        */
            public autoCopy() {
                if (!document.execCommand(this.isCutCommand ? "cut" : 'copy')) {
                const clipboardData = this.updateStash();
                clipboardData && navigator.clipboard.writeText(JSON.stringify(clipboardData));
            }
        }
```

当然，我这里做了一点兼容，毕竟`document.execCommand`方法是个废除的状态。当然使用`navigator.clipboard.write`也是可以的。

### 3. 定制化MIME类型之殇

我们通过`clipboard`也就是`DataTransfer`是可以直接我们的内部数据的，  
比如我们给予一个特殊的标示类似 **text/copy**, 也就是我们自己定义`MIME`类型，那么下次我们就可以直接通过`getData('text/copy')`获取，感觉是不是很好？  
这好比说标准的`MIME`类型是个硬通货，那么多年下来，所有地区（浏览器厂商和系统软件）都支持，并且也有自己的兑换方法（通用的`MIME`解析），而我们自己定义的`MIME`却是一个不知哪里冒出来的数字货币，肯定是不被市场认可的，只能在内部使用。同理：在一般情况下，这完全是可行的。但是毕竟这不是标准的`MIME`类型，无法实现跨浏览器获取。也就是说，某些极端场景是不行的。  
那么为什么我们要自己设置`MIME`呢？首先通用的`MIME`除了`text/plain`之外，其余的类型都会主动添加该类型下所需的数据，例如`text/html`的话，会在首尾添加对应的`xml`格式数据，而其他的在前面也说过，会经过一次`MIME`解析，对于标准但特殊的`MIME`格式可能会有一些特殊添加数据或者解析操作。  
其次，跨浏览器目前为止我只看到`text/plain`和`text/html`是可以传递数据的，其余的一律被过滤......但是如果直接设置`text/plain`是会造成，所有的复制内部数据都会暴露在外面的粘贴事件上，如果是普通的文本数据倒还好，如果是内部的保存的格式化数据，就会让用户感觉很奇怪。  
那么初步是敲定使用一个特殊的`MIME`类型+一个`text/html`，可以做到对内部数据的解析。  
想法很美好，然而这时候你会遇到另外一个问题：对于部分富文本编辑器，获取的基本都是`text/html`再去做一层解析，这时候你的数据就会暴露给别人了。对于这个，如果是复制给外部粘贴，那么不好意思，没有好的方法，因为你要保持数据的统一性和跨浏览器行为。如果是内部的编辑器就要去匹配，如果是内部数据，那么直接过滤掉。  
当然还有可能会有一些特殊情况，例如外部复制一张`svg`图片，实际上，`svg`是`xml`格式的文本数据，小的`svg`图片当然还好，如果是大的图片，那么不保证浏览器不会卡死。那么这时候你可能需要`text/plain`顺带着做前置判断......

**当然，如果不需要处理跨浏览器，那么并不需要那么麻烦，只需要保持一个自定义的MIME类型即可。  
**

一般来说，我们获取剪切板内容判断，是会先从内部数据开始判断的，也就是自定义的MIME类型，然后是图片类型，最后才是纯文本类型；

```typescript
import { SPEC_MIME } from "../util/variable";

    class PasteHelper {
    // 获取img数据
// 网上图片直接右键复制: [text/html, image/png]
// ppt/截图工具 [image.png]
// ppt文字：[text/plain,text/html,text/rtf,image/png]

// RTF: 微软下的跨文本格式
// https://zh.wikipedia.org/wiki/RTF
    public getImgTransData(e: ClipboardEvent) {
        if (!e.clipboardData?.items?.length) {
        return false;
        };
        const transferDatas = Array.from(e.clipboardData.items);
        const isText = transferDatas.find(c => c.type === 'text/rtf');
        
        // 需要处理视频类的情况，返回img，但是getAsFile为null
            if (!isText) {
            const imgTransData = transferDatas.filter(c => c.kind === 'file' && c.type.indexOf('image') === 0)[0];
                if (!imgTransData) {
                return false;
                    } else {
                    const imgFile = imgTransData.getAsFile();
                        if (imgFile) {
                        return imgFile;
                    }
                }
                };
                return false;
            }
            
            /**
            * 判断是否为内部数据
            * 降级SPEC_MIME -> htmlData(跨浏览器) -> plainText(execommand不可用，走writeText)
            * @param e ClipboardEvent
            */
                public getInnerData (e: ClipboardEvent) {
                const innerData = e.clipboardData?.getData(SPEC_MIME);
                ......
            }
            
            // 获取纯文本，空白字符过滤
                public getPlainText (e: ClipboardEvent) {
                // 过滤特殊字符,给予空字符串
                const reg = /[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
                let text = e.clipboardData?.getData('text/plain') || "";
                text = text.replace(reg, " ");
                return text ?? false;
            }
        }
        
        export default new PasteHelper();
        
```

###  4. 地狱是平台兼容

一般来说，复制粘贴的话我们希望能跟`word、ppt`等本地应用交互一致。然而想象很丰满，现实很骨感。  
在多个平台下，支持的程度不同，甚至实现起来，获取到的数据也完全不同。  
下表是从外部来源复制，粘贴到内部的获取数据情况：

外部来源

文本

图片

文本框

音视频

网页（正常情况）

支持

支持

转换为文本

不支持

google slide

支持

不支持

转换为文本

不支持

腾讯文档

支持

不支持

转换为文本

不支持

office ppt（web）

支持

不支持

不支持

不支持

金山文档（web）

支持

不支持

不支持

不支持

office （ppt/excel）

支持

支持

转换为文本

转换成图片

wps

支持

不支持

不支持

不支持

keynote

支持

支持

转换为文本

转换成图片

numbers

支持

支持

转换为文本

不支持

windows（系统)

支持

不支持

\-

不支持

uos(系统)

支持

转换成文本

\-

转换为文本

mac(系统)

支持

支持

\-

转换为文本

   
`Google Slides` 、腾讯文档等`web`应用不支持复制图片，需要单独解析`text/html`数据里的图片，也就是需要做字符串解析，实际上是可以做到；  
金山文档、`office`等`web`应用不支持文本框和文本的原因是，这些应用使用了内部协议，我们一般不针对特殊协议（`MIME`）做处理；  
`windows`系统不支持图片和音视频复制粘贴，经测试，在该系统下只能拿到纯文本；  
像这种情况，你只能抱住产品爸爸的大腿，然后说：臣妾做不到......  

###  5. 媒体文件的处理之阿克琉斯之踵

基于内部数据的信任，一开始你或许只想着复制数据，序列化之后塞到我们定制好的`MIME`类型里面，下一次再拿出来反序列化就好了。  
然而，一开始我们的产品对多媒体的文件（音视频、图片）做了特殊处理：在一上传到我们页面的时候单纯转成`blob`，保存在内存里，等下一次同步的时候再去做一次上传到云端的处理。这种做法一定程度上可以提高用户的体验，毕竟不需要一上传就必须要经过一次上传云端的操作。  
但是在这里就有一个弊端了：跨标签页的时候，如果上一个的标签页关闭，那么势必`blob`链接会失效，因为`blob`的内存或者说引用地址是保存在上一个标签页的，但是如果这时候去改动的话，影响范围会变得比较广。  
这时候，只能采取降级方案：已经上传到云端上的，直接获取链接地址；还未上传的，是`blob`链接的只能先复制blob地址，在新的标签页，先通过`fetch`下载到当前页面，然后就可以跟普通文件一样处理了。当然这会有两个问题： 一、在复制完后，立刻关闭当前页面，那么`blob`内存会被释放，也是无法在下载的，考虑到这种情况的话那就只能复制的时候直接上到云端，或者在空闲时间，静默上传；二、在跨浏览器上，无能为力，也只能是云端链接格式才行。  
`Google slides`就是`blob`在转`url`的做法，而腾讯文档就是直接上传，语雀则是先用一张`base64`展示在上传。  
当然或许有人会说，可以先将文件转成`base64`的格式，但是我们复制一般可能会有多个媒体文件，这时候`base64`就会耗费时间生成，而且数据量可能会超过剪切板内存大小。毕竟找不到可以在浏览器间传递二进制文件的方法，只能先采用这种恶心的方法。

```typescript
    if (isBlobUrl(model.source)) {
        if (medias[model.hash]) {
        model.source = medias[model.hash];
            } else {
            let blob;
                if (blob = await url2blob(model.source)) {
                // 根据blobUrl重新创建当前页面的blob
                const file = await blob2File(blob, model.mediaName || model.pictureName);
                const blobUrl = await file2BlobUrl(file);
                model.source = blobUrl;
                // 缓存media数据
                    this.storageData.update({
                        medias: {
                        [model.hash]: blobUrl
                    }
                    });
                        } else {
                        console.error('不支持的blob_URL或者跨域');
                        return null;
                    }
                }
            }
```

直接使用一个`DataTransfer`对象，然后往里面塞数据，经测试也是不行的。  
当然，倘若你了解`clipboardItems`，你可能会觉得`clipboardItems`可以往剪切板里塞数据。  
是的，完全可以，不过`clipboardItems`看起来像个数组，用起来也是个数组，就是数据是只支持长度为1的数组.  
![](/images/jueJin/a2d95c0d6d9d44f.png)

###  6. 图片的黑洞

事实上，我完全没想过图片居然还需要这种异常的处理。在复制粘贴图片的过程中，你可能不会想到，你复制一个“瘦子”，最后给你一个完全认不出来的“胖子”；  
在浏览器里，我们通过`image/png`拿到的永远是单一的图片格式，因为浏览器为了支持、兼容图片格式，都会将图片转成`bitmap`给你，这样一来你在`image/png`里拿到的只是`bitmap`的`blob`格式，这会产生两个问题：

*   你无法获取图片原来的格式，永远只能拿到`png`，也就无法进行格式判断；
*   `bitmap`在不同平台下的转换不同，这会造成图片有可能会增大体积，例如一张`20m`的图片，通过**getAsFile**方法获取到的，可能超过`30m......`在`mac`和`window`下测试可能会得到两个不同的结果。  
    果然还是要通过`input`才能完整的获得浏览器的文件能力。  
    ****具体可参考：  
    ****[lists.whatwg.org/pipermail/w…](https://link.juejin.cn?target=https%3A%2F%2Flists.whatwg.org%2Fpipermail%2Fwhatwg-whatwg.org%2F2011-March%2F030891.html "https://lists.whatwg.org/pipermail/whatwg-whatwg.org/2011-March/030891.html")  
    

结尾
--

当然，还有一些其他的问题存在，例如复制粘贴外部的表格实际上需要单独做一层解析，这个过程会更加麻烦；序列化和反序列化的数据需要慎重考虑，因为有些数据在格式化后会有转变的风险......  
但是基本上整个复制粘贴的过程就是这样  
![](/images/jueJin/6673a2ee25e04ed.png)

事实上，整个的复制粘贴并无法做到完美，在浏览器的各种限制下，会有很多无法保持一致性的问题存在，只能在夹缝中生存。倘若原来需要复制粘贴的内容是符合`html`规范的，那么处理起来就会很简单；若是跟我遇到的场景一样，数据基本都为`JSON`，那么势必需要花大精力去处理数据之间的转换和处理一些边界问题。

参考文章
----

*   [www.alloyteam.com/2015/04/how…](https://link.juejin.cn?target=http%3A%2F%2Fwww.alloyteam.com%2F2015%2F04%2Fhow-to-paste-zhuangbility%2F "http://www.alloyteam.com/2015/04/how-to-paste-zhuangbility/")