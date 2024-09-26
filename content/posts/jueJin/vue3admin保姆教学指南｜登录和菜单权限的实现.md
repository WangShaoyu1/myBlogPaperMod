---
author: "白哥学前端"
title: "vue3admin保姆教学指南｜登录和菜单权限的实现"
date: 2023-03-27
description: "做后台项目区别于做其它的项目，权限验证与安全性是非常重要的，可以说是一个后台项目一开始就必须考虑和搭建的基础核心功能。我们所要做到的是：不同的权限对应着不同的路由，同时侧边栏也需根据不同的权限，异步生"
tags: ["前端","Vue.js"]
ShowReadingTime: "阅读13分钟"
weight: 116
---
做后台项目区别于做其它的项目，权限验证与安全性是非常重要的，可以说是一个后台项目一开始就必须考虑和搭建的基础核心功能。我们所要做到的是：不同的权限对应着不同的路由，同时侧边栏也需根据不同的权限，异步生成。这里先简单说一下，我实现登录和权限验证的思路。

*   登录：当用户填写完账号和密码后向服务端验证是否正确，验证通过之后，服务端会返回一个**token**，拿到token之后（我会将这个token存贮到localStorage中，保证刷新页面后能记住用户登录状态），前端会根据token再去拉取一个 **userInfo** 的接口来获取用户的详细信息（如用户权限，用户名等等信息）。
*   权限验证：通过token获取用户对应的菜单权限列表和按钮去权限列表，动态算出其对应的权限路由，通过 `router.addRoute`动态挂载这些路由。

上面所有操作的数据我们都需要依赖pinia。下面我们一步步来实现一下。先从登陆入手。

登陆篇
---

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee994b1a903642d8af87101a756ca2d1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 登陆流程分析

首先，我们梳理一下流程。输入用户名和密码，校验，然后请求登陆接口，获取到token，再用token去请求用户详细信息。做菜单权限校验，拼接好路由，成功跳钻到首页，这里如果有`redirectUrl`，就跳转到`redirectUrl`。获取到的token和用户信息我们需要使用strore持久化的能力缓存到localStorage中去。

下面我们开始实现一下整个流程。

### 定义userStore

首先我们把需要保存的数据提前定义好，这里我们需要把token和userInfo信息报错在localStorage中，获取用户信息和退出登陆的接口我们也在这里统一声明了。

typescript

 代码解读

复制代码

`import { defineStore } from 'pinia' import { getUserInfo, logout } from '@/api' import type { UserState } from './model/userModel' import type { UserInfo } from '@/api/user/types' import { useAuthStore } from './auth' import { RESEETSTORE } from '@/utils/reset' export const useUserStore = defineStore({   id: 'app-user',   state: (): UserState => ({     token: '',     userInfo: null,   }),   actions: {     // setToken     setToken(token: string) {       this.token = token     },     // setUserInfo     setUserInfo(userInfo: UserInfo) {       this.userInfo = userInfo     },     async GetInfoAction() {       const { data } = await getUserInfo()       const { avatar, buttons, name, roles, routes } = data       const authStore = useAuthStore()       // 存储用户信息       this.setUserInfo({ avatar, name })       // 存储用户权限信息       authStore.setAuth({ buttons, roles, routes })     },     async Logout() {       await logout()       RESEETSTORE()     },   },   // 设置为true，缓存state   persist: true, })`

注意persist字段设置为true。

### 登录功能实现

由于我们前面在集成路由的时候已经把登陆页面的路由添加进去了，所以就直接在页面写好样式即可。简单粗暴一点就是一个空白页面撸上两个input的框，一个是登录账号，一个是登录密码。再放置一个登录按钮。我们将登录按钮上绑上click事件，点击登录之后向服务端提交账号和密码进行验证。 这就是一个最简单的登录页面。逻辑如下：

typescript

 代码解读

复制代码

``const submitForm = (formEl: FormInstance | undefined) => {   if (!formEl) return   formEl.validate(async (valid) => {     if (!valid) return     try {       loading.value = true       const { data } = await login(ruleForm)       userStore.setToken(data)       router.replace((route.query.redirect as string) || HOME_URL)       ElNotification({         title: `hi,${timeFix()}!`,         message: `欢迎回来`,         type: 'success',       })     } finally {       loading.value = false     }   }) }``

