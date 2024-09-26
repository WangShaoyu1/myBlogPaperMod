---
author: "刘小灰"
title: "这些原生DOM操作你还记住多少😨"
date: 2021-05-25
description: "前言最近在二次封装一个公司内部的UI组件库，其中一个模块就是给element-plus的message进行扩展，大量运用到了原生DOM操作"
tags: ["前端"]
ShowReadingTime: "阅读6分钟"
weight: 749
---
前言
--

最近在二次封装一个公司内部的UI组件库，其中一个模块就是给 `element-plus` 的 `message` 进行扩展，大量运用到了原生DOM操作，操作DOM最方便的方式就是使用 `jquery` ,但是写个vue组件还引用 `jquery`,这是在侮辱`vue`吗，最后还的靠原生js来实现。

但是说实话，在现在框架横行的时代，你有多长时间没有写过原生js了？笔者是很久了，有些原生的api再不写真的就忘记了，所以让我们动起来，回顾下那些熟悉又陌生的api吧！

常见DOM操作
-------

### 获取查找DOM元素

#### Ele.getElementById(idName)

通过id查找元素。返回的是元素DOM，如果页面上有多个相同ID的元素，则只会返回第一个元素，不会返回多个（原则上ID只有一个，但伟大的程序员们。。。）

#### Ele.getElementsByClassName(className)

通过class查找。返回的是[类数组](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FTyped_arrays "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Typed_arrays")结构，要想进行forEach遍历，需要先转化为数组结构

js

 代码解读

复制代码

`const doms = document.getElementsByClassName('xxx') const domsArr = Array.from(doms) domsArr.forEach(dom=>{})`

#### Ele.getElementsByTagName(tagName)

更具标签名获取元素，使用方式和getElementsByClassName一样。

#### Ele.querySelector(selectors) | Ele.querySelectorAll(selectors)

这两个是唯一支持使用选择器来查找元素的api，有个这个api我们在进行深层次查找的时候方便很多

html

 代码解读

复制代码

`<div class="warp">     <p>name<p>     <p>age<p> <div> <p>...</p> <script> // 目标 获取到warp下面的p元素 1. 不使用querySelectorAll cons warp = document.getElementsByClassName("warp")[0]; const allp =  warp.getElementsByTagName(p) 2. 使用querySelectorAll const allp = document.querySelectorAll(".warp p")   </script>`

querySelector 获取单个元素，querySelectorAll 获取多个元素返回类数组结构

### 给DOM增加样式

#### 给元素增加样式

js

 代码解读

复制代码

`Ele.style.width = xxx`

#### 给元素增加class

js

 代码解读

复制代码

`Ele.className='aaa'  // 设置元素的class为aaa ，如果元素上原本有class则会覆盖 Ele.classList.add("aaa") // 给Ele新增aaa Ele.className += " aaa"  // 给Ele新增aaa`

#### 判断元素上是否有某个属性

js

 代码解读

复制代码

`Ele.classList.contains("aaa")  // 如果Ele上面的class类名是aaa返回true，否则返回false`

### 操作DOM上的属性

#### 新增属性

js

 代码解读

复制代码

`Ele.setAttribute("data-id", 1);`

#### 获取属性的值

js

 代码解读

复制代码

`Ele.getAttribute("data-id");`

#### 删除属性

js

 代码解读

复制代码

`Ele.removeAttribute("data-id");`

### 面向dom元素的增删改查

#### 创建DOM元素

js

 代码解读

复制代码

 `const p = document.createElement("p");`

#### 删除DOM元素

js

 代码解读

复制代码

 `Ele.remove(); // 删除ELe    Ele.removeChild(clildEle) // 删除ELe中的子元素 childEle`

#### 复制DOM

Ele.cloneNode( true | false )

js

 代码解读

复制代码

`const box = document.getElementsByClassName("box")[0]; const p = document.createElement("p"); p.innerText = "欢迎关注码不停息微信公众号"; const p2 = p.cloneNode(true); // 复制一个p  参数true标识深度复制，如果p里面有子节点也复制过来 box.appendChild(p); box.appendChild(p2);`

