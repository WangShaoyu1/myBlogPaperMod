---
author: "腾讯云开发者"
title: "原来VSCode里藏了腾讯文档400行代码？鹅厂源码公开"
date: 2023-03-16
description: "👉腾小云导读 Visual Studio Code「VSCode」是 Microsoft 在2015年推出的、针对于编写现代 Web 和云应用的跨平台源代码编辑器，受到广大开发者热捧。腾讯文档向 VS"
tags: ["后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读14分钟"
weight: 1
selfDefined:"likes:65,comments:0,collects:29,views:7888,"
---
![图片](/images/jueJin/bd9cb2c48dc14c7.png)

![图片](/images/jueJin/24319d7568c144b.png)

**👉腾小云导读**

Visual Studio Code「VSCode」是 Microsoft 在2015年推出的、针对于编写现代 Web 和云应用的跨平台源代码编辑器，受到广大开发者热捧。腾讯文档向 VSCode 贡献了一些核心代码，主要涉及到 VSCode 配置化的部分，为其显著增强了配置化和插件化能力。作者希望将其中积累的经验分享出来，贡献给开源社区，为广大开发爱好者提供参考。本文详细解读源代码。欢迎阅读！

1 项目背景

2 腾讯文档贡献源码分析

3 腾讯文档给 VSCode 带来了什么

4 总结

01、项目背景
-------

腾讯文档在完善自己的配置化系统，在完善的过程探索了多种实现方案，分析了很多产品如大名鼎鼎的 VSCode 的实现方式。近期腾讯文档向 VSCode 贡献了 400 多行核心代码，主要涉及到 VSCode 配置化的部分。这增强了其插件化能力，提供更多的匹配接口。腾讯文档团队整理了部分代码结构和补充功能单测，希望把将这些积累的经验贡献给开源社区，与广大开发爱好者共同进步。公众号回复「VSCode」获取源代码。

![图片](/images/jueJin/a2d3cd14a03f4b9.png)

![图片](/images/jueJin/4fbb1304f67c4e0.png)

合入腾讯文档代码的是微软 VSCode 团队现主要负责人之一Alexdima（VScode 前身 Monaco Editor 的负责人)，他和 Erich Gamma ( VSCode 之父) 来自同一团队。

![图片](/images/jueJin/ac372430ebeb403.png)

腾讯文档团队给 VSCode 的配置化贡献了什么功能？相信大部分的开发者都使用过 VSCode，所以对配置化应该不陌生。由于使用者众多，任何编辑器其实都不能做到面面俱到去满足所有的使用者。如果什么用户的需求都要满足，就需要把所有的功能都塞进去。这不但臃肿，还不好维护。下面一起来看看我们如何解决。

02、腾讯文档贡献源码分析
-------------

我们需要将配置化丰富和拓展，减轻编辑器本身的包袱，把部分内容移交给用户/合作方去定制。例如：可以在 VSCode 的设置面板选择编辑器的颜色，更换它的主题背景。

![图片](/images/jueJin/5140a71cd181458.png)

也可以在快捷键面板里面绑定或者解绑此快捷键，更换字体大小和改变悬浮信息等，这些其实都离不开背后实现的一套配置化系统。

![图片](/images/jueJin/30a3eab3a9b1413.png)

上面的举例，都是有默认的配置。可以通过面板去更改，当然还有些隐藏的配置无需在面板改变也能实现配置。例如：缩小 VSCode 的界面大小，某些功能就会自动隐藏，这种也是属于配置化。

![图片](/images/jueJin/8498c0cf1a0e4ed.png)

我们除了通过面板可视化操作，还可以通过插件来配置界面，VSCode 中插件的核心就是一个配置文件 **package.json**，里面提供了配置点。只需按要求编写正确的配置点就可以改变 VSCode 的视图状态。里面最主要的字段就是 **contributes** 字段：

**字段  
**

**解析  
**

