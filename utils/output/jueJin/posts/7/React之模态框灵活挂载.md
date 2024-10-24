---
author: "政采云技术"
title: "React之模态框灵活挂载"
date: 2024-05-08
description: "React之模态框灵活挂载 那些年所受的苦 在开发过程中，我们会经常遇到模态框；例如：组件库中的 Modal 和 Drawer ，或者自定义弹窗组件。这些模态框，你们平常是怎么使用的呢？不知道大家是否"
tags: ["前端","React.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:9,comments:0,collects:14,views:3900,"
---
![文章顶部.png](/images/jueJin/b637793da67b4e0.png) ![烟阑.png](/images/jueJin/bbad76750335477.png)

React之模态框灵活挂载
-------------

### 那些年所受的苦

在开发过程中，我们会经常遇到模态框；例如：组件库中的 `Modal` 和 `Drawer` ，或者自定义弹窗组件。这些模态框，你们平常是怎么使用的呢？不知道大家是否也跟我一样，会遇到以下几个痛点。

我们先看一个简单的案例：

![list.jpg](/images/jueJin/f4ccfdbcfc55462.png)

![modal.jpg](/images/jueJin/84de591820b4474.png)

```typescript
import React, { useState } from "react";
import { Table } from "antd";
import UserModal from "../UserModal";
import { creatColumns } from './config'
​
    const UserTable = () => {
    const [data, setData] = useState<Array<any>>([])
    const [visible, setVisible] = useState<boolean>(false);
    const [curData, setCurData] = useState<any>({});
    
        const openModal = (record: any) => {
        setCurData(record);
        setVisible(true);
        };
        
            const editHandle = (values: any) => {
                setData(list => {
                    return list.map(item => {
                    if (item.id !== values.id) return item;
                    return values;
                    })
                    });
                    setVisible(false);
                    };
                    
                        const deleteHadle = (id: string) => {
                            Modal.confirm({
                            title: '确认删除当前数据',
                            cancelText: '取消',
                            okText: '删除',
                            onOk: () => setData(data.filter(item => item.id !== id))
                            })
                        }
                        ​
                        return (
                        <>
                        <Table rowKey="id" columns={creatColumns({ edit: openModal, delete: deleteHadle })} dataSource={data} />
                    {visible && <UserModal data={curData} onCancel={() => setVisible(false)} onSave={editHandle} />}
                    </>
                    );
                    };
                    export default UserTable;
```

上述代码，使用一个自定义的 `Modal` 来编辑表格数据，却需要以下三种依赖：

0.  需要定义 `visible` 变量，用于控制模态框组件是否加载。
1.  操作表格数据时，需要定义 `curData` 变量接收表格数据并传递给模态框。
2.  需要定义 `editHandle` 回调函数，用于响应模态框的回调。

一个模态框需要依赖三个变量，那如果页面存在很多个模态框，将会以三的倍数产生 3n 个变量。在项目后期迭代中，经常遇见上千行代码量的文件；模态框依赖的变量以及代码比较分散问题，将会导致代码阅读成本增高。难道模态框些问题没有办法解决吗？如果可以用函数式去创建模态框，例如 Modal.confirm 方法一样去处理，是不是瞬间感觉很“爽”。

### 实现函数式创建模态框

“只要思想不滑坡，办法总比困难多”；本着这种信念，就一定能找到的解决方案。在实现函数式创建模态框之前，我们先分析并列出实现需求的步骤：

**1、如何实现模态框组件在真实 DOM 节点上的挂载与卸载？**

在 react-dom API 中，可以通过 [`render`](https://link.juejin.cn?target=https%3A%2F%2Fzh-hans.legacy.reactjs.org%2Fdocs%2Freact-dom.html%23render "https://zh-hans.legacy.reactjs.org/docs/react-dom.html#render") 方法来挂载节点，通过 [`unmountComponentAtNode`](https://link.juejin.cn?target=https%3A%2F%2Fzh-hans.legacy.reactjs.org%2Fdocs%2Freact-dom.html%23unmountcomponentatnode "https://zh-hans.legacy.reactjs.org/docs/react-dom.html#unmountcomponentatnode") 方法来卸载节点。（React 18 版本后，两个方法已经被取代）

**2、模块组件可能存在多个模态框，怎么保证卸载指定的模态框？**

函数内部维护模态框的标识对象，使用创建模态框的时间戳作为唯一标记，然后通过标记去卸载指定的模态框以及移除对象上的标识。

**3、模块组件销毁时，怎么销毁模块组件上的模态框？**

利用模块组件的销毁钩子来处理模态框的卸载，因此可以自定义 hooks 来封装模态框的挂载和卸载，利用 useEffect 来自动触发销毁函数。

**4、hooks 的参数如何处理，自定义模态框组件应该如何遵循约定？**

*   将导入的模态框组件直接传给 hooks，并在内部构建实例和挂载。
*   模态框需要的数据，在 hooks 直接定义并透传给模态框。
*   hooks 可接收 `onCancel` 和 `onOk` 两个回调函数，用于模态框内部“取消”和“确定”按钮的回调，并且执行卸载模态框操作。
*   自定义模态框组件的 props 接收 `onCancel` 和 `onOk` 两个回调函数，且 `onOk` 回调可以将模态框的数据传递出去。

经过上面各条件的分析，以及对代码的不断优化，函数式创建模态框的 hooks 诞生：

```typescript
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
​
    interface IDoms {
    [key: string]: HTMLElement
}
​
    interface IParams {
    Component: React.FC<any> | any;
    [propsKeys: string]: any;
    onCancel?: () => void;
    onOk?: (arg?: any) => void;
}
​
/**
* @function useReactDomRender
* @param { boolean } autoDestruct 是否自动销毁
* @description 创建和清除节点，该hooks使得Modal、Drawer等模态框更为方便使用。
* @returns clearNodes, createNode
*/
    export const useReactDomRender = (autoDestruct: boolean = true) => {
    const doms = useRef<IDoms>({});
    ​
        useEffect(() => () => {
        if (autoDestruct) clearNodes();
        }, []);
        ​
        /**
        * @function clearNodes
        * @description 清除所有节点
        */
            const clearNodes = () => {
            Object.keys(doms.current).forEach(ele => clearNode(ele));
            };
            ​
            /**
            * @function clearNode
            * @param { string } [ key ] 标识
            * @description 清除标识节点
            */
                const clearNode = (key: string) => {
                ReactDOM.unmountComponentAtNode(doms.current[key]);
                doms.current[key] = undefined;
                };
                ​
                /**
                * @function createNode
                * @param { any } Component 自定义模态框组件
                * @param { function } onCancel 取消回调函数
                * @param { function } onOk 确定回调函数
                * @param { any } [ propsKeys ] 自定义模态框组件的 props 传参
                * @description 创建节点
                */
                    const createNode = (arg: IParams) => {
                    const { Component, onCancel, onOk, ...props } = arg;
                    const div = document.createElement('div');
                    const times = new Date().getTime().toString();
                    doms.current[times] = div;
                        const cancelBack = () => {
                        onCancel && onCancel();
                        clearNode(times);
                    }
                        const okBack = (arg: any) => {
                        onOk && onOk(arg);
                        clearNode(times);
                    }
                    ReactDOM.render(<Component { ...props } onCancel={cancelBack} onOk={okBack} />, div);
                    };
                    ​
                        return {
                        clearNodes,
                        createNode
                        };
                        };
```

看待事物每个人都会有不同的观念， `useReactDomRender` 是我对业务的理解后的冒泡想法，通过多次迭代形成的产物。当然，我相信 `useReactDomRender hooks` 还有优化空间，也不一定适用于所有的业务情况，所以各位读者可以根据自己的业务线场景进行本地化处理。

有了上面 `useReactDomRender hooks` 的加持，之前的案例就简单多了，改写后的代码：

```typescript
import React, { useState } from "react";
import { Table } from "antd";
import UserModal from "../UserModal";
import { creatColumns } from './config'
import { useReactDomRender } from '../../hooks'
​
    const UserTable = () => {
    const [data, setData] = useState<Array<any>>([])
    const reactDom = useReactDomRender();
    
        const editHandle = (record: any) => {
            reactDom.createNode({
            Component: UserModal,
            data: record,
                onOk: values => {
                    setData(list => {
                        return list.map((item) => {
                        if (item.id !== values.id) return item;
                        return values;
                        })
                        });
                    }
                    })
                    };
                    ​
                    return <Table rowKey="id" columns={creatColumns({ edit: editHandle})} dataSource={data} />;
                    };
                    export default UserTable;
```

但 `UserModal` 组件必须遵循 `useReactDomRender hooks` 的约定，所以会有一下条件：

0.  Modal 的 `visible` 属性不再管控模态框的显隐，默认 `true`
1.  Modal 的 `onCancel` 执行的是 props 中的 `onCancel`
2.  Modal 的 `onOk` 执行的是 props 中的 `onOk`，`onOk` 可以接收一个参数

```ini
import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber } from "antd";
​
    const UserModal = (props: any) => {
    const { data, onCancel, onOk } = props;
    const [ form ] = Form.useForm();
    
    useEffect(() => form.setFieldsValue(data), [])
    
        const onSubmit = async () => {
        const values = await form.validateFields();
        onOk({ ...props.data, ...values });
    }
    ​
    return (
    <Modal
    visible
    title="用户信息编辑"
onCancel={onCancel}
onOk={onSubmit}
>
<Form form={form}>
......
</Form>
</Modal>
);
};
export default UserModal;
​
```

### 类组件如何应用

`useReactDomRender` 是一个 hooks，显然不可能在类组件使用，当然我相信这点难不倒各位大神。我想到的是“高阶组件”，给类组件再套一个函数组件，将 `useReactDomRender` 的返回值通过 props 传递给类组件。

```typescript
/**
* @function ReactDomRenderHOC
* @description 创建和清除DOM实例的高阶组件, 解决类组件使用hooks问题。
*/
    export const ReactDomRenderHOC = (Component: any) => {
        return function HOC(props: any) {
        const reactDom = useReactDomRender();
        return <Component reactDom={reactDom} {...props} />;
        };
        };
```

代码示例如下：

```typescript
import React, { Component } from 'react'
import { Table } from "antd";
import UserModal from "../UserModal";
import { creatColumns } from './config'
import { ReactDomRenderHOC } from '../../hoc'
​
    class UserTable extends Component<any> {
state = { data: [] }

    editHandle = (record: any) => {
    const { reactDom } = this.props;
        reactDom.createNode({
        Component: UserModal,
        data: record,
            onOk: (values: any) => {
                this.setState((state: any) => {
                    return {
                        data: state.data.map((item: any) => {
                        if (item.id !== values.id) return item;
                        return values;
                        })
                    }
                    })
                }
                })
                };
                ​
                    render() {
                    const { data } = this.state;
                    return <Table rowKey="id" columns={creatColumns({ edit: this.editHandle})} dataSource={data} />;
                }
                };
                export default ReactDomRenderHOC(UserTable);
```

### 技术分享尾声

`useReactDomRender hooks` 对模态框的使用确实省去很多麻烦，也让代码变得更加简洁优雅，希望该 hooks 也能得到大家的支持。如果大家已经有处理模态框问题的方案，可以评论在下面，好东西要一起分享。

推荐阅读
----

[测试用例设计心得](https://juejin.cn/post/7319541608491679795 "https://juejin.cn/post/7319541608491679795")

[MySQL 索引的底层逻辑](https://juejin.cn/post/7319181149792469030 "https://juejin.cn/post/7319181149792469030")

[队列和栈](https://juejin.cn/post/7317325003765891081 "https://juejin.cn/post/7317325003765891081")

[ASM 字节码增强](https://juejin.cn/post/7316592697463521306 "https://juejin.cn/post/7316592697463521306")

[浅谈表单受控性及结合Hooks应用](https://juejin.cn/post/7314587257956827186 "https://juejin.cn/post/7314587257956827186")

招贤纳士
----

政采云技术团队（Zero），Base 杭州，一个富有激情和技术匠心精神的成长型团队。规模 500 人左右，在日常业务开发之外，还分别在云原生、区块链、人工智能、低代码平台、中间件、大数据、物料体系、工程平台、性能体验、可视化等领域进行技术探索和实践，推动并落地了一系列的内部技术产品，持续探索技术的新边界。此外，团队还纷纷投身社区建设，目前已经是 google flutter、scikit-learn、Apache Dubbo、Apache Rocketmq、Apache Pulsar、CNCF Dapr、Apache DolphinScheduler、alibaba Seata 等众多优秀开源社区的贡献者。

如果你想改变一直被事折腾，希望开始折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊……如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的技术团队的成长过程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 [zcy-tc@cai-inc.com](https://link.juejin.cn?target=mailto%3Azcy-tc%40cai-inc.com "mailto:zcy-tc@cai-inc.com")

微信公众号
-----

文章同步发布，政采云技术团队公众号，欢迎关注 ![文章顶部.png](/images/jueJin/aaafc13f1d1e414.png)