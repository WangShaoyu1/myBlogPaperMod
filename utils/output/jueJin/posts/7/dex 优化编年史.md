---
author: ""
title: "dex 优化编年史"
date: 2023-02-17
description: "本文将介绍在 Android 50 及以上系统中，对动态加载的 dex 进行优化的实现方式及原理。"
tags: ["Android中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:26,comments:4,collects:45,views:3459,"
---
> 本文作者：熊大

引言
--

在热修复和插件化场景中会涉及动态加载 dex，要使它们中代码的执行速度与安装的 APK 相当，需要对它们进行正确的优化。根据以往的经验，在热修复场景中，错误的方式导致 dex 没有得到优化时，修复后 App 的启动速度比修复前慢 50%。本文将在下面的部分介绍在 Android 5.0 以来的各系统版本中对动态加载的 dex 进行优化的方式及原理。

Android 5
---------

从 Android 5.0 开始，系统引入了预先编译机制（AOT），在应用安装时，使用 dex2oat 工具将 dex 编译为可执行文件。

此时可以通过 `DexFile.loadDex` 来触发 dex2oat 优化 dex，其调用过程如下：

```rust
DexFile.loadDex -> new DexFile -> DexFile.openDexFile -> DexFile.openDexFileNative -> DexFile_openDexFileNative -> ClassLinker::OpenDexFilesFromOat -> ClassLinker::CreateOatFileForDexLocation -> ClassLinker::GenerateOatFile
```

可以看到在 `ClassLinker::GenerateOatFile` 函数中会执行 dex2oat 命令来优化 dex。

```c++
// art/runtime/class_linker.cc(android-5.0.2)
bool ClassLinker::GenerateOatFile(const char* dex_filename,
int oat_fd,
const char* oat_cache_filename,
    std::string* error_msg) {
    // ...
    std::vector<std::string> argv;
    argv.push_back(dex2oat);
    argv.push_back("--runtime-arg");
    argv.push_back("-classpath");
    argv.push_back("--runtime-arg");
    argv.push_back(Runtime::Current()->GetClassPathString());
    
    Runtime::Current()->AddCurrentRuntimeFeaturesAsDex2OatArguments(&argv);
    
        if (!Runtime::Current()->IsVerificationEnabled()) {
        argv.push_back("--compiler-filter=verify-none");
    }
    
        if (Runtime::Current()->MustRelocateIfPossible()) {
        argv.push_back("--runtime-arg");
        argv.push_back("-Xrelocate");
            } else {
            argv.push_back("--runtime-arg");
            argv.push_back("-Xnorelocate");
        }
        
            if (!kIsTargetBuild) {
            argv.push_back("--host");
        }
        
        argv.push_back(boot_image_option);
        argv.push_back(dex_file_option);
        argv.push_back(oat_fd_option);
        argv.push_back(oat_location_option);
        const std::vector<std::string>& compiler_options = Runtime::Current()->GetCompilerOptions();
            for (size_t i = 0; i < compiler_options.size(); ++i) {
            argv.push_back(compiler_options[i].c_str());
        }
        
        return Exec(argv, error_msg);
    }
```

所以，可用 `DexFile.loadDex` 进行 dex 优化。

![](/images/jueJin/2ebdd4b844abffc.png)

Android 7
---------

从 Android 7.0 开始，为解决 AOT 带来的安装时间长和占用空间大等问题，系统引入了配置文件引导型编译，结合 AOT 和 即时编译（JIT）一起使用：

1.  应用安装时不再进行 AOT 编译
2.  在应用的运行过程中，对未编译的代码进行解释，将执行的方法信息记录到配置文件中，并对经常执行的方法进行 JIT 编译
3.  当设备闲置和充电时，根据生成的配置文件对常用代码进行 AOT 编译

配置文件引导型编译跟以前的 AOT 编译的一个主要区别是执行 dex2oat 时使用的编译过滤器不同，前者使用 `speed-profile`，而后者使用 `speed`。dex2oat 的所有编译过滤器定义在 `compiler_filter.h` 中，在不同系统版本中类型会有变化，主要有以下 4 种：

*   `verify`：仅运行 dex 代码验证
*   `quicken`：运行 dex 代码验证，并优化一些 dex 指令，以获得更好的解释器性能（Android 8 引入，Android 12 移除）
*   `speed`：运行 dex 代码验证，并对所有方法进行 AOT 编译
*   `speed-profile`：运行 dex 代码验证，并对配置文件中列出的方法进行 AOT 编译

编译过滤器会影响 dex 优化的效果，回到前面给出的优化方法 `DexFile.loadDex`，其在新系统版本中会使用优化所需的编译过滤器吗？`DexFile.loadDex` 在 Android 7.0 上调用过程如下：

```rust
DexFile.loadDex -> new DexFile -> DexFile.openDexFile -> DexFile.openDexFileNative -> DexFile_openDexFileNative -> OatFileManager::OpenDexFilesFromOat -> OatFileAssistant::MakeUpToDate -> OatFileAssistant::GenerateOatFile
```

依然会在 `OatFileAssistant::GenerateOatFile` 函数中执行 dex2oat 命令，使用的编译过滤器是在调 `OatFileAssistant::MakeUpToDate` 函数时传入的 `speed`，所以 `DexFile.loadDex` 在 Android 7.0 上依然适用。

```c++
// art/runtime/oat_file_manager.cc(android-7.0.0)
CompilerFilter::Filter OatFileManager::filter_ = CompilerFilter::Filter::kSpeed;

std::vector<std::unique_ptr<const DexFile>> OatFileManager::OpenDexFilesFromOat(
const char* dex_location,
const char* oat_location,
jobject class_loader,
jobjectArray dex_elements,
const OatFile** out_oat_file,
    std::vector<std::string>* error_msgs) {
    // ...
        if (!oat_file_assistant.IsUpToDate()) {
        // ...
            switch (oat_file_assistant.MakeUpToDate(filter_, /*out*/ &error_msg)) {
            // ...
        }
    }
    // ...
}
```

Android 8
---------

在 Android 8.0 中，`DexFile.loadDex` 的调用过程基本不变，但编译过滤器改为通过 `GetRuntimeCompilerFilterOption` 函数得到。

```c++
// art/runtime/oat_file_assistant.cc(android-8.0.0)
    OatFileAssistant::MakeUpToDate(bool profile_changed, std::string* error_msg) {
    CompilerFilter::Filter target;
        if (!GetRuntimeCompilerFilterOption(&target, error_msg)) {
        return kUpdateNotAttempted;
    }
    // ...
}
```

`GetRuntimeCompilerFilterOption` 函数优先取当前 `Runtime` 的启动参数 `--compiler-filter` 指定的编译过滤器，如不存在，则用默认的 `quicken`。

```c++
// art/runtime/oat_file_assistant.cc(android-8.0.0)
static bool GetRuntimeCompilerFilterOption(CompilerFilter::Filter* filter,
    std::string* error_msg) {
    // ...
    *filter = OatFileAssistant::kDefaultCompilerFilterForDexLoading;
        for (StringPiece option : Runtime::Current()->GetCompilerOptions()) {
            if (option.starts_with("--compiler-filter=")) {
            const char* compiler_filter_string = option.substr(strlen("--compiler-filter=")).data();
                if (!CompilerFilter::ParseCompilerFilter(compiler_filter_string, filter)) {
                // ...
                return false;
            }
        }
    }
    return true;
}

// art/runtime/oat_file_assistant.h(android-8.0.0)
    class OatFileAssistant {
    public:
    // The default compile filter to use when optimizing dex file at load time if they
    // are out of date.
    static const CompilerFilter::Filter kDefaultCompilerFilterForDexLoading =
    CompilerFilter::kQuicken;
    // ...
    };
```

`Runtime` 的启动参数 `--compiler-filter` 的值由设置的系统属性 `vold.decrypt` 和 `dalvik.vm.dex2oat-filter` 决定：

1.  如果 `vold.decrypt` 属性值等于 `trigger_restart_min_framework` 或 `1`，则为 `assume-verified`
2.  否则为 `dalvik.vm.dex2oat-filter` 属性值

```c++
// frameworks/base/core/jni/AndroidRuntime.cpp(android-8.0.0)
int AndroidRuntime::startVm(JavaVM** pJavaVM, JNIEnv** pEnv, bool zygote)
    {
    // ...
    property_get("vold.decrypt", voldDecryptBuf, "");
    bool skip_compilation = ((strcmp(voldDecryptBuf, "trigger_restart_min_framework") == 0) ||
    (strcmp(voldDecryptBuf, "1") == 0));
    // ...
        if (skip_compilation) {
        addOption("-Xcompiler-option");
        addOption("--compiler-filter=assume-verified");
        // ...
            } else {
            parseCompilerOption("dalvik.vm.dex2oat-filter", dex2oatCompilerFilterBuf,
            "--compiler-filter=", "-Xcompiler-option");
        }
    }
```

通过 adb 用 `getprop` 命令查看系统属性值，可知 `vold.decrypt` 的属性值不等于 `trigger_restart_min_framework` 或 `1`，且 `dalvik.vm.dex2oat-filter` 属性不存在，所以 `DexFile.loadDex` 最终使用的编译过滤器为 `quicken`，达不到 dex 优化的要求。

无法实现对 dex 的所有方法进行 AOT 编译，可以退而求其次，通过创建 `BaseDexClassLoader` 或其子类对象，让动态加载的 dex 跟安装的应用一样，初始只做基本优化，随着代码的运行，常用代码会被 AOT 编译。

`BaseDexClassLoader` 的构造方法会依次执行以下 2 个步骤来分别实现基本优化和对常用代码进行 AOT 编译：

1.  创建 `DexPathList` 对象
2.  执行 `DexLoadReporter.report` 方法

```java
// libcore/dalvik/src/main/java/dalvik/system/BaseDexClassLoader.java(android-8.0.0)
public BaseDexClassLoader(String dexPath, File optimizedDirectory,
    String librarySearchPath, ClassLoader parent) {
    super(parent);
    this.pathList = new DexPathList(this, dexPath, librarySearchPath, null);
    
        if (reporter != null) {
        reporter.report(this.pathList.getDexPaths());
    }
}
```

首先，创建 `DexPathList` 对象会触发创建 `DexFile` 对象，进而会如前文所述使用编译过滤器 `quicken` 执行基本优化，调用过程如下：

```rust
new DexPathList -> DexPathList.makeDexElements -> DexPathList.loadDexFile -> new DexFile
```

在介绍为什么 `DexLoadReporter.report` 方法可以让动态加载的 dex 能被 AOT 编译之前，先看看 `BaseDexClassLoader.reporter` 的来源。在应用启动过程中，系统会根据 `dalvik.vm.usejitprofiles` 属性值来决定是否将 `DexLoadReporter` 单例设给 `BaseDexClassLoader` 的静态变量 `reporter`，通过 `getprop` 命令查看可知 `dalvik.vm.usejitprofiles` 属性值为 `true`，所以 `BaseDexClassLoader.reporter` 的值为 `DexLoadReporter` 单例。

```java
// frameworks/base/core/java/android/app/ActivityThread.java(android-8.0.0)
    private void handleBindApplication(AppBindData data) {
    // ...
        if (SystemProperties.getBoolean("dalvik.vm.usejitprofiles", false)) {
        BaseDexClassLoader.setReporter(DexLoadReporter.getInstance());
    }
    // ...
}
```

`DexLoadReporter.report` 方法通过执行如下 2 步来实现动态加载的 dex 会被系统执行基于配置文件的 AOT 编译：

1.  向 `PackageManagerService` 注册 dex 使用信息，使系统在执行后台 dex 优化时能获得动态加载的 dex 信息进行优化
2.  向 `VMRuntime` 注册记录执行的方法信息的配置文件，使动态加载的 dex 中的方法被执行时也会被记录

```java
// frameworks/base/core/java/android/app/DexLoadReporter.java(android-8.0.0)
    public void report(List<String> dexPaths) {
    // ...
    // Notify the package manager about the dex loads unconditionally.
    // The load might be for either a primary or secondary dex file.
    notifyPackageManager(dexPaths);
    // Check for secondary dex files and register them for profiling if
    // possible.
    registerSecondaryDexForProfiling(dexPaths);
}
```

`notifyPackageManager` 方法经过如下调用过程后，将 dex 信息注册到 `PackageDexUsage` 中，并写入到 `/data/system/package-dex-usage.list` 文件中。

```rust
DexLoadReporter.notifyPackageManager -> PackageManagerService.notifyDexLoad -> DexManager.notifyDexLoad -> PackageDexUsage.record -> PackageDexUsage.maybeWriteAsync
```

`registerSecondaryDexForProfiling` 方法会以 dex 文件路径加 `.prof` 后缀作为路径创建配置文件，并将其注册到 `VMRuntime` 中。在执行过程中会判断 dex 文件是否是 secondary dex 文件，即非安装的 APK 文件，判断方式为 dex 文件是否位于应用的 data 目录中，所以需要将动态加载的 dex 放在应用的 data 目录中。

最后来分析下系统执行后台 dex 优化的流程，看看通过创建 `BaseDexClassLoader` 或其子类对象的方式注册到 `PackageDexUsage` 中的 dex 能否被优化。系统会在启动时向 `JobScheduler` 注册后台 dex 优化任务，调用过程如下：

```rust
SystemServer.run -> SystemServer.startOtherServices -> BackgroundDexOptService.schedule
```

后台 dex 优化任务会在设备空闲且充电时执行，任务执行时间间隔至少 1 天。

```java
// frameworks/base/services/core/java/com/android/server/pm/BackgroundDexOptService.java(android-8.0.0)
    public static void schedule(Context context) {
    JobScheduler js = (JobScheduler) context.getSystemService(Context.JOB_SCHEDULER_SERVICE);
    // ...
    js.schedule(new JobInfo.Builder(JOB_IDLE_OPTIMIZE, sDexoptServiceName)
    .setRequiresDeviceIdle(true)
    .setRequiresCharging(true)
    .setPeriodic(IDLE_OPTIMIZATION_PERIOD)
    .build());
    // ...
}
```

系统执行后台 dex 优化任务的调用过程如下：

```rust
BackgroundDexOptService.onStartJob -> BackgroundDexOptService.runIdleOptimization -> BackgroundDexOptService.idleOptimization
```

在 `BackgroundDexOptService.idleOptimization` 方法中，会根据 `dalvik.vm.dexopt.secondary` 属性值决定是否对 secondary dex 进行优化，使用 `getprop` 命令查看可知该属性值为 `true`，所以后台 dex 优化的目标包含 secondary dex。

```java
// frameworks/base/services/core/java/com/android/server/pm/BackgroundDexOptService.java(android-8.0.0)
    private int idleOptimization(PackageManagerService pm, ArraySet<String> pkgs, Context context) {
    // ...
        if (SystemProperties.getBoolean("dalvik.vm.dexopt.secondary", false)) {
        // ...
        result = optimizePackages(pm, pkgs, lowStorageThreshold, /*is_for_primary_dex*/ false,
        sFailedPackageNamesSecondary);
    }
    return result;
}
```

后续对 secondary dex 进行优化的调用过程如下，最终通过从 `ServiceManager` 获取的 `installd` 服务提供的 `dexopt` 接口执行 dex 优化。

```rust
BackgroundDexOptService.optimizePackages -> PackageManagerService.performDexOptSecondary -> DexManager.dexoptSecondaryDex -> DexManager.dexoptSecondaryDex -> PackageDexOptimizer.dexOptSecondaryDexPath -> PackageDexOptimizer.dexOptSecondaryDexPathLI -> Installer.dexopt
```

在 `DexManager.dexoptSecondaryDex` 方法中，会先从 `PackageDexUsage` 获取已注册的 dex 信息，然后执行 dex 优化，所以只有已注册到 `PackageDexUsage` 中的 dex 能被优化。

```java
// frameworks/base/services/core/java/com/android/server/pm/dex/DexManager.java(android-8.0.0)
    public boolean dexoptSecondaryDex(String packageName, String compilerFilter, boolean force) {
    // ...
    PackageUseInfo useInfo = getPackageUseInfo(packageName);
    // ...
        for (Map.Entry<String, DexUseInfo> entry : useInfo.getDexUseInfoMap().entrySet()) {
        // ...
        int result = pdo.dexOptSecondaryDexPath(pkg.applicationInfo, dexPath,
        dexUseInfo.getLoaderIsas(), compilerFilter, dexUseInfo.isUsedByOtherApps());
        // ...
    }
    // ...
}

    public PackageUseInfo getPackageUseInfo(String packageName) {
    return mPackageDexUsage.getPackageUseInfo(packageName);
}
```

前文提到注册 dex 时会将 dex 信息写入文件，且在系统启动创建 `PackageManagerService` 对象时会读取文件中的 dex 信息，调用过程如下：

```rust
new PackageManagerService -> DexManager.load -> DexManager.loadInternal -> PackageDexUsage.read
```

所以即使从注册 dex 到本次系统生命周期结束都没满足执行后台 dex 优化条件，但下次系统启动后，以前注册的 dex 还可以在满足执行条件时被优化。

`installd` 服务运行于 `installd` 守护进程中，该进程在系统启动时由 init 进程启动，并在启动时创建 `installd` 服务实例注册到 `ServiceManager` 中。`installd` 服务的 `dexopt` 接口经过如下调用过程后，最终会执行 dex2oat 命令。

```rust
InstalldNativeService::dexopt -> android::installd::dexopt -> run_dex2oat
```

经过以上分析，可以确定创建 `BaseDexClassLoader` 或其子类对象可以让动态加载的 dex 得到跟安装的应用一样的优化效果。

![](/images/jueJin/27c2b597997f788.png)

Android 10
----------

创建 `BaseDexClassLoader` 或其子类对象，在 Android 10 及以上系统中，依然能在系统执行后台 dex 优化时对动态加载的 dex 进行优化，但从 Android 10 开始，系统引入了 class loader context，要求必须创建 `PathClassLoader` 或 `DexClassLoader` 或 `DelegateLastClassLoader` 的对象，可以选择用 `PathClassLoader`。

```java
// frameworks/base/services/core/java/com/android/server/pm/dex/DexManager.java(android-10.0.0)
/*package*/ void notifyDexLoadInternal(ApplicationInfo loadingAppInfo,
List<String> classLoaderNames, List<String> classPaths, String loaderIsa,
    int loaderUserId) {
    // ...
    String[] classLoaderContexts = DexoptUtils.processContextForDexLoad(
    classLoaderNames, classPaths);
    // ...
        for (String dexPath : dexPathsToRegister) {
        // ...
            if (searchResult.mOutcome != DEX_SEARCH_NOT_FOUND) {
            // ...
                if (classLoaderContexts != null) {
                // ...
                if (mPackageDexUsage.record(searchResult.mOwningPackageName,
                dexPath, loaderUserId, loaderIsa, isUsedByOtherApps, primaryOrSplit,
                    loadingAppInfo.packageName, classLoaderContext)) {
                    mPackageDexUsage.maybeWriteAsync();
                }
            }
                } else {
                // ...
            }
            // ...
        }
    }
    
    // frameworks/base/services/core/java/com/android/server/pm/dex/DexoptUtils.java(android-10.0.0)
    /*package*/ static String[] processContextForDexLoad(List<String> classLoadersNames,
        List<String> classPaths) {
        // ...
            for (int i = 1; i < classLoadersNames.size(); i++) {
            if (!ClassLoaderFactory.isValidClassLoaderName(classLoadersNames.get(i))
                || classPaths.get(i) == null) {
                return null;
            }
            // ...
        }
        // ...
    }
    
    
        public static boolean isValidClassLoaderName(String name) {
        // This method is used to parse package data and does not accept null names.
        return name != null && (isPathClassLoaderName(name) || isDelegateLastClassLoaderName(name));
    }
```

从 Android 10 开始，创建 `DexFile` 对象不再会触发执行 dex2oat 命令，所以创建 `PathClassLoader` 对象已无法实现在初始时对 dex 进行基本优化。

同时，从 Android 10 开始，SELinux 增加了对应用执行 dex2oat 命令的限制，所以也无法通过 `ProcessBuilder` 或 `Runtime` 执行 dex2oat 命令来对 dex 进行基本优化。在 `file_contexts` 文件中定义了 dex2oat 工具的安全上下文，指定了只有拥有 dex2oat\_exec 的权限的进程才能执行 dex2oat。

```scss
# system/sepolicy/private/file_contexts(android-10.0.0)
/system/bin/dex2oat(d)?     u:object_r:dex2oat_exec:s0
```

在 `seapp_contexts` 文件中指定了不同 targetSdkVersion 对应的进程安全上下文类型，例如当应用的 targetSdkVersion 大于等于 29 时，其进程安全上下文类型为 untrusted\_app。

```ini
# system/sepolicy/private/seapp_contexts(android-10.0.0)
user=_app minTargetSdkVersion=29 domain=untrusted_app type=app_data_file levelFrom=all
user=_app minTargetSdkVersion=28 domain=untrusted_app_27 type=app_data_file levelFrom=all
user=_app minTargetSdkVersion=26 domain=untrusted_app_27 type=app_data_file levelFrom=user
user=_app domain=untrusted_app_25 type=app_data_file levelFrom=user
```

可通过 `ps -Z` 命令来查看进程的安全上下文，结果跟规则指定的一致：

*   targetSdkVersion = 28：`u:r:untrusted_app_27:s0:c101,c259,c512,c768`
*   targetSdkVersion = 29：`u:r:untrusted_app:s0:c101,c259,c512,c768`

不同进程安全上下文类型所拥有的权限定义在跟类型对应的文件中，与 targerSdkVersion 小于 29 的应用对应的权限规则文件中声明了应用进程有 dex2oat\_exec 类型的读和执行权限，而与 targerSdkVersion 大于等于 29 的应用对应的文件中没有对 dex2oat\_exec 类型的权限的声明，所以在 Android 10 及以上系统中，当应用的 targetSdkVersion 大于等于 29 时，无法在应用进程中执行 dex2oat 命令。

```scss
# system/sepolicy/private/untrusted_app_27.te(android-10.0.0)
# The ability to invoke dex2oat. Historically required by ART, now only
# allowed for targetApi<=28 for compat reasons.
allow untrusted_app_27 dex2oat_exec:file rx_file_perms;
userdebug_or_eng(`auditallow untrusted_app_27 dex2oat_exec:file rx_file_perms;')

# system/sepolicy/private/untrusted_app.te(android-10.0.0)
typeattribute untrusted_app coredomain;

app_domain(untrusted_app)
untrusted_app_domain(untrusted_app)
net_domain(untrusted_app)
bluetooth_domain(untrusted_app)
```

PMS 通过 aidl 提供了 `performDexOptSecondary` 接口，可对 secondary dex 进行优化，且能指定编译过滤器，可用来实现初始时的基本优化。该接口通过 `Binder` 的 shell command 方式对外暴露，调用过程如下：

```rust
Binder.onTransact -> Binder.shellCommand -> PackageManagerService.onShellCommand -> ShellCommand.exec -> PackageManagerShellCommand.onCommand -> PackageManagerShellCommand.runCompile -> PackageManagerService.performDexOptSecondary
```

所以可通过反射获取 PMS 的 `Binder` 接口实例，然后用对应的 transation code 来调 `Binder` 的 shell command 接口，传入调 `performDexOptSecondary` 接口所需的参数的方式来让 PMS 执行对 secondary dex 的优化。

```kotlin
    fun performDexOptSecondaryByShellCommand(context: Context) {
        runCatching {
        val pm = Class.forName("android.os.ServiceManager").getDeclaredMethod("getService", String::class.java).invoke(null, "package") as? IBinder
        var data: Parcel? = null
        var reply: Parcel? = null
        val lastIdentity = Binder.clearCallingIdentity()
            try {
            data = Parcel.obtain()
            reply = Parcel.obtain()
            data.writeFileDescriptor(FileDescriptor.`in`)
            data.writeFileDescriptor(FileDescriptor.out)
            data.writeFileDescriptor(FileDescriptor.err)
            val args = arrayOf("compile", "-f", "--secondary-dex", "-m", if (Build.VERSION.SDK_INT >= 31) "verify" else "speed-profile", context.packageName)
            data.writeStringArray(args)
            data.writeStrongBinder(null)
            ResultReceiver(Handler(Looper.getMainLooper())).writeToParcel(data, 0)
            val shellCommandTransaction: Int = '_'.toInt() shl 24 or ('C'.toInt() shl 16) or ('M'.toInt() shl 8) or 'D'.toInt()
            pm?.transact(shellCommandTransaction, data, reply, 0)
            reply.readException()
                } finally {
                reply?.recycle()
                data?.recycle()
                Binder.restoreCallingIdentity(lastIdentity)
            }
        }.onFailure { it.printStackTrace() }
    }
```

初始时对 dex 进行基本优化与应用安装对应，使用的编译过滤器也应保持一致，应用安装场景使用的编译过滤器由 `pm.dexopt.install` 系统属性指定，其值为 `speed-profile`，在 Android 12 及以上系统中，可用新引入的 `pm.dexopt.install-bulk-secondary` 属性的值 `verify`。

综上，可结合创建 `PathClassLoader` 对象和调 PMS 提供的 `performDexOptSecondary` 接口来对动态加载的 dex 进行效果跟安装的应用一样的优化。

![](/images/jueJin/f4c2a31771cd2f5.png)

小结
--

本文在分析系统相关实现的基础上，介绍了在 Android 5.0 以来的各系统版本中实现对动态加载的 dex 进行优化，使执行速度与安装的 APK 相当的方式：

1.  系统版本大于等于 5.0 且小于 8.0：使用 `DexFile.loadDex`
2.  系统版本大于等于 8.0 且小于 10：创建 `PathClassLoader` 对象
3.  系统版本大于等于 10：创建 `PathClassLoader` 对象，并通过 PMS `Binder` 的 shell command 调 `performDexOptSecondary` 接口

参考资料
----

*   [ART](https://link.juejin.cn?target=https%3A%2F%2Fsource.android.com%2Fdocs%2Fcore%2Fruntime%2Fconfigure "https://source.android.com/docs/core/runtime/configure")
*   [Android SELinux 概念](https://link.juejin.cn?target=https%3A%2F%2Fsource.android.com%2Fdocs%2Fsecurity%2Ffeatures%2Fselinux%2Fconcepts "https://source.android.com/docs/security/features/selinux/concepts")
*   Android 各版本源码

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！