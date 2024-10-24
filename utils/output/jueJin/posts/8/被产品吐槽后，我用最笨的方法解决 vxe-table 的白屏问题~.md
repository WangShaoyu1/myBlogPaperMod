---
author: "Sunshine_Lin"
title: "被产品吐槽后，我用最笨的方法解决 vxe-table 的白屏问题~"
date: 2023-08-11
description: "大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心。 背景 事情是这样的，最近团队为了优化用户体验，做了很多针对性的措施，但是有一个小问题，一直卡着。那就是我们"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:45,comments:20,collects:74,views:4013,"
---
大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心。

![](/images/jueJin/2e87910f7e5546b.png)

背景
--

事情是这样的，最近团队为了优化用户体验，做了很多针对性的措施，但是有一个小问题，一直卡着。那就是我们使用 `vxe-table` 这个表格组件库，但是发现他在数据量大的情况下，**拖动滚动条**会有`白屏现象`。

![](/images/jueJin/65b09e7588f14af.png)

其实这个问题可大可小，但是身为一个菜鸟级别前端，肯定是想挑战自我，更进一步成为入门级别前端！！！于是我开始着手解决这个问题~

跟电脑性能有关？
--------

我的电脑是 Macbook pro 19款，性能问题应该不至于那么严重，试了一下同事的 M1，也是照样有这个问题，Windows 也有这个问题，我试过的电脑，拖动滚动条都会有白屏现象，所以你们可别叫我换电脑哦~

跟虚拟滚动有关吗？
---------

一开始我觉得是不是因为默认开启了虚拟滚动，所以在滚动的时候需要去计算下一次的渲染，计算是需要过程的，所以导致了短暂的白屏，所以我马上把虚拟滚动关了~~ 但结果还是老样子，所以排除虚拟滚动这个原因~~

![](/images/jueJin/993a040ba7544da.png)

> 虽然虚拟滚动也会导致白屏，但是`vxe-table`有`预渲染`的功能，所以问题不大

跟表格组件有关？
--------

那是不是只有`vxe-table`有这个现象呢？其实不止是 `vxe-table`，我去看了市面上那些表格组件其实都会有这个现象，我看了包括（我是在 Mac 上试的）：

*   **Surely Vue：** 号称高性能表格，Mac有白屏，Windows无白屏，不开源
*   **Ant-Design Table：** 很火的组件库，没解决白屏问题
*   **Element Table：** 很火的组件库，没解决白屏问题

无一例外，都存在`白屏现象`

![](/images/jueJin/60b497793ea9480.png)

跟框架有关系？
-------

那跟框架有关系吗？难道我换个框架就好了？要不，我直接不用框架，我用原生好不好？于是我直接新建一个`html`文件，里面我写了 10000 条数据

```html
<body>
<div>
<div>林三心菜鸟级别前端--林三心菜鸟级别前端--林三心菜鸟级别前端--林三心菜鸟级别前端--林三心菜鸟级别前端--林三心菜鸟级别前端--林三心菜鸟级别前端</div>
<div>林三心菜鸟级别前端--林三心菜鸟级别前端--林三心菜鸟级别前端--林三心菜鸟级别前端--林三心菜鸟级别前端--林三心菜鸟级别前端--林三心菜鸟级别前端</div>
<div>林三心菜鸟级别前端--林三心菜鸟级别前端--林三心菜鸟级别前端--林三心菜鸟级别前端--林三心菜鸟级别前端--林三心菜鸟级别前端--林三心菜鸟级别前端</div>
// ... 10000 条
</div>
```

拖动了，结果也是会有白屏现象，只不过少了`框架+组件库`这一层，原生的白屏现象会比较轻一些，但是还是没有解决问题

![](/images/jueJin/2493384dd9324f7.png)

跟浏览器有关？
-------

那现在只剩浏览器这个因素了，其实`vxe-table`的 `issue`中有人反映了谷歌浏览器版本问题

![](/images/jueJin/01a86d586d3d4ed.png)

> 注：我们用户大部分都是谷歌浏览器，所以我暂时先考虑谷歌浏览器

