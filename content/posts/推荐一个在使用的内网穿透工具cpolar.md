---
title: 推荐一个在使用的内网穿透工具cpolar
summary: cpolar是一种安全的内网穿透云服务，它将内网下的本地服务器通过安全隧道暴露至公网。使得公网用户可以正常访问内网服务。也就是说你在本地的localhost:<port>，通过该服务，实现某个域名进行访问，详情见下文
description: Contains posts related to PaperMod
date: 2024-09-15
weight: 1
aliases: ["/cpolar"]
slug: "/cpolar"
tags: ["前端", "人工智能"]
author: ["Hisoso"]
draft: true
---
>**cpolar**：cpolar是一种安全的内网穿透云服务，它将内网下的本地服务器通过安全隧道暴露至公网。使得公网用户可以正常访问内网服务。也就是说你在本地的localhost:<port\>，通过该服务，实现某个域名进行访问，详情见下文

# 1、步骤
如下操作是在windows系统下，其他系统如Linux系统或者MocOS系统参考官网使用文档  
访问进入[cpolar官网](https://www.cpolar.com/)，注册一个账号，然后下载最新版本。

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/1a4be29935364c579106cfdfad3ed434~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgZnVubnlfZnJvbnRlZHRlYW0=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzQ1NjUyMDI5MDMwNzU4MSJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1726977612&x-orig-sign=AbOM2Eq0QsdigxqRRzsopoKr0VM%3D)

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/a409997b69e04a55bc86e8444e41e5fd~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgZnVubnlfZnJvbnRlZHRlYW0=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzQ1NjUyMDI5MDMwNzU4MSJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1726977612&x-orig-sign=AXMGA%2Fyt5JO2X32F5q3vLCxSphg%3D)

安装后，点击图标进入操作面板

**创建隧道页面**：如上的本地端口按照本地服务地址填写，域名类型可以任意选一个，推荐用随机域名，其他的自定义域名、二级子域名,需要付费或者上传站点文件等等，复杂度高一些
![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/46ef2d78a5bb462687c94ee5e989570c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgZnVubnlfZnJvbnRlZHRlYW0=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzQ1NjUyMDI5MDMwNzU4MSJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1726977612&x-orig-sign=3vWdodN1Npoef2pG5yfX9PtGyQQ%3D)

**隧道列表页面**：按隧道名称，启动某个/某些隧道
![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/1c2df3a2a626473dbe3f9e7ded775c09~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgZnVubnlfZnJvbnRlZHRlYW0=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzQ1NjUyMDI5MDMwNzU4MSJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1726977612&x-orig-sign=dZdiYkHkE3m720BlMI5GTzlra48%3D)

**在线隧道列表页面**：可查看本地地址与公网地址的对应表，通过公网地址就可以实现本地地址内容的在线访问
![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/a9ad6bca00b844e08636f165bf8ce1fb~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgZnVubnlfZnJvbnRlZHRlYW0=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzQ1NjUyMDI5MDMwNzU4MSJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1726977612&x-orig-sign=6ep66tQ%2F1gkSYIWizNZGPnTjYME%3D)


# 2、适用场景
## 2.1、公开一个本地Web网站
**场景一**：  
当你本地部署开发了一个web网站效果或者接口，但也没有完全开发完，产品经理希望在线看一下效果。用内网穿透，就可以将如上的公网地址发给他/她，而不用配置内部局域网，万一产品经理在外地出差或者不方便连进公司内部局域网呢。  
**场景二**：发布一个本地博客网站，并发布到公网远程访问
按照如上操作，所有文件都在本地电脑，只要我们接下来为其配置固定的HTTP端口地址，该地址不会变化，方便分享给别人长期查看你的本地服务，而无需每天重复修改服务器地址。更重要是的是无需购买云服务器和域名。有条件也可以购买增值服务，自定义二级域名，能实现类似，xxx.vip.cpolar.cn 这种看起来正式一点的域名（相对于随机域名）
**场景三**：在没有上线部署的情况下，在发布会上演示新网站
## 2.2、微信公众号调试、移动设备上测试
类似的，如果在设备上调试本地服务，一般需要调试设备和开发电脑是同一个局域网，或者部署到开发/测试服务器，耗时一点，cpolar内网穿透服务能提高这块的调试效率。  
当然，有的场景下，前端同学可能会遇到跨域问题，接口设置：**Access-Control-Allow-Origin** ：\*，应该能解决问题，不能的话，前端同学问一下后端开发同学解决


# 3、参考案例
[Linux系统搭建轻量级个人博客VanBlog并一键发布公网远程访问](https://www.cpolar.com/blog/the-linux-system-builds-a-lightweight-personal-blog-vanblog-and-publishes-it-for-public-network-remote-access-with-one-click)  
[Linux部署Nacos注册中心实现远程访问UI管理界面](https://www.cpolar.com/blog/implementing-remote-access-to-ui-management-interface-through-linux-deploying-nacos-registration-center)  
[Linux 本地MinIO存储服务远程调用上传文件](https://www.cpolar.com/blog/linux-local-mini-storage-service-remote-call-to-upload-files)  
[最火AI生图Stable Diffusion Web UI，本地开源部署并远程访问](https://www.cpolar.com/blog/the-hottest-love-student-tustapur-difucion-webtri-local-open-source-deployment-and-remote-access)  
[GitHub超火爆项目，一周涨20K星！ChatTTS – 用于对话场景的文本转语音大模型](https://www.cpolar.com/blog/githubs-super-hot-project-up-20k-stars-in-a-week-chattts)  
[Windows系统使用HUGO快速搭建一个本地博客网站并发布公网远程访问](https://www.cpolar.com/blog/windows-uses-hugo-to-quickly-build-a-local-blog-website-and-publish-public-remote-access)    
[Windows安装Ollama结合内网穿透实现公网访问本地大语言模型Web交互界面](https://www.cpolar.com/blog/windows-installation-of-ollama-combined-with-intranet-penetration-to-achieve-public-network-access-to-local-large-languages)  
[Dify 开源大语言模型(LLM) 应用开发平台如何使用Docker部署与远程访问](https://www.cpolar.com/blog/how-to-use-docker-to-deploy-and-remotely-access-the-dify-open-source-large-language-model-llm-application)  
[Docker本地部署GPT 聊天机器人并实现远程访问](https://www.cpolar.com/blog/docker-deploys-gpt-chatbot-locally-and-implements-remote-access)  





