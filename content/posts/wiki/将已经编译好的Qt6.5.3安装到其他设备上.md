---
author: "王宇"
title: "将已经编译好的Qt6.5.3安装到其他设备上"
date: 七月25,2024
description: "赵吉山"
tags: ["赵吉山"]
ShowReadingTime: "12s"
weight: 281
---
要将已经编译好的 Qt 6.5.3 安装到其他设备上，可以打包已编译的 Qt 库和工具，然后在目标设备上解压并配置相应的环境变量。以下是具体步骤：

### 步骤1：打包已编译的 Qt

在原设备上，将安装路径（如 `/opt/Qt6.5.3`）打包：

[?](#)

`tar` `-cvzf qt-6.5.3-arm64.``tar``.gz -C` `/opt` `Qt6.5.3`

这样会创建一个名为 `qt-6.5.3-arm64.tar.gz` 的压缩包，其中包含了 `/opt/Qt6.5.3` 目录下的所有文件。

### 步骤2：将压缩包复制到目标设备

将 `qt-6.5.3-arm64.tar.gz` 文件复制到目标设备，可以通过 scp、rsync、USB 等方式进行传输。例如使用 scp：

[?](#)

`scp` `qt-6.5.3-arm64.``tar``.gz user@target_device:``/path/to/destination`

### 步骤3：在目标设备上解压并安装

在目标设备上解压传输过来的压缩包：

[?](#)

`tar` `-xvzf qt-6.5.3-arm64.``tar``.gz -C` `/opt`

确保解压后的目录结构为 `/opt/Qt6.5.3`。

### 步骤4：配置环境变量

在目标设备上，编辑 `~/.bashrc` 或 `~/.zshrc` 文件，添加以下行以配置环境变量：

[?](#)

`export` `PATH=``/opt/Qt6``.5.3``/bin``:$PATH`

`export` `LD_LIBRARY_PATH=``/opt/Qt6``.5.3``/lib``:$LD_LIBRARY_PATH`

应用这些更改：

[?](#)

`source` `~/.bashrc`  `# 或者 source ~/.zshrc`

### 步骤5：验证安装

在目标设备上，验证 Qt 是否正确安装：

[?](#)

`qmake --version`

如果命令返回 Qt 6.5.3 的版本信息，则表示安装成功。

### 注意事项

1.  **依赖项**：确保目标设备上已经安装了所有必要的依赖项。可以参考之前步骤中安装的依赖项：
    
    [?](#)
    
    `sudo` `apt-get` `install` `-y build-essential libgl1-mesa-dev libglu1-mesa-dev freeglut3-dev cmake libssl-dev` `make` `git libxcb-xinerama0-dev libxkbcommon-x11-dev libfontconfig1-dev libdbus-1-dev libx11-xcb-dev`
    
2.  **权限**：确保目标设备上的用户有足够的权限来解压和安装文件。如果需要，可以使用 `sudo` 进行解压和安装。
    

通过上述步骤，你可以将已编译好的 Qt 6.5.3 安装到其他 ARM64 架构的设备上，而无需再次从源码进行编译。

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)