---
author: "CrimsonHu"
title: "2023年了，是时候该知道JetBrains在JDK中内置了一个Chromium了"
date: 2023-03-22
description: "JetBrainsRuntime，一个非常值得一看的JDK，你甚至可以拿它写一个类似于Electron的框架，或者是自己开发一款浏览器！"
tags: ["Java","Chrome","浏览器"]
ShowReadingTime: "阅读4分钟"
weight: 465
---
开篇
==

对于 JetBrains ，大家肯定人人都知道。但是有没有注意到，JetBrains 有它自己的 JDK 与 JRE 呢？这里就有必要介绍下了。

它叫做 **JetBrains Runtime** （即 JetBrains 运行时，简称 **JBR** ），是一个运行时环境，用于在 Windows，Mac OS X 和Linux 上运行 IntelliJ 平台的各种产品。JetBrains Runtime 基于 OpenJDK 项目，并进行了一些修改。这些修改包括：抗锯齿， Linux 上增强的字体渲染， HiDPI 支持，连字，一些官方版本中未提供的针对产品崩溃的修复程序以及其他小的增强功能。

不过 JetBrains Runtime 不是 OpenJDK 的认证版本。请自己承担风险使用。

我们可通过 IDE 的 Help About 在弹出的对话框中看到 JetBrains Runtime 的版本：

