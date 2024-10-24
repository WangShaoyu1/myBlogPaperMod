---
author: "yck"
title: "JS 的 Date API 到底是个什么阴间东西"
date: 2021-08-03
description: "`Date` API 大家肯定都有用过，虽然更多时候关于日期的处理都交给了 dayjs 或者 moment。 但我们肯定免不了去直接使用原生 API，这时候你可能会免不了爆一句粗口「什么阴间玩意？」"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:34,comments:0,collects:27,views:11705,"
---
`Date` API 大家肯定都有用过，虽然更多时候关于日期的处理都交给了 dayjs 或者 moment。

但我们肯定免不了去直接使用原生 API，这时候你可能会免不了爆一句粗口「什么阴间玩意？」，接下来我们来看看到底这个 API 不好用到哪里去。

首先我们先了解下 `Date` 支持哪些类型的传参：

```js
new Date();
new Date(value);
new Date(dateString);
new Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]]);
```

了解完参数类型，就直接用起来咯：

![截屏2021-07-28下午10.07.36](/images/jueJin/fa8b2674eda94c0.png)

没啥毛病，符合预期，不传参就获取当前系统时间。

那么我们换种写法，传入字符串呢？

![截屏2021-07-28下午10.10.36](/images/jueJin/526661c38275475.png)

小小的脑袋充满了问号，明明我传入同样的日期，无非格式变了一下，为啥输出的内容却完全不一样？

笔者这里解释下，当我们输入第一种格式时，内部会帮我们解析成当前时区所对应的协调世界时（UTC），也就是零点加八小时。

而当我们输入第二种格式时，内部会帮我们解析成当前时区的零点。

到这里其实笔者已经有点懵逼了，不踩过这种坑鬼知道会有这样的不同。

你以为这样就结束了？天真了，我们再来看这种写法：

![截屏2021-07-28下午10.24.46](/images/jueJin/13be0642710d474.png)

好家伙，我这传的明明是七月份，咋的给我解析成八月份了？？？

这看起来是个 Bug，实际上算是一个老传统，在很久之前的编程语言里确实以 0 开头作为某些时间的起始位：

![截屏2021-07-28下午10.29.50](/images/jueJin/df4a161e4ce44d9.png)

以上内容大家可以在 [Linux](https://link.juejin.cn?target=https%3A%2F%2Flinux.die.net%2Fman%2F3%2Flocaltime "https://linux.die.net/man/3/localtime") 的文档中阅读到。

文章到这里还没有结束，咱们再来换个写法看看：

![截屏2021-07-28下午9.56.32](/images/jueJin/9be0504edcba41e.png)

这第一个写法笔者还能理解一点，毕竟年份从 1900 年开始计数，但是为啥换成数组的写法你就给我变成了 2032 年啊！

![img](/images/jueJin/2045941b7bd44b9.png)

笔者这里也就不考古了，反正打死不这样写就行了。

* * *

更新：这里读者解释是因为 `[32, 10, 4]` 被转换为了字符串，也就是 `new Date('32, 10, 4')`，因此结果如图所示。

* * *

那么多坑，心累了，以后就只用 `new Date()` 吧，但其实也不好意思，单用这个你说不定也能踩到一个坑。

举个场景，我们在服务端给接口 `setCookie` 的时候都会设置一个 `expires` 字段代表这个 Cookie 的有效时间，此时如果你的 `expires` 字段是以 `new Date()` 生成的话，千万记得要做一次转换。

比如说我们利用 `new Date()` 获取了一个时间，大家可以看到输出是带有中文的：

![截屏2021-07-28下午10.07.36](/images/jueJin/f69105f22c1949e.png)

此时如果你把这个时间去做 `setCookie` 的话，服务端就会报一个 `TypeError` 的错误：`invalid character in header content ["set-cookie"]`，这是因为我们设置的值里存在中文。

因此我们需要对这个时间做一次转换得到一个不包含中文的时间字符串。

讲了那么多，难道原生 API 真的没救了？只能全用库了么？这倒也不是，TS39 也知道如此阴间的 API 不好用，因此搞了 [proposal-temporal](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ftc39%2Fproposal-temporal "https://github.com/tc39/proposal-temporal") 这个提案来解决问题，算是融合了目前日期处理库的功能。

但是等这个提案兼容大部分浏览器也不知道什么时候呢，还是继续 dayjs 吧。