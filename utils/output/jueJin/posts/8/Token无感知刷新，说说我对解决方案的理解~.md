---
author: "Sunshine_Lin"
title: "Token无感知刷新，说说我对解决方案的理解~"
date: 2023-10-15
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心。 大家设想一下，如果有一个超级大的表单页面，用户好不容易填完了，然后点击提交，这个时候请求接口居然返回"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:171,comments:38,collects:259,views:8653,"
---
前言
--

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心。

![](/images/jueJin/382c8c1154df420.png)

大家设想一下，如果有一个超级大的表单页面，用户好不容易填完了，然后点击提交，这个时候请求接口居然返回401，然后跳转到登录页。。。那用户心里肯定是一万个草泥马~~~

所以项目里实现`token无感知刷新`是很有必要的~

![](/images/jueJin/9dd14868a1f1414.png)

这几天在项目中实践了一套`token无感知刷新`的方案，其实也有看了一下网上那些解决方案，也知道这类的方案已经烂大街了，但是感觉不太符合我想要的效果，主要体现在以下几个方面：

*   逻辑都写拦截器里，耦合性高，不太好
*   接口重试的机制做的不太好
*   接口并发时的逻辑处理做的不太好

我为什么不想要让这套逻辑耦合在拦截器里呢？一方面是因为，我想要写一套代码，在很多的项目里面可以用，把代码侵入性降到最低

另一方面，因为我觉得`token无感知刷新`涉及到了`接口重发`，我理解是接口维度的，不应该把这套逻辑放在响应拦截器里去做。。我理解重发之后就是一个独立的新接口请求了，不想让两个独立的接口请求相互有交集~

所以我还是决定自己写一套方案，并分享给大家，希望大家可以提提意见啥的，共同进步~

> 温馨提示：需要有一些`Promise`基础

思路
--

其实大体思路是一样的，只不过实现可能有差别~就是需要有两个 token

*   **accessToken**：普通 token，时效短
*   **refreshToken**：刷新 token，时效长

**accessToken**用来充当接口请求的令牌，当**accessToken**过期时效的时候，会使用**refreshToken**去请求后端，重新获取一个有效的**accessToken**，然后让接口重新发起请求，从而达到用户无感知 token 刷新的效果

具体分为几步：

*   1、登录时，拿到**accessToken**和**refreshToken**，并存起来
*   2、请求接口时，带着**accessToken**去请求
*   3、如果**accessToken**过期失效了，后端会返回401
*   4、401时，前端会使用**refreshToken**去请求后端再给一个有效的**accessToken**
*   5、重新拿到有效的**accessToken**后，将刚刚的请求重新发起
*   6、重复1/2/3/4/5

![](/images/jueJin/f9fa754673fb488.png)

有人会问：那如果**refreshToken**也过期了呢？

好问题，如果**refreshToken**也过期了，那就真的过期了，就只能乖乖跳转到登录页了~

Nodejs 模拟 token
---------------

为了方便给大家演示，我用 express 模拟了后端的 token 缓存与获取，代码如下图（文末有完整代码）由于这里只是演示作用，所以我设置了

*   **accessToken**：10秒失效
*   **refreshToken**：30秒失效

![](/images/jueJin/62bd931150ee4e0.png)

前端模拟请求
------

先创建一个`constants.ts`来储存一些常量（文末有完整源码)

![](/images/jueJin/3589da271c6e42d.png)

接着我们需要对`axios`进行简单封装，并且模拟：

*   模拟登录之后获取双 token 并存储
*   模拟10s后accessToken失效了
*   模拟30s后refreshToken失效了

![](/images/jueJin/388bc91a253f4a7.png)

理想状态下，用户无感知的话，那么控制台应该会打印

```ts
test-1
test-2
test-3
test-4
```

打印`test-1、test-2`比较好理解

打印`test-3、test-4`是因为虽然`accessToken`失效了，但我用`refreshToken`去重新获取有效的`accessToken`，然后重新发起`3、4`的请求，所以会照常打印`test-3、test-4`

不会打印`test-5、test-6`是因为此时`refreshToken`已经过期了，所以这个时候双token都过期了，任何请求都不会成功了~

但是我们看到现状是，只打印了`test-1、test-2`

