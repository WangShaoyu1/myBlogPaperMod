---
author: "政采云技术"
title: "设计和实现一个 Chrome 插件提升登录效率"
date: 2021-10-20
description: "本文已参与「掘力星计划」，赢取创作大礼包，挑战创作激励金。 前言 在我们的工作过程中，每当需要排查问题、跑冒烟用例、看测试环境的效果时，经常需要在浏览器环境中切换登录账号，另外，在开发的过程中，也需要"
tags: ["前端","JavaScript","浏览器中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:78,comments:5,collects:64,views:4523,"
---
本文已参与「[掘力星计划](https://juejin.cn/post/7012210233804079141/ "https://juejin.cn/post/7012210233804079141/")」，赢取创作大礼包，挑战创作激励金。 ![](/images/jueJin/d4eb6a01e656484.png)

![北渊.png](/images/jueJin/4b98cd7c3492439.png)

前言
--

在我们的工作过程中，每当需要排查问题、跑冒烟用例、看测试环境的效果时，经常需要在浏览器环境中切换登录账号，另外，在开发的过程中，也需要在编辑器 VS Code 里切换代理登录的账号。

以政采云的业务开发为例：访问测试、预发等不同环境要切账号，切换不同角色身份、不同地理区划、甚至查看有特殊数据时也要切账号……这让我们的工作中充斥了大量的输入账号密码的无效时间，也需要我们额外维护账号文档，非常苦恼。

关于在 VS Code 编辑器里快捷切换账号的工具，我们已经有同学设计开发过，在后续的文章中会向大家展示。

![image.png](/images/jueJin/4261ea051acc4b5.png)

本文将讲述一下如何在浏览器环境，扩展 Chrome 浏览器原有的“记住密码”功能，实现快捷登录、隔离账号信息以及备注标签等方便使用的功能，同事分享给测试、后端、产品等其他的伙伴，提高大家的效率，希望这次探索能给更多的人带来启发。

需求分析
----

*   支持账号录入和一键登录，节约输入时间
*   对账号进行个性化的 tag 标记，支持增删改查
*   隔离不同环境下的账号，解决混用的干扰
*   方便查看和数据维护
*   友好的 UI 界面

最终效果预览
------

主要演示一下插件的位置，其中，删除和置顶是常见功能，就不在这里演示了

### 一键登录

![](/images/jueJin/ad213f33bf25435.png)

### 账号录入

![录入账号 (1).gif](/images/jueJin/5fab2ac2fd044a1.png)

### Tag 标记和搜索

![打标签.gif](/images/jueJin/e33bfb022c7143d.png)

### 弹层里的传送门

传送门编写在 `popup/index.html` 目录下，用于提供快捷进入不同环境登录页的入口，用颜色清晰地区别开测试、预发等环境，以及记录辅助系统鲁班的地址。

![image (4).png](/images/jueJin/1e53bdc7e18d45b.png)

前期设计
----

### Chrome 扩展程序

既然是代替用户进行浏览器页面的登录，我们当然可以选择 [Chrome Extension （扩展程序）](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.chrome.com%2Fdocs%2Fextensions%2F "https://developer.chrome.com/docs/extensions/")来解决这一难题。

> 扩展是基于 Web 技术构建的，例如 HTML、JavaScript 和 CSS。它们在单独的沙盒执行环境中运行，并与 Chrome 浏览器交互。 扩展允许您通过使用 API 修改浏览器行为和访问 Web 内容来“扩展”浏览器。

Chrome 浏览器将会识别包含 `manifest.json` 文件的目录为扩展文件，所以我们可以开发一个 Chrome Extension 项目来解决这一问题。

### 前端技术栈

本次 Chrome 插件选用 React 框架开发，其他开发者也可以根据自己的偏好进行技术选型。

第一版本的插件能力暂时不接入后端，数据都存在本地。

*   优点
    
    *   天然实现隔离不同域名环境下的数据，避免了测试、预发等环境混用的缺陷。
    *   如果不手动删除数据，可支持前端长久保存，并随时可以在控制台中查看，分享给其他合作者。
*   缺点
    
    *   统一使用者针对不同浏览器访客角色无法实现账号打通的能力，这一缺陷将在下次接入后端时弥补。
    *   清除本地缓存时，会误删数据。

### 美观的 UI 选型

由于原政采云登录页面是用内部基于 AntD 开发的组件库，为了保持视觉风格的统一，我选择了继续使用我们内部的组件库，每个团队也可以根据自己情况选择自己的组件库，或者开源的组件库，如 ant design，element ui 等。

### 更便捷的交互设计

既然可以访问 Web 内容，那么最简便的操作就是不用触发任何其他的按钮打开弹层，直接 **识别登录页面**，在原有登录页面的空白处中 **插入我们的组件 DOM 元素**，就可以实现最便捷的操作。我们得到一个登录账号列表，不必透出密码，根据我们自己打的标签判断当前需要登录的账号，**一键登录**，代替手动操作。

![image (1).png](/images/jueJin/a40261eaca464b5.png)

项目搭建
----

我们建一个空项目，配置必要的 **.babelrc 、.gitignore、webpack.config.js** 文件，使得文件可以支持 [Babel](https://link.juejin.cn?target=https%3A%2F%2Fwww.babeljs.cn%2F "https://www.babeljs.cn/")、[Git](https://link.juejin.cn?target=https%3A%2F%2Fgit-scm.com%2F "https://git-scm.com/")、[Webpack](https://link.juejin.cn?target=https%3A%2F%2Fwebpack.docschina.org%2F "https://webpack.docschina.org/") 的正常使用，安装 [Less](https://link.juejin.cn?target=https%3A%2F%2Fless.bootcss.com%2F "https://less.bootcss.com/") 以及相关的 loader 方便我们的开发，目录结构大致如下：

### 目录结构

```json
.
├── README.md
├── package-lock.json
├── package.json
├── src
│   ├── assets # 存放扩展程序的标志图片
│   ├── contentScript # 对 Web 文件的操作
│   ├── manifest.json # Chrome Extension 的清单文件
│   └── popup # 用于存放弹出层
└── webpack.config.js
```

### 清单文件 manifest.json

这里是用来配置扩展程序的基础信息的文件

*   name：扩展名，显示在我的扩展文件中
*   manifest\_version：标记 manifest.json 文件的版本号。从 Chrome 18 版本起， manifest\_version 需不小于 2， 并且，由于 manifest\_version 为 3 的部分语法仅在 Chorme 88 以上支持，Edge、Firefox等其他浏览器都不支持，所以 manifest\_version 为 2 是更多扩展程序的选择。
*   icons：扩展程序显示在右上角的图标，需要配置不同规格的图片，适应不同的显示需要。

```javascript
    {
    "name": "Account Saver",
    "description" : "zcy 账号管理小精灵~",
    "version": "1.0",
    "manifest_version": 2,
        "icons": {
        "16": "./assets/icon.png",
        "48": "./assets/icon.png",
        "96": "./assets/icon.png",
        "128": "./assets/icon.png"
        },
            "browser_action": {
            "default_icon": "./assets/icon.png", // 插件加载在浏览器右上角时的图标
            "default_title": "账号管理小精灵~", // hover 图标的提示文字
            "default_popup":"/popup.html" // 默认点击图标时弹出的浮层
            },
                "permissions": [
                "tabs",
                "activeTab",
                "storage",
                "notifications"
                ],
                    "background": {
                    "persistent": false,
                "scripts": ["./background.js"]
                },
                "content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self'",
                    "content_scripts": [
                        {
                            "matches": [
                            "http://*/*",
                            "https://*/*"
                            ],
                            "js": [ // content script 文件
                            "/popupListener.js"
                            ],
                            "run_at": "document_idle"
                        }
                    ]
                }
```

### webpack.config.js

如下代码配置 webpack ，可以帮助我们编译打包 HTML、JavaScript 和 Less 编写的样式文件，打包静态资源，执行`npm run build` 获得打包好的 dist 文件，就可以分享到团队中了。

```javascript
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');

    module.exports = {
    mode: 'development',
    context: path.resolve(__dirname, './src'),
        entry: {
        popup: './popup/index.js',
        background: './background/index.js',
        popupListener: './contentScript/popupListener.js',
        },
            output: {
            path: path.resolve(__dirname, './dist'),
            publicPath: '/',
            filename: '[name].js',
            },
                module: {
                    rules: [
                        {
                        test: /\.css$/,
                        use: ['style-loader', 'css-loader'],
                        },
                            {
                            test: /\.less$/,
                                use: [
                                'style-loader',
                                'css-loader',
                                'less-loader'],
                                },
                                    {
                                    test: /\.(js|jsx)$/,
                                    exclude: /node_modules/,
                                        use: {
                                        loader: 'babel-loader',
                                            options: {
                                            babelrc: false,
                                                presets: [
                                                // 添加 preset-react 识别 react 代码
                                                require.resolve('@babel/preset-react'),
                                                require.resolve('@babel/preset-env'),
                                                    {
                                                    plugins: ['@babel/plugin-proposal-class-properties'],
                                                    },
                                                    ],
                                                    cacheDirectory: true,
                                                    },
                                                    },
                                                    },
                                                    ],
                                                    },
                                                        plugins: [
                                                            new HtmlWebpackPlugin({
                                                            title: 'popup',
                                                            template: './popup/index.html',
                                                            inject: true,
                                                            chunks: ['popup'],
                                                            filename: 'popup.html',
                                                            }),
                                                            new webpack.HotModuleReplacementPlugin(),
                                                            new CleanWebpackPlugin(['./dist/', './zip/']),
                                                                new CopyWebpackPlugin([
                                                                { from: 'assets', to: 'assets' },
                                                                { from: 'manifest.json', to: 'manifest.json', flatten: true },
                                                                ]),
                                                                ],
                                                                };
                                                                
```

核心代码
----

### Content Script

Content Scripts 是运行在Web页面的上下文的 JavaScript 文件。通过标准的 DOM，Content Scripts 可以操作（读取并修改）浏览器当前访问的Web页面的内容，并将信息传递给父扩展。

### 插入浮层

在此我们通过原生 JavaScript 的 `createElement()` 和 `append()` 方法向 body 中追加元素，插入浮层。

```javascript

const { domain } = document;
const isZcy = domain.indexOf('zcy') !== -1;
const userDom = document.getElementsByName('username')[0];

    if (isZcy && userDom) {
    // 域名为政采云域名，且存在 name = username 的元素（输入框）时，在页面左侧插入一个浮层
    const body = document.getElementsByTagName('body')[0];
    const panelWrapper = document.createElement('div');
    
    ReactDOM.render(<AccountPanel />, panelWrapper);
    body.append(panelWrapper);
}
```

### 一键登录

Event()

*   构造函数，创建一个新的事件对象 [Event](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FEvent "https://developer.mozilla.org/zh-CN/docs/Web/API/Event")。该方法 IE 浏览器不支持。

```javascript
event = new Event(typeArg, eventInit);
// typeArg 是DOMString 类型，表示所创建事件的名称。
// eventInit 可选，接受以下字段：
// bubbles 是否支持冒泡，cancelable：能否被取消，composed：事件是否会触发shadow DOM（阴影DOM）根节点之外的事件监听器
```

target.dispatchEvent(event)

*   向一个指定的事件目标派发一个事件，从而触发监听函数的执行。该方法返回一个布尔值，只要有一个监听函数调用了 target.dispatchEvent 则返回 false，否则返回 true。

```javascript
const usernameDom = document.getElementById('username');
const passwordDom = document.getElementById('password');
const { accountList } = this.state;
const { username, password } = accountList.find((item) => item.username === handleUsername);

// 未来可能会废弃的写法
// const evt = document.createEvent('HTMLEvents');
// evt.initEvent('input', true, true);

// ie 不支持
const evt = new Event('input', { bubbles: true });

// 将值填入 dom 输入框里
usernameDom.value = username;
usernameDom.dispatchEvent(evt);
passwordDom.value = password;
passwordDom.dispatchEvent(evt);

// 模拟用户点击登录按钮
const loginBtn = document.getElementsByClassName('login-btn')[0];
loginBtn.click();
```

开发辅助
----

### 一键重载：Extensions Reloader

即使 Webpack 配置了热更新，插件打包出来的 JavaScript 代码更新后也是不能热加载的，我们可以访问 `chrome://extensions/` 点击下图中的小按钮重新加载，或者安装 [Extensions Reloader](https://link.juejin.cn?target=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Fextensions-reloader%2Ffimgfedafeadlieiabdeeaodndnlbhid%3Fhl%3Dzh-CN "https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid?hl=zh-CN") 插件，点击按钮进行重新加载。

![image (2).png](/images/jueJin/4e8e1e3899bc472.png)

![image (3).png](/images/jueJin/a6d1a80c288f47c.png)

### 安装扩展文件

Chrome 允许安装 **Chrome 应用市场**和**本地**文件两种来源的扩展文件。访问 [chrome://extensions/](https://link.juejin.cn?target=) ，打开 **开发者模式**，点击 **加载已解压的扩展程序**，就可以选中我们本地的文件了，Edge 等浏览器也可以用。

下一阶段
----

### 目标

*   将数据存储到后端，避免数据丢失问题。
*   将数据共享到前端 VSCode 插件上，提供给快速本地代理使用。
*   新增用户登录功能，打通同一使用者访客身份数据共用问题。
*   隔离业务小组，避免 Tag 混用、全量账号查找不便问题。
*   一键打开 Chrome 访客身份并登录，同时操作多个账号，方便测试使用。

设计方向：对插件的使用者增加登录功能，登录通过 **域账号-密码-业务小组** 圈定一个范围，同一个 **业务小组共享** 测试账号、绑定的业务标签、业务小组关联的应用。前端本地开发时，项目获得的账号通过当前应用所属的业务小组拉取。

![image (5).png](/images/jueJin/7711b5f8145e4e1.png)

### E-R 图设计

![image (6).png](/images/jueJin/38d89831351648d.png)

参考文档
----

[Chrome Developers](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.chrome.com%2Fdocs%2Fextensions%2Fmv3%2Fgetstarted%2F "https://developer.chrome.com/docs/extensions/mv3/getstarted/")

推荐阅读
----

[电商最小存货 - SKU 和 算法实现](https://juejin.cn/post/7002746459456176158 "https://juejin.cn/post/7002746459456176158")

[你需要知道的项目管理知识](https://juejin.cn/post/6997536906967777316 "https://juejin.cn/post/6997536906967777316")

[浏览器渲染之回流重绘](https://juejin.cn/post/7013131773756309517 "https://juejin.cn/post/7013131773756309517")

[防抖节流场景及应用](https://juejin.cn/post/7018296556323340324 "https://juejin.cn/post/7018296556323340324")

开源作品
----

*   政采云前端小报

**开源地址 [www.zoo.team/openweekly/](https://link.juejin.cn?target=https%3A%2F%2Fwww.zoo.team%2Fopenweekly%2F "https://www.zoo.team/openweekly/")** (小报官网首页有微信交流群)

*   skuDemo

**开源地址 [github.com/zcy-inc/sku…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fzcy-inc%2FskuPathFinder-back "https://github.com/zcy-inc/skuPathFinder-back")**

招贤纳士
----

政采云前端团队（ZooTeam），一个年轻富有激情和创造力的前端团队，隶属于政采云产品研发部，Base 在风景如画的杭州。团队现有 50 余个前端小伙伴，平均年龄 27 岁，近 3 成是全栈工程师，妥妥的青年风暴团。成员构成既有来自于阿里、网易的“老”兵，也有浙大、中科大、杭电等校的应届新人。团队在日常的业务对接之外，还在物料体系、工程平台、搭建平台、性能体验、云端应用、数据分析及可视化等方向进行技术探索和实战，推动并落地了一系列的内部技术产品，持续探索前端技术体系的新边界。

如果你想改变一直被事折腾，希望开始能折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变既定的节奏，将会是“5 年工作时间 3 年工作经验”；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊… 如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的前端团队的成长历程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 `ZooTeam@cai-inc.com`

![](/images/jueJin/98d3aa3d1f8646a.png)