---
author: "Gaby"
title: "Git commit 规范"
date: 2022-06-28
description: "在工作中避免不了多人协作，协作避免不了有一个规范的流程，让大家有效的去合作；让项目有条不紊的进行。自然使用 git 规范进行把控也是项目中必不可少的技术了。"
tags: ["JavaScript","架构","Git中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:42,comments:0,collects:68,views:6376,"
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第29天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

废话只说一句：码字不易求个👍，收藏 === 学会,快行动起来吧！🙇‍🙇‍🙇‍。

在工作中避免不了多人协作，协作避免不了有一个规范的流程，让大家有效的去合作；让项目有条不紊的进行。自然使用 git 规范进行把控也是项目中必不可少的技术了。

### Git commit 规范

#### 为什么要写好 Git Commit?

*   提供更多的历史信息，方便快速浏览
*   可以过滤某些commit（比如文档改动），方便快速查找信息

```perl
# 过滤日志信息
git log HEAD --pretty=format:%s --grep 关键字
```

*   可以直接从commit生成Change log

#### 如何写好Git Commit

业界使用比较广泛的是Angular规范

```xml
<type>(<scope>):<subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

*   标题行：必填，描述主要修改类型和内容
*   主要内容：描述为什么修改，做什么样的修改，以及开发的思路等等
*   页脚注释：放 Breaking Changes 或 Closed Issuses

type | commit 类型

类型

详细介绍

feat

新功能、新特性

fix

bugfix，修改问题

refactor

代码重构

docs

文档修改

style

代码格式修改，注意不是css修改

test

测试用例修改

chore

其他修改，比如构建，依赖管理

scope | commit影响的范围 比如：route、component、utils、build.....

*   subject:commit 的概述，建议符合 50/72 formatting
*   body：commit 具体修改内容，可以分为多行，建议符合50/72 formatting
*   footer：一些备注，通常是BREAKING CHANGE 或 修改的bug链接

#### 利用插件（commitizen）

利用commitizen，提交规范的commit。

*   commitizen 用于提示用户输入或选择，生成规范的commit
*   cz-conventional-changelog 用于生成changelog

```shell
# 1. 下载cz-conventional-changelog changelog插件
npm install -g commitizen cz-conventional-changelog
# 2. package.json 配置

    {
        "scripts": {
        # 以后提交commit 直接执行npm run commit
        "commit": "git-cz",
        },
        # config用来设置一些项目不怎么变化的项目配置，用户用的时候可以使用如下用法：process.env.npm_package_config_commitizen
            "config": {
                "commitizen": {
                "path": "./node_modules/cz-conventional-changelog"
            }
        }
    }
    
    # 也可以使用以下配置，配置全局变量
# 命令行中输入以下命令，配置到czrc目录下,也可以用vim编辑~/.czrc添加到文件中去{ "path": "cz-conventional-changelog"}
echo '{ "path": "cz-conventional-changelog"}' > ~/.czrc
```

自定义文档格式,commit用中文去写（扩展）

```shell
# 1.下载
npm install -g cz-customizable
# 2. package.json 配置
...
    "config": {
        "commitizen": {
        "path": "node_modules/cz-customizable"
        },
            "cz-customizable": {
            "config": "./cz.config.js"
        }
    }
    
    # 也可以使用以下配置，配置全局变量
    echo '{ "path": "cz-customizable"}' > ~/.czrc
    # echo添加或vim编辑添加
    vim .czrc
# 添加配置 { "path": "cz-customizable"}

# 3.创建配置文件
touch ./cz.config.js
```

cz.config.js

```css
    module.exports = {
    //可选类型
        types: [
        { value: 'feat', name: 'feat:   新功能' },
        { value: 'fix', name: 'fix:   修复' },
        { value: 'docs', name: 'docs:   文档变更' },
        { value: 'style', name: 'style:   代码格式(不影响代码运行的变动)' },
            {
            value: 'refactor',
            name: 'refactor:重构(既不是增加feature)，也不是修复bug'
            },
            { value: 'perf', name: 'perf:   性能优化' },
            { value: 'test', name: 'test:   增加测试' },
            { value: 'chore', name: 'chore:   构建过程或辅助功能的变动' },
            { value: 'revert', name: 'revert:   回退' },
            { value: 'build', name: 'build:   打包' },
        { value: 'revert', name: 'revert:   回退' }
        ],
        //消息步骤
            messages: {
            type: '请选择提交类型',
            customScope: '请输入修改范围(可选)',
            subject: '请简要描述提交(必填)',
            body: '请输入详细描述(可选)',
            footer: '请输入要关闭的issue(可选)',
            confirmCommit: '确认以上信息提交?(y/n)'
            },
            //跳过问题
            skipQuestion: ['body', 'footer'],
            //subject文字长度默认是
            subjectLimit: 72
        }
```

gitmoji(趣味图标-扩展）

```r
npm i -g gitmoji-cli
gitmoji -c # git commit 提交
```

### Git hooks

Git 钩子（hooks）是在Git仓库中特定事件（certain points）触发后被调用的脚本

可以用git init初始化git文件，在.git/hooks下有各种钩子模版，可以用例如less prepare-commit-msg.sample查看文件，里面是一段执行脚本。

*   客户端钩子-> 由诸如提交和合并这样的操作所调用
*   服务端钩子-> 作用于诸如接收被推送的提交这样的联网操作

#### 客户端 Hooks

类型

详细介绍

prepare-commit-msg

commit message编辑器呼起前 default commit message创建后触发，常用于生成默认的标准化的提交说明

commit-msg

开发者编写完并确认commit message后触发，常用于校验提交说明是否标准

post-commit

整个git commit完成后触发，常用于邮件通知、提醒

applypatch-msg

git am提取补丁并 应用于当前分支后，准备提交触发，常用于执行测试用例或检查缓冲区代码

pre-applypatch

git am提交后触发，常用于通知、补丁、邮件推送回复（此钩子不能停止git am过程）

pre-rebase

执行git rebase命令时触发

post-rewrite

执行会替换commit的命令时触发，比如git rebase 或 git cimmit-amend

post-checkout

执行git checkout命令成功后触发，可用于生成特定文档，处理大二进制文件等

post-merge

成功完成一次merge行为后触发

pre-auto-gc

执行垃圾回收前触发

#### 服务端 Hooks

类型

详细介绍

pre-receive

当服务端收到一个push操作请求时触发，可用于检测push的内容

update

与pre-receive相似，但当一次push想更新多个分支时，pre-receive只执行一次，而此钩子会为没一分支都执行一次

post-receive

当整个push操作完成时触发，常用于服务侧同步、通知

### 项目使用

#### Git Husky

用node实现的的快速安装git hooks的工具

```json
// npm install husky --save-dev
// package.json
    {
        "husky" : {
            "hooks": {
            "pre-commit": "npm test",
            // ......
        }
    }
}
```

命令行 less .git/hooks/pre-commit 查看pre-commit文件，可以看见"(dirname"(dirname "(dirname"0")/husky.sh",然后可以查看less .git/hooks/husky.sh

#### link-staged

只会检测暂存区的文件，不会对所有的文件进行检测，也就是说我修改一个文件，只会检测当前这个文件

```bash
# 安装代码检测工具
npm install prettier eslint -D
# 安装lint-staged
npx mrm lint-staged
``````json
    {
        "gitHooks": {
        "pre-commit": "lint-staged"
        },
            {
                "lint-staged": {
                "*.js": "eslint --cache --fix",
                "*.{js,css,md}": "prettier --write"
            }
        }
```