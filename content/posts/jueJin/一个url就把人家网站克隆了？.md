---
author: "brzhang"
title: "一个url就把人家网站克隆了？"
date: 2024-03-03
description: "今天瞧见了一个开源库，https://github.com/abi/screenshot-to-code，根据它的描述，这个简单的应用程序可以将屏幕截图转换为代码（HTML/TailwindCSS"
tags: ["前端","DALL-E3","GPT"]
ShowReadingTime: "阅读4分钟"
weight: 752
---
今天瞧见了一个开源库，[**https://github.com/abi/screenshot-to-code**](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fabi%2Fscreenshot-to-code "https://github.com/abi/screenshot-to-code") ，根据它的描述，这个简单的应用程序可以将屏幕截图转换为代码（HTML/Tailwind CSS、React、Bootstrap 或 Vue）。 它使用 GPT-4 Vision 生成代码，并使用 DALL-E 3 生成外观相似的图像。 更加逆天的是，现在是你只要输入一个 URL，他就给你把人家网站克隆了。

### 这技术背后的实现原理是什么

screenshot-to-code这个工具，其核心功能是将图像转化为代码。它基于开放人工智能库GPT-4 Vision和DALL-E 3的技术，这两种AI模型都是OpenAI的产品且在视觉理解方面表现出色。

当用户上传截图，GPT-4 Vision会读取并理解截图中的内容，然后基于这些理解生成对应的HTML，Tailwind，React，Vue等代码。这部分对应的源码可以在这里查看 [**https://github.com/abi/screenshot-to-code/blob/072b286b6dfa65eaa646f68def8a0b0f6d157217/backend/routes/generate\_code.py#L43**](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fabi%2Fscreenshot-to-code%2Fblob%2F072b286b6dfa65eaa646f68def8a0b0f6d157217%2Fbackend%2Froutes%2Fgenerate_code.py%23L43 "https://github.com/abi/screenshot-to-code/blob/072b286b6dfa65eaa646f68def8a0b0f6d157217/backend/routes/generate_code.py#L43") ，背后推动的 prompt 可以简单了解下

xml

 代码解读

复制代码

`HTML_TAILWIND_SYSTEM_PROMPT = """ You are an expert Tailwind developer You take screenshots of a reference web page from the user, and then build single page apps  using Tailwind, HTML and JS. You might also be given a screenshot(The second image) of a web page that you have already built, and asked to update it to look more like the reference image(The first image). - Make sure the app looks exactly like the screenshot. - Pay close attention to background color, text color, font size, font family,  padding, margin, border, etc. Match the colors and sizes exactly. - Use the exact text from the screenshot. - Do not add comments in the code such as "<!-- Add other navigation links as needed -->" and "<!-- ... other news items ... -->" in place of writing the full code. WRITE THE FULL CODE. - Repeat elements as needed to match the screenshot. For example, if there are 15 items, the code should have 15 items. DO NOT LEAVE comments like "<!-- Repeat for each news item -->" or bad things will happen. - For images, use placeholder images from https://placehold.co and include a detailed description of the image in the alt text so that an image generation AI can generate the image later. In terms of libraries, - Use this script to include Tailwind: <script src="https://cdn.tailwindcss.com"></script> - You can use Google Fonts - Font Awesome for icons: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link> Return only the full code in <html></html> tags. Do not include markdown "```" or "```html" at the start or end. """`

前面介绍过，他不只是可以生成 HTML 的代码，还可以囊括其他语言，包括 react 和 Vue。其中有一个我不太理解的地方，if there are 15 items, the code should have 15 items 那如果这里有 100 个 list 的 item，他是否生成 100 个呢，为什么不告诉模型，使用 list.map(e⇒componet)的方式呢？将统一的模式封装成一个独立的组件，代码的维护性不是大大的加强吗？

### 生成代码的维护性如何？

带着疑问，跑了一下demo，果不其然，生成的代码确实是比较机械化的方式，还是缺乏维护性的。

![loading](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4513e98ea96148a680bec06e88efde0a~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2000&h=1109&s=126580&e=webp&b=042347)

### 为何需要 DALLE3

而DALL-E 3则负责生成与原图相似的图像，这能帮助用户更直观地预览和了解生成的代码对应的页面效果。

screenshot-to-code的优势在于，它不仅可以从图片生成代码，还可以根据代码进一步优化图片，这种“图片至代码，代码至图片”的双向优化，使结果更精细，更贴近用户需求。

然而给我的感觉是，这种生成的代码更像是一种一锤子买卖的外包工程，基本不具备维护性的。

### 其他生成代码的工具

据我了解，vercel 很早就在做代码自动生成，而且很早就推出了其服务，服务在此：[**https://v0.dev/**](https://link.juejin.cn?target=https%3A%2F%2Fv0.dev%2F "https://v0.dev/")

![loading](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0dd94043798144e0aafb385a8cf11bc7~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2000&h=621&s=15212&e=webp&b=fdfdfd)

使用的方式就是和模型对话来生成代码，代码是 vercel 提供的服务，实时渲染给你看效果，而且，还可以基于效果继续进行对话，目前我没有触发到最大的对话条数，理论上可以一直对话。如下就是我生成的效果。从美观度上来看，还是挺不错的。

![loading](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01359dd8fb7147acb6b1f69cc6f9f086~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2000&h=1370&s=33324&e=webp&b=ffffff)

其自动生成的代码如下：

![loading](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62d59b31e2c04ef7ad743d66a9df9121~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2000&h=1282&s=87356&e=webp&b=00060b)

同样的弊端，也在 vercel 这套自动生成代码上有所体现：

![loading](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fdd1a2b2be584a04a28742e0a36d53fc~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2000&h=824&s=73664&e=webp&b=fdfdfd)

我看了一个生成有列表相关的例子，这里通过浏览代码发现，他这里依旧是机械化的翻译了 dom 结构，而不是使用可维护性较高的方式来输出。

总结：个人感觉，这块目前用来做一些demo，或者做一些打一些底稿，还是很有助于效率提高的。对于screenshot-to-code不要认为他能够直接可以将别人web 给直接复刻了，然后就轻松拿来运营，至少离这里还差太远太远的距离了，如后端逻辑呢？网站的性能呢？目前基本上等同于对于 HTML 点击右键，保存网页。对于 vercel 的服务，可以用来做开发提效，让它生成一些代码，然后从中获取一些灵感或者手动提取可复用组件。

**探索代码的无限可能，与老码小张一起开启技术之旅。点关注，未来已来，每一步深入都不孤单。**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d0c4aaad0ab34f1c99b63351847008ac~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1710&h=624&s=139152&e=png&b=07c15e)