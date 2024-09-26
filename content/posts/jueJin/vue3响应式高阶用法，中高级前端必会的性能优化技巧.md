---
author: "天天鸭"
title: "vue3响应式高阶用法，中高级前端必会的性能优化技巧"
date: 2024-07-22
description: "#前言：翻别人代码时，总结发现极大部分使用`vue3`的人只会用`ref`和`reactive，其实有更好性能的api可以用"
tags: ["Vue.js","前端","性能优化"]
ShowReadingTime: "阅读5分钟"
weight: 763
---
前言：
===

翻别人代码时，总结发现极大部分使用`vue3`的人只会用`ref`和`reactive`处理响应式数据无论什么场景都是，但`vue官方`针对某些应用场景有其它的更好用的`响应式api`实现响应式，从而达到更好的性能效果。例如深层的树状数据结构可以通过`shallowRef`实现浅层响应式，不会被深层递归地转为响应式。本文通过例子详细总结几种`vue3`响应式的高阶用法。

一、 shallowRef()
===============

> 简述：`ref`的浅层作用形式。`shallowRef`与普通的 `ref` 的区别在于，`shallowRef` 不会对对象进行深度的响应式处理，也就是 `shallowRef` 包含的对象内部的属性发生变化时，`shallowRef` 本身不会触发重新渲染或响应式更新，所以使用`shallowRef`时只关心顶层的引用变化。

**代码示例：**

ini

 代码解读

复制代码

`<script lang="ts" setup>   import { shallowRef } from 'vue';   const data = shallowRef({ name: '天天鸭', age: 18 });   // 修改顶层引用会触发响应式更新   data.value = { name: 'Bob', age: 20 };   // 修改内部属性不会触发响应式更新   data.value.age = 30; </script>`

作为性能优化的一种手段，当业务场景中有大量复杂数据结构但只有顶层引用需要响应式时就非常有用，但你需要更加注意对象的更新逻辑，确保在需要时正确地应用响应式转换。

二、 triggerRef()
===============

> 简述：用于强制执行依赖于 `shallowRef` 的副作用。也就是说当使用`shallowRef`响应式时只能修改顶层数据，但特殊情况使用 `triggerRef`可以强制修改内层属性，大大提高灵活性。

**代码示例：**

ini

 代码解读

复制代码

`<script lang="ts" setup>   import { shallowRef, triggerRef } from 'vue';   const data = shallowRef({ name: '天天鸭', age: 18 });   // 修改内部属性不会触发响应式更新   data.value.age = 30;   // 但这里调用 triggerRef 强制更新   triggerRef(data); </script>`

`triggerRef` 一般配合`shallowRef`一起使用，起到提高`shallowRef`的灵活性的同时又能优化性能的效果。需要注意执行顺序确保在修改了 `shallowRef` 内部对象的属性之后才调用。

三、 customRef()
==============

简述：`customRef` 功能非常之强大，`customRef`可以创建自定义的 `ref` 对象，这些对象可以有更复杂的依赖跟踪和依赖更新逻辑。具体是`customRef` 接收一个工厂函数，该函数必须要返回一个具有 `get` 和 `set` 方法的对象。这些方法用于读取和修改引用值，并且通过`get` 和 `set`里面的逻辑可以显式地控制依赖关系的跟踪和响应式更新。

**代码示例：** 实现一个有防抖功能的`ref`，第9和17行的`track()`和`trigger()`是固定写法，这是`vue3`底层响应式原理相关的，这里就不多解释了。

xml

 代码解读

复制代码

`<script lang="ts" setup> import { customRef } from 'vue'; function debouncedRef(initialValue, delay) {   let timeoutId;   return customRef((track, trigger) => ({        get() {       // 使用 track 函数标记依赖       track();       return initialValue;     },          set(newValue) {       clearTimeout(timeoutId);       timeoutId = setTimeout(() => {         initialValue = newValue;         // 使用 trigger 函数触发依赖更新         trigger();       }, delay);     }        })); } // 使用自定义的ref const myDebouncedRef = debouncedRef('Hello Word', 500); </script>`

在上述例子中，`debouncedRef` 是一个自定义的 `ref` 工厂函数，它接收两个参数分别是初始值和延迟时间。当 `set` 方法被调用时，会清除之前的计时器并设置一个新的计时器，在延迟时间结束后更新值并触发依赖更新。

**在组件中使用：**

xml

 代码解读

复制代码

`<script lang="ts" setup> import { onMounted } from 'vue'; import { debouncedRef } from './debouncedRef'; export default {   setup() {     const myDebouncedRef = debouncedRef('Hello Word', 500);     onMounted(() => {       // 在组件挂载后，可以通过 .value 访问 ref 的值       console.log(myDebouncedRef.value);  // 时间到之后返回 'Hello Word'     });   }, }; </script>`

