---
author: "前端欧阳"
title: "牛逼！Vue3.5的useTemplateRef让ref操作DOM更加丝滑"
date: 2024-09-04
description: "vue3中想要访问DOM和子组件可以使用ref进行模版引用，但是这个ref有一些让人迷惑的地方。比如定义的ref变量到底是一个响应式数据还是DOM元素？"
tags: ["前端","Vue.js","JavaScript"]
ShowReadingTime: "阅读8分钟"
weight: 709
---
前言
==

vue3中想要访问DOM和子组件可以使用ref进行模版引用，但是这个ref有一些让人迷惑的地方。比如定义的ref变量到底是一个响应式数据还是DOM元素？还有template中ref属性的值明明是一个字符串，比如`ref="inputEl"`，怎么就和script中同名的`inputEl`变量绑到一块了呢？所以Vue3.5推出了一个`useTemplateRef`函数，完美的解决了这些问题。

[加入欧阳的高质量vue源码交流群、欧阳平时写文章参考的多本vue源码电子书](https://link.juejin.cn?target=https%3A%2F%2Fvue-compiler.iamouyang.cn%2Fguide%2Fcontact.html "https://vue-compiler.iamouyang.cn/guide/contact.html")

ref模版引用的问题
==========

我们先来看一个`react`中使用ref访问DOM元素的例子，代码如下：

javascript

 代码解读

复制代码

`const inputEl = useRef<HTMLInputElement>(null); <input type="text" ref={inputEl} />`

使用`useRef`函数定义了一个名为`inputEl`的变量，然后将input元素的ref属性值设置为`inputEl`变量，这样就可以通过`inputEl`变量访问到input输入框了。

`inputEl`因为是一个`.current`属性的对象，由于`inputEl`变量赋值给了ref属性，所以他的`.current`属性的值被更新为了input DOM元素，这个做法很符合编程直觉。

再来看看`vue3`中的做法，相比之下就很不符合编程直觉了。

不知道有多少同学和欧阳一样，最开始接触vue3时总是在template中像`react`一样给ref属性绑定一个ref变量，而不是ref变量的名称。比如下面这样的代码：

javascript

 代码解读

复制代码

`<input type="text" :ref="inputEl" /> const inputEl = ref<HTMLInputElement>();`

\*\*更加要命的是这样写还不会报错！！！！\*\*当我们使用`inputEl`变量去访问input输入框时始终拿到的都是`undefined`。

经过多次排查发现原来ref属性接收的不是一个ref变量，而是ref变量的名称。正确的代码应该是这样的：

javascript

 代码解读

复制代码

`<input type="text" ref="inputEl" /> const inputEl = ref<HTMLInputElement>();`

还有就是如果我们将ref模版引用相关的逻辑抽成hooks后，那么必须将在vue组件中也要将ref属性对应的ref变量也定义才可以。

hooks代码如下：

javascript

 代码解读

复制代码

`export default function useRef() {   const inputEl = ref<HTMLInputElement>();   function setInputValue() {     if (inputEl.value) {       inputEl.value.value = "Hello, world!";     }   }   return {     inputEl,     setInputValue,   }; }`

在hooks中定义了一个名为`inputEl`的变量，并且在`setInputValue`函数中会通过`inputEl`变量对input输入框进行操作。

vue组件代码如下：

javascript

 代码解读

复制代码

`<template>   <input type="text" ref="inputEl" />   <button @click="setInputValue">给input赋值</button> </template> <script setup lang="ts"> import useInput from "./useInput"; const { setInputValue, inputEl } = useInput(); </script>`

虽然在vue组件中我们不会使用`inputEl`变量，但是还是需要从hooks中导入`useInput`变量。大家不觉得这很奇怪吗？导入了一个变量，又没有显式的去使用这个变量。

如果在这里不去从hooks中导入`inputEl`变量，那么`inputEl`变量中就不能绑定上input输入框了。

useTemplateRef函数
================

为了解决上面说的ref模版引用的问题，在Vue3.5中新增了一个`useTemplateRef`函数。

`useTemplateRef`函数的用法很简单：只接收一个参数`key`，是一个字符串。返回值是一个ref变量。

其中参数key字符串的值应该等于template中ref属性的值。

返回值是一个ref变量，变量的值指向模版引用的DOM元素或者子组件。

我们来看个例子，前面的demo改成`useTemplateRef`函数后代码如下：

javascript

 代码解读

复制代码

`<template>   <input type="text" ref="inputRef" />   <button @click="setInputValue">给input赋值</button> </template> <script setup lang="ts"> import { useTemplateRef } from "vue"; const inputEl = useTemplateRef<HTMLInputElement>("inputRef"); function setInputValue() {   if (inputEl.value) {     inputEl.value.value = "Hello, world!";   } } </script>`

在template中ref属性的值为字符串`"inputRef"`。

在script中使用`useTemplateRef`函数，传入的第一个参数也是字符串`"inputRef"`。`useTemplateRef`函数的返回值就是指向input输入框的ref变量。

由于`inputEl`是一个ref变量，所以在click事件中想要访问到DOM元素input输入框就需要使用`inputEl.value`。

我们这里是要给输入框中塞一个字符串"Hello, world!"，所以使用`inputEl.value.value = "Hello, world!"`

使用了`useTemplateRef`函数后和之前比起来就很符合编程直觉了。template中ref属性值是一个字符串`"inputRef"`，使用`useTemplateRef`函数时也传入字符串`"inputRef"`就能拿到对应的模版引用了。

hooks中使用useTemplateRef
======================

回到前面讲的hooks的例子，使用`useTemplateRef`后hooks代码如下：

javascript

 代码解读

复制代码

`export default function useInput(key) {   const inputEl = useTemplateRef<HTMLInputElement>(key);   function setInputValue() {     if (inputEl.value) {       inputEl.value.value = "Hello, world!";     }   }   return {     setInputValue,   }; }`

现在我们在hooks中就不需要导出变量`inputEl`了，因为这个变量只需要在hooks内部使用。

vue组件代码如下：

javascript

 代码解读

复制代码

`<template>   <input type="text" ref="inputRef" />   <button @click="setInputValue">给input赋值</button> </template> <script setup lang="ts"> import useInput from "./useInput"; const { setInputValue } = useInput("inputRef"); </script>`

由于在vue组件中我们不需要使用`inputEl`变量，所以在这里就不需要从`useInput`中引入变量`inputEl`了。而之前不使用`useTemplateRef`的方案中我们就不得不引入`inputEl`变量了。

动态切换ref绑定的变量
============

有的时候我们需要根据不同的场景去动态切换ref模版引用的变量，这时在template中ref属性的值就是动态的了，而不是一个写死的字符串。在这种场景中`useTemplateRef`也是支持的，代码如下：

javascript

 代码解读

复制代码

`<template>   <input type="text" :ref="refKey" />   <button @click="switchRef">切换ref绑定的变量</button>   <button @click="setInputValue">给input赋值</button> </template> <script setup lang="ts"> import { useTemplateRef, ref } from "vue"; const refKey = ref("inputEl1"); const inputEl1 = useTemplateRef<HTMLInputElement>("inputEl1"); const inputEl2 = useTemplateRef<HTMLInputElement>("inputEl2"); function switchRef() {   refKey.value = refKey.value === "inputEl1" ? "inputEl2" : "inputEl1"; } function setInputValue() {   const curEl = refKey.value === "inputEl1" ? inputEl1 : inputEl2;   if (curEl.value) {     curEl.value.value = "Hello, world!";   } } </script>`

在这个场景template中ref绑定的就是一个变量`refKey`，通过点击`切换ref绑定的变量`按钮可以切换`refKey`的值。相应的，绑定input输入框的变量也会从`inputEl1`变量切换成`inputEl2`变量。

`useTemplateRef`是如何实现的？
=======================

我们来看看`useTemplateRef`的源码，其实很简单，简化后的代码如下：

javascript

 代码解读

复制代码

`function useTemplateRef(key) {   const i = getCurrentInstance();   const r = shallowRef(null);   if (i) {     const refs = i.refs === EMPTY_OBJ ? (i.refs = {}) : i.refs;     Object.defineProperty(refs, key, {       enumerable: true,       get: () => r.value,       set: (val) => (r.value = val),     });   }   return r; }`

首先使用`getCurrentInstance`方法获取当前vue实例对象，赋值给变量`i`。

然后调用`shallowRef`函数生成一个浅层的ref对象，初始值为null。这个ref对象就是`useTemplateRef`函数返回的ref对象。

接着就是判断当前vue实例如果存在就读取实例上面的`refs`属性对象，如果实例对象上面没有`refs`属性，那么就初始化一个空对象到vue实例对象的`refs`属性。

vue实例对象上面的这个`refs`属性对象用过vue2的同学应该都很熟悉，里面存的是注册过ref属性的所有 DOM 元素和组件实例。

vue3虽然不像vue2一样将`refs`属性对象开放给开发者，但是他的内部依然还是用vue实例上面的`refs`属性对象来存储template中使用ref属性注册过的元素和组件实例。

这里使用了`Object.defineProperty`方法对`refs`属性对象进行拦截，拦截的字段是变量`key`的值，而这个`key`的值就是template中使用ref属性绑定的值。

以我们上面的demo举例，在template中的代码如下：

javascript

 代码解读

复制代码

`<input type="text" ref="inputRef" />`

这里使用ref属性在vue实例的`refs`属性对象上面注册了一个input输入框，`refs.inputRef`的值就是指向DOM元素input输入框。

然后在script中是这样使用`useTemplateRef`的：

javascript

 代码解读

复制代码

`const inputEl = useTemplateRef<HTMLInputElement>("inputRef")`

调用`useTemplateRef`函数时传入的是字符串`"inputRef"`，在`useTemplateRef`函数内部使用`Object.defineProperty`方法对`refs`属性对象进行拦截，拦截的字段为变量`key`的值，也就是调用`useTemplateRef`函数传入的字符串`"inputRef"`。

初始化时，vue处理input输入框上面的`ref="inputRef"`就会执行下面这样的代码：

javascript

 代码解读

复制代码

`refs[ref] = value`

此时的`value`的值就是指向DOM元素input输入框，`ref`的值就是字符串`"inputRef"`。

那么这行代码就是将DOM元素input输入框赋值给`refs`对象上面的`inputRef`属性上。

由于这里对`refs`对象上面的`inputRef`属性进行写操作，所以会走到`useTemplateRef`函数中`Object.defineProperty`定义的`set`拦截。代码如下：

javascript

 代码解读

复制代码

`const r = shallowRef(null); Object.defineProperty(refs, key, {   enumerable: true,   get: () => r.value,   set: (val) => (r.value = val), });`

在`set`拦截中会将DOM元素input输入框赋值给ref变量`r`，而这个`r`就是`useTemplateRef`函数返回的ref变量。

同样的当对象`refs`对象的`inputRef`属性进行读操作时，也会走到这里的`get`拦截中，返回`useTemplateRef`函数中定义的ref变量`r`的值。

总结
==

Vue3.5中新增的`useTemplateRef`函数解决了ref属性中存在的几个问题：

*   不符合编程直觉，template中ref属性的值是script中对应的ref变量的**变量名**。
    
*   在script中如果不使用ts，则不能直观的知道一个ref变量到底是响应式数据还是DOM元素？
    
*   将定义和访问DOM元素相关的逻辑抽到hooks中后，虽然vue组件中不会使用到存放DOM元素的变量，但是也必须在组件中从hooks中导入。
    

接着我们讲了`useTemplateRef`函数的实现。在`useTemplateRef`函数中会定义一个ref对象，在`useTemplateRef`函数最后就是return返回这个ref对象。

接着使用`Object.defineProperty`对vue实例上面的`refs`属性对象进行get和set拦截。

初始化时，处理template中的ref属性，会对vue实例上面的`refs`属性对象进行写操作。

然后就会被set拦截，在set拦截中会将`useTemplateRef`函数中定义的ref对象的值赋值为绑定的DOM元素或者组件实例。

而`useTemplateRef`函数就是将这个ref对象进行return返回，所以我们可以通过`useTemplateRef`函数的返回值拿到template中ref属性绑定的DOM元素或者组件实例。

最后推荐一下欧阳自己写的开源电子书[vue3编译原理揭秘](https://link.juejin.cn?target=https%3A%2F%2Fvue-compiler.iamouyang.cn%2F "https://vue-compiler.iamouyang.cn/")，看完这本书可以让你对vue编译的认知有质的提升，并且这本书初、中级前端能看懂。`完全免费，只求一个star。`