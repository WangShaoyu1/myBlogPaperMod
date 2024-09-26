---
author: "Tecode"
title: "VisualStudioCode中配置TypeScript自动编译"
date: 2019-04-23
description: "VisualStudioCode包含TypeScript语言支持，但不包括TypeScript编译器tsc。您需要在全局或工作区中安装TypeScript编译器，以将TypeScript源代码转换为JavaScript（tscHelloWorld.ts）。安装TypeS…"
tags: ["TypeScript"]
ShowReadingTime: "阅读1分钟"
weight: 853
---
安装TypeScript编译器
---------------

Visual Studio Code包含TypeScript语言支持，但不包括TypeScript编译器tsc。您需要在全局或工作区中安装TypeScript编译器，以将TypeScript源代码转换为JavaScript（tsc HelloWorld.ts）。

安装TypeScript的最简单方法是通过npm，即Node.js包管理器,`-g`表示全局安装。

### 安装

 代码解读

复制代码

`npm install -g typescript`

### 检查版本-安装成功会输出版本信息

 代码解读

复制代码

`tsc --version`

 代码解读

复制代码

`xm@xm-Vostro-3670:~/project$ tsc --version Version 3.3.3333`

新建`HelloWorld`文件夹和`hello_world.ts`文件
------------------------------------

 代码解读

复制代码

`mkdir HelloWorld`

 代码解读

复制代码

`const text:string = 'hello world'; console.log(text);`

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/23/16a497c31fb1c6b8~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

新建Tsconfig.json
---------------

 代码解读

复制代码

`{   "compilerOptions": {       "target": "es5",       "module": "commonjs",       "outDir": "out",       "sourceMap": true   } }`

新增任务
----

### Tenimal->Run Task

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/23/16a498c06fd0e28e~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

### 选择`tsc:build-tsconfig.json`

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/23/16a498cc764fe2da~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

配置完成
----

### 按下`F5`

发现目录下多了一个`out`文件夹配置的是`"outDir": "out"`,`DEBUG CONSOLE`输出`hello world`。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/23/16a498ea40e1d7ce~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

### 修改`text`保存按下`F5`

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/23/16a49929119aade9~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)