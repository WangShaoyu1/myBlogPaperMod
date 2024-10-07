---
author: "好看的HK"
title: "对于Docker和Podman的一点使用经验"
date: 2024-05-10
description: "前言：本文会以多个实际的线上例子，分享自己对于Docker和Podman的一点使用经验及踩过的坑，希望对读者有一点帮助。"
tags: ["容器"]
ShowReadingTime: "阅读7分钟"
weight: 254
---
前言：本文会以多个实际的线上例子，分享自己对于Docker和Podman的一点使用经验及踩过的坑，希望对读者有一点帮助。

本文bash脚本初步加工后可直接使用（兼容mac和linux系统），对于关键点会有注重说明，但是对于一些细节需要读者自行去查阅相关文档，这里不会具体展开。

一、部署Apollo
----------

### 1、docker脚本

bash

 代码解读

复制代码

`version=2.0.1 dbhost_port=host.docker.internal:3306 dbuser=root dbpwd=xxxx docker stop apollo-configservice && docker rm apollo-configservice docker stop apollo-adminservice && docker rm apollo-adminservice docker stop apollo-portal && docker rm apollo-portal docker run -p 28080:8080 \   --init \   --add-host=host.docker.internal:host-gateway \   -v /etc/localtime:/etc/localtime:ro \   -e SPRING_DATASOURCE_URL="jdbc:mysql://$dbhost_port/ApolloConfigDB?characterEncoding=utf8" \   -e SPRING_DATASOURCE_USERNAME=$dbuser \   -e SPRING_DATASOURCE_PASSWORD=$dbpwd \   -e ENV=dev \   -e JAVA_OPTS='-Xmx128m -Xms128m' \   -d -v /tmp/logs:/opt/logs --name apollo-configservice apolloconfig/apollo-configservice:$version sleep 30s docker run -p 28090:8090 \   --init \   --add-host=host.docker.internal:host-gateway \   --link apollo-configservice:apollo-configservice \   -v /etc/localtime:/etc/localtime:ro \   -e SPRING_DATASOURCE_URL="jdbc:mysql://$dbhost_port/ApolloConfigDB?characterEncoding=utf8" \   -e SPRING_DATASOURCE_USERNAME=$dbuser \   -e SPRING_DATASOURCE_PASSWORD=$dbpwd \   -e ENV=dev \   -e JAVA_OPTS='-Xmx128m -Xms128m' \   -d -v /tmp/logs:/opt/logs --name apollo-adminservice apolloconfig/apollo-adminservice:$version sleep 30s docker run -p 28070:8070 \   --init \   --link apollo-configservice:apollo-configservice \   --add-host=host.docker.internal:host-gateway \   -v /etc/localtime:/etc/localtime:ro \   -e SPRING_DATASOURCE_URL="jdbc:mysql://$dbhost_port/ApolloPortalDB?characterEncoding=utf8" \   -e SPRING_DATASOURCE_USERNAME=$dbuser \   -e SPRING_DATASOURCE_PASSWORD=$dbpwd \   -e APOLLO_PORTAL_ENVS=dev,prd \   -e DEV_META=http://host.docker.internal:28080 \   -e PRD_META=http://host.docker.internal:28080 \   -e ENV=dev \   -e JAVA_OPTS='-Xmx128m -Xms128m' \   -d -v /tmp/logs:/opt/logs --name apollo-portal apolloconfig/apollo-portal:$version    echo "apollo启动完成"`

### 2、podman脚本

bash

 代码解读

复制代码

