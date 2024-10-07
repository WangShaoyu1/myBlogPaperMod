---
author: "Xiao镔"
title: "Linux源码解读-启动过程（一）"
date: 2024-09-22
description: "前言之前接触过很多操作系统的概念，比如进程，内存、文件系统，但是没有看过操作系统的源码，总有种隔靴搔痒的感觉。想去看源码，又因为代码量太多，不知从何看起，今年重启了操作系统的学习计划，在搜索资料的过"
tags: ["操作系统","面试","程序员"]
ShowReadingTime: "阅读19分钟"
weight: 979
---
##### 前言

之前接触过很多操作系统的概念，比如进程，内存、文件系统，但是没有看过操作系统的源码，总有种隔靴搔痒的感觉。想去看源码，又因为代码量太多，不知从何看起，今年重启了操作系统的学习计划，在搜索资料的过程中，大家都推荐《linux内核完全注释》这本书，果然非常经典，该书是以`linux0.12`版本来进行讲解，虽然是比较早期的版本，但是麻雀虽小，五脏俱全。后续又找到《Linux内核设计的艺术》这本书，从启动过程开始讲的，更加易懂，想学的朋友可以看看两本书，以下是本人的`学习笔记`

##### 从硬件开始

从我们使用计算机的经验得知：要想执行一个程序，必须在窗口中双击它，或者在命令行界面中输入相应的执行命令。但是，在开机加电的一瞬间，内存中什么程序也没有，BIOS是如何执行的呢？

不难得出这样的结论，既然软件的路走不通，只能依靠硬件方法完成了，CPU硬件逻辑设计为加电瞬间强行将CS的值置为`0xF000`、IP的值置为`0xFFF0`，这样CS:IP就指向`0xFFFF0`这个地址位置，这个位置放置的便是操作系统的引导块程序（bootsect.s），如下图，bootsect.s与之后的setup模块、system模块合力为操作系统运行做了很多准备工作

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/441510414840418e93b78ba0b9b20e6e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWGlhb-mVlA==:q75.awebp?rk3s=f64ab15b&x-expires=1728182773&x-signature=aOsXduhzPXfJ4mksbL329Eq7ES4%3D)

##### bootsect.s程序

`bootsect.s`代码是磁盘引导块程序，驻留在磁盘的第一个扇区中。在PC机加电ROM BIOS自检后，引导扇区由BIOS加载到内存`0x07c00`处，然后将自己移动到内存`0x90000`处。该程序的主要作用是首先将setup模块（由setup.s编译成）从磁盘加载到内存，紧接着bootsect的后面位置（`0x90200`），然后利用BIOS中断`0x13`取磁盘参数表中当前启动引导盘的参数，接着在屏幕上显示`Loading system...`字符串。再者将system模块从磁盘上加载到内存`0x10000`开始的地方。最后长跳转到setup程序的开始处（`0x90200`）执行setup程序  
![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/82997b2d6536468fb3851796ca36643a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWGlhb-mVlA==:q75.awebp?rk3s=f64ab15b&x-expires=1728182773&x-signature=frwxyLw6%2B3I2ZrV%2Fiu3Nxk0AgYI%3D)

这个代码块的迁移是怎么做的呢？我们来看看代码

ini

 代码解读

复制代码

