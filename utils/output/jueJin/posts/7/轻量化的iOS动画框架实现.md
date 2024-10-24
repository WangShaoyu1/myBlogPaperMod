---
author: ""
title: "轻量化的iOS动画框架实现"
date: 2023-07-06
description: "iOS客户端日常开发中，经常要实现一些简单的动画组合效果，提升App的体验，但系统提供的实现方式存在回调嵌套的问题，不容易维护。"
tags: ["iOS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:87,comments:12,collects:138,views:13753,"
---
> 本文作者：有恒

#### 一、背景

日常开发过程中，经常需要对视图做动画，假如需要对一个 view 进行动画操作：3s 淡入，结束后，1s 放大，很容易写出这样的代码：

```swift
    UIView.animate(withDuration: 3, animations: {
    view.alpha = 1
    }, completion: { _ in
        UIView.animate(withDuration: 1) {
        view.frame.size = CGSize(width: 200, height: 200)
    }
    })
```

如果，是更多串行的动画需要完成呢？

```swift
    UIView.animate(withDuration: 3, animations: {
    ......
    }, completion: { _ in
        UIView.animate(withDuration: 3) {
        ......
        }, completion: { _ in
            UIView.animate(withDuration: 3) {
            ......
            }, completion: { _ in
            ......
        }
    }
    })
```

这样的回调地狱代码，很难维护也不优雅。

业界也有一些现成的动画库，比较知名的有：

*   Spring: 轻量级的、基于 Swift 实现的动画库，它提供了多种弹簧效果动画效果。缺点是功能相对较少，不能满足所有的动画需求。
*   Hero：一个高度可定制化的 iOS 动画库，它支持多种动画效果，如过渡动画、视图转场等。缺点是对于复杂的动画效果可能需要编写大量的代码。
*   TweenKit：一个轻量级的、基于 Swift 实现的动画库，它提供了多种动画效果，如渐变效果、旋转效果等。TweenKit 的优点是易于使用，对于入门级的开发者很友好，但缺点是功能相对较少，不能满足所有的动画需求。

以上动画库各有优点和缺点，总的来说都有书写相对复杂不够优雅的缺陷，那有没有方便开发和维护的代码格式？

动画串行执行：

```swift
view.at.animate(
.fadeIn(duration: 3.0),
.scale(toValue: 1.2, duration: 0.5)
)
```

动画并行执行：

```swift
view.at.animate(parallelism:
.fadeIn(duration: 3.0),
.scale(toValue: 1.2, duration: 1)
)
```

如果是多个视图组合动画串行执行呢？

```swift
AT.animate (
view1.at.animate(parallelism:
.fadeIn(duration: 3.0),
.scale(toValue: 1.2, duration: 1)
)
view2.at.animate(parallelism:
.fadeIn(duration: 3.0),
.scale(toValue: 1.2, duration: 1)
)
)
```

#### 二、实现方案

![](/images/jueJin/2c0494e0d3ae5c0.png)

##### Animator

动画执行器

```swift
    public protocol Animator {
    associatedtype T
    mutating func start(with view : UIView)
    func pause()
    func resume()
    func stop()
}
```

封装 UIViewPropertyAnimator，CAKeyframeAnimator，CABasicAnimator，遵循 Animator 协议，实现不同类型的动画执行器。

##### Animation

Animation 提供动画执行参数:

为不同的 Animator 制定不同的 Animation 协议:

```swift
    public protocol AnimationBaseProtocol {
var duration : TimeInterval { get }
}

    protocol CAAnimationProtocol : AnimationBaseProtocol {
var repeatCount : Float { get }
var isRemovedOnCompletion : Bool { get }
var keyPath : String? { get }
var animationkey : String? { get }
}

    protocol ProPertyAnimationProtocol : AnimationBaseProtocol {
var curve : UIView.AnimationCurve { get }
var fireAfterDelay : TimeInterval { get }
var closure : (UIView) -> Void { get }
}

    protocol CABaseAnimationProtocol: CAAnimationProtocol {
var fromValue: Any { get }
var toValue : Any { get }
}

    protocol CAKeyFrameAnimationProtocol: CAAnimationProtocol {
var keyTimes: [NSNumber]? { get }
var timingFunction: CAMediaTimingFunction? { get }
var valuesClosure: ((UIView) -> [Any]?) { get }
}
```

需要注意的是，动画执行器支持多种实现，用到了范型，动画执行器作为返回值，使用时需要对其进行类型擦除。

##### 类型擦除

类型擦除的作用是擦除范型的具体信息，以便在运行时使用：

定义一个范型类：

```swift
    class Stack<T> {
    var items = [T]()
    
        func push(item: T) {
        items.append(item)
    }
    
        func pop() -> T? {
            if items.isEmpty {
            return nil
                } else {
                return items.removeLast()
            }
        }
    }
```

如果这样使用：

```less
// 实例化一个 Stack<String> 对象
let stackOfString = Stack<String>()
stackOfString.push(item: "hello")
stackOfString.push(item: "world")

// 实例化一个 Stack<Int> 对象
let stackOfInt = Stack<Int>()
stackOfInt.push(item: 1)
stackOfInt.push(item: 2)

let stackArray: [Stack] = [stackOfString, stackOfInt]
```

会有一个错误：

![](/images/jueJin/ffd075ea65a4e81.png)

因为这是两种类型。

如何进行擦除？

```swift
    class AnyStack {
    private let pushImpl: (_ item: Any) -> Void
    private let popImpl: () -> Any?
    
        init<T>(_ stack: Stack<T>) {
        pushImpl = { item in
            if let item = item as? T {
            stack.push(item: item)
        }
    }
        popImpl = {
        return stack.pop()
    }
}

    func push(item: Any) {
    pushImpl(item)
}

    func pop() -> Any? {
    return popImpl()
}
}
```

这样执行下面代码就可以正常编译使用：

```swift
let stackArray: [AnyStack] = [AnyStack(stackOfString), AnyStack(stackOfInt)]
```

回到 Animator 的设计，同样的原理，这样就解决了形参类型不一致的问题。

##### 具体实现

```swift
    extension Animator {
        public static func fadeIn(duration: TimeInterval = 0.25, curve:UIView.AnimationCurve = .linear , fireAfterDelay: TimeInterval = 0.0, completion:(()-> Void)? = nil) -> AnyAnimator<Animation> {
        let propertyAnimation = PropertyAnimation()
        propertyAnimation.duration = duration
        propertyAnimation.curve = curve
        propertyAnimation.fireAfterDelay = fireAfterDelay
    propertyAnimation.closure = { $0.alpha = 1}
    return Self.creatAnimator(with: propertyAnimation,completion: completion)
}

    public static func scale(valus: [NSNumber], keyTimes: [NSNumber], repeatCount: Float = 1.0, duration: TimeInterval = 0.3, completion:(()-> Void)? = nil) -> AnyAnimator<Animation> {
    let animation = CAFrameKeyAnimation()
    animation.keyTimes = keyTimes
    animation.timingFunction = CAMediaTimingFunction(name: .linear)
animation.valuesClosure = {_ in valus}
animation.repeatCount = repeatCount
animation.isRemovedOnCompletion = true
animation.fillMode = .removed
animation.keyPath = "transform.scale"
animation.animationkey = "com.moyi.animation.scale.times"
animation.duration = duration
return AnyAnimator.init(CAKeyFrameAnimator(animation: animation,completion: completion))
}

/// 自定义Animation
    public static func creatAnimator(with propertyAnimation : PropertyAnimation, completion:(()-> Void)? = nil) -> AnyAnimator<Animation> {
    return AnyAnimator.init(ViewPropertyAnimator(animation:propertyAnimation,completion:completion))
}
}

```

CAAnimation 是 Core Animation 框架中负责动画效果的类，它定义了一系列动画效果相关的属性和方法。可以通过创建 CAAnimation 的子类，如 CABasicAnimation、CAKeyframeAnimation、CAAnimationGroup 等来实现不同类型的动画效果。

其中，keypath 是 CAAnimation 的一个重要概念，用于指定动画效果所作用的属性。keypath 的值通常为字符串类型，在指定属性时需要使用 KVC（键值编码）来进行访问。

更多关于 CAAnimation 的内容可以参考引用中相关链接，不是本文重点不再展开。

##### AnimationToken

AnimationToken 是视图和动画执行器的封装，用于视图的动画处理。

然后对 UIView 添加串行、并行的扩展方法：

```swift
    extension EntityWrapper where This: UIView {
        internal func performAnimations<T>(_ animators: [AnyAnimator<T>] , completionHandlers: [(() -> Void)]) {
            guard !animators.isEmpty else {
            completionHandlers.forEach({ handler in
            handler()
            })
            return
        }
        
        var leftAnimations = animators
        var anyAnimator = leftAnimations.removeFirst()
        
        anyAnimator.start(with: this)
            anyAnimator.append {
            self.performAnimations(leftAnimations, completionHandlers: completionHandlers)
        }
    }
    
        internal func performAnimationsParallelism<T>(_ animators: [AnyAnimator<T>], completionHandlers: [(() -> Void)]) {
            guard !animators.isEmpty else {
            completionHandlers.forEach({ handler in
            handler()
            })
            return
        }
        
        let animationCount = animators.count
        var completionCount = 0
        
            let animationCompletionHandler = {
            completionCount += 1
                if completionCount == animationCount {
                completionHandlers.forEach({ handler in
                handler()
                })
            }
        }
        
            for var animator in animators {
            animator.start(with: this)
                animator.append {
                animationCompletionHandler()
            }
        }
    }
}
```

completionHandlers 是动画任务的结束的回调逻辑，类似 UIView 类方法 animate 的 completion 回调，这样就有了动画结束的回调能力。

给 UIView 添加扩展，实现 view.at.animate () 方法：

```swift
    extension EntityWrapper where This: UIView {
    
        @discardableResult private func animate<T>(_ animators: [AnyAnimator<T>]) -> AnimationToken<T> {
        return AnimationToken(
        view: this,
        animators: animators,
        mode: .inSequence
        )
    }
    
        @discardableResult public func animate<T>(_ animators: AnyAnimator<T>...) -> AnimationToken<T> {
        return animate(animators)
    }
    
        @discardableResult private func animate<T>(parallelism animators: [AnyAnimator<T>]) -> AnimationToken<T> {
        return AnimationToken(
        view: this,
        animators: animators,
        mode: .parallelism
        )
    }
    
        @discardableResult public func animate<T>(parallelism animators: AnyAnimator<T>...) -> AnimationToken<T> {
        return animate(parallelism: animators)
    }
}
```

AT.animate () 对 AnimationToken 进行串行管理，不再赘述。

#### 三、总结

本文只是对动画回调嵌套问题的轻量化解决方案，让组合动画的代码结构更加清晰，方便开发和后续迭代修改。实现方案还有许多可以改进的地方，欢迎参考指正。

#### 四、参考资料

1.  图源：[unsplash.com/photos/PDxp…](https://link.juejin.cn?target=https%3A%2F%2Funsplash.com%2Fphotos%2FPDxp-AItBMA "https://unsplash.com/photos/PDxp-AItBMA")
2.  \[Declarative animation\][www.swiftbysundell.com/articles/bu…](https://link.juejin.cn?target=https%3A%2F%2Fwww.swiftbysundell.com%2Farticles%2Fbuilding-a-declarative-animation-framework-in-swift-part-1%2F "https://www.swiftbysundell.com/articles/building-a-declarative-animation-framework-in-swift-part-1/")
3.  \[CAAnimation\] Apple Inc. Core Animation Programming Guide. \[About Core Animation\](About Core Animation)
4.  \[CAAnimation\] 王巍. iOS 动画高级技巧 \[M\]. 北京：人民邮电出版社，2015.
5.  \[CAAnimation\][developer.apple.com/documentati…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Fquartzcore%2Fcaanimation%2F "https://developer.apple.com/documentation/quartzcore/caanimation/")
6.  \[CAAnimation\][github.com/pro648/tips…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fpro648%2Ftips%2Fblob%2Fmaster%2Fsources%2FCAAnimation%25EF%25BC%259A%25E5%25B1%259E%25E6%2580%25A7%25E5%258A%25A8%25E7%2594%25BBCABasicAnimation%25E3%2580%2581CAKeyframeAnimation%25E4%25BB%25A5%25E5%258F%258A%25E8%25BF%2587%25E6%25B8%25A1%25E5%258A%25A8%25E7%2594%25BB%25E3%2580%2581%25E5%258A%25A8%25E7%2594%25BB%25E7%25BB%2584.md "https://github.com/pro648/tips/blob/master/sources/CAAnimation%EF%BC%9A%E5%B1%9E%E6%80%A7%E5%8A%A8%E7%94%BBCABasicAnimation%E3%80%81CAKeyframeAnimation%E4%BB%A5%E5%8F%8A%E8%BF%87%E6%B8%A1%E5%8A%A8%E7%94%BB%E3%80%81%E5%8A%A8%E7%94%BB%E7%BB%84.md")
7.  \[UIViewPropertyAnimator\][developer.apple.com/documentati…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Fuikit%2Fuiviewpropertyanimator "https://developer.apple.com/documentation/uikit/uiviewpropertyanimator")
8.  \[使用 UIViewPropertyAnimator 做动画\][swift.gg/2017/04/20/…](https://link.juejin.cn?target=https%3A%2F%2Fswift.gg%2F2017%2F04%2F20%2Fquick-guide-animations-with-uiviewpropertyanimator%2F "https://swift.gg/2017/04/20/quick-guide-animations-with-uiviewpropertyanimator/")

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe (at) corp.netease.com！