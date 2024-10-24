---
author: "政采云技术"
title: "化繁为简：Flutter组件依赖可视化"
date: 2023-12-06
description: "各个业务模块之间的依赖关系是怎样的？如何能让依赖关系可视化？原生有没有这种通用的技术方案？答案是显而易见的。"
tags: ["Flutter中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:63,comments:0,collects:85,views:5464,"
---
![文章顶部.png](/images/jueJin/b637793da67b4e0.png)

![参宿.png](/images/jueJin/1ab1ccd1af8a4dd.png) ![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3637d222676642d5af9474689e6c415d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1913&h=960&s=165951&e=png&b=fafafa](/images/jueJin/f9a426f14c5a4d3.png)

1 前言
====

正在使用 Flutter 开发的你是否也有这样的困扰：组件繁多，依赖关系错综复杂，理不清头绪，看不清耦合。那么有没有一种工具或者方法让我们的依赖关系变得清晰明了，让人秒懂呢？我们给出答案就是：依赖关系可视化。

那么我们如何才能得到一张结构清晰、效果酷炫的依赖关系图呢？跟随我的脚步，我们一起剖析如何实现 Flutter 的依赖可视化。

2 行业技术调研
========

当开始对 Flutter 工程做组件化拆分的时候，我们会自然而然地想到：各个业务模块之间的依赖关系是怎样的？如何能让依赖关系可视化？原生有没有这种通用的技术方案？答案是显而易见的。

2.1 Android
-----------

通过 Gradle 编写任务，遍历 Project，分析组件依赖情况，收集 Project 的 ProjectName 和 Dependencies，整理出依赖关系，输出 .dot 文件通过 Graphviz 图形可视化。具体参考 JakeWharton 的 [projectDependencyGraph.gradle](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FJakeWharton%2FSdkSearch%2Fblob%2Fmaster%2Fgradle%2FprojectDependencyGraph.gradle "https://github.com/JakeWharton/SdkSearch/blob/master/gradle/projectDependencyGraph.gradle")。

2.2 iOS
-------

通过 CocoaPods 实现，解析项目的 Podfile，构建依赖关系图，进行依赖决策，生成 Podfile.lock 文件，整理出依赖关系，通过 Graphviz 图形可视化。具体参考 [cocoapods-dependencies](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsegiddins%2Fcocoapods-dependencies "https://github.com/segiddins/cocoapods-dependencies")。

2.3 Flutter
-----------

通过资料检索发现做 Flutter 依赖可视化的方案很少，在调研过程中发现了一个宝藏库 [gviz](https://link.juejin.cn?target=https%3A%2F%2Fpub.dev%2Fpackages%2Fgviz%2Fchangelog "https://pub.dev/packages/gviz/changelog"), 其原理和 Android、iOS 类似，也是通过 Graphviz 图形可视化。

本文将基于 gviz 库深入源码进行剖析，一起来学习作者的思路吧。

可以看出，基本上所有可视化方案都会使用一个叫做 Graphviz 的图形可视化工具。那么什么是 Graphviz 呢？它是用来干嘛的呢？我们接着往下看。

3 什么是Graphviz？
==============

Graphviz（Graph Visualization Software）是一个开源的图形可视化软件，它能够从简单的文本文件描述中生成复杂的图形和网络。它使用一种名为 DOT 的描述语言来定义图形，使得用户可以专注于内容而非布局和设计。

> Graphviz 的主要特点和用途包括： 1.灵活的渲染功能：Graphviz 可以生成多种格式的图形文件，包括 raster 和 vector 格式，如 PNG、PDF、SVG 等。 2.自动布局：Graphviz 的一个主要特点是其自动布局能力。用户只需定义图的元素和它们之间的关系，Graphviz 就能够自动计算出合适的布局。 3.扩展性：Graphviz 提供了多种工具和库，可以用于各种应用，如 Web 服务、生成报告，或与其他软件的集成。 4.广泛的应用：Graphviz 被广泛用于各种领域，包括软件工程（如代码依赖关系图）、网络设计和分析、生物信息学（如基因表达网络）等。

更过关于 Graphviz 相关的内容可以查看 [graphviz.org/](https://link.juejin.cn?target=https%3A%2F%2Fgraphviz.org%2F "https://graphviz.org/")。介绍到这里，大家对 Graphviz 已经有了基本的概念，也知道了可视化是要通过 Graphviz 来实现。那么接下来我们就从一个小 Demo 开始，跟着我来了解一个简单的 Flutter 依赖可视化小工具是如何实现的。

4 从一个Demo开始
===========

先来看一个简单的 Demo。我们知道 Dart/Flutter 项目基于 pubspec.yaml 文件管理组件之间的依赖关系，比如组件 A 的依赖关系如下：

```yaml
name: moudule_a
version: 1.0.0
​
environment:
sdk: '>=2.17.0 <3.0.0'
​
dependencies:
path: ^1.8.0
module_b:
path: module_b
```

可以看出组件 A 依赖了组件 B（module\_b）和其他 SDK。 组件 B 的依赖关系如下：

```yaml
name: moudule_b
version: 0.0.1
​
environment:
sdk: '>=2.17.0 <3.0.0'
​
dependencies:
meta: 1.7.0
```

4.1 我们要实现的效果
------------

通过看代码我们也能知道 Demo 的组件依赖关系，但是依赖可视化最重要是要得到一张像下面这样的一张能直观展现依赖关系的图， 那么我们怎么才能实现呢？

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2499f7fa8d4849c584d6fa6d19dbad13~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=748&h=876&s=274081&e=png&b=fdfdfd](/images/jueJin/44b896e1d082411.png)

4.2 如何才能实现依赖可视化
---------------

我们来重新梳理一下思路。由前面得知：

1、 我们需要使用 Graphviz 强大的能力来绘制依赖关系

2、Graphviz 需要使用 DOT 语言来定义图形

3、我们工程的依赖关系是存储在 .yaml 文件中

所以我们的整体思路应该如下所示：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5043e8a37162469690286ce80403f7a3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=560&h=111&s=28157&e=png&b=fef1ef](/images/jueJin/3d07b4456117438.png)

5 绘制步骤详解
========

有了上面的步骤指导，只需要按照步骤把“大象装进冰箱”即可，gviz 的整个绘制步骤流程主要分为以下三大步。

5.1 工程依赖分析
----------

### 5.1.1 获取主工程依赖

主工程的依赖关系主要存在于 .yaml 文件中，针对当前项目（一般指主工程）的依赖关系，可以通过 `yaml: ^3.0.0` 来进行解析。`yaml: ^3.0.0` 的解析结果是一个 Dart 的类（Pubspec）。 Pubspec 类图如下所示：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a6ee65ad32c4a4bb92a8420d4b9dd84~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=462&h=299&s=39939&e=png&b=fcf9d0](/images/jueJin/0f96ccc8a88d4a9.png)

