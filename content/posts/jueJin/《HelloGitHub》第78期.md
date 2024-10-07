---
author: "HelloGitHub"
title: "《HelloGitHub》第78期"
date: 2022-09-28
description: "简介HelloGitHub分享GitHub上有趣、入门级的开源项目。这里有实战项目、入门教程、黑科技、开源书籍、大厂开源项目等，涵盖多种编程语言Python、Java、Go、C/C++、S"
tags: ["GitHub","开源"]
ShowReadingTime: "阅读13分钟"
weight: 410
---
> 兴趣是最好的老师，**HelloGitHub** 让你对编程感兴趣！

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab0fbc80011446cfab408d16f4ca3574~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

简介
--

**HelloGitHub** 分享 GitHub 上有趣、入门级的开源项目。

> [github.com/521xueweiha…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2F521xueweihan%2FHelloGitHub "https://github.com/521xueweihan/HelloGitHub")

这里有实战项目、入门教程、黑科技、开源书籍、大厂开源项目等，涵盖多种编程语言 Python、Java、Go、C/C++、Swift...让你在短时间内感受到开源的魅力，对编程产生兴趣！

* * *

> 以下为本期内容｜每个月 **28** 号更新

### C 项目

1、[gifsicle](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fkohler%2Fgifsicle "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/kohler/gifsicle")：压缩和编辑 GIF 图片的工具。它是一款体积小、功能强大的 GIF 图片处理工具，不仅可以压缩 GIF 图片，还支持合并多个 GIF、导出所有帧、查看图片信息、减少帧数、设置循环次数、延迟、编辑某一帧等功能。

shell

 代码解读

复制代码

`# 安装 brew install gifsicle # 查看 gifsicle -I input.gif | head # 优化/压缩 gifsicle input.gif -O3 -o output.gif`

2、[CPU-X](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2FX0rg%2FCPU-X "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/X0rg/CPU-X")：一款显示电脑 CPU、主板等信息的免费工具。能够显示设备的 CPU、主板、内存、显卡、操作系统等信息，支持 GUI 和命令行两种启动方式，适用于 Linux 和 FreeBSD 操作系统。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/062d2bd0af0e4038ad0b558b2c937544~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

3、[acl](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Facl-dev%2Facl "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/acl-dev/acl")：一款跨平台的网络通信库和服务器框架。它既可以做网络通信的客户端，也可以编写服务器端，支持 HTTP、SMTP、ICMP、MQTT、Redis、Memcache 多种常见协议，以及 XML、JSON、BASE64 等编码格式。

*   lib\_acl：最基础的库
*   lib\_protocol：实现了 HTPP 协议及 ICMP/PING 协议
*   lib\_fiber：该库为支持协程库，直接 hook 系统 read/write 等 API，与 epoll 配合支持高并发网络编程

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e49c41cccc174c9baa190f124d78f0f7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### C# 项目

4、[XCharts](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2FXCharts-Team%2FXCharts "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/XCharts-Team/XCharts")：Unity 数据可视化图表插件。一款基于 Unity UGUI 的图表插件，它功能强大、简单易用，支持折线图、柱状图、饼图、雷达图、散点图、热力图、环形图、K 线图等多种图表。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d2a9a78d7d54560a52c287befd2e759~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

5、[WinDynamicDesktop](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Ft1m0thyj%2FWinDynamicDesktop "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/t1m0thyj/WinDynamicDesktop")：类似 macOS 动态桌面的工具。该项目是将 macOS 动态桌面功能移植到 Windows 10，它可以基于你的位置计算出日出和日落的时间，并根据当前时间动态改变桌面壁纸，已上架 Microsoft 应用商店。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7fae0326480845a8ab3815c950981b28~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

6、[Text-Grab](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2FTheJoeFin%2FText-Grab "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/TheJoeFin/Text-Grab")：一个轻量级的 Windows OCR 工具。它基于 Windows 10 系统自带的 OCR API 实现，可以将看到的所有文字转化成文本，而且启动速度快、无需常驻后台、可离线使用。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dcc3c24d8ac64234ac1aa546c433a3ea~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### C++ 项目

