---
author: "网易云音乐技术团队"
title: "云音乐RN新架构升级之iOS灰度方案"
date: 2024-01-31
description: "本文主要围绕云音乐iOS侧升级新版本RN时用到的灰度方案进行阐述。云音乐有 100+ 业务模块使用 RN 开发，占据了 30%+ 的业务模块，所以升级的新版本RN稳定性对我们来讲尤其重要。"
tags: ["前端","iOS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读12分钟"
weight: 1
selfDefined:"likes:20,comments:8,collects:34,views:8089,"
---
![](/images/jueJin/12352d31409d4c2.png)

> 本文作者：[张义](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdorentus "https://github.com/dorentus")、[谢富贵](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FGeniusBrother "https://github.com/GeniusBrother")

本文主要围绕云音乐iOS侧升级新版本RN时用到的灰度方案进行阐述。云音乐有 100+ 业务模块使用 RN 开发，占据了 30%+ 的业务模块，所以升级的新版本RN稳定性对我们来讲尤其重要。除此之外，iOS TestFlight 已经无法通过删除邮箱来实现无限分发。因此必须要有一个灰度方案来实现渐进式升级，直到稳定性以及各项指标数据打平后才能全量升级。

背景
==

文章《网易云音乐 RN 新架构升级实践》总体介绍了云音乐在升级 RN 过程中遇到的问题以及解决方案，本文主要围绕前文介绍到的 iOS 侧灰度方案进行阐述。由于云音乐已经有 `100+` 业务模块使用 RN 开发，占据了 `30%+` 的业务模块，所以升级后的 0.70 版本 RN的稳定性对我们来讲尤其重要。除此之外，iOS TestFlight 已经无法通过删除邮箱来实现无限分发。因此必须要有一个业务无感知的灰度方案来实现**渐进式升级**，直到稳定性以及各项指标数据打平后才能全量升级。

思路和挑战
=====

实现渐进式的升级，势必就要引入两个版本的 RN 代码，然后通过AB实验进行放量控制，默认C组使用老版本代码，T组使用新版本代码。让不同版本的代码共存通常有两种方案：

**方案一：静态链接，修改符号名**

静态链接在编译时将所有的程序模块和库文件合并成一个单独的可执行文件，这个过程中不允许出现重复的符号，否则就无法完成符号的重定位导致链接失败。

解决符号冲突最简单的办法就是修改符号名，但是这不仅要修改定义符号的源文件，而且所有引用到相关符号的源文件同样要做修改，该方式极其繁琐。对于 RN 这种庞大的工程来讲，如果人工手动更改的话，显然是要耗费极大的人力和精力并且也无法保证准确性。即便写脚本用自动化的方式进行替换也难以覆盖所有的符号，因为有宏定义、动态调用等各种写法的存在，难免会导致疏漏，再者编写脚本的工作量也不小。

**方案二：动态链接**

动态链接则与静态链接相反是在运行时加载库文件进行链接，iOS 中 `NSBundle` 模块提供了 `loadAndReturnError:` 方法来支持动态的加载指定动态库的能力。因此将 RN 新老版本代码打成 2 个动态库后我们就可以解决了不同版本代码共存问题。

除此之外，由于业务层有很多地方引用了 RN 中的符号，延迟动态加载 RN 后会导致静态链接过程找不到符号而编译失败。所以我们必须还得解决**静态链接过程中符号引用问题**才能让双动态库方案完美落地。

我们的方案
=====

在计算机领域有一句神圣的哲言「计算机科学领域的任何问题都可以通过增加一个间接的**中间层**来解决」, 从内存管理、网络模型、并发调度甚至是软硬件架构，都能看到这句哲言在闪烁着光芒，而我们的双动态库方案也是这一哲言的完美实践之一。整体方案设计如下图所示:

![整体架构图](/images/jueJin/c3fddad0863046c.png)

1.  将原先的React定义文件全部剥离，只剩下头文件给业务库依赖，确保编译过程中预处理阶段不会报错。
2.  `NEReactNative` 是我们引入的中间层，在这个库中定义了被业务层引用的 RN 符号(下文都以 RN 占位符号代指)，确保静态链接阶段能找到相应的符号。除此之外该库是以插件的形式引入，业务层不感知。
3.  真实 RN 的符号是运行时动态引入的，根据 AB 决定是加载新版本还是老版本。
4.  完成动态库加载后还需要将占位符号与真实符号绑定起来。下文将针对符号绑定进行详细叙述

符号获取
----

我们在打新老版本的 RN 动态库时加入一份统一的工具类去收集业务层用到的全局变量/函数地址以及下文的类符号地址。具体示例如下:

```objc
@interface NEReactNativeDynamicFramework : NSObject
// 获取类符号地址
+ (Class _Nullable)getClass:(NSString *)name;

// 获取全局符号地址
+ (void * _Nullable)getSymbol:(NSString *)name;
@end


@implementation NEReactNativeDynamicFramework
static NSMutableDictionary<NSString *, NSValue *> *symbols;
static NSMutableDictionary<NSString *, NSValue *> *classes;

+ (void)prepare
    {
    static dispatch_once_t onceToken;
        dispatch_once(&onceToken, ^{
        symbols = [NSMutableDictionary dictionary];
        classes = [NSMutableDictionary dictionary];
        
        // TODO：获取符号地址，具体内容见下方
        });
    }
    
    + (Class _Nullable)getClass:(NSString *)name
        {
        [self prepare];
        return (__bridge Class)[classes[name] pointerValue];
    }
    
    + (void * _Nullable)getSymbol:(NSString *)name
        {
        [self prepare];
        return [symbols[name] pointerValue];
    }
    
    @end
```

对于全局变量/函数我们可以用 `extern` 符号声明的方式来获取地址，在链接阶段编译器会自动将同名符号绑定到统一的地址。

```objc
// 宏定义胶水代码
#define INCLUDE_SYMBOL(NAME) \
do { \
__attribute__((visibility("hidden"))) extern void NAME; \
symbols[@(#NAME)] = [NSValue valueWithPointer:&NAME]; \
} while (0)

// 获取实际全局变量地址
INCLUDE_SYMBOL(RCTJavaScriptDidLoadNotification);

// 获取实际全局函数地址
INCLUDE_SYMBOL(RCTBridgeModuleNameForClass);
```

细心的读者可能会发现，我们在用 `extern` 声明符号时统一用了 `void` 类型，但是 RN 并不是所有的全局符号都是 `void` 类型，比如示例中的 `RCTJavaScriptDidLoadNotification` 和 `RCTBridgeModuleNameForClass`。能够这么写得益于编译器的**强弱符号**选择策略：出现同名符号时会优先选择强符号。如示列中 `extern void RCTJavaScriptDidLoadNotification;` 声明的是弱符号，而实际定义`NSString *const RCTJavaScriptDidLoadNotification = @"RCTJavaScriptDidLoadNotification";` 为强符号。所以出现 `RCTJavaScriptDidLoadNotification` 符号的地方都会使用强符号所对应的地址进行重定位。

对于类符号地址的获取会稍微复杂点，我们使用了 `asm` 汇编指令进行符号重命名，示列如下:

```objc
/**********定义胶水代码**********/
#define PASTE_HELPER(A, B) A ## B
#define PASTE(A, B) PASTE_HELPER(A, B)

#define INCLUDE_CLASS_HELPER(NAME, SYM, SYM_NAME) \
do { \
__attribute__((visibility("hidden"))) extern void PASTE(v, __LINE__) asm(SYM); NSValue *value = [NSValue valueWithPointer:&PASTE(v, __LINE__)]; \
classes[@(NAME)] = value; \
symbols[@(SYM_NAME)] = value; \
} while (0)

#define STRINGIFY_HELPER(X) #X
#define STRINGIFY(X) STRINGIFY_HELPER(X)

#define INCLUDE_CLASS(NAME) \
INCLUDE_CLASS_HELPER(STRINGIFY(NAME), STRINGIFY(PASTE(_OBJC_CLASS_$_, NAME)), STRINGIFY(PASTE(OBJC_CLASS_$_, NAME)))
/**********定义胶水代码**********/

// 获取实例类符号地址
INCLUDE_CLASS(RCTBridge);

```

关于 `asm` 指令详细介绍可以参考 gcc 里面的一篇[文档](https://link.juejin.cn?target=https%3A%2F%2Fgcc.gnu.org%2Fonlinedocs%2Fgcc-4.4.0%2Fgcc%2FAsm-Labels.html%23Asm-Labels "https://gcc.gnu.org/onlinedocs/gcc-4.4.0/gcc/Asm-Labels.html#Asm-Labels")介绍。上述代码核心语句是 `extern void PASTE(v, __LINE__) asm(SYM);`, 先是动态声明了一个变量符号然后使用 `asm` 进行符号重写，所以我们通过获取该变量符号的地址就能拿到类符号地址。

全局变量/符号内容替换
-----------

在获取了全局函数/变量符号地址后，我们需要将占位符号的内容进行替换从而实现与真实符号的绑定。全局变量内容替换示列如下:

```objc
// 定义胶水代码
#define NE_VAR_SYMBOL_DECLARE(NAME) \
extern void * NAME; \
void * NAME;

#define NE_VAR_SYMBOL_LOAD(NAME) \
NAME = *(void **)[NEReactNativeDynamicFramework getSymbol:@(#NAME)];

// 定义全局变量占位符号
NE_VAR_SYMBOL_DECLARE(RCTJavaScriptDidLoadNotification)
@implementation NEReactNativeGlobalSymbolLoader (variables)

+ (void)loadGlobalVariables
    {
    // 对占位符号进行内容替换
    NE_VAR_SYMBOL_LOAD(RCTJavaScriptDidLoadNotification)
}

@end
```

对于全局函数则可以使用汇编指令 `JMP` 进行跳转执行，在 ARM64 架构下对应的指令为 `BR`，具体示列如下：

```objc
// 定义胶水代码
#if __x86_64__
#define _JMP_TO(PTR) __asm__ volatile("JMP *%0" : : "r"(PTR));
#elif __arm64__
#define _JMP_TO(PTR) __asm__ volatile("BR %0" : : "r"(PTR));
#endif

#define NE_FUN_SYMBOL_DECLARE(NAME) \
static void *SYM_ ## NAME = NULL; \
FOUNDATION_EXPORT void NAME(void); \
__attribute__((naked)) \
void NAME(void) { \
_JMP_TO(SYM_ ## NAME); \
}

#define NE_FUN_SYMBOL_LOAD(NAME) \
SYM_ ## NAME = [NEReactNativeDynamicFramework getSymbol:@(#NAME)];

// 定义全局函数占位符号
NE_FUN_SYMBOL_DECLARE(RCTBridgeModuleNameForClass)
@implementation NEReactNativeGlobalSymbolLoader (functions)

+ (void)loadGlobalFunctions
    {
    // 获取真实全局函数符号地址
    NE_FUN_SYMBOL_LOAD(RCTBridgeModuleNameForClass)
}

@end
```

类符号绑定
-----

对 Objective-C 的类的处理采用了类似的思路，先是定义了一个占位符类，然后在运行时动态替换成真实的类。具体可以分为以下几种情况：

1.  对于类方法，直接使用方法转发，把占位符类的方法转发到真实类的方法上。
2.  对于没有子类的类，覆盖 `+alloc`、`-init`、`+new` 等方法，在调用时直接创建真实类的对象返回。
3.  由于 Category 方法会被加到占位符类上，而实际执行过程中由于步骤 2 的存在，拿到的可能是真实类的对象，这里需要把这些 Category 方法手动添加到真实类上。
4.  有些地方可能会在运行时去检查类或者对象是否实现了某些 Protocol，这里就需要把真实类的 Protocol 列表添加到占位符类上。
5.  对于有子类的类，会更复杂一些。我们的目标是非侵入式的，所以不会去修改子类的实现；上面的步骤可以覆盖非使用子类对象之外的场景，对于创建并使用子类对象的情况，需要额外的处理，下面详细分析一下。

以一个组件为例：

```objc
@interface MyViewManager : RCTViewManager <RCTUIManagerObserver>

@property (nonatomic, strong) NSString *myProperty;

@end

@implementation MyViewManager

- (void)setBridge:(RCTBridge *)bridge
    {
    [super setBridge:bridge];
    [self.bridge.uiManager.observerCoordinator addObserver:self];
}

- (void)invalidate
    {
    [self.bridge.uiManager.observerCoordinator removeObserver:self];
}

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(myProperty, NSString)

- (UIView *)view
    {
    return [[MyView alloc] init];
}

// ...

#pragma mark - RCTUIManagerObserver

- (void)uiManagerDidPerformMounting:(__unused RCTUIManager *)manager
    {
    // ...
}

@end
```

上面的代码覆盖了常见的使用情况：

1.  子类可以新增属性和方法，甚至可以覆盖基类的方法。
2.  子类的方法中可以使用`super`关键字调用基类的方法。
3.  调用方在拿到子类的对象调用方法时，如果子类没有实现该方法，会去基类中查找。

在我们的方案中，子类继承的是占位符类，需要在运行时提供机制能满足上面的要求。

这里我们的方案同样是在`+alloc`、`-init`、`+new` 等方法中，添加逻辑，判断到正在创建子类对象时，动态为当前子类创建一个继承自真实类的代理子类，然后创建这个代理子类的对象，保存为属性，返回正常的子类(继承自占位符类)对象。

调用方在调用这个对象的方法时，对于子类实现或者覆盖的方法，直接调用到子类的实现；对于未实现的方法，使用方法转发，转发到代理子类的对象上，这样就能正确调用到基类的实现。

对于子类方法中使用`super`调用基类方法的情形，由于子类继承的是占位符类，所以`super`调用的是占位符类的方法，通过方法转发，同样可以正确调用到基类的实现。

需要注意的是，存在子类覆盖或者重写了基类的方法、但是在基类中被调用的情况，这时根据上面消息转发的机制，按照如下的继承结构：

![子类展示初版](/images/jueJin/50dbaefd9981414.png)

外界拿到子类的对象调用`-methodB`时，会通过方法转发，通过`brokerObject` ⟹ `BrokerSubClass` ⇾ `RealClass` ⟹ `-methodB`的链路，调用到`RealClass`的`-methodB`方法，

我们期望`-methodB`里面调用`-methodA`时，能调用到我们子类自己写的`-methodA`方法，而不是`RealClass`的`-methodA`方法。 这就需要我们对上面的结构做一些修改，在`BrokerSubClass`中添加`-methodA`，实现为转发到`SubClass`的`-methodA`（为此还需要反向关联`SubClass`的对象到`brokerObject`），这样一来，`brokerObject`在调用`-methodB`(里面调用`-methodA`)时，会因为自身实现了`-methodA`而不再走到基类的同名方法中。从而达到我们的目的。

![子类展示终版](/images/jueJin/a3a33e2315e34b5.png)

实施过程中遇到的问题
==========

上面的方案覆盖了大部分的使用场景，但是在实施过程中还是发现了一些遗漏点，下面逐一介绍。

使用方直接访问实例变量的情况
--------------

系统在`UIView`的`-addSubview:`等方法中，会直接访问作为传入参数的`UIView`对象的某些实例变量，这种情况是我们上面的方法转发方法所不能覆盖的。 类似的，ReactNative中的`RCTShadowView`的`insertReactSubview:atIndex:`等方法也会直接访问传入参数的实例变量。

对于这种情况，我们 swizzle 了这些方法，把传入的对象替换成真实类的对象，这样就能正确访问到实例变量了。

ReactNative 不同版本 API 的差异问题
--------------------------

比如新版 RN 提供了 `RCTPLLabelForTag` 函数，而旧版本没有提供，我们的方案对于这种情况，会统一提供桥接的 `RCTPLLabelForTag` 函数，在切换到新版本 RN 时 `JMP` 到新版本的函数地址，而使用旧版本时函数未实现。 这就需要我们在使用这些函数的地方，提前对当前的 RN 版本做判断，确保只在新版本中使用新版本的 API。

在桥接函数的实现中也可以加上一些日志，方便我们在测试过程中发现这些问题。

小结
==

最终我们实现的中间层成功提供了业务方零感知的动态切换 RN 版本的能力，业务方的代码不需要做任何修改，通过配置就能实现 RN 版本的切换。

实际应用中，通过 AB 实验，我们在可控的范围内逐步放量，期间收集数据、反馈，发现并解决问题，最终实现了 0.70 版本 RN 的全量升级。

最后
==

![](/images/jueJin/e0785c31f57e463.png) 更多岗位，可进入网易招聘官网查看 [hr.163.com/](https://link.juejin.cn?target=https%3A%2F%2Fhr.163.com%2F "https://hr.163.com/")