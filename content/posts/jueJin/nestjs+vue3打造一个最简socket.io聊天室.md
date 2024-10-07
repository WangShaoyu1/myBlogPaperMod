---
author: "chen77"
title: "nestjs+vue3打造一个最简socket.io聊天室"
date: 2024-09-27
description: "1.介绍1.1.项目概述本项目是一个基于NestJS和Vue3的最简聊天室应用。通过这个项目，你将学习如何将前端和后端结合，构建一个具备实时通信功能的聊天室。该聊天室允许用户发送和接收消"
tags: ["前端","Node.js"]
ShowReadingTime: "阅读6分钟"
weight: 911
---
1.介绍
----

### 1.1.项目概述

本项目是一个基于 **NestJS** 和 **Vue 3** 的最简聊天室应用。通过这个项目，你将学习如何将前端和后端结合，构建一个具备实时通信功能的聊天室。该聊天室允许用户发送和接收消息，并在界面上实时展示消息内容。

### 1.2.核心技术栈

1.  **NestJS**：基于 Node.js 构建的渐进式框架，专注于高效的服务端开发，提供了易于维护和扩展的架构。
2.  **WebSocket**：实现实时通信的协议，允许客户端与服务端之间进行双向通信，适用于实时应用。
3.  **Vue 3**：现代化的渐进式前端框架，具有响应式数据绑定、组件化等特性，用于构建灵活且高效的前端应用。
4.  **Better Scroll**：前端界面用于处理滚动体验，提升消息框在多条消息情况下的滚动性能。
5.  **TypeScript**：全栈代码都采用 TypeScript，提升开发体验、代码可维护性与类型安全性。

### 1.3.功能特色

*   **实时消息**：通过 WebSocket 实现的实时通信功能，用户可以即时发送和接收消息，体验无延迟的互动。
*   **消息同步**：不同客户端之间的消息能够保持一致，无论是加入聊天或发送消息，都能立刻看到最新消息。
*   **个人与其他消息区分**：聊天窗口中，用户的消息和他人的消息有明确区分，确保清晰的交互体验。
*   **滚动条优化**：使用 Better Scroll 管理聊天窗口的滚动，实现流畅的滚动体验和自动滚动到底部功能。
*   **简单直观的前端界面**：基于 Vue 3，前端界面简洁直观，便于用户快速上手。

### 1.4.项目目标

*   通过这个最简的聊天室项目，理解前后端分离架构的开发流程。
*   学习如何在 NestJS 中使用 WebSocket 实现实时消息的推送与接收。
*   掌握 Vue 3 中响应式数据绑定和组件化开发的核心理念。
*   探索如何利用 Better Scroll 实现用户友好的滚动体验。

### 1.5.适合人群

*   想学习如何使用 **NestJS** 和 **Vue 3** 开发实时应用的开发者。
*   有兴趣了解 **WebSocket** 的使用场景和技术细节的初学者。
*   想要构建一个具备前后端实时交互的最简应用并巩固全栈开发能力的工程师。

2.项目结构
------

在开始构建聊天室之前，我们需要了解项目的基本结构，确保每个部分都清晰明了。整个项目将分为前端 (Vue 3) 和后端 (NestJS)，各自负责不同的功能：

##### 2.1. **前端 (Vue 3)**

*   **`src/`** : 包含 Vue 3 组件和页面的目录。
    
    *   **`components/`** : Vue 组件目录，包含聊天界面的核心组件（如消息列表、输入框等）。
    *   **`views/`** : 应用的视图文件，如聊天室页面。
    *   **`assets/`** : 存放项目所需的图片、图标等静态资源。
    *   **`App.vue`**: 应用的根组件，包含基础布局和全局状态的处理。
    *   **`main.ts`**: 项目的入口文件，初始化 Vue 应用及相关插件。
*   **依赖库**
    
    *   **better-scroll**: 用于处理聊天窗口的滚动效果。
    *   **socket.io-client**: 用于与服务器进行实时通信。

##### 2.2. **后端 (NestJS)**

*   **`src/`** : NestJS 的核心逻辑所在，包含控制器、服务和模块。
    
    *   **`messages/`** : 聊天功能的核心逻辑，包含 WebSocket 网关、消息处理等。
        
        *   **`messages.gateway.ts`**: WebSocket 网关，处理前端发送的消息并广播给所有用户。
        *   **`messages.service.ts`**: 聊天服务，负责消息存储及处理。
        *   **`messages.module.ts`**: 聊天功能的模块化配置。
    *   **`app.module.ts`**: 应用的主模块，集成所有功能模块。
        
*   **依赖库**
    
    *   **@nestjs/websockets**: 用于后端处理 WebSocket 连接，提供实时的消息推送。
    *   **@nestjs/platform-socket.io**: 提供实时的消息推送。

