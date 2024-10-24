---
author: ""
title: "浅尝IM方案在H5活动场景中的应用"
date: 2023-05-25
description: "本文主要介绍在对数据实时行要求比较高的业务场景中，使用IM方案来保证数据更新的实时性，以提升用户体验；并且在此基础上简单介绍了 WebSocket 长链接的建立，以及其工作原理。"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读21分钟"
weight: 1
selfDefined:"likes:31,comments:1,collects:32,views:3490,"
---
> 本文作者：入云

前言
==

说起 IM，大家应该都或多或少了解过一些，一般被熟知是在一些聊天场景里应用的比较多；而一般情况下我们常接触的业务中大多是做一些接口的查询提交之类的操作，用正常的 Ajax 请求就足以满足需求，比较难接触到 IM 这种方案。

但如果涉及到一些需要频繁更新数据的业务场景，使用常规接口查询难免会给服务端造成比较大的性能开销，并且数据更新的延迟也会很大；尝试使用 IM 则可以让我们在业务开发中更好地应对频繁的数据更新场景，以提升用户体验和业务价值。

近期在做一个多人实时打怪兽的场景，即多名玩家同时攻击一个怪兽，任意一个玩家攻击怪兽，其它玩家需要实时感知到怪兽的状态更新，比如怪兽血量和玩家伤害排行等信息。本文将从此需求切入，探讨下在类似这种高并发、低延迟的业务需求中，如何使用 IM 方案来解决频繁的数据更新问题，也会顺便介绍下 WebSocket 的基本运作流程。

![move](/images/jueJin/783ec6200e80cab.png)

可选的数据更新方案
=========

在谈论 IM 之前，对于数据的实时更新，除了使用 IM ，还有哪些可选用的方案，可能包括但不限于下面几种：

接口轮询
----

接口轮询这种方式相信大家都很熟悉，主要是使用通过定期发送 HTTP 请求来达到数据更新的方式，实现起来也比较简单，例如一些榜单数据的定时更新：

```js
// 请求榜单接口
    const refreshRank = (familyId) => {
        getMonsterDamageRank({ familyId }).then((res) => {
        setRank(res);
            }).catch((err) => {
            Toast.warn(err.message || '服务器繁忙');
            });
            };
            
            // 每3秒刷新一次接口
                setInterval(() => {
                refreshRank(currentFamily.familyId);
                }, 3000);
```

这里使用 `setInterval` 每隔3秒请求一次榜单数据，用来更新排行榜信息，通常用于实现一些要求数据更新相对频繁，但又允许有一定延迟的场景；同时轮询也是一种实现起来最简单的方案，但它也有几个比较大的缺点，比如：

1.  带宽浪费：轮询需要定期向服务器发送请求，即使服务端没有新数据可用，这将会造成大量的带宽和服务器资源浪费。
2.  延迟高：数据的更新频率受轮询间隔影响，如果轮询间隔时间过长，会导致数据更新的延迟较高。
3.  负载过高：要降低数据的延迟，就必须提高接口轮询的频率，但轮询的频率过高，将会导致服务器负载过高，从而影响其他用户的体验。

![image](/images/jueJin/f6ad7fd067efb6f.png)

接口长轮询
-----

长轮询（Long Polling）是一种改进的轮询技术，它的主要思想是在客户端发送请求后，服务端保持连接打开，但并不立即响应，而是在有新数据可用时才响应给客户端。当客户端接收到响应后，再次发起请求，以保持连接打开。

相比于传统的轮询，长轮询可以降低网络延迟和服务器压力；因为长轮询的响应是异步的，服务器不需要在每个固定时间间隔内返回响应，这样可以减少不必要的请求。同时，当服务器有新数据可用时，也可以立即返回响应，从而提高数据的实时性。 ![image](/images/jueJin/f6ee68b80be4b4a.png)

如上图，长轮询的实现通常分为下面几个阶段：

