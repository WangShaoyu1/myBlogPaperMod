---
author: "捡田螺的小男孩"
title: "Java程序员必备基础：泛型解析"
date: 2020-01-18
description: "整理了Java泛型的相关知识，算是比较基础的，希望大家一起学习进步。 Java 泛型（generics）是 JDK 5 中引入的一个新特性，其本质是参数化类型，解决不确定具体对象类型的问题。其所操作的数据类型被指定为一个参数（type parameter）这种参数类型可以用在类…"
tags: ["Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:66,comments:0,collects:138,views:10295,"
---
### 前言

整理了Java泛型的相关知识，算是比较基础的，希望大家一起学习进步。

> [github.com/whx123/Java…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fwhx123%2FJavaHome "https://github.com/whx123/JavaHome")

![](/images/jueJin/16fb94807a022b0.png)

### 一、什么是Java泛型

Java 泛型（generics）是 JDK 5 中引入的一个新特性，其本质是参数化类型，解决不确定具体对象类型的问题。其所操作的数据类型被指定为一个参数（type parameter）这种参数类型可以用在类、接口和方法的创建中，分别称为泛型类、泛型接口、泛型方法。

#### 泛型类

泛型类（generic class) 就是具有**一个或多个类型变量**的类。一个泛型类的简单例子如下：

```
//常见的如T、E、K、V等形式的参数常用于表示泛型，编译时无法知道它们类型，实例化时需要指定。
    public class Pair <K,V>{
    private K first;
    private  V second;
    
        public Pair(K first, V second) {
        this.first = first;
        this.second = second;
    }
    
        public K getFirst() {
        return first;
    }
    
        public void setFirst(K first) {
        this.first = first;
    }
    
        public V getSecond() {
        return second;
    }
    
        public void setSecond(V second) {
        this.second = second;
    }
    
        public static void main(String[] args) {
        // 此处K传入了Integer，V传入String类型
        Pair<Integer,String> pairInteger = new Pair<>(1, "第二");
        System.out.println("泛型测试，first is " + pairInteger.getFirst()
        + " ,second is " + pairInteger.getSecond());
    }
}


```

运行结果如下：

```
泛型测试，first is 1 ,second is 第二
```

#### 泛型接口

泛型也可以应用于接口。

```
    public interface Generator<T> {
    T next();
}
```

实现类去实现这个接口的时候，可以指定泛型T的具体类型。

指定具体类型为Integer的实现类：

```
    public class NumberGenerator implements Generator<Integer> {
    
    @Override
        public Integer next() {
        return new Random().nextInt();
    }
}
```

指定具体类型为String的实现类：

```
    public class StringGenerator implements Generator<String> {
    
    @Override
        public String next() {
        return "测试泛型接口";
    }
}
```

#### 泛型方法

具有一个或多个类型变量的方法，称之为泛型方法。

```
    public class GenericMethods {
    
        public <T> void f(T x){
        System.out.println(x.getClass().getName());
    }
    
        public static void main(String[] args) {
        GenericMethods gm = new GenericMethods();
        gm.f("字符串");
        gm.f(666);
    }
}
```

运行结果：

```
java.lang.String
java.lang.Integer
```

### 二、泛型的好处

Java语言引入泛型的好处是**安全简单**。泛型的好处是在编译的时候检查类型安全，并且所有的强制转换都是自动和隐式的，提高代码的重用率。

我们先来看看一个只能持有单个对象的类。

```
    public class Holder1 {
    private Automobile a;
    
        public Holder1(Automobile a) {
        this.a = a;
    }
    
        public Automobile getA() {
        return a;
    }
}
```

我们可以发现，这个类的重用性不怎样。要使它持有其他类型的任何对象，在jdk1.5泛型之前，可以把类型设置为Object，如下：

```
    public class Holder2 {
    private Object a;
    
        public Holder2(Object a) {
        this.a = a;
    }
    
        public Object getA() {
        return a;
    }
    
        public void setA(Object a) {
        this.a = a;
    }
    
        public static void main(String[] args) {
        Holder2 holder2 = new Holder2(new Automobile());
        //强制转换
        Automobile automobile = (Automobile) holder2.getA();
        holder2.setA("测试泛型");
        String s = (String) holder2.getA();
    }
}

```