3.关键功能实现
--------

##### 3.1. **后端实现 - WebSocket 聊天服务**

在 `messages.gateway.ts` 中创建 WebSocket 网关，监听连接和消息：

typescript

 代码解读

复制代码

`import {   WebSocketGateway,   SubscribeMessage,   MessageBody,   WebSocketServer,   ConnectedSocket, } from '@nestjs/websockets'; import { Server, Socket } from 'socket.io'; import { MessagesService } from './messages.service'; import { CreateMessageDto } from './dto/create-message.dto'; @WebSocketGateway({   cors: { origin: '*' }, }) export class MessagesGateway {   constructor(private readonly messagesService: MessagesService) {}   // 获取socket.io 实例   @WebSocketServer()   server: Server;   @SubscribeMessage('createMessage')   async create(     @MessageBody() createMessageDto: CreateMessageDto,     @ConnectedSocket() client: Socket,   ) {     const message = await this.messagesService.create(       createMessageDto,       client.id,     );     // 向所有客户端发送消息     this.server.emit('message', message);     return message;   }   @SubscribeMessage('findAllMessages')   findAll() {     return this.messagesService.findAll();   }   @SubscribeMessage('join')   joinRoom(     @MessageBody('name') name: string,     @ConnectedSocket() client: Socket,   ) {     return this.messagesService.identify(name, client.id);   }   @SubscribeMessage('typing')   async typing(     @MessageBody('isTyping') isTyping: boolean,     @ConnectedSocket() client: Socket,   ) {     return this.messagesService.typing(isTyping, client);   } }`

##### 3.2. **前端实现 - WebSocket 连接**

在 `chat-client` 项目的 `app.vue` 中，初始化 WebSocket 客户端并在 Vue 组件中监听和发送消息：

typescript

 代码解读

复制代码

`import { io } from 'socket.io-client'; const socket = io('http://localhost:3001'); // 发送消息 function sendMessage(message) {   socket.emit('sendMessage', message); } // 接收消息 socket.on('receiveMessage', (message) => {   // 更新消息列表 });`

* * *

到此为止，你可以让前后端通过 WebSocket 实现实时通信，接下来你可以继续实现消息的发送、展示和聊天记录等功能。

##### 3.3. **前端实现 - 消息列表与滚动功能**

为确保聊天窗口始终展示最新消息，我们可以使用 `Better Scroll` 实现自动滚动到底部的效果：

html

 代码解读

复制代码

`<div class="messages" ref="messages">       <div class="messages-box" ref="messagesContent">         <div class="messages-content">           <div v-for="(message, index) in messagesArray" :key="index" :class="message.className">             <figure class="avatar" v-if="message.className !== 'message message-personal new'">               <img src="./assets/imgs/default-icon2.png" />             </figure>             <span>{{ message.text }}</span>             <div class="timestamp">               <i>{{ message.name }}/</i>               <i> {{ message.timestamp }}</i>             </div>           </div>         </div>       </div>     </div>`

typescript

 代码解读

复制代码

`import BScroll from '@better-scroll/core'; import MouseWheel from '@better-scroll/mouse-wheel'; import Scrollbar from '@better-scroll/scroll-bar'; const scroll = ref(null); BScroll.use(MouseWheel); BScroll.use(Scrollbar); const bs = ref(null); const messagesContent = ref(null); const initializeScroll = async () => {   nextTick(() => {     if (messagesContent.value) {       bs.value = new BScroll(messagesContent.value, {         scrollY: true,         mouseWheel: {           speed: 6,           invert: false,           easeTime: 800         },         scrollbar: {           interactive: true, // 允许交互           fade: true, // 滚动条淡入淡出         },         click: true,         bounce: false       });     }   }) }; const updateScroll = () => {   nextTick(() => {     if (bs.value) {       bs.value.refresh();       // 获取最后一个消息元素       const lastMessage = messagesContent.value.querySelector('.message:last-child');       if (lastMessage) {         // 使用 scrollToElement 方法滚动到最后一个消息         bs.value.scrollToElement(lastMessage, 100); // 100ms 滚动时间       }     }   }) }; const initScroll = () => {   nextTick(() => {     if (bs.value) {       bs.value.refresh();       bs.value.scrollTo(0, bs.value.minScrollX, 100); // 100ms 滚动时间     }   }) };`

#### 3.4. **用户身份管理**

##### 区分用户消息

为了区分不同用户的消息，你可以通过设置 `message` 数据结构中加入 `id` 字段，结合加入聊天室时的用户`userId`来区分发送者是否为当前用户，从而在样式上做出不同的展示。

html

 代码解读

复制代码

