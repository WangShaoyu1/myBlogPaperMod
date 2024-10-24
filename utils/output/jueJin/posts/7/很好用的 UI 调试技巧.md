---
author: "yck"
title: "很好用的 UI 调试技巧"
date: 2019-09-23
description: "在业务开发过程中，想必大家经常会需要查看一个元素的位置及大小并修改它的 CSS，因此就会频繁使用到 DevTools 中的选择元素功能。 其实我们可以使用一个 CSS 技巧给所有元素加上 outline，这样就能迅速了解自己所需的元素位置信息，无须再选择元素查看了。 需要注意的…"
tags: ["JavaScript","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:339,comments:76,collects:281,views:18476,"
---
在业务开发过程中，想必大家经常会需要查看一个元素的位置及大小并修改它的 CSS，因此就会频繁使用到 DevTools 中的选择元素功能。

![](/images/jueJin/16d0fdcd7f81e23.png)

其实我们可以使用一个 CSS 技巧给所有元素加上 `outline`，这样就能迅速了解自己所需的元素位置信息，无须再选择元素查看了。

![](/images/jueJin/16d0fe145d1b1f4.png)

我们只需要添加以下 CSS 就能为任何网站添加这样的效果

```
    body * {
    outline: 1px solid red
}
```

需要注意的是这里我没有使用 `border` 的原因是 `border` 会增加元素的大小但是 `outline` 不会。

通过这个技巧不仅能帮助我们在开发中迅速了解元素所在的位置，还能帮助我们方便地查看任意网站的布局。

笔者最喜欢用这个技巧来查看元素是否对齐。

但是当下这个技巧需要我们手动添加 CSS 来实现，显得略微有点鸡肋，是否可以通过一个开关来实现任意网页开启关闭这个功能呢？

答案是有的，我们需要借助 Chrome 的书签功能。

1.  打开书签管理页
2.  右上角三个点「添加新书签」
3.  名称随意，粘贴以下代码到网址中

```
    javascript: (function() {
    var elements = document.body.getElementsByTagName('*');
    var items = [];
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].innerHTML.indexOf('html * { outline: 1px solid red }') != -1) {
            items.push(elements[i]);
        }
    }
        if (items.length > 0) {
            for (var i = 0; i < items.length; i++) {
            items[i].innerHTML = '';
        }
            } else {
            document.body.innerHTML +=
            '<style>html * { outline: 1px solid red }</style>';
        }
        })();
```

然后我们就可以在任意网站上点击刚才创建的书签，内部会判断是否存在调试的 `style`。存在的话就删除，不存在的话就添加，通过这种方式我们就能很方便的通过这个技巧查看任意网页的布局了。

PS：以上书签的技巧参考自[此处](https://link.juejin.cn?target=https%3A%2F%2Fgist.github.com%2Fvcastroi%2Fe0d296171842e74ad7d4eef7daf15df6 "https://gist.github.com/vcastroi/e0d296171842e74ad7d4eef7daf15df6")，原内容略微繁琐，笔者改动了 `style` 中的内容。

最后
--

> 文章首发自笔者的 [博客](https://link.juejin.cn?target=https%3A%2F%2Fyuchengkai.cn%2Fhome%2F "https://yuchengkai.cn/home/")

觉得内容有帮助可以关注下我的公众号 「前端真好玩」咯，定期分享以下主题内容：

*   前端小知识、冷知识
*   原理内容
*   提升工作效率
*   个人成长

![](/images/jueJin/16cc957a063731e.png)