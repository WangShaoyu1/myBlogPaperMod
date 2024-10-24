---
author: "Gaby"
title: "Vue30 引入 Cesium 源码"
date: 2022-02-18
description: "由于要对Cesium进行定制化开发，需要修改里面的源码，所以就不能使用npm的方式进行安装。需要直接引入源码的方式。其引入方式跟npm的方式差不多，只需要下载源码，修改一下配置文件既可。"
tags: ["前端","JavaScript","Vue.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:20,comments:0,collects:39,views:4083,"
---
由于要对`Cesium`进行定制化开发，需要修改里面的源码，所以就不能使用`npm`的方式进行安装。需要直接引入源码的方式。其引入方式跟`npm`的方式差不多，只需要下载源码，修改一下配置文件既可。

1 下载源码
======

直接从[官网](https://link.juejin.cn?target=https%3A%2F%2Flinks.jianshu.com%2Fgo%3Fto%3Dhttps%253A%252F%252Fcesium.com%252Fdownloads%252F "https://links.jianshu.com/go?to=https%3A%2F%2Fcesium.com%2Fdownloads%2F")下载源码，我这里下载的是最新的版本`1.9.0`。[直接下载地址](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FCesiumGS%2Fcesium%2Freleases%2Fdownload%2F1.90%2FCesium-1.90.zip "https://github.com/CesiumGS/cesium/releases/download/1.90/Cesium-1.90.zip")

2 初始化Vue项目
==========

使用`Vue`脚手架项目创建一个空项目。

3 引入源码
======

创建好项目后，将源码目录下的`Source`和`ThirdParty`复制到`src`目录下的`Cesium`目录中。

4 修改 webpack 配置文件
=================

在项目的根目录下，创建一个`vue.config.js`，然后将下面的代码复制到配置文件中。其作用主要是将`Workers`，`Assets`，`Widgets`，`ThirdParty`的目录复制到指定的`CESIUM_BASE_URL`目录中，便于源码中找到对应的文件。

```js
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
    module.exports = {
        configureWebpack: {
            plugins: [
            //copy-webpack-plugin 5.x 的写法
                new CopyWebpackPlugin([{
                from: "src/Cesium/Source/Workers",
                to: 'cesium/Workers'
                }]),
                    new CopyWebpackPlugin([{
                    from: "src/Cesium/Source/Assets",
                    to: 'cesium/Assets'
                    }]),
                        new CopyWebpackPlugin([{
                        from: "src/Cesium/Source/Widgets",
                        to: 'cesium/Widgets'
                        }]),
                            new CopyWebpackPlugin([{
                            from: "src/Cesium/ThirdParty",
                            to: 'cesium/ThirdParty'
                            }]),
                            
                                new webpack.DefinePlugin({
                                // 要将以上目录复制到定义的该目录下 目录没有复制对的话创建地图时🌏出不来
                                CESIUM_BASE_URL: JSON.stringify("./cesium")
                                })
                                ],
                                    module: {
                                    unknownContextCritical: false,
                                    unknownContextRegExp: //cesium/cesium/Source/Core/buildModuleUrl.js/
                                }
                                },
                            }
```

在 vite 项目中使用 default 进行定义全局变量：

```js
    export default defineConfig({
        define: {
        CESIUM_BASE_URL: JSON.stringify('./cesium')
        },
        })
```

5 引入代码
======

在`main.js`文件中，引用`css`和`Cesium`类并要设置`accessToken`。

```js
import * as Cesium from './Cesium/Source/Cesium';
import './Cesium/Source/Widgets/widgets.css'
```

可以将其挂载到全局变量上。

```js
const app = createApp(App);
app.use(store).use(router).mount('#app');
app.config.globalProperties.$Cesium = Cesium;
Cesium.Ion.defaultAccessToken='你的accessToken'
```

也可以在页面中使用的时候引入，根据项目情况而定

```js
import * as Cesium from './Cesium/Source/Cesium';
import './Cesium/Source/Widgets/widgets.css'

Cesium.Ion.defaultAccessToken='你的accessToken'
    let viewer = new Cesium.Viewer('map',{
    });
    viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏版权
```

6创建地图
=====

在`vue`文件中引用`Cesium`进行创建地图，具体代码如下所示：

```js
<template>
<div class="home">
<div id="map"></div>
</div>
</template>

<script>
import {getCurrentInstance, onMounted} from  'vue';
    export default {
    name: 'Home',
        components: {
        
        },
            setup(){
            const {ctx } = getCurrentInstance();
            const Cesium = ctx.$Cesium;
                const initMap = ()=>{
                    let viewer = new Cesium.Viewer('map',{
                    });
                        viewer.camera.flyTo({
                        destination : Cesium.Cartesian3.fromDegrees(112.4175, 23.655, 400),
                            orientation : {
                            heading : Cesium.Math.toRadians(0.0),
                            pitch : Cesium.Math.toRadians(-15.0),
                        }
                        });
                        };
                            onMounted(() => {
                            initMap();
                            })
                        }
                    }
                    </script>
                    <style scoped>
                        .home,#map{
                        height: 100%;
                        width: 100%;
                    }
                    </style>
```

引入源码方式基本就这几个步骤，以后会不定期的分享`Cesium`相关的文档，将利用业余时间开发一个二三维一体的`webgis`平台。