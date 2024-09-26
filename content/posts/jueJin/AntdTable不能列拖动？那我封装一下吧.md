---
author: "可乐只喝可乐"
title: "AntdTable不能列拖动？那我封装一下吧"
date: 2024-09-24
description: "每次用到我用到antd这个库的table组件的时候,若是数据的每一列过长，就难免会遇到不好的影响。于是就有一个需求来啦，需要把表格做成可列拖动的。说干就干，开动。分析改造为一个可拖"
tags: ["前端","React.js"]
ShowReadingTime: "阅读2分钟"
weight: 795
---
#### 前言

每次用到我用到`antd`这个库的`table组件`的时候,若是数据的每一列过长，就难免会遇到不好的影响。于是就有一个需求来啦，需要把表格做成可列拖动的。说干就干，开动。

#### 分析

改造为一个可拖动的表格，最主要的便是改造起表头，然后拖动的每一列的时候，不断改变每一列的宽度，逻辑倒也是不难。

#### 改造

##### 改造表头

首先改造表头我们需要用到一个`react-resizable`包，实现表头每一列的拖动，我认为这一难点倒是如何写`css`，一定要注意设置`css`，否则无法拖动。

js

 代码解读

复制代码

`import type { ResizeCallbackData } from 'react-resizable' import { Resizable } from 'react-resizable' import './index.less' const Index = (   props: React.HTMLAttributes<any> & {     onResize: (e: React.SyntheticEvent<Element>, data: ResizeCallbackData) => void     width: number   } ) => {   const { onResize, width, ...restProps } = props   if (!width) {     return <th {...restProps} />   }   return (     <Resizable       width={width}       height={0}       handle={         <span           className="react-resizable-handle"           onClick={(e) => {             e.stopPropagation()           }}         />       }       onResize={onResize}       draggableOpts={{ enableUserSelectHack: false }}     >       <th {...restProps} />     </Resizable>   ) } export default Index`

less

 代码解读

复制代码

`.react-resizable {   position: relative;   background-clip: padding-box; } .react-resizable-handle {   position: absolute;   right: -5px;   bottom: 0;   z-index: 1; // 设置层级，防止被遮挡   width: 10px; // 设置光标可拖动的宽度   height: 100%;   cursor: col-resize; // 光标指示可以水平调整列大小。 }`

##### 改造表格

首先用一个用一个状态将每一列的表格存起来，在设置头部单元格的时候再改变每一列表格的宽度，我们在`antd table`[下可以看到一个可以实现这个功能的属性](https://link.juejin.cn?target=https%3A%2F%2Fant-design.antgroup.com%2Fcomponents%2Ftable-cn%23column "https://ant-design.antgroup.com/components/table-cn#column")

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/9fa68a3f15ed45e2a3a9c14b75dc0ac5~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y-v5LmQ5Y-q5Zad5Y-v5LmQ:q75.awebp?rk3s=f64ab15b&x-expires=1727775409&x-signature=YO1i%2BgFpe6rYwbQlvjQC2kWY0iw%3D)

js

 代码解读

复制代码

 `const mergeColumns = columns.map((col, index) => ({     ...col,     onHeaderCell: (column: any) => ({       width: column.width,       onResize: handleResize(index) as React.ReactEventHandler<any>     })   }))`

然后我们需要改变在`antd table`的这个组件改造一下表头部分，[在文档中我我们可以看到components这个属性来实现](https://link.juejin.cn?target=https%3A%2F%2Fant-design.antgroup.com%2Fcomponents%2Ftable-cn%23table "https://ant-design.antgroup.com/components/table-cn#table")

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/276f8a6f12e64e5e9fd5b7724c7445cc~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y-v5LmQ5Y-q5Zad5Y-v5LmQ:q75.awebp?rk3s=f64ab15b&x-expires=1727775409&x-signature=EQek0jngxRy3Edeyhc5fSTRRSaw%3D)

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/65be0be0f4204d9b888d5a9dc46e7c2c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5Y-v5LmQ5Y-q5Zad5Y-v5LmQ:q75.awebp?rk3s=f64ab15b&x-expires=1727775409&x-signature=1cAkLCBIMdrNRmKhou7oImk8CM4%3D) 在这个`header`中引入之前改造的表头

js

 代码解读

复制代码

`components={{     header: {       cell: ResizableTitle     } }}`

具体的代码如下所示

js

 代码解读

复制代码

`import React, { useState } from 'react' import { Table } from 'antd' import ResizableTitle from '@/components/ResizableTitle' import { ResizeCallbackData } from 'react-resizable' import { TablePaginationConfig } from 'antd/es/table' type ResizableTableProps = {   dataSource: object[]   columnsList: object[]   pagination?: TablePaginationConfig | false   scroll?: object   rowKey?: string } const ResizableTable = (props: ResizableTableProps) => {   const { dataSource, columnsList, pagination, scroll, rowKey = 'id' } = props   const [columns, setColumns] = useState(columnsList)   const handleResize =     (index: number) =>       (_: React.SyntheticEvent<Element>, { size }: ResizeCallbackData) => {         const newColumns = [...columns]         newColumns[index] = {           ...newColumns[index],           width: size.width         }         setColumns(newColumns)       }   const mergeColumns = columns.map((col, index) => ({     ...col,     onHeaderCell: (column: any) => ({       width: column.width,       onResize: handleResize(index) as React.ReactEventHandler<any>     })   }))   return (     <Table       bordered       columns={mergeColumns}       rowKey={rowKey}       components={{         header: {           cell: ResizableTitle         }       }}       scroll={scroll}       pagination={pagination}       dataSource={dataSource}     />   ) } export default ResizableTable`

这就是基于`antd table`改造的一个列可拖动的表格，`注意，传入的参数，每一列要写好一个宽度，否则不生效。`

#### 总结

在改造`table`的时候我们主要用到了`react-resizable`这个库来实现改造表格的表头，在改造表格的表头时候注意要设置其中的样式，使其可拖动，最后便是在拖动的时候不断重新写入每一列的宽度啦。