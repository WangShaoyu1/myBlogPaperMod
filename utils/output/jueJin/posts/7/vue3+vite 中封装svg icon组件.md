---
author: "Gaby"
title: "vue3+vite 中封装svg icon组件"
date: 2022-01-10
description: "vue3+vite 中封装svg icon组件在vue3+vite项目中，在使用svg与vue2x版本的用法有所不同，网上有些方法直接使用不能显示出来，就此做了修改并测试可以正常使用，在此总结记录。"
tags: ["JavaScript","Vue.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读1分钟"
weight: 1
selfDefined:"likes:21,comments:0,collects:27,views:4661,"
---
在vue3+vite项目中，在使用svg与vue2.x版本的用法有所不同，网上有些方法直接使用不能显示出来，就此做了修改并测试可以正常使用，在此总结记录。

日期： 2022-01-10

项目环境版本

```shell
node -v
v16.13.0

"vue": "^3.2.6",
"vite": "^2.5.4",
```

### 项目目录

![image.png](/images/jueJin/1602e497569c4bf.png)

### 创建 `svgBuilder.js` 插件

在 `src/plugins` 下创建 `svgBuilder.js`, 内容如下：

```js
import { readFileSync, readdirSync } from 'fs'

let idPerfix = ''
const svgTitle = /<svg([^>+].*?)>/
const clearHeightWidth = /(width|height)="([^>+].*?)"/g

const hasViewBox = /(viewBox="[^>+].*?")/g

const clearReturn = /(\r)|(\n)/g

    function findSvgFile(dir) {
const svgRes = []
    const dirents = readdirSync(dir, {
    withFileTypes: true
    })
        for (const dirent of dirents) {
            if (dirent.isDirectory()) {
            svgRes.push(...findSvgFile(dir + dirent.name + '/'))
                } else {
                const svg = readFileSync(dir + dirent.name)
                .toString()
                .replace(clearReturn, '')
                    .replace(svgTitle, ($1, $2) => {
                    let width = 0
                    let height = 0
                        let content = $2.replace(clearHeightWidth, (s1, s2, s3) => {
                            if (s2 === 'width') {
                            width = s3
                                } else if (s2 === 'height') {
                                height = s3
                            }
                            return ''
                            })
                                if (!hasViewBox.test($2)) {
                                content += `viewBox="0 0 ${width} ${height}"`
                            }
                            return `<symbol id="${idPerfix}-${dirent.name.replace('.svg', '')}" ${content}>`
                            })
                            .replace('</svg>', '</symbol>')
                            svgRes.push(svg)
                        }
                    }
                    return svgRes
                }
                
                    export const svgBuilder = (path, perfix = 'icon') => {
                    if (path === '') return
                    idPerfix = perfix
                    const res = findSvgFile(path)
                    
                        return {
                        name: 'svg-transform',
                            transformIndexHtml(html) {
                            return html.replace(
                            '<body>',
                            `
                            <body>
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position: absolute; width: 0; height: 0">
                        ${res.join('')}
                        </svg>
                        `
                        )
                    }
                }
            }
```

### vite 中配置插件

在项目根目录下的vite配置文件 `vite.config.ts` 中进行配置：

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { svgBuilder } from './src/plugins/svgBuilder';

    export default defineConfig({
    ...,
        plugins: [
        vue(),
        svgBuilder('./src/assets/svg/') // 这里已经将src/icons/svg/下的svg全部导入，无需再单独导入
    ]
    })
```

### 创建 svgIcon 组件

在 `src/components/svgIcon/index.vue` 中创建 svgIcon 组件，内容如下：

```js
<template>
<svg :class="svgClass" aria-hidden="true" v-on="$attrs" :style="{color: props.color}">
<use :xlink:href="iconName" />
</svg>
</template>
<script lang="ts">
    export default {
    name: 'SvgIcon'
}
</script>
<script setup lang="ts">
/**
* 名称：SvgIcon
* @param name String required
* @param color String
* 依赖：src/plugins/svgBuilder.js 需要在 vite中配置
* 使用方式：
* 在 template 中使用 <svg-icon name="bug"/>
*/
import { computed } from 'vue'

    interface Props {
        name: {
        type: string,
        required: true
        },
            color: {
            type: string,
            default: ''
        }
    }
    
    /* data */
    const props = defineProps<Props>() // 获取props defineProps<{ msg: string }>()
    const iconName = computed((): string => `#icon-${props.name}`)
        const svgClass = computed((): string => {
            if (props.className) {
            return `svg-icon icon-${props.name}`
                } else {
                return 'svg-icon'
            }
            })
            </script>
            
            <style scoped>
                .svg-icon {
                width: 1em;
                height: 1em;
                vertical-align: -0.15em;
                fill: currentColor;
                overflow: hidden;
            }
            </style>
            
```

### 全局注册

在项目入口文件 `src/main.ts` 中进行全局注册：

```js
import Vue, { createApp } from 'vue'
import App from './app.vue'
import SvgIcon from './components/SvgIcon/index.vue'

const app = createApp(App)

app.component('svg-icon', SvgIcon).mount('#app')
```

### 创建svg

在 `src/assets/svg` 下创建 `bug.svg`和 `logo.svg`

bug.svg 内容如下：

```js
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
<path
d="M127.88 73.143c0 1.412-.506 2.635-1.518 3.669-1.011 1.033-2.209 1.55-3.592 1.55h-17.887c0 9.296-1.783 17.178-5.35 23.645l16.609 17.044c1.011 1.034 1.517 2.257 1.517 3.67 0 1.412-.506 2.635-1.517 3.668-.958 1.033-2.155 1.55-3.593 1.55-1.438 0-2.635-.517-3.593-1.55l-15.811-16.063a15.49 15.49 0 0 1-1.196 1.06c-.532.434-1.65 1.208-3.353 2.322a50.104 50.104 0 0 1-5.192 2.974c-1.758.87-3.94 1.658-6.546 2.364-2.607.706-5.189 1.06-7.748 1.06V47.044H58.89v73.062c-2.716 0-5.417-.367-8.106-1.102-2.688-.734-5.003-1.631-6.945-2.692a66.769 66.769 0 0 1-5.268-3.179c-1.571-1.057-2.73-1.94-3.476-2.65L33.9 109.34l-14.611 16.877c-1.066 1.14-2.344 1.711-3.833 1.711-1.277 0-2.422-.434-3.434-1.304-1.012-.978-1.557-2.187-1.635-3.627-.079-1.44.333-2.705 1.236-3.794l16.129-18.51c-3.087-6.197-4.63-13.644-4.63-22.342H5.235c-1.383 0-2.58-.517-3.592-1.55S.125 74.545.125 73.132c0-1.412.506-2.635 1.518-3.668 1.012-1.034 2.21-1.55 3.592-1.55h17.887V43.939L9.308 29.833c-1.012-1.033-1.517-2.256-1.517-3.669 0-1.412.505-2.635 1.517-3.668 1.012-1.034 2.21-1.55 3.593-1.55s2.58.516 3.593 1.55l13.813 14.106h67.396l13.814-14.106c1.012-1.034 2.21-1.55 3.592-1.55 1.384 0 2.581.516 3.593 1.55 1.012 1.033 1.518 2.256 1.518 3.668 0 1.413-.506 2.636-1.518 3.67l-13.814 14.105v23.975h17.887c1.383 0 2.58.516 3.593 1.55 1.011 1.033 1.517 2.256 1.517 3.668l-.005.01zM89.552 26.175H38.448c0-7.23 2.489-13.386 7.466-18.469C50.892 2.623 56.92.082 64 .082c7.08 0 13.108 2.541 18.086 7.624 4.977 5.083 7.466 11.24 7.466 18.469z"
/>
</svg>
```

logo.svg 内容如下：

```js
<svg t="1641719191348" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3885" width="128" height="128">
<path d="M787.1 370.11h72.56a15.5 15.5 0 0 0 15.5-15.5V214.42a5.25 5.25 0 0 0-1.54-3.75c-13-12.72-28.46-3.75-28.46 8.84v115.43a5.17 5.17 0 0 1-5.17 5.17H782a5.25 5.25 0 0 0-3.75 1.54c-12.71 12.95-3.74 28.46 8.85 28.46z" fill="#FF8429" p-id="3886"></path>
<path d="M727.1 355.6m-15 0a15 15 0 1 0 30 0 15 15 0 1 0-30 0Z" fill="#FF8429" p-id="3887"></path>
<path d="M382.16 38.11h-345v345a100 100 0 0 0 100 100h345v-345a100 100 0 0 0-100-100z m20 365h-265a20 20 0 0 1-20-20v-265h265a20 20 0 0 1 20 20z" fill="#FED805" p-id="3888"></path>
<path d="M542.16 138.11v345h345a100 100 0 0 0 100-100v-345h-345a100 100 0 0 0-100 100z m345 265h-265v-265a20 20 0 0 1 20-20h265v265a20 20 0 0 1-20 20zM37.16 641.11v345h345a100 100 0 0 0 100-100v-345h-345a100 100 0 0 0-100 100z m345 265h-265v-265a20 20 0 0 1 20-20h265v265a20 20 0 0 1-20 20z" fill="#1FD389" p-id="3889"></path>
<path d="M887.16 541.11h-345v345a100 100 0 0 0 100 100h345v-345a100 100 0 0 0-100-100z m20 365h-265a20 20 0 0 1-20-20v-265h265a20 20 0 0 1 20 20z" fill="#FF8429" p-id="3890"></path>
</svg>
```

其实就是从 [iconfont 官网](https://link.juejin.cn?target=https%3A%2F%2Fwww.iconfont.cn%2F "https://www.iconfont.cn/")上复制下来的。

### 使用

在项目中配置好之后就可以使用了。以上两张 svg 图片的使用如下：

```js
<svg-icon name="logo"/>

<svg-icon name="bug" color="red"/>
```

效果图如下：

![image.png](/images/jueJin/be4afe3a2bdd4d3.png)