如图，有得到了两个p标签，并都显示到了页面上去

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7632cece73540cf96e6db8b7ccc822c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### 插入DOM

js

 代码解读

复制代码

`Ele.appendChild(ele) 在Ele的最后插入ele Ele.insertBefore(newele,ele) // 在Ele元素中的 ele元素前插入 newele`

#### 替换DOM

parentEle.replaceChild(newEle,oldEle)

js

 代码解读

复制代码

  `<body>     <div class="box">       <h1>微信公众号</h1>     </div>     <button id="btn">变换</button>     <script>       const btnDom = document.getElementById("btn");       const box = document.getElementsByClassName("box")[0];       const h1 = document.getElementsByTagName("h1")[0];       const h2 = document.createElement("h2");       h2.innerText = "码不停息";       btnDom.onclick = function () {         box.replaceChild(h2, h1);       };     </script>   </body>`

#### 删除DOM

js

 代码解读

复制代码

`EleParent.removeChild(ele) // 删除EleParent中的ele元素`

#### 遍历DOM

*   parentNode

查找指定节点的父节点

*   nextSibling

查找指定节点的下一个节点

*   previousSibling

查找指定节点的上一个节点

*   firstChild

查找指定节点的第一个字节点

*   lastChild

查找指定节点的最后一个字节点

*   childElementCount

返回子元素的个数，不包括文本节点和注释

*   firstElementChild

返回第一个子元素

*   lastElementChild

返回最后一个子元素

*   previousElementSibling

返回前一个相邻兄弟元素

*   nextElementSibling

返回后一个相邻兄弟元素

> 值得注意的是节点和元素并不相等

html

 代码解读

复制代码

`<body>     <div id="box">       <p>文件</p>       <p>文件</p>     </div>     <script>       const box = document.getElementById("box");       console.log(box.firstChild); // 打印 text节点（换行）       console.log(box.firstElementChild); // 打印p标签     </script>  </body>`

#### 判断元素节点类型

