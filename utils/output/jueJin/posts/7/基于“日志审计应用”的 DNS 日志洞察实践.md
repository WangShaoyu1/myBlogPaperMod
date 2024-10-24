---
author: "阿里云云原生"
title: "基于“日志审计应用”的 DNS 日志洞察实践"
date: 2024-08-01
description: "监控 DNS 服务可以帮助用户识别网络活动并保持系统安全。出于合规和安全性的考虑，公司通常要求对网络日志进行存储和分析。通过 DNS 日志，可以清晰了解企业域名解析的使用情况，于发现配置错误和不必要的"
tags: ["云原生中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读14分钟"
weight: 1
selfDefined:"likes:0,comments:0,collects:0,views:1511,"
---
作者：羿莉 (萧羿)

基础背景
----

DNS(Domain Name System) **\[** **1\]** 是任何网络活动的基础。它将易于记忆的域名转换为机器能够理解的 IP 地址。监控 DNS 服务可以帮助用户识别网络活动并保持系统安全。出于合规和安全性的考虑，公司通常要求对网络日志进行存储和分析。通过 DNS 日志，可以清晰了解企业域名解析的使用情况，于发现配置错误和不必要的网络障碍，减少系统中断，在帮助企业对用户行为、网络行为进行审计的同时，及时发现潜在的安全问题。

### DNS 解析流程

DNS 查询的结果通常会在本地域名服务器中进行缓存，如果本地域名服务器中有缓存的情况下，则会跳过如下 DNS 查询步骤，很快返回解析结果。下面的示例则概述了本地域名服务器没有缓存的情况下，DNS 查询所需的几个步骤：

![图片](/images/jueJin/532915e28eca4c6.png)

### DNS 记录类型

DNS（域名系统）中存在多种不同类型的记录，每种记录类型有特定的用途。以下是一些最常见的 DNS 记录类型及其解释：

![图片](/images/jueJin/969dc8d6477c4d3.png)

以上是一些基本的 DNS 记录类型，每种类型在日常网络和域名的解析中扮演着重要角色。

日志审计
----

### 日志审计应用概况

日志审计服务 **\[** **2\]** 是阿里云日志服务 SLS **\[** **3\]** 平台下的一款应用，它在继承了日志服务 SLS 的全部功能以外，还有强大的多账号管理及跨地域采集阿里云各种云产品日志的功能，并且支持通过资源目录 **\[** **4\]** （Resource Directory）的方式有组织性地统一地管理和记录多账号下云产品实例的日志信息。

### 如何开通 DNS 日志采集

1.  登录 SLS 产品控制台 **\[** **5\]** 。
    
2.  在**日志应用**栏选择**审计与安全**页签，然后单击**日志审计**服务。
    

![图片](/images/jueJin/32ebd045509b446.png)

3.  在**全局配置**页面，将 DNS 的日志审计开关打开并选择**中心项目 Project 所在区域**，例如 cn-hangzhou；详细操作步骤参见开启日志采集功能 **\[** **6\]** 。

日志审计现已支持**内网 DNS 日志、公网 DNS 解析日志、全局流量管理日志**这三种日志类型，用户可以按需开启。

![图片](/images/jueJin/81cb4b186a4a460.png)

### 其他功能

此外，除了基础存储、查询、告警等 SLS 功能外，还支持跨账号 **\[** **7\]** 采集、精细化采集策略 **\[** **8\]** 、Terraform **\[** **9\]** 配置等功能。此处不详细展开，用户可以参考内网 DNS 日志转存 SLS **\[** **10\]** 进行配置使用。

DNS 日志详情
--------

具体的日志字段内容，及解释请参见**附录**。

### 内网请求应答示例

日志审计会自动开启用户满足采集策略的地域及 VPC 实例的流量分析功能，详情参见开启 DNS 内网日志采集 **\[** **11\]** 。开启流量分析功能后，日志会自动转存投递到用户的日志审计 DNS 专属库 dns\_log 中，下面是具体日志内容及相应字段含义的解释介绍。

#### DNS 请求日志

例如我们查询阿里云日志服务控制台 sls.console.aliyun.com 的 ip 地址。

```arduino
dig sls.console.aliyun.com +short
```

![图片](/images/jueJin/02e6ef531ae54fe.png)

在该请求日志内容中，可以看到会话请求 id 为 50999，该 id 会在后续**模块应答**日志中继续复用，直至得到完整请求应答日志, 请求域名服务器为内网 ECS 的 ip 地址172.16.0.184，响应地址为阿里云内置域名解析服务地址 100.100.2.136，响应端口为 53。

请求日志模块为 GLOBAL，请求域名为完全限定域名 **\[1\*\*\*\*2\]** sls.console.aliyun.com.，DNS 记录类型为 A 类，请求发出的 ecs 所属的实例在 cn-hangzhou 地域，其 VPC id 为 vpc-bp********9fj，ECS 主机 id 为 i-bp19********d7，主机名为iZbp\*\*\*\*\*\*\*\*d7Z，主机所属账号为 148\*\*\*\*\*\*\*\*\*\*782，DNS 信息标志为 RD AD ，具体细节可参见附录日志字段说明。

#### 模块应答日志

![图片](/images/jueJin/1d28cb54a98d43c.png)

发出请求后，首先得到一条**递归**模块应答日志，从根域名服务器开启递归，得到sls.console.aliyun.com. 的 CNAME 记录为 sls-console-adns.console.aliyun.com.

![图片](/images/jueJin/5dae114f5c244cb.png)

然后继续查询 sls-console-adns.console.aliyun.com. 得到一条**缓存**模块应答日志，其对应的 CNAME 记录为 sls-console-adns.console.aliyun.com.gds.alibabadns.com.

![图片](/images/jueJin/63eb93ee334c4dc.png)

继续查询 sls-console-adns.console.aliyun.com.gds.alibabadns.com. 得到对应的**缓存**模块应答日志，其 CNAME 记录为 tyjr-cn-hangzhou.aliyun.com.

![图片](/images/jueJin/2b8215b1712e423.png)

继续查询 tyjr-cn-hangzhou.aliyun.com. 找到**缓存**应答模块对应的 CNAME 记录为 tyjr-cn-hangzhou.aliyun.com.vipgds.alibabadns.com.

![图片](/images/jueJin/315f00315d81413.png)

追溯到域名 tyjr-cn-hangzhou.aliyun.com.vipgds.alibabadns.com. 后，得到对应的资源记录应答集合，并找到其真正的 A 记录地址例如 47.97.242.13。

![图片](/images/jueJin/b377fe2aa9f740c.png)

#### 全局应答日志

最后我们得到一条完整的全局应答日志，从而找到 sls.console.aliyun.com. 对应的 ip 地址。

![图片](/images/jueJin/cd2385d5d19043a.png)

![图片](/images/jueJin/889e760e12024e6.png)

### 公网解析日志示例

#### 配置公网域名流量分析

首先用户需要进入 DNS 控制台 **\[** **13\]** ，添加对应的域名，并打开相应域名下的 DNS 流量分析功能。

![图片](/images/jueJin/85cde7117c094f3.png)

![图片](/images/jueJin/2cb155310eb043c.png)

#### 查看公网权威解析日志

```css
dig   y*****.online  @dns27.hichina.com
```

![图片](/images/jueJin/f597ab73918744f.png)

当前公网解析日志仅包含响应模块，在 SLS 日志审计下可以得到如下的响应日志，其结果是一条 SOA 记录，指定关于该区域的权威信息，如 DNS 区域的主名称服务器，区域的管理员，TTL 等信息。

![图片](/images/jueJin/c326763486fa44c.png)

### 全局流量管理日志示例

#### 配置全局流量管理模块

首先用户需要进入 DNS 控制台，全局流量管理界面，购买全局流量管理实例，并创建接入域名。

![图片](/images/jueJin/98538e810d604e6.png)

![图片](/images/jueJin/7d0febb5301f438.png)

#### 查看全局流量管理日志

```markdown
dig ti*****.g****.net +vc

```

![图片](/images/jueJin/7909685ffec94aa.png)

其响应日志内容记录在日志审计中如下：

![图片](/images/jueJin/58e456510c6342a.png)

洞察 DNS 日志
---------

因为 DNS 日志包含了丰富的信息，所以知道这些字段的具体解释，以及这些字段出现异常时，其内容所代表的特殊意义，对于我们在网络安全和网络性能中排查定位将会提供很大帮助。下面，本文大概总结了一些在监控 DNS 日志时安全运营人员应该注意的信号，掌握这些信号就可以快速而轻松地发现问题。详情可参见**附录**中日志字段的详细介绍。

*   **query\_name 字段，** 其内容为查询的完全限定域名 (FQDN **\[** **14\]** , fully qualified domain name），可以让用户知道每一次请求应答的具体查询内容。如果查询的 Domain 出现在**恶意域名**列表上，那么该日志就可以作为安全威胁的证据。此外，过多重复的查询可能是恶意活动的一个指标，例如 DoS 攻击，在这种攻击中，恶意行为者让目标域名的服务器不堪重负，发送异常超高量的 DNS 查询。
*   **query\_type 字段，** 包含请求的记录类型，当搜寻恶意活动时可以提供有用的上下文。例如，**文本（TXT）** 记录经常被用于指挥和控制（C2）攻击以及 DNS 隧道攻击。详细的记录类型可以参见前文背景介绍。
*   **rt 字段，** 其内容为请求应答时间，如果 query\_type 为 GLOBAL，则为**全局应答**，表示整个请求到应答的时延，否则模块日志 rt 仅表示在**模块内部**消耗的时延。如果 rt 值异常提升可能是网络连接问题的一个信号。例如，如果安全运维人员注意到与 DNS 日志中 rt 值升高相关的超时错误激增，你可能会推断超时错误是在 DNS 解析过程中发生的，这将表明用户的 DNS 服务器可能存在问题。
*   **rcode 字段，** 即响应状态码，例如：0 表示 NOERROR，没有错误，查询域名成功；1 表示 FORMERR，格式错误，DNS 无法解析该请求；2 表示 SERVFAIL，即 DNS 服务器遇到内部错误或者超时引起的解析失败。rcode 为 2 是 DNS 无法从权威名称服务器获取有效响应时常见的一种错误。记录这个值的日志可以帮助运维人员找出问题的根本原因。
*   **answer\_rrset 字段，** 包含 DNS 所请求的信息返回的 IP 地址集合，例如 \[[www.taobao.com](https://link.juejin.cn?target=http%3A%2F%2Fwww.taobao.com "http://www.taobao.com") 600 A 1.1.1.1\]，这个字段的常见值 ip，可以帮助安全运维人员在本地网络上定位受损机器。在公共互联网上，这些 IP 地址可以与**恶意行为者 IP 地址的数据库**对照检查，例如可以发现是否存在 DNS 劫持行为等。
*   **dns\_msg\_flags 字段，** 该字段中有许多请求标志（QR、RD、AA、TC 等），表明如查询是否是递归的、是否包含 DNSSEC 状态等。这些标志可以为 DNS 请求提供重要的上下文，例如所请求的 DNS 记录是否来自它的权威名称服务器、以及数据是否被修改。

下面我们通过几个具体的**实践案例**，深入体验如何洞察 DNS 日志。

### 解析路径劫持

#### 原理背景

通过对 DNS 数据包“请求阶段”中的解析路径进行划分，我们将 DNS 解析路径分为**四类。**

*   首先是正常的 DNS 解析路径（Normal resolution），用户的 DNS 请求只到达指定的公共 DNS 服务器；此时，权威服务器应当只看到一个来自公共服务器的请求。

以下三类均属于 **DNS 解析路径劫持**：

*   **请求转发**（Request redirection），用户的 DNS 请求将直接被重定向到劫持者的解析服务器，解析路径如下图**红色**路径所示；此时，权威服务器只收到来自这个服务器的请求，用户指定的公共 DNS 服务器完全被排除在外。
*   **请求复制**（Request replication），用户的 DNS 请求被网络中间设备复制，一份去往原来的目的地，一份去往劫持者使用的解析服务器，解析路径如下图**橙色**路径所示；此时，权威服务器将收到两个相同的查询。
*   **直接应答**（Direct responding），用户发出的请求同样被转发，但解析服务器并未进行后续查询而是直接返回一个响应，解析路径如图**紫色**路径所示；此时，权威服务器没有收到任何查询，但是客户端却收到解析结果。

![图片](/images/jueJin/563e76262d244b9.png)

#### 环境模拟

下面我们将构造一个**直接应答**的解析路径劫持实验：

1）正常请求返回及日志审计 DNS 日志记录如下：

```markdown
dig aaa.y******.online

```

![图片](/images/jueJin/fe73b049b8c0467.png)

在 sls 日志审计的 dns\_log 可以看到正常的权威解析的资源记录集 \["y\*\*\*\*\*\*.online. 600 SOA dns27.hichina.com. hostmaster.hichina.com. 2024060609 3600 1200 86400 600 "\]，对应的权威 dns 解析服务器为 dns27.hichina.com，因为没有配置对应的 ip 记录，所以应答资源记录集为空。

![图片](/images/jueJin/6bc3693742d14c8.png)

2）自建 DNS 服务器，并配置记录，更改 nameserver 配置

接下来，我们基于 bind **\[** **15\]** 自建一个 DNS 解析服务器，其 ns 地址为 172.16.0.186，在该 DNS 服务器的 zone 数据库文件（y\*\*\*\*\*.online.zone）下配置一条记录：

```csharp
[aaa A 172.16.0.189]
```

![图片](/images/jueJin/c9e628514946437.png)

3）然后我们修改本地 nameserver，将其地址指向我们自建的 DNS 服务器

![图片](/images/jueJin/e23c398b79b441d.png)

4）自建 dns 服务器直接应答，跳过前往权威 dns 服务器查询请求过程

此时 dig aaa.y\*\*\*\*\*\*.online. 返回的 ip 地址为 172.16.0.189，即我们在自建 dns 解析服务器配置的 A 记录返回。没有经过权威解析服务器的请求流程，直接应答一个结果，从而将 aaa.y\*\*\*\*\*\*.online 域名的访问劫持到我们指定的 ip 地址。

![图片](/images/jueJin/1a82ed90f24c4ed.png)

### PrivateZone 域名转发

下面展示一个 **Private zone 域名转发**的日志洞察示例，比如由于某些业务场景安全需要，需要将某些服务的域名访问地址从公网方式（_**.xxx.com）切换到 vpc 内网方式（**_\-vpc-inner.region.xxx.com），而当前线上业务应用部署复杂，业务切换流依赖较多，直接进行业务代码切换的复杂性太大，很容易影响上下游业务，这个时候我们可以通过简单 **PrivateZone 域名转发**的案例进行域名切换，从而实现平滑业务流程，无损且快捷地切换到对应链路，而 DNS 解析日志可以帮助我们验证域名转发是否配置正确，符合期望。

#### 配置域名转发

![图片](/images/jueJin/7920d8a25e124c6.png)

#### 验证域名转发

1）此时我们请求域名 \*\*\*.xxx.com.

![图片](/images/jueJin/dca135c57e334d3.png)

2）经过 private zone 域名转发，经过权威普通模块，得到一个 CNAME 记录 \*\*\*-vpc-inner.cn-hangzhou.xxx.com.，以下为模块应答日志。

![图片](/images/jueJin/63d1b5b211cd430.png)

继续递归，得到 \*\*\*-vpc-inner.cn-hangzhou.xxx.com. 的 CNAME 记录 \*\*\*-vpc-inner.cn-hangzhou.xxx.com.yyy.zzz.com.

![图片](/images/jueJin/9ac1878ddcac4c7.png)

继续递归，得到 \*\*\*-vpc-inner.cn-hangzhou.xxx.com.yyy.zzz.com. 的 CNAME 记录 _****\-vpc-inner.cn-hangzhou.xxx.com.****_.com.

![图片](/images/jueJin/42670fae72624be.png)

等走完全部递归查询，可以得到真正的 ip 地址为 100._**.**_.35。

![图片](/images/jueJin/952c9c283353485.png)

3）最终我们得到完整应答日志，得到 \*\*\*.xxx.com. 请求所对应的真正的解析地址 IP 记录。因为日志中有完整的 vpc、ecs id、ecs hostname 信息，后续出现问题，安全运维人员可以直接排查定位，判断 DNS 解析路径是否符合期望。

![图片](/images/jueJin/ae31a35ea3a24f4.png)

### 解析失败、解析请求异常和解析 RT 异常

#### 解析失败

rcode 是作为应答日志可以反映基本的解析状态，rcode 返回值 **SERVFAIL（2）** 或者 **NXDOMAIN**（3）是两个较为典型且常见的解析失败场景，前者说明 DNS 服务器遇到内部错误或者超时引起的解析失败，后者表示这个域名并未找到。此时我们结合具体的用户阿里云 Uid 信息，和具体的 ECS 信息（内网场景）则可以更快捷地定位到此时出现问题的服务。下表是查找访问**不存在的域名**（rcode=3）的汇总统计记录。

```sql
rcode :3  and GLOBAL | select distinct(query_name),  ecs_hostname, region_id, vpc_id, user_id
```

![图片](/images/jueJin/d217c874ea0745b.png)

#### 解析请求异常

前文已经提到，query\_name 字段如果出现安全异常值（例如安全威胁库中已知的恶意地址），则可以作为一个非常直观的安全威胁的证据指标，另外某些 query\_name 的解析量飙升，也可以作为判断 DoS 攻击的依据，下面是一个 vpc 下，通过全局响应日志进行 query\_name 统计的图表示例，如果从中发现了对某些已知恶意域名的访问，则可以进一步排查，找到安全威胁：

```vbnet
* and vpc_id: vpc-j6cd*****mgkrt6 and ( region_id : cn-hongkong ) and GLOBAL  and ( region_id : cn-hongkong ) and rcode: 0 |select count(*) as total_req, query_name group by  query_name
```

![图片](/images/jueJin/eb12083a001f4f2.png)

正常情况下域名的解析请求量维持在一个可控平稳的范围（如下图），如果出现某个域名的请求量出现陡增，例如从 20 次/min 提升到了 1000 次/min，说明该域名可能遭受了攻击，可以通过创建告警分组评估 **\[** **16\]** ，分别监控需要特殊关注的域名目标，通知到响应的安全运维人员处。

```csharp
* and vpc_id: vpc-j6cd*****mgkrt6 and ( region_id : cn-hongkong ) and GLOBAL and rcode: 0 |select date_trunc('minute', __time__ )as t , query_name, count(*) as total_req group by t, query_name

```

![图片](/images/jueJin/32dd3c233b164a6.png)

#### 解析请求 RT 异常

解析响应时间异常同样值得引发注意，这里我们仅用全局应答日志的 RT 进行统计分析，全局应答日志的 RT 是表示整个查询到应答的时延，解析路径的各个模块也包括在内，因为有 CACHE 模块的存在，正常情况下响应时延在一个可控范围。如果某个域名的 RT 突然提升，有可能是因为用户的 DNS 服务器网络配置存在问题，或者是遭遇了网络攻击，此时的域名解析服务器已经不堪重负，因此 RT 的统计分析也是非常有价值的观测指标。

```csharp
* and vpc_id: vpc-j6cd*****mgkrt6  and ( region_id : cn-hongkong ) and GLOBAL  and rcode: 0 |select date_trunc('minute', __time__ )as t , query_name, avg(rt)
as avg_rt where rt>=60 group by t, query_name
```

_**附录**_

DNS 日志字段

![image.png](/images/jueJin/8e4b5c55ffda407.png)

![image.png](/images/jueJin/95ba596e66804e1.png)

**相关链接：**

\[1\] DNS(Domain Name System)

_[help.aliyun.com/zh/dns/basi…](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fzh%2Fdns%2Fbasic-concepts "https://help.aliyun.com/zh/dns/basic-concepts")_

\[2\] 日志审计服务

_[help.aliyun.com/zh/sls/user…](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fzh%2Fsls%2Fuser-guide%2Foverview-of-log-audit-service "https://help.aliyun.com/zh/sls/user-guide/overview-of-log-audit-service")_

\[3\] 日志服务 SLS

_[help.aliyun.com/zh/sls/prod…](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fzh%2Fsls%2Fproduct-overview%2Fwhat-is-log-service "https://help.aliyun.com/zh/sls/product-overview/what-is-log-service")_

\[4\] 资源目录

_[help.aliyun.com/zh/resource…](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fzh%2Fresource-management%2Fproduct-overview%2Fwhat-is-resource-management "https://help.aliyun.com/zh/resource-management/product-overview/what-is-resource-management")_

\[5\] SLS 产品控制台

_[sls.console.aliyun.com/lognext/pro…](https://link.juejin.cn?target=https%3A%2F%2Fsls.console.aliyun.com%2Flognext%2Fprofile "https://sls.console.aliyun.com/lognext/profile")_

\[6\] 开启日志采集功能

_[help.aliyun.com/zh/sls/user…](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fzh%2Fsls%2Fuser-guide%2Fenable-log-collection-1%23section-h4b-mzq-ed1 "https://help.aliyun.com/zh/sls/user-guide/enable-log-collection-1#section-h4b-mzq-ed1")_

\[7\] 跨账号

_[help.aliyun.com/zh/sls/user…](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fzh%2Fsls%2Fuser-guide%2Fconfigure-multi-account-collection%3Fspm%3Da2c4g.11186623.0.i4 "https://help.aliyun.com/zh/sls/user-guide/configure-multi-account-collection?spm=a2c4g.11186623.0.i4")_

\[8\] 采集策略

_[help.aliyun.com/zh/sls/user…](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fzh%2Fsls%2Fuser-guide%2Fconfigure-log-collection-policies%3Fspm%3Da2c4g.11186623.0.0.5f8e6632XACz9z "https://help.aliyun.com/zh/sls/user-guide/configure-log-collection-policies?spm=a2c4g.11186623.0.0.5f8e6632XACz9z")_

\[9\] Terraform

_[help.aliyun.com/zh/sls/user…](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fzh%2Fsls%2Fuser-guide%2Fuse-terraform-to-configure-log-audit-service%3Fspm%3Da2c4g.11186623.0.0.d2d0c154paZb41 "https://help.aliyun.com/zh/sls/user-guide/use-terraform-to-configure-log-audit-service?spm=a2c4g.11186623.0.0.d2d0c154paZb41")_

\[10\] 内网 DNS 日志转存 SLS

_[help.aliyun.com/zh/dns/intr…](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fzh%2Fdns%2Fintranet-dns-parsing-log-transfer-to-sls%3Fspm%3D5176.28197678_-433446379.help.dexternal.1a065b8ePzpUmZ "https://help.aliyun.com/zh/dns/intranet-dns-parsing-log-transfer-to-sls?spm=5176.28197678_-433446379.help.dexternal.1a065b8ePzpUmZ")_

\[11\] 开启 DNS 内网日志采集

_[help.aliyun.com/zh/sls/user…](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fzh%2Fsls%2Fuser-guide%2Fadditional-fees-for-some-cloud-services%3Fspm%3Da2c4g.11186623.0.0.3c2844aaoZgwuP%23fcb33aa3b5p0k "https://help.aliyun.com/zh/sls/user-guide/additional-fees-for-some-cloud-services?spm=a2c4g.11186623.0.0.3c2844aaoZgwuP#fcb33aa3b5p0k")_

\[12\] 完全限定域名

_[en.wikipedia.org/wiki/Fully\_…](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FFully_qualified_domain_name "https://en.wikipedia.org/wiki/Fully_qualified_domain_name")_

\[13\] DNS 控制台

_[dns.console.aliyun.com/](https://link.juejin.cn?target=https%3A%2F%2Fdns.console.aliyun.com%2F "https://dns.console.aliyun.com/")_

\[14\] FQDN

_[en.wikipedia.org/wiki/Fully\_…](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FFully_qualified_domain_name "https://en.wikipedia.org/wiki/Fully_qualified_domain_name")_

\[15\] bind

_[bind9.readthedocs.io/en/v9.18.14…](https://link.juejin.cn?target=https%3A%2F%2Fbind9.readthedocs.io%2Fen%2Fv9.18.14%2Fchapter1.html "https://bind9.readthedocs.io/en/v9.18.14/chapter1.html")_

\[16\] 分组评估

_[help.aliyun.com/zh/sls/user…](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fzh%2Fsls%2Fuser-guide%2Fuse-the-group-evaluation-feature "https://help.aliyun.com/zh/sls/user-guide/use-the-group-evaluation-feature")_