这里也很简单，表单对用户名和密码做校验，校验通过，然后去请求login接口。请求成功，保存token。跳转到路由。如果`redirect`存在，就跳转到`redirect`，否则跳转到`首页`。

### 获取用户信息

用户登录成功之后，会在全局钩子`router.beforeEach`中拦截路由，判断是否已获得token，在获得token之后我们就要去获取用户的基本信息了。我们在`src/routes/initDynamicRouter.ts`文件中写下吗的逻辑：

scss

 代码解读

复制代码

`router.beforeEach(async (to, from, next) => {   NProgress.start()   const userStore = useUserStore()   // 1.判断是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由并放行到登陆页   if (to.path === LOGIN_URL) {     if (userStore.token) return next(from.fullPath)     return next()   }   // 2.判断访问页面是否在路由白名单(不需要登陆)地址中，如果存在直接放行   if (ROUTER_WHITE_LIST.includes(to.path)) return next()   // 3.判断是否有 Token，没有token跳转到登陆页面并且携带原目标路径   if (!userStore.token) {     return next({ path: LOGIN_URL, query: { redirect: to.fullPath } })   }      const authStore = useAuthStore()   authStore.setRouteName(to.name as string)   // 4.如果没有菜单列表，就重新请求菜单列表并添加动态路由   if (!authStore.authRouterList.length) {     await initDynamicRouter()     return next({ ...to, replace: true })   }   // 5.上述条件都不满足，直接放行   return next() })`

这里做了这么几步判断：

1.判断是访问登陆页，如果有Token 就在回到当前上次访问的页面，没有 Token 放行到登陆页

2.判断访问页面是否在路由白名单(不需要登陆)地址中，如果存在直接放行

3.判断没有token跳转到登陆页面并且携带原目标路径

4.store中如果没有菜单列表，就重新请求菜单列表并添加动态路由，由于菜单列表的store没有做持久化，所以每次刷新页面的时候，这里的判断条件都会满足，然后执行里面的逻辑。

5.上述条件都不满足，直接放行。

注意`router.beforeEach`执行的时机，一定要在`createRouter()`之后执行，才能执行这个钩子函数。

`initDynamicRouter.ts`的引入需要放在`main.ts`中，如下：

javascript

 代码解读

复制代码

`import { createApp } from 'vue' import App from './App.vue' import router from './router' /** 加载异步路由 */ import '@/router/initDynamicRouter' app.use(router) app.mount('#app')`

在第4步中，如果没有获取到路由信息，我们需要执行`initDynamicRouter()`这个函数。这个函数中我们做个如下的处理：

scss

 代码解读

复制代码

`const initDynamicRouter = async () => {   const authStore = useAuthStore()   const userStore = useUserStore()   try {     // 1.请求用户信息，携带路由权限信息     await userStore.GetInfoAction()     // 判断当前用户有没有菜单权限     if (!authStore.authRouterList.length) {       ElNotification({         title: '无权限访问',         message: '当前账号无任何菜单权限，请联系系统管理员！',         type: 'warning',         duration: 3000,       })       RESEETSTORE()       router.replace(LOGIN_URL)       return Promise.reject('No permission')     }          ...   } catch (error) {     // 当按钮 || 菜单请求出错时，重定向到登陆页     RESEETSTORE()     router.replace(LOGIN_URL)     return Promise.reject(error)   } }`

在这里，我们请求了用户信息接口`GetInfoAction()`,在`GetInfoAction`中，我们把获取到的用户信息和菜单，按钮信息都放在了store中，如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1fa29c5846f54673a7f35a8a6d7bd34a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5e4785487a24bea9f7d8829bc612dd7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

然后再加一步保险层，判断当前用户权限列表是否为空，为空则表示没有任何权限，直接回到登陆页面。到了这一步，我们登陆和用户信息都已经处理完毕了。下面我们来看看后面对于路由权限是如何处理的。

权限篇
---