`SETUPLEN = 4        ! nr of setup-sectors setup程序的扇区数（setup-sectors）值 BOOTSEG  = 0x07c0     ! original address of boot-sector bootsect的原始地址 INITSEG  = 0x9000     ! we move boot here - out of the way 将bootsect移到这里 SETUPSEG = 0x9020     ! setup starts here setup程序从这里开始 SYSSEG   = 0x1000     ! system loaded at 0x10000 (65536). system模块加载到0x10000（64kB）处 ENDSEG   = SYSSEG + SYSSIZE   ! where to stop loading 停止加载到段地址       entry start             ! 告知链接程序，程序从start标号开始执行 start:   mov ax,#BOOTSEG       ！将ds段寄存器置为0x07c0   mov ds,ax                mov ax,#INITSEG       ！将es段寄存器置为0x9000   mov es,ax   mov cx,#256           ！设置移动计数值为256字   sub si,si             ！原地址 ds:si = 0x07c0:0x0000   sub di,di             ！目标地址 es:di = 0x9000:0x0000   rep                   ！重复执行并递减cx的值，直到cx = 0为止   movw                  ！即movs指令。这里从内存[si]处移动cx个字到[di]处   jmpi  go,INITSEG      ！段间跳转（Jump Intersegment）。这里INITSEG指出跳转到的段地址，标号go是段内偏移地址 ​`

要理解上面这段代码，首先需要理解操作系统是如何寻址的，为什么要写下面两行？

bash

 代码解读

复制代码

`mov ax,#BOOTSEG       ！将ds段寄存器置为0x07c0 mov ds,ax`             

`ds`是一个16位的段寄存器，在内存寻址时充当段基址的作用，就是当我们使用汇编语言写一个内存地址时，实际上仅仅是写了偏移地址，比如：

css

 代码解读

复制代码

`mov ax, [0x0001]`

实际上相当于

css

 代码解读

复制代码

`mov ax, [ds:0x0001]`

就跟我们平时聊天，说一些地名的时候，会自动忽略中国、广东省这些前缀是一样的

还有比较重要的一点，这个`ds`被赋值为`0x07c0`，由于x86为了让自己能够在16位这个实模式下访问到20位的地址线，段基址需要先左移四位，那`0x07c0`左移四位就是`0x7c00`，也就是说，操作系统寻址时，需要先将段基址左移四位，再加上偏移量，注意，这是实模式下的寻址

通过接下来代码，ds（`0x07c0`）和si（`0x0000`）联合使用，构成了源地址`0x07c00`；es（`0x9000`）和di（`0x0000`）联合使用，构成了目的地址`0x90000`，一个`字`一个`字`复制到了`0x90000`处

perl

 代码解读

复制代码

  `jmpi  go,INITSEG  go: mov ax,cs     ! 将ds、es和ss都置成移动后代码所在的段处（0x9000）     mov ds,ax       ! 由于程序中有栈操作（push，pop，call），因此设置堆栈     mov es,ax ! put stack at 0x9ff00.     mov ss,ax        mov sp,#0xFF00    ! arbitrary value >>512`  

`jmpi go,INITSEG`接下来这个跳转指令写得很妙，复制bootsect完成后，在内存的`0x07c00`和`0x90000`位置有两段完全相同的代码，执行到`jmpi go,INITSEG`之后，程序就跳转到`0x90000`这边的代码执行了，在新位置执行，肯定是往下执行，而不是重复之间的代码，所以`go`这个偏移量就发挥了作用，`jmpi`是一个段间跳转指令，表示跳转到`0x9000:go`，段基址左移四位，也就是跳转到`0x90000:go`处执行，从下面开始，CPU在已移动到`0x90000`位置处的代码中执行 ![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f44bd2316cf540ceb2d8b57f4a1c70f1~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWGlhb-mVlA==:q75.awebp?rk3s=f64ab15b&x-expires=1728182773&x-signature=TvQ6taRW83TaaMpk8MMB9u4EuFk%3D)

接下来的代码设置几个段寄存器，包括栈寄存器ss和sp。为后续的操作做了一些准备工作，数据段寄存器跟代码段寄存器都被设置为`0x9000`，栈指针sp只要指向远大于512字节偏移（即地址0x90200）处都可以。因为从0x90200地址开始处还要放置setup程序，而此时setup程序大约为4个扇区，因此sp要指向大于（0x200 + 0x200 \* 4 + 堆栈大小）处

