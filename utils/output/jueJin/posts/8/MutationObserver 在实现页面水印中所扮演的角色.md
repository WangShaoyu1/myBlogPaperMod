---
author: "Sunshine_Lin"
title: "MutationObserver 在实现页面水印中所扮演的角色"
date: 2022-02-16
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心 背景 大家平时在开发中或者在面试中，难免都会遇到一个问题——给页面加水印，其实这并不难，但是也是有一些"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:54,comments:0,collects:46,views:3645,"
---
前言
--

大家好，我是林三心，**用最通俗易懂的话讲最难的知识点**是我的座右铭，**基础是进阶的前提**是我的初心

背景
--

大家平时在开发中或者在面试中，难免都会遇到一个问题——**给页面加水印**，其实这并不难，但是也是有一些注意点的，所以说看似简单的功能，要尽力做到：

*   1、严谨性
*   2、安全性

实现水印
----

其实实现水印并不难，只需要利用`自定义指令 + canvas + background-image`即可，实现起来也非常方便：

```js
import type { Directive, App } from 'vue'

    interface Value {
    font?: string
    textColor?: string
    text?: string
}

const waterMarkId = 'waterMark'
const canvasId = 'can'

    const drawWatermark = (el, value: Value) => {
        const {
        font = '16px Microsoft JhengHei',
        textColor = 'rgba(180, 180, 180, 0.3)',
        text = '三心大菜鸟',
        } = value
        // 创建一个canvas标签
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement
        // 如果已有则不再创建
        const can = canvas || document.createElement('canvas')
        can.id = canvasId
        el.appendChild(can)
        // 设置宽高
        can.width = 400
        can.height = 200
        // 不可见
        can.style.display = 'none'
        const ctx = can.getContext('2d')!
        // 设置画布的样式
        ctx.rotate((-20 * Math.PI) / 180)
        ctx.font = font
        ctx.fillStyle = textColor
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        ctx.fillText(text, can.width / 3, can.height / 2)
        
        // 水印容器
        const waterMaskDiv = document.createElement('div')
        waterMaskDiv.id = waterMarkId
        // 设置容器的属性样式
        // 将刚刚生成的canvas内容转成图片，并赋值给容器的 background-image 样式
        const styleStr = `
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: -1;
        top: 0;
        left: 0;
        pointer-events: none;
        background-image: url(${can.toDataURL('image/png')})
        `
        waterMaskDiv.setAttribute('style', styleStr)
        
        // 将水印容器放到目标元素下
        el.appendChild(waterMaskDiv)
        
        return styleStr
    }
    
        const watermarkDirective: Directive = {
            mounted(el, { value }) {
            // 接收styleStr，后面可以用来对比
            el.waterMarkStylestr = drawWatermark(el, value)
        }
    }
```

使用的时候直接以`v-watermark`来使用：

```js
<div
v-watermark="
    {
    text: '水印名称',
    textColor: 'rgba(180, 180, 180, 0.3)'
}
"
>
```

得到的效果如下：

![](/images/jueJin/b7ee2ac64e8343d.png)

恶意修改
----

咱们完成了水印功能，但是咱们来想一想，水印有啥用？或者说我们为什么要给一个页面加水印呢？答案就是：**防伪**

是的，我们的水印是用来防伪的，但是像我们刚刚那么做真的能防伪吗？我们回忆一下我们刚刚的加水印思路：

*   `第一步`：创建个canvas且画好水印
*   `第二步`：创建个水印容器div标签
*   `第三步`：将canvas画布转图片链接，赋值给div标签的background-image样式属性
*   `第四步`：将水印容器div放到目标元素之下

看似完成了水印功能，但是其实**破绽百出**！！！比如：

*   1、审查元素修改容器div的background-image属性为空

![](/images/jueJin/e2a7892e4185413.png)

*   2、审查元素把容器div给删掉

![](/images/jueJin/76421c3cc85745a.png)

如果一切别有用心的人做了这两件事，这都会导致我们页面上刚刚所做的水印直接消失！！！

![](/images/jueJin/f0551fedb2de4df.png)

所以咱们得监控这些人的恶意行为，那咋做呢？`MutationObserver`出场了！！！

MutationObserver
----------------

`MutationObserver`的具体用法大家可以去`MDN`上看，这里我就简言意骇地说一下他的作用：**监控DOM元素的变化**

是的，它的作用就是：**监控DOM元素的变化**，所以他能阻止那些恶意用户破坏水印，因为我们刚刚说了，恶意用户可以使用以下两种方法进行破坏水印：

*   1、审查元素修改容器div的background-image属性为空
*   2、审查元素把容器div给删掉

而这两点都涉及到DOM的修改，所以都会引起`MutationObserver`的监控触发，所以咱们可以利用`MutationObserevr`来监控。这里用到它的实例的两个方法：

*   `observe`：开启监控DOM变化
*   `disconnect`：停止监控DOM变化

```js
    const watermarkDirective: Directive = {
        mounted(el, { value }) {
        // 接收styleStr，后面可以用来对比
        el.waterMarkStylestr = drawWatermark(el, value)
        // 先定义一个MutationObserver
            el.observer = new MutationObserver(() => {
            const instance = document.getElementById(waterMarkId)
            const style = instance?.getAttribute('style')
            const { waterMarkStylestr } = el
            // 修改样式 || 删除div
                if ((instance && style !== waterMarkStylestr) || !instance) {
                    if (instance) {
                    // div还在，说明只是修改style
                    instance.setAttribute('style', waterMarkStylestr)
                        } else {
                        // div不在，说明删除了div
                        drawWatermark(el, value)
                    }
                }
                })
                // 启动监控
                    el.observer.observe(document.body, {
                    childList: true,
                    attributes: true,
                    subtree: true,
                    })
                    },
                        unmounted(el) {
                        // 指定元素销毁时，记得停止监控
                        el.observer.disconnect()
                        el.observer = null
                        },
                    }
```

现在，你修改`style`或者`删除容器div`，都会重新生成水印，这样恶意用户就无法得逞啦！！！当然可能还有漏洞，大家可以给给建议！！

结语
--

我是林三心，一个热心的前端菜鸟程序员。如果你上进，喜欢前端，想学习前端，那咱们可以交朋友，一起摸鱼哈哈，摸鱼群，点这个 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

![image.png](/images/jueJin/80e2d6e382de45e.png)