权限控制的主体思路，前端会有一份路由表，它表示了每一个路由可访问的权限。当用户登录之后，通过 **token** 获取用户的 role \*\*\*\*，动态根据用户的 role 算出其对应有权限的路由，再通过`router.addRoute`动态挂载路由。对于不同权限的用户显示不同的侧边栏和限制其所能进入的页面。

### 具体实现

1.  创建vue实例的时候将vue-router挂载，但这个时候vue-router挂载一些登录或者不用权限的公用的页面。
2.  当用户登录后，获取用role，将role和路由表每个页面的需要的权限作比较，生成最终用户可访问的路由表。
3.  调用router.addRoute(route)添加用户可访问的路由。
4.  使用pinia管理路由表，根据pinia中可访问的路由渲染侧边栏组件。

### 用户权限数据

我们先来看一下，后端返回的用户信息中包含的用户权限数据，具体格式长下面这个样式：

json

 代码解读

复制代码

`{     "code":200,     "message":"成功",     "data":{         "routes":[             "User",             "ActivityEdit",             "Category",             "CouponRule",             "Label",             "Product",             "Activity",             "Trademark",             "Attr",             "ActivityAdd",             "Notification",             "Marketing",             "CouponEdit",             "OrderShow",             "Permission",             "Spu",             "UserList",             "ClientUser",             "Order",             "Coupon",             "Banner",             "Setting",             "Acl",             "Seckill",             "Role",             "RoleAuth",             "Refund",             "Level",             "OrderList",             "Sku"         ],         "buttons":[             "btn.User.add",             "btn.User.remove",             "btn.User.update",             "btn.User.assgin",             "btn.Role.assgin",             "btn.Role.add",             "btn.Role.update",             "btn.Role.remove",             "btn.Permission.add",             "btn.Permission.update",             "btn.Permission.remove",         ],         "roles":[             ""         ],         "name":"admin",         "avatar":"https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"     },     "ok":true }`

我们需要提前声明好前端路由表，我们这里的路由分了两部分，静态路由和动态路由。

*   `routes`表示用户拥有的路由权限
*   `buttons`表示用户拥有的按钮权限

根据这两个字段，我们就可以控制一个用户的权限了。

### 前端权限处理

在`src/router`下，有两份路由表，`constantRoutes.ts`和`dynamicRoutes.ts`，分别表示静态路由和异步路由。

静态路由的定义是下面这样的：

javascript

 代码解读

复制代码

`// constantRoutes.ts import { RouteRecordRaw } from 'vue-router' import { HOME_URL, LOGIN_URL } from '@/config/config' const LAYOUT = () => import('@/layouts/index.vue') /**  * @description 静态路由  */ export const staticRoutes: RouteRecordRaw[] = [   {     path: LOGIN_URL,     name: 'login',     meta: {       isHide: true,     },     component: () => import('@/views/login/index.vue'),   },   {     path: '/404',     name: '404',     meta: {       isHide: true,     },     component: () => import('@/views/error/error-404.vue'),   },   {     path: '/',     name: 'LAYOUT',     component: LAYOUT,     redirect: HOME_URL,     meta: {       title: '首页',       icon: 'HomeFilled',     },     children: [       {         path: '/index',         name: 'Index',         component: () => import('@/views/home/index.vue'),         meta: {           title: '首页',           icon: 'HomeFilled',           affix: true,         },       },     ],   },   {     path: '/data-screen',     name: 'DataScreen',     component: () => import('@/views/data-screen/index.vue'),     meta: {       icon: 'DataLine',       title: '数据大屏',     },   },   // 此路由防止控制台出现No match found for location with path的警告   {     path: '/:catchAll(.*)',     meta: {       isHide: true,     },     component: () => import('@/views/error/error-404.vue'), //这个是我自己的路径   }, ] /**  * @description 路由未找到  */ export const notFoundRouter = {   path: '/:pathMatch(.*)*',   name: 'notFound',   redirect: '404', }`

这里面我们把不需要权限的路由都声明了在这里。这里要注意的是`notFoundRouter`在`vue-router4`当中需要跟上面的方式一样写，不然后出现警告（不知道为什么）。

静态路由需要在`createRouter`的时候就使用：

javascript

 代码解读

