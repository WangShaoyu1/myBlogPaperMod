---
author: "Gaby"
title: "再复习复习 Promise "
date: 2022-06-24
description: "promise 是ES6引入的进行异步编程新的解决方案，旧方案都是单纯使用回调函数，从语法上来说它就是个构造函数，从功能上来说，promise对象用来封装异步的任务，并且可以对结果进行处理。"
tags: ["JavaScript","面试","ECMAScript 6中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:37,comments:0,collects:52,views:3229,"
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第25天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

废话只说一句：码字不易求个👍，收藏 === 学会,快行动起来吧！🙇‍🙇‍🙇‍。

### Promise介绍与基本使用

promise 是ES6引入的进行异步编程新的解决方案，旧方案都是单纯使用回调函数，从语法上来说它就是个构造函数，从功能上来说，promise对象用来封装异步的任务，并且可以对结果进行处理。promise的最大好处在于支持链式操作并可以解决回调地狱的问题，且它在指定回调和错误处理这块更加灵活与方便。

异步编程包括：fs文件操作、数据库操作、Ajax、定时器

1.什么是回调地狱？ 回调函数嵌套调用，外部回调函数异步执行的结果是嵌套的回调执行的条件 2.回调地狱的缺点？ 不便于阅读 不便于异常处理 3.解决方案？ promise链式调用

// resolve 解决 异步任务成功时调用 // reject 拒绝 异步任务失败时调用

Promise APl Promise关键问题 Promise自定义封装 async 与 await

### 为什么要用Promise？

2.2.1.指定回调函数的方式更加灵活 1、旧的：必须在启动异步任务前指定 2. promise：启动异步任务=>返回 promise 对象=>给promise对象绑定回调函 数（甚至可以在异步任务结束后指定/多个） 2.2.2.支持链式调用，可以解决回调地狱问题 1.什么是回调地狱？

```js
// 使用 Promise 处理
    const p = new Promise((resolve, reject)=>{
    // 可以通过 promise 进行封装 当请求成功 n 个之后返回成功状态
        setTimeout(() =>{
        //获取从1-100的一个随机数
        let n = Math.floor(Math.random(1,100)*100);
        console.log(n);
            if(n>30){
            resolve(n);//将promise对象的状态设置为「成功」
                } else {
                reject(n);//将promise对象的状态设置为「失败」
            }
            
            }, 1000);
            });
            // 调用  value 值  reason 理由 ，就是接收resolve或reject方法中传的形参
                p.then((value) => {
                console.log('成功了呗');
                    },(reason)=>{
                    console.log('失败了吧');
                    })
``````js
// Promise实践练习-fs读取文件 要在 node 环境下执行
const fs = require('fs');
//Promise 形式
    let p = new Promise((resolve , reject)=>{
        fs.readFile('./resource/content.tx', (err, data)=>{
        //如果出错
        if(err) reject(err);
        //如果成功
        resolve(data);
        });
        });
        //调用 then
            p.then(value=>{
            console.log(value.toString())
            },
                reason=>{
                console.log(reason);
                });
``````js
const btn = document.querySelector('#btn');

    btn.addEventListener('click', function(){
    //1.创建对象
    const xhr = new XMLHttpRequest();
    //2.初始化 调用诗词接口
    xhr.open('GET','http://poetry.apiopen.top/sentences');
    //3.发送
    xhr.send();
    //4.处理响应结果
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){
            //判断响应状态码2xx
                if(xhr.status >= 200 && xhr.status < 300){
                //控制台输出响应体
                console.log(xhr.response);
                    }else{
                    //控制台输出响应状态码
                    console.log(xhr.status);
                }
            }
        }
        })
``````js
// 使用 Promise 封装 AJAX请求
//创建 Promise 形式
    let p = new Promise((resolve, reject)=>{
    //1.创建对象
    const xhr = new XMLHttpRequest();
    //2.初始化 调用诗词接口
    xhr.open('GET','http://poetry.apiopen.top/sentences');
    //3.发送
    xhr.send();
    //4.处理响应结果
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){
            //判断响应状态码2xx
                if(xhr.status >= 200 && xhr.status < 300){
                //控制台输出响应体
                resolve(xhr.response);
                    }else{
                    //控制台输出响应状态码
                    reject(xhr.status);
                }
            }
        }
        });
        
        //调用 then
            p.then(value=>{
            console.log(value.toString())
            },
                reason=>{
                console.log(reason);
                });
```

封装 Promise 函数

```js
    function promFn (){
        return new Promise((resolve, reject)=>{
        // 判断
        let err = '错误'
        if(err) reject(err);
        let data = '成功了';
        // 成功
        resolve(data);
        });
    }
    
        promFn().then(value=>{
        console.log(value.toString());
            }, reason=>{
            console.log(reason);
            });
            
```

### promise的状态改变

```js
[[Prototype]]: Promise
[[PromiseState]]: "fulfilled"
[[PromiseResult]]: "{\"code\":200,\"message\":\"成功!\"}"

Promise {<pending>}
[[Prototype]]: Promise
catch: ƒ catch()
constructor: ƒ Promise()
finally: ƒ finally()
then: ƒ then()
Symbol(Symbol.toStringTag): "Promise"
[[Prototype]]: Object
[[PromiseState]]: "pending"
[[PromiseResult]]: undefined
```

### Promise对象

#### Promise对象的状态值

实例对象中的一个属性『 PromiseState 』

*   pending未决定的
*   resolved/ fullfilled 成功
*   rejected失败

#### Promise对象的结果值

实例对象中的另一个属性PromiseResult 保存着对象『成功/失败』的结果

*   resolved
*   rejected 只有这两个值可以对结果进行改变

1.  由 pending 变为 resolved
2.  由 pending变为 rejected 说明：只有这2种，且一个 promise对象只能改变一次 无论变为成功还是失败，都会有一个结果数据 成功的结果数据一般称为 value，失败的结果数据一般称为 reason

### Promise 的基本工作流程

首先要通过 new promise() 创建一个对象，在 promise 内部封装异步操作，如果异步操作成功则调用 resolve() 函数，resolve一调则将 promise 的状态该为成功即 fullfilled。成功在调 then 方法时，调用的是第一个参数，即第一个回调函数中的代码，让它返回一个新的 promise 对象。then 方法的返回对象也是一个新的 promise 对象。 如果 promise 对象的操作失败了，则调 reject() 将状态设置为失败，调用reject 时，失败之后将调用 then 方法当中的第二个回调函数，并且返回一个 promise。

### Promise 的 API

1.  promise构造函数：可以通过 new Promise() 实例化一个对象。实例化需要接收一个参数，这个参数是一个函数类型的参数。称之为执行器函数，可以使用箭头函数去声明，也可以通过匿名函数去声明。 Promise(excutor){} ，而且这个函数当中有两个形参 resolve 和 reject。

*   （1）executor函数:执行器函数（resolve，reject）=> {}, resolve 和 reject 是内部定义的。
*   （2） resolve函数：内部定义异步任务执行成功时我们调用的函数value=>{}
*   （3）reject函数：内部定义异步任务执行失败时我们调用的函数reason=>{} 说明：执行器函数 executor 是在 Promise 内部立即同步调用的，异步操作在执行器中执行。

2.  Promise.prototype.then方法：（onResolved，onRejected） =>{}

*   (1)onResolved 函数：成功的回调函数（value）=》{}
*   （2）onRejected函数：失败的回调函数（reason）=》{} 说明：指定用于得到成功value的成功回调和用于得到失败reason的失败回调 返回一个新的promise对象

3.  Promise.prototype.catch方法：捕获异步执行失败的情况（onRejected）=>{}

*   （1）onRejected函数：失败的回调函数（reason）=>{}

4.  Promise.resolve方法：（value）=>{}

*   （1） value：成功的数据或promise对象 说明：返回一个服功/失败的promise对象 //如果传入的参数为非Promise类型的对象，则返回的结果为成功promise对象 //如果传入的参数为Promise对象，则参数的结果决定了resolve的结果 let p2= Promise.resolve(new Promise((resolve, reject) =>{

}))

