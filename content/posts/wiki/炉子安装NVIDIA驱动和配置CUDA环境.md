---
author: "王宇"
title: "炉子安装NVIDIA驱动和配置CUDA环境"
date: 六月27,2024
description: "赵吉山"
tags: ["赵吉山"]
ShowReadingTime: "12s"
weight: 299
---
以下是详细的步骤，记录了在 Ubuntu 22.04 上安装 NVIDIA JetPack、配置 CUDA 环境以及配置 Docker 以支持 GPU 的过程。

#### 1\. 安装 JetPack 开发工具包

安装 JetPack 开发工具包：

[?](#)

`sudo apt install nvidia-jetpack`

#### 2\. 检查 CUDA 版本和驱动程序版本

安装完成后，检查 CUDA 和驱动程序版本：

[?](#)

`# 检查 CUDA 版本`

`nvcc --version`

`# 检查驱动程序版本`

`nvidia-smi`

如果遇到 `nvcc: command not found` 错误，继续以下步骤。

#### 3\. 配置 CUDA 环境

##### 3.1 验证 CUDA 是否已安装

确认 CUDA 是否已安装在系统中。通常，JetPack 安装完成后，CUDA 会被安装在 `/usr/local/cuda` 目录中。

[?](#)

`ls /usr/local/cuda`

如果该目录存在，则 CUDA 已安装。

##### 3.2 添加 CUDA 路径到环境变量

打开或编辑你的 shell 配置文件（例如 `.bashrc` 或 `.zshrc`），在文件末尾添加以下行：

[?](#)

`export PATH=/usr/local/cuda/bin:$PATH`

`export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH`

保存文件并使更改生效：

[?](#)

`source ~/.bashrc`

##### 3.3 验证安装

现在再运行 `nvcc --version` 命令以确认 CUDA 工具链是否已正确配置：

[?](#)

`nvcc --version`

#### 4\. 配置 Docker 使用 NVIDIA 运行时

确保 Docker 配置文件正确设置为使用 NVIDIA 运行时。编辑或创建 `/etc/docker/daemon.json` 文件并添加以下内容：

[?](#)

`{`

  `"default-runtime"``:` `"nvidia"``,`

  `"runtimes"``: {`

    `"nvidia"``: {`

      `"path"``:` `"nvidia-container-runtime"``,`

      `"runtimeArgs"``: []`

    `}`

  `}`

`}`

然后重启 Docker 服务：

[?](#)

`sudo systemctl restart docker`

### 5\. 运行带 GPU 支持的 Docker 容器

使用以下命令运行你的 Docker 容器：

[?](#)

`sudo docker run --gpus all \`

   `--device /dev/snd:/dev/snd \`

   `--device /dev/video0:/dev/video0 \`

   `-v /run/user/``1000``/pulse:/run/user/``1000``/pulse \`

   `-v /tmp/.X11-unix:/tmp/.X11-unix \`

   `-v /usr/share/alsa/alsa.conf:/usr/share/alsa/alsa.conf \`

   `-v /etc/asound.conf:/etc/asound.conf \`

   `-v ~/.config/pulse/cookie:/root/.config/pulse/cookie \`

   `-e PULSE_SERVER=unix:/run/user/``1000``/pulse/``native` `\`

   `-e DISPLAY=$DISPLAY \`

   `--privileged -it \`

   `acrembeddedfttdeveastus2001.azurecr.io/avatarmodule:``0.0``.``1``-arm64v8`

### 其他注意事项

1.  **Docker 版本**: 确保你使用的是最新版本的 Docker。某些旧版本可能不完全支持 `--gpus` 参数。
2.  **驱动兼容性**: 确保你的 NVIDIA 驱动与 CUDA 版本兼容。

通过这些步骤，你应该能够解决 Docker 容器未能正确识别 GPU 的问题。如果问题依然存在，请检查系统日志以获取更多详细的错误信息。

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)