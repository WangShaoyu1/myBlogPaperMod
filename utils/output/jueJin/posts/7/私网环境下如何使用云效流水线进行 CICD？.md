---
author: "阿里云云原生"
title: "私网环境下如何使用云效流水线进行 CICD？"
date: 2024-08-07
description: "代码库、制品库等数据资产托管在内部办公网，公网不能访问，希望能够使用云效流水线进行 CICD 的编排和控制。"
tags: ["云原生中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:0,comments:0,collects:1,views:81,"
---
作者：怀虎

场景介绍
----

代码库、制品库等数据资产托管在内部办公网，公网不能访问，希望能够使用云效流水线进行 CICD 的编排和控制。

整体方案
----

云效流水线可以托管用户的私网环境内的机器，并将构建任务调度到这些机器上，从而确保整个构建过程，和代码库和制品库的交互在私网环境下进行。

![图片](/images/jueJin/2b2b76ab35274cb.png)

在主机上安装 Runner 程序， 该程序需要能够访问到云效流水线的服务端，以便从服务端获取任务，并在执行任务的过程中上报日志和状态。

操作实践
----

### 3.1 创建私有构建集群

进入云效 Flow 首页 -> **全局设置** -> **构建集群管理**页面：

1）点击**新建构建集群**，填入基础信息之后，完成私有构建集群创建。

![图片](/images/jueJin/49c00aaca85a484.png)

2）进入私有构建集群，点击**接入新节点**，可以选择不同的方式接入构建节点。支持阿里云 ECS 的 Linux 和 Windows 机器，或者自己的 Linux、Windows 及 macOS机器，可以按需选择。

*   如果是自己的机器，则可以选择**手动安装 Runner** 方式添加机器。复制 Runner 安装命令，在机器上执行，即可安装好 Runner 程序，该程序会是以服务的形式常驻在机器上，详见 Runner 文档。
*   如果是阿里云 ECS 机器，则可以选择**阿里云 ECS** 方式添加机器，流水线会调用云助手 API 自动安装好 Runner 程序。

![图片](/images/jueJin/3d12dd3a1b9a438.png)

![图片](/images/jueJin/8189c4bc32d24c1.png)

3）创建好私有构建集群之后，就可以创建流水线，并选择这个构建集群执行流水线任务了。

### 3.2 创建代码库服务连接

假设你内网的代码托管地址是 \*[myrepo.com\*，为了在构建过程中和代码服务进行交互，需要配置代码库的服务连接。](https://link.juejin.cn?target=https%3A%2F%2Fmyrepo.com*%25EF%25BC%258C%25E4%25B8%25BA%25E4%25BA%2586%25E5%259C%25A8%25E6%259E%2584%25E5%25BB%25BA%25E8%25BF%2587%25E7%25A8%258B%25E4%25B8%25AD%25E5%2592%258C%25E4%25BB%25A3%25E7%25A0%2581%25E6%259C%258D%25E5%258A%25A1%25E8%25BF%259B%25E8%25A1%258C%25E4%25BA%25A4%25E4%25BA%2592%25EF%25BC%258C%25E9%259C%2580%25E8%25A6%2581%25E9%2585%258D%25E7%25BD%25AE%25E4%25BB%25A3%25E7%25A0%2581%25E5%25BA%2593%25E7%259A%2584%25E6%259C%258D%25E5%258A%25A1%25E8%25BF%259E%25E6%258E%25A5%25E3%2580%2582 "https://myrepo.com*%EF%BC%8C%E4%B8%BA%E4%BA%86%E5%9C%A8%E6%9E%84%E5%BB%BA%E8%BF%87%E7%A8%8B%E4%B8%AD%E5%92%8C%E4%BB%A3%E7%A0%81%E6%9C%8D%E5%8A%A1%E8%BF%9B%E8%A1%8C%E4%BA%A4%E4%BA%92%EF%BC%8C%E9%9C%80%E8%A6%81%E9%85%8D%E7%BD%AE%E4%BB%A3%E7%A0%81%E5%BA%93%E7%9A%84%E6%9C%8D%E5%8A%A1%E8%BF%9E%E6%8E%A5%E3%80%82")

云效 Flow 首页 -> **全局设置** -> **服务连接管理**页面：

1）点击**新建服务连接**，并选择**通用 Git** 服务连接类型。

![图片](/images/jueJin/bf54a8dc216848a.png)

2）点击**下一步**，点击新建**服务授权/证书**，输入账密信息。

![图片](/images/jueJin/a03e539104c4444.png)

![图片](/images/jueJin/aaf3c4074c8d47f.png)

3）点击**确定**完成证书创建，回到服务连接页面，该证书会自动被选中，点击**创建**即可完成服务连接的创建。

![图片](/images/jueJin/6956dd3ea7444dd.png)

### 3.3 创建流水线，配置代码源和构建任务

进入云效 Flow 首页 -> **我的流水线**页面，点击新建流水线，选择空模板，可以选择**可视化编排**或者 **YAML 化编排**任一种方式创建流水线。下面以 YAML 化流水线编排为示例。

1）输入代码源配置 YAML，在 serviceConnection 关键字后面键入空格会进行自动补全，可以看到刚才创建的那个服务连接，并进行选择。

![图片](/images/jueJin/45860e7001b7435.png)

```yaml
sources:
my_repo:
type: git
name: 我的代码源
endpoint: http://myrepo.com/ns/code-repo.git  # 请换成你自己的代码仓库地址
branch: master
triggerEvents: push
certificate:
type: serviceConnection
serviceConnection: <your-service-connection-id>  # 请替换成上述创建好的服务连接ID
```

2）输入构建配置 YAML，在 runsOn 关键字后面键入空格会进行自动补全，可以看到刚才创建的私有构建集群，并进行选择。

![图片](/images/jueJin/6f1ddefdd29940b.png)

```yaml
sources:
my_repo:
type: git
name: 我的代码源
endpoint: http://myrepo.com/ns/code-repo.git  # 请换成你自己的代码仓库地址
branch: master
triggerEvents: push
certificate:
type: serviceConnection
serviceConnection: <your-service-connection-id>  # 请替换成上述创建好的服务连接ID


stages:
build_stage:
name: 构建阶段
jobs:
build_job:
name: 构建任务
runsOn: <your-build-cluster-id>  # 请替换成上述创建好的私有构建集群ID
steps:
build_step:
step: JavaBuild
name: java构建
with:
jdkVersion: "1.8"
mavenVersion: "3.5.2"
run: "mvn -B clean package -Dmaven.test.skip=true -Dautoconfig.skip\n"
```

3）根据实际情况填入你自己的代码仓库地址、服务链接 ID、私有构建集群 ID 之后，保存并运行流水线。

### 3.3 运行流水线，执行代码拉取和构建任务

运行上述配置好的流水线，点击查看构建任务日志，可以看到构建任务运行在你自己的私有构建机器上，只需要你自己的私有构建机器能够访问到你的代码仓库即可，无需代码仓库出公网。

![图片](/images/jueJin/6fb5f97570c4425.png)

_**更多参考**_

在了解了上述基本用法后，可以继续阅读以下文档，以探索更多使用场景：

\[1\] YAML语法规范

_[help.aliyun.com/document\_de…](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F609178.html%3Fspm%3Da2c4g.2831722.0.i1 "https://help.aliyun.com/document_detail/609178.html?spm=a2c4g.2831722.0.i1")_

\[2\] 流水线 Runner

_[help.aliyun.com/document\_de…](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F2825830.html%3Fspm%3Da2c4g.2831722.0.i2 "https://help.aliyun.com/document_detail/2825830.html?spm=a2c4g.2831722.0.i2")_

\[3\] 流水线缓存

_[help.aliyun.com/document\_de…](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F2831720.html%3Fspm%3Da2c4g.2831722.0.i3 "https://help.aliyun.com/document_detail/2831720.html?spm=a2c4g.2831722.0.i3")_