5.  Promise.reject方法：（reason）=>{}

*   （1） reason：失败的原因 说明：返回一个失败的promise对象

6.  Promise.all方法：（promises）=>{}

*   （1） promises：包含n个promise的数组 说明：返回一个新的promise，只有所有的promise都成功才成功，只要有一个失败了就直接失败。成功时是所有成功 promise 的结果值组合成的数组，失败时返回的是第一个失败的那 个 promise 的状态和值。

```js
const p1 = Promise.reject('失败1')
const p2 = Promise.reject('失败2')
const p3 = Promise.resolve('成功')

const res = Promise.all([p1,p2,p3])
console.log(res);// 返回 p1 的结果
```

7.  Promise.race方法：（promises）=>{}

*   （1） promises：包含n个promise的数组 说明：返回一个新的promise，第一个完成的promise的结果状态就是最终的结果状态

### promise的几个关键问题

1.  如何改变promise 的状态？

*   （1） resolve(value)：如果当前是pending就会变为resolved
*   （2） reject(reason)：如果当前是pending就会变为rejected
*   （3）拋出异常：`throw '出问题了';` 如果当前是pending就会变为rejected

2.  一个 promise 使用 then 方法指定多个成功/失败回调函数，都会调用吗？  
    当promise 改变为对应状态时对应的回调函数都会被调用
    