`podman stop apollo-configservice && podman rm apollo-configservice podman run -p 28080:8080 \   -d --rm \   -v /etc/localtime:/etc/localtime:ro \   -e SPRING_DATASOURCE_URL="jdbc:mysql://host.containers.internal:3306/ApolloConfigDB?characterEncoding=utf8" \   -e SPRING_DATASOURCE_USERNAME=root \   -e SPRING_DATASOURCE_PASSWORD=xxxx \   -e ENV=dev \   -e JAVA_OPTS='-Xmx128m -Xms128m' \    --name apollo-configservice apolloconfig/apollo-configservice:2.0.1 sleep 30s podman stop apollo-adminservice && podman rm apollo-adminservice podman run -p 28090:8090 \   -d --rm \   -v /etc/localtime:/etc/localtime:ro \   -e SPRING_DATASOURCE_URL="jdbc:mysql://host.containers.internal:3306/ApolloConfigDB?characterEncoding=utf8" \   -e SPRING_DATASOURCE_USERNAME=root \   -e SPRING_DATASOURCE_PASSWORD=xxxx \   -e ENV=dev \   -e JAVA_OPTS='-Xmx128m -Xms128m' \   --name apollo-adminservice apolloconfig/apollo-adminservice:2.0.1 sleep 30s podman stop apollo-portal && podman rm apollo-portal podman run -p 28070:8070 \   -d --rm\   -v /etc/localtime:/etc/localtime:ro \   -e SPRING_DATASOURCE_URL="jdbc:mysql://host.containers.internal:3306/ApolloPortalDB?characterEncoding=utf8" \   -e SPRING_DATASOURCE_USERNAME=root \   -e SPRING_DATASOURCE_PASSWORD=xxxx \   -e APOLLO_PORTAL_ENVS=dev,prd \   -e DEV_META=http://host.containers.internal:28080 \   -e PRD_META=http://host.containers.internal:28080 \   -e ENV=dev \   -e JAVA_OPTS='-Xmx128m -Xms128m' \   --name apollo-portal apolloconfig/apollo-portal:2.0.1 sleep 30s echo "apollo启动完成"`

### 3、注意事项

1.  docker里面容器可以通过 **host.docker.internal** 来访问宿主机，而podman容器里面是通过 **host.containers.internal** 来访问宿主机，注意区分。
    
2.  docker里面可以通过 **\--link** 参数来连接两个容器的网络，使得容器之间可以互相通过 **\--name** 指定的容器名 + 端口来访问。但podman不行，即使显式指定 **\--hostname** 也不行。podman两个容器之间只能通过 **ip** 地址来访问，可以用 **\--ip** 参数显式指定ip。ip的网段是10.88.0.0/16，个数为2^16 - 2 = 65536 -2 = 65534个 。
    
3.  对于第2条，在mac高版本上是不适用的（即容器之间可以通过hostname来访问），虽然翻遍了官方文档，也没找到支持的论据，只能怀疑是高版本的feature（linux podman版本4.4.1，mac podman版本4.8.3）。
    
4.  不要使用docker-compose，自己写bash脚本更为灵活自主可控。
    
5.  podman和docke命令可以互相替换，一般来说podman已经内置了命令转换功能，如果没有的话，可以通过下面代码来实现在脚本中的命令互换（脚本跟命令行的实现方式不一样）
    

bash

 代码解读

复制代码

`#!/bin/bash # 参考链接：https://blog.51cto.com/u_15162069/2780080?articleABtest=1 # 已前置设置 alias docker=podman shopt -s expand_aliases source ~/.bash_profile alias # 使用which命令判断命令是否存在 if which docker >/dev/null 2>&1; then echo "use docker" else echo "use podman replace docker" docker -v fi # put your docker or podman command in here`

二、部署kafka
---------

### 1、docker脚本

bash

 代码解读

复制代码

`docker stop zookeeper && docker rm zookeeper # https://hub.docker.com/r/bitnami/zookeeper docker run -d --name zookeeper \  -p 2181:2181 \  --network=common_container_network \  -v /home/data/docker/bitnami/zookeeper:/bitnami \  -e TZ=CST-8 \  -e ALLOW_ANONYMOUS_LOGIN=YES \  bitnami/zookeeper:3.9 sleep 5s docker stop kafka && docker rm kafka docker run -d --name kafka \  -p 19092:19092 \  --network=common_container_network \  -v /home/data/docker/bitnami/kafka:/bitnami \  -e KAFKA_HEAP_OPTS='-Xmx512m -Xms512m' \  -e KAFKA_CFG_NODE_ID=0 \  -e TZ=CST-8 \  -e KAFKA_CFG_ZOOKEEPER_CONNECT=zookeeper:2181 \  -e KAFKA_CFG_LISTENERS=INTERNAL://:9092,EXTERNAL://:127.0.0.1:19092 \  -e KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT \  -e KAFKA_CFG_ADVERTISED_LISTENERS=INTERNAL://:9092,EXTERNAL://127.0.0.1:19092 \  -e KAFKA_CFG_LISTENERS=INTERNAL://:9092,EXTERNAL://:19092 \  -e KAFKA_CFG_INTER_BROKER_LISTENER_NAME=INTERNAL \  bitnami/kafka:3.4 sleep 20s docker stop kafka-exporter && docker rm kafka-exporter docker run -d --name kafka-exporter \  --restart=no \  --network=common_container_network \  -u root \  -p 19308:19308 \  danielqsj/kafka-exporter:v1.7.0 \  --web.listen-address=:19308 \  --kafka.server=kafka:9092 \  --kafka.version=3.4.1`