复制代码

`import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router' import { staticRoutes } from './constantRoutes' const router = createRouter({   history: createWebHashHistory(),   routes: staticRoutes as RouteRecordRaw[],   // 刷新时，滚动条位置还原   scrollBehavior: () => ({ left: 0, top: 0 }), }) export default router`

接下来就是异步路由的定义，这里面声明了所有需要权限的路由（当然如果你的路由太多的时候，你可以拆分成很多文件）：

javascript

 代码解读

复制代码

`import { RouteRecordRaw } from 'vue-router' const LAYOUT = () => import('@/layouts/index.vue') export const dynamicRoutes: RouteRecordRaw[] = [   // 权限管理   {     name: 'Acl',     path: '/acl',     component: LAYOUT,     redirect: '/acl/user',     meta: {       title: '权限管理',       icon: 'Lock',     },     children: [       {         name: 'User',         path: '/acl/user',         component: () => import('@/views/acl/user/index.vue'),         meta: {           title: '用户管理',           icon: 'UserFilled',         },       },       {         name: 'Role',         path: '/acl/role',         component: () => import('@/views/acl/role/index.vue'),         meta: {           title: '角色管理',           icon: 'Avatar',         },       },       {         name: 'Permission',         path: '/acl/permission',         component: () => import('@/views/acl/permission/index.vue'),         meta: {           title: '菜单管理',           icon: 'Menu',         },       },     ],   }, ]`

现在我们前后端的路由表都有了，就可以拿来做匹配了。

在`initDynamicRouter.ts`中，我们在路由钩子`beforeEach`中对路由进行了拦截，每次路由触发，都会执行这个钩子，然后我们对路由做处理。

在登陆逻辑处理的时候我们已经讲过了各种跳转逻辑判断。我们再回头看看代码：

vbnet

 代码解读

复制代码

`router.beforeEach(async (to, from, next) => {   ...   // 4.如果没有菜单列表，就重新请求菜单列表并添加动态路由   const authStore = useAuthStore()   authStore.setRouteName(to.name as string)   if (!authStore.authRouterList.length) {     await initDynamicRouter()     return next({ ...to, replace: true })   }   // 5.上述条件都不满足，直接放行   return next() })`

这里为什么要根据`authRouterList`判断呢？

这是因为，`authRouterList`是存储在pinia中，没有持久化，当刷新页面的时候，它是空列表，就能执行后面的逻辑。这样的话，就能做到，每次页面刷新，都能从新请求`userInfo`接口。当用户的权限发生了改变，就能立马重置用户的权限了。

在`initDynamicRouter()`这个函数中，我们先从后端获取了用户信息和路由信息，然后对路由进行过滤：

scss

 代码解读

复制代码

`const initDynamicRouter = async () => {   const authStore = useAuthStore()   const userStore = useUserStore()   try {     // 1.请求用户信息，携带路由权限信息     await userStore.GetInfoAction()     // 判断当前用户有没有菜单权限     if (!authStore.authRouterList.length) {       ElNotification({         title: '无权限访问',         message: '当前账号无任何菜单权限，请联系系统管理员！',         type: 'warning',         duration: 3000,       })       RESEETSTORE()       router.replace(LOGIN_URL)       return Promise.reject('No permission')     }     // 2.过滤路由     const routerList = filterAsyncRoutes(       dynamicRoutes,       authStore.authRouterList,     )     // 3.添加动态路由     routerList.forEach((route) => {       router.addRoute(route as unknown as RouteRecordRaw)     })     // 4.添加notFound路由     router.addRoute(notFoundRouter)     // 5.处理subMenu数据,静态路由和动态路由拼接，过滤isHide=true的路由     const menuList = getMenuList([       ...staticRoutes,       ...routerList,     ] as unknown as Menu.MenuOptions[])     authStore.setAuthMenuList(menuList)   } catch (error) {     // 当按钮 || 菜单请求出错时，重定向到登陆页     RESEETSTORE()     router.replace(LOGIN_URL)     return Promise.reject(error)   } }`

