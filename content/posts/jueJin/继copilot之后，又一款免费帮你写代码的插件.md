---
author: "程序员晓凡"
title: "继copilot之后，又一款免费帮你写代码的插件"
date: 2023-08-23
description: "在之前的文章中推荐过一款你写注释，它就能帮你写代码的插件copilot。继copilot之后，又一款免费帮你写代码的插件"
tags: ["人工智能","敏捷开发"]
ShowReadingTime: "阅读2分钟"
weight: 904
---
### 写在前面

在之前的文章中推荐过一款你写注释，它就能帮你写代码的插件copilot。

copilot写代码的能力没得说，但是呢copilot试用没几天之后就收费了。

按理说这么好用，又可以提高效率的工具，收点费也理所当然

但是秉承白嫖一时爽，一直白嫖一直爽的原则（主要是我穷穷穷），又发现了一款可以平替的插件`CodeGeex`。

### 一、CodeGeex简介

① 来自官方的介绍

> `CodeGeeX is a powerful intelligent programming assistant based on LLMs. It provides functions such as code generation/completion, comment generation, code translation, and AI-based chat, helping developers significantly improve their work efficiency. CodeGeeX supports multiple programming languages.`

翻译过来大概是

> `CodeGeeX`是一个功能强大的基于`llm`的智能编程助手。它提供了代码生成/完成、注释生成、代码翻译和基于`ai`的聊天等功能，帮助开发人员显著提高工作效率。`CodeGeeX`支持多种编程语言。

② `GitHub地址`：

[github.com/THUDM/CodeG…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FTHUDM%2FCodeGeeX2 "https://github.com/THUDM/CodeGeeX2")

目前在`GitHub上 2.6k star` 最近更新是2周前

![GitHub上star](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/531a3c20a05e4156a95ebf8646c2b228~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

③ 下载量

*   `vscode` 目前已有`129k`下载量
*   `idea` 目前已有`58.7k` 下载量

### 二、插件安装

① vscode

![vscode插件](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b9719e765514a449b3c40f3f4d8585f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

②idea

**注：** idea低版本的搜不到这个插件，小编用的是2023.01 这个版本的

![idea插件](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cedc795b678e4572bd7593a42ebc0ad7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

安装完成后，注册一个账号即可使用

### 三、帮你写代码

*   ① 我们只需要输入注释回车，它就可以根据注释帮你写代码
    
*   ② `tab`接受一行代码 `ctrl+space` 接受一个单词
    
    ![接受行or接受Word](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0eaea7ecc164172b2e961248e82bc96~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
    

![帮你写代码](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/076ce388a07045dfba6e7ba6a40efc37~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 四、帮你添加注释

> 有时候，我们拿到同事没有写注释的代码，或者翻看一周前自己写的代码时。
> 
> 这写得啥，完全看不懂啊，这时候就可以依靠它来帮我们的代码添加注释了

操作方法：

*   ① 选中需要添加注释的代码
*   ② 鼠标右键选择`Add Comment`
*   ③ 选择中文或者英文

![Add Comment](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/76d24e4914864497a98ebf7847446f78~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![中文或者英文注释](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd39f590f5b843bab262a61a99794d3b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

这是没加注释的代码

ini

 代码解读

复制代码

`public class test02 {     public static void main(String[] args) {         int count=0;         for(int i=101;i<200;i+=2) {             boolean flag=true;             for(int j=2;j<=Math.sqrt(i);j++) {                 if(i%j==0) {                     flag=false;                     break;                 }             }             if(flag==true) {                 count++;                 System.out.println(i);             }         }         System.out.println(count);     } }`

这是CodeGeex帮加上的注释

ini

 代码解读

复制代码

`public class test02 {     //主方法，用于执行循环     public static void main(String[] args) {         //定义一个变量count，初始值为0         int count=0;         //循环，每次循环，计算101到200之间的值，并判断是否是因子         for(int i=101;i<200;i+=2) {             //定义一个变量flag，初始值为true             boolean flag=true;             //循环，每次循环，计算i的值，并判断是否是因子             for(int j=2;j<=Math.sqrt(i);j++) {                 //如果i的值不是因子，则flag设置为false，并跳出循环                 if(i%j==0) {                     flag=false;                     break;                 }             }             //如果flag为true，则count加1，并打印出i的值             if(flag==true) {                 count++;                 System.out.println(i);             }         }         //打印出count的值         System.out.println(count);     } }`

基本上每一行都加上了注释，这还怕看不懂别人写的代码

### 五、帮你翻译成其他语言

> 除了上面功能外，`CodeGeeX` 还可以将一种语言的代码转换成其他语言的代码

操作方法：

*   ① 选中需要转换的代码
*   ② 鼠标右键选择`Translation mode`
*   ③ 在弹出的侧边栏中选择需要转换成的语言，例如`C++`、 `C#`、`Javascript` 、`java`、`Go`、`Python`、`C` 等等
*   ④ 选择转换按钮进行转换

![Translation mode](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b3332bad1f7430a9e9e0c4d43f87000~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![转换代码](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d99539c2b4142658c1b88cc2a4533a6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 六 小结

试用了一下，`CodeGeeX` 还是可以基本可以满足需求的，日常开发中提高效率是没得说了

作为我这样的穷逼，完全可以用来平替copilot，能白嫖一天是一天~

也不用当心哪天不能用了，等用不了了再找其他的呗

![穷到每天煮眼泪](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7012c51918d84cc98ad7f3af1d34c0a2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

本期内容到此就结束了

希望对你有所帮助，我们下期再见~ (●'◡'●)