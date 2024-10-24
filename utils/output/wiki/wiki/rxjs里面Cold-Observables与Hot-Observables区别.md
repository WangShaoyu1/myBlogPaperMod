---
author: "王宇"
title: "rxjs里面Cold-Observables与Hot-Observables区别"
date: 一月02,2024
description: "rxjs"
tags: ["rxjs"]
ShowReadingTime: "12s"
weight: 539
---
由于异步场景十分复杂，web端这边的虚拟人项目都在不少的场景用上了rxjs

  

在RxJS中，Observables分为两种：Cold Observables和Hot Observables。这两种类型在何时开始推送数据上存在显著的差异。

Cold Observables，如其名，是冷的，它们在被订阅后才开始运行和推送数据。具体来说，只有一个订阅者订阅时，Cold Observable才会创建一个新的数据生产者并开始推送数据。每个订阅者接收到的数据都是从序列的第一个值开始的。例如，一些需要用户交互才能产生数据的事件，如点击事件，就是典型的冷Observable。

相反，Hot Observables则会在被订阅之前就开始产生数据。无论有多少个订阅者，Hot Observable都只会创建一个数据生产者。所有的订阅者共享同一个数据生产者，即它们接收到的数据是一样的。最常见的Hot Observable例子就是鼠标移动事件，因为无论是否有订阅者，鼠标移动事件都会持续产生。

  

#### Hot Observables

`Hot Observables` 不管有没有被订阅都会产生值。是多播的，多个订阅共享同一个实例，是从订阅开始接受到值，每个订阅接收到的值是不同的，取决于它们是从什么时候开始订阅。

这里有几种场景，我们可以逐一分析一下便于理解：

##### “加热”

首先可以忽略代码中出现的陌生的函数，后面会细说。

[?](#)

`const` `source = Rx.Observable.of(``1``,` `2``).publish();`

`source.connect();`

`source.subscribe((value) => console.log(``'A：'` `+ value));`

`setTimeout(() => {`

    `source.subscribe((value) => console.log(``'B：'` `+ value));`

`},` `1000``);`

这里首先用`Rx`的操作符`of`创建了一个`Observable`，并且后面跟上了一个`publish`函数，在创建完之后调用`connect`函数进行开始数据发送。

最终代码的执行结果就是没有任何数据打印出来，分析一下原因其实也比较好理解，由于开启数据发送的时候还没有订阅，并且这是一个`Hot Observables`，它是不会理会你是否有没有订阅它，开启之后就会直接发送数据，所以`A`和`B`都没有接收到数据。

当然你这里如果把`connect`方法放到最后，那么最终的结果就是`A`接收到了，`B`还是接不到，因为`A`在开启发数据之前就订阅了，而`B`还要等一秒。

##### 更直观的场景

正如上述多播所描述的，其实我们更多想看到的现象是能够`A`和`B`两个观察者能够都有接收到数据，然后观察数据的差别，这样会方便理解。

这里直接换一个发射源：

[?](#)

`const source = Rx.Observable.interval(1000).take(3).publish();`

`source.subscribe((value: number) => console.log(``'A：'` `+ value));`

`setTimeout(() => {`

    `source.subscribe((value: number) => console.log(``'B：'` `+ value));`

`}, 3000);`

`source.connect();`

  

这里我们利用`interval`配合`take`操作符每秒发射一个递增的数，最多三个，然后这个时候的打印结果就更清晰了，`A`正常接收到了三个数，`B`三秒之后才订阅，所以只接收到了最后一个数 2，这种方式就是上述多播所描述的并无一二。

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)