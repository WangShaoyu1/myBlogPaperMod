---
author: "Gaby"
title: "读懂babel编译流程，还怕面试官刁难不成"
date: 2021-08-16
description: "Babel 是一个 JavaScript 编译器。（把浏览器不认识的语法，编译成浏览器认识的语法。详细流程见内文"
tags: ["前端","面试中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读14分钟"
weight: 1
selfDefined:"likes:6,comments:0,collects:8,views:689,"
---
**这是我参与8月更文挑战的第14天，活动详情查看：[8月更文挑战](https://juejin.cn/post/6987962113788493831 "https://juejin.cn/post/6987962113788493831")**

**webpack 与 Babel 的关系**

Babel 是一个 JavaScript 编译器。（把浏览器不认识的语法，编译成浏览器认识的语法。） webpack 是一个现代 JavaScript 应用程序的静态模块打包器。（项目打包）

Babel 是一个工具链，主要用于将采用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。Babel 工具链是由大量的工具组成的，无论你是 “最终用户” 还是在集成 Babel，这些工具都简化了 Babel 的使用。

Babel 能为你做的事情：

*   语法转换
*   通过 Polyfill 方式在目标环境中添加缺失的特性（通过第三方 polyfill 模块，例如 [core-js](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fzloirock%2Fcore-js "https://github.com/zloirock/core-js")，实现）
*   源代码转换 (codemods)

### Babel 的编译流程

![image.png](/images/jueJin/b9b43f0024de48c.png)

![image.png](/images/jueJin/c3affa30cc044fa.png)

### Babel 生成配置

![image.png](/images/jueJin/b83a944f1f73426.png)

package.json 项目配置文件

```js
    "devDependencies": {
    "@babel/cli": "7.10.5",
    "@babel/core": "7.11.1",
    "@babel/plugin-proposal-class-properties": "7.10.4",
    "@babel/plugin-proposal-decorators": "7.10.5",
    "@babel/plugin-proposal-do-expressions": "7.10.4",
    "@babel/plugin-proposal-object-rest-spread": "7.11.0",
    "@babel/plugin-syntax-dynamic-import": "7.8.3",
    "@babel/plugin-transform-react-jsx": "7.12.17",
    "@babel/plugin-transform-runtime": "7.11.0",
    "@babel/preset-env": "7.11.0",
    "@babel/preset-react": "7.12.13",
    "@babel/preset-typescript": "7.12.17",
    .......
}

```

我们常接触到的**babel**、**babel-loader**、 **@babel/core**、 **@babel/preset-env** 、 **@babel/polyfill**、以及\*\*@babel/plugin-transform-runtime\*\*，这些都是做什么的呢？

#### @babel/cli

[@babel/cli](https://link.juejin.cn?target=https%3A%2F%2Fwww.babeljs.cn%2Fdocs%2Fbabel-cli "https://www.babeljs.cn/docs/babel-cli") 是一个能够在终端（命令行）使用的工具。

```js
npm install --save-dev @babel/core @babel/cli ./node_modules/.bin/babel src --out-dir lib
```

#### @babel/core：

@babel/core 是整个 babel 的核心，它负责调度 babel 的各个组件来进行代码编译，是整个行为的组织者和调度者。

transform 方法会调用 transformFileRunner 进行文件编译，首先就是 loadConfig 方法生成完整的配置。然后读取文件中的代码，根据这个配置进行编译。

```js
const transformFileRunner = gensync<[string, ?InputOptions], FileResult | null>(
    function* (filename, opts) {
    const options = { ...opts, filename };
    
    const config: ResolvedConfig | null = yield* loadConfig(options);
    if (config === null) return null;
    
    const code = yield* fs.readFile(filename, "utf8");
    return yield* run(config, code);
    },
    );
```

#### **@babel/preset-env：**

这是一个预设的插件集合，包含了一组相关的插件，Bable中是通过各种插件来指导如何进行代码转换。该插件包含所有es6转化为es5的翻译规则

babel官网对此进行的如下说明：

> Transformations come in the form of plugins, which are small JavaScript programs that instruct Babel on how to carry out transformations to the code. You can even write your own plugins to apply any transformations you want to your code. To transform ES2015+ syntax into ES5 we can rely on official plugins like`@babel/plugin-transform-arrow-functions`

大致即es6到es5的语法转换是以插件的形式实现的，可以是自己的插件也可以是官方提供的插件如箭头函数转换插件@babel/plugin-transform-arrow-functions。

由此我们可以看出，我们需要转换哪些新的语法，都可以将相关的插件一一列出，但是这其实非常复杂，因为我们往往需要根据兼容的浏览器的不同版本来确定需要引入哪些插件，为了解决这个问题，babel给我们提供了一个预设插件组，即@babel/preset-env，可以根据选项参数来灵活地决定提供哪些插件

```js
    {
    "presets":["es2015","react","stage-1"],
        "plugins": [["transform-runtime"],["import", {
        "libraryName": "cheui-react",
        "libraryDirectory": "lib/components",
        "camel2DashComponentName": true // default: true
    }]]
}
```

@babel/preset-env是一种智能预设，它允许您使用最新的JavaScript，而无需微管理目标环境需要哪些语法转换(以及可选的浏览器多填充)。

`@babel/preset-env`获取[您指定的](https://link.juejin.cn?target=https%3A%2F%2Fbabeljs.io%2Fdocs%2Fen%2Fbabel-preset-env%23targets "https://babeljs.io/docs/en/babel-preset-env#targets")任何[目标环境](https://link.juejin.cn?target=https%3A%2F%2Fbabeljs.io%2Fdocs%2Fen%2Fbabel-preset-env%23targets "https://babeljs.io/docs/en/babel-preset-env#targets")并根据其映射检查它们以编译插件列表并将其传递给 Babel。

#### @babel/polyfill：

@babel/preset-env只是提供了语法转换的规则，但是它并不能弥补浏览器缺失的一些新的功能，如一些内置的方法和对象，如Promise,Array.from等，此时就需要polyfill来做js得垫片，弥补低版本浏览器缺失的这些新功能。

我们需要注意的是，polyfill的体积是很大的，如果我们不做特殊说明，它会把你目标浏览器中缺失的所有的es6的新的功能都做垫片处理。但是我们没有用到的那部分功能的转换其实是无意义的，造成打包后的体积无谓的增大，所以通常，我们会在presets的选项里，配置\*\*“useBuiltIns”: “usage”,这样一方面只对使用的新功能做垫片，另一方面，也不需要我们单独引入import '@babel/polyfill’了，它会在使用的地方自动注入。

我们使用 `@babel/cli` 从终端运行 Babel，利用 `@babel/polyfill` 来模拟所有新的 JavaScript 功能，而 `env` preset 只对我们所使用的并且目标浏览器中缺失的功能进行代码转换和加载 polyfill。

[@babel/polyfill](https://link.juejin.cn?target=https%3A%2F%2Fwww.babeljs.cn%2Fdocs%2Fbabel-polyfill "https://www.babeljs.cn/docs/babel-polyfill")

[@babel/polyfill](https://link.juejin.cn?target=https%3A%2F%2Fwww.babeljs.cn%2Fdocs%2Fbabel-polyfill "https://www.babeljs.cn/docs/babel-polyfill") 模块包含 [core-js](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fzloirock%2Fcore-js "https://github.com/zloirock/core-js") 和一个自定义的 [regenerator runtime](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Fregenerator%2Fblob%2Fmaster%2Fpackages%2Fregenerator-runtime%2Fruntime.js "https://github.com/facebook/regenerator/blob/master/packages/regenerator-runtime/runtime.js") 来模拟完整的 ES2015+ 环境。

```js
npm install --save @babel/polyfill
```

> 注意，使用 `--save` 参数而不是 `--save-dev`，因为这是一个需要在你的源码之前运行的 polyfill。

我们所使用的 `env` preset 提供了一个 `"useBuiltIns"` 参数，当此参数设置为 `"usage"` 时，就会加载上面所提到的最后一个优化措施，也就是只包含你所需要的 polyfill。使用此新参数后，Babel 将检查你的所有代码，以便查找目标环境中缺失的功能，然后只把必须的 polyfill 包含进来。

#### babel-loader:

以上@babel/core、@babel/preset-env 、@babel/polyfill其实都是在做es6的语法转换和弥补缺失的功能，但是当我们在使用webpack打包js时，webpack并不知道应该怎么去调用这些规则去编译js。这时就需要babel-loader了，它作为一个中间桥梁，通过调用babel/core中的api来告诉webpack要如何处理js。

#### @babel/plugin-transform-runtime：

polyfill的垫片是在全局变量上挂载目标浏览器缺失的功能，因此在开发类库，第三方模块或者组件库时，就不能再使用babel-polyfill了，否则可能会造成全局污染，此时应该使用transform-runtime。transform-runtime的转换是非侵入性的，也就是它不会污染你的原有的方法。遇到需要转换的方法它会另起一个名字，否则会直接影响使用库的业务代码，

.babelrc 如果我们什么都不配置的话，打包后的文件不会有任何变化，需要在 babelrc 文件中对 babel 做如下配置。然后打包。我们后续会分析该配置作用的机制。

```js
    {
"presets": ["@babel/preset-env"]
}
```

@babel/cli 解析命令行，但是仅有命令行中的参数的话，babel 是无法进行编译工作的，还缺少一些关键性的参数，也就是配置在 .babelrc 文件中的插件信息。

@babel/core 在执行 transformFile 操作之前，第一步就是读取 .babelrc 文件中的配置。

流程是这样的，babel 首先会判断命令行中有没有指定配置文件（-config-file），有就解析，没有的话 babel 会在当前根目录下寻找默认的配置文件。默认文件名称定义如下。优先级从上到下。

```js
// babel-main\packages\babel-core\src\config\files\configuration.js

    const RELATIVE_CONFIG_FILENAMES = [
    ".babelrc",
    ".babelrc.js",
    ".babelrc.cjs",
    ".babelrc.mjs",
    ".babelrc.json",
    ];
```

.babelrc 文件中，我们经常配置的是 plugins 和 presets，plugin 是 babel 中真正干活的，代码的转化全靠它，但是随着 plugin 的增多，如何管理好这些 plugin 也是一个挑战。于是，babel 将一些 plugin 放在一起，称之为 preset。

对于 babelrc 中的 plugins 和 presets，babel 将每一项都转化为一个 ConfigItem。presets 是一个 ConfigItem 数组，plugins 也是一个 ConfigItem 数组。

假设有如下的 .babelrc 文件，会生成这样的 json 配置。

```js
    {
    "presets": ["@babel/preset-env"],
"plugins": ["@babel/plugin-proposal-class-properties"]
}
    plugins: [
        ConfigItem {
        value: [Function],
        options: undefined,
        dirname: 'babel\\babel-demo',
        name: undefined,
            file: {
            request: '@babel/plugin-proposal-class-properties',
            resolved: 'babel\\babel-demo\\node_modules\\@babel\\plugin-proposal-class-properties\\lib\\index.js'
        }
    }
    ],
        presets: [
            ConfigItem {
            value: [Function],
            options: undefined,
            dirname: 'babel\\babel-demo',
            name: undefined,
                file: {
                request: '@babel/preset-env',
                resolved: 'babel\\babel-demo\\node_modules\\@babel\\preset-env\\lib\\index.js'
            }
        }
    ]
```

对于 plugins，babel 会依序加载其中的内容，解析出插件中定义的 pre，visitor 等对象。由于 presets 中会包含对个 plugin，甚至会包括新的 preset，所以 babel 需要解析 preset 的内容，将其中包含的 plugin 解析出来。以 @babel/preset-env 为例，babel 会将其中的 40 个 plugin 解析到，之后会重新解析 presets 中的插件。

这里有一个很有意思的点，就是对于解析出的插件列表，处理的方式是使用 unshift 插入到一个列表的头部。

```js
    if (plugins.length > 0) {
    pass.unshift(...plugins);
}
```

这其实是因为 presets 加载顺序和一般理解不一样 ，比如 presets 写成 \[“es2015”, “stage-0”\]，由于 stage-x 是 Javascript 语法的一些提案，那这部分可能依赖了ES6 的语法，解析的时候需要先将新的语法解析成 ES6,在把 ES6 解析成 ES5。这也就是使用 unshift 的原因。新的 preset 中的插件会被优先执行。

当然，不管 presets 的顺序是怎样的，我们定义的 plugins 中的插件永远是最高优先级。原因是 plugins 中的插件是在 presets 处理完毕后使用 unshift 插入对列头部。

最终生成的配置包含 options 和 passes 两块，大部分情况下，options 中的 presets 是个空数组，plugins 中存放着插件集合，passes 中的内容和 options.plugins 是一致的。

```js
    {
        options: {
        babelrc: false,
        caller: {name: "@babel/cli"},
        cloneInputAst: true,
        configFile: false,
        envName: "development",
        filename: "babel-demo\src\index.js",
        plugins: Array(41),
    presets: []
}
passes: [Array(41)]
}
```

### Babel 执行编译

流程

![image.png](/images/jueJin/1534333eb2c7438.png)

下面看一下run的主要代码

```js

export function* run(
config: ResolvedConfig,
code: string,
ast: ?(BabelNodeFile | BabelNodeProgram),
    ): Handler<FileResult> {
    
    const file = yield* normalizeFile(
    config.passes,
    normalizeOptions(config),
    code,
    ast,
    );
    
    const opts = file.opts;
        try {
        yield* transformFile(file, config.passes);
            } catch (e) {
            ...
        }
        
        let outputCode, outputMap;
            try {
                if (opts.code !== false) {
                ({ outputCode, outputMap } = generateCode(config.passes, file));
            }
                } catch (e) {
                ...
            }
            
                return {
                metadata: file.metadata,
                options: opts,
                ast: opts.ast === true ? file.ast : null,
                code: outputCode === undefined ? null : outputCode,
                map: outputMap === undefined ? null : outputMap,
                sourceType: file.ast.program.sourceType,
                };
            }
```

首先是执行 normalizeFile 方法，该方法的作用就是将 code 转化为抽象语法树（AST）； 接着执行 transformFile 方法，该方法入参有我们的插件列表，这一步做的就是根据插件修改 AST 的内容； 最后执行 generateCode 方法，将修改后的 AST 转换成代码。 整个编译过程还是挺清晰的，简单来说就是解析（parse），转换（transform），生成（generate）。我们详细看下每个过程。

### 解析（Prase）

了解解析过程之前，要先了解抽象语法树（AST），它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构。不同的语言生成 AST 规则不同，在 JS 中，AST 就是一个用于描述代码的 JSON 串。

```js
const a = 1
    {
    "type": "Program",
    "start": 0,
    "end": 11,
        "body": [
            {
            "type": "VariableDeclaration",
            "start": 0,
            "end": 11,
                "declarations": [
                    {
                    "type": "VariableDeclarator",
                    "start": 6,
                    "end": 11,
                        "id": {
                        "type": "Identifier",
                        "start": 6,
                        "end": 7,
                        "name": "a"
                        },
                            "init": {
                            "type": "Literal",
                            "start": 10,
                            "end": 11,
                            "value": 1,
                            "raw": "1"
                        }
                    }
                    ],
                    "kind": "const"
                }
                ],
                "sourceType": "module"
            }
```

回到 normalizeFile 方法，该方法中调用了 parser 方法。

```js
export default function* normalizeFile(
pluginPasses: PluginPasses,
options: Object,
code: string,
ast: ?(BabelNodeFile | BabelNodeProgram),
    ): Handler<File> {
    ...
    ast = yield* parser(pluginPasses, options, code);
    ...
}

```

parser 会遍历所有的插件，看哪个插件中定义了 parserOverride 方法。为了方便理解，我们先跳过这部分，先看 parse 方法，parse 方法是 @babel/parser 提供的一个方法，用于将 JS 代码装化为 AST。

正常情况下， @babel/parser 中的规则是可以很好的完成 AST 转换的，但如果我们需要自定义语法，或者是修改/扩展这些规则的时候，@babel/parser 就不够用了。babel 想了个方法，就是你可以自己写一个 parser，然后通过插件的方式，指定这个 parser 作为 babel 的编译器。

```js
import { parse } from "@babel/parser";

export default function* parser(
pluginPasses: PluginPasses,
{ parserOpts, highlightCode = true, filename = "unknown" }: Object,
code: string,
    ): Handler<ParseResult> {
        try {
        const results = [];
            for (const plugins of pluginPasses) {
                for (const plugin of plugins) {
                const { parserOverride } = plugin;
                    if (parserOverride) {
                    const ast = parserOverride(code, parserOpts, parse);
                    
                    if (ast !== undefined) results.push(ast);
                }
            }
        }
        
            if (results.length === 0) {
            
            return parse(code, parserOpts);
            
                } else if (results.length === 1) {
                yield* []; // If we want to allow async parsers
                
                ...
                
                return results[0];
            }
            throw new Error("More than one plugin attempted to override parsing.");
                } catch (err) {
                ...
            }
        }
```

现在回过头来看前面的循环就很好理解了，遍历插件，插件中如果定义了 parserOverride 方法，就认为用户指定了自定义的编译器。从代码中得知，插件定义的编译器最多只能是一个，否则 babel 会不知道执行哪个编译器。

如下是一个自定义编译器插件的例子。

```js
const parse = require("custom-fork-of-babel-parser-on-npm-here");

    module.exports = {
        plugins: [{
            parserOverride(code, opts) {
            return parse(code, opts);
            },
        }]
    }
```

JS 转换为 AST 的过程依赖于 @babel/parser，用户已可以通过插件的方式自己写一个 parser 来覆盖默认的。@babel/parser 的过程还是挺复杂的，后续我们单独分析它，这里只要知道它是将 JS 代码转换成 AST 就可以了。

### 转换（transform）

AST 需要根据插件内容做一些变换，我们先大概的看下一个插件长什么样子。如下所示，Babel 插件返回一个 function ，入参为 babel 对象，返回 Object。其中 pre, post 分别在进入/离开 AST 的时候触发，所以一般分别用来做初始化/删除对象的操作。visitor（访问者）定义了用于在一个树状结构中获取具体节点的方法。

```js
    module.exports = (babel) => {
        return {
            pre(path) {
        this.runtimeData = {}
        },
        visitor: {},
            post(path) {
            delete this.runtimeData
        }
    }
}
```

理解了插件的结构之后，再看 transformFile 方法就比较简单了。首先 babel 为插件集合增加了一个 loadBlockHoistPlugin 的插件，用于排序的，无需深究。然后就是执行插件的 pre 方法，等待所有插件的 pre 方法都执行完毕后，执行 visitor 中的方法（并不是简单的执行方法，而是根据访问者模式在遇到相应的节点或属性的时候执行，具体规则见Babel 插件手册），为了优化，babel 将多个 visitor 合并成一个，使用 traverse 遍历 AST 节点，在遍历过程中执行插件。最后执行插件的 post 方法。

```js
import traverse from "@babel/traverse";

    function* transformFile(file: File, pluginPasses: PluginPasses): Handler<void> {
        for (const pluginPairs of pluginPasses) {
        const passPairs = [];
        const passes = [];
        const visitors = [];
        
            for (const plugin of pluginPairs.concat([loadBlockHoistPlugin()])) {
            const pass = new PluginPass(file, plugin.key, plugin.options);
            
            passPairs.push([plugin, pass]);
            passes.push(pass);
            visitors.push(plugin.visitor);
        }
        
            for (const [plugin, pass] of passPairs) {
            const fn = plugin.pre;
                if (fn) {
                const result = fn.call(pass, file);
                
                yield* [];
                ...
            }
        }
        
        // merge all plugin visitors into a single visitor
        const visitor = traverse.visitors.merge(
        visitors,
        passes,
        file.opts.wrapPluginVisitorMethod,
        );
        
        traverse(file.ast, visitor, file.scope);
        
            for (const [plugin, pass] of passPairs) {
            const fn = plugin.post;
                if (fn) {
                const result = fn.call(pass, file);
                
                yield* [];
                ...
            }
        }
    }
}
```

该阶段的核心是插件，插件使用 visitor 访问者模式定义了遇到特定的节点后如何进行操作。babel 将对AST 树的遍历和对节点的增删改等方法放在了 @babel/traverse 包中。

### 生成（generate）

AST 转换完毕后，需要将 AST 重新生成 code。

@babel/generator 提供了默认的 generate 方法，如果需要定制的话，可以通过插件的 generatorOverride 方法自定义一个。这个方法和第一个阶段的 parserOverride 是相对应的。生成目标代码后，还会同时生成 sourceMap 相关的代码。

```js
import generate from "@babel/generator";

export default function generateCode(
pluginPasses: PluginPasses,
file: File,
    ): {
    outputCode: string,
    outputMap: SourceMap | null,
        } {
        const { opts, ast, code, inputMap } = file;
        
        const results = [];
            for (const plugins of pluginPasses) {
                for (const plugin of plugins) {
                const { generatorOverride } = plugin;
                    if (generatorOverride) {
                    const result = generatorOverride(
                    ast,
                    opts.generatorOpts,
                    code,
                    generate,
                    );
                    
                    if (result !== undefined) results.push(result);
                }
            }
        }
        
        let result;
            if (results.length === 0) {
            result = generate(ast, opts.generatorOpts, code);
                } else if (results.length === 1) {
                result = results[0];
                ...
                    } else {
                    throw new Error("More than one plugin attempted to override codegen.");
                }
                
                let { code: outputCode, map: outputMap } = result;
                
                    if (outputMap && inputMap) {
                    outputMap = mergeSourceMap(inputMap.toObject(), outputMap);
                }
                
                    if (opts.sourceMaps === "inline" || opts.sourceMaps === "both") {
                    outputCode += "\n" + convertSourceMap.fromObject(outputMap).toComment();
                }
                
                    if (opts.sourceMaps === "inline") {
                    outputMap = null;
                }
                
                return { outputCode, outputMap };
            }
```

* * *

**如果这篇文章帮到了你，记得点赞👍收藏加关注哦😊，希望点赞多多多多...**

**文中如有错误，欢迎在评论区指正**

* * *

往期文章
====

*   [前端面试☞HTTP及网络专题](https://juejin.cn/post/6995404801848639501 "https://juejin.cn/post/6995404801848639501")
*   [2021年前端面试知识点大厂必备](https://juejin.cn/post/6989800620437798919 "https://juejin.cn/post/6989800620437798919")
*   [7月前端高频面试题](https://juejin.cn/post/6992222084382326798 "https://juejin.cn/post/6992222084382326798")
*   [浏览器的工作原理](https://juejin.cn/post/6992597760935460901 "https://juejin.cn/post/6992597760935460901")
*   [深度剖析TCP与UDP的区别](https://juejin.cn/post/6992743999756845087 "https://juejin.cn/post/6992743999756845087")
*   [彻底理解浏览器的缓存机制](https://juejin.cn/post/6992843117963509791 "https://juejin.cn/post/6992843117963509791")
*   [JavaScript是如何影响DOM树构建的](https://juejin.cn/post/6992887065050349605 "https://juejin.cn/post/6992887065050349605")
*   [JavaScript 事件模型](https://juejin.cn/post/6992978598441254925 "https://juejin.cn/post/6992978598441254925")
*   [深入了解现代 Web 浏览器](https://juejin.cn/post/6993095345576083486 "https://juejin.cn/post/6993095345576083486")
*   [在Linux阿里云服务器上部署Nextjs项目](https://juejin.cn/post/6993205190471974925 "https://juejin.cn/post/6993205190471974925")
*   [Snowpack - 更快的前端构建工具](https://juejin.cn/post/6993209659297366024 "https://juejin.cn/post/6993209659297366024")
*   [深入了解 JavaScript 内存泄露](https://juejin.cn/post/6993614323176177695 "https://juejin.cn/post/6993614323176177695")
*   [细说前端路由的hash模式和 history模式](https://juejin.cn/post/6993897542970769421 "https://juejin.cn/post/6993897542970769421")
*   [CSS样式之BFC和IFC的用法](https://juejin.cn/post/6993902300091645965 "https://juejin.cn/post/6993902300091645965")
*   [CSS性能优化](https://juejin.cn/post/6994059570469404686 "https://juejin.cn/post/6994059570469404686")
*   [快速写一个让自己及面试官满意的原型链](https://juejin.cn/post/6994295598958510111 "https://juejin.cn/post/6994295598958510111")
*   [细说JS模块化规范（CommonJS、AMD、CMD、ES6 Module）](https://juejin.cn/post/6994814324548091940 "https://juejin.cn/post/6994814324548091940")
*   [webpack工作原理及loader和plugin的区别](https://juejin.cn/post/6995073296517562376 "https://juejin.cn/post/6995073296517562376")
*   [解读 HTTP1/HTTP2/HTTP3](https://juejin.cn/post/6995109407545622542 "https://juejin.cn/post/6995109407545622542")