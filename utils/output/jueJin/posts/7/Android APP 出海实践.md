---
author: ""
title: "Android APP 出海实践"
date: 2023-02-02
description: "当前国内各个公司 APP 出海创收已经是互联网行业的常见操作。笔者最近约 2 年的时间里，都在进行云音乐旗下首个出海应用 Android 客户端的开发。本文对海外 APP 一些开发经验做一些分享。"
tags: ["Android中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:187,comments:20,collects:207,views:12707,"
---
> 本文作者：[烧麦](https://link.juejin.cn?target=http%3A%2F%2Fgithub.com%2Fshaomaicheng "http://github.com/shaomaicheng")

当前国内各个公司 APP 出海创收已经是互联网行业的常见操作。笔者最近约 2 年的时间里，都在进行云音乐旗下首个出海应用 Android 客户端的开发。本文对海外 APP 一些开发经验做一些分享。

初次出海的时候，我们总结了需要适配海外环境的方方面面，包括

*   客户端内的很多通用模块需要支持海外环境。这里包括
    
    *   确认一些三方服务对于海外环境的支持程度，例如云信、声网 SDK
    *   一些常见 APP 功能的海外版本封装，例如登录，文件上传，推送，分享
    *   底层库功能自查，支持上架政策和一些资源配置。
    
    我们的目的是，尽量保持原有的技术框架去开发新的 APP，不要因为运营环境变了，技术架构也大改。
    
*   Android APP 的发布渠道和发布格式。海外 Android 应用以 Google Play 上架发布为主，这里我们需要额外支持 aab(android app bundle) 格式进行发布。
    

### 海外应用设计

#### 基础库海外实现层

基础模块我们遵循接口实现分离的设计原则，以文件上传底层库为例，我们会有3个最终打成 aar 的 module：

*   uploader\_interface 提供文件上传相关的各种接口
*   uploader\_module uploader\_interface module各个接口的具体实现，例如文件通过中台的 CDN 接口上传。
*   uploader\_module\_oversea 同样是 uploader\_interface module里面各个接口的具体实现，实现逻辑从直接 CDN 接口上传改为先上传至亚马逊云，然后把亚马逊云的上传信息同步给 CDN。

得益于上面的设计原则，基础模块我们只需要提供对应的海外实现即可。业务代码内调用的仍然是接口 module 的 API，这样做一来一些依赖底层的业务代码可以直接复用，二来开发同学也不需要再去熟悉另一套底层库 API。

![](/images/jueJin/3653c806682fab7.png)

#### 底层库合规检查

海外 APP 在 Google Play 作为主要分发渠道的情况下，隐私政策可能和国内略有不同。而一些底层库可能包括了一些不合规的代码，这部分需要进行排查，一般来说，遵循下面 2 个原则就不容易出现问题：

*   底层库代码里面没有违规的 API 调用，例如和热修复这种动态代码下发的。Google Play 不允许相关功能
*   底层库的依赖里不要包含海外环境用不到的功能。例如一些之前全公司 APP 都通用的三方服务的SDK被集成在了某个底层库，虽然海外没有使用相关功能，但是这些 SDK 非常有可能因为包括了动态下发 so 而被检查出来。

Google Play 隐私政策可以参考

[support.google.com/googleplay/…](https://link.juejin.cn?target=https%3A%2F%2Fsupport.google.com%2Fgoogleplay%2Fandroid-developer%2Fanswer%2F9888170%3Fhl%3Dzh-Hans%26ref_topic%3D9877467 "https://support.google.com/googleplay/android-developer/answer/9888170?hl=zh-Hans&ref_topic=9877467")

**底层库资源**

另一方面，对于比较简单的底层逻辑，我们一般情况也不会对其做接口与实现拆分，但是底层有可能会使用一些通用的资源，例如文案、图标等。如果我们把这些值作为变量设置进去，一方面底层库的改动比较大，另一方面初始化时候的设置也非常的繁琐。这里我们可以利用 Android 自身的资源合并策略。

![](/images/jueJin/40131637771c389.png)

如上图，底层库里面定义的 key1 字符串，我们在上层定义同名的字符串 key2, 最终在打包的时候，资源合并会保留 key2。所以也需要我们在设计底层库的时候避免直接使用字符串硬编码，以免不能灵活支持海外应用。

### aab 文件与 Play Store 分发

#### app bundle 格式

使用 app bundle 格式当下在 Google Play 进行分发是唯一选择。

我们使用

```kotlin
./gradlew :app:bundleRelease
```

构建我们的 app bundle 文件上传至 Google Play 后台进行发布。

但是由于 aab 文件并不能直接安装在设备上，所以在日常的测试、回归阶段，我们仍然是安装 apk 文件来进行，流程如下图：

![](/images/jueJin/7bd62b75650e891.png)

从理论上来说，apk测试回归没有什么问题，aab 也就没什么问题。但是在日常实践，我们可能会有一些 Gradle Plugin 的 task 在 hook 一些编译任务的时候，忽略了 aab 的情况，从而导致一些运行时的错误。针对这种情况，在正式的 aab 文件发布前，我们还是有必要对其做一个快速的走查。

Google 官方也提供了方法让我们安装 aab 文件到设备上，使用 bundletool 工具根据 aab 文件生成 apks 文件，然后使用 `adb install-multiple` 命令安装：

```kotlin
java -jar bundletool.jar build-apks --bundle=${FILE_NAME} --output=${target_apks}
unzip target_apks
cd splits
adb install-multiple bae-master.apk xx.apk
```

这样测试回归流程则可以加上 aab，但是让 qa 同学每次使用脚本安装总也是个麻烦的事情，所以能否更彻底点呢？答案当然是可以的，既然可以通过 `install-multiple` 安装 apks 文件，那么 CI 流程上每次 aab 构建的时候，输出 aab 和 apks 2个产物，然后通过一个安装 apks 文件的 APP 进行安装。

我们可以通过 `android.content.pm.PackageInstaller` 这个 Android API 实现这个功能

![](/images/jueJin/c4ebebeb5efe29e.png)

代码如下：

```kotlin
val installer = InstallApp.application().packageManager.packageInstaller
val params = PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL)
val sessionId = installer.createSession(params)

val installSession = installer.openSession(sessionId)
    apks.forEach {
    installSession.openWrite(it.hashCode().toString(), 0, -1)
    .use { out->
    FileInputStream(it).use {fin->
    val buffer = ByteArray(16384)
    var len: Int
        while (fin.read(buffer).also { len = it } != -1) {
        out.write(buffer, 0, len)
    }
}
installSession.fsync(out)
installSession.close()
}
}

val intent = Intent(InstallApp.application(), RetActivity::class.java)
intent.action = PACKAGE_INSTALLED_ACTION
val pendingIntent = PendingIntent.getActivity(InstallApp.application(), 0, intent, FLAG_MUTABLE)
val statusReceiver = pendingIntent.intentSender
installSession.commit(statusReceiver)
```

安装结果我们可以通过 Intent 里面的 `android.content.pm.extra.STATUS` 获取。

这里我们就可以不适用脚本命令行，直接使用安装工具安装aab文件，app 的回归发布流程就比较完善了:

![](/images/jueJin/1144501596f2a2c.png)

#### Google Play 签名

Android 应用通过 Google Play 发布的时候，还需要开启 Google Play 应用签名功能，具体的操作和规则可以参考 Play 管理中心文档：

[support.google.com/googleplay/…](https://link.juejin.cn?target=https%3A%2F%2Fsupport.google.com%2Fgoogleplay%2Fandroid-developer%2Fanswer%2F9842756%3Fhl%3Dzh-Hans "https://support.google.com/googleplay/android-developer/answer/9842756?hl=zh-Hans")。

按照官方图示，Google Play 会把开发者上传的密钥重新签名为新的密钥进行发布。

![](/images/jueJin/15e02b94500c4ba.png)

最终 Google Play 控制台里面会显示最终的密钥指纹和上传密钥指纹：

![](/images/jueJin/b3c1ceddf35b33e.png)

Google Play 之所以设计这套看起来有点复杂的秘钥管理，是为了保障 APP 的签名安全。当我们的上传秘钥出现被盗取或者丢失的情况下，也只需要申请重新替换上传秘钥即可。 但是我们的 APP 在发布的时候，我们不仅需要在 Google Play 进行发布，还需要发布自己的 APK 渠道包。在后台升级密钥的时候，会有如下几个选项

![](/images/jueJin/334b012b03662bf.png)

如果使用默认的 Google Play 生成新的密钥，我们只能导出一个后缀名为 `der` 的证书，这个证书里面只包括了公钥，所以即使同 keystore 工具导出 jks 文件，也不能正常打包。所以我们需要选择 “从Java密钥库上传新的应用签名密钥”

![](/images/jueJin/afc1ecf50d9948b.png)

这里还需要注意一点，选择新的密钥规则默认选择 Android T 及以上版本升级，且此选项默认收起。我们需要选择下面的 “所有Android版本的所有新安装”，否则无法达到最终目的。

![](/images/jueJin/878f44dbfbb6176.png)

所有我们最终签名流程如下图所示：

![](/images/jueJin/f2a1cdc26857448.png)

我们拥有 2 个打包签名文件，分别为 release.jks 和 store.jks，通过 Google 的 pepk.jar 工具把 Google Play 的签名换位 store.jks。最终在发布的时候：

*   aab 文件使用 release.jks 构建，上传后会重签为 store.jks 发布
*   release 渠道包的apk文件使用 store.jks 构建，这样 apk 和商店下载的 aab 文件签名才一致，才能算是同一个 APP

#### Google Play 发布问题

在使用 Google Play 发布的时候，如果我们使用了 `uses-feature` 声明功能的时候，最终在发布的时候，可能会导致最终发布后显示支持设备类型数为 0，这样用户将无法下载甚至无法在 Google Play上看到该版本。

我们需要在声明的地方添加上 `android:required="false"`即可。为了避免底层库和上层的定义有矛盾导致 AndroidManifest 合并出错，我们可以通过 Gradle 脚本修改合并后的 AndroidManifest 文件，把 reuqired 的值全部改为 true：

```kotlin
android.applicationVariants.all { variant ->
variant.outputs.each { output ->
def processManifest = output.getProcessManifestProvider().get()
processManifest.doLast { task ->
def outputDir = task.multiApkManifestOutputDirectory
File outputDirectory
    if (outputDir instanceof File) {
    outputDirectory = outputDir
        } else {
        outputDirectory = outputDir.get().asFile
    }
    File manifestOutFile = file("$outputDirectory/AndroidManifest.xml")
    
        if (manifestOutFile.exists() && manifestOutFile.canRead() && manifestOutFile.canWrite()) {
        def manifestPath = manifestOutFile
        def xml = new XmlParser().parse(manifestPath)
        def androidSpace = new Namespace('http://schemas.android.com/apk/res/android', 'android')
        xml."uses-feature".each {it->
        println it.attributes().get(androidSpace.name)
        if (it.attributes()[androidSpace.name] == "android.hardware.camera.front" ||
            it.attributes()[androidSpace.name] == 'android.hardware.camera.front.autofocus') {
            it.attributes()[androidSpace.required] = false
        }
    }
    PrintWriter pw = new PrintWriter(manifestPath)
    def content = XmlUtil.serialize(xml)
    println content
    pw.write(content)
    pw.close()
}
}
}
}
```

### 应用多语言

#### 多语言工作流

提到应用出海，还有一个绕不开的话题就是应用多语言问题。 我们通过设置 Locale 来设置语言。并且在语言切换的时候重建 Activity:

```kotlin
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
    config.locale = target
    res.updateConfiguration(config, res.displayMetrics)
    config.setLocale(target)
    context.createConfigurationContext(config)
        } else {
        config.locale = target
        res.updateConfiguration(config, res.displayMetrics)
    }
```

具体多语言我们会从内部的多语言平台拉取打包后的xml文件，放到对应的文件夹下。应用在 Locale 修改后会自动选择对应语言的文件。例如英文目录为 `/res/values-en` ，印尼语为 `/res/values-in`。流程如下图：

![](/images/jueJin/fdb2682e18f6afd.png)

随着出海APP增多及运营国家支持语种增多，上述简单的多语言导入流程也逐渐的不够使用，包括：

*   语言较多，并且定义在代码内，每次新增语言配置都需要各个使用的地方（例如注册选择语言，设置切换语言等）修改代码。配置化程度比较低。一旦漏改，就会存在bug。
*   从多语言平台下载文案并放入res文件夹里面的时候，需要有一个 values 文件夹作为默认语言文案，在开发阶段，我们从交互稿上看到并且录入的基本为中文，但是发布后的默认文案应该为英文。如果全程手动操作非常繁琐。

我们使用 Gradle 插件来解决这2个问题。

*   每个应用支持的多语言类型通过配置文件定义，Gradle 插件根据配置文件内容生成语言信息的常量代码。
*   在编译期添加一个自动拉取多语言的 task，注册在 `pre${variant}Build` task 之后。当 variant 属于 debug 的时候，res/values 里面放的为中文的xml文件。当 variant 属于 release 的时候，res/values 里面放的为英文的xml文件。

整个 language plugin 的工作如下：

![](/images/jueJin/13895280eff35ce.png)

其中，自动拉取插件在替换文案之前，还可以做一次预检查操作。防止因为翻译错误等原因导致编译报错。例如

*   文案里面检查 1转为1 转为 %11转为s 的时候，是否有字符缺失或者增加了空字符导致 String.format 出错
*   文案里面存在 & 符号，需要修改为 &

#### 多语言解耦

在 app 的日常维护中，时常会有多语言文案需要替换。在上述工作流中，非客户端开发在需要替换文案的时候，需要频繁的提问客户端开发需要替换的具体 key。这样无疑增加了需要沟通成本。我们还可以通过一些技术手段来减少这部分的耦合。 常见的文案的替换场景大概分为两类

*   测试、走查阶段发现某些语种存在翻译缺失
*   开新区增加新翻译的时候，某些语种的文案长度不合理需要精简 这两种场景，非开发角色不经过沟通并不知道具体的多语言 key 是什么。 针对上述两种情况，我们的多语言插件设计了两部分功能。

**缺失文案检查及 mock 文案生成** 多语言插件在文案拉取的时候，对平台生成的多语言 xml 文件进行分别检查。当某语种中某个文案不存在的时候，会生成一个模拟的多语言文案写入到xml文件。模拟文案则会带上这条文案的 key。

![](/images/jueJin/3d534536927e83d.png)

例如 key 为 common\_hello 的文案在印尼语有缺失，那么运行时切换到印尼语时使用的文案就是 mock 的文案 "客户端mock common\_hello(id)"，这样 qa 或者策划看到就知道这里缺失了一条文案翻译。

**运行时查询多语言key**

当 app 业务方开发新区的时候，我们也可以把查询文案这件事尽可能的和技术剥离开。我们在 debug 运行时提供了一个悬浮窗工具，当工具开启的时候，可以选择当前页面的 TextView， 如果这个 TextView 得内容是通过 string id 加载的，那么就会把这个 key 显示在屏幕上。具体效果如下图：

![](/images/jueJin/c6898203bc6e6f1.png)

这样我们能节省开区过程中很大一部分查询多语言 key 的沟通，增加开区效率。

展望与总结
-----

这里介绍了一些 Android APP 出海的实践，涵盖了技术框架设计，发布流程，多语言等内容。并且对于大部分海外地区来说，Android 机型分布比较混乱，低端机型较多，且网络环境较国内比较差。在启动速度，内存管理、网络优化等方面，我们出海的 APP 还有很多需要建设的地方，希望能和大家进行分享交流。

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！