获取主工程依赖清单的代码如下所示 ：

```less
/// 基于 .yaml 文件生成 Pubspec 类
    Pubspec rootPubspec() {
    assert(
    Directory(rootPackageDir).existsSync(),
    '`$rootPackageDir` does not exist.',
    );
    ​
    // 获取 pubspec.yaml 文件路径
    final pubspecPath = p.join(rootPackageDir, 'pubspec.yaml');
    ​
    // 将 pubspec.yaml 文件转换成 Pubspec 对象
    return Pubspec.parse(
    File(pubspecPath).readAsStringSync(),
    sourceUrl: Uri.parse(pubspecPath),
    );
}
```

解析出来的主工程依赖清单 （Pubspec） 具体内容如图所示：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc22f6eb3cde4ffabc044fc39e05f876~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=609&h=432&s=174743&e=png&b=434746](/images/jueJin/cbe17e2b818f400.png)

### 5.1.2 获取所有子组件工程的依赖清单

和获取主工程的依赖清单方式不同，gviz 获取子组件工程的依赖树使用了另一种方式。

Flutter 官方提供了解析组件依赖树的命令行工具 `flutter pub deps -s list` ，该工具可以用来获取组件间的依赖关系清单。gviz 使用这个命令行工具的具体实现如下：

```ini
final commandArgs = _pubCommand(['deps', '-s', 'list']);
​
/// 执行 flutter pub deps -s list 命令，获取命令行执行结果
    String _pubCommand(List<String> commandArgs) {
    final proc = _isFlutterPkg ? 'flutter' : 'dart';
        final args = [
        ...['pub'],
        ...commandArgs
        ];
        ​
        final result = Process.runSync(
        proc,
        args,
        runInShell: true,
        workingDirectory: rootPackageDir,
        );
        ​
        return result.stdout as String;
    }
```