1.  客户端向服务器发起请求。
2.  服务器接收到请求后，如果没有新数据可用，则保持连接打开。
3.  服务器有新数据可用时，响应给客户端。
4.  客户端接收到响应后，再次向服务器发起请求。 ......

下面是使用 Node.js 实现的一个简单的长轮询服务端示例:

```js
const http = require('http');
const messages = [];

// 开始每隔1秒检查下messages中是否有信息
    function waitForNewMessages(response) {
        const intervalId = setInterval(() => {
        if (messages.length > 0) { // message 中有消息之后返回响应
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(messages));
        clearInterval(intervalId);
    }
    }, 1000);
    
    setTimeout(() => { // 30秒无数据，返回一个空数组
    clearInterval(intervalId);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify([]));
    }, 30000);
}

    function handleRequest(request, response) {
        if (request.url === '/messages') {
        /** 请求到“/messages”时，如果有新消息，则立即向客户端发送响应
        *  否则，等待一段时间后再次检查是否有新消息
        * */
        waitForNewMessages(response);
            } else {
            response.writeHead(404);
            response.end();
        }
    }
    const server = http.createServer(handleRequest);
    server.listen(3000);
```

在上面的代码中，我们使用 `setInterval` 函数每秒检查一次是否有新消息。如果有新消息，我们立即向客户端发送响应，并清除定时器。为了防止一直 pending，如果在30秒内没有新的消息，我们会向客户端发送一个空数组作为响应。这样，客户端就可以在收到新消息时立即更新页面。

对于长轮询的实现仍有许多细节需要注意，如连接保持、连接断开重连等问题。此外，长轮询仍然需要消耗大量的带宽和服务器资源，因为每个连接都需要保持打开状态，可以想象有很多个请求到达服务端，服务端需要开启多个异步来保持链接在 pending 的状态。

SSE（Server-Sent Events）
-----------------------

SSE 也是一种浏览器与服务器之间实现实时通信的技术。它允许服务器向浏览器发送数据。在 SSE 中，浏览器可通过 EventSource API 来建立与服务器的连接，并监听来自服务器的事件。服务器通过向客户端发送特定格式的数据（包括事件名称和数据），来触发浏览器的事件监听器。

下面同样使用 Nodejs 来实现一个 Demo：

```js

// Server 端
const http = require('http');

    const server = http.createServer((req, res) => {
    // 设置头部信息
        res.writeHead(200, {
        'Content-Type': 'text/event-stream', // 设置响应类型为SSE
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*' // 允许跨域请求
        });
        
        // 发送数据到客户端
            setInterval(() => {
            res.write('data: ' + new Date().toISOString() + '\n\n'); // 发送SSE消息
            }, 1000);
            });
            
                server.listen(3000, () => {
                console.log('Server started on port 3000');
                });
                
                // Client端
                const sse = new EventSource('http://localhost:3000');
                
                // 监听SSE消息
                    sse.addEventListener('message', (event) => {
                    console.log(event.data);
                    });
```

