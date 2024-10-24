---
author: "冴羽"
title: "VuePress 博客优化之开启 Gzip 压缩"
date: 2022-01-13
description: "前言 在 《一篇带你用 VuePress + Github Pages 搭建博客》中，我们使用 VuePress 搭建了一个博客，在 《一篇从购买服务器到部署博客代码的详细教程》中，我们将代码部署到服"
tags: ["前端","VuePress","Vue.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:22,comments:0,collects:5,views:1386,"
---
前言
--

在 [《一篇带你用 VuePress + Github Pages 搭建博客》](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F235 "https://github.com/mqyqingfeng/Blog/issues/235")中，我们使用 VuePress 搭建了一个博客，在 [《一篇从购买服务器到部署博客代码的详细教程》](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F243 "https://github.com/mqyqingfeng/Blog/issues/243")中，我们将代码部署到服务器上，最终的效果查看：[TypeScript 中文文档](https://link.juejin.cn?target=http%3A%2F%2Fts.yayujs.com%2F "http://ts.yayujs.com/")。今天我们来学习如何开启服务器的 Gzip 压缩。

Gzip 压缩
-------

关于 Gzip 压缩，引用 MDN 的[介绍](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FGlossary%2FGZip_compression "https://developer.mozilla.org/zh-CN/docs/Glossary/GZip_compression")：

> Gzip 是一种用于文件压缩与解压缩的文件格式。它基于 Deflate 算法，可将文件压缩地更小，从而实现更快的网络传输。 Web服务器与现代浏览器普遍地支持 Gzip，这意味着服务器可以在发送文件之前自动使用 Gzip 压缩文件，而浏览器可以在接收文件时自行解压缩文件。

而对于我们而言，开启 Gzip，不仅能提高网站打开速度，还能节约网站流量，像我购买的服务器是按照使用流量付费，开启 Gzip 就是在为自己省钱。

Nginx 与 Gzip
------------

Nginx 内置了 ngx\_http\_gzip\_module 模块，该模块会拦截请求，并对需要做 Gzip 压缩的文件做压缩。因为是内部集成，所以我们只用修改 Nginx 的配置，就可以直接开启。

```shell
# 登陆服务器
ssh -v root@8.147.xxx.xxx

# 进入 Nginx 目录
cd /etc/nginx

# 修改 Nginx 配置
vim nginx.conf
```

在 server 中添加 Gzip 压缩相关配置：

```nginx
    server {
    listen 443 ssl;
    server_name ts.yayujs.com;
    ssl_certificate cert/6982037_ts.yayujs.com.pem;
    ssl_certificate_key cert/6982037_ts.yayujs.com.key;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
        location ^~ /learn-typescript/ {
        alias /home/www/website/ts/;
    }
        location / {
        alias /home/www/website/ts/;
        index index.html;
    }
    # 这里是新增的 gzip 配置
    gzip on;
    gzip_min_length 1k;
    gzip_comp_level 6;
    gzip_types application/atom+xml application/geo+json application/javascript application/x-javascript application/json application/ld+json application/manifest+json application/rdf+xml application/rss+xml application/xhtml+xml application/xml font/eot font/otf font/ttf image/svg+xml text/css text/javascript text/plain text/xml;
}
```

这里简要介绍一下涉及到的配置项含义，更具体的可以查看 Nginx 官方文档里的[解释](https://link.juejin.cn?target=http%3A%2F%2Fnginx.org%2Fen%2Fdocs%2Fhttp%2Fngx_http_gzip_module.html "http://nginx.org/en/docs/http/ngx_http_gzip_module.html")：

1.  gzip ：是否开启 gzip 模块 on 表示开启 off 表示关闭，默认是 off
2.  gzip\_min\_length： 设置压缩的最小文件大小，小于该设置值的文件将不会压缩
3.  gzip\_comp\_level： 压缩级别，从 1 到 9，默认 1，数字越大压缩效果越好，但也会越占用 CPU 时间，这里选了一个常见的折中值
4.  gzip\_types：进行压缩的文件类型

修改完后，不要忘记重新加载一次 Nginx 配置：

```shell
systemctl reload nginx
```

验证
--

第一种方式是直接查看网络请求，打开浏览器的调试工具，查看 `Network` 请求，如果请求响应头的 `Content-Encoding` 字段为 `gzip`，就表示成功开启了 Gzip：

![image.png](/images/jueJin/71444e09a87d435.png)

第二种方式是通过站长工具验证，打开[网页GZIP压缩检测](https://link.juejin.cn?target=https%3A%2F%2Ftool.chinaz.com%2Fgzips%2F "https://tool.chinaz.com/gzips/")，输入网站，进行查询：

![image.png](/images/jueJin/dbb6379c93774cf.png)

效果
--

我们以[「基础」](https://link.juejin.cn?target=http%3A%2F%2Fts.yayujs.com%2Flearn-typescript%2Fhandbook%2FTheBasics.html%23%25E5%259F%25BA%25E7%25A1%2580-the-basics "http://ts.yayujs.com/learn-typescript/handbook/TheBasics.html#%E5%9F%BA%E7%A1%80-the-basics")章节页面为例，这是开启 Gzip 压缩前的截图：

![image.png](/images/jueJin/04646f19b23d4bb.png)

我们可以看到传输大小为 2.2M，用时 14.53s。

这是开启 Gzip 压缩后的截图：

![image.png](/images/jueJin/ad68561d6c12413.png)

我们可以看到传输大小为 526 K，用时 1.27s，可以看到资源大小、加载速度都得到了大幅的提升。

系列文章
----

博客搭建系列是我至今写的唯一一个偏实战的系列教程，讲解如何使用 VuePress 搭建博客，并部署到 GitHub、Gitee、个人服务器等平台。

1.  [一篇带你用 VuePress + GitHub Pages 搭建博客](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F235 "https://github.com/mqyqingfeng/Blog/issues/235")
2.  [一篇教你代码同步 GitHub 和 Gitee](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F236 "https://github.com/mqyqingfeng/Blog/issues/236")
3.  [还不会用 GitHub Actions ？看看这篇](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F237 "https://github.com/mqyqingfeng/Blog/issues/237")
4.  [Gitee 如何自动部署 Pages？还是用 GitHub Actions!](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F238 "https://github.com/mqyqingfeng/Blog/issues/238")
5.  [一份前端够用的 Linux 命令](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F239 "https://github.com/mqyqingfeng/Blog/issues/239")
6.  [一份简单够用的 Nginx Location 配置讲解](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F242 "https://github.com/mqyqingfeng/Blog/issues/242")
7.  [一篇从购买服务器到部署博客代码的详细教程](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F243 "https://github.com/mqyqingfeng/Blog/issues/243")
8.  [一篇域名从购买到备案到解析的详细教程](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F247 "https://github.com/mqyqingfeng/Blog/issues/247")
9.  [VuePress 博客优化之 last updated 最后更新时间如何设置](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F244 "https://github.com/mqyqingfeng/Blog/issues/244")
10.  [VuePress 博客优化之添加数据统计功能](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F245 "https://github.com/mqyqingfeng/Blog/issues/245")
11.  [VuePress 博客优化之开启 HTTPS](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F246 "https://github.com/mqyqingfeng/Blog/issues/246")

微信：「mqyqingfeng」，加我进冴羽唯一的读者群。

如果有错误或者不严谨的地方，请务必给予指正，十分感谢。如果喜欢或者 有所启发，欢迎 star，对作者也是一种鼓励。