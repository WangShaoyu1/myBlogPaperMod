---
author: "Gaby"
title: "你是否遇到axios的interceptors多次执行"
date: 2022-06-13
description: "在进行 `axios` 封装的时候,遇到每次发起请求时axios 都会执行两次响应拦截，甚是纳闷，一时理不出思路来。通过努力终是解决掉了！"
tags: ["JavaScript","面试","架构中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:5,comments:5,collects:6,views:2741,"
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第14天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

废话只说一句：码字不易求个👍，收藏 === 学会,快行动起来吧！🙇‍🙇‍🙇‍。

为回馈掘金的小伙伴们，特地做了个文档站点，将前端知识及日常封装的工具类系统的整理在该站点上，希望能帮到更多的小伙伴[☞传送门](https://link.juejin.cn?target=https%3A%2F%2Fdocs.ycsnews.com%2F "https://docs.ycsnews.com/")，目前，本站内容正紧锣密鼓的更新中！

### 问题

在进行 `axios` 封装的时候,遇到个问题，就是每次发起请求时axios 都会执行两次响应拦截，甚是纳闷，一时理不出思路来。

代码如下：

```js
    class Http {
        constructor(config) {
        this.axios = axios;
        this.axiosInterceptor = undefined;
        
        // 公共的 header
            let defaultHeaders = {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'application/json', // 通过头指定，获取的数据类型是JSON 'application/json, text/plain, */*',
            'x-end-point': '.10.'
        }
        
            if(config?.headers){
                for (let i in config.headers) {
                defaultHeaders[i] = config.headers[i];
            }
        }
        
            axios({
            // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
            // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
            baseURL: config?.baseURL,
            
            // `url` 是用于请求的服务器 URL
            url: config?.url,
            
            // `method` 是创建请求时使用的方法
            method: config?.method || 'get',
            
            // `headers` 是即将被发送的自定义请求头
            headers: {...defaultHeaders},
            
            // `params` 是即将与请求一起发送的 URL 参数
            // 必须是一个无格式对象(plain object)或 URLSearchParams 对象
            params: config?.method === 'get' ? config?.params || {} : {},
            
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
                data: config?.method === 'post' ? config?.params || {} : {},
                
                // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
                // 如果请求话费了超过 `timeout` 的时间，请求将被中断
                timeout: 0,
                
                // `withCredentials` 表示跨域请求时是否需要使用凭证
                withCredentials: false, // default 为true则产生跨域,跨域携带cookie
                
                // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
                responseType: 'json', // default
                });
                
                // 添加请求拦截器
                    axios.interceptors.request.use( (config) =>  {
                    // 在发送请求之前做些什么
                    return config;
                        }, function (error) {
                        // 对请求错误做些什么
                        return Promise.reject(error);
                        });
                        
                        // 添加响应拦截器
                            axios.interceptors.response.use((res) => {
                            const { status, data } = res;
                            // 对错误状态提示进行处理
                            let message = ''
                                if (status < 200 || status >= 300) {
                                // 处理http错误，抛到业务代码
                                message = this.showResState(status)
                                    if (typeof res.data === 'string') {
                                res.data = {code:status, message }
                                    } else {
                                    res.data.code = status
                                    res.data.message = message
                                }
                            }
                            return res.data;
                                }, function (error) {
                                // 对响应错误做点什么
                                return Promise.reject(error);
                                });
                            }
                            
                                get(url,params={}){
                                // 为给定 ID 的 user 创建请求
                                    return new Promise((resolve, reject) => {
                                        this.axios.get(url,{
                                        params
                                            }).then(response => {
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
                                                
                                                    post(url,params={}){
                                                        return new Promise((resolve, reject) => {
                                                            this.axios.post(url, params).then(response => {
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
                                                                
                                                                    showResState (state) {
                                                                    let message = '';
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
                                                                // 插件初始化时会传入所需的配置项
                                                                    autoAddToken (config) {
                                                                    // 在请求阶段时修改 config 配置项为其添加 token 具体属性名称可自定义
                                                                config.headers ??= {}
                                                                config.headers.Authorization = localStorage.token || null
                                                                return config
                                                            }
                                                            
                                                            
                                                        }
                                                        
                                                        export default Http;
```

可能遇到过该类问题的小伙伴们一眼就看出问题所在，对于未有碰到过这个问题的小伙伴，可能就又点煎熬了。

原因：
---

若你使用use，就像Node.js里的use那样，会不断地往axios对象添加interceptors，由于我将该拦截器放在函数内，只要函数被执行，则会再次将拦截器函数增添到axios对象上。

所以，推荐的办法是，将拦截器放在函数外，可我的需求决定了，我必须将它放在函数内，那么该如何解决呢？

解决
--

添加该文件内的唯一变量标识符`let interceptor = null`，进行判断，只要拦截器存在，则不会继续添加，部分代码如下所示：

```js
    if (!this.interceptor) {
    // 添加响应拦截器
        this.interceptor = axios.interceptors.response.use((res) => {
        const { status, data } = res;
        // 对错误状态提示进行处理
        let message = ''
            if (status < 200 || status >= 300) {
            // 处理http错误，抛到业务代码
            message = this.showResState(status)
                if (typeof res.data === 'string') {
            res.data = {code:status, message }
                } else {
                res.data.code = status
                res.data.message = message
            }
        }
        return res.data;
            }, function (error) {
            // 对响应错误做点什么
            return Promise.reject(error);
            });
        }
        
```

奈何不好使。不得一不得不把拦截器提取到类外部，问题解决。

这里只贴部分主要代码:

```js
import axios from "axios";

/* 将拦截器 置于封装类之外 */
// 添加请求拦截器
    axios.interceptors.request.use( (config) =>  {
    // 在发送请求之前做些什么 添加 token 等鉴权功能
    //...
    return config;
        }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
        });
        
        // 添加响应拦截器
            axios.interceptors.response.use((res) => {
            const { status } = res;
            // 在发送结果之前做些什么  对错误状态提示进行处理
            //...
            return res.data;
                }, function (error) {
                // 对响应错误做点什么
                return Promise.reject(error);
                });
                
                
                    class Http {
                        constructor(config) {
                        this.axios = axios;
                        // 这里仍需对配置进行处理，代码省略了
                        this.config = config;
                    }
                    
                    // Get 请求
                        get(url,params={},headers={}){
                        // ...
                    }
                    // POST 请求
                        post(url,params={},headers={}){
                        // ...
                    }
                }
                
                export default Http;
                
                // 无特殊需求的只需使用这个一个对象即可 公共 header 可在此配置, 如需多个实例 可按照此方式创建多个进行导出
                    export const Axios = new Http({
                        headers: {
                        'x-http-token': 'xxx'
                    }
                    });
```

这里不对具体的方法进行描述，只做一个解决问题的说明，后续会针对 axios 类的封装，单独写篇文章再详细说明下的。