---
author: "Gaby"
title: "面试官最喜欢问☞Vue、React专题"
date: 2021-08-14
description: "vue React专题贴，每月持续更新面试题动向。适合初次全面复习的同学，查缺补漏，知识面比较全，复习完成后，再按照本人整理的面试高频题配合复习，使得找工作事半功倍，一定要理解，不要死记硬。"
tags: ["前端","面试中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读37分钟"
weight: 1
selfDefined:"likes:28,comments:0,collects:65,views:2310,"
---
**这是我参与8月更文挑战的第12天，活动详情查看：[8月更文挑战](https://juejin.cn/post/6987962113788493831 "https://juejin.cn/post/6987962113788493831")**

**更新时间：2021年09月23日 11:30**

* * *

适合初次全面复习的同学，查缺补漏，知识面比较全，复习完成后，再按照本人整理的面试高频题配合复习，使得找工作事半功倍，一定要理解，不要死记硬背，对于一些概念性的和原理的内容要深入理解。

> “你从头读，尽量往下读，直到你一窍不通时，再从头开始，这样坚持往下读，直到你完全读懂为止。”

Vue
---

### 说说你对 Vue 的理解

Vue 是一个构建数据驱动的渐进性框架，它的目标是通过 API 实现响应数据绑定和视图更新。

优点：  
1、`数据驱动视图`，对真实 dom 进行抽象出 virtual dom， 并配合 diff 算法、响应式和观察者、异步队列等手段以最小代价更新 dom，渲染页面  
2、由于`采用虚拟 dom`，但让 Vue ssr 先天不足  
3、`生命周期钩子函数`，选项式的代码组织方式，写熟了还是蛮顺畅的，但仍然 有优化空间（Vue3 composition-api）  
4、`强大且丰富的 API` 提供一系列的 api 能满足业务开发中各类需求  
5、`组件化`，组件用单文件的形式进行代码的组织编写，使得我们可以在一个文 件里编写 html\\css\\js 并且配合 Vue-loader 之后，支持更强大的预处理器等功能  
6、`生态好`，社区活跃

缺点：  
1、由于`底层基于 Object.defineProperty 实现响应式`，而这个 api 本身不支持 IE8 及以下浏览器  
2、csr 的先天不足，首屏性能问题（白屏）seo 不友好

### 使用框架一定比原生的或者jQuery好吗？为什么

**使用框架的优点：**  
用户体验会更好  
开发效率高，成本降低，便于后期维护  
采用虚拟DOM操作，更新性能更高

**使用框架的缺点：**  
代码臃肿，使用者使用框架的时候会将整个框架引入，而框架封装了很多功能和组件，使用者必须按照它的规则使用，而实际开发中很多功能和组件是用不到的。  
前端框架迭代更新太快，需要时间熟悉

### 浅谈MVC、MVP、MVVM架构模式的区别和联系

##### 一、MVC（Model-View-Controller）

MVC 全名是 Model View Controller，是模型(model)－视图(view)－控制器(controller)的缩写，一种软件设计典范，是比较直观的架构模式。

*   Model（模型）：是应用程序中用于处理应用程序数据逻辑的部分。通常模型对象负责在数据库中存取数据
*   View（视图）：是应用程序中处理数据显示的部分。通常视图是依据模型数据创建的
*   Controller（控制器）：是应用程序中处理用户交互的部分。通常控制器负责从视图读取数据，控制用户输入，并向模型发送数据

**MVC 的思想**：一句话描述就是 Controller 负责将 Model 的数据用 View 显示出来。

#### 二、MVP（Model-View-Presenter）

MVP是把MVC中的Controller换成了Presenter（呈现），`目的就是为了完全切断View跟Model之间的联系，由Presenter充当桥梁，做到View-Model之间通信的完全隔离`。

#### 三、MVVM（Model-View-ViewModel）

如果说MVP是对MVC的进一步改进，那么MVVM则是思想的完全变革。`它是将“数据模型数据双向绑定”的思想作为核心，因此在View和Model之间没有联系，通过ViewModel进行交互，而且Model和ViewModel之间的交互是双向的，因此视图的数据的变化会同时修改数据源，而数据源数据的变化也会立即反应到View上`。

#### 四、MVVM 与 MVC 的区别

MVVM 与 MVC 最大的区别就是：它实现了 View 和 Model 的自动同步，也就是当 Model 的属性改变时，我们不用再自己手动操作 Dom 元素，来改变 View 的显示，而是改变属性后该属性对应 View 层显示会自动改变（对应Vue数据驱动的思想）

### 简述MVVM

**什么是MVVM？**

`视图模型双向绑定`，是`Model-View-ViewModel`的缩写，也就是把`MVC`中的`Controller`演变成`ViewModel。Model`层代表数据模型，`View`代表UI组件，`ViewModel`是`View`和`Model`层的桥梁，数据会绑定到`viewModel`层并自动将数据渲染到页面中，视图变化的时候会通知`viewModel`层更新数据。以前是操作DOM结构更新视图，现在是`数据驱动视图`。

ViewModel 层：做了两件事实现数据的双向绑定 一是将 Model 转化成 View，即将后端传递的数据渲染到页面上。实现的方式是：`数据绑定`。二是将 View 转化成 Model，即将所看到的页面变化转化成后端的数据。实现的方式是：`DOM 事件监听`。

> 注意：Vue 并没有完全遵循 MVVM 的思想 这一点官网自己也有说明

为什么官方要说 Vue 没有完全遵循 MVVM 思想呢？

> 严格的 MVVM 要求 View 不能和 Model 直接通信，而 Vue 提供了$refs 这个属性，让 Model 可以直接操作 View，违反了这一规定，所以说 Vue 没有完全遵循 MVVM。

**MVVM的优点：**

1.`低耦合`。视图（View）可以独立于Model变化和修改，一个Model可以绑定到不同的View上，当View变化的时候Model可以不变化，当Model变化的时候View也可以不变；  
2.`可重用性`。你可以把一些视图逻辑放在一个Model里面，让很多View重用这段视图逻辑。  
3.`独立开发`。开发人员可以专注于业务逻辑和数据的开发(ViewModel)，设计人员可以专注于页面设计。  
4.`可测试`。

### 说说Vue的MVVM实现原理

1.  Vue作为MVVM模式的实现库的2种技术
    
    a. 模板解析  
    b. 数据绑定
    
2.  模板解析：实现初始化显示
    
    a. 解析大括号表达式  
    b. 解析指令
    
3.  数据绑定：实现更新显示
    
    a. 通过数据劫持实现
    

创建了两种对象Observer和complie，先创建的Observer，后创建的complie，observer是为了监视/劫持data中所有层次的属性，同时还为每一种属性创建了另外一种对象dep，dep与data中的属性一一对应，complie作用是用来编译模版，初始化界面，调用update对象，complie还为每个表达式创建了对应的watcher同时指定了更新节点的回调函数，将watcher添加到所有对应的dep中。

![](/images/jueJin/7a8d50844e2e432.png)

### Vue底层实现原理

`Vue是采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的setter和getter，在数据变动时发布消息给订阅者，触发相应的监听回调`

Vue是一个典型的MVVM框架，模型（Model）只是普通的javascript对象，修改它则试图（View）会自动更新。这种设计让状态管理变得非常简单而直观。

**Observer（数据监听器）**: Observer的核心是通过Object.defineProprtty()来监听数据的变动，这个函数内部可以定义setter和getter，每当数据发生变化，就会触发setter。这时候Observer就要通知订阅者，订阅者就是Watcher

**Watcher（订阅者）**: Watcher订阅者作为Observer和Compile之间通信的桥梁，主要做的事情是：

1.  在自身实例化时往属性订阅器(dep)里面添加自己
2.  自身必须有一个update()方法
3.  待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调

**Compile（指令解析器）**: Compile主要做的事情是解析模板指令，将模板中变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加鉴定数据的订阅者，一旦数据有变动，收到通知，更新试图

### 请描述下响应式原理

响应式数据原理详解 [传送门](https://juejin.cn/post/6935344605424517128 "https://juejin.cn/post/6935344605424517128")

*   监听 data 变化过程
*   组件渲染和更新的流程

### 监听data变化的核心API是什么

*   Object.defineProperty
*   以及深度监听、监听数组
*   有何缺点

### Vue如何监听数组变化

*   Object.defineProperty不能监听数组变化
*   重新定义原型，重写pushpop等方法，实现监听
*   Proxy可以原生支持监听数组变化

### 双向绑定 v-model 实现原理

*   input元素的value = this.name
*   绑定input事件this.name = $event.target.value
*   data更新触发re-render

当一个**Vue**实例创建时，Vue会遍历data选项的属性，用 **Object.defineProperty** 将它们转为 getter/setter并且在内部追踪相关依赖，在属性被访问和修改时通知变化。每个组件实例都有相应的 watcher 程序实例，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的 setter 被调用时，会通知 watcher重新计算，从而致使它关联的组件得以更新。

### 如何自己实现一个 v-model

```html
<template>
<input
type="text"
:value="text'
@input="$emit('change', $event. target.value)"/>
<!--
注意
第一，上面使用：value而没用v-model
第二，上面的change和model.event 对应起来即可，名字自己改
-->
</template>

<script>
    export default{
        model:{
        prop: 'text', // 对应到props text
        event: 'change'
        },
            props: {
            text: String
                default(){
                return ''
            }
        }
    }
    </script>
    <!-- 使用 -->
{{name}}
<Components v-model="name">
```

### Vue 模板编译原理

Vue 的编译过程就是将 template 转化为 render 函数的过程 分为以下三步

1.  将 模板字符串 转换成 element ASTs（解析器）
2.  对 AST 进行静态节点标记，主要用来做虚拟DOM的渲染优化（优化器）
3.  使用 element ASTs 生成 render 函数代码字符串（代码生成器）

模板编译原理详解 [传送门](https://juejin.cn/post/6936024530016010276 "https://juejin.cn/post/6936024530016010276")

### Vue 组件渲染和更新过程

![image.png](/images/jueJin/7bb096d0622b428.png)

*   初始化渲染过程：
    
    *   解析模板为render函数（或在开发环境已完成，vue-loader）
    *   触发响应式，监听data属性getter setter，并作为依赖被 watch 观察起来
    *   执行render函数，生成vnode，进行 patch（elem，vnode）
*   更新过程：
    
    *   修改data，触发setter（此前在getter中已被监听）通过 notify 在属性被访问和修改时通知变化 watch，每个组件实例都有相应的 watcher 程序实例，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的 setter 被调用时，会通知 watcher重新计算，重新执行 render 函数。
    *   重新执行render函数，生成newVnode
    *   patch(vnode, newVnode)
*   异步渲染：
    

### 怎样理解 Vue 的单向数据流

所有的 prop 都使得其父子 prop 之间形成了一个**单向下行绑定**：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。这样会防止从子组件意外改变父级组件的状态，从而导致你的应用的数据流向难以理解。

> 注意：在子组件直接用 v-model 绑定父组件传过来的 prop 这样是不规范的写法 开发环境会报警告

额外的，每次父级组件发生更新时，子组件中所有的 prop 都将会刷新为最新的值。这意味着你不应该在一个子组件内部改变 prop。如果你这样做了，Vue 会在浏览器的控制台中发出警告。子组件想修改时，只能通过 $emit 派发一个自定义事件，父组件接收到后，由父组件修改。

### Vue 事件绑定原理

原生事件绑定是通过 addEventListener 绑定给真实元素的，组件事件绑定是通过 Vue 自定义的$on 实现的。如果要在组件上使用原生事件，需要加.native 修饰符，这样就相当于在父组件中把子组件当做普通 html 标签，然后加上原生事件。

on、on、on、emit 是基于发布订阅模式的，维护一个事件中心，on 的时候将事件按名称存在事件中心里，称之为订阅者，然后 emit 将对应的事件进行发布，去执行事件中心里的对应的监听器

手写发布订阅原理 [传送门](https://juejin.cn/post/6844904153437700103#heading-2 "https://juejin.cn/post/6844904153437700103#heading-2")

### 说说你对vue虚拟DOM的理解

**一、什么是vdom？**

虚拟 Dom 的产生是`为减小浏览器频繁的操作 DOM，所产生的性能问题`。Vue2 的 Virtual DOM 借鉴了`开源库 snabbdom` 的实现。Virtual DOM 本质就是用一个原生的 JS 对象去描述一个 DOM 节点，是对真实 DOM 的一层抽象。

Virtual DOM 是用JS对象来模拟真实DOM结构，然后用JS对象树构建真实的DOM树。当状态变更时，重新构建一棵新的对象树，然后新旧树通过diff算法进行比较，若存在差异则将差异应用到所构建的真正的树上，视图就更新了。这个比较过程，由原来的查询真实DOM树变成查找js对象属性，性能开销小了，效率也就高了。Virtual DOM 本质上就是在 JS 和 DOM 之间做了一个缓存。

**二、为何要用vdom？**

虚拟dom是为了解决浏览器操作真实dom带来的性能问题而出现的，将DOM操作放在JS层，在内存中操作JS对象可提高效率。

**三、vdom核心函数有哪些**

核心函数：  
h('标签名', {...属性名...}, \[...子元素...\])  
h('标签名', {...属性名...}, '.........')  
patch(container, vnode)  
patch(vnode, newVnode)

**四、优点：**

1.  `保证性能下限`： 框架的虚拟 DOM 需要适配任何上层 API 可能产生的操作，它的一些 DOM 操作的实现必须是普适的，所以它的性能并不是最优的；但是比起粗暴的 DOM 操作性能要好很多，即保证性能的下限；
2.  `无需手动操作 DOM`： 我们不再需要手动去操作 DOM，只需要写好 View-Model 的代码逻辑，框架会根据虚拟 DOM 和 数据双向绑定，帮我们以可预期的方式更新视图，极大提高我们的开发效率；
3.  `跨平台`： 虚拟 DOM 本质上是 JavaScript 对象,而 DOM 与平台强相关，相比之下虚拟 DOM 可以进行更方便地跨平台操作，例如服务器渲染、weex 开发等等。

**五、缺点:**

1.  `无法进行极致优化`： 虽然虚拟 DOM + 合理的优化，足以应对绝大部分应用的性能需求，但在一些性能要求极高的应用中虚拟 DOM 无法进行针对性的极致优化。
2.  `首屏白屏`。首次渲染大量 DOM 时，由于多了一层虚拟 DOM 的计算，会比 innerHTML 插入慢。
3.  `SEO不友好`

### 请用 vnode 描述一个 DOM 结构

```html
<div id="div1" class="container"
<p>vdom</p>
<ul style="font-size:20px"
<li>a</li>
</ul>
div>
```

Vnode 结构如下： tag、props、children

```json
    {
    tag:'div',
        props:{
        className:'container',
        id:'div1'
        },
            children: [
                {
                tag: 'p',
                children: 'vdom'
                },
                    {
                    tag:'ul',
                    props: { style:'font-size:20px'},
                        children:[
                            {
                            tag: 'li'
                            children: 'a'
                        }
                    ]
                }]
            }
```

### 你怎么理解Vue中的diff算法?

简述diff算法过程

*   patch（elem，vnode）和patch（vnode，newVnode）
*   patchVnode和addVnodes 和removeVnodes
*   updateChildren （ key的重要性）

在js中,渲染真实`DOM`的开销是非常大的, 比如我们修改了某个数据,如果直接渲染到真实 DOM, 会引起整个`dom树的重绘和重排`。那么有没有可能实现只更新我们修改的那一小块dom而不要更新整个`dom`呢？此时我们就需要先根据真实`dom`生成虚拟`dom`， 当虚拟`dom`某个节点的数据改变后会生成有一个新的`Vnode`, 然后新的`Vnode`和旧的`Vnode`作比较，发现有不一样的地方就直接修改在真实DOM上，然后使旧的`Vnode`的值为新的`Vnode`。

注意：在`采取diff算法比较的时候，只会在同层级进行，不会跨层级比较`。 当数据发生改变时，set方法会让调用Dep.notify()方法通知所有订阅者Watcher，订阅者就会调用patch函数给真实的DOM打补丁，更新响应的试图。

**Diff对比流程**

当数据改变时，会触发`setter`，并且通过`Dep.notify`去通知所有`订阅者Watcher`，订阅者们就会调用`patch方法`，给真实DOM打补丁，更新相应的视图。

**Diff对比的过程**

就是调用`patch`函数，比较新旧节点，一边比较一边给真实的`DOM`打补丁。在采取`diff`算法比较新旧节点的时候，比较只会在同层级进行。 在`patch`方法中，首先进行树级别的比较, `new Vnode`不存在就删除 `old Vnode`, `old Vnode` 不存在就增加新的`Vnode`, 都存在就执行diff更新,当确定需要执行diff算法时，比较两个`Vnode`，包括三种类型操作：属性更新，文本更新，子节点更新。新老节点均有子节点，则对子节点进行`diff`操作，调用`updatechidren` ，如果老节点没有子节点而新节点有子节点，先清空老节点的文本内容，然后为其新增子节点 如果新节点没有子节点，而老节点有子节点的时候，则移除该节点的所有子节点，老新老节点都没有子节点的时候，进行文本的替换

**updateChildren** 是`patchVnode`里最重要的一个方法，新旧虚拟节点的子节点对比，就是发生在`updateChildren方法`中，采用的是`首尾指针法`。将`Vnode`的子节点Vch和oldVnode的子节点oldCh提取出来。 `oldCh和vCh`各有两个头尾的变量`StartIdx和EndIdx`，它们的2个变量相互比较，一共有4种比较方式。如果4种比较都没匹配，如果设置了`key`，就会用`key`进行比较，在比较的过程中，变量会往中间靠，一旦`StartIdx>EndIdx`表明`oldCh和vCh`至少有一个已经遍历完了，就会结束比较。

[Vue的diff算法传送门](https://juejin.cn/post/6994959998283907102 "https://juejin.cn/post/6994959998283907102")

### Vue的数据为什么频繁变化但只会更新一次

Vue 异步执行 DOM 更新。只要观察到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作上非常重要。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部尝试对异步队列使用原生的 `Promise.then` 和 `MessageChannel`，如果执行环境不支持，会采用 setTimeout(fn, 0) 代替。

另外，关于`waiting`变量，这是很重要的一个标志位，它保证`flushSchedulerQueue`回调（$nextTick中执行）允许被置入`callbacks`一次。

因为Vue的事件机制是通过事件队列来调度执行，会等主进程执行空闲后进行调度，所以先会去等待所有的同步代码执行完成之后再去一次更新。这样的性能优势很明显，比如：

现在有这样的一种情况，`mounted`的时候`test`的值会被循环执行++1000次。 每次++时，都会根据响应式触发`setter->Dep->Watcher->update->run`。 如果这时候没有异步更新视图，那么每次++都会直接操作DOM更新视图，这是非常消耗性能的。 所以Vue实现了一个queue队列，在下一个tick（或者是当前tick的微任务阶段）统一执行queue中Watcher的run。同时，拥有相同id的Watcher不会被重复加入到该queue中去，所以不会执行1000次Watcher的run。最终更新视图只会直接将test对的DOM的0变成1000。 保证更新视图操作DOM的动作是在当前栈执行完以后下一个tick（或者是当前tick的微任务阶段）的时候调用，大大优化了性能。

执行顺序`update -> queueWatcher -> 维护观察者队列（重复id的Watcher处理） -> waiting标志位处理（保证需要更新DOM或者Watcher视图更新的方法flushSchedulerQueue只会被推入异步执行的$nextTick回调数组一次） -> 处理$nextTick（在为微任务或者宏任务中异步更新DOM）->`

*   Vue是异步更新Dom的，Dom的更新放在下一个宏任务或者当前宏任务的末尾（微任务）中进行执行

由于VUE的数据驱动视图更新是异步的，即修改数据的当下，视图不会立刻更新，而是等同一事件循环中的所有数据变化完成之后，再统一进行视图更新。在同一事件循环中的数据变化后，DOM完成更新，立即执行`nextTick(callback)`内的回调。

vue和react一样，对dom的修改都是异步的。它会在队列里记录你对dom的操作并进行diff操作，后一个操作会覆盖前一个，然后更新dom。

### 函数式组件使用场景和原理

**函数式组件与普通组件的区别：**

1.函数式组件需要在声明组件是指定 functional:true 2.不需要实例化，所以没有this,this通过render函数的第二个参数context来代替 3.没有生命周期钩子函数，不能使用计算属性，watch 4.不能通过`$emit` 对外暴露事件，调用事件只能通过context.listeners.click的方式调用外部传入的事件 5.因为函数式组件是没有实例化的，所以在外部通过ref去引用组件时，实际引用的是HTMLElement 6.函数式组件的props可以不用显示声明，所以没有在props里面声明的属性都会被自动隐式解析为prop,而普通组件所有未声明的属性都解析到`$attrs`里面，并自动挂载到组件根元素上面(可以通过inheritAttrs属性禁止)

**优点：**

1.由于函数式组件不需要实例化，无状态，没有生命周期，所以渲染性能要好于普通组件  
2.函数式组件结构比较简单，代码结构更清晰

**使用场景：**

一个简单的展示组件，作为容器组件使用 比如 router-view 就是一个函数式组件 “高阶组件”——用于接收一个组件作为参数，返回一个被包装过的组件

### 导航钩子有哪些？它们有哪些参数

导航钩子翻译过来就是路由的生命周期函数(vue-router) 他其实主要分为两种全局和局部

全局的钩子函数  
beforeEach：在路由切换开始时调用  
afterEach：在路由切换离开是调用

局部到单个路由 beforeEnter

组件的钩子函数  
beforeRouterEnter,  
beforeRouterUpdate,  
beforeRouterLeave

to：即将进入的目标对象  
from：当前导航要高开的导航对象  
next：是一个函数调用resolve执行下一步

### 谈谈对vue生命周期的理解及每个阶段做的事？

每个`Vue`实例在创建时都会经过一系列的初始化过程，`vue`的生命周期钩子，就是说在达到某一阶段或条件时去触发的函数，目的就是为了完成一些动作或者事件

*   `create阶段`：vue实例被创建  
    `beforeCreate`: 创建前，此时data和methods中的数据都还没有初始化  
    `created`： 创建完毕，data中有值，属性和方法的运算，初始化事件，$el属性还没有显示出来，未挂载,。
    
*   `mount阶段`： vue实例被挂载到真实DOM节点  
    `beforeMount`：可以发起服务端请求，去数据，在挂载开始之前被调用，相关的render函数首次被调用。实例已完成以下的配置:编译模板，把data里面的数据和模板生成html。此时还没有挂载html到页面上。  
    `mounted`: 此时可以操作DOM，在el被新创建的vm.$el 替换，并挂载到实例上去之后调用。实例已完成以下的配置:用上面编译好的html内容替换el属性指向的DOM对象。完成模板中的html渲染到html页面中。此过程中进行ajax交互。
    
*   `update阶段`：当vue实例里面的data数据变化时，触发组件的重新渲染  
    `beforeUpdate` :更新前，在数据更新之前调用，发生在虚拟DOM重新渲染和打补丁之前。可以在该钩子中进一步地更改状态，不会触发附加的重渲染过程。  
    `updated`：更新后，在由于数据更改导致的虚拟DOM重新渲染和打补丁之后调用。调用时，组件DOM已经更新，所以可以执行依赖于DOM的操作。然而在大多数情况下，应该避免在此期间更改状态，因为这可能会导致更新无限循环。该钩子在服务器端渲染期间不被调用。
    
*   `destroy阶段`：vue实例被销毁  
    `beforeDestroy`：在实例销毁之前调用。此时可以手动销毁一些方法，实例仍然完全可用。  
    `destroyed`:销毁后，在实例销毁之后调用。调用后，所有的时间监听器都会被溢出，所有的子实例也会被销毁。该钩子在服务器端渲染期间不被调用。
    

#### 组件生命周期

生命周期（父子组件） 父组件beforeCreate --> 父组件created --> 父组件beforeMount --> 子组件beforeCreate --> 子组件created --> 子组件beforeMount --> 子组件 mounted --> 父组件mounted -->父组件beforeUpdate -->子组件beforeDestroy--> 子组件destroyed --> 父组件updated

**加载渲染过程** 父beforeCreate->父created->父beforeMount->子beforeCreate->子created->子beforeMount->子mounted->父mounted

**挂载阶段** 父created->子created->子mounted->父mounted

**父组件更新阶段** 父beforeUpdate->父updated

**子组件更新阶段** 父beforeUpdate->子beforeUpdate->子updated->父updated

**销毁阶段** 父beforeDestroy->子beforeDestroy->子destroyed->父destroyed

### 何时需要使用beforeDestory

*   解绑自定义事件event.$off
*   清除定时器
*   解绑自定义的DOM事件，如window scroll等

### 组件中的data为什么是一个函数？

1.  一个组件被复用多次的话，也就会创建多个实例。本质上，这些实例用的都是同一个构造函数。这样每复用一次组件，类似于给每个组件实例创建一个私有的数据空间，让各个组件实例维护各自的数据。
    
2.  如果data是对象的话，对象属于引用类型，会影响到所有的实例。所以为了保证组件不同的实例之间data不冲突，data必须是一个函数。
    

### computed 和 watch 的区别和运用的场景？

通俗来讲，既能用 computed 实现又可以用 watch 监听来实现的功能，推荐用 computed， 重点在于 computed 的缓存功能。

**computed：**  是计算属性，是用来声明式的描述一个值依赖了其它的属性值，并且 computed 的值有缓存，只有它依赖的属性值发生改变，下一次获取 computed 的值时才会重新计算 computed 的值；`computed`中的函数必须用`return`返回最终的结果，它可以设置 getter 和 setter。

**watch：**  更多的是「观察」的作用，类似于某些数据的监听回调 ，每当监听的数据变化时都会执行回调进行后续操作； watch 监听的是已经在 data 中定义的变量，当该变量变化时，会触发 watch 中的方法。

**运用场景：**

*   当我们需要进行数值计算，并且依赖于其它数据时，应该使用 computed，因为可以利用 computed 的缓存特性，避免每次获取值时，都要重新计算；例：购物车商品结算功能
*   当我们需要在数据变化时执行异步或开销较大的操作时，应该使用 watch，使用 watch 选项允许我们执行异步操作 ( 访问一个 API )，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。这些都是计算属性无法做到的。当一条数据影响多条数据的时候使用，例：搜索数据

### Watch的运行原理

### ajax请求应该放在哪个生命周期

*   mounted
*   JS是单线程的，ajax异步获取数据
*   放在mounted之前没有用，只会让逻辑更加混乱

### 常用指令

*   v-if：判断是否隐藏；
*   v-for：数据循环出来；
*   v-bind:class：绑定一个属性；
*   v-model：实现双向绑定

![image.png](/images/jueJin/4c0176b2c3d543a.png)

### v-model 是什么？有什么用呢？

v-model 只是语法糖而已，v-model 在内部为不同的输入元素使用不同的 property 并抛出不同的事件。相当于 v-bind:value="xxx" 和 @input，意思是绑定了一个 value 属性的值， 子组件可对 value 属性监听，通过$emit('input', xxx)的方式给父组件通讯。自己实现 v-model 方式的组件也是这样的思路。

*   text 和 textarea 元素使用 value property 和 input 事件；
*   checkbox 和 radio 使用 checked property 和 change 事件；
*   select 字段将 value 作为 prop 并将 change 作为事件。

### Vue 修饰符有哪些

**事件修饰符**

*   .stop 阻止事件继续传播
*   .prevent 阻止标签默认行为
*   .capture 使用事件捕获模式,即元素自身触发的事件先在此处处理，然后才交由内部元素进行处理
*   .self 只当在 event.target 是当前元素自身时触发处理函数
*   .once 事件将只会触发一次
*   .passive 告诉浏览器你不想阻止事件的默认行为

**v-model 的修饰符**

*   .lazy 通过这个修饰符，转变为在 change 事件再同步
*   .number 自动将用户的输入值转化为数值类型
*   .trim 自动过滤用户输入的首尾空格

### vue-loader解释下

vue-loader就是一个加载器，能把vue组件转化成javascript模块 为什么要转译vue组件？ 可以动态的渲染一些数据，对三个标签template(结构)、style(表现)、script(行为)都做了优化，script中可以直接使用es6 style 也默认可以使用sass并且还给你提供作用域的选择，另外开发阶段还给你提供热加载 还可以如下使用：

```html
<template src="../hello.vue"></template>
```

### v-show和v-if的区别

*   v-show通过CSS display控制显示和隐藏
*   v-if组件真正的渲染和销毁，而不是显示和隐藏
*   频繁切换显示状态用v-show，否则用v-if

### 为什么v-for和v-if不建议用在一起

1.当 v-for 和 v-if 处于同一个节点时，v-for 的优先级比 v-if 更高，这意味着 v-if 将分别重复运行于每个 v-for 循环中。如果要遍历的数组很大，而真正要展示的数据很少时，这将造成很大的性能浪费 2.这种场景建议使用 computed，先对数据进行过滤

### v-for中key的作用

*   必须用key，且不能是index和random
*   当 Vue.js 用 `v-for` 更新已渲染过的元素列表时，它默认用“`就地复用`”策略。如果数据项的顺序被改变，Vue 将不会移动 DOM 元素来匹配数据项的顺序，而是简单复用此处每个元素，并且确保它在特定索引下显示已被渲染过的每个元素。重复的key会造成渲染错误。
*   `减少渲染次数，提升渲染性能。key`的作用主要是为了让vue可以区分元素，更高效的对比更新虚拟DOM;
*   diff算法中通过tag和key来判断，是否是sameNode。从源码中可以知道，Vue在`patch`过程中判断两个节点是否是相同节点时主要判断两者的key和元素类型等，因此key是一个必要条件，如果不设置key，它的值就是`undefined`，则可能永远认为这是两个是同一个节点，只能去做更新操作，这导致了频繁更新元素，使得整个`patch`过程比较低效，影响性能;```js
    // 咱们来看看sameVnode方法的核心原理代码，就一目了然了
        function sameVnode(oldVnode, newVnode) {
        return (
        oldVnode.key === newVnode.key && // key值是否一样
        oldVnode.tagName === newVnode.tagName && // 标签名是否一样
        oldVnode.isComment === newVnode.isComment && // 是否都为注释节点
        isDef(oldVnode.data) === isDef(newVnode.data) && // 是否都定义了data
        sameInputType(oldVnode, newVnode) // 当标签为input时，type必须是否相同
        )
    }
    ```

### vue组件的通信/通讯方式

*   父子组件通信
    
    父->子`props`，子->父 `$on、$emit`；或者使用自定义事件 `event.$on、event.$off、event.$emit`； 获取父子组件实例 `parent、children` `Ref` 获取实例的方式调用组件的属性或者方法 父->子孙 `Provide、inject` 官方不推荐使用，但是写组件库时很常用
    
*   兄弟组件通信
    
    `Event Bus` 实现跨组件通信 `Vue.prototype.$bus = new Vue()` 自定义事件
    
*   跨级组件通信
    
    `Vuex`、`$attrs、$listeners Provide、inject`
    

### v-model的实现以及它的实现原理吗？

1.  `vue`中双向绑定是一个指令`v-model`，可以绑定一个动态值到视图，同时视图中变化能改变该值。`v-model`是语法糖，默认情况下相于:`value和@input`。
2.  使用`v-model`可以减少大量繁琐的事件处理代码，提高开发效率，代码可读性也更好
3.  通常在表单项上使用`v-model`
4.  原生的表单项可以直接使用`v-model`，自定义组件上如果要使用它需要在组件内绑定value并处理输入事件
5.  我做过测试，输出包含`v-model`模板的组件渲染函数，发现它会被转换为value属性的绑定以及一个事件监听，事件回调函数中会做相应变量更新操作，这说明神奇魔法实际上是vue的编译器完成的。

### nextTick的实现

1.  `nextTick`是`Vue`提供的一个全局`API`,是在下次`DOM`更新循环结束之后执行延迟回调，在修改数据之后使用`$nextTick`，则可以在回调中获取更新后的`DOM`；
2.  Vue在更新DOM时是异步执行的。只要侦听到数据变化，`Vue`将开启1个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个`watcher`被多次触发，只会被推入到队列中-次。这种在缓冲时去除重复数据对于避免不必要的计算和`DOM`操作是非常重要的。`nextTick`方法会在队列中加入一个回调函数，确保该函数在前面的dom操作完成后才调用；
3.  比如，我在干什么的时候就会使用nextTick，传一个回调函数进去，在里面执行dom操作即可；
4.  我也有简单了解`nextTick`实现，它会在`callbacks`里面加入我们传入的函数，然后用`timerFunc`异步方式调用它们，首选的异步方式会是`Promise`。这让我明白了为什么可以在`nextTick`中看到`dom`操作结果。

### nextTick的实现原理是什么？

在下次 DOM 更新循环结束之后执行延迟回调，在修改数据之后立即使用 nextTick 来获取更新后的 DOM。`思路就是采用微任务优先的方式调用异步方法去执行 nextTick 包装的方法。主要使用了宏任务和微任务`。根据执行环境分别尝试采用Promise、MutationObserver、setImmediate，如果以上都不行则采用setTimeout定义了一个异步方法，多次调用nextTick会将方法存入队列中，通过这个异步方法清空当前队列。

### 使用过插槽么？用的是具名插槽还是匿名插槽或作用域插槽

vue中的插槽是一个非常好用的东西slot说白了就是一个占位的 在vue当中插槽包含三种一种是默认插槽（匿名）一种是具名插槽还有一种就是作用域插槽 匿名插槽就是没有名字的只要默认的都填到这里具名插槽指的是具有名字的

### keep-alive的实现

keep-alive 是 Vue 内置的一个组件，可以实现组件缓存，当组件切换时不会对当前组件进行卸载。

*   常用的两个属性 include/exclude，允许组件有条件的进行缓存。
*   两个生命周期 activated/deactivated，用来得知当前组件是否处于活跃状态。
*   keep-alive 的中还运用了 LRU(最近最少使用) 算法，选择最近最久未使用的组件予以淘汰。

作用：实现组件缓存，不需要重复渲染 ,保持这些组件的状态，以避免反复渲染导致的性能问题。

什么时候使用：缓存组件，不需要重复渲染。如有多个静态 Tab 页的切换。优化性能的时候。

场景：tabs标签页 后台导航，vue性能优化

原理：`Vue.js`内部将`DOM`节点抽象成了一个个的`VNode`节点，`keep-alive`组件的缓存也是基于`VNode`节点的而不是直接存储`DOM`结构。它将满足条件`（pruneCache与pruneCache）`的组件在`cache`对象中缓存起来，在需要重新渲染的时候再将`vnode`节点从`cache`对象中取出并渲染。

### 多个组件有相同的逻辑，如何抽离？mixin

在日常的开发中，我们经常会遇到在不同的组件中经常会需要用到一些相同或者相似的代码，这些代码的功能相对独立，可以通过 Vue 的 mixin 功能`抽离公共的业务逻辑`，原理类似“对象的继承”，当组件初始化时会调用 mergeOptions 方法进行合并，采用策略模式针对不同的属性进行合并。当组件和混入对象含有同名选项时，这些选项将以恰当的方式进行“合并”。

mixin 项目变得复杂的时候，多个组件间有重复的逻辑就可以用 mixin 抽离出来

mixin并不是完美的解决方案，会有一些问题,`vue3 提出的 Composition API`旨在解决这些问题【追求完美是要消耗一定的成本的，如开发成本】

场景：PC端新闻列表和详情页一样的右侧栏目，可以使用mixin进行混合

劣势：  
1.变量来源不明确，不利于阅读  
2.多mixin可能会造成命名冲突  
3.mixin和组件可能出现多对多的关系，使得项目复杂度变高

### 何时要使用异步组件？

*   加载大组件的时候
*   路由异步加载的时候

### Vuex的理解及使用场景

Vuex 是一个专为 Vue 应用程序开发的状态管理模式。主要是为了解决组件间状态共享的问题，强调的是数据的集中式管理，每一个 Vuex 应用的核心就是 store（仓库）。用于多个组件中数据共享、数据缓存等。（无法持久化、内部核心原理是通过创造一个全局实例 new Vue）

1.  `Vuex 的状态存储是响应式的`；当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新
2.  `改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation`，这样使得我们可以方便地跟踪每一个状态的变化

Vuex主要包括以下几个核心模块：

1.  `State`：定义了应用的状态数据
2.  `Getter`：在 store 中定义“getter”（可以认为是 store 的计算属性），就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算
3.  `Mutation`：是唯一更改 store 中状态的方法，且必须是同步函数
4.  `Action`：用于提交 mutation，而不是直接变更状态，可以包含任意异步操作
5.  `Module`：允许将单一的 Store 拆分为多个 store 且同时保存在单一的状态树中

![](/images/jueJin/03b13210426f4a1.png)

### Vuex管理状态的机制

集中式管理vue多个组件共享的状态和从后台获取的数据states帮助组件管理状态的，基于state的还有一个计算属性数据getters，getters是从state中读取数据并计算的，他们两个的数据都是给组件去读，组件中读取state状态数据使用store.state或mapState(),读取计算属性数据也有两个方法是store.state或mapState(),读取计算属性数据也有两个方法是store.state或mapState(),读取计算属性数据也有两个方法是store.getters和mapGetters()；更新状态数据涉及到actions和mutations，通过$store.dispatch或mapAction()触发action的调用,然后actions会通过commit()触发mutations调用，mutations则直接更新状态；actions还可以同后台API进行双向通信。

![](/images/jueJin/b2f2b132bed14d9.png)

### 为什么 Vuex的mutation中不能做异步操作？

Vuex中所有的状态更新的唯一途径都是mutation，同步操作通过 Action 来提交 mutation实现，这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用。 如果mutation支持异步操作，就没有办法知道状态是何时更新的，无法很好的进行状态的追踪，给调试带来困难。

### Vuex 中 action 和 mutation 有何区别

*   action 中处理异步，mutation不可以
*   mutation做原子操作
*   action可以整合多个mutation

### Vuex 页面刷新数据丢失怎么解决

需要做 vuex 数据持久化 一般使用本地存储的方案来保存数据 可以自己设计存储方案 也可以使用第三方插件

推荐使用 vuex-persist 插件，它就是为 Vuex 持久化存储而生的一个插件。不需要你手动存取 storage ，而是直接将状态保存至 cookie 或者 localStorage 中。

### 单向数据流

“单向数据流”理念的极简示意：

*   state：驱动应用的数据源。
*   view：以声明方式将 state 映射到视图 。
*   actions：响应在 view 上的用户输入导致的状态变化

#### 单向数据流过程：

![](/images/jueJin/c249c931ca3e4bb.png) 简单的单向数据流（unidirectional data flow）是指用户访问View，View发出用户交互的Action，在Action里对state进行相应更新，state更新后会触发View更新页面的过程。这样数据总是清晰的单向进行流动，便于维护并且可以预测。

### 懒加载的原理

**路由懒加载：** 将不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。

结合 Vue 的异步组件和 Webpack 的代码分割功能，轻松实现路由组件的懒加载。

首先，可以将异步组件定义为返回一个 Promise 的工厂函数 (该函数返回的 Promise 应该 resolve 组件本身)。

第二，在 Webpack 2 中，我们可以使用动态 import 语法来定义代码分块点 (split point)： 结合这两者，这就是如何定义一个能够被 Webpack 自动代码分割的异步组件。

**图片懒加载原理实现：** getBoundingClientRect DOM 元素包含一个getBoundingClientRect 方法， 执行该方法返回当前DOM节点相关的Css边框集合，其中有一个Top 属性代表当前DOM 节点距离浏览器窗口顶部的高度，只需判断top值是否小于当前浏览器窗口的高度(window.innerHeight),若小于说明已经进入用户视野，然后替换为真正的图片即可 另外使用getBoundingClientRect 作图片懒加载需要注意三点 1。 因为需要监听scroll 事件，不停的判断top 的值和浏览器高度的关系，请对监听事件进行函数节流 2. 当屏幕首次渲染时，不会触发scroll 事件，请主动调用一次事件处理程序，否则若用户不滚动则首屏的图片会一直使用懒加载的默认图片 3. 当所有需要懒加载 的图片都被加载完，需要移除事件监听，避免不必要的内存占用

intersectionObserver intersectionObserver作为一个构造函数，传入一个回调函数作为参数，生成一个实例observer， 这个实例有一个observe方法用来观察指定元素是否进入了用户的可视范围，随即触发传入构造函数中的回调函数 同时给回调函数传入一个entries 的参数，记录着这个实例观察的所有元素的对象，其中intersectionRatio 属性表示图片已经进入可视范围百分比，大于0 表示已经有部分进入了用户视野 此时替换为真实的图片，并且调用实例的unobtrusive 将这个img 元素从这个实例的观察列表的去除

### 实现双向绑定 Proxy 与 Object.defineProperty 相比优劣如何?

1.  **Object.definedProperty**的作用是劫持一个对象的属性，劫持属性的getter和setter方法，在对象的属性发生变化时进行特定的操作。而 Proxy劫持的是整个对象。
2.  **Proxy**会返回一个代理对象，我们只需要操作新对象即可，而Object.defineProperty只能遍历对象属性直接修改。
3.  **Object.definedProperty**不支持数组，更准确的说是不支持数组的各种API，因为如果仅仅考虑arry\[i\] = value 这种情况，是可以劫持的，但是这种劫持意义不大。而Proxy可以支持数组的各种API。
4.  尽管Object.defineProperty有诸多缺陷，但是其`兼容性要好于Proxy`。

### Vue项目中实现路由按需加载（路由懒加载）的3中方式：

1.  vue异步组件
2.  es6提案的import()
3.  webpack的require.ensure()

### vue-router 中常用的路由模式实现原理

**hash 模式**

1.  location.hash 的值实际就是 URL 中#后面的东西 它的特点在于：hash 虽然出现 URL 中，但不会被包含在 HTTP 请求中，对后端完全没有影响，因此改变 hash 不会重新加载页面。
2.  可以为 hash 的改变添加监听事件

```js
window.addEventListener("hashchange", funcRef, false);
```

每一次改变 hash（window.location.hash），都会在浏览器的访问历史中增加一个记录利用 hash 的以上特点，就可以来实现前端路由“更新视图但不重新请求页面”的功能了

> 特点：兼容性好但是不美观

**history 模式**

利用了 HTML5 History Interface 中新增的 pushState() 和 replaceState() 方法。

这两个方法应用于浏览器的历史记录站，在当前已有的 back、forward、go 的基础之上，它们提供了对历史记录进行修改的功能。这两个方法有个共同的特点：当调用他们修改浏览器历史记录栈后，虽然当前 URL 改变了，但浏览器不会刷新页面，这就为单页应用前端路由“更新视图但不重新请求页面”提供了基础。

> 特点：虽然美观，但是刷新会出现 404 需要后端进行配置

### Vue中的scoped实现原理

一个项目中的所有style标签全部`加上了scoped，相当于实现了样式的模块化`。 vue中的scoped属性的效果主要`通过PostCSS转译实现`，即：PostCSS给一个组件中的所有dom添加了一个独一无二的动态属性，然后，给CSS选择器额外添加一个对应的属性选择器来选择该组件中dom，这种做法使得样式只作用于含有该属性的dom——组件内部dom。

### vue 中使用了哪些设计模式

1.工厂模式 - 传入参数即可创建实例

虚拟 DOM 根据参数的不同返回基础标签的 Vnode 和组件 Vnode

2.单例模式 - 整个程序有且仅有一个实例

vuex 和 vue-router 的插件注册方法 install 判断如果系统存在实例就直接返回掉

3.发布-订阅模式 (vue 事件机制)

4.观察者模式 (响应式数据原理)

5.装饰模式: (@装饰器的用法)

6.策略模式 策略模式指对象有某个行为,但是在不同的场景中,该行为有不同的实现方案-比如选项的合并策略

### 观察者模式与发布-订阅模式两者的区别

**观察者模式**：允许观察者实例对象(订阅者)执行适当的事件处理程序来注册和接收目标实例对象(发布者)发出的通知（即在观察者实例对象上注册`update`方法），`使订阅者和发布者之间产生了依赖关系`，且没有事件通道。不存在封装约束的单一对象，目标对象和观察者对象必须合作才能维持约束。 观察者对象向订阅它们的对象发布其感兴趣的事件。`通信只能是单向的`。

**发布/订阅模式**：单一目标通常有很多观察者，有时一个目标的观察者是另一个观察者的目标。`通信可以实现双向`。该模式存在不稳定性，发布者无法感知订阅者的状态。

### 使用过 Vue SSR 吗？说说 SSR

SSR 也就是`服务端渲染`，也就是将 Vue 在客户端把标签渲染成 HTML 的工作放在服务端完成，然后再把 html 直接返回给客户端。

**优点：**

SSR 有着更好的 SEO、并且首屏加载速度更快

**缺点：** 开发条件会受到限制，服务器端渲染只支持 beforeCreate 和 created 两个钩子，当我们需要一些外部扩展库时需要特殊处理，服务端渲染应用程序也需要处于 Node.js 的运行环境。

服务器会有更大的负载需求

### 你知道Vue3有哪些新特性吗？它们会带来什么影响？

*   **性能提升**
    
    *   更小巧、更快速 支持自定义渲染器 支持摇树优化：一种在打包时去除无用代码的优化手段 支持Fragments和跨组件渲染
    *   其它方面的更改 Suspense 支持 Fragment（多个根节点）和 Protal（在 dom 其他部分渲染组建内容）组件，针对一些特殊的场景做了处理。 基于 treeshaking 优化，提供了更多的内置功能。
    *   `静态树提升`降低渲染成本
    *   在设计时也考虑TypeScript的类型推断特性 `重写虚拟DOM`可以期待更多的编译时提示来减少运行时的开销
*   **API变动**
    
    *   响应式原理的改变 Vue3.x 使用 Proxy 取代 Vue2.x 版本的 Object.defineProperty,`基于Proxy的观察者机制`节省内存开销
    *   组件选项声明方式 Vue3.x 使用 Composition API setup 是 Vue3.x 新增的一个选项， 他是组件内使用 Composition API 的入口。
    *   模板语法变化 slot 具名插槽语法,`优化插槽生成`可以单独渲染父组件和子组件。 自定义指令 v-model 升级
*   **不兼容IE11**：`检测机制`更加全面、精准、高效,更具可调试式的响应跟踪
    

Vue3.0 新特性以及使用经验总结 [传送门](https://juejin.cn/post/6940454764421316644 "https://juejin.cn/post/6940454764421316644")

### Vue3.0 编译做了哪些优化？

a. 生成 Block tree Vue.js 2.x 的数据更新并触发重新渲染的粒度是组件级的，单个组件内部 需要遍历该组 件的整个 vnode 树。在 2.0 里，渲染效率的快慢与组件大小成正相关：组件越大，渲染 效率越慢。并且，对于一些静态节点，又无数据更新，这些遍历都是性能浪费。 Vue.js 3.0 做到了通过编译阶段对静态模板的分析，编译生成了 Block tree。 Block tree 是一个将模版基于动态节点指令切割的嵌套区块，每个 区块内部的节点结构是固定的， 每个区块只需要追踪自身包含的动态节点。所以，在 3.0 里，渲染效率不再与模板大小 成正相关，而是与模板中动态节点的数量成正相关。

![](/images/jueJin/de75972691ff438.png)

b. slot 编译优化 Vue.js 2.x 中，如果有一个组件传入了 slot，那么每次父组件更新的时候，会强制使子组 件 update，造成性能的浪费。 Vue.js 3.0 优化了 slot 的生成，使得非动态 slot 中属性的更新只会触发子组件的更新。 动态 slot 指的是在 slot 上面使用 v-if，v-for，动态 slot 名字等会导致 slot 产生运行时动 态变化但是又无法被子组件 track 的操作。 c. diff 算法优化

### Vue3.0 是如何变得更快的？（底层，源码）

a. diff 方法优化 Vue2.x 中的虚拟 dom 是进行全量的对比。 Vue3.0 中新增了静态标记（PatchFlag）：在与上次虚拟结点进行对比的时候，值对比 带有 patch flag 的节点，并且可以通过 flag 的信息得知当前节点要对比的具体内容化。 b. hoistStatic 静态提升 Vue2.x : 无论元素是否参与更新，每次都会重新创建。 Vue3.0 : 对不参与更新的元素，只会被创建一次，之后会在每次渲染时候被不停的复用。 c. cacheHandlers 事件侦听器缓存 默认情况下 onClick 会被视为动态绑定，所以每次都会去追踪它的变化但是因为是同一 个函数，所以没有追踪变化，直接缓存起来复用即可。 原作者姓名： 欧阳呀

2.0存在的问题 1.对原始数据进行克隆一份 2.需要分别给对象中的每个属性设置监听 3.0里面使用的是proxy监听对象中的所有的属性

### Vue3.0 和 2.0 的响应式原理区别

Vue3.x 改用 `Proxy 替代 Object.defineProperty`。因为 Proxy 可以直接监听对象和数组的变化，并且有多达 13 种拦截方法。

### vue性能优化的方法 你都做过哪些Vue的性能优化？

**编码阶段**

*   `尽量减少data中的数据及层次结构`，否则性能就会差，data中的数据都会增加getter和setter，会收集对应的watcher
*   不需要响应式的数据不要放到 data 中（可以用 Object.freeze() 冻结数据）
*   `v-if 和 v-show 区分使用场景`，在更多的情况下，使用v-if替代v-show
*   `computed 和 watch 区分使用场景`
*   `v-for 遍历必须加 key`，key保证唯一，最好是 id 值，且避免同时使用 v-if
*   `防止内部泄漏，自定义事件、DOM事件及时销毁`，组件销毁后把全局变量和事件销毁
*   `使用路由懒加载、异步组件`
*   SPA 页面`采用keep-alive缓存组件`
*   使用 vue-loader 在开发环境做模板编译（预编译）
*   如果需要使用v-for给每项元素绑定事件时使用事件代理
*   `防抖、节流运用`
*   长列表滚动到可视区域动态加载
*   大数据列表和表格性能优化-虚拟列表/虚拟表格
*   `第三方模块按需导入`
*   图片懒加载
*   使用 服务端渲染 SSR

**SEO优化**\\

*   服务端渲染 SSR or 预渲染
*   打包优化
*   压缩代码
*   Tree Shaking/Scope Hoisting
*   使用cdn加载第三方模块
*   多线程打包happypack
*   splitChunks抽离公共文件
*   sourceMap优化  
    **用户体验**\\
*   骨架屏
*   PWA
*   还可以使用缓存(客户端缓存、服务端缓存)优化、服务端开启gzip压缩等。

### vue与React比较

相同点：

1.  都是`组件化开发和虚拟DOM(Virtual Dom)`
2.  都`支持通过props进行父子组件间数据通信`
3.  都`支持数据驱动视图，不直接操作DOM`，更新状态数据界面就自动更新
4.  都`支持服务端渲染SSR`
5.  都`支持native的方案`，React的 React Native， Vue 的Weex

不同点：

1.  数据绑定：vue实现了数据的双向绑定，react的数据流动是单向的
2.  组件的写法不一样，React推荐的是JSX语法，也就是把HTML和CSS都写进JavaScript，即"all in js";vue推荐的做法是webpack+vue+loader的单文件组件格式，即html，css，js写在同一个文件中；
3.  数据状态管理不同，state对象在react应用中是不可变的，需要使用setState方法更新状态；在vue中state对象不是必须的，数据由data属性在vue对象中管理
4.  Virtual Dom不一样，vue会跟踪每个组件的依赖关系，不需要重新渲染整个组件树；而对于react而言，每当应用的状态改变时，全部的组件都会被渲染，所以react中会需要shouldComponentUpdate这个生命周期函数方法来进行控制
5.  React严格上只针对MVC的View层，Vue则是MVVM模式

React
-----

### 函数式组件使用场景和原理

函数式组件与普通组件的区别

```kotlin
1.函数式组件需要在声明组件是指定 functional:true
2.不需要实例化，所以没有this,this通过render函数的第二个参数context来代替
3.没有生命周期钩子函数，不能使用计算属性，watch
4.不能通过$emit 对外暴露事件，调用事件只能通过context.listeners.click的方式调用外部传入的事件
5.因为函数式组件是没有实例化的，所以在外部通过ref去引用组件时，实际引用的是HTMLElement
6.函数式组件的props可以不用显示声明，所以没有在props里面声明的属性都会被自动隐式解析为prop,而普通组件所有未声明的属性都解析到$attrs里面，并自动挂载到组件根元素上面(可以通过inheritAttrs属性禁止)
```

优点 1.由于函数式组件不需要实例化，无状态，没有生命周期，所以渲染性能要好于普通组件 2.函数式组件结构比较简单，代码结构更清晰

使用场景：

一个简单的展示组件，作为容器组件使用 比如 router-view 就是一个函数式组件

“高阶组件”——用于接收一个组件作为参数，返回一个被包装过的组件

相关代码如下

```js
    if (isTrue(Ctor.options.functional)) {
    // 带有functional的属性的就是函数式组件
    return createFunctionalComponent(Ctor, propsData, data, context, children);
}
const listeners = data.on;
data.on = data.nativeOn;
installComponentHooks(data); // 安装组件相关钩子 （函数式组件没有调用此方法，从而性能高于普通组件）
```

### React 组件通信方式

react组件间通信常见的几种情况:

*   1.  父组件向子组件通信
*   2.  子组件向父组件通信
*   3.  跨级组件通信
*   4.  非嵌套关系的组件通信

#### 1）父组件向子组件通信

父组件通过 props 向子组件传递需要的信息。父传子是在父组件中直接绑定一个正常的属性，这个属性就是指具体的值，在子组件中，用props就可以获取到这个值

```js
// 子组件: Child
    const Child = props =>{
    return <p>{props.name}</p>
}

// 父组件 Parent
    const Parent = ()=>{
    return <Child name="京程一灯"></Child>
}
```

#### 2）子组件向父组件通信

props+回调的方式，使用公共组件进行状态提升。子传父是先在父组件上绑定属性设置为一个函数，当子组件需要给父组件传值的时候，则通过props调用该函数将参数传入到该函数当中，此时就可以在父组件中的函数中接收到该参数了，这个参数则为子组件传过来的值

```js
// 子组件: Child
    const Child = props =>{
        const cb = msg =>{
            return ()=>{
            props.callback(msg)
        }
    }
    return (
    <button onClick={cb("京程一灯欢迎你!")}>京程一灯欢迎你</button>
    )
}

// 父组件 Parent
    class Parent extends Component {
        callback(msg){
        console.log(msg)
    }
        render(){
        return <Child callback={this.callback.bind(this)}></Child>
    }
}
```

#### 3）跨级组件通信

即父组件向子组件的子组件通信，向更深层子组件通信。

*   使用props，利用中间组件层层传递,但是如果父组件结构较深，那么中间每一层组件都要去传递props，增加了复杂度，并且这些props并不是中间组件自己需要的。
*   使用context，context相当于一个大容器，我们可以把要通信的内容放在这个容器中，这样不管嵌套多深，都可以随意取用，对于跨越多层的全局数据可以使用context实现。

```js
// context方式实现跨级组件通信
// Context 设计目的是为了共享那些对于一个组件树而言是“全局”的数据

const BatteryContext = createContext();

//  子组件的子组件
    class GrandChild extends Component {
        render(){
        return (
        <BatteryContext.Consumer>
            {
            color => <h1 style={{"color":color}}>我是红色的:{color}</h1>
        }
        </BatteryContext.Consumer>
        )
    }
}

//  子组件
    const Child = () =>{
    return (
    <GrandChild/>
    )
}
// 父组件
    class Parent extends Component {
        state = {
        color:"red"
    }
        render(){
        const {color} = this.state
        return (
        <BatteryContext.Provider value={color}>
        <Child></Child>
        </BatteryContext.Provider>
        )
    }
}
```

#### 4）非嵌套关系的组件通信

即没有任何包含关系的组件，包括兄弟组件以及不在同一个父级中的非兄弟组件。

*   1.  可以使用自定义事件通信（发布订阅模式），使用pubsub-js
*   2.  可以通过redux等进行全局状态管理
*   3.  如果是兄弟组件通信，可以找到这两个兄弟节点共同的父节点, 结合父子间通信方式进行通信。
*   4.  也可以new一个 Vue 的 EventBus,进行事件监听，一边执行监听，一边执行新增 VUE的eventBus 就是发布订阅模式，是可以在React中使用的;

### setState 既存在异步情况也存在同步情况

1.异步情况 在`React事件当中是异步操作`

2.同步情况 如果是在`setTimeout事件或者自定义的dom事件`中，都是同步的

```JavaScript
//setTimeout事件
import React,{ Component } from "react";
    class Count extends Component{
        constructor(props){
        super(props);
            this.state = {
            count:0
        }
    }
    
        render(){
        return (
        <>
        <p>count:{this.state.count}</p>
        <button onClick={this.btnAction}>增加</button>
        </>
        )
    }
    
        btnAction = ()=>{
        //不能直接修改state，需要通过setState进行修改
        //同步
            setTimeout(()=>{
                this.setState({
                count: this.state.count + 1
                });
                console.log(this.state.count);
                })
            }
        }
        
        export default Count;
        
``````JavaScript
//自定义dom事件
import React,{ Component } from "react";
    class Count extends Component{
        constructor(props){
        super(props);
            this.state = {
            count:0
        }
    }
    
        render(){
        return (
        <>
        <p>count:{this.state.count}</p>
        <button id="btn">绑定点击事件</button>
        </>
        )
    }
    
        componentDidMount(){
        //自定义dom事件，也是同步修改
            document.querySelector('#btn').addEventListener('click',()=>{
                this.setState({
                count: this.state.count + 1
                });
                console.log(this.state.count);
                });
            }
        }
        
        export default Count;
        
```

### 生命周期

![image.png](/images/jueJin/a093675cbac04e0.png)

```JavaScript
安装
当组件的实例被创建并插入到 DOM 中时，这些方法按以下顺序调用：

constructor()
static getDerivedStateFromProps()
render()
componentDidMount()

更新中
更新可能由道具或状态的更改引起。当重新渲染组件时，这些方法按以下顺序调用：

static getDerivedStateFromProps()
shouldComponentUpdate()
render()
getSnapshotBeforeUpdate()
componentDidUpdate()

卸载
当组件从 DOM 中移除时调用此方法：

componentWillUnmount()
```

### 说一下 react-fiber

#### 1）背景

react-fiber 产生的根本原因，是`大量的同步计算任务阻塞了浏览器的 UI 渲染`。默认情况下，JS 运算、页面布局和页面绘制都是运行在浏览器的主线程当中，他们之间是互斥的关系。如果 JS 运算持续占用主线程，页面就没法得到及时的更新。当我们调用`setState`更新页面的时候，React 会遍历应用的所有节点，计算出差异，然后再更新 UI。如果页面元素很多，整个过程占用的时机就可能超过 16 毫秒，就容易出现掉帧的现象。

#### 2）实现原理

*   react内部运转分三层：
    
    *   Virtual DOM 层，描述页面长什么样。
    *   Reconciler 层，负责调用组件生命周期方法，进行 Diff 运算等。
    *   Renderer 层，根据不同的平台，渲染出相应的页面，比较常见的是 ReactDOM 和 ReactNative。

`Fiber 其实指的是一种数据结构，它可以用一个纯 JS 对象来表示`：

```js
    const fiber = {
    stateNode,    // 节点实例
    child,        // 子节点
    sibling,      // 兄弟节点
    return,       // 父节点
}
```

*   为了实现不卡顿，就需要有一个调度器 (Scheduler) 来进行任务分配。优先级高的任务（如键盘输入）可以打断优先级低的任务（如Diff）的执行，从而更快的生效。任务的优先级有六种：
    
    *   synchronous，与之前的Stack Reconciler操作一样，同步执行
    *   task，在next tick之前执行
    *   animation，下一帧之前执行
    *   high，在不久的将来立即执行
    *   low，稍微延迟执行也没关系
    *   offscreen，下一次render时或scroll时才执行
*   Fiber Reconciler（react ）执行过程分为2个阶段：
    
    *   阶段一，生成 Fiber 树，得出需要更新的节点信息。这一步是一个渐进的过程，可以被打断。阶段一可被打断的特性，让优先级更高的任务先执行，从框架层面大大降低了页面掉帧的概率。
    *   阶段二，将需要更新的节点一次过批量更新，这个过程不能被打断。
*   Fiber树：React 在 render 第一次渲染时，会通过 React.createElement 创建一颗 Element 树，可以称之为 Virtual DOM Tree，由于要记录上下文信息，加入了 Fiber，每一个 Element 会对应一个 Fiber Node，将 Fiber Node 链接起来的结构成为 Fiber Tree。Fiber Tree 一个重要的特点是链表结构，将递归遍历编程循环遍历，然后配合 requestIdleCallback API, 实现任务拆分、中断与恢复。
    

从Stack Reconciler到Fiber Reconciler，源码层面其实就是干了一件递归改循环的事情

### React和Vue在虚拟DOM的diff 算法有什么不同

### Portals

Portals 提供了一种一流的方式来将子组件渲染到存在于父组件的 DOM 层次结构之外的 DOM 节点中。结构不受外界的控制的情况下就可以使用portals进行创建

### 何时要使用异步组件？如和使用异步组件

*   加载大组件的时候
*   路由异步加载的时候

react 中要配合 Suspense 使用

```JavaScript
// 异步懒加载
const Box = lazy(()=>import('./components/Box'));
// 使用组件的时候要用suspense进行包裹
<Suspense fallback={<div>loading...</div>}>
{show && <Box/>}
</Suspense>
```

### React高阶组件的作用有哪些

[传送门](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fmengff%2Fp%2F9657232.html "https://www.cnblogs.com/mengff/p/9657232.html")

### immutable.js

immutable内部提供的所有数据类型，对其数据进行任意操作，`操作得到的结果是修改后的值并且修改后的值是一个新的对象，原来的对象没有发生任何变化`。 [immutable.js文档](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fimmutable-js%2Fimmutable-js "https://github.com/immutable-js/immutable-js")

[github.com/immutable-j…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fimmutable-js%2Fimmutable-js "https://github.com/immutable-js/immutable-js")

[学习文档](https://link.juejin.cn?target=https%3A%2F%2Frhadow.github.io%2F2015%2F05%2F10%2Fflux-immutable%2F "https://rhadow.github.io/2015/05/10/flux-immutable/")

[rhadow.github.io/2015/05/10/…](https://link.juejin.cn?target=https%3A%2F%2Frhadow.github.io%2F2015%2F05%2F10%2Fflux-immutable%2F "https://rhadow.github.io/2015/05/10/flux-immutable/")

```JavaScript
const map1 = Map({a:1,b:2,c:3});
const map2 = map1.set('b',50);
console.log(map1);
console.log(map2);
```

### vuex 和 redux 之间的区别？

从实现原理上来说，最大的区别是两点：

**Redux**使用的是不可变数据，而`Vuex`的数据是可变的。`Redux`每次都是用新的`state`替换旧的`state`，而`Vuex`是直接修改

**Redux**在检测数据变化的时候，是通过`diff`的方式比较差异的，而`Vuex`其实和Vue的原理一样，是通过 `getter/setter`来比较的(如果看`Vuex`源码会知道，其实他内部直接创建一个`Vue`实例用来跟踪数据变化)

### React 事件绑定原理

React并不是将click事件绑在该div的真实DOM上，而是`在document处监听所有支持的事件`，当事件发生并冒泡至document处时，React将事件内容封装并交由真正的处理函数运行。这样的方式不仅减少了内存消耗，还能在组件挂载销毁时统一订阅和移除事件。  
另外冒泡到 document 上的事件也不是原生浏览器事件，而是 React 自己实现的合成事件（SyntheticEvent）。因此我们如果不想要事件冒泡的话，调用 event.stopPropagation 是无效的，而应该调用 `event.preventDefault`。

![react事件绑定原理](/images/jueJin/fbc4e0ed50c54cf.png)

### React 项目中有哪些细节可以优化？实际开发中都做过哪些性能优化

**编译阶段** ->  
**路由阶段** ->  
**渲染阶段** ->  
**细节优化** ->  
**状态管理** ->  
**海量数据源，长列表渲染**

#### 编译阶段

① include 或 exclude 限制 loader 范围。

```js
    {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    include: path.resolve(__dirname, '../src'),
use:['happypack/loader?id=babel']
// loader: 'babel-loader'
}
```

② happypack多进程编译 除了上述改动之外，在plugin中

```js
/* 多线程编译 */
    new HappyPack({
    id:'babel',
loaders:['babel-loader?cacheDirectory=true']
})
```

③缓存babel编译过的文件

```js
loaders:['babel-loader?cacheDirectory=true']

```

④tree Shaking 删除冗余代码

⑤按需加载，按需引入。

#### 路由懒加载，路由监听器

asyncRouter实际就是一个高级组件,将()=>import()作为加载函数传进来，然后当外部Route加载当前组件的时候，在componentDidMount生命周期函数，加载真实的组件，并渲染组件，我们还可以写针对路由懒加载状态定制属于自己的路由监听器beforeRouterComponentLoad和afterRouterComponentDidLoaded，类似vue中watch $route 功能。

```js
// asyncRouter.js 文件
const routerObserveQueue = [] /* 存放路由卫视钩子 */
/* 懒加载路由卫士钩子 */
    export const RouterHooks = {
    /* 路由组件加载之前 */
        beforeRouterComponentLoad: function(callback) {
            routerObserveQueue.push({
            type: 'before',
            callback
            })
            },
            /* 路由组件加载之后 */
                afterRouterComponentDidLoaded(callback) {
                    routerObserveQueue.push({
                    type: 'after',
                    callback
                    })
                }
            }
            /* 路由懒加载HOC */
                export default function AsyncRouter(loadRouter) {
                    return class Content extends React.Component {
                        constructor(props) {
                        super(props)
                        /* 触发每个路由加载之前钩子函数 */
                        this.dispatchRouterQueue('before')
                    }
                state = {Component: null}
                    dispatchRouterQueue(type) {
                    const {history} = this.props
                        routerObserveQueue.forEach(item => {
                        if (item.type === type) item.callback(history)
                        })
                    }
                        componentDidMount() {
                        if (this.state.Component) return
                        loadRouter()
                        .then(module => module.default)
                        .then(Component => this.setState({Component},
                            () => {
                            /* 触发每个路由加载之后钩子函数 */
                            this.dispatchRouterQueue('after')
                            }))
                        }
                            render() {
                            const {Component} = this.state
                                return Component ? <Component {
                                ...this.props
                            }
                            /> : null
                        }
                    }
                }
```

使用

```js
import AsyncRouter ,{ RouterHooks }  from './asyncRouter.js'
const { beforeRouterComponentLoad} = RouterHooks
const Index = AsyncRouter(()=>import('../src/page/home/index'))
const List = AsyncRouter(()=>import('../src/page/list'))
const Detail = AsyncRouter(()=>import('../src/page/detail'))
    const index = () => {
        useEffect(()=>{
        /* 增加监听函数 */
            beforeRouterComponentLoad((history)=>{
            console.log('当前激活的路由是',history.location.pathname)
            })
            },[])
            return <div >
            <div >
            <Router  >
            <Meuns/>
            <Switch>
            <Route path={'/index'} component={Index} ></Route>
            <Route path={'/list'} component={List} ></Route>
            <Route path={'/detail'} component={ Detail } ></Route>
            <Redirect from='/*' to='/index' />
            </Switch>
            </Router>
            </div>
            </div>
        }
```

#### 受控性组件颗粒化 ，独立请求服务渲染单元

可控性组件颗粒化，独立请求服务渲染单元是笔者在实际工作总结出来的经验。目的就是避免因自身的渲染更新或是副作用带来的全局重新渲染。

#### shouldComponentUpdate ,PureComponent 和 React.memo ,immetable.js 助力性能调优

在这里我们拿`immetable.js`为例，讲最传统的限制更新方法，第六部分将要将一些避免重新渲染的细节。

1.  PureComponent 和 React.memo React.PureComponent与 React.Component 用法差不多 ,但React.PureComponent 通过props和state的浅对比来实现 shouldComponentUpate()。如果对象包含复杂的数据结构(比如对象和数组)，他会浅比较，如果深层次的改变，是无法作出判断的，React.PureComponent 认为没有变化，而没有渲染试图。
    
2.  shouldComponentUpdate 使用 shouldComponentUpdate()以让React知道当state或props的改变是否影响组件的重新render，默认返回ture，返回false时不会重新渲染更新，而且该方法并不会在初始化渲染或当使用 forceUpdate() 时被调用，通常一个shouldComponentUpdate 应用是这么写的。
    

```js
//控制状态 仅当`state` 中 `data1` 发生改变的时候，重新更新组件。
    shouldComponentUpdate(nextProps, nextState) {
    /* 当 state 中 data1 发生改变的时候，重新更新组件 */
    return nextState.data1 !== this.state.data1
}

//控制props属性 仅当`props` 中 `data2` 发生改变的时候，重新更新组件。
    shouldComponentUpdate(nextProps, nextState) {
    /* 当 props 中 data2发生改变的时候，重新更新组件 */
    return nextProps.data2 !== this.props.data2
}
```

3.  immetable.js immetable.js 是Facebook 开发的一个js库，可以提高对象的比较性能，像之前所说的pureComponent 只能对对象进行浅比较，,对于对象的数据类型,却束手无策,所以我们可以用 immetable.js 配合 shouldComponentUpdate 或者 react.memo来使用。immutable 中

#### 合理处理细节问题

*   ①绑定事件尽量不要使用箭头函数

```js
//有状态组件
    class index extends React.Component{
        handerClick=()=>{
        console.log(666)
    }
        handerClick1=()=>{
        console.log(777)
    }
        render(){
        return <div>
        <ChildComponent handerClick={ this.handerClick }  />
        <div onClick={ this.handerClick1 }  >hello,world</div>
        </div>
    }
}

//无状态组件
    function index(){
    
        const handerClick1 = useMemo(()=>()=>{
        console.log(777)
        },[])  /* [] 存在当前 handerClick1 的依赖项*/
        const handerClick = useCallback(()=>{ console.log(666) },[])  /* [] 存在当前 handerClick 的依赖项*/
        return <div>
        <ChildComponent handerClick={ handerClick }  />
        <div onClick={ handerClick1 }  >hello,world</div>
        </div>
    }
```

*   ②循环正确使用key

无论是`react` 和 `vue`,正确使用`key`,目的就是在一次循环中，找到与新节点对应的老节点，复用节点，节省开销。

*   ③无状态组件`hooks-useMemo` 避免重复声明。
    
*   ④懒加载 Suspense 和 lazy
    

#### 防止重复渲染

*   ① 学会使用的批量更新state
*   ② 合并state
*   ③ useMemo React.memo隔离单元
*   ④ ‘取缔’state，学会使用缓存。
*   ⑤ useCallback回调

#### 使用状态管理

对于不变的数据，多个页面或组件需要的数据，为了避免重复请求,我们可以将数据放在状态管理里面。

#### 海量数据优化

1.  时间分片

时间分片的概念，就是一次性渲染大量数据，初始化的时候会出现卡顿等现象。我们必须要明白的一个道理，**js执行永远要比dom渲染快的多。**  ，所以对于大量的数据，一次性渲染，容易造成卡顿，卡死的情况。

`setTimeout` 可以用 `window.requestAnimationFrame()` 代替，会有更好的渲染效果。我们`demo`使用列表做的，实际对于列表来说，最佳方案是虚拟列表，而时间分片，更适合**热力图，地图点位比较多的情况**。

```js
    class Index extends React.Component<any,any>{
        state={
    list: []
}
    handerClick=()=>{
    this.sliceTime(new Array(40000).fill(0), 0)
}
    sliceTime=(list,times)=>{
    if(times === 400) return
        setTimeout(() => {
        const newList = list.slice( times , (times + 1) * 100 ) /* 每次截取 100 个 */
            this.setState({
            list: this.state.list.concat(newList)
            })
            this.sliceTime( list ,times + 1 )
            }, 0)
        }
            render(){
            const { list } = this.state
            return <div>
            <button onClick={ this.handerClick } >点击</button>
                {
                list.map((item,index)=><li className="list"  key={index} >
                { item  + '' + index } Item
                </li>)
            }
            </div>
        }
    }
```

2.  虚拟列表

**虚拟列表** 是解决长列表渲染的最佳方案。

为了防止大量`dom`存在影响性能，我们只对，渲染区和缓冲区的数据做渲染，，虚拟列表区 没有真实的dom存在。 缓冲区的作用就是防止快速下滑或者上滑过程中，会有空白的现象。

虚拟列表是按需显示的一种技术，可以根据用户的滚动，不必渲染所有列表项，而只是渲染可视区域内的一部分列表元素的技术。正常的虚拟列表分为 渲染区，缓冲区 ，虚拟列表区。

#### 首屏加载：

```scss
-   首屏优化一般涉及到几个指标FP(First Paint 首次绘制)、FCP(First Contentful Paint 首次有内容的渲染)、FMP(First Meaningful Paint 首次有意义的绘制)、TTI(Time To interactive 可交互时间)；要有一个良好的体验是尽可能的把FCP提前，需要做一些工程化的处理，去优化资源的加载
-   方式及分包策略，资源的减少是最有效的加快首屏打开的方式；
-   对于CSR的应用，FCP的过程一般是首先加载js与css资源，js在本地执行完成，然后加载数据回来，做内容初始化渲染，这中间就有几次的网络反复请求的过程；所以CSR可以考虑使用骨架屏及预渲染（部分结构预渲染）、suspence与lazy做懒加载动态组件的方式
-   当然还有另外一种方式就是SSR(服务端渲染)的方式，SSR对于首屏的优化有一定的优势，但是这种瓶颈一般在Node服务端的处理，建议使用stream流的方式来处理，对于体验与node端的内存管理等，都有优势；
-   不管对于CSR(客户端渲染)或者SSR(服务端渲染)，都建议配合使用Service worker，来控制资源的调配及骨架屏秒开的体验
-   react项目上线之后，首先需要保障的是可用性，所以可以通过React.Profiler分析组件的渲染次数及耗时的一些任务，但是Profile记录的是commit阶段的数据，所以对于react的调和阶段就需要结合performance API一起分析；
-   由于React是父级props改变之后，所有与props不相关子组件在没有添加条件控制的情况之下，也会触发render渲染，这是没有必要的，可以结合React的PureComponent以及React.memo等做浅比较处理，这中间有涉及到不可变数据的处理，当然也可以结合使用ShouldComponentUpdate做深比较处理；
-   所有的运行状态优化，都是减少不必要的render，React.useMemo与React.useCallback也是可以做很多优化的地方；
-   在很多应用中，都会涉及到使用redux以及使用context，这两个都可能造成许多不必要的render，所以在使用的时候，也需要谨慎的处理一些数据；
-   最后就是保证整个应用的可用性，为组件创建错误边界，可以使用componentDidCatch来处理；
- 使用script 的 async 和 defer 属性，异步加载避免阻塞
```

### 首屏优化

*   Vue-Router路由懒加载（利用Webpack的代码切割）
*   使用CDN加速，将通用的库从vendor进行抽离
*   Nginx的gzip压缩
*   Vue异步组件
*   服务端渲染SSR
*   如果使用了一些UI库，采用按需加载
*   Webpack开启gzip压缩
*   如果首屏为登录页，可以做成多入口
*   Service Worker缓存文件处理
*   使用link标签的rel属性设置 prefetch（这段资源将会在未来某个导航或者功能要用到，但是本资源的下载顺序权重比较低，prefetch通常用于加速下一次导航）、preload（preload将会把资源得下载顺序权重提高，使得关键数据提前下载好，优化页面打开速度）

### hooks用过吗？聊聊react中class组件和函数组件的区别

类组件是使用ES6 的 class 来定义的组件。 函数组件是接收一个单一的 `props` 对象并返回一个React元素。

关于React的两套API（类（class）API 和基于函数的钩子（hooks） API）。官方推荐使用钩子（函数），而不是类。因为钩子更简洁，代码量少，用起来比较"轻"，而类比较"重"。而且，钩子是函数，更符合 React 函数式的本质。

函数一般来说，只应该做一件事，就是返回一个值。 如果你有多个操作，每个操作应该写成一个单独的函数。而且，数据的状态应该与操作方法分离。根据函数这种理念，React 的函数组件只应该做一件事情：返回组件的 HTML 代码，而没有其他的功能。函数的返回结果只依赖于它的参数。不改变函数体外部数据、函数执行过程里面没有副作用。

类（class）是数据和逻辑的封装。 也就是说，组件的状态和操作方法是封装在一起的。如果选择了类的写法，就应该把相关的数据和操作，都写在同一个 class 里面。

**类组件的缺点** :

大型组件很难拆分和重构，也很难测试。  
业务逻辑分散在组件的各个方法之中，导致重复逻辑或关联逻辑。  
组件类引入了复杂的编程模式，比如 render props 和高阶组件。  
难以理解的 class，理解 JavaScript 中 `this` 的工作方式。

**区别**：

函数组件的性能比类组件的性能要高，因为类组件使用的时候要实例化，而函数组件直接执行函数取返回结果即可。

1.状态的有无  
hooks出现之前，函数组件`没有实例`，`没有生命周期`，`没有state`，`没有this`，所以我们称函数组件为无状态组件。 hooks出现之前，react中的函数组件通常只考虑负责UI的渲染，没有自身的状态没有业务逻辑代码，是一个纯函数。它的输出只由参数props决定，不受其他任何因素影响。

2.调用方式的不同  
函数组件重新渲染，将重新调用组件方法返回新的react元素。类组件重新渲染将new一个新的组件实例，然后调用render类方法返回react元素，这也说明为什么类组件中this是可变的。

3.因为调用方式不同，在函数组件使用中会出现问题  
在操作中改变状态值，类组件可以获取最新的状态值，而函数组件则会按照顺序返回状态值

**React Hooks（钩子的作用）**

_Hook_ 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

React Hooks的几个常用钩子:

1.  `useState()` //状态钩子
2.  `useContext()` //共享状态钩子
3.  `useReducer()` //action 钩子
4.  `useEffect()` //副作用钩子

还有几个不常见的大概的说下，后续会专门写篇文章描述下

*   1.useCallback 记忆函数 一般把**函数式组件理解为class组件render函数的语法糖**，所以每次重新渲染的时候，函数式组件内部所有的代码都会重新执行一遍。而有了 useCallback 就不一样了，你可以通过 useCallback 获得一个记忆后的函数。
    
    ```js
        function App() {
            const memoizedHandleClick = useCallback(() => {
            console.log('Click happened')
            }, []); // 空数组代表无论什么情况下该函数都不会发生改变
            return <SomeComponent onClick={memoizedHandleClick}>Click Me</SomeComponent>;
        }
    ```
    
    第二个参数传入一个数组，数组中的每一项一旦值或者引用发生改变，useCallback 就会重新返回一个新的记忆函数提供给后面进行渲染。
    
*   2.useMemo 记忆组件 useCallback 的功能完全可以由 useMemo 所取代，如果你想通过使用 useMemo 返回一个记忆函数也是完全可以的。 唯一的区别是：**useCallback 不会执行第一个参数函数，而是将它返回给你，而 useMemo 会执行第一个函数并且将函数执行结果返回给你**。  
    所以 useCallback 常用记忆事件函数，生成记忆后的事件函数并传递给子组件使用。而 useMemo 更适合经过函数计算得到一个确定的值，比如记忆组件。
    
*   3.useRef 保存引用值
    
    useRef 跟 createRef 类似，都可以用来生成对 DOM 对象的引用。useRef 返回的值传递给组件或者 DOM 的 ref 属性，就可以通过 ref.current 值**访问组件或真实的 DOM 节点，重点是组件也是可以访问到的**，从而可以对 DOM 进行一些操作，比如监听事件等等。
    
*   4.useImperativeHandle 穿透 Ref
    
    通过 useImperativeHandle 用于让父组件获取子组件内的索引
    
*   5.useLayoutEffect 同步执行副作用
    
    大部分情况下，使用 useEffect 就可以帮我们处理组件的副作用，但是如果想要同步调用一些副作用，比如对 DOM 的操作，就需要使用 useLayoutEffect，useLayoutEffect 中的副作用会在 DOM 更新之后同步执行。
    
    **useEffect和useLayoutEffect有什么区别**：简单来说就是调用时机不同，useLayoutEffect和原来componentDidMount&componentDidUpdate一致，在react完成DOM更新后马上同步调用的代码，会阻塞页面渲染。而useEffect是会在整个页面渲染完才会调用的代码。`官方建议优先使用useEffect`
    

### Composition API 与 React.js 中 Hooks 的异同点

a. React.js 中的 Hooks 基本使用 React Hooks 允许你 "勾入" 诸如组件状态和副作用处理等 React 功能中。Hooks 只能 用在函数组件中，并允许我们在不需要创建类的情况下将状态、副作用处理和更多东西 带入组件中。 React 核心团队奉上的采纳策略是不反对类组件，所以你可以升级 React 版本、在新组 件中开始尝试 Hooks，并保持既有组件不做任何更改。 案例： useState 和 useEffect 是 React Hooks 中的一些例子，使得函数组件中也能增加状态和 运行副作用。 我们也可以自定义一个 Hooks，它打开了代码复用性和扩展性的新大门。

b. Vue Composition API 基本使用 Vue Composition API 围绕一个新的组件选项 setup 而创建。setup() 为 Vue 组件提供了 状态、计算值、watcher 和生命周期钩子。 并没有让原来的 API（Options-based API）消失。允许开发者 结合使用新旧两种 API （向下兼容）。

c. 原理 React hook 底层是基于链表实现，调用的条件是每次组件被 render 的时候都会顺序执行 所有的 hooks。 Vue hook 只会被注册调用一次，Vue 能避开这些麻烦的问题，原因在于它对数据的响 应是基于 proxy 的，对数据直接代理观察。（这种场景下，只要任何一个更改 data 的地 方，相关的 function 或者 template 都会被重新计算，因此避开了 React 可能遇到的性能 上的问题）。 React 中，数据更改的时候，会导致重新 render，重新 render 又会重新把 hooks 重新注 册一次，所以 React 复杂程度会高一些。 m

### react 最新版本解决了什么问题 加了哪些东西

React 16.x的三大新特性 Time Slicing, Suspense，hooks

*   1.  Time Slicing（解决CPU速度问题）使得在执行任务的期间可以随时暂停，跑去干别的事情，这个特性使得react能在性能极其差的机器跑时，仍然保持有良好的性能
*   2.  Suspense （解决网络IO问题）和lazy配合，实现异步加载组件。 能暂停当前组件的渲染, 当完成某件事以后再继续渲染，解决从react出生到现在都存在的「异步副作用」的问题，而且解决得非
*   的优雅，使用的是「异步但是同步的写法」，我个人认为，这是最好的解决异步问题的方式
*   3.  此外，还提供了一个内置函数 componentDidCatch，当有错误发生时, 我们可以友好地展示 fallback 组件；可以捕捉到它的子元素（包括嵌套子元素）抛出的异常；可以复用错误组件。

* * *

**如果这篇文章帮到了你，记得点赞👍收藏加关注哦😊，希望点赞多多多多...**

**文中如有错误，欢迎在评论区指正**

* * *

往期文章
====

*   [前端面试☞HTTP及网络专题](https://juejin.cn/post/6995404801848639501 "https://juejin.cn/post/6995404801848639501")
*   [2021年前端面试知识点大厂必备](https://juejin.cn/post/6989800620437798919 "https://juejin.cn/post/6989800620437798919")
*   [7月前端高频面试题](https://juejin.cn/post/6992222084382326798 "https://juejin.cn/post/6992222084382326798")
*   [浏览器的工作原理](https://juejin.cn/post/6992597760935460901 "https://juejin.cn/post/6992597760935460901")
*   [深度剖析TCP与UDP的区别](https://juejin.cn/post/6992743999756845087 "https://juejin.cn/post/6992743999756845087")
*   [彻底理解浏览器的缓存机制](https://juejin.cn/post/6992843117963509791 "https://juejin.cn/post/6992843117963509791")
*   [JavaScript是如何影响DOM树构建的](https://juejin.cn/post/6992887065050349605 "https://juejin.cn/post/6992887065050349605")
*   [JavaScript 事件模型](https://juejin.cn/post/6992978598441254925 "https://juejin.cn/post/6992978598441254925")
*   [深入了解现代 Web 浏览器](https://juejin.cn/post/6993095345576083486 "https://juejin.cn/post/6993095345576083486")
*   [在Linux阿里云服务器上部署Nextjs项目](https://juejin.cn/post/6993205190471974925 "https://juejin.cn/post/6993205190471974925")
*   [Snowpack - 更快的前端构建工具](https://juejin.cn/post/6993209659297366024 "https://juejin.cn/post/6993209659297366024")
*   [深入了解 JavaScript 内存泄露](https://juejin.cn/post/6993614323176177695 "https://juejin.cn/post/6993614323176177695")
*   [细说前端路由的hash模式和 history模式](https://juejin.cn/post/6993897542970769421 "https://juejin.cn/post/6993897542970769421")
*   [CSS样式之BFC和IFC的用法](https://juejin.cn/post/6993902300091645965 "https://juejin.cn/post/6993902300091645965")
*   [CSS性能优化](https://juejin.cn/post/6994059570469404686 "https://juejin.cn/post/6994059570469404686")
*   [快速写一个让自己及面试官满意的原型链](https://juejin.cn/post/6994295598958510111 "https://juejin.cn/post/6994295598958510111")
*   [细说JS模块化规范（CommonJS、AMD、CMD、ES6 Module）](https://juejin.cn/post/6994814324548091940 "https://juejin.cn/post/6994814324548091940")
*   [webpack工作原理及loader和plugin的区别](https://juejin.cn/post/6995073296517562376 "https://juejin.cn/post/6995073296517562376")
*   [解读 HTTP1/HTTP2/HTTP3](https://juejin.cn/post/6995109407545622542 "https://juejin.cn/post/6995109407545622542")