---
author: "王宇"
title: "向量模型GPU支持镜像制作"
date: 八月21,2024
description: "知识插件"
tags: ["知识插件"]
ShowReadingTime: "12s"
weight: 701
---
1、使用基础镜像启动一个容器：[nvcr.io/nvidia/cuda:12.2.0-runtime-ubuntu20.04](http://nvcr.io/nvidia/cuda:12.2.0-runtime-ubuntu20.04)  
2、更新、安装依赖、选择时区、安装基础包  
apt update  
apt -y upgrade  
apt install build-essential zlib1g-dev libffi-dev libssl-dev libreoffice -y  
apt install ca-certificates apt-transport-https software-properties-common lsb-release -y  
apt-get -y install $(grep -vE "^\\s\*#" /tmp/base\_requirements.txt | tr "\\r\\n" " ")

[base\_requirements.txt](/download/attachments/129201167/base_requirements.txt?version=1&modificationDate=1724212768527&api=v2)  
3、下载 Python 3.11 源代码、配置、编译并安装  
离线下载python3.11包：[https://www.python.org/ftp/python/3.11.6/Python-3.11.6.tgz](https://www.python.org/ftp/python/3.11.6/Python-3.11.6.tgz)  
tar -xzvf Python-3.11.6.tgz  
cd Python-3.11.6  
\# 在配置文件时通过--prefix指定安装路径  
\# mkdir /usr/local/python3.11  
\# ./configure --prefix=/usr/local/python3.11  
./configure  
./configure --enable-optimizations # 执行后无序额外配置可直接使用python3调用python编辑器  
make && make install  
4、验证安装、修改软链接  
python3.11 --version  
python3 --version  
pip3 --version  
which python3  
\# rm -rf /usr/local/bin/python  
ln -s /usr/local/bin/python3.11 /usr/local/bin/python  
\# 升级pip版本  
pip3 install --upgrade pip  
5、清除安装包  
rm -r Python-3.11.6.tgz  
rm -r Python-3.11.6  
6、安装指定版本的pytorch（安装太慢可在对应网址下载后离线安装）  
\# pip install torch==2.1.0 --index-url [https://download.pytorch.org/whl/cu121](https://download.pytorch.org/whl/cu121)  
\# pip install torch==2.1.0 -f [https://download.pytorch.org/whl/cu121/torch\_stable.html](https://download.pytorch.org/whl/cu121/torch_stable.html)  
pip install torch-2.1.0+cu121-cp311-cp311-linux\_x86\_64.whl  
pip install numpy==1.24.4 -i [https://mirrors.aliyun.com/pypi/simple/](https://mirrors.aliyun.com/pypi/simple/) --trusted-host [mirrors.aliyun.com/pypi](http://mirrors.aliyun.com/pypi)  
7、验证是否安装成功  
python3  
import torch  
torch.cuda.is\_available() # 成功返回true

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)