![](/images/jueJin/28fc1fcdde974a0.png)

![](/images/jueJin/6e4af374d0f9487.png)

不急，我们接下来就实现**token无感知刷新**这个功能~

实现
--

我的期望是封装一个`class`，这个类提供了以下几个功能：

*   1、能带着`refreshToken`去获取新`accessToken`
*   2、不跟`axios`的`拦截器`耦合
*   3、当获取到新`accessToken`时，可以重新发起刚刚失败了的请求，无缝衔接，达到无感知的效果
*   4、当有多个请求并发时，要做好拦截，不要让多次去获取accessToken

针对这几点我做了以下这些事情：

*   1、类提供一个方法，可以发起请求，带着`refreshToken`去获取新`accessToken`
*   2、提供一个wrapper高阶函数，对每一个请求进行额外处理
*   3/4、维护一个promise，这个promise只有在请求到新`accessToken`时才会fulfilled

并且这个类还需要支持配置化，能传入以下参数：

*   **baseUrl**：基础url
*   **url**：请求新accessToken的url
*   **getRefreshToken**：获取refreshToken的函数
*   **unauthorizedCode**：无权限的状态码，默认 401
*   **onSuccess**：获取新`accessToken`成功后的回调
*   **onError**：获取新`accessToken`失败后的回调

以下是代码（文末有完整源码）

![](/images/jueJin/0e438a7dfbcf441.png)

使用示例如下

![](/images/jueJin/53559b2c88e9445.png)

最后实现了最终效果，打印出了这四个文本

![](/images/jueJin/ae9ace22fd1a4b5.png)

![](/images/jueJin/febdec458687416.png)

完整代码
----

### constants.ts

```ts
// constants.ts

// localStorage 存储的 key
export const LOCAL_ACCESS_KEY = 'access_token';
export const LOCAL_REFRESH_KEY = 'refresh_token';

// 请求的baseUrl
export const BASE_URL = 'http://localhost:8888';
// 路径
export const LOGIN_URL = '/login';
export const TEST_URL = '/test';
export const FETCH_TOKEN_URL = '/token';

```

### retry.ts

```ts
// retry.ts

import { Axios } from 'axios';

    export class AxiosRetry {
    // 维护一个promise
    private fetchNewTokenPromise: Promise<any> | null = null;
    
    // 一些必须的配置
    private baseUrl: string;
    private url: string;
    private getRefreshToken: () => string | null;
    private unauthorizedCode: string | number;
    private onSuccess: (res: any) => any;
    private onError: () => any;
    
        constructor({
        baseUrl,
        url,
        getRefreshToken,
        unauthorizedCode = 401,
        onSuccess,
        onError,
            }: {
            baseUrl: string;
            url: string;
            getRefreshToken: () => string | null;
            unauthorizedCode?: number | string;
            onSuccess: (res: any) => any;
            onError: () => any;
                }) {
                this.baseUrl = baseUrl;
                this.url = url;
                this.getRefreshToken = getRefreshToken;
                this.unauthorizedCode = unauthorizedCode;
                this.onSuccess = onSuccess;
                this.onError = onError;
            }
            
                requestWrapper<T>(request: () => Promise<T>): Promise<T> {
                    return new Promise((resolve, reject) => {
                    // 先把请求函数保存下来
                    const requestFn = request;
                    return request()
                    .then(resolve)
                        .catch(err => {
                            if (err?.status === this.unauthorizedCode && !(err?.config?.url === this.url)) {
                                if (!this.fetchNewTokenPromise) {
                                this.fetchNewTokenPromise = this.fetchNewToken();
                            }
                            this.fetchNewTokenPromise
                                .then(() => {
                                // 获取token成功后，重新执行请求
                                requestFn().then(resolve).catch(reject);
                                })
                                    .finally(() => {
                                    // 置空
                                    this.fetchNewTokenPromise = null;
                                    });
                                        } else {
                                        reject(err);
                                    }
                                    });
                                    });
                                }
                                
                                // 获取token的函数
                                    fetchNewToken() {
                                        return new Axios({
                                        baseURL: this.baseUrl,
                                        })
                                            .get(this.url, {
                                                headers: {
                                                Authorization: this.getRefreshToken(),
                                                },
                                                })
                                                .then(this.onSuccess)
                                                    .catch(() => {
                                                    this.onError();
                                                    return Promise.reject();
                                                    });
                                                }
                                            }
                                            
```

