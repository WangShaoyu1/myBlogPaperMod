---
author: "冴羽"
title: "Nextjs v14 实现乐观更新，面向未来的 UI 更新方式，你可以不去做，但你不应该不了解"
date: 2024-03-19
description: "其实乐观更新并不是一个新潮的思想，但大家普遍不会去实现乐观更新，归根到底还是实现成本太高。所以本篇会结合 Nextjs 和 useOptimistic 讲解如何低成本并考虑全面的实现一个乐观更新。"
tags: ["前端","React.js","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:131,comments:35,collects:91,views:12300,"
---
> 本文为稀土掘金技术社区首发签约文章，30天内禁止转载，30天后未获授权禁止转载，侵权必究！

前言
--

所谓乐观更新，举个例子，当用户在 ToDoList 中添加一项 ToDo 的时候，传统的做法是等待接口返回成功时再更新 UI。乐观更新是先更新 UI，同时发送数据请求。如果数据请求成功，相安无事，用户感受到流畅的操作，提升了用户体验，数据也得到更新。如果更新失败，则视情况对错误进行处理。

一种交互效果如下：

![optimistic-5.gif](/images/jueJin/0b656df537de436.png)

React 为了实现乐观更新，提供了 [useOptimistic](https://link.juejin.cn?target=https%3A%2F%2Freact.dev%2Freference%2Freact%2FuseOptimistic "https://react.dev/reference/react/useOptimistic") 这个官方 hook（目前已经在 Canary 和实验阶段了），本篇我们不仅会介绍 useOptimistic，还会用 Next.js v14，结合最新的 Server Actions 特性来实现乐观更新。

同时我们会讲解在出现错误的时候，如何进行撤回或者重置。以及处理一个有意思的问题：乐观更新的时候，用户要关闭网页怎么办？

PS：其实乐观更新并不是一个新潮的思想，很多年前就有人开始做了，但是大家普遍不会去实现乐观更新，一是产品、设计不会过多考虑网速慢的情况，二是就算手动实现乐观更新，虽然并不复杂，但是有一些麻烦，接口那么多，我都加个乐观更新，代码写着写着也可能乱糟糟了，何必去实现呢？

归根到底还是实现成本太高。所以 **本篇会结合 Next.js 和 useOptimistic 讲解如何低成本并考虑全面的实现一个乐观更新。** 欢迎收藏点赞本篇文章，万一以后用到了呢？如果有关于乐观更新的经验和看法，欢迎留言评论！

PS：学习 Next.js，欢迎入手小册[《Next.js 开发指南》](https://s.juejin.cn/ds/iFkbaMgM/ "https://s.juejin.cn/ds/iFkbaMgM/")。基础篇、实战篇、源码篇、面试篇四大篇章带你系统掌握 Next.js！

废话不多说，让我们直接开始吧！

创建 Next.js 项目
-------------

使用 Next.js 官方脚手架创建项目：

```bash
npx create-next-app@latest
```

运行效果如下：

![image.png](/images/jueJin/ecdd034f47a443d.png)

为了样式美观，我们会用到 Tailwind CSS，所以**注意勾选 Tailwind CSS**，其他随意。

进入项目目录，开启本地模式，检查项目是否能够启动成功：

```bash
npm i && npm run dev
```

我们以实现这样一个 ToDoList 为例进行讲解：

![image.png](/images/jueJin/f034b6a590de45c.png)

涉及的文件和目录结构如下：

```javascript
app
└─ todo
├─ actions.js
├─ page.js
└─ todo.js
```

新建 `app/todo/page.js`，代码如下：

```javascript
import { findToDos } from './actions';
import ToDoList from './todo';

    export default async function Page() {
    const todos = await findToDos();
    return (
    <ToDoList todos={todos} />
    )
}
```

新建 `app/todo/todo.js`，代码如下：

```javascript
'use client'

import { useRef } from 'react'
import { createToDo } from './actions';

    export default function ToDoList({ todos }) {
    const formRef = useRef(null);
    
    return (
    <div className="p-10">
        <form className="space-y-6" ref={formRef} action={async (formData) => {
        await createToDo(formData)
        formRef.current?.reset()
        }}>
        <div>
        <label htmlFor="todo" className="block text-sm font-medium leading-6 text-gray-900">
        添加一项任务列表
        </label>
        <div className="mt-2">
        <input id="todo" name="todo" type="todo" required
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
        />
        </div>
        </div>
        <button
        type="submit"
        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
        添加任务
        </button>
        </form>
        <ul role="list" className="divide-y divide-gray-100 list-decimal mt-4 list-inside">
        {todos.map((todo, i) => (
        <li key={i} className=" py-2">
    {todo}
    </li>
))}
</ul>
</div>
)
}
```

新建 `app/todo/actions.js`，代码如下：

```javascript
'use server'

import { revalidatePath } from "next/cache";

const sleep = ms => new Promise(r => setTimeout(r, ms));

let data = ['阅读', '写作', '冥想']

    export async function findToDos() {
    return data
}

    export async function createToDo(formData) {
    await sleep(2500)
    const todo = formData.get('todo')
    data.push(todo)
    revalidatePath("/todo");
}
```

我们使用 sleep 函数来模拟接口请求的费时，这里我们添加了一个 2.5s 的延时，此时访问 `http://localhost:3000/todo`，交互效果如下：

![optimistic.gif](/images/jueJin/c8166dbff184405.png)

当点击“添加任务”的时候，请求立刻发出，2.5s 后接口返回成功。此时表单清空，任务内容添加到下方的任务列表中。

如果接口返回快，这个过程其实还算流畅。但如果接口慢了，这种停顿感就让人感到不快了……那不妨用乐观更新试试。

React useOptimistic hook
------------------------

我们先讲讲 React 新增的 [useOptimistic](https://link.juejin.cn?target=https%3A%2F%2Freact.dev%2Freference%2Freact%2FuseOptimistic "https://react.dev/reference/react/useOptimistic") hook。

useOptimistic，顾名思义，就是用来处理乐观更新。它允许你在进行异步操作时显示不同 state。它接受 state 作为参数，并返回该 state 的副本，在异步操作（如网络请求）期间可以不同。你需要提供一个函数，该函数接受当前 state 和操作的输入，并返回在操作挂起期间要使用的乐观状态。

这个状态被称为“乐观”状态是因为通常用于立即向用户呈现执行操作的结果，即使实际上操作需要一些时间来完成：

```javascript
import { useOptimistic } from 'react';

    function AppContainer() {
    const [optimisticState, addOptimistic] = useOptimistic(
    state,
    // 更新函数
        (currentState, optimisticValue) => {
        // 使用乐观值
        // 合并并返回新 state
    }
    );
}
```

React 官方提供了完整可用的示例代码：

```javascript
import { useOptimistic, useState, useRef } from "react";
import { deliverMessage } from "./actions.js";

    function Thread({ messages, sendMessage }) {
    const formRef = useRef();
        async function formAction(formData) {
        addOptimisticMessage(formData.get("message"));
        formRef.current.reset();
        await sendMessage(formData);
    }
    const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
        (state, newMessage) => [
        ...state,
            {
            text: newMessage,
            sending: true
        }
    ]
    );
    
    return (
    <>
    {optimisticMessages.map((message, index) => (
    <div key={index}>
{message.text}
{!!message.sending && <small> (Sending...)</small>}
</div>
))}
<form action={formAction} ref={formRef}>
<input type="text" name="message" placeholder="Hello!" />
<button type="submit">Send</button>
</form>
</>
);
}

    export default function App() {
        const [messages, setMessages] = useState([
    { text: "Hello there!", sending: false, key: 1 }
    ]);
        async function sendMessage(formData) {
        const sentMessage = await deliverMessage(formData.get("message"));
        setMessages((messages) => [...messages, { text: sentMessage }]);
    }
    return <Thread messages={messages} sendMessage={sendMessage} />;
}

```

至于这个例子中的 `actions.js`的代码则很简单：

```javascript
    export async function deliverMessage(message) {
    await new Promise((res) => setTimeout(res, 1000));
    return message;
}
```

其实乐观更新，我们自己也很容易实现，主要是 2 步：

1.  调用接口的时候设置一个状态，我们称之为乐观状态
2.  当接口数据返回的时候更新状态

理解 useOptimistic 的使用其实也就是这两步，一是明白如何设置乐观状态，一是如何更新为最新的状态，让我们将刚才的示例代码简化一下：

```javascript
import { useOptimistic } from "react";

    function Thread({ messages, sendMessage }) {
        async function formAction(formData) {
        // 3. 接口调用的时候通过 addOptimisticMessage 设置乐观状态
        addOptimisticMessage(...);
        await sendMessage(formData);
    }
    
    // 1. 使用乐观更新
    const [optimisticMessages, addOptimisticMessage] = useOptimistic(...);
    
    return (
    <>
    //  2. 使用 optimisticMessages 渲染列表
{optimisticMessages.map(...)}
<form action={formAction}>
// ...
</form>
</>
);
}

    export default function App() {
    const [messages, setMessages] = useState(...);
    
        async function sendMessage(formData) {
        // 4. 在这里调用接口，接口返回的时候设置父级状态，optimisticMessages 会自动更新
        const sentMessage = await deliverMessage(...);
        setMessages(...);
    }
    return <Thread messages={messages} sendMessage={sendMessage} />;
}

```

试想如果我们用 useState 来实现乐观更新，当接口数据返回的时候，我们还需要在 Thread 组件中，监听 messages 数据的改变，然后设置为最新的状态。使用 useOptimistic 则会自动更新，省了不少代码。

Next.js 与 useOptimistic
-----------------------

理解了 useOptimistic 的用法，那就让我们在 Next.js 项目中使用 useOptimistic 吧。

回到我们的项目，修改 `app/todo/todo.js`，代码如下：

```javascript
'use client'

import { useRef, useOptimistic } from 'react'
import { createToDo } from './actions';

    export default function ToDoList({ todos }) {
    const formRef = useRef(null);
    
        const [optimisticToDoList, addOptimistic] = useOptimistic( todos, (currentState, optimisticValue) => {
            return [
            ...currentState,
            optimisticValue
        ]
    }
    );
    
    return (
    <div className="p-10">
        <form className="space-y-6" ref={formRef} action={async (formData) => {
        addOptimistic(formData.get("todo"))
        formRef.current?.reset()
        await createToDo(formData)
        }}>
        <div>
        <label htmlFor="todo" className="block text-sm font-medium leading-6 text-gray-900">
        添加一项任务列表
        </label>
        <div className="mt-2">
        <input id="todo" name="todo" type="todo" required
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
        />
        </div>
        </div>
        <button
        type="submit"
        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
        添加任务
        </button>
        </form>
        <ul role="list" className="divide-y divide-gray-100 list-decimal mt-4 list-inside">
        {optimisticToDoList.map((todo, i) => (
        <li key={i} className="py-2">
    {todo}
    </li>
))}
</ul>
</div>
)
}
```

不需要进行其他的修改，就实现了乐观更新，此时交互效果如下：

![optimistic-1.gif](/images/jueJin/fbe1f3512e254b0.png)

当点击“添加任务”的时候，表单清空，任务内容立刻添加到下方的任务列表中，同时请求发出，2.5s 后接口返回成功。

错误处理
----

我知道大家肯定要问，如果接口返回错误了怎么办？

不同于 React 官方示例中直接使用 useState 来更新状态，在 Next.js 中，当调用 revalidatePath 等重新验证方法的时候，会返回最新的数据，Next.js 会根据最新的数据自动进行状态更新。

所以面对错误处理，我们需要用 try catch 捕获错误，以及无论成功与否，都触发重新验证，返回最新的数据。所以修改 `app/todo/actions.js`，代码如下：

```javascript
'use server'

import { revalidatePath } from "next/cache";

const sleep = ms => new Promise(r => setTimeout(r, ms));

let data = ['阅读', '写作', '冥想']

    export async function findToDos() {
    return data
}

    export async function createToDo(formData) {
        try {
        await sleep(2500)
        throw new Error('error')
        const todo = formData.get('todo')
        data.push(todo)
            } catch (error) {
        return { error: 'something is wrong' }
            } finally {
            revalidatePath("/todo");
        }
    }
    
```

此时交互效果如下：

![optimistic-2.gif](/images/jueJin/6fc70f72c28b4f8.png)

当点击“添加任务”的时候，表单清空，任务内容立刻添加到下方的任务列表中，同时请求发出，2.5s 后接口返回。这是一个 RSC 接口，会包含最新的数据（也就是更新失败后的最新数据，在这个例子中，数据跟之前是一样的），于是页面状态更新，添加的数据被“撤回”了。

当然你也可以根据接口返回的数据，给与一个更为明显的错误提醒。修改 `app/todo/todo.js`中的表单 action 函数如下：

```javascript
    <form className="space-y-6" ref={formRef} action={async (formData) => {
    addOptimistic(formData.get("todo"))
    formRef.current?.reset()
    const res = await createToDo(formData)
        if (res?.error) {
        alert('任务添加失败！请重新添加！')
    }
    }}>
```

交互效果如下：

![optimistic-3.gif](/images/jueJin/7f6d17ee441c478.png)

用户要离开了怎么办？
----------

假设这个接口实在是太慢了，比如 10s 才返回，当任务内容添加到任务列表的时候，用户就会认为添加成功，他才不管你乐观悲观更新呢，然后他就要关闭网页走了，请问此时该怎么办？

一种解决方案是添加加载状态，既然用户认为添加到任务列表就算添加成功，那就在添加的时候，在任务旁边添加一个加载状态，让用户知道，此任务还在添加中，请不要随便离开。

修改 `app/todo/todo.js`，代码如下：

```javascript
'use client'

import { useRef, useOptimistic } from 'react'
import { createToDo } from './actions';

    export default function ToDoList({ todos }) {
    const formRef = useRef(null);
    
        const [optimisticToDoList, addOptimistic] = useOptimistic( todos.map((i) => ({text: i})), (currentState, optimisticValue) => {
            return [
            ...currentState,
                {
                text: optimisticValue,
                sending: true
            }
        ]
    }
    );
    
    return (
    <div className="p-10">
        <form className="space-y-6" ref={formRef} action={async (formData) => {
        addOptimistic(formData.get("todo"))
        formRef.current?.reset()
        const res = await createToDo(formData)
            if (res?.error) {
            alert('任务添加失败！请重新添加！')
        }
        }}>
        <div>
        <label htmlFor="todo" className="block text-sm font-medium leading-6 text-gray-900">
        添加一项任务列表
        </label>
        <div className="mt-2">
        <input id="todo" name="todo" type="todo" required
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
        />
        </div>
        </div>
        <button
        type="submit"
        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
        添加任务
        </button>
        </form>
        <ul role="list" className="divide-y divide-gray-100 list-decimal mt-4 list-inside">
        {optimisticToDoList.map(({text, sending}, i) => (
        <li key={i} className="py-2">
    {text} {!!sending && <small> (Adding...)</small>}
    </li>
))}
</ul>
</div>
)
}
```

注释掉 `actions.js`中的抛出错误代码，此时交互效果如下：

![optimistic-5.gif](/images/jueJin/bc8aa4a788694cb.png)

第二种解决方案就是监听表单提交状态，如果还在处理中，那就监听页面 unload 事件，给与用户离开提醒。为此我们需要用到 [useFormStatus](https://link.juejin.cn/?target=https%3A%2F%2Freact.dev%2Freference%2Freact-dom%2Fhooks%2FuseFormStatus "https://link.juejin.cn/?target=https%3A%2F%2Freact.dev%2Freference%2Freact-dom%2Fhooks%2FuseFormStatus")，这也是 React 的官方 hook。

修改 `app/todo/todo.js`，代码如下：

```jsx
'use client'

import { useRef, useOptimistic, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { createToDo } from './actions';

    export function SubmitButton() {
    const state = useFormStatus()
    
        useEffect(() => {
            function handler(e) {
            if (!state.pending) return;
            e.preventDefault();
        }
        
        window.addEventListener("beforeunload", handler);
        
            return () => {
            window.removeEventListener("beforeunload", handler);
        }
        }, [state.pending])
        
        return (
        <button
        type="submit"
        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
        添加任务
        </button>
        )
    }
    
        export default function ToDoList({ todos }) {
        const formRef = useRef(null);
        
            const [optimisticToDoList, addOptimistic] = useOptimistic(todos.map((i) => ({ text: i })), (currentState, optimisticValue) => {
                return [
                ...currentState,
                    {
                    text: optimisticValue,
                    sending: true
                }
            ]
        }
        );
        
        return (
        <div className="p-10">
            <form className="space-y-6" ref={formRef} action={async (formData) => {
            addOptimistic(formData.get("todo"))
            formRef.current?.reset()
            const res = await createToDo(formData)
                if (res?.error) {
                alert('任务添加失败！请重新添加！')
            }
            }}>
            <div>
            <label htmlFor="todo" className="block text-sm font-medium leading-6 text-gray-900">
            添加一项任务列表
            </label>
            <div className="mt-2">
            <input id="todo" name="todo" type="todo" required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
            />
            </div>
            </div>
            <SubmitButton />
            </form>
            <ul role="list" className="divide-y divide-gray-100 list-decimal mt-4 list-inside">
            {optimisticToDoList.map(({ text, sending }, i) => (
            <li key={i} className="py-2">
        {text} {!!sending && <small> (Adding...)</small>}
        </li>
    ))}
    </ul>
    </div>
    )
}
```

此时交互效果如下：

![optimistic-6.gif](/images/jueJin/34301d5f16ea4d2.png)

可惜浏览器的弹窗文案已经不能自定义，否则效果会更好。

总结
--

本篇我们讲解了乐观更新的概念，以及如何在 Next.js 项目中使用乐观更新。实现乐观更新并不复杂，相信随着 hook 的推广，实现成本的降低，以及大家在交互体验上越来越卷，乐观更新会是未来前端开发的必修功课。

PS：如果对 Next.js 不熟悉，欢迎入手小册[《Next.js 开发指南》](https://s.juejin.cn/ds/iFkbaMgM/ "https://s.juejin.cn/ds/iFkbaMgM/")。基础篇、实战篇、源码篇、面试篇四大篇章带你系统掌握 Next.js！