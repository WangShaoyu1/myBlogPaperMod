---
author: "王宇"
title: "AIUI设备注册mac地址过多问题排查及解决方法"
date: 八月26,2024
description: "赵吉山"
tags: ["赵吉山"]
ShowReadingTime: "12s"
weight: 271
---
1\. 背景情况
========

最近AIUI设备授权数增加迅速，且多数设备的MAC地址为未知的MAC地址，异常现象与设备重启过程中的MAC地址获取问题相关。

2\. 主要问题
========

根据讯飞demo提供的方法，在获取设备MAC地址受设备自身网络接口的不同，获取到的设备mac不唯一，多台设备的MAC地址获取出现问题。导致这些设备在重启虚拟人或者重启设备（虚拟人也会重启）进而在AIUI注册过程中出现了MAC地址获取不正确（不唯一）的问题，导致了设备授权数量异常增加。

3\. 问题解决的过程
===========

3.1. 将讯飞提供的方法编写成测试例子，发现在不同的设备上，获取的mac地址所对应的网络接口不一致，有的是usb0，有的是wlan0；
--------------------------------------------------------------------

3.2. 分析讯飞提供的获取mac地址的c++方法，获取方式为：
--------------------------------

[?](#)

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

31

32

33

34

35

36

37

38

39

40

41

42

43

44

45

46

47

48

49

50

51

52

`static` `void` `GenerateMACAddress(``char``* mac)`

`{`

    `// 创建一个套接字，用于与网络接口进行通信`

    `int` `sock = socket(AF_INET, SOCK_DGRAM, 0);`

    `if` `(sock < 0) {`

        `return``;` `// 如果套接字创建失败，直接返回`

    `};`

    `struct` `ifconf ifc{};`

    `char` `buf[1024];`

    `int` `success = 0;`

    `// 设置ifconf结构体，用于获取网络接口列表`

    `ifc.ifc_len =` `sizeof``(buf);`

    `ifc.ifc_buf = buf;`

    `if` `(ioctl(sock, SIOCGIFCONF, &ifc) == -1) {`

        `return``;` `// 如果获取网络接口列表失败，直接返回`

    `}`

    `struct` `ifreq* it = ifc.ifc_req;`

    `const` `struct` `ifreq*` `const` `end = it + (ifc.ifc_len /` `sizeof``(``struct` `ifreq));`

    `struct` `ifreq ifr{};`

    `// 遍历所有网络接口`

    `for` `(; it != end; ++it) {`

        `strcpy``(ifr.ifr_name, it->ifr_name);`

        `if` `(ioctl(sock, SIOCGIFFLAGS, &ifr) == 0) {`

            `if` `(!(ifr.ifr_flags & IFF_LOOPBACK)) {`    `// 忽略回环接口`

                `if` `(ioctl(sock, SIOCGIFHWADDR, &ifr) == 0) {`

                    `success = 1;` `// 成功获取到MAC地址`

                    `break``;`

                `}`

            `}`

        `}` `else` `{`

            `return``;` `// 如果获取接口标志失败，直接返回`

        `}`

    `}`

    `unsigned` `char` `mac_address[6];`

    `if` `(success)` `memcpy``(mac_address, ifr.ifr_hwaddr.sa_data, 6);` `// 复制MAC地址`

    `// 将MAC地址格式化为字符串`

    `sprintf``(mac,`

            `"%02x:%02x:%02x:%02x:%02x:%02x"``,`

            `mac_address[0],`

            `mac_address[1],`

            `mac_address[2],`

            `mac_address[3],`

            `mac_address[4],`

            `mac_address[5]);`

    `close(sock);` `// 关闭套接字`

`}`

在基于网络接口获取MAC地址的方法中，存在以下问题：

一台机器可能包含多个网络接口，例如物理网络接口（如eth0）、虚拟网络接口（如docker0、l4tbr0、dummy0、rndis0）、USB网络接口（如usb0、usb1、usb2）和无线网络接口（如wlan0）。每个接口都有独立的MAC地址，导致获取到的MAC地址可能会因选择不同的接口而变化，无法保证唯一性和一致性。

1.  **虚拟网络接口（当获取到这个的mac地址时极有可能造成大量注册）**：
    
    *   机器上可能存在多种虚拟网络接口，如Docker容器创建的docker0、L4T环境下的l4tbr0、以及其他虚拟接口（dummy0、rndis0）。
    *   这些虚拟接口的MAC地址通常是动态生成的，可能在不同的环境或设备重启后发生变化，因此不适合作为设备的唯一标识。
2.  **本地回环接口**：
    
    *   本地回环接口（lo）没有MAC地址，不能用于标识设备。
3.  **USB网络接口**：
    
    *   USB网络接口（如usb0、usb1、usb2）的MAC地址可能在不同设备或USB端口连接中发生变化，缺乏稳定性和一致性。
4.  **无线网络接口**：
    
    *   虽然无线网络接口（wlan0）的MAC地址在多数情况下是唯一且稳定的，但仍需确认在所有设备上该接口是否存在，并确保它是正确的唯一标识选择。
        

经过验证，waln0的mac地址在设备上唯一并且稳定。不收网络环境和设备重启影响，所以采用此方法获取设备唯一mac地址。

3.3. 解决方法：
----------

修改获取mac地址的方法，直接使用WI-FI网络接口（wlan0）的mac地址,此接口获取到的mac地址唯一。修改后的c++代码如下：

**1**

[?](#)

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

`static` `void` `GenerateMACAddress(``char``* mac)`

`{`

    `// 创建一个套接字，用于与网络接口进行通信`

    `int` `sock = socket(AF_INET, SOCK_DGRAM, 0);`

    `if` `(sock < 0) {`

        `return``;` `// 如果套接字创建失败，直接返回`

    `}`

    `struct` `ifreq ifr{};`

    `strcpy``(ifr.ifr_name,` `"wlan0"``);` `// 设置接口名称为wlan0`

    `// 获取接口标志，确保接口存在`

    `if` `(ioctl(sock, SIOCGIFFLAGS, &ifr) == 0) {`

        `// 获取接口的MAC地址`

        `if` `(ioctl(sock, SIOCGIFHWADDR, &ifr) == 0) {`

            `unsigned` `char``* mac_address = (unsigned` `char``*)ifr.ifr_hwaddr.sa_data;`

            `// 格式化MAC地址为字符串`

            `sprintf``(mac,`

                    `"%02x:%02x:%02x:%02x:%02x:%02x"``,`

                    `mac_address[0],`

                    `mac_address[1],`

                    `mac_address[2],`

                    `mac_address[3],`

                    `mac_address[4],`

                    `mac_address[5]);`

        `}`

    `}`

    `close(sock);` `// 关闭套接字`

`}`

修改代码，推送新版本到设备重新运行后，解决授权注册数增加迅速问题。  
  
总结：此次问题的解决经验表明，在多网络接口的设备上获取唯一标识时，应优先选用具有一致性和唯一性的接口（如`wlan0`），以避免不必要的注册和授权问题。此外，在涉及设备唯一性标识的场景中，确保一致性和稳定性是至关重要的。

  
  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)