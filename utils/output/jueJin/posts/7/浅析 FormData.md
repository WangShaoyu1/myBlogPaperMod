---
author: "政采云技术"
title: "浅析 FormData"
date: 2022-01-26
description: "前因 在日常开发中都是使用公司内部封装好的 request，一直没太注意请求参数类型，源于一次常规需求， 服务端提出：之前的请求参数有问题，需要调整，经过排查后发现之前的 Request Header"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:170,comments:8,collects:208,views:14910,"
---
![](/images/jueJin/d4eb6a01e656484.png)

![的卢.png](/images/jueJin/542c31f1efad4f5.png)

> 这是第 132 篇不掺水的原创，想获取更多原创好文，请搜索公众号关注我们吧~ 本文首发于政采云前端博客：[浅析 FormData](https://link.juejin.cn?target=https%3A%2F%2Fwww.zoo.team%2Farticle%2Fformdata "https://www.zoo.team/article/formdata")

![](/images/jueJin/63995f40d63d445.png)

前因
--

在日常开发中都是使用公司内部封装好的 `request`，一直没太注意请求参数类型，源于一次常规需求， 服务端提出：之前的请求参数有问题，需要调整，经过排查后发现之前的 `Request Headers` 的 `Content-Type` 字段值为 `application/json` ，与服务端解码规则不同，可见这篇文章《[SpringBoot 是如何解析参数的](https://juejin.cn/post/6844903841775747079 "https://juejin.cn/post/6844903841775747079")》，需要更改为 `multipart/form-data`，配合改完后，问题解决，也顺便总结一下。

简单介绍 RESTful
------------

我们现在常用的互联网软件架构 [RESTful](https://link.juejin.cn?target=https%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2011%2F09%2Frestful.html "https://www.ruanyifeng.com/blog/2011/09/restful.html") ，有一些规则和约束，比如：协议、域名、版本、路径、`HTTP 动词`、状态码等，本文主要总结 `HTTP 动词` 的部分内容，也就是 `HTTP` 请求方法，我们常用的请求方法有 `GET`、`POST`、`PUT` 等，`GET` 请求大家应该比较熟悉，一般是用于获取资源，客户端 通过 `URL` 传参，但由于请求 `URL` 的长度限制，参数比较少的时候可以使用，比如一些简单的列表页等。而 `POST` 就稍稍复杂一点了，一般是用于提交数据，客户端是通过 `Request Body` 传参，该请求方式在实际业务场景（特别是在中后台系统中）应用广泛，下面我们就以常见的 `POST` 请求为例简单介绍 `FormData` 的使用场景。

引入 `FormData`
-------------

很多时候，在 `post` 提交数据时我们常采用 `application/json`、`application/x-www-form-urlencoded` 等类型，也确实能够覆盖到大部分的场景，但是有一些场景下，比如文件上传的时候，就不算是好的解决方案了，`application/json` 作为请求头 `Content-Type` 字段值时，表示告知服务端参数是序列化后的 `JSON` 字符串，所以一般在传参时都会用 `JSON.stringify` 序列化一下，且浏览器对 [JSON.stringify API](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FJSON%2Fstringify "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify") 支持程度比较高，但是 `JSON.stringify` 在转换某一些数据结构时会出问题，比如 会丢失 function 类型的参数、循环引用时会报错、`Blob` /`File` 对象会被转化成 `{}` 等等，，可以参考 [为何不推荐使用 JSON.stringify 做深拷贝](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000023595021 "https://segmentfault.com/a/1190000023595021")，不过 `JSON.stringify` 还有第三个参数，有兴趣的同学可以去了解下，这是其一，其二，有同学要说了，如果要是图片那可以转换成 `base64` 格式进行上传解决，这种方式虽然可行，但是转换成 `base64` 格式需要很多字符，占用很多资源，而且很长，不便于阅读，另外就是服务端接收到这个参数还得解析，很麻烦，此时，`FormData` 就可用上了。

![](/images/jueJin/81618a028785428.png)

### 定义

`FormData` 这种方式相信很多同学都比较熟悉，它提供了一种表示表单数据的键值对 `key/value` 的构造方式，由名称和定义就知道 `FormData` 是专门为表单量身定做的类型，但其实其功能要比 `application/json` 强得多，比如文件上传的问题，用 `FormData` 传参能很好的解决，`window` 上也直接挂载了 [FormData](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FFormData "https://developer.mozilla.org/zh-CN/docs/Web/API/FormData") 对象，很方便我们直接使用。

我们在控制台实例化一个 `FormData` 对象，然后打印，如下

![](/images/jueJin/8e1c9e81b71b4f5.png)

### 使用

可以看到其原型上有很多的方法，个人感觉这个 `FormData` 跟 `Map` 有点像，仔细观察可以知道都有 `set`、`get`、`values`、`has` 等方法，我们平常开发主要的使用也就是 `append` 方法了，一般都会封装一层 `request`，调用层只需要传入参数的对象集合就可以。

```javascript
const specialFileType = ['Blob', 'File'];

    function formatData (_data) {
    const data = new window.FormData()
        for (const key in _data) {
    let value = _data[key]
        if (_data[key] instanceof Object && !specialFileType.includes(_data[key].constructor.name)) {
        value = JSON.stringify(_data[key])
    }
    data.append(key, value)
}
return data
}
```

### `append` or `set`

这就有同学要问了，为啥不用 `set` 方法， `MDN` 上面写的很清楚，`append` 的 `key` 存在，就会附加到已有值集合的后面，而 `set` 会使用新值覆盖已有的值，所以选择使用哪一种取决于你的需求。

![](/images/jueJin/e721d8a64bc44ec.png)

那么文章开头就说了 `FormData` 在文件上传这一块比较有优势，那么它是怎么处理的呢？`FormData` 对象能够设置三种类型的值，`string`、`Blob`、`File`，所以我们不需要转换格式，可以直接传文件，当我们传递 `File` 到 `formatData` 层，会直接被 `append` 到 `FormData` 对象里，且可以通过 `get` 获取到值，然后发送请求到服务端，我们能从浏览器入参中清晰的看到 `d` 、`e` 参数的类型是 `binary`，因为就是二进制的文件类型，这样服务端接到值之后很方便获取。

```javascript
    cosnt View = () => {
    const [fileA, setFileA] = useState(null);
    const [fileB, setFileB] = useState(null);
        const handleClick = () => {
        console.log('fileA:', fileA)
        console.log('fileB:', fileB)
            const p = {
            a: { a1: 11, a2: 22 },
            b: [1,2,3],
            c: 123,
            d: fileA[0],
            e: fileB[0],
        }
        const data = formatData(p);
            axios({
            method: 'POST',
            url: '/aa',
            data,
                // headers: {
                //   'content-type': 'multipart/formdata'
                // },
                })
            }
            
            return <div>
            <div onClick={handleClick}>发送请求</div>
            <input
            type='file'
                onChange={(a) => {
                const v = a.target.files;
                setFileA(v);
            }}
            />
            <input
            type='file'
                onChange={(a) => {
                const v = a.target.files;
                setFileB(v);
            }}
            />
            </div>
        }
```

![](/images/jueJin/13e20c8781f84f7.png)

![](/images/jueJin/1ae6c673c2b0455.png)

可以看到 每一个参数之间都有一个 `------WebKitFormBoundary ***` 区分开，这实际上是 `FormData` 的规范标志，后面的字符串是浏览器帮我们自动创建的，以 `------WebKitFormBoundary ***` 作为分隔符，也作为开始和结尾，其内容主要有 `Content-Disposition`、`Content-Type` 等，其中 `Content-Disposition` 是必选项， `name` 属性代表着表单元素的 `key`，`filename` 则是上传文件的名称，也可以使用 `FormData` 第三个参数更改 ，另外，我在发送请求时，并没有更改请求头里面的 `Content-Type`，但实际上我们看到的是正确的 `multipart/form-data`，这是因为现在的浏览器比较智能，当客户端未设置请求头的 `Content-Type` 时，请求参数为对象时，某一些浏览器会自动帮我们在 请求头中添加 `Content-Type: text/plain`，如果传输的数据是 `FormData`，也会自动帮我们加上 `Content-Type: multipart/form-data` 等，可能不同浏览器表现行为不一样，但是最好的方式就是客户端与服务端约定好 `Content-Type` 类型，固定传递。

总结
--

在我们日常开发中，现有的几种都能够满足我们的使用需求，只是在一些特殊的场景中可能会有一些偏差，具体如何使用还是要看场景，以及和服务端的约定，约定优于配置。

参考文章：
-----

[www.ruanyifeng.com/blog/2011/0…](https://link.juejin.cn?target=https%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2011%2F09%2Frestful.html "https://www.ruanyifeng.com/blog/2011/09/restful.html")

[zhuanlan.zhihu.com/p/122912935](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F122912935 "https://zhuanlan.zhihu.com/p/122912935")

[juejin.cn/post/688572…](https://juejin.cn/post/6885726248039874573 "https://juejin.cn/post/6885726248039874573")

推荐阅读
----

[在 Vue 中为什么不推荐用 index 做 key](https://juejin.cn/post/7026119446162997261 "https://juejin.cn/post/7026119446162997261")

[浅析Web录屏技术方案与实现](https://juejin.cn/post/7028723258019020836 "https://juejin.cn/post/7028723258019020836")

开源作品
----

*   政采云前端小报

**开源地址 [www.zoo.team/openweekly/](https://link.juejin.cn?target=https%3A%2F%2Fwww.zoo.team%2Fopenweekly%2F "https://www.zoo.team/openweekly/")** (小报官网首页有微信交流群)

*   商品选择 sku 插件

**开源地址 [github.com/zcy-inc/sku…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fzcy-inc%2FskuPathFinder-back "https://github.com/zcy-inc/skuPathFinder-back")**

招贤纳士
----

政采云前端团队（ZooTeam），一个年轻富有激情和创造力的前端团队，隶属于政采云产品研发部，Base 在风景如画的杭州。团队现有 60 余个前端小伙伴，平均年龄 27 岁，近 4 成是全栈工程师，妥妥的青年风暴团。成员构成既有来自于阿里、网易的“老”兵，也有浙大、中科大、杭电等校的应届新人。团队在日常的业务对接之外，还在物料体系、工程平台、搭建平台、性能体验、云端应用、数据分析及可视化等方向进行技术探索和实战，推动并落地了一系列的内部技术产品，持续探索前端技术体系的新边界。

如果你想改变一直被事折腾，希望开始能折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变既定的节奏，将会是“5 年工作时间 3 年工作经验”；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊… 如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的前端团队的成长历程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 `ZooTeam@cai-inc.com`

![](/images/jueJin/98d3aa3d1f8646a.png)