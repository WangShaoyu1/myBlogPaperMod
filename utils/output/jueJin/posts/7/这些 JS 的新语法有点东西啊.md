---
author: "yck"
title: "这些 JS 的新语法有点东西啊"
date: 2021-06-21
description: "TC39 的提案笔者一直有关注，攒了一些有趣的今天来聊聊。 PS：提案总共五个阶段，只有到阶段 4 才会被纳入到发布规范中，其它的只是有几率会被纳入。"
tags: ["JavaScript","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:112,comments:14,collects:64,views:15884,"
---
TC39 的提案笔者一直有关注，攒了一些有趣的今天来聊聊。

PS：提案总共五个阶段，只有到阶段 4 才会被纳入到发布规范中，其它的只是有几率会被纳入。

.at()
-----

这是个挺不错的[新语法](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ftc39%2Fproposal-relative-indexing-method "https://github.com/tc39/proposal-relative-indexing-method")。其他有些语言是可以用 `arr[-1]` 来获取数组末尾的元素，但是对于 JS 来说这是实现不了的事情。因为 `[key]` 对于对象来说就是在获取 `key` 对应的值。数组也是对象，对于数组使用 `arr[-1]` 就是在获取 `key` 为 `-1` 的值。

由于以上原因，我们想获取末尾元素就得这样写 `arr[arr.length - 1]`，以后有了 `at` 这个方法，我们就可以通过 `arr.at(-1)` 来拿末尾的元素了，另外同样适用类数组、字符串。

```js
// Polyfill
    function at(n) {
    // ToInteger() abstract op
    n = Math.trunc(n) || 0;
    // Allow negative indexing from the end
    if(n < 0) n += this.length;
    // OOB access is guaranteed to return undefined
    if(n < 0 || n >= this.length) return undefined;
    // Otherwise, this is just normal property access
    return this[n];
}
```

顶层 await
--------

`await` 都得用 `async` 函数包裹大家肯定都知道，这个限制导致我们不能在全局作用域下直接使用 `await`，必须得包装一下。

有了这个[提案](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ftc39%2Fproposal-top-level-await "https://github.com/tc39/proposal-top-level-await")以后，大家就可以直接在顶层写 `await` 了，算是一个便利性的提案。

目前该提案已经进入阶段 4，板上钉钉会发布。另外其实 Chrome 近期的更新已经支持了该功能。

![image-20210620162451146](/images/jueJin/3b19a52e74cf42d.png)

Error Cause
-----------

这个[语法](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ftc39%2Fproposal-error-cause "https://github.com/tc39/proposal-error-cause")主要帮助我们便捷地传递 Error。一旦可能出错的地方一多，我们实际就不清楚错误到底是哪里产生的。如果希望外部清楚的知道上下文信息的话，我们需要封装以下 error。

```js
    async function getSolution() {
    const rawResource = await fetch('//domain/resource-a')
        .catch(err => {
        // How to wrap the error properly?
        // 1. throw new Error('Download raw resource failed: ' + err.message);
        // 2. const wrapErr = new Error('Download raw resource failed');
        //    wrapErr.cause = err;
        //    throw wrapErr;
            // 3. class CustomError extends Error {
                //      constructor(msg, cause) {
                //        super(msg);
                //        this.cause = cause;
            //      }
        //    }
        //    throw new CustomError('Download raw resource failed', err);
        })
        const jobResult = doComputationalHeavyJob(rawResource);
        await fetch('//domain/upload', { method: 'POST', body: jobResult });
    }
    
    await doJob(); // => TypeError: Failed to fetch
```

那么有了这个语法以后，我们可以这样来简化代码：

```js
    async function doJob() {
    const rawResource = await fetch('//domain/resource-a')
        .catch(err => {
        throw new Error('Download raw resource failed', { cause: err });
        });
        const jobResult = doComputationalHeavyJob(rawResource);
        await fetch('//domain/upload', { method: 'POST', body: jobResult })
            .catch(err => {
            throw new Error('Upload job result failed', { cause: err });
            });
        }
        
            try {
            await doJob();
                } catch (e) {
                console.log(e);
                console.log('Caused by', e.cause);
            }
            // Error: Upload job result failed
            // Caused by TypeError: Failed to fetch
```

管道运算符
-----

这个[语法](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ftc39%2Fproposal-pipeline-operator "https://github.com/tc39/proposal-pipeline-operator")的 Star 特别多，有 5k 多个，侧面也能说明是个受欢迎的语法，但是距离发布应该还有好久，毕竟这个提案三四年前就有了，目前还只到阶段 1。

这个语法其实在其他函数式编程语言上很常见，主要是为了函数调用方便：

```js
let result = exclaim(capitalize(doubleSay("hello")));
result //=> "Hello, hello!"

let result = "hello"
|> doubleSay
|> capitalize
|> exclaim;

result //=> "Hello, hello!"
```

这只是对于单个参数的用法，其它的用法有兴趣的读者可以自行阅读提案，其中涉及到了特别多的内容，这大概也是导致推进阶段慢的原因吧。

新的数据结构：Records & Tuples
-----------------------

这个[数据结构](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ftc39%2Fproposal-record-tuple "https://github.com/tc39/proposal-record-tuple")笔者觉得发布以后会特别有用，总共新增了两种数据结构，我们可以通过 `#` 来声明：

1.  `#{ x: 1, y: 2 }`
2.  `#[1, 2, 3, 4]`

这种数据结构是不可变的，类似 React 中为了做性能优化会引入的 immer 或者 immutable.js，其中的值只接受基本类型或者同是不可变的数据类型。

```js
    const proposal = #{
    id: 1234,
    title: "Record & Tuple proposal",
    contents: `...`,
    // tuples are primitive types so you can put them in records:
    keywords: #["ecma", "tc39", "proposal", "record", "tuple"],
    };
    
    // Accessing keys like you would with objects!
    console.log(proposal.title); // Record & Tuple proposal
    console.log(proposal.keywords[1]); // tc39
    
    // Spread like objects!
        const proposal2 = #{
        ...proposal,
        title: "Stage 2: Record & Tuple",
        };
        console.log(proposal2.title); // Stage 2: Record & Tuple
        console.log(proposal2.keywords[1]); // tc39
        
        // Object functions work on Records:
    console.log(Object.keys(proposal)); // ["contents", "id", "keywords", "title"]
```

最后
--

以上笔者列举了一部分有意思的 TC39 提案，除了以上这些还有很多提案，各位读者有兴趣的话可以在 [TC39](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ftc39 "https://github.com/tc39") 中寻找。

[![](/images/jueJin/3512ebe159614b2.png)](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FKieSun%2Ffucking-frontend "https://github.com/KieSun/fucking-frontend")