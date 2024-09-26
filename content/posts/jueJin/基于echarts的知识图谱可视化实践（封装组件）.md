---
author: "蚌埠张学友"
title: "基于echarts的知识图谱可视化实践（封装组件）"
date: 2020-07-13
description: "公司是做知识图谱领域的，需要展示可视化的知识图谱，在我入职之前后端的小哥哥们写了一套d3版本的知识图谱，代码杂乱无章，各种嵌套，不加工具函数都有1000多行代码，无论从代码性能还是可维护性上说都很不友好。于是，决定重新寻找方案实现这块内容。代码写的杂乱无章不是d3…"
tags: ["React.js"]
ShowReadingTime: "阅读7分钟"
weight: 182
---
1.需求背景
------

*   公司是做知识图谱领域的，需要展示可视化的知识图谱，在我入职之前后端的小哥哥们写了一套 d3 版本的知识图谱，代码杂乱无章，各种嵌套，不加工具函数都有 1000 多行代码，无论从代码性能还是可维护性上说都很不友好。于是，决定重新寻找方案实现这块内容。
*   代码写的杂乱无章不是 d3 的锅，d3 在可视化领域绝对是有一席之地的，但是对于没有接触过 d3 的同学，如果要在此基础上再加上公司的业务逻辑，那绝对是一件令人 egg 疼的事情了，还好，现在有很多开源组件库，可以为开发者提供绝美的生产力工具。
*   选择 echarts，文档清晰，通俗易懂。

2.需求分析
------

原有的知识图谱已经实现的功能，我们不能抛弃，想要替换之前的方案，最起码原有的功能得全部保留。看下功能点：

*   图谱在初始化时都会有一段时间的位置调整动画，这是力引导布局的共性，差别在于如何更快的让节点趋于稳定。（节点很少的时候，基本看不出来差别）
*   节点单击展示节点属性表格，表格内容动态切换
*   节点第一次双击拓展，第二次双击折叠，类似于按钮 toggle 过程。
*   节点右键可出现操作菜单，如删除节点，添加关注点等。
*   放大缩小清空图谱

以上为本次需求的基本功能点。

3.着手实现组件的设计
-----------

前端组件设计原则我们应该尽量遵守，如低耦合，单一原则等等。但是对于公司内部专业开发使用的组件，一般我们都没有做到这么严格。有一个原则是好用，易于维护，大家都看得懂。我在开发这个组件的时候考虑到以下几点：

*   我司后端经常参与前端项目的开发中，他们是否可以看得懂，用的好。
*   后面入职的前端如果要接手这块的内容是不是能很快理解。（以前版本的就很难理解，甚至无法直视）
*   组件应该尽量避免有更多的业务逻辑，假设某次需求要把这个组件拿到另外一个场景使用，是否做到不影响。（老版本不仅参杂复杂业务逻辑，还有 ajax 请求）

4.coding time
-------------

最开始写了一个 react hooks 版本，奈何这块不是很熟悉，开发过程中出现很多 bug，最后放弃，还是选择使用类组件。 组件的 state：

 代码解读

复制代码

`this.state = {             graphData: {                 nodes: [],                 links: []             }, // 数据源             echartInstance: null, // 图谱实体             shrink: [], // 收缩节点             clickNodes: [], // 点击的节点             option: { // 图谱的配置                 tooltip: {                     show: true,                     formatter: "<div style='display:block;word-break: break-all;word-wrap: break-word;white-space:pre-wrap;max-width: 80px'>" + "{b} " + "</div>"                 },                 animationDurationUpdate: 2000,                 animationEasingUpdate: 'quinticInOut',                 series: [{                     type: 'graph',                     layout: 'force',                     symbolSize: 35,                     draggable: true,                     roam: true,                     focusNodeAdjacency: true,                     edgeSymbol: ['', 'arrow'],                     cursor: 'pointer',                     emphasis: {                         itemStyle: {                             borderWidth: 10,                             borderType: 'solid',                             shadowBlur: 20,                             shadowColor: '#eee',                         },                         label: {                             show: true,                             formatter: (record) => {                                 if (record.name.length > 10) {                                     return record.name.substr(0, 5) + '...'                                 } else {                                     return record.name                                 }                             }                         },                         edgeLabel: {                             width: 100                         }                     },                     edgeLabel: {                         normal: {                             show: true,                             textStyle: {                                 fontSize: 14,                                 color: '#fff'                             },                             formatter(x) {                                 return x.data.name;                             }                         }                     },                     label: {                         show: true,                         position: 'bottom',                         color: '#fff',                         formatter: (record) => {                             if (record.name.length > 10) {                                 return record.name.substr(0, 5) + '...'                             } else {                                 return record.name                             }                         }                     },                     force: {                         initLayout: 'circular',                         repulsion: 80,                         gravity: 0.01,                         edgeLength: 180,                         layoutAnimation: true,                         friction: 0.2                     },                     data: [],                     links: []                 }]             },             visible: false, // 右键菜单是否可视             wrapStyle: { // 右键菜单样式                 position: 'absolute',                 width: '100px',                 padding: '5px 0',                 backgroundColor: '#fff',             },             addSource: '', // 右键选中的实体         }`

