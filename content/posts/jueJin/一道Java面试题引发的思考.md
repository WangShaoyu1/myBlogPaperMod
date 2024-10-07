---
author: "容华谢后"
title: "一道Java面试题引发的思考"
date: 2019-10-25
description: "这两天做了一道常见的Java面试题，毫无悬念的做错了，在运行出正确答案之后，发现以自己的知识储备竟然无法完整的解释为什么，十分惭愧，于是有了这篇文章，对其进行总结反思。后面两个还能理解，形参、实参、值传递、引用传递啥的一混合，还能说得过去，可是第一个为什么是hello呢，st…"
tags: ["Java"]
ShowReadingTime: "阅读7分钟"
weight: 522
---
> 转载请注明出处：[juejin.cn/post/684490…](https://juejin.cn/post/6844903977646030855 "https://juejin.cn/post/6844903977646030855")
> 
> 本文出自 [容华谢后的博客](https://juejin.cn/user/3755587450187432 "https://juejin.cn/user/3755587450187432")

0.写在前面
======

这两天做了一道常见的Java面试题，毫无悬念的做错了，在运行出正确答案之后，发现以自己的知识储备竟然无法完整的解释为什么，十分惭愧，于是有了这篇文章，对其进行总结反思。

![人生啊](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/25/16e0083847d9c573~tplv-t2oaga2asx-zoom-in-crop-mark:1512:0:0:0.awebp)

1.题目
====

先看下题目:

typescript

 代码解读

复制代码

`public class Test {     public static void main(String[] args) {         String str = "hello";         change(str);         System.out.println(str);         A a = new A("hello");         change(a);         System.out.println(a.str);         A a1 = new A("hello");         change1(a1);         System.out.println(a1.str);     }     private static void change(String str) {         str = "changed";     }     private static void change(A a) {         a = new A("changed");     }     private static void change1(A a1) {         a1.str = "changed";     } } class A {     public String str;     public A(String str) {         this.str = str;     } }`

运行结果为：

 代码解读

复制代码

`hello hello changed`

后面两个还能理解，形参、实参、值传递、引用传递啥的一混合，还能说得过去，可是第一个为什么是hello呢，str不是被重新赋值了吗，怎么打印的还是原来的值。

在经历了上面的疑惑之后，一顿百度，额不对，谷歌之后，发现对下面这些概念了解的还不是很透彻：

*   什么是栈内存、堆内存，它们有什么区别？
    
*   初始化一个基本类型数据或者一个对象在内存中是如何进行的？
    
*   String类型的数据存放在内存的什么区域？
    
*   String str = “a”; 和 String str = new String("a"); 在内存分配上有什么区别？
    

带着这些疑问，一起往下看。

2.栈内存、堆内存
=========

栈内存（stack）
----------

在函数中定义的一些基本类型的变量（byte、short、int、long、float、double、boolean、char）和对象的引用变量（Object obj = new Object(); obj为引用变量）都在函数的栈内存中分配。

当在一段代码块中定义一个变量时，Java就在栈中为这个变量分配内存空间，当超过变量的作用域后，Java会自动释放掉为该变量所分配的内存空间，该内存空间可以立即被另作他用。

栈内存的优势是，存取速度比堆要快，仅次于寄存器，栈内存数据可以共享。但缺点是，存在栈中的数据大小与生存期必须是确定的，缺乏灵活性。

堆内存（heap）
---------

由new创建的对象和数组（数组new不new都可以）存放在堆内存中，堆中分配的内存由JVM垃圾回收机制进行管理。

在堆内存中存储的对象或数组，可以在栈内存中对应一个引用变量，引用变量的取值为对象或数组在堆内存中的首地址，程序可以通过栈内存的引用变量来对数组或对象进行操作。

**Object obj = new Object(); obj为引用变量，可以通过obj变量操作Object。**

3.基本类型数据、对象的内存分配
================

基本类型数据
------

ini

 代码解读

复制代码

`int a = 1; int b = 1; int c = 2;`

![变量](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/25/16e0083847efe8c4~tplv-t2oaga2asx-zoom-in-crop-mark:1512:0:0:0.awebp)

步骤分析：

*   1.在栈内存中创建一个变量名为a的引用，然后查找栈内存中是否存在1这个值，未找到，将1存入栈内存并将变量a指向1。
    
*   2.在栈内存中创建一个变量名为b的引用，然后查找栈内存中是否存在1这个值，找到了，将变量b指向1。
    
*   3.在栈内存中创建一个变量名为c的引用，然后查找栈内存中是否存在2这个值，未找到，将2存入栈内存并将变量c指向2。
    

在上述步骤可以看到，栈内存中的数据是可以共享的，虽然数据是共享的，但是变量b的修改，并不会影响到变量a。

对象
--

ini

 代码解读

复制代码

`Object obj = new Object();`

![对象](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/25/16e00838480ba112~tplv-t2oaga2asx-zoom-in-crop-mark:1512:0:0:0.awebp)

步骤分析：

*   1.在栈内存中创建一个变量名为obj的引用。
    
*   2.在堆内存中创建一个Object对象，堆内存会自动计算Object对象的首地址值，假设为0x0001。
    
*   3.栈内存中的变量obj指向堆内存中Object对象的首地址0x0001。
    

4.String类型
==========

String类型十分特殊，它不属于基本数据类型，但又可以像基本数据类型一样用 **\=** 赋值，还可以通过 **new** 进行创建，一起来看看两种创建方式在内存中有什么区别。

String str = “a”;
-----------------

![String str = “a”;](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/25/16e0083847fafe8d~tplv-t2oaga2asx-zoom-in-crop-mark:1512:0:0:0.awebp)

步骤分析：

*   1.在栈内存中创建一个变量名为str的引用。
    
*   2.在常量池中查找是否有字符串a，没有找到，创建一个字符串a。
    
*   3.栈内存中的变量str指向常量池中的字符串a。
    

String str = new String("a");
-----------------------------

![String str = new String("a");](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/25/16e00838487c5282~tplv-t2oaga2asx-zoom-in-crop-mark:1512:0:0:0.awebp)

步骤分析：

*   1.在栈内存中创建一个变量名为str的引用。
    
*   2.在堆内存中创建一个String对象，堆内存会自动计算String对象的首地址值，假设为0x0001。
    
*   3.栈内存中变量str指向堆内存中String对象的首地址0x0001。
    
*   4.String对象首先到常量池中查找有没有字符串a，如果有则指向字符串a，如果没有则创建。
    

5.解题分析
======

在学习了上面的知识之后，我们再回过头来分析一下这道面试题：

typescript

 代码解读

复制代码

`public class Test {     public static void main(String[] args) { 		// A         String str = "hello";         change(str);         System.out.println(str); 		// B         A a = new A("hello");         change(a);         System.out.println(a.str); 		// C         A a1 = new A("hello");         change1(a1);         System.out.println(a1.str);     }     private static void change(String str) {         str = "changed";     }     private static void change(A a) {         a = new A("changed");     }     private static void change1(A a1) {         a1.str = "changed";     } } class A {     public String str;     public A(String str) {         this.str = str;     } }`

以A、B、C标识三段逻辑，分别来看下：

*   A：

![A](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/25/16e00838483f7ed9~tplv-t2oaga2asx-zoom-in-crop-mark:1512:0:0:0.awebp)

步骤分析：

*   1.在栈内存中创建一个变量名为str（实参）的引用。
    
*   2.在常量池中查找字符串hello，没有找到，创建一个字符串hello。
    
*   3.栈内存中的变量str（实参）指向常量池中的字符串hello。
    
*   4.在栈内存中创建一个变量名为str（形参）的引用。
    
*   5.在常量池中查找字符串changed，没有找到，创建一个字符串changed。
    
*   6.栈内存中的变量str（形参）指向常量池中的字符串changed。
    

**此时打印实参str的值，输出hello**

*   B:

![B](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/28/16e118b93eb16115~tplv-t2oaga2asx-zoom-in-crop-mark:1512:0:0:0.awebp)

*   1.在栈内存中创建一个变量名为a（实参）的引用。
    
*   2.在堆内存中创建一个String对象，地址为0x0001，引用变量a（实参）指向此地址。
    
*   3.String对象首先到常量池中查找有没有字符串hello，没有找到，在常量池中创建字符串hello并指向它。
    
*   4.在栈内存中创建一个变量名为a（形参）的引用，指向0x0001地址。
    
*   5.在堆内存中创建一个String对象，地址为0x0011，引用变量a（形参）指向此地址，不再指向0x0001地址。
    
*   6.String对象首先到常量池中查找有没有字符串changed，没有找到，在常量池中创建字符串changed并指向它。
    

**此时打印实参a中的值，输出hello**

*   C：

![C](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/25/16e008386450141a~tplv-t2oaga2asx-zoom-in-crop-mark:1512:0:0:0.awebp)

*   1.在栈内存中创建一个变量名为a1（实参）的引用。
    
*   2.在堆内存中创建一个String对象，地址为0x0001，引用变量a1（实参）指向此地址。
    
*   3.String对象首先到常量池中查找有没有字符串hello，没有找到，在常量池中创建字符串hello并指向它。
    
*   4.在栈内存中创建一个变量名为a1（形参）的引用，指向0x0001地址。
    
*   5.String对象首先到常量池中查找有没有字符串changed，没有找到，在常量池中创建字符串changed并指向它，不再指向字符串hello。
    

**此时打印实参a中的值，输出changed**

6.写在最后
======

到这里，关于这道Java面试题的总结就完成了，关联的东西还不少，如果遇到问题或者有错误的地方，可以给我留言，谢谢！