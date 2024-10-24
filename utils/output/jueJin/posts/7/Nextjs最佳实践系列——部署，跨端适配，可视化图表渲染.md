---
author: "徐小夕"
title: "Nextjs最佳实践系列——部署，跨端适配，可视化图表渲染"
date: 2024-04-01
description: "最近开源了一款基于 Nextjs + Antd50 的管理后台系统，打算持续迭代到开发者能傻瓜式开发和部署管理后台的程度， 下面和大家分享一下最近的一些更新。 添加pm2持久化部署配置 优化打包后图"
tags: ["前端","GitHub","React.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:15,comments:0,collects:30,views:1293,"
---
最近开源了一款基于 `Nextjs + Antd5.0` 的管理后台系统，打算持续迭代到**开发者能傻瓜式开发和部署管理后台**的程度， 下面和大家分享一下最近的一些更新。

*   添加pm2持久化部署配置
*   优化打包后图表渲染白屏问题
*   支持PC端和移动端适配
*   添加白板制作页面

接下来会和大家分享一下具体的实现， 如果大家想了解 `next-admin` 这款开源管理系统， 可以参考下面的文章：

*   [从零打造一款基于Nextjs+antd5.0的中后台管理系统](https://juejin.cn/post/7351321257755672602 "https://juejin.cn/post/7351321257755672602")

同时也欢迎对 `Nextjs` 感兴趣的小伙伴一起共建。

github地址：`https://github.com/MrXujiang/next-admin`

在线地址：`http://next-admin.com`

Nextjs部署神器PM2
-------------

![image.png](/images/jueJin/f2dd793721564b0.png)

为什么会选择PM2来部署呢？ 这里给大家总结几个优势：

1.  **负载均衡**：pm2使用Node.js的cluster模块，可以在服务器上的所有CPU核心上运行多个应用实例，实现负载均衡。
2.  **后台运行**：与直接在前台运行Node.js应用程序相比，pm2可以将应用程序在后台运行，更加稳定。
3.  **异常自动重启（持久化）**：pm2可以在应用程序停止之后立即重启，减少了停机时间。pm2可以监测应用程序的运行状态，当进程发生异常（如无限循环）时，可以停止并重启不稳定的进程。
4.  **控制台应用监控**：pm2提供了控制台界面，可以方便地查看应用程序的状态、日志和性能指标等信息。

所以说如果对于 `nginx` 高级玩法不太熟悉， 建议直接用 `pm2`.

下面给大家介绍一下 `Next-Admin` 的 `pm2` 配置：

```js
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

配置基本上可以满足大部分node应用的部署需求，大家可以参考一下。 接下来我们只需要在服务器上运行脚本即可启动：

```json
"deploy:local": "pnpm build:local && pm2 start pm2.config.js --env local",
"deploy:dev": "pnpm build:dev && pm2 start pm2.config.js --env dev",
"deploy:prod": "pm2 start pm2.config.js --env prod"
```

启动后的效果：

![](/images/jueJin/96ad922474d144e.png)

优化打包后图表渲染白屏问题
-------------

由于新版react在开发环境下会渲染两次，这会导致某些库创建两个实例， 导致开发环境出现渲染问题， 比如我明明渲染一张图表，结果在开发浏览器却渲染了两张。为了避免开发环境react组件渲染两次的问题， 我写了一个缓存函数，来解决：

```jsx
    const MyChart = (props: IChart) => {
    const chartRef = useRef<any>(null);
    const { type, data, id } =props;
        useEffect(() => {
        let chart:any;
        // 避免在开发环境渲染两次
            if(isDev) {
            let curCache = localStorage.getItem(id);
                if(!curCache) {
                localStorage.setItem(id, '1');
                chart = createChart(chartRef.current, type, data);
            }
                }else {
                chart = createChart(chartRef.current, type, data);
            }
                return () => {
                localStorage.removeItem(id);
                chart && chart.destroy();
            }
            }, [type, data, id]);
            return <div ref={chartRef}></div>
        }
```

这样生产环境和开发环境就可以优雅的渲染图表了：

![](/images/jueJin/74df92f5c4d9445.png)

支持PC端和移动端适配
-----------

由于目前大部分管理后台都是针对PC端的， 移动访问体验不好， 所以我在 `Next-Admin` 管理系统中做了适配， 保证在PC和移动端都能有不错的适配效果。 接下来分享几张移动端访问 `Next-Admin` 的页面：

![](/images/jueJin/83503406f0214c5.png)

![](/images/jueJin/31dbd93ad47f44f.png)

![](/images/jueJin/cdbfd0e370734eb.png)

![](/images/jueJin/c867ff2c75d54e0.png)

![](/images/jueJin/f69f93e61c404ff.png)

![](/images/jueJin/1eb775619495492.png)

内置在线白板
------

之前写了一个自定义的白板应用，目前也内置进去了，大家可以参考一下：

![](/images/jueJin/07df423a66cc4b4.png)

后期规划
----

后面会对国际化支持，搭建引擎，页面渲染引擎做一些内置页面，帮助大家更高效的开发管理系统， 同时我也会在公众号分享一些技术实现， 欢迎大家交流反馈。

更多推荐
----

[可视化表单&试卷搭建平台技术详解](https://juejin.cn/user/3808363978429613/posts "https://juejin.cn/user/3808363978429613/posts")

[爆肝1000小时, Dooring零代码搭建平台3.5正式上线](https://juejin.cn/user/3808363978429613/posts "https://juejin.cn/user/3808363978429613/posts")