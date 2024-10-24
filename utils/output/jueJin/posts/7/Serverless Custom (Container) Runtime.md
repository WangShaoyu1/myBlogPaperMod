---
author: "政采云技术"
title: "Serverless Custom (Container) Runtime"
date: 2021-07-07
description: "本文已参与好文召集令活动，点击查看：后端、大前端双赛道投稿，2万元奖池等你挑战！ 我们知道 Serverless 可以理解为 Serverless = FaaS + BaaS 。Serverle"
tags: ["Serverless","前端","Node.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:58,comments:0,collects:15,views:4449,"
---
本文已参与好文召集令活动，点击查看：[后端、大前端双赛道投稿，2万元奖池等你挑战！](https://juejin.cn/post/6978685539985653767 "https://juejin.cn/post/6978685539985653767") ![](/images/jueJin/d4eb6a01e656484.png)

> 这是第 106 篇不掺水的原创，想获取更多原创好文，请搜索公众号关注我们吧~ 本文首发于政采云前端博客：[Serverless Custom (Container) Runtime](https://link.juejin.cn?target=https%3A%2F%2Fzoo.team%2Farticle%2Fserverlesscustom "https://zoo.team/article/serverlesscustom")

![雪霁.png](/images/jueJin/d6a3993b4110476.png)

### 背景

我们知道 Serverless 可以理解为 **Serverless = FaaS + BaaS** 。Serverless 应用中，对于服务端业务逻辑代码，开发者是以**函数**的形式去实现的，即 **FaaS**（函数即服务）。( Serverless 相关文章可以看下团队[结合阿里云 FC 谈谈我对 FaaS 的理解](https://juejin.cn/post/6892728697082609672 "https://juejin.cn/post/6892728697082609672"))

对于云厂商的 FaaS 平台，虽然他们支持多种编程语言及版本的标准运行环境，但毕竟还是**有限**的。所以，为了满足用户更多个性化开发语言及版本的函数实现需求，他们提供了 **Custom Runtime 服务**，即**可定制化运行环境**，支持用户用任何编程语言编写的函数。

以阿里云函数计算 FC 为例，这是它所支持的开发语言列表：

支持语言

运行环境

Node.js

Node.js 6.10（runtime=nodejs6）、  
Node.js 8.9.0（runtime=nodejs8）、  
Node.js 10.15.3（runtime=nodejs10）  
Node.js 12.16.1（runtime=nodejs12）

Python

Python 2.7（runtime = python2.7）  
Python 3.6（runtime = python3）

PHP

PHP 7.2.7（Runtime=php7.2）

Java

Java OpenJDK 1.8.0（runtime=java8）

C#

.NET Core 2.1（runtime=dotnetcore 2.1）

Go

Go Custom Runtime

Ruby

Ruby Custom Runtime

PowerShell

PowerShell Custom Runtime

TypeScript

TypeScript Custom Runtime

F#

F# Custom Runtime

C++

C++ Custom Runtime

Lua

Lua Custom Runtime

Dart

Dart Custom Runtime

其他语言

Custom Runtime

可以看出，对于我们前端工程师，如果想使用阿里云 FC 平台，并不能随心所欲的使用 Node.js 和 TypeScript 。因为 Node.js，只支持表格中的四种版本，而 TypeScript ，FC 平台自身完全不支持。所以要想使用 Node.js 的其它版本和 TypeScript，就需要自定义运行时。

那么什么是 Custom Runtime 呢？

### 概念

运行时（ Runtime ）指函数代码在运行时所依赖的环境，包括任何库、代码包、框架或平台。Custom Runtime 就是完全由**用户自定义函数的运行环**境。

FaaS 平台通过开放实现自定义函数运行时，支持根据需求使用**任意开发语言的任意版本**来编写函数。

### 作用

阿里云官方文档中说到，基于 Custom Runtime 我们可以实现这两件事：

*   定制个性化语言（例如 Go、Lua、Ruby ）和各种语言的小版本（例如 Python 3.7、Node.js 14）的执行环境，打造属于您的运行环境。
*   **一键迁移**现有的 Web 应用或基于传统开发的 Web 项目到函数计算平台，不用做任何改造。

实现 Custom Runtime
-----------------

本文将以阿里云 FC 为例，实现一个 Custom Runtime。其它平台比如腾讯云 SCF 等，原理和过程也都大致相同。

### 工作原理

Custom Runtime 本质上是一个 **HTTP Server**，代码里面包含一个名为 **bootstrap 的启动文件**，之后**这个 HTTP Server 接管了函数计算平台的所有请求**，包括事件调用或者 HTTP 函数调用等。

如今 `Typescript` 在 Node 中的应用已经越来越广泛，所以笔者将实现一个可以运行 TS 代码的 TypeScript 运行时。

### 操作步骤

#### 准备工作

为了更快更好地玩转 Serverless 应用，需要先安装阿里云的一个 [Fun工具](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F64204.html "https://help.aliyun.com/document_detail/64204.html")，它是一个用于支持 Serverless 应用部署的工具，能帮助我们便捷地管理函数计算、API 网关、日志服务等资源。它通过一个资源配置文件（template.yml），协助我们进行**开发、构建、部署**操作。

安装配置过程如下：

（1）安装：

```bash
// 安装命令
$ npm install @alicloud/fun -g

// 执行 fun --version 检查安装是否成功
$ fun --version

3.6.21
```

（2）安装好后，使用`fun config`命令配置账户信息（[配置文档](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F146702.html%23section-h9e-864-bom "https://help.aliyun.com/document_detail/146702.html#section-h9e-864-bom")），按照提示依次配置 Account ID、AccessKey ID、AccessKey Secret、Default Region Name。

配置完成后，先在本地创建一个 TypeScript 项目 custom-runtime-typescript，并安装相关依赖。

```$
npm i typescript ts-node @types/node
```

接下来，开始 Custom Runtime 的开发流程，一步一步打造属于自己的自定义运行环境。

#### 1.搭建一个具有监听端口的 HTTP Server

*   需要注意的是，这个服务一定要监听`0.0.0.0:CAPort`或`*:CAPort`端口，默认是 9000。如果使用`127.0.0.1:CAPort`端口，会导致请求超时

用 TS 编写一个 HTTP Server 文件 server.ts 如下：

注意：在开发函数具体的逻辑之前，一般会确认开发的函数是事件函数还是 HTTP 函数

```typescript
import * as http from 'http';

// 创建一个 HTTP Server
    const server = http.createServer(function (req: http.IncomingMessage, res: http.ServerResponse): void {
    var rid = req.headers["x-fc-request-id"];
    console.log(`FC Invoke Start RequestId: ${rid}`);
    
    var rawData = "";
        req.on('data', function (chunk) {
        rawData += chunk;
        });
        
            req.on('end', function () {
            // 处理业务逻辑 ……
            console.log(rawData);
            
            res.writeHead(200);
            res.end(rawData);
            console.log(`FC Invoke End RequestId: ${rid}`);
            });
            });
            
            server.timeout = 0; // never timeout
            server.keepAliveTimeout = 0; // kee palive, never timeout
            
            // 启动 HTTP 服务并监听 0.0.0.0:9000 端口
                server.listen(9000, '0.0.0.0', function () {
                console.log('FunctionCompute typescript runtime inited.');
                });
                
                
```

编写完成后，可以先在本地测试该服务是否启动成功，通过安装在项目中的 ts-node 命令来运行上述代码：

```bash
# 启动 HTTP 服务

$ ./node_modules/.bin/ts-node server.ts
```

启动后，在另一个终端中使用 curl 命令测试：

```bash
$ curl 0.0.0.0:9000 -X POST -d "hello world" -H "x-fc-request-id:123"

hello world
```

若服务已正常启动，说明它可以在接收 HTTP 请求后处理业务逻辑，然后将处理结果再以 HTTP 响应的形式返回给 FaaS 平台。

#### 2.创建一个启动目标 Server 的可执行文件 bootstrap

函数计算冷启动 Custom Runtime 时，会默认调用 bootstrap 文件启动自定义的 HTTP Server。然后这个 HTTP Server 接管了函数计算系统的所有请求。

*   bootstrap 是运行时入口引导程序文件，它会告诉 FaaS 如何启动你的自定义运行时。Custom Runtime 加载函数时会固定检索 bootstrap 同名文件，并执行该程序来启动 Custom Runtime 运行时。
*   bootstrap 需具备 777 或 755 可执行权限
*   如果是 shell 脚本，一定要添加`#!/bin/bash`

创建 bootstrap 文件如下：

```bash
#!/bin/bash
./node_modules/.bin/ts-node server.ts
```

#### 3.编写资源配置文件 template.yaml

在当前目录下编写一份用于部署到函数计算的资源配置文件 template.yaml：

```yaml
ROSTemplateFormatVersion: '2015-09-01'
Transform: 'Aliyun::Serverless-2018-04-03'
Resources:
custom-runtime: # 服务名称
Type: 'Aliyun::Serverless::Service'
Properties:
Description: 'helloworld'
custom-runtime-ts: # 函数名称
Type: 'Aliyun::Serverless::Function'
Properties:
Handler: index.handler # Handler 在此时没有实质意义，填写任意的一个满足函数计算 Handler 字符集约束的字符串即可， 例如 index.handler
Runtime: custom # custom 代表自定义运行时
MemorySize: 512
CodeUri: './'
```

#### 4.部署、调用测试、完成

（1）使用`fun deploy -y` 命令将我们的自定义运行时和业务逻辑代码所有资源部署到阿里云。

![image-20210505220309647](/images/jueJin/55cc6d9b8bdb4a7.png)

（2）使用命令调用部署函数，验证

```bash
$ fun invoke -e "hello,my custom runtime"
```

![image-20210505220520916](/images/jueJin/12d18e40cd0f495.png)

看到成功输出，就代表我们的 custom runtime 大功告成了！它可以直接运行我们写的 TS 代码了。

![image-20210505223345696](/images/jueJin/14f8efab7cce43b.png)

实现 Custom Container Runtime
---------------------------

TS 的运行环境问题可以用 Custom Runtime 解决，但是 Node 某些版本平台不支持的问题，就不能用同样的办法了。因为 Node 是全局安装的，依赖系统环境。

FC 平台已经为我们想好了此类问题的解决办法，为我们提供了 Custom Container Runtime （自定义容器运行环境）的能力。FaaS 平台有这种能力，是因为它的底层实现原理是 **Docker 容器**，所以它通过运用容器技术，**把我们的应用代码和运行环境打包为 Docker 镜像**，保持环境一致性。实现一次构建，到处运行。

#### 工作原理

Custom Container Runtime 工作原理与[Custom Runtime](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F132044.htm%23Task-2259898 "https://help.aliyun.com/document_detail/132044.htm#Task-2259898") 基本相同：

*   函数计算系统初始化执行环境实例前会扮演该函数的服务角色，获得临时用户名和密码并**拉取镜像**。
*   拉取成功后根据指定的启动命令 Command、参数 Args 及 CAPort 端口（默认 9000 ）启动自定义的 HTTP Server。
*   然后这个 HTTP Server 接管了函数计算系统的所有请求，包括来自事件函数调用及 HTTP 函数调用。

下面我们自定义一个 Node v16.1.0 版本的容器运行环境。

#### 操作步骤

##### 1.自定义 HTTP Server

这一步和 Custom Runtime 相同，使用 Node.js Express 自定义一个 Http 服务 server.js，GET 和 POST 方法分别路由至不同的 Handler:

```javascript
// server.js 文件
'use strict';

const express = require('express');

// Constants
const PORT = 9000;
const HOST = '0.0.0.0';

// HTTP 函数调用
const app = express();
    app.get('/*', (req, res) => {
    res.send(`Hello FunctionCompute, http function, runtime is : Node ${process.version}\n`);
    });
    
    // 事件函数调用
        app.post('/invoke', (req, res) => {
        res.send(`Hello FunctionCompute, event function,runtime is : Node ${process.version}\n`);
        });
        
        // 启动 HTTP 服务并监听 9000 端口
        var server = app.listen(PORT, HOST);
        console.log(`Running on http://${HOST}:${PORT}`);
        
        server.timeout = 0; // never timeout
        server.keepAliveTimeout = 0; // keepalive, never timeout
        
```

启动服务，本地测试一下：

```bash
# 启动 HTTP 服务
$ node server.js
``````bash
# 新开一个终端，通过 curl 命令测试
$ curl http://0.0.0.0:9000
Hello FunctionCompute, http GET, this runtime is : Node v11.5.0     # 这是我本地的 Node 版本，后面在自定义容器中会输出 v16.1.0
```

验证通过。

##### 2.构建镜像并上传

同样的，需要先做两个准备工作：

*   1）安装启动 Docker
    
*   2）使用阿里云容器镜像服务[创建命名空间和镜像仓库](https://link.juejin.cn?target=https%3A%2F%2Fcr.console.aliyun.com%2F "https://cr.console.aliyun.com/")存放我们的自定义镜像
    

接下来，先编写 Dockerfile，再构建包含我们 Node 指定版本运行环境和应用代码的镜像，最后上传到自己的镜像仓库。

（有需要的同学可以先看下这篇文章[如何把一个 Node.js web 应用程序给 Docker 化](https://link.juejin.cn?target=https%3A%2F%2Fnodejs.org%2Fzh-cn%2Fdocs%2Fguides%2Fnodejs-docker-webapp%2F "https://nodejs.org/zh-cn/docs/guides/nodejs-docker-webapp/") ）

(1) 编写 Dockerfile：

```dockerfile
# 基于基础镜像 node:16.1.0-alpine3.11 构建我们自己的镜像
FROM node:16.1.0-alpine3.11

# 设置容器工作目录
WORKDIR /usr/src/app

# 将 package.json 和 package-lock.json 都拷贝到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install

# 将当前目录下的所有文件拷贝到容器工作目录中
COPY . .

# 暴露容器 8080 端口
EXPOSE 8080

# 在容器中启动应用程序
ENTRYPOINT [ "node", "server.js" ]

```

（2）安装启动 Docker，登录阿里云镜像服务，构建并上传：

```bash
# 登录
$ sudo docker login --username=xxx registry.cn-hangzhou.aliyuncs.com
```

登录成功后，先构建 Docker 镜像：

```bash
# 指定ACR镜像地址：其中 my_serverless 为你自己的容器命名空间；nodejs 为你自己的镜像仓库名称；v16.1.0 为镜像版本号
$ export IMAGE_NAME="registry.cnhangzhou.aliyuncs.com/my_serverless/nodejs:v16.1.0"
``````bash

# 构建镜像
# -t 给镜像取名字打标签，通常 name:tag 或者 name 格式
$ docker build -t $IMAGE_NAME .
```

再启动容器，本地打开浏览器 [http://localhost:9000/](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A9000%2F "http://localhost:9000/") 看是否可以正常响应，来验证我们的自定义镜像是否可以运行成功：

```bash
# 启动容器： 将容器的 9000 端口映射到主机的 9000 端口
$ docker run -p 9000:9000 -d $IMAGE_NAME
```![image-20210514150709489](/images/jueJin/6acbfc32153e48f.png)

验证通过后，最后上传镜像：

```bash
# 上传镜像
$ docker push $IMAGE_NAME
```

上传成功后，可以在阿里云镜像服务中看到我们的镜像。后面就可以使用它啦！

![image-20210509153919228](/images/jueJin/9a32a2ed92de4f3.png)

##### 3.定义 template.yaml

创建一个 `template.yaml`文件如下：

```yaml
ROSTemplateFormatVersion: '2015-09-01'
Transform: 'Aliyun::Serverless-2018-04-03'
Resources:
CustomContainerRuntime: # 服务名称
Type: 'Aliyun::Serverless::Service'
Properties:
Policies:
- AliyunContainerRegistryReadOnlyAccess
InternetAccess: true
nodejs-express-http: # 函数名称
Type: 'Aliyun::Serverless::Function'
Properties:
Description: 'HTTP function powered by nodejs express'
Runtime: custom-container # 表示自定义容器
Timeout: 60
CAPort: 9000 # 注意！这里Custom Container Runtime使用的监听端口一定要和HTTP Server监听的端口保持一致，否则会出现错误
Handler: not-used
MemorySize: 1024
CodeUri: ./   # Root directory for the function or the Dockerfile path
CustomContainerConfig: # 容器镜像配置
# Sample image value: registry-vpc.cn-shenzhen.aliyuncs.com/fc-demo/nodejs-express:v0.1  使用同地域的VPC镜像地址加速
Image: 'registry.cn-hangzhou.aliyuncs.com/my_serverless/nodejs:v16.1.0'
Command: '[ "node"]'
Args: '["server.js"]'
Events:
http-trigger-test:
Type: HTTP
Properties:
AuthType: ANONYMOUS
Methods: ['GET', 'POST', 'PUT']
```

##### 4.部署测试

```bash
# 使用命令部署到 FC
$ fun deploy -y
```![image-20210509163842880](/images/jueJin/319556a34c8b4ad.png)

部署成功后，我们去 FC 平台上进行测试。

因为我们在`template.yaml` 中配置的触发器是 http 触发器，所以我们点击“执行”按钮进行调试，发现正常运行,返回结果为 runtime is : Node v16.1.0，说明我们的自定义容器运行环境也成功实现了！

![image-20210509163945647](/images/jueJin/a3553a89ace54a6.png)

小结
--

Custom Runtime 为我们打破了 FaaS 平台对语言的限制；Custom Container Runtime 让开发者可以将应用代码和运行环境打包成容器镜像作为函数的交付物，优化开发者体验、提升开发和交付效率。

自定义（容器）运行时让我们开发者使用 Serverless 的自由度更高，通过它们可以让我们无需代码改造，一键迁移我们的 Web 应用。

参考资料
----

[what-is-runtime](https://link.juejin.cn?target=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F3900549%2Fwhat-is-runtime "https://stackoverflow.com/questions/3900549/what-is-runtime")

[为阿里云 serverless 打造 Deno 运行时](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F137204273 "https://zhuanlan.zhihu.com/p/137204273")

[Custom Runtime 说明](https://link.juejin.cn?target=https%3A%2F%2Fcloud.tencent.com%2Fdocument%2Fproduct%2F583%2F47274 "https://cloud.tencent.com/document/product/583/47274")

[fun 工具](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F64204.html "https://help.aliyun.com/document_detail/64204.html")

[函数计算支持容器镜像-加速应用 Serverless 进程](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.aliyun.com%2Farticle%2F772788 "https://developer.aliyun.com/article/772788")

[Custom Runtime - 打破云函数语言限制](https://link.juejin.cn?target=https%3A%2F%2Fcloud.tencent.com%2Fdeveloper%2Farticle%2F1690709 "https://cloud.tencent.com/developer/article/1690709")

推荐阅读
----

[Vite 特性和部分源码解析](https://link.juejin.cn?target=https%3A%2F%2Fzoo.team%2Farticle%2Fabout-vite "https://zoo.team/article/about-vite")

[我在工作中是如何使用 git 的](https://juejin.cn/post/6974184935804534815 "https://juejin.cn/post/6974184935804534815")

[15 分钟学会 Immutable](https://juejin.cn/post/6976798974757830687 "https://juejin.cn/post/6976798974757830687")

开源作品
----

*   政采云前端小报

**开源地址 [www.zoo.team/openweekly/](https://link.juejin.cn?target=https%3A%2F%2Fwww.zoo.team%2Fopenweekly%2F "https://www.zoo.team/openweekly/")** (小报官网首页有微信交流群)

招贤纳士
----

政采云前端团队（ZooTeam），一个年轻富有激情和创造力的前端团队，隶属于政采云产品研发部，Base 在风景如画的杭州。团队现有 40 余个前端小伙伴，平均年龄 27 岁，近 3 成是全栈工程师，妥妥的青年风暴团。成员构成既有来自于阿里、网易的“老”兵，也有浙大、中科大、杭电等校的应届新人。团队在日常的业务对接之外，还在物料体系、工程平台、搭建平台、性能体验、云端应用、数据分析及可视化等方向进行技术探索和实战，推动并落地了一系列的内部技术产品，持续探索前端技术体系的新边界。

如果你想改变一直被事折腾，希望开始能折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变既定的节奏，将会是“5 年工作时间 3 年工作经验”；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊… 如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的前端团队的成长历程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 `ZooTeam@cai-inc.com`

![](/images/jueJin/98d3aa3d1f8646a.png)