**contributes.configuration**

插件有哪些可供用户配置的选项，提供的界面需与面切背景颜色棉棒相似

**contributes.configurationDefaults**

覆盖 vscode 默认的一些编辑器配置

**contributes.commands**

向 vscode 的命令系统注册一些可供用户调用的命令

**contributes.menus**

扩展菜单

这是更换编辑器部分位置颜色的配置参数。里面的代码思路其实是挖了一个「洞」给第三方，然后支持参数的填入。

```json
    {
        "colors": {
        "activityBar.background": "#333842",
        "activityBar.foreground": "#D7DAE0",
        "activityBarBadge.background": "#528BFF"
    }
}
```

下面代码为示例。把配置文件的颜色读取出来，然后生成一个新的颜色规则，达到控制面板背景颜色的功能。

```arduino
const color = theme.getColor(registerColor("activityBar.background"));
    if (color) {
    collector.addRule(
    `.monaco-workbench .activitybar > .content > .home-bar > .home-bar-icon-badge { background-color: ${color}}`
    );
}
```

上面这个最基本的功能在代码里面实现是毫无难度的，只需要挖空一个配置点即可，但是实际会更复杂。如果此时用户想在此功能基础上继续做配置，例如编辑器在 Win 系统的时候颜色变深，在 Mac 系统的时候颜色变浅。

```scss
    if (color) {
        if (isMacintosh) {
        color = darken(color);
    }
        if (isWindows) {
        color = lighter(color);
    }
    collector.addRule(
    `.monaco-workbench .activitybar > .content > .home-bar > .home-bar-icon-badge { background-color: ${color}}`
    );
}
```

这些操作对于对开发人员而言难度虽不是很大，只需在代码里面插入几段条件判断的代码。但是如果用户又要求更改的话，可以更改为在分辨率大于 855 的时候使颜色变深，在分辨率小于或等于 855 的时候使颜色变浅，并且遇到 Linux 系统也会颜色变深。此时可能再变更代码来满足客户的需求，需要继续加如下的代码。这样做会增加开发人员的任务量。编辑器用户量不止上千万，用户需求非常多样，必然难以招架。

```scss
    if (color) {
        if (isMacintosh || window.innerWidth > 855) {
        color = darken(color);
    }
        if (isLinux) {
        color = darken(color);
    }
        if (isWindows || window.innerWidth <= 855) {
        color = lighter(color);
    }
    collector.addRule(
    `.monaco-workbench .activitybar > .content > .home-bar > .home-bar-icon-badge { background-color: ${color}}`
    );
}
```

![图片](/images/jueJin/dcb2a04d3ff84be.png)

这时就需我们自行定制规范。提供变暗和变深的接口，不负责写规则，而是需用户提供。具体调整代码如下：

```kotlin
    class Color {
    color = theme.getColor(registerColor("activityBar.background"));
    
    @If(isLinux)
    @If(isMacintosh || window.innerWidth > 855)
        darken() {
        return darken(this.color);
    }
    
    @If(userRule1)
    @If(userRule2)
    @If(userRule3)
    @If([isWindows, window.innerWidth <= 855].includes(true))
        lighter() {
        return lighter(this.color);
    }
}
```

上面只是列出伪代码，并非很简单。只提供纯粹的 **darken** 和 **lighter**，不与频繁的条件表达式耦合，所以可能会做判断条件的前置化。那么后续开发人员只需叠加装饰器即可，并且动态保留一个装饰器 **@If(userRule)** 作为配置文件的洞口。再提供官方配置文档给用户写类似的 **package.json** 文件填写对应的参数，这样压力就会转移到使用者（用户）或者接入者身上。

这种写法看似美好，但会出现很多致命问题，**darken** 和 **lighter** 在执行前已经被带条件表达式装饰，后面如果二次执行 **darken** 和 **lighter** 方法则不会再执行装饰器中条件表达式的判断，本质上这两个函数的 **descriptor.value** 已经被覆写，但逻辑从根本上发生了改变。

