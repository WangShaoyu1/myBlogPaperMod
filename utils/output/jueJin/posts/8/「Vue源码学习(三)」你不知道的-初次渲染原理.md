---
author: "Sunshine_Lin"
title: "「Vue源码学习(三)」你不知道的-初次渲染原理"
date: 2021-06-05
description: "前言 上一节我们讲到了「Vue源码学习(二)」你不知道的-模板编译原理，也就是讲到了把模板转换成了render函数所需格式，那么今天，我就给大家讲一下，Vue是怎么拿着这个东西，去生成真实DOM并展示"
tags: ["源码中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:86,comments:5,collects:38,views:8398,"
---
前言
--

上一节我们讲到了[「Vue源码学习(二)」你不知道的-模板编译原理](https://juejin.cn/post/6969563640416436232 "https://juejin.cn/post/6969563640416436232")，也就是讲到了把模板转换成了`render函数所需格式`，那么今天，我就给大家讲一下，Vue是怎么拿着这个东西，去生成真实DOM并展示到页面的。

代码
--

### 1\. 步骤

$mount

mountComponent

\_render执行获得虚拟DOM

\_update执行将虚拟DOM转真实DOM并渲染

### 2\. 初始化Vue

```js
const { initMixin } = require('./init')
const { lifecycleMixin } = require('./lifecycle')
const { renderMixin } = require("./render")

    function Vue(options) {
    this._init(options)
}

initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)
```

### 3\. mountComponent函数（渲染的入口函数）

```js
// lifecycle.js


const { patch } = require('./vdom/patch')

    function mountComponent (vm, el) {
    vm.$el = el;
    
    // 上一节讲到把模板编译成render函数渲染所需格式
    // 那么这一节就需要执行_render函数，来调用render函数生成虚拟DOM
    // 然后接收返回值虚拟DOM，调用_update函数把虚拟DOM转为真实DOM并渲染
    vm._update(vm._render())
    
    return vm
}

    function lifecycleMixin(Vue) {
    // 将_update挂在Vue原型上
        Vue.prototype._update = function (vnode) {
        const vm = this
        
        // 执行patch函数，patch函数在下面有讲
        vm.$el = patch(vm.$el, vnode) || vm.$el
    }
}

    module.exports = {
    mountComponent,
    lifecycleMixin
}

```

### 4\. \_render函数（执行render函数，获得虚拟DOM）

```js
// render.js


const { createElement, createTextNode } = require('./vdom/index')

    function renderMixin(Vue) {
    // 将_render函数挂在Vue原型上
        Vue.prototype._render = function() {
        const vm = this
        
        // 把上一节生成的render函数取出来
        const { render } = vm.$options
        
        // 执行render函数并获得虚拟DOM
        const vnode = render.call(vm)
        
        return vnode
    }
    
    // 创建元素节点虚拟DOM
        Vue.prototype._c = function(...args) {
        return createElement(...args)
    }
    
    // 创建文本节点虚拟DOM
        Vue.prototype._v = function (text) {
        return createTextNode(text)
    }
    
    // 对象的情况，把对象转成字符串
        Vue.prototype._s = function (val) {
        return val === null ? '' : typeof val === 'object' ? JSON.stringify(val) : val
    }
}

    module.exports = {
    renderMixin
}
```

> 下面是创建虚拟DOM的具体所需函数以及类

```js
// vdom/index.js


// 创建某一个节点的虚拟DOM
    class Vnode {
        constructor(tag, data, key, children, text) {
        this.tag = tag
        this.data = data
        this.key = key
        this.children = children
        this.text = text
    }
}

// 创建元素节点虚拟DOM
    function createElement(tag, data= {}, ...children) {
    const key = data.key
    return new Vnode(tag, data, key, children)
}

// 创建文本节点虚拟DOM
    function createTextNode(text) {
    return new Vnode(undefined, undefined, undefined, undefined, text)
}

    module.exports = {
    createElement,
    createTextNode
}
```

### 5\. patch函数（将虚拟DOM转真实DOM并渲染）

```js
// vdom/patch.js


    function patch(oldVnode, vnode) {
    // 本节只讲初次渲染
    // 初次渲染时oldVnode就是el节点，以后非初次渲染时，oldVnode就是上一次的虚拟DOM
    
    // 判断oldVnode的类型
    const isRealElement = oldVnode.nodeType
        if (isRealElement) {
        // 初次渲染
        const oldElm = oldVnode
        const parentElm = oldElm.parentNode
        
        // 生成真实DOM对象
        const el = createElm(vnode)
        
        // 将生成的真实DOM。插入到el的下一个节点的前面
        // 也就是插到el的后面
        // 不直接appendChild是因为可能页面中有其他el同级节点，不能破坏顺序
        parentElm.insertBefore(el, oldElm.nextSibling)
        
        // 删除老el节点
        parentElm.removeChild(oldVnode)
        
        return el
    }
}

// 虚拟DOM生成真实DOM
    function createElm(vnode) {
    const { tag, data, key, children, text } = vnode
    
    // 判断是元素节点还是文本节点
        if (typeof tag === 'string') {
        // 创建标签
        vnode.el = document.createElement(tag)
        
        // 解析虚拟DOM属性
        updateProperties(vnode)
        
        // 递归，将子节点也生成真实DOM
            children.forEach(child => {
            return vnode.el.appendChild(createElm(child))
            })
                } else {
                // 文本节点直接创建
                vnode.el = document.createTextNode(text)
            }
            
            return vnode.el
        }
        
        // 解析虚拟DOM的属性
            function updateProperties(vnode) {
        const newProps = vnode.data || {}
        const el = vnode.el
            for(let key in newProps) {
                if (key === 'style') {
                // style的处理
                    for (let styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName]
            }
                } else if (key === 'class') {
                // class的处理
                el.className = newProps.class
                    } else {
                    // 调用dom的setAttribute进行属性设置
                    el.setAttribute(key, newProps[key])
                }
            }
        }
        
            module.exports = {
            patch
        }
```

### 6\. 具体流程图

![image.png](/images/jueJin/f662df7792d4414.png)

结语
--

> 我也不知道会不会有人看，反正，写就完事了！！！加油！！！

*   [你想知道Vuex的实现原理吗？](https://juejin.cn/post/6952473110377414686 "https://juejin.cn/post/6952473110377414686")
*   [你真的知道插槽Slot是怎么“插”的吗](https://juejin.cn/post/6949848530781470733 "https://juejin.cn/post/6949848530781470733")
*   [「Vue源码学习(一)」你不知道的-数据响应式原理](https://juejin.cn/post/6968732684247892005 "https://juejin.cn/post/6968732684247892005")
*   [「Vue源码学习(二)」你不知道的-模板编译原理](https://juejin.cn/post/6969563640416436232 "https://juejin.cn/post/6969563640416436232")
*   [「Vue源码学习(三)」你不知道的-初次渲染原理](https://link.juejin.cn?target=s "s")

学习群，摸鱼群，进来谈笑风生吧嘿嘿
-----------------

请点击这里 [链接](https://juejin.cn/pin/6969565162885873701 "https://juejin.cn/pin/6969565162885873701")