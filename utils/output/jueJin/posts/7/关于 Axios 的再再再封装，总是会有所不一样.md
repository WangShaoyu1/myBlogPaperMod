---
author: "Gaby"
title: "关于 Axios 的再再再封装，总是会有所不一样"
date: 2022-06-14
description: "最近是真的跟 `axios` 干上了，就是为了捣鼓出来一份用起来还比较顺手，且适应多场景的请求类的封装。应同事要求实现一个多实例化的，使用 class 封装的，那就安排上吧！"
tags: ["JavaScript","面试","架构中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:59,comments:11,collects:138,views:5486,"
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第15天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

废话只说一句：码字不易求个👍，收藏 === 学会,快行动起来吧！🙇‍🙇‍🙇‍。

为回馈掘金的小伙伴们，特地做了个文档站点，将前端知识及日常封装的工具类系统的整理在该站点上，希望能帮到更多的小伙伴[☞传送门](https://link.juejin.cn?target=https%3A%2F%2Fdocs.ycsnews.com%2F "https://docs.ycsnews.com/")，目前，本站内容正紧锣密鼓的更新中！

最近是真的跟 `axios` 干上了，就是为了捣鼓出来一份用起来还比较顺手，且适应多场景的请求类的封装。

2022年05月29日 的时候关于 Axios 初步进行了封装，采用函数式，也基本能满足大部分场景使用，而且使用也简单，具体内容可以看这篇文章 ☞ [\# 关于 Axios 的再封装...](https://juejin.cn/post/7103188409039978504 "https://juejin.cn/post/7103188409039978504")，但是就这还有人不满足，同事想要个可以多实例化的，使用 class 封装的，想想还是算了，咱也不敢得罪人，还是安排上吧！

### 特性

*   class 封装 可以多次实例化
*   默认全局可以共用一个实例对象
*   可以实例化多个对象，实例化时可以配置该实例特有的 `headers`
*   根据各个接口的要求不同，也可以针对该接口进行配置
*   设置请求拦截和响应拦截，这个都是标配了
*   拦截处理系统响应状态码对应的提示语

### 拦截器

首先为防止多次执行响应拦截，这里我们将拦截器设置在类外部，如下：

```js
import axios from "axios";

// 添加请求拦截器
    axios.interceptors.request.use((config) => {
    // 在发送请求之前做些什么 添加 token 等鉴权功能
    return config;
        }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
        });
        
        // 添加响应拦截器
            axios.interceptors.response.use((res) => {
            const {status} = res;
            // 对错误状态提示进行处理
            let message = '';
                if (status < 200 || status >= 300) {
                // 处理http错误，抛到业务代码
                message = showResState(status)
                    if (typeof res.data === 'string') {
                res.data = {code: status, message: message}
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
                
                    function showResState(state) {
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
```

### 封装主体

这里为了方便起见，实例化对象处理的其实就是传入的配置文件，而封装的方法还是按照 axios 原生的方法处理的。为了方便做校验在接口上都统一增加了客户端发起请求的时间，以方便服务端做校验。配置参数可参照文档 [axios 配置文档](https://link.juejin.cn?target=https%3A%2F%2Fdocs.ycsnews.com%2Fdocs%2Faxios.html "https://docs.ycsnews.com/docs/axios.html")

```js
// 构造函数
    constructor(config) {
    // 公共的 header
        let defaultHeaders = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json', // 通过头指定，获取的数据类型是JSON 'application/json, text/plain, */*',
        'Authorization': null
    }
    
        let defaultConfig = {
        headers: defaultHeaders
    }
    
    // 合并配置文件
        if (config) {
            for (let i in config) {
                if (i === 'headers' && config.headers) {
                    for (let i in config.headers) {
                    defaultHeaders[i] = config.headers[i];
                }
                defaultConfig.headers = defaultHeaders;
                    } else {
                    defaultConfig[i] = config[i];
                }
            }
        }
        // 全局使用
        this.init = axios;
        this.config = defaultConfig;
    }
```

get 方法的配置

```js
// Get 请求
    get(url, params = {}, headers = {}) {
    
    params.time = Date.now();
    
    // 合并 headers
        if (headers) {
            for (let i in headers) {
            this.config.headers[i] = headers[i];
        }
    }
        return new Promise((resolve, reject) => {
        // axios.get(url[, config])
            this.init.get(url, {
            ...this.config,
        ...{params: params}
            }).then(response => {
            resolve(response);
            })
                .catch(error => {
                reject(error)
                    }).finally(() => {
                    })
                    });
                }
```

post 请求

```js
// POST 请求
    post(url, params = {}, headers = {}) {
    
    url = url + '?time=' + Date.now();
    
        if (headers) {
            for (let i in headers) {
            this.config.headers[i] = headers[i];
        }
    }
    
        return new Promise((resolve, reject) => {
        // axios.post(url[, data[, config]])
            this.init.post(url, params, this.config).then(response => {
            resolve(response);
            })
                .catch(error => {
                reject(error)
                    }).finally(() => {
                    })
                    });
                }
```

PUT 请求

```js
// PUT 请求
    put(url, params = {}, headers = {}) {
    
    url = url + '?time=' + Date.now();
    
        if (headers) {
            for (let i in headers) {
            this.config.headers[i] = headers[i];
        }
    }
    
        return new Promise((resolve, reject) => {
        // axios.put(url[, data[, config]])
            this.init.put(url, params, this.config).then(response => {
            resolve(response);
            })
                .catch(error => {
                reject(error)
                    }).finally(() => {
                    })
                    });
                }
```

Delete 请求

```js
// Delete 请求
    delete(url, headers = {}) {
        if (headers) {
            for (let i in headers) {
            this.config.headers[i] = headers[i];
        }
    }
        return new Promise((resolve, reject) => {
        // axios.delete(url[, config])
            this.init.delete(url, {
            ...this.config,
                }).then(response => {
                resolve(response);
                })
                    .catch(error => {
                    reject(error)
                        }).finally(() => {
                        })
                        });
                    }
```

### 使用

完整的代码的代码在文末会贴出来，这里简单说下如何使用

```js
// @/api/index.js
import Http,{Axios} from '@/api/http'; // Axios 数据请求方法

// ① 可以使用文件中实例化的公共对象 Axios


// ②也可以单独实例化使用
    const XHttp = new Http({
        headers: {
        'x-token': 'xxx'
    }
    });
    
    
        export const getArticles = (params={}) => {
        return XHttp.get('https://api.ycsnews.com/api/v1/blog/getArticles', params);
    }
    
        export const getArticle = (params={}) => {
        return Axios.get('https://api.ycsnews.com/api/v1/blog/getArticles', params);
    }
```

在页面中使用

```js
// @/views/home.vue
import { getArticles,getArticle } from '@/api/index.js'

// 两个方法名差一个字母 's'
    getArticle({id:1234444}).then((res) => {
    console.log(res)
    })
        .catch(err => {
        console.log(err)
        })
        
            getArticles({id:1234444}).then((res) => {
            console.log(res)
            })
                .catch(err => {
                console.log(err)
                })
```

### 完整代码

```js
// @/api/http.js
/**
* 说明：
* 1.多实例化，可以根据不同的配置进行实例化，满足不同场景的需求
* 2.多实例化情况下，可共用公共配置
* 3.请求拦截，响应拦截 对http错误提示进行二次处理
* 4.接口可单独配置 header 满足单一接口的特殊需求
* body 直传字符串参数，需要设置 headers: {"Content-Type": "text/plain"}, 传参：System.licenseImport('"'+this.code+'"');
* import Http,{Axios} from '../http'; // Http 类 和 Axios 数据请求方法 如无特殊需求 就使用实例化的 Axios 方法进行配置 有特殊需求再进行单独实例化
*
*
*/
import axios from "axios";

// 添加请求拦截器
    axios.interceptors.request.use((config) => {
    // 在发送请求之前做些什么 添加 token 等鉴权功能
    return config;
        }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
        });
        
        // 添加响应拦截器
            axios.interceptors.response.use((res) => {
            const {status} = res;
            // 对错误状态提示进行处理
            let message = '';
                if (status < 200 || status >= 300) {
                // 处理http错误，抛到业务代码
                message = showResState(status)
                    if (typeof res.data === 'string') {
                res.data = {code: status, message: message}
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
                
                    function showResState(state) {
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
                
                    class Http {
                        constructor(config) {
                        // 公共的 header
                            let defaultHeaders = {
                            'Content-Type': 'application/json;charset=UTF-8',
                            'Accept': 'application/json', // 通过头指定，获取的数据类型是JSON 'application/json, text/plain, */*',
                            'Authorization': null
                        }
                        
                            let defaultConfig = {
                            headers: defaultHeaders
                        }
                        
                        // 合并配置文件
                            if (config) {
                                for (let i in config) {
                                    if (i === 'headers' && config.headers) {
                                        for (let i in config.headers) {
                                        defaultHeaders[i] = config.headers[i];
                                    }
                                    defaultConfig.headers = defaultHeaders;
                                        } else {
                                        defaultConfig[i] = config[i];
                                    }
                                }
                            }
                            this.init = axios;
                            this.config = defaultConfig;
                        }
                        
                        // Get 请求
                            get(url, params = {}, headers = {}) {
                            // 合并 headers
                                if (headers) {
                                    for (let i in headers) {
                                    this.config.headers[i] = headers[i];
                                }
                            }
                                return new Promise((resolve, reject) => {
                                // axios.get(url[, config])
                                    this.init.get(url, {
                                    ...this.config,
                                ...{params: params}
                                    }).then(response => {
                                    resolve(response);
                                    })
                                        .catch(error => {
                                        reject(error)
                                            }).finally(() => {
                                            })
                                            });
                                        }
                                        
                                        // POST 请求
                                            post(url, params = {}, headers = {}) {
                                                if (headers) {
                                                    for (let i in headers) {
                                                    this.config.headers[i] = headers[i];
                                                }
                                            }
                                            
                                                return new Promise((resolve, reject) => {
                                                // axios.post(url[, data[, config]])
                                                    this.init.post(url, params, this.config).then(response => {
                                                    resolve(response);
                                                    })
                                                        .catch(error => {
                                                        reject(error)
                                                            }).finally(() => {
                                                            })
                                                            });
                                                        }
                                                        
                                                        // PUT 请求
                                                            put(url, params = {}, headers = {}) {
                                                                if (headers) {
                                                                    for (let i in headers) {
                                                                    this.config.headers[i] = headers[i];
                                                                }
                                                            }
                                                            
                                                                return new Promise((resolve, reject) => {
                                                                // axios.put(url[, data[, config]])
                                                                    this.init.put(url, params, this.config).then(response => {
                                                                    resolve(response);
                                                                    })
                                                                        .catch(error => {
                                                                        reject(error)
                                                                            }).finally(() => {
                                                                            })
                                                                            });
                                                                        }
                                                                        
                                                                        
                                                                        // Delete 请求
                                                                            delete(url, headers = {}) {
                                                                                if (headers) {
                                                                                    for (let i in headers) {
                                                                                    this.config.headers[i] = headers[i];
                                                                                }
                                                                            }
                                                                                return new Promise((resolve, reject) => {
                                                                                // axios.delete(url[, config])
                                                                                    this.init.delete(url, {
                                                                                    ...this.config,
                                                                                        }).then(response => {
                                                                                        resolve(response);
                                                                                        })
                                                                                            .catch(error => {
                                                                                            reject(error)
                                                                                                }).finally(() => {
                                                                                                })
                                                                                                });
                                                                                            }
                                                                                        }
                                                                                        
                                                                                        export default Http;
                                                                                        
                                                                                        // 无特殊需求的只需使用这个一个对象即可 公共 header 可在此配置, 如需多个实例 可按照此方式创建多个进行导出
                                                                                            export const Axios = new Http({
                                                                                            baseURL:'https://docs.ycsnews.com',
                                                                                                headers: {
                                                                                                'x-http-token': 'xxx'
                                                                                            }
                                                                                            });
```