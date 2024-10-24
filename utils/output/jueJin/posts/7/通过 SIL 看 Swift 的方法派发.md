---
author: ""
title: "通过 SIL 看 Swift 的方法派发"
date: 2023-06-05
description: "Swift 方法派发方式与 Objective-C 大不相同，通过 SIL 分析 Swift 在方法派发上的逻辑和解决问题。"
tags: ["iOS","Swift中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:9,comments:0,collects:27,views:6158,"
---
> 本文作者：柯布

#### 一、SIL 介绍

根据文档的描述，SIL (Swift Intermediate Language) 基于 SSA 形式，它针对 Swift 语言设计，是一门具备高级语义信息的中间语言。

```markdown
SIL is an SSA-form IR with high-level semantic information designed to implement the Swift programming language
```

Swift 和 Objective-C 使用的相同的编译架构 LLVM，LLVM 分为前端、中端和后端三部分，通过中间语言 LLVM IR 将前端和后端串联起来。swiftc 作为 Swift 语言的的编译器，负责 LLVM 前端的工作。swiftc 与其它编译器工作类似，进行词法分析、语法分析、语义分析后构建抽象语法树（AST），然后生成 LLVM IR 交由 LLVM 的中端和后端。在这个流程当中，swiftc 相比 Objective-C 使用的 clang ，swiftc 在构建完成 AST 后，生成最终的 LLVM IR 之前，加入了 SIL。

![llvm](/images/jueJin/20b3a27f7d7f8fe.png)

SIL 具备更全的 Swift 语言信息，能更好的对代码进行优化。对于开发者，SIL 具备良好的可读性，可以作为了解 Swift 的底层细节的一个工具。

#### 二、生成 SIL

首先，将下面的代码，生成 SIL，来看看 SIL 里具体有什么。

```swift
// Contents.swift
    class Cat {
        func speak() {
        print("喵喵")
    }
}

let cat = Cat()
cat.speak()
```

如何生成 SIL？通过命令行，**swiftc -emit-silgen >> result.sil** 来生成 SIL 文件。添加 **\-Onone** 告知编译器不要进行任何优化，有助于我们了解完整的细节。

同时添加 **xcrun swift-demangle** 命令将符号进行还原，增强 Swift 方法名、类型等符号的可读性。

```swift
swiftc -emit-silgen -Onone Contents.swift | xcrun swift-demangle >> result.sil
```

生成的 SIL 主要包含类型的**声明和定义**、**代码块** 和 **函数表** 三个核心部分。

##### 声明和定义

文件的最上方，是声明和定义部分。

```swift
// 1
sil_stage raw

// 2
import Builtin
import Swift
import SwiftShims

import Foundation

    class Cat {
    func speak()
    @objc deinit
    init()
}

@_hasStorage @_hasInitialValue let cat: Cat { get }

// 3
// cat
sil_global hidden [let] @Contents.cat : Contents.Cat : $Cat
```

1.  sil\_stage 分为 raw 和 canonical，两种类型，raw 表示当前的 SIL 是未经优化的，而 canonical 代表的则是优化后。raw 更适合我们对照代码进行分析。
2.  进行类型声明，和源代码差异不大。
3.  定义了一个变量 cat，sil global 说明这是一个全局变量，hidden 则代表当前变量只在当前模块可见。若将 Cat 和该变量声明为 public，则不会存在 hidden 关键字。

##### 代码块

紧接着，是一系列方法和它的代码块，它们根据代码中的方法逐一生成。

```swift
// main
sil [ossa] @main : $@convention(c) (Int32, UnsafeMutablePointer<Optional<UnsafeMutablePointer<Int8>>>) -> Int32 { ... }
// Cat.speak()
sil hidden [ossa] @Contents.Cat.speak() -> () : $@convention(method) (@guaranteed Cat) -> () { ... }
// Cat.deinit
sil hidden [ossa] @Contents.Cat.deinit : $@convention(method) (@guaranteed Cat) -> @owned Builtin.NativeObject { ... }
// Cat.__deallocating_deinit
sil hidden [ossa] @Contents.Cat.__deallocating_deinit : $@convention(method) (@owned Cat) -> () { ... }
// Cat.__allocating_init()
sil hidden [exact_self_class] [ossa] @Contents.Cat.__allocating_init() -> Contents.Cat : $@convention(method) (@thick Cat.Type) -> @owned Cat { ... }
// Cat.init()
sil hidden [ossa] @Contents.Cat.init() -> Contents.Cat : $@convention(method) (@owned Cat) -> @owned Cat { ... }
```

每个代码块上方，都注释了对应的方法名称。除了 speak 方法，还包括了 main 函数、init、deinit 等方法。

main 函数作为整个代码的入口，通过 **@convention** 关键字约定函数的调用方式，@convention(c) 表示使用 C 语言的的调用规则来进行调用。下面的几个方法则约定调用方式为 method，此方法调用时会将 self 作为该实例方法第一个参数。此外还有 swift/objc\_method/witness\_method 多种约定。

接下来展开 main 函数来看一下具体的实现。

```swift
// main
    sil [ossa] @main : $@convention(c) (Int32, UnsafeMutablePointer<Optional<UnsafeMutablePointer<Int8>>>) -> Int32 {
    bb0(%0 : $Int32, %1 : $UnsafeMutablePointer<Optional<UnsafeMutablePointer<Int8>>>):
    // 1
    alloc_global @Contents.cat : Contents.Cat          // id: %2
    %3 = global_addr @Contents.cat : Contents.Cat : $*Cat // users: %8, %7
    %4 = metatype $@thick Cat.Type                  // user: %6
    
    // 2
    // function_ref Cat.__allocating_init()
    %5 = function_ref @Contents.Cat.__allocating_init() -> Contents.Cat : $@convention(method) (@thick Cat.Type) -> @owned Cat // user: %6
    %6 = apply %5(%4) : $@convention(method) (@thick Cat.Type) -> @owned Cat // user: %7
    store %6 to [init] %3 : $*Cat                   // id: %7
    
    // 3
    %8 = load_borrow %3 : $*Cat                     // users: %11, %10, %9
    %9 = class_method %8 : $Cat, #Cat.speak : (Cat) -> () -> (), $@convention(method) (@guaranteed Cat) -> () // user: %10
    %10 = apply %9(%8) : $@convention(method) (@guaranteed Cat) -> ()
    end_borrow %8 : $Cat                            // id: %11
    
    %12 = integer_literal $Builtin.Int32, 0         // user: %13
    %13 = struct $Int32 (%12 : $Builtin.Int32)      // user: %14
    return %13 : $Int32                             // id: %14
    } // end sil function 'main'
```

SIL 代码，通过各种指令来构成整个流程。代码整体非常易懂，我们分为三部分来解析：

1.  分配内存空间
    1.  **alloc\_global** 指令分配了全局变量 cat 所需要的内存空间，其类型为 Cat。
    2.  通过 **global\_addr** 读取该变量的内存地址，存入 %3 寄存器中。
    3.  **metatype** 指令获取 Cat 的元类型信息，存入 %4 寄存器中。
2.  初始化实例
    1.  通过 **function\_ref** 指令，引用了 Cat.\_\_allocating\_init() 方法。
    2.  紧接着通过 **apply** 指令执行 Cat.\_\_allocating\_init() 方法，创建出对应的实例，并存储到 %3 的内存地址上。
3.  方法调用
    1.  在完成了全局变量 cat 创建之后，SIL 通过 **load\_borrow** 指令从 %3 所存储的内存地址上读取对应的值。
    2.  接着使用 **class\_method** 指令，查询实例对应的函数表，获取到需要执行的方法。
    3.  最终调用 **apply** 方法完成方法调用。

##### 函数表

在整个 SIL 文件的末尾，我们可以看到函数表部分。Swift 中 class 类型最常见的方法派发方式就是通过**函数表派发**，通过查询函数表里的方法后进行调用。

```swift
    sil_vtable Cat {
    #Cat.speak: (Cat) -> () -> () : @Contents.Cat.speak() -> ()	// Cat.speak()
    #Cat.init!allocator: (Cat.Type) -> () -> Cat : @Contents.Cat.__allocating_init() -> Contents.Cat	// Cat.__allocating_init()
    #Cat.deinit!deallocator: @Contents.Cat.__deallocating_deinit	// Cat.__deallocating_deinit
}
```

通过上面的例子，可以感受到 SIL 的可读性非常强，整体流程也非常的清晰。不用太了解具体的指令操作也能大概理解其内容。

#### 三、Swift 方法派发

Swift 方法派发方式，有直接派发、函数表派发和动态派发三种方式。

##### 直接派发

Swift 的一大优势是支持值类型，值类型无法被继承，值类型中的方法都是通过直接派发的方式进行调用。

查看以下代码：

```swift
    struct Dog {
        func speak() {
        print("汪汪")
    }
}

let dog = Dog()
dog.speak()
```

在 SIL 中 **function\_ref** 指令用于生成函数的引用。找到 speak 方法调用的部分，此处通过 **function\_ref** 直接获取了 Dog.speak 方法的引用，随之调用。

```swift
// function_ref Dog.speak()
%9 = function_ref @Contents.Dog.speak() -> () : $@convention(method) (Dog) -> () // user: %10
%10 = apply %9(%8) : $@convention(method) (Dog) -> ()
// ...
```

可以得出结论，直接派发在 SIL 中的表现是，通过 **function\_ref** 指令引用函数并调用。

不是只有值类型方法才进行直接派发，引用类型通过添加 **final** 关键字，方法也会通过直接派发的方式完成调用。此外在 extension 中实现的方法，因为无法被重写，也是直接派发的。读者可以自己生成 SIL 后验证。

```swift
    class Dog {
        final func speak() {
        //...
    }
}
// 或者
    extension Dog {
        func speak() {
        //...
    }
}
```

##### 函数表派发

对于引用类型，未添加 final/dynamic 关键字且不在 extension 中实现的方法，会通过函数表派发的方式来调用方法。在上面的例子里出现的 **VTable（Virtual Method Table）**，就是一种函数表。SIL 使用 **class\_method** 指令去获取对应 **VTable** 中的方法进行调用，此处不再重复介绍。

在 Swift 中还有另一个函数表，**WTable（Witness Table** 用于存储 Protocol 中定义方法。查看以下代码：

```swift
    protocol Animal {
    func speak()
}

    class Cat: Animal {
        func speak() {
        print("喵喵")
    }
}

let cat = Cat()
cat.speak()
```

将代码生成 SIL 之后，SIL 最底下函数表部分发现 Cat 类型多了一个 **Witness Table**，里面有我们协议中定义的 speak 方法。

```swift
    sil_witness_table hidden Cat: Animal module Contents {
    method #Animal.speak: <Self where Self : Animal> (Self) -> () -> () : @protocol witness for Contents.Animal.speak() -> () in conformance Contents.Cat : Contents.Animal in Contents	// protocol witness for Animal.speak() in conformance Cat
}
```

可是当我们查看 main 函数中调用的指令，依然是通过 **class\_method** 指令去获取方法，**WTable** 好像没起作用？

```swift
%9 = class_method %8 : $Cat, #Cat.speak : (Cat) -> () -> (), $@convention(method) (@guaranteed Cat) -> () // user: %10
%10 = apply %9(%8) : $@convention(method) (@guaranteed Cat) -> ()
```

这是因为 Swift 自动进行类型推导，cat 变量被推导成了 Cat 类型，而 **WTable** 只有类型为 **Protocol** 时才会使用。声明 cat 为 Animal，重新生成 SIL：

```swift
let cat: Animal = Cat()
``````swift
// 注：
// %3 为 cat 实例的内存地址
// %6 为 cat 实例

// 1
%7 = init_existential_addr %3 : $*Animal, $Cat  // user: %8
store %6 to [init] %7 : $*Cat                   // id: %8
%9 = open_existential_addr immutable_access %3 : $*Animal to $*@opened("8ACFC95A-BFE1-11ED-B83F-56DB1A421F1A") Animal // users: %11, %11, %10

// 2
%10 = witness_method $@opened("8ACFC95A-BFE1-11ED-B83F-56DB1A421F1A") Animal, #Animal.speak : <Self where Self : Animal> (Self) -> () -> (), %9 : $*@opened("8ACFC95A-BFE1-11ED-B83F-56DB1A421F1A") Animal : $@convention(witness_method: Animal) <τ_0_0 where τ_0_0 : Animal> (@in_guaranteed τ_0_0) -> () // type-defs: %9; user: %11
%11 = apply %10<@opened("8ACFC95A-BFE1-11ED-B83F-56DB1A421F1A") Animal>(%9) : $@convention(witness_method: Animal) <τ_0_0 where τ_0_0 : Animal> (@in_guaranteed τ_0_0) -> () // type-defs: %9

```

1.  类型擦除
    
    1.  **init\_existential\_addr** 指令初始化了一个容器，该容器包含了实例（实现协议的对象）的引用。
    2.  通过 **open\_existential\_addr** 获取到上述容器，完成了类型擦除。在之后 SIL 访问都是 @opened("XXX") Animal 这一具体的协议类型。
2.  方法调用
    
    1.  通过 **witness\_method** 查找协议的方法进行调用。
    2.  获取到的方法的调用方式为：**@convention(witness\_method: Animal)** ，代表该方法是在 WTable 表中的方法，需要通过函数表派发的方式执行。

从 SIL 中可以分析，类型会影响函数的调用方式，相比于类方法，协议方法还需创建额外的内存空间。而要判断方法是否通过函数表派发，可以由 **class\_method**/**witness\_method** 来判断。

##### 消息派发

消息派发，也属于动态派发方式中的一种。我们最为熟悉 Objective-C 的方法都是通过消息派发的方式进行调用的。

在 Swift 中，可以通过添加 **@objc** 关键字将方法暴露给 OC，但在 Swift 中调用 **@objc** 方法会通过消息派发的方式来调用方法吗？通过 以下例子进行实验。

```swift
@objc
    class Cat: NSObject {
        @objc func speak() {
        print("喵喵")
    }
}

let cat = Cat()
cat.speak()

// SIL
%9 = class_method %8 : $Cat, #Cat.speak : (Cat) -> () -> (), $@convention(method) (@guaranteed Cat) -> () // user: %10
%10 = apply %9(%8) : $@convention(method) (@guaranteed Cat) -> ()
```

查看 SIL 可以注意到，即时是添加 **@objc** 的方法，依然是通过函数表进行派发的。那添加 @objc 关键字它的作用体现在哪？

查看方法的代码块会发现，多了一个针对 **@objc** 方法的代码块，而内部的实现直接引用了对应的方法，通过直接派发的方式进行调用。

```swift
// @objc Cat.speak()
    sil hidden [thunk] [ossa] @@objc Contents.Cat.speak() -> () : $@convention(objc_method) (Cat) -> () {
    // ...
    %3 = function_ref @Contents.Cat.speak() -> () : $@convention(method) (@guaranteed Cat) -> () // user: %4
    %4 = apply %3(%2) : $@convention(method) (@guaranteed Cat) -> () // user: %7
    // ...
}
```

因此仅仅是添加 **@objc** 关键字，不会影响方法的派发方式，只是生成了一个 OC 可见的版本。

而要让 Swift 的方法在运行时以消息派发的方式调用，还需要添加 **dynamic** 关键字。

```swift
// 添加 dynamic 关键字
@objc dynamic func speak() {}

// SIL
%9 = objc_method %8 : $Cat, #Cat.speak!foreign : (Cat) -> () -> (), $@convention(objc_method) (Cat) -> () // user: %10
%10 = apply %9(%8) : $@convention(objc_method) (Cat) -> ()
```

添加之后，方法由 **objc\_method** 指令获取，同时方法被修饰为 **@convention(objc\_method)**， 表明该方法就是一个 OC 的方法，上述流程等价于 **objc\_msgSend()**。同时 SIL 底部的 VTable 之中不会包含该方法。

动态派发保留了灵活性，除了能与 Objective-C 进行交互以外，也是 @dynmaicCallable 等新特性的基础。这边不再展开。

##### 总结

Swift 根据具体情况，分别用不同的方式进行方法派发，从 SIL 中更好的了解到这类细节：

*   三种派发方式，分别是静态派发、函数表派发和消息派发
*   静态派发性能最好
*   动态派发通过函数表查找方法，若调用协议方法还需要开辟额外的内存空间
*   保留了 objc\_msgSend 消息派发的能力，以兼容 OC 的特性

#### 四、解决问题

##### 场景一：Protocol Extension

问：以下代码会输出什么？

```swift
protocol Animal {}

    extension Animal {
        func speak() {
        print("adhansxkjaw")
    }
}

    class Cat: Animal {
        func speak() {
        print("喵喵")
    }
}

let cat: Animal = Cat()
cat.speak() // adhansxkjaw
```

答案是：“adhansxkjaw”，猫猫不喵喵，胡言乱语了。

问题出在哪？在 OC 中，都是通过消息派发进行的方法调用，以 OC 的思考方式直觉上会输出“喵喵”。参考上述 Swift 派发方式的描述，此场景下的调用函数表动态派发调用非常类似，那就生成 SIL 来验证一下。

```swift
%10 = function_ref @(extension in Contents):Contents.Animal.speak() -> () : $@convention(method) <τ_0_0 where τ_0_0 : Animal> (@in_guaranteed τ_0_0) -> () // user: %11
%11 = apply %10<@opened("FCCE8690-C00E-11ED-A4DD-56DB1A421F1A") Animal>(%9) : $@convention(method) <τ_0_0 where τ_0_0 : Animal> (@in_guaranteed τ_0_0) -> () // type-defs: %9

// ...

    sil_witness_table hidden Cat: Animal module Contents {
    
}
```

通过 SIL 我们看到，此时的 **WTable** 是空的，而该方法是通过**静态派发**的方式调用的，原因是 Protocol Extension 中的方法若没有在协议中进行声明，则不会进入到 WTable 中。因为方法是在 extension 中实现的，因此通过**静态派发**的方式进行调用。要获取的正确的结果，需要将 speak 方法在协议中进行声明。

##### 场景二：父类未实现协议方法

问：以下代码会输出什么？

```swift
    protocol Animal {
    func speak()
}

    extension Animal {
        func speak() {
        print("adhansxkjaw")
    }
}

class Cat: Animal {}

    class PetCat: Cat {
        func speak() {
        print("meow~")
    }
}

let cat: Animal = PetCat()
cat.speak() // adhansxkjaw
```

答案依然是：“adhansxkjaw”，持续胡言乱语。

这更加反直觉了，已经对 speak 方法进行了声明。并且实现了协议方法，怎么还是不行。生成 SIL 来看看：

```swift
%7 = init_existential_addr %3 : $*Animal, $PetCat // user: %8
store %6 to [init] %7 : $*PetCat                // id: %8
%9 = open_existential_addr immutable_access %3 : $*Animal to $*@opened("928F6BFC-C188-11ED-8314-56DB1A421F1A") Animal // users: %11, %11, %10
%10 = witness_method $@opened("928F6BFC-C188-11ED-8314-56DB1A421F1A") Animal, #Animal.speak : <Self where Self : Animal> (Self) -> () -> (), %9 : $*@opened("928F6BFC-C188-11ED-8314-56DB1A421F1A") Animal : $@convention(witness_method: Animal) <τ_0_0 where τ_0_0 : Animal> (@in_guaranteed τ_0_0) -> () // type-defs: %9; user: %11
%11 = apply %10<@opened("928F6BFC-C188-11ED-8314-56DB1A421F1A") Animal>(%9) : $@convention(witness_method: Animal) <τ_0_0 where τ_0_0 : Animal> (@in_guaranteed τ_0_0) -> () // type-defs: %9
```

查看 SIL 实现的调用方式，并没有什么毛病，是动态派发，并且查询了 WTable 里的方法。那就看看那 WTable 吧。发现 WTable 只有其父类 Cat 的对应的函数表，没有 PetCat 的函数表。

```swift
    sil_witness_table hidden Cat: Animal module Contents {
    method #Animal.speak: <Self where Self : Animal> (Self) -> () -> () : @protocol witness for Contents.Animal.speak() -> () in conformance Contents.Cat : Contents.Animal in Contents	// protocol witness for Animal.speak() in conformance Cat
}
```

查阅 SIL 文档，里面描述到：

*   WTable 只会对符合显示声明的对象生成。`A witness table is emitted for every declared explicit conformance.`
*   并且还提到，SIL 只会引用父类的协议实现，若父类没有实现子类的实现则不会被引用到。`If a derived class conforms to a protocol through inheritance from its base class, this is represented by an *inherited protocol conformance*, which simply references the protocol conformance for the base class.`

根据文档可以解释上面的问题。解决方法：子类的实现的协议方法，父类也需要实现，才有办法被执行。

另一个问题：如果将 cat 的声明由 Animal 修改为 Cat 呢？结果还是一样的，但具体的原因稍有不同，读者可以自己尝试分析。

##### 场景三：OC 混编

如下代码，定义了一个 OC 的协议，该协议由 ModuleA 遵循但没有进行实现。ModuleB 进行继承后实现协议方法，此时调用协议方法能正常输出内容。因为 OC 的协议方法是通过消息派发的方式调用的，只要 ModuleB 的方法对 OC 可见，就可以被调用到，一切正常。

```swift
    @objc protocol XXXModuleProtocol: NSObjectProtocol {
    @objc optional func applicationDidFinishLanuch()
}

    class ModuleA: NSObject, XXXModuleProtocol {
    
}

    class ModuleB: ModuleA {
        func applicationDidFinishLanuch() {
        print("ModuleB applicationDidFinishLanuch")
    }
}

// 在 OC 里调用
id<XXXModuleProtocol> module = [ModuleB new];
[module applicationDidFinishLanuch]; // ModuleB applicationDidFinishLanuch
```

查看 SIL，ModuleB 的 applicationDidFinishLanuch 方法即使没有添加 **@objc**，也生成了对应的代码块，因此该方法对 OC 可见，能够被正常执行。

```swift
// @objc ModuleB.applicationDidFinishLanuch()
sil hidden [thunk] [ossa] @@objc Contents.ModuleB.applicationDidFinishLanuch() -> () : $@convention(objc_method) (ModuleB) -> () { ... }
```

但在项目中遇到两个问题：

*   问题一，若 ModuleA 类型使用**泛型**，则 ModuleB 的 applicationDidFinishLanuch 方法不会生成的 @objc 版本的方法，因此无法被调用。
    *   原因：因为 Swift 泛型是无法导出到 OC 的，因此无法自动生成 @objc 方法也符合情况。
    *   解决：对方法手动声明 @objc，使其对 OC 可见。
*   问题二，ModuleA 和 ModuleB 分属于两个组件库，若 ModuleA 所在的组件库为静态库，则无法正常调用；若为源码库则一切正常。
    *   原因：具体原因未知，只能推断是编译器存在根据源码进行推断的行为。
    *   解决：对方法手动声明 @objc，使其对 OC 可见。
*   通用的解决方法
    *   在场景二中提到，编译器对只会引用父类的实现，那在父类中实现对应的协议方法能不能行呢？
    *   经过尝试，也是可行的，添加后能正常调用到子类的协议方法。

#### 五、总结

“_计算机科学领域的任何问题都可以通过增加一个间接的中间层来_解决”，在 Swift 语言和 LLVM IR 之间，swiftc 里加入了 SIL。通过 SIL，能够对 Swift 进一步的优化。SIL 相比汇编，更容易读懂。我们将其作为工具，了解和学习 Swift 语言的方法派发机制。也借助于 SIL 解释编码过程中遇到的问题。本文的内容只是 SIL 中关于方法调用的一小部分，欢迎参考指正。

#### 六、参考资料

1.  图源：[unsplash.com/photos/LGG5…](https://link.juejin.cn?target=https%3A%2F%2Funsplash.com%2Fphotos%2FLGG5P7KCziU "https://unsplash.com/photos/LGG5P7KCziU")
2.  [Swift SIL 官方文档](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fapple%2Fswift%2Fblob%2Fmaster%2Fdocs%2FSIL.rst "https://github.com/apple/swift/blob/master/docs/SIL.rst")
3.  [swift-c-llvm-compiler-optimization](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2F%40JMangia%2Fswift-c-llvm-compiler-optimization-842012568bb7 "https://medium.com/@JMangia/swift-c-llvm-compiler-optimization-842012568bb7")
4.  [LLVM概述——基础架构](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F102250532 "https://zhuanlan.zhihu.com/p/102250532")
5.  [LLVM编译流程](https://juejin.cn/post/6959865646125416484 "https://juejin.cn/post/6959865646125416484")
6.  [Swift 底层是怎么调度方法的](https://link.juejin.cn?target=https%3A%2F%2Fgpake.github.io%2F2019%2F02%2F11%2FswiftMethodDispatchBrief%2F "https://gpake.github.io/2019/02/11/swiftMethodDispatchBrief/")
7.  [试着读一下 SIL](https://link.juejin.cn?target=https%3A%2F%2Fgpake.github.io%2F2019%2F03%2F06%2FtryToReadSIL%2F%23more "https://gpake.github.io/2019/03/06/tryToReadSIL/#more")

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！