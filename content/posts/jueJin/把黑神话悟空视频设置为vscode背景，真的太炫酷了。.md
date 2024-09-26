---
author: "前端小付"
title: "把黑神话悟空视频设置为vscode背景，真的太炫酷了。"
date: 2024-08-21
description: "我写了一个vscode插件，可以把黑神话悟空宣传视频设置为vscode背景，真的太炫酷了，写代码效率都变高了。"
tags: ["前端","JavaScript","VisualStudioCode"]
ShowReadingTime: "阅读5分钟"
weight: 813
---
背景
==

今天在掘金热榜上看到[VSCode 天命人：边打代码边体验黑神话悟空 ✨](https://juejin.cn/post/7404748015573860352 "https://juejin.cn/post/7404748015573860352")这篇文章，文章里说vscode里不能播放视频，我研究了一下，找到一个可以播放视频的方案，于是我写了一个vscode插件，把黑神话悟空宣传视频当前vscode背景，效果真的太炫酷了。

效果展示
====

主题1
---

主题2
---

使用说明
====

可以到vscode[插件市场](https://link.juejin.cn?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Ddbfu321.wukong-background-video "https://marketplace.visualstudio.com/items?itemName=dbfu321.wukong-background-video")中安装，也可以本地vscode插件市场中搜索`wukong-background-video`安装，安装可能比较慢，大家耐心等待一下。

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/0490c6f6b7b640aa9dfa611dee0403ae~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5bCP5LuY:q75.awebp?rk3s=f64ab15b&x-expires=1727406128&x-signature=vCZqOigUTKCCOp3VPo9bir0HeIw%3D)

安装插件后，重启一下vscode，就能看到视频了。打开vscode会提示文件已损坏，修改修改了vscode源码，所以会有这个提示，可以不用管这个。

如果想卸载插件，需要先在命令面板中搜索`background-video.uninstall`命令，命令执行成功后，再卸载插件，然后重启vscode。

在设置里搜索 `background-video`,可以设置透明度(0-1)和显示视频，目前内置了两个视频，视频来源为[www.wegame.com.cn/wukong](https://link.juejin.cn?target=https%3A%2F%2Fwww.wegame.com.cn%2Fwukong "https://www.wegame.com.cn/wukong")。修改完成后，需要重启一下vscode。

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/efe4d0d593564431bdea22a0ae7f2364~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5bCP5LuY:q75.awebp?rk3s=f64ab15b&x-expires=1727406128&x-signature=g0zqMKgRLGcC8cUhGHjZKaOua3U%3D)

如果想加载自己的视频，找到vscode安装目录，把里面的两个视频替换掉就行了，名字需要保持一致，video1.mp4或video2.mp4。

mac目录一般是`/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench`

windows我不清楚

插件开发过程
======

原理
--

其实很简单，就是修改vscode的源码，大家应该都知道vscode是使用Electron开发的，所以前端页面都是使用html和js写的，找到对应的js源码，然后自己写一段js代码，这个js实现的功能就是动态创建一个video标签，设置一下样式，然后把这个js注入到源码中，vscode启动时会自动执行这段代码。

这里有两种实现方式，一个是脚本，写一个脚本动态把js注入到vscode源码中，还有一种方式写一个vscode插件，运行插件时中往vscode源码中注入代码。

这里我采用第二种方式，因为让其他人也可以方便使用，脚本方式不易传播。

mac中可以往这个文件里写入js代码，`/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.js`

windows我不清楚

实战
--

### 创建vscode插件项目

sh

 代码解读

复制代码

`yo code`

### 核心代码

js

 代码解读

复制代码

``// The module 'vscode' contains the VS Code extensibility API // Import the module and reference it with the alias vscode in your code below const vscode = require('vscode'); const path = require('path'); const { readFileSync, writeFileSync, copyFileSync, unlinkSync } = require('fs'); // this method is called when your extension is activated // your extension is activated the very first time the command is executed /**  * @param {vscode.ExtensionContext} context  */ function activate(context) { 	let config = vscode.workspace.getConfiguration('background-video'); 	const opacity = config.get('opacity'); 	const videoName = config.get('videoName'); 	// 获取vscode js目录 	const workbenchDirPath = path.join(path.dirname((require.main).filename), 'vs', 'code', 'electron-sandbox', 'workbench'); 	const workbenchFilePath = path.join(workbenchDirPath, 'workbench.js'); 	const jsPath = path.resolve(context.extensionPath, 'resources/main.js'); 	const video1Path = path.resolve(context.extensionPath, 'resources/video1.mp4'); 	const video2Path = path.resolve(context.extensionPath, 'resources/video2.mp4'); 	function setContent(opacity = 0.4, videoName = 'video1.mp4') { 		let jsCode = readFileSync(jsPath, 'utf8').toString(); 		jsCode = jsCode.replace('{opacity}', opacity ? +opacity : 0.4); 		jsCode = jsCode.replace('{videoName}', videoName); 		let workbenchCode = readFileSync(workbenchFilePath, 'utf8').toString(); 		const re = new RegExp("\\/\\*background-video-start\\*\\/[\\s\\S]*?\\/\\*background-video-end\\*" + "\\/", "g"); 		workbenchCode = workbenchCode.replace(re, ''); 		workbenchCode = workbenchCode.replace(/\s*$/, ''); 		writeFileSync(workbenchFilePath, `${workbenchCode}  /*background-video-start*/ ${jsCode}  /*background-video-end*/`); 		copyFileSync(video1Path, path.join(workbenchDirPath, 'video1.mp4')); 		copyFileSync(video2Path, path.join(workbenchDirPath, 'video2.mp4')); 	} 	setContent(opacity, videoName); 	vscode.workspace.onDidChangeConfiguration(event => { 		if (event.affectsConfiguration('background-video.opacity') || event.affectsConfiguration('background-video.videoName')) { 			config = vscode.workspace.getConfiguration('background-video'); 			const opacity = config.get('opacity'); 			const videoName = config.get('videoName'); 			setContent(opacity, videoName); 			vscode.window.showInformationMessage('配置已更新，重启vscode后生效'); 		} 	}); 	context.subscriptions.push(vscode.commands.registerCommand('background-video.uninstall', () => { 		let workbenchCode = readFileSync(workbenchFilePath, 'utf8').toString(); 		const re = new RegExp("\\/\\*background-video-start\\*\\/[\\s\\S]*?\\/\\*background-video-end\\*" + "\\/", "g"); 		workbenchCode = workbenchCode.replace(re, ''); 		workbenchCode = workbenchCode.replace(/\s*$/, ''); 		writeFileSync(workbenchFilePath, workbenchCode); 		// 删除视频文件 		unlinkSync(path.join(workbenchDirPath, 'video1.mp4')); 		unlinkSync(path.join(workbenchDirPath, 'video2.mp4')); 		vscode.window.showInformationMessage('内容删除成功, 可以卸载插件了。'); 	})); } // this method is called when your extension is deactivated function deactivate() { } module.exports = { 	activate, 	deactivate }``

插件启动的时候，把一段js写入到workbench.js中，顺便把2个视频也复制过去。因为这两个视频做了同源处理，不允许跨域访问，只能下载下来放本地。

### 需要注入的js代码

js

 代码解读

复制代码

`var video = document.createElement('video'); video.src = "{videoName}"; video.style.width = '100vw'; video.style.height = '100vh'; video.loop = true; video.autoplay = true; video.muted = true; video.style.position = 'absolute'; video.style.top = 0; video.style.left = 0; video.style.zIndex = 100; video.style.opacity = {opacity}; video.style.pointerEvents = 'none'; video.style.objectFit = "fill"; document.body.appendChild(video);`

这段代码创建一个video标签，然后把video挂到body上，这里有两个变量，注入的时候会被替换成真实的值。

### 效果

安装插件后，workbench.js里被注入的js，workbench目录下会多出两个视频文件。

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/271656fc5fac4f7bb5b9f51a155304e5~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5bCP5LuY:q75.awebp?rk3s=f64ab15b&x-expires=1727406128&x-signature=UmLg%2FN6XDVZhjskYum9B%2BNmY%2FcI%3D)

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/0bc918d3e35e442385f10cfe32620a18~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5bCP5LuY:q75.awebp?rk3s=f64ab15b&x-expires=1727406128&x-signature=14kFDa1ceLx4F7yLA%2BgGKb3%2FFXs%3D)

