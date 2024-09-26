---
author: "麦麦麦造"
title: "只因把https改成http，带宽减少了70%！"
date: 2024-09-01
description: "起因是一个高并发的采集服务上线后，100m的上行很快就被打满了。因为这是一条专线，并且只有这一个服务在使用，所以可以确定就是它导致的。但是！这个请求只是一个GET请求，同时并没有很大的请求体"
tags: ["Go","爬虫"]
ShowReadingTime: "阅读2分钟"
weight: 306
---
### 起因

是一个高并发的采集服务上线后，100m的上行很快就被打满了。  
因为这是一条专线，并且只有这一个服务在使用，所以可以确定就是它导致的。

但是！这个请求只是一个 GET 请求，同时并没有很大的请求体，这是为什么呢？

于是使用 charles 重新抓包后发现，一个 request 的请求居然要占用 1.68kb 的大小!

其中TLS Handshake 就占了 1.27kb。

![图片.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/bff81f4bfe6f45739f0303d53a2a626d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6bqm6bqm6bqm6YCg:q75.awebp?rk3s=f64ab15b&x-expires=1727640887&x-signature=xCAAXQgdumN6x4zhXG5AglUYg7g%3D)

这种情况下，需要的上行带宽就是：`1.68*20000/1024*8=262.5mbps`

也就说明100mbps的上行为何被轻松打满

### TLS Handshake是什么来头，竟然如此大?

首先要知道HTTPS全称是：HTTP over TLS，每次建立新的TCP连接通常需要进行一次完整的TLS Handshake。在握手过程中，客户端和服务器需要交换证书、公钥、加密算法等信息，这些数据占用了较多的字节数。

TLS Handshake的内容主要包括：

*   客户端和服务器的随机数
*   支持的加密算法和TLS版本信息
*   服务器的数字证书（包含公钥）
*   用于生成对称密钥的“Pre-Master Secret”

这个过程不仅耗时，还会消耗带宽和CPU资源。

因此想到最粗暴的解决方案也比较简单，就是直接使用 HTTP，省去TLS Handshake的过程，那么自然就不会有 TLS 的传输了。

那么是否真的有效呢？验证一下就知道。

将请求协议改成 http 后：

![图片.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/67bb9077a35c4d77a716f08862665ab9~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6bqm6bqm6bqm6YCg:q75.awebp?rk3s=f64ab15b&x-expires=1727640887&x-signature=BCnw8n2FN%2BG74bah%2FeXhPJZ73%2BA%3D) 可以看到请求头确实不包含 TLS Handshake了!

整个请求只有 0.4kb，节省了 70% 的大小

目标达成

因此可以说明：在一些不是必须使用 https 的场景下，使用 http 会更加节省带宽。

同时因为减少了加密的这个过程，可以观察到的是，在相同的并发下，服务器的负载有明显降低。

### 那么问题来了

如果接口必须使用 https那怎么办呢?

当然还有另外一个解决方案，那就使用使用 `Keep-Alive`。  
headers 中添加 `Connection: keep-alive` 即可食用。

通过启用 Keep-Alive，  
可以在同一TCP连接上发送多个HTTPS请求，  
而无需每次都进行完整的TLS Handshake，  
但第一次握手时仍然需要传输证书和完成密钥交换。

对于高并发的场景也非常适用。

### 要注意的是

keep-alive 是有超时时间的，超过时间连接会被关闭，再次请求需要重新建立链接。

**Nginx** 默认的 `keep-alive` 超时是 75 秒，  
**Apache HTTP 服务器** 通常默认的 `keep-alive` 超时是 5 秒。

> **ps：**  
> 如果你的采集程序使用了大量的代理 ip那么 keep-alive 的效果并不明显～～  
> 最好的还是使用 http