### index.ts

```ts
import { Axios } from 'axios';
    import {
    LOCAL_ACCESS_KEY,
    LOCAL_REFRESH_KEY,
    BASE_URL,
    LOGIN_URL,
    TEST_URL,
    FETCH_TOKEN_URL,
    } from './constants';
    import { AxiosRetry } from './retry';
    
        const axios = new Axios({
        baseURL: 'http://localhost:8888',
        });
        
            axios.interceptors.request.use(config => {
            const url = config.url;
                if (url !== 'login') {
                config.headers.Authorization = localStorage.getItem(LOCAL_ACCESS_KEY);
            }
            return config;
            });
            
                axios.interceptors.response.use(res => {
                    if (res.status !== 200) {
                    return Promise.reject(res);
                }
                return JSON.parse(res.data);
                });
                
                    const axiosRetry = new AxiosRetry({
                    baseUrl: BASE_URL,
                    url: FETCH_TOKEN_URL,
                    unauthorizedCode: 401,
                    getRefreshToken: () => localStorage.getItem(LOCAL_REFRESH_KEY),
                        onSuccess: res => {
                        const accessToken = JSON.parse(res.data).accessToken;
                        localStorage.setItem(LOCAL_ACCESS_KEY, accessToken);
                        },
                            onError: () => {
                            console.log('refreshToken 过期了，乖乖去登录页');
                            },
                            });
                            
                                const get = (url, options?) => {
                                return axiosRetry.requestWrapper(() => axios.get(url, options));
                                };
                                
                                    const post = (url, options?) => {
                                    return axiosRetry.requestWrapper(() => axios.post(url, options));
                                    };
                                    
                                        const login = (): any => {
                                        return post(LOGIN_URL);
                                        };
                                            const test = (): any => {
                                            return get(TEST_URL);
                                            };
                                            
                                            // 模拟页面函数
                                                const doing = async () => {
                                                // 模拟登录
                                                const loginRes = await login();
                                                localStorage.setItem(LOCAL_ACCESS_KEY, loginRes.accessToken);
                                                localStorage.setItem(LOCAL_REFRESH_KEY, loginRes.refreshToken);
                                                
                                                // 模拟10s内请求
                                                test().then(res => console.log(`${res.name}-1`));
                                                test().then(res => console.log(`${res.name}-2`));
                                                
                                                // 模拟10s后请求，accessToken失效
                                                    setTimeout(() => {
                                                    test().then(res => console.log(`${res.name}-3`));
                                                    test().then(res => console.log(`${res.name}-4`));
                                                    }, 10000);
                                                    
                                                    // 模拟30s后请求，refreshToken失效
                                                        setTimeout(() => {
                                                        test().then(res => console.log(`${res.name}-5`));
                                                        test().then(res => console.log(`${res.name}-6`));
                                                        }, 30000);
                                                        };
                                                        
                                                        // 执行函数
                                                        doing();
                                                        
```

结语 & 加学习群 & 摸鱼群
---------------

我是林三心

*   一个待过**小型toG型外包公司、大型外包公司、小公司、潜力型创业公司、大公司**的作死型前端选手；
*   一个偏前端的全干工程师；
*   一个不正经的掘金作者；
*   一个逗比的B站up主；
*   一个不帅的小红书博主；
*   一个喜欢打铁的篮球菜鸟；
*   一个喜欢历史的乏味少年；
*   一个喜欢rap的五音不全弱鸡

如果你想一起学习前端，一起摸鱼，一起研究简历优化，一起研究面试进步，一起交流历史音乐篮球rap，可以来俺的摸鱼学习群哈哈，点这个，有7000多名前端小伙伴在等着一起学习哦 --> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

![image.png](/images/jueJin/6358f127627d422.png)

作者：Sunshine\_Lin  
链接：[juejin.cn/post/728169…](https://juejin.cn/post/7281691679869468727 "https://juejin.cn/post/7281691679869468727")  
来源：稀土掘金  
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。