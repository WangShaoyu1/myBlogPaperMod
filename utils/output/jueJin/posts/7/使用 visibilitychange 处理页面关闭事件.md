---
author: "Gaby"
title: "使用 visibilitychange 处理页面关闭事件"
date: 2022-06-29
description: "在对web项目部署提示用户刷新功能优化的时候，用到了 `visibilitychange`,这里就简单的介绍下 `visibilitychange` 。"
tags: ["JavaScript","架构","HTML中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:20,comments:0,collects:28,views:6347,"
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第30天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

废话只说一句：码字不易求个👍，收藏 === 学会,快行动起来吧！🙇‍🙇‍🙇‍。

在对web项目部署提示用户刷新功能优化的时候，用到了 `visibilitychange`,这里就简单的介绍下 `visibilitychange` 。

### 概念

visibilitychange事件是浏览器17年前后添加的一个事件，是指当其选项卡的内容变得可见或被隐藏时，会在文档上触发 `visibilitychange` (能见度更改) 事件。

MDN 也有相关属性介绍 ☞ [MDN Web Docs visibilitychange\_event](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FDocument%2Fvisibilitychange_event "https://developer.mozilla.org/zh-CN/docs/Web/API/Document/visibilitychange_event")

### 使用场景

当浏览器的**某个标签页切换到后台，或从后台切换到前台时**，会在 docment 上触发 visibilityState 事件；现在主流的浏览器都支持该消息了，例如Chrome, Firefox等。出于兼容性原因（Safari 14 之前的版本不支持挂载在 window 上），要在 document 上监听 visibilityState 事件；

什么时候触发呢？ 当用户导航到一个新的页面，改变标签页，关闭标签页，最小化或者关闭浏览器；或者移动端从浏览器换到其他的app。

在做页面游戏的时候、播放音视频文件时、在线考试防止考生离开当前页面时、数据上报等场景都时常用到。

### 使用方法

可以利用 `document.hidden` 的值来进行判断，值类型为 布尔，true 为隐藏，false 为激活。

基本使用方法如下：

```js
document.addEventListener("visibilitychange", function(){}, false);
```

在项目中当页面离开的时候就关闭查询版本是否更新的定时器，以节约性能，等页面再次激活的时候再次设置定时器。这里只摘取主要逻辑进行说明。具体可以看 ☞ [Vue项目部署后提示刷新版本](https://juejin.cn/post/7113949596308471822 "https://juejin.cn/post/7113949596308471822")

```js
const delayTime = 30;
let popupFlag = false;
let interval = null;

document.addEventListener('visibilitychange', checkVisibility);

// 切换页面事件
    function checkVisibility() {
    if (popupFlag) return;
        if (document.hidden) {
        // 离开时
        clearInterval(interval);
        interval = null;
            } else {
            // 防止10秒之内频繁切换
            debounce(createInterval(checkVersion), 10000);
        }
    }
    
    // 检查版本
        function checkVersion() {
        //业务逻辑省略...
    }
    
    // 创建定时器
        function createInterval(callback) {
        interval = setInterval(callback, delayTime * 1000);
    }
    
        function debounce(fn, delay) {
        //记录上一次的延时器
        let timer = null;
            return function () {
            //清除上一次的演示器
            clearTimeout(timer);
            //重新设置新的延时器
                timer = setTimeout(() => {
                //修正this指向问题
                fn.apply(this);
                }, delay);
                };
            }
```

### 注意

现在某些浏览器还保留了visibilitychange的**前缀**，  
例如Chrome浏览器还保留着**webkit**前缀，  
不过该事件已经趋于稳定，在Chrome 33及以后就去掉了前缀，  
直接使用visibilitychange

**注：**  
（1）微信内置的浏览器因为没有标签，所以不会触发该事件。  
（2）手机端直接按Home键回到桌面，也不会触发该事件。  
（3）PC端浏览器失去焦点不会触发该事件，但是最小化，或回到桌面会触发。