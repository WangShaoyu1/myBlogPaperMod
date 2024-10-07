---
author: "前端下饭菜"
title: "这样的Git规范，Leader看了都说好！"
date: 2024-09-18
description: "最近刚入新项目，线上出了一个bug，Leader让排查。相关代码稍显复杂，想看看git历史记录获取些线索，打开GitGraph一看，当场石化，这不都是git规范的反面教材吗？"
tags: ["前端","JavaScript","代码规范"]
ShowReadingTime: "阅读11分钟"
weight: 366
---
最近刚入新项目，线上出了一个bug，Leader让排查。相关代码稍显复杂，想看看git历史记录获取些线索，打开`Git Graph`一看，当场石化，一堆像`task/10001`、`hotfix/0910`、`experimental/performance_web-worker`、`test1`、`test2`命名的分支，提交描述如`实现10001需求`、`修复线上bug`， 这不都是git规范的反面教材吗？作为一个`"砖家"`，我不得不写一篇Git规范，让组员看看什么叫`professional`。

代码规范往期介绍：

*   [浅读Vue3代码10万行，总结出30个代码规范](https://juejin.cn/post/7402811750771851275 "https://juejin.cn/post/7402811750771851275")
*   [200+收藏的Vue3规范，如何配置eslint、prettier、editorconfig](https://juejin.cn/post/7406891999376261146 "https://juejin.cn/post/7406891999376261146")
*   [Vue3黑神话:悟空版 eslint: eslint-plugin-wukong](https://juejin.cn/post/7409238250042982412 "https://juejin.cn/post/7409238250042982412")

为了缓解石化，看看开源项目的分支命名，看着是不是就比较规范？虽然分支格式有些差异，但都能看出分支要实现的功能或要解决的问题。

*   vue3分支: ![image.png](https://p3-juejin-sign.byteimg.com/tos-cn-i-k3u1fbpfcp/8348055c93da4c7a8c519510ce26e800~tplv-k3u1fbpfcp-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5LiL6aWt6I-c:q75.awebp?rk3s=f64ab15b&x-expires=1727830523&x-signature=r9rwB%2FKScJSePl1Azb4UYhLdewk%3D)
    
*   element-plus分支： ![image.png](https://p3-juejin-sign.byteimg.com/tos-cn-i-k3u1fbpfcp/29a39d51bd7c40a19c3cc9f0c3386517~tplv-k3u1fbpfcp-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5LiL6aWt6I-c:q75.awebp?rk3s=f64ab15b&x-expires=1727830523&x-signature=8W15UcQdX7WG6rRjh5SXOMLFi%2B4%3D)
    

分析这些开源项目的分支命名，不难发现，**`Git规范没有标准答案，只有适合、不适合。其目的是让项目分支保持风格统一， 提升易读性， 降低跟踪成本。`** 本篇内容将从分支流程、分支命名、commit、辅助工具等四个方面介绍。

分支开发规范
------

### workflow

当实现新功能或者解决线上问题时，需要创建对应的分支并开发，从开发到测试、发布、上线、问题修复等各个环节，如果没有合理的规范约束，当需要回退、急救问题修复或者跟踪排查时，将会让你事倍功半。对于分支开发规范，就以业界常用的git-flow工具来说，一个Feature从开始到上线结束需要经过如下的流程，element-plus也是采用这样的workflow。

![image.png](https://p3-juejin-sign.byteimg.com/tos-cn-i-k3u1fbpfcp/c7bbe029eaf14dc982928d7e67eab601~tplv-k3u1fbpfcp-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5LiL6aWt6I-c:q75.awebp?rk3s=f64ab15b&x-expires=1727830523&x-signature=i%2FzpVFKCU22N30HCoakvgsCcydM%3D)

**项目主要使用main、develop两个分支来记录git的历史**：main作为production的发布历史分支，例如上线时会基于main发布v0.1、v0.2；develop作为持续集成的分支，当功能分支feature开发完成后会merge到dev并提交测试流程。

![image.png](https://p3-juejin-sign.byteimg.com/tos-cn-i-k3u1fbpfcp/2a424fdd72e2413d9ac961e114b71afb~tplv-k3u1fbpfcp-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5LiL6aWt6I-c:q75.awebp?rk3s=f64ab15b&x-expires=1727830523&x-signature=r5E%2B15Zdo9y4KNux5ALTqXHkssE%3D)

develop分支功能测试完毕，准许进入预发阶段，需要依据develop分支创建一个发布阶段使用的release分支，为了能支持多个功能并行开发，release分支可命名为`release/0.1.0`。

**当预发阶段发现任何bug，直接在release分支上修改。当需要上线时，除了将release合并到main分支，特别要注意的是，还需要将其合并到develop，随时让develop保持最新代码。使用main发布正式版本的同时会打tag，如`v1.0`、`v2.0`。**

![image.png](https://p3-juejin-sign.byteimg.com/tos-cn-i-k3u1fbpfcp/b5e49c7ecb4f490fb75f4856142c3589~tplv-k3u1fbpfcp-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5LiL6aWt6I-c:q75.awebp?rk3s=f64ab15b&x-expires=1727830523&x-signature=ytPsjgfUCWYDuo5wp9KfVCoyaXM%3D)

如果遇到线上问题，**需要紧急解决，则直接从main拉取hotfix分支**，hotfix也是除了develop外还会从main拉取代码的分支。**当问题解决完了，需要将其同时merge到main和develop分支**。

### 辅助工具

问题：

*   **每一次上线，会创建feature、release、hotfix等分支，时间长了会不会有一大推历史分支？**
*   **这么一套流程，如果都手动创建分支，会不会太繁琐了？**

**这些问题完全可以丢给[git-flow](https://link.juejin.cn?target=https%3A%2F%2Fformulae.brew.sh%2Fformula%2Fgit-flow "https://formulae.brew.sh/formula/git-flow")、gitflow vscode extension解决**，可交互式创建feature、hotfix分支，开发人员只用关注需要创建的分支即可，流程控制可交给工具管理。

研发规模稍微大点的公司，一般都会有CI/CD，因此也可以将gitflow流程直接集成到CI/CD。

![image.png](https://p3-juejin-sign.byteimg.com/tos-cn-i-k3u1fbpfcp/f1bb82fb70f845c1bf7bb00da5f8883a~tplv-k3u1fbpfcp-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5LiL6aWt6I-c:q75.awebp?rk3s=f64ab15b&x-expires=1727830523&x-signature=3PuAF%2FD7ZLaKIO%2BK1%2FN2RcXMHkc%3D)

开源CI/CD平台：国内使用比较多的是`Jenkins`和`GitLab`

*   **Jenkins** Jenkins是开源CI/CD工具中的佼佼者，咱公司就在用
*   **GitLab CI** 开源免费，支持私有化部署
*   **GitHub Action** 优点是和GitHub集成，缺点是代码服务在国外，并且不支持私有化部署
*   **Tekton** 优势在于非常灵活，用户可以通过自定义 Task 来完成 Pipeline 的编写，但上手成本比较高

分支命名规范
------

### 通用分支命名

查看vue和element-plus分支，一般都有feat、fix、perf等作为分支前缀，业界通用的前缀有：

*   feat:新功能
*   fix: 问题修复
*   refactor: 涉及代码重构，一般和新功能、问题修复无关
*   perf: 和性能相关的改造，如perf/table用来优化table展示性能
*   chore: 构建或辅助工具调整，如`chore/upgrade-vite`

除此之外，部分开源项目也允许以人名作为前缀，例如`evan/fix-jsx-dom-augmentation`。

假如现在有新需求：实现一个支持无限加载的list组件，JIRA单号为1000，怎么命名分支？

*   可以是：feat/1000-list-dynamic-loading
*   也可以是：feat/1000\_list\_dynamic\_loading
*   还可以是：
    *   evan/feat-list-dynamic-loading-1000
    *   evan/feat\_list\_dynamic\_loading\_1000
*   如果没有Jira编号，则可以为：
    *   feat/list-dynamic-loading
    *   evan/feat-list-dynamic-loading。

个人觉得将人名作为前缀，分支名稍显冗长，不如以`feat`等type作为前缀来的直接、清晰，开发者信息完全可以根据提交记录跟踪。因此，**功能分支命名建议：以feat作为前缀，分支名由多个单词按确定性、重要性排列，由"-"分隔，不超过4个单词。例如`feat/1000-types-vnode-hooks`、`feat/v-model-dialog`**

上线后发现问题，测试人员提了bug，单号为2000, 问题是内容没有对齐，修复问题的分支如何命名？

*   以问题单号开头
    *   fix/2000-list-style-align
    *   fix/2000\_list\_style\_align
*   没有问题单号
    *   fix/list-style-align
    *   fix/list\_style\_align

虽然开源项目很多以人名作为前缀，但不建议，一方面冗长，另一方面不够直观，例如`evan/list-style-align`，如果加上单号和问题标识，则变为`evan/fix-list-style-align-2000`就稍显冗长。

因此，**问题类分支命名建议：以fix作为前缀，分支名由多个单词按问题范围从小到大的单词排列，由`-`分隔，不超过4个单词。例如`fix/2000-menu-default-opened`、`fix/eslint-config-vnode`。**

list用了一段时间，leader提出优化list，降低内存占用，**性能优化分支如何命名？**

*   perf/list-memory-occupation
*   perf/list\_memory\_occupation
*   evan/perf-list-memory-occupation

**性能相关分支命名建议：以perf作为前缀，分支名由多个单词按模块(page、list、table等)、性能类型(loading、render、momory等)、优化方向进行排列。例如`perf/page-render-by-skeleton`、`perf/table-loading-lazy`。**

当项目开发到前中期、模块越来越多，需要把项目拆成多包模式，**重构分支如何命名？**

*   refactor/packages
*   refactor/modules-to-packages

**重构分支命名建议：如果是对模块或组件重构，一般表明影响面即可。例如`refactor/select`、`refactor/docs-style-update`、`refactor/ast`。**

除了以上新功能、问题修复、性能优化这些方面，**其他的改动都可归属到chore类型分支，chore本身就代表琐碎、杂事。例如`chore/eslint-upgrade`、`chore/vitest-ugrade`、`chore/eslint-imports`。**

分支命名最重要不适非的限制使用哪一套方式，整体保持一致就行，不能像以下这样混着用：

*   feat/1000-table-component
*   feat/2000\_page-loading-lazy
*   fix-list-style-align-3000
*   perf/list\_memory\_occupation

### 辅助工具

**辅助工具：[validate-branch-name](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FJsonMa%2Fvalidate-branch-name%2Fblob%2Fmaster%2FREADME.md "https://github.com/JsonMa/validate-branch-name/blob/master/README.md")**，用于校验分支命名。

css

 代码解读

复制代码

`npm i validate-branch-name -g`

在`.husky`(装可参考下文的`commit规范`)下定义pre-commit文件,并添加如下内容：

bash

 代码解读

复制代码

`#!/bin/sh . "$(dirname "$0")/_/husky.sh" # validate branch name before commit npx validate-branch-name` 

在`package.json`文件添加内容：

json

 代码解读

复制代码

  `"validate-branch-name": {     "pattern": "^(master|main|develop){1}$|^(feat|fix|hotfix|release|perf|refactor|chore)/.+$",     "errorMsg": "分支命名不规范，请修正!"   }`

假如提交分支`test-vueuse`代码，执行`git commit -m 'feat:添加vueuse测试用例'`，则会报错：

![image.png](https://p3-juejin-sign.byteimg.com/tos-cn-i-k3u1fbpfcp/af25c59c10d2489c946ca46650bb39bb~tplv-k3u1fbpfcp-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5LiL6aWt6I-c:q75.awebp?rk3s=f64ab15b&x-expires=1727830523&x-signature=sru7dbDaCT16szry87Mwq7ILSIg%3D)

可执行`git branch -m branchName`修改分支命名，再重新提交。

commit规范
--------

代码提交规范和分支命名相关联，但比分支命名分的更加明细，大多数开源框架都采用angular.js指定的提交格式，类型包含：

*   **feat**: 新功能
*   **fix**: 问题修复
*   **docs**: 文档更新
*   **style**: 代码风格修改，例如空格处理、格式化、添加分号等等
*   **refactor**: 新功能和问题修复除外的，代码结构、逻辑调整
*   **perf**: 性能优化
*   **test**: 增加或修复测试用例
*   **chore**: 像构建脚本、辅助工具、文档生成等工程相关代码提交

代码提交信息一般由多个部分组成，分别是Type、Scope、Subject、Body、Footer, 先看下开源项目提交案例：

*   包含Type、Scope、Subject、Footer ![image.png](https://p3-juejin-sign.byteimg.com/tos-cn-i-k3u1fbpfcp/b80d73aecef24f16a4718f9e8f4c0d07~tplv-k3u1fbpfcp-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5LiL6aWt6I-c:q75.awebp?rk3s=f64ab15b&x-expires=1727830523&x-signature=VeOs7dhSqt2K7c%2FGqRDROm%2BZLsY%3D)
    
*   包含Type、Scope、Subject、Body ![image.png](https://p3-juejin-sign.byteimg.com/tos-cn-i-k3u1fbpfcp/8263c36e762e46f3a11733e18f2ea605~tplv-k3u1fbpfcp-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5LiL6aWt6I-c:q75.awebp?rk3s=f64ab15b&x-expires=1727830523&x-signature=x1p6bHrxixOinTpMbvm17sOWb2w%3D)
    

结合上面两个案例，再来理解这几部分的含义：

*   Type：确认提交类型，如新功能feat、问题修复fix
*   Scope: 影响的package、module或者component，例如`feat(compiler-doem)`、`fix(table)`
*   Subject: 提交标题，angular.js提交规则默认限制字符长度为20，建议调整到能包括主旨的长度，而不是再拆分到Body中。
*   Body：可选填，一般都不需要填写该部分，除非像上述案例，把几次内容合并提交了，在Body下标注历史提交记录。
*   Footer：开源项目使用的比较多，如果修复并提交别人提的issues，则会在Footer部分附加对应的单号，例如`close #11873`，github在关联issue时，可自动添加Footer信息。

所以，需要人添加的部分一般为Type、Scope、Subject即可，例如：

perl

 代码解读

复制代码

``feat(components): [dialog] Dialog can drag overflow the viewport (#15643) feat(components): [table] add `filterClassName` props in TableColumn (#15389) test(components): [select-v2] backspace should not delete disabled tag (#15552) refactor(components): [drawer] use setup (#15556) perf( runtime-core): use `apply` to avoid spreading. (#5985) style(components): [menu] Collapse mode active color (#15343) chore: update email link in SECURITY.md (#11632) [ci skip]``

当修改多包模式下的组件时，可通过`Type(package):[componentName] XXXX`形式提交信息，例如`feat(components):[table] add header filter props`。

### 辅助工具

如果完全让人自觉遵守commit规则，这非常不现实，所以还得借助工具提供交互式和校验，如husky、commitizen、git-commit-plugin相关工具打组合拳。

1.  **husky: 作为git hooks，能在git的多个环节添加脚本**

husky安装：

csharp

 代码解读

复制代码

`npx husky-init && npm install`

2\. 安装`validate-branch-name`,在pre-commit添加执行命令。

sql

 代码解读

复制代码

`npm install validate-branch-name --save-dev   npx husky add .husky/pre-commit "npx validate-branch-name"`

在`package.json`文件添加内容：

json

 代码解读

复制代码

  `"validate-branch-name": {     "pattern": "^(master|main|develop){1}$|^(feat|fix|hotfix|release|perf|refactor|chore)/.+$",     "errorMsg": "分支命名不规范，请修正!"   }`

3.安装commitizen

css

 代码解读

复制代码

`npm install commitizen --save-dev`

使用`cz-conventional-changelog`提供交互描述信息

css

 代码解读

复制代码

`commitizen init cz-conventional-changelog --save-dev --save-exact`

安装完后，可执行`cz`、`cz commit`、`git cz`等指令唤起交互式。

4.  安装commitlint

sql

 代码解读

复制代码

`npm install @commitlint/config-conventional @commitlint/cli --save-dev`

在项目根目录下新建文件`commitlint.config.js`,并添加如下内容：

css

 代码解读

复制代码

`module.exports = {     extends: ['@commitlint/config-conventional'],     parserPreset: {       parserOpts: {         issuePrefixes: ['#'],       },     }   }`

**可根据自身需求来配置Type、Scope等信息，配置详情查看[commitlint docs](https://link.juejin.cn?target=https%3A%2F%2Fcommitlint.js.org%2F%23%2Freference-configuration "https://commitlint.js.org/#/reference-configuration")**

执行如下指令，在commit-msg文件添加校验指令。

sql

 代码解读

复制代码

`npx husky add .husky/commit-msg 'npx --no -- commitlint --edit $1'`

通过上述的配置，当执行`git commit`时，先使用`validate-branch-name`检查分支名，再弹出git message交互模式。

![image.png](https://p3-juejin-sign.byteimg.com/tos-cn-i-k3u1fbpfcp/6c4987f6eba047fa891c23c4cd82f213~tplv-k3u1fbpfcp-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5LiL6aWt6I-c:q75.awebp?rk3s=f64ab15b&x-expires=1727830523&x-signature=LClF8M343e80XSAiU5Q2K3JafP8%3D)

5.  git commit唤起交互式，需要在`prepare-commit-msg`添加如下内容：

bash

 代码解读

复制代码

`#!/usr/bin/env sh . "$(dirname -- "$0")/_/husky.sh" exec < /dev/tty && npx cz --hook || true`

总结
--

git规范主要覆盖workflow、branch naming、branch commit三个环节：

*   workflow：可借助git-flow工具将分支流程串联起来，开发人员聚焦分支功能实现，目前有Jenkins、Gitlab CI等开源平台将git-flow集成到自动化流程中。
*   branch naming: 可使用validate-branch-name工具，并配置匹配规则，保证分支命名符合规则。
*   branch commit: 依赖于git hooks的husky工具，使用commitizen、commitlint来提供commit交互和验证。

**要说git规范的作用，虽然决定不了你的上限，但完全能拉低你的技术影响力。** 好的git规范不仅让人看起来赏心悦目，在排查紧急问题时也能达到事半功倍的效果。

参考
--

1.  [Git Branching Naming Convention: Best Practices](https://link.juejin.cn?target=https%3A%2F%2Fcodingsight.com%2Fgit-branching-naming-convention-best-practices%2F "https://codingsight.com/git-branching-naming-convention-best-practices/")
2.  [Git Commit Guidelines](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fangular%2Fangular.js%2Fblob%2Fmaster%2FDEVELOPERS.md%23-git-commit-guidelines "https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines")
3.  [What is Gitflow](https://link.juejin.cn?target=https%3A%2F%2Fwww.atlassian.com%2Fgit%2Ftutorials%2Fcomparing-workflows%2Fgitflow-workflow "https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow")
4.  [How to use the latest Husky 8 with Commitizen](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2F%40rahgurung%2Fhow-to-use-the-latest-husky-8-with-commitizen-for-adding-git-hooks-to-your-projects-18227e477411 "https://medium.com/@rahgurung/how-to-use-the-latest-husky-8-with-commitizen-for-adding-git-hooks-to-your-projects-18227e477411")

> 我是`前端下饭菜`，原创不易，各位看官动动手，帮忙关注、点赞、收藏、评轮！