echarts option 配置占用了 state 大部分位置，这块内容也可以抽出来一个单独的文件。其他 state 涵义可以参照注释了解。 组件的 render 方法：

 代码解读

复制代码

`render() {         const { option, wrapStyle, visible } = this.state;         const { menuData } = this.props;         return (             <div className="relation_graph" style={{ height: '100%' }}>                 <ReactEchart onEvents={this.onclick} ref={this.GraphRef} style={{ height: '100%', width: '100%' }} option={option} />                 <div className="scare_action" style={{ top: this.props.tool.top, left: this.props.tool.left }}>                     <div>                         <Icon onClick={this.add} type="plus-circle" style={{ width: '64px', height: '64px', fontSize: '24px', color: 'rgba(255,255,255,0.65)', lineHeight: '64px', cursor: 'pointer' }}></Icon>                     </div>                     <div>                         <Icon onClick={this.decrese} type="minus-circle" style={{ width: '64px', height: '64px', fontSize: '24px', color: 'rgba(255,255,255,0.65)', lineHeight: '64px', cursor: 'pointer' }}></Icon>                     </div>                     <div>                         <Icon onClick={this.clearGraph} type="redo" style={{ width: '64px', height: '64px', fontSize: '24px', color: 'rgba(255,255,255,0.65)', lineHeight: '64px', cursor: 'pointer' }}></Icon>                     </div>                 </div>                 {                     visible ? <div onClick={this.clickMenu} className="contextMenu" style={wrapStyle}>                         {                             menuData && menuData.length > 0 ? menuData.map(item => <p key={item.id}>{item.name}</p>) : null                         }                     </div> : null                 }             </div>         )     }`

这里绘制图谱部分使用了基于 echarts 封装的 react 组件库 echarts-for-react,还有部分图标依赖的 antd 组件库，事实上真正要做到低耦合最好别这样做，可以选择原生 echarts 和 svg 图标。因为我们的系统都是基于 antd 开发的，所以这里就直接用 antd 提供的组件。 在 componnetDidMount 生命周期内，初始化图谱实例，删除浏览器原生的 contextmenu，调用 setOption 函数初始化图谱数据：

 代码解读

复制代码

`componentDidMount() {         let echartInstance = this.GraphRef.current.getEchartsInstance(), that = this;         // 取消正常浏览器默认右键菜单         this.GraphRef.current.echartsElement.oncontextmenu = () => {             return false         }         // 点击空白处 删除右键菜单         this.GraphRef.current.echartsElement.onclick = function () {             that.setState({                 visible: false             })         }         this.setState({             echartInstance         })         this.setStyle(this.props.graphData)         echartInstance.setOption({             series: {                 data: this.props.graphData.nodes,                 links: this.props.graphData.links             }         })     }`

当父组件 graphData 改变，子组件如何监听并且重新渲染，在子组件生命周期内判断：

 代码解读

复制代码

 `componentWillReceiveProps(nextProps) {         if (JSON.stringify(nextProps.graphData) !== JSON.stringify(this.props.graphData)) {             this.setStyle(nextProps.graphData)             this.state.echartInstance.setOption({                 series: {                     data: nextProps.graphData.nodes,                     links: nextProps.graphData.links                 }             })         }     }`

在 ReactEcharts 组件上绑定事件：

 代码解读

