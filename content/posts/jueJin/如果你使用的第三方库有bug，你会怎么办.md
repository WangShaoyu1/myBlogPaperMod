---
author: "_志哥_"
title: "如果你使用的第三方库有bug，你会怎么办"
date: 2024-09-27
description: "早上好，中午好，晚上好在当今的前端工程化领域，第三方库的使用已经成为标配。然而，不可避免的是，这些库可能会存在bug，或者是库的一些功能并不能满足需要，需要修改库的某个功能，或添加功能。当遇到这种情"
tags: ["前端","面试","JavaScript"]
ShowReadingTime: "阅读7分钟"
weight: 359
---
### 早上好，中午好，晚上好

在当今的前端工程化领域，第三方库的使用已经成为标配。然而，不可避免的是，这些库可能会存在bug，或者是库的一些功能并不能满足需要，需要修改库的某个功能，或添加功能。当遇到这种情况时，我们应该如何应对？本文将介绍三种解决第三方库bug的方法，并重点介绍使用`patch-package`库来修复bug的全过程。

### 方法一：提issues给第三方库的作者，让作者修复

这个方式是比较常见的解决方式了，但有几个缺点：

*   库作者不维护这个库了，那提issues自然就没有人close了，gg
*   库作者很忙，或者项目缺乏活跃的贡献者，导致问题可能长时间都不懂响应，那如果你这个项目很急的话，那gg
*   bug或者功能的优先级不高，库作者先解决其他高优先级的，或者他不接受你的建议或者及时修复问题，那gg
*   还有可能出现的沟通成本，以确保库作者完全理解了问题的本质和重要性。

那如果库作者很勤奋，每天都在维护，对issues的问题，都满怀热情的进行解决，那我们可以按照以下流程进行提issues：

1.  **发现bug**：在使用第三方库时，发现了一个bug。
2.  **复现bug**：在本地环境中尝试复现该bug，并记录详细的复现步骤。
3.  **提交issues**：访问第三方库的GitHub仓库，点击“New issue”按钮，填写以下信息：
    *   标题：简洁地描述bug现象。
    *   描述：详细描述bug的复现步骤、预期结果和实际结果。
    *   环境：列出你的操作系统、浏览器版本、库的版本等信息。
4.  **等待回复**：作者可能会要求你提供更多信息，或者告诉你解决方案。耐心等待并积极配合。nice

### 方法二：fork第三方库，修复好bug后，发布到npm，项目下载自己发布的npm包

这个方式也有局限性：

1.  **维护负担**：一旦你fork了库，你需要负责维护这个分支，包括合并上游的更新和修复新出现的bug。
2.  **长期兼容性**：随着时间的推移，原库和新fork的库可能会出现分歧，使得合并更新变得更加困难。
3.  **版本管理**：需要管理自己发布的npm包版本，确保它与其他依赖的兼容性。
4.  **社区隔离**：使用自己的fork可能会减少与原社区的合作机会，错过原库的其他改进和特性。

那如果你觉得这个方式很不错，那最佳实践是这样的：

#### 步骤 1: Fork 原始库

1.  访问原始库的GitHub页面。
2.  点击页面上的“Fork”按钮，将库复制到你的GitHub账户下。

#### 步骤 2: 克隆你的Fork

js

 代码解读

复制代码

`git clone https://github.com/your-username/original-repo.git cd original-repo`

#### 步骤 3: 设置上游仓库

js

 代码解读

复制代码

`git remote add upstream https://github.com/original-owner/original-repo.git`

这样当作者更新维护库的时候，可以获取上游仓库的最新更新。

#### 步骤 4: 创建特性分支

js

 代码解读

复制代码

`git checkout -b fix-bug-branch`

#### 步骤 5: 修复Bug

在这个分支上，进行必要的代码更改来修复bug。

#### 步骤 6: 测试更改

在本地环境中测试你的更改，确保修复了bug并且没有引入新的问题。

#### 步骤 7: 提交并推送更改

js

 代码解读

复制代码

`git add . git commit -m "Fix bug description" git push origin fix-bug-branch`

#### 步骤 8: 创建Pull Request（可选）

如果你希望原始库接受你的修复，可以向上游仓库创建一个Pull Request。

#### 步骤 9: 发布到NPM

如果原始库没有接受你的PR，或者你需要立即使用修复，可以发布到NPM：

1.  登录到NPM。

js

 代码解读

复制代码

`npm login`

这个地方有个**坑点**，就是你使用了npm镜像需要将镜像更改为npm官方仓库：

js

 代码解读

复制代码

`npm config set registry https://registry.npmjs.org`

