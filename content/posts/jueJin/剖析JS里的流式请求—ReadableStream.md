---
author: "叶知秋水"
title: "剖析JS里的流式请求—ReadableStream"
date: 2024-06-27
description: "了解什么是WebStreamsAPI，并深度解析ReadableStream，背压，了解如何使用它，使用过程中的注意点和应用场景。"
tags: ["API","性能优化"]
ShowReadingTime: "阅读15分钟"
weight: 78
---
![未命名__2024-06-27+14_15_34.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e7aee78d69c43a186d1317092715bd5~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1350&h=575&s=147067&e=png&b=f1622e)

对于XMLHttpRequest和Fetch，作为前后端通信的主要协议，相信大家都烂熟于心了，它允许我们发送Http请求，以文本格式跟后端通信。那Web Streams API，你用过么？一种在浏览器操作Streams流的API。今天主要介绍一下ReadableStream。

1、什么是流
======

在介绍流之前，我们先来了解一下什么是流。如名称所示，流就像水流一样，会持续性地从一段流动到另一端，只有当上游停止输入时，才会断流。而在浏览器中流会将你想要的资源分成一个个小的分块，然后按位处理它。

实际上，流无处不在，例如看视频时不用完整下载完才可以播放，而是可以边缓冲区边播，又或者我们看到的图像逐渐地显示。

但曾经这些对于 JavaScript 是不可用的。以前，如果我们想要处理某种资源（如视频、文本文件等），我们必须下载完整的文件，等待它反序列化成适当的格式，然后在完整地接收到所有的内容后再进行处理。

Web Streams API 最初是在 2017 年左右开始在浏览器中得到支持的。它被设计为一个标准 API，用于处理数据流，类似于 Node.js 中的 Streams API，但更加现代和统一。Web Streams API 包括 ReadableStream、WritableStream 和 TransformStream，它们可以用于实现复杂的数据流处理逻辑。

具体来说，Web Streams API 被引入到 WHATWG（Web Hypertext Application Technology Working Group）的 Streams 规范中，随后逐渐被主流浏览器厂商所采纳。到了 2018 年，大多数现代浏览器已经开始支持或部分支持这个 API1116。

随着时间的推移，Web Streams API 的支持度不断提高，并且被集成到了各种 Web 平台和工具中。例如，Node.js 在其后续版本中也开始支持 Web Streams API，允许开发者使用统一的 Streams API 来处理服务器端和客户端的流数据。

2、API介绍
=======

了解了Streams API之后，我们来介绍一下今天的主角ReadableStream。

**1、构造函数**

scss

 代码解读

复制代码

`new ReadableStream(underlyingSource, queuingStrategy)`

其接受两个可选参数underlyingSource 和queuingStrategy。下面来介绍一下这两个参数：

**underlyingSource：用于定义流的行为**

**其支持的方法如下：**

*   [`start`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FReadableStream%2FReadableStream%23start "https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream/ReadableStream#start") (controller) 可选
    
    当对象被构造时立刻调用该方法。支持异步，异步时需返回一个 promise，表明成功或失败。其形参controller 是一个 ReadableStreamDefaultController 或 ReadableByteStreamController，具体是谁根据类型而定，反正就是一个拥有3个方法（close、enqueue、error）的流控制器，可以通过控制器的enquene方法把数据添加到流里面
    
*   [`pull`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FReadableStream%2FReadableStream%23pull "https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream/ReadableStream#pull") (controller) 可选
    
    当流的内部队列不满时，内部会自动重复调用这个方法，直到队列补满。如果 `pull()` 返回一个 promise，那么它将不会再被调用，直到 promise 完成;如果 promise 失败，该流将会出现错误。其形参跟start上的是一致的。
    
*   [`cancel`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FReadableStream%2FReadableStream%23cancel "https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream/ReadableStream#cancel") (reason) 可选
    
    当流被取消时调用此方法。该方法应该做任何必要的事情来释放对流的访问。 如果这个过程是异步的，它可以返回一个 promise，表明成功或失败。原因参数包含一个 [`DOMString`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FString "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String")，它描述了流被取消的原因。
    

