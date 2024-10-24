---
author: "冴羽"
title: "VuePress 博客之 SEO 优化（五）添加 JSON-LD 数据"
date: 2022-03-11
description: "在 《一篇带你用 VuePress + Github Pages 搭建博客》中，我们使用 VuePress 搭建了一个博客。本篇讲 SEO 中的 JSON-LD。"
tags: ["VuePress","SEO","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:23,comments:0,collects:6,views:2223,"
---
前言
--

在 [《一篇带你用 VuePress + Github Pages 搭建博客》](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F235 "https://github.com/mqyqingfeng/Blog/issues/235")中，我们使用 VuePress 搭建了一个博客，最终的效果查看：[TypeScript 中文文档](https://link.juejin.cn?target=https%3A%2F%2Fts.yayujs.com%2F "https://ts.yayujs.com/")。

本篇讲 SEO 中的 JSON-LD。

JSON-LD
-------

如果我们打开掘金任意一篇文章，比如这篇[《VuePress 博客优化之增加 Vssue 评论功能》](https://juejin.cn/post/7070822479874392101 "https://juejin.cn/post/7070822479874392101")，查看 DOM 元素，我们可以在 head 中找到这样一段 script 标签：

![image.png](/images/jueJin/6637274a73bc482.png)

在思否等其他平台也是可以看到的：

![image.png](/images/jueJin/ab87363cdb9b478.png)

那这个 type 为 `application/ld+json` 的 script，到底是什么意思呢? 又是什么作用呢？

这就是我们今天要介绍的 JSON-LD，英文全程：JavaScript Object Notation for Linked Data，官方地址：[json-ld.org/](https://link.juejin.cn?target=https%3A%2F%2Fjson-ld.org%2F "https://json-ld.org/")，简单的来说，就是用来描述网页的类型和内容，方便搜索引擎做展现。

比如如果我们在 Google 搜索 「Chocolate in a mug」，我们会看到这样的搜索结果：

![image.png](/images/jueJin/56ddff04baaf4f9.png)

我们打开页面，就可以看到搜索展示的内容对应了 `application/ld+json` 中的内容：

![image.png](/images/jueJin/6a15e7c8df7741c.png)

添加 JSON-LD
----------

如果我们也要实现这样的效果，方便搜索引擎展现，该怎么做呢？

在页面加入结构化数据的方法很简单，只用在页面添加这样一段脚本就可以了：

```html
<script type="application/ld+json">
// ...
</script>
```

具体里面的内容需要参考比如 Google 搜索中心提供的[《结构化数据常规指南》](https://link.juejin.cn?target=https%3A%2F%2Fdevelopers.google.com%2Fsearch%2Fdocs%2Fadvanced%2Fstructured-data%2Fsd-policies "https://developers.google.com/search/docs/advanced/structured-data/sd-policies")，因为我写的是具体的文章，所以参考 [Article 章节](https://link.juejin.cn?target=https%3A%2F%2Fdevelopers.google.com%2Fsearch%2Fdocs%2Fadvanced%2Fstructured-data%2Farticle "https://developers.google.com/search/docs/advanced/structured-data/article")后，我决定写入以下这些属性：

```html
<script type="application/ld+json">
    {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "这里填写标题",
        "image": [
        "https://ts.yayujs.com/icon-144x144.png"
        ],
        "datePublished": "2021-11-10T22:06:06.000Z",
        "dateModified": "2022-03-04T16:00:00.000Z",
            "author": [{
            "@type": "Person",
            "name": "冴羽",
            "url": "https://github.com/mqyqingfeng/Blog"
        }]
    }
    </script>
```

VuePress 实现
-----------

经过搜索，我并没有发现现成的插件，由于每个页面的标题、发布时间、更新时间都不同，那成吧，那就自己写个本地插件实现吧。

其实要实现的内容很简单，就是在编译的时候在 head 中写入一个 script 脚本，脚本的内容根据页面的属性而定，但毕竟我用的是 vuepress 1.x，实现方式受制于工具，完全看工具提供了什么 API 来实现，我们直接看最终的实现方式：

### vuepress-plugin-jsonld

在 .vuepress 目录下建立 vuepress-plugin-jsonld 文件夹，然后执行 npm init ，创建 package.json

创建 index.js，代码写入：

```javascript
const { path } = require('@vuepress/shared-utils')

    module.exports = options => ({
    name: 'vuepress-plugin-jsonld',
        enhanceAppFiles () {
    return [path.resolve(__dirname, 'enhanceAppFile.js')]
    },
globalUIComponents: ['JSONLD']
})
```

创建 enhanceAppFile.js，代码写入：

```javascript
import JSONLD from './JSONLD.vue'

    export default ({ Vue, options }) => {
    Vue.component('JSONLD', JSONLD)
}
```

创建 JSONLD.vue，代码写入：

```vue
<template></template>

<script>
    export default {
        created() {
            if (typeof this.$ssrContext !== "undefined") {
            this.$ssrContext.userHeadTags +=
            `<script type='application/ld+json'>
                {
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": "${this.$page.title}",
                "url": "${'https://yayujs.com' + this.$page.path}",
                    "image": [
                    "https://ts.yayujs.com/icon-144x144.png"
                    ],
                    "datePublished": "${this.$page.frontmatter.date && (new Date(this.$page.frontmatter.date)).toISOString()}",
                    "dateModified": "${this.$page.lastUpdated && (new Date(this.$page.lastUpdated)).toISOString()}",
                        "author": [{
                        "@type": "Person",
                        "name": "冴羽",
                        "url": "https://github.com/mqyqingfeng/Blog"
                    }]
                }
                <\/script>`;
            }
        }
        };
        </script>
```

这里之所以能够给所有的页面都注入脚本内容，是因为借助了 [globalUIComponents](https://link.juejin.cn?target=https%3A%2F%2Fv1.vuepress.vuejs.org%2Fzh%2Fplugin%2Foption-api.html%23globaluicomponents "https://v1.vuepress.vuejs.org/zh/plugin/option-api.html#globaluicomponents")：

> 你可能想注入某些全局的 UI，并固定在页面中的某处，如 back-to-top, popup。在 VuePress 中，一个全局 UI 就是一个 Vue 组件。

### config.js

接下来我们修改 config.js：

```javascript
    module.exports = {
    title: 'title',
    description: 'description',
        plugins: [
        require('./vuepress-plugin-jsonld')
    ]
}
```

注意我们在本地运行的时候并不能看到，我们可以关闭 deploy.sh 推送到远程的命令，然后本地编译一下，查一下输出的 HTML：

![image.png](/images/jueJin/41d1ee2cf3a346e.png)

验证
--

发布到线上后，我们可以在 Google 提供的[富媒体搜索测试](https://link.juejin.cn?target=https%3A%2F%2Fsearch.google.com%2Ftest%2Frich-results "https://search.google.com/test/rich-results")中进行验证，打开网址，输入页面地址，就可以看到抓取的结构化数据：

![image.png](/images/jueJin/c71229be45804c4.png)

如果有错误，这里也会展示警告。

系列文章
----

博客搭建系列是我至今写的唯一一个偏实战的系列教程，预计 20 篇左右，讲解如何使用 VuePress 搭建、优化博客，并部署到 GitHub、Gitee、私有服务器等平台。本篇为第 31 篇，全系列文章地址：[github.com/mqyqingfeng…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog "https://github.com/mqyqingfeng/Blog")

微信：「mqyqingfeng」，进冴羽的读者群。

如果有错误或者不严谨的地方，请务必给予指正，十分感谢。如果喜欢或者有所启发，欢迎 star，对作者也是一种鼓励。