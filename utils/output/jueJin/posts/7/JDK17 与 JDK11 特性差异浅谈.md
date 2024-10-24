---
author: "政采云技术"
title: "JDK17 与 JDK11 特性差异浅谈"
date: 2024-01-25
description: "11 switch 表达式语法变化 在 JDK12 之前如果 switch 忘记写 break 将导致贯穿，在 JDK12 中对 switch 的这一贯穿性做了改进。你只要将 case 后面的冒号改"
tags: ["后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读17分钟"
weight: 1
selfDefined:"likes:7,comments:3,collects:11,views:8843,"
---
![文章顶部.png](/images/jueJin/b637793da67b4e0.png) ![](/images/jueJin/3556a291eb2948e.png)

1.1 switch 表达式语法变化
------------------

0.  在 JDK12 之前如果 switch 忘记写 break 将导致贯穿，在 JDK12 中对 switch 的这一贯穿性做了改进。你只要将 case 后面的冒号改成箭头，那么你即使不写break也不会贯穿了。
1.  switch 可作为表达式，不再是单独的语句。
2.  当你把 switch 中的 case 后的冒号改为箭头之后，此时 switch 就不会贯穿了，但在某些情况下，程序本来就希望贯穿比如我就希望两个 case 共用一个执行体。JDK12 的 switch 中的 case 也支持多值匹配，这样程序就变得更加简洁了。
3.  JDK13 引入了一个新的 yield 语句来产生一个值，该值成为封闭的 switch 表达式的值。yield 和 return 的主要区别在于它们如何控制程序的流程。return 会结束当前的方法或函数，并将控制权返回给调用者。而 yield 则会暂时离开当前的 switch 表达式，将一个值返回给调用者，然后再回到 switch 表达式的地方继续执行。

```typescript
    public class Demo{
        public static void main(String[] args){
        var score = 'C';
        // 执行switch分支语句
            String s = switch (score){
            case 'A', 'B' -> "上等";
            case 'C' -> "中等";
            case 'D', 'E' -> "下等";
                default -> {
                    if (score > 100) {
                    yield "数据不能超过100";
                        } else {
                        yield score + "此分数低于0分";
                    }
                }
            }
        }
    }
```

1.2 微基准测试套件
-----------

JMH ，即 Java Microbenchmark Harness ，是专门用于代码微基准测试的工具套件。

### JMH 典型的应用场景

0.  想定量地知道某个方法需要执行多长时间，以及执行时间和输入参数的相关性。
1.  一个接口有两种不同实现，希望比较哪种实现性能更好。

### JMH 使用案例

#### 增加 JMH 的依赖

```xml
<properties>
<jmh.version>1.14.1</jmh.version>
</properties>
<dependencies>
<dependency>
<groupId>org.openjdk.jmh</groupId>
<artifactId>jmh-core</artifactId>
<version>${jmh.version}</version>
</dependency>
<dependency>
<groupId>org.openjdk.jmh</groupId>
<artifactId>jmh-generator-annprocess</artifactId>
<version>${jmh.version}</version>
<scope>provided</scope>
</dependency>
</dependencies>
```

#### 代码编写

```java
import org.openjdk.jmh.annotations.*;
​
@State(Scope.Thread)
    public class MyBenchmark {
    @Benchmark
    @BenchmarkMode(Mode.All)
        public void testMethod() {
            try {
            Thread.sleep(300);
                } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        ​
        @Benchmark
        @BenchmarkMode(Mode.All)
            public void testMethod2() {
                try {
                Thread.sleep(600);
                    } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
        ​
``````arduino
import org.openjdk.jmh.runner.Runner;
import org.openjdk.jmh.runner.options.Options;
import org.openjdk.jmh.runner.options.OptionsBuilder;
​
    public class BenchmarkRunner {
        public static void main(String[] args) throws Exception {
        Options opt = new OptionsBuilder()
        .include(MyBenchmark.class.getSimpleName())
        .forks(1)
        .warmupIterations(5)
        .measurementIterations(5)
        .build();
        new Runner(opt).run();
    }
}
//以下这些方法都是JMH的一部分，可以在任何版本的JMH中使用。
//include(SimpleBenchmark.class.getSimpleName()) ：这个方法表示你想要运行哪个类的基准测试。
//exclude("xxx") ：这个方法表示你想要在基准测试中排除哪个方法。
//forks(1) ：这个方法表示你想要进行多少轮的基准测试。每一轮测试都会在一个新的 JVM 进程中进行，以确保每轮测试的环境是独立的。
//warmupIterations(5) ：这个方法表示你想要进行多少次预热迭代。预热迭代是为了让 JVM 达到稳定状态，预热迭代的结果不会被计入最终的基准测试结果。
//measurementIterations(5) ：这个方法表示你想要进行多少次正式的基准测试迭代，这些迭代的结果会被用来计算基准测试的最终结果。
```

#### 结果输出（只截取了一部分）

![](/images/jueJin/39518227af7c489.png)

![](/images/jueJin/2fc27ed495bb469.png)

#### 相关注解

##### @BenchmarkMode

对应 Mode 选项，可用于类或者方法上，需要注意的是，这个注解的 value 是一个数组，可以把几种 Mode 集合在一起执行，还可以设置为 Mode.All ，即全部执行一遍。

![](/images/jueJin/271dd309e8694a0.png)

*   吞吐量 (thrpt) ：单位时间内完成的操作次数，也可以理解为每秒能处理的事务数。
*   平均时间 (avgt) ：每次操作所需的平均时间。
*   样本时间 (sample) ：随机取样，最后输出取样结果的分布，例如“99%的调用在xxx毫秒以内，99.99%的调用在xxx毫秒以内”。
*   单次启动时间 (ss) ：SingleShotTime ，度量一次操作的运行时间，即每次迭代前都会重新初始化状态。

##### @State

类注解，JMH 测试类必须使用 @State 注解，State 定义了一个类实例的生命周期，可以类比 SpringBean 的 Scope 。由于 JMH 允许多线程同时执行测试，不同的选项含义如下:

Scope.Thread ：默认的 State ，每个测试线程分配一个实例。

Scope.Benchmark ：所有测试线程共享一个实例，用于测试有状态实例在多线程共享下的性能。

Scope.Group ：每个线程组共享一个实例。

如果你想测试一个对象在多线程环境下的行为，你可以选择 Scope.Benchmark 。如果你想要每个线程都有自己的状态，你可以选择 Scope.Thread 。如果你想要在同一线程组内的所有线程共享状态，你可以选择 Scope.Group 。

##### @OutputTimeUnit

benchmark 结果所使用的时间单位，可用于类或者方法注解，使用 java.util.concurrent.TimeUnit 中的标准时间单位。

##### @Benchmark

方法注解，表示该方法是需要进行 benchmark 的对象。

1.3 生成类数据共享特性优化
---------------

背景：在同一个物理机上启动多个 JVM 时，如果每个虚拟机都单独装载自己需要的所有类，启动成本和内存占用是比较高的。所以引入了类数据共享机制 ( Class Data Sharing ，简称 CDS ) 的概念，通过把一些核心类在每个 JVM 间共享，每个 JVM 只需要装载自己的应用类即可。

JDK12 之前想要利用 CDS 的用户，必须 -Xshare:dump 作为额外的步骤来运行。

JDK12 针对 64 位平台使其默认生成类数据共享 ( CDS ) 归档。

好处：JVM启动时间减少了。因为核心类是共享的，所以 JVM 的内存占用也减少了。

JDK13 则支持在应用运行之后进行动态归档。需要使用 -XX:ArchiveClassesAtExit=filename.jsa 选项来指定一个文件，JVM 会在退出时将应用程序类和标准库类的元数据写入这个文件。然后，在下一次启动 JVM 时，你可以使用 -XX:SharedArchiveFile=filename.jsa 选项来指定刚才创建的文件。

好处：这个特性允许 JVM 在运行时捕获类的元数据，然后在下一次 JVM 启动时重用这些元数据，从而提高启动速度和减少内存占用。

1.4 G1 垃圾收集器和 ZGC 功能增强
----------------------

0.  在 JDK12 之前，一旦开始执行垃圾收集，即使可能会超过 -XX:MaxGCPauseMillis 参数设定的值，也不会停止。JDK12 中，如果 G1 垃圾收集器有可能超过预期的暂停时间，则可以终止。G1 垃圾收集器发现反复标记过多的区域后，G1 就会切换到更增量的一种 Mix GC 。它将待回收的集合分为两个部分：强制回收和可选回收。强制回收的部分是 G1 无法增量回收的部分（比如年轻代）也可以包含能增量回收的部分（比如老年代）来提升性能，它占待回收集合的 80% 。当 G1 回收完强制回收部分后，如果还有多余的时间，将会更细粒度的处理可选回收部分，每次只会处理一个区域，避免超过用户指定的时间。在处理完一个区域后，G1 会根据剩余的时间来决定是否继续处理剩余的可选部分。
1.  JDK12 中，如果应用程序活动非常低，G1 可以使其能够在空闲时自动将 Java 堆内存返还给操作系统。
2.  JDK13 中，ZGC 也能够主动释放未使用内存给操作系统，但可以通过 -XX : -ZUncommit 参数来显示关闭此功能。ZGC 支持最大堆大小为 16TB ，可以满足大多数大型服务器的需求。
3.  ZGC 是在 JDK11 中引入的垃圾回收器，但一直都是实验版本，在 JDK15 中正式上线，如果你的应用程序需要处理非常大的堆或者更低的暂停时间，那么 ZGC 可能是一个更好的选择。如果你对兼容性和稳定性有更高的要求，因为 G1 经过长时间的验证和优化，可能 G1 更适合。

1.5 ShenandoahGC
----------------

添加一个名为 Shenandoah 的新垃圾收集算法，通过与正在运行的 Java 线程同时进行疏散工作来减少 GC 暂停时间，最终目标旨在针对 JVM 上的内存收回实现低停顿的需求。

Shenandoah 是以实验特性在 JDK12 中引入的。在 JDK15 中正式上线。

使用 Shenandoah 的暂停时间与堆大小无关，这意味着无论堆是 200MB 还是 200GB ，都将具有相同的一致暂停时间。与 ZGC 类似，Shenandoah GC 主要目标是 99.9% 的暂停小于 10ms ，暂停与堆大小无关等。

ZGC 和 ShenandoahGC 的一些主要区别：

0.  设计目标：ZGC 和 ShenandoahGC 都是为了实现低延迟的垃圾收集而设计的。
1.  并发回收：ShenandoahGC 实现了并发回收，这意味着它可以在应用线程运行的同时进行垃圾收集，从而减少了垃圾收集对应用性能的影响。
2.  内存管理：ShenandoahGC 使用名为“连接矩阵”的全局数据结构来记录跨 Region 的引用关系，降低了处理跨代指针时的记忆集维护消耗。而 ZGC 的 Region 可以动态创建和销毁，容量也可以动态调整。
3.  开发者：Shenandoah 由 RedHat 开发，而 ZGC 由 Oracle 开发。

使用方法：要启用/使用 Shenandoah GC，需要以下 JVM 选项: -XX:+UnlockExperimentalVMOptions -XX:+UseShenandoahGC。作为实验性功能，Shenandoah 构建系统会自动禁用不受支持的配置。

1.6 String 新增方法
---------------

0.  transform(Function)：对字符串进行处理后返回。
    
    ```ini
    var rs = "test".transform(s -> s + "Java").transform(s -> s.toUpperCase());
    // TESTJAVA
    ```
1.  indent：该方法允许我们调整String实例的缩进。
    
    ```ini
    String result = "Java\njava\ntest".indent(3);
    /*结果会缩进三格
    Java
    java
    test
    */
    ```

1.7 Files 新增 mismatch 方法
------------------------

返回内容第一次不匹配的字符位置索引。

```less
System.out.println(Files.mismatch(Path.of("a.txt"),Path.of("b.txt")));
```

1.8 核心库 java.text 支持压缩数字格式
--------------------------

NumberFormat 添加了对 ”紧凑形式格式化数字“ 的支持。

”紧凑数字格式“是指以简短或人类可读形式表示的数字。

例如，在 en\_US 语言环境中，1000 可以格式化为 “ 1K ”，1000000 可以格式化为 “ 1M ”，具体取决于指定的样式 NumberFormat.Style 。紧凑数字格式由 LDML 的 Compact Number 格式规范定义。要获取实例，请使用 NumberFormat 紧凑数字格式所给出的工厂方法之一。

```scss
NumberFormat fmt = NumberFormat.getCompactNumberInstance(Locale.US, NumberFormat.Style.SHORT);
String result = fmt.format(1000);
//1K
​
var cnf = NumberFormat.getCompactNumberInstance(Locale.CHINA,NumberFormat.Style.SHORT);
System.out.println(cnf.format(5_0000));
//"5万"
System.out.println(cnf.format(7_9200));
//"7.9万"
System.out.println(cnf.format(8_000_000));
//"800万"
System.out.println(cnf.format(9L << 30));
//"96亿"
System.out.println(cnf.format(6L << 50));
//"5637142兆"
System.out.println(cnf.format(6L << 60));
//"6917529京"
```

1.9 JDK17 支持到 Unicode13
-----------------------

JDK12 支持 Unicode11.0

JDK13 支持 Unicode12.1

从 JDK14 到 JDK17 均是支持 Unicode13.0

1.10 NullPointerExceptions 升级
-----------------------------

JDK14 之前，从报错中我们只能得到错误出现的行数，但在 JDK14 之后，会清晰的告诉你哪个对象空指针了。

```php
Exception in thread "main" java.lang.NullPointerException:
Cannot invoke "String.charAt(int)" because "str" is null
at com.qf.jdk14.Test.main(Test.java:11)
```

1.11 文本块特性
----------

背景：在 Java 中，在字符串文字中嵌入 HTML ，XML ，SQL 或 JSON 片段通常需要先进行转义和串联的大量编辑，然后才能编译包含该片段的代码。该代码段通常难以阅读且难以维护。

Java 的文本块特性是在 JDK15 中正式实现的。这个特性首先在 JDK13 中以预览版的形式发布，然后在 JDK14 中改进并再次以预览版的形式发布。这一特性提高了 Java 程序书写大段字符串文本的可读性和方便性。

文本块的开头定界符是由三个双引号 """ 开始，从新的一行开始字符串的内容，以 """ 结束。如果结束的 """ 另起一行时，字符串内容最后会留有一新行。

### 使用案例

```ini
String query = "SELECT `EMP_ID`, `LAST_NAME` FROM `EMPLOYEE_TB`\n" +
"WHERE `CITY` = 'INDIANAPOLIS'\n" +
"ORDER BY `ID`, `LAST_NAME`;";
//使用文本块语法
String query = """
SELECT `EMP_ID`, `LAST_NAME` FROM `EMPLOYEE_TB`
WHERE `CITY` = 'INDIANAPOLIS'
ORDER BY `EMP_ID`, `LAST_NAME`;""";
``````ini
String html = "<html>\n" +
"    <body>\n" +
"        <p>Hello, world</p>\n" +
"    </body>\n" +
"</html>\n";
//使用文本块语法
String html = """
<html>
<body>
<p>Hello, world</p>
</body>
</html>
""";
```

### 缩进示例

Java 编译器会自动删除不需要的缩进：

*   每行结尾的空格都会删除。
*   每行开始的共有的空格会自动删除。
*   只保留相对缩进。
*   新行 **"""** 结束时，将 **"""** 向左调整，则可以给所有行前加相应数量的空格。将 **"""** 向右调整，没有作用。

```python
System.out.println("""
Hello,
multiline
text blocks!
""");
// 结果
// >     Hello,
// >       multiline
// >     text blocks!
```

1.12 重新实现旧版 Socket API
----------------------

背景：现在已有的 java.net.Socket 和 java.net.ServerSocket 以及它们的实现类，都可以回溯到 JDK1.0 时代了。原始 socket 的维护和调试都很痛苦。实现类还使用了线程栈作为 I/O 的缓冲，导致在某些情况下还需要增加线程栈的大小。该实现还存在几个并发问题，需要彻底解决。在未来的网络世界，要快速响应，不能阻塞本地方法线程，当前的实现不适合使用了。

JDK13 全新实现的 NioSocketImpl 来替换 JDK1 的 SocketImpl 和 PlainSocketImpl。

*   它便于维护和调试，与 NewI/O (NIO) 使用相同的 JDK 内部结构，因此不需要使用系统本地代码。
*   它与现有的缓冲区缓存机制集成在一起，这样就不需要为 I/O 使用线程栈。
*   它使用 java.util.concurrent 锁，而不是 synchronized 同步方法，增强了并发能力。
*   新的实现是 JDK13 中的默认实现，但是旧的实现还没有删除，可以通过设置参数 -Djdk.net.usePlainSocketImpl=true 来切换到旧版本。

1.13 Hidden Classes
-------------------

通常我们在使用大型的框架或者 lambda 表达式的时候，会动态生成很多类。但是不幸的是标准的定义类的API:ClassLoader::defineClass 和 Lookup::defineClass 不能够区分出这些类是动态生成(运行时生成)的还是静态生成(编译生成)的。

一般来说动态生成的类生命周期更短，并且其可⻅性要更低。但是现有的 JDK 并没有这个功能。

所有有了 HiddenClasses 的提案，通过 HiddenClasses ，不管是 JDK 还是 JDK 外部的框架，在生成动态类的时候都可以定义为 HiddenClasses，这样可以更加有效的控制这些动态生成类的生命周期和可⻅性。

1.14 instanceof 关键词
-------------------

instanceof关键词主要用来判断某个对象是不是某个类的实例。

比如，有时候我们要处理一个类似这样的数据集:

```javascript
Map<String, Object> data = new HashMap<>();
data.put("test", "111");
data.put("test2", 222);
```

JDK16 之前需要先判断获取的 value 是否是 String ，再做强制类型转换：

```ini
Object value = data.get("test");
if (value instanceof String)
    {
    String s = (String) value;
    System.out.println(s.substring(1));
}
```

在 JDK16 的增强之后，对于 instanceof 的判断以及类型转换可以合二为一了:

```ini
Object value = data.get("test");
if (value instanceof String s)
    {
    System.out.println(s.substring(1));
}
```

1.15 档案类
--------

Records 的目标是扩展 Java 语言语法，Records 为声明类提供了一种紧凑的语法，通过对类做这样的声明，编译器可以通过自动创建所有方法并让所有字段参与 hashCode() 等方法。其目的是为了充当不可变数据的透明载体的类。

旧方法定义实体类，代码如下:

```arduino
    public final class User {
    final String name;
    final int age;
        public User(String name, int age) {
        this.name = name;
        this.age = age;
    }
    @Override
        public String toString() {
        return "User{" +
        "name='" + name + ''' +
        ", age=" + age +
        '}';
    }
    @Override
        public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return age == user.age && Objects.equals(name, user.name);
    }
    @Override
        public int hashCode() {
        return Objects.hash(name, age);
    }
}
```

通过 Record 类方式，一句话就可以实现以上功能，代码如下:

```arduino
public record User(String username, String password) {}
```

在 JDK16 之前的版本中，我们不能在类名后面直接写参数来定义类的状态。这是 JDK16 引入 record 类的一个新特性。

调用 Record 类方式，如下:

```typescript
    public class App {
        public static void main(String[] args) {
        User user = new User("user", "123456");
        System.out.println(user.username());
    }
}
```

注意事项：

*   record 类不允许使用 abstract 关键字定义为抽象
*   所有成员变量均为 final 修饰，不允许再次赋值
*   允许出现静态变量/实例方法/静态方法
*   允许出现其他构造方法，但必须调用 record 构造方法
*   Record 不允许 extends 继承其他类

1.16 密封类
--------

在 JDK15 中，Java 提出了密封类（ Sealed Classes ）的概念，在 JDK17 中被正式确认。密封类允许类和接口定义其允许的子类型。因此，如果一个类没有显式地使用 sealed 、non-sealed 或 final 关键字，那么它的默认权限就是 non-sealed 。

以下是一个密封类的代码示例：

```scala
    sealed class Human permits Kyrie, LeBron, George {
        public void printName() {
        System.out.println("Default");
    }
}
    non-sealed class Kyrie extends Human {
        public void printName() {
        System.out.println("Bob");
    }
}
    sealed class LeBron extends Human {
        public void printName() {
        System.out.println("Mike");
    }
}
    final class George extends Human {
        public void printName() {
        System.out.println("Yannick");
    }
}
```

在这个例子中，Human 是一个密封类，它只允许 Kyrie，LeBron 和 George 这三个类继承。这样，我们就可以更精确地控制哪些类可以继承 Human 类，从而提高代码的安全性和可读性。

1.17 统一日志异步刷新
-------------

在 JDK17 中，引入了一项新特性：统一日志异步刷新。

先将日志写入缓存，然后再异步地刷新到日志文件，这样写日志的操作就不会阻塞执行业务逻辑的线程，从而提高了程序的运行效率。这个特性对于需要大量日志输出，并且对性能有较高要求的应用来说，是一个非常实用的改进。可以通过传递命令行选项 -Xlog:async 来开启此功能。

总结
--

从 JDK11 到 JDK17 ，Java 的发展经历了一系列重要的里程碑。其中最重要的是 JDK17 的发布，这是一个长期支持（LTS）版本，它将获得长期的更新和支持，有助于保持程序的稳定性和可靠性。此外，Java 的性能也有了显著的提升。这些进步都反映了 Java 在持续改进和适应现代编程需求方面的承诺。

参考文档
----

0.  [openjdk.org/projects/jd…](https://link.juejin.cn?target=https%3A%2F%2Fopenjdk.org%2Fprojects%2Fjdk%2F "https://openjdk.org/projects/jdk/")
1.  [JDK12: JDK12新功能深度解析\_jdk12新特性-CSDN博客](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fweixin_42386551%2Farticle%2Fdetails%2F109285650 "https://blog.csdn.net/weixin_42386551/article/details/109285650")
2.  [switch statement - What does the new keyword "yield" mean in Java 13? - Stack Overflow](https://link.juejin.cn?target=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F58049131%2Fwhat-does-the-new-keyword-yield-mean-in-java-13 "https://stackoverflow.com/questions/58049131/what-does-the-new-keyword-yield-mean-in-java-13")
3.  [New Features in Java 13 | Baeldung](https://link.juejin.cn?target=https%3A%2F%2Fwww.baeldung.com%2Fjava-13-new-features "https://www.baeldung.com/java-13-new-features")
4.  [Java 11 and 12 - New Features (packtpub.com)](https://link.juejin.cn?target=https%3A%2F%2Fsubscription.packtpub.com%2Fbook%2Fprogramming%2F9781789133271%2F15%2Fch15lvl1sec91%2Fabortable-mixed-collections-for-g1 "https://subscription.packtpub.com/book/programming/9781789133271/15/ch15lvl1sec91/abortable-mixed-collections-for-g1")
5.  [Java 16 and IntelliJ IDEA | The IntelliJ IDEA Blog (jetbrains.com)](https://link.juejin.cn?target=https%3A%2F%2Fblog.jetbrains.com%2Fidea%2F2021%2F03%2Fjava-16-and-intellij-idea%2F "https://blog.jetbrains.com/idea/2021/03/java-16-and-intellij-idea/")
6.  [Sealed Class in Java - GeeksforGeeks](https://link.juejin.cn?target=https%3A%2F%2Fwww.geeksforgeeks.org%2Fsealed-class-in-java%2F "https://www.geeksforgeeks.org/sealed-class-in-java/")

推荐阅读
----

[政采云大数据权限系统设计和实现](https://juejin.cn/post/7326979270881902642 "https://juejin.cn/post/7326979270881902642")

[JDK11 与 JDK8 特性差异浅谈](https://juejin.cn/post/7325132087282974747 "https://juejin.cn/post/7325132087282974747")

[Mysql全文索引](https://juejin.cn/post/7324712506749288475 "https://juejin.cn/post/7324712506749288475")

[聊一聊状态机](https://juejin.cn/post/7324204673506082854 "https://juejin.cn/post/7324204673506082854")

[自助取数平台探索与实践](https://juejin.cn/post/7322518781513728010 "https://juejin.cn/post/7322518781513728010")

招贤纳士
----

政采云技术团队（Zero），Base 杭州，一个富有激情和技术匠心精神的成长型团队。规模 500 人左右，在日常业务开发之外，还分别在云原生、区块链、人工智能、低代码平台、中间件、大数据、物料体系、工程平台、性能体验、可视化等领域进行技术探索和实践，推动并落地了一系列的内部技术产品，持续探索技术的新边界。此外，团队还纷纷投身社区建设，目前已经是 google flutter、scikit-learn、Apache Dubbo、Apache Rocketmq、Apache Pulsar、CNCF Dapr、Apache DolphinScheduler、alibaba Seata 等众多优秀开源社区的贡献者。

如果你想改变一直被事折腾，希望开始折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊……如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的技术团队的成长过程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 [zcy-tc@cai-inc.com](https://link.juejin.cn?target=mailto%3Azcy-tc%40cai-inc.com "mailto:zcy-tc@cai-inc.com")

微信公众号
-----

文章同步发布，政采云技术团队公众号，欢迎关注 ![文章顶部.png](/images/jueJin/aaafc13f1d1e414.png)