---
author: "冴羽"
title: "TypeScript 之模板字面量类型"
date: 2021-12-07
description: "TypeScript4 最新官方文档 Template Literal Types 章节的中文翻译，带你入门 TypeScript"
tags: ["前端","TypeScript","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:21,comments:0,collects:4,views:3111,"
---
> TypeScript 的官方文档早已更新，但我能找到的中文文档都还停留在比较老的版本。所以对其中新增以及修订较多的一些章节进行了翻译整理。

> 本篇翻译整理自 TypeScript Handbook 中 「[Template Literal Types](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2F2%2Ftemplate-literal-types.html "https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html")」 章节。

> 本文并不严格按照原文翻译，对部分内容也做了解释补充。

模板字面量类型（Template Literal Types）
-------------------------------

模板字面量类型以[字符串字面量类型](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2F2%2Feveryday-types.html%23literal-types "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types")为基础，可以通过联合类型扩展成多个字符串。

它们跟 JavaScript 的模板字符串是相同的语法，但是只能用在类型操作中。当使用模板字面量类型时，它会替换模板中的变量，返回一个新的字符串字面量：

```typescript
type World = "world";

type Greeting = `hello ${World}`;
// type Greeting = "hello world"
```

当模板中的变量是一个联合类型时，每一个可能的字符串字面量都会被表示：

```typescript
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
// type AllLocaleIDs = "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"
```

如果模板字面量里的多个变量都是联合类型，结果会交叉相乘，比如下面的例子就有 2 \* 2 \* 3 一共 12 种结果：

```typescript
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
type Lang = "en" | "ja" | "pt";

type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`;
// type LocaleMessageIDs = "en_welcome_email_id" | "en_email_heading_id" | "en_footer_title_id" | "en_footer_sendoff_id" | "ja_welcome_email_id" | "ja_email_heading_id" | "ja_footer_title_id" | "ja_footer_sendoff_id" | "pt_welcome_email_id" | "pt_email_heading_id" | "pt_footer_title_id" | "pt_footer_sendoff_id"
```

如果真的是非常长的字符串联合类型，推荐提前生成，这种还是适用于短一些的情况。

类型中的字符串联合类型（String Unions in Types）
-----------------------------------

模板字面量最有用的地方在于你可以基于一个类型内部的信息，定义一个新的字符串，让我们举个例子：

有这样一个函数 `makeWatchedObject`， 它会给传入的对象添加了一个 `on` 方法。在 JavaScript 中，它的调用看起来是这样：`makeWatchedObject(baseObject)`，我们假设这个传入对象为：

```typescript
    const passedObject = {
    firstName: "Saoirse",
    lastName: "Ronan",
    age: 26,
    };
```

这个 `on` 方法会被添加到这个传入对象上，该方法接受两个参数，`eventName` （ `string` 类型） 和 `callBack` （`function` 类型）：

```typescript
// 伪代码
const result = makeWatchedObject(baseObject);
result.on(eventName, callBack);
```

我们希望 `eventName` 是这种形式：`attributeInThePassedObject + "Changed"` ，举个例子，`passedObject` 有一个属性 `firstName`，对应产生的 `eventName` 为 `firstNameChanged`，同理，`lastName` 对应的是 `lastNameChanged`，`age` 对应的是 `ageChanged`。

当这个 `callBack` 函数被调用的时候：

*   应该被传入与 `attributeInThePassedObject` 相同类型的值。比如 `passedObject` 中， `firstName` 的值的类型为 `string` , 对应 `firstNameChanged` 事件的回调函数，则接受传入一个 `string` 类型的值。`age` 的值的类型为 `number`，对应 `ageChanged` 事件的回调函数，则接受传入一个 `number` 类型的值。
*   返回值类型为 `void` 类型。

`on()` 方法的签名最一开始是这样的：`on(eventName: string, callBack: (newValue: any) => void)`。 使用这样的签名，我们是不能实现上面所说的这些约束的，这个时候就可以使用模板字面量：

```typescript
    const person = makeWatchedObject({
    firstName: "Saoirse",
    lastName: "Ronan",
    age: 26,
    });
    
    // makeWatchedObject has added `on` to the anonymous Object
        person.on("firstNameChanged", (newValue) => {
        console.log(`firstName was changed to ${newValue}!`);
        });
```

注意这个例子里，`on` 方法添加的事件名为 `"firstNameChanged"`， 而不仅仅是 `"firstName"`，而回调函数传入的值 `newValue` ，我们希望约束为 `string` 类型。我们先实现第一点。

在这个例子里，我们希望传入的事件名的类型，是对象属性名的联合，只是每个联合成员都还在最后拼接一个 `Changed` 字符，在 JavaScript 中，我们可以做这样一个计算：

```typescript
Object.keys(passedObject).map(x => ${x}Changed)
```

模板字面量提供了一个相似的字符串操作：

```typescript
    type PropEventSource<Type> = {
    on(eventName: `${string & keyof Type}Changed`, callback: (newValue: any) => void): void;
    };
    
    /// Create a "watched object" with an 'on' method
    /// so that you can watch for changes to properties.
    
    declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>;
```

注意，我们在这里例子中，模板字面量里我们写的是 `string & keyof Type`，我们可不可以只写成 `keyof Type` 呢？如果我们这样写，会报错：

```typescript
    type PropEventSource<Type> = {
    on(eventName: `${keyof Type}Changed`, callback: (newValue: any) => void): void;
    };
    
    // Type 'keyof Type' is not assignable to type 'string | number | bigint | boolean | null | undefined'.
    // Type 'string | number | symbol' is not assignable to type 'string | number | bigint | boolean | null | undefined'.
    // ...
```

从报错信息中，我们也可以看出报错原因，在 [《TypeScript 系列之 Keyof 操作符》](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog%2Fissues%2F223 "https://github.com/mqyqingfeng/Blog/issues/223")里，我们知道 `keyof` 操作符会返回 `string | number | symbol` 类型，但是模板字面量的变量要求的类型却是 `string | number | bigint | boolean | null | undefined`，比较一下，多了一个 symbol 类型，所以其实我们也可以这样写：

```typescript
    type PropEventSource<Type> = {
    on(eventName: `${Exclude<keyof Type, symbol>}Changed`, callback: (newValue: any) => void): void;
    };
```

再或者这样写：

```typescript
    type PropEventSource<Type> = {
    on(eventName: `${Extract<keyof Type, string>}Changed`, callback: (newValue: any) => void): void;
    };
```

使用这种方式，在我们使用错误的事件名时，TypeScript 会给出报错：

```typescript
    const person = makeWatchedObject({
    firstName: "Saoirse",
    lastName: "Ronan",
    age: 26
    });
    
    person.on("firstNameChanged", () => {});
    
    // Prevent easy human error (using the key instead of the event name)
    person.on("firstName", () => {});
    // Argument of type '"firstName"' is not assignable to parameter of type '"firstNameChanged" | "lastNameChanged" | "ageChanged"'.
    
    // It's typo-resistant
    person.on("frstNameChanged", () => {});
    // Argument of type '"frstNameChanged"' is not assignable to parameter of type '"firstNameChanged" | "lastNameChanged" | "ageChanged"'.
```

### 模板字面量的推断（Inference with Template Literals）

现在我们来实现第二点，回调函数传入的值的类型与对应的属性值的类型相同。我们现在只是简单的对 `callBack` 的参数使用 `any` 类型。实现这个约束的关键在于借助泛型函数：

1.  捕获泛型函数第一个参数的字面量，生成一个字面量类型
2.  该字面量类型可以被对象属性构成的联合约束
3.  对象属性的类型可以通过索引访问获取
4.  应用此类型，确保回调函数的参数类型与对象属性的类型是同一个类型

```typescript
    type PropEventSource<Type> = {
    on<Key extends string & keyof Type>
    (eventName: `${Key}Changed`, callback: (newValue: Type[Key]) => void ): void;
    };
    
    declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>;
    
        const person = makeWatchedObject({
        firstName: "Saoirse",
        lastName: "Ronan",
        age: 26
        });
        
            person.on("firstNameChanged", newName => {
            // (parameter) newName: string
            console.log(`new name is ${newName.toUpperCase()}`);
            });
            
                person.on("ageChanged", newAge => {
                // (parameter) newAge: number
                    if (newAge < 0) {
                    console.warn("warning! negative age");
                }
                })
```

这里我们把 `on` 改成了一个泛型函数。

当一个用户调用的时候传入 `"firstNameChanged"`，TypeScript 会尝试着推断 `Key` 正确的类型。它会匹配 `key` 和 `"Changed"` 前的字符串 ，然后推断出字符串 `"firstName"` ，然后再获取原始对象的 `firstName` 属性的类型，在这个例子中，就是 `string` 类型。

内置字符操作类型（Intrinsic String Manipulation Types）
---------------------------------------------

TypeScript 的一些类型可以用于字符操作，这些类型处于性能的考虑被内置在编译器中，你不能在 `.d.ts` 文件里找到它们。

### Uppercase

把每个字符转为大写形式：

```typescript
type Greeting = "Hello, world"
type ShoutyGreeting = Uppercase<Greeting>
// type ShoutyGreeting = "HELLO, WORLD"

type ASCIICacheKey<Str extends string> = `ID-${Uppercase<Str>}`
type MainID = ASCIICacheKey<"my_app">
// type MainID = "ID-MY_APP"
```

### Lowercase

把每个字符转为小写形式：

```typescript
type Greeting = "Hello, world"
type QuietGreeting = Lowercase<Greeting>
// type QuietGreeting = "hello, world"

type ASCIICacheKey<Str extends string> = `id-${Lowercase<Str>}`
type MainID = ASCIICacheKey<"MY_APP">
// type MainID = "id-my_app"
```

### Capitalize

把字符串的第一个字符转为大写形式：

```typescript
type LowercaseGreeting = "hello, world";
type Greeting = Capitalize<LowercaseGreeting>;
// type Greeting = "Hello, world"
```

### Uncapitalize

把字符串的第一个字符转换为小写形式：

```typescript
type UppercaseGreeting = "HELLO WORLD";
type UncomfortableGreeting = Uncapitalize<UppercaseGreeting>;
// type UncomfortableGreeting = "hELLO WORLD"
```

### 字符操作类型的技术细节

从 TypeScript 4.1 起，这些内置函数会直接使用 JavaScript 字符串运行时函数，而不是本地化识别 (locale aware)。

```typescript
    function applyStringMapping(symbol: Symbol, str: string) {
        switch (intrinsicTypeKinds.get(symbol.escapedName as string)) {
        case IntrinsicTypeKind.Uppercase: return str.toUpperCase();
        case IntrinsicTypeKind.Lowercase: return str.toLowerCase();
        case IntrinsicTypeKind.Capitalize: return str.charAt(0).toUpperCase() + str.slice(1);
        case IntrinsicTypeKind.Uncapitalize: return str.charAt(0).toLowerCase() + str.slice(1);
    }
    return str;
}
```

TypeScript 系列
-------------

TypeScript 系列文章由官方文档翻译、重难点解析、实战技巧三个部分组成，涵盖入门、进阶、实战，旨在为你提供一个系统学习 TS 的教程，全系列预计 40 篇左右。[点此浏览全系列文章，并建议顺便收藏站点。](https://link.juejin.cn?target=http%3A%2F%2Fts.yayujs.com%2F "http://ts.yayujs.com/")

微信：「mqyqingfeng」，加我进冴羽唯一的读者群。

如果有错误或者不严谨的地方，请务必给予指正，十分感谢。如果喜欢或者有所启发，欢迎 star，对作者也是一种鼓励。