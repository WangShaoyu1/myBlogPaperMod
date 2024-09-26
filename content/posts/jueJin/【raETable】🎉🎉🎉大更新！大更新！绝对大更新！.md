---
author: "萌萌哒草头将军"
title: "【raETable】🎉🎉🎉大更新！大更新！绝对大更新！"
date: 2023-05-15
description: "🎉好消息，raETable迎来第三个版本了！本次更新主要有三个，次要更新有一个：🚀支持更多内置组件🚀支持注册自定义组件🚀全局支持响应式布局✈书写习惯改进"
tags: ["React.js","JavaScript","前端"]
ShowReadingTime: "阅读2分钟"
weight: 1049
---
🎉好消息，`raETable`迎来第三个版本了！

本次更新主要有三个，次要更新有一个：

1.  🚀支持更多内置组件
2.  🚀支持注册自定义组件
3.  🚀全局支持响应式布局
4.  ✈书写习惯改进

**`raETable`是一款面向`toB`的快捷组件库**，名字是`react` `antd` Easy Table 的缩写。旨在让开发者在`react`中使用 `antd`的`Table`时更 easy。

文档地址：[mmdctjj.github.io/raetable/](https://link.juejin.cn?target=https%3A%2F%2Fmmdctjj.github.io%2Fraetable%2F "https://mmdctjj.github.io/raetable/")

githup地址：[github.com/mmdctjj/rae…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmmdctjj%2Fraetable "https://github.com/mmdctjj/raetable")

### 🚀支持更多的内置组件

本次更新，内置的组件数量已经达到了`15`个，它们如下图所示

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/36db3c12bef9468c873c2fd256086ee6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

#### ❓如何给组件传参

你只需要将需要的参数在`column`(`EFormItemProps`类型)声明即可。

jsx

 代码解读

复制代码

    `{       dataIndex: 'name',       title: '姓名',       key: 'name',       affairType: 'InputNumber',       controls: false,       prefix: 'yourName length'     },`

### 🚀支持注册自定义组件

使用自定义组件时需要使用官方提供的注册函数`useExtendFormItem`，它的参数是一个对象`{[key: string]: (props: EFormItemProps) => ReactNode}`，该`value`是你自己定义的组件，它会接受`EFormItemProps`组件参数供你使用。

jsx

 代码解读

复制代码

`useExtendFormItem({   yourComponentName1: ({ type, value, onChange }) => {     if (type === 'display') return <>{value}</>;     return <Input value={value + '自定义的组件Input1'} onChange={onChange} />;   },   yourComponentName2: ({ type, value, onChange }) => {     if (type === 'display') return <>{value}</>;     return <Input value={value + '自定义的组件Input2'} onChange={onChange} />;   }, });`

接着你就可以在`columns`里申明这个组件了

js

 代码解读

复制代码

`<EPage   columns={[     ...,     {       dataIndex: 'name',       title: '姓名',       key: 'name',       conditionType: 'yourComponentName1',       affairType: 'yourComponentName2'     },     ...   ]} />`

你可以在多个地方的调用`useExtendFormItem`注册组件，

如果组件名称重复，会覆盖旧的组件，所以你也可以用此方法重写默认组件

### 🚀全局支持响应式布局

目前全局的响应式布局遵循了[`Bootstrap`](https://link.juejin.cn?target=https%3A%2F%2Fgetbootstrap.com%2Fdocs%2F3.4%2Fcss%2F "https://getbootstrap.com/docs/3.4/css/")的响应式布局

![2023-05-15 09.14.32.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a485d03c14d4bb8924b4ccb14405731~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

针对小屏幕的设备，对`table`做了优化

![2023-05-15 09.19.50.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0151e632e154b0da20cd8ac37b3b4ab~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### ✈书写习惯改进

改进的地方如下：

1.  `raETable`特别`export`了`FORMTYPE`枚举类型供开发者快速声明组件名称
2.  每个组件名称使用了`antd`的命名习惯，组件名称首字母都大写

所以现在声明组件也可以这样写:

js

 代码解读

复制代码

`import { FORMTYPE } from 'raetable'  {     dataIndex: 'input',     key: 'input',     title: 'input',     affairType: FORMTYPE.Input     // 等价于=> affairType: 'Input',   },   {     dataIndex: 'number',     key: 'number',     title: 'number',     affairType: 'InputNumber'     // 等价于=> affairType: 'InputNumber',   },`

我们的库是基于`antd`的，所以这里保持了一样的习惯。开发者在自定义组件时，可以保持这个习惯（非必须的）

本次的更新就这些了，希望大家多多支持，友善交流