7、[kys-cpp](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fscarsty%2Fkys-cpp "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/scarsty/kys-cpp")：游戏《金庸群侠传》的 C++ 复刻版。基于 SDL2 开发的《金庸群侠传》游戏，资源大部分来自 DOS 版本，目前已完工可以正常运行。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f01ade45d6a44f28b85e2ceb454cee18~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

8、[Cemu](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fcemu-project%2FCemu "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/cemu-project/Cemu")：任天堂 Wii U 游戏机模拟器。用 C++ 编写的开源 Wii U 模拟器，能够运行绝大多数的 Wii U 游戏和自制游戏，支持 Windows、Linux、macOS 操作系统。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a051ac11d01649bdbba03f3924504d2e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

9、[wiliwili](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fxfangfang%2Fwiliwili "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/xfangfang/wiliwili")：专为手柄控制设计的第三方 B 站客户端。一个用 C++ 编写的适用于 Nintendo Switch 的 B 站客户端，拥有接近 B 站官方 PC 客户端的浏览体验，同时支持触屏与手柄按键操控。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eadbac65678a4d79b72d0a9d21eee7f7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

10、[aseprite](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Faseprite%2Faseprite "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/aseprite/aseprite")：开源、专业的像素画编辑软件。一款主要用于像素画和 Sprite 动画的图像编辑软件，它拥有图层、自由手绘模式、阴影墨水、自定义笔刷、轮廓线、宽像素、命令行界面、Lua 脚本等特色功能。该软件虽然专业版收费但并不贵，也可选择免费版但无法保存作品。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78649f382efe4a219d8b502fd8ad156c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### CSS 项目

11、[30diasDeCSS](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2FMilenaCarecho%2F30diasDeCSS "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/MilenaCarecho/30diasDeCSS")：在 30 天内用 HTML 和 CSS 创建 30 个迷你项目的挑战。该项目包含了 30 个用 HTML+CSS 构建的迷你项目，每个项目通过动图直观地展示了实现的效果，不仅包含全部源码还指出了用到的知识点。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8741d5ee778244eb8289df1dc9104532~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### Go 项目

12、[HackBrowserData](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2FmoonD4rk%2FHackBrowserData "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/moonD4rk/HackBrowserData")：一款浏览器数据导出工具。能够导出本地浏览器的密码、历史记录、Cookie、书签、下载记录、localStorage 等数据的命令行工具，支持多平台下的多种主流浏览器。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9886b00b601143df8f3eee40dca2d682~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

13、[fq](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fwader%2Ffq "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/wader/fq")：一条命令查看二进制文件。用于查看和处理二进制文件的命令行工具，安装简单使用方便，支持 mp4、flac、mp3、jpeg 等多种格式的文件。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88bd141f0038426a8336ecf62a7b2a27~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

14、[statsviz](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Farl%2Fstatsviz "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/arl/statsviz")：实时展示 Go 程序运行时指标的 Web 应用。该项目通过图表可视化的方式，实时展示 Go 程序运行时的堆、对象、Goroutines、MSpan/MCache 等信息。

go

 代码解读

复制代码

`mux := http.NewServeMux() statsviz.Register(mux)`

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/65236eb808dd49b5ab08da565af380f3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

15、[v2](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fminiflux%2Fv2 "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/miniflux/v2")：极简的 feed 订阅工具。该项目的“简”是由内而外，内部代码部分不使用 Web 框架和 ORM 仅采用 Go+PostgreSQL+JS 实现，界面朴实无华、功能精简实用，支持快速自建、源管理、自动获取内容、快捷键、用户系统等，这一切不多不少刚刚好。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b8fd47426844873ab0fe9d8a44b1250~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

16、[cobra](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fspf13%2Fcobra "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/spf13/cobra")：当下最流行的 Go CLI 框架。功能强大且极易上手的 Go 语言 CLI 库，可用于快速构建命令行程序，被 K8s、Hugo、GitHub CLI 等众多知名 Go 项目所采用，支持自动提示、自动构建项目、嵌套子命令等功能。

go

 代码解读

复制代码