我们引入泛型，实现功能那个跟Holder2类一致的Holder3，如下：

```
    public class Holder3<T> {
    
    private T a;
    
        public T getA() {
        return a;
    }
    
        public void setA(T a) {
        this.a = a;
    }
    
        public Holder3(T a) {
        this.a = a;
    }
    
        public static void main(String[] args) {
        Holder3<Automobile> holder3 = new Holder3<>(new Automobile());
        Automobile automobile = holder3.getA();
    }
}

```

因此，泛型的好处很明显了：

*   不用强制转换，因此代码比较简洁；（简洁性）
*   代替Object来表示其他类型对象，与ClassCastException异常划清界限。（安全性）
*   泛型使代码可读性增强。（可读性）

### 三、泛型通配符

我们定义泛型时，经常碰见T，E，K，V，？等通配符。本质上这些都是通配符，是编码时一种约定俗成的东西。当然，你换个A-Z中另一个字母表示没有关系，但是为了可读性，一般有以下定义：

*   ？ 表示不确定的 java 类型
*   T (type) 表示具体的一个java类型
*   K V (key value) 分别代表java键值中的Key Value
*   E (element) 代表Element

**为什么需要引入通配符**呢，我们先来看一个例子：

```
    class Fruit{
        public int getWeigth(){
        return 0;
    }
}
//Apple是水果Fruit类的子类
    class Apple extends Fruit {
        public int getWeigth(){
        return 5;
    }
}

    public class GenericTest {
    //数组的传参
        static int sumWeigth(Fruit[] fruits) {
        int weight = 0;
            for (Fruit fruit : fruits) {
            weight += fruit.getWeigth();
        }
        return weight;
    }
    
        static int sumWeight1(List<? extends Fruit> fruits) {
        int weight = 0;
            for (Fruit fruit : fruits) {
            weight += fruit.getWeigth();
        }
        return weight;
    }
        static  int sumWeigth2(List<Fruit> fruits){
        int weight = 0;
            for (Fruit fruit : fruits) {
            weight += fruit.getWeigth();
        }
        return weight;
    }
    
        public static void main(String[] args) {
        Fruit[] fruits = new Apple[10];
        sumWeigth(fruits);
        List<Apple> apples = new ArrayList<>();
        sumWeight1(apples);
        //报错
        sumWeigth2(apples);
    }
}
```

我们可以发现，Fruit\[\]与Apple\[\]是兼容的。`List<Fruit>`与`List<Apple>`不兼容的，集合List是不能协变的，会报错，而List与List<? extends Fruits> 是OK的，这就是通配符的魅力所在。通配符通常分三类：

*   无边界通配符，如List<?>
*   上边界限定通配符,如<? extends E>;
*   下边界通配符，如<? super E>;

#### ?无边界通配符

无边界通配符，它的使用形式是一个单独的问号：List<?>，也就是没有任何限定。

看个例子：

```
    public class GenericTest {
    
        public static void printList(List<?> list) {
            for (Object object : list) {
            System.out.println(object);
        }
    }
    
        public static void main(String[] args) {
        List<String> list1 = new ArrayList<>();
        list1.add("A");
        list1.add("B");
        List<Integer> list2 = new ArrayList<>();
        list2.add(100);
        list2.add(666);
        //报错，List<?>不能添加任何类型
        List<?> list3 = new ArrayList<>();
        list3.add(666);
    }
}
```

无界通配符(<?>)可以适配任何引用类型，看起来与原生类型等价，但与原生类型还是有区别，使用 **无界通配符则表明在使用泛型** 。同时，List<?> list不可以添加任何类型，因为并不知道实际是哪种类型。但是List list因为持有的是Object类型对象，所以可以add任何类型的对象。

#### 上边界限定通配符 < ? extends E>

使用 <? extends Fruit> 形式的通配符，就是**上边界限定通配符**。 extends关键字表示这个泛型中的参数必须是 E 或者 E 的子类，请看demo：