### 2、podman脚本

bash

 代码解读

复制代码

`docker stop zookeeper && docker rm zookeeper podman run -d --name=zookeeper --ip=10.88.222.1\   -p 2181:2181 \   -v /home/data/docker/bitnami:/bitnami \   -e TZ=CST-8 \   -e ALLOW_ANONYMOUS_LOGIN=YES \   bitnami/zookeeper:3.9 sleep 5s docker stop kafka && docker rm kafka docker run -d --name=kafka --ip=10.88.222.2 \   -p 19092:19092 \   -v /home/data/docker/bitnami:/bitnami \   -e KAFKA_HEAP_OPTS='-Xmx512m -Xms512m' \   -e KAFKA_CFG_NODE_ID=0 \   -e TZ=CST-8 \   -e KAFKA_CFG_ZOOKEEPER_CONNECT=10.88.222.1:2181 \   -e KAFKA_CFG_LISTENERS=INTERNAL://:9092,EXTERNAL://:172.18.159.144:19092 \   -e KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT \   -e KAFKA_CFG_ADVERTISED_LISTENERS=INTERNAL://:9092,EXTERNAL://47.119.23.205:19092 \   -e KAFKA_CFG_LISTENERS=INTERNAL://:9092,EXTERNAL://:19092 \   -e KAFKA_CFG_INTER_BROKER_LISTENER_NAME=INTERNAL \   bitnami/kafka:3.4 sleep 10s docker stop kafka-exporter && docker rm kafka-exporter docker run -d --name kafka-exporter \   --restart=no \   -u root \   -p 19308:19308 \   danielqsj/kafka-exporter:v1.7.0 \   --web.listen-address=:19308 \   --kafka.server=10.88.222.2:9092 \   --kafka.version=3.4.1`

### 3、注意事项

1.  注意bitnami的镜像都是rootless，但在笔者mac下，无论怎样做（已尽最大努力尝试，建议直接放弃），都不能实现文件的正确挂载。linux可以正常挂载。
2.  docker只有容器的概念，而podman里面有 **容器** 和 **Pod** 的概念。多个容器可以在同一个pod，由pod统一管理端口映射，且pod里面容器共享网络，此时容器直接可以直接通过localhost + 端口来互相访问。
3.  注意对于kafka的一些设置，**KAFKA\_CFG\_ADVERTISED\_LISTENERS** 用于设置暴露在外网的连接地址，**KAFKA\_CFG\_LISTENERS** 用于设置暴露在内网的连接地址，这两个地址都会注册到zk上。
4.  kafka其实也可以不依赖zk，高版本已经内置KRaft（v2.8+），成熟度不详。
5.  **\--param** 参数如果放在镜像名称之前，代表docker的参数设置，之后，则是对于镜像的参数设置。

三、部署Prometheus
--------------

### 1、docker脚本

bash

 代码解读

复制代码

`docker stop prometheus && docker rm prometheus # prometheus docker run -d \   --restart=no \   -u root \   --name prometheus \  --network=common_container_network \   --add-host=host.docker.internal:host-gateway \   -p 19090:19090 \   -v /home/data/docker/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml \   -v /home/data/docker/prometheus/data:/prometheus \   -v /etc/localtime:/etc/localtime:ro \   prom/prometheus:v2.37.0 \   --storage.tsdb.retention.time=30d \   --storage.tsdb.path=/prometheus \   --config.file=/etc/prometheus/prometheus.yml \   --web.enable-lifecycle \   --web.listen-address=:19090 docker stop alertmanager && docker rm alertmanager # alertmanager docker run -d \   --restart=no \   -u root \   --name alertmanager \  --network=common_container_network \   --add-host=host.docker.internal:host-gateway \   -p 19093:19093 \   -v /home/data/docker/prometheus/alertmanager:/etc/prometheus/alertmanager \   -v /etc/localtime:/etc/localtime:ro \   prom/alertmanager:v0.25.0 \   --config.file=/etc/prometheus/alertmanager/alertmanager.yml \   --storage.path="/etc/prometheus/alertmanager" \   --data.retention=120h \   --web.listen-address=:19093 docker stop node-exporter && docker rm node-exporter # node-exporter docker run -d --name=node-exporter \   --restart=no \   -u root \  --network=common_container_network \   --add-host=host.docker.internal:host-gateway \   -p 19100:19100 \   -v "/proc:/host/proc" \   -v "/sys:/host/sys" \   -v "/:/rootfs" \   prom/node-exporter:v1.6.0 \   --path.rootfs=/host \   --web.listen-address=:19100 \   --path.procfs /host/proc --path.sysfs /host/sys \   --collector.filesystem.ignored-mount-points "^/(sys|proc|dev|host|etc)($|/)"`

