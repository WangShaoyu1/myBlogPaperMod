---
author: "王宇"
title: "虚拟人SDK接入到万得触2.0屏端APP架构与代码细节分析"
date: 十月13,2023
description: "十七、前端管理"
tags: ["十七、前端管理"]
ShowReadingTime: "12s"
weight: 563
---
*   1[1\.    概述](#id-虚拟人SDK接入到万得触2.0屏端APP架构与代码细节分析-概述)
*   2[2\. 整体分析项目](#id-虚拟人SDK接入到万得触2.0屏端APP架构与代码细节分析-整体分析项目)
    *   2.1[2.1. 从构建出发](#id-虚拟人SDK接入到万得触2.0屏端APP架构与代码细节分析-从构建出发)
    *   2.2[2.2. 从入口文件出发](#id-虚拟人SDK接入到万得触2.0屏端APP架构与代码细节分析-从入口文件出发)
        *   2.2.1[2.2.1. 分析Activity](#id-虚拟人SDK接入到万得触2.0屏端APP架构与代码细节分析-分析Activity)
        *   2.2.2[2.2.2. 程序入口点与程序入口点活动](#id-虚拟人SDK接入到万得触2.0屏端APP架构与代码细节分析-程序入口点与程序入口点活动)
    *   2.3[2.3. 设计稿适配页面](#id-虚拟人SDK接入到万得触2.0屏端APP架构与代码细节分析-设计稿适配页面)
    *   2.4[2.4. 实现视图绑定](#id-虚拟人SDK接入到万得触2.0屏端APP架构与代码细节分析-实现视图绑定)
        *   2.4.1[2.4.1. viewBinding](#id-虚拟人SDK接入到万得触2.0屏端APP架构与代码细节分析-viewBinding)
        *   2.4.2[2.4.2. Butter Knife](#id-虚拟人SDK接入到万得触2.0屏端APP架构与代码细节分析-ButterKnife)
    *   2.5[2.5. 实现数据绑定](#id-虚拟人SDK接入到万得触2.0屏端APP架构与代码细节分析-实现数据绑定)
    *   2.6[2.6. 实现路由跳转](#id-虚拟人SDK接入到万得触2.0屏端APP架构与代码细节分析-实现路由跳转)
    *   2.7[2.7. 实现数据请求](#id-虚拟人SDK接入到万得触2.0屏端APP架构与代码细节分析-实现数据请求)
    *   2.8[2.8. Fragment生命周期](#id-虚拟人SDK接入到万得触2.0屏端APP架构与代码细节分析-Fragment生命周期)

1\.    概述
=========

        最近几天在查看git项目：[http://gitlab.yingzi.com/yingzi/yxhealth-team/yingzi-android-wonder-kitchen-app.git](http://gitlab.yingzi.com/yingzi/yxhealth-team/yingzi-android-wonder-kitchen-app.git) 上分支：release-avatar上的代码，分析其中的总体架构、技术结构、代码细节等等，目前是从技术的角度看重新掌握一门技术达到用于简单实战程度到底有哪些工作是要做的。之前积累的技术架构思维，怎么应用到不同的技术体系、不同的编程语言上。同时也需要锻炼一种思维：以快速学习掌握一门新知识为目标，怎么锻炼好结构化思维。从一个技术项目落地的基本思路出发，将整个过程分解为几个步骤。

2\. 整体分析项目
==========

**工作指导思路参考：**

*   Android项目符合前端项目的一般性结构
*   JAVA语言与其他语言具有一般性共同点
*   编程思维具有一般性（模块化、低耦合等等）

2.1. 从构建出发
----------

将项目代码切换到Andorid项目视图（默认是project视图），从Gradle Scripts开始查看，Android Studio使用Gradle来自动执行和管理构建流程，其配置文件分为几类：

setting.gradle

gradle全局设置文件，位于根目录，项目级仓库设置，以及告知Gradle在构建时将哪些模块包含在内。

该文件分析：

*   定义根项目名称为：“microwave”
*   定义在进行Gradle构建时候，包含如下20+模块

**setting.gradle**  展开源码

[expand source](#)[?](#)

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

31

32

33

34

35

36

37

38

39

40

41

42

`rootProject.name =` `"microwave"`

`if` `(``1` `== yz_run_module.toInteger()) {`

    `//研发版，大众版`

    `include` `':app'`

    `include` `':consumedev'`

`}`

`if` `(``2` `== yz_run_module.toInteger()) {`

    `//消费版`

    `include` `':consume'`

`}`

`include` `':libwdcservice'`

`include` `':libbase'`

`include` `':libhardwaresdk'`

`// core:`

`include` `':libpython'`

`include` `':libastroboy'`

`include` `':libmamay'`

`include` `':libhardwaresdk'`

`include` `':libicaserviceclient'`

`// common:`

`include` `':libwdcservice'`

`include` `':libbase'`

`include` `':libbehavior'`

`include` `':libwui'`

`include` `':libarchitecture'`

`include` `':libutils'`

`include` `':libthird'`

`include` `':libconfig'`

`include` `':libnet'`

`include` `':libanalyze'`

`include` `':libdata'`

`// dev app`

`include` `':dev:astroboydebug'`

`include` `':dev:mamaydebug'`

`include` `':dev:hardwaresdkdebug'`

`include` `':dev:wdcservicedebug'`

`include` `':libnetbusiness'`

`include` `':avatar'`

`include` `':yzhci'`

顶层build.gradle

位于根目录，定义所有模块都适用的模块依赖项目、仓库地址等，还包括会定义构建脚本需要的仓库地址（在构建过程中才会生效）

该文件分析：

*   定义构建脚本自身需要的依赖项与路径，见buildscript部分。
*   定义所有模块的共享配置，见allprojects部分
*   定义各种任务task（允许自定义构建逻辑，并根据需要执行各种操作）

**build.gradle--global project**  展开源码

[expand source](#)[?](#)

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

31

32

33

34

35

36

37

38

39

40

41

42

43

44

45

46

47

48

49

50

51

52

53

54

55

56

57

58

59

60

61

62

63

64

65

66

67

68

69

70

71

72

73

74

75

76

77

78

79

80

81

82

83

84

85

86

87

88

89

90

91

92

93

94

95

96

97

98

99

100

101

102

103

104

105

106

107

108

109

110

111

112

113

114

115

116

117

118

119

120

121

122

123

124

125

126

127

128

129

130

131

132

133

134

135

136

137

138

139

140

141

142

143

144

145

146

147

148

149

150

151

152

153

154

155

156

157

158

159

160

161

162

163

164

165

166

167

168

169

170

171

172

173

174

175

176

177

178

179

180

181

182

183

184

185

186

187

188

189

190

191

192

193

194

195

196

197

198

199

200

201

202

203

`// Top-level build file where you can add configuration options common to all sub-projects/modules.`

`buildscript {`

    `repositories {`

        `// bonree`

        `maven { url uri(``'./repo'``) }`

        `maven { url` `'[https://gitlab.bonree.com/BonreeSDK_TAPM/Android/raw/master'](https://gitlab.bonree.com/BonreeSDK_TAPM/Android/raw/master')` `}`

        `//版阿里云仓库`

        `maven { url` `'[https://maven.aliyun.com/repository/jcenter'](https://maven.aliyun.com/repository/jcenter')` `}`

        `maven { url` `'[https://maven.aliyun.com/repository/google'](https://maven.aliyun.com/repository/google')` `}`

        `maven { url` `"[https://jitpack.io](https://jitpack.io)"` `}`

        `maven { url` `"[https://chaquo.com/maven](https://chaquo.com/maven)"` `}`

        `maven { url` `"[https://s01.oss.sonatype.org/content/groups/public](https://s01.oss.sonatype.org/content/groups/public)"` `}`

        `google()`

        `mavenCentral()`

        `jcenter()`

    `}`

    `dependencies {`

        `classpath` `'com.google.dagger:hilt-android-gradle-plugin:2.28-alpha'`

        `classpath` `'com.android.tools.build:gradle:3.6.4'`

        `classpath` `"com.chaquo.python:gradle:10.0.1"`

        `classpath` `"com.bonree.agent.android:bonree:$brsdk_version"`

        `// 添加神策分析 android-gradle-plugin2 依赖`

        `classpath` `'com.sensorsdata.analytics.android:android-gradle-plugin2:3.5.3'`

    `}`

`}`

`allprojects {`

    `repositories {`

        `maven { url uri(``'./repo'``) }`

        `maven { url` `'[https://gitlab.bonree.com/BonreeSDK_TAPM/Android/raw/master'](https://gitlab.bonree.com/BonreeSDK_TAPM/Android/raw/master')` `}`

        `//新阿里云仓库`

        `maven { url` `'[https://maven.aliyun.com/nexus/content/groups/public'](https://maven.aliyun.com/nexus/content/groups/public')` `}`

        `maven { url` `'[https://maven.aliyun.com/repository/jcenter'](https://maven.aliyun.com/repository/jcenter')` `}`

        `maven { url` `'[https://maven.aliyun.com/repository/public'](https://maven.aliyun.com/repository/public')` `}`

        `maven { url` `'[https://maven.aliyun.com/repository/google'](https://maven.aliyun.com/repository/google')` `}`

        `maven { url` `'[https://maven.aliyun.com/repository/gradle-plugin'](https://maven.aliyun.com/repository/gradle-plugin')` `}`

        `maven { url` `'[https://maven.aliyun.com/repository/google'](https://maven.aliyun.com/repository/google')` `}`

        `maven {`

            `allowInsecureProtocol = true`

            `url` `"[http://maven.yingzi.com:9091/nexus/repository/snapshots/](http://maven.yingzi.com:9091/nexus/repository/snapshots/)"`

        `}`

        `maven {`

            `allowInsecureProtocol = true`

            `url` `"[http://maven.yingzi.com:9091/nexus/content/groups/public/](http://maven.yingzi.com:9091/nexus/content/groups/public/)"`

        `}`

        `maven {`

            `allowInsecureProtocol = true`

            `url` `"[http://maven.yingzi.com:9091/nexus/repository/thirdparty/](http://maven.yingzi.com:9091/nexus/repository/thirdparty/)"`

        `}`

        `mavenLocal()`

        `maven {`

            `allowInsecureProtocol = true`

            `url` `'[http://maven.aliyun.com/nexus/content/groups/public/'](http://maven.aliyun.com/nexus/content/groups/public/')`

        `}`

        `maven {`

            `allowInsecureProtocol = true`

            `url` `"[http://maven.aliyun.com/nexus/content/repositories/releases](http://maven.aliyun.com/nexus/content/repositories/releases)"`

        `}`

        `gradlePluginPortal()`

        `maven { url` `'[https://jitpack.io](https://jitpack.io)'` `}`

        `google()`

        `mavenCentral()`

        `jcenter()`

    `}`

`}`

`task clean(type: Delete) {`

    `delete rootProject.buildDir`

`}`

`tasks.withType(JavaCompile) {`

    `options.encoding =` `"UTF-8"`

`}`

`//注意：用下面两个task,需要自己创建软链接。`

`//操作实例：sudo ln -s /Library/Java/JavaVirtualMachines/jdk1.8.0_331.jdk/Contents/Home/bin/java /Library/Java/JavaVirtualMachines/java_1.8`

`task _wdcInstallApp {`

    `doFirst {`

        `String cmdDirPath = rootProject.projectDir.getAbsolutePath() +` `'/yingzi'`

        `println``(``'开始编译'``)`

        `CommandExcutor buildExecutor =` `new` `CommandExcutor(rootProject.projectDir.getAbsolutePath(),` `"sh gradlew assembleDebug"``)`

        `buildExecutor.exec()`

        `println``(``'删除apk'``)`

        `CommandExcutor rmExecutor =` `new` `CommandExcutor(cmdDirPath,` `"rm oven_release.apk"``)`

        `rmExecutor.exec()`

        `println``(``'开始签名'``)`

        `CommandExcutor signExecutor =` `new` `CommandExcutor(cmdDirPath,` `"/Library/Java/JavaVirtualMachines/java_1.8 -jar signapk.jar platform.x509.pem platform.pk8 app_nosign.apk oven_release.apk"``)`

        `signExecutor.exec()`

        `println``(``'开始安装'``)`

        `CommandExcutor installExe =` `new` `CommandExcutor(cmdDirPath,` `"adb install oven_release.apk"``)`

        `installExe.exec()`

    `}`

`}`

`//直接安装apk文件，无需再编译签名`

`task _wdcInstallAppDirect {`

    `doFirst {`

        `String cmdDirPath = rootProject.projectDir.getAbsolutePath() +` `'/yingzi'`

        `CommandExcutor installExe =` `new` `CommandExcutor(cmdDirPath,` `"adb install -r -d oven_release.apk"``)`

        `installExe.exec()`

    `}`

`}`

`task _wdcBuildApp {`

    `doFirst {`

        `String cmdDirPath = rootProject.projectDir.getAbsolutePath() +` `'/yingzi'`

        `println``(``'开始签名'``)`

        `CommandExcutor signExecutor =` `new` `CommandExcutor(cmdDirPath,` `"/Library/Java/JavaVirtualMachines/java_1.8 -jar signapk.jar platform.x509.pem platform.pk8 app_nosign.apk oven_release.apk"``)`

        `signExecutor.exec()`

        `println``(``'开始签名'``)`

    `}`

`}`

`task _wdcWindowsBuildApp {`

    `doFirst {`

        `String cmdDirPath = rootProject.projectDir.getAbsolutePath() +` `'/yingzi'`

        `println``(``'开始签名'``)`

        `CommandExcutor signExecutor =` `new` `CommandExcutor(cmdDirPath,` `"D:/Program Files/AdoptOpenJDK/jdk-8.0.282.8-openj9/bin/java.exe -jar signapk.jar platform.x509.pem platform.pk8 app_nosign.apk oven_release.apk"``)`

        `signExecutor.exec()`

        `println``(``'开始签名'``)`

    `}`

`}`

`task _wdcWindowsInstallApp {`

    `doFirst {`

        `String cmdDirPath = rootProject.projectDir.getAbsolutePath() +` `'/yingzi'`

        `println``(``'开始签名'``)`

        `CommandExcutor signExecutor =` `new` `CommandExcutor(cmdDirPath,` `"D:/Program Files/AdoptOpenJDK/jdk-8.0.282.8-openj9/bin/java.exe -jar signapk.jar platform.x509.pem platform.pk8 app_nosign.apk oven_release.apk"``)`

        `signExecutor.exec()`

        `println``(``'开始安装'``)`

        `CommandExcutor installExe =` `new` `CommandExcutor(cmdDirPath,` `"adb install oven_release.apk"``)`

        `installExe.exec()`

    `}`

`}`

`task _wdcWinBuildApp {`

    `doFirst {`

        `String cmdDirPath = rootProject.projectDir.getAbsolutePath() +` `'/yingzi'`

        `println``(``'开始签名'``)`

        `CommandExcutor signExecutor =` `new` `CommandExcutor(cmdDirPath,` `"C:/Program Files/Java/jdk1.8.0_144/bin/java.exe -jar signapk.jar platform.x509.pem platform.pk8 app_nosign.apk oven_release.apk"``)`

        `signExecutor.exec()`

        `println``(``'结束安装'``)`

    `}`

`}`

`class` `CommandExcutor {`

    `String command`

    `String cmdDir`

    `CommandExcutor(String cmdDirPath, String commandLine) {`

        `cmdDir = cmdDirPath;`

        `command = commandLine;`

    `}`

    `def` `exec() {`

        `Process process = Runtime.getRuntime().exec(command,` `null``,` `new` `File(cmdDir))`

        `InputStream is = process.getInputStream()`

        `InputStreamReader isReader =` `new` `InputStreamReader(is,` `"utf-8"``)`

        `BufferedReader bufferedReader =` `new` `BufferedReader(isReader)`

        `String line =` `null`

        `while` `((line = bufferedReader.``readLine``()) !=` `null``) {`

            `println``(line)`

        `}`

        `InputStream errorStream = process.getErrorStream()`

        `String result =` `null`

        `ByteArrayOutputStream baos =` `new` `ByteArrayOutputStream()`

        `int` `ch = -``1``;`

        `byte``[] buffer =` `new` `byte``[``1024` `*` `4``]`

        `try` `{`

            `ch = errorStream.read(buffer)`

            `while` `(ch != -``1``) {`

                `baos.``write``(buffer,` `0``, ch)`

                `ch = errorStream.read(buffer)`

            `}`

            `baos.flush()`

            `result = baos.toString(``"utf-8"``)`

        `}` `catch` `(UnsupportedEncodingException e) {`

            `e.printStackTrace();`

        `}` `catch` `(IOException e) {`

            `throw` `e`

        `}` `finally` `{`

            `baos.close()`

        `}`

        `isReader.close()`

        `is.close()`

        `bufferedReader.close()`

        `int` `state = process.waitFor()`

        `if` `(state ==` `0``) {`

            `println``(``"${command} exec sucess"``)`

        `}` `else` `{`

            `println``(``"${command} exec failed"``)`

        `}`

        `if` `(result !=` `null` `&& !``""``.equalsIgnoreCase(result)) {`

            `println``(``'Error Content: '` `+ result)`

        `}`

    `}`

`}`

模块build.gradle

位于目录project/module目录下，定义每个模块的Gradle设置。定义插件plugins、依赖项等等

该文件分析：

*   应用插件plugin，见apply plugin语法，或者直接用plugins 字段
*   定义和android相关，见android字段
*   定义依赖的库、包，见dependencies字段

**build.gradle--module**  展开源码

[expand source](#)[?](#)

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

31

32

33

34

35

36

37

38

39

40

41

42

43

44

45

46

47

48

49

50

51

52

53

54

55

56

57

58

59

60

61

62

63

64

65

66

67

68

69

70

71

72

73

74

75

76

77

78

79

80

81

82

83

84

85

86

87

88

89

90

91

92

93

94

95

96

97

98

99

100

101

102

103

104

105

106

107

108

109

110

111

112

113

114

115

116

117

118

119

120

121

122

123

124

125

126

127

128

129

130

131

132

133

134

135

136

137

138

139

140

141

142

143

144

145

146

147

148

149

150

151

152

153

154

155

156

157

158

159

160

161

162

163

164

165

166

167

168

169

170

171

`apply plugin:` `'com.sensorsdata.analytics.android'`

`if` `(``2` `== yz_run_module.toInteger()) {`

    `apply plugin:` `'com.android.application'`

    `apply plugin:` `'dagger.hilt.android.plugin'`

    `apply plugin:` `'bonree'`

    `apply plugin:` `'com.sensorsdata.analytics.android'`

`}` `else` `{`

    `apply plugin:` `'com.android.library'`

    `apply plugin:` `'dagger.hilt.android.plugin'`

    `apply plugin:` `'bonree'`

    `apply plugin:` `'com.sensorsdata.analytics.android'`

`}`

`android {`

    `compileSdkVersion compile_sdk_version.toInteger()`

    `defaultConfig {`

        `if` `(``2` `== yz_run_module.toInteger()) {`

            `applicationId` `"com.yingzi.microwoven"`

        `}`

        `minSdkVersion min_sdk_version.toInteger()`

        `targetSdkVersion target_sdt_version.toInteger()`

        `versionCode` `53`

        `versionName` `"2.2.6"`

        `testInstrumentationRunner` `"androidx.test.runner.AndroidJUnitRunner"`

        `consumerProguardFiles` `"consumer-rules.pro"`

        `javaCompileOptions {`

            `annotationProcessorOptions {`

                `arguments += [moduleName: project.getName()]`

            `}`

        `}`

        `ndk {`

            `abiFilters` `"arm64-v8a"` `//, "arm64-v8a","x86"`

        `}`

    `}`

    `sourceSets {`

        `main {`

            `if` `(``2` `== yz_run_module.toInteger()) {`

                `manifest.srcFile` `'src/main/AndroidManifest.xml'`

            `}` `else` `{`

                `manifest.srcFile` `'src/main/manifestlib/AndroidManifest.xml'`

            `}`

        `}`

    `}`

    `buildTypes {`

        `/*debug {`

            `minifyEnabled false`

            `proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'`

        `}*/`

        `release {`

            `minifyEnabled false`

            `proguardFiles getDefaultProguardFile(``'proguard-android-optimize.txt'``),` `'proguard-rules.pro'`

        `}`

    `}`

    `compileOptions {`

        `sourceCompatibility JavaVersion.VERSION_1_8`

        `targetCompatibility JavaVersion.VERSION_1_8`

    `}`

    `viewBinding {`

        `enabled = true`

    `}`

    `tasks.whenTaskAdded { task ->`

        `if` `(task.name.startsWith(``"assemble"``)) {`

            `task.doLast {`

`//                android.applicationVariants.all { variant ->`

                `copy() {`

                    `CopySpec copySpec ->`

                        `println``(``">>>>>>>>>> 开始拷贝apk >>>>>>>>>>"``)`

                        `println``(task.name)`

                        `if` `(isReleaseBuildType()) {`

                            `println``(``">>>>>>>>>> from release >>>>>>>>>>"``)`

                            `from file(``"build/outputs/apk/release/consume-release-unsigned.apk"``)`

                        `}` `else` `{`

                            `println``(``">>>>>>>>>> from debug >>>>>>>>>>"``)`

                            `from file(``"build/outputs/apk/debug/consume-debug.apk"``)`

                        `}`

                        `into` `"${rootDir}/yingzi"`

                        `rename {`

                            `String srcFileName ->` `"app_nosign.apk"`

                        `}`

                        `println``(``">>>>>>>>>> app_nosign.apk已经放到yingzi下 >>>>>>>>>>"``)`

`//                    }`

                `}`

            `}`

        `}`

    `}`

`}`

`boolean` `isReleaseBuildType() {`

    `for (String s : gradle.startParameter.taskNames) {`

        `if` `(s.``contains``(``"Release"``) | s.``contains``(``"release"``)) {`

            `return` `true`

        `}`

    `}`

    `return` `false`

`}`

`dependencies {`

    `api fileTree(dir:` `'libs'``, include: [``'*.jar'``])`

    `implementation project(``':libwdcservice'``)`

    `implementation project(``':libbase'``)`

    `implementation project(``':libnet'``)`

`//    implementation project(':bizhci')`

    `implementation project(``':libwui'``)`

    `implementation project(``':libanalyze'``)`

    `implementation project(``':libbehavior'``)`

`//    implementation project(':libhardwarediy')`

    `api` `'com.google.code.gson:gson:2.9.0'`

    `implementation` `'androidx.appcompat:appcompat:1.6.1'`

    `implementation` `'com.google.android.material:material:1.4.0'`

    `implementation` `'androidx.constraintlayout:constraintlayout:2.1.4'`

    `configurations {`

        `all*.exclude group:` `'com.google.code.gson'`

    `}`

    `implementation project(``':avatar'``)`

    `implementation project(``':yzhci'``)`

    `def` `camerax_version =` `"1.1.0-beta02"`

    `implementation` `"androidx.camera:camera-core:${camerax_version}"`

    `implementation` `"androidx.camera:camera-camera2:${camerax_version}"`

    `implementation` `"androidx.camera:camera-lifecycle:${camerax_version}"`

    `implementation` `"androidx.camera:camera-view:${camerax_version}"`

    `//dagger 开始`

    `implementation` `"com.google.dagger:hilt-android:2.28-alpha"`

    `annotationProcessor` `"com.google.dagger:hilt-android-compiler:2.28-alpha"`

    `implementation` `'androidx.hilt:hilt-lifecycle-viewmodel:1.0.0-alpha02'`

    `annotationProcessor` `'androidx.hilt:hilt-compiler:1.0.0-alpha02'`

    `// 用于 instrumentation 测试`

    `androidTestImplementation` `'com.google.dagger:hilt-android-testing:2.28-alpha'`

    `androidTestAnnotationProcessor` `'com.google.dagger:hilt-android-compiler:2.28-alpha'`

    `// 用于本地的单元测试`

    `testImplementation` `'com.google.dagger:hilt-android-testing:2.28-alpha'`

    `testAnnotationProcessor` `'com.google.dagger:hilt-android-compiler:2.28-alpha'`

    `//dagger 结束`

    `implementation` `'com.github.CymChad:BaseRecyclerViewAdapterHelper:3.0.7'`

    `annotationProcessor` `"com.alibaba:arouter-compiler:${arouter_compiler_version}"`

    `implementation(``"io.github.thanosfisherman.wifiutils:wifiutils:1.6.6"``)`

    `// bonree`

    `implementation files(``'libs/com.bonree.sdk.jar'``)`

    `implementation` `'com.github.CarGuo.GSYVideoPlayer:gsyVideoPlayer-java:v8.3.4-release-jitpack'`

    `//是否需要ExoPlayer模式`

    `implementation` `'com.github.CarGuo.GSYVideoPlayer:GSYVideoPlayer-exo2:v8.3.4-release-jitpack'`

    `//是否需要AliPlayer模式`

    `implementation` `'com.github.CarGuo.GSYVideoPlayer:GSYVideoPlayer-aliplay:8.3.4-release-jitpack'`

    `//更多ijk的编码支持`

    `implementation` `'com.github.CarGuo.GSYVideoPlayer:gsyVideoPlayer-ex_so:v8.3.4-release-jitpack'`

    `implementation` `'me.gujun.android.taggroup:library:1.4@aar'`

    `implementation` `'com.github.KuangGang:RoundCorners:2.0.0'`

    `implementation` `'com.lzy.net:okgo:3.0.4'`

    `implementation` `'me.relex:circleindicator:2.1.6'`

    `implementation` `'com.kyleduo.switchbutton:library:2.1.0'`

    `// 添加 Sensors Analytics SDK 依赖`

    `implementation` `'com.sensorsdata.analytics.android:SensorsAnalyticsSDK:6.6.7'`

`}`

`gradle.properties`

gradle全局属性文件，位于根目录，定义一些全局变量、全局属性，打包的时候使用。类似于Web前端项目中使用的cross-env【一款Node.js的跨平台环境变量配置工具】

2.2. 从入口文件出发
------------

        在Android Studio控制面板上，配置“Edit Configuration”，来创建和管理多个配置，以满足不同的运行和调试需求，打包一个生产的APK包目前配置的是“microwave.consume.main”，顺着这个配置往下走，模块根目录下有一个文件“AndroidManifest.xml”【约定俗称，该清单文件会向 Android 构建工具、Android 操作系统和 Google Play 描述应用的基本信息】，其声明了所有组件、用户所需权限、软硬件功能等。具体分析如下：

**AndroidManifest.xml**  展开源码

[expand source](#)[?](#)

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

31

32

33

34

35

36

37

38

39

40

41

42

43

44

45

46

47

48

49

50

51

52

53

54

55

56

57

58

59

60

61

62

63

64

65

66

67

68

69

70

71

72

73

74

75

76

77

78

79

80

81

82

83

84

85

86

87

88

89

90

91

92

93

94

95

96

97

98

99

100

101

102

103

104

105

106

107

108

109

110

111

112

113

114

115

116

117

118

119

120

121

122

123

124

125

126

127

128

129

130

131

132

133

134

135

136

137

138

139

140

141

142

143

144

145

146

147

148

149

150

151

152

153

154

155

156

157

158

159

160

161

162

163

164

165

166

167

168

169

170

171

172

173

174

175

176

177

178

179

180

181

182

183

184

185

186

187

188

189

190

191

192

193

194

195

196

197

198

199

200

201

202

203

204

205

206

207

208

209

210

211

212

213

214

215

216

217

218

219

220

221

222

223

224

225

226

227

228

229

230

231

232

233

234

235

236

237

238

239

`<?``xml` `version``=``"1.0"` `encoding``=``"utf-8"``?>`

`<``manifest` `xmlns:android``=``"[http://schemas.android.com/apk/res/android](http://schemas.android.com/apk/res/android)"`

    `xmlns:tools``=``"[http://schemas.android.com/tools](http://schemas.android.com/tools)"`

    `package``=``"com.yingzi.consume"`

    `android:sharedUserId``=``"android.uid.system"`

    `tools:ignore``=``"ProtectedPermissions"``>`

    `<``uses-permission` `android:name``=``"android.permission.DEVICE_POWER"``/>`

    `<``uses-permission` `android:name``=``"android.permission.SET_TIME"` `/>`

    `<``uses-permission` `android:name``=``"android.permission.SET_TIME_ZONE"` `/>`

    `<``uses-permission` `android:name``=``"android.permission.WRITE_EXTERNAL_STORAGE"` `/>`

    `<``uses-permission` `android:name``=``"android.permission.READ_EXTERNAL_STORAGE"` `/>`

    `<``uses-permission` `android:name``=``"android.permission.INJECT_EVENTS"` `/>`

    `<``uses-permission` `android:name``=``"android.permission.KILL_BACKGROUND_PROCESSES"` `/>`

    `<``uses-permission` `android:name``=``"android.permission.CHANGE_NETWORK_STATE"` `/>`

    `<``uses-permission` `android:name``=``"android.permission.WRITE_SETTINGS"` `/>`

    `<``uses-permission` `android:name``=``"android.permission.CHANGE_CONFIGURATION"` `/>`

    `<``uses-feature` `android:name``=``"android.hardware.camera.any"` `/>`

    `<``uses-permission` `android:name``=``"android.permission.ACCESS_COARSE_LOCATION"` `/>`

    `<``uses-permission` `android:name``=``"android.permission.ACCESS_FINE_LOCATION"` `/>`

    `<``uses-permission` `android:name``=``"android.permission.ACCESS_BACKGROUND_LOCATION"` `/>`

    `<``uses-permission` `android:name``=``"android.permission.BLUETOOTH_CONNECT"` `/>`

    `<``uses-permission` `android:name``=``"android.permission.INTERNET"` `/>`

    `<``uses-permission` `android:name``=``"android.permission.ACCESS_WIFI_STATE"` `/>`

    `<``uses-permission` `android:name``=``"android.permission.READ_PHONE_STATE"` `/>`

    `<``uses-permission` `android:name``=``"android.permission.ACCESS_NETWORK_STATE"` `/>`

    `<``uses-permission` `android:name``=``"android.permission.REBOOT"` `/>`

    `<``uses-permission`

        `android:name``=``"android.permission.MOUNT_UNMOUNT_FILESYSTEMS"`

        `tools:ignore``=``"ProtectedPermissions"` `/>`

    `<``uses-permission` `android:name``=``"android.permission.CAMERA"` `/>`

    `<``uses-permission` `android:name``=``"android.permission.BLUETOOTH"` `/>`

    `<``uses-permission` `android:name``=``"android.permission.BLUETOOTH_ADMIN"` `/>`

    `<``uses-permission` `android:name``=``"android.permission.CHANGE_WIFI_STATE"` `/>`

    `<``uses-permission` `android:name``=``"android.permission.SYSTEM_ALERT_WINDOW"` `/>` `<!-- 无障碍服务相关 -->`

    `<``uses-permission` `android:name``=``"android.permission.SYSTEM_OVERLAY_WINDOW"` `/>`

    `<``uses-permission` `android:name``=``"android.permission.BIND_ACCESSIBILITY_SERVICE"` `/>`

    `<``uses-permission` `android:name``=``"android.permission.WRITE_SETTINGS"` `/>`

    `<``uses-permission` `android:name``=``"android.permission.WRITE_SECURE_SETTINGS"` `/>`

    `<``application`

        `android:name``=``".ConsumeAppStart"`

        `android:allowBackup``=``"true"`

        `android:extractNativeLibs``=``"true"`

        `android:hardwareAccelerated``=``"true"`

        `android:icon``=``"@mipmap/ic_launcher"`

        `android:label``=``"@string/app_name"`

        `android:largeHeap``=``"true"`

        `android:networkSecurityConfig``=``"@xml/network_security_config"`

        `android:requestLegacyExternalStorage``=``"true"`

        `android:roundIcon``=``"@mipmap/ic_launcher_round"`

        `android:supportsRtl``=``"true"`

        `android:theme``=``"@style/Theme.MicroOven"``>`

        `<``activity`

            `android:name``=``".ui.activity.ConsumeMainActivity"`

            `android:configChanges``=``"keyboard|keyboardHidden|orientation|screenSize"`

            `android:exported``=``"true"`

            `android:screenOrientation``=``"portrait"`

            `android:theme``=``"@style/LaunchTheme"`

            `tools:ignore``=``"LockedOrientationActivity"``>`

            `<``intent-filter``>`

                `<``action` `android:name``=``"android.intent.action.MAIN"` `/>`

                `<``category` `android:name``=``"android.intent.category.LAUNCHER"` `/>`

                `<``category` `android:name``=``"android.intent.category.HOME"` `/>`

                `<``category` `android:name``=``"android.intent.category.DEFAULT"` `/>`

            `</``intent-filter``>`

        `</``activity``>`

        `<``activity` `android:name``=``".ui.activity.nfc.ConsumeNFCKnowActivity"` `/>`

        `<``activity` `android:name``=``".ui.activity.books.BookSearchActivity"` `/>`

        `<``activity` `android:name``=``".ui.activity.diy.ConsumeAddDiyActivity"` `/>`

        `<``activity` `android:name``=``".ui.activity.setttings.ConsumeVoiceActivity"` `/>`

        `<``activity` `android:name``=``".ui.activity.setttings.ConsumeBrightnessActivity"` `/>`

        `<``activity` `android:name``=``".ui.activity.setttings.WifiInformationActivity"` `/>`

        `<``activity` `android:name``=``".ui.activity.nfc.ConsumeNFCInfoActivity"` `/>`

        `<``activity`

            `android:name``=``"com.yingzi.consume.ui.activity.ConsumeCookInfoActivity"`

            `android:theme``=``"@style/ConsumeAppTheme"` `/>`

        `<``activity`

            `android:name``=``"com.yingzi.consume.ui.activity.setttings.TimeZoneActivity"`

            `android:theme``=``"@style/ConsumeAppTheme"` `/>`

        `<``activity`

            `android:name``=``"com.yingzi.consume.ui.activity.GuideActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``"com.yingzi.consume.ui.activity.collect.ConsumeCollectActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.help.HelpActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.help.LinkHelpActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.setttings.LanguageActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.scan.ConsumeReceiveMoneyQrcodeActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.help.BindHelpActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.setttings.ConsumeSettingsActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.setttings.ConsumeWifiActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.setttings.ConsumeReportActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.test.ConsumeTestingActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.setttings.ConsumeUsageActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.books.CookBookActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.books.ConsumeCookBookCategoryActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.setttings.ConsumeDeviceInfoActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.onekeycook.CookWayActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.onekeycook.IntelligentCookingActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.books.CollectCookBookActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.books.CookRecordListActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.books.CareCookBookListActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``"com.yingzi.consume.ui.activity.scan.ConsumeScaninfoActivity"`

            `android:launchMode``=``"singleTask"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``"com.yingzi.consume.ui.activity.setttings.update.ConsumeCheckUpdateActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``"com.yingzi.consume.ui.activity.setttings.update.ConsumeUpdateActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``"com.yingzi.consume.ui.activity.setttings.update.ConsumeVersionUpdateInfoActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``"com.yingzi.consume.ui.activity.skills.SkillsActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``"com.yingzi.consume.ui.activity.skills.SkillDetailActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.ConsumeCookingV2Activity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.ConsumeCookingV3Activity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.ConsumeCookingV4Activity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``"com.yingzi.consume.ui.activity.mine.ConsumeMineActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``"com.yingzi.consume.ui.activity.mine.ConsumeMyCookSchemeActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.selfmodel.ConsumeSelfDefineModelActivity"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity` `android:name``=``".ui.activity.setttings.WifiSettingActivity"` `/>`

        `<``activity` `android:name``=``".ui.activity.care.CareCookingActivity"` `/>`

        `<``activity` `android:name``=``".ui.activity.care.CareScanInfoActivity"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.cookmenu.CookMenuDetailActivity"`

            `android:windowSoftInputMode``=``"stateHidden|stateUnchanged"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.books.cookingrecord.CookRecordV2Activity"`

            `android:windowSoftInputMode``=``"stateHidden|stateUnchanged"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.mine.MyCookScheme2Activity"`

            `android:windowSoftInputMode``=``"stateHidden|stateUnchanged"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.avatar.search.shop.SearchActivity"`

            `android:windowSoftInputMode``=``"stateHidden|stateUnchanged"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.avatar.search.recipe.SearchRecipeActivity"`

            `android:windowSoftInputMode``=``"stateHidden|stateUnchanged"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``activity`

            `android:name``=``".ui.activity.avatar.search.recomment.SearchRecommentActivity"`

            `android:windowSoftInputMode``=``"stateHidden|stateUnchanged"`

            `android:screenOrientation``=``"portrait"` `/>`

        `<``service` `android:name``=``"com.yingzi.wdcservice.timer.SyncDataTimer"` `/>`

        `<``service` `android:name``=``"com.yingzi.wdcservice.timer.CookingRecordCheckTimer"` `/>`

        `<``service` `android:name``=``"com.yingzi.wdcservice.timer.CookingInfoCleanTimer"` `/>`

        `<``service` `android:name``=``"com.yingzi.wdcservice.timer.SyncDataCleanTimer"` `/>`

        `<``service` `android:name``=``"com.yingzi.wdcservice.timer.CookingRecordTimeOutCheckTimer"` `/>`

        `<``meta-data`

            `android:name``=``"design_width_in_dp"`

            `android:value``=``"600"` `/>`

        `<``meta-data`

            `android:name``=``"design_height_in_dp"`

            `android:value``=``"1024"` `/>` `<!-- 定位需要的服务 适配Android Q需要加上android:foregroundServiceType="location" -->`

        `<``service`

            `android:name``=``"com.amap.api.location.APSService"`

            `android:foregroundServiceType``=``"location"` `/>`

        `<``provider`

            `android:name``=``"com.yingzi.avatar.provider.AvatarProvider"`

            `android:authorities``=``"${applicationId}.avatar"`

            `android:exported``=``"false"`

            `/>`

        `<!-- 配置Bugly调试模式（true或者false）-->`

        `<``meta-data`

            `android:name``=``"BUGLY_ENABLE_DEBUG"`

            `android:value``=``"true"` `/>`

    `</``application``>`

`</``manifest``>`

在这份清单文件中，可以获取到如下信息：

*   该模块名称为"com.yingzi.consume"
*   应用请求了29个权限【备注：在Android6.0之后，用户可以在运行时同意或者拒绝某些应用权限】
*   应用程序的入口点为 类ConsumeAppStart【应用进程启动后，此类会在应用的所有组件之前进行实例化，可选，没有的话Android 会使用 `Application` 基类的实例】
*   共有51个Activity应用可视化组件
*   共有6个Service组件
*   共有3个meta-data【目前没看到其使用场景】
*   共有1个content provider 组件

其中每一个组件、入口点，背后都是一长串的结构，相互之间相互独立又相互联系，通过各种约定俗成的接口、格式、固有机制来实现业务需求，可以说各种开发方式方法都是相通的，最主要的不同点在于要实现的业务逻辑不一样，以及可能应用到的库、包以及用法不一样，不管怎么样，其都包含在Android开发体系中，这是最基本的技术框架。

### 2.2.1. 分析Activity

        应用程序的入口点活动Activity（一般情况，一个应用程序只有一个主要入口点活动—启动应用程序首先打开的活动），从上述的AndroidManifest.xml文件中看到：

[?](#)

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

`<``activity`

    `android:name``=``".ui.activity.ConsumeMainActivity"`

    `android:configChanges``=``"keyboard|keyboardHidden|orientation|screenSize"`

    `android:exported``=``"true"`

    `android:screenOrientation``=``"portrait"`

    `android:theme``=``"@style/LaunchTheme"`

    `tools:ignore``=``"LockedOrientationActivity"``>`

    `<``intent-filter``>`

        `<``action` `android:name``=``"android.intent.action.MAIN"` `/>`

        `<``category` `android:name``=``"android.intent.category.LAUNCHER"` `/>`

        `<``category` `android:name``=``"android.intent.category.HOME"` `/>`

        `<``category` `android:name``=``"android.intent.category.DEFAULT"` `/>`

    `</``intent-filter``>`

`</``activity``>`

该可视化界面组件是主程序入口，用户点击应用图标启动应用程序时候，就会打开该活动。通过如下标记体现：

[?](#)

1

2

3

`<``action` `android:name``=``"android.intent.action.MAIN"` `/>`

`<``category` `android:name``=``"android.intent.category.LAUNCHER"` `/>`

`<``category` `android:name``=``"android.intent.category.HOME"` `/>`

### 2.2.2. 程序入口点与程序入口点活动

        两者之间的区别，可以理解为一个是后台程序入口（程序的），一个是界面入口（U层面），前者更早执行。

**ConsumeAppStart.java**  展开源码

[expand source](#)[?](#)

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

31

32

33

34

35

36

37

38

39

40

41

42

43

44

45

46

47

48

49

50

51

52

53

54

55

56

57

58

59

`package` `com.yingzi.consume;`

`import` `android.app.Application;`

`import` `com.example.yzbase.base.BaseApp;`

`import` `com.example.yzbase.utils.WakeLockUtil;`

`import` `com.example.yzbase.utils.YZLocationUtil;`

`import` `com.lzy.okgo.OkGo;`

`import` `com.yingzi.consume.analyze.emas.EmasHelper;`

`import` `com.yingzi.consume.analyze.sensorsdata.SensorHelper;`

`import` `com.yingzi.consume.ui.bean.GlobalInfo;`

`import` `com.yingzi.consume.analyze.bonree.BonreeHelper;`

`import` `com.yingzi.microwave.analyze.bugly.BuglyHelper;`

`import` `com.yingzi.wdcservice.MicrowaveContextInitializer;`

`import` `com.yingzi.wdcservice.common.utils.WdcDeviceUtil;`

`import` `com.yingzi.yzhci.aiui.YZAiui;`

`import` `javax.inject.Inject;`

`import` `dagger.hilt.android.HiltAndroidApp;`

`/**`

 `* @Author: xxx`

 `* @Date: 2022.4.15`

 `* @Last Modified by: xxx`

 `* @Last Modified time: 2022.4.15`

 `* 消费端应用 入口application`

 `*/`

`@HiltAndroidApp`

`public` `class` `ConsumeAppStart` `extends` `BaseApp {`

    `@Inject`

    `MicrowaveContextInitializer mHardWareSdk;`

    `private` `static` `GlobalInfo globalInfo;`

    `@Override`

    `public` `void` `initModuleApp(Application application) {`

        `//1.进入万得厨初始化对应配置信息`

        `WdcDeviceUtil.initConsumeDeviceConfig(``this``);`

        `//2.因为需要依赖注入，放在此处初始化`

        `mHardWareSdk.initHardwareSdk();`

        `//3.aiui初始化`

        `YZAiui.init(``this``);`

        `//4.高德定位初始化`

        `YZLocationUtil.getInstance().initLocation(``this``);`

        `OkGo.getInstance().init(application);`

        `BuglyHelper.instance.init(``this``,``false``);`

        `BonreeHelper.instance.init(``this``);`

        `SensorHelper.instance.init(``this``);`

        `EmasHelper.instance.init(``this``);`

        `WakeLockUtil.getInstance().init();`

    `}`

    `public` `static` `GlobalInfo getGloablInfo() {`

        `if` `(globalInfo ==` `null``) {`

            `globalInfo =` `new` `GlobalInfo();`

        `}`

        `return` `globalInfo;`

    `}`

`}`

ConsumeAppStart表达的意思是：

这段代码是一个应用程序的入口类，它初始化了各种模块和库，并提供了一个静态方法用于获取全局信息对象。

这段代码是一个名为 ConsumeAppStart 的 Java 类，位于 com.yingzi.consume 包中。它继承了 BaseApp 类，并使用 @HiltAndroidApp 注解，表示它是应用程序的入口点。

**具体分析如下：**

*   ConsumeAppStart 类在其 initModuleApp 方法中初始化了各种模块和库，该方法在应用程序初始化时被调用。
*   它使用 @Inject 注解注入了一个 MicrowaveContextInitializer 实例。
*   WdcDeviceUtil.initConsumeDeviceConfig(this) 方法初始化了应用程序的相应配置信息。
*   mHardWareSdk.initHardwareSdk() 方法初始化了硬件 SDK。
*   YZAiui.init(this) 方法初始化了 AIUI。
*   YZLocationUtil.getInstance().initLocation(this) 方法初始化了高德定位。
*   OkGo.getInstance().init(application) 方法初始化了 OkGo 网络库。
*   BuglyHelper.instance.init(this,false) 方法初始化了 Bugly 异常上报。
*   BonreeHelper.instance.init(this) 方法初始化了 Bonree 监控。
*   SensorHelper.instance.init(this) 方法初始化了 SensorsData 数据分析。
*   EmasHelper.instance.init(this) 方法初始化了 EMAS 性能监控。
*   WakeLockUtil.getInstance().init() 方法初始化了 WakeLockUtil。
*   getGloablInfo 方法返回一个 GlobalInfo 对象，如果该对象为空，则创建一个新的 GlobalInfo 对象并返回。

**ConsumeMainActivity**  展开源码

[expand source](#)[?](#)

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

31

32

33

34

35

36

37

38

39

40

41

42

43

44

45

46

47

48

49

50

51

52

53

54

55

56

57

58

59

60

61

62

63

64

65

66

67

68

69

70

71

72

73

74

75

76

77

78

79

80

81

82

83

84

85

86

87

88

89

90

91

92

93

94

95

96

97

98

99

100

101

102

103

104

105

106

107

108

109

110

111

112

113

114

115

116

117

118

119

120

121

122

123

124

125

126

127

128

129

130

131

132

133

134

135

136

137

138

139

140

141

142

143

144

145

146

147

148

149

150

151

152

153

154

155

156

157

158

159

160

161

162

163

164

165

166

167

168

169

170

171

172

173

174

175

176

177

178

179

180

181

182

183

184

185

186

187

188

189

190

191

192

193

194

195

196

197

198

199

200

201

202

203

204

205

206

207

208

209

210

211

212

213

214

215

216

217

218

219

220

221

222

223

224

225

226

227

228

229

230

231

232

233

234

235

236

237

238

239

240

241

242

243

244

245

246

247

248

249

250

251

252

253

254

255

256

257

258

259

260

261

262

263

264

265

266

267

268

269

270

271

272

273

274

275

276

277

278

279

280

281

282

283

284

285

286

287

288

289

290

291

292

293

294

295

296

297

298

299

300

301

302

303

304

305

306

307

308

309

310

311

312

313

314

315

316

317

318

319

320

321

322

323

324

325

326

327

328

329

330

331

332

333

334

335

336

337

338

339

340

341

342

343

344

345

346

347

348

349

350

351

352

353

354

355

356

357

358

359

360

361

362

363

364

365

366

367

368

369

370

371

372

373

374

375

376

377

378

379

380

381

382

383

384

385

386

387

388

389

390

391

392

393

394

395

396

397

398

399

400

401

402

403

404

405

406

407

408

409

410

411

412

413

414

415

416

417

418

419

420

421

422

423

424

425

426

427

428

429

430

431

432

433

434

435

436

437

438

439

440

441

442

443

444

445

446

447

448

449

450

451

452

453

454

455

456

457

458

459

460

461

462

463

464

465

466

467

468

469

470

471

472

473

474

475

476

477

478

479

480

481

482

483

484

485

486

487

488

489

490

491

492

493

494

495

496

497

498

499

500

501

502

503

504

505

506

507

508

509

510

511

512

513

514

515

516

517

518

519

520

521

522

523

524

525

526

527

528

529

530

531

532

533

534

535

536

537

538

539

540

541

542

543

544

545

546

547

548

549

550

551

552

553

554

555

556

557

558

559

560

561

562

563

564

565

566

567

568

569

570

571

572

573

574

575

576

577

578

579

580

581

582

583

584

585

586

587

588

589

590

591

592

593

594

595

596

597

598

599

600

601

602

603

604

605

606

607

608

609

610

611

612

613

614

615

616

617

618

619

620

621

622

623

624

625

626

627

628

629

630

631

632

633

634

635

636

637

638

639

640

641

642

643

644

645

646

647

648

649

650

651

652

653

654

655

656

657

658

659

660

661

662

663

664

665

666

667

668

669

670

671

672

673

674

675

676

677

678

679

680

681

682

683

684

685

686

687

688

689

690

691

692

693

694

695

696

697

698

699

700

701

702

703

704

705

706

707

708

709

710

711

712

713

714

715

716

717

718

719

720

721

722

723

724

725

726

727

728

729

730

731

732

733

734

735

736

737

738

739

740

741

742

743

744

745

746

747

748

749

750

751

752

753

754

755

756

757

758

759

760

761

762

763

764

765

766

767

768

769

770

771

772

773

774

775

776

777

778

779

780

781

782

783

784

785

786

787

788

789

790

791

792

793

794

795

796

797

798

799

800

801

802

803

804

805

806

807

808

809

810

811

812

813

814

815

816

817

818

819

820

821

822

823

824

825

826

827

828

829

830

831

832

833

834

835

836

837

838

839

840

841

842

843

844

845

846

847

848

849

850

851

852

853

854

855

856

857

858

859

860

861

862

863

864

865

866

867

868

869

870

871

872

873

874

875

876

877

878

879

880

881

882

883

884

885

886

887

888

889

890

891

892

893

894

895

896

897

898

899

900

901

902

903

904

905

906

907

908

909

910

911

912

913

914

915

916

917

918

919

920

921

922

923

`package` `com.yingzi.consume.ui.activity;`

`import` `static` `com.yingzi.wdcservice.common.constants.CommEvent.CARE_MODE_CHANGE_EVENT;`

`import` `static` `com.yingzi.wdcservice.common.constants.CommEvent.COOKING_EVENT;`

`import` `static` `com.yingzi.wdcservice.common.constants.CommEvent.COOKING_STOP_EVENT;`

`import` `static` `com.yingzi.wdcservice.common.constants.CommEvent.DEVICE_REGISTER_SUCCESS_EVENT;`

`import` `static` `com.yingzi.wdcservice.common.constants.CommEvent.DOOR_CLOSED;`

`import` `static` `com.yingzi.wdcservice.common.constants.CommEvent.DOOR_OPEN;`

`import` `static` `com.yingzi.wdcservice.common.constants.CommEvent.ERROR_REPORT_EVENT;`

`import` `static` `com.yingzi.wdcservice.common.constants.CommEvent.FIRMWARE_UPGRADE_CONFIRM_EVENT;`

`import` `static` `com.yingzi.wdcservice.common.constants.CommEvent.HARD_SDK_INIT_SUCC;`

`import` `static` `com.yingzi.wdcservice.common.constants.CommEvent.INVALID_ORDER;`

`import` `static` `com.yingzi.wdcservice.common.constants.CommEvent.MICROWAVE_ADMIN_BIND_EVENT;`

`import` `static` `com.yingzi.wdcservice.common.constants.CommEvent.MQTT_CONNECT;`

`import` `static` `com.yingzi.wdcservice.common.constants.CommEvent.MQTT_LOCKED;`

`import` `static` `com.yingzi.wdcservice.common.constants.CommEvent.SCAN_CHECK_LOCKED;`

`import` `static` `com.yingzi.wdcservice.common.constants.CommEvent.SMART_HEAT_FINISH_RESULT_EVENT;`

`import` `static` `com.yingzi.wdcservice.common.constants.CommEvent.SMART_HEAT_START_RESULT_EVENT;`

`import` `static` `com.yingzi.wdcservice.common.constants.CommEvent.SMART_HEAT_STOP_RESULT_EVENT;`

`import` `static` `com.yingzi.wdcservice.common.constants.CommEvent.TOAST_EVENT;`

`import` `android.annotation.SuppressLint;`

`import` `android.app.Activity;`

`import` `android.content.Context;`

`import` `android.content.Intent;`

`import` `android.media.MediaRouter;`

`import` `android.os.Bundle;`

`import` `android.os.Handler;`

`import` `android.os.Looper;`

`import` `android.provider.Settings;`

`import` `android.text.TextUtils;`

`import` `android.util.Log;`

`import` `android.view.Display;`

`import` `android.view.MotionEvent;`

`import` `android.view.View;`

`import` `android.widget.Toast;`

`import` `androidx.activity.result.ActivityResult;`

`import` `androidx.activity.result.ActivityResultCallback;`

`import` `androidx.activity.result.ActivityResultLauncher;`

`import` `androidx.activity.result.contract.ActivityResultContracts;`

`import` `androidx.annotation.NonNull;`

`import` `androidx.annotation.Nullable;`

`import` `androidx.fragment.app.FragmentManager;`

`import` `androidx.fragment.app.FragmentTransaction;`

`import` `androidx.lifecycle.Observer;`

`import` `com.blankj.utilcode.util.ActivityUtils;`

`import` `com.blankj.utilcode.util.LogUtils;`

`import` `com.blankj.utilcode.util.NetworkUtils;`

`import` `com.blankj.utilcode.util.SPUtils;`

`import` `com.blankj.utilcode.util.StringUtils;`

`import` `com.blankj.utilcode.util.ThreadUtils;`

`import` `com.blankj.utilcode.util.Utils;`

`import` `com.bumptech.glide.Glide;`

`import` `com.example.yzbase.constant.SpConstant;`

`import` `com.example.yzbase.event.ErrorReportEvent;`

`import` `com.example.yzbase.event.MqttEvent;`

`import` `com.example.yzbase.event.SDKInitEvent;`

`import` `com.example.yzbase.event.ToastEvent;`

`import` `com.example.yzbase.network.res.ParameterResDto;`

`import` `com.example.yzbase.ui.dialog.DialogHelper;`

`import` `com.example.yzbase.utils.FileHelper;`

`import` `com.yingzi.avatar.listener.IPlayChatListener;`

`import` `com.yingzi.avatar.utils.AvatarPlayer;`

`import` `com.yingzi.avatar.voice.ChangeAvatarUtils;`

`import` `com.yingzi.consume.reciver.NetConnected;`

`import` `com.yingzi.consume.utils.CookHandler;`

`import` `com.yingzi.consume.utils.GsonUtils;`

`import` `com.example.yzbase.utils.WakeLockUtil;`

`import` `com.example.yzbase.utils.YZDeviceUtil;`

`import` `com.jeremyliao.liveeventbus.LiveEventBus;`

`import` `com.lxj.xpopup.core.BasePopupView;`

`import` `com.yingzi.avatar.constant.VoiceTagConstant;`

`import` `com.yingzi.avatar.event.AvatarEvent;`

`import` `com.yingzi.avatar.event.CommonEvent;`

`import` `com.yingzi.avatar.manager.AvatarManager;`

`import` `com.yingzi.avatar.status.AvatarStatusManager;`

`import` `com.yingzi.avatar.view.AvatarViewUtils;`

`import` `com.yingzi.consume.R;`

`import` `com.yingzi.consume.aiui.AiuiBizHelper;`

`import` `com.yingzi.consume.aiui.AvatarInstructUtils;`

`import` `com.yingzi.consume.base.ConsumeBaseActivity;`

`import` `com.yingzi.consume.common.ScreenChooseObserver;`

`import` `com.yingzi.consume.constant.IntentConstants;`

`import` `com.yingzi.consume.databinding.ConsumeActivityMainV2Binding;`

`import` `com.yingzi.consume.dialog.SecondScreenDialog;`

`import` `com.yingzi.consume.reciver.NetworkStateListenHandle;`

`import` `com.yingzi.consume.ui.activity.collect.ConsumeCollectActivity;`

`import` `com.yingzi.consume.ui.dialog.ConsumeCommonDialog;`

`import` `com.yingzi.consume.ui.fragment.home.CareMainFragment;`

`import` `com.yingzi.consume.ui.fragment.home.MainFragment;`

`import` `com.yingzi.consume.ui.viewmodel.ConsumeMainViewV2Model;`

`import` `com.yingzi.consume.ui.viewmodel.GuideViewModel;`

`import` `com.yingzi.consume.ui.widgets.operation.OperationBean;`

`import` `com.yingzi.consume.utils.ConsumeUpdateUtil;`

`import` `com.yingzi.consume.utils.YZBizModeUtil;`

`import` `com.yingzi.consume.utils.YZValueUtil;`

`import` `com.yingzi.consume.utils.YzDialogUtil;`

`import` `com.yingzi.consume.utils.YzToastUtil;`

`import` `com.yingzi.wdcservice.BuildConfig;`

`import` `com.yingzi.wdcservice.common.constants.CommEvent;`

`import` `com.yingzi.wdcservice.common.enums.HeatState;`

`import` `com.yingzi.wdcservice.common.enums.SmartHeatingFinishEventTypeEnum;`

`import` `com.yingzi.wdcservice.common.enums.SmartHeatingStartEventTypeEnum;`

`import` `com.yingzi.wdcservice.common.enums.SmartHeatingStopEventTypeEnum;`

`import` `com.yingzi.wdcservice.common.utils.WdcDeviceUtil;`

`import` `com.yingzi.wdcservice.context.SmartHeatingContext;`

`import` `com.yingzi.wdcservice.noticeview.callback.OnDataCallBack;`

`import` `com.yingzi.wdcservice.noticeview.event.CareModeChangeEvent;`

`import` `com.yingzi.wdcservice.noticeview.event.CheckLockedEvent;`

`import` `com.yingzi.wdcservice.noticeview.event.CookEvent;`

`import` `com.yingzi.wdcservice.noticeview.event.CookingStopEvent;`

`import` `com.yingzi.wdcservice.noticeview.event.DeviceRegisterSuccessEvent;`

`import` `com.yingzi.wdcservice.noticeview.event.DoorCloseEvent;`

`import` `com.yingzi.wdcservice.noticeview.event.DoorOpenEvent;`

`import` `com.yingzi.wdcservice.noticeview.event.FirmwareUpgradeConfirmEvent;`

`import` `com.yingzi.wdcservice.noticeview.event.MicrowaveAdminBindEvent;`

`import` `com.yingzi.wdcservice.noticeview.event.MqttLockedEvent;`

`import` `com.yingzi.wdcservice.noticeview.event.PayQrInvalidEvent;`

`import` `com.yingzi.wdcservice.noticeview.event.SmartHeatingFinishResultEvent;`

`import` `com.yingzi.wdcservice.noticeview.event.SmartHeatingStartResultEvent;`

`import` `com.yingzi.wdcservice.noticeview.event.SmartHeatingStopResultEvent;`

`import` `com.yingzi.wdcservice.noticeview.event.SwitchModelEvent;`

`import` `com.yingzi.wdcservice.service.dto.MicrowaveHeatDataDto;`

`import` `com.yingzi.wdcservice.service.listener.MicrowaveTwoInOneModuleReportEventListener;`

`import` `com.yingzi.wdcservice.statemachine.enums.MicrowaveState;`

`import` `com.yingzi.wdcservice.update.APKUpdateHelper;`

`import` `com.yingzi.yzhci.aiui.YZAiui;`

`import` `com.yingzi.yzhci.aiui.listener.IPermissionCallBack;`

`import` `com.yingzi.yzhci.aiui.util.YZAIUIPermission;`

`import` `java.util.concurrent.TimeUnit;`

`import` `javax.inject.Inject;`

`import` `dagger.hilt.android.AndroidEntryPoint;`

`/**`

 `* @Author: xxx`

 `* @CreateDate: 2022/10/01 9:53 AM`

 `* @Description: 首页`

 `*/`

`@AndroidEntryPoint`

`public` `class` `ConsumeMainActivity` `extends` `ConsumeBaseActivity<ConsumeActivityMainV2Binding, ConsumeMainViewV2Model> {`

    `private` `static` `final` `String TAG =` `"zxx_main"``;`

    `/**`

     `* SDK是否初始化`

     `*/`

    `private` `static` `boolean` `mSDKInit =` `false``;`

    `/**`

     `* 网络状态注册监听`

     `*/`

    `@Inject`

    `NetworkStateListenHandle mNetworkStateListenHandle;`

    `/**`

     `* 统亮屏时间观察者`

     `*/`

    `@Inject`

    `ScreenChooseObserver mSettingsContentObserver;`

    `/**`

     `* 是否收到烹饪完成的消息，做检查Lock锁定弹框用`

     `*/`

    `private` `boolean` `mFinishReceived =` `false``;`

    `/**`

     `* 硬件异常对话框处于非显示状态`

     `*/`

    `private` `boolean` `mHasDisMissErrorDialog =` `true``;`

    `//显示副屏`

    `private` `SecondScreenDialog mSecondScreenDialog;`

    `/**`

     `* AIUI 对应权限申请`

     `*/`

    `private` `YZAIUIPermission mYZAIUIPermission;`

    `public` `static` `View view;`

    `private` `MainFragment mMainFragment;`

    `private` `CareMainFragment mCareMainFragment;`

    `ActivityResultLauncher<Intent> guideIntent = registerForActivityResult(``new` `ActivityResultContracts.StartActivityForResult(),` `new` `ActivityResultCallback<ActivityResult>() {`

        `@Override`

        `public` `void` `onActivityResult(ActivityResult result) {`

            `mViewModel.setDeviceGuideShowing(``false``);`

            `int` `resultCode = result.getResultCode();`

            `if` `(resultCode == IntentConstants.GUIDE_RESULT_CODE) {`

                `// 初始化AIUI`

                `mYZAIUIPermission.requestAiuiAllPermission();`

                `ThreadUtils.runOnUiThreadDelayed(``new` `Runnable() {`

                    `@Override`

                    `public` `void` `run() {`

                        `mViewModel.checkNetwork(``new` `ConsumeMainViewV2Model.ICheckNetworkCallBack() {`

                            `@Override`

                            `public` `void` `ok() {`

                            `}`

                            `@Override`

                            `public` `void` `no() {`

                                `mViewModel.showNetDisableDialog();`

                            `}`

                        `});`

                    `}`

                `},` `1000``);`

            `}`

            `if` `(mViewModel.isShowUserGuideWhenDeviceGuideShowing()) {`

                `mMainFragment.showUserGuideV2();`

            `}`

        `}`

    `});`

    `@Override`

    `protected` `void` `onCreate(``@Nullable` `Bundle savedInstanceState) {`

        `super``.onCreate(savedInstanceState);`

        `mViewModel.setHeadUrl(``null``);`

    `}`

    `@Override`

    `protected` `void` `onStart() {`

        `super``.onStart();`

        `//判断锁定对话框 是否检查 显示`

        `judgeLockDialog();`

    `}`

    `@Override`

    `protected` `void` `onResume() {`

        `super``.onResume();`

        `mBinding.appStatus.setWifiImg();`

        `AvatarViewUtils.getInstance().setVisiable(isShowAvatar());`

    `}`

    `@Override`

    `protected` `void` `onDestroy() {`

`//        AiuiBizHelper.removeAIUIRetry();`

        `super``.onDestroy();`

        `Glide.get(``this``).clearMemory();`

        `getContentResolver().unregisterContentObserver(mSettingsContentObserver);`

    `}`

    `@Inject`

    `AvatarInstructUtils avatarInstructUtils;`

    `@Override`

    `protected` `void` `initView() {`

`//        AvatarViewUtils.getInstance().showFloatingWindow();`

        `AvatarManager.getInstance().init(avatarInstructUtils);`

        `initMainFragment();`

        `//初始化权限对象`

        `initPermission();`

        `//各类消息事件接收`

        `initEventListen();`

        `view = mBinding.flContainer;`

        `//添加Lifecycle观察者设置更新相关动作`

        `ConsumeUpdateUtil.softwareUpdateObserver(``this``);`

        `//设置页面设置超时时间监听器`

        `getContentResolver().registerContentObserver(Settings.System.CONTENT_URI,` `true``, mSettingsContentObserver);`

        `//加载副屏界面`

        `loadSecondScreenView();`

    `}`

    `/**`

     `* 初始化主页Fragment`

     `*/`

    `private` `void` `initMainFragment() {`

        `boolean` `isCareModel = SPUtils.getInstance().getBoolean(SpConstant.IS_CARE_MODEL,` `false``);`

        `LogUtils.i(``"主页关怀版本初始化： 是否是关怀版本"` `+ isCareModel);`

        `FragmentManager fragmentManager = getSupportFragmentManager();`

        `FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();`

        `if` `(isCareModel) {`

            `mCareMainFragment = CareMainFragment.newInstance();`

            `fragmentTransaction.add(mBinding.flContainer.getId(), mCareMainFragment,` `"careMainFragment"``);`

            `fragmentTransaction.show(mCareMainFragment);`

        `}` `else` `{`

            `mMainFragment = MainFragment.newInstance();`

            `fragmentTransaction.add(mBinding.flContainer.getId(), mMainFragment,` `"mainFragment"``);`

            `fragmentTransaction.show(mMainFragment);`

        `}`

        `fragmentTransaction.commitNowAllowingStateLoss();`

    `}`

    `/**`

     `* 切换Fragment`

     `*`

     `* @param toCareHomePage`

     `*/`

    `private` `void` `replaceFragment(``boolean` `toCareHomePage) {`

        `LogUtils.i(``"主页关怀版本替换"` `+ toCareHomePage);`

        `if` `(toCareHomePage) {`

            `mCareMainFragment = CareMainFragment.newInstance();`

            `getSupportFragmentManager().beginTransaction()`

                    `.replace(mBinding.flContainer.getId(), mCareMainFragment)`

                    `.commitAllowingStateLoss();`

        `}` `else` `{`

            `if` `(mMainFragment ==` `null``) {`

                `mMainFragment = MainFragment.newInstance();`

            `}`

            `getSupportFragmentManager().beginTransaction()`

                    `.replace(mBinding.flContainer.getId(), mMainFragment)`

                    `.commitAllowingStateLoss();`

            `//加载虚拟人`

            `new` `Handler().postDelayed(() -> mMainFragment.loadVirtualMan(),` `2000``);`

        `}`

        `SPUtils.getInstance().put(SpConstant.IS_CARE_MODEL, toCareHomePage,` `true``);`

        `YZAiui.getInstance().setAiuiOn(!toCareHomePage);`

        `LogUtils.i(``"主页关怀版本替换后"` `+ SPUtils.getInstance().getBoolean(SpConstant.IS_CARE_MODEL));`

        `ThreadUtils.getMainHandler().postDelayed(``new` `Runnable() {`

            `@Override`

            `public` `void` `run() {`

                `mViewModel.updateCareModeSetting();`

            `}`

        `},` `1000``);`

    `}`

    `@Override`

    `public` `void` `onRequestPermissionsResult(``int` `requestCode,` `@NonNull` `String[] permissions,` `@NonNull` `int``[] grantResults) {`

        `super``.onRequestPermissionsResult(requestCode, permissions, grantResults);`

        `mYZAIUIPermission.onRequestPermissionsResult(requestCode, permissions, grantResults);`

    `}`

    `@Override`

    `protected` `void` `onActivityResult(``int` `requestCode,` `int` `resultCode,` `@androidx``.annotation.Nullable Intent data) {`

        `super``.onActivityResult(requestCode, resultCode, data);`

        `mYZAIUIPermission.onActivityResult(requestCode, resultCode, data);`

        `if` `(RESULT_OK == resultCode && requestCode ==` `100` `&& data !=` `null``) {`

            `OperationBean chooseBean = (OperationBean) data.getSerializableExtra(IntentConstants.COLLECT_CLICK_ITEM);`

            `Log.i(TAG,` `"收到的数据"` `+ GsonUtils.toJson(chooseBean));`

            `if` `(chooseBean !=` `null``) {`

                `mViewModel.setSrcOperationBean(chooseBean);`

                `mMainFragment.setOperatedata(chooseBean);`

            `}`

        `}`

    `}`

    `/**`

     `* 加载副屏界面`

     `*/`

    `private` `void` `loadSecondScreenView() {`

        `if` `(!YZDeviceUtil.isDoubleScreenDevice()) {`

            `return``;`

        `}`

        `//方式1`

        `MediaRouter mediaRouter = (MediaRouter) getSystemService(Context.MEDIA_ROUTER_SERVICE);`

        `MediaRouter.RouteInfo route = mediaRouter.getSelectedRoute(MediaRouter.ROUTE_TYPE_LIVE_AUDIO);`

        `if` `(route !=` `null``) {`

            `Display presentationDisplay = route.getPresentationDisplay();`

            `if` `(presentationDisplay !=` `null``) {`

                `mSecondScreenDialog =` `new` `SecondScreenDialog(ConsumeMainActivity.``this``, presentationDisplay);`

                `mSecondScreenDialog.show();`

            `}`

        `}` `else` `{`

            `Toast.makeText(``this``,` `"不支持分屏"``, Toast.LENGTH_SHORT).show();`

        `}`

    `}`

    `private` `void` `handlePermissionResult(``boolean` `result) {`

        `if` `(result) {`

            `Log.i(TAG,` `"权限都有了，初始化AIUI"``);`

            `initAiui();`

        `}` `else` `{`

            `ConsumeCommonDialog bindDialog =` `new` `ConsumeCommonDialog.Builder(``this``).setContent(getString(R.string.no_permission))`

                    `.setClickCallBack(getString(R.string.go_open), getString(R.string.cancel),` `new` `ConsumeCommonDialog.OnClickListen() {`

                        `@Override`

                        `public` `void` `onConfirmListen(BasePopupView dialog, View view) {`

                            `dialog.dismiss();`

                            `mYZAIUIPermission.requestAiuiAllPermission();`

                        `}`

                        `@Override`

                        `public` `void` `onCancelListen(BasePopupView dialog, View view) {`

                            `dialog.dismiss();`

                        `}`

                    `}).build();`

            `DialogHelper.showDialog(``this``, bindDialog);`

        `}`

    `}`

    `private` `void` `initAiui() {`

        `//由于aiui占用授权设备数量，所以暂时关闭`

        `FileHelper.getInstance().log(TAG,`

                `"initAiui "` `+ AiuiBizHelper.AIUI_ON +` `" isAiuiSuccess: "` `+ YZAiui.getInstance().isAiuiSuccess);`

        `if` `(AiuiBizHelper.AIUI_ON && !YZAiui.getInstance().isAiuiSuccess) {`

            `AiuiBizHelper.initAIUI(YZAiui.MODE_ONE_SHOT);`

        `}`

        `ThreadUtils.runOnUiThread(avatarRunnable);`

    `}`

    `private` `final` `Runnable avatarRunnable=``new` `Runnable() {`

        `@Override`

        `public` `void` `run() {`

            `if` `(mViewModel.initSuccess) {`

                `boolean` `isCareModel = SPUtils.getInstance().getBoolean(SpConstant.IS_CARE_MODEL,` `false``);`

                `AvatarManager.getInstance().create(``"main"``, !isCareModel);`

            `}``else` `{`

                `ThreadUtils.runOnUiThreadDelayed(avatarRunnable,``100``);`

            `}`

        `}`

    `};`

    `@SuppressLint``(``"ClickableViewAccessibility"``)`

    `@Override`

    `protected` `void` `initListen() {`

        `super``.initListen();`

        `Log.i(``"haover"``,` `">>>>> mSDKInit="` `+ mSDKInit);`

        `if` `(mSDKInit) {`

            `mBinding.loadingIV.setVisibility(View.GONE);`

        `}` `else` `{`

            `mBinding.loadingIV.setVisibility(View.VISIBLE);`

        `}`

        `mBinding.loadingIV.setOnClickListener(``new` `View.OnClickListener() {`

            `@Override`

            `public` `void` `onClick(View v) {`

            `}`

        `});`

        `LiveEventBus.get(AvatarEvent.AVATAR_VOICE_TAG_COOK, CommonEvent.``class``).observe(``this``, voiceCookEvent -> {`

            `switch` `(voiceCookEvent.getVoiceCommand()) {`

                `case` `VoiceTagConstant.START_TAG:`

                    `Integer state = SmartHeatingContext.getInstance().getState();`

                    `if` `(ActivityUtils.getTopActivity() == ConsumeMainActivity.``this``) {`

                        `if` `(MicrowaveState.INIT.getCode() == state) {`

                            `startCook();`

                        `}` `else` `{`

                            `AvatarManager.getInstance().playDynamic(getString(R.string.exec_failure),` `false``,` `null``);`

                        `}`

                    `}`

                    `break``;`

            `}`

        `});`

    `}`

    `private` `void` `startCook() {`

        `if` `(mViewModel.getEstimatedTotalCookingTime(mViewModel.getStageList()) >` `1800``) {`

            `YzToastUtil.showCommonToast(getString(R.string.no_more_30));`

            `return``;`

        `}`

        `mViewModel.clickStartCook();`

    `}`

    `/**`

     `* 初始化权限对象`

     `*/`

    `private` `void` `initPermission() {`

        `// 初始化权限对象`

        `mYZAIUIPermission =` `new` `YZAIUIPermission(``this``);`

        `mYZAIUIPermission.setPermissionCallBack(``new` `IPermissionCallBack() {`

            `@Override`

            `public` `void` `callBack(``boolean` `result) {`

                `// 拿到授权结果后做对应处理`

                `handlePermissionResult(result);`

            `}`

        `});`

    `}`

    `/**`

     `* 首次运行跳转引导页面`

     `*/`

    `private` `void` `firstRunGoGuidePage() {`

        `if` `(GuideViewModel.isShowGuide()) {`

            `mViewModel.setDeviceGuideShowing(``true``);`

            `guideIntent.launch(``new` `Intent(``this``, GuideActivity.``class``));`

        `}` `else` `{`

            `// 初始化AIUI`

            `mYZAIUIPermission.requestAiuiAllPermission();`

            `ThreadUtils.runOnUiThreadDelayed(``new` `Runnable() {`

                `@Override`

                `public` `void` `run() {`

                    `mViewModel.checkNetwork(``new` `ConsumeMainViewV2Model.ICheckNetworkCallBack() {`

                        `@Override`

                        `public` `void` `ok() {`

                        `}`

                        `@Override`

                        `public` `void` `no() {`

                            `mViewModel.showNetDisableDialog();`

                        `}`

                    `});`

                `}`

            `},` `3000``);`

        `}`

    `}`

    `/**`

     `* 各类消息事件接收`

     `*/`

    `private` `void` `initEventListen() {`

        `//监听是否有新的系统固件`

        `LiveEventBus.get(CommEvent.CHANGE_CARE_OR_MAIN, SwitchModelEvent.``class``).observe(``this``,`

                `switchModelEvent -> replaceFragment(switchModelEvent.isToCareModel()));`

        `mViewModel.getNewSystemVersionLiveData().observe(``this``, newSystemVersion -> {`

            `if` `(!TextUtils.isEmpty(newSystemVersion)) {`

                `ConsumeUpdateUtil.showSystemUpdateDialog(newSystemVersion,` `new` `ConsumeCommonDialog.OnClickListen() {`

                    `@Override`

                    `public` `void` `onConfirmListen(BasePopupView dialog, View view) {`

                        `LogUtils.d(``"点击更新按钮、开始升级"``);`

                        `dialog.dismiss();`

                        `mViewModel.installSystemFirmware();`

                    `}`

                    `@Override`

                    `public` `void` `onCancelListen(BasePopupView dialog, View view) {`

                        `dialog.dismiss();`

                    `}`

                `});`

            `}`

        `});`

        `mViewModel.mEnterCollectPageLiveData.observe(``this``, collectionFolderResDtos -> {`

            `Intent intent =` `new` `Intent(``this``, ConsumeCollectActivity.``class``);`

            `intent.putExtra(IntentConstants.USERID, mViewModel.getUserId());`

            `intent.putExtra(IntentConstants.UUID, mViewModel.getmUuid());`

            `startActivityForResult(intent,` `100``);`

        `});`

        `//开始烹饪结果`

        `mViewModel.observeStartSmartCookResult(``this``);`

        `//sdk初始化成功`

        `LiveEventBus.get(HARD_SDK_INIT_SUCC, SDKInitEvent.``class``).observeSticky(``this``, sdkInitEvent -> {`

            `LogUtils.d(``"收到初始化成功通知 开始其他模块初始化"``);`

            `mSDKInit =` `true``;`

            `mViewModel.otherHardWareInit();`

            `if` `(!isViewDestroy()) {`

                `mBinding.loadingIV.setVisibility(View.GONE);`

            `}`

            `//加载虚拟人`

            `boolean` `isCareModel = SPUtils.getInstance().getBoolean(SpConstant.IS_CARE_MODEL,` `false``);`

            `if` `(!isCareModel) {`

                `mMainFragment.loadVirtualMan();`

            `}`

            `new` `Handler().postDelayed(``this``::addNetWorkObserver,` `0``);`

            `//首次运行跳转引导页面`

            `firstRunGoGuidePage();`

        `});`

        `//解绑和绑定监听`

        `LiveEventBus.get(MICROWAVE_ADMIN_BIND_EVENT, MicrowaveAdminBindEvent.``class``).observeSticky(``this``,` `new` `Observer<MicrowaveAdminBindEvent>() {`

            `@Override`

            `public` `void` `onChanged(MicrowaveAdminBindEvent adminBindEvent) {`

                `LogUtils.dTag(TAG,` `"bind event"``);`

                `if` `(isViewDestroy()) {`

                    `return``;`

                `}`

                `if` `(``null` `!= adminBindEvent &&` `null` `!= adminBindEvent.getAdminBind() &&` `1` `== adminBindEvent.getAdminBind()) {`

                    `LogUtils.dTag(TAG,` `"bind event yes"``);`

                    `mViewModel.getIsRegistrationLiveData().postValue(``true``);`

                    `mViewModel.getIsRegistrationRealLiveData().postValue(``true``);`

                    `return``;`

                `}`

                `LogUtils.dTag(TAG,` `"bind event not"``);`

                `mViewModel.setUserAccount(``null``);`

                `mViewModel.getIsRegistrationLiveData().postValue(``false``);`

                `mViewModel.getIsRegistrationRealLiveData().postValue(``false``);`

            `}`

        `});`

        `//设备注册成功`

        `LiveEventBus.get(DEVICE_REGISTER_SUCCESS_EVENT, DeviceRegisterSuccessEvent.``class``).observeSticky(``this``,` `new` `Observer<DeviceRegisterSuccessEvent>() {`

            `@Override`

            `public` `void` `onChanged(DeviceRegisterSuccessEvent registerSuccessEvent) {`

                `LogUtils.dTag(TAG,` `"register success event 设备注册成功"``);`

                `mViewModel.setRegisterDeviceSuccess(``true``);`

                `mViewModel.onResume();`

            `}`

        `});`

        `//toast提示`

        `LiveEventBus.get(INVALID_ORDER, PayQrInvalidEvent.``class``).observe(``this``, invalidEvent`

                `-> mViewModel.invalidPreOrderCode(invalidEvent.getOrderNo()));`

        `//toast提示`

        `LiveEventBus.get(TOAST_EVENT, ToastEvent.``class``).observe(``this``, toastEvent -> runOnUiThread(() -> {`

            `if` `(toastEvent.getContent().equals(MicrowaveTwoInOneModuleReportEventListener.NO_SCHEME_TOAST)) {`

                `mViewModel.eventToast(toastEvent.getContent());`

                `AvatarManager.getInstance().playDynamic(``"无法找到烹饪方案，如果您想烹饪食品请对我说‘打开某某烹饪方案"``,`

                        `false``,` `new` `IPlayChatListener() {`

                            `@Override`

                            `public` `void` `onChatEnd(String text) {`

                                `AiuiBizHelper.openDialog(``true``,` `null``);`

                            `}`

                        `});`

            `}` `else` `if` `(toastEvent.getContent().equals(getString(R.string.in_cooking_try_later))) {`

                `AvatarPlayer.playTryLater();`

            `}` `else` `{`

                `mViewModel.eventToast(toastEvent.getContent());`

            `}`

        `}));`

        `//故障上报`

        `LiveEventBus.get(ERROR_REPORT_EVENT, ErrorReportEvent.``class``).observe(``this``, errorReportEvent -> {`

            `if` `(!mHasDisMissErrorDialog) {`

                `LogUtils.d(``"连续收到故障弹框"``);`

                `return``;`

            `}`

            `mViewModel.getSalesAfterPhone(``new` `OnDataCallBack<ParameterResDto>() {`

                `@Override`

                `public` `void` `onSucc(ParameterResDto parameterResDto) {`

                    `showErrorDialog(errorReportEvent, parameterResDto.getAfterSalePhone());`

                `}`

                `@Override`

                `public` `void` `onFail(String message) {`

                `}`

            `});`

        `});`

        `//mqtt 已连接 同步数据`

        `LiveEventBus.get(MQTT_CONNECT, MqttEvent.``class``).observeSticky(``this``, mqttEvent -> {`

            `if` `(mqttEvent.isConnected()) {`

                `mViewModel.initSuccess=``true``;`

                `//收到mqtt通知`

                `LogUtils.d(``"mqtt连接"``);`

                `LogUtils.dTag(``"zxxumqtt"``,` `"Connect  "``);`

                `APKUpdateHelper.mqttConnectComplete();`

                `mViewModel.syncData();`

            `}` `else` `{`

                `LogUtils.dTag(``"zxxumqtt"``,` `"un  Connect  "``);`

                `//mqtt断开连接`

                `LogUtils.d(``"mqtt断开连接"``);`

            `}`

            `mBinding.appStatus.setWifiImg();`

        `});`

        `//COOKING_STOP_EVENT`

        `LiveEventBus.get(COOKING_STOP_EVENT, CookingStopEvent.``class``).observe(``this``, sdkInitEvent -> {`

            `LogUtils.d(``"暂停 定时器执行"``);`

            `ActivityUtils.finishToActivity(ConsumeMainActivity.``class``,` `false``);`

        `});`

        `//烹饪状态事件`

        `LiveEventBus.get(COOKING_EVENT, CookEvent.``class``).observe(``this``, cookEvent -> {`

            `LogUtils.d(``"接收到烹饪事件"` `+ cookEvent);`

            `if` `(HeatState.STOP == cookEvent.getHeatState()) {`

                `mFinishReceived =` `true``;`

                `FileHelper.getInstance().log(``"Main"``,``"3"``);`

                `WakeLockUtil.getInstance().releaseWakeLock();`

            `}` `else` `{`

                `if` `(HeatState.START == cookEvent.getHeatState()) {`

                    `WakeLockUtil.getInstance().getWakeLock();`

                    `WakeLockUtil.getInstance().getWakeLock();`

                `}`

            `}`

        `});`

        `LiveEventBus.get(SMART_HEAT_START_RESULT_EVENT, SmartHeatingStartResultEvent.``class``).observe(``this``, event -> {`

            `LogUtils.dTag(TAG,` `"observeStartSmartCook "` `+ (``null` `== event ?` `"null"` `: event.toString()));`

            `if` `(``null` `== event) {`

                `return``;`

            `}`

            `if` `(SmartHeatingStartEventTypeEnum.SUCCESS == event.getType()) {`

                `LogUtils.dTag(TAG,` `"observeStartSmartCook success"``);`

                `WakeLockUtil.getInstance().getWakeLock();`

                `return``;`

            `}`

        `});`

        `LiveEventBus.get(SMART_HEAT_STOP_RESULT_EVENT, SmartHeatingStopResultEvent.``class``).observe(``this``, event -> {`

            `LogUtils.dTag(TAG,` `"observeStartSmartCook "` `+ (``null` `== event ?` `"null"` `: event.toString()));`

            `if` `(``null` `== event) {`

                `return``;`

            `}`

            `if` `(SmartHeatingStopEventTypeEnum.SUCCESS == event.getType()) {`

                `LogUtils.dTag(TAG,` `"observeStartSmartCook success"``);`

                `mFinishReceived =` `true``;`

                `FileHelper.getInstance().log(``"Main"``,``"4"``);`

                `WakeLockUtil.getInstance().releaseWakeLock();`

                `return``;`

            `}`

        `});`

        `LiveEventBus.get(SMART_HEAT_FINISH_RESULT_EVENT, SmartHeatingFinishResultEvent.``class``).observe(``this``, event -> {`

            `LogUtils.dTag(TAG,` `"observeStartSmartCook "` `+ (``null` `== event ?` `"null"` `: event.toString()));`

            `if` `(``null` `== event) {`

                `return``;`

            `}`

            `if` `(SmartHeatingFinishEventTypeEnum.DONE == event.getType()) {`

                `LogUtils.dTag(TAG,` `"observeStartSmartCook success"``);`

                `mFinishReceived =` `true``;`

                `FileHelper.getInstance().log(``"Main"``,``"5"``);`

                `WakeLockUtil.getInstance().releaseWakeLock();`

                `return``;`

            `}`

        `});`

        `LiveEventBus.get(DOOR_OPEN, DoorOpenEvent.``class``).observe(``this``, doorOpenEvent -> {`

            `if` `(MicrowaveHeatDataDto.getInstance().isHeatFinished()) {`

                `//炉门打开 非烹饪状态才需要获取屏幕锁`

                `WakeLockUtil.acquireWakeLock(ConsumeMainActivity.``this``,` `"dooropen"``);`

`//                mScreenProtectHandle.getWakeLock();`

            `}`

        `});`

        `LiveEventBus.get(DOOR_CLOSED, DoorCloseEvent.``class``).observe(``this``, doorOpenEvent -> {`

`//            if (MicrowaveHeatDataDto.getInstance().isHeatFinished()) {`

`//                //炉门关闭 非烹饪状态才需要释放屏幕锁`

`//                mScreenProtectHandle.releaseWakeLock();`

`//            }`

        `});`

        `//扫码时发现设备锁定`

        `LiveEventBus.get(SCAN_CHECK_LOCKED, CheckLockedEvent.``class``).observe(``this``, event -> {`

            `YzDialogUtil.showLockDialog(event.getContent());`

        `});`

        `//主动下发`

        `LiveEventBus.get(MQTT_LOCKED, MqttLockedEvent.``class``).observe(``this``, event -> {`

            `//不是加热 返回首页`

            `if` `(!WdcDeviceUtil.isHeating()) {`

                `ActivityUtils.finishToActivity(ConsumeMainActivity.``class``,` `false``);`

                `YzDialogUtil.showLockDialog(event.getContent());`

            `}`

        `});`

        `//网络连接通知`

        `LiveEventBus.get(CommEvent.NET_WORK_CONNECTED, NetConnected.``class``).observe(``this``,` `new` `Observer<NetConnected>() {`

            `@Override`

            `public` `void` `onChanged(NetConnected netConnected) {`

                `mViewModel.log(``"net work connected"``);`

                `ThreadUtils.getMainHandler().postDelayed(``new` `Runnable() {`

                    `@Override`

                    `public` `void` `run() {`

                        `mViewModel.updateCareModeSetting();`

                    `}`

                `},` `2000``);`

            `}`

        `});`

        `//app端下发切换关怀模式指令`

        `LiveEventBus.get(CARE_MODE_CHANGE_EVENT, CareModeChangeEvent.``class``).observe(``this``,` `new` `Observer<CareModeChangeEvent>() {`

            `@Override`

            `public` `void` `onChanged(CareModeChangeEvent careModeChangeEvent) {`

                `mViewModel.log(``"CARE_MODE_CHANGE_EVENT receive careModeSwitch="` `+ YZValueUtil.logValue(careModeChangeEvent.getCareModeSwitch()));`

                `Boolean careModeSwitch = careModeChangeEvent.getCareModeSwitch();`

                `if` `(``null` `== careModeSwitch) {`

                    `mViewModel.log(``"CARE_MODE_CHANGE_EVENT careModeSwitch=null do nothing"``);`

                    `return``;`

                `}`

                `if` `(CookHandler.isInCookingPage()) {`

                    `mViewModel.log(``"CARE_MODE_CHANGE_EVENT in cooking page->>do later"``);`

                    `mViewModel.getSwitchToCareModeLiveData().postValue(careModeSwitch);`

                `}` `else` `{`

                    `mViewModel.doSwitchToCareModeFromOrder(careModeSwitch);`

                `}`

            `}`

        `});`

        `//app端下发升级apk指令`

        `LiveEventBus.get(FIRMWARE_UPGRADE_CONFIRM_EVENT, FirmwareUpgradeConfirmEvent.``class``).observe(``this``,` `new` `Observer<FirmwareUpgradeConfirmEvent>() {`

            `@Override`

            `public` `void` `onChanged(FirmwareUpgradeConfirmEvent firmwareUpgradeConfirmEvent) {`

                `mViewModel.log(``"FIRMWARE_UPGRADE_CONFIRM_EVENT receive firmwareType="` `+ YZValueUtil.logValue(firmwareUpgradeConfirmEvent.getFirmwareType()) +` `"  version="` `+ YZValueUtil.logValue(firmwareUpgradeConfirmEvent.getFirmwareVersion()));`

                `if` `(!BuildConfig.apk_firmware_model.equals(firmwareUpgradeConfirmEvent.getFirmwareType())) {`

                    `mViewModel.log(``"FIRMWARE_UPGRADE_CONFIRM_EVENT receive not apk order->>do nothing"``);`

                    `return``;`

                `}`

                `mViewModel.doUpdateApkFromOrder(firmwareUpgradeConfirmEvent.getFirmwareVersion());`

            `}`

        `});`

        `mViewModel.getSwitchToCareModeLiveData().observe(``this``,` `new` `Observer<Boolean>() {`

            `@Override`

            `public` `void` `onChanged(Boolean switchToCare) {`

                `if` `(``null` `== switchToCare) {`

                    `mViewModel.log(``"back home SwitchToCareMode null"``);`

                    `return``;`

                `}`

                `mViewModel.log(String.format(``"back home SwitchToCareMode %s"``, switchToCare));`

                `mViewModel.doSwitchToCareModeFromOrder(switchToCare);`

            `}`

        `});`

        `mViewModel.getIsRegistrationRealLiveData().observe(``this``,` `new` `Observer<Boolean>() {`

            `@Override`

            `public` `void` `onChanged(Boolean isRegistration) {`

                `LogUtils.dTag(TAG,` `"check real isRegistration="` `+ ((``null` `== isRegistration) ?` `"null"` `: isRegistration));`

                `if` `(``null` `== isRegistration) {`

                    `return``;`

                `}`

                `if` `(!isRegistration) {`

                    `if` `(YZBizModeUtil.isCareMode()) {`

                        `LogUtils.i(``"主页关怀版本退出"``);`

                        `YZBizModeUtil.exitCareMode();`

                    `}`

                `}`

            `}`

        `});`

    `}`

    `private` `void` `showErrorDialog(ErrorReportEvent errorReportEvent, String saleAfterPhone) {`

        `Activity topActivity = ActivityUtils.getTopActivity();`

        `DialogHelper.showDialog(topActivity,` `new` `ConsumeCommonDialog.Builder(topActivity)`

                `.setContent(StringUtils.format(getString(R.string.error_text), errorReportEvent.getContent(), saleAfterPhone))`

                `.setClickCallBack(R.string.report_log, R.string.cancel_suanle,` `new` `ConsumeCommonDialog.OnClickListen() {`

                    `@Override`

                    `public` `void` `onConfirmListen(BasePopupView dialog, View view) {`

                        `dialog.dismiss();`

                        `ActivityUtils.finishToActivity(ConsumeMainActivity.``class``,` `false``);`

                        `mHasDisMissErrorDialog =` `true``;`

                        `mViewModel.reportLog(errorReportEvent.getContent(), errorReportEvent.getUserId(), errorReportEvent.getSchemeCode());`

                    `}`

                    `@Override`

                    `public` `void` `onCancelListen(BasePopupView dialog, View view) {`

                        `dialog.dismiss();`

                        `ActivityUtils.finishToActivity(ConsumeMainActivity.``class``,` `false``);`

                        `mHasDisMissErrorDialog =` `true``;`

                    `}`

                `}).build(),` `false``);`

        `mHasDisMissErrorDialog =` `false``;`

    `}`

    `/**`

     `* 判断锁定对话框 是否检查 显示`

     `*/`

    `private` `void` `judgeLockDialog() {`

        `if` `(mFinishReceived) {`

            `mViewModel.checkShowLockDialog();`

            `mFinishReceived =` `false``;`

        `}`

    `}`

    `private` `void` `addNetWorkObserver() {`

        `LogUtils.d(``"添加网络监听"``);`

        `getLifecycle().addObserver(mNetworkStateListenHandle);`

    `}`

    `/**`

     `* 正在开发中提示`

     `*/`

    `public` `void` `onDeveloping(View v) {`

        `YzToastUtil.showCommonToast(getString(R.string.is_developing));`

    `}`

    `public` `void` `onTest(View v) {`

`//        YzToastUtil.showCommonToast("ui…");`

`//        FastBlur fastBlur = new FastBlur();`

`//        basePopupView = new XPopup.Builder(ActivityUtils.getTopActivity())`

`//                .popupAnimation(PopupAnimation.ScaleAlphaFromCenter)`

`//                .dismissOnTouchOutside(true)`

`//                .isDestroyOnDismiss(true)`

`//                .asCustom(new MenuSelectDialog(ActivityUtils.getTopActivity(), this, mViewModel.mTurnTableListLiveData.getValue()));`

`//        basePopupView.getPopupContentView().setBackground(new BitmapDrawable(getResources(), fastBlur.applyBlur(this, view)));`

`//        basePopupView.show();`

    `}`

    `@Override`

    `protected` `boolean` `isShowAvatar() {`

        `AvatarViewUtils.getInstance().setChatVisiable(``false``);`

        `boolean` `isCareModel = SPUtils.getInstance().getBoolean(SpConstant.IS_CARE_MODEL,` `false``);`

        `AvatarStatusManager.getInstance().setBigMiddleVisiable(``false``,` `false``);`

        `return` `!isCareModel;`

    `}`

    `private` `long` `downtime = -1L;`

    `private` `static` `Handler handler =` `new` `Handler(Looper.getMainLooper());`

    `@Override`

    `public` `boolean` `dispatchTouchEvent(MotionEvent ev) {`

        `if` `(AvatarStatusManager.getInstance().isTouchAvatar(ev.getRawX(), ev.getRawY())) {`

            `if` `(ev.getAction() == MotionEvent.ACTION_DOWN) {`

                `downtime = System.currentTimeMillis();`

                `handler.removeCallbacksAndMessages(``null``);`

                `handler.postDelayed(runnable,` `500``);`

            `}` `else` `if` `(ev.getAction() == MotionEvent.ACTION_MOVE) {`

                `handler.removeCallbacksAndMessages(``null``);`

            `}` `else` `if` `(ev.getAction() == MotionEvent.ACTION_UP) {`

                `if` `(downtime >` `0` `&& System.currentTimeMillis() - downtime <` `500``) {`

                    `handler.removeCallbacksAndMessages(``null``);`

                `}`

                `downtime = -``1``;`

            `}`

        `}`

        `return` `super``.dispatchTouchEvent(ev);`

    `}`

    `private` `final` `Runnable runnable =` `new` `Runnable() {`

        `@Override`

        `public` `void` `run() {`

            `if` `(AvatarManager.getInstance().avatarList.size() <=` `1``) {`

                `AvatarManager.getInstance().playDynamic(``"抱歉，您没有可以切换的虚拟人角色"``,` `false``,` `null``);`

            `}` `else` `{`

                `ChangeAvatarUtils.getInstance().show();`

            `}`

        `}`

    `};`

    `@Override`

    `protected` `void` `onPause() {`

        `super``.onPause();`

        `AvatarViewUtils.getInstance().setVisiable(``false``);`

    `}`

`}`

ConsumeMainActivity表达的是：

**具体分析如下：**

> **导入各种类**

*   先导入一些列常量，来自于com.yingzi.wdcservice.common.constants.CommEvent类
    
*   再导入一系列Android的类和接口，详细分析如下：  
    
     展开源码
    
    [expand source](#)[?](#)
    
    1
    
    2
    
    3
    
    4
    
    5
    
    6
    
    7
    
    8
    
    9
    
    10
    
    11
    
    12
    
    13
    
    14
    
    15
    
    `android.annotation.SuppressLint：用于指定特定元素（如类、方法或字段）被标记为已过时、不推荐使用或具有其他特殊属性。`
    
    `android.app.Activity：表示Android应用程序中的一个活动（Activity），即用户界面的一个单独屏幕。`
    
    `android.content.Context：提供访问应用程序资源和服务的接口。`
    
    `android.content.Intent：用于在Android应用程序组件之间传递消息和执行操作。`
    
    `android.media.MediaRouter：用于管理多媒体路由的类，例如音频输出设备。`
    
    `android.os.Bundle：用于在Android组件之间传递数据的容器。`
    
    `android.os.Handler：用于在特定线程上执行代码的工具类。`
    
    `android.os.Looper：用于管理线程消息循环的类。`
    
    `android.provider.Settings：提供访问设备设置的接口。`
    
    `android.text.TextUtils：提供处理文本字符串的实用方法。`
    
    `android.util.Log：用于在Android应用程序中记录日志消息的类。`
    
    `android.view.Display：表示Android设备的显示屏幕。`
    
    `android.view.MotionEvent：表示触摸事件的类。`
    
    `android.view.View：表示Android应用程序中的一个视图元素。`
    
    `android.widget.Toast：用于在屏幕上显示短暂消息的类。`
    
*   再导入一系列AndroidX库中的类和接口，详细分析如下：
    
     展开源码
    
    [expand source](#)[?](#)
    
    1
    
    2
    
    3
    
    4
    
    5
    
    6
    
    7
    
    8
    
    9
    
    `androidx.activity.result.ActivityResult：表示一个活动结果，用于在活动之间传递数据或状态。`
    
    `androidx.activity.result.ActivityResultCallback：用于处理活动结果的回调接口。`
    
    `androidx.activity.result.ActivityResultLauncher：用于启动活动并接收其结果的接口。`
    
    `androidx.activity.result.contract.ActivityResultContracts：定义了一组预定义的活动结果契约，用于启动活动并接收其结果。`
    
    `androidx.annotation.NonNull：用于标记参数、字段或方法返回值不允许为空的注解。`
    
    `androidx.annotation.Nullable：用于标记参数、字段或方法返回值可以为空的注解。`
    
    `androidx.fragment.app.FragmentManager：用于管理Fragment的类，包括添加、替换和移除Fragment等操作。`
    
    `androidx.fragment.app.FragmentTransaction：用于执行Fragment事务的类，包括添加、替换和移除Fragment等操作。`
    
    `androidx.lifecycle.Observer：用于观察LiveData对象的变化并作出相应响应的接口。`
    
    androidx.activity.result的使用分析如下：
    
     展开源码
    
    [expand source](#)[?](#)
    
    1
    
    2
    
    3
    
    4
    
    5
    
    6
    
    7
    
    8
    
    9
    
    10
    
    11
    
    12
    
    13
    
    14
    
    15
    
    16
    
    17
    
    18
    
    19
    
    20
    
    21
    
    22
    
    23
    
    24
    
    25
    
    26
    
    27
    
    28
    
    29
    
    30
    
    31
    
    32
    
    33
    
    34
    
    35
    
    36
    
    37
    
    38
    
    39
    
    40
    
    41
    
    42
    
    43
    
    `androidx.activity.result是AndroidX库中提供的一个用于处理活动结果的模块。它提供了一组类和接口，用于启动活动并接收其结果。`
    
    `要使用androidx.activity.result模块，可以按照以下步骤进行操作：`
    
    `1、在项目的build.gradle文件中，确保已添加AndroidX库的依赖。例如：`
    
        `dependencies {`
    
            `implementation 'androidx.appcompat:appcompat:1.3.0'`
    
        `// 其他依赖项`
    
        `}`
    
    `2、在需要使用androidx.activity.result的类中，导入相关的类和接口。例如：`
    
        `import androidx.activity.result.ActivityResult;`
    
        `import androidx.activity.result.ActivityResultCallback;`
    
        `import androidx.activity.result.ActivityResultLauncher;`
    
        `import androidx.activity.result.contract.ActivityResultContracts;`
    
    `3、创建一个ActivityResultLauncher对象，用于启动活动并接收其结果。例如：`
    
        `ActivityResultLauncher<Intent> launcher = registerForActivityResult(`
    
            `new ActivityResultContracts.StartActivityForResult(),`
    
            `new ActivityResultCallback<ActivityResult>() {`
    
                `@Override`
    
                `public void onActivityResult(ActivityResult result) {`
    
                    `// 处理活动结果`
    
                    `if (result.getResultCode() == Activity.RESULT_OK) {`
    
                        `Intent data = result.getData();`
    
                        `// 处理返回的数据`
    
                    `}`
    
                `}`
    
            `}`
    
        `);`
    
    `4、使用ActivityResultLauncher对象启动活动。例如：`
    
        `Intent intent = new Intent(this, MyActivity.class);`
    
        `launcher.launch(intent);`
    
    `5、在活动的onActivityResult()方法中处理活动结果。例如：`
    
        `@Override`
    
        `protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {`
    
            `super.onActivityResult(requestCode, resultCode, data);`
    
            `if (requestCode == MY_REQUEST_CODE && resultCode == Activity.RESULT_OK) {`
    
                `// 处理返回的数据`
    
            `}`
    
        `}`
    
    `通过以上步骤，你可以使用androidx.activity.result模块来启动活动并接收其结果。这种方式相比传统的startActivityForResult()方法更加简洁和易用，并且提供了更好的可读性和可维护性。`
    
*   再导入了一系列的Java类和接口，详细分析如下：
    
     展开源码
    
    [expand source](#)[?](#)
    
    1
    
    2
    
    3
    
    4
    
    5
    
    6
    
    7
    
    8
    
    9
    
    10
    
    11
    
    12
    
    13
    
    `com.blankj.utilcode.util.ActivityUtils：提供了一些与Activity相关的实用方法，例如启动Activity、获取栈顶Activity等。`
    
    `com.blankj.utilcode.util.LogUtils：用于在应用程序中记录日志消息的工具类。`
    
    `com.blankj.utilcode.util.NetworkUtils：提供了一些与网络连接状态相关的实用方法，例如检查网络是否可用、获取网络类型等。`
    
    `com.blankj.utilcode.util.SPUtils：用于简化SharedPreferences操作的工具类，可以方便地读取和写入数据。`
    
    `com.blankj.utilcode.util.StringUtils：提供了一些字符串处理的实用方法，例如判断字符串是否为空、去除空格等。`
    
    `com.blankj.utilcode.util.ThreadUtils：提供了一些线程操作的实用方法，例如在主线程执行任务、在子线程执行任务等。`
    
    `com.blankj.utilcode.util.Utils：提供了一些通用的工具方法，例如初始化工具类、获取应用程序上下文等。`
    
    `com.bumptech.glide.Glide：一个流行的图片加载库，用于加载和显示图片。`
    
    `com.blankj.utilcode-----Android工具类blankj，了解其用法链接如下：`
    
    `[https://blog.csdn.net/Crystal_xing/article/details/82798241](https://blog.csdn.net/Crystal_xing/article/details/82798241)`
    
    `[https://github.com/Blankj/AndroidUtilCode/blob/master/lib/utilcode/README-CN.md](https://github.com/Blankj/AndroidUtilCode/blob/master/lib/utilcode/README-CN.md)`
    
    `通过导入这些类和接口，可以在代码中使用它们提供的功能和特性。这些类和接口是从不同的库中导入的，用于简化开发过程和提供更多的工具和功能。`
    
*   再导入一些yzbase相关的库
    
     展开源码
    
    [expand source](#)[?](#)
    
    1
    
    2
    
    3
    
    4
    
    5
    
    6
    
    7
    
    8
    
    9
    
    10
    
    11
    
    12
    
    `com.example.yzbase.constant.SpConstant：定义了一些SharedPreferences的常量。`
    
    `com.example.yzbase.event.ErrorReportEvent：表示错误报告事件的类。`
    
    `com.example.yzbase.event.MqttEvent：表示MQTT事件的类。`
    
    `com.example.yzbase.event.SDKInitEvent：表示SDK初始化事件的类。`
    
    `com.example.yzbase.event.ToastEvent：表示Toast消息事件的类。`
    
    `com.example.yzbase.network.res.ParameterResDto：表示参数响应数据的类。`
    
    `com.example.yzbase.ui.dialog.DialogHelper：用于显示对话框的辅助类。`
    
    `com.example.yzbase.utils.FileHelper：提供了一些文件操作的实用方法，例如读取文件、写入文件等。`
    
    `com.example.yzbase.utils.WakeLockUtil：提供了一些与唤醒锁相关的实用方法，用于控制设备的唤醒状态。`
    
    `com.example.yzbase.utils.YZDeviceUtil：提供了一些与设备相关的实用方法，例如获取设备信息、检查设备状态等。`
    
    `通过导入这些类，你可以在代码中使用它们提供的功能和特性。这些类是从com.example.yzbase包中导入的，可能是你自己的项目中定义的类，用于实现特定的功能或提供特定的工具方法。`
    
*   再导入com.yingzi.consume相关的库
    
     展开源码
    
    [expand source](#)[?](#)
    
    1
    
    2
    
    3
    
    4
    
    5
    
    6
    
    7
    
    8
    
    9
    
    10
    
    11
    
    12
    
    13
    
    14
    
    15
    
    16
    
    17
    
    18
    
    19
    
    20
    
    21
    
    22
    
    23
    
    24
    
    `com.yingzi.consume.reciver.NetConnected：表示网络连接状态的接收器类，可能用于监听网络连接状态的变化。`
    
    `com.yingzi.consume.utils.CookHandler：提供了一些与烹饪处理相关的实用方法，可能用于处理烹饪相关的逻辑和操作。`
    
    `com.yingzi.consume.utils.GsonUtils：提供了一些与Gson库相关的实用方法，可能用于处理JSON数据的序列化和反序列化操作。`
    
    `com.yingzi.consume.R：表示资源文件，可能包含应用程序中使用的各种资源，如布局文件、图像文件等。`
    
    `com.yingzi.consume.aiui.AiuiBizHelper：提供了一些与AIUI业务相关的实用方法，可能用于处理AIUI相关的逻辑和操作。`
    
    `com.yingzi.consume.aiui.AvatarInstructUtils：提供了一些与Avatar指令相关的实用方法，可能用于处理Avatar指令的解析和执行。`
    
    `com.yingzi.consume.base.ConsumeBaseActivity：表示应用程序中的基础Activity类，可能包含一些通用的功能和方法。`
    
    `com.yingzi.consume.common.ScreenChooseObserver：表示屏幕选择观察者类，可能用于监听屏幕选择的变化。`
    
    `com.yingzi.consume.constant.IntentConstants：定义了一些Intent常量，可能用于在应用程序中传递数据和信息。`
    
    `com.yingzi.consume.databinding.ConsumeActivityMainV2Binding：表示Data Binding生成的用于绑定视图的类。`
    
    `com.yingzi.consume.dialog.SecondScreenDialog：表示第二屏对话框类，可能用于显示第二屏的相关内容。`
    
    `com.yingzi.consume.reciver.NetworkStateListenHandle：表示网络状态监听处理类，可能用于监听网络状态的变化。`
    
    `com.yingzi.consume.ui.activity.collect.ConsumeCollectActivity：表示消费收集活动类，可能用于展示和管理消费数据的收集。`
    
    `com.yingzi.consume.ui.dialog.ConsumeCommonDialog：表示通用对话框类，可能用于显示应用程序中的通用对话框。`
    
    `com.yingzi.consume.ui.fragment.home.CareMainFragment：表示关注主页片段类，可能用于展示和管理关注的内容。`
    
    `com.yingzi.consume.ui.fragment.home.MainFragment：表示主页片段类，可能用于展示和管理应用程序的主页内容。`
    
    `com.yingzi.consume.ui.viewmodel.ConsumeMainViewV2Model：表示消费主视图V2模型类，可能用于处理消费主视图的逻辑和数据。`
    
    `com.yingzi.consume.ui.viewmodel.GuideViewModel：表示引导视图模型类，可能用于处理应用程序的引导逻辑和数据。`
    
    `com.yingzi.consume.ui.widgets.operation.OperationBean：表示操作项的实体类，可能用于描述和管理操作项的信息。`
    
    `com.yingzi.consume.utils.ConsumeUpdateUtil：提供了一些与消费更新相关的实用方法，可能用于检查和执行消费更新。`
    
    `com.yingzi.consume.utils.YZBizModeUtil：提供了一些与业务模式相关的实用方法，可能用于处理业务模式的逻辑和操作。`
    
    `com.yingzi.consume.utils.YZValueUtil：提供了一些与值处理相关的实用方法，可能用于处理值的转换和计算。`
    
    `com.yingzi.consume.utils.YzDialogUtil：提供了一些与对话框相关的实用方法，可能用于显示和管理对话框。`
    
    `com.yingzi.consume.utils.YzToastUtil：提供了一些与Toast消息相关的实用方法，可能用于显示和管理Toast消息。`
    
*   再导入com.yingzi.wdcservice相关的库  
    
     展开源码
    
    [expand source](#)[?](#)
    
    1
    
    2
    
    3
    
    4
    
    5
    
    6
    
    7
    
    8
    
    9
    
    10
    
    11
    
    12
    
    13
    
    14
    
    15
    
    16
    
    17
    
    18
    
    19
    
    20
    
    21
    
    22
    
    23
    
    24
    
    25
    
    26
    
    27
    
    28
    
    `com.yingzi.wdcservice.BuildConfig：表示构建配置类，可能包含一些与构建相关的配置信息。`
    
    `com.yingzi.wdcservice.common.constants.CommEvent：表示通用事件常量类，可能包含一些应用程序中使用的通用事件常量。`
    
    `com.yingzi.wdcservice.common.enums.HeatState：表示加热状态枚举类，可能包含一些与加热状态相关的枚举值。`
    
    `com.yingzi.wdcservice.common.enums.SmartHeatingFinishEventTypeEnum：表示智能加热完成事件类型枚举类，可能包含一些与智能加热完成事件类型相关的枚举值。`
    
    `com.yingzi.wdcservice.common.enums.SmartHeatingStartEventTypeEnum：表示智能加热开始事件类型枚举类，可能包含一些与智能加热开始事件类型相关的枚举值。`
    
    `com.yingzi.wdcservice.common.enums.SmartHeatingStopEventTypeEnum：表示智能加热停止事件类型枚举类，可能包含一些与智能加热停止事件类型相关的枚举值。`
    
    `com.yingzi.wdcservice.common.utils.WdcDeviceUtil：提供了一些与设备相关的实用方法，可能用于处理设备的逻辑和操作。`
    
    `com.yingzi.wdcservice.context.SmartHeatingContext：表示智能加热上下文类，可能用于管理智能加热的上下文信息。`
    
    `com.yingzi.wdcservice.noticeview.callback.OnDataCallBack：表示数据回调接口，可能用于处理数据回调的逻辑和操作。`
    
    `com.yingzi.wdcservice.noticeview.event.CareModeChangeEvent：表示关注模式变化事件类，可能用于处理关注模式变化事件的逻辑和操作。`
    
    `com.yingzi.wdcservice.noticeview.event.CheckLockedEvent：表示检查锁定事件类，可能用于处理检查锁定事件的逻辑和操作。`
    
    `com.yingzi.wdcservice.noticeview.event.CookEvent：表示烹饪事件类，可能用于处理烹饪事件的逻辑和操作。`
    
    `com.yingzi.wdcservice.noticeview.event.CookingStopEvent：表示烹饪停止事件类，可能用于处理烹饪停止事件的逻辑和操作。`
    
    `com.yingzi.wdcservice.noticeview.event.DeviceRegisterSuccessEvent：表示设备注册成功事件类，可能用于处理设备注册成功事件的逻辑和操作。`
    
    `com.yingzi.wdcservice.noticeview.event.DoorCloseEvent：表示门关闭事件类，可能用于处理门关闭事件的逻辑和操作。`
    
    `com.yingzi.wdcservice.noticeview.event.DoorOpenEvent：表示门打开事件类，可能用于处理门打开事件的逻辑和操作。`
    
    `com.yingzi.wdcservice.noticeview.event.FirmwareUpgradeConfirmEvent：表示固件升级确认事件类，可能用于处理固件升级确认事件的逻辑和操作。`
    
    `com.yingzi.wdcservice.noticeview.event.MicrowaveAdminBindEvent：表示微波炉管理员绑定事件类，可能用于处理微波炉管理员绑定事件的逻辑和操作。`
    
    `com.yingzi.wdcservice.noticeview.event.MqttLockedEvent：表示MQTT锁定事件类，可能用于处理MQTT锁定事件的逻辑和操作。`
    
    `com.yingzi.wdcservice.noticeview.event.PayQrInvalidEvent：表示支付二维码无效事件类，可能用于处理支付二维码无效事件的逻辑和操作。`
    
    `com.yingzi.wdcservice.noticeview.event.SmartHeatingFinishResultEvent：表示智能加热完成结果事件类，可能用于处理智能加热完成结果事件的逻辑和操作。`
    
    `com.yingzi.wdcservice.noticeview.event.SmartHeatingStartResultEvent：表示智能加热开始结果事件类，可能用于处理智能加热开始结果事件的逻辑和操作。`
    
    `com.yingzi.wdcservice.noticeview.event.SmartHeatingStopResultEvent：表示智能加热停止结果事件类，可能用于处理智能加热停止结果事件的逻辑和操作。`
    
    `com.yingzi.wdcservice.noticeview.event.SwitchModelEvent：表示切换模式事件类，可能用于处理切换模式事件的逻辑和操作。`
    
    `com.yingzi.wdcservice.service.dto.MicrowaveHeatDataDto：表示微波炉加热数据传输对象类，可能用于传输微波炉加热数据。`
    
    `com.yingzi.wdcservice.service.listener.MicrowaveTwoInOneModuleReportEventListener：表示微波炉二合一模块报告事件监听器类，可能用于监听微波炉二合一模块的报告事件。`
    
    `com.yingzi.wdcservice.statemachine.enums.MicrowaveState：表示微波炉状态枚举类，可能包含一些与微波炉状态相关的枚举值。`
    
    `com.yingzi.wdcservice.update.APKUpdateHelper：表示APK更新助手类，可能用于处理APK更新的逻辑和操作。`
    
*   AIUI相关的库
    
     展开源码
    
    [expand source](#)[?](#)
    
    1
    
    2
    
    3
    
    4
    
    `com.yingzi.consume.utils.YZBizModeUtil：提供了一些与业务模式相关的实用方法，可能用于处理业务模式的逻辑和操作。`
    
    `com.yingzi.consume.utils.YZValueUtil：提供了一些与值处理相关的实用方法，可能用于处理值的转换和计算。`
    
    `com.yingzi.consume.utils.YzDialogUtil：提供了一些与对话框相关的实用方法，可能用于显示和管理对话框。`
    
    `com.yingzi.consume.utils.YzToastUtil：提供了一些与Toast消息相关的实用方法，可能用于显示和管理Toast消息。`
    
*   其他的库
    
     展开源码
    
    [expand source](#)[?](#)
    
    1
    
    2
    
    3
    
    `java.util.concurrent.TimeUnit：表示时间单位类，用于表示时间的单位，例如秒、毫秒等。`
    
    `javax.inject.Inject：表示依赖注入注解，用于标记需要进行依赖注入的字段、构造函数或方法。`
    
    `dagger.hilt.android.AndroidEntryPoint：表示Android入口点注解，用于标记Android组件（如Activity、Fragment）作为Hilt的入口点，以便进行依赖注入。`
    

> **分析ConsumeMa****inActivity  
> **

[?](#)

1

`public` `class` `ConsumeMainActivity` `extends` `ConsumeBaseActivity<ConsumeActivityMainV2Binding, ConsumeMainViewV2Model> {}`

这段代码表达的是：  

1.  这段代码定义了一个名为ConsumeMainActivity的类，它继承自ConsumeBaseActivity<ConsumeActivityMainV2Binding, ConsumeMainViewV2Model>。  
    在Java中，使用关键字extends来实现类的继承。【通过继承，子类可以继承父类的属性和方法，并可以添加自己的属性和方法】
2.  在这个例子中，ConsumeMainActivity继承自ConsumeBaseActivity<ConsumeActivityMainV2Binding, ConsumeMainViewV2Model>，  
    意味着ConsumeMainActivity将拥有ConsumeBaseActivity类中的属性和方法，并且可以使用ConsumeActivityMainV2Binding和ConsumeMainViewV2Model作为泛型参数。
3.  需要注意的是，ConsumeBaseActivity、ConsumeActivityMainV2Binding和ConsumeMainViewV2Model应该是你项目中定义的类或接口。通过继承和泛型参数的使用，可以实现代码的重用和灵活性。

而ConsumeBaseActivity继承自BaseActivity，BaseActivity继承自AppCompatActivity

AppCompatActivity是Android系统自带类，BaseActivity表达内容为：

  

1.  导入所需的类和包。
2.  声明了一个泛型类型参数T和V，分别表示ViewBinding和ViewModel的类型。
3.  定义了一些成员变量，如mBinding（表示ViewBinding对象）、mViewModel（表示ViewModel对象）、tabBarBinding（表示工具栏的ViewBinding对象）等。
4.  初始化ViewBinding和ViewModel：  
    a、在onCreate方法中，调用invokeVBVM()方法来初始化ViewBinding和ViewModel。  
    b、invokeVBVM()方法使用反射获取泛型参数的具体类型，并使用ViewBinding.inflate()方法和ViewModelProvider来创建ViewBinding和ViewModel对象。
5.  初始化界面、数据和事件监听：  
    a、在onCreate方法中，调用initView()、initData()和initListen()方法来初始化界面、数据和事件监听。  
    b、initView()方法用于初始化界面元素，如设置布局、查找和绑定视图等。  
    c、initData()方法用于初始化数据，可以在子类中重写该方法来执行特定的数据初始化操作。  
    d、initListen()方法用于初始化事件监听器，如按钮点击事件、列表项点击事件等。  
    e、invokeClickListen()方法用于递归遍历ViewGroup中的所有子视图，并为每个子视图设置点击事件监听器。
6.  生命周期方法：  
    a、onDestroy方法：在Activity销毁时被调用，用于释放资源和进行清理操作。在这里，将mBinding置为null，以释放对ViewBinding的引用。  
    b、onResume方法：在Activity从后台切换到前台时被调用，可以在子类中重写该方法来执行特定的逻辑。  
    c、onPause方法：在Activity从前台切换到后台时被调用，可以在子类中重写该方法来执行特定的逻辑。
7.  工具栏相关方法：  
    a、showToolBar()方法：用于确定是否显示工具栏，默认返回false。可以在子类中重写该方法来决定是否显示工具栏。  
    b、setTitle()方法：用于设置工具栏的标题。  
    c、setRightAction()方法：用于设置工具栏右侧的操作按钮，包括文本、颜色和点击事件。
8.  辅助方法：  
    a、backgroundView()方法：用于返回背景视图，可以在子类中重写该方法来自定义背景视图。  
    b、emptyView()方法：用于返回空视图，可以在子类中重写该方法来自定义空视图。  
    c、showEmptyView()方法：用于显示空视图。  
    d、showContentView()方法：用于显示内容视图。
9.  通过继承BaseActivity，可以减少重复代码，并提供一些通用的功能和方法，以便更方便地开发和管理Android应用中的Activity。

ConsumeBaseActivity表达内容为：

1.  android.os.Bundle：用于处理活动的状态信息。  
    android.view.View：用于处理视图相关的操作。  
    android.widget.Toast：用于显示短暂的提示消息。  
    androidx.annotation.Nullable：用于标注可为空的元素。  
    androidx.viewbinding.ViewBinding：用于绑定视图和布局文件。  
    com.blankj.utilcode.util.ActivityUtils：提供了与活动相关的实用方法。  
    com.example.yzbase.ui.widget.SettingReturnButton：自定义的返回按钮小部件。  
    com.yingzi.avatar.helper.AppContextHelper：提供了应用程序上下文的帮助类。  
    com.yingzi.avatar.manager.AvatarManager：管理虚拟人的类。  
    com.yingzi.avatar.status.AvatarStatusManager：管理虚拟人状态的类。  
    com.yingzi.avatar.view.AvatarViewUtils：提供了操作虚拟人视图的实用方法。  
    com.yingzi.avatar.voice.ChangeAvatarUtils：提供了切换虚拟人的实用方法。  
    com.yingzi.avatar.voice.YZVoiceInteractionDialogUtil：提供了与语音交互对话框相关的实用方法。  
    com.yingzi.consume.aiui.AiuiBizHelper：提供了与AIUI业务相关的实用方法。  
    com.yingzi.consume.aiui.AvatarCommonUtils：提供了与虚拟人相关的实用方法。  
    com.yingzi.consume.interf.IAIUIHandlerCallBack：定义了与AIUI处理相关的回调接口。  
    com.yingzi.consume.ui.activity.ConsumeMainActivity：消费主页面的活动类。  
    com.yingzi.consume.utils.AIUIHandler：处理AIUI的帮助类。  
    com.yingzi.consume.utils.CookHandler：处理烹饪相关的帮助类。  
    com.yingzi.consume.utils.YZBizModeUtil：处理业务模式的帮助类。
2.  这是一个抽象类ConsumeBaseActivity，它继承自BaseActivity类。它有两个泛型类型参数T和V，分别限制为ViewBinding和ConsumeBaseViewModel的子类。
3.  onCreate()方法：在这个方法中，调用了父类的onCreate()方法，并初始化了AIUI处理。
4.  showFloatingWindow()方法：这个方法使用AvatarViewUtils实例来显示一个浮动窗口。它根据CookHandler.isInCookingPage()的返回值来确定是否在烹饪页面中显示浮动窗口。
5.  onResume()方法：在这个方法中，首先关闭了返回按钮的浮动窗口，然后调用了showFloatingWindow()方法显示浮动窗口。接着，根据isShowAvatar()方法的返回值设置虚拟人视图的可见性，并将AvatarManager.getInstance().needWalk设置为isShowAvatar()的返回值。
6.  onPause()方法：在这个方法中，关闭了语音交互对话框并取消与之关联的任何超时。
7.  initAIUIHandler()方法：这是一个私有方法，它通过向生命周期添加观察者并提供IAIUIHandlerCallBack接口的实现来初始化AIUI处理。
8.  showFloatingWindow()方法：这个方法使用AvatarViewUtils实例来显示一个浮动窗口。它根据CookHandler.isInCookingPage()的返回值来确定是否在烹饪页面中显示浮动窗口。
9.  enableAIUIOnThisPage()方法：这个方法确定当前页面是否打开AIUI。它根据YZBizModeUtil.isCareMode()的返回值来确定是否打开AIUI。
10.  showSkillsOnThisPage()方法：这个方法返回当前页面要显示的技能列表。它调用了AiuiBizHelper.defaultShowSkills()方法来获取默认的技能列表。
11.  isDoDefaultSkillsThisPage()方法：这个方法确定当前页面是否处理默认技能。它返回一个布尔值，表示当前页面。
12.  isShowAvatar()方法：这个方法确定当前页面是否显示虚拟人。它根据AvatarStatusManager.getInstance().isShowAvatar()的返回值来确定是否显示虚拟人。
13.  doBizRecognizeResult()方法：这个方法处理业务界面的AIUI识别结果。它接收一些参数，包括技能类型、意图类型、意图、语音文本、回答和JSON数组。

2.3. 设计稿适配页面
------------

参考文档：[http://tech.ipalfish.com/blog/2020/04/14/autosize/](http://tech.ipalfish.com/blog/2020/04/14/autosize/)

2.4. 实现视图绑定
-----------

有两种方法实现，一种是Android自带的viewBinding，一种是使用第三方开源库Butter Knife，都是用于简化视图与代码事件的绑定过程，但其具体的用法、效果等等有一些区别，如下所示：

*   依赖关系：ButterKnife 是一个第三方库，需要在项目中添加相应的依赖项。而 ViewBinding 是 Android 官方提供的功能，在 Android Gradle 插件 3.6.0 及更高版本中默认可用，无需额外的依赖。
*   注解处理器 vs. 自动生成类：ButterKnife 使用注解处理器，在编译时生成绑定代码，通过注解来标记需要绑定的视图组件。而 ViewBinding 则是通过 Android Gradle 插件自动生成绑定类，无需使用注解。
*   Null 安全性：ViewBinding 支持空安全（null safety），生成的绑定类中的视图组件都是可空类型，避免了空指针异常。而 ButterKnife 不具备空安全性，需要手动处理可能为空的视图组件。
*   性能：由于 ButterKnife 使用注解处理器，在编译时生成绑定代码，因此在运行时绑定速度较快。而 ViewBinding 是在运行时通过反射来查找和绑定视图组件，稍微慢于 ButterKnife。
*   功能和灵活性：ButterKnife 提供了更多的功能，如绑定点击事件、资源绑定等。它还可以与其他库（如 Dagger）结合使用。而 ViewBinding 主要用于视图绑定，不提供其他额外的功能。

总体而言，ViewBinding 是 Android 官方推荐的视图绑定方式，具有空安全性和简单易用的特点。ButterKnife 则是一个功能更丰富的第三方库，适用于需要更多高级功能的项目。选择使用哪种方式取决于您的项目需求和个人偏好。

### 2.4.1. viewBinding

1.  确保您的项目使用了 Android Gradle 插件 3.6.0 或更高版本。在build.gradle中配置：  
    
    **build.gradle**
    
    [?](#)
    
    1
    
    2
    
    3
    
    4
    
    5
    
    `android{`
    
        `viewBinding{`
    
            `enabled = true`
    
        `}`
    
    `}`
    
2.  在布局文件中，确保每个需要绑定的视图组件都有一个唯一的 ID。例如，给一个 TextView 设置一个 ID：  
    
    **XML**
    
    [?](#)
    
    1
    
    2
    
    3
    
    4
    
    5
    
    6
    
    7
    
    8
    
    9
    
    10
    
    `<``TextView`
    
        `android:id``=``"@+id/myTextView"`
    
        `android:layout_width``=``"wrap_content"`
    
        `android:layout_height``=``"wrap_content"`
    
        `android:text``=``"Hello ViewBinding!"` `/>`
    
    `<``Button`
    
        `android:id``=``"@+id/btn_submit"`
    
        `android:layout_width``=``"wrap_content"`
    
        `android:layout_height``=``"wrap_content"`
    
        `android:text``=``"@string/submit"` `/>`
    
3.  在对应的 Activity 或 Fragment 中启用 ViewBinding，在类的顶部添加以下代码：
    
    **MainActivity.java**
    
    [?](#)
    
    1
    
    `import` `com.example.myapp.databinding.ActivityMainBinding;`
    
4.  在 Activity 或 Fragment 的 onCreate() 方法中，使用 setContentView() 方法来设置布局，并通过 ActivityMainBinding.inflate() 或 FragmentMainBinding.inflate() 方法来获取绑定实例：
    
    **MainActivity.java**
    
    [?](#)
    
    1
    
    2
    
    3
    
    4
    
    5
    
    6
    
    7
    
    8
    
    9
    
    10
    
    11
    
    12
    
    13
    
    14
    
    15
    
    16
    
    17
    
    18
    
    19
    
    20
    
    21
    
    22
    
    23
    
    `protected` `void` `onCreate(Bundle savedInstanceState) {`
    
         `super``.onCreate(savedInstanceState);`
    
         `binding = ActivityMainBinding.inflate(getLayoutInflater());`
    
         `setContentView(binding.getRoot());`
    
         `// 现在可以通过 binding 来访问布局中的视图组件`
    
         `binding.myTextView.setText(``"Hello ViewBinding!"``);`
    
         `// 设置点击事件监听器，进行页面跳转`
    
         `binding.btnSubmit.setOnClickListener(``new` `View.OnClickListener() {`
    
             `@Override`
    
             `public` `void` `onClick(View v) {`
    
                 `// 创建 Intent 对象，指定目标 Activity`
    
                 `Intent intent =` `new` `Intent(MainActivity.``this``, SecondActivity.``class``);`
    
                 `// 可选：传递数据到目标 Activity`
    
                 `intent.putExtra(``"key"``,` `"value"``);`
    
                 `// 启动目标 Activity`
    
                 `startActivity(intent);`
    
               `}`
    
         `});`
    
    `}`
    
5.  现在，您可以使用 binding 对象来访问布局文件中的视图组件，无需手动调用 findViewById() 方法。例如，通过 binding.myTextView 来访问布局中的 TextView。

这样，您就成功地使用了 ViewBinding 进行视图绑定。通过 ViewBinding，您可以获得类型安全的视图访问，并且无需手动进行视图组件的查找和转换操作，提高了代码的可读性和开发效率。

### 2.4.2. Butter Knife

1.  在项目的 build.gradle 文件中添加 Butter Knife 的依赖：  
    
    **build.gradle**
    
    [?](#)
    
    1
    
    2
    
    3
    
    4
    
    `dependencies{`
    
        `implementation` `'com.jakewharton:butterknife:10.2.3'`
    
        `annotationProcessor` `'com.jakewharton:butterknife-compiler:10.2.3'`
    
    `}`
    
2.  在您的 Activity 或 Fragment 中使用 Butter Knife 进行视图绑定和事件绑定。首先，在类上添加 @BindView 注解来绑定视图：
    
    **MainActivity.java**
    
    [?](#)
    
    1
    
    2
    
    3
    
    4
    
    5
    
    6
    
    7
    
    8
    
    9
    
    10
    
    11
    
    12
    
    13
    
    14
    
    15
    
    16
    
    17
    
    `import` `butterknife.BindView;`
    
    `import` `butterknife.ButterKnife`
    
    `public` `class` `MainActivity` `extends` `AppCompatActivity {`
    
        `@BindView``(R.id.textView)`
    
        `TextView textView;`
    
        `@Override`
    
        `protected` `void` `onCreate(Bundle savedInstanceState) {`
    
            `super``.onCreate(savedInstanceState);`
    
            `setContentView(R.layout.activity_main);`
    
            `ButterKnife.bind(``this``);`
    
            `// 现在可以直接使用 textView，而不需要手动调用 findViewById()`
    
            `textView.setText(``"Hello Butter Knife!"``);`
    
        `}`
    
    `}`
    
    在上述示例中，我们使用 @BindView 注解将一个 TextView 视图与 textView 字段进行绑定。然后，在 onCreate() 方法中，我们调用 ButterKnife.bind(this) 来完成视图绑定。
    
3.  如果您想要处理视图的点击事件，可以使用 @OnClick 注解:
    
    **MainActivity.java**
    
    [?](#)
    
    1
    
    2
    
    3
    
    4
    
    5
    
    6
    
    7
    
    8
    
    9
    
    10
    
    `import` `butterknife.Onclick;`
    
    `public` `class` `MainActivity` `extends` `AppCompatActivity {`
    
        `// ...`
    
        `@OnClick``(R.id.button)`
    
        `public` `void` `onButtonClick() {`
    
            `// 处理按钮点击事件`
    
        `}`
    
    `}`
    
    在上述示例中，我们使用 @OnClick 注解来定义一个名为 onButtonClick() 的方法，用于处理按钮的点击事件。通过这种方式，您无需手动设置点击事件监听器，Butter Knife 将自动为您处理。
    

通过使用 Butter Knife，您可以简化视图绑定和事件绑定的过程，使代码更加简洁和易读。请确保在使用 Butter Knife 之前正确配置了相关的依赖项，并按照注解的规则进行使用。

2.5. 实现数据绑定
-----------

2.6. 实现路由跳转
-----------

2.7. 实现数据请求
-----------

2.8. Fragment生命周期
-----------------

**fragment生命周期**

[?](#)

1

2

3

4

5

6

7

8

9

10

11

12

13

14

`在 Android Fragment 的生命周期中，常见的方法包括：`

`onAttach(): 当 Fragment 被附加到 Activity 时调用。`

`onCreate(): 在 Fragment 创建时调用，用于进行基本的初始化操作。`

`onCreateView(): 在创建 Fragment 的用户界面时调用，用于创建和配置布局。`

`onActivityCreated(): 在与 Fragment 相关联的 Activity 的 onCreate() 方法完成后调用。`

`onStart(): 当 Fragment 可见时调用。`

`onResume(): 当 Fragment 可交互并处于前台时调用。`

`onPause(): 当 Fragment 失去焦点、不再可交互或进入后台时调用。`

`onStop(): 当 Fragment 不再可见时调用。`

`onDestroyView(): 在销毁 Fragment 的用户界面时调用。`

`onDestroy(): 在销毁 Fragment 时调用。`

`onDetach(): 当 Fragment 与 Activity 解除关联时调用。`

`这些方法提供了在 Fragment 生命周期中执行特定操作的机会。通过重写这些方法，您可以在适当的时候执行初始化、资源释放、数据保存等操作，以确保 Fragment 的正确行为和良好的用户体验。`

`需要注意的是，Fragment 的生命周期方法可能会根据 Fragment 的状态和与其相关联的 Activity 的生命周期而有所变化。因此，在编写 Fragment 时，应该根据具体需求和场景合理地处理这些生命周期方法。`

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)