**注意：** `customRef` 返回的对象必须有一个 `value` 属性用于访问或修改引用的值，这是 `vue` 规定的。除此以外`customRef`能根据业务需求实现各种定制化的`ref`, 如异步更新、条件性更新、防抖、节流等

四、 shallowReactive()
====================

> 简述：`reactive`的浅层作用形式, 和`shallowRef`的功能比较类似。`shallowReactive`与普通的 `reactive` 的区别在于，`shallowReactive` 不会对对象进行深度的响应式处理，也就是 `shallowReactive` 包含的对象内部的属性发生变化时，`shallowReactive` 本身不会触发重新渲染或响应式更新，所以使用`shallowReactive`时只关心顶层的引用变化。

**代码示例：**

xml

 代码解读

复制代码

`<script lang="ts" setup>   import { shallowReactive, isReactive } from 'vue';   const statetest = shallowReactive({     foo: 1,     nested: {       age: 18,     },   });   statetest.foo++;    // 更改状态自身的属性是响应式的   // 下层嵌套对象不会被转为响应式   isReactive(statetest.nested); // false   statetest.nested.age++;     // 不是响应式的 </script>`

作为性能优化的一种手段，当业务场景中有大量复杂数据结构但只有顶层引用需要响应式时就非常有用，但你需要更加注意对象的更新逻辑，确保在需要时正确地应用响应式转换。

五、 toRaw()
==========

> 简述：`toRaw`用于获取 `reactive` 或 `ref` 创建的响应式代理对象的原始值。当我们使用 `reactive` 或 `ref` 创建一个对象或值时，`Vue` 会在内部创建一个代理对象，这个代理对象能够追踪属性的变化并触发视图的更新。但有时候需要访问这个对象的非响应式版本时`toRaw` 就派上用场了。

**代码示例：**

ini

 代码解读

复制代码

`<script lang="ts" setup>   import { reactive, toRaw } from 'vue';   const state = reactive({ count: 0 });   // 获取响应式转为原始对象   const rawState = toRaw(state);   // 修改原始对象不会触发响应式更新   rawState.count = 10;   // 仍然输出 0，因为 state 是响应式代理，未被修改   console.log(state.count);  </script>`

使用 `toRaw` 获取的原始对象将不再具有响应性。即`toRaw` 提供了一种方式来绕过 `Vue` 的响应式系统，这对于性能优化和处理外部库至关重要。当正在处理一个大的数据结构，并且知道某些操作不会导致 `UI` 更新时使用特别合适。

六、 markRaw()
============

> 简述：作用是标记一个对象，使其不再被 `reactive` 或 `shallowReactive` 转换为响应式代理。即你之后试图用这些函数包装这个对象，它也会保持原样，不会变成响应式的。

**代码示例：** `markRaw` 主要用于标记对象，而不是基本类型的值

ini

 代码解读

复制代码

`<script lang="ts" setup>   import { markRaw } from 'vue';   const someObject = { name: '天天鸭' };   const markedObject = markRaw(someObject);   // 即使使用 reactive，markedObject 也不会变成响应式   const state = reactive({ obj: markedObject }); </script>`

**注意：** `markRaw`不适用于`ref`，因为`ref` 的工作方式与 `reactive` 有点区别。`ref` 主要用于创建一个响应式引用，它可以封装任何类型的值如字符串、数字和对象。当你创建一个 `ref` 时，`Vue` 并不是将整个对象转换为响应式代理，而是将 `ref` 本身作为一个响应式引用，通过 `value` 属性来访问和修改其内部的值。

因此，当你将一个对象放入 `ref` 时，`ref` 本身依然是响应式的，而 `markRaw` 的作用是阻止对象被转换为响应式，这和 `ref` 的设计并不匹配。

七、 shallowReadonly()
====================

简述：`readonly` 的浅层作用形式。和 `readonly` 类似，`shallowReadonly` 会把对象的属性变为只读，但是它只会影响到对象的顶层属性，而不会递归地使对象内部的属性也变为只读。

**代码示例：**

ini

 代码解读

复制代码

``<script lang="ts" setup> import { shallowReadonly } from 'vue'; const state = {   name: '天天鸭',   profile: {     age: 18,     address: {       city: '广州',     }   } }; const shallowState = shallowReadonly(state); // 这将会抛出错误，因为顶层属性是只读的 shallowState.name = 'change天天鸭'; // 这是可以的，因为 `profile` 对象没有被设为只读 shallowState.profile.age = 31;  // 同样，`address` 对象也可以被修改 shallowState.profile.address.city = '深圳'; </script>``

使用 `shallowReadonly` 的对象在顶层是只读的，但其内部的嵌套对象或数组仍然可以被修改。如果数据结构第一层业务需求不会改变就特别适用。

小结：
===

在真实做项目时其实不用这些进阶用法同样能实现功能，但是在合适的场景用上了却能锦上添花，作为一个有一定经验的`vue`程序员更是要必会了。如果我写的哪里不对或者不好欢迎大佬指出。