---
author: "京东云开发者"
title: "《京东金融APP的鸿蒙之旅系列专题》鸿蒙工程化：Hvigor构建技术"
date: 2024-10-14
description: "作者：京东科技 杨拓 一、构建工具概述 Hvigor构建工具是一款基于TypeScript实现的构建任务编排工具，专为提升构建和测试应用的效率而设计。它主要提供以下关键功能： 1任务管理机制：包括任"
tags: ["HarmonyOS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:4,comments:0,collects:4,views:214,"
---
作者：京东科技 杨拓

一、构建工具概述
--------

Hvigor构建工具是一款基于TypeScript实现的构建任务编排工具，专为提升构建和测试应用的效率而设计。它主要提供以下关键功能：

1.任务管理机制：包括任务注册和编排，帮助开发者高效地管理和执行构建任务。

2.工程模型管理：支持对工程的结构和依赖关系进行管理，确保构建过程的有序和高效。

3.配置管理：提供灵活的配置选项，允许开发者根据不同需求进行定制化配置。

### 1、DevEco Studio与Hvigor的集成

DevEco Studio使用Hvigor构建工具来自动执行和管理构建流程，实现应用和服务构建任务流的执行，最终完成HAP/APP的构建打包。Hvigor的优势在于其灵活性和独立性：

1.自动化构建流程：在DevEco Studio中，Hvigor可以自动化执行各种构建任务，简化开发者的工作流程。

2.独立运行：Hvigor不仅可以在DevEco Studio内运行，还可以通过命令行工具或在集成服务器上独立运行。这意味着开发者可以在各种环境中使用Hvigor进行构建工作，无需依赖特定的IDE。

### 2、构建过程的一致性

无论使用命令行工具还是DevEco Studio来构建项目，构建过程的输出将保持一致。这种一致性确保了开发者在不同的构建环境中都能获得相同的构建结果，减少了由于环境差异导致的问题。

### 3、典型使用场景

1.  本地开发：开发者可以在DevEco Studio中使用Hvigor进行本地开发和测试，方便快捷。
    
2.  命令行构建：对于习惯使用命令行工具的开发者，Hvigor提供了命令行接口，可以在终端中执行构建任务。
    
3.  持续集成/持续部署（CI/CD）：在集成服务器上，Hvigor可以作为构建工具，自动化执行构建和测试任务，确保代码的持续集成和部署。
    

Hvigor构建工具通过其强大的任务管理和配置管理功能，为开发者提供了高效、灵活的构建解决方案。无论是在DevEco Studio内使用，还是通过命令行工具和集成服务器进行构建，Hvigor都能确保构建过程的高效和一致性，为开发者带来更好的开发体验。

### 4、支持的语言

hvigor支持TS、JS等主流前端语言

二、构建生命周期
--------

hvigor在执行任何任务之前都会构建任务依赖图，所有任务会形成一个有向无环图，如下：

![](/images/jueJin/f76e9c3e4e644ee.png)

（图片来自于鸿蒙官方）

hvigor生命周期有3个阶段，分为初始化、配置和执行，hvigor会按顺序运行这些阶段，每个阶段都有特定的任务和目的。

### 1、初始化

目的：初始化项目的编译参数，构造出项目结构的树形数据模型

步骤：

1.构造树形数据模型：每个节点（node）为一个HvigorNode对象。

2.设置构建参数：

1.根据命令参数和hvigor-config.json5 文件中的配置，设置Hvigor构建参数。

2.构造出hvigor对象和hvigorConfig对象。

3.检测配置文件：检测build-profile.json5文件的存在及其有效性。

4.创建节点描述符：

1.通过项目根目录下的build-profile.json5文件，创建出 rootNodeDescriptor实例。

2.通过 rootNodeDescriptor中的modules字段，初始化出工程中所有模块的NodeDescriptor对象实例。

5.执行配置文件：

1.执行项目根目录下的hvigorconfig.ts文件。

2.在hvigorconfig.ts文件中，可以通过Hvigor的相关 API 来为生命周期注册hook或在构建开始时进行其他处理。

6.构造节点对象：根据节点描述对象构造出每个节点的HvigorNode对象实例

### 2、配置

目的：加载每个节点的插件（plugin）、任务（task）和任务依赖关系图（DAG图）

步骤：

1.加载插件和任务：

1.执行每个节点中的hvigorfile.ts文件，为每个节点添加插件（向Hvigor注册任务）。

2.执行插件的apply 方法，并添加插件的上下文。

2.构造DAG图：根据前一步加载出的插件和任务，根据任务执行的依赖关系构造出DAG图

### 3、执行

目的：执行选定的任务

步骤：

1.确定任务顺序：任务之间的依赖关系决定了任务执行顺序。

2.并行执行任务：任务可以并行执行，以提高构建效率。

![](/images/jueJin/28128249a7244f3.png)

（图片来自于鸿蒙官方）

Hvigor构建工具通过以上这三个阶段的处理，确保了构建过程的有序和高效并对外提供了灵活的配置和扩展能力：

1.初始化阶段：构建项目结构和初始化参数。

2.配置阶段：加载插件、任务和构建DAG图。

3.执行阶段：按依赖关系执行任务，并行处理以提升效率。

### 4、生命周期内Hook点

针对以上生命周期的3个阶段，有很多的hook点可以使用，下图所有绿色标记的线框都是可使用的hook点：

![](/images/jueJin/7243c8b4251948a.png)

（图片来自于鸿蒙官方）

三、构建任务和产物
---------

### 1、HAP基础任务流程图

使用run即可在build看到每个任务，或者在Terminal中使用hvigorw taskTree命令查看执行任务，在官方文档中可以查看每个任务的具体说明，但鸿蒙目前尚不支持对各Task产物进行修改

### 2、HAP构建产物说明

打出的Release包一般包含以下文件：

•resources：构建产物中的资源文件目录，如图片、媒体资源、配置文件等。

•modules.abc：构建产物中通过源码编译出的字节码文件。

•module.json：构建产物中通过模块src目录中的module.json5处理后的运行时配置文件

•resources.index：构建产物中的资源索引文件, 包含模块中所有的资源ID、资源名称、资源类型以及资源值等信息。

•pack.info：构建产物中的包内容描述文件，在安装升级时提供相关信息

四、上手开发Task
----------

编辑工程下hvigorfile.ts文件，使用HvigorNode节点对象注册任务

```javascript
// 获取当前hvigorNode节点对象const node =getNode(__filename);
// 注册Task
    node.registerTask({
    name:'TaskName',//task名字
        run(){
        //实现run方法，在里面实现自定义操作
        }});
        
        //执行Task
        hvigorw TaskName
```

五、上手开发Plugin
------------

```javascript
//1 在hvigorfile.ts中定义插件方法，实现HvigorPlugin接口
    function customPlugin(): HvigorPlugin {
        return{
        pluginId:'customPlugin',
            apply(node: HvigorNode){
            // 插件主体
            console.log('hello customPlugin!');
        }
    }}
        //2 在导出声明中使用插件exportdefault{
        system: appTasks,
            plugins:[
            customPlugin()  // 应用自定义Plugin
        ]}
        
        //3 执行
        hvigorw --sync
```

如果只是针对单个工程开发一个简单的Plugin，可直接在工程或模块下hvigorfile.ts文件编写，要是想进行复用和多个工程共享，可以抽取成一个单独的typescript项目

六、开发一个路由插件
----------

在使用Navigation系统路由时，需要配置路由表文件route\_map和每个页面的入口函数Builder，而且函数名两者需要保持一致，这个操作可以通过自定义Plugin的方式来解决，但是配置文件多人协同开发时，自动生成产物修改频繁，冲突问题较为严重。目前鸿蒙官方也提供了HMRouter官方路由方案，功能更为齐全，后续大家可以使用体验。

### 1、介绍下AST

抽象语法树 (Abstract Syntax Tree，AST)，是源代码语法结构的一种抽象表示。以树状的形式表现编程语言的语法结构，每个节点都表示源代码中的一种结构。可以看个例子：

```arduino
let name ='jd'

转的语法树如下：
    file: File{
    type: File,
    // 初始到结尾有几个字符
    start:0,
    end:18,
    ...
        program: Program{
        type: Program,
        body:{// 所有的内容都存在body里面
        VariableDeclaration:{// 变量定义
        // 声明变量、运算符、标识符.....这些语法格式在树中都有一个对应
            declarations:[
                VariableDeclarator:{
                // 初始化，字符串字面量
                    init: StringLiteral {
                    type :'StringLiteral',
                    start:11,
                    end:15,
                    // 值
                    value:'jd'
                }
            }
            ],
            kind:'let'//类型
        }
    }
}}
```

### 2、开发思路

1.实现一个自定义装饰器，定义参数，并在目标文件上声明使用

2.在编译期间通过扫描并解析TS语法树，遍历指定文件节点，获取注解里定义的路由信息

3.编译期间动态生成路由表、注册类、Index文件，将读取的信息写到文件中

4.Har中的rawfile文件在Hap编译时会打包在Hap中，通过这一机制来实现路由表的合并

5.自定义组件通过wrapBuilder封装来实现动态获取

6.通过NavDestination的Builder机制来获取wrapBuilder封装后的自定义组件

### 3、实现自定义装饰器

```typescript
    export function JRRouter(param:JRRouterParam){
    return Object;
}

    export interface JRRouterParam{
    name: string;
    routerMode: boolean;
    extra?: string;
    jumpCode?: string;
}
```

### 4、环境初始化

开发环境：Node.js 16 ~ 18 (推荐)

请先安装node.js并将可执行文件路径配置到环境变量PATH中

### 5、初始化typescript项目

#### 5.1、创建一个空目录

在命令行工具中使用cd命令进入空目录下

#### 5.2、安装typescript模块

```bash
# 全局安装TypeScript
npm install typescript -g
```

#### 5.3、初始化npm项目

```csharp
# 初始化一个npm项目
npm init
```

#### 5.4、生成typescript配置文件

```csharp
# 初始化typeScript配置文件
tsc --init
```

#### 5.5、依赖配置

1.配置npm镜像仓库地址

在用户目录下创建或打开.npmrc文件，配置如下信息：

```ruby
registry=https://repo.huaweicloud.com/repository/npm/
@ohos:registry=https://repo.harmonyos.com/npm/
```

1.添加依赖声明

打开package.json添加devDependencies配置。

```perl
    "devDependencies": {
    "@ohos/hvigor": "4.0.2"
}
```

1.安装依赖

执行如下命令安装依赖

```
npm install
```

### 6、编写插件代码

创建JRouterPlugin.ts文件，编写插件代码，下面是详细代码和注释

```scss
/**
* 获取指定路径下所有文件的路径
* @param directoryPath - 要扫描的目录路径
* @returns 所有文件的路径数组
*/
    function getAllFiles(directoryPath: string): string[] {
        return readdirSync(directoryPath).reduce((files, file) => {
        const filePath = join(directoryPath, file);
        const isDirectory = statSync(filePath).isDirectory();
        return isDirectory ? [...files, ...getAllFiles(filePath)] : [...files, filePath];
        }, []);
    }
    
    /**
    * 生成 Builder 文件
    * @param templateModel - 模板数据模型
    * @param config - 插件配置
    */
        function createBuilderFile(templateModel: TemplateModel, config: RouterPluginConfig) {
        const builderFilePath = join(config.generatedDir, ROUTER_BUILDER_NAME);
            if (existsSync(builderFilePath)) {
            unlinkSync(builderFilePath);
        }
        ....
            if (!existsSync(config.generatedDir)) {
            mkdirSync(config.generatedDir, { recursive: true });
        }
        writeFileSync(builderFilePath, output, { encoding: "utf8" });
    }
    
    /**
    * 生成路由映射文件
    * @param routerMap - 路由映射数据
    * @param config - 插件配置
    */
        function createRouterMapFile(routerMap: RouterMap, config: RouterPluginConfig) {
        const jsonOutput = JSON.stringify(routerMap, null, 2);
        writeFileSync(config.routerMapDir, jsonOutput, { encoding: "utf8" });
    }
    
    /**
    * 生成 Index 文件
    * @param templateModel - 模板数据模型
    * @param config - 插件配置
    */
        function createIndexFile(templateModel: TemplateModel, config: RouterPluginConfig) {
        const indexPath = join(config.indexDir, 'Index.ets');
        const importPath = getRelativeImportPath(config.indexDir, getBuilderFilePath(config));
        const data = `export * from './${importPath}'`;
        
            if (!existsSync(indexPath)) {
            writeFileSync(indexPath, data, 'utf-8');
            return;
        }
        
        let content = readFileSync(indexPath, { encoding: "utf8" });
        const lines = content.split('\n').filter(Boolean);
        const targetLine = lines.find(line => line === data);
        
            if (isEmpty(targetLine) && templateModel.viewList.length > 0) {
            lines.push(data);
            writeFileSync(indexPath, lines.join('\n'), { encoding: "utf8" });
                } else if (!isEmpty(targetLine) && templateModel.viewList.length <= 0) {
                const targetIndex = lines.indexOf(targetLine);
                lines.splice(targetIndex, 1);
                writeFileSync(indexPath, lines.join('\n'), { encoding: "utf8" });
            }
        }
        
        /**
        * 获取相对导入路径
        * @param from - 源路径
        * @param to - 目标路径
        * @returns 相对导入路径
        */
            function getRelativeImportPath(from: string, to: string): string {
            let importPath = relative(from, to).replace(/\/g, '/');
            return importPath.replace('.ets', '');
        }
        
        /**
        * 插件的执行逻辑
        * @param pluginConfig - 插件配置
        */
            function executePlugin(pluginConfig: RouterPluginConfig) {
            const templateModel: TemplateModel = { viewList: [] };
            const routerMap: RouterMap = { routerMap: [] };
            
            // 扫描目录文件到集合
            const files: string[] = getAllFiles(pluginConfig.scanDir);
                files.forEach((file) => {
                if (!file.endsWith(".ets")) return;
                
                const importPath = relative(pluginConfig.generatedDir, file).replace(/\/g, "/").replace(".ets", "");
                const analyzer = new JREtsAnalyze(file);
                
                // 开始扫描每个文件
                analyzer.start();
                    if (analyzer.isExistAnnotation()) {
                    ....
                }
                });
                
                    try {
                    // 生成路由方法文件
                    createBuilderFile(templateModel, pluginConfig);
                    // 生成路由表文件
                    createRouterMapFile(routerMap, pluginConfig);
                    // 生成 Index.ets 文件
                    createIndexFile(templateModel, pluginConfig);
                        } catch (e) {
                        console.error(`Error during plugin execution: ${e}`);
                    }
                }
                
                /**
                * 获取 Builder 注册文件的绝对路径
                * @param config - 插件配置
                * @returns Builder 注册文件的绝对路径
                */
                    function getBuilderFilePath(config: RouterPluginConfig): string {
                    return join(config.generatedDir, ROUTER_BUILDER_NAME);
                }
                
                /**
                * 获取相对模块路径
                * @param fullPath - 完整路径
                * @param moduleDir - 模块目录
                * @returns 相对模块路径
                */
                    function getRelativeModulePath(fullPath: string, moduleDir: string): string {
                    const relativePath = fullPath.replace(moduleDir, '');
                    return relativePath.substring(1).replace(/\/g, '/');
                }
                
                /**
                * 插件配置初始化，外部也可设置
                * @param node - Hvigor 节点
                * @param pluginConfig - 插件配置
                * @returns 初始化后的插件配置
                */
                    function initializeConfig(node: HvigorNode, pluginConfig?: RouterPluginConfig): RouterPluginConfig {
                    pluginConfig = pluginConfig ?? {} as RouterPluginConfig;
                    pluginConfig.indexDir = `${node.getNodePath()}/`;
                    const dir = join(node.getNodePath(), ROUTER_MAP_PATH);
                    
                        if (!existsSync(dir)) {
                        mkdirSync(dir, { recursive: true });
                    }
                    
                    pluginConfig.routerMapDir = join(dir, MAP_NAME);
                    pluginConfig.generatedDir = join(node.getNodePath(), ROUTER_BUILDER_PATH);
                    pluginConfig.scanDir = join(node.getNodePath(), ROUTER_SCAN_DIR);
                    pluginConfig.modulePath = node.getNodePath(); // 模块路径
                    pluginConfig.moduleName = node.getNodeName(); // 模块名
                    pluginConfig.moduleJsonPath = join(node.getNodePath(), 'src/main/module.json5');
                    
                    return pluginConfig;
                }
                
                /**
                * 插件的入口函数
                * @param pluginConfig - 插件配置
                * @returns HvigorPlugin 对象
                */
                    export function routerPlugin(pluginConfig?: RouterPluginConfig): HvigorPlugin {
                        return {
                        pluginId: PLUGIN_ID, // 插件 ID
                            apply(node: HvigorNode) {
                            executePlugin(initializeConfig(node, pluginConfig));
                        }
                        };
                    }
```

解析操作

```typescript
    export class JREtsAnalyze {
    analyzeResult: JRAnalyzeResult = new JRAnalyzeResult();
    sourcePath: string;
    
    /**
    * 构造函数，初始化 EtsAnalyzer 实例
    * @param filePath - 要分析的文件路径
    */
        constructor(filePath: string) {
        this.sourcePath = filePath;
    }
    
    /**
    * 启动分析过程
    */
        analyze() {
        // 读取文件内容
        const sourceCode = readFileSync(this.sourcePath, "utf-8");
        // 解析文件内容，生成节点树信息
        const sourceFile = ts.createSourceFile(this.sourcePath, sourceCode, ts.ScriptTarget.ES2021, false);
        // 遍历节点信息
            ts.forEachChild(sourceFile, (node) => {
                try {
                // 解析节点
                this.parseNode(node);
                    } catch (e) {
                    console.error('Error while parsing node: ', e);
                }
                });
            }
            
            /**
            * 解析节点
            * @param node - 要解析的 TypeScript 节点
            * @private
            */
                private parseNode(node: ts.Node) {
                let isDefaultExport = false;
                    switch (node.kind) {
                    case ts.SyntaxKind.ExportAssignment:
                    case ts.SyntaxKind.MissingDeclaration:
                        if (node.kind === ts.SyntaxKind.ExportAssignment) {
                        isDefaultExport = true;
                    }
                    const childNode = node as ts.ParameterDeclaration;
                    const modifiers = childNode.modifiers;
                    // 处理装饰器节点
                        if (modifiers && modifiers.length >= 2) {
                            modifiers.forEach((modifier) => {
                                try {
                                this.parseDecorator(modifier, isDefaultExport);
                                    } catch (e) {
                                    ...
                                }
                                });
                            }
                            break;
                            case ts.SyntaxKind.ExpressionStatement: // 表达式节点
                            this.parseExpression(node);
                            break;
                        }
                    }
                    
                    /**
                    * 解析表达式节点
                    * @param node - 要解析的 TypeScript 节点
                    * @private
                    */
                        private parseExpression(node: ts.Node) {
                        const expressionStatement = node as ts.ExpressionStatement;
                            if (expressionStatement.expression?.kind === ts.SyntaxKind.Identifier) {
                            const identifier = expressionStatement.expression as ts.Identifier;
                                if (identifier.escapedText !== "struct" && this.hasAnnotation()) {
                                this.analyzeResult.pageName = `${identifier.escapedText}`;
                            }
                        }
                    }
                    
                    /**
                    * 解析装饰器
                    * @param node - 要解析的 TypeScript 节点
                    * @param isDefaultExport - 是否为默认导出
                    * @private
                    */
                        private parseDecorator(node: ts.Node, isDefaultExport: boolean = false) {
                        // 转换为装饰器节点类型
                        const decorator = node as ts.Decorator;
                        // 判断类型是否为函数调用
                            if (decorator.expression.kind === ts.SyntaxKind.CallExpression) {
                            const callExpression = decorator.expression as ts.CallExpression;
                            // 判断是否为标识符
                                if (callExpression.expression.kind === ts.SyntaxKind.Identifier) {
                                const identifier = callExpression.expression as ts.Identifier;
                                const args = callExpression.arguments;
                                // 判断装饰器名字是否为自定义的
                                    if (identifier.text === ANNOTATION_NAME && args?.length > 0) {
                                    this.analyzeResult.isDefaultExport = isDefaultExport;
                                    const arg = args[0];
                                    // 判断第一个参数是否为对象字面量表达式
                                        if (arg.kind === ts.SyntaxKind.ObjectLiteralExpression) {
                                        const properties = (arg as ts.ObjectLiteralExpression).properties;
                                        // 遍历装饰器中的所有参数
                                            properties.forEach((property) => {
                                                if (property.kind === ts.SyntaxKind.PropertyAssignment) {
                                                .....
                                            }
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        
                        /**
                        * 判断是否存在注解
                        * @returns 是否存在注解
                        */
                            hasAnnotation() {
                            return isNotEmpty(this.analyzeResult.name);
                        }
                    }
                    
                    /**
                    * 判断字符串是否为空
                    * @param str - 要判断的字符串
                    * @returns 是否为空
                    */
                        export function isEmpty(str: string | undefined | null) {
                        return str === undefined || str === null || str.trim().length === 0;
                    }
                    
                    /**
                    * 判断字符串是否不为空
                    * @param str - 要判断的字符串
                    * @returns 是否不为空
                    */
                        export function isNotEmpty(str: string | null | undefined) {
                        return !isEmpty(str);
                    }
```

### 7、导出插件使用

创建index.ts文件，并在该文件中声明插件方法的导出

```javascript
export { routerPlugin } from './src/JRouterPlugin';
```

七、总结
----

本文介绍了Hvigor在鸿蒙系统中的应用，包括Task和Plugin开发，通过阅读上述代码示例和开发思路，会让大家对Hvigor有更深的了解。