在客户端使用 new EventSource 访问 “[http://localhost:3000”](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A3000%25E2%2580%259D "http://localhost:3000%E2%80%9D") 时，服务器会返回一个 SSE 流，这里注意需要将响应头中的 Content-Type 设置为 text/event-stream，表示该响应是 SSE 流；将 Cache-Control 设置为 no-cache，表示浏览器不缓存该响应， Connection 设置为 keep-alive，表示服务器与客户端之间的连接应该保持打开状态。

在 SSE 流中，每一条消息都需要以 data: 开头，并以两个换行符（\\n\\n）结尾。在本例中，使用 setInterval() 函数每秒发送一条消息。

但对于SSE而言，也具有下面几个缺点：

1.  单向传输：只能从服务器向客户端推送数据，无法实现双向通信。
2.  只支持纯文本：事件流只能传输一个简单的文本数据流, 并且文本只能使用 UTF-8 格式编码
3.  SSE对于一些浏览器的支持不够完善：比如在 Safari 和 iOS 中，可能会对 SSE 连接的数量和连接时间等方面进行限制，从而影响 SSE 的稳定性和可靠性

HTTP/2 Server Push
------------------

相对于 HTTP/1.1 而言，HTTP/2 其实也是支持了服务端主动推送的，不过目前 HTTP/2 的主动推送，主要是用于提升页面加载性能的，它允许服务器在响应请求时向客户端推送预先缓存的资源（例如，CSS、JavaScript 和图像），以减少请求次数和延迟，是一种页面加载的优化手段。但考虑到其相对于 WebSocket 而言，目前的安全性和稳定性还有待进一步提升，用于实现即时通信还不是特别成熟，所以这里就不再赘述了。对与如何实现提前推送静态文件，具体可以参考下 [HTTP/2 服务器推送（Server Push）教程。](https://link.juejin.cn?target=https%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2018%2F03%2Fhttp2_server_push.html "https://www.ruanyifeng.com/blog/2018/03/http2_server_push.html")

WebSocket
---------

上面介绍的几种方式，都是基于HTTP协议的，而 WebSocket 则是一种新的协议；WebSocket诞生于 2008 年 6 月，在 2011 年 12 月成为 [RFC6455](https://link.juejin.cn?target=https%3A%2F%2Fwww.rfc-editor.org%2Frfc%2Frfc6455.txt "https://www.rfc-editor.org/rfc/rfc6455.txt") 国际标准，并且WebSocket协议是一种专门为实时通信而设计的协议。所以对于实现即时通信而言，WebSocket 可以说是最佳选择。相对于上面几种方式，它具有下面几个优点：

1.  低延迟：WebSocket 通过保持持久连接，避免了HTTP短连接频繁地建立和关闭连接的开销，从而降低了延迟。
2.  双向通信：WebSocket 协议支持双向通信，客户端和服务器都可以向对方发送数据，从而实现更加灵活的通信方式。
3.  跨域支持：WebSocket 协议支持跨域通信，可以在不同源之间传输数据，从而支持更多种场景下的应用。
4.  更少的数据传输：WebSocket 协议支持二进制数据传输和数据压缩，可以减少数据传输的延迟和带宽消耗。

说到底，上面提到了好几种方案，其实都可以在不同程度上实现数据的实时更新，但是它们跟本次需求中使用到的 IM 方案有什么关系呢？或者说 IM 究竟是个什么样的方案呢？下面我们先明确下 IM 的概念。

IM
==

IM 具体是指什么
---------

[即时通信（Instant Messaging，简称IM）是一种透过网络进行实时通信的系统，允许两人或多人使用网络即时的传递文字消息、文件、语音与视频交流。通常以网站、电脑软件或移动应用程序的方式提供服务（来自维基百科）](https://link.juejin.cn?target=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2F%25E5%258D%25B3%25E6%2599%2582%25E9%2580%259A%25E8%25A8%258A "https://zh.wikipedia.org/wiki/%E5%8D%B3%E6%99%82%E9%80%9A%E8%A8%8A")

换句话说，我们只要采用某种方式，能实现两人或多人之间可以通过网络实时的交换信息，就可以称之为是一种 IM 方案。那么上面所提到的几种实现数据更新方式，都可以用做实现 IM 方案的底层实现方案。

Web 端 IM 的发展历程
--------------

对于 Web 端 IM 的发展历程，其实大致都囊括了上面提到的几种实现方式；这些技术经过不断优化，持续提升了用户体验。其演变过程可以大致概括为从早期的轮询技术到长轮询，再发展到现代的 WebSocket、Server Push 的实现方式。而 WebSocket 的出现，则实现了更高效、更实时的即时通信。

![time](/images/jueJin/79ec906bbc57062.png)

本次要实现多人打怪兽同步信息的场景，对数据更新的实时性要求非常高，所以本次需求所依赖的 IM 方案，就是基于更稳定的 WebSocket 实现的，所以下面就详细介绍下 WebSocket 和HTTP的区别，以及 WebSocket 的运作流程。

WebSocket
=========

WebSocket VS HTTP
-----------------

WebSocket 虽然是一种新的协议，但同 HTTP 协议一样，WebSocket 协议也是运行在 TCP 协议之上的，与 HTTP 协议同属于应用层网络数据传输协议。那 WebSocket 和 HTTP 究竟有哪些不一样呢？

1.  HTTP 属于短连接，每发起一次请求都需要建立一次连接，请求结束后立即关闭连接，属于“请求-响应模式”，即客户端需要主动发送请求才能获取到服务器返回的数据。​即便是我们上面介绍的“长轮询”，也是需要依赖服务端来“hold”住请求。
2.  HTTP 是一种无状态协议，每个请求都是独立的，服务器不会保存客户端的状态信息。所以每次客户端发送请求，都会在请求头里塞一些类似于 Cookie 这种信息用来标识当前请求属于哪个用户。
3.  不同于 HTTP，WebSocket 协议中客户端和服务端只需要完成一次握手，两者之间就可以建立持久性的连接，并可以进行双向的数据传输。 ![websocketvshttp](/images/jueJin/01881d8f5cd4dc6.png)

WebSocket 具体是如何建立连接的
--------------------

Demo 跑起来看着是挺简单的，但 WebSocket 长链接到底是怎么建立的呢？在介绍连接建立之前，我们先来了解下 HTTP 协议请求头中 `Upgrade` 这么一个字段。

HTTP 协议是一种文本协议，虽然其灵活性很高，但在处理大量数据和多媒体内容时效率较低。将协议升级为 WebSocket 或 HTTP/2 可以支持更多数据格式的传输；所以为了支持将协议升级，在 HTTP/1.1 中新增了 Upgrade 请求头，它允许客户端请求将其连接升级到另一个协议：

```js
Upgrade: <protocol>
```

其中，protocol 表示希望升级到的协议名称，例如 WebSocket、HTTP/2 等。

另外，Upgrade 头部还可以与 Connection 头部一起使用，以指示客户端希望使用持久连接。这可以减少每个请求的开销，从而提高网络性能和效率，要将协议升级为 WebSocket，就需要将这两个字段结合起来：

```js
Connection: Upgrade
Upgrade: WebSocket
```

这里我们了解到 WebSocket 协议是通过 HTTP 协议升级而来的，那么具体的长链接的生命周期是怎样的呢？下面是一个大致的 WebSocket 流程图： ![websocket](/images/jueJin/a702645dfaabc72.png)

如上图，可以简单的将 WebSocket 的生命周期大致分为三个阶段：

1.  通过一次HTTP握手建立 WebSocket 长链接（也就是协议升级的过程）
2.  使用 WebSocket 协议进行数据传输
3.  任意一方发送关闭帧，对方响应关闭帧后，长链接关闭

### 握手请求

WebSocket 的建立是通过一次 HTTP 请求握手来实现的，客服端通过发送一个 GET 请求，并在 Request Header 里携带一些协议升级所需的参数，告诉服务器对本次 HTTP 请求进行升级。

```yaml
GET ws://localhost:3000/ HTTP/1.1
Host: localhost:3000
Connection: Upgrade
Pragma: no-cache
Cache-Control: no-cache
Upgrade: websocket
Sec-WebSocket-Version: 13
Sec-WebSocket-Key: nFPKUyeo5Ul58tbe7Dg5lA==
```

上面是一个 WebSocket 的请求快照，对于 Upgrade 字段上面已经介绍过，这里看下剩下的几个关键的参数：

*   `Sec-WebSocket-Key`：是由客户端生成的一次性随机值，该值与服务端响应首部的 `Sec-WebSocket-Accept` 是配套的，提供基本的防护，比如防止恶意或者无意的连接。
*   `Sec-WebSocket-Version`：这里表明 WebSocket 协议的唯一可接受版本是13。

### 握手响应

一旦客户端发送了打开 WebSocket 连接的初始请求，它就会等待服务器的回复。该回复必须有一个 HTTP 101 切换协议的响应代码。HTTP 101 切换协议响应表明，服务器正在切换到客户端在其升级请求头中所指定的协议。同样的，在响应头里也会包括 Upgrade 字段，标识协议已被升级。

```makefile
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: 89D1tEKizEJHFrVDhswIIpAf4ww=
```

此外，响应头中的 `Sec-WebSocket-Accept` 是一个处理后的 base64 编码，是通过客户端请求头中的 `Sec-WebSocket-Key` 和 [RFC6455](https://link.juejin.cn?target=https%3A%2F%2Fwww.rfc-editor.org%2Frfc%2Frfc6455.txt "https://www.rfc-editor.org/rfc/rfc6455.txt") 中定义的静态值 `258EAFA5-E914-47DA-95CA-C5AB0DC85B11` 拼接来生成的，计算步骤为：

1.  将 `Sec-WebSocket-Key` 跟 `258EAFA5-E914-47DA-95CA-C5AB0DC85B11` 拼接
2.  通过 `SHA1` 计算出摘要，并转成 base64 字符串

![RFC](/images/jueJin/fa2d3bdcb23252c.png)

通过这样一个HTTP的请求和响应，就表明长链接的握手过程已经完成，并将协议升级成了 WebSocket 协议，后续双方就可以通过这个长链接通道传输数据了。那数据具体又是怎样传输的呢？

### 数据传输

WebSocket 在传输数据的过程中，实际上会将大块数据（消息）分成若干帧进行传输，[RFC6455](https://link.juejin.cn?target=https%3A%2F%2Fwww.rfc-editor.org%2Frfc%2Frfc6455.txt "https://www.rfc-editor.org/rfc/rfc6455.txt") 中给出了帧的概述，这里大致介绍下一些重要字段： ![RFC](/images/jueJin/c404aae466cfcd4.png)

*   FIN (Final)：表示当前帧是否为最后一个片段；1 表示是消息的最后一个片段，0 表示不是消息的最后一个片段
*   RSV1, RSV2, RSV3 (Reserved)：扩展字段，各占 1 比特，一般情况全为 0
*   opcode：每个帧都有一个操作码，这个操作码决定如何来解释这个帧的有效载荷数据。具体分为以下几个类型： ![table](/images/jueJin/66aa81f112c5064.png)

### 链接关闭

要关闭 WebSocket 连接，发送端需要发送一个关闭帧（opcode 0x8）。如果连接的任何一方收到一个关闭帧，它必须发送一个关闭帧作为响应，一旦双方都收到了关闭帧，WebSocket 连接将会断开。

如何自己实现一个 WebSocket 的升级流程
------------------------

根据上面的 WebSocket 的流程描述，我们可以使用 Nodejs 实现一个简单版的协议升级逻辑，并使用浏览器 Api 实现对应的客户端逻辑。

### 服务端逻辑

以下是一个使用Node.js原生模块实现 WebSocket 服务端的例子：

```js
// 导入所需的Node.js原生模块
const http = require('http');
const crypto = require('crypto');
// 创建HTTP服务器
const server = http.createServer();

// 解析WebSocket帧
    function parseFrame(buffer) {
    // 这里获取操作码（opcode），表示数据帧的类型
    const opcode = buffer[0] & 0x0f;
    // 这行代码获取负载长度（payload length）。它表示数据帧的实际数据长度。这里仅考虑了较短的数据长度，实际上可能需要处理更长的数据长度
    const payloadLength = buffer[1] & 0x7f;
    // 数据帧的数据部分（payload）是以掩码的形式发送的，需要使用掩码来解码。
    const mask = buffer.slice(2, 6);
    // 这里获取帧中的实际数据
    const payload = buffer.slice(6);
    let decodedPayload = '';
    if (opcode === 1) { // 文本数据帧
        for (let i = 0; i < payloadLength; i++) {
        // 这里使用异或操作对数据字节与相应的掩码字节进行解码：payload[i] ^ mask[i % 4]。这里使用模运算（i % 4）确保在掩码的 4 个字节之间循环。
        // 使用 String.fromCharCode() 将解码后的字节转换为字符，并将解码后的字符添加到 decodedPayload 字符串中。
        decodedPayload += String.fromCharCode(payload[i] ^ mask[i % 4]);
    }
    } else if (opcode === 8) { // 关闭帧
    return { type: 'close' };
}

return { type: 'text', data: decodedPayload };
}

// 根据给定的文本消息创建一个文本数据帧
    function createTextFrame(message) {
    // 根据消息长度分配一个缓冲区。这里仅处理较短的消息，因此分配 2 个额外字节用于帧头
    const buffer = Buffer.alloc(2 + message.length);
    // 设置帧头的第一个字节。0x81 表示一个最终帧（FIN = 1）且操作码为文本（opcode = 1）
    buffer[0] = 0x81;
    // 设置帧头的第二个字节。这里仅处理较短的消息，所以直接将消息长度设置为负载长度。这意味着没有掩码（mask = 0）
    buffer[1] = message.length;
    // 将消息写入缓冲区。对于每个字符，获取其字符编码（Unicode 编码）并将其添加到缓冲区。
        for (let i = 0; i < message.length; i++) {
        buffer[i + 2] = message.charCodeAt(i);
    }
    return buffer;
}

// 向客户端发送消息
    function sendTextMessage(socket, message) {
    const frame = createTextFrame(message);
    socket.write(frame);
}

// 监听服务器的upgrade事件
    server.on('upgrade', (req, socket, head) => {
    // 检查WebSocket协议和版本
        if (req.headers['upgrade'] !== 'websocket' || req.headers['sec-websocket-version'] !== '13') {
        socket.destroy();
        return;
    }
    
    // 获取客户端发送的Sec-WebSocket-Key
    const key = req.headers['sec-websocket-key'];
    
    // 计算Sec-WebSocket-Accept
    const sha1 = crypto.createHash('sha1');
    sha1.update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
    const accept = sha1.digest('base64');
    
    // 构建响应头
        const headers = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        'Sec-WebSocket-Accept: ' + accept,
        '\r\n'
        ];
        
        // 发送响应头
        socket.write(headers.join('\r\n'));
        
        // 监听数据
            socket.on('data', (buffer) => {
            const frame = parseFrame(buffer);
            
                if (frame.type === 'text') {
                console.log('Received message:', frame.data);
                // 在此处实现处理收到的文本消息
                // 向客户端发送消息
                sendTextMessage(socket, 'Hello, client!');
                    } else if (frame.type === 'close') {
                    console.log('Client closed the connection.');
                    socket.destroy();
                }
                });
                
                // 监听关闭
                    socket.on('close', () => {
                    console.log('Socket has been closed.');
                    });
                    });
                    
                        server.listen(3000, () => {
                        console.log('WebSocket server listening on port 3000');
                        });
```

这里创建了一个基于 HTTP 的 WebSocket 服务，并监听 3000 端口，其中细节部分已经在代码里注释。当客户端发起升级请求时，服务器将在握手过程中验证客户端的请求，并在成功升级到WebSocket连接后监听来自客户端的数据同时发送一个 'Hello, client!' 作为回复。

### 客户端逻辑

下面是对应客户端逻辑，使用浏览器原生 Api WebSocket 来实现长链接的建立：

```js
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>WebSocket demo</title>
</head>
<body>
<h1>WebSocket demo</h1>
<input type="text" id="message">
<button onclick="sendMessage()">Send</button>

<button onclick="handleEnd()">End</button>
<div id="output"></div>
<script>
// 创建 WebSocket 连接
const ws = new WebSocket('ws://localhost:3000/');

// 监听消息
    ws.onmessage = (event) => {
    const output = document.getElementById('output');
    output.innerHTML += `<p>${event.data}</p>`;
    };
    
    // 长链接断开
        ws.onclose = () => {
        const output = document.getElementById('output');
        output.innerHTML += `<p>WebSocket closed</p>`;
    }
    
    // 发送消息
        function sendMessage() {
        const message = document.getElementById('message').value;
        ws.send(message);
    }
    
    // 关闭长链接
        function handleEnd() {
        ws.close();
    }
    </script>
    </body>
    </html>
```

在客户端创建一个 WebSocket 并连接到ws://localhost:3000服务器，这里注册了长链接的 onmessage 和 onclose 事件；在输入框里输入信息点击发送，会向服务端发送一个消息，服务端在接收到客户端消息时，紧接着会向客户端发送一个文本消息，同时在页面中点击 end 可以将长链接关闭。

客户端： ![client](/images/jueJin/c65a722e0166e13.png) 服务端： ![server](/images/jueJin/b0b28ec48e40cc3.png)

对于浏览器 WebSocket Api 除了常用回调 onclose、onmessage、 onerror、onopen，WebSocket 实例本身还有一些属性可以判断长链接当前的状态（如下图），详细参数可参考 MDN 中的详细介绍「[WebSocket](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWebSocket "https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket")」 ![mdn](/images/jueJin/2abb7e40b59daf9.png)

IM 方案选择
=======

上面我们使用 Nodejs 和浏览器 WebSocket Api 实现了一个简单的即时通信，但这还远远达不到可以在生产环境中使用的标准，比如涉及到网络异常、掉线重连、较大数据量处理、兼容性处理等问题。

当然 WebSocket 有很多成熟的库可以直接使用，比如[Socket.IO](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsocketio%2Fsocket.io "https://github.com/socketio/socket.io")、[Ws](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fwebsockets%2Fws "https://github.com/websockets/ws")，这些库都是经过广泛使用和测试的开源项目，具有良好的稳定性和可靠性。对于生产环境使用这些成熟的库可以减少很多不必要的麻烦。作为本次需求的 IM 方案，我们则选择使用的是由 [网易云信](https://link.juejin.cn?target=https%3A%2F%2Fdoc.yunxin.163.com%2Fmessaging%2Fdocs%2FTc4MzI0NzY%3Fplatform%3Dweb "https://doc.yunxin.163.com/messaging/docs/Tc4MzI0NzY?platform=web") 提供的 Web IM 即时通讯能力；改方案提供了包括服务端和 Web 端一套完整的方案，可以快速集成到我们的工程中，实现即时通信的能力。

[云信 Web SDK](https://link.juejin.cn?target=https%3A%2F%2Fdoc.yunxin.163.com%2Fmessaging%2Fapi-refer%2Fweb%2Ftypedoc%2FLatest%2Fzh%2FChatroom%2Findex.html "https://doc.yunxin.163.com/messaging/api-refer/web/typedoc/Latest/zh/Chatroom/index.html") 提供了多种常见聊天场景，例如单聊、群聊、聊天室等。本次需求主要涉及多人场景，并且战斗不要求持久性，一场战斗由多人同时在线参与，并且在战斗结束后就解散，所以这里选择使用的是聊天室场景。对于消息的流转如下： ![message](/images/jueJin/ef8bd9f788ae891.png)

客户端集成SDK
--------

整体方案的集成可参考[云信官方](https://link.juejin.cn?target=https%3A%2F%2Fyunxin.163.com%2F "https://yunxin.163.com/")网站，这里仅介绍下客户端的集成过程，和所需要注意的问题。

对于客户端这里选择通过 npm 集成 SDK：

```js
npm install @yxim/nim-web-sdk@latest
```

SDK 所包含的三个文件的说明如下：

```js
dist/SDK
├── NIM_Web_Chatroom.js       提供聊天室功能，浏览器适配版（UMD 格式）
├── NIM_Web_NIM.js       提供 IM 功能，包括单聊、会话和群聊等，但不包含聊天室。浏览器适配版（UMD 格式）
├── NIM_Web_SDK.js       提供 IM 功能和聊天室功能的集成包，浏览器适配版（UMD 格式）
```

这里使用的是聊天室能力，可通过单例模式初始化登陆聊天室，如下：

```js
import Chatroom from '@yxim/nim-web-sdk/dist/SDK/NIM_Web_Chatroom';
    export class InitChatRoom {
        static async getRoomInstance({ onChatMsg = () => {} }) {
            if (!InitChatRoom.instance) {
                InitChatRoom.instance = Chatroom.getInstance({
                appKey: 'appKey',          // 在云信管理后台查看应用的 appKey
                account: 'account',        // 帐号, 应用内唯一
                token: 'token',            // 帐号的 token, 用于建立连接
                chatroomId: 'chatroomId',  // 聊天室 id
                chatroomAddresses: [       // 聊天室地址列表
                'address1',
                'address2'
                ],
                onconnect: () => {},       // 长链接建立成功回调
                onmsgs: (data) => {},      // 消息触达回调
                ondisconnect: () => {},    // 长链接断开回调
                onwillreconnect: () => {}  // 长链接即将重连
                });
            }
            return InitChatRoom.instance;
        }
    }
```

消息的过滤
-----

在本次需求中，怪兽血量和状态的更新主要是依赖消息的推送。另外活动是每天定点开放，所以活动开始时会有大量用户同时涌入参与攻击怪兽，在这种情况可能会造成消息在服务端的堆积，导致消息触达到客户端时不能保证消息是按产生的先后时间到达的。

举个例子，比如 20:01 产生的消息，由于消息堆积可能会在 20:02 产生的消息后面到达，这样就可能会导致怪兽的血量忽大忽小的跳动；或者是怪兽已经死了，而怪兽掉血的消息才刚刚到达，此时就需要将这些过时的消息抛弃掉。

处理方式也比较简单，就是针对每一个消息体都会添加一个消息产生的时间戳，通过这个时间戳可以将延迟触达的消息过滤掉。

```js
    onmsgs: (data) => {
    // 延迟消息的过滤，判断掉血消息的时间是否大于之前的消息时间
    const { msgTime } = data;               // 当前消息产生时间
    const preTime = monster?.msgTime || 0;  // 上一条消息时间
        if (msgTime > preTime) {
        monster.remainingHp = remainHp;       // 更新怪兽剩余血量
        monster.damage = damage;
        monster.msgTime = msgTime;
    }
}
```

总结
==

本次需求也是首次在日常活动需求中使用 IM 方案，整体看起来也没有预期的那么复杂，总的来讲相对于之前常用的接口轮询的方式，会减少很多对服务端的压力，同时 IM 方案更新数据的及时性，也大幅提升了用户体验；项目稳定运行一年多，也验证了 IM 方案在日常需求中的可行性。感兴趣的话欢迎下载“心遇APP”，体验家族打怪兽活动。

参考资料
====

*   [维基百科](https://link.juejin.cn?target=https%3A%2F%2Fzh.m.wikipedia.org%2Fzh-hans%2FWebSocket "https://zh.m.wikipedia.org/zh-hans/WebSocket")
*   [阮一峰：WebSocket 教程](https://link.juejin.cn?target=https%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2017%2F05%2Fwebsocket.html "https://www.ruanyifeng.com/blog/2017/05/websocket.html")
*   [RFC6455: WebSocket](https://link.juejin.cn?target=https%3A%2F%2Fwww.rfc-editor.org%2Frfc%2Frfc6455.txt "https://www.rfc-editor.org/rfc/rfc6455.txt")
*   [WebSocket网络协议](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fxiaxveliang%2Fp%2F16292433.html "https://www.cnblogs.com/xiaxveliang/p/16292433.html")

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！