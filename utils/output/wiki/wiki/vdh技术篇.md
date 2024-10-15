---
author: "王宇"
title: "vdh技术篇"
date: 二月03,2023
description: "任鹏"
tags: ["任鹏"]
ShowReadingTime: "12s"
weight: 334
---
虚拟人技术篇

虚拟人是一个技术的综合体，是人类用科技拟合自身的浪漫探索与想象。虚拟人本质上是对人的一种模拟，CG技术、人工智能技术等的不断发展。虚拟人是一个技术的综合体，是人类用科技拟合自身的浪漫探索与想象。

  

[Edit Edit](/plugins/namymap/shownamymapeditor.action?mindmapName=vdh&lastPage=%2Fpages%2Fviewpage.action%3FpageId%3D95553306&pageId=95553306&isViewMode=false) [Show Show](/plugins/namymap/shownamymapeditor.action?mindmapName=vdh&lastPage=%2Fpages%2Fviewpage.action%3FpageId%3D95553306&pageId=95553306&isViewMode=true) Remove Remove //<!\[CDATA\[ jQuery("#06501").mousedown(function(e) { var parameters = {width: 700, height: 180, id: "remove-dialog", closeOnOutsideClick: false}; var dialog = new AJS.Dialog(parameters); var originalPopupHide = dialog.popup.hide; dialog.popup.hide = function() { anyDialogVisible = false; originalPopupHide.apply(this, arguments); AJS.trigger("hide.dialog", {dialog: dialog}); }; dialog.addHeader("Map remove confirmation"); dialog.addPanel("Confirmation", "<p>Your map will be deleted from the page and from attachments. Do you really want to remove your map?</p>", "remove-dialog-body"); dialog.addButton("Yes", function (dialog) { var url = "/plugins/namymap/removenamymap.action?mindmapName=vdh&amp;lastPage=%2Fpages%2Fviewpage.action%3FpageId%3D95553306&amp;pageId=95553306"; window.location.href = url.replace(/&amp;/g, "&"); }); dialog.addCancel("No", function (dialog) { dialog.hide(); }); dialog.show(); }); //\]\]>

[![](/download/attachments/95553306/vdh.png?version=1&amp;modificationDate=1675406819479&amp;api=v2)](/plugins/namymap/shownamymapeditor.action?mindmapName=vdh&lastPage=%2Fpages%2Fviewpage.action%3FpageId%3D95553306&pageId=95553306&isViewMode=true)

人=「身体+灵魂」+「世界+人设」

身体和灵魂，灵与肉，这是组成生命的唯二两个部分，我想这个结论应该是大多数人都能认可的。我这里说的身体可以译为body，主要是指我们自身上“有形”的那一部分，包括我们的躯干、四肢、手脚，以及看的见的表情动作等；相对的，灵魂可以译为soul，这里主要是指我们身上那些“无形”的部分，例如我们的感知、意识、知识、感情等。

有了身体与灵魂，我们可以说已经得到了一个“人”了，但仅仅这样还是不够的。马克思说过，“人是一切社会关系的总和”。一个人的社会属性很重要，对于虚拟人来说也是如此。

对于虚拟人的社会属性，我也把它简单概括为两个方面：世界和人设。世界代表外部环境，虚拟人也需要一个生活的空间，一个舞台，这是外界给TA的；人设代表内部环境，虚拟人也需要有社会属性，需要合适的外貌、技能、性格……这是TA回馈给外界的。那么，以上这四个元素是如何作用的，从技术的角度又是如何实现的，且听我细细道来。

1\. 身体

从唯物的角度来看，身体是人必不可少的组成部分。这里，我把身体这个元素进一步拆成两个要素，分别是：静态+动态。

1）静态

指人的外观，对于真人而言，外观有高矮胖瘦、肤色、男女等区别，而对于虚拟人而言，还增加了“画风”这一维度，虚拟人的外观可以包括二次元、3D、超写实，甚至赛博朋克等，目前，虚拟人的外形主要靠美术设计师和3D建模师共同实现。

2）动态

指人的动作，一般来说，人的动态分为三个主要部分：

躯体动作面部表情口型动作这一点对于真人和虚拟人都是比较类似的（虚拟人暂时不涉及动耳朵、动头皮这种高级艺能）。虚拟人的动态主要依靠驱动技术来实现，目前驱动技术主要有真人驱动和AI驱动两种流派。

2\. 灵魂

就像电影《心灵奇旅》里演的那样，灵魂也是一个人的重要组成部分。对于虚拟人来说，灵魂主要是通过AI技术来打造的。这里，我把灵魂也分成了几个要素：

1）感知

感知是人最生物性的层面，主要是和我们的五感有关，具体来说就是看、听、说三个部分，分别由眼睛、耳朵、嘴来负责，结合到AI能力，就是CV、ASR、TTS。

2）认知

认知是在感知的基础上进一步形成的思考能力，这里我把认知能力进一步分成两个方面，分别是理性的认知能力和感性的认知能力，其中，理性的认知还可进一步分为知识储备、理解、决策三个层级的能力，对应于AI中的KG、NLP、ML；感性的认知主要指的是利用AI构建的情感识别功能。

3）创造

就像我们小学的时候会先学习汉字，学习造句，再学习写作文一样，创造是更高一级的智力活动，只有在进行过大量的学习之后，才能进行有效的创造，人如此，虚拟人亦如此，虚拟人的创造主要依赖于生成类的AI算法来进行输出。

3\. 世界

对于一个人，我们要给他一个世界，一个舞台，这个人才算有了一个全面展示自己的空间，虚拟人亦如此，这个世界就是虚拟人生活的空间。关于世界，这里我也（强行）分成两个要素：

1）渲染

渲染就是让这个虚拟的“人”呈现在我们面前，渲染技术分为离线渲染、实时渲染等，渲染技术的选型会直接影响虚拟人的呈现效果，你看到的是4k还是1080p与它有直接关系，渲染技术很大程度上决定了虚拟人演出的舞台效果。

2）终端

虚拟人没有物质性的实体，目前阶段我们必须借助终端才能看到它，现在可以承载虚拟人终端的设备数量越来越多，移动端、IoT、VRAR等都有大量的空间。在未来，虚拟人技术也有可能真正和实体机器人进行结合，变身成真正几乎“以假乱真”的智能体。

4\. 人设

我们总说明星有人设，其实每个人都有人设。人生在世，谁又能时时刻刻保持自己永远都是一个耿直的real boy/real girl呢？我们在面对家人、朋友、同事时，甚至会换上不同的人设。对于虚拟人而言，这也是一样的，而且由于虚拟人现在还比较「笨」，不能像真实的小精灵鬼们一样多种人设无缝切换，因此，对于每一个虚拟人而言，打造一个专有场景的专有人设至关重要。

人设就是面向社会和公众在特定场景下所表现出来的品牌、IP等，一个好的人设，不仅仅需要合适的外形风格、肢体动作，也需要合适的知识储备、谈吐风格、甚至创作风格。人设不是一个技术类的概念，它更偏向于产品和运营方面。

运营好一个IP类虚拟人，和经纪公司运营一个明星的道理是一样的，甚至有更大的难度，而拥有好的人设IP运营sense的企业在虚拟人赛道甚至元宇宙时代里脱颖而出的概率也是极大的。

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)