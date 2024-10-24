---
author: "Sunshine_Lin"
title: "✨突发奇想！Vue3 的上下无限滚动可以这么实现？✨"
date: 2024-06-19
description: "大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~ 最近有一个需求，需要在页面中做一个垂直方向的无限滚动，效果基本为如下，这个滚动是一直在持续的，不断循"
tags: ["前端","Vue.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:28,comments:5,collects:53,views:2016,"
---
前言
--

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~

最近有一个需求，需要在页面中做一个垂直方向的**无限滚动**，效果基本为如下，这个滚动是一直在持续的，不断循环

![wxgd-2.gif](/images/jueJin/03a7099bf35f4b4.png)

这个效果挺有意思的，实现起来不难，所以分享一下~

实现
--

### 基础页面

首先准备一下基础的页面，之所以给容器设置 `overflow:hidden` 是为了把滚动条给去掉，因为我们并不需要滚动条

![image-2.png](/images/jueJin/46e409734ede4cc.png)

可以看出有些项是不在容器可视范围内的，且每一项的高度是 `22px`（每一项的高度可以自己定，我这里就用 `22px` 来进行示范）

![image-1.png](/images/jueJin/6d56998c641f4b5.png)

### 滚动起来

接下来得让这个容器滚动起来，那要怎么滚动呢？可以使用 `scrollTo` 这个方法来进行滚动~并且为了持续保持滚动，可以使用 `requestAnimationFrame` 来不断进行

每次都对 `top` 进行递增，保证容器不断向上滚动

![image-3.png](/images/jueJin/bb5d5252e86d4cc.png)

但是我们可以看到，虽然`top` 一直在递增，但是滚动到最后就不动了！这是因为这个时候已经滚动到最底部了，那么自然就滚动不了了

![wxgd-3.gif](/images/jueJin/ab11f2018e184ef.png)

### 永远滚动不完？

上面为啥滚到底部就滚不动了呢？因为到最底部了，所以滚不动了呀~

那么想要**永远滚不完**应该怎么办呢？其实有一种办法，那就是**永远到不了底**，那要怎么实现呢？其实很简单，只要让**数据不断增加**就行~

怎么让**数据不断增加**呢，并且增加的规则是什么呢？其实很简单，我们每次滚上去一项，就拷贝这一项`push` 到列表数据末端，这样就能做到数据**永远滚不完**

![image-4.png](/images/jueJin/f8bd1c2fb7d8424.png)

下面是代码实现，为什么是除以`22` 呢？因为每一项的高度是 `22px`

![image-5.png](/images/jueJin/b856ffc9ac3a4e2.png)

现在可以达到想要的无限滚动效果

![wxgd-2.gif](/images/jueJin/1cb6675b105c4fa.png)

### 数据不断增长？

但是其实上面的做法还是有缺点的，因为数据不断地`push`也就是不断地增加，如果页面保持一段时间的话，会大大占用内存，导致页面卡顿！！

所以我们可以在适当的时间点，去**初始化数据**，也就是把数据恢复到一开始样子，这样就能避免数据不断增加了~

那么应该在什么时机去初始化数据呢？并且要怎么初始化才能让用户察觉不出来呢？**怎么做到无缝衔接进行初始化呢？**

通过一个图告诉大家~其实最好的时机就是在**刚好滚动完一轮的时候**

![image-7.png](/images/jueJin/0f126388aaff49c.png)

最终代码实现如下~

![image-8.png](/images/jueJin/34db3f0271e246e.png)

最终实现效果

![wxgd-2.gif](/images/jueJin/8bf93ead2eca453.png)

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

完整代码
----

```html
<template>
<div class="scroll-container" ref="scrollRef">
<h1 v-for="(item, index) in list" :key="index">{{ item.title }}</h1>
</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

// 容器的 dom 节点
const scrollRef = ref<HTMLDivElement | null>(null);
// 模拟列表数据
    const dataSource = new Array(10).fill(0).map((_, index) => ({
    title: `这是一条信息${index}`,
    }));
    const list = ref([...dataSource]);
    
    // 记录原始数据的长度
    const len = dataSource.length;
        onMounted(() => {
        // 滚动的距离
        let top = 0;
        // 索引
        let index = 0;
        
            const scroll = () => {
            // 垂直方向滚动
                scrollRef.value?.scrollTo({
                top: top++,
                });
                    if (top % 22 === 0) {
                    // 哪一项滚不见了，就拿这一项 push 到列表中
                    const target = list.value[index];
                    list.value.push(target!);
                    
                        if (index < len - 1) {
                        // 不断递增
                        index++;
                            } else {
                            // 刚好滚动完一轮，重新来过，初始化数据
                            top = 0;
                            index = 0;
                                scrollRef.value?.scrollTo({
                                top: 0,
                                });
                                list.value = [...dataSource];
                            }
                        }
                        // 不断滚动
                        requestAnimationFrame(scroll);
                        };
                        
                        scroll();
                        });
                        </script>
                        
                        <style lang="less">
                            .scroll-container {
                            //   防止有滚动条出现
                            overflow: hidden;
                            height: 150px;
                        }
                        </style>
```