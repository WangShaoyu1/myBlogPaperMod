---
author: "Gaby"
title: "vue-cli50 webpack 采用 copy-webpack-plugin 打包复制文件"
date: 2022-06-21
description: "目前 vue-cli已经发布50了，webpack 配置上也与之前老版本的有所不同，这里就主要记录下vue-cli50 webpack 采用 copy-webpack-plugin 打包复制文件"
tags: ["JavaScript","Vue.js","Webpack中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:8,comments:0,collects:5,views:3281,"
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第22天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

废话只说一句：码字不易求个👍，收藏 === 学会,快行动起来吧！🙇‍🙇‍🙇‍。

目前 vue-cli已经发布5.0了，webpack 配置上也与之前老版本的有所不同，调整 webpack 配置最简单的方式就是在 `vue.config.js` 中的对象中进行配置，该对象将会被 [webpack-merge](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsurvivejs%2Fwebpack-merge "https://github.com/survivejs/webpack-merge") 合并入最终的 webpack 配置。

有些 webpack 选项是基于 `vue.config.js` 中的值设置的，所以不能直接修改。例如你应该修改 `vue.config.js` 中的 `outputDir` 选项而不是修改 `output.path`；你应该修改 `vue.config.js` 中的 `publicPath` 选项而不是修改 `output.publicPath`。这样做是因为 `vue.config.js` 中的值会被用在配置里的多个地方，以确保所有的部分都能正常工作在一起。

vue-cli参考文档：[vue-cli 文档指南](https://link.juejin.cn?target=https%3A%2F%2Fcli.vuejs.org%2Fzh%2Fguide%2F "https://cli.vuejs.org/zh/guide/")

![image.png](/images/jueJin/de1ddca6d02146f.png)

碰巧项目中打包的时候要复制一个文件夹及其下面的文件到打包文件夹 `dist` 下，下意识的就想起来`copy-webpack-plugin`这个插件，但是以前都是直接在 `webpack`的配置文件中直接配置，但现在 vue-cli5，在项目中找不到这个文件了，那该如何配置呢。

今天就好好说说`vue-cli5.0`种使用`copy-webpack-plugin`插件该如何配置的问题。这里我们安装的 `copy-webpack-plugin` 的版本是 `^11.0.0`

安装 `copy-webpack-plugin` :

```js
yarn add copy-webpack-plugin -D
```

根据官网说明，配置文件从之前的 `webpack` 配置文件，改成了在 `vue.config.js` 中进行配置，将 `vue.config.js` 中项目生成的内容注释掉，改成以下代码片段改写就可以使用了。这里我们是将根目录下的 static 文件复制到 打包生成的 dist 目录下。

注意这里，如果使用`to`参数的话 默认是`dist`目录下进行复制, 所填字段为目路地址

```js
// const { defineConfig } = require('@vue/cli-service');
    // module.exports = defineConfig({
    //   transpileDependencies: true
    // });
    
    const path = require('path');
    
        module.exports = {
            chainWebpack: config => {
                config.plugin('copy').use(require('copy-webpack-plugin'), [
                    {
                        patterns: [
                            {
                            from: path.resolve(__dirname, './static'),
                            to: path.resolve(__dirname, './dist/static')
                        }
                    ]
                }
                ]);
            }
            };
```

这里做下记录，方便有需要的小伙伴取用~