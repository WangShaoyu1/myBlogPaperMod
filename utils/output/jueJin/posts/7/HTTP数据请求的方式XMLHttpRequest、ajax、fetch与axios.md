---
author: "Gaby"
title: "HTTP数据请求的方式XMLHttpRequest、ajax、fetch与axios"
date: 2021-08-17
description: "知其然知其所以然，关于HTTP数据请求的方式XMLHttpRequest、ajax、fetch与axios，一文全掌握。"
tags: ["面试中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:14,comments:0,collects:38,views:3154,"
---
**这是我参与8月更文挑战的第15天，活动详情查看：[8月更文挑战](https://juejin.cn/post/6987962113788493831 "https://juejin.cn/post/6987962113788493831")**

原生 XMLHttpRequest
-----------------

### 一、什么是XMLHttpRequest?

XHR英文全名XmlHttpRequest，中文可以解释为可扩展超文本传输请求。Xml可扩展标记语言，Http超文本传输协议，Request请求。XMLHttpRequest对象可以在不向服务器提交整个页面的情况下，实现局部更新网页。当页面全部加载完毕后，客户端通过该对象向服务器请求数据，服务器端接受数据并处理后，向客户端反馈数据。 XMLHttpRequest 对象提供了对 HTTP 协议的完全的访问，包括做出 POST 和 HEAD 请求以及普通的 GET 请求的能力。XMLHttpRequest 可以同步或异步返回 Web 服务器的响应，并且能以文本或者一个 DOM 文档形式返回内容。尽管名为 XMLHttpRequest，它并不限于和 XML 文档一起使用：它可以接收任何形式的[文本文档](https://link.juejin.cn?target=https%3A%2F%2Fbaike.baidu.com%2Fitem%2F%25E6%2596%2587%25E6%259C%25AC%25E6%2596%2587%25E6%25A1%25A3%2F557654 "https://baike.baidu.com/item/%E6%96%87%E6%9C%AC%E6%96%87%E6%A1%A3/557654")。XMLHttpRequest 对象是名为 AJAX 的 Web 应用程序架构的一项关键功能，XMLHttpRequest 对象用于在后台与服务器交换数据，所有现代的浏览器都支持 XMLHttpRequest 对象。

![image.png](/images/jueJin/632674a48661477.png)

### 二、XMLHttpRequest能干什么？

1、在不重新加载页面的情况下更新网页  
2、在页面已加载后从服务器请求数据  
3、在页面已加载后从服务器接收数据  
4、在后台向服务器发送数据

### 三、XMLHttpRequest的open()和send()方法

1.  open(method,url,async)方法
    
    method:请求类型（GET或POST）  
    url:文件在服务器上的位置  
    async:ture(异步)或 false(同步)
    
2.  send(string)方法
    
    string:仅用于POST请求
    

### 四、XMLHttpRequest 对象的重要属性：

（1）readyState存有XMLHttpRequest 的状态，0~4。

         0——请求未初始化

         1——服务器连接已经建立

         2——请求已接受

         3——请求处理中

         4——请求已完成，且响应已就绪。

（2）status，HTTP的特定状态码：

　　100-199：信息性的标示用户应该采取的其他动作。

　　200-299：表示请求成功。

　　300-399：用于那些已经移走的文件，常常包括Location报头，指出新的地址。

　　400-499：表明客户引发的错误。

　　500-599：由服务器引发的错误。

### 五、原生XMLHttpRequest代码实现

```js
//创建XMLHttpRequest对象
var xhr;
    if(window.XMLHttpRequest){
    //IE7+,Firefox，Chrome，Opera,Safari 执行
    xhr = new XMLHttpRequest();
        }else{
        // IE6,IE5 执行
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    // GET 请求
    xhr.open("GET","url",true);
    xhr.send();
    
    // POST 请求
    xhr.open("POST","url",true);
    xhr.send();
    
    //如果需要传参，则需要使用setRequestHeader() 来添加HTTP 头部
    xhr.open("POST","url",true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send("name=tome&age=24");
    
    // 通过 onreadystatechange  事件来监听状态变化，并获取服务器响应
        xhr.onreadystatechange = function(){
        //请求成功时
            if(xhr.readyState == 4 && xhr.status == 200){
            alert(xhr.responseText);
        }
    }
```

### 六、优缺点

优点： 1.不重新加载页面的情况下更新网页 2.在页面已加载后从服务器请求/接收数据 3.在后台向服务器发送数据。 缺点： 1.使用起来也比较繁琐，需要设置很多值。 2.早期的IE浏览器有自己的实现，这样需要写兼容代码。

Ajax
----

### Ajax 的概念

Ajax是对Asynchronous JavaScript + XML(异步JavaScript和XML）的简写，其本身不是一种新技术，而是一个在 2005年被Jesse James Garrett提出的新术语，用来描述一种使用现有技术集合的‘新’方法，包括: [HTML](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FHTML "https://developer.mozilla.org/en-US/docs/Web/HTML") 或 [XHTML](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FGlossary%2FXHTML "https://developer.mozilla.org/en-US/docs/Glossary/XHTML"),  [CSS](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FCSS "https://developer.mozilla.org/zh-CN/docs/Web/CSS"), [JavaScript](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript "https://developer.mozilla.org/en-US/docs/Web/JavaScript"), [DOM](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FDocument_Object_Model "https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model"), [XML](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FXML "https://developer.mozilla.org/en-US/docs/Web/XML"), [XSLT](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FXSLT "https://developer.mozilla.org/en-US/docs/Web/XSLT"), 以及最重要的 [`XMLHttpRequest`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FXMLHttpRequest "https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest")。这一技术能够向服务器请求额外的数据而无需卸载页面，会带来很好的用户体验。Ajax技术的核心是XMLHttpRequest(简称XHR)对象，XHR为向服务器发送请求和解析服务器响应提供了流畅的接口，能够以异步方式从服务器府区区获取更多信息而不必刷新页面。

### Ajax 的作用

*   [分析和操纵服务器响应](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FXMLHttpRequest%2FUsing_XMLHttpRequest%23handling_responses "https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#handling_responses")
*   [监控请求过程](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FXMLHttpRequest%2FUsing_XMLHttpRequest%23monitoring_progress "https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#monitoring_progress")
*    [提交表单或者上传二进制文件](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FDOM%2FXMLHttpRequest%2FUsing_XMLHttpRequest%23%25E6%258F%2590%25E4%25BA%25A4%25E8%25A1%25A8%25E5%258D%2595%25E5%2592%258C%25E4%25B8%258A%25E4%25BC%25A0%25E6%2596%2587%25E4%25BB%25B6 "https://developer.mozilla.org/zh-CN/docs/DOM/XMLHttpRequest/Using_XMLHttpRequest#%E6%8F%90%E4%BA%A4%E8%A1%A8%E5%8D%95%E5%92%8C%E4%B8%8A%E4%BC%A0%E6%96%87%E4%BB%B6")– 使用纯Ajax或者[`FormData`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FFormData "https://developer.mozilla.org/zh-CN/docs/Web/API/FormData")对象
*   [创建异步或同步请求](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FXMLHttpRequest%2FUsing_XMLHttpRequest%23types_of_requests "https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#types_of_requests")
*   在[Web workers](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWeb_Workers_API "https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API")中使用Ajax

```js
    function success(text) {
    var textarea = document.getElementById('test-response-text');
    textarea.value = text;
}

    function fail(code) {
    var textarea = document.getElementById('test-response-text');
    textarea.value = 'Error code: ' + code;
}

//创建XMLHttpRequest对象
var request;
    if(window.XMLHttpRequest){
    //IE7+,Firefox，Chrome，Opera,Safari 执行
    request = new XMLHttpRequest();
        }else{
        // IE6,IE5 执行
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    request.onreadystatechange = function () { // 状态发生变化时，函数被回调
    if (request.readyState === 4) { // 成功完成
    // 判断响应结果:
        if (request.status === 200) {
        // 成功，通过responseText拿到响应的文本:
        return success(request.responseText);
            } else {
            // 失败，根据响应码判断失败原因:
            return fail(request.status);
        }
            } else {
            // HTTP请求还在继续...
        }
    }
    
    // 发送请求:
    request.open('GET', '/api/categories');
    request.send();
```

jQuery $.ajax
-------------

为了更快捷的操作DOM，并且规避一些浏览器兼容问题，产生了jQuery。【它里面的AJAX请求也兼容了各浏览器，可以有简单易用的方法.get，.post。简单点说，就是 XMLHttpRequest对象的封装。】

**优点**：  
1.对原生XHR的封装，做了兼容处理，简化了使用。  
2.增加了对JSONP的支持，可以简单处理部分跨域。

**缺点**：  
1.如果有多个请求，并且有依赖关系的话，容易形成回调地狱。  
2.本身是针对MVC的编程，不符合现在前端MVVM的浪潮。  
3.ajax是jQuery中的一个方法。如果只是要使用ajax却要引入整个jQuery非常的不合理。

```js
    $.ajax({
    type:'POST,
    url:'http://users/mine',
    data: data,
    dataType:dataType,
    success: function (){},
error:function (){}
})
```

Fetch
-----

### Fetch 的概念

**fetch号称是AJAX的替代品，是在ES6出现的，使用了ES6中的promise对象**。Fetch是基于promise设计的。Fetch的代码结构比起ajax简单多了，参数有点像jQuery ajax。但是，一定记住fetch不是ajax的进一步封装，而是原生js，没有使用XMLHttpRequest对象。  
fetch的优点：  
1.符合关注分离，没有将输入、输出和用事件来跟踪的状态混杂在一个对象里  
2.更好更方便的写法,fetch的优势主要优势就是：

### Fetch 与 Ajax 对比

```js
// 1.`XMLHttpRequest` 请求数据
var xhr = new XMLHttpRequest();
xhr.open('GET', url);
xhr.responseType = 'json';

    xhr.onload = function() {
    console.log(xhr.response);
    };
    
        xhr.onerror = function() {
        console.log("Oops, error");
        };
        
        xhr.send();
        
        // 2. `fetch`请求数据
        fetch(url)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(e => console.log("Oops, error", e))
```

两段代码相比之下，`fetch`更为简洁，而且`fetch`请求属于`promise`结构，直接`.then()`方法处理回调数据，当出错时，会执行`catch`方法,而且`promise`避免了回调金字塔的问题

### `fetch`请求的四种方式

#### get请求

```js
fetch(url)
.then(response => response.json())
.then(data => console.log(data))
.catch(e => console.log("Oops, error", e))
```

如果需要传递参数，需要拼接在`url`。后面这里的调用的第一个`then`函数里面，返回结果是一个可读流形式.如果请求的是json数据，需要调用`response.json()`(这里的`response`是传递的参数)将可读流解析为json数据，在下一个`then`方法中，就可以得到想要的json数据了。同理，如果请求的txt文本数据，则需要调用`response.text()`来解析...更多调用的解析方法如下：

```js
response.arrayBuffer()
读取 Response对象并且将它设置为已读（因为Responses对象被设置为了 stream 的方式，所以它们只能被读取一次） ,并返回一个被解析为ArrayBuffer格式的promise对象

response.blob()
读取 Response对象并且将它设置为已读（因为Responses对象被设置为了 stream 的方式，所以它们只能被读取一次） ,并返回一个被解析为Blob格式的promise对象

response.formData()
读取Response对象并且将它设置为已读（因为Responses对象被设置为了 stream 的方式，所以它们只能被读取一次） ,并返回一个被解析为FormData格式的promise对象

response.json()
读取 Response对象并且将它设置为已读（因为Responses对象被设置为了 stream 的方式，所以它们只能被读取一次） ,并返回一个被解析为JSON格式的promise对象

response.text()
读取 Response对象并且将它设置为已读（因为Responses对象被设置为了 stream 的方式，所以它们只能被读取一次） ,并返回一个被解析为USVString格式的promise对象
```

##### post请求

```js
    fetch(url,{
    method:'POST',
        headers:{
        'Content-type':'application/json'// 设置请求头数据类型
        },
        body:data
        })
        .then(res=>res.json())
        .then(data=>console.log(data))
```

`method`：设置设置请求的方式，默认是`get`，另外还有`PUT`、`DELETE`  
`headers`：设置请求头信息，当然，这里面还可以设置别的信息  
`fetch`请求默认是不会携带`cookie`信息，如果想要携带，需要在手动设置

#### put请求

```js
    fetch(url,{
    method:'PUT',
        headers:{
        'Content-type':'application/json'// 设置请求头数据类型
        },
        body:data
        })
        .then(res=>res.json())
        .then(data=>console.log(data))
```

#### delete请求

```js
    fetch(url,{
    method:'DELETE',
        headers:{
        'Content-type':'application/json'// 设置请求头数据类型
        },
        body:data
        })
        .then(res=>res.json())
        .then(data=>console.log(data))
```

axios
-----

Axios是一个基于promise的HTTP库，可以用在浏览器和node.js中。它本质也是对原生XMLHttpRequest的封装，只不过它是Promise的实现版本，符合最新的ES规范 【Vue2.0之后，尤雨溪推荐大家使用axios来请求数据。】

**优点**：  
1.从浏览器中创建XMLHttpRequests  
2.从node.js创建http请求  
3.支持Promise API  
4.拦截请求和响应