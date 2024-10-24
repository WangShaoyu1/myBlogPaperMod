---
author: "yck"
title: "时代变了，现在居然可以这样写 CSS 了｜牛气冲天新年征文"
date: 2021-02-11
description: "以上代码就是举个例子，大部分情况应该都是写一个类，然后整一堆样式进去。 取名困难，节点结构一多，取名真的是个难事。当然了，我们可以用一些规范或者选择器的方式去规避一些取名问题。 需要用 JS 控制样式的时候又得多写一个类，尤其交互多的场景。 组件复用大家都懂，但是样式复用少之又…"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读11分钟"
weight: 1
selfDefined:"likes:76,comments:11,collects:65,views:9197,"
---
> 文章永远首发自我的 [Github](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FKieSun%2FDream "https://github.com/KieSun/Dream")，大家可以关注点赞，通常会早于发布各大平台一周时间以上。

现在大部分搞前端的应该还是这样写 CSS 的：

```html
    .mock {
    margin: auto;
    font-size: 16px;
    // ...
}
<div class='mock'>mock</div>
```

以上代码就是举个例子，大部分情况应该都是写一个类，然后整一堆样式进去。

但是这种方式写多了以后，你应该会感受到一些痛点，比如说：

*   取名困难，节点结构一多，取名真的是个难事。当然了，我们可以用一些规范或者选择器的方式去规避一些取名问题。
*   需要用 JS 控制样式的时候又得多写一个类，尤其交互多的场景。
*   组件复用大家都懂，但是样式复用少之又少，这样就造成了冗余代码变多。
*   全局污染，这个其实现在挺多工具都能帮我们自动解决了。
*   死代码问题。JS 我们通过 tree shaking 的方式去除用不到的代码减少文件体积，但是 CSS 该怎么去除？尤其当项目变大以后，无用 CSS 代码总会出现。
*   样式表的插入顺序影响了 CSS 到底是如何生效的。
*   等等，不一一说明了。其实对于笔者而言，第一二块在开发中是最难受的两个点，尤其是刚写前端，需要做活动 / 产品页的时候。

当下，社区里有一些 CSS 方案，能够解决以上一些痛点：

*   Atom CSS
*   CSS-in-JS
*   上述两者的结合体

本文就来聊聊以上三种方案的优缺点以及各自方案的代表作。

Atom CSS
--------

首先来聊聊啥叫做 Atom CSS：意思是一个类只干一件事，比如说：

```css
    .m-8 {
    margin: 8px;
}
```