`var rootCmd = &cobra.Command{   Use:   "hugo",   Short: "Hugo is a very fast static site generator",   Long: "A Fast and Flexible Static Site Generator built with love by spf13",   Run: func(cmd *cobra.Command, args []string) {     // Do Stuff Here   }, } func Execute() {   if err := rootCmd.Execute(); err != nil {     fmt.Println(err)     os.Exit(1)   } }`

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/478fdbba62014871a3c38aa4ff12cb84~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### Java 项目

17、[hippo4j](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fopengoofy%2Fhippo4j "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/opengoofy/hippo4j")：带有监控报警功能的动态线程池框架。支持运行时动态变更线程池参数，可实时查看线程池运行时数据，适配 RocketMQ、RabbitMQ、Tomcat 等中间件，解决了线程池参数不易评估以及运行时黑盒的问题。

java

 代码解读

复制代码

`@Bean @DynamicThreadPool public Executor sendMessageConsumeDynamicThreadPool() {     String threadPoolId = "send-message-consume";     ThreadPoolExecutor sendMessageConsume = ThreadPoolBuilder.builder()             .threadPoolId(threadPoolId)             .threadFactory(threadPoolId)             .dynamicPool()             .build();     return sendMessageConsume; }`

18、[ghidra](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2FNationalSecurityAgency%2Fghidra "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/NationalSecurityAgency/ghidra")：一款免费开源的软件逆向分析工具。该项目由美国国安局开源，可用于分析编译后的代码。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86c5ca3beb724878ba576c8cce8cd2a2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

19、[caffeine](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fben-manes%2Fcaffeine "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/ben-manes/caffeine")：Java 的高性能缓存库。借鉴了 Guava 和 ConcurrentLinkedHashMap 的设计经验，青出于蓝而胜于蓝的 Java 本地缓存库，拥有更高的缓存命中率和更快的读写速度。

java

 代码解读

复制代码

`LoadingCache<Key, Graph> graphs = Caffeine.newBuilder()     .maximumSize(10_000)     .expireAfterWrite(Duration.ofMinutes(5))     .refreshAfterWrite(Duration.ofMinutes(1))     .build(key -> createExpensiveGraph(key));`

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a6f50ca9d934be8b44d7318b2aa2b5b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

20、[solon](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fnoear%2Fsolon "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/noear/solon")：一款 Java 轻量级应用开发框架。可用来快速开发 Java Web 项目，主框架仅 0.1 MB。类似 Python Flask 的微型框架，提倡按需组合插件。

java

 代码解读

复制代码

`@Controller public class App {     public static void main(String[] args) {         Solon.start(App.class, args, app -> {             //手写模式             app.get("/hello1", ctx -> ctx.output("Hello world!"));         });     }     //注解模式     @Get     @Socket     @Mapping("/hello2")     public String hello2(@Param(defaultValue = "world") String name) {         return String.format("Hello %s!", name);     } }`

### JavaScript 项目

21、[notesnook](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fstreetwriters%2Fnotesnook "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/streetwriters/notesnook")：一款端到端加密的笔记软件。这款笔记软件以保护用户隐私为主要特点，采用了安全的 XChaCha20-Poly1305 和 Argon2 算法对数据进行加密。它不仅安全还拥有丰富的功能，但免费版功能阉割严重，比如不支持 Markdown、插入图片等重要的功能。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ea3f294c90f4b34b0dbbba042168085~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

22、[jsoncrack.com](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2FAykutSarac%2Fjsoncrack.com "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/AykutSarac/jsoncrack.com")：优雅的 JSON 数据可视化工具。该项目不是简单的展示 JSON 数据，而是将其转化为类似脑图的形式，支持放大/缩小、展开/收缩、搜索节点、导出图片等操作，还可以快速部署成服务。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f8b70d713804b648379915d5e4380ce~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

23、[sakana](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fitorr%2Fsakana "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/itorr/sakana")：可爱的 Sakana 模拟器。Sakana 是出自动漫《莉可丽丝》的一个梗，可爱的动作加上 Sakana 这句话，使得这个场面迅速走红，这个项目可以让你轻松再现这个瞬间。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/967f5031a1884f8db05346e036715324~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

