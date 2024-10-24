---
author: ""
title: "iOS ReplayKit 与 屏幕录制"
date: 2023-04-03
description: "介绍了iOS ReplayKit Framework 的演进，讲述了如何接入，并结合直播中的录屏直播实践对可能遇到的问题提出了解决方案"
tags: ["iOS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读11分钟"
weight: 1
selfDefined:"likes:51,comments:4,collects:61,views:13080,"
---
> 本文作者： clc

0x00 引言
-------

在客户端开发的生涯里，有时会遇到这样一些场景，需要对用户在应用内的操作做进行屏幕录制，甚至是系统层级的跨应用屏幕录制来实现某种特殊需求，例如在线监考、应用问题反馈、游戏直播等。  
苹果提供了 ReplayKit Framework 来满足这些需求，目前云音乐 LOOK 直播客户端内就是采用这个系统框架来实现跨应用录屏直播的。

0x01 ReplayKit简史
----------------

ReplayKit 的故事要从 iOS 9 说起。

![ReplayKit 结构](/images/jueJin/91ed9b0e1c94cbb.png)

iOS 9 提供了 ReplayKit Extension 进行应用内的录制以及应用声音采集。主要涉及两个类：一个是 RPScreenRecorder，作为录制 Task 的管理者；另一个是 RPPreviewViewController，录制状态的视觉反馈。应用内直接调用 ReplayKit API 来控制开始与停止，在 Extension 中将捕获的音频/视频流推向服务器，这就是应用内录制（In-App Boardcast）。  
WWDC 课程：[Going Social with ReplayKit and Game Center](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fvideos%2Fplay%2Fwwdc2015%2F605 "https://developer.apple.com/videos/play/wwdc2015/605")

![In-App Boardcast](/images/jueJin/8191573f62ec6b0.png)

在 iOS 11 中，ReplayKit 提供了更强大的能力：将系统作为一个整体进行直播。用户在控制中心内开启屏幕录制后，ReplayKit2 Extension 可以获取到整个系统级的屏幕画面、以及设备所产生的所有音频，实现跨应用录屏(iOS System Boardcast)，同时 ReplayKit 也提供了麦克风采集。这种系统级的直播在应用间切换时也不会停止。（注意提醒你的用户保护好自己的隐私！）。  
音视频数据依然是在 Extension 内直接获取并上传至服务器，文章的后面将重点聊一下这块内容在 LOOK 直播中的实践。  
WWDC 课程：[Live Screen Broadcast with ReplayKit](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fvideos%2Fplay%2Fwwdc2018%2F601 "https://developer.apple.com/videos/play/wwdc2018/601")

![iOS System Boardcast](/images/jueJin/c0546a46351de51.png)

在 iOS 15之后，ReplayKit 提供了 Loop Buffer 功能，根据 WWDC 的描述，在应用内开启 Loop Buffer 后 ReplayKit 会创建一个最长 15 秒的 Buffer 并开始持续录制，应用可以随时调用 API 将这一部分导出（对直播应用而言，这可以用来随时截获精彩瞬间，很酷）。这一部分不需要创建 Extension，直接在应用内实现。  
WWDC 课程：[Discover rolling clips with ReplayKit](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fvideos%2Fplay%2Fwwdc2021%2F10101%2F "https://developer.apple.com/videos/play/wwdc2021/10101/")

0x02 系统级录制的流程简述
---------------

1.  用户在 App 内做好前置准备（例如：开播）。
2.  用户从控制中心启动 ReplayKit。
3.  ReplayKit Extension 开始接受录屏视频流、App音频流，同时开始向服务器推流。
4.  用户主动从控制中心关闭录制，流程结束。

![](/images/jueJin/bea10c7772815c3.png)

0x03 创建并接入ReplayKit Extension
-----------------------------

下面我们在 Xcode 14.1 中演示一下如何接入 ReplayKit。  
首先，在 Xcode 中新建一个 Target，选择 Broadcast Upload Extension。

![](/images/jueJin/a9516214b139e97.png)

由于系统录制不需要 UI Extension，所以取消勾选 Include UI Extension 这一默认选项。

![](/images/jueJin/a4ff107fbd64473.png)

生成的文件很简单，只有一对 SampleHandler.h 和 SampleHandler.m。

![](/images/jueJin/dbdcff808237e4c.png)

在 SampleHandler.m 中，包含了录制事件的各种回调方法。

```objectivec
    - (void)broadcastStartedWithSetupInfo:(NSDictionary<NSString *,NSObject *> *)setupInfo {
    // User has requested to start the broadcast. Setup info from the UI extension can be supplied but optional.
}

    - (void)broadcastPaused {
    // User has requested to pause the broadcast. Samples will stop being delivered.
}

    - (void)broadcastResumed {
    // User has requested to resume the broadcast. Samples delivery will resume.
}

    - (void)broadcastFinished {
    // User has requested to finish the broadcast.
}
```

接下来就是接收系统的音视频帧回调了，在这里对音视频帧进行处理和推流就可以了。其中，系统提供的音视频帧一共分为三类：

*   RPSampleBufferTypeVideo：系统视频帧，包含了整个屏幕的视频内容，无任何删减。
*   RPSampleBufferTypeAudioApp：系统内录音频帧，包含了系统实施播放的声音。
*   RPSampleBufferTypeAudioMic：麦克风音频帧，用户打开了麦克风录制按钮后开始回调。

回调方法如下：

```objectivec
// 音视频回调
    - (void)processSampleBuffer:(CMSampleBufferRef)sampleBuffer withType:(RPSampleBufferType)sampleBufferType {
    
        switch (sampleBufferType) {
        case RPSampleBufferTypeVideo:
        // Handle video sample buffer
        break;
        case RPSampleBufferTypeAudioApp:
        // Handle audio sample buffer for app audio
        break;
        case RPSampleBufferTypeAudioMic:
        // Handle audio sample buffer for mic audio
        break;
        
        default:
        break;
    }
}
```

到此整个框架就搭建完成了，接下来运行 Extension，长按控制中心里的屏幕录制开关（如果没有，则需要在“设置”=>“控制中心”中手动添加。

![](/images/jueJin/4e7b9495355ba6d.png)

然后选中对应应用，就可以开始了！

![](/images/jueJin/1c0c9279dda893b.png)

0x04 LOOK 直播内的实践
----------------

**1.Extension 中的功能集成** 在 Extension 中，除了音视频处理和推流功能外，其他功能应该尽量少，来保证内存在一个稳定值，我们集成的几个主要的能力是：

1.  网络请求能力，主要负责直播心跳保活，保证在宿主App被杀死后，直播依然能正常进行。以及一系列需要根据接口进行的判断和校验。
2.  IM 长连接能力，确保风控可以及时通过 IM 消息来中断有风险的直播内容，在一些场景下接收房间用户的弹幕与送礼消息。
3.  本地 Push（可选开关，由宿主 App 控制），作为主播与观众进行弹幕/礼物互动的主要媒介，也是风控警告等通知的能力的提示手段。在灵动岛推出后，可以选择将这部分能力向灵动岛迁移。
4.  Local Socket 加上 AppGroup 两者合作实现了宿主 App 和 Extension 间的数据同步，在下一章节会对数据通信展开讲解。

![](/images/jueJin/eebe26f0c18d45c.png)

经过测试与线上验证，目前这些功能的总内存占用大约在 20Mb 左右，占 Extension 内存上限大约一半，但不可避免的是在小部分情况下系统会将 Extension 线程阻塞，发生音视频帧内存挤压超过阈值，导致 Extension 被杀死。

**2.宿主App与 Extension 间的通信**

App间的进程间通信方式主要有两种，一种是通过创建 Local Socket 互发数据。

![](/images/jueJin/c0ac38ae149fb86.png)

另一种是通过 AppGroup 进行资源共享（简单的说，通过 AppGroup，宿主应用和 Extension 可以访问到同一份 UserDefault）。

![](/images/jueJin/52c816c1276f3c4.png)

在技术方案选型时，我们考虑过单独使用 Local Socket 或是单独使用 AppGroup 来实现通信，但发现两者都有弊端：

1.  仅使用 Local Socket 通信时，考虑到宿主和 Extension 各自的重开场景以及部分数据需要持久化，数据同步会较为复杂。
    
2.  仅使用 AppGroup 时，双方需要通过轮询来进行数据同步，包含文件读写操作，有效率问题。
    

于是最终选择两者并用，一方改写 UserDefault 数据后，通过 Local Socket 通知另一方，进行同步。

![](/images/jueJin/e1d6072a9a01662.png)

\*\*3.引导用户打开录制 \*\*

ReplayKit2 的开启流程比较繁琐，对用户不友好：回忆上文，开启屏幕录制需要用户中断在应用中的操作流程，到控制中心长按“屏幕录制”按钮，选中你的应用，点击开始；如果用户还没有向控制中心添加“屏幕录制”按钮，则需要引导用户到“设置”中添加。

LOOK 直播在设计开播流程时，首先想到的是放置一个引导视频进行引导：通过 Local Socket 轮询 Extension 状态，如果还没有开启，则放置一块播放区域，循环播放开启引导视频。这样虽然和用户讲明白了如何开启，但还是无法避免复杂的流程，我们有没有办法在流程上简化用户操作呢？

答案是有，在 iOS 13 开始，Replaykit2 提供了 RPSystemBroadcastPickerView 系统控件，通过点击控件，用户可以直接唤起本应由长按“屏幕录制”唤起的系统界面，并只包含你指定的选项了 ![](/images/jueJin/6a770744490ce61.png)

这样，整个流程就变成线性的了，不需要用户再离开你的开播流程去操作系统控制中心。

那么问题结束了吗？还没有， RPSystemBroadcastPickerView 是一个系统控件，出于隐私保护的前提，系统并不想让这个控件可以被随意的修改样式。在不修改样式的情况下，它长这样：

![](/images/jueJin/28b99d4a962ac0c.png)

遗憾的是，这个样式和 LOOK 直播的开播界面视觉格格不入。通过分析层级，发现这是一个 UIView 上带了一个 UIControl，所以我们可以通过遍历 subviews 并传递一个事件的方法主动触发 touchUpInside 来弹起系统的录制入口。

```less
    if (@available(iOS 12.0, *)) {
    // 创建一个按钮
    RPSystemBroadcastPickerView *picker = [[RPSystemBroadcastPickerView alloc] initWithFrame:CGRectMake(0, 0, 1, 1)];
    
    //指定要打开的录制选项
    NSString *bundleId = [NSBundle thisBundle_bundleId];
    picker.preferredExtension = [bundleId stringByAppendingString:@".broadcast"];
    picker.showsMicrophoneButton = YES;
    
    //遍历找到按钮，点他！
        for (id subview in picker.subviews) {
            if ([subview isKindOfClass:[UIButton class]]) {
            [(UIButton *)subview sendActionsForControlEvents:UIControlEventTouchUpInside];
        }
    }
}
```

这样我们就将 RPSystemBroadcastPickerView 的点击行为包装出来了，可以处理成自动唤起或是由自定义控件唤起了。

让我们来看一下实现的效果

![](/images/jueJin/7603e9b8c354625.png)

**4.隐私保护**

由于 Replaykit 是系统级的录制，用户在进行直播时所有的操作都会被观众看到，如果主播操作不当，一些比较隐私的信息（例如短信验证码、通讯录、聊天记录和相册）就会被泄漏出去，这是主播和平台方都不希望发生的。

在 LOOK 直播内，我们提供了“隐私模式”这一功能。在隐私模式下，系统提供的视频帧将被舍弃，推流组件从一张本地图片中取帧，并持续向服务器推送，这样观众端就看不到主播的隐私内容操作了。

![](/images/jueJin/704c4a901b4b376.png)

隐私模式只针对画面，音频方面，由主播自己控制是否静音（部分主播需要在隐私模式下保持观众互动，避免直播间人数流失）。

我们无法识别应用外的用户操作和界面停留，只能文字提醒用户注意。而在应用内，我们可以人工划分出哪些界面是涉及用户隐私的，例如直播间背景选择页，需要在应用内访问系统相册。

所以我们设计了两种触发方式，从应用的角度来看，分为主动触发和被动触发。主动触发指的是主播在应用内进入包含隐私信息的界面时，应用主动进入隐私模式，退出界面时关闭隐私模式。被动触发则是由主播操作直播间内的“开启隐私模式”按钮来开启和关闭隐私模式。

0x05 困难与挑战
----------

正如前文所说，iOS Extension 中有 50Mb 的最大内存阈值，如果超过了，将会被系统收回。如果因为频繁到达内存阈值而导致 Extension 被系统强制关闭回收就得不偿失了，所以对于 50 Mb 的边界情况就必须小心应对。

开发过程中，由于模拟器中没有控制中心，我们只能用真机设备开发调试。由于 Xcode 的断点优化并不好，在开发过程中经常会遇到断点导致进程阻塞，引发内存超过阈值的情况，排查一些偶现的问题十分痛苦，所以需要做好 Debug 日志打印，确保在内存超限的情况下也能有足够的日志来分析问题。

内存限制对音视频处理也是一个挑战。如果网络不佳，推流阻塞，这时对音视频帧的消费速度远不及系统吐帧的生产速度，编码后的音视频数据无法及时消耗，很容易就会达到内存上线。因此团队中负责音视频处理及推流开发的小伙伴要注意进行内存监控，在内存达到一个危险值的时候，及时舍弃一部分数据来保护整体的内存使用量远离临界值，避免进程被杀死。

![](/images/jueJin/350b98e17679646.png)

对于 Extension 内的内存控制没有自信的团队，可以考虑将 Extension 中获取到的系统音频、视频帧通过 Local Socket 方式将数据发送至宿主 App 内，由在后台保活的宿主进行音视频处理及推流等操作。宿主保活的情况下，心跳、本地 Push、IM长连接 都可以在宿主 App 中实现， Extension 中仅保留视频数据编码一项能力，进一步压低内存开销。

![](/images/jueJin/e3a2d74f2c9d6af.png)

0x06 注意事项
---------

1.  尽量控制内存占用，最好永远不要碰到 50 Mb 导致 Extension 被回收。
    
2.  在不同系统版本中，回调吐出的音视频帧格式有差异，注意兼容。
    
3.  调用 finishBroadcastWithError: 主动结束录制时，要设置好 NSError userInfo 中的 NSLocalizedFailureReasonErrorKey，确保在系统alert中能正确的告知用户结束原因。
    
    ```ini
        - (void)networkingErrorNotificationHandler {
        NSError *error = [NSError errorWithDomain:@"replaykitDomin" code:1234 userInfo:@{NSLocalizedFailureReasonErrorKey : @"网络无法连接，请重新开启屏幕录制"}];
        [self finishBroadcastWithError:error];
    }
    ```

0x07 结语
-------

ReplayKit 问世已经多年，从最初的应用内录制到系统屏幕录制，再到 Loop Buffer 滚动剪辑，功能在不断的增加。但出于隐私保护的初衷，苹果对开启录制行为的设置依然繁琐，在用户交互方面必须要做好引导，降低用户学习成本。

最后，祝大家在实现相关功能时，不被 50 Mb 内存上线和 Extension 的调试困难绊倒，优雅的完成屏幕录制功能。

相关知识传送门：  
Apple 文档：[developer.apple.com/documentati…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Freplaykit "https://developer.apple.com/documentation/replaykit")  
WWDC 2021 Loop Buffer [developer.apple.com/videos/play…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fvideos%2Fplay%2Fwwdc2021%2F10101%2F "https://developer.apple.com/videos/play/wwdc2021/10101/")  
WWDC 2018 Screen Broadcast [developer.apple.com/videos/play…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fvideos%2Fplay%2Fwwdc2018%2F601 "https://developer.apple.com/videos/play/wwdc2018/601")  
WWDC 2015 In-App Boardcast [developer.apple.com/videos/play…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Fvideos%2Fplay%2Fwwdc2015%2F605 "https://developer.apple.com/videos/play/wwdc2015/605")

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！