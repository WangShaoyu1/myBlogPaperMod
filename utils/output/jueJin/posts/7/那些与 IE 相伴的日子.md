---
author: "政采云技术"
title: "那些与 IE 相伴的日子"
date: 2021-03-10
description: "Internet Explorer（简称：IE）是微软公司 为了对抗 网景浏览器（NetscapeNavigator）从而投入开发，并于 1995 年推出的一款网页浏览器，曾经一度成为同 Windows 系统捆绑安装的流氓软件横行于世，也占据了极高的市场份额，但在近些年里，它却…"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读11分钟"
weight: 1
selfDefined:"likes:99,comments:15,collects:82,views:3256,"
---
![](/images/jueJin/9b85f9344869442.png)

> 这是第 91 篇不掺水的原创，想获取更多原创好文，请搜索公众号关注我们吧~ 本文首发于政采云前端博客：[那些与 IE 相伴的日子](https://link.juejin.cn?target=https%3A%2F%2Fzoo.team%2Farticle%2Fdays-with-ie "https://zoo.team/article/days-with-ie")

![](/images/jueJin/de434e85aa4a402.png)

前言
--

Internet Explorer（简称：IE）是[微软公司](https://link.juejin.cn?target=https%3A%2F%2Fbaike.baidu.com%2Fitem%2F%25E5%25BE%25AE%25E8%25BD%25AF%25E5%2585%25AC%25E5%258F%25B8%2F732128 "https://baike.baidu.com/item/%E5%BE%AE%E8%BD%AF%E5%85%AC%E5%8F%B8/732128") 为了对抗 [网景浏览器](https://link.juejin.cn?target=https%3A%2F%2Fbaike.baidu.com%2Fitem%2F%25E7%25BD%2591%25E6%2599%25AF%25E6%25B5%258F%25E8%25A7%2588%25E5%2599%25A8 "https://baike.baidu.com/item/%E7%BD%91%E6%99%AF%E6%B5%8F%E8%A7%88%E5%99%A8")（NetscapeNavigator）从而投入开发，并于 1995 年推出的一款网页浏览器，曾经一度成为同 Windows 系统捆绑安装的流氓软件横行于世，也占据了极高的市场份额，但在近些年里，它却一直因为本身的落后而被众多用户和开发者诟病。

如今，即便是连微软公司自己都放弃了更新 IE，但一众 Web 开发者们为了部分仍在坚持使用 IE 浏览器的用户，却依然不得不向下兼容，笔者也是其中的一员，本篇文章记录了我在工作期间为了兼容 IE （ IE9及以上 ）做过的一些调整。

模拟 IE 版本环境
----------

许多开发者们的电脑本身是 Mac 系统，是无法安装 IE 浏览器的，这个时候就需要安装虚拟机提供 Windows 环境测试 IE 浏览器下的效果了。然而安装的虚拟机比较占用空间，这个时候，借用另一台 Windows 系统的电脑，访问 [Webpack](https://link.juejin.cn?target=https%3A%2F%2Fwebpack.docschina.org%2F "https://webpack.docschina.org/") （或其他编译打包器）配置的局域网下的页面地址，以此调试，也不失为一个好选择。

许多国产浏览器也提供了极速、兼容的双内核模式，极速模式下使用 Chrome 等非 IE 内核、兼容模式下使用 IE 内核，以应对不同页面的使用，打开控制台，可以切换模拟不同的 IE 版本（尽管只是模拟，有些时候并不准确）。

![](/images/jueJin/fda2b5b6f0c343f.png)

兼容 IE 下的样式
----------

其实很多浏览器不兼容的问题我们都可以从这个网站 [caniuse](https://link.juejin.cn?target=https%3A%2F%2Fwww.caniuse.com%2F "https://www.caniuse.com/") 上查询到，不止 IE，还包括 Safari、Firefox 以及他们在安卓系统中对应的浏览器兼容能力也被很好的总结在这里了。然而，我们是很难一次性查完所有的差异点再投入开发的，这里分享几个我在开发中遇到的问题，以及对应的解决方法吧。

### 1)图片定宽不定高会变形

在我平常做首屏 Banner 大图的时候，有时候为了快，直接写一个宽度 `width: 1200px` 就觉得万事大吉了，在 Chorme 上确实也表现良好，不负所望，但是当测试到 IE9、IE10 时，都会存在一个问题是图片变形，如下图所示。

![](/images/jueJin/3b27ac718255442.png)

![](/images/jueJin/c4d17b9e048e4b9.png)

当我打开 IE 浏览器的 DOM 资源管理器的时候发现，IE 浏览器对我`<img />` 标签多添加了一段这样的属性： `width="824" height="300"`，而这个宽度和高度是从哪里来的呢？我选中下载下来的图片，右击查看详情，发现这个图片文件本身的宽度和高度就是 824px 和 300px，于是答案便可以知晓了。

当我设置图片标签的 `src` 的时候， IE 浏览器自动将原图片的宽、高设置成了 `<img />` 的属性，这样导致我使用 CSS 只设置宽度为 `1200px` 而没有设置高的时候，`<img />` 的生效高度便是原图的高度 `300px`。而 Chrome 对`<img />` 标签什么都没有添加，所以标签的高度 height 也就是按照图片等比例缩放后的高度，不会变形。

*   Chrome 下的表现
    
    ![](/images/jueJin/b25b8352f6c4431.png)
    
*   IE 下的表现
    
    ![](/images/jueJin/e3a504d81b91417.png)
    

解决方法也很简单，就是在 `<img />` 标签的的 class 样式里，再添加一个简单的 `height: auto;` ，同时对宽高进行设置，覆盖掉原标签自动添加的宽度和高度，这样就可以解决变形的问题了。

### 2)IE 下 8 位色值不生效

在之前的开发中，我都习惯了使用 6 位色值，也不曾出现过问题，直到有一次，运营同学反馈在组件配置平台下选中了某个颜色，却一直不生效，通过排查问题，才发现了原来输出的色值是 8 位，而正是这多余的两位，在 IE 浏览器下并不通用。

![](/images/jueJin/effdf307920e454.png)

我们知道，CSS 颜色使用组合了红、绿、蓝颜色值 (RGB) 的十六进制 (hex) 表示法进行定义，十六进制值使用三个双位数来编写，并以 # 符号开头（如：#FF0000），同时， Chrome 浏览器支持 8 位色值（如 #FF0000ee），最后两位表示**不透明度** Alpha 值，其中 00 表示不透明度为 0，也就是全透明状态，FF 表示不透明度 100%，也就是全不透明状态，但在 IE 浏览器下不支持。

IE 情况下，使用 8 位色值，不但最后两位的不透明度无法生效，反而整个颜色设置都不能生效，下面是一个简单的 Demo 来模拟这种情况，标题的颜色设置不生效，所以呈现出默认的黑色状态。

![](/images/jueJin/71b74baf58374ce.png)

![](/images/jueJin/56e89a6fed1842b.png)

![](/images/jueJin/60d5c5ed6b98436.png)

解决方法也比较简单，在这种场景下，不透明度不是必须的，可以删除掉最后两位，仅使用 6 位色值即可。如果实在需要不透明度，我们可以使用 rgba 的格式，用最后一位值来实现透明度，如`background-color: rgba(255,0,0,0.3)`，即使在 IE9 上也可以表现良好。

![](/images/jueJin/c47b89b601434ee.png)

### 3)处理左右镜像

IE9 支持了 CSS3 的许多属性，但还是有许多力所不能及的地方。比如，有一次的开发场景是希望在标题的两边做出对称的两种图样，于是我对这张图拷贝出来的第二份设置了 `transform:rotateY(180deg);` 让图片绕 Y 轴旋转，IE9 虽然已经支持了 trasform 2D 旋转，但是并不支持 trasform 3D 旋转，所以会出现如下所示的问题。

![](/images/jueJin/6e3e33bf5bc04c7.png)

这里我们可以使用 IE9 支持的`canvas`画布将坐标轴翻转 ，绘制图像，就能得到一个左右对称的图片了。Html 中需要对原始 `<img />` 标签进行宽度和高度的显式设置，才能保证 `<canvas>` 中有准确的宽高。代码如下。

```js
    getRotateImg = (imgSourceId = '') => {
    const imgNode = document.getElementById(imgSourceId);
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'canvas');
    // 设置 canvas 的宽高，防止变形
    canvas.setAttribute('width', imgNode.style.width);
    canvas.setAttribute('height', imgNode.style.height);
    
    const width = parseInt(imgNode.style.width);
    const height = parseInt(imgNode.style.height);
    
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.src = imgNode.src;
    
    imgNode.parentNode.appendChild(canvas);
        img.onload = function() {
        console.log(imgNode.style.width);
        // 将坐标原点移动到画布最右端，使反向图片向左绘制，呈现在画布范围内
        ctx.translate(width, 0);
        //左右镜像翻转坐标系
        ctx.scale(-1, 1);
        ctx.drawImage(img, 0, 0, width, height);
    }
}
```

实际效果如图所示。

![](/images/jueJin/71aae043cd4746d.png)

### 4)放弃 Flex 布局

在初识 Flex布局 （弹性布局）的时候，会喜欢上它的灵活简单，但是 IE9 下并不支持 Flex 布局，我们可以用其他方式来代替。

比如我们可以这样通过`display: table`、`display: table-cell`实现一个简单的等分效果，在这种情况下，传统的 margin 无法提供外边距，我们可以使用 `border-space` 代替。

![](/images/jueJin/109bd1acc480472.png)

```html
<div class="wrapper-2">
<div class="flex-2">4 等分</div>
<div class="flex-2">4 等分</div>
<div class="flex-2">4 等分</div>
<div class="flex-2">4 等分</div>
</div>
```

CSS 代码

```css
    .wrapper-2 {
    height: 100px;
    width: 80%;
    margin: 20px auto;
    background-color: wheat;
    
    display: table;  /* 主要代码 */
    border-spacing: 30px;  /* 主要代码 */
}
    .flex-2 {
    background-color: pink;
    padding: 10px;
    text-align: center;
    border: solid 2px purple;
    
    display: table-cell; /* 主要代码 */
}
```

或者使用`text-align: center`,`vertical-align: middle` 配合 `display: inline-block` 达到类似的效果，如下：

![](/images/jueJin/3c9d89e283644e5.png)

```css
    .wrapper-3 {
    height: 200px;
    width: 80%;
    margin: 20px auto;
    background-color: wheat;
    line-height: 200px;
    
    text-align: center; /* 主要代码 */
}
    .flex-3 {
    width: 80px;
    line-height: 100px;
    background-color: pink;
    margin: auto 20px;
    height: 100px;
    border: solid 2px purple;
    text-align: center;
    
    display: inline-block;   /* 主要代码 */
    vertical-align: middle;  /* 主要代码 */
    
}
```

关于 CSS Hack
-----------

CSS Hack 的原理是根据不同浏览器和浏览器不同的版本对 CSS 的解析不同，分别书写不同的代码加以应对。常见的写法有 3 种：条件注释法、CSS 属性前缀法、选择器前缀法，一般写 Hack 的顺序是：从最新版本到低版本，比如：新版本、IE（10/9/8）、IE（7/6），具体写法可以参考这篇文章[《CSS Hack 合集》](https://link.juejin.cn?target=https%3A%2F%2Fwww.w3cschool.cn%2Flugfe%2Flugfe-vxfp25zq.html "https://www.w3cschool.cn/lugfe/lugfe-vxfp25zq.html")。

但是过多地依赖 CSS hack 会导致代码非常的不整洁，也可能会对后续的兼容留下隐患，所以实际很少使用。

例如这些：

```html
只在IE下生效
<!--[if IE]>
这段文字只在IE浏览器显示
<![endif]-->

只在IE6下生效
<!--[if IE 6]>
这段文字只在IE6浏览器显示
<![endif]-->
```

IE9 不支持 History 路由
------------------

在单页面应用中，存在着前端路由的概念，哈希路由兼容性好，但是 URL 总是存在着`/#` 会让人觉得有些不好看，于是我们想到了清爽简洁的 History 路由。

然而，在 IE 9 条件下，由于缺少 window.history 对象，自然也不能调用 `history.pushState`，`history.replaceState` 方法，所以 Chrome 下能够正常使用的 History 路由模式不能生效。这个时候我们有几种解决方案了，一是选择哈希路由，二是直接做成多页面应用，跳转时刷新整个页面，也可以选择使用 [history.js](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fbrowserstate%2Fhistory.js%2F "https://github.com/browserstate/history.js/") ，里面已经实现了常见的 History 路由的 Api。

![](/images/jueJin/b6ee49c00c0247e.png)

在 IE 上使用 ES6
------------

### @babel/polyfill

IE 不支持许多 ES6 的语法，比如 Array.from()，Object.assign() 等常见函数，所以我们可以使用工具链 [Babel](https://link.juejin.cn?target=https%3A%2F%2Fwww.babeljs.cn%2Fdocs%2F "https://www.babeljs.cn/docs/") 中的 [@babel/polyfill](https://link.juejin.cn?target=https%3A%2F%2Fwww.babeljs.cn%2Fdocs%2Fbabel-polyfill "https://www.babeljs.cn/docs/babel-polyfill") 将代码转换成可以向后兼容、在低版本上也能够使用的的语法，比如这样：

```js
// 我们书写的原始代码
[1, 2, 3].map((n) => n + 1);

// 经过转换后的代码
    [1, 2, 3].map(function(n) {
    return n + 1;
    });
``````scss
npm install --save-dev @babel/core @babel/cli @babel/preset-env
npm install --save @babel/polyfill
```

*   在 node 环境中使用
    
    `require("babel-polyfill");`
    
*   在 es6 中使用
    
    `import "babel-polyfill";`
    
*   在 webpack 中使用
    
    ```ini
        module.exports = {
    entry: ["babel-polyfill", "./app/js"]
    };
    ```

以在 webpack 中配置为例，webpack.config.js 代码如下：

```js
var path = require("path");

    module.exports = {
        entry: {
        entry: ["@babel/polyfill", "./index.js"], // 在入口文件 index.js 前面加入 "@babel/polyfill" 这个配置
        },
            output: {
            path: path.resolve(__dirname, "dist"),
            filename: "bundle.js",
            },
                module: {
                    rules: [
                        {
                        test: /\.css$/,
                        use: ["style-loader", "css-loader"],
                        },
                            {
                            test: /\.(js|jsx)$/,
                            exclude: /node_modules/,
                                use: {
                                loader: "babel-loader", // 需要安装 babel-loader 此配置可将所有 js,jsx 后缀的文件进行转换
                                    options: {
                                    babelrc: false,
                                        presets: [
                                        [require.resolve("@babel/preset-env"), { modules: false }], // webpack 已做了模块化打包，所以此处 modules 里
                                        ],
                                        cacheDirectory: true,
                                        },
                                        },
                                        },
                                        ],
                                        },
                                        plugins: [],
                                        };
                                        
```

总结
--

以上是我在兼容 IE（IE9 及以上） 过程中踩过的坑和进行的调整了。技术是死的，应用却是活的，我们应当掌握常见的兼容能力，但有时候，绞尽脑汁地向下兼容反而不如换一个更灵活、成本更低的方式表达。我们期待着多年以后，用户们能够放弃 IE ，拥抱更敏捷好用的浏览器，迎接一个新的时代。

参考文档
----

[JS 实现兼容IE图片向左或向右翻转](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fweixin_30920091%2Farticle%2Fdetails%2F98890519 "https://blog.csdn.net/weixin_30920091/article/details/98890519")

[CSS Hack 合集](https://link.juejin.cn?target=https%3A%2F%2Fwww.w3cschool.cn%2Flugfe%2Flugfe-vxfp25zq.html "https://www.w3cschool.cn/lugfe/lugfe-vxfp25zq.html")

推荐阅读
----

[前端异常的捕获与处理](https://juejin.cn/post/69326205518274887756 "https://juejin.cn/post/69326205518274887756")

[编写高质量可维护的代码：组件的抽象与粒度](https://juejin.cn/post/6901210381574733832 "https://juejin.cn/post/6901210381574733832")

招贤纳士
----

政采云前端团队（ZooTeam），一个年轻富有激情和创造力的前端团队，隶属于政采云产品研发部，Base 在风景如画的杭州。团队现有 40 余个前端小伙伴，平均年龄 27 岁，近 3 成是全栈工程师，妥妥的青年风暴团。成员构成既有来自于阿里、网易的“老”兵，也有浙大、中科大、杭电等校的应届新人。团队在日常的业务对接之外，还在物料体系、工程平台、搭建平台、性能体验、云端应用、数据分析及可视化等方向进行技术探索和实战，推动并落地了一系列的内部技术产品，持续探索前端技术体系的新边界。

如果你想改变一直被事折腾，希望开始能折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变既定的节奏，将会是“5 年工作时间 3 年工作经验”；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊… 如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的前端团队的成长历程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 `ZooTeam@cai-inc.com`

![](/images/jueJin/a963eb08f87b463.png)