---
author: "王宇"
title: "AzureIoTEdge第二步-设备部署"
date: 六月27,2024
description: "赵吉山"
tags: ["赵吉山"]
ShowReadingTime: "12s"
weight: 279
---
1\. 在IOT中心，设备列表找到设备，点进来；我设置的是Avatar\_WDM  点设置模块
===============================================

![](/download/attachments/129176283/image2024-6-27_21-15-31.png?version=1&modificationDate=1719494131412&api=v2)

2\. 设置容器注册表（具体怎么获取后续展开)
=======================

添加IoT Edge模块（虚拟人命名为**AvatarModule**）

![](/download/attachments/129176283/image2024-6-27_21-18-52.png?version=1&modificationDate=1719494332505&api=v2)

3\. 设置页面设置
==========

![](/download/attachments/129176283/image2024-6-27_21-24-31.png?version=1&modificationDate=1719494671980&api=v2)

4\. 环境变量设置
==========

![](/download/attachments/129176283/image2024-6-27_21-26-22.png?version=1&modificationDate=1719494782343&api=v2)

5\. 容器创建选项设置，将下面的Json填入到文本框内，然后点击添加；
====================================

**容器创建选项Json**  展开源码

[expand source](#)[?](#)

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

`{`

    `"HostConfig"``: {`

        `"DeviceRequests"``: [`

            `{`

                `"Count"``: -1,`

                `"Capabilities"``: [`

                    `[`

                        `"gpu"`

                    `]`

                `]`

            `}`

        `],`

        `"Privileged"``:` `true``,`

        `"runtime"``:` `"nvidia"``,`

        `"Devices"``: [`

            `{`

                `"PathOnHost"``:` `"/dev/snd"``,`

                `"PathInContainer"``:` `"/dev/snd"``,`

                `"CgroupPermissions"``:` `"rwm"`

            `}`

        `],`

        `"Binds"``: [`

            `"/tmp/.X11-unix:/tmp/.X11-unix"``,`

            `"/usr/share/alsa/alsa.conf:/usr/share/alsa/alsa.conf"``,`

            `"/etc/asound.conf:/etc/asound.conf"``,`

            `"/run/user/1000/pulse:/run/user/1000/pulse"``,`

            `"/home/Onanouser/.config/pulse/cookie:/root/.config/pulse/cookie"`

        `]`

    `}`

`}`

![](/download/attachments/129176283/image2024-6-27_21-30-17.png?version=1&modificationDate=1719495018174&api=v2)

6\. 出现以下界面
==========

![](/download/attachments/129176283/image2024-6-27_21-31-53.png?version=1&modificationDate=1719495113752&api=v2)

7\. 接下来填写容器创建选项,依次为名称，地址，用户名，密码不写在这里了
=====================================

[?](#)

`ACRembeddedfttdeveastus2001`

`acrembeddedfttdeveastus2001.azurecr.io`

`ACRembeddedfttdeveastus2001`

![](/download/attachments/129176283/image2024-6-27_21-37-33.png?version=1&modificationDate=1719495454151&api=v2)

8\. 点击查看+创建，点击创建
================

![](/download/attachments/129176283/image2024-6-27_21-38-32.png?version=1&modificationDate=1719495512715&api=v2)

9\. 创建完成，接下来需要配置设备；安装docker，安装Azure IoT运行时
==========================================

![](/download/attachments/129176283/image2024-6-27_21-39-50.png?version=1&modificationDate=1719495590618&api=v2)

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)