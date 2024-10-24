---
author: "Sunshine_Lin"
title: "腾讯面试官：兄弟，你说你会Webpack，那说说他的原理？"
date: 2021-07-21
description: "前言 大家好，我是林三心，标题腾讯面试官：同学，你说你会Webpack，那说说他的原理？，是本菜鸟在面试腾讯时，面试官说的问的原话，一字不差，哈哈。本菜鸟当时肯定是回答不上来，最后也挂了。今天就简单实"
tags: ["面试中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:252,comments:0,collects:324,views:10190,"
---
前言
--

大家好，我是林三心，标题`腾讯面试官：同学，你说你会Webpack，那说说他的原理？`，是本菜鸟在面试腾讯时，面试官说的问的`原话`，一字不差，哈哈。本菜鸟当时肯定是回答不上来，最后也挂了。今天就简单实现一下`webpack的打包原理`，并分享给大家吧。由于`webpack原理是非常复杂`的，所以今天咱们只是`简单实现`哦。

![image.png](/images/jueJin/2f586bb4a105430.png)

原理图解
----

*   1、首先肯定是要先解析入口文件`entry`，将其转为`AST(抽象语法树)`，使用`@babel/parser`
*   2、然后使用`@babel/traverse`去找出入口文件所有`依赖模块`
*   3、然后使用`@babel/core+@babel/preset-env`将入口文件的AST转为Code
*   4、将`2`中找到的`入口文件的依赖模块`，进行`遍历递归`，重复执行`1，2，3`
*   5。重写`require`函数，并与`4`中生成的`递归关系图`一起，输出到`bundle`中 ![截屏2021-07-21 上午7.39.26.png](/images/jueJin/d8a05839e43c43c.png)

代码实现
----

webpack具体实现原理是很复杂的，这里只是`简单实现`一下，让大家粗略了解一下，webpack是怎么运作的。在代码实现过程中，大家可以自己`console.log`一下，看看`ast，dependcies，code`这些具体长什么样，我这里就不展示了，自己去看会比较有`成就感`，嘿嘿！！

![image.png](/images/jueJin/9a439614266d499.png)

### 目录

![截屏2021-07-21 上午7.47.33.png](/images/jueJin/5089bb306ce24ea.png)

### config.js

这个文件中模拟webpack的配置

```js
const path = require('path')
    module.exports = {
    entry: './src/index.js',
        output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'main.js'
    }
}
```

### 入口文件

`src/index.js`是入口文件

```js
// src/index
import { age } from './aa.js'
import { name } from './hh.js'

console.log(`${name}今年${age}岁了`)

// src/aa.js
export const age = 18

// src/hh.js
console.log('我来了')
export const name = '林三心'

```

### 1\. 定义Compiler类

```js
// index.js
    class Compiler {
        constructor(options) {
        // webpack 配置
        const { entry, output } = options
        // 入口
        this.entry = entry
        // 出口
        this.output = output
        // 模块
    this.modules = []
}
// 构建启动
run() {}
// 重写 require函数,输出bundle
generate() {}
}
```

### 2\. 解析入口文件,获取 AST

我们这里使用`@babel/parser`,这是`babel7`的工具,来帮助我们分析内部的语法,包括 es6,返回一个 `AST 抽象语法树`

```js
const fs = require('fs')
const parser = require('@babel/parser')
const options = require('./webpack.config')

    const Parser = {
        getAst: path => {
        // 读取入口文件
        const content = fs.readFileSync(path, 'utf-8')
        // 将文件内容转为AST抽象语法树
            return parser.parse(content, {
            sourceType: 'module'
            })
        }
    }
    
        class Compiler {
            constructor(options) {
            // webpack 配置
            const { entry, output } = options
            // 入口
            this.entry = entry
            // 出口
            this.output = output
            // 模块
        this.modules = []
    }
    // 构建启动
        run() {
        const ast = Parser.getAst(this.entry)
    }
    // 重写 require函数,输出bundle
generate() {}
}

new Compiler(options).run()
```

### 3\. 找出所有依赖模块

`Babel` 提供了`@babel/traverse(遍历)`方法维护这 `AST 树`的整体状态,我们这里使用它来帮我们找出`依赖模块`。

```js
const fs = require('fs')
const path = require('path')
const options = require('./webpack.config')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default

    const Parser = {
        getAst: path => {
        // 读取入口文件
        const content = fs.readFileSync(path, 'utf-8')
        // 将文件内容转为AST抽象语法树
            return parser.parse(content, {
            sourceType: 'module'
            })
            },
                getDependecies: (ast, filename) => {
            const dependecies = {}
            // 遍历所有的 import 模块,存入dependecies
                traverse(ast, {
                // 类型为 ImportDeclaration 的 AST 节点 (即为import 语句)
                    ImportDeclaration({ node }) {
                    const dirname = path.dirname(filename)
                    // 保存依赖模块路径,之后生成依赖关系图需要用到
                    const filepath = './' + path.join(dirname, node.source.value)
                    dependecies[node.source.value] = filepath
                }
                })
                return dependecies
            }
        }
        
            class Compiler {
                constructor(options) {
                // webpack 配置
                const { entry, output } = options
                // 入口
                this.entry = entry
                // 出口
                this.output = output
                // 模块
            this.modules = []
        }
        // 构建启动
            run() {
            const { getAst, getDependecies } = Parser
            const ast = getAst(this.entry)
            const dependecies = getDependecies(ast, this.entry)
        }
        // 重写 require函数,输出bundle
    generate() {}
}

new Compiler(options).run()
```

### 4\. AST 转换为 code

将 `AST 语法树`转换为浏览器可执行代码,我们这里使用`@babel/core 和 @babel/preset-env`。

```js
const fs = require('fs')
const path = require('path')
const options = require('./webpack.config')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const { transformFromAst } = require('@babel/core')

    const Parser = {
        getAst: path => {
        // 读取入口文件
        const content = fs.readFileSync(path, 'utf-8')
        // 将文件内容转为AST抽象语法树
            return parser.parse(content, {
            sourceType: 'module'
            })
            },
                getDependecies: (ast, filename) => {
            const dependecies = {}
            // 遍历所有的 import 模块,存入dependecies
                traverse(ast, {
                // 类型为 ImportDeclaration 的 AST 节点 (即为import 语句)
                    ImportDeclaration({ node }) {
                    const dirname = path.dirname(filename)
                    // 保存依赖模块路径,之后生成依赖关系图需要用到
                    const filepath = './' + path.join(dirname, node.source.value)
                    dependecies[node.source.value] = filepath
                }
                })
                return dependecies
                },
                    getCode: ast => {
                    // AST转换为code
                        const { code } = transformFromAst(ast, null, {
                    presets: ['@babel/preset-env']
                    })
                    return code
                }
            }
            
                class Compiler {
                    constructor(options) {
                    // webpack 配置
                    const { entry, output } = options
                    // 入口
                    this.entry = entry
                    // 出口
                    this.output = output
                    // 模块
                this.modules = []
            }
            // 构建启动
                run() {
                const { getAst, getDependecies, getCode } = Parser
                const ast = getAst(this.entry)
                const dependecies = getDependecies(ast, this.entry)
                const code = getCode(ast)
            }
            // 重写 require函数,输出bundle
        generate() {}
    }
    
    new Compiler(options).run()
```

### 5. 递归解析所有依赖项,生成依赖关系图

```js
const fs = require('fs')
const path = require('path')
const options = require('./webpack.config')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const { transformFromAst } = require('@babel/core')

    const Parser = {
        getAst: path => {
        // 读取入口文件
        const content = fs.readFileSync(path, 'utf-8')
        // 将文件内容转为AST抽象语法树
            return parser.parse(content, {
            sourceType: 'module'
            })
            },
                getDependecies: (ast, filename) => {
            const dependecies = {}
            // 遍历所有的 import 模块,存入dependecies
                traverse(ast, {
                // 类型为 ImportDeclaration 的 AST 节点 (即为import 语句)
                    ImportDeclaration({ node }) {
                    const dirname = path.dirname(filename)
                    // 保存依赖模块路径,之后生成依赖关系图需要用到
                    const filepath = './' + path.join(dirname, node.source.value)
                    dependecies[node.source.value] = filepath
                }
                })
                return dependecies
                },
                    getCode: ast => {
                    // AST转换为code
                        const { code } = transformFromAst(ast, null, {
                    presets: ['@babel/preset-env']
                    })
                    return code
                }
            }
            
                class Compiler {
                    constructor(options) {
                    // webpack 配置
                    const { entry, output } = options
                    // 入口
                    this.entry = entry
                    // 出口
                    this.output = output
                    // 模块
                this.modules = []
            }
            // 构建启动
                run() {
                // 解析入口文件
                const info = this.build(this.entry)
                this.modules.push(info)
                    this.modules.forEach(({ dependecies }) => {
                    // 判断有依赖对象,递归解析所有依赖项
                        if (dependecies) {
                            for (const dependency in dependecies) {
                            this.modules.push(this.build(dependecies[dependency]))
                        }
                    }
                    })
                    // 生成依赖关系图
                    const dependencyGraph = this.modules.reduce(
                        (graph, item) => ({
                        ...graph,
                        // 使用文件路径作为每个模块的唯一标识符,保存对应模块的依赖对象和文件内容
                            [item.filename]: {
                            dependecies: item.dependecies,
                            code: item.code
                        }
                        }),
                    {}
                    )
                }
                    build(filename) {
                    const { getAst, getDependecies, getCode } = Parser
                    const ast = getAst(filename)
                    const dependecies = getDependecies(ast, filename)
                    const code = getCode(ast)
                        return {
                        // 文件路径,可以作为每个模块的唯一标识符
                        filename,
                        // 依赖对象,保存着依赖模块路径
                        dependecies,
                        // 文件内容
                        code
                    }
                }
                // 重写 require函数,输出bundle
            generate() {}
        }
        
        new Compiler(options).run()
```

### 6\. 重写 require 函数,输出 bundle

```js
const fs = require('fs')
const path = require('path')
const options = require('./webpack.config')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const { transformFromAst } = require('@babel/core')

    const Parser = {
        getAst: path => {
        // 读取入口文件
        const content = fs.readFileSync(path, 'utf-8')
        // 将文件内容转为AST抽象语法树
            return parser.parse(content, {
            sourceType: 'module'
            })
            },
                getDependecies: (ast, filename) => {
            const dependecies = {}
            // 遍历所有的 import 模块,存入dependecies
                traverse(ast, {
                // 类型为 ImportDeclaration 的 AST 节点 (即为import 语句)
                    ImportDeclaration({ node }) {
                    const dirname = path.dirname(filename)
                    // 保存依赖模块路径,之后生成依赖关系图需要用到
                    const filepath = './' + path.join(dirname, node.source.value)
                    dependecies[node.source.value] = filepath
                }
                })
                return dependecies
                },
                    getCode: ast => {
                    // AST转换为code
                        const { code } = transformFromAst(ast, null, {
                    presets: ['@babel/preset-env']
                    })
                    return code
                }
            }
            
                class Compiler {
                    constructor(options) {
                    // webpack 配置
                    const { entry, output } = options
                    // 入口
                    this.entry = entry
                    // 出口
                    this.output = output
                    // 模块
                this.modules = []
            }
            // 构建启动
                run() {
                // 解析入口文件
                const info = this.build(this.entry)
                this.modules.push(info)
                    this.modules.forEach(({ dependecies }) => {
                    // 判断有依赖对象,递归解析所有依赖项
                        if (dependecies) {
                            for (const dependency in dependecies) {
                            this.modules.push(this.build(dependecies[dependency]))
                        }
                    }
                    })
                    // 生成依赖关系图
                    const dependencyGraph = this.modules.reduce(
                        (graph, item) => ({
                        ...graph,
                        // 使用文件路径作为每个模块的唯一标识符,保存对应模块的依赖对象和文件内容
                            [item.filename]: {
                            dependecies: item.dependecies,
                            code: item.code
                        }
                        }),
                    {}
                    )
                    this.generate(dependencyGraph)
                }
                    build(filename) {
                    const { getAst, getDependecies, getCode } = Parser
                    const ast = getAst(filename)
                    const dependecies = getDependecies(ast, filename)
                    const code = getCode(ast)
                        return {
                        // 文件路径,可以作为每个模块的唯一标识符
                        filename,
                        // 依赖对象,保存着依赖模块路径
                        dependecies,
                        // 文件内容
                        code
                    }
                }
                // 重写 require函数 (浏览器不能识别commonjs语法),输出bundle
                    generate(code) {
                    // 输出文件路径
                    const filePath = path.join(this.output.path, this.output.filename)
                    // 懵逼了吗? 没事,下一节我们捋一捋
                        const bundle = `(function(graph){
                            function require(module){
                                function localRequire(relativePath){
                                return require(graph[module].dependecies[relativePath])
                            }
                            var exports = {};
                                (function(require,exports,code){
                                eval(code)
                                })(localRequire,exports,graph[module].code);
                                return exports;
                            }
                            require('${this.entry}')
                            })(${JSON.stringify(code)})`
                            
                            // 把文件内容写入到文件系统
                            fs.writeFileSync(filePath, bundle, 'utf-8')
                        }
                    }
                    
                    new Compiler(options).run()
```

### 7\. 看看main里的代码

实现了上面的代码，也就实现了把打包后的代码写到main.js文件里，咱们来看看那main.js文件里的代码吧：

```js
    (function(graph){
        function require(module){
            function localRequire(relativePath){
            return require(graph[module].dependecies[relativePath])
        }
        var exports = {};
            (function(require,exports,code){
            eval(code)
            })(localRequire,exports,graph[module].code);
            return exports;
        }
        require('./src/index.js')
            })({
                "./src/index.js": {
                    "dependecies": {
                    "./aa.js": "./src\\aa.js",
                    "./hh.js": "./src\\hh.js"
                    },
                    "code": "\"use strict\";\n\nvar _aa = require(\"./aa.js\");\n\nvar _hh = require(\"./hh.js\");\n\nconsole.log(\"\".concat(_hh.name, \"\\u4ECA\\u5E74\").concat(_aa.age, \"\\u5C81\\u4E86\"));"
                    },
                        "./src\\aa.js": {
                        "dependecies": {},
                        "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.age = void 0;\nvar age = 18;\nexports.age = age;"
                        },
                            "./src\\hh.js": {
                            "dependecies": {},
                            "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.name = void 0;\nconsole.log('我来了');\nvar name = '林三心';\nexports.name = name;"
                        }
                        })
```

大家可以执行一下main.js的代码，输出结果是：

```js
我来了
林三心今年18岁了
```

![image.png](/images/jueJin/cf5052f0c35f496.png)

结语
--

`webpack`具体实现原理是很复杂的，这里只是`简单实现`一下，让大家粗略了解一下，webpack是怎么运作的。在代码实现过程中，大家可以自己`console.log`一下，看看`ast，dependcies，code`这些具体长什么样，我这里就不展示了，自己去看会比较有`成就感`，嘿嘿！！

> 如果你觉得此文对你有一丁点帮助，点个赞，鼓励一下林三心哈哈。或者加入我的群哈哈，咱们一起摸鱼一起学习 : meron857287645