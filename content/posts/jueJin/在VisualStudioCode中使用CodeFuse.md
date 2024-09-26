---
author: "CodeFuse"
title: "在VisualStudioCode中使用CodeFuse"
date: 2023-11-01
description: "VisualStudioCode作为一款广受程序员欢迎的代码编辑器，在前端开发和各类脚本语言开发中占据主流地位，CodeFuse智能研发助手就专门为VSCode研发了插件，只要安装插件就可以使用"
tags: ["前端"]
ShowReadingTime: "阅读9分钟"
weight: 851
---
![s x.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ced39b02d8c34a358959cff6033bbd49~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=900&h=383&s=86770&e=png&b=eeedfe) Visual Studio Code作为一款广受程序员欢迎的代码编辑器，在前端开发和各类脚本语言开发中占据主流地位，CodeFuse智能研发助手就专门为VS Code研发了插件，只要安装插件就可以使用CodeFuse提供的各种功能，下面我们看看如何在VS Code中使用CodeFuse插件呢？

CodeFuse官网：[codefuse.alipay.com/](https://link.juejin.cn?target=https%3A%2F%2Fcodefuse.alipay.com%2F "https://codefuse.alipay.com/")

CodeFuse 目前支持在 10 款 IDE 中安装，包括[支付宝小程序云云端研发](https://link.juejin.cn?target=https%3A%2F%2Fcodefuse.yuque.com%2Feoxx1u%2Fcodefuse%2Fide-extension "https://codefuse.yuque.com/eoxx1u/codefuse/ide-extension")、Visual Studio Code（下文简称为 VS Code），以及 [JetBrains 系列](https://link.juejin.cn?target=https%3A%2F%2Fcodefuse.yuque.com%2Feoxx1u%2Fcodefuse%2Fidea-plugin "https://codefuse.yuque.com/eoxx1u/codefuse/idea-plugin")的 8 款 IDE，分别是 IntelliJ IDEA、PyCharm、WebStorm、GoLand、CLion、DataGrip、PhpStorm 和 RubyMine。本文将介绍如何在本地 VS Code 中安装和使用 CodeFuse 插件。

**说明**：目前仅支持在 **VS Code 1.75.0** 以上的版本中安装 CodeFuse 插件。

前提条件
----

安装 CodeFuse 插件之前，您需要下载并安装 [Visual Studio Code](https://link.juejin.cn?target=https%3A%2F%2Fcode.visualstudio.com%2Fdownload "https://code.visualstudio.com/download")。

[](https://link.juejin.cn?target=https%3A%2F%2Fyuque.antfin.com%2Froi-doc%2Fcodefuse%2Fvscode-plugin%23%25E5%25AE%2589%25E8%25A3%2585%25E6%258F%2592%25E4%25BB%25B6 "https://yuque.antfin.com/roi-doc/codefuse/vscode-plugin#%E5%AE%89%E8%A3%85%E6%8F%92%E4%BB%B6")安装插件
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

目前 CodeFuse 插件在 VS Code 中仅支持下载插件安装包进行安装。完成安装后，您需要完成登录并通过申请才能使用插件。安装插件的步骤如下。

**说明**：目前官网提供下载的 CodeFuse 插件安装包为 Beta 版，正式版敬请期待。

1.  在 [CodeFuse 官网](https://link.juejin.cn?target=https%3A%2F%2Fcodefuse.alipay.com%2Fwelcome%2Fdownload "https://codefuse.alipay.com/welcome/download")，下载 Visual Studio Code 插件安装包。  
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8e8cd2a431f4521be6cd508801b5e8d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1252&h=429&s=71983&e=png&b=ffffff)
2.  打开 VS Code，在编辑器左侧导航栏，单击 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d20f94b3f81a4d6b9101e585eb622a9b~tplv-k3u1fbpfcp-image.image#?w=16&h=16&s=2179&e=svg&a=1&b=181818) 图标，再单击 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9f4d56c3a7946699ff39d10c2a7eaf6~tplv-k3u1fbpfcp-image.image#?w=16&h=16&s=654&e=svg&a=1&b=13111a) 图标，选择 **Install from VSIX…**。  
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf19ce5282194865a3cd3a921116ed03~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=860&h=445&s=40042&e=png&b=252526)
3.  选中下载的 **CodeFuse-x.x.x.vsix** 文件，单击 **Install**。  
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72d01bab48a84d06833c6f18fc4a1587~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1223&h=640&s=35691&e=png&b=fdfdfd)
4.  在 IDE 的左侧导航栏，单击 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c2353920cc9449db6d4ac1d76b4d4eb~tplv-k3u1fbpfcp-image.image#?w=24&h=24&s=6538&e=svg&a=1&b=919bf6) 图标进入插件面板。
5.  在插件面板，单击**登录**。  
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee869288ad7a4037a2f555a325a9df88~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=510&h=356&s=18330&e=png&b=252525)
6.  在弹窗中，单击 **Open**，然后使用支付宝登录 [CodeFuse 官网](https://link.juejin.cn?target=https%3A%2F%2Fcodefuse.alipay.com%2F "https://codefuse.alipay.com/")并申请试用。  
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cdf468ca7e0b458ca67490d66c56428e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=610&h=179&s=12546&e=png&b=f8f8f8)  
    您可以从以下的两个申请入口中选择一个进行申请。

*   *   申请入口一：在 CodeFuse 官网首页申请试用。  
        ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bbc1d1b6d1f14c7b9fd7a7226380f850~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=741&h=438&s=88105&e=png&b=fbfbff)
    *   申请入口二：在插件面板申请体验。  
        ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bbaa08150c054a53af073ba55478f829~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=362&h=245&s=24399&e=png&b=2d3134)

