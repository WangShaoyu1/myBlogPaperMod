---
author: "Java3y"
title: "手把手带你体验Stream流"
date: 2019-10-14
description: "从代码量上可以明显看出，用Stream流的方式会少一些。 我理解的Stream流编程就是：某些场景会经常用到操作(求和去重过滤等等)，已经封装好API给你了，你自己别写了，调我给你提供的API就好了。 如果我们想要for循环的内部支持并发的话，显然不太好去写。但使用…"
tags: ["Java","Java EE中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:27,comments:0,collects:31,views:3738,"
---
前言
--

> 只有光头才能变强。

> 文本已收录至我的GitHub仓库，欢迎Star：[github.com/ZhongFuChen…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")

上一篇讲解到了Lambda表达式的使用《[最近学到的Lambda表达式基础知识](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247485692%26idx%3D1%26sn%3Da6b3f040b13fa2324992b11a927e34dc%26chksm%3Debd749fddca0c0eb1b05c08ede7ee4a44699584fbc0c3449ec2cac7642fd13819470ec7f44d8%26token%3D1948873548%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247485692&idx=1&sn=a6b3f040b13fa2324992b11a927e34dc&chksm=ebd749fddca0c0eb1b05c08ede7ee4a44699584fbc0c3449ec2cac7642fd13819470ec7f44d8&token=1948873548&lang=zh_CN#rd")》，还没看的同学可以先去阅读一下哈~

相信也有不少的同学想要知道：Lambda表达式在工作中哪个场景会用得比较多？跟Lambda搭边的，使用**Stream流**会比较多

一般人第一次看Stream流的代码，都会有点看不懂(它的代码看起来好像就不是写Java一样.)，希望这篇文章能带大家入个门

一、体验Stream流
-----------

大家在自学时，大多数会学过一个程序：`算出从数组元素的和`，当时我们是怎么写的？一般来说是这样的：

```
    public static void main(String[] args) {
    int[] nums = { 1, 2, 3 };
    int sum = 0;
        for (int i : nums) {
        sum += i;
    }
    System.out.println("结果为：" + sum);
}
```

如果我们使用Stream流的话，可以这样：

```
    public static void main(String[] args) {
    int[] nums = { 1, 2, 3 };
    int sum2 = IntStream.of(nums).sum();
    System.out.println("结果为：" + sum2);
}
```

从**代码量**上可以明显看出，用Stream流的方式会少一些。

我理解的Stream流编程就是：**某些场景会经常用到操作(求和/去重/过滤....等等)，已经封装好API给你了，你自己别写了，调我给你提供的API就好了**。

### 1.1 支持并发

回到我们最原始的代码：

```
    public static void main(String[] args) {
    int[] nums = { 1, 2, 3 };
    int sum = 0;
        for (int i : nums) {
        sum += i;
    }
    System.out.println("结果为：" + sum);
}
```

如果我们想要`for`循环的内部支持并发的话，显然不太好去写。但使用Stream流的方式，**调用一个方法就可以支持并发**(parallel)：

```
    public static void main(String[] args) {
    int[] nums = { 1, 2, 3 };
    int sum2 = IntStream.of(nums).parallel().sum();
    System.out.println("结果为：" + sum2);
}
```

> 优点：调API肯定是比自己写的代码量要少。
> 
> 缺点：不太方便调试

为什么要使用Stream流在我看来就是以上两个原因：

*   方便并发
*   代码量少(直接调用API)

二、如何使用Stream流？
--------------

![Stream继承结构图](/images/jueJin/16d53375b8cb6bf.png)

使用Stream流分为三步：

1.  创建Stream流
2.  通过Stream流对象执行中间操作
3.  执行最终操作，得到结果

![三步走](/images/jueJin/16d53319438aba5.png)

### 2.1 创建流

创建流我们最常用的就是**从集合中**创建出流

```
/**
* 返回的都是流对象
* @param args
*/
    public static void main(String[] args) {
    List<String> list = new ArrayList<>();
    // 从集合创建
    Stream<String> stream = list.stream();
    Stream<String> stream1 = list.parallelStream();
    
    // 从数组创建
    IntStream stream2 = Arrays.stream(new int[]{2, 3, 5});
    
    // 创建数字流
    IntStream intStream = IntStream.of(1, 2, 3);
    
    // 使用random创建
    IntStream limit = new Random().ints().limit(10);
    
}
```

### 2.2 执行中间操作

怎么理解中间操作？意思是这样的：在上面我们已经能创建出Stream了，我们是对**Stream**进行操作，对Stream操作返回完返回的还是Stream，那么我们称这个操作为中间操作。

![中间操作 解释](/images/jueJin/16d53901a83c918.png)

比如，我们现在有个字符串`my name is 007`，代码如下：

```
String str = "my name is 007";

Stream.of(str.split(" ")).filter(s -> s.length() > 2)
.map(s -> s.length()).forEach(System.out::println);
```

**分解：**

1、从字符串数组创建出流对象:

```
Stream<String> split = Stream.of(str.split(" "));
```

2、通过流对象的API执行中间操作(filter)，返回的还是流对象：

```
Stream<String> filterStream = split.filter(s -> s.length() > 2);
```

3、通过返回的流对象再执行中间操作(map)，返回的还是流对象：

```
Stream<Integer> integerStream = filterStream.map(s -> s.length());
```

因为中间操作返回的都是**流对象**，所以我们可以**链式调用**。

注意：Stream上的操作并不会立即执行，只有等到用户真正需要结果的时候才会执行（**惰性求值**）。

比如说，`peek()`是一个中间操作，返回的是Stream流对象，只要它不执行最终的操作，这个Stream是不会执行的。

```
String str = "my name is 007";
Stream.of(str.split(" ")).peek(System.out::println); // 不会有信息打印
```

### 2.3 执行最终操作

最终操作返回的不再是Stream对象，**调用了最终操作的方法，Stream才会执行**。还是以上面的例子为例：

```
String str = "my name is 007";
Stream.of(str.split(" ")).peek(System.out::println).forEach(System.out::println)
```

这次我们加入了最终操作，所以这次的Stream流会被执行，由于中间操作和最终操作都是执行打印，所以会看到两次打印：

![结果图](/images/jueJin/16d58c5efff67b9.png)

至于中间操作和最终操作怎么区分，我们以**返回值**来看就行了。中间操作返回的是Stream实例对象，最终操作返回的不是Stream实例对象：

![Stream接口的方法](/images/jueJin/16d58c719d5b566.png)

最后
--

这篇文章主要跟大家一起初步认识一下Stream流，至于中间操作、最终操作的API讲解我就不写了(网上的教程也很多)

使用Stream的原因我认为有两个：

1.  JDK库提供现有的API，代码写起来简洁优化
2.  方便并发。大家可以记住一个结论：在**多核**情况下，可以使用**并行**Stream API来发挥多核优势。在单核的情况下，我们自己写的`for`性能不比Stream API 差多少

参考资料：

*   [Java8中的流操作-基本使用&性能测试](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247485508%26idx%3D2%26sn%3Da686a128ccbcfa1fcc000d8b9de14155%26chksm%3Debd74945dca0c05378c3083c6efda294ea11db25705436d08a6d6af4e82993cac99804ee1553%26token%3D2078489135%26lang%3Dzh_CN%26scene%3D21%23wechat_redirect "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247485508&idx=2&sn=a686a128ccbcfa1fcc000d8b9de14155&chksm=ebd74945dca0c05378c3083c6efda294ea11db25705436d08a6d6af4e82993cac99804ee1553&token=2078489135&lang=zh_CN&scene=21#wechat_redirect")
*   [Java 8的Stream代码，你能看懂吗？](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247485026%26idx%3D1%26sn%3D8a99acd180aab1f5984f8b5eae8eab9f%26chksm%3Debd74763dca0ce758862de9453f155f9efdd28e39725b2067c54a5486449e8a14a1d5decb6c2%26token%3D1755043505%26lang%3Dzh_CN%26scene%3D21%23wechat_redirect "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247485026&idx=1&sn=8a99acd180aab1f5984f8b5eae8eab9f&chksm=ebd74763dca0ce758862de9453f155f9efdd28e39725b2067c54a5486449e8a14a1d5decb6c2&token=1755043505&lang=zh_CN&scene=21#wechat_redirect")

> 乐于输出**干货**的Java技术公众号：**Java3y**。公众号内**有200多篇原创**技术文章、海量视频资源、精美脑图，**关注即可获取！**

![转发到朋友圈是对我最大的支持！](/images/jueJin/16dab8d435b2471.png)

觉得我的文章写得不错，点**赞**！