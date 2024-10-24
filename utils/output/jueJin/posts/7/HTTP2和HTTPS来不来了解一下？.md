---
author: "Java3y"
title: "HTTP2和HTTPS来不来了解一下？"
date: 2018-07-30
description: "最近在看博客的时候，发现有的面试题已经考HTTP2了，于是我就顺着去了解一下。 下面就简单聊聊他们三者的区别，以及整理一些必要的额外知识点。 试想一下：请求一张图片，新开一个连接，请求一个CSS文件，新开一个连接，请求一个JS文件，新开一个连接。HTTP协议是基于TCP的，T…"
tags: ["后端","HTTP","HTTPS","服务器中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:170,comments:0,collects:128,views:7960,"
---
一、前言
====

> 只有光头才能变强

HTTP博文回顾：

*   [PC端：HTTP就是这么简单](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000013175647 "https://segmentfault.com/a/1190000013175647")
*   [PC端：HTTP面试题都在这里](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000013271378 "https://segmentfault.com/a/1190000013271378")
*   [微信公众号端：HTTP就是这么简单](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247483733%26idx%3D2%26sn%3D93b359af4397cd4afa791fdb5f51f0b5%26chksm%3Debd74054dca0c942be5180cdf0f460ed7f534ca51230147fe0081df15adac76dac9e61d97761%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247483733&idx=2&sn=93b359af4397cd4afa791fdb5f51f0b5&chksm=ebd74054dca0c942be5180cdf0f460ed7f534ca51230147fe0081df15adac76dac9e61d97761#rd")
*   [微信公众号端：HTTP面试题都在这里](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247483733%26idx%3D1%26sn%3Df9ab8d07d2151bd40cdcd9a290317346%26chksm%3Debd74054dca0c942a36e6e63c783e9b1f414a16e2c702ae4b371a204960a50c7ae89af207139%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247483733&idx=1&sn=f9ab8d07d2151bd40cdcd9a290317346&chksm=ebd74054dca0c942a36e6e63c783e9b1f414a16e2c702ae4b371a204960a50c7ae89af207139#rd")

本文**力求简单讲清每个知识点**，希望大家看完能有所收获

二、HTTP协议的今生来世
=============

最近在看博客的时候，发现有的面试题已经考HTTP/2了，于是我就顺着去了解一下。

到现在为止，HTTP协议已经有三个版本了：

*   HTTP1.0
*   HTTP1.1
*   HTTP/2

下面就简单聊聊他们三者的区别，以及整理一些必要的额外知识点。

2.1HTTP版本之间的区别
--------------

### 2.1.1HTTP1.0和HTTP1.1区别

HTTP1.0和HTTP1.1最主要的区别就是：

*   HTTP1.1默认是**持久化连接**！

在HTTP1.0默认是短连接：

![](/images/jueJin/164eaef42a86445.png)

简单来说就是：**每次与服务器交互，都需要新开一个连接**！

![](/images/jueJin/164eaef4311d5d2.png)

![](/images/jueJin/164eaef42a4c5f1.png)

试想一下：请求一张图片，新开一个连接，请求一个CSS文件，新开一个连接，请求一个JS文件，新开一个连接。HTTP协议是基于TCP的，TCP每次都要经过**三次握手，四次挥手，慢启动**...这都需要去消耗我们非常多的资源的！

在HTTP1.1中默认就使用持久化连接来解决：**建立一次连接，多次请求均由这个连接完成**！(如果阻塞了，还是会开新的TCP连接的)

![](/images/jueJin/164eaef42a5e594.png)

相对于持久化连接还有另外比较重要的改动：

*   HTTP 1.1增加host字段
*   HTTP 1.1中引入了`Chunked transfer-coding`，范围请求，实现断点续传(实际上就是利用HTTP消息头使用分块传输编码，将实体主体分块传输)
*   HTTP 1.1管线化(pipelining)理论，客户端可以同时发出多个HTTP请求，而不用一个个等待响应之后再请求
    *   注意：这个pipelining仅仅是**限于理论场景下**，大部分桌面浏览器仍然会**选择默认关闭**HTTP pipelining！
    *   所以现在使用HTTP1.1协议的应用，都是有**可能会开多个TCP连接**的！

参考资料：

*   [www.cnblogs.com/gofighting/…](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fgofighting%2Fp%2F5421890.html "https://www.cnblogs.com/gofighting/p/5421890.html")

### 2.1.2HTTP2基础

在说HTTP2之前，不如先直观比较一下HTTP2和HTTP1.1的区别：

*   [http2.akamai.com/demo](https://link.juejin.cn?target=https%3A%2F%2Fhttp2.akamai.com%2Fdemo "https://http2.akamai.com/demo")

![](/images/jueJin/164eaef4395f4f7.png)

上面也已经说了，HTTP 1.1提出了管线化(pipelining)理论，但是仅仅是限于理论的阶段上，这个功能默认还是关闭了的。

管线化(pipelining)和非管线化的**区别**：

![](/images/jueJin/164eaef42a2e5dd.png)

![](/images/jueJin/164eaef54ecd330.png)

> HTTP Pipelining其实是把多个HTTP请求放到一个TCP连接中一一发送，而在发送过程中不需要等待服务器对前一个请求的响应；只不过，**客户端还是要按照发送请求的顺序来接收响应！**

* * *

> 就像在超市收银台或者银行柜台排队时一样，你并不知道前面的**顾客**是干脆利索的还是会跟收银员/柜员磨蹭到世界末日（不管怎么说，服务器（即收银员/柜员）是要按照顺序处理请求的，如果**前一个请求非常耗时（顾客磨蹭）**，那么后续请求都会受到影响。

*   在HTTP1.0中，发送一次请求时，需要**等待服务端响应了**才可以继续发送请求。
*   在HTTP1.1中，发送一次请求时，不需要等待服务端响应了就可以发送请求了，但是回送数据给客户端的时候，客户端还是需要按照**响应的顺序**来一一接收
*   所以说，无论是HTTP1.0还是HTTP1.1提出了Pipelining理论，还是会出现**阻塞**的情况。从专业的名词上说这种情况，叫做**线头阻塞**（Head of line blocking）简称：HOLB

### 2.1.3HTTP1.1和HTTP2区别

HTTP2与HTTP1.1最重要的区别就是**解决了线头阻塞的**问题！其中最重要的改动是：**多路复用 (Multiplexing)**

*   多路复用意味着线头阻塞将不在是一个问题，允许同时通过单一的 HTTP/2 连接发起**多重的请求-响应消息**，合并多个请求为一个的优化将不再适用。
    *   (我们知道：HTTP1.1中的Pipelining是没有付诸于实际的)，之前为了**减少**HTTP请求，有很多操作将多个请求合并，比如：Spriting(多个图片合成一个图片)，内联Inlining(将图片的原始数据嵌入在CSS文件里面的URL里），拼接Concatenation(一个请求就将其下载完多个JS文件)，分片Sharding(将请求分配到各个主机上)......

使用了HTTP2可能是这样子的：

![](/images/jueJin/164eaef547ad146.png)

HTTP2所有性能增强的核心在于**新的二进制分帧层**(不再以文本格式来传输了)，它定义了如何封装http消息并在客户端与服务器之间传输。

![](/images/jueJin/164eaef59a266e6.png)

看上去协议的格式和HTTP1.x完全不同了，**实际上HTTP2并没有改变HTTP1.x的语义**，只是把原来HTTP1.x的header和body部分用**frame重新封装了一层**而已

![](/images/jueJin/164eaef56ba56ba.png)

HTTP2连接上**传输的每个帧都关联到一个“流”**。流是一个独立的，双向的帧序列可以通过一个HTTP2的连接在服务端与客户端之间不断的交换数据。

![](/images/jueJin/164eaef56e3a513.png)

实际上运输时：

![](/images/jueJin/164eaef6f61bb59.png)

HTTP2还有一些比较重要的改动：

*   使用HPACK对HTTP/2头部压缩
*   服务器推送
    *   HTTP2推送资料：[segmentfault.com/a/119000001…](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000015773338 "https://segmentfault.com/a/1190000015773338")
*   流量控制
    *   针对传输中的**流**进行控制(TCP默认的粒度是针对连接)
*   流优先级（Stream Priority）它被用来告诉**对端哪个流更重要**。

2.2HTTP2总结
----------

HTTP1.1新改动：

*   **持久连接**
*   请求管道化
*   增加缓存处理（新的字段如cache-control）
*   增加Host字段、支持断点传输等

HTTP2新改动：

*   二进制分帧
*   **多路复用**
*   头部压缩
*   服务器推送

参考资料：

*   HTTP2 GitBook电子书(中文版)：[legacy.gitbook.com/book/ye11ow…](https://link.juejin.cn?target=https%3A%2F%2Flegacy.gitbook.com%2Fbook%2Fye11ow%2Fhttp2-explained%2Fdetails "https://legacy.gitbook.com/book/ye11ow/http2-explained/details")
*   HTTP/2.0 相比1.0有哪些重大改进？[www.zhihu.com/question/34…](https://link.juejin.cn?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F34074946 "https://www.zhihu.com/question/34074946")
*   HTTP/2 新特性浅析：[segmentfault.com/a/119000000…](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000002765886 "https://segmentfault.com/a/1190000002765886")
*   HTTP2学习资料：[imququ.com/post/http2-…](https://link.juejin.cn?target=https%3A%2F%2Fimququ.com%2Fpost%2Fhttp2-resource.html "https://imququ.com/post/http2-resource.html")
*   HTTP2简介和基于HTTP2的Web优化：[caibaojian.com/toutiao/664…](https://link.juejin.cn?target=http%3A%2F%2Fcaibaojian.com%2Ftoutiao%2F6641 "http://caibaojian.com/toutiao/6641")
*   http2原理入门：[blog.qingf.me/?p=600](https://link.juejin.cn?target=https%3A%2F%2Fblog.qingf.me%2F%3Fp%3D600 "https://blog.qingf.me/?p=600")
*   HTTP/2 对现在的网页访问，有什么大的优化呢？体现在什么地方？[www.zhihu.com/question/24…](https://link.juejin.cn?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F24774343%2Fanswer%2F96586977 "https://www.zhihu.com/question/24774343/answer/96586977")
*   HTTP/2笔记之流和多路复用：[www.blogjava.net/yongboy/arc…](https://link.juejin.cn?target=http%3A%2F%2Fwww.blogjava.net%2Fyongboy%2Farchive%2F2015%2F03%2F19%2F423611.aspx "http://www.blogjava.net/yongboy/archive/2015/03/19/423611.aspx")

2.3HTTPS再次回顾
------------

之前在面试的时候被问到了HTTPS，SSL这样的知识点，也没答上来，这里也简单整理一下。

首先还是来解释一下基础的东东：

*   对称加密：
    *   加密和解密都是用同一个密钥
*   非对称加密：
    *   加密用公开的密钥，解密用私钥
    *   (私钥只有自己知道，公开的密钥大家都知道)
*   数字签名：
    *   验证传输的内容**是对方发送的数据**
    *   发送的数据**没有被篡改过**
*   数字证书（Certificate Authority）简称CA
    *   认证机构证明是**真实的服务器发送的数据**。

3y的通讯之路：

*   远古时代：3y和女朋友聊天传输数据之间没有任何的加密，直接传输
    *   内容被看得一清二楚，毫无隐私可言
*   上古时期：使用对称加密的方式来保证传输的数据只有两个人知道
    *   此时有个问题：**密钥不能通过网络传输**(因为没有加密之前，都是不安全的)，所以3y和女朋友先约见面一次，告诉对方密码是多少，再对话聊天。
*   中古时期：3y不单单要跟女朋友聊天，还要跟爸妈聊天的哇(同样不想泄漏了自己的通讯信息)。那有那么多人，难道每一次都要约来见面一次吗？(说明维护多个对称密钥是麻烦的！)--->所以用到了非对称加密
    *   3y自己保留一份密码，独一无二的(私钥)。告诉3y女朋友，爸妈一份密码(这份密码是公开的，谁都可以拿--->公钥)。让他们给我发消息之前，先用那份我告诉他们的密码加密一下，再发送给我。我收到信息之后，用自己独一无二的私钥解密就可以了！
*   近代：此时又出现一个问题：虽然别人不知道私钥是什么，拿不到你**原始传输**的数据，但是可以拿到加密后的数据，他们可以**改掉**某部分的数据再发送给服务器，这样服务器拿到的数据就**不是完整的**了。
    *   3y女朋友给3y发了一条信息”3y我喜欢你“，然后用3y给的公钥加密，发给3y了。此时不怀好意的人截取到这条加密的信息，他**破解不了原信息**。但是他可以**修改加密后的数据**再传给3y。可能3y拿到收到的数据就是”3y你今晚跪键盘吧“
*   现代：拿到的数据可能被篡改了，我们可以使用数字签名来解决被篡改的问题。数字签名其实也可以看做是**非对称加密的手段一种**，具体是这样的：得到原信息hash值，用**私钥**对hash值加密，**另一端**用**公钥**解密，最后比对hash值是否变了。如果变了就说明被篡改了。(一端用私钥加密，另一端用公钥解密，也确保了来源)
*   目前现在：好像使用了数字签名就万无一失了，其实还有问题。我们使用非对称加密的时候，是使用**公钥进行加密的**。如果**公钥被伪造了**，后面的数字签名其实就毫无意义了。讲到底：**还是可能会被中间人攻击**~此时我们就有了**CA认证机构来确认公钥的真实性**！

对于数字签名和CA认证还是不太了解参考一下

*   阮一峰：[www.ruanyifeng.com/blog/2011/0…](https://link.juejin.cn?target=http%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2011%2F08%2Fwhat_is_a_digital_signature.html "http://www.ruanyifeng.com/blog/2011/08/what_is_a_digital_signature.html")
*   什么是数字签名和证书？[www.jianshu.com/p/9db57e761…](https://link.juejin.cn?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2F9db57e761255 "https://www.jianshu.com/p/9db57e761255")

* * *

回到我们的HTTPS，HTTPS其实就是在HTTP协议下多加了一层SSL协议(ps:现在都用TLS协议了)

![](/images/jueJin/164eaef6f19089b.png)

HTTPS采用的是**混合方式加密**：

![](/images/jueJin/164eaef6f887edd.png)

过程是这样子的：

![](/images/jueJin/164eaef6f890c6e.png)

![](/images/jueJin/164eaef684f2cad.png)

*   用户向web服务器发起一个安全连接的请求
*   服务器返回经过CA认证的数字证书，证书里面包含了服务器的public key(公钥)
*   用户拿到数字证书，用自己浏览器内置的CA证书解密得到服务器的public key
*   用户用服务器的public key加密一个用于接下来的对称加密算法的密钥，传给web服务器
    *   因为只有服务器有private key可以解密，所以**不用担心中间人拦截这个加密的密钥**
*   服务器拿到这个加密的密钥，解密获取密钥，再使用对称加密算法，和用户完成接下来的网络通信

![](/images/jueJin/164eaef6b98d8a8.png)

所以相比HTTP，HTTPS 传输更加安全

*   （1） 所有信息都是加密传播，黑客无法窃听。
*   （2） 具有校验机制，一旦被篡改，通信双方会立刻发现。
*   （3） 配备身份证书，防止身份被冒充。

参考资料：

*   数字签名、数字证书、SSL、https是什么关系？[www.zhihu.com/question/52…](https://link.juejin.cn?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F52493697%2Fanswer%2F131015846 "https://www.zhihu.com/question/52493697/answer/131015846")
*   浅谈SSL/TLS工作原理：[zhuanlan.zhihu.com/p/36981565](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F36981565 "https://zhuanlan.zhihu.com/p/36981565")
*   HTTPS:[tech.upyun.com/article/192…](https://link.juejin.cn?target=https%3A%2F%2Ftech.upyun.com%2Farticle%2F192%2FHTTPS%25E7%25B3%25BB%25E5%2588%2597%25E5%25B9%25B2%25E8%25B4%25A7%25EF%25BC%2588%25E4%25B8%2580%25EF%25BC%2589%25EF%25BC%259AHTTPS%2520%25E5%258E%259F%25E7%2590%2586%25E8%25AF%25A6%25E8%25A7%25A3.html "https://tech.upyun.com/article/192/HTTPS%E7%B3%BB%E5%88%97%E5%B9%B2%E8%B4%A7%EF%BC%88%E4%B8%80%EF%BC%89%EF%BC%9AHTTPS%20%E5%8E%9F%E7%90%86%E8%AF%A6%E8%A7%A3.html")
*   网站HTTP升级HTTPS完全配置手册：[www.cnblogs.com/powertoolst…](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fpowertoolsteam%2Fp%2Fhttp2https.html "https://www.cnblogs.com/powertoolsteam/p/http2https.html")

三、总结
====

我只是在学习的过程中，把自己遇到的问题写出来，整理出来，希望可以对大家有帮助。如果文章有错的地方，希望大家可以在评论区指正，一起学习交流~

参考资料：

*   《图解HTTP》

> 如果文章有错的地方欢迎指正，大家互相交流。习惯在微信看技术文章，想要获取更多的Java资源的同学，可以**关注微信公众号:Java3y**。

**文章的目录导航**：

*   [zhongfucheng.bitcron.com/post/shou-j…](https://link.juejin.cn?target=https%3A%2F%2Fzhongfucheng.bitcron.com%2Fpost%2Fshou-ji%2Fwen-zhang-dao-hang "https://zhongfucheng.bitcron.com/post/shou-ji/wen-zhang-dao-hang")