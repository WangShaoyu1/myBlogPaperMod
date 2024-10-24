---
author: "徐小夕"
title: "2021如何让你的Table组件无限可能"
date: 2021-01-23
description: "在管理后台中我们会使用大量的表格表单组件, 导入导出各种报表, 有些场景还需要对报表数据进行可视化分析, 动态生成可视化图表, 笔者将基于以上场景, 总结一些实用的 Table 组件开发技巧, 让前端开发不再吃力 以上是几个常用的业务分场景, 接下来笔者带大家一一实现 1…"
tags: ["数据可视化","Ant Design中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:100,comments:16,collects:99,views:7099,"
---
在管理后台中我们会使用大量的表格表单组件, 导入导出各种报表, 有些场景还需要对报表数据进行可视化分析, 动态生成可视化图表, 笔者将基于以上场景, 总结一些实用的 **Table** 组件开发技巧, 让前端开发不再吃力.

#### 往期经典

*   [轻松教你搞定组件的拖拽, 缩放, 多控制点伸缩和拖拽数据上报](https://juejin.cn/post/6917648021794586631 "https://juejin.cn/post/6917648021794586631")
*   [基于自然流布局的可视化拖拽搭建平台设计方案](https://juejin.cn/post/6915297687873159176 "https://juejin.cn/post/6915297687873159176")
*   [基于React+Koa实现一个h5页面可视化编辑器－H5-Dooring](https://juejin.cn/post/6864410873709592584 "https://juejin.cn/post/6864410873709592584")

效果演示
----

![](/images/jueJin/5dfd822e68da485.png)

技术点
---

*   实现 **Table** 动态渲染
*   **Table** 排序, 多列排序, 自定义搜索
*   批量导入 **Excel** 数据渲染 **Table**
*   将 **Table** 数据导出为 **Excel** 文件
*   基于 **Table** 数据自动生成多维度可视化报表
*   实现简单的 **Table** 编辑器

以上是几个常用的业务分场景, 接下来笔者带大家一一实现.

技术实现
----

### 1\. 实现 **Table** 动态渲染

一般我们渲染表格, 大多数是预先将表格结构写好, 比先定义好`columns`再向后端请求数据填充表格, 如下:

```js
    const columns = [
        {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        },
            {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
            },
                {
                title: '住址',
                dataIndex: 'address',
                key: 'address',
                },
                ];
                    const dataSource = [
                        {
                        key: '1',
                        name: '徐小夕',
                        age: 18,
                        address: '杭州夕湖区',
                    }
                    ];
                    
                    <Table dataSource={dataSource} columns={columns} />
```

这种业务场景虽然可以满足大部分后台管理系统的`Table`需求, 也可以使用 **antd** 或者 **element** 构建, 但是对于 `lowcode` 系统而言, 很多模块都是不确定的, 我们需要根据**协议**和**数据**来驱动 **Table** 的渲染.

比如我们在 **H5-Dooring** 中配置了一个表单, 我们要统计分析表单的数据, 由于表单项是不确定的, 所以我们无法提前定义好一个 **table schema**. ![](/images/jueJin/fa0275c86d9e4f4.png)

那如何来动态渲染这个 **Table** 呢? 这里给大家提供一个思路, 基于数据驱动 + 协议层约束. 类似于国外 **SAP** 的 低代码平台, 完全基于 **odata** 协议, 我们可以约束表单的提交数据格式, 然后结合用户提交的数据, 动态提取出 **Table** 所需的 **columns**, 最后再渲染 **Table** 组件.

![](/images/jueJin/541674998fd346f.png)

**协议层**主要约束不同字段的展示类型, 比如字符串, 按钮, 链接, 标签等, 用户在提交表单之后会携带协议层对应的 **flag** 和用户输入的值, 这有利于我们解析器渲染**Table**时可以对不同的列展示不同的类型. 如下: ![](/images/jueJin/e1bb8201802c4a2.png)

笔者这里简单实现一个`demo`, 如下:

```js
// table数据源
let tableData = res.map((item:any,i:number) => ({ ID: nanoid(8), ...item }));
let baseRow = tableData[0],
keys = Object.keys(baseRow);
    setColumns(() => {
        const baseColumn = keys.map(item => {
            return {
            title: item,
            dataIndex: item,
            key: item,
            width: item === 'ID' ? 0 : null,
                render: (v:any) => {
                    if(typeof v === 'object') {
                    return <>
                        {
                        v.map(item => <Tag color="#2F54EB">{ item.label || item }</Tag>)
                    }
                    </>
                }
                return item === 'ID' ? '' : v
            }
        }
        })
            baseColumn.push({
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (row) => <a onClick={() => handleDel(row)}>删除</a>,
            })
            return baseColumn
            })
```

以上我们就实现了一个动态 **Table** 渲染方案, 案例中使用了 **react**, 大家也可以使用熟悉的 **vue3.0**.

### 2\. **Table** 排序, 多列排序, 自定义搜索

**Table** 排序, 多列排序实现方式也很简单, 我们只需要自定义 **Table** 头部, 对排序字段提升为 **Table** 的公共 `State`, 最后通过排序标识和排序方法进行排序即可. 目前 antd4.0已经支持多列排序, 大家可以直接参考学习即可, 如下: ![](/images/jueJin/82f50cd9921d408.png) 对于自定义搜索, 也就是文章开头的 **demo** 展示的列搜索, 我们可以采用如下方案实现:

```js
    const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
    <div style={{ padding: 8 }}>
    <Input
        ref={node => {
        searchInput = node;
    }}
placeholder={`Search ${dataIndex}`}
value={selectedKeys[0]}
onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
style={{ width: 188, marginBottom: 8, display: 'block' }}
/>
<Space>
<Button
type="primary"
onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
icon={<SearchOutlined />}
size="small"
style={{ width: 90 }}
>
搜索
</Button>
<Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
重置
</Button>
</Space>
</div>
),
filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
onFilter: (value, record) =>
record[dataIndex]
? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
: '',
    onFilterDropdownVisibleChange: visible => {
        if (visible) {
        setTimeout(() => searchInput.select(), 100);
    }
    },
    render: text =>
    searchedColumn === dataIndex ? (
    <Highlighter
highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
searchWords={[searchText]}
autoEscape
textToHighlight={text ? text.toString() : ''}
/>
) : (
text
),
});
```

此时我们只需要对动态生成的`columns`每一列添加自定义头部即可:

```js
    {
    title: item,
    dataIndex: item,
    key: item,
    ...getColumnSearchProps(item)
}
```

**antd4.0** 中也有详细的使用方式, 这里笔者就不一一介绍了, 效果如下: ![](/images/jueJin/28b9f190ec2049d.png) 大家也可以在 [**H5-Dooring**](https://link.juejin.cn?target=http%3A%2F%2Fh5.dooring.cn%2Fh5_plus "http://h5.dooring.cn/h5_plus") 的管理后台中查看具体效果.

### 3\. 批量导入 **Excel** 数据渲染 **Table**

在很多数据分析后台中我们需要处理很多电子表格, 用传统的**excel**手动录入的方式将慢慢被淘汰. 比如不同渠道方收集到了很多业务数据, 整理到 excel 中, 那如何快速保存到自己的后台系统中呢? 一般的思路如下:

*   通过表单的方式一条条录入
*   后台解析文件处理成规范的可入库数据结构
*   前端实现一件导入 **excel**, 自动同步数据

第一种方案由于效率太低, 适合C端用户手动录入, 我们暂时忽略, 笔者将实现一下第三种方案. 实现思路如下: ![](/images/jueJin/63bb4c4baeeb4ec.png)

这里我们用到了 `XLSX` 这个库, 结合 **FileReader API**. 我们通过`FileReader` 拿到`excel`文件的二进制数据, 然后传给 `XLSX` 解析成 js `object`, 最后通过笔者写的 **table 渲染器**生成符合规范的`table`数据结构. 源码如下:

```js
// 解析并提取excel数据
let reader = new FileReader();
    reader.onload = function(e) {
    let data = e.target.result;
    let workbook = XLSX.read(data, {type: 'binary'});
    let sheetNames = workbook.SheetNames; // 工作表名称集合
let draftArr = {}
    sheetNames.forEach(name => {
    let worksheet = workbook.Sheets[name]; // 只能通过工作表名称来获取指定工作表
        for(let key in worksheet) {
        // v是读取单元格的原始值
            if(key[0] !== '!') {
                if(draftArr[key[0]]) {
                draftArr[key[0]].push(worksheet[key].v)
                    }else {
                draftArr[key[0]] = [worksheet[key].v]
            }
        }
    }
    });
    // 得到table合法的数据产物
    const sourceData = Object.values(draftArr);
}
reader.readAsBinaryString(file);
```

拿到合法的`table` 数据源之后我们就可以进行第一节说的动态渲染 **Table** 的逻辑了.

通过以上的方式, 我们可以实现任何结构的`excel`表格的导入. 在导入后我们可以自动发送请求存储到我们的业务后台中.

### 4\. 将 **Table** 数据导出为 **Excel**

类似的, 上面我们介绍了将 **excel** 导入 **table**, 同样我们也可以将**Table** 导出为 **excel**, 进行数据的分发, 本地化, 比如我们最近流行的在线文档等应用. 笔者这里简单讲一下实现思路:

![](/images/jueJin/917ff3e9192147a.png)

也就是我们第3节说的反解析. **excel** 文件生成笔者采用 **js-export-excel** 这个库, 基于它笔者实现了一个开箱即用的方法, 避免大家烧脑造轮子. 如下:

```js
import ExportJsonExcel from 'js-export-excel';

    const generateExcel = () => {
    let option:any = {};  //option代表的就是excel文件
    let dataTable = [];  //excel文件中的数据内容
    let len = list.length;
        if (len) {
            for(let i=0; i<len; i++) {
            let row = list[i];
            let obj:any = {};
                for(let key in row) {
                    if(typeof row[key] === 'object') {
                    let arr:any = row[key];
                    obj[key] = arr.map((item:any) => (typeof item === 'object' ? item.label : item)).join(',')
                        }else {
                    obj[key] = row[key]
                }
            }
            dataTable.push(obj);  //设置excel中每列所获取的数据源
        }
    }
    let tableKeys = Object.keys(dataTable[0]);
    option.fileName = tableName;  //excel文件名称
        option.datas = [
            {
            sheetData: dataTable,  //excel文件中的数据源
            sheetName: tableName,  //excel文件中sheet页名称
            sheetFilter: tableKeys,  //excel文件中需显示的列数据
            sheetHeader: tableKeys,  //excel文件中每列的表头名称
        }
    ]
    let toExcel = new ExportJsonExcel(option);  //生成excel文件
    toExcel.saveExcel();  //下载excel文件
}
```

### 5\. 基于 **Table** 数据自动生成多维度可视化报表

在后台管理系统和 **BI** 平台中我们会遇到很多数据分析和报表展示的需求, 接下来笔者将来介绍一下如何基于 **Table** 数据动态生成**多维度可视化分析报表**.

笔者在之前的文章中介绍过 度量行这个概念, 对于数据分析而言, 我们也要考虑可分析维度的概念, 比如什么是可分析的, 什么是不可分析的. 比如我们又一个表格, 里面有如下结构: ![](/images/jueJin/97270cf34a0d430.png) 对于联系方式而言, 它是不可度量的, 即分析该项指没有任何价值, 所以在自动生成多维度分析中我们理论上不因该分析它, 基于这个原理, 我们来设计一个简单的自动生成多维度可视化报表的方案.

#### 5.1 基于数据源获取维度数据

我们针对具有范围属性的维度进行度量, 生成度量数据, 代码如下:

```js
    const generateDistData = (key:string, list:any) => {
    let distDataMap:any = {},
distData = []
    list.forEach((item:any) => {
    // 当前纬度的类别
    let curKey = typeof item[key] === 'object' ? item[key][0].label : item[key];
        if(distDataMap[curKey]) {
        distDataMap[curKey]++;
            }else {
            distDataMap[curKey] = 1;
        }
        })
        
        // 生成目标数组
            for(let key in distDataMap) {
            distData.push({name: key, value: distDataMap[key]})
        }
        return distData
    }
```

此时我们只需要根据维度的字段, 即可获取某一维度的数据值, 后通过可视化组件渲染即可.

#### 5.2 基于某一维度生成可视化报表

我们用`@ant-design/charts`, 代码如下:

```js
<div className={styles.anazlyHeader}>
<div className={styles.anazlyItem}>
<span>分析纬度: </span>
<Select style={{ width: 120 }} onChange={(v) => handleAnazlyChange(0, v)} defaultValue={keys[0]}>
    {
        keys.map((item,i) => {
        return <Option value={item} key={i}>{ item }</Option>
        })
    }
    </Select>
    </div>
    </div>
    <div className={styles.anazlyContent}>
        {
        !!config && <Pie {...config} />
    }
    </div>
```

实现效果如下: ![](/images/jueJin/c9d206e1b98f45e.png)

### 6\. 实现简单的 **Table** 编辑器

实现 **Table** 编辑器其实笔者在 [前端如何一键生成多维度数据可视化分析报表](https://juejin.cn/post/6886089003481694215 "https://juejin.cn/post/6886089003481694215") 已经详细分析过了,也集成在了[**H5-Dooring**](https://link.juejin.cn?target=http%3A%2F%2Fh5.dooring.cn%2Fplus "http://h5.dooring.cn/plus") 的可视化组件编辑器中, 具体 `demo` 如下:

![](/images/jueJin/e5afd2f5726e44f.png)

大家感兴趣可以研究一下.

最后
--

目前笔者也在持续更新**H5**编辑器 [H5-Dooring](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrXujiang%2Fh5-Dooring "https://github.com/MrXujiang/h5-Dooring"), 最近来同步一下功能:

*   修复图片库选择bug
*   添加省市级联组件
*   添加批量导入 excel 数据的能力
*   添加表单自定义校验
*   音频组件添加自动播放控制, 循环播放等配置项
*   添加横向滑动组件

> 觉得有用 ？喜欢就收藏，顺便点个**赞**吧，你的支持是我最大的鼓励！微信搜 “**趣谈前端**”，发现更多有趣的H5游戏, webpack，node，gulp，css3，javascript，nodeJS，canvas数据可视化等前端知识和实战.