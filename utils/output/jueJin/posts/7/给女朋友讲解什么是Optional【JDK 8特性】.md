---
author: "Java3y"
title: "给女朋友讲解什么是Optional【JDK 8特性】"
date: 2018-11-19
description: "前两天带女朋友去图书馆了，随手就给她来了一本《与孩子一起学编程》的书，于是今天就给女朋友讲解一下什么是Optional类。 至于她能不能看懂，那肯定是看不懂的。(学到变量for循环的女人怎么能看懂呢) 不知道大家还记得上一篇《阿里巴巴 Java开发手册》读后感不，当时阅读到空…"
tags: ["后端","Java","程序员","容器中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读11分钟"
weight: 1
selfDefined:"likes:56,comments:0,collects:65,views:3722,"
---
前言
==

> 只有光头才能变强

前两天带女朋友去图书馆了，随手就给她来了一本《与孩子一起学编程》的书，于是今天就给女朋友讲解一下什么是Optional类。

*   至于她能不能看懂，那肯定是看不懂的。(学到变量/for循环的女人怎么能看懂呢)

不知道大家还记得上一篇[《阿里巴巴 Java开发手册》读后感](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247484402%26idx%3D1%26sn%3D786686c4d2abd958c535065de044701d%26chksm%3Debd742f3dca0cbe5f6f401e38391369f28287858125d52a1a169523dc4f9600e20335446a629%26token%3D446500942%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247484402&idx=1&sn=786686c4d2abd958c535065de044701d&chksm=ebd742f3dca0cbe5f6f401e38391369f28287858125d52a1a169523dc4f9600e20335446a629&token=446500942&lang=zh_CN#rd")不，当时阅读到空指针异常(NPE)时，书上提到JDK 8有个Optional类供我们使用，该类可以尽可能地防止出现空指针异常(NPE)。

文本**力求简单讲清每个知识点**，希望大家看完能有所收获

一、基础铺垫
======

我们都知道JDK 8最重要的新特性是**Lambda**表达式，这个可以让我们简化非常多的代码编写，不知道大家会使用了没有。这里我简单跟大家来回顾一下~

1.1Lambda简化代码例子
---------------

下面就以**几个例子**来看看Lambda表达式是怎么简化我们代码的编写的。

首先我们来看看**创建线程**：

```

    public static void main(String[] args) {
    // 用匿名内部类的方式来创建线程
        new Thread(new Runnable() {
        @Override
            public void run() {
            System.out.println("公众号：Java3y---回复1进群交流");
        }
        });
        
        // 使用Lambda来创建线程
        new Thread(() -> System.out.println("公众号：Java3y---回复1进群交流"));
    }
```

再来看看遍历Map集合：

```


    public static void main(String[] args) {
    Map<String, String> hashMap = new HashMap<>();
    hashMap.put("公众号", "Java3y");
    hashMap.put("交流群", "回复1");
    
    // 使用增强for的方式来遍历hashMap
        for (Map.Entry<String, String> entry : hashMap.entrySet()) {
        System.out.println(entry.getKey()+":"+entry.getValue());
    }
    
    // 使用Lambda表达式的方式来遍历hashMap
    hashMap.forEach((s, s2) -> System.out.println(s + ":" + s2));
}
```

在List中删除某个元素

```

    public static void main(String[] args) {
    
    List<String> list = new ArrayList<>();
    list.add("Java3y");
    list.add("3y");
    list.add("光头");
    list.add("帅哥");
    
    // 传统的方式删除"光头"的元素
    ListIterator<String> iterator = list.listIterator();
        while (iterator.hasNext()) {
            if ("光头".equals(iterator.next())) {
            iterator.remove();
        }
    }
    
    // Lambda方式删除"光头"的元素
    list.removeIf(s -> "光头".equals(s));
    
    // 使用Lambda遍历List集合
    list.forEach(s -> System.out.println(s));
}
```

从上面的例子我们可以看出，Lambda表达式的确是可以帮我们简化代码的。

1.1函数式接口
--------

使用Lambda表达式，其实都是建立在**函数式接口**上的。我们看看上面的代码的接口：

创建多线程的Runnable接口：

```

@FunctionalInterface
    public interface Runnable {
    public abstract void run();
}
```

遍历HashMap的BiConsumer接口：

```

@FunctionalInterface
    public interface BiConsumer<T, U> {
    void accept(T t, U u);
        default BiConsumer<T, U> andThen(BiConsumer<? super T, ? super U> after) {
        Objects.requireNonNull(after);
            return (l, r) -> {
            accept(l, r);
            after.accept(l, r);
            };
        }
    }
```

在List中删除元素的Predicate接口：

```

@FunctionalInterface
    public interface Predicate<T> {
    
    boolean test(T t);
    
        default Predicate<T> and(Predicate<? super T> other) {
        Objects.requireNonNull(other);
        return (t) -> test(t) && other.test(t);
    }
        default Predicate<T> negate() {
        return (t) -> !test(t);
    }
        default Predicate<T> or(Predicate<? super T> other) {
        Objects.requireNonNull(other);
        return (t) -> test(t) || other.test(t);
    }
        static <T> Predicate<T> isEqual(Object targetRef) {
        return (null == targetRef)
        ? Objects::isNull
        : object -> targetRef.equals(object);
    }
}
```

函数式接口的特点：由`@FunctionalInterface`注解标识，接口**有且仅有**一个抽象方法！

1.2Lambda简单讲解
-------------

或许我们一开始看到Lambda的时候，发现Lambda表达式的语法有点奇葩，甚至有点看不懂。没事，这里3y给大家用图的形式画一画：

![Lambda表达式组成](/images/jueJin/1672c06d691e388.png)

以Runnable接口来举例：

![Lambda表达式很简单！](/images/jueJin/1672c06d699497a.png)

再不济，我们在用IDE的时候，可以提示出Lambda表达式的语法的，这样可以帮我们快速上手Lambda表达式：

![IDEA提示Lambda表达式](/images/jueJin/1672c06d69c2363.png)

说白了，我们使用Lambda表达式的架子是这样的`()->{}`，具体的时候看看函数式接口的抽象方法要求就可以了，再不济就使用IDE智能提示。

1.3泛型回顾
-------

比如说`public<U> Optional<U> map(Function<? super T, ? extends U> mapper)`这个声明，你看懂了吗？

```

// 接口
@FunctionalInterface
    public interface Function<T, R> {
    R apply(T t);
}
```

在泛型的上限和下限中有一个原则：PECS(Producer Extends Consumer Super)

*   带有子类限定的可以从泛型读取【也就是--->(? extend T)】-------->Producer Extends
*   带有超类限定的可以从泛型写入【也就是--->(? super T)】-------->Consumer Super

解析：传入的参数是泛型 T 或者其父类，返回值是U或其子类。

具体可参考：

*   [泛型就这么简单](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247484109%26idx%3D1%26sn%3Ded48fa9216c260fb9b622d9f383d8c25%26chksm%3Debd743ccdca0cadad9e8e4a5cd9a7ce96b595ddaf6fb2e817a9a0d49d4d54c50bb93a97e56eb%26token%3D1728780989%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247484109&idx=1&sn=ed48fa9216c260fb9b622d9f383d8c25&chksm=ebd743ccdca0cadad9e8e4a5cd9a7ce96b595ddaf6fb2e817a9a0d49d4d54c50bb93a97e56eb&token=1728780989&lang=zh_CN#rd")

二、Optional类
===========

一句话介绍Optional类：使用JDK8的Optional类来防止NPE(空指针异常)问题。

接下来我们看看文档是怎么说的：

> A container object which may or may not contain a non-null value.Additional methods that depend on the presence or absence of a contained value are provided

它是一个**容器**，装载着非NULL元素(或者没有装载元素)，提供了一系列的方法供我们判断该容器里的对象是否存在(以及后续的操作)。

Optional类的方法结构图：

![Optional类的方法结构图](/images/jueJin/1672c06d69c784f.png)

2.1创建Optional容器
---------------

我们先来看看Optional的属性以及创建Optional容器的方法：

```

// 1、创建出一个Optional容器，容器里边并没有装载着对象
private static final Optional<?> EMPTY = new Optional<>();

// 2、代表着容器中的对象
private final T value;

// 3、私有构造方法
    private Optional() {
    this.value = null;
}

// 4、得到一个Optional容器，Optional没有装载着对象
    public static<T> Optional<T> empty() {
    @SuppressWarnings("unchecked")
    Optional<T> t = (Optional<T>) EMPTY;
    return t;
}

// 5、私有构造方法(带参数)，参数就是具体的要装载的对象，如果传进来的对象为null，抛出异常
    private Optional(T value) {
    this.value = Objects.requireNonNull(value);
}

// 5.1、如果传进来的对象为null，抛出异常
    public static <T> T requireNonNull(T obj) {
    if (obj == null)
    throw new NullPointerException();
    return obj;
}


// 6、创建出Optional容器，并将对象(value)装载到Optional容器中。
// 传入的value如果为null，抛出异常(调用的是Optional(T value)方法)
    public static <T> Optional<T> of(T value) {
    return new Optional<>(value);
}

// 创建出Optional容器，并将对象(value)装载到Optional容器中。
// 传入的value可以为null，如果为null，返回一个没有装载对象的Optional对象
    public static <T> Optional<T> ofNullable(T value) {
    return value == null ? empty() : of(value);
}
```

所以可以得出创建Optional容器有**两种**方式：

*   调用ofNullable()方法，传入的对象可以为null
*   调用of()方法，传入的对象不可以为null，否则抛出NullPointerException

下面我们简单就可以看看用法了：

现在我有一个User对象，这里用到了Lombok，有兴趣的同学可去学学了解一下：[两个月的Java实习结束，继续努力](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247484339%26idx%3D1%26sn%3D245ded79611ef47e07e5f996ffc0d6c8%26chksm%3Debd742b2dca0cba4de49ce9302630d04dc68252f58213e8726344f98b412b8c61881896b5587%26token%3D1728780989%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247484339&idx=1&sn=245ded79611ef47e07e5f996ffc0d6c8&chksm=ebd742b2dca0cba4de49ce9302630d04dc68252f58213e8726344f98b412b8c61881896b5587&token=1728780989&lang=zh_CN#rd")

```

import lombok.Data;
@Data
    public class User {
    
    private Integer id;
    private String name;
    private Short age;
}

```

测试：

```

    public static void main(String[] args) {
    
    User user = new User();
    User user1 = null;
    
    // 传递进去的对象不可以为null，如果为null则抛出异常
    Optional<User> op1 = Optional.of(user1);
    
    // 传递进去的对象可以为null，如果为null则返回一个没有装载对象的Optional容器
    Optional<User> op2 = Optional.ofNullable(user);
}
```

![结果](/images/jueJin/1672c06d6a764d5.png)

2.2Optional容器简单的方法
------------------

```

// 得到容器中的对象，如果为null就抛出异常
    public T get() {
        if (value == null) {
        throw new NoSuchElementException("No value present");
    }
    return value;
}

// 判断容器中的对象是否为null
    public boolean isPresent() {
    return value != null;
}

// 如果容器中的对象存在，则返回。否则返回传递进来的参数
    public T orElse(T other) {
    return value != null ? value : other;
}

```

这三个方法是Optional类比较常用的方法，并且是最简单的。(因为参数不是函数式接口)

下面我们继续看看用法：

```

    public static void main(String[] args) {
    
    User user = new User();
    User user1 = null;
    
    Optional<User> op1 = Optional.ofNullable(user);
    System.out.println(op1.isPresent());
    System.out.println(op1.get());
    System.out.println(op1.orElse(user1));
    
}
```

结果很明显，因为我们的user是不为null的：

![结果](/images/jueJin/1672c06d6b150b5.png)

我们调换一下顺序看看：

```

    public static void main(String[] args) {
    
    User user = new User();
    User user1 = null;
    
    Optional<User> op1 = Optional.ofNullable(user1);
    System.out.println(op1.isPresent());
    System.out.println(op1.orElse(user));
    System.out.println(op1.get());
    
}
```

![结果](/images/jueJin/1672c06e3f193ff.png)

2.3Optional容器进阶用法
-----------------

当然了，我们到目前为止看起来Optional类好像就这么一回事了，这样代码写起来还不如我自己判断null呢...

我们**对比**一下：

![对比](/images/jueJin/1672c06e6f20ffd.png)

我们可以发现，**手动**判断是否为null好像还更方便简洁一点呢。

所以，我们带函数式接口的方法登场了！

### 2.3.1ifPresent方法

首先来看看`ifPresent(Consumer<? super T> consumer)`方法

```


    public void ifPresent(Consumer<? super T> consumer) {
    if (value != null)
    consumer.accept(value);
}

@FunctionalInterface
    public interface Consumer<T> {
    void accept(T t);
}

```

如果容器中的对象存在，则调用accept方法，比如说：

```

    public static void main(String[] args) {
    
    User user = new User();
    user.setName("Java3y");
    test(user);
}

    public static void test(User user) {
    
    Optional<User> optional = Optional.ofNullable(user);
    
    // 如果存在user，则打印user的name
    optional.ifPresent((value) -> System.out.println(value.getName()));
    
    // 旧写法
        if (user != null) {
        System.out.println(user.getName());
    }
}
```

### 2.3.2orElseGet和orElseThrow方法

直接看源码：

```

// 如果对象存在，则直接返回，否则返回由Supplier接口的实现用来生成默认值
    public T orElseGet(Supplier<? extends T> other) {
    return value != null ? value : other.get();
}


@FunctionalInterface
    public interface Supplier<T> {
    T get();
}


// 如果存在，则返回。否则抛出supplier接口创建的异常
    public <X extends Throwable> T orElseThrow(Supplier<? extends X> exceptionSupplier) throws X {
        if (value != null) {
        return value;
            } else {
            throw exceptionSupplier.get();
        }
    }
    
```

例子：

```

    public static void main(String[] args) {
    
    User user = new User();
    user.setName("Java3y");
    test(user);
}

    public static void test(User user) {
    
    Optional<User> optional = Optional.ofNullable(user);
    
    // 如果存在user，则直接返回，否则创建出一个新的User对象
    User user1 = optional.orElseGet(() -> new User());
    
    // 旧写法
        if (user != null) {
        user = new User();
    }
}
```

总的来说跟我们上面所讲的`orElse()`差不多，只不过它可以通过Supplier接口的实现来生成默认值。

### 2.3.3filter方法

直接看源码：

```

// 如果容器中的对象存在，并且符合过滤条件，返回装载对象的Optional容器，否则返回一个空的Optional容器
    public Optional<T> filter(Predicate<? super T> predicate) {
    Objects.requireNonNull(predicate);
    if (!isPresent())
    return this;
    else
    return predicate.test(value) ? this : empty();
}


// 接口
@FunctionalInterface
    public interface Predicate<T> {
    
    boolean test(T t);
}
```

返回Optional对象我们就可以实现**链式调用**了！

例子：

```

    public static void test(User user) {
    
    Optional<User> optional = Optional.ofNullable(user);
    
    // 如果容器中的对象存在，并且符合过滤条件，返回装载对象的Optional容器，否则返回一个空的Optional容器
    optional.filter((value) -> "Java3y".equals(value.getName()));
}

```

### 2.3.4map方法

直接看源码：

```

// 如果容器的对象存在，则对其执行调用mapping函数得到返回值。然后创建包含mapping返回值的Optional，否则返回空Optional。
    public<U> Optional<U> map(Function<? super T, ? extends U> mapper) {
    Objects.requireNonNull(mapper);
    if (!isPresent())
    return empty();
        else {
        return Optional.ofNullable(mapper.apply(value));
    }
}


// 接口
@FunctionalInterface
    public interface Function<T, R> {
    R apply(T t);
}
```

例子：

```

    public static void test(User user) {
    
    Optional<User> optional = Optional.ofNullable(user);
    
    // 如果容器的对象存在，则对其执行调用mapping函数得到返回值。然后创建包含mapping返回值的Optional，否则返回空Optional。
    optional.map(user1 -> user1.getName()).orElse("Unknown");
}

// 上面一句代码对应着最开始的老写法：

    public String tradition(User user) {
        if (user != null) {
        return user.getName();
            }else{
            return "Unknown";
        }
    }
    
```

### 2.3.5flatMap方法

直接看源码：

```

// flatMap方法与map方法类似，区别在于apply函数的返回值不同。map方法的apply函数返回值是? extends U，而flatMap方法的apply函数返回值必须是Optional
    public<U> Optional<U> flatMap(Function<? super T, Optional<U>> mapper) {
    Objects.requireNonNull(mapper);
    if (!isPresent())
    return empty();
        else {
        return Objects.requireNonNull(mapper.apply(value));
    }
}
```

### 2.3.6总结

再来感受一下Optional的魅力

```

    public static void main(String[] args) {
    User user = new User();
    user.setName("Java3y");
    System.out.println(test(user));
}

// 以前的代码v1
    public static String test2(User user) {
        if (user != null) {
        String name = user.getName();
            if (name != null) {
            return name.toUpperCase();
                } else {
                return null;
            }
                } else {
                return null;
            }
        }
        
        // 以前的代码v2
            public static String test3(User user) {
                if (user != null && user.getName() != null) {
                return user.getName().toUpperCase();
                    } else {
                    return null;
                }
            }
            
            // 现在的代码
                public static String test(User user) {
                return Optional.ofNullable(user)
                .map(user1 -> user1.getName())
                .map(s -> s.toUpperCase()).orElse(null);
            }
```

Optional总结：

> filter，map或flatMap一个函数，函数的参数拿到的值一定不是null。所以我们通过filter，map 和 flatMap之类的函数可以将其安全的进行变换，最后通过orElse系列，get，isPresent 和 ifPresent将其中的值提取出来。

其实吧，用Optional类也没有简化很多的代码，只是把NPE异常通过各种方法隐藏起来(包装了一层)。通过Lambda表达式可以让我们处理起来更加"**优雅**"一些。

三、最后
====

之前在初学的时候没在意JDK8的特性，其实JDK更新很多时候都能给我们带来不少好处的(简化代码编写，提高性能等等)，所以作为一名Java程序员，还是得多学学新特性。(话说JDK9该类又有新特性了...)

如果你要评论“醒醒吧，程序员哪来的女朋友”，“我尿黄，让我来”之类的话，我建议你是不是**好好反省**一下自己，为什么别的程序员都有女朋友，就你没有，是不是自己技术不过关了？通过“工厂”找一个有那么难吗？再不济也能自己new一个出来啊。

当然了，我的女朋友是现实存在的。

参考资料：

*   Java 8 Optional类深度解析：[www.cnblogs.com/xingzc/p/57…](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fxingzc%2Fp%2F5778090.html "https://www.cnblogs.com/xingzc/p/5778090.html")
*   Java8 如何正确使用 Optional：[www.importnew.com/26066.html](https://link.juejin.cn?target=http%3A%2F%2Fwww.importnew.com%2F26066.html "http://www.importnew.com/26066.html")
*   [www.zhihu.com/question/63…](https://link.juejin.cn?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F63783295%2Fanswer%2F214531004 "https://www.zhihu.com/question/63783295/answer/214531004")
*   【Java】jdk8 Optional 的正确姿势[blog.csdn.net/hj7jay/arti…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fhj7jay%2Farticle%2Fdetails%2F52459334 "https://blog.csdn.net/hj7jay/article/details/52459334")

如果你觉得我写得还不错，了解一下：

*   坚持**原创**的技术公众号：Java3y。
*   文章的**目录导航**(精美脑图+海量视频资源)：[github.com/ZhongFuChen…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZhongFuCheng3y%2F3y "https://github.com/ZhongFuCheng3y/3y")