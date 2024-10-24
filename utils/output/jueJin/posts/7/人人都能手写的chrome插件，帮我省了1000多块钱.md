---
author: "京东云开发者"
title: "人人都能手写的chrome插件，帮我省了1000多块钱"
date: 2024-09-27
description: "在网购的世界里，价格波动常常让人感到无奈。《京东价保》插件通过定时监控已购商品价格变化，降价自动申请京东价格保护，帮我省下了不少钱。 作为一个前端开发工程师，这让我意识到，手写一个浏览器插件是一件很有"
tags: ["程序员中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:14,comments:0,collects:30,views:1244,"
---
在网购的世界里，价格波动常常让人感到无奈。《京东价保》插件通过定时监控已购商品价格变化，降价自动申请京东价格保护，帮我省下了不少钱。

作为一个前端开发工程师，这让我意识到，手写一个浏览器插件是一件很有趣且有意义的事。

于是，我决定尝试自己动手，开发一个简单的二维码生成器插件，各位小伙伴也可参考以下步骤实现自己想要的插件。

一、 为什么要手写浏览器插件
--------------

手写插件有许多好处，以下是一些详细的原因：

### 1.1 个性化定制

手写插件可以根据个人需求进行定制。市面上的插件功能可能不完全符合你的需求，而自己动手开发插件，可以精确地实现你想要的功能。

### 1.2. 解决特定问题

有时，你可能需要一个非常特定的功能，而现有的插件无法提供。手写插件可以帮助你快速解决这些特定问题，提高工作效率。

### 1.3 增强安全性

使用第三方插件时，安全性是一个重要的考虑因素。自己开发插件，可以确保代码的安全性，避免潜在的隐私泄露或恶意行为。

### 1.4 节省成本

虽然许多插件是免费的，但一些高级功能需要付费。通过手写插件，你可以免费获得这些功能，同时避免不必要的开支。

总之，手写插件不仅能带来技术上的成长，还能在日常生活中提供实际的便利和解决方案。

二、 如何手写浏览器插件
------------

### 2.1 认识插件目录结构

一个 Chrome 插件通常包含以下文件和目录：

```arduino
my-qrcode-plugin/
│
├── manifest.json  // 插件的配置文件，定义插件的基本信息、权限和功能。
├── background.js  // 后台脚本，负责处理插件的逻辑，例如创建右键菜单。
├── popup.html     // 插件的弹出页面，用户点击插件图标时显示。
├── popup.js       // 插件的弹出页面，执行的脚本。
└── icons/         // 存放插件的图标，建议提供 16x16、48x48 和 128x128 像素的图标，不同大小的图标有不同的作用。
├── icon16.png
├── icon48.png
└── icon128.png

```

### 2.2 编写 manifest.json

manifest.json 是插件的核心配置文件：

```css
    {
    "manifest_version": 3,
    "name": "QR Code Generator",
    "version": "1.0",
    "permissions": ["contextMenus", "activeTab", "scripting"],
        "icons": {
        "16": "icons/icon16.png",
        "48": "icons/icon48.png",
        "128": "icons/icon128.png"
        },
            "background": {
            "service_worker": "background.js"
            },
                "action": {
                "default_popup": "popup.html"
            }
        }
```

### 2.3 编写 background.js

background.js 负责插件后台的逻辑实现：

```ini
    chrome.runtime.onInstalled.addListener(() => {
        chrome.contextMenus.create({
        id: "generateQRCode",
        title: "Generate QR Code",
    contexts: ["page"]
    });
    });
    
        chrome.contextMenus.onClicked.addListener((info, tab) => {
            if (info.menuItemId === "generateQRCode") {
            const url = tab.url;
            const apiUrl = `https://api.cl2wm.cn/api/qrcode/code?text=${url}&mhid=sELPDFnok80gPHovKdI`;
            
                chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: showQRCode,
            args: [apiUrl]
            });
        }
        });
        
            function showQRCode(apiUrl) {
            const iframe = document.createElement('iframe');
            iframe.style.position = 'fixed';
            iframe.style.top = '50%';
            iframe.style.left = '50%';
            iframe.style.transform = 'translate(-50%, -50%)';
            iframe.style.width = '500px';
            iframe.style.height = '500px';
            iframe.style.border = 'none';
            iframe.style.zIndex = '1000'; // 确保在最上层
            iframe.src = apiUrl;
            
            document.body.appendChild(iframe);
            
                setTimeout(() => {
                iframe.remove();
                }, 5000);
            }
