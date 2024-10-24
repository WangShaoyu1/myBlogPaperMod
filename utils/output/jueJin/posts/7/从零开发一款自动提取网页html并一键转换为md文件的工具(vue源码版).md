---
author: "徐小夕"
title: "从零开发一款自动提取网页html并一键转换为md文件的工具(vue源码版)"
date: 2021-03-06
description: "我们都知道程序员最爱的写博客的“语言”就是makedown, 并且目前大部分的技术社区都支持makedown语法, 所以说只要有makedown, 我们就能快速的同步到不同的技术平台 也许有人会说, 我们写博客直接用makedown语法写不就好了? 的确这样做可以满足需求, …"
tags: ["Node.js","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:46,comments:4,collects:68,views:2386,"
---
![](/images/jueJin/1e8e87c3ce3d42b.png)

最近几年涌现出了很多技术博客和技术社区, 也有很多技术同仁开始打造自己的博客, 我们可以把自己的博客同步到不同的技术平台, 但是随着技术平台的增多, 我们文章同步所花费的时间会越来越多, 那么有没有一个工具能快速的将博客发布到不同的平台呢? 或者有没有一个工具, 可以把`html`直接转化为技术平台能够识别的“语言”直接发布呢?

我们都知道程序员最爱的写博客的“语言”就是`makedown`, 并且目前大部分的技术社区都支持`makedown`语法, 所以说只要有`makedown`, 我们就能快速的同步到不同的技术平台.

也许有人会说, 我们写博客直接用`makedown`语法写不就好了? 的确这样做可以满足需求, 但缺点就是我们本地必须要保存一份`makedown`文件, 如果博客内容涉及到图片, 我们还需要维护一个`img`目录, 这样每次在不同技术社区发布文章还是会很麻烦, 所以综上我们开发了一款自动爬取html内容并一键转换为`makedown`的工具, 这样我们就可以“肆无忌惮的”发布博客了.

你将收获
----

*   `turndown`的使用技巧
*   `vue + nuxt`项目开发方式
*   `nodejs`爬虫相关应用

`github`地址笔者将在文末附上, 感兴趣的朋友可以一起共建, 学习和探索.

效果演示
----

![](/images/jueJin/bd19f827d7504dd.png)

客户端
---

### 思路

先理一下思路：  

*   输入一个链接地址
*   获取服务端返回的 `html` 串
*   将 `html` 串 转换为 `md` 串
*   同步显示预览到编辑器中

![](/images/jueJin/b0eb97eec64a4a0.png)

### 为什么选择 `turndown`

客户端最重要的一步是 `html` 转 `md`，这里我们使用的 [turndown](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdomchristie%2Fturndown "https://github.com/domchristie/turndown")。  
为什么使用 `turndown` 呢，原因如下：  

*   Talk is cheap, Show me the code. 做技术文章很关键的一个功能是 `代码块`，没有代码的文章是没有灵魂的。比较过几个 `html2md` 插件，`turndown` 的代码块显示效果和兼容性最好。
*   `turndown` 也支持自定义规则，灵活可变，可自定义各种语法标签和匹配规则。
*   `turndown` 还支持第三方插件 `turndown-plugin-gfm`，支持集成 `GFM`（`MD` 的超集 `GitHub Flavored Markdown`）、`table`、`strikethrough`等语法。

### 具体实现

```js
// 引入第三方插件
import { gfm, tables, strikethrough } from 'turndown-plugin-gfm'

const turndownService = new TurndownService({ codeBlockStyle: 'fenced' })
// Use the gfm plugin
turndownService.use(gfm)

// Use the table and strikethrough plugins only
turndownService.use([tables, strikethrough])

/**
* 自定义配置（rule名不能重复）
* 这里我们指定 `pre` 标签为代码块，并在代码块的前后加个换行，防止显示异常
*/
    turndownService.addRule('pre2Code', {
    filter: ['pre'],
        replacement (content) {
        return '```\n' + content + '\n```'
    }
    })
```

### 额外功能

支持自动获取链接文章标题，无需手动去原文复制。

服务端
---

这里我们使用的服务端是 `node.js`，用前端的框架写服务端，体验杠杠的。

### 思路

先理一下思路：

*   获取前端传递的链接地址
*   通过请求获取 `html` 串
*   根据不同平台域名获取不同的 `dom`
*   转换图片和链接的相对路径为绝对路径
*   `html` 底部添加转载来源声明
*   获取文章的标题 `title`
*   返回 `title` 和 `html` 给前端

![](/images/jueJin/4135b114268c4cc.png)

### 具体实现

1.  #### 获取前端传递的链接地址
    
    这里直接使用 `node` 的自带语法，我们采用的是 `get` 形式传递，用 `query` 即可
    
    ```js
    const qUrl = req.query.url
    ```
2.  #### 通过请求获取 `html` 串
    
    这里我们是用 `request` 进行请求
    
    ```js
        request({
        url: qUrl
            }, (error, response, body) => {
                if (error) {
                res.status(404).send('Url Error')
                return
            }
            // 这里的 body 就是文章的 `html`
            console.log(body)
            })
    ```
3.  #### 根据不同平台域名获取不同的 `dom`
    
    由于技术平台众多，每个平台的文章内容标签、样式名或 id 会有差异，需要针对兼容。
    
    首先先用 `js-dom` 去模拟操作 `dom`，封装一个方法
    
    ```js
    /**
    * 获取准确的文章内容
    * @param {string} html html串
    * @param {string} selector css选择器
    * @return {string} htmlContent
    */
        const getDom = (html, selector) => {
        const dom = new JSDOM(html)
        const htmlContent = dom.window.document.querySelector(selector)
        return htmlContent
    }
    ```
    
    兼容不同的平台，应用不同的 css 选择器
    
    ```js
    // 比如掘金，内容块的样式名为 .markdown-body，内容里会有 style 标签样式和一些多余的复制代码文字，通过原生 dom 操作删掉
        if (qUrl.includes('juejin.cn')) {
        const htmlContent = getBySelector('.markdown-body')
        const extraDom = htmlContent.querySelector('style')
        const extraDomArr = htmlContent.querySelectorAll('.copy-code-btn')
        extraDom && extraDom.remove()
        extraDomArr.length > 0 && extraDomArr.forEach((v) => { v.remove() })
        return htmlContent
    }
    
    // 再比如 oschina，内容块的样式名为 .article-detail，内容里会有多余的 .ad-wrap 内容，照样删掉
        if (qUrl.includes('oschina.net')) {
        const htmlContent = getBySelector('.article-detail')
        const extraDom = htmlContent.querySelector('.ad-wrap')
        extraDom && extraDom.remove()
        return htmlContent
    }
    
    // 最后匹配通用标签。优先适配 article 标签，没有再用 body 标签
    const htmlArticle = getBySelector('article')
    if (htmlArticle) { return htmlArticle }
    
    const htmlBody = getBySelector('body')
    if (htmlBody) { return htmlBody }
    ```
4.  #### 转换图片和链接的相对路径为绝对路径，方便以后查找源路径
    
    ```js
    // 通过原生api - URL 获取链接的源域名
    const qOrigin = new URL(qUrl).origin || ''
    
    // 获取图片、链接的绝对路径。通过 URL 将 `路径+源域名` 转换为绝对路径，不熟悉的同学请自行了解
    const getAbsoluteUrl = p => new URL(p, qOrigin).href
    
    // 转换图片、链接的相对路径，不同平台的图片懒加载属性名不一样，需要做特定兼容
        const changeRelativeUrl = (dom) => {
    if (!dom) { return '<div>内容出错~</div>' }
    const copyDom = dom
    // 获取所有图片
    const imgs = copyDom.querySelectorAll('img')
    // 获取所有链接
    const links = copyDom.querySelectorAll('a')
    // 替换完所有路径返回新 dom
        imgs.length > 0 && imgs.forEach((v) => {
        /**
        * 处理懒加载路径
        * 简书：data-original-src
        * 掘金：data-src
        * segmentfault：data-src
        */
        const src = v.src || v.getAttribute('data-src') || v.getAttribute('data-original-src') || ''
        v.src = getAbsoluteUrl(src)
        })
            links.length > 0 && links.forEach((v) => {
            const href = v.href || qUrl
            v.href = getAbsoluteUrl(href)
            })
            return copyDom
        }
        
        // 在获取不同平台的文章内容 getBody 方法里，应用 changeRelativeUrl 方法
            const getBody = (content) => {
            ...
            ...
            return changeRelativeUrl(htmlContent)
        }
    ```
5.  #### 底部添加转载来源声明，以防侵权
    
    这个就不多做解释了，很简单。
    
    ```js
    // 底部添加转载来源声明
        const addOriginText = (dom) => {
        const html = dom.innerHTML
        const resHtml = html + `<br/><div>本文转自 <a href="${qUrl}" target="_blank">${qUrl}</a>，如有侵权，请联系删除。</div>`
        return resHtml
    }
    
    // 在获取不同平台的文章内容 getBody 方法里，应用 addOriginText 方法
        const getBody = (content) => {
        ...
        ...
        return addOriginText(changeRelativeUrl(htmlContent))
    }
    ```
6.  #### 获取文章的标题 `title`
    
    ```js
    // 获取文章的 title
        const getTitle = (content) => {
        const title = getDom(content, 'title')
    if (title) { return title.textContent }
    return '获取标题失败~'
    }
    ```
7.  #### 返回 `title` 和 `html` 给前端
    
    ```js
        request({
        url: qUrl,
    headers: {}
        }, (error, response, body) => {
            if (error) {
            res.status(404).send('Url Error')
            return
        }
        // 设置 json 响应类型
        res.type('text/json')
            const json = {
            code: 1,
            title: getTitle(body),
            html: getBody(body)
        }
        res.status(200).send(json)
        })
    ```

### 实际应用

这个开源工具的应用场景非常广泛, 我们几乎可以将任何网页链接转换为`md`内容, 同步到自己的博客或者内容管理平台, 但是大家需要有版权意识, 做一个遵纪守法的好“网民”.

### 支持环境

现代浏览器及 IE11。

[![IE / Edge](/images/jueJin/ae17c83f426b471.png)](https://link.juejin.cn?target=http%3A%2F%2Fgodban.github.io%2Fbrowsers-support-badges%2F "http://godban.github.io/browsers-support-badges/")  
IE / Edge

[![Firefox](/images/jueJin/c228c5683bdd470.png)](https://link.juejin.cn?target=http%3A%2F%2Fgodban.github.io%2Fbrowsers-support-badges%2F "http://godban.github.io/browsers-support-badges/")  
Firefox

[![Chrome](/images/jueJin/09bf610640394f9.png)](https://link.juejin.cn?target=http%3A%2F%2Fgodban.github.io%2Fbrowsers-support-badges%2F "http://godban.github.io/browsers-support-badges/")  
Chrome

[![Safari](/images/jueJin/e4cee049ec904ef.png)](https://link.juejin.cn?target=http%3A%2F%2Fgodban.github.io%2Fbrowsers-support-badges%2F "http://godban.github.io/browsers-support-badges/")  
Safari

[![Opera](/images/jueJin/9febc3c1be3a4ba.png)](https://link.juejin.cn?target=http%3A%2F%2Fgodban.github.io%2Fbrowsers-support-badges%2F "http://godban.github.io/browsers-support-badges/")  
Opera

IE11, Edge

last 2 versions

last 2 versions

last 2 versions

last 2 versions

### 参与贡献

我们非常欢迎你的贡献，你可以通过以下方式和我们一起共建 😃

*   通过 [Issue](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhelloworld-Co%2Fhtml2md%2Fissues "https://github.com/helloworld-Co/html2md/issues") 报告 bug。
*   提交 [Pull Request](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhelloworld-Co%2Fhtml2md%2Fpulls "https://github.com/helloworld-Co/html2md/pulls") 一起改进。
*   github地址: [传送门](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhelloworld-Co%2Fhtml2md "https://github.com/helloworld-Co/html2md")