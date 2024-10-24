---
author: "Gaby"
title: "解决Editormd上传图片获取不到图片地址问题"
date: 2022-06-16
description: "Editormd图片上传获取不到图片地址，Editormd图片上传iframe存在跨域情况，几经调试都不好用，最后采取替代方案"
tags: ["JavaScript","Markdown","架构中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:9,comments:0,collects:2,views:2652,"
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第17天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

废话只说一句：码字不易求个👍，收藏 === 学会,快行动起来吧！🙇‍🙇‍🙇‍。

Editor.md图片上传获取不到图片地址，Editor.md图片上传iframe存在跨域情况，几经调试都不好用，最后采取替代方案，还不存在跨域情况。

最近项目中要支持markdown 编辑器，现在基本做技术的没有不知道Markdown 的，因为实在是太强大了，只需要了解很简单的几个操作，即可编辑非常优美的文章，包括TeX科学公式（基于KaTeX）、流程图 Flowchart 和 时序图 ，不在让你浪费时间在格式的调整。

### 背景

是在PC端使用，直接引入JQuery和Markdown.md插件进行使用

### 资源：

[Editor.md](https://link.juejin.cn?target=https%3A%2F%2Fpandao.github.io%2Feditor.md%2F "https://pandao.github.io/editor.md/")

[editor.md的github](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fpandao%2Feditor.md%2F "https://github.com/pandao/editor.md/")

[editor.md.zip包下载地址](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fpandao%2Feditor.md%2Farchive%2Fmaster.zip "https://github.com/pandao/editor.md/archive/master.zip")

[jquery-3.6.0.min.js](https://link.juejin.cn?target=https%3A%2F%2Fcode.jquery.com%2Fjquery-3.6.0.min.js "https://code.jquery.com/jquery-3.6.0.min.js")

[jquery-form github](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fjquery-form%2Fform "https://github.com/jquery-form/form")

这个插件就不多说了，以为官网已经说的很多了，虽然在使用上有点小瑕疵，但是大体上还是很不错的，即插即用。

### editor.md目录介绍

这边需要说明一下 editor.md目录，本文介绍的版本为v1.5.0，在首页下载完成，解压editor.md-master.zip文件，可以看到如下图的目录结构： ![在这里插入图片描述](/images/jueJin/edbddbb1ade348f.png)

图中红色框内是我们要引用到项目的文件和目录。

*   css目录中可选择editormd.min.css放在对应的项目css目录中；
*   js可选择editormd.min.js放置在对应项目的js目录中，需要注意的是同时需要引入jQuery，这里使用jquery.min.js；
*   examples文件夹中是一部分核心功能的demo，在使用的过程中用到对应的组件或功能可打开参考；
*   fonts是需要用到字体，可一并引入项目；
*   images是一些加载类的图片；
*   lib是editor.md依赖的第三方js资源，比如流程图的js资源；
*   plugins主要是编辑器上面的操作功能插件，比如图片上传等，可选择使用的进行加载；

导入到web 项目中的目录如下：

![在这里插入图片描述](/images/jueJin/fd690651484348f.png)

页面中需要引入的文件，其他插件根据需要再增加

```html
<!-- 页面中添加css -->
<link rel="stylesheet" href="./css/style.css" />
<link rel="stylesheet" href="./css/editormd.css" />
<!-- 页面中添加div -->
<div id="editormd">
<textarea style="display:none;">### Hello Editor.md !</textarea>
</div>
<!-- 页面中添加js -->
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/jqueryform@4.3.0.min.js"></script>
<script type="text/javascript" src="js/editormd.min.js"></script>
<script type="text/javascript" src="js/showdown@1.9.1.min.js"></script>
<script>
    var testEditor = editormd("editormd", {
    width: "90%",
    height: 'calc(100vh - 85px)',
    path : './lib/',
    // theme : "dark",
    // previewTheme : "dark",
    // editorTheme : "pastel-on-dark",
    // markdown : content?content:'![](https://img1.446677.xyz/2021/07/04/81903e6c0536ef3a87783a6e7afc3093.jpg) ![](https://img1.446677.xyz/2021/07/08/889db52a8e84a58e9bf63970f3a01e92.jpg)',
    markdown : content,
    codeFold : true,
    //syncScrolling : false,
    saveHTMLToTextarea : true,    // 保存 HTML 到 Textarea
    searchReplace : true,
    //watch : false,                // 关闭实时预览
    htmlDecode : "style,script,iframe|on*",            // 开启 HTML 标签解析，为了安全性，默认不开启
    //toolbar  : false,             //关闭工具栏
    //previewCodeHighlight : false, // 关闭预览 HTML 的代码块高亮，默认开启
    emoji : true,
    taskList : true,
tocm            : true,         // Using [TOCM]
tex : true,                   // 开启科学公式TeX语言支持，默认关闭
flowChart : true,             // 开启流程图支持，默认关闭
sequenceDiagram : true,       // 开启时序/序列图支持，默认关闭,
//dialogLockScreen : false,   // 设置弹出层对话框不锁屏，全局通用，默认为true
//dialogShowMask : false,     // 设置弹出层对话框显示透明遮罩层，全局通用，默认为true
//dialogDraggable : false,    // 设置弹出层对话框不可拖动，全局通用，默认为true
//dialogMaskOpacity : 0.4,    // 设置透明遮罩层的透明度，全局通用，默认值为0.1
//dialogMaskBgColor : "#000", // 设置透明遮罩层的背景颜色，全局通用，默认为#fff
imageUpload : true,
imageFormats : ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
imageUploadURL : "https://api.xxxx.com/api/v1/editorMdImgUpload",
    onload : function() {
    /*上传图片成功后可以做一些自己的处理*/
    console.log('onload', this);
    //this.fullscreen();
    //this.unwatch();
    //this.watch().fullscreen();
    
    //this.setMarkdown("#PHP");
    //this.width("100%");
    //this.height(480);
    //this.resize("100%", 640);
}
});
</script>
```

id为editormd，后面的js代码中需要用到。而且源码内部也是通过这个作为前缀的。

通过form表单提交时后台可通过content-editormd-markdown-doc获取到对应的markdown文档内容。比如Java中可通过request.getParameter(“content-editormd-markdown-doc”) 注意：此处需要注意的是，无论需要html格式的内容还是markdown格式的内容，都只需要写一个textarea。此处有一个很大的坑。不少其他教程中说需要两个textarea，那么会导致后一个textarea后台获得的数据是一个数组，而不是单纯的HTML内容。

编辑器中的编辑配置： `path`路径需要指定到项目中对应的`lib`的路径。如果设置不对markdown 无法渲染出来。

saveHTMLToTextarea设置为true表示，转化为html格式的内容也同样提交到后台。

好，到这边你就可以看到页面效果了。如下：

![在这里插入图片描述](/images/jueJin/7b11f17683c546d.png)

### 上传图片

editor.md的上传图片功能实现起来比较简单，只需要在上段代码中再添加一些配置即可。但是上传获取返回值处需要改动，否则使用源码的方法会存在跨域问题而导致获取上传返回数据失败。

```js
//与图片上传有关的配置
    var testEditor = editormd("editormd", {
    imageUpload : true,
    imageFormats : ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
    imageUploadURL : "https://api.ycsnews.com/api/v1/article/editorMdImgUpload",
        onload : function() {
        /*上传图片成功后可以做一些自己的处理*/
        // console.log('onload', this);
        //this.fullscreen();
        //this.unwatch();
        //this.watch().fullscreen();
        
        //this.setMarkdown("#PHP");
        //this.width("100%");
        //this.height(480);
        //this.resize("100%", 640);
    }
    });
```

*   imageUpload设置为true表示支持上传，此时需要plugins中的image-dialog.js插件（默认调用，放在指定路径即可）。
*   imageFormats为支持上传的图片类型。
*   imageUploadURL要上传图片的后台服务器路径

![在这里插入图片描述](/images/jueJin/14a8ba91eef645e.png)

但是，当你点击“本地上传” 后，发现没有任何反映。图片地址也没有回填；我第一反应是是不是我参数设置有问题啊，但是，经过我看demo 包括，上git 讨论区查看此类问题的时候，并没有，就只需要设置imageUpload，imageFormats，imageUploadURL 三个参数即可，除非跨域了；但是我的情况并没有跨域啊，所以我打开查看页面的调试模式，看到了一个报错；如图：

![在这里插入图片描述](/images/jueJin/635678b37e9b450.png)

特地说明一下：后端返回的报文必须json 格式：

```js
//上传图片返回数据格式 success 的数据需要是Number类型 固定返回格式，必要返回数据，其他可以根据需要添加更多的参数
    {
    url: "https://api.xxx.com/uploads/20210717/16264838053d0d89.jpg",
    message: "上传成功",
    success: 1 //数值 失败 0 或 成功 1
}
```

后端接收数据使用的是 file\=file = file\=\_FILES\[‘editormd-image-file’\]; 固定的格式， 0,1 必须是数字；

url :就是你图片存在的地址，这个就是返回到弹框中的图片地址。

![在这里插入图片描述](/images/jueJin/704ae6efe5a4405.png)

![在这里插入图片描述](/images/jueJin/604d253d27b0468.png)

```javascript
    var submitHandler = function() {
        $("#image-form").ajaxSubmit(function (data) {
        loading(false);
        var json = data;
        json = (typeof JSON.parse !== "undefined") ? JSON.parse(json) : eval("(" + json + ")");
        if(!settings.crossDomainUpload)
            {
            if (json.success === 1)
                {
                // 填充图片地址到输入框
                dialog.find("[data-url]").val(json.url);
                // 填充图片原名称为图片描述 sourFileName 这个字段是多传进来的
                dialog.find("[data-alt]").val(json.sourFileName);
            }
            else
                {
                alert(json.message);
            }
        }
        
        return false;
        });
    }
```

![在这里插入图片描述](/images/jueJin/11379cfa36e9491.png)

点击确定之后，图片地址则被插入到文档中了

![在这里插入图片描述](/images/jueJin/ad7801703e684d5.png)

至此 上传完成。如关于上传有疑问，可以直接留言。