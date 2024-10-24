---
author: "yck"
title: "17K star 仓库，关于网络相关的前端面试题 90% 都有答案"
date: 2021-04-28
description: "今天的文章从输入 URL 开始，和大家聊聊这其中前端工程师需要掌握的网络相关的内容，希望大家能有所收获。"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读26分钟"
weight: 1
selfDefined:"likes:499,comments:13,collects:653,views:22946,"
---
前言
--

笔者开源的前端进阶之道已有三年之久，至今也有 17k star，承蒙各位读者垂爱。在当下部分内容已经略微过时，因此决定提笔翻新内容。

翻新后的内容会全部集合在[「干爆前端」](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FKieSun%2Ffucking-frontend "https://github.com/KieSun/fucking-frontend")中，有兴趣的读者可以前往查看。

[![](/images/jueJin/33b5f724190f400.png)](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FKieSun%2Ffucking-frontend "https://github.com/KieSun/fucking-frontend")

**阅读前重要提示：**

**本文非百科全书，只专为面试复习准备、查漏补缺、深入某知识点的引子、了解相关面试题等准备。**

**笔者一直都是崇尚学会面试题底下涉及到的知识点，而不是刷一大堆面试题，结果变了个题型就不会的那种。所以本文和别的面经不一样，旨在提炼面试题底下的常用知识点，而不是甩一大堆面试题给各位看官。**

