---
author: "yck"
title: "从零带你架构一个企业级 React 项目"
date: 2021-07-12
description: "本文没有只针对 React 读者，除了强相关 React 技术栈的内容，其他东西完全是可以应用进任意技术栈的项目。"
tags: ["前端","JavaScript","架构中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读13分钟"
weight: 1
selfDefined:"likes:421,comments:0,collects:519,views:36044,"
---
[![](/images/jueJin/3512ebe159614b2.png)](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FKieSun%2Ffucking-frontend "https://github.com/KieSun/fucking-frontend")

「本文已参与好文召集令活动，点击查看：[后端、大前端双赛道投稿，2万元奖池等你挑战！](https://juejin.cn/post/6978685539985653767 "https://juejin.cn/post/6978685539985653767")」

**本文没有只针对 React 读者，除了强相关 React 技术栈的内容，其他东西完全是可以应用进任意技术栈的项目。**

一般在公司内部开发一个新项目，脚手架一把梭然后就开干了。由此一部分开发人员会缺失一些知识点，比如说为什么我们要选择这套技术栈进行开发；项目里的工程化配置到底应该怎么搞，一旦自己上手就懵逼；脚手架到底是个什么东西（相当一部分读者朋友认为脚手架是个很厉害的东西），如何整一个适合业务开发的企业级脚手架。

一个 React 项目会涉及到很多通用的东西，同时又存在很多选择性。单人开发可以按照自己的喜好来随意整合，但是在多人开发多项目的场景下，势必需要一整套规范来限制大家。文章将根据以下大纲和各位读者聊聊我们如何架构一个企业级 React 项目，以及最终如何将这套东西整合进脚手架。

![大纲](/images/jueJin/331908ebd29146a.png)

**接下来假定你目前处于一家主要使用 React 开发的公司。多人团队，且已有项目上线，随着业务的发展及人员的增加，你们急需建立一套完整统一且规范的开发流程，老板需要你全权负责这块内容并最终产出一个脚手架。**

技术栈选择
-----

对于一个 React 项目来说，通用的技术栈肯定需要考虑以下内容：

*   TS 还是 JS？
*   选择 Hooks 还是非 Hooks 还是混合？
*   CSS 方案，是 Saas 这类预处理亦或者 CSS-In-JS、Atom CSS？
*   状态管理怎么选？
*   Route 怎么选？其实这个选择性很少

首先在考虑某个技术优劣之前，我们先需要对团队情况进行分析。

比如说我们现在需要考虑是选择 TS 还是 JS，那么首先应该先考虑团队成员是否大部分已经了解或者开发过 TS 项目。如果大部分成员对 TS 是一个不熟练、有抵触心理的状态，那么强上 TS 势必会带来开发效率的降低，项目里 `any` 遍地飞。当然如果 Leader 能承受短期的效率降低，那么TS 的方案就可以摆在选项上，否则该选项可能就需要稍稍靠后，或者说只在部分项目里慢慢开始推广。

接下来我会以上述技术栈为例来说明在选型时我们需要从哪些角度去考虑问题。

### 选择 Hooks 还是非 Hooks 还是混合？

下表中的上手成本针对于团队成员已经会用类组件写 React 项目的前提下。

Hooks

非 Hooks

混合

上手成本

高

无

高

功能复用性

高

低

中

代码可读性

高

低

中

各自常见缺陷

闭包陷阱、对比类组件生命周期不全

JS Class 缺陷

都有

老项目迁移成本

高

无

中

Hooks 的选择其实早几年就有文章开始聊了，所以我这里就不再班门弄斧来大聊特聊各自的优缺点了，上表也只是列了些常见的对比。

这个小节主要是给大家一个思路，在遇到选型的时候，我们该从哪几个方向去考虑。

### CSS 方案

CSS-In-JS

Atom CSS

预处理

上手成本

高

中

几乎没有

样式覆盖成本

高，需要暴露给外部 class 或者单个节点的 style

无

无

代码可读性

高

几乎没有

高

支持 postcss

不支持，得用自己的

支持

支持

SSR 支持度

服务端那块需要额外写代码

支持

支持

对于 CSS 方案的选择，笔者早在年初的时候就写过一篇[文章](https://juejin.cn/post/6927828841645735949 "https://juejin.cn/post/6927828841645735949")，大家有兴趣的话可以自行阅读，下面的话笔者来简单聊聊这些方案。

#### CSS-In-JS

这个方案笔者已经用了两年了，具体用的是[styled-components](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fstyled-components%2Fstyled-components "https://github.com/styled-components/styled-components")这个库（下文简称 sc）。总的来说感觉这种方案对于 React 来说是很香的，并且解决了我很讨厌的传统写 CSS 的一些点，比如说得写一堆 class，真的是取名困难户。

通过这个库我们需要用 JS 来管理 CSS，因此就可以充分享受 JS 带来的工具链好处了。一旦项目中出现没有使用到的样式组件，那么 ESLint 就可以帮助我们找到那些死代码并清除，这个功能对于大型项目来说还是能减少一部分代码体积的。

除此之外，样式污染、取名问题、自动添加前缀这些问题也很好的解决了。除了以上这些，再来聊两点不容易注意到的。

首先是动态切换主题。因为我们是通过 JS 来写 CSS 了，那么我们就可以动态地控制样式。如果你的项目有切换主题这种类似的大量动态 CSS 的需求，那么这个方案会是一个不错的选择。

还有个点是按需加载。因为我们是通过 JS 写的 CSS，现阶段打包基本都走的 code split，那么就可以实现 CSS 文件的按需加载，而不是传统方式的一次性全部加载进来（当然也是可以优化的，只是没那么方便）。

说完了优先再来聊聊缺点，学习成本肯定存在，这个没啥好说的。另外也有运行时成本，sc 本身就有文件体积，加上还需要动态生成 CSS，那么这其中必定有性能上的损耗。项目越大影响的也会越大，如果你的项目对于性能有很高的要求，那么需要谨慎考虑使用。另外因为 CSS 动态生成，所以不能像传统 CSS 一样缓存 CSS 文件了。除此之外，样式覆盖成本相较其它方案也略高，同时也不支持 postcss，针对 SSR 方案也有额外的开发成本。

#### Atom CSS

代码可读性差，学习成本不低，但是在存在成熟的 UI 规范下，该方案能提供通用样式来进行复用，从而降低 CSS 文件体积。

其实笔者并不看好这个方案在国内业务团队中的大范围应用，因为需求的频繁变更导致的 UI 变更以及绝大部分 UI 团队没有一个成熟的规范，这些问题会显著提高使用 Atom CSS 的成本。

#### 预处理方案

应该算是传统方案了，该有的都有，开发成本也低，无非存在 CSS 的通病：调试起来是真的蛋疼。

#### 小结

总的来说用 CSS-In-JS 需要考虑学习成本及团队成员的接受程度，毕竟确实存在一部分开发人员是不喜欢这种方式来书写 CSS 的。

Atom CSS 的话一定务必需要有一套成熟的 UI 规范，否则随着需求的变化频繁乱改 UI，相信我，一定会火葬场的。

预处理方案没啥好说的，几乎没有上手成本，代码也方便维护。如果团队成员不喜欢 CSS-In-JS 并且也没有一套成熟的 UI 规范，就选这个呗。

### 状态管理怎么选？

状态管理真的有太多选择了，除了大家耳熟能详的 Redux 和 mobx，其它还有一大堆竞品，比如说：

*   [xstate](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fstatelyai%2Fxstate "https://github.com/statelyai/xstate")
*   [Recoil](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebookexperimental%2FRecoil "https://github.com/facebookexperimental/Recoil")
*   [pmndrs](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fpmndrs "https://github.com/pmndrs")家出品的 zustand、valtio、jotai
*   另外还有好多小众产品

我们在对状态管理进行选型的时候，其实第一步应该考虑项目是否需要状态管理，实际上大部分项目需要的只是跨组件的通信，而不是管理。或者说实际上当你在考虑项目是否需要状态管理的时候，基本上此时就是不需要的。因为你可能压根还没遇到状态管理解决的痛点，而只是觉得跨组件通信麻烦。

如果你的项目还没上升到需要状态管理的时候，可以考虑选择状态共享库（类似[hox](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fumijs%2Fhox "https://github.com/umijs/hox")）外加 hooks 一把梭，实际上这个方案基本可以覆盖大部分项目了，写出来的状态相关的代码也不容易屎山。

**如果项目真的需要状态管理，那么尽量别去考虑技术相关的东西，而是选择一个大家熟悉的东西直接用**。因为状态管理太容易写出屎山了，我们巴拉巴拉对比了一堆技术相关的东西，最终如果选择了一个相对先进但大家不熟悉的产品，那么最后屎山应该是避免不了的。

### Route 怎么选？

路由这块其实个人认为没啥好选的，毕竟可选择的余地基本没有，选哪个都对开发没什么影响，所以爱选啥选啥吧。

### 其他

除了上面所说的技术选型，我们可能还会根据项目的不同存在更多的技术需求，比如说单测等等。

#### 单测

业务团队写单测的不多，尤其是 UI 相关的。但是我们可以退而求其次，对工具函数或者一些关键节点做下单测，提高一下整体的代码质量。

工具函数测试的话，直接上 [Jest](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Fjest "https://github.com/facebook/jest") 或者 [Mocha](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmochajs%2Fmocha "https://github.com/mochajs/mocha") 就行，反正也就是断言的事情。如果要测试 UI 相关的，那么 [enzyme](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fenzymejs%2Fenzyme "https://github.com/enzymejs/enzyme") 以及 [react-testing-library](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ftesting-library%2Freact-testing-library "https://github.com/testing-library/react-testing-library") 也是必不可少的。最后如果你们还想整一整自动化测试，那么就上 [cypress](https://link.juejin.cn?target=https%3A%2F%2Fwww.cypress.io%2F "https://www.cypress.io/") 吧。

另外笔者之前也写过一篇[单测的文章](https://juejin.cn/post/6844904018129453070 "https://juejin.cn/post/6844904018129453070")，有兴趣的读者可以自己阅读下。

### 小结

实际上在进行技术选型的时候，技术相关的内容很可能是最后才会考虑的，在这之前我们需要结合团队、项目工期、项目诉求等外部因素来权衡。

最后关于各个技术栈的选择大家可以浏览云谦大佬搞的[仓库](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsorrycc%2Fawesome-javascript "https://github.com/sorrycc/awesome-javascript")，应该算是覆盖的很全面了。

工程化配置
-----

项目中的工程化配置是相当重要的一环，这部分内容对于开发人员来说应该尽可能少的配置，在常见场景下要实现开箱即用，并且对于**一部分配置强管控**。

笔者和一些处在小公司的前端开发聊过，了解到他们的开发其实相当混乱。比如说：

*   工程配置每个项目都不同，具体体现在 Webpack 配置混乱、ESLint 形同虚设、代码格式混乱等问题上
*   commit 提交没有规范，代码没人 review
*   等等。。。

以上这类问题如果恰巧发生于正在阅读文章的你的团队，你也许可以按照笔者下文中的思路去尝试改进。

对于一个项目来说，以下内容应该是必须的：

1.  构建器配置，在应用中一般都是 Webpack
2.  Babel 配置
3.  TS 配置
4.  ESLint 配置
5.  Prettier 配置

针对以上内容来说，个人认为除了第二和三点，其他几项都是需要强管控的。

对于 Webpack 而言，大家都知道配置起来挺麻烦的，但是其中相当一部分配置在各个应用中应该是通用的。我们是可以抽离出这部分通用的配置并做成一个内部的 preset 的，就像[@babel/preset-env](https://link.juejin.cn?target=https%3A%2F%2Fbabeljs.io%2Fdocs%2Fen%2Fbabel-preset-env "https://babeljs.io/docs/en/babel-preset-env")一样。这种做法简化了需要配置的内容，从而杜绝用户瞎搞造成各个项目 Webpack 混乱的局面。同时以后在升级 Webpack 的时候，也无需用户关注通用配置的修改，只需要对自己新增的配置做适配即可。

那么对于 ESLint 和 Prettier 来说，强管控是必须的，把配置封装起来直接让用户 `require` 就行。这样就能杜绝换个项目 ESLint 被关闭了、编码格式全变了的情况，这种问题其实对代码质量是有毁灭性打击的，大家都会破罐子破摔写代码。

总的来说，对于工程化配置我们最好尽可能少的让用户去接触配置，专心业务代码即可。能强管控的地方务必强管控起来，对于整个团队的代码质量都是有提升的。当然我们肯定不能把所有配置都强管控起来，有的地方还是需要开个口子让用户能自定义 / 合并配置项的，比如 Webpack。

目录结构
----

一个好的项目目录是能提高项目的维护性的，否则代码没有条理的乱放，自己可能写爽了，但是对于接手的同事来说真的是会头大的。

笔者大致会把一个项目目录分为以下几块：

*   pages，页面，其中每个文件夹按照功能模块划分
*   components，组件，分为 common 及业务组件
*   services，和后端打交道的地方
*   store，状态管理逻辑相关，如果需要的话
*   utils，常量、工具函数等
*   types，TS 项目需要，存放类型
*   assets，静态资源，比如说图片、svg 这类
*   tests，测试相关，如果需要的话

根据以上分类，我们一个项目大致目录会长成这样：

```bash
└── /src
├── /pages
├── /components
├── /services
├── /store
├── /utils
├── /types
├── /assets
├── /tests
├── index.ts
└── App.ts
```

除了以上内容，根据我们不同的 CSS 选型以及工程化的选择，对应的文件也会有所不同。

整合进脚手架
------

脚手架简单来说就是帮我们 `git clone` 了一个初始化项目过来，一个最基础的脚手架大概可以分为两块内容：

![基础脚手架](/images/jueJin/bc065a6e4d0c42d.png)

工程化配置和模板代码上文已经聊过一些了，大家可以根据自己业务的不同来整出这样一套东西，但是仅有这些还不足以做出一个好用的脚手架。

举个例子，有些业务需要做单测怎么办？又需要业务方自己去做一大堆配置么？

比如说根据业务的不同，模板可能也会存在细微的不同，这时候我们是重新再搞一套模板还是怎么办？

因此对于脚手架来说，我们需要在必备的工程化配置之上，再加上一些可选的内容。比如说业务方认为项目需要单测，那么在初始化项目的时候选上单测就可以自动加入单测所需的配置。

再然后因为业务的不同，模板代码上可能存在不同，这时候我们可以依照情况来决定是再拆分一套模板还是在原有的模板上支持编译，从而根据用户的输入来决定最终的模板输出。

做好以上这些东西我们可能才勉强做出一个好用点的且适合自身团队业务的脚手架。

最后
--

文章没有代码，主要还是分享了从笔者的角度去考虑如何从零设计一个 React 项目，其中的技术栈选型大概是怎么样的、工程化这块该怎么搞的好用点、项目目录结构大概长什么样子，以及最后聊了聊如何做一个好用的脚手架。

> 作者：yck
> 
> 仓库：[Github](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FKieSun "https://github.com/KieSun")
> 
> 公众号：[前端真好玩](https://link.juejin.cn?target=https%3A%2F%2Fp1-jj.byteimg.com%2Ftos-cn-i-t2oaga2asx%2Fgold-user-assets%2F2019%2F12%2F22%2F16f2e3314a431c20~tplv-t2oaga2asx-image.image "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/22/16f2e3314a431c20~tplv-t2oaga2asx-image.image")
> 
> 特别声明：原创不易，未经授权不得转载或抄袭，如需转载可联系笔者授权