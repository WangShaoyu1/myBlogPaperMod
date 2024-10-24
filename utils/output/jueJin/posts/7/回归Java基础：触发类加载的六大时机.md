---
author: "捡田螺的小男孩"
title: "回归Java基础：触发类加载的六大时机"
date: 2019-09-22
description: "什么情况下会触发类加载的进行呢？本文将结合代码demo谈谈几种情况，希望对大家有帮助。 什么情况需要开始类加载过程的第一阶段：加载？Java虚拟机规范中并没有进行强制约束，这点可以交给虚拟机的具体实现来自由把握。但是对于初始化阶段，虚拟机规范则严格规定了以下几种情况必须立即对类…"
tags: ["Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:29,comments:0,collects:44,views:2902,"
---
![](/images/jueJin/16d59927154281d.png)

前言
--

什么情况下会触发类加载的进行呢？本文将结合代码demo谈谈几种情况，希望对大家有帮助。

类加载时机
-----

什么情况需要开始类加载过程的第一阶段：加载？Java虚拟机规范中并没有进行强制约束，这点可以交给虚拟机的具体实现来自由把握。但是对于初始化阶段，虚拟机规范则严格规定了以下几种情况必须立即对类进行初始化，如果类没有进行过初始化，则需要先触发其初始化。

![](/images/jueJin/16d593cdb1dee57.png)

创建类的实例
------

为了验证类加载，我们先配置一个JVM参数

```
-XX:+TraceClassLoading 监控类的加载
```

在IDE配置如下：

![](/images/jueJin/16d58ccf239f17d.png)

demo代码：

```
    public class ClassLoadInstance {
    
        static {
        System.out.println("ClassLoadInstance类初始化时就会被执行！");
    }
    
        public ClassLoadInstance() {
        System.out.println("ClassLoadInstance构造函数！");
    }
}

    public class ClassLoadTest {
    
        public static void main(String[] args) {
        ClassLoadInstance instance = new ClassLoadInstance();
    }
}

```

运行结果：

![](/images/jueJin/16d58d7a7735d91.png)

**结论：**

new ClassLoadInstance实例时，发现ClassLoadInstance被加载了，因此 new创建实例对象，会触发类加载进行。

访问类的静态变量
--------

demo代码：

```
    public class ClassLoadStaticVariable {
    
        static {
        System.out.println("ClassLoadStaticVariable类初始化时就会被执行！");
    }
    
    public static int i = 100;
    
        public ClassLoadStaticVariable() {
        System.out.println("ClassLoadStaticVariable构造函数！");
    }
    
}

    public class ClassLoadTest {
    
        public static void main(String[] args) {
        System.out.println(ClassLoadStaticVariable.i);
    }
}
```

运行结果：

![](/images/jueJin/16d58e23d0d91b8.png)

**结论：**

访问类ClassLoadStaticVariable的静态变量i时，发现ClassLoadStaticVariable类被加载啦，因此访问类的静态变量会触发类加载。

**注意：**

访问final修饰的静态变量时，不会触发类加载，因为在编译期已经将此常量放在常量池了。

访问类的静态方法
--------

demo代码：

```
    public class ClassLoadStaticMethod {
    
        static {
        System.out.println("ClassLoadStaticMethod类初始化时就会被执行！");
    }
    
        public static void method(){
        System.out.println("静态方法被调用");
    }
    
        public ClassLoadStaticMethod() {
        System.out.println("ClassLoadStaticMethod构造函数！");
    }
    
}

    public class ClassLoadTest {
    
        public static void main(String[] args) {
        ClassLoadStaticMethod.method();
    }
}
```

运行结果：

![](/images/jueJin/16d58effc2119fa.png)

结论：

访问类ClassLoadStaticMethod的静态方法method时，发现ClassLoadStaticMethod类被加载啦，因此访问类的静态方法会触发类加载。

反射
--

demo代码：

```
package classload;

    public class ClassLoadStaticReflect {
    
        static {
        System.out.println("ClassLoadStaticReflect类初始化时就会被执行！");
    }
    
        public static void method(){
        System.out.println("静态方法被调用");
    }
    
        public ClassLoadStaticReflect() {
        System.out.println("ClassLoadStaticReflect构造函数！");
    }
    
}

    public class ClassLoadTest {
    
        public static void main(String[] args) throws ClassNotFoundException {
        Class.forName("classload.ClassLoadStaticReflect");
    }
}
```

运行结果：

![](/images/jueJin/16d5900d7dfcb24.png)

**结论：**

反射得到类ClassLoadStaticReflect时，发现ClassLoadStaticReflect类被加载啦，因此反射会触发类加载。

当初始化一个类时，发现其父类还未初始化，则先触发父类的初始化
------------------------------

demo代码：

```
//父类
    public class ClassLoadSuper {
        static {
        System.out.println("ClassLoadSuper类初始化时就会被执行！这是父类");
    }
    
    public static int superNum = 100;
    
        public ClassLoadSuper() {
        System.out.println("父类ClassLoadSuper构造函数！");
    }
}
//子类
    public class ClassLoadSub extends ClassLoadSuper {
    
        static {
        System.out.println("ClassLoadSub类初始化时就会被执行！这是子类");
    }
    
    public static int subNum = 100;
    
        public ClassLoadSub() {
        System.out.println("子类ClassLoadSub构造函数！");
    }
    
}

    public class ClassLoadTest {
    
        public static void main(String[] args) throws ClassNotFoundException {
        ClassLoadSub classLoadSub = new ClassLoadSub();
    }
}
```

运行结果：

![](/images/jueJin/16d5913a74736e7.png)

看了运行结果，是不是发现，网上那道经典面试题（**讲讲类的实例化顺序**？）也很清晰啦。 先父类静态变量/静态代码块-> 再子类静态变量/静态代码块->父类构造器->子类构造器

**结论：**

实例化子类ClassLoadSub的时候，发现父类ClassLoadSuper先被加载，因此当初始化一个类时，发现其父类还未初始化，则先触发父类的初始化

虚拟机启动时，定义了main()方法的那个类先初始化
--------------------------

demo代码：

```
package classload;

    public class ClassLoadTest {
    
        public static void main(String[] args)  {
        System.out.println(ClassLoadSub.subNum);
    }
}
```

运行结果：

![](/images/jueJin/16d5922bdec72ac.png)

**结论：**

虚拟机启动时，即使有ClassLoadSub，ClassLoadSuper，ClassLoadTest等类被加载， 但ClassLoadTest最先被加载，即定义了main()方法的那个类会先触发类加载。

练习与小结
-----

触发类加载的六大时机，我们都分析完啦，是不是不做个题都觉得意犹未尽呢？接下来，我们来分析类加载一道经典面试题吧。

```
    class SingleTon {
    private static SingleTon singleTon = new SingleTon();
    public static int count1;
    public static int count2 = 0;
    
        private SingleTon() {
        count1++;
        count2++;
    }
    
        public static SingleTon getInstance() {
        return singleTon;
    }
}

    public class ClassLoadTest {
        public static void main(String[] args) {
        SingleTon singleTon = SingleTon.getInstance();
        System.out.println("count1=" + singleTon.count1);
        System.out.println("count2=" + singleTon.count2);
    }
}

```

运行结果：

![](/images/jueJin/16d592b67bfbed3.png)

**分析：**

1.  SingleTon.getInstance()，调用静态方法，触发SingleTon类加载。
2.  SingleTon类加载初始化，按顺序初始化静态变量。
3.  先执行private static SingleTon singleTon = new SingleTon(); ，调用构造器后，count1，count2均为1；
4.  按顺序执行 public static int count1; 没有赋值，所以count1依旧为1；
5.  按顺序执行 public static int count2 = 0;所以count2变为0.

个人公众号
-----

![](/images/jueJin/16c381c89b127bb.png)

欢迎大家关注，大家一起学习，一起讨论。