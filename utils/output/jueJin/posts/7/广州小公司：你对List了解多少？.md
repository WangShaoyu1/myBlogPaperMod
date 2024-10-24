---
author: "Java3y"
title: "广州小公司：你对List了解多少？"
date: 2021-07-07
description: "数组与List的区别；List的扩容机制；COW机制是否了解，ArrayList&&CopyOnWriteArrayList源码实现"
tags: ["后端","面试中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读1分钟"
weight: 1
selfDefined:"likes:21,comments:4,collects:8,views:2308,"
---
![](/images/jueJin/565a39aa1683430.png)

![](/images/jueJin/29c592c19d1f4cb.png)

![](/images/jueJin/45b5f6bc89e043f.png)

![](/images/jueJin/ea10142bece14e2.png)

![](/images/jueJin/08b35db9f73b41c.png)

![](/images/jueJin/42bbff442b80435.png)

![](/images/jueJin/0d003fe03759442.png)

![](/images/jueJin/e02a83822eb9431.png)

![](/images/jueJin/11ec88896ac04d4.png)

![](/images/jueJin/9c11e9fdd2f84ca.png)

![](/images/jueJin/3344820814c64fb.png)

![](/images/jueJin/ffc74498aec4408.png)

![](/images/jueJin/0f47dfdc64c64c0.png)

![](/images/jueJin/ca3a10276c2c445.png)

![](/images/jueJin/6b5f469bbb2446e.png)

**文章以纯面试的角度去讲解，所以有很多的细节是未铺垫的。**

鉴于很多同学反馈没看懂【**对线面试官**】系列，基础相关的知识我确实写过文章讲解过啦，但有的同学就是不爱去翻。

为了让大家有更好的体验，我把基础文章也找出来（重要的知识点我还整理过**电子书**，比如说像多线程、集合、**Spring**这种面试必考的早就已经转成PDF格式啦）

我把这些**上传到网盘**，你们有需要直接下载就好了。做到这份上了，**不会还想白嫖吧**？**点赞**和**转发**又不用钱。

![](/images/jueJin/0863d2cb543848e.png)

链接:[pan.baidu.com/s/1pQTuKBYs…](https://link.juejin.cn?target=https%3A%2F%2Fpan.baidu.com%2Fs%2F1pQTuKBYsHLsUR5ORRAnwFg "https://pan.baidu.com/s/1pQTuKBYsHLsUR5ORRAnwFg") 密码:3wom

欢迎关注我的微信公众号【**Java3y**】来聊聊Java面试

**[【对线面试官】系列](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fmp%2Fappmsgalbum%3F__biz%3DMzU4NzA3MTc5Mg%3D%3D%26action%3Dgetalbum%26album_id%3D1657204970858872832%23wechat_redirect "https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzU4NzA3MTc5Mg==&action=getalbum&album_id=1657204970858872832#wechat_redirect") 一周两篇持续更新中！**

**原创不易！！求三连！！**