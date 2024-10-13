---
author: "王宇"
title: "ios中麦克风授权后系统音量变化问题"
date: 八月05,2024
description: "语音相关"
tags: ["语音相关"]
ShowReadingTime: "12s"
weight: 578
---
1.授权后变大
=======

auido设为true,会将默认开启回音消除和降噪，就会放大你的系统音量，收到设为false

[?](#)

`navigator.mediaDevices`

    `.getUserMedia({`

      `audio: {`

        `echoCancellation:` `false``,` `//音频开启回音消除`

        `noiseSuppression:` `false``,` `// 开启降噪`

      `},`

      `video:` `false``,`

    `})`

  

  

2.授权后变小
=======

这才是正常的bug，看来是业界问题

![](/download/attachments/129183119/image2024-7-17_10-11-17.png?version=1&modificationDate=1721182277549&api=v2)

1.主页面iframe子页面
--------------

子页面负责播放的部分，主页面麦克风授权后刷新子页面

亲测无效

2.主页面iframe两个子页面
----------------

子页面分别负责麦克风和播放，比较艰难，应该也是不行

3.授权后刷新
-------

发现没用，刷新后需要重新授权

  

4.黑魔法，模拟拾音一次
------------

暂时效果最好，但听闻有些机型播着播着，会小声一丢丢

  

5.也许是最好的办法
----------

在麦克风授权成功回调清理一下流的音轨，然后才开始加载虚拟人，怀疑是之前麦克风跟虚拟人播报的音频上下文（？）混用了？

![](/download/attachments/129183119/image2024-7-18_16-22-35.png?version=1&modificationDate=1721290955511&api=v2)

关键代码

stream.getAudioTracks()\[0\].stop()

不写的话变小声，写了话变大声

  

现阶段总结：
======

**得等待麦克风授权后（不管是允许还是不允许），才能给虚拟人初始化，再次使用麦克风时，必须将虚拟人打断，不然会出现虚拟人播报没声音（变得很小），估计是两个音轨不能共存**

  

**但也只能解决当前的场景，复杂一点的还是有问题，例如中途插个背景音乐，还得继续深入研究**

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)