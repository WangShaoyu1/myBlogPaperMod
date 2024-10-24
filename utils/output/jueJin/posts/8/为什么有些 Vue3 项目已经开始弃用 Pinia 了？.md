---
author: "Sunshine_Lin"
title: "为什么有些 Vue3 项目已经开始弃用 Pinia 了？"
date: 2024-08-02
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~ 真的需要 Pinia 吗？ 最近在想一个问题：在 Vue3 项目中，进行状态管理的时候，我们真的需要"
tags: ["前端","Vue.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:8,comments:3,collects:5,views:797,"
---
前言
--

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~

真的需要 Pinia 吗？
-------------

最近在想一个问题：在 Vue3 项目中，进行状态管理的时候，我们真的需要 **Pinia** 吗？

其实我们可以反过来想一个问题：没有 **Pinia**，我们能做状态管理吗？

答案是：可以！！！

ref、reactive
------------

Vue3 的一些 API 对比 React 的好处就是，这些 API 并不一定需要在组件中去声明

就比如你想要做局部状态管理的时候，可以直接使用 `reactive、ref` 这类 API 来完成

![image.png](/images/jueJin/7fd7d5825c1b488.png)

![image-1.png](/images/jueJin/6e091281135140c.png)

![image-2.png](/images/jueJin/35b69e9e063b4a4.png)

这样能达到局部状态管理，多组件共用同一个状态的效果，请看下图

![state-1-1.gif](/images/jueJin/6f0db3e4e7a843b.png)

effectScope
-----------

Vue3 有一个超级冷门的 API 叫 **effectScope** ，这个 API 非常强大，但是很多人都不知道它

当然，既然很少人知道它，那自然就很少人知道，Pinia 的底层原理就是依赖了 **effectScope**

![image-4.png](/images/jueJin/11ac50b9f3e4450.png)

既然 Pinia 是通过`effectScope`来实现的，那么，我们自然也可以直接使用这个 API 来做状态管理~

其实已经有人做过这件事了，就比如 `vueuse` 中的

![image-6.png](/images/jueJin/f4215918ac5d40b.png)

我们可以直接用这个 Hooks 来进行状态管理，如果是使用 `effectScope` 来进行管理的话，状态就不需要写在 Hooks 外部了，**因为 effectScope 内部逻辑只会执行一次，无论你调用多少次**

![image-7.png](/images/jueJin/5af33e9e4796495.png)

![image-8.png](/images/jueJin/239fb9f9625a48e.png)

![image-9.png](/images/jueJin/fb07dfea844d4c1.png)

利用 `effectScope` 也能达到组件之间共享状态~

![state-2.gif](/images/jueJin/8682d1d1edbe490.png)

那还需要 Pinia 吗？
-------------

### 结构分明

我觉得 Pinia 还是有他的好处的，好处就是：**让我们少写一些代码，并且代码更加分明**

比如下面这个例子

*   **state：** 定义状态
*   **getter：** 定义计算变量
*   **action：** 定义修改方法

结构很分明

![image-10.png](/images/jueJin/0d23cab38fb74ec.png)

### 监听 state

Pinia 还提供了 `$subscribe` 来监听整个状态，我们也可以利用这个方法来做**持久化存储**

![image-11.png](/images/jueJin/1176553dcd1140f.png)

### 插件机制

Pinia 提供了插件机制，可以让你去拓展 Pinia 的功能，以下是你可以扩展的内容：

*   为 store 添加新的属性
*   定义 store 时增加新的选项
*   为 store 增加新的方法
*   包装现有的方法
*   改变甚至取消 action
*   实现副作用，如本地存储
*   仅应用插件于特定 store

比如举个小例子，给所有状态管理都加一个属性变量

![image-12.png](/images/jueJin/3e61cdbcb51e4fa.png)

Pinia 著名的持久化插件`pinia-plugin-persistedstate`就是利用了 Pinia 的插件机制

![image-13.png](/images/jueJin/e6ec2efe360e469.png)

他的核心代码其实很少，就是利用插件机制，使用`$subscribe`去监听每一个状态管理的变化，然后进行持久化存储~

![image-14.png](/images/jueJin/5c0d0563f65b4ec.png)

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

如果你想一起学习前端，一起摸鱼，一起研究简历优化，一起研究面试进步，一起交流历史音乐篮球rap，可以来俺的摸鱼学习群哈哈，点这个，有10000多名前端小伙伴在等着一起学习哦 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")