解析出来的结果如下所示：

```yaml
Dart SDK 2.17.0
Flutter SDK 3.0.0
module_a 1.0.0
​
dependencies:
path 1.8.3
module_b 0.0.1
meta 1.7.0
​
transitive dependencies:
meta 1.7.0
​
```

5.2 依赖格式转换
----------

有了前面的依赖关系清单，接下来主要做的就是要把工程的依赖关系转化为 Graphviz 可以直接使用的 DOT 描述语言。

但是，细心的读者可能已经发现了问题。最后需要在一张图里面完全展示所有的依赖关系，但是现在两部分的依赖关系是分开存储的，并且数据结构还不太一样，gviz 作者也对这两部分的依赖关系做了一个合并。

### 5.2.1 依赖格式统一

要相对依赖做合并，就需要一个更大的数据结构来承载主工程和所有组件的依赖。这里作者引入一个新的自定义类 VizPackage。

VizPackage 类来描述一个三方 SDK 信息，它包括名称、版本号及依赖其他 SDK 的集合。VizPackage 类图如下所示：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5320d9ece2774bb7bad192d88755a1c6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=481&h=132&s=15666&e=png&b=fbefe6](/images/jueJin/f455b0c8e310478.png)

用 Dependency 类来描述一个依赖关系，它包括名称、版本号。Dependency 类图如下所示：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c95aca16f35c407ebe719c47d958b5eb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=514&h=119&s=14119&e=png&b=fbefe6](/images/jueJin/7b344d7e7316470.png)

有了这样一个大的数据结构来承载所有的依赖信息，接下来只需要将两部分依赖信息分别转换成 VizPackage 就可以了。

#### 5.2.1.1 主工程依赖数据结构转换

对 5.1.1 章节中的输出结果进行依赖解析，将依赖关系转换为 VizPackage：

```scss
/// pubspec为5.1.1中获取主工程依赖
final pubspec = rootPubspec();
​
/// 主工程的依赖信息 转 VizPackage
VizPackage rootPackage = VizPackage(
pubspec.name,
null,
Dependency.getDependencies(
pubspec,
includeDevDependencies: !productionDependenciesOnly,
),
null,
);
​
/// Pubspec 转 Dependency
static Set<Dependency> getDependencies(
    parse.Pubspec pubspec, {
    bool includeDevDependencies = true,
        }) {
        // 依赖关系结果集
        final deps = <Dependency>{};
        ​
        // 正式依赖：对应 pubspec.yaml 中的 dependencies
        _populateFromSection(pubspec.dependencies, deps, false);
            if (includeDevDependencies) {
            // 开发依赖：对应 pubspec.yaml 中的 dev_dependencies
            _populateFromSection(pubspec.devDependencies, deps, true);
        }
        return deps;
    }
```

#### 5.2.1.2 组件依赖数据结构转换

