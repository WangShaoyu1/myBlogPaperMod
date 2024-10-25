---
author: "徐小夕"
title: "精通ReactVue系列之手把手带你实现一个功能强大的通知提醒框(Notification)"
date: 2020-02-16
description: "本文是笔者写组件设计的第十篇文章, 今天带大家实现一个比较特殊的组件——通知提醒框(Notification)。 该组件在诸如Antd或者elementUI等第三方组件库中也都会出现,主要用来为用户提供系统通知信息的.我们在调用它时并不像其他组件一样，通过引入组件标签来调用。比…"
tags: ["React.js","前端框架中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读12分钟"
weight: 1
selfDefined:"likes:45,comments:14,collects:57,views:5491,"
---
![](/images/jueJin/170490d6ba552a4.png)

前言
--

本文是笔者写组件设计的第十篇文章, 今天带大家实现一个比较特殊的组件——通知提醒框(Notification)。 该组件在诸如Antd或者elementUI等第三方组件库中也都会出现,主要用来为用户提供系统通知信息的.我们在调用它时并不像其他组件一样，通过引入组件标签来调用。比如Modal组件，我们一般这样来调用：

```
<Modal title="xui基础弹窗" centered mask={false} visible={false}>
<p>我是弹窗内容</p>
<p>我是弹窗内容</p>
<p>我是弹窗内容</p>
<p>我是弹窗内容</p>
</Modal>
```

但是通知提醒框(Notification)，大多数场景下是使用js API的方式调用：

```
    notification.open({
    message: '趣谈前端React',
    description: '学前端，学React/vue/Node，快快加入我们吧'
    });
```

我们看到的组件效果可能是这样的：

![](/images/jueJin/1704914f4ce4cec.png)

那么我们如何实现这样的调用方式呢？不用急，接下来笔者会一步步教你实现。

先来巩固以下组件的分类法：

*   通用型组件: 比如Button, Icon等.
*   布局型组件: 比如Grid, Layout布局等.
*   导航型组件: 比如面包屑Breadcrumb, 下拉菜单Dropdown, 菜单Menu等.
*   数据录入型组件: 比如form表单, Switch开关, Upload文件上传等.
*   数据展示型组件: 比如Avator头像, Table表格, List列表等.
*   反馈型组件: 比如Progress进度条, Drawer抽屉, Modal对话框等.
*   其他业务类型

熟悉以上分类法是设计任何组件系统的前提，不管你是从零到一开发前端团队的UI库，还是基于已有组件库二次开发业务组件，以上分类法则同样适用。

本文将会使用React来开发该组件，也会使用到Javascript中常用的一些**设计模式**，比如**单例模式**，但是不管你使用什么框架来实现，原理都是通用的，如果感兴趣的朋友可以用vue也实现以一下。如果对设计模式不是很了解，可以移步:

[15分钟带你了解前端工程师必知的javascript设计模式(附详细思维导图和源码)](https://juejin.cn/post/6844904054498263053 "https://juejin.cn/post/6844904054498263053").

正文
--

在开始组件设计之前希望大家对css3和js有一定的基础,并了解基本的react/vue语法.我们先来解构一下Notification组件, 一个Notification分为以下几个部分:

![](/images/jueJin/170491efd067ef1.png)

每一个区块都可以自定义配置, 也可以组合其他组件.并且我们可以配置提醒框出现的位置，就像antd的组件一样，我们有左上，左下，右上，右下这几个位置可以配置，也可以配置基于这几个位置的偏移量。并且我们都知道，antd或者element这种组件库，会自带一些主题状态，来提高用户的使用效率，比如会有success(成功状态)，warning(警告状态)，error(错误状态)，info(通知状态)等，那么我们自己实现的组件也因该具备这些功能。

以下是笔者使用React实现后的Notification组件效果:

![](/images/jueJin/1704921de0982ac.png)

接下来我们来看看通知提醒框(Notification)的具体设计思路。

### 1\. Notification组件设计思路

按照之前笔者总结的组件设计原则,我们第一步是要确认需求. 通知提醒框(Notification)组件一般会有如下需求点:

*   能控制Notification自动关闭的时间
*   能配置Notification渲染节点的输出位置
*   能控制Notification的弹出位置
*   能自定义关闭图标
*   可以手动选择通知窗类型
*   能自定义通知框的偏移量
*   能设置通知框的信息和提示文本
*   能自定义通知框的Icon
*   通知框点击时提供回调函数
*   通知框关闭时提供回调函数
*   能手动销毁通知框

需求收集好之后,作为一个有追求的程序员, 会得出如下线框图:

![](/images/jueJin/170494558d8d4b1.png)

其实通知提醒框要考虑的东西挺多的，所以在设计组件之前，一定要想理清需求和功能划分，这样才能有条不絮的去实现它，和我们实现一个复杂系统是一样的，一个组件就是一个小系统。

### 2\. 基于react实现一个通知提醒框(Notification)

通知框的API调用实现思路其实就是通过jsx动态渲染约定好的标签，然后通过ReactDom的Render API将dom渲染到指定容器内挂在到页面，其中要想实现Notification.info这样的方式还需要考虑到创建实例的问题，我们应该使用单例模式来控制实例的创建个数。伪代码如下：

```
    const xNotification = (function() {
    let notification = null;
        if(notification) {
            return {
            render(dom){},
            config(config){},
            info(config){},
        error(config){}
        // ...
    }
        }else {
        notification = new Notification({})
            return {
            render(dom){},
            config(config){},
            info(config){},
        error(config){}
        // ...
    }
}
})()
// 使用
xNotification.info({...})
xNotification.error({...})
```

但是真正要实现以上需求讨论的那些通知框的功能，实际上我们还是要写很多代码来处理不同的情况的，所以为了方便大家理解，我们这里使用React Notification这个第三方库来帮我们处理基本的逻辑，笔者会基于它，来实现上面我们讨论的那些功能。

#### 2.1 搭建通知提醒框(Notification)的基本骨架

首先按照笔者的代码风格，一般会考虑组件设计的框架，然后再一步步往里面填充内容和逻辑。通过这种渐进式的设计思路，能让我们逻辑更严谨，更清晰。具体代码如下：

```
import Notification from 'rc-notification'
import './index.less'

    const xNotification = (function() {
    let notification = null
    /**
    * notice类型弹窗
    * @param {config}  object 通知框配置属性
    *   @param {type} string 通知窗类型
    *   @param {btn}  ReactNode 自定义关闭按钮
    *   @param {bottom}  number 消息从底部弹出时，距离底部的位置，单位像素
    *   @param {className}  string 自定义 CSS class
    *   @param {description}  string|ReactNode 通知提醒内容，必选
    *   @param {duration}  number 默认 4.5 秒后自动关闭，配置为 null 则不自动关闭
    *   @param {getContainer}  HTMLNode 配置渲染节点的输出位置
    *   @param {icon}  ReactNode 自定义图标
    *   @param {key}  string 当前通知唯一标志
    *   @param {message}  string|ReactNode 通知提醒标题，必选
    *   @param {onClose}  func 点击默认关闭按钮时触发的回调函数
    *   @param {onClick}  func 点击通知时触发的回调函数
    *   @param {top}  number 消息从顶部弹出时，距离顶部的位置，单位像素
    *   @param {closeIcon}  ReactNode 自定义关闭图标
    */
        const pop = (config) => {
            const {
            type, bottom, className, description, duration = 4.5,
            getContainer = () => document.body, icon,
            key, message, onClose, onClick, top, closable = true, closeIcon
            } = config
                notification.notice({
                content: <div className={classnames('xNotice', className )}>
                <div className={classnames('iconWrap', type)}>
                <Icon type={iconType[type]} />
                </div>
                <div>
                <div className="xNoticeTit">
            { message }
            </div>
            <div className="xNoticeDesc">
        { description }
        </div>
        </div>
        </div>
        })
    }
    /**
    * 通知提示组件, 全局参数
    * @param {bottom} number 消息从底部弹出时，距离底部的位置，单位像素， 默认24
    * @param {duration} number 默认自动关闭延时，单位秒
    * @param {getContainer} HTMLNode 配置渲染节点的输出位置，默认document.body
    * @param {placement} string 弹出位置，可选 topLeft topRight bottomLeft bottomRight
    * @param {top} number 消息从顶部弹出时，距离顶部的位置，单位像素
    * @param {closeIcon} HTMLNode 自定义关闭图标
    */
        const config = (config) => {
        const { duration, getContainer, placement, closeIcon } = config
            Notification.newInstance({
            getContainer: getContainer,
            duration: duration || 4.5,
            closeIcon
            }, (notice) => notification = notice)
        }
        
            if(notification) {
                return {
                config,
                pop
            }
        }
        // 如果为创建实例，则创建默认实例
        Notification.newInstance({}, (notice) => notification = notice)
            return {
            config,
            pop
        }
        })()
        
        export default xNotification
        
```

首先我们根据需求把一项项的属性都罗列出来。我们在全局使用的配置方法是xNotification.config(config), 在通知框实例中我们使用xNotification.pop(config)。这点和antd的使用方式有点不同，笔者是把通知框类型放到pop的config来处理了，比如说要渲染一个成功的通知框，我们可以这么做：

```
xNotification.pop({type: 'success'})
```

antd同样的方式会这么调用：

```
// antd
Notification.info({//...})
```

笔者之所以会这么做是因为info，success，warning这样的状态其实dom结构完全可以复用，所以通过配置方式可以极大的减少冗余代码。

#### 2.2 实现通知框类型type和自定义icon

笔者其实在搭建组件框架的时候已经完成了部分属性的配置，所以这里就不一一介绍了，笔者将会介绍一些比较重要的方法的实现。

通过观察我们可以知道要想实现不同的通知框类型，只需要根据类型来动态替换icon就行了。icon图标部分采用笔者已经实现的Icon组件，具体用法和antd的Icon组件类似，如果想学习如何封装属于自己的Icon组件可以参考笔者源码。

首先我们先定义一个类型和icon的映射关系：

```
    const iconType = {
    success: 'FaRegCheckCircle',
    warning: 'FaRegMeh',
    info: 'FaRegLightbulb',
    error: 'FaRegTimesCircle'
}
```

这四种类型对应着不同的icon图标类型，那么我们就可以根据用户传入的类型来展示不同icon图标了：

```
<div className={classnames('iconWrap', type)}>
<Icon type={iconType[type]} />
</div>
```

不过我们还需要考虑的一点就是如果用户传入了自定义的icon，我们理论上应该展示自定义icon，所以type因该和icon这两个属性是有联系的。还有一种情况就是如果用户即没有配置type，有没有传入icon，那么实际上是不需要显示icon的，综合考虑之后我们的代码如下：

```
    {
    (icon || ['info', 'success', 'error', 'warning'].indexOf(type) > -1) &&
    <div className={classnames('iconWrap', type)}>
        {
        icon ? icon : <Icon type={iconType[type]} />
    }
    </div>
}

```

实现效果如下图：

![](/images/jueJin/1704986eba1b373.png)

![](/images/jueJin/17049886492167c.png)

![](/images/jueJin/170498a029fe302.png)

#### 2.3 通知框位置placement

通知框的位置根据业务场景来看因该是全局配置，所以我们放在config方法里设置，关于如何根据用户传入的位置信息来控制Notification显示的位置，我们也可以先定义一个枚举类：

```
    const adapterPos = {
        topLeft: {
        top: '24px',
        left: '24px'
        },
            topRight: {
            top: '24px',
            right: '24px'
            },
                bottomLeft: {
                bottom: '24px',
                left: '24px'
                },
                    bottomRight: {
                    bottom: '24px',
                    right: '24px'
                }
            }
```

从上面代码可以看到我们会定义四个基础位置，默认偏移都是24px，然后我们就可以根据用处传入的placement来匹配自己的位置信息了：

```
    Notification.newInstance({
    style: {...adapterPos[placement] },
    // ...
```

上面代码可以知道位置信息我们是通过style来设置的。具体效果如下：

![](/images/jueJin/17049a3976db80d.png)

![](/images/jueJin/17049a428f25010.png)

![](/images/jueJin/17049a4cba4f647.png)

![](/images/jueJin/17049a53150ebdf.png)

#### 2.4 实现通知框动画效果

动画我们实现一个类似与antd的从右往左入场的动画，我们来改写样式如下：

```
    .rc-notification-fade-enter {
    animation: moveLeft .3s;
}
    .rc-notification-fade-leave {
    animation: moveOutLeft .3s;
}
    .rc-notification-fade-enter.rc-notification-fade-enter-active {
    animation: moveLeft .3s;
}
    .rc-notification-fade-leave.rc-notification-fade-leave-active {
    animation-name: moveOutLeft .3s;
}

    @keyframes moveOutLeft {
        0% {
        
    }
        100% {
        right: -200%;
    }
}
    @keyframes moveLeft {
        0% {
        right: -200%;
    }
        100% {
        right: 0;
    }
}
```

通过以上步骤, 一个功能强大的通知提醒框(Notification)就完成了.Notification组件算是组件库中中等复杂的组件，如果不懂的可以在评论区提问,笔者看到后会第一时间解答.

#### 2.5 使用Notification组件

我们可以通过如下方式使用它:

```
    <Button type="primary" onClick={
        () => {
            xNotification.pop({
            type: 'success',
            message: '趣谈前端学习打卡',
            description: '前端基础，中级进阶，高级打卡，一起玩转前端，996远离你'
            })
        }
        }>点我显示通知</Button>
```

配置全局属性:

```
import { xNotification } from '@alex_xu/xui'

    xNotification.config({
    placement: 'topRight'
    })
```

笔者已经将实现过的组件发布到npm上了,大家如果感兴趣可以直接用npm安装后使用,方式如下:

```
npm i @alex_xu/xui

// 导入xui
    import {
    Button,
    Skeleton,
    Empty,
    Progress,
    Tag,
    Switch,
    Drawer,
    Badge,
    Alert
    } from '@alex_xu/xui'
```

该组件库支持按需导入,我们只需要在项目里配置babel-plugin-import即可,具体配置如下:

```
// .babelrc
    "plugins": [
["import", { "libraryName": "@alex_xu/xui", "style": true }]
]
```

npm库截图如下:

![](/images/jueJin/170494f978cbf4d.png)

最后
--

后续笔者将会继续实现

*   **table**(表格),
*   **tooltip**(工具提示条),
*   **Skeleton**(骨架屏),
*   **Message**(全局提示),
*   **form**(form表单),
*   **switch**(开关),
*   **日期/日历**,
*   **二维码识别器组件**

等组件, 来复盘笔者多年的组件化之旅.

如果对于react/vue组件设计原理不熟悉的,可以参考我的之前写的组件设计系列文章:

*   [手摸手实现一个轻量级可扩展的模态框(Modal)组件](https://juejin.cn/post/6844904064392626183 "https://juejin.cn/post/6844904064392626183")
*   [《精通react/vue组件设计》之配合React Portals实现一个功能强大的抽屉(Drawer)组件](https://juejin.cn/post/6844904061615996942 "https://juejin.cn/post/6844904061615996942")
*   [《精通react/vue组件设计》之5分钟实现一个Tag(标签)组件和Empty(空状态)组件](https://juejin.cn/post/6844904058231193614 "https://juejin.cn/post/6844904058231193614")
*   [《精通react/vue组件设计》之用纯css打造类materialUI的按钮点击动画并封装成react组件](https://juejin.cn/post/6844904054917693453 "https://juejin.cn/post/6844904054917693453")
*   [《精通react/vue组件设计》之快速实现一个可定制的进度条组件](https://juejin.cn/post/6844904055702028296 "https://juejin.cn/post/6844904055702028296")
*   [《精通react/vue组件设计》之基于jsoneditor二次封装一个可实时预览的json编辑器组件(react版)](https://juejin.cn/post/6844904053781037064 "https://juejin.cn/post/6844904053781037064")

笔者已经将组件库发布到npm上了, 大家可以通过npm安装的方式体验组件.

如果想获取组件设计系列完整源码, 或者想学习更多**H5游戏**, **webpack**，**node**，**gulp**，**css3**，**javascript**，**nodeJS**，**canvas数据可视化**等前端知识和实战，欢迎在公号《趣谈前端》加入我们的技术群一起学习讨论，共同探索前端的边界。

![](/images/jueJin/170060658dd3db9.png)

更多推荐
----

*   [2年vue项目实战经验汇总](https://juejin.cn/post/6844904056893243400 "https://juejin.cn/post/6844904056893243400")
*   [15分钟带你了解前端工程师必知的javascript设计模式(附详细思维导图和源码)](https://juejin.cn/post/6844904054498263053 "https://juejin.cn/post/6844904054498263053")
*   [2019年,盘点一些我出过的前端面试题以及对求职者的建议](https://juejin.cn/post/6844904052388708366 "https://juejin.cn/post/6844904052388708366")
*   [一张图教你快速玩转vue-cli3](https://juejin.cn/post/6844903877133729799 "https://juejin.cn/post/6844903877133729799")
*   [vue高级进阶系列——用typescript玩转vue和vuex](https://juejin.cn/post/6844903831956897806 "https://juejin.cn/post/6844903831956897806")
*   [《前端实战总结》之使用纯css实现网站换肤和焦点图切换动画](https://juejin.cn/post/6844904024542543880 "https://juejin.cn/post/6844904024542543880")
*   [《前端实战总结》之使用CSS3实现酷炫的3D旋转透视](https://juejin.cn/post/6844904001633255431 "https://juejin.cn/post/6844904001633255431")
*   [《前端实战总结》之使用pace.js为你的网站添加加载进度条](https://juejin.cn/post/6844903998261035021 "https://juejin.cn/post/6844903998261035021")
*   [《前端实战总结》之设计模式的应用——备忘录模式](https://juejin.cn/post/6844903993232064526 "https://juejin.cn/post/6844903993232064526")
*   [《前端实战总结》之使用postMessage实现可插拔的跨域聊天机器人](https://juejin.cn/post/6844903989843066887 "https://juejin.cn/post/6844903989843066887")
*   [《前端实战总结》之变量提升，函数声明提升及变量作用域详解](https://juejin.cn/post/6844903985695080455 "https://juejin.cn/post/6844903985695080455")
*   [《前端实战总结》如何在不刷新页面的情况下改变URL](https://juejin.cn/post/6844903984222699527 "https://juejin.cn/post/6844903984222699527")