`<div class="messages" ref="messages">       <div class="messages-box" ref="messagesContent">         <div class="messages-content">           <div v-for="(message, index) in messagesArray" :key="index" :class="message.className">             <figure class="avatar" v-if="message.className !== 'message message-personal new'">               <img src="./assets/imgs/default-icon2.png" />             </figure>             <span>{{ message.text }}</span>             <div class="timestamp">               <i>{{ message.name }}/</i>               <i> {{ message.timestamp }}</i>             </div>           </div>         </div>       </div>     </div>`

通过当前发消息人的`id`与当前`userId`匹配来给出不同样式 `message message-personal new`或`message new`来展示当前发送用户消息和其他用户消息展示

typescript

 代码解读

复制代码

 `socket.on('message', (message) => {       if (message.id === userId.value) {         message.className = 'message message-personal new'       } else {         message.className = 'message new'       }       messagesArray.value.push(message)       updateScroll()     })`

css

 代码解读

复制代码

    `.message {       clear: both;       float: left;       padding: 6px 10px 7px;       border-radius: 10px 10px 10px 0;       background: rgba(0, 0, 0, 0.3);       margin: 8px 0;       font-size: 11px;       line-height: 1.4;       margin-left: 35px;       position: relative;       text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);     &.message-personal {         float: right;         color: #fff;         text-align: right;         background: linear-gradient(120deg, #248a52, #257287);         border-radius: 10px 10px 0 10px;         &::before {           left: auto;           right: 0;           border-right: none;           border-left: 5px solid transparent;           border-top: 4px solid #257287;           bottom: -4px;         }       }`

#### 3.5. **发送消息优化**

可以进一步优化用户发送消息的体验，例如：

*   **防止重复发送**：用户按下回车键时，如果输入框为空则不发送消息。
*   **输入时显示“正在输入”** ：当用户输入消息时，其他用户看到聊天框中的loading效果。

##### 输入检测与提示

![Capturer_2024-09-27_145007_465.gif](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/b27cdc40ad5a49ddb2a38dcbb323a462~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgY2hlbjc3:q75.awebp?rk3s=f64ab15b&x-expires=1728028846&x-signature=90g6pXyCuIzU40s2tx%2FGJiIlrWc%3D)

html

 代码解读

复制代码

  `<div class="message-box">       <textarea v-model="newMessage" type="text" class="message-input" placeholder="Type message..."         @input="emitTyping"></textarea>       <button type="submit" class="message-submit" @click="sendMessage">         Send       </button>     </div>`

typescript

 代码解读

复制代码

`const emitTyping = () => {   socket.emit('typing', { isTyping: true })   if (newMessage.value.trim() === '') {     socket.emit('typing', { isTyping: false })   } } socket.on('typing', ({ name, isTyping, id }) => {       const one = messagesArray.value.find(item => item.id === id && item.text === '')       if (id !== userId.value && isTyping && !one) {         messagesArray.value.push({ id, text: '', name, className: 'message loading new', timestamp: getTimestamp() })       }       if (id !== userId.value && !isTyping) {         const index = messagesArray.value.findIndex(item => item.id === id && item.text === '');         if (index !== -1) {           messagesArray.value.splice(index, 1);  // 删除匹配的元素         }       }       updateScroll()     })`

css

 代码解读

复制代码

`&.loading {         &::before {           @include ball;           border: none;           animation-delay: 0.15s;         }         & span {           display: block;           font-size: 0;           width: 20px;           height: 10px;           position: relative;           &::before {             @include ball;             margin-left: -7px;           }           &::after {             @include ball;             margin-left: 7px;             animation-delay: 0.3s;           }         }       }`

项目展示
----

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/b637ada863314c0699860c41ff668abe~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgY2hlbjc3:q75.awebp?rk3s=f64ab15b&x-expires=1728028846&x-signature=mycwupEeq5xZvfwNn1ao%2B3g6xPw%3D)

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/62e90d6fc56146f2a4110f04e220f012~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgY2hlbjc3:q75.awebp?rk3s=f64ab15b&x-expires=1728028846&x-signature=ZcQE6KzJF2sGB8ho%2F3f3JPJ8FZc%3D)

![Capturer_2024-09-27_155534_256.gif](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f7894dfb39ce40f987991ba102c0e979~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgY2hlbjc3:q75.awebp?rk3s=f64ab15b&x-expires=1728028846&x-signature=YuV7mq7DnyCEw1j9gU%2FqF5KfMF4%3D)

5.待完善...
--------

### 消息历史与持久化

当前项目消息只是存在内存数组当中，可以拓展至存数据库中

### 用户状态展示 样式交互优化...

项目地址
----

[github](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcheen77%2Fnotes-of-nestjs%2Ftree%2Fmain%2F6-websocket "https://github.com/cheen77/notes-of-nestjs/tree/main/6-websocket")