---
author: "王宇"
title: "自定义postcss插件，将gap属性转换xx，适配低端机"
date: 五月28,2024
description: "postcss"
tags: ["postcss"]
ShowReadingTime: "12s"
weight: 558
---
发现flex下的gap属性，使用各种前缀和polyfill都无法兼容低端机，只能修改写法或者使用外力解决

网上有这个**flex-gap-polyfill**但用了后都是坑

那就自己造一个简陋版的，能转换成符合几个场景使用的

[?](#)

`import postcss from` `"postcss"``;`

`const isExclude = (reg, file) => {`

  `if` `(Object.prototype.toString.call(reg) !==` `"[object RegExp]"``) {`

    `throw` `new` `Error(``"options.exclude should be RegExp."``);`

  `}`

  `return` `file.match(reg) !==` `null``;`

`};`

`const postcssGapToMargin = (opts) => {`

  `return` `{`

    `postcssPlugin:` `"postcss-gap-to-margin"``,`

    `Once(css, { result }) {`

      `css.walkRules((rule) => {`

        `const file = rule.source?.input.file ||` `""``;`

        `if` `(opts.exclude && file) {`

          `if` `(`

            `Object.prototype.toString.call(opts.exclude) ===` `"[object RegExp]"`

          `) {`

            `if` `(isExclude(opts.exclude, file))` `return``;`

          `}` `else` `if` `(`

            `// Object.prototype.toString.call(opts.exclude) === '[object Array]' &&`

            `opts.exclude` `instanceof` `Array`

          `) {`

            `for` `(let i = 0; i < opts.exclude.length; i++) {`

              `if` `(isExclude(opts.exclude[i], file))` `return``;`

            `}`

          `}` `else` `{`

            `throw` `new` `Error(``"options.exclude should be RegExp or Array."``);`

          `}`

        `}`

        `// 检查该元素的 display 是否为 'flex'`

        `let isFlex =` `false``;`

        `// 是否有gap属性值`

        `let hasGap =` `false``;`

        `let gapValue = 0;`

        `let classname =` `""``;`

        `let execute = () => {};`

        `rule.walkDecls((decl) => {`

          `if` `(decl.prop ===` `"gap"``) {`

            `hasGap =` `true``;`

            `gapValue = decl.value;`

            `execute = () => {`

              `decl.remove();`

            `};`

            `classname = decl.parent.selector;`

          `}` `else` `if` `(`

            `decl.prop ===` `"display"` `&&`

            `[``"flex"``,` `"inline-flex"``].includes(decl.value)`

          `) {`

            `isFlex =` `true``;`

          `}`

        `});`

        `if` `(isFlex && hasGap) {`

          `const newRule = postcss.rule({`

            ``selector: `${classname} > *:not(:last-child), ${classname} > *:only-child`,``

            `raw: { semicolon:` `true` `},`

          `});`

          `execute();`

          `newRule.append({`

            `prop:` `"margin-right"``,`

            `value: gapValue,`

          `});`

          `rule.after(newRule);`

        `}`

      `});`

    `},`

    `// Declaration(decl) {`

    `//     console.log('Declaration', decl)`

    `// }`

  `};`

`};`

`export` `default` `postcssGapToMargin;`

原理是将带有flex/inline-flex的父节点下面的子节点(除最后一个)增加margin-right

* * *

这个插件的工作流程如下：

1.  遍历所有的 CSS 规则。
2.  对于每个规则，检查是否有 `exclude` 选项，并且该选项是否匹配当前文件。如果匹配，则跳过此规则。
3.  检查规则是否包含 `gap` 属性和 `display` 属性（值为 `flex` 或 `inline-flex`）。如果都有，那么就会创建一个新的规则，将 `gap` 属性转换为 `margin-right` 属性，并将新规则添加到当前规则之后。

注意，这个插件只处理 `flex` 和 `inline-flex` 的元素，因为 `gap` 属性在这些元素中才有意义。

  

热知识
---

PostCSS 的 `Once` 方法是一个特殊的插件方法，它只会在 PostCSS 解析完整个 CSS 文件并生成了 CSS 抽象语法树（AST）后被调用一次。这个方法接收一个 `root` 参数，这个参数就是生成的 AST。

这个方法通常用于执行需要遍历整个 CSS 文件的操作。例如，你可能想要找出所有的颜色值并替换它们，或者你可能想要检查所有的规则并删除那些未使用的规则。

  

  

使用方式
====

**vite.config.ts**

[?](#)

`import ppgtm from` `'./plugins/postcss-gap-to-margin'`

`export` `default` `defineConfig( ({ mode, command }) => {`

`// ...`

`return` `{`

`// ...`

    `css: {`

       `postcss:{`

          `ppgtm({`

            `exclude: [/node_modules/]`

          `})`

       `}`

    `}`

`}`

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)