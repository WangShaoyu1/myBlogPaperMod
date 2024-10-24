---
author: "MacroZheng"
title: "还在用Jenkins？试试Gitlab的CICD功能吧，贼带劲！"
date: 2021-07-27
description: "最近发现Gitlab的CICD功能也能实现自动化部署，如果你用它作为Git仓库的话，不妨试试它的CICD功能。本文还是以SpringBoot的自动化部署为例，实践下它的CIDI功能。"
tags: ["Java","后端","Git中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:130,comments:5,collects:236,views:13831,"
---
> SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

之前写过一篇文章[《再见 Jenkins ！几行脚本搞定自动化部署，这款神器有点厉害！》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FIE8TD4x-BKdobiTrBdLAiw "https://mp.weixin.qq.com/s/IE8TD4x-BKdobiTrBdLAiw") ,讲的是使用Gogs+Drone来实现自动化部署。最近发现Gitlab的CI/CD功能也能实现自动化部署，用起来也挺简单！如果你使用的是Gitlab作为Git仓库的话，不妨试试它的CI/CD功能。本文还是以SpringBoot的自动化部署为例，实践下Gitlab的CI/DI功能，希望对大家有所帮助！

安装
--

> 通过Gitlab的CI/CD功能实现自动化部署，我们需要安装Gitlab、Gitlab Runner、Maven这些服务。

### 安装Gitlab

> 首先我们来安装下Gitlab，对Gitlab安装和使用不了解的朋友可以参考下[《10分钟搭建自己的Git仓库》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2F6GyYlR9lpVcjgYmHMYLi0w "https://mp.weixin.qq.com/s/6GyYlR9lpVcjgYmHMYLi0w") 。

*   使用如下命令运行Gitlab服务，这里需要注意的是添加了`hostname`属性，这样我们就可以通过域名来访问Gitlab了（为了避免一些不必要的麻烦），`GITLAB_ROOT_PASSWORD`这个环境变量可以直接设置Gitlab中root账号的密码；

```bash
docker run --detach \
--hostname git.macrozheng.com \
--publish 10443:443 --publish 1080:80 --publish 1022:22 \
--name gitlab \
--restart always \
--volume /mydata/gitlab/config:/etc/gitlab \
--volume /mydata/gitlab/logs:/var/log/gitlab \
--volume /mydata/gitlab/data:/var/opt/gitlab \
-e GITLAB_ROOT_PASSWORD=12345678 \
gitlab/gitlab-ce:latest
```

*   我们需要通过`git.macrozheng.com`这个域名来访问Gitlab，如果你没有域名的话，可以通过修改本机的host文件来实现；

```
192.168.7.134 git.macrozheng.com
```

*   由于我们的Gitlab运行在`1080`端口上，我们想要不加端口来访问，可以使用Nginx来反向代理下，对Nginx不熟悉的朋友可以看下[《Nginx的这些妙用，你肯定有不知道的！》](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2F9VZi2suAlomu1IRGy-qdCA "https://mp.weixin.qq.com/s/9VZi2suAlomu1IRGy-qdCA") ，在Nginx的配置文件夹中添加`git.conf`配置文件，内容如下：

```ini
    server {
    listen       80; # 同时支持HTTP
    server_name  git.macrozheng.com; #修改域名
    
        location / {
        proxy_pass   http://192.168.7.134:1080; # 设置代理服务访问地址
        index  index.html index.htm;
    }
    
    error_page   500 502 503 504  /50x.html;
        location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```

*   之后我们就可以通过`git.macrozheng.com`这个域名来访问Gitlab了，输入账号密码`root:12345678`即可登录；

![](/images/jueJin/0c438e60c9c64f0.png)

*   将我们的SpringBoot应用代码上传到Gitlab上去，这样Gitlab就准备完毕了！这里需要注意的是，如果你在启动Gitlab的时候没有指定`hostname`的话，你的项目HTTP访问地址会是容器的ID，使用该地址会无法访问Git仓库！

![](/images/jueJin/89f28088d5ea458.png)

### 安装Gitlab Runner

> Gitlab只是个代码仓库，想要实现CI/CD还需安装`gitlab-runner`，`gitlab-runner`相当于Gitlab中任务的执行器，Gitlab会在需要执行任务时调用它。

*   首先下载`gitlab-runner`的Docker镜像，选用`alpine-bleeding`，这个版本非常小巧！

```bash
docker pull gitlab/gitlab-runner:alpine-bleeding
```

*   使用如下命令运行`gitlab-runner`；

```bash
docker run --name gitlab-runner --restart always \
-v /var/run/docker.sock:/var/run/docker.sock \
-v /mydata/gitlab-runner:/etc/gitlab-runner \
-d gitlab/gitlab-runner:alpine-bleeding
```

*   此时我们如果查看`gitlab-runner`的容器日志的话，会发现如下错误，`config.toml`文件找不到，这个问题不必担心，当我们将`gitlab-runner`注册到Gitlab时，会自动生成该文件；

```bash
ERROR: Failed to load config stat /etc/gitlab-runner/config.toml: no such file or directory  builds=0
```

*   接下来我们需要把`gitlab-runner`注册到Gitlab，打开`Project->Settings->CI/CD`功能，获取到runner注册需要使用的地址和token；

![](/images/jueJin/6ab78c278c1a434.png)

*   接下来使用如下命令，进入`gitlab-runner`容器的内部；

```bash
docker exec -it gitlab-runner /bin/bash
```

*   在容器内使用如下命令注册runner；

```bash
gitlab-runner register
```

*   注册时会出现交互界面，提示你输入注册地址、token、执行器类型等信息，ssh执行器能远程执行Linux命令，非常好用，推荐使用这个！

![](/images/jueJin/9ebecb7f5bf4450.png)

*   注册完成后，我们可以发现`config.toml`文件已经生成，内容如下，以后想修改runner配置的时候，直接改这个文件就行了。

```ini
concurrent = 1
check_interval = 0

[session_server]
session_timeout = 1800

[[runners]]
name = "docker-runner"
url = "http://192.168.7.134:1080/"
token = "c2kpV6tX6woL8TMxzBUN"
executor = "ssh"
[runners.custom_build_dir]
[runners.cache]
[runners.cache.s3]
[runners.cache.gcs]
[runners.cache.azure]
[runners.ssh]
user = "root"
password = "123456"
host = "192.168.7.134"
port = "22"
```

*   在Gitlab的CI/CD设置中，我们可以发现，有个runner成功注册了！

![](/images/jueJin/e25f38db0aff450.png)

### 安装Maven

> SpringBoot项目打包需要依赖Maven，我们需要在服务器上先安装好它。

*   下载Maven的Linux安装包，下载地址：[maven.apache.org/download.cg…](https://link.juejin.cn?target=https%3A%2F%2Fmaven.apache.org%2Fdownload.cgi "https://maven.apache.org/download.cgi")

![](/images/jueJin/d13140dd968244a.png)

*   下载完成后使用如下命令解压到指定目录；

```bash
cd /mydata
tar -zxvf apache-maven-3.8.1-bin.tar.gz
```

*   修改`/etc/profile`文件，添加环境变量配置：

```bash
export MAVEN_HOME=/mydata/apache-maven-3.8.1
export PATH=$PATH:$MAVEN_HOME/bin
```

*   通过查看Maven版本来测试是否安装成功。

```bash
mvn -v
``````bash
Maven home: /mydata/apache-maven-3.8.1
Java version: 1.8.0_292, vendor: AdoptOpenJDK, runtime: /mydata/java/jdk1.8/jre
Default locale: en_US, platform encoding: UTF-8
OS name: "linux", version: "3.10.0-957.el7.x86_64", arch: "amd64", family: "unix"
```

### 安装JDK

> CentOS上默认安装的是JRE，使用Maven需要安装JDK。

*   下载JDK 8，下载地址：[mirrors.tuna.tsinghua.edu.cn/AdoptOpenJD…](https://link.juejin.cn?target=https%3A%2F%2Fmirrors.tuna.tsinghua.edu.cn%2FAdoptOpenJDK%2F "https://mirrors.tuna.tsinghua.edu.cn/AdoptOpenJDK/")

![](/images/jueJin/8e781614471f491.png)

*   下载完成后将JDK解压到指定目录；

```bash
cd /mydata/java
tar -zxvf OpenJDK8U-jdk_x64_linux_xxx.tar.gz
mv OpenJDK8U-jdk_x64_linux_xxx.tar.gz jdk1.8
```

*   在`/etc/profile`文件中添加环境变量`JAVA_HOME`。

```bash
vi /etc/profile
# 在profile文件中添加
export JAVA_HOME=/mydata/java/jdk1.8
export PATH=$PATH:$JAVA_HOME/bin
# 使修改后的profile文件生效
. /etc/profile
```

使用
--

> 一切准备就绪，接下来通过Gitlab的CI/CD功能就可以实现SpringBoot应用的自动化部署了！

*   首先在项目的根目录下添加`.gitlab-ci.yml`文件，定义了两个任务，一个任务会将应用代码打包成Jar包并复制到指定目录，另一个任务会通过运行脚本`run.sh`打包应用的Docker镜像并运行；

```yaml
# 打包任务
build-job:
stage: build
# 指定标签，只有具有该标签的runner才会执行
tags:
- docker
script:
# 使用Maven打包
- mvn clean package
# 将jar包、Dockerfile、运行脚本复制到指定目录
- cp target/mall-tiny-gitlab-1.0-SNAPSHOT.jar /mydata/build/mall-tiny-gitlab-1.0-SNAPSHOT.jar
- cp Dockerfile /mydata/build/Dockerfile
- cp run.sh /mydata/build/run.sh

# 部署任务
deploy-job:
stage: deploy
tags:
- docker
script:
# 进入指定目录并执行运行脚本
- cd /mydata/build
- chmod +x run.sh
- ./run.sh
```

*   这里值得一提的是，默认情况下runner只会执行具有相同标签的Job，由于我们对Job和runner都设置了标签为`docker`，所以我们这里是可以执行的。如果你没有设置标签的话，需要在runner的编辑界面设置下让runner可以执行没有标签的Job；

![](/images/jueJin/e1a942fb9b6a412.png)

*   由于我们的`gitlab-runner`采用的是`ssh`的执行器，它会登录到我们指定的服务器，执行我们在`.gitlab-ci.yml`中定义的`script`命令，在此之前还会先从Git仓库中获取代码，所以我们还需修改下服务器上的host文件；

```bash
vim /etc/hosts
192.168.7.134 git.macrozheng.com
```

*   接下来就是要把脚本提交到Git仓库上去，提交后会在`Project->CI/CD->Pipelines`中发现正在执行的任务；

![](/images/jueJin/d3ded90db8f04e9.png)

*   打开Pipeline的详情页面，可以发现我们定义的两个任务都已经执行成功了；

![](/images/jueJin/30b877980adb49b.png)

*   打开Job的详情界面，我们可以看到任务执行过程中输出的日志信息；

![](/images/jueJin/50b399fa2a83467.png)

*   如果你想手动执行Pipeline，而不是提交触发的话，可以在Pipelines页面点击`Run Pipeline`按钮即可；

![](/images/jueJin/f6773bfd4be84b0.png)

*   运行成功后，可以通过如下地址访问项目：[http://192.168.7.134:8088/swagger-ui/](https://link.juejin.cn?target=http%3A%2F%2F192.168.7.134%3A8088%2Fswagger-ui%2F "http://192.168.7.134:8088/swagger-ui/")

![](/images/jueJin/c2e5db3c5050457.png)

总结
--

如果你用Gitlab作为Git仓库的话，使用它的CI/CD功能来实现自动化部署确实很不错！安装一个轻量级`gitlab-runner`，编写简单的`.gitlab-ci.yml`脚本文件即可实现。其实我们之前以及介绍过很多种自动化部署方案，比如Jenkins、Gogs+Drone、Gitlab CI/CD，我们可以发现一个共同点，这些方案都离不开Linux命令。 所以说要想玩转自动化部署，还是得先玩转Linux命令！

参考资料
----

官方文档：[docs.gitlab.com/ee/ci/](https://link.juejin.cn?target=https%3A%2F%2Fdocs.gitlab.com%2Fee%2Fci%2F "https://docs.gitlab.com/ee/ci/")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-gitlab "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-gitlab")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！