---
author: "网易云音乐技术团队"
title: "Android 增量构建的科技与狠活"
date: 2023-09-20
description: "最近生活中大家遇到的科技与狠活较多，当android的构建用上科技与狠活会不会倒沫子呢，让我们拭目以待。"
tags: ["Android中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读15分钟"
weight: 1
selfDefined:"likes:106,comments:25,collects:180,views:10122,"
---
![obj_wonDlsKUwrLClGjCm8Kx_22530311132_9929_db5f_4648_c2d5da09c934776ad5437f9c0999de39.png](/images/jueJin/9392e9eb8ea143d.png)

图片来自：[medium.com/mindorks/im…](https://link.juejin.cn?target=https%3A%2F%2Fmedium.com%2Fmindorks%2Fimplementation-vs-api-in-gradle-3-0-494c817a6fa "https://medium.com/mindorks/implementation-vs-api-in-gradle-3-0-494c817a6fa")

> 本文作者：jungle

前言
==

对于 `Android` 应用，尤其是大型应用而言，构建耗时是令人头疼的一件事。动辄几分钟甚至十几分钟的时间更是令大部分开发人员苦不堪言。而在实际开发过程中面对最多的就是本地的增量编译，虽然官方对增量编译有做处理，但在具体项目，尤其是中大型项目中，效果其实都不太理想。

背景
==

目前网易云音乐及旗下 `look` 直播，心遇，`mus` 等 `app` 先后采取了公共模块 `aar` 化，使用最新 `agp` 版本等措施，但整体构建耗时依然很久，增量构建一般在 2-5 `min` 左右。由于本人当前主要是负责开发 `mus` 的业务，因此结合目前 `mus` 的实际构建情况对增量构建做了一些优化工作。

耗时排查
====

结合 `mus` 构建的具体情况来看，目前构建耗时的大头主要集中在一些 `Transform` 和 `dexMerge` ( agp 版本 4.2.1 )。

对于 `Transform` 而言，主要是一些例如隐私扫描，自动化埋点等工具耗时严重，通常增量时这些 `Transform` 的耗时就达到数分钟。

另外 `dexMeger` 任务也是增量构建时的大头，`mus` 增量 `dexMerge` 耗时约为 35-40s ，云音乐 `dexMerge` 增量构建耗时约 90-100s 。

优化方向
====

对于大型项目而言，最耗时的基本就是 `Transform` 了，这些 `Transform` 一般分为以下两类：

1.  功能型 `Transform`，移除只会影响自己的功能部分，不影响构建产物和项目运行。例如：埋点校验，隐私扫描。
2.  强依赖型 `Transform` ，移除影响编译或项目正常运行。这部分通常是在 `apt` 中采集一些信息，然后在 `Transform` 执行时生成 `class` ，在运行时调用执行。

功能型 `Transform` 可以通过编译开关和 `debug/release` 判断，避免在开发时调用执行。对于强依赖的 `Transform` 可以通过字节开源的 `byteX` 之类的工具将 `Transform` 流程拍平，对增量和全量编译都有效果。但是 `byteX` 的侵入性较大，需要将现有的 `Transform` 改成字节提供的 `Transform` 的子类。这里我们采用一种修改构建输入产物的轻量级方案来实现 `Transform` 增量构建的优化。

同时对于 `dex` 相关操作耗时的点，可以结合 `dexMerge` 的实际流程做增量优化，确保只有最小粒度的改动点会触发 `dex` 的 `merge` 操作。

Trasnform 增量构建
==============

虽然 `mus` 目前依赖的大部分 `Transform` 的 `isIncremental` 配置返回 `true` ，但是实际的 `io` 和插桩很少有做增量逻辑的。

在增量构建时，大部分 `class` 在第一次构建时已经经过各 `Transform` 的处理，被插桩修改后移动到对应的下一级 `Transform` 目录了，增量时这部分已经处理过的产物其实没有必要再在各 `Transform` 之间执行插桩和 `io` 了。

目前大部分 `Transform` 的写法都是如下写法：

```groovy
input.jarInputs.each { JarInput jarInput ->
ile destFile = transformInvocation.getOutputProvider().getContentLocation(destName , jarInput.contentTypes, jarInput.scopes, Format.JAR)
FileUtils.copyFile(srcFile, destFile)
}

input.directoryInputs.each { DirectoryInput directoryInput ->
File destFile = transformInvocation.getOutputProvider().getContentLocation(directoryInput.name, directoryInput.contentTypes, directoryInput.scopes, Format.DIRECTORY)
...
FileUtils.copyDirectory(directoryInput.file, destFile)
}
```

这里在增量构建时应该做的是只对发生变化的产物做插桩和 `copy` 的操作：

```Groovy
// 伪代码如下：
// jar 增量处理
if（!isIncremental) return

    if (Status.ADDED ==jarInput.status || Status.CHANGED==jarInput.status){
    File destFile = transformInvocation.getOutputProvider().getContentLocation(destName , jarInput.contentTypes, jarInput.scopes, Format.JAR)
    FileUtils.copyFile(srcFile, destFile)
}

// class 增量处理
val dest = outputProvider!!.getContentLocation(
directoryInput.name, directoryInput.contentTypes,
directoryInput.scopes, Format.DIRECTORY
)

    if（Status.ADDED ==dirInput.status || Status.CHANGED==dirInput.status）{
        dirInput.changedFiles.forEach{
        // 插桩逻辑
        ...
        // 只移动增量变化插桩后的class文件到对应目录下
        copyFileToTarger(it,dest)
    }
}
```

当然由于一些历史原因，有些 `Transform` 的代码可能都找不到，无法改造，因此为了兼容所有情况，这边简单对 `Transform` 的输入产物做了简单的 `hook` 替换操作。

通常实现一个 `Transform` 都是新建一个类实现 `Trasnform` 的 `transform` 方法，在 `transform` 方法里执行具体操作，而 `Trasnform` 产物的入参正是在 `com.android.build.api.transform.TransformInvocation#getInputs` 的方法里：

```java
    public interface TransformInvocation {
    
    Context getContext();
    
    /**
    * Returns the inputs/outputs of the transform.
    * @return the inputs/outputs of the transform.
    */
    @NonNull
    Collection<TransformInput> getInputs();
    ...
}
```

通过 `hook` 掉 `TransformInvocation#getInputs` 返回的 `JarInput` 和 `DirectoryInput` ，将 `JarInputs` 和 `Directory` 中未发生改变的产物移除。

![img](/images/jueJin/0c91ec2d70db4cf.png)

经过上述优化后原来耗时几十秒到几分钟的 `Transform` 基本都能被压缩到1-2 s以内。

DexMerge 增量优化
=============

事实上 `agp` 版本更新非常频繁，对于不同版本，`dex` 耗时不同。对于 3.x 的版本 `dex` 相关 `task` 主要耗时集中在`dexBuilder`上，而4.x的版本主要耗时则集中在`dexMerger`，由于目前 `mus` 等业务都使用 4.2 及以上版本的 `agp` ，研究发现 4.x 的版本实际上对 `dexBuilder` 有做了增量的处理，整体耗时不多，因此主要对4.2及以上版本 `dexMerger` 耗时做优化。

顾名思义，`dexMerge` 实际上是对已经打出的 `dex` 进行合并，将多个`dex` 或者 `jar` 合成一个较大的 `dex` 的流程。按照正常情况，`dex` 数量越多，应用的启动速度越慢，因此对于大型项目，`dexMerge` 也是必不可少的一步。

dexMerge 流程
-----------

`dexMerger` 是有分桶操作的，桶的数量一般不额外配置使用默认值 16，通常桶的分配逻辑是按照包名来的，也就是说同一包名下的 `class` 会被分配到同一个桶里。

```kotlin
    fun getBucketNumber(relativePath: String, numberOfBuckets: Int): Int {
    ...
    val packagePath = File(relativePath).parent
        return if (packagePath.isNullOrEmpty()) {
        0
            } else {
                when (numberOfBuckets) {
                1 -> 0
                    else -> {
                    // 同一包名下class被分到同一个bucket里
                    val normalizedPackagePath = File(packagePath).invariantSeparatorsPath
                    return abs(normalizedPackagePath.hashCode()) % (numberOfBuckets - 1) + 1
                }
            }
        }
    }
    
    public val File.invariantSeparatorsPath: String
    get() = if (File.separatorChar != '/') path.replace(File.separatorChar, '/') else path
```

实际的构建产物如下：

![img](/images/jueJin/b532af62c82e462.png)

增量构建时，`agp` 会按照以下规则来执行 `dexMerge` 任务:

1.  如果有 `jar` 文件状态发生变更或者被移除了，即对应状态 `CHANGED` 或者 `REMOVE` ,这种情况所有的桶都要重新走 `dexMerge` 流程，通常默认的 `bucket` 数量是 16 个，也就是当构建时有一个`jar`文件发生变更时，所有的输入产物全部都会参与 `dexMeger` 流程。（虽然 `d8` 命令行工具对增量`dexMeger` 本身有一定优化，增量速度对比全量会有一定加快，但对于大型项目而言总体还是很慢。）

![img](/images/jueJin/5222aba386e148f.png)

2.  如果是只有新增的 `jar` 或者 `dex` 发生改变的`Directory`，那么会根据对应的包名获取到对应的桶的数组，只对找到的桶的数组进行增量的打包，这也就是我们说的 `dexMerge` 本身的增量操作。

![img](/images/jueJin/e9f6d59ba8f74d8.png)

返回对应bucket id 数组的代码如下：

```kotlin
private fun getImpactedBuckets(
fileChanges: SerializableFileChanges,
numberOfBuckets: Int
    ): Set<Int> {
    val hasModifiedRemovedJars =
    (fileChanges.modifiedFiles + fileChanges.removedFiles)
    .find { isJarFile(it.file) } != null
    
        if (hasModifiedRemovedJars) {
        // 1. 如果有CHANGED或者REMOVE状态的jar,则返回全部bucket数组。
        return (0 until numberOfBuckets).toSet()
    }
    
    // 2. 如果是新增jar，或者是directory中class发生变化，返回计算到的bucket数组。
val addedJars = (fileChanges.addedFiles).map { it.file }.filter { isJarFile(it) }
val relativePathsOfDexFilesInAddedJars =
addedJars.flatMap { getSortedRelativePathsInJar(it, isDexFile) }
val relativePathsOfChangedDexFilesInDirs =
fileChanges.fileChanges.map { it.normalizedPath }.filter { isDexFile(it) }

return (relativePathsOfDexFilesInAddedJars + relativePathsOfChangedDexFilesInDirs)
.map { getBucketNumber(it, numberOfBuckets) }.toSet()
}
```

这种增量操作适用的是大部分代码囊括在壳工程中且不会频繁改动底层库的业务，不知道是不是因为国外包括 `google` 官方本身项目开发模式就是这样。对于大部分国内的项目，只要你做了组件化，甚至没做业务组件化但是有多个子模块类型的项目，只要有涉及到子模块的改动，所有的产物都要全部重新参与 `dexMerge` 。

对于 `mus` ，云音乐等组件化工程，通常构建时只有壳工程是以文件夹的形式作为输入产物在后续的 `Transform` 和 `dex` 相关流程里流转，而子模块通常是以 `jar` 的形式参与构建，而我们实际开发中基本就是对各业务模块的改动，对应上述第一种情况，所有的桶全部会重新走的 `dexMerger`，而第二种情况只有改动壳工程代码或者新增依赖或者模块之类的才会命中，这种情况偏少可以不用考虑。

针对上述问题解决方法主要有两种：

1.  将所有的 `jar` 拆解为文件夹，这样只有改动模块对应的分桶生效，但是这种问题在于哪怕只改动了一个模块中的两个类，由于 `bucket` 是按照包名固定分在同一个桶里，非相同包名则根据包名随机分桶，很可能也会连带着其他的 `bucket` 一起进行 `dexMerger` ，虽然可以适当扩大分桶的数量，但是同样的，也没法完全规避这种问题。
    
2.  仅针对发生改变的输入产物进行重新的 `dexMerger`，将新生成的 `merge` 后的 `dex` 打进 `apk` 或者移到设备中确保运行时增量改变的这部分代码可以被执行。
    

为了确保最小化单元的 `dex` 参与后续的 `dexMerge` 流程，我们采用第二种方式作为 `dexMerge` 增量构建的方案。

增量构建产物的 dexMerge
----------------

通过 `hook` `dexMerge` 的关键流程，我们可以获取到发生变化的 `jar` 文件和包含 `dex` 的文件夹，然后把 `dexMerge` 输入产物由原来的全部产物修改为我们 `hook` 之后的产物：

我们将所有发生变化的 `dex` 文件汇总移动到临时的文件目录内，然后将目标文件夹作为一个输入产物即可，对于发生变更的 `jar`，我们也将其加到输入的产物里，然后继续走原来的 `dexMerge` 流程。

打出来的增量 `dex` 产物如下：

![img](/images/jueJin/b6b7ecf6bff740a.png)

同时我们需要变更增量 `dexMerge` 的输出目录，因为 `dexMerger` 正常运行时，在有代码修改的情况，所有的 `bucket` 都会被新的产物覆盖，哪怕新的产物是空文件夹。如果不更改文件目录就会覆盖掉之前全量打出的所有的 `dex` ，导致最终的 `apk` 包仅包含这次增量的 `dex` 从而无法正常运行。

同时由于每次增量构建变化的产物都不同，因此对每次构建产物的输出目录做了递增，同样是确保上次增量的产物不要被本次覆盖掉，这里每次的产物都对后续构建流程有作用，具体会在后续内容中说明。

当然，新的目录具体放在哪里，也跟我们选择的方案有关系。

热更新方案
-----

因为有了增量的 `dex`，我们很容易联想到热更新的方案，即将增量构建出的 `dex` 推送到手机 `sd` 卡上，然后在运行时去动态加载。这种情况下增量 `merge` 的 `dex` 产物放在哪个目录下都可以，因为对后续构建流程已经没有什么太大影响了，影响的主要是运行时 `dex` 的加载逻辑。

### 1\. 增量 dex 临时产物

上述虽然有了增量的构建产物，但是为了运行时方便排序仍然会每次把当次编译新增的 `dex` 移动到临时目录 `pulledMergeDex` 文件夹中。

![img](/images/jueJin/cf4cb8502bf3456.png)

然后通过 `adb` 每次批量清理设备中临时的 `dex` ，再将全部 `pulledMergeDex` 目录下的 `dex` 推送到设备中，这样做的目的是为了确保设备中 `dex` 的准确性，避免因为某次构建残留的 `dex` 产物运行影响现有的代码逻辑。

![img](/images/jueJin/59033eecd4e44e5.png)

### 2\. 运行时动态加载 dex

由于 `dex` 的加载是按照 `PathList` 加载 `dexElements` 数组的顺序从前往后加载的，因此只要按照 `dex` 的热更方案，在运行时反射替换 `PathClassLoader` 中的 `dexElements` 数组，将之前推送到手机目录中的数组，按照倒序先排列好，然后再插入在 `dexElements` 数组最前面即可，这里热更新的具体原理不再阐述。

接入项目中实测发现有些代码改动会不生效(主要是 `Application` 和 `Application` 直接引用到的 `class`)，具体原因应该是 [Android N 对热补丁的影响](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FWeMobileDev%2Farticle%2Fblob%2Fmaster%2FAndroid_N%25E6%25B7%25B7%25E5%2590%2588%25E7%25BC%2596%25E8%25AF%2591%25E4%25B8%258E%25E5%25AF%25B9%25E7%2583%25AD%25E8%25A1%25A5%25E4%25B8%2581%25E5%25BD%25B1%25E5%2593%258D%25E8%25A7%25A3%25E6%259E%2590.md "https://github.com/WeMobileDev/article/blob/master/Android_N%E6%B7%B7%E5%90%88%E7%BC%96%E8%AF%91%E4%B8%8E%E5%AF%B9%E7%83%AD%E8%A1%A5%E4%B8%81%E5%BD%B1%E5%93%8D%E8%A7%A3%E6%9E%90.md")，本地在 `AndroidMainfest` 文件中加了 `safemode=true`，但在实际设备运行还是无效，不知道是不是现在设备的版本不支持了。另外一种可行的方式就是类似 `tinker` 的解决方案对 `Application` 进行改造，然后通过另外的 `ClassLoader` 加载后续的 `class` 了。

Dex 重排方案
--------

除了在运行时加载 `dex`，我们也可以尝试在编译时将增量的 `dex` 打包到 `apk` 中。

`gradle` 中对应的 `task` 都有对应的构建缓存，如果我们增量的 `dex` 放置在一个随机目录中，后续的 `task` 例如 `package`，`assemble` 等检测输入产物没有变化的情况下，是会直接走增量构建缓存的，也就不会再执行了。而我们期望我们增量的 `dex` 被打进 `apk` 中，后续的 `package` 等 `task` 必须要被执行。

这种情况下，构建产物的目录就比较有讲究了，我们可以取个巧，在之前 `dexMeger` 全量产物输出的目录下，增加一个 `incremental` 文件夹，专门做增量产物的 `dexMeger`，同样的每次增量的产物在该文件目录下按照 `index` 递增，这样确保每次增量 `dexMerge` 的产物没有冲突。

![img](/images/jueJin/3fdd7483b3804e5.png)

打包到 `apk` 中的 `dex` 同样也是会按照 `dex` 的排列顺序加载执行，因此我们需要将新增的 `dex` 在编译时就排列在 `apk` 的最前面。 `apk` 中 `dex` 的排序是在 `package` 任务中去执行的，因此我们需要尝试去 `hook` `package` 的关键路径，将我们新增的 `dex` 排在 `Apk` 内 `dex` 数组最前面。

### Android Package 流程 hook

`Android package` 负责将之前打包流程中的所有产物汇总打包到最终对外输出的 `apk` 产物里，`dex` 自然也不例外。`Android package` 会结合产物的变化对 `apk` 中发生变更的文件做更改，将 `apk` 中对比 `CHANGED` 和 `REMOVED` 的文件删除，然后将构建产物中 `ADDED` 和 `CHANGED` 的产物重新添加到 `apk` 中去。

```java
    public void updateFiles() throws IOException {
    // Calculate packagedFileUpdates
    List<PackagedFileUpdate> packagedFileUpdates = new ArrayList<>();
    // dex 文件的变更
    packagedFileUpdates.addAll(mDexRenamer.update(mChangedDexFiles));
    ...
    deleteFiles(packagedFileUpdates);
    ...
    addFiles(packagedFileUpdates);
}


    private void deleteFiles(@NonNull Collection<PackagedFileUpdate> updates) throws IOException {
    // 当前 CHANGED REMOVED 状态的文件 先移除apk
    Predicate<PackagedFileUpdate> deletePredicate =
    mApkCreatorType == ApkCreatorType.APK_FLINGER
    ? (p) -> p.getStatus() == REMOVED || p.getStatus() == CHANGED
    : (p) -> p.getStatus() == REMOVED;
    ...
        for (String deletedPath : deletedPaths) {
        getApkCreator().deleteFile(deletedPath);
    }
}

    private void addFiles(@NonNull Collection<PackagedFileUpdate> updates) throws IOException {
    // NEW CHANGED 状态的文件 添加进apk
    Predicate<PackagedFileUpdate> isNewOrChanged =
    pfu -> pfu.getStatus() == FileStatus.NEW || pfu.getStatus() == CHANGED;
    ...
        for (File arch : archives) {
        getApkCreator().writeZip(arch, pathNameMap::get, name -> !names.contains(name));
    }
}
```

文件关系则通过 `DexIncrementalRenameManager` 来维护，`DexIncrementalRenameManager` 每次会先去 `dex-renamer-state.txt` 去加载当前的 `dex mapping` 关系，结合变更的 `dex` 去对 `apk` 中文件做更改，同时每次排序完成后会将新的 `dex mapping` 更新在 `dex-renamer-state.txt` 文件中。

![img](/images/jueJin/c07dcef22895402.png)

我们这边参考原来的 `mapping` 文件，在每次编译时，将构建产物中的 `dex` 路径和该 `dex` 对应 `apk` 中的实际 `dex` 的 `path` `classesX.dex` 关联起来做好 `mapping` ，然后存在单独记录的`dex_mapping`文件里。

![img](/images/jueJin/02508dbb0e294c7.png)

每次增量编译有新 `merge` 的 `dex` 时，先将增量的 `dex` 按照 `classes.dex`，`classes2.dex`... 的顺序排列，然后将 `dex-mapping` 中的构建产物和 `apk` 中 `dex` 路径的关系加载到内存中，按照原有的顺序排列在增量的 `dex` 后面，最后通过 `hook` `package` 流程将变化的内容同步更新到 `apk` 文件中。

整体流程如下图：

![img](/images/jueJin/89da4fd827f1408.png)

在 `apk` 更新完成后，将最新的的 `dex` 和 `apk` 中 `dex` 路径的 `mapping` 关系重新写到 `dex_mapping` 文件记录最新的的 `dex` 和 `apk path` 的关系。为了避免每次 `dex` 全部参与重排，可以在 `classes.dex` 和 `classesN.dex` 中预留一定数量的空位，避免每次所有 `dex` 重排。

实测 `package` 会有部分耗时增加，总体应该在 1s 以内，`mus` 整体 `dexMerge` 耗时由 35-40 s 缩减到3 s 左右。

目前该增量构建组件两种方案都支持，可以根据开关配置，要注意的点是热更的方案可能涉及到`Application`的改造。

优化效果
====

经过上述方案的优化，实测在 `mus` 中理想情况下更改子模块中一行最简单的 `kotlin` 类中的一行代码 `task` 总耗时(不包含 `configure` )最快约 10s，实际开发情况来看基本在 20-40s 之间。这部分耗时主要是实际开发改动的 `class` 和模块会多一些，同时包含了`configure` 的耗时，这部分时间目前是无法避免的。同时也包含 `class` 编译和 `kapt` 等 `task` 一起的耗时，也会受到设备的 `cpu` ，实时内存等影响。

![img](/images/jueJin/e2a1bb7f34b34b9.png)

以上数据基于个人电脑，2.3 GHz 四核 Intel Core i7，32 GB 3733 MHz LPDDR4X，不同设备跑出的数据会有部分差异，但整体优化效果还是很明显的。

总结
==

结合上述的优化方案，增量构建速度整体在一个比较低的水平，当然例如kotlin编译，kapt，增量的判断等还有进一步的优化空间，期待后续和其他 `task` 的进一步优化完成时继续分享。

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！