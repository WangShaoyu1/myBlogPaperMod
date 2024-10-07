---
author: "程序员晓凡"
title: "GitHub上狂揽62Kstars的程序员做饭指南"
date: 2024-06-24
description: "作为一名程序员，我们经常会在全球最大的同性交友网站GitHub上寻找一些优质的开源项目来学习，以提升自己的专业技能。今天给大家推荐的是一个GitHub上狂揽61K⭐⭐的开源项目。"
tags: ["程序员","产品","Docker"]
ShowReadingTime: "阅读4分钟"
weight: 887
---
### 写在前面

作为一名程序员，我们经常会在全球最大的同性交友网站 GitHub上寻找一些优质的开源项目来学习，以提升自己的专业技能。

今天给大家推荐的是一个GitHub上狂揽61K⭐⭐的开源项目。项目名叫做`HowToCook`,只听名字，大家应该能想到这是一个教程序员怎么做饭的项目。

作为一个程序员，你会愿意去学习这个项目，提升自己的软技能么？

如果愿意，那就跟着小凡继续往下看，看看项目能给我们带来什么？

### 一、项目简介

#### 1.1 项目地址

地址：[github.com/Anduin2017/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FAnduin2017%2FHowToCook "https://github.com/Anduin2017/HowToCook")

#### 1.2 项目基本信息

项目中不包含任何代码，旨在提供程序员在家做饭指南。目前已有`62.1k stars`,项目属于作者长期维护项目，最近更新是在三天前。

![项目基本信息](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2189b1d8e4bb47798f0d7a5cc9bb7bc6~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1608&h=854&s=121643&e=png&b=ffffff)

#### 1.3 项目初衷

作者希望结合自己多年做饭经验，准备用更清晰精准的描述来整理常见菜的做法，以方便程序员在家做饭。

下面是作者自述的初衷

![项目初衷](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ebaded444c0460e93b8b1f12a16ba38~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=870&h=318&s=46224&e=png&b=fffefe)

### 二、项目本地部署

项目支持本地部署web服务，仅需简单一步即可完成本地化部署

安装完`Docker`后运行下面命令即可

bash

 代码解读

复制代码

`docker pull ghcr.io/anduin2017/how-to-cook:latest docker run -d -p 5000:5000 ghcr.io/anduin2017/how-to-cook:latest`