2.  修改`package.json`中的名称，避免与原始库冲突，例如添加你的用户名前缀。

js

 代码解读

复制代码

`{   "name": "@your-username/original-repo",   // ... }`

3.  更新版本号。

bash

 代码解读

复制代码

`npm version patch`

4.  发布到NPM。

js

 代码解读

复制代码

`npm publish`

#### 步骤 10: 在你的项目中使用Forked库

在你的项目`package.json`中，将依赖项更改为你的forked版本。

js

 代码解读

复制代码

`{   "dependencies": {     "original-repo": "^1.0.0",     "@your-username/original-repo": "1.0.1"   } }`

#### 步骤 11: 维护你的Fork

定期从上游仓库合并更新到你的fork，以保持与原始库的同步。

js

 代码解读

复制代码

`git checkout master git pull upstream master git push origin master`

#### 最佳实践总结

*   保持与上游仓库的同步。
*   清晰地记录你的更改和发布。
*   为你的fork创建文档，说明它与原始库的区别。
*   考虑长期维护策略，如果可能，尽量回归到官方版本。

### 方法三：使用patch-package库来修复

`patch-package` 是一个非常有用的 npm 包，它允许我们在没有修改原始 npm 依赖包的情况下，对 npm 依赖进行修复或自定义。这在以下场景中特别有用：

*   当你发现一个第三方库的 bug，但作者还没有修复它，或者修复后的版本尚未发布。
*   当你需要对第三方库进行微小的定制，而不想维护一个完整的分支或分叉。

#### patch-package 的工作原理

`patch-package` 的工作流程通常如下：

1.  修改 `node_modules` 中的依赖包文件。
2.  运行 `patch-package` 命令，它会生成一个补丁文件，通常是 `.patch` 文件，保存在项目根目录下的 `patches` 文件夹中。
3.  在 `package.json` 的 `scripts` 部分添加一个脚本来应用这些补丁，通常是在 `postinstall` 阶段。
4.  将生成的 `.patch` 文件提交到版本控制系统中。
5.  当其他开发者运行 `npm install` 或 `yarn` 安装依赖时，或者 CI/CD 系统构建项目时，这些补丁会被自动应用。

**但使用这种方式也有前提**：

**1\. 潜在冲突**：如果第三方库的官方更新解决了相同的bug，但采用了不同的方法，那么你的补丁可能会与这些更新冲突

**2\. 库没有源码**：这种方式是在node\_modules里对应的包进行修改，如果包是压缩后的，那就没办法改了，所以只能针对node\_modules里的包有源码的情况下。

**最佳实践：**

#### 步骤 1：安装patch-package postinstall-postinstall

`postinstall-postinstall`，作用是 `postinstall` 脚本在 Yarn 安装过程中运行。

js

 代码解读

复制代码

`yarn add patch-package postinstall-postinstall --dev`

#### 步骤 2：配置 package.json

在你的 `package.json` 文件中，添加一个 `postinstall` 脚本来确保在安装依赖后应用补丁：

json

 代码解读

复制代码

`"scripts": {   "postinstall": "patch-package" }`

#### 步骤 3：修复依赖包中的 bug

假如vue3有个bug，我们直接在 `node_modules/vue/xxx` 中修复这个 bug。

#### 步骤 4：创建补丁

修复完成后，我们运行以下命令来生成补丁：

bash

 代码解读

复制代码

`npx patch-package example-lib`

这会在项目根目录下创建一个 `patches` 文件夹，并在其中生成一个名为 `vue+3.4.29.patch` 的文件（假设vue当前库的版本是3.4.29）。

#### 步骤 5：提交补丁文件到代码库中

现在，我们将 `patches` 文件夹和里面的 `.patch` 文件提交到版本控制系统中。

bash

 代码解读

复制代码

`git add patches/example-lib+1.0.0.patch git commit -m "Add patch for vue3.4.29" git push`

#### 步骤 6：安装依赖并应用补丁

就是其他同事在下载项目或者更新依赖后，`postinstall` 脚本会自动运行，并应用补丁。

bash

 代码解读

复制代码

`npm install # 或者 yarn install`

当 `npm install` 或 `yarn install` 完成后，`patch-package` 会自动检测 `patches` 文件夹中的补丁，并将其应用到对应的依赖上。

### 志哥我想说

遇到第三方库的bug时，我们可以选择提issues、fork并发布自己的npm包，或者使用`patch-package`进行本地修复。当然你还可以有：

*   使用替代库
*   社区支持

每种方法都有其适用场景，根据实际情况选择最合适的方法。希望本文能帮助你更好地应对第三方库的bug问题，或者`面试`或者`技术分享`等。