这里拿到后端路由数据以后，使用`filterAsyncRoutes`对路由做了匹配，注意匹配的时候我们是根据`meta.name`来匹配的，最终拿到了完整的`routerList`，然后通过循环和`router.addRoute`，把路由挨个添加到路由表中。别忘了`notFoundRouter`路由，需要在最后添加。接下来就是根据`meta.isHide`字段提前处理好侧边栏渲染数据，存到pinia中。

下面路由过滤函数，采用了一个递归：

typescript

 代码解读

复制代码

`function filterAsyncRoutes(   dynamicRoutes: RouteRecordRaw[],   authRouterList: string[], ) {   return dynamicRoutes.filter((route) => {     // 1.如果route的name在routeNames中没有, 直接过滤掉     if (!authRouterList.includes(route.name as string)) return false     // 2.如果当前route还有子路由(也就是有children), 需要对子路由也进行权限过滤     if (route.children && route.children.length > 0) {       route.children = filterAsyncRoutes(route.children, authRouterList)     }     return true   }) }`

menu过滤：

javascript

 代码解读

复制代码

`function getMenuList(menuList: Menu.MenuOptions[]) {   const newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList))   return newMenuList.filter((item) => {     item.children?.length && (item.children = getMenuList(item.children))     return !item.meta?.isHide   }) }`

经过上面一顿操作，我们已经拿到了完整的路由列表和menu列表。

### 按钮权限

接下来我们使用三种方式来实现按钮的权限。

#### 指令实现

在`src/directives`中创建`index.ts`文件,我们所有的指令都会从这里导出：

javascript

 代码解读

复制代码

`import { App } from 'vue' import auth from './modules/auth' const directivesList: any = {   // Custom directives   auth, } const directives = {   install: function (app: App<Element>) {     Object.keys(directivesList).forEach((key) => {       // 注册所有自定义指令       app.directive(key, directivesList[key])     })   }, } export default directives`

在`directives/modules`新建`auth.ts`来写权限指令的逻辑：

typescript

 代码解读

复制代码

`import { useAuthStore } from '@/store/modules/auth' import type { Directive, DirectiveBinding } from 'vue' const auth: Directive = {   mounted(el: HTMLElement, binding: DirectiveBinding) {     const { value } = binding     const authStore = useAuthStore()     const currentPageRoles = authStore.authButtonList ?? []     if (value instanceof Array && value.length) {       const hasPermission = value.every((item) =>         currentPageRoles.includes(item),       )       if (!hasPermission) el.remove()     } else {       if (!currentPageRoles.includes(value)) el.remove()     }   }, } export default auth`

这里的逻辑也很简单，从`pinia`中拿到按钮权限列表`authButtonList`。这里会有两种方式，有可能一个按钮有一种权限，有可能是多权限，单权限直接根据`includes`，多权限通过循环判断，如果有权限就行渲染，无权限就直接`remove`这个元素。

最后我们需要`main.ts`中统一注册指令：

javascript

 代码解读

复制代码

`import { createApp } from 'vue' import App from './App.vue' import directives from '@/directives/index' app.use(directives) app.mount('#app')`

这样我们就可以通过`v-auth`的方式来使用这个指令了。使用方式如下：

ini

 代码解读

复制代码

`<el-button   type="primary"   icon="Plus"   v-auth="['btn.User.add']"   @click="openDrawer('新增')" >   添加 </el-button> <el-button   type="danger"   icon="Delete"   plain   v-auth="['btn.User.remove', 'btn.User.BatchRemove']"   @click="batchDelete(scope.selectedListIds)"   :disabled="!scope.isSelected" >   批量删除 </el-button>`

#### hooks实现

在`src/hooks`下面新建`useAuthButtons.ts`文件：

typescript

 代码解读

复制代码

`import { computed } from 'vue' import { useAuthStore } from '@/store/modules/auth' /**  * @description 页面按钮权限  * */ export const useAuthButtons = () => {   const authStore = useAuthStore()   const authButtons = authStore.authButtonList || []   // 当前页按钮权限列表   const BUTTONS = computed(() => {     const currentPageAuthButton: { [key: string]: boolean } = {}     authButtons.forEach((item) => (currentPageAuthButton[item] = true))     return currentPageAuthButton   })   return {     BUTTONS,   } }`

