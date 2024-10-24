---
author: "华为云开发者联盟"
title: "详讲openGauss 50 单点企业版如何部署_Centos7_x86"
date: 2024-04-08
description: "本文分享自华为云社区《openGauss 50 单点企业版部署_Centos7_x86》， openGauss支持单机部署和单机HA部署两种部署方式。"
tags: ["数据库","开源","后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读17分钟"
weight: 1
selfDefined:"likes:2,comments:0,collects:2,views:312,"
---
本文分享自华为云社区《[openGauss 5.0 单点企业版部署\_Centos7\_x86](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%2F425004%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs/425004?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")》，本文作者：董小姐

本文档环境：CentOS7.9 x86\_64 4G1C40G python2.7.5 交互式初始化环境方式

1、介绍
----

openGauss是一款开源关系型数据库管理系统，采用木兰宽松许可证v2发行。openGauss内核深度融合华为在数据库领域多年的经验，结合企业级场景需求，持续构建竞争力特性。

openGauss社区版本分为长期支持版本和创新版本：

· 长期支持版本 (LTS) ——规模上线使用，发布间隔周期为1年，提供3年社区支持。

· 社区创新版本 (Preview) ——联创测试使用，发布间隔周期为1年，提供6个月社区支持。

openGauss支持单机部署和单机HA部署两种部署方式。单机部署时，可在一个主机部署多个数据库实例，但为了数据安全，不建议用户这样部署。单机HA部署支持一台主机和最少一台备机，备机一共最多8台的配置方式。

**说明：** 通过openGauss提供的脚本安装时，只允许在单台物理机部署一个数据库系统。如果您需要在单台物理机部署多个数据库系统，建议您通过命令行安装，不需要通过openGauss提供的安装脚本执行安装。

2、安装前准备
-------

### 2.1 软硬件要求

仅作参考，自测环境低一些也可以，本文档是CentOS7.9 x86\_64 4G1C40G的配置

### 2.2 硬件环境

表1 硬件环境要求列出了openGauss服务器应具备的最低硬件要求。在实际产品中，硬件配置的规划需考虑数据规模及所期望的数据库响应速度。请根据实际情况进行规划。

**表 1** 硬件环境要求

![](/images/jueJin/18e656ce98d9480.png)

### 2.3 软件环境

**表 2** 软件环境要求

![](/images/jueJin/40bbd1d17634440.png)若用户修改过系统python版本，则在安装数据库之前，还需手动安装下列python模块（pip安装即可）。

![](/images/jueJin/48030e9114d84bb.png)

并且在预安装时，需要加上--unused-third-party选项。

### 2.4 软件依赖要求

openGauss的软件依赖要求如表3 软件依赖要求所示。

建议使用上述操作系统安装光盘或者源中，下列依赖软件的默认安装包，若不存在下列软件，可参看软件对应的建议版本。

**表 3** 软件依赖要求

![](/images/jueJin/5abd18db6841446.png)

3、系统参数配置
--------

### 3.1 操作系统主机命名(可选)

如果采用默认主机名，可忽略该步骤，默认的主机名localhost.localdomain，xml文件中的主机名也需要改成localhost.localdomain

```arduino
hostnamectl set-hostname opendb01
```

### 3.2 /etc/hosts配置(可选)

如果采用默认主机名，可忽略该步骤，预安装会自动追加127.0.0.1 localhost #Gauss OM IP Hosts Mapping

```bash
cp /etc/hosts /etc/hosts.bak
cat >>/etc/hosts<<EOF
192.168.40.110      opendb01
EOF
```

### 3.3 limits.conf

不用配置该文件，会自动追加如下内容：

```bash
cat /etc/security/limits.conf
....
root       soft    as  unlimited
omm       soft    as  unlimited
root       hard    as  unlimited
omm       hard    as  unlimited
root       soft    nproc  unlimited
omm       soft    nproc  unlimited
root       hard    nproc  unlimited
omm       hard    nproc  unlimited
```

### 3.4 关闭透明页

```bash
echo never > /sys/kernel/mm/transparent_hugepage/enabled
echo never > /sys/kernel/mm/transparent_hugepage/defrag

--加入开机启动
echo '
echo never > /sys/kernel/mm/transparent_hugepage/enabled
echo never > /sys/kernel/mm/transparent_hugepage/defrag' >>/etc/rc.local
chmod +x /etc/rc.local
```

### 3.5 防火墙配置

```arduino
systemctl stop firewalld.service
systemctl disable firewalld.service
```

如果启用防火墙需进行如下配置：

如果数据库端口和ssh端口不是15400和22，需视情况更改

```css
firewall-cmd --zone=public --add-port=15400/tcp --permanent
firewall-cmd --zone=public --add-port=22/tcp --permanent
firewall-cmd --reload
```

### 3.6 selinux配置

```arduino
sed -i "s/SELINUX=enforcing/SELINUX=disabled/g" /etc/selinux/config
setenforce 0
```

### 3.7 关闭 numa和禁用透明大页

```bash
sed -i "s/quiet/quiet numa=off transparent_hugepage=never/g"  /etc/default/grub
grub2-mkconfig -o /etc/grub2.cfg
```

4、设置字符集参数
---------

```bash
echo "export LANG=en_US.UTF-8"  >> /etc/profile
source /etc/profile
```

### 4.1 设置时区和时间

如果服务器时间和当前时间相差8小时或者12小时，需要查看时区，分析是否决定更改。

### 4.2 非可视化更改步骤

```sql
--查看当前时间
[root@opendb01 ~]# date
Fri Jan 26 16:50:55 CST 2024

--查看当前时区
root@HKSZF-ZW-172-19-146-176:/topsoft# timedatectl
Local time: Wed 2024-01-24 05:51:05 UTC
Universal time: Wed 2024-01-24 05:51:05 UTC
RTC time: Wed 2024-01-24 05:51:56
Time zone: Etc/UTC (UTC, +0000)
System clock synchronized: no
systemd-timesyncd.service active: yes
RTC in local TZ: no

--更改时区  执行tzselect命令

root@HKSZF-ZW-172-19-146-176:/topsoft# tzselect
Please identify a location so that time zone rules can be set correctly.
Please select a continent, ocean, "coord", or "TZ".
1) Africa
2) Americas
3) Antarctica
4) Asia
5) Atlantic Ocean
6) Australia
7) Europe
8) Indian Ocean
9) Pacific Ocean
10) coord - I want to use geographical coordinates.
11) TZ - I want to specify the time zone using the Posix TZ format.

--找到Asia，输入4，回车
Please select a country whose clocks agree with yours.
1) Afghanistan           18) Israel                35) Palestine
2) Armenia               19) Japan                 36) Philippines
3) Azerbaijan            20) Jordan                37) Qatar
4) Bahrain               21) Kazakhstan            38) Russia
5) Bangladesh            22) Korea (North)         39) Saudi Arabia
6) Bhutan                23) Korea (South)         40) Singapore
7) Brunei                24) Kuwait                41) Sri Lanka
8) Cambodia              25) Kyrgyzstan            42) Syria
9) China                 26) Laos                  43) Taiwan
10) Cyprus                27) Lebanon               44) Tajikistan
11) East Timor            28) Macau                 45) Thailand
12) Georgia               29) Malaysia              46) Turkmenistan
13) Hong Kong             30) Mongolia              47) United Arab Emirates
14) India                 31) Myanmar (Burma)       48) Uzbekistan
15) Indonesia             32) Nepal                 49) Vietnam
16) Iran                  33) Oman                  50) Yemen
17) Iraq                  34) Pakistan

--找到china,输入9，回车
Please select one of the following time zone regions.
1) Beijing Time
2) Xinjiang Time

--找到北京时间，输入1，回车
Please select one of the following time zone regions.
1) Beijing Time
2) Xinjiang Time

--选择yes，输入1，回车
The following information has been given:

China
Beijing Time

Therefore TZ='Asia/Shanghai' will be used.
Selected time is now:   Wed Jan 24 21:40:32 CST 2024.
Universal Time is now:  Wed Jan 24 13:40:32 UTC 2024.
Is the above information OK?
1) Yes
2) No

--更新设置
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

--查看是否更改成功
root@HKSZF-ZW-172-19-146-176:/topsoft# date
Wed Jan 24 21:42:00 CST 2024

root@HKSZF-ZW-172-19-146-176:/topsoft# timedatectl
Local time: Wed 2024-01-24 21:42:06 CST
Universal time: Wed 2024-01-24 13:42:06 UTC
RTC time: Wed 2024-01-24 06:09:59
Time zone: Asia/Shanghai (CST, +0800)
System clock synchronized: no
systemd-timesyncd.service active: yes
RTC in local TZ: no
```

### 4.3 可视化更改步骤

```yaml
--查看当前时间
[root@opendb01 ~]# date
Fri Jan 26 16:50:55 CST 2024

--查看当前时区
root@HKSZF-ZW-172-19-146-176:/topsoft# timedatectl
Local time: Wed 2024-01-24 05:51:05 UTC
Universal time: Wed 2024-01-24 05:51:05 UTC
RTC time: Wed 2024-01-24 05:51:56
Time zone: Etc/UTC (UTC, +0000)
System clock synchronized: no
systemd-timesyncd.service active: yes
RTC in local TZ: no
```

在可视化界面中查看

选择进入 Applications -> System Tools -> Settings -> Details -> Date & Time

![](/images/jueJin/81ca20a95a114e6.png)

调整时间

点击“Date & Time”行中任意位置，弹出弹窗，调整时间为当前北京时间，再关闭弹窗，即保存。如下图所示：

![](/images/jueJin/369b77e46a844e1.png)

再次使用命令查看，本地时间已显示为北京时间

```yaml
[root@localhost src]# timedatectl
Local time: Mon 2022-04-04 13:14:03 CST
Universal time: Mon 2022-04-04 05:14:03 UTC
RTC time: Mon 2022-04-04 05:14:03
Time zone: Asia/Shanghai (CST, +0800)
NTP enabled: no
NTP synchronized: no
RTC in local TZ: no
DST active: n/a
```

### 4.4 关闭swap交换内存(可选)

关闭swap交换内存是为了保障数据库的访问性能，避免把数据库的缓冲区内存淘汰到磁盘上。 如果服务器内存比较小，内存过载时，可打开swap交换内存保障正常运行。

```css
swapoff -a
```

### 4.5 关闭RemoveIPC

在各数据库节点上，关闭RemoveIPC。CentOS操作系统默认为关闭，可以跳过该步骤。

修改/etc/systemd/logind.conf文件中的“RemoveIPC”值为“no”。a. 使用VIM打开logind.conf文件。

```sql
--更改后的/etc/systemd/logind.conf
vim  /etc/systemd/logind.conf
RemoveIPC=no

--更改后的
vim /usr/lib/systemd/system/systemd-logind.service
RemoveIPC=no

--重新加载配置参数
systemctl daemon-reload
systemctl restart systemd-logind

--检查修改是否生效
loginctl show-session | grep RemoveIPC
systemctl show systemd-logind | grep RemoveIPC
```

### 4.6 关闭HISTORY记录(可选)

为避免指令历史记录安全隐患，需关闭各主机的history指令。

```bash
更改/etc/profile中HISTSIZE值
vim /etc/profile
HISTSIZE默认值为1000 更改为 HISTSIZE=0

--生效
source /etc/profile
```

### 4.7 配置yum源

将操作系统镜像上传至/opt目录下

```bash
mount /opt/*.iso /mnt/
cat << EOF >> /etc/fstab
/dev/sr0    /mnt        iso9660 loop            0 0
EOF

mkdir -p /etc/yum.repos.d/bak
mv /etc/yum.repos.d/*.repo /etc/yum.repos.d/bak
cat >> /etc/yum.repos.d/os.repo <<"EOF"
[OS1]
name=OS
baseurl=file:///mnt
enabled=1
gpgcheck=0
EOF
```

5、安装依赖包
-------

```css
yum install -y bzip2 libaio-devel flex bison ncurses-devel glibc-devel \
patch redhat-lsb-core readline-devel

注意：openEuler+x86环境中  yum install -y libnsl
```

6、python版本升级
------------

python版本如果是3.6.x，可跳过该步骤

python版本2.7.5需升级至3.6.x版本，centos7 用python3.6 ,欧拉20用python3.7，其实不需要去编译安装python，直接用操作系统自带的包管理器yum install python3或dnf install python3,装上去就是对应的版本了。切不要编译安装，不然跳坑，预安装时报错。

```sql
--查看python版本
[root@opendb01 ~]# python --version
Python 2.7.5

[root@opendb01 ~]# python3 --version
python3命令找不到

--采用yum方式安装操作系统自带的包管理器中的python3
yum install python3

--再次查看python版本
[root@opendb01 ~]# python --version
Python 2.7.5

[root@opendb01 ~]# python3 --version
Python 3.6.8
```

7、创建用户及用户组(可选)
--------------

可以创建也可以不创建，自行操作

```diff
--创建用户组dbgrp
groupadd dbgrp

--创建用户组dbgroup下的普通用户omm，并设置密码为Gauss_234
useradd -g dbgrp omm
passwd omm
```

为了实现安装过程中安装帐户权限最小化，及安装后openGauss的系统运行安全性，安装脚本在安装过程中会自动按照用户指定内容创建安装用户，并将此用户作为后续运行和维护openGauss的管理员帐户。

![](/images/jueJin/6bdbc74a694248f.png)

在安装openGauss过程中root用户运行 openGauss-5.0.1-CentOS-64bit-om.tar.gz中scripts目录中的“gs\_preinstall”时，会创建与安装用户同名的数据库用户，即数据库用户omm。此用户具备数据库的最高操作权限，此用户初始密码由用户指定。

8、目录规划
------

```bash
--创建存放安装包的目录
mkdir -p /topsoft/soft/openGauss
chmod 777 -R /topsoft/soft

--创建目录  目录会自动创建，可选择不创建
mkdir -p /topsoft/huawei/install/app  #数据库安装目录
mkdir -p /topsoft/huawei/log/omm  #日志目录
mkdir -p /topsoft/huawei/tmp  #临时文件目录
mkdir -p /topsoft/huawei/install/om  #数据库工具目录
mkdir -p /topsoft/huawei/corefile  #数据库core文件目录
```

不建议把安装包的存放目录规划到openGauss用户的根目录或其子目录下，可能导致权限问题。

openGauss用户须具有/topsoft/soft/openGauss目录的读写权限。

9、下载并上传安装包
----------

登录openGauss开源社区[opengauss.org/zh/download…](https://link.juejin.cn?target=https%3A%2F%2Fopengauss.org%2Fzh%2Fdownload%2F%25EF%25BC%258C%25E9%2580%2589%25E6%258B%25A9%25E5%25AF%25B9%25E5%25BA%2594%25E5%25B9%25B3%25E5%258F%25B0%25E7%259A%2584%25E4%25BC%2581%25E4%25B8%259A%25E7%2589%2588%25E5%25AE%2589%25E8%25A3%2585%25E5%258C%2585%25E3%2580%2582 "https://opengauss.org/zh/download/%EF%BC%8C%E9%80%89%E6%8B%A9%E5%AF%B9%E5%BA%94%E5%B9%B3%E5%8F%B0%E7%9A%84%E4%BC%81%E4%B8%9A%E7%89%88%E5%AE%89%E8%A3%85%E5%8C%85%E3%80%82")

![](/images/jueJin/cb46673b3cef484.png)

上传至/topsoft/soft/openGauss目录，安装包“openGauss-5.1.0-openEuler-64bit-all.tar.gz”和配置文件“cluster\_config.xml”都上传至上一步所创建的目录中。

10、配置单节点XML文件
-------------

安装openGauss前需要创建XML文件。XML文件包含部署openGauss的服务器信息、安装路径、IP地址以及端口号等。用于告知openGauss如何部署。用户需根据不同场景配置对应的XML文件。

关于如何配置XML文件，详细请参见创建XML配置文件。

将cluster\_config.xml上传至/topsoft/soft/openGauss目录，安装包“openGauss-5.1.0-openEuler-64bit-all.tar.gz”和配置文件“cluster\_config.xml”都上传至上一步所创建的目录中。

为确保成功安装，检查hostname与/etc/hostname是否一致。预安装过程中，会对hostname进行检查。

默认端口15400，若待用自定义端口，更改xml文件中的端口号

### 官方XML文件模板

```xml
cat cluster_config.xml
<?xml version="1.0" encoding="UTF-8"?>
<ROOT>
<!-- openGauss整体信息 -->
<CLUSTER>
<!-- 数据库名称 -->
<PARAM name="clusterName" value="dbCluster" />
<!-- 数据库节点名称(hostname) -->
<PARAM name="nodeNames" value="node1_hostname" />
<!-- 数据库安装目录-->
<PARAM name="gaussdbAppPath" value="/opt/huawei/install/app" />
<!-- 日志目录-->
<PARAM name="gaussdbLogPath" value="/var/log/omm" />
<!-- 临时文件目录-->
<PARAM name="tmpMppdbPath" value="/opt/huawei/tmp" />
<!-- 数据库工具目录-->
<PARAM name="gaussdbToolPath" value="/opt/huawei/install/om" />
<!-- 数据库core文件目录-->
<PARAM name="corePath" value="/opt/huawei/corefile" />
<!-- 节点IP，与数据库节点名称列表一一对应 -->
<PARAM name="backIp1s" value="192.168.0.1"/>
</CLUSTER>
<!-- 每台服务器上的节点部署信息 -->
<DEVICELIST>
<!-- 节点1上的部署信息 -->
<DEVICE sn="node1_hostname">
<!-- 节点1的主机名称 -->
<PARAM name="name" value="node1_hostname"/>
<!-- 节点1所在的AZ及AZ优先级 -->
<PARAM name="azName" value="AZ1"/>
<PARAM name="azPriority" value="1"/>
<!-- 节点1的IP，如果服务器只有一个网卡可用，将backIP1和sshIP1配置成同一个IP -->
<PARAM name="backIp1" value="192.168.0.1"/>
<PARAM name="sshIp1" value="192.168.0.1"/>

<!--dbnode-->
<PARAM name="dataNum" value="1"/>
<PARAM name="dataPortBase" value="15400"/>
<PARAM name="dataNode1" value="/opt/huawei/install/data/dn"/>
<PARAM name="dataNode1_syncNum" value="0"/>
</DEVICE>
</DEVICELIST>
</ROOT>
```

### 根据官方模板更改后的xml文件

```xml
cat cluster_config.xml
<?xml version="1.0" encoding="UTF-8"?>
<ROOT>
<!-- openGauss整体信息 -->
<CLUSTER>
<!-- 数据库名称 -->
<PARAM name="clusterName" value="dbCluster" />
<!-- 数据库节点名称(hostname) -->
<PARAM name="nodeNames" value="opendb01" />
<!-- 数据库安装目录-->
<PARAM name="gaussdbAppPath" value="/topsoft/huawei/install/app" />
<!-- 日志目录-->
<PARAM name="gaussdbLogPath" value="/topsoft/huawei/log/omm" />
<!-- 临时文件目录-->
<PARAM name="tmpMppdbPath" value="/topsoft/huawei/tmp" />
<!-- 数据库工具目录-->
<PARAM name="gaussdbToolPath" value="/topsoft/huawei/install/om" />
<!-- 数据库core文件目录-->
<PARAM name="corePath" value="/topsoft/huawei/corefile" />
<!-- 节点IP，与数据库节点名称列表一一对应 -->
<PARAM name="backIp1s" value="192.168.40.110"/>
</CLUSTER>
<!-- 每台服务器上的节点部署信息 -->
<DEVICELIST>
<!-- 节点1上的部署信息 -->
<DEVICE sn="opendb01">
<!-- 节点1的主机名称 -->
<PARAM name="name" value="opendb01"/>
<!-- 节点1所在的AZ及AZ优先级 -->
<PARAM name="azName" value="AZ1"/>
<PARAM name="azPriority" value="1"/>
<!-- 节点1的IP，如果服务器只有一个网卡可用，将backIP1和sshIP1配置成同一个IP -->
<PARAM name="backIp1" value="192.168.40.110"/>
<PARAM name="sshIp1" value="192.168.40.110"/>

<!--dbnode-->
<PARAM name="dataNum" value="1"/>
<PARAM name="dataPortBase" value="15400"/>
<PARAM name="dataNode1" value="/topsoft/huawei/install/data/dn"/>
<PARAM name="dataNode1_syncNum" value="0"/>
</DEVICE>
</DEVICELIST>
</ROOT>
```

可通过以下全局替换

```ruby
vi /topsoft/soft/openGauss/cluster_config.xml

:%s#node1_hostname#opendb01#g   #主机名
:%s#/opt/huawei/install/app#/topsoft/huawei/install/app#g   #安装目录
:%s#/opt/huawei/install/app#/topsoft/huawei/install/app#g   #安装目录
:%s#/var/log/omm#/topsoft/huawei/log/omm#g    #日志目录
:%s#/opt/huawei/tmp#/topsoft/huawei/tmp#g   #临时文件目录
:%s#/opt/huawei/install/om#/topsoft/huawei/install/om#g    #数据库工具目录
:%s#/opt/huawei/corefile#/topsoft/huawei/corefile#g   #数据库core文件目录
:%s#192.168.0.1#192.168.40.110#g   #IP地址
:%s#/opt/huawei/install/data/dn#/topsoft/huawei/install/data/dn#g   #数据节点目录  /opt/huawei/install/data/dn
```

11、解压安装包
--------

对于个人开发者或非企业级环境，下载极简安装包（不安装OM等组件）即可。本文档采用的是企业版安装，因此安装OM等组件

注意：安装包“openGauss-5.1.0-openEuler-64bit-all.tar.gz”和配置文件“cluster\_config.xml”需在同一目录中，本文档是/topsoft/soft/openGauss目录。

```sql
--进入安装包所在目录
[root@opendb01 ~]# cd /topsoft/soft/openGauss/
[root@localhost openGauss]# ls -l
total 130712
-rw-r--r--. 1 root root      1905 Jan 27 08:31 cluster_config.xml
-rw-r--r--. 1 root root 133842584 Jan 27 08:30 openGauss-5.1.0-openEuler-64bit-all.tar.gz

--解压openGauss-5.1.0-openEuler-64bit-all.tar.gz安装包
tar -xvf openGauss-5.1.0-openEuler-64bit-all.tar.gz

--查看解压后的文件
[root@localhost ~]# cd /topsoft/soft/openGauss/
[root@localhost openGauss]# ls -lS
total 131764
-rw-r--r--. 1 root root 99901554 Dec 15 20:34 openGauss-5.0.1-CentOS-64bit.tar.bz2
-rw-r--r--. 1 root root 22528301 Dec 15 20:34 openGauss-5.0.1-CentOS-64bit-cm.tar.gz
-rw-r--r--. 1 root root 11971903 Dec 15 20:33 openGauss-5.0.1-CentOS-64bit-om.tar.gz  #数据库工具目录
-rw-------. 1 root root   499269 Dec 15 20:32 upgrade_sql.tar.gz
-rw-r--r--. 1 root root      105 Dec 15 20:34 openGauss-5.0.1-CentOS-64bit-cm.sha256
-rw-r--r--. 1 root root       65 Dec 15 20:33 openGauss-5.0.1-CentOS-64bit-om.sha256
-rw-r--r--. 1 root root       65 Dec 15 20:34 openGauss-5.0.1-CentOS-64bit.sha256
-rw-------. 1 root root       65 Dec 15 20:32 upgrade_sql.sha256

参数说明：
-S ：按文件类型排序

--继续解压openGauss-5.0.1-CentOS-64bit-om.tar.gz  数据库工具包 企业版安装需要解压该包极简版不需要
tar -xvf openGauss-5.0.1-CentOS-64bit-om.tar.gz

--查看解压后的文件   script目录中生成gs_preinstall等各种OM工具脚本
[root@opendb01 openGauss]# ls -lS
total 262484
-rw-r--r--.  1 root root 133842584 Jan 24 06:03 openGauss-5.1.0-openEuler-64bit-all.tar.gz
-rw-r--r--.  1 root root  99901554 Dec 15 20:34 openGauss-5.0.1-CentOS-64bit.tar.bz2
-rw-r--r--.  1 root root  22528301 Dec 15 20:34 openGauss-5.0.1-CentOS-64bit-cm.tar.gz
-rw-r--r--.  1 root root  11971903 Dec 15 20:33 openGauss-5.0.1-CentOS-64bit-om.tar.gz
-rw-------.  1 root root    499269 Dec 15 20:32 upgrade_sql.tar.gz
drwxr-xr-x. 14 root root      4096 Dec 15 20:33 lib
drwxr-xr-x. 10 root root      4096 Dec 15 20:33 script
-rw-r--r--.  1 root root       105 Dec 15 20:34 openGauss-5.0.1-CentOS-64bit-cm.sha256
-rw-r--r--.  1 root root        65 Dec 15 20:33 openGauss-5.0.1-CentOS-64bit-om.sha256
-rw-r--r--.  1 root root        65 Dec 15 20:34 openGauss-5.0.1-CentOS-64bit.sha256
-rw-------.  1 root root        65 Dec 15 20:32 upgrade_sql.sha256
-rw-r--r--.  1 root root        32 Dec 15 20:33 version.cfg
```

*   在执行前置脚本gs\_preinstall时，需要规划好openGauss配置文件路径、安装包存放路径、程序安装目录、实例数据目录，后续普通用户使用过程中不能再更改这些路径。
    
*   运行前置脚本gs\_preinstall准备安装环境时，脚本内部会自动将openGauss配置文件、解压后的安装包同步拷贝到其余服务器的相同目录下。
    
*   在执行前置脚本或者互信前，请检查/etc/profile文件中是否包含错误输出信息，如果存在错误输出，需手动处理。
    

12、使用gs\_preinstall初始化安装环境
--------------------------

安装环境的初始化包含上传安装包和XML文件(二者需在同一目录)、解压安装包、使用gs\_preinstall准备好安装环境。

分2种场景初始化，自行选择。

13、准备安装用户及环境
------------

创建完openGauss配置文件后，在执行安装前，为了后续能以最小权限进行安装及openGauss管理操作，保证系统安全性，需要运行安装前置脚本gs\_preinstall准备好安装用户及环境。在执行前置脚本gs\_preinstall时，需要规划好openGauss配置文件路径、安装包存放路径、程序安装目录、实例数据目录，后续普通用户使用过程中不能再更改这些路径。

安装前置脚本gs\_preinstall可以协助用户自动完成如下的安装环境准备工作：

*   自动设置Linux内核参数以达到提高服务器负载能力的目的。这些参数直接影响数据库系统的运行状态，请仅在确认必要时调整。openGauss所设置的Linux内核参数取值请参见配置操作系统参数。
    
*   脚本内部会自动将openGauss配置文件、安装包拷贝到openGauss主机的相同目录下。
    
*   openGauss安装用户、用户组不存在时，自动创建安装用户以及用户组。
    
*   读取openGauss配置文件中的目录信息并创建，将目录权限授予安装用户。
    
*   只能使用root用户执行gs\_preinstall命令
    
*   在执行前置脚本或者互信前，请检查/etc/profile文件中是否包含错误输出信息，如果存在错误输出，需手动处理。
    

注意：如果是openEuler（openEuler 20.03）的操作系统，执行如下命令打开performance.sh文件，用#注释sysctl -w vm.min\_free\_kbytes=112640 &> /dev/null，键入“ESC”键进入指令模式，执行\*\*:wq\*\*保存并退出修改。

```bash
vi /etc/profile.d/performance.sh
```

### 场景1：采用交互模式执行前置

```bash
[root@opendb01 /]# cd /topsoft/soft/openGauss/script/
./gs_preinstall -U omm -G dbgrp -X /topsoft/soft/openGauss/cluster_config.xml
```

这里设置：omm用户密码omm

预安装脚本执行的详细过程如下：

```erlang
[root@localhost script]# ./gs_preinstall -U omm -G dbgrp -X /topsoft/soft/openGauss/cluster_config.xml
Parsing the configuration file.
Successfully parsed the configuration file.
Installing the tools on the local node.
Successfully installed the tools on the local node.
Setting host ip env
Successfully set host ip env.
Are you sure you want to create the user[omm] (yes/no)?
Please enter password for cluster user.
Password:
Please enter password for cluster user again.
Password:
Generate cluster user password files successfully.

Successfully created [omm] user on all nodes.
Preparing SSH service.
Successfully prepared SSH service.
Checking OS software.
Successfully check os software.
Checking OS version.
Successfully checked OS version.
Creating cluster's path.
Successfully created cluster's path.
Set and check OS parameter.
Setting OS parameters.
Successfully set OS parameters.
Warning: Installation environment contains some warning messages.
Please get more details by "/topsoft/soft/openGauss/script/gs_checkos -i A -h opendb01 --detail".
Set and check OS parameter completed.
Preparing CRON service.
Successfully prepared CRON service.
Setting user environmental variables.
Successfully set user environmental variables.
Setting the dynamic link library.
Successfully set the dynamic link library.
Setting Core file
Successfully set core path.
Setting pssh path
Successfully set pssh path.
Setting Cgroup.
Successfully set Cgroup.
Set ARM Optimization.
No need to set ARM Optimization.
Fixing server package owner.
Setting finish flag.
Successfully set finish flag.
Preinstallation succeeded.
```

#### 问题处理

```sql
--问题描述
采用交互模式执行前置时报错/usr/bin/env: python3: No such file or directory
[root@opendb01 script]# ./gs_preinstall -U omm -G dbgrp -X /opt/software/openGauss/cluster_config.xml
/usr/bin/env: python3: No such file or directory

--解决办法
采用上面办法进行python版本升级
--查看python版本
[root@opendb01 ~]# python --version
Python 2.7.5

[root@opendb01 ~]# python3 --version
python3命令找不到

--采用yum方式安装操作系统自带的包管理器中的python3
yum install python3

--再次查看python版本
[root@opendb01 ~]# python --version
Python 2.7.5

[root@opendb01 ~]# python3 --version
Python 3.6.8
```

14、执行安装
-------

使用gs\_install安装openGauss。安装脚本gs\_install必须以前置脚本中指定的omm执行，否则，脚本执行会报错。

/topsoft/soft/openGauss/cluster\_config.xml为openGauss配置文件的路径。在执行过程中，用户需根据提示输入数据库的密码，密码具有一定的复杂度，为保证用户正常使用该数据库，请记住输入的数据库密码。这里设置为Topnet@123

设置的密码要符合复杂度要求：

*   最少包含8个字符，最多包含16个字符。
    
*   不能和用户名、当前密码（ALTER）、或当前密码反序相同。
    
*   至少包含大写字母（A-Z）、小写字母（a-z）、数字、非字母数字字符（限定为~!@#$%^&\*()-\_=+\\|\[{}\];:,<.>/?）四类字符中的三类字符。
    

注意事项：

*   openGauss支持字符集的多种写法：gbk/GBK、UTF-8/UTF8/utf8/utf-8和Latine1/latine1。
    
*   安装时若不指定字符集，默认字符集为SQL\_ASCII，为简化和统一区域loacle默认设置为C，若想指定其他字符集和区域，请在安装时使用参数–gsinit-parameter="–locale=LOCALE"来指定，LOCALE为新数据库设置缺省的区域。
    
*   默认端口15400
    
    \--赋予配置文件777的权限，因为安装脚本gs\_install必须以前置脚本中指定的omm执行 chmod 777 /topsoft/soft/openGauss/cluster\_config.xml
    
    \--切换用户 omm为前置脚本gs\_preinstall中-U参数指定的用户 su - omm
    
    \--查看配置文件/etc/profile中的语言参数 \[omm@opendb01 dn\_6001\]$ cat /etc/profile | grep LANG export LANG=en\_US.UTF-8
    
    \--查看系统支持UTF-8编码的区域 locale -a|grep utf8
    
    \--执行安装脚本 gs\_install -X /topsoft/soft/openGauss/cluster\_config.xml --gsinit-parameter="--locale=en\_US.utf8"
    

安装过程中会生成ssl证书，证书存放路径为{gaussdbAppPath}/share/sslcert/om，其中{gaussdbAppPath}为openGauss配置文件中指定的程序安装目录。

```sql
[omm@opendb01 om]$ cd /topsoft/huawei/install/app/share/sslcert/om
[omm@opendb01 om]$ ls -l
total 64
-rw-------. 1 omm dbgrp  4399 Jan 27 08:43 cacert.pem
-rw-------. 1 omm dbgrp  4402 Jan 27 08:43 client.crt
-rw-------. 1 omm dbgrp  1766 Jan 27 08:43 client.key
-rw-------. 1 omm dbgrp    56 Jan 27 08:43 client.key.cipher
-rw-------. 1 omm dbgrp  1218 Jan 27 08:43 client.key.pk8
-rw-------. 1 omm dbgrp    24 Jan 27 08:43 client.key.rand
-rw-------. 1 omm dbgrp 10921 Jan 27 08:43 openssl.cnf
-rw-------. 1 omm dbgrp  4402 Jan 27 08:43 server.crt
-rw-------. 1 omm dbgrp  1766 Jan 27 08:43 server.key
-rw-------. 1 omm dbgrp    56 Jan 27 08:43 server.key.cipher
-rw-------. 1 omm dbgrp    24 Jan 27 08:43 server.key.rand
```

日志文件路径下会生成两个日志文件：“gs\_install-YYYY-MMDD\_HHMMSS.log”和“gs\_local-YYYY-MM-DD\_HHMMSS.log”。

```bash
/topsoft/huawei/log/omm/omm/om/gs_install-2024-01-27_084156.log
```

详细过程如下：

```erlang
[omm@opendb01 ~]$ gs_install -X /topsoft/soft/openGauss/cluster_config.xml
Parsing the configuration file.
Check preinstall on every node.
Successfully checked preinstall on every node.
Creating the backup directory.
Successfully created the backup directory.
begin deploy..
Installing the cluster.
begin prepare Install Cluster..
Checking the installation environment on all nodes.
begin install Cluster..
Installing applications on all nodes.
Successfully installed APP.
begin init Instance..
encrypt cipher and rand files for database.
Please enter password for database:
Please repeat for database:
begin to create CA cert files
The sslcert will be generated in /topsoft/huawei/install/app/share/sslcert/om
NO cm_server instance, no need to create CA for CM.
Non-dss_ssl_enable, no need to create CA for DSS
Cluster installation is completed.
Configuring.
Deleting instances from all nodes.
Successfully deleted instances from all nodes.
Checking node configuration on all nodes.
Initializing instances on all nodes.
Updating instance configuration on all nodes.
Check consistence of memCheck and coresCheck on database nodes.
Configuring pg_hba on all nodes.
Configuration is completed.
The cluster status is Normal.
Successfully started cluster.
Successfully installed application.
end deploy..
```

### 问题处理

**字符集不是UTF8**

```sql
--问题描述
安装完成后登录数据库查看数据库时字符集不是UTF8

--原因
执行安装时未指定字符集参数，，未指定字符集参数执行安装时字符集默认是SQL_ASCII

--解决办法
--查看配置文件/etc/profile中的语言参数
[omm@opendb01 dn_6001]$ cat /etc/profile | grep LANG
export LANG=en_US.UTF-8

--
```

15、访问数据库
--------

连接数据库的客户端工具包括gsql、应用程序接口（如JDBC）。

*   gsql是openGauss自带的客户端工具。使用gsql连接数据库，可以交互式地输入、编辑、执行SQL语句。
    
*   用户可以使用标准的数据库应用程序接口（如JDBC），开发基于openGauss的应用程序。
    
    \--查看进程 \[omm@opendb01 ~\]ps−ef∣grepgaussdbomm76691807:18?00:01:45/topsoft/huawei/install/app/bin/gaussdb−D/topsoft/huawei/install/data/dn或\[omm@opendb01 \] ps -ef | grep gaussdb omm 7669 1 8 07:18 ? 00:01:45 /topsoft/huawei/install/app/bin/gaussdb -D /topsoft/huawei/install/data/dn 或 \[omm@opendb01 ~\]ps−ef∣grepgaussdbomm76691807:18?00:01:45/topsoft/huawei/install/app/bin/gaussdb−D/topsoft/huawei/install/data/dn或\[omm@opendb01 \] gs\_ctl query -D /topsoft/huawei/install/data/dn \[2024-01-28 07:40:02.099\]\[9092\]\[\]\[gs\_ctl\]: gs\_ctl query ,datadir is /topsoft/huawei/install/data/dn HA state: local\_role : Normal static\_connections : 0 db\_state : Normal detail\_information : Normal
    
    Senders info: No information Receiver info: No information
    

### 本地连接数据库

gsql是openGauss提供的在命令行下运行的数据库连接工具。此工具除了具备操作数据库的基本功能，还提供了若干高级特性，便于用户使用。本节只介绍如何使用gsql连接数据库，关于gsql使用方法的更多信息请参考《工具与命令参考》中“客户端工具 > gsql”章节。

缺省情况下，客户端连接数据库后处于空闲状态时会根据参数session\_timeout的默认值自动断开连接。如果要关闭超时设置，设置参数session\_timeout为0即可。默认为0表示关闭超时设置

以操作系统用户omm登录数据库主节点。

```sql
su - omm
法一：
gsql -d postgres -p 15400

参数说明：
-d 连接的数据库名称，
-p 数据库主节点的端口号

法二：
gsql -d "host=127.0.0.1 port=15400 dbname=postgres user=omm password=Topnet@123"
--登录后如下：
[omm@localhost ~]$ gsql -d postgres -p 15400
gsql ((openGauss 5.0.1 build 33b035fd) compiled at 2023-12-15 20:19:06 commit 0 last mr  )
Non-SSL connection (SSL connection is recommended when requiring high-security)
Type "help" for help.

openGauss=# \l+
List of databases
Name    | Owner | Encoding |  Collate   |   Ctype    | Access privileges | Size  | Tablespace |
Description
-----------+-------+----------+------------+------------+-------------------+-------+------------+--------------
------------------------------
postgres  | omm   | UTF8     | en_US.utf8 | en_US.utf8 |                   | 13 MB | pg_default | default admin
istrative connection database
template0 | omm   | UTF8     | en_US.utf8 | en_US.utf8 | =c/omm           +| 13 MB | pg_default | default templ
ate for new databases
|       |          |            |            | omm=CTc/omm       |       |            |
template1 | omm   | UTF8     | en_US.utf8 | en_US.utf8 | =c/omm           +| 13 MB | pg_default | unmodifiable
empty database
|       |          |            |            | omm=CTc/omm       |       |            |
(3 rows)

--查看数据库状态
[omm@localhost ~]$ gs_om -t status
-----------------------------------------------------------------------

cluster_name    : dbCluster
cluster_state   : Normal   #“Normal”表示数据库可正常使用
redistributing  : No

--创建数据库  不能是en_US.utf8不然报错
openGauss=# create database test with encoding 'utf8' template = template0;
CREATE DATABASE
```

以上是openGauss安装部署实践分享，欢迎大家一起交流学习。

[**点击关注，第一时间了解华为云新鲜技术~**](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")