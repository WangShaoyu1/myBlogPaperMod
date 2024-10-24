---
author: "Sunshine_Lin"
title: "Vue3 实现最近很火的酷炫功能：卡片悬浮发光"
date: 2024-05-28
description: "大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~ 有趣的动画效果 前几天在网上看到了一个很有趣的动画效果，如下，光会跟随鼠标在卡片上进行移动，并且卡片"
tags: ["Vue.js","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:382,comments:0,collects:670,views:22205,"
---
前言
--

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~

有趣的动画效果
-------

前几天在网上看到了一个很有趣的动画效果，如下，光会跟随鼠标在卡片上进行移动，并且卡片会有视差的效果

那么在 Vue3 中应该如何去实现这个效果呢？

![](/images/jueJin/9fb88363074046d.png)

基本实现思路
------

其实实现思路很简单，无非就是分几步：

*   首先，卡片是`相对定位`，光是`绝对定位`
*   监听卡片的鼠标移入事件`mouseenter`，当鼠标进入时显示光
*   监听卡片的鼠标移动事件`mouseover`，鼠标移动时修改光的`left、top`，让光跟随鼠标移动
*   监听卡片的鼠标移出事件`mouseleave`，鼠标移出时，隐藏光

我们先在 `Index.vue` 中准备一个卡片页面，光的CSS效果可以使用`filter: blur()` 来实现

![](/images/jueJin/715fc5727d9f4bd.png)

可以看到现在的效果是这样

![](/images/jueJin/268e2cab742d471.png)

实现光源跟随鼠标
--------

在实现之前我们需要注意几点：

*   1、鼠标移入时需要设置卡片 `overflow: hidden`，否则光会溢出，而鼠标移出时记得还原
*   2、获取鼠标坐标时需要用`clientX/Y`而不是`pageX/Y`，因为前者会把页面滚动距离也算进去，比较严谨

刚刚说到实现思路时我们说到了`mouseenter、mousemove、mouseleave`，其实`mouseenter、mouseleave` 这二者的逻辑比较简单，重点是 `mouseover` 这个监听函数

而在 `mouseover` 这个函数中，最重要的逻辑就是：**光怎么跟随鼠标移动呢？**

或者也可以这么说：**怎么计算光相对于卡片盒子的 left 和 top**

对此我专门画了一张图，相信大家一看就懂怎么算了

![](/images/jueJin/b4472154d5d94b6.png)

*   **left = clientX - x - width/2**
*   **height = clientY - y - height/2**

知道了怎么计算，那么逻辑的实现也很明了了~封装一个`use-light-card.ts`

![](/images/jueJin/cc3e2cf55c52475.png)

接着在页面中去使用

![](/images/jueJin/387c59d6b71244a.png)

这样就能实现基本的效果啦~

![](/images/jueJin/622b8e42eab14f1.png)

卡片视差效果
------

卡片的视差效果需要用到样式中 `transform` 样式，主要是配置四个东西：

*   perspective：定义元素在 3D 变换时的透视效果
*   rotateX：X 轴旋转角度
*   rotateY：Y 轴旋转角度
*   scale3d：X/Y/Z 轴上的缩放比例

![](/images/jueJin/28914d0ddee4496.png)

现在就有了卡片视差的效果啦~

![](/images/jueJin/62ba00ce20c5439.png)

给所有卡片添加光源
---------

上面只是给一个卡片增加光源，接下来可以给每一个卡片都增加光源啦！！！

![](/images/jueJin/42520369e801417.png)

![](/images/jueJin/ead93bd3c70c44d.png)

让光源变成可配置
--------

上面的代码，总感觉这个 hooks 耦合度太高不太通用，所以我们可以让光源变成可配置化，这样每个卡片就可以展示不同大小、颜色的光源了~像下面一样

![](/images/jueJin/4a85e37d24c4495.png)

既然是配置化，那我们希望是这么去使用 hooks 的，我们并不需要自己在页面中去写光源的dom节点，也不需要自己去写光源的样式，而是通过配置传入 hooks 中

![](/images/jueJin/7a6903b4e6c147e.png)

所以 hooks 内部要自己通过操作 DOM 的方式，去添加、删除光源，可以使用`createElement、appendChild、removeChild` 去做这些事~

![](/images/jueJin/a44070dd56f4483.png)

完整源码
----

```html
<!-- Index.vue -->

<template>
<div class="container">
<!-- 方块盒子 -->
<div class="item" ref="cardRef1"></div>
<!-- 方块盒子 -->
<div class="item" ref="cardRef2"></div>
<!-- 方块盒子 -->
<div class="item" ref="cardRef3"></div>
</div>
</template>

<script setup lang="ts">
import { useLightCard } from './use-light-card';

const { cardRef: cardRef1 } = useLightCard();
    const { cardRef: cardRef2 } = useLightCard({
        light: {
        color: '#ffffff',
        width: 100,
        },
        });
            const { cardRef: cardRef3 } = useLightCard({
                light: {
                color: 'yellow',
                },
                });
                </script>
                
                <style scoped lang="less">
                    .container {
                    background: black;
                    width: 100%;
                    height: 100%;
                    padding: 200px;
                    display: flex;
                    justify-content: space-between;
                    
                        .item {
                        position: relative;
                        width: 125px;
                        height: 125px;
                        background: #1c1c1f;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    }
                }
                </style>
                
``````js
// use-light-card.ts

import { onMounted, onUnmounted, ref } from 'vue';

    interface IOptions {
        light?: {
        width?: number; // 宽
        height?: number; // 高
        color?: string; // 颜色
        blur?: number; // filter: blur()
        };
    }
    
        export const useLightCard = (option: IOptions = {}) => {
        // 获取卡片的dom节点
        const cardRef = ref<HTMLDivElement | null>(null);
        let cardOverflow = '';
        // 光的dom节点
        const lightRef = ref<HTMLDivElement>(document.createElement('div'));
        // 设置光源的样式
        
            const setLightStyle = () => {
            const { width = 60, height = 60, color = '#ff4132', blur = 40 } = option.light ?? {};
            const lightDom = lightRef.value;
            lightDom.style.position = 'absolute';
            lightDom.style.width = `${width}px`;
            lightDom.style.height = `${height}px`;
            lightDom.style.background = color;
            lightDom.style.filter = `blur(${blur}px)`;
            };
            
            // 设置卡片的 overflow 为 hidden
                const setCardOverflowHidden = () => {
                const cardDom = cardRef.value;
                    if (cardDom) {
                    cardOverflow = cardDom.style.overflow;
                    cardDom.style.overflow = 'hidden';
                }
                };
                // 还原卡片的 overflow
                    const restoreCardOverflow = () => {
                    const cardDom = cardRef.value;
                        if (cardDom) {
                        cardDom.style.overflow = cardOverflow;
                    }
                    };
                    
                    // 往卡片添加光源
                        const addLight = () => {
                        const cardDom = cardRef.value;
                            if (cardDom) {
                            cardDom.appendChild(lightRef.value);
                        }
                        };
                        // 删除光源
                            const removeLight = () => {
                            const cardDom = cardRef.value;
                                if (cardDom) {
                                cardDom.removeChild(lightRef.value);
                            }
                            };
                            
                            // 监听卡片的鼠标移入
                                const onMouseEnter = () => {
                                // 添加光源
                                addLight();
                                setCardOverflowHidden();
                                };
                                
                                // use-light-card.ts
                                
                                // 监听卡片的鼠标移动
                                    const onMouseMove = (e: MouseEvent) => {
                                    // 获取鼠标的坐标
                                    const { clientX, clientY } = e;
                                    // 让光跟随鼠标
                                    const cardDom = cardRef.value;
                                    const lightDom = lightRef.value;
                                        if (cardDom) {
                                        // 获取卡片相对于窗口的x和y坐标
                                        const { x, y } = cardDom.getBoundingClientRect();
                                        // 获取光的宽高
                                        const { width, height } = lightDom.getBoundingClientRect();
                                        lightDom.style.left = `${clientX - x - width / 2}px`;
                                        lightDom.style.top = `${clientY - y - height / 2}px`;
                                        
                                        //   设置动画效果
                                        const maxXRotation = 10; // X 轴旋转角度
                                        const maxYRotation = 10; // Y 轴旋转角度
                                        
                                        const rangeX = 200 / 2; // X 轴旋转的范围
                                        const rangeY = 200 / 2; // Y 轴旋转的范围
                                        
                                        const rotateX = ((clientX - x - rangeY) / rangeY) * maxXRotation; // 根据鼠标在 Y 轴上的位置计算绕 X 轴的旋转角度
                                        const rotateY = -1 * ((clientY - y - rangeX) / rangeX) * maxYRotation; // 根据鼠标在 X 轴上的位置计算绕 Y 轴的旋转角度
                                        
                                        cardDom.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`; //设置 3D 透视
                                    }
                                    };
                                    // 监听卡片鼠标移出
                                        const onMouseLeave = () => {
                                        // 鼠标离开移出光源
                                        removeLight();
                                        restoreCardOverflow();
                                        };
                                        
                                            onMounted(() => {
                                            // 设置光源样式
                                            setLightStyle();
                                            // 绑定事件
                                            cardRef.value?.addEventListener('mouseenter', onMouseEnter);
                                            cardRef.value?.addEventListener('mousemove', onMouseMove);
                                            cardRef.value?.addEventListener('mouseleave', onMouseLeave);
                                            });
                                            
                                                onUnmounted(() => {
                                                // 解绑事件
                                                cardRef.value?.removeEventListener('mouseenter', onMouseEnter);
                                                cardRef.value?.removeEventListener('mousemove', onMouseMove);
                                                cardRef.value?.removeEventListener('mouseleave', onMouseLeave);
                                                });
                                                
                                                    return {
                                                    cardRef,
                                                    };
                                                    };
                                                    
```

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