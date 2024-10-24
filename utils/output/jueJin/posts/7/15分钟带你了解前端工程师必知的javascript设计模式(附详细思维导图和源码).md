---
author: "徐小夕"
title: "15分钟带你了解前端工程师必知的javascript设计模式(附详细思维导图和源码)"
date: 2020-01-31
description: "设计模式是一个程序员进阶高级的必备技巧,也是评判一个工程师工作经验和能力的试金石设计模式是程序员多年工作经验的凝练和总结,能更大限度的优化代码以及对已有代码的合理重构作为一名合格的前端工程师,学习设计模式是对自己工作经验的另一种方式的总结和反思,也是开发高质量,高可维护性,…"
tags: ["JavaScript","设计模式中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读12分钟"
weight: 1
selfDefined:"likes:424,comments:0,collects:705,views:17200,"
---
前言
--

设计模式是一个程序员进阶高级的必备技巧,也是评判一个工程师工作经验和能力的试金石.设计模式是程序员多年工作经验的凝练和总结,能更大限度的优化代码以及对已有代码的合理重构.作为一名合格的前端工程师,学习设计模式是对自己工作经验的另一种方式的总结和反思,也是开发高质量,高可维护性,可扩展性代码的重要手段.

我们所熟知的金典的几大框架,比如jquery, react, vue内部也大量应用了设计模式, 比如观察者模式, 代理模式, 单例模式等.所以作为一个架构师,设计模式是必须掌握的.

在中高级前端工程师的面试的过程中,面试官也会适当考察求职者对设计模式的了解,所以笔者结合多年的工作经验和学习探索, 总结并画出了针对javascript设计模式的思维导图和实际案例,接下来就来让我们一起来探索习吧.

你将收获
----

*   单例模式
*   构造器模式
*   建造者模式
*   代理模式
*   外观模式
*   观察者模式
*   策略模式
*   迭代器模式

正文
--

我们先来看看总览.设计模式到底可以给我们带来什么呢?

![](/images/jueJin/16ff7a982f0294d.png)

以上笔者主要总结了几点使用设计模式能给工程带来的好处, 如**代码可解耦**, **可扩展性**, **可靠性**, **条理性**, **可复用性**. 接下来来看看我们javascript的第一个设计模式.

### 1\. 单例模式

![](/images/jueJin/16ff7abf7257ccd.png)

#### 1.1 概念解读

单例模式: 保证一个类只有一个实例, 一般先判断实例是否存在,如果存在直接返回, 不存在则先创建再返回,这样就可以保证一个类只有一个实例对象.

#### 1.2 作用

*   模块间通信
*   保证某个类的对象的唯一性
*   防止变量污染

#### 1.3 注意事项

*   正确使用this
*   闭包容易造成内存泄漏,所以要及时清除不需要的变量
*   创建一个新对象的成本较高

#### 1.4 实际案例

单例模式广泛应用于不同程序语言中, 在实际软件应用中应用比较多的比如电脑的任务管理器,回收站, 网站的计数器, 多线程的线程池的设计等.

#### 1.5 代码实现

```
    (function(){
    // 养鱼游戏
    let fish = null
        function catchFish() {
        // 如果鱼存在,则直接返回
            if(fish) {
                return {
                fish,
                    water: function() {
                    let water = this.fish.getAttribute('weight')
                    this.fish.setAttribute('weight', ++water)
                }
                    }else {
                    // 如果鱼不存在,则获取鱼再返回
                    fish = document.querySelector('#cat')
                        return {
                        fish,
                            water: function() {
                            let water = this.fish.getAttribute('weight')
                            this.fish.setAttribute('weight', ++water)
                        }
                    }
                }
            }
            
            // 每隔3小时喂一次水
                setInterval(() => {
                catchFish().water()
                }, 3*60*60*1000)
                })()
```

### 2\. 构造器模式

![](/images/jueJin/16ff7b35d0f90c5.png)

#### 概念解读

构造器模式: 用于创建特定类型的对象,以便实现业务逻辑和功能的可复用.

#### 作用

*   创建特定类型的对象
*   逻辑和业务的封装

#### 注意事项

*   注意划分好业务逻辑的边界
*   配合单例实现初始化等工作
*   构造函数命名规范,第一个字母大写
*   new对象的成本,把公用方法放到原型链上

#### 实际案例

构造器模式我觉得是代码的格局,也是用来考验程序员对业务代码的理解程度.它往往用于实现javascript的工具库,比如lodash等以及javascript框架.

#### 代码展示

```
    function Tools(){
        if(!(this instanceof Tools)){
        return new Tools()
    }
    this.name = 'js工具库'
    // 获取dom的方法
        this.getEl = function(elem) {
        return document.querySelector(elem)
    }
    // 判断是否是数组
        this.isArray = function(arr) {
        return Array.isArray(arr)
    }
    // 其他通用方法...
}
```

### 3\. 建造者模式

![](/images/jueJin/16ff7b42538191e.png)

#### 概念解读

建造者模式: 将一个复杂的逻辑或者功能通过有条理的分工来一步步实现.

#### 作用

*   分布创建一个复杂的对象或者实现一个复杂的功能
*   解耦封装过程, 无需关注具体创建的细节

#### 注意事项

*   需要有可靠算法和逻辑的支持
*   按需暴露一定的接口

#### 实际案例

建造者模式其实在很多领域也有应用,笔者之前也写过很多js插件,大部分都采用了建造者模式, 可以在笔者github地址[徐小夕的github](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%3Ftab%3Drepositories "https://github.com/MrXujiang?tab=repositories")学习参考. 其他案例如下:

*   jquery的ajax的封装
*   jquery插件封装
*   react/vue某一具体组件的设计

#### 代码展示

笔者就拿之前使用建造者模式实现的一个案例:[Canvas入门实战之用javascript面向对象实现一个图形验证码](https://juejin.cn/post/6844903901699784711 "https://juejin.cn/post/6844903901699784711"), 那让我们使用建造者模式实现一个非常常见的验证码插件吧!

```
// canvas绘制图形验证码
    (function(){
        function Gcode(el, option) {
        this.el = typeof el === 'string' ? document.querySelector(el) : el;
        this.option = option;
        this.init();
    }
        Gcode.prototype = {
        constructor: Gcode,
            init: function() {
                if(this.el.getContext) {
                isSupportCanvas = true;
                var ctx = this.el.getContext('2d'),
                // 设置画布宽高
                cw = this.el.width = this.option.width || 200,
                ch = this.el.height = this.option.height || 40,
                textLen = this.option.textLen || 4,
                lineNum = this.option.lineNum || 4;
                var text = this.randomText(textLen);
                
                this.onClick(ctx, textLen, lineNum, cw, ch);
                this.drawLine(ctx, lineNum, cw, ch);
                this.drawText(ctx, text, ch);
            }
            },
                onClick: function(ctx, textLen, lineNum, cw, ch) {
                var _ = this;
                    this.el.addEventListener('click', function(){
                    text = _.randomText(textLen);
                    _.drawLine(ctx, lineNum, cw, ch);
                    _.drawText(ctx, text, ch);
                    }, false)
                    },
                    // 画干扰线
                        drawLine: function(ctx, lineNum, maxW, maxH) {
                        ctx.clearRect(0, 0, maxW, maxH);
                            for(var i=0; i < lineNum; i++) {
                            var dx1 = Math.random()* maxW,
                            dy1 = Math.random()* maxH,
                            dx2 = Math.random()* maxW,
                            dy2 = Math.random()* maxH;
                            ctx.strokeStyle = 'rgb(' + 255*Math.random() + ',' + 255*Math.random() + ',' + 255*Math.random() + ')';
                            ctx.beginPath();
                            ctx.moveTo(dx1, dy1);
                            ctx.lineTo(dx2, dy2);
                            ctx.stroke();
                        }
                        },
                        // 画文字
                            drawText: function(ctx, text, maxH) {
                            var len = text.length;
                                for(var i=0; i < len; i++) {
                                var dx = 30 * Math.random() + 30* i,
                                dy = Math.random()* 5 + maxH/2;
                                ctx.fillStyle = 'rgb(' + 255*Math.random() + ',' + 255*Math.random() + ',' + 255*Math.random() + ')';
                                ctx.font = '30px Helvetica';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(text[i], dx, dy);
                            }
                            },
                            // 生成指定个数的随机文字
                                randomText: function(len) {
                                var source = ['a', 'b', 'c', 'd', 'e',
                                'f', 'g', 'h', 'i', 'j',
                                'k', 'l', 'm', 'o', 'p',
                                'q', 'r', 's', 't', 'u',
                                'v', 'w', 'x', 'y', 'z'];
                                var result = [];
                                var sourceLen = source.length;
                                    for(var i=0; i< len; i++) {
                                    var text = this.generateUniqueText(source, result, sourceLen);
                                    result.push(text)
                                }
                                return result.join('')
                                },
                                // 生成唯一文字
                                    generateUniqueText: function(source, hasList, limit) {
                                    var text = source[Math.floor(Math.random()*limit)];
                                        if(hasList.indexOf(text) > -1) {
                                        return this.generateUniqueText(source, hasList, limit)
                                            }else {
                                            return text
                                        }
                                    }
                                }
                                    new Gcode('#canvas_code', {
                                    lineNum: 6
                                    })
                                    })();
                                    // 调用
                                        new Gcode('#canvas_code', {
                                        lineNum: 6
                                        })
```

### 4\. 代理模式

![](/images/jueJin/16ff7b4e4f70df0.png)

#### 概念解读

代理模式: 一个对象通过某种代理方式来控制对另一个对象的访问.

#### 作用

*   远程代理(一个对象对另一个对象的局部代理)
*   虚拟代理(对于需要创建开销很大的对象如渲染网页大图时可以先用缩略图代替真图)
*   安全代理(保护真实对象的访问权限)
*   缓存代理(一些开销比较大的运算提供暂时的存储，下次运算时，如果传递进来的参数跟之前相同，则可以直接返回前面存储的运算结果)

#### 注意事项

使用代理会增加代码的复杂度,所以应该有选择的使用代理.

#### 实际案例

我们可以使用代理模式实现如下功能:

*   通过缓存代理来优化计算性能
*   图片占位符/骨架屏/预加载等
*   合并请求/资源

#### 代码展示

接下来我们通过实现一个计算缓存器来说说代理模式的应用.

```
// 缓存代理
    function sum(a, b){
    return a + b
}
    let proxySum = (function(){
let cache = {}
    return function(){
    let args = Array.prototype.join.call(arguments, ',');
        if(args in cache){
        return cache[args];
    }
    
    cache[args] = sum.apply(this, arguments)
return cache[args]
}
})()
```

### 5\. 外观模式

![](/images/jueJin/16ff7b613d9e603.png)

#### 概念解读

外观模式(facade): 为子系统中的一组接口提供一个一致的表现,使得子系统更容易使用而不需要关注内部复杂而繁琐的细节.比如下图就是一个很好形象的说明外观模式的设计思路:

![](/images/jueJin/16ffb7329240c17.png)

#### 作用

*   对接口和调用者进行了一定的解耦
*   创造经典的三层结构MVC
*   在开发阶段减少不同子系统之间的依赖和耦合,方便各个子系统的迭代和扩展
*   为大型复杂系统提供一个清晰的接口

#### 注意事项

当外观模式被开发者连续调用时会造成一定的性能损耗,这是由于每次调用都会进行可用性检测

#### 实际案例

我们可以使用外观模式来设计兼容不同浏览器的事件绑定的方法以及其他需要统一实现接口的方法或者抽象类.

#### 代码展示

接下来我们通过实现一个兼容不同浏览器的事件监听函数来让大家理解外观模式如何使用.

```
    function on(type, fn){
    // 对于支持dom2级事件处理程序
        if(document.addEventListener){
        dom.addEventListener(type,fn,false);
            }else if(dom.attachEvent){
            // 对于IE9一下的ie浏览器
            dom.attachEvent('on'+type,fn);
                }else {
                dom['on'+ type] = fn;
            }
        }
```

### 6\. 观察者模式

![](/images/jueJin/16ff9da05c744d7.png)

#### 概念解读

观察者模式: 定义了一种一对多的关系, 所有观察对象同时监听某一主题对象,当主题对象状态发生变化时就会通知所有观察者对象,使得他们能够自动更新自己.

#### 作用

*   目标对象与观察者存在一种动态关联,增加了灵活性
*   支持简单的广播通信, 自动通知所有已经订阅过的对象
*   目标对象和观察者之间的抽象耦合关系能够单独扩展和重用

#### 注意事项

观察者模式一般都要注意要先监听, 再触发(特殊情况也可以先发布,后订阅,比如QQ的离线模式)

#### 实际案例

观察者模式是非常经典的设计模式,主要应用如下:

*   系统消息通知
*   网站日志记录
*   内容订阅功能
*   javascript事件机制
*   react/vue等的观察者

#### 代码展示

接下来我们我们使用原生javascript实现一个观察者模式:

```
    class Subject {
        constructor() {
    this.subs = {}
}

    addSub(key, fn) {
const subArr = this.subs[key]
    if (!subArr) {
this.subs[key] = []
}
this.subs[key].push(fn)
}

    trigger(key, message) {
const subArr = this.subs[key]
    if (!subArr || subArr.length === 0) {
    return false
}
    for(let i = 0, len = subArr.length; i < len; i++) {
const fn = subArr[i]
fn(message)
}
}

    unSub(key, fn) {
const subArr = this.subs[key]
    if (!subArr) {
    return false
}
    if (!fn) {
this.subs[key] = []
    } else {
        for (let i = 0, len = subArr.length; i < len; i++) {
    const _fn = subArr[i]
        if (_fn === fn) {
        subArr.splice(i, 1)
    }
}
}
}
}

// 测试
// 订阅
let subA = new Subject()
    let A = (message) => {
    console.log('订阅者收到信息: ' + message)
}
subA.addSub('A', A)

// 发布
subA.trigger('A', '我是徐小夕')   // A收到信息: --> 我是徐小夕
```

### 7\. 策略模式

![](/images/jueJin/16ff9da82a13e0d.png)

#### 概念解读

策略模式: 策略模式将不同算法进行合理的分类和单独封装，让不同算法之间可以互相替换而不会影响到算法的使用者.

#### 作用

*   实现不同, 作用一致
*   调用方式相同,降低了使用成本以及不同算法之间的耦合
*   单独定义算法模型, 方便单元测试
*   避免大量冗余的代码判断,比如if else等

#### 实际案例

*   实现更优雅的表单验证
*   游戏里的角色计分器
*   棋牌类游戏的输赢算法

#### 代码展示

接下来我们实现一个根据不同类型实现求和算法的模式来带大家理解策略模式.

```
    const obj = {
    A: (num) => num * 4,
    B: (num) => num * 6,
    C: (num) => num * 8
}

    const getSum =function(type, num) {
    return obj[type](num)
}
```

### 8\. 迭代器模式

![](/images/jueJin/16ff9dac6a846a3.png)

#### 概念解读

迭代器模式: 提供一种方法顺序访问一个聚合对象中的各个元素,使用者并不需要关心该方法的内部表示.

#### 作用

*   为遍历不同集合提供统一接口
*   保护原集合但又提供外部访问内部元素的方式

#### 实际案例

迭代器模式模式最常见的案例就是数组的遍历方法如forEach, map, reduce.

#### 代码展示

接下来笔者使用自己封装的一个遍历函数来让大家更加理解迭代器模式的使用,该方法不仅可以遍历数组和字符串,还能遍历对象.lodash里的\_.forEach(collection, \[iteratee=\_.identity\])方法也是采用策略模式的典型应用.

```
    function _each(el, fn = (v, k, el) => {}) {
    // 判断数据类型
        function checkType(target){
        return Object.prototype.toString.call(target).slice(8,-1)
    }
    
    // 数组或者字符串
        if(['Array', 'String'].indexOf(checkType(el)) > -1) {
            for(let i=0, len = el.length; i< len; i++) {
            fn(el[i], i, el)
        }
            }else if(checkType(el) === 'Object') {
                for(let key in el) {
                fn(el[key], key, el)
            }
        }
    }
```

最后
--

如果想了解本文完整的思维导图, 更多**H5游戏**, **webpack**，**node**，**gulp**，**css3**，**javascript**，**nodeJS**，**canvas数据可视化**等前端知识和实战，欢迎在公号《趣谈前端》加入我们一起学习讨论，共同探索前端的边界。

![](/images/jueJin/16ba43b87c51361.png)

更多推荐
----

*   [2年vue项目实战经验汇总](https://juejin.cn/post/6844904056893243400 "https://juejin.cn/post/6844904056893243400")
*   [《精通react/vue组件设计》之快速实现一个可定制的进度条组件](https://juejin.cn/post/6844904055702028296 "https://juejin.cn/post/6844904055702028296")
*   [《精通react/vue组件设计》之用纯css打造类materialUI的按钮点击动画并封装成react组件](https://juejin.cn/post/6844904054917693453 "https://juejin.cn/post/6844904054917693453")
*   [2019年,盘点一些我出过的前端面试题以及对求职者的建议](https://juejin.cn/post/6844904052388708366 "https://juejin.cn/post/6844904052388708366")
*   [基于jsoneditor二次封装一个可实时预览的json编辑器组件(react版)](https://juejin.cn/post/6844904053781037064 "https://juejin.cn/post/6844904053781037064")
*   [《前端实战总结》之使用纯css实现网站换肤和焦点图切换动画](https://juejin.cn/post/6844904024542543880 "https://juejin.cn/post/6844904024542543880")
*   [《前端实战总结》之使用CSS3实现酷炫的3D旋转透视](https://juejin.cn/post/6844904001633255431 "https://juejin.cn/post/6844904001633255431")
*   [《前端实战总结》之使用pace.js为你的网站添加加载进度条](https://juejin.cn/post/6844903998261035021 "https://juejin.cn/post/6844903998261035021")
*   [《前端实战总结》之设计模式的应用——备忘录模式](https://juejin.cn/post/6844903993232064526 "https://juejin.cn/post/6844903993232064526")
*   [《前端实战总结》之使用postMessage实现可插拔的跨域聊天机器人](https://juejin.cn/post/6844903989843066887 "https://juejin.cn/post/6844903989843066887")
*   [《前端实战总结》之变量提升，函数声明提升及变量作用域详解](https://juejin.cn/post/6844903985695080455 "https://juejin.cn/post/6844903985695080455")
*   [《前端实战总结》如何在不刷新页面的情况下改变URL](https://juejin.cn/post/6844903984222699527 "https://juejin.cn/post/6844903984222699527")
*   [一张图教你快速玩转vue-cli3](https://juejin.cn/post/6844903877133729799 "https://juejin.cn/post/6844903877133729799")
*   [vue高级进阶系列——用typescript玩转vue和vuex](https://juejin.cn/post/6844903831956897806 "https://juejin.cn/post/6844903831956897806")
*   [基于nodeJS从0到1实现一个CMS全栈项目（上）](https://juejin.cn/post/6844903952761225230 "https://juejin.cn/post/6844903952761225230")
*   [基于nodeJS从0到1实现一个CMS全栈项目（中）](https://juejin.im/editor/posts/5d8c7b66518825761b4c1e04 "https://juejin.im/editor/posts/5d8c7b66518825761b4c1e04")
*   [基于nodeJS从0到1实现一个CMS全栈项目（下）](https://juejin.cn/post/6844903955797901319 "https://juejin.cn/post/6844903955797901319")
*   [5分钟教你用nodeJS手写一个mock数据服务器](https://juejin.cn/post/6844903937330380814 "https://juejin.cn/post/6844903937330380814")
*   [用css3实现惊艳面试官的背景即背景动画（高级附源码）](https://juejin.cn/post/6844903950123188237 "https://juejin.cn/post/6844903950123188237")
*   [教你用200行代码写一个爱豆拼拼乐H5小游戏（附源码）](https://juejin.cn/post/6844903893961293831 "https://juejin.cn/post/6844903893961293831")
*   [笛卡尔乘积的javascript版实现和应用](https://juejin.cn/post/6844903928577048583 "https://juejin.cn/post/6844903928577048583")