其支持的属性如下：

*   [`type`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FReadableStream%2FReadableStream%23type "https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream/ReadableStream#type") 可选
    
    该属性控制正在处理的可读类型的流。如果它包含一个设置为 `bytes` 的值，则传递的控制器对象将是一个 [`ReadableByteStreamController`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FReadableByteStreamController "https://developer.mozilla.org/en-US/docs/Web/API/ReadableByteStreamController")，能够处理 BYOB（带你自己的缓冲区）/字节流。如果未包含，则传递的控制器将为 [`ReadableStreamDefaultController`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FReadableStreamDefaultController "https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStreamDefaultController")。
    
*   [`autoAllocateChunkSize`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FReadableStream%2FReadableStream%23autoallocatechunksize "https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream/ReadableStream#autoallocatechunksize") 可选
    
    对于字节流，开发人员可以使用正整数值设置 `autoAllocateChunkSize` 以打开流的自动分配功能。启用此功能后，流实现将自动分配一个具有给定整数大小的 [`ArrayBuffer`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FArrayBuffer "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer")，并调用底层源代码，就好像消费者正在使用 BYOB reader 一样。
    

**queuingStrategy：定义流的队列策略**

*   [`highWaterMark 可选`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FReadableStream%2FReadableStream%23highwatermark "https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream/ReadableStream#highwatermark")
    
    非负整数 - 这定义了在**应用背压**之前可以包含在内部队列中的块的总数。当队列达到这个阈值时，流将停止从源获取数据，直到消费者从队列中取出一些数据。
    
*   [`size(chunk) 可选`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FReadableStream%2FReadableStream%23sizechunk "https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream/ReadableStream#sizechunk")
    
    是一个函数，形参chunk表示每个分块使用的大小（以字节为单位），通用用于帮助确定何时达到 highWaterMark。
    

下面先来看一个例子：

scss

 代码解读

复制代码

`const stream = new ReadableStream({   start(controller) {     interval = setInterval(() => {       let string = randomChars();       // Add the string to the stream       controller.enqueue(string);       // show it on the screen       let listItem = document.createElement("li");       listItem.textContent = string;       list1.appendChild(listItem);     }, 1000);     button.addEventListener("click", function () {       clearInterval(interval);       fetchStream();       controller.close();     });   },   pull(controller) {     // We don't really need a pull in this example   },   cancel() {     // This is called if the reader cancels,     // so we should stop generating strings     clearInterval(interval);   }, });`

这里新建了一个ReadableStream流，在start的时机里不停地往controller.enqueue添加数据，知道按钮被点击之后停止流。

**2、实例方法**

ReadableStream的实力一共有5个实例方法和1个静态方法。具体如下：