###### 加载setup模块

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/3e17f5ea41234479b57ff7cf20dcb75e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWGlhb-mVlA==:q75.awebp?rk3s=f64ab15b&x-expires=1728182773&x-signature=wdXfHGrTdKoa56Ax92JloBJUvDI%3D)

下面bootsect程序就要执行它的第二步工作，将setup程序加载到内存中，加载需要利用BIOS中断INT`0x13`中断向量所指向的中断服务程序来完成，如果读出错，则复位驱动器，并重试，没有退路

注意es已经设置好了（在移动代码时es已经指向目的段地址处`0x90000`），从磁盘第2个扇区开始读到`0x90200`开始处，共读4个扇区

`int 0x13`前面的四个`mov`指令是为了给BIOS中断服务程序传参

perl

 代码解读

复制代码

`load_setup:   mov dx,#0x0000    ! drive 0, head 0   mov cx,#0x0002    ! sector 2, track 0   mov bx,#0x0200    ! address = 512, in INITSEG   mov ax,#0x0200+SETUPLEN ! service 2, nr of sectors   int 0x13      ! read it   jnc ok_load_setup   ! ok - continue   mov dx,#0x0000   mov ax,#0x0000    ! reset the diskette   int 0x13   j load_setup`

开机启动显示信息 `Loading system`

arduino

 代码解读

复制代码

`! Print some inane message ​   mov ah,#0x03    ! read cursor pos   xor bh,bh   int 0x10      mov cx,#24   mov bx,#0x0007    ! page 0, attribute 7 (normal)   mov bp,#msg1   mov ax,#0x1301    ! write string, move cursor   int 0x10`

###### 加载system模块

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/2d0053626b1d4b5ab2be11106e784e7d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWGlhb-mVlA==:q75.awebp?rk3s=f64ab15b&x-expires=1728182773&x-signature=a8iRBQnA3bEBuD5DBg%2Bka0AC6WI%3D)

setup程序已经载入内存，现在开始将system模块加载到`0x10000`（64KB）开始处，`0x010000`与`0x90000`之间的距离是512K，当时操作系统设计者判断操作系统内核的大小不会超出512K

vbnet

 代码解读

复制代码

  `mov ax,#SYSSEG    ! #SYSSEG为0x1000   mov es,ax   ! segment of 0x010000 es存放system的段地址   call  read_it     ! 读磁盘上system模块，es为输入参数   call  kill_motor  ! 关闭驱动器马达，这样就可以知道驱动器的状态了 ​ ! After that we check which root-device to use. If the device is ! defined (!= 0), nothing is done and the given device is used. ! Otherwise, either /dev/PS0 (2,28) or /dev/at0 (2,8), depending ! on the number of sectors that the BIOS reports currently. ​   seg cs   mov ax,root_dev   cmp ax,#0   jne root_defined   seg cs   mov bx,sectors   mov ax,#0x0208    ! /dev/ps0 - 1.2Mb   cmp bx,#15   je  root_defined   mov ax,#0x021c    ! /dev/PS0 - 1.44Mb   cmp bx,#18   je  root_defined undef_root:   jmp undef_root root_defined:   seg cs   mov root_dev,ax ​ ! after that (everyting loaded), we jump to ! the setup-routine loaded directly after ! the bootblock: ​   jmpi  0,SETUPSEG    !跳转到0x9020:0000（setup.s程序的开始处）本程序到此就结束了`

`jmpi 0,SETUPSEG`跳转到`0x90200`处，就是setup程序开始的位置，至此，`bootsect.s`程序就结束了

##### setup.s程序

1.  利用ROM BIOS中断读取机器系统数据，并将这些数据保存到`0x90000`开始的位置（覆盖掉了bootsect程序所在的地方）
2.  移动system模块程序
3.  进入保护模式，设置中断描述符表寄存器（IDTR）、全局描述符表寄存器（GDTR）、中断描述符表（IDT）、全局描述符表（GDT），开启A20地址线
4.  跳转head.s程序运行

