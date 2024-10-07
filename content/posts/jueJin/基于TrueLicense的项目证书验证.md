---
author: "平凡人笔记"
title: "基于TrueLicense的项目证书验证"
date: 2020-11-25
description: "1、开发的软件产品在交付使用的时候，往往有一段时间的试用期，这期间我们不希望自己的代码被客户二次拷贝，这个时候license就派上用场了，license的功能包括设定有效期、绑定ip、绑定mac等。2、授权方直接生成一个license给使用方使用，如果需要…"
tags: ["Java"]
ShowReadingTime: "阅读2分钟"
weight: 996
---
基于 TrueLicense 的项目证书验证

使用场景
----

1、 开发的软件产品在交付使用的时候，往往有一段时间的试用期，这期间我们不希望自己的代码被客户二次拷贝，这个时候 license 就派上用场了，license 的功能包括设定有效期、绑定 ip、绑定 mac 等。

2、 授权方直接生成一个 license 给使用方使用，如果需要延长试用期，也只需要重新生成一份 license 即可，无需手动修改源代码。

原理简介
----

1、TrueLicense 是一个开源的证书管理引擎，详细介绍见 https://truelicense.java.net/

2、license 授权机制的原理

*   生成密钥对，包含私钥和公钥。
    
*   授权者保留私钥，使用私钥对授权信息诸如使用截止日期，mac 地址等内容生成 license 签名证书。
    
*   公钥给使用者，放在代码中使用，用于验证 license 签名证书是否符合使用条件
    

生成证书
----

### 利用jdk keytool工具制作证书

 代码解读

复制代码

`keytool -genkeypair -keysize 1024 -validity 3650 -alias "privateKey" -keystore "privateKeys.keystore" -storepass "deepglint_store_pwd123" -keypass "deepglint_key_pwd123" -dname "CN=localhost, OU=localhost, O=localhost, L=SH, ST=SH, C=CN"`

### 利用jdk keytool工具导出证书文件

 代码解读

复制代码

`keytool -exportcert -alias "privateKey" -keystore "privateKeys.keystore" -storepass "deepglint_store_pwd123" -file "certfile.cer"`

### 利用jdk keytool工具将证书文件导入到证书库中

 代码解读

复制代码

`keytool -import -alias "publicCert" -file "certfile.cer" -keystore "publicCerts.keystore" -storepass "deepglint_store_pwd123"`

![](https://imgkr2.cn-bj.ufileos.com/582fcd5a-42b3-4a58-9b7a-0af9121679bf.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=YiHbRKiMyov1HYOBUSL5XYKDZio%253D&Expires=1606400895)

两个子项目说明
-------

![](https://imgkr2.cn-bj.ufileos.com/fe9b5365-ecac-4a36-9b6a-1fcfeb666ee2.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=RHb3GVT3j6L7B5Kn3pFeOYn3M6g%253D&Expires=1606399866)

*   lic-auth-server：用于**开发者**给客户生成`License证书`的示例代码
*   lic-auth-client：**模拟需要给客户部署的业务项目**

获取服务器信息
-------

 代码解读

复制代码

`http://127.0.0.1:10000/license/getServerInfos`

![](https://imgkr2.cn-bj.ufileos.com/db09754c-fe5c-44ba-a02c-82715c8f1416.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=XALUwhEE3we7VkGR9Di8itmxqfI%253D&Expires=1606398171)

给客户机生成license
-------------

![](https://imgkr2.cn-bj.ufileos.com/3e6c74f1-5f04-4043-a9e8-6bdcf35d20f7.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=eyDCv9PTjlyXV3QGvCo7ut1KyIE%253D&Expires=1606400002)

 代码解读

复制代码

`http://127.0.0.1:10000/license/generateLicense  header Content-Type application/json;charset=UTF-8  {  "subject": "license_sub",    #证书subject  "privateAlias": "privateKey",  #秘钥别名         "keyPass": "deepglint_key_pwd123",    #秘钥口令  "storePass": "deepglint_store_pwd123",   #秘钥库口令  "licensePath": "/Users/mengfanxiao/Documents/work/license/cert/license.lic",   #存放license文件位置  "privateKeysStorePath": "/Users/mengfanxiao/Documents/work/license/cert/privateKeys.keystore",     #秘钥库文件文件  "issuedTime": "2020-11-25 00:00:01",  #license有效期起始时间    "expiryTime": "2020-11-25 22:00:00",   #license有效期截止时间   "licenseCheckModel": {   "ipAddress": ["192.168.5.121"],       #客户机ip   "macAddress": ["A4-83-E7-BE-3D-D9"],  #客户机mac地址      "cpuSerial": "",         #客户机cpu序列号   "mainBoardSerial": ""    #客户机主板序列号  } }`

![](https://imgkr2.cn-bj.ufileos.com/5afee473-521c-42f9-aa05-21f22e5d34b3.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=J5BQfA%252Btj1sOZtfICkExSq1T8YI%253D&Expires=1606399821)

在客户机使用license
-------------

![](https://imgkr2.cn-bj.ufileos.com/b24704a1-1152-458c-9048-a1d6aefb12e3.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=vAhZxECoZWy%252BGtbfJWuSmZEVnmc%253D&Expires=1606400115)

在项目启动的时候安装证书

![](https://imgkr2.cn-bj.ufileos.com/be56b7e4-5b1c-4bea-93ea-c0e55f167b3d.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=VHqhSCNV8tGb4e6pxha4KmcXzsQ%253D&Expires=1606400301)

访问接口进行测试

 代码解读

复制代码

`http://127.0.0.1:10001/auth/api/1.0/getUserInfo  header  Content-Type application/json;charset=UTF-8`

![](https://imgkr2.cn-bj.ufileos.com/5a8de53a-d84d-430b-81ee-56fbe42ec20e.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=G3H1fC7fXCZRnfd41H3YCBbN8xg%253D&Expires=1606400191)

如果证书过期

![](https://imgkr2.cn-bj.ufileos.com/e6cbee7d-c547-4fe5-8fa1-2dddc9a6c4fc.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=EpdQlMsbTfN55KddSNg6hxrDESk%253D&Expires=1606400349)

源码
--

 代码解读

复制代码

`https://gitee.com/pingfanrenbiji/lic-auth`