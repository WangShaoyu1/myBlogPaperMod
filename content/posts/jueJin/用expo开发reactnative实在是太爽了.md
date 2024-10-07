---
author: "天平"
title: "用expo开发reactnative实在是太爽了"
date: 2024-04-14
description: "expo出来已经有一段时间了，发现相关的文章还是比较少的。如果你在开发reactnative，那么我推荐你赶快使用expo来开发把！expo的好处是什么？一、零配置开发，降低开发者的心智负担。如"
tags: ["ReactNative","React.js","Java"]
ShowReadingTime: "阅读4分钟"
weight: 901
---
expo出来已经有一段时间了，发现相关的文章还是比较少的。如果你在开发react native，那么我推荐你赶快使用expo来开发把！

expo的好处是什么？
===========

一、零配置开发，降低开发者的心智负担。如果你之前开发过react native，那么你肯定会遇到要配置java，sdk等一大堆东西，并且版本还要对应上，否则开发不了。甚至说新手也会被这些东西劝退。使用expo后，无需配置这些开发环境，像开发web一样流畅的开发react native。

二、实时真机调试。以前开发react native，要打包后才能真机调试，并且ios的打包要审核，审核要花很长的时间，导致Android和ios之间兼容性的问题不能实时的查看，大大降低了开发效率。使用了expo之后，能够进行实时的真机调试。

三、云打包，一键推送到谷歌应用市场和Apple store。

开始
==

一、安装依赖
------

node 20 环境，首先安装全局脚手架

shell

 代码解读

复制代码

`npm i -g  eas-cli expo-cli`

expo-cli用于开发，eas-cli用于推送云打包。

二、手机下载Expo go
-------------

安卓手机可以到谷歌市场下载Expo go，但是不知道为什么，下载的速度太慢了。所以我这里提供网页端下载。 [expo.dev/go](https://link.juejin.cn?target=https%3A%2F%2Fexpo.dev%2Fgo "https://expo.dev/go") 选择最新版下载安装就行了

![c8e4198875cfdd9281d91fd2128dbbc.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b29dfb595684688879a2414e1a407ea~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=756&h=654&s=101786&e=jpg&b=bcc9d0)

三、创建项目
------

shell

 代码解读

复制代码

`npx create-expo-app app`

四、启动项目
------

arduino

 代码解读

复制代码

`npm run start`

会出现一个二维码

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7a28f7e7e214f8fbc8280e8d8fa647b~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=724&h=722&s=51338&e=png&b=212437)

五、真机调试
------

拿出手机，打开Expo go，使用Scan QR code扫二维码，即可看到效果

![c7aa116998932f390d75d2eca82804c.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98b5bc72c6a845a68f2f616946f49569~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1080&h=2340&s=224428&e=jpg&b=f8f8fa)

效果:

![f0f5865ba8dced6db92b1e6b62423a0.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/15d2742f81ac46a5bfc68cb4fb8b0c84~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1080&h=2340&s=93749&e=jpg&b=ffffff) 修改一下代码后，按R reload一下

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d8cf2d8fc4449fabcef93208946bbdc~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=773&h=147&s=24930&e=png&b=25283b) 效果：

![311ed102d4c0168b5a80ce48f29487b.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba1b873f53a74192bb62f6ea79da9afa~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1080&h=2340&s=77528&e=jpg&b=ffffff)

app开发就这么简单。

六、云打包app
--------

先到expo官网注册一下账号，[expo.dev/](https://link.juejin.cn?target=https%3A%2F%2Fexpo.dev%2F "https://expo.dev/") ，然后本地登录expo账号，输入：

 代码解读

复制代码

`eas login`

登录后，输入以下代码，让其自动生成eas.json配置文件。

css

 代码解读

复制代码

`eas build --platform android`

全选是就行了，没讲究 ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c67cd7650e341b5b3f3874dbfbbb6ec~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=627&h=342&s=51304&e=png&b=212336)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2962558d389455b88ecfe62e41c243e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2505&h=680&s=124279&e=png&b=24273a)

会把当前的项目上传到expo，并且打包。终端显示Build in progress时，就说明正在排队打包。这里会等待很久，少则20分钟，多则两小时。此时就可以把终端关闭了，并且到expo的官网面板中查看项目

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64795e982303465f984a5016f39cc783~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=367&h=185&s=16157&e=png&b=202335) ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0201442beee49c5a1481a4bb8d1af0c~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2187&h=972&s=198844&e=png&b=ffffff) 第一次是生成AAB文件，不是我们想要的apk文件，此时我们要改造一下eas.json文件，加入一段

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aafe6eb3831d4e22bb7f85a0e2d1261c~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=837&h=330&s=21065&e=png&b=ffffff)

json

 代码解读

复制代码

        `"release": {             "android": {                 "buildType": "apk"             }         }`

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9a5c467c1824635b9ed7af336f2df69~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=754&h=815&s=77800&e=png&b=25283b) 然后重新打包一次

css

 代码解读

复制代码

`eas build --platform android --profile release`

