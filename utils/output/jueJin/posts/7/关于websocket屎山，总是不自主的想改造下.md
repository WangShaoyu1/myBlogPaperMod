---
author: "Gaby"
title: "关于websocket屎山，总是不自主的想改造下"
date: 2022-06-10
description: "进入今天的正题，因为项目上要重新搭建基础的开发环境，项目中也涉及到了 `websocket`,但是面对强耦合和屎山，不由得吓得我一哆嗦，伸手不是，下脚也不是，整个人都懵了，总是想改造下！"
tags: ["JavaScript","架构","WebSocket中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:3,comments:0,collects:8,views:1899,"
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第11天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

废话只说一句：码字不易求个👍，收藏 === 学会,快行动起来吧！🙇‍🙇‍🙇‍。

感谢点赞、收藏、关注和提出建议的小伙伴，希望大家工作顺利、老板能给你们加鸡腿!

为回馈掘金的小伙伴们，特地做了个文档站点，将前端知识及日常封装的工具类系统的整理在该站点上，希望能帮到更多的小伙伴[☞传送门](https://link.juejin.cn?target=https%3A%2F%2Fdocs.ycsnews.com%2F "https://docs.ycsnews.com/")

进入今天的正题，因为项目上要重新搭建基础的开发环境，项目中也涉及到了 `websocket`,但是面对强耦合和屎山，不由得吓得我一哆嗦，伸手不是，下脚也不是，整个人都懵了，殊不知我是被自己的无知整懵的，还是真的就被吓到了！也许找个跳大神的给叫叫魂就能好起来的。

无图无真相，念个咒语，祭出神图，'唵嘛呢叭咪吽，般若波罗蜜多，急急如律令！'

![image.png](/images/jueJin/249bd8d74a26424.png)

哎，怎么有点熟悉呐，明眼人一看就知道，这不就是 `Vuex` 嘛，对，没错，就是将这一大坨，还有里面的提示处理逻辑都写在了这里，我知道本意上也没啥坏心思，就是想通过全局方法方便控制和调用。但是好歹也简单封装下，减少些代码量，降低系统的耦合性。

话不多说，还是上代码...

采用的是 `sockjs-client` 和 `stompjs`，封装了 初始化、建立连接、断开连接三个方法。

```js
import SockJS from  'sockjs-client/dist/sockjs.min.js';
import Stomp from "stompjs";

    class WebSocket {
    
    /**
    * @description: 构造函数
    */
        constructor(url, subscribeUrl) {
        //公有属性和方法
        this.url = url;
        this.subscribeUrl = subscribeUrl;
        this.headers = {};
    }
    
    // 初始化
        initSocket(headers,cb) {
        this.headers = headers;
        this.cb = cb;
        this.connection();
        const self = this;
        // 断开重连机制,尝试发送消息,捕获异常发生时重连
            this.timer = setInterval(() => {
                try {
                console.log(1111)
                self.stompClient.send("test");
                    } catch (err) {
                    console.log("断线了: " + err);
                    this.connection();
                }
                }, 2000);
                return this.stompClient;
            }
            // 建立连接
                connection() {
                const self = this;
                // 建立连接对象（还未发起连接）
                const socket = new SockJS(this.url);//连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
                // 获取STOMP子协议的客户端对象
                this.stompClient = Stomp.over(socket);
                // 向服务器发起websocket连接并发送CONNECT帧
                this.stompClient.connect(
                this.headers, //可添加客户端的认证信息 按需求配置
                (frame) => { //连接成功地回调函数
                    this.cb('connect',{
                    message: "消息中心已连接",
                    data: frame
                    })
                    // 订阅频道
                    self.stompClient.subscribe(this.subscribeUrl,
                    (msg)=>this.cb('subscribe',msg) // 订阅服务端提供的某个topic
                    );
                        // self.stompClient.subscribe('/user/' + infoId + '/person/msg', (msg) => {
                        //     console.log('收到消息：',msg.body);  // msg.body存放的是服务端发送给我们的信息
                        // });
                            }, (err) => {
                            // 连接发生错误时的处理函数 失败调用
                                this.cb('connect',{
                                message: "消息中心连接失败",
                                data: err
                                })
                                });
                            }
                            // 断开连接
                                disconnect() {
                                    if (this.stompClient != null) {
                                    this.stompClient.disconnect();
                                    clearInterval(this.timer);
                                        this.cb('disconnect',{
                                        message: "消息中心已断开"
                                        })
                                    }
                                }
                            }
                            
                            export default WebSocket;
```

总结：

websocket 的实现客户端看起来比较简单，但是需要与后台进行很好的配合和调试才能达到最佳效果。通过SockJS、Stomp来进行浏览器兼容，增加消息语义，增强了可用性。要彻底搞懂websocket，我们还需要深入了解一些底层的原理以及相关的知识。

今天就暂且先这样，明天处理下使用实例，继续更新...