```typescript
    export const If = (condition: boolean) => {
    console.log(condition);
        return (target: any, name?: any, descriptor?: any) => {
        const func = descriptor?.value;
            if (typeof func === "function") {
                descriptor.value = function (...args: any) {
                return condition && func.apply(this, args);
                };
            }
            };
            };
```

正常情况下客户端侧 **isLinux**，**isMacintosh** 和 **isWindows** 是不会发生改变的，但是 **window.innerWidth** 在客户端却是有可能持续发生变化。所以一般情况下对待客户端环境经常变化的值或者需要通过作用域判断的值，我不建议写成上面装饰器暴露接口的方案。如果这是一个比较固定的配置值，这种方案配合 **webpack** 的 **DefinePlugin** 会有意外的收获。

```javascript
    new webpack.DefinePlugin({
    isLinux: JSON.stringify(true),
    VERSION: JSON.stringify("5fa3b9"),
    BROWSER_SUPPORTS_HTML5: true,
    TWO: "1+1",
    "typeof window": JSON.stringify("object"),
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    });
```

但是很多时候是需要在程序运行的时候进行配置化的，上述的大部分内容都是静态的配置(俗话说是写死的)，比如 **if (window.innerWidth > 855)** 这个配置参数：

左边 **window.innerWidth** 在运行时是变化的，右边 855 代码是写死的，所以一般把这一整段留出一个缺口来进行外部的配置化，会选用 **json** 去描述这份配置。

在 VSCode 等应用中，很多地方没有 json 文件进行配置，因为大部分情况它会提供可视化界面用来修改配置。其实本质是改动了 json 的配置文件来达到目的的，例如上面的 **if(isMacintosh || window.innerWidth > 855)** 就被插入到外面的 json 文件中了。

```json
// if(isMacintosh || window.innerWidth > 855) ...
// if(isWindows || window.innerWidth <= 855) ...
// ↓

    {
    "darken": { "when": "isMacintosh || window.innerWidth > 855" },
"lighter": { "when": "isWindows || window.innerWidth <= 855" }
}
```

一般需要接入方或者使用者写成上面类似的文件，然后通过服务器配置系统，下发到客户端。然后把贡献点放入装饰器中的缺口，再执行对应的配置逻辑。大致如下：

```kotlin
@If(JSON.darken)
    darken() {
    return darken(this.color);
}

@If(JSON.lighter)
    lighter() {
    return lighter(this.color);
}
```

**JSON.darken** 和 **JSON.lighter** 分别是对应 JSON 文件中的配置项，实际在代码运行时接受的字符串参数是：

```kotlin
@If("isMacintosh || window.innerWidth > 855")
    darken() {
    return darken(this.color);
}

@If("isWindows || window.innerWidth <= 855")
    lighter() {
    return lighter(this.color);
}
```

这是大部分配置化绕不开的问题，简单的配置只需要传承好字符串语义即可，但是复杂的配置化可能是带有条件表达式，代码语法等。这是VSCode 官方插件的配置代码，均是配置表达式。

![图片](/images/jueJin/f12af29eb9564f6.png)

本质上这些字符串最终是要解析为布尔值，作为开关去启动 **darken** 或者 **lighter** 接口的。所以这里需要付出一些代价去实现表达式解析器，和字符串转义解释引擎的。

**"window.innerWidth" => window.innerWidth**  
**"isWindows" => isWindows**  
**"isMacintosh || window.innerWidth > 855" => true/false**

这个过程中还需要实现校验函数，如果识别到是非法的字符串则不允许解析，避免非法启动配置接口。

**"isMacintosh || window.innerWidth > 855" =>** 合法配置参数  
**"isMacintosh |&&| window.innerWidth > 855" =>** 非法配置参数  
**"isMacintosh \\\\// window.innerWidth > 855" =>** 非法配置参数

