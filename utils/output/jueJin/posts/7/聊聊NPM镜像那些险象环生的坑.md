---
author: "JowayYoung"
title: "聊聊NPM镜像那些险象环生的坑"
date: 2020-06-16
description: "由于国内网络环境的原因，在执行npm i安装项目依赖过程中，肯定会遇上安装过慢或安装失败的情况。有经验的同学通常会在安装完Node时顺便把NPM镜像设置成国内的淘宝镜像。 这样就能爽歪歪应付大部分npm i的安装情况了。当然，这只是解决了大部分的安装过慢或安装失败的情况，随着项…"
tags: ["Node.js","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:87,comments:0,collects:105,views:7931,"
---
> 作者：[JowayYoung](https://link.juejin.cn?target=)  
> 仓库：[Github](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FJowayYoung "https://github.com/JowayYoung")、[CodePen](https://link.juejin.cn?target=https%3A%2F%2Fcodepen.io%2FJowayYoung "https://codepen.io/JowayYoung")  
> 博客：[官网](https://link.juejin.cn?target=https%3A%2F%2Fyangzw.vip "https://yangzw.vip")、[掘金](https://juejin.cn/user/2330620350432110 "https://juejin.cn/user/2330620350432110")、[思否](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fblog%2Fjowayyoung "https://segmentfault.com/blog/jowayyoung")、[知乎](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fc_1169597485852360704 "https://zhuanlan.zhihu.com/c_1169597485852360704")  
> 公众号：[IQ前端](https://link.juejin.cn?target=https%3A%2F%2Fp3-juejin.byteimg.com%2Ftos-cn-i-k3u1fbpfcp%2Fe4277a52fe0f4a86a84a6c739c2b3276~tplv-k3u1fbpfcp-zoom-1.image "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4277a52fe0f4a86a84a6c739c2b3276~tplv-k3u1fbpfcp-zoom-1.image")  
> 特别声明：原创不易，未经授权不得转载或抄袭，如需转载可联系笔者授权

### 前言

由于国内网络环境的原因，在执行`npm i`安装项目依赖过程中，肯定会遇上`安装过慢`或`安装失败`的情况。有经验的同学通常会在安装完**Node**时顺便把**NPM镜像**设置成国内的淘宝镜像。

```sh
npm config set registry https://registry.npm.taobao.org/
```

这样就能爽歪歪应付大部分`npm i`的安装情况了。当然，这只是解决了大部分的`安装过慢`或`安装失败`的情况，随着项目的深入开发，肯定还会遇上一些比较奇葩的情况，这也是笔者为什么要写本文的原因。

### 管理镜像

你还可能会遇上这种情况，开发项目时使用`淘宝镜像`，但是发布**NPM第三方模块**时就必须使用`原镜像`了。在着手解决那些奇葩情况前，先推荐大家使用一个**NPM镜像管理工具**。

*   **原镜像**：`https://registry.npmjs.org/`
*   **淘宝镜像**：`https://registry.npm.taobao.org/`

主角就是`nrm`，它是一个可随时随地自由切换**NPM镜像**的管理工具。有了它，上面所说的何时使用什么镜像的问题就迎刃而解了。下面对其进行安装并简单讲解如何使用。

> 安装

```sh
npm i -g nrm
```

> 查看镜像

```sh
nrm ls
```

> 增加镜像

```sh
nrm add <name> <url>
```

> 移除镜像

```sh
nrm del <name>
```

> 测试镜像

```sh
nrm test <name>
```

> 使用镜像

```sh
nrm use <name>
```

> 查看当前镜像

```sh
nrm current
```

熟悉命令后一波操作如下，`原镜像`和`淘宝镜像`之间随意切换。当然，如果你记性好也不需要用这个工具了，哈哈。

![nrm操作](/images/jueJin/bd257ff6354b4f2.png)

### 遇坑填坑

有了`nrm`切换到淘宝镜像上，安装速度会明显加快，但是遇上安装的模块依赖了`C++模块`那就坑爹了。在安装过程中会隐式安装`node-gyp`，`node-gyp`可编译这些依赖`C++模块`的模块。

那么问题来了，`node-gyp`在首次编译时会依赖`Node源码`，所以又悄悄去下载`Node`。虽然在前面已设置了`淘宝镜像`，但是在这里一点卵用都没有。这样又因为国内网络环境的原因，再次遇上`安装过慢`或`安装失败`的情况。

还好`npm config`提供了一个参数`disturl`，它可设置Node镜像地址，当然还是将其指向国内的淘宝镜像。这样又能爽歪歪安装这些依赖`C++模块`的模块了。

```sh
npm config set disturl https://npm.taobao.org/mirrors/node/
```

问题一步一步解决，接下来又出现另一个问题。平常大家都会使用`node-sass`作为项目开发依赖，但是`node-sass`的安装一直都是一个令人头疼的问题。

安装`node-sass`时，在`install阶段`会从Github上下载一个叫`binding.node`的文件，而**GitHub Releases**里的文件都托管在`s3.amazonaws.com`上，这个网址被Q了，所以又安装不了。

然而办法总比困难多，从`node-sass`的官方文档中可找到一个叫`sass_binary_site`的参数，它可设置Sass镜像地址，毫无疑问还是将其指向国内的淘宝镜像。这样又能爽歪歪安装`node-sass`了。

```sh
npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
```

其实还有好几个类似的模块，为了方便，笔者还是把它们源码里的`镜像参数`和淘宝镜像里对应的`镜像地址`扒出来，统一设置方便安装。以下是笔者常用的几个模块镜像地址配置，请收下！

分别是：`Sass`、`Sharp`、`Electron`、`Puppeteer`、`Phantom`、`Sentry`、`Sqlite`、`Python`。

> 镜像地址配置

`npm config set <name> <url>`，赶紧**一键复制，永久使用**。特别注意，别漏了最后面的`/`。

```sh
npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
npm config set sharp_dist_base_url https://npm.taobao.org/mirrors/sharp-libvips/
npm config set electron_mirror https://npm.taobao.org/mirrors/electron/
npm config set puppeteer_download_host https://npm.taobao.org/mirrors/
npm config set phantomjs_cdnurl https://npm.taobao.org/mirrors/phantomjs/
npm config set sentrycli_cdnurl https://npm.taobao.org/mirrors/sentry-cli/
npm config set sqlite3_binary_site https://npm.taobao.org/mirrors/sqlite3/
npm config set python_mirror https://npm.taobao.org/mirrors/python/
```

有了这波操作，再执行`npm i`安装以上模块时就能享受国内的速度了。如果有条件，建议把这些镜像文件搬到自己或公司的服务器上，将`镜像地址`指向自己的服务器即可。在公司内网搭建一个这样的镜像服务器，一直安装一直爽，目前笔者所在的团队就是如此处理。

```sh
npm config set electron_mirror https://xyz/mirrors/electron/
```

### 源码分析

以经常卡住的`node-sass`为例，下面是坑爹货`node-sass/lib/extensions.js`的[源码部分](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsass%2Fnode-sass%2Fblob%2Fmaster%2Flib%2Fextensions.js%23L242 "https://github.com/sass/node-sass/blob/master/lib/extensions.js#L242")，可看出它会默认走**GitHub Releases**的托管地址，上面也分析过原因，在这里就不重复了。

```js
    function getBinaryUrl() {
    const site = getArgument("--sass-binary-site")
    || process.env.SASS_BINARY_SITE
    || process.env.npm_config_sass_binary_site
    || (pkg.nodeSassConfig && pkg.nodeSassConfig.binarySite)
    || "https://github.com/sass/node-sass/releases/download";
    const result = [site, "v" + pkg.version, getBinaryName()].join("/");
    return result;
}
```

而其他模块也有类似的代码，例如`puppeteer`这个安装`Chronium`的[源码部分](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fpuppeteer%2Fpuppeteer%2Fblob%2Fmaster%2Finstall.js%23L36 "https://github.com/puppeteer/puppeteer/blob/master/install.js#L36")，有兴趣的同学都去扒一下源码，如出一辙。

```js
    async function download() {
    await compileTypeScriptIfRequired();
    const downloadHost =
    process.env.PUPPETEER_DOWNLOAD_HOST
    || process.env.npm_config_puppeteer_download_host
    || process.env.npm_package_config_puppeteer_download_host;
    const puppeteer = require("./index");
    const product =
    process.env.PUPPETEER_PRODUCT
    || process.env.npm_config_puppeteer_product
    || process.env.npm_package_config_puppeteer_product
    || "chrome";
        const browserFetcher = puppeteer.createBrowserFetcher({
        product,
        host: downloadHost,
        });
        const revision = await getRevision();
        await fetchBinary(revision);
        // 还有很多
    }
```

### 坑货小结

由于`node-sass`是大家经常使用的项目开发依赖，也是安装时间较长和最常见到报错的模块，在这里笔者就花点篇章分析和解决下可能会遇到的问题。

`node-sass`安装失败的原因其实并不止上面提到的情况，我们可从安装过程中分析并获取突破口来解决问题。根据`npm i node-sass`的输出信息来分析，可得到下面的过程。

*   检测项目`node_modules`的`node-sass`是否存在且当前安装版本是否一致
    *   **Yes**：跳过，完成安装过程
    *   **No**：进入下一步
*   从**NPM**上下载`node-sass`
*   检测`全局缓存`或`项目缓存`中是否存在`binding.node`
    *   **Yes**：跳过，完成安装过程
    *   **No**：进入下一步
*   从**Github Releases**上下载`binding.node`并将其缓存到全局
    *   **Success**：将版本信息写入`package-lock.json`
    *   **Error**：进入下一步
*   尝试本地编译出`binding.node`
    *   **Success**：将版本信息写入`package-lock.json`
    *   **Error**：输出错误信息

不难看出，`node-sass`依赖了一个二进制文件`binding.node`，不仅需要从**NPM**上下载`本体`还需要从**Github Releases**上下载`binding.node`。

* * *

从实际情况来看，`node-sass`出现`安装过慢`或`安装失败`的情况可能有以下几种：

> NPM镜像托管在国外服务器

上面有提到，在这里不再叙述，解决办法如下。

```sh
nrm use taobao
```

> 安装过程中悄悄下载`node-gyp`

上面有提到，在这里不再叙述，解决办法如下。

```sh
npm config set disturl https://npm.taobao.org/mirrors/node/
```

> `binding.node`文件托管在国外服务器

上面有提到，在这里不再叙述，解决办法如下。

```sh
npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
```

> Node版本与node-sass版本不兼容

`node-sass`版本兼容性好差，必须与Node版本对应使用才行，详情请参考[node-sass-version-association](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsass%2Fnode-sass%23node-sass "https://github.com/sass/node-sass#node-sass")，复用官方文档的版本对照表，如下。

NodeJS

Minimum node-sass version

Node Module

Node 14

4.14+

83

Node 13

4.13+

79

Node 12

4.12+

72

Node 11

4.10+

67

Node 10

4.9+

64

Node 8

4.5.3+

57

执行`npm i`安装依赖前请确保当前的Node版本和`node-sass`版本已兼容。

> 全局缓存中的binding.node版本与Node版本不兼容

假如本地使用`nvm`或`n`进行Node版本管理，并且已切换了Node版本，在安装过程中可能会出现`Windows/OS X/Linux 64-bit with Node.js 12.x`这样的提示，这种情况也是笔者经常遇上的情况(笔者电脑里安装了30多个Node版本并且经常来回切换😂)。

这是因为`node-sass`版本和Node版本是关联的(看上面的表格)，修改Node版本后在全局缓存中匹配不到对应的`binding.node`文件而导致安装失败。根据错误提示，清理NPM缓存且重新安装即可，解决办法如下。

```sh
npm cache clean -f

npm rebuild node-sass
```

所以没什么事就别来回切换Node版本了，像笔者装这么多Node版本也是逼不得已，老项目太多了😂。

> 安装失败后重新安装

有可能无权限删除已安装的内容，导致重新安装时可能会产生某些问题，建议将`node_modules`全部删除并重新安装。

在Mac系统和Linux系统上删除`node_modules`比较快，但是在Windows系统上删除`node_modules`就比较慢了，推荐大家使用[rimraf](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fisaacs%2Frimraf "https://github.com/isaacs/rimraf")删除`node_modules`，一个Node版的`rm -rf`工具。

```sh
npm i -g rimraf
```

在项目的`package.json`中加入`npm scripts`让`rimraf`常驻。三大操作系统通用，非常推荐使用。

```json
    {
        "scripts": {
        "reinstall": "rimraf node_modules && npm i"
    }
}
```

一有什么`安装失败`、`重新安装`之类的操作，先执行`npm run remove`删除`node_modules`再`npm i`。

```sh
npm run reinstall
```

### 终极总结

如果看得有点乱，那下面直接贴代码操作顺序，建议前端小白在安装完Node后立马处理这些NPM镜像问题，防止后续产生不必要的麻烦(解决这些问题是需要花费时间的😂)。

```sh
# 查看Node版本和NPM版本确认已安装Node环境
node -v
npm -v

# 安装nrm并设置NPM的淘宝镜像
npm i -g nrm
nrm use taobao

# 设置依赖安装过程中内部模块下载Node的淘宝镜像
npm config set disturl https://npm.taobao.org/mirrors/node/

# 设置常用模块的淘宝镜像
npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
npm config set sharp_dist_base_url https://npm.taobao.org/mirrors/sharp-libvips/
npm config set electron_mirror https://npm.taobao.org/mirrors/electron/
npm config set puppeteer_download_host https://npm.taobao.org/mirrors/
npm config set phantomjs_cdnurl https://npm.taobao.org/mirrors/phantomjs/
npm config set sentrycli_cdnurl https://npm.taobao.org/mirrors/sentry-cli/
npm config set sqlite3_binary_site https://npm.taobao.org/mirrors/sqlite3/
npm config set python_mirror https://npm.taobao.org/mirrors/python/
```

针对`node-sass`的情况：

```sh
# 安装rimraf并设置package.json
npm i -g rimraf

# 安装前请确保当前的Node版本和node-sass版本已兼容

# 安装失败
npm cache clean -f
npm rebuild node-sass 或 npm run reinstall
```

`package.json`中加入`npm scripts`：

```json
    {
        "scripts": {
        "reinstall": "rimraf node_modules && npm i"
    }
}
```

### 总结

**NPM镜像问题**的坑确实很多，归根到底还是网络环境导致的。当然这些问题也阻碍不了乐于探索的我们，办法总比困难多，坚持下去始终能找到解决方式。

笔者总结出一个解决这种**NPM镜像问题**的好方法，遇到一些上面没有提到的模块，可尝试通过以下步骤去解决问题。

*   执行`npm i`前设置淘宝镜像，保证安装项目依赖时都走国内网络
*   安装不成功时，肯定是在安装过程中该模块内部又去下载了其他国外服务器的文件
*   在Github上克隆一份该模块的源码进行分析，搜索包含`base、binary、cdn、config、dist、download、host、mirror、npm、site、url`等这样的关键词(自行探索，通常**mirror**的匹配度最高)
*   在搜查结果里查找形态像**镜像地址**的代码块，再分析该代码块的功能并提取最终的**镜像地址**，例如`node-sass`的`sass_binary_site`
*   去淘宝镜像官网、百度、谷歌等网站查找你需要的镜像地址，如果实在找不到就规范上网把国外服务器的镜像文件拉下来搬到自己或公司的服务器上
*   设置模块依赖的镜像地址：`npm config set <registry name> <taobao url / yourself url>`
*   重新执行`npm i`安装项目依赖，大功告成

如果以上内容帮不了你或在解决**NPM镜像问题**上还遇到其他坑，欢迎添加笔者微信一起交流。如有错误地方也欢迎指出，如有更好的解决方法也可提上建议。

另外笔者花了一些时间用Xmind整理了本文内容并生成一张知识点分布图，**浓缩就是精华**。由于图片太大无法上传就保存到公众号里，如有需要可关注`IQ前端`，扫描`文章底部二维码`，后台回复`NPM镜像`获取该图片，希望能帮助到你。

### 结语

**❤️关注+点赞+收藏+评论+转发❤️**，原创不易，鼓励笔者创作更多高质量文章

**关注公众号`IQ前端`，一个专注于CSS/JS开发技巧的前端公众号，更多前端小干货等着你喔**

*   关注后回复`资料`免费领取学习资料
*   关注后回复`进群`拉你进技术交流群
*   欢迎关注`IQ前端`，更多**CSS/JS开发技巧**只在公众号推送

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)