---
author: "书中枫叶"
title: "推荐前端中后台Vue3+ElementPlus+JavaScript"
date: 2024-08-15
description: "ZHOUYI·ADMIN都是一个非常有价值的项目。因为它弥补了不习惯使用TypeScript开发的同学，使用JavaScript版本就能更快上手熟悉。"
tags: ["前端","JavaScript","Vue.js"]
ShowReadingTime: "阅读1分钟"
weight: 133
---
#### [](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2FZ568_568%2FZHOUYI-ADMIN%23--zhouyiadmin--%25E7%25BA%25AF%25E5%2589%258D%25E7%25AB%25AF-- "https://gitee.com/Z568_568/ZHOUYI-ADMIN#--zhouyiadmin--%E7%BA%AF%E5%89%8D%E7%AB%AF--")" 🔥 ZHOUYI·ADMIN "

**基于 Vue3 + ElementPlus + JavaScript + Pinia +Vite.搭建**

*   在线演示： [template.zhouyi.run](https://link.juejin.cn?target=https%3A%2F%2Ftemplate.zhouyi.run "https://template.zhouyi.run")
*   源码Gitee: [gitee.com/Z568\_568/ZH…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2FZ568_568%2FZHOUYI-ADMIN.git "https://gitee.com/Z568_568/ZHOUYI-ADMIN.git")
*   源码Github: [github.com/ZHYI-source…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FZHYI-source%2FZHOUYI-ADMIN.git "https://github.com/ZHYI-source/ZHOUYI-ADMIN.git")

#### 前言

ZHOUYI·ADMIN 是一个现代化的管理后台模板，提供了一系列功能丰富的组件和工具，帮助开发者快速搭建和开发前后台管理应用。 对快速构建Vue3全栈项目有很大的帮助，解决每次新建项目基础配置的烦恼.

无论你是一个开发者寻找一个可靠的管理后台模板，还是一个学习者想要深入了解现代前端技术， ZHOUYI·ADMIN 都是一个非常有价值的项目。 因为它弥补了不习惯使用TypeScript开发的同学， **使用JavaScript版本就能更快上手熟悉** 。

* * *

### [](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2FZ568_568%2FZHOUYI-ADMIN%23%25E6%2588%25AA%25E5%259B%25BE "https://gitee.com/Z568_568/ZHOUYI-ADMIN#%E6%88%AA%E5%9B%BE")截图

![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/620dae8eee5c4cc9a645fbad0a8676b3~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Lmm5Lit5p6r5Y-2:q75.awebp?rk3s=f64ab15b&x-expires=1728175505&x-signature=b4kg5OIF39KBc%2FoSkQ%2BCvonzXu0%3D) ![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/73ee4032ca764b93b26a3691e5d90349~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Lmm5Lit5p6r5Y-2:q75.awebp?rk3s=f64ab15b&x-expires=1728175505&x-signature=FGyb0s%2FyK5u9C0leY0qSzjBITLo%3D) ![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/e59b45b3ae864480afbff788616fdd8e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Lmm5Lit5p6r5Y-2:q75.awebp?rk3s=f64ab15b&x-expires=1728175505&x-signature=tQ7K3N8UDnLmJwDyikepmZWbg%2B0%3D) ![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/feb3e61ce8944668bd38a38627effc43~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Lmm5Lit5p6r5Y-2:q75.awebp?rk3s=f64ab15b&x-expires=1728175505&x-signature=3ChuurgEqumCQ5PmIFbzfPqDrLg%3D) ![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/29c2511c16374c5d94f8e89c511571f8~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Lmm5Lit5p6r5Y-2:q75.awebp?rk3s=f64ab15b&x-expires=1728175505&x-signature=HBfQWueLSBJ8dReGN17tSf70liA%3D) ![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/1599201d9e91411e8680498e1b28cf6e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Lmm5Lit5p6r5Y-2:q75.awebp?rk3s=f64ab15b&x-expires=1728175505&x-signature=Z3j44eGgyIxAh5P7Lb5%2F0a2%2F4yI%3D) ![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/c86f9c373db74713ba7e35e92505b6fd~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Lmm5Lit5p6r5Y-2:q75.awebp?rk3s=f64ab15b&x-expires=1728175505&x-signature=PJPuqX%2FLKKuzhxG%2FRA%2BhznCgKbo%3D) ![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/b1f4180dd48841e081d0d972d8b77c7a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Lmm5Lit5p6r5Y-2:q75.awebp?rk3s=f64ab15b&x-expires=1728175505&x-signature=0V7ODJAcqhgFSqJUNmCIDEYdxkQ%3D) ![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/cbdd3a5a83fa4c2c9a256ae16b694908~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Lmm5Lit5p6r5Y-2:q75.awebp?rk3s=f64ab15b&x-expires=1728175505&x-signature=JnxKW6NDK0d4BgY%2FtrERvcB%2B1Dw%3D) ![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/acbdd7b0fba54d179c63a2c4d87bb12b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Lmm5Lit5p6r5Y-2:q75.awebp?rk3s=f64ab15b&x-expires=1728175505&x-signature=HEvbWe%2Btt0spsXpzBymsf%2FfEG4I%3D) ![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/5380e4d100944530b819860620496c75~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Lmm5Lit5p6r5Y-2:q75.awebp?rk3s=f64ab15b&x-expires=1728175505&x-signature=QfNTunVZKSYcryL5T6a9vmonPgI%3D) ![](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/dff32778f412447d8f53fc3187471eb5~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Lmm5Lit5p6r5Y-2:q75.awebp?rk3s=f64ab15b&x-expires=1728175505&x-signature=BMpYNSfxN2uv%2FyiwZ6YkWjDLKII%3D)

### [](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2FZ568_568%2FZHOUYI-ADMIN%23%25E5%25BF%25AB%25E9%2580%259F%25E5%25BC%2580%25E5%25A7%258B "https://gitee.com/Z568_568/ZHOUYI-ADMIN#%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B")快速开始

默认你的电脑已经安装好`Nodejs` `Vue3` 以及代码编辑器等环境 我的环境配置可参考：

yaml

 代码解读

复制代码

`Nodejs : v20.11.0`

1.  克隆本仓库到本地
    
    bash
    
     代码解读
    
    复制代码
    
    `git clone https://gitee.com/Z568_568/ZHOUYI-ADMIN.git // 或者 git clone https://github.com/ZHYI-source/ZHOUYI-ADMIN.git`
    
2.  安装依赖
    
     代码解读
    
    复制代码
    
    `npm install`
    
3.  启动
    
    arduino
    
     代码解读
    
    复制代码
    
    `npm run dev`
    
4.  打包生产环境
    
    arduino
    
     代码解读
    
    复制代码
    
    `npm run build`
    

### [](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2FZ568_568%2FZHOUYI-ADMIN%23%25E6%25B7%25BB%25E5%258A%25A0%25E6%2596%25B0%25E9%25A1%25B5%25E9%259D%25A2 "https://gitee.com/Z568_568/ZHOUYI-ADMIN#%E6%B7%BB%E5%8A%A0%E6%96%B0%E9%A1%B5%E9%9D%A2")添加新页面

1.  增加菜单

ruby

 代码解读

复制代码

`/**  * @Description: 路由项说明  * @Author: ZHOU YI  * @Date: 2024-08-15 09:39  *  *  {  *     path: "/components",          // 路由地址  *     name: "components",           // 路由名称  *     meta: {  *         title: "组件示例",          // 路由标题  *         icon: "Basketball",       // 路由图标  *         requiresAuth: true,       // 是否需要登录  *         cache: true,              // 是否缓存  *         isLink: false,            // 是否外链  *         hidden: false,            // 是否隐藏  *         url: 'www.baidu.com',     // 内嵌地址 需要指定在 frame 组件配置  *         perms: [                  // 权限控制  *             "/components"         // 权限标识  *         ],  *     },  *     children: []                  // 子路由  * }  */`

### 设置默认主题

javascript

 代码解读

复制代码

``const initThemeDark = () => {     if (!appThemeDark.value) {         dbUtils.set('appThemeDark', 'dark')         document.documentElement.classList.add("dark");     } else {         dbUtils.set('appThemeDark', 'light')         document.documentElement.classList.remove("dark");     } } const initThemeColor = () => {     let newThemeColor = appThemeColor.value     const rootStyle = document.documentElement.style;     rootStyle.setProperty(`--el-color-primary`, newThemeColor);     rootStyle.setProperty(`--el-color-primary-dark-2`, newThemeColor);     for (let i = 1; i < 10; i++) {         rootStyle.setProperty(             `--el-color-primary-light-${i}`,             `${Color(newThemeColor).alpha(1 - i * 0.1)}`         );     } }``