这种引擎的实现设计其实还有一种更暴力的解决方案，就是把读取的配置字符串完全交给 **eval** 去处理。这当然可以很快去实现，但是还是上面说到的问题，这个操作如果接受了一段非法的字符串，就会很容易执行一些非法的脚本，绝对不是一个最优的方案。

```bash
eval("window.innerWidth > 855"); // true 或者 false
```

![图片](/images/jueJin/5b9ebfa126a64c3.png)

```json
"darken": { "when": "isMacintosh || window.innerWidth > 855" },
"lighter": { "when": "isWindows || window.innerWidth <= 855" }
}
```

下面介绍解决方案。先读取 json 文件，定位到关键词**when: xxx** (VSCode 目前只能暴露 when 对外匹配，腾讯文档实际还没开源的代码是可以实现暴露更多的键值规则给使用方去匹配)，不管是后端配置系统读取还是前端配置系统读取，解题思路均一致。

将读取条件表达式字符串 **"****isMacintosh || window.innerWidth > 855****"**，按照表达式的优先级拆解成几个部分，放入下面的 **contextMatchesRules** 去匹配预埋的作用域返回布尔值，（ VSCode 只做到按对应的键值去解析，腾讯文档可以做到对整个 JSON 配置表的键值扫描解析)。

```dart
context.set("isMacNative", isMacintosh && !isWeb);
context.set("isEdge", _userAgent.indexOf("Edg/") >= 0);
context.set("isFirefox", _userAgent.indexOf("Firefox") >= 0);
context.set("isChrome", _userAgent.indexOf("Chrome") >= 0);
context.set("isSafari", _userAgent.indexOf("Safari") >= 0);
context.set("isIPad", _userAgent.indexOf("iPad") >= 0);
context.set(window.innerWidth, () => window.innerWidth);

contextMatchesRules(context, ["isMacintosh"]); // true
contextMatchesRules(context, ["isEdge"]); // false
contextMatchesRules(context, ["window.innerWidth", ">=", "800"]); // true
```

VSCode 只是实现了很简单的表达式解析就支撑起了上万个插件的配置。因为 VSCode 有完善的文档，足够大的体量去定制规范，对开发人员能做到了强约束。上面这些解析器其实在有约束的情况下，不会被乱增加规则，正常情况是够用的。但是能用或者够用不代表好用。开源项目和商业化项目对用户侧的约束和规范不会一样。

![图片](/images/jueJin/9937458da85f48d.png)

03、腾讯文档给 VSCode带来了什么
--------------------

腾讯文档把整个解析器实现完整化，并完善了 VSCode 的解析器，赋予其更多的配置功能，后续还会继续推动并完善整个解析器，因为目前 VSCode 这方面还不是最完整的。

我们的配置解析器支持下面所有的方法。

*   支持变量
    
*   支持常量：布尔值、数字、字符串
    
*   支持正则
    
*   支持全等 **in** 和 **typeof**
    
*   支持全等 **\=**、不等 **!**
    
*   支持与 **&&**、或 **||**
    
*   支持大于 **\>**、小于 **<**、大于等于 **\>=**、小于等于 \*\*<=\*\*的比较运算
    
*   支持非 **!** 等逻辑运算
    

我们接下来再具体讲述下思路。使用下面这个复杂的例子来概括不同的情况：

```json
"when": "canEdit == true || platform == pc && window.innerWidth >= 1080"
```

封装一个 **deserialize** 方法去解析 **"when": "canEdit == true || platform == pc && window.innerWidth >= 1080"** 这段字符串，里面涉及了 **\==****，****&&****，****\>=** 三个表达式的解析。

使用 **indexOf** 和 **split** 进行分词，一般切割成三部分，key、type 和 value，特殊情况 **canEdit == true**，只要有 **key** 和 **value** 即可。根据优先级，先拆解 || 再拆解 **&&** 这两个表达式。

