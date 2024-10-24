---
author: "ConardLi"
title: "Cookie 的访问方式可能要有大变化了！"
date: 2023-05-09
description: "在最近发布的 Chrome 113、114 两个版本中，有两个关于 Cookie 的变化： Chrome 113：Cookie 第一方集（First-Party Sets）进入稳定版本；"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读13分钟"
weight: 1
selfDefined:"likes:28,comments:5,collects:44,views:7117,"
---
在最近发布的 `Chrome 113、114` 两个版本中，有两个关于 Cookie 的变化：

*   `Chrome 113`：Cookie 第一方集（`First-Party Sets`）进入稳定版本；
*   `Chrome 114`：Cookie 独立分区（`CHIPS`）默认对所有浏览器启用；

![image.png](/images/jueJin/0d25134af9be45d.png)

这两个都是针对 Cookie 访问方式的变化，为的就是应对即将来临的三方 Cookie 全面弃用。`Chrome` 在两年前就已经计划全面弃用方 Cookie 了，因为这个变化对现在的网站影响太大了，如果直接弃用，可能会导致大量网站的正常功能无法正常使用。

另外对 `Google` 本身的广告业务也有非常大的影响，所以 `Chrome` 不得不一拖再拖，为的就是能够推出一套对现有的业务影响不是很大，能够保障用户平稳迁移，又能保护用户隐私的方案。

目前看来，随着 Cookie 第一方集、Cookie 独立分区两项能力的稳定推出，全面禁用三方 Cookie 的那一天似乎不远了，这两项改动确实能够解决一大部分正常使用三方 Cookie 的业务场景，但是 Cookie 的读取方式可能要有大变化了。

今天我就带大家来提前解读一下这两项关于 Cookie 的变动，大家也要提前做好迁移和应对策略，保障未来禁用三方 Cookie 之后网站能够避免受到影响。

三方 Cookie
---------

虽然是老生常谈了，我们还是先来说明一下，什么 Cookie 是属于三方的，三方 Cookie 目前又有什么样的问题。

### 三方 Cookie 和一方 Cookie

Cookie 是属于一方 Cookie、还是三方 Cookie，只取决于两个要素：

*   Cookie 是被哪个域名种的
*   Cookie 是在哪个网站上种的

