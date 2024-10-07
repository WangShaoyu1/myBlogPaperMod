---
author: "好看的HK"
title: "无敌的Arthas！"
date: 2024-07-21
description: "前言：Arthas是一款线上监控诊断产品，通过全局视角实时查看应用load、内存、gc、线程的状态信息，并能在不修改应用代码的情况下，对业务问题进行诊断，包括查看方法调用的出入参、异常，监测方法执"
tags: ["后端","Java"]
ShowReadingTime: "阅读9分钟"
weight: 770
---
前言：Arthas 是一款线上监控诊断产品，通过全局视角实时查看应用 load、内存、gc、线程的状态信息，并能在不修改应用代码的情况下，对业务问题进行诊断，包括查看方法调用的出入参、异常，监测方法执行耗时，类加载信息等，大大提升线上问题排查效率。

为了加深理解，本文准备了两个线上发生的实际例子，与大家一起分享（已做脱敏处理）。

一、背景
----

通常，本地开发环境无法访问生产环境。如果在生产环境中遇到问题，则无法使用 IDE 远程调试。更糟糕的是，在生产环境中调试是不可接受的，因为它会暂停所有线程，导致服务暂停。

开发人员可以尝试在测试环境或者预发环境中复现生产环境中的问题。但是，某些问题无法在不同的环境中轻松复现，甚至在重新启动后就消失了。

如果您正在考虑在代码中添加一些日志以帮助解决问题，您将必须经历以下阶段：测试、预发，然后生产。这种方法效率低下，更糟糕的是，该问题可能无法解决，因为一旦 JVM 重新启动，它可能无法复现，如上文所述。

Arthas 旨在解决这些问题。开发人员可以在线解决生产问题。无需 JVM 重启，无需代码更改。 Arthas 作为观察者永远不会暂停正在运行的线程。

二、能为你做什么？
---------

`Arthas` 是 Alibaba 开源的 Java 诊断工具，深受开发者喜爱。

当你遇到以下类似问题而束手无策时，`Arthas`可以帮助你解决：

0.  这个类从哪个 jar 包加载的？为什么会报各种类相关的 Exception？
1.  我改的代码为什么没有执行到？难道是我没 commit？分支搞错了？
2.  遇到问题无法在线上 debug，难道只能通过加日志再重新发布吗？
3.  线上遇到某个用户的数据处理有问题，但线上同样无法 debug，线下无法重现！
4.  是否有一个全局视角来查看系统的运行状况？
5.  有什么办法可以监控到 JVM 的实时运行状态？
6.  怎么快速定位应用的热点，生成火焰图？
7.  怎样直接从 JVM 内查找某个类的实例？

`Arthas` 支持 JDK 6+，支持 Linux/Mac/Windows，采用命令行交互模式，同时提供丰富的 `Tab` 自动补全功能，进一步方便进行问题的定位和诊断。

三、下载安装
------

bash

 代码解读

复制代码

`# 下载远程jar包，大概150kb curl -O https://arthas.aliyun.com/arthas-boot.jar # 启动jar java -jar arthas-boot.jar`

注意事项：

*   底层依赖 jps 命令，如果java进程与jps进程不在同一个虚拟机里面，那么有如下提示

csharp

 代码解读

复制代码

``[root@iZwz98tqym2w1bi7o95bo7Z arthas]# java -jar arthas-boot.jar [INFO] JAVA_HOME: /usr/lib/jvm/java-1.8.0-openjdk-1.8.0.402.b06-2.0.1.1.al8.x86_64/jre [INFO] arthas-boot version: 3.7.2 [INFO] Can not find java process. Try to run `jps` command lists the instrumented Java HotSpot VMs on the target system. Please select an available pid.``

*   当出现上述情况（jps无法找到java进程，但java进程确实存在），可以通过显式指定pid进行连接。
*   正常情况下，jps命令会发现可选的java进程，供用户选择。

四、关键命令
------

### 1、getstatic

