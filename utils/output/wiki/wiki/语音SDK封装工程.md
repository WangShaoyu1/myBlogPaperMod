---
author: "王宇"
title: "语音SDK封装工程"
date: 三月09,2023
description: "十七、前端管理"
tags: ["十七、前端管理"]
ShowReadingTime: "12s"
weight: 563
---
工程形态（单体仓）
=========

  

[Edit Edit](/plugins/namymap/shownamymapeditor.action?mindmapName=%E8%AF%AD%E9%9F%B3WEB+SDK&lastPage=%2Fpages%2Fviewpage.action%3FpageId%3D95553564&pageId=95553564&isViewMode=false) [Show Show](/plugins/namymap/shownamymapeditor.action?mindmapName=%E8%AF%AD%E9%9F%B3WEB+SDK&lastPage=%2Fpages%2Fviewpage.action%3FpageId%3D95553564&pageId=95553564&isViewMode=true) Remove Remove //<!\[CDATA\[ jQuery("#92614").mousedown(function(e) { var parameters = {width: 700, height: 180, id: "remove-dialog", closeOnOutsideClick: false}; var dialog = new AJS.Dialog(parameters); var originalPopupHide = dialog.popup.hide; dialog.popup.hide = function() { anyDialogVisible = false; originalPopupHide.apply(this, arguments); AJS.trigger("hide.dialog", {dialog: dialog}); }; dialog.addHeader("Map remove confirmation"); dialog.addPanel("Confirmation", "<p>Your map will be deleted from the page and from attachments. Do you really want to remove your map?</p>", "remove-dialog-body"); dialog.addButton("Yes", function (dialog) { var url = "/plugins/namymap/removenamymap.action?mindmapName=%E8%AF%AD%E9%9F%B3WEB+SDK&amp;lastPage=%2Fpages%2Fviewpage.action%3FpageId%3D95553564&amp;pageId=95553564"; window.location.href = url.replace(/&amp;/g, "&"); }); dialog.addCancel("No", function (dialog) { dialog.hide(); }); dialog.show(); }); //\]\]>

[![](/download/attachments/95553564/%E8%AF%AD%E9%9F%B3WEB%20SDK.png?version=5&amp;modificationDate=1677053465661&amp;api=v2)](/plugins/namymap/shownamymapeditor.action?mindmapName=%E8%AF%AD%E9%9F%B3WEB+SDK&lastPage=%2Fpages%2Fviewpage.action%3FpageId%3D95553564&pageId=95553564&isViewMode=true)




===========================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================

意思
--

STT：Speech To Text, STT

模块介绍
----

STT-Core: 核心语音功能，跨框架（库），供给react-STT、vue-STT模块底层能力，可给用户直接使用音频功能，也支持语音转文字处理(内置请求科大讯飞链接的服务逻辑）

react-STT: 基于react实现，提供hook和组件功能（16.8+）

vue-STT: 基于vue实现，提供hook和组件功能（优先考虑vue3.x）

STT-docs：展示三大模块demo的文档应用，不输出工具应用，只做最终展示效果

  

技术栈
===

模块管理
----

pnpm + workspace 单体仓架构

构建工具
----

vite【^4.1.1】

  

文档工具
----

vitepress【1.0.0-alpha.45】

包版本管理
-----

changeset【^2.26.0】

开发文档
====

安装依赖
----

根目录pnpm install

  

多种启动
----

可在各个package内部启动调试，pnpm run dev

  

如需要启动文档调试，需要启动**docs**模块，再启动相应package

原因：docs模块的demo坑位采用iframe技术，所以需要启动多个应用

  

文档打包
----

pnpm run docs:build: 将文档模块和packages全部打包文档形式

  

**Release工作流**
--------------

  

[https://zhuanlan.zhihu.com/p/562340640?utm\_id=0](https://zhuanlan.zhihu.com/p/562340640?utm_id=0) [](https://zhuanlan.zhihu.com/p/562340640?utm_id=0)

待完善

  

部署方案
----

docker容器化

遇到问题
====

问题

难度

是否已解决

说明

问题

难度

是否已解决

说明

git push后的自动部署不了，子应用执行命令时找不到模块

![(星星)](/s/-vky9ok/8401/008d09724398b50e93468e30a239d4f6d750af9b/_/images/icons/emoticons/star_yellow.svg)![(星星)](/s/-vky9ok/8401/008d09724398b50e93468e30a239d4f6d750af9b/_/images/icons/emoticons/star_yellow.svg)![(星星)](/s/-vky9ok/8401/008d09724398b50e93468e30a239d4f6d750af9b/_/images/icons/emoticons/star_yellow.svg)![(星星)](/s/-vky9ok/8401/008d09724398b50e93468e30a239d4f6d750af9b/_/images/icons/emoticons/star_yellow.svg)

是

暂时先打包，再推仓库，再点发布

2032.03.03突然可以，可能是resolve问题

子应用React模块打包后路径不正确，Vue模块没问题

![(星星)](/s/-vky9ok/8401/008d09724398b50e93468e30a239d4f6d750af9b/_/images/icons/emoticons/star_yellow.svg)

是

React跟Vue对src里的路径构建逻辑都不一致

核心模块（STT-Core）的demo展示完整html代码，不是单单js

![(星星)](/s/-vky9ok/8401/008d09724398b50e93468e30a239d4f6d750af9b/_/images/icons/emoticons/star_yellow.svg)![(星星)](/s/-vky9ok/8401/008d09724398b50e93468e30a239d4f6d750af9b/_/images/icons/emoticons/star_yellow.svg)

是

因为每个模块的demo不止一个，而这个模块又不是React、Vue有处理js入口，为保持原生真实案例，入口只能一个普通html，这里能根据路由重定向调到其他html（demo）

结合rollup多页面入口配置解决

部署后，切换路由报错，阻塞渲染更新

![](/download/attachments/95553564/image2023-2-22_9-30-19.png?version=1&modificationDate=1677029419516&api=v2)

![(星星)](/s/-vky9ok/8401/008d09724398b50e93468e30a239d4f6d750af9b/_/images/icons/emoticons/star_yellow.svg)![(星星)](/s/-vky9ok/8401/008d09724398b50e93468e30a239d4f6d750af9b/_/images/icons/emoticons/star_yellow.svg)

否

水合异常？有时又可以

  

  

  

  

  

待完善...

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)