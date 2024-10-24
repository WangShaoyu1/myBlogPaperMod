---
author: "MacroZheng"
title: "手把手教你搞定权限管理，结合Vue实现菜单的动态权限控制！"
date: 2020-02-28
description: "权限管理在后端项目中主要体现在对接口访问权限的控制，在前端项目中主要体现在对菜单访问权限的控制。在《手把手教你搞定权限管理，结合Spring Security实现接口的动态权限控制！》中我们实现了对后端接口的动态权限控制，今天我们讲下如何结合Vue来实现菜单的动态权限控制。 V…"
tags: ["Vue.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:106,comments:16,collects:249,views:13984,"
---
> SpringBoot实战电商项目mall（30k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

摘要
--

权限管理在后端项目中主要体现在对接口访问权限的控制，在前端项目中主要体现在对菜单访问权限的控制。在[《手把手教你搞定权限管理，结合Spring Security实现接口的动态权限控制！》](https://juejin.cn/post/6844904072479244301 "https://juejin.cn/post/6844904072479244301")中我们实现了对后端接口的动态权限控制，今天我们讲下如何结合Vue来实现菜单的动态权限控制。

使用技术
----

> `mall-admin-web`实现菜单的动态权限控制使用到了两种技术，一种是Vue Router，另一种是Vuex，我们先来了解下这两种技术。

### Vue Router

Vue Router是Vue.js官方的路由管理器。路由就是一个路径，当我们访问指定路径时就会跳转到指定页面。 我们项目的路由都是在`src/router/index.js`文件中定义的，举个例子，比如我们的商品列表页面路由定义如下。

![](/images/jueJin/17086e5b766bdc7.png)

所以当我们访问[http://localhost:8090/#/pms/product](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8090%2F%23%2Fpms%2Fproduct "http://localhost:8090/#/pms/product")时就会跳转到商品列表页面。

![](/images/jueJin/17086e5b7671373.png)

我们前端的左侧菜单都是根据Vue Router中定义的路由表生成的，要实现动态菜单显示，其实只要实现动态路由即可。

### Vuex

Vuex是一个专为Vue.js应用程序开发的状态管理模式，它采用集中式存储管理应用的所有组件的状态。Vuex可以简单理解为一个全局的状态管理器，我们可以把一些全局的状态存储在里面。当我们在多个组件中显示这些状态时，只要在任意一个组件中改变这个状态，基于Vue的响应式渲染，其余组件中的这个状态均会改变。

Vuex中有几个核心概念需要了解下：

*   Store：相当于一个容器，它包含着应用中大部分的状态；
*   State：Store中存储的状态，由于使用了单一状态树，即Vuex中存储的状态只存在一份，当这个状态发生改变时，和它绑定的组件中的这个状态均会发生改变；
*   Getter：从State中派生出的一些状态，可以认为是State的计算属性；
*   Mutation：状态的变化，更改Vuex中的State的唯一方法是提交Mutation；
*   Action：用于提交Mutation的动作，从而更改Vuex中的State；
*   Module：Store中的模块，由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。为了解决以上问题，Vuex允许我们将Store分割成模块。

Vuex中的核心流程如下：

![](/images/jueJin/17086e5b781a7cd.png)

菜单的动态权限控制
---------

> 接下来我们来讲下如何结合Vue Router和Vuex来实现菜单的动态权限控制。

首先我们需要修改`src/router/index.js`中的路由表，将路由表进行拆分，拆分成必须要显示的静态路由表和可以动态显示的动态路由表。

![](/images/jueJin/17086e5b7a381fd.png)

然后我们需要添加`src/store/modules/permission.js`文件，在Vuex的Store中添加权限相关状态，比如和左侧菜单绑定的路由表。

![](/images/jueJin/17086e5b7a4cd18.png)

这里有个比较核心的GenerateRoutes方法，用于生成当前用户可以访问的路由。我们的data参数中包含了用户可以访问的菜单信息。它的具体执行流程如下：从菜单信息中筛选出可以访问的动态路由，然后进行排序，最后提交状态改变到Vuex中去改变routers这个状态。

![](/images/jueJin/17086e5b7c0ba13.png)

关于前端路由和后台菜单的匹配，其实是根据路由名称和菜单的前端名称来确定的，比如商品列表中的路由名称和`ums_menu`表中存储的前端名称如下。

![](/images/jueJin/17086e5ba95871c.png)

![](/images/jueJin/17086e5c26d6668.png)

接下来我们需要修改`src/store/index.js`文件，在Vuex的Store中添加这个权限模块的状态。

![](/images/jueJin/17086e5c60a4fc6.png)

再修改`src/store/getters.js`文件，给权限模块中的两个状态取个别名方便访问。

![](/images/jueJin/17086e5c36c974e.png)

我们还需要修改`src/views/layout/components/Sidebar/index.vue`文件，将左侧菜单组件和Vuex中存储的路由状态进行绑定，这样当我们修改了Vuex中的状态后，菜单就会改变了。`mapGetters`是个辅助函数，可以将Store中的Getter属性映射到局部计算属性。

![](/images/jueJin/17086e5c62b0bf5.png)

最后我们需要在用户登录成功后，通过`store.dispatch('GenerateRoutes', { menus,username })`来修改Vuex中存储的路由状态并传入用户可以访问的菜单信息。

![](/images/jueJin/17086e5c666d0f6.png)

权限管理功能演示
--------

具体参考：[大家心心念念的权限管理功能，这次安排上了！](https://juejin.cn/post/6844904067525771272 "https://juejin.cn/post/6844904067525771272")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-admin-web "https://github.com/macrozheng/mall-admin-web")

公众号
---

[mall项目](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")全套学习教程连载中，**关注公众号**第一时间获取。

![公众号图片](/images/jueJin/1707c6e7c492dde.png)