---
author: "Java3y"
title: "两个月的Java实习结束，继续努力"
date: 2018-08-30
description: "2018年8月30日，今天我辞职了。在6月25号入职，到现在也有两个月时间了。 第一天是期待的：第一次将项目拉到本地上看的时候，代码很多，有非常多的模块，模块下又有daoservicecontrollerformbean，眼花缭乱的。再连上测试库，也发现有100多张表。…"
tags: ["后端","Java","SQL","HTTPS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:20,comments:11,collects:13,views:1045,"
---
前言
==

> 只有光头才能变强

2018年8月30日，今天我辞职了。在6月25号入职，到现在也有两个月时间了。

感受：

*   第一天是期待的：第一次将项目拉到本地上看的时候，代码很多，有非常多的模块，模块下又有`dao/service/controller/form/bean`，眼花缭乱的。再连上测试库，也发现有100多张表。~~顺着一些模块看下去，发现用的技术不难，之前基本都有接触过，都是可以看得懂的。
*   第一个星期是焦虑的：第二天给我发下了一个文档，文档里边有几个小任务(一、编写接口将数据导出到Excel，二、改进一个功能)。
    *   第二个功能的SQL语句写了很长的时间都没写出来，没写出来原因有两个：我的SQL能力弱和业务表之间的关系还没熟悉(现在想起来，算是我这两个月里写过最麻烦的SQL了)。花了将近两个星期完成了功能，期间我编写SQL的能力也算是有所提升了。
*   大多时候是闲的：很多时候接到的任务都是基于原有的基础上添加一些功能，改Bug之类的，也做过小的模块开发。总体来看：**技术难度不大，主要是对业务的理解**。

这两个月过得很开心，好吃好住，就是长胖了

另外值得一说的是：别以为我写了那么多博客的就很厉害，很牛逼，其实**我渣得一批**！校招的算法笔试题基本没有ac的，在面试的时候，知识点说忘就忘。我写博客主要是记录一下自己的成长，遗忘的技术可以翻看，跟大家一起交流交流，共同进步~

> 朋友吐槽我写的文章像是小学生作文，我也不擅长着感想之类的.....所以，将就点看吧..~

下面主要记录了在实习中遇到的新技术，还有一些之前写过的笔记也放上来了。

一、实习时学到的新技术
===========

1.1swagger文档框架
--------------

在看公司代码的时候，发现Controller有几个我不知道的注解：`@Api`，`@ApiOperation`..

去查了一下，原来是**接口的文档框架**。

![](/images/jueJin/1658ab2d081031f.png)

想要更加深入了解：

*   [blog.csdn.net/i6448038/ar…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fi6448038%2Farticle%2Fdetails%2F77622977 "https://blog.csdn.net/i6448038/article/details/77622977")

1.2Lombok让Java代码更简洁
-------------------

看到JavaBean的时候，也发现了新大陆：注解`@Data`

在JavaBean中没有任何的`set/get`方法，但在外面却可以使用`set/get`方法，很是神奇..

去找了一下资料，原来这玩意叫做：**Lombok**。

*   简单来说：**通过注解消除样板代码**(从此`set/get`就没有了)，JavaBean会十分**简洁**！

要注意的是：**在IDE上需要安装插件**(IDEA如果没安装lombok插件，编译会错误，一大堆的红色!)

![](/images/jueJin/1658ab2cc29fab2.png)

Lombok使用和介绍：

*   [yq.aliyun.com/articles/59…](https://link.juejin.cn?target=https%3A%2F%2Fyq.aliyun.com%2Farticles%2F59972 "https://yq.aliyun.com/articles/59972")
*   [www.zhihu.com/question/42…](https://link.juejin.cn?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F42348457 "https://www.zhihu.com/question/42348457")
*   [blog.csdn.net/lvshuchangy…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Flvshuchangyin%2Farticle%2Fdetails%2F68065775 "https://blog.csdn.net/lvshuchangyin/article/details/68065775")

1.3postman使用
------------

公司前后端分离，后端返回json数据给前端解析。我拿到的代码是完全没有前端页面的，老大让我装个postman来调试。

由于之前都是个人开发，想怎么玩就怎么玩(所以就没用过postman..)。

![](/images/jueJin/1658ab2cc5c5006.png)

找到了一篇很好的postman教程(如果没用过的同学，看完应该可以快速上手!)：

*   [blog.csdn.net/fxbin123/ar…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Ffxbin123%2Farticle%2Fdetails%2F80428216 "https://blog.csdn.net/fxbin123/article/details/80428216")

1.4JSON Web Token(认证授权)
-----------------------

![](/images/jueJin/1658ab2cc2c35fc.png)

> JSON Web Token（JWT）是什么?

WT作为一个开放的标准（RFC 7519）， 定义了一种简洁自包含的方法用于通信双方之间以Json对象的形式安全的传递信息。 因为特定的数字签名，所以这些通信的信息能够被校验和信任。 JWT可以使用HMAC算法或者RSA的公钥私钥对进行签名。

> 什么时候应该使用JSON Web Tokens?

*   认证鉴权（Authentication）
*   数据交换（Information Exchange）

貌似我司很简单用了一下JWT，用于认证鉴权，我**简单总结了一下流程**：

1.  按照正常的方式登录
2.  将用户信息拼接成参数
3.  用这个参数生成jwt对应的token值。
4.  这个token值保存对应的权限，有效期，加密方式
5.  token返回到浏览器中，使用Session Storage存储起来
6.  再次访问的时候，将这个token值带过去(可以通过header的方式，也可以post/url拼接的方式)。问了一下前端小哥，他们用的是Angular，封装了一下，每次请求都将其写在header上。
7.  如果这个token没过期，解析这个Token值，返回对应的User对象(标识)
8.  如果这个token过期了，重新让用户登录

了解更多查看文档(中文)：

*   [jwtio.com/introductio…](https://link.juejin.cn?target=http%3A%2F%2Fjwtio.com%2Fintroduction.html "http://jwtio.com/introduction.html")

相关博文与讨论：

*   [www.liriansu.com/jwt](https://link.juejin.cn?target=http%3A%2F%2Fwww.liriansu.com%2Fjwt "http://www.liriansu.com/jwt")
*   [www.zhihu.com/question/41…](https://link.juejin.cn?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F41248303 "https://www.zhihu.com/question/41248303")
*   [www.cnblogs.com/cjsblog/p/9…](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fcjsblog%2Fp%2F9277677.html "https://www.cnblogs.com/cjsblog/p/9277677.html")

1.5SQL编写思路
----------

之前自己写的sql都挺简单的，无非就是连接两张表查询出对应的数据。

到了需求的时候就不同了，复杂很多(以至于我写了一个星期还没写出来....)

需求的任务简单概括：**要对每个字段的数据进行统计，又要显示每个字段下具体的内容**

*   说白了，**就是将多行的数据拼接起来，弄成一行**~

最终思路：

*   使用`concat`函数将其对应的字段拼接起来
*   随后再对字段进行分组，使用`group_concat`函数再将上述的拼接起来
*   最终拿到拼接到一行的结果，放到**程序中解析**

反正**sql这玩意得多写**...(虐了我一个星期，原本都认为这功能是无法实现的了..)

在完成需求的时候也想过很多种办法来解决，找思路，从中也找到了一些比较好的关于sql的博文：

*   case when 使用: [www.cnblogs.com/qlqwjy/p/74…](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fqlqwjy%2Fp%2F7476533.html "https://www.cnblogs.com/qlqwjy/p/7476533.html")
*   exists关键字 使用：[zhuanlan.zhihu.com/p/20005249](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F20005249 "https://zhuanlan.zhihu.com/p/20005249")

非相关子查询：

![](/images/jueJin/1658ab2cc56214c.png)

相关子查询：

![](/images/jueJin/1658ab2cc592e95.png)

没有什么是select解决不了的，如果有，那就再套一层---《3y》

> tips : 在连表查询的时候，思考一下**是不是一开始就需要连表得出结果**(可能有的时候：某个查询条件**必要**时，才要连表)

1.6数据库外键
--------

在公司中，看数据库表的设计是**不用外键**的。

在初学数据库的时候，经常用到了外键约束。在论坛中查看讨论的时候，一般人都说很少用外键。因为我们完全可以在**业务(程序控制和事务)**上处理表之间关系。一般**互联网应用**没必要使用外键，外键会带来一系列不好的影响：

*   1.数据库需要维护外键的内部管理；
*   2.外键等于把数据的一致性事务实现，全部交给数据库服务器完成；
*   3.有了外键，当做一些涉及外键字段的增，删，更新操作之后，需要触发相关操作去检查，而不得不消耗资源；
*   4.外键还会因为需要请求对其他表内部加锁而容易出现死锁情况；

参考资料：

*   [www.zhihu.com/question/19…](https://link.juejin.cn?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F19600081 "https://www.zhihu.com/question/19600081")

二、之前的一些笔记
=========

2.1Timer和Quartz的区别
------------------

Timer和Quartz都是**任务调度框架**，简单来说就是：程序能够在**某时某刻上执行你想要执行的代码**。

之前在项目中简单用到了Quartz，在初学的时候也接触过一下Timer的API调用。之前简单记录过他俩的区别，现在回头整理一下吧~

*   1.出身不同：Timer由jdk直接提供，调用方式简单粗暴，不需要其它jar包支持。Quartz并非jdk自带，需要引入相应的jar包
*   2.能力区别：**主要体现在对时间的控制上**。某个具体时间执行具什么任务的话Timer可以轻松搞定，而比如每个星期天早上八点提醒做某事的功能就需要Quartz，因此Quartz对时间的控制远比Timer强大，完善
*   3.**异常处理不同**：**Quartz**的某次执行任务过程中抛出异常，不影响下一次任务的执行，当下一次执行时间到来时，定时器会**再次执行任务**；而**TimerTask**则不同，一旦某个任务在执行过程中**抛出异常**，则整个定时器生命周期就结束，以后**永远不会再执行定时器任务**。
*   4.**对并发支持不同**：Timer走后台线程执行定时任务(单线程)，Quartz能够使用多个执行线程去执行定时任务
*   5.Quartz每次执行任务都创建一个新的任务类对象，而TimerTask则每次使用同一个任务类对象

参考资料：

*   [segmentfault.com/a/119000000…](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000009542398 "https://segmentfault.com/a/1190000009542398")
*   [segmentfault.com/a/119000000…](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000009972187 "https://segmentfault.com/a/1190000009972187")
*   TimerTask 和 Quartz比较：[blog.csdn.net/gongyouong/…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fgongyouong%2Farticle%2Fdetails%2F72965451 "https://blog.csdn.net/gongyouong/article/details/72965451")

Quartz Demo源码：

*   [img.mukewang.com/down/5950ca…](https://link.juejin.cn?target=https%3A%2F%2Fimg.mukewang.com%2Fdown%2F5950cae200010ca100000000.rar "https://img.mukewang.com/down/5950cae200010ca100000000.rar")

2.2Java生成二维码
------------

我们现在已经离不开二维码了。

二维码是由一维码发展而来的，最典型的**一维码**就是我们平时去商场中看到商品包装的**条形码**，这就是典型的一维码。

而二维码的数据存储量信息又比一维码大得多，并且有很好的**纠正的功能**（即使二维码中有部分的信息不完整，还是能够解析得到二维码的数据）

![](/images/jueJin/1658ab2d1ab3ae6.png)

使用Java语言生成二维码有以下的方式：

*   zxing API
*   qrcode
*   juqeryqrcode

![](/images/jueJin/1658ab2d22583bd.png)

当然了，肯定是jquery的方式来生成二维码是比较简单的。但是如果想**定制二维码的样式、形状**的话。那么使用Java的方式来生成是比较灵活的。（比如：在二维码中间放上logo）

下载生成二维码的资源jar包：[img.mukewang.com/down/5799a5…](https://link.juejin.cn?target=https%3A%2F%2Fimg.mukewang.com%2Fdown%2F5799a5440001040300000000.rar "https://img.mukewang.com/down/5799a5440001040300000000.rar")

使用Jquery的方式生成二维码的博文：[suflow.iteye.com/blog/168739…](https://link.juejin.cn?target=http%3A%2F%2Fsuflow.iteye.com%2Fblog%2F1687396 "http://suflow.iteye.com/blog/1687396")

使用zxing生成二维码的博客：[guopengli.cn/index.php/2…](https://link.juejin.cn?target=http%3A%2F%2Fguopengli.cn%2Findex.php%2F2017%2F10%2F05%2F53.html "http://guopengli.cn/index.php/2017/10/05/53.html")

参考资料：

*   [segmentfault.com/a/119000000…](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000009909177 "https://segmentfault.com/a/1190000009909177")

2.3Java实现图片水印、缩略图
-----------------

有的时候我们在上传图片时，不希望展示的图片大小和上传的图片大小相同时，我们就需要把图片进行**压缩生一定的像素**。缩略图例子：

![](/images/jueJin/1658ab2d24673e0.png)

图片水印也经常会看到：

![](/images/jueJin/1658ab2d4196626.png)

无论是水印还是缩略图，其实就是通过类库来实现的，一般我们会使用JAVA图像处理库**Thumbnailator**。

参考资料：

*   [segmentfault.com/a/119000001…](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000010302289 "https://segmentfault.com/a/1190000010302289")
*   生成水印源码：[github.com/HongZhilin/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FHongZhilin%2Fwatermark "https://github.com/HongZhilin/watermark")
*   缩略图博文：[blog.csdn.net/qq\_31179919…](https://link.juejin.cn?target=http%3A%2F%2Fblog.csdn.net%2Fqq_31179919%2Farticle%2Fdetails%2F53336293 "http://blog.csdn.net/qq_31179919/article/details/53336293")
*   缩略图源码：[github.com/Amant-huang…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FAmant-huangqi%2FThumbnails "https://github.com/Amant-huangqi/Thumbnails")

最后
==

能看到我博客的人，说明是有看技术文章的习惯的。有看技术文章的习惯，说明都是爱技术/学习的人。爱技术/学习的人，技术一般不会差。所以能看到这篇文章的同学都是大佬----《3y》

> 如果想看更多的**原创**技术文章，欢迎大家关注我的**微信公众号:Java3y**。公众号还有**海量的视频资源**哦，关注即可免费领取。

可能感兴趣的链接：

*   **文章的目录导航(微信公众号端)**：[zhongfucheng.bitcron.com/post/shou-j…](https://link.juejin.cn?target=https%3A%2F%2Fzhongfucheng.bitcron.com%2Fpost%2Fshou-ji%2Fwen-zhang-dao-hang "https://zhongfucheng.bitcron.com/post/shou-ji/wen-zhang-dao-hang")
*   **文章的目录导航(PC端)**：[www.zhongfucheng.bitcron.com/post/shou-j…](https://link.juejin.cn?target=http%3A%2F%2Fwww.zhongfucheng.bitcron.com%2Fpost%2Fshou-ji%2Fpcduan-wen-zhang-dao-hang "http://www.zhongfucheng.bitcron.com/post/shou-ji/pcduan-wen-zhang-dao-hang")
*   **海量精美脑图：**[www.zhongfucheng.bitcron.com/post/shou-j…](https://link.juejin.cn?target=http%3A%2F%2Fwww.zhongfucheng.bitcron.com%2Fpost%2Fshou-ji%2Fnao-tu-da-quan "http://www.zhongfucheng.bitcron.com/post/shou-ji/nao-tu-da-quan")