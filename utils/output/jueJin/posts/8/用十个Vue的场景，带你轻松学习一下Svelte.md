---
author: "Sunshine_Lin"
title: "用十个Vue的场景，带你轻松学习一下Svelte"
date: 2023-08-16
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心。 Svelte 近几年听到的主流框架都是 Vue、React、Angular，但其实有一个框架在国外非"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:20,comments:3,collects:20,views:2331,"
---
前言
--

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心。

![](/images/jueJin/3928fd3e3bbb4a3.png)

Svelte
------

近几年听到的主流框架都是 `Vue、React、Angular`，但其实有一个框架在国外非常火，用起来也是很方便，那就是`Svelte`，这个框架已经连续多年在 Stack Overflow 的开发者调查中成为最受喜爱的前端 UI 框架，但是在国内的名气感觉还是不怎么大~

抱着`技多不压身`的想法，我觉得大家可以了解一下`Svelte`，了解一下它的用法~~ 接下来就通过一些小例子，带大家认识一下它的用法~~

Vite & Svelte
-------------

现阶段`Vite`创建脚手架已经集成了`Svelte`，所以我们可以使用`Vite`去初始化一个`Svelte`的开发项目~我们使用命令去初始：

```js
npm create vite@latest
```

接着我们设置完项目名后，选择`Svelte`

![](/images/jueJin/0c89271c42d84e2.png)

然后进入项目执行依赖安装，安装完后运行项目

```js
npm i
npm run dev
```

![](/images/jueJin/327dcfbf8d2b4a7.png)

变量 & 事件
-------

定义变量时，不需要像`vue`那样使用`ref`，也不需要像`react`那样使用`useState`，只需要直接命名变量即可，这就是一个响应式的变量了

事件需要用到`Svelte`的语法 `on:`，比如点击事件 `on:click={xxxxx}`

下面的例子就可以实现按钮点击，实现数字的自增~

```html
<script lang="ts">
let count: number = 0
    const increment = () => {
    count += 1
}
</script>

<button on:click={increment}>
count is {count}
</button>
```

![](/images/jueJin/06c50b74fd73487.png)

父传子 & 子传父
---------

### 父传子

先说说父传子，`Svelte`提供了`export`关键字，子组件中可以使用`export`来接收，并且可以结合`typescript`去定义属性的类型

```html
// Children.svelte

<script lang="ts">
export let name: string;
export let age: number;
</script>

<div>我叫{name}，今年{age}岁</div>
```

父组件里面，`Svelte`中提供了`{}`这样的语法糖，去支持父组件传值到子组件中，且类型一定要符合子组件中定义的类型，不然会报类型错误~

```html
// 父组件
<script lang="ts">
import Children from './lib/Children.svelte'

let name = '林三心';
let age = 18
</script>

<main>
<div class="card">
<Children {name} {age} />
</div>
</main>
```

![](/images/jueJin/4b06ce0d3ee649f.png)

### 子传父

其实很多框架都一样，数据都是单向流的，父传子很正常。但是子传父的话，最好就是使用事件去传输

*   子组件：需要使用`createEventDispatcher`去派发到父组件
*   父组件：需要使用`on:message`去接收子组件传过来的

```html
// Children.svelte

<script>
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();

    function sendData() {
    const data = 'Hello from Child!';
    dispatch('message', data);
}
</script>

<button on:click={sendData}>发送</button>
``````html
// 父组件
<script lang="ts">
import Children from './lib/Children.svelte'

    const handleMessage = (event) => {
    console.log(event.detail); // 输出子组件传递的数据
}
</script>

<main>
<div class="card">
<Children on:message={handleMessage} />
</div>
</main>
```

![](/images/jueJin/3147dfa41f614cc.png)

双向绑定
----

`Svelte`跟`Vue`一样，都提供了双向绑定的语法糖：

*   input框使用 bind:value
*   单选框、多选框使用 bind:value
*   选框组使用 bind:group

```html
<script>
let inputValue = "";
let checkboxValue = false;
let groupValue = null;
</script>

<input bind:value={inputValue} />
<input type="checkbox" bind:checked={checkboxValue} />

<input type="radio" bind:group={groupValue} name="books" value="单选1" />
<input type="radio" bind:group={groupValue} name="books" value="单选2" />
<input type="radio" bind:group={groupValue} name="books" value="单选3" />
```

插槽
--

`Svelte`跟`Vue`一样，都提供了`插槽 -> slot`，并且支持`默认插槽`和`具名插槽`

```html
// Children.svelte

<div>
<div>default 插槽</div>
<slot></slot>

<div>------------</div>
<div>footer 插槽</div>
<slot name="footer"></slot>
</div>
``````html
// 父组件

<Children>
<div>哈哈哈哈哈哈</div>
<div slot="footer">嘻嘻嘻嘻嘻嘻</div>
</Children>
```

