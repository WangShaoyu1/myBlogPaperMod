---
author: "嚣张农民"
title: "VisualStudioCode1.91发布"
date: 2024-07-04
description: "VisualStudioCode1.91已发布，具体更新内容如下：预览：Incoming/Outgoingchangesgraph-在SourceControl视图中可视化i"
tags: ["前端"]
ShowReadingTime: "阅读2分钟"
weight: 882
---
Visual Studio Code 1.91 已[发布](https://link.juejin.cn?target=https%3A%2F%2Fwww.oschina.net%2Faction%2FGoToLink%3Furl%3Dhttps%253A%252F%252Fcode.visualstudio.com%252Fupdates%252Fv1_91 "https://www.oschina.net/action/GoToLink?url=https%3A%2F%2Fcode.visualstudio.com%2Fupdates%2Fv1_91")，具体更新内容如下：

*   **[预览：Incoming/Outgoing changes graph](https://link.juejin.cn?target=https%3A%2F%2Fwww.oschina.net%2Faction%2FGoToLink%3Furl%3Dhttps%253A%252F%252Fcode.visualstudio.com%252Fupdates%252Fv1_91%2523_source-control "https://www.oschina.net/action/GoToLink?url=https%3A%2F%2Fcode.visualstudio.com%2Fupdates%2Fv1_91%23_source-control") - 在 Source Control 视图中可视化 incoming 和 outgoing changes。**

可以通过 `scm.experimental.showHistoryGraph` 设置新的可视化功能。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0720c73895e3495d8e10346a7b028994~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1021&h=657&s=139307&e=png&b=232323)

*   **[Python 环境](https://link.juejin.cn?target=https%3A%2F%2Fwww.oschina.net%2Faction%2FGoToLink%3Furl%3Dhttps%253A%252F%252Fcode.visualstudio.com%252Fupdates%252Fv1_91%2523_python "https://www.oschina.net/action/GoToLink?url=https%3A%2F%2Fcode.visualstudio.com%2Fupdates%2Fv1_91%23_python")**

推出一款新工具 python-environment-tools ，旨在显著提高检测全局 Python 安装和 Python 虚拟环境的速度。该工具使用 Rust 来确保快速、准确的发现过程。

项目团队正在测试这项新功能，并将其与现有支持并行运行，以评估 Python 扩展中的新发现性能。用户将可以看到一个名为`Python Locator`的新日志通道，以显示使用这一新工具的发现时间。

可访问 [python-environment-tools repo](https://link.juejin.cn?target=https%3A%2F%2Fwww.oschina.net%2Faction%2FGoToLink%3Furl%3Dhttps%253A%252F%252Fgithub.com%252Fmicrosoft%252Fpython-environment-tools "https://www.oschina.net/action/GoToLink?url=https%3A%2F%2Fgithub.com%2Fmicrosoft%2Fpython-environment-tools") 了解有关此功能和正在进行的工作的更多信息。

*   **[Smart Send in native REPL](https://link.juejin.cn?target=https%3A%2F%2Fwww.oschina.net%2Faction%2FGoToLink%3Furl%3Dhttps%253A%252F%252Fcode.visualstudio.com%252Fupdates%252Fv1_91%2523_smart-send-in-native-repl "https://www.oschina.net/action/GoToLink?url=https%3A%2F%2Fcode.visualstudio.com%2Fupdates%2Fv1_91%23_smart-send-in-native-repl") - 在 native REPL 中流畅运行代码块。**

现在，Shift+Enter 可在非嵌套场景中发送最少的可执行代码，或在嵌套场景中发送 highest top-level 代码块。这使用户能够在整个文件中快速按住  Shift+Enter，以最少的努力运行最大数量的可执行代码。

*   **[GitHub Copilot 可扩展性](https://link.juejin.cn?target=https%3A%2F%2Fwww.oschina.net%2Faction%2FGoToLink%3Furl%3Dhttps%253A%252F%252Fcode.visualstudio.com%252Fupdates%252Fv1_91%2523_chat-and-language-model-api "https://www.oschina.net/action/GoToLink?url=https%3A%2F%2Fcode.visualstudio.com%2Fupdates%2Fv1_91%23_chat-and-language-model-api") - VS Code Stable 中可用的聊天和语言模型 API。**

聊天和语言模型 API 现已在 VS Code 稳定版中完全可用。

*   [预览：Profiles Editor](https://link.juejin.cn?target=https%3A%2F%2Fwww.oschina.net%2Faction%2FGoToLink%3Furl%3Dhttps%253A%252F%252Fcode.visualstudio.com%252Fupdates%252Fv1_91%2523_profiles-editor-preview "https://www.oschina.net/action/GoToLink?url=https%3A%2F%2Fcode.visualstudio.com%2Fupdates%2Fv1_91%23_profiles-editor-preview") - 在一个地方管理你的个人资料。

推出了新的 "Profiles Editor"，使用户能够从一个地方管理配置文件。这种体验包括创建新的配置文件、编辑和删除现有配置文件，以及导入和导出配置文件与他人共享。创建新的配置文件时，你可以预览配置文件，并在保存前根据需要进行自定义。通过预案编辑器，还可以使用特定预案打开新窗口，或将预案设置为新窗口的默认预案。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1779b10cd2de4ef2abcce87c307450f6~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1026&h=588&s=93700&e=png&b=fefefe)

*   [自定义选项卡标签](https://link.juejin.cn?target=https%3A%2F%2Fwww.oschina.net%2Faction%2FGoToLink%3Furl%3Dhttps%253A%252F%252Fcode.visualstudio.com%252Fupdates%252Fv1_91%2523_access-file-extensions-in-custom-labels "https://www.oschina.net/action/GoToLink?url=https%3A%2F%2Fcode.visualstudio.com%2Fupdates%2Fv1_91%23_access-file-extensions-in-custom-labels") - 更多变量选项并支持多种扩展。
    
    *   `${filename}` => `editor`
    *   `${extname}` => `test.ts`
    *   `${extname(0)}` => `ts`
    *   `${extname(1)}` => `test`
    *   `${extname(-1)}` => `test`
    *   `${extname(-2)}` => `ts`
*   [TypeScript 5.5](https://link.juejin.cn?target=https%3A%2F%2Fwww.oschina.net%2Faction%2FGoToLink%3Furl%3Dhttps%253A%252F%252Fcode.visualstudio.com%252Fupdates%252Fv1_91%2523_syntax-checking-for-regular-expressions "https://www.oschina.net/action/GoToLink?url=https%3A%2F%2Fcode.visualstudio.com%2Fupdates%2Fv1_91%23_syntax-checking-for-regular-expressions") - 正则表达式语法检查及其他语言功能。
    

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/833e9166a9f3482e8214b83857316cac~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1024&h=421&s=48802&e=png&b=212020)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53ae654f3dba49669701fcb6a42ad3a8~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1021&h=387&s=58747&e=png&b=212020)

*   [JavaScript Debugger](https://link.juejin.cn?target=https%3A%2F%2Fwww.oschina.net%2Faction%2FGoToLink%3Furl%3Dhttps%253A%252F%252Fcode.visualstudio.com%252Fupdates%252Fv1_91%2523_javascript-debugger "https://www.oschina.net/action/GoToLink?url=https%3A%2F%2Fcode.visualstudio.com%2Fupdates%2Fv1_91%23_javascript-debugger") - 在调试 JavaScript 时检查隐藏变量。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6778466072ae475785c93e07c61f0c0f~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=615&h=297&s=57233&e=png&b=38332e)

更多详情可[查看官方公告](https://link.juejin.cn?target=https%3A%2F%2Fwww.oschina.net%2Faction%2FGoToLink%3Furl%3Dhttps%253A%252F%252Fcode.visualstudio.com%252Fupdates%252Fv1_91 "https://www.oschina.net/action/GoToLink?url=https%3A%2F%2Fcode.visualstudio.com%2Fupdates%2Fv1_91")。