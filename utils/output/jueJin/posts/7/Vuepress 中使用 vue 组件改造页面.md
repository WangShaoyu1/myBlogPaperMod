---
author: "Gaby"
title: "Vuepress 中使用 vue 组件改造页面"
date: 2022-06-26
description: "只是单纯的用 `vuepress` 写个 markdown 文档，的确会处处受限，满足不了定制化的样式和功能，有时只是简单的修改下某个页面，或者做些组件演示的内容，而不是开发一整套主题。所以有必要学下"
tags: ["JavaScript","架构","VuePress中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:13,comments:5,collects:18,views:4556,"
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第27天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

废话只说一句：码字不易求个👍，收藏 === 学会,快行动起来吧！🙇‍🙇‍🙇‍。

只是单纯的用 `vuepress` 写个 markdown 文档，的确会处处受限，满足不了定制化的样式和功能，有时只是简单的修改下某个页面，或者做些组件演示的内容，而不是开发一整套主题。所以研究下如何在项目中使用 `vue` 组件还有非常有必要的，毕竟也没那么难。

### 前置环境

*   node 环境 `node v16.13.0`
*   VuePress 版本 `VuePress v2.0.0-beta.48`

每个版本的使用方式还是有些差异的，尤其是 `1.x` 与 `2.x`，所以在阅读的时候尽量与自己所用的版本对比下，避免不必要的试错。

### 使用 vue 组件

#### 安装插件

在 `Vuepress2.x` 中需要安装 [@vuepress/plugin-register-components](https://link.juejin.cn?target=https%3A%2F%2Fv2.vuepress.vuejs.org%2Fzh%2Freference%2Fplugin%2Fregister-components.html "https://v2.vuepress.vuejs.org/zh/reference/plugin/register-components.html") 插件并做好配置,而在Vuepress1.0中，md 文件能自动识别导出的`.vue`文件。

```js
yarn add @vuepress/plugin-register-components@next
// 或者
npm i -D @vuepress/plugin-register-components@next
```

#### 配置插件

`config.js`中配置修改如下：

☞ [官方配置项文档](https://link.juejin.cn?target=https%3A%2F%2Fv2.vuepress.vuejs.org%2Fzh%2Freference%2Fplugin%2Fregister-components.html%23%25E9%2585%258D%25E7%25BD%25AE%25E9%25A1%25B9 "https://v2.vuepress.vuejs.org/zh/reference/plugin/register-components.html#%E9%85%8D%E7%BD%AE%E9%A1%B9")

```js
const { registerComponentsPlugin } = require('@vuepress/plugin-register-components')

    module.exports = {
        plugins: [
            registerComponentsPlugin({
            // 配置项
            }),
            ],
        }
```

我本地的配置文件的部分内容：

```js
const path = require("path");
const { defaultTheme } = require('vuepress');
const { docsearchPlugin } = require('@vuepress/plugin-docsearch')

// ======================引入插件====================================
const { registerComponentsPlugin } = require('@vuepress/plugin-register-components')
// ======================引入插件 End================================

const navbar = require('./navbar');
const sidebar = require('./sidebar');

    module.exports = {
    base: '/',
    lang: 'zh-CN',
    title: '前端技术栈',
    description: '前端白皮书',
        head: [
        ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }]
    ],
        alias: {
        '@pub': path.resolve(__dirname, './public'),
        },
            markdown: {
                importCode: {
                handleImportPath: (str) =>
                str.replace(/^@src/, path.resolve(__dirname, 'src')),
                },
                extractTitle: true
                },
                // ======================配置插件====================================
                    plugins: [
                        registerComponentsPlugin({
                        // 配置项
                        componentsDir: path.resolve(__dirname, './components')
                        })
                        ],
                        // ======================配置插件 End=================================
                            theme: defaultTheme({
                            // URL
                            logo: 'https://vuejs.org/images/logo.png',
                            // 顶部导航
                            navbar: navbar,
                            // 侧边栏
                            sidebar: sidebar,
                            sidebarDepth: 2, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
                            lastUpdated: true // 文档更新时间：每个文件git最后提交的时间
                            })
                        }
```

#### 创建 vue 组件

在`.vuepress`文件夹中新建components文件夹，里面存放vue组件，文件结构如下：

```js
├─.vuepress
│  └─ components
│  │  └─ Card.vue
│  └─ config
│  │  └─ navbar.js
│  │  └─ sidebar.js
│  └─ public
│  │  └─ images
│  └─ config.js
```

至此md文件就能无需引入即可自动识别`.vuepress/components/`下所有的vue组件了。继续完成下面的步骤，就可以看到项目中使用的效果。

`Card.vue` 文件内容如下，这个组件个人可以因需而定，这里只做个参照，和后面的效果对应上。`key`这里没有设置业务 ID 暂且使用 `k`来代替。

```js
<template>
<div class="g-card-link">
<div v-for="(item,k) in value" class="g-card-item" :key="k">
<a :href="item.link" target="_blank" :title="item.title">{{item.title}}</a>
</div>
</div>

</template>
<script setup>
import { ref, defineProps } from 'vue';

    const props = defineProps({
    defaultValue:String
    })
    const value = ref(props.defaultValue);
    </script>
    <style lang="scss">
button {background-color: #4e6ef2}
    .g-card-link {
    display: flex;
    flex-wrap: wrap;
    gap:10px;
    text-align: center;
    line-height: 38px;
        .g-card-item {
        background: blue;
        width: 113px;
        max-width: 138px;
        height: 38px;
        cursor: pointer;
        overflow: hidden;
    }
        .g-card-item:nth-of-type(2n) {
        background: rgba(44,104,255,.1);
    }
        .g-card-item:nth-of-type(2n+1) {
        background: rgba(56, 203, 137, .1);
    }
}
</style>
```

#### 使用 vue 组件

在 `docs/docs/README.md` 文件直接引入`Card.vue`，当然文档路径你可以自由选择。这里我们给组件传了数据，如果没有数据交互会更简单，直接引用就行了。

```md
---
data: 2022-06-14
lang: zh-CN
title: Docs 常用文档
description: 收集常用的文档
---

# Docs

收集精编常用的文档...

<div v-for="(item,k) in linkList">
<h3>{{item.title}}</h3>
<div>
<card :defaultValue="item.children"/>
</div>
</div>


<script setup>
import { ref } from 'vue';

const linkList = ref([]);
    linkList.value = [
        {
        title: 'React UI 组件库',
            children: [
                {
                title: 'Ant Design',
                link: 'https://ant.design/docs/react/introduce-cn'
                    },{
                    title: 'Bootstrap',
                    link: 'https://react-bootstrap.github.io/getting-started/introduction'
                        },{
                        title: 'Material UI',
                        link: 'https://mui.com/material-ui/getting-started/overview/'
                    }
                ]
                    },{
                    title: 'Vue UI 组件库',
                        children: [
                            {
                            title: 'Element',
                            link: 'https://element.eleme.io/#/zh-CN/component/installation'
                                },{
                                title: 'Element Plus',
                                link: 'https://element-plus.org/zh-CN/component/button.html'
                                    },{
                                    title: 'Vant',
                                    link: 'https://youzan.github.io/vant/#/zh-CN'
                                        },{
                                        title: 'View Design',
                                        link: 'https://www.iviewui.com/view-ui-plus/guide/introduce'
                                    }
                                ]
                                },
                                    {
                                    title: '动画库',
                                        children: [
                                            {
                                            title: 'Animate.css',
                                            link: 'https://animate.style/'
                                        }
                                    ]
                                }
                                
                            ]
                            </script>
```

至此组件已经引入到页面中可，我们来看看效果 ☞ [传送门](https://link.juejin.cn?target=https%3A%2F%2Fdocs.ycsnews.com%2Fdocs%2F "https://docs.ycsnews.com/docs/") ：

![image.png](/images/jueJin/95be3dd7bb694b0.png)