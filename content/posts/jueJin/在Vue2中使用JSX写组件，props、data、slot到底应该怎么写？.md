---
author: "我不吃饼干"
title: "在Vue2中使用JSX写组件，props、data、slot到底应该怎么写？"
date: 2021-10-08
description: "在实现复杂组件，比如递归组件时，在HTML写很多逻辑总归不够优雅，于是还是想学习下在Vue中如何用JSX写组件。那么在Vue中简洁好用的`props`、`data`、`method`"
tags: ["前端","Vue.js"]
ShowReadingTime: "阅读2分钟"
weight: 612
---
小知识，大挑战！本文正在参与“[程序员必备小知识](https://juejin.cn/post/7008476801634680869 "https://juejin.cn/post/7008476801634680869")”创作活动。

本文已参与「[掘力星计划](https://juejin.cn/post/7012210233804079141/ "https://juejin.cn/post/7012210233804079141/")」，赢取创作大礼包，挑战创作激励金。

在实现复杂组件，比如递归组件时，在 HTML 写很多逻辑总归不够优雅，于是还是想学习下在 Vue 中如何用 JSX 写组件。那么在 Vue 中简洁好用的 `props`、`data`、`method`、`slot` 在JSX 分别要怎么使用？

本文假设你已有 JSX 基础，仅针对在 Vue2 中使用 JSX 进行介绍，如果不了解 JSX 可以先去学习下相关语法。

一、基础组件
------

实现一个简单的包含 `data`，`props`，`methods` 的组件，注意，不像 React 中需要使用 `className` 在 Vue 中 `class` 可以直接使用。`data`，`props`，`methods` 都可简单的通过 `this.`去引用。

js

 代码解读

复制代码

`<script>     export default {         props: {             initValue: {                 type: Number,                 default: 0             }         },         data() {             return {                 counter: this.initValue             };         },         methods: {             onClick() {                 this.counter++;             }         },         render(h) {             return (                 <div class="add-button-box">                     <p>current value is { this.counter }</p>                     <button onClick={ this.onClick }>Add 1</button>                 </div>             );         },     } </script> <style scoped>     .add-button-box {         width: 200px;         border: 1px solid gray;         padding: 20px;         background: #fff;     }     .add-button-box button {         padding: 3px 5px;         margin-top: 10px;     } </style>`

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc0bcbb2728d403f9aa9dac165f6380a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

二、包含插槽 slot 的组件
---------------

可以通过 `this.$slots.default` 引用默认插槽，`this.$slots.{slotName}` 形式引用具名插槽。

`v-show` 指令可以像在普通的模板里一样直接使用。不过大部分其他指令包括 `v-if` 是不支持的，可以通过 js 编程很简单的解决这个问题，比如：

js

 代码解读

复制代码

`if (visible) return <div><span>v-if</span></div> else return <div></div>`

插槽应用实例，实现一个可折叠的面板：

js

 代码解读

复制代码

`<script>     export default {         name: 'CollapseCard',         data() {             return {                 visible: true,             }         },         methods: {             onClick() {                 this.visible = !this.visible             }         },         render(h) {             return (                 <div class="collapse-card">                     <header class="header" onClick={this.onClick}>                         { this.$slots.header }                     </header>                     <article class="content" v-show={this.visible}>                         { this.$slots.default }                     </article>                 </div>             );         },     } </script> <style scoped>     .collapse-card {         border: 1px solid #d7d7d7;         box-shadow: 1px 1px 4px 1px rgba(0,0,0,0.1);         background: #fff;         width: 400px;         border-radius: 6px;     }     .header {         height: 40px;         border-bottom: 1px solid #d7d7d7;         text-align: center;         cursor: pointer;     }     .content {         min-height: 200px;         overflow: auto;         padding: 10px;     } </style>`

在父组件中使用插槽，就和在模板中一样使用即可。

html

 代码解读

复制代码

`<script>     import CollapseCard from './CollapseCard.vue';     export default {         components: {             CollapseCard         },         data() {             return {                 str: '每天每天加班加点早畜晚归\n为了明天后天畜类拔萃\n只能说 okay\n不能说很累\n没时间恋爱没有机会畜双入对\n那些学弟学妹后畜可畏\n没有时间 畜畜可怜\n再坚持几年\n总会有一天赚大钱'             }         },         render(h) {             return (                 <CollapseCard>                     <div slot="header" style="color: tomato;font-weight: 900;line-height: 40px;">社畜烧酒</div>                     <div style="white-space: pre;text-align: center;color: #333;font-size: 14px;"                     >{this.str}</div>                 </CollapseCard>             );         }     } </script>`

效果

![jsx-slot.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6c2212b6fe5443a9fdc7bba5f2edb07~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

三、作用域插槽
-------

作用域插槽让插槽内容能够访问子组件中才有的数据。

在子组件通过 `this.$scopedSlots.{slotName}` 来使用插槽，默认插槽为 `this.$scopedSlots.default`。

这里需要列表的遍历，但是在 JSX 里面不能使用 `v-for`，是通过 `map` 实现的。

js

 代码解读

复制代码

`<script>     export default {         name: 'TodoList',         props: {             list: Array,         },         render(h) {             const list = this.list.map(item =>                 <li class="list-item" key={item.id}>                     <div class="item-info">                         <span class="content">{item.content}</span>                         <span class="username">{item.username}</span>                     </div>                     { this.$scopedSlots.default && this.$scopedSlots.default(item) }                 </li>             )             const empty = <div class="empty">暂无内容</div>             return (                 <div class="todo-list">                     <ul>{ this.list.length ? list : empty }</ul>                 </div>             )         },     } </script> <style scoped>     .todo-list {         background: #fff;         padding: 20px;         border: 1px solid #d7d7d7;         width: 500px;     }     .list-item {         height: 50px;         border-bottom: 1px solid #d7d7d7;         display: flex;         align-items: center;         color: rgba(0,0,0,0.65);         font-size: 14px;     }     .item-info {         flex: 400px 0 0;     }     .content {         display: inline-block;         width: 300px;     }     .username {         font-size: 12px;         background: #c078ff;         padding: 3px 5px;         border-radius: 5px;         color: #fff;     }     .empty {         height: 50px;         text-align: center;         color: #adadad;         line-height: 50px;     } </style>`

在父组件通过 JSX 使用作用域插槽需要通过 `scopedSlots` 对象指定插槽，`key` 为插槽的名字，值为一个函数，函数入参即为子组件传过来的参数，函数返回值为插槽的展示的 DOM。

js

 代码解读

复制代码

`<script>     import TodoList from './TodoList.vue';     export default {         components: {             TodoList         },         data() {             return {                 list: [                     {                         id: 1,                         username: '火龙果',                         content: '写一篇文章'                     },                     {                         id: 2,                         username: '香蕉',                         content: '阅读Vue源码'                     },                     {                         id: 3,                         username: '苹果',                         content: '学习TypeScript'                     },                     {                         id: 4,                         username: '山竹',                         content: '写一个组件库'                     },                 ]             }         },         methods: {             del(record) {                 let index = this.list.findIndex(item => item.id === record.id)                 this.list.splice(index, 1)             }         },         render(h) {             const scopedSlots = {                 default: (record) => <button class="del-button" onClick={() => this.del(record)}>删 除</button>             }             return (                 <TodoList list={this.list} scopedSlots={scopedSlots}>                 </TodoList>             );         }     } </script> <style scoped>     .del-button {         border: none;         font-size: 12px;         border-radius: 3px;         background: transparent;         color: tomato;         text-decoration: underline;         cursor: pointer;     }     .del-button:active {         color: red;     } </style>`

效果展示

![jsx-scopedSlot.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84ac51b99ce54cc3b36131e82405dbb9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

四、写一个递归组件（实现树形组件）
-----------------

最开始想用 JSX 而不是模板写组件就是因为想写一个递归组件，感觉 JSX 可能会简单一些。

实例，用 JSX 实现一个树形组件。

js

 代码解读

复制代码

`<script>     export default {         name: 'Tree',         props: {             data: Array,             offset: {                 type: Number,                 default: 0             }         },         data() {             return {                 showChildren: this.data.map(() => true),             }         },         methods: {             change(index) {                 this.$set(this.showChildren, index, !this.showChildren[index])             }         },         render(h) {             const { data, offset, showChildren, change } = this             return (                 <div class="tree-box">                     {                         data.map((node, index) => {                             if (node.children && node.children.length) {                                 return <div class="father-node">                                     <div class="node-label" onClick={() => change(index)} style={{ paddingLeft: offset + 'px' }}>                                         <span class="icon">{ showChildren[index] ? '▼' : '▶' }</span>                                         <span>{node.label}</span>                                     </div>                                     {                                         showChildren[index]                                             ? <Tree data={node.children} offset={ offset + 20 }></Tree>                                             : null                                     }                                 </div>                             }                             return <div class="node-label"                                         style={{ paddingLeft: (offset + 16) + 'px' }}>                                 {node.label}                             </div>                         })                     }                 </div>             );         },     } </script> <style scoped>     .tree-box {         color: rgba(0,0,0,0.64);     }     .icon {         display: inline-block;         width: 16px;         font-size: 12px;         transform: scale(0.8);         color: #b5b5b5;     }     .node-label {         height: 20px;         cursor: pointer;     }     .node-label:hover {         background: #f7f7f7;     } </style>`

在父组件中使用

js

 代码解读

复制代码

`<script>     import Tree from './Tree.vue';     export default {         components: {             Tree         },         data() {             return {                 treeData: [                     {                         label: '1',                         children: [                             {                                 label: '1-1',                             },                             {                                 label: '1-2',                                 children: [                                     {                                         label: '1-2-1',                                     },                                     {                                         label: '1-2-2',                                     },                                 ]                             }                         ]                     },                     {                         label: '2',                         children: [                             {                                 label: '2-1',                             },                             {                                 label: '2-2',                             },                             {                                 label: '2-3',                             },                         ]                     },                     {                         label: '3',                     }                 ]             }         },         render(h) {             return (                 <Tree data={this.treeData} />             )         }     } </script>`

最终效果

![jsx-tree.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/208e2b7c6f134516a3d114c5169cefea~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

参考文档
----

*   [github.com/vuejs/jsx](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fjsx "https://github.com/vuejs/jsx")
*   [学会使用Vue JSX，一车老干妈都是你的](https://juejin.cn/post/6846687590704381959 "https://juejin.cn/post/6846687590704381959")