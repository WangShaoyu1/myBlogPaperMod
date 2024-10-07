---
author: "TimeSky"
title: "实现ReactNative与内嵌H5相互通信"
date: 2023-11-04
description: "本文介绍了如何使用react-native-webview-callback，实现了ReactNative与内嵌H5相互通信并返回成功和失败的回调。"
tags: ["ReactNative","WebView"]
ShowReadingTime: "阅读6分钟"
weight: 576
---
业务场景
====

在移动端混合开发过程中，React Native使用webview内嵌H5，经常有H5向React Native发送消息和React Native向H5发送消息的场景，但是直接发送了消息并没有提供一个成功或者失败的回调。有很多时候我们不仅需要发送消息，还需要发送消息等待处理完成发回结果继续执行后续的业务逻辑。这个时候官方提供的通信方案就不能完全满足业务需求了，因此我封装了一个工具包可以解决这个问题。

> 以下主要讨论的业务场景是React Native使用webview内嵌H5的业务场景

**封装的工具包**：[react-native-webview-callback](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Freact-native-webview-callback "https://www.npmjs.com/package/react-native-webview-callback")

**工具包封装的思路：**

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f23ae788820414e8dd7cc5727751f1f~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1498&h=755&s=944045&e=png&b=fcf5f4)

常规React Native与H5的通信方式
======================

我们从不同的端发送消息，梳理一下常规的通信方式

H5端向React Native端发送消息
---------------------

H5端向 React Native端发送消息常见的有以下三种：URL Scheme 通信、

### URL Scheme 通信

React Native 可以通过定义自定义的 URL Scheme，允许在 H5 页面中通过跳转特定的 URL 来与 React Native 进行通信。H5 页面可以使用 JavaScript 的 window.location.href 或者`<a>` 标签等方式触发跳转，从而将数据传递给 React Native。优点：比较直接；缺点：传输数据有限，传递不了太多数据，有安全风险；

### Native Bridge

可以通过Android或者iOS Bridge的方式，都与客户端通信，不过这样通信链路太长了。

### 通过wevview的postMessage

在内嵌的网页中可以使用window.ReactNativeWebView.postMessage向React Native发送消息，在React Native端的webview监听onmessage即可监听到消息。

React Native端向H5端发送消息
---------------------

### 通过webview的injectJavaScript方法

React Native端可以直接运行webview的injectJavaScript方法在H5上，实现消息传递，改变全局变量等操作。

### 通过webview的postMessage方法

在React Native端可以使用webview的Ref比如webViewRef.current.postMessage来向H5发送消息，H5端监听onmessage可以接收到消息。

使用封装好的工具实现相互通信
==============

以上方案都是单项消息通信，消息发出去了，但是不知道有没有收到，也写比较多的逻辑才能实现成功和失败的回调，每个地方都写一遍维护起来比较混乱。

我封装了一个工具可以直接使用。 使用起来是这样的。

H5调用React Native端自定义的API方法，并获取成功失败的回调
-------------------------------------

tsx

 代码解读

复制代码

`import { useEffect, useState } from 'react' import {   mergeReactNativeApi,   useReactNativeAddListener,   reactNativeCallH5, } from 'react-native-webview-callback'; import myEvent from './customH5Api'; import './App.css'; function App() {   useH5AddListener(mergeH5Api(myEvent)) // just need init once ,Entry file   useEffect(() => {     window.localStorage.setItem('token', 'mytokenStrXXXXX');// mock data   },[])   const [result, setResult] = useState('--');   const testFn = () => {     h5CallreactNative({       methodName: "getAppInfo", // 这里是React Native端自定义的API       data: "", // 这里传递一些需要的数据     })       .then((data) => { // React Native端返回成功的回调         if (typeof data === 'object') {           setResult(JSON.stringify(data))         } else if (typeof data === 'string') {           setResult(data)         }         console.log("Successful data:", data);       })       .catch((error) => {// React Native端返回失败的回调         alert("Failed from React Native callback");         console.error("Failed data:", error);       });   }   return (     <>       <h1>H5</h1>       <div className="card">         <button onClick={testFn}>           click to getAPPInfo         </button>         <p>           {result}         </p>       </div>     </>   ) } export default App`

React Native调用H5端自定义的API方法，并获取成功失败的回调
-------------------------------------

tsx

 代码解读

复制代码

`// App.tsx import React, {useRef} from 'react'; import {   SafeAreaView,   ScrollView,   Alert,   StyleSheet,   Text,   useColorScheme,   View, } from 'react-native'; import {WebView} from 'react-native-webview'; import myEvent from './customNativeApi'; import {   mergeReactNativeApi,   useReactNativeAddListener,   reactNativeCallH5 }  from 'react-native-webview-callback'; const {alert} = Alert; function App(): JSX.Element {   const webViewRef: any = useRef(null);   // 收到消息   const onMessage = (event: any) => {     // eslint-disable-next-line react-hooks/rules-of-hooks     useReactNativeAddListener({       bridgeReactNativeApi: mergeReactNativeApi(myEvent), // Merge into custom methods on listening objects       webViewRef,       event,     });   };   const handleLoadEnd = () => {     reactNativeCallH5({       dataParms: {         methodName: 'getWebToken', // 这是调用H5自定义的API         data: '', // 根据具体场景传递业务数据       },       webViewRef: webViewRef,     })       .then((data: any) => { // 成功回调         alert(data || 'Successful data:');         console.log('Successful data:', data);       })       .catch(error => { // 失败回调         console.log('Failed data:', error);         alert('Failed from H5 callback');       });   };   return (     <WebView       ref={webViewRef}       source={{         uri: 'http://192.168.XXX.XXX:5173',  // 换成你自己的IP地址或者域名地址       }}       originWhitelist={['*']}       allowFileAccess={true}       onMessage={onMessage}       onLoadEnd={handleLoadEnd}       geolocationEnabled={true}       allowUniversalAccessFromFileURLs={true}       useWebKit={true}     />   ); } export default App;`

