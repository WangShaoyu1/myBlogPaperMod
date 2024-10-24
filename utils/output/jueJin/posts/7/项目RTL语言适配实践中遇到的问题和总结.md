---
author: ""
title: "项目RTL语言适配实践中遇到的问题和总结"
date: 2022-07-27
description: "当今大约有超过 22 个国家，66 亿人使用阿拉伯文字，使其成为仅次于拉丁文和中文的世界第三大书面语言。随着业务在海外扩展的逐渐深入，App 适配阿拉伯语已经提上了日程。"
tags: ["iOS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读12分钟"
weight: 1
selfDefined:"likes:35,comments:0,collects:44,views:5887,"
---
> 图片来自：[picography.co/ocean-splas…](https://link.juejin.cn?target=https%3A%2F%2Fpicography.co%2Focean-splash-wave%2F "https://picography.co/ocean-splash-wave/")  
> 本文作者：JDMin

开篇
==

当今大约有超过 22 个国家，6.6 亿人使用阿拉伯文字，使其成为仅次于拉丁文和中文的世界第三大书面语言。随着业务在海外扩展的逐渐深入，App 适配阿拉伯语已经提上了日程。与我们平时接触较多的中英文区别最明显的是，阿拉伯语的书写和使用习惯是从右到左的。尽管 iOS 本身已经有很多对于这种 RTL(Right-To-Left) 语言的处理，但是在我们开发的时候，需要注意使用正确的规范去避免错误。同时每个业务和 App 都有各自的一些特殊设计和其他特点，这些特点也会带来许多新的问题待解决。下面介绍下最近工程在适配RTL语言中遇到的问题和解决。

在介绍具体的各个问题场景前，我们先对 RTL 语言与工程适配相关的一些主要特点做下介绍：

*   文本。与中文、英文等 LTR(Left-To-Right) 语言最明显的不同是，RTL 语言在书写和阅读习惯上是从右到左的。
    
*   图标。图标要针对每个具体图标灵活处理。考虑到 RTL 语言的文案和使用习惯是从右到左，所以很多有明确方向性的图标需要改变下方向(举个例子来说，比如常用的箭头图标)。至于其他常规性图标，则在 UI 中保持不变。
    
*   数字。我们日常接触较多是阿拉伯数字，或者称作西阿拉伯数字。与之相对的，是东阿拉伯数字。不同的阿拉伯国家使用不同的阿拉伯数字，比如摩洛哥、阿尔及利亚常用西阿拉伯数字，而伊朗、阿富汗、巴基斯坦等国家则使用东阿拉伯数字。而像埃及、沙特阿拉伯等国家，则两种形式的阿拉伯数字都会使用。开发前需要确认清楚我们需要提供服务的地区使用的是哪种阿拉伯数字，并且正确的处理和展示。
    

工程现状和特点
=======

实际上，iOS 系统已经对RTL语言做了诸多处理，并且提供了许多 API 方便上层做业务适配。不过在讨论这些具体的问题之前，我们需要先了解当前工程的现状和特点，并依此来选择最合适的处理方案。总结来说，工程当前的几个特点：

1.  体量较大。工程发展到今天，代码量已经比较庞大。对于比较大的改动需要考虑改造成本，以及是不是会对将来业务扩展落下什么隐患。
2.  工程有大量的布局代码，特别是比较早期的业务的布局代码，是使用frame layout手动布局的方式处理，没有使用AutoLayout。
3.  App支持用户应用内设置语言。应用首次启动会选择用户的系统语言作为默认语言，同时支持用户在应用内切换语言。

至于布局方式、应用内设置语言对 RTL 适配的具体影响，我们在后文详细介绍。

遇到的问题
=====

应用内切换语言
-------

当我们在系统设置中将语言设置为阿拉伯语等 RTL 语言后，系统会自动将 App 的布局方式改为 RTL 布局。这里就会遇到第一个问题，我们 App 内可以设置语言，当应用设置语言和系统语言的布局方式不一致时(比如应用内设置成阿拉伯语，系统设置成英语)，我们希望以应用内语言为准。这个时候，就无法再使用系统的默认处理。在 iOS9 以后，iOS 为`UIView` 开放了一个新的`property` ，

```objc
@property (nonatomic) UISemanticContentAttribute semanticContentAttribute API_AVAILABLE(ios(9.0));
```

通过`semanticContentAttribute` 可以在由开发者自定义一个 view 在 RTL 和 RTL 布局下是否做翻转处理。我们需要根据应用内语言设置App里 View 的`semanticContentAttribute` ，避免使用系统的默认判断。这里对一个个 View 做改动显然过于麻烦， 我们的做法是在语言设置的时候，通过设置`UIView.appearance().semanticContentAttribute`根据对全局做处理。

```ini
    if isRTLLanguage {
    UIView.appearance().semanticContentAttribute = .forceRightToLeft
        } else {
        UIView.appearance().semanticContentAttribute = .forceLeftToRight
    }
```

对于有特殊适配场景的 View (在RTL模式下也不翻转)，可以在业务顶层自行设置相关 UI 元素实例的`semanticContentAttribute` 。

布局
--

现在我们常用的布局方式一般有2种。一种是使用 AutoLayout ，一种是frame layout的手动布局。我们逐个介绍。

对于 AutoLayout ，包括常用的三方封装库 Masonry 、SnapKit 等，对 RTL 都已经有比较好的兼容处理。在 RTL 和 LTR 中，Left 和 Right 对应的实际方向相同，布局不会有变化。因此，我们在设置约束的时候，需要使用具有通用意义的 Leading 和 Trailing 来替换以往常用的 Left 和 Right 。Leading 为前部约束，对应 LTR 中的 Left 和 RTL中的 Right。 Trailing 为尾部约束，对应LTR中的 right 和 RTL 中的 Left。 使用 Leading 和 Trailing 设置约束，View会根据自身的`semanticContentAttribute` 具体是 LTR 或是 RTL 自动调整布局。

由于我们业务内当前有大量的布局代码是使用frame layout手动布局，全部切换到 AutoLayout 不现实。特别是对于有复杂 UI 元素和布局逻辑的场景，重写布局困难而且相当耗时。因此需要考虑给这种布局方式提供更小改动成本的 RTL 适配方式。当我们在 LTR 中设置`left(view.origin.x) = a`，映射到 RTL 坐标系，其实就是设置`right(view.left + view.width) = view.superview.width - a`。当我们在 LTR 中设置`right = a`，映射到 RTL 坐标系，其实就是设置`view.superview.width - a + self.width`，因此，我们可以将 2 个坐标系统一化，参照 AutoLayout 中的定义，扩展 View 的 leading 和 trailing 属性。

```objc
@implementation UIView (RTL)

    - (CGFloat)leading {
    NSAssert(self.superview != nil, @"使用leading必须当前view添加到superView！");
        if ([self isRTL]) {
        return self.superview.width - self.right;
    }
    return self.left;
}

    - (void)setLeading:(CGFloat)leading {
    NSAssert(self.superview != nil, @"使用leading必须当前view添加到superView！");
        if ([self isRTL]) {
        self.right = self.superview.width - leading;
            } else {
            self.left = leading;
        }
    }
    
        - (CGFloat)trailing {
        NSAssert(self.superview != nil, @"使用trailing必须当前view添加到superView！");
            if ([self isRTL]) {
            return self.leading + self.width;
        }
        return self.right;
    }
    
        - (void)setTrailing:(CGFloat)trailing {
        NSAssert(self.superview != nil, @"使用trailing必须当前view添加到superView！");
            if ([self isRTL]) {
            self.right = self.superview.width - trailing + self.width;
                } else {
                self.left = trailing - self.width;
            }
        }
        
        @end
```

在设置 leading 和 trailing 前，要求 View 已经添加到 superview ，并且 size 已经设置。这个在绝大多数场景下可以满足(以我们工程为例，暂时没有遇到无法满足条件的场景)。 新增了这几个相关方法后，在RTL适配时，对于原本( LTR 场景)的 left 设置，改成使用 leading 设置。原本的 right 设置， 改成使用 trailing 设置。和AutoLayout的概念用法基本相同，适配成本大幅减小。

Image
-----

就像在上文说过，并不是所有图片都需要在 RTL 模式下翻转，只有一部分图片(一般来说，常常是有比较明确方向含义和性质图片)需要翻转。 对于需要翻转的图片，有几种方式可以处理。 在 iOS9 之后，`UIImage` 新增了相关方法，

```objc
- (UIImage *)imageFlippedForRightToLeftLayoutDirection API_AVAILABLE(ios(9.0));
@property (nonatomic, readonly) BOOL flipsForRightToLeftLayoutDirection API_AVAILABLE(ios(9.0));
```

对于需要在 LTR 和 RTL 下不同翻转的 image ，可以通过`imageView.image = targetImage.imageFlippedForRightToLeftLayoutDirection()`来设置。或者在 Image Set 中，设置相关图片资源的 Direction ， ![设置direction](/images/jueJin/086763100888231.png) 需要注意的是，这两种方法是作用于`UIImageView` 上，对于其他容器会无效。同时要注意展示时是使用`UIImageView` 的`semanticContentAttribute` 做翻转判断，`semanticContentAttribute` 设置错误的话最终展示图片也会错误。 鉴于以上原因，可以在对`UIImage` 提供自定义的翻转方法，

```objc
@implementation UIImage (RTL)
    - (UIImage *_Nonnull)checkOverturn {
        if (isRTL) {
        UIGraphicsBeginImageContextWithOptions(self.size, false, self.scale);
        CGContextRef bitmap = UIGraphicsGetCurrentContext();
        CGContextTranslateCTM(bitmap, self.size.width / 2, self.size.height / 2);
        CGContextScaleCTM(bitmap, -1.0, -1.0);
        CGContextTranslateCTM(bitmap, -self.size.width / 2, -self.size.height / 2);
        CGContextDrawImage(bitmap, CGRectMake(0, 0, self.size.width, self.size.height), self.CGImage);
        UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
        return image;
    }
    return self;
}
@end
```

同时提供对 View 容器的翻转方法，

```objc
@implementation UIView (RTL)
    - (void)checkOverturn {
    // 避免重复翻转
        if (self.overturned) {
        return;
    }
    // 基于transform翻转
    self.transform = CGAffineTransformScale(self.transform, -1, 1);
}
@end
```

顶层业务可以根据实际场景，选择合适的方法处理。

文本
--

文本这里需要处理的比较重要的问题有 3 个，一个是 text 的对齐方式( alignment )。一个是 AttributeString 的处理。一个是 text 里字符的排列顺序(字符从左往右或者从右往左)。我们逐个介绍。

### alignment

我们先讨论 alignment。在`NSText`中，`NSTextAlignment`定义为，

```objc
/* Values for NSTextAlignment */
    typedef NS_ENUM(NSInteger, NSTextAlignment) {
    NSTextAlignmentLeft      = 0,    // Visually left aligned
    #if TARGET_ABI_USES_IOS_VALUES
    NSTextAlignmentCenter    = 1,    // Visually centered
    NSTextAlignmentRight     = 2,    // Visually right aligned
    #else /* !TARGET_ABI_USES_IOS_VALUES */
    NSTextAlignmentRight     = 1,    // Visually right aligned
    NSTextAlignmentCenter    = 2,    // Visually centered
    #endif
    NSTextAlignmentJustified = 3,    // Fully-justified. The last line in a paragraph is natural-aligned.
    NSTextAlignmentNatural   = 4     // Indicates the default alignment for script
}
```

我们以最常用的Text容器`UILabel` 为例。对于`UILabel` ，如果没有设置`textAlignment` ，在 iOS9 之前会默认是`NSTextAlignmentLeft` ，在 iOS9 之后默认是`NSTextAlignmentNatural` 。`NSTextAlignmentNatural` 会根据系统语言是否是 RTL ，自动帮我们调整合适的 alignment 。对于需要应用内设置语言的场景，因为应用内语言可能和系统语言不一致，没法使用系统的默认处理。需要根据当前应用内是否设置是RTL语言，手动设置`UILabel` 的`textAlignment` 。出于便捷性考虑，可以扩展`UILabel`的`rtlAlignment`方法。业务层根据需要设置`rtlAlignment`。

```objc
    typedef NS_ENUM(NSUInteger, NMLLabelRTLAlignment) {
    NMLLabelRTLAlignmentUndefine,
    NMLLabelRTLAlignmentLeft,
    NMLLabelRTLAlignmentRight,
    NMLLabelRTLAlignmentCenter,
    };
    
    @implementation UILabel (RTL)
    
        - (void)setRtlAlignment:(RTLAlignment)rtlAlignment {
        [self bk_associateValue:@(rtlAlignment) withKey:@selector(rtlAlignment)];
        
            switch (rtlAlignment) {
            case RTLAlignmentLeading:
            self.textAlignment = (isRTL ? NSTextAlignmentRight : NSTextAlignmentLeft);
            break;
            case RTLAlignmentTrailing:
            self.textAlignment = (isRTL ? NSTextAlignmentLeft : NSTextAlignmentRight);
            break;
            case RTLAlignmentCenter:
            self.textAlignment = NSTextAlignmentCenter;
            case RTLAlignmentUndefine:
            break;
            default:
            break;
        }
    }
    
        - (RTLAlignment)rtlAlignment {
        NSNumber *identifier = [self bk_associatedValueForKey:@selector(rtlAlignment)];
            if (identifier) {
            return identifier.integerValue;
        }
        return RTLAlignmentUndefine;
    }
    
    @end
```

### AttributeString 的处理

由于设置 textAlignment 无法对 AttributeString 生效，所以 AttributeString 需要单独处理。处理方式和设置 textAlignment 类似，只是换成使用`NSParagraphStyle` 来处理。

```objc
@implementation NSMutableAttributedString (RTL)

    - (void)setRtlAlignment:(RTLAlignment)rtlAlignment {
        switch (rtlAlignment) {
        case RTLAlignmentLeading:
        self.yy_alignment = (isRTL ? NSTextAlignmentRight : NSTextAlignmentLeft);
        break;
        case RTLAlignmentTrailing:
        self.yy_alignment = (isRTL ? NSTextAlignmentLeft : NSTextAlignmentRight);
        break;
        case RTLAlignmentCenter:
        self.yy_alignment = NSTextAlignmentCenter;
        case RTLAlignmentUndefine:
        break;
        default:
        break;
    }
}

@end
```

### 字符排列顺序

系统会使用 Text 的第一个字符作为排列顺序的判断依据。比如文本"مرحبا 你好"，因为第一个字符是阿拉伯语字符，所以系统会使用 RTL 规则处理。同理，如果文本是"你好 مرحبا"，因为第一个字符是中文，则会使用 LTR 规则。这个处理方式在 Text 中只有单一语言时没有问题，不过遇到 RTL 语言和 LTR 语言混合的场景，情况就会变得复杂许多，需要有更细致的考虑。

以一个常见的例子说明，比如聊天消息中经常使用的@格式语法，在 LTR 和 RTL 中大概有这些场景， ![at](/images/jueJin/36e3fecdc6688b2.png)

可以看到，虽然系统的这个默认处理可以应对多数的情况。但是在一些场景下无法满足需求，比如上面的label\[3\]。 我们希望将"@"与后面的用户名称视为一个整体，对于 "مرحبا@我, 今天天气好吗"，我们预期展示成 "@我，今天天气好吗مرحبا"，但是最终展示成了"我, 今天天气好吗@مرحبا"。或者比如我们希望是以 LTR 展示， ![image right](/images/jueJin/498c217c2bc582e.png) 但是最终会展示成， ![image wrong](/images/jueJin/74c14a626f6ce8b.png)

对于这些场景，我们需要插入一些相关的 Unicode 来做纠正。比较常用的相关的 Unicode 有以下这些。 ![untitled](/images/jueJin/f1d910510323a23.png)

再回到刚才 2 个例子，对于"مرحبا@我, 今天天气好吗"，iOS 将@也当成了阿拉伯语مرحبا的一部分，我们需要对@手动添加 LEFT-TO-RIGHT 标志 \\u200E，声明为LTR展示。对于第2个例子，我们需要对几个阿拉伯文添加\\u202A声明为LTR展示，同时使用\\u202C作为结束标签。 ![text final](/images/jueJin/293bf425b578ed2.png)

其他注意点
-----

除了以上介绍的这些，还有一些比较零散的点需要注意。

### UICollectionView

`UICollectionView` 在 RTL 场景下也需要翻转，系统不会帮我们默认做这个事情，需要我们自行处理。在 iOS11 之后，`UICollectionViewLayout`扩展了一个`readonly` 的`property` 。

```objc
@property(nonatomic, readonly) BOOL flipsHorizontallyInOppositeLayoutDirection;
```

`flipsHorizontallyInOppositeLayoutDirection`默认为`false`，当设置为`true`时，`UICollectionView` 会根据当前 RTL 情况，翻转水平坐标系。由于这是一个`readonly`的属性，我们需要继承`UICollectionViewLayout` 并改写`flipsHorizontallyInOppositeLayoutDirection`的 getter 方法。

### UIEdgeInsets

`UIEdgeInsets` 中定义的是`left`和`right`，在 RTL 场景下，系统不会帮我们做翻转处理。尽管在 iOS11 以后，系统新增了`NSDirectionalEdgeInsets`定义，但是对常用的 UI 控件(比如`UIButton` 等)并没有扩展相关属性，还是需要设置`UIEdgeInsets`。因此可以考虑新增类似`UIEdgeInsetsMake_RTLFlip`的定义，方便上层使用。

```objc
UIEdgeInsets UIEdgeInsetsMake_RTLFlip(CGFloat top, CGFloat left, CGFloat bottom, CGFloat right)
    {
    if (!isRTL)
        {
        UIEdgeInsets insets = {top, left, bottom, right};
        return insets;
    }
    UIEdgeInsets insets = {top, right, bottom, left};
    return insets;
}
```

### UINavigationController

navigationBar 的滑动返回手势，会根据当前系统语言做 RTL 处理。对于我们常用的 LTR 场景，是右滑返回。在 RTL 场景下是左滑返回。对于应用内自定义语言的场景，设置`UIView.appearance().semanticContentAttribute`不会改变这个手势，还需要设置`UINavigationController.view.semanticContentAttribute`。

```objc
    - (instancetype)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil {
        if (self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil]) {
        self.view.semanticContentAttribute = [UIView appearance].semanticContentAttribute;
    }
    return self;
}
```

### Gesture

对于带方向性的Gesture(比如`UISwipeGestureRecognizer`等)，系统不会对手势的响应方向做改变。这个只能上层根据当前是否是 RTL 场景做逻辑判断。一般来说，这类手势并不会非常频繁的使用，因此业务层适配处理成本不大。

### 数字

如同开篇时介绍的那样，数字同样是需要考虑的一个重要的点。究竟是使用西方阿拉伯数字，还是东方阿拉伯数字，在数字规则和展示上都有差异。因为这次业务适配使用的西方阿拉伯数字规则，和我们日常接触的相同，这里就不再展开。如果是使用东阿拉伯数字，那数字逻辑就要额外处理。

总结
--

到这里，总体的 RTL 兼容基本完成。总结来说，由于当前App需要支持应用内设置语言，导致不少问题变得复杂化。而且由于App本身的诸多特点，在方案设计的时候需要选择改动成本和风险都相对可控的方案来处理。对于不需要应用内独立设置App语言，或者是刚要从0到1开发App的话，可以根据自身的业务特点，设计更合适当前业务的方案。

参考资料
----

*   [Internationalization and Localization Guide](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Flibrary%2Farchive%2Fdocumentation%2FMacOSX%2FConceptual%2FBPInternational%2FIntroduction%2FIntroduction.html%23%2F%2Fapple_ref%2Fdoc%2Fuid%2F10000171i-CH1-SW1 "https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPInternational/Introduction/Introduction.html#//apple_ref/doc/uid/10000171i-CH1-SW1")
*   [Design for Arabic](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fvideos%2Fplay%2Fwwdc2022%2F10034 "https://developer.apple.com/videos/play/wwdc2022/10034")
*   [How to use Unicode controls for bidi text](https://link.juejin.cn?target=https%3A%2F%2Fwww.w3.org%2FInternational%2Fquestions%2Fqa-bidi-unicode-controls%23punctuation "https://www.w3.org/International/questions/qa-bidi-unicode-controls#punctuation")

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！