对 5.1.2 章节中的输出结果进行依赖解析，将依赖关系转换为 VizPackage。由于直接获取到的组件依赖的数据结构是一个字符串类型，要先对字符串做解析，才能获取到其中的有用信息，所以这里需要再引入一个自定义数据结构 DepsList。主要包括 SDK 行匹配、包依赖匹配、空行匹配、依赖的 SDK 集合和 parse 转换方法。如下是 DepsList 的类图：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d863866b90b40ac826eccbf7bccd7ff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1033&h=189&s=44255&e=png&b=fcf0df](/images/jueJin/e2b70e5bdc09454.png)

其中 sections 是一个依赖关系集合，它以 Key-Value 的形式存储了所有组件的依赖信息。如下代码展示如何将一个字符串依赖关系转换成 sections 来进行管理：

```dart
// 匹配一个包的名字的正则表达式
const _identifierRegExp = r'[a-zA-Z_]\w*';
​
// 匹配允许的软件包名称的正则表达式
const _pkgName = '$_identifierRegExp(?:\.$_identifierRegExp)*';
​
/// Section头匹配正则，例如：dependencies:
final _sectionHeaderLine = RegExp(r'([a-zA-Z ]+):\n');
/// 一级包依赖匹配正则，例如：http 0.13.4
final _usageLine = RegExp('- ($_pkgName) (.+)\n');
/// 二级包依赖匹配正则，例如：async ^2.5.0
final _depLine = RegExp('  - ($_pkgName) (.+)\n');
​
/// scanner就是4.1.2中获取到的所有组件依赖关系的字符串
MapEntry<String, Map<VersionedEntry, Map<String, VersionConstraint>>>
    _scanSection(StringScanner scanner) {
    /// 开始匹配Section头
    scanner.expect(_sectionHeaderLine, name: 'section header');
    final header = scanner.lastMatch![1]!;
    ​
    /// 依赖关系结果集，key: 一级包信息，value: 二级包依赖信息
    final entries = <VersionedEntry, Map<String, VersionConstraint>>{};
    ​
        void scanUsage() {
        /// 开始匹配一级包依赖
        scanner.expect(_usageLine, name: 'dependency');
        final entry = VersionedEntry.fromMatch(scanner.lastMatch!);
        assert(!entries.containsKey(entry.name));
        ​
        final deps = entries[entry] = {};
        ​
        /// 开始匹配二级包依赖
            while (scanner.scan(_depLine)) {
            deps[scanner.lastMatch![1]!] =
            VersionConstraint.parse(scanner.lastMatch![2]!);
        }
    }
    ​
        do {
        scanUsage();
        } while (scanner.matches(_usageLine));
        ​
        return MapEntry(header, entries);
    }
```

至此，组件间依赖的数据结构被转换成了 DepsList 类型。但是主工程的依赖是 VizPackage 类型。二者数据结构不同，仍然不能直接合并。接下来需要对就需要再将 DepsList 转换为 VizPackage 类型。

由于 DepsList 中的 sections 存储了所有组件的依赖关系，下面展示一下如何将单个 section 转换为 VizPackage。全部转换只需遍历调用即可。

```javascript
/// 将DepsList中，sections中单个元素的格式转换为 VizPackage
    VizPackage addPkg(VersionedEntry key, Map<String, VersionConstraint> value) {
    final pkg = VizPackage(
    key.name,
    key.version,
    SplayTreeSet.of(
    value.entries
    .where((element) => !_ignoredPackages.contains(element.key))
    .map(
    (entry) => Dependency(entry.key, entry.value.toString(), false),
    ),
    ),
    flagOutdated ? _latest(key.name) : null,
    );
    return pkg;
}
```

### 5.2.2 依赖合并

经过上面两个步骤，主工程的的依赖和组件间的依赖都已经被转换成了 VizPackage 类型，那么怎么对他们进行合并呢？

作者创建了一个 Map<String, VizPackage>，其中 key 是各个组件的名称，value（VizPackage） 是该组件的依赖关系，主工程也当做一个组件来处理。

