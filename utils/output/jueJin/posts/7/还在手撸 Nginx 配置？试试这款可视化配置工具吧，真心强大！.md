---
author: "MacroZheng"
title: "还在手撸 Nginx 配置？试试这款可视化配置工具吧，真心强大！"
date: 2022-04-26
description: "在我使用Nginx的过程中，一直觉得它的配置很麻烦，尤其是在Linux服务器上用vim手撸配置的时候！最近发现一款开源的Nginx可视化配置工具，能轻松生成Nginx配置，推荐给大家！"
tags: ["后端","Java","Nginx中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:129,comments:12,collects:271,views:19525,"
---
> Nginx是一款非常流行的Web服务器，作为程序员我相信大家没少和它打交道。在我使用Nginx的过程中，一直觉得它的配置很麻烦，尤其是在Linux服务器上用vim手撸配置的时候！最近发现一款开源的Nginx可视化配置工具`NginxConfig`，能轻松生成Nginx配置，推荐给大家！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

NginxConfig简介
-------------

`NginxConfig`号称**你唯一需要的Nginx配置工具**，可以使用可视化界面来生成Nginx配置，功能非常强大，在Github上已有`15K+Star`！

![](/images/jueJin/4dfdc019f88e4b4.png)

下面是NginxConfig使用过程中的一张效果图，大家可以看下！

![](/images/jueJin/cc4c1fb5ee5f494.png)

安装
--

> 接下来介绍下`NginxConfig`的安装，在Linux上安装它还是比较方便的。

### 安装Node.js

> 由于`NginxConfig`是一个基于Vue的前端项目，我们首先得安装`Node.js`。

*   首先从官网下载`Node.js`的安装包，下载地址：[nodejs.org/zh-cn/downl…](https://link.juejin.cn?target=https%3A%2F%2Fnodejs.org%2Fzh-cn%2Fdownload%2F "https://nodejs.org/zh-cn/download/")

![](/images/jueJin/db086595f60140f.png)

*   下载成功后将安装包解压到`/usr/local/src/`目录下，使用如下命令即可；

```bash
cd /usr/local/src/
tar xf node-v16.14.2-linux-x64.tar.xz
cd node-v16.14.2-linux-x64/
./bin/node -v
```

*   使用`./bin/node -v`命令可查看当前安装版本；

![](/images/jueJin/daf99a5fa50343d.png)

*   如果想在Linux命令行中直接运行，还需对`node`和`npm`命令创建软链接；

```bash
ln -s /usr/local/src/node-v16.14.2-linux-x64/bin/node /usr/bin/node
ln -s /usr/local/src/node-v16.14.2-linux-x64/bin/npm /usr/bin/npm
node -v
npm -v
```

*   创建完成后使用命令查看版本，至此`Node.js`安装完成。

![](/images/jueJin/8b7ca1317d0d47b.png)

### 安装NginxConfig

> `Node.js`安装完成后，就可以开始安装`NginxConfig`了。

*   首先下载`NginxConfig`的安装包，下载地址：[github.com/digitalocea…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdigitalocean%2Fnginxconfig.io "https://github.com/digitalocean/nginxconfig.io")

![](/images/jueJin/904f7f01aab1491.png)

*   下载完成后解压到指定目录，并使用`npm`命令安装依赖并运行；

```bash
tar -zxvf nginxconfig.io-master.tar.gz
npm install
npm run dev
```

*   `NginxConfig`运行成功后就可以直接访问了，看下界面支持中文还是挺不错的，访问地址：[http://192.168.3.105:8080](https://link.juejin.cn?target=http%3A%2F%2F192.168.3.105%3A8080 "http://192.168.3.105:8080")

![](/images/jueJin/e669d8753fb4427.png)

使用
--

> 接下来我们就体验下`NginxConfig`的可视化配置生成功能，看看是不是够强大！

### 使用准备

*   首先我们需要安装Nginx，Nginx的安装可以参考之前写的[Nginx使用教程](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2F9VZi2suAlomu1IRGy-qdCA "https://mp.weixin.qq.com/s/9VZi2suAlomu1IRGy-qdCA") ；
    
*   我们将实现如下功能，通过静态代理访问在不同目录下的静态网站，通过动态代理来访问SpringBoot提供的API接口；
    

```bash
# 静态代理，访问mall文档网站
docs.macrozheng.com
# 静态代理，访问mall前端项目
mall.macrozheng.com
# 动态代理，访问mall线上API
api.macrozheng.com
```

*   需要提前修改下本机host文件。

```
192.168.3.105 docs.macrozheng.com
192.168.3.105 mall.macrozheng.com
192.168.3.105 api.macrozheng.com
```

### 文档网站配置

> 我们先来配置下[mall](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")文档网站的访问，域名为：docs.macrozheng.com。

*   在`NginxConfig`中选择好`预设`为前端，然后修改服务配置，配置好站点、路径和运行目录；

![](/images/jueJin/bc7889933242465.png)

*   不需要HTTPS的话可以选择不启用；

![](/images/jueJin/a034bcd9cf14481.png)

*   然后在`全局配置->安全`中去除`Content-Security-Policy`设置；

![](/images/jueJin/08cff72693ed4b7.png)

*   再修改`性能`配置，开启Gzip压缩，删除资源有效期限制。

![](/images/jueJin/f24eeafd51a449a.png)

### 前端网站配置

> 再来配置下[mall](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")前端网站的访问，域名为：mall.macrozheng.com。

*   接下来我们再添加一个站点，修改下服务配置即可，其他和上面的基本一致。

![](/images/jueJin/5943e262ed834cf.png)

### API网站配置

> 最后配置下[mall](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")的Swagger API文档网站的访问，域名为：api.macrozheng.com。

*   继续添加一个站点，修改服务配置，只需修改站点名称即可；

![](/images/jueJin/5aac9531301c483.png)

*   然后启用反向代理并设置，反向代理到线上API；

![](/images/jueJin/03eea4699cb2450.png)

*   路由功能暂时不用可以关闭。

![](/images/jueJin/557681ba7a484d0.png)

### 使用配置

*   接下来我们就可以直接下载`NginxConfig`给我们生成好的配置了；

![](/images/jueJin/e05bdb018a614ba.png)

*   我们先来看下`NginxConfig`给我们生成的配置内容，这种配置手写估计要好一会吧；

![](/images/jueJin/e0e41db4dcd4497.png)

*   点击按钮下载配置，完成后改个名字，然后上传到Linux服务器的Nginx配置目录下，使用如下命令解压；

```bash
tar -zxvf nginxconfig.io.tar.gz
```

*   大家可以看到`NginxConfig`将为我们生成如下配置文件；

![](/images/jueJin/ec081dfa5b8a4e3.png)

*   接下来将我们之前的mall文档网站和mall前端网站放到Nginx的html目录下，然后重启Nginx就可以查看效果了；

```bash
docker restart nginx
```

*   先访问下我们的mall文档网站，访问地址：[docs.macrozheng.com](https://link.juejin.cn?target=http%3A%2F%2Fdocs.macrozheng.com "http://docs.macrozheng.com")

![](/images/jueJin/b8e252481a71472.png)

*   在访问下mall的前端网站，访问地址：[mall.macrozheng.com](https://link.juejin.cn?target=http%3A%2F%2Fmall.macrozheng.com "http://mall.macrozheng.com")

![](/images/jueJin/1090d1a057d741b.png)

*   最后访问下mall的API文档网站，访问地址：[api.macrozheng.com/swagger-ui.…](https://link.juejin.cn?target=http%3A%2F%2Fapi.macrozheng.com%2Fswagger-ui.html "http://api.macrozheng.com/swagger-ui.html")

![](/images/jueJin/09e30005787645d.png)

总结
--

体验了一把`NginxConfig`的配置生成功能，这种不用手写配置，直接通过可视化界面来生成配置的方式确实很好用。`NginxConfig`不愧是配置高性能、安全、稳定的NgInx服务器的最简单方法！

项目地址
----

[github.com/digitalocea…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdigitalocean%2Fnginxconfig.io "https://github.com/digitalocean/nginxconfig.io")