想象一下你按照这样的思想搞出一大堆类似的类名，就能整出一个践行 Atom CSS 方案的三方库了，[tailwindcss](https://link.juejin.cn?target=https%3A%2F%2Ftailwindcss.com%2F "https://tailwindcss.com/") 就是这个方案里的佼佼者。其实 Atom CSS 很多人应该早都用过了，栅格系统上就有它的身影，无非不清楚原来它就是 Atom CSS 罢了。

我们先来看看如果用 tailwindcss 的话，写好样式的 HTML 大概长啥样：

![](/images/jueJin/77dd4023236d480.png)

上图是人家官网上的，在这之前还有一段挺炫的动画。看起来好像挺方便的，写上一堆类名就能出左边好看的样式了，省了很多写样式的时间，但是读者们可以来想想这种方式它会有啥好处及弊端？

在说优缺点之前，我们先来聊聊 Atom CSS 的历史。其实它并不是一个新兴产物，这玩意你往前推个十年就能看到它的讨论。正所谓天道好轮回，苍天饶过谁。Atom CSS 以前火过，而且是被喷火的，沉寂了几年之后这几年又被拿出来说了。

接下来我们以 tailwindcss 为例来聊聊 Atom CSS 方案的优劣点。

### 优劣点

如果你想在团队内部推广这个产品，学习成本会是一个问题，毕竟需要大家都看得懂你这坨东西到底是啥意思，这算一个很明显的缺陷。但是对于语法问题你还真的不用怎么担心，tailwindcss 是有语法补全的工具链的，Webstorm 已经内置了，VSCode 需要大家自行装个插件，所以喷写 tailwindcss 语法麻烦的可以歇一歇。

样式复用，就像写组件一样，这次我们是把样式一个个抽离了出来，这样带来的一大好处是减少了 CSS 代码文件体积。

原本传统的写法是定义一个类，然后写上需要的样式：

```css
    .class1 {
    font-size: 18px;
    margin: 10px;
}
    .class2 {
    font-size: 16px;
    color: red;
    margin: 10px;
}
```

这种写法是存在一部分样式重复的，换成 Atom CSS 就能减少一部分代码的冗余。

把 CSS 当成组件来写。大家乍一看 tailwindcss 官网肯定会觉得我在 HTML 里写个样式要敲那么多类是有病吧？

```html
<figure class="md:flex bg-gray-100 rounded-xl p-8 md:p-0">
<img class="w-32 h-32 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto" src="/sarah-dayan.jpg" alt="" width="384" height="512">
<div class="pt-6 md:p-8 text-center md:text-left space-y-4">
<blockquote>
<p class="text-lg font-semibold">
“Tailwind CSS is the only framework that I've seen scale
on large teams. It’s easy to customize, adapts to any design,
and the build size is tiny.”
</p>
</blockquote>
<figcaption class="font-medium">
<div class="text-cyan-600">
Sarah Dayan
</div>
<div class="text-gray-500">
Staff Engineer, Algolia
</div>
</figcaption>
</div>
</figure>
```

其实我们是可以利用 Atom CSS 一次只干一件事的特性，将这些类随意组装成我们想要的类，这样就可以提供出来一个更上层的通用样式来复用。

比如说项目中的按钮都是存在通用的圆角、内边距、字体等，这样我们就可以封装出这样一个类：

```css
    .btn {
    @apply p-8 rounded-xl font-semibold
}
```

效率工具。tailwindcss 用的好肯定是能提高写布局的效率的，尤其对于需要做响应式的页面而言。当然这东西其实也算是甲之蜜糖乙之砒霜，评价两极分化很严重，有人认为提高了效率，也有人认为反而是增加了成本，或者说是脱裤子放屁。

提供了一整套规范化的设计模式，直接点说就是 tailwindcss 给你内置好一套优秀的设计主题了。但是这玩意对于规范的视觉团队来说是个不小的福音，不规范的话就可能是火葬场了。下面我给大家举个例子：

```js
// tailwind.config.js
const colors = require('tailwindcss/colors')

    module.exports = {
        theme: {
            screens: {
            sm: '480px',
            md: '768px',
            lg: '976px',
            xl: '1440px',
            },
                colors: {
                gray: colors.coolGray,
                blue: colors.lightBlue,
                red: colors.rose,
                pink: colors.fuchsia,
                },
                    fontFamily: {
                    sans: ['Graphik', 'sans-serif'],
                    serif: ['Merriweather', 'serif'],
                    },
                        extend: {
                            spacing: {
                            '128': '32rem',
                            '144': '36rem',
                            },
                                borderRadius: {
                                '4xl': '2rem',
                            }
                        }
                    }
                }
```

以上是 tailwindcss 的主题配置文件，大家可以按照视觉的要求来做调整。比如说今天视觉觉得屏幕的 lg 尺寸应该是 `976px`，过段时间又觉得需要改成 `1000px`。对于开发者而言我们只需要修改一行代码就能全局生效了，很舒服。

但是假如说视觉原本定义的边距规则如下：

```js
// tailwind.config.js
    module.exports = {
        theme: {
            spacing: {
            px: '1px',
            0: '0',
            0.5: '0.125rem',
            1: '0.25rem',
            1.5: '0.375rem',
            2: '0.5rem',
            2.5: '0.625rem',
            3: '0.75rem',
            3.5: '0.875rem',
            4: '1rem',
            5: '1.25rem',
            6: '1.5rem',
            7: '1.75rem',
            8: '2rem',
            // ...
            },
        }
    }
```

现在需要我们把 `6` 换成 `1.6rem`，但是这个规则只需要作用在某些组件上，此时我们需要如何修改样式？新增一个 `spacing` 然后一个个去替换需要的地方么？

上述场景笔者认为还是不少见的，最起码在我们公司内部是存在这样的问题。已经定义了视觉规范并体现在内部的组件库上，但是在业务中还是有不少视觉会去动组件的基本样式，这里改个边距，那里改个颜色等等。原本组件库是为了帮助开发者提效的，但是在这种场景下开发者反而会抱怨改动样式极大提高了他们的成本，并且大部分情况下还不得不这样做。

再说回传统 CSS 的问题，其实 tailwindcss 也解决了一部分，但是仍旧存在没解决的点，比如说：

*   死代码问题没解决
*   样式表的插入顺序依旧有影响

以上说了那么多，其实对于我们使用 tailwindcss 而言，有利也有弊。它肯定是存在很好用的场景的，比如说写个人的产品页，或者说业务中样式变化不频繁的场景中，但是如果说需要业务中全量切换到 tailwindcss 的话，笔者肯定是持保留态度的。

对于 Atom CSS 来说，大家应该是不能否认它的优点的，但是我们是否有办法在尽可能避免它的缺点的情况下又获得它的优点呢？答案是有的，但是在讲答案之前我想先来聊聊 CSS-in-JS。

CSS-in-JS
---------

CSS-in-JS（下文以 CIJ 缩写表示）核心就是在用 JS 写 CSS，这同样也是一个颇具争议的技术方案。

在这个领域下有两个库比较流行，分别为：styled-components（下文以 sc 缩写表示） 以及 Emotion。笔者目前已经用了一年多的 sc 了，来粗略谈谈它的优缺点。

我们先来了解下 sc 是怎么使用的。首先说下 sc 和 Emotion 的语法是趋于一致的，应该是为了 API 层面的统一吧，甚至前者还依赖了后者的一些包，以下是 sc 的常用写法：

```js
const Button = styled.a`
display: inline-block;

${props => props.primary && css`
background: white;
color: black;
`}
`
render(
<div>
<Button
href="https://github.com/styled-components/styled-components"
target="_blank"
rel="noopener"
primary
>
GitHub
</Button>

<Button as={Link} href="/docs">
Documentation
</Button>
</div>
)
```

用法我们不多展开，有兴趣的可以去[官方](https://link.juejin.cn?target=https%3A%2F%2Fstyled-components.com%2F "https://styled-components.com/")看看，基本没有学习成本的，主要是一些样式组件上的使用。

另外 sc 并不是最终生成了内联样式，而是帮我们插入了 `style` 标签。

### 优劣点

笔者用了一年多的 sc，感觉这种方案对于 React 来说是很香的。并且解决了我很讨厌的传统写 CSS 的一些点，所以关于优劣点这段的讲述会有点主观。

首先 CSS-in-JS 这种方案不仅能让我们完整使用到 CSS 的功能，而且还扩充了一些用法。比如说选择器这块，在 sc 中我们能通过选择组件的方式来编写样式，如下代码：

```js
const Button = styled.a`
    ${Icon} {
    color: green;
}
`
```

另外既然我们通过 JS 来管理 CSS 了，那么我们就可以充分享受 JS 带来的工具链好处了。一旦项目中出现没有使用到的样式组件，那么 ESLint 就可以帮助我们找到那些死代码并清除，这个功能对于大型项目来说还是能减少一部分代码体积的。

除此之外，样式污染、取名问题、自动添加前缀这些问题也很好的解决了。

除了以上这些，再来聊两点不容易注意到的。

首先是动态切换主题。因为我们是通过 JS 来写 CSS 了，那么我们就可以动态地控制样式。如果你的项目有切换主题这种类似的大量动态 CSS 的需求，那么这个方案会是一个不错的选择。

还有个点是按需加载。因为我们是通过 JS 写的 CSS，现阶段打包基本都走的 code split，那么就可以实现 CSS 文件的按需加载，而不是传统方式的一次性全部加载进来（当然也是可以优化的，只是没那么方便）。

聊完了优点我们再来说说缺点。

第一个缺点很明显，有学习成本，当然笔者觉得这个学习曲线还是平缓的。

运行时成本，sc 本身就有文件体积，加上还需要动态生成 CSS，那么这其中必定有性能上的损耗。项目越大影响的也会越大，如果你的项目对于性能有很高的要求，那么需要谨慎考虑使用。另外因为 CSS 动态生成，所以不能像传统 CSS 一样缓存 CSS 文件了。

代码复用性和传统写 CSS 的方式没啥两样。

最后点是代码耦合问题。会有人觉得在大型项目中将 CSS 及 JS 写在一起会增加维护成本，并且也不符合 CSS 需要分离开来想法。

Atom CSS 加上 CSS-in-JS 的缝合怪
--------------------------

看了上文，如果你觉得两种方案都挺好的话，可以了解下 [twin.macro](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fben-rogerson%2Ftwin.macro "https://github.com/ben-rogerson/twin.macro")，这个库（还有别的竞品）把这两种方案融合了起来。

```js
import 'twin.macro'

const Input = () => <input tw="border hover:border-black" />
const Input = tw.input`border hover:border-black`
```

这种方案之上其实还有更好玩的方式，能帮助我们尽量取其精华而去其糟粕。

自动生成 Atom CSS 的 CSS-in-JS 方案
----------------------------

假如说我不仅想用 CSS-in-JS，还想把 Atom CSS 也给整上，但是又不想记 / 写一大堆类名，我这个想法能实现么？

答案是有的。利用运行时的方式把单个样式抽离出来，最后实现虽然我们写的是 CSS-in-JS，但是最终呈现的是 Atom CSS 的样子。

以 [styletron](https://link.juejin.cn?target=https%3A%2F%2Fwww.styletron.org%2F "https://www.styletron.org/") 举个例子，开发时候的代码长这样：

```js
import { styled } from "styletron-react";

    export default () => {
    // Create a styled component by passing
    // an element name and a style object
        const Anchor = styled("a", {
        fontSize: "20px",
        color: "red"
        });
        return <Anchor href="/getting-started">Start!</Anchor>;
        };
```

实际编译出来的时候长这样：

```js
<html>
<head>
<style>
    .foo {
    font-size: 20px;
}
    .bar {
    color: red;
}
</style>
</head>
<body>
<a href="/getting-started" class="foo bar">Start!</a>
</body>
</html>
```

这样的方式就能很好地享受到两种方案带来的好处了。但是这类方案笔者找了些竞品，觉得还没有前两者方案来的流行，大家了解一下即可。另外这种方式带来的运行时成本应该会更大，也许可以配套打包工具在本地先做一次预编译（一个不成熟的想法，说错勿喷）？

总结
--

说了那么多方案，可能读者会有疑问，那么我到底该用啥？这里笔者说下自己的想法。

首先对于 sc 来说，笔者觉得很香，在项目中大范围用起来未尝不可，当然我们还可以搭配着 Atom CSS 一起来写通用样式。

对于 Atom CSS，笔者个人认为不适合项目中大规模使用，起码在我们公司内部不会是一个好方案，毕竟视觉真的会来动某些通用样式。

大家也可以来说说各自的看法。

> 本文同步更新于公众号[「前端真好玩」](https://link.juejin.cn?target=https%3A%2F%2Fyck-1254263422.cos.ap-shanghai.myqcloud.com%2F20191223215610.jpeg "https://yck-1254263422.cos.ap-shanghai.myqcloud.com/20191223215610.jpeg")，欢迎关注。