24、[m3u8-downloader](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2FMomo707577045%2Fm3u8-downloader "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/Momo707577045/m3u8-downloader")：m3u8 视频在线提取工具。m3u8 视频格式常用于直播服务，其原理是将完整的视频拆分成多个 .ts 视频碎片，其中 .m3u8 文件会详细记录每个视频片段的地址。视频播放时，会先读取 .m3u8 文件，再逐个下载播放 .ts 视频片段。该项目就是基于上述原理实现的 m3u8 视频提取工具，使用方便无需安装打开网页即可下载完整的视频。

javascript

 代码解读

复制代码

`// 下载整合后的 TS 文件 downloadFile(fileDataList, fileName, fileType) {     this.tips = 'ts 碎片整合中，请留意浏览器下载'     const fileBlob = new Blob(fileDataList, { type: 'video/MP2T' }) // 创建一个 Blob 对象，并设置文件的 MIME 类型     const a = document.createElement('a')     a.download = fileName + '.' + fileType     a.href = URL.createObjectURL(fileBlob)     a.style.display = 'none'     document.body.appendChild(a)     a.click()     a.remove() }`

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0c4b7e3b28f4bfa8af45874fec01887~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

25、[tldraw](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Ftldraw%2Ftldraw "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/tldraw/tldraw")：一款实用的微型在线绘图工具。这是一个”麻雀虽小，五脏俱全“的绘图工具，支持插入便签、保存进度、生成图片、多人协作等实用的功能。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3081461f09b24790a8e8d8a7bc2ccda5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### PHP 项目

26、[Piwigo](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2FPiwigo%2FPiwigo "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/Piwigo/Piwigo")：一款开源在线相册应用。采用 PHP+MySQL 开发的管理照片的 Web 项目，它功能强大安装简单，拥有丰富的主题和灵活的插件，可轻松完成个性化定制。支持 iOS 和 Android 客户端，让你可以随时随地上传、管理照片。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc4379389a81474a9fb23301e2c02179~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### Python 项目

27、[pendulum](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fsdispater%2Fpendulum "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/sdispater/pendulum")：让 Python 处理时间更简单的库。该项目不仅提供了更加简单易用的 API，而且还兼容 datetime 标准库，可以直接替代码中的 datetime 对象。它提供了很多人性化的时间处理方式，比如时间加减、多长时间的描述以及时区的处理等等。

python

 代码解读

复制代码

`>>> import pendulum >>> now_in_paris = pendulum.now('Europe/Paris') >>> now_in_paris '2016-07-04T00:49:58.502116+02:00' >>> tomorrow = pendulum.now().add(days=1) >>> past = pendulum.now().subtract(minutes=2) >>> past.diff_for_humans() '2 minutes ago' >>> delta = past - last_week >>> delta.hours 23 >>> delta.in_words(locale='en') '6 days 23 hours 58 minutes'`

28、[pg\_activity](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fdalibo%2Fpg_activity "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/dalibo/pg_activity")：类似 top 的 PostgreSQL 数据库命令行监控工具。一条命令就能实时查看 PostgreSQL 数据库状态和每条 SQL 语句执行详情、耗时、占用资源、读/写速度等信息的工具。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/784606d47e9d4b33b27db4159d0afd43~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

29、[Games](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2FCharlesPikachu%2FGames "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/CharlesPikachu/Games")：纯 Python 实现的桌面小游戏集合。该项目包含 20 多个不重样的趣味小游戏，它们都是采用 Python 开发运行简单，用到的库包括 cocos2d、pygame、PyQt 等。虽然这些游戏可玩性较低，但项目简单十分适合新手学习。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c847027ba23d4ffba168ed12f64e2bfd~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

30、[django-silk](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fjazzband%2Fdjango-silk "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/jazzband/django-silk")：Django 的性能分析工具。它可以将 Django 服务的平均耗时、请求次数、查询 SQL、代码性能分析等信息展示到一个页面，开发者有了这些信息就能够更快地找到 Django 服务的性能瓶颈和响应慢的原因。

shell

 代码解读

复制代码