`from()`：可以用于将可迭代或异步可迭代对象包装为可读流，包括数组、集合、promise 数组、异步生成器、ReadableStream、Node.js 可读流，等等\`

`cancel`：用于在不再需要来自它的任何数据的情况下（即使仍有排队等待的数据块）完全结束一个流。调用 cancel 后该数据丢失，并且流不再可读。为了仍然可以读这些数据块而不完全结束这个流，你应该使用 ReadableStreamDefaultController.close()。\`

`getReader`：创建一个 reader，并将流锁定。只有当前 reader 将流释放后，其他 reader 才能使用。\`

`pipeThrough`：提供了一种链式的方式，将当前流通过转换流或者其他任何一对可写/可读的流进行管道传输。\`

`pipeTo`：通过管道将当前的 ReadableStream 中的数据传递给给定的 WritableStream 并且返回一个 Promise，promise 在传输成功完成时兑现，在遇到任何错误时则会被拒绝。\`

`tee`：对当前的可读流进行拷贝\`

3、怎么用
=====

用法大家应该都了解了，但还是不知道可以用来干啥？那我们再来深入了解更多的案例体会一下吧。

**1、上面提到了背压一词，背压指的是什么？**

在流式处理中，背压（Backpressure）是一种机制，用于处理数据生产者（即数据源）和消费者（即数据处理者）之间的速率不匹配问题。当数据以比消费者处理速度更快的速率产生时，背压机制可以防止系统过载，并确保数据消费者不会因为数据泛滥而崩溃。

背压的工作原理：

1.  **速率控制**：背压允许消费者根据其处理能力向生产者发出信号，表明其能够处理数据的速率。
2.  **缓冲**：当生产者的数据产生速率超过消费者的处理速率时，数据会被临时存储在缓冲区中。
3.  **暂停/恢复数据流**：如果缓冲区满了，消费者可以向生产者发出信号，请求其暂停发送数据，直到缓冲区有足够空间。这可以通过各种方式实现，例如减少 `ReadableStream` 的内部队列大小或使用流控制协议。

在 Web Streams API 中的背压：

Web Streams API 通过 `ReadableStream` 和 `WritableStream` 内置了背压机制。以下是背压在 Web Streams 中的实现方式：

*   **`highWaterMark`**：这是一个设置在流构造函数中的参数，定义了内部队列可以包含的数据块的最大数量。当队列达到这个阈值时，流将停止从源获取数据，直到消费者从队列中取出一些数据。
*   **`size()`  函数**：这是队列策略的一部分，用于定义每个数据块的大小。这个函数帮助确定何时达到 `highWaterMark`。
*   **`ReadableStreamDefaultController`**：控制器中的 `desiredSize` 属性可以动态地反映当前消费者需要多少数据。如果 `desiredSize` 为负数，生产者将停止推送数据，直到 `desiredSize` 变为非负数。

背压的重要性：

背压是处理数据流的关键机制，特别是在以下情况下：

*   **网络I/O**：在网络请求中，服务器可能以比客户端处理速度更快的速度发送数据。
*   **文件I/O**：读取大型文件时，磁盘I/O可能比内存处理速度快。
*   **数据处理**：在数据处理应用中，数据转换或分析的速度可能跟不上数据的接收速度。

通过背压，开发者可以构建更加健壮和高效的数据流应用，确保即使在数据速率波动的情况下，应用也能稳定运行。

**2、既然start和pull都能使用controller，那都有什么应用场景呢？**

*   **使用 start**：当你需要在流开始时执行一次性的初始化操作，例如建立网络连接或准备数据源时，使用 `start` 回调。
    
*   **使用 pull**：当你的数据源可以动态地提供数据，并且你希望根据流的消费速度来控制数据的产生速率时，使用 `pull` 回调。`pull` 通常用于实现拉取（pull-based）的数据流逻辑，其中数据的生产取决于消费者的读取速度。
    

例如你正在实现一个从服务器请求数据的流，你可能首先在 `start` 回调中发起请求。当服务器开始发送数据，并且流的内部队列低于设定的阈值时，`pull` 回调可以被用来请求更多的数据块。

javascript

 代码解读

复制代码

`const stream = new ReadableStream({   start(controller) {     // 初始化操作，例如发起网络请求     const fetchRequest = fetch('your-data-source');     fetchRequest.then(response => {       // 响应可以作为流处理       const reader = response.body.getReader();       reader.read().then(({ value, done }) => {         if (done) {           controller.close();           return;         }         controller.enqueue(value);       });     });   },   pull(controller) {     // 流的内部队列不满时调用     // 这里可以放置逻辑以决定是否需要从源获取更多数据   } });`

**3、上面提到了创建时type有不同的类型，有什么区别？**

构造函数的type只有一个可选值bytes，默认情况下是不需要设置的，此时回调里拿到的controller是ReadableStreamDefaultController，当设置后会变成ReadableByteStreamController。其中bytes类型时，可以处理bytes类型的数据或者是BYOB 模式。

这个怎么理解？

BYOB 模式是一种读取模式，其中消费者（即读取者）提供自己的缓冲区（ArrayBuffer），并且数据直接读取到这个缓冲区中。这种模式允许更细粒度的控制内存使用，并且可以优化性能，特别是在处理大量数据时。

Byte Streams 是一种专门用于处理字节数据的流模式。在这种模式下，数据以 Uint8Array 形式提供，使得处理二进制数据变得更加简单和直接。

javascript

 代码解读

复制代码

`// byob模式 const stream = new ReadableStream({   type: 'bytes',   pull(controller) {     // 从数据源读取数据并填充到 controller 的 buffer 中   } }); const reader = stream.getReader({ mode: 'byob' }); const buffer = new ArrayBuffer(1024); // 消费者自己的缓冲区 reader.read(buffer).then(({ done, value }) => {   // 处理数据 }); // bytes stream const stream = new ReadableStream({   type: 'bytes',   start(controller) {     // 直接向流中 enqueue Uint8Array 数据块     controller.enqueue(new Uint8Array(/* ... */));   } }); const reader = stream.getReader(); reader.read().then(({ done, value }) => {   // 处理 Uint8Array 数据 });`

在实际使用中，选择哪种模式取决于具体的应用需求和性能考虑。BYOB 模式提供了更高的灵活性，而 Byte Streams 则提供了更简单的二进制数据处理方式。

**4、前面讨论的都是stream的创建，创建之后如何使用？**

可以通过getReader获取到实例后，进行读取。以下是一个例子：

javascript

 代码解读

复制代码

`const stream = new ReadableStream({   start(controller) {     // 初始化操作，例如发起网络请求     fetch("xxxxxxxxxxxx").then(response => {         // 检查响应是否成功         if (!response.ok) {           throw new Error('Network response was not ok');         }         // 将响应体转换为流         const reader = response.body.getReader();                  return readFromStream(reader, controller);       })       .catch(error => {         console.error('Fetch error:', error);         controller.error(error);       });   },   pull(controller) {     // pull 回调在这里不需要特殊操作，因为我们在 start 回调中已经处理了数据流   } }); // 辅助函数，用于递归读取流中的数据 function readFromStream(reader, controller) {   reader.read().then(({ value, done }) => {     if (done) {       controller.close(); // 没有更多数据，关闭流       return;     }     controller.enqueue(value); // 将数据块添加到流中     return readFromStream(reader, controller); // 递归读取下一个数据块   }); } // 使用 stream const reader = stream.getReader(); readStreamData(reader); function readStreamData(reader) {   // 读取数据并处理   reader.read().then(({ value, done }) => {     if (done) {       console.log('Stream has ended');       return;     }     // 处理数据 value     console.log('Stream data chunk:', value);     // 递归读取下一个数据块     readStreamData(reader);   }).catch(error => {     console.error('Error reading stream:', error);   }); }`

上面这个例子里，其实有两个流，一个是我们创建的ReadableStream，另一个则是Fetch返回的。Fetch返回的Response.body是暴露响应体内容的 ReadableStream，所以其也拥有getReader方法。

这里通过fetch的stream把数据传递给自己创建的stream，再在read内递归读取数据。

**5、ReadableStream在使用过程有什么需要注意的**

1.  **内存管理**：如果不正确地处理数据块，可能会导致内存使用过高。需要确保在数据处理完成后适时地释放内存。
    
2.  **流的关闭**：忘记关闭流可能导致资源泄露。在使用完流之后，应该调用 `controller.close()` 来关闭流。
    
3.  **错误处理**：流可能会遇到错误情况，例如网络请求失败或数据格式错误。需要在代码中添加错误处理逻辑，使用 `controller.error()` 方法来处理这些情况。
    
4.  **背压管理**：如果生产者（数据源）的数据产生速率远大于消费者（数据处理者）的处理速率，可能会导致背压问题。需要合理配置 `highWaterMark` 和 `size` 函数来管理内部队列的大小。
    
5.  **数据同步**：在处理来自不同源的多个 `ReadableStream` 时，同步数据块的顺序可能会变得复杂。
    
6.  **并发流**：同时处理多个流时，需要管理并发读取和写入操作，以避免竞态条件和数据不一致的问题。
    
7.  **数据完整性**：在流式传输过程中，需要确保数据块的完整性，特别是在处理二进制数据或需要解码的数据时。
    
8.  **取消流操作**：如果需要取消流操作，应该调用 `ReadableStream.cancel()` 方法，并在 `cancel` 回调中处理取消逻辑。
    
9.  **兼容性问题**：虽然大多数现代浏览器支持 `ReadableStream`，但仍需检查目标环境的兼容性，并在必要时使用 polyfills。
    
10.  **性能优化**：对于大型数据流，需要考虑性能优化，例如使用 Web Workers 来处理数据，避免阻塞主线程。
    
11.  **编码问题**：在处理文本数据时，需要注意字符编码问题，特别是在从二进制数据解码为文本时。
    
12.  **API 使用错误**：由于 `ReadableStream` API 相对复杂，可能会出现使用错误，例如错误地调用 `enqueue` 和 `close` 方法。
    
13.  **数据类型处理**：对于不同类型的数据（如文本、JSON、二进制数据等），需要采用适当的处理方法。
    

4、应用场景
======

`ReadableStream` 在现实世界中的业务场景非常广泛，以下是一些可行的场景：

1.  **网络请求响应处理**： 使用 `fetch` API 进行网络请求时，响应体可能是一个 `ReadableStream`。这允许应用以流式传输的方式逐步读取响应数据，而不是一次性加载整个响应体。
    
2.  **文件上传和下载**： 在处理大文件上传或下载时，`ReadableStream` 可以用于分块读取或写入文件数据，从而优化内存使用并提高处理速度。
    
3.  **实时数据流**： 在需要处理实时数据流的应用中，如股票行情更新或实时通讯，`ReadableStream` 可以用于持续接收和处理数据。
    
4.  **视频和音频流**： 对于视频点播或直播服务，`ReadableStream` 可以用于实现视频或音频数据的流式传输和播放。
    
5.  **日志文件处理**： 在服务器或应用程序生成大量日志数据时，可以使用 `ReadableStream` 来逐步读取和分析日志文件，实现实时监控和报警。
    
6.  **数据转换和处理**： 在需要对数据进行转换或处理的应用中，如将 CSV 数据转换为 JSON 格式，`ReadableStream` 可以逐步读取、转换并输出数据。
    
7.  **图像和图表的生成**： 对于动态生成图像或图表的应用，`ReadableStream` 可以用于将生成的图像数据逐步传输给客户端。
    
8.  **数据库查询结果**： 在执行数据库查询时，如果结果集很大，可以使用 `ReadableStream` 来逐步读取查询结果，避免一次性加载过多数据。
    
9.  **Web 字节流操作**： 在 WebGL 或 WebAssembly 等技术中，`ReadableStream` 可以用于读取和处理字节流数据。
    
10.  **服务端分页**： 在服务端分页的场景中，`ReadableStream` 可以用于实现服务器端的分页逻辑，逐页读取数据并发送给客户端。
    
11.  **API 响应流**： 当 API 需要返回大量数据时，可以利用 `ReadableStream` 实现响应流，客户端可以逐步接收数据，实现懒加载。
    
12.  **多阶段数据处理**： 在需要多阶段数据处理的业务流程中，`ReadableStream` 可以用于在不同阶段之间传递数据流，实现复杂的数据处理逻辑
    

Web Streams API，特别是 ReadableStream，为现代 Web 开发提供了一个强大而灵活的数据处理方案。它不仅提高了内存使用效率，还优化了异步数据流的处理方式。随着浏览器对这一 API 支持的不断完善，我们有理由相信，ReadableStream 将成为未来 Web 开发中不可或缺的一部分。