### 2、podman脚本

bash

 代码解读

复制代码

`docker stop prometheus && docker rm prometheus docker run -d --rm \   --restart=no \   -u root \   --name prometheus \   -p 19090:19090 \   -v /home/data/docker/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml \   -v /home/data/docker/prometheus/data:/prometheus \   -v /etc/localtime:/etc/localtime:ro \   prom/prometheus:v2.37.0 \   --storage.tsdb.retention.time=30d \   --storage.tsdb.path=/prometheus \   --config.file=/etc/prometheus/prometheus.yml \   --web.enable-lifecycle \   --web.listen-address=:19090 docker stop alertmanager && docker rm alertmanager docker run -d --rm \   --restart=no \   -u root \   --name alertmanager \   -p 19093:19093 \   -v /home/data/docker/prometheus/alertmanager:/etc/prometheus/alertmanager \   -v /etc/localtime:/etc/localtime:ro \   prom/alertmanager:v0.25.0 \   --config.file=/etc/prometheus/alertmanager/alertmanager.yml \   --storage.path="/etc/prometheus/alertmanager" \   --data.retention=120h \   --web.listen-address=:19093 docker stop node-exporter && docker rm node-exporter docker run -d --name=node-exporter \   --restart=no \   -u root \   -p 19100:19100 \   -v "/proc:/host/proc" \   -v "/sys:/host/sys" \   -v "/:/rootfs" \   prom/node-exporter:v1.6.0 \   --path.rootfs=/host \   --web.listen-address=:19100 \   --path.procfs /host/proc --path.sysfs /host/sys \   --collector.filesystem.ignored-mount-points "^/(sys|proc|dev|host|etc)($|/)"`

### 3、部署grafana

bash

 代码解读

复制代码

`# docker和grafana可以混用 # 可以对配置文件进行充分定制 docker stop grafana && docker rm grafana docker run -d --restart=no \   -u root \   --name=grafana \   -v /home/data/docker/grafana/grafana.ini:/etc/grafana/grafana.ini \   -p 13000:13000 \   -v /etc/localtime:/etc/localtime:ro \   grafana/grafana-enterprise:10.2.3 \   --config=/etc/grafana/grafana.ini`

有一说一，grafana是真的香，功能是真的多。后面就直接使用grafana内置功能来做监控报表的数据展示了，不单独写UI界面了，敬请期待~

四、相关命令汇总
--------

以下是一些可能会经常用到的命令，这里也简单列一下：

bash

 代码解读

复制代码

`# 间接实现多行注释 if false; then   # 快速运行   docker run -d -p 19093:19093 --name alertmanager prom/alertmanager:v0.25.0   # 查看镜像详细信息   docker inspect grafana   # 进入镜像命令行   docker exec -it grafana sh   # 查看日志   docker logs grafana   # 查看容器详细信息   docker stats grafana   # 复制目录到远程服务器   scp -r /Users/huangkui/work/online/docker/apollo root@110.42.230.56:/home/data/docker   # 复制远程服务器文件到本地   scp -r root@110.42.230.56:/usr/lib/bin/jmap /Users/huangkui/work/xiaokui/docker/apollo/prd   # 从容器内部复制文件出来   docker cp 04b4dd7569cf:/apollo/scripts/startup.sh /Users/huangkui/work/docker/apollo   # 复制文件到容器内部去   docker cp /Users/huangkui/work/xiaokui/docker/apollo/jmap  apollo:/usr/lib/jvm/jre/bin   # 重启服务 Prometheus   curl -XPOST http://localhost:19090/-/reload   # 重启服务 AlertManager   curl -XPOST http://localhost:19093/-/reload   # 输入指定字符到文件   echo "hello world" >> test.txt   # 修改文件夹所有者   sudo chown -R 1001:1001 /Users/huangkui/home/data/docker/bitnami   # 修改文件权限   sudo chmod -R 777 /Users/huangkui/home/data/docker/bitnami   # 停止然后移除容器，不建议使用--rm参数，当容器启动异常时会丢失日志信息   docker stop grafana && docker rm grafana fi`

五、一键部署脚本
--------

暂未发现其必要性，待补充。

欢迎关注微信公众号：**好看的HK**，第一时间掌握Java最新黑科技，轻轻松松进大厂！