7.  在**申请试用**弹窗中，填写申请理由、阅读并勾选用户服务协议和隐私协议，单击**提交申请**。\*\*  
    \*\*![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8490699eddf346c3862dd4f1b35a3999~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=576&h=314&s=22818&e=png&b=f2f5ff)
8.  申请通过后，查看插件面板，如下图左侧所示即可开始使用。  
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e31f5d0a24a14ffa8d5573dce8e808bb~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2562&h=1387&s=161758&e=png&b=212121)

使用插件
----

CodeFuse 插件支持以下两种使用模式，对应模式支持的操作如下。

**使用模式**

**支持操作**

**IDE 代码编辑区**

\- 键入注释文本并回车补全代码

**鼠标右键**

\- 选中代码后，单击鼠标右键选择添加注释

*   选中代码后，单击鼠标右键选择解释代码
*   选中代码后，单击鼠标右键选择生成单测
*   选中代码后，单击鼠标右键选择代码优化 |

CodeFuse 插件可以为多种编程语言和各种框架提供代码建议，其在 Python 和 Java 中表现尤为突出。接下来，我们将以 Java 为例，在 VS Code 中演示如何使用该插件。

### [](https://link.juejin.cn?target=https%3A%2F%2Fyuque.antfin.com%2Froi-doc%2Fcodefuse%2Fvscode-plugin%23%25E4%25BB%25A3%25E7%25A0%2581%25E8%25A1%25A5%25E5%2585%25A8 "https://yuque.antfin.com/roi-doc/codefuse/vscode-plugin#%E4%BB%A3%E7%A0%81%E8%A1%A5%E5%85%A8")代码补全

代码补全功能基于海量数据提供实时地代码补全服务，包括行内补全（单行补全）和片段补全（多行补全）。目前该功能支持 Java、Python、TypeScript、JavaScript、Go 等 5 种主流编程语言的多行和单行代码补全，以及其他 40 种编程语言的单行代码补全。

目前 CodeFuse 支持自动代码补全和手动代码补全两种触发方式。关闭自动代码补全后，您仍然可以使用快捷键（Alt/Option + \\）手动触发代码补全。代码补全功能还支持切换多个补全结果，目前最多支持切换 2 个结果。您可以通过以下快捷键来切换补全结果。

**Windows 按键**

**Mac 按键**

**说明**

`Alt``]`

`Option``]`

显示**下一个**补全结果。

`Alt``[`

`Option``[`

显示**上一个**补全结果。

#### [](https://link.juejin.cn?target=https%3A%2F%2Fyuque.antfin.com%2Froi-doc%2Fcodefuse%2Fvscode-plugin%23%25E5%258D%2595%25E8%25A1%258C%25E4%25BB%25A3%25E7%25A0%2581%25E8%25A1%25A5%25E5%2585%25A8 "https://yuque.antfin.com/roi-doc/codefuse/vscode-plugin#%E5%8D%95%E8%A1%8C%E4%BB%A3%E7%A0%81%E8%A1%A5%E5%85%A8")单行代码补全

