---
author: "程序员Sunday"
title: "还学鸿蒙原生？vue3+uniapp可以直接开发鸿蒙啦！"
date: 2024-07-28
description: "7月20号，uniapp官网“悄咪咪”的上线了uniapp开发鸿蒙应用的文档，算是正式开启了Vue3+uniapp开发鸿蒙应用的时代！"
tags: ["前端","HarmonyOS"]
ShowReadingTime: "阅读2分钟"
weight: 485
---
Hello，大家好，我是 Sunday

7月20号，uniapp 官网“悄咪咪”的上线了 **uniapp 开发鸿蒙应用** 的文档，算是正式开启了 `Vue3 + uniapp 开发鸿蒙应用` 的时代。

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/6e22b98abd4147628241ef01084e367f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGYU3VuZGF5:q75.awebp?rk3s=f64ab15b&x-expires=1727589473&x-signature=QpOWJGNg8WyrDMLKx29sruyOpmw%3D)

开发鸿蒙的前置准备
---------

想要使用 uniapp 开发鸿蒙，我们需要具备三个条件：

1.  DevEco-Studio 5.0.3.400 以上（下载地址：`https://developer.huawei.com/consumer/cn/deveco-studio/`）
2.  鸿蒙系统版本 API 12 以上 （DevEco-Studio有内置鸿蒙模拟器）
3.  HBuilderX-alpha-4.22 以上

**PS：** 这里不得不吐槽一下，一个 DevEco-Studio 竟然有 10 个 G......

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/14f28cfaf9f645a7a5b3a5625f6bdef7~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGYU3VuZGF5:q75.awebp?rk3s=f64ab15b&x-expires=1727589473&x-signature=KaX20ym45qBeRWb8griyWzU6RWA%3D)

> 安装好之后，我们就可以通过 **开发工具** 运行 **示例代码**

运行时，需要用到 **鸿蒙真机或者模拟器**。但是这里需要 **注意：** Windows系统需要经过特殊配置才可以启动，mac 系统最好保证系统版本在 `mac os 12 以上`

#### windows 系统配置方式（非 windows 用户可跳过）：

打开控制面板 - 程序与功能 - 开启以下功能

1.  Hyper-V
2.  Windows 虚拟机监控程序平台
3.  虚拟机平台

注意: 需要win10专业版或win11专业版才能开启以上功能，家庭版需先升级成专业版或企业版

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/aa903a43d8974748b09074aba03e371b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGYU3VuZGF5:q75.awebp?rk3s=f64ab15b&x-expires=1727589473&x-signature=K0eASiZ1NfOTijLLxGXg4%2Bt6noM%3D)

启动鸿蒙模拟器
-------

整个过程分为三步（中间会涉及到鸿蒙开发者申请）：

1.  下载 uni-app 鸿蒙离线SDK template-1.3.4.tgz （下载地址：`https://web-ext-storage.dcloud.net.cn/uni-app/harmony/zip/template-1.3.4.tgz`）
2.  解压刚下载的压缩包，将解压后的模板工程在 DevEco-Studio 中打开

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/76eddfb09d04417c9ef9db3ae1a3e767~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGYU3VuZGF5:q75.awebp?rk3s=f64ab15b&x-expires=1727589473&x-signature=%2FUtrQQm%2BORaMmfG53KxkwoV1S5g%3D)

3.  等待 Sync 结束，再 启动鸿蒙模拟器 或 连接鸿蒙真机（如无权限，则需要申请（一般 3 个工作日），申请地址：`https://developer.huawei.com/consumer/cn/activity/201714466699051861/signup`）

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/cc35d41ba9814642af74a035cf50c4aa~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGYU3VuZGF5:q75.awebp?rk3s=f64ab15b&x-expires=1727589473&x-signature=hvHubjVe4jOpkGht4%2BBdwGg7jjU%3D)

配置 HBuilderX 吊起 DevEco-Studio
-----------------------------

打开HBuilderX，点击上方菜单 - 工具 - 设置，在出现的弹窗右侧窗体新增如下配置

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/cf7b84658edf42a4a371e768d0f2ea90~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGYU3VuZGF5:q75.awebp?rk3s=f64ab15b&x-expires=1727589473&x-signature=XjDqWmfLbUWR2OT%2Fx%2Fi6Ok%2FKeoM%3D)

注意：值填你自己的 DevEco-Studio 启动路径

js

 代码解读

复制代码

`"harmony.devTools.path" : "/Applications/DevEco-Studio.app"`

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/14163e6eb9c74cda8c353efc00ff7798~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGYU3VuZGF5:q75.awebp?rk3s=f64ab15b&x-expires=1727589473&x-signature=VqeOIPMS6eJt1BnWm8wt5iTUkvQ%3D)

创建 uni-app 工程
-------------

1.  BuilderX 新建一个空白的 uniapp 项目，选vue3
2.  在 manifest.json 文件中配置鸿蒙离线SDK路径（SDK 路径可在 DevEco-Studio -> Preferences(设置) z中获取）

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/b3c69753ecea47898d1243894c8f59f7~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGYU3VuZGF5:q75.awebp?rk3s=f64ab15b&x-expires=1727589473&x-signature=zqBqcD5EdgXhkxBK7qXNF4lJStE%3D)

编辑 `manifest.json` 文件，新增如下配置：

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/28299a57744d4880b20a9a7628f104dc~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGYU3VuZGF5:q75.awebp?rk3s=f64ab15b&x-expires=1727589473&x-signature=uv9c3RjOK9bLSqaT85tkWl%2BnWJM%3D)

然后点击 **运行到鸿蒙即可**

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/126c3e259edc4392beba22a6cc4f7596~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iL5bqP5ZGYU3VuZGF5:q75.awebp?rk3s=f64ab15b&x-expires=1727589473&x-signature=%2FWuBiHRYltymtT7%2FWSCEvROdC8g%3D)

总结
--

这样我们就有了一个初始的鸿蒙项目，并且可以在鸿蒙模拟器上运行。关于更多 uniapp 开发鸿蒙的 API，大家可以直接参考 uniapp 官方文档：`https://zh.uniapp.dcloud.io/tutorial/harmony/dev.html#nativeapi`

> **[前端训练营：1v1私教，终身辅导计划，帮你拿到满意的 `offer`。](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzkxNjUxMDg4Ng%3D%3D%26mid%3D2247492977%26idx%3D1%26sn%3Ddcc0d797efdcdbb21ac50e183f5960c4%26chksm%3Dc14c64b8f63bedaebfa149533984870ee9e8d9eeb8f493af39030a6571399682a2ec171f8b08%26token%3D292319748%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzkxNjUxMDg4Ng==&mid=2247492977&idx=1&sn=dcc0d797efdcdbb21ac50e183f5960c4&chksm=c14c64b8f63bedaebfa149533984870ee9e8d9eeb8f493af39030a6571399682a2ec171f8b08&token=292319748&lang=zh_CN#rd")** 已帮助数百位同学拿到了中大厂 `offer`