`# 安装 pip install django-silk # 中间件的方式使用 MIDDLEWARE = [     ...     'silk.middleware.SilkyMiddleware',     ... ] INSTALLED_APPS = (     ...     'silk' )`

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b41ca10c3dd4c73aae8b499da580432~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

31、[OCRmyPDF](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Focrmypdf%2FOCRmyPDF "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/ocrmypdf/OCRmyPDF")：可以把 PDF 文件变成可搜索文件的工具。它使用 Tesseract OCR 引擎，将 PDF 的内容识别成文本，然后给 PDF 文件增加 OCR 文本层。从而实现可搜索和复制 PDF 的内容，已支持 100 多种语言。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/829c7328aa884caa8a1613369e5145b1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### Ruby 项目

32、[wpscan](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fwpscanteam%2Fwpscan "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/wpscanteam/wpscan")：一款 WordPress 安全扫描工具。该项目可用于发现 WordPress 构建的网站存在的安全隐患，扫描项包括 WordPress 漏洞、已安装的插件和主题、弱密码等。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79f362dd245c431da791ce78bffea342~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### Rust 项目

33、[espanso](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fespanso%2Fespanso "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/espanso/espanso")：Rust 写的智能文本扩展工具。文本扩展器是可以帮你提高输入效率的工具，当你输入一个特定的关键词时，它可以自动检测到并将其替换为预设的内容。这个项目几乎可以和任何程序一起使用，适用于 Windows、macOS 和 Linux。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bcca49b9f64d4c86833746554917807f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

34、[easy\_rust](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2FDhghomon%2Feasy_rust "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/Dhghomon/easy_rust")：用简单的英语写的 Rust 教程。虽然当下已经有很多的 Rust 教程，但是大多都是以英语为主，这对不擅长英语的程序员并不友好，所以作者写了一份仅用简单的英语讲解 Rust 的教程，已有中文翻译版。

### Swift 项目

35、[TinyPNG4Mac](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fkyleduo%2FTinyPNG4Mac "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/kyleduo/TinyPNG4Mac")：适用于 macOS 的 TinyPNG 第三方客户端。TinyPNG 是一个提供免费图像压缩服务的网站，该项目是其第三方 macOS 客户端，可以让你无需打开浏览器、无需手动下载图片，仅通过简单的拖拽就能完成对 JPEG、PNG 图片的压缩。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4fe49a42b2fb4e83828e3a5450f0325a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 其它

36、[WebKit](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2FWebKit%2FWebKit "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/WebKit/WebKit")：苹果开源的 Web 浏览器引擎。它被用于开发 macOS 和 iOS 上的 Safari、App Store、Mail 等应用。WebKit 不仅出现在苹果的生态中，其分支 Blink 项目也是 Chromium 的重要组成部分，它又是各大主流浏览器的核心。

37、[missing-semester](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fmissing-semester%2Fmissing-semester "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/missing-semester/missing-semester")：大学计算机教育中缺失的一课。大学里的计算机课程往往只专注于讲授数据结构、操作系统这些知识，对于编程开发中常用的工具则留给学生自行学习。在 MIT 这个课程中，你可以了解和掌握命令行(shell)、文本编辑器(Vim)、版本控制系统(Git)等强大的工具，越早接触越能更加熟练地使用它们，有助于未来的职业生涯。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/233ddc0036494544b107d4942ab741ab~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

38、[nginx-tutorial](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fdunwu%2Fnginx-tutorial "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/dunwu/nginx-tutorial")：免费的 Nginx 极简教程。这是一套简单的 Nginx 教程，包含 Nginx 的安装、常用命令、反向代理、负载均衡等知识点，能够帮助新手快速入门 Nginx。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cbd2625b9962449cb3c2ec8bbe31dd01~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

39、[Crash-Course-Computer-Science-Chinese](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2F1c7%2FCrash-Course-Computer-Science-Chinese "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/1c7/Crash-Course-Computer-Science-Chinese")：计算机科学速成课\[40集全/精校\] 。油管上的计算机科学速成课(Crash Course Computer Science)中文字幕翻译版，视频从晶体管讲到了操作系统和人工智能，但并不会教你如何编程属于科普类视频。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fd5ab3619e0498e859a1c955800e072~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

