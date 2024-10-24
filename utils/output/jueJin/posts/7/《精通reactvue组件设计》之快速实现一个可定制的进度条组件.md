---
author: "徐小夕"
title: "《精通reactvue组件设计》之快速实现一个可定制的进度条组件"
date: 2020-02-02
description: "这篇文章是笔者写组件设计的第四篇文章,之所以会写组件设计相关的文章,是因为作为一名前端优秀的前端工程师,面对各种繁琐而重复的工作,我们不应该按部就班的去辛勤劳动,而是要根据已有前端的开发经验,总结出一套自己的高效开发的方法作为数据驱动的领导者reactvue等MVVM框…"
tags: ["React.js","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:33,comments:0,collects:44,views:4875,"
---
前言
--

这篇文章是笔者写组件设计的第四篇文章,之所以会写组件设计相关的文章,是因为作为一名前端优秀的前端工程师,面对各种繁琐而重复的工作,我们不应该按部就班的去"辛勤劳动",而是要根据已有前端的开发经验,总结出一套自己的高效开发的方法.作为数据驱动的领导者react/vue等MVVM框架的出现,帮我们减少了工作中大量的冗余代码, 一切皆组件的思想深得人心.所以, 为了让工程师们有更多的时间去考虑业务和产品迭代,我们不得不掌握高质量组件设计的思路和方法.所以笔者将花时间去总结各种业务场景下的组件的设计思路和方法,并用原生框架的语法去实现各种常用组件的开发,希望等让前端新手或者有一定工作经验的朋友能有所收获.

今天要来实现一个高可定制的进度条组件,在介绍组件设计之前,我们先牢记以下几个原则.

**每日一学: 组件设计三原则**

*   高内聚, 低耦合(尤其是vue/react组件中, 降低组件之间的耦合尤为重要)
*   组件边界划分清晰(每一个组件都有自己清晰的边界划分)
*   单一职责(每一个组件只负责某一特定的表现或者功能)

如果对于react/vue组件设计原理不熟悉的,可以参考我的上一篇文章:

[《精通react/vue组件设计》之用纯css打造类materialUI的按钮点击动画并封装成react组件](https://juejin.cn/post/6844904054917693453 "https://juejin.cn/post/6844904054917693453")

正文
--

在开始组件设计之前希望大家对css3和js有一定的基础.我们先看看实现后的组件效果:

![](/images/jueJin/17005c84660b4d8.png)

上图可以知道封装后的进度条组件通过对外暴露的接口(react/vue里面可以看做props属性)可以很快的实现多个不同的表现和重用.我将会使用react带大家实现这个进度条组件, 大家不用担心技术栈不一样,因为react实现的组件可以很快套用于vue项目中, 所以说底层原理非常重要.

### 1\. 组件原理和设计思路

由于组件设计的前提还是基于需求, 所以我们第一步是要确认需求. 一个进度条组件一般都会有如下需求点:

*   通过进度控制进度条长度
*   进度条总长度可以由用户来控制
*   随时修改精度条的额颜色(来自于设计师或产品经理独特而百变的审美)
*   当进度为100%时进度条可以自动消失(可能的需求)
*   进度提示文本(用户想知道当前长度下的具体进度, 比如体温计)
*   对于不同的进度节点,需要有不同的进度条颜色(比如游戏人物里的血, 快没血的时候为红色, 血满的时候为蓝色)

需求收集好之后,作为一个有追求的程序员, 会得出如下线框图:

![](/images/jueJin/17005d7e20a61b5.png)

这也是一个健壮的react/vue组件应有的思考角度.对于react选手来说,如果没用typescript,我建议大家都用PropTypes, 它是react内置的类型检测工具,我们可以直接在项目中导入. vue有自带的属性检测方式,笔者在这一点上认为vue还是很贴心的.

上面的思维导图我们也知道了, 进度条组件的实现原理就是通过对外暴露一定的属性,使用css先画一个进度条, 最后通过属性和样式之间的调度来实现我们需求满满的进度条.至于如何画进度条,下面会详细介绍.

### 2\. 基于react实现一个可定制的进度条组件

#### 2.1. 实现进度条的静态样式

首先我们会有一个容器来包裹我们的进度条,进度条和进度提示文字分开(为了更灵活的配置), 这样我们会得到一个如下的html结构:

```
<div className={styles.progressWrap}>
<div className={styles.progressBar}>
<div className={styles.progressInnerBar}></div>
</div>
<span className={styles.progressText}>{percent + '%'}</span>
}
</div>
```

.progressBar用来做进度条背景, .progressInnerBar用来做实际的进度条, .progressText为进度条文本.我们通过控制.progressInnerBar的宽度就能实现进度条的变化了, css代码如下:

```
    .progressWrap {
    margin: 6px 3px;
    display: inline-flex;
    align-items: center;
        .progressBar {
        position: relative;
        display: inline-block;
        height: 10px;
        background-color: #f0f0f0;
        border-radius: 5px;
        overflow: hidden;
            .progressInnerBar {
            position: absolute;
            height: 100%;
        }
    }
        .progressText {
        margin-left: 6px;
        margin-top: -2px;
        font-size: 14px;
    }
}
```

没错,css代码就这么简单, 我们用了css3比较流行的额弹性布局flex, css部分由于都比较简单,这里我只提一点就是.progressInnerBar的css,使用绝对定位, 因为这个部分未来可能会做动画,所以我们把它做成离屏dom, 因为它只做展示,它的宽度完全由js控制,后面我们会将会看到.

#### 2.2 实现组件外壳

我们根据我们收集到的需求, 可以对外暴露7个自定义属性(props),所以我们的react组件一定是这样的:

```
/**
* 进度条组件
* @param {themeColor} string 进度条的颜色
* @param {percent} number 进度值百分比
* @param {autoHidden} boolean 是否进度到100%时自动消失
* @param {hiddenText} boolean 是否影藏进度条文本
* @param {width} string|number 进度条的宽度
* @param {textColor} string 进度文本颜色
* @param {statusScope} array 状态阈值,分别设置不同进度范围的进度条颜色,最大允许设置3个值, 为一个二维数组
*/
    function Progress(props) {
        let {
        themeColor = '#06f',
        percent = 0,
        autoHidden = false,
        hiddenText = false,
        width = 320,
        textColor = '#666',
        statusScope
        } = props
        return
        <div className={styles.progressWrap}>
        <div className={styles.progressBar} style={{ width: typeof width === 'number' ? width + 'px' : width }}>
        <div
    className={styles.progressInnerBar}
        style={{
        width: `${percent}%`
    }}
    >
    </div>
    </div>
        {
        !hiddenText && <span className={styles.progressText} style={{ color: textColor }}>{percent + '%'}</span>
    }
    </div>
}
```

根据我们收集到的额需求我们很快可以知道react组件需要暴露哪些属性,而不会造成多余的属性,这一点是非常好的设计方法, 核心思想就是基于需求设计.所以我们当确定需求之后,其实组件已经实现了.这一经验一致应用于笔者很多实际项目中,也清晰的指引着我组件的最终实现.剩几个关键点如下:

*   设置进度区间
*   进度为100%时进度条自动消失

#### 3\. react组件细节和最终实现

react组件中,一个属性不一定要显性的赋值才能正常工作,比如上面代码中的hiddenText属性, 如果我们不设置false或者true, 那么react会默认为false, 如果只写了hiddenText属性而不赋值, react会自动认为它的值为true.这是react的一个设计细节,希望大家能了解掌握. 设置进度区间这个需求是组件唯一比较复杂的地方(相对来说,实际项目中有更复杂的案例),对应的属性为statusScope, 它的值为一个数组,之所以为数组是为了开发人员更容易理解和使用,它的值可能如下:

```
let scope = [[30, 'red'], [60, 'orange'], [80, 'blue']]
```

最大阈值为3,意思就是用户可以设置4种不同的进度状态.每一个状态用不同的颜色代替.由于用户可以不是按照从小到大的顺序写数组的,所以为了组件的可靠性和容错性, 笔者专门写了排序方法对用户传来的额二维数组进行排序.具体代码逻辑如下:

```
// 升序排序
let sortArr = arr => arr.sort((a,b) => a[0] - b[0])

// 检测值所对应的进度条颜色状态
    function checkStatus(scope, val, defaultColor) {
    val = +val
    // 从小到大排序
    sortArr(scope)
    
        if(scope.length === 1) {
        return val < scope[0][0] ? scope[0][1] : defaultColor
            }else if(scope.length === 2) {
        return val < scope[0][0] ? scope[0][1]
    : scope[0][0] < val && val < scope[1][0] ? scope[1][1]
    : defaultColor
        }else if(scope.length === 3) {
    return val < scope[0][0] ? scope[0][1]
: scope[0][0] < val && val < scope[1][0] ? scope[1][1]
: scope[1][0] < val && val < scope[2][0] ? scope[2][1]
: defaultColor
}
}
```

笔者不认为checkStatus是最优的计算阈值颜色的方法, 大家可以用更优雅的方法实现它.该方法的作用就是通过传入用户配置的区间和当前的进度值,来得到当前进度条的颜色.

进度为100%时进度条自动消失的逻辑也很简单,就是判断有这个属性,并且进度为100时将组件卸载就好了,所以相对完整的代码如下:

```
import styles from './index.less'

// 升序排序
let sortArr = arr => arr.sort((a,b) => a[0] - b[0])

// 检测值所对应的进度条颜色状态
    function checkStatus(scope, val, defaultColor) {
    val = +val
    // 从小到大排序
    sortArr(scope)
    
        if(scope.length === 1) {
        return val < scope[0][0] ? scope[0][1] : defaultColor
            }else if(scope.length === 2) {
        return val < scope[0][0] ? scope[0][1]
    : scope[0][0] < val && val < scope[1][0] ? scope[1][1]
    : defaultColor
        }else if(scope.length === 3) {
    return val < scope[0][0] ? scope[0][1]
: scope[0][0] < val && val < scope[1][0] ? scope[1][1]
: scope[1][0] < val && val < scope[2][0] ? scope[2][1]
: defaultColor
}
}

/**
* 进度条组件
* @param {themeColor} string 进度条的颜色
* @param {percent} number 进度值百分比
* @param {autoHidden} boolean 是否进度到100%时自动消失
* @param {hiddenText} boolean 是否影藏进度条文本
* @param {width} string|number 进度条的宽度
* @param {textColor} string 进度文本颜色
* @param {statusScope} array 状态阈值,分别设置不同进度范围的进度条颜色,最大允许设置3个值, 为一个二维数组
*/
    function Progress(props) {
        let {
        themeColor = '#06f',
        percent = 0,
        autoHidden = false,
        hiddenText = false,
        width = 320,
        textColor = '#666',
        statusScope
        } = props
        return +percent === 100 && autoHidden ?
        null :
        <div className={styles.progressWrap}>
        <div className={styles.progressBar} style={{ width: typeof width === 'number' ? width + 'px' : width }}>
        <div
    className={styles.progressInnerBar}
        style={{
        width: `${percent}%`,
        backgroundColor: statusScope && statusScope.length ? checkStatus(statusScope, percent, themeColor) : themeColor
    }}
    >
    </div>
    </div>
        {
        !hiddenText && <span className={styles.progressText} style={{ color: textColor }}>{percent + '%'}</span>
    }
    </div>
}
```

大家也许觉得到这里我们的组件就做好了.其实为了我们组件能够健壮的执行,我们用propType来对属性进行检测.关于react的propTypes的用法,我们可以去react官网自行学习,用法也很简单, 一下代码我也会做完善的额注释. 下面看看我们完整的效果演示:

![](/images/jueJin/17005fff8763926.png)

完整代码如下:

```
import PropTypes from 'prop-types'
import styles from './index.less'

// 升序排序
let sortArr = arr => arr.sort((a,b) => a[0] - b[0])

// 检测值所对应的进度条颜色状态
    function checkStatus(scope, val, defaultColor) {
    val = +val
    // 从小到大排序
    sortArr(scope)
    
        if(scope.length === 1) {
        return val < scope[0][0] ? scope[0][1] : defaultColor
            }else if(scope.length === 2) {
        return val < scope[0][0] ? scope[0][1]
    : scope[0][0] < val && val < scope[1][0] ? scope[1][1]
    : defaultColor
        }else if(scope.length === 3) {
    return val < scope[0][0] ? scope[0][1]
: scope[0][0] < val && val < scope[1][0] ? scope[1][1]
: scope[1][0] < val && val < scope[2][0] ? scope[2][1]
: defaultColor
}
}


/**
* 进度条组件
* @param {themeColor} string 进度条的颜色
* @param {percent} number 进度值百分比
* @param {autoHidden} boolean 是否进度到100%时自动消失
* @param {hiddenText} boolean 是否影藏进度条文本
* @param {width} string|number 进度条的宽度
* @param {textColor} string 进度文本颜色
* @param {statusScope} array 状态阈值,分别设置不同进度范围的进度条颜色,最大允许设置3个值, 为一个二维数组
*/
    function Progress(props) {
        let {
        themeColor = '#06f',
        percent = 0,
        autoHidden = false,
        hiddenText = false,
        width = 320,
        textColor = '#666',
        statusScope
        } = props
        return +percent === 100 && autoHidden ?
        null :
        <div className={styles.progressWrap}>
        <div className={styles.progressBar} style={{ width: typeof width === 'number' ? width + 'px' : width }}>
        <div
    className={styles.progressInnerBar}
        style={{
        width: `${percent}%`,
        backgroundColor: statusScope && statusScope.length ? checkStatus(statusScope, percent, themeColor) : themeColor
    }}
    >
    </div>
    </div>
        {
        !hiddenText && <span className={styles.progressText} style={{ color: textColor }}>{percent + '%'}</span>
    }
    </div>
}

    Progress.propTypes = {
    themeColor: PropTypes.string,
    percent: PropTypes.number,
    autoHidden: PropTypes.bool,
    textAlign: PropTypes.string,
    hiddenText: PropTypes.bool,
        width: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
        ]),
        statusScope: PropTypes.array
    }
    
    export default Progress
```

关于如何使用,我就不做过多说明了,这里举2个例子:

```
<Progress
percent={percent}
width={240}
autoHidden
/>

<Progress
percent={10}
themeColor="#6699FF"
statusScope={[[18, 'red'], [40, 'orange']]}
/>
```

最后
--

如果想学习更多**H5游戏**, **webpack**，**node**，**gulp**，**css3**，**javascript**，**nodeJS**，**canvas数据可视化**等前端知识和实战，欢迎在公号《趣谈前端》加入我们一起学习讨论，共同探索前端的边界。

![](/images/jueJin/170060658dd3db9.png)

更多推荐
----

*   [2年vue项目实战经验汇总](https://juejin.cn/post/6844904056893243400 "https://juejin.cn/post/6844904056893243400")
*   [《精通react/vue组件设计》之用纯css打造类materialUI的按钮点击动画并封装成react组件](https://juejin.cn/post/6844904054917693453 "https://juejin.cn/post/6844904054917693453")
*   [15分钟带你了解前端工程师必知的javascript设计模式(附详细思维导图和源码)](https://juejin.cn/post/6844904054498263053 "https://juejin.cn/post/6844904054498263053")
*   [2019年,盘点一些我出过的前端面试题以及对求职者的建议](https://juejin.cn/post/6844904052388708366 "https://juejin.cn/post/6844904052388708366")
*   [基于jsoneditor二次封装一个可实时预览的json编辑器组件(react版)](https://juejin.cn/post/6844904053781037064 "https://juejin.cn/post/6844904053781037064")
*   [一张图教你快速玩转vue-cli3](https://juejin.cn/post/6844903877133729799 "https://juejin.cn/post/6844903877133729799")
*   [vue高级进阶系列——用typescript玩转vue和vuex](https://juejin.cn/post/6844903831956897806 "https://juejin.cn/post/6844903831956897806")
*   [《前端实战总结》之使用纯css实现网站换肤和焦点图切换动画](https://juejin.cn/post/6844904024542543880 "https://juejin.cn/post/6844904024542543880")
*   [《前端实战总结》之使用CSS3实现酷炫的3D旋转透视](https://juejin.cn/post/6844904001633255431 "https://juejin.cn/post/6844904001633255431")
*   [《前端实战总结》之使用pace.js为你的网站添加加载进度条](https://juejin.cn/post/6844903998261035021 "https://juejin.cn/post/6844903998261035021")
*   [《前端实战总结》之设计模式的应用——备忘录模式](https://juejin.cn/post/6844903993232064526 "https://juejin.cn/post/6844903993232064526")
*   [《前端实战总结》之使用postMessage实现可插拔的跨域聊天机器人](https://juejin.cn/post/6844903989843066887 "https://juejin.cn/post/6844903989843066887")
*   [《前端实战总结》之变量提升，函数声明提升及变量作用域详解](https://juejin.cn/post/6844903985695080455 "https://juejin.cn/post/6844903985695080455")
*   [《前端实战总结》如何在不刷新页面的情况下改变URL](https://juejin.cn/post/6844903984222699527 "https://juejin.cn/post/6844903984222699527")