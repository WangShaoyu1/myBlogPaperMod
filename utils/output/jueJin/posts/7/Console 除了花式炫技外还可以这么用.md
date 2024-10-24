---
author: "Gaby"
title: "Console 除了花式炫技外还可以这么用"
date: 2022-06-08
description: "虽然console 的调试能力有限，但是作为信息输出还是足够日常工作使用的，为了方便开发过程中方便调试部署到测试服务器上的代码，所以对 consolelog 进行再封装，以满足日常调试需求。"
tags: ["JavaScript","面试","架构中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:5,comments:0,collects:3,views:4464,"
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第9天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

废话只说一句：码字不易求个👍，收藏 === 学会,快行动起来吧！🙇‍🙇‍🙇‍。

感谢点赞、收藏、关注和提出建议的小伙伴，希望大家工作顺利、老板能给你们加鸡腿!

写在前头： 关于 `console.log` 使用的分享中，大多数都是介绍 `cosole.debug()` `cosole.error()` `cosole.info()` `cosole.ware()` `console.table()` 等方法的使用，还有变着花样的输出五彩斑斓的黑以进行自悦，或者让别人在审查自己的代码时召唤出自己的神兽。

![image.png](/images/jueJin/dd4888508c074e0.png)

这里就不对 `cosole.debug()` `cosole.error()` `cosole.info()` `cosole.ware()` `console.table()` 等，以及花式打印进行过多的说明了，这些更多的时候固定用法，而且日常调试单纯的使用 `console.log` 会更方便些。想了解更多使用方法的可以 [参考MDN](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FConsole "https://developer.mozilla.org/zh-CN/docs/Web/API/Console")

其实有大部分程序员/媛,日常开发过程中都会用到 `console.log` 来调试程序，虽然 `console.log` 的调试能力有限，但是作为信息输出还是足够日常工作使用的，为了方便开发过程中方便调试部署到测试服务器上的代码， 所以对 `console.log` 进行再封装，以满足日常调试需求。

需求设计
----

当项目进行打包的时候，如果配置了清除 `console.log` 的配置，则不会有输出，如果不清除，可能会打印出一堆的信息，也会消耗性能。对于测试也不是很方便。这个时候如果，可以通过环境变量去控制是否需要打印信息，及打印指定模块或指定某个的信息岂不是更好。 既不会出现杂乱的信息输出，也能减少页面性能的消耗。

这里不对 `cosole.debug()` `cosole.error()` `cosole.info()` `cosole.ware()` `console.table()` 等进行过多的说明，这些更多的时候固定用法，而且日常调试单纯的使用 `console.log` 会更方便些。

梳理需求：

*   可全局控制 `cosole.debug()` 的关闭和开启
*   全局打印关闭时候，可指定打印某个模块的信息，通过模块名控制
*   全局打印关闭时候，可指定开启某个具体位置进行打印，通过模块和名称进行控制
*   支持多参数打印

期初先要设计参数，如下：

通过设置 `window.logger.isLog` 进行控制全局的打开和关闭; 通过设置 `window.logger.name` 在关闭全局打印的情况下进行指定模块或具体某一处信息的打印.或者精简拆分成两个变量，这个自行设置就行。

为方便起见，模块名称和具体位置名称被整合到一个变量 `name` 中, 通过 `-` 进行连接, 比如: `article-getArticle`, 示例中 `article` 就是模块名, `getArticle` 则为具体打印信息的位置的名称

```js
    window.logger = {
    isLog: false, // 开发时可以设置成 true
    name: ''
    };
    // 或者
    window.isLog = false;
    window.logname = false;
```

开发封装
----

```js
// log.js
    window.logger = {
    isLog: true,
    name: ''
    };
    
    // 打印方法
        export const _log =(...args)=>{
        // 对象 采用深拷贝 console.log(JSON.parse(JSON.stringify(a))); 不推荐，特殊情况下使用，一般情况直接打印即可
        if(!window.logger.isLog){ // 关闭
            if(window.logger.name){
            let arr = window.logger.name.split('-');
            let arrName = args[0].split('-');
            args.shift()
            if(arr.length === 1){ // 模块
            if(window.logger.name === arrName[0]) console.log(...args);
            } else { // 具体位置
            if(window.logger.name === args[0]) console.log(...args);
        }
    }
    } else { // 开启
    args.shift()
    console.log(...args);
}
}
```

使用
--

> 📢注意：这里均使用 `Vue 3` 环境代码

### 按需加载

可以按需使用，也可以采用全局加载

```js
// 按需使用
import { _log } from '@/utils/log'

_log('article-getArticle',res)
```

### 全局加载

Vue 3 中全局引入

```js
// main.js
import Vue, { createApp } from 'vue'
import { _log } from '@/utils/log'

const app = createApp(App)
app.config.globalProperties.$log = _log;
app.mount('#app')

```

全局加载中的使用

```js
import { getCurrentInstance } from 'vue'
const {proxy}: any = getCurrentInstance() // 获取当前组件实例

proxy.$log('hello-article',res,676767,899890,'xxx')
```