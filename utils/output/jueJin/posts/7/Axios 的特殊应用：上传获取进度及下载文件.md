---
author: "Gaby"
title: "Axios 的特殊应用：上传获取进度及下载文件"
date: 2022-05-30
description: "vue 3 通过 Axios 获取文件上传进度条，以及通过 Axios 实现文件流下载，并监听下载进度。"
tags: ["JavaScript","架构","面试中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读1分钟"
weight: 1
selfDefined:"likes:16,comments:0,collects:33,views:2367,"
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第3天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

废话只说一句：码字不易求个👍，收藏 === 学会,快行动起来吧！🙇‍🙇‍🙇‍。

上传
--

### 获取上传文件内容

```js
import { ref } from 'vue'
import axios from 'axios'

const fileRef = ref(null)
const progress = ref(0);


    const handleUpload = () => {
let tempFile = fileRef.value.files[0]
    if (tempFile.size > 10 * 1024 * 1024) {
    // 文件大小超限了
    alert('请上传小于10M的图片');
    fileRef.value.value = '' // 清空内容
    return
}

let file = new FormData()
file.append('file', tempFile)
```

### 设置进度条

```js
<template>
<div class="process">
<div class="process-bar":style="{width:progress+'%}"/>
</div>
</template>

<style lang="scss">
    .process{
    height: 7px;
    color:#ccc;
    margin: 10px 70px 0;
    border-radius: 100px;
    background-color: #CCC;
    position: relative;
        .process-bar{
        height: 7px;
        background-color: #1890ff;
        border-radius: 100px;
        position: absolute;
        left: 0;
    }
}
</style>
```

### 文件上传方法

```js
    axios({
    method: 'post',
    url,
    data: file,
    headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: function(progressEvent) {
        const complete = parseInt((progressEvent.loaded / progressEvent.total * 100 | 0))
        // 上传的进度
        progress.value = complete
    }
        }).then(res => {
        // 上传成功后续处理
        const { data } = res
            if (data.success) {
            console.log('上传成功')
        }
            }).catch(err => {
            // 捕获异常并处理
            console.log(err)
            })
```

### 完整代码

Vue 3 下上传文件并获取时时进度

```js
<script setup>
import { ref } from 'vue'
import axios from 'axios'

const fileRef = ref(null)
const progress = ref(0);

// 上传方法
    const handleUpload = () => {
let tempFile = fileRef.value.files[0]
    if (tempFile.size > 10 * 1024 * 1024) {
    // 文件大小超限了
    alert('请上传小于10M的图片');
    fileRef.value.value = '' // 清空内容
    return
}

let file = new FormData()
file.append('file', tempFile)

fileRef.value.value = '' // 清空内容

    axios({
    method: 'post',
    url,
    data: file,
    headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: function(progressEvent) {
        const complete = parseInt((progressEvent.loaded / progressEvent.total * 100 | 0))
        // 上传的进度
        progress.value = complete
    }
        }).then(res => {
        // 上传成功后续处理
        const { data } = res
            if (data.success) {
            console.log('上传成功')
        }
            }).catch(err => {
            // 捕获异常并处理
            console.log(err)
            })
            
                upload(forms).then((res: any) => {
                console.log(res)
                    }).catch((err:any)=>{
                    console.log(err)
                    });
                }
                </script>
                
                <template>
                <div class="process">
                <div class="process-bar":style="{width:progress+'%}"/>
                </div>
                <input
                type="file"
                accept="video/*"
                ref="fileRef"
                @change="handleUpload"
                />
                </template>
                
                <style lang="scss">
                    .process{
                    height: 7px;
                    color:#ccc;
                    margin: 10px 70px 0;
                    border-radius: 100px;
                    background-color: #CCC;
                    position: relative;
                        .process-bar{
                        height: 7px;
                        background-color: #1890ff;
                        border-radius: 100px;
                        position: absolute;
                        left: 0;
                    }
                }
                </style>
```

下载
--

```js
<div @click="downLoad()">下载</div>

<script setup>
    const downLoad = () => {
        var params={
        name: xxx //额外需要携带的参数
    }
        Axios.get('/api/export',{
        params: params,
        responseType: 'blob'   //设置responseType字段格式为 blob
            }).then(res => {
            console.log(res);
            // 为blob设置文件类型，这里以.xlsx为例
            let blob = new Blob([res], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;"});
            // 创建一个临时的url指向blob对象
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = url;
            a.download = '自定义文件名';
            a.click();
            // 释放这个临时的对象url
            window.URL.revokeObjectURL(url);
            });
        }
        </script>
```

还可以借助 `js-file-download` 插件完成下载功能

```js
<script setup>
import axios from 'axios'
import fileDownload from 'js-file-download';

    const download =()=> {
        axios.get('下载地址', {
        responseType: 'blob',
            }).then(res => {
            fileDownload(res.data, '下载的文件名字');
            });
        }
        </script>
```