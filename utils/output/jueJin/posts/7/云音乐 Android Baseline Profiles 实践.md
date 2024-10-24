---
author: "网易云音乐技术团队"
title: "云音乐 Android Baseline Profiles 实践"
date: 2024-07-09
description: "本文将从 Baseline Profiles 的工作方式出发，介绍主要面向国内市场且使用了加固和热修复技术的应用，在使用 Baseline Profiles 时面临的问题和解决方案。"
tags: ["Android中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读14分钟"
weight: 1
selfDefined:"likes:15,comments:0,collects:20,views:1412,"
---
> 本文作者：熊鋆洋

![](/images/jueJin/db52010a1ef8442.png)

Google 于 2022 年推出了 Baseline Profiles，通过在应用或库中分发基准配置文件，应用市场（Google Play）在安装应用时，使用配置文件进行引导式 AOT 编译来优化配置文件指定的代码路径，可让应用从首次运行起，提升启动和关键路径的性能，进而提高用户留存率、日活和平均回访率等业务指标。

然而，对于主要面向国内市场且使用了加固和热修复技术的应用，在使用 Baseline Profiles 时，会面临如下问题：

*   不是所有应用市场都支持在安装时用 APK 中的配置文件做引导式 AOT 编译
*   加固导致配置文件中记录的 dex 校验和（crc）检查失败
*   不会给热修复后运行的 dex 带来优化

下面将从 Baseline Profiles 的工作方式出发，探讨上述问题的解决方案。

工作方式
----

Baseline Profiles 的整体工作流程可分为三个部分：

1.  生成人类可读格式（HRF）的配置文件
2.  构建 APK 时，将 HRF 配置文件转换为二进制格式并写入 APK 中的 `assets/dexopt` 目录
3.  应用市场安装时，用 APK 中的配置文件进行 AOT 编译；或启动时，用 `ProfileInstaller` 将配置文件写入系统规定路径

生成配置文件通过 Macrobenchmark 库和 `BaselineProfileRule` 实现。首先重复执行开发者定义的关键路径，让 jit 将关键路径涉及的类和方法作为热代码记录下来；然后用 `profman` 工具将记录的热代码导出为 HRF 配置文件。将生成的配置文件命名为 `baseline-prof.txt` 置于 `src/main` 目录中，即可在构建 APK 时将其转换格式并写入 APK 中。

AGP 7 增加了 `MergeArtProfileTask` 和 `CompileArtProfileTask`，用于将应用和库中的 HRF 配置文件转换为二进制格式并写入 APK。在进行 release 构建时，`MergeArtProfileTask` 会将应用以及依赖的 aar 中的 `baseline-prof.txt` 合并写入构建中间产物 `merged_art_profile/${variant}/baseline-prof.txt` 中；之后，`CompileArtProfileTask` 会遍历 dex 文件，借助混淆映射文件，将其中存在于合并后配置文件中的方法索引、方法 HSP 标记和类型索引等信息记录下来，并以 Android P 版本的二进制格式写入到构建中间产物 `binary_art_profile/${variant}/baseline.prof` 和 `binary_art_profile_metadata/${variant}/baseline.profm` 中；最后在构建生成 APK 文件时，两个二进制中间产物文件会被写入 APK 的 `assets/dexopt` 目录中。

支持 Baseline Profiles 的应用市场（如 Google Play）在安装安装应用时，会抽取 APK 中的 `baseline.prof` 和 `baseline.profm` 文件，并用它们以 `speed-profile` 模式进行 AOT 编译。此外，官方提供的 profileinstaller 库会利用声明的 `ContentProvider`，在应用启动时，延时到第一帧后执行配置文件安装操作：

1.  根据应用安装时间，判断应用安装后是否有向系统写入配置文件，如没有，执行下面的步骤
2.  读取安装的 APK 中的配置文件，将其转码为当前系统版本对应的二进制格式
3.  将转码后的配置写到系统的 current profile 文件（`/data/misc/profiles/cur/0/${packageName}/primary.prof`）

整体如下图所示：

![](/images/jueJin/5655215090a4478.png)

主动优化
----

国内只有部分应用市场支持 Baseline Profiles，通过不支持的应用市场安装的用户无法享受首次运行即可提升性能的好处。虽然 profileinstaller 库会在首次启动时向系统写入配置文件，可以节省系统收集热代码的时间，但还是要等到满足条件，系统执行后台 dex 优化后，才能提升性能。

可通过在写入配置文件后，追加主动触发优化来尽可能加快主 dex（安装的 APK）优化进程，使性能尽快得到提升。然而，执行 dex 优化会占用较多资源，需采用合适的策略：

*   启动（首页内容显示）后 5 秒且应用在后台时执行，避免降低启动速度和增加卡顿
*   只在 dex 未优化时执行，避免资源浪费

![](/images/jueJin/76e9b696e03e4db.png)

profileinstaller 库在安装配置文件时，会获取并缓存用配置文件进行编译的状态，可以从 `ProfileVerifier` 获取编译状态来判断 dex 是否已优化。`ProfileVerifier` 根据系统在执行基于配置文件的编译后会生成 reference profile 文件（`/data/misc/profiles/ref/${packageName}/primary.prof`）来判断是否已编译，而在 Android P 和 R 上，应用没有权限访问 reference profile 文件，`ProfileVerifier` 会返回不支持该系统版本，所以对这些系统版本需通过其他方式判断是否已编译。系统在编译 APK 后会在安装的 APK 所在目录的子目录 `oat/${instructionSet}` 中生成 odex、vdex（Android O 及以上）和 art 文件，其中 odex 文件由于没权限无法访问，可通过比较其他两个文件的最后修改时间是否大于应用最后更新时间（`PackageInfo.lastUpdateTime`）来判断是否已编译。

主动触发主 dex 优化的方式有三种：

*   通过 PMS 以 `Binder` shell command 形式暴露的接口 `compile -f -m speed-profile ${packageName}`
*   通过 PMS 以 `Binder` shell command 形式暴露的接口 `bg-dexopt-job ${packageName}`，优化主 dex 和注册的 secondary dex
*   通过 PMS 的 AIDL 接口 `performDexOptMode`

前两种方式调 PMS `Binder` shell command 接口的方式可参考前文[《dex 优化编年史》](https://juejin.cn/post/7200956719979233335#heading-4 "https://juejin.cn/post/7200956719979233335#heading-4")最后的代码示例。第三种方式的接口调用方式跟前两者类似，不过需先从 `IPackageManager.Stub` 获取接口对应的 trascation code：`TRANSACTION_performDexOptMode`。

遗憾的是，从 Android 12 开始，系统在执行上述接口的过程中，增加了对调用者的限制，主动触发主 dex 优化会失效。例如，第一种方式的执行流程中会调 `PackageManagerService.performDexOptMode` 方法，它要求调用者必须是 SYSTEM、ROOT 或 SHELL，否则会抛异常。

```java
// frameworks/base/services/core/java/com/android/server/pm/PackageManagerService.java(android-12.0.0)
public boolean performDexOptMode(String packageName,
boolean checkProfiles, String targetCompilerFilter, boolean force,
    boolean bootComplete, String splitName) {
    enforceSystemOrRootOrShell("performDexOptMode");
    // ...
}

    private static void enforceSystemOrRootOrShell(String message) {
    final int uid = Binder.getCallingUid();
        if (uid != Process.SYSTEM_UID && uid != Process.ROOT_UID && uid != Process.SHELL_UID) {
        throw new SecurityException(message);
    }
}
```

加固
--

在构建 APK 过程中将 HRF 配置文件转换为二进制格式时，会写入 dex crc 信息。系统在执行基于配置文件的编译时，会检查配置文件记录的 dex crc 与安装的 APK 中对应 dex 的 crc 是否相等，不等不会执行编译。编译最终通过执行 `dex2oat` 命令来完成，其实现入口在 `dex2oat.cc` 中，在经过如下调用过程后对 dex 中的热方法进行编译：

```arduino
Dex2oat
DoCompilation
Compile
CompileDexFiles
CompilerDriver::CompileAll
CompilerDriver::Compile
CompileDexFile
CompileMethodQuick
CompileMethodHarness
```

在上面调用过程的 `Dex2oat` 函数中，会在调 `DoCompilation` 执行编译前，调 `VerifyProfileData` 校验配置文件：遍历配置文件记录的 dex 信息，比较记录的 dex crc 以及方法和类型数是否跟安装的 APK 中同名 dex 的对应信息相等。但此时若校验不通过，只是打印错误日志，不会中止编译。

```c++
// art/dex2oat/dex2oat.cc(android-13.0.0)
    static dex2oat::ReturnCode Dex2oat(int argc, char** argv) {
    // ...
        if (dex2oat->DoProfileGuidedOptimizations()) {
        dex2oat->VerifyProfileData();
    }
    // ...
}

    bool VerifyProfileData() {
    return profile_compilation_info_->VerifyProfileData(compiler_options_->dex_files_for_oat_file_);
}

// art/libprofile/profile/profile_compilation_info.cc(android-13.0.0)
    bool ProfileCompilationInfo::VerifyProfileData(const std::vector<const DexFile*>& dex_files) {
    // ...
        for (const std::unique_ptr<DexFileData>& dex_data : info_) {
        // ...
            if (!ChecksumMatch(dex_data->checksum, dex_file->GetLocationChecksum())) {
            LOG(ERROR) << "Dex checksum mismatch while verifying profile "
            << "dex location " << dex_location << " (checksum="
            << dex_file->GetLocationChecksum() << ", profile checksum="
            << dex_data->checksum;
            return false;
        }
        
        if (dex_data->num_method_ids != dex_file->NumMethodIds() ||
            dex_data->num_type_ids != dex_file->NumTypeIds()) {
            LOG(ERROR) << "Number of type or method ids in dex file and profile don't match."
            << "dex location " << dex_location
            << " dex_file.NumTypeIds=" << dex_file->NumTypeIds()
            << " .v dex_data.num_type_ids=" << dex_data->num_type_ids
            << ", dex_file.NumMethodIds=" << dex_file->NumMethodIds()
            << " v. dex_data.num_method_ids=" << dex_data->num_method_ids;
            return false;
        }
        // ...
    }
    return true;
}
```

在上面调用过程最后的 `CompileMethodHarness` 函数中，会调在 `CompileMethodQuick` 中创建并传入的 lambda 表达式 `quick_fn`，其中会调 `ShouldCompileBasedOnProfile` 来决定是否执行方法编译。

```c++
// art/dex2oat/driver/compiler_driver.cc(android-13.0.0)
static void CompileMethodQuick(
Thread* self,
CompilerDriver* driver,
const dex::CodeItem* code_item,
uint32_t access_flags,
InvokeType invoke_type,
uint16_t class_def_idx,
uint32_t method_idx,
Handle<mirror::ClassLoader> class_loader,
const DexFile& dex_file,
Handle<mirror::DexCache> dex_cache,
    ProfileCompilationInfo::ProfileIndexType profile_index) {
    auto quick_fn = [profile_index]([[maybe_unused]] Thread* self,
    CompilerDriver* driver,
    const dex::CodeItem* code_item,
    uint32_t access_flags,
    InvokeType invoke_type,
    uint16_t class_def_idx,
    uint32_t method_idx,
    Handle<mirror::ClassLoader> class_loader,
    const DexFile& dex_file,
        Handle<mirror::DexCache> dex_cache) {
        // ...
            if ((access_flags & kAccNative) != 0) {
            // ...
                } else if ((access_flags & kAccAbstract) != 0) {
                // Abstract methods don't have code.
                } else if (annotations::MethodIsNeverCompile(dex_file,
                dex_file.GetClassDef(class_def_idx),
                    method_idx)) {
                    // Method is annotated with @NeverCompile and should not be compiled.
                        } else {
                        // ...
                        compile = compile && ShouldCompileBasedOnProfile(compiler_options, profile_index, method_ref);
                        
                            if (compile) {
                            // NOTE: if compiler declines to compile this method, it will return null.
                            compiled_method = driver->GetCompiler()->Compile(code_item,
                            access_flags,
                            invoke_type,
                            class_def_idx,
                            method_idx,
                            class_loader,
                            dex_file,
                            dex_cache);
                            // ...
                        }
                    }
                    return compiled_method;
                }
            }
```

在 `CompileDexFile` 函数中会调 `FindDexFile` 获取 `profile_index`，然后经由 `CompileMethodQuick` 传入 `ShouldCompileBasedOnProfile`。`profile_index` 需从通过 `ProfileCompilationInfo::FindDexDataUsingAnnotations` 获取的 `DexFileData` 对象得到，当配置文件记录的 dex crc 与安装的 APK 中同名 dex 的 crc 不等时，得到的 `DexFileData` 为空，进而得到的 `profile_index` 为 `MaxProfileIndex()`，从而使 `ShouldCompileBasedOnProfile` 返回 `false`，导致方法编译不会执行。

```c++
// art/dex2oat/driver/compiler_driver.cc(android-13.0.0)
static void CompileDexFile(CompilerDriver* driver,
jobject class_loader,
const DexFile& dex_file,
const std::vector<const DexFile*>& dex_files,
ThreadPool* thread_pool,
size_t thread_count,
TimingLogger* timings,
const char* timing_name,
    CompileFn compile_fn) {
    // ...
    ProfileCompilationInfo::ProfileIndexType profile_index = (have_profile && use_profile)
    ? compiler_options.GetProfileCompilationInfo()->FindDexFile(dex_file)
    : ProfileCompilationInfo::MaxProfileIndex();
    // ...
}

// art/libprofile/profile/profile_compilation_info.h(android-13.0.0)
ProfileIndexType FindDexFile(
const DexFile& dex_file,
    const ProfileSampleAnnotation& annotation = ProfileSampleAnnotation::kNone) const {
    const DexFileData* data = FindDexDataUsingAnnotations(&dex_file, annotation);
    return (data != nullptr) ? data->profile_index : MaxProfileIndex();
}

// art/libprofile/profile/profile_compilation_info.cc(android-13.0.0)
const ProfileCompilationInfo::DexFileData* ProfileCompilationInfo::FindDexDataUsingAnnotations(
const DexFile* dex_file,
    const ProfileSampleAnnotation& annotation) const {
        if (annotation == ProfileSampleAnnotation::kNone) {
        std::string_view profile_key = GetProfileDexFileBaseKeyView(dex_file->GetLocation());
            for (const std::unique_ptr<DexFileData>& dex_data : info_) {
                if (profile_key == GetBaseKeyViewFromAugmentedKey(dex_data->profile_key)) {
                    if (!ChecksumMatch(dex_data->checksum, dex_file->GetLocationChecksum())) {
                    return nullptr;
                }
                return dex_data.get();
            }
        }
            } else {
            // ...
        }
        
        return nullptr;
    }
    
    // art/dex2oat/driver/compiler_driver.cc(android-13.0.0)
    static bool ShouldCompileBasedOnProfile(const CompilerOptions& compiler_options,
    ProfileCompilationInfo::ProfileIndexType profile_index,
        MethodReference method_ref) {
            if (profile_index == ProfileCompilationInfo::MaxProfileIndex()) {
            // ...
            return false;
                } else {
                // ...
            }
        }
```

另外，在虚拟机启动后，经如下调用过程，jit 会通过 `ProfileSaver` 创建线程不断从 jit 代码缓存获取并处理热代码信息，然后保存到配置文件中，此时也会检查 dex crc，不匹配则清空配置文件。

```arduino
Runtime::Start
Runtime::RegisterAppInfo
Jit::StartProfileSaver
ProfileSaver::Start
ProfileSaver::RunProfileSaverThread
ProfileSaver::Run
ProfileSaver::ProcessProfilingInfo
```

在 `ProfileSaver::ProcessProfilingInfo` 中会调 `ProfileCompilationInfo::AddMethods` 向配置信息中添加 jit 记录的热方法，添加失败则清除配置信息，进而导致之后保存到配置文件时，清空配置文件。

```c++
// art/runtime/jit/profile_saver.cc(android-13.0.0)
bool ProfileSaver::ProcessProfilingInfo(
bool force_save,
bool skip_class_and_method_fetching,
    /*out*/uint16_t* number_of_new_methods) {
    // ...
        for (const auto& it : tracked_locations) {
        // ...
            {
            // ...
            if (!info.AddMethods(
            profile_methods,
            AnnotateSampleFlags(Hotness::kFlagHot | Hotness::kFlagPostStartup),
                GetProfileSampleAnnotation())) {
                LOG(WARNING) << "Could not add methods to the existing profiler. "
                << "Clearing the profile data.";
                info.ClearData();
                force_save = true;
            }
            // ...
        }
    }
    // ...
}
```

在 `ProfileCompilationInfo::AddMethods` 的执行过程中，经如下调用过程，在 `ProfileCompilationInfo::GetOrAddDexFileData` 中会检查 dex crc，不等返回空，导致 `ProfileCompilationInfo::AddMethods` 返回 `false`。

```arduino
ProfileCompilationInfo::AddMethods
ProfileCompilationInfo::AddMethod
GetOrAddDexFileData
ProfileCompilationInfo::GetOrAddDexFileData
``````c++
// art/libprofile/profile/profile_compilation_info.cc(android-13.0.0)
ProfileCompilationInfo::DexFileData* ProfileCompilationInfo::GetOrAddDexFileData(
const std::string& profile_key,
uint32_t checksum,
uint32_t num_type_ids,
    uint32_t num_method_ids) {
    // ...
        if (result->checksum != checksum) {
        LOG(WARNING) << "Checksum mismatch for dex " << profile_key;
        return nullptr;
    }
    // ...
}
```

所以，如果 profileinstaller 向系统写入的配置文件中记录的 dex crc 与安装的 APK 中对应 dex 的 crc 不等，写入的配置文件将被清空，并在 logcat 中看到如下日志。

```csharp
W  Checksum mismatch for dex base.apk!classes10.dex
W  Could not add methods to the existing profiler. Clearing the profile data.
```

云音乐使用的加固是定制的轻量级加固，有如下特点：

*   不会修改原 dex
*   插入一个 dex 作为 classes.dex，并将原 dex 名的序号加 1：classes.dex -> classes2.dex，classes2.dex -> classes3.dex，...

由于加固是在构建生成 APK 之后，修改 dex 名会导致 APK 中配置文件记录的 dex crc 与 APK 中同名 dex 的 crc 不等，无法执行基于配置文件的编译。可以在构建流程的加固步骤后，增加修正 APK 中配置文件记录的 dex 名步骤，来解决 dex crc 检查失败问题。由于 APK 中的配置文件是二进制格式的，所以需先从中解析出 dex 名与 crc、方法 id 和方法 HSP 标记等信息，然后在修正 dex 名后按原来的格式写回到配置文件中，这需要了解配置文件的编码方式并实现编解码功能；而 AGP 中的 `ArtProfile` 已提供二进制配置文件的读写功能，为了利用 AGP 中的代码，可编写一个 gradle task 来实现 dex 名修正。该 task 的工作流程如下：

1.  解压加固后 APK
2.  使用 `ArtProfile` 读取 `baseline.prof` 和 `baseline.profm` 文件，遍历读取到的 dex 信息并修改 dex 名，将修改后的信息写回配置文件
3.  压缩生成 APK 文件

增加 dex 修正步骤后，整体构建流程如下：

![](/images/jueJin/fd3ff6389c99453.png)

在解压 APK 文件时，需将各文件的压缩方法记录下来，以便重新压缩生成 APK 文件时，使每个文件保持原来的压缩方式；为了避免 APK 体积增大，压缩工具也要跟之前保持一致。

热修复
---

热修复后运行的 dex 不再是安装的 APK 中的 dex，而是补丁 dex 跟 APK 中原 dex 合成后的新 dex，所以用于加快 APK 编译进程的 Baseline Profiles 无法为热修复场景带来性能提升。

一次热修复包含三个阶段：

1.  补丁构建：基于修复后代码构建新 APK，然后计算其与旧 APK 的差量来构建补丁包
2.  补丁合成：将下载到的补丁包中的资源、dex 和 so 等跟安装的 APK 中对应的文件合成为完整文件
3.  补丁应用：替换运行时使用的资源、dex 和 so 等为合成后的文件

在补丁合成阶段，会采用[《dex 优化编年史》](https://juejin.cn/post/7200956719979233335#heading-4 "https://juejin.cn/post/7200956719979233335#heading-4")所述方式触发系统对合成后的 dex 进行优化，但在 Android 8.0 及以上系统中，由于没有配置信息，只能做基本优化，不能对关键路径进行优化。当系统将合成后 dex 作为 secondary dex 进行优化时，也会读对应的配置文件来优化指定的代码路径，所以可以在触发优化前，将配置信息写入配置文件，来实现提升首次应用补丁时的关键路径性能。

要写配置文件，首先需明确合成后 dex 对应的配置文件路径。在触发 dex 优化时，会通过创建 `BaseDexClassLoader` 对象向系统注册 dex 使用信息以及配置文件，使系统能获取 dex 信息进行优化，以及记录 dex 中的方法执行信息。注册配置文件时，如果配置文件不存在，则会创建文件，从如下系统实现可知其路径为：

*   android 8.0：`${dexPath}.prof`
*   android 8.1 及以上：`${dexParentPath}/oat/${dexFileName}.cur.prof`

```java
// frameworks/base/core/java/android/app/DexLoadReporter.java(android-8.0)
    private void registerSecondaryDexForProfiling(String dexPath, String[] dataDirs) {
    // ...
    File secondaryProfile = getSecondaryProfileFile(dexPath);
        try {
        // ...
        boolean created = secondaryProfile.createNewFile();
        // ...
            } catch (IOException ex) {
            // ...
            return;
        }
        // ...
    }
    
        private File getSecondaryProfileFile(String dexPath) {
        return new File(dexPath + ".prof");
    }
``````java
// frameworks/base/core/java/android/app/DexLoadReporter.java(android-8.1)
    private void registerSecondaryDexForProfiling(String dexPath, String[] dataDirs) {
    // ...
    File realDexPath;
        try {
        // ...
        realDexPath = new File(Libcore.os.realpath(dexPath));
            } catch (ErrnoException ex) {
            // ...
            return;
        }
        
        // NOTE: Keep this in sync with installd expectations.
        File secondaryProfileDir = new File(realDexPath.getParent(), "oat");
        File secondaryProfile = new File(secondaryProfileDir, realDexPath.getName() + ".cur.prof");
        
        // ...
            if (!secondaryProfileDir.exists()) {
                if (!secondaryProfileDir.mkdir()) {
                // ...
                return;
            }
        }
        
            try {
            boolean created = secondaryProfile.createNewFile();
            // ...
                } catch (IOException ex) {
                // ...
                return;
            }
            // ...
        }
```

另一个关键点是保证写入正确的配置信息。虽然合成后 dex 的代码执行逻辑跟新 APK 一样，但其文件内容可能跟新 APK 中对应 dex 不一致，即 crc 不等，从而出现上节提到的 crc 校验失败，编译不执行的问题。这就需要在补丁构建阶段中的生成 dex 补丁步骤最后增加配置信息更新操作，以及生成资源补丁步骤最后增加保存更新后配置信息并重新生成配置文件补丁的操作：

1.  在构建新 APK 时，将 HRF 配置文件和混淆映射文件保存下来，以便在后续的配置文件更新操作中生成配置信息
2.  在生成 dex 补丁最后，对发生变化的 dex 基于合成后 dex 重新创建配置信息，然后读取新 APK 中二进制配置文件并替换其中变化 dex 的配置信息
3.  在生成资源补丁最后，将更新后的配置信息以二进制格式写回新 APK 解压目录中的配置文件中，然后针对配置文件重新生成补丁

在生成 dex 补丁步骤中，会用生成的补丁跟旧 dex 文件合成，然后校验合成结果跟新 dex 的类信息是否相同，创建合成后 dex 的配置信息时，可以利用这里已合成的文件。从 HRF 配置文件、混淆映射文件和 dex 文件创建配置信息，以及读写二进制配置文件功能，AGP 中的 `ArtProfile` 都有实现，可直接使用 AGP 库。

从补丁构建阶段修正配置信息，到补丁合成阶段向合成后 dex 对应的配置文件写入配置信息，并触发配置文件引导式 AOT 编译的整体流程如下：

![](/images/jueJin/ddf88e2f62c8412.png)

小结
--

本文先介绍了 Baseline Profiles 的工作方式，在此基础上探讨了面临的三个问题的解决方案：

*   国内只有部分应用市场支持 Baseline Profiles：追加主动触发优化来尽可能加快优化进程
*   加固插入 dex 导致 crc 校验失败，不执行编译：修正加固后 APK 种配置文件记录的 dex 名
*   对热修复后运行的 dex 无效：在补丁合成阶段触发 dex 优化前，将配置信息写入合成后 dex 对应的配置文件

云音乐在解决了上述问题，使 Baseline Profiles 按预期方式工作后，启动性能得到了明显提升：

*   应用市场支持时提升了约 **31%**；整体提升了约 **6%**，且会随着支持的应用市场的增加而进一步提升
*   热修复后提升了约 **12%**

参考资料
----

*   [基准配置文件概览](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.com%2Ftopic%2Fperformance%2Fbaselineprofiles%2Foverview "https://developer.android.com/topic/performance/baselineprofiles/overview")
*   [创建基准配置文件](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.com%2Ftopic%2Fperformance%2Fbaselineprofiles%2Fcreate-baselineprofile "https://developer.android.com/topic/performance/baselineprofiles/create-baselineprofile")
*   [dex 优化编年史](https://juejin.cn/post/7200956719979233335#heading-4 "https://juejin.cn/post/7200956719979233335#heading-4")
*   Android 各版本源码

最后
--

![](/images/jueJin/78401e82293d42e.png) 更多岗位，可进入网易招聘官网查看 [hr.163.com/](https://link.juejin.cn?target=https%3A%2F%2Fhr.163.com%2F "https://hr.163.com/")