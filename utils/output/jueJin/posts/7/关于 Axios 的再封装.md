---
author: "Gaby"
title: "关于 Axios 的再封装"
date: 2022-05-29
description: "Axios 是一个基于 promise 的 HTTP 库，为方便使用对 Axios 进行精简二次封装，封装POST、GET、上传文件请求。"
tags: ["前端","JavaScript","架构中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:25,comments:0,collects:33,views:2664,"
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第2天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

废话只说一句：码字不易求个👍，收藏 === 学会, 快行动起来吧！🙇‍🙇‍🙇‍。2022.05.30

简介
--

Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中。虽然，Axios是个优秀的 HTTP 库，但是，直接在项目中使用并不是那么方便，会存在大量的重复性方法和代码，所以，我们需要对其进行一定程度上的配置封装，减少重复代码，精简调用方式。

本次使用 axios 版本为 `^0.21.4`

设计
--

先设计下我想要这个通用请求能达到什么样的效果：

*   优化配置，设置默认配置项（responseType、跨域携带cookie、token、超时设置）
*   统一设置请求头
*   根据环境设置 baseURL
*   通过 Axios 方法直接发起请求
*   添加请求拦截器
*   添加响应拦截器
*   导出 Primise 对象
*   封装 Post 方法，精简 post 请求方式
*   封装 Get 方法，精简 get 请求方式
*   请求成功，配置业务状态码
*   全局的loading配置

下面👇是 JS 版本

封装主体 Axios
----------

```js
// src/api/axios.js
import axios from "axios";
import Qs from 'qs'

    export const Axios = (url,method='get',params={},headers={})=>{
    // 根据 process.env.NODE_ENV 区分状态，切换不同的 baseURL 开发环境使用代理, 生产环境可以直接使用域名全拼
    const BaseUrl = process.env.NODE_ENV==='development'? '' : process.env.BASEURL;
    
        let defaultHeaders = {
        'Content-Type': 'application/json;charset=UTF-8',
        // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', // 指定提交方式为表单提交 或上传
        // 'Content-Type' :'multipart/form-data;charset=UTF-8',
        'Accept': 'application/json', // 通过头指定，获取的数据类型是JSON 'application/json, text/plain, */*',
        // 'Access-Control-Allow-Origin': 'true',
        // 'Access-Control-Allow-Credentials': 'true',
    }
    
        if(headers){
            for (let i in headers) {
            defaultHeaders[i] = headers[i];
        }
    }
    
        const showResState = (state) => {
        let message = ''
        // 这里只做部分常见的示例，具体根据需要进行配置
            switch (state) {
            case 400:
            message = '请求错误(400)'
            break
            case 401:
            message = '未授权，请重新登录(401)'
            break
            case 403:
            message = '拒绝访问(403)'
            break
            case 404:
            message = '请求出错(404)'
            break
            case 500:
            message = '服务器错误(500)'
            break
            case 501:
            message = '服务未实现(501)'
            break
            case 502:
            message = '网络错误(502)'
            break
            case 503:
            message = '服务不可用(503)'
            break
            default:
            message = `连接出错(${state})!`
        }
        return `${message}，请检查网络或联系网站管理员！`
    }
    
    // 添加请求拦截器
        axios.interceptors.request.use( (config) =>  {
        // 在发送请求之前做些什么
        console.log(config)
        
        // header 配置 Token 判断Token是否过期 没过期则正常处理 过期则发起刷新Token的请求 拿到新的Token保存
        config.headers.Authorization = null;
        // const token = !localStorage.getItem('__auth_provider_token__')?localStorage.setItem('__auth_provider_token__',''):localStorage.getItem('__auth_provider_token__');
        // let navigate = useNavigate();
        // if(sessionStorage.getItem("__auth_provider_isLogin__") !== '1' && isAuth ){//&& !token
        //     alert('token失效');
        //     navigate('/login');
        //     return new Promise((resolve, reject) => {});
    // }
    return config;
        }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
        });
        
        // 添加响应拦截器
        axios.interceptors.response.use(
            (res) => {
            const { status, data } = res;
            // 对错误状态提示进行处理
            let msg = ''
                if (status < 200 || status >= 300) {
                // 处理http错误，抛到业务代码
                msg = showResState(status)
                    if (typeof res.data === 'string') {
                res.data = {code:status, message:msg }
                    } else {
                    res.data.code = status
                    res.data.message = msg
                }
            }
            return data;
                }, function (error) {
                // 对响应错误做点什么
                return Promise.reject(error);
                });
                
                // 1. 执行异步ajax请求
                    const instance = axios({
                    // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
                    // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
                    baseURL: BaseUrl,
                    
                    // `url` 是用于请求的服务器 URL
                    url: url,
                    
                    // `method` 是创建请求时使用的方法
                    method: method || 'get',
                    
                    // mode: 'cors',
                    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    
                    // `headers` 是即将被发送的自定义请求头
                    headers: {...defaultHeaders},
                    
                    // `params` 是即将与请求一起发送的 URL 参数
                    // 必须是一个无格式对象(plain object)或 URLSearchParams 对象
                    params: method === 'get' ? params || {} : {},
                    
                    // `paramsSerializer` 是一个负责 `params` 序列化的函数
                    // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
                        paramsSerializer: function(params) {
                        return Qs.stringify(params, {arrayFormat: 'brackets'})
                        },
                        
                        // `data` 是作为请求主体被发送的数据
                        // 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
                        // 在没有设置 `transformRequest` 时，必须是以下类型之一：
                        // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
                        // - 浏览器专属：FormData, File, Blob
                        // - Node 专属： Stream
                        data: method === 'post' ? params || {} : {},
                        
                        // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
                        // 如果请求话费了超过 `timeout` 的时间，请求将被中断
                        timeout: 0,
                        
                        // `withCredentials` 表示跨域请求时是否需要使用凭证
                        withCredentials: false, // default 为true则产生跨域,跨域携带cookie
                        
                        // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
                        responseType: 'json', // default
                        });
                        
                            return new Promise((resolve, reject) => {
                                instance.then(response => {
                                // 2. 如果成功了, 调用resolve(value)
                                resolve(response);
                                })
                                    .catch(error => {
                                    // 3. 如果失败了, 不调用reject(reason), 而是提示异常信息
                                    reject(error)
                                    // message.error('请求出错了: ' + error.message).then(r => {});
                                        }).finally(() => {
                                        })
                                        });
                                    }
                                    
                                    // GET 请求 get 下 params 为查询参数
                                        export const Get = (url,params={},headers={}) => {
                                        return Axios(url,'get',params,headers)
                                    }
                                    
                                    // POST 请求 post 下 params 为body参数, 如果 post 下既需要传查询参数也需要传实体参数，则查询参数配置在 url 中
                                        export const Post = (url,params={},headers={}) => {
                                        return Axios(url,'post',params,headers)
                                    }
```

### 拦截器

在请求或响应被 `then` 或 `catch` 处理前拦截它们。

```js
// 添加请求拦截器
    axios.interceptors.request.use( (config) =>  {
    // 在发送请求之前做些什么
    console.log(config)
    
    // header 配置 Token 判断Token是否过期 没过期则正常处理 过期则发起刷新Token的请求 拿到新的Token保存
    config.headers.Authorization = null;
    // const token = !localStorage.getItem('__auth_provider_token__')
    //?localStorage.setItem('__auth_provider_token__','')
    //:localStorage.getItem('__auth_provider_token__');
    
    // let navigate = useNavigate();
        // if(sessionStorage.getItem("__auth_provider_isLogin__") !== '1' && isAuth && !token){
        //     alert('token失效');
        //     navigate('/login');
        //     return new Promise((resolve, reject) => {});
    // }
    return config;
        }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
        });
        
        // 添加响应拦截器
            axios.interceptors.response.use((res) => {
            // 对响应数据做点什么
            return res;
                }, function (error) {
                // 对响应错误做点什么
                return Promise.reject(error);
                });
```

### 状态处理

在响应拦截中，如果有需要还可以对状态码提示进行处理。现在项目一般后端都会给处理好，这个就根据自己的项目情况进行配置吧。

```js
// 根据不同的状态码，生成不同的提示信息
    const showResState = (state) => {
    let message = ''
    // 这里只做部分常见的示例，具体根据需要进行配置
        switch (state) {
        case 400:
        message = '请求错误(400)'
        break
        case 401:
        message = '未授权，请重新登录(401)'
        break
        case 403:
        message = '拒绝访问(403)'
        break
        case 404:
        message = '请求出错(404)'
        break
        case 500:
        message = '服务器错误(500)'
        break
        case 501:
        message = '服务未实现(501)'
        break
        case 502:
        message = '网络错误(502)'
        break
        case 503:
        message = '服务不可用(503)'
        break
        default:
        message = `连接出错(${state})!`
    }
    return `${message}，请检查网络或联系网站管理员！`
}

// 添加响应拦截器
axios.interceptors.response.use(
    (res) => {
    const { status, data } = res;
    // 对错误状态提示进行处理
    let msg = ''
        if (status < 200 || status >= 300) {
        // 处理http错误，抛到业务代码
        msg = showResState(status)
            if (typeof res.data === 'string') {
        res.data = {code:status, message:msg }
            } else {
            res.data.code = status
            res.data.message = msg
        }
    }
    return data;
        }, function (error) {
        // 对响应错误做点什么
        return Promise.reject(error);
        });
```

### 封装 Get 请求

```js
// GET 请求 get 下 params 为查询参数
    export const Get = (url,params={},headers={}) => {
    return Axios(url,'get',params,headers)
}
```

### 封装 Post 请求

```js
// POST 请求 post 下 params 为body参数, 如果 post 下既需要传查询参数也需要传实体参数，则查询参数配置在 url 中
// post 请求支持上传文件
    export const Post = (url,params={},headers={}) => {
    return Axios(url,'post',params,headers)
}
```

### 封装 API

```js
// src/api/index.js

import {Axios,Post,Get} from './axios'; // Axios 数据请求方法

/**
* 使用说明：
* import { login } from '@/api/index'
* 使用：
    * login(params).then((res)=>{
    *  // 业务处理
        * }).catch((err)=>{
        *   console.log(err)
        * });
        */
        
        /**
        * 请求示例--Get 示例
        * @params title string
        * ｛title: 'cp'｝
        */
            export const getArticles = (params={}) => {
            return Get('/api/v1/blog/getArticles', params);
        }
        
        /**
        * 请求示例--Post 示例
        * @params code string
        * ｛code: 'xxxxxxx'｝
        */
            export const saveArticles = (params={}) => {
            return Post('/api/v1/blog/saveArticles', params);
        }
        
        /**
        * Axios 示例
        * @params title string
        * ｛title:'标题'｝
        */
            export const getAxiosDemo = (params={}) => {
            return Axios('/api/v1/blog/getArticles','get', params);
        }
        
        /**
        * 请求示例--Post 上传示例
        * @params file object
        * file
        */
            export const upload = (params={}) => {
            return Post('/api/v1/article/upload', params);
        }
```

### 使用

```js
// 直接在页面中使用封装的方法
import { Axios, Get, Post } from '@/api'

// 使用 Axios 配置
Axios(
'/api/v1/blog/getArticles',
'get',
{id:123}
)
    .then((res: any) => {
    console.log(res)
        }).catch((err:any)=>{
        console.log(err)
        });
        
        // 使用 Get 请求
        Get(
        '/api/v1/blog/getArticles',
        'get',
    {id:123}
    )
        .then((res) => {
        console.log(res)
            }).catch((err)=>{
            console.log(err)
            });
            
            // 使用 Post 请求
            Post(
            '/api/v1/blog/getArticles',
        {id:123}
        )
            .then((res) => {
            console.log(res)
                }).catch((err)=>{
                console.log(err)
                });
```

对于在实际业务系统中，可以 对 Api 进行封装，放在一个或一组文件中，然后在页面中通过 API 接口名称进行调用，这样也便于管理 api 地址。对比下这种方式是不是很方便呢。

```js
// 在页面中使用封装好的 API
import { getArticles } from '@/api'

    getArticles({id:123}).then((res: any) => {
    console.log(res)
        }).catch((err:any)=>{
        console.log(err)
        });
        
```

### 上传

这里单独把上传文件的代码也贴出来，供参考

```js
<script setup>
import { ref } from 'vue';

const fileRef = ref(null);

    const handleUploadBtn = () => {
    fileRef.value.click();
}

    const handleUpload = () => {
    let file = fileRef.value.files[0];
        if (file.size > 10 * 1024 * 1024) {
        // 文件大小超限了
        alert('请上传小于10M的图片');
        fileRef.value.value = ''; // 清空内容
        return;
    }
    let forms = new FormData();
    forms.append('file', file);
    // forms.append('filePath', `pc/client-${moment().format('YYYY-MM-DD')}/`);
    fileRef.value.value = ''; // 清空内容
    
        upload(forms).then((res) => {
        console.log(res);
            }).catch((err)=>{
            console.log(err);
            });
        }
        </script>
        
        <template>
        <input
        type="file"
        accept="image/*"
        ref="fileRef"
        @change="handleUpload"
        />
        <button @click="handleUploadBtn">选择文件</button>
        </template>
```