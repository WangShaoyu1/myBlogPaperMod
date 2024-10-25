---
author: "徐小夕"
title: "基于Vue实现一个有点意思的拼拼乐小游戏"
date: 2020-08-30
description: "笔者去年曾写过一个类似的拼拼乐小游戏，技术栈采用自己的Xuery框架和原生javascript实现的，脚手架采用gulp来实现，为了满足对vue的需求，笔者再次使用vue生态将其重构，脚手架采用比较火的vue-cli。 为了加深大家对vue的了解和vue项目实战，笔者采用vue…"
tags: ["Vue.js","Canvas中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:34,comments:12,collects:54,views:3197,"
---
笔者去年曾写过一个类似的拼拼乐小游戏，技术栈采用自己的**Xuery**框架和原生**javascript**实现的，脚手架采用**gulp**来实现，为了满足对**vue**的需求，笔者再次使用**vue**生态将其重构，脚手架采用比较火的**vue-cli**。

前言
--

为了加深大家对**vue**的了解和**vue项目实战**，笔者采用**vue**生态来重构此项目，方便大家学习和探索。技术栈如下：

*   **vue-cli4** 基于vue的脚手架
*   **Xuery** 笔者基于原生js二次封装的dom库
*   **vue** mvvm库

因为该应用属于**H5**游戏，为了清亮化笔者没有采用第三方ui库， 如果大家想采用基于**vue**的第三方移动端ui库，笔者推荐如下：

*   **Mint** 饿了么推出的移动端ui库
*   **NutUI** 一套京东风格的移动端组件库
*   **muse-ui** 基于MaterialUI风格的移动端UI组件
*   **cube-ui** 滴滴团队开发的移动端UI组件库
*   **vant** 有赞团队的电商风格的移动端组件库
*   **atom-design** atom风格的移动端ui组件库
*   **mand-mobile** 滴滴团队研发的基于金融场景的移动端ui组件库

以上笔者推荐的都是社区比较完善，bug比较少的组件库，大家可以感受一下。

回到我们的小游戏开发，我们更多的是**javascript**和**css3**的掌握程度，在学习完这篇文章之后相信大家对**javascript**和**css3**的编程能力都会有极大的提升，后面还会介绍如何使用**canvas**实现生成战绩海报图的功能。

正文
--

我们先来看看游戏的预览界面： ![](/images/jueJin/ab970648c2974ad.png) ![](/images/jueJin/4495de1fdb154bd.png) ![](/images/jueJin/28183fc36fda48c.png) ![](/images/jueJin/178d2a87a5e5400.png) 在线体验地址：[传送门](https://link.juejin.cn?target=http%3A%2F%2Fio.nainor.com%2FpiecePlay "http://io.nainor.com/piecePlay")

本文的算法实现方式在之前的拼拼乐文章中已经说明，这里主要介绍核心算法， 至于**vue-cli**的使用方法，笔者之前也写过对应的文章，大家可以研究学习一下。**vue-cli**搭建项目方式如下：

```js
// 安装
yarn global add @vue/cli

// 创建项目
vue create pinpinle

// 进入项目并启动
cd pinpinle && yarn start
```

关于vue-cli3配置实战，可以移步 [一张图教你快速玩转vue-cli3](https://juejin.cn/post/6844903877133729799 "https://juejin.cn/post/6844903877133729799")

H5游戏核心功能介绍
----------

目前笔者主要整理乐如下核心功能，接下来笔者会一一带大家实现：

*   实现纯javascript上传预览图片
*   实现拼图分割功能
*   实现洗牌算法
*   实现生成战绩海报功能

### 1\. 实现纯javascript上传预览图片

文件上传预览主要采用**FileReader API**实现，**原理就是将file对象传给FileReader的readAsDataURL然后转化为data:URL格式的字符串（base64编码）以表示所读取文件的内容。** 具体代码如下：

```js
// 2.文件上传解析
let file = $('#file');
    file.on('change', function(e){
    var file = this.files[0];
    var fileReader = new FileReader();
    // 读取完成触发的事件
        fileReader.onload = function(e) {
        $('.file-wrap')[0].style.backgroundImage = 'url(' + fileReader.result + ')';
        imgSrc = fileReader.result;
    }
    
    file && fileReader.readAsDataURL(file);
    })
```

### 2\. 实现拼图分割功能

一般我们处理这种拼图游戏都会有如下方案：

*   用canvas分割图片
*   采用n张不同的切好的切片图片（方法简单，但是会造成多次请求）
*   动态背景分割

经过权衡，笔者想出了第三种方法，也是自认为比较优雅的方法，即**动态背景分割**，我们只需要使用1张图片，然后利于css的方式切割图片，有点经典的雪碧图的感觉，如下： ![](/images/jueJin/4af878b2a5f8494.png) 本质就是我们设置九个div，每个div都使用同一张图片，并且图片大小等于游戏画布大小，但是我们通过**backgroundPosition**（背景定位）的方式来实现切割图片。这样做的另一个好处是方便我们实现**洗牌逻辑**。

### 3\. 实现洗牌算法

洗牌逻辑依托于随机算法，这里我们结合坐标系，实现一个随机生成二维坐标系的逻辑，然后通过改变每个切片的**translate**位置，配合过渡动画，即可实现洗牌功能和洗牌动画。

#### 3.1 数组乱序算法

数组乱序比较简单，代码如下：

```js
// 数组乱序
    function upsetArr(arr) {
        arr.sort(function(a,b){
        return Math.random() > 0.5 ? -1 : 1
        })
    }
```

#### 3.2 洗牌逻辑

洗牌逻辑基于数组乱序，具体逻辑如下：

```js
// 洗牌方法
    function shuffle(els, arr) {
    upsetArr(arr);
        for(var i=0, len=els.length; i< len; i++) {
        var el = els[i];
        el.setAttribute('index', i);  // 将打乱后的数组索引缓存到元素中
        el.style.transform = 'translate(' + arr[i].x + 'vw,' + arr[i].y + 'vh'+ ')';
    }
}
```

#### 3.3 生成n纬矩阵坐标

n维矩阵主要用来做洗牌和计算成功率的，具体实现如下：

```js
// 生成n维矩阵坐标
    function generateMatrix(n, dx, dy) {
    var arr = [], index = 0;
        for(var i = 0; i< n; i++) {
            for(var j=0; j< n; j++) {
            arr.push({x: j*dx, y: i*dy, index: index});
            index++;
        }
    }
    return arr
}
```

#### 3.4 置换算法

置换算法主要用来切换拼图的，比如用户想移动拼图，可以用过置换来实现：

```js
// 数组置换
    function swap(arr, indexA, indexB) {
    let cache = arr[indexA];
    arr[indexA] = arr[indexB];
    arr[indexB] = cache;
}
```

### 4\. 实现生成战绩海报功能

生成战绩海报笔者采用**canvas**来实现，对于**canvas**的api不熟悉的可以查看MDN，讲的比较详细。这里笔者简单实现一个供大家参考：

```js
    function generateImg() {
    var canvas = document.createElement("canvas");
    
        if(canvas.getContext) {
        var winW = window.innerWidth,
        winH = window.innerHeight,
        ctx = canvas.getContext('2d');
        canvas.width = winW;
        canvas.height = winH;
        
        // 绘制背景
        // ctx.fillStyle = '#06c';
        var linear = ctx.createLinearGradient(0, 0, 0, winH);
        linear.addColorStop(0, '#a1c4fd');
        linear.addColorStop(1, '#c2e9fb');
        ctx.fillStyle = linear;
        ctx.fillRect(0, 0, winW, winH);
        ctx.fill();
        
        // 绘制顶部图像
        var imgH = 0;
        img = new Image();
        img.src = imgSrc;
            img.onload = function(){
            // 绘制的图片宽为.7winW, 根据等比换算绘制的图片高度为 .7winW*imgH/imgW
            imgH = .6*winW*this.height/this.width;
            ctx.drawImage(img, .2*winW, .1*winH, .6*winW, imgH);
            
            drawText();
            drawTip();
            drawCode();
        }
        
        // 绘制文字
            function drawText() {
            ctx.save();
            ctx.fillStyle = '#fff';
            ctx.font = 20 + 'px Helvetica';
            ctx.textBaseline = 'hanging';
            ctx.textAlign = 'center';
            ctx.fillText('我只用了' + (180 -dealtime) + 's,' + '快来挑战！', winW/2, .15*winH + imgH);
            ctx.restore();
        }
        
        // 绘制提示文字
            function drawTip() {
            ctx.save();
            ctx.fillStyle = '#000';
            ctx.font = 14 + 'px Helvetica';
            ctx.textBaseline = 'hanging';
            ctx.textAlign = 'center';
            ctx.fillText('关注下方二维码开始游戏', winW/2, .25*winH + imgH);
            ctx.restore();
        }
        
        
        // 绘制二维码
            function drawCode() {
            var imgCode = new Image();
            imgCode.src = '/piecePlay/images/logo.png';
                imgCode.onload = function(){
                ctx.drawImage(imgCode, .35*winW, .3*winH + imgH, .3*winW, .3*winW);
                
                // 生成预览图
                var img = new Image();
                img.src= convertCanvasToImage(canvas, 1).src;
                img.className = 'previewImg';
                    img.onload = function(){
                    $('.preview-page')[0].appendChild(this);
                    startDx = startDx - 100;
                    transformX(wrap, startDx + 'vw');
                }
            }
        }
            } else {
            alert('浏览器不支持canvas！')
        }
    }
```

H5拼图小游戏笔者已在github开源， 感兴趣的可以学习参考。以上的逻辑部分的代码可以直接整合到vue项目中即可，由于实现比较简单， 这里笔者就不详细介绍了。

H5可视化编辑器Dooring功能迭代说明
---------------------

目前笔者实现的H5可视化编辑器**H5-Dooring**功能新增如下：

*   实时保存功能
*   添加进度条组件
*   添加websocket通信
*   实现在线下载代码功能

预览地址：[基于React+Koa实现一个h5页面可视化编辑器－Dooring](https://link.juejin.cn?target=http%3A%2F%2Fio.nainor.com%2Fh5_visible "http://io.nainor.com/h5_visible")

github地址：[基于React+Koa实现一个h5页面可视化编辑器－Dooring](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://github.com/MrXujiang/h5-Dooring")

最后
--

如果想学习更多H5游戏, webpack，node，gulp，css3，javascript，nodeJS，canvas数据可视化等前端知识和实战，欢迎在《趣谈前端》一起学习讨论，共同探索前端的边界。

更多推荐
----

*   [基于React+Koa实现一个h5页面可视化编辑器－Dooring](https://juejin.cn/post/6864410873709592584 "https://juejin.cn/post/6864410873709592584")
*   [深度剖析github star数15.1k的开源项目redux-thunk](https://juejin.cn/post/6861538848963461133 "https://juejin.cn/post/6861538848963461133")
*   [TS核心知识点总结及项目实战案例分析](https://juejin.cn/post/6857123751205535751 "https://juejin.cn/post/6857123751205535751")