最终，所有的依赖关系都会被存储到这个 Map 中去。核心代码如下所示：

```javascript
/// 获取主工程依赖关系
    Pubspec rootPubspec() {
    // ...参考 5.1.1 章节代码
}

/// 获取所有组件的依赖关系
/// ...参考 5.1.2 章节代码
    DepsList rootDeps() {
    final commandOutput = _pubCommand(['deps', '-s', 'list']);
    return DepsList.parse(commandOutput);
}

/// 所有依赖关系合并
Future<Map<String, VizPackage>> getReferencedPackages(
bool flagOutdated,
bool directDependenciesOnly,
bool productionDependenciesOnly,
    ) async {
    /// 1. 创建最后的依赖关系结果集
    final map = SplayTreeMap<String, VizPackage>();
    
    /// 2.1 获取主工程依赖关系
    final deps = rootPubspec();
    
    /// 2.2 主工程的依赖关系转换
    rootPackge = VizPackage(
    pubspec.name,
    null,
    Dependency.getDependencies(
    pubspec,
    includeDevDependencies: !productionDependenciesOnly,
    ),
    null,
    );
    
    /// 2.3 主工程的依赖关系保存
    map[rootPackge.name] = rootPackge;
    
    /// 3.1 获取组件间依赖关系
    final deps = rootDeps();
    
    /// 3.2 组件间依赖关系转换并保存
    addSectionValues(deps.sections['dependencies'] ?? const {})
    
    /// 3.2.1 遍历组件间依赖，转换依赖关系
    void addSectionValues(
    Map<VersionedEntry, Map<String, VersionConstraint>> section,
        ) {
            for (var entry in section.entries) {
            addPkg(entry.key, entry.value);
        }
    }
    
    /// 3.2.2 将依赖关系转换为 VizPackage，并保存
        void addPkg(VersionedEntry key, Map<String, VersionConstraint> value) {
        final pkg = VizPackage(
        key.name,
        key.version,
        SplayTreeSet.of(
        value.entries
        .where((element) => !_ignoredPackages.contains(element.key))
        .map(
        (entry) => Dependency(entry.key, entry.value.toString(), false),
        ),
        ),
        flagOutdated ? _latest(key.name) : null,
        );
        map[pkg.name] = pkg;
    }
    return map;
}
```

至此，两部分依赖关系被转换成为了同一个数据结构，并合并到了一起。接下来只需要将最终结果转换成 DOT 就可以愉快地拿去可视化了。

### 5.2.3 将依赖树Map转换为DOT格式

这里作者采用了 Graphviz 库来实现。依赖方式如下：

```yaml
dependencies:
gviz: ^0.4.0
```

具体的转换逻辑封装到了`toDot`方法中：

```dart
import 'package:gviz/gviz.dart';

/// 将依赖关系结果集转换成 dot 文本
/// [packages] 项目依赖关系结果集
/// [ignorePackages] 需要忽略的 package 名称
String toDot(
    Map<String, VizPackage> packages, {
    bool escapeLabels = false,
    Iterable<String> ignorePackages = const [],
        }) {
        // 初始化 Gviz，设置绘制属性
        final gviz = Gviz(
        name: 'demo',
        graphProperties: {'nodesep': '0.2'},
        edgeProperties: {'fontcolor': 'gray'},
        );
        for (var pack
            in packages.values.where((v) => !ignorePackages.contains(v.name))) {
            gviz.addBlankLine();
            _writeDot(pack, gviz, 'demo', escapeLabels, ignorePackages);
        }
        return gviz.toString();
    }
    
    // 绘制点和连线
    void _writeDot(
    VizPackage pkg,
    Gviz gviz,
    String rootName,
    bool escapeLabels,
    Iterable<String> ignorePackages,
        ) {
        final isRoot = rootName == pkg.name;
        final newLine = escapeLabels ? r'\n' : '\n';
        
        // 模块展示内容：名称+版本号
        var label = pkg.name;
            if (pkg.version != null) {
            label = '$label$newLine${pkg.version}';
        }
        final props = {'label': label};
        
        // ...设置字体，间距等样式，此部分代码省略
        
        // 追加节点
        gviz.addNode(pkg.name, properties: props);
        final orderedDeps = pkg.dependencies.toList(growable: false)..sort();
            for (var dep in orderedDeps.where((d) => !ignorePackages.contains(d.name))) {
                if (!dep.isDevDependency || isRoot) {
                final edgeProps = <String, String>{};
                // 连线展示内容
                    if (!dep.versionConstraint.isAny) {
                    edgeProps['label'] = '${dep.versionConstraint}';
                }
                // ...设置字体，间距等样式，此部分代码省略
                    if (dep.name == rootName) {
                    // 如果一个包依赖于根节点，它不应该影响布局
                    edgeProps['constraint'] = 'false';
                }
                // 绘制连线
                gviz.addEdge(pkg.name, dep.name, properties: edgeProps);
            }
        }
    }
```

