---
author: "白哥学前端"
title: "如何使用jenkins搭建一个中小企业前端项目部署环境"
date: 2023-01-21
description: "文章内容传统发布和现在发布的对比和区别项目案例-手动上传服务器，使用jenkins上传服务器配置不同的发布环境配置域名配置https配置钉钉机器人通知服务器购买：抢占式实例Jenkin"
tags: ["前端","云原生","Jenkins"]
ShowReadingTime: "阅读5分钟"
weight: 85
---
**文章内容**

1.  传统发布和现在发布的对比和区别
2.  项目案例-手动上传服务器，使用jenkins上传服务器
3.  配置不同的发布环境
4.  配置域名
5.  配置https
6.  配置钉钉机器人通知

服务器购买：抢占式实例

**Jenkins 安装**
--------------

示例服务器为 阿里云 CentOS 服务器。**安全组中增加 8080 端口 Jenkins 默认占用** Jenkins 安装大体分两种方式，一种使用 Docker 另一种则是直接安装，示例选择后者。不管使用哪种方式安装，最终使用层面都是一样的。

Linux安装过程

bash

 代码解读

复制代码

`# 下载 Jenkins 资源 sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat/jenkins.repo # 这一步如果出现报错，使用下面的命令解决 sudo yum install -y ca-certificates # 获取并导入信任的包制作者的秘钥 sudo rpm --import https://pkg.jenkins.io/redhat/jenkins.io.key # 升级 yum 源中的所有包 sudo yum upgrade # Jenkins 依赖于 java 所以需要安装 JDK sudo yum install java-11-openjdk # 安装 Jenkins sudo yum install jenkins`

bash

 代码解读

复制代码

`# 启动 Jenkins 服务 systemctl start jenkins # 重启 Jenkins 服务 systemctl restart jenkins # 停止 Jenkins 服务 systemctl stop jenkins # 查看 Jenkins 服务状态 systemctl status jenkins`

启动过程稍微得等30s，启动服务后访问服务器地址 + 8080 端口（提前打开安全组8080），Jenkins 默认为 8080 端口。

