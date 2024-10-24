---
author: "Java3y"
title: "【对线面试官】CountDownLatch和CyclicBarrier的区别"
date: 2021-07-27
description: "CountDownLatch和CyclicBarrier因为我不懂，差点面试官就把我放弃掉了，还好我脸皮"
tags: ["后端","面试","Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读1分钟"
weight: 1
selfDefined:"likes:39,comments:13,collects:26,views:3516,"
---
![](/images/jueJin/91c6e7d237c14ec.png)

![](/images/jueJin/96d0d760a5574dc.png)

![](/images/jueJin/a556253eabc54a5.png)

![](/images/jueJin/7d5cc4a32e63480.png)

![](/images/jueJin/3f213aaa544d484.png)

![](/images/jueJin/94e27fec10624b8.png)

![](/images/jueJin/547f6cb45cc148c.png)

![](/images/jueJin/2ca9869735dd4a3.png)

![](/images/jueJin/e24f3bcc9b88434.png)

![](/images/jueJin/5b1d1e9ba70a4da.png)

![](/images/jueJin/8d3d5fbf8330444.png)

![](/images/jueJin/b4733fb09103400.png)

![](/images/jueJin/7e48ffa0d0c848e.png)

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