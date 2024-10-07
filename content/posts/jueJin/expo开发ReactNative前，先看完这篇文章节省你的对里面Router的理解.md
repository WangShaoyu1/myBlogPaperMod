---
author: "July_lly"
title: "expo开发ReactNative前，先看完这篇文章节省你的对里面Router的理解"
date: 2024-09-12
description: "最近在开发一个ReactNative双端App，试了几个框架，最后还是敲定使用expo框架，这里先介绍一下这个框架。"
tags: ["ReactNative","前端","前端框架"]
ShowReadingTime: "阅读4分钟"
weight: 907
---
最近在开发一个React Native双端App，试了几个框架，最后还是敲定使用expo框架，这里先介绍一下这个框架。[世博会 (expo.dev)](https://link.juejin.cn?target=https%3A%2F%2Fexpo.dev%2F "https://expo.dev/")

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/49c1c3487e524363af7d11313840513a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVseV9sbHk=:q75.awebp?rk3s=f64ab15b&x-expires=1728366114&x-signature=xIpizTOx8WFquFlO99U2DZQ8vXE%3D)

#### Expo的特点

1.  **简化开发环境**：
    
    *   **无需配置**：Expo为开发者提供了预配置的开发环境，减少了设置React Native项目的复杂性。
    *   **快速启动**：使用Expo CLI（命令行界面），您可以快速创建新项目并开始开发。
2.  **跨平台支持**：
    
    *   **一次编写，多处运行**：Expo允许您使用JavaScript或TypeScript编写代码，然后将其打包成iOS或Android应用。
3.  **内置功能**：
    
    *   **广泛的API库**：Expo提供了一整套丰富的API，包括对摄像头、地理位置、通知等功能的支持。
    *   **开箱即用的功能**：许多常见的移动应用功能（如推送通知、离线数据存储等）都可以通过简单的API调用来实现。
4.  **实时预览**：
    
    *   **即时预览**：使用Expo客户端应用，您可以在真实设备上实时查看应用的变化，而无需重新编译。
    *   **热重载**：在开发过程中，Expo支持自动刷新，让您可以立即看到代码更改的效果。
5.  **发布与部署**：
    
    *   **轻松发布**：您可以直接通过Expo发布应用到苹果App Store或Google Play商店。
    *   **云构建服务**：Expo提供了自动化的云构建服务，使得构建过程自动化且简单。

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/fda926208c0246ef83e76d3749bd3f0d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVseV9sbHk=:q75.awebp?rk3s=f64ab15b&x-expires=1728366114&x-signature=blWyJpdol45IrYHIS3WsYDNsJ64%3D) 进入文档我们安装最新版的expo

sql

 代码解读

复制代码

`npx create-expo-app@latest`

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/79b6ddaa8ef840168f061a5c79eb2272~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVseV9sbHk=:q75.awebp?rk3s=f64ab15b&x-expires=1728366114&x-signature=fPrLLavJVTgv3eF5k%2BhLQiYbero%3D)

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/9eff5ce3736a4dba8e46e6c97dbfafef~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVseV9sbHk=:q75.awebp?rk3s=f64ab15b&x-expires=1728366114&x-signature=LRiiXDHODOIoGP5IISQBJPvaOew%3D)

从Vue或者React转到刚开始开发expo必然是有许多问号的，怎么main.js,index.HTML,app.tsx这几个文件都没有，更是无从下手来进行开发的。这里我直接给大家解惑：

在expo中的路由配置是框架会自动匹配的，Expo 版本为 50 或以上使用了 Expo Router，会自动使用`/app`下的`index.js`作为项目首页。所以`App.js`不再需要。

在app中便是我们页面的开发位置，我们需要创建那个页面直接创建便可以，默认导航`'/'`为index.tsx文件，而其他的文件的PathName是该的文件名。如果我们需要将一些页面做归类开发，直接创建一个文件夹即可，而这个文件夹的名字将也作为页面导航的一部分。

那为什么有的文件夹名是带`()`例如上图的`(tabs)`,这是因为在expoz中可以存在**布局路由**

### 布局路由

默认情况下，路由会填充整个屏幕。在它们之间移动是没有动画的整页过渡。在原生应用程序中，用户希望标题和标签栏等共享元素在页面之间持续存在。这些是使用**布局路由**创建的。配置布局路由的便是`_layout.tsx`组件完成的。

而在我们真实的开发中并不是所有的页面都要使用同一个布局路由样式的，但是这个页面的归属应该是属于该部分的，Expo Router 支持为给定目录添加单个布局路由。如果需要多个布局路由而不修改 URL，则可以使用组。

可以使用 group syntax 阻止区段显示在 URL 中 。`()`这对于在不向 URL 添加其他区段的情况下添加布局非常有用。您可以根据需要添加任意数量的组。

群组还适用于组织应用程序的各个部分。在以下示例中，我们有 **app/（app）**  是主应用程序所在的位置，而 **app/（aux）**  是辅助页面所在的位置。这对于添加想要从外部链接到的页面很有用，但不需要成为主应用程序的一部分。

### 修改默认导向

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/c17bd0fb4b09414486f9be9f677d7245~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVseV9sbHk=:q75.awebp?rk3s=f64ab15b&x-expires=1728366114&x-signature=XZuyRgYFFEHyqlNk%2BPpeJ2XP1xI%3D)

这里是expo Router 自动为我们配置的路由配置。在这里也可以清楚的看到默认路由导向，记住同一路径下使用多个`()`括起来的不要多次创建index.tsx文件，这会导致入口index错乱，会按这里路由导向的默认首位来展示的，没有使用`()`的路径也只能有一个index.tsx文件。