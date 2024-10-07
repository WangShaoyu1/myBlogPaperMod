---
author: "云之舞"
title: "ReactNative原理系列-老架构"
date: 2024-01-27
description: "到目前为止，具有完全新架构的正式版ReactNative还没有发布，新架构相关的功能和文档都是作为试验阶段的尝鲜功能发布的。即使你是全新的项目，完全按照官方文档的指引，使用最新的配置，也不一定能一帆"
tags: ["前端"]
ShowReadingTime: "阅读29分钟"
weight: 597
---
到目前为止，具有完全新架构的正式版React Native还没有发布，新架构相关的功能和文档都是作为试验阶段的尝鲜功能发布的。即使你是全新的项目，完全按照官方文档的指引，使用最新的配置，也不一定能一帆风顺的把项目跑起来。从18年Meta公司的工程师有想法开始，到如今一个准面世状态，4年过去了。用4年的时间一直做一个不能直接产生价值的技术升级，这在国内的公司里，无论这个公司是大是小，几乎是不可想象的，公司能够给你4个月的时间做技术升级改造就已经是最大的包容了。毕竟4年的时间，可能早已物非人非了。

新架构之前的React Native可以说还不能算作一个完善的产品，巨大的性能缺陷让它无法真正流行。每一个选择它的团队或多或少都会因为它的性能问题买单，甚至可能被它带入深渊。 这些问题如果不解决，React Native将会一直在生死线上挣扎。不过幸好的是React Native的背后是的Meta（Facebook）公司，经过4年的磨练，React Native终于上升了一个台阶，最可贵的是他们对用户的反馈响应非常迅速、友好、开放，这也从一个侧面可以看出Meta公司的工程师对这个项目很热情很有信心。

如果一上来就贴代码抠细节可能大家会觉得不知所云，我们准备分多篇文章，采用分层讲解的方式，大家先了解全貌，再逐步深入细节。我们先从老版RN的架构开始，再过渡到新架构，再到源码，这样大家对新架构的理解会更深入。

React的诞生
--------

软件领域一直在做一件事情，就是抽象、封装，具体到web前端，数据绑定是近十年web前端领域最具创新意义的抽象封装之一，看一下下面的演进图：

