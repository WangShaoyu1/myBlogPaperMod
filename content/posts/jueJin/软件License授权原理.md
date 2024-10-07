---
author: "IT果果日记"
title: "软件License授权原理"
date: 2024-02-25
description: "软件License授权原理你知道License是如何防止别人破解的吗？本文将介绍License的生成原理，理解了License的授权原理你不但可以防止别人破解你的License，你甚至可以研究别人的"
tags: ["安全","算法"]
ShowReadingTime: "阅读13分钟"
weight: 1013
---
[](https://link.juejin.cn?target=)**软件License授权原理**

[](https://link.juejin.cn?target=)你知道License是如何防止别人破解的吗？本文将介绍License的生成原理，理解了License的授权原理你不但可以防止别人破解你的License，你甚至可以研究别人的License找到它们的漏洞。**喜欢本文的朋友建议收藏+关注，方便以后复习查阅。**

[](https://link.juejin.cn?target=)**什么是License？**

[](https://link.juejin.cn?target=)在我们向客户销售商业软件的时候，常常需要对所发布的软件实行一系列管控措施，诸如验证使用者身份、软件是否到期，以及保存版权信息和开发商详情等。考虑到诸多应用场景可能处于离线环境，无法依赖网络进行实时认证，所以还需要考虑单机认证时的防破解问题。总之，License许可证利用HTTPS网站的证书和签名技术，一方面证明当前使用者是申请License的本人，另一方面要防止恶意破解，并伪造篡改License达到白嫖的目的。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2dcf3c89ea5404b9ee22a7ab4950154~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2222&h=2189&s=3695386&e=png&b=f8fbfc)

[](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)**为什么使用License授权？**

[](https://link.juejin.cn?target=)License的作用是什么呢？收费软件的License其目的肯定是防止用户白嫖啦，所以License还应该具有以下一些功能：

*   [](https://link.juejin.cn?target=)授权使用

[](https://link.juejin.cn?target=)明确用户需要满足的使用条件，如单用户、多用户、企业内部使用、全球使用等，并且通常会限定可安装和激活的设备数量。

*   [](https://link.juejin.cn?target=)限制功能

[](https://link.juejin.cn?target=)根据不同等级的License，软件可以提供不同等级的功能，例如基础版、专业版、企业版等，License可以解锁相应版本的功能。

![image(1).png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/165bb5813ed74a73a893819714df1391~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1154&h=255&s=52376&e=png&b=ffffff)

*   [](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)期限控制

[](https://link.juejin.cn?target=)规定软件的使用期限，可能是永久授权，也可能是订阅式授权，到期后用户需要续费才能继续使用。

*   [](https://link.juejin.cn?target=)版权保护

[](https://link.juejin.cn?target=)重申软件的知识产权归属，禁止未经授权的复制、分发、反编译、篡改或逆向工程等侵犯版权的行为。

*   [](https://link.juejin.cn?target=)法律保障

[](https://link.juejin.cn?target=)License作为法律合同，确立了软件提供商和用户之间的法律关系，明确了双方的权利和责任，如果发生违反协议的情况，软件提供商有权采取法律手段追究责任。

![image(2).png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad0ad4ef5cdf4847a6d91aa9f0d73a95~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=640&h=400&s=150311&e=png&a=1&b=afd9e2)

*   [](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)技术支持和升级服务

[](https://link.juejin.cn?target=)部分License中会规定用户是否有权享有免费的技术支持、软件更新和维护服务，以及这些服务的有效期限。

*   [](https://link.juejin.cn?target=)合规性要求

[](https://link.juejin.cn?target=)对于特殊行业或特定地区，License可能还涉及到满足特定法规、标准或认证的要求。

[](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)归纳起来，我们可以总结出License的作用是：

*   [](https://link.juejin.cn?target=)控制软件使用者的使用权限
*   [](https://link.juejin.cn?target=)申明软件所有者的版权
*   [](https://link.juejin.cn?target=)规定软件的使用规范

[](https://link.juejin.cn?target=)最后两点主要是法律相关的，第一点才是本文的重点，即如何生成License，以及如何通过License对软件用户进行限制。

[](https://link.juejin.cn?target=)**License分类**

[](https://link.juejin.cn?target=)依据用途的不同，License可分为两大类别：**商用License**和**非商用License**。

[](https://link.juejin.cn?target=)非商用License主要服务于诸如展览展示活动、各类研发活动等多种非直接盈利性的应用场景；

[](https://link.juejin.cn?target=)商用License，则通常适用于那些开展商业运营活动的企业场所。

![image(3).png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fadff8374edc4eb086e203ef210d42c4~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=447&h=172&s=12206&e=png&b=fee592)

[](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)基于使用的期限，License可以划分为固定期限License和永久License两类。

[](https://link.juejin.cn?target=)固定期限License在激活后的指定时间内有效，过了预设的使用期限，用户必须更新许可期限并通过重新激活才能继续使用；

[](https://link.juejin.cn?target=)而永久License则是在激活后赋予用户无时间限制的使用权，一旦激活，无需担忧许可失效的问题，可以无限期地持续使用软件。

[](https://link.juejin.cn?target=)**如何实现License授权？**

[](https://link.juejin.cn?target=)要想生成一个安全性高的License，必须让其满足以下几个特征：

*   [](https://link.juejin.cn?target=)保密性
*   [](https://link.juejin.cn?target=)防篡改
*   [](https://link.juejin.cn?target=)时效性
*   [](https://link.juejin.cn?target=)可找回

[](https://link.juejin.cn?target=)保密性是指License里携带的data信息具有一定的隐蔽性，这样可以防止想要破解License的人寻找到生成License的规律，进而伪造自己的License。

[](https://link.juejin.cn?target=)防篡改是指防止License里携带的重要信息被篡改，例如License有效时间如果被篡改，那么License就起不到限制用户使用期限的作用了。

[](https://link.juejin.cn?target=)时效性是指License会记录软件可以使用的有效期，并在验证License的时候判断其是否过期。

[](https://link.juejin.cn?target=)可找回是指用户申请的License一旦丢失或者要续期，基于第一次申请License时创建的源文件，再一次生成新的License，新的License会携带用户当初申请时的信息。

[](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)由于License必须满足以上特性，所以在介绍License实现原理之前，我们先来学习一下非对称加密和签名&验签。

[](https://link.juejin.cn?target=)**非对称加密**

[](https://link.juejin.cn?target=)有非对称加密必然就会有对称加密，对称加密就是我们一般意义上的加密算法，这种算法在加密和解密时都使用同一个密钥，所以对称加密算法的密钥又叫做共享密钥。对称加密算法一般使用AES（Advanced Encryption Standard）加密算法。

![image(4).png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ce8d761d95743409cf654aee077d226~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1013&h=382&s=81130&e=png&b=f9f7f7)

[](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)非对称加密有两个密钥，一个公钥一个私钥。公钥是公开的，供多个人使用；私钥是非公开的，仅一个人或者少数群体使用。**当非对称加密算法用作加解密时，公钥用来对明文加密，私钥用来给密文解密**，这个顺序不能颠倒。你可以这样理解，密文是私密的东西，只有少数人才能解密，所以少数人手里的私钥用来解密，多数人手里的公钥不能解密只能加密。

![image(5).png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c26179abbfa4ef7a58f7bffe72a4dca~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=989&h=553&s=214436&e=png&b=fbf9f9)

[](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)为什么要区分公钥和私钥呢？直接使用一个共享密钥不行吗？可以，但是前提是你能够安全的将共享密钥传递给对方。共享密钥如何在线上安全的同步给对方是一个问题，毕竟在网络上传输信息很容易暴露。如果使用非对称密钥就可以将公钥同步给消息发送者，而消息接收者则保留私钥用来解密消息，这样即使公钥被中间人盗取，他也只能用来做加密操作而不能解密密文。

[](https://link.juejin.cn?target=)**签名&验签**

[](https://link.juejin.cn?target=)虽然非对称加密可以解决“密钥分配问题”，但是它不能防止伪造消息的问题。既然公钥可以公之于众，大家都知道你的消息要怎么加密，假如A想给B发送消息，那么中间人X可不可以将A发送的消息拦截，并将自己的消息加密以后发送给B呢？当然可以！

[](https://link.juejin.cn?target=)这就好比你买了一张周杰伦的演唱会的门票，我看到了之后自己伪造了一个一模一样的，如此一来我也可以去看周杰伦的演唱会。这时官方组织者发现了这个漏洞以后，规定周杰伦的演唱会门票需要带上官方印章才能进场，此时我就算把门票画的再惟妙惟肖，少了官方印章，我的这张假门票依然是张废纸。

[](https://link.juejin.cn?target=)如何解决这个问题呢？答案就是给你的消息“盖章”，即签名，签名就是认证你的身份。这里还是使用非对称密钥算法，只不过使用的顺序和加密消息时恰好相反。**签名时是私钥用来加密，公钥用来解密。**

![image(6).png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1290ca540a8b4a938d85184815ee57e3~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=926&h=537&s=260551&e=png&b=fdfcfc)

[](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)你可以这样理解，给消息签名就好比给文件盖章，你会随随便便把你自己的印章交给别人来使用吗？当然不行！所以公钥不适合用来签名，私钥用作签名更加合理。需要注意的是签名所使用的密钥对由消息发送者生成并提供给消息接收者，这和给消息加密时正好相反，这样说来消息加密和消息签名这两个使用场景就需要生成两套密钥对。

![1111_waifu2x_photo_noise1_scale.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0bd559f45471464abf20921da19ac2db~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1152&h=404&s=146275&e=png&b=ffffff)

[](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)出于性能方面的考虑，大多数情况下给消息加密还是使用的对称加密算法，为了解决“密钥分配问题”，只会在第一次发送共享密钥的时候才会使用非对称加密，一旦消息接收者得到了共享密钥，通信双方就能够通过共享密钥进行通信了。

[](https://link.juejin.cn?target=)此外，使用非对称密钥对消息签名也可以防止消息被人篡改，由于性能原因一般不会对消息原文进行签名，而是先通过哈希算法形成消息摘要，再对消息摘要签名。消息接收者验签时会将消息的明文进行哈希，再将消息签名解密，两者比对如果一致则证明消息没有被篡改过。

[](https://link.juejin.cn?target=)**License结构**

[](https://link.juejin.cn?target=)前面铺垫了一些生成License所必备的基础知识，我们学习了生成的License如果需要防止被人破解，那就需要具有保密性、防篡改和防伪造等特点。接下来要考虑的是License需要携带什么信息就能让其既安全又能限制用户的使用权限。

[](https://link.juejin.cn?target=)License文件理论上来说至少需要以下一些信息：

*   [](https://link.juejin.cn?target=)软件所有者信息
*   [](https://link.juejin.cn?target=)申请授权时间
*   [](https://link.juejin.cn?target=)授权截止时间
*   [](https://link.juejin.cn?target=)软件使用者信息

[](https://link.juejin.cn?target=)下图是License文件流的结构图，主要字段有：

*   [](https://link.juejin.cn?target=)**魔数值**
*   [](https://link.juejin.cn?target=)**分隔符**
*   [](https://link.juejin.cn?target=)**申请时间**
*   [](https://link.juejin.cn?target=)**到期时间**
*   [](https://link.juejin.cn?target=)**公钥的长度 & 公钥**
*   [](https://link.juejin.cn?target=)**携带信息的长度 & 携带信息**

![安全算法总结-导出(4).png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/398251dd58474a25bc7aec319a16f3ff~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=4280&h=1888&s=370283&e=png&b=beecfd)

*   [](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)**魔数值**：和Java Class文件头的魔数CAFEBABE类似，License文件头的魔数也是起到了快速识别的作用，也有格式验证的作用。
*   [](https://link.juejin.cn?target=)**分隔符**：用来区分各个字段，将字段之间用分隔符隔开便于结构化管理。
*   [](https://link.juejin.cn?target=)**申请时间**：用户申请License的日期。
*   [](https://link.juejin.cn?target=)**到期时间**：License的有效截止日期。
*   [](https://link.juejin.cn?target=)**公钥的长度 & 公钥**：公钥长度用来记录公钥是多少字节，依据公钥长度就可以读取相应长度的公钥数据了。
*   [](https://link.juejin.cn?target=)**携带信息的长度 & 携带信息**：携带信息长度用来记录携带信息是多少字节，依据携带信息长度就可以读取相应长度的携带信息了。携带信息里通常会包含软件所有者、软件使用者、License唯一ID以及设备MAC地址等信息。

[](https://link.juejin.cn?target=)想好了License文件的结构，我们就可以开始生成License啦。

[](https://link.juejin.cn?target=)**生成License**

[](https://link.juejin.cn?target=)申请License的总体流程如下图所示。客户在软件服务商处申请License，软件服务商生成License之后会返回给客户License文件，自己保留一份License源文件，源文件用作以后找回License。客户拿到License文件，在安装、启动软件之后激活License。

![license_apply.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/976225e50412420b90c0f4d18b88dc1d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=681&h=321&s=35675&e=png&b=fffafa)

[](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)生成License主要做了这样几个事情：

*   [](https://link.juejin.cn?target=)对需要携带的信息加密成密文
*   [](https://link.juejin.cn?target=)对密文签名
*   [](https://link.juejin.cn?target=)保存申请日期、有效截止日期和公钥
*   [](https://link.juejin.cn?target=)生成源文件

![安全算法总结-导出.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8026fd20798c41248704594ab8d729a6~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2887&h=4820&s=591339&e=png&b=f2f1f1)

[](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)私钥1加密的作用是对License的安全加固。因为License实际上可以通过Base64解码得到里面的数据，包括公钥信息，这样客户就能够通过公钥将携带的信息解析出来，倘若携带有敏感信息就会造成安全问题。所以这里对携带的信息做了先加密后签名的处理。

[](https://link.juejin.cn?target=)另外需要强调的是，**申请日期和有效截止日期也需要签名但不需要加密**。因为如果不签名的话，客户可以将日期解析出来之后篡改成自己想要的任何日期。

[](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)**加载License**

![smart-license.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c45106cade4044db8cee185affd6ca8e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=361&h=651&s=37358&e=png&b=fff9f9)

[](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)客户申请到License之后，就可以去软件上面激活啦。激活License首先判断License是否合法，检查文件头魔数和分隔符是否正确，检查License是否过期等。然后就是提取License的授权信息进行验签比对。如果有必要，还可以检查授权信息里携带的MAC地址是否与安装设备的MAC地址匹配。如果一切正常就可以通过验证。

![安全算法总结-导出(1).png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/054414ea9ac9446a8ce7c115ab275285~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1921&h=3734&s=334047&e=png&b=f1f1f1)

[](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)**找回License**

![license_forget.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/554a265f1ae8456584e23d2fff227486~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=681&h=321&s=29289&e=png&b=fffcfc)

[](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)**防破解**

[](https://link.juejin.cn?target=)首先需要明确的一点就是，**没有万无一失的防破解方案，所谓魔高一尺道高一丈，漏洞堵的再严实依然能找到破解的方法，唯一的区别就是破解的成本高不高而已**。

[](https://link.juejin.cn?target=)例如，具备一定逆向工程经验的程序员都知道，应用程序不仅能够被调试，也能被修改。理论上讲，只要深入探究程序的代码，定位并替换其中嵌入的原始公钥信息，改为自己的公钥。随后，使用个人持有的私钥去创建一个新的授权文件，这样一来，就实现了对软件授权机制的破解。

[](https://link.juejin.cn?target=)更简单的方法是直接反编译验证逻辑的代码，当验证的时候直接返回true，即可通过验证。

[](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)即使不能做到百分之百的安全性，我们还是应该知道一些防破解的方法，增加用户破解的难度。防破解主要有以下几个方面的问题需要重点限制。

*   [](https://link.juejin.cn?target=)如何解决java代码反编译之后，修改验证License的逻辑？

> [](https://link.juejin.cn?target=)答：混淆代码，增加反编译的难度。

*   [](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)如何防止客户修改服务器时间以避免License过期？

> 答：分为离线和在线两种情况。
> 
> 在线情况下加载License信息时，可以将License里保存的过期时间和线上标准时间做比较
> 
> 离线情况下，需要满足条件：申请时间 <= 系统时间 <= 截止时间
> 
> 具体实现方案是，第一次加载License成功之后，将申请时间存到A处；
> 
> 定时更新A处的时间，更新前比较当前系统时间，如果系统时间 < 申请时间，说明系统时间被篡改过。否则，更新A处时间为当前系统时间；
> 
> 保存的时间是经过加密的，但是有个问题是如果用户备份了一开始的时间，过了一段时间之后用这个备份文件恢复，再修改系统时间就可以永不过期，如何解决？
> 
> 可以将A处的时间信息保存到数据库里，数据库权限设置为只有开发人员可以修改，此外数据库安装的机器不能与软件安装的机器相同，否则用户可以将二者统一安装到某一个虚拟机里，快到期的时候再统一恢复到初始时间。
> 
> [](https://link.juejin.cn?target=)A处除了保存时间以外，还需要License的唯一id、使用License的机器mac地址，这些字段是为了保证License不被重复使用。

*   [](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)如何防止客户在多台服务器上使用同一个License？

> [](https://link.juejin.cn?target=)答：将服务器的ip或者mac地址与License做绑定关系。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c800728bbb7e4425849614ed6f0dc7c5~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=660&h=602&s=23889&e=png&b=ffffff)

*   [](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)如何防止用户得到了源文件并获取了私钥，就可以自己伪造License？

> [](https://link.juejin.cn?target=)答：避免将生成License的代码安装在用户的机器环境下，最好在自己的机器环境下生成License。因为生成License之后得到的源文件一般会保存在代码路径下，如果用户反编译生成License的代码，就能够得到源文件信息。

[](https://link.juejin.cn?target=)[](https://link.juejin.cn?target=)最后整理了一张泳道图，可以从整体观察一下不限制、防止篡改系统时间和防止多设备共享License等问题的解决方案。

![安全算法总结-导出(3).png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4271811b0f5485a921b00ad275a1f2a~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=4769&h=4195&s=837430&e=png&b=efede2)