1.  在 IDE 编辑器中创建一个 Java 文件。
2.  在 Java 文件中，CodeFuse 将能够根据代码上下文，为您键入的内容给出补全提示。例如在以下示例代码的 `arr[i] = arr[j];` 后面按下回车键，插件将给出代码补全提示。

arduino

 代码解读

复制代码

`public class BubbleSort {     public static void bubbleSort(int[] arr) {         for (int i = 0; i < arr.length - 1; i++) {             for (int j = 0; j < arr.length - 1 - i; j++) {                 if (arr[j] > arr[j + 1]) {                     swap(arr, j, j + 1);                 }             }         }     }     private static void swap(int[] arr, int i, int j) {         int temp = arr[i];         arr[i] = arr[j];  ## 在此处按下回车触发补全，也可使用快捷键（Alt/Option + \）主动触发补全     } }`

3.  如需接受代码补全建议，请按 `Tab` 键。   
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc7f43c86a644a5eafab835b14dad39d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=722&h=567&s=40310&e=png&b=1e1e1e)

#### [](https://link.juejin.cn?target=https%3A%2F%2Fyuque.antfin.com%2Froi-doc%2Fcodefuse%2Fvscode-plugin%23%25E5%25A4%259A%25E8%25A1%258C%25E4%25BB%25A3%25E7%25A0%2581%25E8%25A1%25A5%25E5%2585%25A8 "https://yuque.antfin.com/roi-doc/codefuse/vscode-plugin#%E5%A4%9A%E8%A1%8C%E4%BB%A3%E7%A0%81%E8%A1%A5%E5%85%A8")多行代码补全

1.  插件还支持输入注释文本完成多行代码补全。例如键入以下注释内容并按下回车键。CodeFuse 会根据注释内容自动生成多行代码，生成的代码以灰色文本展示。

arduino

 代码解读

复制代码

`/*  * 判断字符串是否为英文 */`

2.  如需接受代码补全建议，请按 `Tab` 键。  
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55194fd8e0224872bb41d057b2bd9442~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1159&h=569&s=46637&e=png&b=1e1e1e)  
    键入内容并按下回车键后，您可以在编辑器右下角看到内容生成的状态。

*   *   内容正在生成中，将展示一个转圈的动效和 **running** 提示。
    *   内容成功生成后，系统将展示 CodeFuse 图标。  
        ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38fc19878d5142a58b02f6390a27b623~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1972&h=1336&s=65625&e=png&b=1e1e1e)

#### 关闭自动代码补全

自动代码补全功能默认开启，支持在插件面板的设置中关闭此功能，以禁止自动触发单行或多行代码补全。

*   单行代码补全：例如在编辑器中键入一个函数名称并按下回车键。
*   多行代码补全：例如在编辑器中键入一段注释文本并按下回车键。  
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5114c09a74124209b1e0d83d092dcacc~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=393&h=161&s=6394&e=png&b=252526)

**说明**：关闭自动触发代码补全后，您仍然可以使用 \*_Alt/Option + \*_ 快捷键手动触发代码补全。

### 解释代码

1.  在 IDE 编辑器中创建一个 Java 文件。
2.  在 Java 文件内选中需要解释的代码片段。
3.  单击鼠标右键，选择 **CodeFuse：解释代码**，插件将在左侧的对话窗口中生成代码解释。  
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af01e6387bd94ddf8f146df1166dcee6~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1426&h=1362&s=238951&e=png&b=242424)

### 添加注释

**说明**：目前模型的生成注释功能对整个函数级别的支持较为完善，因此推荐您优先针对函数级别生成注释。

1.  在 IDE 编辑器中创建一个 Java 文件。
2.  在 Java 文件内选中需要添加注释的代码片段。
3.  单击鼠标右键，选择 **CodeFuse：添加注释**，将在所选代码上自动生成注释。  
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d6ca14feddc499298d5d4e0f93a3178~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=781&h=313&s=31814&e=png&b=1f1f1f)  
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e062aea2af84452a13469e93ae020e2~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=773&h=337&s=37693&e=png&b=1e1e1e)

### [](https://link.juejin.cn?target=https%3A%2F%2Fyuque.antfin.com%2Froi-doc%2Fcodefuse_bak%2Fvscode-plugin%23%25E7%2594%259F%25E6%2588%2590%25E5%258D%2595%25E6%25B5%258B "https://yuque.antfin.com/roi-doc/codefuse_bak/vscode-plugin#%E7%94%9F%E6%88%90%E5%8D%95%E6%B5%8B")生成单测

