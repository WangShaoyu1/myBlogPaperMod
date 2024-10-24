---
author: "Gaby"
title: "阿里云服务器CentOS升级openssl"
date: 2022-06-25
description: "阿里云服务器 CentOS6默认openssl版本是2013年发布的101，这里，我们需要升级到2021发布的openssl 111k版本。"
tags: ["CentOS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:6,comments:0,collects:2,views:1699,"
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第26天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

废话只说一句：码字不易求个👍，收藏 === 学会,快行动起来吧！🙇‍🙇‍🙇‍。

阿里云服务器 CentOS6默认openssl版本是2013年发布的1.0.1，这里，我们需要升级到2021发布的openssl 1.1.1k版本。

最新稳定版为1.1.1系列。这也是我们的长期支持 (LTS) 版本，支持到 2023 年 9 月 11 日。所有旧版本（包括 1.1.0、1.0.2、1.0.0 和 0.9.8）现在都不再支持，不应使用。鼓励这些旧版本的用户尽快升级到 1.1.1。

可以通过下面的地址下载之后，通过FTP工具上传到服务器 下载地址：[openssl-1.1.1k.tar.gz](https://link.juejin.cn?target=https%3A%2F%2Fwww.openssl.org%2Fsource%2Fopenssl-1.1.1k.tar.gz "https://www.openssl.org/source/openssl-1.1.1k.tar.gz")

总结：莫要在网上一顿乱搜然后各种试，要看清楚每个文档中的安装路径版本等是否一致，不同的版本及路径安装命令也是有所不同的，请甄别对待；不要直接使用yum卸载openssl，会删除系统命令。

[yum remove openssl惨痛教训](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fweixin_34109408%2Farticle%2Fdetails%2F92694678 "https://blog.csdn.net/weixin_34109408/article/details/92694678")

### 安装

```js
//环境 CentOS Linux release 7.7.1908 (Core)
cat /etc/redhat-release

//查看Openssl路径
which openssl

//1.下载openssl安装包
wget https://www.openssl.org/source/openssl-1.1.1k.tar.gz

//2.解压
tar zxvf openssl-1.1.1k.tar.gz

//3.进到 redis目录
cd openssl-1.1.1k

//4.编译,解压并进入解压目录后执行：
./config --prefix=/usr/local/openssl shared zlib

//5.安装
make && make install

//6.备份当前Openssl
mv /usr/bin/openssl /usr/bin/openssl.bak
mv /usr/include/openssl /usr/include/openssl.bak

//7.使用新版Openssl
ln -s /usr/local/openssl/bin/openssl /usr/bin/openssl
ln -s /usr/local/openssl/include/openssl /usr/include/openssl

//8.更新动态链接库数据
echo "/usr/local/openssl/lib" >> /etc/ld.so.conf

//9.重新加载动态链接库
ldconfig -v

//10.查看安装完成后的最新版本
openssl version
openssl version –a

//安装完成，测试一切正常后，删除原有备份
rm -rf /usr/bin/openssl.bak
rm -rf /usr/include/openssl.bak
```

这里找了份一键升级的脚本供小伙伴们参考...

### 集群openssl一键升级脚本

```js
#!/bin/bash
#变量准备
hosts=`cat /etc/hosts | awk '$3~/(z|d|m)[0-9]/ {print $1}' | grep -v '159\|160\|161'`
echo '目标hosts：'$hosts
#分发安装包、安装gcc
for i in $hosts
do
ssh $i 'mkdir -p /opt/insfiles/openssl_insfiles;yum install -y gcc'
scp /opt/insfiles/openssl_insfiles/openssl-1.1.1i.tar.gz* $i:/opt/insfiles/openssl_insfiles/
echo $i'分发安装包、安装gcc完成'
#解压、编译安装、设为默认ssl工具
for i in $hosts
do
ssh $i <<EOF
tar -zxvf /opt/insfiles/openssl_insfiles/openssl-1.1.1i.tar.gz -C /opt/insfiles/openssl_insfiles/
cd /opt/insfiles/openssl_insfiles/openssl-1.1.1i
./config --prefix=/usr/local/openssl shared zlib
make depend
make & make install
mv /usr/bin/openssl /usr/bin/openssl.bak
mv /usr/include/openssl /usr/include/openssl.bak
ln -s /usr/local/openssl/bin/openssl /usr/bin/openssl
ln -s /usr/local/openssl/include/openssl /usr/include/openssl
echo "/usr/local/openssl/lib" >> /etc/ld.so.conf
ldconfig -v
openssl version -a
EOF
echo $i'升级、部署完成'
done
```