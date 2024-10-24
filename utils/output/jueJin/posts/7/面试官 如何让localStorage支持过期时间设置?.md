---
author: "徐小夕"
title: "面试官 如何让localStorage支持过期时间设置?"
date: 2021-12-12
description: "聊到 localStorage 想必熟悉前端的朋友都不会陌生, 我们可以使用它提供的 getItem, setItem, removeItem, clear 这几个 API 轻松的对存储在浏览器本地的"
tags: ["JavaScript","GitHub","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:341,comments:0,collects:493,views:36087,"
---
聊到 `localStorage` 想必熟悉前端的朋友都不会陌生, 我们可以使用它提供的 `getItem`, `setItem`, `removeItem`, `clear` 这几个 `API` 轻松的对存储在浏览器本地的数据进行\*\*「读,写, 删」**操作, 但是相比于 `cookie`, `localStorage` 唯一美中不足的就是**「不能设置每一个键的过期时间」\*\*。

> ❝
> 
> localStorage 属性允许我们访问一个 Document 源（origin）的对象 Storage；存储的数据将保存在浏览器会话中。 localStorage 类似 sessionStorage，但其区别在于：存储在 localStorage 的数据可以长期保留；而当页面会话结束——也就是说，当页面被关闭时，存储在 sessionStorage 的数据会被清除 。
> 
> ❞

我们还应注意，`localStorage` 中的键值对总是以字符串的形式存储。

问题描述
----

在实际的应用场景中, 我们往往需要让 `localStorage` 设置的某个 **「key」** 能在指定时间内自动失效, 所以基于这种场景, 我们如何去解决呢?

### 1\. 初级解法

对于刚熟悉前端的朋友, 可能会立马给出答案:

```js
localStorage.setItem('dooring', '1.0.0')
// 设置一小时的有效期
const expire = 1000 * 60 * 60;
    setTimeout(() => {
    localStorage.setItem('dooring', '')
    }, expire)
```

当然这种方案能解决一时的问题, 但是如果要设置任意键的有效期, 使用这种方案就需要编写多个定时器, **「维护成本极高, 且不利于工程化复用」**。

### 2\. 中级解法

前端工程师在有一定的工作经验之后, 往往会去考虑工程化和复用性的问题, 并对数据结构有了一定的了解, 所以可能会有接下来的解法:

1.  用\*\*「localStorage」\*\*存一份{key(键): expire(过期时间)}的映射表
2.  重写\*\*「localStorage API」\*\*, 对方法进行二次封装

类似的代码如下:

```js
    const store = {
    // 存储过期时间映射
        setExpireMap: (key, expire) => {
        const expireMap = localStorage.getItem('EXPIRE_MAP') || "{}"
        localStorage.setItem(
        'EXPIRE_MAP',
            JSON.stringify({
            ...JSON.parse(expireMap),
            key: expire
            }))
            },
                setItem: (key, value, expire) => {
                store.setExpireMap(key, expire)
                localStorage.setItem(key, value)
                },
                    getItem: (key) => {
                    // 在取值之前先判断是否过期
                    const expireMap = JSON.parse(
                    localStorage.getItem('EXPIRE_MAP') || "{}"
                    )
                        if(expireMap[key] && expireMap[key] < Date.now()) {
                        return localStorage.getItem(key)
                            }else {
                            localStorage.removeItem(key)
                            return null
                        }
                    }
                    // ...
                }
```

眨眼一看这个方案确实解决了复用性的问题, 并且不同团队都可以使用这个方案, 但仍然有一些缺点:

*   对 `store` 操作时需要维护2份数据, 并且占用缓存空间
*   如果 `EXPIRE_MAP` 误删除将会导致所有过期时间失效
*   对操作过程缺少更灵活的控制(比如操作状态, 操作回调等)

### 3\. 高级解法

为了减少维护成本和空间占用, 并支持一定的灵活控制和容错能力, 我们又应该怎么做呢?

这里笔者想到了两种类似的方案:

1.  将过期时间存到 `key` 中, 如 dooring|6000, 每次取值时通过分隔符“|”来将 `key` 和 `expire` 取出, 进行判断
2.  将过期时间存到 `value` 中, 如 1.0.0|6000, 剩下的同1

为了更具有封装性和可靠性, 我们还可以配置不同状态下的回调, 简单实现如下:

```js
    const store = {
    preId: 'xi-',
    timeSign: '|-door-|',
        status: {
        SUCCESS: 0,
        FAILURE: 1,
        OVERFLOW: 2,
        TIMEOUT: 3,
        },
        storage: localStorage || window.localStorage,
            getKey: function (key: string) {
            return this.preId + key;
            },
            set: function (
            key: string,
            value: string | number,
            time?: Date & number,
            cb?: (status: number, key: string, value: string | number) => void,
                ) {
                let _status = this.status.SUCCESS,
                _key = this.getKey(key),
                _time;
                // 设置失效时间，未设置时间默认为一个月
                    try {
                    _time = time
                    ? new Date(time).getTime() || time.getTime()
                    : new Date().getTime() + 1000 * 60 * 60 * 24 * 31;
                        } catch (e) {
                        _time = new Date().getTime() + 1000 * 60 * 60 * 24 * 31;
                    }
                        try {
                        this.storage.setItem(_key, _time + this.timeSign + value);
                            } catch (e) {
                            _status = this.status.OVERFLOW;
                        }
                        cb && cb.call(this, _status, _key, value);
                        },
                        get: function (
                        key: string,
                        cb?: (status: number, value: string | number | null) => void,
                            ) {
                            let status = this.status.SUCCESS,
                            _key = this.getKey(key),
                            value = null,
                            timeSignLen = this.timeSign.length,
                            that = this,
                            index,
                            time,
                            result;
                                try {
                                value = that.storage.getItem(_key);
                                    } catch (e) {
                                        result = {
                                        status: that.status.FAILURE,
                                        value: null,
                                        };
                                        cb && cb.call(this, result.status, result.value);
                                        return result;
                                    }
                                        if (value) {
                                        index = value.indexOf(that.timeSign);
                                        time = +value.slice(0, index);
                                            if (time > new Date().getTime() || time == 0) {
                                            value = value.slice(index + timeSignLen);
                                                } else {
                                                (value = null), (status = that.status.TIMEOUT);
                                                that.remove(_key);
                                            }
                                                } else {
                                                status = that.status.FAILURE;
                                            }
                                                result = {
                                                status: status,
                                                value: value,
                                                };
                                                cb && cb.call(this, result.status, result.value);
                                                return result;
                                                },
                                                // ...
                                                };
                                                
                                                export default store;
```

这样, 我们就实现了每个 `key` 都有独立的过期时间, 并且对不同的操作结果可以轻松的进行状态管控啦~

### 4\. 骨灰级解法

当然, 骨灰级解法是直接使用 `xijs` 这个 `javascript` 工具库, 因为我已经将上述完整实现方案封装到该库中了, 我们只需要使用如下的方案, 就能轻松使用具有过期时间的强大的 **「localStorage」** 方法啦 :

```js
//  先安装 yarn add xijs
import { store } from 'xijs';
// 设置带有过期时间的key
store.set('name', 'dooring', Date.now() + 1000);
console.log(store.get('name'));
    setTimeout(() => {
    console.log(store.get('name'));
    }, 1000);
    
    // 设置成功后的回调
        store.set('dooring', 'xuxiaoxi', Date.now() + 1000, (status, key, value) => {
        console.log('success');
        });
```

同时 `xijs` 还在持续扩充更有用的工具函数, 让业务开发更高效. 目前已集成了如下工具函数:

*   **「store」** 基于 `localStorage` 上层封装的支持过期时间设置的缓存库, 支持操作回调
*   **「uuid」** 生成唯一id, 支持设置长度
*   **「randomStr」** 生成指定个数的随机字符串
*   **「formatDate」** 开箱即用的时间格式化工具
*   **「debounce」** 防抖函数
*   **「throttle」** 节流函数
*   **「url2obj」** 将url字符串转换为对象
*   **「obj2url」** 将对象转换成编码后的url字符串
*   **「isPC」** 判断设备是否为PC类型

github地址: [github.com/MrXujiang/x…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fxijs "https://github.com/MrXujiang/xijs")

文档地址: [h5.dooring.cn/xijs](https://link.juejin.cn?target=http%3A%2F%2Fh5.dooring.cn%2Fxijs "http://h5.dooring.cn/xijs")

如果觉得有帮助, 不要忘记 star 哦~

更多推荐
----

*   [如何搭积木式的快速开发H5页面?](https://juejin.cn/post/6904878119724056584 "https://juejin.cn/post/6904878119724056584")
*   [从零开发一套基于React的加载动画库](https://juejin.cn/post/7028583529940254757 "https://juejin.cn/post/7028583529940254757")
*   [从零开发一款轻量级滑动验证码插件](https://juejin.cn/post/7007615666609979400 "https://juejin.cn/post/7007615666609979400")
*   [如何设计可视化搭建平台的组件商店？](https://juejin.cn/post/6986824393653485605 "https://juejin.cn/post/6986824393653485605")
*   [从零设计可视化大屏搭建引擎](https://juejin.cn/post/6981257575425654792 "https://juejin.cn/post/6981257575425654792")
*   [从零使用electron搭建桌面端可视化编辑器Dooring](https://juejin.cn/post/6976476731662139428 "https://juejin.cn/post/6976476731662139428")
*   [(低代码)可视化搭建平台数据源设计剖析](https://juejin.cn/post/6973946702235615269 "https://juejin.cn/post/6973946702235615269")
*   [从零搭建一款PC页面编辑器PC-Dooring](https://juejin.cn/post/6950075140906418213 "https://juejin.cn/post/6950075140906418213")