```typescript
const _deserializeOrExpression: ContextKeyExpression | undefined = (
serialized: string,
strict: boolean
    ) => {
    // 先解 ||
    let pieces = serialized.split("||");
    // 再解 &&
    return ContextKeyOrExpr.create(pieces.map((p) => _deserializeAndExpression(p, strict)));
    };
    
    const _deserializeAndExpression: ContextKeyExpression | undefinedn = (
    serialized: string,
    strict: boolean
        ) => {
        let pieces = serialized.split("&&");
        return ContextKeyAndExpr.create(pieces.map((p) => _deserializeOne(p, strict)));
        };
```

再拆解其他表达式。这里代码解析的顺序非常重要，比如有些时候需要增加 **!==** 这种表达式的解析，那么一定注意先解析 **\==** 再解析 **!==**，不然会拆解有误，代码的解析顺序也决定表达式的执行优先级，由于大部分都是字符串比对，所以一般无需比对类型，特殊情况在使用大于和小于号的时候，如果出现 **5 < '6'** 也是判断执行成功的。

```kotlin
const _deserializeOne: ContextKeyExpression = (
serializedOne: string,
strict: boolean
    ) => {
    serializedOne = serializedOne.trim();
    
        if (serializedOne.indexOf("!=") >= 0) {
        let pieces = serializedOne.split("!=");
        return ContextKeyNotEqualsExpr.create(
        pieces[0].trim(),
        this._deserializeValue(pieces[1], strict)
        );
    }
    
        if (serializedOne.indexOf("==") >= 0) {
        let pieces = serializedOne.split("==");
        return ContextKeyEqualsExpr.create(
        pieces[0].trim(),
        this._deserializeValue(pieces[1], strict)
        );
    }
    
        if (serializedOne.indexOf("=~") >= 0) {
        let pieces = serializedOne.split("=~");
        return ContextKeyRegexExpr.create(
        pieces[0].trim(),
        this._deserializeRegexValue(pieces[1], strict)
        );
    }
    
        if (serializedOne.indexOf(" in ") >= 0) {
        let pieces = serializedOne.split(" in ");
        return ContextKeyInExpr.create(pieces[0].trim(), pieces[1].trim());
    }
    
        if (serializedOne.indexOf(">=") >= 0) {
        const pieces = serializedOne.split(">=");
        return ContextKeyGreaterEqualsExpr.create(pieces[0].trim(), pieces[1].trim());
    }
    
        if (serializedOne.indexOf(">") >= 0) {
        const pieces = serializedOne.split(">");
        return ContextKeyGreaterExpr.create(pieces[0].trim(), pieces[1].trim());
    }
    
        if (serializedOne.indexOf("<=") >= 0) {
        const pieces = serializedOne.split("<=");
        return ContextKeySmallerEqualsExpr.create(pieces[0].trim(), pieces[1].trim());
    }
    
        if (serializedOne.indexOf("<") >= 0) {
        const pieces = serializedOne.split("<");
        return ContextKeySmallerExpr.create(pieces[0].trim(), pieces[1].trim());
    }
    
        if (/^\!\s*/.test(serializedOne)) {
        return ContextKeyNotExpr.create(serializedOne.substr(1).trim());
    }
    
    return ContextKeyDefinedExpr.create(serializedOne);
    };
```

最终 **when** 会被解析为下面的树结构，**type** 是预先定义对表达式的转义，如下表所示：

ContextKey

Type

ContextKey

Type

**False**

0

Regex

7

**True**

1

NotRegex

8

**Defined**

2

Or

9

**Not**

3

Greater

10

**Equals**

4

Less

11

**NotEquals**

5

GreaterOrEquals

12

**And**

6

LessOrEquals

13

这里留了一个很有意思的 **Defined** 接口，它不属于任何的表达式语法，后续可以这样使用：

