---
author: "网易云音乐技术团队"
title: "深入 WebAssembly 之解释器实现篇"
date: 2021-09-26
description: "本文主要介绍笔者读完《WebAssembly 原理与核心技术》这本书后，总结的 WebAssembly 核心原理以及如何实现一个 WebAssembly 解释器。"
tags: ["前端","WebAssembly中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读20分钟"
weight: 1
selfDefined:"likes:50,comments:8,collects:46,views:6438,"
---
> 图片来源：[unsplash.com/photos/N8yo…](https://link.juejin.cn?target=https%3A%2F%2Funsplash.com%2Fphotos%2FN8yoH-dj4k8 "https://unsplash.com/photos/N8yoH-dj4k8")

> 本文作者：伍六一

Wasm 解释器项目地址：

[github.com/mcuking/was…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmcuking%2Fwasmc "https://github.com/mcuking/wasmc")

背景
--

从去年年底开始笔者决定深入 WebAssembly（为了书写方便，接下来简称为 Wasm）这门技术，在读[《WebAssembly 原理与核心技术》](https://link.juejin.cn?target=https%3A%2F%2Fbook.douban.com%2Fsubject%2F35233448%2F "https://book.douban.com/subject/35233448/")这本书的过程中（这本书详细讲解了 Wasm 的解释器和虚拟机的工作原理以及实现思路），萌生了实现一个 Wasm 解释器的想法，于是就有了这个项目。接下来我们就直奔主题，看下到底如何实现一个 Wasm 解释器。

Wasm 背景知识
---------

在具体阐述解释器实现过程之前，首先介绍下 Wasm 相关的背景知识。

### Wasm 是什么

Wasm 是一种底层类汇编语言，能在 Web 平台上以趋近原生应用的速度运行。C/C++/Rust 等语言将 Wasm 作为编译目标语言，可以将已有的代码移植到 Web 平台中运行，以提升代码复用度。

![](/images/jueJin/3e89ddeb3052d5f.png)

而 Wasm 官网给出的定义是 —— WebAssembly（缩写为 Wasm）是一种**基于栈式虚拟机的二进制指令格式**。Wasm 被设计成为一种编程语言的可移植编译目标，可以通过将其部署到 Web 平台上，使其为客户端和服务端应用程序提供服务。

其中将 Wasm 定义为一种**虚拟指令集架构 V-ISA（Virtual-Instruction Set Architecture）**，关于这方面的解读，请参考下面执行阶段的内容。

接着来看下 Wasm 的一些特点：

1.  **层次必须低**，尽量接近机器语言，这样解释器才更容易进行 AOT/JIT 编译，以趋近原生应用的速度运行 Wasm 程序；
2.  **作为目标代码**，由其他高级语言编译器生成；
3.  **代码安全可控**，不能像真正的汇编语言那样可以执行任意操作；
4.  **代码必须是平台无关的**（不能是平台相关的机器码），这样才可以跨平台执行，所以采用了虚拟机/字节码技术。

> Tip: 关于 Wasm 的更多详细介绍可参考笔者翻译的文章 [《WebAssembly 的后 MVP 时代的未来：一棵卡通技能树（译）》](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmcuking%2Fblog%2Fissues%2F108 "https://github.com/mcuking/blog/issues/108")

### Wasm 能做什么

Wasm 目前已经在浏览器端的图像处理、音视频处理、游戏、IDE、可视化、科学计算等，以及非浏览器端的Serverless、区块链、IoT 等领域有一定的应用。如果想要了解更多有关 Wasm 应用的内容，可以关注笔者的另一个 GitHub 仓库：

[github.com/mcuking/Awe…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmcuking%2FAwesome-WebAssembly-Applications "https://github.com/mcuking/Awesome-WebAssembly-Applications")

### Wasm 规范

Wasm 技术目前有 4 份规范：

*   **[核心规范](https://link.juejin.cn?target=https%3A%2F%2Fwebassembly.github.io%2Fspec%2Fcore%2F "https://webassembly.github.io/spec/core/")** —— 定义了独立于具体嵌入（即平台无关）的 Wasm 模块的语义。
*   **[JavaScript API](https://link.juejin.cn?target=https%3A%2F%2Fwebassembly.github.io%2Fspec%2Fjs-api%2Findex.html "https://webassembly.github.io/spec/js-api/index.html")** —— 定义用于从 JavaScript 内部访问 Wasm 的 JavaScript 类和对象。
*   **[Web API](https://link.juejin.cn?target=https%3A%2F%2Fwebassembly.github.io%2Fspec%2Fweb-api%2Findex.html "https://webassembly.github.io/spec/web-api/index.html")** —— 定义了专门在 Web 浏览器中可用的 JavaScript API 扩展。
*   **[WASI API](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FWasm%2FWASI%2Fblob%2Fmaster%2Fphases%2Fsnapshot%2Fdocs.md "https://github.com/Wasm/WASI/blob/master/phases/snapshot/docs.md")** —— 定义了一个模块化的系统接口来在 Web 之外运行 Wasm，例如访问文件、网络链接等能力。

本文主要介绍的 Wasm 解释器主要是运行在非浏览器环境，因此无需关注 [JavaScript API](https://link.juejin.cn?target=https%3A%2F%2Fwebassembly.github.io%2Fspec%2Fjs-api%2Findex.html "https://webassembly.github.io/spec/js-api/index.html") 和 [Web API](https://link.juejin.cn?target=https%3A%2F%2Fwebassembly.github.io%2Fspec%2Fweb-api%2Findex.html "https://webassembly.github.io/spec/web-api/index.html") 规范。

另外目前实现的版本并没有涉及到 WASI（后续有计划支持），所以目前只需要关注 [核心规范](https://link.juejin.cn?target=https%3A%2F%2Fwebassembly.github.io%2Fspec%2Fcore%2F "https://webassembly.github.io/spec/core/") 即可。

### Wasm 模块

Wasm 模块主要有以下 4 种表现形式：

*   **二进制格式** —— Wasm 的主要编码格式，以 .wasm 后缀结尾。
*   **文本格式** —— 主要是为了方便开发者理解 Wasm 模块，或者编写小型的测试代码，以 .wat 后缀结尾，相当于汇编语言程序。
*   **内存格式** —— 模块加载到内存的表现，该表现形式与具体的 Wasm 虚拟机的实现有关，不同 Wasm 虚拟机的实现有不同的内存表示。
*   **模块实例** —— 如果将内存格式理解为面向对象语言中的类，那模块实例就相当于“对象”。

下图就是使用 C 语言编写的阶乘函数，以及对应的 Wasm 文本格式和二进制格式。

![](/images/jueJin/a6cd2e3a8e29495.png)

而内存格式和具体的 Wasm 解释器的实现有关，例如本项目的内存格式大致如下（在后面执行阶段部分会详细讲解）：

![](/images/jueJin/a81b5394da8ffcd.png)

各个格式之间的关联如下：

*   **二进制格式**主要由高级编程语言编译器生成，也可通过文本格式编译生成。
*   **文本格式**可以有开发者个直接编写，也可由二进制反编译生成。
*   Wasm 解释器通常会将二进制模块解码为内部形式，即**内存格式**（比如 C/C++ 结构体），然后再进行后续处理。

![](/images/jueJin/ebc0650eec02152.png)

最后推荐一个名为 WebAssembly Code Explorer 的站点，可以更直观地查看 Wasm 二进制格式和文本格式之间的关联。

[wasdk.github.io/wasmcodeexp…](https://link.juejin.cn?target=https%3A%2F%2Fwasdk.github.io%2Fwasmcodeexplorer%2F "https://wasdk.github.io/wasmcodeexplorer/")

![](/images/jueJin/9746078c235b3b7.png)

解释器实现原理
-------

通过上面的介绍，相信大家对 Wasm 技术已经有了大致的了解。接下来我们从分析 Wasm 二进制文件的执行流程开始，探讨解释器的实现思路。

Wasm 二进制文件被执行主要分 3 个阶段：**解码**、**验证**、**执行**

1.  **解码阶段**：将二进制格式解码为内存格式。
2.  **验证阶段**：对模块进行静态分析，确保模块的结构满足规范要求，且函数的字节码没有不良行为（例如调用不存在的函数）。
3.  **执行阶段**：进一步分为**实例化**和**函数调用**两个阶段。

![](/images/jueJin/68a7ca25b4eec42.png)

> Tip: 本项目实现的解释器，并没有一个单独的**验证阶段**。而是将具体的验证分布在**解码阶段**或**执行阶段**中进行，例如在**解码阶段**验证是否存在非法的段 ID，在**执行阶段**验证函数的参数或返回值的类型或数量是否和函数签名匹配等。
> 
> 另外**实例化**过程在**解码阶段**就完成了，执行阶段仅需要进行**函数调用**即可。 所谓**实例化**，主要内容就是为内存段、表段等申请空间，记录所有函数(自定义的函数和导入的函数)的入口地址，然后将模块的所有信息记录到一个统一的数据结构 `module` 中。

接下来我们就分别对**解码阶段**和**执行阶段**的实现细节进行详细阐述。

解码阶段
----

### Wasm 二进制文件结构

和其他二进制格式（例如 Java 类文件）一样，Wasm 二进制格式也是以魔数和版本号开头，之后就是模块的主体内容，这些内容根据不同用途被分别放在不同的段（Section） 中。一共定义了 12 种段，每种段分配了 ID（从 0 到 11）。除了自定义段之外，其他所有段都最多只能出现一次，且须按照 ID 递增的顺序出现。ID 从 0 到 11 依次有如下 12 个段：

自定义段、类型段、导入段、函数段、表段、内存段、全局段、导出段、起始段、元素段、代码段、数据段

![](/images/jueJin/3af34d494618b7b.png)

> Tip: 其中不同段之间的排序是有一定依据的，主要目的是为了进行流编译 —— 即一边下载 Wasm 模块一边将其编译到机器码，详细信息可查阅文章 [《Making WebAssembly even faster: Firefox’s new streaming and tiering compiler》](https://link.juejin.cn?target=https%3A%2F%2Fhacks.mozilla.org%2F2018%2F01%2Fmaking-webassembly-even-faster-firefoxs-new-streaming-and-tiering-compiler%2F "https://hacks.mozilla.org/2018/01/making-webassembly-even-faster-firefoxs-new-streaming-and-tiering-compiler/")

换句话说，每一个不同的段都描述了这个 Wasm 模块的一部分信息。而模块内的所有段放在一起，便描述了这个 Wasm 模块的全部信息：

*   **内存段和数据段**：内存段用于存储**程序的运行时动态数据**。数据段用于存储初始化内存的静态数据。内存可以从外部宿主导入，同时内存对象也可以导出到外部宿主环境。
*   **表段和元素段**：表段用于存储**对象引用**，目前对象只能是函数，因此可以**通过表段实现函数指针的功能**。元素段用于存储初始化表段的数据。表对象可以从外部宿主导入，同时表对象也可以导出到外部宿主环境。
*   **起始段**：起始段用于存储**起始函数的索引**，即指定了一个在加载时自动运行的函数。起始函数主要作用：1. 在模块加载后进行初始化工作； 2. 将模块变成可执行文件。
*   **全局段**：全局段用于存储**全局变量的信息**（全局变量的值类型、可变性、初始化表达式等）。
*   **函数段、代码段和类型段**：这三个段均是用于存储表达函数的数据。其中 **类型段**：类型段用于存储模块内所有的**函数签名**（函数签名记录了函数的参数和返回值的类型和数量），注意若存在多个函数的函数签名相同，则存储一份即可。 **函数段**：函数段用于存储函数对应的**函数签名索引**，注意是函数签名的索引，而不是函数索引。 **代码段**：代码段用于存储函数的**字节码和局部变量**，也就是函数体内的局部变量和代码所对应的字节码。
*   **导入段和导出段**：导出段用于存储**导出项信息**（导出项的成员名、类型，以及在对应段中的索引等）。导入段用于存储**导入项信息**（导入项的成员名、类型，以及从哪个模块导入等）。导出/导入项类型有 4 种：函数、表、内存、全局变量。
*   **自定义段**：自定义段主要用于保存调试符号等和运行无关的信息。

> Tip: 在上面的 Wasm 二进制格式的段中，表段应该比会较难以理解，这里特地对其说明下。 在 Wasm 设计思想中，**与执行过程相关的代码段/栈等元素和内存是完全分离的，这与通常的体系结构中代码段/数据段/堆/栈全都处在统一编址内存空间情况完全不同，函数地址对 Wasm 程序来说是不可见的，更不要说将函数当作变量一样传递、修改和调用。** 表是实现这一机制的关键，表用于存储对象引用，目前对象只能是函数，也就是说目前表中只是用来存储函数索引值。**Wasm 程序只能通过表中的索引，找到对应函数索引值来调用函数，并且运行时的栈数据也不保存在内存对象中**。由此彻底杜绝了 Wasm 代码越界执行的可能，最糟糕情况不过是在内存对象中产生一堆错误数据而已。

知道了每个段对应的用途以及每个段的具体编码格式（详细的编码格式可查看 `module.c` 中的 `load_module` 函数中的注释），我们就可以对 Wasm 二进制文件进行解码，将其“翻译”成内存格式，也就是将模块的所有信息记录到一个统一的数据结构中 —— `module`，`module` 结构如下图所示：

![](/images/jueJin/a81b5394da8ffcd.png)

> Tip: 为了节约空间，让二进制文件更加紧凑，Wasm 二进制格式采用 [LEB128(Little Endian Base 128)](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FLEB128 "https://en.wikipedia.org/wiki/LEB128") 来编码列表长度、索引等整数值。LEB128 是一种变长编码格式，32 位整数编码后会占 1 到 5 个字节，64 位整数编码后会占 1 到 10 个字节。越小的整数编码后占用的字节数越少。由于像列表长度、索引这样的整数通常都比较小，所以采用 LEB128 编码就可以起到节约空间的作用。 LEB128 有两个特点：**1\. 采用小端序表示，即低位字节在前，高位字节在后；2. 采用 128 进制，即每 7 位为一组（一个字节的后 7 位），空出来的最高位是标识位，1 表示还有后续字节，0 表示没有。** LEB128 有两个变体，分别用来编码无符号整数和有符号整数，具体实现可查阅 [github.com/mcuking/was…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmcuking%2Fwasmc%2Fblob%2Fmaster%2Fsource%2Futils.c "https://github.com/mcuking/wasmc/blob/master/source/utils.c") 中的 `read_LEB` 函数。

最后展示下解码阶段对应的部分实际代码截图如下：

![](/images/jueJin/fb1906a9dda20b6.png)

更多细节建议查阅 [github.com/mcuking/was…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmcuking%2Fwasmc%2Fblob%2Fmaster%2Fsource%2Fmodule.c "https://github.com/mcuking/wasmc/blob/master/source/module.c") 中的 `load_module` 函数，其中有丰富的注释讲解。

执行阶段
----

经过了上面的解码阶段，我们可以从 Wasm 二进制文件中得到涵盖执行阶段所需要的全部信息的内存格式，接下来我们来一起探索如何基于上面的内存格式实现执行阶段。在正式开始之前，首先需要介绍下栈式虚拟机的相关知识作为铺垫。

官网对 Wasm 的定义 —— **Wasm 是基于栈式虚拟机的二进制指令格式**。也就是说 Wasm 不仅仅是一门编程语言，也是一套虚拟机体系结构规范。那么什么是虚拟机，什么又是栈式虚拟机呢？

### 虚拟机概念

虚拟机是软件对硬件的模拟，借助操作系统和编译器提供的功能模拟硬件的工作，这里主要指对硬件 CPU 的模拟。虚拟机执行指令主要有以下 3 个步骤：

1.  **取指**—从程序计数器 PC 指向指令流中的地址获取指令
2.  **译码**—判断指令的类型，进入相应的处理流程
3.  **执行**—按照指令的含义执行相应的函数

执行指令流中的一条条指令，就是不断循环执行上面的三个步骤。循环执行的过程中需要有一个标志来记录当前已经执行到哪一条指令，也就是**程序计数器 PC (Program Count)** —— 用于保存下一条待执行指令的地址。

> Tip: 提供给 Wasm 虚拟机解释执行的不是平台相关的**机器码**，而是由 Wasm 自定义的一套指令集所构成的**字节码**，主要是为了实现跨平台的目的 —— 用软件去模拟 CPU，并定义一套类似 CPU 指令集的自定义指令集，这样只需要虚拟机本身的程序针对不同平台适配即可，而运行在虚拟机上的程序则无需关心跑在哪个平台上。

### Wasm 指令集

Wasm 指令主要分为 5 大类：

1.  **控制指令**—函数调用/跳转/循环等
2.  **参数指令**—丢弃栈顶等
3.  **变量指令**—读写全局/局部变量
4.  **内存指令**—内存加载/存储
5.  **数值指令**—数值计算

每条指令包含两部分信息：操作码和操作数。

*   **操作码（Opcode）**：是指令的 ID，决定指令将执行的操作，固定为 1 个字节，因此指令集最多包含 256 种指令，这种代码又被称为**字节码**。Wasm 规范共定义了 178 种指令。由于操作码是一个整数，便于机器处理但对人不友好，因此 Wasm 规范给每个操作码定义了助记符。

下图是 Wasm 部分指令的操作码助记符的枚举，完成版请查阅 [github.com/mcuking/was…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmcuking%2Fwasmc%2Fblob%2Fmaster%2Fsource%2Fopcode.h "https://github.com/mcuking/wasmc/blob/master/source/opcode.h")。

![](/images/jueJin/bcb833b43350032.png)

另外 GitHub 上有一个可视化表格比较直观地展示了 Wasm 所有的操作码，感兴趣的同学可以点击查看下。

[pengowray.github.io/wasm-ops/](https://link.juejin.cn?target=https%3A%2F%2Fpengowray.github.io%2Fwasm-ops%2F "https://pengowray.github.io/wasm-ops/")

![](/images/jueJin/9f02bab0b35c526.png)

关于操作数的内容会在下面的栈式虚拟机部分介绍。

### 栈式虚拟机

虚拟机又大致分为两种：寄存器虚拟机和栈式虚拟机。

*   **寄存器式虚拟机**：完全按照硬件 CPU 实现思路，虚拟机内部也模拟了寄存器，操作数和指令执行的结果均可存放在寄存器中。实际案例有 V8 / Lua 虚拟机。 因为寄存器个数是有限的，如何将无限的变量分配到有限的寄存器中而不冲突，需要寄存器分配算法，例如经典的图着色算法。所以寄存器式虚拟机实现难度略大，但优化潜力更大。
*   **栈式虚拟机**：指令的结果存储在模拟的操作数栈（Operand Stack）中，和**寄存器式虚拟机**相比实现更简单。实际案例有 JVM / QuickJs / Wasmer。

接下来我们就详细介绍下栈式虚拟机的工作机制。

#### 操作数

栈式虚拟机主要特点是拥有一个操作数栈，Wasm 绝大部分指令都是在操作数栈上执行某种操作，例如下面的指令：

`f32.sub`：表示从操作数栈弹出 2 个 32 位浮点数，计算它们的差并将结果压入到操作数栈顶。

![](/images/jueJin/4adc32ecfec1523.png)

其中从操作数栈弹出的 2 个 32 位浮点数就是操作数，下面是具体定义：

> **操作数**，也称**动态操作数**，是指在运行时位于操作数栈顶并被指令操纵的数。

#### 立即数

我们再看另一个指令的例子：

`i32.const 3`：表示压入索引为 3 的 32 位整数类型的局部变量到操作数栈顶。

而这个数值 3 就是立即数，下面是具体定义：

> **立即数**，也称**静态立即参数 / 静态操作数**，立即数是直接硬编码在指令里的（也就是字节码里），紧跟在操作码后面。大部分 Wasm 指令是没有立即数的，欲知 Wasm 指令中具体哪些指令是带有立即数的，请查阅 [github.com/mcuking/was…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmcuking%2Fwasmc%2Fblob%2Fmaster%2Fsource%2Fmodule.c "https://github.com/mcuking/wasmc/blob/master/source/module.c") 中的 `skip_immediate` 函数。

上面讨论的仅仅是一条指令的执行，下面我们在看下一个函数在栈式虚拟机上是如何被执行的：

1.  调用方将参数压入到操作数栈中
2.  进入函数后，初始化参数
3.  执行函数体中的指令
4.  将函数的执行结果压入到操作数栈顶并返回
5.  调用方从操作数栈上获取函数的返回值

如下图所示：

![](/images/jueJin/86e3071133de290.png)

由此可见，函数调用时参数传递和返回值获取，以及函数体中的指令执行，都是通过操作数栈来完成的。

### 调用栈和栈帧

从上面的描述中可以看出，函数调用经常是嵌套的，例如函数 A 调用函数 B，函数 B 调用函数 C。因此需要另外一个栈来维护函数之间的调用关系信息 —— **调用栈（Call Stack）**。

**调用栈**是由一个个独立的**栈帧**组成，每次函数调用，都会向调用栈压入一个栈帧（注意：为了阐述的简洁明了，仅讨论函数情况，其他例如 If / Loop 等控制块暂不在本文讨论中）。每次函数执行结束，都会从调用栈弹出对应栈帧并销毁。一连串的函数调用，就是不停创建和销毁栈帧的过程。但在任一时刻，只有位于调用栈顶的栈帧是活跃的，也就是所谓的**当前栈帧**。

![](/images/jueJin/78304dcb0ddc881.png)

每个栈帧包括以下内容：

1.  **栈帧关联的函数结构体变量**，用于存储该函数的所有信息。
2.  **操作数栈**，用于存储参数、局部变量、以及函数体指令执行过程中的操作数。 需要提醒的是，**所有函数关联的栈帧是共用一个完整的操作数栈**，每个栈帧会占用这个操作数栈中的某一部分，每个栈帧只需要一个指针保存自己那部分操作数栈栈底地址，用以和其他栈帧的操作数栈部分做区分即可。 这样做的好处是：调用方函数和被调用函数所关联的栈帧的操作数栈部分在整个操作数栈中是相邻的，便于调用方函数将参数传递给被调用函数，也便于被调用函数执行完成后将返回值传递给调用函数。
3.  **函数返回地址**，用于存储该栈帧调用指令的下一条指令的地址，当该栈帧从调用栈弹出时，会返回到该栈帧调用指令的下一条指令继续执行，换句话说就是当前栈帧对应的函数执行完退出后，返回到调用该函数的地方继续执行后面的指令。

![](/images/jueJin/412759b11985461.png)

> Tip: 目前这个解释器定义的栈帧中比没有类似 JVM 虚拟机栈帧中的局部变量表，而是将参数、局部变量和操作数都放在了操作数栈上，主要目的有两个：
> 
> 1.  实现简单，不需要额外定义局部变量表，可以很大程度简化代码。
> 2.  让参数传递变成无操作 NOP，可以让两个栈帧的操作数栈有一部分数据是重叠的，这部分数据就是参数，这样自然就起到了参数在不同函数之间传递的作用。

### 实际示例

经过上面的铺垫，相信大家对栈式虚拟机有了一定的认识。最后我们用一个实际示例来阐述下整个执行过程：

下面这个 Wasm 文本格式中的有两个函数：compute 函数和 add 函数，其中 add 函数主要是接收两个数（类型分别是 32 位整数和 32 位浮点数），计算两数之和。compute 函数中调用了两次 add 函数，注意第二次调用 add 函数时，操作数栈上已经保存了上次调用 add 函数时的返回结果（再一次印证了两个函数关联的栈帧是共用同一个完整的操作数栈的，可以很便捷地实现函数之间参数的传递），所以这次仅需要传入第二个参数即可。

```sh
(module
(func $compute (result i32)
i32.const 13    ;; 向操作数栈压入 13
f32.const 42.0  ;; 向操作数栈压入 42.0
call $add       ;; 调用 $add 函数得到 55
f32.const 10.0  ;; 向操作数栈压入 10.0
call $add       ;; 再调用 $add 函数得到 65
)
(func $add(param $a i32) (param $b f32) (result i32)
i32.get_local $a  ;; 将类型为 32 位整数的局部变量 $a 压入到操作数栈
f32.get_local $b  ;; 将类型为 32 位浮点数的局部变量 $b 压入到操作数栈
i32.trunc_f32_s   ;; 将当前操作数栈顶的 32 位浮点数 $b 截断为 32 有符号位整数（截掉小数部分）
i32.add           ;; 将操作数栈顶和次栈顶的 32 位整数从操作数栈弹出，并计算两者之和然后将和压入操作数栈
)
(export "compute" (func $compute))
(export "add" (func $add))
)
```

对应的就是其执行过程的示意图如下：

![](/images/jueJin/47c8bd381ec5c41.png)

最后展示下执行阶段对应的部分实际代码截图如下：

![](/images/jueJin/9f50e3497e36ff8.png)

可以看到虚拟机的取指、译码、执行三个阶段，可以使用 while 循环和 switch-case 语句来简单地实现。更多细节建议查阅 [github.com/mcuking/was…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmcuking%2Fwasmc%2Fblob%2Fmaster%2Fsource%2Finterpreter.c "https://github.com/mcuking/wasmc/blob/master/source/interpreter.c") 中的 `interpreter` 函数，其中有丰富的注释讲解。

结束语
---

以上就是 Wasm 解释器实现中的核心内容，当然这仅仅是 Wasm 解释器的最基本的功能 —— 简单地逐条解析并执行指令，没有像其他专业的解释器那样提供 JIT 功能 —— 即先解释执行字节码来快速启动，然后再通过 JIT 将其编译成平台相关的机器码，以提升后面代码执行的速度（注：JIT 的具体实现过程因解释器而异）。

所以用本项目的解释器解释执行 Wasm 文件，速度上并没有太多优势。但也正是由于其实现比较简单，所以源码更易读，并且其中有丰富的注释，所以非常适合对 Wasm 有兴趣的读者快速了解该技术的核心原理。

需要指出的是，本篇文章并没有涉及到如何使用 Wasm 技术。而恰好笔者正在基于 Wasm 和 FFmpeg 开发支持 H256 编码的视频播放器，相关文章链接如下：

[《深入 WebAssembly 之视频播放器应用篇》](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmcuking%2Fblog%2Fissues%2F98 "https://github.com/mcuking/blog/issues/98")

预计在视频播放器投入到实际生产环境后，逐步完善文章内容 —— 重点阐述如何在前端项目中更好地应用 Wasm 技术，敬请期待～

[github.com/mcuking/blo…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmcuking%2Fblog "https://github.com/mcuking/blog")

参考资料
----

*   [《WebAssembly 原理与核心技术》](https://link.juejin.cn?target=https%3A%2F%2Fbook.douban.com%2Fsubject%2F35233448%2F "https://book.douban.com/subject/35233448/")
*   [《WebAssembly 实战》](https://link.juejin.cn?target=https%3A%2F%2Fbook.douban.com%2Fsubject%2F35459649%2F "https://book.douban.com/subject/35459649/")
*   [《WebAssembly 标准入门》](https://link.juejin.cn?target=https%3A%2F%2Fbook.douban.com%2Fsubject%2F30396640%2F "https://book.douban.com/subject/30396640/")
*   [github.com/kanaka/wac](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fkanaka%2Fwac "https://github.com/kanaka/wac")
*   [github.com/wasm3/wasm3](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fwasm3%2Fwasm3 "https://github.com/wasm3/wasm3")

> 本文发布自 [网易云音乐大前端团队](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fx-orpheus "https://github.com/x-orpheus")，文章未经授权禁止任何形式的转载。我们常年招收前端、iOS、Android，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！