具两个具体的例子，现在我们访问 [www.douyin.com](https://link.juejin.cn?target=http%3A%2F%2Fwww.douyin.com "http://www.douyin.com") 这个网站：然后我们在这个网站上也请求了很多接口，比如 [www.douyin.com/api/user](https://link.juejin.cn?target=http%3A%2F%2Fwww.douyin.com%2Fapi%2Fuser "http://www.douyin.com/api/user") ，这些接口通过 `set-cookie` 这个 `Header` 在我们的网站上种下了很多 Cookie，因为请求的域名和当前网站的域名是同站的，所以这些接口种的 Cookie 都是属于一方 Cookie。

![image.png](/images/jueJin/941a850ad42c4cf.png)

但是网站上并不一定会调用同站的域名，比如 [www.douyin.com](https://link.juejin.cn?target=http%3A%2F%2Fwww.douyin.com "http://www.douyin.com") 这个网站也调用了很多 bytedance.com 下的接口，这些跨站的接口也通过 `set-cookie` 种了一些 Cookie，因为种 Cookie 的域名和当前网站的域名是夸站的，这种 Cookie 就属于三方 Cookie。

![image.png](/images/jueJin/f0d29eb51b464cc.png)

详细可以看我这篇文章：[当浏览器全面禁用三方 Cookie](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzk0MDMwMzQyOA%3D%3D%26mid%3D2247490361%26idx%3D1%26sn%3Debc8dcc4d095cc7ba748827dff158f2b%26chksm%3Dc2e2ee12f5956704fa75e7ad2ddb0e64f8008c7bdd7fb713bf2c7664583716b4595118aa84e3%26token%3D1931359711%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=Mzk0MDMwMzQyOA==&mid=2247490361&idx=1&sn=ebc8dcc4d095cc7ba748827dff158f2b&chksm=c2e2ee12f5956704fa75e7ad2ddb0e64f8008c7bdd7fb713bf2c7664583716b4595118aa84e3&token=1931359711&lang=zh_CN#rd")

### 三方 Cookie 有啥问题？

我们的网站不可能只调用同站的域名的接口，调用其他域名的接口再正常不过了，所以有三方 Cookie 也是很正常的，我们也通过三方 Cookie 做了很多正常的需求，比如日志打点、单点登录、广告转化分析等等。那为什么要禁用呢？主要还是因为用户隐私的问题。

![image.png](/images/jueJin/8e1374244177470.png)

比如我们现在正在抖音上刷视频，但是抖音上往往会加载很多三方广告商的请求，这些三方广告商就可以通过三方 Cookie 来记录一些用户的行为。然后下次你逛淘宝的时候，也可能再次加载到这个广告商，因为这时三方广告已经通过三方 Cookie 记录了你的很多用户行为，已经知道了你喜欢什么东西，所以你就会收到一些精准的广告推送，无形之中你的隐私已经泄漏出去了。

在海外，用户隐私可是相当ZZ正确的事，所以 Safira、Firefox 两大浏览器已经迫于压力禁用了三方 Cookie，也就是说，如果你在这两个浏览器上去访问 `www.douyin.com` 这个网站，那么再发送 `bytedance.com` 这个域名的请求是种不上 Cookie 的。

目前就剩下 `Chrome` 还在苦苦支撑了，毕竟 `Chrome` 现在的浏览器市场份额是最大的，而且直接禁用对它的老板 `Google` 的广告业务影响也非常大。所以 `Chrome` 需要等待一个大家都可接受的替代方案出来之后再禁用。

两个可能遇到问题的场景
-----------

对于我们普通开发者来说，其实还是有很多场景可能会受到影响的，我们也必须在禁用之前作出相应的改变，比如下面两个场景。

### 三方 iframe Cookie

第一个场景是我们需要和嵌入的三方 iframe 共享状态。假如我们现在开发了一个通用的聊天服务，它的域名是 `support.chat.example`，我们有很多业务网站（比如 `retail.example`） 希望用 `iframe` 的方式嵌入这个聊天框。这个嵌入式的聊天服务可能会依赖 `Cookie` 来保存用户的交互历史记录。因为我们嵌入的 `iframe` 域名和当前的网站是夸站的，所以 `iframe` 种下的 `Cookie` 就属于三方 `Cookie`。

![image.png](/images/jueJin/c48c84c940f847c.png)

假如现在没有了设置跨站点三方 `Cookie` 的能力，那我们的聊天服务 `support.chat.example` 可能需要更依赖父级网站 `retail.example` 主动传递给他们第一方会话的一些标识符。因为这种聊天服务往往都是通用的，所以相应的每个嵌入 `support.chat.example` 聊天服务的网站都需要额外的设置来传递状态，这大大增加了开发和接入成本。

或者，我们也可以允许聊天服务 `support.chat.example` 请求我们的网站 `retail.example` 页面上的 `JavaScript`。但是这又引入了非常大的安全风险，也不是个靠谱的方法。类似可能遇到的场景还包括：

*   三方地图服务
*   子资源 `CDN` 负载均衡
*   `Headless CMS` 提供商
*   不信任的用户内容的沙盒域名
*   三方嵌入式广告

### 三方站点 Cookie

另外还有一个场景，根据域名的不同来定义 Cookie 属于第三方有点太狭隘了，毕竟一个公司不可能只有一个域名：

![image.png](/images/jueJin/b62e2b0d7e4c4fb.png)

比如上面我们提到的 `www.douyin.com` 和 `www.bytedance.com` ，虽然域名不一样，种的 Cookie 也叫做三方 Cookie，但是明眼人都能看出来，抖音就是字节的，这俩域名就是一家的。

![image.png](/images/jueJin/389f64e36ae64ca.png)

如果禁用了三方 Cookie ，那这种正常的在一家公司不同域名下共享 Cookie 的能力也就不能用了，这给正常的业务需求会带来很大的影响，一个常见的场景就是单点登录，我们往往在登陆一家公司的不同网站的时候只需要登陆一次，这是因为用户的个人信息存储在了一个公共的登录服务的 Cookie 上，禁用了三方 Cookie，那登录信息也就无法共享了。下面我们来看看如何解决以上的两个问题。

Cookie 独立分区（CHIPS）
------------------

首先我们来看 `Chrome 114` 默认对所有用户启用的 Cookie 独立分区（`CHIPS`），这就是用来解决三方 `iframe` 共享状态的问题的。

### 如何解决问题？

具有独立分区状态的 `Cookie (CHIPS)` ，它允许开发者将 Cookie 选择到“分区”存储中，每个顶级站点都有单独的 `Cookie jar`。

> Chrome 官方是这样描述它的：CHIPS 是帮助服务顺利过渡到没有第三方 Cookie 的未来的重要一步。

`CHIPS` 引入了一个新的 `Cookie` 属性：`Partitioned` ，它可以让顶级上下文分决定哪些 `Cookie` 进行分区。

举个例子，假如我们在站点 A 中通过 `iframe` 嵌入了一个站点 C，正常情况下如果三方 `Cookie` 被禁用后，C 是无法在 A 站点访问到它的 `Cookie` 的。

如果 C 在它的 `Cookie` 上指定了 `Partitioned` 属性，这个 Cookie 将保存在一个特殊的分区 jar 中。它只会在站点 A 中通过 iframe 嵌入站点 C 时才会生效，浏览器会判定只会在顶级站点为 A 时才发送该 Cookie。

![image.png](/images/jueJin/656e06aa8cb447b.png)

当用户访问一个新站点时，例如站点 B，如果也它通过 iframe 嵌入了站点 C，这时在站点 B 下的站点 C 是无法访问到之前在 A 下面设置的那个 Cookie 的。

如果用户直接访问站点 C ，一样也是访问不到这个 Cookie 的。

![image.png](/images/jueJin/6f471eb12ffc49e.png)

这样就在保障用户隐私的情况下解决了三方 iframe Cookie 共享的问题。

### 如何使用？

实施方式也非常简单，就像上面说的，想要在当前网站上保留需要共享的三方 `Cookie` ，只需要在种这个 Cookie 的时候添加一个 `Partitioned` 属性，另外还有个前提是 `Cookie` 必须具有 `Secure` 属性：

```http
Set-Cookie: name=ConardLi; SameSite=None; Secure; Path=/; Partitioned;
```

### 实现细节

`Partitioned` 属性实际上是改变了 Cookie 存储分区的机制，让分区更加严格了，还是上面的例子，我们将一个 `https://support.chat.example` `iframe` 嵌入在页面 `https://retail.example` 上，在启用 `Partitioned` 之前，Cookie 分区的唯一标识是：`support.chat.example` ，而启用了`Partitioned`之后，分区的唯一标识变成了 `("https", "retail.example") + support.chat.example`。

![image.png](/images/jueJin/45e88da043814c4.png)

`Firefox` 在它的 `ETP` 严格模式和隐私浏览模式下默认对所有第三方 `cookie` 进行了分区，所以所有的跨站 `cookie` 都会默认按照顶级站点进行分区。但是，在没有第三方选择加入的情况下对 `cookie` 进行分区可能会导致一些意外的问题，因为在某些特定场景下可能也会用到未分区的第三方 `cookie`。

`Safari` 之前也曾尝试过一些 `Cookie` 分区的机制，但最终还是放弃了，目前完全阻止了三方 `Cookie`，理由之一是开发者可能会感到困惑。。不过目前好像又开始做一些 `Cookie` 分区的实验了。

目前我觉得 `Chrome` 提供的这种启发式 `Cookie` 分区的思路还挺好用的，既解决了跨站跟踪的问题，而且也能在一定程度上满足用户需求，希望其他浏览器也借鉴一下吧。

Cookie 第一方集（First-Party Sets）
-----------------------------

上面我们解决了三方 iframe 状态共享的问题，下面我们提到的 `Cookie First-Party Sets` 则是用来解决自定义 Cookie 集合的问题，也就是说提供了一种选择性的把一些 `Cookie` 从三方变为一方的方式。

### 如何解决问题？

前面我们提到了，很多组织或公司都会有多个域名，所以只用域名的不同来区分 Cookie 属于第一方还是第三方这种方式太严格了。

![image.png](/images/jueJin/8370bc62c24f4d1.png)

`First-Party Sets` 相当于给了网站开发者一个机会，有一些 Cookie 虽然根据域名的划分是第三方的，但是你可以自己选择指定一部分 Cookie 把它们放在一个集合里，在这个集合里的三方 Cookie 都可以按照一种特殊的形式来读取到。

![image.png](/images/jueJin/176f69f053b44c6.png)

换个角度讲，`douyin.com、bytedance.com` 这两个域名虽然是属于同一个组织，但是 `Chrome` 不知道，你可以通过把它们放到一个集合里来告诉 `Chrome` 这些不同的域名属于同一个组织。

### 如何使用？

根据上面的解决问题的思路，想要实现 `First-Party Sets` 就需要两步：

*   第一步：把想要共享 `Cookie` 的不同域名放到一个集合里，然后提交给 `Chrome`；
*   第二步：使用 `Chrome` 提供的特殊的方式来读取这些域名集合下共享的 `Cookie`；

在早期的提案中，为 `Cookie` 新增了一个 `samePaty` 属性，你可以通过这个属性来告诉浏览器哪些 Cookie 是需要三方共享的，然后需要把共享的域名集合放到网站的部署目录下，我之前也写过一篇文章来介绍这种方式：[详解 Cookie 新增的 SameParty 属性](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzk0MDMwMzQyOA%3D%3D%26mid%3D2247490863%26idx%3D1%26sn%3Da9cfa840c4c2c664aab28b6c70245dc9%26chksm%3Dc2e2e804f5956112bc39d08c696ba232949d58cf447387bcbfc330a3d4cd6eb84d2e082e4dea%26token%3D406950475%26lang%3Dzh_CN%26scene%3D21%23wechat_redirect "https://mp.weixin.qq.com/s?__biz=Mzk0MDMwMzQyOA==&mid=2247490863&idx=1&sn=a9cfa840c4c2c664aab28b6c70245dc9&chksm=c2e2e804f5956112bc39d08c696ba232949d58cf447387bcbfc330a3d4cd6eb84d2e082e4dea&token=406950475&lang=zh_CN&scene=21#wechat_redirect")。

但是，这种方式的限制优点过于宽松了，网站可以很轻松的再次实现三方 Cookie 共享，共享的策略也不够透明，所以 Chrome 决定弃用了这种方案，转而实现了一种更复杂的方式。

首先你需要给出一份 JSON 文件，在这个文件里声明哪些域名是需要共享 `Cookie` 的，然后你需要把这个 JSON 文件通过 `Pull Request` 提交到 `Chrome` 提供的一个 `Github` 仓库中：[github.com/GoogleChrom…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FGoogleChrome%2Ffirst-party-sets "https://github.com/GoogleChrome/first-party-sets")

而且要求 JSON 文件的格式必须符合规范，下面是一个例子：

```json
    {
    "primary": "https://primary.com",
    "associatedSites": ["https://associate1.com", "https://associate2.com", "https://associate3.com", "https://associate4.com"],
    "serviceSites": ["https://servicesite1.com"],
        "rationaleBySite": {
        "https://associate1.com": "An explanation of how you clearly present the affiliation across domains to users and why users would expect your domains to be affiliated",
        "https://associate2.com": "An explanation of how you clearly present the affiliation across domains to users and why users would expect your domains to be affiliated",
        "https://associate3.com": "An explanation of how you clearly present the affiliation across domains to users and why users would expect your domains to be affiliated",
        "https://serviceSite1.com": "An explanation of how each domain in this subset supports functionality or security needs."
        },
        
            "ccTLDs": {
            "https://associate1.com": ["https://associate1.ca", "https://associate1.co.uk", "https://associate1.de"],
            "https://associate2.com": ["https://associate2.ru", "https://associate2.co.kr", "https://associate2.fr"],
        "https://primary.com": ["https://primary.co.uk"]
    }
}
```

在这其中有几个关键的概念：

![image.png](/images/jueJin/a83f9386c4d6463.png)

*   `ccTLDs` 域名：网站可能服务于不同的国家，在每个地区都有一个特定的域名，比如 `conardli.cn、conardli.jp、conardli.en` 等等；
*   `Service` 域名：网站可能会使用特定的域名来保证安全性或者提高性能，但是这些不同域名的网站可能也需要共享用户身份。
*   `Associated` 域名：同一个组织下可能有多个不同的子品牌，对应不同的域名，例如 `bytedance.com、douyin.com` 就属于这种情况。

提交完 `PR` 之后，`Google` 团队会在每个周二的中午 12 点手动 `Review` 并且合并这些 `PR`。（这里我也不知道 `Chrome` 团队是咋想的。。。后面网站多了之后肯定每天都有大量的 PR，这种维护方式真的可行么？？）

等到你的 JSON 配置被 Chrome 团队 Merge 后，也不是就代表着你可以随意在这些域名下共享三方 Cookie 了，你还需要用到一个特殊的 `Storage Access API(SAA)` ，下面是一份演示代码：

[glitch.com/edit/#!/fir…](https://link.juejin.cn?target=https%3A%2F%2Fglitch.com%2Fedit%2F%23!%2Ffirst-party-sets "https://glitch.com/edit/#!/first-party-sets")

我们来拆解一下，首先是判断浏览器是否支持这个 API：

```javascript
/*
* 通过 UA 判断浏览器版本
*/
    if (navigator.userAgentData.brands.some(b => { return b.brand === 'Google Chrome' && parseInt(b.version, 10) >= 108 })) {
    // Supported
        } else {
        // Not supported
    }
    
    /*
    * 判断 SAA 和 rSAFor API 是否可用
    */
        if ('requestStorageAccess' in document) {
        // SAA available
            } else {
            // SAA not available
        }
        
            if ('requestStorageAccessForOrigin' in document) {
            // rSAFor available
                } else {
                // rSAFor not available
            }
```

通过 `requestStorageAccess` 来判断用户是否授予了对三方 `Cookie` 的访问权限，并且访问所有可以读取到的 `Cookie`：

```javascript
    if ('requestStorageAccess' in document) {
    document.requestStorageAccess().then(
    (res) => { console.log('权限请求通过', res) },
(err) => { console.log('拒绝', err) }
);
}
```

通过 `requestStorageAccessForOrigin` 来读取指定域名下共享的的三方 `Cookie`：

```javascript
    if ('requestStorageAccessForOrigin' in document) {
    document.requestStorageAccessForOrigin('https://first-party-sets.glitch.me');
    location.reload();
        } else {
        window.alert('document.requestStorageAccessForOrigin not enabled.');
    }
```

最后
--

这也有点太麻烦了，我估计这种使用方式以后会劝退很多开发者的。。。希望 Chrome 团队还是尽量把使用改的简单点吧，不过 `First-Party Sets` 已经进入了稳定版本，我估计也不会有太大的改动了，所以以后大家还想用三方 `Cookie` ，恐怕不会那么简单了 ...

参考

*   [当浏览器全面禁用三方 Cookie](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzk0MDMwMzQyOA%3D%3D%26mid%3D2247490361%26idx%3D1%26sn%3Debc8dcc4d095cc7ba748827dff158f2b%26chksm%3Dc2e2ee12f5956704fa75e7ad2ddb0e64f8008c7bdd7fb713bf2c7664583716b4595118aa84e3%26token%3D1931359711%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=Mzk0MDMwMzQyOA==&mid=2247490361&idx=1&sn=ebc8dcc4d095cc7ba748827dff158f2b&chksm=c2e2ee12f5956704fa75e7ad2ddb0e64f8008c7bdd7fb713bf2c7664583716b4595118aa84e3&token=1931359711&lang=zh_CN#rd")
*   [Chrome 将限制 Cookie 最大存储期限！](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzk0MDMwMzQyOA%3D%3D%26mid%3D2247495100%26idx%3D1%26sn%3Dc2741742bcf471a2d6990a9ae3fc59f1%26chksm%3Dc2e11897f596918187eab18d324e115651638cf3091ab94dfebf9ee63aa4530aeb085c325a2b%26token%3D1931359711%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=Mzk0MDMwMzQyOA==&mid=2247495100&idx=1&sn=c2741742bcf471a2d6990a9ae3fc59f1&chksm=c2e11897f596918187eab18d324e115651638cf3091ab94dfebf9ee63aa4530aeb085c325a2b&token=1931359711&lang=zh_CN#rd")
*   [谁能帮我们顺利过渡到没有三方 Cookie 的未来？](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzk0MDMwMzQyOA%3D%3D%26mid%3D2247493309%26idx%3D1%26sn%3Db037c33a1b9d434cc502ab380d453433%26chksm%3Dc2e11396f5969a805d63be30d50dfc8367da7484da252e343d74997a82bb187544eec76b3114%26token%3D1931359711%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=Mzk0MDMwMzQyOA==&mid=2247493309&idx=1&sn=b037c33a1b9d434cc502ab380d453433&chksm=c2e11396f5969a805d63be30d50dfc8367da7484da252e343d74997a82bb187544eec76b3114&token=1931359711&lang=zh_CN#rd")
*   [三方 Cookie 替代品 — 隐私沙盒的最新进展](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzk0MDMwMzQyOA%3D%3D%26mid%3D2247490934%26idx%3D1%26sn%3D4c5c086d3b736c6397212740005ee040%26chksm%3Dc2e2e85df595614b90ae2c04198e19377fdf386b8569bdfbb70127cfec2d5be8c9726040ef98%26token%3D1931359711%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=Mzk0MDMwMzQyOA==&mid=2247490934&idx=1&sn=4c5c086d3b736c6397212740005ee040&chksm=c2e2e85df595614b90ae2c04198e19377fdf386b8569bdfbb70127cfec2d5be8c9726040ef98&token=1931359711&lang=zh_CN#rd")
*   [详解 Cookie 新增的 SameParty 属性](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzk0MDMwMzQyOA%3D%3D%26mid%3D2247490863%26idx%3D1%26sn%3Da9cfa840c4c2c664aab28b6c70245dc9%26chksm%3Dc2e2e804f5956112bc39d08c696ba232949d58cf447387bcbfc330a3d4cd6eb84d2e082e4dea%26token%3D1931359711%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=Mzk0MDMwMzQyOA==&mid=2247490863&idx=1&sn=a9cfa840c4c2c664aab28b6c70245dc9&chksm=c2e2e804f5956112bc39d08c696ba232949d58cf447387bcbfc330a3d4cd6eb84d2e082e4dea&token=1931359711&lang=zh_CN#rd")
*   [github.com/GoogleChrom…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FGoogleChrome%2Ffirst-party-sets "https://github.com/GoogleChrome/first-party-sets")
*   [developer.chrome.com/docs/privac…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.chrome.com%2Fdocs%2Fprivacy-sandbox%2Fchips%2F "https://developer.chrome.com/docs/privacy-sandbox/chips/")
*   [developer.chrome.com/docs/privac…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.chrome.com%2Fdocs%2Fprivacy-sandbox%2Ffirst-party-sets-integration%2F "https://developer.chrome.com/docs/privacy-sandbox/first-party-sets-integration/")

> 如果你想加入高质量前端交流群，或者你有任何其他事情想和我交流也可以添加我的个人微信 [ConardLi](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzk0MDMwMzQyOA%3D%3D%26mid%3D2247493407%26idx%3D1%26sn%3D41b8782a3bdc75b211206b06e1929a58%26chksm%3Dc2e11234f5969b22a0d7fd50ec32be9df13e2caeef186b30b5d653836b0725def8ccd58a56cf%23rd "https://mp.weixin.qq.com/s?__biz=Mzk0MDMwMzQyOA==&mid=2247493407&idx=1&sn=41b8782a3bdc75b211206b06e1929a58&chksm=c2e11234f5969b22a0d7fd50ec32be9df13e2caeef186b30b5d653836b0725def8ccd58a56cf#rd") 。