因为要排队打包，快则20分钟，慢则2个小时。大家慢慢等待即可。

打包好后，下载安装即可。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55dcb08e2df4434c94a3252910da7274~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1876&h=583&s=76847&e=png&b=ffffff)

七、本地打包app
---------

首先云打包太慢了，并且代码上传也不安全。那么怎么实现本地打包呢？

很遗憾，目前仅支持MacOS和Linux进行本地打包，windows暂不支持。

### MacOS/Linux本地打包

如果你的电脑已经配置好了java、NDK环境，只需执行

css

 代码解读

复制代码

`eas build --platform android --profile release --local`

然后按照操作即可。

如果你的电脑没有配置好环境，那么就用我配置好的`docker`镜像进行打包，操作如下：

### windows本地打包

windows可以用WSL下载Linux子系统进行打包。我这里提供另一种方法，是用docker进行打包

先再项目中添加一个eas.json文件

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1285804a37d64de19d991e3b5abce837~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=196&h=57&s=2351&e=png&b=202335)

json

 代码解读

复制代码

`{     "cli": {         "version": ">= 10.0.0"     },     "build": {         "development": {             "developmentClient": true,             "distribution": "internal"         },         "preview": {             "distribution": "internal"         },         "production": {},         "release": {             "android": {                 "buildType": "apk"             }         }     },     "submit": {         "production": {}     } }`

然后到expo获取一个token [expo.dev/](https://link.juejin.cn?target=https%3A%2F%2Fexpo.dev%2F "https://expo.dev/")

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13105f2f5b3641108fb948cbb34f3c7e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=522&h=1271&s=53516&e=png&b=ffffff)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ecbc1db705c34d21891a8a96a1de2029~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1924&h=507&s=50246&e=png&b=ffffff) 在项目中添加一个dockerfile.build用于打包，下面把token替换成你的token

yml

 代码解读

复制代码

`FROM mobiledevops/android-sdk-image:latest RUN apt update \     && apt install -y nodejs npm RUN npm i -g eas-cli expo yarn COPY ./ /WWW/APP WORKDIR /WWW/APP ENV EXPO_TOKEN=这里替换成你的token ENV NODE_ENV=production RUN npm i CMD eas build --platform android --profile release --local`

再写一个docker-compose.yaml进行自动化构建

yml

 代码解读

复制代码

`version: '3' name: build services:     build:         build:             context: .             dockerfile: dockerfile.build         image: build         container_name: app         tty: true         stdin_open: true         volumes:             - ./:/WWW/APP/`

整体的结构

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93ce19bb6af245b39a71ece240d55f86~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=351&h=601&s=34683&e=png&b=212437)

运行命令

yml

 代码解读

复制代码

`docker-compose up -d`

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bfb7e2efc69a4e2aaad12b68ac086802~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=931&h=468&s=76824&e=png&b=ffffff) 最后成功了，拿去安装就可以了。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ca5f8d1f844430aa0cb916560069c35~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=382&h=157&s=12309&e=png&b=202335)

当然最好的方案还是配好java，sdk等环境用macOS来打包。

将create-react-native改造成expo
===========================

注：旧项目改造起来有点复杂，我没有成功，这里就不试了，你们自己研究一下。我这里演示的是用最新的react native开始改造
---------------------------------------------------------------

搭建项目
----

java

 代码解读

复制代码

`npx react-native@latest init test`

然后安装expo

css

 代码解读

复制代码

`npm i expo -D`

然后照着expo项目改就行了，把babel.config.js中的内容改成以下

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb11f77025784e7a829448610aaed2bc~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=604&h=249&s=26597&e=png&b=26293c)

js

 代码解读

复制代码

`module.exports = function (api) {   api.cache(true);   return {     presets: ['babel-preset-expo'],   }; };`

把index.js中的appName改成'main'。【本地打包的时候，记得改回来】

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b919c3fde174357a4f1ea0bf206a26c~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=846&h=343&s=44779&e=png&b=26293c) package.json中添加一个expo的脚本

json

 代码解读

复制代码

   `"expo": "expo start",`

然后启动即可

arduino

 代码解读

复制代码

`npm run expo`

改造成功

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a89b9bfc39b345eba945091670bb0852~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1014&h=874&s=80605&e=png&b=212437)

效果：

![50ffc358294acdeef01b2f86e8740ab.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ddee02e65614db68e747d1308c75914~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1080&h=2340&s=470695&e=jpg&b=fcfcfc)

### 如果你又不想云打包，又想本地打包，又没有配置好java等环境，又没有docker，那么睡大觉比较合适你。

![C493D0010651F3A96CA62DCAA8326559.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e01cee01b8f3480badbce348380ce93f~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=270&h=224&s=4890&e=jpg&b=efeaef)

旧项目改造失败怎么办？
-----------

旧项目改造会有很多环境的问题，我没有弄过，所以只能靠你们自己去研究。同时我也对旧项目用expo改造毫无兴趣，简直是浪费时间，所以最好还是开新项目的时候就用。