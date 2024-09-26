---
author: "南小府"
title: "【原生前端】快速建造一个漂亮的天气APP"
date: 2024-09-19
description: "1.页面展示首页搜索页面2.页面搭建首先在vscode中新建index.html与style.css，并在inidex.html中引入style.css文件然后搭建基本页面骨架,页面骨架"
tags: ["前端","HTML"]
ShowReadingTime: "阅读4分钟"
weight: 395
---
1.页面展示
------

### 首页

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/52df0d3118dc46dbaa6d8e804ce8051d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=OKr6DNX9MigdmBMCIgXH0kXp7rU%3D)

### 搜索页面

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f2a3d0600f0142d89c2828d6e09bd156~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=akLMunRl35Qj0g51CkfdVHxibf0%3D)

2.页面搭建
------

要用到的图标资源： 我用夸克网盘分享了「icons」，点击链接即可保存。打开「夸克APP」，无需下载在线播放视频，畅享原画5倍速，支持电视投屏。 链接：[pan.quark.cn/s/7c4727cb1…](https://link.juejin.cn?target=https%3A%2F%2Fpan.quark.cn%2Fs%2F7c4727cb1b6b "https://pan.quark.cn/s/7c4727cb1b6b")

首先在 vscode 中新建index.html与style.css，并在inidex.html中引入style.css文件

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/aab1cc1738eb4c66b6dfa2c16c9de09a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=oVTXtKhsWHUTqraDJFvlMycLFOs%3D)

然后搭建基本页面骨架,页面骨架分为三个部分。顶部的搜索栏，中间的天气，以及底部的未来天气部分。

### 2.1 顶部搜索栏

首先实现搜索栏

HTML

 代码解读

复制代码

    `<div class="container">         <!-- Search section -->         <div class="search-section">             <div class="input-wrapper">                 <span class="material-symbols-rounded">search</span>                 <input type="search" placeholder="Enter a city name" class="search-input">             </div>             <button class="location-button">                 <span class="material-symbols-rounded">my_location</span>             </button>         </div>     </div>`

小图标采用google fonts实现，并采用rounded样式

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/b2671eb4111c40e78a4a5e165e87ff03~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=jlxM1PuofEKrEDNis39b8naleNI%3D)

#### 显示小图标

要使用小图标可以直接在google fonts中搜索需要的图标，然后点击 copy code 并粘贴在head标签内

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ba1614d94455439b9e7688b27cb23890~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=azm7Z9M748dq6dFOL2h7vrbwyUM%3D)

然后新建一个material-symbols-rounded的类填写上图标类别即可显示图标。

JavaScript

 代码解读

复制代码

`<span class="material-symbols-rounded">search</span>`

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/a41fca13f66840b88ffde35cd49e087d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=aGtsG%2F4VHg71QwL06sAhRZOmeEA%3D)

### 2.2 当前天气

首先是HTML骨架

HTML

 代码解读

复制代码

        `<div class="weather-section">             <!-- Current weather -->             <div class="current-weather">                 <img src="icons/clouds.svg" alt="" class="weather-icon">                 <h2 class="temperature">20<span>°C</span></h2>                 <p class="description">Partly Cloudly</p>             </div>             <!-- Hourly weather forecast list -->              <div class="hourly-weather">                 <ul class="weather-list">                     <li class="weather-item">                         <p class="description">00:00</p>                         <img src="icons/clouds.svg" alt="" class="weather-icon">                         <p class="temperature">20°</p>                     </li>                     <li class="weather-item">                         <p class="description">00:00</p>                         <img src="icons/clouds.svg" alt="" class="weather-icon">                         <p class="temperature">20°</p>                     </li>                 </ul>              </div>         </div>`

2.3 导入字体
--------

在style.css中导入Montserrat字体,并重置CSS设置

CSS

 代码解读

复制代码

`@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@1,100..900&display=swap'); *{     margin: 0;     padding: 0;     box-sizing: border-box;     font-family: "Montserrat", sans-serif; }`

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ca5465e46cb1410686c836b07d53d6be~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=BQVjhtLc%2BF%2FekRMqP39NmamqvSM%3D)

### 2.4 css

编写body部分使得container居中

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/eb49551bb5824dd3b610100a42dabadc~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=oUXb0rfuGovfjY6WZU0TxcNWr%2FM%3D)

css

 代码解读

复制代码