```
class apple extends Fruit{}
    static int sumWeight1(List<? extends Fruit> fruits) {
    int weight = 0;
        for (Fruit fruit : fruits) {
        weight += fruit.getWeigth();
    }
    return weight;
}
    public static void main(String[] args) {
    List<Apple> apples = new ArrayList<>();
    sumWeight1(apples);
}
```

但是，以下这段代码是**不可行**的：

```
    static int sumWeight1(List<? extends Fruit> fruits){
    //报错
    fruits.add(new Fruit());
    //报错
    fruits.add(new Apple());
}
```

*   在`List<Fruit>`里只能添加Fruit类对象及其子类对象（如Apple对象，Oragne对象），在`List<Apple>`里只能添加Apple类和其子类对象。
*   我们知道`List<Fruit>、List<Apple>`等都是List<？ extends Fruit>的子类型。假设一开始传参是`List<Fruit> list`,两个添加没问题，那如果传来`List<Apple> list`，添加就失败了，编译器为了保护自己，直接禁用添加功能了。
*   实际上，不能往List<? extends E> 添加任意对象，除了null。

#### 下边界限定通配符 < ? super E>

使用 <? super E> 形式的通配符，就是**下边界限定通配符**。 super关键字表示这个泛型中的参数必须是所指定的类型E，或者是此类型的父类型，直至 Object。

```
    public class GenericTest {
    
        private static <T> void test(List<? super T> dst, List<T> src){
            for (T t : src) {
            dst.add(t);
        }
    }
    
        public static void main(String[] args) {
        List<Apple> apples = new ArrayList<>();
        List<Fruit> fruits = new ArrayList<>();
        test(fruits, apples);
    }
}

```

可以发现，List<? super E>添加是没有问题的，因为子类是可以指向父类的，它添加并不像List<? extends E>会出现安全性问题，所以可行。

### 四、泛型擦除

#### 什么是类型擦除

什么是Java**泛型擦除**呢？ 先来看demo：

```
Class c1 = new ArrayList<Integer>().getClass();
Class c2 = new ArrayList<String>().getClass();
System.out.println(c1 == c2);
/* Output
true
*/
```

`ArrayList <Integer>` 和`ArrayList <String>` 很容易被认为是不同的类型。但是这里输出结果是true，这是因为Java泛型是使用擦除实现的，不管是`ArrayList<Integer>()` 还是`new ArrayList<String>()`，在编译生成的字节码中都不包含泛型中的类型参数，即都擦除成了ArrayList，也就是被擦除成“原生类型”，这就是泛型擦除。

#### 类型擦除底层

Java泛型在编译期完成，它是依赖编译器实现的。其实，编译器主要做了这些工作：

*   set()方法的类型检验
*   get()处的类型转换，编译器插入了一个checkcast语句，

再看个例子：

```
    public class GenericTest<T> {
    
    private T t;
    
        public T get() {
        return t;
    }
    
        public void set(T t) {
        this.t = t;
    }
    
        public static void main(String[] args) {
        GenericTest<String> test = new GenericTest<String>();
        test.set("jay@huaxiao");
        String s = test.get();
        System.out.println(s);
    }
}
/* Output
jay@huaxiao
*/

```

javap -c GenericTest.class反编译GenericTest类可得

```
    public class generic.GenericTest<T> {
    public generic.GenericTest();
    Code:
    0: aload_0
    1: invokespecial #1                  // Method java/lang/Object."<init>":()V
    4: return
    
    public T get();
    Code:
    0: aload_0
    1: getfield      #2                  // Field t:Ljava/lang/Object;
    4: areturn
    
    public void set(T);
    Code:
    0: aload_0
    1: aload_1
    2: putfield      #2                  // Field t:Ljava/lang/Object;
    5: return
    
    public static void main(java.lang.String[]);
    Code:
    0: new           #3                  // class generic/GenericTest
    3: dup
    4: invokespecial #4                  // Method "<init>":()V
    7: astore_1
    8: aload_1
    9: ldc           #5                  // String jay@huaxiao
    11: invokevirtual #6                  // Method set:(Ljava/lang/Object;)V
    14: aload_1
    15: invokevirtual #7                  // Method get:()Ljava/lang/Object;
    18: checkcast     #8                  // class java/lang/String
    21: astore_2
    22: getstatic     #9                  // Field java/lang/System.out:Ljava/io/PrintStream;
    25: aload_2
    26: invokevirtual #10                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
    29: return
}
```

