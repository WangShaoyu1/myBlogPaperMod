---
author: "腾讯云开发者"
title: "AIGC浪潮下，鹅厂新一代前端人的真实工作感受"
date: 2023-07-12
description: "AIGC 这一时代潮流已然不可阻挡，我们要做的不是慌乱，而是把握住这个时代的机会。本文就和大家一起来探索在 AIGC 下，前端工程师即将面临的挑战和机遇。"
tags: ["前端","AIGC中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读16分钟"
weight: 1
selfDefined:"likes:239,comments:0,collects:169,views:20723,"
---
![](/images/jueJin/6e275725c3b74c4.png)

![动图封面](/images/jueJin/083b79fcf18649a.png)

腾小云导读

AIGC 这一时代潮流已然不可阻挡，我们要做的不是慌乱，而是把握住这个时代的机会。本文就和大家一起来探索在 AIGC 下，前端工程师即将面临的挑战和机遇。聊聊从以前到现在，AIGC 给我们带来了怎么样的变化，下一代前端工程师又该何去何从？

目录

1 疯狂的 AIGC

2 范式迁移 —— AIGC 下开发模式改变的本质

2.1 命令式 -> 声明式

2.2 声明式 -> AIGC 式

3 下一代前端工程师

3.1 要善于利用

3.2 要纵观全局

3.3 要懂得批判

3.4 要合理使用

4 未来可期

5 望天下再无码农

6 探讨 6.1 AIGC 下，前端会消失吗？

6.2 前端开发工程师会过分依赖 AI 吗？

01疯狂的 AIGC
----------

记得 ChatGPT4 刚出来的时候，OpenAI 总裁 Greg Brockman 用笔和纸画了一个网页草图，GPT4 仅用几秒的时间便完成了网页的设计和代码的编写。

![](/images/jueJin/c1a82cc416324a4.png)

不知道当时前端同学们看到是个怎样的想法哈，反正我当时心都凉了，好不容易把 vue 的源码搞懂了，这就没啥用了，饭碗砸了，蓝瘦香菇。

好吧，开个玩笑 。AI 已然如此，此时就不得不问那个老生常谈的问题了，前端工程师们该何去何从呢？

想来定有一些同学持悲观态度：前端已死，不值得做下去了，AI 马上就替代了。也会有些同学与之相反吧：AI 降临，神级辅助，又不吃经济，又有大用。

我想说的是，AIGC 一定会对前端开发的未来会产生重大影响，至于这个影响对于前端工程师来说，是正是反，从来都不是工具决定的，而是用工具的人来决定的。我们要做的，不是去担忧焦虑，而是把握住它。

02、范式迁移 —— AIGC 下开发模式改变的本质
--------------------------

在这之前，我们先来聊聊前端开发这些年的发展。

### 2.1 命令式 -> 声明式

**命令式：关注过程，代码能够与自然语言产生一一对应的关系，代码本身描述的是“做事的过程”。**

**声明式：关注结果，过程在背后，暴露给用户的是声明的结果。**

![](/images/jueJin/5c2dc78f534d4dd.png)

前端开发范式演变：命令式 -> 声明式

jQuery 是命令式开发的典型代表。这种范式的出现让前端开发变得高效，但还远远不够。因此，随着 Vue React 的现世，前端开发迅速地从命令式迁移到了声明式。

可能经常会在社区看到这样的提问：“该学 Vue 还是 React 呢？项目该用 Vue 还是 React 呢？”，这个问题一直都在争论，一直也没有一个明确的答案。可如果有人问到：“该用 jQuery 呢还是 MVVM 框架开发呢？”，我想这个问题是有标准答案的。

为什么会这样呢？很简单，jQuery 和 Vue React 的最本质的区别就在于范式的不同，从命令式到声明式的进化。

为什么前端领域普遍接受了这种范式的迁移？在我看来，有两个原因：

*   **效率的极大提高**
    

业务逻辑越复杂，命令式需要做的工作便越多，因为你要完整去描述整个过程才能实现。而声明式却不需要，只要把结果交给声明式框架，声明式框架背后的命令帮忙做了大量的工作，所以在效率上，命令式和声明式不可同日而语。

*   **更完整更系统**
    

jQuery 只是一个工具，它能做的仅仅是在使用层面加一点速，无法带来质变。而声明式的框架带来了完整的开发体验、系统的打包和发布。

### 2.2 声明式 -> AIGC 式

**我也不知道该如何命名，索性就将其称为 “AIGC式” 了。**

![](/images/jueJin/5424e0a18bef483.png)

前端开发范式演变：声明式 -> AIGC 式

虽然声明式为前端开发带来了极大提升，从效率和完整性皆是。但，有一点它还是没有解决，还是有大量的重复劳动性的工作需要开发者来实现，比如模板编写、样式开发、基础函数编写等等，

这也是为什么，社区出现了大量的诸如低码这样工具来力图解决此问题。

设计稿转代码：像我这样的切图仔几乎每天都在使用的 CoDesign/Figma，能够很大程度上解决手动写模板写样式的工作。 图片转代码：相较设计稿转代码，它想要做得更多，直接生成模板结构和样式，一键复制即可在项目中运行，比如 imgcook。低代码/零代码：似乎几乎每隔几年就会在社区里炒起来，以腾讯的 UICore 为代表的，在声明式范式下，为能够更加彻底地解决重复劳动，降低开发成本而出现。

工具虽多，也很好用，但这些工具发展了这么多年，似乎并没有能够彻底改变前端开发。

为什么呢？因为这些工具相对于声明式而言，其实和 jQuery 相对于原生 js 是一样的。都没有逃离所处的范式，jQuery 没有逃离 js 的命令式，这些工具也没有逃离声明式。

**原地打圈，不得始终。**

那 AIGC 式做到了吗？当然，否则也不用讲了对吧。声明式仍然需要前端工程师辛苦地码代码，即便有工具可以提效，但码农依旧得不到解放，至少大部分业务情况下是无法解放的。

而 AIGC 彻底地颠覆了这一范式，具体如何颠覆的，相信文章开头的视频已经给出了答案，从理解到设计再到编码，甚至部署发布， AI 已经不可阻挡了。

那在这样的范式下，作为前端工程师，要怎么样才能亦步亦趋紧跟紧跟再紧跟呢？

03、下一代前端工程师
-----------

AIGC 对前端工程师，准确来说对所有人，都是福音而绝不是洪水猛兽。接纳它，用好它，让它成为自己的 copilot。

很多同学会担心 AI 会取代自己，或多或少都有些许担忧，居安思危是没错的，但完全没必要过多焦虑，我们要做的很简单：

学会使用工具：人类和动物的区别，不就是因为人类会探索会使用工具吗？工具的出现绝不是为了取代人类，而是服务于人类。 拥抱它、融入它：不知道五六十年代的前辈们刚接触电脑时是怎样的想法，想来，也会有些人会觉得电脑会替代自己吧。例如电子邮件的出现，那些靠写信为生人一定会有这样的担忧吧，此时，如果他们故步自封不懂得接纳和拥抱电脑，那么在时代潮流之下，等待他们的一定是被取代；可如果他们拥抱它并且融入它，把电子邮件当做一个工具，以此来提高写信的效率和质量，甚至拓展自己的领域，那么浪潮带来的，一定是肥美的大餐。

### 3.1 要善于利用

用好，你就已经超越了大部分人了，所谓的码农，不就是用好了某个领域的计算机语言。对于前端开发而言，AI 无疑是最趁手的帮手。

**快速生成**

正如文章开头视频所示，一个草图就能生成网页代码，如果这个图不是草图，而是完整的设计稿呢？当然，很多同学会问，这与 imgcook 不就差不多了，非也非也，imgcook 是固定模式下的产物，而这个生成是自由、灵活且方便的。除了图以外，文本描述同样能实现相应的效果。

![](/images/jueJin/004a18ef9c4d470.png)

ChatGPT 生成网页

实现的基本效果如下，做到如下，看起来是简陋了一些，但是可以在此基础上继续让 AI 进行丰富。

![](/images/jueJin/813665641164499.png)

ChatGPT 生成网页的结果

*   **代码编写**

相信非常多的同学都已经用 GPT 来辅助写过代码了，写个冒泡啥，但这似乎无法用在我们工作中哈，下面就举几个在我实际工作中 AI 辅助写代码的例子吧，算是简单地抛一块砖：

**辅助写正则：**

正则本身不难，但要想写好写全以避免遗漏，还是有难度的，而且我们的工作中经常会遇到些正则的场景。

前端大神 antfu 的一个用于在 vue2 中写 script setup 的插件中就用到了正则，但他也没写全，导致匹配问题。

希望匹配的字符串是：

```xml
<script 任意字符 setup 任意字符 />
```

库中写的正则如下：

```scss
/<script\s(.*\s)?setup(\s.*)?>/
```

一眼看起来没啥问题，可是，这个正则没匹配到换行的场景。

```xml
<script
任意字符
setup
任意字符
/>
```

遗漏很正常，且看如何利用 AI 来修复这个问题：

![](/images/jueJin/6d749af67e3f44c.png)

ChatGPT 生成正则

![](/images/jueJin/5875c8ed3cdb4e9.png)

ChatGPT 对生成的正则进行解释

只需要简单地描述清楚需求，就能得到答案。**也许最终答案并非完全正确，但至少它能给你巨大的帮助和启发。**

**复杂逻辑编写：**

对于大部分做中后台前端项目的前端来说，似乎自己更多的是 js 工程师，要做的就是逻辑上的处理，比如想要实现文件切片上传，每一片 512 kb，如果文件小于 1M，不需要分片，同时，分片的情况下为每一片打好标记以便于后端接口。

将此任务交给 GPT，让其完成功能方案设计，逻辑编写。

![](/images/jueJin/9a7dd69c63e34b6.png)

ChatGPT 生成功能方案

具体的结果这里就不展示了。

**代码检查：** 只要是人写的，就难保不会出错，所以 CR 基本都植入到了工作流之中。现在完全可以让 AI 来帮忙完成这一过程。当然，要注意资产隐私问题。

![](/images/jueJin/f462aafa5d67404.png)

ChatGPT 进行代码检查

### 3.2 要纵观全局

声明范式下，**前端工程师是作为 “框架” 与 “产品” 之间的桥梁。** AIGC 下，**前端工程师成为了 “AIGC” 与 “产品” 之间的桥梁。**

可能有些同学不太理解这段话，下面我们来从开发流程上来解释一下。

在以前，从需求文档到最终产品上线，存在 4 个层级：

产品经理自然语言编写的需求文档； 产品经理描述需求时，前端工程师构建的业务逻辑； 前端工程师将业务逻辑转化为代码逻辑； 用框架语言实现业务逻辑。

其实，前端工程师在整个流程中充当一个什么样的角色呢？很简单，就是 “框架” 和 “需求文档” 间的中间人，前端工程师将需求文档翻译成框架语言，就这么简单。

在 AIGC 下，整个开发流程发生了变化，层级只有 3 个了：

产品经理自然语言编写的需求文档； 产品经理描述需求时，前端工程师构建的业务逻辑； 前端工程师利用 AI 来实现业务逻辑。

此时，前端工程师仅需要用自然语言来描述业务逻辑，然后交给 AI，让模型输出代码。自然，此时，前端工程师的角色就是将业务逻辑搬运给 AI。

比如，某产品（网页）上希望能实现一个定时推送消息的功能（用户持续访问网页 30s 后推送）。此时，在前端工程师看来，其代码逻辑就是一个定时器，用自然语言就给 AI 来实现即可：

![](/images/jueJin/697398f2baa4448.png)

业务逻辑转化为代码逻辑

在 AI 进入开发流程后，前端工程师能做的不仅仅只有简单的逻辑转义到框架了，还能做地更多。

*   **设计系统**

前端设计系统描述了系统的主题、复用的组件以及区域等，然后基于此来搭建一个或多个产品的最终的网页或者应用程序，从而简化大规模的设计。 之前，这样一套设计系统几乎都是由设计和交互同学来进行制定。但是使用 AI 辅助下，前端工程师同样可以做到，比如：

利用 AI 设计一套定制的主题、组件、设计语言和研发框架。 或者基于现有设计系统，获得更优设计系统的建议。

*   **产品设计**

产品的设计需要考虑非常多的因素，市场、人群、地域等等，基于对这些因素的了解缺乏，前端工程师对于产品功能的设计几乎很难提供有效的建议，而前端工程师是真正离用户最近的一环，应当具备相应的敏感度。在 AI 的辅助下，这些因素不再是困扰前端工程师参与产品设计的障碍了。

### 3.3 要懂得批判

**把 AI 用到平时的开发中能够极大地提高效率，但 AI 所给到的信息就一定是符合的吗？**

除了与 AI 工具合作，控制它们产生的输出，前端工程师还应该花更多时间专注于 AI 的产出的准确性。我们可以用 AIGC 的产物来增强和改善网站和应用的用户体验。但是，这些产物可能并不完美，存在一些缺陷和问题，因此进行评估和解决。

AI 可以给工程师赋能，工程师也应当发挥领域专业知识和判断力，以确保最佳结果。

*   **评估 AI 产物的可靠性和效果**

需要对使用 AI 产物的效果进行评估，以确保其能够达到预期的效果。这包括对 AI 产物的性能、准确性、稳定性等方面进行评估，以确保其能够满足用户的需求和期望。

*   **改进 AI 产物的设计和实现**

AI 辅助完成了重复性劳动工作，但对于不完美的 AI 产物，设计和实现进行改进，以提高其可靠性、效果和用户体验。

### 3.4 要合理使用

**工具是来辅助你的，不是替代你的。**

需要明确的是，AI 工具并不能替代我们的工作，它们只是辅助我们完成工作的工具。因此，掌握好专业领域知识，才能更好地利用 AI 工具，提高工作效率。

同时，请不要滥用 AI，AI 协助无可厚非，但所有的事情都交给 AI 不可取。

04、未来可期
-------

AI 技术是前端工程师的一种有力工具，可以帮助我们提高开发效率，消除重复劳动。相信 AIGC 下的前端工程师们不再需要把时间花在曾经的切图上，而是更加专注于领域深层的思考。

随着 AI 技术的进步，一定会有越来越多的前端工程会被自动化，这是必然的趋势。这就需要前端开发者所掌握的技能组合发生转变，紧跟技术的趋势。重要的是，前端工程师们要相信，自己永远不会被机器彻底取代。虽然 AI 能够让许多任务自动化，但它无法拥有你的创造力和独创性。

总的来说，未来乃至现在的前端工程师们需要对新技术要有高适应度，并且需能够融入 AI，学会与 AI 协作，同时不断结合自己领域知识。如此，未来的工程师们定未来可期。

05、望天下再无码农
----------

其实，一直有一个愿望，望天下再无码农。

希望 AI 迅猛发展吧，让一切的无聊重复劳动都交给 AI，让未来的前端工程师能够更多地从事创新性的工作，让机器去完成重复性的任务，让人类的智慧更好地服务于人类的社会。

愿天下再无码农。

06、探讨
-----

### 6.1 AIGC 下，前端会消失吗？

之前看到一篇文章，是这样说的，前端从 jQ 发展到 MVVM，门槛降了一波，只要会一点代码，就能拿起脚手架开撸；如今，前端从 MVVM 发展到 AIGC，前端已死呀。

我的观点是：“前端工程师永远都不会消失，它可能换了一种形态，也可能变了一种展示方式，但它绝不会消失。” 我赞同一个观点， AI 工具将会被整合进开发者工具当中，用来扩大熟练开发者的生产能力。木匠并没有被电动工具所替代，会计师没有被电子表格替代，摄影师没有被数码相机/智能手机替代，所以前端工程师也不会被 AI 替代。只是未来前端工程师到底需要怎样的技能，这个不得而知，但可以预见的是，学会使用 AI 是必经之路。

### 6.2 前端开发工程师会过分依赖 AI 吗？

很多同学认为，AI 的强大会让开发者不由自主地去使用它，未来，开发同学会不会过分地依赖 AI 呢？

我的观点是：“依赖没什么不好，如今你我不是每天都依赖电脑，依赖手机吗？看你怎么用罢了，工具没有好坏，人才会有。” 好的工具被人们所依赖，这是天道自然，我们要做的就是，不要过分依赖。有了电脑，我们依旧要学习用手写字；有了汽车，我们依旧要迈开双腿跑步；学会合理利用，自然就不会过分依赖。如果觉得本篇分享对你有帮助，欢迎转发分享。

参考链接：

\[1\] ChatCPT：[openai.com/blog/chatgp…](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fopenai.com%2Fblog%2Fchatgpt "https://link.zhihu.com/?target=https%3A//openai.com/blog/chatgpt")

\[2\] What is the Impact of AI and ML on Front-End Development?：[www.projectcubicle.com/what-is-the…](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fwww.projectcubicle.com%2Fwhat-is-the-impact-of-ai-and-ml-on-front-end-development%2F "https://link.zhihu.com/?target=https%3A//www.projectcubicle.com/what-is-the-impact-of-ai-and-ml-on-front-end-development/")

\[3\] 生成式 AI 颠覆前端：[foresightnews.pro/article/det…](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fforesightnews.pro%2Farticle%2Fdetail%2F27847 "https://link.zhihu.com/?target=https%3A//foresightnews.pro/article/detail/27847")

\[4\] 预测前端开发模式的变化：[juejin.cn/post/721618…](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fjuejin.cn%2Fpost%2F7216182763237818425 "https://link.zhihu.com/?target=https%3A//juejin.cn/post/7216182763237818425")

\-End-

原创作者｜张波

技术责编｜小苏、花叔

![](/images/jueJin/0a4822f4cb724ac.png)

AIGC 的出现给你提供了什么便利？又或者对你造成了什么影响？欢迎在[腾讯云开发者公众号](https://link.juejin.cn?target=https%3A%2F%2Fcloud.tencent.com%2Fdeveloper%2Ftools%2Fexternal-entry%3Fchannel%3Djuejin%26id%3D27 "https://cloud.tencent.com/developer/tools/external-entry?channel=juejin&id=27")评论区分享讨论。我们将选取1则最有意义的分享，送出腾讯云开发者-鼠标垫1个（见下图）。7月18日中午12点开奖。

![](/images/jueJin/f4ba0b5b88c7418.png)