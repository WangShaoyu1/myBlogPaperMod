---
author: "Gaby"
title: "Vue项目部署后提示刷新版本"
date: 2022-06-27
description: "vue项目部署新版本后，用户如果不刷新页面，可能会出现一些异常，需要刷新后才能正常使用，所以希望每次部署新版本后，提示用户刷新浏览器。"
tags: ["JavaScript","架构","Vue.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:62,comments:22,collects:91,views:6889,"
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第28天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

废话只说一句：码字不易求个👍，收藏 === 学会,快行动起来吧！🙇‍🙇‍🙇‍。

vue项目部署新版本后，用户如果不刷新页面，可能会出现一些异常，需要刷新后才能正常使用，所以希望每次部署新版本后，提示用户刷新浏览器。

之前看vue文档，发现类似的功能。

![image.png](/images/jueJin/3c1dff219da0440.png)

查了好些资料，网上说的大部分也都是通过接口调用获取版本号与本地版本号进行对比，然而我只想用纯前端的方式，那该怎么做呢，实在不行就只能查资料自己开发个 webpack 插件进行处理了。

在 `vuecli5` 中 webpack 入口文件 配置 层级 为 `compiler.options.entry.app.import = []` 所以在合并入口文件数据的时候按照以下形式处理。

```js
// 自动注入到 webpack.entry
    compiler.options.entry.app.import = [
    ...compiler.options.entry.app.import,
...['./src/libs/version.js']
];
```

`versionWebpackPlugin` 主要代码：

```js
/***
* title: versionWebpackPlugin.js
* Author: Gaby
* Email:
* Time: 2022-06-27 14:24
* LastEditTime: 2022-06-27 14:24
* LastEditors: Gaby
* Description:
*/

const fs = require('fs');
const path = require('path');
const config = require('../package.json');
const readFile = filePath => fs.readFileSync(filePath, 'utf8');
const resolve = (...dir) => path.resolve(__dirname, '..', ...dir);
const resolveApp = (...dir) => resolve('src', ...dir);
const pluginName = 'versionWebpackPlugin';
const versionFileName = 'version.json';

    class versionWebpackPlugin {
        apply(compiler) {
        // 1.自动注入到 webpack.entry
            compiler.options.entry.app.import = [
            ...compiler.options.entry.app.import,
        ...['./src/libs/version.js']
        ];
        
        // 2.将版本号写入到 main 文件中
            compiler.hooks.beforeRun.tap(pluginName, () => {
            let content = readFile(resolve('build/', 'version.js'));
            let string = content.toString();
            string = string.replace(
            '{{currentVersion}}',
            config.version + '_' + Date.now()
            );
            string = string.replace(
            '{{VERSION_FILE_PATH}}',
            'static/' + versionFileName
            );
                fs.writeFile(resolve('src/libs/', 'version.js'), string, () => {
                // console.log('更新完成');
                });
                
                fs.writeFile(
                resolve('static/', versionFileName),
                '{\n' +
                '  "version": "' +
                config.version +
                '_' +
                Date.now() +
                '"\n' +
                '}',
                    () => {
                    // console.log('更新完成');
                }
                );
                });
            }
            module.exports = versionWebpackPlugin;
```

项目中使用的是 `vue-cli5` 进行创建的，配置文件要自行创建,要配置在 `vue.config.js`中，以下两种引入方式均可。

```js
const path = require('path');
// const versionPlugin = require('./build/version-webpack-plugin');

    module.exports = {
    // 公共路径(必须有的) 默认/
    publicPath: './',
    // 输出文件目录 默认dist
    outputDir: 'dist',
    // 静态资源存放的文件夹(相对于outputDir) 默认根目录
    assetsDir: 'static',
    // 生产环境SourceMap关
    productionSourceMap: false,
    // webpack 全局变量配置
        configureWebpack: {
    // plugins: [new versionPlugin()]
    },
        chainWebpack: config => {
        config
        .plugin('version-webpack-plugin')
        .use(require('./build/version-webpack-plugin'), [{}]);
    }
    };
```

效果如下：

![image.png](/images/jueJin/bc5ae799704445b.png)

这里先抛个大概思路，看看小伙伴们是否能自行完成，新部署项目后，右下角弹出提示有新版本更新，点击更新。