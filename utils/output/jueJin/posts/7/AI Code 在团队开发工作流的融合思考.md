---
author: "网易云音乐技术团队"
title: "AI Code 在团队开发工作流的融合思考"
date: 2024-07-25
description: "在云音乐，我们借助 AI Code 能力与 Tango 能力的连接来提升设计、开发、交付全流程的效率与体验，持续降低由于技能差异导致的开发门槛，支持开发团队向高效能团队转型。"
tags: ["前端","人工智能中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读13分钟"
weight: 1
selfDefined:"likes:18,comments:2,collects:25,views:1648,"
---
> 本文作者: [景庄](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fwwsun "https://github.com/wwsun")

![](/images/jueJin/a960603716d5d92.png)

在云音乐，我们探索借助 AI 来升级现有的开发工作流，从协助个人到协助团队，从大前端到服务端，借助 AI Code 能力与 Tango 能力的连接来提升设计、开发、交付全流程的效率与体验，持续降低由于技能差异导致的开发门槛，支持开发团队向高效能团队转型。

2024 已过去大半，生成式人工智能（Generative AI）在软件工程领域中的应用已经变得越来越广泛和深入，传统的软件开发和交付过程正伴随着 AI 能力的介入而获得增强与革新。一方面，在源码开发模式中，AI Code 能力逐步渗透到开发工作流的每个环节中，包括建模，编码，测试，文档等；另一方面，低代码开发模式如何与大模型能力有机集合也成为低代码厂商新的命题，此外还面临诸多挑战，例如如何快速响应客户需求变化，满足客户大量的自定义需求等。

对于 AI Code 能力在软件开发流程中的影响，可以总结为三个方面：

1.  从单一的辅助编码，到辅助完整的软件生命周期。
2.  AI Code 能力与垂直场景的 LowCode/NoCode 能力结合，可以更加高效的辅助内容生产和功能交付。
3.  AI Code 能力从个人的开发工作流向团队开发工作流渗透，逐步成为企业IT基础设施中的核心组成部分。

传统低代码模式所面临的挑战
-------------

在网易云音乐技术团队内部，我们一直在探索 LowCode 与团队既有研发工作流的结合，解决传统软件交付过程中的高门槛，低效率等问题。[Tango](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FNetEase%2Ftango "https://github.com/NetEase/tango") 是一个我们面向传统的源码开发场景推出的 LowCode 解决方案，**它并不主张取代源码开发，而是以源码为基础，可以在源码库的基础上构建可视化开发界面，简化传统的源码开发过程，并降低开发者对于编程语言和应用框架层的关注度**。Tango 提供了类似于 Github Copilot 的辅助开发能力，**将关注点聚焦到降低开发者的开发门槛上，减少开发者编写模式化的重复代码，同时开发者仍然可以借助源码来实现自定义的扩展和快速响应需求的变化**。

![](/images/jueJin/1f4e53707258f08.png)

对于传统的专业型低代码平台而言，通常提供了高度封装的可视化界面，使得用户无需关注任何底层代码，只需要在预设的可视化界面和指令界面进行操作即可完成应用的搭建工作，这类平台在缺少信息化能力的企业可以提供极大的软件生产便利。但在互联网技术团队中，这类平台存在的种种限制往往受到专业开发者的诟病，例如无法快速满足定制化需求，无法提供高阶的服务端抽象能力，无法提供灵活的扩展能力，过于强调可视化所带来的效率损失，例如实现一个跨多个服务的用户登陆流程，在可视化的逻辑表达中可能涉及到几十个节点的组装和连线操作。

专业型低代码平台在大模型能力的利用上也会存在一定的成本，由于通常使用私有的搭建协议，在使用大模型的过程中需要通过自然语言到编程语言的转换，再通过编程语言转换成私有的搭建协议，在这个过程中也会损失较大的精度。当然某些产品也可以通过训练自己的私有小模型解决这个问题，这意味着额外的成本， 并且参数过少的模型很难与大模型的效果相提并论，大模型通常拥有海量的参数，能够更精准地捕捉数据中的模式和特征，在处理复杂任务时会得到更好的表现。并且商业化的大模型服务已经是一片蓝海，通过商业化大模型扩展团队开发工作流会是一个高性价比的选择。

![](/images/jueJin/69194d0ec587e5b.png) 图：飞速发展的大语言模型

代码仍是核心技术资产，AI Code 仍在快速演进
-------------------------

\*\*在软件工程领域中，代码仍然是最核心的技术资产，AI Code 的辅助生成能力仍然依赖于对既有代码的学习和训练。\*\*大模型的训练依赖于海量的人类既有知识库，例如Github Copilot 使用的大语言模型 codex 基于 github 上大量的开源项目代码学习和训练。对于研发团队而言，AI Code 的能力也仍然在持续演进，软件开发的过程仍然依赖人类开发者来介入和交付，拥抱社区并采用主流的技术方案将有助于我们提升 AI Code 带来的效用。

![](/images/jueJin/5f91aad48b34f8f.png)

AI Code 能力演进和趋势分析
-----------------

随着 AI Code 能力的深入发展，了解并掌握 AI Code 已经成为开发者的基础入门课程。对开发者而言，借助 AI Code 可以更低成本的构建软件工程，更高效率的编写软件代码。下面，不妨选取一些业界比较有代表性的 AI Code 产品进行分析，梳理其中的共性和亮点，供我们在工作过程中持续思考如何改进我们现有的工作模式。

### AI驱动的软件全生命周期管理

AI 能力已经逐步渗透到软件开发的每个环节中，各类 AI Code 工具也越来越关注 AI 与工作流节点的互动，以增强开发者体验和效率。

#### AI 开发助手：Github Copilot + 插件市场

[github.com/features/co…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffeatures%2Fcopilot "https://github.com/features/copilot")

GitHub Copilot在软件开发生命周期中提供上下文化的帮助，从IDE中的代码补全和聊天辅助到GitHub中的代码解释和文档答疑等。通过Copilot 可以提升开发者的工作流程，Copilot 扩展使开发人员能够使用他们喜爱的工具和服务，以自然语言构建并部署到云端，而无需离开 IDE 或 GitHub.com。有了 Copilot 和现在的 Copilot 扩展，开发人员可以更长时间地保持流畅，提升技能水平，加快创新速度。

![](/images/jueJin/ace97cc881f3681.png)

#### AI 驱动的云端协作式IDE：Replit

[replit.com](https://link.juejin.cn?target=https%3A%2F%2Freplit.com "https://replit.com")

Replit是一个协作式的基于浏览器的集成开发环境，允许您在50多种编程语言中编写和运行代码。它提供了强大的编译器和解释器，使得开发软件变得简单，不需要任何设置要求。Replit 将 AI 作为开发环境的一等公民。为了实现这一愿景，Replit 正在将AI工具与 IDE 紧密结合。

![](/images/jueJin/2553399c5910150.png)

#### AI辅助的全栈在线开发平台：Google Project IDX

[developers.google.com/idx](https://link.juejin.cn?target=https%3A%2F%2Fdevelopers.google.com%2Fidx "https://developers.google.com/idx")

Project IDX 是一个 AI 辅助的在线 IDE，适合在云端进行全栈、多平台应用开发。IDX 支持众多框架、语言和服务，还可以与相应的 Google 产品集成，可简化开发者的的开发工作流程，让开发者可以快速、轻松、高效地跨平台构建和发布应用。Project IDX承诺未来建立开发环境就像打开浏览器一样简单。凭借其简化复杂开发格局的重点，它是一项有可能彻底改变我们对编码方式看法的计划。

![](/images/jueJin/54fab160d9938aa.png)

#### AI代码质量保证：Sonar

[www.sonarsource.com/solutions/a…](https://link.juejin.cn?target=https%3A%2F%2Fwww.sonarsource.com%2Fsolutions%2Fai%2F "https://www.sonarsource.com/solutions/ai/")

AI 辅助编程的一大潜在问题是代码安全风险。Sonar 面对这一问题提供了可行的解法，它包括 SonarQube 和SonarCloud 集成到 CI 管道中，同时在IDE中可以集成 SonarLint 提供代码质量检测和保障。使用Sonar，可以扫描并检测代码中的错误和漏洞，指导开发者在 IDE 中修复代码问题，或在 DevOps 工作流中修复问题。Sonar还提供了强大的静态代码分析功能，提供内置的审查工作流和报告，以及质量门禁用来控制执行定义的代码质量标准。

![](/images/jueJin/d2595588dde5f94.png)

### AI驱动的垂直场景代码生成能力

AI 在各类垂直领域场景中也分别发挥着其独有的优势，由于领域相对确定，转型的任务和工作流相对稳定，借助大模型能力，可以极大的改进已有的工作流。

#### AI驱动设计稿代码生成：Quest AI

[www.quest.ai/](https://link.juejin.cn?target=https%3A%2F%2Fwww.quest.ai%2F "https://www.quest.ai/")

Quest AI 的模型可以基于设计稿或草图生成真实、有用的代码。它包含所有专业开发人员关心的事情。使用我们的聊天提示来修改样式、编写业务逻辑并连接到您的后端。 Quest是为开发者设计的。它自动化了构建应用程序的繁琐部分，同时又让您拥有完全的控制权，这样您就可以构建任何您想要的东西。

![](/images/jueJin/3792e0626202801.png)

#### AI增强接口测试效率：HTTPie AI

[httpie.io/blog/ai](https://link.juejin.cn?target=https%3A%2F%2Fhttpie.io%2Fblog%2Fai "https://httpie.io/blog/ai")

HTTPie AI 助手使用大模型来提高开发者在测试和与 API 交互时的效率，例如你可以通过简单的自然语言快速地从海量文档中发现并创建相应的请求。

![](/images/jueJin/f93ce2a53847d37.png)

#### AI生成前端UI：Vercel V0

[v0.dev/](https://link.juejin.cn?target=https%3A%2F%2Fv0.dev%2F "https://v0.dev/")

v0是一个由 Vercel 提供支持的基于 AI 的生成式用户界面系统。它基于 shadcn/ui 和 Tailwind CSS 生成易于复制粘贴的 React 代码，供人们在其项目中使用。v0 使用 AI 模型根据简单文本提示生成代码。在提交提示词后，它会为你提供三份由 AI 生成用户界面。你可以选择其中一个并复制粘贴其代码，或进一步完善它。要进行完善，你可以选择生成的 UI 的各个部分来微调您的创建。准备好后，您可以复制、粘贴并发布。 V0 是根据 Vercel 团队编写的自定义代码与开源和合成数据集混合训练的。Vercel 可能会使用用户生成的提示和/或内容作为第三方提供商的模型和学习系统的输入，以改进他们的产品。

![](/images/jueJin/e63a223d9742439.png)

### AI驱动的团队开发工作流

#### AI 项目协作工具：GenPen.AI

[genpen.ai/](https://link.juejin.cn?target=https%3A%2F%2Fgenpen.ai%2F "https://genpen.ai/")

GenPen.AI 是一个项目协作与代码生成工具。它可以将设计提示转化为REST API，并自动生成文档。核心功能包括：代码生成、基于AI的多模式VLLM转换器、OpenAPI集成、自动化Git、代码和文档管理、多个AI代理用于响应汇总。它的目标是加快调试速度，减少开发时间，并简化项目管理。GenPen AI自动化重复任务，利用AI转换器，并根据模型生成代码，从而减少开发时间。

![](/images/jueJin/ff43ed8f908b033.png)

#### 一站式智能研发工作台：CodeMaker

CodeMaker 网易内部的是一站式智能研发工作台，其使命是把AI集成到游戏开发的每个环节，为开发团队量身定制AI时代的游戏开发解决方案。当前产品提供了Code Completion（代码智能补全）、Code Chat（代码智能操作）、Code Generate（代码智能生成）、Code Search（代码语义检索）、Code Review（代码智能 review）、Code Scanner（代码检测）、Sunshine Flow 等功能。

![](/images/jueJin/dad84d3cb2245eb.png)

#### AI工作流程编排：LangBase

LangBase 为用户提供了一站式的 AI 应用管理和运维服务，降低用户创建 AI 应用的成本。因此 LangBase 不仅在底层提供提供了模型和应用的管理，也在应用平台之上多提供了一层业务接入层，最大化的降低用户创建和使用 AI 应用的成本。

![](/images/jueJin/23eb58a3e407f42.png)

AI 辅助的团队开发工作流思考
---------------

在网易云音乐内部，结合我们对业务需求特点的梳理，和开发者的实际诉求，**我们构建了渐进式的低代码能力，专注于降低技能门槛，减少编写重复代码**。我们从2023年4月开始探索 AI Code 能力与开发者个人工作流的结合，包括引入 Github Copilot 提升源码开发体验，通过 Tango 与 GPT 系列大模型的连接来提供 AI 驱动的 Low Code 能力。

在2024年，我们进一步的开始探索借助 AI 来升级现有的团队开发工作流，从大前端场景覆盖到服务端源码开发场景，在内部协同 LangBase 来提供 DevAgent（生成页面，生成组件，生成代码片段）、DesignAgent（抠图，生图，设计稿转代码） 等能力，与 CodeMaker 共建的方式来逐步取代 Github Copilot，为团队定制专属代码补全模型，并持续探索 AI Code 能力与团队开发工作流的深度集成和定制。

![](/images/jueJin/403d843a9b4f0d7.png) 图：Tango + AI Agent Workflow

如上图所示，在大前端的开发工作流场景中，[海豹D2C](https://link.juejin.cn?target=https%3A%2F%2Fwww.figma.com%2Fcommunity%2Fplugin%2F1174548852019950797%2Fseal-ai-powered-figma-to-code-react-rn-vue-html-d2c "https://www.figma.com/community/plugin/1174548852019950797/seal-ai-powered-figma-to-code-react-rn-vue-html-d2c") 提供了基于设计稿直接生成项目源码的能力，目前支持 React, ReactNative, Vue 等多种框架，支持内部核心的C端场景覆盖，借助 DesignAgent 能力，我们增强了对设计稿的识别精度，提升了出码还原度。在 Tango 这一层，我们并没有一味追求可视化开发的思路，而是通过衔接既有的源码开发工作流，并借助 LangBase 提供的 DevAgent 来增强代码生成能力，在本地开发流程中通过完善源码开发环节的 DevTools 和 CodeMaker 能力来改善开发者体验。

![](/images/jueJin/da0399560142859.png) 图：云音乐海豹D2C外部社区分享与成果

当前我们正尝试从四个方面将 AI Code 能力融入到团队开发工作流中，具体包括训练自定义补全模型（针对不同的开发者画像提升补全覆盖率和接受率）、CM插件扩展（集成核心的工具设施到IDE，实现对话式信息获取和配置生成）、CM工作流扩展与自定义（复用和下发既有的Agent能力）、AI向导（提供特定领域内容的自动化生成能力）等四个方面。

![AI Code Plan](/images/jueJin/a7d77e42ace6a7e.png) 图：云音乐 AI Code 能力建设

AI 正在超过我们想象的速度在发展，无论是在商业领域，还是在企业内部的工作流中。现阶段，寄希望于 AI 解决整个软件工程问题还为时尚早，但从协助个人，到协助团队，并逐步渗透到团队工作流中的每一个核心节点，AI Code 能力正在逐步发挥威力。

![](/images/jueJin/2afc4a60104c078.png)

图：面向团队的 AI Code 工作流设计

总结
--

我们已经发现业界有大量的技术产品和效能工具在尝试融入 AI 能力，无论是本地的 AI IDE，还是云端的智能开发环境。要想充分发挥其效用，仍然有待在组织中进一步的尝试将大模型能力与开发工作流和工具链的集成和融合。现阶段，通过持续评估 AI 的能力和兼容性，将 AI 与团队开发工作流的集成，使 AI 作为核心节点的助手，将会有助于持续改进团队的开发质量和效率。

最后
--

![](/images/jueJin/5fbfc45f0ac4437.png) 更多岗位，可进入网易招聘[官网查看](https://link.juejin.cn?target=https%3A%2F%2Fhr.163.com%2F "https://hr.163.com/")