```typescript
    export class RawContextKey<T> extends ContextKeyDefinedExpr {
    
    private readonly _defaultValue: T | undefined;
    
        constructor(key: string, defaultValue: T | undefined) {
        super(key);
        this._defaultValue = defaultValue;
    }
    
        public toNegated(): ContextKeyExpression {
        return ContextKeyExpr.not(this.key);
    }
    
        public isEqualTo(value: string): ContextKeyExpression {
        return ContextKeyExpr.equals(this.key, value);
    }
    
        public notEqualsTo(value: string): ContextKeyExpression {
        return ContextKeyExpr.notEquals(this.key, value);
    }
}

const Extension = new RawContextKey<string>('resourceExtname', undefined);
Extension.isEqualTo("abc");
const ExtensionContext = new Maps();
ExtensionContext.setValue("resourceExtname", "abc");
console.log(contextMatchesRules(ExtensionContext, Extension.isEqualTo("abc")));
```

在任何地方创建一个 **ExtensionContext** 作用域，再建立键值对来使用 **isEqualTo** 进行等值比对。

条件表达式分词规则用一张图来表示，以下面这颗树生成的思路为例，遵循常用表达式的一些语法规范和优先级规则，优先切割 **||** 两边的表达式，然后遍历两边的表达式往下去切割 **&&** 表达式，切完所有的 **||** 和 **&&** 两边的表达式后，再处理子节点的 **!=**、**\==** 和 **\>=** 等符号。

![图片](/images/jueJin/eefeb66051fb49f.png)

当切割完整个 **when** 配置项，将这个树结构结合上面的 **ContextKey-Type** 映射表，转换出下面的 JS 对象，上面存储着 **ContextKeyOrExpr**\*\*，\*\***ContextKeyAndExpr ContextKeyEqualsExpr** 和 **ContextKeyGreaterOrEqualsExpr** 这些重要的规则类，再将该 JS 对象存储到 **MenuRegistry** 里面，后面只需遍历 **MenuRegistry** 就可以把里面存着的 **key** 和 **value** ，根据 **type** 运算规则取出来进行比对，并返回布尔值。

```css
    when: {
        ContextKeyOrExpr: {
            expr: [{
                ContextKeyDefinedExpr: {
                key: "canEdit",
                type: 2
            }
                }, {
                    ContextKeyAndExpr: {
                        expr: [{
                            ContextKeyEqualsExpr: {
                            key: "platform",
                            type: 4,
                            value: "pc",
                            },
                                ContextKeyGreaterOrEqualsExpr: {
                                key: "window.innerWidth",
                                type: 12,
                                value: "1080",
                            }
                            }],
                            type: 6
                        }
                        }],
                        type: 9
                    }
                }
```

上面提到，**"window.innerWidth"** ，**canEdit** 和 **"platform"** 这些是字符串，不是真正可用于判断的值。这些 key 有些是运行时才会得到值，有些是在某个作用域下才会得到值。所以需要将这些 key 进行转化，借鉴Vscode 的做法，在 Vscode 中，它会将这部分逻辑交给一个叫 **context** 的对象进行处理，它提供两个关键的接口 **setValue** 和 **getValue** 方法，简单的实现如下。

```typescript
    export class Maps {
    protected readonly _values = new Map<string, any>();
        public get values() {
        return this._values;
    }
    
        public getValue(key: string): any {
            if (this._values.has(key)) {
            let value = this._values.get(key);
            // 执行获取最新的值，并返回
                if (typeof value == "function") {
                value = value();
            }
            return value;
        }
    }
    
        public removeValue(key: string): boolean {
            if (key in this._values) {
            this._values.delete(key);
            return true;
        }
        return false;
    }
    
        public setValue(key: string, value: any) {
        this._values.set(key, value);
    }
}
```

它本质是维护着一份 Map 对象，需要把 **"window.innerWidth"**，**canEdit** 和 **"platform"** 这些值绑定进去，从而让 key 可以转化对应的变量或者常量。