nodeType，一共有12种类型，见[W3C](https://link.juejin.cn?target=https%3A%2F%2Fwww.w3school.com.cn%2Fjsref%2Fprop_node_nodetype.asp "https://www.w3school.com.cn/jsref/prop_node_nodetype.asp")

html

 代码解读

复制代码

  `<body>     <div id="box">       <p>文件</p>       <p>文件</p>     </div>     <script>       const box = document.getElementById("box");       console.log(box.firstChild.nodeType); // 3 文本       console.log(box.firstElementChild.nodeType); // 1 元素     </script>   </body>`

获取浏览器宽高大满贯
----------

### 获取实际屏幕宽高

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f06e07b54c2a423d82e760a8f081e5ff~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

js

 代码解读

复制代码

`const W  =  window.screen.width  const H  =  window.screen.height`

### 获取浏览器宽高

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c28ab9b85d14e7586a4797aa0270d7c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

js

 代码解读

复制代码

`const W = window.outerWidth; const H = window.outerHeight;`

### 获取当前窗口宽高（浏览器视口宽高）

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/760287b9d0524aab97103bc8db2f959f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

js

 代码解读

复制代码

`const W = window.innerWidth; const H = window.innerHeight;`

### 获取元素布局宽高

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d18f997133114c789cadc5182e5ebf1d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

js

 代码解读

复制代码

`const W = element.offsetWidth; const H = element.offsetHeight;`

### 获取元素内容宽高

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e36a0cb304e4869976593b1a1480d9d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

js

 代码解读

复制代码

`const W = element.scrollWidth; const H = element.scrollHeight;`

### 获取滚动后被隐藏页面的宽高

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0cdbdc3f04ae4d9db67aca96c0a17923~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

js

 代码解读

复制代码

`const H = document.documentElement.scrollTop; const W = document.documentElement.scrollLeft`

### 获取元素距离顶部和左边距离

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7caa566dd94d4f6aad2aa3b6fb365a58~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

js

 代码解读

复制代码

`const top = Ele.offsetTop; const left = Ele.offsetLeft`

浏览器原生事件盘点
---------

### 鼠标事件

#### 事件集合

*   单击事件

js

 代码解读

复制代码

`Ele.onclick = function () {     console.log("onclick");  };`

*   双击事件

js

 代码解读

复制代码

`Ele.ondblclick = function () {     console.log("ondblclick");  };`

*   右击事件

js

 代码解读

复制代码

`Ele.oncontextmenu = function () {     console.log("oncontextmenu");  };`

*   鼠标按下事件

js

 代码解读

复制代码

`Ele.onmousedown = function () {     console.log("onmousedown");  };`

*   鼠标移动事件

js

 代码解读

复制代码

`Ele.onmousemove = function () {     console.log("onmousemove");  };`

*   鼠标抬起事件

js

 代码解读

复制代码

`Ele.onmouseup = function () {     console.log("onmouseup");  };`

*   鼠标进来事件

js

 代码解读

复制代码

`// 鼠标移动到自身时候会触发事件，同时移动到其子元素身上也会触发事件 Ele.onmouseover = function () {     console.log("onmouseover");  }; // 鼠标移动到自身是会触发事件，但是移动到其子元素身上不会触发事件  Ele.onmouseenter = function () {     console.log("onmouseenter");  };`

*   鼠标离开事件

js

 代码解读

复制代码

`// 鼠标移动到自身时候会触发事件，同时移动到其子元素身上也会触发事件 Ele.onmouseout = function () {     console.log("onmouseout");  };  // 鼠标移动到自身是会触发事件，但是移动到其子元素身上不会触发事件  Ele.onmouseleave = function () {     console.log("onmouseleave");  };`

#### 基于鼠标事件完成拖拽

![qw00d-d0jqo.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f8cfa65f59748b8aeedab6b5b627873~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

js

 代码解读

复制代码

  `const box = document.getElementById("box");   let nowW, nowH, flag;   box.onmousedown = function (e) {     nowW = e.clientX;     nowH = e.clientY;     flag = true;     document.onmousemove = function (e) {       if (!flag) return false;       const moveX = e.clientX - nowW;       const moveY = e.clientY - nowH;       const left = parseInt(box.style.left || 0);       const top = parseInt(box.style.top || 0);       box.style.left = left + moveX + "px";       box.style.top = top + moveY + "px";       nowW = e.clientX;       nowH = e.clientY;     };     document.onmouseup = function () {       flag = false;     };     document.onmouseleave = function () {       flag = false;     };   };`

#### 基于鼠标事件完成自定义右键

![w6pys-l06lx.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67dc03275bdf436d980baabfc6288b04~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

html

 代码解读

复制代码

`<body>     <div id="box"></div>     <div id="option">       <div class="item">复制</div>       <div class="item">放大</div>       <div class="item">搜索</div>     </div>     <script>       const box = document.getElementById("box");       const option = document.getElementById("option");       box.oncontextmenu = function (e) {         const x = e.clientX;         const y = e.clientY;         option.style.display = "block";         option.style.top = y + "px";         option.style.left = x + "px";         return false;       };       option.onclick = function () {         this.style.display = "none";       };     </script>   </body>`

### 键盘事件

#### 事件集合

*   keydown：当用户按下键盘上的任意键时触发，而且如果按住按住不放的话，会重复触发此事件。
*   keypress：当用户按下键盘上的字符键时触发（就是说用户按了一个能在屏幕上输出字符的按键keypress事件才会触发），而且如果按住不放的，会重复触发此事件（按下Esc键也会触发这个事件）。
*   keyup：当用户释放键盘上的键时触发。

#### 基于键盘事件完成使用方向键移动div

![t2wmh-qbf80.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a2f4fae6008436e8efa51bb8f5c4a2f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

js

 代码解读

复制代码

`<body>     <div id="box">       <div id="move">静止</div>     </div>     <script>       const box = document.getElementById("box");       const move = document.getElementById("move");       let lefts = box.style.left || 0;       let tops = box.style.top || 0;       document.addEventListener("keydown", function (e) {         const code = e.keyCode;         move.innerHTML = "开始移动";         switch (code) {           case 38:             move.innerHTML = "上";             tops -= 5;             break;           case 40:             move.innerHTML = "下";             tops += 5;             break;           case 37:             move.innerHTML = "左";             lefts -= 5;             break;           case 39:             move.innerHTML = "右";             lefts += 5;             break;           default:             break;         }         box.style.top = tops + "px";         box.style.left = lefts + "px";       });       document.addEventListener("keyup", function () {         move.innerHTML = "静止";       });       document.addEventListener("keypress", function () {         console.log("keypress");       });     </script>   </body>`

### 表单事件

*   submit：表单提交
*   reset：表单重置
*   change：值发生改变
*   blur：离焦（不会冒泡）
*   focus：聚焦（不会冒泡）

### window

window 事件指的是浏览器窗口本身而不是窗口内的文档对象。

*   onload：当文档和资源加载完成后调用
*   unload：当用户离开当前文档转而其他文档时调用
*   resize：浏览器窗口改变

### 其他事件

*   beforeunload：关闭浏览器窗口之前触发的事件
*   DOMContentLoaded：文档对象加载完成之后就触发的事件，无需等待样式、图片等资源
*   readystatechange：document有 readyState 属性来描述 document 的 loading状态，readyState 的改变会触发 readystatechange 事件

> document.readyState === 'complete' 页面已加载完毕 document.readyState === 'loading' 页面正在加载

*   pageShow 和 pagehide：每次用户浏览关闭页面时触发

Javascript原生对象盘点
----------------

### 时间对象Date

#### 常用的一些方法

*   toLocaleDateString()：根据本地时间格式，把Date对象的日期部分转化为字符串
    
*   toLocaleTimeString()：根据本地时间格式，把Date对象的时间部分转化为字符串
    
*   toLocaleString()：根据本地时间格式，把Date对象转化为字符串
    
*   getTime()：获取当前时间戳
    

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7f1a0fa93a940a798a16bdb9258a77b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### 时间戳转换为时间

js

 代码解读

复制代码

      `function timestampToTime(timestamp) {         if (typeof timestamp != "number") return false;         if (timestamp.length === 10) timestamp = timestamp * 1000;         const date = new Date(timestamp);         Y = date.getFullYear() + "-";         M =           (date.getMonth() + 1 < 10             ? "0" + (date.getMonth() + 1)             : date.getMonth() + 1) + "-";         D = (date.getDate() < 9 ? "0" + date.getDate() : date.getDate()) + " ";         h =           (date.getHours() < 9 ? "0" + date.getHours() : date.getHours()) + ":";         m =           (date.getMinutes() < 9             ? "0" + date.getMinutes()             : date.getMinutes()) + ":"; s = date.getSeconds() < 9 ? "0" + date.getSeconds() : date.getSeconds();         return Y + M + D + h + m + s;       }`

#### 时间转化为时间戳

js

 代码解读

复制代码

  `function timeToTimestamp(time){     const date = new Date(time);     return date.getTime()   }`

### Math对象

*   Math.abs()：取绝对值

js

 代码解读

复制代码

   `Math.abs(-1)  // 1`

*   Math.ceil()：向上取整

js

 代码解读

复制代码

   `Math.ceil(1.1)  // 2`

*   Math.floor()：向下取整

js

 代码解读

复制代码

   `Math.floor(1.1)  // 1`

*   Math.round()：四舍五入

js

 代码解读

复制代码

   `Math.round(1.5)  // 2`

*   Math.max()：取最大值

js

 代码解读

复制代码

   `Math.max(1，2，3)  // 3`

*   Math.min()：取最小值

js

 代码解读

复制代码

   `Math.min(1，2，3)  // 1`

*   Math.random()：产生0-1的随机数

js

 代码解读

复制代码

   `Math.random()` 

*   Math.pow()：次方

js

 代码解读

复制代码

   `Math.pow(2,3)  // == 2*2*2 == 8`

*   Math.sqrt()：平方根

js

 代码解读

复制代码

   `Math.sqrt(36)  // 6`

最后
--

此篇文章大概整理了我们在工作中经常会用到的一些“面向JavaScript编程”的操作，可能有不足之处，后期会逐渐完善，欢迎点赞+关注😘