---
author: "杨成功"
title: "现代配置指南——YAML比JSON高级在哪？"
date: 2021-12-13
description: "新技术/新框架都是齐刷刷的Yaml配置，你还不了解它吗？本文对比Json详解Yaml文件，让你一文看懂Yaml语法的高级之处～"
tags: ["JavaScript","JSON","前端"]
ShowReadingTime: "阅读8分钟"
weight: 756
---
一直以来，前端工程中的配置大多都是 `.js` 文件或者 `.json` 文件，最常见的比如：

*   package.json
*   babel.config.js
*   webpack.config.js

这些配置对前端非常友好，因为都是我们熟悉的 JS 对象结构。一般静态化的配置会选择 json 文件，而动态化的配置，涉及到引入其他模块，因此会选择 js 文件。

还有现在许多新工具同时支持多种配置，比如 `Eslint`，两种格式的配置任你选择：

*   .eslintrc.json
*   .eslintrc.js

后来不知道什么时候，突然出现了一种以 `.yaml` 或 `.yml` 为后缀的配置文件。一开始以为是某个程序的专有配置，后来发现这个后缀的文件出现的频率越来越高，甚至 Eslint 也支持了第三种格式的配置 `.eslintrc.yml`。

既然遇到了，那就探索它！

下面我们从 YAML 的**出现背景**，**使用场景**，**具体用法**，**高级操作**四个方面，看一下这个流行的现代化配置的神秘之处。

出现背景
----

一个新工具的出现避免不了有两个原因：

1.  旧工具在某些场景表现吃力，需要更优的替代方案
2.  旧工具也没什么不好，只是新工具出现，比较而言显得它不太好

YAML 这种新工具就属于后者。其实在 yaml 出现之前 `js+json` 用的也不错，也没什么特别难以处理的问题；但是 yaml 出现以后，开始觉得它好乱呀什么东西，后来了解它后，越用越喜欢，一个字就是优雅。

很多文章说选择 yaml 是因为 json 的各种问题，json 不适合做配置文件，这我觉得有些言过其实了。我更愿意将 yaml 看做是 json 的升级，因为 yaml 在格式简化和体验上表现确实不错，这个得承认。

下面我们对比 YAML 和 JSON，从两方面分析：

### 精简了什么？

JSON 比较繁琐的地方是它严格的格式要求。比如这个对象：

javascript

 代码解读

复制代码

`{   name: 'ruims' }`

在 JSON 中以下写法通通都是错的：

javascript

 代码解读

复制代码

`// key 没引号不行 {   name: 'ruims' } // key 不是 "" 号不行 {   'name': 'ruims' } // value 不是 "" 号不行 {   "name": 'ruims' }`

字符串的值必须 k->v 都是 `""` 才行：

json

 代码解读

复制代码

`// 只能这样 {   "name": "ruims" }`

虽然是统一格式，但是使用上确实有不便利的地方。比如我在浏览器上测出了接口错误。然后把参数拷贝到 Postman 里调试，这时就我要手动给每个属性和值加 **""** 号，非常繁琐。

YAML 则是另辟蹊径，直接把字符串符号干掉了。上面对象的同等 yaml 配置如下：

yaml

 代码解读

复制代码

`name: ruims`

没错，就这么简单！

除了 `""` 号，yaml 觉得 `{}` 和 `[]` 这种符号也是多余的，不如一起干掉。

于是呢，以这个对象数组为例：

json

 代码解读

复制代码

`{   "names": [{ "name": "ruims" }, { "name": "ruidoc" }] }`

转换成 yaml 是这样的：

yaml

 代码解读

复制代码

`names:   - name: ruims   - name: ruidoc`

对比一下这个精简程度，有什么理由不爱它？

### 增加了什么？

说起增加的部分，最值得一提的，是 YAML 支持了 `注释`。

用 JSON 写配置是不能有注释的，这就意味着我们的配置不会有备注，配置多了会非常凌乱，这是最不人性化的地方。

现在 yaml 支持了备注，以后配置可以是这样的：

yaml

 代码解读

复制代码

`# 应用名称 name: my_app # 应用端口 port: 8080`

把这种配置丢给新同事，还怕他看不懂配了啥吗？

除注释外，还支持配置复用的相关功能，这个后面说。

使用场景
----

我接触的第一个 yaml 配置是 Flutter 项目的包管理文件 `pubspec.yaml`，这个文件的作用和前端项目中的 `package.json` 一样，用于存放一些全局配置和应用依赖的包和版本。

看一下它的基本结构：

yaml

 代码解读

复制代码

