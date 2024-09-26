---
author: "tager"
title: "npm插件本地开发调试攻略"
date: 2022-03-13
description: "😄今年的第一篇总结😄，文章不长、花5-10分钟就能看完，相信一定能对你有所帮助。npm插件本地调试、npm包高效开发、本地引入npm插件、node监控文件变化"
tags: ["JavaScript","Node.js"]
ShowReadingTime: "阅读4分钟"
weight: 627
---
介绍
--

**😄今年的第一篇总结😄，文章不长、花5-10分钟就能看完，相信一定能对你有所帮助。**

在前端项目比较多的情况下，我们通常会把一些公用的功能、函数抽离出来（根据不同场景，可以通过npm插件、微服务、[gitsubmodule](https://link.juejin.cn?target=https%3A%2F%2Fgit-scm.com%2Fdocs%2Fgit-submodule "https://git-scm.com/docs/git-submodule")等方式抽离）。

虽然处理的方法有很多，但使用最多的莫过于抽成`npm包` ，然后在需要使用的主项目中引入，以提高开发效率、减少模板代码和维护成本。

下面是几种常用的本地调试的方式介绍（包含小程序端）：

npm本地调试的几种方式
------------

### 1\. 使用[npm link](https://link.juejin.cn?target=https%3A%2F%2Fdocs.npmjs.com%2Fcli%2Fv8%2Fcommands%2Fnpm-link "https://docs.npmjs.com/cli/v8/commands/npm-link")命令，创建包链接

主要特点：本地开发时，变化可实时同步到主项目

适用场景：h5、pc（非小程序的应用）

具体使用方法：

**首先**，在插件项目的package.json所在的位置下，通过`npm link`命令，将该npm包模块链接到本地全局环境（我们可以使用`npm config get prefix`来获取全局路径）。

**然后**，在要使用该插件的主项目中，通过`npm link packageName`命令安装到当前项目中。

请注意，packageName取自package.json的name属性，而不是取自目录名称。

shell

 代码解读

复制代码

`# step1 # 假设npm包位置在'/dir/parcel'; 其包名为packageName cd /dir/parcel # 进入npm插件根目录 npm link # 发布到全局 # step2 # 项目位置'/project' cd /project # 进入项目根目录 npm link packageName # 在项目中引入packageName包`

当然，上面的步骤可以进一步简化（合并成一步），在主项目中，直接引入插件：

cmd

 代码解读

复制代码

`cd /project # 进入项目根目录 npm link /dir/parcel      # 直接链接到你的npm插件目录`  

**现在，你在插件中的任何变化都可以实时的在主项目中体现。**

**但是我们的插件通常需要打包后给其它项目使用，因此我们需要监控插件中原文件的变化。** 当文件变化后保存就执行npm run build, 只有这样被其它项目使用的时候才能使用到最新的插件内容。  
下面简单介绍下node中常用的几种监控方式：

#### node监控文件变化

*   使用[chokidar](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fchokidar "https://www.npmjs.com/package/chokidar")监控

特点：可以监控文件（增删改查）的具体变化，可控性强。

js

 代码解读

复制代码

``// 新建chokidar.js const chokidar = require('chokidar') var process = require('child_process'); // One-liner for current directory chokidar.watch('./src').on('all', (event, path) => {   console.log(event, path);   if(event === 'change') {     const shell = 'npm run build'     process.exec(shell,function (error, stdout, stderr) {       if (error !== null) {         console.log('exec error: ' + error);       } else {         console.log(`执行 ${shell} 成功`)       }     });   } }); // 通过 `node chokidar` 启动``

*   使用[nodemon](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fnodemon "https://www.npmjs.com/package/nodemon") 或 [supervisor](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fsupervisor "https://www.npmjs.com/package/supervisor")监控

特点：操作方便、易用，可直接通过npm scripts配置命令行

shell

 代码解读

复制代码

`# 监控src目录变化，发现变化执行--exec后面的命令 nodemon --watch src --exec node "./build/bundle.js"`

* * *

### 2\. 主项目中直接安装本地包

主要特点：变化也可实时同步

具体使用方法： 还是以上面的目录结构为例，可一步到位

js

 代码解读

复制代码

`// 1. 安装 在packgeage.json中的devDependencies对象中直接引入： {     devDependencies: {         customPackageName: '插件的绝对路径'     } } // 2. 使用 在主项目中引入 require('customPackageName') // 或者 import customPackageName from 'customPackageName'`

**说明：customPackageName的名字可以随便写，插件的绝对路径用pwd获取即可**

上面👆🏻介绍的两种调试方式，都和npm publish的效果几乎一致，只是会把插件项目下的所有文件都安装到当前项目的node\_modules中。  
但在小程序中需要再次构建npm才能使插件变化的代码生效，为了提高效率，就有了下面👇🏻的这种方式。

* * *

### 3\. 主项目中加载npm插件的入口文件

适用场景：小程序应用

具体使用方法

1.  将插件git clone pluginName... 到主项目
2.  在主项目的ignore文件中忽略掉pluginName
3.  在主项目中使用相对路径直接引入npm插件的入口文件

用此方式调试小程序的npm插件再方便不过了。将npm包作为小程序项目中的一部分，在开发完后再用上面的方式验证，以避免开发过程中反复构建npm的问题。

* * *

### 4\. 在npm插件中增加demo文件调试

适应场景：功能相对独立，需要额外的部署开发环境

说明：这种方法是最常见的，但是在某些场景下并不适合，比如npm插件需要依赖某些环境或项目才能执行、或者开发的npm插件功能比较简单独立时 而我们去花费额外的时间部署开发环境难免有些得不偿失。

结语
--

npm相关的知识点其实也挺多的，比如私有包部署安装、npm srcipts相关的内置指令、package.json文件中的高阶配置、npm包依赖关系及版本更新策略。理无专在，而学无止境也，然则问可少耶！

如果觉得有帮助，不妨`点赞、关注`支持一下。如文章有不足之处、疑问或建议，希望能在下方👇🏻 留言，非常感谢。

> 作者： `tager`  
> 相关文章地址：[`https://juejin.cn/user/4353721776234743/posts`](https://juejin.cn/user/4353721776234743/posts "https://juejin.cn/user/4353721776234743/posts")  
> 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。