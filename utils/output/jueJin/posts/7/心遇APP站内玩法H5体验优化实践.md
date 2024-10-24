---
author: "网易云音乐技术团队"
title: "心遇APP站内玩法H5体验优化实践"
date: 2024-02-07
description: "本文主要介绍心遇APP站内玩法H5的体验优化实践，主要包括离线包功能简介、接口图片预加载、榜单优化等具体场景内容。"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读15分钟"
weight: 1
selfDefined:"likes:24,comments:4,collects:27,views:6573,"
---
> 本文作者：史志鹏

![](/images/jueJin/2b6af023b11143a.png)

1\. 离线资源
--------

在H5的开发过程中，尽管我们实践了很多手段对H5进行性能提升，比如代码层面的 React 渲染优化，Web Vitals 体验优化；打包构建层面的 Code Split & Bundle Analyze 加载优化；应用发布层面的SSR、SSG、网络缓存访问优化等，我们不可否认这些优化手段的有效性和可行性，但是这些优化手段都无法以框架的形式沉淀下来，需要开发者根据已有的经验和分析在代码编写、构建打包、应用发布等各个阶段倾注额外的心力来进行性能优化提升工作，甚至有时候可能会弄巧成拙进行着“反向优化”。

![常见的优化措施](/images/jueJin/a0ee11cdede94ce.png)

对于心遇APP的社交活动玩法，一般来说和APP中的基础性功能相比有明显的不同:

