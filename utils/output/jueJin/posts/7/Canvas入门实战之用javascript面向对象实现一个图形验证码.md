---
author: "徐小夕"
title: "Canvas入门实战之用javascript面向对象实现一个图形验证码"
date: 2019-07-29
description: "本文主要介绍用canvas实现图形验证码的一些思路以及如何用javascript面向对象的方式更友好的实现canvas的功能，关于canvas的一些基本使用方法和API我整理了一个思维导图，大家感兴趣的可以参考学习。 文末将附上组件封装的源码，欢迎大家随时沟通交流。关于项目的打…"
tags: ["JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:27,comments:0,collects:31,views:1864,"
---
本文主要介绍用canvas实现图形验证码的一些思路以及如何用javascript面向对象的方式更友好的实现canvas的功能，关于canvas的一些基本使用方法和API我整理了一个思维导图，大家感兴趣的可以参考学习。

![](/images/jueJin/16c3b5b17ab2bce.png)

### 你将收获

*   闭包的使用
*   canvas常用api的使用
*   javascript面向对象的实现方式
*   实现一个canvas的图形验证码的一般思路和常用算法

### 设计思路

1.  用canvas生成画布
2.  用canvas画干扰线或躁点
3.  生成随机不重复的n的字母
4.  用canvas绘制文字
5.  初始化和canvas点击事件
6.  组件化封装

文末将附上组件封装的源码，欢迎大家随时沟通交流。关于项目的打包，我将使用自己基于gulp4搭建的[9012教你如何使用gulp4开发项目脚手架](https://juejin.cn/post/6844903882124967949 "https://juejin.cn/post/6844903882124967949")。

### 效果预览

![](/images/jueJin/16c3b6639891c54.png)

### 实现思路

我将按照上文中的设计思路的步骤一步步实现，首先我们先定义一个es5类：

```
    function Gcode(el, option) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    this.option = option;
    this.init();
}
```

其中init是用来初始化用的，参数el代表需要挂载的元素或元素id，option为传入的可选项，稍后会在代码中体现，通常这也是面向对象的常用套路。

1.  绘制画布

```
    Gcode.prototype = {
    constructor: Gcode,
        init: function() {
            if(this.el.getContext) {
            isSupportCanvas = true;
            var ctx = this.el.getContext('2d'),
            // 设置画布宽高
            cw = this.el.width = this.option.width || 200,
            ch = this.el.height = this.option.height || 40;
        }
    }
}
```

这里我们在初始化方法中先定义一个canvas画布，宽高为用户自定义的宽高，默认为200\*40。

2.  绘制干扰线

```
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
}
```

这里我们对类Gcode定义原型方法drawLine，然后通过for循环绘制随机位置的线条，为了让canvas每次点击能清空之前的干扰线，我们使用clearRect来清除画布。

3.  生成随机不重复的n个字符

我们通过递归实现，如下==：

```
// 生成唯一文字
    generateUniqueText: function(source, hasList, limit) {
    var text = source[Math.floor(Math.random()*limit)];
        if(hasList.indexOf(text) > -1) {
        return this.generateUniqueText(source, hasList, limit)
            }else {
            return text
        }
    }
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
    }
```

我们通过定义一个字母表，传入生成的随机字母的个数，配合generateUniqueText来实现生成唯一不重复的n个随机字符。当然笔者认为这个方法并不优雅，你也可以使用uuid的方式或者更好的方式，欢迎随时和笔者交流。

4.  用canvas绘制文字

```
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
```

这里和上文画线实现类似。就不做过多介绍了。

5.  初始化和canvas点击事件

接下来我们看看完整的初始化代码：

```
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
}
```

点击事件主要是为了用户点击可以切换验证码：

```
    onClick: function(ctx, textLen, lineNum, cw, ch) {
    var _ = this;
        this.el.addEventListener('click', function(){
        text = _.randomText(textLen);
        _.drawLine(ctx, lineNum, cw, ch);
        _.drawText(ctx, text, ch);
        }, false)
    }
```

到此，一个完整的验证码组件实现完成，怎么用呢？如下：

```
    new Gcode('#canvas_code', {
    lineNum: 6,  // 可选
    textLen: 4,  // 可选
    width: 200,  // 可选
    height: 50   // 可选
    })
```

完整代码如下，欢迎学习交流：

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
```

如果想体验实际案例效果和技术交流，或者感受更多原创canvas,h5游戏demo，可以关注下方公众号体验哦

![](/images/jueJin/16ba43b87c51361.png)

### 更多推荐

*   [用 JavaScript 和 C3 实现一个转盘小游戏](https://juejin.cn/post/6844903895668375566 "https://juejin.cn/post/6844903895668375566")
*   [教你用200行代码写一个爱豆拼拼乐H5小游戏（附源码）](https://juejin.cn/post/6844903893961293831 "https://juejin.cn/post/6844903893961293831")
*   [基于react/vue生态的前端集成解决方案探索与总结](https://juejin.cn/post/6844903891893485576 "https://juejin.cn/post/6844903891893485576")
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