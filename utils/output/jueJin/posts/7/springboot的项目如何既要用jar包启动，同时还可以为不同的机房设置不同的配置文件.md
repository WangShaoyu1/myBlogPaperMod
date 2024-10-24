---
author: "京东云开发者"
title: "springboot的项目如何既要用jar包启动，同时还可以为不同的机房设置不同的配置文件"
date: 2024-10-17
description: "作者：京东科技 李意文 1、首先先把配置文件从jar中抽离 示例代码： 2、把抽离的配置文件，放到conf目录下 利用maven-assembly-plugin，抽取配置文件到conf目录下， 示例代"
tags: ["后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读1分钟"
weight: 1
selfDefined:"likes:1,comments:0,collects:5,views:110,"
---
作者：京东科技 李意文

1、首先先把配置文件从jar中抽离
-----------------

示例代码：

```xml
<plugin>
<groupId>org.apache.maven.plugins</groupId>
<artifactId>maven-jar-plugin</artifactId>
<version>3.2.0</version>
<configuration>
<excludes>
<exclude>**/spring-xxx.xml</exclude>
</excludes>
</configuration>
</plugin>
```

2、把抽离的配置文件，放到conf目录下
--------------------

利用maven-assembly-plugin，抽取配置文件到conf目录下，

示例代码：

```xml
<plugin>
<groupId>org.apache.maven.plugins</groupId>
<artifactId>maven-assembly-plugin</artifactId>
<version>3.3.0</version>
<configuration>
<descriptors>
<descriptor>src/main/assembly/assembly.xml</descriptor>
</descriptors>
</configuration>
<executions>
<execution>
<id>make-assembly</id>
<phase>package</phase>
<goals>
<goal>single</goal>
</goals>
</execution>
</executions>
</plugin>
```

```xml
assembly.xml内容如下：
<assembly>
<id>assembly</id>
<formats>
<format>zip</format>
<format>dir</format>
</formats>
<includeBaseDirectory>false</includeBaseDirectory>
<fileSets>
<fileSet>
<directory>${basedir}/src/bin</directory>
<outputDirectory>bin</outputDirectory>
<fileMode>0755</fileMode>
</fileSet>
</fileSets>
<files>
<file>
<source>${project.build.directory}/${project.build.finalName}.jar</source>
<outputDirectory>lib</outputDirectory>
</file>
<file>
<source>${basedir}/../xxx/target/classes/spring/spring-xxx.xml</source>
<outputDirectory>conf</outputDirectory>
</file>
<file>
<source>${basedir}/../xxx/target/classes/spring/spring-xxx.xml</source>
<outputDirectory>conf</outputDirectory>
</file>
</files>

</assembly>
```

最终效果如下：

![](/images/jueJin/2d25e1cb809445e.png)

3、修改maven打包配置将conf加入到classpath中
-------------------------------

示例代码如下：

```xml
<plugin>
<groupId>org.apache.maven.plugins</groupId>
<artifactId>maven-jar-plugin</artifactId>
<version>3.2.0</version>
<configuration>
<archive>
<manifestEntries>
<Class-Path>../conf/</Class-Path>
</manifestEntries>
</archive>
</configuration>
</plugin>
```

最终达到的效果是：

将springboot的jar包解压后，可以看到.MF文件中加了一个类路径 ../conf

![](/images/jueJin/f3e4139a4ae5448.png)

特别注意：

java -jar XX

使用-jar启动java进程的，-classpath不会生效了，如果要加类路径，只能通过改maven的打包参数，从而使得.MF文件加了Class-Path属性后，才可以！！！！

4、到部署平台上新建conf文件夹，将要覆盖的配置文件加入进去
-------------------------------

这样，部署平台的配置就会覆盖maven打包出来的配置文件

5、测试是否生效
--------

在部署平台上，将部署平台上的配置文件里的，rpc框架的服务别名设置为：xxx

代码里的服务别名是yyy,然后通过测试发现生效的别名是xxx。

因为，springboot启动后，使用的是conf下配置文件，然后conf下的配置文件会被部署平台上新建的配置文件覆盖，

这样为不同的机房新建不同的配置文件，这样也就实现了springboot的项目如何既要用jar包启动，同时还可以为不同的机房设置不同的配置文件