---
author: "Gaby"
title: "Vue3 script setup 语法糖详解"
date: 2021-09-18
description: "目前setup sugar已经进行了定稿，vue3 + setup sugar + TS的写法看起来很香,用起来也爽。"
tags: ["JavaScript","Vue.js","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:299,comments:0,collects:555,views:64716,"
---
最后更新于 2023.07.13

目前`setup sugar`已经进行了定稿，`vue3 + setup sugar + TS`的写法看起来很香,写本文时 Vue 版本是 `"^3.2.6"`

script setup 语法糖
----------------

新的 `setup` 选项是在组件创建**之前**, `props` 被解析之后执行，是组合式 API 的入口。

> WARNING  
> 在 `setup` 中你应该避免使用 `this`，因为它不会找到组件实例。`setup` 的调用发生在 `data` property、`computed` property 或 `methods` 被解析之前，所以它们无法>在 `setup` 中被获取。

`setup` 选项是一个接收 `props` 和 `context` 的函数，我们将在[之后](https://link.juejin.cn?target=https%3A%2F%2Fv3.cn.vuejs.org%2Fguide%2Fcomposition-api-setup.html%23%25E5%258F%2582%25E6%2595%25B0 "https://v3.cn.vuejs.org/guide/composition-api-setup.html#%E5%8F%82%E6%95%B0")进行讨论。此外，我们将 `setup` 返回的所有内容都暴露给组件的其余部分 (计算属性、方法、生命周期钩子等等) 以及组件的模板。

它是 Vue3 的一个新语法糖，在 `setup` 函数中。所有 ES 模块导出都被认为是暴露给上下文的值，并包含在 setup() 返回对象中。相对于之前的写法，使用后，语法也变得更简单。

> 在添加了setup的script标签中，**我们不必声明和方法，这种写法会自动将所有顶级变量、函数，均会自动暴露给模板（template）使用**  
> 这里强调一句 “**暴露给模板，跟暴露给外部不是一回事**”

使用方式极其简单，仅需要在 `script` 标签加上 `setup` 关键字即可。示例：

```html
<script setup></script>
```

该setup功能是新的组件选项。它是组件内部暴露出所有的属性和方法的统一API。

使用后意味着，script标签内的内容相当于原本组件声明中setup()的函数体，不过也有一定的区别。

使用 script setup 语法糖，组件只需引入不用注册，属性和方法也不用返回，也不用写setup函数，也不用写export default ，甚至是自定义指令也可以在我们的template中自动获得。[基本语法](https://link.juejin.cn?target=https%3A%2F%2Fv3.cn.vuejs.org%2Fapi%2Fsfc-script-setup.html%23%25E5%259F%25BA%25E6%259C%25AC%25E8%25AF%25AD%25E6%25B3%2595 "https://v3.cn.vuejs.org/api/sfc-script-setup.html#%E5%9F%BA%E6%9C%AC%E8%AF%AD%E6%B3%95")

#### 调用时机

创建组件实例，然后初始化 props ，紧接着就调用setup 函数。从生命周期钩子的视角来看，它会在 beforeCreate 钩子之前被调用.

#### 模板中使用

如果 setup 返回一个对象，则对象的属性将会被合并到组件模板的渲染上下文

```html
<template>
<div>
{{ count }} {{ object.foo }}
</div>
</template>
```

#### setup 参数

1.  **「props」** 第一个参数接受一个响应式的props，这个props指向的是外部的props。如果你没有定义props选项，setup中的第一个参数将为undifined。props和vue2.x并无什么不同,仍然遵循以前的原则；

*   不要在子组件中修改props；如果你尝试修改，将会给你警告甚至报错。
*   不要结构props。结构的props会失去响应性。

2.**「context」** 第二个参数提供了一个上下文对象，从原来 2.x 中 this 选择性地暴露了一些 property。

```html
<script setup="props, context" lang="ts">
context.attrs
context.slots
context.emit
<script>

```

像这样，只要在setup处声明即可自动导入，同时也支持解构语法：

```html
<script setup="props, { emit }" lang="ts">

<script>

```

组件自动注册
------

导入 component 或 directive 直接import即可，无需额外声明

```js
import { MyButton } from "@/components"
import { directive as clickOutside } from 'v-click-outside'
```

与原先一样，模板中也支持使用kabab-case来创建组件，如

在 script setup 中，引入的组件可以直接使用，无需再通过`components`进行注册，并且无法指定当前组件的名字，它会自动以文件名为主，也就是不用再写`name`属性了。示例：

```html
<template>
<HelloWorld />
</template>

<script setup>
import HelloWorld from "./components/HelloWorld.vue"; //此处使用 Vetur 插件会报红
</script>
```

如果需要定义类似 name 的属性，可以再加个平级的 script 标签，在里面实现即可。

组件核心 API 的使用
------------

### 定义组件的 props

通过`defineProps`指定当前 props 类型，获得上下文的props对象。示例：

```html

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps(["title"]);
</script>
<!-- 或者 -->
<script setup>
import { defineProps } from 'vue';

    const props = defineProps({
    title: String, // 可以设置传来值的类型
    })
    </script>
    <!-- 或者 -->
    <script setup>
    import { defineProps } from 'vue';
    
        const props = defineProps({
        // 可以设置传来值的类型和默认值
            title: {
            type:String,
            default: ''
        }
        })
        </script>
        <!-- 或者 -->
        <script setup>
        import { defineProps } from 'vue';
        
            const props = defineProps({
            title: [String,Number] // 可以设置传来值的多种类型
            })
            </script>
            <!-- 或者 -->
            <script setup lang="ts">
            import { ref,defineProps } from 'vue';
            
                type Props={
                title:string
            }
            defineProps<Props>();
            </script>
```

### 定义 emit

使用`defineEmit`定义当前组件含有的事件，并通过返回的上下文去执行 emit。示例：

```html
<script setup>
import { defineEmits } from 'vue'
// 定义两个方法 change 和 delete
const emit = defineEmits(['change', 'delete'])

    const handleClick=()=>{
    emit('change', 5); // 传给父组件的值的方法
}

    const handleClickDel=()=>{
    emit('delete', 8); // 传给父组件的值的方法
}
</script>
```

### 父子组件通信

*   在Vue3中父子组件传值、方法是通过`defineProps`, `defineEmits`实现的。
*   `defineProps` 和 `defineEmits` 都是只在 `<script setup>` 中才能使用的。
*   它们不需要导入就会随着 `<script setup>` 被一同处理编译。
*   `defineProps` 接收与 `props` 选项相同的值， `defineEmits` 也接收 `emits` 选项 相同的值。

**defineProps** 用来接收父组件传来的 props ; **defineEmits** 用来声明触发的事件。

```html
//父组件
<template>
<my-son foo="🚀🚀🚀🚀🚀🚀" @childClick="childClick" />
</template>

<script lang="ts" setup>
import MySon from "./MySon.vue";

    let childClick = (e: any):void => {
    console.log('from son：',e);  //🚀🚀🚀🚀🚀🚀
    };
    </script>
    
    
    //子组件
    <template>
    <span @click="sonToFather">信息:{{ props.foo }}</span>
    </template>
    
    <script lang="ts" setup>
    import { defineEmits, defineProps} from "vue";
    
    const emit = defineEmits(["childClick"]);     // 声明触发事件 childClick
    const props = defineProps({ foo: String });   // 获取props
    
        const sonToFather = () =>{
        emit('childClick' , props.foo)
    }
    </script>
```

子组件通过 defineProps 接收父组件传过来的数据，子组件通过 defineEmits 定义事件发送信息给父组件

增强的props类型定义：

```js
    const props = defineProps<{
    foo: string
    bar?: number
    }>()
    
    const emit = defineEmit<(e: 'update' | 'delete', id: number) => void>()
```

不过注意，采用这种方法将无法使用props默认值。

#### 父组件调用子组件事件

父组件

```xml
<!-- 父组件 app.vue -->
<template>
<div class="par">
<!-- 使用 ref 指令关联子组件 -->
<child ref="childRef"/>
<button @click="handleClick">提交</button>
</div>
</template>
<script setup>
import { reactive, ref } from "vue";
import child from "./child.vue";
//定义子组件实例，名称要和上面的ref相同
const childRef = ref(null);

//访问demo组件的方法或对象
    const handleClick = () => {
    //获取到子组件的 title 数据
    let title = childRef.value.state.title;
    //调用子组件的 play方法
    childRef.value.submit();
    };
    </script>
```

子组件

子组件通过[defineExpose](https://link.juejin.cn?target=https%3A%2F%2Fso.csdn.net%2Fso%2Fsearch%3Fq%3DdefineExpose%26spm%3D1001.2101.3001.7020 "https://so.csdn.net/so/search?q=defineExpose&spm=1001.2101.3001.7020")暴露对象和方法

```xml
<!--子组件名称  child.vue -->
<template>
<div class="child">
{{ state.title }}
</div>
</template>
<script setup>
import { ref, reactive } from "vue";
//定义一个变量
    const state = reactive({
    title: "标题",
    });
    //定义一个方法
        const submit = () => {
        state.title = "你调用了子组件的方法";
        };
        
        //暴露state和play方法
            defineExpose({
            state,
            submit
            });
            </script>
```

### 定义响应变量、函数、监听、计算属性computed

```html
<script setup lang="ts">
import { ref,computed,watchEffect } from 'vue';

const count = ref(0); //不用 return ，直接在 templete 中使用

const addCount=()=>{ //定义函数，使用同上
count.value++;
}

//定义计算属性，使用同上
const howCount=computed(()=>"现在count值为："+count.value);

//定义监听，使用同上 //...some code else
watchEffect(()=>console.log(count.value));
</script>
```

#### watchEffect

用于有副作用的操作，会自动收集依赖。

#### 和watch区别

无需区分deep，immediate，只要依赖的数据发生变化，就会调用

### reactive

此时name只会在初次创建的时候进行赋值，如果中间想要改变name的值，那么需要借助composition api 中的reactive。

```html
<script setup lang="ts">
import { reactive, onUnmounted } from 'vue'

    const state = reactive({
    counter: 0
    })
    // 定时器 每秒都会更新数据
        const timer = setInterval(() => {
        state.counter++
        }, 1000);
        
            onUnmounted(() => {
            clearInterval(timer);
            })
            </script>
            <template>
            <div>{{state.counter}}</div>
            </template>
```

使用ref也能达到我们预期的'counter',并且在模板中,vue进行了处理，我们可以直接使用counter而不用写counter.value.

**ref和reactive的关系**:

ref是一个{value:'xxxx'}的结构，value是一个reactive对象

### ref 暴露变量到模板

曾经的提案中，如果需要暴露变量到模板，需要在变量前加入export声明：

```js
export const count = ref(0)
```

不过在新版的提案中，无需export声明，编译器会自动寻找模板中使用的变量，只需像下面这样简单的声明，即可在模板中使用该变量

```html
<script setup lang="ts">
import { ref } from 'vue'

const counter = ref(0);//不用 return ，直接在 templete 中使用

    const timer = setInterval(() => {
    counter.value++
    }, 1000)
    
        onUnmounted(() => {
        clearInterval(timer);
        })
        </script>
        <template>
        <div>{{counter}}</div>
        </template>
```

### 生命周期方法

因为 `setup` 是围绕 `beforeCreate` 和 `created` 生命周期钩子运行的，所以不需要显式地定义它们。换句话说，在这些钩子中编写的任何代码都应该直接在 `setup` 函数中编写。

可以通过在生命周期钩子前面加上 “on” 来访问组件的生命周期钩子。[官网：生命周期钩子](https://link.juejin.cn?target=https%3A%2F%2Fv3.cn.vuejs.org%2Fguide%2Fcomposition-api-lifecycle-hooks.html "https://v3.cn.vuejs.org/guide/composition-api-lifecycle-hooks.html")

下表包含如何在 [setup ()](https://link.juejin.cn?target=https%3A%2F%2Fv3.cn.vuejs.org%2Fguide%2Fcomposition-api-setup.html "https://v3.cn.vuejs.org/guide/composition-api-setup.html") 内部调用生命周期钩子：

选项式 API

Hook inside `setup`

`beforeCreate`

Not needed\*

`created`

Not needed\*

`beforeMount`

`onBeforeMount`

`mounted`

`onMounted`

`beforeUpdate`

`onBeforeUpdate`

`updated`

`onUpdated`

`beforeUnmount`

`onBeforeUnmount`

`unmounted`

`onUnmounted`

`errorCaptured`

`onErrorCaptured`

`renderTracked`

`onRenderTracked`

`renderTriggered`

`onRenderTriggered`

`activated`

`onActivated`

`deactivated`

`onDeactivated`

```html
<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => { console.log('mounted!'); });

</script>
```

#### 获取 slots 和 attrs

> 注：useContext API 被弃用，取而代之的是更加细分的 api。

可以通过`useContext`从上下文中获取 slots 和 attrs。不过提案在正式通过后，废除了这个语法，被拆分成了`useAttrs`和`useSlots`。

1.  `useAttrs`：见名知意，这是用来获取 attrs 数据，但是这和 vue2 不同，里面包含了 `class`、`属性`、`方法`。

```html
<template>
<component v-bind='attrs'></component>
</template>
<srcipt setup lang='ts'>
const attrs = useAttrs();
<script>
```

2.  `useSlots`: 顾名思义，获取插槽数据。

使用示例：

```html
// 旧
<script setup>
import { useContext } from 'vue'

const { slots, attrs } = useContext()
</script>

// 新
<script setup>
import { useAttrs, useSlots } from 'vue'

const attrs = useAttrs()
const slots = useSlots()
</script>
```

#### 其他 Hook Api

1.  `useCSSModule`：CSS Modules 是一种 CSS 的模块化和组合系统。vue-loader 集成 CSS Modules，可以作为模拟 scoped CSS。允许在单个文件组件的`setup`中访问CSS模块。此 api 本人用的比较少，不过多做介绍。
2.  `useCssVars`: 此 api 暂时资料比较少。介绍`v-bind in styles`时提到过。
3.  `useTransitionState`: 此 api 暂时资料比较少。
4.  `useSSRContext`: 此 api 暂时资料比较少。

### defineExpose API

传统的写法，我们可以在父组件中，通过 ref 实例的方式去访问子组件的内容，但在 script setup 中，该方法就不能用了，setup 相当于是一个闭包，除了内部的 `template`模板，谁都不能访问内部的数据和方法。

如果需要对外暴露 setup 中的数据和方法，需要使用 defineExpose API。示例：

```js
const a = 1
const b = ref(2)
defineExpose({ a, b, })
```

> 注意：目前发现`defineExpose`暴露出去的属性以及方法都是 `unknown` 类型，如果有修正类型的方法，欢迎评论区补充。

```html
//父组件

<template>
<Daughter ref="daughter" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Daughter from "./Daughter.vue";

const daughter = ref(null)
console.log('🚀🚀🚀🚀~daughter',daughter)
</script>


//子组件

<template>
<div>妾身{{ msg }}</div>
</template>

<script lang="ts" setup>
import { ref ,defineExpose} from "vue";
const msg = ref('貂蝉')
    defineExpose({
    msg
    })
    </script>
```

一、父组件调用子组件方法

子组件需要使用defineExpose对外暴露方法，父组件才可以调用。

子组件

```js
<template>
<div>子组件</div>
</template>

<script setup lang="ts">
// 第一步：定义子组件的方法
    const handleSubmit = (str: string) => {
    console.log('子组件的hello方法执行了--' + str)
}
// 第二部：暴露方法
    defineExpose({
    handleSubmit
    })
    </script>
```

父组件

```js
<template>
<button @click="handleChild">触发子组件方法</button>
<!-- 一：定义 ref -->
<Child ref="childRef"></Child>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Child from '../../components/child.vue';

// 二：定义与 ref 同名变量
const childRef = ref <any> ()

// 三、函数
    const handleChild = () => {
    // 调用子组件的方法或者变量，通过value
    childRef.value.hello("hello world！");
}
</script>


```

参考网址：[cn.vuejs.org/api/sfc-scr…](https://link.juejin.cn?target=https%3A%2F%2Fcn.vuejs.org%2Fapi%2Fsfc-script-setup.html%23defineexpose "https://cn.vuejs.org/api/sfc-script-setup.html#defineexpose")

### 属性和方法无需返回，直接使用！

这可能是带来的较大便利之一，在以往的写法中，定义数据和方法，都需要在结尾 return 出去，才能在模板中使用。在 script setup 中，定义的属性和方法无需返回，可以直接使用！示例：

```html
<template>
<div>
<p>My name is {{name}}</p>
</div>
</template>

<script setup>
import { ref } from 'vue';

const name = ref('Sam')
</script>
```

### 支持 async await 异步

注意在vue3的源代码中，setup执行完毕，函数 getCurrentInstance 内部的有个值会释放对 currentInstance 的引用，await 语句会导致后续代码进入异步执行的情况。所以上述例子中最后一个 getCurrentInstance() 会返回 null，建议使用变量保存第一个 getCurrentInstance() 返回的引用.

```html
<script setup>
const post = await fetch(`/api/post/1`).then((r) => r.json())
</script>
```

`<script setup>` 中可以使用顶层 `await`。结果代码会被编译成 `async setup()`：

```html
<script setup>
const post = await fetch(`/api/post/1`).then(r => r.json())
</script>
```

另外，await 的表达式会自动编译成在 `await` 之后保留当前组件实例上下文的格式。

> **注意**  
> `async setup()` 必须与 `Suspense` 组合使用，`Suspense` 目前还是处于实验阶段的特性。我们打算在将来的某个发布版本中开发完成并提供文档 - 如果你现在感兴趣，可以参照 [tests](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fvue-next%2Fblob%2Fmaster%2Fpackages%2Fruntime-core%2F__tests__%2Fcomponents%2FSuspense.spec.ts "https://github.com/vuejs/vue-next/blob/master/packages/runtime-core/__tests__/components/Suspense.spec.ts") 看它是如何工作的。

### 定义组件其他配置

配置项的缺失，有时候我们需要更改组件选项，在`setup`中我们目前是无法做到的。我们需要在`上方`再引入一个 `script`，在上方写入对应的 `export`即可，需要单开一个 script。

`<script setup>` 可以和普通的 `<script>` 一起使用。普通的 `<script>` 在有这些需要的情况下或许会被使用到：

*   无法在 `<script setup>` 声明的选项，例如 `inheritAttrs` 或通过插件启用的自定义的选项。
*   声明命名导出。
*   运行副作用或者创建只需要执行一次的对象。

在script setup 外使用export default，其内容会被处理后放入原组件声明字段。

```html
<script>
// 普通 `<script>`, 在模块范围下执行(只执行一次)
runSideEffectOnce()

// 声明额外的选项
    export default {
    name: "MyComponent",
    inheritAttrs: false,
customOptions: {}
}
</script>
<script setup>
import HelloWorld from '../components/HelloWorld.vue'
// 在 setup() 作用域中执行 (对每个实例皆如此)
// your code
</script>
<template>
<div>
<HelloWorld msg="Vue3 + TypeScript + Vite"/>
</div>
</template>
```

> 注意：Vue 3 SFC 一般会自动从组件的文件名推断出组件的 name。在大多数情况下，不需要明确的 name 声明。唯一需要的情况是当你需要 `<keep-alive>` 包含或排除或直接检查组件的选项时，你需要这个名字。

关于 TS 与 ESLint 的不完美
-------------------

1.  与`@typescript-eslint/no-unused-vars`规则不兼容，此规则含义为定义了，未进行使用。该规则其实影响不大，关闭即可。
    
2.  与导入的类型声明不兼容，当你通过解构的方式去导入类型，`setup sugar` 会进行自动导出。这时候，你就会收到 TS 的一条报错：此为类型，但被当作值使用。解决办法：类型导出使用`export default`导出或者引入时使用`import * as xx`来进行引入，也可以使用 `import type { test } from "./test";`解决。
    

语法糖实现
-----

vue文件代码

```html
<template>
<div>{{ msg }}</div>
</template>
<script setup>
const msg = 'Hello!'
</script>
```

编译后的js代码：

```js
    export default {
        setup() {
        const msg = 'Hello!'
        
            return function render() {
            // has access to everything inside setup() scope
            // 在函数 setup 作用域，函数 render 能访问 setup 的一切，
            return h('div', msg)
        }
    }
}
```

注意到，即使普通变量也能作为模版被置入 template 中被编译，某些人认为这不合适，不够分离。

vscode配套插件
----------

**volar** 是一个vscode插件，用来增强vue编写体验，使用volar插件可以获得script setup语法的最佳支持。

与`vetur`相同，`volar`是一个针对`vue`的`vscode`插件，不过与`vetur`不同的是，`volar`提供了更为强大的功能，让人直呼`卧槽`。

安装的方式很简单，直接在`vscode`的插件市场搜索`volar`，然后点击安装就可以了。

`vscode` 中使用的时候，先禁用 `Vetur`，再下载使用`Volar`

使用习惯
----

从`options api`切换到`composition api`最大的问题无异于最大的问题就是没有强制的代码分区，如果书写的人没有很好的代码习惯，那么后续的人将会看的十分难受。目前我是这么解决的：

*   自我代码分区并且尽量抽离方法（写好注释），分区如下：
    
    1.  相关引入
    2.  响应式数据、props、emit 定义
    3.  生命周期以及 watch 书写
    4.  方法定义
    5.  方法、属性暴露
*   组件抽离：将页面拆成两个文件夹，一个为 `views`，一个为 `components`。views 和 components 文件夹下有各自的文件。views 文件夹中为页面入口，掌管数据，而 components 则为页面中一些组件抽离。如果是公共组件，再抽离到 components 文件夹下其他位置。
    
*   hook 抽离：尽可能将逻辑抽离，并不一定要进行复用。
    

写在最后
----

写作不易，希望可以获得你的一个「赞」。如果文章对你有用，可以选择「关注 + 收藏」。 如有文章有错误或建议，欢迎评论指正，谢谢你。❤️