---
author: "天涯学馆"
title: "SvelteStore与Vuex：轻量级状态管理对比"
date: 2024-09-24
description: "在现代前端框架中，状态管理是一个重要的组成部分，它有助于组织和维护应用程序的状态。Svelte和Vue.js分别使用SvelteStore和Vuex作为它们的状态管理解决方案。"
tags: ["前端","Vuex","Svelte"]
ShowReadingTime: "阅读4分钟"
weight: 930
---
在现代前端框架中，状态管理是一个重要的组成部分，它有助于组织和维护应用程序的状态。Svelte 和 Vue.js 分别使用 Svelte Store 和 Vuex 作为它们的状态管理解决方案。

状态管理是单页应用（SPA）中的一个关键问题，特别是在大型应用中，状态的集中管理可以让状态变得更容易追踪和维护。Svelte 和 Vue.js 都提供了各自的状态管理机制，但它们的设计哲学和实现细节有所不同。

#### Svelte Store

Svelte 的状态管理是内置于框架之中的，它提供了一个叫做“store”的API，用于在组件之间共享状态。Svelte Store 可以分为三种类型：readable、writable 和 derived。

##### 创建 Store

**Readable Store** Readable store 只能被订阅，不能直接修改。

javascript

 代码解读

复制代码

`import { readable } from 'svelte/store'; const count = readable(0, set => {   let latestCount = 0;   const subscriber = count => {     latestCount = count;     set(latestCount);   };   return {     subscribe: subscriber   }; });`

**Writable Store**

Writable store 可以被订阅也可以被修改。

javascript

 代码解读

复制代码

`import { writable } from 'svelte/store'; const count = writable(0); count.set(1); // 修改值 count.update(n => n + 1); // 更新值`

**Derived Store**

Derived store 是根据其他 store 计算得出的新 store。

javascript

 代码解读

复制代码

`import { derived } from 'svelte/store'; const doubleCount = derived(count, $count => $count * 2);`

##### 使用 Store

在 Svelte 组件中使用 `store` 很简单，只需要通过 `$` 符号来访问 `store` 的值。

svelte

 代码解读

复制代码

`<script>   import { onMount } from 'svelte';   import { count } from './store';   let localCount = $count;   onMount(() => count.subscribe(value => localCount = value)); </script> <h1>{localCount}</h1> <button on:click={() => count.update(n => n + 1)}>Increment</button>`

#### Vuex

Vuex 是 Vue.js 的官方状态管理模式和库。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

##### 创建 Store

首先需要安装 Vuex：

bash

 代码解读

复制代码

`npm install vuex`

然后创建 store：

javascript

 代码解读

复制代码

`import Vue from 'vue'; import Vuex from 'vuex'; Vue.use(Vuex); export default new Vuex.Store({   state: {     count: 0   },   mutations: {     increment(state) {       state.count++;     }   },   actions: {     increment({ commit }) {       commit('increment');     }   },   getters: {     doubleCount(state) {       return state.count * 2;     }   } });`

##### 使用 Store

在 Vue 组件中使用 store：

html

 代码解读

复制代码

`<template>   <div>     <h1>{{ doubleCount }}</h1>     <button @click="increment">Increment</button>   </div> </template> <script> import { mapGetters, mapActions } from 'vuex'; export default {   computed: {     ...mapGetters(['doubleCount'])   },   methods: {     ...mapActions(['increment'])   } }; </script>`

#### Svelte Store

##### 复杂状态管理

Svelte Store 可以用于管理更复杂的状态，例如嵌套对象或数组。

**示例：管理用户信息**

javascript

 代码解读

复制代码

`import { writable } from 'svelte/store'; const user = writable({   name: 'Alice',   email: 'alice@example.com',   posts: [] }); function addUserPost(post) {   user.update(u => ({     ...u,     posts: [...u.posts, post]   })); } export { user, addUserPost };`

**使用示例**

svelte

 代码解读

复制代码

`<script>   import { onMount } from 'svelte';   import { user, addUserPost } from './store';   let localUser = $user;   onMount(() => user.subscribe(value => localUser = value));   function addNewPost() {     addUserPost({ title: 'New Post', content: 'This is a new post.' });   } </script> <h1>User: {localUser.name}</h1> <h2>Email: {localUser.email}</h2> <ul>   {#each localUser.posts as post (post.title)}     <li>{post.title}</li>   {/each} </ul> <button on:click={addNewPost}>Add Post</button>`