这里注意的是 **getValue** 里面有一段代码是判断是否是函数，如果是函数则执行获取最新的值。这个地方非常关键，因为去收集 **window.innerWidth** 这些的值，很可能是实时变化的。需要在判断的时候触发这个回调获取真正最新的值，保证条件表达式解析最终结果的正确性。当然如果是 **platform** 或者 **isMacintosh** 这些在运行的时候通常不会变，直接写入即可，不需要每次都触发回调来获取最新的值。

```javascript
const context = new Context();
context.setValue("platform", "pc");
context.setValue("window.innerWidth", () => window.innerWidth);
context.setValue(
"canEdit",
window.SpreadsheetApp.sheetStatus.rangesStatus.status.canEdit
);
```

当然有些常量或者全局的固定变量，需要事先预埋，比如字符串 **"****true****"** 对应就是 **true**，字符串 **"****false****"** 对应就是 **false**：

```javascript
context.setValue(JSON.stringify(true), true);
context.setValue(JSON.stringify(false), false);
```

如果要交给第三方配置，就需要提前在这里规定好 key 值绑定的变量和常量，输出一份配置文档就可以让第三方使用这些关键 key 来进行个性化配置。

![图片](/images/jueJin/cce3ccb451a04e8.png)

那么最后只要封装上面例子用到的 **contextMatchesRules** 方法，先读取 json 配置文件为对象，遍历出每一个 **when**，并关联 **context** 最终得出一个布尔值，这个布尔值来之不易，生成的最终结果其实是一个带布尔值的策略树，这棵树的前后最终节点的目的都是为了求出布尔值，如果是服务端下发的动态配置，本质是 0 和 1 的策略树即可。

![图片](/images/jueJin/f78b90f8f0ce499.png)

![图片](/images/jueJin/af3ad3a41dd24e3.png)

实现一个强大的配置系统还能保证整体的质量和性能是很不容易的，上图是实际项目中的一个改造例子，左边的表达式收集会转化成右边表达式配置，左边所有的 if 会到配置表里面转嫁给接入方或者可视化配置界面，之后每当变动配置表的信息，都可以配合作用域收集得到全信的策略树来渲染视图或者更新视图。

04
==

总结

腾讯文档团队一路走来遇到很多问题、逐个击破，最终才贡献出这个方案。后续希望能输出更多代码回馈开源社区，也希望有更多志同道合的开发者们一起去探索和遨游技术开发知识，最后也希望这篇文章能给到大家一些启发 。公众后回复「VSCode」获取源代码。

以上是本次分享全部内容，欢迎大家在评论区分享交流。如果觉得内容有用，欢迎转发～

\-End-

原创作者｜姚嘉隆

技术责编｜姚嘉隆

最近微信改版啦，有粉丝反馈收不到小云的文章🥹。

请关注「腾讯云开发者」并**点亮星标**，

周一三晚8点 和小云一起**涨(领)技(福)术(利)**！

开源无国界。开发者群体对于创新和创造的热爱，让「更早更多地参与开源贡献」成为趋势。

*   **你如何理解开源精神？怎么看待当下的开源现状？**
    
*   **如果只能给其他开发者推荐一个开源项目，你会推荐什么？**
    

欢迎在**公众号**评论区聊一聊你的看法。快来加腾小云的微信（微信号yun\_assistant，统一处理时间9:00-18:00），在3月17日前将你的评论记录截图发送给小云，可领取腾讯云「开发者春季限定红包封面」一个，数量有限先到先得😄。我们还将选取点赞量最高的1位朋友，送出腾讯QQ公仔1个。3月22日中午12点开奖。快邀请你的开发者朋友们一起来参与吧！

[阅读原文](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FgL-ORT74fa0ENZX2Tr_Vqw "https://mp.weixin.qq.com/s/gL-ORT74fa0ENZX2Tr_Vqw")