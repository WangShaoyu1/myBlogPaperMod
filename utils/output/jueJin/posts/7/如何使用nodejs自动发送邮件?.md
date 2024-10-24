---
author: "徐小夕"
title: "如何使用nodejs自动发送邮件?"
date: 2021-02-17
description: "之前用Nodejs做了很多服务端模块, 最近抽空复盘一下, 接下来笔者将介绍如何使用Nodejs来自动向用户发送邮件 笔者将详细介绍自动发送邮箱的实现方案, 以及通过一个实际的案例来带大家掌握使用nodejs自动发送邮件, 最后会介绍一些实际的应用场景, 来加深对该方案的理解…"
tags: ["JavaScript","Node.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:104,comments:0,collects:133,views:12879,"
---
之前用`Nodejs`做了很多服务端模块, 最近抽空复盘一下, 接下来笔者将介绍如何使用`Nodejs`来自动向用户发送邮件.

笔者将详细介绍自动发送邮箱的实现方案, 以及通过一个实际的案例来带大家掌握**使用nodejs自动发送邮件**, 最后会介绍一些实际的应用场景, 来加深对该方案的理解, 达到学以致用的目的.

### 实现方案

实现自动发送邮件笔者采用了基于`Nodejs`生态的`nodemailer`, 它可以轻松的帮我们发送电子邮件, 官网地址: [nodemailer](https://link.juejin.cn?target=https%3A%2F%2Fnodemailer.com "https://nodemailer.com").

![](/images/jueJin/b51634f18964488.png)

之所以选择`nodemailer`是因为它提供了非常灵活的自定义配置和安全保障, 比如:

*   具有零依赖关系的单一模块, 代码容易审核，没有死角
*   `Unicode`支持使用任何字符，包括表情符号💪
*   邮件内容既支持普通文本, 还支持自定义`html`
*   支持自定义附件
*   支持安全可靠的`SSL/STARTTLS`邮件发送
*   支持自定义插件处理邮件消息

还有很多特点笔者就不一一介绍了. 接下来我们来看一个笔者简化并翻译的官网案例:

```js
"use strict";
const nodemailer = require("nodemailer");

// 使用async..await 创建执行函数
    async function main() {
    // 如果你没有一个真实邮箱的话可以使用该方法创建一个测试邮箱
    let testAccount = await nodemailer.createTestAccount();
    
    // 创建Nodemailer传输器 SMTP 或者 其他 运输机制
        let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email", // 第三方邮箱的主机地址
        port: 587,
        secure: false, // true for 465, false for other ports
            auth: {
            user: testAccount.user, // 发送方邮箱的账号
            pass: testAccount.pass, // 邮箱授权密码
            },
            });
            
            // 定义transport对象并发送邮件
                let info = await transporter.sendMail({
                from: '"Dooring 👻" <dooring2021@163.com>', // 发送方邮箱的账号
                to: "bar@example.com, baz@example.com", // 邮箱接受者的账号
                subject: "Hello Dooring", // Subject line
                text: "H5-Dooring?", // 文本内容
                html: "欢迎注册h5.dooring.cn, 您的邮箱验证码是:<b>${emailCode}</b>", // html 内容, 如果设置了html内容, 将忽略text内容
                });
            }
            
            main().catch(console.error);
```

以上代码是发送带有纯文本和`HTML`正文的电子邮件的完整示例. 笔者在代码上做了详细的翻译, 我们可以总结出要想发送邮件, 我们需要如下3个步骤:

*   创建`Nodemailer`传输器 `SMTP` 或者其他运输机制
*   设置 `Message` 选项(将什么消息发送给谁)
*   使用先前创建的传输器的`sendMail（）`方法传递消息对象

宏观的使用流程我们知道了, 接下来我们落实到每一个技术功能点来实现.我们需要关注如下几个核心点:

*   如何设置 `host`
*   如何设置 `auth`
*   如何配置 `Message` 选项

解答了以上3个问题, 我们就能灵活的使用`Nodemailer`发送自定义邮件了.

### 如何设置host, port, secure

这里笔者拿网易邮箱来举例. 比如我们想用我们自己的网易邮箱给用户发送邮件, 我们需要先注册一个用于发送邮件的网易邮箱, 比如`dooring2021@163.com`. 由于我们采用`SMTP`传输器 , 所以在邮箱主页我们找到如下选项并设置:

![](/images/jueJin/db71077ebc4440c.png)

在该页面下方我们可以找到对应的`host`, 如下:

![](/images/jueJin/c752ec0e1779429.png)

关于**port**和**secure**, 我们采用默认配置即可, 设置`secure`为`true`,表示端口默认使用`465`. 详细配置如下:

![](/images/jueJin/226546af10e7471.png)

### 如何设置auth

`auth`我们在上一步的操作中已经涉及到了, 我们在开启`IMAP/SMTP`服务时会提示保存邮箱授权码, 这里的授权码就是`auth.pass`的值, `auth.user`表示当前授权的邮箱.

### 如何设置Message

消息配置是我们邮箱服务比较重要的部分, 官方提供了如下几个配置说明:

![](/images/jueJin/3450201db26244b.png) 这里笔者给大家详细介绍一下:

*   **from** 发件人的电子邮件地址。所有电子邮件地址都可以是纯'[sender@server.com](https://link.juejin.cn?target=mailto%3Asender%40server.com "mailto:sender@server.com")“或格式化”‘发送者名称’[sender@server.com](https://link.juejin.cn?target=mailto%3Asender%40server.com "mailto:sender@server.com")'
*   **to** 逗号分隔的列表或收件人的电子邮件地址的排列
*   **cc** 逗号分隔的列表或将显示在“抄送”字段中的收件人电子邮件地址数组
*   **bcc** 逗号分隔的列表或将显示在“密件抄送：”字段中的收件人电子邮件地址数组
*   **subject** 电子邮件的主题
*   **text** 消息的文本内容
*   **html** 消息的html内容, **如果定义了html, 将忽略text**
*   **attachments** 附件内容

熟悉了以上配置之后我们基本可以配置满足80%场景的邮件发送需求了. 这里我们来看一个设置`Message`的简单案例:

```js
    await transporter.sendMail({
    from: '"v6.dooring" <dooring2021@163.com>', // sender address
    to: 'xujiang156@qq.com', // list of receivers
    subject: 'welcome to use dooring', // Subject line
    text: 'Hello world?', // plain text body
    html: `欢迎注册v6.dooring, 您的邮箱验证码是:<b>${emailCode}</b>`, // html body
    })
```

该案例是使用`dooring`邮箱给一个普通用户发送邮箱验证码的场景, 是不是很熟悉呢? 这个场景目前被应用在很多登录注册相关的场景中. 接下来看看实际的效果:

![](/images/jueJin/69be5934c06c459.png)

### 扩展

我们利用`Nodemailer`可以开发很多有意思的产品, 比如:

*   在线邮箱客户端
*   定制邮箱模版
*   邮箱验证中枢系统
*   邮箱群发助手

等等. 关于第二个应用场景, 目前开源有很多漂亮的邮箱模版, 比如

*   **Foundation for Emails**
*   **emailframe** [emailframe.work](https://link.juejin.cn?target=http%3A%2F%2Femailframe.work "http://emailframe.work")
*   **MJML** [mjml.io](https://link.juejin.cn?target=https%3A%2F%2Fmjml.io "https://mjml.io")

![](/images/jueJin/6d7d933b5776446.png)

最后
--

目前笔者也在持续更新**H5**编辑器 [H5-Dooring](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://github.com/MrXujiang/h5-Dooring"), 近期更新如下:

*   添加省市级联组件
*   添加批量导入 excel 数据的能力
*   添加表单自定义校验
*   音频组件添加自动播放控制, 循环播放等配置项
*   添加横向滑动组件
*   增加表单设计器的文件上传功能
*   增加大转盘抽奖组件
*   增加九宫格抽奖组件
*   增加组件权限控制
*   增加图片库自定义上传功能

> 觉得有用 ？喜欢就收藏，顺便点个**赞**吧，你的支持是我最大的鼓励！微信搜 “**趣谈前端**”，发现更多有趣的H5游戏, webpack，node，gulp，css3，javascript，nodeJS，canvas数据可视化等前端知识和实战.