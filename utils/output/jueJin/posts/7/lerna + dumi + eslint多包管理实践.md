---
author: "徐小夕"
title: "lerna + dumi + eslint多包管理实践"
date: 2021-10-05
description: "在开发大型项目时, 我们通常会遇到同一工程依赖不同组件包, 同时不同的组件包之间还会相互依赖的问题, 那么如何管理组织这些依赖包就是一个迫在眉睫的问题"
tags: ["前端","JavaScript","代码规范中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:52,comments:0,collects:53,views:6683,"
---
背景
--

在开发大型项目时, 我们通常会遇到同一工程依赖不同组件包, 同时不同的组件包之间还会相互依赖的问题, 那么如何管理组织这些依赖包就是一个迫在眉睫的问题.

![image.png](/images/jueJin/aa2cb76d4c2d480.png)

我们目前已有的方案有: **Multirepo**(多个依赖包独立进行git管理) 和 **Monorepo**(所有依赖库完全放入一个项目工程).

**Multirepo**的缺点在于每个库变更之后，需要发布到线上，然后在项目中重新安装, 打包, 发布, 最后才能更新，这样如果依赖关系越复杂就越难以维护。**Monorepo**最大的缺点就是不便于代码的复用和共享。

为了解决上述的问题, **lerna** 这款工具诞生了, 它可以方便的管理具有多个包的 **JavaScript** 项目。同时对于组件包的开发者和维护者, 为了让团队其他成员更好的理解和使用我们开发的组件, 搭建组件文档和 **demo** 就显得格外重要.

![image.png](/images/jueJin/21cb6697aebd4f3.png)

我们对以上提到的几点问题做一个总结:

*   大型项目中如何管理组织依赖包及其版本问题
*   如何高效低成本的搭建简单易用的组件文档
*   如何配置eslint代码规范和代码提交规范

接下来我将针对以上问题一一来给出解答. 如果大家想看实际的案例, 可以参考:

*   [best-cps | 基于lerna + dumi搭建的多包管理实践](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fbest-cps "https://github.com/MrXujiang/best-cps")

大型项目中如何管理组织依赖包及其版本问题
--------------------

这个问题主要用我上面的提到的 **lerna** 工具来解决. 目前我们比较熟悉的 **babel**, **create-react-app**, **vue-cli** 等都使用了 **lerna**.

在没使用 **lerna** 时, 我们不同库的组织形式可能如下:

![image.png](/images/jueJin/78f2923cf0f8460.png)

使用 **lerna** 之后的库组织结构:

![image.png](/images/jueJin/165f9e765a7547c.png)

以上两个是我做的简图, 基本可以对比出使用 **lerna** 前后的差异, **lerna** 的作用是把多个项目或模块拆分为多个 **packages** 放入一个git仓库进行管理。我们可以使用它提供的命令轻松的对不同项目进行管理 , 如下:

*   lerna boostrap 自动解决packages之间的依赖关系，对于packages内部的依赖会直接采用symlink的方式关联
*   lerna publish 依赖git检测文件改动，自动发布，管理版本号
*   lerna create 创建一个 lerna 管理的package包
*   lerna clean 删除所有包下面的node\_modules目录，也可以删除指定包下面的node\_modules

同时 **lerna** 还会根据 git 提交记录，自动生成 changelog. 当然 **lerna** 还提供了很多有用的命令, 大家感兴趣可以在官网学习.

接下来我就带大家从零搭建一个使用 lerna 管理的多包项目.

![image.png](/images/jueJin/3caf94f30dea418.png)

上图是我们包的依赖关系, 首先我们需要全局安装一下 lerna.

### 项目初始化

```bash
$ git init best-cps && cd best-cps
$ lerna init
```

### 创建三个 package

```bash
$ lerna create LibA && lerna create LibB && lerna create BaseUI
```

创建的每个包的目录结构如下:

LibA  
├─ **tests**  
│ └─ dooring.test.js  
├─ lib  
│ └─ dooring.js  
├─ README.md  
└─ package.json

### 安装对应包的依赖

由上文展示的3个包的依赖关系, 我们需要针对性的安装, 如下:

```bash
$ lerna add LibA --scope=LibB
```

因为 LibB 依赖 LibA, 所以我们使用 lerna add 时可以通过 --scope 来指定安装范围. 再比如 BaseUI 同时依赖LibA, LibB 两个包, 我们可以使用如下命令:

```bash
$ lerna add LibA LibB --scope=BaseUI
```

剩下的我们都可以按照上述的方式进行, 当我们编写完对应包的代码后, 我们还可以使用:

```bash
$ lerna publish
```

一键将包发布到 npm 上, 此处根据我们选择的管理模式不同，所有 packages 的版本号都会根据lerna.json中的版本号进行更新。但我们需要注意的是 lerna 版本更新支持两种模式:

*   固定/锁定模式(默认, 指定版本号)

这种模式自动将所有 packages 包版本捆绑在一起，对任何其中一个或者多个 packages 进行重大改动都会导致所有 packages 的版本号进行更新。

*   独立模式(independent)

独立模式，init的时候需要设置选项--independent。这种模式允许使用者对每个package单独改变版本号。每次执行lerna publish的时候，针对所有有更新的package，会逐个询问需要升级的版本号，基准版本为它自身的package.json里面的版本号。这种情况下，lerna.json的版本号不会变化， 默认为independent。 我们可以在 lerna 初始化时指定:

```bash
lerna init --independent
```

具体的案例可以参考: [github.com/MrXujiang/b…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fbest-cps "https://github.com/MrXujiang/best-cps")

如何高效低成本的搭建简单易用的组件文档
-------------------

对于组件文档, 市面上也有很多开源的工具, 比如 vue-press, storybook, docz等, 因为我最近的项目多为 react, 这里我使用的是 dumi. 之前在分享实现滑动验证码组件的时候已经和大家分享的 dumi的使用, 大家可以参考我之前的文章:

*   [从零开发一款轻量级滑动验证码插件](https://juejin.cn/post/7007615666609979400 "https://juejin.cn/post/7007615666609979400")

以下是在 lerna 项目中集成 dumi 后的文档站点效果:

![image.png](/images/jueJin/7e53ba9ae0634a7.png)

如何配置eslint代码规范和代码提交规范
---------------------

eslint 代码规范我想每个朋友都不陌生, 我们只需要安装对应的插件并编写对应规则的配置文件即可, 这里举一个简单的例子:

```js
// .eslintrc.js
    module.exports = {
    extends: [require.resolve('@umijs/fabric/dist/eslint')],
        rules: {
        'import/no-extraneous-dependencies': 0,
        'import/no-unresolved': 0,
        },
        };
```

配置好之后我们需要设置检测时机, 比如说时运行时检测还是提交时检测, 由于个人习惯和效率问题, 我采用了提交时检测, 也就是当开发者功能开发完成, 执行 git commit 的时候进行检测, 我们可以利用 githook 来做预提交检测, 这里需要在 package.json 文件中添加如下命令:

```js
    "gitHooks": {
    "pre-commit": "npm run lint:js"
    },
```

配置好之后我们随便写一行不合规范的代码, 然后提交, 终端会显示如下信息:

![image.png](/images/jueJin/46f03b94b52b435.png)

从控制台可以发现代码不合规范的位置和原因, 如果我们没有做出调整, 代码就无法提交, 通过这样的方式可以提高代码质量和出错概率, 非常有长远价值.

同时上面提到了 githooks, 对于 githooks 的知识也非常有意思, 它可以帮我们在代码提交的不同阶段进行自定义操作, 比如代码提交前的检测, 代码提交信息规范等进行校验, 常用的 gtihooks 有:

*   pre-commit
*   prepare-commit-msg
*   commit-msg
*   post-commit
*   pre-rebase
*   post-merge
*   pre-receive
*   update

大家感兴趣的可以访问 [githooks.com](https://link.juejin.cn?target=https%3A%2F%2Fgithooks.com "https://githooks.com") 获取更多有关 githooks的内容.

对于代码提交规范, 我们也需要做统一管理, 这样能让团队更直观的知道每一次提交的内容是什么, 尤其是多人协作的时候. 以下是几个常见的提交不规范的例子:

```sql
git commit -m '添加弹窗'
git commit -m ':update 更新'
git commit -m 'fix 修复一个bug'
```

之所以会存在以上提交格式不统一或者提交信息难懂的问题, 都是因为缺少了规范的制约, 所以说对于大型项目或者多人协作的项目, 最好还是统一规范, 这样能提前避免很多不必要的麻烦.

要想实现对工程师提交信息的检测, 需要用到 commit-msg 这个 githooks, 具体配置如下:

```js
    "gitHooks": {
    "pre-commit": "npm run lint:js",
    "commit-msg": "node ./commitlint.js verify-commit"
}
```

剩下的就是 commitlint.js 做的事情了, 它是我编写的一个 nodejs 脚本, 用来检测用户提交的信息是否规范, 当然大家也可以基于这个脚本定义自己的提交规范, 具体效果如下:

![image.png](/images/jueJin/fede6b5d80904b6.png)

我们可以看到, 当我们提交了一个不符合规范的信息之后, 终端控制台会打印如下提示信息并终止程序继续进行.

通过以上的配置, 团队不同成员的写的代码和提交信息都会非常统一和规范, 项目整体的质量也会得到一定的提升.

最后
--

如果大家对可视化搭建或者低代码/零代码感兴趣，也可以参考我往期的文章或者在评论区交流你的想法和心得，欢迎一起探索前端真正的技术。

更多推荐
----

*   [从零开发一款轻量级滑动验证码插件](https://juejin.cn/post/7007615666609979400 "https://juejin.cn/post/7007615666609979400")
*   [如何设计可视化搭建平台的组件商店？](https://juejin.cn/post/6986824393653485605 "https://juejin.cn/post/6986824393653485605")
*   [从零设计可视化大屏搭建引擎](https://juejin.cn/post/6981257575425654792 "https://juejin.cn/post/6981257575425654792")
*   [从零使用electron搭建桌面端可视化编辑器Dooring](https://juejin.cn/post/6976476731662139428 "https://juejin.cn/post/6976476731662139428")
*   [(低代码)可视化搭建平台数据源设计剖析](https://juejin.cn/post/6973946702235615269 "https://juejin.cn/post/6973946702235615269")
*   [从零搭建一款PC页面编辑器PC-Dooring](https://juejin.cn/post/6950075140906418213 "https://juejin.cn/post/6950075140906418213")
*   [如何搭积木式的快速开发H5页面?](https://juejin.cn/post/6904878119724056584 "https://juejin.cn/post/6904878119724056584")