最后
==

大家如果好的创意，可以给项目提PR。

仓库地址：[github.com/dbfu/wukong…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdbfu%2Fwukong-background-video "https://github.com/dbfu/wukong-background-video")

补充卸载方案
======

需要先在命令面板中搜索background-video.uninstall命令，命令执行成功后，再卸载插件，然后重启vscode，这个过程中不要关闭vscode或打开vscode。

卸载原理：执行卸载命令就是把写入的代码从vscode源码中删除，并且删除复制过去的视频，直接卸载插件，是不能删除代码和视频的，所以需要执行一个命令把代码和视频删除掉后，再卸载插件。

执行完删除命令后，还没卸载插件前，这时候不要打开或关闭vscode，因为每次重新打开vscode，插件都会把代码和视频复制过去，这时候再卸载插件就不行了，需要再执行一下卸载命令，紧接着卸载插件就行了。

有的人可能直接卸载插件，没有执行命令，这时候需要重新安装一下插件，然后执行上面步骤后，再卸载插件。

如果按照上面教程，还卸载不了，可以按照下面步骤操作

*   先卸载插件
    
*   mac可以到`/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench`目录下找到workbench.js文件，拉到文件最后，把`/*background-video-start*/` 后面的代码手动删掉和删除视频，重启vscode。
    
*   windows可以到vscode安装目录\\resources\\app\\out\\vs\\code\\electron-sandbox\\workbench目录下找到workbench.js文件，拉到文件最后，把`/*background-video-start*/` 后面的代码手动删掉和删除视频，vscode。
    
*   windows查看安装目录方法：桌面上右键vscode图标，打开文件所在位置，可以直接进入  
    D:\\tools\\Microsoft VS Code，这个就是安装目录。