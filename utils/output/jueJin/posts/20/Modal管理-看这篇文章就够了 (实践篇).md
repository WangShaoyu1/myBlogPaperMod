---
author: ""
title: "Modal管理-看这篇文章就够了 (实践篇)"
date: 2023-12-22
description: "“别再弹框了，每次都是弹框，弹框套弹框用户怎么用啊？” “OK OK，不用弹框你说用什么？” 上述对话在无数个场景下重复发生，也侧面说明在中台项目开发过程中"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:85,comments:25,collects:103,views:3473,"
---
这是我们团队号工程化系列文章的第 3 篇，全系列文章如下:

*   [字节三年，谈谈一线团队如何搞工程化一（全景篇）](https://juejin.cn/post/7311596602249134106 "https://juejin.cn/post/7311596602249134106")
*   [⚡️卡顿减少 95% — 记一次React性能优化实践（性能篇）](https://juejin.cn/post/7314493192187265074 "https://juejin.cn/post/7314493192187265074")

> 团队尚有HC，感兴趣的小伙伴可以私信~（注明期望岗位城市：北京、上海、杭州）

![](/images/jueJin/39b5a93fb4a3438.png)  
  
  

前言
==

“别再弹框了，每次都是弹框，弹框套弹框用户怎么用啊？”

“OK OK，不用弹框你说用什么？”

上述对话在无数个场景下重复发生，也侧面说明在中台项目开发过程中，模态框（`Modal`、`Drawer` 等）元素在各业务系统中随处可见，受到广大产品/设计同学的偏爱，我们前端研发同学对它也是“又爱又恨”，即依赖它解决问题又被随之提升的代码复杂度提升所困扰。这里有同学就会说了，明明是一个基础组件，使用方法也简单，有啥“复杂度”可言？

![](/images/jueJin/b78c4df386964af.png)

OK OK，那我们接着往下看～

  

Modal 三宗罪
=========

让我们从一个实际的业务需求出发，分析一下对着 Modal 组件直接撸代码会有哪些问题。

![](/images/jueJin/abf5656f77aa4e5.png)

假设设计稿有以下几个需求点：

1.  点击审批工单按钮，拉起 `Modal` 弹窗
    
2.  弹窗需要展示当前工单的基本信息，以及审批状态
    
3.  弹窗支持填写备注
    
4.  弹窗支持通过/拒绝
    

  

当这样一个需求扔过来，基本所有前端都能直接秒了：

```tsx
const [visible, setVisible] = useState(false)
const [posting, setPosting] = useState(false)
const [record, setRecord] = useState({})
const [form] = Form.useForm()

const handleOk = () => {...}

return <div>
<Button onClick={() => }>{...}</Buton>

<Modal visible={visible} confirmLoading={posting} {...}>
<div>{record.title}</div>
<Form form={form}>
<Form.Item><Input /></Form.Item>
</Form>
</Modal>
</div>
```

所以我们把需求调整一下，依然是常见的业务需求，实际代码开发难度还是不高-用上面的逻辑继续搬砖就行，不过这时候一些问题就逐渐暴露出来了。

![](/images/jueJin/4a06cd0ca10040e.png)  

其实每个弹窗的复杂度都不高，但是如果将所有逻辑都堆积在主组件中，将引发以下 3 个问题。

污染业务代码，状态管理复杂
-------------

> 状态越加越多，而且这些状态都与主流程无关

通过分析示例代码不难发现，为了实现这个业务模态框，直接在组件中引入了 `visible`、`record`、`posting` 共 3 个状态，以及一个 `form` 实例。可实际上，对于主流程来说，审批流程只是一个分支，唯一所需的交互不过是审批完成后刷新工单状态。

当同一个页面存在多个模态框时，还需要手动管理每一个的状态，包括不能同时展示多个、控制的状态不能互相影响、设置状态的顺序等。再加上新增的这些状态如果与主组件有交互，将直接提升代码的维护难度。

**可以说一个组件维护的状态越多，它的维护成本自然也会增多。**

  

性能问题大，容易引发业务代码、弹层内重复渲染
----------------------

> 每次弹窗组件状态变更，都会导致页面所有组件重新渲染

由于所有状态都维护在主组件，任何变动都将导致整个页面的重新渲染：

*   主组件的状态更新引起所有子组件的重新渲染（即使 `visible` 是 false）
*   子组件的状态更新也会同步到主组件，主组件整体重新渲染

由于 `visible` 只控制 `Modal`，而不控制 `Modal` 的子组件，所以即使 `visible` 为 false，`Modal` 的子组件依然可能影响性能。

```tsx
<Modal visible={visible}>
<LargeComponent />
</Modal>
```  

逻辑割裂，弹层内外的逻辑联动性差
----------------

> 模态框从交互上创建了独立的工作流，也从代码逻辑上带来了割裂感

在实际开发中，开发者会将较为复杂或者可复用的 `Modal` 内容组件进行封装，比如 `ApproveForm`，但是封装后就会面临一个问题，即 `Modal` 和 `ApproveForm` 没有良好的通信机制。

比如点击 `Modal` 提交按钮，如何获取 `ApproveForm` 的表单状态？同时，`visible` 属性只是控制 `Modal` 的，在不额外控制的情况下，`Modal` 的生命周期和 `ApproveForm` 的生命周期是独立的：

*   `ApproveForm` 默认会执行初始化逻辑，即使此时 `visible` 还是 false
*   `ApproveForm` 永远不会走到销毁状态，无法在关闭弹窗的时候清除内部状态

  

优雅体操管理
======

牛刀小试
----

### 状态多？那就合并!

通过将一个弹窗所需的相关状态合并到对象中，既直接减少了状态量，同时也可避免一个个设置状态可能带来的额外理解成本，降低误操作的可能性。

```tsx
    const [editModalInfo, setEditModalInfo] = useState({
    visible: false,
    posting: false,
    record: {},
    })
    
    <Modal visible={editModalInfo.visible} {...}>
    <Edit detail={editModalInfo.record} {...} />
    </Modal>
```

### 逻辑割裂？还是合并!!

既然 `Modal` 组件与内容组件通信困难，不如直接将他们合并封装为一个组件，这总没问题了吧～

```tsx
    const [editModalInfo, setEditModalInfo] = useState({
    visible: false,
    posting: false,
    record: {},
    })
    
const handleOk = () => {...}

<EditModal visible={editModalInfo.visible} record={editModalInfo.record} onOk={handleOk} {...} />
```

还可以把 `posting` 等内部属性移到 `EditModal` 组件内部管理，如此主组件又少维护了一个状态。

```tsx
// EditModal.tsx
    const handleOk = () => {
    // 先处理内部逻辑，再调用传入的onOk
    setPosting(true)
    // do something
    await props.onOk(...)
    
    setPosting(false)
}

<Modal {...} onOk={handleOk} />
```

封装为 EditModal 之后，前面说的生命周期的问题就会再度出现，即 EditModal 的 visible 为 false 时，依然会执行初始化逻辑，但是通常这个时候一些必填参数是拿不到的-通常再 visible 为 true 的时候一起传入，同样还会出现性能问题，或者弹窗关闭时无法清除状态的问题。

这种情况下，可以加个 HOC，直接在 visible 为 false 时销毁这个业务弹窗，轻松解决这些问题。

```tsx
// visible改变时直接销毁组件，不需要维护生命周期
    export const oneTimeHoc = <Props extends Record<string, any>>(Component: React.FC<Props>) => {
        return (props: Props & { visible?: boolean }) => {
        return props?.visible !== false ? <Component {...props} /> : null
    }
}

// EditModal.tsx
export default oneTimeHoc(EditModal) // 此时EditModal的入参需要移除visible
```

### 还复杂？那就继续合并!!!

如果有多个弹窗组件，那么还是需要维护多份`xxxModalInfo`状态以及实例化多个`XxxModal`组件，有几个弹窗就得维护几组状态，复杂度仍然很高，怎么办？那就加个中间层！

新增 `ActionModal` 链接主组件与对应的多个业务 `Modal`，这样主组件只需要维护一个大状态-一般情况下同一时间只会存在一个激活的 `Modal`，通过 `ActionModal` 再来做一层转发，成功将代码复杂度分散，从而降低主组件的维护复杂度。

```typescript
// index.tsx
    const [modalInfo, setModalInfo] = useState({
    type: '', // edit | update | approve
    visible: false,
    modalProps: {},
    })
    
    return <>
    <ActionModal modalInfo={modalInfo} />
    </>
    
    // ActionModal.tsx
    const { type, visible, modalProps } = props
    
    if (!visible) return null
    return <>
    {type === 'edit' && <EditModal {...modalProps} />
    {type === 'update' && <UpdateModal {...modalProps} />
    </>
```

### 小结

以上可以看作我们日常开发中解决问题的常见手段，确实能解决部分问题，但是显得有些治标不治本，不管怎么样，最终在主组件中依然依然需要管理弹窗的 `visible` 状态。

其实在多数场景下，都是由用户交互（如点击按钮）才唤起弹窗，那是否可以进一步，把交互元素（如按钮）与弹窗组件封装到一起，设计一种更为定制化的解决方案。

进阶技巧
----

### 初春 - Trigger 封装

对于主页面需要管理 visible 的问题，可通过`cloneElement`对指定元素进行拓展，屏蔽主页面对`visible`的感知。

实现思路比较简单，主要给传入的元素加个`onClick`属性，用来控制`visible`展示，然后在`onOk`的时候控制`visible`关闭。

```tsx
// TriggerModal.tsx
const { children, trigger } = props
const [visible, setVisible] = useState(false)

    const onClick = () => {
    setVisible(true)
}

    const handleOk = async () => {
    // do something
    setVisible(false)
}

return <>
{React.cloneElement(trigger, { onClick })}

<Modal {...} visible={visible} onOk={handleOk} />
</>

// index.tsx
return <>
<TriggerModal trigger={<Button />}> // 仅拓展Modal
{...}
</TriggerModal>
// 封装业务逻辑：EditModal = TriggerModal + 业务逻辑
// <EditModal trigger={<Button />} />
</>
```

**优点**：结合触发的元素一起封装，逻辑更内聚，适合特定业务场景（如审批按钮）

**缺点**：使用限制较大，不是通用的解决方案

  

### 半夏 - Ref 管理

对于在父组件中操作子组件状态这种事情，我们自然而然的就会想到使用 `ref`，下面就让我们来看看要怎么用 `ref` 实现。

```tsx
// EditModal.tsx
const [visible, setVisible] = useState(false)
const modalPropsRef = useRef({})

    useImperativeHandle(ref, {
        open: (props) => {
        modalPropsRef.current = props
        setVisible(true)
        },
        close: () => setVisible(false),
        })
        
        return <Modal {...} visible={visible} onOK={modalPropsRef.current?.onOk} />
        
        // index.tsx
        const editModalRef = useRef(null)
        
        editModalRef.current.open(props)
        editModalRef.current.close()
        
        return <>
        <EditModal {...} ref={editModalRef} />
        </>
```

**优点**：简单好使，理解成本低

**缺点**：限定了父子组件的实现逻辑以及调用方式，用起来不够优雅

  

### 秋实 - Hook 调用

在方案三`ref`的基础上，优化调用方式，从`ref.current.open`优化成`hook`返回的函数调用，即`Modal.useModal`的返回值`modal.open`，各组件库已经提供`modal.confirm`等函数，但是没有`open`，我们可以简单封装一下：

```tsx
// useNextModal.tsx 随便起的名字，别在意
const [modal, context] = Modal.useModal()
const [visible, setVisible] = useState(false)
const modalPropsRef = useRef({})

    const nextModal = {
    // 已有，直接用
        confirm: (props) => {
        return modal.confirm(props)
        },
        // 自行封装
            open: (props) => {
            modalPropsRef.current = props
            setVisible(true)
            },
        }
        
            const modalRender = () => {
            if (!visible) return null
            return <Modal {...modalPropsRef.current}  visible={visible} />
        }
        
    return { nextModal, context, content: modalRender() }
    
    // index.tsx
    const { nextModal, context, content } = useNextModal()
    
    nextModal.open(...)
    nextModal.confirm(...)
    
    return <>
    {context} // modal.confirm的上下文
    {content} // modal.open的dom
    </>
```

**优点**：简单好使，调用方式更直接

**缺点**：仅适合较简单的场景；`hook`返回了 DOM，有点争议

  

**不返回** **DOM** **的 Hook**

```javascript
const { formProps, modalProps } = useFormModal()

return <>
<Modal {...modalProps}>
<Form {...formProps} />
</Modal>
</>
```  

### 瑞雪 - Modal 与 Form 完美结合

在中后台场景中，经常遇到弹窗与表单结合的功能，此时除了基础的弹窗管理之外，需要额外考虑表单管理的问题。以 `antd` 的 `form` 为例，我们通常会用以下方式之一组织代码：

1.  主页面管理 `form` 实例，并通过参数传递给弹窗子组件
    
2.  弹窗子组件内部维护 `form` 实例，通过回调将表单的值暴露出去
    

#### **管理 form 实例**

```tsx
// index.tsx
const [form] = Form.useForm()
const [visible, setVisible] = useState(false)

    const handleOk = async () => {
    const values = await form.validateFields()
    await service.submit(values)
    setVisible(false)
}

    const handleOpen = () => {
    form.setFieldsValue({ ... }) // 灵活控制form
    setVisible(true)
}

return <>
<Button onClick={handleOpen}>Open</Button>
<EditModal visible={visible} onOk={handleOk} form={form} />
</>

// EditModal.tsx
const { form, visible, onOk } = props

return <Modal visible={visible} onOk={onOk}>{...}</Modal>
```

**优点**：使用简单，方便使用 `form` 管理弹窗组件内的表单

**缺点**：主页面需要多维护一个 `form` 实例，有一定复杂度

  

**优化一下**

在仍支持主页面控制 `form` 的前提下，将一部分逻辑放到弹窗组件内部处理，减少主页面的代码量。

```tsx
// index.tsx
    const handleOk = async (values) => {
    await service.submit(values)
    setVisible(false)
}

// EditModal.tsx
const { form: outerForm, visible, onOk } = props
const [form] = Form.useForm(outerForm)

    const handleOk = async () => {
    const values = await form.validateFields() // 尽量把类似的逻辑放在弹窗组件内部
    onOk?.(values)
}

return <Modal visible={visible} onOk={handleOk}>{...}</Modal>
```

最佳实践 - useFormModal
-------------------

回到最开始举的例子，如果是现在，那我们就可以这样来实现：

```tsx
// index.tsx
const [form] = Form.useForm()
const { formModal, content } = useFormModal({ form }) // form参数可选

// 可以将业务逻辑再封装
const { handleCreate, handleDelete } = useOtherActions({ formModal, refreshList })

    const handleEdit = (info) => {
        formModal.open({
        title: 'Edit',
        content: <EditForm info={info} />, // 不需要传form，只用传组件需要的参数
            onOk: async (values) => {
            await service.approve(values)
            message.success('edit success')
            },
            onCancel: () => console.log('click cancel'),
            })
        }
        
            const handleApprove = (info) => {
                formModal.confirm({
                title: 'Approve',
                content: <ApproveForm info={info} form={form} />, // 手动控制form
                    onOk: async (values) => {
                    await service.update(values)
                    message.success('approve success')
                    },
                    onCancel: () => console.log('click cancel'),
                    })
                }
                
                return <>
                <Button onClick={handleCreate}>Create</Button>
                <List>
                    {list.map(item) => {
                    return <List.Item info={item} onClick={handleEdit} ...>
                {item.name}
                </List.Item>
            }}
            </List>
            {content} // 组件dom
            </>
            
            // EditForm.tsx
            const { form, info } = props
            
            return <>
            <div>ID:  {info.name}</div>
            <Form.Item label="Address" reruired>
            <Input placeholder="Please input something" />
            </Form.Item>
            </>
```

从代码中不难看出，前文所说的 3 个状态都已经从主组件抹去，其中 `visible`、`posting` 都自动由 `useFormModal` 进行管理，在业务开发中主组件/子组件都不需要关注，而 `record` 状态本身就只是中间状态，它只是为了在 `Trigger` <=> `Modal` 之间进行信息传递。

同时 `form` 实例默认也不再需要管理（但是支持手动管理），开发者主需要关系具体的业务逻辑：比如表单元素、提交接口、刷新列表等具体动作。

如此一来，可以说是完美的解决了前文提到的所有问题。

总结
==

弹窗的管理本质还是状态的管理，本文从业务场景中常见的 `Modal` 组件出发，分析在日常开发中对于 `Modal` 状态管理的“三宗罪”：状态管理复杂、容易引发性能问题、主子组件通信难，并结合开发经验给出了一些优化技巧。

此外还讨论了针对具体业务场景的定制化解决方案，通过 `Trigger 封装`、`Ref 管理`、`Hook 调用`等技巧，尽量从根本上去除 `Modal` 组件对主组件代码的状态带来的管理难题。

最终在弹窗内使用表单的场景，参考 `Modal.useModal`，进一步封装了 `useFormModal`，在贴合开发者心智的前提下，定向解决了该场景下状态管理困难的问题。

希望本文对大家有所帮助，欢迎留言讨论～

参考资料
====

*   [React 实战 - 如何更优雅的使用 Antd 的 Modal 组件](https://juejin.cn/post/6850418118141935624 "https://juejin.cn/post/6850418118141935624")
    
*   [sunflower-antd](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fant-design%2Fsunflower "https://github.com/ant-design/sunflower")
    
*   [refine-antd](https://link.juejin.cn?target=https%3A%2F%2Frefine.dev%2Fdocs%2Fui-frameworks%2Fantd%2Fhooks%2Fform%2FuseModalForm%2F "https://refine.dev/docs/ui-frameworks/antd/hooks/form/useModalForm/")
    
*   [withFormModal](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F388222294 "https://zhuanlan.zhihu.com/p/388222294")
    
    *   [antd v4 Form 使用心得](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F375753910 "https://zhuanlan.zhihu.com/p/375753910")
    *   [如何优雅的对 Form.Item 的 children 增加 before、after](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F422752055 "https://zhuanlan.zhihu.com/p/422752055")
*   [Modal.confirm 违反了 React 的模式吗？](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F54492049 "https://zhuanlan.zhihu.com/p/54492049")