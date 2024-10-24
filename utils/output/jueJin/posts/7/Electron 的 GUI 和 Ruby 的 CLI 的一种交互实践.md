---
author: ""
title: "Electron 的 GUI 和 Ruby 的 CLI 的一种交互实践"
date: 2023-02-14
description: "本文从命令行迭代的 4 个阶段出发，重点介绍了 Ruby 脚本的命令行化以及 CLI 的 GUI 化。"
tags: ["Electron","Ruby中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读16分钟"
weight: 1
selfDefined:"likes:8,comments:0,collects:15,views:5216,"
---
> 本文作者：[linusflow](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fxu984386604 "https://github.com/xu984386604")

背景
--

在一个中大型的客户端研发团队中，会使用诸如 Ruby、Shell、Python 等脚本语言编写的脚本、命令行和 GUI 工具来完成各项任务。比如 iOS、Android 开发人员想在一台新电脑上开发一个新 App ，那么需要先在本地配置好开发环境，之后才能通过 Xcode 或 Android Studio 进入开发。

在 App 的初期，开发人员可能只需要简单的几行命令即可完成环境的配置。随着 App 规模变大，配置环境所需执行的命令越来越多，此时可以使用一种或多种脚本语言将这些命令聚合到脚本文件里面，这样执行该脚本文件即可快速执行繁多的命令。当 App 规模进一步变大，散落的脚本文件会越来越多，变得难以使用和维护，此时可以将这些散落的脚本文件捆绑到一起，形成一个或多个 CLI 工具集，CLI 工具集可以创建一个或多个新的命令的方式给开发人员使用。随着时间的推移和发展，App 的规模会进一步变大，此时会发现 CLI 工具集越来越复杂，提供的命令的调用时的参数和选项会变得复杂又多样，开发人员难以记忆这些又长又多的参数和选项。此时可以将这些 CLI 工具集聚合到 GUI 上，让开发人员仅通过点击按钮即可完成环境的配置，极大的提高了开发人员的使用体验和效率。下面分析出了命令行迭代（执行）的 4 个阶段示意图，并在后续的篇幅中将只叙述第 3 阶段和第 4 阶段。文章后续的描述中，有关「CLI」和「CLI 工具集」的描述是等同的，「命令行」是针对 CLI 中 3 个阶段的另外一种描述。

![命令行迭代的 4 个阶段示意图](/images/jueJin/4ab4f6ce7409a72.png)

一个中大型 App 的 DevOps 会同时用到 CLI 和 GUI 来完成研发过程中的任务，其中 GUI 和 CLI 之间是存在交互通信，最终开发人员和 GUI、CLI 的交互示意图如下所示：

![开发人员和 GUI、CLI 的交互示意图](/images/jueJin/2e4b2fd4255d971.png)

笔者在 iOS 团队，故选取了当前热门的桌面端技术 Electron 作为 GUI，熟悉的脚本语言 Ruby 作为 CLI ，聚焦命令行迭代的第 3 和第 4 阶段，给出 Electron 的 GUI 和 Ruby 的 CLI 的一种交互实践。

Ruby 脚本命令行化
-----------

在命令行迭代的 4 个阶段中的第 3 阶段，我们可以将 Ruby 脚本做成 CLI 工具集，也可以理解为是将 Ruby 脚本进程命令行化。下面将给出 Ruby 脚本命令行化的实践方式。

将散落的 Ruby 脚本打包成一个 [gem 包](https://link.juejin.cn?target=https%3A%2F%2Fguides.rubygems.org "https://guides.rubygems.org")，可以方便代码的复用、分享和按版本迭代维护，同时方便分发、下载和安装。gem 包可以类比为 Centos 的 yum ，前端的 npm 包。我们可以使用 [Bundler](https://link.juejin.cn?target=https%3A%2F%2Fwww.bundler.cn%2F "https://www.bundler.cn/") 来 [创建 gem 包](https://link.juejin.cn?target=https%3A%2F%2Fwww.bundler.cn%2Fv1.16%2Fguides%2Fcreating_gem.html "https://www.bundler.cn/v1.16/guides/creating_gem.html")，且支持命令行化（CLI 命令），具体流程可以查看 [官方教程](https://link.juejin.cn?target=https%3A%2F%2Fwww.bundler.cn%2Fv1.16%2Fguides%2Fcreating_gem.html "https://www.bundler.cn/v1.16/guides/creating_gem.html")。相信 iOS 开发者对 Cocoapods 都不陌生，Cocoapods 以 gem 包的方式分发，同时提供了 pod 命令，如大家熟知的「pod install」命令。Cocoapods 使用 [CLAide](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FCocoaPods%2FCLAide "https://github.com/CocoaPods/CLAide") 实现了命令行化，当然我们也可以使用 Bundler 提供的命令行化的方式，或者设计一种自定义的命令行的规范后再实现命令行化，这里我们推荐使用 CLAide 来实现 gem 的命令行。有关 CLAide 的使用示例，在网上可以找到很多案例，本文不再累述。下图是 pod 命令的示例：

![pod 命令的示例](/images/jueJin/cb1d96519f12c7d.png)

将 Ruby 脚本打包成一个 gem 包，并提供 CLI 命令支持，后续新增功能可以通过新增命令的方式来实现。至此，我们已经完成了命令行迭代的第 3 阶段。随着新增的功能越来越多，CLI 工具集规模也随之变大，提供的命令和参数也变得又多又复杂，即使对于命令的开发者来说，在使用过程中也难以高效的去使用。为此，我们可以对这些 CLI 工具集进行下一阶段的聚合，即进入命令行迭代的第 4 个阶段。

Ruby 和 Electron 的通信方案
---------------------

在命令行迭代的 4 个阶段中的最后一个阶段，核心需要完成 CLI 和 GUI 的交互通信。GUI 调用 CLI 则涉及到跨语言调用，这时一般有两种解决方案：

1.  将函数做成一个服务，通过进程间通信（IPC）或网络协议通信（RPC、Http、WebSocket 等）完成调用，至少两个进程才能实现；
2.  直接将其它语言的函数内嵌到本语言中，通过语言交互接口（FFI）调用，调用效率比第一种方案高；

这两种调用方式本质上都可以理解为：参数传递 + 函数调用 + 返回值传递。[Ruby 不是编译型语言](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.oracle.com%2Fzh%2Flearn%2Ftechnical-articles%2F1481879245861-56-what-is-ruby "https://developer.oracle.com/zh/learn/technical-articles/1481879245861-56-what-is-ruby")，会边解释边执行，不会生成可执行程序，一般也不会被打包成二进制可执行文件来供其它语言进行 FFI 调用，故第二种调用方案并不能用于 Ruby 和 Javascript 或 Typescript 的调用。现在只考虑第一种调用方案，即进程间通信或者通过网络协议通信。

### 进程间通信

[Electron](https://link.juejin.cn?target=https%3A%2F%2Fwww.electronjs.org%2F "https://www.electronjs.org/") 中包含一个主进程（Main）和一个及以上的渲染进程（Renderer），大家可以简单理解为主进程就是一个后台运行的 Node 进程，大家看到的窗口（Window）就对应一个渲染进程（如 Chrome 浏览器的一个 Tab 页对应一个渲染进程）。Electron 调用 Ruby ，可以理解为是主进程去调用 Ruby 进程，本质上是两个不同进程之间的通信过程。渲染进程可以通过 [内置的 IPC 能力](https://link.juejin.cn?target=https%3A%2F%2Fwww.electronjs.org%2Fdocs%2Flatest%2Ftutorial%2Fipc "https://www.electronjs.org/docs/latest/tutorial/ipc") 和主进程通信，并借助主进程完成对 Ruby 进程的调用，故核心还是主进程调用 Ruby 进程。两个进程之间通信（IPC）的方法有很多种，[常见的方法](https://link.juejin.cn?target=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2F%25E8%25A1%258C%25E7%25A8%258B%25E9%2596%2593%25E9%2580%259A%25E8%25A8%258A "https://zh.wikipedia.org/wiki/%E8%A1%8C%E7%A8%8B%E9%96%93%E9%80%9A%E8%A8%8A") 有：文件、信号、套接字、管道（命名和匿名）、共享内存和消息传递等，故也可以将网络协议通信理解为广义上的进程间 IPC 通信。下图是 Ruby 进程和 Electron 进程间通信的简单示意图：

![Ruby 进程和 Electron 进程间通信的简单示意图](/images/jueJin/8009e57411dadb0.png)

进程间通信的本质是交换信息，进程间的交互方式需要考虑以下因素：

1.  一对一或者一对多；
2.  同步调用或者异步调用；

考虑到存在同时执行多个任务的情况，故需要支持一对多，且 GUI 大部分场景都不应该被 CLI 阻塞，故同步和异步调用都要支持。

考虑到 Ruby 脚本最终是打包成 gem 包，且支持以命令行的方式来调用，同时 Node 的 childProcess 模块支持开启一个新的 Shell 进程。因此可以将 Electron 进程调用 Ruby 转化为 Node 进程创建 Shell 进程，然后由 Shell 进程负责 Ruby 代码的执行，且每执行一次命令则开启一个新的 Shell 进程，通过 childProcess 模块的 spawnSync 和 spawn ，可以实现同步和异步调用。Node 和 Shell 进程之间的关系如下图所示：

![Node 和 Shell 进程关系图](/images/jueJin/495b3fdc40821e2.png)

最终 Node 以命令行的方式来调用 Ruby 代码。在 Electron 中，主进程和渲染进程之间可以通过内置的 IPC 完成通信，于是一个典型的基于 Electron 的 GUI 和基于 Ruby 的 CLI 的调用模型如下图所示：

![基于 Electron 的 GUI 和基于 Ruby 的 CLI 的调用模型](/images/jueJin/88b583417562d87.png)

### 通信方案

Node 调用 Shell 命令，需要考虑到命令的参数如何传给命令，同时需要考虑到命令执行的最终结果如何返回给 Node。最简单的是直接将命令的参数和选项直接拼凑到命令的后面，然后将拼凑后的命令直接在 Shell 中执行。实际我们也是使用的这种方式，有以下几个点需要注意：

1.  拼凑后的命令字符串需要做特殊字符的转义，如 JSON 格式的字符串，需要 JSON.stringify(JSON.stringify()) 的方式来做特殊字符的转义；
2.  参数中包含有意义的空格（不是分隔符）时，需要用双引号包括起来；
3.  操作系统对命令行的参数长度有限制，否则会出现「Argument list too long」报错，故需要控制好命令行的参数长度，或者另寻其它方式来传递超长参数的字符串；

命令行中的参数存在字符转义和长度的限制，如果 stdin 通道没有被用作其它用途，可以使用 stdin 通道来传递参数，或者提供一种新的通信方式来传递参数。Shell 命令执行的结果如何返回给 Node 进程，最简单的就是通过 stdout/stderr 来获取结果。参考 [git 命令的设计](https://link.juejin.cn?target=https%3A%2F%2Fgit-scm.com%2Fbook%2Fen%2Fv2%2FGit-Internals-Plumbing-and-Porcelain "https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain")，同时提供高级命令（Porcelain）和低级命令（Plumbing），其中低级命令要比高级命令的输出稳定，因此可以输出固定格式的结果，这样 Node 进程就可以根据不同命令输出的不同的格式的结果进行处理。但是这样会占用 stdout/stderr 通道，从而导致代码的日志输出不能使用 stdout/stderr 通道。如果简单的将日志输出重定向到其它地方，那么会干扰到现有命令的日志正常输出，再者都是已有的 Ruby 脚本，导致对现有 Ruby 脚本代码的侵入性较高。

为此，我们是可以考虑不使用 stdout/stderr 通道来获取命令的执行结果，这样可以在这两个输出通道中查看日志，方便排查问题。为了同时支持命令行参数和执行结果的传递，下面给出常用的 3 种通信方式的说明，包括文件、Unix Domain Socket 和 Node 内置 IPC。

![3 种通信方式示意图](/images/jueJin/250ff4f34fc05a3.png)

### 通信方式 - 文件

为此，我们可以选择文件作为传递命令行的执行结果的通信方式，上面可能遇到的命令行超长参数问题也可以用文件的通信方式来解决。下面是基于文件的通信方式的描述：

1.  针对超长参数字符串，可以由 GUI 创建一个文件，将超长参数字符串写入入参文件，之后将入参文件的路径通过一个入参文件路径选项的方式传给 CLI，CLI 读取入参文件路径选项所指向的文件，读取结束后再将该文件删除；
2.  针对命令行返回结果，GUI 生成一个空的执行结果文件路径选项传递给 CLI，CLI 根据执行结果文件选项路径创建出文件，然后将命令的执行结果写入该文件，GUI 等命令执行结束后再根据传入的执行结果文件路径来读取结果，读取结束后再将文件删除；

这里我们使用 JSON 作为执行结果的返回格式。下面给出 Node 和 Ruby 通信一次的简单示例代码：

Node 完整示例代码：

```javascript
import fs from "fs-extra"
import childProcess from "node:child_process"

const components = { params: {} }
const componentsWithEscape = JSON.stringify(JSON.stringify(components))
const guiResultPath = "/tmp/result.json"
const options = { shell: "/bin/zsh" } // 也可以指明cwd选项(当前目录)，适合bundle exec的方式
const args = `--components=${componentsWithEscape} --GUI="${guiResultPath}"`
const command = `martinx gui commit`
const executeResult = await childProcess.spawn(command, args, options) // 执行命令
const guiResult = fs.readJsonSync(guiResultPath)  // 读取返回结果
fs.rm(guiResultPath)  // 读取完后删除文件
const { stdout, stderr, all } = executeResult // 可以读取日志
```

Ruby 完整示例代码：

```ruby
require 'claide'
module MartinX
class Command < CLAide::Command
def run(argv)
super(argv)
    output = {
    :data => {},
    :code => 200,
    :msg => "success"
}
# do something...
ensure
expand_path = Pathname.new(@path).expand_path
file_dir.dirname.mkpath unless expand_path.dirname.exist?
File.new(expand_path, File::CREAT | File::TRUNC, 0644).close # 创建文件
File.open(@path, 'w') do |file|
file.syswrite(output.to_json) # 将执行结果写入文件
end
end

def initialize(argv)
@path = argv.option('GUI')  # 使用path对象实例变量保存文件路径
end
end
end

```

上面的 martinx 为一个名为 MartinX 的 gem 包所对应的命令，是内部一个 DevOps 工具集的名字，用作示例使用，后面其它的通信方式的讲解也会用 martinx 作为示例。以上示例代码可运行测试。

### 通信方式 - Unix Domain Socket

UNIX Domain Socket 与传统基于 TCP/IP 协议栈的 Socket 不同，不需要经过网络协议栈，以文件系统作为地址空间，与管道类似。因为管道的发送与接收数据同样依赖于路径名称，故也支持 owner、group、other 的文件权限设定。UNIX Domain Socket 在通信结束后不会自动销毁，故需要手动调用 fs.unlink 来复用 unixSocketPath，不同进程间会通过读写操作系统创建的「.sock」文件来实现通信。与多个服务同时通信，此时需要维护多个通信通道，使用 UNIX Domain Socket，可以使用 Linux IO 多路复用功能。下面给出 Node 和 Ruby 通过 Unix Domain Socket 的通信方式的示例代码。

Node 核心示例代码：

```javascript
const net = require("net")
const unixSocketServer = net.createServer() // 需要创建服务
const unixSocketPath = "/tmp/unixSocket.sock"
    unixSocketServer.listen(unixSocketPath, () => {
    console.log("listening")
    })
    
        unixSocketServer.on("connection", (s) => {
        s.write("hello world from Node")
            s.on("data", (data) => {
            console.log("Recived from Ruby: " + data.toString())
            })
            s.end()
            })
            const fs = require("fs")
            fs.unlink(unixSocketPath) // 方便后续 unixSocketPath 的复用
```

Ruby 核心示例代码：

```ruby
require 'socket'
unixSocketPath = '/tmp/unixSocket.sock'
UNIXSocket.open(unixSocketPath) do |sock|
sock.puts "hello world from Ruby"
puts "Recived from Node: #{sock.gets}"
end
```

### 通信方式 - Node 内置 IPC

从 Node 官网有关 child\_process 模块的 [介绍文档](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fnodejs%2Fnode%2Fblob%2F479822c45ef527386390227a1f8e086f6128d9e8%2Fdoc%2Fapi%2Fchild_process.md "https://github.com/nodejs/node/blob/479822c45ef527386390227a1f8e086f6128d9e8/doc/api/child_process.md") 里面可知，Node 父进程在创建子进程之前，会创建 IPC 通道并监听它，然后才真正的创建出子进程，这个过程中也会通过环境变量（NODE\_CHANNEL\_FD）告诉子进程这个 IPC 通道的文件描述符（File Descriptor），大家可以理解文件描述符是一个指向 PIPE 管道的链接。子进程可以通过这个 IPC 通道来和父进程完成通信，在本文也就是 Electron 的 Node 主进程可以通过这个 IPC 通道来和创建出来的子进程（Shell 进程）来完成通信。

在 Windows 操作系统中，这个 IPC 通道是通过命名管道实现，在 Unix 操作系统上，则是通过 Unix Domain Socket 实现。比如在 MacOS 操作系统内核中，会维护一张 [Open File Table](https://link.juejin.cn?target=https%3A%2F%2Fwww.computerhope.com%2Fjargon%2Ff%2Ffile-descriptor.htm%23%3A~%3Atext%3DA%2520file%2520descriptor%2520is%2520a%2CGrants%2520access "https://www.computerhope.com/jargon/f/file-descriptor.htm#:~:text=A%20file%20descriptor%20is%20a,Grants%20access")，该 Table 会记录每个进程所有打开的文件描述（File Description），我们可以通过 lsof 命令来查看某个进程的所有 PIPE 类型的文件描述所对应的文件描述符，命令输出的第四列为数字，该数字就是 PIPE 的文件描述，NODE\_CHANNEL\_FD 环境变量中存储的也就是一个大于零的整数，如下图所示：

![lsof 命令查看 PIPE 示意图](/images/jueJin/23217bf59e8ad1e.png)

需要注意的是，NODE\_CHANNEL\_FD 所指向的 IPC 通道只支持 JSON 格式的字符串的通信。我们可以给 spawn 的 option 参数中的 stdio 数组中传入「ipc」字符串，即可开启父子进程之间的 IPC 通信能力。从 Node.js 的「[process\_wrap.cc](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fnodejs%2Fnode%2Fblob%2Ff313b39d8f282f16d36fe99372e919c37864721c%2Fdeps%2Fuv%2Fsrc%2Funix%2Fprocess.c%23L338 "https://github.com/nodejs/node/blob/f313b39d8f282f16d36fe99372e919c37864721c/deps/uv/src/unix/process.c#L338")」源码中我们可以知道，打开的 PIPE 管道的 fd（File Descriptor）会重定向到stdio 数组中「ipc」值的索引，在下面的代码示例中，打开的 PIPE 管道的 fd 会重定向到 fd 为 3 的 PIPE 管道。下面将给出代码示例。

Node 核心示例代码：

```javascript
const cp = require('child_process');
    const n = cp.spawn('martinx', ['--version'], {
stdio: ['ignore', 'ignore', 'ignore', 'ipc']
});

    spawned.on("message", (data) => {
    console.log("Recived from Ruby:" + data)
    })
    
    spawned.send({"message": "hello world from Node"})
```

Ruby 核心示例代码：

```ruby
node_channel_fd = ENV['NODE_CHANNEL_FD']
io = IO.new(node_channel_fd.to_i)
data = { :data => 'hello world from Ruby' } # 只支持JSON格式的字符串
io.puts data.to_json
puts "Recived from Node: " + io.gets
```

我们也可以直接通过 Shell 脚本的方式直接和 Node 通信。Shell 的示例代码如下：

```shell
# 数字 1 是文件描述符，代表标准输出(stdout)。将 stdout 重定向到 NODE_CHANNEL_FD 指向的管道流
printf "{"message": "hello world from Node"}" 1>&$NODE_CHANNEL_FD

NODE_MESSAGE=read -u $NODE_CHANNEL_FD
echo $NODE_MESSAGE
```

以上示例代码可运行测试。

### 通信方式总结

至此，我们通过上面给出的 3 种通信方式，实现了命令行迭代的第 3 阶段到第 4 阶段的跨越，即最终实现了命令行迭代的第 4 阶段。以上给出的 3 种通信方式示例中，考虑到跨平台以及不同环境下的通用性和调试的便捷性，笔者所在的团队内部的 DevOps 主要使用了文件的通信方式。在 CLI 内部只需要对命令行的入参和执行结果制定一些简单的标准和规范，即可在不同的操作系统上正常运行，同时在多个不同语言的 CLI 工具集之间也能很方便的进行 IPC 通信。在开发调试时，可以通过查看执行结果文件的方式快速查看到执行结果。上面介绍的 3 种通信方式，没有绝对的优劣之分，大家可以根据实际的项目需求来灵活选用，下面给出了推荐使用场景：

通信方式

推荐使用场景

文件

十分注重通用性、和多个服务通信、交互简单的实时性不高的数据

Unix Domain Socket

和多个服务同时通信、传输大量数据或高并发场景、权限隔离

Node 内置 IPC

Node 父子进程间通信、Node 与 Shell 进程间通信

最佳实践
----

下面将给出命令行迭代的第 3 阶段到第 4 阶段的过程中遇到的 Shell 和 Ruby 的环境问题、Ruby 脚本的命令行化后的调用以及 Electron 和 Ruby 的开发调试的实践。

### Shell 中的 Ruby 环境

Node 创建的 Shell 进程和大家使用 Mac 自带的 Terminal 或者 Iterm2 中创建的 Shell 进程中的环境是不一样的。比如我们通过 Terminal 在电脑上用 Rvm 安装了 2.6.8 版本的 Ruby，在 Node 创建的 Shell 进程中，默认是找不到安装的 2.6.8 版本的 Ruby，故需要将这些 Ruby 环境注入到 Node 创建的 Shell 进程后，才能正常使用。

Node 通过 childProcess 模块的 spawnSync 或 spawn 创建的 Shell 进程需要注入 Ruby 的环境，此时有两种方案：第一种是直接内置一套最小化的 Ruby 环境，如 [traveling-ruby](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fphusion%2Ftraveling-ruby "https://github.com/phusion/traveling-ruby") 的 Ruby 二进制打包方案；第二种是使用用户本地现有的 Ruby 环境。这里可以根据团队项目的实际情况来选择，当然也可以两种方式都支持，本文将讨论第二种方式。这里推荐使用 Rvm 来安装和管理Ruby 环境。我们可以在用户根目录下的「.zshrc」、「.profile」、「.bash\_profile」等文件中获知 Rvm 的环境信息，只需要在每次执行命令前，先将 Rvm 的环境信息注入即可。下面给出了 Rvm 的环境注入的 Shell 示例代码：

```shell
export LANG=en_US.UTF-8 && [[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm"
```

### Ruby 脚本的命令行调用

调用 Ruby 脚本的命令有下面两种方式：

1.  「bundle exec」 + 命令
2.  命令

第一种方式同时适合开发环境和生产环境，在以 gem 包发布 Ruby 脚本的前提下，故只适用于开发环境，此时 Node 执行 Shell 命令需要指明 cwd 选项，将该选项设置为本地的 Ruby 的 gem 包的代码根目录即可。第二种方式适合在生产环境使用，并可以在命令后添加如「_1.6.6_」来指明使用 1.6.6 版本的 gem 包。下面是这两种执行方式的代码示例：

```shell
# 第一种方式
bundle exec martinx gui code check --path="/Users/xx/x" --GUI="/private/var/folders/s3/071qk97d5hg525j3hstqfw9m0000gn/T/martinx_LiGuWarY"
# 第二种方式
martinx _1.6.6_ gui code check --path="/Users/xx/x" --GUI="/private/var/folders/s3/071qk97d5hg525j3hstqfw9m0000gn/T/martinx_LiGuWarY"
```

在第一种调用方式中，如果调用的命令的代码中会以「bundle exec」的方式去调用其它命令，那么需要先清空当前的 Bundler 环境后，才可以正常调用。下面是代码示例：

```ruby
# Bundler 2.1+ 版本使用 with_unbundled_env，否则使用 with_clean_env 方法
::Bundler.with_unbundled_env do
`bundle exec martinx xxx`
end
```

最后，需要注意在 Ruby 代码里不要出现「$stdin.gets」调用，这样会导致 Shell 进程一直在等待输入，造成进程忙等的假象，而是将需要输入的内容在命令调用时就以参数或选项的形式传入。

### Ruby 和 Electron 调试

一般来说，我们可以通过命令行接口来和语言调试器后端连接起来，并使用 stdin/stdout/stderr 流来进行控制；也可以选择基于线路协议，通过 TCP/IP 或者网络协议来连接到调试器，这两种方式都能方便用户调试脚本代码。

> Ruby 调试

Ruby 的调试工具选择还是很多样的，大家常用的有以下几种选择：

*   puts
*   pry
*   byebug
*   pry-byebug
*   RubyMine/VSCode 等 GUI 调试工具
*   以上的任意组合

如果 Ruby 脚本代码有一定规模和复杂度，为了方便调试，还是推荐大家使用如 RubyMine 这种 GUI 调试工具。RubyMine 调试 Ruby 的运行原理是会把所有的代码都加入断点监控，故会比只加载部分代码模块速度要慢。使用 RubyMine 调试单条命令的执行对于习惯了 IDE 的开发来说，是十分友好的，且合理使用其提供的 [attach（LLDB）](https://link.juejin.cn?target=https%3A%2F%2Fwww.jetbrains.com%2Fhelp%2Fruby%2Fattaching-to-process.html%23attach-to-local "https://www.jetbrains.com/help/ruby/attaching-to-process.html#attach-to-local") 到运行的 Ruby 进程也是十分方便的。有关更多 RubyMine 的调试，感兴趣的读者可以查看 [官网资料](https://link.juejin.cn?target=https%3A%2F%2Fwww.jetbrains.com%2Fhelp%2Fruby%2Fdebugging-code.html "https://www.jetbrains.com/help/ruby/debugging-code.html")。

> Electron 调试

Electron 的主进程和渲染进程的调试，推荐使用 VSCode，简单几步配置即可调试。其中渲染进程的调试可以像普通网页一样在 DevTools 上直接断点调试，在网上可以找到很多这方面的资料，本文不做过多讲解。这里推荐直接使用官网给出的 [调试示例](https://link.juejin.cn?target=https%3A%2F%2Fwww.electronjs.org%2Fzh%2Fdocs%2Flatest%2Ftutorial%2Fdebugging-vscode "https://www.electronjs.org/zh/docs/latest/tutorial/debugging-vscode")。

总结
--

本文介绍了日常研发过程中，大量散落的 Ruby 脚本如何以一种更高效的方式给研发使用，并给出了命令行迭代的 4 个阶段。从 Ruby 脚本命令行化到后面逐步分析 Ruby 脚本命令行化后的可视化，探索了跨语言进程间的通信方案，并给出文件、Unix Domain Socket 和管道这 3 种 GUI 和 CLI 之间的通信方式。最后针对基于 Ruby 的 CLI 和基于 Electron 的 GUI 在实际开发过程中，说明了会遇到的 Ruby 环境问题和对应的解决方案，最后给出了 Ruby 和 Electron 开发调试的一些分析和建议。以上内容都是基于笔者在实际的 DevOps 研发过程中使用到的内容，包括跨语言进程间的 IPC 通信、Ruby 脚本命令行化、Ruby 相关的环境问题以及 Ruby 和 Electron 的调试，以上这些内容对于使用其它开发语言或框架的 CLI 和 GUI 之间的交互实践，也是能够提供一些参考和建议。

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！