先看看第一件事，利用BIOS提供的中断服务程序从设备上提取内核运行所需的机器系统数据，并将这些机器系统数据加载到内存的`0x90000`到`0x901fc`位置处，这些数据将在以后main函数执行时发挥重要作用，下面是提取机器系统数据的具体代码，操作系统内核代码处处都是BIOS的调包侠

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ef8dd7b367f94d878678017169f49d96~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWGlhb-mVlA==:q75.awebp?rk3s=f64ab15b&x-expires=1728182773&x-signature=0xKrlumzutGZb75XlCwJ0bMACsI%3D)

ini

 代码解读

复制代码

`! ok, the read went well so we get current cursor position and save it for ! posterity. ​   mov ax,#INITSEG ! this is done in bootsect already, but...   mov ds,ax   mov ah,#0x03  ! read cursor pos   xor bh,bh   int 0x10    ! save it in known place, con_init fetches   mov [0],dx    ! it from 0x90000. ​ ! Get memory size (extended mem, kB) 获取内存信息 ​   mov ah,#0x88   int 0x15   mov [2],ax ​ ! Get video-card data: 获取显卡显示模式 ​   mov ah,#0x0f   int 0x10   mov [4],bx    ! bh = display page   mov [6],ax    ! al = video mode, ah = window width ​ ! check for EGA/VGA and some config parameters 检查显示方式并取参数 ​   mov ah,#0x12   mov bl,#0x10   int 0x10   mov [8],ax   mov [10],bx   mov [12],cx ​ ! Get hd0 data 获取第一块硬盘的信息 ​   mov ax,#0x0000   mov ds,ax   lds si,[4*0x41]   mov ax,#INITSEG   mov es,ax   mov di,#0x0080   mov cx,#0x10   rep   movsb ​ ! Get hd1 data 获取第二块硬盘的信息 ​   mov ax,#0x0000   mov ds,ax   lds si,[4*0x46]   mov ax,#INITSEG   mov es,ax   mov di,#0x0090   mov cx,#0x10   rep   movsb`

注意，`0x90000`这个地址之前是bootsect程序的，所以走到这里，bootsect程序已经被覆盖掉了

内存地址

长度(字节)

名称

0x90000

2

光标位置

0x90002

2

扩展内存数

0x90004

2

显示页面

0x90006

1

显示模式

0x90007

1

字符列数

0x90008

2

未知

0x9000A

1

显示内存

0x9000B

1

显示状态

0x9000C

2

显卡特性参数

0x9000E

1

屏幕行数

0x9000F

1

屏幕列数

0x90080

16

硬盘1参数表

0x90090

16

硬盘2参数表

0x901FC

2

根设备号

###### 进入保护模式

接下来，操作系统要为进入32位保护模式做大量的重建工作，首先做的一步就是关中断，程序在接下来的执行过程中，无论是否发生中断，系统都不会对此中断进行响应，直到main函数中能够适应保护模式的中断服务体系被重建完毕才能打开中断，而那时候响应中断的服务程序将不再是BIOS提供的中断服务程序，取而代之的是由系统自身提供的中断服务程序

arduino

 代码解读

复制代码

`cli     ! no interrupts allowed ! 从此开始不允许中断`

紧接着，setup程序做了一个影响深远的动作：将位于`0x10000`的内核程序复制至内存地址起始位置`0x0000`

ini

 代码解读

复制代码

`! first we move the system to it's rightful place ​   mov ax,#0x0000   cld     ! 'direction'=0, movs moves forward do_move:   mov es,ax   ! destination segment   add ax,#0x1000   cmp ax,#0x9000  !已经把最后一段（从0x8000段开始的64KB）代码移动完   jz  end_move    !是，则跳转   mov ds,ax   ! source segment   sub di,di   sub si,si   mov   cx,#0x8000   rep   movsw   jmp do_move`