实现原理
====

上文中说过React Native可以通过postMessage向H5发送消息，同时H5也可以通过postMessage向React Native发送消息。这样就有通信的基础，只要约定好通信的数据及参数格式，当消息发过来的时候封装一个promise，返回成功和失败的回调方法即可。

React Native端核心源码
-----------------

*   channelName：通信的渠道名称，避免受到网页其他postMessage的干扰；
*   methodType：代表当前处于调用状态还是回调状态
*   methodName：自定义API方法名
*   data： 传递的数据
*   sourceMethodName ：原始方法名（因为回调的之后方法名做了覆盖）
*   successKey：成功回调需要调用的方法名，通过event emit触发，该名称由methodName和时间戳拼接，这样同一个方法不同时间被调用可以确保有序的响应。
*   errorKey：失败回调需要调用的方法名，通过event emit触发，该名称由methodName和时间戳拼接，这样同一个方法不同时间被调用可以确保有序的响应。

ts

 代码解读

复制代码

`export interface useReactNativeAddListenerArgs {   bridgeReactNativeApi: any;   webViewRef: any;   event: any; } export const useReactNativeAddListener = (   messageProps: useReactNativeAddListenerArgs, ) => {   const {bridgeReactNativeApi, webViewRef, event} = messageProps;   const dataSource = event?.nativeEvent?.data;   try {     if (dataSource && dataSource !== 'undefined') {       const messageData: MethodCallArgs = dataSource && JSON.parse(dataSource) || {};       const {         channelName,         methodType,         methodName,         data,         sourceMethodName,         successKey,         errorKey,       } = messageData;       if (channelName === defaultChannelName) {         if (methodType === CallType.callBack) {           // H5 回调到react native           eventEmiter.emit(methodName, data);           eventEmiter.off(successKey, () => {});           eventEmiter.off(errorKey, () => {});         } else if (methodType === CallType.call) {           // H5调用react native的方法           if (             bridgeReactNativeApi.hasOwnProperty(sourceMethodName) &&             typeof bridgeReactNativeApi[sourceMethodName] === 'function'           ) {             bridgeReactNativeApi[sourceMethodName](data)               .then((res: any) => {                 const successObj = {                   ...messageData,                   data: res,                   methodType: CallType.callBack,                   methodName: successKey,                 };                 webViewRef?.current?.postMessage(JSON.stringify(successObj), '*');               })               .catch(err => {                 const errObj = {                   ...messageData,                   data: err,                   methodType: CallType.callBack,                   methodName: errorKey,                 };                 webViewRef?.current?.postMessage(JSON.stringify(errObj), '*');               });           }         }       }     }   } catch (error) {     console.error(error);   } };`

H5端 核心源码
--------

与React native类似，这里就不做参数的具体解释了。

ts

 代码解读

复制代码

``// 统一封装react native调用H5及回调返回，通过promise的方式 export const reactNativeCallH5 = (   reactNativeCallH5Props: reactNativeCallH5Args, ) => {   const {dataParms, webViewRef} = reactNativeCallH5Props;   return new Promise((resolve, reject) => {     const {       channelName = defaultChannelName,       methodType = CallType.call,       methodName = 'methodName',       data = '',     } = dataParms;     const timeStr = `${new Date().getTime()}`;     const successKey = `${methodName}_${timeStr}_success`;     const errorKey = `${methodName}_${timeStr}_error`;     const obj: MethodCallArgs = {       channelName,       methodType,       methodName,       sourceMethodName: methodName,       data,       timeStr,       successKey,       errorKey,     };     // 挂载成功的回调     eventEmiter.on(successKey, res => {       resolve(res);     });     // 挂载失败的回调     eventEmiter.on(errorKey, err => {       reject(err);     });     webViewRef?.current?.postMessage(JSON.stringify(obj), '*');   }); };``

其他
--

本npm包一共导出了以下这些方法，大家有兴趣可以看一下源码和DEMO

*   mergeH5Api（合并基础API方法和项目中自定义的H5 API提供给React Native调用）
*   useH5AddListener （H5端初始化，只需要在入口文件执行一次）
*   h5CallreactNative （业务中H5端用这个方法调用React Native的自定义API方法）
*   mergeReactNativeApi（合并基础API方法和项目中自定义的H5 API提供给H5调用）
*   useReactNativeAddListener（React Native端初始化，只需要webview 的onmessage中执行一次）
*   reactNativeCallH5 （业务中React Native端用这个方法调用H5的自定义API方法）

DEMO地址
======

[react-native-webview-callback](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Freact-native-webview-callback "https://www.npmjs.com/package/react-native-webview-callback") npm包 React Native和H5项目接入的完整DEMO可以看[react-native-webview-callback-demo](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fliutaohz%2Freact-native-webview-callback-demo "https://github.com/liutaohz/react-native-webview-callback-demo")

欢迎使用[react-native-webview-callback](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Freact-native-webview-callback "https://www.npmjs.com/package/react-native-webview-callback") ，如果有问题或者建议欢迎提issues或者PR，可以的话帮忙点个start ^\_^