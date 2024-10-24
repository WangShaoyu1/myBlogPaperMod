---
author: "Gaby"
title: "iconfont字体图标的使用方法--秒懂！"
date: 2021-12-23
description: "iconfont自定义图标,非常强大!之前看了一波教程,觉得繁琐,弄明白后其实很简单的，很多时候都是被最初的想法给吓到了而已，或者写教程的人没有写清楚,现在就做个简单教程,简单粗暴,避免新手走弯路"
tags: ["架构","CSS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:1,comments:0,collects:6,views:541,"
---
iconfont自定义图标,非常强大!之前看了一波教程,觉得繁琐,弄明白后其实很简单的，很多时候都是被最初的想法给吓到了而已，或者写教程的人没有写清楚,现在就做个简单教程,简单粗暴,避免新手走弯路,这里讲解的默认是元素使用类名;

主角: [iconfont+官网](https://link.juejin.cn?target=https%3A%2F%2Fwww.iconfont.cn%2F "https://www.iconfont.cn/")

注册登录
----

这个呢，就不说了，如果注册登录账号都是问题，那我觉得你就没必要再看下去了，还是先学下计算机基础的比较好，没别的意思，这个基本功就都默认你已经掌握了。

[注册入口](https://link.juejin.cn?target=https%3A%2F%2Fwww.iconfont.cn%2Fregister "https://www.iconfont.cn/register") 就直接手机号注册吧，另外有GitHub账号、微博账号或者阿里域账号均可直接登录。

![image.png](/images/jueJin/28b585fa53774e7.png)

[登录入口](https://link.juejin.cn?target=https%3A%2F%2Fwww.iconfont.cn%2Flogin "https://www.iconfont.cn/login")

![image.png](/images/jueJin/50556771729a49e.png)

创建项目
----

登录之后在首页菜单找到 `资源管理--我的项目` , 点击进入

![image.png](/images/jueJin/06464a74426645d.png)

进入我的项目之后在右上角点击 新建项目图标 ![image.png](/images/jueJin/9d5451ae8235442.png)

如图填写上项目名称和自己想要设置的图表前缀即可，该前缀为在项目中引用的时候所用的前缀，默认是`icon-`

![image.png](/images/jueJin/12506ef8b7854d9.png)

项目已经创建好了，之后就需要往项目中添加图标了 ![image.png](/images/jueJin/173864c4dacd4a7.png)

添加图标到购物车
--------

在网站顶部菜单，`图标库` 中，任意选择一个菜单进去，这里我们选择 `官网图标`

![image.png](/images/jueJin/3aaf8bd0e86a4b6.png)

从官方图标库中选择一个进去选择自己所需要的图标，这里我们选择 `Hippo Design 官方图标库`

![image.png](/images/jueJin/df62d446f31947e.png)

将鼠标放在对应图标上会显示添加购物车、收藏、下载的菜单，这里我们选择添加购物车，从购物车中可以将图标添加到项目中

![image.png](/images/jueJin/9d5a56fc2f5343f.png)

这里我们选择`browse`图标

![image.png](/images/jueJin/4dfaa36a1b8d466.png)

将购物车图标添加到项目中
------------

选中的图标都会被虚线标记出来 ![image.png](/images/jueJin/6c311cb3c02b422.png)

进入到购物车，选择 `添加至项目`

![image.png](/images/jueJin/320363af415e461.png)

选择自己刚刚创建的项目，并点击确定

![image.png](/images/jueJin/6e9e11d778b1458.png)

下载项目到本地
-------

此时在我的项目中可以看到从购物车中添加的图标，点击`下载到本地`这时就可以在项目中引用下载好的文件了

![image.png](/images/jueJin/b7f9ba9d2b324fb.png)

项目中引用
-----

下载下来解压后的文件如下:

![image.png](/images/jueJin/6c3e6adf6210484.png)

将下载好的文件都放在**一个文件夹内，然后放在你的项目目录中,再在你的项目中引入iconfont.css文件**

![image.png](/images/jueJin/13c924c7ad96457.png)

到了最后一步了,如何在项目中使用字体图标呢,其实很简单,创建一个i标签或者span标签,添加两个类名,一个固定的是iconfont,另一个是你想要的那个图标对应的类名:

![image.png](/images/jueJin/61bf56fed20541f.png)

![image.png](/images/jueJin/9b122e74a5ff4e1.png)

添加好，刷新页面，就可以看到图标了，

![image.png](/images/jueJin/239a9ef10d4a4ce.png)