`0x00000`这个位置原来存放着由BIOS建立的中断向量表及BIOS数据区。这个复制动作将BIOS中断向量表和BIOS数据区完全覆盖，使它们不复存在。直到新的中断服务体系构建完毕之前，操作系统不再具备响应并处理中断的能力

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/2b8a6558698c414cae54b13eec2323e0~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWGlhb-mVlA==:q75.awebp?rk3s=f64ab15b&x-expires=1728182773&x-signature=vHa8fzi7wK5UpLwd%2F6GHrAYhcEE%3D)

###### 设置中断描述符表和全局描述符表

紧接着，操作系统要设置两个非常重要的东西，中断描述符表（IDT）、全局描述符表（GDT）

GDT（Global Descriptor Table，全局描述符表），在系统中唯一的存放段寄存器内容（段描述符）的数组，配合程序进行保护模式下的段寻址。它在操作系统的进程切换中具有重要意义，可理解为所有进程的总目录表，其中存放每一个任务（task）局部描述符表（LDT，Local Descriptor Table）地址和任务状态段（TSS，Task Structure Segment）地址，完成进程中各段段寻址、现场保护与现场恢复

GDTR（Global Descriptor Table Register，GDT基地址寄存器），GDT可以存放在内存的任何地址。当程序通过段寄存器引用一个段描述符时，需要取得GDT的入口，GDTR标识的即为此入口。在操作系统对GDT的初始化完成后，可以用LGDT（Load GDT）指令将GDT基地址加载至GDTR

IDT（Interrupt Descriptor Table，中断描述符表），保存保护模式下所有中断服务程序的入口地址，类似于实模式下的中断向量表

IDTR（Interrupt Descriptor Table Register,IDT基地址寄存器），保存IDT的起始地址

中断描述符表暂时还不会用到，全局描述符表很快就要用到了，这个表是怎么用的呢？

保护模式下的寻址跟实模式下的寻址是不一样的，实模式下的寻址就是段基址左移四位，再加上偏移地址，保护模式下的段基址被称为段选择子。段选择子里存储着段描述符的索引

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/5d74c44936da4ed1b962771c819d255f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWGlhb-mVlA==:q75.awebp?rk3s=f64ab15b&x-expires=1728182773&x-signature=YLevm0p80hejMVtFpxcu4IRFXPw%3D)

通过段描述符索引，可以从全局描述符表gdt中找到一个段描述符，段描述符里存储着段基址，段基址取出来，再和偏移地址相加，就得到了物理地址

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/3362d25c25bb4686a3c168abfd3473e4~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWGlhb-mVlA==:q75.awebp?rk3s=f64ab15b&x-expires=1728182773&x-signature=pSavCcvHYVvN9TpW%2F2vqO0rEkK4%3D)

GDT的作用知道了，怎么知道它是在内存中的哪里，答案是GDTR，GDTR是一个存储GDT位置的寄存器

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/e198061f027d412dae4d0eeface13036~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWGlhb-mVlA==:q75.awebp?rk3s=f64ab15b&x-expires=1728182773&x-signature=Y%2F29tD0PgEkEBV9bkZZCAjVVtWU%3D)

接下来看看代码

python

 代码解读

复制代码

`end_move:   mov ax,#SETUPSEG  ! right, forgot this at first. didn't work :-)   mov ds,ax   lidt  idt_48    ! load idt with 0,0 加载IDTR寄存器   lgdt  gdt_48    ! load gdt with whatever appropriate 加载GDTR寄存器`

下面是加载中断描述符表寄存器IDTR的指令lidt要求的6字节操作数。前2字节是IDT表的限长，后4字节是IDT表在线性地址空间中的32位基地址。CPU要求在进入保护模式之前需设置IDT表，因此这里先设置一个长度为0的空表

ini

 代码解读

复制代码

`idt_48:   .word 0     ! idt limit=0   .word 0,0     ! idt base=0L`

