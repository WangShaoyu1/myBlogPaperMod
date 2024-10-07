---
author: "moonsquare"
title: "阿里云上k8s一步一步搭建"
date: 2024-07-25
description: "总体步骤按照kairen的博客来操作但由于国内及阿里云的特殊环境，有所调整后续，下面把调整的部分进行整理"
tags: ["Kubernetes"]
ShowReadingTime: "阅读2分钟"
weight: 765
---
总体步骤按照kairen的博客来操作但由于国内及阿里云的特殊环境，有所调整后续，下面把调整的部分进行整理

**基础环境配置**
----------

更改主机名  
`hostnamectl set-hostname k8s-m`

安装nfs-utils,为了挂载nas，此步骤不是必须，主要是为了共享一些文件

shell

 代码解读

复制代码

`$ yum install -y nfs-utils $ vim /etc/fstab 141974a349-ddf37.cn-beijing.nas.aliyuncs.com:/  /nas_data nfs4 nolock  0       0 $ mount -a`

安装daocker-ce，使用阿里云的镜像来安装，速度快

shell

 代码解读

复制代码

`$ curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun`

配置一下docker的阿里云仓库加速器

shell

 代码解读

复制代码

`$ sudo mkdir -p /etc/docker $ sudo tee /etc/docker/daemon.json <<-'EOF' {   "registry-mirrors": ["https://f1k1ut6a.mirror.aliyuncs.com"] } EOF $ sudo systemctl daemon-reload $ sudo systemctl restart docker`

由于墙的问题，k8s的组件的镜像国内拉取不到，做一下处理

bash

 代码解读

复制代码

`#!/bin/bash images=(kube-proxy-amd64:v1.11.0 kube-scheduler-amd64:v1.11.0 kube-controller-manager-amd64:v1.11.0 kube-apiserver-amd64:v1.11.0 etcd-amd64:3.2.18 coredns:1.1.3 pause-amd64:3.1 kubernetes-dashboard-amd64:v1.8.3 k8s-dns-sidecar-amd64:1.14.9 k8s-dns-kube-dns-amd64:1.14.9 k8s-dns-dnsmasq-nanny-amd64:1.14.9 ) for imageName in${images[@]} ; do docker pull keveon/$imageName docker tag keveon/$imageName k8s.gcr.io/$imageName docker rmi keveon/$imageNamedone*#个人新加的一句，V 1.11.0 必加* docker tag da86e6ba6ca1 k8s.gcr.io/pause:3.1`

保存一个sh文件，然后执行即可

载入ipvs内核模块（主要是为了后续kube-proxy提供内核支持）：kublete1.11.0 ipvs模块有问题，需要升级1.11.1，所以改用iptables模式，这一步不是必须的

ruby

 代码解读

复制代码

`$ modprobe ip_vs  $ modprobe ip_vs_rr $ modprobe ip_vs_wrr $ modprobe ip_vs_sh`

**k8s相关**
---------

### **etcd**

etcd开始是按kairen的步骤以static pod的方式安装，后来为了配集群，就改为systemd的方式安装，并去掉了etcd的tls的安全方式，觉得是内网，去掉增加性能及减少复杂度

删除etcd的static pod配置。

配置master

ini

 代码解读

复制代码

`$ yum install -y etcd $ vi /etc/etcd/etcd.conf ETCD_NAME=k8s-m ETCD_DATA_DIR="/var/lib/etcd/default.etcd" ETCD_LISTEN_PEER_URLS="http://0.0.0.0:2380" ETCD_LISTEN_CLIENT_URLS="http://0.0.0.0:2379" ETCD_INITIAL_ADVERTISE_PEER_URLS="http://192.168.1.138:2380" ETCD_ADVERTISE_CLIENT_URLS="http://192.168.1.138:2379" ETCD_INITIAL_CLUSTER="k8s-m=http://192.168.1.138:2380" ETCD_INITIAL_CLUSTER_STATE="new" ETCD_INITIAL_CLUSTER_TOKEN="k8s-etcd-cluster"`

配置集群高可用ETCD

ini

 代码解读

复制代码

`*#首先在k8s-m执行* $ etcdctl member add k8s-n1 http://192.168.1.139:2380 *#之后在k8s-n1安装etcd，并添加配置，注意加红部分与master的区别* $ yum install -y etcd $ vi /etc/etcd/etcd.conf ETCD_NAME=k8s-n1 ETCD_DATA_DIR="/var/lib/etcd/default.etcd" ETCD_LISTEN_PEER_URLS="http://0.0.0.0:2380" ETCD_LISTEN_CLIENT_URLS="http://0.0.0.0:2379" ETCD_INITIAL_ADVERTISE_PEER_URLS="http://192.168.1.139:2380" ETCD_ADVERTISE_CLIENT_URLS="http://192.168.1.139:2379" ETCD_INITIAL_CLUSTER="k8s-m=http://192.168.1.138:2380,k8s-n1=http://192.168.1.139:2380" ETCD_INITIAL_CLUSTER_STATE="existing" ETCD_INITIAL_CLUSTER_TOKEN="k8s-etcd-cluster"`

### **网络组件**

有关网络组件的选择，主要实际上calico和flannel两个。

本身calico有两种模式 bgp和ipip，calico的强项在于BGP，但是阿里云不支持BGP，只能采用IPIP。所以如果支持BGP使用calico，反之选flannel。

这次搭建采用了kairen的calico，后续如果在阿里云使用会换成flannel

### **负载均衡与kube-apiserver**

由于阿里云不支持VIP，所以删除keepalive和hapoxy组件，如果是多master模式，kube-apiserver就必须配置一个阿里云的内部slb来负载，此次部署是单master模式，所以相关kube-apiserver改为k8s-m的IP

### **kube-proxy**

由于1.11.0的bug 不能使用ipvs，所以改为iptables，后续建议还是采用ipvs，iptables在node节点多的时候会有配置和性能问题。更改

kube-proxy-cm.yml 文件里  
`mode: ipvs --> mode: iptables`

### **entry机能够访k8s内部网络采用snat转发**

设置k8s-m上的SNAT让NG能够转发（这一步如果采用ingress+traefix方式则已经不需要了）

iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -j MASQUERADE

### **一些add-on的安装**

### ingress

ingress-controller 没有按照kairen的使用nginx，改为使用traefix.

参考[docs.traefik.io/user-guide/…](https://link.juejin.cn?target=https%3A%2F%2Fdocs.traefik.io%2Fuser-guide%2Fkubernetes%2F%25E6%2589%25A7%25E8%25A1%258C "https://docs.traefik.io/user-guide/kubernetes/%E6%89%A7%E8%A1%8C")

具体配置 参考 `/etc/kubernetes/deploy/kube-system/ingress-traefik`下的配置

以及 traefik-web-ui 参考 `/etc/kubernetes/deploy/kube-system/traefik-web-ui`

### 性能监控 heapster metric-server

参考 `/etc/kubernetes/deploy/kube-system/heapster_square.yml`和`/etc/kubernetes/deploy/kube-system/metric-server的配置`

查询pod创建相关错误 kubectl -n \[namespace\] describe pod \[podname\]