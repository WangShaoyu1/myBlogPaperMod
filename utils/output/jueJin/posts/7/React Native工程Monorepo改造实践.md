---
author: ""
title: "React Native工程Monorepo改造实践"
date: 2022-12-16
description: "目前云音乐内有多个RN收银台场景分布在不同的工程，比如页面收银台，浮层收银台，个性收银台等，后续可能还会有别的收银台场景。本文主要介绍对云音乐RN收银台进行monorepo改造的一些实践经验。"
tags: ["前端","React Native中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:45,comments:6,collects:53,views:4672,"
---
> 图片来自：[unsplash.com](https://link.juejin.cn?target=https%3A%2F%2Funsplash.com "https://unsplash.com") 本文作者： ddx

背景
--

目前云音乐内有多个RN收银台场景分布在不同的工程，比如页面收银台，浮层收银台，个性收银台等，后续可能还会有别的收银台场景。

那在开发过程中存在的问题就是每个收银台的核心逻辑如商品展示、支付方式展示、下单购买等逻辑都大致相同，而每次有修改或者新增需求的时候都需要开发多次，重复代码较多效率低下。

虽然可以通过发npm包的形式复用代码，但是有些组件和代码块不太好抽成包，还会带来调试麻烦，发版等问题。所以为了提高代码复用，提高开发效率，我们希望能够在一个仓库内包含多个工程，也就是Monorepo形式。

Monorepo
--------

### 什么是Monorepo

Monorepo是一种将多个项目的代码集中在同一个仓库中的软件开发策略，与之对立的是传统的MultiRepo策略，即每个项目在一个单独的仓库进行管理。 ![Monorepo vs MultiRepo](/images/jueJin/5cf40cad6887b8a.png) 目前像社区内一些著名的开源项目Babel、React和Vue等都是用这种策略来管理代码。

### Monorepo解决的问题

要想知道Monorepo解决了哪些问题与其优势，我们先来看下MultiRepo存在的问题。

当我们在MultiRepo下两个工程之前需要复用一些代码时，往往会采用抽成npm包的形式。但当npm包有改动时我们需要做以下事情：

1.  修改npm包代码，通过npm link与两个工程调试
2.  调试完成后发布新版本
3.  两个工程升级npm包新版本，再进行发布

整个流程可以看出还是比较繁琐的，那如果是在Monorepo下我们可以将公共部分抽成一个workspace，我们的两个工程分别也是workspace可以直接引用公共workspace的代码，工具会帮我们管理这些依赖关系，开发过程中调试起来也非常方便，而且不涉及到发包，版本依赖等，公共部分代码改动完成后两个工程部署即可。

从上述可以看出Monorepo主要有**代码复用容易**、**调试方便**和**简化依赖管理**等优点，这也是我们选择这个方案的原因。

当然Monorepo也有一些缺点，比如：仓库体积大、工程权限不好控制等。所以不管是Monorepo还是MultiRepo都不是完美的方案，只要能解决当下的问题就是好方案。

### Monorepo的工具

目前业界最常见的实现monorepo工具和方案有lerna、yarn workspace和pnpm等。

#### Lerna

lerna是一个通过使用git和npm来优化多包仓库管理工作流的工具，多用于多个npm包相互依赖的大型前端工程，提供了许多CLI命令帮助开发者简化从npm开发，调试到发版的整个流程。但是目前已官宣停止维护。

#### Pnpm

pnpm是一个新型的依赖包管理工具，并支持workspace功能，它的优势主要是通过全局存储和硬链接来来磁盘空间并提升安装速度，通过软链接来解决幻影依赖问题。但是RN的构建工具metro对于符号链接的解析还存在问题需要改造，成本较大。

#### Yarn workspace

yarn workspace是yarn提供的Menorepo依赖管理机制，是一个底层的工具，用于在仓库根目录下管理多个package的依赖，天然支持hoist功能，安装依赖时会将packages中相同的依赖提升到根目录，减少重复依赖安装。workspace之间的引用在依赖安装时通过yarn link建立软链，代码修改时可以在依赖其的workspace中实时生效，调试方便。

通常业界主流方案是lerna + yarn worksapce，lerna负责发布和版本升级，yarn workspace负责依赖管理。因为我们的RN工程是页面工程，不涉及到发npm包，而且需要依赖提升的功能（这个后面会说到），所以最终采用yarn worspace方案。

Metro
-----

在工程改造之前，我们先了解下ReactNative的构建工具Metro。

Metro在构建过程中主要会经历三个阶段：

1.  Resolution：此阶段Metro会从入口文件出发分析所依赖的模块生成一个所有模块的依赖图，主要是使用jest-haste-map这个包做依赖分析。这个阶段和Transformation阶段是并行的；
2.  Transformation：此阶段主要是将模块代码转换成目标平台可识别的格式；
3.  Serialization：此阶段主要是将Transform后的模块进行序列化，然后组合这些模块生成一个或多个Bundle

jest-haste-map是单元测试框架Jest的其中一个包，主要用来获取监听的所有文件及其依赖关系。

工程改造
----

接下来就是对工程的改造，首先我们将两个RN工程放在一个工程下，并按照yarn workspace的方式进行配置，然后通过脚手架（这里使用的是公司内部自研的脚手架）分别创建app-a和app-b两个RN工程，如下所示

```markdown
rn-mono
|-- apps
|-- app-a
|-- app-b
|-- package.json
``````json
// package.json
    {
    ...
        "workspaces": {
            "packages": [
            "apps/*"
        ]
        },
        "private": true
    }
```

接着我们运行

```bash
yarn install
```

发现packages中相同的依赖都会安装在根目录下的node\_modules中，接着我们用如下启动app-a或app-b

```bash
yarn workspace app-a run dev
```

这时如果你的app-a工程中的dev启动命令是用相对路径的方式可能会出现命令找不到的情况，比如

```json
// app-a/package.json
    {
    // 这里的react-native是安装在了根目录，所以会找不到命令，需要修改下路径
        "script": {
        "dev": "node ./node_modules/react-native/local-cli/cli.js start"
    }
}
```

那如果是调用`./node_modules/.bin`中的命令则不需要，因为在安装依赖的时候packages中`.bin`中的命令会有个软链指向根目录下`./node_modules/.bin`中的命令。启动成功后，这时打开页面会报如下错误：

![Untitled](/images/jueJin/b4565e7a29f2a77.png)

这是因为jest-haste-map在做依赖分析时通过metro.config.js中的watcherFolders配置项来指定需要监听变化的文件目录。

![Untitled](/images/jueJin/fe1456ed026d5f4.png)

watcherFolders默认值为工程根目录，此时也就是app-a中目录，但是我们的模块都是安装在根目录下，所以会找不到。我们需要修改下metro.config.js中watcherFolders

```jsx
// app-a/metro.config.js

const path = require('path');

    module.exports = {
    watchFolders: [path.resolve(__dirname, '../../node_modules')],
    };
```

修改完成后我们重新启动，再打开页面后发现已经可以正常打开了，同样的方式app-b也可以正常运行。

但是我们对工程进行monorepo改造的目的是为了抽离公共组件，复用代码。所以我们在根目录下建立个common的文件夹来存放公共部分，此时根目录下的pacage.json中的packages和apps里每个app的metro.config.js中watchFolder配置都需要加入common

```markdown
rn-mono
|-- common
|-- package.json
|-- apps
|-- app-a
|-- app-b
|-- package.json

``````json
// package.json
    {
    ...
        "workspaces": {
            "packages": [
            "apps/*",
            "common"
            ],
            },
            "private": true
        }
        
        // apps/app-a/metro.config.js
        const path = require('path');
        
            module.exports = {
            watchFolders: [path.resolve(__dirname, '../../node_modules'), path.resolve(__dirname, '../../common')],
            };
```

接着在common中添加个Button组件，package.json中添加相应的依赖，版本要和apps中对应依赖的版本保持一致

```json
    {
    ...
        "dependencies": {
        "react": "16.8.6",
        "react-native": "0.60.5",
        },
    }
```

然后yarn install重新安装下，这时在根目录的node\_modules下就可以看到common模块软链到了common目录，所以在app-a中引入common时就可以像npm包一样直接引入，同样app-b也可以。

```javascript
import common from 'common';
```

到这里我们RN工程的monorepo改造也基本完成了。

### 依赖提升

这里解释下为什么需要依赖提升。

我们先来看下取消依赖提升会有什么问题，可以在根目录中的package.json中nohoist配置来指定不需要提升安装到根目录的模块

```json

    {
    ...
        "workspaces": {
            "packages": [
            "apps/*",
            "common"
            ],
            "nohoist": ["**react**"],
            },
            "private": true
        }
```

然后重新yarn install，启动app-a后会发现报如下错误

![Untitled](/images/jueJin/517890ca055f253.png)

这是因为有些模块jest-haste-map在做依赖分析生成dependency graph时发现在两个不同的目录下会产生命名冲突，导致报错。所以我们需要依赖提升，将所用到的相同依赖安装到根目录，这样只会安装一次。

### 相同依赖的版本保持一致

虽然有了依赖提升但如果每个packages中相同依赖的版本不一致，同样会导致相同的依赖会安装多次的情况出现，根目录和对应的package中都会有。这种情况除了会产生以上问题外还有可能产生其他潜在的问题，比如依赖客户端的第三方模块，如果存在多个版本在bundle执行时会多次注册组件导致组件注册失败，在调用时会发生找不到组件的报错。

虽然可以在metro中配置blacklistRE和extraNodeModules来表明要读取哪个位置的依赖，但是这种方式并不通用，每次在引入新的依赖时都要去配置下较为繁琐。所以我们需要将每个packages中的依赖版本保持一致。

人为的去约定这个规则肯定是不安全的，可以开发一个依赖版本的lint检测工具，在提交代码的时候做强制性的检测。

我们最终的方案是开发一个检测脚本结合gitlab-ci在分支代码push的时候检测，未通过则不允许push代码来避免风险。

```jsx
// .gitlab-ci.yml
test-dev-version:
stage: test
before_script:
- npm install --registry http://rnpm.hz.netease.com
script:
- npm run depVerLint
only:
changes:
- "package.json"
- "packages/**/package.json"
```

![Untitled](/images/jueJin/063d2f6728dfd67.png)

### 工程迁移过渡

如果是将多个正在快速迭代的工程迁移到一个Monorepo仓库时，肯定会遇到存量开发分支代码同步问题。比如我们要将工程A迁移到新仓库，如果我们只是基于master分支将代码copy到新工程，并在改造开发过程中还有组内其他同学也在基于master拉取分支做开发，并在你改造完成前开发完成合并到了master，此时你新工程的代码是落后的，要想同步只能手动copy改动的代码，很容易出错。为了解决这个问题我们可以使用git subtree。 git subtree允许将一个仓库作为子仓库嵌套在另一个仓库里，所以这里我们可以将工程A作为一个子工程添加到Monorepo新工程对应的packages目录下，如果有更新可以直接使用pull进行同步。

```bash
# 添加
git subtree add --prefix=apps/app-a https://github.com/xxxx/app-a.git master --squash

# 更新
git subtree pull --prefix=apps/app-a https://github.com/xxxx/app-a.git master --squash
```

对于新工程或者新的开发分支就可以直接此工程下进行开发了。

### 构建

由于我们的构建机还不支持yarn，所以直接使用yarn workspace的命令是有问题的。目前的做法是将yarn作为devDependency，然后在根目录下创建个脚本文件，将每个package的构建命令收敛在一起。结合yarn workspace的命令，这样只需要在构建时传入不同的package name即可。

```bash
## scripts/build.sh

PLATFORM=$1
PROJECT=$2
EXEC_PARAMS=${@:2}
YARN="${PWD}/node_modules/.bin/yarn"

...

echo "start yarn install"
${YARN} cache clean
${YARN} install

echo "start build"
echo "${YARN} workspace ${PROJECT} run build:${PLATFORM} ${EXEC_PARAMS}"
${YARN} workspace ${PROJECT} run build:${PLATFORM} ${EXEC_PARAMS}
``````json
// package.json
    {
    ...
        "workspaces": {
            "packages": [
            "apps/*"
            ],
            },
            "private": true,
                "scripts": {
                "build": "./script/build.sh"
                },
            }
```

比如对app-a进行构建，就可以

```bash

npm run build ios app-a

## 实际上执行的是yarn workspace app-a run build:ios
```

总结
--

至此对React Native工程的menorepo改造基本完成了，对于多个功能类似的工程采用Monorepo的管理方式确实会方便代码复用和调试，提高我们的开发效率。如果公司内部其余场景有类似的需求，未来规划可以将其沉淀出一个脚手架。

目前对于h5工程的Monorepo方案已经较为成熟了，但是对RN工程来说由于构建机制不同无法完全适用，可参考的资料也较少。本文也是通过实践记录了一些踩坑经验，如果你有更好的实践，欢迎留言一起讨论。

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！