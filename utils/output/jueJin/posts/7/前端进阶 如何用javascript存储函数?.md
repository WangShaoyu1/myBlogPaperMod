---
author: "徐小夕"
title: "前端进阶 如何用javascript存储函数?"
date: 2021-11-28
description: "背景介绍 我们都知道要想搭建一个前端页面基本需要如下3个要素 元素(UI) 数据(Data) 事件交互(Event) 在 数据驱动视图 的时代, 这三个要素的关系往往如下图所示 可视化搭建平台的"
tags: ["JavaScript","设计模式","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:32,comments:0,collects:33,views:4256,"
---
> 任何一家Saas企业都需要有自己的低代码平台.在可视化低代码的前端研发过程中, 发现了很多有意思的技术需求, 在解决这些需求的过程中, 往往也会给自己带来很多收获, 今天就来分享一下在研发Dooring过程中遇到的前端技术问题——javascript函数存储.

### 背景介绍

我们都知道要想搭建一个前端页面基本需要如下3个要素:

*   元素(UI)
*   数据(Data)
*   事件/交互(Event)

在 **数据驱动视图** 的时代, 这三个要素的关系往往如下图所示:

![image.png](/images/jueJin/a5500f22114b449.png)

可视化搭建平台的设计思路往往也是基于上面的过程展开的, 我们需要提供编辑器环境给用户来创建**视图**和**交互**, 最终用户保存的产物可能是这样的:

```js
    {
    "name": "Dooring表单",
    "bgColor": "#666",
    "share_url": "http://xxx.cn",
        "mount_event": [
            {
            "id": "123",
                "func": () => {
                // 初始化逻辑
                GamepadHapticActuator();
                },
            "sourcedata": []
        }
        ],
            "body": [
                {
                "name": "header",
                    "event": [
                        {
                        "id": "123",
                        "type": "click",
                            "func": () => {
                            // 组件自定义交互逻辑
                            showModal();
                        }
                    }
                ]
            }
        ]
    }
```

那么问题来了, `json` 字符串我们好保存(可以通过`JSON.stringify`序列化的方式), 但是如何将**函数**也一起保存呢? 保存好了函数如何在页面渲染的时候能正常让 `js` 运行这个函数呢?

### 实现方案思考

![image.png](/images/jueJin/affb3f83df1f471.png)

我们都知道将 `js` 对象转化为`json` 可以用 `JSON.stringify` 来实现, 但是它也会有局限性, 比如:

1.  转换值如果有 toJSON() 方法，那么由 toJson() 定义什么值将被序列化
2.  非数组对象的属性不能保证以特定的顺序出现在序列化后的字符串中
3.  布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值
4.  `undefined`、任意的函数以及 symbol 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 `null`（出现在数组中时）。函数、undefined 被单独转换时，会返回 undefined，如`JSON.stringify(function(){})` or `JSON.stringify(undefined)`
5.  所有以 symbol 为属性键的属性都会被完全忽略掉，即便 `replacer` 参数中强制指定包含了它们
6.  Date 日期调用了 toJSON() 将其转换为了 string 字符串（同Date.toISOString()），因此会被当做字符串处理
7.  NaN 和 Infinity 格式的数值及 null 都会被当做 null
8.  其他类型的对象，包括 Map/Set/WeakMap/WeakSet，仅会序列化可枚举的属性

我们可以看到第4条, 如果我们序列化的对象中有函数, 它将会被忽略! 所以常理上我们使用`JSON.stringify` 是无法保存函数的, 那还有其他办法吗?

也许大家会想到先将函数转换成字符串, 再用 `JSON.stringify` 序列化后保存到后端, 最后在组件使用的时候再用 `eval` 或者 `Function` 将字符串转换成函数. 大致流程如下:

![image.png](/images/jueJin/b5358e0c006d42c.png)

不错, 理想很美好, 但是现实很\_\_\_\_\_\_\_.

接下来我们就一起分析一下关键环节 `func2string` 和 `string2func` 如何实现的.

### js存储函数方案设计

熟悉 `JSON` API 的朋友可能会知道 `JSON.stringify` 支持3个参数, 第二个参数 `replacer` 可以是一个函数或者一个数组。作为函数，它有两个参数，键（key）和值（value），它们都会被序列化。 函数需要返回 `JSON` 字符串中的 `value`, 如下所示:

*   如果返回一个 `Number`, 转换成相应的字符串作为属性值被添加入 JSON 字符串
*   如果返回一个 `String`, 该字符串作为属性值被添加入 JSON 字符串
*   如果返回一个 `Boolean`, 则 "true" 或者 "false" 作为属性值被添加入 JSON 字符串
*   如果返回任何其他对象，该对象递归地序列化成 JSON 字符串，对每个属性调用 replacer 方法。除非该对象是一个函数，这种情况将不会被序列化成 JSON 字符
*   如果返回 undefined，该属性值不会在 JSON 字符串中输出

所以我们可以在第二个函数参数里对 value类型为函数的数据进行转换。如下:

```js
    const stringify = (obj) => {
        return JSON.stringify(obj, (k, v) => {
            if(typeof v === 'function') {
            return `${v}`
        }
        return v
        })
    }
```

这样我们看似就能把函数保存到后端了. 接下来我们看看如何反序列化带函数字符串的 `json`.

因为我们将函数转换为字符串了, 我们在反解析时就需要知道哪些字符串是需要转换成函数的, 如果不对函数做任何处理我们可能需要**人肉识别**.

> **人肉识别**的缺点在于我们需要用正则把具有函数特征的字符串提取出来, 但是函数写法有很多, 我们要考虑很多情况, 也不能保证具有函数特征的字符串一定是函数.

所以我换了一种简单的方式, 可以不用写复杂正则就能将函数提取出来, 方法就是在函数序列化的时候注入标识符, 这样我们就能知道那些字符串是需要解析为函数了, 如下:

```js
    stringify: function(obj: any, space: number | string, error: (err: Error | unknown) => {}) {
        try {
            return JSON.stringify(obj, (k, v) => {
                if(typeof v === 'function') {
                return `${this.FUNC_PREFIX}${v}`
            }
            return v
            }, space)
                } catch(err) {
                error && error(err)
            }
        }
```

`this.FUNC_PREFIX` 就是我们定义的标识符, 这样我们在用 `JSON.parse` 的时候就能快速解析函数了. `JSON.parse` 也支持第二个参数, 他的用法和 `JSON.stringify` 的第二个参数类似, 我们可以对它进行转换, 如下:

```js
    parse: function(jsonStr: string, error: (err: Error | unknown) => {}) {
        try {
            return JSON.parse(jsonStr, (key, value) => {
                if(value && typeof value === 'string') {
                return value.indexOf(this.FUNC_PREFIX) > -1 ? new Function(`return ${value.replace(this.FUNC_PREFIX, '')}`)() : value
            }
            return value
            })
                } catch(err) {
                error && error(err)
            }
        }
```

`new Function` 可以把字符串转换成 js 函数, 它只接受字符串参数，其可选参数为方法的入参，必填参数为方法体内容, 一个形象的例子:

![image.png](/images/jueJin/144e0d4840ef4e2.png)

我们上述的代码中函数体的内容:

```js
new Function(`return ${value.replace(this.FUNC_PREFIX, '')}`)()
```

之所以要 `return` 是为了把原函数原封不动的还原, 大家也可以用 `eval` , 但是出于舆论还是谨慎使用.

以上方案已经能实现前端存储函数的功能了, 但是为了更工程化和健壮性还需要做很多额外的处理和优化, 这样才能让更多人开箱即用的使用你的库.

### 最后

为了让更多人能直接使用这个功能, 我将完整版 `json` 序列化方案封装成了类库, 支持功能如下:

*   stringify 在原生`JSON.stringify` 的基础上支持序列化函数,错误回调
*   parse 在原生`JSON.parse` 的基础上支持反序列化函数,错误回调
*   funcParse 将js对象中的函数一键序列化, 并保持js对象类型不变

安装方式如下:

```bash
# or npm install xijs
yarn add xijs
```

使用:

```js
import { parser } from 'xijs';

    const a = {
    x: 12,
        b: function() {
        alert(1)
    }
}

const json = parser.stringify(a);
const obj = parser.parse(json);
// 调用方法
obj.b();
```

更多推荐
----

*   [从零开发一套基于React的加载动画库](https://juejin.cn/post/7028583529940254757 "https://juejin.cn/post/7028583529940254757")
*   [从零开发一款轻量级滑动验证码插件](https://juejin.cn/post/7007615666609979400 "https://juejin.cn/post/7007615666609979400")
*   [如何设计可视化搭建平台的组件商店？](https://juejin.cn/post/6986824393653485605 "https://juejin.cn/post/6986824393653485605")
*   [从零设计可视化大屏搭建引擎](https://juejin.cn/post/6981257575425654792 "https://juejin.cn/post/6981257575425654792")
*   [从零使用electron搭建桌面端可视化编辑器Dooring](https://juejin.cn/post/6976476731662139428 "https://juejin.cn/post/6976476731662139428")
*   [(低代码)可视化搭建平台数据源设计剖析](https://juejin.cn/post/6973946702235615269 "https://juejin.cn/post/6973946702235615269")
*   [从零搭建一款PC页面编辑器PC-Dooring](https://juejin.cn/post/6950075140906418213 "https://juejin.cn/post/6950075140906418213")
*   [如何搭积木式的快速开发H5页面?](https://juejin.cn/post/6904878119724056584 "https://juejin.cn/post/6904878119724056584")