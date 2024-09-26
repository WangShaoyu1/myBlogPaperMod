---
author: "鳄鱼儿"
title: "C++堆栈内存分析"
date: 2024-08-18
description: "前言C/C++程序的内存可以被分为以下几个部分：栈区stack：由编译器自动分配释放，存放函数的参数值，局部变量的值等。其操作方式类似于数据结构中的栈。堆区heap：一般由开发者管理，手动分配和"
tags: ["后端"]
ShowReadingTime: "阅读5分钟"
weight: 616
---
前言
--

C/C++程序的内存可以被分为以下几个部分：

1.  栈区stack：由编译器自动分配释放，存放函数的参数值，局部变量的值等。其操作方式类似于数据结构中的栈。
2.  堆区heap：一般由开发者管理，手动分配和释放，若不释放，程序结束时可能由 OS 回收。注意它与数据结构中的堆不相同，分配方式类似于链表。
3.  全局区（静态区 static）：存放全局变量和静态变量，初始化的全局变量和静态变量在一块区域，未初始化的全局变量和未初始化的静态变量在相邻的另一块区域。程序结束后由系统释放。
4.  字符常量区：常量字符串就是放在这里的。程序结束后由系统释放。
5.  程序代码区：存放函数体的二进制代码。

我们来看一段代码：

CPP

 代码解读

复制代码

`//main.cpp  int a = 0;  // 全局初始化区  char *p1;   // 全局未初始化区  main() {          int b;                   // 栈       char s[] = "abc";        // 栈        char *p2;                // 栈        char *p3 = "123456";     // "123456/0"作为字符串在字符常量区， p3作为指针在栈上。        static int c =0;         // 全局（静态）初始化区        p1 = (char *)malloc(10); // 分配得来得 10 字节的区域在堆区。        strcpy(p1, "123456");    // "123456/0"作为字符串放在字符常量区，编译器可能会将它与 p3指针所指向的 "123456" 优化成一个地方。   }` 

申请栈空间
-----

栈空间是由系统自动分配的，在函数中声明一个局部变量 `int b;` 系统将会自动在栈中为 `b` 开辟空间。如果是在函数内部声明，在跳出函数时该内存区域会被系统释放。

下列声明方式均是在栈空间创建内存。

cpp

 代码解读

复制代码

`#include<iostream>   class A{};   struct B{};   int main(){ 	int i;			//申请栈空间存储int 	double d;		//申请栈空间存储double 	std::string s;  //申请栈空间存储string 	B b;			//申请栈空间存储结构体B 	A a; 			//申请栈空间存储类A }`

申请堆空间
-----

堆空间需开发员手动申请，并需要指明申请空间的大小，在 c 中可以使用 `malloc` 函数申请，如 `p1 = (char *)malloc(10);`。在 C++ 中用 `new` 运算符申请，如 `p2 = (char *)malloc(10);` 但是注意 `p1` 、 `p2` 两个指针本身是在栈中的，它们指向的内存是在堆上。

堆内存需要手动申请，使用完毕后需要手动释放！否则程序结束后这些内存将无法被回收，可能会导致内存溢出。

c 语言和c++语言申请堆内存的方式参考如下：

c

 代码解读

复制代码

`#include <stdlib.h> int main() {     // C语言中使用 malloc 申请内存     int* ptr1 = (int*)malloc(sizeof(int) * 10);     // C语言中使用 calloc 申请并初始化内存     int* ptr2 = (int*)calloc(10, sizeof(int));     // C语言中使用 realloc 调整内存大小     ptr1 = (int*)realloc(ptr1, sizeof(int) * 20);     // C语言中使用 free 释放内存     free(ptr1);     free(ptr2);     return 0; }`

cpp

 代码解读

复制代码

`#include<iostream>   class A{};   struct B{};   int main(){ 	int *i=new int;					//申请堆空间存储int 	double *d=new double;		    //申请堆空间存储double 	std::string *s=new std::string; //申请堆空间存储string 	B *b=new B;						//申请堆空间存储结构体B 	A *a=new A; 					//申请堆空间存储类A 	// 手动释放堆内存 	delete i; 	delete d; 	delete s; 	delete b; 	delete a; }`

栈空间大小
-----

栈是向低地址扩展的数据结构，是一块连续的内存的区域。这句话的意思是栈顶的地址和栈的最大容量是系统预先规定好的，

在 Linux 下，我们可以通过 `ulimit -a` 或 `ulimit -s` 查看。

比如，下图可以看到我的 mac 电脑上，栈空间差不多 8MB。

![Pasted image 20240818151627.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/1254ff950ace4aa58ebc5c4fb67242ba~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6bOE6bG85YS_:q75.awebp?rk3s=f64ab15b&x-expires=1727594934&x-signature=NEcJiMGG7w7rg3IkNG71eCYxIB0%3D) 在  Windows 下，栈的大小是 2M （也有的说是 1M ，总之是一个编译时就确定的常数）。

可以看到栈内存是比较小的，如果申请的空间超过栈的剩余空间时，则会提示栈溢出 stack overflow。

堆空间大小
-----

堆是向高地址扩展的数据结构，是不连续的内存区域。这是由于系统是用链表来存储的空闲内存地址的，自然是不连续的，而链表的遍历方向是由低地址向高地址。

堆的大小受限于计算机系统中有效的虚拟内存。由此对比栈和堆空间，我们可以知道堆空间比较大，申请空间时也比较灵活。

函数返回值处理
-------

C/C++的函数返回，如果返回的是栈上变量的地址，在跳出函数时，该地址就会被释放。

所以函数不可以返回栈上的变量的地址，栈地址的内容会在函数返回后失效。

cpp

 代码解读

复制代码

`// Bad char* Foo(char* sz, int len){   char a[300] = {0};  // stack   if (len > 100) {     memcpy(a, sz, 100);   }   a[len] = '\0';   return a;  // WRONG }`

如果需要使用返回地址来传递非简单类型变量，我们可以使用堆来传递。

cpp

 代码解读

复制代码

`// Good char* Foo(char* sz, int len) {     char* a = new char[300]; // heap     if (len > 100) {         memcpy(a, sz, 100);     }     a[len] = '\0';     return a;  // OK }`

需要注意的一点：我们使用堆内存时，在使用完毕后记得通过 `delete[]` 释放掉堆内存数组。

对于 C++ 程序来说，强烈建议返回 `string`、`vector` 等类型，会让代码更加简单和安全。