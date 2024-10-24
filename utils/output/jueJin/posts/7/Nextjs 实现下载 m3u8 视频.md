---
author: "冴羽"
title: "Nextjs 实现下载 m3u8 视频"
date: 2024-06-24
description: "日常浏览一些视频网站的时候，觉得内容不错，想要下载下来收藏，但一查视频格式，发现是 m3u8。这种格式是什么？为什么要使用这种格式呢？我们又该如何下载 m3u8 格式的视频呢？ 本篇我们借着下载"
tags: ["前端","JavaScript","Next.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:54,comments:0,collects:79,views:3556,"
---
> 本文为稀土掘金技术社区首发签约文章，30天内禁止转载，30天后未获授权禁止转载，侵权必究！

前言
--

日常浏览一些视频网站的时候，觉得内容不错，想要下载下来收藏，但一查视频格式，发现是 m3u8。这种格式是什么？为什么要使用这种格式呢？我们又该如何下载 m3u8 格式的视频呢？

本篇我们借着下载 m3u8 视频这个功能，学习如何快速开发 Next.js 项目以及如何使用 Next.js 最新的 Server Actions 特性。

> 1.  本篇已收录到掘金专栏[《Next.js 开发指北》](https://juejin.cn/column/7343569488744611849 "https://juejin.cn/column/7343569488744611849")
>     
> 2.  系统学习 Next.js，欢迎入手小册[《Next.js 开发指南》](https://s.juejin.cn/ds/iFkbaMgM/ "https://s.juejin.cn/ds/iFkbaMgM/")。基础篇、实战篇、源码篇、面试篇四大篇章带你系统掌握 Next.js！
>     

M3U8
----

说起 M3U8，我们先从 M3U 开始说起。

M3U（MP3 URL的缩写）是一种播放多媒体列表的文件格式，它的设计初衷是为了播放音频文件，比如 MP3，但是越来越多的软件现在用来播放视频文件列表。

**M3U 本身是一种纯文本文件，可以指定一个或多个多媒体文件的位置**，其文件扩展名是“M3U”或者“m3u”。举个例子：

```less
#EXTM3U

#EXTINF:123, Sample artist - Sample title
C:\Documents and Settings\I\My Music\Sample.mp3

#EXTINF:321,Example Artist - Example title
C:\Documents and Settings\I\My Music\Greatest Hits\Example.ogg
```

这是 Windows 平台上的一个扩展 M3U 文件的举例，Sample.mp3 和 Example.ogg 都是媒体文件。123 和 321 是播放长度，单位是秒 (s)，当流媒体文件的长度没有固定、预定的长度值，用 -1 表示播放长度。播放长度后边是多媒体文件的标题。

**M3U8 则是 Unicode 版本的 M3U，使用 UTF-8 编码**。M3U 和 M3U8 都是基于 **HTTP Live Streaming（HLS）** 协议的文件格式，由苹果公司开发。

目前很多视频网站都采用了 M3U8 格式进行传输。我们以腾讯视频为例，打开电影频道，随便找一个视频（比如[《画江湖之天罡》](https://link.juejin.cn?target=https%3A%2F%2Fv.qq.com%2Fx%2Fcover%2Fmzc003pmz1hufs3%2Ft3535em8u2l.html%3Fscene_id%3D3 "https://v.qq.com/x/cover/mzc003pmz1hufs3/t3535em8u2l.html?scene_id=3")），打开浏览器控制台，搜索 m3u8 请求：

![截屏2024-06-23 20.18.15.png](/images/jueJin/4a913028059545e.png)

这个 m3u8 文件就包含了页面视频的所有信息，让我们查看下具体的响应内容：

```ini
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-TARGETDURATION:13
#EXT-X-PLAYLIST-TYPE:VOD
#EXTINF:11.040,
00_gzc_1000102_0b53rqafgaaaluakqvuxvbs4bdgdkoaaav2a.f322062.1.ts?index=0&start=0&end=11040&brs=0&bre=253423&ver=4&token=ba5333c79bbeeb4ccde816389c8bda1e
#EXTINF:12.000,
01_gzc_1000102_0b53rqafgaaaluakqvuxvbs4bdgdkoaaav2a.f322062.1.ts?index=1&start=11040&end=23040&brs=253424&bre=518879&ver=4&token=2e0c85d3436c5b244796f6624c45c72b
#EXTINF:11.400,
02_gzc_1000102_0b53rqafgaaaluakqvuxvbs4bdgdkoaaav2a.f322062.1.ts?index=2&start=23040&end=34440&brs=518880&bre=1279339&ver=4&token=caf1adfaf0a73f14cd1c3a9c0eac98a0
#EXTINF:11.040,
#........
```

可以看到 M3U8 将视频拆分成了很多小片段，每个片段大概为 11s 左右，格式为 xxxx.ts。这就是 M3U8 与传统的视频格式不同的地方。

M3U8 其实就是将视频拆分成多个片段进行传输。这些片段可以根据网络情况自动调节质量和大小，所以即便在网络环境不好的情况下也能正常播放。而且 M3U8 视频格式还支持多种分辨率和比特率，以及字幕和音轨等多种附加信息。这些功能都使得 M3U8 视频格式成为了现代流媒体领域中的一种重要技术。

简单总结一下就是：M3U8 将视频拆分成多个片段进行传输（每个片段是一个 ts 文件），`.m3u8`其实是一个包含所有片段索引的文本文件。使用这种技术，用户播放视频时，可随意拖动视频进度，会读取相应进度的 ts 文件继续观看视频，不必等到下载完整的视频。因为片段可以根据网络情况自动调节质量和大小，也越来越多应用于直播等场景中。

技术实现
----

了解了 M3U8 的基本原理，如何下载 M3U8 也变得简单了起来，简单来说就是 3 步：

1.  获取索引文件
2.  下载所有片段
3.  合并所有片段

### 1\. 项目初始化

当然在具体的实现中涉及的细节还蛮多的，我们边写边讲。那就开始创建我们的 Next.js 项目吧。运行：

```bash
npx create-next-app@latest
```

创建项目后，进入项目目录，运行 `npm run dev`开启开发者模式。

修改 `app/page.js`，完整代码如下：

```jsx
'use client'

import { SubmitButton } from './button';
import { download } from './actions';
import { useState, useRef } from 'react';

    export default function Page() {
    const [url, setUrl] = useState('');
    const formRef = useRef(null);
    
    return (
    <div className="p-2">
        <form action={async (formData) => {
        const {success, message} = await download(formData);
            if (success) {
            setUrl(message)
            formRef.current?.reset()
        }
        }} className="mb-2" ref={formRef}>
        <label htmlFor="url" className="block text-sm font-medium leading-6 text-gray-900">
        M3U8 URL:
        </label>
        <input
        id="url"
        name="url"
        type="url"
        required
        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2"
        />
        <SubmitButton />
        </form>
    {url ? <a href={new URL(url, location.href)} download className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">开始下载 {url}</a> : null}
    </div>
    )
}
```

新建 `app/button.js`，代码如下：

```jsx
import { useFormStatus } from 'react-dom'

    export function SubmitButton() {
    const { pending } = useFormStatus()
    
    return (
    <button
    type="submit"
    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
aria-disabled={pending}
>
{pending ? 'Downloading...' : 'Download'}
</button>
)
}
```

新建 `app/actions.js`，代码如下：

```javascript
'use server'

    export async function download(formData) {
    const url = formData.get('url')
    console.log(url)
    
        return {
        'success': true,
        'message': `output.mp4`
    }
}
```

浏览器效果如下：

![13.gif](/images/jueJin/967c2421cf894dd.png)

基本流程如下：当用户在输入框输入 m3u8 链接时，后端会获取该索引文件并将所有片段拼接成一个完整的视频，然后返回给前端该视频的链接，用户点击链接即可下载该视频。

### 2\. 解析 m3u8

现在让我们实现具体的逻辑，首先是获取 m3u8 文件，然后解析出有哪些片段。

如果自己手动去解析属实有些麻烦，可以借助已有的库 —— [m3u8-parser](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvideojs%2Fm3u8-parser%3Ftab%3Dreadme-ov-file "https://github.com/videojs/m3u8-parser?tab=readme-ov-file")，它会解析 m3u8 文件，返回一个包含 m3u8 文件信息的格式化对象，基本用法如下：

```javascript
// 1. 假设一个 m3u8 文件
    var manifest = [
    '#EXTM3U',
    '#EXT-X-VERSION:3',
    '#EXT-X-TARGETDURATION:6',
    '#EXT-X-MEDIA-SEQUENCE:0',
    '#EXT-X-DISCONTINUITY-SEQUENCE:0',
    '#EXTINF:6,',
    '0.ts',
    '#EXTINF:6,',
    '1.ts',
    '#EXT-X-PROGRAM-DATE-TIME:2019-02-14T02:14:00.106Z'
    '#EXTINF:6,',
    '2.ts',
    '#EXT-X-ENDLIST'
    ].join('\n');
    
    // 2. 声明 Parser
    var parser = new m3u8Parser.Parser();
    
    // 3. 传入信息
    parser.push(manifest);
    parser.end();
    
    // 4. 获取对象
    var parsedManifest = parser.manifest;
```

安装依赖项：

```bash
npm install --save m3u8-parser zod
```

修改 `actions.js`，代码如下：

```javascript
'use server'

import { Parser } from 'm3u8-parser'
import { z } from 'zod'

    function isValidManifest(manifest) {
    const segmentsLength = manifest.segments?.length ?? 0
    const playlistsLength = manifest.playlists?.length ?? 0
    return segmentsLength > 0 || playlistsLength > 0
}

    function parseUri(base, uri) {
    const isUrl = z.string().url().safeParse(uri).success
    
    if (isUrl) return uri
    
    const baseURL = new URL(base)
    const basePathname = baseURL.pathname.replace(/\/+$/, '').split('/').slice(0, -1).join('/')
    const pathname = `${basePathname}/${uri}`
    const parsedURL = new URL(pathname, baseURL)
    
    return parsedURL.toString()
}

    export async function download(formData) {
    const url = formData.get('url')
    // 1. 解析 m3u8 文件
    const content = await fetch(url).then(res => res.text())
    const parser = new Parser()
    
    parser.push(content)
    parser.end()
    
if (!isValidManifest(parser.manifest)) return { 'success': false, 'message': `Unvalid Manifest` }

    const segments = parser.manifest.segments?.map((segment, i) => ({
    uri: parseUri(url, segment.uri),
    index: i
})) ?? []

console.log(segments)

    return {
    'success': true,
    'message': `output.mp4`
}
}
```

输入一个 m3u8 地址进行测试，比如这个（这个地址比较短，只有 4 个片段）：

```javascript
https://ltshsy.gtimg.com/B_efeEBb4uHJ8TOTkZIB0oon3E7GZXINbcPNY_CMt26mAHTfW9pADdk1rOQT0kblSQ/svp_50069/uSgfyfE81A8EOVfMAWZK-SIdyv6-mo7yHHpjNaFJ5dgmbEGwr1mM4jt_NwSXJ9WZd-7KkKbol4W8PXY9QG2rqE4Y5CwzVQ5ArIHIclVW8LvHjCkbhMEfYnbZVxGx_3x0-8kkbzhfXfCyC_4krbmNibQn5N5fbiv1xHQJk4tmM-J3COjWsR8HIvxQv07Ou8lBVtwXez5_lVna0R8R8ZSpCwTjnyeTUvVHjs7vlLIR2No-y5tLJQGkNg/055_gzc_1000035_0bc3lmabaaaaeeaalyermnszkw6dcbnqaeca.f306310.ts.m3u8?ver=4
```

命令行中的打印结果如下：

![image.png](/images/jueJin/0ff9248d220c496.png)

### 3\. 下载片段

安装依赖项：

```bash
npm i loadash
```

修改 `actions.js`，代码如下：

```javascript
'use server'

import { Parser } from 'm3u8-parser'
import { z } from 'zod'
import { writeFile } from 'node:fs/promises';
import _ from 'lodash';

    function isValidManifest(manifest) {
    const segmentsLength = manifest.segments?.length ?? 0
    const playlistsLength = manifest.playlists?.length ?? 0
    return segmentsLength > 0 || playlistsLength > 0
}

    function parseUri(base, uri) {
    const isUrl = z.string().url().safeParse(uri).success
    
    if (isUrl) return uri
    
    const baseURL = new URL(base)
    const basePathname = baseURL.pathname.replace(/\/+$/, '').split('/').slice(0, -1).join('/')
    const pathname = `${basePathname}/${uri}`
    const parsedURL = new URL(pathname, baseURL)
    
    return parsedURL.toString()
}

    export async function download(formData) {
    const url = formData.get('url')
    // 1. 解析 m3u8 文件
    const content = await fetch(url).then(res => res.text())
    const parser = new Parser()
    
    parser.push(content)
    parser.end()
    
if (!isValidManifest(parser.manifest)) return { 'success': false, 'message': `Unvalid Manifest` }

    const segments = parser.manifest.segments?.map((segment, i) => ({
    uri: parseUri(url, segment.uri),
    index: i
})) ?? []

// 2. 下载所有片段
const chunks = _.chunk(segments, 10)
const downloaded = []

    for (let i = 0; i < chunks.length; i++) {
const segmentChunk = chunks[i]
await Promise.allSettled(
    segmentChunk.map(async segment => {
    const fileId = `${segment.index}.ts`
    const res = await fetch(segment.uri)
    const file = await res.arrayBuffer()
    await writeFile(`./data/${fileId}`, Buffer.from(file));
    downloaded.push(fileId)
    })
    )
}
const downloadedIds = [...downloaded].sort((a, b) => parseInt(a.split('.')[0]) - parseInt(b.split('.')[0]))
console.log(downloadedIds)

    return {
    'success': true,
    'message': `output.mp4`
}
}
```

我们首先使用了 lodash 的 chuck 函数对片段进行了分组，每 10 个为一组，目的在于控制并发请求数。然后我们使用了 Promise.allSettled 静态方法，表示等待所有的 promise 都有结果时再进行下一组请求。

现在我们在 `app`目录下新建一个 `data`文件夹，用于存放下载的片段文件。

输入一个 m3u8 地址测试一下，命令行中的打印结果如下：

![image.png](/images/jueJin/8660d70651aa4dc.png)

可以看到 `data` 文件下出现了下载的片段文件：

![image.png](/images/jueJin/ada61fc0ff0c431.png)

### 4\. 合并片段

现在我们开始将所有片段合并成一个文件。

我们可以使用 Node.js 的原生方法或者使用流将文件直接合并，但合并后还是一个 ts 文件，如果要转为更为常见的 mp4 文件呢？

这个时候我们就需要借助 ffmpeg。

使用 ffmpeg，如果是在浏览器环境中使用，我们通常会使用 [ffmpeg.wasm](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fffmpegwasm%2Fffmpeg.wasm "https://github.com/ffmpegwasm/ffmpeg.wasm")，如果是在 Node 环境中使用，则通常使用 [Fluent ffmpeg](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffluent-ffmpeg%2Fnode-fluent-ffmpeg "https://github.com/fluent-ffmpeg/node-fluent-ffmpeg")。

Server Actions 运行在服务端环境，所以我们使用 fluent-ffmpeg。安装相关依赖项：

```bash
npm i fluent-ffmpeg dayjs
```

修改 `actions.js`，完整代码如下：

```javascript
'use server'

import { Parser } from 'm3u8-parser'
import { z } from 'zod'
import { writeFile } from 'node:fs/promises';
import _ from 'lodash';
import dayjs from 'dayjs';
import ffmpeg from 'fluent-ffmpeg';

    function isValidManifest(manifest) {
    const segmentsLength = manifest.segments?.length ?? 0
    const playlistsLength = manifest.playlists?.length ?? 0
    return segmentsLength > 0 || playlistsLength > 0
}

    function parseUri(base, uri) {
    const isUrl = z.string().url().safeParse(uri).success
    
    if (isUrl) return uri
    
    const baseURL = new URL(base)
    const basePathname = baseURL.pathname.replace(/\/+$/, '').split('/').slice(0, -1).join('/')
    const pathname = `${basePathname}/${uri}`
    const parsedURL = new URL(pathname, baseURL)
    
    return parsedURL.toString()
}

    export async function download(formData) {
    const url = formData.get('url')
    // 1. 解析 m3u8 文件
    const content = await fetch(url).then(res => res.text())
    const parser = new Parser()
    
    parser.push(content)
    parser.end()
    
if (!isValidManifest(parser.manifest)) return { 'success': false, 'message': `Unvalid Manifest` }

    const segments = parser.manifest.segments?.map((segment, i) => ({
    uri: parseUri(url, segment.uri),
    index: i
})) ?? []

// 2. 下载所有片段
const chunks = _.chunk(segments, 10)
const downloaded = []

    for (let i = 0; i < chunks.length; i++) {
const segmentChunk = chunks[i]
await Promise.allSettled(
    segmentChunk.map(async segment => {
    const fileId = `${segment.index}.ts`
    const res = await fetch(segment.uri)
    const file = await res.arrayBuffer()
    await writeFile(`./data/${fileId}`, Buffer.from(file));
    downloaded.push(fileId)
    })
    )
}
const downloadedIds = [...downloaded].sort((a, b) => parseInt(a.split('.')[0]) - parseInt(b.split('.')[0]))

// 3. 合并所有片段
const outputFileName = dayjs().format('YYYY-MM-DDTHH:mm:ss')
    await new Promise((resolve, reject) => {
    var videos = ffmpeg();
        downloadedIds.forEach(function(videoName){
        videos = videos.addInput(`./data/${videoName}`);
        });
        
        videos.mergeToFile(`./public/${outputFileName}.mp4`, './public')
        .on('error', reject)
        .on('end', resolve);
        })
        
            return {
            'success': true,
            'message': `${outputFileName}.mp4`
        }
    }
```

fluent-ffmpeg 相关的代码并不复杂，主要用到了 addInput 和 mergeToFile 两个 API，作用如方法名一样，[fluent-ffmpeg](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffluent-ffmpeg%2Fnode-fluent-ffmpeg "https://github.com/fluent-ffmpeg/node-fluent-ffmpeg") 主页也都有讲解。

此时我们就基本实现了视频的下载效果。找个地址测试一下，可以看到 `public`目录下生成了合成后的视频文件：

![image.png](/images/jueJin/d8db467b6d33459.png)

可以看到：整体合成的时间是比较长的，其实片段下载的很快，但使用 ffmpeg 合并并转格式会比较花时间。如果要对外提供服务，可以替代为下载 Node.js 直接合并的 ts 文件，这样用户体验会更好。

### 5\. 删除片段文件

最后为了节省存储空间，我们将所有的片段文件删除，修改 `actions.js`，完整代码如下：

```javascript
'use server'

import { Parser } from 'm3u8-parser'
import { z } from 'zod'
import { writeFile } from 'node:fs/promises';
import _ from 'lodash';
import dayjs from 'dayjs';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

    function isValidManifest(manifest) {
    const segmentsLength = manifest.segments?.length ?? 0
    const playlistsLength = manifest.playlists?.length ?? 0
    return segmentsLength > 0 || playlistsLength > 0
}

    function parseUri(base, uri) {
    const isUrl = z.string().url().safeParse(uri).success
    
    if (isUrl) return uri
    
    const baseURL = new URL(base)
    const basePathname = baseURL.pathname.replace(/\/+$/, '').split('/').slice(0, -1).join('/')
    const pathname = `${basePathname}/${uri}`
    const parsedURL = new URL(pathname, baseURL)
    
    return parsedURL.toString()
}

    function emptyDir(filePath) {
    const files = fs.readdirSync(filePath)
        files.forEach((file) => {
        const nextFilePath = `${filePath}/${file}`
        const states = fs.statSync(nextFilePath)
            if (states.isDirectory()) {
            emptyDir(nextFilePath)
                } else {
                fs.unlinkSync(nextFilePath)
            }
            })
        }
        
            export async function download(formData) {
            const url = formData.get('url')
            // 1. 解析 m3u8 文件
            const content = await fetch(url).then(res => res.text())
            const parser = new Parser()
            
            parser.push(content)
            parser.end()
            
        if (!isValidManifest(parser.manifest)) return { 'success': false, 'message': `Unvalid Manifest` }
        
            const segments = parser.manifest.segments?.map((segment, i) => ({
            uri: parseUri(url, segment.uri),
            index: i
        })) ?? []
        
        // 2. 下载所有片段
        const chunks = _.chunk(segments, 10)
    const downloaded = []
    
        for (let i = 0; i < chunks.length; i++) {
    const segmentChunk = chunks[i]
    await Promise.allSettled(
        segmentChunk.map(async segment => {
        const fileId = `${segment.index}.ts`
        const res = await fetch(segment.uri)
        const file = await res.arrayBuffer()
        await writeFile(`./data/${fileId}`, Buffer.from(file));
        downloaded.push(fileId)
        })
        )
    }
    const downloadedIds = [...downloaded].sort((a, b) => parseInt(a.split('.')[0]) - parseInt(b.split('.')[0]))
    
    // 3. 合并所有片段
    const outputFileName = dayjs().format('YYYY-MM-DDTHH:mm:ss')
        await new Promise((resolve, reject) => {
        var videos = ffmpeg();
            downloadedIds.forEach(function(videoName){
            videos = videos.addInput(`./data/${videoName}`);
            });
            
            videos.mergeToFile(`./public/${outputFileName}.mp4`, './public')
            .on('error', reject)
            .on('end', resolve);
            })
            
            // 4. 删除所有片段
            emptyDir('./data')
            
                return {
                'success': true,
                'message': `${outputFileName}.mp4`
            }
        }
```

最终效果如下：

![14.gif](/images/jueJin/97096c6191744ad.png)

最后
--

本篇我们讲解了使用 Next.js 下载 m3u8 视频的基本原理，实际上，m3u8 的处理更为复杂，比如有的 m3u8 视频会加密，还需要进行解密处理。而且在当前的实现中，我们使在后端下载并处理的所有片段，但其实没有必要，也可以放到前端来实现，除非你想要存储用户的视频，为了后续提供更快的下载服务。

如果你真的需要下载 m3u8 的视频，其实网上有很多现成的服务：

1.  [meub.vercel.app/](https://link.juejin.cn?target=https%3A%2F%2Fmeub.vercel.app%2F "https://meub.vercel.app/")
2.  [tools.bugscaner.com/m3u8.html](https://link.juejin.cn?target=http%3A%2F%2Ftools.bugscaner.com%2Fm3u8.html "http://tools.bugscaner.com/m3u8.html")

本篇只是借着这个功能的实现，介绍 Next.js 项目的基本开发方式。