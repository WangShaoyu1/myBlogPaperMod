---
author: "Sunshine_Lin"
title: "后端：你JavaScript不是世界最好的语言吗？自己解决精度丢失问题好不好？"
date: 2023-08-13
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心。 JS 绕不开的精度丢失问题 在 javascript 中，当我们进行运算时 你觉得输出是 03 吗"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:94,comments:30,collects:125,views:7295,"
---
前言
--

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心。

![](/images/jueJin/793d42e704ef435.png)

JS 绕不开的精度丢失问题
-------------

在 javascript 中，当我们进行运算时

```js
0.1 + 0.2
```

你觉得输出是 0.3 吗？显然不是的，由于 javascript 存在精度丢失问题，导致了输出的不是你预期的

![image.png](/images/jueJin/9b072a56f88243b.png)

至于为什么会精度丢失呢？我之前出过一篇文章专门讲了这个原因[你知道 0.1+0.2 !==0.3是进制问题，但你讲不出个所以然，是吧？🐶](https://juejin.cn/post/7041546152994406430 "https://juejin.cn/post/7041546152994406430")，感兴趣的朋友可以看看，由于这不是本文的重点，所以我在这就不过多讲解~

解决精度丢失的方案？
----------

我会选择使用 `decimal.js` 这个库，文档在 [文档](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fdecimal.js "https://www.npmjs.com/package/decimal.js")，他的基本使用如下：

```js
// 先安装
npm install decimal.js

// 后使用
const Decimal = require('decimal.js');

new Decimal(0.1).add(0.2) // 加法 输出 0.3
new Decimal(0.1).sub(0.2) // 减法
new Decimal(0.1).mul(0.2) // 乘法
new Decimal(0.1).div(0.2) // 除法
```

使用 `decimal.js`进行运算，能解决精度丢失的问题~

不想手动！想自动！
---------

### 很烦啊！

当我们拥有了`decimal.js`之后，每当我们进行运算的时候，就必须引入它进行使用，每一个页面都得重复这一操作，于是萌生了一个想法——我想自动！不想手动！

### 思路

那要怎么才能自动呢？由于前段时间群里很多人说想学习写 babel 插件，所以刚好，针对这个需求，我可以实现一个 babel 插件，它的功能是：将项目中 `0.1 + 0.2` 这种表达式，转换为 `new Decimal(0.1).add(0.2)`

```js
0.1 + 0.2
// 转换为
new Decimal(0.1).add(0.2)
```

这样就能一次性把项目中的精度丢失问题解决了~

开发 babel 插件
-----------

### 前置准备

涉及到三个问题：

*   webpack 和 rollup 如何选择
*   rollup 打包环境的搭建
*   如何发布到 npm 上

这三个问题具体我在上一篇文章[【前端小知识】Rollup开发一个Npm包，并发布](https://juejin.cn/post/7264044879209529381 "https://juejin.cn/post/7264044879209529381")里有提到过了，在本文我就不过多讲解

### 搭建一个 Rollup 打包环境

新建一个 `babel-plugin-sx-accuracy`文件夹，用来开发 babel 插件

> 名字可以自己取，但是为了规范，最好是 `babel-plugin-` 开头

接着进入 `babel-plugin-sx-accuracy` 文件夹，输入

```js
npm init
npm i rollup @rollup/plugin-babel -D
npm i decimal.js -S
```

`package.json` 中的内容为：

```js
"name": "babel-plugin-sx-accuracy",
"version": "1.0.20",
"description": "",
"main": "dist/index.js",
"type": "module",
    "scripts": {
    "build": "rollup -c"
    },
        "files": [
        "dist/*",
        "src/*"
        ],
        "author": "",
        "license": "ISC",
            "devDependencies": {
            "@rollup/plugin-babel": "^6.0.3",
            "rollup": "^3.26.2"
            },
                "dependencies": {
                "decimal.js": "^10.4.3"
            }
        }
```

然后在根目录下新建 `rollup.config.js` 文件，用来配置 rollup 打包

```js
// rollup.config.js
import babel from '@rollup/plugin-babel';

    export default {
    input: 'src/index.js',
        output: {
        file: 'dist/index.js',
        format: 'cjs',
        },
            plugins: [
                babel({
                babelHelpers: 'bundled',
                }),
                ],
                };
```

最后新建 `src/index.js`，我们的插件逻辑就写在这里

![image.png](/images/jueJin/69a02d1101a8486.png)

### 什么是抽象语法树（AST）？

我们可以借助一个网站，来一睹抽象语法树的真容~ [astexplorer.net/](https://link.juejin.cn?target=https%3A%2F%2Fastexplorer.net%2F "https://astexplorer.net/")

![image.png](/images/jueJin/8769fc1066b2444.png)

这里我们可以记住几个点

*   每一个代码片段都有属于自己的节点类型
*   代码最外层的节点类型为 `Program`
*   像 `0.1+0.2` 这种表达式，节点类型为 `BinaryExpression`
*   `BinaryExpression`节点里会有几个重要的东西
    *   operaor：运算符号
    *   left：左边的数字
    *   right：右边的数字

其实抽象语法树的节点类型有很多种，我列举一些：

*   标识符（Identifier）：表示变量、函数名等标识符的节点
*   字面量（Literal）：表示字面量值，如字符串、数字、布尔值等
*   表达式语句（ExpressionStatement）：表示包含表达式的语句节点
*   赋值表达式（AssignmentExpression）：表示赋值操作的表达式节点，如 `x = 5`
*   二元表达式（BinaryExpression）：表示包含二元操作符的表达式节点，如 `x + y`
*   一元表达式（UnaryExpression）：表示包含一元操作符的表达式节点，如 `-x`
*   函数声明（FunctionDeclaration）：表示函数声明的节点，包括函数名、参数和函数体
*   变量声明（VariableDeclaration）：表示变量声明的节点，包含变量名和可选的初始值
*   条件语句（IfStatement）：表示 If 条件语句的节点，包括条件表达式、if 分支和可选的 else 分支
*   循环语句（WhileStatement、ForStatement）：表示循环语句的节点，分别代表 While 循环和 For 循环
*   对象字面量（ObjectLiteral）：表示对象字面量的节点，包含对象属性和属性值
*   数组字面量（ArrayLiteral）：表示数组字面量的节点，包含数组元素
*   函数调用（CallExpression）：表示函数调用的节点，包含调用的函数名和参数列表
*   返回语句（ReturnStatement）：表示返回语句的节点，包含返回的表达式

当然大家现阶段不需要去记，大家只需要记得这两个类型就行了：

*   代码最外层的节点类型为 `Program`
*   像 `0.1+0.2` 这种表达式，节点类型为 `BinaryExpression`

其实，我们平时在 webpack 开发时会接触到一系列的插件，他们的功能比如有

*   去除 console.log
*   压缩代码
*   去除注释

其实他们的原理整体上都是一致的，分为三步：

*   第一步：将代码转换成抽象语法树
*   第二步：使用 babel 为我们提供的方法，对语法树进行增删改查
*   第三步：将处理后的语法树重新转换成代码

而我们将要开发的插件，也是用到这个过程，但是第一步和第三步我们不需要管，我们只需要完成第二步中的增删改查操作即可~

> 注意点：在第二步中，babel 会对抽象语法树进行深度遍历，遍历到目标节点后，又会重新回到上层节点去重新遍历下一个目标节点，所以一个节点会被遍历两次，一来一回 进去是 `enter` 回去是 `exit`

![image.png](/images/jueJin/6ccb757b3b264aa.png)

### 插件基本代码结构

> 下文使用 `AST` 来表达抽象语法树

```js
    export default function ({ template: template, types: t }) {
    
        return {
            visitor: {
                Program: {
                    exit: function (path) {
                }
                },
                    BinaryExpression: {
                        exit: function (path) {
                    }
                }
            }
        }
    }
```

开发一个 babel 插件，文件必须默认返回一个函数，接收一个对象参数，里面有个属性我们需要用到

*   **template：** 是`@babel/template`的一个方法，他能使用模板的方式生成AST节点

函数内部的东西，我们也介绍下

*   **vistor：** 你可以理解为修改AST节点的`入口`
*   **Program、BinaryExpression：** 你需要修改的AST节点类型
*   **exit：** 就是刚刚说的 `一来一回` 中的，`回`
*   **path：** 就是被遍历到的AST节点对象

### 插件完全实现

```js
// 定义构造函数的名称常量
const DECIMAL_FUN_NAME = 'Decimal'
// 运算符号映射 decimal.js 的四个方法
    const OPERATIONS_MAP = {
    '+': 'add',
    '-': 'sub',
    '*': 'mul',
    '/': 'div'
}
// 运算符号数组
const OPERATIONS = Object.keys(OPERATIONS_MAP)

    export default function ({ template: template }) {
    
    // require decimal.js 的节点模板
    const requireDecimalTemp = template(`const ${DECIMAL_FUN_NAME}=require('decimal.js')`);
    // 将运算表达式转换为decimal函数的节点模板
    const operationTemp = template(`new ${DECIMAL_FUN_NAME}(LEFT).OPERATION(RIGHT).toNumber()`);
    
        return {
            visitor: {
                Program: {
                    exit: function (path) {
                    // 调用方法，往子节点body
                    // 中插入 const Decimal = require('decimal.js')
                    // 表达式
                    path.unshiftContainer("body",
                    requireDecimalTemp())
                }
                },
                    BinaryExpression: {
                        exit: function (path) {
                        const operator = path.node.operator;
                            if (OPERATIONS.includes(operator)) {
                            // 调用方法替换节点
                            path.replaceWith(
                            // 传入 operator left right
                                operationTemp({
                                LEFT: path.node.left,
                                RIGHT: path.node.right,
                            OPERATION: OPERATIONS_MAP[operator]
                            })
                            )
                        }
                    }
                }
            }
        }
    }
```

### 打包 & 发布 NPM

当开发完成后，我们先 `npm run build`进行打包

然后运行 `npm publish` 发布到 NPM 上

![image.png](/images/jueJin/728b249a4b9045e.png)

### 项目使用

首先安装 `babel-plugin-sx-accuracy`

```js
npm i babel-plugin-sx-accuracy
```

只需要在项目中的 `.babelrc` 或者 `babel.config.js` 中加入 `babel-plugin-sx-accuracy`即可

```js
    {
    "presets": ["@babel/preset-env"],
"plugins": ["babel-plugin-sx-accuracy"]
}
```

我们来试试，一开始代码是

```js
console.log(0.1 + 0.2)
console.log(0.3 - 0.1)
console.log(0.2 * 0.1)
console.log(0.3 / 0.1)
```

打包后我们看看产物，并且输出的也都是没有精度丢失的结果！！！

![image.png](/images/jueJin/9eb02b8b0a8f413.png)

结语 & 加学习群 & 摸鱼群
---------------

我是林三心

*   一个待过**小型toG型外包公司、大型外包公司、小公司、潜力型创业公司、大公司**的作死型前端选手；
*   一个偏前端的全干工程师；
*   一个不正经的掘金作者；
*   一个逗比的B站up主；
*   一个不帅的小红书博主；
*   一个喜欢打铁的篮球菜鸟；
*   一个喜欢历史的乏味少年；
*   一个喜欢rap的五音不全弱鸡

如果你想一起学习前端，一起摸鱼，一起研究简历优化，一起研究面试进步，一起交流历史音乐篮球rap，可以来俺的摸鱼学习群哈哈，点这个，有7000多名前端小伙伴在等着一起学习哦 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

![image.png](/images/jueJin/d2416f4483ff44f.png)