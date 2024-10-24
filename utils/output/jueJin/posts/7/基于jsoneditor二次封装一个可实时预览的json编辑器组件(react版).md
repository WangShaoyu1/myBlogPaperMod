---
author: "徐小夕"
title: "基于jsoneditor二次封装一个可实时预览的json编辑器组件(react版)"
date: 2020-01-29
description: "通过实现一个json在线编辑器,来学习如何一步步封装自己的组件(不限于react,vue,原理类似) 在介绍组件设计思路之前,有必要介绍一下著名的SOLID原则 S 单一功能原则 规定每个类都应该有一个单一的功能，并且该功能应该由这个类完全封装起来。所有它的服务都应该严密…"
tags: ["React.js","前端框架中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:42,comments:0,collects:62,views:10492,"
---
### 前言

做为一名前端开发人员,掌握vue/react/angular等框架已经是必不可少的技能了,我们都知道,vue或react等MVVM框架提倡组件化开发,这样一方面可以提高组件复用性和可扩展性,另一方面也带来了项目开发的灵活性和可维护,方便多人开发协作.接下来文章将介绍如何使用react,开发一个自定义json编辑器组件.我们这里使用了jsoneditor这个第三方库,官方地址: [jsoneditor](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fjosdejong%2Fjsoneditor%2Fblob%2Fmaster%2Fdocs%2Fusage.md "https://github.com/josdejong/jsoneditor/blob/master/docs/usage.md") 通过实现一个json在线编辑器,来学习如何一步步封装自己的组件(不限于react,vue,原理类似).

你将学到:

*   react组件封装的基本思路
*   SOLID (面向对象设计)原则介绍
*   jsoneditor用法
*   使用PropTypes做组件类型检查

### 设计思路

在介绍组件设计思路之前,有必要介绍一下著名的**SOLID原则**.

> SOLID（单一功能、开闭原则、里氏替换、接口隔离以及依赖反转）是由罗伯特·C·马丁提出的面向对象编程和面向对象设计的五个基本原则。利用这些原则，程序员能更容易和高效的开发一个可维护和扩展的系统。 SOLID被典型的应用在测试驱动开发上，并且是敏捷开发以及自适应软件开发的基本原则的重要组成部分。

*   **S** 单一功能原则: 规定每个类都应该有一个单一的功能，并且该功能应该由这个类完全封装起来。所有它的服务都应该严密的和该功能保持一致。
    
*   **O** 开闭原则: 规定“软件中的对象（类，模块，函数等等）应该对于扩展是开放的，但是对于修改是封闭的”，这意味着一个实体是允许在不改变它的源代码的前提下变更它的行为。遵循这种原则的代码在扩展时并不需要改变。
    
*   **L** 里氏替换原则: 派生类（子类）对象可以在程序中代替其基类（超类）对象,是对子类型的特别定义.
    
*   **I** 接口隔离原则: 指明应用或者对象应该不依赖于它不使用的方法。接口隔离原则(ISP)拆分非常庞大臃肿的接口成为更小的和更具体的接口，这样应用或对象只需要知道它们感兴趣的方法。这种缩小的接口也被称为角色接口。接口隔离原则(ISP)的目的是系统去耦合，从而容易重构，更改和重新部署。接口隔离原则是在SOLID (面向对象设计)中五个面向对象设计(OOD)的原则之一，类似于在GRASP (面向对象设计)中的高内聚性。
    
*   **D** 依赖反转原则: 是指一种特定的解耦 形式，使得高层次的模块不依赖于低层次的模块的实现细节，依赖关系被颠倒（反转），从而使得低层次模块依赖于高层次模块的需求抽象。
    

掌握好这5个原则将有利于我们开发出更优秀的组件,请默默记住.接下来我们来看看json编辑器的设计思路.

![](/images/jueJin/16fecfb6ae1e279.png)

如上所示, 和任何一个输入框一样, 参考antd组件设计方式并兼容antd的form表单, 我们提供了onChange方法.(具体细节下文会详细介绍)

首先利用jsoneditor渲染的基本样式以及API,我们能实现一个基本可用的json编辑器,然后通过对外暴露的json和onChange属性进行数据双向绑定, 通过onError来监控异常或者输入的错误, 通过themeBgColor来修改默认的主题色,通过这几个接口,我们便能完全掌握一个组件的运行情况.

### 正文

接下来我们就正式开始我们的正文.由于本文的组件是基于react实现的,但是用在vue,angular上,基本模式同样适用.关键就是掌握好不同框架的生命周期.

在学习实现json编辑器组件之前,我们有必要了解一下jsoneditor这个第三方组件的用法与api.

#### jsoneditor的使用

1.  安装

我们先执行npm install安装我们的组件

```
npm install jsoneditor
```

其次手动引入样式文件

```
<link href="jsoneditor/dist/jsoneditor.min.css" rel="stylesheet" type="text/css">
```

这样,我们就能使用它的api了:

```
<div id="jsoneditor" style="width: 400px; height: 400px;"></div>

<script>
// 创建编辑器
var container = document.getElementById("jsoneditor");
var editor = new JSONEditor(container);

// 设置json数据
    function setJSON () {
        var json = {
        "Array": [1, 2, 3],
        "Boolean": true,
        "Null": null,
        "Number": 123,
        "Object": {"a": "b", "c": "d"},
        "String": "Hello World"
        };
        editor.set(json);
    }
    
    // 获取json数据
        function getJSON() {
        var json = editor.get();
        alert(JSON.stringify(json, null, 2));
    }
    </script>
```

所以你可能看到如下界面:

![](/images/jueJin/16fed2801726a33.png)

为了能实现实时预览和编辑,光这样还远远不够,我们还需要进行额外的处理.我们需要用到jsoneditor其他的api和技巧.

#### 结合react进行二次封装

基于以上谈论,我们很容易将编辑器封装成react组件, 我们只需要在componentDidMount生命周期里初始化实例即可.react代码可能是这样的:

```
import React, { PureComponent } from 'react'
import JSONEditor from 'jsoneditor'

import 'jsoneditor/dist/jsoneditor.css'

    class JsonEditor extends PureComponent {
        initJsonEditor = () => {
            const options = {
            mode: 'code',
            history: true,
            onChange: this.onChange,
            onValidationError: this.onError
            };
            
            this.jsoneditor = new JSONEditor(this.container, options)
            this.jsoneditor.set(this.props.value)
        }
        
            componentDidMount () {
            this.initJsonEditor()
        }
        
            componentWillUnmount () {
                if (this.jsoneditor) {
                this.jsoneditor.destroy()
            }
        }
        
            render() {
            return <div className="jsoneditor-react-container" ref={elem => this.container = elem} />
        }
    }
    export default JsonEditor
    
```

至于options里的选项, 我们可以参考jsoneditor的API文档,里面写的很详细, 通过以上代码,我们便可以实现一个基本的react版的json编辑器组件.接下来我们来按照设计思路一步步实现可实时预览的json编辑器组件.

1.  **实现预览和编辑视图**

其实这一点很好实现,我们只需要实例化2个编辑器实例,一个用于预览,一个用于编辑就好了.

```
import React, { PureComponent } from 'react'
import JSONEditor from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.css'

    class JsonEditor extends PureComponent {
        onChange = () => {
        let value = this.jsoneditor.get()
        this.viewJsoneditor.set(value)
    }
    
        initJsonEditor = () => {
            const options = {
            mode: 'code',
            history: true
            };
            
            this.jsoneditor = new JSONEditor(this.container, options)
            this.jsoneditor.set(this.props.value)
        }
        
            initViewJsonEditor = () => {
                const options = {
                mode: 'view'
                };
                
                this.viewJsoneditor = new JSONEditor(this.viewContainer, options)
                this.viewJsoneditor.set(this.props.value)
            }
            
                componentDidMount () {
                this.initJsonEditor()
                this.initViewJsonEditor()
            }
            
                componentDidUpdate() {
                    if(this.jsoneditor) {
                    this.jsoneditor.update(this.props.value)
                    this.viewJsoneditor.update(this.props.value)
                }
            }
            
                render() {
                return (
                <div className="jsonEditWrap">
                <div className="jsoneditor-react-container" ref={elem => this.container = elem} />
                <div className="jsoneditor-react-container" ref={elem => this.viewContainer = elem} />
                </div>
                );
            }
        }
        
        export default JsonEditor
```

这样,我们便能实现一个初步的可实时预览的编辑器.可能效果长这样:

![](/images/jueJin/16fed3bc450d2cd.png)

接近于成熟版,但是还有很多细节要处理.

2.  **对外暴露属性和方法以支持不同场景的需要**

```
import React, { PureComponent } from 'react'
import JSONEditor from 'jsoneditor'

import 'jsoneditor/dist/jsoneditor.css'

    class JsonEditor extends PureComponent {
    // 监听输入值的变化
        onChange = () => {
        let value = this.jsoneditor.get()
        this.props.onChange && this.props.onChange(value)
        this.viewJsoneditor.set(value)
    }
    // 对外暴露获取编辑器的json数据
        getJson = () => {
        this.props.getJson && this.props.getJson(this.jsoneditor.get())
    }
    // 对外提交错误信息
        onError = (errArr) => {
        this.props.onError && this.props.onError(errArr)
    }
    
        initJsonEditor = () => {
            const options = {
            mode: 'code',
            history: true,
            onChange: this.onChange,
            onValidationError: this.onError
            };
            
            this.jsoneditor = new JSONEditor(this.container, options)
            this.jsoneditor.set(this.props.value)
        }
        
            initViewJsonEditor = () => {
                const options = {
                mode: 'view'
                };
                
                this.viewJsoneditor = new JSONEditor(this.viewContainer, options)
                this.viewJsoneditor.set(this.props.value)
            }
            
                componentDidMount () {
                this.initJsonEditor()
                this.initViewJsonEditor()
                // 设置主题色
                this.container.querySelector('.jsoneditor-menu').style.backgroundColor = this.props.themeBgColor
                this.container.querySelector('.jsoneditor').style.border = `thin solid ${this.props.themeBgColor}`
                this.viewContainer.querySelector('.jsoneditor-menu').style.backgroundColor = this.props.themeBgColor
                this.viewContainer.querySelector('.jsoneditor').style.border = `thin solid ${this.props.themeBgColor}`
            }
            
                componentDidUpdate() {
                    if(this.jsoneditor) {
                    this.jsoneditor.update(this.props.json)
                    this.viewJsoneditor.update(this.props.json)
                }
            }
            
                render() {
                return (
                <div className="jsonEditWrap">
                <div className="jsoneditor-react-container" ref={elem => this.container = elem} />
                <div className="jsoneditor-react-container" ref={elem => this.viewContainer = elem} />
                </div>
                );
            }
        }
        
        export default JsonEditor
```

通过以上的过程,我们已经完成一大半工作了,剩下的细节和优化工作,比如组件卸载时如何卸载实例, 对组件进行类型检测等,我们继续完成以上问题.

3.  **使用PropTypes进行类型检测以及在组件卸载时清除实例** 类型检测时react内部支持的,安装react的时候会自动帮我们安装PropTypes,具体用法可参考官网地址[propTypes文档](https://link.juejin.cn?target=https%3A%2F%2Fzh-hans.reactjs.org%2Fdocs%2Ftypechecking-with-proptypes.html "https://zh-hans.reactjs.org/docs/typechecking-with-proptypes.html"),其次我们会在react的componentWillUnmount生命周期中清除编辑器的实例以释放内存.完整代码如下:

```
import React, { PureComponent } from 'react'
import JSONEditor from 'jsoneditor'
import PropTypes from 'prop-types'
import 'jsoneditor/dist/jsoneditor.css'

/**
* JsonEditor
* @param {object} json 用于绑定的json数据
* @param {func} onChange 变化时的回调
* @param {func} getJson 为外部提供回去json的方法
* @param {func} onError 为外部提供json格式错误的回调
* @param {string} themeBgColor 为外部暴露修改主题色
*/
    class JsonEditor extends PureComponent {
        onChange = () => {
        let value = this.jsoneditor.get()
        this.props.onChange && this.props.onChange(value)
        this.viewJsoneditor.set(value)
    }
    
        getJson = () => {
        this.props.getJson && this.props.getJson(this.jsoneditor.get())
    }
    
        onError = (errArr) => {
        this.props.onError && this.props.onError(errArr)
    }
    
        initJsonEditor = () => {
            const options = {
            mode: 'code',
            history: true,
            onChange: this.onChange,
            onValidationError: this.onError
            };
            
            this.jsoneditor = new JSONEditor(this.container, options)
            this.jsoneditor.set(this.props.value)
        }
        
            initViewJsonEditor = () => {
                const options = {
                mode: 'view'
                };
                
                this.viewJsoneditor = new JSONEditor(this.viewContainer, options)
                this.viewJsoneditor.set(this.props.value)
            }
            
                componentDidMount () {
                this.initJsonEditor()
                this.initViewJsonEditor()
                // 设置主题色
                this.container.querySelector('.jsoneditor-menu').style.backgroundColor = this.props.themeBgColor
                this.container.querySelector('.jsoneditor').style.border = `thin solid ${this.props.themeBgColor}`
                this.viewContainer.querySelector('.jsoneditor-menu').style.backgroundColor = this.props.themeBgColor
                this.viewContainer.querySelector('.jsoneditor').style.border = `thin solid ${this.props.themeBgColor}`
            }
            
                componentWillUnmount () {
                    if (this.jsoneditor) {
                    this.jsoneditor.destroy()
                    this.viewJsoneditor.destroy()
                }
            }
            
                componentDidUpdate() {
                    if(this.jsoneditor) {
                    this.jsoneditor.update(this.props.json)
                    this.viewJsoneditor.update(this.props.json)
                }
            }
            
                render() {
                return (
                <div className="jsonEditWrap">
                <div className="jsoneditor-react-container" ref={elem => this.container = elem} />
                <div className="jsoneditor-react-container" ref={elem => this.viewContainer = elem} />
                </div>
                );
            }
        }
        
            JsonEditor.propTypes = {
            json: PropTypes.object,
            onChange: PropTypes.func,
            getJson: PropTypes.func,
            onError: PropTypes.func,
            themeBgColor: PropTypes.string
        }
        
        export default JsonEditor
```

由于组件严格遵守开闭原则,所以我们可以提供更加定制的功能在我们的json编辑器中,已实现不同项目的需求.对于组件开发的健壮性探讨,除了使用propTypes外还可以基于typescript开发,这样适合团队开发组件库或者复杂项目组件的追溯和查错.最终效果如下:

![](/images/jueJin/16fed4ec5666052.png)

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

![](/images/jueJin/1702d0ab4c7d10a.png)

### 最后

如果想了解更多**H5游戏**, **webpack**，**node**，**gulp**，**css3**，**javascript**，**nodeJS**，**canvas数据可视化**等前端知识和实战，欢迎在公众号《趣谈前端》加入我们一起学习讨论，共同探索前端的边界。

![](/images/jueJin/16ba43b87c51361.png)

### 更多推荐

*   [2019年,盘点一些我出过的前端面试题以及对求职者的建议](https://juejin.cn/post/6844904052388708366 "https://juejin.cn/post/6844904052388708366")
*   [《前端实战总结》之使用纯css实现网站换肤和焦点图切换动画](https://juejin.cn/post/6844904024542543880 "https://juejin.cn/post/6844904024542543880")
*   [《前端实战总结》之使用CSS3实现酷炫的3D旋转透视](https://juejin.cn/post/6844904001633255431 "https://juejin.cn/post/6844904001633255431")
*   [《前端实战总结》之使用pace.js为你的网站添加加载进度条](https://juejin.cn/post/6844903998261035021 "https://juejin.cn/post/6844903998261035021")
*   [《前端实战总结》之设计模式的应用——备忘录模式](https://juejin.cn/post/6844903993232064526 "https://juejin.cn/post/6844903993232064526")
*   [《前端实战总结》之使用postMessage实现可插拔的跨域聊天机器人](https://juejin.cn/post/6844903989843066887 "https://juejin.cn/post/6844903989843066887")
*   [《前端实战总结》之变量提升，函数声明提升及变量作用域详解](https://juejin.cn/post/6844903985695080455 "https://juejin.cn/post/6844903985695080455")
*   [《前端实战总结》如何在不刷新页面的情况下改变URL](https://juejin.cn/post/6844903984222699527 "https://juejin.cn/post/6844903984222699527")
*   [一张图教你快速玩转vue-cli3](https://juejin.cn/post/6844903877133729799 "https://juejin.cn/post/6844903877133729799")
*   [vue高级进阶系列——用typescript玩转vue和vuex](https://juejin.cn/post/6844903831956897806 "https://juejin.cn/post/6844903831956897806")
*   [基于nodeJS从0到1实现一个CMS全栈项目（上）](https://juejin.cn/post/6844903952761225230 "https://juejin.cn/post/6844903952761225230")
*   [基于nodeJS从0到1实现一个CMS全栈项目（中）](https://juejin.im/editor/posts/5d8c7b66518825761b4c1e04 "https://juejin.im/editor/posts/5d8c7b66518825761b4c1e04")
*   [基于nodeJS从0到1实现一个CMS全栈项目（下）](https://juejin.cn/post/6844903955797901319 "https://juejin.cn/post/6844903955797901319")
*   [5分钟教你用nodeJS手写一个mock数据服务器](https://juejin.cn/post/6844903937330380814 "https://juejin.cn/post/6844903937330380814")
*   [用css3实现惊艳面试官的背景即背景动画（高级附源码）](https://juejin.cn/post/6844903950123188237 "https://juejin.cn/post/6844903950123188237")
*   [教你用200行代码写一个爱豆拼拼乐H5小游戏（附源码）](https://juejin.cn/post/6844903893961293831 "https://juejin.cn/post/6844903893961293831")
*   [笛卡尔乘积的javascript版实现和应用](https://juejin.cn/post/6844903928577048583 "https://juejin.cn/post/6844903928577048583")