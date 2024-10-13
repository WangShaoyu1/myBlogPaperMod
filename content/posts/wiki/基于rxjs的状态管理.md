---
author: "王宇"
title: "基于rxjs的状态管理"
date: 一月18,2024
description: "rxjs"
tags: ["rxjs"]
ShowReadingTime: "12s"
weight: 533
---
核心原理
====

利用**BehaviorSubject**多播

  

核心class

[?](#)

`import { BehaviorSubject } from` `'rxjs'`

`import type { Subscription,Observer } from` `'rxjs'`

`export class RxState {`

    `state`

    `private subject`

    `private subscription?: Subscription`

    `constructor(initialValue?: any) {`

        `this``.state = initialValue`

        `this``.subject =` `new` `BehaviorSubject(initialValue)`

    `}`

    `subscribe(observerOrNext?:Partial<Observer<any>> | ((value: any) => void) | undefined) {`

        `this``.subscription =` `this``.subject.subscribe(observerOrNext)`

    `}`

    `setState(newValue: any) {`

        `this``.subject.next(newValue)`

    `}`

    `getState() {`

        `return` `this``.state`

    `}`

    `destroy() {`

        `this``.subscription?.unsubscribe()`

    `}`

`}`

`export const rxState =` `new` `RxState()`

  

vue的hook

[?](#)

`import { reactive, ref, onUnmounted } from` `"vue"``;`

`import { rxState } from` `"."``;`

`export const useRxState = (initialValue: any) => {`

  `let state = ref(initialValue);`

  `if` `(initialValue) {`

    `rxState.setState(initialValue)`

  `}`

  `rxState.subscribe({`

    `next: v => {`

        `state.value = v`

    `}`

  `})`

  `onUnmounted(() => rxState.destroy());` `// 不能直接rxstate.destroy`

  `return` `state`

`};`

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)