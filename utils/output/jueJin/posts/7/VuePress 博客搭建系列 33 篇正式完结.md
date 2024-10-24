---
author: "冴羽"
title: "VuePress 博客搭建系列 33 篇正式完结"
date: 2022-03-29
description: "这个系列从2021年12月13日开始发布第一篇，到 2022 年 3 月 10 日发布最后一篇，感谢各位朋友的收藏、点赞，鼓励、指正。本篇聊一聊我为什么会写这个系列，以及写作这个系列中的一些感悟。"
tags: ["前端","VuePress","Vue.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:86,comments:0,collects:34,views:4942,"
---
前言
--

VuePress 博客搭建系列是我写的第 6 个系列文章，前 5 个系列分别是 [JavaScript 深入系列](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F17 "https://github.com/mqyqingfeng/Blog/issues/17")，[JavaScript 专题系列](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F53 "https://github.com/mqyqingfeng/Blog/issues/53")、[underscore 系列](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F79 "https://github.com/mqyqingfeng/Blog/issues/79")、[ES6 系列](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%23es6-%25E7%25B3%25BB%25E5%2588%2597 "https://github.com/mqyqingfeng/Blog#es6-%E7%B3%BB%E5%88%97")、[TypeScript 系列](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%23typescript4-%25E5%25AE%2598%25E6%2596%25B9%25E6%2596%2587%25E6%25A1%25A3%25E7%25BF%25BB%25E8%25AF%2591%25E6%2594%25B6%25E5%25BD%2595%25E5%259C%25A8-tsyayujscom "https://github.com/mqyqingfeng/Blog#typescript4-%E5%AE%98%E6%96%B9%E6%96%87%E6%A1%A3%E7%BF%BB%E8%AF%91%E6%94%B6%E5%BD%95%E5%9C%A8-tsyayujscom")。

VuePress 博客搭建系列共计 33 篇，讲解使用 VuePress 搭建博客，进行各种优化，为博客增添各种功能，并部署到 GitHub、Gitee、个人服务器平台的全过程。

这个系列从 2021年12月13日开始发布第一篇，到 2022 年 3 月 10 日发布最后一篇，感谢各位朋友的收藏、点赞，鼓励、指正。

顺便宣传一下该博客的 GitHub 仓库：[github.com/mqyqingfeng…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog "https://github.com/mqyqingfeng/Blog")，欢迎 star，鼓励一下作者。

本篇聊一聊我为什么会写这个系列，以及写作这个系列中的一些感悟。

起因
--

之所以会开始写这个系列，也是无心插柳，我在翻译完 TypeScript 官方手册之后，突然想到做个站点，或许更方便大家阅读，于是便做了这样一个站点： [TypeScript 中文文档](https://link.juejin.cn?target=https%3A%2F%2Fts.yayujs.com%2F "https://ts.yayujs.com/")。

之所以选择用 VuePress，并不是因为我擅长 Vue，恰恰我从来没有用过 Vue，之所以用 VuePress，更多是因为 Vue 的受众甚广，使用 Vue 风格的文档大家会更有熟悉感。

在我准备搭建这个站点的时候，VuePress 2.x 还在 beta 中，VitePress 也有少量应用，考虑到我想快速搭建一个站点，由于 VitePress 不兼容当前的 VuePress 生态，所以我就选择了 VuePress，至于为什么没有选择 beta 测试版，是因为很多生态中的主题和插件还没有升级，于是我就用了最为稳定的 VuePress 1.x，所以这个系列文章也是基于 VuePress 1.x 写的，像个别函数名和使用方式，到了 VuePress 2.x 中就变了，如果是使用 VuePress 2.x 的同学请千万注意。

刚开始我是使用 GitHub Pages 搭建的，因为 GitHub 的屏蔽原因，我又用 Gitee Pages 搭建了一份，后来一想，为啥不自己搞个域名和服务器呢，于是我就自己买了域名和服务器，最终做了这个站点。

边做我边写文章分享，一开始预计写 8 篇左右，结果写起来一发不可收拾，各种要做的事情一研究，都可以单独成文了，随着站点的不断优化，我也将自己的实现分享出来，最终如你所见，写了 33 篇，其实纵观每一篇都是一个非常小的知识点，但综合起来，却又横跨了不少知识领域。

希望这个系列的读者能有所收获，不仅仅是搭建成功自己的站点，更是能在这个过程中对很多东西的原理有所理解，这样再处理相似的问题时，才能举一反三。

感慨
--

更新这个系列文章我最大的感受或许就是：这种文章真好写……

像我往常写的文章都是原理类的，写一篇文章往往要通读很多文章、书籍，然后再根据自己的思路写出来，但这种实践类的文章，记录遇到的问题，写下解决问题的方式即可，一天一篇简直是太简单了……

虽然我也希望写的有点深度，像 VuePress 的源码、主题的源码、markdown-it 的源码，很多插件的源码我都翻过并写了解析，但由于我本身并不想在这方面花费太多时间，毕竟只是顺手写的文章，花大量时间研究透原理，正事却没干，实在是捡了芝麻漏了西瓜，所以更多是大致的梳理，很多时候，问题解决了，哪怕解决的方式不优雅不完美也都算了，或许这跟很多做业务的同学很像，只求解决问题，但却不花时间优化问题的解决方式。

由此我也依据自己的亲身经历，得出结论：那些日更作者，写的文章一定不怎么样！

当然这句我也说了我自己，一个人没有大量的输入，就在疯狂的输出，写出的文章要不然就是简单，一天就可以学会解决的内容，要不然就是彻头彻尾的水文。我希望我至少是属于前者。

所以不要敬佩那些日更的作者，他们日更写的章一定不怎么样，作者的水平在日更的过程中，只能保证下限，却提高不了上限。

当然这样说，并不是在说这个系列文章的品质不好，毕竟作者是我，只是很多细节上我个人感觉依然有优化和完善的空间，而且写了 33 篇，我觉得这可能是业界关于 VuePress 博客搭建最完善系统的教程了。

实际上，在我更新这个系列文章的过程中，有很多同学跟着系列教程创建了自己的站点，在我的群里就有同学分享跟着我的文章[《一篇教你博客如何部署到自己的服务器》](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F243 "https://github.com/mqyqingfeng/Blog/issues/243") 1 个小时就部署了 vuepress 博客，但我自己一个人在做的时候，自己装先花了一天，为了写这篇文章，重置了服务器，边装边写又花了一天。虽然不像一些作者十天半月打磨一篇文章，但也在力所能及的范围内尽可能完善的写文了。

下期预告
----

原本预计更新完博客搭建系列，将回归到 TypeScript 系列的写作中。

TypeScript 系列是一个由官方文档翻译、重难点解析、实践技巧与总结三个部分组成的系列文章，全系列预计 40 篇左右。目前已完成了[官方文档 Handbooks 的翻译](https://link.juejin.cn?target=https%3A%2F%2Fts.yayujs.com "https://ts.yayujs.com")，接下来就准备写重难点解析部分。

但时值金三银四，在我读者群里的同学也经常讨论面试相关的内容，所以我想在三月的时候，专门整理面试相关的内容，写一份前端面试手册，帮助更多的同学。

但与讲解单独的前端面试题不同，我认为，对于面试，面试前的长时间准备，写简历，找公司，找内推，面试技巧都很重要，而这些方面。很多人经验太不足了，也没有意识学习和优化，所以我想写一份完整的从技术准备，到简历，到找公司，到面试技巧的系列文，讲其中的道和法，而不是执着于器和具体的面试题目。

感谢大家的阅读和支持，我是冴羽，下个系列再见啦！\[\]~(￣▽￣)~\*\*