复制代码

 `onclick = {         'click': this.clickEchartsPie.bind(this),         'dblclick': this.dblclickPie.bind(this),         'contextmenu': this.rightMouse.bind(this),  }`

图谱单击事件:

 代码解读

复制代码

    `clickEchartsPie(e) {         if (e.dataType !== 'node') {             return         }         this.props.clickCallback(e)     }`

属性展示往往会自定义样式，所以这里不应该在组件内部封装表格，而是将节点信息返回给父组件，在父组件定义展示属性，这样可以方便自定义表格。 图谱双击事件：

 代码解读

复制代码

    `dblclickPie(e) {         let { echartInstance, clickNodes, shrink } = this.state;         if (e.dataType !== 'node') {             return         }         if (clickNodes.includes(e.data.id)) {             if (shrink.includes(e.data.id)) {                 let index = shrink.findIndex(item => item == e.data.id);                 shrink.splice(index, 1)             } else {                 shrink.push(e.data.id)             }             this.setState({                 shrink             })             let nodes = this.props.graphData.nodes;             let links = this.props.graphData.links;              if (shrink.length > 0) {                 for (let i in shrink) {                     nodes = nodes.filter(function (d) {                         return d.labels.indexOf(shrink[i]) == -1;                     });                     links = links.filter(function (d) {                         return d.labels.indexOf(shrink[i]) == -1;                     });                 }             }             echartInstance.setOption({                 series: {                     data: nodes,                     links                 }             })         } else {             clickNodes.push(e.data.id)             this.setState({                 clickNodes             })             this.props.dblCallback({                 entityId: e.data.id,                 entity: e.data             })         }     }`

定义点击的节点和要收缩的节点数组，在下一次点击的时候判断要收缩的节点，通过每个 node 和 link 中 labels 属性进行过滤，找出之前新增的 node 和 link，至于节点的 labels 属性会在父组件调用的时候添加。 鼠标右键：

 代码解读

复制代码

`rightMouse(e) {         let { wrapStyle } = this.state;         if (e.dataType !== 'node') {             return;         }         let event = e.event.event;         const pageX = event.pageX - 20;         const pageY = event.pageY;          this.setState({             wrapStyle: Object.assign({}, wrapStyle, { left: pageX + 'px', top: pageY + 'px' }),             visible: true,             addSource: e.data         })     }`

放大，缩小，清空：

 代码解读

复制代码

    `add = () => {         let { echartInstance } = this.state;         let zoom = echartInstance.getOption().series[0].zoom;         const addNum = 0.2;         zoom += addNum         echartInstance.setOption({             series: {                 zoom             }         })      }    decrese = () => {         let { echartInstance } = this.state;         let zoom = echartInstance.getOption().series[0].zoom;         const addNum = 0.2;         zoom -= addNum         echartInstance.setOption({             series: {                 zoom             }         })     }     clearGraph = () => {         const { echartInstance } = this.state;         echartInstance.setOption({             series: {                 data: [],                 links: []             }         })     }`

右键菜单点击返回给父组件子组件的操作：

 代码解读

复制代码

`clickMenu = (e) => {         const { addSource } = this.state;         let param = {             target: e.target.innerHTML,             entity: addSource         }         this.props.clickMenuCallback(param) }`

6.父组件调用
-------

 代码解读

