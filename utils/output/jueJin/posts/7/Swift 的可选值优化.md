---
author: ""
title: "Swift 的可选值优化"
date: 2023-06-16
description: "本文介绍了强类型语言 Swift 的 nil 与 OC 概念的不同，以及编译时的内存使用方面的优化手段。"
tags: ["iOS","Swift中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:15,comments:5,collects:24,views:12274,"
---
> 本文作者：[苯酚](https://link.juejin.cn?target=https%3A%2F%2Fxcoder.tips "https://xcoder.tips")

`nil` 的语义
=========

在 Objective-C 中，`nil` 表示空对象，它本质是一个指向 **0x00000000** 的指针。但对于非指针的值类型，OC 中是无法表示\_没有值\_这个概念的，比如 **NSInteger**，它可以是 0，也可以是其他任何值，但就是不存在\_没有值\_。

Swift 作为一种强类型的语言，它从一开始就引入了\_没有值\_这个概念，虽然还是用 `nil` 关键字，但实际语义上有所不同。比如 **Int?**，它可以是 `nil`，也可以是 **0**，**0** 是一个具体的值，而 `nil` 不是。然而，计算机作为一个二进制的机器，它内存中保存的非 0 即 1，如何表示\_没有值\_呢？换句话说，`nil` 在内存中究竟是什么？我们可以通过简单的代码找出它在内存中的真相。

`nil` 在内存中的表示
=============

```swift
/// 以下方法取 value 的地址，并从地址处向后取它在内存中的大小 size 个字节，转为对应的数组
    func bytes<T>(of value: T) -> [UInt8] {
    var value = value
    let size = MemoryLayout<T>.size
        return withUnsafePointer(to: &value, {
        $0.withMemoryRebound(
        to: UInt8.self,
        capacity: size,
            {
            Array(UnsafeBufferPointer(
            start: $0, count: size))
            })
            })
        }
        
        var int: Int? = 0
    bytes(of: int)    // [0, 0, 0, 0, 0, 0, 0, 0, 0]
    int = nil
bytes(of: int)    // [0, 0, 0, 0, 0, 0, 0, 0, 1]

```

从上面我们可以得知，可选的 **Int?** 类型比普通 **Int** 类型多占一个字节，用来表示是不是 **没有值**。如果这样的话，在 `struct` 或 `class` 中用可选类型岂不是会浪费较多内存空间？因为内存对齐的缘故，多一个字节，就要浪费剩下的 7 字节，比如：

```swift
    struct N {
    var b: Int? = 2
    var a: Int? = 3
}

var n = N()
bytes(of: n)    // [2, 0, 0, 0, 0, 0, 0, 0, 0, 76, 68, 3, 1, 0, 0, 0,
//  3, 0, 0, 0, 0, 0, 0, 0, 0]
```

以上原本可以用 16 字节表示的结构体，实际上占了 25 字节（考虑结尾处内存对齐，其实占了 32 字节）。我们在实际开发中，可能会在 `class` 中声明大量的可选字段，如果都这样的话，那内存使用率也太低了，有优化手段吗？

答案是有的，而且 **Swift** 编译器已经默默帮我们做了。

`nil` 的优化
=========

Bool
----

Bool 类型理论上只用 0 1 两个值，一个 bit 即可，但它却占了一整个 byte ，剩下的几个 bit 是可以用来区分是否有值的。

```swift
var b: Bool? = false
bytes(of: b) // [0]
b = true
bytes(of: b) // [1]
b = nil
bytes(of: b) // [2]
```

从以上结果得知，**Swift** 用 2 表示 **Bool?** 的\_没有值\_，所以没有内存浪费。这样也使得 **Bool?** 不再是两态的开关，而是一个三态的开关。于是经常在代码中看到看起来比较蠢的写法：

```swift
var value: Bool?
    if value == true {
    
}
```

因为一般来说是不建议 Bool 值与 true 判断等的，它本身已经是 Bool 了。而在 Swift 中又用起来是那么自然……

String
------

String 类型不同于 Int 这种——0 也是合法值，String 的内存值为 0 是可以表示\_没有值\_的，所以它也没有内存浪费

```swift
var s: String? = "abc"
bytes(of: s)  // [97, 98, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 227]
s = ""
bytes(of: s)  // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 224]
s = nil
bytes(of: s)  // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
```

String 在 **Swift** 中是一个结构体，无论字符串多长，String 变量本身只占 16 字节，短的字符串通过类似 OC 中 [Tagged Pointer](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fvideos%2Fplay%2Fwwdc2020%2F10163%2F "https://developer.apple.com/videos/play/wwdc2020/10163/") 的技术直接存在指针中，长的字符串需要指向堆内存地址。

Class
-----

Class 类型同 OC 中的一样，是指针类型，空指针可以表示\_没有值\_，没有内存浪费。

```swift
    class MyObject {
    var b: Int? = 2
    var a: Int? = 3
}

var o: MyObject? = .init()
bytes(of: o)  // [160, 142, 188, 2, 0, 96, 0, 0]
o = nil
bytes(of: o)  // [0, 0, 0, 0, 0, 0, 0, 0]
```

无论 **Class** 中有多少成员变量，Class 变量本身（即指向它的指针）只占 8 字节（64位系统中）。

Enum
----

枚举类型一般是有限的，最终总可以找到一个不在枚举范围内的值表示 _没有值_，也可以没有内存浪费。

```swift
    enum Edge {
    case left
    case right
    case top
    case bottom
}

var e: Edge? = .left
bytes(of: e)  // [0]
e = .bottom
bytes(of: e)  // [3]
e = nil
bytes(of: e)  // [4]，用越界值表示 nil，没有值
```

当然并不是所有 **Enum** 类型都能这样，带关联值的就可能不行。

结语
==

综上所述，**Swift** 编译器会尽可能地优化可选值的内存占用，日常开发并不需要太多关心，但是部分情况仍要求开发者尽量少使用可选值，如结构体中连续几个可选 **Int** 的情况，如果 0 也能满足代码逻辑，就使用非可选值，并用 0 初始化它吧！

```swift
// 浪费的内存比较可观
    struct My {
    var a: Int?
    var b: Int?
    var c: Int?
    var d: Int?
}
```

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！