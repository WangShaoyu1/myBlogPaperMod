---
author: "徐小夕"
title: "如何利用Qrcode制作一个二维码生成器?"
date: 2020-12-18
description: "玲琅满目的二维码在我们的都市和朋友圈中随处可见, 很多平台都提供了定制二维码的服务, 那么作为一名程序员, 我们如何自己实现一个简单的二维码生成器呢? 接下来笔者就来带大家一起利用Qrcode实现一个二维码生成器 笔者不会介绍二维码的详细实现原理, 因为相关文章很多, 我们从…"
tags: ["React.js","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:39,comments:0,collects:33,views:4076,"
---
玲琅满目的二维码在我们的都市和朋友圈中随处可见, 很多平台都提供了定制二维码的服务, 那么作为一名程序员, 我们如何自己实现一个简单的二维码生成器呢? 接下来笔者就来带大家一起利用`Qrcode`实现一个二维码生成器.

效果预览
----

![](/images/jueJin/104d03e4bb7a45a.png) 由上图可以看出我们可以自定义二维码的:

*   文本(比如url, 一段文本)
*   二维码尺寸
*   二维码背景色
*   二维码前景色
*   二维码级别
*   自定义二维码中展示的icon以及icon的位置, 大小

在开发之前我们需要先了解:

*   什么是`QR Code码`
*   `Qrcode`的基本用法
*   以及如何设计一个健壮的组件

笔者不会介绍二维码的详细实现原理, 因为相关文章很多, 我们从实用的角度出发来解决实际问题.

QR Code码
--------

> `QR Code`码，是由 Denso 公司于1994年9月研制的一种矩阵二维码符号，它具有一维条码及其它二维条码所具有的信息容量大、可靠性高、可表示汉字及图象多种文字信息、保密防伪性强等优点。

关于`QR Code`码我们需要知道2个核心的知识, 也就是 `QR Code`数据表示方法以及纠错能力.

*   `QR Code`**数据表示方法** : 深色模块表示二进制"1"，浅色模块表示二进制"0"。
*   **纠错能力**
    *   **L级**：约可纠错7%的数据码字
    *   **M级**：约可纠错15%的数据码字
    *   **Q级**：约可纠错25%的数据码字
    *   **H级**：约可纠错30%的数据码字

了解以上两个知识对于我们实现定制二维码非常由帮助. 在使用`Qrcode`这个插件时也会用到.

Qrcode基本使用记忆如何包装成自定义受控组件
------------------------

因为我们大多数项目目前都采用`react`或者`vue`开发了, 所以我们直接用对应的插件版本即可, 这里笔者使用的是`qrcode.react`. ![](/images/jueJin/51f2ed3628614dd.png) 从使用量上看这个库还是非常不错的, 我们只需要2-3步就可以快速利用它生成一个静态二维码.

要想实现一个二维码生成器, 首先我们需要能自定义二维码的属性, 也就是笔者开头列举的几项, 所以这些属性我们完全要从外部获取, 也就是说二维码组件我们要做成受控的, 如下: ![](/images/jueJin/3d79a728783847d.png) 由上图我们得到了如下的`react`组件模式:

```html
<div className={styles.codeWrap}>
<QRCode value={url} size={codeSize} bgColor={bgColor} fgColor={fgColor} imageSettings={{src: imgUrl[0].url, x: null, y: null, excavate: true, height: imgH, width: imgW}} />
</div>
```

其实就需要用到我们强大的表单渲染器了, 我们需要给`qrcode`组件对接一个表单编辑器, 也就是下图所示的`FormEditor`: ![](/images/jueJin/6a893d7fdc06475.png)

为了简单起见笔者直接用[**H5-Dooring**](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://github.com/MrXujiang/h5-Dooring")提供的`FormEditor`, 我们只需要写如下`json`结构就可以自动生成一个`Form`编辑器, 如下:

```js
    const Qrcode: IQrcodeSchema = {
        editData: [
            {
            key: 'url',
            name: 'url地址',
            type: 'Text',
            },
                {
                key: 'codeSize',
                name: '二维码尺寸',
                type: 'Number',
                },
                    {
                    key: 'bgColor',
                    name: '背景色',
                    type: 'Color',
                    },
                        {
                        key: 'fgColor',
                        name: '前景色',
                        type: 'Color',
                        },
                            {
                            key: 'level',
                            name: '等级',
                            type: 'Select',
                                range: [
                                    {
                                    key: 'L',
                                    text: '低',
                                    },
                                        {
                                        key: 'M',
                                        text: '中',
                                        },
                                            {
                                            key: 'Q',
                                            text: '良',
                                            },
                                                {
                                                key: 'H',
                                                text: '高',
                                                },
                                                ],
                                                },
                                                    {
                                                    key: 'imgUrl',
                                                    name: '二维码图标',
                                                    type: 'Upload',
                                                    isCrop: true,
                                                    cropRate: 1,
                                                    },
                                                        {
                                                        key: 'imgW',
                                                        name: '图标宽度',
                                                        type: 'Number',
                                                        },
                                                            {
                                                            key: 'imgH',
                                                            name: '图标高度',
                                                            type: 'Number',
                                                            },
                                                            ],
                                                                config: {
                                                                url: 'https://github.com/MrXujiang/h5-Dooring',
                                                                codeSize: 180,
                                                                bgColor: 'rgba(255,255,255,1)',
                                                                fgColor: 'rgba(0,0,0,1)',
                                                                level: 'L',
                                                                    imgUrl: [
                                                                        {
                                                                        uid: '001',
                                                                        name: 'image.png',
                                                                        status: 'done',
                                                                        url: `http://xxxx.jpg`,
                                                                        },
                                                                        ],
                                                                        imgW: 48,
                                                                        imgH: 12
                                                                        },
                                                                        };
                                                                        
                                                                        export default Qrcode;
```

此时我们就能渲染出文章开头的二维码生成器了, 我们可以定制自己喜欢的二维码风格和`icon`. 编辑器中的等级选项也就是笔者在开头介绍的`QR Code`的纠错能力, 我们可以自定义选择我们需要的等级.

目前笔者已经把二维码生成器集成到开源项目[H5-Dooring](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://github.com/MrXujiang/h5-Dooring")中了,

在线把玩地址(电脑端体验更佳): [H5编辑器 | 更新二维码生成器组件](https://link.juejin.cn?target=http%3A%2F%2Fh5.dooring.cn%2Fh5_plus%2Feditor%3Ftid%3DD506694E "http://h5.dooring.cn/h5_plus/editor?tid=D506694E")

往期推荐
----

[复盘node项目中遇到的13+常见问题和解决方案](https://juejin.cn/post/6906125459352715272 "https://juejin.cn/post/6906125459352715272")

[如何搭积木式的快速开发H5页面?](https://juejin.cn/post/6904878119724056584 "https://juejin.cn/post/6904878119724056584")

[手撸一个在线css三角形生成器](https://juejin.cn/post/6903083072661487624 "https://juejin.cn/post/6903083072661487624")

[前端高效开发必备的 js 库梳理](https://juejin.cn/post/6898962197335490573 "https://juejin.cn/post/6898962197335490573")

> 觉得有用 ？喜欢就收藏，顺便点个赞吧，你的支持是我最大的鼓励！微信搜 “趣谈前端”，发现更多有趣的H5游戏, webpack，node，gulp，css3，javascript，nodeJS，canvas数据可视化等前端知识和实战.