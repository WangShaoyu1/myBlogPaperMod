---
author: "Sunshine_Lin"
title: "身为Ikun，我想用consolelog输出giegie打球的视频~"
date: 2023-05-28
description: "大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心。 事情是这样的，这天我醒来，觉得身为一个 “ikun”，我得向我的giegie看齐，早点把篮球水"
tags: ["前端","Vue.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:97,comments:0,collects:78,views:10779,"
---
前言
--

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心。

事情是这样的，这天我醒来，觉得身为一个 “ikun”，我得向我的giegie看齐，早点把篮球水平练上去，早点追上我的giegie，于是我便开始了我的打球(打铁)之旅~

![May-28-2023 23-36-14.gif](/images/jueJin/38de8113e743457.png)

突发奇想
----

晚上，当我在分析着我的打球视频时，我又感觉我做这些是远远不够的！我要将这一切融入到前端里，让别人知道，咱们 ”ikun“ 是一个爱giegie，也爱学习的团体！我想要达到以下的效果

![May-27-2023 23-47-31.gif](/images/jueJin/5ad4a495ed0b445.png)

于是我想，我能不能把这个打球(打铁)视频，在控制台里 console.log 出来呢？我在心里演练了一遍，我觉得是可行的，我的思路有两个

直接用 console.log 输出视频？
---------------------

好吧，目前 console.log 不支持输出视频吧~此路不通啊！

细分成每一帧去输出？
----------

这个方式的思路具体分为以下几步：

*   捕获视频的每一帧
*   将每一帧转换成图片
*   使用console.log输出生图片

### 如何捕获视频的每一帧？

使用 video 的 `requestVideoFrameCallback` 方法即可，[requestVideoFrameCallback()](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fwicg.github.io%2Fvideo-rvfc%2F "https://link.zhihu.com/?target=https%3A//wicg.github.io/video-rvfc/") 是一个新的WEB API，2021 年 1 月 25 日提交的草案。`requestVideoFrameCallback()` 方法允许WEB开发者注册一个回调方法，回调方法在新视频帧发送到合成器时在渲染步骤中运行。这是为了让开发人员对视频执行高效的每帧视频操作，例如视频处理和绘制到画布上（截屏）、视频分析或与外部音频源同步。

### 如何将每一帧转换成图片？

这得使用 canvas来完成，主要依赖了两个方法

*   ctx.drawImage：将一帧画面画到 canvas 上
*   canvas.toDataURL('image/png')：将 canvas 画布上的图像转成base64的URL

### console.log 能输出图片？

console.log 是可以输出图片了，这一特性很久前就有了~不信你们复制以下代码，去尝试一下~

![image.png](/images/jueJin/ca412c9f87fb4df.png)

```js
console.log(
"%c image",
`background-image: url(https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca412c9f87fb4df1b5402a5ad64474f1~tplv-k3u1fbpfcp-watermark.image?);
background-size: contain;
background-repeat: no-repeat;
padding: 200px;
`
)
```

开始实现吧~
------

那我们开始实现吧，我这边的技术栈是 Vue3哦~

先看看效果
-----

先看看效果是怎么样的

![May-28-2023 23-36-26.gif](/images/jueJin/4cd40924e6ff4fc.png)

### 初始化代码

我们需要 video 和 canvas，这两个标签，前者是视频标签，后者是画布标签

```html
<template>
<video ref="videoRef" width="640" height="360" controls playsinline muted>
<source src="./kunkun.mp4" />
您的浏览器不支持 video 标签。
</video>
<canvas ref="canvasRef" width="640" height="360"></canvas>
</template>
```

### 封装 useIKun

封装一个 Vue3 的 hooks，名为 useIKun，用来处理 ikun 的打球视频转换图片输出~

```ts
<script setup lang="ts">
import { ref } from 'vue'
import { useIKun } from './hooks/useIKun'
// 获取两个标签的实例并传入hooks
const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
    useIKun({
    videoInstance: videoRef,
    canvasInstance: canvasRef,
    })
    </script>
```

接下来我们开始封装 useIKun

```ts
import { onMounted } from 'vue'
import type { Ref } from 'vue'

const CANVAS_WIDTH_BASE = 220
const CANVAS_HEIGHT_BASE = 220

    export const useIKun = ({
    videoInstance,
    canvasInstance,
        }: {
        videoInstance: Ref<HTMLVideoElement>
        canvasInstance: Ref<HTMLCanvasElement>
            }) => {
                onMounted(() => {
                // 播放视频
                handleVideoPlay()
                })
                
                // 获取dom实例
                    const getInstances = () => {
                    const video = videoInstance.value
                    const canvas = canvasInstance.value
                        return {
                        video,
                        canvas,
                    }
                }
                
                // 获取canvas尺寸信息
                    const getCanvasSize = () => {
                    const { video } = getInstances()
                    // videoWidht、videoHeight视频原始宽度、高度(单位:px)
                    const width = video.videoWidth
                    const height = video.videoHeight
                    
                    const rate = height / width
                    
                        return {
                        width: CANVAS_WIDTH_BASE,
                        height: CANVAS_HEIGHT_BASE * rate,
                    }
                }
                
                    const handleVideoPlay = () => {
                    const video = videoInstance.value
                    const canvas = canvasInstance.value
                        video.oncanplay = () => {
                        const { width, height } = getCanvasSize()
                        canvas.width = width
                        canvas.height = height
                        video.play() // 播放视频
                        
                        // 判断HTMLVideoElement是否支持requestVideoFrameCallback()方法
                            if ('requestVideoFrameCallback' in video) {
                            // 下此视频帧呈现时触发回调
                            video.requestVideoFrameCallback(updateVideo)
                        }
                    }
                }
                
                /*
                * 根据当前视频帧绘制图片
                */
                    const updateVideo = () => {
                    const video = videoInstance.value
                    const canvas = canvasInstance.value
                    const ctx = canvas.getContext('2d')
                        if (ctx) {
                        const { width, height } = getCanvasSize()
                        ctx.drawImage(video, 0, 0, width, height) // 使用视频帧(当前帧)绘制canvas
                        const dataURL = canvas.toDataURL('image/png')
                        console.log(
                        '%c image',
                        `background-image: url(${dataURL});
                        background-size: contain;
                        background-repeat: no-repeat;
                        padding: 200px;
                        `,
                        )
                        video.requestVideoFrameCallback(updateVideo)
                    }
                }
            }
```

### console.clear() ?

我们可以看到效果出来了，控制台里确实“播放了视频”，但其实不是视频，其实是以非常快的速度，去打印出一帧一帧的图片出来，由于速度很快，所以给你一种在放视频的假象，不信你看其实控制台里不止一个画面哦~

![May-28-2023 23-36-26.gif](/images/jueJin/4cd40924e6ff4fc.png)

所以我们咋办，每次输出图片的时候用 console.clear() 清除一下吗？我们可以试试~

```ts
    const updateVideo = () => {
    const video = videoInstance.value
    const canvas = canvasInstance.value
    const ctx = canvas.getContext('2d')
        if (ctx) {
        const { width, height } = getCanvasSize()
        ctx.drawImage(video, 0, 0, width, height) // 使用视频帧(当前帧)绘制canvas
        const dataURL = canvas.toDataURL('image/png')
        // 清除
        +      console.clear()
        console.log(
        '%c image',
        `background-image: url(${dataURL});
        background-size: contain;
        background-repeat: no-repeat;
        padding: 200px;
        `,
        )
        video.requestVideoFrameCallback(updateVideo)
    }
}
```

再来看看效果~ 显然这样是不行的，console.clear 会导致闪烁问题~

![May-28-2023 23-36-37.gif](/images/jueJin/6b768a2f1bb44ac.png)

Gif图？
-----

所以我又有新思路，将每一帧的图像收集起来，然后组成一个 Gif 图，然后输出在控制台，不就行了！！！

### gifshot

想要完成这个事情，就要借助这个库——gifshot，他的作用是可以把你传给他的图像数组，组成一个 gif图

### 重新封装 useIKun

```ts
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import gifshot from 'gifshot'

const CANVAS_WIDTH_BASE = 220
const CANVAS_HEIGHT_BASE = 220
const IMG_SPAN = 5

    export const useIKun = ({
    videoInstance,
    canvasInstance,
        }: {
        videoInstance: Ref<HTMLVideoElement>
        canvasInstance: Ref<HTMLCanvasElement>
            }) => {
            const imgs = ref<string[]>([])
            
                onMounted(() => {
                // 播放视频
                handleVideoPlay()
                // 监听播放结束
                onVideoEnded()
                })
                
                    const getInstances = () => {
                    const video = videoInstance.value
                    const canvas = canvasInstance.value
                        return {
                        video,
                        canvas,
                    }
                }
                
                    const getCanvasSize = () => {
                    const { video } = getInstances()
                    // videoWidht、videoHeight视频原始宽度、高度(单位:px)
                    const width = video.videoWidth
                    const height = video.videoHeight
                    
                    const rate = height / width
                    
                        return {
                        width: CANVAS_WIDTH_BASE,
                        height: CANVAS_HEIGHT_BASE * rate,
                    }
                }
                
                /*
                * 控制视频播放
                */
                    const handleVideoPlay = () => {
                    const { video, canvas } = getInstances()
                        video.oncanplay = () => {
                        const { width, height } = getCanvasSize()
                        canvas.width = width
                        canvas.height = height
                        video.play() // 播放视频
                        
                        // 判断HTMLVideoElement是否支持requestVideoFrameCallback()方法
                            if ('requestVideoFrameCallback' in video) {
                            // 下此视频帧呈现时触发回调
                            video.requestVideoFrameCallback(updateVideo)
                        }
                    }
                }
                
                /*
                * 根据当前视频帧绘制图片
                */
                    const updateVideo = () => {
                    const { video, canvas } = getInstances()
                    const ctx = canvas.getContext('2d')
                        if (ctx) {
                        const { width, height } = getCanvasSize()
                        ctx.drawImage(video, 0, 0, width, height) // 使用视频帧(当前帧)绘制canvas
                        const dataURL = canvas.toDataURL('image/png')
                        imgs.value.push(dataURL)
                        video.requestVideoFrameCallback(updateVideo)
                    }
                }
                
                /*
                * 监听视频停止播放
                */
                    const onVideoEnded = () => {
                    const { video } = getInstances()
                        video.onended = () => {
                        console.log('播放完了')
                        console.log(imgs.value.length)
                        const currentImgs = imgs.value
                    const resultImgs: string[] = []
                        currentImgs.forEach((img, index) => {
                        // 稀释图片数组，怕太大太久~你们也可以选择不走这一步
                            if (index % IMG_SPAN === 0) {
                            resultImgs.push(img)
                        }
                        })
                        // gifshot转换gif
                        gifshot.createGIF(
                            {
                            fps: 10,
                            width: 220,
                            height: 500,
                            images: resultImgs,
                            },
                                (obj) => {
                                console.log(obj)
                                    if (!obj.error) {
                                    const url = obj.image
                                    // 输出最终的gif地址
                                    console.log(
                                    '%c image',
                                    `background-image: url(${url});
                                    background-size: contain;
                                    background-repeat: no-repeat;
                                    padding: 200px;
                                    `,
                                    )
                                }
                                },
                                )
                            }
                        }
                    }
                    
```

### 结果

哎，，，这画质，虽然比较糙，但是也算是本 ikun 为 giegie做出的一点点贡献了~

![May-27-2023 23-31-48.gif](/images/jueJin/8d24e11a59b2429.png)

结语 & 加学习群 & 摸鱼群
---------------

我是林三心

*   一个待过**小型toG型外包公司、大型外包公司、小公司、潜力型创业公司、大公司**的作死型前端选手；
*   一个偏前端的全干工程师；
*   一个不正经的掘金作者；
*   一个逗比的B站up主；
*   一个不帅的小红书博主；
*   一个喜欢打铁的篮球菜鸟；
*   一个喜欢历史的乏味少年；
*   一个喜欢rap的五音不全弱鸡

如果你想一起学习前端，一起摸鱼，一起研究简历优化，一起研究面试进步，一起交流历史音乐篮球rap，可以来俺的摸鱼学习群哈哈，点这个，有7000多名前端小伙伴在等着一起学习哦 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

![image.png](/images/jueJin/a0226b8e08ba43e.png)