以前面的 Demo 工程为例，输出的 .dot 文件内容如下：

```css
    digraph demo {
    graph [nodesep="0.2"];
    edge [fontcolor=gray];
    meta [label="meta 1.7.0", shape=box, margin="0.25,0.15"];
    module_a [label=module_a, fontsize="18", style=bold, shape=box, margin="0.25,0.15"];
    module_a -> module_b [label="<empty>", penwidth="2"];
    module_a -> path [label="^1.8.0", penwidth="2"];
    module_b [label="module_b 0.0.1", shape=box, margin="0.25,0.15", style=bold];
    module_b -> meta [label="1.7.0"];
    path [label="path 1.8.3", shape=box, margin="0.25,0.15", style=bold];
}
```

5.3 绘制可视化关系图
------------

有了前面的一系列铺垫，要生成依赖关系图，只需通过一行简单的 dot 命令：

安装 graphviz：

```
brew install graphviz
```

执行 dot 命令输出依赖关系图：

```matlab
dot x.dot -T png -o x.png
```

至此我们已经可以从一个工程中，分析依赖，并得到了一张清晰明了的依赖关系图。 例如，Demo工程的依赖关系图如下：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1311250c9d024a3da0d9421e338b2e9f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=262&h=370&s=14936&e=png&b=f8f8f8](/images/jueJin/aabbddc8f7b7499.png)

5.4 小结
------

整个绘制流程分为3大步，完整流程图如下所示：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6cfbdcde78c04e53bb63ee3f52ee60c8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1146&h=644&s=69103&e=png&b=fefefe](/images/jueJin/05a03ed52ad64f4.png)

通过前面的分析可知，gviz 分别用了 2 种不同的方式来解析主工程和子组件工程的依赖清单，并且解析结果的数据结构也不一致，需要额外进行合并操作，经实测，统一采用同一种方式解析就可以实现，个人更推荐第二种 (命令行方式) 。

> 作者做 yaml 文件解析目的主要是为了获取主工程 pubsepc.yaml 文件配置信息，便于后续绘制依赖关系图能区分出主工程做一些特殊处理。

6 化繁为简
======

按照上面的流程，我们可以获取到Flutter工程的完整依赖关系图。

但实际工作中，工程中的组件比较多，也会使用到大量的三方库，这会产生大量的“噪音”，所以，实际工程输出的依赖关系图可能是这样的：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85017e3e1e034c078e4a8a25c15ea41e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1916&h=863&s=266323&e=png&b=fcfcfc](/images/jueJin/fbb0d1b3d8a94b1.png)

虽然上图展示了所有组件库的依赖关系，除了业务组件外，还有依赖的三方库，甚至是三方库依赖的三方库，一直套娃，这些依赖关系全被绘制出来，对于我们分析业务组件的依赖关系反而带来了不必要的麻烦，那么如何才能聚焦我们关注的业务组件依赖关系呢？

