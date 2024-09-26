---
author: "brzhang"
title: "ReactNative新架构：恐怖的性能提升"
date: 2024-06-07
description: "自2018年以来，ReactNative团队一直在重构其核心架构，以便开发者能够创建更高质量更好性能的体验。最近在ReactNative的官网看到他们在安利他们的新的架构，本文将我所了解到的一"
tags: ["前端"]
ShowReadingTime: "阅读4分钟"
weight: 788
---
![新架构](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09c78e0a4c4e46b78b8abee8a9d47330~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2636&h=1360&s=492806&e=png&b=ffffff)

自2018年以来，React Native团队一直在重构其核心架构，以便开发者能够创建更高质量更好性能的体验。最近在 React Native 的官网看到他们在安利他们的新的架构，本文将我所了解到的一些皮毛带给大家。以浅薄的见解来揭示其所带来的显著的性能改进，并探讨为何以及如何过渡到这一新架构。

为什么需要新的架构？
----------

多年来，使用React Native构建应用遇到了一些不可避免的限制。比如：React Native的布局和动画效果可能不如原生应用流畅，`JavaScript和原生代码之间的通信效率低下`，序列化和反序列化开销大，以及无法利用新的React特性等。这些限制在现有架构下无法解决，因此新的架构应运而生。新的架构提升了React Native在数个方面的能力，使得一些之前无法实现的特性和优化成为可能。

同步布局和效果
-------

对比下老的架构(左边)和新的架构(右边)的效果：

![React](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/319af83d5cc4423d9411e900110d7d21~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1384&h=1056&s=767452&e=gif&f=45&b=f6f3f7)

构建自适应的UI体验通常需要测量视图的大小和位置并进行调整。在现有架构中，使用`onLayout`事件获取布局信息可能导致用户看到中间状态或视觉跳跃。而在新架构下，`useLayoutEffect`可以同步获取布局信息并更新，让这些中间状态彻底消失。可以明显看到不会存在`跟不上`的情况。

javascript

 代码解读

复制代码

`function ViewWithTooltip() {   const targetRef = React.useRef(null);   const [targetRect, setTargetRect] = React.useState(null);   useLayoutEffect(() => {     targetRef.current?.measureInWindow((x, y, width, height) => {       setTargetRect({ x, y, width, height });     });   }, [setTargetRect]);   return (     <>       <View ref={targetRef}>         <Text>一些内容，显示一个悬浮提示</Text>       </View>       <Tooltip targetRect={targetRect} />     </>   ); }`

支持并发渲染和新特性
----------

可以看到新架构支持了并发渲染的效果对比，左边是老架构，右边是新架构：

![并发渲染特性](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5759271bf8d84a2e89a5141dac765425~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1388&h=1282&s=5687950&e=gif&f=39&b=fcfafa)

新架构支持React 18及之后版本的并发渲染和新特性，例如`Suspense`数据获取和`Transitions`。这使得web和原生React开发之间的代码库和概念更加一致。同时，`自动批处理减少了重绘的次数`，提升了UI的流畅性。

javascript

 代码解读

复制代码

`function TileSlider({ value, onValueChange }) {   const [isPending, startTransition] = useTransition();   return (     <>       <View>         <Text>渲染 {value} 瓷砖</Text>         <ActivityIndicator animating={isPending} />       </View>       <Slider         value={value}         minimumValue={1}         maximumValue={1000}         step={1}         onValueChange={newValue => {           startTransition(() => {             onValueChange(newValue);           });         }}       />     </>   ); }`

快速的JavaScript/Native接口
----------------------

新架构移除了JavaScript和原生代码之间的异步桥接，取而代之的是JavaScript接口（JSI）。JSI允许JavaScript直接持有C++对象的引用，从而大大提高了调用效率。这使得像VisionCamera这样处理实时帧的库能够高效运行，消除大量序列化的开销。

![JSI](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e18b68544b3248fea5c180760dfe014b~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1746&h=1040&s=923525&e=png&b=fcfbfb)

VisionCamera 的地址是：[github.com/mrousavy/re…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmrousavy%2Freact-native-vision-camera "https://github.com/mrousavy/react-native-vision-camera")

目前多达6K+的star，这个在 React Native 上的份量还是响当当的，可以看到它明显是用上了 JSI 了，向先驱们致敬。 ![VisionCamera](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4aa6ce16d9a4a7bad7a4fabe0180733~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1722&h=1356&s=262312&e=png&b=ffffff)

启用新架构的期望
--------

尽管新架构提供了显著的改进，启用新架构并不一定会立即提升应用的性能。你的代码可能需要重构以利用新的功能，如同步布局效果或并发特性。或许，我认为，React Native 可能会同步出一些工具来帮助我们更好的迁移。比如配套的 eslint 插件，提示更优的建议写法等等。

现在是否应该使用新架构？
------------

目前新架构仍被视为实验性，在2024年末发布的React Native版本中将成为默认设置。对于大多数生产环境应用，建议等待正式发布。库维护者则可以尝试启用并确认其用例被覆盖。另外看到react-native-vision-camera 这个库的 issue 下面反馈，JSI 目前还是存在一些坑需要爬的，所以要尝鲜的话，还是要有心理准备。 ![还是有坑在](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc8d6b4aab16472ba93ae118d6e9a16b~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2040&h=702&s=213799&e=png&b=ffffff)

通过详细介绍新架构的一系列优势和实际应用，我们可以看到React Native的未来发展前景。尽早了解和适应这些变化，一旦新架构正式发布，我们就能更好地利用React Native的潜力，为用户提供更好的体验。更好的产品体验，意味着产品的竞争力也会更强。

关注 **老码沉思录** ，第一时间获取我最新的分享 。