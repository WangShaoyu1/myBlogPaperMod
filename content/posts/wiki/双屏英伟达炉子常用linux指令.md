---
author: "王宇"
title: "双屏英伟达炉子常用linux指令"
date: 九月05,2024
description: "双屏英伟达DW223"
tags: ["双屏英伟达DW223"]
ShowReadingTime: "12s"
weight: 178
---
**虚拟人目录**

cd /home/yingzi/workspace/yingzi-nvidia-vdh-dualscreen2

**获取虚拟人最新代码**  
git pull origin

**编译并运行虚拟人进程**

./build\_run.sh

**进入产测模式**

vim /data/work/DevInfo.ini （LaunchMode等于0、1分别代表工厂、用户模式）

**icaservice服务的日志路径**

/data/icaservice/logs/main.log

**杀掉虚拟人进程**

./kill.sh yingzi\_vdh-temp

**查看虚拟人进程**

ps aux | grep yingzi\_vdh-temp

**给某个文件夹下的文件授权**

find /opt/dw223\_app -type f -exec chmod +x {} \\;

**查看虚拟人日志**

tail -f /home/yingzi/workspace/vdh/yingzi\_vdh.log

[?](#)

`2.1``、应用日志目录：/data/work`

`2.2``、destktop.log、cloud-service.log、heatingserver.log`

`2.3``、应用目录：/opt/dw223_app`

`2.4``、查看应用进程：ps -ef|grep shuying`

`2.5``、首次安装环境需要配置`

`2.5``.``1``、dw223_fw.tar.gz  （sudo tar -xvf dw223_fw.tar.gz）(这个找研发获取最新)`

`2.5``.``2``、fw_install.sh （sudo chmod +x fw_install.sh）`

`2.5``.``3``、解压dw223_fw.tar.gz之后，在当前文件夹用户权限非yingzi时，可以使用命令修改`

`2.5``.``3.1``、sudo chown yingzi:yingzi -R /data/work   或  sudo chown yingzi:yingzi -R ./`

`2.6``、执行以上动作后，如果桌面文件无法启动：cookie_app.desktop  ，将此文件拷贝至： ~/.config/autostart/cookie_app.desktop`

`2.6``.``1``、拷贝成功后，无须执行任何命令，系统会自动检测`

`2.7``、重启app应用：sudo systemctl restart dw223-copy-run.service`

[?](#)

`安装icaservice服务`

`pip install icaservice==``1.0``.``4.175` `--index-url https:``//yzdevapi:FUHLO4cVj4MnjNHstY17rK0Y@devpi-mirrors.yingzi.com/devpiuser/yingzi --extra-index-url [https://devpiuser](https://devpiuser):Shadow.devpi@devpi-mirrors.yingzi.com/devpiuser/yingzi --trusted-host devpi-server.yingzi.com`

`升级之后，重启一下服务`

`sudo systemctl restart icaservice`

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)