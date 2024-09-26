---
author: "bookbuke"
title: "React跨组件通讯最佳实践（个人总结）"
date: 2024-09-24
description: "以上代码中，模拟通讯场景，顶层组件Parent中有一个计数器parentCount，同时最内层的组件有一个childCount。假设我想在顶层组件修改childCount，即父组件调用子组件函数。并且"
tags: ["JavaScript","React.js"]
ShowReadingTime: "阅读1分钟"
weight: 831
---
话不多说，进入正题

typescript

 代码解读

复制代码

`const ChildD: React.FC<{   parentCount: number;   setParentCount: React.Dispatch<React.SetStateAction<number>>; }> = ({ parentCount, setParentCount }) => {   const [childCount, setChildCount] = React.useState(0);   return (     <div>       <div>{childCount}</div>       <div         onClick={() => {           setParentCount((prev) => prev + 1);         }}       >         {parentCount}       </div>     </div>   ); }; const ChildC: React.FC = () => {   return <ChildD />; }; const ChildB: React.FC = () => {   return <ChildC />; }; const ChildA: React.FC = () => {   return <ChildB />; }; const Parent: React.FC = () => {   const [parentCount, setParentCount] = React.useState(0);   return (     <div>       <div         onClick={() => {           setChildCount((prev) => prev + 1);         }}       >        changeChild       </div>       <ChildA />     </div>   ); };`

以上代码中，模拟通讯场景，顶层组件Parent中有一个计数器parentCount，同时最内层的组件有一个childCount。假设我想在顶层组件修改childCount，即父组件调用子组件函数。并且，在ChildD中，我想显示parentCount，且修改它。

一般思路，可以通过props层层传递parentCount，useImperativeHandle层层暴露setChildCount。显然这样处理要写一些比较恶心的传递代码。

ok，看我是如何做

typescript

 代码解读

复制代码

`import * as React from 'react'; import { createStore } from 'hox'; import { useEventEmitter } from 'ahooks'; export const [useStore, StoreProvider] = createStore(() => {   const [parentCount, setParentCount] = React.useState(0);   const childCountSet$ = useEventEmitter<React.SetStateAction<number>>();   return {     parentCount,     setParentCount,     childCountSet$,   }; }); const ChildD: React.FC = () => {   const { childCountSet$, parentCount, setParentCount } = useStore();   const [childCount, setChildCount] = React.useState(0);   childCountSet$.useSubscription((action) => {     setChildCount(action);   });   return (     <div>       <div>{childCount}</div>       <div         onClick={() => {           setParentCount((prev) => prev + 1);         }}       >         {parentCount}       </div>     </div>   ); }; const ChildC: React.FC = () => {   return <ChildD />; }; const ChildB: React.FC = () => {   return <ChildC />; }; const ChildA: React.FC = () => {   return <ChildB />; }; const Parent: React.FC = () => {   const { childCountSet$ } = useStore();   return (     <div>       <div         onClick={() => {           childCountSet$.emit((prev) => prev + 1);         }}       >         changeChild       </div>       <ChildA />     </div>   ); }; const ParentWithProvider: React.FC = () => {   return (     <StoreProvider>       <Parent />     </StoreProvider>   ); };`

上文中，我使用hox创建了一个局部的状态管理，并将parentCount转移到状态管理中，ChildD组件，只需要

typescript

 代码解读

复制代码

  `const { parentCount, setParentCount } = useStore();`

即可实现跨组件使用顶层数据及方法。

然后，要让Parent调用ChildD的setChildCount。我这里采用了ahooks的useEventEmitter。同样也是在hox创建的store中声明了event。

typescript

 代码解读

复制代码

  `const { childCountSet$ } = useStore();`

这样就能在provider包裹的组件中任意位置取用啦。

大家有什么更优雅的方式实现我的需求吗？欢迎指教👏