1.  在 IDE 编辑器中创建一个 Java 文件。
2.  在 Java 文件内选中需要生成单测的代码片段。例如为以下代码片段生成单测：

arduino

 代码解读

复制代码

`public class Conversion {        public static byte binaryToByte(final boolean[] src, final int srcPos, final byte dstInit, final int dstPos,             final int nBools) {         if (src.length == 0 && srcPos == 0 || 0 == nBools) {             return dstInit;         }         if (nBools - 1 + dstPos >= 8) {             throw new IllegalArgumentException("nBools-1+dstPos is greater or equal to than 8");         }         byte out = dstInit;         for (int i = 0; i < nBools; i++) {             final int shift = i + dstPos;             final int bits = (src[i + srcPos] ? 1 : 0) << shift;             final int mask = 0x1 << shift;             out = (byte) ((out & ~mask) | bits);         }         return out;     } }`

3.  单击鼠标右键，选择 **CodeFuse：生成单测**，插件将在左侧的对话窗口中为选中的代码生成测试用例。  
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7bef4ad10e5443cbbe06cb3af2f7eb4~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1723&h=1298&s=205949&e=png&b=242424)

### 代码优化

基于大模型的代码理解能力和静态源码分析能力，CodeFuse 支持对选定的代码片段进行分析理解，提出优化和改进建议，还能直接基于改进建议形成代码补丁，以帮助您写出更好的代码。使用代码优化的步骤如下。

1.  在 IDE 编辑器中创建一个 Java 文件，编写并选中一段需要优化的代码。
2.  单击鼠标右键，选择 **CodeFuse：代码优化**，将在插件面板提供多个代码优化建议。  
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e273512168ec455699ff734a7d0178af~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1198&h=1029&s=103569&e=png&b=1f1f1f)
3.  单击**按照以上建议优化选中的代码**，生成优化后的代码。  
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01bc82b4c6644757a369f737da4b08ed~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=437&h=453&s=37850&e=png&b=252526)
4.  鼠标放置在生成的代码上，单击 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc2aad9b7eec46e6abdff8d340514afd~tplv-k3u1fbpfcp-image.image#?w=16&h=16&s=5296&e=svg&a=1&b=bcc0c4) 查看代码变更 Diff。  
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da928c1c4a3446dab0d04a5cccb00076~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=439&h=712&s=41986&e=png&b=2a2a2a)
5.  在重构预览界面，**勾选并单击**变更内容（图示 ①），然后单击 **Apply**（图示 ②）即可替换代码。若单击 **Discard**，将退出代码 Diff 界面并放弃本次变更。  
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2469b16727224dbb9e1808dc82e16a5f~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2060&h=1313&s=164486&e=png&b=202020)

