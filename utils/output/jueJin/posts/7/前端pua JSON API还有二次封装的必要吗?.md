---
author: "徐小夕"
title: "前端pua JSON API还有二次封装的必要吗?"
date: 2021-12-05
description: "答案是肯定的 虽然 javascript 的 JSON API 内置了两种方法方便我们快捷的处理数据格式转换 JSONparse() 用于将一个 JSON 字符串转换为JavaScript对象"
tags: ["前端","JavaScript","GitHub中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:32,comments:0,collects:34,views:4369,"
---
答案是肯定的.

> `JSON` 是 JavaScript Object Notation 的缩写，最初是被设计为 `JavaScript` 的一个子集，因其和编程语言无关，所以成为了一种开放标准的常见数据格式。虽然 `JSON` 是源自于`JavaScript`，但到目前很多编程语言都有了 `JSON` 解析的库，如 C、Java、Python 等。

虽然 **javascript** 的 `JSON API` 内置了两种方法方便我们快捷的处理数据格式转换:

*   **JSON.parse()** 用于将一个 JSON 字符串转换为 JavaScript 对象
*   **JSON.Stringify()** 用于将 JavaScript 值转换为 JSON 字符串

但也存在不少限制, 比如:

1.  `JSON.Stringify` 无法序列化 **函数**, **正则表达式** 等
2.  `JSON.parse` 无法反序列化具有 **函数**, **正则表达式** 等格式的数据
3.  `JSON.Stringify` 和`JSON.parse` 性能问题
4.  `JSON.Stringify` 和`JSON.parse` 解析出错导致整个系统 pua

这些问题我们不得不从 **二次封装** 的角度去解决.

第3个问题社区已经有比较可靠的解决方案可以来解决 `JSON` 方法的性能问题, 其核心思想就是 **结构化json定义**. 比如我们最常讨论的 `JSON Schema`, `simdjson` 就是一个不错的方案.

第四个问题也有解决方案, 就是在使用 `JSON.Stringify` 和`JSON.parse` 的地方包一层 `try catch`, 缺点就是每次调用都需要包 `try catch`, 不太符合前端 er 们的简约风.

所以分析了这么多, 针对复杂业务场景, 我们非常有必要二次封装 **JSON API** !

在上篇文章中我介绍了解决 1 和 2 问题的方案, 感兴趣的可以参考:

*   [前端进阶: 如何用javascript存储函数?](https://juejin.cn/post/7035528221596581919 "https://juejin.cn/post/7035528221596581919")

> 该 json 解析器基于原生`JSON API`进行的上层封装, 支持序列化函数, 正则类型

*   支持原生 json api 调用方式`nativeStringify`, `nativeParse`
*   支持序列化和反序列化函数 `stringify`, `fastStringify`, `parse`
*   支持序列化和反序列化正则 `stringify`, `fastStringify`, `parse`
*   内置开箱即用的工具方法
    *   判断函数类型 `isFunc`
    *   判断对象类型 `isObj`
    *   判断数组类型 `isArr`
    *   判断对象或数组类型 `isArrOrObj`
    *   判断正则类型 `isRegExp`

同时方案中也解决了 4 中提到的问题, 并且支持操作后的回调, 使用方法如下:

1.  安装 xijs

```bash
yarn add xijs
```

2.  使用

```js
import { parser } from 'xijs';

    const door = {
    a: 1,
    b: function () {},
        c: {
        c1: 'h5-dooring',
        c2: () => {},
            c3: {
            c: '3fvc',
                d: {
                dd: () => {},
                ee: /[a-z]/g,
                },
                },
                },
                d: /[0-9]/g,
                };
                
                // 将对象序列化
                parser.stringify(door);
                
                // 结果如下:
                    // {
                    //	"a": 1,
                    //	"b": "__xfunc__function b() {}",
                        //	"c": {
                        //		"c1": "h5-dooring",
                        //		"c2": "__xfunc__function c2() {}"
                    //	}
                // }
                
                // 将json数据反解析成对象
                parser.parse(parser.stringify(door));
                
                // 结果如下:
                    // {
                    //	a: 1,
                    //	b: function b() {},
                        //	c: {
                        //		c1: "h5-dooring",
                    //		c2: function c2() {}
                //	}
            // }
```

同时 `xijs` 还在持续扩充更有用的工具函数, 让业务开发更高效. 目前已集成了如下工具函数:

*   **store** 基于 `localStorage` 上层封装的支持过期时间设置的缓存库, 支持操作回调
*   **uuid** 生成唯一id, 支持设置长度
*   **randomStr** 生成指定个数的随机字符串
*   **formatDate** 开箱即用的时间格式化工具
*   **debounce** 防抖函数
*   **throttle** 节流函数
*   **url2obj** 将url字符串转换为对象
*   **obj2url** 将对象转换成编码后的url字符串
*   **isPC** 判断设备是否为PC类型

github地址: [github.com/MrXujiang/x…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fxijs "https://github.com/MrXujiang/xijs")

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