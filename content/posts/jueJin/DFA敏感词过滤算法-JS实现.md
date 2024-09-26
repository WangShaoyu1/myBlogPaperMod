---
author: "庚辰腊七木头鱼"
title: "DFA敏感词过滤算法-JS实现"
date: 2023-06-01
description: "这是一个使用JS编写的DFA算法实现代码，同时我也发布了一个npm包，兼容Node环境与Browser环境，欢迎下载使用"
tags: ["JavaScript","后端"]
ShowReadingTime: "阅读1分钟"
weight: 554
---
简介
==

这是一个使用 JS 编写的 DFA 算法实现代码，同时我也发布了一个 npm 包，兼容 Node 环境与 Browser 环境，欢迎下载使用，使用方法如下：

javascript

 代码解读

复制代码

 `// 安装dfafilter包  npm install dfa-filter  ​  // browser 环境使用  import dfaFilter from 'dfa-filter'  ​  // node 环境使用  require(dfaFilter)  ​  /**  //大括号写类型  @param{string}text 待检测的字符串  @param{string}tag 用于替换敏感词的字符。默认“*”  @param{Boolean}countMode true为使用过滤替换模式，false是使用计数模式。默认“false”  @returns 返回过滤后的文本或者敏感词计数  */  dfaFilter("the text for test", "*", flase)`

DFA 算法
======

DFA敏感词检测算法是一种高效的字符串匹配算法，可以快速地在一段文本中检测是否包含敏感词。

DFA（Deterministic Finite Automaton）敏感词检测算法是一种基于有限状态自动机的高效字符串匹配算法，通过将敏感词构建成一棵状态转移图，将文本逐个字符进行匹配，并根据状态转移图的规则进行状态的转移来检测是否包含敏感词，具有快速、高效的特点，在实际应用中被广泛使用。

具体实现
====

js

 代码解读

复制代码

`class DFAFilter {   constructor() {     this.keyword_chains = {};     this.delimit = "\x00";   }   add(keyword) {     if (typeof keyword !== "string") {       keyword = new TextDecoder().decode(keyword);     }     keyword = keyword.toLowerCase();     const chars = keyword.trim();     if (!chars) {       return;     }     let level = this.keyword_chains;     for (let i = 0; i < chars.length; i++) {       if (chars[i] in level) {         level = level[chars[i]];       } else {         if (!(level instanceof Object)) {           break;         }         for (let j = i; j < chars.length; j++) {           level[chars[j]] = {};           var [last_level, last_char] = [level, chars[j]];           level = level[chars[j]];         }         last_level[last_char] = { [this.delimit]: 0 };         break;       }       if (i === chars.length - 1) {         level[this.delimit] = 0;       }     }   }   parse(path) {     const text = require(path).data     text.forEach((keyword) => this.add(keyword));   }   filter(message, repl = "*") {     if (typeof message !== "string") {       message = new TextDecoder().decode(message);     }     message = message.toLowerCase();     const ret = [];     let start = 0;     let count = 0;     while (start < message.length) {       let level = this.keyword_chains;       let step_ins = 0;       for (let i = start; i < message.length; i++) {         const char = message[i];         if (char in level) {           step_ins++;           if (!(this.delimit in level[char])) {             level = level[char];           } else {             ret.push(repl.repeat(step_ins));             start += step_ins - 1;             count++;             break;           }         } else {           ret.push(message[start]);           break;         }       }       if (step_ins === 0) {         ret.push(message[start]);       }       start++;     }     return [ret.join(""), count];   } } const gfw = new DFAFilter(); gfw.parse("./keywords.json"); /** //大括号写类型 @param{string}text 待检测的字符串 @param{string}tag 用于替换敏感词的字符。默认“*” @param{Boolean}countMode true为使用过滤替换模式，false是使用计数模式。默认“false” @returns 返回过滤后的文本或者敏感词计数 */ const dfaFilter = (text, tag = "*", countMode = false) => {   const [resultTxt, count] = gfw.filter(text, tag);   if (!countMode) {     return resultTxt;   }   return count; }; module.exports = dfaFilter;`

参考资料
====

[github.com/obaby/dfa-p…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fobaby%2Fdfa-python-filter "https://github.com/obaby/dfa-python-filter")