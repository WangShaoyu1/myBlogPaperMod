---
author: ""
title: "基于自建 VTree 的全链路埋点方案"
date: 2022-09-14
description: "在当前移动互联网时代，一个产品想快速、准确的抢占市场，无疑是需要产品快速迭代更新，如何协助产品经理对产品当前的数据做出最优判断是关键。"
tags: ["iOS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读20分钟"
weight: 1
selfDefined:"likes:39,comments:1,collects:60,views:5095,"
---
> 本文作者： dl

一、背景
----

  在当前移动互联网时代，一个产品想快速、准确的抢占市场，无疑是需要产品快速迭代更新，如何协助产品经理对产品当前的数据做出最优判断是关键，这就需要客户端侧提供**高精度**、**稳定**、**全链路**的埋点数据；做客户端开发的同学都深刻知道，想要在开发过程中满足上述三点，开发过程都是头大的；

  针对这个问题，我们自研了一套全链路埋点方案，从埋点设计、到客户端三端(_**iOS**_、_**Android**_、_**H5**_)开发、以及埋点校验&稽查、再到埋点数据使用，目前已经广泛应用于云音乐各个主要APP。

二、先聊聊传统埋点方案的弊端
--------------

  传统埋点，就是BI数据人员根据策划想要的数据，设计出一个个的**单点**的坑位埋点，然后客户端人员逐个埋进来，这些埋点经常都存在以下特点：

1.  坑位的事件埋点很简单：点击/双击/滑动等明确的事件类埋点，很简单，根据需求一个一个埋上去即可
2.  资源位曝光埋点是噩梦：在列表/非列表资源的曝光埋点场景，想做到**高精度**(埋点精度提到 _**99.99%**_)难度很大，你有可能每一个曝光埋点都需要考虑如下大部分场景： ![](/images/jueJin/87e9591783d635c.png)
3.  每个坑位都是独立的：坑位之间的埋点没有关系，需要给每一个坑位**起名字**（比如通过随机字符串，或者组合参数来标识），页面、列表、元素之间，存在大量的重复参数，以达到数据分析要求
4.  漏斗/归因分析难：由于每一个坑位埋点都是独立的，APP使用过程中先后产生的埋点是无关联的，想要做到漏斗/归因分析，需要客户端做_**魔鬼参数**_传递，然后数据分析时再逐个场景的做参数关联分析
5.  坑位黑盒：想知道一个app有多少坑位埋点，当前页面下已经显现出了多少坑位，坑位之间是什么关系，管理成本高

三、我们曾经做过的一些尝试
-------------

### 3.1 无痕埋点

  市面上有很多人介绍**无痕埋点**，我们曾经也做过类似的尝试；这种无痕，主要是针对一些坑位事件（比如点击、双击、滑动等事件）埋点做自动生成埋点，同时附带上生成的**xpath**（根据view层级生成），然后把埋点上报到数据平台后，再将xpath赋予真实的业务意义，从而可以进行数据分析；

  但是这个方案的问题是只能处理一些简单事件场景，并且数据平台做xpath关联是一件噩梦，工作量大，最主要的是**不稳定**，对于埋点数据高精度场景，这个方案不可行（没有哪个客户端开发人员天天花费大量时间查找 xpath 是什么意义，以及随着迭代业务的开发，xpath由于不受控制的变化带来的数据问题带来的排查工作量是巨大的）。

  特别对于资源位的曝光上，想要做到真正的无痕，自动埋点，是不太可行的；比如列表场景，底层是不认识一个cell是什么资源的，甚至都也不知道是不是一个资源。

四、我们的方案
-------

### 4.1 对象

对象是我们方案埋点管理和开发的基本单位，给一个**UIView**设置 _**\_oid**_（对象Id: Object Id），该view就是一个对象; 对象分为两大类，_**page**_ & _**element**_;

![对象&参数](/images/jueJin/b8db1064a792e4e.png)

*   page对象: 比如 UIViewController.view, WebView, 或者一个半屏浮层的view，再或者一个业务弹窗
*   element对象: 比如 UIButton, UICollectionViewCell, 或者一个自定义view
*   对象参数: 对象是埋点具体信息的承载体，承载着对象维度的具体埋点参数
*   对象的复用: 对象的存在，其中一个很大的原因，就是需要做复用，对于一些通用UI组件，尤为合适

### 4.2 虚拟树(VTree)

对象不是孤立存在的，而是以\*\*虚拟树(VTree)\*\*的方式组合在一起的, 下面是一个示例:

![虚拟树 VTree](/images/jueJin/9598aa9e544f193.png)

虚拟树VTree有如下特点:

*   View树子集: 原始view树层级很复杂，被标识成对象的称为节点，所有节点就组合成了VTree，是原始view树的子集
*   上下文: 虚拟树中的对象，是存在上下关系的，一个节点的所有祖先节点，就是该对象(节点)的上下文
*   对象参数: 有了节点的上下层级，不同维度的对象，只关心自己维度的参数，比如歌单详情页中歌曲cell不关心页面请求级别的歌单id
*   SPM: 节点及其所有祖先结点的oid组成了SPM值（其实还有position参数的参与，稍后再详解），该SPM可以唯一定位该节点
*   持续生成: VTree是源源不断的构建的，每一个view发生了变化，View的添加/删除/层级变化/位移/大小变动/hidden/alpha，等等，都会引起重新构建一颗新的VTree

五、埋点的产生
-------

上面的方案介绍完之后，你一定存在很多疑惑，有了对象，有了虚拟树，对象有了参数，埋点在哪儿？

### 5.1 先来看下埋点格式

一个埋点除了有事件类型(action), 埋点时间等一些基本信息之外，还得有业务埋点参数，以及能体现出对象上下级的结构

先来看下一个普通埋点的格式:

```json
    {
        "_elist": [
            {
            "_oid": "【必选】元素的oid",
            "_pos": "【可选】，业务方配置的位置信息",
            "biz_param": "【按需】业务参数"
        }
        ],
            "_plist": [
                {
                "_oid": "【必选】page的oid",
                "_pos": "【可选】，业务方配置的位置信息",
                "_pgstep": "【必选】, 该page/子page曝光时的页面深度"
            }
            ],
            "_spm": "【必选】这里描述的是节点的“位置”信息，用来定位节点",
            "_scm": "【必选】这里描述的是节点的“内容”信息，用来描述节点的内容",
            "_sessid": "【必选】冷启动生成，会话id",
            "_eventcode": "【必选】事件: _ec/_ev/_ed/_pv/_pd",
            "_duration": "数字，毫秒单位"
        }
```

1.  \_eventcode: 埋点的类型，比如元素点击(\_ec), 元素曝光开始(\_ev), 元素曝光结束(\_ed), 页面曝光开始(\_pv), 页面曝光结束(\_pd) 等等
2.  \_elist: 从当前元素节点开始，向上所有元素节点的集合，是一个数组，倒叙
3.  \_plist: 从当前节点开始，向上所有页面结点的即可，是一个数组，倒叙
4.  \_spm: 上面已经介绍(SPM)，可以唯一定位该坑位

> 从上面的数据结构可以看出，数据结构是结构化的，坑位不是独立的，存在层级关系的

### 5.2 点击事件

大部分的点击事件，都发生在如下四个场景上:

1.  UIView上添加的TapGesture单击手势
2.  UIControl的子类添加的TouchUpInside单击事件
3.  UITableViewCell的 didSelectedRowAtIndexPath 单击事件
4.  UICollectionViewCell的 didSelectedItemAtIndexPath 单击事件

对于上述四种场景，我们采用了AOP的方式来内部承接掉，这里简单说明下如何做的；

1.  UIView: 通过 Method Swizzling 方式来进行对关键方法进行hock，当需要给view添加TapGesture时，顺便添加一个我们自己的 TapGesture, 这样我们就可以在点击事件触发的时候增加点击埋点，关键方法如下:
    1.  initWithTarget:action:
    2.  addTarget:action:
    3.  removeTarget:action:

> 1.  对UIView点击事件的hock注意需要做到随着业务侧事件的增加/删除而一起增加/删除
> 2.  同时，我们做到了在 所有业务侧点击事件触发之前(pre) & 所有业务侧点击事件触发之后(after) 两个维度的hock

关键代码如下:

```objc
@interface UIViewEventTracingAOPTapGesHandler : NSObject
@property(nonatomic, assign) BOOL isPre;
- (void)view_action_gestureRecognizerEvent:(UITapGestureRecognizer *)gestureRecognizer;
@end

@implementation UIViewEventTracingAOPTapGesHandler
    - (void)view_action_gestureRecognizerEvent:(UITapGestureRecognizer *)gestureRecognizer {
if (![gestureRecognizer isKindOfClass:[UITapGestureRecognizer class]]
    || gestureRecognizer.ne_et_validTargetActions.count == 0) {
    return;
}
UIView *view = gestureRecognizer.view;

// for: pre
    if (self.isPre) {
    /// MARK: 这里是 Pre 代码位置
    return;
}

// for: after
/// MARK: 这里是 After 代码位置
}

@interface UITapGestureRecognizer (AOP)
@property(nonatomic, strong, setter=ne_et_setPreGesHandler:) UIViewEventTracingAOPTapGesHandler *ne_et_preGesHandler; /// MARK: Add Category Property
@property(nonatomic, strong, setter=ne_et_setAfterGesHandler:) UIViewEventTracingAOPTapGesHandler *ne_et_afterGesHandler; /// MARK: Add Category Property
@property(nonatomic, strong, readonly) NSMapTable<id, NSMutableSet<NSString *> *> *ne_et_validTargetActions; /// MARK: Add Category Property
@end

@implementation UITapGestureRecognizer (AOP)

    - (instancetype)ne_et_tap_initWithTarget:(id)target action:(SEL)action {
        if ([self _ne_et_needsAOP]) {
        [self _ne_et_initPreAndAfterGesHanderIfNeeded];
    }
    
        if (target && action) {
        UITapGestureRecognizer *ges = [self init];
        [self addTarget:target action:action];
        return ges;
    }
    
    return [self ne_et_tap_initWithTarget:target action:action];
}

    - (void)ne_et_tap_addTarget:(id)target action:(SEL)action {
    if (!target || !action
|| ![self _ne_et_needsAOP]
    || [[self.ne_et_validTargetActions objectForKey:target] containsObject:NSStringFromSelector(action)]) {
    [self ne_et_tap_addTarget:target action:action];
    return;
}

SEL handlerAction = @selector(view_action_gestureRecognizerEvent:);

// 1. pre
[self _ne_et_initPreAndAfterGesHanderIfNeeded];
if (self.ne_et_validTargetActions.count == 0) {   // 第一个 target+action 被添加的时候，才添加 pre
[self ne_et_tap_addTarget:self.ne_et_preGesHandler action:handlerAction];
}
[self ne_et_tap_removeTarget:self.ne_et_afterGesHandler action:handlerAction];  // 保障 after 是最后一个，所以先行尝试删除一次

// 2. original
[self ne_et_tap_addTarget:target action:action];
NSMutableSet *actions = [self.ne_et_validTargetActions objectForKey:target] ?: [NSMutableSet set];
[actions addObject:NSStringFromSelector(action)];
[self.ne_et_validTargetActions setObject:actions forKey:target];

// 3. after
[self ne_et_tap_addTarget:self.ne_et_afterGesHandler action:handlerAction];
}

    - (void)ne_et_tap_removeTarget:(id)target action:(SEL)action {
    [self ne_et_tap_removeTarget:target action:action];
    
    NSMutableSet *actions = [self.ne_et_validTargetActions objectForKey:target];
    [actions removeObject:NSStringFromSelector(action)];
        if (actions.count == 0) {
        [self.ne_et_validTargetActions removeObjectForKey:target];
    }
    
    if (self.ne_et_validTargetActions.count > 0) {    // 删除当前 target+action 之后，还有其他的，则不需做任何处理，否则清理掉 pre+after
    return;
}

SEL handlerAction = @selector(view_action_gestureRecognizerEvent:);
[self ne_et_tap_removeTarget:self.ne_et_preGesHandler action:handlerAction];
[self ne_et_tap_removeTarget:self.ne_et_afterGesHandler action:handlerAction];
}

    - (BOOL)_ne_et_needsAOP {
    return self.numberOfTapsRequired == 1 && self.numberOfTouchesRequired == 1;
}

    - (void)_ne_et_initPreAndAfterGesHanderIfNeeded {
        if (!self.ne_et_preGesHandler) {
        UIViewEventTracingAOPTapGesHandler *preGesHandler = [[UIViewEventTracingAOPTapGesHandler alloc] init];
        preGesHandler.isPre = YES;
        self.ne_et_preGesHandler = preGesHandler;
    }
        if (!self.ne_et_afterGesHandler) {
        self.ne_et_afterGesHandler = [[UIViewEventTracingAOPTapGesHandler alloc] init];
    }
}
@end
```

2.  UIControl: 通过 Method Swizzling 方式对关键方法进行hock，关键方法: sendAction:to:forEvent:

> 对UIcontrol点击事件的hock需要注意业务侧添加了多个 Target-Action 事件，不能埋点埋了多次 同样，也支持 pre & after 两个维度的hock

关键代码如下:

```objc
@interface UIControl (AOP)
@property(nonatomic, copy, readonly) NSMutableArray *ne_et_lastClickActions; /// MARK: Add Category Property
@end
@implementation UIControl (AOP)
    - (void)ne_et_Control_sendAction:(SEL)action to:(id)target forEvent:(UIEvent *)event {
    NSString *selStr = NSStringFromSelector(action);
    NSMutableArray<NSString *> *actions = @[].mutableCopy;
        [self.allTargets enumerateObjectsUsingBlock:^(id  _Nonnull obj, BOOL * _Nonnull stop) {
        NSArray<NSString *> *actionsForTarget = [self actionsForTarget:obj forControlEvent:UIControlEventTouchUpInside];
            if (actionsForTarget.count) {
            [actions addObjectsFromArray:actionsForTarget];
        }
        }];
        BOOL valid = [actions containsObject:selStr];
            if (!valid) {
            [self ne_et_Control_sendAction:action to:target forEvent:event];
            return;
        }
        
        // pre
            if ([self.ne_et_lastClickActions count] == 0) {
            /// MAKR: 这里是 Pre 代码位置
        }
        [self.ne_et_lastClickActions addObject:[NSString stringWithFormat:@"%@-%@", [target class], NSStringFromSelector(action)]];
        
        // original
        [self ne_et_Control_sendAction:action to:target forEvent:event];
        
        // after
            if (self.ne_et_lastClickActions.count == actions.count) {
            /// MARK: 这里是 After 代码位置
            [self.ne_et_lastClickActions removeAllObjects];
        }
    }
    @end
```

3.  UITableViewCell: 先对 setDelegate: 进行hock，然后以 NSProxy 的形式将 Original Delegate 进行 _**封装**_，组成 Delegate Chain 的形式，然后在 DelegateProxy 内部做消息分发，从而可以完全掌控点击事件

> 1.  该 Delegate Chain 的方式可以hock的不支持 点击事件，可以hock所有 Delegate 的方法
> 2.  同样，也支持 pre & after 两个维度的hock
> 3.  特别注意: 需要做到真正的 DelegateChain，不然会跟不少三方库冲突，比如 RXSwift,RAC,BlocksKit,IGListKit等

关键示例代码几个重要的相关方法 (代码较多不再展示，三方有多个库均可以借鉴):

```objc
- (id)forwardingTargetForSelector:(SEL)selector;
- (NSMethodSignature *)methodSignatureForSelector:(SEL)selector;
- (void)forwardInvocation:(NSInvocation *)invocation;
- (BOOL)respondsToSelector:(SEL)selector;
- (BOOL)conformsToProtocol:(Protocol *)aProtocol;
```

### 5.3 曝光埋点

曝光埋点在传统埋点场景下是最棘手的，很难做到**高精度**埋点，埋点时机总是穷举不完，即使有了完善的规范，开发人员还总是会遗漏场景

我们这里的方案让开发者完全忽略曝光埋点的时机，开发者只把精力放在构建对象（或者说构建VTree），以及给对象添加参数上，下面看下是如何基于VTree做曝光的:

1.  持续构建VTree: 前面提到，VTree是源源不断的构建的，每一个view发生了变化，View的添加/删除/层级变化/位移/大小变动/hidden/alpha，等等（这里均是AOP方式hock），都会引起重新构建一颗新的VTree
2.  VTree Diff: 先后两个VTree的diff，就是我们曝光埋点的结果

随着时间，会源源不断的生成新的VTree: ![远远不断地生成VTree](/images/jueJin/e572364111a29bd.png)

比如T1时刻生成的VTree: ![T1时刻的VTree](/images/jueJin/397e18bf0eaa8e2.png)

T2时刻生成的VTree: ![T2时刻的VTree](/images/jueJin/dc3254df83529e0.png)

先后两颗VTree的diff:

*   T1存在T2不存在的节点: 3, 4, 6, 7, 8, 11
*   T1不存在T2存在的节点: 20, 21, 22, 23

上面的diff结果，就是曝光埋点的结论

*   曝光结束: 3, 4, 6, 7, 8, 11
*   曝光开始: 20, 21, 22, 23

从上面以及VTree Diff的曝光策略，得出如下:

> 1.  这种策略，完全抹平了列表和非列表
> 2.  曝光时机问题，转而变成了何时构建VTree问题上
> 3.  资源是否曝光的问题, 转而变成了VTree中节点的可见性问题上

### 5.4 埋点开发步骤

  基于VTree的埋点，不管是点击、滑动等事件埋点，还是元素、页面的曝光埋点，转化成了如下两个开发步骤:

1.  给View设置oid => 成为对象 (构建VTree)

![第一步: 给View设置oid](/images/jueJin/6c42c62c4a88250.png)

2.  给对象设置埋点参数

![第二步: 给对象设置埋点参数](/images/jueJin/3fea2451bd0c603.png)

六、VTree的构建
----------

### 6.1 VTree构建过程

  构建一个VTree，是需要遍历原始view树的，构建过程中有如下特点:

1.  一个节点是否可见，跟 view 的 hidden, alpha 有关，并且必须添加到window上
2.  子节点的可见区域小于等于父节点的可见区域
3.  节点的可见区域，可以自定义的 _**扩大**_ 或者 _**缩小**_, 就像 UIButton 的 contentEdgeInsets 那样

![修改可见区域](/images/jueJin/412a6bfde0ff8dd.png)

4.  节点是可以被遮挡的: 一个page节点可以遮挡父节点名下添加顺序早于自己的其他节点

![被遮挡了](/images/jueJin/b828c2890689138.png)

从虚拟树上来看，被遮挡的结果: ![从虚拟树上来看，被遮挡的结果](/images/jueJin/67010fafbfd62ac.png)

5.  可打破原有view层级关系: 可以手工干预上下层级关系，以做到逻辑挂载的能力
    
    > 事实上，目前提供了三种逻辑挂载能力，这里简单提下，不做详细展开
    > 
    > 1.  手动逻辑挂载: 指定将 A 挂载到 B 名下
    > 2.  自动逻辑挂载: 将 A 挂载到当前 rootPage（当前VTree最下层最右侧的page节点） 名下
    > 3.  spm形式逻辑挂载: 指定将 A 挂载到 `spm` 名下（对于解耦特别有用）
    
6.  虚拟父节点: 可以给多个节点虚拟出一个父节点，对于双端UI差异时，但是要求同一套埋点结构时，很有用

一个常见的例子，拿云音乐首页列表举例子，每一个模块的title和资源容器(内部可横向滑动)，分别是一个cell；图中的浅红色(模块)其实没有一个UIView与之对应，业务侧埋点需要我们提供 **模块** 维度的曝光数据（但是Android开发过程中，通常都有UI与之对应） ![虚拟父节点](/images/jueJin/a789cf6bb526ad7.png)

精细化埋点：

> 1.  自定义可见区域 & 遮挡 & 节点的递归可见性 结合起来，可以做到精细化埋点效果
> 2.  针对 tabbar, navbar, 再或者云音乐app底部的mini播放条等场景引起的列表cell是否曝光的问题，可做到精细化控制
> 3.  以及配合遮挡能力，真正做到了节点所见及曝光，不可见即曝光结束的效果

### 6.2 构建过程的性能考虑

view的任何变化，都会引起VTree构建，看上去这是一件很恐怖的事情，因为每一次构建VTree都需要遍历整颗原始view树，我们做了如下优化来保障性能:

1.  主线程runloop空闲的时候构建VTree（而且需要该runloop已经运行的时间，小于等于16.7ms/3，这是拿固定帧率60帧举例）
2.  runloop构建限流器

![主线程runloop](/images/jueJin/ef8e299c6754c60.png)

关键代码如下:

```objc
/// MARK: 添加最小时长限流器
_throtte = [[NEEventTracingTraversalRunnerDurationThrottle alloc] init];
/// 至少间隔 0.1s 才做一次
_throtte.tolerentDuration = 0.1f;
_throtte.callback = self;

/// MAKR: runloop observer
CFRunLoopObserverContext context = {0, (__bridge void *) self, NULL, NULL, NULL};
const CFIndex CFIndexMax = LONG_MAX;
_runloopObserver = CFRunLoopObserverCreate(kCFAllocatorDefault, kCFRunLoopAllActivities, YES, CFIndexMax, &ETRunloopObserverCallback, &context);

/// MAKR: Observer Func
    void ETRunloopObserverCallback(CFRunLoopObserverRef observer, CFRunLoopActivity activity, void *info) {
    NEEventTracingTraversalRunner *runner = (__bridge NEEventTracingTraversalRunner *)info;
        switch (activity) {
        case kCFRunLoopEntry:
        [runner _runloopDidEntry];
        break;
        
        case kCFRunLoopBeforeWaiting:
        [runner.throtte pushValue:nil];
        break;
        
        case kCFRunLoopAfterWaiting:
        [runner _runloopDidEntry];
        break;
        
        default:
        break;
    }
}

    - (void)_runloopDidEntry {
    _currentLoopEntryTime = CACurrentMediaTime() * 1000.f;
}

    - (void)_needRunTask {
    CFTimeInterval now = CACurrentMediaTime() * 1000.f;
    
    // 如果本次主线程的runloop已经使用了了超过 16.7/2.f 毫秒，则本次runloop不再遍历，放在下个runloop的beforWaiting中
    // 按照目前手机一秒60帧的场景，一帧需要1/60也就是16.7ms的时间来执行代码，主线程不能被卡住超过16.7ms
    // 特别是针对 iOS 15 之后，iPhone 13 Pro Max 帧率可以设置到 120hz
    static CFTimeInterval frameMaxAvaibleTime = 0.f;
    static dispatch_once_t onceToken;
        dispatch_once(&onceToken, ^{
        NSInteger maximumFramesPerSecond = 60;
            if (@available(iOS 10.3, *)) {
            maximumFramesPerSecond = [UIScreen mainScreen].maximumFramesPerSecond;
        }
        frameMaxAvaibleTime = 1.f / maximumFramesPerSecond * 1000.f / 3.f;
        });
        
            if (now - _currentLoopEntryTime > frameMaxAvaibleTime) {
            return;
        }
        
        BOOL runModeMatched = [[NSRunLoop mainRunLoop].currentMode isEqualToString:(NSString *) self.currentRunMode];
        
        /// MARK: 这里回调，开始构建 VTree
    }
    
```

3.  列表滑动中局部虚拟树VTree

> 1.  局部构建VTree，可以大大减少构建一次VTree的工作量
> 2.  局部构建的前提时，距离上次构建虚拟树，发生变动的view都是ScrollView或者是ScrollView的子view

4.  列表滑动中限流器

![滚动中构建VTree](/images/jueJin/6cadf2c42cf1026.png)

### 6.3 性能相关数据

1.  适当的曝光延后，满足数据要求，比如延迟1、2帧（取决于手机的性能以及当前CPU的工作量）
2.  runloop最小时长限流器的作用，还保障了延后不会太大，目前使用的0.1s
3.  用iPhone12手机，以云音乐首页复杂场景举例子，不停地上下滑动，全量/局部构建VTree分别大概需要3-8ms/1-2ms的样子，CPU占用2-3%左右（云音乐原来的列表曝光组件占用10%左右的CPU）
4.  不会因为SDK的存在，引起明显的主线程卡顿或者手机发烫

七、链路追踪
------

这个是SDK的重中之重的功能，目标是将app产生的所有埋点**链**起来，以协助数据侧统一一套模型即可分析漏斗/归因数据

### 7.1 链路追踪 refer 的含义

refer是一段格式化的字符串，可以通过该字符串，在整个数仓中唯一定位到一个埋点，这就是链路追踪

### 7.2 如何定义一个埋点

1.  \_sessid: 每次app冷启动时生成，格式: `[timestap]#[rand]#[appver]#[buildver]`
2.  \_pgstep: 该app启动范围内，每一个page曝光，`_pgstep` +1
3.  \_actseq: 该 `rootPage` 曝光周期内，每一次 `交互` 事件(\_pv也算一次事件)，`_actseq` +1

> 通过上述三个参数，即可定位某一次app启动 & 一次页面曝光 周期内，哪一次的 `交互` 事件

### 7.3 先来看看如何认识一个埋点坑位

1.  \_spm: 埋点的坑位信息，该字符串描述该坑位是什么
2.  \_scm: 埋点坑位的内容信息，该字符串描述该资源的内容是什么
    1.  格式: `[cid:ctype:ctraceid:ctrp]`
    2.  cid: content id, 该资源的唯一id
    3.  ctype: content type, 该资源的类型
    4.  ctraceid: content traceid, 接口达到网关时生成，服务端/算法/推荐使用该字符串做数据逻辑，在后续埋点时关联起来，用来联合分析推荐/算法的效果
    5.  ctrp: 透传的扩展字段，用来在资源维度透传服务端/算法/推荐的自定义参数

### 7.3 refer格式解析

> 格式: `[_dkey:${keys}][F:${option}][sessid][e/p/xxx][_actseq][_pgstep][spm][scm]`

1.  option: 是一个`位`运算的值，用以描述该refer字符串包含什么内容
2.  \_dkey: 是对option的字符串形式，可读性强（目前仅开发期间才有，方便人工识别）

![option解析](/images/jueJin/9666b1352f8f5c4.png)

3.  undefine-xpath: 用以标识该refer指向的内容是被 `降级` 了的，随着埋点覆盖越来越全，有该标识的refer会越来越少

### 7.4 refer的使用

先举一个典型的使用场景

![歌曲播放-refer](/images/jueJin/5a17b2db3834221.png)

过程解读:

1.  点击歌曲cell，触发了歌曲播放列表的更新，这些歌曲的播放归因(`_addrefer`)，就归结到该cell的点击埋点
2.  同时又跳转了歌曲播放页，该歌曲播放的归因(`_pgrefer`)，也归结到了该cell的点击

refer的查找：

1.  自动向前查找: 这是绝大部分使用的策略，自动向前在refer队列中找到合适的refer
2.  undefine-xpath降级: 如果找到的refer生成的时间，早于最后一次AOP捕获到的`点击事件`时间，则表明该位置没有埋点，说明refer不可信，则被降级到最后一次 `rootPage曝光` 所对应的refer上
3.  精确refer查找: 也有多个策略的精确refer查找机制，不过使用起来不方便，没有被大范围使用

### 7.5 refer的统一解析

根据上面refer的格式，数仓侧梳理出refer的格式统一解析，配合埋点管理平台，让规范化的漏斗/归因分析变为可能

### 7.6 其他refer使用场景

1.  multirefers: 在实时分析场景，对一些关键埋点，带上了五级(甚至更多级)的refer数组，直接描述该操作的前五步做了什么（实时分析要求高，不能做离线数据关联）
2.  \_hsrefer: 一键归因，可以一次性归因到该消费操作来源于app级别的哪个场景，比如首页、搜索页、我的页面等
3.  \_rqrefer: 让客户端埋点跟服务端埋点桥接了起来

### 7.7 refer对开发人员透明

1.  refer的复杂性: refer的复杂度很高，真实的refer处理比上述描述的还要复杂很多，对于普通客户端开发人员，想要完整理解，成本过于高
2.  开发时透明: 对于开发人员来说，就是在对应的节点上增加相应的参数即可

> 对象维度的三个标准私参(组成了\_scm): cid, ctype, ctraceid, ctrp

3.  可平台校验: 对象的事件是否参与链路追踪, 参数完整性，等等，都可以在平台做合法性校验，进一步保障了refer的正确性

八、H5、RN
-------

*   RN: 做了一层桥接，可以在RN维度给view设置节点，同时设置参数

![RN桥接](/images/jueJin/c4b54a23a1782e6.png)

*   站内H5: 采用了半白盒方案，H5内部局部虚拟树，所有埋点通过客户端SDK产生，H5埋点到达SDK后，在native侧做虚拟树融合，从而将站内H5跟native无缝地衔接了起来

![H5半白盒方案](/images/jueJin/fa4120276f6b800.png)

九、可视化工具
-------

客户端上传统的埋点都是看不见摸不着的，基于VTree的方案是结构化的，可以做到可视化查看埋点的数据，以及如何埋点的，下面是几个工具的截图

![可视化工具-埋点层级结构](/images/jueJin/fa923d5ff547696.png) ![可视化工具-埋点数据](/images/jueJin/6447c8f35f81cc4.png)

十、埋点校验&稽查
---------

*   埋点是结构化的，虚拟树是在埋点平台管理起来的，埋点的校验，可以做到精确校验，校验出客户端的埋点虚拟树是否正确
*   以及每一个对象上埋点的参数是否正确

稽查:

*   在测试包、灰度包中，对产生的所有埋点在平台侧做稽查，并输出稽查报告，在版本发布前，对有问题的埋点问题进行及时的修复，避免上线带来数据问题

十一、落地
-----

该全链路埋点方案，已经全面在云音乐各个app铺开，并且P0场景已经完成数据侧切割，得到了充分的验证。

十二、未来规划
-------

基于VTree可以做非常多的事情，比如:

1.  自动化测试: 关键点是对view做标识，同时可以使用该标识查询到该view（基于VTree的UI自动化测试，已经落地，后面考虑再单独跟大家聊）
2.  页面标识: 跨端的统一页面标识能力，用来做各种维度的场景标识
3.  基于VTree的数据可视化能力: 可以在手机上看整个app级别的数据趋势
4.  站内H5的可视化埋点: 进一步降低H5场景的埋点工作量
5.  refer能力的自动校验和数据稽查: refer能力很强，但是出了问题后排查问题，有了相关工具来配合，会让本来对开发人员透明的refer能力也能轻松排查

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！