确实跟谷歌浏览器的版本有关，我现在的版本是`115`的，我换了`95`版本的谷歌浏览器就没有这个问题了，但是不可能让用户去用旧版本浏览器吧，所以问题还是得解决~

vxe-table 的固定列滚动
----------------

我看到了一个`vxe-table`的官方例子，是一个固定列的例子，我发现当表格拥有固定列的时候，拖动滚动条，固定列会有白屏现象，但是主表格并不会有白屏现象，如下：

![](/images/jueJin/20169db6a315479.png)

我看了源码，我理解应该是固定列（固定列其实也是一个表格，我称为副表格）的滚动，带动了主表格的滚动，所以主表格的滚动是被动的，导致主表格滚动速率没有那么快，所以白屏现象就消失了~

审查元素，看看，其实固定列是一个表格（副表格），我们拖动的滚动条是副表格的滚动条

![](/images/jueJin/cf264c98e3b64a3.png)

> 注：滚动白屏现象，其实跟滚动速率也有关，你慢慢滚就不会有白屏，滚得快就会有。拖动滚动条就是一个滚得快的操作~

笨方法 解决 大难题
----------

回到正题，刚刚说了，有了`固定列`，那么当你拖动滚动条时，虽然滚动的很快，但是主表格是被动滚动的，所以速率不会那么快，也就不会有白屏现象

那，我能不能自己塞一个`固定列`进表格里？这样拖动滚动条时，其实就是拖动我塞进去的这个副表格，但是这个`固定列`需要具备以下条件

*   **不影响表格列的原始数据**
*   **不能跟用户自定义的固定列冲突**
*   **必须是一个不可见的固定列，这样用户才能无感知**

于是我进行了修改源码的操作

> 想自己调试的兄弟，可以把`vxe-table`的源码从 node\_modules 中拖到 src 下，然后去引入，去进行调试，改 node\_modules 中代码去调试比较麻烦，因为 node\_modules 是在热更新监听范围之外的~

我设想是传入一个参数，去开启我这个优化，我选择在`params`中传入自定义参数`scrollFollow`

> `params` 是`vxe-table`自带的参数，可以让我们传额外参数进去~

```html
<vxe-table
...
    :params="{
    scrollFollow: true,
    }"
    ></vxe-table>
```

### 修改 table.js

我的`vxe-table`版本是`4.4.2`

刚刚说了，我需要塞一个不可见的、不冲突的固定列进表格中，那么我需要进到这个文件中去修改

**路径：vxe-table/es/table/src/table.js**

我们先要引入一个方法`vxe-table` 内置的方法 `createColumn`，想要创建一个列，就得用这个方法，固定列也不例外~

![](/images/jueJin/0be045dcbdb7476.png)

```js
import { getRowUniqueId, clearTableAllStatus, getRowkey, getRowid, rowToVisible, colToVisible, getCellValue, setCellValue, handleFieldOrColumn, toTreePathSeq, restoreScrollLocation, restoreScrollListener, createColumn } from './util';
```

接着我们需要在`parseColumns` 中去塞入固定列，在这个方法里去塞入，是因为不想污染表格的`columns`数据源，这个`rightList`就是原本代码逻辑计算出的最终右固定列的数据，我们需要判断他有没有长度，有长度说明用户自定义了固定列，没有长度则说明用户没有自定义固定列

*   **用户自定义了固定列，那么我们就不塞了**
*   **用户没有自定义固定列，那我们就塞一个不可见的固定列进去**

![](/images/jueJin/d75feb5d029640a.png)