`name: flutter_demo description: A new Flutter project. publish_to: 'none' version: 1.0.0 dependencies:   cupertino_icons: ^1.0.2 dev_dependencies:   flutter_lints: ^1.0.0`

你看这个结构和 `package.json` 是不是基本一致？`dependencies` 下列出应用依赖和版本，`dev_dependencies` 下的则是开发依赖。

后来在做 CI/CD 自动化部署的时候，我们用到了 [GitHub Action](https://link.juejin.cn?target=https%3A%2F%2Fdocs.github.com%2Fen%2Factions%2Fquickstart "https://docs.github.com/en/actions/quickstart")。它需要多个 yaml 文件来定义不同的工作流，这个配置可比 flutter 复杂的多。

其实不光 GitHub Action，其他流行的类似的构建工具如 [GitLab CI/CD](https://link.juejin.cn?target=https%3A%2F%2Fdocs.gitlab.com%2Fee%2Fci%2F "https://docs.gitlab.com/ee/ci/")，[circleci](https://link.juejin.cn?target=https%3A%2F%2Fcircleci.com%2Fdeveloper "https://circleci.com/developer")，全部都是齐刷刷的 yaml 配置，因此如果你的项目要做 CI/CD 持续集成，不懂 yaml 语法肯定是不行的。

还有，接触过 Docker 的同学肯定知道 Docker Compose，它是 Docker 官方的单机编排工具，其配置文件 `docker-compose.yml` 也是妥妥的 yaml 格式。现在 Docker 正是如日中天的时候，使用 Docker 必然免不了编排，因此 yaml 语法早晚也要攻克。

上面说的这 3 个案例，几乎都是现代最新最流行的框架/工具。从它们身上可以看出来，yaml 必然是下一代配置文件的标准，并且是**前端-后端-运维**的通用标准。

说了这么多，你跃跃欲试了吗？下面我们详细介绍 yaml 语法。

YAML 语法
-------

介绍 yaml 语法会对比 json 解释，以便我们快速理解。

先看一下 yaml 的几个特点：

*   大小写敏感
*   使用缩进表示层级关系
*   缩进空格数不强制，但相同层级要对齐
*   `#` 表示注释

相比于 JSON 来说，最大的区别是用 `缩进` 来表示层级，这个和 Python 非常接近。还有强化的一点是支持了注释，JSON 默认是不支持的（虽然 TS 支持），这也对配置文件非常重要。

YAML 支持以下几种数据结构：

*   `对象`：json 中的对象
*   `数组`：json 中的数组
*   `纯量`：json 中的简单类型（字符串，数值，布尔等）

### 对象

先看对象，上一个 json 例子：

json

 代码解读

复制代码

`{   "id": 1,   "name": "杨成功",   "isman": true }`

转换成 yaml：

yaml

 代码解读

复制代码

`id: 1 name: 杨成功 isman: true`

对象是最核心的结构，key 值的表示方法是 `[key]:` ，注意这里**冒号后面有个空格，一定不能少**。value 的值就是一个`纯量`，且默认不需要引号。

### 数组

数组和对象的结构差不多，区别是在 key 前用一个 `-` 符号标识这个是数组项。注意这里**也有一个空格**，同样也不能少。

yaml

 代码解读

复制代码

`- hello - world`

转换成 JSON 格式如下：

json

 代码解读

复制代码

`["hello", "world"]`

了解了基本的对象和数组，我们再来看一个复杂的结构。

众所周知，在实际项目配置中很少有简单的对象或数组，大多都是对象和数组相互嵌套而成。在 js 中我们称之为对象数组，而在 yaml 中我们叫 `复合结构`。

比如这样一个稍复杂的 JSON：

json

 代码解读

复制代码

`{   "name": "杨成功",   "isman": true,   "age": 25,   "tag": ["阳光", "帅气"],   "address": [     { "c": "北京", "a": "海淀区" },     { "c": "天津", "a": "滨海新区" }   ] }`

转换成复合结构的 YAML：

yaml

 代码解读

复制代码

`name: 杨成功 isman: true age: 25 tag:   - 阳光   - 帅气 address:   - c: 北京     a: 海淀区   - c: 天津     a: 滨海新区`

若你想尝试更复杂结构的转换，可以在 [这个](https://link.juejin.cn?target=https%3A%2F%2Fnodeca.github.io%2Fjs-yaml%2F "https://nodeca.github.io/js-yaml/") 网页中在线实践。

### 纯量

纯量比较简单，对应的就是 js 的基本数据类型，支持如下：

*   字符串
*   布尔
*   数值
*   null
*   时间

比较特殊的两个，null 用 `~` 符号表示，时间大多用 `2021-12-21` 这种格式表示，如：

yaml

 代码解读

复制代码

`who: ~ date: 2019-09-10`

转换成 JS 后：

javascript

 代码解读

复制代码

`{   who: null,   date: new Date('2019-09-10') }`

高级操作
----

在 yaml 实战过程中，遇到过一些特殊场景，可能需要一些特殊的处理。

### 字符串过长

在 shell 中我们常见到一些参数很多，然后特别长的命令，如果命令都写在一行的话可读性会非常差。

假设下面的是一条长命令：

shell

 代码解读

复制代码

`$ docker run --name my-nginx -d nginx`

在 linux 中可以这样处理：

shell

 代码解读

复制代码

`$ docker run \  --name my-nginx \  -d nginx`

就是在每行后加 `\` 符号标识换行。然而在 YAML 中更简单，不需要加任何符号，直接换行即可：

yaml

 代码解读

复制代码

`cmd: docker run   --name my-nginx   -d nginx`

YAML 默认会把换行符转换成`空格`，因此转换后 JSON 如下，正是我们需要的：

json

 代码解读

复制代码

`{ "cmd": "docker run --name my-nginx -d nginx" }`

然而有时候，我们的需求是**保留换行符**，并不是把它转换成空格，又该怎么办呢？

这个也简单，只需要在首行加一个 `|` 符号：

yaml

 代码解读

复制代码

`cmd: |   docker run   --name my-nginx   -d nginx`

转换成 JSON 变成了这样：

json

 代码解读

复制代码

`{ "cmd": "docker run\n--name my-nginx\n-d nginx" }`

### 获取配置

获取配置是指，在 YAML 文件中定义的某个配置，如何在代码（JS）里获取？

比如前端在 `package.json` 里有一个 `version` 的配置项表示应用版本，我们要在代码中获取版本，可以这么写：

javascript

 代码解读

复制代码

`import pack from './package.json' console.log(pack.version)`

JSON 是可以直接导入的，YAML 可就不行了，那怎么办呢？我们分环境解析：

**在浏览器中**

浏览器中代码用 webapck 打包，因此加一个 loader 即可：

shell

 代码解读

复制代码

`$ yarn add -D yaml-loader`

然后配置 loader：

javascript

 代码解读

复制代码

`// webpack.config.js module.exports = {   module: {     rules: [       {         test: /\.ya?ml$/,         type: 'json', // Required by Webpack v4         use: 'yaml-loader'       }     ]   } }`

在组件中使用：

javascript

 代码解读

复制代码

`import pack from './package.yaml' console.log(pack.version)`

**在 Node.js 中**

Node.js 环境下没有 Webpack，因此读取 yaml 配置的方法也不一样。

首先安装一个 `js-yaml` 模块：

shell

 代码解读

复制代码

`$ yarn add js-yaml`

然后通过模块提供的方法获取：

javascript

 代码解读

复制代码

`const yaml = require('js-yaml') const fs = require('fs') const doc = yaml.load(fs.readFileSync('./package.yaml', 'utf8')) console.log(doc.version)`

### 配置项复用

配置项复用的意思是，对于定义过的配置，在后面的配置直接引用，而不是再写一遍，从而达到复用的目的。

YAML 中将定义的复用项称为锚点，用`&` 标识；引用锚点则用 `*` 标识。

yaml

 代码解读

复制代码

`name: &name my_config env: &env   version: 1.0 compose:   key1: *name   key2: *env`

对应的 JSON 如下：

json

 代码解读

复制代码

`{   "name": "my_config",   "env": { "version": 1 },   "compose": { "key1": "my_config", "key2": { "version": 1 } } }`

但是锚点有个弊端，就是不能作为 `变量` 在字符串中使用。比如：

yaml

 代码解读

复制代码

`name: &name my_config compose:   key1: *name   key2: my name is *name`

此时 key2 的值就是普通字符串 _my name is \*name_，引用变得无效了。

其实在实际开发中，字符串中使用变量还是很常见的。比如在复杂的命令中多次使用某个路径，这个时候这个路径就应该是一个变量，在多个命令中复用。

GitHub Action 中有这样的支持，定义一个环境变量，然后在其他的地方复用：

yaml

 代码解读

复制代码

`env:   NAME: test describe: This app is called ${NAME}`

这种实现方式与 webpack 中使用环境变量类似，在构建的时候将变量替换成对应的字符串。

我的专栏
----

本文首发于掘金专栏 [前端 DevOps](https://juejin.cn/column/7008034440890810398 "https://juejin.cn/column/7008034440890810398")，这个专栏会长期输出前端工程与架构方向的文章，篇篇经过实践与斟酌，一如既往的保证质量。

如果本文对你有启发，请甩手一个赞 👍