下面是设置GDTR寄存器，立刻就要用到了，可以看到这个标签位置处表示一个48位的数据，其中高32位存储的正式全局描述符表的gdt的内存地址`0x90200 + gdt`，gdt是标签，表示在本文件内的偏移量，`0x800`定义了GDT的限制，`0x800`表示GDT的大小为2048字节，意味着GDT可以包含256个段描述符，每个段描述符8字节，2048/8 = 256

ini

 代码解读

复制代码

`gdt_48:   .word 0x800   ! gdt limit=2048, 256 GDT entries   .word 512+gdt,0x9 ! gdt base = 0X9xxxx`

gdt这个标签处，是全局描述符表在内存中的真正数据了

ini

 代码解读

复制代码

`gdt:   .word 0,0,0,0   ! dummy 第1个描述符，不用                   ! 在GDT表中这里的偏移量是0x08，它是内核代码段选择符的值   .word 0x07FF    ! 8Mb - limit=2047 (2048*4096=8Mb)   .word 0x0000    ! base address=0   .word 0x9A00    ! code read/exec  代码段只读，可执行   .word 0x00C0    ! granularity=4096, 386 颗粒度为4096，32位模式                   ! 在GDT表中这里的偏移量是0x10，它是内核数据段选择符的值   .word 0x07FF    ! 8Mb - limit=2047 (2048*4096=8Mb)   .word 0x0000    ! base address=0    .word 0x9200    ! data read/write 代码段可读可写   .word 0x00C0    ! granularity=4096, 386 颗粒度为4096，32位模式`

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/645e7978321b491c92cc50649b5392c8~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWGlhb-mVlA==:q75.awebp?rk3s=f64ab15b&x-expires=1728182773&x-signature=nrC5Ldi8nfMwwx9xlvU0b3V2QH0%3D)

下面设置并进入32位保护模式进行。首先加载机器状态字（lmsw-Load Machine Status Word），也称控制寄存器CR0，其比特位0置1将导致CPU切换到保护模式，并且运行在特权级0中，即当前特权级CPL=0

arduino

 代码解读

复制代码

`mov ax,#0x0001  ! protected mode (PE) bit lmsw  ax    ! This is it!`

scss

 代码解读

复制代码

`jmpi  0,8   ! jmp offset 0 of segment 8 (cs) 跳转至cs段偏移0处`

这一行代码便是保护模式下的寻址，`0`是段内偏移，`8`是保护模式下的段选择符，用于选择描述符表和描述符表项以及所要求的特权级。`8`转化成二进制就是`1000`，此时已经是保护模式了，内存寻址方式变了，段寄存器里的值被当作段选择子，对照下面的图，`1000`的最后两位`00`表示内核特权级，与之相对的用户特权级是`11`，第三位的`0`表示GDT，如果是1，则表示`LDT`，`1000`的`1`表示所选的表的第一项来确定代码段的段基址和段限长等信息。代码是从段基址0x00000000、偏移为0处，也就是head程序的开始位置开始执行的，这意味着下面将执行head程序

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/88f2a3bdd3224a01adc81c587b023254~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWGlhb-mVlA==:q75.awebp?rk3s=f64ab15b&x-expires=1728182773&x-signature=0N5HxAqgDGjcVKbS9UEj2NkwiMY%3D)

###### 内存变化

bootsect、setup程序中大量内存操作的示意图如下

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/46b5eb228e2c456b86c8ecec818ebce1~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWGlhb-mVlA==:q75.awebp?rk3s=f64ab15b&x-expires=1728182773&x-signature=HrZD5QvbD5gS6es2SmAvN0CvV7w%3D)

##### head.s程序

head程序执行完之后就要开始执行main函数了，所以经过head程序后，内存的布局大部分都固定了，我们主要关注head做了哪些内存的设置

perl

 代码解读

复制代码

`startup_32:   movl $0x10,%eax  ! eax表示是32位的ax寄存器   mov %ax,%ds   mov %ax,%es   mov %ax,%fs   mov %ax,%gs`