通过 getstatic 命令可以方便的查看类的静态属性。使用方法为 `getstatic class_name field_name` 。

ruby

 代码解读

复制代码

`# 需要先触发一次类加载 [arthas@17098]$ getstatic site.xiaokui.blog.util.BlogUtil BLOG_CACHE No class found for: site.xiaokui.blog.util.BlogUtil # 大致结构为 key=用户id value=博客信息(复合对象，含pub、pro、pri三种类型博客详情) [arthas@17098]$ getstatic site.xiaokui.blog.util.BlogUtil BLOG_CACHE field: BLOG_CACHE @HashMap[     @Long[1]:@BlogDetailList[site.xiaokui.blog.domain.BlogDetailList@4af2f154], ] Affect(row-cnt:1) cost in 14 ms. # 如果不是复合对象，这里已经能筛选出key=1的value了 [arthas@17098]$ getstatic site.xiaokui.blog.util.BlogUtil BLOG_CACHE 'entrySet().iterator.{? #this.key=="1"}' field: BLOG_CACHE @ArrayList[     @Node[1=site.xiaokui.blog.domain.BlogDetailList@4af2f154], ] Affect(row-cnt:1) cost in 11 ms. ​ # 本质还是 ognl，这里-x后面接扩展层数 # 省略博客的详细，几乎是整个打印对象了，比toString还全 # 等同 ognl '@site.xiaokui.blog.util.BlogUtil@BLOG_CACHE' -x 3 getstatic site.xiaokui.blog.util.BlogUtil BLOG_CACHE -x 3`

### 2、ognl

基础用法

scss

 代码解读

复制代码

`# 调用静态方法 # 会在java控制台打印对应字符串 ognl '@java.lang.System@out.println("hello")' # 清空缓存，这里可以通过观察日志查看是否生效 ognl '@site.xiaokui.blog.util.BlogUtil@clearBlogCache(1)' # 清空缓存map，可以查看静态字段内容观察是否生效 ognl '@site.xiaokui.blog.util.BlogUtil@BLOG_CACHE.clear()' ​ # 查看静态字段，如果为空，则不能展开为3层 ognl '@site.xiaokui.blog.util.BlogUtil@BLOG_CACHE' ognl '@site.xiaokui.blog.util.BlogUtil@BLOG_CACHE' -x 3 ​ # 执行多行表达式，赋值给一个临时变量 ognl '#value1=@System@getProperty("java.home"), #value2=@System@getProperty("java.runtime.name"), {#value1, #value2}'`

进阶用法

scss

 代码解读

复制代码

`# 通过beanName获取对象 ognl '@cn.hutool.extra.spring.SpringUtil@getBean("indexController")'  # 查看对象值 ognl '@cn.hutool.extra.spring.SpringUtil@getBean("indexController").xiaokuiProperties.enableViewRestriction' # 调用对象方法 ognl '@cn.hutool.extra.spring.SpringUtil@getBean("indexController").index()' ​ # 通过class获取                                                                                          ognl '#EnvClass =@org.springframework.core.env.Environment@class,@cn.hutool.extra.spring.SpringUtil@getBean(#EnvClass)' # 查看环境变量，在web环境中，实现类一般为 StandardServletEnvironment ognl '#EnvClass =@org.springframework.core.env.Environment@class,@cn.hutool.extra.spring.SpringUtil@getBean(#EnvClass).getProperty("app.id")' ​ # 所有配置变量存放数组 ognl '#EnvClass =@org.springframework.core.env.Environment@class,@cn.hutool.extra.spring.SpringUtil@getBean(#EnvClass).propertySources.propertySourceList' ​ # 查看apollo配置，具体的值在 m_configProperties 字段  ognl '#EnvClass =@org.springframework.core.env.Environment@class,@cn.hutool.extra.spring.SpringUtil@getBean(#EnvClass).propertySources.get("ApolloBootstrapPropertySources").propertySources' -x 3`

功能强大的一笔！

### 3、trace

