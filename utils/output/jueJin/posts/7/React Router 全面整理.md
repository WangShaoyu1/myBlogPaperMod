---
author: "Gaby"
title: "React Router 全面整理"
date: 2021-08-24
description: "1 使用说明 React router 只是一个核心库，在具体使用时应该基于不同的平台要使用不同的绑定库。比如：我们要在浏览器中使用"
tags: ["前端","React.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:6,comments:0,collects:7,views:1154,"
---
**这是我参与8月更文挑战的第22天，活动详情查看：[8月更文挑战](https://juejin.cn/post/6987962113788493831 "https://juejin.cn/post/6987962113788493831")**

### 1\. 使用说明

React router 只是一个核心库，在具体使用时应该基于不同的平台要使用不同的绑定库。比如：我们要在浏览器中使用 react router，就安装 react-router-dom 库，如果在 React Native 中使用 React router 就应该安装 react-router-native 库。但是我们不会安装 react-router.

### 2\. 场景

#### 2.1 响应式路由

响应手机、平板横向/纵向切换导致屏幕大小变换，从而动态改变路由界面布局，比如从纵向换到横向可以用更大的界面显示路由主从界面，将纵向时只能用新页面显示的子页面显示在和父页面相同的页面。

```js
const App = () => (
<AppLayout>
<Route path="/invoices" component={Invoices} />
</AppLayout>
);

const Invoices = () => (
<Layout>
{/* always show the nav */}
<InvoicesNav />

<Media query={PRETTY_SMALL}>
{screenIsSmall =>
screenIsSmall ? (
// small screen has no redirect
<Switch>
<Route
exact
path="/invoices/dashboard"
component={Dashboard}
/>
<Route path="/invoices/:id" component={Invoice} />
</Switch>
) : (
// large screen does!
<Switch>
<Route
exact
path="/invoices/dashboard"
component={Dashboard}
/>
<Route path="/invoices/:id" component={Invoice} />
<Redirect from="/invoices" to="/invoices/dashboard" />
</Switch>
)
}
</Media>
</Layout>
);
```

（以上代码来自官网）

### 2.2 React router 和 Redux 集成

以便将路由信息同步到 Redux state 统一管理，并且路由组件可以从 Redux 获取路由信息，实现导航等功能。

### 集成好处：

1）路由信息可以同步到统一的 store 并可以从中获得

2）可以使用 Redux 的 dispatch action 来导航

3）集成 Redux 可以支持在 Redux devtools 中路由改变的时间履行调试

### 集成的必要性：

集成后允许 react router 的路由信息可以存到 redux ，所以就需要路由组件要能访问到 redux store，这样组件就可以使用 store 的 dispatch action，可以使用 dispatch 带上路由信息作为 action 的负载将路由信息存到 store，同时要能将路由信息从 Redux store 里面同步获取出来

### 集成方法有以下几种：

1.  用 react-redux 的 `<Provider store={store}>` 包住 react router 的路由组件`<Router>、<BrowserRouter>`等，这样 react router 的路由组件就可以访问到 redux 的 store 了 ，被包裹的路由组件也就可以使用 store 的 dispatch 和 getState 与 Redux 交互。

这种方法在编码时有以下两种模式：

*   (1). 用 `<Provider>` 包裹 `<Router>` 即用一个 `<Provider>` 一次性包裹所有路由页面，我在这里用的是这种：

```javascript
ReactDOM.render(

<Provider  store={store}>

<APPRouter/>

</Provider>

,  document.getElementById('root'));
```

*   (2). 用 `<Router>` 的createElement属性，给每一个 `<Route>` 页面组件外面都包裹一个 `<Provider>`:

```javascript
const createElement = (component，props) => (

return  (

<Provider  store={store}>

<Component  {...props} />

</Provider>

))

const Routes = () => (
<Router  history={history}  createElement={createElement}  />
)
```

1.  第二种集成方法就是使用 react router 最新的 API `withRouter`，它可以将路由信息更新结果（match、history、location）传给它所包裹的组件，组件相当于是一个`<Route>` 组件了。使用 withRouter 集成 Redux 和 React router 的方法是：`withRouter( connect( mapStateToProps, mapDispatchToProps ...))( wrappedComponent) )` ,这样被包裹组件既可以拿到 Redux 的 store （通过 dispatch 和 state），也可以拿到 React router 封装的 match、location、history 等路由信息，于是可以将路由信息与 redux store 集成，将路由信息同步到 store，或从 store 实时获取 路由信息。

\*\*_注意 ! !_ \*\* :

需要注意：withRouter 只是用来处理数据更新问题的。在使用一些 redux 的`connect()`或者 mobx的`inject()`的组件中，如果依赖于路由的更新要重新渲染，会出现路由更新了但是组件没有重新渲染的情况。这是因为 redux 和 mobx 的这些连接方法会修改组件的`shouldComponentUpdate`。

所以在使用 withRouter 解决更新问题的时候，一定要保证 withRouter 在最外层，比如`withRouter(connect()(Component))`，而不是 `connect()(withRouter(Component))`

### 2.3 代码分割

不用把整个应用程序下载下来，而是允许用户”增量下载“代码，可以减少首屏代码加载量，也可以避免后面重复下载相同部分的代码。React router 可以结合 webpack 和 `@babel/plugin-syntax-dynamic-import、loadable-components` 来实现代码分割。

一个 React router + webpack + @babel/plugin-syntax-dynamic-import + loadable-components 实现代码分割的简单示例：

`.babelrc` 配置文件：

```js
    {
    "prestes": ["@babel/presets-react"],
"plugins": ["@babel/plugin-syntax-dynamic-import"]
}
```

`@babel/plugin-syntax-dynamic-import` 插件避免 babel 对动态 import 语法做过多的转化，允许 webpac 打包时将动态 import 的代码分离待单独的 bundle，实现代码分割。

使用`loadabel-component` 和动态 import 懒下载组件:

```js
import loadable from "@loadable/component";
import Loading from "./Loading.js";

    const LoadableComponent = loadable(() => import("./Dashboard.js"), {
    fallback: <Loading />
    });
    
        export default class LoadableDashboard extends React.Component {
            render() {
            return <LoadableComponent />;
        }
    }
```

### 2.4 滚动恢复

浏览器 history 新增的 `scrollRestortation` 属性支持页面恢复后自动滚动到之前滚动的位置。此属性有两个可选值（“auto" 自动和 "manual" 手动) ，默认自动就是滚动恢复。

所以，浏览器可以支持或者取消“滚动恢复”，只需设置 widnow.history.scrollRestoration 为 "auto"或者 “manual”即可。

但是我们也可以使用 react 的 useEffect 来解决：

```js
import { useEffect } from "react";

    function ScrollToTopOnMount() {
        useEffect(() => {
        window.scrollTo(0, 0);
        }, []);
        
        return null;
    }
    
    // Render this somewhere using:
    // <Route path="..." children={<LongContent />} />
        function LongContent() {
        return (
        <div>
        <ScrollToTopOnMount />
        
        <h1>Here is my long content page</h1>
        <p>...</p>
        </div>
        );
    }
```

我们甚至可以随意控制页面恢复时滚动到何处。只需把页面需要滚动的位置存到 `sessionStorage`，然后页面可以从 sessionStorage 获取要滚动位置即可。

### 2.5 服务端渲染

使用服务端渲染路由时添加状态。SPA 单页面应用通常都是使用客户端路由，但是有时使用服务端渲染可以对应用的 SEO 更好，所以可以使用服务端渲染。但是，使用服务端渲染有一个问题就是，它不像客户端渲染那样可以对前后两个请求进行关联，也就是说服务端渲染是无状态的、静态的。在使用 React router 做服务端渲染的路由时，如果我们在跳转到另外一个页面时需要传递一些信息以便于根据这些信息做出不同响应，也就是让它具备状态，那么我们可以使用 `<StaticRouter>` 的 context ，在context 装载信息，比如 http 状态吗（301，302 等等）、url。

一个在 react router 应用中让服务端渲染具备状态的例子:

服务端：

```js
import http from "http";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom";

import App from "./App.js";

http
    .createServer((req, res) => {
    const context = {};
    
    const html = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
    <App />
    </StaticRouter>
    );
    
        if (context.url) {
            res.writeHead(301, {
            Location: context.url
            });
            res.end();
                } else {
                res.write(`
                <!doctype html>
                <div id="app">${html}</div>
                `);
                res.end();
            }
            })
            .listen(3000);
```

客户端：

```js
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./App.js";

ReactDOM.render(
<BrowserRouter>
<App />
</BrowserRouter>,
document.getElementById("app")
);
```

### 2.6 嵌套路由

1）可以使用在子路由组件里再次使用路由器`<Router/>`、`<BrowserRouter/>`、`<HashRouter/>`（下面将会介绍）的方法。

2）使用以下的静态路由配置库`react-router-config`，可以在配置 routes 对象里面嵌套多层路由。

### 2.7 静态路由

静态路由是在应用运行之前就固定好了路由结构。

可以使用[react-router-config](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fgithub.com%2FReactTraining%2Freact-router%2Ftree%2Fmaster%2Fpackages%2Freact-router-config "https://link.zhihu.com/?target=https%3A//github.com/ReactTraining/react-router/tree/master/packages/react-router-config") 这个库来静态配置路由：

```js
    const routes = [
        {
        component: Root,
            routes: [
                {
                path: "/",
                exact: true,
                component: Home
                },
                    {
                    path: "/child/:id",
                    component: Child,
                        routes: [
                            {
                            path: "/child/:id/grand-child",
                            component: GrandChild
                        }
                    ]
                }
            ]
        }
        ];
```

_**`react-router-config` API**_

*   `renderRoutes(routes, extraProps = {}, switchProps = {})`：这个ApI把路由组件渲染出来。routes 即是上面配置的可嵌套路由配置对象。
*   `matchRoutes(routes, pathname)`：这个API返回被匹配的路由。使用它可以在应用渲染路由匹配的组件之前做一些操作。

```js
import { matchRoutes, renderRoutes } from "react-router-config"

    const routes = [
        {
        component: Root,
            routes: [
                {
                path: '/',
                component: Home,
                exact: true
                },
                    {
                    path: '/article/:articleTitle',
                    component: Article,
                    },
                        {
                        path: '/project',
                        component: Project,
                        },
                            {
                            component: NoMatch
                        }
                    ]
                }
            ]
            
                function Root({route}) {
                return(
                <div>
            {renderRoutes(route.routes)}
            </div>
            )
        }
```

### 2.8 动态路由

与静态路由不同，动态路由可以动态改变路由，在应用运行的时候可以动态改变路由结构，也就是在运行时可以动态改变UI与路由的映射关系。

使用编码实现即可，如条件渲染路由器，或者使用纯函数返回路由器。

### 3\. React router API

### 3.1 路由器组件

`<BrowserRouter>`、`<HashRouter>`、`<MemoryRouter>`、`<NativeRouter>`、`<StaticRouter>`、`<Router>`

![](/images/jueJin/6bfe79b4e4404ea.png)

### 3.2 Hooks

*   **useHistory**

返回 react router 封装的 history 实例，然后我们可以使用它来导航。

注意，这里返回的 history 实例是指 React router 封装的实例，而它有来自 history 包。与浏览器的 history 不同:

react router 的 history:

![](/images/jueJin/a0a2da23a5a54a2.png)

![](/images/jueJin/757c181b55e44f7.png)

window history：

*   **useLocation**

返回 react router 封装的 location 实例

这里的 location 也与浏览器的 location 不一样

react router的 location：

`js { key: 'ac3df4', // not with HashHistory! pathname: '/somewhere', search: '?some=search-string', hash: '#howdy', state: { [userDefined]: true } }`

window.location：

![](/images/jueJin/cd94208524d5490.png)

**react router 提供 location 对象的地方** ：

*   Route 组件接收到的 props 中可以得到 location\\
    
*   Route 组件的属性 render 的回调函数的参数 ： ({ location }) => ()\\
    
*   Route 组件的属性 children 的回调函数的参数： ({ location }) => ()\\
    
*   withRouter 传递给所包裹组件中 props 包含 locaton\\
    

**location 可以用于：**

```js
<Link to={location}/>
<Redirect to={location}/>
history.push(location)
history.replace(location)
```

*   **useParams**

用以获取 match.params

```js
import React from "react";
import ReactDOM from "react-dom";
    import {
    BrowserRouter as Router,
    Switch,
    Route,
    useParams
    } from "react-router-dom";
    
        function BlogPost() {
        let { slug } = useParams();
        return <div>Now showing post {slug}</div>;
    }
    
    ReactDOM.render(
    <Router>
    <Switch>
    <Route exact path="/">
    <HomePage />
    </Route>
    <Route path="/blog/:slug">
    <BlogPost />
    </Route>
    </Switch>
    </Router>,
    node
    );
```

（此代码来自官网）

*   **useRouteMatch**

用与 `<Route>` 一样的方式匹配当前 URL，但是不会渲染对应的组件，只是返回 match

![](/images/jueJin/2868a9794299475.png)

### 3.3 导航器 (就是链接）

![](/images/jueJin/ac3db94c2b1240b.png)

### 3.4 路由匹配器

![](/images/jueJin/8cd68d4a8bd5434.png)

### 3.5 winthRouter

这是一个高阶组件（函数），`withRouter` 可以包装任何自定义组件，将 react-router 的 history,location,match 三个对象传入。 无需一级级传递react-router 的属性，当需要用的router 属性的时候，将组件包一层 withRouter，就可以拿到需要的路由信息，可以作为一种集成 Redux 和 react router 的方法。

_**本文参考**_：

*   React router 官网文档：[reacttraining.com/react-route…](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Freacttraining.com%2Freact-router%2F "https://link.zhihu.com/?target=https%3A//reacttraining.com/react-router/")
*   [React Router Config](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fgithub.com%2FReactTraining%2Freact-router%2Ftree%2Fmaster%2Fpackages%2Freact-router-config "https://link.zhihu.com/?target=https%3A//github.com/ReactTraining/react-router/tree/master/packages/react-router-config")