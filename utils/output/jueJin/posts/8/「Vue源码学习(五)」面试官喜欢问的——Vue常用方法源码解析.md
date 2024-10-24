---
author: "Sunshine_Lin"
title: "「Vue源码学习(五)」面试官喜欢问的——Vue常用方法源码解析"
date: 2021-06-16
description: "前言 冲啊，学起来啊！！！欢迎阅读此系列文章： 「Vue源码学习(一)」你不知道的-数据响应式原理 「Vue源码学习(二)」你不知道的-模板编译原理 「Vue源码学习(三)」你不知道的-初次渲染原理 "
tags: ["面试","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读1分钟"
weight: 1
selfDefined:"likes:92,comments:0,collects:55,views:9822,"
---
前言
--

冲啊，学起来啊！！！欢迎阅读此系列文章：

*   [「Vue源码学习(一)」你不知道的-数据响应式原理](https://juejin.cn/post/6968732684247892005 "https://juejin.cn/post/6968732684247892005")
*   [「Vue源码学习(二)」你不知道的-模板编译原理](https://juejin.cn/post/6969563640416436232 "https://juejin.cn/post/6969563640416436232")
*   [「Vue源码学习(三)」你不知道的-初次渲染原理](https://juejin.cn/post/6970209585671979044 "https://juejin.cn/post/6970209585671979044")
*   [「Vue源码学习(四)」立志写一篇人人都看的懂的computed，watch原理](https://juejin.cn/post/6970209585671979044 "https://juejin.cn/post/6970209585671979044")
*   [「Vue源码学习(五)」面试官喜欢问的——Vue常用方法源码解析](https://juejin.cn/post/6970209585671979044 "https://juejin.cn/post/6970209585671979044") 或者对我的其他`vue源码文章`感兴趣的可以看我的这些文章：
*   [一周一个Vue小知识：你想知道Vuex的实现原理吗？](https://juejin.cn/post/6952473110377414686 "https://juejin.cn/post/6952473110377414686")
*   [一周一个Vue小知识：你真的知道插槽Slot是怎么“插”的吗](https://juejin.cn/post/6949848530781470733 "https://juejin.cn/post/6949848530781470733")

代码实现
----

### 1.Vue.set

```js
    export default function set(target, key, val) {
        if (Array.isArray(target)) {
        target.length = Math.max(target.length, key)
        target.splice(key, 1, val)
        return val
    }
    
    const ob = target.__ob__
    
        if (key in target && !(key in target.prototype) || !ob) {
        target[key] = val
        return val
    }
    
    defineReactive(target, key, val)
    return val
}
```

### 2.Vue.delete

```js
    export default function del (target, key) {
        if (Array.isArray(target)) {
        target.splice(key, 1)
        return
    }
    
    const ob = target.__ob__
    
    if (!(key in target)) return
    
delete target[key]

if (!ob) return

ob.dep.notify()
}
```

### 3.Vue.observable

```js
    export default function observable (obj) {
    observable(obj)
    return obj
}
```

### 4.Vue.use

```js
    export default function use (plugin) {
    const installedPlugins = this._installedPlugins || (this._installedPlugins = [])
        if (installedPlugins.indexOf(plugin) > -1) {
        return this
    }
    
    const args = toArray(arguments, 1); // 获取参数
    args.unshift(this); //在参数中增加Vue构造函数
    
        if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args)
            } else if (typeof plugin === 'function') {
            plugin.apply(null, args)
        }
        
        installedPlugins.push(plugin)
        return this
    }
```

### 5.nextTick

```js
let callbacks = []; //回调函数
let pending = false;
    function flushCallbacks() {
    pending = false; //把标志还原为false
    // 依次执行回调
        for (let i = 0; i < callbacks.length; i++) {
        callbacks[i]();
    }
}
let timerFunc; //先采用微任务并按照优先级优雅降级的方式实现异步刷新
    if (typeof Promise !== "undefined") {
    // 如果支持promise
    const p = Promise.resolve();
        timerFunc = () => {
        p.then(flushCallbacks);
        };
            } else if (typeof MutationObserver !== "undefined") {
            // MutationObserver 主要是监听dom变化 也是一个异步方法
            let counter = 1;
            const observer = new MutationObserver(flushCallbacks);
            const textNode = document.createTextNode(String(counter));
                observer.observe(textNode, {
                characterData: true,
                });
                    timerFunc = () => {
                    counter = (counter + 1) % 2;
                    textNode.data = String(counter);
                    };
                        } else if (typeof setImmediate !== "undefined") {
                        // 如果前面都不支持 判断setImmediate
                            timerFunc = () => {
                            setImmediate(flushCallbacks);
                            };
                                } else {
                                // 最后降级采用setTimeout
                                    timerFunc = () => {
                                    setTimeout(flushCallbacks, 0);
                                    };
                                }
                                
                                    export function nextTick(cb) {
                                    callbacks.push(cb);
                                        if (!pending) {
                                        pending = true;
                                        timerFunc();
                                    }
                                }
```

结语
--

冲冲冲！