登录页面 ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03ee0b1d369942e0bba8b11ba4ab418e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 查找密码:首次进入使用 cat /var/lib/jenkins/secrets/initialAdminPassword 查看密码。 ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/05561ac2f0a447ecb3746f18ccebc5a2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 选择推荐的插件，进行安装，安装过程稍长（5分钟以上） ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e3149366746411cb3aa20e21ef0f867~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 安装完成以后创建用户 ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee807bd4430c4d7caa1b1f4b3943d2a8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 账户：xiumubai 密码：\*\*\*\*\* 访问地址：[http://8.218.133.146:8080/](https://link.juejin.cn?target=http%3A%2F%2F8.218.133.146%3A8080%2F "http://8.218.133.146:8080/") 后面的步骤一下点下一步就行了，最后进入首页 ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e781b79bd7a44999b0b9f12f9907f10b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

构建目标：拉取 github 代码
-----------------

服务器要具备 git 环境。 yum install git 点击 **新建 Item** 创建一个 Freestyle Project 在 **源码管理** 处选择 git ，输入仓库地址，点击添加。 项目示例：[github.com/xiumubai/gu…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fxiumubai%2Fguigu-oa-web.git "https://github.com/xiumubai/guigu-oa-web.git") ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af50f808653749218cee56662c6cf8d8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 安装完成以后重启jenkins 然后到 **系统管理 -> 全局工具配置** 中配置 Node 因为我们的项目需要使用npm，所以需要node ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8186e31ca2f4310bc59765ad91857e4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 随后去修改刚才创建的任务。在 **构建环境** 中会多出一个选项 Provide Node & npm bin/ folder to PATH 勾选即可。 ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca9d7176032e4242a07632434af83ba5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 为了我们能够在github上拉取代码，需要我们添加`git token`，在github中添加一个token ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02e0823cc609425d94c7ffa6538e9f14~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 找到`系统设置`，找到`github`服务器，点击`添加` ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3123ae8c40e4652bd6de5d7f795fefb~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 类型选择`Secret text` ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc7ea99c70994d49831d746a263e39c2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 把刚生成的github token复制到这里，点击添加。 回到项目的设置中，找到`构建环境` ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b79f4525b16a41c5b00405dce9e69131~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 把我们刚才生成好的Secret text 选中即可。

然后在 `Build Steps` 中选择 **增加构建步骤 -> 执行 shell** 输入打包发布相关的命令。Jenkins 会逐行执行。

arduino

 代码解读

复制代码

`node -v npm -v rm -rf node_modules npm install npm run build`

**构建后操作** 构建完成以后，我们需要把构建的产物推送到我们的服务器，所以需要用到`ssh publisher`这个插件。 安装插件，`ssh publisher`，然后配置好要发布的服务器环境。 打开`系统设置`，找到`** **Publish over SSH` ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/faec0a560dc248078ef223c6a3416aa1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 配置好我们需要发布的服务器，这样才能连接上我们的服务器，推送代码。 回到任务的设置中，选择我们刚才配置好的服务器 ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7eba78898d7542e4940309e28573e13f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 上面需要填写好上传的文件和目标地址。 最后配置好nginx的地址即可。

ini

 代码解读

复制代码

`server {       listen       80;       listen       [::]:80;       server_name  _;       #root         /usr/share/nginx/html;     	# 这里是我们配置的服务器访问的静态页面路径       root          /www/oa-web;       # Load configuration files for the default server block.       include /etc/nginx/default.d/*.conf;       error_page 404 /404.html;       location = /404.html {       }       error_page 500 502 503 504 /50x.html;       location = /50x.html {       }   }`

配置完成以后，点击`立即构建`，等构建完毕以后，在浏览器中访问：[http://8.218.133.146](https://link.juejin.cn?target=http%3A%2F%2F8.218.133.146%2F%23%2F "http://8.218.133.146/#/")即可看到我们刚才部署好的页面了。

拉取github不同代码分支，发布不同的环境
----------------------

我们在选择部署的时候需要根据不同的分支去部署，然后部署到不同的环境 安装好`git paremeters`插件 然后配置参数 **配置分支参数** ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3edbd0a4c55e4262a87e384d223b39e4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) **配置选项参数** ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/360312c993164121980cd294946a619e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 配置完成以后，我们的构建页面就是这样的 ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d929466bcf34f63bcf0aa419a808d15~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 继续回到配置修改`源码管理` ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c0a2347a7f4451eb56c63e58798b5d8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 这里指定分支的时候就需要使用生命写好的参数`release` `构建后操作` ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7e78735ca0241cf85f6eacb45decbbb~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 这里的文件目录就需要根据env来配置，发布不同的环境，当打不以后，我们的目录就变成这样的了 ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56a9541a14254d1892d14944c1c9108f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 在oa-web下面会有`dev`和`pre`两个目录表示不同的环境，我们只要给这两个文件在nginx中配置不同的域名即可访问了。

配置域名
----

提前解析两个域名

 代码解读

复制代码

`pre.xiumubai.com dev.xiumubai.com`

配置nginx解析

ini

 代码解读

复制代码

`# 线上环境的配置 server {     listen       80;     listen       [::]:80;     server_name  pre.xiumubai.com;     #root         /usr/share/nginx/html;     root 	      /www/oa-web/pre;     # Load configuration files for the default server block.     include /etc/nginx/default.d/*.conf;     error_page 404 /404.html;     location = /404.html {     }     error_page 500 502 503 504 /50x.html;     location = /50x.html {     } } # 测试环境的配置 server {     listen       80;     listen       [::]:80;     server_name  dev.xiumubai.com;     #root         /usr/share/nginx/html;     root 	      /www/oa-web/dev;     # Load configuration files for the default server block.     include /etc/nginx/default.d/*.conf;     error_page 404 /404.html;     location = /404.html {     }     error_page 500 502 503 504 /50x.html;     location = /50x.html {     } }`

当部署成功以后，我们就可以使用 [pre.xiumubai.com/#/](https://link.juejin.cn?target=http%3A%2F%2Fpre.xiumubai.com%2F%23%2F "http://pre.xiumubai.com/#/")和[dev.xiumubai.com/#/](https://link.juejin.cn?target=http%3A%2F%2Fpre.xiumubai.com%2F%23%2F "http://pre.xiumubai.com/#/")来访问我们的项目了。

配置https
-------

需要去自己买个免费证书，绑定域名，然后下载好证书上传到服务器即可。

ini

 代码解读

复制代码

`server {         listen 443 ssl;         server_name  pre.xiumubai.com;          #这里是证书路径   	ssl_certificate  cert/pre.xiumubai.com.pem;           #这里是私钥路径   	ssl_certificate_key cert/pre.xiumubai.com.key; 	root 	      /www/oa-web/pre;         # Load configuration files for the default server block.         include /etc/nginx/default.d/*.conf;         error_page 404 /404.html;         location = /404.html {         }         error_page 500 502 503 504 /50x.html;         location = /50x.html {         }     }`

当我们使用[pre.xiumubai.com/#/](https://link.juejin.cn?target=https%3A%2F%2Fpre.xiumubai.com%2F%23%2F "https://pre.xiumubai.com/#/")访问的时候，浏览器会出现一个🔒 ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56876c5385c945db825606e3fbff2be5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)代表我们的https已经配置成功了。 再配置一下当我们访问[pre.xiumubai.com/#/](https://link.juejin.cn?target=https%3A%2F%2Fpre.xiumubai.com%2F%23%2F "https://pre.xiumubai.com/#/")强制跳转到了[pre.xiumubai.com/#/](https://link.juejin.cn?target=https%3A%2F%2Fpre.xiumubai.com%2F%23%2F "https://pre.xiumubai.com/#/")

ini

 代码解读

复制代码

`server {     listen       80;     listen       [::]:80;     server_name  pre.xiumubai.com; 		# 访问http的时候自动跳转到https 		rewrite ^(.*)$ https://$host$1 permanent;      }`

配置钉钉机器人
-------

在jenkins中安装插件`dingtalk`，在系统管理中，最下面找到`钉钉`，配置机器人消息 我们提前在钉钉群中添加一个机器人，然后复制`webhooks` 填写好名称和webhooks，点击测试，关键字要和添加钉钉机器人的关键字一样的。 ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/645140f7d0f345d2a4d3a8a5557d6933~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

然后提交即可。 回到我们的任务中的配置，添加钉钉机器人 ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca8f936a8c72498d90eac46fd55f9aed~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 当我们的任务构建以后，就会收到消息了。 ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5db8925acef94745901acc3cbca6986e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

执行条件判断
------

当我们在shell需要根据条件来判断执行不同的命令的时候，就可以这么写了，比如我现在需要在测试环境打包`npm run build:test`,线上环境打包`npm run buld`，可以这么写

bash

 代码解读

复制代码

`node -v rm -rf node_modules npm install if test $env = "test"; then     echo 'test' 	npm run build:test else 	echo 'prod' 	npm run build fi`

这样，我们就可以选择不同的环境，来部署代码了。

本期分享到这里就结束了，当然我们还有很多事情还需要做的，怎么把静态资源部署到CDN，怎么做回滚，怎么做灰度发布，负载均衡等等一系列，后面等研究明白了，再给大家分享。