---
author: "MacroZheng"
title: "基于SpringBoot的在线文件预览神器，可支持99%常用文件的在线预览！"
date: 2021-08-17
description: "有时候我们不仅需要文件存储，还需要文件的在线预览。这里给大家推荐一个基于SpringBoot的文件预览神器kkFileView，基本支持主流文件的在线预览，使用也很简单！"
tags: ["Java","Spring Boot中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:128,comments:13,collects:219,views:10819,"
---
> 在[上一篇](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FqHjOEeQ3CaA0U4a2YBi3Pw "https://mp.weixin.qq.com/s/qHjOEeQ3CaA0U4a2YBi3Pw") 文章中，我们使用MinIO实现了文件存储，用于存储各种格式的文件。有时候我们不仅需要文件存储，还需要文件的在线预览。这里给大家推荐一个基于SpringBoot的文件预览神器kkFileView，基本支持主流文件的在线预览，使用也很简单，希望对大家有所帮助！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

kkFileView简介
------------

kkFileView可以用来搭建文件在线预览服务，在Github上已有5.7k+Star。该项目使用流行的SpringBoot搭建，易上手和部署，基本支持主流办公文档的在线预览，如docx、xlsx、pptx、pdf、txt、zip、图片、视频、音频等等。项目特性可以参考下图。

![](/images/jueJin/dc54346e8e7c4b1.png)

安装
--

> kkFileView支持在Windows和Linux下安装，下面我们介绍下它的安装，基本就是开箱即用！

### Windows

*   首先下载最新版的安装包，下载地址：[gitee.com/kekingcn/fi…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fkekingcn%2Ffile-online-preview%2Freleases "https://gitee.com/kekingcn/file-online-preview/releases")

![](/images/jueJin/ccd66af5a183406.png)

*   下载成功后，解压到指定目录，然后运行`bin`目录下的`startup.bat`命令即可；

![](/images/jueJin/7f93b7c04d174b4.png)

*   由于是SpringBoot项目，想要修改配置的话，只需修改`config`目录下的`application.properties`文件即可。

![](/images/jueJin/650c9dffe3ac409.png)

### Linux

*   在Linux下使用Docker安装非常简单，只需两个命令即可，首先下载kkFileView的Docker镜像；

```bash
docker pull keking/kkfileview
```

*   下载完成后运行kkfileview的Docker容器，服务将运行在`8012`端口上；

```bash
docker run -p 8012:8012 --name kkfileview \
-d keking/kkfileview
```

*   运行成功后，可以访问kkfileview的测试页，地址地址：[http://192.168.7.109:8012](https://link.juejin.cn?target=http%3A%2F%2F192.168.7.109%3A8012 "http://192.168.7.109:8012")

![](/images/jueJin/73b0a1e3b4ea4c4.png)

使用
--

> 之前我们[使用MinIO搭建了对象存储服务](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FqHjOEeQ3CaA0U4a2YBi3Pw "https://mp.weixin.qq.com/s/qHjOEeQ3CaA0U4a2YBi3Pw") ，接下来我们就把kkfileview和MinIO结合起来使用，首先将需要在线预览的文件存储到MinIO中去，然后预览文件。

*   我们可以使用`S3 Browser`来管理MinIO中的文件，首先创建一个存储桶为`preview`，然后将文件都上传上去；

![](/images/jueJin/93dc3cebff504f1.png)

*   上传成功后需要修改存储桶的访问策略，让匿名用户可以访问；

![](/images/jueJin/02f83e657c084ea.png)

*   修改策略时直接参考`Policy Examples`即可，注意修改下`version`为`2012-10-17`；

![](/images/jueJin/641a48acaa0a463.png)

*   修改成功后就可以在线预览文件了，我们来看下在线预览文件的URL格式，只需传入url（需要预览的文件地址）即可，这里要注意的是这个url需要进行`base64`编码才可以；

```ini
http://192.168.7.109:8012/onlinePreview?url=base64Encode($url)
```

*   接下来我们来预览个图片试试，首先获取图片的访问地址；

![](/images/jueJin/6e66084c2f5045f.png)

*   然后找个网站把url进行`base64`编码，我使用的是这个：[tool.oschina.net/encrypt?typ…](https://link.juejin.cn?target=https%3A%2F%2Ftool.oschina.net%2Fencrypt%3Ftype%3D3 "https://tool.oschina.net/encrypt?type=3")

![](/images/jueJin/d86931356aa8438.png)

*   接下来把url参数放入访问路径中即可预览图片了，是不是很简单！

![](/images/jueJin/5bfdcbef6a314bf.png)

*   再来预览下word文档，我们可以发现右侧有个`JPG`的按钮，可以切换到JPG试图，其实kkfileview是通过把word文档转换为pdf或者JPG来实现文档预览的；

![](/images/jueJin/3ff20192def6467.png)

*   再来预览下ppt文档，发现ppt文档也是通过转化为pdf和JPG来实现预览的；

![](/images/jueJin/038aa09f5fb64d9.png)

*   再来预览下pdf文档，和上面两个并没有啥区别；

![](/images/jueJin/108d1dd031d94b7.png)

*   再来预览下excel文档，这预览效果有待提高；

![](/images/jueJin/cbd97888de434e5.png)

*   再来预览下纯文本的Markdown文档；

![](/images/jueJin/79c22f91d2794dc.png)

*   最后再来预览下压缩文件，支持查看压缩文件中的内容，点击文件可直接预览。

![](/images/jueJin/a47559a8fb8b455.png)

配置
--

> kkfileview的配置众多，具体直接参考`config`目录下的`application.properties`文件即可，这里介绍下如何自定义Docker容器中的配置。

*   如果你想修改kkfileview的配置文件的话，可以先从Docker容器中拷贝出配置文件目录；

```bash
docker cp kkfileview:/opt/kkFileView-3.5.1/config /mydata/kkFileView/
```

*   然后将配置目录、文件目录、日志目录挂载到宿主机并运行；

```bash
docker run -p 8012:8012 --name kkfileview \
-v /mydata/kkFileView/config:/opt/kkFileView-3.5.1/config \
-v /mydata/kkFileView/file:/opt/kkFileView-3.5.1/file \
-v /mydata/kkFileView/log:/opt/kkFileView-3.5.1/log \
-d keking/kkfileview
```

*   如果我们想要给预览文件添加水印的话，可以修改`application.properties`文件中的如下配置，比如我想添加`macrozheng`这个水印；

```properties
#水印内容
#如需取消水印，内容设置为空即可，例：watermark.txt = ${WATERMARK_TXT:}
watermark.txt = ${WATERMARK_TXT:macrozheng}
```

*   修改成功后，再次预览图片就会发现水印已经添加了。

![](/images/jueJin/28637e9309e643e.png)

总结
--

通过对kkFileView的一波实践，我们发现kkFileView可以满足Office文档、视频、图片等主流文件的在线预览需求，使用和配置也非常简单。由于它是通过将word、ppt文档转化为pdf来实现预览的，如果你对Office文档预览没有特别高的要求，完全可以使用它搭建一个全能的文件在线预览服务！

参考资料
----

官方文档：[kkfileview.keking.cn/zh-cn/index…](https://link.juejin.cn?target=https%3A%2F%2Fkkfileview.keking.cn%2Fzh-cn%2Findex.html "https://kkfileview.keking.cn/zh-cn/index.html")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！