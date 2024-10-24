---
author: "yck"
title: "理解 Swift 的值类型"
date: 2016-12-21
description: "理解 Swift 的值类型
                        
                            在这里，我们要讲讲值类型和写时复制。在 swift 的标准库中，所有的集合类型都使用了写时复制。我们在本篇文章中看一下写时复制如何工作的，并且如何实现它。
               "
tags: ["iOS","Swift中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:12,comments:0,collects:1,views:2722,"
---
> 在这里，我们要讲讲值类型和写时复制。在 swift 的标准库中，所有的集合类型都使用了写时复制。我们在本篇文章中看一下写时复制如何工作的，并且如何实现它。

引用类型
----

使用 swift 的 `Data` 和 `NSMutableData` 作对比

```reasonml
var sampleBytes: [UInt8] = [0x0b, 0xad, 0xf0, 0x0d]
let nsData = NSMutableData(bytes: sampleBytes, length: sampleBytes.count)
```

在这里，我们使用了 let 来修饰 nsData 变量，但是因为 `NSMutableData` 是一个引用类型，swift 的 let/var 关键字不能控制它。对于引用类型，let 只能保证 nsData 不被指向其他实例，但是我们可以修改他：

```applescript
nsData.append(sampleBytes, length: sampleBytes.count)
```

因为我们操作的是一个对象，在以下例子中，两个对象都会发生改变：

```gradle
// 两者都指向同一个对象，所以都改变了
let nsOtherData = nsData
nsData.append(sampleBytes, length: sampleBytes.count)
```

如果不希望 nsOtherData 也随之改变，可以使用 `mutableCopy`

```reasonml
// 这样 nsOtherData 就不会改变
let nsOtherData = nsData.mutableCopy() as! NSMutableData
nsData.append(sampleBytes, length: sampleBytes.count)
```

值类型
---

现在我们看一下 `Data` 类型，这是一个结构体

```reasonml
let data = Data(bytes: sampleBytes, count: sampleBytes.count)
```

这里我们使用了 let 修饰，这样就不能修改 data 的值，除非将他设置为 var。并且将 data 赋值给别的变量，修改变量也不会影响 data。

值类型和引用类型之间的差异在于，当你将一个值类型赋值给别的变量或者作为函数参数时，只是对值进行了赋值。但是将引用类型分配给其他变量时，只会创建指向内存中同一个对象的第二个引用。

当我们创建一个副本时，结构体被逐个复制。但是这不意味着 `Data` 的值直接被复制过去，因为 `Data` 有一个内部的内存引用。当结构体被复制时，只是引用被复制给新值。只有当复制的变量值改变时，才会将值复制过去。

实现写时复制
------

在这里我们将实现一个很简单的结构体版本，来更好的理解写时复制

```swift
    struct MyData {
    var data = NSMutableData()
    
        mutating func append(_ bytes: [UInt8]) {
        data.append(bytes, length: bytes.count)
    }
}
```

接下来看看结果如何

```haskell
var data = MyData()
var copy = data
data.append(sampleBytes)
```

Copy 还是被改变了，这是因为在结构体复制时，将引用复制了过去，这个引用指向了实际的值，所以 copy 还是被改变，以下代码就可以修复这个问题

```swift
    struct MyData {
    var data = NSMutableData()
    
        mutating func append(_ bytes: [UInt8]) {
        print("making a copy")
        data = data.mutableCopy() as! NSMutableData
        data.append(bytes, length: bytes.count)
    }
}
```

现在 copy 的值不会被改变了，接下来重构一下结构体，更加优雅点：

```swift
    struct MyData {
    var data = NSMutableData()
        var dataForWriting: NSMutableData {
            mutating get {
            print("making a copy")
            data = data.mutableCopy() as! NSMutableData
            return data
        }
    }
    
        mutating func append(_ bytes: [UInt8]) {
        dataForWriting.append(bytes, length: bytes.count)
    }
}
```

让写时复制更高效
--------

目前的做法是很幼稚的，我们会在每次 append 的时候都去复制，而不去管我们是这个对象的唯一拥有者，例如以下代码：

```awk
    for _ in 0..<10 {
    data.append(sampleBytes)
}
// This prints:
// making a copy
// making a copy
// making a copy
// making a copy
// making a copy
// making a copy
// making a copy
// making a copy
// making a copy
// making a copy
```

以上代码在理想情况下应该只 copy 一次，想这样做的话也很简单，使用 `isKnownUniquelyReferenced` 方法，这个方法可以判断传入的参数是否已经有一个强引用

```kotlin
    struct MyData {
        var dataForWriting: NSMutableData {
            mutating get {
                if isKnownUniquelyReferenced(&data) {
                return data
            }
            print("making a copy")
            data = data.mutableCopy() as! NSMutableData
            return data
        }
    }
}
```

但是上面的代码还是没有起效的，因为 `isKnownUniquelyReferenced` 只适用于 swift 对象，现在我们来将 `NSMutableData` 包装为 swift 对象：

```swift
    final class Box<A> {
    // 使用这个常量
    let unbox: A
        init(_ value: A) {
        unbox = value
    }
}
    struct MyData {
    var data = Box(NSMutableData())
        var dataForWriting: NSMutableData {
            mutating get {
                if isKnownUniquelyReferenced(&data) {
                return data.unbox
            }
            print("making a copy")
            data = Box(data.unbox.mutableCopy() as! NSMutableData)
            return data.unbox
        }
    }
    
        mutating func append(_ bytes: [UInt8]) {
        dataForWriting.append(bytes, length: bytes.count)
    }
}
```

现在我们再去进行之前的遍历操作会发现只复制了一次，有点类似 lazy

写时复制也不是时时起效
-----------

```maxima
(0..<10).reduce(data) { result, _ in
var copy = result
copy.append(sampleBytes)
return copy
}
```

上面的写法会 copy10次，所以写时复制也不是万能的，但是一般情况下不会出现这种问题。

上面 `reduce` 内部做了什么？

*   (0..<10) 代表了闭包会进行10次
*   接受了一个初始值参数，并将这个初始值作为第一次遍历的 result 的值
*   返回的 copy 作为下一次循环的 result 值

参考自 [swift talk](https://link.juejin.cn?target=https%3A%2F%2Ftalk.objc.io%2Fepisodes%2FS01E20-understanding-value-type-performance "https://talk.objc.io/episodes/S01E20-understanding-value-type-performance")