`body{     display: flex;     align-items: center;     justify-content: center;     background: #5f5f5f; } .container{     background-color: #fff; }`

编写hourly-weather的图标布局,使其为水平方向布局

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/cd4fbb3b955040e1a2db50a1fedc6088~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=7RudAwDgYduUKttwdEF91B5ls4A%3D)

css

 代码解读

复制代码

`.hourly-weather .weather-list {     display: flex; } .hourly-weather .weather-item .weather-icon {     width: 28px;     aspect-ratio: 1; }`

在body标签上添加min-height属性，让container垂直居中

css

 代码解读

复制代码

`body { //... min-height:100vh }`

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/72731c51356744659c460c04b070b605~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=Px17gGHmca4MJhYldUiySyD7t70%3D)

然后美化container显示效果

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/9ea14d82b2244f75a567a7013d2aebd0~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=M8o%2FEVvkdSF0%2F82fietUYR0P9H8%3D)

css

 代码解读

复制代码

`.container{     background-color: #fff;     border-radius: 10px;     max-width: 425px;     flex-grow: 1;     box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); }`

然后接着美化search部分布局

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/47c17e069c7d4b7784d1ec593115f707~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=7va0EEDzguJmXYWLS8bFye7fv0Y%3D)

css

 代码解读

复制代码

`.search-section {     display: flex;     padding: 25px;     align-items: center; } .search-section .input-wrapper {     height: 54px;     width: 100%; } .search-section .search-input {     height: 100%;     width: 100%;     outline: none;     font-size: 1rem;     font-weight: 500;     padding: 0 20px 0 50px;     border-radius: 6px;     border: 1px solid #beb0ff; }`

搜索小图标需要放在搜索框里，可以使用绝对布局实现。

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/48d08f0bed9649ce9674c637fcee5929~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=UnSrtAWVUEA5y0mIGW%2FPLm1j0Qc%3D)

css

 代码解读

复制代码

`.search-section .input-wrapper { //... position: relative } .search-section .input-wrapper span{     position: absolute;     top: 50%;     left: 17px;     pointer-events: none;     transform: translateY(-50%); }`

美化按钮布局

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/d20062e88f8c41649985cf544944a14d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=CmHNf3f7k9wwYbgULzHRtnrGslI%3D)

css

 代码解读

复制代码

`.search-section { gap:10px } .search-section .location-button{     display: flex;     flex-shrink: 0;     align-items: center;     justify-content: center;     height: 54px;     width: 56px;     outline: none;     cursor: pointer;     background-color: #fff;     background-color: #fff;     outline: none;     border-radius: 6px;     border:1px solid #beb0ff; } .search-section .location-button span{     font-size: 1.3rem;//调整图标大小 }`

添加hover特效

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f6acc6df97eb4d1d8333265bef29d6b0~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=XajCUnwmQuXXgX%2BKQU0gSvVhcjI%3D)

css

 代码解读

复制代码

`.search-section .location-button{     //...     transition: 0.3s ease; } .search-section .location-button:hover{     color: #fff;     background-color: #5f41e4;     border-color: #5f41e4; }`

搜索框同样可以添加聚焦特效

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/95b9b598cabb420eb3ffd8faa8f02483~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=BXSLCr7nN1WVzLeKtLA0AV%2BNMjY%3D)

接着对current-section进行布局

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/69f5a0def28c4eac88d2efbfa01d0450~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=wPXk%2ByLU6K91jeGrY5cJ7fB50TE%3D)

css

 代码解读

复制代码

`.weather-section .current-weather {     display: flex;     align-items: center;     padding: 20px 0 50px;     flex-direction: column; } .current-weather .weather-icon {     width: 140px;     aspect-ratio: 1; } .current-weather .temperature {     font-size: 3.38rem;     margin: 23px 0;     display: flex; } .current-weather .temperature span {     font-size: 1.56rem;     font-weight: 500px;     margin: 5px 0 0 2px ; } .current-weather .description {     font-size: 1.25rem;     font-weight: 500; }`

最后对余下部分进行布局

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/6f53cde22f82496ea04a6d973dbb062e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=YxJTueLAXC5Ims1aDBi7q12OZVg%3D)

css

 代码解读

复制代码

`.hourly-weather .weather-list {     display: flex;     list-style: none;     gap: 43px;     overflow-x: auto; } .hourly-weather .weather-item .weather-icon {     width: 28px;     aspect-ratio: 1; } .hourly-weather {     padding: 16px 25px;     border-top: 1px solid #d5ccff; }`

