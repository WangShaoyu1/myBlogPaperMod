---
author: "yck"
title: "Event Handing Guide 笔记"
date: 2016-12-21
description: "Event Handing Guide 笔记
                        
                            个人认为该指南前两章有学习意义，所以只有前两章的笔记，包括了手势的处理和响应链
                        
                   "
tags: ["iOS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:2,comments:0,collects:0,views:1345,"
---
> 个人认为该指南前两章有学习意义，所以只有前两章的笔记，包括了手势的处理和响应链

Defining How Gesture Recognizers Interact
-----------------------------------------

*   手势一开始的状态都是 possible
*   离散的手势状态从 possible 到 recognize 说明识别完整
*   连续的手势状态从 possible 到 began 到 change 到 end 说明识别完整
*   每次手势识别改变状态都会发送消息给手势的 target

Interacting with Other Gesture Recognizers
------------------------------------------

*   当一个 view 拥有好几个手势的时候，在默认情况下，没有设置哪个手势可以先接受到触摸事件，但是我们可以重写默认的行为：
    *   指定一个手势先于其他手势分析触摸事件
    *   允许两个手势同时操作
    *   阻止手势分析触摸事件  
        想做到以上几点，可以通过 `UIGestureRecognizer` 的代理方法或者重写子类方法来实现

Declaring a Specific Order for Two Gesture Recognizers
------------------------------------------------------

*   如果你想识别滑动和平移手势并且希望两个手势有不同的操作，默认情况下，平移手势会先于滑动手势识别。如果希望识别两个手势，那么滑动手势就必须在平移手势识别前分析触摸事件。如果滑动手势识别成功，那么平移手势也成功。如果滑动手势识别失败，那么开始识别是否为平移手势

Preventing Gesture Recognizers from Analyzing Touches
-----------------------------------------------------

*   如果你想在touch begin 方法调用前阻止接收触摸事件，你可以使用 `gestureRecognizer:shouldReceiveTouch:` 方法，这个方法不会改变 state
*   如果存在多个 view 手势冲突的情况下，你可以使用 `gestureRecognizerShouldBegin:` 方法，这个方法会在状态从 possible 转换成其他状态时调用
    
    Permitting Simultaneous Gesture Recognition
    
*   默认情况下，分析一个手势时候会阻止分析其他手势，以下方法可以同时解析多个手势。`gestureRecognizer:shouldRecognizeSimultaneouslyWithGestureRecognizer:`

### Specifying a One-Way Relationship Between Two Gesture Recognizers

*   如果你想指定两个手势之前的关系，你可以使用 `canPreventGestureRecognizer:` 方法或者让`canBePreventedByGestureRecognizer:` 方法返回 NO。举个例子，如果你希望旋转手势的时候捏合手势不起效并且捏合手势不阻止旋转手势，你可以这样做：```ini
    [rotationGestureRecognizer canPreventGestureRecognizer:pinchGestureRecognizer];
    ```然后重写旋转手势的子类方法并且返回 NO

### An Event Contains All the Touches for the Current Multitouch Sequence

*   当手指开始触摸屏幕时，生成一个 touch 对象，当手指开始移动时，系统将 touch 对象发送给 event 对象。一个 event 对象追踪一个手指。在这个过程中，UIkit 追踪手指并且更新 touch 对象的属性，这些属性包含 touch 的阶段，当前的位置，之前的位置，时间戳。

### An App Receives Touches in the Touch-Handling Methods

*   在触摸过程中，APP 发送以下信息
    *   `touchesBegan:withEvent`
    *   `touchesMoved:withEvent:`
    *   `touchesEnded:withEvent:`
    *   `touchesCancelled:withEvent:`
*   `touchesBegan:withEvent` 对应 `UITouchPhaseBegan`，但是和手势识别的状态没关系，例如 `UIGestureRecognizerStateBegan` 和 `UIGestureRecognizerStateEnded`

Event Delivery: The Responder Chain
-----------------------------------

*   系统使用 hit-testing 来检查 touch 是不是处于 view 中。如果是的话，会检查所有的子视图并确认最终的 view
*   先调用 `pointInside:withEvent:` 确认点，然后调用 `hitTest:withEvent:` 确认 view
*   UIResponse 有个 next 的get 属性，通过这个属性可以获得下一级传导对象