`trace` 命令能主动搜索 `class-pattern`／`method-pattern` 对应的方法调用路径，渲染和统计整个调用链路上的所有性能开销和追踪调用链路。

python

 代码解读

复制代码

``# 基本用法 trace 类名 方法名 # 默认不包括jdk方法，不限定trace次数 # 只能追踪到最外面一层的方法耗时，里面的二级方法好使看不到 trace site.xiaokui.blog.controller.IndexController blogSpace ​ # 执行完一次就退出追踪 trace site.xiaokui.blog.controller.IndexController blogSpace -n 1 ​ # 打印jdk方法 trace --skipJDKMethod true site.xiaokui.blog.controller.IndexController blogSpace ​ # 根据执行耗时过滤，执行耗时 > 5ms trace site.xiaokui.blog.controller.IndexController blogSpace '#cost > 5' ​ # 追踪下层，可以间接实现子级多层trace # trace -E 类名|类名 方法名|方法名 trace -E site.xiaokui.blog.controller.IndexController|site.xiaokui.blog.service.impl.SysBlogServiceImpl| site.xiaokui.blog.service.BlogCacheService|blogSpace|getMostViewTopN ​ # 排除指定的类，模糊匹配所有方法 # 但貌似也没起筛选作用 trace site.xiaokui.blog.controller.IndexController * --exclude-class-pattern cn.hutool.StrUtil # 官方示例 trace javax.servlet.Filter * --exclude-class-pattern org.springframework.web.filter. ​ ​ # 打破砂锅问到底，我就要看看究竟是慢在哪一行 # 但貌似 '#cost > 5' 没起筛选作用 # 我们可以发现最终是慢在了一下两行（arthas本身会有一定的性能损耗） # mysql查询：`---[96.62% 65.066868ms ] org.beetl.sql.core.SQLScript:select() #798 # redis查询：+---[98.00% 31.777942ms ] org.springframework.data.redis.core.ZSetOperations:reverseRangeByScoreWithScores() #113 trace -E site.xiaokui.blog.controller.IndexController|site.xiaokui.blog.service.impl.SysBlogServiceImpl|site.xiaokui.blog.service.BlogCacheService|site.xiaokui.blog.service.BaseService|org.beetl.sql.core.SQLManager blogSpace|match|getMostViewTopN|template '#cost > 5' ​``

### 4、watch

让你能方便的观察到指定函数的调用情况。能观察到的范围为：`返回值`、`抛出异常`、`入参`，通过编写 OGNL 表达式进行对应变量的查看。

bash

 代码解读

复制代码

`# 观察函数调用返回时的参数、this 对象和返回值 # 观察表达式，默认值是{params, target, returnObj} watch site.xiaokui.blog.controller.IndexController blogSpace -x 2 ​ # 满足特定条件的表达式 # 只有当第三个入参为dir时才watch watch site.xiaokui.blog.controller.IndexController blogSpace "{params[2],target,returnObj}" "params[2]=='dir'" -x 2 ​ # 按照耗时进行过滤 # 只要当耗时大于100ms时才watch watch site.xiaokui.blog.controller.IndexController blogSpace "{params,target,returnObj}" '#cost>100' -x 2 ​ # 观察异常信息的例子 # -e 表示抛出异常时才触发 # express中，表示异常信息的变量是throwExp watch site.xiaokui.blog.controller.TempTestController test "{params,throwExp}" -e -x 2 ​ # 观察入参前后值的变化 # 可以看到入参是100，但经过方法后，入参对象变成了2 # 而上面只能看到经过处理好的入参，即为2 watch site.xiaokui.blog.controller.TempTestController test "{params,throwExp,returnObj}" -e  -b -s -x 2 ​`

### 5、thread

查看当前线程信息，查看线程的堆栈。

yaml

 代码解读

复制代码