![](/images/jueJin/8bff4e037b40482.png)

生命周期
----

`Svelte`跟`Vue`一样，都提供了生命周期的 API

*   **onMount:** 组件挂载
*   **beforeUpdate:** 组件更新之前
*   **afterUpdate:** 组件更新之后
*   **onDestroy:** 组件销毁

```html
<script>
import { onMount, beforeUpdate, afterUpdate, onDestroy } from 'svelte'

onMount(() => {})
beforeUpdate(() => {})
afterUpdate(() => {})
onDestroy(() => {})
</script>
```

获取 DOM 节点
---------

`Svelte`想要获取 DOM 节点，需要使用 `bind:this`

```html
<script lang="ts">
import { onMount } from 'svelte'
let ele: HTMLDivElement

    onMount(() => {
    console.log(ele)
    })
    </script>
    
    <div bind:this={ele}>哈哈</div>
```

![](/images/jueJin/fe03db10d36a416.png)

异步更新获取最新 DOM
------------

在`Vue`中，当变量修改时，DOM 并不会马上进行更新，而是进行了异步更新，所以需要使用到`netTick`这个 API 去获取到最新 DOM

在`Svelte`中，也提供了类似的方法`tick`，它是一个`Promise`函数，会在视图更新前执行，所以在他之后执行就可以拿到最新的 DOM 信息~

```html
<script lang="ts">
import { tick } from 'svelte'
let ele: HTMLDivElement
let msg = '哈哈'

    const handleChange = async () => {
    msg = '嘿嘿'
    console.log(ele.innerHTML) // 哈哈
    await tick()
    console.log(ele.innerHTML) // 嘿嘿
}
</script>

<div bind:this={ele}>{msg}</div>
<button on:click={handleChange}>修改文本</button>
```

watch & computed
----------------

`Svelte`提供了`$`这个符号，类似于`Vue`中的`watch、computed`，当某些变量发生改变时，去触发一些函数的执行~

```html
<script lang="ts">
let count = 1;
let msg1 = `count现在是${count}`;
let msg2 = `count的两倍是${count * 2}`;

    const handleChange = async () => {
    count++;
    };
    
    $: msg1 = `count现在是${count}`;
        $: {
        const res = count * 2;
        msg2 = `count的两倍是${res}`;
    }
    </script>
    
    <div>{msg1}</div>
    <div>{msg2}</div>
    <button on:click={handleChange}>修改count</button>
```

![](/images/jueJin/9c8e554e5ad84c8.png)

条件渲染 & 循环渲染
-----------

`Vue`提供了`v-if`去进行条件渲染，而`Svelte`还是使用`模板语法`去进行条件渲染的操作

```html
<script>
let age = 20
</script>

{#if age > 50}
<p>老年人</p>
{:else if count > 30}
<p>中年人</p>
{:else}
<p>小朋友</p>
{/if}
```

循环渲染也同样需要使用`模板语法`

```html
<script>
    const items = [
{ id: 1, name: "林三心" }
{ id: 2, name: "林六心" }
{ id: 3, name: "林百心" }
]
</script>

{#each items as item (item.id)}
<p>{item.name}</p>
{/each}
```

全局状态管理
------

在`Vue`中，我们使用的全局状态管理工具有：

*   Vuex
*   Pinia

在`Svelte`中，我们可以直接使用`svelte/store`去进行状态管理，且需要用到`$`去获取状态管理里的变量

```ts
import { writable } from 'svelte/store';

export const count = writable(0);
``````html
// Componnet.svelte
<script lang="ts">
import { count } from './store'

    const handleChange = () => {
        count.update((v) => {
        return v + 1
        })
    }
    </script>
    
    <div>{$count}</div>
    <button on:click={handleChange}>修改count</button>
```

结语 & 加学习群 & 摸鱼群
---------------

我是林三心

*   一个待过**小型toG型外包公司、大型外包公司、小公司、潜力型创业公司、大公司**的作死型前端选手；
*   一个偏前端的全干工程师；
*   一个不正经的掘金作者；
*   一个逗比的B站up主；
*   一个不帅的小红书博主；
*   一个喜欢打铁的篮球菜鸟；
*   一个喜欢历史的乏味少年；
*   一个喜欢rap的五音不全弱鸡

如果你想一起学习前端，一起摸鱼，一起研究简历优化，一起研究面试进步，一起交流历史音乐篮球rap，可以来俺的摸鱼学习群哈哈，点这个，有7000多名前端小伙伴在等着一起学习哦 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

![image.png](/images/jueJin/07273e005d7b468.png)