复制代码

  `export default class Dashboard extends React.Component {     constructor(props) {         super(props)         this.state = {             originNodeId: 'xxxxxx',//原节点id             graphData: {                 nodes: [],                 links: []             },             clickNodes: [],             tool: {                 left: '90%',                 top: '600px'             },             menuData: [                 {                     name: '添加关注点',                     id:1                 },                 {                     name: '删除节点',                     id: 2                 }             ]         }     }      componentDidMount() {         queryRelationGraph({ id: this.state.originNodeId }).then(res => {             let nodes = res.data.data.nodes;             if (nodes && nodes.length > 0) {                 nodes = nodes.map(item => {                     if (item.id !== this.state.originNodeId) {                         return { ...item, category: 1, labels: this.state.originNodeId }                     } else {                         return { ...item, category: 1, labels: 'origin' }                     }                 })             }             let links = res.data.data.links;              if (links && links.length > 0) {                 links = links.map(item => {                     return { ...item, name: item.ooName, labels: this.state.originNodeId }                 })             }             res.data.data.links = links;             res.data.data.nodes = nodes;              this.setState({                 graphData: res.data.data,                 clickNodes: [this.state.originNodeId]             })         })     }     dblClick = (param) => {         let { graphData } = this.state;         queryRelationGraph({ entity_id: param.entityId }).then(res => {             let selectNode = param.entity;             let nodes = res.data.data.nodes;             if (nodes && nodes.length > 0) {                 nodes = nodes.map(item => {                     return { ...item, category: 1, labels: selectNode.labels + ',' + selectNode.id }                 })             }             let links = res.data.data.links;             if (links && links.length > 0) {                 links = links.map(item => {                     return { ...item, name: item.ooName, labels: selectNode.labels + ',' + selectNode.id }                 })             }             res.data.data.links = links;             res.data.data.nodes = nodes;              let oldNodes = graphData.nodes;             let oldLinks = graphData.links;              let newNodes = nodes;             let newLinks = links;              oldNodes = oldNodes.concat(newNodes);             let nodeObj = {}             oldNodes = oldNodes.reduce((pre, next) => {                 nodeObj[next.id] ? "" : nodeObj[next.id] = true && pre.push(next)                 return pre;             }, [])              oldLinks = oldLinks.concat(newLinks)             let linksObj = {};             oldLinks = oldLinks.reduce((pre, next) => {                 linksObj[next.id] ? "" : linksObj[next.id] = true && pre.push(next)                 return pre;             }, [])             this.linkMark(oldLinks)             this.setState({                 graphData: Object.assign({}, graphData, { nodes: oldNodes, links: oldLinks }),             }, () => {             })         })     }     // 对links重复的关系进行打标     linkMark = (links) => {         let linkGroup = {};         //对连接线进行统计和分组，不区分连接线的方向，只要属于同两个实体，即认为是同一组         let linkmap = {};         for (let i = 0; i < links.length; i++) {           if (typeof links[i].source == "string" || typeof links[i].target             == "string") {             var key = links[i].source < links[i].target ? links[i].source + ':'               + links[i].target : links[i].target + ':' + links[i].source;           } else {             var key = links[i].source.id < links[i].target.id ? links[i].source.id               + ':' + links[i].target.id : links[i].target.id + ':'               + links[i].source.id;           }           if (!linkmap.hasOwnProperty(key)) {             linkmap[key] = 0;           }           linkmap[key] += 1;           if (!linkGroup.hasOwnProperty(key)) {             linkGroup[key] = [];           }           linkGroup[key].push(links[i]);         }         for (let i = 0; i < links.length; i++) {           if (typeof links[i].source == "string" || typeof links[i].target == "string") {             var key = links[i].source < links[i].target ?               links[i].source + ':' + links[i].target               :               links[i].target + ':' + links[i].source;           } else {             var key = links[i].source.id < links[i].target.id ? links[i].source.id               + ':' + links[i].target.id : links[i].target.id + ':'               + links[i].source.id;           }           links[i].size = linkmap[key];           // 同一组的关系进行编号           let group = linkGroup[key];           // 给节点分配编号           setLinkNumber(group);         }         function setLinkNumber(group) {           if (group.length == 0) {             return;           }           if (group.length == 1) {             group[0].linknum = 0;             return;           }           group.forEach((item, index) => {              item.linknum = index           })         }     }     clickGraph = (param) => {         // console.log(param, 'param')     }     clickMenu = (param) => {         console.log(param)     }     render() {         const { graphData, tool, menuData } = this.state;         return (             <div className="Dashboard">                {                    Object.values(graphData)[0].length > 0 || Object.values(graphData)[1].length > 0 ? <MyRelationGraph                    graphData={graphData}                    dblCallback={this.dblClick}                    clickCallback={this.clickGraph}                    tool={tool}                    clickMenuCallback={this.clickMenu}                    menuData={menuData}                 /> : null                }              </div>         )     } }`

7.结语
----

\-大家有不懂的可以留言，代码已经全部在这里。勤于思考，善于变通，条条大路通北京，祝大家都能升职加薪。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb8878b6d58346aeb8dd66b070a875eb~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) ![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43633f84afb44c50a8fceac01215512d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

本文使用 [mdnice](https://link.juejin.cn?target=https%3A%2F%2Fmdnice.com%2F%3Ffrom%3Djuejin "https://mdnice.com/?from=juejin") 排版