*   看第11，set进去的是原始类型Object（#6）；
*   看第15，get方法获得也是Object类型（#7），说明类型被擦出了。
*   再看第18，它做了一个checkcast操作，是一个String类型，强转。

### 五、泛型的限制与局限

使用Java泛型需要考虑以下一些约束与限制，其实几乎都跟泛型擦除有关。

#### 不能用基本类型实例化类型化参数

不能用类型参数代替基本类型。因此， 没有 `Pair<double>`, 只 有`Pair<Double>`。 当然, 其原因是类型擦除。擦除之后， Pair 类含有 Object 类型的域， 而 Object 不能存储 double值。

#### 运行时类型查询只适用于原始类型

如，getClass()方法等只返回原始类型，因为JVM根本就不知道泛型这回事，它只知道原始类型。

```
if(a instanceof Pair<String>) //ERROR,仅测试了a是否是任意类型的一个Pair，会看到编译器ERROR警告

if(a instanceof Pair<T>) //ERROR

Pair<String> p = (Pair<String>) a;//WARNING,仅测试a是否是一个Pair

Pair<String> stringPair = ...;
Pair<Employee> employeePair = ...;
if(stringPair.getClass() == employeePair.getClass())  //会得到true，因为两次调用getClass都将返回Pair.class
```

#### 不能创建参数化类型的数组

不能实例化参数化类型的数组， 例如：

```
Pair<String>[] table = new Pair<String>[10]; // Error
```

#### 不能实例化类型变量

不能使用像 new T(...)，newT\[...\] 或 T.class 这样的表达式中的类型变量。例如， 下面的`Pair<T>` 构造器就是非法的：

```
public Pair() { first = new T(); second = new T(); } // Error
```

#### 使用泛型接口时，需要避免重复实现同一个接口

```
interface Swim<T> {}

class Duck implements Swim<Duck> {}

class UglyDuck extends Duck implements Swim<UglyDuck> {}
```

#### 可以消除对受查异常的检查

```
@SuppressWamings("unchecked")
public static <T extends Throwable〉void throwAs(Throwable e) throws T { throw (T) e; }
```

#### 定义API返回报文时，尽量使用泛型；

```
    public class Response<T> extends BaseResponse {
    private static final long serialVersionUID = -xxx;
    
    private T data;
    
    private String code;
    
        public Response() {
    }
    
        public T getData() {
        return this.data;
    }
    
        public void setData(T data,String code ) {
        this.data = data;
        this.code = code;
    }
}
```

### 六、Java泛型常见面试题

Java泛型常见几道面试题

*   Java中的泛型是什么 ? 使用泛型的好处是什么?（第一，第二小节可答）
*   Java的泛型是如何工作的 ? 什么是类型擦除 ? （第四小节可答）
*   什么是泛型中的限定通配符和非限定通配符 ? （第三小节可答）
*   List<? extends T>和List <? super T>之间有什么区别 ?（第三小节可答）
*   你了解泛型通配符与上下界吗？（第三小节可答）

### 参考与感谢

*   《Java编程思想》
*   《Java核心技术》
*   [聊一聊-JAVA 泛型中的通配符 T，E，K，V，？](https://juejin.cn/post/6844903917835419661 "https://juejin.cn/post/6844903917835419661")
*   [Java泛型的局限和使用经验](https://link.juejin.cn?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2Fa58da9011f85 "https://www.jianshu.com/p/a58da9011f85")
*   [Java泛型之类型擦除](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F31741402 "https://zhuanlan.zhihu.com/p/31741402")

### 个人公众号

![](/images/jueJin/16c381c89b127bb.png)

*   如果你是个爱学习的好孩子，可以关注我公众号，一起学习讨论。
*   如果你觉得本文有哪些不正确的地方，可以评论，也可以关注我公众号，私聊我，大家一起学习进步哈。