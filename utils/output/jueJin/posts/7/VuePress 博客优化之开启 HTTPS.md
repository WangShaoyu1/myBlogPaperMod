---
author: "冴羽"
title: "VuePress 博客优化之开启 HTTPS"
date: 2022-01-11
description: "前言 在 《一篇带你用 VuePress + Github Pages 搭建博客》中，我们使用 VuePress 搭建了一个博客，最终的效果查看：TypeScript4 中文文档。 注意此时，我们的域"
tags: ["前端","Vue.js","VuePress中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:28,comments:9,collects:8,views:1059,"
---
前言
--

在 [《一篇带你用 VuePress + Github Pages 搭建博客》](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F235 "https://github.com/mqyqingfeng/Blog/issues/235")中，我们使用 VuePress 搭建了一个博客，最终的效果查看：[TypeScript4 中文文档](https://link.juejin.cn?target=http%3A%2F%2Fts.yayujs.com%2F "http://ts.yayujs.com/")。

注意此时，我们的域名还是 [ts.yayujs.com](https://link.juejin.cn?target=http%3A%2F%2Fts.yayujs.com%2F "http://ts.yayujs.com/")，众所周知，开启 HTTPS 有很多好处，比如可以实现数据加密传输等，那我们如何开启 HTTPS 配置呢？

1\. 购买证书
--------

阿里云提供了免费证书可以使用，在每个自然年内，都可以通过 SSL 证书服务一次性申领 20 张免费证书。

### 1.1 购买证书

访问[云盾证书服务购买页](https://link.juejin.cn?target=https%3A%2F%2Fcommon-buy.aliyun.com%2F%3FcommodityCode%3Dcas_dv_public_cn%26request%3D%257B%2522product%2522%3A%2522cert_product%2522%2C%2522domain%2522%3A%2522all%2522%2C%2522productCode%2522%3A%2522symantec-dv-1-starter%2522%257D "https://common-buy.aliyun.com/?commodityCode=cas_dv_public_cn&request=%7B%22product%22:%22cert_product%22,%22domain%22:%22all%22,%22productCode%22:%22symantec-dv-1-starter%22%7D")，选择 「DV 单域名证书（免费试用）」，按照提示下单购买（订单价格为 0 元）。

![image.png](/images/jueJin/732e0469b9ff4c6.png)

### 1.2 创建证书

登录 [SSL证书控制台](https://link.juejin.cn?target=https%3A%2F%2Fyundunnext.console.aliyun.com%2F%3Fspm%3Da2c4g.11186623.0.0.1d98158eby7LBX%26p%3Dcas "https://yundunnext.console.aliyun.com/?spm=a2c4g.11186623.0.0.1d98158eby7LBX&p=cas")，选择 「SSL 证书」 - 「免费证书」，点击「创建证书」，就会自动创建一个证书：

![image.png](/images/jueJin/33e82e07067b417.png)

### 1.3 证书申请

在新创建的证书上，点击 「证书申请」，填写以下信息：

![image.png](/images/jueJin/6d2118a2c4eb4e8.png)

注意免费证书绑定的域名，只能是普通域名，比如 `ts.yayujs.com` 或者 `yayujs.com`，所谓通配符域名，就是指以 \*. 号开头的域名，比如 `*.yayujs.com`：

![image.png](/images/jueJin/242fc068e0a34e2.png)

注意 `xxx.com` 和 `www.xxx.com`，申请一个域名就行。

填写完后，进入申请第二步，验证信息：

![image.png](/images/jueJin/56dfdbb8221c43e.png)

点击 「验证」，会出现：

![image.png](/images/jueJin/ccce188e23c849f.png)

接下来提交审核，会出现提示：

![image.png](/images/jueJin/d8449ad2a4604f6.png)

实际上，不需要等邮件，很快证书状态就会变为「已签发」，此时就可以接着操作了。

![image.png](/images/jueJin/41868eaaca4a485.png)

2\. 安装证书
--------

### 2.1 下载证书

证书状态变为 「已签发」后，点击「下载」：

![image.png](/images/jueJin/1b4a4cb7f6ff4c9.png)

然后根据 Web 服务器的类型，下载对应格式的证书文件，这里我们选择 Nginx 进行下载：

![image.png](/images/jueJin/f79d08d28376464.png)

像我下载的就是一个名为 `6982037_ts.yayujs.com_nginx` 的 `zip` 压缩包，本地解压后，是一个文件夹，里面有两个文件：

*   6982037\_ts.yayujs.com.key
*   6982037\_ts.yayujs.com.pem

### 2.2 上传证书

接下来我们要做的就是将下载的证书文件上传到 Web 服务器，并修改服务器的相关配置，开启 HTTPS 监听。

我们先登上服务器，创建一个文件夹存放证书文件：

```shell
# 登陆服务器
ssh -v root@8.141.xxx.xxx

# 进入 nginx 配置目录
cd /etc/nginx

# 创建目录存放证书
mkdir cert
```

然后上传下载好的证书文件到服务器上，这里使用 Linux 的 `scp`命令上传：

`scp`命令的语法为：

```bash
scp [可选参数] file_source file_target
```

在本地起一个命令行，然后执行：

```nginx
scp ~/desktop/6982037_ts.yayujs.com_nginx/6982037_ts.yayujs.com.key root@8.141.xxx.xxx:/etc/nginx/cert
scp ~/desktop/6982037_ts.yayujs.com_nginx/6982037_ts.yayujs.com.pem root@8.141.xxx.xxx:/etc/nginx/cert
```

再在服务器上查看是否成功上传：

```shell
[root@iZ2ze nginx]# cd cert/
[root@iZ2ze cert]# ls
[root@iZ2ze cert]# ls
6982037_ts.yayujs.com.key  6982037_ts.yayujs.com.pem
```

### 2.3 修改配置

接下来我们修改 Nginx 配置：

```bash
vim /etc/nginx/nginx.conf
```

在 http 下新建一个 server：

```nginx
    server {
    listen 443 ssl;
    server_name ts.yayujs.com; #替换成证书绑定的域名。
    ssl_certificate cert/6982037_ts.yayujs.com.pem;  #替换成已上传的证书文件的目录和名称。
    ssl_certificate_key cert/6982037_ts.yayujs.com.key; #替换成已上传的证书私钥文件的目录和名称。
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
}
```

注意我们修改完后，别忘了重新加载一下 nginx 配置：

```shell
systemctl reload nginx
```

### 2.4 http 重定向

对于原本的 http 请求，我们可以写一个 rewrite 语句，重定向所有的 http 请求到 https 请求：

```nginx
    server {
    listen       80 default_server;
    listen       [::]:80 default_server;
    server_name  _;
    rewrite ^(.*)$ https://$host$1;
    
        location ^~ /learn-typescript/ {
        alias /home/www/website/ts/;
    }
    
        location / {
        alias /home/www/website/ts/;
        index index.html;
    }
}
```

### 2.5 开启端口

阿里云服务器，默认没有开启 HTTPS 监听的 443 端口，所以我们需要 [ECS管理控制台](https://link.juejin.cn?target=https%3A%2F%2Fecs.console.aliyun.com%2F%3Fspm%3Da2c4g.11186623.0.0.32cc3103FVUJPR "https://ecs.console.aliyun.com/?spm=a2c4g.11186623.0.0.32cc3103FVUJPR")的 「安全组」页面，开放 443 端口：

![image.png](/images/jueJin/1b188645aced461.png)

### 2.6 验证

现在，我们访问一下证书绑定的域名，这里是`https://ts.yayujs.com`，如果网页地址栏出现小锁标志，表示证书已经安装成功：

![image.png](/images/jueJin/740a8f8270a74fb.png)

系列文章
----

博客搭建系列是我至今写的唯一一个偏实战的系列教程，讲解如何使用 VuePress 搭建博客，并部署到 GitHub、Gitee、个人服务器等平台。

1.  [一篇带你用 VuePress + GitHub Pages 搭建博客](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F235 "https://github.com/mqyqingfeng/Blog/issues/235")
2.  [一篇教你代码同步 GitHub 和 Gitee](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F236 "https://github.com/mqyqingfeng/Blog/issues/236")
3.  [还不会用 GitHub Actions ？看看这篇](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F237 "https://github.com/mqyqingfeng/Blog/issues/237")
4.  [Gitee 如何自动部署 Pages？还是用 GitHub Actions!](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F238 "https://github.com/mqyqingfeng/Blog/issues/238")
5.  [一份前端够用的 Linux 命令](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F239 "https://github.com/mqyqingfeng/Blog/issues/239")
6.  [一份简单够用的 Nginx Location 配置讲解](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F242 "https://github.com/mqyqingfeng/Blog/issues/242")
7.  [一篇教你博客如何部署到自己的服务器](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F243 "https://github.com/mqyqingfeng/Blog/issues/243")
8.  [VuePress 博客优化之 last updated 最后更新时间如何设置](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F244 "https://github.com/mqyqingfeng/Blog/issues/244")
9.  [VuePress 博客优化之添加数据统计功能](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F245 "https://github.com/mqyqingfeng/Blog/issues/245")

微信：「mqyqingfeng」，加我进冴羽唯一的读者群。

如果有错误或者不严谨的地方，请务必给予指正，十分感谢。如果喜欢或者 有所启发，欢迎 star，对作者也是一种鼓励。