---
author: "Gaby"
title: "VuePress只有用起来才能体现它的价值"
date: 2022-06-07
description: "使用上相对来说还是比较简单的，小伙伴们可以使用这个工具，来对自己所学的知识进行系统性的梳理下，以博客文章的形式展现出来，达到既有输入也有所输出。"
tags: ["JavaScript","面试","架构中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:15,comments:6,collects:24,views:6727,"
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第8天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

废话只说一句：码字不易求个👍，收藏 === 学会,快行动起来吧！🙇‍🙇‍🙇‍。

感谢点赞、收藏、关注和提出建议的小伙伴，希望大家工作顺利、老板能给你们加鸡腿!

VuePress 是一个以 Markdown 为中心的静态网站生成器。你可以使用 [Markdown在新窗口打开](https://link.juejin.cn?target=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2FMarkdown "https://zh.wikipedia.org/wiki/Markdown") 来书写内容（如文档、博客等），然后 VuePress 会帮助你生成一个静态网站来展示它们。

VuePress 诞生的初衷是为了支持 Vue.js 及其子项目的文档需求，但是现在它已经在帮助大量用户构建他们的文档、博客和其他静态网站。

使用上相对来说还是比较简单的，小伙伴们可以使用这个工具，来对自己所学的知识进行系统性的梳理下，以博客文章的形式展现出来，达到既有输入也有所输出。

### 创建项目

先创建项目目录 `vuepress` ,进入目录后，进行初始化项目

```js
yarn init -y
// or
npm init -y
```

安装 `vuepress`

```js
yarn add -D vuepress@next
// or
npm install -D vuepress@next
```

在 `package.json` 中添加一些 [scripts](https://link.juejin.cn?target=https%3A%2F%2Fclassic.yarnpkg.com%2Fzh-Hans%2Fdocs%2Fpackage-json%23toc-scripts "https://classic.yarnpkg.com/zh-Hans/docs/package-json#toc-scripts")

```js
// 官方
    {
        "scripts": {
        "docs:dev": "vuepress dev docs",
        "docs:build": "vuepress build docs"
    }
}
// 为了方便，符合日常使用习惯，这里修改如下
    {
        "scripts": {
        "dev": "vuepress dev docs",
        "build": "vuepress build docs"
    }
}
```

将默认的临时目录和缓存目录添加到 `.gitignore` 文件中，可以通过命令写入文件，也可以直接手动创建文件通过编辑器将目录添加进去。

```js
echo 'node_modules' >> .gitignore
echo '.temp' >> .gitignore
echo '.cache' >> .gitignore
```

创建你的第一篇文档，这里要说下，`docs`目录为必备目录，页面md文件和配置文件都要存储在这个目录下。

```js
mkdir docs
echo '# Hello VuePress' > docs/README.md
```

创建好第一个文件后，在本地启动服务器来开发你的文档网站,执行下面的命令启动吧！

```js
yarn dev
// or
npm run dev
```

VuePress 会在 [http://localhost:8080在新窗口打开](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2F "http://localhost:8080/") 启动一个热重载的开发服务器。当你修改你的 Markdown 文件时，浏览器中的内容也会自动更新。

现在，你应该已经有了一个简单可用的 VuePress 文档网站。接下来，就可以根据 VuePress [官方配置](https://link.juejin.cn?target=https%3A%2F%2Fv2.vuepress.vuejs.org%2Fzh%2Fguide%2Fconfiguration.html "https://v2.vuepress.vuejs.org/zh/guide/configuration.html") 来配置相关的内容了。

![image.png](/images/jueJin/a2b2e36089ad487.png)

### 配置项目

#### 路由

首先先来熟悉下路由规则，其实就是根目docs 目录下的md，文档所在的目录，进行映射成对应的路由的。

假设这是你的 Markdown 文件所处的目录结构：

```js
└─ docs
├─ guide
│  ├─ getting-started.md
│  └─ README.md
├─ contributing.md
└─ README.md
```

将 `docs` 目录作为你的 [sourceDir](https://link.juejin.cn?target=https%3A%2F%2Fv2.vuepress.vuejs.org%2Fzh%2Freference%2Fcli.html "https://v2.vuepress.vuejs.org/zh/reference/cli.html") ，例如你在运行 `vuepress dev docs` 命令。此时，你的 Markdown 文件对应的路由路径为：

相对路径

路由路径

`/README.md`

`/`

`/index.md`

`/`

`/contributing.md`

`/contributing.html`

`/guide/README.md`

`/guide/`

`/guide/page.md`

`/guide/page.html`

了解好路由规则后，咱们再来看下其他的配置项是如何配置的

#### 页面配置

Markdown 文件可以包含一个 [YAML在新窗口打开](https://link.juejin.cn?target=https%3A%2F%2Fyaml.org%2F "https://yaml.org/") Frontmatter 。Frontmatter 必须在 Markdown 文件的顶部，并且被包裹在一对三短划线中间。下面是一个基本的示例：

```js
---
lang: zh-CN
title: 页面的标题
description: 页面的描述
---
```

这里有具体的[配置信息](https://link.juejin.cn?target=https%3A%2F%2Fv2.vuepress.vuejs.org%2Fzh%2Freference%2Ffrontmatter.html "https://v2.vuepress.vuejs.org/zh/reference/frontmatter.html"),可以根据自己需要进行选择性的配置。

#### 配置文件

VuePress 站点的基本配置文件是 `.vuepress/config.js` ，但也同样支持 TypeScript 配置文件。你可以使用 `.vuepress/config.ts` 来得到更好的类型提示。

```js
├─ docs
│  ├─ .vuepress
│  │  └─ config.js
│  └─ README.md
├─ .gitignore
└─ package.json
```

贴一份简单的配置仅供参考，创建一份文档类型的小站这些配置基本够用了

```js
const path = require("path");
const { defaultTheme } = require('vuepress');

    module.exports = {
    base: '/',
    lang: 'zh-CN',
    title: '前端技术栈',
    description: '这是我的第一个 VuePress 站点',
        head: [
    // ['link', { rel: 'icon', href: '/idec.ico' }]
    ],
        alias: {
        // http://localhost:8080/@fs/Users/gaby/Desktop/Web/vuepress/docs/.vuepress/public/
        '@pub': path.resolve(__dirname, './public'),
        },
            markdown: {
                importCode: {
                handleImportPath: (str) =>
                str.replace(/^@src/, path.resolve(__dirname, 'src')),
                },
                },
                plugins: [],
                    theme: defaultTheme({
                    // URL
                    logo: 'https://vuejs.org/images/logo.png',
                    // repo: 'https://gitlab.com/foo/bar', // 仓库地址
                    // 默认主题配置
                        navbar: [
                            {
                            text: '首页',
                            link: '/',
                            },
                                {
                                text: '工具类',
                                    children: [
                                        {
                                        text: 'storage',
                                        link: '/utils/storage.html'
                                            },{
                                            text: 'Log',
                                            link: '/utils/log.html'
                                        }
                                    ]
                                    },
                                    // 字符串 - 页面文件路径
                                    '/bar/README.md',
                                    ],
                                    // 侧边栏对象
                                    // 不同子路径下的页面会使用不同的侧边栏
                                    // 可折叠的侧边栏 需要参数 collapsible: true,
                                        sidebar: {
                                            '/':[
                                                {
                                                text: 'Foo',
                                                collapsible: true,
                                                    children: [
                                                    // SidebarItem
                                                        {
                                                        text: 'github',
                                                        link: 'https://github.com',
                                                        children: [],
                                                        },
                                                        // 字符串 - 页面文件路径
                                                        '/foo/bar.md',
                                                        ],
                                                        },
                                                        // 字符串 - 页面文件路径
                                                        '/bar/README.md',
                                                        ],
                                                            '/utils/': [
                                                                {
                                                                text: '工具类',
                                                                    children: [
                                                                        {
                                                                        text: 'storage',
                                                                        link: '/utils/storage.html'
                                                                        },
                                                                            {
                                                                            text: 'Log',
                                                                            link: '/utils/log.html',
                                                                            },
                                                                            // '/guide/README.md', '/guide/getting-started.md'
                                                                            ],
                                                                            },
                                                                            ],
                                                                                '/reference/': [
                                                                                    {
                                                                                    text: 'Reference',
                                                                                    children: ['/reference/cli.md', '/reference/config.md'],
                                                                                    },
                                                                                    ],
                                                                                }
                                                                                })
                                                                            }
```

![image.png](/images/jueJin/0a6cd359589c44a.png)

这个是文件目录，可以通过 styles/index.scss 进行样式重写。

### 小结

好东西还是得用，才能体现他的价值，这里只做抛转引入，给大家简单介绍下使用，后续有时间再对自定义主题进行输出一篇，以帮助更多想伙伴进行主题的自定义。