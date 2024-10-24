---
author: ""
title: "云音乐iOS端代码静态检测实践"
date: 2022-11-07
description: "随着项目的扩大，依靠纯人工 Code Review 来保障代码质量、防止代码劣化变得”力不从心“。此时有必要借助代码静态分析能力，提升项目可持续发展所需要的自动化水平。"
tags: ["iOS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读13分钟"
weight: 1
selfDefined:"likes:53,comments:4,collects:86,views:7398,"
---
> 图片来自：[unsplash.com](https://link.juejin.cn?target=https%3A%2F%2Funsplash.com "https://unsplash.com")  
> 本文作者：尘心

一、前言
----

随着项目的扩大，依靠纯人工 Code Review 来保障代码质量、防止代码劣化变得”力不从心“。此时有必要借助代码静态分析能力，提升项目可持续发展所需要的自动化水平。针对 C、Objective-C 主流的静态分析开源项目包括：Clang Static Analyzer、Infer、OCLint 等。它们各自特点如下：

![对比图](/images/jueJin/b0e6c95fd624872.png)

结合以上分析和对实际应用中可定制性的强烈诉求，最终我们选择了可定制性最强的 OCLint 作为代码静态检测工具。接下来将从以下四点介绍 OCLint 的实践应用过程：

1.  OCLint 环境部署、编译和分析。
2.  自定义规则实现。
3.  静态检测耗时优化。
4.  利用静态检测能力持续对启动性能防劣化控制。

二、OCLint 简介
-----------

上面有对 OCLint 做一个简单介绍，具体来看其总体结构如下：

![oclint结构](/images/jueJin/feaf9563e022c63.png)

**Core Module**：是 OCLint 的引擎。它会将任务按顺序分配给其他模块，驱动整个分析过程，并生成输出报告。

**Metrics Module**：是一个独立的库。这个模块实际上不依赖于任何其他 OCLint 模块。意思是我们也可以在其他代码检测项目中单独使用这个模块。

**Rules Module**：OCLint 是一个基于规则的工具。规则就是动态库，可以在运行时轻松加载到系统中，基于此 OCLint 拥有很强的可扩展性。此外，通过遵循开/闭原则，OCLint 可通过动态加载扩展规则而不用修改或重新编译自身，所有规则都作为 RuleBase 的子类实现。

**Reporters Module**：在分析完成后，对于检测到的每一个问题，我们都知道节点的详细信息、规则、诊断信息。Reporters 将获取这些信息，并将其转换为可读的报告。

三、环境部署
------

### 3.1 OCLint

```bash
brew tap oclint/formulae
brew install oclint
```

上述方法是官方推荐，但安装的版本并不是最新的，这里建议使用`brew install --cask oclint`安装最新版本。

### 3.2 xcpretty

是一个格式化 xcodebuild 输出的工具。

`gem install xcpretty`

四、输出编译产物
--------

环境安装好后，接下来就可以 clone 工程，准备好**全源码**编译环境。通过 xcodebuild 与 xcpretty 格式化输出编译产物。

在工程目录下通过终端执行：

`xcodebuild -workspace "${project_name}.xcworkspace" -scheme ${scheme} -destination generic/platform=iOS -configuration Debug COMPILER_INDEX_STORE_ENABLE=NO | xcpretty -r json-compilation-database -o compile_commands.json`

五、Clang 简介
----------

由于 OCLint 基于 Clang Tooling，可以简单的理解为对 Clang Tooling 做了一层封装，其核心能力是对 Clang AST 进行分析，统计出所有违反规则的代码信息，并输出分析报告。所以在使用 OCLint 做静态分析之前，理解 Clang 将大有裨益。

既然核心能力是分析 Clang AST，那么 Clang AST 到底是什么样子的，让我们一起来看看。

### 5.1 Clang AST

Clang AST 是编译前端的中间产物，发生在词法分析之后的语法分析阶段。一个 AST 节点表示声明、语句、类型，因此，有三个表示 AST 的核心类：Decl、Stmt、Type。在 Clang 中，每个语言结构都必须继承上述核心类之一。

让我们来看一个简单的 AST 示例：

```arduino
#include "test.hpp"

    int f(int x) {
    int result = (x / 42);
    return result;
}
```

在工程目录下执行 `clang -Xclang -ast-dump -fsyntax-only test.cpp`，输出 AST:

```arduino
TranslationUnitDecl 0x7f7cb3040408 <<invalid sloc>> <invalid sloc>
|-TypedefDecl 0x7f7cb3040c70 <<invalid sloc>> <invalid sloc> implicit __int128_t '__int128'
| `-BuiltinType 0x7f7cb30409d0 '__int128'
...
`-FunctionDecl 0x7f7cb4823f78 <test.cpp:3:1, line:6:1> line:3:5 f 'int (int)'
|-ParmVarDecl 0x7f7cb4823ee0 <col:7, col:11> col:11 used x 'int'
`-CompoundStmt 0x7f7cb4824198 <col:14, line:6:1>
|-DeclStmt 0x7f7cb4824138 <line:4:3, col:24>
| `-VarDecl 0x7f7cb4824038 <col:3, col:23> col:7 used result 'int' cinit
|   `-ParenExpr 0x7f7cb4824118 <col:16, col:23> 'int'
|     `-BinaryOperator 0x7f7cb48240f8 <col:17, col:21> 'int' '/'
|       |-ImplicitCastExpr 0x7f7cb48240e0 <col:17> 'int' <LValueToRValue>
|       | `-DeclRefExpr 0x7f7cb48240a0 <col:17> 'int' lvalue ParmVar 0x7f7cb4823ee0 'x' 'int'
|       `-IntegerLiteral 0x7f7cb48240c0 <col:21> 'int' 42
`-ReturnStmt 0x7f7cb4824188 <line:5:3, col:10>
`-ImplicitCastExpr 0x7f7cb4824170 <col:10> 'int' <LValueToRValue>
`-DeclRefExpr 0x7f7cb4824150 <col:10> 'int' lvalue Var 0x7f7cb4824038 'result' 'int'
```

顶层的 AST 节点是 TranslationUnitDecl。它是其它所有 AST 节点的根，代表整个翻译单元。FunctionDecl 是函数声明，CompoundStmt 包含了其他的语句和表达式。 下图是它的 AST 的图形视图：

![clang-ast](/images/jueJin/8dba59548822d29.png)

### 5.2 遍历解析 Clang AST

这里我们可以通过官方教程 [《How to write RecursiveASTVisitor based ASTFrontendActions》](https://link.juejin.cn?target=https%3A%2F%2Fclang.llvm.org%2Fdocs%2FRAVFrontendAction.html "https://clang.llvm.org/docs/RAVFrontendAction.html") 来了解这一过程。内容很详细，就不过多赘述了，大致流程如下图：

![prase-ast](/images/jueJin/6e5163050425a17.png)

六、OCLint 代码静态分析与输出
------------------

### 6.1 OCLint 如何工作？

上面我们拿到了编译产物 compile\_commands.json 文件，并简单了解了 Clang AST 的遍历解析过程，那 OCLint 是如何工作的呢？我们不妨从 OCLint 源码入手，窥探一二。

下面是 `oclint/oclint-driver/main.cpp` 入口文件的 main() 函数：

```scss
int main(int argc, const char **argv)
    {
    llvm::cl::SetVersionPrinter(oclintVersionPrinter);
    //构造 parser
    auto expectedParser = CommonOptionsParser::create(argc, argv, OCLintOptionCategory);
    if (!expectedParser)
        {
        llvm::errs() << expectedParser.takeError();
        return COMMON_OPTIONS_PARSER_ERRORS;
    }
    CommonOptionsParser &optionsParser = expectedParser.get();
    oclint::option::process(argv[0]);
    
    //准备工作  检查rule & reporter
    int prepareStatus = prepare();
    if (prepareStatus)
        {
        return prepareStatus;
    }
    
    //筛选 rule
    if (oclint::option::showEnabledRules())
        {
        listRules();
    }
    
    //构造 analyzer & driver
    oclint::RulesetBasedAnalyzer analyzer(oclint::option::rulesetFilter().filteredRules());
    oclint::Driver driver;
    
    //开始分析
    try
        {
        driver.run(optionsParser.getCompilations(), optionsParser.getSourcePathList(), analyzer);
    }
    catch (const exception& e)
        {
        printErrorLine(e.what());
        return ERROR_WHILE_PROCESSING;
    }
    
    //得到分析结果 & 输出报告
    std::unique_ptr<oclint::Results> results(std::move(getResults()));
    
    try
        {
        ostream *out = outStream();
        reporter()->report(results.get(), *out);
        disposeOutStream(out);
    }
    catch (const exception& e)
        {
        printErrorLine(e.what());
        return ERROR_WHILE_REPORTING;
    }
    
    //退出程序
    return handleExit(results.get());
}
```

看完这个函数我想你应该对 OCLint 分析流程一目了然，关于更多实现细节，建议仔细阅读源码。

### 6.2 使用默认规则分析

在 `compile_commands.json` 文件所在目录下执行：(`oclint-json-compilation-database` 是一个帮助程序，可以简化我们执行 OCLint 程序。)

`oclint-json-compilation-database --verbose -report-type html -o oclint.html -max-priority-1 100000 -max-priority-2 100000 -max-priority-3 100000`

> **注意：** 执行成功会返回 0，除此之外意味着失败。例如，当编译失败时，返回 3；当违规数量大于阀值时，返回 5；当源代码有错误时，返回 6；

没错，分析失败了。我们来看看原因：

`oclint: error: Cannot change dictionary into "${本地文件路径，含中文或者特殊字符}", please make sure the directory exists and you have permission to access!`

从提示看可能是权限问题，然而并不是。根因是文件路径中包含了中文或特殊字符。想到类似存量问题可能还有很多，写了个脚本扫描一下，具体实现如下：

```ini
import os

rootdir=os.getcwd()
if not os.path.isdir(rootdir+'/logout'):
os.makedirs(rootdir + '/logout')
logPath=os.path.abspath('logout')
file_nonstandard_info=open(logPath+'/non_standard_filename.txt','w')
file_nonstandard_dirname=open(logPath+'/non_standard_dirname.txt','w')

nor_source_file=['png', 'pdf', 'json', 'jpg', 'webp', 'jpeg', 'gif', 'mp3'] #通用资源类型

symbolList=[]   #符号库

def initSymbolList():
# 标准的符号库
num="0123456789"
word="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
sym="_-+. "
for key in word:
symbolList.append(key)

for key in num:
symbolList.append(key)

for key in sym:
symbolList.append(key)

def runCheck():
for parent,dirnames,filenames in os.walk(this_folder):
for dirname  in dirnames:
if (dirname[0] == '.'):
continue
dirpath = parent+"/"+dirname
totalDirList=[]
for value in dirname:
totalDirList.append(value)
if not set(totalDirList).issubset(symbolList):
file_nonstandard_dirname.write(dirpath+'\n')
for filename in filenames:
if filename.find(".") == -1:
continue
#过滤资源文件
if set([filename.split(".")[-1]]).issubset(nor_source_file):
continue
totalList=[];
tempFilename = filename[0:filename.index('.')]
filepath = parent+"/"+filename
for value in tempFilename:
totalList.append(value)
# 判断文件名是否规范
if not set(totalList).issubset(symbolList):
file_nonstandard_info.write(filepath + '\n')

this_folder = input("需要检测的文件路径：").replace("\",'/')
initSymbolList()
runCheck()

```

针对上述问题，建议后续做 MR 卡口，防止类似新增问题出现。

上述问题解决后，retry，新问题又来了。

`Traceback (most recent call last): File "/usr/local/bin/oclint-json-compilation-database", line 86, in <module> exit_code = subprocess.call(oclint_arguments) File "/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.8/lib/python3.8/subprocess.py", line 340, in call with Popen(*popenargs, **kwargs) as p: File "/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.8/lib/python3.8/subprocess.py", line 858, in __init__ self._execute_child(args, executable, preexec_fn, close_fds, File "/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.8/lib/python3.8/subprocess.py", line 1704, in _execute_child raise child_exception_type(errno_num, err_msg, err_filename) OSError: [Errno 7] Argument list too long: '/usr/local/bin/oclint`

看最后一行，意思是 compile\_commands.json 文件太大了。幸运的是，找到了推荐的解法 - [《oclint\_argument\_list\_too\_long\_solution》](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fwuwen1030%2Foclint_argument_list_too_long_solution "https://github.com/wuwen1030/oclint_argument_list_too_long_solution")。大概的思路是，把 compile\_commands.json 文件分割成 n 个小 json 文件，然后循环解析得到 n 个解析结果，最后把所有的结果合并成一个大的 oclint.xml。 整体流程如下：

![oclintsplit](/images/jueJin/90f229cbba9c211.png)

现在 OCLint 分析链路算是初步完成了，默认规则包含的内容非常多，通过分析结果你可以知道项目代码中有哪些问题，后续可根据分析报告优化代码，提高代码质量、减少代码缺陷，例如 ObjCVerifyMustCallSuperRule 可以检测出哪些地方没有调用 super 函数。

但有时候你并不想 care 所有的规则，比如命名规范，函数名超长等规则你可能想忽略它们。此时可以通过 `-disable-rule` 忽略它们。同时针对特定需求，默认规则可能无法满足我们的诉求，此时就需要自定义规则了。

七、如何自定义规则？
----------

这里可以参考 [OCLint Documentation](https://link.juejin.cn?target=https%3A%2F%2Freadthedocs.org%2Fprojects%2Foclint-docs%2Fdownloads%2Fpdf%2Fv20.11%2F "https://readthedocs.org/projects/oclint-docs/downloads/pdf/v20.11/")，内容非常详尽。但需要注意以下两点：

1.  clone 下来的源码版本需要与 Homebrew 安装的版本对齐，不然会因版本兼容问题无法使用。
2.  为了兼容 M1，编译动态库时需要加上 arm64。

编写自定义规则前，我们可以先熟悉下已有的规则，可以帮助我们更快更好的掌握。

举个例子，在进行 App 启动过耗时分析时，+load 和 App 启动相关生命周期方法耗时影响占有一定比重，现在我们需要检测出项目中所有的 +load 和 App 启动相关生命周期方法，以便我们改进和优化它们，该如何实现呢？

### 7.1 +load 规则实现

关键代码如下：

```csharp
class ObjCVerifyLoadCallRule : public AbstractASTVisitorRule<ObjCVerifyLoadCallRule>
    {
    public:
    ...
    //规则优先级
    virtual int priority() const override
        {
        return priority; //把priority替换成你想要的优先级，如 3
    }
    
    //override 该方法，这里可以拿到所有的 OC 方法，我们在此写逻辑，找出 +load 方法
    bool VisitObjCMethodDecl(ObjCMethodDecl *node)
        {
        string selectorName = node->getSelector().getAsString(); //拿到方法名
        if (node->isClassMethod() && selectorName == "load") { // 判断是 +load 方法
        string desc = "xxx(替换成描述文案)";
        //把该节点加到违规集合中
        addViolation(node, this, desc);
        return false;
    }
    return true;
}
}
```

同理，可以完成检测 App 启动相关生命周期方法的 Rule。

规则编写完成后，编译生成动态库，复制到 OCLint 的规则路径下 `/usr/local/Caskroom/oclint/22.02/oclint-22.02/lib/oclint/rules`。

![oclintrulse](/images/jueJin/1a26a4aa0202f31.png)

此时我们可以用`oclint -list-enabled-rules x`命令简单的验证一下规则是否可用，接下来我们拿自定义的规则分析试试。

### 7.2 指定 Rule 分析

关键代码如下：

```ini
def lint(out_file):
lint_command = '''oclint-json-compilation-database -- \
--verbose \
-rule ObjCVerifyLoadCall \
-rule NEModuleHubLaunch \
-enable-global-analysis \
-max-priority-{替换成自定义的priority}=100000 \
--report-type pmd \
-o %s''' % (out_file)
os.system(lint_command)
```

我们指定了 ObjCVerifyLoadCall 和 NEModuleHubLaunch 两个自定义规则，之后按照上述流程就可以轻松搞定了。 但因为云音乐工程编译产物特别大，导致运行一次完整 OCLint 的时间约 6 个小时。It's too long！该如何优化呢？

八、完整分析耗时优化
----------

梳理流程我们发现耗时主要是以下两个地方：

1.  通过 xcodebuild 与 xcpretty 格式化输出编译产物，50 分钟左右。
2.  分析编译产物 compile\_commands.json，5 个小时左右。

我们来思考下分析编译产物时有没有优化的空间呢？ 不难发现，上面解决编译产物大的问题时，通过把大 json，分割成了 n 个小 json，最后循环解析得到各自的分析结果。那么我们是不是可以利用多线程/进程的方式，来减少分析时间呢？答案显而易见。

接下来通过优化脚本，先尝试用多线程方案去现实，结果命令脚本确实多线程同时触发了，但是 OCLint 分析依然是 one by one，无奈只能改成多进程的方式。

关键代码如下：

```python
def subProcessLint():
manager = Manager()
list = manager.list(lintpy_files) #用于进程间数据同步
sub_p = []
for i in range(process_count):
process_name = 'Process------%02d' %(i+1)
p = Process(target=lint_subProcess, args=(process_name, list))
sub_p.append(p)
p.start()
for p in sub_p:
p.join()

def lint_subProcess(name, files):
while len(files)>0:
print('process name is ', name)
lint_command = files[0]
files.remove(lint_command)
start_time = time.time()
print('before lint:', lint_command)
os.system(r'python3 %s' %lint_command)
print("lint time:",time.time()-start_time)
```

需要注意的是，OCLint 分析时默认只识别 compile\_commands.json 文件，所以不能在同一文件路径下进行多进程分析。这里的做法是把上面的子 json 移到新建的文件目录下，分析结束后把结果挪回原目录下，最后进行合并操作。分析时目录结构如下：

![oclintsplitdir](/images/jueJin/123669c0abf3591.png)

关键代码如下：

```ini
import os
import sys
import shutil

def lint(out_file):
lint_command = '''oclint-json-compilation-database -- \
--verbose \
-rule ObjCVerifyLoadCall \
-rule NEModuleHubLaunch \
-enable-global-analysis \
-max-priority-{替换成自定义的priority}=100000 \
--report-type pmd \
-o %s''' % (out_file)
os.system(lint_command)

def rename(file_path, new_name):
paths = os.path.split(file_path)
new_path = os.path.join(paths[0], new_name)
os.rename(file_path, new_path)
return new_path

dir_path = os.path.dirname(__file__) #当前目录
os.chdir(dir_path)  #改变当前工作目录
cur_dir = dir_path.rsplit("/", 1)[1] #文件夹名
out_file = cur_dir+'.xml'
json_name = 'compile_commands'+cur_dir[6:]+'.json'
rename(os.path.join(dir_path, json_name), 'compile_commands.json')

lint(out_file)

if os.path.isfile(out_file):
print (out_file + "is exist")
#产物移到上层目录
shutil.move(os.path.join(os.path.dirname(__file__), out_file), os.pardir)
#删除当前目录
shutil.rmtree(dir_path)
else:
print (out_file + "is not exist")
```

下图是活动监视器的截图，可以看到 5 个 OCLint 分析进程。在实际应用时，因为 OCLint 高内存与 CPU 消耗，我们把进程数定为了 3 个。

![oclintprocess](/images/jueJin/5ed356b35d86ef5.png)

最终我们通过上述方式，把运行一次完整 OCLint 的时间缩短到 2.5 小时左右，总耗时优化了 58.3%，OCLint 耗时优化了 67.7%。

![oclint优化结果](/images/jueJin/ba8e3ca7d26ebf0.png)

九、其他
----

上面拿到的 OCLint 分析数据可能有些粗浅，实际应用时可以按需解析，并可结合线上大盘数据对分析结果做深加工，最后生成 html 格式的报告更加方便阅读。类似下图：

![oclintreport](/images/jueJin/fb009e0b0c15082.png)

十、实际案例 - 启动耗时代码检测
-----------------

此前云音乐技术团队进行了长时间的启动性能优化专项治理，效果显著。在此基础上，如何防止启动性能优化专项治理成果劣化，成为了下个阶段的重中之重。因此我们尝试利用代码静态检测能力检测分析启动耗时相关方法，如 +load 方法、App 启动生命周期方法等，目前已上线稳定运行，取得的效果如下：

1.  检测到可能的耗时代码 600+，涉及业务库 120+。
2.  结合上述分析结果，我们预估完成一期治理后，将优化启动耗时 250ms+。

十一、下一步工作
--------

OCLint 的现状不算太好，且远未完成，好在许多方面都在不断改进，例如准确性、性能和可用性。对于 iOS 开发者来说，Swift 已成为主流，并已在云音乐部分产品和业务中使用，之后我们会考虑接入生态更好的 SwiftLint。

现阶段，云音乐技术团队正在积极的搭建和完善自己的代码静态检测平台，值得期待。

总结
--

借助代码静态检测能力，能够及时有效的帮助我们发现问题、保障代码质量、防止代码劣化、节省人力成本。 OCLint 作为一种静态代码分析工具，致力于提高代码质量、减少代码缺陷，并被广泛使用。结合它的高扩展性，可定制满足各种需求，例如检测启动耗时代码，并通过多进程技术可大大缩短分析时间。业务方也可以轻松参与共建，丰富规则仓库，同时其他产品线也可以参照此案例快速搭建各自的代码静态检测服务。

参考资料
----

*   [Clang documentation](https://link.juejin.cn?target=https%3A%2F%2Fclang.llvm.org%2Fdocs%2Findex.html "https://clang.llvm.org/docs/index.html")
*   [Clang Static Analyzer](https://link.juejin.cn?target=https%3A%2F%2Fclang-analyzer.llvm.org "https://clang-analyzer.llvm.org")
*   [Infer](https://link.juejin.cn?target=https%3A%2F%2Ffbinfer.com%2F "https://fbinfer.com/")
*   [OCLint Documentation](https://link.juejin.cn?target=https%3A%2F%2Freadthedocs.org%2Fprojects%2Foclint-docs%2Fdownloads%2Fpdf%2Fv20.11%2F "https://readthedocs.org/projects/oclint-docs/downloads/pdf/v20.11/")
*   [oclint\_argument\_list\_too\_long\_solution](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fwuwen1030%2Foclint_argument_list_too_long_solution "https://github.com/wuwen1030/oclint_argument_list_too_long_solution")
*   [Python 教程](https://link.juejin.cn?target=https%3A%2F%2Fdocs.python.org%2Fzh-cn%2F3%2Ftutorial%2Findex.html "https://docs.python.org/zh-cn/3/tutorial/index.html")
*   [SwiftLint](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Frealm%2FSwiftLint "https://github.com/realm/SwiftLint")

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！