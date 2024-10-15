---
author: "王宇"
title: "Dockerversion26.1.3安装，中科大源"
date: 六月13,2024
description: "Docker相关"
tags: ["Docker相关"]
ShowReadingTime: "12s"
weight: 278
---
    cd /mnt
    ls
    sudo wget https://mirrors.ustc.edu.cn/docker-ce/linux/static/stable/aarch64/docker-26.1.3.tgz
    ls
    sudo tar -xvf docker-26.1.3.tgz
    ls
    #此处停止docker和容器，否则cp命令显示文件忙碌
    sudo systemctl stop docker
    sudo systemctl stop containerd
    sudo cp ./docker/* /usr/bin/
    
    sudo tee /etc/systemd/system/docker.service > /dev/null << 'EOF'
    [Unit]
    Description=Docker Application Container Engine
    Documentation=http://docs.docker.io
    
    [Service]
    ExecStart=/usr/bin/dockerd
    ExecReload=/bin/kill -s HUP $MAINPID
    Restart=on-failure
    RestartSec=5
    LimitNOFILE=infinity
    LimitNPROC=infinity
    LimitCORE=infinity
    Delegate=yes
    KillMode=process
    
    [Install]
    WantedBy=multi-user.target
    EOF
    
    cat docker.service
    systemctl start docker.service
    systemctl status docker.service
    

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)