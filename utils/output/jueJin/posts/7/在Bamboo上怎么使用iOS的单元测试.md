---
author: "京东云开发者"
title: "在Bamboo上怎么使用iOS的单元测试"
date: 2024-09-26
description: "本教程将使用北汽登录模块为例，一步一步和大家一起搭建单元测试用例，并在Bamboo上跑起来，最终测试结果和代码覆盖率会Bamboo上汇总。 模块名称：BQLoginModule,是通过iBiu创建的一"
tags: ["程序员中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:2,comments:1,collects:1,views:51,"
---
本教程将使用北汽登录模块为例，一步一步和大家一起搭建单元测试用例，并在Bamboo上跑起来，最终测试结果和代码覆盖率会Bamboo上汇总。

模块名称：BQLoginModule,是通过iBiu创建的一个模块工程

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

![截屏2021-07-02 下午5.03.33.png](/images/jueJin/72c5d67d270c4ed.png)

一 建立单元测试Bundle
--------------

ProductName: **BQLoginTests**

![image.png](/images/jueJin/f2c3c1cd7ba24be.png)

二 测试代码编写
--------

### 1 配置文件同步

如果我们要在测试代码使用我们在Pod里的类，需要同步 Targets Support Files/Pods-BQLoginTests/Pods-BQLoginTests.debug.xcconfig 文件的内容到 Targets Support Files/Pods-BQLoginUITests/Pods-BQLoginUITests.debug.xcconfig,直接内容copy就成了，只是每次用iBiu安装过后都要做这个操作，后续使用脚本实现同步：

![image-1.png](/images/jueJin/74abc6c046324a0.png)

### 2 测试代码编写

具体的编写我这里就过多介绍了，网上教程一大篇，这里就不多说了，如果没有做性能测试，这里可以把自动生成的 testPerformanceExample 屏蔽掉。

![image.png](/images/jueJin/967f0f9fc05b4b0.png)

三 运行单元测试
--------

用 command+u，或者菜单（product->test)执行，就能获得结果

![截屏2021-07-02 下午6.04.10.png](/images/jueJin/aaaa2cdd9fb3448.png)

结果在这里看：

![image.png](/images/jueJin/f85b0b6955bc427.png)

完成以上操作，基本的单元测试就OK了

下面我们用命令行来跑下单元测试，首先进入工程目录：

```bash
cd BQLoginModule/Example
```

执行如下命令：

```ini
xcodebuild test -UseModernBuildSystem=NO -configuration=Debug -workspace './BQLoginModule.xcworkspace' -scheme "BQLoginModule_Example" -destination 'platform=iOS Simulator,name=iPhone 8,OS=13.2.2'
```

请大家注意将 workspace/scheme /模拟器信息 修改为自己工程对应信息

就可以看到结果

四 代码覆盖率
-------

### 1 单元覆盖率

在XCode打开覆盖率统计，我们只打开我们的库做代码覆盖就成了，Xcode 12.4在如下地方：

![image.png](/images/jueJin/765ebf1c4b914c0.png)

在Pod里面BQLoginModule设置 BuildSettings 查找 "cov" ,把 以下2项都设置为YES；

![image-1.png](/images/jueJin/6b2e959e19044b5.png) 然后我们跑下单元测试，就可以看到覆盖率结果了：

![image.png](/images/jueJin/98815d3bcab24ea.png)

### 2 Bamboo报告

因为我们需要在Bamboo上汇总覆盖率报告，这里我们使用iBiu的一个高级特性：用 Podfile.custom 文件加载通用cocoapods的外网库来使用，具体见图：

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

![image.png](/images/jueJin/57fbd2796da747e.png)

