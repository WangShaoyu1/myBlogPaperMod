---
author: ""
title: "React 组件库 CSS 样式方案分析"
date: 2022-05-13
description: "本文从构造组件库的角度，分析了 React 生态下各类 CSS 样式方案，并基于不同场景，给出选择合适方案的推荐。"
tags: ["CSS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读18分钟"
weight: 1
selfDefined:"likes:43,comments:0,collects:37,views:3557,"
---
> 图片来源：[unsplash.com](https://link.juejin.cn?target=https%3A%2F%2Funsplash.com "https://unsplash.com")

> 本文作者：[iwyvi](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fiwyvi "https://github.com/iwyvi")

背景
==

随着业务的发展，一些代码逻辑可能同时在多个项目中使用，为了避免每次使用和更新都要复制粘贴代码，构造一个组件库就十分有必要了。构建组件库有很多需要考虑的方面，本文主要讨论在 React 生态下，如何选择一种适合组件库的 CSS 样式方案。

目前开发一个浏览器中运行的项目，可以选择的样式方案根据写法主要分为三种：第一种是常规 CSS（regular CSS），即原生 CSS 和各种预处理语言；第二种是在 JS 侧写样式的 CSS in JS 方案，例如 [styled-components](https://link.juejin.cn?target=https%3A%2F%2Fstyled-components.com%2F "https://styled-components.com/")；第三种是在 HTML 中写工具类，由 CSS 框架生成对应样式的方案，例如 [`Tailwind CSS`](https://link.juejin.cn?target=https%3A%2F%2Ftailwindcss.com%2F "https://tailwindcss.com/") 。

但是当我们构建组件库时，考虑问题的角度和普通项目可能会不太一样，不但需要考虑开发体验，同时也要照顾到使用者的感受。因此，本文不从写法层面对 CSS 样式方案进行分析，而是从组件库的开发角度来探讨以下两个问题：

1.  CSS 与 JS 的关联方式是什么，即组件如何使用样式，以及 CSS 如何参与打包。
2.  在不同的关联方式下，组件库如何处理样式命名冲突。

方案分析
====

在 React 生态中，没有统一的样式管理方案，因此如何处理 CSS 有多种解决方案，不同的方案也有着各自的优缺点。

构造组件库时，我们一方面希望在开发时能够写起来更简单，另一方面也希望使用时能更方便。CSS 作为组件库必不可少的一部分，选择合适的样式方案，会影响到后续开发和使用的体验。

CSS 与 JS 关联方式
-------------

首先我们从 CSS 与 JS 的关联方式说起。不同的 CSS 与 JS 关联方式，有着不同的样式引入方法，同时在按需加载、性能和 SSR 支持等方面也有各自的特性。

本文将组件库使用 CSS 的方案分为以下三种类型：

1.  **样式和逻辑分离**。组件的 CSS 和 JS 在代码层面分离，JS 里不引入样式文件，在组件库打包时分别生成独立的逻辑和样式文件。对于组件库的使用者来说，添加一个组件，需要分别引入组件代码和 CSS 文件。使用这种方案的组件库有 [Ant Design](https://link.juejin.cn?target=https%3A%2F%2Fant.design%2F "https://ant.design/")、[Zent](https://link.juejin.cn?target=https%3A%2F%2Fyouzan.github.io%2Fzent%2F "https://youzan.github.io/zent/") 等。
2.  **样式和逻辑结合**。将组件的 JS 和 CSS 打包在一起，最终只输出 JS 文件。使用时只需要引入组件就可以直接使用。这种方案目前主要有以下两种种实现形式：
    1.  将 CSS 写在 JS 里。例如使用 [styled-components](https://link.juejin.cn?target=https%3A%2F%2Fstyled-components.com%2F "https://styled-components.com/"), [Emotion](https://link.juejin.cn?target=https%3A%2F%2Femotion.sh%2F "https://emotion.sh/") 等 CSS in JS 方案。代表组件库有 [MUI](https://link.juejin.cn?target=https%3A%2F%2Fmui.com%2F "https://mui.com/")、[Mantine](https://link.juejin.cn?target=https%3A%2F%2Fmantine.dev%2F "https://mantine.dev/") 等。
    2.  写代码时依然使用常规 CSS，组件内 `import` 样式文件，通过打包工具将 CSS 打进 JS 里。例如使用 `webpack` 配合 `style-loader`。基于这种方案的组件（库）有 [react-mobile-picker](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fadcentury%2Freact-mobile-picker "https://github.com/adcentury/react-mobile-picker")、[`Angular Material`](https://link.juejin.cn?target=https%3A%2F%2Fmaterial.angular.io%2F "https://material.angular.io/") 等。
3.  **样式和逻辑关联**。组件的 JS 和 CSS 在代码层面分离，打包后生成独立的逻辑和样式文件，但是组件内会直接引用样式文件，且打包结果中保留对应的 `import` 语句。使用这种方案的有 [Semi Design](https://link.juejin.cn?target=https%3A%2F%2Fsemi.design%2F "https://semi.design/")、[React Spectrum](https://link.juejin.cn?target=https%3A%2F%2Freact-spectrum.adobe.com%2Freact-spectrum%2Findex.html "https://react-spectrum.adobe.com/react-spectrum/index.html")、[Ant Design Mobile 5.0](https://link.juejin.cn?target=https%3A%2F%2Fmobile.ant.design%2F "https://mobile.ant.design/")。

这几种方案各有优劣，接下来本文将对其细致分析：

### 样式和逻辑分离

这种 CSS 组织方案在组件库的构建中最为常见，各个框架中都有大量的组件库使用这种形式。CSS 写在单独的样式文件中，组件的 JS 不直接引入 CSS，而在使用组件库时需要分别引入组件和样式。

使用这个方案的组件库有一个较为显著的特点，他们的安装教程中都会让用户自行引入一个或多个 CSS 文件，而且通常来说，这个 CSS 文件会包含整个组件库**所有**组件的样式。

这种方案的优点有：

*   适用性广泛，可以支持组件库使用者的各种开发环境。
*   不限制组件库的技术栈，同一套样式可以用在基于多个框架的组件库上。
*   无需考虑对 SSR（服务端渲染）的支持，对外提供的是 CSS 文件，因此 SSR 流程完全交给组件库的使用者控制。
*   可以直接对外提供 `less`、`sass` 等源文件，便于外部覆盖变量，实现主题定制或换肤等功能。

但是这种方案也有一些问题：

*   需要使用者手动引入样式文件。如果直接引入了完整的 CSS 文件，而在实际使用中并没有用到组件库里的全部组件，就会造成一些无用的样式被打包进项目中。
*   让组件库支持 CSS 按需引入的功能会比较复杂，既需要组件库的开发者在打包流程和产物上进行处理，又需要使用者按照一定规则引入样式文件。首先组件库开发者需要定一套样式文件的目录组织规范，使其能在打包流程中支持以组件为单位打包样式文件，之后使用者就可以按需手动引入对应组件的样式文件。对于具有特定目录组织规范的组件库，目前已经有插件可以在编译阶段辅助生成引入样式的 `import` 语句，例如 [`babel-plugin-import`](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fumijs%2Fbabel-plugin-import "https://github.com/umijs/babel-plugin-import")、[`unplugin-vue-components`](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fantfu%2Funplugin-vue-components "https://github.com/antfu/unplugin-vue-components") 等。
*   如果组件库内部的组件存在引用关系，为了实现按需引入，打包出来的组件的样式可能会存在冗余。

### 样式和逻辑结合

这种方案中，CSS 以字符串或者对象的形式存在 JS 里，而且通常打包后的代码里会带一个用于挂载样式的 runtime。

这种方案具有以下优点：

*   不需要使用者单独引入样式文件，只需要 `import` 组件即可使用
*   天然支持按需加载，每个组件只需要处理自己的样式即可

但是同样这个方案也并不完美：

*   需要带一个 runtime，可能增大代码体积，带来性能影响。
*   相较于单独的 CSS 文件，此方案的样式都在 JS 中，可能无法充分利用到浏览器缓存。
*   对 SSR 支持需要具体实现方案提供的能力，这一点在后文中会详细说明。

这种方案主要有以下两种实现形式：

#### CSS in JS

CSS in JS 是一种与常规 CSS 文件不同的样式方案，多用于 React 生态，解决了一些使用常规 CSS 时存在的痛点，例如命名冲突、样式冗余等问题。

如今 CSS in JS 框架百花齐放，内部也出现了有运行时和零运行时（zero-runtime）两个类别。 [`styled-component`](https://link.juejin.cn?target=https%3A%2F%2Fstyled-components.com%2F "https://styled-components.com/") 和 [`emotion`](https://link.juejin.cn?target=https%3A%2F%2Femotion.sh%2F "https://emotion.sh/") 这一类属于有运行时，样式编写、变更和挂载都是在 JS 中进行的，框架会提供对应的 runtime 来处理这些工作。[`linaria`](https://link.juejin.cn?target=https%3A%2F%2Flinaria.dev%2F "https://linaria.dev/") 和 [`vanilla-extract`](https://link.juejin.cn?target=https%3A%2F%2Fvanilla-extract.style%2F "https://vanilla-extract.style/") 这一类属于零运行时，他们在写法上与有运行时框架类似，但是需要配置编译流程，经过编译以后将输出标准 CSS。

因为本节讨论的是样式和逻辑结合的方案，因此接下来提到的 CSS in JS 均指有运行时框架。

引入 runtime 意味着带来更多的 JS 代码，因此 CSS in JS 相比常规 CSS 一定存在着性能差异。[Real-world CSS vs. CSS-in-JS performance comparison](https://link.juejin.cn?target=https%3A%2F%2Fpustelto.com%2Fblog%2Fcss-vs-css-in-js-perf "https://pustelto.com/blog/css-vs-css-in-js-perf") 这篇文章从用户体验的角度分析了 `styled-component` 和 `linaria` 的性能差异（由上文可知 `linaria` 为零运行时的 CSS in JS 框架，即它可以代表常规 CSS 的性能），得出了常规 CSS 在各个方面的性能均优于 CSS in JS 的结论。

除了性能问题，由于样式的注入流程是由 CSS in JS 框架提供的 runtime 执行的，所以 SSR 流程也需要框架进行额外处理，好在目前几乎所有主流的 CSS in JS 框架都提供了 SSR 的支持。

目前来看，大部分 CSS in JS 框架都需要使用者在服务端渲染流程中添加额外的样式收集和插入流程，才能成功用上 SSR。少数框架例如 `emotion` 提供了一种无需额外配置的 SSR 支持方案，在服务端渲染时，组件的样式会以内联 `style` 标签的形式放到组件 DOM 的前面。但是这种方案也存在一些问题：当同一个组件在页面中被多次使用时，渲染后的 HTML 里会包含多份重复的样式；此外，因为插入了额外的 `style` 标签，会影响到 `:nth-child()` 这一类选择器。

为什么在 `SSR` 中，这个额外流程无法避免呢？服务端的一次渲染可以认为是调用了一次 `ReactDOMServer` 的 `renderToString` 方法，但是这个方法并没有为内部组件提供感知渲染状态的能力。对于一个组件来说，如果不记录自己是否被渲染过，就只能采取类似 `emotion` 的零配置方案，组件在每次渲染时都带上自己的样式；但是如果组件通过一个全局变量来记录自己是否被渲染过，如果没有渲染过就插入样式，已经渲染过就不插入样式，不难发现组件无法区分服务端的多次渲染，因为用来记录状态的全局变量在服务端一直是同一个，为了组件标记自己是否被渲染的状态在每一轮渲染中刷新，需要在每次渲染时创建一个变量来存储这个状态，而上述这些行为，就是上文提到的额外样式收集流程。

不过也正是因为添加了样式收集流程，CSS in JS 的方案大多都支持提取关键样式（Critical CSS），可以在 SSR 时减小首屏请求大小，这也是它的一个优势。

#### 将 CSS 打包到 JS 中

这种方案一般是通过打包工具配合相应的插件将常规 CSS 和 JS 直接打包到一起，例如 `webpack` + `style-loader` 或 `rollup` + `rollup-plugin-styles`。

通常这些插件引入的 runtime 均有 DOM 操作，会在 `SSR` 阶段报错或者什么都不做，等 `CSR` 阶段才真正注入样式，因此无法支持 `SSR`。

若要支持 `SSR` 也并非完全没有选择，`webpack` 生态里的 [isomorphic-style-loader](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fkriasoft%2Fisomorphic-style-loader "https://github.com/kriasoft/isomorphic-style-loader") 就提供了 `SSR` 支持，在功能上基本等同于 `style-loader`。但是它的实现方式和效果与 CSS in JS 方案比较类似，在开发时需要给组件包一个高阶组件来加载样式，同样在 `SSR` 阶段需要通过其提供的方法收集和注入样式。

在 React 生态中，很少有组件库采用这种样式方案，只有少数单组件项目使用这种打包方案。原因一方面在于这种方案难以提供 `SSR` 支持，另一方面既然已经写了常规 CSS，不如直接导出文件让使用者自行处理。

然而在一些非 React 生态中，使用这个方案构造的组件库还是比较多的，因为他们的主流开发工具提供了包含打包和开发在内的一整套解决方案，而 React 生态下百花齐放，没有统一的开发工具，因此也没有统一的样式解决方案。

### 样式和逻辑关联

这种方案的开发流程与样式和逻辑分离方案类似，主要区别在于输出结果里直接保留了引入样式文件的 `import` 语句，如果使用者的项目能正确处理 CSS 文件，那么就可以做到只引入组件即可使用。且这种方案同样也能支持按需加载，不需要引入一个大而全的 CSS 文件。

但是这种方案也有一些缺陷：

1.  对组件库的开发者来说，如果使用了预处理语言，打包编译的流程会更加复杂，需要让组件最终产物的 `import` 语句正确关联经过编译的 CSS 文件。
2.  对使用者的开发配置有一定要求，需要能正确处理由组件库内的代码引入的 CSS 文件（例如在 `webpack` 下配置对应 loader）。如果需要支持 `SSR`，还需要修改打包工具的配置，让组件库的文件也参与到构建中，避免出现 CSS 文件在 node 端直接执行导致渲染出错。

### 总结

样式和逻辑分离

样式和逻辑结合

样式和逻辑关联

开发打包流程

中等

简单

复杂

输出文件

JS 文件和 CSS 文件

JS 文件

JS 文件和 CSS 文件

使用方法

分别引入 JS 和 CSS

只引入 JS

只引入 JS

按需加载

需要额外支持

支持

支持

性能影响

无

带额外 runtime，可能有影响

无

SSR

支持

需要额外支持（部分方案不支持）

支持（可能需要使用者调整配置）

支持写法

常规 CSS / 零运行时 CSS in JS

常规 CSS / CSS in JS

常规 CSS / 零运行时 CSS in JS

关键样式提取

自行处理

支持

自行处理

组件库样式命名冲突处理
-----------

解决样式命名冲突也是构建一个组件库需要考虑的问题，开发者总是希望能使用更简单的名字，同时也不希望出现命名冲突。

目前在 React 生态下，常见的创建样式命名空间的方案以下几种：

### 约定命名规则

约定命名规则即在整个组件库遵守一个人为约定的命名规则，例如 BEM 规范或统一给所有选择器名添加前缀等。这种方案的好处是不需要调整打包方案，但是缺点在于规则全凭人为约定，在开发时要依靠开发者的自觉，当多人维护时可能会比较麻烦；此外为了达成约定的命名规则，可能还需要写一些样板代码来生成符合规范的名称，比较耗费精力。

### CSS Modules

[CSS Modules](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcss-modules%2Fcss-modules "https://github.com/css-modules/css-modules") 是解决命名空间问题的一种方案，它可以基于指定的规则生成选择器名称，无需开发者遵守严格的规范，同时也避免对全局样式造成污染。

以下是一个简单的例子，原始代码是这样的：

```css
    .test {
    color: red;
}
``````javascript
import styles from 'index.less';
// ...
<div className={styles.test} />
```

经过转换后，成为了这样:

```css
    ._xxxxxx {
    color: red;
}
``````javascript
var modules_xxx = {"test":"_xxxxxx"};
// ...
<div className={modules_xxx['test']} />
```

通过对选择器添加 hash 值等方法，使选择器不会与其他地方产生冲突。

但是当我们用 CSS Modules 开发组件库时，也需要考虑这些问题：

*   使用 CSS Modules 需要对组件库的编译流程进行一定处理。如果想采用样式和逻辑分离的打包方案，需要在打包出来的代码中移除对样式文件的引用语句，仅保留选择器名称转换的数据；如果使用样式和逻辑关联的方案，需要在保留选择器名称转换的同时，正确引入经过编译后的样式文件。
*   因为无法保证使用者的开发环境也支持 CSS Modules，因此无法将样式的源文件直接对外提供。
*   由于生成出的选择器名称不稳定，可能会经常变动，对于组件库的使用者来说，在外层不能对组件样式进行覆盖。

### CSS in JS

是的，CSS in JS 方案又出现了，因为这个方案在诞生之初，就有意解决 class 的命名问题。由于选择器名称都是动态生成的，所以开发时不需要遵守命名规范，也无需考虑命名冲突。

以 `Emotion` 为例：

```javascript
import styled from '@emotion/styled';
const Test = styled.div`
color: red;
`;
// ...
<Test />
```

在浏览器上运行时，真实的 DOM 被渲染成：

```html
<style data-emotion="css">.css-1vdv3ej{color:red;}</style>
<!-- ... -->
<div class="css-1vdv3ej"></div>
```

上文我们提到，CSS in JS 方案分为有运行时和零运行时两种类型，其中零运行时的方案最终经过编译会输出带有随机选择器命名的 CSS 文件，这个效果类似 CSS Modules。例如 `vanilla-extract` 就称自己为 “CSS Modules-in-TypeScript”。因此零运行时的 CSS in JS 方案可以用在所有支持常规 CSS 的方案中。

选型思考
====

![](/images/jueJin/13d9c0d27b45b69.png)

关联方案选择
------

选择一种样式方案，首先确定 CSS 与 JS 的关联方式，之后再考虑如何处理样式命名。

假如打算构建一个支持多框架的组件库，最优先考虑的打包方案是样式和逻辑分离。在这种方案下，产出一份基础样式，就可以在多框架的组件库里共用，不需要在各个框架中分别处理，适用性最广泛。

但是如果仅需要支持 React 技术栈，以上几种方案都可以根据使用情况进一步考虑：

在目前的时间节点构造一个组件库，本文的观点是：在满足兼容性的要求下，能够接受 CSS in JS 的写法，且可以容忍其自身的一些不足（如性能问题或一些写法限制），优先考虑有运行时的 CSS in JS 方案。组件库的开发者无需花精力处理样式的起名、引入和打包工作，在使用时也能很方便实现样式的按需加载，同时可以支持 SSR 和关键渲染路径的样式提取。

假如对 CSS in JS 的写法不太能接受，依然更偏向常规 CSS 的写法，或者觉得目前 CSS in JS 方案太多，难以做出抉择，那么还可以考虑以下常规 CSS 的方案：

如果组件库的应用场景明确不需要支持 SSR，且不需要考虑单独拿到 CSS 文件做缓存等性能优化，可以选择直接将 CSS 打包进 JS。这种方案不需要调整打包流程，使用者也只需要 `import` 组件即可使用，且逻辑和样式都能支持按需加载。

如果上面的条件不满足，可以优先选择样式与逻辑关联的方案。假如组件库用在内部项目中，需要该项目支持打包组件库里直接引入的样式文件。

样式与逻辑分离是最为通用且稳妥的方案。需要注意的是，这种方案实现按需加载比较麻烦，通常组件库会考虑提供一套生成按需加载样式语句的处理方法，例如引导用户使用 `babel-plugin-import`，并给出相应的配置。

命名方案选择
------

选择写常规 CSS ，还需要考虑样式的命名规则。

如果是基础 UI 组件库，更推荐使用约定命名规则的方案：

1.  UI 组件库通常维护人员较为固定，便于推行统一的命名规范；
2.  基础组件在业务中使用时，可能涉及到定制化场景。这种方案可以直接对外提供源码，便于在具体业务中覆盖变量或样式，给使用者更大的自由。

如果是业务组件库，则更推荐使用 CSS Modules / 零运行时 CSS in JS 方案：

1.  业务组件库本身与业务强相关，可能由不同业务的开发者维护，难以推行统一的命名规范，也无法保证所有人都能严格遵守。而使用 CSS Modules 可以帮助开发者保证样式的命名空间不会污染。
2.  业务组件较少涉及自定义的场景，不需要满足覆盖变量或样式的需求。

总结
==

目前在 React 生态中没有一种占统治地位的样式方案，而现有的各种方案都有各自的优缺点，因此选择一种合适的样式方案需要综合考虑很多方面。

本文从 CSS 与 JS 的关联方式和命名冲突处理方式两个方面对组件库的样式方案选型进行了对比和分析，没有哪种方案是完美的方案，但是不同的业务场景肯定会有更合适的方案，希望本文能对大家构建组件库时的选型提供一定的帮助。

参考
==

*   [如何在 React 中优雅的写 CSS](https://link.juejin.cn?target=https%3A%2F%2Fwww.zoo.team%2Farticle%2Freact-css "https://www.zoo.team/article/react-css")
*   [A Thorough Analysis of CSS-in-JS](https://link.juejin.cn?target=https%3A%2F%2Fcss-tricks.com%2Fa-thorough-analysis-of-css-in-js%2F "https://css-tricks.com/a-thorough-analysis-of-css-in-js/")
*   [Real-world CSS vs. CSS-in-JS performance comparison](https://link.juejin.cn?target=https%3A%2F%2Fpustelto.com%2Fblog%2Fcss-vs-css-in-js-perf%2F "https://pustelto.com/blog/css-vs-css-in-js-perf/")

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！