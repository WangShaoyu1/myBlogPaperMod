---
author: "你打代码像蔡徐坤"
title: "nodekoa转发请求【文件上传】的问题"
date: 2024-09-24
description: "需求背景代码分析在对请求中只处理一种方式。就是普通的post请求,但是公司是查看附件是通过流的形式返回。上传是通过formData的方式处理。因此思考过后需要再添加2种方式来转发。对应上传与查看"
tags: ["后端","Node.js"]
ShowReadingTime: "阅读3分钟"
weight: 242
---
### 需求背景

> 在一个奇葩的项目中。开发公众号用koa处理。对于接口则进行转发到.net的框架后端。因此在一个新需求中对于需要上传文件中没有处理。维护的人提桶了。因此在处理中发现了一点点问题

### 代码分析

js

 代码解读

复制代码

`const bodyparser = require('koa-bodyparser') app.use(bodyparser())`

js

 代码解读

复制代码

`const response = await axios.post(targetUrl + requestPath, body , { headers:{           timeout:600*1000,           license,             'Content-Type': 'application/json; charset=utf-8',         } });         // 将目标服务器的响应转发给客户端         ctx.status = response.status;         ctx.body = response.data;`

##### 在对请求中只处理一种方式。就是普通的post请求,但是公司是查看附件是通过流的形式返回。上传是通过formData的方式处理。因此思考过后需要再添加2种方式来转发。对应上传与查看

#### 上传附件的请求改造

*   _koa-bodyparser_并不支持关于_formData_的接收
*   原先的_Content-Type：application/json_也需要处理成_multipart/form-data_

#### 处理方式

1.  引入koa-body支持文件信息
2.  引入form-data模板浏览器的formData传输;
3.  处理Content-Type

##### koa-body的接收参数ctx.request如下

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/3a0ea6a84b9b4dcca269c4f0495abd19~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5L2g5omT5Luj56CB5YOP6JSh5b6Q5Z2k:q75.awebp?rk3s=f64ab15b&x-expires=1727777840&x-signature=aBqP0p%2FC3w24AqrdRGqn%2BiiH%2Be8%3D)

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/54c8c6692ba24bd687b30dcd7aea9a61~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5L2g5omT5Luj56CB5YOP6JSh5b6Q5Z2k:q75.awebp?rk3s=f64ab15b&x-expires=1727777840&x-signature=1kUBQZkfMK2tFgQau1XIAFQDQD8%3D)

##### 处理代码如下

js

 代码解读

复制代码

`const formData = new FormData();         const fields = ctx.request.body;         const files = ctx.request.files;                        // 将普通字段添加到新的 FormData 中         Object.keys(fields).forEach((key) => {           formData.append(key, fields[key]);         });         //将文件信息添加到新的FormData 中         Object.keys(files).forEach((key) => {           formData.append(key,fs.createReadStream(files[key].path),files[key].name);         })                      // 发起转发请求         const license = headers.license || null;         const response = await axios({           method: 'POST',           url: targetUrl + requestPath,           headers: {             license,             'Content-Type':'multipart/form-data'           },           timeout:600*1000,           data:formData,           // headers: formdata.getHeaders(),`
        

#### 查看上传附件的请求改造

*   node的环境不支持_responseType：blob_，

##### 原因如下

*   **Node.js 环境**：`Blob` 是浏览器环境中的一种数据类型，它在服务器端的 Node.js 中原生并不支持。因此，如果你在 Koa 服务器上转发请求，直接使用 `blob` 会导致兼容性问题，因为 Node.js 没有对 `Blob` 的内建支持。
    
*   **浏览器环境**：如果你是在浏览器中执行这段代码，使用 `blob` 作为 `responseType` 是可行的，浏览器会直接处理并返回 `Blob` 对象。
    
*   **arraybuffer特性**： 是一种通用的二进制数据格式，它既适用于 Node.js 环境，也适用于浏览器环境。因为 `Blob` 不能直接用于 Node.js，使用 `arraybuffer` 可以在接收到二进制数据后，根据需要将其转换为 `Blob`，这样你的代码可以同时兼容浏览器和服务器端。
    
*   **arraybuffer灵活性**：使用 `arraybuffer` 后，你可以根据需要将其转化为其他数据类型。例如，如果你需要将数据传输给前端并希望前端处理为 `Blob`，可以在服务器端使用 `arraybuffer` 获取数据，然后再通过 `Buffer` 转化或直接传输给前端，由前端将其转换为 `Blob`。
    

#### 处理方式

_responseType：arraybuffer_

#### 处理代码如下

js

 代码解读

复制代码

  `try {              // 发起转发请求         const response = await axios({           url:targetUrl + requestPath ,           method:"GET",           responseType: 'arraybuffer', // 使用 'arraybuffer' 来处理二进制数据           headers: {             license,                         'Content-Type': 'application/json', // 或者根据需求设置合适的内容类型           }         },);         // 将目标服务器的响应转发给客户端         ctx.status = response.status;          // 将 arraybuffer 转换为 Buffer 以适应 Koa         ctx.body = Buffer.from(response.data);         // 设置响应头中的内容类型，保持与目标服务器一致         ctx.set('Content-Type', response.headers['content-type']);               } catch (error) {         ctx.status = 500;         ctx.body = 'Internal Server Error';         console.error(error);       }`