[](https://link.juejin.cn?target=https%3A%2F%2Fyuque.antfin.com%2Froi-doc%2Fcodefuse%2Fvscode-plugin%23%25E5%25BF%25AB%25E6%258D%25B7%25E6%2596%25B9%25E5%25BC%258F "https://yuque.antfin.com/roi-doc/codefuse/vscode-plugin#%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F")快捷方式
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### [](https://link.juejin.cn?target=https%3A%2F%2Fyuque.antfin.com%2Froi-doc%2Fcodefuse%2Fvscode-plugin%23%25E5%25BF%25AB%25E6%258D%25B7%25E9%2594%25AE "https://yuque.antfin.com/roi-doc/codefuse/vscode-plugin#%E5%BF%AB%E6%8D%B7%E9%94%AE")快捷键

**Windows 按键**

**Mac 按键**

**说明**

`Tab`

`Tab`

**采纳代码建议**。在编辑器中按下 Tab 键，即可使用插件生成的代码；按下左上角的 Esc 键则不接受代码建议。

\`Alt\`\`\`

\`Option\`\`\`

**主动触发代码补全**。在编辑器中按下此快捷键，可在光标处手动触发代码补全。**说明**：关闭自动触发代码补全后，仍然可以使用此快捷键触发补全。

`Alt``]`

`Option``]`

显示**下一个**补全结果。

`Alt``[`

`Option``[`

显示**上一个**补全结果。

**说明**：CodeFuse 支持自定义快捷键。若遇到快捷键冲突，可按以下步骤修改快捷键。

1.  在 CodeFuse 面板的快捷键区域，单击**去设置**。  
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cba2459dbf644bf68b8473c18a55d093~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=438&h=270&s=18824&e=png&b=3c3c3c)
2.  在快捷键页面的搜索框，输入 **CodeFuse** 搜索快捷键，然后选中快捷键，单击![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eaf66eb5cf854c1580d48870a28153c2~tplv-k3u1fbpfcp-image.image#?w=16&h=16&s=757&e=svg&a=1&b=000000)进行编辑。  
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f8383ef54a94b8cb91c2ea2697faac7~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1112&h=532&s=41274&e=png&b=232323)

### 快捷操作

**快捷方式**

**说明**

**清空会话****帮助文档****跳转网页**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf211d488880426eb2c09ad467cf0a14~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=451&h=174&s=12340&e=png&b=252526)在插件面板右上角，您可以有以下操作：- 单击 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0a2460e27854d59b3560dfa93b0d33b~tplv-k3u1fbpfcp-image.image#?w=16&h=16&s=1112&e=svg&a=1&b=000000) 将一键清空当前会话下的所有内容。

*   单击 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab12fddc364848f09a9bb9987b8c8991~tplv-k3u1fbpfcp-image.image#?w=16&h=16&s=1675&e=svg&a=1&b=595b66) 可查看帮助文档。
*   单击 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e6c30769aea4c0e875589cdab46eceb~tplv-k3u1fbpfcp-image.image#?w=16&h=16&s=1271&e=svg&a=1&b=2b2b2b) 将前往 CodeFuse 官网。 | | **鼠标右键** | 选中代码片段，单击鼠标右键，可选择添加注释、解释代码、生成单测，以及代码优化。 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4af2e556cfe4d018bf07a665688cc6e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=666&h=466&s=38704&e=png&b=1f1f1f) | | **快速复制、粘贴和展开代码** | ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1afe2a68b41b4f29b926ca82a8e7e7b8~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=438&h=447&s=27812&e=png&b=252526) 在插件面板，将鼠标放置在生成的内容右下角，您可以执行以下操作：- 单击 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1066033442d45f7af5bd335d911a9e9~tplv-k3u1fbpfcp-image.image#?w=16&h=16&s=5296&e=svg&a=1&b=bcc0c4)，将选中的代码替换为生成的代码。具体操作步骤请参见[优化代码](https://link.juejin.cn?target=https%3A%2F%2Fcodefuse.yuque.com%2Feoxx1u%2Fcodefuse%2Fvscode-extension%23Wjy5T "https://codefuse.yuque.com/eoxx1u/codefuse/vscode-extension#Wjy5T")。
*   单击 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3e85404bf0b4f11b5c3645901f3b771~tplv-k3u1fbpfcp-image.image#?w=29&h=28&s=2330&e=svg&a=1&b=d6dbdf)，一键将代码粘贴到编辑器中的光标处。
*   单击 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d99e6f19721343da90827f8b2cc01c04~tplv-k3u1fbpfcp-image.image#?w=16&h=16&s=1405&e=svg&a=1&b=393939)，一键复制代码。
*   单击 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38c1b583da654fb0924aea2195bba71e~tplv-k3u1fbpfcp-image.image#?w=16&h=16&s=816&e=svg&a=1&b=2b2b2b)，一键展开代码，便于您阅读完整的代码。 | | **快捷指令** | 插件面板底部支持使用以下两个快捷指令。- `/Explain`：解释选中的代码。
*   `/Test`：为选中的代码生成测试用例。快捷指令的使用步骤如下：在编辑器内，选中一段代码，单击 `/Explain` 或 `/Test` 发送内容。 |

[](https://link.juejin.cn?target=https%3A%2F%2Fyuque.antfin.com%2Froi-doc%2Fcodefuse%2Fvscode-plugin%23%25E5%258F%258D%25E9%25A6%2588%25E4%25BB%25A3%25E7%25A0%2581%25E8%25B4%25A8%25E9%2587%258F "https://yuque.antfin.com/roi-doc/codefuse/vscode-plugin#%E5%8F%8D%E9%A6%88%E4%BB%A3%E7%A0%81%E8%B4%A8%E9%87%8F")反馈代码质量
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

您可以对 CodeFuse 所生成的内容进行评价，支持点赞和点踩操作。  
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/836b2eca561d429cb35edb9afe26534e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=436&h=446&s=26401&e=png&b=262627)

*   **赞**：CodeFuse 生成的代码符合期望、生成的代码可直接使用等情况，您可以点赞评价。
*   **踩**：CodeFuse 生成的代码有明显漏洞或给出错误的回复等情况、您可以点踩反馈，以帮助我们持续优化模型的回复质量。