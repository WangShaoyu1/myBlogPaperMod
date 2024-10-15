---
author: "王宇"
title: "学习rxjs自定义操作符"
date: 八月22,2024
description: "rxjs"
tags: ["rxjs"]
ShowReadingTime: "12s"
weight: 528
---
实现一个英文字母转大写的操作符

[?](#)

`const toUpperCase = () => source => Observable.create(subscriber => {`

    `const subscription = source.subscribe(`

        `value => {`

            `try` `{`

                `subscriber.next(value.toUpperCase());`

            `}``catch``(error) {`

                `subscriber.error(``'Some error occur: '` `+ err.toString());`

            `}`

        `},`

        `err =>  { subscriber.error(err) },`

        `() => { subscriber.complete()}`

    `)`

    `return` `subscription;`

`});`

**Observable.create** 后面建议换成**new Observable**

  

更简洁写法

[?](#)

`const toUpperCase = () => source => source.pipe(`

    `map(value => value.toUpperCase()),`

    `catchError(err => of(``'Some error occur: '` `+ err.toString()))`

`);`

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)