---
author: "冴羽"
title: "一篇带你用 VuePress + Github Pages 搭建博客"
date: 2021-12-13
description: "基于 VuePress 和 VuePress 主题 vuepress-theme-rec 以及 Github Pages 实现快速搭建博客"
tags: ["前端","VuePress","Vue.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:193,comments:0,collects:215,views:12872,"
---
前言
--

最近完成了 TypeScript 最新官方文档 Hanbook 的翻译，一共十四篇，堪称国内的最好 TypeScript4 入门教程之一[。](https://link.juejin.cn?target=https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2Fmqyqingfeng%2Fpicture%2F%25E6%2588%25AA%25E5%25B1%258F2021-12-12%2520%25E4%25B8%258B%25E5%258D%25883.12.02.png "https://cdn.jsdelivr.net/gh/mqyqingfeng/picture/%E6%88%AA%E5%B1%8F2021-12-12%20%E4%B8%8B%E5%8D%883.12.02.png")为了方便大家阅读，我用 VuePress + Github Pages 搭建了博客，博客效果如下：

![](/images/jueJin/32185d6b5320450.png)

![](/images/jueJin/eb1b325b46ff4c1.png)

博客地址如下：

*   Github [mqyqingfeng.github.io/learn-types…](https://link.juejin.cn?target=https%3A%2F%2Fmqyqingfeng.github.io%2Flearn-typescript%2F "https://mqyqingfeng.github.io/learn-typescript/")
*   Gitee [mqyqingfeng.gitee.io/learn-types…](https://link.juejin.cn?target=http%3A%2F%2Fmqyqingfeng.gitee.io%2Flearn-typescript%2F "http://mqyqingfeng.gitee.io/learn-typescript/")
*   个人服务器 [ts.yayujs.com](https://link.juejin.cn?target=http%3A%2F%2Fts.yayujs.com%2F "http://ts.yayujs.com/")

0\. VuePress
------------

VuePress 自然不用多说，基于 Vue 的静态网站生成器，风格简约，配置也比较简单。之所以不使用 [VitePress](https://link.juejin.cn?target=https%3A%2F%2Fvitepress.vuejs.org%2F "https://vitepress.vuejs.org/")，是因为想使用现有的主题， 而 VitePress 不兼容当前 VuePress 的生态系统，至于为什么不选择 [VuePress@next](https://link.juejin.cn?target=https%3A%2F%2Fv2.vuepress.vuejs.org%2Fzh%2F "https://v2.vuepress.vuejs.org/zh/")，考虑到还处于 Beta 阶段，等稳定后再开始迁移。

1\. 本地搭建
--------

快速开始[同 VuePress 官网](https://link.juejin.cn?target=https%3A%2F%2Fvuepress.vuejs.org%2Fzh%2Fguide%2Fgetting-started.html "https://vuepress.vuejs.org/zh/guide/getting-started.html")：

1.  创建并进入一个新目录

```shell
// 文件名自定义
mkdir vuepress-starter && cd vuepress-starter
```

2.  使用你喜欢的包管理器进行初始化

```shell
yarn init # npm init
```

3.  将 VuePress 安装为本地依赖

```shell
yarn add -D vuepress # npm install -D vuepress
```

4.  创建你的第一篇文档，VuePress 会以 docs 为文档根目录，所以这个 README.md 相当于主页：

```shell
mkdir docs && echo '# Hello VuePress' > docs/README.md
```

5.  在 package.json 中添加一些 scripts

```json
    {
        "scripts": {
        "docs:dev": "vuepress dev docs",
        "docs:build": "vuepress build docs"
    }
}
```

6.  在本地启动服务器

```shell
yarn docs:dev # npm run docs:dev
```

VuePress 会在 [http://localhost:8080](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080 "http://localhost:8080") (opens new window) 启动一个热重载的开发服务器。

2\. 基础配置
--------

在文档目录下创建一个 `.vuepress` 目录，所有 VuePress 相关的文件都会被放在这里。此时你的项目结构可能是这样：

```typescript
.
├─ docs
│  ├─ README.md
│  └─ .vuepress
│     └─ config.js
└─ package.json
```

在 `.vuepress` 文件夹下添加 `config.js`，配置网站的标题和描述，方便 SEO：

```typescript
    module.exports = {
    title: 'TypeScript4 文档',
    description: 'TypeScript4 最新官方文档翻译'
}
```

此时界面类似于：

![](/images/jueJin/674e907d47c644f.png)

3\. 添加导航栏
---------

我们现在在页首的右上角添加导航栏，修改 `config.js`:

```typescript
    module.exports = {
    title: '...',
    description: '...',
        themeConfig: {
            nav: [
            { text: '首页', link: '/' },
                {
                text: '冴羽的 JavaScript 博客',
                    items: [
                    { text: 'Github', link: 'https://github.com/mqyqingfeng' },
                { text: '掘金', link: 'https://juejin.cn/user/712139234359182/posts' }
            ]
        }
    ]
}
}
```

效果如下：

![](/images/jueJin/751c5ada77f24e9.png)

更多的配置参考 [VuePress 导航栏](https://link.juejin.cn?target=https%3A%2F%2Fvuepress.vuejs.org%2Fzh%2Ftheme%2Fdefault-theme-config.html%23%25E5%25AF%25BC%25E8%2588%25AA%25E6%25A0%258F "https://vuepress.vuejs.org/zh/theme/default-theme-config.html#%E5%AF%BC%E8%88%AA%E6%A0%8F")。

4\. 添加侧边栏
---------

现在我们添加一些 md 文档，目前文档的目录如下：

```shell
.
├─ docs
│  ├─ README.md
│  └─ .vuepress
│     └─ config.js
|  └─ handbook
|  	  └─ ConditionalTypes.md
|	    └─ Generics.md
└─ package.json
```

我们在 `config.js` 配置如下：

```typescript
    module.exports = {
        themeConfig: {
        nav: [...],
            sidebar: [
                {
                title: '欢迎学习',
                path: '/',
                collapsable: false, // 不折叠
                    children: [
                { title: "学前必读", path: "/" }
            ]
            },
                {
                title: "基础学习",
                path: '/handbook/ConditionalTypes',
                collapsable: false, // 不折叠
                    children: [
                    { title: "条件类型", path: "/handbook/ConditionalTypes" },
                { title: "泛型", path: "/handbook/Generics" }
                ],
            }
        ]
    }
}
```

对应的效果如下：

![](/images/jueJin/b53be542e6134a0.png)

5\. 更换主题
--------

现在基本的目录和导航功能已经实现，但如果我还想要加载 loading、切换动画、模式切换（暗黑模式）、返回顶部、评论等功能呢，为了简化开发成本，我们可以直接使用主题，这里使用的主题是 [vuepress-theme-rec](https://link.juejin.cn?target=https%3A%2F%2Fvuepress-theme-reco.recoluan.com%2F "https://vuepress-theme-reco.recoluan.com/")：

现在我们安装 vuepress-theme-reco：

```shell
npm install vuepress-theme-reco --save-dev
# or
yarn add vuepress-theme-reco
```

然后在 `config.js` 里引用该主题：

```typescript
    module.exports = {
    // ...
    theme: 'reco'
    // ...
}
```

刷新一下页面，我们会发现一些细节的改变，比如加载时的 loading 动画、以及支持切换暗黑模式：

![](/images/jueJin/12ddf5885897463.png)

6\. 添加文章信息
----------

但我们也会发现，像条件类型这一篇文章，`条件类型（Conditional Types）` 竟然出现了两遍，这是因为这个主题自动提取了第一个大标题作为本文的标题，我们可以在每篇文章的 md 文件中添加一些信息修改：

```shell
---
title: 条件类型
author: 冴羽
date: '2021-12-12'
---
```

此时文章的效果如下：

![](/images/jueJin/d4ffb48eb9224b2.png)

但如果你不想要标题、作者、时间这些信息呢，我们可以在样式里隐藏，这个稍后会讲到。

7\. 设置语言
--------

注意，上图的文章时间，我们写入的格式为 `2021-12-12` ，但是显示的是 `12/12/2021`，这是因为 VuePress 默认的 lang 为 `en-US`，我们修改一下 config.js：

```typescript
    module.exports = {
    // ...
        locales: {
            '/': {
            lang: 'zh-CN'
        }
        },
        // ...
    }
```

可以发现时间换了一种展示方式：

![](/images/jueJin/f99421395def4c8.png)

8\. 开启目录结构
----------

在原本的主题里，我们发现每篇文章的目录结构出现在左侧：

![](/images/jueJin/490c737554f6494.png)

而 vuepress-theme-reco 将原有的侧边栏的中的多级标题移出，生成子侧边栏，放在了页面的右侧，如果你要全局开启，可在页面 config.js 里设置开启：

```typescript
    module.exports = {
    //...
        themeConfig: {
        subSidebar: 'auto'
    }
    //...
}
```

此时效果如下：

![](/images/jueJin/d7b8756b835445d.png)

9\. 修改主题颜色
----------

VuePress 基于 Vue，所以主题色用的是 Vue 的绿色，然而 TypeScript 的官方色则是蓝色，那如何修改 VuePress 的主题色呢？

你可以创建一个 `.vuepress/styles/palette.styl` 文件，文件代码如下：

```css
$accentColor = #3178c6
```

此时可以发现主题颜色变了：

![](/images/jueJin/52ff3ff66d6e4a6.png)

更多的颜色修改参考 VuePress 的 [palette.styl](https://link.juejin.cn?target=https%3A%2F%2Fvuepress.vuejs.org%2Fzh%2Fconfig%2F%23palette-styl "https://vuepress.vuejs.org/zh/config/#palette-styl")。

10\. 自定义修改样式
------------

如果你想自定义修改一些 DOM 元素的样式呢？就比如在暗黑模式下：

![](/images/jueJin/5c1c043d374d412.png)

我们发现用作强调的文字颜色比较暗淡，在暗黑模式下看不清楚，我想改下这个文字的颜色和背景色呢？

而 VuePress 提供了一种添加额外样式的简便方法。你可以创建一个 `.vuepress/styles/index.styl` 文件。这是一个 Stylus 文件，但你也可以使用正常的 CSS 语法。

我们在 .vupress 文件夹下创建这个目录，然后创建 index.styl 文件，代码如下：

```css
// 通过检查，查看元素样式声明
    .dark .content__default code {
    background-color: rgba(58,58,92,0.7);
    color: #fff;
}
```

此时文字就清晰了很多：

![](/images/jueJin/103150f5b3304fa.png)

那之前我们提到的隐藏每篇文章的标题、作者、时间呢，其实也是类似的方式：

```css
    .page .page-title {
    display: none;
}
```

最后的效果如下：

![](/images/jueJin/098e5ac4eb4e482.png)

11\. 部署
-------

我们的博客就算是正式的做好了，接下来我们部署到免费的 Github Pages 上。我们在 Github 上新建一个仓库，这里我取得仓库名为：`learn-typescript`。

![](/images/jueJin/f4a36b05dd35436.png)

对应，我们需要在 `config.js` 添加一个 `base` 路径配置：

```typescript
    module.exports = {
    // 路径名为 "/<REPO>/"
    base: '/learn-typescript/',
    //...
}
```

最终的 `config.js` 文件内容为：

```typescript
    module.exports = {
    title: 'TypeScript4 文档',
    description: 'TypeScript4 最新官方文档翻译',
    base: '/learn-typescript/',
    theme: 'reco',
        locales: {
            '/': {
            lang: 'zh-CN'
        }
        },
            themeConfig: {
            // lastUpdated: '上次更新',
            subSidebar: 'auto',
                nav: [
                { text: '首页', link: '/' },
                    {
                    text: '冴羽的 JavaScript 博客',
                        items: [
                        { text: 'Github', link: 'https://github.com/mqyqingfeng' },
                    { text: '掘金', link: 'https://juejin.cn/user/712139234359182/posts' }
                ]
            }
            ],
                sidebar: [
                    {
                    title: '欢迎学习',
                    path: '/',
                    collapsable: false,
                        children: [
                    { title: "学前必读", path: "/" }
                ]
                },
                    {
                    title: "基础学习",
                    path: '/handbook/ConditionalTypes',
                    collapsable: false,
                        children: [
                        { title: "条件类型", path: "/handbook/ConditionalTypes" },
                    { title: "泛型", path: "/handbook/Generics" }
                    ],
                }
            ]
        }
    }
```

然后我们在项目 `vuepress-starter` 目录下建立一个脚本文件：`deploy.sh`，注意修改一下对应的用户名和仓库名：

```shell
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:mqyqingfeng/learn-typescript.git master:gh-pages

cd -
```

然后命令行切换到 `vuepress-starter` 目录下，执行 `sh deploy.sh`，就会开始构建，然后提交到远程仓库，注意这里提交到了 `gh-pages` 分支，我们查看下对应仓库分支的代码：

![](/images/jueJin/0f81f99d610642a.png)

我们可以在仓库的 `Settings -> Pages` 中看到最后的地址：

![](/images/jueJin/d440a8b31a40451.png)

像我最后生成的地址就是 [mqyqingfeng.github.io/learn-types…](https://link.juejin.cn?target=https%3A%2F%2Fmqyqingfeng.github.io%2Flearn-typescript%2F "https://mqyqingfeng.github.io/learn-typescript/")

至此，我们完成了 VuePress 和 Github Pages 的部署。

系列文章
----

系列文章目录地址：[github.com/mqyqingfeng…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog "https://github.com/mqyqingfeng/Blog")

微信：「mqyqingfeng」，加我进冴羽唯一的读者群。

如果有错误或者不严谨的地方，请务必给予指正，十分感谢。如果喜欢或者 有所启发，欢迎 star，对作者也是一种鼓励。