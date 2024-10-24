---
author: ""
title: "读懂 gradle dependencies"
date: 2022-12-13
description: "gradle 中的 dependencies 命令算是日常开发使用比较多的一个命令，本文通过分析依赖版本的特殊标识，帮助读者更好的理解gradle dependencies的输出。"
tags: ["Android中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:56,comments:1,collects:71,views:5284,"
---
> 图片来自：[unsplash.com](https://link.juejin.cn?target=https%3A%2F%2Funsplash.com "https://unsplash.com")  
> 本文作者： lizongjun

前言
--

gradle 中的 dependencies 命令算是日常开发使用比较多的一个命令，可以帮助我们定位一些二方、三方库版本依赖的问题。

不过在使用 dependencies 时有一些细节之前一直没有搞清楚，遂研究了一下部分细节。本文整体参考 [gradle 官方文档](https://link.juejin.cn?target=https%3A%2F%2Fdocs.gradle.org%2Fcurrent%2Fuserguide%2Fdependency_management_terminology.html "https://docs.gradle.org/current/userguide/dependency_management_terminology.html")，大家感兴趣也可以自己深入研究下。

比如随便找一份 dependencies 输出如下，

![image](/images/jueJin/c32117b9bbbcbda.png)

可以发现，除了我们熟知的树状展开结构，表示依赖的层级；在版本号前后是有一些特殊标识的：`->`、`(c)` 和 `(*)`。

这些特殊标识分别有什么作用，对我们分析版本依赖会有什么影响？本文会依次分析一些这些场景的版本标识符号。

Dependency resolution
---------------------

`->` 标识代表 [依赖冲突](https://link.juejin.cn?target=https%3A%2F%2Fdocs.gradle.org%2Fcurrent%2Fuserguide%2Fdependency_resolution.html "https://docs.gradle.org/current/userguide/dependency_resolution.html")，也是在 dependencies graph 中最常见的一种标识。

比如 1.3.2 -> 1.6.0，表示当前依赖树中依赖的版本是 1.3.2，但由于全局的依赖冲突，最终被升级到了 1.6.0 版本。gradle 处理依赖冲突的总体原则是取冲突中的最高版本，但有很多特例。

特例情况我们本次不具体展开，只看常规情况，实际上仅是常规情况也有让人迷惑之处。

我们假设下面这样一个demo，

```arduino
// module A, tag 1.0.0, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_c:1.0.0'
    implementation 'com.netease.cloudmusic.android:module_d:1.0.0'
}

// app, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_a:1.0.0'
}
```

当我们查看 app module 的 dependencies 输出时（下文 dependencies 的输出都是基于 app module的），结果如下，

```lua
--- com.netease.cloudmusic.android:module_a:1.0.0
+--- com.netease.cloudmusic.android:module_c:1.0.0
--- com.netease.cloudmusic.android:module_d:1.0.0
```

现在引入依赖冲突，

```arduino
// module A, tag 1.0.0, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_c:1.0.0'
    implementation 'com.netease.cloudmusic.android:module_d:1.0.0'
}

// module B, tag 1.0.0, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_c:1.1.0'
}

// app, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_a:1.0.0'
    implementation 'com.netease.cloudmusic.android:module_b:1.0.0'
}
```

此时也比较简单，因为 module B 中依赖了 1.1.0 版本的 module C，依赖发生冲突以最高版本为准，所以最终 dependencies 的输出如下，此时 `->` 表示了冲突的结果，

```lua
+--- com.netease.cloudmusic.android:module_a:1.0.0
|    +--- com.netease.cloudmusic.android:module_c:1.0.0 -> 1.1.0
|    --- com.netease.cloudmusic.android:module_d:1.0.0
--- com.netease.cloudmusic.android:module_b:1.0.0
--- com.netease.cloudmusic.android:module_c:1.1.0
```

再复杂一点，引入一个间接冲突，

```arduino
// module A, tag 1.0.0, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_c:1.0.0'
    implementation 'com.netease.cloudmusic.android:module_d:1.0.0'
}

// module A, tag 1.1.0, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_c:1.1.0'
    implementation 'com.netease.cloudmusic.android:module_d:1.1.0'
}

// module B, tag 1.0.0, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_a:1.1.0'
}

// app, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_a:1.0.0'
    implementation 'com.netease.cloudmusic.android:module_b:1.0.0'
}
```

此时，module B 不再直接依赖 module C，而是通过依赖高版本的 module A，间接引入了 1.1.0 版本的 module C，dependencies 输出如下，

```lua
+--- com.netease.cloudmusic.android:module_a:1.0.0 -> 1.1.0
|    +--- com.netease.cloudmusic.android:module_c:1.1.0
|    --- com.netease.cloudmusic.android:module_d:1.1.0
--- com.netease.cloudmusic.android:module_b:1.0.0
--- com.netease.cloudmusic.android:module_a:1.1.0 (*)
```

注意此时 module A 到 module C 这条引用链上的版本标识：对于 module A，由于依赖冲突，版本变为 1.0.0 -> 1.1.0 ；但对于 module C，版本并不是 1.0.0 -> 1.1.0，而直接是 1.1.0。也就是说叶子节点的版本是以父节点版本的右值为准的。

如果我们再修改一下 demo，可以更清晰的解释这里的逻辑。我们把 demo 调整成如下这样，

```arduino
// module A, tag 1.0.0, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_c:1.0.0'
    implementation 'com.netease.cloudmusic.android:module_d:1.0.0'
}

// module A, tag 1.1.0, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_c:1.1.0'
    implementation 'com.netease.cloudmusic.android:module_d:1.1.0'
}

// module B, tag 1.0.0, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_a:1.1.0'
}

// app, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_a:1.0.0'
    implementation 'com.netease.cloudmusic.android:module_b:1.0.0'
    implementation 'com.netease.cloudmusic.android:module_c:1.2.0'
}
```

module A、B、C、D 之间的依赖关系不变，但我们在 app module 直接依赖 1.2.0 版本的 module C，此时 dependencies 是怎样的呢？

```lua
+--- com.netease.cloudmusic.android:module_a:1.0.0 -> 1.1.0
|    +--- com.netease.cloudmusic.android:module_c:1.1.0 -> 1.2.0
|    --- com.netease.cloudmusic.android:module_d:1.1.0
+--- com.netease.cloudmusic.android:module_b:1.0.0
|    --- com.netease.cloudmusic.android:module_a:1.1.0 (*)
--- com.netease.cloudmusic.android:module_c:1.2.0
```

可以很清晰的看到，对于发生冲突的版本：从父节点找子节点，看的是父节点的右值；而从子节点向父节点追溯，看的子节点的左值。

但单纯从视觉的直觉上看，我们可能会误以为 1.2.0 版本的 module C 是由 module A 引入的，导致排查问题时南辕北辙，特别在排查大型项目的 dependencies 输出时，一定要注意每一层节点之间的冲突版本的左值与右值。

Dependency omitted
------------------

在前面的 demo 里，`(*)` 这个标识已经出现过了，这个标识由于跟常规语境下的含义不太一样，所以也具有一定的迷惑性。`(*)` 符号字面意思是删减，但并不是依赖关系上的删减，仅仅是展示层面的删减。

还是以如下 demo 为例，

```arduino
// module A, tag 1.0.0, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_c:1.0.0'
    implementation 'com.netease.cloudmusic.android:module_d:1.0.0'
}

// module B, tag 1.0.0, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_a:1.0.0'
}

// module E, tag 1.0.0, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_a:1.0.0'
}

// module F, tag 1.0.0, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_a:1.0.0'
}

// app, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_a:1.0.0'
    implementation 'com.netease.cloudmusic.android:module_b:1.0.0'
    implementation 'com.netease.cloudmusic.android:module_e:1.0.0'
    implementation 'com.netease.cloudmusic.android:module_f:1.0.0'
}
```

输出如下，

```lua
+--- com.netease.cloudmusic.android:module_a:1.0.0
|    +--- com.netease.cloudmusic.android:module_c:1.0.0
|    --- com.netease.cloudmusic.android:module_d:1.0.0
+--- com.netease.cloudmusic.android:module_b:1.0.0
|    --- com.netease.cloudmusic.android:module_a:1.0.0 (*)
+--- com.netease.cloudmusic.android:module_e:1.0.0
|    --- com.netease.cloudmusic.android:module_a:1.0.0 (*)
--- com.netease.cloudmusic.android:module_f:1.0.0
--- com.netease.cloudmusic.android:module_a:1.0.0 (*)
```

这里 `(*)` 代表省略了 module A 以下的依赖关系子树，因为假设我们按照 demo 来输出一个完整的依赖关系图，应该是下面这样的，

```lua
+--- com.netease.cloudmusic.android:module_a:1.0.0
|    +--- com.netease.cloudmusic.android:module_c:1.0.0
|    --- com.netease.cloudmusic.android:module_d:1.0.0
+--- com.netease.cloudmusic.android:module_b:1.0.0
|    --- com.netease.cloudmusic.android:module_a:1.0.0
|         +--- com.netease.cloudmusic.android:module_c:1.0.0
|         --- com.netease.cloudmusic.android:module_d:1.0.0
+--- com.netease.cloudmusic.android:module_e:1.0.0
|    --- com.netease.cloudmusic.android:module_a:1.0.0
|         +--- com.netease.cloudmusic.android:module_c:1.0.0
|         --- com.netease.cloudmusic.android:module_d:1.0.0
--- com.netease.cloudmusic.android:module_f:1.0.0
--- com.netease.cloudmusic.android:module_a:1.0.0
+--- com.netease.cloudmusic.android:module_c:1.0.0
--- com.netease.cloudmusic.android:module_d:1.0.0
```

如果都按这种方式展示，显然冗余信息太多了，特别对于一个大型项目，依赖关系复杂时，几乎是不可阅读的。所以为了简洁、方便理解，dependencies 命令会默认缩略重复的依赖关系子树，只在它第一次出现时，才完整展示；后续出现都以 `(*)` 符号代替。

这也解释了为什么我们在从上向下阅读一个 dependencies graph 时，会感觉越靠近开头，依赖关系越复杂、层级越深，越靠近末尾依赖关系越简单。其实并不是因为 gradle 对依赖关系做了排序，仅仅是因为靠近尾部，大部分子树都被缩略掉了。

Dependency constraint
---------------------

`(c)` 这个标识对应 dependecy constraint，这部分逻辑的具体解释可以参考 [这个章节](https://link.juejin.cn?target=https%3A%2F%2Fdocs.gradle.org%2Fcurrent%2Fuserguide%2Fdependency_constraints.html "https://docs.gradle.org/current/userguide/dependency_constraints.html")，它对应 gradle 中的 `constraints` 闭包（如下），

```javascript
    dependencies {
        constraints {
            implementation('com.netease.cloudmusic.android:module_c:1.1.0') {
            because 'previous versions have a bug impacting this application'
        }
    }
}
```

`constraints` 闭包的作用可以简单解释成不通过直接依赖来升级某个间接依赖的版本，比如下面这个 demo，

```arduino
// module A, tag 1.0.0, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_c:1.0.0'
    implementation 'com.netease.cloudmusic.android:module_d:1.0.0'
}

// module A, tag 1.1.0, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_c:1.1.0'
    implementation 'com.netease.cloudmusic.android:module_d:1.1.0'
}

// module A, tag 1.2.0, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_d:1.2.0'
}

// app, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_a:1.0.0'
}
```

假设，现在我们发现 module C 在 1.0.0 版本有一个 bug，需要升级 module C 到 1.1.0 版本来修复；但囿于种种原因我们不能直接使用 1.1.0 版本的 module A，比如我们暂时不希望升级 module D 到 1.1.0 版本。

面对这种问题时，我们可能会按下面这种写法来规避，

```arduino
// app, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_a:1.0.0'
    implementation 'com.netease.cloudmusic.android:module_c:1.1.0'
}
```

此时依赖关系如下，

```lua
+--- com.netease.cloudmusic.android:module_a:1.0.0
|    +--- com.netease.cloudmusic.android:module_c:1.0.0 -> 1.1.0
|    --- com.netease.cloudmusic.android:module_d:1.0.0
--- com.netease.cloudmusic.android:module_c:1.1.0
```

但这种写法的缺点是：我们引入了一个不必要的依赖，在 app module 直接依赖了 module C。

假设当 module A 升级到 1.2.0 版本，此时 module A 不再依赖 module C 了，

```arduino
// app, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_a:1.2.0'
    implementation 'com.netease.cloudmusic.android:module_c:1.1.0'
}
```

但由于我们显式的依赖了 module C，导致 module C 不再是由 module A 来引入，依赖关系发生了错乱，这并不符合我们的预期，特别在复杂项目中会引入很多不必要的麻烦。

```lua
+--- com.netease.cloudmusic.android:module_a:1.2.0
|    --- com.netease.cloudmusic.android:module_d:1.2.0
--- com.netease.cloudmusic.android:module_c:1.1.0
```

如果换成使用 `constraints` 闭包来实现上面的 demo 就不同了，

```arduino
// app, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_a:1.0.0'
        constraints {
        implementation 'com.netease.cloudmusic.android:module_c:1.1.0'
    }
}
```

此时，就会产生 `(c)` 这个标识，

```lua
+--- com.netease.cloudmusic.android:module_a:1.0.0
|    +--- com.netease.cloudmusic.android:module_c:1.0.0 -> 1.1.0
|    --- com.netease.cloudmusic.android:module_d:1.0.0
--- com.netease.cloudmusic.android:module_c:1.1.0 (c)
```

当 module A 升级到 1.2.0 之后，

```arduino
// app, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_a:1.2.0'
        constraints {
        implementation 'com.netease.cloudmusic.android:module_c:1.1.0'
    }
}
```

对 module C 的依赖会自动失效，

```lua
+--- com.netease.cloudmusic.android:module_a:1.2.0
--- com.netease.cloudmusic.android:module_d:1.2.0
```

而如果将 demo 改成这样，继续升级 module A，

```arduino
// module A, tag 1.3.0, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_c:1.3.0'
    implementation 'com.netease.cloudmusic.android:module_d:1.3.0'
}

// app, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_a:1.3.0'
        constraints {
        implementation 'com.netease.cloudmusic.android:module_c:1.2.0'
    }
}
```

此时输出如下，依然会展示 `(c)` 标识，但最终版本选取了更高的 1.3.0 版本。

```lua
+--- com.netease.cloudmusic.android:module_a:1.3.0
|    +--- com.netease.cloudmusic.android:module_c:1.3.0
|    --- com.netease.cloudmusic.android:module_d:1.3.0
--- com.netease.cloudmusic.android:module_c:1.2.0 -> 1.3.0 (c)
```

同时对于 `constraints` 闭包，也可以用来实现 [dependency version alignment](https://link.juejin.cn?target=https%3A%2F%2Fdocs.gradle.org%2Fcurrent%2Fuserguide%2Fdependency_version_alignment.html "https://docs.gradle.org/current/userguide/dependency_version_alignment.html")。

以文章开头展示的那个结果为例，这里 `kotlinx-coroutines-bom` 顾名思义是 kotlin 协程的 bom（Bill Of Materials）模块，

```lua
--- org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:1.6.0
+--- org.jetbrains.kotlinx:kotlinx-coroutines-bom:1.6.0
|    +--- org.jetbrains.kotlinx:kotlinx-coroutines-android:1.6.0 (c)
|    +--- org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.0 (c)
|    +--- org.jetbrains.kotlinx:kotlinx-coroutines-jdk8:1.6.0 (c)
|    --- org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:1.6.0 (c)
+--- org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.6.0 (*)
--- org.jetbrains.kotlin:kotlin-stdlib-common:1.6.0
```

在这个 bom 库的 [build.gradle 文件](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FKotlin%2Fkotlinx.coroutines%2Fblob%2Fversion-1.6.1%2Fkotlinx-coroutines-bom%2Fbuild.gradle "https://github.com/Kotlin/kotlinx.coroutines/blob/version-1.6.1/kotlinx-coroutines-bom/build.gradle") 中，有如下逻辑，

```kotlin
    dependencies {
        constraints {
            rootProject.subprojects.each {
            if (rootProject.ext.unpublished.contains(it.name)) return
            if (it.name == name) return
            if (!it.plugins.hasPlugin('maven-publish')) return
            evaluationDependsOn(it.path)
                it.publishing.publications.all {
                ...
                api(group: it.groupId, name: it.artifactId, version: it.version)
            }
        }
    }
}
```

本质上就是通过 `constraints` 闭包，来保证 `kotlinx-coroutines-android`、`kotlinx-coroutines-core`、`kotlinx-coroutines-jdk8`、`kotlinx-coroutines-core-jvm` 这几个子模块的版本一致。

可见，类似协程这种一对多的库，可以通过抽取一个 bom 模块，利用 `constraints` 闭包来约束各子 module 版本一致，避免由于版本不一致而引发的问题。

Downgrading versions
--------------------

与 dependecy constraint 对应的方案是 [downgrading versions](https://link.juejin.cn?target=https%3A%2F%2Fdocs.gradle.org%2Fcurrent%2Fuserguide%2Fdependency_downgrade_and_exclude.html "https://docs.gradle.org/current/userguide/dependency_downgrade_and_exclude.html")，用来处理依赖版本的降级，这里不过多介绍它们的用法，只看它们对dependencies输出的影响。

这里重点看一下 `force` 与 `strictly` 关键字的区别，还是如下 demo，比如我们想降级 module C 的版本，

```javascript
// module A, tag 1.1.0, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_c:1.1.0'
    implementation 'com.netease.cloudmusic.android:module_d:1.1.0'
}

// app, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_a:1.1.0'
        implementation('com.netease.cloudmusic.android:module_c') {
            version {
            strictly '1.0.0'
        }
    }
}
```

此时 dependencies 输出如下，

```lua
+--- com.netease.cloudmusic.android:module_a:1.1.0
|    +--- com.netease.cloudmusic.android:module_c:1.1.0 -> 1.0.0
|    --- com.netease.cloudmusic.android:module_d:1.1.0
--- com.netease.cloudmusic.android:module_c:{strictly 1.0.0} -> 1.0.0
```

可以看到，在 dependencies 中有一个 `strictly` 关键字。

但如果使用 `force` 属性，写一个类似的 demo，

```javascript
// module A, tag 1.1.0, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_c:1.1.0'
    implementation 'com.netease.cloudmusic.android:module_d:1.1.0'
}

// app, build.gradle
    dependencies {
    implementation 'com.netease.cloudmusic.android:module_a:1.1.0'
        implementation('com.netease.cloudmusic.android:module_c:1.0.0') {
        force = true
    }
}
```

得到 dependencies 输出如下，

```lua
+--- com.netease.cloudmusic.android:module_a:1.1.0
|    +--- com.netease.cloudmusic.android:module_c:1.1.0 -> 1.0.0
|    --- com.netease.cloudmusic.android:module_d:1.1.0
--- com.netease.cloudmusic.android:module_c:1.0.0
```

可读性则不如 `strictly` 关键字，没有任何标识能够区分，并且在 gradle 的较高版本，`force` 关键字已经被标记废弃了。

总结
--

通过对 dependencies graph 中几个常见的版本标识符进行分析，尤其是发生依赖冲突时的具体表现，我们已经能够区分 dependencies 中发生依赖冲突、依赖升级、依赖降级时版本标记的差异。利用这种差异，可以更好的协助我们分析、定位版本依赖的问题。

参考资料
----

*   [docs.gradle.org/current/use…](https://link.juejin.cn?target=https%3A%2F%2Fdocs.gradle.org%2Fcurrent%2Fuserguide%2Fdependency_management_terminology.html "https://docs.gradle.org/current/userguide/dependency_management_terminology.html")

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！