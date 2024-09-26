---
author: "我不吃饼干"
title: "十分钟通过npm创建一个命令行工具"
date: 2019-02-05
description: "大过年的，要不要写点代码压压惊？来花十分钟学一下怎么通过npm构建一个命令行工具。写了一个小demo，用于代替touch的创建文件命令touchme，可以创建自带“佛祖保佑”注释的文件。效果如下：首先创建一个文件夹，我起名字create-file-cli然…"
tags: ["NPM"]
ShowReadingTime: "阅读1分钟"
weight: 159
---
大过年的，要不要写点代码压压惊？来花十分钟学一下怎么通过 npm 构建一个命令行工具。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/2/4/168b8bcadac4c3a5~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)  

写了一个小 demo，用于代替 `touch` 的创建文件命令 `touchme` ，可以创建自带“佛祖保佑”注释的文件。效果如下： 

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/2/4/168b8b513aaea536~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)  

命令可以带有一个参数，选择注释的符号

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/2/4/168b8b5842618fa9~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)  

现在，开始撸代码 ~

首先创建一个文件夹，我起名字 `create-file-cli` 然后通过 `npm init` 命令创建 `package.json` 文件。

 代码解读

复制代码

`$ mkdir create-file-cli $ cd create-file-cli $ npm init -y`

然后修改 `package.json` 添加一个 `bin` 字段，定义一个 `touchme` 命令，并指定该命令执行的文件。

 代码解读

复制代码

`{   "name": "create-file-cli",   "version": "1.0.0",   "description": "",   "main": "index.js",   "scripts": {     "test": "echo \"Error: no test specified\" && exit 1"   },   "bin": {     "touchme": "bin/touchme.js"   },   "keywords": [],   "author": "",   "license": "ISC" }`

接下来实现 `bin/touchme.js` ，要用到  [Commander.js](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ftj%2Fcommander.js%2F "https://github.com/tj/commander.js/") -- node.js 命令行接口的完整解决方案。看不懂英文文档还有贴心的中文 [README](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ftj%2Fcommander.js%2Fblob%2Fmaster%2FReadme_zh-CN.md "https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md")。

`bin/touchme.js` 如下

 代码解读

复制代码

``#!/usr/bin/env node const program = require('commander'); const gen = require('../lib/generate-file'); program   // 版本信息   .version('0.0.4', '-v, --version')   // 用法说明   .usage('<file ...> [options]')   // 选择名 选项描述 默认值   // 选项 可以带有一个参数 可以通过 program.copy 获取该选项信息   // 如果没有参数 该值为 true   .option('-c, --copy <source>', 'copy file and add comment')   .option('-H, --hashtag', `comment by '#'`)   .option('-s, --slash', `comment by '/'`)   .parse(process.argv); function resolve(program) {   // 没有匹配任何选项的参数会被放到数组 args 中   const { copy, hashtag, slash, args } = program;   if (!args.length) {     console.log('Please input filename.');     return;   }   if (copy === true) {     console.log('You should copy at least one file.');     return;   }   let type = 'star';   if (slash) type = 'slash';   if (hashtag) type = 'hashtag';   for (let i = 0; i < args.length; i++) {     gen(args[i], copy, type);   } } resolve(program);``

具体 lib/generate-file.js 实现见 https://github.com/G-lory/create-file-cli/ 就是简单的创建一个文件并写入注释。

通过 option 定义命令选项并可定义参数。

通过 program 可以获取命令行输入的参数信息。

现在功能写完了，剩下的事情就是发布了。首先要到 https://www.npmjs.com 查找一下自己的包名有没有人已经发布了，如果有的话，你需要先修改包名。然后在 https://www.npmjs.com 注册一个账号。记住自己的账号密码和邮箱后，回到命令行。

 代码解读

复制代码

`$ npm login Username: ... Password:  Email: (this IS public) Logged in as ... on https://registry.npmjs.org/.`

注意登录成功后显示的是 https://registry.npmjs.org/ 很多同学设置了淘宝的镜像，显示的就不是这个地址，那么要记得改回来。

 代码解读

复制代码

`$ npm config set registry=http://registry.npmjs.org`

然后就可以发布包了。

 代码解读

复制代码

`$ npm publish`

如果之后有修改，更改一下 `package.json` 中的版本号 然后再次执行 `npm publish` 即可。

发布后可以去 npm 网站搜索一下自己的包。然后就是安装测试一下功能。

全局安装一下

 代码解读

复制代码

`npm install create-file-cli -g`

然后就可以使用 `touchme` 命令创建文件了。也可以使用 `touchme -h` 来查看帮助。

一个命令行工具就创建成功啦。

第一次在掘金写文章，还是有点（划掉）非常水，嗯，新的一年会加油的。