滚动条有些难看，接着美化滚动条

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/33fba6fb67594e64bdeeff64e8b17f36~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=qggsfjwHAqr4Em19FODPaQAZc6c%3D) ![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/80a1f073461c43f79e36d06f245f69ea~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=QtZ%2FjC0gl3L7h7GBPmsftPbEEb4%3D)

然后对weather-item进行美化

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/12598125b60541338dc3dda8b9b2df00~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=OPeRxqYTNeByGnQqP2WhdtW%2BLe0%3D)

css

 代码解读

复制代码

`.hourly-weather .weather-item{     display: flex;     gap: 7px;     font-weight: 500;     align-items: center;     flex-direction: column; }`

将滚动条置于最底部：

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/4c491bbaa10e40d5b942889a0e9514f5~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=LcpyeO9GdB5z4PCt7eO7MrY%2F32k%3D)

css

 代码解读

复制代码

`.hourly-weather .weather-list { //...     padding-bottom: 16px;     margin-bottom: -16px; }`

3.Js交互部分
--------

### 3.1 获取搜索框输入值

按下Enter键后即可查询对应城市天气细节

javascript

 代码解读

复制代码

`const searchInput = document.querySelector(".search-input") searchInput.addEventListener("keyup", (e)=>{     const cityName = searchInput.value.trim()     if(e.key == "Enter" && cityName){         console.log(cityName);     } })`

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/96d082293b6846daae0066b9c6234343~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=Z4yjwqoe5%2Bs0YB5Z1uzv7HhBHm4%3D) ![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/615b9f2020be46f48f69d2c7a59173f0~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=mb94pMOO17CnYHwUb3Mw4yuoo90%3D)

### 3.2天气API

按照高德地图[天气API](https://link.juejin.cn?target=https%3A%2F%2Flbs.amap.com%2Fapi%2Fwebservice%2Fguide%2Fapi%2Fweatherinfo "https://lbs.amap.com/api/webservice/guide/api/weatherinfo")手册申请密钥 随后编写请求API代码

javascript

 代码解读

复制代码

``const getWeatherDetail = async (cityName) => {     const city = '110101'     const API_URL = `https://restapi.amap.com/v3/weather/weatherInfo?key=${key}&city=${city}&output=JSON`     try {         const response = await fetch(API_URL)         const data = await response.json()                           const temperature = data['lives'][0]['temperature']         console.log(temperature);     } catch (error) {         console.log(error);     } }``

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/2b9bbd39dab44fcbbfa780ad6943793e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=%2FeCEEVcrBWe%2FuAC6tzImTMAHYJE%3D)

测试API成功后获取相应的数据

### 3.3 展示当前天气

在response中获取出temperature和description

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ebb5d31307cf40c1bf38e0357085bab8~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=MtcG%2Be93kH9JIS0RAT4CS5n5Bjw%3D)

js

 代码解读

复制代码

``//... const currentWeatherDIV = document.querySelector(".current-weather") const getWeatherDetail = async (cityName) => { //... //当前天气情况         const temperature = data['lives'][0]['temperature']         const description = data['lives'][0]['weather']         //更新当前天气        currentWeatherDIV.querySelector(".temperature").innerHTML = `${temperature}<span>°C</span>`         currentWeatherDIV.querySelector(".description").innerText = description }``

然后更新天气图标，更新天气图标需要有一个转换表

![image.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/3702308441f44f559b352aab09eea1af~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y2X5bCP5bqc:q75.awebp?rk3s=f64ab15b&x-expires=1727676868&x-signature=lp8%2BliWp5QlTSFMf8Y0E7%2FUbw3Q%3D)

js

 代码解读

复制代码

``const getWeatherDetail = async (cityName) => {  const weatherIconMap={         '晴':'clear',         '雨':'rain',         '雷':'thunder',         '雷雨':'thunder_rain',         '多云':'clouds',         '雾':'mist',         '雪':'snow'     }   //...         const weatherIconKey = Object.keys(weatherIconMap).find(icon => description.includes(icon))         const weatherIcon = weatherIconMap[weatherIconKey]            //更新当前天气         currentWeatherDIV.querySelector(".weather-icon").src = `icons/${weatherIcon}.svg`          //... }``

已经完成80%了，剩下的不整了，麻烦鼠了QAQ！