---
author: "掘金酱"
title: "了解扣子：如何用 CozeIDE 制作一个插件"
date: 2024-04-15
description: "CozeIDE 是扣子给你提供的插件开发利器，你可以在 CozeIDE 上开发、测试插件，并由扣子帮你托管运行插件代码，你无需关心购买服务器、配置域名等事项。"
tags: ["Coze中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:71,comments:0,collects:53,views:9954,"
---
一、CozeIDE 是什么？
==============

CozeIDE 是扣子给你提供的插件开发利器，你可以在 CozeIDE 上开发、测试插件，并由扣子帮你托管运行插件代码，你无需关心购买服务器、配置域名等事项。CozeIDE 还内置了 AI 编程助手，无论你是否有编程基础，都可以通过 AI 助手，快速开发插件。

CozeIDE 有哪些主要功能？
----------------

CozeIDE 为插件开发者提供了一整套代码编辑、依赖包管理、测试、元数据管理、发布部署能力，以及 AI 编程助手，解决你开发插件过程中的各种问题。

### 1、代码编辑

CozeIDE 为你提供了代码模板，你只需要在代码模板的基础上进行开发、完善。IDE 提供了 2 种运行时：Node.js 和 Python，满足你不同的诉求。

#### Node.js 模板示例

![](/images/jueJin/65fe0e706970420.png)

#### Python 模板示例

![](/images/jueJin/557ea929024c4b0.png)

### 2、AI 编程助手

如果你写代码过程遇到问题，可通过快捷键唤起 AI 编程助手（macOS 为 `Command + I`、windows 为 `Ctrl + I`）。AI 编程助手可为你提供以下几个便捷的能力：

*   AI 生成代码：输入想要的功能，点击
*   AI 修改代码：选中待修改的代码，唤起 AI 助手，输入想要修改的功能。
*   AI 代码解释/代码注释：选中代码后，输入/ 选择不同指令，由 AI 对代码进行解释，或者自动生成代码注释。

![](/images/jueJin/a24f7806dfef4b0.png)

### 3、依赖包管理

依赖包是代码运行依赖的外部代码模块。如果你的代码中引用了其他外部的模块，但没有安装依赖，IDE 会提示错误。根据错误信息，点击左下角【添加依赖】，输入依赖的名称即可安装。安装过程中可查看控制台的日志，观察安装进度。

#### 具体示例

未安装依赖时报错

![](/images/jueJin/bb5f4c0fdb2c4ff.png)

安装依赖

![](/images/jueJin/695dfc026ea6435.png)

安装依赖后未报错

![](/images/jueJin/5f8ee10f9c94458.png)

若需要指定安装某个版本，你可以通过依赖名@版本号来进行选择。

![](/images/jueJin/857eb4870eaf484.png)

### 4、元数据

元数据的作用是让大模型理解每个工具输入参数、输出参数有哪些，以及对应的含义。

在以下代码示例中，这个工具接收一个输入参数：name，并返回一个参数：message。因此，我们需要将 name 和 message 补充到元数据面板。

![](/images/jueJin/af4b6a1176594b3.png)

![](/images/jueJin/fffbe885923c447.png)

### 5、测试

写完代码和元数据后，需要验证代码是否正常运行。点击右侧的测试，输入测试的数据。

如果你已经填写元数据中的输入参数，则可以点击自动生成，IDE 会生成符合你结构定义的随机数据。你需要修改成你需要的值即可。填写完成后，点击运行，即可看到测试结果。

![](/images/jueJin/e6a4a80d50a84bb.png)

![](/images/jueJin/73cfb4e9af6a43c.png)

如果你之前未填写元数据的输出参数结构，可以在测试通过后，点击下方的【更新输出参数】，IDE 会自动更新覆盖在元数据区域，你只需要补充完善描述即可。

### 6、发布

测试通过后，就可以去点击发布啦。如果你开发了多个工具，但有些没测试完成不想发布，可以在该入口禁用这些工具，只发布启用的工具。

接着选择“信息收集声明”。如果插件会收集用户信息，请选择“是”并选择具体信息，用户在使用该插件时能了解收集的信息。否则，选择“否”，点击发布即可。

![](/images/jueJin/17491025af23420.png)

二、10 分钟快速制作插件
=============

接下来我们以开发实际插件为例，演示整个创建流程。

### 插件一、查询股票价格（难度 🌟 ）

#### 明确目的和方案

首先，需要构思这个插件具备什么能力：根据股票名称查询股票价格。

接着搜索哪些网站可以免费查询股票价格。通过互联网检索，可以得知“alpha vantage”提供了免费查询美股股票价格的能力。明确了目的和方案后，开始开发插件。该插件难度🌟，教程内已提供源码，可直接复制使用。

#### 操作步骤

##### 步骤一：新建插件和工具

1.  打开 [www.coze.cn/](https://link.juejin.cn?target=https%3A%2F%2Fwww.coze.cn%2F "https://www.coze.cn/") 选择需要所属的团队。
    
2.  点击右上角创建插件，填写名称，选择插件创建方式为“在 Coze IDE 创建”，运行时选择“Node.js”（你也可以根据自己的情况，选择 Python）
    
    1.  插件名称：查询股票价格
    2.  插件描述：查询股票价格
3.  点击“在 IDE 中创建工具”，填写工具名称和介绍：
    
    1.  名称：search\_stock\_prices
    2.  介绍：根据股票名称查询股票价格

![](/images/jueJin/21e65a135c884a3.png)

##### 步骤二：代码编写和开发

1.  因为已经明确需要根据股票名称查询价格，所以可以先在元数据中定义一个输入参数，名称：code，描述为：股票名称

![](/images/jueJin/26d3eadaf07044e.png)

_编写元信息_

2.  在代码编辑器中，通过快捷键唤起 AI 助手（macOS 为 `Command + I`、windows 为 `Ctrl + I`），输入我们的需求：根据 input.code，到 alpha vantage 查询股票价格。你也可以手动编写代码。
3.  AI 生成代码后，点击接受，再进行调整，最后得到这样一份代码。（若 AI 生成效果不好，可直接复制本代码使用）

```TypeScript
import { Args } from '@/runtime';
import { Input, Output } from "@/typings/search_stock_prices/search_stock_prices";
import axios from 'axios';
    export async function handler({ input, logger }: Args<Input>): Promise<Output> {
    const code  = input.code;
    const apiKey = 'YOUR_ALPHA_VANTAGE_API_KEY';
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${code}&apikey=${apiKey}`;
    
        try {
        const response = await axios.get(url);
        const data = response.data['Global Quote'];
            return {
            code: code,
            price: data['05. price'],
            };
                } catch (error) {
                logger.error(`Error fetching stock price for ${code}: ${error}`);
                    return {
                    code: code,
                    price: null,
                    };
                }
            }
```

4.  左侧安装 axios 依赖，安装该依赖后可发起请求查询数据。未安装依赖时会提示错误。

![](/images/jueJin/fef13ab79a8d48c.png)

_安装依赖后正常_

##### 步骤三：测试

1.  点击自动生成测试数据，修改 code 为 AAPL（苹果），点击运行。

![](/images/jueJin/96f9f32e24e3434.png)

2.  点击“更新输出参数”，然后切换到“元数据”面板，修改输出参数中 code 和 price 的描述。修改后，需再次运行测试，避免修改错误导致运行出现问题。

![](/images/jueJin/adbdd6a4c06a457.png)

3.  测试通过后，就可以进行发布

##### 步骤四：发布

1.  点击右上角发布，点击下一步，选择“否”，点发布。
2.  发布成功后，就可以去创建 Bot 使用啦

![](/images/jueJin/ee6833b7fb304c3.png)

![](/images/jueJin/daccae6bd65f47d.png)

##### 步骤五：创建 Bot 使用该插件，使用 Bot

1.  回到 Bot 列表，点击创建 Bot，填写名称和功能描述：
    
    1.  名称：查询股票价格
        
    2.  功能介绍：查询股票价格
        

![](/images/jueJin/777c9360aa9f470.png)

1.  关联刚刚发布的插件，并且填写 Bot 的回复逻辑，点击“优化”

![](/images/jueJin/f6e21b586fe0405.png)

_关联插件、填写Prompt_

3.  优化完 Prompt 后，就可以和 Bot 进行对话，查询公司股票啦。

![](/images/jueJin/748076ff988c43a.png)

_自动优化Prompt，进行使用_

4.  更多 Bot 配置和高阶玩法，可参考[官方文档](https://link.juejin.cn?target=https%3A%2F%2Fwww.coze.cn%2Fdocs%2Fguides%2Ffunction_overview "https://www.coze.cn/docs/guides/function_overview")

### 插件二、掘金插件（难度 🌟🌟🌟 ）

#### 明确目的和方案

首先，需要明确插件具有哪些能力：

1.  列出掘金上的热门文章
2.  按主题搜索掘金上的热门文章

该插件难度🌟🌟🌟 ，教程内未提供源码，你可自行调研方案。

#### 操作步骤

##### 步骤一：新建插件和工具

1.  打开 [www.coze.cn/](https://link.juejin.cn?target=https%3A%2F%2Fwww.coze.cn%2F "https://www.coze.cn/") 选择需要所属的团队。
    
2.  点击右上角创建插件，填写名称，选择插件创建方式为“在 Coze IDE 创建”，运行时选择“Node.js”（你也可以根据自己的情况，选择 Python）
    

![](/images/jueJin/10ccfb32c6f0457.png)

1.  点击“在 IDE 中创建工具”，创建一个 search 的工具

![](/images/jueJin/629a28f0070d418.png)

##### 步骤二：代码编写和开发

进行代码开发、安装依赖包安装等

![](/images/jueJin/eb61c2a204b2447.png)

##### 步骤三：测试

开发完成后，填写测试数据，进行测试。这个阶段你可能会反复执行和调试代码，查看输出结果是否符合预期、增加异常处理、对 API 返回的脏数据的处理等。

![](/images/jueJin/907dccd38a3c4fc.png)

更新元数据：

![](/images/jueJin/2cf854267f1d471.png)

##### 步骤四：发布

点击右上角发布，点击下一步，选择“否”，点发布。发布成功后，就可以去创建 Bot 使用啦。

##### 步骤五：创建 Bot 使用该插件，使用 Bot

回到 Bot 列表，创建一个 Bot，或选择现有的 Bot，进入 Bot 编排页面，关联这个插件后进行使用。更多 Bot 配置和高阶玩法，可参考[官方文档](https://link.juejin.cn?target=https%3A%2F%2Fwww.coze.cn%2Fdocs%2Fguides%2Ffunction_overview "https://www.coze.cn/docs/guides/function_overview")

![](/images/jueJin/9832223ed99e41b.png)

以上就是 2 个插件和 Bot 开发的完整过程，赶快去试试开发你的 IDE 插件吧。

#### 体验一下

如果想体验以上掘金 Bot，点击下方链接即可快速体验

[www.coze.cn/store/bot/7…](https://link.juejin.cn?target=https%3A%2F%2Fwww.coze.cn%2Fstore%2Fbot%2F7356502654404804634 "https://www.coze.cn/store/bot/7356502654404804634")