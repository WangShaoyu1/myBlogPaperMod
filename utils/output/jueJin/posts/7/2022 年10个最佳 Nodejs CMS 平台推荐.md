---
author: "徐小夕"
title: "2022 年10个最佳 Nodejs CMS 平台推荐"
date: 2021-12-29
description: "内容管理系统 (「CMS」) 使没有强大技术背景的人也能够轻松发布内容。我们可以使用 「CMS」 来管理我们的内容和交付。市面上有不同类型的 「CMS」，它们执行不同的目的并具有不同的功能。"
tags: ["前端","后端","GitHub中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:111,comments:0,collects:178,views:13546,"
---
> ❝
> 
> hi, 大家好, 我是徐小夕,之前和大家分享了很多\*\*「低代码可视化」**和**「前端工程化」**相关的话题, 今天继续和大家聊聊**「CMS」\*\*系统.
> 
> ❞

内容管理系统 (**「CMS」**) 使没有强大技术背景的人也能够轻松发布内容。我们可以使用 **「CMS」** 来管理我们的内容和交付。市面上有不同类型的 **「CMS」**，它们执行不同的目的并具有不同的功能。

在本文中，我将和大家分享一下 **「2022」** 年使用的一些最佳 **「Node.js CMS」**，希望可以作为我们选择最佳 **「CMS」** 的指南。

### 什么是内容管理系统？

内容管理系统是一种软件应用程序，它提供图形用户界面，其中包含我们可以用来创建、更新、管理和发布内容的工具。

内容存储在数据库中，并通过 `CMS` 提供的展示层或前端层（通常以网站模板的形式）显示给目标受众。

有不同类型的 **「CMS」**，但最常见的如下：

#### 1.传统内容管理系统

传统的 **「CMS」** 是一个整体且紧密耦合的系统。对于传统的 **「CMS」**，内容和前端层或“头部”紧密相连。传统的 **「CMS」** 提供了显示内容的前端层。

传统 **「CMS」** 的入门门槛较低。它提供模板、拖放界面和所见即所得编辑器，使非开发人员无需编程或技术知识即可创建网站。

#### 2.无头内容管理系统

**「Headless CMS」** 是仅后端且 **「API」** 优先的内容交付系统。它没有传统 **「CMS」** 的限制。

与传统的 **「CMS」** 不同，无头 **「CMS」** 不提供展示层。相反，它充当我们内容的基于云的存储。内容与前端展示解耦。

开发人员通过 **「CMS」** 提供的 **「API」**（无论是 **「REST」** 还是 **「GraphQL」**）访问他们需要向用户显示的内容。

由于基于 **「API」**，开发人员可以自由选择他们喜欢使用的工具、编程语言和框架。

#### 3.混合内容管理系统

混合 **「CMS」** 融合了传统和无头 **「CMS」** 体验。它为开发人员和营销人员提供了两全其美的优势。

它是无头 **「CMS」** 的 **「API」** 优先方法与传统 **「CMS」** 的模板系统的组合。

混合 **「CMS」** 为市场和内容编写者提供了传统 **「CMS」** 熟悉的界面和体验，并为开发人员提供了跨多个渠道交付内容所需的 **「API」** 访问权限。

### 基于 Node.js 的 CMS

**「Node.js CMS」** 是用 **「Node.js」** 构建的 **「CMS」**；然而，这并不意味着开发人员只能使用 **「Node.js」**。

接下来就来介绍一下 **「2022」** 年比较活跃的 **「CMS」**。

#### 1\. Strapi

![image.png](/images/jueJin/cb9b6dd8ecd54bd.png) **「Strapi」** 是一种流行、灵活且开源的无头 **「CMS」**，使我们能够创建丰富的数字体验。**「Strapi」** 提供了 **「REST」** 和 **「GraphQL API」**，开发人员可以使用这些 **「API」** 来访问存储在其存储库中的内容。

我们可以通过其可调整的设置和管理面板自定义 **「Strapi」** 以满足我们的需求。我们还可以通过安装社区开发的插件来扩展 **「Strapi」** 的功能。

**「Strapi」** 支持多种数据库，例如 **「MongoDB」**、**「SQLite」**、**「MySQL PostgreSQL」** 和 **「MariaDB」**。

**「Strapi」** 提供永久免费的社区计划和其他基于用户需求的付费定价选项。

特点:

*   完全可定制
*   REST 和 GraphQL API
*   插件市场
*   国际化支持

网址: [strapi.io/](https://link.juejin.cn?target=https%3A%2F%2Fstrapi.io%2F "https://strapi.io/")

#### 2\. Ghost

![image.png](/images/jueJin/7fafd0a5f85e4e1.png) **「Ghost」** 是一个强大的发布平台，受到世界领先的作家、创作者和专业内容团队的信赖。

**「Ghost」** 专注于为出版商、企业家和开发人员简化在线发布流程。简而言之，**「Ghost」** 使博客和发布 **「Web」** 内容变得简单。

我们可以在使用 **「Ghost」** 时保持高效，因为它为专业人士日常使用的常用工具提供了集成。

**「Ghost」** 提供了一个 **「REST API」**，开发人员可以使用它来检索 **「CMS」** 数据并将其显示给目标受众。

它首先是一个开源软件，因此我们可以免费克隆存储库并将实例部署到我们的服务器上。但是，**「Ghost」** 提供不同的付费计划，其基本计划为每月 9 美元。

特点

*   搜索引擎优化
*   第三方集成
*   主题市场
*   REST API
*   国际化支持
*   观众参与度分析
*   电子邮件营销
*   功能丰富的编辑器，专注于内容
*   内置订阅和会员管理

网址: [ghost.org/](https://link.juejin.cn?target=https%3A%2F%2Fghost.org%2F "https://ghost.org/")

#### 3\. Sanity

![image.png](/images/jueJin/bf61e38b2af847f.png) **「Sanity」** 的用途远不止传统的 **「Web」** 体验。从投资组合和公司网站到电子商务应用程序，**「Sanity」** 的应用无处不在。

**「Sanity」** 提供了一个 **「GraphQL API」**，开发人员可以使用它来访问存储在其存储库中的内容。

**「Sanity」** 提供了广泛的插件和第三方集成，我们可以用来定制我们的工作场所并扩展其功能。它提供免费套餐并有其他定价选项。

特点

*   GraphQL API
*   国际化支持
*   适应性强且用途广泛——可以拥有超越传统 Web 体验的不同应用程序
*   不断发展的社区——广泛的指南、插件和代码示例

网址: [www.sanity.io/](https://link.juejin.cn?target=https%3A%2F%2Fwww.sanity.io%2F "https://www.sanity.io/")

#### 4\. ButterCMS

**「ButterCMS」** 是一个 **「API」** 驱动的 **「CMS」** 和博客引擎，用于快速网站开发，可满足开发人员和营销人员的需求。

作为 **「API」** 驱动的 **「CMS」**，它对开发人员友好。但是，凭借内置 **「SEO」**、预览、修订历史记录和日程安排等功能，**「Butter」** 使营销人员能够做到最好。

**「Butter」** 将媒体管理提升到一个新的水平。除了存储和优化图像，**「Butter」** 还提供了一个内置的图像编辑器，我们可以使用它来转换、裁剪、调整大小、应用过滤器等等。

**「Butter」** 有一个非商业用途的免费开发者计划。其基本付费计划为每月 83 美元。

特点

*   REST API
*   内置图像编辑器
*   国际化
*   搜索引擎优化

网址: [buttercms.com/](https://link.juejin.cn?target=https%3A%2F%2Fbuttercms.com%2F "https://buttercms.com/")

#### 5\. Apostrophe

![image.png](/images/jueJin/dda2429c35c542c.png) **「Apostrophe CMS」** 称自己为“一个强大且灵活的网站构建平台，适用于数字机构、**「SaaS」** 公司、高等教育、企业等。”

**「Apostrophe」** 是使用 **「Node.js」**、**「Express」**、**「MongoDB」** 和 **「Vue.js」** 等技术构建的。

**「Apostrophe」** 有一个扩展和集成系统，可为 **「SSO」**、表单、营销、**「SEO」**、设计、安全等用例提供各种扩展。它还提供了拖放功能，我们可以利用它来构建网站的前端结构。

特点

*   自定义插件支持
*   REST API
*   拖放界面
*   国际化

网址: [apostrophecms.com/](https://link.juejin.cn?target=https%3A%2F%2Fapostrophecms.com%2F "https://apostrophecms.com/")

#### 6\. Prismic

![image.png](/images/jueJin/0b9f869ce94249a.png) **「Prismic」** 是一个用于编辑在线内容的无头 **「CMS」**。我们可以使用 **「Prismic」** 构建从简单、编辑和企业网站到电子商务商店的所有内容。

**「Prismic」** 有一个功能，内容切片，我们可以用它来将我们网站的页面分成不同的部分。我们可以使用内容切片来创建可重用的自定义组件，并为登陆页面、微型网站、案例研究和推荐构建动态布局。

**「Prismic」** 提供了 **「REST」** 和 **「GraphQL API」**，开发人员可以使用这些 **「API」** 来访问存储在其存储库中的内容。它还为 **「C#」**、**「JavaScript」**、**「Ruby」** 和 **「Java」** 等不同的编程语言提供 **「SDK」**。

**「Prismic」** 是一个负担得起的低成本 **「CMS」**，它有一个免费的社区计划。

网址: [prismic.io/](https://link.juejin.cn?target=https%3A%2F%2Fprismic.io%2F "https://prismic.io/")

#### 7\. Tina

![image.png](/images/jueJin/8cff743fedfb49d.png) **「Tina」** 是一个免费且完全开源的无头 **「CMS」**，专为 **「Next.js」** 和 **「Gatsby」** 等基于 **「React」** 的框架构建。它为存储在 **「Markdown」** 和 **「JSON」** 中的内容提供可视化编辑体验。

\*\*「Tina」\*\*支持 **「MDX」**，它使开发人员能够创建动态、交互式和可自定义的内容。

**「Tina」** 提供了一个 **「GraphQL API」**，我们可以使用它来查询和获取我们的内容。还有一个 **「Cloudinary」** 包，我们可以用它来优化和管理我们的媒体文件。

特点

*   很棒的实时编辑体验
*   MDX 支持
*   GraphQL API

网址: [tina.io/](https://link.juejin.cn?target=https%3A%2F%2Ftina.io%2F "https://tina.io/")

#### 8\. Keystone

![image.png](/images/jueJin/ca6f7699f89c4ba.png) **「Keystone」** 是一个开源可编程后端，可让您在几分钟内创建高度定制的 **「CMS」** 和 **「API」**。

我们可以使用 **「Keystone」** 来构建最基本的网站或更复杂的应用程序，例如电子商务商店。

使用 **「Keystone」**，我们为我们的内容描述了一个架构，并为内容获得了一个 **「GraphQL API」** 和漂亮的管理 **「UI」**。

我们可以在 **「Keystone」** 中为我们网站的不同部分创建自定义的可重用组件。

特点 GraphQL API 自定义响应组件 灵活的关系 强大的过滤功能 数据库迁移

网址: [keystonejs.com/](https://link.juejin.cn?target=https%3A%2F%2Fkeystonejs.com%2F "https://keystonejs.com/")

#### 9\. Payload

![image.png](/images/jueJin/ffdb1648c2fa4c1.png) **「Payload」** 是一个开源、自托管的无头 **「CMS」**，使用 **「Node.js」**、**「Express」**、**「React」** 和 **「MongoDB」** 构建。

**「Payload」** 提供基于配置文件中定义的内容集合自动生成的 **「REST」** 和 **「GraphQL API」**。我们还可以将本地 **「API」** 与服务器端框架（例如 **「Next.js」**）一起使用。

**「Payload」** 带有内置的电子邮件功能。我们可以使用它来处理密码重置、订单确认和其他用例。**「Payload」** 使用 **「Nodemailer」** 来处理电子邮件。

**「Payload」** 有免费计划和其他定价选项。出于开发目的，它是完全免费的，但是一旦我们想要将项目推向生产，即使我们使用免费版本，我们也必须选择可用的许可证之一。

特点

*   REST 和 GraphQL API
*   电子邮件功能
*   内容本地化
*   安全
*   三个计划中任何一个的可用功能都没有限制

网址: [payloadcms.com/](https://link.juejin.cn?target=https%3A%2F%2Fpayloadcms.com%2F "https://payloadcms.com/")

#### 10\. Directus

![image.png](/images/jueJin/9a5cac9b17654dc.png) **「Directus」** 是用于管理自定义 **「SQL」** 数据库的开源无头 **「CMS」**。\*\*Directus \*\*还有一个直观的管理应用程序，供非技术用户管理内容。

**「Directus」** 提供 **「RESTful」** 和 **「GraphQL API」** 来管理数据库中的数据。

我们可以使用我们选择的数据库，因为 **「Directus」** 支持 **「PostgreSQL」**、**「MySQL」**、**「SQLite」**、**「OracleDB」**、**「MariaDB」** 和 **「MS-SQL」** 数据库。

**「Directus」** 提供自托管的免费计划；还提供付费云计划。核心团队支持仅适用于云管理项目。

特点

*   验证
*   内容国际化
*   免费和开源
*   支持任何SQL数据库
*   零供应商锁定

网址: [directus.io/](https://link.juejin.cn?target=https%3A%2F%2Fdirectus.io%2F "https://directus.io/")

好啦, 今天的分享就到这啦, 如果文章对你有帮助, 欢迎 「点赞」 + 「评论」, 鼓励作者创造更优质的内容~

技术复盘汇总: [趣谈前端](https://link.juejin.cn?target=http%3A%2F%2Fh5.dooring.cn%2Fblog%2Fblog "http://h5.dooring.cn/blog/blog")

更多推荐
----

*   [如何搭积木式的快速开发H5页面?](https://juejin.cn/post/6904878119724056584 "https://juejin.cn/post/6904878119724056584")
*   [从零开发一套基于React的加载动画库](https://juejin.cn/post/7028583529940254757 "https://juejin.cn/post/7028583529940254757")
*   [从零开发一款轻量级滑动验证码插件](https://juejin.cn/post/7007615666609979400 "https://juejin.cn/post/7007615666609979400")
*   [如何设计可视化搭建平台的组件商店？](https://juejin.cn/post/6986824393653485605 "https://juejin.cn/post/6986824393653485605")
*   [从零设计可视化大屏搭建引擎](https://juejin.cn/post/6981257575425654792 "https://juejin.cn/post/6981257575425654792")
*   [从零使用electron搭建桌面端可视化编辑器Dooring](https://juejin.cn/post/6976476731662139428 "https://juejin.cn/post/6976476731662139428")
*   [(低代码)可视化搭建平台数据源设计剖析](https://juejin.cn/post/6973946702235615269 "https://juejin.cn/post/6973946702235615269")