---
author: "华为云开发者联盟"
title: "华为云短信服务教你用C++实现Smgp协议"
date: 2024-06-11
description: "本文简单对SGIP协议进行了介绍，并尝试用C++实现协议栈，但实际商用发送短信往往更加复杂，可以选择华为云消息&短信服务通过HTTP协议接入。"
tags: ["物联网","C++中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:1,comments:0,collects:0,views:335,"
---
本文分享自华为云社区《[华为云短信服务教你用C++实现Smgp协议](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%2F428570%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs/428570?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")》，作者：张俭。

引言&协议概述
=======

中国联合网络通信有限公司短消息网关系统接口协议（SGIP）是中国网通为实现短信业务而制定的一种通信协议，全称叫做Short Message Gateway Interface Protocol，用于在短消息网关（SMG）和服务提供商（SP）之间、短消息网关（SMG）和短消息网关（SMG）之间通信。

Perl的IO::Async模块提供了一套简洁的异步IO编程模型。

SGIP 协议基于客户端/服务端模型工作。由客户端（短信应用，如手机，应用程序等）先和短信网关（SMG Short Message Gateway）建立起 TCP 长连接，并使用 SGIP 命令与SMG进行交互，实现短信的发送和接收。在SGIP协议中，无需同步等待响应就可以发送下一个指令，实现者可以根据自己的需要，实现同步、异步两种消息传输模式，满足不同场景下的性能要求。

时序图
===

连接成功，发送短信
---------

![](/images/jueJin/6de66bf2f6ed48c.png)

连接成功，从SMGW接收到短信
---------------

![](/images/jueJin/ab678ffb0ead464.png)

协议帧介绍
=====

![image.png](/images/jueJin/e44260bb4fed4d5.png)

SGIP Header
-----------

*   **Message Length**：长度为4字节，整个PDU的长度，包括Header和Body。
*   **Command ID**：长度为4字节，用于标识PDU的类型（例如，Login、Submit等）。
*   **Sequence Number**：长度为8字节，序列号，用来匹配请求和响应。

使用C++实现SMGP协议栈里的建立连接
====================

```arduino
├── CMakeLists.txt
├── examples
│   └── smgp_client_login_example.cpp
└── include
└── sgipcpp
├── BoundAtomic.h
├── Client.h
├── Protocol.h
└── impl
├── BoundAtomic.cpp
├── Client.cpp
└── Protocol.cpp

```

CMakeLists.txt：用来生成Makefile和编译项目

examples：存放示例代码

*   smgp\_client\_login\_example.cpp：存放Smgp的login样例

include/sgipcpp：包含所有的C++头文件和实现文件

*   BoundAtomic.h：递增工具类，用来生成SequenceId
*   Client.h：Smgp定义，负责与Smgp服务进行通信，例如建立连接、发送短信等
*   Protocol.h：存放PDU，编解码等
*   impl/BoundAtomic.cpp：BoundAtomic类的实现
*   impl/Client.cpp：Client类的实现
*   impl/Protocol.cpp：Protocol中相关函数的实现

实现SequenceId递增
--------------

SequenceId是从1到0x7FFFFFFF的值，使用\*\*`BoundAtomic`\*\*类实现递增：

头文件

```arduino
#ifndef BOUNDATOMIC_H
#define BOUNDATOMIC_H

#include <atomic>
#include <cassert>

    class BoundAtomic {
    public:
    BoundAtomic(int min, int max);
    int next_val();
    
    private:
    int min_;
    int max_;
    std::atomic<int> integer_;
    };
    
    #endif //BOUNDATOMIC_H
```

内容

```arduino
#include "sgipcpp/BoundAtomic.h"

    BoundAtomic::BoundAtomic(int min, int max) : min_(min), max_(max), integer_(min) {
    assert(min <= max);
}

    int BoundAtomic::next_val() {
    int current = integer_.load();
    int next;
        do {
        next = current >= max_ ? min_ : current + 1;
        } while (!integer_.compare_exchange_strong(current, next));
        
        return next;
    }
```

实现SMGP PDU以及编解码函数
-----------------

在\*\*`Protocol.h`\*\*中定义SMGP PDU以及编解码函数：

头文件

```ini
#ifndef PROTOCOL_H
#define PROTOCOL_H

#include <cstdint>
#include <vector>

constexpr uint32_t SGIP_BIND = 0x00000001;
constexpr uint32_t SGIP_BIND_RESP = 0x80000001;
constexpr uint32_t SGIP_UNBIND = 0x00000002;
constexpr uint32_t SGIP_UNBIND_RESP = 0x80000002;
constexpr uint32_t SGIP_SUBMIT = 0x00000003;
constexpr uint32_t SGIP_SUBMIT_RESP = 0x80000003;
constexpr uint32_t SGIP_DELIVER = 0x00000004;
constexpr uint32_t SGIP_DELIVER_RESP = 0x80000004;
constexpr uint32_t SGIP_REPORT = 0x00000005;
constexpr uint32_t SGIP_REPORT_RESP = 0x80000005;
constexpr uint32_t SGIP_ADDSP = 0x00000006;
constexpr uint32_t SGIP_ADDSP_RESP = 0x80000006;
constexpr uint32_t SGIP_MODIFYSP = 0x00000007;
constexpr uint32_t SGIP_MODIFYSP_RESP = 0x80000007;
constexpr uint32_t SGIP_DELETESP = 0x00000008;
constexpr uint32_t SGIP_DELETESP_RESP = 0x80000008;
constexpr uint32_t SGIP_QUERYROUTE = 0x00000009;
constexpr uint32_t SGIP_QUERYROUTE_RESP = 0x80000009;
constexpr uint32_t SGIP_ADDTELESEG = 0x0000000A;
constexpr uint32_t SGIP_ADDTELESEG_RESP = 0x8000000A;
constexpr uint32_t SGIP_MODIFYTELESEG = 0x0000000B;
constexpr uint32_t SGIP_MODIFYTELESEG_RESP = 0x8000000B;
constexpr uint32_t SGIP_DELETETELESEG = 0x0000000C;
constexpr uint32_t SGIP_DELETETELESEG_RESP = 0x8000000C;
constexpr uint32_t SGIP_ADDSMG = 0x0000000D;
constexpr uint32_t SGIP_ADDSMG_RESP = 0x8000000D;
constexpr uint32_t SGIP_MODIFYSMG = 0x0000000E;
constexpr uint32_t SGIP_MODIFYSMG_RESP = 0x8000000E;
constexpr uint32_t SGIP_DELETESMG = 0x0000000F;
constexpr uint32_t SGIP_DELETESMG_RESP = 0x8000000F;
constexpr uint32_t SGIP_CHECKUSER = 0x00000010;
constexpr uint32_t SGIP_CHECKUSER_RESP = 0x80000010;
constexpr uint32_t SGIP_USERRPT = 0x00000011;
constexpr uint32_t SGIP_USERRPT_RESP = 0x80000011;
constexpr uint32_t SGIP_TRACE = 0x00001000;
constexpr uint32_t SGIP_TRACE_RESP = 0x80001000;

    struct Header {
    uint32_t total_length;
    uint32_t command_id;
    uint64_t sequence_number;
    };
    
        struct Bind {
        char login_type;
        char login_name[16];
        char login_passwd[16];
        char reserve[8];
        };
        
            struct BindResp {
            char result;
            char reserve[8];
            };
            
                struct Pdu {
                Header header;
                    union {
                    Bind bind;
                    BindResp bind_resp;
                    };
                    };
                    
                    size_t lengthBind();
                    std::vector<uint8_t> encodePdu(const Pdu& pdu);
                    Pdu decodePdu(const std::vector<uint8_t>& buffer);
                    
                    #endif //PROTOCOL_H
```

内容

```arduino
#include "sgipcpp/Protocol.h"
#include <cstring>
#include <ostream>
#include <stdexcept>
#include <sys/_endian.h>

    size_t lengthBind(const Bind& bind) {
    return 1 + 16 + 16 + 8;
}

    void encodeBind(const Bind& bind, std::vector<uint8_t>& buffer) {
    size_t offset = 16;
    
    buffer[offset++] = bind.login_type;
    std::memcpy(buffer.data() + offset, bind.login_name, 16);
    offset += 16;
    std::memcpy(buffer.data() + offset, bind.login_passwd, 16);
    offset += 16;
    std::memcpy(buffer.data() + offset, bind.reserve, 8);
}

    BindResp decodeBindResp(const std::vector<uint8_t>& buffer) {
    BindResp bindResp;
    
    size_t offset = 0;
    
    offset += sizeof(uint32_t);
    offset += sizeof(uint32_t);
    
    bindResp.result = buffer[offset++];
    std::memcpy(bindResp.reserve, buffer.data() + offset, sizeof(bindResp.reserve));
    
    return bindResp;
}

    std::vector<uint8_t> encodePdu(const Pdu& pdu) {
    size_t body_length;
        switch (pdu.header.command_id) {
        case SGIP_BIND:
        body_length = lengthBind(pdu.bind);
        break;
        default:
        throw std::runtime_error("Unsupported command ID for encoding");
    }
    
    std::vector<uint8_t> buffer(body_length + 16);
    uint32_t total_length = htonl(body_length + 16);
    std::memcpy(buffer.data(), &total_length, 4);
    
    uint32_t command_id = htonl(pdu.header.command_id);
    std::memcpy(buffer.data() + 4, &command_id, 4);
    
    uint32_t sequence_number = htonl(pdu.header.sequence_number);
    std::memcpy(buffer.data() + 8, &sequence_number, 8);
    
        switch (pdu.header.command_id) {
        case SGIP_BIND:
        encodeBind(pdu.bind, buffer);
        break;
        default:
        throw std::runtime_error("Unsupported command ID for encoding");
    }
    
    return buffer;
}

    Pdu decodePdu(const std::vector<uint8_t>& buffer) {
    Pdu pdu;
    
    uint32_t command_id;
    std::memcpy(&command_id, buffer.data(), 4);
    pdu.header.command_id = ntohl(command_id);
    
    uint64_t sequence_number;
    std::memcpy(&sequence_number, buffer.data() + 8, 8);
    pdu.header.sequence_number = ntohl(sequence_number);
    
        switch (pdu.header.command_id) {
        case SGIP_BIND_RESP:
        pdu.bind_resp = decodeBindResp(buffer);
        break;
        default:
        throw std::runtime_error("Unsupported command ID for decoding");
    }
    
    return pdu;
}
```

实现客户端和登录方法
----------

在\*\*`Client`\*\*中实现客户端和登录方法：

头文件

```c
#ifndef CLIENT_H
#define CLIENT_H

#include "BoundAtomic.h"
#include "Protocol.h"
#include "asio.hpp"
#include <string>

    class Client {
    public:
    Client(const std::string& host, uint16_t port);
    ~Client();
    
    void connect();
    BindResp bind(const Bind& bind_request);
    void close();
    
    private:
    std::string host_;
    uint16_t port_;
    asio::io_context io_context_;
    asio::ip::tcp::socket socket_;
    BoundAtomic* sequence_number_;
    
    void send(const std::vector<uint8_t>& data);
    std::vector<uint8_t> receive(size_t length);
    };
    
    #endif //CLIENT_H
```

内容

```c
#include "sgipcpp/Client.h"
#include <iostream>

Client::Client(const std::string& host, uint16_t port)
    : host_(host), port_(port), socket_(io_context_) {
    sequence_number_ = new BoundAtomic(1, 0x7FFFFFFF);
}

    Client::~Client() {
    close();
    delete sequence_number_;
}

    void Client::connect() {
    asio::ip::tcp::resolver resolver(io_context_);
    asio::connect(socket_, resolver.resolve(host_, std::to_string(port_)));
}

    BindResp Client::bind(const Bind& bind_request) {
    Pdu pdu;
    pdu.header.total_length = sizeof(Bind) + sizeof(Header);
    pdu.header.command_id = SGIP_BIND;
    pdu.header.sequence_number = sequence_number_->next_val();
    pdu.bind = bind_request;
    
    send(encodePdu(pdu));
    
    auto length_data = receive(4);
    uint32_t total_length = ntohl(*reinterpret_cast<uint32_t*>(length_data.data()));
    
    auto resp_data = receive(total_length - 4);
    Pdu resp_pdu = decodePdu(resp_data);
    return resp_pdu.bind_resp;
}

    void Client::close() {
    socket_.close();
}

    void Client::send(const std::vector<uint8_t>& data) {
    asio::write(socket_, asio::buffer(data));
}

    std::vector<uint8_t> Client::receive(size_t length) {
    std::vector<uint8_t> buffer(length);
    asio::read(socket_, asio::buffer(buffer));
    return buffer;
}
```

运行example，验证连接成功
----------------

```c
#include "sgipcpp/Client.h"
#include <iostream>

    int main() {
        try {
        Client client("127.0.0.1", 8801);
        
        client.connect();
        std::cout << "Connected to the server." << std::endl;
        
        Bind bindRequest;
        bindRequest.login_type = 1;
        std::string login_name = "1234567890123456";
        std::string login_password = "1234567890123456";
        std::string reserve = "12345678";
        std::copy(login_name.begin(), login_name.end(), bindRequest.login_name);
        std::copy(login_password.begin(), login_password.end(), bindRequest.login_passwd);
        std::copy(reserve.begin(), reserve.end(), bindRequest.reserve);
        
        BindResp response = client.bind(bindRequest);
            if (response.result == 0) {
            std::cout << "Login successful." << std::endl;
                } else {
                std::cout << "Login failed with result code: " << static_cast<int>(response.result) << std::endl;
            }
            
            client.close();
            std::cout << "Connection closed." << std::endl;
            
                } catch (const std::exception& e) {
                std::cerr << "Error: " << e.what() << std::endl;
            }
            
            return 0;
        }
```

![image.png](/images/jueJin/5bd1b031ba99405.png)

相关开源项目
======

*   [netty-codec-sms](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fprotocol-laboratory%2Fnetty-codec-sms "https://github.com/protocol-laboratory/netty-codec-sms") 存放各种SMS协议（如cmpp、sgip、smpp）的netty编解码器
*   [sms-client-java](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fprotocol-laboratory%2Fsms-client-java "https://github.com/protocol-laboratory/sms-client-java") 存放各种SMS协议的Java客户端
*   [sms-server-java](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fprotocol-laboratory%2Fsms-server-java "https://github.com/protocol-laboratory/sms-server-java") 存放各种SMS协议的Java服务端
*   [cmpp-python](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fprotocol-laboratory%2Fcmpp-python "https://github.com/protocol-laboratory/cmpp-python") cmpp协议的python实现
*   [cngp-zig](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fprotocol-laboratory%2Fcngp-zig "https://github.com/protocol-laboratory/cngp-zig") cmpp协议的python实现
*   [sgip-cpp](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fprotocol-laboratory%2Fsgip-cpp "https://github.com/protocol-laboratory/sgip-cpp") sgip协议的cpp实现
*   [smgp-perl](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fprotocol-laboratory%2Fsmgp-perl "https://github.com/protocol-laboratory/smgp-perl") smgp协议的perl实现
*   [smpp-rust](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fprotocol-laboratory%2Fsmpp-rust "https://github.com/protocol-laboratory/smpp-rust") smpp协议的rust实现

总结
==

本文简单对SGIP协议进行了介绍，并尝试用C++实现协议栈，但实际商用发送短信往往更加复杂，面临诸如流控、运营商对接、传输层安全等问题，可以选择**华为云消息&短信（Message & SMS）服务通过HTTP协议接入**，**华为云短信服务**是华为云携手全球多家优质运营商和渠道，为企业用户提供的通信服务。企业调用API或使用群发助手，即可使用验证码、通知短信服务。

[**点击关注，第一时间了解华为云新鲜技术~**](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")