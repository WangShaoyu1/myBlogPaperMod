---
author: "捡田螺的小男孩"
title: "原来Optional用起来这么清爽！"
date: 2024-07-15
description: "最近在项目中，看到一段很优雅的代码，用Optional 来判空的。我贴出来给大家看看： 这段代码因为Optional的存在，优雅了很多，因为userInfoList"
tags: ["Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:84,comments:0,collects:173,views:11413,"
---
前言
--

大家好，我是**捡田螺的小男孩**。

最近在项目中，看到一段很优雅的代码，用Optional 来判空的。我贴出来给大家看看：

```less
//遍历打印 userInfoList
for (UserInfo userInfo : Optional.ofNullable(userInfoList)
    .orElse(new ArrayList<>())) {
    //print userInfo
}
```

这段代码因为Optional的存在，优雅了很多，因为`userInfoList`可能为null，我们通常的做法，是先判断不为空，再遍历：

```less
    if (!CollectionUtils.isEmpty(userInfoList)) {
        for (UserInfo userInfo:userInfoList) {
        //print userInfo
    }
}
```

显然，**Optional**让我们的判空更加优雅啦、

*   **关注公众号**：捡田螺的小男孩（很多后端干货文章）

1\. 没有Optional，传统的判空?
---------------------

如果只有上面这一个例子的话，大家会不会觉得有点**意犹未尽呀**。那行，田螺哥再来一个。

假设有一个订单信息类，它有个地址属性。

要获取订单地址的城市，会有这样的代码:

```ini
String city = orderInfo.getAddress().getCity();
```

这块代码会有啥问题呢？是的，可能**报空指针问题**！为了解决空指针问题，一般我们可以这样处理：

```ini
    if (orderInfo != null) {
    Address address = orderInfo.getAddress();
        if (address != null) {
        String city = address.getCity();
    }
}
```

这种写法显然有点丑陋。为了更加优雅一点，我们可以使用`Optional`

```css
String city = Optional.ofNullable(orderInfo)
.map(Order::getAddress)
.map(Address::getCity)
.orElseThrow(() ->
new IllegalStateException("OrderInfo or Address is null"));
```

这样是不是优雅一点，好了这例子也介绍完了。你们知道，**田螺哥很细的**。当然，是指写文章很细哈

![image.png](/images/jueJin/be453da751c74c6.png)

有些伙伴，可能第一眼看那个`Optional`优化后的代码有点生疏。因此，接下来，给介绍`Optional`相关`API`。

2\. Optional API简介
------------------

### 2.1 ofNullable(T value)、empty()、of(T value)

因为我们上面的例子，使用到了 `Optional.ofNullable(T value)`，第一个函数就讲它啦。源码如下：

```scss
    public static <T> Optional<T> ofNullable(T value) {
    return value == null ? empty() : of(value);
}
```

如果`value`为null，就返回 `empty()`，否则返回 `of(value)`函数。接下来，我们看Optional的`empty()` 和 `of(value)` 函数

```swift
    public final class Optional<T> {
    
    private static final Optional<?> EMPTY =  new Optional<>();
    
        public static<T> Optional<T> empty() {
        @SuppressWarnings("unchecked")
        Optional<T> t = (Optional<T>) EMPTY;
        return t;
    }
```

显然， `empty（）`函数的作用就是返回`EMPTY`对象。

而`of(value)` 函数会返回Optional的构造函数

```csharp
    public static <T> Optional<T> of(T value) {
    return new Optional<>(value);
}
```

对于 Optional的构造函数：

```csharp
    private Optional(T value) {
    this.value = Objects.requireNonNull(value);
}

    public static <T> T requireNonNull(T obj) {
    if (obj == null)
    throw new NullPointerException();
    return obj;
}
```

*   当value值为空时，会报`NullPointerException`。
*   当value值不为空时，能正常构造`Optional`对象。

### 2.2 orElseThrow(Supplier<? extends X> exceptionSupplier)、orElse(T other) 、orElseGet(Supplier<? extends T> other)

上面的例子，我们用到了orElseThrow

```scss
.orElseThrow(() -> new IllegalStateException("OrderInfo or Address is null"));
```

那我们先来介绍一下它吧：

```java
    public final class Optional<T> {
    
    private final T value;
    
        public <X extends Throwable> T orElseThrow(Supplier<? extends X> exceptionSupplier) throws X {
            if (value != null) {
            return value;
                } else {
                throw exceptionSupplier.get();
            }
        }
```

很简单就是，如果`value`不为`null`，就返回`value`，否则，抛出函数式`exceptionSupplier`的异常。

一般情况，跟`orElseThrow`函数功能相似的还有`orElse(T other)` 和 `orElseGet(Supplier<? extends T> other)`

```typescript
    public T orElse(T other) {
    return value != null ? value : other;
}
```

对于`orElse`，如果`value`不为`null`，就返回`value` ，否则返回 `other`。

```typescript
    public T orElseGet(Supplier<? extends T> other) {
    return value != null ? value : other.get();
}
```

对于`orElseGet`，如果`value`不为`null`，就返回`value` ，否则返回执行函数式`other`后的结果。

### 2.3 map 和 flatMap

我们上面的例子，使用到了`map(Function<? super T, ? extends U> mapper)`

```python
Optional.ofNullable(orderInfo)
.map(Order::getAddress)
.map(Address::getCity)
```

我们先来介绍一下它的：

```typescript
    public<U> Optional<U> map(Function<? super T, ? extends U> mapper) {
    Objects.requireNonNull(mapper);
    if (!isPresent())
    return empty();
        else {
        return Optional.ofNullable(mapper.apply(value));
    }
}

    public boolean isPresent() {
    return value != null;
}
```

其实这段源码很简答，先是做个**空值检查**，接着就是value的存在性检查，最后就是`应用函数并返回新的` Optional\`\`\`

跟`.map`相似的，还有个`flatMap`，如下:

```swift
    public<U> Optional<U> flatMap(Function<? super T, Optional<U>> mapper) {
    Objects.requireNonNull(mapper);
    if (!isPresent())
    return empty();
        else {
        return Objects.requireNonNull(mapper.apply(value));
    }
}
```

可以发现，它两差别并不是很大，主要就是体现在入参所接受类型不一样。

### 2.4 isPresent 和ifPresent

我们在使用Optional的过程中呢，有些时候，会使用到`isPresent`和`ifPresent`，他们有点像，一个就是判断value值是否为空，另外一个就是判断value值是否为空，再去做一些操作。比如:

```typescript
    public void ifPresent(Consumer<? super T> consumer) {
    if (value != null)
    consumer.accept(value);
}
```

即判断value值是否为空，然后做一下函数式的操作。

举个例子，这段代码：

```scss
    if(userInfo!=null){
    doBiz(userInfo);
}
```

用了`isPresent` 可以优化为：

```ini
Optional.ofNullable(userInfo)
    .ifPresent(u->{
    doBiz(u);
    });
```

优雅永不过时，嘻嘻~