> 大家也可以在笔者的[网站](https://link.juejin.cn?target=https%3A%2F%2Fjsgodroad.com%2Finterview%2Fnetwork "https://jsgodroad.com/interview/network")上阅读，体验更佳！

姊妹篇：[17K star 仓库，解决 90% 的大厂基础面试题](https://link.juejin.cn?target=https%3A%2F%2Fjsgodroad.com%2Finterview%2Fjs "https://jsgodroad.com/interview/js")

今天的文章从输入 URL 开始，和大家聊聊这其中前端工程师**需要掌握的网络相关的内容**。

**注：输入 URL 到返回数据过程中会涉及到很多网络相关知识，笔者只会介绍前端工程师必须了解的那部分，其他的内容读者可以自行学习。**

当我们在浏览器中键入 URL：[www.google.com/](https://link.juejin.cn?target=https%3A%2F%2Fwww.google.com%2F "https://www.google.com/") 时，浏览器会先去寻找该域名所对应的 IP 地址，毕竟最终通信我们还是得用 IP 才能找到对方的地址，域名只是方便用户记忆的别名。

那么如何找到域名所对应的 IP 地址呢？接下来让笔者先来给大家介绍我们遇到的第一块内容： DNS。

DNS
---

DNS 的作用就是通过域名查询到具体的 IP。

因为 IP 存在数字和英文的组合（IPv6），很不利于人类记忆，所以就出现了域名。你可以把域名看成是某个 IP 的别名，DNS 就是去查询这个别名的真正名称是什么。

当你在浏览器中想访问 `www.google.com` 时，会通过进行以下操作：

1.  本地客户端向服务器发起请求查询 IP 地址
2.  查看浏览器有没有该域名的 IP 缓存
3.  查看操作系统有没有该域名的 IP 缓存
4.  查看 Host 文件有没有该域名的解析配置
5.  如果这时候还没得话，会通过直接去 DNS 根服务器查询，这一步查询会找出负责 `com` 这个一级域名的服务器
6.  然后去该服务器查询 `google.com` 这个二级域名
7.  接下来查询 `www.google.com` 这个三级域名的地址
8.  返回给 DNS 客户端并缓存起来

![image.png](/images/jueJin/12c074c5d6c843d.png) 以上介绍的是 DNS 递归查询，还有种是迭代查询，区别就是前者是由系统配置的 DNS 服务器做请求，得到结果后将数据返回给客户端；后者由客户端去做请求。

这时可能会有好奇的读者会问：DNS 在做解析的时候，向这些服务器发送的请求到底是基于 TCP 还是 UDP 协议的？

其实在当前的网络环境中，这两种协议都有用的。通过 UDP 去进行一些数据量少的请求，这时候能用到 UDP 性能快的优势；对于数据量大且需要保证数据完整有序的时候会选择用 TCP 去请求，保证数据的正确及完整性。

后续的内容中我们也会介绍 UDP 及 TCP 协议。

当浏览器获取域名的 IP 地址后，马上会通过 TCP 协议与服务器建立连接。接下来我们来聊聊 TCP 协议的内容。

TCP
---

TCP 建立连接需要进行三次握手：

![](/images/jueJin/f282ee8ae710407.png)

最开始两端都为 CLOSED 状态。在通信开始前，双方都会创建 TCB（一个数据结构，里面包含了协议需要的很多内容，有兴趣的可以自行了解）。 服务器创建完 TCB 后遍进入 LISTEN 状态，此时开始等待客户端发送数据。

**第一次握手**

客户端向服务端发送连接请求报文段(SYN)。该报文段中包含自身的数据通讯初始序号。请求发送后，客户端便进入 SYN-SENT 状态，`x` 表示客户端的数据通信初始序号。

**第二次握手**

服务端收到连接请求报文段后，如果同意连接，则会发送一个应答(ACK + SYN)，该应答中也会包含自身的数据通讯初始序号，发送完成后便进入 SYN-RECEIVED 状态。

**第三次握手**

当客户端收到连接同意的应答后，还要向服务端发送一个确认报文(ACK)。客户端发完这个报文段后便进入ESTABLISHED 状态，服务端收到这个应答后也进入 ESTABLISHED 状态，此时连接建立成功。

PS：第三次握手可以包含数据，通过 TCP 快速打开（TFO）技术。其实只要涉及到握手的协议，都可以使用类似 TFO 的方式，客户端和服务端存储相同 cookie，下次握手时发出 cookie 达到减少 RTT（一次请求来回的时间） 的目的。

**这里会有个经典面试题：为什么 TCP 需要三次而不是两次握手？**

因为这是为了防止失效的连接请求报文段被服务端接收，从而产生错误。

可以想象如下场景。客户端发送了一个连接请求 A，但是因为网络原因造成了超时，这时 TCP 会启动超时重传的机制再次发送一个连接请求 B。此时请求顺利到达服务端，服务端应答完就建立了请求。如果连接请求 A 在两端关闭后终于抵达了服务端，那么这时服务端会认为客户端又需要建立 TCP 连接，从而应答了该请求并进入 ESTABLISHED 状态。此时客户端其实是 CLOSED 状态，那么就会导致服务端一直等待，造成资源的浪费。

PS：在建立连接中，任意一端掉线，TCP 都会重发 SYN 包，一般会重试五次，在建立连接中可能会遇到 SYN FLOOD 攻击。遇到这种情况你可以选择调低重试次数或者干脆在不能处理的情况下拒绝请求。

当建立连接并请求完成后，TCP 连接并不会马上断开。得益于 HTTP 1.1 协议中的 keep-alive 属性，连接可以短暂的保留一段时间，具体如何断开得看服务端的设置或者客户端主动 close 掉。

一旦 close，TCP 协议就会进行四次握手来断开连接。

![](/images/jueJin/da58256797b2416.png)

**第一次握手**

若客户端 A 认为数据发送完成，则它需要向服务端 B 发送连接释放请求。

**第二次握手**

B 收到连接释放请求后，会告诉应用层要释放 TCP 链接。然后会发送 ACK 包，并进入 CLOSE\_WAIT 状态，表示 A 到 B 的连接已经释放，不接收 A 发的数据了。但是因为 TCP 连接时双向的，所以 B 仍旧可以发送数据给 A。

**第三次握手**

B 如果此时还有没发完的数据会继续发送，完毕后会向 A 发送连接释放请求，然后 B 便进入 LAST-ACK 状态。

PS：通过延迟确认的技术（通常有时间限制，否则对方会误认为需要重传），可以将服务端的第二次和第三次握手合并，延迟 ACK 包的发送。

**第四次握手**

A 收到释放请求后，向 B 发送确认应答，此时 A 进入 TIME-WAIT 状态。该状态会持续 2MSL（最大段生存期，指报文段在网络中生存的时间，超时会被抛弃） 时间，若该时间段内没有 B 的重发请求的话，就进入 CLOSED 状态。当 B 收到确认应答后，也便进入 CLOSED 状态。

**为什么 A 要进入 TIME-WAIT 状态，等待 2MSL 时间后才进入 CLOSED 状态？**

为了保证 B 能收到 A 的确认应答。若 A 发完确认应答后直接进入 CLOSED 状态，如果确认应答因为网络问题一直没有到达，那么会造成 B 不能正常关闭。

建立和断开连接涉及到的两种握手都是 TCP 中很重要的知识。当然除了这些内容之外，TCP 也还有很多东西我们需要学习，比如说 TCP 协议是如何实现有序且完整的传递数据，这其中涉及到的内容我们马上就会学到。

### ARQ 协议

首先我们先来学习 TCP 协议是如何实现完整送达数据的。毕竟网络波动及各种不确定因素的存在会导致数据传递发生丢失，一旦出现这种情况我们得确保协议有重传的机制。就好比我们在业务中上传某些重要数据一样，一次没收到响应或者发生别的情况时，会进行多次重试。

ARQ 协议也就是超时重传机制协议。通过确认和超时机制保证了数据的正确送达，其中包含停止等待 ARQ 和连续 ARQ 协议。

#### 停止等待 ARQ

**正常传输过程**

只要 A 向 B 发送一段报文，都要停止发送并启动一个定时器，等待对端回应，在定时器时间内接收到对端应答就取消定时器并发送下一段报文。

**出现错误时**

**1 .报文丢失或出错**

在报文传输的过程中可能会出现丢包。这时候超过定时器设定的时间就会再次发送丢包的数据直到对端响应，所以需要每次都备份发送的数据。

即使报文正常的传输到对端，也可能出现在传输过程中报文出错的问题。这时候对端会抛弃该报文并等待 A 端重传。

PS：一般定时器设定的时间都会大于一个 RTT 的平均时间。

**2\. ACK 超时或丢失**

对端传输的应答也可能出现丢失或超时的情况。那么超过定时器时间 A 端照样会重传报文。这时候 B 端收到相同序号的报文会丢弃该报文并重传应答，直到 A 端发送下一个序号的报文。

在超时的情况下也可能出现应答很迟到达，这时 A 端会判断该序号是否已经接收过，如果接收过只需要丢弃应答即可。

**这个协议的缺点就是传输效率低，在良好的网络环境下每次发送报文都得等待对端的 ACK 。**

#### 连续 ARQ

在连续 ARQ 中，发送端拥有一个发送窗口，可以在没有收到应答的情况下持续发送窗口内的数据，这样相比停止等待 ARQ 协议来说减少了等待时间，提高了效率。

**累计确认**

连续 ARQ 中，接收端会持续不断收到报文。如果和停止等待 ARQ 中接收一个报文就发送一个应答一样，就太浪费资源了。通过累计确认，可以在收到多个报文以后统一回复一个应答报文。报文中的 ACK 可以用来告诉发送端这个序号之前的数据已经全部接收到了，下次请发送这个序号 + 1的数据。

但是累计确认也有一个弊端。在连续接收报文时，可能会遇到接收到序号 5 的报文后，并未接到序号 6 的报文，然而序号 7 以后的报文已经接收。遇到这种情况时，ACK 只能回复 6，这样会造成发送端重复发送数据，这种情况下可以通过 Sack 来解决，这个会在下文说到。

### 滑动窗口

窗口这个概念在 TCP 中经常会看到，就比如我们在上面小节中讲到了发送窗口。在 TCP 中，两端都维护着窗口：分别为发送端窗口和接收端窗口。

发送端窗口包含已发送但未收到应答的数据和可以发送但是未发送的数据。

![](/images/jueJin/b35386488bd04e1.png)

发送端窗口大小是由接收窗口剩余大小决定的。接收方会把当前接收窗口的剩余大小写入应答报文，发送端收到应答后根据该值和当前网络拥塞情况设置发送窗口的大小，所以发送窗口的大小是不断变化的。

当发送端接收到应答报文后，会随之将窗口进行滑动

![](/images/jueJin/a42f51ed58ec42e.png)

刷过算法的同学看到这两张图应该会很熟悉，毕竟滑动窗口在算法中也是一类高频题目。

滑动窗口实现了流量控制。接收方通过报文告知发送方还可以发送多少数据，从而保证接收方能够来得及接收数据。

#### Zero 窗口

在发送报文的过程中，可能会遇到对端出现零窗口的情况。在该情况下，发送端会停止发送数据，并启动 persistent timer 。该定时器会定时发送请求给对端，让对端告知窗口大小。在重试次数超过一定次数后，可能会中断 TCP 链接。

### 拥塞处理

拥塞处理是 TCP 中作用很大的功能模块，主要通过一些算法来控制数据的传输，防止拥塞网络。

拥塞处理和流量控制不同，后者是作用于接收方，保证接收方来得及接受数据。而前者是作用于网络，防止过多的数据拥塞网络，避免出现网络负载过大的情况。

拥塞处理包括了四个算法，分别为：慢开始，拥塞避免，快速重传，快速恢复。

#### 慢开始算法

慢开始算法，顾名思义，就是在传输开始时将发送窗口慢慢指数级扩大，从而避免一开始就传输大量数据导致网络拥塞。举个例子在日常下载时，我们的下载网速都是逐渐变快的。

慢开始算法步骤具体如下：

1.  连接初始设置拥塞窗口（Congestion Window） 为 1 MSS（一个分段的最大数据量）
2.  每过一个 RTT 就将窗口大小乘二
3.  指数级增长肯定不能没有限制的，所以有一个阈值限制，当窗口大小大于阈值时就会启动拥塞避免算法。

#### 拥塞避免算法

拥塞避免算法相比简单点，每过一个 RTT 窗口大小只加一，这样能够避免指数级增长导致网络拥塞，慢慢将大小调整到最佳值。

在传输过程中如果协议认为网络拥塞了，会马上进行以下步骤：

*   将阈值设为当前拥塞窗口的一半
*   将拥塞窗口设为 1 MSS
*   启动拥塞避免算法

#### 快速重传

快速重传一般和快恢复一起出现。一旦接收端收到的报文出现失序的情况，接收端只会回复最后一个顺序正确的报文序号（没有 Sack 的情况下）。如果收到三个重复的 ACK，说明发送端传过去的数据对端都没有收到，此时会启动快速重传。主要算法为：

**TCP Reno**

*   拥塞窗口减半
*   将阈值设为当前拥塞窗口
*   进入快恢复阶段（重发对端需要的包，一旦收到一个新的 ACK 答复就退出该阶段）
*   使用拥塞避免算法

#### TCP New Ren 改进后的快恢复

**TCP New Reno** 算法改进了之前 **TCP Reno** 算法的缺陷。在之前，快恢复中只要收到一个新的 ACK 包，就会退出快恢复。

在 **TCP New Reno** 中，TCP 发送方先记下三个重复 ACK 的分段的最大序号。

假如我有一个分段数据是 1 ~ 10 这十个序号的报文，其中丢失了序号为 3 和 7 的报文，那么该分段的最大序号就是 10。发送端只会收到 ACK 序号为 3 的应答。这时候重发序号为 3 的报文，接收方顺利接收并会发送 ACK 序号为 7 的应答。这时候 TCP 知道对端是有多个包未收到，会继续发送序号为 7 的报文，接收方顺利接收并会发送 ACK 序号为 11 的应答，这时发送端认为这个分段接收端已经顺利接收，接下来会退出快恢复阶段。

说完了 TCP 协议，我们再来聊聊它的兄弟协议 UDP 吧。因为 UDP 相对 TCP 功能简单，因此涉及到的知识并不多。

UDP
---

### 面向报文

UDP 是一个面向报文（报文可以理解为一段段的数据）的协议。意思就是 UDP 只是报文的搬运工，不会对报文进行任何拆分和拼接操作。TCP 协议就会这样干，毕竟得保证报文的有序。

具体来说：

*   在发送端，应用层将数据传递给传输层的 UDP 协议，UDP 只会给数据增加一个 UDP 头标识下是 UDP 协议，然后就传递给网络层了
*   在接收端，网络层将数据传递给传输层，UDP 只去除 IP 报文头就传递给应用层，不会任何拼接操作

由于 UDP 对于报文处理的很简单，因此会带来一些弊端。

### 不可靠性

1.  无连接，也就是说通信不需要建立和断开连接。
2.  协议收到什么数据就传递什么数据，并且也不会备份数据，对方能不能收到是不关心的
3.  没有拥塞控制，一直会以恒定的速度发送数据。即使网络条件不好，也不会对发送速率进行调整。这样实现的弊端就是在网络条件不好的情况下可能会导致丢包，但是优点也很明显，在某些实时性要求高的场景就会很有用。

### 高效

因为 UDP 没有 TCP 那么复杂，需要保证数据不丢失且有序到达。所以 UDP 的头部开销小，只有八字节，相比 TCP 的至少二十字节要少得多，在传输数据报文时是很高效的。

![](/images/jueJin/d547700401b54e5.png)

头部包含了以下几个数据

*   两个十六位的端口号，分别为源端口（可选字段）和目标端口
*   整个数据报文的长度
*   整个数据报文的检验和（IPv4 可选 字段），该字段用于发现头部信息和数据中的错误

讲完 TCP 及 UDP 这两块内容以后，我们接下去看浏览器对于 [www.google.com/](https://link.juejin.cn?target=https%3A%2F%2Fwww.google.com%2F "https://www.google.com/") 链接在进行完 TCP 三次握手后的后续动作是什么。

**因为我们输入的协议是 HTTPS，这个协议我们可以看成是 HTTP 协议加上 TLS 安全协议。因此在进行完 TCP 连接后不会马上开始 HTTP 协议层面的传输，而是开始 TLS 协议的握手。**

HTTPS
-----

HTTPS 最重要的组成部分就是 TLS 协议了，因为是这个协议保证了安全性。

### TLS

既然需要保证安全性，那么肯定需要用到加密技术。在 TLS 中使用了两种加密技术，分别为：对称加密和非对称加密。

**对称加密**：

对称加密就是两边拥有相同的秘钥，两边都知道如何将密文加密解密。

**非对称加密**：

有公钥私钥之分，公钥所有人都可以知道，可以将数据用公钥加密，但是将数据解密必须使用私钥解密，私钥只有分发公钥的一方才知道。

**TLS 握手过程如下图：**

![](/images/jueJin/c985c7f0c269482.png)

1.  客户端发送一个随机值，需要的协议和加密方式
2.  服务端收到客户端的随机值，自己也产生一个随机值，并根据客户端需求的协议和加密方式来使用对应的方式，发送自己的证书（如果需要验证客户端证书需要说明）
3.  客户端收到服务端的证书并验证是否有效，验证通过会再生成一个随机值，通过服务端证书的公钥去加密这个随机值并发送给服务端，如果服务端需要验证客户端证书的话会附带证书
4.  服务端收到加密过的随机值并使用私钥解密获得第三个随机值，这时候两端都拥有了三个随机值，可以通过这三个随机值按照之前约定的加密方式生成密钥，接下来的通信就可以通过该密钥来加密解密

通过以上步骤可知，在 TLS 握手阶段，两端使用非对称加密的方式来通信，但是因为非对称加密损耗的性能比对称加密大，所以在正式传输数据时，两端使用对称加密的方式通信。

PS：以上说明的都是 TLS 1.2 协议的握手情况，在 1.3 协议中，首次建立连接只需要一个 RTT，后面恢复连接不需要 RTT 了。因此如果在意网络传输性能的话，应该选用 TLS1.3 协议。

**当 TLS 完成握手以后，就真的开始进行 HTTP 协议层面的传输数据了。**

HTTP
----

对于 HTTP 协议来说，前端工程师主要了解常见状态码以及 header 即可，毕竟这些是我们日常编码中经常需要接触的内容。

### 常见状态码

**2XX 成功**

*   200 OK，表示从客户端发来的请求在服务器端被正确处理
*   204 No content，表示请求成功，但响应报文不含实体的主体部分
*   205 Reset Content，表示请求成功，但响应报文不含实体的主体部分，但是与 204 响应不同在于要求请求方重置内容
*   206 Partial Content，进行范围请求

**3XX 重定向**

*   301 moved permanently，永久性重定向，表示资源已被分配了新的 URL
*   302 found，临时性重定向，表示资源临时被分配了新的 URL
*   303 see other，表示资源存在着另一个 URL，应使用 GET 方法获取资源
*   304 not modified，表示服务器允许访问资源，但因发生请求未满足条件的情况
*   307 temporary redirect，临时重定向，和302含义类似，但是期望客户端保持请求方法不变向新的地址发出请求

**4XX 客户端错误**

*   400 bad request，请求报文存在语法错误
*   401 unauthorized，表示发送的请求需要有通过 HTTP 认证的认证信息
*   403 forbidden，表示对请求资源的访问被服务器拒绝
*   404 not found，表示在服务器上没有找到请求的资源

**5XX 服务器错误**

*   500 internal sever error，表示服务器端在执行请求时发生了错误
*   501 Not Implemented，表示服务器不支持当前请求所需要的某个功能
*   503 service unavailable，表明服务器暂时处于超负载或正在停机维护，无法处理请求

### HTTP 首部

通用字段

作用

Cache-Control

控制缓存的行为

Connection

浏览器想要优先使用的连接类型，比如 `keep-alive`、`close`

Date

创建报文时间

Pragma

报文指令

Via

代理服务器相关信息

Transfer-Encoding

传输编码方式

Upgrade

要求客户端升级协议

Warning

在内容中可能存在错误

请求字段

作用

Accept

能正确接收的媒体类型

Accept-Charset

能正确接收的字符集

Accept-Encoding

能正确接收的编码格式列表

Accept-Language

能正确接收的语言列表

Expect

期待服务端的指定行为

From

请求方邮箱地址

Host

服务器的域名

If-Match

两端资源标记比较

If-Modified-Since

本地资源未修改返回 304（比较时间）

If-None-Match

本地资源未修改返回 304（比较标记）

User-Agent

客户端信息

Max-Forwards

限制可被代理及网关转发的次数

Proxy-Authorization

向代理服务器发送验证信息

Range

请求某个内容的一部分

Referer

表示浏览器所访问的前一个页面

TE

传输编码方式

响应字段

作用

Accept-Ranges

是否支持某些种类的范围

Age

资源在代理缓存中存在的时间

ETag

资源标识

Location

客户端重定向到某个 URL

Proxy-Authenticate

向代理服务器发送验证信息

Server

服务器名字

WWW-Authenticate

获取资源需要的验证信息

实体字段

作用

Allow

资源的正确请求方式

Content-Encoding

内容的编码格式

Content-Language

内容使用的语言

Content-Length

request body 长度

Content-Location

返回数据的备用地址

Content-MD5

Base64加密格式的内容 MD5检验值

Content-Range

内容的位置范围

Content-Type

内容的媒体类型

Expires

内容的过期时间

Last\_modified

内容的最后修改时间

HTTP 2.0
--------

最后几段内容我们再来聊聊一些新的协议，先来聊聊 HTTP 2.0。这个协议相比于 HTTP 1.1 而言，可以说是大幅度提高了 web 的性能。

在 HTTP 1.1 中，为了性能考虑，我们会引入雪碧图、将小图内联、使用域名发散等等的方式。这一切都是因为浏览器限制了同一个域名下的请求数量，当页面中需要请求很多资源的时候，队头阻塞（Head of line blocking）会导致在达到最大请求数量时，剩余的资源需要等待其他资源请求完成后才能发起请求。

但是在 HTTP 2.0 中这个问题被极大地优化了，但是还是没有被解决。因为 HTTP 2.0 底下还是 TCP 协议，TCP 需要保证数据正确性的做法也会带来队头阻塞的问题，所以说问题并没被解决。但是这个问题被后续的新协议彻底解决了，我们下文再表。

我们先来感受下 HTTP 2.0 比 HTTP 1.X 到底快了多少，可以通过 [该链接](https://link.juejin.cn?target=https%3A%2F%2Fhttp2.akamai.com%2Fdemo "https://http2.akamai.com/demo") 体验。

![](/images/jueJin/5c3ff7e0d47945d.png)

在 HTTP 1.X 中，因为队头阻塞的原因，你会发现请求是这样的

![](/images/jueJin/225ce7f2abe04cc.png)

在 HTTP 2.0 中，因为引入了多路复用，你会发现请求是这样的：

![](/images/jueJin/0b55d32f17ed448.png)

多路复用
----

在 HTTP 2.0 中，有两个非常重要的概念，分别是帧（frame）和流（stream）。

帧代表着最小的数据单位，每个帧会标识出该帧属于哪个流，流也就是多个帧组成的数据流。

多路复用，就是在一个 TCP 连接中可以存在多条流。换句话说，也就是可以发送多个请求，对端可以通过帧中的标识知道属于哪个请求。通过这个技术可以极大的提高传输性能。

![](/images/jueJin/cd005cd1901e42f.png)

二进制传输
-----

HTTP 2.0 中所有加强性能的核心点在于此。在之前的 HTTP 版本中，我们是通过文本的方式传输数据。在 HTTP 2.0 中引入了新的编码机制，所有传输的数据都会被分割，并采用二进制格式编码为二进制帧。

![](/images/jueJin/27b4c9ddb321495.png)

二进制帧分为很多类型，在上图中我们可以发现存在了 HEADERS 帧和 DATA 帧，除了这些之外还有还几种，各位读者有兴趣的话可以自行了解。

Header 压缩
---------

在 HTTP 1.X 中，我们使用文本的形式传输 header，在 header 携带 cookie 的情况下，可能每次都需要重复传输几百到几千的字节。

在 HTTP 2.0 中，使用了 HPACK 压缩格式对传输的 header 进行编码，减少了 header 的大小。并在两端维护了索引表，用于记录出现过的 header ，后面在传输过程中就可以传输已经记录过的 header 的键名，对端收到数据后就可以通过键名找到对应的值。

服务端 Push
--------

这个不用学了，因为用的太少，Chrome 或移除这个功能了。详情见 [Chrome to remove HTTP/2 Push](https://link.juejin.cn?target=https%3A%2F%2Fwww.ctrl.blog%2Fentry%2Fhttp2-push-chromium-deprecation.html "https://www.ctrl.blog/entry/http2-push-chromium-deprecation.html")。

QUIC
----

这是一个谷歌出品的基于 UDP 实现的同为传输层的协议，目标很远大，希望替代 TCP 协议。

*   该协议支持多路复用，虽然 HTTP 2.0 也支持多路复用，但是下层仍是 TCP，因为 TCP 的重传机制，只要一个包丢失就得判断丢失包并且重传，导致发生队头阻塞的问题，但是 UDP 没有这个机制
*   实现了自己的加密协议，通过类似 TCP 的 TFO 机制可以实现 0-RTT，也就是说 QUIC 可以在 0-RTT 的情况下建立安全连接并传输数据
*   支持重传和纠错机制（向前恢复），在只丢失一个包的情况下不需要重传，使用纠错机制恢复丢失的包
*   纠错机制：通过异或的方式，算出发出去的数据的异或值并单独发出一个包，服务端在发现有一个包丢失的情况下，通过其他数据包和异或值包算出丢失包
*   在丢失两个包或以上的情况就使用重传机制，因为算不出来了

最后
--

网络协议涉及到的内容其实还有相当多，笔者这里聊了聊前端工程师必须要学习的内容。如果大家对某一个协议感兴趣的话可以自行学习。

举几个例子：

1.  HTTP 2.0 其实还涉及了挺多内容，就比如说二进制帧的各种类型以及分别的功能是什么。
2.  HTTP 3.0 是个更新的协议，对比 2.0 又有了很多性能优化。
3.  QUIC 是个性能很强又兼顾 TCP 功能的协议，有些 CDN 厂商已经支持后台开启该功能。

抛一些学习引子给各位读者。对于上文中的内容如果大家有疑惑的话可以一起交流学习。

> 大家也可以在笔者的[网站](https://link.juejin.cn?target=https%3A%2F%2Fjsgodroad.com%2Finterview%2Fnetwork "https://jsgodroad.com/interview/network")上阅读，体验更佳！