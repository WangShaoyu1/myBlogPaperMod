---
author: "徐小夕"
title: "Next-Admin，一款基于Nextjs开发的开箱即用的中后台管理系统(全剧终)"
date: 2024-05-28
description: "hello，大家好，我是徐小夕。之前和大家分享了很多可视化，零代码和前端工程化的最佳实践，今天继续分享一下最近开源的 Next-Admin 项目的最新更新。 这次更新是10版本最后一次更新，也根据用"
tags: ["前端","GitHub","React.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:74,comments:21,collects:123,views:3450,"
---
hello，大家好，我是**徐小夕**。之前和大家分享了很多**可视化**，**零代码**和**前端工程化**的最佳实践，今天继续分享一下最近开源的 `Next-Admin` 项目的最新更新。

![](/images/jueJin/0d2ea2c88390451.png)

这次更新是1.0版本最后一次更新，也根据用户反馈的问题做了一些优化，比如：

*   流程编排模块
*   集成在线电子表格
*   支持可视化搭建模块（拖拽，参考线，吸附，多选功能等）
*   支持瀑布流列表
*   AI问答模块
*   支持基础的JWT 登录鉴权

当然还有一些用户提出的需求比如：

*   支持路由鉴权
*   支持更全面的可视化组件搭建
*   支持SSE服务器推送
*   支持大模型接入
*   支持可视化大屏模块

当然这些我都会在2.0版本上实现，大家感兴趣的也可以持续关注。

*   开源地址：`https://github.com/MrXujiang/next-admin`
*   在线demo：`http://next-admin.com`

Next-Admin是什么
-------------

![image.png](/images/jueJin/00e5eb7bbbdd4e9.png)

首先开发 `Next-Admin` 中后台系统完全是因为我本人想学习研究 `nextjs`, 同时为了更深入的在实际业务中使用，我便开始着手做这块的开源，并希望这个项目集成更多行业内优质的解决方案，让想学习`nextjs`或者对可视化搭建感兴趣的朋友有个可以参考的项目。

接下来我会和大家全方位介绍一下 `Next-Admin` 有什么，以及我们能用它做什么。

### 1.一款基于nextjs + antd5.0的中后台管理模板

![c1.gif](/images/jueJin/914ba32eed70420.png)

如果大家想学习或者想用**nextjs**从零搭建一个中后台系统，这个项目将是一个非常不错的选择，我已经从零实现了前端到后端的打通，以及线上部署的全流程，也提供了配套的 `pm2` 运维部署文件，大家可以直接基于它做二次改造。

```js
// pm2 部署文件
const argEnvIndex = process.argv.indexOf('--env')
let argEnv = (argEnvIndex !== -1 && process.argv[argEnvIndex + 1]) || ''

    const RUN_ENV_MAP = {
        local: {
        instances: 2,
        max_memory_restart: '250M'
        },
            dev: {
            instances: 2,
            max_memory_restart: '250M'
            },
                prod: {
                instances: 4,
                max_memory_restart: '1000M'
            }
        }
        
            if (!(argEnv in RUN_ENV_MAP)) {
            argEnv = 'prod'
        }
        
            module.exports = {
                apps: [
                    {
                    name: 'next-admin',
                    script: 'node_modules/next/dist/bin/next',
                    args: 'start -p 80',
                    instances: RUN_ENV_MAP[argEnv].instances,
                    exec_mode: 'cluster',
                    watch: false,
                    max_memory_restart: RUN_ENV_MAP[argEnv].max_memory_restart,
                        env_local: {
                        APP_ENV: 'local'
                        },
                            env_dev: {
                            APP_ENV: 'dev'
                            },
                                env_prod: {
                                APP_ENV: 'prod'
                            }
                        }
                    ]
                }
                
```

同时还内置了登录注册页面， 大家可以直接在此基础上修改：

![image.png](/images/jueJin/e1a63994f206491.png)

### 2\. 开箱即用的国际化方案

![c2.gif](/images/jueJin/15168e84ce784c5.png)

在试过很多基于`nextjs`提供的开源国际化方案之后，我最终选择了`next-intl`. 从代码灵活度和上手成本上，`next-intl` 完全满足大部分国际的需求场景，虽然使用上遇到了一些坑，但是都完美解决，我写在`Next-Admin` 中把完整的国际化配置做好开源了，大家可以拿来就用。

### 3\. 内置可视化流程编排模块

![c3.gif](/images/jueJin/0b8fc528982647a.png)

流程编排在最近很火的零代码，低代码产品中用处比较大，我最近在 **H5-Doroing零代码** 中也考虑用以下它实现业务流程编排。

当然流程编排用的是阿里开源的`butterfly-dag`， 上手成本不高，就是文档有点恼火，感兴趣的朋友可以学习参考一下。

### 4\. 内置在线电子表格

![image.png](/images/jueJin/02f94a5b32e5407.png)

### 5\. 内置开箱即用的可视化搭建模块

![c4.gif](/images/jueJin/95e1f27b40fd4a1.png)

目前我的拖拽实现已经支持了多选组件，参考线，组件吸附，多种对齐方式等，还是非常贴心的~

有需要的朋友可以直接拿来即用。

### 6\. 内置AI问答模块

![image.png](/images/jueJin/35f6626efca7423.png)

目前提供了AI问答模块，大家可以轻松集成自己的AI接口来实现AI问答功能，而无需从零开始写聊天组件。

### 7\. 内置瀑布流列表

![image.png](/images/jueJin/e03c6c2d6b374e9.png)

### 8\. 内置基础的JWT鉴权模块

```js
import { NextResponse } from 'next/server'
import jsonwebtoken from 'jsonwebtoken'
import { encrypt } from '@/utils/auth'
import { cookies } from 'next/headers'


export async function POST(
request: Request,
{ params: { auth } }: { params: { auth: string } }
    ) {
    const { email, pwd } = await request.json();
    
    // 加密后的密文密码，建议前端传输时也进行加密，后端来解密
    const en_pwd = encrypt(pwd);
    
    // 存储用户信息
        let info = {
        email,
        // 其他加密key
        role: 1
    }
    
    const token = jsonwebtoken.sign(
    info,
    process.env.JWT_SECRET || '',
{ expiresIn: '3d' }
);

// 设置token过期时间
const oneDay = 3 * 24 * 60 * 60 * 1000;
// 将token设置到session中，请求中就不需要手动设置token参数
cookies().set('token', token, { httpOnly: true, expires: Date.now() + oneDay })

    if(auth === 'login') {
    return NextResponse.json({data: { email, pwd: en_pwd }, msg: '登录成功'})
}

    if(auth === 'register') {
    return NextResponse.json({data: { email, pwd: en_pwd }, msg: '注册成功'})
}

}
```

这块如果不做全栈，其实无需关注，不过不熟悉JWT的朋友可以参考一下，企业实际上的配置会更复杂一些。

### 9\. 2.0版本后续更多最佳实践的集成

后续会持续迭代2.0版本，大家有好的建议和想法，也欢迎在评论区留言反馈~

Nextjs 15.0发布带来的变化
------------------

最近看到 `nextjs` 团队 发布了 15.0 版本，带来了以下更新：

*   **全新的编译器**：Next.js 15 引入了一个现代的 React 编译器，它能深入理解 React 代码，带来自动记忆化等优化，大多数情况下不再需要手动使用 `useMemo` 和 `useCallback`。它可以节省时间、预防错误、加快速度。
*   **支持 React 19**：Next.js 15 支持 React 19，引入了客户端和服务器端的 Actions，以及更好的水合错误处理。
*   **新的缓存行为**：在 Next.js 15 中，不再自动缓存 `fetch()` 请求、路由处理程序（如 GET、POST 等）和 `<Link>` 客户端导航。如果需要缓存 `fetch()` 请求，可以在 `next.config.js` 中进行配置。
*   **任务分离的新方式**：Next.js 15 引入了 `next/after`，这是一种任务分离的新方式。

如果大家想了解更多关于 Next.js 15.0 版本的信息，可以查阅[Next.js 官方文档](https://link.juejin.cn?target=https%3A%2F%2Fnextjs.org%2Fdocs "https://nextjs.org/docs")。

哎，又要去学一波了。

最后
--

欢迎大家一起共建。

*   开源地址：`https://github.com/MrXujiang/next-admin`
*   在线demo：`http://next-admin.com`

### 往期精彩

*   [独立开发（裸辞）100天，我的阶段性复盘](https://juejin.cn/post/7360493040135651366 "https://juejin.cn/post/7360493040135651366")
*   [文档引擎+AI可视化打造下一代文档编辑器](https://juejin.cn/post/7359461815393845275 "https://juejin.cn/post/7359461815393845275")
*   [爆肝1000小时, Dooring零代码搭建平台3.5正式上线](https://juejin.cn/post/7325132202970447881 "https://juejin.cn/post/7325132202970447881")
*   [从零打造一款基于Nextjs+antd5.0的中后台管理系统](https://juejin.cn/post/7351321257755672602 "https://juejin.cn/post/7351321257755672602")