此时已经处于保护模式，cs本身不是段基址，而是段选择子，下面代码执行完毕后，ds、es、fs、gs中的值都成为0x10，与前面提到的`jmpi 0,8`中的`8`的分析方法相同，0x10转化成二进制就是`00010000`，最后三位与前面讲解的一样，其中最后两位`00`表示内核特权级，倒数第三位`0`表示选择GDT，倒数第四五位`10`是GDT的第三项，也就是数据段

###### 重新设置中断描述符表和全局描述符表

r

 代码解读

复制代码

`call setup_idt      ! 调用设置中断描述符表函数`

perl

 代码解读

复制代码

`setup_idt:   lea ignore_int,%edx   ! 将ignore_int的有效地址（偏移值）值设置到edx寄存器   movl $0x00080000,%eax   ! 将选择符0x0008置入eax的高16位中   movw %dx,%ax    /* selector = 0x0008 = cs */   movw $0x8E00,%dx  /* interrupt gate - dpl=0, present */ ​   lea _idt,%edi   mov $256,%ecx ! for循环执行256次，设置每一行中断描述符数据为上面的样子     rp_sidt:   movl %eax,(%edi)   movl %edx,4(%edi)   addl $8,%edi   dec %ecx          ! 减1   jne rp_sidt       ! 跳转到rp_sidt处   lidt idt_descr   ret`

中断描述符为64位，包含了其对应中断服务程序的段内偏移地址（offset）、所在段选择符（selector）、描述符特权级（DPL）、段存在标志（P）、段描述符类型（type）等信息，供CPU在程序中需要进行中断服务时找到相应的中断服务程序

其中，第0-15位和第48-63位组合成32位的中断服务程序的段内偏移地址（offset）；第16-31位为段选择符（selector），定位中断服务程序所在段；第47位为段存在标志（P），用于标识此段是否存在于内存中，为虚拟存储提供支持；第45-46位为特权级标志（DPL），特权级范围为0-3；第40-43位段描述符类型标志（DPL），特权级范围位0-3；第40-43位为段描述符类型标志（type），中断描述符对应的类型标志为0111（0xE），如下图

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/7677b7d22f0d41a48ccc761a820f1ce3~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWGlhb-mVlA==:q75.awebp?rk3s=f64ab15b&x-expires=1728182773&x-signature=%2BpKt%2FTwc71%2FfborxDIhXDOVVy4k%3D)

这四行代码的意思是对一行中断描述符做内存的设置，每一个中断描述符中的中断程序地址都指向`ignore_int`的函数地址，这是个默认的中断处理程序，在这个阶段，你按键盘，点鼠标都是没有反应的

perl

 代码解读

复制代码

`lea ignore_int,%edx  movl $0x00080000,%eax   ! 将选择符0x0008置入eax的高16位中 movw %dx,%ax    /* selector = 0x0008 = cs */ movw $0x8E00,%dx  /* interrupt gate - dpl=0, present */`

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/5e67e33b2be44d3abecddfdf8b578e58~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWGlhb-mVlA==:q75.awebp?rk3s=f64ab15b&x-expires=1728182773&x-signature=7h9aWwzDZ9xpVSti%2BwHTZ%2B0TpGc%3D)

设置gdt，代码跟setup程序类似

r

 代码解读

复制代码

`call setup_gdt`

php

 代码解读

复制代码

`setup_gdt:   lgdt gdt_descr      ! 加载全局描述符表寄存器   ret      ! 下面加载GDT, 这里全局表长度设置为2KB字节（0x7ff即可），因为每8字节 ! 组成一个描述符项，所以表中共可有256项，符号_gdt是全局表在本程序中的偏移位置         gdt_descr:   .word 256*8-1   # so does gdt (not that that's any   .long _gdt    # magic number, but it works for me :^)      _gdt: .quad 0x0000000000000000  /* NULL descriptor */   .quad 0x00c09a0000000fff  /* 16Mb */  0x08，内核代码段最大长度16MB   .quad 0x00c0920000000fff  /* 16Mb */  0x10，内核数据段最大长度16MB     .quad 0x0000000000000000  /* TEMPORARY - don't use */   .fill 252,8,0     /* space for LDT's and TSS's etc */     预留空间`

