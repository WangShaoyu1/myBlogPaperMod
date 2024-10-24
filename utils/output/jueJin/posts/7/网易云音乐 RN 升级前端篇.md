---
author: "网易云音乐技术团队"
title: "网易云音乐 RN 升级前端篇"
date: 2023-12-27
description: "网易云音乐 RN 升级前端篇：本文将从前端的角度来聊一聊网易云音乐 RN 升级的实践与思考，以及其中一些决策的依据。"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读18分钟"
weight: 1
selfDefined:"likes:44,comments:0,collects:34,views:4955,"
---
> 本文作者：黄喆

![](/images/jueJin/d64fa79e57f54ab.png)

文章《网易云音乐 RN 新架构升级实践》总体介绍了云音乐 RN 在升级过程中遇到的问题及解决方案，本篇文章将会进一步聚焦，讲一讲前端在升级过程中做的一些工作。整个升级过程大致分为四个阶段：调研、方案设计、实施、分流验证。除了分流验证阶段，其余三个阶段前端都深度参与其中，接下来将按照顺序来逐一介绍。

调研
==

凡事预则立，不预则废。好的调研方案，可以明确收益和风险，便于我们评估 ROI，整体收益、风险前文已详细描述，这里不在赘述。 相对于客户端关注底层的一些变化，对前端业务开发来说关注的更多是 API 层面的 break change。因为 break change 会切实影响我们的升级方案，因此需要明确影响范围，并给出具体的解决方案，这样在正式升级时才能做到心中有数。

