---
author: "我不吃饼干"
title: "Vue可拖拽组件VueSmoothDnD详解和应用演示"
date: 2021-07-26
description: "VueSmoothDnD是一个快速、轻量级的拖放、可排序的Vue.js库，封装了smooth-dnd库。VueSmoothDnD主要包含了两个组件。"
tags: ["Vue.js","前端"]
ShowReadingTime: "阅读5分钟"
weight: 576
---
本文已参与好文召集令活动，点击查看：[后端、大前端双赛道投稿，2万元奖池等你挑战！](https://juejin.cn/post/6978685539985653767 "https://juejin.cn/post/6978685539985653767")

简介和 Demo 展示
-----------

最近需要有个拖拽列表的需求，发现一个简单好用的 Vue 可拖拽组件。安利一下~

[Vue Smooth DnD](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fkutlugsahin%2Fvue-smooth-dnd "https://github.com/kutlugsahin/vue-smooth-dnd") 是一个快速、轻量级的拖放、可排序的 Vue.js 库，封装了 [smooth-dnd](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fkutlugsahin%2Fsmooth-dnd "https://github.com/kutlugsahin/smooth-dnd") 库。

Vue Smooth DnD 主要包含了两个组件，`Container` 和 `Draggable`，`Container` 包含可拖动的元素或组件，它的每一个子元素都应该被 `Draggable` 包裹。每一个要被设置为可拖动的元素都需要被 `Draggable` 包裹。

安装： `npm i vue-smooth-dnd`

一个简单的 Demo ，展示组件的基础用法，实现了可以拖拽的列表。

html

 代码解读

复制代码

`<template>     <div>         <div class="simple-page">             <Container @drop="onDrop">                 <Draggable v-for="item in items" :key="item.id">                     <div class="draggable-item">                         {{item.data}}                     </div>                 </Draggable>             </Container>         </div>     </div> </template> <script>     import { Container, Draggable } from "vue-smooth-dnd";     const applyDrag = (arr, dragResult) => {         const { removedIndex, addedIndex, payload } = dragResult         console.log(removedIndex, addedIndex, payload)         if (removedIndex === null && addedIndex === null) return arr         const result = [...arr]         let itemToAdd = payload         if (removedIndex !== null) {             itemToAdd = result.splice(removedIndex, 1)[0]         }         if (addedIndex !== null) {             result.splice(addedIndex, 0, itemToAdd)         }         return result     }     const generateItems = (count, creator) => {         const result = []         for (let i = 0; i < count; i++) {             result.push(creator(i))         }         return result     }     export default {         name: "Simple",         components: { Container, Draggable },         data() {             return {                 items: generateItems(50, i => ({ id: i, data: "Draggable " + i }))             };         },         methods: {             onDrop(dropResult) {                 this.items = applyDrag(this.items, dropResult);             }         }     }; </script> <style>     .draggable-item {         height: 50px;         line-height: 50px;         text-align: center;         display: block;         background-color: #fff;         outline: 0;         border: 1px solid rgba(0, 0, 0, .125);         margin-bottom: 2px;         margin-top: 2px;         cursor: default;         user-select: none;     } </style>`

效果

![drag2.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3155c4900a944e8b88978514b49a97fc~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

API: Container
--------------

### 属性

属性

类型

默认值

描述

:orientation

string

`vertical`

容器的方向，可以为 **horizontal** 或 **vertical**

:behaviour

string

`move`

描述被拖动的元素被移动或复制到目标容器。 可以为 **move** 或 **copy** 或 **drop-zone** 或 **contain** 。`move` 可以在容器间互相移动，`copy` 是可以将元素复制到其他容器，但本容器内元素不可变，`drop-zone` 可以在容器间移动，但是容器内元素的顺序是固定的。`contain` 只能在容器内移动。

:tag

string, NodeDescription

`div`

容器的元素标签，默认是 `div` ，可以是字符串如 `tag="table"` 也可以是包含 `value`和 `props` 属性的对象 `:tag="{value: 'table', props: {class: 'my-table'}}"`

:group-name

string

`undefined`

可拖动元素可以在具有相同组名的容器之间移动。如果未设置组名容器将不接受来自外部的元素。 这种行为可以被 shouldAcceptDrop 函数覆盖。 见下文。

:lock-axis

string

`undefined`

锁定拖动的移动轴。可用值 **x**, **y** 或 **undefined**。

:drag-handle-selector

string

`undefined`

用于指定可以开启拖拽的 CSS 选择器，如果不指定的话则元素内部任意位置都可抓取。

:non-drag-area-selector

string

`undefined`

禁止拖动的 CSS 选择器，优先于 **dragHandleSelector**.

:drag-begin-delay

number

`0`（触控设备为 `200`）

单位毫秒。表示点击元素持续多久后可以开始拖动。在此之前移动光标超过 5px 将取消拖动。

:animation-duration

number

`250`

单位毫秒。表示放置元素和重新排序的动画持续时间。

:auto-scroll-enabled

boolean

`true`

如果拖动项目接近边界，第一个可滚动父项将自动滚动。（这个属性没看懂= =）

:drag-class

string

`undefined`

元素被拖动中的添加的类（不会影响拖拽结束后元素的显示）。

:drop-class

string

`undefined`

从拖拽元素被放置到被添加到页面过程中添加的类。

:remove-on-drop-out

boolean

`undefined`

如果设置为 `true`，在被拖拽元素没有被放置到任何相关容器时，使用元素索引作为 `removedIndex` 调用 `onDrop()`

:drop-placeholder

boolean,object

`undefined`

占位符的选项。包含 **className**, **animationDuration**, **showOnTop**

关于 `drag-class`，`drop-class` 和 `drop-placeholder.className` 的效果演示

html

 代码解读

复制代码

`<Container # 省略其它属性...         :animation-duration="1000" # 放置元素后动画延时         drag-class="card-ghost"                  drop-class="card-ghost-drop"         :drop-placeholder="{             className: 'drop-preview',  # 占位符的样式             animationDuration: '1000', # 占位符的动画延迟             showOnTop: true            # 是否在其它元素的上面显示 设置为false会被其他的拖拽元素覆盖         }" >     <!-- 一些可拖拽元素 -->     <Draggable>....</Draggable> </Container>`

类对应样式

css

 代码解读

复制代码

`.card-ghost {     transition: transform 0.18s ease;     transform: rotateZ(35deg);     background: red !important; } .card-ghost-drop {     transition: transform 1s cubic-bezier(0,1.43,.62,1.56);     transform: rotateZ(0deg);     background: green !important; } .drop-preview {     border: 1px dashed #abc;     margin: 5px;     background: yellow !important; }`

实际效果（我这优秀的配色啊）

![dnd3.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ffd6e53414164c649f785b86ca740071~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 生命周期

一次拖动的生命周期通过一系列回调和事件进行描述和控制，下面以包含 3 个容器的示例为例进行说明 （直接复制了文档没有翻译，API 详细解释可以看后面介绍。）：

sql

 代码解读

复制代码

`Mouse     Calls  Callback / Event       Parameters              Notes down   o                                                        Initial click move   o                                                        Initial drag        |        |         get-child-payload()    index                   Function should return payload        |        |   3 x   should-accept-drop()   srcOptions, payload     Fired for all containers        |        |   3 x   drag-start             dragResult              Fired for all containers        |        |         drag-enter        v move   o                                                        Drag over containers        |        |   n x   drag-leave                                     Fired as draggable leaves container        |   n x   drag-enter                                     Fired as draggable enters container        v up     o                                                        Finish drag                  should-animate-drop()  srcOptions, payload     Fires once for dropped container            3 x   drag-end               dragResult              Fired for all containers            n x   drop                   dropResult              Fired only for droppable containers`

请注意，应在每次 `drag-start` 之前和每次 `drag-end` 之前触发 `should-accept-drop`，但为了清晰起见，此处已省略。

其中 `dragResult` 参数的格式：

js

 代码解读

复制代码

`dragResult: {     payload,        # 负载 可以理解为用来记录被拖动的对象     isSource,       # 是否是被拖动的容器本身     willAcceptDrop, # 是否可以被放置 }`

其中 `dropResult` 参数的格式：

js

 代码解读

复制代码

`dropResult: {     addedIndex,     # 被放置的新添加元素的下标，没有则为 null     removedIndex,   # 将被移除的元素下标，没有则为 null     payload,        # 拖动的元素对象，可通过 getChildPayload 指定     droppedElement, # 放置的 DOM 元素 }`

### 回调

回调在用户交互之前和期间提供了额外的逻辑和检查。

*   `get-child-payload(index)` 自定义传给 `onDrop()` 的 `payload` 对象。
    
*   `should-accept-drop(sourceContainerOptions, payload)` 用来确定容器是否可被放置，会覆盖 `group-name` 属性。
    
*   `should-animate-drop(sourceContainerOptions, payload)` 返回 `false` 则阻止放置动画。
    
*   `get-ghost-parent()` 返回幽灵元素（拖动时显示的元素）应该添加到的元素，默认是父元素，某些情况定位会出现问题，则可以选择自定义，如返回 `document.body`。
    

### 事件

*   `@drag-start` 在拖动开始时由所有容器发出的事件。参数 `dragResult`。
    
*   `@drag-end` 所有容器在拖动结束时调用的函数。 在 `@drop` 事件之前调用。参数 `dragResult`。
    
*   `@drag-enter` 每当拖动的项目在拖动时进入其边界时，相关容器要发出的事件。
    
*   `@drag-leave` 每当拖动的项目在拖动时离开其边界时，相关容器要发出的事件。
    
*   `@drop-ready` 当容器中可能放置位置的索引发生变化时，被拖动的容器将调用的函数。基本上，每次容器中的可拖动对象滑动以打开拖动项目的空间时都会调用它。参数 `dropResult`。
    
*   **`@drop`** 放置结束时所有相关容器会发出的事件（放置动画结束后）。源容器和**任何可以接受放置的容器**都被认为是相关的。参数 `dropResult`。
    

API: Draggable
--------------

### `tag`

同容器的 `tag` 指定可拖拽元素的 DOM 元素标签。

实战
--

实现一个简单的团队协作任务管理器。

html

 代码解读

复制代码

`<template>     <div class="card-scene">         <Container                 orientation="horizontal"                 @drop="onColumnDrop($event)"                 drag-handle-selector=".column-drag-handle"         >             <Draggable v-for="column in taskColumnList" :key="column.name">                 <div class="card-container">                     <div class="card-column-header">                         <span class="column-drag-handle">&#x2630;</span>                         {{ column.name }}                     </div>                     <Container                             group-name="col"                             @drop="(e) => onCardDrop(column.id, e)"                             :get-child-payload="getCardPayload(column.id)"                             drag-class="card-ghost"                             drop-class="card-ghost-drop"                             :drop-placeholder="dropPlaceholderOptions"                             class="draggable-container"                     >                         <Draggable v-for="task in column.list" :key="task.id">                             <div class="task-card">                                 <div class="task-title">{{ task.name }}</div>                                 <div class="task-priority" :style="{ background: priorityMap[task.priority].color }">                                     {{ priorityMap[task.priority].label }}                                 </div>                             </div>                         </Draggable>                     </Container>                 </div>             </Draggable>         </Container>     </div> </template> <script>     import { Container, Draggable } from "vue-smooth-dnd";     const applyDrag = (arr, dragResult) => {         const { removedIndex, addedIndex, payload } = dragResult         console.log(removedIndex, addedIndex, payload)         if (removedIndex === null && addedIndex === null) return arr         const result = [...arr]         let itemToAdd = payload         if (removedIndex !== null) {             itemToAdd = result.splice(removedIndex, 1)[0]         }         if (addedIndex !== null) {             result.splice(addedIndex, 0, itemToAdd)         }         return result     }     const taskList = [         {             name: '首页',             priority: 'P1',             status: '待开发',             id: 1,         },         {             name: '流程图开发',             priority: 'P3',             status: '待评审',             id: 2,         },         {             name: '统计图展示',             priority: 'P0',             status: '开发中',             id: 3,         },         {             name: '文件管理',             priority: 'P1',             status: '开发中',             id: 4,         }     ]     const statusList = ['待评审', '待开发', '开发中', '已完成']     const taskColumnList = statusList.map((status, index) => {         return {             name: status,             list: taskList.filter(item => item.status === status),             id: index         }     })     const priorityMap = {         'P0': {             label: '最高优',             color: '#ff5454',         },         'P1': {             label: '高优',             color: '#ff9a00',         },         'P2': {             label: '中等',             color: '#ffd139',         },         'P3': {             label: '较低',             color: '#1ac7b5',         },     }     export default {         name: 'Cards',         components: {Container, Draggable},         data () {             return {                 taskColumnList,                 priorityMap,                 dropPlaceholderOptions: {                     className: 'drop-preview',                     animationDuration: '150',                     showOnTop: true                 }             }         },         methods: {             onColumnDrop (dropResult) {                 this.taskColumnList = applyDrag(this.taskColumnList, dropResult)             },             onCardDrop (columnId, dropResult) {                 let { removedIndex, addedIndex, payload } = dropResult                 if (removedIndex !== null || addedIndex !== null) {                     const column = taskColumnList.find(p => p.id === columnId)                     if (addedIndex !== null && payload) { // 更新任务状态                         dropResult.payload = {                             ...payload,                             status: column.name,                         }                     }                     column.list = applyDrag(column.list, dropResult)                 }             },             getCardPayload (columnId) {                 return index =>                     this.taskColumnList.find(p => p.id === columnId).list[index]             },         }     } </script> <style>     * {         margin: 0;         padding: 0;         font-family: 'Microsoft YaHei','PingFang SC','Helvetica Neue',Helvetica,sans-serif;         line-height: 1.45;         color: rgba(0,0,0,.65);     }     .card-scene {         user-select: none;         display: flex;         height: 100%;         margin: 20px;     }     .card-container {         display: flex;         flex-direction: column;         width: 260px;         min-width: 260px;         border-radius: 12px;         background-color: #edeff2;         margin-right: 16px;         height: calc(100vh - 40px);     }     .card-column-header {         display: flex;         height: 50px;         margin: 0 16px;         align-items: center;         flex-shrink: 0;         font-weight: 500;         font-size: 16px;     }     .draggable-container {         flex-grow: 1;         overflow: auto;     }     .column-drag-handle {         cursor: move;         padding: 5px;     }     .task-card {         margin: 10px;         background-color: white;         padding: 15px 10px;         border-radius: 8px;         box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.12);         cursor: pointer;         display: flex;         justify-content: space-between;     }     .task-title {         color: #333333;         font-size: 14px;     }     .task-priority {         width: 60px;         line-height: 20px;         border-radius: 12px;         text-align: center;         color: #fff;         font-size: 12px;     }     .card-ghost {         transition: transform 0.18s ease;         transform: rotateZ(5deg)     }     .card-ghost-drop {         transition: transform 0.18s ease-in-out;         transform: rotateZ(0deg)     }     .drop-preview {         background-color: rgba(150, 150, 200, 0.1);         border: 1px dashed #abc;         margin: 5px;     } </style>`

效果

![dnd4.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0862ed1613f34747a1348a5a2fb4b848~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)