部署完成后，大概是下面这样子的，作者也提供了访问地址：[cook.aiursoft.cn/](https://link.juejin.cn?target=https%3A%2F%2Fcook.aiursoft.cn%2F "https://cook.aiursoft.cn/")

![部署完成后](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c58ab8d5fee493991ecd5561f7860c0~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1908&h=912&s=126399&e=png&b=fefefe)

### 三、pdf阅读

为了方便小伙伴阅读，作者还贴心提供了在线pdf阅读。地址：[cook.aiursoft.cn/document.pd…](https://link.juejin.cn?target=https%3A%2F%2Fcook.aiursoft.cn%2Fdocument.pdf "https://cook.aiursoft.cn/document.pdf")

![pdf阅读](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b1f25315c3f44948173b181286ea6a6~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1890&h=980&s=104662&e=png&b=474b4e)

### 四、How To Cook

看到这儿的小伙伴，一定是一个爱做饭或者是吃不动外卖想要尝试做饭的小哥哥or小姐姐。

我们马上进入项目的主题，跟着作者脚本来开启做饭之旅

#### 4.1 做菜之前

作者没有刚上来就叫我们如何做一道菜，而是先来做菜之前的一些准备工作。

很符合我们的一贯作风，从入门到放弃 从入门到精通的精髓。

*   厨房里需要准备啥
*   如何选择现在吃什么
*   高压力锅
*   去腥
*   食品安全
*   微波炉
*   学习焯水
*   学习炒与煎
*   学习凉拌
*   学习腌
*   学习蒸
*   学习煮

由于文章篇幅原因，内容就不一一例举出来了。感兴趣的小伙伴可以自行上GitHub查看，我们只截取部分来说说作者的用心程度

![厨房准备](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/476e1c9676d34c339d395779fb7d4333~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=850&h=756&s=58251&e=png&b=fbfbfb)

厨房准备中，我们会看到电子秤（或天平）、游标卡尺、量筒、停表、烧杯、测温枪、移液器这样的工具。

是的你没看错，作者在后面的菜谱中对于食材的选取都很精确，没有少许，少量这样的量词，更多的是2个，100ml、300g 这样的精确量词。

没错这就是程序员思维，多年经验积累，一个字严谨 ~

再比如，在如何选择现在吃什么的时候，作者也给出了**严谨**的算法

![image-20240623122846656](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/824c24070e784f658039321cb05ed4af~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=690&h=656&s=45718&e=png&b=fefefe)

#### 4.2 菜谱

有了做饭基本常识及饭前准备之后，接下来就要根据作者提供的海量食谱中开始实操了

作者按照种类，对食谱进行了如下划分

*   素菜
*   荤菜
*   水产
*   早餐
*   主食
*   半成品加工
*   汤与粥
*   饮料
*   酱料和其他材料
*   甜品

![image-20240623124027124](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac02772d89414634a2af0df389498111~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=321&h=350&s=11265&e=png&b=ffffff)

![image-20240623124040945](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a364123bc7204e809e2e29f9e6152a98~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=286&h=353&s=11984&e=png&b=ffffff)

![image-20240623124101197](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7806fbc3c2741f987e50e0d2449fa56~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=357&h=351&s=10725&e=png&b=ffffff)

![image-20240623124112189](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09bdaa3ae8ba4451963b8625fadbf14d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=424&h=358&s=13895&e=png&b=ffffff)

![image-20240623124121792](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83b5e7410c2049c48f9ab33a2339044c~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=359&h=360&s=11224&e=png&b=ffffff)

![image-20240623124131882](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/219ad790456a47b7b5d63b87389da3fd~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=334&h=324&s=12187&e=png&b=ffffff)

![image-20240623124142100](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1e6a50b0d0c496d9d6818b9ce4ab196~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=381&h=362&s=12709&e=png&b=ffffff)

![image-20240623124150894](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b89516d133d04579b0033acf8f0a5f4c~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=375&h=359&s=13117&e=png&b=ffffff)

只要上面的菜谱学会了其中一部分，是不是就可以告别愁每天吃什么的烦恼了呢？而且可以做到每天不重样~

我们来看一个简单的菠菜炒鸡蛋的做法

![菠菜炒鸡蛋](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a0bcdf5f8774212bf69e1bf3f3d5604~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=681&h=575&s=579541&e=png&b=ccbbb1)

**必备原料和工具**

*   菠菜
*   鸡蛋
*   食用油
*   食用盐

**计算**

按照 1 人的份量：

*   菠菜 350g
*   鸡蛋 2 个
*   食用油 15ml
*   食用盐 5g

**操作**

*   菠菜去根，洗净，放在篮子里，焯水
*   将鸡蛋打入碗中，搅匀
*   热锅，加入 10ml 油
*   油热后，倒入鸡蛋液，中火翻炒 15 秒，先煎成蛋饼，然后再用锅铲切成小块
*   关火，将鸡蛋块 盛到盘子中，不要洗锅
*   重新开火，倒入 5ml 油，油热后，放入菠菜，大火 翻炒 15 秒后，倒入鸡蛋块，翻炒均匀
*   加入 5g 盐、100ml 饮用水，大火 翻炒 10 秒
*   关火，盛盘

### 五、进阶知识学习

循序渐进，经过之前食谱的锻造之后，我们需要继续修炼。那就需要掌握跟多的技巧了

在进阶篇，作者还给出了一些厨艺进阶教程

*   辅料技巧
*   高级专业术语
*   油温判断技巧

### 六、行为准则

项目采用一个较弱的许可协议，任何人都可以自由复制，修改，发布，使用，编译，出售或以菜谱的形式或菜的形式分发，

无论是出于商业目的还是非商目的，以及任何手段。

社区可以使用这个仓库训练任何类型的 AI ，并且允许商业使用。

本期内容到这儿就结束了 _★,°_:.☆(￣▽￣)/$: _.°★_ 。 通过介绍，你是否也对做饭感兴趣了呢。

是否想要提升自己的软技能呢，希望对您有所帮助。

我们下期再见 ヾ(•ω•\`)o (●'◡'●)