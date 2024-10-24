---
author: "徐小夕"
title: "《精通reactvue组件设计》之用纯css打造类materialUI的按钮点击动画并封装成react组件"
date: 2020-02-01
description: "作为一个前端框架的重度使用者,在技术选型上也会非常注意其生态和完整性笔者先后开发过基于vue,react,angular等框架的项目,碧如vue生态的elementUI, ant-design-vue, iView等成熟的UI框架, react生态的ant-design, m…"
tags: ["React.js","CSS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:35,comments:0,collects:46,views:4947,"
---
前言
--

作为一个前端框架的重度使用者,在技术选型上也会非常注意其生态和完整性.笔者先后开发过基于vue,react,angular等框架的项目,碧如vue生态的elementUI, ant-design-vue, iView等成熟的UI框架, react生态的ant-design, materialUI等,这些第三方UI框架极大的降低了我们开发一个项目的成本和复杂度,使开发者更专注于实现业务逻辑和服务化.

但随着对用户体验的越来越重视,对交互体验要求的提高以及css3等新标准的出现,使得web更加大放异彩, 各种动效的实现都变得非常容易.笔者在研究materialUI框架时对于它的交互及其赞叹.所以为了自己能实现一个类似materialUI的按钮点击动画,并封装到自己的UI库中,笔者特地总结了一些思路,希望可以和广大的前端工程师们一起探讨.

正文
--

首先我们看一下materialUI的按钮点击效果:

![](/images/jueJin/16fffbdd39bf25b.png)

本质上也是用了css3动画的特性, 笔者查看源代码和通过点击发现materialUI会根据点击位置不同而作不同位置的动画,这个有点意思.我们先不讲这么复杂的例子,下面通过css3的方案来实现一个类似的效果.笔者实现的效果如下:

![](/images/jueJin/16fffd0df1913a2.png)

上图已经是笔者基于react封装好的一个按钮Button组件,那么我们就先一步步实现它吧.

### 1\. 原理

这个动效的原理其实也很简单,就是利用css3的transition过渡动画,配合::after伪对象就可以实现,点击的时候由于元素会激活:active伪类, 然后我们基于这个伪类, 在::after伪对象上做背景的动画即可. 伪代码如下:

```
    .xButton {
    position: relative;
    overflow: hidden;
    display: inline-block;
    padding: 6px 1em;
    border-radius: 4px;
    color: #fff;
    background-color: #000;
    user-select:none;   // 禁止用户选中
    cursor: pointer;
}

    .ripple {
        &::after {
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-image: radial-gradient(circle, #fff 10%, transparent 11%);
        background-repeat: no-repeat;
        background-position: 50%;
        transform: scale(12, 12);
        opacity: 0;
        transition: transform .6s cubic-bezier(.75,.23,.43,.82), opacity .6s;
    }
        &:active::after {
        transform: scale(0, 0);
        opacity: .5;
    }
}
```

以上代码就是通过设置transform的scale以及透明度, 并且设置一个渐变的径向背景图像来实现水波纹动画的为了实现更优雅的动画,上面的css动画的实现可以借助[cubic-bezier](https://link.juejin.cn?target=https%3A%2F%2Fcubic-bezier.com%2F%23.75%2C.23%2C.43%2C.82 "https://cubic-bezier.com/#.75,.23,.43,.82")这个在线工具,他可以生成各种不同形式的贝塞尔曲线.工具长这样:

![](/images/jueJin/16fffe17535f511.png)

### 2\. 组件设计思路

仅仅用上述代码虽然可以实现一个按钮点击的动画效果,但是并不通用, 也不符合作为一个经验丰富的程序员的风格,所以接下来我们要一步步把它封装成一个通用的按钮组件,让它无所不用.

组件的设计思路我这里参考ant-design的模式, 基于开闭原则,我们知道一个可扩展的按钮组件一般都具备如下特点:

*   允许用户修改按钮样式
*   对外暴露按钮事件方法
*   提供按钮主题和外形配置
*   可插拔,可组合 基于以上几点,我们来设计这个react组件.

### 3\. 基于react和css3的button组件具体实现

首先,我们的组件是采用react实现, 技术点我会采用比较流行的umi脚手架, classnames库以及css Module, 代码很简单, 我们来看看吧.

```
import classnames from 'classnames'
import styles from './index.less'

/**
* @param {onClick} func 对外暴露的点击事件
* @param {className} string 自定义类名
* @param {type} string 按钮类型 primary | warning | info | default | pure
* @param {shape} string 按钮形状 circle | radius(默认)
* @param {block} boolean 按钮展示 true | false(默认)
*/
    export default function Button(props) {
    let { children, onClick, className, type, shape, block } = props
    return <div
className={classnames(styles.xButton, styles.ripple, styles[type], styles[shape], block ? styles.block : '', className)}
onClick={onClick}
>
{ children }
</div>
}
```

这是button的js部分,也是组件设计的核心, 按钮组件对外暴露了onClick, className, type, shape, block这几个props, className用于修改组件类名以便控制组件样式, type主要是控制组件的风格, 类似于antd的primary等样式, shape用来控制是否是圆形按钮还是圆角按钮, block用来控制按钮是否是块.具体形式如下:

![](/images/jueJin/16ffffd15716046.png)

经过优化后的css长这样:

```
    .xButton {
    box-sizing: border-box;
    display: inline-block;
    padding: 6px 1em;
    border-radius: 4px;
    color: #fff;
    font-family: inherit;
    background-color: #000;
    user-select:none;   // 禁止用户选中
    cursor: pointer;
    text-align: center;
        &.primary {
        background-color: #09f;
    }
        &.warning {
        background-color: #F90;
    }
        &.info {
        background-color: #C03;
    }
        &.pure {
        border: 1px solid #ccc;
        color: rgba(0, 0, 0, 0.65);
        background-color: #fff;
            &::after {
            background-image: radial-gradient(circle, #ccc 10%, transparent 11%);
        }
    }
    
    // 形状
        &.circle {
        border-radius: 1.5em;
    }
    
    // 适应其父元素
        &.block {
        // width: 100%;
        display: block;
    }
}

    .ripple {
    position: relative;
    overflow: hidden;
        &::after {
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
        background-image: radial-gradient(circle, #fff 10%, transparent 11%);
        background-repeat: no-repeat;
        background-position: 50%;
        transform: scale(12, 12);
        opacity: 0;
        transition: transform .6s, opacity .6s;
    }
        &:active::after {
        transform: scale(0, 0);
        opacity: .3;
        //设置初始状态
        transition: 0s;
    }
}
```

我们实现按钮样式的切换完全是用css module带来的高灵活性, 使其让属性和类名高度关联. 接下来看看我们如何使用吧:

```
// index.js
import { Button } from '@/components'
import styles from './index.css'
    export default function() {
    return (
    <div className={styles.normal}>
    <Button className={styles.btn}>default</Button>
    <Button className={styles.btn} type="warning">warning</Button>
    <Button className={styles.btn} type="primary">primary</Button>
    <Button className={styles.btn} type="info">info</Button>
    <Button className={styles.btn} type="pure">pure</Button>
    <Button className={styles.btn} type="primary" shape="circle">circle</Button>
    <Button className={styles.mb16} type="primary" block>primary&block</Button>
    <Button type="warning" shape="circle" block onClick={() => { alert('block')}}>circle&block</Button>
    </div>
    )
}
```

之前我们看到的按钮样式就是通过如上代码生成的,是不是很简单呢? 来我们再次看看点击的动效:

![](/images/jueJin/1700005b444baf1.png)

其实不仅仅是react, 我们使用同样的原理也可以实现一个vue版的按钮组件或者一个angular版的组件,变得只是语法而已.这样的组件设计思路和元素被官方用在很多ui库中, 比如单一职责原理, 组件的开闭原则, 去中心,可组合等,希望对大家今后设计组件有所帮助.

最后
--

如果想了解本文完整的思维导图, 更多**H5游戏**, **webpack**，**node**，**gulp**，**css3**，**javascript**，**nodeJS**，**canvas数据可视化**等前端知识和实战，欢迎在公号《趣谈前端》加入我们一起学习讨论，共同探索前端的边界。

![](/images/jueJin/16ba43b87c51361.png)

更多推荐
----

*   [15分钟带你了解前端工程师必知的javascript设计模式(附详细思维导图和源码)](https://juejin.cn/post/6844904054498263053 "https://juejin.cn/post/6844904054498263053")
*   [2019年,盘点一些我出过的前端面试题以及对求职者的建议](https://juejin.cn/post/6844904052388708366 "https://juejin.cn/post/6844904052388708366")
*   [基于jsoneditor二次封装一个可实时预览的json编辑器组件(react版)](https://juejin.cn/post/6844904053781037064 "https://juejin.cn/post/6844904053781037064")
*   [一张图教你快速玩转vue-cli3](https://juejin.cn/post/6844903877133729799 "https://juejin.cn/post/6844903877133729799")
*   [vue高级进阶系列——用typescript玩转vue和vuex](https://juejin.cn/post/6844903831956897806 "https://juejin.cn/post/6844903831956897806")
*   [基于nodeJS从0到1实现一个CMS全栈项目（上）](https://juejin.cn/post/6844903952761225230 "https://juejin.cn/post/6844903952761225230")
*   [基于nodeJS从0到1实现一个CMS全栈项目（中）](https://juejin.im/editor/posts/5d8c7b66518825761b4c1e04 "https://juejin.im/editor/posts/5d8c7b66518825761b4c1e04")
*   [基于nodeJS从0到1实现一个CMS全栈项目（下）](https://juejin.cn/post/6844903955797901319 "https://juejin.cn/post/6844903955797901319")
*   [5分钟教你用nodeJS手写一个mock数据服务器](https://juejin.cn/post/6844903937330380814 "https://juejin.cn/post/6844903937330380814")
*   [《前端实战总结》之使用纯css实现网站换肤和焦点图切换动画](https://juejin.cn/post/6844904024542543880 "https://juejin.cn/post/6844904024542543880")
*   [《前端实战总结》之使用CSS3实现酷炫的3D旋转透视](https://juejin.cn/post/6844904001633255431 "https://juejin.cn/post/6844904001633255431")
*   [《前端实战总结》之使用pace.js为你的网站添加加载进度条](https://juejin.cn/post/6844903998261035021 "https://juejin.cn/post/6844903998261035021")
*   [《前端实战总结》之设计模式的应用——备忘录模式](https://juejin.cn/post/6844903993232064526 "https://juejin.cn/post/6844903993232064526")
*   [《前端实战总结》之使用postMessage实现可插拔的跨域聊天机器人](https://juejin.cn/post/6844903989843066887 "https://juejin.cn/post/6844903989843066887")
*   [《前端实战总结》之变量提升，函数声明提升及变量作用域详解](https://juejin.cn/post/6844903985695080455 "https://juejin.cn/post/6844903985695080455")
*   [《前端实战总结》如何在不刷新页面的情况下改变URL](https://juejin.cn/post/6844903984222699527 "https://juejin.cn/post/6844903984222699527")
*   [用css3实现惊艳面试官的背景即背景动画（高级附源码）](https://juejin.cn/post/6844903950123188237 "https://juejin.cn/post/6844903950123188237")
*   [教你用200行代码写一个爱豆拼拼乐H5小游戏（附源码）](https://juejin.cn/post/6844903893961293831 "https://juejin.cn/post/6844903893961293831")
*   [笛卡尔乘积的javascript版实现和应用](https://juejin.cn/post/6844903928577048583 "https://juejin.cn/post/6844903928577048583")