3.  改变promise状态和指定回调函数谁先谁后？(先改变状态还是先执行回调)
    

*   （1）都有可能，正常情况下是先指定回调再改变状态，resolve 中任务为异步任务的时候，异步任务居多。但也可以先改状态再指定回调，resolve 中的任务为同步任务的时候。
*   （2）如何先改状态再指定回调？ ①在执行器中直接调用resolve()/reject() ②延迟更长时间才调用then()
*   （3）什么时候才能得到数据？  
    指回调函数什么时候执行，执行的时候即可以拿到数据  
    ①如果先指定的回调，那当状态发生改变时，回调函数就会调用，得到数据  
    ②如果先改变的状态，那当指定回调时，回调函数就会调用，得到数据

4.  promise.then（）返回的新promise的结果状态由什么决定？

*   （1）简单表达：由then（）指定的回调函数执行的结果决定
*   （2）详细表达： ①如果抛出异常，新promise变为rejected，reason为抛出的异常如果返回的是非promise的任意值，新promise变为resolved，value为返回的值如果返回的是另一个新promise，此promise的结果就会成为新promise的结果

5.  promise 如何串连多个操作任雾？ （1） promise 的 then() 返回一个新的promise，可以写成 then() 的链式调用 （2）通过then的链式调用串连多个同步/异步任务
    
6.  promise异常传透？ （1）当使用promise的then链式调用时，可以在最后指定失败的回调 （2）前面任何操作出了异常，都会传到最后失败的回调中处理
    

```js
// 无论中间那一层出现错误，最终都会由 catch 捕获
    p.then(value =>{
    // console.log(111);
    throw'失败啦！"；
        }).then(value =>{
        console.log(222);
            }).then(value =>{
            console.log(333);
                }).catch(reason =>{
                console.warn(reason)
                })
                
```

7.  中断promise链？ （1）当使用promise的then链式调用时，在中间中断，不再调用后面的回调函数 （2）办法：有且只有一种方式，则是在回调函数中返回一个 pendding 状态的promise 对象

### Promise all 方法实现

```js
//添加all方法
    Promise.all = function(promises){
    //返回结果为promise对象
        return new Promise((resolve, reject)=>{
        //声明变量
        let count = 0;
        let arr = [];
            for(let i=0;i<promises.length;i++){
                promises[i].then(v=>{
                //得知对象的状态是成功 成功时 count + 1
                count++;
                // 保存执行结果
                arr[i]=v;
                // 每个 promise 对象 都成功的时候才会返回 resolve()
                    if(count === promises.length){
                    resolve(arr);
                }
                    },r=>{
                    reject(r);
                    });
                }
                });
            }
```

### Promise race 方法实现

```js
//添加all方法
    Promise.race = function(promises){
    //返回结果为promise对象
        return new Promise((resolve, reject)=>{
            for(let i=0;i<promises.length;i++){
                promises[i].then(v=>{
                resolve(v);
                    },r=>{
                    reject(r);
                    });
                }
                });
            }
```

### await表达式

*   1.await右侧的表达式一般为promise对象，但也可以是其它的值；
*   2.如果表达式是promise对象，await返回的是promise成功的值
*   3.如果表达式是其它值，直接将此值作为await的返回值

#### 注意

1.await必须写在async函数中，但async函数中可以没有await  
2.如果await的promise失败了，就会抛出异常，需要通过try...catch捕获处理