其实解决方案很简单：在解析依赖树的时候进行一次过滤即可。

方法一、 白名单在主工程的 pubspec.yaml 文件中新增一种如下所示的配置规则：

```makefile
#自定义的yaml文件节点
dependency_rules:
# 需要统计的组件清单
include:
- search
- chat
- ...
```

在解析依赖树时，用此清单(白名单)进行过滤，这样，用于生成dot文件的组件清单全部在白名单内。

方法二、 黑名单与方法一类似，创建一个黑名单，在解析依赖树时，过滤组件清单中所有黑名单内的库即可。

方法三、 指定白名单目录新增配置规则如下：

```makefile
#自定义的yaml文件节点
dependency_rules:
# 需要统计的路径
include:
- plugins/**
- packages/common/**
```

在 include 指定的路径下扫描出所有工程的 pubspec.yaml 文件，并解析出所有的组件名(库名)列表，也就是自动生成白名单，剩下的跟方法一相同。

方法四、 指定黑名单目录与方法三类似，只不过将白名单改成了黑名单。如果需要，方法四还可以跟方法三结合起来使用，在白名单目录中过滤黑名单。

```yaml
#自定义的yaml文件节点
dependency_rules:
# 需要统计的路径
include:
- plugins/**
- packages/common/**
# 不需要统计的路径
exclude:
- example/**
- plugins/**/example/
```

知其然，知其所以然，才能做到化繁为简，更好的结合和服务自身的业务。经过过滤之后，我们得到的依赖关系图就可以是下面这样的了：

![https://sitecdn.zcycdn.com/f2e-assets/1a1b0673-20ce-4e79-b061-8d0c15b31cab.png](/images/jueJin/45bd1f6d3d99413.png)

7 总结
====

Flutter 组件之间可以相互依赖，编译不会报错，但随着项目规模越来越大，组件越来越多，如果不注重组件解耦，组件之间的依赖关系就会越来越乱，这会给项目的重构和平时的开发带来极大的困扰。通过依赖关系可视化，项目中各个组件的依赖关系我们可以做到一目了然。

推荐阅读
----

[dubbo的SPI 机制与运用实现](https://juejin.cn/post/7308782875011727411 "https://juejin.cn/post/7308782875011727411")

[埋点数据可视化的探索与实践](https://juejin.cn/post/7306876649896083506 "https://juejin.cn/post/7306876649896083506")

[前端接口容灾](https://juejin.cn/post/7306404340679557170 "https://juejin.cn/post/7306404340679557170")

[ARM架构下部署StarRocks3](https://juejin.cn/post/7306065067257856010 "https://juejin.cn/post/7306065067257856010")

[Spring Validation实践及其实现原理](https://juejin.cn/post/7303792111718973466 "https://juejin.cn/post/7303792111718973466")

招贤纳士
----

政采云技术团队（Zero），Base 杭州，一个富有激情和技术匠心精神的成长型团队。规模 500 人左右，在日常业务开发之外，还分别在云原生、区块链、人工智能、低代码平台、中间件、大数据、物料体系、工程平台、性能体验、可视化等领域进行技术探索和实践，推动并落地了一系列的内部技术产品，持续探索技术的新边界。此外，团队还纷纷投身社区建设，目前已经是 google flutter、scikit-learn、Apache Dubbo、Apache Rocketmq、Apache Pulsar、CNCF Dapr、Apache DolphinScheduler、alibaba Seata 等众多优秀开源社区的贡献者。

如果你想改变一直被事折腾，希望开始折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊……如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的技术团队的成长过程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 [zcy-tc@cai-inc.com](https://link.juejin.cn?target=mailto%3Azcy-tc%40cai-inc.com "mailto:zcy-tc@cai-inc.com")

微信公众号
-----

文章同步发布，政采云技术团队公众号，欢迎关注 ![文章顶部.png](/images/jueJin/aaafc13f1d1e414.png)