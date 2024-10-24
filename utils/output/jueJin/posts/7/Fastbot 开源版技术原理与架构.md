---
author: "字节跳动技术团队"
title: "Fastbot 开源版技术原理与架构"
date: 2023-09-19
description: "本文将介绍字节自研 Fastbot 开源版技术架构、算法原理、设计实现以及常用业务配置，帮助你快速了解和入门 Fastbot 稳定性利器！"
tags: ["客户端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读16分钟"
weight: 1
selfDefined:"likes:30,comments:0,collects:33,views:15764,"
---
问题背景
====

近年来，移动应用程序的数量呈现爆炸性增长，随之而来的是用户对应用程序质量的高要求。确保应用程序的质量对于维护用户忠诚度和业务成功至关重要。然而传统的人工测试方法存在一些挑战，包括耗费大量时间和资源、可扩展性和可维护性的限制等，因此移动应用的自动化测试工具应运而生。随着人工智能时代的到来，软件测试领域不断向智能化发展，其中自动测试生成的能力一直是学术和工业界共同关注的研究热点，依靠自动生成测试能较大程度减少测试脚本的编写与维护工作量。

在实际应用中，工业级应用程序经常需要进行更新以适应不断变化的用户需求，例如，工业厂商一般每周都会发布一个新的核心应用版本，然而采用现有的自动化测试工具在这种情况下效果一般，它们仅仅是简单地在移动应用上重新运行一次测试，缺乏对人类经验和知识的运用。Fastbot正是一款结合了强化学习和基于模型决策算法的自动化安卓测试工具，它由字节跳动软件工程实验室（[se-research.bytedance.com/）团队提出，旨在利用强…](https://link.juejin.cn?target=https%3A%2F%2Fse-research.bytedance.com%2F%25EF%25BC%2589%25E5%259B%25A2%25E9%2598%259F%25E6%258F%2590%25E5%2587%25BA%25EF%25BC%258C%25E6%2597%25A8%25E5%259C%25A8%25E5%2588%25A9%25E7%2594%25A8%25E5%25BC%25BA%25E5%258C%2596%25E5%25AD%25A6%25E4%25B9%25A0%25E7%259A%2584%25E6%258A%2580%25E6%259C%25AF%25EF%25BC%258C%25E9%2580%259A%25E8%25BF%2587%25E5%25AD%25A6%25E4%25B9%25A0%25E5%2592%258C%25E6%258E%25A8%25E7%2590%2586%25E4%25BB%258E%25E4%25B9%258B%25E5%2589%258D%25E7%259A%2584%25E6%25B5%258B%25E8%25AF%2595%25E8%25BF%2590%25E8%25A1%258C%25E4%25B8%25AD%25E8%258E%25B7%25E5%25BE%2597%25E7%259F%25A5%25E8%25AF%2586%25EF%25BC%258C%25E4%25BB%258E%25E8%2580%258C%25E8%25BE%25BE%25E5%2588%25B0%25E6%259B%25B4%25E5%25BF%25AB%25E6%259B%25B4%25E9%25AB%2598%25E6%2595%2588%25E7%259A%2584%25E6%25B5%258B%25E8%25AF%2595%25E6%2595%2588%25E6%259E%259C%25E3%2580%2582%25E6%25AD%25A4%25E5%25A4%2596%25EF%25BC%258CFastbot%25E8%25BF%2598%25E6%258F%2590%25E4%25BE%259B%25E4%25BA%2586%25E4%25B8%25AA%25E6%2580%25A7%25E5%258C%2596%25E7%259A%2584%25E4%25B8%2593%25E5%25AE%25B6%25E7%25B3%25BB%25E7%25BB%259F%25EF%25BC%258C%25E7%2594%25A8%25E6%2588%25B7%25E5%258F%25AF%25E4%25BB%25A5%25E8%2587%25AA%25E5%25AE%259A%25E4%25B9%2589%25E5%2590%2584%25E7%25A7%258D%25E9%2585%258D%25E7%25BD%25AE%25E5%258E%25BB%25E6%25BB%25A1%25E8%25B6%25B3%25E4%25B8%258D%25E5%2590%258C%25E7%259A%2584%25E6%25B5%258B%25E8%25AF%2595%25E5%259C%25BA%25E6%2599%25AF%25E5%2592%258C%25E9%259C%2580%25E6%25B1%2582%25E3%2580%2582 "https://se-research.bytedance.com/%EF%BC%89%E5%9B%A2%E9%98%9F%E6%8F%90%E5%87%BA%EF%BC%8C%E6%97%A8%E5%9C%A8%E5%88%A9%E7%94%A8%E5%BC%BA%E5%8C%96%E5%AD%A6%E4%B9%A0%E7%9A%84%E6%8A%80%E6%9C%AF%EF%BC%8C%E9%80%9A%E8%BF%87%E5%AD%A6%E4%B9%A0%E5%92%8C%E6%8E%A8%E7%90%86%E4%BB%8E%E4%B9%8B%E5%89%8D%E7%9A%84%E6%B5%8B%E8%AF%95%E8%BF%90%E8%A1%8C%E4%B8%AD%E8%8E%B7%E5%BE%97%E7%9F%A5%E8%AF%86%EF%BC%8C%E4%BB%8E%E8%80%8C%E8%BE%BE%E5%88%B0%E6%9B%B4%E5%BF%AB%E6%9B%B4%E9%AB%98%E6%95%88%E7%9A%84%E6%B5%8B%E8%AF%95%E6%95%88%E6%9E%9C%E3%80%82%E6%AD%A4%E5%A4%96%EF%BC%8CFastbot%E8%BF%98%E6%8F%90%E4%BE%9B%E4%BA%86%E4%B8%AA%E6%80%A7%E5%8C%96%E7%9A%84%E4%B8%93%E5%AE%B6%E7%B3%BB%E7%BB%9F%EF%BC%8C%E7%94%A8%E6%88%B7%E5%8F%AF%E4%BB%A5%E8%87%AA%E5%AE%9A%E4%B9%89%E5%90%84%E7%A7%8D%E9%85%8D%E7%BD%AE%E5%8E%BB%E6%BB%A1%E8%B6%B3%E4%B8%8D%E5%90%8C%E7%9A%84%E6%B5%8B%E8%AF%95%E5%9C%BA%E6%99%AF%E5%92%8C%E9%9C%80%E6%B1%82%E3%80%82")

下面将逐一介绍工具的工作流程、核心概念、算法原理、设计实现以及常用配置，深入了解其在提升移动应用测试效率的能力。

工作流程
====

![](/images/jueJin/1467be31c5b94c8.png)

Fastbot 是一种利用强化学习的可复用的基于模型的自动化安卓测试工具。它接受一个给定的应用程序版本，以 APK 文件的形式作为输入，并输出覆盖报告和找到的崩溃。Fastbot 的工作流程包括两个主要阶段，如图所示：

**（a）** 测试前的设置。a1 对 APK 文件进行反编译，收集控件的静态文本信息。a2 在一组设备上安装 APK，同时 a3 加载先前测试运行中的历史测试数据填充模型。

**（b）** 引导式 UI 探索。b1 从被测应用程序中获取当前的 GUI 页面，b2 识别和抽象出当前页面上的可用 hyper-event（超事件，一组具有相同属性的事件，将在下文具体解释）。b3 选择一个具体的 UI 事件，该事件有可能增加 Activity 覆盖率，b4 执行该事件。执行完毕后，b5 更新历史测试数据、概率模型，同时 b6 更新强化学习智能体。

这些步骤将循环迭代，直到使用完时间预算。

核心概念
====

*   Hyper-event 超事件，表示概率模型中的事件，是一组具有相同属性的事件集合，这里的属性只考虑以下四种：activity，text，resource id，action types。使用超事件对事件进行抽象可以在降低大型应用中的复杂性的同时平衡模型的可扩展性和准确性。
*   Probabilistic Model 概率模型 M\=(E,A,δ)M=(\\mathcal{E} ,\\mathcal{A},\\delta)M\=(E,A,δ)，一个三元组，用于存储 event-Activity 的跳转关系。其中， E\\mathcal{E}E是一组 hyper-event 集合， A\\mathcal{A}A 表示被测应用的 Activities 集合， δ\\deltaδ表转移函数，记录每一个 hyper-event 到达一个 activity 的概率。
*   Q 表，强化学习中关键组成部分，用于记录每个对应状态下的 Q 值。
*   P(e,Ai)P(e,A\_i)P(e,Ai​)表示执行一个 hyper-event 之后到达某个 Activity 的概率。
*   PM(ei)P\_M(e\_i)PM​(ei​)在概率模型 M 中选择事件 eie\_iei​的概率。
*   PQ(ei)P\_Q(e\_i)PQ​(ei​)在 Q 表中eie\_iei​对应的 q 值，即强化学习智能体选择执行事件 eie\_iei​的概率值。
*   E(ei)\\mathbb{E}(e\_i)E(ei​)表示通过执行时间 ei(ei∈Ec)e\_i(e\_i\\in\\mathcal{E}\_c)ei​(ei​∈Ec​)达到提高 Activity 覆盖率目标的期望值，期望值越大，说明事件 e 能到达新的 Activity 的概率越大。

技术和算法原理
=======

Fastbot 的关键思想是利用存储在概率模型中的先验知识，去有效地指导 GUI 测试。为了实现这一点，关键步骤是决定在当前 GUI 页面上选择哪个 UI 事件，可以快速地提高 Activity 覆盖率。具体而言，给定一个 GUI 页面，Fastbot 提取当前所有可用的超事件，并采用以下两种策略协同组合去选择执行的事件：（1）基于模型的事件选择，（2）基于学习的事件选择。

1\. 基于概率模型的事件选择
---------------

**模型的构建：** 概率模型 M 从历史探索数据中构建，每个通过执行超时间 e 到达的 Activity AiA\_iAi​的概率计算公式如下：

P(e,Ai)\= N(e,Ai)N(e)P(e,A\_i)= \\frac{N(e,A\_i)}{N(e)}P(e,Ai​)\= N(e)N(e,Ai​)​

其中， N(e,Ai)N(e,A\_i)N(e,Ai​)表示通过事件 e 到达 AiA\_iAi​的次数， N(e)N(e)N(e)表示在所有之前的测试运行中 eie\_iei​被执行的总次数。注意，如果一个超事件 eee可以到达 k 个 Activities A1,A2,...AkA\_1,A\_2,...A\_kA1​,A2​,...Ak​，则 ∑i\=1kP(e,Ai)\=1\\sum\_{i=1}^{k}P(e,A\_i)=1∑i\=1k​P(e,Ai​)\=1成立。

为了平衡模型对未知动作的探索和已知高回报动作的利用，避免陷入局部最优的僵局，基于模型的事件选择包括两种模式：模型扩展和模型利用。

**模型扩展：** 如果当前 GUI 页面中的某些超事件尚未包含在概率模型𝑀中，Fastbot 将启动扩展策略，随机选择一个尚未执行的超事件。在实际中有两种可能的情况：1）先前的测试运行可能没有覆盖所有的超事件，2）当前测试应用程序版本中添加了一些新的功能。该模式可以帮助扩展模型并优先探索潜在的新功能。

**模型利用：** 如果当前 GUI 页面中的所有超事件都已包含在概率模型𝑀中，Fastbot 将启动利用策略，选择一个具有更高概率的事件，来走到当前测试运行中尚未被覆盖的 Activity。设 AtA\_tAt​为当前测试运行中已覆盖的 Activity 集合， Ec\\mathcal{E}\_cEc​为当前 GUI 页面中的超事件集合，通过执行 ei(ei∈Ec)e\_i(e\_i\\in\\mathcal{E}\_c)ei​(ei​∈Ec​)提高 Activity 覆盖率的期望值E(ei)\\mathbb{E}(e\_i)E(ei​)的计算如下：

E(ei)\=∑A∉AtP(ei,A),0 ≤ i ≤ ∣Ec∣\\mathbb{E}(e\_i)=\\sum\_{A\\notin \\mathcal{A}\_t}P(e\_i,A),0 \\le i \\le |\\mathcal{E}\_c|E(ei​)\=∑A∈/At​​P(ei​,A),0 ≤ i ≤ ∣Ec​∣

通过计算执行每个超事件后能够提高 Activity 覆盖率的期望值，Fastbot 使用概率模型作为先验信息，按照概率PM(ei)P\_M(e\_i)PM​(ei​)进行选择。计算 PM(ei)P\_M(e\_i)PM​(ei​)公式如下：

PM(ei) \= exp(E(ei)α)/∑ei∈Ecexp(E(ei)α)P\_M(e\_i) = exp(\\frac{\\mathbb{E}(e\_i) }{\\alpha } ) / \\sum\_{e\_i\\in \\mathcal{E}\_c}exp(\\frac{\\mathbb{E}(e\_i) }{\\alpha }) PM​(ei​) \= exp(αE(ei​)​)/∑ei​∈Ec​​exp(αE(ei​)​)

PM(ei)P\_M(e\_i)PM​(ei​)的计算采用了基于 softmaxe 公式（激活函数）的调整，并通过设置超参数𝛼来控制模式的随机性。为了公平性，每个超事件最多被选择𝐾次。通过利用概率模型作为先验信息，Fastbot 的模型利用模式可以在短时间内快速改善活动覆盖。该算法的实践中，我们设置𝛼为 0.8，𝐾为 1，以平衡随机性和公平性。

Fastbot 的算法原理在于利用先前的知识和概率模型，通过模型扩展和模型利用两种策略模式选择事件，以快速提高 GUI 测试的 Activity 覆盖率。该算法的设计使得 GUI 测试能够更高效地进行，并能够适应不同的应用场景。

2\. 基于强化学习的事件选择
---------------

前面概率模型只能表达一步的指导信息，而强化学习技术能够将一步扩展为多步的指导信息。Fastbot 采用了 Sarsa N-Step 算法作为奖励函数去计算和更新 Q 值。

**Q 表扩展**。强化学习智能体的关键组成部分是 Q 表，其中包含 Q 值，它表示执行每个超事件可以达到新的 Activity 的可能性。在测试过程中，无论使用哪种事件选择策略，在 t 时刻下选择的超事件 ete\_tet​在当前 GUI 页面上的 Q 值，记为𝑄（𝑒𝑡），通过以下公式更新 Q(et)+α(Gt,t+n−Q(et))Q(e\_t)+\\alpha (G\_{t,t+n}-Q(e\_t))Q(et​)+α(Gt,t+n​−Q(et​))，该公式考虑 n 步之后的长远收益。其中 Gt,t+nG\_{t,t+n}Gt,t+n​是通过 Sarsa N-step 方法计算的 n 步后的累积收益，即 Sarsa N-Step 会延迟到时间步为 t+N 时再进行更新。在此过程中记录每一个状态的奖励，利用这些记录好的信息更新 q 值。也就是用 t+1～t+N-1 的 r 值和 t+N 的 Q 值计算 G，并利用这个计算好的 G 和 t 时刻的 Q 值更新 Q 值：

Gt,t+n\=rt+1+γrt+2+...+γnQ(et+n)G\_{t,t+n}=r\_{t+1}+\\gamma r\_{t+2}+...+\\gamma^{n}Q(e\_{t+n})Gt,t+n​\=rt+1​+γrt+2​+...+γnQ(et+n​)

其中，γ\\gammaγ为折扣因子，表示考虑时间对未来奖励的影响，更加侧重当下的奖励， rt+1r\_{t+1}rt+1​表示事件 ete\_tet​执行之后的下一时刻的奖励，计算公式如下：

rt+1\=E(et)N(et)+1+VN(At)+1r\_{t+1}=\\frac{\\mathbb{E}(e\_t) }{\\sqrt{N(e\_t)+1} }+\\frac{V}{\\sqrt{N(A\_t)+1} } rt+1​\=N(et​)+1​E(et​)​+N(At​)+1​V​

其中，V 值表示 AtA\_tAt​的价值，即 AtA\_tAt​中有多少可以到达新的 Activity 的有价值事件，分母部分都用根式来调整期望值，使得访问和执行次数较少事件和 Activity 都能有更多的权重，防止过度依赖历史经验丧失多样性。

V 值的具体计算公式如下：

V\=nh+0.5∗nc+∑ei∈EcE(ei)V=n\_h+0.5\*n\_c+\\sum\_{e\_i\\in \\mathcal{E}\_c }\\mathbb{E}(e\_i) V\=nh​+0.5∗nc​+∑ei​∈Ec​​E(ei​)

其中， nhn\_hnh​表示当前页面中不在概率模型 M 中的超事件的数量， ncn\_cnc​表示下一个页面中，已经被 M 模型加入但是在本次测试中没有被执行过的超事件的数量。 ∑ei∈EcE(ei)\\sum\_{e\_i\\in \\mathcal{E}\_c }\\mathbb{E}(e\_i) ∑ei​∈Ec​​E(ei​)表示执行事件能够提高 Activity 覆盖率的累积期望值。

**Q 表利用**。当 Q 表更新完后，通过以下公式计算得到每个超事件 eie\_iei​被选择的概率：

PQ(ei)\=exp(Q(ei)β)/∑ei∈Ecexp(Q(ei)β)P\_Q(e\_i)=exp(\\frac{Q(e\_i)}{\\beta } )/\\sum \_{e\_i\\in \\mathcal{E}\_c }exp(\\frac{Q(e\_i)}{\\beta } )PQ​(ei​)\=exp(βQ(ei​)​)/∑ei​∈Ec​​exp(βQ(ei​)​)

其中， β\\betaβ是一个超参数，用于调整策略的随机性。在实践中，被设置为 0.1。

3\. 案例解释
--------

为了加深理解，下面用头条应用来对算法的几种决策进行解释：

1.  概率模型的探索与利用模式

通过对历史数据记载对概率模型 M 初始化，见图 b，启动头条应用后，进入 home Activity1，当前页面可以抽象为 3 个 hyper-event，这三个事件都被包含在模型中，因此 Fastbot 回启动模型利用策略选择事件，看图 b 左边部分，可以知道 e3 有 90%的概率留在 Activity1，因此更倾向于选择 e1 和 e2，假设选择 e1 后，到达 Activity2，在 Activity2 中 e4 已经在模型中，并且 100%回到 Activity1，同时 e5，e6 不再模型中，此时 Fastbot 将启动探索模式，随机选择 e5 或者 e6，如果选择 e5，到达 Activity3，此时模型添加一条 e5-Activity3 的概率值 100%，同时由于 e1 的执行次数加 1，因此 e1 的概率也要改变，e1-Activity2 的概率变为 0.7/1.1=63.6%，e1-Activity5 的概率变为 36.4%，更新为图 b 右半部分。

![](/images/jueJin/5341d02c021448a.png)![](/images/jueJin/707e4fd1d4d3487.png)

2.  Q 表的更新利用

在图 a 中，Activity2，e4，e6 没有被执行过，同时 e6 不在模型内，因此 e1 的奖励更高，相似的，e7，e8 也是新的事件，因此 e5 的奖励会更高，假设 e1，e2，e3 都会执行过很多次，并且 Activity2，3，4 都被覆盖了，此时将利用 Q 表中的值去计算事件选择的概率，在当前 Activity1 中，由于 e1 的奖励最高说明他能够到达更深的 Activity，因此选择 e1 作为下一个事件执行。

![](/images/jueJin/8d5a173d9f2f46d.png)

设计实现
====

Fastbot 开源版包括客户端和本地服务端两部分，客户端负责监听 UI 事件，接收和注入相应的动作，服务端负责计算和决策。具体而言，在每个设备上运行 Fastbot 客户端，通过监控 GUI 页面信息发送给服务端，服务端接收信息根据算法决策返回选择的事件，客户端接收事件并执行操作。

客户端使用 Java 语言编写，用于获取 GUI 信息，读取服务端决策，并将决策转化为设备可以执行的代码，从而操作设备；本地服务端，即与 Java 层相对应的底层 C/C++代码层，以动态链接库（.so 文件）的形式与 Java 层通过 JNI 接口进行交互，它用于实现用户偏好的读取，模型的学习和任务决策，并将决策结果转化为 JSON 格式的信息传递给 Java 层。

Fastbot 的实现继承 Monkey 原生框架，下图展示了 Fastbot 扩展的代码简要结构图，在 java 层新增了来自 Fastbot 算法返回的事件源 MonkeySourceApeNative 类，对 GUI 树的获取，以及对 Android 不同的系统的兼容的 Adapter 适配接口，此外，为了支持自定义操作的解析和执行对 Monkey 的原始事件进行了封装。

![](/images/jueJin/880e167629184f3.png)

常用配置
====

1\. 配置自定义事件
-----------

Fastbot 支持自定义事件序列，适用于场景覆盖不全，通过人工配置到达 Fastbot 遍历不到的场景。

**配置步骤：**

1.  新建 **max.xpath.actions** 文件（文件名称固定不能更改）
    
2.  参照案例格式指定控件和相应的动作。其中：
    
    1.  prob：发生概率，"prob"：1，代表发生概率为 100%
    2.  activity：所属场景
    3.  times：重复次数，默认为 1 即可
    4.  actions：具体需要执行的事件序列，其中要指名每个操作对象的 xpath，对应的动作 action，和与下一个事件间隔的时间 throttle（ms），注意 xpath 写法
3.  动作类型（必须大写）：
    
    1.  CLICK：点击，想要输入内容在 action 下补充 text，如果有 text 则执行文本输入
    2.  LONG\_CLICK：长按
    3.  BACK：返回
    4.  SCROLL\_TOP\_DOWN：从上向下滚动
    5.  SCROLL\_BOTTOM\_UP：从下向上滑动
    6.  SCROLL\_LEFT\_RIGHT：从左向右滑动
    7.  SCROLL\_RIGHT\_LEFT：从右向左滑动
4.  配置完成后，将配置文件推送到手机端： `adb push 路径+max.xpath.actions /sdcard`
    

**下面以 AmazeFileManager 为例：**

1.  **第一种情况：当事件执行不涉及 Activity 的跳转时，只需将所有的事件序列写在一个对象中。**

如图所示，actions 字段里的 4 个动作分别对应下图中红框标出的动作，（1）点击菜单按钮打开菜单栏，（2）点击 recent file 按钮到达相应文件目录，（3）点击加号按钮，打开浮选选项，（4）点击 File 按钮打开新建文件对话框。

![](/images/jueJin/f9367917c8c54ac.png)

```perl
    [
        {
        "prob":1,
        "activity":"com.amaze.filemanager.ui.activities.MainActivity",
        "times":1,
            "actions":[
                {
                "xpath":"//*[@content-desc='Navigate up']",
                "action":"CLICK",
                "throttle": 2000
                },
                    {
                    "xpath":"//*[@resource-id='com.amaze.filemanager:id/design_menu_item_text' and @text='Recent files']",
                    "action":"CLICK",
                    "throttle": 2000
                    },
                        {
                        "xpath":"//*[@resource-id='com.amaze.filemanager:id/sd_main_fab']",
                        "action":"CLICK",
                        "throttle": 2000
                        },
                            {
                            "xpath":"//*[@resource-id='com.amaze.filemanager:id/menu_new_file']",
                            "action":"CLICK",
                            "throttle": 2000
                        }
                    ]
                }
            ]
```

2.  **第二种情况：当事件执行涉及到 Activity 的跳转时，要将对应不同 Activity 的事件序列单独存放。**

下图展示了从 MainActivity 跳转到 PreferencesActivity 的例子。

![](/images/jueJin/c4cdec76d9e440d.png)

可以看到在配置文件中有两个对象，分别对应 MainActivity 和 PreferencesActivity 两个页面下需要执行的事件序列。

```perl
    [
        {
        "prob":1,
        "activity":"com.amaze.filemanager.ui.activities.MainActivity",
        "times":1,
            "actions":[
                {
                "xpath":"//*[@content-desc='Navigate up']",
                "action":"CLICK",
                "throttle": 2000
                },
                    {
                    "xpath":"//*[@resource-id='com.amaze.filemanager:id/design_navigation_view']",
                    "action":"SCROLL_BOTTOM_UP",
                    "throttle": 2000
                    },
                        {
                        "xpath":"//*[@text='Settings' and @resource-id=['com.amaze.filemanager:id/design_menu_item_text']",
                        "action":"CLICK",
                        "throttle": 2000
                    }
                    
                ]
                },
                    {
                    "prob":1,
                    "activity":"com.amaze.filemanager.ui.activities.PreferencesActivity",
                    "times":1,
                        "actions":[
                            {
                            "xpath":"//*[@resource-id='android:id/title' and @text='Appearance']",
                            "action":"CLICK",
                            "throttle": 2000
                        }
                    ]
                    
                }
            ]
```

3.  **带文本输入的情况**

**配置格式：** 在 action 字段选择“CLICK”，同时添加“text”字段存储需要输入的文本。

![](/images/jueJin/8ad5bd26438b462.png)

以抖音为例，使用以下配置信息可以指定完成输入账户信息的操作。两个动作，分别对应点击 use phone 按钮和输入文本。

```perl
    [
        {
        "prob":1,
        "activity":"com.ss.android.ugc.aweme.account.login.auth.I18nSignUpActivityWithNoAnimation",
        "times":1,
            "actions":[
                {
                "xpath":"//*[@resource-id='com.zhiliaoapp.musically:id/ayo' and @text='Use phone / email / username']",
                "action":"CLICK",
                "throttle": 2000
            }
            
        ]
        },
            {
            "prob":1,
            "activity":"com.ss.android.ugc.aweme.account.login.v2.ui.SignUpOrLoginActivity",
            "times":1,
                "actions":[
                    {
                    "xpath":"//*[@text='Phone number' and @resource-id=['com.zhiliaoapp.musically:id/e61']",
                    "action":"CLICK",
                    "text":"12341828506",
                    "throttle": 2000
                }
                
            ]
        }
        
    ]
```

2\. 屏蔽控件
--------

Fastbot 支持手动配置需要屏蔽的控件或区域，比如测试过程中“半路”中途退出登录，屏蔽退出登录按钮。

**配置步骤：**

1.  新建 **max.widget.black** 文件（文件名称固定不可更改）
    
2.  参照案例格式指定需要屏蔽的控件，格式如下：
    
    1.  activity：当 activity 与 currentactivity 一致时执行如下匹配
        
    2.  屏蔽控件或区域共有三种方式：
        
        *   bounds：屏蔽某个区域，在该区域内的控件或坐标不会被点击。
        *   xpath：查找匹配的控件，屏蔽点击该控件。
        *   xpath+bounds：查找匹配的控件，当控件存在时屏蔽指定的区域。
3.  配置完成后，将配置文件推送到手机端： `adb push 路径+max.widget.black /sdcard`
    

**下面以 AmazeFileManager 为例，展示如何进行控件，区域以及树剪枝屏蔽：**

![](/images/jueJin/de8df6751eb2424.png)

1.  **屏蔽控件**

如图（a）所示，红框标出来的黑色区域控件是手动配置的屏蔽控件。在这里，使用 xpath 来指定需要被屏蔽的控件。

```perl
    [
        {
        "activity":"com.ss.android.ugc.aweme.main.MainActivity",
        "xpath":"//*[@content-desc='Navigate up']"
        },
            {
            "activity":"com.ss.android.ugc.aweme.main.MainActivity",
            "xpath":"//*[@content-desc='More options']"
        }
        
    ]
```

2.  **屏蔽区域**

如图（b）所示，红框标出来的黑色区域控件是手动配置的屏蔽区域。在这里使用 bounds 来配置屏蔽区域。

```css
[{    "activity":"com.ss.android.ugc.aweme.main.MainActivity",    "bounds":"[0,18],[240，60]"}]
```

3.  **树剪枝屏蔽**

树剪枝屏蔽是指在 GUI 树中查找到对应控件，通过将控件属性的 enable 设置为 False，从而使控件屏蔽。

**配置步骤：**

1.  配置 **max.tree.pruning** 文件（文件名固定不可更改）
    
2.  参照案例格式指定需要屏蔽的控件，格式如下：
    
    1.  activity：当 activity 与 currentactivity 一致时执行如下匹配
    2.  剪枝方式：配置 xpath，查找匹配的控件，改变控件属性，从而使控件屏蔽。
3.  配置完成后，将配置文件推送到手机端： `adb push 路径+max.tree.pruning /sdcard`
    

**例子：仍以 AmazeFileManager 为例，** 如上图（c）所示，被红框标出的黑色区域即为手动配置的树剪枝屏蔽控件，可以通过将控件的 enabled 属性变为 flase，也可以将其他属性变为空来实现屏蔽。

```perl
    [
        {
        "activity":"com.ss.android.ugc.aweme.main.MainActivity",
        "xpath":"//*[@content-desc='Navigate up']",
        "enabled":"false"
        },
            {
            "activity":"com.ss.android.ugc.aweme.main.MainActivity",
            "xpath":"//*[@content-desc='More options']",
            "enabled":"false"
            },
                {
                "activity":"com.ss.android.ugc.aweme.main.MainActivity",
                "xpath":"//*[@resource-id='com.amaze.filemanager:id/search'",
                "resourceid":"",
                "contentdesc":"",
                "text":"",
                "classname":""
            }
        ]
```

更多信息
====

Fastbot 开源地址：[github.com/bytedance/F…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fbytedance%2FFastbot_Android "https://github.com/bytedance/Fastbot_Android")

更多 Fastbot 技术细节请参考该论文：“[Fastbot2: Reusable Automated Model-based GUI Testing for Android Enhanced by Reinforcement Learning](https://link.juejin.cn?target=https%3A%2F%2Fse-research.bytedance.com%2Fpdf%2FASE22.pdf "https://se-research.bytedance.com/pdf/ASE22.pdf")”。 Zhengwei Lv（吕正伟）， Chao Peng（彭超）， Zhao Zhang（张钊）， Ting Su（苏亭）， Kai Liu（刘凯）， Ping Yang（杨萍）。 37th IEEE/ACM International Conference on Automated Software Engineering (ASE 2022).

此次 Fastbot 的开源工作由字节跳动软件工程实验室（[se-research.bytedance.com/）推动，华东师范大学苏…](https://link.juejin.cn?target=https%3A%2F%2Fse-research.bytedance.com%2F%25EF%25BC%2589%25E6%258E%25A8%25E5%258A%25A8%25EF%25BC%258C%25E5%258D%258E%25E4%25B8%259C%25E5%25B8%2588%25E8%258C%2583%25E5%25A4%25A7%25E5%25AD%25A6%25E8%258B%258F%25E4%25BA%25AD%25E6%2595%2599%25E6%258E%2588%25E7%259A%2584%25E7%25A0%2594%25E7%25A9%25B6%25E5%25B0%258F%25E7%25BB%2584%25EF%25BC%2588 "https://se-research.bytedance.com/%EF%BC%89%E6%8E%A8%E5%8A%A8%EF%BC%8C%E5%8D%8E%E4%B8%9C%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E8%8B%8F%E4%BA%AD%E6%95%99%E6%8E%88%E7%9A%84%E7%A0%94%E7%A9%B6%E5%B0%8F%E7%BB%84%EF%BC%88")[mobile-app-analysis.github.io/](https://link.juejin.cn?target=https%3A%2F%2Fmobile-app-analysis.github.io%2F "https://mobile-app-analysis.github.io/")）深度参与并提供了技术支持：多位来自华东师范大学的研究生（许梦倩、刘凯等）参与了 Fastbot 的开源和改进工作，其中许梦倩以科研实习生身份全程参与了本次开源工作，提出了不少改进建议并被采纳。今后双方将在Fastbot的维护和扩展上继续合作，同时也欢迎其他研究者和工程师参与进来，增强APP测试的自动化和智能化。