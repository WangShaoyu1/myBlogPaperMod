---
author: "捡田螺的小男孩"
title: "Java程序员必备：常见OOM异常分析"
date: 2019-10-07
description: "放假这几天，温习了深入理解Java虚拟机的第二章， 整理了JVM发生OOM异常的几种情况，并分析原因以及解决方案，希望对大家有帮助。 Java堆用于存储对象实例，只要不断地创建对象，并且保证GC Roots到对象之间有可达路径来避免垃圾回收机制清除这些对象，那么在对象数量到达最…"
tags: ["Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:14,comments:0,collects:18,views:6888,"
---
前言
--

放假这几天，温习了深入理解Java虚拟机的第二章， 整理了JVM发生OOM异常的几种情况，并分析原因以及解决方案，希望对大家有帮助。

Java 堆溢出
--------

Java堆用于存储对象实例，只要不断地创建对象，并且保证GC Roots到对象之间有可达路径来避免垃圾回收机制清除这些对象，那么在对象数量到达最大堆的容量限制后就会产生内存溢出异常。

### Java 堆溢出原因

*   无法在 Java 堆中分配对象
*   应用程序保存了无法被GC回收的对象。
*   应用程序过度使用 finalizer。

### Java 堆溢出排查解决思路

1.  查找关键报错信息，如

```
java.lang.OutOfMemoryError: Java heap space
```

2.  使用内存映像分析工具（如Eclipsc Memory Analyzer或者Jprofiler）对Dump出来的堆储存快照进行分析，分析清楚是内存泄漏还是内存溢出。
3.  如果是内存泄漏，可进一步通过工具查看泄漏对象到GC Roots的引用链，修复应用程序中的内存泄漏。
4.  如果不存在泄漏，先检查代码是否有死循环，递归等，再考虑用 -Xmx 增加堆大小。

### demo代码

```
package oom;

import java.util.ArrayList;
import java.util.List;

/**
* JVM配置参数
* -Xms20m    JVM初始分配的内存20m
* -Xmx20m   JVM最大可用内存为20m
* -XX:+HeapDumpOnOutOfMemoryError 当JVM发生OOM时，自动生成DUMP文件
* -XX:HeapDumpPath=/Users/weihuaxiao/Desktop/dump/  生成DUMP文件的路径
*/
    public class HeapOOM {
        static class OOMObject {
    }
        public static void main(String[] args) {
        List<OOMObject> list = new ArrayList<OOMObject>();
        //在堆中无限创建对象
            while (true) {
            list.add(new OOMObject());
        }
    }
}

```

### 运行结果

![](/images/jueJin/16d9781d2ec6eda.png)

按照前面的排查解决方案，我们来一波分析。

**1.查找报错关键信息**

```
Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
```

**2\. 使用内存映像分析工具Jprofiler分析产生的堆储存快照**

![](/images/jueJin/16d9af459abf48f.png)

由图可得，OOMObject这个类创建了810326个实例，是属于内存溢出，这时候先定位到对应代码，发现死循环导致的，修复即可。

栈溢出
---

关于虚拟机栈和本地方法栈，在Java虚拟机规范中描述了两种异常：

*   如果线程请求的栈深度大于虚拟机所允许的深度，将抛出StackOverflowError 异常；
*   如果虚拟机栈可以动态扩展，当扩展时无法申请到足够的内存时会抛出 OutOfMemoryError 异常。

### 栈溢出原因

*   在单个线程下，栈帧太大，或者虚拟机栈容量太小，当内存无法分配的时候，虚拟机抛出StackOverflowError 异常。
*   不断地建立线程的方式会导致内存溢出。

### 栈溢出排查解决思路

1.  查找关键报错信息，确定是StackOverflowError还是OutOfMemoryError
2.  如果是StackOverflowError，检查代码是否递归调用方法等
3.  如果是OutOfMemoryError，检查是否有死循环创建线程等，通过-Xss降低的每个线程栈大小的容量

### demo代码

```
package oom;

/**
* -Xss2M
*/
    public class JavaVMStackOOM {
        private void dontStop(){
            while(true){
            
        }
    }
        public void stackLeakByThread(){
            while(true){
                Thread thread = new Thread(new Runnable(){
                    public void run() {
                    dontStop();
                }
                });
            thread.start();}
        }
            public static void main(String[] args) {
            JavaVMStackOOM oom = new JavaVMStackOOM();
            oom.stackLeakByThread();
        }
    }
```

### 运行结果

![](/images/jueJin/16d9f09fbe25b73.png)

**1.查找报错关键信息**

```
Exception in thread "main" java.lang.OutOfMemoryError: unable to create new native thread
```

**2.确定是创建线程导致的栈溢出OOM**

```
    Thread thread = new Thread(new Runnable(){
        public void run() {
        dontStop();
    }
    });
```

**3.排查代码，确定是否显示使用死循环创建线程，或者隐式调用第三方接口创建线程（之前公司，调用腾讯云第三方接口，上传图片，遇到这个问题）**

方法区溢出
-----

方法区，（又叫永久代，JDK8后，元空间替换了永久代），用于存放Class的相关信息，如类名、访问修饰符、常量池、字段描述、方法描述等。运行时产生大量的类，会填满方法区，造成溢出。

### 方法区溢出原因

*   使用CGLib生成了大量的代理类，导致方法区被撑爆
*   在Java7之前，频繁的错误使用String.intern方法
*   大量jsp和动态产生jsp
*   应用长时间运行，没有重启

### 方法区溢出排查解决思路

*   检查是否永久代空间设置得过小
*   检查代码是否频繁错误得使用String.intern方法
*   检查是否跟jsp有关。
*   检查是否使用CGLib生成了大量的代理类
*   重启大法，重启JVM

### demo代码

```
package oom;

import org.springframework.cglib.proxy.Enhancer;
import org.springframework.cglib.proxy.MethodInterceptor;
import org.springframework.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;

/**
*  jdk8以上的话，
*  虚拟机参数：-XX:MetaspaceSize=10M -XX:MaxMetaspaceSize=10M
*/
    public class JavaMethodAreaOOM {
        public static void main(String[] args) {
            while (true) {
            Enhancer enhancer = new Enhancer();
            enhancer.setSuperclass(OOMObject.class);
            enhancer.setUseCache(false);
                enhancer.setCallback(new MethodInterceptor() {
                public Object intercept(Object obj, Method method,
                    Object[] args, MethodProxy proxy) throws Throwable {
                    return proxy.invokeSuper(obj, args);
                }
                });
                enhancer.create();
            }
        }
            static class OOMObject {
        }
    }
```

### 运行结果

![](/images/jueJin/16da1b54a18daea.png)

**1.查找报错关键信息**

```
Caused by: java.lang.OutOfMemoryError: Metaspace
```

**2.检查JVM元空间设置参数是否过小**

```
-XX:MetaspaceSize=10M -XX:MaxMetaspaceSize=10M
```

**3\. 检查对应代码,是否使用CGLib生成了大量的代理类**

```
    while (true) {
    ...
        enhancer.setCallback(new MethodInterceptor() {
        public Object intercept(Object obj, Method method,
            Object[] args, MethodProxy proxy) throws Throwable {
            return proxy.invokeSuper(obj, args);
        }
        });
        enhancer.create();
    }
```

本机直接内存溢出
--------

直接内存并不是虚拟机运行时数据区的一部分，也不是Java 虚拟机规范中定义的内存区域。但是，这部分内存也被频繁地使用，而且也可能导致OOM。

在JDK1.4 中新加入了NIO(New Input/Output)类，它可以使用 native 函数库直接分配堆外内存，然后通过一个存储在Java堆中的 DirectByteBuffer 对象作为这块内存的引用进行操作。这样能在一些场景中显著提高性能，因为避免了在 Java 堆和 Native 堆中来回复制数据。

### 直接内存溢出原因

*   本机直接内存的分配虽然不会受到Java 堆大小的限制，但是受到本机总内存大小限制。
*   直接内存由 -XX:MaxDirectMemorySize 指定，如果不指定，则默认与Java堆最大值（-Xmx指定）一样。
*   NIO程序中，使用ByteBuffer.allocteDirect(capability)分配的是直接内存，可能导致直接内存溢出。

### 直接内存溢出

*   检查代码是否恰当
*   检查JVM参数-Xmx，-XX:MaxDirectMemorySize 是否合理。

### demo代码

```
package oom;

import java.nio.ByteBuffer;
import java.util.concurrent.TimeUnit;

/**
* -Xmx256m -XX:MaxDirectMemorySize=100M
*/
    public class DirectByteBufferTest {
        public static void main(String[] args) throws InterruptedException{
        //分配128MB直接内存
        ByteBuffer bb = ByteBuffer.allocateDirect(1024*1024*128);
        
        TimeUnit.SECONDS.sleep(10);
        System.out.println("ok");
    }
}
```

### 运行结果

![](/images/jueJin/16da1d1c0766b68.png)

ByteBuffer分配128MB直接内存，而JVM参数-XX:MaxDirectMemorySize=100M指定最大是100M，因此发生直接内存溢出。

```
ByteBuffer bb = ByteBuffer.allocateDirect(1024*1024*128);
```

GC overhead limit exceeded
--------------------------

*   这个是JDK6新加的错误类型，一般都是堆太小导致的。
*   Sun 官方对此的定义：超过98%的时间用来做GC并且回收了不到2%的堆内存时会抛出此异常。

### 解决方案

*   检查项目中是否有大量的死循环或有使用大内存的代码，优化代码。
*   检查JVM参数-Xmx -Xms是否合理
*   dump内存，检查是否存在内存泄露，如果没有，加大内存。

### demo代码

```
package oom;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
* JVm参数 -Xmx8m -Xms8m
*/
    public class GCoverheadTest {
        public static void main(String[] args) {
        ExecutorService executor = Executors.newFixedThreadPool(10);
            for (int i = 0; i < Integer.MAX_VALUE; i++) {
                executor.execute(() -> {
                    try {
                    Thread.sleep(10000);
                        } catch (InterruptedException e) {
                        //do nothing
                    }
                    });
                }
            }
        }
        
```

### 运行结果

![](/images/jueJin/16da1f76ab83e07.png)

实例代码使用了newFixedThreadPool线程池，它使用了无界队列，无限循环执行任务，会导致内存飙升。因为设置了堆比较小，所以出现此类型OOM。

总结
--

本文介绍了以下几种常见OOM异常

```
java.lang.OutOfMemoryError: Java heap space
java.lang.OutOfMemoryError: unable to create new native thread
java.lang.OutOfMemoryError: Metaspace
java.lang.OutOfMemoryError: Direct buffer memory
java.lang.OutOfMemoryError: GC overhead limit exceeded
```

希望大家遇到OOM异常时，对症下药，顺利解决问题。同时，如果有哪里写得不对，欢迎指出，感激不尽。

参考与感谢
-----

*   [JVM系列之实战内存溢出异常](https://juejin.cn/post/6844903513454034951#heading-5 "https://juejin.cn/post/6844903513454034951#heading-5")
*   [JVM 发生 OOM 的 8 种原因、及解决办法](https://link.juejin.cn?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2Fd8dab59d5ea1 "https://www.jianshu.com/p/d8dab59d5ea1")
*   [NIO-直接内存](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fzqyanywn%2Fp%2F8183618.html "https://www.cnblogs.com/zqyanywn/p/8183618.html")
*   《深入理解Java虚拟机》

个人公众号
-----

![](/images/jueJin/16c381c89b127bb.png)

*   如果你是个爱学习的好孩子，可以关注我公众号，一起学习讨论。
*   如果你觉得本文有哪些不正确的地方，可以评论，也可以关注我公众号，私聊我，大家一起学习进步哈。