```js
    if (scrollFollow && rightList && !rightList.length) {
    rightList.push(
    createColumn(
    $xetable,
        {
        align: undefined,
        cellRender: undefined,
        cellType: undefined,
        className: undefined,
        colId: undefined,
        contentRender: undefined,
        editRender: undefined,
        exportMethod: undefined,
        field: '',
        filterMethod: undefined,
        filterMultiple: true,
        filterRecoverMethod: undefined,
        filterRender: undefined,
        filterResetMethod: undefined,
        filters: null,
        fixed: 'right', // 右固定列
        footerAlign: undefined,
        footerClassName: undefined,
        footerExportMethod: undefined,
        formatter: undefined,
        headerAlign: undefined,
        headerClassName: undefined,
        maxWidth: undefined,
        minWidth: undefined,
        params: undefined,
        resizable: null,
        showFooterOverflow: null,
        showHeaderOverflow: null,
        showOverflow: null,
        sortBy: undefined,
        sortType: undefined,
        sortable: false,
        title: '',
        titleHelp: undefined,
        titlePrefix: undefined,
        treeNode: false,
        type: undefined,
        visible: true,
        },
            {
            renderCell: () => null, // 空
            renderHeader: () => null, // 空
            },
            ),
            )
        }
```

但是我们平时在用表格的时候，会发现，固定列会有消失的时候，比如现在水平滚动没有滚动到最右边时，固定列是在的，也就是副表格是在的，我们滚动的时候主表格不会白屏

![](/images/jueJin/d6fd54614f2547d.png)

但是如果水平滑到最右边，我们发现固定列跟主表格融为一体了，也就是副表格不在了，那么这个时候去拖动滚动条，拖的就是主表格的滚动条，白屏现象又出现了！！！

![](/images/jueJin/ffc0611d0522451.png)

我们可不能让这种事发生，我们可以看源码，可以看到渲染固定列是有条件的！

![](/images/jueJin/3924e599561841c.png)

但是，我想要我塞进去的固定列，时时刻刻都渲染，那咋办呢？我可以给固定列的渲染再加一个条件！保证了我塞进去的固定列，时时刻刻渲染！保证我拖动的滚动条时时刻刻都是副表格的！

![](/images/jueJin/9058857769b345b.png)

### 效果

效果达成了！滚动的时候白屏现象没有喽！！！！

![](/images/jueJin/19b3c10615dd425.png)

### 小问题修复（可不改，有需要就改）

发现一个小问题，改源码之后，导致在`动态减列` 的时候，会有一个空白列展示出来了。

![](/images/jueJin/221d9c6591b94c7.png)

其实这个列是原本没改源码前就有的，只不过那时候是不显示出来的，现在改了源码，导致这个列展示出来了，那其实我们可以让他不展示出来即可

**路径：vxe-table/es/table/src/table.js**

想要隐藏列，我们需要隐藏两个东西

*   **header：表头**
*   **body：表体**

可以各自传一个自定义参数`hiddenLastCol`进去

![](/images/jueJin/99c6fbf0d03b4ce.png)

接下来我们要去`header`和`body`组件中，去接受这个参数，并改变样式去隐藏

**路径：vxe-table/es/table/src/body.js**

![](/images/jueJin/b38fb0aa91a445f.png)

![](/images/jueJin/b9fab3b95adb408.png)

**路径：vxe-table/es/header/src/header.js**

![](/images/jueJin/c69d46edf3b44a2.png)

![](/images/jueJin/65ca70da357e4b2.png)

最后需要去定义`col--hidden`的样式就行啦！

**路径：vxe-table/lib/style.css**

![](/images/jueJin/2d95358b1b7847d.png)

### 效果

现在空白列也不会出现啦~

![](/images/jueJin/5c6a70e424fe4cd.png)

滚轮白屏问题 -> mode: 'wheel'
-----------------------

上面是已经解决了拖动滚动条的白屏的问题，但是其实有的电脑硬件比较差，滚动滚动居然也会有白屏现象吗，这个时候可以设置`vxe-table`的`scroll-y="{ mode: 'wheel' }"`去解决这个问题~

遗留问题 && 声明
----------

我的笨方法就是自己塞一个固定列举进去，让主表格滚动白屏问题能得到解决，但是其实固定列自己的滚动白屏还是没有解决，所以我的解法只适用于这些情况

*   有固定列的表格，但是不讲究固定列的白屏问题，只在意主表格的白屏问题
*   不需要固定列的表格

当然我只是提供了一个解决思路而已，并且这个思路可以用在很多表格中，不止是`vxe-table`，各位大佬有什么更好的解法的话，欢迎可以评论区留言，大家一起讨论！！！

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

![image.png](/images/jueJin/ece7d94bdd064b3.png)