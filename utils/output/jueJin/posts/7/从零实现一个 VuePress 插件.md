---
author: "冴羽"
title: "从零实现一个 VuePress 插件"
date: 2022-01-14
description: "在搭建 VuePress 博客的过程中，也并不是所有的插件都能满足需求，所以本篇我们以实现一个代码复制插件为例，教大家如何从零实现一个 VuePress 插件。"
tags: ["前端","JavaScript","VuePress中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:24,comments:0,collects:10,views:2076,"
---
前言
--

在 [《一篇带你用 VuePress + Github Pages 搭建博客》](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F235 "https://github.com/mqyqingfeng/Blog/issues/235")中，我们使用 VuePress 搭建了一个博客，最终的效果查看：[TypeScript 中文文档](https://link.juejin.cn?target=http%3A%2F%2Fts.yayujs.com%2F "http://ts.yayujs.com/")。

但在搭建 VuePress 博客的过程中，也并不是所有的插件都能满足需求，所以本篇我们以实现一个代码复制插件为例，教大家如何从零实现一个 VuePress 插件。

本地开发
----

开发插件第一个要解决的问题就是如何本地开发，我们查看 VuePress 1.0 官方文档的「[开发插件](https://link.juejin.cn?target=https%3A%2F%2Fvuepress.vuejs.org%2Fzh%2Fplugin%2Fwriting-a-plugin.html "https://vuepress.vuejs.org/zh/plugin/writing-a-plugin.html")」章节，并没有找到解决方案，但在 VuePress 2.0 官方文档的「[本地插件](https://link.juejin.cn?target=https%3A%2F%2Fv2.vuepress.vuejs.org%2Fzh%2Fguide%2Fplugin.html%23%25E6%259C%25AC%25E5%259C%25B0%25E6%258F%2592%25E4%25BB%25B6 "https://v2.vuepress.vuejs.org/zh/guide/plugin.html#%E6%9C%AC%E5%9C%B0%E6%8F%92%E4%BB%B6")」里，却有写道：

> 推荐你直接将 配置文件 作为插件使用，因为几乎所有的插件 API 都可以在配置文件中使用，这在绝大多数场景下都更为方便。

> 但是如果你在配置文件中要做的事情太多了，最好还是将它们提取到单独的插件中，然后通过设置绝对路径或者通过 require 来使用它们：

```javascript
    module.exports = {
        plugins: [
        path.resolve(__dirname, './path/to/your-plugin.js'),
        require('./another-plugin'),
        ],
    }
```

那就让我们开始吧！

初始化项目​
------

我们在 `.vuepress` 文件夹下新建一个 `vuepress-plugin-code-copy` 的文件夹，用于存放插件相关的代码，然后命令行进入到该文件夹，执行 `npm init`，创建 `package.json`，此时文件的目录为：

```javascript
.vuepress
├─ vuepress-plugin-code-copy
│  └─ package.json
└─ config.js
```

我们在 `vuepress-plugin-code-copy`下新建一个 `index.js` 文件，参照[官方文档插件示例](https://link.juejin.cn?target=https%3A%2F%2Fvuepress.vuejs.org%2Fzh%2Fplugin%2Fwriting-a-plugin.html "https://vuepress.vuejs.org/zh/plugin/writing-a-plugin.html")中的写法，我们使用返回对象的函数形式，这个函数接受插件的配置选项作为第一个参数、包含编译期上下文的 ctx 对象作为第二个参数：

```javascript
    module.exports = (options, ctx) => {
        return {
        // ...
    }
}
```

再参照官方文档 Option API 中的 [name](https://link.juejin.cn?target=https%3A%2F%2Fvuepress.vuejs.org%2Fzh%2Fplugin%2Foption-api.html%23name "https://vuepress.vuejs.org/zh/plugin/option-api.html#name")，以及生命周期函数中的 [ready 钩子](https://link.juejin.cn?target=https%3A%2F%2Fvuepress.vuejs.org%2Fzh%2Fplugin%2Flife-cycle.html%23ready "https://vuepress.vuejs.org/zh/plugin/life-cycle.html#ready")，我们写一个初始的测试代码：

```javascript
    module.exports = (options, ctx) => {
        return {
        name: 'vuepress-plugin-code-copy',
            async ready() {
            console.log('Hello World!');
        }
    }
}
```

此时我们运行下 `yarn run docs:dev`，可以在运行过程中看到我们的插件名字和打印结果：

![image.png](/images/jueJin/b412b7fe7f484e7.png)

插件设计
----

现在我们可以设想下我们的代码复制插件的效果了，我想要实现的效果是：​

在代码块的右下角有一个 Copy 文字按钮，点击后文字变为 Copied！然后一秒后文字重新变为 Copy，而代码块里的代码则在点击的时候复制到剪切板中，期望的表现效果如下：

![copy.gif](/images/jueJin/113eb248c30f443.png)

插件开发
----

如果是在 Vue 组件中，我们很容易实现这个效果，在根组件 `mounted` 或者 `updated`的时候，使用 `document.querySelector`获取所有的代码块，插入一个按钮元素，再在按钮元素上绑定点击事件，当触发点击事件的时候，代码复制到剪切板，然后修改文字，1s 后再修改下文字。

那 VuePress 插件有方法可以控制根组件的生命周期吗？我们查阅下 VuePress 官方文档的 [Option API](https://link.juejin.cn?target=https%3A%2F%2Fvuepress.vuejs.org%2Fzh%2Fplugin%2Foption-api.html%23clientrootmixin "https://vuepress.vuejs.org/zh/plugin/option-api.html#clientrootmixin")，可以发现 VuePress 提供了一个 clientRootMixin 方法：

> 指向 mixin 文件的路径，它让你可以控制根组件的生命周期

看下示例代码：

```javascript
// 插件的入口
const path = require('path')

    module.exports = {
    clientRootMixin: path.resolve(__dirname, 'mixin.js')
}
``````javascript
// mixin.js
    export default {
    created () {},
mounted () {}
}
```

这不就是我们需要的吗？那我们动手吧，修改 `index.js`的内容为：

```javascript
const path = require('path');

    module.exports = (options, ctx) => {
        return {
        name: 'vuepress-plugin-code-copy',
        clientRootMixin: path.resolve(__dirname, 'clientRootMixin.js')
    }
}
```

在 `vuepress-plugin-code-copy`下新建一个 `clientRootMixin.js`文件，代码写入：

```javascript
    export default {
        updated() {
            setTimeout(() => {
                document.querySelectorAll('div[class*="language-"] pre').forEach(el => {
                console.log('one code block')
                })
                }, 100)
            }
        }
```

刷新下浏览器里的页面，然后查看打印：

![image.png](/images/jueJin/943bff02398a45c.png) 接下来就要思考如何写入按钮元素了。​

当然我们可以使用原生 JavaScript 一点点的创建元素，然后插入其中，但我们其实是在一个支持 Vue 语法的项目里，其实我们完全可以创建一个 Vue 组件，然后将组件的实例挂载到元素上。那用什么方法挂载呢？

我们可以在 Vue 的[全局 API](https://link.juejin.cn?target=vuepress.vuejs.org "vuepress.vuejs.org") 里，找到 `Vue.extend`API，看一下使用示例：

```javascript
// 要挂载的元素
<div id="mount-point"></div>
``````javascript
// 创建构造器
    var Profile = Vue.extend({
    template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
        data: function () {
            return {
            firstName: 'Walter',
            lastName: 'White',
            alias: 'Heisenberg'
        }
    }
    })
    // 创建 Profile 实例，并挂载到一个元素上。
    new Profile().$mount('#mount-point')
```

结果如下：

```html
// 结果为:
<p>Walter White aka Heisenberg</p>
```

那接下来，我们就创建一个 Vue 组件，然后通过 `Vue.extend` 方法，挂载到每个代码块元素中。

在 `vuepress-plugin-code-copy`下新建一个 `CodeCopy.vue` 文件，写入代码如下：

```vue
<template>
<span class="code-copy-btn" @click="copyToClipboard">{{ buttonText }}</span>
</template>

<script>
    export default {
        data() {
            return {
            buttonText: 'Copy'
        }
        },
            methods: {
                copyToClipboard(el) {
                this.setClipboard(this.code, this.setText);
                },
                    setClipboard(code, cb) {
                        if (navigator.clipboard) {
                        navigator.clipboard.writeText(code).then(
                        cb,
                    () => {}
                    )
                        } else {
                        let copyelement = document.createElement('textarea')
                        document.body.appendChild(copyelement)
                        copyelement.value = code
                        copyelement.select()
                        document.execCommand('Copy')
                        copyelement.remove()
                        cb()
                    }
                    },
                        setText() {
                        this.buttonText = 'Copied!'
                        
                            setTimeout(() => {
                            this.buttonText = 'Copy'
                            }, 1000)
                        }
                    }
                }
                </script>
                
                <style scoped>
                    .code-copy-btn {
                    position: absolute;
                    bottom: 10px;
                    right: 7.5px;
                    opacity: 0.75;
                    cursor: pointer;
                    font-size: 14px;
                }
                
                    .code-copy-btn:hover {
                    opacity: 1;
                }
                </style>
```

该组件实现了按钮的样式和点击时将代码写入剪切版的效果，整体代码比较简单，就不多叙述了。

我们修改一下 `clientRootMixin.js`：

```javascript
import CodeCopy from './CodeCopy.vue'
import Vue from 'vue'

    export default {
        updated() {
        // 防止阻塞
            setTimeout(() => {
                document.querySelectorAll('div[class*="language-"] pre').forEach(el => {
                // 防止重复写入
                if (el.classList.contains('code-copy-added')) return
                let ComponentClass = Vue.extend(CodeCopy)
                let instance = new ComponentClass()
                instance.code = el.innerText
                instance.$mount()
                el.classList.add('code-copy-added')
                el.appendChild(instance.$el)
                })
                }, 100)
            }
        }
```

这里注意两点，第一是我们通过 `el.innerText` 获取要复制的代码内容，然后写入到实例的 `code` 属性，在组件中，我们是通过 `this.code`获取的。

第二是我们没有使用 `$mount(element)`，直接传入一个要挂载的节点元素，这是因为 `$mount()` 的挂载会清空目标元素，但是这里我们需要添加到元素中，所以我们在执行 `instance.$mount()`后，通过 `instance.$el`获取了实例元素，然后再将其 `appendChild` 到每个代码块中。关于 `$el`的使用可以参考官方文档的 [el 章节](https://link.juejin.cn?target=https%3A%2F%2Fcn.vuejs.org%2Fv2%2Fapi%2Findex.html%23el "https://cn.vuejs.org/v2/api/index.html#el") 。

此时，我们的文件目录如下：

```html
.vuepress
├─ vuepress-plugin-code-copy
│  ├─ CodeCopy.vue
│  ├─ clientRootMixin.js
│  ├─ index.js
│  └─ package.json
└─ config.js
```

至此，其实我们就已经实现了代码复制的功能。

插件选项
----

有的时候，为了增加插件的可拓展性，会允许配置可选项，就比如我们不希望按钮的文字是 Copy，而是中文的「复制」，复制完后，文字变为 「已复制！」，该如何实现呢？

前面讲到，我们的 `index.js`导出的函数，第一个参数就是 options 参数：

```javascript
const path = require('path');

    module.exports = (options, ctx) => {
        return {
        name: 'vuepress-plugin-code-copy',
        clientRootMixin: path.resolve(__dirname, 'clientRootMixin.js')
    }
}
```

我们在 `config.js`先写入需要用到的选项：

```javascript
    module.exports = {
        plugins: [
            [
            require('./vuepress-plugin-code-copy'),
                {
                'copybuttonText': '复制',
                'copiedButtonText': '已复制！'
            }
        ]
    ]
}
```

我们 `index.js`中通过 `options`参数可以接收到我们在 `config.js` 写入的选项，但我们怎么把这些参数传入 `CodeCopy.vue` 文件呢？

我们再翻下 VuePress 提供的 Option API，可以发现有一个 [define API](https://link.juejin.cn?target=https%3A%2F%2Fvuepress.vuejs.org%2Fzh%2Fplugin%2Foption-api.html%23define "https://vuepress.vuejs.org/zh/plugin/option-api.html#define")，其实这个 define 属性就是定义我们插件内部使用的全局变量。我们修改下 `index.js`：

```javascript
const path = require('path');

    module.exports = (options, ctx) => {
        return {
        name: 'vuepress-plugin-code-copy',
            define: {
            copybuttonText: options.copybuttonText || 'copy',
            copiedButtonText: options.copiedButtonText || "copied!"
            },
            clientRootMixin: path.resolve(__dirname, 'clientRootMixin.js')
        }
    }
```

现在我们已经写入了两个全局变量，组件里怎么使用呢？答案是直接使用！

我们修改下 `CodeCopy.vue` 的代码：

```vue
// ...
<script>
    export default {
        data() {
            return {
            buttonText: copybuttonText
        }
        },
            methods: {
                copyToClipboard(el) {
                this.setClipboard(this.code, this.setText);
                },
                    setClipboard(code, cb) {
                        if (navigator.clipboard) {
                        navigator.clipboard.writeText(code).then(
                        cb,
                    () => {}
                    )
                        } else {
                        let copyelement = document.createElement('textarea')
                        document.body.appendChild(copyelement)
                        copyelement.value = code
                        copyelement.select()
                        document.execCommand('Copy')
                        copyelement.remove()
                        cb()
                    }
                    },
                        setText() {
                        this.buttonText = copiedButtonText
                        
                            setTimeout(() => {
                            this.buttonText = copybuttonText
                            }, 1000)
                        }
                    }
                }
                </script>
                // ...
```

最终的效果如下：

![1234.gif](/images/jueJin/3bdaf3bb1580424.png)

代码参考
----

完整的代码查看：[github.com/mqyqingfeng…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Ftree%2Fmaster%2Fdemos%2FVuePress%2Fvuepress-plugin-code-copy "https://github.com/mqyqingfeng/Blog/tree/master/demos/VuePress/vuepress-plugin-code-copy")

其实本篇代码是参考了 `Vuepress Code Copy Plugin`这个插件的代码，点击[查看源码地址](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fznicholasbrown%2Fvuepress-plugin-code-copy "https://github.com/znicholasbrown/vuepress-plugin-code-copy")。

系列文章
----

博客搭建系列是我至今写的唯一一个偏实战的系列教程，讲解如何使用 VuePress 搭建博客，并部署到 GitHub、Gitee、个人服务器等平台。

1.  [一篇带你用 VuePress + GitHub Pages 搭建博客](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F235 "https://github.com/mqyqingfeng/Blog/issues/235")
2.  [一篇教你代码同步 GitHub 和 Gitee](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F236 "https://github.com/mqyqingfeng/Blog/issues/236")
3.  [还不会用 GitHub Actions ？看看这篇](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F237 "https://github.com/mqyqingfeng/Blog/issues/237")
4.  [Gitee 如何自动部署 Pages？还是用 GitHub Actions!](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F238 "https://github.com/mqyqingfeng/Blog/issues/238")
5.  [一份前端够用的 Linux 命令](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F239 "https://github.com/mqyqingfeng/Blog/issues/239")
6.  [一份简单够用的 Nginx Location 配置讲解](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F242 "https://github.com/mqyqingfeng/Blog/issues/242")
7.  [一篇从购买服务器到部署博客代码的详细教程](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F243 "https://github.com/mqyqingfeng/Blog/issues/243")
8.  [一篇域名从购买到备案到解析的详细教程](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F247 "https://github.com/mqyqingfeng/Blog/issues/247")
9.  [VuePress 博客优化之 last updated 最后更新时间如何设置](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F244 "https://github.com/mqyqingfeng/Blog/issues/244")
10.  [VuePress 博客优化之添加数据统计功能](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F245 "https://github.com/mqyqingfeng/Blog/issues/245")
11.  [VuePress 博客优化之开启 HTTPS](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F246 "https://github.com/mqyqingfeng/Blog/issues/246")
12.  [VuePress 博客优化之开启 Gzip 压缩](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F248 "https://github.com/mqyqingfeng/Blog/issues/248")

微信：「mqyqingfeng」，加我进冴羽唯一的读者群。

如果有错误或者不严谨的地方，请务必给予指正，十分感谢。如果喜欢或者 有所启发，欢迎 star，对作者也是一种鼓励。