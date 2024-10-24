---
author: "Gaby"
title: "解决vue3引入sockjs-client报错问题(global is not defined)"
date: 2022-06-09
description: "今天在 vue3 中引入 sockjs-client 的时候莫名的报了个错，而且页面里也没有 `global` 相关的内容，使得 sockjs-client 无法使用。通过一番查找资料，终得解决办法"
tags: ["JavaScript","架构","WebSocket中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读1分钟"
weight: 1
selfDefined:"likes:4,comments:0,collects:3,views:3343,"
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第10天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

废话只说一句：码字不易求个👍，收藏 === 学会,快行动起来吧！🙇‍🙇‍🙇‍。

感谢点赞、收藏、关注和提出建议的小伙伴，希望大家工作顺利、老板能给你们加鸡腿!

### 问题

今天在 vue3 中引入 sockjs-client 的时候莫名的报了个错，而且页面里也没有 `global` 相关的内容，使得 sockjs-client 无法使用。报错信息如下：

![image.png](/images/jueJin/cd44dd30db62436.png)

```js
Uncaught ReferenceError: global is not defined
at node_modules/sockjs-client/lib/utils/event.js (event.js:8:27)
at __require2 (chunk-A5AMJUWA.js?v=0a8d1f98:15:44)
at node_modules/sockjs-client/lib/transport/websocket.js (websocket.js:3:13)
at __require2 (chunk-A5AMJUWA.js?v=0a8d1f98:15:44)
at node_modules/sockjs-client/lib/transport-list.js (transport-list.js:5:3)
at __require2 (chunk-A5AMJUWA.js?v=0a8d1f98:15:44)
at node_modules/sockjs-client/lib/entry.js (entry.js:3:21)
at __require2 (chunk-A5AMJUWA.js?v=0a8d1f98:15:44)
at dep:sockjs-client:1:16
```

### 解决方法 1

还有种方法，gitHub解决办法讨论地址：[github.com/sockjs/sock…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsockjs%2Fsockjs-client%2Fissues%2F547 "https://github.com/sockjs/sockjs-client/issues/547")

在 `index.html` 中, 添加 `<script>global = globalThis</script>`

虽然此时解决了 `global` 报错问题，但这种情况还会继续报其他错误，所以不建议使用。

![image.png](/images/jueJin/7ced5381901141c.png)

### 解决方法 2

改变引入方式，将 `import SockJS from 'sockjs-client';` 改为 `import SockJS from 'sockjs-client/dist/sockjs.min.js';`

```js
//import SockJS from  'sockjs-client';
import SockJS from  'sockjs-client/dist/sockjs.min.js';
import Stomp from "stompjs";
```

在过渡到 vue 3 的过程中，总是不经意的会遇到一些问题，耐心的去寻找答案，去分析解决，总是会有办法的。