1.  它的玩法逻辑具有一定的系统性，是多个子功能系统的数据生产和消费过程，比如在我们《抢车位》的玩法中，涉及到的生产子功能有10多个： ![功能模块](/images/jueJin/8aed34d846a04d4.png)
2.  玩法场景具有一定的复杂性，存在若干个游戏场景，游戏场景间存在关联，在《抢车位》玩法中，有宝箱抽奖、停车、商城购车、碎片&皮肤合成等多个玩法场景，所有的玩法场景具有一定的数据关联。 ![车玩法](/images/jueJin/d1dc27021b32494.png)
3.  玩法的体验也具有多样性，比如混合常见的互动营销交互、小游戏场景等，例如在《抢车位》玩法中也有九宫格抽奖、停车位停车收车等游戏化场景，在《打怪兽》玩法中，有怪兽击打效果、对战PK场景。视频不可见请点击 [开宝箱效果](https://link.juejin.cn?target=https%3A%2F%2Fd1.music.126.net%2Fdmusic%2F575c%2F8717%2F741a%2Fd1434dc6f1c069a7389ccf8608479810.mp4%3FinfoId%3D1396584 "https://d1.music.126.net/dmusic/575c/8717/741a/d1434dc6f1c069a7389ccf8608479810.mp4?infoId=1396584")、[打怪PK效果](https://link.juejin.cn?target=https%3A%2F%2Fd1.music.126.net%2Fdmusic%2F45a2%2F8fd0%2F6dcf%2Fb050dcd011ca19920f5c5b4aa355d09b.mp4%3FinfoId%3D1394586 "https://d1.music.126.net/dmusic/45a2/8fd0/6dcf/b050dcd011ca19920f5c5b4aa355d09b.mp4?infoId=1394586")

因此这类业务的H5开发，不可避免的具有着静态资源大、交互方式多的特点。此外，心遇APP的用户量级与终端性能网络属性，对H5的加载和交互体验也有着一定的要求，这也决定了开发这类玩法H5需要提供很好的性能和交互体验。

综上，为了一劳永逸地解决前端资源加载的速度问题，我们和客户端、部署平台同事合作，共同推动了离线包功能的升级。

### 1.1 离线包拆包

上面说到，对于玩法类H5，静态资源往往比较多，比如在我们的两个玩法里，图片经过压缩后，打包的总体积仍然会达到 10M 以上，由于离线包 `diff` 的版本可能有限，碰到客户端缓存的版本已经超过离线包 `diff` 版本限制时，则需要下载全量的离线包，这个全量包的流量不应该是用户应该承担的，所以我们选择对离线包进行“拆包”，这个从功能上和小程序的分包一样，在技术实现上“接近” Webpack 的 code split，即按照功能模块划分，对重要的功能打包到主包进行优先加载，将不需要优先加载的子包（subpacks）按照一定的规则逻辑延后加载。

拆包实现的技术主要是：

1.  首先需要对功能模块进行划分，主要分为首屏、次屏。
2.  按照首屏、次屏将文件组织好，比如子包都在 subpacks 文件目录下。
3.  使用 Webpack optimization 自定义分包能力，将 subpacks 下的文件资源额外分包，形成独立的 chunkFile，构建产物也放到 publicPath 的 subpacks 目录下。
4.  离线包发布平台提供主、子包打包、下发能力，同时提供后续发布时的diff能力、下发能力。
5.  客户端根据一定策略，进行主、子包下载，同时提供 JSBridge 能力，交由前端进行子包下载。

### 1.2 Native开屏界面

有了离线包功能之后，尽管我们可以忽略网络加载的延迟，但是前端资源仍然需要具有客户端拦截逻辑和磁盘加载带来的延迟， Webview 容器首次加载仍然会有白屏或者 Loading UI 的可能。为了带给用户好的加载体验，对于接入了离线包的 Web 应用都在客户端 Webview 容器上添加了统一的开屏界面，开屏界面支持简单的应用 UI 配置和显示，开屏界面可以由前端在合适的时机控制其销毁，比如在主界面的 DOM 渲染完成时，调用客户端隐藏开屏界面能力，用户即可以看到渲染好的 H5 界面，相比前端直接白屏和Loading，客户端原生的开屏体验更佳。

开屏界面和离线包功能绑定，具有应用层面的配置能力。

```json
    {
    "moduleName": "xx", // 应用名，用于离线包关联
    "url": ".+/xx", // publicPath 用于客户端资源匹配
    "resID": "xx", // 离线包文件资源ID
    "resVersion": "1700720234678", // 构建版本，timestamp
    "loadingInfo": { // 开屏界面配置
    "loadingBgUrl": "https://xxx.png", // 应用 icon
    "loadingTextInterval": 1500, // 多个文案切换间隔
    "loadingText": ["xxxx"] // 文案
    },
    "packages": [{ //  // 子包信息
    "moduleName": "subpacks-xxx",
    "resID": "xx",
    "strategy": "open_block|preload",
    "resVersion": "1700720234678"
    }],
    "versionControl": [ // 版本控制配置，主要是过滤条件
        {
        "belowVersion": "xx", // 指定版本以下
        "specificVersionList": [], // 特地版本
        "minVersionName": "1.0.0", // 最小版本
        "userNos": "xx" // 过滤userId
    }
]
}
```

### 1.3 离线包拆包加载流程

下面是客户端同学设计的离线包拆包加载流程，可以看到主要是基于子包拆包后添加了子包加载的逻辑，以及在原来离线包的功能上调整了主包的加载逻辑，同时增加 Native 开屏逻辑： ![](/images/jueJin/5a95529e486b4a7.png)

2\. 数据状态管理与预请求
--------------

玩法类 H5，业务场景一般比较多。这里的业务场景，在技术层面可以理解为一个个的页面，也可以实现为一个个的全页面组件。业务场景之间存在比较多的数据状态同步，比如当前用户资产、全局性的逻辑数据等；除了比较多的数据状态同步之外，还存在多个业务模块数据的串并行读写，相同业务模块数据的不同表现形式等。基于这些业务情况，我们在数据管理上采用了以下两个措施：

### 2.1 必要的数据状态管理

通过全局数据状态管理，不仅可以提高开发效率，还可以“持久化”数据，做高效的数据传递和共享。在玩法类的 Web 应用，功能模块可以高达20多个，对于同一份业务数据，可能会被多个功能模块进行读写，为了高效地处理模块间数据的传递与同步，我们使用 zustand 来进行数据状态管理，在数据层封装好每个业务功能模块的数据读写，然后在业务逻辑层进行数据读写逻辑的引用和调用，UI 层直接取数据进行 UI 渲染，使业务逻辑的表达具有明显的层次性，带来业务模块编写的高效。以下为脱敏代码：

```javascript
// store.js
    export default create<StoreType>((set, get) => ({
        data: {
        // xxx
        },
            getData: async () => {
                try {
                const res = awwait servivce.getData();
                set({ data: res });
                    } catch (e) {
                    //
                }
                },
                // 暴露给其他业务逻辑
                setData: payload => set({ data: payload });
                // ...
                }));
                
                // view.js
                const data = useStore((state: StoreType) => state.data);
                const getData = useStore((state: StoreType) => state.getData);
                // getData();
                // <View data={data} />
```

### 2.2 数据预加载

当然，为了减轻异步数据加载对视图展示的影响，使 H5 更具有小游戏的体验，我们还对各次级模块的数据进行预加载，具体的实现方式是在各次级模块的前一级模块的非阻塞逻辑里完成对次级模块核心数据的预加载请求，在次级模块加载时，再重新发起数据请求更新数据来兜底，这样在次级模块显示时则可以减去 Loading UI，加快次级模块的展示和数据的准确同步。 非阻塞逻辑是指前一级模块组件 useEffect 模拟的组件 ComponentDidMount，比如上一级页面或次级模块的入口组件 componentDidMount时机，尽管这些逻辑需要开发者关注更多的逻辑，但是当模块被处理成组件和页面时，则可以结合 React-Router V6 的 loader 字段和 React Suspense + use 的方案进行数据的规范预请求。以下为脱敏代码：

```javascript
// A1, A2, A3...为不同的业务模块
// A1
    useEffect(() => {
    fetchData(A1);
    prefetchData(A2);
    prefetchData(A3);
    }, []);
    return (
    <>
    <A1 />
    <Link to={A2} />
    <Link to={A3} />
    <>
    );
    // A2, A3
    const data = useStore((state: StoreType) => state.dataA2);
    return (
    <A2 data={data} />
    );
    
```

3\. 图片加载优化
----------

图片资源的加载优化也是应用体验优化重要的一环，对应用的 LCP、FCP 数据有着明显提升。在 Web 应用中，图片分为应用本地的静态图片和接口返回的动态图片，在图片的加载和展示优化上我们也有一些实践。

### 3.1 静态图片

类似于接口预加载的思路，我们使用 web worker 技术，将核心次级模块中的大图进行提前加载，由于 web worker 的非阻塞性和浏览器本身的资源缓存能力，这些次级模块的背景图会被提前加载并缓存在浏览器的内存中，而由于图片模块引用路径的一致性，且这类静态图片都被离线缓存到客户端本地，所以提前和实时的渲染请求也不会造成消耗流量的问题，同时即使提前请求失败，也会有实时渲染请求来保底。

```javascript
// preloadAssets.js
import { RESOURCE_TYPE } from '@music/tl-resource';
import BoxBg from '@/subpacks/assets/TreasureBox/tbg.png';
import PackageBg from '@/subpacks/assets/PackStore/bg.png';
// 需要预加载的图片
    export default [{
    src: BoxBg,
    type: RESOURCE_TYPE.IMAGE,
    },
        {
        src: PackageBg,
        type: RESOURCE_TYPE.IMAGE,
        },
            {
            src: StoreBg,
            type: RESOURCE_TYPE.IMAGE,
            }];
            // view.js
            // 预加载图片
                await Resource.loadResource(loadAssets, (progress: number) => {
                setLoadProgress(progress);
                });
```

### 3.2 动态图片

在 Web 应用中，接口返回动态图片，一般分为用户上传的 UGC 图片和平台在后台上传的 PGC 图片。我们对于这两类图片，从图片的生产、转换、消费流程上都进行了合理的优化：对于接口下发的 PGC 图片，在后台配置的时候就根据 UI 稿显示的大小限制好图片的宽高、大小、格式，比如 UI 稿上图片展示的是 100x100 像素，则取三倍图标准 300x300 进行限制，这样可以合理控制资源的大小，避免不必要的渲染。

同时对于在业务迭代过程中一些改动较少的 PGC 图片，我们会在工程内进行图片的本地化，然后基于图片上传得到的存储 key 创建和接口返回图片地址映射，当远程图片加载时，替换成了本地图片地址进行加载，这样可以做到远程图片的加载速度显著提升。 对于 UGC 图片，则使用 CDN 裁剪，减少不必要的像素渲染，同时对裁剪参数进行收敛，避免 CDN 由于参数差异性导致不必要的回源。

代码层面对比较大的图片减少使用 CSS `background-image`，增多使用 `img` 标签来提高浏览器对图片的加载优先级。

```javascript
// 本地图片Map，key是存储 key，value 是对应图片的本地地址，数据的来源是基于接口解析获得
    const LocalImgMap = {
    obj_w57DlMOIw6PCnj7DjMOi_31820368447_d791_9c66_d7e1_a0b39b42967e725d72c1a701d6bbe3ec: require('./locals/obj_w57DlMOIw6PCnj7DjMOi_31820368447_d791_9c66_d7e1_a0b39b42967e725d72c1a701d6bbe3ec.png'),
    obj_w57DlMOIw6PCnj7DjMOi_31820383635_fe96_8304_f720_474678d79820f05a5af723f710ecb54a: require('./locals/obj_w57DlMOIw6PCnj7DjMOi_31820383635_fe96_8304_f720_474678d79820f05a5af723f710ecb54a.png'),
    obj_w57DlMOIw6PCnj7DjMOi_31820418766_05dd_fe2d_1313_5b80b1108b2bfbbbe084585a3cb57f1f: require('./locals/obj_w57DlMOIw6PCnj7DjMOi_31820418766_05dd_fe2d_1313_5b80b1108b2bfbbbe084585a3cb57f1f.png')
    // ...
    };
    // 本地图片映射组件
        const LocalImg = ({ src, ...rest }) => {
        const localNosKeyStr = Object.keys(LocalImgMap).find(nosKeyStr => src.indexOf(nosKeyStr.replaceAll('_', '/')) > -1)
        const nSrc = LocalImgMap?.[localNosKeyStr] || src;
        return (
        <Image src={nSrc} {...rest} />;
        );
    }
```

4\. 过渡动画效果
----------

玩法 H5 开发和普通展示型的H5开发还有很大的不同，就是在交互体验上需要更接近一些小游戏，比如需要在一些场景转换和状态变更时，做一些合理的视觉效果，在按钮点击时需要有明显的交互反馈。总的来说就是要从交互优化的角度做的一系列的业务开发工作。这里我们举几个简单的例子：

1.  一般在 React 应用开发中，数据状态的变更，不可避免的会出现视图闪烁的情况，比如数据变更引起的局部UI结构变化，元素的清除、元素的更新等，对于这类小元素状态变更的处理，就是要在数据发生变化时进行过渡，但是视图时受数据响应的，这里需要结合数据发生变化时对元素做一些动画效果。比如列表项数据发生变化时，需要使用缓动消失，这里可以结合一些动画库进行处理。再比如为了数据项不生硬展示时，可以书写一些 CSS 动画让数据缓动入场等，再比如文字发生变化时，可以添加一个切换状态toogle，将数据变化和切换状态结合，切换状态又和动画绑定，则可以表达数据变化的过渡效果。
    
2.  对于 UI 变动较大的情况，则可以参考行业内的做法，添加比较大的过场动画，来缓解用户的视觉冲击。比如玩法中场景的变化，可以在每一个场景组件中内置一个提前展示的全场动画，通过下一个场景的数据、UI的到达等合理去控制过场动画展示。
    
3.  普通的交互最好都设计好一套标准的交互，比如按钮点击效果、弹窗展示和消失动画、模态弹窗的使用等，总之玩法H5的开发要逐步向游戏开发的标准靠近。
    

5\. 榜单优化
--------

1.  直播社交类应用往往不乏排名榜单的功能，而且随着业务功能的扩大，榜单展示的逻辑也会变得复杂，比如从单层Tab榜单发展为多层 Tab 嵌套榜单，在我们的玩法中，榜单嵌套可以达到 2x3x2 = 12 个数据榜单，如何在满足较高体验目标的情况下设计这12个榜单的组织结构和数据加载，是一个值得考虑和实践的问题。

![榜单](/images/jueJin/24ea6fc7a09f436.png)

2.  在最初的版本中，实现方式是多层 Tab 组合和一个数据列表 List，用户点击任一 Tab，触发新的数据请求，重新渲染 List，List 是一个最大长度为300的列表。这种实现方式相对比较简单，实际的效果就是频繁切换Tab的时候，同时一次性重新渲染300条数据的结构，造成明显的 UI 闪烁。

```javascript
<Fragment>
<Tabs tabs={[A1, A2]} />
<Tabs tabs={[B1, B2, B3]} />
<Tabs tabs={[C1, C2]} />
<List data={calc(A1, B1, C1)} />
</Fragment>
```

3.  为了解决重新渲染引起的闪烁问题，我们将榜单的 List 改成了 KeepAliveList，即维护了3个 List 节点，只有1个 List 处于可见区域，其他 List 则被 KeepAlive 组件缓存在内存当中，当用户在切换 Tab 时，就会将缓存住的 List 移入可见视图，这个过程不会再有大量的节点重建，只有已渲染缓存的节点移动，所以变消除了闪烁的情况。

```javascript
<KeepAlive cacheKey={`${biz}_pre`} saveScrollPosition={false}>
<div className="item hide" key={pre}>
{childs[pre]}
</div>
</KeepAlive>
<div className="item show cur" key={index}>
{childs[index]}
</div>
<KeepAlive cacheKey={`${biz}_next`} saveScrollPosition={false}>
<div className="item hide" key={next}>
{childs[next]}
</div>
</KeepAlive>
```

4.  同时，为了保证首次加载创建的闪烁问题，我们在游戏进入场景时即提前请求了全量榜单的前10条数据，这样可以既保证榜单首次创建时可以不会出现Loading的样式，也缓解了首次创建的数据加载消耗。当然，对于后续的数据加载，我们也采用了常见的上拉加载的方式，尽量避免单次大量数据的渲染。

![](/images/jueJin/64cc0519e15f44e.png)

5.  在多榜单处理的中，还有一个比较常见的问题，就是滚动问题。使用了多个 List 来表单榜单后，由于不同榜单的高度可能不一致，如果使用全局滚动，则在 Tab 切换的时候，就会出现滚动重置的情况，所以在这种情况下有必要使用局部滚 ![](/images/jueJin/80a15654647c48a.png)

总结规划
----

以上，我们通过离线缓存、接口预加载、图片加载优化、过渡动画、KeepAliveList 榜单优化等实践方式优化了玩法H5的用户体验，虽然最后达成的效果从感官上相比普通的H5有明显的不一样，但是大部分优化都是需要耗费一定的开发成本。未来会将其中一些可以框架化的方案沉淀下来，减少一定的开发成本，比如数据预加载、图片预加载、KeepAliveList、动画组件等，为后续的小游戏H5开发提供较好的开发经验。

参考
--

1.  [react-activation](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FCJY0208%2Freact-activation "https://github.com/CJY0208/react-activation")
2.  [Web Worker在项目中的妙用](https://juejin.cn/post/6844903510673211400 "https://juejin.cn/post/6844903510673211400")

最后
--

![](/images/jueJin/d06deb29e844468.png) 更多岗位，可进入网易招聘官网查看 [hr.163.com/](https://link.juejin.cn?target=https%3A%2F%2Fhr.163.com%2F "https://hr.163.com/")