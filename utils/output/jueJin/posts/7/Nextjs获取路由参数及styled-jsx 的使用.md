---
author: "Gaby"
title: "Nextjs获取路由参数及styled-jsx 的使用"
date: 2022-06-23
description: "今天在用 nextjs 创建项目的时候，用到了Nextjs获取路由参数及styled-jsx 的使用，react 的使用方式跟 vue 的差别还是挺大的就此记录下。"
tags: ["JavaScript","React.js","前端框架中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:6,comments:0,collects:10,views:4478,"
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第24天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

废话只说一句：码字不易求个👍，收藏 === 学会,快行动起来吧！🙇‍🙇‍🙇‍。

今天在用 next.js 创建项目的时候， react 的使用方式跟 vue 的差别还是挺大的就此记录下。

### pages目录

在Next.js中路由的概念是pages下的文件目录即是路由层级，文件即是路由如下： 直接在根目录下的pages文件夹下，新建一个page.js页面，启动后 访问路径为/page

```js
// pages                    ---路由文件
//   _app.js                ---启动文件，不走路由
//   _document.js           ---宿主文件，不走路由
//   a.js                   ---可通过http://localhost:3000/a 进行访问
//   b.js                   ---可通过http://localhost:3000/b 进行访问
//   test                   ---二级路由
//     aa.js                ---可通过http://localhost:3000/test/aa 进行访问
```

![在这里插入图片描述](/images/jueJin/2b360a5d431d4cd.png)

#### 页面跳转

1.Link跳转

```js
import Link from 'next/link'
<Link href="/a?id=1" as="/a/1">
<span>点击我跳转到a页面</span>
</Link>
```

2.Router跳转

```js
import Router from 'next/router'

    <Button onClick={()=>{
    Router.push('/test/b')
        Router.push({
        pathname: 'test/b',
            query: {
            id: 1
        }
        },'test/b/1')
        }}></Button>
```

3.获取路由里的参数

```js
import { withRouter } from 'next/router'
const A = ({ router }) => <span>{router.query}</span>
export default withRouter(A)
//获取路由参数 分割线
import Router, { useRouter,withRouter } from "next/router";
const router = useRouter();
//路由格式为'/projects/:id'
const id= router.query.id
```

还有种获取参数的方法

```js
import { withRouter} from 'next/router'

    const App= ({router})=>{
    return (
    <>
    <div>{router.query.name},来为我们服务了 .</div>
    </>
    )
}

export default withRouter(App)
```

4.路由映射

路由映射是什么？ 我们看到的常规地址栏是这样的 `http://localhost:3000/test/b?id=1`，而路由映射可以帮我们显示成为这样 `http://localhost:3000/test/b/1`，比较美观友好

Link实现方式：

```js
<Link href="/a?id=1" as="/a/1"><span>点击我跳转</span></Link>
```

Router实现方式：

```js
    Router.push({
    pathname: 'test/b',
        query: {
        id: 1
    }
    },'test/b/1')
```

但是，问题来了。当我们触发跳转的时候，页面可以通过 `http://localhost:3000/test/b/1` 找到页面。而当我们刷新，却报404了。为什么呢？因为当我们点击按钮的时候，是浏览器去找页面，它会通过路由映射去匹配上，所以可以找到。而刷新的时候，是服务器去找，而我们的pages页面里test/b里面没有1的目录，所以就报404了 。

### nextJS styled-jsx 的使用

#### 作用

1.可以根据组件，按需加载，卸载时一起卸载 2.不会形成样式命名冲突

#### 示例

```js
import { withRouter } from 'next/router'
const Task = ({ router,fzr }) => (
<div>
{/* 定义当前页面样式 */}
<style jsx>{`
    span{
    color: red;
}
`}</style>
{/* 定义全局样式 */}
<style jsx global>{`
    span{
    color: #ccc;
}
`}</style>
<span>{router.query.taskName} 任务负责人：{fzr}</span>
</div>
)
export default withRouter(Task)
```