![png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3eab714187cd45c69b61b33b74cbceb0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

![png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1aac9b7f8ce941a594812f0a9b49b700~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

什么是 JCEF
========

既然本文讲讲 JetBrains 在 JDK 中内置了一个 Chromium ，那么这里就有必要说说 JCEF 了。

[chromiumembedded / java-cef — Bitbucket](https://link.juejin.cn?target=https%3A%2F%2Fbitbucket.org%2Fchromiumembedded%2Fjava-cef%2Fsrc%2Fmaster%2F "https://bitbucket.org/chromiumembedded/java-cef/src/master/")

> Java Chromium Embedded Framework (JCEF). A simple framework for embedding Chromium-based browsers in other applications using the Java programming language.

这是 JCEF 项目地址中的一段原话。简单把它翻译下：

**Java Chromium 嵌入式框架（JCEF）。 一个简单的框架，用于使用 Java 编程语言在其他应用程序中嵌入基于Chromium 的浏览器。**

它的作用是什么呢？就是字面意思。你可以在 Java Swing 桌面端开发中，在你的程序中嵌入基于 Chromium 的浏览器。这有点类似于 Electron ，相当于你在开发桌面端程序的时候，用 Java 做个壳，里面直接跑 H5 页面。

JetBrains 直接将此插件集成到了它自家的 JDK 中，**在使用 JetBrains Runtime 时就无需手动引入 JCEF 以及编译和配置 Native 库了**。

为什么要这么做
=======

很简单，JetBrains 基本上所产品都是基于 Java Swing 开发的。比如 IDEA 、WebStorm 等等，都是使用 Java 开发的桌面端程序。

在 Web 技术火热发展的现在， JetBrains 肯定也意识到了相比于 QT 、 WinForm 这些，再或是 Java 自身的桌面端开发技术 Swing 、 SWT 、 JavaFX ， **直接借助浏览器外壳，利用众多流行的 Web UI 框架去做界面无疑是最快的**，这可以让我们有更多的时间去实现业务逻辑，而不用被那些该死的 UI 控件折磨。想一想，原先做个表格，一整套界面做完大半天过去了，现在，引入 Web 技术 一瞬间做出一个高大上的界面，效率不言而喻。

当然 JetBrains 并不是说要把自家产品全部推翻，像 VS Code 那样使用 Web 技术去重构自家产品。其实 JetBrains 在 JDK 中内置一个 Chromium ，就是为了方便大家开发插件用的。

如何获取
====

来看看我们如何获取带有 JCEF 的 JetBrains Runtime 吧！

这是 JetBrains Runtime 的 git 地址，我直接给 Releases 页面，方便大家直接点进去下载。

[JetBrains/JetBrainsRuntime at jbr17 (github.com)](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FJetBrains%2FJetBrainsRuntime%2Ftree%2Fjbr17 "https://github.com/JetBrains/JetBrainsRuntime/tree/jbr17")

点击此处，进入release下载页面

![png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9e6712a6d3041868e1497849f9b470e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

在 **Binaries for developers** 这一栏中下载 **JBR with JCEF** ，文件名以 **jbrsdk\_jcef** 开头的，这个就是 JDK 了。

Binaries for launching IntelliJ IDEA 这一栏就是 JRE 了。同样也是字面意思，用于启动 IDEA ，不是面向于开发者的，当然就是 JRE 了。

![png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40cd81051d794ca89b5df6b0d14d3a9f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

简单使用
====

将此 JDK 作为开发环境，我们简单地调用它。

简单起见我就直接用 eclipse 创建一个 Java SE 项目。毕竟作为老一辈的 Java 程序员，尽管我现在更多地是使用 IDEA ，但是拿 eclipse 做个小 demo 还是更方便的。

创建项目，并给项目配置为 JetBrains 的 JDK：

![png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0695e073e2d4951804f63674bbb14bf~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

创建两个文件，用于简单实现一个浏览器界面。

![png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/05678f1f338d4fbba25334494a7cba18~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

`Application.java`

java

 代码解读

复制代码

`package jcef; import jcef.ui.MainFrame; public class Application {     public static void main(String[] args) {         MainFrame.getIstance();     } }`

`MainFrame.java`

java

 代码解读

复制代码

`package jcef.ui; import java.awt.Dimension; import java.awt.Toolkit; import java.awt.event.WindowAdapter; import java.awt.event.WindowEvent; import javax.swing.JFrame; import org.cef.CefApp; import org.cef.CefClient; import org.cef.browser.CefBrowser; import org.cef.browser.CefRendering; import com.jetbrains.cef.JCefAppConfig; import java.awt.BorderLayout; public class MainFrame extends JFrame {     private static final long serialVersionUID = 2541887783679247552L;     private static volatile MainFrame instance;     private String url = "https://map.baidu.com/";     private CefApp app = null;     private CefClient client = null;     private CefBrowser browser = null;     public MainFrame() {         var args = JCefAppConfig.getInstance().getAppArgs();         var settings = JCefAppConfig.getInstance().getCefSettings();         settings.cache_path = System.getProperty("user.dir") + "/context";         // 获取CefApp实例         CefApp.startup(args);         app = CefApp.getInstance(args, settings);         // 创建客户端实例         client = app.createClient();         // 创建浏览器实例         browser = client.createBrowser(url, CefRendering.DEFAULT, true);         this.getContentPane().setLayout(new BorderLayout(0, 0));         this.getContentPane().add(browser.getUIComponent(), BorderLayout.CENTER);         this.setTitle("JetBrains Runtime - JCEF");         this.setSize(new Dimension(1280, 720));         this.setMinimumSize(new Dimension(1150, 650));         this.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);         this.setLocation((Toolkit.getDefaultToolkit().getScreenSize().width - this.getWidth()) / 2,                 (Toolkit.getDefaultToolkit().getScreenSize().height - this.getHeight()) / 2);         this.setVisible(true);         this.setResizable(true);         this.addWindowListener(new WindowAdapter() {             @Override             public void windowClosing(WindowEvent e) {                 app.dispose();                 System.exit(0);             }         });     }     public static MainFrame getIstance() {         if (instance == null) {             synchronized (MainFrame.class) {                 if (instance == null) {                     instance = new MainFrame();                 }             }         }         return instance;     } }`

可以看到，我在上述代码中声明了百度地图的地址：

java

 代码解读

复制代码

`private String url = "https://map.baidu.com/";`

运行该项目，我们就可以看到如下界面：

![png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c37fcf8a3d204e2d90dfbf73e38f8010~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

你看，一个浏览器界面顺利地通过 Java 显示出来了。

我们换个地址再来看看：

java

 代码解读

复制代码

`private String url = "https://cn.vuejs.org/";`

![png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8866df966244dc5a764c5ac03ec6956~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

同样也能正确显示页面。

于是我用它写了个浏览器
===========

前段时间我用 JetBrains Runtime 简单做了一个浏览器，它长这样：

![png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a973c45f81c4d08a7c458b5cc3797ce~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

![gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a72c62155a88456a8d0ddbbd72640e3c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

分享给大家，有兴趣可以在git上拉下来玩玩：

[DLand-Team/java-browser: 使用Java开发的浏览器，基于Chromium (github.com)](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FDLand-Team%2Fjava-browser "https://github.com/DLand-Team/java-browser")