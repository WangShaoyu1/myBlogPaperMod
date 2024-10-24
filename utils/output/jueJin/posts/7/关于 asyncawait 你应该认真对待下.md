---
author: "Gaby"
title: "关于 asyncawait 你应该认真对待下"
date: 2022-06-12
description: "无论是在项目还是在面试过程中，总还是会有那么一小部分同学，没有学会使用 `asyncawait` ，今天就特地整理下并提醒大家常用的技术点还是要会的，不单是为了应对面试需要，日常工作中也是有利无害的"
tags: ["JavaScript","面试","ECMAScript 6中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:106,comments:0,collects:185,views:15185,"
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第13天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

废话只说一句：码字不易求个👍，收藏 === 学会,快行动起来吧！🙇‍🙇‍🙇‍。

为回馈掘金的小伙伴们，特地做了个文档站点，将前端知识及日常封装的工具类系统的整理在该站点上，希望能帮到更多的小伙伴[☞传送门](https://link.juejin.cn?target=https%3A%2F%2Fdocs.ycsnews.com%2F "https://docs.ycsnews.com/")，目前，本站内容正紧锣密鼓的更新中！

无论是在项目还是在面试过程中，总还是会有那么一小部分同学，没有学会使用 `async/await` ，今天就特地整理了几个代码段，并以此文进行提醒大家常用的技术点还是要会的，不单单只是应对面试需要，在日常工作中使用，也会提升你的效率及代码质量的，不必每次都使用 `.then` 进行处理，错误输出可以写个公共方法，统一处理。⛽️ 加油,共勉！！！ 无论是在项目还是在面试过程中，总还是会有那么一小部分同学，没有学会使用 `async/await` ，今天就特地整理下并提醒大家常用的技术点还是要会的，不单是为了应对面试需要，日常工作中也是有利无害的

深入理解 async/await
----------------

### async 函数

*   一个语法糖 是异步操作更简单
    
*   返回值 返回值是一个 promise 对象
    
    *   return 的值是 promise resolved 时候的 value
    *   Throw 的值是 Promise rejected 时候的 reason

```js
    async function test() {
    return true
}
const p = test()
console.log(p) // 打印出一个promise，状态是resolved，value是true

//  Promise {<fulfilled>: true}
//   [[Prototype]]: Promise
//   [[PromiseState]]: "fulfilled"
//   [[PromiseResult]]: true

    p.then((data) => {
    console.log(data) // true
    })
``````js
    async function test() {
    throw new Error('error')
}
const p = test()
console.log(p) // 打印出一个promise，状态是rejected，value是error
    p.then((data) => {
    console.log(data) //打印出的promise的reason 是error
    })
```

可以看出 async 函数的返回值是一个 promise

### await 函数

*   只能出现在 async 函数内部或最外层
*   等待一个 promise 对象的值
*   await 的 promise 的状态为 rejected，后续执行中断

await 可以 await promise 和非 promsie，如果非 primse，例如：await 1 就返回 1

![](/images/jueJin/5cf8092c341646f.png)

await 为等待 promise 的状态是 resolved 的情况

```js
    async function async1() {
    console.log('async1 start')
    await async2() // await为等待promise的状态，然后把值拿到
    console.log('async1 end')
}
    async function async2() {
        return Promsie.resolve().then(_ => {
        console.log('async2 promise')
        })
    }
    async1()
    /*
    打印结果
    async1 start
    async2 promise
    async1 end
    */
```

await 为等待 promise 的状态是 rejected 的情况

```js
    async function f() {
    await Promise.reject('error')
    //后续代码不会执行
    console.log(1)
    await 100
}

// 解决方案1
    async function f() {
        await Promise.reject('error').catch(err => {
        // 异常处理
        })
        console.log(1)
        await 100
    }
    
    // 解决方案2
        async function f() {
            try {
            await Promise.reject('error')
                } catch (e) {
                // 异常处理
                    } finally {
                }
                console.log(1)
                await 100
            }
```

### async 函数实现原理

实现原理：Generator+自动执行器

async 函数是 Generator 和 Promise 的语法糖

应用
--

### 用 async 函数方案读取文件

```js
const fs = require('fs')

    async function readFilesByAsync() {
        const files = [
        '/Users/xxx/Desktop/Web/1.json',
        '/Users/xxx/Desktop/Web/2.json',
        '/Users/xxx/Desktop/Web/3.json'
    ]
        const readFile = function(src) {
            return new Promise((resolve, reject) => {
                fs.readFile(src, (err, data) => {
                if (err) reject(err)
                resolve(data)
                })
                })
            }
            
            const str0 = await readFile(files[0])
            console.log(str0.toString())
            const str1 = await readFile(files[1])
            console.log(str1.toString())
            const str2 = await readFile(files[2])
            console.log(str2.toString())
        }
```