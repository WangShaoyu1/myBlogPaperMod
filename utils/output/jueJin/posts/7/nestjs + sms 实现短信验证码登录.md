---
author: "徐小夕"
title: "nestjs + sms 实现短信验证码登录"
date: 2022-02-03
description: "今天和大家分享一下使用 nodejs 实现短信验证码登录的方案, 通过对该方案的实现大家可以可以对 nodejs 及其相关生态有一个更深入的"
tags: ["JavaScript","后端","Node.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:0,comments:0,collects:0,views:4741,"
---
hi, 大家好, 我是徐小夕, 新的一年, 你又博学了吗?

今天和大家分享一下使用 `nodejs` 实现短信验证码登录的方案, 通过对该方案的实现大家可以可以对 `nodejs` 及其相关生态有一个更深入的理解.

好啦, 话不多说, 我们开始实现.

### 实现方案

为了更高效的开发 `nodejs` 应用, 这里我选择 `nest.js` 作为服务端框架, 同时使用腾讯云的短信服务:

![](/images/jueJin/61b2f59f22dc440.png)

具体实现流程如下:

![](/images/jueJin/f44ae05fed0d415.png)

详细流程如下:

1.  用户访问网站登录页面, 输入手机号触发验证码
2.  node服务器收到请求后, 拼接所需参数(具体在下文会详细介绍), 请求第三方短信服务平台
3.  第三方短信服务平台校验, 通过后下发对应短信
4.  用户在网站输入收到的验证码, 请求登录接口完成登录

相信大家对第一步没有太大疑问, 接下来我详细介绍几个核心的实现过程.

#### 1\. 短信服务的配置流程

由于我使用的是腾讯云的短信服务, 所以需要按照约定来完成以下配置:

*   创建短信签名

![](/images/jueJin/70825e369c38467.png)

发送短信内容时必须带签名.

*   创建短信模版

![](/images/jueJin/5a9cd49c1d38407.png) 短信模版可以让我们创建自定义的短信内容, 还可以创建动态内容, 大家感兴趣可以研究一下.

*   创建应用(一般使用默认即可)

![](/images/jueJin/250cebb9ac3e4d2.png)

#### 2\. nodejs服务器向短信服务平台发起短信调用

以上配置完成并审核通过之后, 我们就可以使用 `nodejs` 愉快的发送短信了. 这里我们需要安装腾讯云的sdk:

```bash
# nest项目中
npm install tencentcloud-sdk-nodejs --save
```

然后在 `nest` 服务端存储上一步获取的:

*   用户手机号
*   SmsSdkAppId(应用id)
*   TemplateId(模版id)
*   SignName(签名内容)
*   TemplateParamSet(需要发送的验证码)

核心代码如下:

```js
/**
* 发送手机验证码
* @param params 请求体
*/
    async registerCode(params: any): Promise<any> {
    const { phone } = params;
        if (!phone) {
            return {
            code: 400,
            msg: '手机号为空',
            };
        }
        
        const code = `${rand(1000,9999)}`;
        phoneCodeList[phone] = code;
        
            const smsParams = {
                "PhoneNumberSet": [
                `+86${phone}`
                ],
                "SmsSdkAppId": "xxxxx",
                "TemplateId": "12*****",
                "SignName": "dooring服务",
            "TemplateParamSet": [code]
            };
            
                try {
                const result = await client.SendSms(smsParams);
                    if(result?.SendStatusSet.Code === 'Ok') {
                        return {
                        code: 200,
                        msg: 'Success',
                        };
                            }else {
                                return {
                                code: 500,
                                msg: `Service error: ${result?.SendStatusSet.Message}`,
                                };
                            }
                                }catch(err) {
                                    return {
                                    code: 500,
                                    msg: `Service error: ${err}`
                                    };
                                }
                            }
```

以上是用 `nest` 写的一个简单的 `service` 逻辑, 主要功能是发送用户手机号和签名参数到第三方短信平台, 下发短信. `TemplateParamSet`字段为一个数组, 数组长度取决于我们的短信模版中动态变量的配置, 如下:

![](/images/jueJin/afd41d7488eb456.png)

如果我们配置的模版内容中有2个变量, 那么`TemplateParamSet`字段 的数组为2项.

#### 3\. nodejs实现短信验证码验证

最后一步比较简单. 我们只需要把用户填写的验证码和我们服务器生成的验证码进行比对即可, 我们可以使用 `redis` 来缓存验证码.

最终的实现效果如下:

![](/images/jueJin/6d0be0a977a04e0.png)

当然大家可以用自己熟悉的任何 `nodejs` 框架来实现以上功能(如koa, egg).

更多推荐
----

*   [如何搭积木式的快速开发H5页面?](https://juejin.cn/post/6904878119724056584 "https://juejin.cn/post/6904878119724056584")
*   [从零开发一套基于React的加载动画库](https://juejin.cn/post/7028583529940254757 "https://juejin.cn/post/7028583529940254757")
*   [从零开发一款轻量级滑动验证码插件](https://juejin.cn/post/7007615666609979400 "https://juejin.cn/post/7007615666609979400")
*   [如何设计可视化搭建平台的组件商店？](https://juejin.cn/post/6986824393653485605 "https://juejin.cn/post/6986824393653485605")
*   [从零设计可视化大屏搭建引擎](https://juejin.cn/post/6981257575425654792 "https://juejin.cn/post/6981257575425654792")
*   [从零使用electron搭建桌面端可视化编辑器Dooring](https://juejin.cn/post/6976476731662139428 "https://juejin.cn/post/6976476731662139428")
*   [(低代码)可视化搭建平台数据源设计剖析](https://juejin.cn/post/6973946702235615269 "https://juejin.cn/post/6973946702235615269")
*   [从零搭建一款PC页面编辑器PC-Dooring](https://juejin.cn/post/6950075140906418213 "https://juejin.cn/post/6950075140906418213")