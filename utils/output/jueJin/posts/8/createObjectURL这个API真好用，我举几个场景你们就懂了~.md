---
author: "Sunshine_Lin"
title: "createObjectURL这个API真好用，我举几个场景你们就懂了~"
date: 2024-04-16
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~ 随着我用 URLcreateObjectURL 这个 API 越来越多次，越发感觉真的是一个很好用"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:191,comments:14,collects:295,views:7337,"
---
前言
--

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心~

随着我用 `URL.createObjectURL` 这个 API 越来越多次，越发感觉真的是一个很好用的方法，列举一下我在项目中用到它的场景吧~

图片预览
----

以前我们想要预览图片，只能是上传图片到后端后，获取到url然后赋予给img标签，才能得到回显预览，但是有了`URL.createObjectURL`就不需要这么麻烦了，直接可以在前端就达到预览的效果~

```html
<body>
<input type="file" id="fileInput">
<img id="preview" src="" alt="Preview">
<script>
const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const fileUrl = URL.createObjectURL(file);
    const previewElement = document.getElementById('preview');
    previewElement.src = fileUrl;
    });
    </script>
    </body>
```

![](/images/jueJin/5e1da7c7108d422.png)

音视频流传输
------

举个例子，我们通过`MediaStream` 去不断推流，达到了视频显示的效果，有了`URL.createObjectURL`我们并不需要真的有一个url赋予video标签，去让视频显示出来，只需要使用`URL.createObjectURL`去构造一个临时的url即可非常方便

```html
<body>
<video id="videoElement" autoplay playsinline></video>

<script>
const videoElement = document.getElementById('videoElement');

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
    videoElement.srcObject = stream;
    })
        .catch((error) => {
        console.error('Error accessing webcam:', error);
        });
        </script>
        
        </body>
```

![](/images/jueJin/ae1a68e0ce03446.png)

结合 Blob
-------

`URL.createObjectURL`结合`Blob`也可以做很多方便开发的事情~

### WebWorker

我们知道，想要用 WebWorker 的话，是要先创建一个文件，然后在里面写代码，然后去与这个文件运行的代码进行通信，有了`URL.createObjectURL`就不需要新建文件了，比如下面这个解决excel耗时过长的场景，可以看到，我们传给WebWorker的不是一个真的文件路径，而是一个临时的路径~

```ts
    const handleImport = (ev: Event) => {
    const file = (ev.target as HTMLInputElement).files![0];
    const worker = new Worker(
    URL.createObjectURL(
        new Blob([
        `
        importScripts('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.4/xlsx.full.min.js');
            onmessage = function(e) {
            const fileData = e.data;
            const workbook = XLSX.read(fileData, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            postMessage(data);
            };
            `,
            ]),
            ),
            );
            
            // 使用FileReader读取文件内容
            const reader = new FileReader();
            
                reader.onload = function (e: any) {
                const data = new Uint8Array(e.target.result);
                worker.postMessage(data);
                };
                
                // 读取文件
                reader.readAsArrayBuffer(file);
                
                // 监听Web Worker返回的消息
                    worker.onmessage = function (e) {
                    console.log('解析完成', e.data);
                    worker.terminate(); // 当任务完成后，终止Web Worker
                    };
                    };
```

### 下载文件

同样也可以应用在下载文件上，下载文件其实就是有一个url赋予到a标签上，然后点击a标签就能下载了，我们也可以用`URL.createObjectURL`去生成一个临时url

```ts
// 创建文件 Blob
const blob = new Blob([/* 文件数据 */], { type: 'application/pdf' });

// 创建下载链接
const downloadUrl = URL.createObjectURL(blob);
const downloadLink = document.createElement('a');
downloadLink.href = downloadUrl;
downloadLink.download = 'document.pdf';
downloadLink.textContent = 'Download PDF';
document.body.appendChild(downloadLink);
```

结语 & 加学习群 & 摸鱼群
---------------

我是林三心

*   一个待过**小型toG型外包公司、大型外包公司、小公司、潜力型创业公司、大公司**的作死型前端选手；
*   一个偏前端的全干工程师；
*   一个不正经的掘金作者；
*   一个逗比的B站up主；
*   一个不帅的小红书博主；
*   一个喜欢打铁的篮球菜鸟；
*   一个喜欢历史的乏味少年；
*   一个喜欢rap的五音不全弱鸡

如果你想一起学习前端，一起摸鱼，一起研究简历优化，一起研究面试进步，一起交流历史音乐篮球rap，可以来俺的摸鱼学习群哈哈，点这个，有7000多名前端小伙伴在等着一起学习哦 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")