---
author: ""
title: "如何让云音乐iOS包体积减少87MB"
date: 2022-03-07
description: "云音乐iOS客户端包体积优化最新实践，从解析包体积口径，到分析现状，再通过使用各种优化方式，从资源到二进制，最终使云音乐安装体积下降87MB，下载体积下降60MB"
tags: ["iOS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读21分钟"
weight: 1
selfDefined:"likes:125,comments:26,collects:242,views:15359,"
---
> 本文作者：[大鹏](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FAustinWp "https://github.com/AustinWp")

  云音乐iOS客户端是自2013年开始的老项目，经历近十年的业务滚动发展，从单体音乐APP发展至今，多种业务加持，俨然已经成为类似于平台级的巨型APP，并且包体积也随着业务的发展越来越臃肿，影响用户的实际体验，甚至是品牌的口碑，在笔者开始优化之前云音乐在AppStore显示的包体积已经达到了420MB之多，在这种情况下，团队开启了包体积优化的专项。

  包体积优化是客户端开发的老命题了，基本上作为iOS开发同学多多少少都了解大体该怎么做，但随着苹果的发展，一些原来可行的措施在新版本已经不在适用，所以本篇文章则侧重于优化过程中的一些最新的实践经验，以及在大项目中是如何落地的，那么话不多说，下面就开始。

口径
--

  在开始做优化之前，我们首先需要摸清楚包体积的各种口径以及它们之间的关系，因为后续的一些优化措施会导致不同口径此消彼长的情况，所以首先要确定最终目标口径是什么。 首先，我们可以在苹果后台看到自己APP具体的安装大小和下载大小的具体情况，还包含了不同的机型版本。

![包体积版本](/images/jueJin/57c473c3069eae9.png)

  那么苹果后台的下载大小和安装大小是如何生成的呢，请看下图，在上传后，苹果官方对对我们上传的IPA包解包后，对二进制进行了DRM加密（此项也会导致包体积的增长）和AppThinning，AppThinning会根据不同的机型对原始包的资源和代码进行不同程度的裁剪，从而生成适配具体机型的版本。此外苹果还会生成一个包含全集的通用版本，但并没有啥实际用处。关于DRM和AppThinning此处不展开，文章末尾有链接。

![包体积生成流程](/images/jueJin/934a367a669b913.png)

如上图所示，在上传前后我们有三个指标：

*   APP原始包体积: 上传前IPA解包后，实际APP的大小
*   下载体积: AppStore中流量下载时提示框的大小
*   安装体积: AppStore中APP详情中显示的大小

在摸清了各指标的关系后，我们最终选择了用户感知最强的安装体积作为核心指标，以其作为最终目标进行优化。

分析
--

  虽然已经确定了目标，但在优化之前，还需要对现状进行分析，找到最大的劣化点，从而有针对性的进行优化，获取最大的收益比，那么下图就是云音乐iOS包的基本情况，可以看到红色的资源部分占到了一半以上的体积，而二进制则次之也占到了四分之一多，那么后续优化的侧重点可以放到资源和二进制源码。 ![包体积生成流程](/images/jueJin/e62014eb0c0ccfd.png)

资源
--

  对于资源的处理其实方式就是常规那么几种：资源清理、资源整理、资源压缩、资源云端迁移、资源合并等等，总之就是想尽一切办法去降低资源所占用的本地空间，下面简单介绍下我们在云音乐所做的工作。

### 资源清理

  在开始做整体的资源优化之前，第一步是需要清理已经不在使用的资源，包括图片、配置文件、音视频等等，检测无用资源的主要思路就是通过静态检测判断资源是否有被引用，例如使用ImageName来判断图片是否被使用，当然线上检测的方式是更准确了，但在资源这里没有必要，不过云音乐作为老业务，使用图片的姿势也各式各样，例如引用的文件名不规范、未使AssetCatelog、手动拼接图片名称2x3x等问题，这就需要稍微定制化的方式进行查找，排除异常情况，其他APP根据自身实际情况调整即可，思路都一样，网上也有现成工具。

  云音乐经过几轮清理之后，先后清理图片等类型文件1200+，获得收益12+MB左右的原始包体积下降，还是比较可观的。

### 资源整理

  资源整理其实就是把合适的资源用合适的方式管理，这里主要指的就是Asset.car文件，众所周知，苹果自iOS7之后推出了AssetCatelog文件，帮助开发者管理资源，其中最主要的就是图片资源，在编译之后会生成Asset.car文件并打入IPA包中，前文也说过，云音乐是老工程，所以还有部分资源图片是非Asset管理的方式，而使用Asset会给包体积带来收益，所以就需要对现有资源进行迁移，使用Asset进行管理；但这里有个问题，为什么使用Asset会带来包体积收益呢？

  要回答上面的问题，首先要从Asset的原理说起，在AssetCatelog的编译过程中，以ImageSet类型为例，首先会对Asset中的ImageSet类型图片进行无损压缩，并且会把多张ImageSet图片合成一张大图，故在编译后，是无法通过bundle path的方式读取图片的，必须使用苹果的ImageName的API，因为它是通过坐标等方式，从合成后的大图中获取具体的图片信息的；那么这样做的好处就是，在压缩和合成的过程中会有图片体积的收益；但是经过我们研究，发现并不是所有图片都会有此收益，一些大体积的图片在经过无损压缩和合成后，产生的体积更大，我们猜测这可能和合成大图有关，越小的图片收益的可能性越高。

  另外就是动图最好不要使用ImageSet的类型，因为在压缩和合成的过程中动图会出现问题，导致通过ImageName读取出来的数据不对，会产生无法播放等问题；但是可以使用DataSet的类型，DataSet是不参与合成和压缩的，所以不会影响，对于其他的资源类型，一般也都可以使用DataSet的方式，而读取的时候使用NSDataAsset即可。那如何知道Asset处理过的资源的情况呢，可以使用下面命令解析编译好的Asset.car，获取其中资源编译后的信息。

```css
xcrun --sdk iphoneos assetutil --info Assets.car
```

![DataSet](/images/jueJin/1e06c9b0c4fdf0a.png)

![ImageSet](/images/jueJin/60d11b466752ee2.png)

  从上图可以看到，对于Data类型的资源，是没有压缩的；而对于Image类型，是有标注出具体的压缩算法的，以及一些图片信息。另外在过程中我们也发现，对于不同的图片苹果使用的压缩算法都是不同的，并且会被压缩成多份，这也是为什么我们在把一部分资源从bundle中移入AssetCatalog中后，IPA体积还变大了的原因，但没关系，安装体积是会下降的，是因为使用Asset的最大的收益其实是来源于前文提到过的苹果的AppThinning，苹果的瘦身机制会把Asset.car根据不同的机型进行分发，例如1x2x3x都有不同应对的设备机型，所以虽然会被压缩成多份，但每台机器实际使用的只有一份，这也是为什么即便是IPA变大了，但其实安装体积会变小。

  最后要说的是，因为没办法一个一个图片去进行Asset编译对比编译前后的大小，从概率来讲，更推荐小图（5k以内）以及有多版本(2x3x)的图片放入AssetCatalog管理，其他资源其实单独存储更自由，而非使用DataSet，因为单独存储更方便使用各种压缩手段而不担心会被苹果的处理而影响到，这个点在后续资源压缩会详细说到。

  经过这项优化，云音乐iOS客户端迁移各种尺寸的图片资源2400+，实现安装体积收益22+MB。

### 资源压缩

  资源压缩很好理解，顾名思义就是对资源进行各种方式的压缩，在云音乐中最主要的资源就是图片，其他类型占比很小，常见的图片资源格式主要是png、apng、webp等，云音乐包里绝大部分图片也是以上几种格式；因为经过上一步的工作，几乎所有图片都在AssetCatalog中管理，而上文也提到了苹果会对AssetCatalog的图片资源进行无损压缩，所以如果我们本身对图片资源所施加的无损压缩是没有效果的，因为苹果会再压一遍，最终结果是以他为准。所以要在压缩这里拿到优化结果，就要实质性的降低图片的大小，那么就得做有损压缩。对于常规图片格式，我们使用了pngquant、tinypng等算法及工具进行压缩，在使用pngquant时，经过先后大数据样本测试，最终选择80%的有损比率，因为此时是比率是收益曲线最高同时相对图片质量影响较小的时候，但对于不同的工程这个曲线也许是不一样的，因为每个工程的实际资源情况是有区别的，所以要自行去获取工程的数据，具体的做法是可以过脚本去尝试不同的压缩率并记录压缩结果从而形成一张曲线图。另外在我们包里还有很多遗留的体积较大的webp动图，一般的方式都无法进行压缩，经过一定的调研最终发现谷歌官方提供了Webpmux可以对webp动图进行拆解和逐帧压缩以及合成，基于此我们编写了一个可以压缩webp动图的脚本，实现了对webp动图的压缩。最终我们把所有常见格式的图片压缩能力集成在一个大脚本中，对包内所有的图片资源进行压缩，此脚本对于后续防劣化也有用处。

  经过此项，整体压缩各尺寸png图片5000+，apng动图100+，webp动图100+，总体收益42+MB（原始包体积）。

### 资源云端迁移

  在经过清理、整理、压缩后，资源部分还是有不少包体积的占用，所以我们启动了大资源云端迁移专项，之所以是大资源是因为大资源带来的收益比最高，经过讨论，结合云音乐的实际情况，最终定下了50kb的基线，大于50kb则会被界定为大资源。我们不是没有考虑资源统一迁移统一下载的方案，但从云音乐的体验以及成本层面考虑，最终还是选择以传统方式处理ROI高的部分。经过筛选后云音乐包内有150+的case符合大资源的情况，其中85%以上是可以迁移至云端的。对于资源是否要放在本地还是云端，我们和设计同学共同制定了相关资源图片\\动画的使用规范，纯技术资源则由技术同学判断。

  在迁移专项做完后，总体迁移了100+的大资源，收益约在31+MB（原始包体积）。

### 资源合并

资源合并其实主要是二点，一个是单个相似图片的去重，我们花了一定功夫使用相似图的分析算法对云音乐所有的资源图片进行了检测，结果和我们预期并不相符，实际上并没有太多相似的图片、包括icon，此部分并无收益。另外一个是AssetCatalog合并，结合云音乐的实际情况，此项也并无收益，主要是云音乐的资源目前是集中化管理。

二进制
---

  每个APP程序最终都会被编译出一个主体二进制文件，所有的静态库依赖都会被链接进来，此部分的大小主要由代码量以及编译参数影响，下文的优化思路也是集中于减少代码量以及优化编译参数。

### 无用代码检测

  想要降低代码量，首先想到的就是清理无用代码，那么哪些代码又是无用的呢？这就有了无用代码检测，一般检测的方式分为线上动态检测和线下静态检测，动态检测的准确率要远高于静态检测，并且静态代码编译器已经支持了一些裁剪方式，例如DeadCode优化；那么基于此我们采用了更准确的线上大数据动态检测，唯一的缺点就是获取数据的周期较长，需要上线运行。

  最初我们的想法是通过hook类初始化方法+initialize来判断某个类是否被使用，但这种方案有几个问题：第一是启动时机的问题，因为我们使用了AB采样，那么必须在AB初始化后某个时间点开启，那么AB初始化之前的类就没法记录，除非所有用户都记录，只是在上传的时候采样，但这样会影响未被灰度的用户；第二是+initialize本身调用时机的问题，并不是所有类的+initialize都会被调用。之后我们采用了另外一种方案，在OBJC中，每个类都有自己的元数据，在元数据中的一个标记位存储着自己是否被初始化，这个标记位不受任何因素影响，只要有被初始化就会打标记，在objc的源码中获取标记位的方式如下：

```C++
    struct objc_class : objc_object {
        bool isInitialized() {
        return getMeta()->data()->flags & RW_INITIALIZED;
    }
}
```

  但这个方法APP是无法直接调用的，它是objc的方法；但是并不代表RW\_INITIALIZED这个标记位的数据不存在，数据还是在的，所以我们可以通过已有的接口以及可以阅读的源码信息来模拟上述代码，从而获得标记位数据确定某个类是否是初始化的，代码如下：

```C++
#define FAST_DATA_MASK  0x00007ffffffffff8UL
#define RW_INITIALIZED  (1<<29)
    - (BOOL)isUsedClass:(NSString *)cls {
    Class metaCls = objc_getMetaClass(cls.UTF8String);
        if (metaCls) {
        uint64_t *bits = (__bridge void *)metaCls + 32;
        uint32_t *data = (uint32_t *)(*bits & FAST_DATA_MASK);
            if ((*data & RW_INITIALIZED) > 0) {
            return YES;
        }
    }
    return NO;
}
```

通过上面的模拟代码，我可以获取某个类是否是被使用的，进而上报信息后，基于大数据分析出哪些类是已经可以清理的，通过此种方式，我们检测出了数千个未被使用的类，但这些并不代表实际是能够清理的，比如有的在做AB，有的是预埋业务等等，所以数据结果还需要业务侧进行一遍过滤，最终我们处理了1200+个类，成功清理了300+，收益在2+MB（二进制章节所有口径均为原始包口径）左右，剩余未处理的仍在处理中，作为长线进行优化。

### 二三方库下线

  基于上面的未被使用的类数据，可以通过聚类分析，得到已经不在使用的业务组件或者二三方库，在优化过程中我们识别出了数个可以下线的二三方库，收益在4+MB。

### 动态库依赖裁剪

  除了业务代码的处理，本身云音乐也依赖了一些动态库，并且这些动态库因为历时原因，有些静态依赖是重复的，具体如下图所示： ![动态库裁剪](/images/jueJin/49de265b0463ddd.png)

这是比较极端的一个Case，在主程序中、动态库A中、动态库B中分别有一份OpenSSL的符号，那么这种就造成了重复，占用二进制体积；那么这种问题最好的解决方案就是动转静，把动态库转化为静态库，都链接在主程序中，解除原来的依赖，都使用主二进制中的Symbol，这样还可以一定程度的提升启动速度，因为减少了动态库的数量。通过对类似这种问题的解决，总体收益是3+mb。

### 编译优化

  在通过各种方式优化裁剪代码之后，就要开始优化另外一个影响二进制体积的因素了，就是编译参数，编译参数有很多，可以分为编译期参数以及链接期参数，接下来我将整理基本上所有会影响二进制体积的参数供读者参考使用

#### Asset Catalog Compiler Optimization

  Asset编译优化可以降低Asset.car产物体积，此项云音乐之前只开启了主工程，未开启组件的编译参数，经过优化后收益未2.1MB

#### EXPORTED\_SYMBOLS\_FILE

  对于APP来讲可以看做是一个大的“动态库”，用户在点击开启APP的时候系统就开始加载这个动态库，那么动态库总会有向外暴露的符号也就是Exported Symbols，但是对于APP而言一般不会在iOS系统里还有别的地方调用，更多的是APP调用系统的服务，所以我们可以把Exported Symbols给Trim掉，还好编译器提供了EXPORTED\_SYMBOLS\_FILE可以让我们限制输出的符号，从而降低二进制的体积；具体的方式是新建一个txt文件，放入工程目录中（仅工程目录，无需加入到xcode工程中，会成为资源影响包体积），把EXPORTED\_SYMBOLS\_FILE指向这个文件，那么如果是空文件则所有的exported符号段都会被裁剪掉，可以通过在txt文件里指明具体要留下的符号，编译器就会裁剪掉未声明的部分。 ![ESF-1](/images/jueJin/8e8affad17864e6.png) ![ESF-2](/images/jueJin/c568801e6aac642.png)

下图为开启后被裁减掉符号段 ![ESF-3](/images/jueJin/9b342832b80c00a.png)

值得注意的是，如果APP使用了Firebase，则不能全部裁剪掉，会导致Firebase启动不成功，进而无法获取Crash信息，原因是Firebase依赖上图Export Info中的\_\_mh\_execute\_header这部分符号，所以可以在上文提到的txt文件中加入\_\_mh\_execute\_header，则编译器在裁剪时会保留\_\_mh\_execute\_header的部分。

  此项为链接期优化，只需主工程开启即可，云音乐在开启后，此项收益是2.4MB。

### Link-Time Optimization

  LTO的优化主要体现在跨文件的废弃代码裁剪优化、永远不会执行的空逻辑优化、内联优化，意思是直接复制函数，减少内联层级，提升函数栈的执行效率和空间利用率。详情请查看LLVM的[官方文档](https://link.juejin.cn?target=https%3A%2F%2Fllvm.org%2Fdocs%2FLinkTimeOptimization.html "https://llvm.org/docs/LinkTimeOptimization.html")，此处不在赘述。

![LTO](/images/jueJin/de0db8f1b679687.png)

  另外经过测试验证了LTO只对静态语言生效，OC是动态语言，所有函数方法有可能在运行时被动态调用，所以是不可能裁剪的，这就是为什么在链接静态库时，如果是C库，那么看起来原来二进制很大，实际上被实际链接进来的只有真实使用的小部分，但是如果是OC库则基本上全部会链接。所以如果你的APP源码中C或者C++代码较多的话在此项上收益可能会大一些。

  虽然LTO名称看起来是链接期优化，但实际上是编译期也需要参与的，否则会没有效果，这和跨文件的优化有关，在编译期就要产出部分信息，提供链接期优化使用。

  经过LTO的优化，云音乐获得的收益是1MB。

#### GCC\_OPTIMIZATION\_LEVEL

  此项意通过更激进的GCC编译优化，进而产生更低的二进制产物，Xcode默认是Debug设置O0，Release设置为Os，但其实还可以使用Oz模式，从而达到更小的体积。 ![GOL](/images/jueJin/7a7f05d251cc4fb.png)

  其实Oz的原理和上面的在内联（inline）还是外联（outline）上的思路LTO刚好相反，Oz是想通过更多的外联来降低函数的内联层级，但这样就会是函数的调用栈变得很深，进而会降低函数的执行效率，如上图所示会变得比较“慢”，其实本质上也是时间和空间的博弈；另外如果要想开启此项可参考抖音的文章，他们有遇到一些objc\_retainAutoreleaseReturnValue的问题，但截至目前，我们在实际实践的过程中暂时并未发现，不过基于稳定性的考虑，此项目前还未在云音乐上线，只是在debug环境开启进行测试，还在持续观察中。 如果开启此项，经过测试预估的收益在10+MB左右。

#### 其他编译优化项

*   Enable C++ Exceptions以及Enable Objective-C Exceptions，关闭掉此项可以带来二进制体积上的收益，但是会影响TryCatch，酌情使用，云音乐未开启
*   Architectures，架构指令集，此部分需要注意一些二三方的Framework是否包含不需要的指令集
*   Strip Symbols，裁剪符号相关，此处不展开，下方为相关设置
    *   Strip Linked Product = YES
    *   Strip Style = All Symbols，注：在Strip Linked Product未开启时，此项设置不生效
    *   Deployment Postprocessing 注: 此项在打包是无论怎么设置，苹果会默认设置为YES
*   Symbols Hidden by Default = YES，设置符号可见性
*   Make Strings Read-Only = YES
*   Dead Code Stripping = YES，编译期检测判定未使用代码进行裁剪
*   Optimization Level，一般debug设置为None，Release设置为Os

### 二进制小结

  除了以上各种优化二进制的措施外，其实在业界还有不少其他措施，但云音乐因各种原因并未采用，例如通过重命名\_Text代码段，进而绕过苹果的DRM加密，来降低二进制大小，但此项在iOS13之后苹果已经意识到这个问题，并一定程度上解决了，所以这个优化方法基本上已经失效了；还有二进制段压缩，从风险和收益的角度考量，也是暂未使用；还有属性动态化，主要是针对有大量属性的模型属性进行动态优化，动态添加get/set方法，从而获得省略这部分方法的收益，此项收益估算也很小，也就并没有使用。其实总结来说优化方法是很多的，但对于具体的APP根据实际情况选择最合适的措施即可，并不一定非要如何如，毕竟要有ROI的考量。

防劣化
---

  在优化的过程中，我们发现工程的实际劣化速度也很快，甚至达到了每个迭代优化量的40%50%，也就是说，我们假定一个迭代优化了10MB，但是这个迭代的劣化达到了45MB，所以我们不得不在治理的同时就开启防劣化的工作，我们制定了一些防劣化措施，其中一部分已经上线，剩下的还在开发中，目前已经取得了很好的效果，体积的劣化情况已经得到了比较有效的遏制，也保住了优化的成果，具体措施如下：

*   大资源卡口：在代码合入时进行资源检测，并强制卡口
*   二方库三方库卡口：在代码合入时进行二方库三方库的检测，包含新增和升级
*   自动压缩：对于资源合入进行自动压缩，但首推还是放在远端，非常必要的情况下再放本地
*   定期资源情况检测：定期自动化进行全APP的资源摸查，问题追溯
*   定期代码检测：定期自动化的进行全APP的代码摸查，无用代码下线
*   和UED共同推出图片动画动效资源使用规范，规定哪些可以在本地，哪些必须远端，以及动效的优化方案

结果
--

  在经过一段时间的各种优化后，云音乐的安装体积下降87MB，从原先的420MB+降低到现在的330MB+，整体感官上还是有区别的，下载体积下降65MB，突破了200MB的苹果OTA限制，达到了160+MB。

相关资料
----

*   [What is app thinning?](https://link.juejin.cn?target=https%3A%2F%2Fhelp.apple.com%2Fxcode%2Fmac%2Fcurrent%2F%23%2Fdevbbdc5ce4f "https://help.apple.com/xcode/mac/current/#/devbbdc5ce4f")
*   [Asset Catalog Format Reference](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Flibrary%2Farchive%2Fdocumentation%2FXcode%2FReference%2Fxcode_ref-Asset_Catalog_Format%2Findex.html "https://developer.apple.com/library/archive/documentation/Xcode/Reference/xcode_ref-Asset_Catalog_Format/index.html")
*   [pngquant](https://link.juejin.cn?target=https%3A%2F%2Fpngquant.org%2F "https://pngquant.org/")
*   [webpmux](https://link.juejin.cn?target=https%3A%2F%2Fdevelopers.google.com%2Fspeed%2Fwebp%2Fdocs%2Fwebpmux "https://developers.google.com/speed/webp/docs/webpmux")
*   [Code Size Performance Guidelines](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.apple.com%2Flibrary%2Farchive%2Fdocumentation%2FPerformance%2FConceptual%2FCodeFootprint%2FArticles%2FReducingExports.html%23%2F%2Fapple_ref%2Fdoc%2Fuid%2F20001864-CJBJFIDD "https://developer.apple.com/library/archive/documentation/Performance/Conceptual/CodeFootprint/Articles/ReducingExports.html#//apple_ref/doc/uid/20001864-CJBJFIDD")
*   [从 Exported Symbols 应用于包大小优化说到符号绑定](https://link.juejin.cn?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2F675756173a6aD "https://www.jianshu.com/p/675756173a6aD")
*   [LLVM Link Time Optimization](https://link.juejin.cn?target=https%3A%2F%2Fllvm.org%2Fdocs%2FLinkTimeOptimization.html "https://llvm.org/docs/LinkTimeOptimization.html")
*   [Reducing Code Size Using Outlining](https://link.juejin.cn?target=https%3A%2F%2Fmnt.io%2F2016%2F12%2F06%2Freducing-code-size-using-outlining%2F "https://mnt.io/2016/12/06/reducing-code-size-using-outlining/")
*   [Interprocedural MIR-level outlining pass](https://link.juejin.cn?target=https%3A%2F%2Flists.llvm.org%2Fpipermail%2Fllvm-dev%2F2016-August%2F104170.html "https://lists.llvm.org/pipermail/llvm-dev/2016-August/104170.html")

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！