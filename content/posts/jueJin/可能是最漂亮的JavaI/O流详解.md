---
author: "JavaSouth南哥"
title: "可能是最漂亮的JavaI/O流详解"
date: 2024-07-15
description: "我在国外stackoverflow看到13年前的这么一个问题：如何使用Java逐行读取大型文本文件。大家有什么思路吗？评论区一起讨论讨论。最高赞的回答是名为PeterLawrey的老哥回答的。"
tags: ["后端","Java"]
ShowReadingTime: "阅读7分钟"
weight: 589
---
> _点赞再看，Java进阶一大半_

我在国外stackoverflow看到13年前的这么一个问题：[如何使用 Java 逐行读取大型文本文件](https://link.juejin.cn?target=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F5868369%2Fhow-can-i-read-a-large-text-file-line-by-line-using-java "https://stackoverflow.com/questions/5868369/how-can-i-read-a-large-text-file-line-by-line-using-java")。大家有什么思路吗？评论区一起讨论讨论。

> I need to read a large text file of around 5-6 GB line by line using Java.
> 
> 我需要使用 Java 逐行读取大约 5-6 GB 的大型文本文件。
> 
> How can I do this quickly?
> 
> 我怎样才能快速完成此操作？

最高赞的回答是名为Peter Lawrey的老哥回答的。

![在这里插入图片描述](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/cb9168a447ef44ec894f26d5659f7126~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSmF2YVNvdXRo5Y2X5ZOl:q75.awebp?rk3s=f64ab15b&x-expires=1727244570&x-signature=fNazUE41InmXw1S1dXF8RsohWh4%3D)

大家好，我是南哥。

一个Java学习与进阶的领路人，今天指南的是Java I/O流，跟着南哥我们一起在Java之路上成长。

本文收录在我开源的《Java学习进阶指南》中，涵盖了想要学习Java、成为更好的Java选手都在偷偷看的核心知识、面试重点。相信能帮助到大家在Java成长路上不迷茫，南哥希望收到大家的 ⭐ Star ⭐支持，这是我创作的最大动力。GitHub地址：[github.com/hdgaadd/Jav…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhdgaadd%2FJavaProGuide "https://github.com/hdgaadd/JavaProGuide")。

1\. Java I/O的理解
---------------

Java I/O有两个参与对象，一个是**I/O源端**，一个是想要和`I/O`源端通信的各种**接收端**，比如程序控制IDEA控制台输出、读取文件A写入文件B等，我们程序要保证的就是IO流的顺利**读取**和顺利写入。JDK把对Java IO的支持都放在了`package java.io`包下，南哥数了数，一个有86个类和接口。

我们看下`package java.io`包最常用的Reader和Writer接口，他们的作者都是Mark Reinhold。这位老哥是谁？[他](https://link.juejin.cn?target=https%3A%2F%2Fmreinhold.org%2F "https://mreinhold.org/")是Oracle Java平台组的首席架构师，也是字符流读取器和写入器的首席工程师。这么有来头，看来Java I/O的程序设计不简单，我们可以从中学到不少好用的东西。

java

 代码解读

复制代码

`/**   * @author      Mark Reinhold  * @since       JDK1.1  */ public abstract class Reader implements Readable, Closeable { } public abstract class Writer implements Appendable, Closeable, Flushable { }`

2\. 输入流
-------

### 2.1 字节输入流抽象基类

我们先讲输入流，后面再讲下输出流。输入流又分为字节流和字符流，顾名思义，字节流按字节来读取，操作的数据单元是8位的字节；而字符流按字符来读取，操作的数据单元是16位的字符。

读取字节的抽象基类是**InputStream**，这个基类提供了3个方法给我们来读取字节流。

1.  从输入流读取下一个数据字节，值字节以0到255范围内的`int`返回。
    
    java
    
     代码解读
    
    复制代码
    
    `public abstract int read() throws IOException`
    
2.  从输入流读取一定数量的字节并将它们存储到缓冲区数组`b`中。
    
    java
    
     代码解读
    
    复制代码
    
    `public int read(byte b[]) throws IOException`
    
3.  从输入流读取最多`len`个字节的数据到字节数组中。
    
    java
    
     代码解读
    
    复制代码
    
    `public int read(byte b[], int off, int len) throws IOException`
    

大家注意以上方法的返回参数都是int类型，当正常读取时，int返回的是读取的字节个数；而当int**返回-1**，就表明输入流到达了末尾。

### 2.2 字节输入流读取

上文的是抽象的接口，本身并不具备实际的功能。真正能够读取文件的是`InputStream`抽象基类的子类实现，例如**文件流FileInputStream**，有了他，我们读取音频、视频、gif等等都不是问题。

java

 代码解读

复制代码

`// 文件流读取文件 FileInputStream stream = new FileInputStream(SOURCE_PATH);`

我们还可以在外面加一层**缓存字节流**来提高读取效率，在外层套上BufferedInputStream对象，为什么可以提高读取效率我下文会讲到。

java

 代码解读

复制代码

`BufferedInputStream stream = new BufferedInputStream(new FileInputStream(SOURCE_PATH));`

以上通过字节流我们是以n个字节来读取的，如果要用`readLine()`读取某一行这种场景下就不适用了。我们可以把缓存字节流换成**缓存字符流**来承接，使用`InputStreamReader`**转换流**把字节输入流转换成字符输入流。

如下代码所示。

java

 代码解读

复制代码

`BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(SOURCE_PATH)));`

### 2.3 提高读取效率

为什么加一层缓存流就能提高读取效率？因为直接使用 `FileInputStream` 读取文件的话，每次调用 `read()` 都是从**磁盘读取一个字节**，而每次读取都是一次系统调用。**系统调用是操作系统层面的调用**，涉及到用户空间和内核空间之间的上下文切换，这些切换的成本是很昂贵的。

而如果使用缓存流，一次性从文件里读取多个字节到缓存中，减少系统调用同时也减少了磁盘读取，读取的效率明显提高了。

除了Java I/O采用缓存流来提高读取效率，大多应用程序也采用缓存来提升程序性能，例如我们后端在业务开发会使用Redis缓存来减少数据库压力。关于`为什么使用缓存来提高应用程序效率`，大家也可以看看国外[Quora](https://link.juejin.cn?target=https%3A%2F%2Fwww.quora.com%2FWhy-is-caching-used-to-increase-read-performance%2Fanswer%2FGaive-Gandhi "https://www.quora.com/Why-is-caching-used-to-increase-read-performance/answer/Gaive-Gandhi")的回答，解释得很详细。

### 2.4 字符输入流

字符输入流的抽象基类是`Reader`，同样是提供了3个方法来支持字符流读取。

1.  读取单个字符。
    
    java
    
     代码解读
    
    复制代码
    
    `public int read() throws IOException`
    
2.  将字符读入数组。
    
    java
    
     代码解读
    
    复制代码
    
    `public int read(char cbuf[]) throws IOException`
    
3.  将字符读入数组的一部分。
    
    java
    
     代码解读
    
    复制代码
    
    `abstract public int read(char cbuf[], int off, int len) throws IOException`
    

字符流读取的实例是`FileReader`，同样可以使用缓存字符流提高读取效率。

java

 代码解读

复制代码

`BufferedReader reader = new BufferedReader(new FileReader(new File(SOURCE_PATH)));`

我们来具体实操下，读取`C:\\Users\\Desktop\\JavaProGuide\\read`下的所有文件，把他们合并在一起，写入到`C:\\Users\\Desktop\\JavaProGuide\\write`下的`PRODUCT.txt`文件中。

java

 代码解读

复制代码

`public class Client {     private static final String PATH = "C:\\Users\\Desktop\\JavaProGuide\\read";     private static final String FILE_OUT = "C:\\Users\\Desktop\\JavaProGuide\\write\\PRODUCT.txt";     public static void main(String[] args) throws IOException {         File file = new File(PATH);         File[] files = file.listFiles();         BufferedWriter writer = new BufferedWriter(new FileWriter(FILE_OUT));         for (File curFile : files) {             BufferedReader reader = new BufferedReader(new FileReader(curFile));             String line;             while ((line = reader.readLine()) != null) {                 writer.write(line);                 writer.newLine();             }             reader.close();         }         writer.close();     } }`

3\. 输出流
-------

### 3.1 输出流

字节输出流的抽象基类是`OutputStream`，字符输出流的抽象基类是`Writer`。他们分别提供了以下方法。

字节输出流`OutputStream`：

1.  将指定字节写入此输出流。
    
    java
    
     代码解读
    
    复制代码
    
    `public abstract void write(int b) throws IOException`
    
2.  将指定字节数组中的`b.length`字节写入此输出流。
    
    java
    
     代码解读
    
    复制代码
    
    `public void write(byte b[]) throws IOException` 
    
3.  将指定字节数组中从偏移量`off`开始的`len`个字节写入此输出流。
    
    java
    
     代码解读
    
    复制代码
    
    `public void write(byte b[], int off, int len) throws IOException`
    

字符输出流`Writer`：

1.  写入单个字符。
    
    java
    
     代码解读
    
    复制代码
    
    `public void write(int c) throws IOException`
    
2.  写入字符数组。
    
    java
    
     代码解读
    
    复制代码
    
    `public void write(char cbuf[]) throws IOException`
    
3.  写入字符数组的一部分。
    
    java
    
     代码解读
    
    复制代码
    
    `abstract public void write(char cbuf[], int off, int len) throws IOException`
    

另外字符输出流是使用**字符**来操作数据，所以可以用**字符串来代替字符数组**，JDK还支持以下**入参**是字符串的方法。

1.  写入一个字符串。
    
    java
    
     代码解读
    
    复制代码
    
    `public void write(String str) throws IOException`
    
2.  写入字符串的一部分。
    
    java
    
     代码解读
    
    复制代码
    
    `public void write(String str, int off, int len) throws IOException`
    

4\. 字节流和字符流区别
-------------

字节流和字符流的区别主要是三个方面。

*   **基本单位不同**。字节流以字节（8位二进制数）为基本单位来处理数据，字符流以字符为单位处理数据。
*   **使用场景不同**。字节流操作可以所有类型的数据，包括文本数据，和**非文本数据**如图片、音频等；而字符流只适用于处理文本数据。
*   **关于性能方面**。因为字节流不处理字符编码，所以处理大量文本数据时可能不如字符流高效；而字符流使用到**内存缓冲区**处理文本数据可以优化读写操作。

[戳这，《JavaProGuide》作为一份涵盖Java程序员所需掌握核心知识、面试重点的Java学习进阶指南。](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhdgaadd%2FJavaProGuide "https://github.com/hdgaadd/JavaProGuide")

![在这里插入图片描述](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/a18ee35433294e05b4fc94a0fab33592~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSmF2YVNvdXRo5Y2X5ZOl:q75.awebp?rk3s=f64ab15b&x-expires=1727244570&x-signature=Zuk1%2B1SxSMPQsDRKJKxmCkaFMBY%3D)

欢迎关注南哥的公众号：Java进阶指南针。我是南哥，南就南在Get到你的有趣评论➕点赞➕关注。

> **创作不易，不妨点赞、收藏、关注支持一下，各位的支持就是我创作的最大动力**❤️