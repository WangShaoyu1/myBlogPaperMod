---
author: "政采云技术"
title: "百宝箱系列之vscode插件-微信小程序发布"
date: 2021-08-25
description: "前言 开发当中我们会经常碰到很多觉得麻烦的事情，一些流程又臭又长，像老太太裹脚布一样的步骤。比如我们亲爱的小程序，那流程那步骤让我的 Mac 13 寸丐中丐版很是蛋疼。每次都得打开 N 多东西才能发布"
tags: ["前端","Visual Studio Code","微信小程序中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读13分钟"
weight: 1
selfDefined:"likes:90,comments:18,collects:43,views:5661,"
---
![](/images/jueJin/d4eb6a01e656484.png)

![1629709383643_毅轩.png](/images/jueJin/a5683af50e01462.png)

> 这是第 112 篇不掺水的原创，想获取更多原创好文，请搜索公众号关注我们吧~ 本文首发于政采云前端博客：[百宝箱系列之vscode插件-微信小程序发布](https://link.juejin.cn?target=https%3A%2F%2Fzoo.team%2Farticle%2Fvscode-wechat "https://zoo.team/article/vscode-wechat")

前言
--

开发当中我们会经常碰到很多觉得麻烦的事情，一些流程又臭又长，像老太太裹脚布一样的步骤。比如我们亲爱的小程序，那流程那步骤让我的 Mac 13 寸丐中丐版很是蛋疼。每次都得打开 N 多东西才能发布到预览。蓝瘦，真是个磨人的小妖精。

分析和拆解
-----

**关于 Vscode 插件开发基础教程[请移步官方文档](https://link.juejin.cn?target=https%3A%2F%2Fcode.visualstudio.com%2Fapi "https://code.visualstudio.com/api")，这里就不过多赘述了，这边我们只把重心放到去实现小程序自动构建发布关键点的实现上。**

由于我们使用的是 uni-app 作为多端统一的方向，所以在每次开发或者提测小程序需要发到预览版上的时候都需要经历如下步骤：

![](/images/jueJin/982554bcf52d400.png)

ok，既然都已经大致理清楚流程了，那么拥有程序员严谨态度的我们，分析分析整个过程中需要用到的哪些能力？接下来我们只对每个环节关键的部分做一些分析和拆解，不做全盘 Vscode 插件代码的结构和代码分析。

1.  前置工作
    *   选择构建分支，版本并填写描述
        *   Vscode 插件 window 能力 - 输入描述，下拉框选择
        *   Git 能力 - 拉取分支
    *   临时保存当前分支修改
        *   Git 能力 - 保存当前分支
    *   切换到目标分支
        *   Git 能力- 切换分支
2.  本地构建
    *   自动生成版本号
        *   微信开发平台 api 能力- 获取当前 AppID 最近模板列表
    *   注入目标小程序 AppID
        *   Shell 调用能力- 修改文件内容注入 AppID
    *   运行 uni-app 构建命令
        *   Shell 调用能力 - 执行构建命令
    *   撤销发布临时修改文件
        *   Git 调用能力- 使用 Git 来撤销修改文件
3.  部署小程序
    *   上传云端草稿箱
        *   微信开发工具调用能力
    *   移动到模板库
        *   微信开发平台 api 能力
    *   部署预览版
        *   Dubbo 能力 - 由于后端已经存在微信开发平台 accessToken 能力，直接调用获取

Vscode 插件的 window 能力是默认就带的不需要实现，所以就 Shell 调用，Git 调用，Dubbo调用，微信开发平台 api 调用，微信开发工具调用需要实现。

再归归类，其实 Git 调用，和微信开发工具调用都是命令行调用也就是 Shell 调用，微信开发平台 api 调用其实本质就是 http 请求，但是里面最最重要的 accessKey 呢是直接调用政采云后端 Dubbo 接口获取，所以才需要 Dubbo。下面看看大致怎么去做呢？

#### Shell 的调用

听到 Shell 菊花一紧，不熟悉的人觉得天哪很复杂的样子，其实就是使用 `child_process` 去开一个子进程，然后你就快乐的玩耍吧。所以我们在项目中封装了一个 shell.ts 来做所有 Shell 脚本的执行动作。 [不熟悉`child_process`的请移步这里](https://link.juejin.cn?target=https%3A%2F%2Fnodejs.org%2Fapi%2Fchild_process.html "https://nodejs.org/api/child_process.html")

```typescript
// shell.ts 部分核心代码
import { execFile, ExecFileOptions } from "child_process";

    export namespace Shell {
    // 在 shell 中直接调用 git 的执行文件执行原始命令
    export async function exec<TOut extends string | Buffer>(
    args: any[],
options: ExecFileOptions = {}
    ): Promise<TOut> {
        const { stdin, stdinEncoding, execFileNameOrPath, ...opts }: any = {
        maxBuffer: 100 * 1024 * 1024,
        ...options,
        };
        
            return new Promise<TOut>((resolve, reject) => {
        if (!execFileNameOrPath) { reject('error'); }
            try {
            const proc = execFile(
            execFileNameOrPath,
            args,
            opts,
                (error: any | null, stdout, stderr) => {
                    if (error != null) {
                    reject(error);
                    return;
                }
                resolve(
                stdout as TOut
                );
            }
            );
            
                if (stdin !== null) {
                proc.stdin?.end(stdin, stdinEncoding ?? "utf8");
            }
        }
            catch (e) {
            return
        }
        });
    }
}

```

然后就可以通过 Shell.exec 方法传入参数就能直接调用了

#### Git 的调用

有了上一个 Shell 作为基础我们就可以开干 Git 的调用了，在 Shell 中第一个参数是命令的执行文件，所以我们需要得到当前的 Git 的执行文件的地址作为第一个参数，后面其实就是正常的 Git 命令的拼接就够了。那么怎么知道当前 Git 的执行文件路径呢？

通过 Vscode 插件中集成的 Git 能力去得到 `extensions.getExtension("vscode.git")`，如下方式

```typescript
// 获取 Vscode 内置的 Git Api
    static async getBuiltInGitApi(): Promise<BuiltInGitApi | undefined> {
        try {
        const extension = extensions.getExtension("vscode.git") as Extension<
        GitExtension
        >;
            if (extension !== null) {
            const gitExtension = extension.isActive
            ? extension.exports
            : await extension.activate();
            
            return gitExtension.getAPI(1);
        }
    } catch {}
    
    return undefined;
}
```

在返回的对象中 `gitApi.git.path` 就是 Git 的执行文件路径。为了更加方便的调用，我们也封装了一个 git.ts 作为 Git 最最核心最最基础的调用

```typescript
//git.ts 的部分核心代码
    export namespace Git {
        export namespace Core {
        // 在 shell 中直接调用  git 的执行文件执行原始命令
        export async function exec<TOut extends string | Buffer>(
        args: any[],
    options: GitExecOptions = {}
        ): Promise<TOut> {
        
        options.execFileNameOrPath = gitInfo.execPath || "";
        
        args.splice(0, 0, "-c", "core.quotepath=false", "-c", "color.ui=false");
        
            if (process.platform === "win32") {
            args.splice(0, 0, "-c", "core.longpaths=true");
        }
        return Shell.exec(args, options);
    }
}

```

在外部我们直接用 Git.Core.exec 方法直接执行对应的 Git 命令

#### 微信开发工具调用

首选我们要先**检查开发者工具设置：需要在开发者工具的设置 -> 安全设置中开启服务端口**。这样我们才能直接唤起开发者然后做些我们要做的事情。

再者我们需要知道微信开发者工具的执行文件地址。 [详细请移步文档](https://link.juejin.cn?target=https%3A%2F%2Fdevelopers.weixin.qq.com%2Fminiprogram%2Fdev%2Fdevtools%2Fcli.html "https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html")

macOS: `<安装路径>/Contents/MacOS/cli`

windows: `<安装路径>/cli.bat`

正常来说 Mac 地址 **/Applications/wechatwebdevtools.app/Contents/MacOS/cli**

最后通过我们以前提供的 Shell 命令能力去执行就搞定了。是不是很简单。我们也封装了miniProgram.ts 来做这个事情

```typescript
//miniProgram.ts 核心代码
import { ExecFileOptions } from "child_process";
import * as vscode from "vscode";
import { Shell } from '../shell';

    interface MiniProgramExecOptions extends ExecFileOptions {
    branchName: string;
    execFileNameOrPath: string;
    projectPath: string,
    userVersion: string,
    userDesc: string
}

    export namespace MiniProgram {
        export namespace Core {
        // 在 shell 中直接调用 git 的执行文件执行原始命令
        export async function exec<TOut extends string | Buffer>(
        args: any[],
        options: MiniProgramExecOptions
            ): Promise<TOut> {
            vscode;
            options.execFileNameOrPath = "/Applications/wechatwebdevtools.app/Contents/MacOS/cli";
            return Shell.exec(args, options);
        }
    }
}

```

#### Duddo 的调用

不明觉厉，都直接调 Dubbo 了吊的不行，其实很简单，有一个 nodeJs 的库 `node-zookeeper-dubbo` 再配合 `js-to-java` 这两个库就能搞定，只不过一些配置比较麻烦，我就把代码大致的贴出来

```typescript
const nzd = require("node-zookeeper-dubbo");
const j2j = require("js-to-java");

    export interface DubboInstance {
        mp: {
        getComponentToken: Function;
        };
    }
    
        export class DubboService {
        private _dubbo: DubboInstance;
            public get dubbo(): DubboInstance {
            return this._dubbo;
        }
        
            constructor() {
                const options = {
                application: "你的项目名称", //项目名称
                register: "你的服务器地址", // zookeeper 服务器地址，多个服务器之间使用逗号分割
                dubboVer: "你的版本", //dubbo 的版本，询问后端得知是2.3.5
                root: '你的根节点', //注册到 zookeeper 上的根节点名称
                    dependencies: {
                    //依赖的 dubbo 服务集,也就是你要调用的服务的配置集合
                        mp: {
                        //服务的标识，自定义的，按自己喜好
                        interface: "你的后端 dubbo 服务地址", //后端 dubbo 服务地址
                        version: "你的服务版本号", //服务版本号
                        timeout: "30000", //超时时间
                        group: '你的分组', //分组的功能也没有使用
                            methodSignature: {
                            //服务里暴露的方法的签名，可以省略
                            getComponentToken: () => () => [],
                            },
                            },
                            },
                            java: j2j, //使用 js-to-java 库来简化传递给 java  后端的值的写法
                            };
                            this._dubbo = new nzd(options);
                        }
                    }
                    
```

至此一些基本能力已经封装的差不多了

Shell：Shell.exec 方法

Git：Git.Core.exec 方法

微信开发工具： MiniProgram.Core.exec 方法

Dubbo: DobboService.dubbo.mp 方法

搞起
--

### 前置工作

因为我们要构建一个预发版，所以很有可能我们需要构建的分支不是我们当前工作的分支，所以这步骤的话更多的是要做好一些构建前的一些准备工作，总不能因为人家测试要一个预览测试版然后一不小心把我们自己本地的辛辛苦苦开发的东西弄没了吧，那真的是 f\*\*k 了。

根据流程我们先来分解下大致的技术动作

*   临时保存当前分支修改
    *   获取当前分支。
    *   如果是在当前分支啥都不管，否则 stash 下
*   切换到需要发布分支
    *   切换下分支

再精简下： 获取**当前分支** ---> **保存修改** --> **切换分支**。 都是 Git 的一些动作。那么在 nodeJs 中怎么开始自己的 Git 表演呢？一个关键点：Shell 脚本和命令的调用，所以这里的本质是调用 Shell。我们在上个章节中已经实现的 Shell 和 Git 的基本能力了，我们直接调用就行了。

#### 使用 symbolic-ref 获取当前分支

其实 Git 的命令分为两种

*   高层命令（porcelain commands）
*   底层命令（plumbing commands）

常用的命令大家都很熟悉了，什么 branch 啊， init 啊，add 啊，commit 啊等等。底层命令又是什么鬼，其实所有的高层命令的本质都是会调用底层命令，可以类比为语言层面 Java，C#，Js 这些高级语言他的底层是使用 C 或者 C++ 是一个概念。 [有兴趣请移步](https://link.juejin.cn?target=https%3A%2F%2Fgit-scm.com%2Fbook%2Fen%2Fv2%2FGit-Internals-Plumbing-and-Porcelain "https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain")

symbolic-ref 命令能干嘛呢？

给定一个参数，读取哪个分支头部给定的符号 ref 引用并输出其相对于 `.git/` 目录的路径。通常，`HEAD` 以 参数的形式提供您的工作树所在的分支。

有了上面 git.ts 支持基本能力那么现在我们就很简单多了，`Git.Core.exec<string>(["symbolic-ref", "--short", "HEAD"], options);`

在 git.ts 中增加基本命令方法

```typescript
// git.ts 部分代码
    export function symbolicRef(options: GitExecOptions = {}) {
    return Core.exec<string>(["symbolic-ref", "--short", "HEAD"], options);
}
```

在 gitService 中实现 getCurrentBranch 方法

```typescript
// gitService.ts 部分代码
    public async getCurrentBranch(filePath: string): Promise<string> {
    const branchName = await Git.Cmd.symbolicRef({ cwd: filePath });
    return branchName.replace(/\n/g, "");
}
```

#### 保存修改和切换分支

当我们获取到当前分支之后，和我们目标分支进行比对如果一致的话直接跳过该步骤，否则就需要对当前分支保存并且切换了。

为了方便对于保存和切换我们直接用了Git 的 stash 和 checkout 命令，并且封装了两个方法。

```typescript
// git.ts 部分代码
    export function checkout(options: GitExecOptions = {}) {
        const params = [
        "checkout"
        ];
            if (options.branchName) {
            params.push(options.branchName);
                }else if(options.fileName){
                params.push('--',options.fileName);
            }
            return Core.exec<string>(params, options);
        }
        
            export function stash(options: GitExecOptions = {}) {
                const params = [
                "stash"
                ];
                    if (options.stashPop) {
                    params.push('pop');
                }
                return Core.exec<string>(params, options);
            }
```

### 本地构建

继续分析下本地构建的基本流程

大致分以下几步

*   自动生成版本号
    *   得到当前 AppID 在微信模板库中版本号情况
*   注入需要发布的小程序 AppID
    *   需要修改 src/manifest.json 文件中 AppID，方便开发工具上传使用
*   运行 uni-app 构建命令
    *   run uniapp 命令
*   撤销发布时候的临时文件修改
    *   撤销文件修改

能力上来说有那么几个

1.  微信 api 调用
2.  文件读取和修改能力
3.  Shell 命令执行能力
4.  撤销文件修改能力

首先怎么调用微信的 api，由于那时候我们亲爱的后端同学啃次啃次的已经吧微信 token 鉴权的能力已经做掉了，所以我们直接接后端的微信鉴权能力就可以了。但是怎么接又是个问题，虽然人家已经有个 restful 接口可以用，但是接口都要登录的啊，让人家为了我这个小小的需求弄个匿名的不大现实也不安全，想来想去那就不要用 restful 了，直接调他后面提供的 Dobbo 服务好了，完美。

#### 获取微信 accessToken

在获取微信 api 调用前我们需要先得到 accessToken。

所以我们会先用一个公共方法先去获取当前 accessToken， 然后在去请求微信开发平台 api。

```typescript
// miniProgramService.ts 部分代码
    public async retrieveWxToken(): Promise<string> {
        if (!Launcher.dobboService.dubbo.mp) {
        throw new Error("dubbo初始化错误");
    }
        const {
        success: dobboSuccess,
        error,
        result: wxToken,
        } = await Launcher.dobboService.dubbo.mp.getComponentToken();
        
            if (!dobboSuccess) {
            throw new Error(`dubbo调用失败:${error}`);
        }
        
        console.log("wxToken:", wxToken);
        return wxToken;
    }
```

> 如果你们的后端没有支持微信开发平台的鉴权能力的话就需要自己用 nodejs 方式去实现了，[具体的微信开放平台文案请移步](https://link.juejin.cn?target=https%3A%2F%2Fdevelopers.weixin.qq.com%2Fminiprogram%2Fdev%2Fapi-backend%2Fopen-api%2Faccess-token%2Fauth.getAccessToken.html "https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/access-token/auth.getAccessToken.html")

#### 微信开放平台 api 调用

其实微信开放平台 api 调用就是正常的 http 调用即可。

微信提供了一系列方法，对于我们这次的场景来说有如下接口

*   getTemplateList 获取模板列表
    
    *   ```text
        POST https://api.weixin.qq.com/wxa/gettemplatelist?access_token==ACCESS_TOKEN
        ```
*   addtotemplate 移动草稿到模板库
    
    *   ```ini
        POST https://api.weixin.qq.com/wxa/gettemplatelist?access_token=ACCESS_TOKEN
        ```
*   deleteTemplate 删除指定模板
    
    *   ```ini
        POST https://api.weixin.qq.com/wxa/deletetemplate?access_token=ACCESS_TOKEN
        ```
*   getTemplateDraftList 获取草稿箱列表
    
    *   ```ini
        https://api.weixin.qq.com/wxa/gettemplatedraftlist?access_token=ACCESS_TOKEN
        ```

[具体的微信开放平台文案请移步](https://link.juejin.cn?target=https%3A%2F%2Fdevelopers.weixin.qq.com%2Fminiprogram%2Fdev%2Fapi-backend%2Fopen-api%2Ftemplate-message%2FtemplateMessage.addTemplate.html "https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/template-message/templateMessage.addTemplate.html")

版本号的自动生成主要是通过在你点击发布时候通过让用户选择发布的版本为“大版本”，“功能迭代”还是“补丁修复”，在结合这里提到的获取当前模板列表并用 AppID 找到当前最近的版本号再做自动计算累加的方式得到这次发布的版本号。

#### 构建小程序

构建小程序这边就直接沿用 uni-app 的能力直接做构建。封装了如下方法去构建小程序

```typescript
//miniProgramService.ts 部分代码
    public async buildMPForLocal(env: string): Promise<string> {
    let buildEnv;
        switch (env.toUpperCase()) {
        case "PROD":
        buildEnv = EnvEnum.prod;
        break;
        case "STAGING":
        buildEnv = EnvEnum.staging;
        break;
        case "TEST":
        buildEnv = EnvEnum.test;
        break;
        default:
        buildEnv = EnvEnum.dev;
        break;
    }
    
    const args = `./node_modules/.bin/cross-env NODE_ENV=production DEPLOY_ENV=${buildEnv} UNI_PLATFORM=mp-weixin ./node_modules/.bin/vue-cli-service uni-build`.split(' ');
    //正常需要这样传入 shell 参数才行
        //[
        // 'NODE_ENV=production',
        // 'DEPLOY_ENV=staging',
        // 'UNI_PLATFORM=mp-weixin',
        // './node_modules/.bin/vue-cli-service',
        // 'uni-build'
    //]
    
        const options: MPExecOptions = {
        execFileNameOrPath: 'node',
        cwd: getWorkspacePath()
        };
        
        return Shell.exec(args, options);
    }
```

> 其余的功能
> 
> *   剩余文件读取就正常使用 fs 库的 readFileSync 方法去读取和修改
> *   撤销修改文件则是通过调用 Git 的 checkout 命令的能力去做，也是要使用上一章节的 Git 的基本能力调用

### 部署小程序

我们 build 完成了，怎么上传呢？微信小程序这块还是需要借助微信开发工具的能力来上传

#### 微信开发工具上传

首选我们要先**检查开发者工具设置：需要在开发者工具的设置 -> 安全设置中开启服务端口**。这样我们才能直接唤起开发者然后做些我们要做的事情。

再者我们需要知道微信开发者工具的执行文件地址。正常来说 Mac 地址

> **/Applications/wechatwebdevtools.app/Contents/MacOS/cli**

最后通过我们以前提供的 Shell 命令能力去执行就搞定了。是不是很简单。我们也封装了miniProgram.ts 来做这个事情

```typescript
// miniProgram.ts 核心代码
    export namespace Cmd {
        export function uploadMP(options: MiniProgramExecOptions) {
            const args = [
            'upload',
            '--project',
            options.projectPath,
            '-v',
            options.userVersion,
            '-d',
            options.userDesc,
            ];
            return Core.exec<string>(args, options);
        }
    }
}

```

> 其余的功能
> 
> *   移动到模板库和部署预览版直接调用微信开放平台 api 即可

**效果预览图：**

![](/images/jueJin/8ec1b2d1a55d4c1.png)

尾声
--

至此整个小程序部署的在 Vscode 插件中实现的几个关键的技术点已经逐一做了简要的说明，大家会不会觉得其实看下来不难，就是涉及的东西会比较多。其实还有其他的诸如整个构建流程步骤如何可视化，Vscode 插件里面的一些基础的能力等等在本文都没有详细提及。欢迎大家留言或者提问把自己想要知道的问题反馈给我们，也方便我们可以针对大家的问题再去做一篇更棒的关于 Vscode 插件开发的文章。

其实 Vscode 插件在整个开发提效场景中只是当中的一个环节，我们会以敦煌工作台为核心底座搭配 Chrome 插件，Vscode 插件，zoo-cli 形成一个开发提效的百宝箱。Vscode 插件更多的是想给开发者们带来**沉浸式开发**的体验。

最后送上我自己的座右铭- **“懒”是人类进步的阶梯**。为了更“懒”，我们不断的前进和探索。

推荐阅读
----

[你需要知道的项目管理知识](https://juejin.cn/post/6997536906967777316 "https://juejin.cn/post/6997536906967777316")

[最熟悉的陌生人rc-form](https://juejin.cn/post/6984547134062198791 "https://juejin.cn/post/6984547134062198791")

[如何搭建适合自己团队的构建部署平台](https://juejin.cn/post/6987140782595506189 "https://juejin.cn/post/6987140782595506189")

[聊聊Deno的那些事](https://juejin.cn/post/6961201207964598286 "https://juejin.cn/post/6961201207964598286")

开源作品
----

*   政采云前端小报

**开源地址 [www.zoo.team/openweekly/](https://link.juejin.cn?target=https%3A%2F%2Fwww.zoo.team%2Fopenweekly%2F "https://www.zoo.team/openweekly/")** (小报官网首页有微信交流群)

招贤纳士
----

政采云前端团队（ZooTeam），一个年轻富有激情和创造力的前端团队，隶属于政采云产品研发部，Base 在风景如画的杭州。团队现有 50 余个前端小伙伴，平均年龄 27 岁，近 3 成是全栈工程师，妥妥的青年风暴团。成员构成既有来自于阿里、网易的“老”兵，也有浙大、中科大、杭电等校的应届新人。团队在日常的业务对接之外，还在物料体系、工程平台、搭建平台、性能体验、云端应用、数据分析及可视化等方向进行技术探索和实战，推动并落地了一系列的内部技术产品，持续探索前端技术体系的新边界。

如果你想改变一直被事折腾，希望开始能折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变既定的节奏，将会是“5 年工作时间 3 年工作经验”；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊… 如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的前端团队的成长历程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 `ZooTeam@cai-inc.com`

![](/images/jueJin/98d3aa3d1f8646a.png)