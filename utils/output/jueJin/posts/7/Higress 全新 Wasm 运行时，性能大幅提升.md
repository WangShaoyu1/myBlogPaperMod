---
author: "阿里云云原生"
title: "Higress 全新 Wasm 运行时，性能大幅提升"
date: 2024-04-15
description: "本文介绍 Higress 将 Wasm 插件的运行时从 V8 切换到 WebAssembly Micro Runtime (WAMR) 的最新进展。通过切换到 WAMR 并开启 AOT 模式大幅提升了"
tags: ["前端","云原生中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:4,comments:0,collects:5,views:1516,"
---
_本文作者：_

_澄潭，阿里云 API 网关软件工程师，Higress 开源项目主要贡献者_

_何良，Intel Web Platform Engineering 软件工程师，WAMR 开源项目主要贡献者_

本文介绍 Higress 将 Wasm 插件的运行时从 V8 切换到 WebAssembly Micro Runtime (WAMR) 的最新进展。通过切换到 WAMR 并开启 AOT 模式大幅提升了 Wasm 插件性能，从我们的测试中大部分插件平均有 50% 左右的性能提升，一些逻辑复杂的插件性能直接翻倍。

Higress Wasm 插件
---------------

Higress 作为首个推出 Wasm 扩展能力的云产品网关，从 2022 年就上线了 Wasm 插件市场，我们使用 Wasm 技术作为主要的网关扩展手段，是因为它能为用户带来的独特价值：

**1\. 工程可靠性：** 相比 Lua 等动态类型+解释执行语言，Wasm 可基于多种静态类型语言编译，可以做编译期检查，避免运行时出错把生产环境变成代码捉虫现场。

**2\. 沙箱安全性：** Wasm 插件运行在严格的虚拟机沙箱环境内，有自己的独立内存空间，不能直接访问外部内存，可以避免插件代码 bug 导致遭到缓冲区溢出、远程代码执行等攻击。

**3\. 热更新：** Higress 基于 Envoy 的 xDS 机制，插件二进制和配置都可以独立热更新，不会引起连接断开，对 WebSocket/gRPC 等业务场景更友好。

Higress 站在 Istio/Envoy 的肩膀上，为 Wasm 插件机制增加了三个核心能力：

**1\. 域名/路由级生效：** Istio/Envoy 自带的全局生效方式难以满足大部分场景需求，而基于 Higress Wasm sdk 开发的插件可以做到这点，同时编译出的插件也跟 Istio/Envoy 生态兼容（仅全局生效）。

**2\. Redis 访问能力：** 提供了访问 Redis 的 Host Function，插件代码可以基于 Redis 实现多种能力，例如全局限流，Session 状态管理等。

**3\. 虚拟机自愈机制：** 开发的插件逻辑中若出现了空指针访问、数组越界、内存泄漏等问题，将被运行时系统捕获，不会导致网关崩溃；Higress 支持 Wasm 模块异常后自动重启，并能在快速止血的同时，通过告警通知用户出现问题的代码堆栈。

从 Higress 的企业用户看 Wasm 插件技术的采用周期，已经跨域过鸿沟，步入早期采用大众阶段，核心的驱动力是性能红利带来的成本下降。用户使用 Wasm 插件来开发满足自己特定业务需求的能力，对于鉴权、加解密、会话管理等逻辑在网关完成计算资源的卸载，无需后端服务处理，从而全局降低计算成本。

性能数据上，之前发表的这篇文档[《通过Higress Wasm插件3倍性能实现Spring Cloud Gateway功能》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzUzNzYxNjAzMg%3D%3D%26mid%3D2247558515%26idx%3D1%26sn%3D4905a64e53998d10f9524e89c0530f3c%26scene%3D21%23wechat_redirect "https://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247558515&idx=1&sn=4905a64e53998d10f9524e89c0530f3c&scene=21#wechat_redirect")反馈了过去的性能成果。

在 Higress 将 Wasm 运行时从 V8 替换为 WAMR 后，**Wasm 插件的性能对比之前又有了大幅提升。**

Wasm 运行时升级：从 V8 到 WAMR
----------------------

### V8 存在的问题

Wasm 技术诞生于浏览器场景，作为 Chromium 的 JS 引擎，V8 是最早支持 Wasm 的运行时之一，V8 引擎基于 JIT 模式运行 Wasm 模块，有着很好的性能。但也存在以下问题：

1.  V8 项目复杂度很高：Wasm 相关实现跟 JS 处理逻辑有较多耦合，比如早期的 Envoy Wasm 插件的一个 bug 就是 V8 为优化 JS 执行内存引入指针压缩导致。

> bug：_[bugs.chromium.org/p/v8/issues…](https://link.juejin.cn?target=https%3A%2F%2Fbugs.chromium.org%2Fp%2Fv8%2Fissues%2Fdetail%3Fid%3D12592 "https://bugs.chromium.org/p/v8/issues/detail?id=12592")_

2.  V8 社区和 Envoy 社区之间缺少协作：Envoy 目前对于 V8 的版本依赖还停留在 2022 年的提交，无法支持 Wasm GC 等新特性，因为项目复杂度高，升级 V8 依赖的风险也很高。
    
3.  客户端偏好：V8 的用户和开发者大多来自客户端，考虑设备兼容性，更重视 JIT 模式的优化，AOT 模式下性能提升不大，无法完全发挥 Wasm 性能优势。
    

### WAMR 的优势

WAMR 是最早由 Intel 团队开发，在字节码联盟（Bytecode Alliance，面向 Wasm 软件生态的非盈利组织）下的一个广受欢迎的 WebAssembly 运行时开源项目。目前社区活跃的贡献者包含来自 Intel、小米、亚马逊、索尼、Midokura、西门子、蚂蚁等公司的工程师。WAMR 使用 C 语言开发，具有良好的平台适应性。支持解释模式、即时编译及预编译等模式运行 Wasm 模块，有着优良的性能，在多个公开性能测评报告中均表现优异，同时又极低的资源开销，可以在 100KB 内存中运行单个 Wasm 实例。

### 性能对比

*   **压测工具：** k6
    
*   **服务器 CPU 型号：** Intel(R) Xeon(R) Platinum 8369B CPU @ 2.90GHz
    
*   **压测方式：** Higress 启动 2 个 worker 线程，压测期间固定 k6 的压力，跑满两个线程
    

选取了部分 Higress 插件进行性能测试，情况如下：

**插件名称**

**插件用途**

**V8 (ms)**

**WAMR (ms)**

**性能提升**

bot-detect

基于正则识别阻止互联网爬虫对站点资源的爬取

1.25

0.64

95%

hmac-auth

基于HMAC算法为HTTP请求生成不可伪造的签名， 并基于签名实现身份认证和鉴权

4.44

3.25

36%

jwt-auth

基于JWT(JSON Web Tokens)进行认证鉴权

11.98

7.46

60%

jwt-logout

基于Redis实现JWT的弱状态管理，解决JWT无法登出的问题

14.08

8.44

66%

key-auth

基于 API Key 进行认证鉴权

1.66

1.16

43%

oauth

基于JWT进行OAuth2 Access Token签发

10.15

4.75

113%

_注：表格中的数据为单请求平均附加延时_

整体来看，Wasm 指令越复杂的插件，WAMR 的提升越明显。上述所有插件除 jwt-logout 是企业版插件未开源以外，其余插件均可以在 Higress 开源仓库目录下查看对应源码实现：_[github.com/alibaba/hig…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Falibaba%2Fhigress%2Ftree%2Fmain%2Fplugins%2Fwasm-cpp%2Fextensions "https://github.com/alibaba/higress/tree/main/plugins/wasm-cpp/extensions")_

编译生成 AOT 文件，可以使用 wamrc 这个 WAMR 提供的官方编译工具：wamrc --invoke-c-api-import -o plugin.aot plugin.wasm。

为了生成的 wasm 文件可以兼容 JIT 模式，使用 WAMR 仓库下的脚本生成合并文件：python3 wasm-micro-runtime/test-tools/append-aot-to-wasm/append\_aot\_to\_wasm.py --aot plugin.aot --wasm plugin.wasm -o plugin.aot.wasm

以提升最大的 oauth 插件为例，可以使用下述配置进行复现：

**k6 压测命令：** k6 run --vus 300 ./script.js --duration 60s

**k6 压测脚本：**

```javascript
import http from 'k6/http';
import { check } from 'k6';

    export default function () {
    const res = http.get('http://11.164.3.16:10000/',{headers: {'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6ImFwcGxpY2F0aW9uL2F0K2p3dCJ9.eyJhdWQiOiJ0ZXN0MiIsImNsaWVudF9pZCI6Ijk1MTViNTY0LTBiMWQtMTFlZS05YzRjLTAwMTYzZTEyNTBiNSIsImV4cCI6MTY2NTY3MzgyOSwiaWF0IjoxNjY1NjczODE5LCJpc3MiOiJIaWdyZXNzLUdhdGV3YXkiLCJqdGkiOiIxMDk1OWQxYi04ZDYxLTRkZWMtYmVhNy05NDgxMDM3NWI2M2MiLCJzY29wZSI6InRlc3QiLCJzdWIiOiJjb25zdW1lcjEifQ.LsZ6mlRxlaqWa0IAZgmGVuDgypRbctkTcOyoCxqLrHY'}});
    check(res, { 'status was 200': (r) => r.status == 200 });
}
```

**envoy 配置片段：**

```bash

- name: envoy.filters.http.wasm
typed_config:
"@type": type.googleapis.com/envoy.extensions.filters.http.wasm.v3.Wasm
config:
name: "my_plugin"
configuration:
"@type": "type.googleapis.com/google.protobuf.StringValue"
value: |
    {
        "consumers": [
            {
            "name": "consumer1",
            "client_id": "9515b564-0b1d-11ee-9c4c-00163e1250b5",
            "client_secret": "9e55de56-0b1d-11ee-b8ec-00163e1250b5"
        }
        ],
        "clock_skew_seconds": 3153600000
    }
    vm_config:
    runtime: envoy.wasm.runtime.wamr
    #runtime: envoy.wasm.runtime.v8
    code:
    local:
    filename: "oauth.aot.wasm"
    allow_precompiled: true
```

### 性能提升原因

主要的原因包含：

1.  WAMR 提供了深度优化的预编译的能力。在部署前，WAMR 将 Wasm opcodes 翻译为 IR，经过定制的优化流水线，生成指定平台的机器码。在运行时，执行预编译后的 Wasm 可以获得媲美 native binary 的性能。
    
2.  WAMR 采用了高度优化的 FFI。有效降低在 host(c/c++) 和 guest(wasm) 两个世界间“穿梭”时需要的类型转换和内存拷贝的次数，减少不必要的损耗。
    
3.  WAMR 可以智能感知平台的硬件加速能力并予以充分利用。比如当运行在 X86 平台时，WAMR 实现了学术界最新提出的 "segue" 算法，利用 GS 寄存器作为寻址方法，提升了访问 Wasm 线性空间的效率。
    

未来展望
----

在 Higress 团队和 WAMR 团队之间的紧密协作下，除了在网关场景提升 Wasm 插件性能，还带来了很多实用的新特性即将发布，敬请期待：

1.  支持生成 CPU 火焰图，例如下面是 Wasm 插件中执行 fibonacci 递归看到的 CPU 火焰图：

![图片](/images/jueJin/de39cb4ca517412.png)

2.  支持 Wasm 插件中逻辑问题导致 Crash 后，插件日志中打印完整的函数堆栈，并可以通过 WAMR 提供的 addr2line 工具定位到源代码中的具体行号。
    
3.  支持观测每个 Wasm 插件模块的 CPU 和内存占用情况。
    
4.  支持使用 TypeScript 编写 Wasm 插件，完整语法支持。
    

欢迎更多开发者一起参与 Higress 和 WAMR 开源社区，GitHub 项目地址：

**Higress：** [github.com/alibaba/hig…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Falibaba%2Fhigress "https://github.com/alibaba/higress")

**WAMR：** [github.com/bytecodeall…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fbytecodealliance%2Fwasm-micro-runtime "https://github.com/bytecodealliance/wasm-micro-runtime")