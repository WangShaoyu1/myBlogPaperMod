---
author: "Gaby"
title: "vue3使用clipboard进行复制"
date: 2022-01-29
description: "1安装依赖 2使用示例1 3使用示例2 3注意： data-clipboard-text中为复制内容，class名必须与new Clipboard()中的class名相同。"
tags: ["JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读1分钟"
weight: 1
selfDefined:"likes:5,comments:0,collects:3,views:4608,"
---
1.安装依赖

```js
npm install clipboard --save
```

2.使用示例1

```js
<button class="copy" data-clipboard-text="复制内容" @click="copy">复制</button>
``````js
import Clipboard from 'clipboard'

    const copy = () => {
    let clipboard = new Clipboard('.copy')
        clipboard.on('success', (e) => {
        console.log('复制成功', e)
        // 释放内存
        clipboard.destroy()
        })
            clipboard.on('error', (e) => {
            // 不支持复制
            console.log('该浏览器不支持自动复制', e)
            // 释放内存
            clipboard.destroy()
            })
        }
```

3.使用示例2

```js
<button class="copy" @click="handleCopy(state.code)">复制</button>
``````js
import { reactive } from 'vue'

    const state = reactive( {
    code : '<el-row>\n' +
    '  <el-col :span="24">\n' +
    '    <el-card class="box-card">\n' +
    '      <template #header>\n' +
    '        <div class="card-header">\n' +
    '          <span>卡片名称</span>\n' +
    '          <el-button class="button" type="text">更多</el-button>\n' +
    '        </div>\n' +
    '      </template>\n' +
    '      <div class="text item">卡片内容</div>\n' +
    '    </el-card>\n' +
    '  </el-col>\n' +
    '</el-row>'
    })
    
        const handleCopy = async (code) => {
            let clipboard = new Clipboard('.copy', {
                text: function () {
                return code
            }
            })
                await clipboard.on('success', (e) => {
                console.log('复制成功', e)
                // 释放内存
                clipboard.destroy()
                })
                    await clipboard.on('error', (e) => {
                    // 不支持复制
                    console.log('该浏览器不支持自动复制', e)
                    // 释放内存
                    clipboard.destroy()
                    })
                }
                
```

3.注意： data-clipboard-text中为复制内容，class名必须与new Clipboard()中的class名相同。 阻止冒泡@click.stop无法使用clipboard进行复制，改为使用其他方法实现。

```js
    const copy = (data: string) => {
    let url = data
    let oInput = document.createElement('textarea')
    oInput.value = url
    document.body.appendChild(oInput)
    oInput.select() // 选择对象;
    document.execCommand('Copy') // 执行浏览器复制命令
    console.log('复制成功')
    oInput.remove()
}
```