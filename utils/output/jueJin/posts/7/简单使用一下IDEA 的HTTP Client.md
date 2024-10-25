---
author: "Java3y"
title: "简单使用一下IDEA 的HTTP Client"
date: 2019-12-21
description: "相信大家都用过POSTMAN吧，后端在开发的时候写完接口总得去自测调用一下，看符不符合自己的预期。 因为我们的接口可能会有很多参数或者我们的参数是json格式的（等等原因），直接用浏览器去请求不太方便，而且使用浏览器去请求也不能复用（没有保存的功能）。 所以我们常常会用一些别的…"
tags: ["Java","IntelliJ IDEA中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:23,comments:10,collects:26,views:12355,"
---
前言
--

> 只有光头才能变强。

> **文本已收录至我的GitHub精选文章，欢迎Star**：[github.com/ZhongFuChen…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")

相信大家都用过`POSTMAN`吧，后端在开发的时候写完接口总得去**自测**调用一下，看符不符合自己的预期。

![postman](/images/jueJin/16f193f140ac63e.png)

因为我们的接口可能会有**很多参数**或者我们的参数是`json`格式的（等等原因），直接用浏览器去请求不太方便，而且使用浏览器去请求也不能复用（没有保存的功能）。

所以我们常常会用一些别的软件（插件），而`POSTMAN`就是这里边最出名的。

这篇文章不是在介绍`POSTMAN`，而是我们Java程序员最喜欢的**IDEA**，它也能做到`POSTMAN`的功能，而且我觉得更加好用（**见仁见智，勿喷**）。

小插曲
---

在前几天换了MacBookPro，自然就需要把在Windows上的**hosts**配置的东西搬移到MacBookPro上

> [毕业半年，买了一台MacBook Pro](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247486285%26idx%3D1%26sn%3D073115f7efaba09c87a8e57f7d88e319%26chksm%3Debd74a4cdca0c35a28f8621d0750517572e39e722af99eec1b30dcbeb6d11fc0a595bc7cae33%26token%3D251055683%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247486285&idx=1&sn=073115f7efaba09c87a8e57f7d88e319&chksm=ebd74a4cdca0c35a28f8621d0750517572e39e722af99eec1b30dcbeb6d11fc0a595bc7cae33&token=251055683&lang=zh_CN#rd")

于是我就把Windows上的hosts通过QQ复制到我的**gas mask**（Mac 上管理hosts的一个软件，我觉得挺好用的）

![从Windows复制对应的hosts配置](/images/jueJin/16f193f14628f23.png)

于是我就很欢快愉悦地就将这些配置复制到**gas mask**。复制完了以后，我去访问自己的预发环境也是成功了(我这边一般预发环境都要配置hosts才能访问)。

但是等我用`POSTMAN`和IDEA自带的`HTTP Clint`去测试我自己接口的时候，一直都`404`了，我非常不明白为什么`404`了

*   明明我自己的机器从浏览器直接访问预发环境是没问题的啊
*   我将相同的URL放在Windows上是可以访问的，放在Mac上就访问不了
*   好奇怪啊....

于是我就喊来了我的小伙伴帮我看看什么情况（我没遇到过这种问题），小伙伴也给我分析起来了（搞着搞着就一群小伙伴都围着我看这问题了）

1.  检查一下我的**gas mask**配置有没有问题`----`没看出有问题
2.  检查一下我的绑定有没有相同的域名`----`没看出有问题
3.  检查一下本机的hosts文件有没有问题（注：我这里是在图文上看的。快捷键：`option+command+空格`，然后`command+shift+g`，输入`/etc/hosts`查看文件`----`没看出有问题
4.  `ping`一下域名`----`发现能ping通，但不是我绑定的ip
5.  怀疑DNS污染，去搜了几条命令刷新DNS`----`无果
6.  此时有个声音：“**是不是你的hosts文件有特殊的字符啊**？“，我熟练地在`iTerm2`输入`sudo vim /etc/hosts`，一看，好多的特殊字符。`----`问题解决，复制的时候存在特殊字符。哎哟。

简单介绍HTTP Client
---------------

> 注：环境：IDEA 2019.3

上面也讲到了，IDEA已经自带了类似`POSTMAN`的工具给我们使用了，如果它足够好用，我就不用去下载`POSTMAN`了。

首先，我们来找到它的入口：

![入口](/images/jueJin/16f193f14605c1d.png)

在`Tools->HTTP Client->Test RESTful Web Service`，不会很难找

点开以后我们可以在底部发现`REST Client`：

![REST Client 界面](/images/jueJin/16f193f14630d18.png)

从界面上的小字，我们可以看出：`IDEA`是不推荐我们使用`REST Client`了，不妨让我们去使用`new HTTP Client`。从`REST Client`的风格我们可以看出跟`POSTMAN`没什么大的区别（从功能上长得差不多）

点击蓝字，我们跳到`IDEA`推荐用的`new HTTP Client`，可以发现这个界面：

![一个新的界面](/images/jueJin/16f193f146785d5.png)

我对这种用写的方式还是挺喜欢的（个人）。我们尝试一下右边的几个链接就可以**快速入门**。

首先是`Add Request`，从英文上我们已经可以得出这是增加一个常见的**请求模板**（供你选择）

![Add Request](/images/jueJin/16f193f14827791.png)

我们随便点一个试试，看一下是怎么样的：

![尝试功能](/images/jueJin/16f193f16a80cff.png)

然后我们可以点击`Examples`链接，看一下它的功能：

![Examples链接](/images/jueJin/16f193f17564617.png)

我们可以查看到各种的示例，非常方便我们去入门：

![各种示例](/images/jueJin/16f193f17079bf0.png)

更好用的是，我们可以定义**变量**（不同的环境使用不同的变量），我们可以定义`http-client.env.json`，里边写一些通用变量相关的值。然后我们在`.http`文件下就可以引用：

```
//http-client.env.json 样式
    {
        "dev": {
        "baseUrl": "http://gateway.xxx.cn/",
        "username": "",
        "password": ""
        },
            "pre": {
            "baseUrl": "http://localhsot:8888/",
            "username": "",
            "password": ""
        }
    }
```

在`.http`文件中使用{{condition}}就可以引用到我们**公用**的环境变量了：

```
GET {{baseUrl}}/api/item?id=99
Accept: application/json
```

在执行的时候我们就可以选择不同的环境执行：

![样式图](/images/jueJin/16f193f177bf518.png)

最后
--

我们可以发现的是，IDEA给我们以**文件**的方式就能构建自己的接口，这说明我们可以将文件上传到`Git`上，方便多人协作。

可以通过**配置**来帮我们快速切换对应的环境（变量），只要写一次的请求体，就可以用作于多个环境。

通过官方给的**Examples**我们也可以快速去了解如何使用，没有什么学习成本。

还有一些高级的功能....我就不说了（因为我也不懂），大家可以有兴趣可以去看一下。

参考资料：

*   [github.com/corningsun/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcorningsun%2Fyuchigong%2Fblob%2FhttpClient%2FhttpClient%2FREADME.md "https://github.com/corningsun/yuchigong/blob/httpClient/httpClient/README.md")
*   [segmentfault.com/a/119000002…](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000021118350%3Futm_source%3Dtag-newest "https://segmentfault.com/a/1190000021118350?utm_source=tag-newest")

当我写下这篇文章的时候，敖丙和鸡蛋都说：**”POSTMAN才是世界上最好用的工具，三歪没有格局。等他发文章的时候我要举报他**“

注：我不是一个深度使用POSTMAN的人，现在HTTP Client对我来说已经足够使用了。

> **本已收录至我的GitHub精选文章，欢迎Star**：[github.com/ZhongFuChen…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")
> 
> 乐于输出**干货**的Java技术公众号：**Java3y**。公众号内**有300多篇原创**技术文章、海量视频资源、精美脑图，**关注即可获取！**

![转发到朋友圈是对我最大的支持！](/images/jueJin/16f081d79d6118f.png)

非常感谢**人才**们能看到这里，如果这个文章写得还不错，觉得「三歪」我**有点东西**的话 **求点赞** **求关注️** **求分享👥** **求留言💬** 对暖男我来说真的 **非常有用**！！！

创作不易，各位的支持和认可，就是我创作的最大动力，我们下篇文章见！