##### 组合多个 Store

可以组合多个 Store 来创建更复杂的状态管理逻辑。

**示例：组合多个 Store**

javascript

 代码解读

复制代码

`import { writable } from 'svelte/store'; const count = writable(0); const doubleCount = writable(0); function updateCounts() {   doubleCount.set($count * 2); } count.subscribe(updateCounts); export { count, doubleCount };`

**使用示例**

svelte

 代码解读

复制代码

`<script>   import { onMount } from 'svelte';   import { count, doubleCount } from './store';   let localCount = $count;   let localDoubleCount = $doubleCount;   onMount(() => {     count.subscribe(value => localCount = value);     doubleCount.subscribe(value => localDoubleCount = value);   });   function increment() {     count.update(n => n + 1);   } </script> <h1>Count: {localCount}</h1> <h2>Double Count: {localDoubleCount}</h2> <button on:click={increment}>Increment</button>`

#### Vuex

##### 模块化状态管理

Vuex 支持模块化的状态管理，可以将状态拆分成多个模块，每个模块有自己的 state、mutations、actions 和 getters。

示例：模块化状态管理

javascript

 代码解读

复制代码

`import Vue from 'vue'; import Vuex from 'vuex'; Vue.use(Vuex); const userModule = {   state: {     name: 'Alice',     email: 'alice@example.com',     posts: []   },   mutations: {     addPost(state, post) {       state.posts.push(post);     }   },   actions: {     addPost({ commit }, post) {       commit('addPost', post);     }   },   getters: {     allPosts(state) {       return state.posts;     }   } }; const store = new Vuex.Store({   modules: {     user: userModule   } }); export default store;`

使用示例

html

 代码解读

复制代码

`<template>   <div>     <h1>User: {{ user.name }}</h1>     <h2>Email: {{ user.email }}</h2>     <ul>       <li v-for="post in user.allPosts" :key="post.title">{{ post.title }}</li>     </ul>     <button @click="addPost">Add Post</button>   </div> </template> <script> import { mapState, mapActions } from 'vuex'; export default {   computed: {     ...mapState('user', ['name', 'email', 'allPosts'])   },   methods: {     ...mapActions('user', ['addPost'])   } }; </script>`

##### 命名空间

在模块化状态下，可以使用命名空间来避免状态和方法冲突。

示例：使用命名空间

javascript

 代码解读

复制代码

`import Vue from 'vue'; import Vuex from 'vuex'; Vue.use(Vuex); const userModule = {   namespaced: true,   state: {     name: 'Alice',     email: 'alice@example.com',     posts: []   },   mutations: {     addPost(state, post) {       state.posts.push(post);     }   },   actions: {     addPost({ commit }, post) {       commit('addPost', post);     }   },   getters: {     allPosts(state) {       return state.posts;     }   } }; const store = new Vuex.Store({   modules: {     user: userModule   } }); export default store;`

使用示例

html

 代码解读

复制代码

`<template>   <div>     <h1>User: {{ user.name }}</h1>     <h2>Email: {{ user.email }}</h2>     <ul>       <li v-for="post in user.allPosts" :key="post.title">{{ post.title }}</li>     </ul>     <button @click="addPost">Add Post</button>   </div> </template> <script> import { mapState, mapActions } from 'vuex'; export default {   computed: {     ...mapState('user', ['name', 'email', 'allPosts'])   },   methods: {     ...mapActions('user', ['addPost'])   } }; </script>`

#### 实战案例

##### Svelte Store 实战案例

假设我们需要实现一个简单的待办事项列表应用。

Store 文件 (store.js)

javascript

 代码解读

复制代码

`import { writable } from 'svelte/store'; const todos = writable([   { id: 1, text: 'Learn Svelte', done: false },   { id: 2, text: 'Build an app', done: false } ]); function addTodo(text) {   todos.update(todos => [     ...todos,     { id: Date.now(), text, done: false }   ]); } function toggleTodo(id) {   todos.update(todos => todos.map(todo =>     todo.id === id ? { ...todo, done: !todo.done } : todo   )); } function removeTodo(id) {   todos.update(todos => todos.filter(todo => todo.id !== id)); } export { todos, addTodo, toggleTodo, removeTodo };`