调研最开始我们使用 [react-native 升级工具](https://link.juejin.cn?target=https%3A%2F%2Freact-native-community.github.io%2Fupgrade-helper "https://react-native-community.github.io/upgrade-helper") 查看需要升级的依赖，比如 babel、react，这里相对简单只给出了最基础的依赖。对于更多的三方依赖、内部组件则需要人肉一个个去筛查出来。

以筛查出来的基础依赖为根基，接着查看 RN 以及所有依赖的 changelog 和 commit 信息，梳理出版本升级全部的 break change，并根据业务使用情况整理出需要重点关注的 break change，并给出解法。当然实际情况远比这复杂，还需要考虑依赖之间的互相依赖情况，以及隐式依赖。由于实际依赖的情况异常复杂，调研是不可能面面具到的，但是调研的越仔细，对于后续的压力愈小，因此我们做了非常详细的调研。下面介绍一些在调研阶段就发现的 break change 及其解法。

Break change
------------

不同的 break change 影响范围不同，兼容方法不同，升级策略也不同。这里介绍几个常用的升级策略，以及其适用的 break change 类型。

### patch-package 打补丁

patch-package是一个用于修补（patch）npm软件包的工具，所谓打补丁是指在不修改原始 npm 包的情况下，对其进行补丁修复。 有些基础能力涉及范围特别广，几乎不可能一个个去改，但是使用起来相对简单，此时就可以用这个方法。 比如官方包移除了 Image.propTypes, Text.propTypes 等一系列 propTypes 总共移除了7个类似的 propTypes 我们调研发现大量的内外部依赖使用了这些能力，包括依赖的依赖，如果一个个修改起来是工作量是非常大的。针对这类问题我们使用 [patch-package](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fpatch-package "https://www.npmjs.com/package/patch-package") 给 react-native 官方包来打补丁。当然不仅限于这些变动，对于一些不方便升级依赖都可以使用此方法打补丁兼容，具体步骤如下

*   按照 patch-package 文档生成模板 patch 文件
    
*   在升级工程目录下创建如下 patch 文件（上一步生成的）
    
    ```diff
    diff --git a/node_modules/react-native/index.js b/node_modules/react-native/index.js
    index d59ba34..1bc8c9d 100644
    --- a/node_modules/react-native/index.js
    +++ b/node_modules/react-native/index.js
        @@ -435,32 +435,16 @@ module.exports = {
        },
        // Deprecated Prop Types
            get ViewPropTypes(): $FlowFixMe {
            -    invariant(
            -      false,
            -      'ViewPropTypes has been removed from React Native. Migrate to ' +
            -        "ViewPropTypes exported from 'deprecated-react-native-prop-types'.",
            -    );
            +    return require('deprecated-react-native-prop-types').ViewPropTypes;
            },
            };
            ...
    ```
*   项目依赖增加包 deprecated-react-native-prop-types
    
*   工程脚本增加 npm hook `"postinstall": "npx patch-package"`
    

### 写法兼容

所谓写法兼容，是指通过判断属性、方法是否存在来决定使用方式。比如 Animated 组件的 ref 移除 getNode 方法，在 RN@0.65 之前，获取 Animated 组件实例需要使用 ref 的 getNode 方法，在这之后，直接使用 ref 即可，参考下面示例

```kotlin
...
    if (this.scrollView.getNode) {
    this.scrollView.getNode().scrollTo(...);
        } else {
        this.scrollView.scrollTo(...);
    }
    ...
    <Animated.ScrollView
ref={(scrollView) => { this.scrollView = scrollView; }}
...
>
<Animated.ScrollView>
```

由于该方法使用不多，直接在升级文档中标注了需要业务方按需自行修改，没有使用类 jscodeshift 的方式通过编译来解决。 类似的 break change 还有 [移除removeListener](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Freact-native%2Fcommit%2F2596b2f6954362d2cd34a1be870810ab90cbb916 "https://github.com/facebook/react-native/commit/2596b2f6954362d2cd34a1be870810ab90cbb916")，[Image 组件移除 width，height 属性](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Freact-native%2Fcommit%2Ffbd09b179759cd90f2be5c24caa11bdb483ad8cd "https://github.com/facebook/react-native/commit/fbd09b179759cd90f2be5c24caa11bdb483ad8cd") 等等。

### 能力下沉

对于无法通过写法来同时兼容 0.60、0.70 的 break change，可以将能力下沉到组件，用组件的两个版本分别适配 0.60、0.70，上层暴露相同的 API 来处理。 比如 react-native-pager-view 升级之后名称变为 @react-native-community/viewpager，接口也不再一致，而且 @react-native-community/viewpager 开启了 TurboModule，在 0.60 版本，构建时因为缺乏相应的 codegen 就会报错。这时可以将使用到 react-native-pager-view 的地方封装成组件提供给上层使用。

```kotlin
// 0.70 版本
import ViewPager from '@react-native-community/viewpager'
    const WrapperViewPager = () => {
    // 组件实现
    ...
    return (
    <ViewPager {...props} >
    )
}

// 0.60 版本
import ViewPager from 'react-native-pager-view'
    const WrapperViewPager = () => {
    // 组件实现
    ...
    return (
    <ViewPager {...props} >
    )
}

// 业务使用
import WrapperViewPager from 'WrapperViewPager'
```

依赖升级
----

break change 不仅会影响业务代码的实现，更多的其实是在依赖里面。依赖可以分成三类：

*   第一类是官方包，比如 react-native、react、@react-native-community/cli、metro 等一系列 RN 配套。
*   第二类是云音乐常用的 RN 社区依赖，比如：react-navigation、react-native-svg、react-native-gesture-handler。
*   第三类就是内部封装的各类组件，可以分为基础依赖，比如：@music/mnb-rn （底层 bridge）、utils，以及各式各样的业务包。

依赖是一环套一环的，第一类升级之后会影响第二第三类，第二类会影响第三类，第三类之间也可能互有影响，所以最后梳理下来需要升级的包有 60+。 当然这不是一个应用的，而是所有应用使用到的依赖集合，每个应用按使用情况略有不同。对于需要升级的依赖我们有一个基本原则所有修改尽量是在底层，底层做好兼容， 保证 API 不变，确保业务升级时是无感的。

### 社区依赖升级

由于我们需要升级到版本 0.70 刚推出没多久，大部分社区依赖还没有适配完成，部分依赖虽然完成适配，但其自身有大量 break change，这会造成适配工作的成倍增长。针对这种情况，我们将依赖分成三类来处理。

#### 依赖自身 API 变动非常大

比如 react-navigation 我们当时使用的是 4.x 版本，当时社区已经迭代到了 7.x 版本了，从 4.x 到 7.x API 变动非常大，业务升级成本非常高。 经过评估 4.x 其实已经满足我们的业务需求，因此对于 react-navigation 我们仍使用 4.x 版本，同时为了适配 0.70 版本，我们将 react-navigation 私有化处理。

#### API 变动小，但是没有适配 0.70

还有一些依赖虽然未适配 0.70，但自身这些年也有诸多能力升级，且都是底层变动或者 bugfix，对业务适配影响不大，升级上来百利而无一害，这些我们选择了升级。对于不适配 0.70 版本的地方 通过私有化的方法来处理，比如：react-native-gesture-handler、react-native-linear-gradient 等。

#### 无需适配

当然也有些神仙依赖什么都不用改，在 0.60 和 0.70 都可以运行，比如：react-native-screens、react-native-swiper。

### 内部依赖升级

内部依赖的升级主要是在两个方面，一个是前文提到的 break change 适配；一个是其自身依赖的升级，主要就是前面提到的官方依赖、社区依赖。这里重点说下依赖的升级， 在梳理内部依赖的过程中发现大量的历史债务（版本依赖不正确），比如 react-native 版本写死的 0.60，又或者不同的依赖使用不同版本基础依赖，导致最后打包进两份相同的依赖，在普通 H5 应用中或许不是大问题，但在 RN 中就会导致页面红屏。

其实对于云音乐里的 RN 应用来说因为使用的都是同一个容器，因此依赖的 react-native 版本完全是由容器来决定的，因此声明对 react-native 的依赖完全可以放入 peerDependencies， 版本用 \* 描述，类似的还有 react-native-gesture-handler、react-native-linear-gradient 等有客户端依赖的组件。

```json
    {
        "dependencies": {
        -        "react-native": "0.60",
        -        "react-native-gesture-handler": "^1.3.0"
        ...
        },
            "devDependencies": {
            +        "react-native": "*",
            +        "react-native-gesture-handler": "*"
            ...
        }
    }
```

方案设计
====

因为客户端在运行时 RN 0.60 和 RN 0.70 不能共存，使用 0.70 版本 or 0.60 版本没办法以 RN 应用是否升级完成决定。所以 100 多个 RN 应用需要同时完成升级，而同时业务不能停，相当于给飞驰的汽车换轮子，稳定性压力是非常大的，这就需要我们有很好的灰度验证方案。但前端又不同于客户端，RN 应用没办法分流验证，每次使用的都是同一套构建产物。鉴于这一特性最初考虑了两套方案。

RN 应用按版本分叉
----------

此举就是和客户端分流逻辑保持一致，客户端灰度期间、RN 应用基于当前 master 拆分出一个分支，比如 0.70 单独升级维护，业务日常交付 依然使用原来的 master 分支，升级的分支 0.70 根据业务需要不定时同步 master 分支。待升级验证完成之后再将 0.70 修改同步到 master。 这套方案的最大好处就是，升级的代码分支不会影响现有业务运行，所有改动都在灰度的分支上。但可惜的是与我们的好多基础 设施不兼容，比如投放、部署、数据平台等，为了升级而去改动他们是不明智的，会导致影响范围的扩大化，不符合我们再最小集内完成升级的原则。

一份代码两份 bundle
-------------

源代码是同一套，但是同时产出 0.60 版本的 bundle 和 0.70 的 bundle, 客户端按需获取。支持 0.60 版本的客户端就拉 0.60 版本的 bundle；支持 0.70 版本的客户端就去拿 0.70 版本的 bundle。乍一听很疯狂，仔细想想也不是不可能，RN 自身的构建也是同一份源码分别产出支持 IOS、Android 的 bundle；其次经过我们前期的调研可以知道，RN 升级导致的 break change 是可枚举的，小部分可以通过写法来同时支持 RN 的 0.60 和 0.70 版本，而对于无法通过写法兼容的变动，可以转换为组件版本的切换问题。 因此这套方案的主要问题就是解决不同版本的依赖问题。基于此我们产出了如下的打包方案 ![image](/images/jueJin/8e014c5eb20842d.png)

在验证时很快发现这个方案有两个明显的问题。一个是由于我们的打包工具也是作为一个依赖放在 npm 包里的，在删除依赖时无法删除干净，导致再次打包 0.60 版本 bundle 时会出现各式各样莫名其妙的错误。

还有一个就是依赖的管理问题。在打 0.60 版本 bundle 时对于需要修改版本的依赖时无法确定其对应的 0.60 版本的依赖， 同时对于私有化的社区依赖，在引用时是使用未私有化的包名 react-navigation 还是私有化后的名字 @music/react-navigation，使用 react-navigation 时在打 0.70 bundle 时会报依赖找不到，反之则是在打 0.60 bundle 时找不到依赖。

### 依赖提升

针对第一个问题，我们使用了依赖提升的方案，将原先安装在 RN 应用工程包里的打包工具安装到打包机器上，每次构建时先全局安装打包工具。 因为打包工具提升到全局，这样删除应用工程依赖时可以做到删的干干净净。再次打包产出的 0.60 版本 bundle 也就没有问题了。

### 依赖管理

针对无法确定 0.60 版本 RN 的依赖版本问题，我们想到在 package.json 增加一个配置保存适配 0.60 版本的包版本。

```perl
...
    "degrade": {
        "devDependencies": {
        "@babel/core": "^7.5.5",
        ...
        },
            "dependencies": {
            "react-native": "0.60.5",
            ...
        }
    }
    ...
```

至于私有化依赖的问题，我们决定通过 babel-plugin-module-resolver 的 alias 功能来处理。针对 0.70 版本增加如下 babel 配置

```perl
    "alias": {
    ...
    "react-navigation": "@music/react-navigation",
    ...
}
```

同时在 0.60 版本打包时删除对应配置

最终我们的打包流程如下。其实这一块仍然有进一步的优化空间，比如打包时并行构建 0.60、0.70 的 bundle，提升构建速度。

![image](/images/jueJin/f0bc93ee82504e9.png)

同时为了配合客户端的 AB，整个技术方案如下

![image](/images/jueJin/df298b86546440d.png)

升级
==

可行性分析
-----

前述的方案设计探讨的都是技术上的可行性，但在落地到具体实施上却又是另一番景象。 首先有两个不得不面对的问题： 一是业务不能停，虽然会投入一定人力来做升级这件事，但是业务同时是在快速迭代的。 二是 100 多个 RN 应用必须同时完成升级，在客户端进行灰度之前完成上线。

按照前述方案我们整理下，在基础功能完备（基础依赖升级完成、打包适配）之后升级一个 RN 应用需要多少步。

1.  生成并增加 patch 文件，package.json 增加 postinstall 脚本 `"postinstall": "npx patch-package"`.
2.  按需升级依赖，并将当前版本放入 degrade，这点不难，难得是从60多个依赖中，准确找到要升级的依赖。
3.  package.json 增加 preinstall 脚本 `"preinstall": "npx npm-force-resolutions@0.0.3"`，同时增加 resolutions 配置。
4.  修改 babel 配置，增加私有化包的 alias
5.  增加 vscode 相关配置，使用 vscode 调试（原来通过 Chrome 的调试方式已经不再支持）
6.  部分业务代码中的 break change 使用兼容写法适配（较少）

看起来每一步都不难，开始时我们用文档记录下来所有的改动点，结果执行时状况百出， 要么 patch 文件没有生成，要么脚本命令没添加，更多的是依赖的升级问题，需要把每个应用自己的依赖（十几到几十）和需要升级的依赖（60+）交叉比对，确定哪些依赖升级，并配置降级版本。 上面任意一步出了差错，不是应用本地无法启动，就是构建完成之后无法打开。对于有明确报错信息的，可以快速定位问题，但更多是没有明确报错信息的问题，叠加双端的容器也还在不断适配， 导致前期定位问题就需要耗费大量资源。

即使完全按照文档一步步升级下来，也能正常运行了，但是随着验证、测试的深入仍然会不断发现问题，这些大部分都是小范围的共性问题，如果仅仅使用文档来承接会非常低效，每个应用都需要从文档中筛选出自己需要的信息。 随着文档新增内容越来越多，对于每一个升级的 RN 应用来说显得噪音越来越多，无法快速知道哪些是必要的。

自动化脚本
-----

鉴于此我们提供了一套脚本来沉淀我们的适配方案，并随着适配的进度不断更新完善，由脚本来沉淀我们的适配方案，对外只暴露一个升级命令，只需一个命令即可完成升级的绝大部分工作。考虑到脚本需要不断优化，因此需要脚本有动态更新的能力。 此时 Node.js 脚本配合 npx 毫无疑问是个绝佳的组合。Node.js 轻量、文件操作简单，脚本编写完成之后发到 npm 仓库。 配合 npx 的从 npm 的仓库中临时下载并运行指定的包的能力，可以实现脚本的动态更新，保证每次运行脚本使用到就是最新的。最后统计了一下适配脚本迭代了 110+ 次。

暗礁
==

每当我们觉得方案已经完美的时候，现实总是会给你当头一棒，会触碰到很多隐藏在水面之前的暗礁。

消失的 JSON 文件
-----------

RN 打包时会将所有资源分为两类，一类是代码，打包最终产物是 bundle；一类是静态资源，比如图片、视频，这种会直接 copy 放入最终的资源包。其中 JSON 比较特殊，其既作为一个文件存在，又作为代码的一部分打入 bundle。这个 JSON 文件在 RN 官方开源的场景下完全是多余的，于是 Metro 在一次更新中[Remove JSON from default asset types](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Fmetro%2Fpull%2F593 "https://github.com/facebook/metro/pull/593")修复了这个问题，JSON 文件在打包后不再作为资源处理。

我们在接口预加载场景下客户端会依赖资源包里面的 JSON 文件读取接口配置信息，从而实现性能的提升。这个问题很隐蔽，一方面这不是个功能问题，容易忽略；二是接口预加载并不是全部开启的，所以缺失 JSON 文件并没有异常日志。客户端同学也是花了很久的时间才定位到是缺失了 JSON 文件，前端接力往下查为什么会缺失，跟着源码一步步下来才发现 Metro 的这个修复。

Hermes 的雷
---------

### 部分语法的不支持

*   `Date.parse` 不再支持， 比如 `Date.parse('2023/3/30')` 会返回 NaN，需要自己手动实现此功能。
*   正则不支持命名捕获组，比如 `(?<Name>x)`，参考 [Regex causes "Quantifier has nothing to repeat"](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Fhermes%2Fissues%2F46 "https://github.com/facebook/hermes/issues/46")

### 打入 bundle 的 sourceMap

这其实是夸张的说法，之所以这么说因为默认情况下的 hbc bundle 中会保留原始的源代码结构和变量名。这和我们的 hermes 版本 是 0.7 有关，默认启用的是最低级别的优化，即关闭所有的优化，此时编译过的代码将保留很多源码信息，以便于调试和分析，但这些对于生产环境是负担。因此我们改为使用最高级别的优化，对于一些源码原始信息通过 sourceMap 保留，上传我们的云端，处理线上异常时再还原代码。

### 庞大的 patch 包

在升级过程中，我们发现开启了字节码的 bundle 的 patch 包会明显大于普通 js bundle 的 patch 包。其原因是我们默认使用的 diff 算法是 bsdiff，而 bsdiff 主要用于文本文件的差异生成，对于字节码文件来说，差异文件的生成和应用会变得复杂和不可靠。比如字节码对于位置信息更敏感，很简单的位置变更都可能导致 patch 包体积庞大。 针对这种情况可以在编译时使用增量编译的方案。即在编译时增加 `--base-bytecode previous.hbc` 参数，`previous.hbc` 是上次构建的产物。这样编译时将会检查输入文件的更改，这样一方面只编译那些发生更改的部分，减少构建时间；最重要是会生成描述信息用于重排，可以减少 diff Patch 体积。

参差的依赖
-----

因为在升级之前的 RN 0.60 版本已经在线上运行了三年时间，不同时期创建的应用依赖版本千差万别， 在未升级之前因为 lock 文件的存在，问题暴露的还不明显。根据上文提到的打包过程可以知道打包 0.60 版本 bundle 时是需要删除 lock 文件的。因为 package.json 语义化版本的存在，重新安装时会有部分依赖自动升级而部分不会，这就导致版本不兼容，引出一系列问题。

*   babel-runtime 版本太低找不到相应模块，`Unable to resolve module @babel/runtime/helpers/regeneratorruntime`
    
    需升级 babel-runtime到最新版本
    
*   部署完成后，如下报错 `Unhandled JS Exception: Unexpected identifier '_classCallCheck'. import call expects exactly one argument. no stack`
    
    升级 metro-react-native-babel-preset 到匹配 0.60 版本的最新版本
    
*   NativeCoponent 注册两次导致红屏， `Invariant Violation: Tried to register two views with the same name xxxx`
    
    这种需要梳理清楚依赖关系，或者强制锁定版本
    
*   React 兼容性问题 `Unable to resolve module react/jsx-runtime`
    
    升级 React 到16的最新小版本
    

总结
==

以上就是云音乐 RN 升级前端工作的介绍，从调研开始至升级完成的整个过程。这次升级给我的感触有两个：一是虽然调研、方案已经做的足够翔实，但在升级过程中 不断会有问题涌现，此时要做的就是稳住心态不要慌，遇到一个解决一个。二是协作，这次升级涉及所有业务线，升级过程中不断有方案的调整，如果没有业务团队的支持， 和我们一起解决问题、完善方案，升级是不可能完成的。

最后
==

![](/images/jueJin/4d73d810866c46e.png)

更多岗位，可进入网易招聘官网查看 [hr.163.com/](https://link.juejin.cn?target=https%3A%2F%2Fhr.163.com%2F "https://hr.163.com/")