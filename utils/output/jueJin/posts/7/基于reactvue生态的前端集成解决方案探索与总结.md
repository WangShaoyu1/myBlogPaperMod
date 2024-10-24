---
author: "徐小夕"
title: "基于reactvue生态的前端集成解决方案探索与总结"
date: 2019-07-17
description: "接下来我将介绍项目的基本架构和设计思路，并使用shell脚本来实现自动化安装技术集成方案。最后会在文章的末尾附上github地址，感兴趣的朋友可以研究参考，也可直接使用。如果还不了解shell，可以看我的上一篇文章vuereact项目中不可忽视的自动化部署方案 1 vue集…"
tags: ["JavaScript","前端框架中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:50,comments:0,collects:68,views:5750,"
---
![](/images/jueJin/16c0034f72bb90c.png) 本文主要总结了笔者在多年前端工作中的技术方案选型，结合各种不同类型的项目，搭建了一套完整的前端集成解决方案，主要包含如下内容：

*   基于vue-cli3搭建的vue+vue-router+vuex+elementUI/antd/mint+stylus/less/scss的单/多页项目
*   基于webpack搭建的react+react-router+redux+redux-thunk+immutable+keymirror+antd的单/多页项目（兼容ie9+）
*   基于gulp4.0搭建的原生js/jquery+less/scss传统解决方案

接下来我将介绍项目的基本架构和设计思路，并使用shell脚本来实现自动化安装技术集成方案。最后会在文章的末尾附上github地址，感兴趣的朋友可以研究参考，也可直接使用。如果还不了解shell，可以看我的上一篇文章[vue/react项目中不可忽视的自动化部署方案](https://juejin.cn/post/6844903879180582920 "https://juejin.cn/post/6844903879180582920")

### 正文

#### 1\. vue集成方案——vue+vue-router+vuex+elementUI/antd/mint+stylus/less/scs

1.  设计思路

![](/images/jueJin/16c004deca79a79.png) 2. 项目架构 ![](/images/jueJin/16c004778af45df.png)

3.  启动截图

![](/images/jueJin/16c00489f27fe2f.png)

#### 2.react集成方案——react+react-router+redux+redux-thunk+immutable+keymirror+antd

1.  设计思路

![](/images/jueJin/16c005176ddf040.png) 2. 项目架构 ![](/images/jueJin/16c004b6b809a08.png)

3.  启动截图

![](/images/jueJin/16c004ce83ed78b.png)

#### 3.原生js/jquery集成方案——基于gulp4.0搭建的原生js/jquery+less/scss传统解决方案

1.  设计思路

![](/images/jueJin/16c00535f96b7f6.png) 2. 项目架构

![](/images/jueJin/16c00545486bc54.png)

### 使用shell脚本来实现自动化安装技术集成方案

```bash
#!/bin/bash
echo "请选择技术方案 vue or react or gulp"
read name
if [ $name == 'vue' ]
then
git clone git@github.com:MrXujiang/vue_muti_cli.git
elif [ $name == 'react' ]
then
git clone git@github.com:MrXujiang/webpack3_react.git
elif [ $name == 'gulp' ]
then
git clone git@github.com:MrXujiang/gulp4_multi_pages.git
else
echo "输入不合法"
fi
```

此时我们可以使用如下命令安装你想要的集成方案：

![](/images/jueJin/16c006abaacf63a.png)

### github地址：

*   [基于cli3的集成vuex，element/antd/mint的单/多页面脚手架](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fvue_muti_cli "https://github.com/MrXujiang/vue_muti_cli")
*   [基于webpack3打包单页多页应用](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fwebpack3_react "https://github.com/MrXujiang/webpack3_react")
*   [gulp4打包多页面应用](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fgulp4_multi_pages "https://github.com/MrXujiang/gulp4_multi_pages")

### 更多推荐

*   [教你用200行代码写一个爱豆拼拼乐H5小游戏（附源码)](https://juejin.cn/post/6844903893961293831 "https://juejin.cn/post/6844903893961293831")
*   [9012教你如何使用gulp4开发项目脚手架](https://juejin.cn/post/6844903882124967949 "https://juejin.cn/post/6844903882124967949")
*   [如何用不到200行代码写一款属于自己的js类库)](https://juejin.cn/post/6844903880707293198 "https://juejin.cn/post/6844903880707293198")
*   [让你瞬间提高工作效率的常用js函数汇总(持续更新)](https://juejin.cn/post/6844903878362660878 "https://juejin.cn/post/6844903878362660878")
*   [一张图教你快速玩转vue-cli3](https://juejin.cn/post/6844903877133729799 "https://juejin.cn/post/6844903877133729799")
*   [3分钟教你用原生js实现具有进度监听的文件上传预览组件](https://juejin.cn/post/6844903875632168968 "https://juejin.cn/post/6844903875632168968")
*   [3分钟教你用原生js实现具有进度监听的文件上传预览组件](https://juejin.cn/post/6844903875632168968 "https://juejin.cn/post/6844903875632168968")
*   [使用Angular8和百度地图api开发《旅游清单》](https://juejin.cn/post/6844903873212055560 "https://juejin.cn/post/6844903873212055560")
*   [js基本搜索算法实现与170万条数据下的性能测试](https://juejin.cn/post/6844903866610221064 "https://juejin.cn/post/6844903866610221064")
*   [《前端算法系列》如何让前端代码速度提高60倍](https://juejin.cn/post/6844903865553256461 "https://juejin.cn/post/6844903865553256461")
*   [《前端算法系列》数组去重](https://juejin.cn/post/6844903863674208269 "https://juejin.cn/post/6844903863674208269")
*   [vue高级进阶系列——用typescript玩转vue和vuex](https://juejin.cn/post/6844903831956897806 "https://juejin.cn/post/6844903831956897806")
*   [前端三年，谈谈最值得读的5本书籍](https://juejin.cn/post/6844903824788815879 "https://juejin.cn/post/6844903824788815879")

回复学习路径，将获取笔者多年从业经验的前端学习路径的思维导图；