---
author: "Java3y"
title: "北京大公司二面：了解Redis持久化机制吗？"
date: 2021-07-22
description: "今日总结！！！Redis持久化机制：RDB和AOF RDB持久化：定时任务，BGSAVE命令 fork一个子进程生成RDB文件（二进制） AOF持久化：根据配置将写命令存储至日志文件中"
tags: ["后端","Redis","Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读1分钟"
weight: 1
selfDefined:"likes:28,comments:0,collects:13,views:2197,"
---
![](/images/jueJin/8b06928283c041d.png)

![](/images/jueJin/ea29938eade844c.png)

![](/images/jueJin/1a5bb19a1e6a434.png)

![](/images/jueJin/cb9fff45f2d04ef.png)

![](/images/jueJin/10b5bbd7d3ff489.png)

![](/images/jueJin/efba91392c264cc.png)

![](/images/jueJin/d9656272a4584ac.png)

![](/images/jueJin/fbefd4e120dc4fb.png)

![](/images/jueJin/868c86bcef65492.png)

![](/images/jueJin/03e27e533e9b47a.png)

![](/images/jueJin/5ce27c9df295436.png)

![](/images/jueJin/bcd7093087204e6.png)

![](/images/jueJin/d7d970581ea741d.png)

![](/images/jueJin/e63356d1b3a44a1.png)

![](/images/jueJin/1c6dcb6af2564a8.png)

### 今日总结

**Redis持久化机制**：RDB和AOF

**RDB持久化**：定时任务，BGSAVE命令 fork一个子进程生成RDB文件（二进制）

**AOF持久化**：根据配置将写命令存储至日志文件中，顺序写&&异步刷盘(子线程)，重写AOF文件也是需要 fork 子进程

Redis4.0之后支持混合持久化，用什么持久化机制看业务场景

* * *

**文章以纯面试的角度去讲解，所以有很多的细节是未铺垫的。**

鉴于很多同学反馈没看懂【**对线面试官**】系列，基础相关的知识我确实写过文章讲解过啦，但有的同学就是不爱去翻。

为了让大家有更好的体验，我把基础文章也找出来（重要的知识点我还整理过**电子书**，比如说像多线程、集合、**Spring**这种面试必考的早就已经转成PDF格式啦）

我把这些**上传到网盘**，你们有需要直接下载就好了。做到这份上了，**不会还想白嫖吧**？**点赞**和**转发**又不用钱。

![](/images/jueJin/0863d2cb543848e.png)

链接:[pan.baidu.com/s/1pQTuKBYs…](https://link.juejin.cn?target=https%3A%2F%2Fpan.baidu.com%2Fs%2F1pQTuKBYsHLsUR5ORRAnwFg "https://pan.baidu.com/s/1pQTuKBYsHLsUR5ORRAnwFg") 密码:3wom

欢迎关注我的微信公众号【**Java3y**】来聊聊Java面试

![](/images/jueJin/291a2c55d5cc4d1.png)

**[【对线面试官】系列](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fmp%2Fappmsgalbum%3F__biz%3DMzU4NzA3MTc5Mg%3D%3D%26action%3Dgetalbum%26album_id%3D1657204970858872832%23wechat_redirect "https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzU4NzA3MTc5Mg==&action=getalbum&album_id=1657204970858872832#wechat_redirect") 一周两篇持续更新中！**

**原创不易！！求三连！！**