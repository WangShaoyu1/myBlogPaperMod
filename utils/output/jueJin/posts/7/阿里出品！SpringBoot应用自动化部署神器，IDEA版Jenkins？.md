---
author: "MacroZheng"
title: "阿里出品！SpringBoot应用自动化部署神器，IDEA版Jenkins？"
date: 2022-06-28
description: "之前分享过一些使用Jenkins进行自动化部署的技巧 ，最近发现一款阿里出品的IDEA插件，不仅支持直接打包应用部署到远程服务器上，而且还能当终端工具使用。试用了一把这个插件，非常不错，推荐给大家！"
tags: ["Java","Spring Boot","后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:292,comments:0,collects:733,views:36368,"
---
> 之前分享过一些[使用Jenkins进行自动化部署的技巧](https://juejin.cn/post/6844904163424337928 "https://juejin.cn/post/6844904163424337928") ，最近发现一款阿里出品的IDEA插件`CloudToolkit`，不仅支持直接打包应用部署到远程服务器上，而且还能当终端工具使用。试用了一把这个插件，非常不错，推荐给大家！装上这个插件，IDEA一站式开发又近了一步！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

CloudToolkit简介
--------------

`CloudToolkit`是阿里出品的一款IDEA插件，通过它我们可以更方便地实现自动化部署，其内置的终端工具和文件上传功能，即使用来管理服务器也非常方便！这款IDEA插件不仅功能强大，而且完全免费！

安装
--

CloudToolkit的安装是非常简单的，直接在IDEA的插件市场中搜索`Cloud Toolkit`然后进行安装即可。

![](/images/jueJin/1549b923624441e.png)

使用
--

> 接下来我们就体验下CloudToolkit的自动化部署功能，以SpringBoot应用打包部署到Docker环境为例，看看它是不是够好用。

### 自动化部署

*   插件安装完成后，打开左侧面板，右键`Host`图标我们就可以添加服务器的连接信息了，实现自动化部署之前需要先配置好连接信息；

![](/images/jueJin/8365c4897c2a431.png)

*   一般情况下我们如果想部署本地SpringBoot应用到Docker环境需要经过如下步骤，使用CloudToolkit我们只要配置好流程即可，这些操作它都会帮我们自动完成；

![](/images/jueJin/0262181956fd463.png)

*   首先准备好打包应用镜像需要的Dockerfile文件；

```dockerfile
# 该镜像需要依赖的基础镜像
FROM java:8
# 将当前目录下的jar包复制到docker容器的/目录下
ADD mall-tiny-deploy-1.0-SNAPSHOT.jar /mall-tiny-deploy-1.0-SNAPSHOT.jar
# 声明服务运行在8088端口
EXPOSE 8088
# 指定docker容器启动时运行jar包
ENTRYPOINT ["java", "-jar","/mall-tiny-deploy-1.0-SNAPSHOT.jar"]
# 指定维护者的名字
MAINTAINER macrozheng
```

*   再准备好可以自动打包应用镜像、创建并运行容器的脚本`run.sh`，这两个脚本的具体使用可以参考[使用Jenkins进行自动化部署的技巧](https://juejin.cn/post/6844904163424337928 "https://juejin.cn/post/6844904163424337928") ；

```bash
#!/usr/bin/env bash
# 定义应用组名
group_name='mall-tiny'
# 定义应用名称
app_name='mall-tiny-deploy'
# 定义应用版本
app_version='1.0-SNAPSHOT'
# 定义应用环境
profile_active='prod'
echo '----copy jar----'
docker stop ${app_name}
echo '----stop container----'
docker rm ${app_name}
echo '----rm container----'
docker rmi ${group_name}/${app_name}:${app_version}
echo '----rm image----'
# 打包编译docker镜像
docker build -t ${group_name}/${app_name}:${app_version} .
echo '----build image----'
docker run -p 8088:8088 --name ${app_name} \
--link mysql:db \
-e 'spring.profiles.active'=${profile_active} \
-e TZ="Asia/Shanghai" \
-v /etc/localtime:/etc/localtime \
-v /mydata/app/${app_name}/logs:/var/logs \
-d ${group_name}/${app_name}:${app_version}
echo '----start container----'
```

*   将这两个文件上传到Linux服务器上，给`run.sh`添加可执行权限；

![](/images/jueJin/68082f3b28cf41d.png)

*   右键需要部署的项目，点击`Deploy to Host`；

![](/images/jueJin/de7efe7320a04a9.png)

*   然后选择把Maven打包的Jar包上传到指定目录，上传完成后执行`run.sh`脚本；

![](/images/jueJin/bebeae33ff894ca.png)

*   接下来编辑下Maven构建的目标，只打包`mall-tiny-deploy`模块即可；

![](/images/jueJin/f5ef3579a30c401.png)

*   然后修改高级设置，配置下查看容器日志的命令；

![](/images/jueJin/b5023af8ee55454.png)

*   最后运行该配置，运行完成后即可直接查看应用运行日志了；

![](/images/jueJin/80e063175eae43d.png)

*   打开应用的Swagger页面查看下，发现已经可以正常访问了，访问地址：[http://192.168.3.105:8088/swagger-ui/](https://link.juejin.cn?target=http%3A%2F%2F192.168.3.105%3A8088%2Fswagger-ui%2F "http://192.168.3.105:8088/swagger-ui/")

![](/images/jueJin/d59f8407d5be4ed.png)

### 常用功能

*   当然CloudToolkit的功能远不止于此，它内置了终端工具，在IDEA中管理Linux服务器，用它就够了，直接通过底部面板，点击`终端`按钮即可打开；

![](/images/jueJin/47665e7668cf42d.png)

*   体验了一把这个终端工具，提示还挺全的，这下还要啥Xshell？

![](/images/jueJin/10a27ab3df304c1.png)

*   通过上传功能可以上传文件，WinSCP也用不着了！

![](/images/jueJin/d8aa2227625a453.png)

总结
--

体验了一把阿里出品的CloudToolkit，做好配置以后，基本可以实现一键部署应用到远程服务器，说它是IDEA版的Jenkins也不为过！其内置的终端工具也是非常好用的，强烈推荐大家尝试一波！

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-deploy "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-deploy")