使用方式：

xml

 代码解读

复制代码

`<template>   <el-button     type="primary"     link     v-if="BUTTONS['btn.Permission.update']"     icon="Edit"     :disabled="scope.row.level === 1"     @click="openDialog(2, scope.row)"   >     编辑   </el-button> </template> <script setup lang="ts"> import { ref } from 'vue' import { useAuthButtons } from '@/hooks/useAuthButtons' const { BUTTONS } = useAuthButtons() </script>`

#### 组件实现

在`src/components`下面新建`Auth`文件夹，这里写的组件是直接全局注册的：

typescript

 代码解读

复制代码

`import { defineComponent, Fragment } from 'vue' import { useAuthStore } from '@/store/modules/auth' export default defineComponent({   name: 'Auth',   props: {     value: {       type: Array,       default: () => {         return []       },     },   },   setup(props, { slots }) {     const authStore = useAuthStore()     const currentPageRoles = authStore.authButtonList ?? []     const hasPermission = props.value.every(       (item) => item && currentPageRoles.includes(item as string),     )     return () => {       if (!slots) return null       return hasPermission ? <Fragment>{slots.default?.()}</Fragment> : null     }   }, })`

使用方式：

ini

 代码解读

复制代码

`<Auth :value="['btn.Role.update']">   <el-button     type="primary"     link     icon="Edit"     @click="openDialog('编辑', scope.row)"   >     编辑   </el-button> </Auth>`

到此为止，我们的路由权限和按钮权限逻辑已经处理完毕了。

只有可能有人有疑问，这个路由权限数据和菜单权限数据是在哪里配置的呢？

这个其实也是我们业务中的一部分功能，在菜单中会有个权限管理的模块，专门来配置，具体就长下面这个样子：

1.菜单管理

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16522e478212444f84861b18fe77a4b4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

2.角色管理

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/051de606e9464377b141d8aaba1e4a5d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

3.用户管理

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b6cb0368c194275af4bd283656bbbf9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

简单梳理一下逻辑：菜单管理就是添加路由和权限相关的信息，添加完路由以后，在角色管理中给不同的角色分派不同的菜单，截图如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25d15f48d78f4e2db351a57b7501d075~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

然后给用户分派不同的角色，这样就做到了不同的用户有不同的权限了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55153fa61b54416b9806f336da26daba~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

下一节将会带大家来实现页面的整体布局如何实现，也就是我们熟悉的Layout布局。

代码仓库
----

[gitee.com/guigu-fe/gu…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fguigu-fe%2Fguigu-sph-mall-admin "https://gitee.com/guigu-fe/guigu-sph-mall-admin")

文章教程系列
------

*   [vue3 admin 保姆教学指南 ｜ 项目规范集成教程，看完秒懂项目中各种奇怪的文件和配置](https://juejin.cn/post/7195080019394166842 "https://juejin.cn/post/7195080019394166842")
*   [vue3 admin 保姆教学指南 ｜ 一文让你彻底上手 vue3 全家桶，集成 pinia+element-plus+vue-router@4](https://juejin.cn/post/7196852501190082616 "https://juejin.cn/post/7196852501190082616")
*   [vue3 admin 保姆教学指南｜关于使用 typescript 二次封装 Axios 的特别说明](https://juejin.cn/post/7214146630467305530 "https://juejin.cn/post/7214146630467305530")
*   [vue3 admin 保姆教学指南｜关于 pinia 的使用](https://juejin.cn/post/7214342319348138041 "https://juejin.cn/post/7214342319348138041")
*   [vue3 admin 保姆教学指南｜后台管理系统的 Layout 实现](https://juejin.cn/post/7215125397347680314 "https://juejin.cn/post/7215125397347680314")
*   [vue3 admin 保姆教学指南｜ element-plus 如何实现主题切换和暗黑模式](https://juejin.cn/post/7215485221830852665 "https://juejin.cn/post/7215485221830852665")
*   [vue3 admin 开发中的奇淫巧技｜在 vue 中如何刷新当前页面](https://juejin.cn/post/7216130963276644407 "https://juejin.cn/post/7216130963276644407")