---
author: "爱吃美子的云_JAVA"
title: "【内网穿透】NATAPP是一个基于ngrok的内网穿透工具"
date: 2024-06-28
description: "NATAPP是一个基于ngrok的内网穿透工具，旨在提供安全、高效的内网映射服务。概述内网穿透技术通过打通内外网络壁垒，让外部网络能够访问到内网资源，解决了很多开发和测试中的痛点。NATAPP作为"
tags: ["后端"]
ShowReadingTime: "阅读4分钟"
weight: 448
---
**NATAPP是一个基于ngrok的内网穿透工具，旨在提供安全、高效的内网映射服务**。

**概述**

内网穿透技术通过打通内外网络壁垒，让外部网络能够访问到内网资源，解决了很多开发和测试中的痛点。NATAPP作为一个国内知名的内网穿透工具，提供了多种隧道类型和灵活的配置选项，能够满足不同用户的需求。同时，其安全性和易用性也得到了用户的广泛认可。

### 下载地址：[natapp.cn/#download](https://link.juejin.cn?target=https%3A%2F%2Fnatapp.cn%2F%23download "https://natapp.cn/#download")

### NATAPP1分钟快速新手图文教程

[natapp.cn/article/nat…](https://link.juejin.cn?target=https%3A%2F%2Fnatapp.cn%2Farticle%2Fnatapp_newbie "https://natapp.cn/article/natapp_newbie")

1.  首先在本站注册账号 [点击注册](https://link.juejin.cn?target=https%3A%2F%2Fnatapp.cn%2Fregister "https://natapp.cn/register")
2.  登录后,点击左边 购买隧道,免费/付费均可  
    ![blob.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/05c9b51ba6f641bc9d8020639ac8220a~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1068&h=376&s=270858&e=png&b=f9f8f7 "1484720646741386.png")
3.  根据需要选择隧道协议 ，隧道协议有WEB\\TCP\\UDP
    *   WEB 应用于网站类
    *   TCP 应用于SSH 等

6.下载之后,解压至任意目录,得到natapp.exe (linux下无需解压,直接 wget)

7.**取得authtoken** 在网站后台,我的隧道处,可以看到刚才购买的隧道

点击复制,即可得到 authtoken 这个authtoken便是您的隧道登录凭证

### 8.**运行natapp**

#### windows natapp支持两种运行方式

a) config.ini方式 (推荐)  
根据操作系统下载不同的config.ini文件到刚才下载的natapp.exe，同级目录配置; windows下,直接双击natapp.exe 即可. 配置内容

ini

 代码解读

复制代码

`#将本文件放置于natapp同级目录 程序将读取 [default] 段 #在命令行参数模式如 natapp -authtoken=xxx 等相同参数将会覆盖掉此配置 #命令行参数 -config= 可以指定任意config.ini文件 [default] authtoken=08dae608dae608dae6 clienttoken= log=stdout loglevel=INFO http_proxy=`

b) cmd -authtoken= 参数方式运行.  
windows ,点击开始->运行->命令行提示符 后进入 natapp.exe的目录  

authtoken=9ab6b9040a...

 代码解读

复制代码

运行结果：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/735480e011ae4824ad6e2a8a2f9305af~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=864&h=114&s=14543&e=png&b=0e0e0e)

#### linux natapp运行方式

[natapp.cn/article/noh…](https://link.juejin.cn?target=https%3A%2F%2Fnatapp.cn%2Farticle%2Fnohup "https://natapp.cn/article/nohup") linux 给予可执行权限之后,运行

bash

 代码解读

复制代码

      `chmod a+x natapp`

如 我们将natapp放在 /usr/local/natapp/ 下

cd /usr/local/natapp

 然后运行

./natapp -authtoken=xxxxx ./natapp -authtoken=9ab6b9040a624f40

正常运行如下 ![blob.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5754fbb4b066437eaa177637432edd73~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=746&h=271&s=25894&e=png&b=000000 "1498660977314858.png")

这是,如果关掉窗口,就是关掉了natapp程序,所以会掉线.

利用 nohup 实现natapp(ngrok)后台运行方法 , 具体建立截图 制作 shell 脚本启动

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2a4655984c54c15adc5d7cf5cc528bb~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=939&h=474&s=141573&e=png&b=2d2e28)

很简单,运行

bash

 代码解读

复制代码

`nohup ./natapp -authtoken=xxxx -log=stdout &`

注意一定要加上 -log=stdout

运行如图  
![blob.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e066635a2fe44aa88e92aac944cc8c5~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=857&h=139&s=15321&e=png&b=000000 "1498662271447463.png") 此时,按Ctrl+C 退出,或者直接关闭窗口都可以.

另开一个窗口检查一下

perl

 代码解读

复制代码

`ps -ef|grep natapp`

![blob.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85bf0a7f1b08461f86c108d13d87a1a7~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=740&h=132&s=16797&e=png&b=000000 "1498662709732633.png")

可以看到natapp进程代表运行成功!如果运行了多次,则会出现多个natapp进程,需要结束进程.下面 那个 2790的,代表查找程序本身,忽略掉. 找到natapp进程的pid 2777 ,如果要结束进程,运行

bash

 代码解读

复制代码

`kill -9 2777`

nohup 默认会在当前目录 创建 nohup.out 文件,会记录natapp运行日志,为避免日志过大,可以将日志等级降低 如

bash

 代码解读

复制代码

`nohup ./natapp -authtoken=xxx -log=stdout -loglevel=ERROR &`

#### SSH 连接注意事项

*   在Linux系统中 需要检查DNS 配置是否正确

运行以下命令来查看当前的DNS服务器设置：

bash

 代码解读

复制代码

`cat /etc/resolv.conf`

如果你看到`nameserver 114.114.114.114`或`nameserver 223.5.5.5`，这表明已经设置为114DNS或阿里DNS。否则需要增加 vi /etc/resolv.conf

 代码解读

复制代码

`nameserver 114.114.114.114 nameserver 223.5.5.5`

*   在Windows系统中：

打开命令提示符并运行以下命令：

bash

 代码解读

复制代码

`ipconfig /all`

在输出中查找`DNS Servers`字段。如果你看到`114.114.114.114`或`223.5.5.5`，则已经设置为114DNS或阿里DNS。

*   检查防火墙 1: vi /etc/hosts.allow 2: 添加配置项： sshd: ALL 3: systemctl restart sshd

成功截图

js

 代码解读

复制代码

`~ /all: error fetching interface information: Device not found [root@centos7 ~]# ssh root@server.natappfree.cc -p 36428 The authenticity of host '[server.natappfree.cc]:36428 ([112.xx.xx.58]:36428)' can't be established. ECDSA key fingerprint is SHA256:Z1rsDzcxxQFA4Znih26xP7V+NjM. ECDSA key fingerprint is MD5:93:46:21:99:axx:77:9b:11:65:b5:38:87:3c:89:b5:6f. Are you sure you want to continue connecting (yes/no)? yes Warning: Permanently added '[server.natappfree.cc]:36xx8,[1xx.7xx.89.58]:3xx28' (ECDSA) to the list of known hosts. root@server.natappfree.cc's password:  Last login: Fri Jun 28 00:09:09 2024 from 192.168.101.11 [root@centos7 ~]#  [root@centos7 ~]#`