```

### 2.4 编写 popup.html

popup.html 是插件的用户界面：

```xml
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>QR Code Generator</title>
<style>
    body {
    width: 500px;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Arial, sans-serif;
}

    #qrcode iframe {
    width: 500px;
    height: 500px;
    border: none;
}
</style>
</head>

<body>
<div id="qrcode">
<iframe id="qrFrame" src=""></iframe>
</div>
<script src="popup.js"></script>
</body>

</html>
```

### 2.5 编写 popup.js

popup.js 是插件的用户界面的执行脚本：

```ini
    document.addEventListener('DOMContentLoaded', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs.length === 0) {
            console.error('No active tab found');
            return;
        }
        
        const url = tabs[0].url;
        const apiUrl = `https://api.cl2wm.cn/api/qrcode/code?text=${url}&mhid=sELPDFnok80gPHovKdI`;
        
        const iframe = document.getElementById('qrFrame');
        iframe.src = apiUrl;
        });
        });
```

### 2.6 验证插件功能

在浏览器上测试 Chrome 插件功能，可以通过以下步骤进行：

#### 2.6.1. 加载未打包的扩展

1.打开 Chrome 浏览器。

2.输入 `chrome://extensions/` 进入扩展管理页面。

3.打开右上角的“开发者模式”。

4.点击“加载已解压的扩展程序”按钮。

5.选择你的插件目录（my-qrcode-plugin）。

#### 2.6.2. 验证功能

1.  在任意一个网页中， 通过鼠标右键找到菜单 Generate QR Code, 点击该菜单，页面生成一个二维码，手机扫描二维码即是该网页，5S后二维码消失视为验证通过。

**右键菜单截图：**

![](/images/jueJin/1c2ed58a7fdd495.png)

**二维码生成效果图：**

![](/images/jueJin/57ac82d0cf064cb.png)

2.  在浏览器右上角选择该插件《Generate QR Code》，在网页右上角生成对应的二维码，二维码不消失，视为验证通过。

**右上角插件入口截图：**

![](/images/jueJin/66b93d2324c047f.png)

**二维码效果图：**

![](/images/jueJin/bc384b038ed24e1.png)

#### 2.6.3. 实时修改和刷新

1.在开发者工具中修改代码后，可以直接保存并刷新插件或页面以查看更改效果。

2.通过“重新加载”按钮在扩展管理页面中更新插件。

**通过这些步骤，你可以在浏览器中高效地测试和调试 Chrome 插件的功能。**

三、 插件发布到 Chrome Web Store
-------------------------

以下的发布谷歌插件的步骤

1.  创建开发者账号: 前往 [Chrome Web Store Developer Dashboard](https://link.juejin.cn?target=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdeveloper%2Fdashboard "https://chrome.google.com/webstore/developer/dashboard") 创建开发者账号。
    
2.  打包插件: 在 Chrome 浏览器中，进入扩展程序页面，点击“打包扩展程序”，选择插件的根目录进行打包。
    
3.  上传插件: 登录开发者账号，上传打包后的 `.zip` 文件。
    
4.  填写信息: 填写插件的详细信息，包括名称、描述、截图等。
    
5.  支付费用: 支付一次性注册费用：5美元。
    
6.  提交审核: 提交插件进行审核，审核通过后即可发布。
    

由于博主囊中羞涩， 就没有支付费用， 各位感兴趣的小伙伴可以通过以上步骤尝试去发布自己的插件，让更多的人看到。

四、 总结
-----

本文通过《京东价保》插件给我带来的便利，引发了个人探索浏览器插件的思考。 通过实现一个简单的浏览器插件，帮助我们认识、掌握、应用浏览器插件的基本原理。更深入的知识咱们可以通过官网去学习。

* * *

**最后，最重要的一点：**

**欢迎评论区互动， 大家一起来找bug。**

**欢迎大家交流学习，共同成长。**