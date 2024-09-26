---
author: "sidiot"
title: "【网络安全】「靶场练习」（一）暴力破解漏洞BurtForce"
date: 2024-09-23
description: "前言本篇博文是《从0到1学习安全测试》中靶场练习系列的第一篇博文，主要内容是了解暴力破解漏洞以及通过靶场进行实战练习加深印象。"
tags: ["安全","黑客","面试"]
ShowReadingTime: "阅读4分钟"
weight: 368
---
前言
--

本篇博文是《从0到1学习安全测试》中**靶场练习**系列的第**一**篇博文，主要内容是**了解暴力破解漏洞以及通过靶场进行实战练习加深印象**，往期系列文章请访问博主的 [安全测试](https://juejin.cn/column/7258193813674836005 "https://juejin.cn/column/7258193813674836005") 专栏；

**严正声明：本博文所讨论的技术仅用于研究学习，旨在增强读者的信息安全意识，提高信息安全防护技能，严禁用于非法活动。任何个人、团体、组织不得用于非法目的，违法犯罪必将受到法律的严厉制裁。**

安装靶场
----

本文用的靶场是 [pikachu](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fzhuifengshaonianhanlu%2Fpikachu "https://github.com/zhuifengshaonianhanlu/pikachu")，将下载下来的源代码放入到 phpStudy 的 WWW 目录下，如下图所示：

![a1.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/700c325e241b4fd28966c3c697482401~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgc2lkaW90:q75.awebp?rk3s=f64ab15b&x-expires=1727697392&x-signature=3J2iUL%2FJf8JnU86RaUleENcgwvs%3D)

修改文件 `pikachu\inc\config.inc.php` 中的数据库配置，将数据库的用户名和密码都改成 `root`，如下所示：

php

 代码解读

复制代码

`define('DBUSER', 'root'); define('DBPW', 'root');`

完成之后启动 phpStudy，访问 [http://localhost/pikachu/install.php](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%2Fpikachu%2Finstall.php "http://localhost/pikachu/install.php") ，点击 “安装/初始化” 按钮，初始化成功的话，就可以开始了，如下图所示：

![a2.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/516befdd6778403e80b3adc0e30466da~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgc2lkaW90:q75.awebp?rk3s=f64ab15b&x-expires=1727697392&x-signature=wP87%2Ft71jIDdyxnraoFFgPA0zGc%3D)

同时，通过 phpMyAdmin 还可以看到数据库的结构与内容，如下图所示：

![a3.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/2c45e47de08e4162866ad8067d112ff1~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgc2lkaW90:q75.awebp?rk3s=f64ab15b&x-expires=1727697392&x-signature=v%2BvW2yHTaOh%2BlavgTKQbSVIXIjk%3D)

暴力破解漏洞介绍
--------

> 从来没有哪个时代的黑客像今天一样热衷于猜解密码 ---奥斯特洛夫斯基

暴力破解（Brute Force）是一种通过尝试所有可能组合来破解密码或密钥的攻击方式。攻击者利用计算机的处理能力，逐一尝试每个可能的密码，直到找到正确的为止。

### 攻击方式

1.  **密码字典**：攻击者可能会使用一个包含常见密码的字典，这样可以加快破解速度。
2.  **字符组合**：对于复杂密码，攻击者会通过算法生成所有可能的字符组合，直到找到匹配的密码。
3.  **自动化工具**：通常使用自动化工具（如 Hashcat、John the Ripper 等）来进行攻击，以便在短时间内测试大量组合。

### 防御措施

1.  **使用强密码**：选择包含大小写字母、数字和特殊字符的复杂密码。
2.  **启用多因素认证**：增加额外的安全层，即使密码被破解，攻击者也无法轻易访问账户。
3.  **设置登录限制**：限制失败登录尝试次数，锁定账户或延迟后续尝试。
4.  **监控异常活动**：监测和记录登录活动，识别潜在的暴力破解攻击。

暴力破解漏洞练习
--------

### 1、基于表单的暴力破解

![t1.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/85ad48f18f6a4147bf1134e416370b8c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgc2lkaW90:q75.awebp?rk3s=f64ab15b&x-expires=1727697392&x-signature=nEbTMibLDOiIE1%2BpsmqbeTLmQCo%3D)

先随便输入个用户名和密码试试水，没想到直接登录上了，真巧，登录成功。

![t2.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ad61288f5bfa4e749865d88def2b70c9~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgc2lkaW90:q75.awebp?rk3s=f64ab15b&x-expires=1727697392&x-signature=GHT4rxha2deriakL9P0wvfRe%2FXs%3D)

自己构造一个字典爆破一下密码，然后根据响应长度来判断是否登录成功。

![t3.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/8cce96d5b4bc4fd6b82544724c5881e8~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgc2lkaW90:q75.awebp?rk3s=f64ab15b&x-expires=1727697392&x-signature=LKxqYR9JJP2qmujbqx7vEci011E%3D)

### 2、验证码绕过 (on server)

![t4.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/c168d0020fba4f5abf0ae637e06fab19~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgc2lkaW90:q75.awebp?rk3s=f64ab15b&x-expires=1727697392&x-signature=uRWBn7NdSVKbaIHSJEGjkmX0%2BD4%3D)

可以发现本题比之前多了一个验证码。通过抓包分析，发现验证码只有在触发 `onclick="this.src='../../inc/showvcode.php?'+new Date().getTime();"` 时才会刷新。因此，可以利用这一点固定验证码，从而进行密码爆破。

![t5.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/cc0a7560c2bd4c04833e53d7c243304d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgc2lkaW90:q75.awebp?rk3s=f64ab15b&x-expires=1727697392&x-signature=0PPMLVCrJCytNySFLzgazDBCluk%3D)

还是如之前一般，通过攻击模块进行密码爆破，并根据响应长度来判断结果。

![t6.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/108315bd70ce4f4db9245b335660791b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgc2lkaW90:q75.awebp?rk3s=f64ab15b&x-expires=1727697392&x-signature=AlkgvQkxRCzv5rCasWG4F6wo6%2B0%3D)

### 3、验证码绕过 (on client)

![t7.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/e6a012caf4de42e1abfb723fc229ae36~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgc2lkaW90:q75.awebp?rk3s=f64ab15b&x-expires=1727697392&x-signature=K6KgUNGccI9kustXCNkkd9ffQxk%3D)

本题的验证码是通过 JS 实现的，也是在前端完成判断，因此可以通过发包的方式直接进行绕过。

![t8.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ca7cd90ef5ec425cb6de8b49c741bbb9~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgc2lkaW90:q75.awebp?rk3s=f64ab15b&x-expires=1727697392&x-signature=52qtX7TAdX%2FZiBC%2Bmq2GwTmZoM0%3D)

这里 `vcode` 参数不影响最终结果，直接忽略即可。

![t9.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ae6eaaa081ca47079e5cb0a459e2f62d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgc2lkaW90:q75.awebp?rk3s=f64ab15b&x-expires=1727697392&x-signature=D%2BFkfrepgsWKjbm3b7O6vnXzH3M%3D)

最后按照上面的方式爆破密码即可。

后记
--

以上就是 _**暴力破解漏洞 Burt Force**_ 的所有内容了，希望本篇博文对大家有所帮助！

**严正声明：本博文所讨论的技术仅用于研究学习，旨在增强读者的信息安全意识，提高信息安全防护技能，严禁用于非法活动。任何个人、团体、组织不得用于非法目的，违法犯罪必将受到法律的严厉制裁。**

> 📝 上篇精讲：[这是第一篇，没有上一篇喔~](https://link.juejin.cn?target=)
> 
> 💖 我是 **𝓼𝓲𝓭𝓲𝓸𝓽**，期待你的关注，创作不易，请多多支持；
> 
> 👍 公众号：**sidiot的技术驿站**；
> 
> 🔥 系列专栏：[安全测试工具和技术：从漏洞扫描到渗透测试](https://juejin.cn/column/7258193813674836005 "https://juejin.cn/column/7258193813674836005")