---
author: "徐小夕"
title: "next-admin支持AI问答模块，完全开源！"
date: 2024-05-12
description: "hello，大家好，我是徐小夕。之前和大家分享了很多可视化，零代码和前端工程化的最佳实践，今天继续分享一下最近开源的 Next-Admin 的最新更新。 最近对这个项目做了一些优化，并集成了大家比较关"
tags: ["前端","GitHub","React.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:6,comments:3,collects:11,views:1492,"
---
hello，大家好，我是**徐小夕**。之前和大家分享了很多**可视化**，**零代码**和**前端工程化**的最佳实践，今天继续分享一下最近开源的 `Next-Admin` 的最新更新。

![](/images/jueJin/9cf079e850e141f.png)

最近对这个项目做了一些优化，并集成了大家比较关注的`AI问答`模块，感兴趣的可以参考一下。

*   开源地址：`https://github.com/MrXujiang/next-admin`
*   在线demo：`http://next-admin.com`

目前已支持的功能模块有：

*   Next14.0 + antd5.0
*   支持国际化
*   支持主题切换
*   内置数据可视化报表
*   内置拖拽模块（多选，参考线，吸附等核心搭建能力）
*   内置AI问答模块
*   开箱即用的业务页面模板
*   支持自定义拖拽看板
*   集成办公白板
*   Next全栈最佳实践
*   支持移动端和PC端自适应
*   内置简单的JWT处理逻辑

### 往期精彩

*   [独立开发（裸辞）100天，我的阶段性复盘](https://juejin.cn/post/7360493040135651366 "https://juejin.cn/post/7360493040135651366")
*   [文档引擎+AI可视化打造下一代文档编辑器](https://juejin.cn/post/7359461815393845275 "https://juejin.cn/post/7359461815393845275")
*   [爆肝1000小时, Dooring零代码搭建平台3.5正式上线](https://juejin.cn/post/7325132202970447881 "https://juejin.cn/post/7325132202970447881")
*   [从零打造一款基于Nextjs+antd5.0的中后台管理系统](https://juejin.cn/post/7351321257755672602 "https://juejin.cn/post/7351321257755672602")

### demo演示

深色模式：

![](/images/jueJin/cf53ea477e3244c.png)

### 技术实现

问答模块目前已有比较成熟的组件，这里我选择 `antd` 旗下的 `@ant-design/pro-chat`, 这个组件我之前也有具体的分享，大家可以可以参考我往期的内容。

![](/images/jueJin/bd02a178c9ea4ff.png)

接下来直接上代码：

```html
<ProChat
className={styles.chatWrap}
    helloMessage={
    <div className={styles.helloBox}>
    <div>
    hello, 欢迎体验 <strong>Nocode/WEP</strong> 文档引擎，我是你的AI智能助手，
    有任何问题都可以和我提问，如果对产品有技术上或者体验上的问题，
    欢迎关注 <Popover content={content}>
    <span className={styles.btn}>趣谈前端</span>
    </Popover>
    公众号 和作者反馈~
    </div>
    </div>
}
    actions={{
        render: (defaultDoms) => {
            return [
            <a
            key="h5"
                onClick={() => {
                window.open('https://dooring.vip');
            }}
            >
            H5-Dooring零代码平台
            </a>,
            <a
            key="v6"
                onClick={() => {
                window.open('https://turntip.cn/');
            }}
            >
            试卷搭建平台
            </a>,
            ...defaultDoms,
            ];
            },
                flexConfig: {
                gap: 24,
                direction: 'horizontal',
                justify: 'start',
                },
            }}
            showTitle
        assistantMeta={{ avatar: '🛸', title: 'Nocode/WEP 智能助手' }}
            userMeta={{
            avatar: userInfo.avatar || '用户',
            title: '用户' + Date.now(),
        }}
            request={async (messages: any) => {
            console.log('messages', messages);
            // 后端处理能逻辑
            return new Response(readableStream);
        }}
        />
```

如果大家想参考完成代码， 可以在 `github` 查看。

*   开源地址：`https://github.com/MrXujiang/next-admin`
*   在线demo：`http://next-admin.com`