40、[bats-core](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fbats-core%2Fbats-core "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/bats-core/bats-core")：Bash 自动化测试系统。它通过测试用例验证 Bash 脚本的运行结果是否符合预期，原理是基于 Bash 的 errexit(set -e) 选项判断测试用例的执行成功与否。

shell

 代码解读

复制代码

`#!/usr/bin/env bats @test "addition using bc" {   result="$(echo 2+2 | bc)"   [ "$result" -eq 4 ] } @test "addition using dc" {   result="$(echo 2 2+p | dc)"   [ "$result" -eq 4 ] }`

41、[The-Art-of-Linear-Algebra](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fkenjihiranabe%2FThe-Art-of-Linear-Algebra "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/kenjihiranabe/The-Art-of-Linear-Algebra")：图解线性代数。《Linear Algebra for Everyone》是一门广受好评的线性代数公开课，该项目是基于这门公开课，编写整理而成的图文并茂的学习笔记。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b0c3f6c28ee41788c8c18a378cf42e0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 开源书籍

42、[patterns-of-distributed-systems](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fdreamhead%2Fpatterns-of-distributed-systems "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/dreamhead/patterns-of-distributed-systems")：《分布式系统模式》中文版。该书尝试将副本同步、可靠性、网络延迟等分布式系统共性问题归纳总结，并参考像 Kafka、Zookeeper 等分布式系统的实现过程，给出分布式系统中同类问题的通用解决方法/模式。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a79ec577053f42588712c59af9b50e10~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

43、[Cookbook](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fandkret%2FCookbook "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/andkret/Cookbook")：《数据工程师 Cookbook》。这本书会告诉你，如果想要成为一名出色的数据工程师，到底需要学习哪些知识。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75e25ea28f85441e8ff2f49c81818217~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 机器学习

44、[stable-diffusion](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2FCompVis%2Fstable-diffusion "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/CompVis/stable-diffusion")：可以根据文字生成图片的模型。只要输入一段文字描述，就能得到一张由 AI 生成的图片，除此之外该项目还支持将粗糙的草图转化成精致的艺术图片。

python

 代码解读

复制代码

``# make sure you're logged in with `huggingface-cli login` from torch import autocast from diffusers import StableDiffusionPipeline pipe = StableDiffusionPipeline.from_pretrained( 	"CompVis/stable-diffusion-v1-4",  	use_auth_token=True ).to("cuda") prompt = "a photo of an astronaut riding a horse on mars" with autocast("cuda"):     image = pipe(prompt)["sample"][0]        image.save("astronaut_rides_horse.png")``

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b4dca6e1cf047908720980b72ee712a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

45、[style2paints](https://link.juejin.cn?target=https%3A%2F%2Fhellogithub.com%2Fperiodical%2Fstatistics%2Fclick%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Flllyasviel%2Fstyle2paints "https://hellogithub.com/periodical/statistics/click/?target=https://github.com/lllyasviel/style2paints")：一款给线稿上色的 AI 辅助工具。能够帮助用户给没有上色的图片，快速完成上色的 AI 工具，上色效果广受好评，完全免费开箱即用。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0851eeb67884133850c5447b9351fce~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

最后
--

如果你发现了 GitHub 上有趣的项目，就[点击分享](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2F521xueweihan%2FHelloGitHub%2Fissues%2Fnew "https://github.com/521xueweihan/HelloGitHub/issues/new")给大家伙吧。

以上就是本期的所有内容了，往期内容[点击阅读](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fmp%2Fappmsgalbum%3F__biz%3DMzA5MzYyNzQ0MQ%3D%3D%26action%3Dgetalbum%26album_id%3D1331197538447310849%26scene%3D173%26from_msgid%3D2247511076%26from_itemidx%3D1%26count%3D3%26nolastread%3D1%23wechat_redirect "https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzA5MzYyNzQ0MQ==&action=getalbum&album_id=1331197538447310849&scene=173&from_msgid=2247511076&from_itemidx=1&count=3&nolastread=1#wechat_redirect")

感谢您的阅读，如果觉得本期内容还不错的话 **求赞、求分享** ❤️