---
author: "Gaby"
title: "解读 HTTP1HTTP2HTTP3"
date: 2021-08-11
description: "解读 HTTP1HTTP2HTTP3，HTTP2 相比于 HTTP11，大幅提高了网页性能，升级该协议就可以减少之前需要做的性能优化工作，虽然如此但还是存在一定问题所以才推动HTTP3的诞生"
tags: ["前端","HTTP中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读17分钟"
weight: 1
selfDefined:"likes:409,comments:20,collects:851,views:33908,"
---
**这是我参与8月更文挑战的第9天，活动详情查看：[8月更文挑战](https://juejin.cn/post/6987962113788493831 "https://juejin.cn/post/6987962113788493831")**

HTTP/2 相比于 HTTP/1.1，可以说是大幅度提高了网页的性能，只需要升级到该协议就可以减少很多之前需要做的性能优化工作，虽然如此但HTTP/2并非完美的，HTTP/3 就是为了解决 HTTP/2 所存在的一些问题而被推出来的。

### **HTTP1.1 的缺陷**

1.  高延迟 — 队头阻塞(Head-Of-Line Blocking)
2.  无状态特性 — 阻碍交互
3.  明文传输 — 不安全性
4.  不支持服务端推送

#### 1、高延迟--带来页面加载速度的降低

虽然近年来网络带宽增长非常快，然而我们却并没有看到网络延迟有相应程度的降低。**网络延迟问题主要由于队头阻塞(Head-Of-Line Blocking),导致带宽无法被充分利用**。

`队头阻塞`是指当顺序发送的请求序列中的一个请求因为某种原因被阻塞时，在后面排队的所有请求也一并被阻塞，会导致客户端迟迟收不到数据。针对队头阻塞,人们尝试过以下办法来解决:

*   `将同一页面的资源分散到不同域名下，提升连接上限`。 **Chrome有个机制，对于同一个域名，默认允许同时建立 6 个 TCP持久连接**，使用持久连接时，虽然能公用一个TCP管道，**但是在一个管道中同一时刻只能处理一个请求**，在当前的请求没有结束之前，其他的请求只能处于阻塞状态。另外如果在同一个域名下同时有10个请求发生，那么其中4个请求会进入排队等待状态，直至进行中的请求完成。
*   `合并小文件减少资源数`。精灵图，Spriting合并多张小图为一张大图,再用JavaScript或者CSS将小图重新“切割”出来的技术。
*   `内联(Inlining)资源`是另外一种防止发送很多小图请求的技巧，将图片的原始数据嵌入在CSS文件里面的URL里，减少网络请求次数。
*   `减少请求数量`。拼接(Concatenation)将多个体积较小的JavaScript使用webpack等工具打包成1个体积更大的JavaScript文件,但如果其中1个文件的改动就会导致大量数据被重新下载多个文件。

#### 2、无状态特性--带来的巨大HTTP头部

`无状态是指协议对于连接状态没有记忆能力`。纯净的 HTTP 是没有 cookie 等机制的，每一个连接都是一个新的连接。

由于报文Header一般会携带"User Agent""Cookie""Accept""Server"等许多固定的头字段（如下图），多达几百字节甚至上千字节，但Body却经常只有几十字节（比如GET请求、204/301/304响应），成了不折不扣的“大头儿子”。`Header里携带的内容过大，在一定程度上增加了传输的成本`。更要命的是，请求响应报文里有大量字段值都是重复的，非常浪费。

#### 3、明文传输--带来的不安全性

HTTP/1.1在传输数据时，所有`传输的内容都是明文`，客户端和服务器端都无法验证对方的身份，这在一定程度上无法保证数据的安全性。

#### 4、不支持服务器推送消息

### SPDY 协议与 HTTP/2 简介

#### 1、SPDY 协议

上面我们提到,由于HTTP/1.x的缺陷，我们会引入雪碧图、将小图内联、使用多个域名等等的方式来提高性能。不过这些优化都绕开了协议，直到2009年，谷歌公开了自行研发的 SPDY 协议，主要解决HTTP/1.1效率不高的问题。谷歌推出SPDY，才算是正式改造HTTP协议本身。降低延迟，压缩header等等，SPDY的实践证明了这些优化的效果，也最终带来HTTP/2的诞生。

![image.png](/images/jueJin/b2da6b75d6164a6.png)

**HTTP/1.1有两个主要的缺点：** **安全不足和性能不高**，由于背负着 HTTP/1.x 庞大的历史包袱,所以协议的修改,兼容性是首要考虑的目标，否则就会破坏互联网上无数现有的资产。如上图所示,SPDY位于HTTP之下，TCP和SSL之上，这样可以轻松兼容老版本的HTTP协议(将HTTP1.x的内容封装成一种新的frame格式)，同时可以使用已有的SSL功能。

SPDY 协议在Chrome浏览器上证明可行以后，就被当作 HTTP/2 的基础，主要特性都在 HTTP/2 之中得到继承。

#### 2、HTTP/2 简介

2015年，HTTP/2 发布。HTTP/2是现行HTTP协议（HTTP/1.x）的替代，但它不是重写，HTTP方法/状态码/语义都与HTTP/1.x一样。**HTTP/2基于SPDY，专注于性能，最大的一个目标是在用户和网站间只用一个连接（connection）** 。从目前的情况来看，国内外一些排名靠前的站点基本都实现了HTTP/2的部署，使用HTTP/2能带来20%~60%的效率提升。

HTTP/2由两个规范（Specification）组成：

1.  Hypertext Transfer Protocol version 2 - RFC7540
2.  HPACK - Header Compression for HTTP/2 - RFC7541

### HTTP/2 新特性

#### 1、二进制传输

**HTTP/2传输数据量的大幅减少,主要有两个原因:以二进制方式传输和Header 压缩**。我们先来介绍二进制传输,HTTP/2 采用二进制格式传输数据，而非HTTP/1.x 里纯文本形式的报文 ，二进制协议解析起来更高效。**HTTP/2 将请求和响应数据分割为更小的帧，并且它们采用二进制编码**。

它把TCP协议的部分特性挪到了应用层，把原来的"Header+Body"的消息"打散"为数个小片的二进制"帧"(Frame),用"HEADERS"帧存放头数据、"DATA"帧存放实体数据。HTP/2数据分帧后"Header+Body"的报文结构就完全消失了，协议看到的只是一个个的"碎片"。

![image.png](/images/jueJin/ab507c4944614ad.png)

HTTP/2 中，同域名下所有通信都在单个连接上完成，该连接可以承载任意数量的双向数据流。每个数据流都以消息的形式发送，而消息又由一个或多个帧组成。**多个帧之间可以乱序发送，根据帧首部的流标识可以重新组装**。

#### 2、Header 压缩

HTTP/2并没有使用传统的压缩算法，而是开发了专门的"HPACK”算法，在客户端和服务器两端建立“字典”，用索引号表示重复的字符串，还采用哈夫曼编码来压缩整数和字符串，可以达到50%~90%的高压缩率。

具体来说:

*   在客户端和服务器端使用“首部表”来跟踪和存储之前发送的键-值对，对于相同的数据，不再通过每次请求和响应发送；
*   首部表在HTTP/2的连接存续期内始终存在，由客户端和服务器共同渐进地更新;
*   每个新的首部键-值对要么被追加到当前表的末尾，要么替换表中之前的值

例如下图中的两个请求， 请求一发送了所有的头部字段，第二个请求则只需要发送差异数据，这样可以减少冗余数据，降低开销

![](/images/jueJin/5ba24e56c7c84bf.png)

#### 3、多路复用

在 HTTP/2 中引入了多路复用的技术。多路复用很好的解决了浏览器限制同一个域名下的请求数量的问题，同时也接更容易实现全速传输，毕竟新开一个 TCP 连接都需要慢慢提升传输速度。

大家可以通过 该链接 直观感受下 HTTP/2 比 HTTP/1 到底快了多少。

![](/images/jueJin/b2f7d14013604bc.png)

在 HTTP/2 中，有了二进制分帧之后，HTTP /2 不再依赖 TCP 链接去实现多流并行了，在 HTTP/2中:

*   同域名下所有通信都在单个连接上完成。
*   单个连接可以承载任意数量的双向数据流。
*   数据流以消息的形式发送，而消息又由一个或多个帧组成，多个帧之间可以乱序发送，因为根据帧首部的流标识可以重新组装。

这一特性，使性能有了极大提升：

*   同个域名只需要占用一个 TCP 连接，使用一个连接并行发送多个请求和响应,这样整个页面资源的下载过程只需要一次慢启动，同时也避免了多个TCP连接竞争带宽所带来的问题。
*   并行交错地发送多个请求/响应，请求/响应之间互不影响。
*   在HTTP/2中，每个请求都可以带一个31bit的优先值，0表示最高优先级， 数值越大优先级越低。有了这个优先值，客户端和服务器就可以在处理不同的流时采取不同的策略，以最优的方式发送流、消息和帧。

![image.png](/images/jueJin/42967e5085aa431.png)

如上图所示，多路复用的技术可以只通过一个 TCP 连接就可以传输所有的请求数据。

#### 4、Server Push

HTTP2还在一定程度上改变了传统的“请求-应答”工作模式，服务器不再是完全被动地响应请求，也可以新建“流”主动向客户端发送消息。比如，在浏览器刚请求HTML的时候就提前把可能会用到的JS、CSS文件发给客户端，减少等待的延迟，这被称为"`服务器推送`"（ Server Push，也叫 Cache push）

例如下图所示,服务端主动把JS和CSS文件推送给客户端，而不需要客户端解析HTML时再发送这些请求。

![image.png](/images/jueJin/823be25b46a745a.png)

![](/images/jueJin/8ea98bbf7296407.png)

另外需要补充的是,服务端可以主动推送，客户端也有权利选择是否接收。如果服务端推送的资源已经被浏览器缓存过，浏览器可以通过发送RST\_STREAM帧来拒收。主动推送也遵守同源策略，换句话说，服务器不能随便将第三方资源推送给客户端，而必须是经过双方确认才行。

#### 5、提高安全性

出于兼容的考虑，HTTP/2延续了HTTP/1的“明文”特点，可以像以前一样使用明文传输数据，不强制使用加密通信，不过格式还是二进制，只是不需要解密。

但由于HTTPS已经是大势所趋，而且主流的浏览器Chrome、Firefox等都公开宣布只支持加密的HTTP/2，**所以“事实上”的HTTP/2是加密的**。也就是说，互联网上通常所能见到的HTTP/2都是使用"https”协议名，跑在TLS上面。HTTP/2协议定义了两个字符串标识符：“h2"表示加密的HTTP/2，“h2c”表示明文的HTTP/2。

![](/images/jueJin/9c1e1d4bd4c8404.png)

### HTTP/2 的缺点

虽然 HTTP/2 解决了很多之前旧版本的问题，但是它还是存在一个巨大的问题，**主要是底层支撑的 TCP 协议造成的**。HTTP/2的缺点主要有以下几点：

1.  TCP 以及 TCP+TLS 建立连接的延时
2.  TCP 的队头阻塞并没有彻底解决
3.  多路复用导致服务器压力上升
4.  多路复用容易 Timeout

#### **建连延时**

HTTP/2都是使用TCP协议来传输的，而如果使用HTTPS的话，还需要使用TLS协议进行安全传输，而使用TLS也需要一个握手过程，**这样就需要有两个握手延迟过程**：

①在建立TCP连接的时候，需要和服务器进行三次握手来确认连接成功，即需要消耗完 1.5 个 RTT 之后才能进行数据传输。

②进行TLS连接，TLS有两个版本——TLS1.2和TLS1.3，每个版本建立连接所花的时间不同，大致是需要1~2个RTT。

总之，在传输数据之前，我们需要花掉 3～4 个 RTT。

`RTT（Round-Trip Time）`:  
往返时延。表示从发送端发送数据开始，到发送端收到来自接收端的确认（接收端收到数据后便立即发送确认），总共经历的时延。

#### **队头阻塞没有彻底解决**

上文我们提到在HTTP/2中，多个请求是跑在一个TCP管道中的。但当出现了丢包时，HTTP/2 的表现反倒不如 HTTP/1 了。因为TCP为了保证可靠传输，有个特别的“`丢包重传`”机制，`丢失的包必须要等待重新传输确认`，HTTP/2出现丢包时，整个 TCP 都要开始等待重传，那么就会阻塞该TCP连接中的所有请求（如下图）。而对于 HTTP/1.1 来说，可以开启多个 TCP 连接，出现这种情况反到只会影响其中一个连接，剩余的 TCP 连接还可以正常传输数据。

![](/images/jueJin/bbd16a3d3b3b47b.png)

![image.png](/images/jueJin/4d05c9beabec44d.png)

RTO：英文全称是 Retransmission TimeOut，即重传超时时间； RTO 是一个动态值，会根据网络的改变而改变。RTO 是根据给定连接的往返时间 RTT 计算出来的。 接收方返回的 ack 是希望收到的下一组包的序列号。

可能就会有人考虑为什么不直接去修改 TCP 协议？其实这已经是一件不可能完成的任务了。因为 TCP 存在的时间实在太长，已经充斥在各种设备中，并且这个协议是由操作系统实现的，更新起来不大现实。

#### 多路复用导致服务器压力上升

多路复用没有限制同时请求数。请求的平均数量与往常相同，但实际会有许多请求的短暂爆发，导致瞬时 QPS 暴增。

#### 多路复用容易 Timeout

大批量的请求同时发送，由于 HTTP2 连接内存在多个并行的流，而网络带宽和服务器资源有限，每个流的资源会被稀释，虽然它们开始时间相差更短，但却都可能超时。

即使是使用 Nginx 这样的负载均衡器，想正确进行节流也可能很棘手。 其次，就算你向应用程序引入或调整排队机制，但一次能处理的连接也是有限的。如果对请求进行排队，还要注意在响应超时后丢弃请求，以避免浪费不必要的资源。[引用](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fwww.lucidchart.com%2Ftechblog%2F2019%2F04%2F10%2Fwhy-turning-on-http2-was-a-mistake%2F "https://link.zhihu.com/?target=https%3A//www.lucidchart.com/techblog/2019/04/10/why-turning-on-http2-was-a-mistake/")

### HTTP/3 新特性

#### 1、HTTP/3简介

Google 在推SPDY的时候就已经意识到了这些问题，于是就另起炉灶搞了一个基于 UDP 协议的“QUIC”协议，让HTTP跑在QUIC上而不是TCP上。而这个“HTTP over QUIC”就是HTTP协议的下一个大版本，HTTP/3。它在HTTP/2的基础上又实现了质的飞跃，真正“完美”地解决了“队头阻塞”问题。

![](/images/jueJin/45902f7b5cc541b.png)

QUIC 虽然基于 UDP，但是在原本的基础上新增了很多功能，接下来我们重点介绍几个QUIC新功能。不过HTTP/3目前还处于草案阶段，正式发布前可能会有变动，所以本文尽量不涉及那些不稳定的细节。

#### 2、QUIC新功能

上面我们提到QUIC基于UDP，而UDP是“无连接”的，根本就不需要“握手”和“挥手”，所以就比TCP来得快。此外QUIC也实现了可靠传输，保证数据一定能够抵达目的地。它还引入了类似HTTP/2的“流”和“多路复用”，单个“流"是有序的，可能会因为丢包而阻塞，但其他“流”不会受到影响。具体来说QUIC协议有以下特点：

*   **实现了类似TCP的流量控制、传输可靠性的功能**
    
    虽然UDP不提供可靠性的传输，但QUIC在UDP的基础之上增加了一层来保证数据可靠性传输。它提供了数据包重传、拥塞控制以及其他一些TCP中存在的特性。
    
    QUIC 协议到底改进在哪些方面呢？主要有如下几点：
    
    1.  可插拔 — 应用程序层面就能实现不同的拥塞控制算法。
    2.  单调递增的 Packet Number — 使用 Packet Number 代替了 TCP 的 seq。
    3.  不允许 Reneging — 一个 Packet 只要被 Ack，就认为它一定被正确接收。
    4.  前向纠错（FEC）
    5.  更多的 Ack 块和增加 Ack Delay 时间。
    6.  基于 stream 和 connection 级别的流量控制。
*   **实现了快速握手功能**
    
    由于QUIC是基于UDP的，所以QUIC可以实现使用0-RTT或者1-RTT来建立连接，这意味着QUIC可以用最快的速度来发送和接收数据，这样可以大大提升首次打开页面的速度。**0RTT 建连可以说是 QUIC 相比 HTTP2 最大的性能优势**。
    
*   **集成了TLS加密功能**
    
    目前QUIC使用的是TLS1.3，相较于早期版本TLS1.3有更多的优点，其中最重要的一点是减少了握手所花费的RTT个数。
    
    在完全握手情况下，需要 1-RTT 建立连接。 TLS1.3 恢复会话可以直接发送加密后的应用数据，不需要额外的 TLS 握手，也就是 0-RTT。
    
    但是 TLS1.3 也并不完美。TLS 1.3 的 0-RTT 无法保证前向安全性(Forward secrecy)。简单讲就是，如果当攻击者通过某种手段获取到了 Session Ticket Key，那么该攻击者可以解密以前的加密数据。
    
    要缓解该问题可以通过设置使得与 Session Ticket Key 相关的 DH 静态参数在短时间内过期（一般几个小时）。
    
*   **多路复用，彻底解决TCP中队头阻塞的问题**
    
    和TCP不同，QUIC实现了在同一物理连接上可以有多个独立的逻辑数据流（如下图）。实现了数据流的单独传输，就解决了TCP中队头阻塞的问题。
    

![](/images/jueJin/9e114f32c7404a4.png)

*   **连接迁移**
    
    TCP 是按照 4 要素（客户端 IP、端口, 服务器 IP、端口）确定一个连接的。而 QUIC 则是让客户端生成一个 Connection ID （64 位）来区别不同连接。只要 Connection ID 不变，连接就不需要重新建立，即便是客户端的网络发生变化。由于迁移客户端继续使用相同的会话密钥来加密和解密数据包，QUIC 还提供了迁移客户端的自动加密验证。
    

### 总结

*   HTTP/1.1有两个主要的缺点：安全不足和性能不高。
*   HTTP/2完全兼容HTTP/1，是“更安全的HTTP、更快的HTTPS"，二进制传输、头部压缩、多路复用、服务器推送等技术可以充分利用带宽，降低延迟，从而大幅度提高上网体验；
*   QUIC 基于 UDP 实现，是 HTTP/3 中的底层支撑协议，该协议基于 UDP，又取了 TCP 中的精华，实现了即快又可靠的协议。

### 面试题 http2 与 http1.1 区别，了解 http3 么，说说；

答案嘛，既然看了本文，那就试着总结下吧，加深下记忆！！！

**参考资料**
--------

1.  [http2.0 原理详细分析](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fwww.huaijiujia.com%2F2018%2F06%2F30%2Fhttp%2525E5%25258D%25258F%2525E8%2525AE%2525AE-http2-0%2525E5%25258E%25259F%2525E7%252590%252586%2525E8%2525AF%2525A6%2525E7%2525BB%252586%2525E5%252588%252586%2525E6%25259E%252590%2F "https://link.zhihu.com/?target=https%3A//www.huaijiujia.com/2018/06/30/http%25E5%258D%258F%25E8%25AE%25AE-http2-0%25E5%258E%259F%25E7%2590%2586%25E8%25AF%25A6%25E7%25BB%2586%25E5%2588%2586%25E6%259E%2590/")
2.  [HPACK: HTTP/2 里的沉默杀手](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fwww.zcfy.cc%2Farticle%2Fhpack-the-silent-killer-feature-of-http-2-1969.html "https://link.zhihu.com/?target=https%3A//www.zcfy.cc/article/hpack-the-silent-killer-feature-of-http-2-1969.html")
3.  [QPACK：HTTP /3 的头压缩](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fquicwg.org%2Fbase-drafts%2Fdraft-ietf-quic-qpack.html "https://link.zhihu.com/?target=https%3A//quicwg.org/base-drafts/draft-ietf-quic-qpack.html")
4.  [DH 算法](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fzh.wikipedia.org%2Fwiki%2F%2525E8%2525BF%2525AA%2525E8%25258F%2525B2-%2525E8%2525B5%2525AB%2525E7%252588%2525BE%2525E6%25259B%2525BC%2525E5%2525AF%252586%2525E9%252591%2525B0%2525E4%2525BA%2525A4%2525E6%25258F%25259B "https://link.zhihu.com/?target=https%3A//zh.wikipedia.org/wiki/%25E8%25BF%25AA%25E8%258F%25B2-%25E8%25B5%25AB%25E7%2588%25BE%25E6%259B%25BC%25E5%25AF%2586%25E9%2591%25B0%25E4%25BA%25A4%25E6%258F%259B")
5.  [前向安全（ForwardSecrecy）](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fzh.wikipedia.org%2Fwiki%2F%2525E5%252589%25258D%2525E5%252590%252591%2525E4%2525BF%25259D%2525E5%2525AF%252586 "https://link.zhihu.com/?target=https%3A//zh.wikipedia.org/wiki/%25E5%2589%258D%25E5%2590%2591%25E4%25BF%259D%25E5%25AF%2586")
6.  [TLS 1.3 VS TLS 1.2，让你明白 TLS 1.3 的强大](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fwww.jianshu.com%2Fp%2Fefe44d4a7501 "https://link.zhihu.com/?target=https%3A//www.jianshu.com/p/efe44d4a7501")
7.  [CaddyWeb 服务器 QUIC 部署](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fwww.wolfcstech.com%2F2017%2F01%2F09%2FCaddy%252520Web%2525E6%25259C%25258D%2525E5%25258A%2525A1%2525E5%252599%2525A8QUIC%2525E9%252583%2525A8%2525E7%2525BD%2525B2%2F "https://link.zhihu.com/?target=https%3A//www.wolfcstech.com/2017/01/09/Caddy%2520Web%25E6%259C%258D%25E5%258A%25A1%25E5%2599%25A8QUIC%25E9%2583%25A8%25E7%25BD%25B2/")
8.  [关于 QUIC 的各种尝试](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fdebug.fanzheng.org%2Fpost%2Fabout-quic.html%2523toc-3b3 "https://link.zhihu.com/?target=https%3A//debug.fanzheng.org/post/about-quic.html%23toc-3b3")
9.  [使用 QUIC 协议实现实时视频直播 0 卡顿](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F33902646 "https://zhuanlan.zhihu.com/p/33902646")
10.  [解密 HTTP/2 与 HTTP/3 的新特性](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fwww.infoq.cn%2Farticle%2FkU4OkqR8vH123a8dLCCJ "https://link.zhihu.com/?target=https%3A//www.infoq.cn/article/kU4OkqR8vH123a8dLCCJ")
11.  [Web通信协议，你还需要知道： SPDY 和 QUIC](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fsegmentfault.com%2Fa%2F1190000016265991 "https://link.zhihu.com/?target=https%3A//segmentfault.com/a/1190000016265991")
12.  [如何看待 HTTP/3 ？](https://link.juejin.cn?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F302412059 "https://www.zhihu.com/question/302412059")

* * *

**如果这篇文章帮到了你，记得点赞👍收藏加关注哦😊，希望点赞多多多多...**

**文中如有错误，欢迎在评论区指正**