---
author: ""
title: "基于 GraphQL 的云音乐 BFF 建设实践"
date: 2022-12-28
description: "BFF 研发模式一直是业界广泛青睐的前后端协作模式，它能有效解耦前后端在协作上的依赖关系，从而大幅度提升研发效率。今年，云音乐基于 GraphQL 成功在团队内部落地 BFF。"
tags: ["全栈","GraphQL","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读20分钟"
weight: 1
selfDefined:"likes:91,comments:4,collects:149,views:5354,"
---
> 图片来自：[bz.zzzmh.cn/](https://link.juejin.cn?target=https%3A%2F%2Fbz.zzzmh.cn%2F "https://bz.zzzmh.cn/")  
> 本文作者： cgt

背景: 如何解耦大前端与服务端的适配层依赖
---------------------

谈到 BFF，相信大家都不会太陌生，过去在云音乐，前后端的协作架构一直维持比较传统的前后端协作模式。各个端所需要的接口完全依赖服务端提供，服务端同学除了需要完成微服务的业务逻辑外，还需要针对前端页面调度各个领域的微服务，根据前端的数据诉求进行一定程度的组装和适配。

在年初，我们计划针对云音乐的P0页面，个人主页进行改版，云音乐的个人主页聚合了来自各个页面领域的数据，比如用户个人信息，Mlog，云圈，K歌等等，这些数据来自于各个不同的服务端团队。对大前端同学来说，我们期望能通过尽量少的接口调用获取到这些数据，以保证页面性能，同时，我们期望获取的数据接口能和页面 UI 高度适配，不需要在端上进行太多的数据转换。因此，服务端同学为我们抽离了一层独立的中间服务，负责聚合各个业务的接口数据，同时，我们需要各个业务服务端将业务领域的 DTO 转换为 VO，保证能和 UI 进行适配。

![](/images/jueJin/a3d8570d1464bc9.png)

在改版过程中，我们发现了这个模式的一些问题：

*   大前端所需接口的契约定义，对服务端有**深度依赖**，很多时候一个页面字段的变更就需要平台服务端以及业务服务端进行评估和排期，由于职能差异，中间会产生大量的沟通成本。
    
*   由于**前端UI的多变性**，各个业务服务端针对该场景提供的接口，很难具备复用性，一旦更换了其他场景，服务端同学又不得不封装新的接口。
    

而针对这些问题，我们发现业界其实已经给出了比较成熟的解决方案，就是通过在架构上引入 BFF 层。

BFF 的全称是「Backend For Frontend」，顾名思义就是面向前端的后端。它的主要职责就是针对页面的数据诉求，进行微服务的调度以及数据的组装和适配，这一部分原先我们通过微服务去完成，但现在它从微服务拆解出来得到了独立。

![](/images/jueJin/4820f38fd7690a1.png)

在 BFF 的架构里，我们不再需要平台服务端为我们提供数据聚合，这解决了我们之前提到的问题：

*   大前端同学可以开始自行完成这一层的数据组装工作，从而与服务端在适配层完成**解耦**，大部分字段的变更都可以由前端同学闭环完成，再没有大量的沟通成本。
    
*   服务端同学无须再进行从 DTO 到 VO 的数据转换，从而可以提供**复用性更强**的接口，微服务的职责也会更加明确。
    

在云音乐，存在大量类似的场景，我们期望在这些场景下都能落地 BFF 架构，最终，随着可复用接口的沉淀，以及沟通成本的降低，可以帮助我们提升整体的业务吞吐量。

那么，问题来了，如何在大量类似的场景中，让大前端同学来承接 BFF 层呢？

为什么我们选择GraphQL？
---------------

### Faas VS GraphQL

目前业界比较主流的两种 BFF 实现方案。

首先是基于 NodeJS + Faas 的形式，这种模式是基于大部分 Web 前端同学对 NodeJS 有一定基础，可以快速上手，同时它的编排非常灵活，基本能满足所有 BFF 诉求，甚至能超出 BFF 的边界，最初，我们也期望依靠这种模式落地 BFF ，但很快，我们就发现这种模式面临的一些挑战：

*   基础建设要求高：这种模式对团队的 Node 基础设施和云原生基础设施有一定要求，毕竟掌握 NodeJS 开发是一方面，针对服务的监控，运维，部署，线上问题调试都需要有对应的解决方案，并且我们需要保证这些保障能覆盖到所有 NodeJS 服务
*   存在一定学习成本：除去 Web 前端的同学，对原生客户端的同学来说，尽管 NodeJS 比较轻量，也是一门全新的语言。

第二种方式就是我们今天要聊的基于 GraphQL 的模式，GraphQL 定义来一套用于 API 的查询语言，开发者甚于可以通过一些低代码的编排快速完成查询语言的定义，这给我们带来了以下优势：

*   与技术栈解耦：开发者只需要认知 GraphQL 的 DSL，而不用再多学习一门语言，而 GraphQL 的 DSL 相对来说要好上手得多。
*   复杂度更加可控：我们可以统一实现 GraphQL 的执行引擎，开发者全部基于我们的引擎服务执行查询，能够自定义的仅仅是数据图以及查询语句，从而我们可以将服务开发的一些最佳实践附着到引擎上面。

### 什么是GraphQL?

好，那到底什么是 GraphQL 呢？

GraphQL 总体分成两部分：

*   一套用于 API 的查询 DSL：也可以称为 GraphQL 语句，你可以在这套 DSL 中描述你的查询所需要的字段，以及需要调用的接口，所需传递的参数等等。
*   一个基于图状数据的服务端运行时：来执行这套查询 DSL，它的执行逻辑就是从一张完整的数据图上，根据 GraphQL 语句的描述找到需要的节点，调度涉及的接口，最后返回符合查询语句的数据。

![](/images/jueJin/960c118e70e0d29.png) ![](/images/jueJin/29445bd02389cad.png)

比如：在上图展示的案例中，我们在(图左)编写了查询语句，(图右)则是引擎执行该查询语句后，在数据图上命中的节点。

可以看出，落地 GraphQL 的关键就在于实现它的服务端运行时，而 GraphQL 的运行时整体也可以拆解为三个部分：

*   [GraphQL 引擎](https://link.juejin.cn?target=https%3A%2F%2Fgraphql.cn%2Fcode%2F "https://graphql.cn/code/")：解析 GraphQL 语句，目前社区已经提供了各个开源版本的 GraphQL 引擎，包括 [NodeJS](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fgraphql%2Fgraphql-js "https://github.com/graphql/graphql-js")，[Java](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fgraphql-java%2Fgraphql-java "https://github.com/graphql-java/graphql-java")，[Python](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fgraphql-python%2Fgraphene "https://github.com/graphql-python/graphene") 等等，我们选定适合自己的版本即可。
    
*   [类型定义](https://link.juejin.cn?target=https%3A%2F%2Fgraphql.cn%2Flearn%2Fschema%2F%23type-system "https://graphql.cn/learn/schema/#type-system")：GraphQL 的类型系统其实和其他类型系统大同小异，GraphQL 提供了一些[基础标量](https://link.juejin.cn?target=https%3A%2F%2Fgraphql.cn%2Flearn%2Fschema%2F%23scalar-types "https://graphql.cn/learn/schema/#scalar-types")，你可以在这些基础标量的基础上不断扩展自己的业务模型，最终生成图状数据结构。
    
*   [解析器](https://link.juejin.cn?target=https%3A%2F%2Fgraphql.cn%2Flearn%2Fexecution%2F%23 "https://graphql.cn/learn/execution/#")：我们需要描述这些类型节点所需要执行的查询，当然，并不是所有的节点都需要执行查询，我们只需要保证查询的结果和节点的类型定义一致即可。比如在上图的节点中，我们分别给 song 节点和 album 节点执行了一次查询，他们会调获取歌曲详情以及获取专辑详情的 RPC 接口返回相应的数据。
    

如何在云音乐落地？
---------

在了解 GraphQL 的运行机制后，我们开始考虑如何在云音乐进行落地，在进行方案设计的阶段，我们提出了一些问题：

*   我们如何让大前端同学能够搭建稳定可靠的 GraphQL 运行时？大部分大前端同学并不具备服务端开发经验，对服务的开发，部署，运维基本一无所知，从零开始搭建 GraphQL 运行时会带来巨大的操作成本
    
*   如何快速上手 GraphQL 语句？尽管 GraphQL 语句上手并不复杂，但它本身不在前端同学的知识体系内，上手依然存在一定的学习成本。
    
*   如何与云音乐现有研发体系的对接?
    
*   如何尽可能扩大 GraphQL 的边界？
    

针对前两个问题，我们想到可以通过**低代码**的方式进行 GraphQL 的应用研发，低代码可以说是当前业界非常流行的，一种可以**打破职能边界**的手段，很多团队通过低代码让服务端同学具备了搭建前端页面的能力。那么反过来思考，前端同学同样可以通过低代码从而具备编排服务端逻辑的能力。考虑到这个方向后，我们发现 GraphQL 天然就非常适合采用低代码的形式进行搭建，其 DSL 的设计可以方便地转换成结构化的数据，从而映射成界面的操作。

针对第三个问题，GraphQL 应用应该具备和云音乐常规应用一致的发布流程管控，避免无序发布导致的线上事故，我们通过 Git 仓库对 GraphQL 应用的语句，类型定义，解析器进行管理，并融入云音乐前端研发平台 Febase 进行发布流程的管控。

最后一个问题，我们希望 GraphQL 能解决至少 70% 的 BFF 编排场景，如果仅仅依赖其自身的能力，会导致落地场景受限而意义不大，因此我们基于 GraphQL 的指令机制，对 GraphQL 的能力进行了扩展，从而能应对更多的场景。

### 分布式的架构设计

我们整体采用了分布式的架构设计：

![](/images/jueJin/fcaa39b74506044.png)

从流量走向上看，前端依然通过 Restful 请求获取页面所需要的数据，这样做的目的是我们的所有请求依然可以依赖云音乐的通用 API 网关，具备**流量控制，异常降级，静态化**的能力，从而极大地提升了接口稳定性。

而当请求通过 API 网关后，会转发到 GraphQL 应用所在的集群，GraphQL 应用的内置引擎会将接口 URL 转换成 GraphQL 语句，从而执行 GraphQL 语句，调度服务端 RPC 接口进行数据组装，最终返回页面需要的数据。

我们会为每一个 GraphQL 应用分配独立的云原生容器，依托于云音乐云原生的基础建设，我们可以灵活安排每一个 GraphQL 应用所需要的 Pod 数量，甚至能根据 CPU 进行容量的扩缩，从而减轻前端同学的运维负担。

在 Febase 平台，我们提供了低代码的 GraphQL 编辑器，Groovy 脚本的编写能力，发布流程的管控，可视化的数据图编排能力，最终基于这些能力，平台能够输出一份 GraphQL 应用配置，这份配置的内容包括：

*   从 URL 到 GraphQL 语句的映射关系
*   执行查询语句所需要的数据图
*   查询节点的解析器配置

引擎通过监听 zookeeper 拿到这份配置，并进行更新，这个过程就是 GraphQL 应用的**部署**过程，由于整个部署过程不会涉及到服务的重启，仅仅是一次配置文件的热更新，所以它的日常发布也会非常快捷，几秒就能完成，进一步提升我们的研发效率。

在这些基础能力之外，我们也和云音乐的一些基础设施平台进行了打通。比如：

*   通过 Mock 平台，我们允许开发者自由配置接口的 Mock 数据，只需要在请求头中加入一个标志位，就可以让请求走 Mock 链路。
*   所有 GraphQL 语句，数据图，脚本都会保存在 Gitlab 进行管理，通过分支进行编辑。
*   云音乐的契约管理平台为我们提供了 Java 服务端 RPC 的数据模型，使得我们可以以近乎零成本的方式来构建数据图。
*   基于 Serverless 进行应用容器的部署，保证我们的服务可以灵活地扩容缩容。
*   打通了性能，日志等各类服务监控平台，具备完备的服务运维能力。

### 基于契约快速构建GraphQL Schema

![](/images/jueJin/7826557a9630edd.png)

在了解我们的整体架构后，我们继续来看看 Febase 是如何以近乎零成本的方式构建 GraphQL 的数据图的。下面是一张非常简单数据图的构建过程，GraphQL 构建数据图的方式就是从根节点出发，录入字段以及字段对应的模型，并且我们可以在任意模型下插入新的字段，并定义该字段的模型。在插入字段的时候，我们需要定义字段对应的解析器，也就是该如何获取到字段对应的数据。

![](/images/jueJin/ee78f6bf7ed53e5.png)

我们发现，在传统的 GraphQL 数据图编排中，开发者需要自行定义模型和解析器，而事实上大部分时候，这个过程只是在搬运服务端的模型定义。因此在这里我们约定了解析器做的事情仅仅只是调用服务端的 RPC 接口，那么只要开发者选定 RPC 接口，我们就可以根据其响应的元信息拉取到服务端的数据模型，从而建立数据图。

比如在上面的例子里，当我们要导入 `song` 这个字段时，系统实际上是在仓库的约定路径下建立了两份文件：

*   `resolver.json`：描述引擎该如何调用接口，比如 RPC 接口的类名，方法名等等
*   `type.schema`：保存根据接口响应生成的 GraphQL 模型信息

下面是一份最简易的 `resolver.json` 示例：

```json
    {
    "type": "rpc", // 调用的协议类型
    "clzName": "com.netease.music.api.SongService", // RPC 类名
    "methodName": "getSongById", // RPC方法
    "params": [] // RPC参数类型列表
}
```

`type.schema` 其实就是 GraphQL 的模型定义：

```bash
    type Query {
    song: Song
}
    type Song {
    id: ID
    name: String
}
```

那么，我们是如何生成这份模型信息的呢？

通过研究 GraphQL 的引擎源码，我们发现，GraphQL 的模型定义，其实可以通过官方引擎提供的内置方法，等价转换称一份标准的 JSON 结构。那么，相对于生成模型定义的源码，生成这份 JSON 结构要简单得多，比如，上文提到的 Song 模型，就可以进行如下转换：

```js
import { introspectionFromSchema, buildSchema } from 'graphql';

const schema = introspectionFromSchema(buildSchema(schema));
```

转换后可以生成如下结构：

![](/images/jueJin/7dfae03b336ae16.png)

而在云音乐，所有服务端的接口模型定义都会维护在云音乐的契约管理平台，同样具备一份 JSON 结构来描述。

![](/images/jueJin/bb2d1ec275ba645.png)

这两份数据在逻辑上几乎完全等价，我们编写了一个转换器，定义一些从 Java 类型到 GraphQL 类型的映射关系，即可完成转换，最终生成 GraphQL 需要的类型定义，并保存在我们的 Git 仓库中。

在数据图的展示上，我们直接采用了 [`graphql-voyager`](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fgraphql-voyager "https://www.npmjs.com/package/graphql-voyager") 这个开源库，通过一些扩展让其具备了字段编辑能力，字段搜索等开发过程中经常要用到的一些能力。

### 基于AST打造LowCode GraphQL编辑模式

有了类型定义之后，接下来，我们就开始考虑如何编写 GraphQL 语句了，下图是我们的编辑界面。

![](/images/jueJin/0ea1e94124d4c1f.png)

编辑器采用的实际是 LowCode 和 ProCode 双重模式，大部分时候，开发者只需要进行字段的筛选，以及一些指令表单的配置，即可完成 GraphQL 语句的编辑。

那么，我们是如何实现这一效果的呢？

GraphQL 官方提供了语句编辑器 `graphiql` 已经非常强大，提供了语法提示，错误校验，语句调试等基本能力。但为了在团队内部大规模推广，这样的使用方式还是相对来说比较原始，我们需要进一步降低开发者的使用成本，提供 LowCode 的编辑模式。

这里我们就会提到为什么说 GraphQL 天然适合 LowCode 的编辑模式，我们知道，所有低代码编辑模式都需要定义一套标准协议，而界面的大部分操作都可以映射成对该协议的操作变更。

而针对一段 GraphQL 语句，通过官方引擎提供的内置方法，我们可以轻松获取到它的 AST 结构，并且这段 AST 结构非常容易阅读和理解：

```graphql
    {
        song @param(from: "$query.id") {
        name
    }
}
```

通过调用转换方法，可以得到如下结构：

```js
import { parse } from 'graphql';

const ast = parse(query);
```

![](/images/jueJin/98646d3dc628f95.png)

针对这部分结构，我们可以和界面建立映射关系，比如当我们通过对数据图文档进行字段勾选时，实际是生成相应的 `selection` 结构，并将其插入到指定路径的 `selections` 中。而当我们通过表单配置指令时，修改的就是相应路径的 `directives` 结构。

并且由于我们操作的是 AST 本身，所以开发者同样可以自行进行 GraphQL 语句的编写，语句的变更同样能够在操作面板体现出来。

除去低代码编辑能力外，编辑器还提供了一些辅助功能，这些功能可以让 GraphQL 接口的开发更加流畅便利，比如：

*   自动生成接口文档 ：GraphQL 的查询结果属于数据图的子集，这样我们完全可以根据开发者的 GraphQL 语句生成响应结构，并分析出依赖的参数，从而自动生成接口文档，让 GraphQL 接口也能拥有清晰的定义。
    
*   追溯请求链路：在线开发最大的难点就在于问题的定位和调试，为了帮助开发者更轻松的定位问题，我们针对线下环境 GraphQL 语句的每一步操作都进行了打点，包括每一次 RPC 调用，脚本执行，并且记录了每一次操作的输入和输出，这样，开发者在进行了一次查询后，就可以查看完整的请求链路，在请求出错时进行问题的定位。
    

### 基于指令和脚本强化原生GraphQL能力

刚刚我们提到，要用 GraphQL 满足至少 70% 的 BFF 编排场景，如果只是用开源引擎，我们很快就发现了下面的问题。

第一个问题是，我们如何传递复杂的 RPC 参数？在实际的业务场景里，由于 RPC 和 HTTP 接口已经解耦，我们往往需要通过一些逻辑构造才能构造出 RPC 需要的参数，比如在下面的 RPC 接口：

```java
    Class SearchDto {
    Integer pageSize;
    Integer cursor;
    Integer userId; // 需要获取登陆用户的 uesrId
    String search;
}
...
SongService.searchSongByUser(SearchDto params) { ... }
```

这个接口的入参是一个结构化对象，其中其他 3 个参数来源于 HTTP 接口的查询参数透传，而 userId 则需要我们从请求的 cookie 中解析出来。

GraphQL 提供了 [变量](https://link.juejin.cn?target=https%3A%2F%2Fgraphql.cn%2Flearn%2Fqueries%2F%23variables "https://graphql.cn/learn/queries/#variables") 的机制，用来进行一些参数的透传，但如果要完成上述的参数构造，它的灵活度是不够的。

第二个问题是，我们如何对响应结果做更灵活的数据转换？GraphQL 的响应结果和必须和 Schema 结构保持严格一致，虽然我们可以进行一定的字段裁剪和重命名，但针对多样的页面，我们需要更加灵活的数据转换，以便可以复用同一套 Schema 去面对更多场景。

上面两个问题的共性是， GraphQL 默认的 DSL 表达难以满足复杂场景的诉求。幸运的是，GraphQL 提供了一种名为[指令](https://link.juejin.cn?target=https%3A%2F%2Fgraphql.cn%2Flearn%2Fqueries%2F%23directives "https://graphql.cn/learn/queries/#directives")的扩展机制。指令可以附着在字段或者片段包含的字段上，然后以任何服务端期待的方式来改变查询的执行，下面是 GraphQL 引擎内置的 `@skip` 指令的使用示例。

```graphql
    {
        song {
        name @skip(if: true)
    }
}
```

上述指令的含义是，在判断条件为 `true` 时，跳过此字段的查询。

GraphQL 允许我们自定义指令，我们可以在 GraphQL 的解析器中拿到查询语句附着的指令描述，从而修改执行逻辑来完成指令的实现。

我们针对上面提到的问题提供了两种自定义指令。

#### @param指令：传递复杂的 RPC 参数

```css
directive @param(
from: String
dest: String
scriptName: String
scriptMethod: String
)
```

`@param` 指令主要在执行查询操作**之前**运行，负责收集参数来源，并将多个参数来源传入脚本进行处理，最终将处理结果传递到 RPC 参数中，它的执行流程如下图所示：

![](/images/jueJin/07341b4d1635854.png)

#### @convert指令：对响应结果做更灵活的数据转换

```css
directive @convert(
from: String
scriptName: String
scriptMethod: String
)
```

`@convert` 指令主要在执行查询操作**之后**运行，负责收集响应结果，同样其输入到脚本进行处理，最终返回通过脚本处理好的结果，它的执行流程如下图所示：

![](/images/jueJin/6d14cc8c264b089.png)

在扩展了这两种指令后，开发者可以在查询操作的前后插入自定义脚本进行参数的构造和响应结果的处理。

我们目前是基于 Java 实现的 GraphQL 引擎，因此脚本语言上采用了 [Groovy](https://link.juejin.cn?target=https%3A%2F%2Fgroovy-lang.org%2Fdocumentation.html "https://groovy-lang.org/documentation.html") 语法，尽管不是前端同学熟悉的语言，但处理一些常规的数据转换逻辑已经绰绰有余。而在完成这一部分后，我们真正做到了几乎能覆盖大部分 BFF 场景。

### 标准的研发流程管控

我们期望 GraphQL 应用的研发流程应该和普通应用的研发流程一样，当开发者接到需求时，他需要在平台创建迭代，我们会为它分配分支和环境，当他测试回归完成后，需要进行一些卡点，我们会在卡点环节提供一些语法校验以及变更的 Review，经过卡点流程后，开发者就会进入独占的上线通道，完成线上发布和验证后，开发者可以一键将开发分支合并到 master。

![](/images/jueJin/915d0c82f37e729.png)

目前在云音乐，所有前端侧的应用研发都遵循这样一套流程，这套流程极大保证了我们研发过程中的安全性和规范性。针对 GraphQL，我们在应用卡点环节提供了语法校验，基于 [`graphql-language-service-interface`](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fgraphql-language-service-interface "https://www.npmjs.com/package/graphql-language-service-interface") 提供的 `getDiagnostics`，可以帮助我们快速定位到错误的位置。

```js
const errList = getDiagnostics(query, schema);
```

![](/images/jueJin/1e2451e8231878f.png)

小结
--

最后，总结一下，在本文中，我们简单介绍了 GraphQL 以及在云音乐落地的背景，并且介绍了云音乐 Febase 平台 GraphQL 研发能力的整体架构设计，一些关键模块（数据图构造，低代码 GraphQL 编辑器）的实现思路，以及针对 GraphQL 引擎的扩展设计，GraphQL 应用的研发流程管控。后面我们也会考虑分享更多 GraphQL 引擎的实现细节以及 GraphQL 的应用案例。

目前，基于 GraphQL 的 BFF 研发模式已经在云音乐实现了半年左右，期间也由大前端同学自主产出了 160+ 的数据接口，其中不乏一些高流量的核心场景。当然，针对 BFF 研发模式，我们确实也还处在起步的探索阶段。未来，随着 GraphQL 接口在云音乐业务中的覆盖度越来越高，我们期望能够从中总结出一些数据图模型的设计经验，帮助前后端同学建立更高效的协作关系。

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！