主组件 (App.svelte)

svelte

 代码解读

复制代码

`<script>   import { onMount } from 'svelte';   import { todos, addTodo, toggleTodo, removeTodo } from './store';   let newTodoText = '';   let localTodos = $todos;   onMount(() => {     todos.subscribe(value => localTodos = value);   });   function handleAddTodo() {     if (newTodoText.trim()) {       addTodo(newTodoText);       newTodoText = '';     }   }   function handleToggleTodo(id) {     toggleTodo(id);   }   function handleRemoveTodo(id) {     removeTodo(id);   } </script> <main>   <h1>To-Do List</h1>   <input type="text" bind:value={newTodoText} placeholder="Add a new to-do" />   <button on:click={handleAddTodo}>Add</button>   <ul>     {#each localTodos as todo (todo.id)}       <li>         <input type="checkbox" checked={todo.done} on:change={() => handleToggleTodo(todo.id)} />         <span style="{todo.done ? 'text-decoration: line-through;' : ''}">{todo.text}</span>         <button on:click={() => handleRemoveTodo(todo.id)}>Remove</button>       </li>     {/each}   </ul> </main>`

##### Vuex 实战案例

同样，我们实现一个待办事项列表应用，这次使用 Vuex 进行状态管理。

Store 文件 (store.js)

javascript

 代码解读

复制代码

`import Vue from 'vue'; import Vuex from 'vuex'; Vue.use(Vuex); const store = new Vuex.Store({   state: {     todos: [       { id: 1, text: 'Learn Vue', done: false },       { id: 2, text: 'Build an app', done: false }     ]   },   mutations: {     addTodo(state, text) {       state.todos.push({ id: Date.now(), text, done: false });     },     toggleTodo(state, id) {       const todo = state.todos.find(todo => todo.id === id);       if (todo) {         todo.done = !todo.done;       }     },     removeTodo(state, id) {       state.todos = state.todos.filter(todo => todo.id !== id);     }   },   actions: {     addTodo({ commit }, text) {       commit('addTodo', text);     },     toggleTodo({ commit }, id) {       commit('toggleTodo', id);     },     removeTodo({ commit }, id) {       commit('removeTodo', id);     }   },   getters: {     todos: state => state.todos   } }); export default store;`

主组件 (App.vue)

html

 代码解读

复制代码

`<template>   <main>     <h1>To-Do List</h1>     <input type="text" v-model="newTodoText" placeholder="Add a new to-do" />     <button @click="addTodo">Add</button>     <ul>       <li v-for="todo in todos" :key="todo.id">         <input type="checkbox" :checked="todo.done" @change="toggleTodo(todo.id)" />         <span :style="{ 'text-decoration': todo.done ? 'line-through' : 'none' }">{{ todo.text }}</span>         <button @click="removeTodo(todo.id)">Remove</button>       </li>     </ul>   </main> </template> <script> import { mapState, mapActions } from 'vuex'; export default {   data() {     return {       newTodoText: ''     };   },   computed: {     ...mapState(['todos'])   },   methods: {     ...mapActions(['addTodo', 'toggleTodo', 'removeTodo'])   } }; </script>`

#### 对比分析

**性能**

*   Svelte Store：由于 Svelte 在编译时会消除不必要的代码，因此它的性能非常高，store 的变更会直接导致相关组件的重新渲染。
*   Vuex：虽然 Vuex 也是响应式的，但由于它是基于 Vue 的响应系统构建的，所以在某些情况下可能会有额外的开销。

**学习曲线**

*   Svelte Store：对于熟悉 JavaScript 的开发者来说，Svelte Store 的 API 设计直观易懂。
*   Vuex：Vuex 的概念较为丰富，包括 state、mutations、actions 和 getters，初学者可能需要一段时间来适应。

**生态系统**

*   Svelte Store：Svelte 的生态系统相对较小，但其核心库提供了足够的功能。
*   Vuex：作为 Vue.js 的一部分，Vuex 有着庞大的社区支持和丰富的插件生态。

**适用场景**

*   Svelte Store：适合中小型项目或者对性能要求较高的应用。
*   Vuex：适合大型复杂应用，特别是那些需要严格的状态管理流程的应用。