这里我们引入2个库： OCMock（单元测试必备的Mock库) XcodeCoverage(覆盖率统计的库）

加入这个文件后，需要使用 iBou重新安装下组件

做如下设置：

![image-1.png](/images/jueJin/9f0e1ad7b068430.png) ![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

![image.png](/images/jueJin/54a4fe63b74c4d9.png)

这个命令主要是生成XcodeCoverage的环境依赖 env.sh 我们打开文件看下，文件路径如下

![image-1.png](/images/jueJin/cc7cc7e9fbc84e7.png)

env.sh内容如下：

![image.png](/images/jueJin/92d757b8d7f04f9.png) 这里 OBJECT\_FILE\_DIR\_normal 和 SRCROOT指向的是我们Example工程，我们是需要对Pods里的BQLoginModule里的代码做单元覆盖，这2个环境变量修改如下：

```ini
export OBJECT_FILE_DIR_normal ="/Users/cdwutao3/Library/Developer/Xcode/DerivedData/BQLoginModule-fvrzeicgcswucwfgjqweugauzxia/Build/Intermediates.noindex/Pods.build/Debug-iphonesimulator/BQLoginModule.build/Objects-normal"

export SRCROOT="/Users/cdwutao3/Desktop/ut/BQLoginModule/BQLoginModule/Classes"
```

然后在Pods/XcodeCoverage目录新建 xmlout目录，并运行命令:

```bash
./getcov -x -s -o xmlout
```

可以得到如下结果：

![image-1.png](/images/jueJin/68f9fe8f5071456.png) 还可以查看哪些代码没被覆盖，和Bamboo结果对齐： ![image.png](/images/jueJin/d2c5038b23c148e.png) 完成以上步骤，就完成了本地用命令号完成单元测试的所有步骤，下面我们接着来看要在Bamboo上输出报告需要怎么做。

五 Bamboo操作
----------

### 1 创建应用

这里要确保对应库和依赖的库 ，给 xn\_testdev\_ci账号开权限

![image-1.png](/images/jueJin/f981fe262fc6406.png)

### 2 新建流水线

选择 “从零开始创建”

![image.png](/images/jueJin/349e4e15da74498.png)

### 3 配置流水线

基础信息里面的选择如下

![image-1.png](/images/jueJin/03a090b92db3479.png)

### 3 配置流水线

![image.png](/images/jueJin/de0ee41152a84a3.png) 需要用到以下四个原子：

**“下载代码”** --大家可先配置使用“下载代码-iBiu”这个原子,我用这个一直使用不成功，所以直接用“下载代码”来手动配置： ![image-1.png](/images/jueJin/e956a4ec3c164de.png)

![image.png](/images/jueJin/4a057a1e0492424.png)

**“自定义脚本”** --因为现在iOS的单元测试还没有对应的原子操作，所有我们通过自己写脚本来完成：

![image-1.png](/images/jueJin/78f24206a4154aa.png)

**“单元测试”** --你没看错，就是用java的单元测试原子，我们输出的结果和这个原子匹配，所以选他就成了

![image.png](/images/jueJin/1c6268881a034aa.png)

![image-1.png](/images/jueJin/7993348ddf7b4a7.png)

**“GCC代码覆盖率”** ![image.png](/images/jueJin/a0f3b2bf47bc4bd.png)

![image-1.png](/images/jueJin/9336147a3c84406.png) 其中“单元测试”和“代码覆盖率”的路径是可以修改的，这个可以根据自己的实际路径修改

### 4 自定义脚本

说明：

1 下载代码和配置iBiu都是自己的命令行来做的，但是需要开始配置下git用户信息

2 开始我用命令行写全部命令，但是Bamboo的命令行规则会导致一些的shell指令的失效，所以我采用把 shell命令 写到文件上传到git仓库，然后执行的方式来完成

3 结果转换会还会用到 ocunit2junit 和 xcpretty 这2个命令，如果这2个命令出错，请联系Bamboo同事协助安装下

4 大家在写shell命令时，不知道文件是否生成，可以多用 ls 来看目录下的文件

5 重点：

*   为了手动安装iBiu配置，请将本机 ~/Library/Application Support/iBiu/BQLoginModule/下的2个文件 spec\_sources 和 pod\_setup 上传到git，我是copy到 Example/BQLoginModule/Resource目录下然后上传到git仓库，这个目录可以修改，然后修改对应shell 命令的目录就成了
    
*   iBiu建的git仓库默认会过滤一些内容，修改 BQLoginModule 工程目录下的 .gitignore 文件，需要上传xcworkspacedata内容
    

![image.png](/images/jueJin/b266263ee6b248d.png)

*   代码覆盖率设置，XcodeCoverage的说明强调了不要用于AppStore的工程，为了避免线上事故，我们通过命令来设置，不直接在工程里设置：

![image-1.png](/images/jueJin/a69fb07acea2481.png)

所以修改xcode的构建命令新加 GCC\_INSTRUMENT\_PROGRAM\_FLOW\_ARCS=YES GCC\_GENERATE\_TEST\_COVERAGE\_FILES=YES，命令如下：

```ini
xcodebuild -UseModernBuildSystem=NO -enableCodeCoverage=YES -configuration=Debug GCC_INSTRUMENT_PROGRAM_FLOW_ARCS=YES GCC_GENERATE_TEST_COVERAGE_FILES=YES -workspace "./${moduleName}.xcworkspace" -scheme "${moduleName}_Example" -destination 'platform=iOS Simulator,name=iPhone 8,OS=13.2.2' test
```

### 5 Bamboo结果

![image.png](/images/jueJin/8eab8c6eed3c441.png)

覆盖率下载地址：

![image.png](/images/jueJin/1d5d3d757a7e443.png)

六 脚本汇集
------

### 1 本地脚本

以BQLoginModule为例，最终本地脚本命令如下，大家可以重新找到本地目录执行查看效果：

```bash
git clone --depth=1 https://git.jd.com/BQMobileshop/BQLoginModule.git
cd BQLoginModule/Example
pod update


pwd
moduleName="BQLoginModule"
testName="BQLoginTests"


biu -pod install ./
ls
ls ./Pods
rm -f "./Pods/Target Support Files/Pods-${testName}/Pods-${testName}.debug.xcconfig"
cp -f "./Pods/Target Support Files/Pods-${moduleName}_Example/Pods-${moduleName}_Example.debug.xcconfig"  "./Pods/Target Support Files/Pods-${testName}/Pods-${testName}.debug.xcconfig"
cat "./Pods/Target Support Files/Pods-${testName}/Pods-${testName}.debug.xcconfig"


xcodebuild clean -workspace "./${moduleName}.xcworkspace" -scheme "${moduleName}_Example"


xcodebuild  -UseModernBuildSystem=NO -enableCodeCoverage=YES -configuration=Debug GCC_INSTRUMENT_PROGRAM_FLOW_ARCS=YES GCC_GENERATE_TEST_COVERAGE_FILES=YES -workspace "./${moduleName}.xcworkspace" -scheme "${moduleName}_Example" -destination 'platform=iOS Simulator,name=iPhone 8,OS=13.2.2'  test  > utlogfile.txt
cat utlogfile.txt |grep ".xcresult" > utlogpath.txt
logStr=$(cat ./utlogpath.txt)
logPath=${logStr:1}
if [ -z "$logPath" ]; then
exit 1
fi


sed "s/${moduleName}.build/Debug-iphonesimulator/${moduleName}_Example.build/Pods.build/Debug-iphonesimulator/${moduleName}.build/g" ./Pods/XcodeCoverage/env.sh> cov_env1.txt
sed "s/${moduleName}/Example/${moduleName}/${moduleName}/Classes/g" ./cov_env1.txt > cov_env2.txt
cp -f ./Pods/XcodeCoverage/env.sh ./Pods/XcodeCoverage/env_bak.sh
rm -f ./Pods/XcodeCoverage/env.sh
cp ./cov_env2.txt ./Pods/XcodeCoverage/env.sh


cat "./utlogfile.txt"|ocunit2junit
ls test-reports


cp ./cov_env2.txt ./Pods/XcodeCoverage/env.sh
mkdir xmlout
./Pods/XcodeCoverage/getcov -x -o xmlout
ls ./xmlout/lcov


cat "./utlogfile.txt"|xcpretty -t -r html --output testresult/testresult.html
ls te
```

### 2 Bamboo脚本

Bamboo脚本分成2部分，一个是在Bamboo上执行的脚本

```bash
rm -fr "/Users/admin/Library/Application Support/iBiu/BQLoginModule"
mkdir "/Users/admin/Library/Application Support/iBiu/BQLoginModule"
rm -fr ./BQLoginModule
git clone --depth=1 https://git.jd.com/BQMobileshop/BQLoginModule.git
cd BQLoginModule/Example
cp "./BQLoginModule/Resource/spec_sources" "/Users/admin/Library/Application Support/iBiu/BQLoginModule"
cp "./BQLoginModule/Resource/pod_setup" "/Users/admin/Library/Application Support/iBiu/BQLoginModule"
ls "/Users/admin/Library/Application Support/iBiu/BQLoginModule"
biu -pod install ./


sh UT.sh
```

脚本剩下部分写入 UT.sh，放在BQLoginModule/Example目录下， 然后上传到git仓库来执行，大家做的时候注意修改变量名称：

```bash
pwd
moduleName="BQLoginModule"
testName="BQLoginTests"


ls ./Pods
rm -f "./Pods/Target Support Files/Pods-${testName}/Pods-${testName}.debug.xcconfig"
cp -f "./Pods/Target Support Files/Pods-${moduleName}_Example/Pods-${moduleName}_Example.debug.xcconfig"  "./Pods/Target Support Files/Pods-${testName}/Pods-${testName}.debug.xcconfig"
cat "./Pods/Target Support Files/Pods-${testName}/Pods-${testName}.debug.xcconfig"


xcodebuild clean -workspace "./${moduleName}.xcworkspace" -scheme "${moduleName}_Example"


xcodebuild  -UseModernBuildSystem=NO -enableCodeCoverage=YES -configuration=Debug GCC_INSTRUMENT_PROGRAM_FLOW_ARCS=YES GCC_GENERATE_TEST_COVERAGE_FILES=YES -workspace "./${moduleName}.xcworkspace" -scheme "${moduleName}_Example" -destination 'platform=iOS Simulator,name=iPhone 8,OS=13.2.2'  test  > utlogfile.txt
cat utlogfile.txt |grep ".xcresult" > utlogpath.txt
logStr=$(cat ./utlogpath.txt)
logPath=${logStr:1}
if [ -z "$logPath" ]; then
exit 1
fi


sed "s/${moduleName}.build/Debug-iphonesimulator/${moduleName}_Example.build/Pods.build/Debug-iphonesimulator/${moduleName}.build/g" ./Pods/XcodeCoverage/env.sh> cov_env1.txt
sed "s/${moduleName}/Example/${moduleName}/${moduleName}/Classes/g" ./cov_env1.txt > cov_env2.txt
cp -f ./Pods/XcodeCoverage/env.sh ./Pods/XcodeCoverage/env_bak.sh
rm -f ./Pods/XcodeCoverage/env.sh
cp ./cov_env2.txt ./Pods/XcodeCoverage/env.sh


cat "./utlogfile.txt"|ocunit2junit
ls test-reports


cp ./cov_env2.txt ./Pods/XcodeCoverage/env.sh
mkdir xmlout
./Pods/XcodeCoverage/getcov -x -o xmlout
ls ./xmlout/lcov


cat "./utlogfile.txt"|xcpretty -t -r html --output testresult/testresult.html
ls test
```

七 错误速查
------

这里汇集了在写脚本时的一些错误，方便大家查看

**1 不能在测试工程引用自己的代码**

请参看 二--1 ”配置文件同步“ 解决

**2 在Bamboo上的Pods文件夹，没有拉到iBiu的其他配置信息**

请参看 五--4 ”自定义脚本“的重点 1 来解决

**3 “No coverage data in result bundle”**

请参看 五--4 ”自定义脚本”的重点 2 来解决

**4 使用命令行跑单元测试时，一直提示不能找到模拟器**

\-destination 'platform=iOS Simulator,name=iPhone 8,OS=13.2.2' 改为 -destination 'id=xxxxxxxxxx' 这种格式，id为屏幕提示

**5 Bamboo Shell里提示 “未设置原子执行条件”**

因为Bamboo的Shell对字符拼接，变量的处理有限制，所以一部分shell命令最好放在文件执行

**6 在本地测试时，Pods/XXXXModule的设置项在每次iBiu安装后都会重置**

请注意手动修改，或者直接使用脚本运行

**7 在本地测试时，代码覆盖率只包含了一部分源码文件，不是全部**

请清空 ~/Library/Developer/Xcode/DerivedData 目录再测试一次

**8 在Bamboo上发现有些库拉不下来**

请确保 对应 库给xn\_testdev\_ci开了权限

### 9 覆盖率文件生成不了

请确保XXXTests的版本信息和主工程的XXXXModule\_Example的版本信息一致