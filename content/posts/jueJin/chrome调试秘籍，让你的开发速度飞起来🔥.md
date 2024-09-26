---
author: "tager"
title: "chrome调试秘籍，让你的开发速度飞起来🔥"
date: 2022-09-01
description: "前言熟练使用调试工具，势必能大幅提高我们的开发效率，达到事半功倍的效果。废话不多说，直接进入主题。Filter过滤过滤器最简单的用法当然是直接输入过滤的字符，但这远远不够🤗。除了直接输入，我们还"
tags: ["前端","JavaScript","Chrome"]
ShowReadingTime: "阅读3分钟"
weight: 786
---
前言
--

熟练使用调试工具，势必能大幅提高我们的开发效率，达到事半功倍的效果。废话不多说，直接进入主题。

Filter过滤
--------

过滤器最简单的用法当然是直接输入过滤的字符，_但这远远不够_🤗。除了直接输入，我们还希望能排除不需要看到的请求、能多条件过滤、能根据指定的列过滤。输入的字符默认根据`name属性`搜索。具体方法如下：

### 1\. 排除过滤（反向搜索）

在要搜索的字符前加`-value`，表示反向搜索，如下图，过滤出name中不含png的请求： ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b7752083c864d5ca2cf12e0cbf0c863~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 2\. 多条件搜索

每个搜索间用`空格斜杆空格`隔开,如图`排除gif`并过滤出有`@`字符的请求：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9688f0b7ae734264928ce3b627199205~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 3\. 使用正则匹配

直接输入正则表达式，匹配想要的结果。  
结合反向搜索（正则表达式前加`-`，如：`-/.../`）可以排除满足正则表达式的请求。  
**此方式搜索，功能非常强大，能满足大部分搜索场景** ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/492f7ee6250840e5b1d917827782072f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 4\. 指定列搜索 或 特性搜索

搜索出大于15KB的资源，如图： ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f549adbd744442508755a18af90590f1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

其它的一些属性或特性就不一一示例了，大家可以去自行尝试： ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/286877d4c1b94b499ac3203545964b64~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 5\. Console等其它过滤框同样适用以上的搜索方式

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9488d13992249938d077704aad0596b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

debugger断点
----------

### 1\. 条件断点

满足某条件时，断点才会生效  
使用：在行号处点击右键再选择`条件断点`，再刷新页面执行并触发条件时断点。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6a36e6027d147af9e1e022136fc5aec~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 2\. 事件断点

在处理事件相关的bug时非常有用，可以在页面触发指定事件时断点，如图： ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/deeae376b9de4094b65956e9ea2ec312~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 3\. Dom节点断点

当节点发生变化时（新增、编辑、删除）断点，并且会定位到修改DOM的那一行 ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23f0d29e838f498c98ffd43cbc48774e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?) 说明：  
1.`subtree modifications` 当前DOM子节点有任何变化时触发断点  
2\. `attribute modifications` **当前DOM本身属性**有任何变化时触发断点  
3\. `node removeal` **当前DOM节点被移除**时触发断点

### 4\. 异常断点

在开发过程中一定会用到的断点，能帮助我们自动定位到异常问题，及时修复。 ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13f69630ea4a4980aeace46843b8fd7c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 5\. 其它断点

除此之外，还有XHR请求断点、vscode编辑器中的断点、sources面板上直接修改代码（spa页面需map映射到源代码）、代码片段调试等。后面有时间再继续完善。

调试小技巧
-----

1.  `$_`表示获取控制台的上一次执行结果（引用上一次的结果）  
    在了解这个以前都是复制粘贴上一次的执行结果，有了这个之后还是能提高些调试效率。  
    `$(dom)`获取第一个dom，相当于`document.querySelector`  
    `$$(dom)`获取所有dom(数组形式)，相当于`document.querySelectorAll`
2.  使用`$i`直接在控制台安装npm包  
    step1: 安装Console Importer插件  
    step2: 在控制台使用命令`$i('name')`安装npm包，如$i('dayjs')  
    在以前都要依赖项目环境来使用，有了这个就可以完全脱离项目使用npm包。
3.  重新发起请求的方式  
    在和后台联调的时候，后台经常会需要前端再点一下发送请求来debugger问题。其实大可不必，后台就能自己重发请求。

*   方式一：右键选择Replay XHR（重放XHR请求）
*   方式二：右键XHR请求， 选择 `Copy as fetch`(**可以修改参数后再执行**)，然后直接在控制台执行即可

4.  一键展开所有DOM  
    按住opt键 + click（需要展开的最外层元素）

最后
--

磨刀不误砍柴工，如果能熟练掌握Chrome调试技术，一定能让我们的工作效率大幅提升。如果觉得有帮助，不妨`点赞、关注`支持一下，后续会继续完善调试断点的相关知识点（NodeJs断点、vscode内使用断点、sources面板上修改并同步本地代码进行调试）。如文章有不足之处、疑问或建议，希望能在下方👇🏻 留言，非常感谢。

> 作者： `tager`  
> 相关文章地址：[`https://juejin.cn/user/4353721776234743/posts`](https://juejin.cn/user/4353721776234743/posts "https://juejin.cn/user/4353721776234743/posts")  
> 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。