`# 显示第一页线程 # 默认按照 CPU 增量时间降序排列 # 实现原理类似于 top -H -p <pid> # 例如top -H -p 18605，适用于linux thread ​ # 一键显示最忙的5个线程 # 没有线程 ID，包含[Internal]表示为 JVM 内部线程 # 默认统计间隔为200ms thread -n 5 # 统计最近 1000ms 内的线程 CPU 时间。 thread -i 1000 # 列出 1000ms 内最忙的 3 个线程栈 thread -n 3 -i 1000 ​ # 显示所有匹配线程信息，有时需要获取全部 JVM 的线程数据进行分析 # 慎重使用 thread --all ​ # thread id, 显示指定线程的运行堆栈 thread 130 ​ # 找出当前阻塞其他线程的线程，一键发现死锁 # 目前只支持找出 synchronized 关键字阻塞住的线程，如果是java.util.concurrent.Lock，目前还不支持 # 例如线程A，拥有A锁，阻塞于锁B；线程B拥有B锁，阻塞于锁A；此时会触发死锁 thread -b ​ # 查看指定状态的线程 # 可选项 NEW, RUNNABLE, TIMED_WAITING, WAITING, BLOCKED, TERMINATED # 分别对应 新建/就绪/等待执行、运行中、超时等待、等待、阻塞、消亡 thread --state WAITING`

### 6、logger

查看 logger 信息，更新 logger level。

perl

 代码解读

复制代码

`# 打印所有 logger 信息 logger # 查看指定名字的 logger 信息 logger -n org.springframework.web logger -n site.xiaokui # 更新 logger level # 慎用，影响面过大 # 修改成功会提示 Update logger level success. # 反之，则意味着修改失败 logger --name ROOT --level debug # 缩小一下范围，这样是很ok的 # 存在 name=site.xiaokui 的logger logger --name site.xiaokui -level warn # 再缩小一下范围，这样是很ok的 # 可以再细化一下包路径，不一定非要严格匹配logger名称 logger --name site.xiaokui.blog.config -level warn`

### 7、profiler

`profiler` 命令支持生成应用热点的火焰图。本质上是通过不断的采样，然后把收集到的采样结果生成火焰图。

ini

 代码解读

复制代码

`# 启动 profiler # 默认cpu，可以用 --event 来指定 # 可以通过 profiler list 来查看支持的event # event可选项有 cpu、alloc、lock、wall、itimer profiler start profiler start --event=cpu # 获取已采集的 sample 的数量 profiler getSamples # 查看 profiler 状态，运行了多久 profiler status # 停止采集并输出热力图到指定文件，默认格式为html profiler stop --format html # 可以显式指定文件 profiler stop --format html --file /tmp/0528result.html`

### 8、查询命令

bash

 代码解读

复制代码

`# 监控大盘 dashboard # 显示虚拟机相关信息 jvm # 查看 JVM 内存信息 memory # 查看环境变量 sysenv # 查看当前 JVM 的系统属性 sysprop # 查看，更新 VM 诊断相关的参数 vmoption`

### 9、奇技淫巧

仅供参考，线上环境，请慎重使用！

bash

 代码解读

复制代码

`# 线上想临时打印gc日志 vmoption vmoption PrintGC true vmoption PrintGCDetails true # 写入控制台输出到文件 vmoption | tee /tmp/0529.txt # 以追加方式写入文件 vmoption | tee /tmp/0529.txt # 将结果保存到日志 options save-result true # 清空当前屏幕 cls # 不会写ognl表达式 请使用idea插件：Arthas-idea`

更多相关命令：[命令列表](https://link.juejin.cn?target=https%3A%2F%2Farthas.aliyun.com%2Fdoc%2Fcommands.html "https://arthas.aliyun.com/doc/commands.html")。

五、两个线上问题
--------

### 1、线上接口偶尔响应时间长

线上有A、B、C共3套生产环境，同一份代码同一个接口，只有A会偶尔返回超时，时间长达5~6秒。正常情况下，接口返回在50ms之内。

### 2、CPU上升明显

线上有A、B共2套生产环境，基本上还是同一份代码同一个接口，在相同QPS的情况下，B的CPU消耗是A的两倍。

未完待续，敬请期待....