为什么要废除原来的GDT而重新设置一套GDT呢？

原来GDT所在的位置是设计代码时在setup.s里面设置的数据，将来这个setup模块所在的内存位置会在设计缓冲区时被覆盖。如果不改变位置，将来GDT的内容肯定会被缓冲区覆盖掉，从而影响系统的运行。这样一来，将来整个内存中唯一安全的地方就是现在head.s所在的位置了

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/2054370dab2646d8a8d8ccf625206275~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWGlhb-mVlA==:q75.awebp?rk3s=f64ab15b&x-expires=1728182773&x-signature=AXXUFXo5BYoGM3j25qqIbzsqZW4%3D)

###### 开启分页机制

bash

 代码解读

复制代码

`after_page_tables:   pushl $0    # These are the parameters to main :-)   pushl $0   pushl $0   pushl $L6   # return address for main, if it decides to.   pushl $_main   jmp setup_paging L6:   jmp L6      # main should never return here, but         # just in case, we know what happens.`

swift

 代码解读

复制代码

`setup_paging:   movl $1024*5,%ecx   /* 5 pages - pg_dir+4 page tables */   xorl %eax,%eax   xorl %edi,%edi      /* pg_dir is at 0x000 */   cld;rep;stosl   movl $pg0+7,_pg_dir   /* set present bit/user r/w */   movl $pg1+7,_pg_dir+4   /*  --------- " " --------- */   movl $pg2+7,_pg_dir+8   /*  --------- " " --------- */   movl $pg3+7,_pg_dir+12    /*  --------- " " --------- */   movl $pg3+4092,%edi   movl $0xfff007,%eax   /*  16Mb - 4096 + 7 (r/w user,p) */   std 1:  stosl     /* fill pages backwards - more efficient :-) */   subl $0x1000,%eax   jge 1b   xorl %eax,%eax    /* pg_dir is at 0x0000 */   movl %eax,%cr3    /* cr3 - page directory start */   movl %cr0,%eax   orl $0x80000000,%eax   movl %eax,%cr0    /* set paging (PG) bit */   ret     /* this also flushes prefetch-queue */`

接下来，开始创建分页机制，先要将页目录表和4个页表放在屋里内存的起始位置，从内存起始位置开始的5页空间内容全部清零（每页4KB），为初始化页目录和页表做准备。注意，这个动作起到了用1个页目录表和4个页表覆盖head程序自身所占内存空间的作用，这4个页表都是内核专属的页表，将来每个用户进程都会有它们专属的页表，这些工作做完后，内存中的布局如下所示

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/e0cda9d94f8843f38d46f7861b137939~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWGlhb-mVlA==:q75.awebp?rk3s=f64ab15b&x-expires=1728182773&x-signature=gh06cFVdQ%2FlUpTnoU7pb3vcp2jA%3D)

至于为什么要分页，我想放在另外一篇笔记上

至此，内存变成下图的样子，接下来会有一个压栈return跳转到`main`函数执行的骚操作，比较细节

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/7cbbbc58f5c543b991ac9f6b687aac34~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWGlhb-mVlA==:q75.awebp?rk3s=f64ab15b&x-expires=1728182773&x-signature=c7aRlK5wFdJlOVinKSUxQfLH%2BlY%3D)

##### 参考资料

《Linux内核设计的艺术》

《linux内核完全注释》

[github.com/dibingfa/fl…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdibingfa%2Fflash-linux0.11-talk%3Ftab%3Dreadme-ov-file "https://github.com/dibingfa/flash-linux0.11-talk?tab=readme-ov-file")