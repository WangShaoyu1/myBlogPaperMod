---
author: "MacroZheng"
title: "Gradle真能干掉Maven？今天体验了一把，贼爽！"
date: 2021-04-13
description: "作为Java Web开发，很多朋友都在使用Maven作为构建工具。Gradle作为Google大力拥护的构建工具，在Java Web方面大有取代Maven上位的趋势。"
tags: ["Java","后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:83,comments:31,collects:121,views:11845,"
---
> SpringBoot实战电商项目mall（40k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

作为Java Web开发，很多朋友都在使用Maven作为构建工具。Gradle作为Google大力拥护的构建工具，被广泛地运用到了Android开发中，在Java Web方面也大有取代Maven上位的趋势。Gradle真的有那么香么？今天我们来体验一把，以我的脚手架项目`mall-tiny`为例，看看Gradle到底行不行！

Gradle简介
--------

Gradle是一款开源的自动化构建工具，使用灵活且性能极佳，可以使用 Groovy 或者 Kotlin DSL 来编写构建脚本。从移动开发到微服务，从小团队到大企业，Gradle提高了开发人员的生产力。

Gradle具有如下特性：

*   可以高度定制：Gradle使用可定制、可扩展的方式进行建模，非常灵活。
*   构建速度快：Gradle通过重用先前执行的输出，仅处理已更改的输入且通过并行执行任务来快速完成构建。
*   功能强大：Gradle是Android的官方构建工具，并支持许多流行的语言和技术。

Gradle使用体验
----------

> 接下来将把我的脚手架项目`mall-tiny`从使用Maven改造成使用Gradle，来体验一把Gradle的使用。

### 创建Gradle项目

*   首先需要下载Gradle的安装包，建议下载带源码的完整版本（否则Gradle中属性点进去不会有注释）下载地址：[gradle.org/releases/](https://link.juejin.cn?target=https%3A%2F%2Fgradle.org%2Freleases%2F "https://gradle.org/releases/")

![](/images/jueJin/28bd33fa7a264cd.png)

*   下载完成后进行解压，之后在IDEA中创建一个SpringBoot项目；

![](/images/jueJin/a1eb74e4d6a44ff.png)

*   选择创建一个Gradle项目；

![](/images/jueJin/0827c84cef6a498.png)

*   之后选择使用我们之前下载好的Gradle版本，输入你解压的目录；

![](/images/jueJin/51c38b87925f444.png)

*   项目创建完成后，一个非常简单的Gradle项目目录结构如下，需要注意的是`build.gradle`和`settings.gradle`这两个文件。

![](/images/jueJin/2675b2440a3641d.png)

### Gradle插件介绍

在新创建的`build.gradle`文件中，我们可以发现下面3个插件：

```groovy
    plugins {
    id 'org.springframework.boot' version '2.3.0.RELEASE'
    id 'io.spring.dependency-management' version '1.0.11.RELEASE'
    id 'java'
}
```

#### `org.springframework.boot`

SpringBoot官方提供的Gradle插件，方便我们使用SpringBoot，通过修改`version`可以控制使用的SpringBoot版本。

#### `io.spring.dependency-management`

一个可以提供依赖版本管理功能的Gradle插件（类似于Maven）。

比如之前我们使用Maven管理Druid版本时，会先在`<dependencyManagement>`中定义好依赖的版本。

```xml
<dependencyManagement>
<dependencies>
<!--集成druid连接池-->
<dependency>
<groupId>com.alibaba</groupId>
<artifactId>druid-spring-boot-starter</artifactId>
<version>1.1.10</version>
</dependency>
</dependencies>
</dependencyManagement>
```

然后在引入依赖的时候就无需再填写版本号了，这样做的好处就是可以统一依赖的版本。

```xml
<dependencies>
<!--集成druid连接池-->
<dependency>
<groupId>com.alibaba</groupId>
<artifactId>druid-spring-boot-starter</artifactId>
</dependency>
</dependencies>
```

在Gradle中你可以这样用，是不是简洁不少！

```groovy
    dependencies {
    implementation 'com.alibaba:druid-spring-boot-starter'
}

    dependencyManagement {
        dependencies {
        dependency 'com.alibaba:druid-spring-boot-starter:1.1.10'
    }
}
```

#### `java`

Java插件将Java编译、测试等常用功能添加到项目中，它是许多其他JVM语言Gradle插件的基础。

### Maven转Gradle

> Maven项目转Gradle非常简单，只需要把`pom.xml`中的依赖转为`build.gradle`中的依赖即可。

*   比如说Hutool这个依赖，Maven中的写法是这样的：

```xml
<dependency>
<groupId>cn.hutool</groupId>
<artifactId>hutool-all</artifactId>
<version>4.5.7</version>
</dependency>
```

*   Gradle中的写法是这样的，一行即可搞定：

```groovy
    dependencies {
    implementation 'cn.hutool:hutool-all:4.5.7'
}
```

*   有时候Gradle下载依赖比较慢，这里将url修改为阿里云的Maven仓库地址可以加速；

```groovy
    repositories {
maven { url 'https://maven.aliyun.com/repository/public' }
mavenCentral()
}
```

*   再来个完整的`build.gradle`，已经添加所有依赖；

```groovy
    plugins {
    id 'org.springframework.boot' version '2.3.0.RELEASE'
    id 'io.spring.dependency-management' version '1.0.11.RELEASE'
    id 'java'
}

group = 'com.macro.mall.tiny'
version = '1.0.0-SNAPSHOT'
sourceCompatibility = '1.8'

    repositories {
maven { url 'https://maven.aliyun.com/repository/public' }
mavenCentral()
}

    dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
    implementation 'org.springframework.boot:spring-boot-starter-aop'
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    implementation 'org.springframework.boot:spring-boot-starter-data-redis'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-configuration-processor'
    implementation 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
    implementation 'com.alibaba:druid-spring-boot-starter'
    implementation 'mysql:mysql-connector-java'
    implementation 'io.springfox:springfox-swagger2'
    implementation 'io.springfox:springfox-swagger-ui'
    implementation 'io.swagger:swagger-models'
    implementation 'io.swagger:swagger-annotations'
    implementation 'cn.hutool:hutool-all'
    implementation 'io.jsonwebtoken:jjwt'
    implementation 'com.baomidou:mybatis-plus-boot-starter'
    implementation 'com.baomidou:mybatis-plus-generator'
    implementation 'org.apache.velocity:velocity-engine-core'
}

    dependencyManagement {
        dependencies {
        dependency 'com.alibaba:druid-spring-boot-starter:1.1.10'
        dependency 'mysql:mysql-connector-java:8.0.16'
        dependency 'io.springfox:springfox-swagger2:2.9.2'
        dependency 'io.springfox:springfox-swagger-ui:2.9.2'
        dependency 'io.swagger:swagger-models:1.6.0'
        dependency 'io.swagger:swagger-annotations:1.6.0'
        dependency 'cn.hutool:hutool-all:4.5.7'
        dependency 'io.jsonwebtoken:jjwt:0.9.0'
        dependency 'com.baomidou:mybatis-plus-boot-starter:3.3.2'
        dependency 'com.baomidou:mybatis-plus-generator:3.3.2'
        dependency 'org.apache.velocity:velocity-engine-core:2.2'
    }
}

    test {
    useJUnitPlatform()
}
```

*   最后你需要做的就是把原来的代码都复制过来就行了，至此Gradle改造完成。

![](/images/jueJin/9e32e1611f6b46c.png)

对比Maven
-------

> 都说Gradle构建速度快，官方自己也在说，我们将项目clean以后构建下试试，看看到底有多快！

*   首先使用之前的Maven项目，直接clean之后再package，打包构建下；

![](/images/jueJin/dc76dd2b5494496.png)

*   控制台输出如下，耗时`32s`；

![](/images/jueJin/3ee80cbdd2dc44e.png)

*   再使用现在的Gradle项目，也是clean之后再package（Gradle中使用bootjar命令），打包构建下；

![](/images/jueJin/5a284b16bd3a45f.png)

*   控制台输出如下，耗时`15s`，快了不止一倍！

![](/images/jueJin/90348e0ac26541b.png)

*   再放张官方的对比图，Gradle构建比Maven快1倍，那是妥妥的！

![](/images/jueJin/c56b72bab82a411.png)

总结
--

Gradle作为Google官方推荐的构建工具，确实很不错！如果你会写Groovy脚本的话，使用起来是非常灵活的，而且语法简洁，构建速度也很快！

参考资料
----

Gradle官方文档：[docs.gradle.org](https://link.juejin.cn?target=https%3A%2F%2Fdocs.gradle.org "https://docs.gradle.org")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-tiny%2Ftree%2Fgradle "https://github.com/macrozheng/mall-tiny/tree/gradle")

> 本文 GitHub [github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning "https://github.com/macrozheng/mall-learning") 已经收录，欢迎大家Star！