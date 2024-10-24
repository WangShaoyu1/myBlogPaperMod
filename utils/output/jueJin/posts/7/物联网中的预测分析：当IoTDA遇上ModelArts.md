---
author: "华为云开发者联盟"
title: "物联网中的预测分析：当IoTDA遇上ModelArts"
date: 2024-04-09
description: "在物联网解决方案中，针对庞大的数据进行自动学习时，需要对海量数据进行标注、训练，按照传统的方式进行标注、训练不仅耗时耗力，而且对资源消耗也是非常庞大的。"
tags: ["物联网","人工智能中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:0,comments:0,collects:0,views:442,"
---
本文分享自华为云社区《[最佳实践：华为云IoTDA结合ModelArts实现预测分析](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%2F425312%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs/425312?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")》，作者：华为IoT云服务。

场景说明
----

在物联网解决方案中，针对庞大的数据进行自动学习时，需要对海量数据进行标注、训练，按照传统的方式进行标注、训练不仅耗时耗力，而且对资源消耗也是非常庞大的。华为云物联网平台可以通过规则引擎，将数据转发到华为云其他云服务，可实现将海量数据通过函数工作流（FunctionGraph）进行处理，再将数据流入AI开发平台（ModelArts）进行AI分析，并将分析结果统一转发至HTTP服务器中。

**图1** 场景说明

![cke_181.png](/images/jueJin/545bf9c0bba84b9.png)

在本示例中，我们实现以下场景：

设备上报银行客户特征信息，物联网平台将数据转发至FunctionGraph，由FunctionGraph转发至ModelArts进行AI分析，最终将分析的结果转发至HTTP服务器中。

整体流程
----

1.  创建并发布ModelArts模型。
2.  创建FunctionGraph函数。
3.  构建一个HTTP服务器。
4.  创建MQTT协议产品，并创建设备。
5.  创建流转规则，将数据流转至FunctionGraph。
6.  查看HTTP服务器是否收到AI分析后的消息。

前提条件
----

*   已注册华为官方帐号。未注册可参考[注册华为账户](https://link.juejin.cn?target=https%3A%2F%2Fsupport.huaweicloud.com%2Fusermanual-account%2Faccount_id_001.html "https://support.huaweicloud.com/usermanual-account/account_id_001.html")完成注册。
*   已完成实名制认证。未完成可在华为云上单击[实名认证](https://link.juejin.cn?target=https%3A%2F%2Faccount.huaweicloud.com%2Fusercenter%2F%23%2Faccountindex%2FrealNameAuth "https://account.huaweicloud.com/usercenter/#/accountindex/realNameAuth")完成认证，否则会影响后续云服务的开通。
*   已开通设备接入服务。未开通则访问[设备接入服务](https://link.juejin.cn?target=https%3A%2F%2Fwww.huaweicloud.com%2Fproduct%2Fiothub.html "https://www.huaweicloud.com/product/iothub.html")，单击“免费试用”或单击“价格计算器”购买并开通该服务。
*   已开通FunctionGraph服务。未开通则访问[FunctionGraph服务](https://link.juejin.cn?target=https%3A%2F%2Fwww.huaweicloud.com%2Fproduct%2Ffunctiongraph.html "https://www.huaweicloud.com/product/functiongraph.html")，单击“立即使用”后开通该服务。
*   已开通ModelArts服务。未开通则访问[AI开发平台](https://link.juejin.cn?target=https%3A%2F%2Fwww.huaweicloud.com%2Fproduct%2Fmodelarts.html "https://www.huaweicloud.com/product/modelarts.html")，单击“控制台”后进入该服务。
*   自建一个HTTP服务器，并提供POST接口用来接收推送的数据（本示例默认已经提供好相应的服务器与接口，不再展示如何搭建HTTP服务器指导）。

配置ModelArts模型
-------------

1.下载[ModelArts-Lab工程](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2FModelArts%2FModelArts-Lab "https://gitee.com/ModelArts/ModelArts-Lab")，在\\ModelArts-Lab-master\\official\_examples\\Using\_ModelArts\_to\_Create\_a\_Bank\_Marketing\_Application\\data”目录下获取训练数据文件“train.csv”。该训练数据主要展示银行中的一种常见业务：根据客户特征（年龄、工作类型、婚姻状况、文化程度、是否有房贷和是否有个人贷款），预测客户是否愿意办理定期存款业务。

2.可将训练数据存放在OBS中，供创建数据集使用。进入OBS控制台，选则一个桶，然后单击“上传对象”。若没有桶，可以单击右上角“创建桶”创建一个新的桶。

**图2** 上传训练数据

![cke_182.png](/images/jueJin/5685489ea2ea44b.png)

3.登录华为云官方网站，访问[AI开发平台](https://link.juejin.cn?target=https%3A%2F%2Fwww.huaweicloud.com%2Fproduct%2Fmodelarts.html "https://www.huaweicloud.com/product/modelarts.html")，单击“控制台”，进入ModelArts服务。

4.选择左侧导航栏“自动学习>前往新版>创建项目”，进入创建预测分析界面。

**图3** 预测分析

![cke_183.png](/images/jueJin/8f6f2494d1c64d8.png)

5.选择数据集、标签列（数据中预测结果的列，本示例中为str7），若没有数据集，可以单击“创建数据集”进行创建。

**图4** 创建预测分析

![cke_184.png](/images/jueJin/f9ae668f1b8347e.png)

**图5** 创建数据集

![cke_185.png](/images/jueJin/00824de19d174ae.png)

6.当执行到服务部署时，选择资源池、AI应用及版本，单击“继续运行”。

**图6** 服务部署

![cke_186.png](/images/jueJin/64f922002db24a3.png)

7.等部署完成之后，选择左侧导航栏“部署上线 > 在线服务”，进入在线服务页面中选择部署的服务， 单击“修改”，进入修改服务页面，打开APP认证进行授权配置，完成后单击“下一步”并提交。

**图7** 授权

![cke_187.png](/images/jueJin/cbb1f012f56441b.png)

8.单击“部署上线>在线服务”，点击进入已部署的服务，选择“预测”，复制以下数据到预测代码中后，单击“预测”后可查看返回结果，结果中的predict为no则表示用户不会办理存款。

```json
    {
    "data":
        {
        "count": 1,
        "req_data":
            [
                {
                "str1": "34",
                "str2": "blue-collar",
                "str3": "single",
                "str4": "tertiary",
                "str5": "no",
                "str6": "no"
            }
        ]
    }
}
```

**图8** 预测

![cke_188.png](/images/jueJin/f77c131290c44de.png)

9.更多详细关于Modelarts的说明可以参考[ModelArts相关文档](https://link.juejin.cn?target=https%3A%2F%2Fsupport.huaweicloud.com%2Fproductdesc-modelarts%2Fmodelarts_01_0001.html "https://support.huaweicloud.com/productdesc-modelarts/modelarts_01_0001.html")。

配置FunctionGraph函数
-----------------

1.参考[数据转发至FunctionGraph函数工作流](https://link.juejin.cn?target=https%3A%2F%2Fsupport.huaweicloud.com%2Fusermanual-iothub%2Fiot_bp_00013.html "https://support.huaweicloud.com/usermanual-iothub/iot_bp_00013.html")进行函数工作流配置。本示例中由于需要使用ModelArts相关配置参数，可按照如下方式，在代码中添加配置项并访问ModelArts预测接口，body体结构参考[8](https://link.juejin.cn?target=https%3A%2F%2Fsupport.huaweicloud.com%2Fbestpractice-iothub%2Fiot_bp_0224.html%23ZH-CN_TOPIC_0000001805148193__li1167523613387 "https://support.huaweicloud.com/bestpractice-iothub/iot_bp_0224.html#ZH-CN_TOPIC_0000001805148193__li1167523613387")。

```ini
//2.获取ModelArts预测链接. 用来拼装请求URL
String forecastServerAddress = context.getUserData(FORECAST_SERVER_ADDRESS);
log.log("forecastServerAddress: " + forecastServerAddress);
//3.获取ModelArts中的AK/APP_KEY
String ak = context.getUserData(ACCESS_KEY);
//4.获取ModelArts中的SK/APP_SECRET
String sk = context.getUserData(ACCESS_SECRET);

Request request = new Request();
request.setUrl(forecastServerAddress);
request.setMethod(HttpMethodName.POST.name());
request.setAppKey(ak);
request.setAppSecrect(sk);
request.addHeader(HttpHeaders.CONTENT_TYPE, ContentType.APPLICATION_JSON.toString());
request.setBody(body);
Signer signer = new Signer();
signer.sign(request);

Map<String, String> headers = request.getHeaders();
HttpPost httpPost = new HttpPost(url);
headers.forEach(httpPost::setHeader);
httpPost.setEntity(new StringEntity(body, ContentType.APPLICATION_JSON));
CloseableHttpResponse response = null;
    try {
    response = httpClient.execute(httpPost);
        if (response.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
        String content = EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);
        IoTDAModelArtsDemo.log.log("response content is: + " + content);
        return content;
    }
    String errContent = EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);
    IoTDAModelArtsDemo.log.log("response err content is: + " + errContent);
    return errContent;
        } finally {
            if (response != null) {
            response.close();
        }
    }
```

2.在函数工作流中，单击“设置>环境变量”，环境变量信息如下。

表1 环境变量说明

![](/images/jueJin/cf998fdd43d84ff.png)

**图9** 设置环境变量

![cke_189.png](/images/jueJin/21a423bff08045a.png)

**图10** 查看预测接口信息

![cke_190.png](/images/jueJin/df3ebb06d22948a.png)

3.单击“代码>配置测试事件>创建新的测试事件>空白模板”。内容示例如下：

```css
    {
    "resource": "device.message",
    "event": "report",
    "event_time": "20231227T082702Z",
    "event_time_ms": "2023-12-27T08:27:02.944Z",
    "request_id": "1d041aa3-29b8-43d3-aae3-3905de130537",
        "notify_data": {
            "header": {
            "app_id": "dc12bf47e95c4723a00f4a007073fc7e",
            "device_id": "658bdb475d3bc3372c99feb9_12345484121",
            "node_id": "12345484121",
            "product_id": "658bdb475d3bc3372c99feb9",
            "gateway_id": "658bdb475d3bc3372c99feb9_12345484121"
            },
                "body": {
                "topic": "$oc/devices/658bdb475d3bc3372c99feb9_12345484121/sys/messages/up",
                    "content": {
                    "age": "34",
                    "profession": "blue-collar",
                    "maritalStatus": "single",
                    "educationalStatus": "tertiary",
                    "realEstateSituation": "no",
                    "loanStatus": "tertiary"
                }
            }
        }
    }
```

**图11** 配置测试事件

![cke_191.png](/images/jueJin/2056e3acd4294f5.png)

4.配置完测试事件后，单击“测试”，执行结果返回success（以实际函数返回结果为准），则表示成功。配置的HTTP服务器则能收到对应的预测结果。

**图12** 预测结果

![cke_192.png](/images/jueJin/c980f39e5b164c5.png)

创建产品和设备
-------

1.访问[设备接入服务](https://link.juejin.cn?target=https%3A%2F%2Fwww.huaweicloud.com%2Fproduct%2Fiothub.html "https://www.huaweicloud.com/product/iothub.html")，单击“管理控制台”进入设备接入控制台。

2.选择左侧导航栏的“产品”，单击“创建产品”，创建一个基于MQTT协议的产品，填写参数后，单击“确定”。

**图13** 创建产品-MQTT

![cke_193.png](/images/jueJin/278a2615a28d44f.png)

3.导入产品模型，请参考[导入产品模型](https://link.juejin.cn?target=https%3A%2F%2Fsupport.huaweicloud.com%2Fdevg-iothub%2Fiot_02_9995.html%23section1 "https://support.huaweicloud.com/devg-iothub/iot_02_9995.html#section1")。

在该产品下注册设备，请参考[注册单个设备](https://link.juejin.cn?target=https%3A%2F%2Fsupport.huaweicloud.com%2Fusermanual-iothub%2Fiot_01_0031.html "https://support.huaweicloud.com/usermanual-iothub/iot_01_0031.html")。

说明：本文中使用的产品模型和设备仅为示例，您可以使用自己的产品模型和设备进行操作。

数据转发规则配置
--------

1.选择左侧导航栏的“规则>数据转发”，单击“创建规则”。

2.参考下表参数说明，填写规则内容。以下参数取值仅为示例，您可参考[用户指南](https://link.juejin.cn?target=https%3A%2F%2Fsupport.huaweicloud.com%2Fusermanual-iothub%2Fiot_01_0024.html "https://support.huaweicloud.com/usermanual-iothub/iot_01_0024.html")创建自己的规则，填写完成后单击“创建规则”。

**图14** 新建消息上报流转规则-数据转发至FunctionGraph

![cke_194.png](/images/jueJin/413ffd7b878e453.png)

表2 参数说明

![](/images/jueJin/0f3b7c395d32421.png)

3.单击“设置转发目标”页签，单击“添加”，设置转发目标。

**图15** 新建转发目标-转发至FunctionGraph

![cke_195.png](/images/jueJin/b2e17213f9d74d6.png)

参考下表参数说明，填写转发目标。填写完成后单击“确定”。

表3 参数说明

![](/images/jueJin/83439333dd3f445.png)

4.单击“启动”，激活配置好的数据转发规则。

**图16** 启动规则-消息上报-转发至FunctionGraph

![cke_196.png](/images/jueJin/21400e0fc4ec412.png)

模拟数据上报及结果验证
-----------

1.使用MQTT模拟器连接到平台（模拟器使用请参考：[使用MQTT.fx调测](https://link.juejin.cn?target=https%3A%2F%2Fsupport.huaweicloud.com%2Fdevg-iothub%2Fiot_01_2127.html "https://support.huaweicloud.com/devg-iothub/iot_01_2127.html")）。

2.使用模拟器进行消息上报，详情请参考：[设备消息上报](https://link.juejin.cn?target=https%3A%2F%2Fsupport.huaweicloud.com%2Fapi-iothub%2Fiot_06_v5_3016.html "https://support.huaweicloud.com/api-iothub/iot_06_v5_3016.html")。

上报内容如下：

```json
    {
    "age": "34",
    "profession": "blue-collar",
    "maritalStatus": "single",
    "educationalStatus": "tertiary",
    "realEstateSituation": "no",
    "loanStatus": "tertiary"
}
```

3.查看HTTP服务器是否收到预测结果。

**图17** 查看消息

![cke_197.png](/images/jueJin/da71cb059e574aa.png)

[**点击关注，第一时间了解华为云新鲜技术~**](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")