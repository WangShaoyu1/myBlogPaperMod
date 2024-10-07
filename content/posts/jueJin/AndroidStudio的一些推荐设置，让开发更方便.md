---
author: "小墙程序员"
title: "AndroidStudio的一些推荐设置，让开发更方便"
date: 2024-10-01
description: "Androidstudio的功能非常强大，这里推荐一些好用的设置，让开发更加方便。类型提示在开发过程中，我们一般都需要知道当前变量的类型。在kotlin中可以自动推断，减少了很多不必要的代"
tags: ["Android","AndroidStudio"]
ShowReadingTime: "阅读3分钟"
weight: 897
---
Android studio 的功能非常强大，这里推荐一些好用的设置，让开发更加方便。

### 类型提示

在开发过程中，我们一般都需要知道当前变量的类型。在 kotlin 中可以自动推断，减少了很多不必要的代码，但是也让阅读代码变得麻烦。在 Android studio 中，我们可以通过 setting -〉Inlay Hint 来让IDE 帮我们显示具体的类型。如下图所示：

*   显示变量的类型

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/2977bdbb78c54a6bab12bff3121013d3~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5aKZ56iL5bqP5ZGY:q75.awebp?rk3s=f64ab15b&x-expires=1728357935&x-signature=Q2WD2PI4oGwYMj2xaw7x%2F1OL%2BBM%3D)

*   显示方法链的中间变量类型

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/0008fe89e2c6494983b67377eb74319a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5aKZ56iL5bqP5ZGY:q75.awebp?rk3s=f64ab15b&x-expires=1728357935&x-signature=O42YjQ8o6WmTQo%2BOh%2FeQTU8jaGU%3D)

### 文件的导航方式

在编写代码或者查看源码时，Android studio 会把最近使用的文件放到顶部Tab上。我们可以通过 Setting -> Editor -> General -> Editor Tab 对它进行设置。如下图所示，可以设置文件的放置位置，摆放顺序，最大显示文件数等配置。可以根据你的喜好，和电脑的屏幕大小来配置你想要的参数。

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/40ac50816f5c4ecaa8ff68c96634a73f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5aKZ56iL5bqP5ZGY:q75.awebp?rk3s=f64ab15b&x-expires=1728357935&x-signature=GGTPuSzvmlFIz%2BOtPl928dOhlSI%3D)

这里根据我的喜好设置后的效果如下图所示：

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/9fd3a55e70884d49964cc6eb9f815995~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5aKZ56iL5bqP5ZGY:q75.awebp?rk3s=f64ab15b&x-expires=1728357935&x-signature=LPf5GeKHKrhqiRdH%2B%2BXO2q%2FBI6o%3D)

### 自动处理 import（导入）

在开发过程中，修改代码是必不可少的。这时候我们可能需要导入类名或者移除不需要的类名。在 Android studio 中，可以通过 Setting -> Editor -> General -> Auto Import 来设置自动导入和移除。如下图所示：

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/d015aae592174ffe990588efbb1b4953~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5aKZ56iL5bqP5ZGY:q75.awebp?rk3s=f64ab15b&x-expires=1728357935&x-signature=xpaaSRCP2Ssv3JF%2FOw6ZZ6TCMJU%3D)

需要注意，只有当前导入选项只有一个时才会自动导入，否则还是需要我们手动选择。

### 代码格式化

在 Android studio 中，我们可以使用 Option + Command + L 快捷键来自动格式化代码。但是格式化的代码总是会自动换行。这时候，我们就可以通过 Setting -> Editor -> Code Style -> Kotlin -〉Wrapping and Braces 选项来自定义换行的策略。

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/b51f3780efb042018197744c3d39a082~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5aKZ56iL5bqP5ZGY:q75.awebp?rk3s=f64ab15b&x-expires=1728357935&x-signature=tJwZYxEdUYQNHAG%2FtHHINgNcDHA%3D)

如上图所示，**Hard wrap at** 定义的是长度为多少是必须换行；**Function declaration parameters** 定义的是方法中定义的参数的换行配置；**Function call arguments** 定义的是调用方法时的参数列表的换行配置。

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ab240673df874485a20e2770ccfc48bd~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5aKZ56iL5bqP5ZGY:q75.awebp?rk3s=f64ab15b&x-expires=1728357935&x-signature=VuY%2Fx26eYIMOrJHmySBb2WAKSk4%3D)

如上图所示，策略有四种，**do not wrap** 是不换行；**wrap always** 是总是换行。**wrap if long** 和 **chop down if long** 是一行的代码超过了 **Hard wrap at** 中定义的值时会换行，具体区别如下所示：

kotlin

 代码解读

复制代码

`// wrap if long fun foo1(i1: Int, i2: Int, i3: Int, i4: Int, i5: Int, i6: Int,      i7: Int, i8: Int, i9: Int, i10: Int, i11: Int) { } // chop down if long fun foo1(i1: Int,     i2: Int,     i3: Int,     i4: Int,     i5: Int,     i6: Int,     i7: Int,     i8: Int,     i9: Int,     i10: Int,     i11: Int) { }`

### 自定义工具面板

在 Android studio 中，快捷键和插件非常多，导致我们常常记不住一些不常用的快捷键。在 Android studio 中，我们可以使用 Quick Lists 来解决这个问题。通过 Setting -> Appearance & Bahavior -> Quick Lists 打开自定义工具面板，点击 + 按钮就可以自定义你的常用快捷面板了。

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/6826ad1e768e42b3a62397d3c9908536~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5aKZ56iL5bqP5ZGY:q75.awebp?rk3s=f64ab15b&x-expires=1728357935&x-signature=%2Fco7Pyi%2BkmVGidC886Nk1G%2BIGJQ%3D)

如上图所示，我们可以往面板放快捷键，也可以设置一些插件。设置好你的配置后，通过 Setting -> Keymap -> Quick Lists 找到你配置的快捷面板，然后通过 Add keyboard shortcut 来设置快捷键打开该面板。

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/4978f64f9064455299fc7e4967ce93d9~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5aKZ56iL5bqP5ZGY:q75.awebp?rk3s=f64ab15b&x-expires=1728357935&x-signature=Ombj1zdpaWNCnxOa2fKpR%2FMLd8k%3D)

效果如下所示，这样你记住一个快捷键就可以了。

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ec6d3c9323254e1c83f6d2fa91192b89~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5aKZ56iL5bqP5ZGY:q75.awebp?rk3s=f64ab15b&x-expires=1728357935&x-signature=HiHsM9%2FRnpmeDsxt3qp7VxCX7yU%3D)