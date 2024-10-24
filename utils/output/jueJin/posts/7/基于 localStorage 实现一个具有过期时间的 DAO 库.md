---
author: "徐小夕"
title: "基于 localStorage 实现一个具有过期时间的 DAO 库"
date: 2019-07-11
description: "本文主要解决原生localStorage无法设置过期时间的问题，并通过封装，来实现一个操作便捷，功能强大的localStorage库，关于库封装的一些基本思路和模式，我将采用之前写的如何用不到200行代码写一款属于自己的js类库中类似的方法，感兴趣的朋友可以学习，交流。 我们将…"
tags: ["JavaScript","开源中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:176,comments:0,collects:192,views:7348,"
---
![](/images/jueJin/16bde21b04e7fb5.png) 本文主要解决原生localStorage无法设置过期时间的问题，并通过封装，来实现一个操作便捷，功能强大的localStorage库，关于库封装的一些基本思路和模式，我将采用之前写的[如何用不到200行代码写一款属于自己的js类库](https://juejin.cn/post/6844903880707293198 "https://juejin.cn/post/6844903880707293198")中类似的方法，感兴趣的朋友可以学习，交流。

### 设计思路

![](/images/jueJin/16bde2cc2a49e41.png)

我们将基于localStorage原始api进行扩展，让其支持失效时间，操作完成后的回调。在文章的最后，我将给出库的完成代码，接下来我们就一步步实现吧。

### 正文

1.  首先，我们来设计库的基本框架：

```js
    const BaseStorage = function(preId, timeSign){
    // 初始化一些操作
}

    BaseStorage.prototype = {
    storage: localStorage || window.localStorage,
        set: function(key, value, cb, time){
        
        },
            get: function(key, cb){
            
            },
            // 删除storage，如果删除成功，返回删除的内容
                remove: function(key, cb){
                
            }
        }
```

如上可以发现，我们的storage会有三个核心api，分别为set，get，remove，我们使用localStorage作为基础库支持，当然你也可以将上面的库换成sessionStorage或者其他。

2.  有了基本骨架，我们就可以实现基本功能的封装，这里我们先在原型中加一个属性，来列出数据操作中的各个状态。

```js
    status: {
    SUCCESS: 0, // 成功
    FAILURE: 1, // 失败
    OVERFLOW: 2, // 数据溢出
    TIMEOUT: 3  // 超时
    },
```

为了实现过期时间，我们有两种思路，第一种是先将一个过期时间存到storage中，每次操作都检查一遍是否过期，但是这种方案意味着对不同的键就要设置不同的过期时间的storage与之对应，这样会占用额外的库内存，维护起来也不方便。另一种方法就是将过期时间存放到键值中，将时间和值通过标识符分隔，每次取的时候从值中截取过期时间，再将真实的值取出来返回，这种方案不会添加额外的键值对存储，维护起来也相对简单，所以我们采用这种方案。 为了区分不同的库对象，我们还可以添加键前缀，如下：

```js
    const BaseLocalStorage = function(preId, timeSign){
    this.preId = preId; // 键前缀
    this.timeSign = timeSign || '|-|';  // 过期时间和值的分隔符
}
```

基于这个思想，我们就可以接下来的实现了。

*   getKey——修饰key的方法，不影响用户对真实key的影响

```js
    getKey: function(key){
    return this.preId + key
    },
```

*   set实现

```js
    set: function(key, value, cb, time){
    var status = this.status.SUCCESS,
    key = this.getKey(key);
    // 设置失效时间，未设置时间默认为一个月
        try{
        time = new Date(time).getTime() || time.getTime();
            }catch(e){
            time = new Date().getTime() + 1000*60*60*24*31
        }
            try{
            this.storage.setItem(key, time + this.timeSign + value);
                }catch(e){
                status = this.status.OVERFLOW;
            }
            // 操作完成后的回调
            cb && cb.call(this, status, key, value)
        }
```

*   get实现

```js
    get: function(key, cb){
    var status = this.status.SUCCESS,
    key = this.getKey(key),
    value = null,
    timeSignLen = this.timeSign.length,
    that = this,
    index,
    time,
    result;
        try{
        value = that.storage.getItem(key);
            }catch(e){
                result = {
                status: that.status.FAILURE,
                value: null
            }
            cb && cb.call(this, result.status, result.value);
            return result
        }
            if(value) {
            index = value.indexOf(that.timeSign);
            time = +value.slice(0, index);
            // 判断是否过期，过期则清除
                if(time > new Date().getTime() || time == 0){
                value = value.slice(index+timeSignLen);
                    }else{
                    value = null,
                    status = that.status.TIMEOUT;
                    that.remove(key);
                }
                    }else{
                    status = that.status.FAILURE;
                }
                    result = {
                    status: status,
                    value: value
                    };
                    cb && cb.call(this, result.status, result.value);
                    return result
                }
```

*   remove实现

```js
// 删除storage，如果删除成功，返回删除的内容
    remove: function(key, cb){
    var status = this.status.FAILURE,
    key = this.getKey(key),
    value = null;
        try{
        value = this.storage.getItem(key);
            }catch(e){
            // dosomething
        }
            if(value){
                try{
                this.storage.removeItem(key);
                status = this.status.SUCCESS;
                    }catch(e){
                    // dosomething
                }
            }
            cb && cb.call(this, status, status > 0 ? null : value.slice(value.indexOf(this.timeSign) + this.timeSign.length))
        }
```

在api的实现过程中，由于某种误操作很可能导致storage报错，所以建议最好用trycatch包裹，这样可以避免影响后面的逻辑。

接下来我们可以这么使用：

```js
let a = new BaseStorage('_', '@');
a.set('name', '123')
a.get('name') // {status: 0, value: "123"}
// 设置失效时间
a.set('name', '123', null, new Date().getTime() + 1000*60*60*24*31)
// 移除
a.remove('name')
```

### 完整源码

```js
/**
* 数据管理器
*/
    (function(win){
        const BaseStorage = function(preId, timeSign){
        this.preId = preId;
        this.timeSign = timeSign || '|-|';
    }
    
        BaseStorage.prototype = {
            status: {
            SUCCESS: 0,
            FAILURE: 1,
            OVERFLOW: 2,
            TIMEOUT: 3
            },
            storage: localStorage || window.localStorage,
                getKey: function(key){
                return this.preId + key
                },
                    set: function(key, value, cb, time){
                    var status = this.status.SUCCESS,
                    key = this.getKey(key);
                    // 设置失效时间，未设置时间默认为一个月
                        try{
                        time = new Date(time).getTime() || time.getTime();
                            }catch(e){
                            time = new Date().getTime() + 1000*60*60*24*31
                        }
                            try{
                            this.storage.setItem(key, time + this.timeSign + value);
                                }catch(e){
                                status = this.status.OVERFLOW;
                            }
                            cb && cb.call(this, status, key, value)
                            },
                                get: function(key, cb){
                                var status = this.status.SUCCESS,
                                key = this.getKey(key),
                                value = null,
                                timeSignLen = this.timeSign.length,
                                that = this,
                                index,
                                time,
                                result;
                                    try{
                                    value = that.storage.getItem(key);
                                        }catch(e){
                                            result = {
                                            status: that.status.FAILURE,
                                            value: null
                                        }
                                        cb && cb.call(this, result.status, result.value);
                                        return result
                                    }
                                        if(value) {
                                        index = value.indexOf(that.timeSign);
                                        time = +value.slice(0, index);
                                            if(time > new Date().getTime() || time == 0){
                                            value = value.slice(index+timeSignLen);
                                                }else{
                                                value = null,
                                                status = that.status.TIMEOUT;
                                                that.remove(key);
                                            }
                                                }else{
                                                status = that.status.FAILURE;
                                            }
                                                result = {
                                                status: status,
                                                value: value
                                                };
                                                cb && cb.call(this, result.status, result.value);
                                                return result
                                                },
                                                // 删除storage，如果删除成功，返回删除的内容
                                                    remove: function(key, cb){
                                                    var status = this.status.FAILURE,
                                                    key = this.getKey(key),
                                                    value = null;
                                                        try{
                                                        value = this.storage.getItem(key);
                                                            }catch(e){
                                                            // dosomething
                                                        }
                                                            if(value){
                                                                try{
                                                                this.storage.removeItem(key);
                                                                status = this.status.SUCCESS;
                                                                    }catch(e){
                                                                    // dosomething
                                                                }
                                                            }
                                                            cb && cb.call(this, status, status > 0 ? null : value.slice(value.indexOf(this.timeSign) + this.timeSign.length))
                                                        }
                                                    }
                                                    
                                                    win.BS = BaseStorage;
                                                    })(window)
                                                    
```

大家也可以基于此扩展更强大的功能，如果有更好的想法，欢迎交流，探讨。

### 更多推荐

*   [9012教你如何使用gulp4开发项目脚手架](https://juejin.cn/post/6844903882124967949 "https://juejin.cn/post/6844903882124967949")
*   [如何用不到200行代码写一款属于自己的js类库)](https://juejin.cn/post/6844903880707293198 "https://juejin.cn/post/6844903880707293198")
*   [让你瞬间提高工作效率的常用js函数汇总(持续更新)](https://juejin.cn/post/6844903878362660878 "https://juejin.cn/post/6844903878362660878")
*   [一张图教你快速玩转vue-cli3](https://juejin.cn/post/6844903877133729799 "https://juejin.cn/post/6844903877133729799")
*   [3分钟教你用原生js实现具有进度监听的文件上传预览组件](https://juejin.cn/post/6844903875632168968 "https://juejin.cn/post/6844903875632168968")
*   [3分钟教你用原生js实现具有进度监听的文件上传预览组件](https://juejin.cn/post/6844903875632168968 "https://juejin.cn/post/6844903875632168968")
*   [使用Angular8和百度地图api开发《旅游清单》](https://juejin.cn/post/6844903873212055560 "https://juejin.cn/post/6844903873212055560")
*   [js基本搜索算法实现与170万条数据下的性能测试](https://juejin.cn/post/6844903866610221064 "https://juejin.cn/post/6844903866610221064")
*   [《前端算法系列》如何让前端代码速度提高60倍](https://juejin.cn/post/6844903865553256461 "https://juejin.cn/post/6844903865553256461")
*   [《前端算法系列》数组去重](https://juejin.cn/post/6844903863674208269 "https://juejin.cn/post/6844903863674208269")
*   [vue高级进阶系列——用typescript玩转vue和vuex](https://juejin.cn/post/6844903831956897806 "https://juejin.cn/post/6844903831956897806")
*   [前端三年，谈谈最值得读的5本书籍](https://juejin.cn/post/6844903824788815879 "https://juejin.cn/post/6844903824788815879")