早期的web前端： ![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0230bc2a8ca84d32a23d2521292c7155~tplv-k3u1fbpfcp-image.image#?w=457&h=424&s=12357&e=svg&a=1&b=81c783)

交互与展示分离后的web前端：

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7bd56f95e2fd4f54b0ef88883f0e6679~tplv-k3u1fbpfcp-image.image#?w=460&h=426&s=2631&e=svg&a=1&b=4ed9d0)

组件化的web前端：

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83082db3be0d46368cfbc202fd161476~tplv-k3u1fbpfcp-image.image#?w=630&h=339&s=10014&e=svg&a=1&b=fee3d1)

这三种演进都是相对简单的。而下面的创新就不是随便能发生的了，那就是数据和视图绑定的组件化web前端（MVVM），React就是属于其中的一种实现，React在这种情况下诞生： ![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23b005bf3e6d4aad94d845136babdf16~tplv-k3u1fbpfcp-image.image#?w=646&h=390&s=12920&e=svg&a=1&b=c5e3c7)

数据和UI绑定之后，开发人员只需要操作数据就可以更新UI，再也不需要做繁复的DOM操作了，业务逻辑都和具体的DOM操作解偶了，这就给跨平台带来了一个契机： ![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a482b264c28b45a1884a355b4025de04~tplv-k3u1fbpfcp-image.image#?w=646&h=371&s=16049&e=svg&a=1&b=fde4ca)

React Native在这种情况下诞生了。

React Native的诞生
---------------

现在我们再次从头整理一下React Native的设计。 首先，为什么需要React Native？ Meta公司（Facebook）2012年的时候决定要变成移动优先的公司，他们在移动端尝试HTML5，但是在2013年的时候放弃了，扎克伯格亲口说这是他们最糟糕的决定。Webview中的HTML5有哪些问题呢？下面是Meta公司列出的问题：

*   不能很好的控制键盘
*   没有足够的手势和touch event API
*   没有管理图片的能力

其实HTML5的问题远不止这些，HTML5在沙箱中执行，可以说是戴着镣铐跳舞，有太多的限制。 所以如果要想有一个好的用户体验，还是需要Native，但是Native也有明显的缺点：

*   迭代太慢，每次发版都需要应用商店审核
*   代码比较复杂，维护难度高
*   iOS和Android需要分别开发，成本比较高

React Native便是来解决这些问题的，下面看一下React Native的设计。

1.  不再使用Webview，不再使用HTML5，所有的渲染由Native完成
2.  业务逻辑部分由Javascript完成，内嵌React，Native组件以React组件的形式提供给开发人员
3.  布局使用CSS的Flex布局，通过Yoga转成Native可识别布局方式传给Native
4.  Javascript可以获得Native的能力，例如获取设备ID

这个设计如果一切都按照预想的运行，开发效率相比于纯Native开发应该是极高的：

1.  开箱即用的Flex布局秒杀了Native自带的布局方式
2.  React的数据绑定和组件化开发方式秒杀了Native中复杂的开发方式

但是细节是魔鬼，React Native真正铺开被广泛使用时，它的缺陷暴露出来了：

1.  Javascript相比于Native始终是慢的
2.  Javascript和Native的通信成为了性能瓶颈

性能问题一直是React Native最最关键的问题，它导致React Native无法真正的流行，团队如果使用了它，或多或少都要为性能问题买单，虽然React Native中所有有性能问题的地方都可以切换成纯Native去实现，但是整个App的复杂度增加了，相比于纯Native团队，使用React Native会对团队架构师的架构能力、人员的组织协调有更高的要求，不过如果能把这些都做好，React Native是可以发挥出它的优势的。

咱们来看一下React Native的架构细节，结合上面Web前端架构重新画一张更细的架构图，如下所示： ![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7933a7d0dd3544f6b6a2483be53c3968~tplv-k3u1fbpfcp-image.image#?w=926&h=768&s=19867&e=svg&a=1&b=feb74d)

这张图稍微有些复杂，分为平台无关和平台相关两部分，平台无关部分就是上面说的Web前端架构部分，平台相关部分理论上可以对接任何平台的图形界面，常见的有浏览器（React DOM）、Android/iOS（React Native）。

这就是整个React体系在平台扩展方面的图景，通过对React这个VM层的抽象，将用户代码和平台做了解偶。用户代码和React部分是平台无关的部分，React DOM和React Native是平台的适配器，它们将平台和React连接起来。无论是什么样的平台，只要按照React的要求去对接，都可以以React的方式来开发该平台的图形界面，而React是目前所有UI技术中开发效率最高的方式之一，这不得不说是前端技术的一次创新发展！

React DOM和React Native一方面需要和React沟通，另一方面则需要和平台沟通来渲染图形界面，下面咱们说一下这两部分。

1.  如何与React沟通 React虽然诞生于浏览器端，但是它对DOM操作进行了封装，并且在后来的版本中将DOM相关部分完全独立出去形成了单独的npm包。这给React继续向其他平台扩展带来了可能性。React采用依赖注入的方式来与平台适配器（React DOM、React Native）适配。依赖注入并不是什么复杂的操作，举个例子： 在React中`ReactComponentEnvironment.processChildrenUpdates`负责子组件DOM更新相关的操作，但是React只是调用这个方法，具体实现是交由平台的相关部分去实现的。下面看一下伪代码。
    
    React Native往React注入`ReactNativeComponentEnvironment`中：
    
    javascript
    
     代码解读
    
    复制代码
    
     `ReactComponentEnvironment.injection.injectEnvironment(    ReactNativeComponentEnvironment  );`
    
    React中接受外界注入的方法：
    
    javascript
    
     代码解读
    
    复制代码
    
     `var ReactComponentEnvironment = {    injection: {      injectEnvironment: function(environment: Environment) {        ReactComponentEnvironment.processChildrenUpdates =          environment.processChildrenUpdates;        },      },  };`
    
    React Native中，`ReactNativeComponentEnvironment`被注入给`ReactComponentEnvironment` 在React中，React Native的对象作为`injectEnvironment`的参数被注入。 这里并不想对这部分讲太多，因为这部分更多的是React的逻辑并不是React Native的关键点。下面咱们着重说一下和平台的沟通。
    
2.  如何与平台沟通
    
    *   与浏览器沟通： 与各种平台沟通中最方便的平台就是浏览器了，这毕竟是React诞生的环境，浏览器对Javascript是直接支持的，浏览器利用Javascript引擎的扩展功能对Javascript的功能进行了扩展，从而Javascript具有了直接控制浏览器UI的能力，具体表现形式则是浏览器的DOM API，这部分相信大家都比较熟悉了，也不是这篇文章的重点，就不详细讲解了。
        
    *   与Android/iOS沟通 上面的架构图中可以看到，Javascript和Native间通过Bridge进行沟通，这部分也是React Native的核心功能之一，需要好好讲一下。 关于Javascript与平台原生语言之间的通信可以有以下几种方式：
        
        *   将Javascript编译成平台原生代码或者平台能够识别的中间代码或者最终的机器码
        *   进程间通信(管道、socket、共享内存、网络)
        *   Javascript与其执行引擎所用语言间互操作
        
        第一种方式的工作量是巨大的，因为如果Javascript直接跳过原生语言，就等于跳过了平台和第三方提供的所有库和工具，跳过了整个原生生态系统。不过Flutter就是这样做的。
        
        第二种方式具体可以使用IPC通信方式或者网络通信方式，但是不管是哪种，都需要对数据进行复制、序列化反序列化操作，较慢的UI反应速度可能会让我们失去用户，这种方式无论如何都不算是优选方案。
        
        第三种方式两种语言可以直接互操作，虽然没有达到Objective C/Swift和C语言那种可以直接 相互引用的程度，但是可以以Javascript的解释引擎作为媒介来进行相互调用。Javascript本身并不是先编译链接成机器码再执行的，而是通过另外一个程序来执行Javascript程序文本，这样的话这个程序内部肯定是可以知道Javascript的具体执行情况的，那这个程序的编程语言自然也就可以和Javascript通信了，这个编程语言释放出来的API自然也能做到和Javascript通信。 React Native便是采用的这种方式。以这个为方向，我再来思考更具体的实现。 既然是使用Javascript引擎来作为Javascript与Native语言通信的中介，那选一个Javascript引擎就比较关键了。
        
        V8是最近十年最优秀的Javascript引擎，提供Javascript与C++的相互调用功能，应该是一个理想的选择，但是V8没有办法在苹果手机上使用，因为V8的JIT Compilation（即时编译）功能会在运行时生成代码，会向内存中写入程序并执行它，而苹果不允许其他软件厂商的软件在苹果手机上使用可写可执行的内存，这导致JIT功能无法在iOS上使用。
        
        剩下的唯一选择就是苹果自家的JavascriptCore了，React Native选择JavascriptCore。JavascriptCore是苹果自家研发的Javascript引擎，也有JIT功能，可惜只有苹果自己的软件和内嵌的WKWebkit才可以使用JIT功能，导致React Native即使使用了JavascriptCore也没法使用JIT功能，而没有JIT的JavascriptCore的性能肯定是大打折扣的。
        
        JavascriptCore由苹果开发，提供了Javascript和C语言的相互调用的功能，而Objective C是C语言的超集，相互之间可以混合使用，且JavascriptCore被内置在iOS上，因此在iOS上Javascript与Native语言的通信相对是比较容易的。 而在Android平台上，并没有内置JavascriptCore，且JavascriptCore也没有Javascript与Java/Kotlin互调的功能，所以会麻烦一些，不过解决方案还是有的，JavascriptCore提供Javascript与C语言互调的能力，Java/Kotlin的JNI也提供了与C语言的互调能力，都能与C语言互调，因此C语言便成了Javascript与Java/Kotlin互调的桥梁。在Webkit中JavacriptCore是一个独立的存在，可以将其拿出来放到Android平台上使用，不过如此一来每个Android的App包中都要包含一个JavascriptCore。 下面是一张简单的图，说明JavascriptCore所起的作用： ![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1aff846cc8de453a80052cfb8ad6f3e8~tplv-k3u1fbpfcp-image.image#?w=285&h=382&s=8144&e=svg&a=1&b=6bdde5) 上面的图中的内容是React Native与Native语言通信的基础。
        

有了以上这些关键技术和背景，React Native便有了诞生最基本的条件，在这些基本条件之上还有很多事情要做，下面咱们来了解一下。

Bridge
------

React Native的关键技术中首先就是Bridge，Bridge是Javascript与Native代码沟通的桥梁，它是React Native的关键所在。上面已经提到JavascriptCore提供了两边通信的基本保障，可能大家会觉得有了JavascriptCore，事情就变得简单了，JavascriptCore就是我们需要的Bridge，Javascript和C/Objective C/Swift互调，C再和Java/Kotlin互调，然而这里可能有个问题，JavascriptCore关于Javascript和Native互调的API都是同步API，也就是说一方都要等另一方的函数执行完成才能继续往下执行，而跨语言的调用由于涉及到类型转换等操作，势必要比语言内部调用要慢一些，这对于Javascript这种单线程语言会有很大的不利，因为单线程，一个较慢的操作会阻塞住后续的Javascript执行，从而降低Javascript代码的执行性能。下图是对这个问题的形象解释：

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c7c8eeca6b24dbcad117d7fcaea4d81~tplv-k3u1fbpfcp-image.image#?w=914&h=283&s=13055&e=svg&a=1&b=faa230)

面对这个问题，我们前端的同学肯定第一时间想到的就是异步，对，Javascript对Native的调用完全可以采用异步的形式，如果是异步的形式，我们的流程图变成下面这样： ![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0116091ec95a4cde9e634a019db3b86b~tplv-k3u1fbpfcp-image.image#?w=914&h=283&s=13553&e=svg&a=1&b=f68d14)

在异步流程中，由于不再需要等待Native代码执行完成，代码1和代码6会迅速执行完成，而在同步代码流程中，这两段代码会一直占用分配给线程的CPU直到Native执行完成。另外在异步流程中由于代码4和代码5变成了代码1的回调函数，代码7变成了代码6的回调函数，因此相比于同步代码，他们的执行顺序会有根据Native端代码的执行时长而有所变化。从时间轴可以看到异步流程的执行效率会变高，因为不再有代码的同步等待。尽管后来React Native经过实际使用后，发现异步也会带来一些问题，但是在当初开发设计React Native时，这个异步设计是无可厚非的。

如果要使用异步，就来了问题了，JavascriptCore并没有提供异步的API，因此就需要React Native的创造者自己实现，下面我们来看一下React Native是如何实现异步的。

我们拿一段Javascript代码举例，来说明React Native bridge关于异步部分的执行流程：

javascript

 代码解读

复制代码

`import {NativeModules} from 'react-native'; let a = 1; NativeModules.Device.getDeviceInfo((deviceInfo) => {   setTimeout(() => {       a = deviceInfo;   }, 1000); });`

我们先省去其他细节，先看大体的执行流程：

1.  用户点击App图标
2.  App启动，Native开启Javascript线程，并开始用JavascriptCore加载Javascript代码（第一轮事件循环）
3.  `let a = 1`开始执行
4.  `NativeModules.Device.getDeviceInfo`开始执行，`Device`是一个Native模块，`getDeviceInfo`的真正实现在Native端
5.  `NativeModules.Device.getDeviceInfo`整个函数调用的描述信息被组织成JSON的格式存入数组（即所谓的队列）
6.  Javascript执行完成，返回到Native端，Native获取Javascript中队列的数据并反解成Native模块方法的调用
7.  完成Native模块的调用后，Native开始回调Javascript代码中专门处理回调的函数，并将业务数据传给Javascript（新一轮事件循环）
8.  进入`(deviceInfo) => {}`，开始执行`setTimeout`，`setTimeout`内部由Native Module实现，因此Javascript中的`setTimeout`实际上只是往队列中插入它的描述信息（新一轮事件循环完成）
9.  Javascript执行完成，返回到Native端，Native获取Javascript中队列的数据并反解成Native模块方法的调用
10.  Native模块等超时时间1000毫秒到达时，回调Javascript中`setTimeout`的回调函数`() => {a = deviceInfo}`(新一轮事件循环)
11.  Javascript执行完成，返回Native，这次队列为空，没有模块调用，流程结束

不知道大家看到这个流程会不会有些意外，尤其是`setTimeout`的部分，是的，`setTimeout`并不属于ECMAScript标准，而是HTML规范的标准，JavascriptCore作为纯Javascript语言的运行环境，不去实现`setTimeout`就不奇怪了，不过虽然JavascriptCore没有实现`setTimeout`，但是它提供了C语言的接口，像Safari浏览器等使用JavascriptCore作为Javascript运行环境的应用程序都会基于C语言接口去实现`setTimeout`，所以其实也可以认为`setTimeout`其实也是一种跨语言的模块调用。那`setTimeout`的异步功能是怎么实现的呢？对于JavascriptCore的调用者Native代码来说，它所能切分的Javascript的最小单位就是一次完整的同步Javascript的执行，像`setTimeout`这种一段时间后需要继续运行的异步功能，则需要在Native中切分成两次同步的Javascript任务来实现，一次同步地执行`setTimeout`函数，另一次同步地执行回调函数，中间的间隔时间的控制由Native代码来实现。这种实现方式在浏览器和Node.js中有一个名词叫做：Event Loop（事件循环） 事件循环就是程序待命的时候是等候状态，待新的事件触发时开始执行程序，等事件处理完成，程序重新进入待命状态，依次循环往复。可以看到其实事件循环和具体的程序语言是完全可以分开的，具体要怎么循环，完全可以由业务方自行决定，程序语言就像一把刀，什么时候怎么使用这把刀是由具体的使用者和使用场景决定的。因此JavascriptCore并没有实现事件循环，谷歌的V8引擎有一个自带的事件循环，但是使用者完全可以替换掉它，而Node.js虽然使用了V8引擎，但是确有自己的一套事件循环机制。在React Native中，Javascript更像是处于工作线程中，当其他线程需要Javascript工作线程执行任务时则开始调用工作线程，工作线程处理完成返回给调用方，每个批次的执行都是一次同步的Javascript执行，若干次的执行Javascript也就像是浏览器中的事件循环，这不过这里的事件循环由App的Native代码实现。我们通过一张图来形象地看一下：

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3e93d0a416e408cbe8e6f3dc75ada66~tplv-k3u1fbpfcp-image.image#?w=604&h=620&s=14318&e=svg&a=1&b=c4ebd5)

图中Native一轮又一轮的执行Javascript任务，直到所有任务完成。当有用户事件或者有其他触发条件时（例如文件数据读取返回）Native会重新发起Javascript任务。在复杂的事件循环系统中，例如Node.js，任务会被分成若干种队列，每个队列的优先级会有所不同。React Native中的事件循环相对则要简单很多。

总结一下就是，Javascript中像`setTimeout`这种异步任务实际上是被分切成若干同步的任务然后在Javascript外部分别调用完成的。所以对于Javascript语言解释器来说，它可能都不太需要知道这种具体异步任务的存在，它只需要一行行的执行代码就可以了。

另外在这里咱们也顺便说一下微任务。像`setTimeout`这种异步任务达到运行条件后，需要排着队挨个儿执行。但是有时候我们有些优先级相对高的任务希望插队提前执行，这个时候就需要一类特殊的任务了，叫做微任务（`setTimeout`那种的我们把它叫做宏任务），他们也是异步执行的，但是它们不是作为独立的同步代码块一样排队，而是直接被加到本轮同步Javacript程序的最后，作为本轮同步代码的一部分，因此它会比后面的宏任务更优先执行。微任务的典型就是`Promise`，虽然JavascriptCore实现了`Promise`，但是React Native并没有使用，而是基于`setImmediate`实现了自己的微任务，而`setImmediate`所做的事情就是把异步任务放到本轮同步代码的最后，下面在上面图的基础上加上微任务： ![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3ac8500f11448559577f918bb573d25~tplv-k3u1fbpfcp-image.image#?w=678&h=875&s=18470&e=svg&a=1&b=c5ebd4)

我们再回到上面的执行流程，我们把流程做一个抽象，抽离出这个具体的案例，重新写一下流程：

1.  用户点击App图标
2.  App启动，Native开启Javascript线程，并开始用JavascriptCore加载Javascript代码（第一轮事件循环）
3.  第一轮同步代码块开始执行
4.  同步代码块执行完成，涉及到Native Module调用的功能，会往队列中插入JSON形式的调用描述信息，将执行权返回给Native
5.  Native通过JavascriptCore的API获取到Javascript中的队列数据，解析并分别调用对应的Native模块方法
6.  Native的模块方法执行完成后，调用Javascript中的回调函数，一轮新的事件循环开始，然后继续重复第3步的流程，但是执行的是后续的任务。

可以看到Javascript执行完成后，Native会去遍历调用队列（Javascript调用Native），从而执行相应的模块方法。Javascript并没有直接调用Native的方法。

以上这些实际上就是React Native Bridge的核心思想了。在Bridge的基础上React Native建立了模块的概念，模块是Javascript和Native之间通信的业务概念，之所以说它是业务概念是因为模块离用户已经很近了，在Native端用户可以添加自己的模块，以便供Javascript端使用。

下面咱们来看一下基于Bridge的模块。

模块的原理
-----

React Native经过这么多年的维护，代码一直在变化，因此我们这里不会细节到具体的代码，我还是从一个相对抽象的层次来进行讲解。如果大家对具体的代码感兴趣，我们可以另开一个视频专题，专门解析最新的代码。不过在研究最新的代码之前，先看这篇文章和我们随后出的新架构解析之后，再去研究源代码，一定有利于对源代码的理解。

Bridge的作用是把Javascript端和Native端连接起来，但是如果每次和对端通信都直接面对Bridge，则会有很多重复的代码，为了更方便的和对端通信，React Native中设计了模块的概念，用户通过“模块+方法+参数”便可以实现和对端通信，而不必关心Bridge的细节，而React Native内部也以模块的形式来组织代码，使代码更好维护，这就是模块的意义。

#### Javascript调用Native模块

模块分为Javascript模块和Native模块，Javascript模块供Native调用，Native模块供Javascript调用。 这里我们先讲Native模块。由于在大部分情况下都是Javascript需要获取Native的能力，而不是Native需要获取Javascript的能力，因此React Native除了供内部使用的模块之外，也允许用户扩展自己的Native模块，以便自行扩充Javascript的能力。 以Javascript需要通过Native创建View为例，最简单直观的调用方式是下面这样：

javascript

 代码解读

复制代码

`createView(tag, className, rootTag, props)`

不过这样很容易和别的方法重名，因此我们很容易想到，在方法前面再加一个命名空间：

javascript

 代码解读

复制代码

`UIManager.createView(tag, className, rootTag, props)`

`createView`属于UI相关的功能，因此我们把它挂到`UIManager`对象下，`UIManager`顾名思义就是UI的管理，这里我们把UIManager叫做模块，它代表了Native端的模块，后面的叙述中我们把它叫作“模块代理对象”。这些模块都是Native端的功能，因此我们把这些模块都统一放到一个叫`NativeModules`的对象下：

scss

 代码解读

复制代码

`NativeModules.UIManager.createView(...)`

这段伪代码可以这么理解：通过Javascript中的模块代理对象`UIManager`调用Native那边的UIManager模块中的createView方法，Javascript调用端并不需要知道createView是如何实现的。

既然Javascript端将API调用分成模块和方法，那Native端自然就需要实现模块和方法，Java/Kotlin、Objective C/Swift均是面向对象的语言，因此模块和方法的关系自然就变成了类/对象与方法的关系，我们用Javascript来写Native端模块的伪代码：

javascript

 代码解读

复制代码

`class UIManager {          createView(onCallBack) {         onCallBack()     } }`

以上就是一个模块的调用与创建方式，那我们怎么让模块和Bridge一起工作呢？ 我们来看看React Native的内部实现，React Native在Android和iOS上分别实现了模块功能，虽然不同的语言不同的平台，但是机制是一样的。下面我们以用户点击按钮获取屏幕尺寸为例，列出了程序的执行流程： App启动 -> Native模块注册（Native端） -> 生成模块方法的描述信息（Native端） -> 将模块名称的数组注入Javascript（Native端） -> Javascript端检测到注入的数据中只有模块名称，则给NativeModules\[moduleName\]设置getter方法（Javascript端懒加载模块代理对象）

\-> 一段时间后发生用户点击事件（Native端） -> 触发Javascript事件处理函数，一次Javascript同步代码的执行开始，即一次事件循环开始（Native端，调用Javacript模块，后面会讲） -> Javascript端事件处理函数开始执行（Javascript端） -> 事件处理函数中调用模块代理对象的方法，并传入回调函数用于获取返回数据（Javascript端） -> 此时Javascript端的模块信息还不全，事件处理函数中调用NativeModules\[moduleName\]会触发第四步定义的getter方法，向Native端获取模块的描述信息，并生成Javascript端的模块方法函数，随后该函数被调用（Javascript端） -> 模块方法函数被调用，将回调函数存入数组，同时将对应的回调ID（后面会讲生成规则）和模块ID、方法ID、业务参数存入二维数组（二维数组的格式我们会面会给出）（Javascript端） -> 本次Javascript同步代码执行完成返回Native端 -> Native端获取Javascript中的队列数据，根据模块ID、方法ID找到对应的方法，并根据回调ID生成Native端的回调函数，回调函数中会将回调的参数数据、回调ID回传给Javascript（Native端） -> Native的模块方法拿到了屏幕尺寸数据，开始调用回调函数（Native端） -> 回调函数将屏幕尺寸数据、回调ID回传给Javascript（Native端） -> Javascript根据回调ID找到Javascript端的回调函数，将屏幕尺寸数据回传给回调函数（Javascript端） -> 至此用户成功获取到屏幕尺寸数据（Javascript端）

以上便是Javascript调用Native的全过程。事件循环和Javascript的Native调用队列在上面已经讲过了，这里新增的细节是模块方法信息的组织方式，咱们还是继续按照上面的例子来讲解： `UIManager`模块有一个方法`createView`，并且有一个回调函数，此模块会被描述成如下JSON格式信息：

javascript

 代码解读

复制代码

`['UIManager', {}, ['createView']]`

第二个元素空对象代表Native模块想提供给Javascript的一些常量数据，以键值对的形式出现，只需要在模块类中实现常量函数并返回需要在Javascript获取的数据。 第三个元素是模块方法名字的数组，所有方法名称都会被放入该数组中。 Native模块往往不止一个，所以最终的数据是若干模块描述的数组，如下所示：

css

 代码解读

复制代码

`[ ['UIManager'], [moduleName] ...]`

可以看到最终的数据中只有模块名称，当我们的App变得越来越大时，可能我们每次只使用App中的一部分功能，所以有些Native模块并不会被用到，这些模块信息被提前注入Javascript端并没有意义，因此React Native设计了懒加载机制，App启动时，仅仅模块名称被注入到javascript，其他信息等这个模块被使用到时再从Native获取，需要注意的是这个获取过程并不是异步的，而是Javascript直接通过JavascriptCore从Native中获取。 另外为了能将这些数据注入到Javascript端，需要将它们放到某个命名空间下，否则很容易污染用户的Javascript变量，因此最终注入到Javascript的全局对象global中的是这样的对象：

css

 代码解读

复制代码

`{   remoteModuleConfig:      [ ['UIManager'], [moduleName] ...] }`

所有模块数据在Javascript中存在于该对象下：`global.remoteModuleConfig`。 当使用到某个模块时，Javascript如果检测到模块信息不完整，则会同步的去Native端拉取全部的模块信息：

css

 代码解读

复制代码

`['UIManager', {}, ['createView']]`

这次是Javascript主动拉取，而不是Native端注入，获取的数据会放入局部变量中，因此不会污染全局变量，不需要放到`remoteModuleConfig`上。

整个模块的JSON描述信息写全了是下面这样：

csharp

 代码解读

复制代码

`[moduleName, constants, methods, promiseMethods, syncMethods]`

`syncMethods`是同步方法的意思，是React Native后来的版本才有的东西，而且官方也不推荐使用，咱们这里就不讨论了。 `promiseMethods`是表示可以返回`Promise`的模块方法，不过它存的并不是方法名称，而是方法名称在`methods`中的索引。

Javascript拿到以上JSON信息，开始在NativeNodules对象下创建这样结构的数据，伪代码如下：

kotlin

 代码解读

复制代码

`NativeModules[moduleName][methodName] = function(...args) {     const {onFail, onSucc, params} = parseArgs(args);     onFail && params.push(this._callID << 1);     onSucc && params.push((this._callID << 1) | 1);     this._successCallbacks[this._callID] = onSucc;     this._failureCallbacks[this._callID] = onFail;          this._queue[0].push(moduleID);     this._queue[1].push(methodID);     this._queue[3].push(params); }`

注意这并不是源码，只是为了方便大家理解而写的伪代码。可以看到，Javascript端会构造这样一个函数，当Javascript调用Native模块的方法时，实际上最终是调用的这样的一个函数，它把 `moduleID`、 `methodId`、 `_callID`放入队列，并且缓存了回调函数与`_callID`的对应关系，然后就返回了。这里的`moduleID`和`methodID`是哪里来的呢？它们实际上只是模块方法描述信息的数组索引，例如如果是数组中的第一个模块，那`moduleID`就是0，第二模块的`moduleID`就是1，方法也是如此，其ID代表的是模块中方法在方法数组中的索引。

另外可以看到伪代码中`_callID`有一些位操作的逻辑，此部分不影响对整体原理的理解，因此如果不感兴趣可以忽略这部分内容。这部分源代码在历代版本中有变化，不太好懂，但是逻辑却很简单，之前的版本中，`_callID`是以1为步长递增，所有回调函数都放在同一个数组中，数组的索引就是`_callID`，由于`onFail`和`onSucc`并不一定是成对存在，所以在这种模式下，我们很难说某个`_callID`是`onFail`还是`onSucc`。后来随着版本的演进，分成了两个数组来存储`_callID`与回调函数的对应关系，一个数组表示`onFail`，另一个数组表示`onSucc`，将Javascript端`_callID`的数值的二进制值往左移一位作为`onFail`在Native端的ID，往左移一位会导致二进制值最右端的位一定是0，另外将`_callID`的二进制值往左移一位加1作为`onSucc`在Native端的ID，这样的话二进制数值最右端的位一定是1。其实Native端并不关心`_callID`的具体数值，当Native端产生回调时，将`_callID`透传回了Javascript，Javascript端通过判断回传的`_callID`最右边的位就可以判断是`onFail`的回调还是`onSucc`的回调，从而调用对应的回调函数。

以上便是Javascript调用Native模块的原理部分。下面咱再说一下Native是如何调用Javascript模块的。

#### Native调用Javascript模块

Javascript模块对于React Native的使用者来说可能比较陌生，因为它并没有开放给用户，仅仅是供React Native内部的通信在使用。 首先Native调用Javascript并不需要人为设置一个队列，因为Javascript是在单线程中运行，因此所有的调用只需要加入系统维护的线程执行队列就可以了。整个调用过程是比较简单粗暴的，但是和Native模块的逻辑一样，如果每个功能模块都直接面对Bridge，一方面是增加功能之间的耦合，另一方面也会出现重复的代码，加大维护难度，因此Javascript端的模块也是通过注册的形式，当Native端调用Javascript的模块方法时是直接将模块名称和方法名称传给Javascript端，然后Javascript端从注册表（一个键值对对象）中找到对应的功能模块，并执行对应的方法，然后同步的返回数据。随着React Native代码的发展，模块注册也由最开始的在App启动时的全部注册完成变成了先注册部分必要的模块，其余模块全部改成懒加载的模式，看一下两种模式的伪代码：

全部注册模式：

javascript

 代码解读

复制代码

    `BatchedBridge.registerCallableModule('AppRegistry', AppRegistry);`

懒加载注册模式：

javascript

 代码解读

复制代码

    `BatchedBridge.registerLazyCallableModule('RCTLog', () => require('RCTLog'));`

可以看到，懒加载注册模式下，模块的加载是被包裹到了方法中，只有实际调用到了该模块才会去加载该模块。

Javascript的核心模块大概有这些： `AppRegistry`、 `RCTEventEmitter`、 `RCTDeviceEventEmitter`、 `RCTNativeAppEventEmitter`、 `JSTimers`，他们涉及到的基本都是React Native的核心功能。 另外还有不少辅助性和调试用的模块，这里就不列出了。

Javascript模块的写法也特别简单，就是一个键值对形式的对象，下面贴出部分`AppRegistry`模块的代码：

javascript

 代码解读

复制代码

    ``const AppRegistry = {       setWrapperComponentProvider(provider: WrapperComponentProvider) {         wrapperComponentProvider = provider;       },       registerConfig(config: Array<AppConfig>): void {         config.forEach(appConfig => {           if (appConfig.run) {             AppRegistry.registerRunnable(appConfig.appKey, appConfig.run);           } else {             invariant(               appConfig.component != null,               'AppRegistry.registerConfig(...): Every config is expected to set ' +                 'either `run` or `component`, but `%s` has neither.',               appConfig.appKey,             );             AppRegistry.registerComponent(               appConfig.appKey,               appConfig.component,               appConfig.section,             );           }         });       },       registerComponent(         appKey: string,         componentProvider: ComponentProvider,         section?: boolean,       ): string {         runnables[appKey] = {           componentProvider,           run: appParameters =>             renderApplication(               componentProviderInstrumentationHook(componentProvider),               appParameters.initialProps,               appParameters.rootTag,               wrapperComponentProvider && wrapperComponentProvider(appParameters),             ),         };         if (section) {           sections[appKey] = runnables[appKey];         }         return appKey;       }     }``

这里并不打算讲源代码，这篇文章的主要目的是让大家了解React Native的设计原理，源码可以另开一个专题。

以上就是Javascript的模块部分。

Native部分的渲染
-----------

未完待续

线程的利用
-----

未完待续