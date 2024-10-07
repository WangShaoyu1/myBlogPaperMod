---
author: "好看的HK"
title: "重新认识Lambda和Stream"
date: 2024-05-10
description: "前言：Java8就引入了Lambda和StreamAPI（截止到2023年6月，JDK20亦然发布，参考网址：https://injdk.cn/），这两种特性平时在工作中也是经常使用，但一"
tags: ["后端"]
ShowReadingTime: "阅读10分钟"
weight: 783
---
前言：Java 8就引入了 Lambda 和 Stream API（截止到2023年6月，JDK 20亦然发布，参考网址：[injdk.cn/](https://link.juejin.cn?target=https%3A%2F%2Finjdk.cn%2F "https://injdk.cn/")），这两种特性平时在工作中也是经常使用，但一直没有机会进行全面地系统性总结，这次抽空来好好过一下。

补充：本文不做源码层面的解读，抱着够用就行的心态，随便稍稍深入了解一丢丢的思想来进行的。源码实现可以参考这篇：[www.throwx.cn/2021/10/06/…](https://link.juejin.cn?target=https%3A%2F%2Fwww.throwx.cn%2F2021%2F10%2F06%2Fstream-of-jdk%2F "https://www.throwx.cn/2021/10/06/stream-of-jdk/")

一、Lambda
--------

**Lambda** 表达式是JDK 8的一个新特性，**支持 Java 能进行简单的“函数式编程”** ，可以取代大部分的匿名内部类（接口里面只有一个抽象方法），写出更优雅的Java代码。尤其在集合的遍历和其他集合操作中，可以极大地优化代码结构。

### 1、函数式接口

**如果定义的一个接口`有且只有一个抽象方法`** ，这样的接口就成为**函数式接口**（Functional Interface）。函数式接口`可以有任意个 default 或者 static 方法`。

**任何函数式接口都可以使用 Lambda 表达式替换**。Lambda表达式的本质是实现函数式接口的一种方式，编译时仍然会替换为一个实现类，只不过语法上做了简化，是Java提供的又一个语法糖。

如下是一个简单的示例：

java

 代码解读

复制代码

`/**  * 说明：@FunctionalInterface 注解会显式提醒编译器这是一个函数式接口，但加不加，没啥实际影响  */ @FunctionalInterface public interface IPerson { ​     void saySomething(); } ​ public interface IPerson1 { ​     String concatStr(String str1, String str2); } ​ public class Test { ​     public static void main(String[] args) {         // 1.无入参，空返回实现         IPerson person = () -> System.out.println("我是中国人");         person.saySomething(); ​         // 2.多个入参，且有方法体实现         IPerson1 person1 = (s1, s2) -> {             // 这行如果没有的话，可以直接 (s1, s2) -> s1 + "_" + s2             System.out.println("输入为：" + s1 + "," + s2);             return s1 + "_" + s2;         };         String str = person1.concatStr("haha", "haha");         System.out.println(str); ​         // 3.双冒号 :: 为引⽤运算符，一般与包 java.util.function 提供的函数式接口相配合，返回一个方法应用         // 一般要求调用方法无入参或只有一个入参         Arrays.asList("1", "2", "3").forEach(System.out::println); ​         Supplier<Double> supplier = Math::random;         System.out.println(supplier.get());     } }`

### 2、常用函数式接口

java.util.function包默认提供了大量函数式接口，这些接口一般可与Stream API完美配合使用，如下是一些常见Stream接口API说明：

java

 代码解读

复制代码

`// 1.条件筛选 filter(Predicate<? super T> predicate) // 2.对单个item对象转换操作 map(Function<? super T, ? extends R> mapper) // 3.对item对象操作，并返回一个新的Stream流 flatMap(Function<? super T, ? extends Stream<? extends R>> mapper) // 4.循环遍历 forEach(Consumer<? super T> action) // 5.条件筛选，整个集合item有一个为true anyMatch(Predicate<? super T> predicate) // 6.条件筛选，全部item为true     allMatch(Predicate<? super T> predicate) // 7.累计计算，值累加等 reduce(BinaryOperator<T> accumulator) // 8.集合操作，元素汇总转换计算 collect(Collector<? super T, A, R> collector)`

#### 1、Supplier

**`Supplier<T>`供给型接口，无参有返回值**。Supplier接口之所以被称之为**生产型接口**，是因为如果我们指定了接口的泛型是什么类型，那么接口中的get方法就会生产什么类型的数据供我们使用。

*   `T get()`方法：用于获得结果；不需要参数，它会按照某种实现逻辑（由Lambd表达式实现）返回一个数据。

java

 代码解读

复制代码

`public class SupplierTest { ​     public static void main(String[] args) {         System.out.println(concatStr(() -> "haha"));     } ​     private static String concatStr(Supplier<String> supplier) {         return supplier.get() + "_concat";     } }`

#### 2、Consumer

**`Consumer<T>`消费型接口，有参数无返回值**。Consumer接口也被称之为**消费型接口**，它消费的数据的类型由泛型指定，包含两个方法。

*   `void accept(T t)`：对给定的参数执行此操作
*   `default Consumer<T> andThen(Consumer after)`：返回一个组合的Consumer，依次执行此操作，然后执行after操作。

java

 代码解读

复制代码

`public class ConsumerTest { ​     public static void main(String[] args) {         List<Integer> list = Arrays.asList(1, 2, 3, 4);         // 简单实用，foreach的入参就是一个 Consumer<? super T> action         list.forEach(System.out::print); ​         // 自己编写 accept 方法体的 Consumer         consumer(list, s -> {             System.out.println("测试消费：" + s);         });                  // andThen的测试，每一个数会依次经过 consumer->consumer1->consumer2         Consumer<Integer> consumer = x -> {             System.out.println("全部消费：" + x);         };         Consumer<Integer> consumer1 = x -> {             if (x % 2 == 0) {                 System.out.println("偶数消费：" + x);             }         };         Consumer<Integer> consumer2 = x -> {             if (x % 2 != 0) {                 System.out.println("基数消费：" + x);             }         };         // 这种链式反应很奇妙         list.forEach(consumer.andThen(consumer1).andThen(consumer2));     } ​     private static void consumer(List<Integer> list, Consumer<Integer> consumer) {         // consumer::accept 也可已直接替换为 consumer         list.forEach(consumer::accept);     } }`

#### 3、Predicate

**`Predicate<T>`断言型接口，有参有返回值，返回值是boolean类型**。`Predicate<T>`方法通常用于判断参数是否满足指定的条件，常用的四个方法：

*   boolean test(T t)：对给定的参数进行判断（判断逻辑由Lambda表达式实现），返回一个布尔值。
*   default Predicate negate()：返回一个逻辑的否定，对应逻辑非。
*   default Predicate and(Predicate other)：返回一个组合判断，对应短路与。
*   default Predicate or(Predicate other)：返回一个组合判断，对应短路或。

java

 代码解读

复制代码

`public class PredicateTest { ​     public static void main(String[] args) {         List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);         // 过滤出偶数         list = list.stream().filter(s -> s % 2 == 0).collect(Collectors.toList());         System.out.println(list); ​         Predicate<String> predicate = s -> s.contains("sb");         System.out.println("包含侮辱词汇: " + predicate.test("abcdesb"));         System.out.println("包含侮辱词汇: " + predicate.test("abcdefgbbs")); ​         Predicate<String> isMan = s -> s.contains(" man");         Predicate<String> isWoman = s -> s.contains(" woman");         Predicate<String> isStudent = s -> s.contains(" student");         Predicate<String> isTeacher = s -> s.contains(" teacher");         String human1 = "he is a man who work as a as student in home";         String human2 = "she is a women who work as a teacher in home";         // and or negate 方法使用演         System.out.println("这个人是一个男性：" + isStudent.and(isMan).test(human1));         System.out.println("这是一个老师或者学生：" + isStudent.or(isMan).test(human1));         System.out.println("这是一个既是又是老师，又是一名男性：" + isStudent.and(isMan).test(human2));         System.out.println("这是一个既是又是老师，又是一名女性：" + isStudent.and(isWoman).test(human2));         System.out.println("他不是一名老师：" + isTeacher.negate().test(human1));     } }`

#### 4、Function

**`Function<T,R>`函数式接口，有参有返回值**。接口通常用于对参数进行处理和转换，然后返回一个新的值。

*   `R apply(T t)`：将此函数应用于给定的参数。
*   `default <V> Function andThen(Function after)`：返回一个组合函数，首先将该函数应用于输入，然后将after函数应用于结果。

java

 代码解读

复制代码

`public class FunctionTest { ​     public static void main(String[] args) {         Function<Integer, String> delInt = i -> {             System.out.println("开始处理int数字:" + i);             boolean r = i % 2 == 0;             return r ? (i + "是偶数") : (i + "是奇数");         };         Function<String, String> delStr = s -> {             System.out.println("开始处理:" + s);             boolean r = s.contains("偶数");             return r ? (s + "√") : (s + "×");         };         // 1.map是把集合每个元素重新映射         List<Integer> list1 = Arrays.asList(1, 2, 3, 4, 5);         List<String> result1 = list1.stream().map(delInt.andThen(delStr)).collect(Collectors.toList());         System.out.println(result1); ​         // 2.flatMap从字面上来说是压平这个映射，实际作用就是将每个元素进行一个一对多的拆分，         // 细分成更小的单元，返回一个新的Stream流，新的流元素个数增加         Function<String, Stream<String>> split = s -> Stream.of(s.trim().split(" "));         List<String> list2 = Arrays.asList("a b c", "e f g", "h");         List<String> result2 = list2.stream().flatMap(split).collect(Collectors.toList());         System.out.println(result2); ​         // 3.生成 1-100 数字，并计算结果         // rangeClosed/range两个方法的区别在于一个是闭区间，一个是半开半闭区间         // sum聚合方法，底层实现还是reduce方法         long sum = IntStream.rangeClosed(1, 100).asLongStream().sum();         System.out.println("sum方法 从1加到100=" + sum);         // 使用 reduce 方法         long sum1 = IntStream.rangeClosed(1, 100).reduce((x1, x2) -> x1 + x2).getAsInt();         System.out.println("reduce方法 从1加到100=" + sum1);         long sum2 = IntStream.rangeClosed(1, 100).reduce(4950, Integer::sum);         System.out.println("reduce方法 4950 + " + sum1 + " = " + sum2);     } }`

二、Stream
--------

Stream 中文称为 **“流”** ，通过将集合转换为这么一种叫做 “流” 的元素序列，通过声明性方式，能够对集合中的每个元素进行一系列并行或串行的**流水线操作**。有如下特性

*   **Stream流不是一种数据结构，不保存数据，它只是在原数据集上定义了一组操作**
*   **这些操作是惰性的，即每当访问到流中的一个元素，才会在此元素上执行这一系列操作**
*   **Stream不保存数据，故每个Stream流只能使用一次**

在上一节中，已经可以看到 **Lambda + Stream 配合**使用的强大。对于一些较为简单的API方法，这里不多作说明，着重列举下一些需要注意的相关重点API。

### 1、Optional

0.  Optional 类是一个可以为null的容器对象。如果值存在则isPresent()方法会返回true，调用get()方法会返回该对象。
1.  Optional 是个容器：它可以保存类型T的值，或者仅仅保存null。Optional提供很多有用的方法，这样我们就不用显式进行空值检测。
2.  Optional 类的引入很好的解决空指针异常。

java

 代码解读

复制代码

`public class OptionalTest { ​     public static void main(String[] args) {         // 1.基本演示         // of 方法不允许入参为null，会报NPE         // ofNullable允许入参为null，内部构造一个empty对象         Optional<String> optional = Optional.ofNullable(null);         System.out.println("初始optional中是否有值:" + optional.isPresent()); ​         // 2.filter map 等方法默认过滤null值         String s1 = optional                 .filter(s -> s.contains("0"))                 .map(s -> s + "1")                 // 直接get会报NPE，因此最好使用 orElse orElseThrow                 .orElse("这是个默认值");         System.out.println(s1); ​         // 3.手动处理异常         /// 这里会让程序直接抛异常         /// s1 = optional.orElseThrow(() -> new RuntimeException("参数不能为null"));         /// System.out.println(s1); ​         // 4.Stream聚合操作         optional.ifPresent(s -> {             // 不会输出，有不为null的值才会输出         });         Stream.of(null, "1", "2", "3", null, "4")                 /// .map(Objects::nonNull) 也行                 .filter(s -> Optional.ofNullable(s).isPresent() && Integer.parseInt(s) > 1)                 .map(s -> Optional.of(s))                 .forEach(s -> {                     System.out.println("输出值:" + s.get());                 });     } }`

### 2、聚合(max/min/count)

不多讲，上代码

java

 代码解读

复制代码

`public class CountTest { ​     public static void main(String[] args) {         List<String> list = Arrays.asList("11.221", "33.22", "22.113", "44.55", "4.0"); ​         // 1.找出转 Double 后的最大值         Optional<String> optional = list.stream().max(Comparator.comparingDouble(Double::valueOf));         System.out.println("最大值：" + optional.get());         // min同         System.out.println("最小值：" + list.stream().min(Comparator.comparingDouble(Double::valueOf)).get()); ​         // 2.找出字符串最长的那个         String maxLengthOne = list.stream().max(Comparator.comparing(String::length)).get();         System.out.println("最长的字符串：" + maxLengthOne);         // min同         System.out.println("最短的字符串：" + list.stream().min(Comparator.comparing(String::length)).get()); ​         // 3.自然排序，字典顺序，结果为 [11.221, 22.113, 33.22, 4.0, 44.55]         System.out.println(list.stream().sorted().collect(Collectors.toList()));         // 转成 Double 再排序，结果为 [4.0, 11.221, 22.113, 33.22, 44.55]         System.out.println(list.stream().mapToDouble(Double::valueOf).boxed()                 .sorted().collect(Collectors.toList()));         // 倒序排序，反字典顺序，结果为 [44.55, 4.0, 33.22, 22.113, 11.221]         System.out.println(list.stream()                 .sorted(Comparator.reverseOrder()).collect(Collectors.toList()));         // 自定义排序规则，结果为 [4.0, 11.221, 22.113, 33.22, 44.55]         System.out.println(list.stream()                 .sorted(Comparator.comparing(Double::valueOf)).collect(Collectors.toList()));         // 自定义复杂规则，结果为 [4.0, 33.22, 44.55, 22.113, 11.221]         System.out.println(list.stream()                 .sorted((s1, s2) -> {                     // 自定义比较规则，整数位 + 小数位，从小到大                     int i1 = Arrays.stream(s1.split("\.")).mapToInt(Integer::valueOf).sum();                     int i2 = Arrays.stream(s2.split("\.")).mapToInt(Integer::valueOf).sum();                     return i1 > i2 ? 1 : -1;                 }).collect(Collectors.toList())); ​         // 4.去重后，统计数量         list = Arrays.asList("123456543210".split(""));         // 输出为：[1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0]         System.out.println("原始值：" + list);         // 输出位：[1, 2, 3, 4, 5, 6, 0]         System.out.println("去重后：" + list.stream().distinct().collect(Collectors.toList()));         // 统计个数，sum，average         System.out.println("去重后个数：" + list.stream().distinct().count());         System.out.println("去重后总和：" + list.stream().distinct().mapToInt(Integer::valueOf).sum());         System.out.println("去重后平均值：" + list.stream().distinct()                 .mapToInt(Integer::valueOf).average().orElse(0L));     } }`

### 3、Reduce

reduce思想还是有必要再单独提一下的，虽然之前也有过例子，如下

java

 代码解读

复制代码

`public class ReduceTest {     public static void main(String[] args) {         // 1.生成 1-10 数字，并计算结果         // rangeClosed/range两个方法的区别在于一个是闭区间，一个是半开半闭区间         // 也可以直接 .asLongStream().sum() 得到sum结果         Stream<String> stream = IntStream.rangeClosed(1, 10).asLongStream().boxed().map(String::valueOf);         // 字符串拼接，结果为 12345678910         String concatStr = stream.reduce((s1, s2) -> s1 + s2).orElse("");         System.out.println(concatStr);         // 2.计算sum、max、乘积         Stream<Integer> integerStream = IntStream.rangeClosed(1, 10).boxed();         long sum = integerStream.reduce(0, (x1, x2) -> (x1 + x2));         System.out.println("sum = " + sum);         // 同一个流不能操作两次         integerStream = IntStream.rangeClosed(1, 10).boxed();         int max = integerStream.reduce((x1, x2) -> (x1 > x2 ? x1 : x2)).orElse(0);         System.out.println("max = " + max);         integerStream = IntStream.rangeClosed(1, 10).boxed();         int result = integerStream.reduce(1, (x1, x2) -> (x1 * x2));         System.out.println("乘积 = " + result);     } }`

### 4、分组(groupingBy/toMap)

java

 代码解读

复制代码

`public class GroupTest {     public static void main(String[] args) {         List<Person> list = Arrays.asList(                 new Person("张三", 22, "男", "北京"),                 new Person("李四", 25, "女", "深圳"),                 new Person("王五", 32, "男", "北京"),                 new Person("赵六", 35, "女", "上海")         );         // 1.根据性别分组         Map<String, List<Person>> sexMap = list                 .stream().collect(Collectors.groupingBy(Person::getSex));         System.out.println("按照sex分组：" + sexMap);         // 2.按照年龄区间分区，partitioningBy 接收一个 Predicate 对象         Map<Boolean, List<Person>> ageMap = list.stream()                 .collect(Collectors.partitioningBy(p -> p.getAge() < 30 ));         System.out.println("按照age分组：" + ageMap);         // 3.多个分组，先按性别，再按年龄         Map<String, Map<String, List<Person>>> map = list.stream()                 .collect(Collectors.groupingBy(Person::getSex, Collectors.groupingBy(Person::getAddress)));         System.out.println("复合条件分组：" + map);         // 4.补充一个遇到的bug，2022-04-21 stream toMap value不能为空         // 如果key重复，会报重复 IllegalStateException Duplicate key 张三         // 如果value位null，会报空指针         // 这里list不能add，会报 UnsupportedOperationException         list = new ArrayList<>(list);         Map<String, String> map1 = list.stream()                 // key应该具有唯一标识，且value不能为null                 .collect(Collectors.toMap(Person::getName, Person::getSex));         System.out.println(map1);         // 5.单个Map转换，比如，我只获得一个 Map<String, Person> 对象，那应该怎么做呢         // 这里再加一个女张三         list.add(new Person("张三", 18, "女", "杭州"));         Map<String, Person> collectMap = list.stream()                 // 三个参数分为 key value key冲突时保留前者还是后者，这里是保留前者，因此女张三会被丢弃                 .collect(Collectors.toMap(Person::getName, p -> p, (p1, p2) -> p1));         System.out.println(collectMap);     }     @AllArgsConstructor     @Data     private static class Person {         private String name;         private int age;         private String sex;         private String address;     } }`

三、总结
----

熟练使用 **Lambda + Stream** 能够有效提升编码效率，提升代码的扩展性和可读性，既装逼又实惠，是时候好好学习一波了！

欢迎关注微信公众号：**好看的HK**，第一时间掌握Java最新黑科技，轻轻松松进大厂！