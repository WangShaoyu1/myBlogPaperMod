---
author: "Sunshine_Lin"
title: "React、Vue我全都要！React Hook 实现 Vue 的11个基本功能"
date: 2021-12-02
description: "前言 大家好，我是林三心，因为工作项目的需要，在上个月，我开始在项目中使用React去开发，到了今天，差不多一个月了，想跟大家分享一下我在React中是怎么去实现以前Vue中的一些功能的。 由于本菜鸟"
tags: ["前端","React.js","Vue.js中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:148,comments:0,collects:184,views:10730,"
---
前言
--

大家好，我是林三心，因为工作项目的需要，在上个月，我开始在项目中使用**React**去开发，到了今天，差不多一个月了，想跟大家分享一下我在**React**中是怎么去实现以前**Vue**中的一些功能的。

由于本菜鸟使用**React**不久，有不妥之处还请大家之处

> 注明：本文中所指 Vue 的版本是**Vue2**， React 的版本是 **React17**

![image.png](/images/jueJin/4838048155544bb.png)

1、JSX和template
--------------

在Vue2中是使用`template`的，这点使用 Vue 的同学们都知道，而在 React 中使用的是`JSX`，`JSX`是一个看起来很像 XML 的 JavaScript 语法扩展。

它有以下优点：

*   JSX 执行更快，因为它在编译为 JavaScript 代码后进行了优化。
*   它是类型安全的，在编译过程中就能发现错误。
*   使用 JSX 编写模板更加简单快速。

`JSX`的例子：使用ReactDOM.render函数，将DOM渲染到对应到id为app的节点下

```js
// 使用ReactDOM.render函数，将DOM渲染到对应到id为app的节点下
ReactDOM.render(
<div>
<h1>我是林三心</h1>
<h2>我是菜鸟</h2>
<p>React是一个很不错的 JavaScript 库!</p>
</div>
,
document.getElementById('app')
);

```

2、React 中给元素设置 style
--------------------

React 使用内联样式。我们可以使用 **驼峰法** 语法来设置内联样式. React 会在指定元素数字后自动添加 **px** 。以下实例演示了为 **h1** 元素添加 **myStyle** 内联样式：

```js
    function Demo() {
    
        var myStyle = {
        fontSize: 100, // 驼峰法
        color: '#FF0000'
    }
    
    return <h1 style={myStyle}>林三心是菜鸟</h1>
}
```

3、React 中给元素设置 class
--------------------

由于 JSX 就是 JavaScript，一些标识符像 `class` 不建议作为 XML 属性名。作为替代，使用 `className`来做对应的属性。

```js
    function Demo() {
    
    const classes = 'haha heihei xixi'
    
    return (
    <div>
    <h1 className='haha'>林三心是菜鸟</h1> // 单个
    <h1 className='haha heihei'>林三心是菜鸟</h1> // 多个
    <h1 className={classes}>林三心是菜鸟</h1> // 使用值来当做class
    </div>
    )
}
```

4、React 中的点击事件
--------------

在`Vue`中的点击事件使用的是`@click`来触发的，而在`JSX`中使用的是`onClick`

```js
    function Demo() {
        const handleClick = () => {
        console.log('林三心是菜鸟')
    }
    
    return (
    <button onClick={handleClick}>点我</button>
    )
}
```

5、React 中修改值触发DOM更新
-------------------

我使用的是`React hook`其中的`useState`，这一个hook在修改常量的时候比较简单，但是在修改引用`对象`或者`数组`的时候就需要先进行`浅拷贝`再进行覆盖修改

```js
import { useState } from 'react'

    function Demo() {
    const [msg, setMsg] = useState('我是菜鸟')
        const [obj, setObj] = useState({
        name: '林三心',
        food: '泡面'
        })
            const [arr, setArr] = useState([
            { message: '林三心啊', id: 1 },
            { message: '林三心啊啊', id: 2 },
        { message: '林三心啊啊啊', id: 3 }
        ])
            const handleClick = (type: number) => {
                switch (type) {
                case 1:
                setMsg('林三心是菜鸟') // 直接赋值
                break;
                case 2:
                setObj({ ...obj, food: '牛肉丸', }) // 浅拷贝
                break;
                case 3:
                setArr([...arr, { message: '林三心啊啊啊啊', id: 4}]) // 浅拷贝实现push效果
                break;
            }
        }
        
        return (
        <div>
        <button onClick={() => handleClick(1)}>修改msg</button>
        <button onClick={() => handleClick(2)}>修改obj的food</button>
        <button onClick={() => handleClick(3)}>arr添加一项</button>
        <h1>{msg}</h1>
        <p>{`我是${obj.name}我喜欢吃${obj.food}`}</p>
        <ul>
            {
                arr.map(({ message, id }) => {
                return <li key={id}>{message}</li>
                })
            }
            </ul >
            </div>
            )
        }
        
```

6、生命周期
------

使用React的hook——`useEffect`

```js
import { useState, useEffect } from 'react'
    function App() {
    const [num, setNum] = useState(1)
    const [count, setCount] = useState(1)
        useEffect(() => {
        console.log('哈哈哈哈')
        })
        return (
        <div>
        <button onClick={() => setNum(num + 1)}>点我修改num</button>
        <button onClick={() => setCount(count + 1)}>点我count</button>
        </div>
        )
    }
```

### 第二个参数不传

```js
    useEffect(() => {
    console.log('哈哈哈哈')
    })
```

当`useEffect`第二个参数不传时，`页面初始`和`数据更新`的时候，第一个参数函数都会执行，所以此时初始页面时会输出一次`哈哈哈哈`，然后无论你点修改num或者修改count的按钮时，也都会输出`哈哈哈哈`

### 第二个参数传空数组

```js
    useEffect(() => {
    console.log('哈哈哈哈')
    }, [])
```

当`useEffect`第二个参数传`[]`时，那么第一个参数函数只有在`页面初始`的时候才会执行，也就是只执行一次，无论你点修改num或者修改count的按钮，都不会执行这个函数

### 第二个参数传非空数组

```js
// ①
    useEffect(() => {
    console.log('哈哈哈哈')
    }, [num])
    
    // ②
        useEffect(() => {
        console.log('哈哈哈哈')
        }, [count])
        
        // ③
            useEffect(() => {
            console.log('哈哈哈哈')
            }, [num, count])
```

当`useEffect`第二个参数传非空数组时，`页面初始`和`依赖的数据发生更新`的时候，第一个参数函数都会执行。比如上方例子：

*   ①、只有按修改num按钮时，才会再次输出`哈哈哈哈`
*   ②、只有按修改count按钮时，才会再次输出`哈哈哈哈`
*   ③、无论按哪个按钮都会再次输出`哈哈哈哈`

### return清除操作

```js
    useEffect(() => {
    const timeId = setTimeout(() => console.log('我是定时器'), 1000)
    return () => clearTimeout(timeId)
    })
```

React 会在组件卸载的时候执行清除操作。effect 在每次渲染的时候都会执行。React 会在执行当前 effect 之前对上一个 effect 进行清除。

是在还不理解的同学，可以疯狂点击按钮，看看`我是定时器`这句话会输出多遍还是只输出一遍，就恍然大悟了

7、React 中实现 v-if & v-else
-------------------------

### Vue 中的 v-if & v-else

`v-if` 指令用于条件性地渲染一块内容。这块内容只会在指令的表达式返回 true 值的时候被渲染。

```js
<h1 v-if="show">林三心是菜鸟</h1>
```

也可以用 `v-else` 添加一个“else 块”：

```js
<h1 v-if="show">林三心是菜鸟</h1>
<h1 v-else>Oh no 😢</h1>
```

### React中实现

如果单单只想实现`v-if`的话，可以借助`&&`逻辑运算符

```js
import { useState } from 'react'
    function Demo() {
    
    const [show, setShow] = useState(false)
        const changeShow = () => {
        setShow(!show)
    }
    
    return (
    <div>
{show && <h1>林三心是菜鸟</h1>}
<button onClick={changeShow}>点我</button>
</div>
)
}
```

如果想实现`v-if`和`v-else`的话，可以借助`三元运算符`

```js
import { useState } from 'react'
    function Demo() {
    
    const [show, setShow] = useState(false)
        const changeShow = () => {
        setShow(!show)
    }
    
    return (
    <div>
{show ? <h1>林三心是菜鸟</h1> : <h1>菜鸟是林三心</h1>}
<button onClick={changeShow}>点我</button>
</div>
)
}
```

8、React 中实现 v-show
------------------

### Vue 中的 v-show

另一个用于根据条件展示元素的选项是 `v-show` 指令。用法大致一样：

```ini
<h1 v-show="show">林三心是菜鸟</h1>
```

不同的是带有 `v-show` 的元素始终会被渲染并保留在 DOM 中。`v-show` 只是简单地切换元素的 CSS property `display`。

### React中实现

其实就是改变元素的`display`这个样式来实现效果

```js
    function Demo() {
    
    // ...一样的代码
    
    return (
    <div>
    <h1 style={{display: show ? 'block': 'none'}}>林三心是菜鸟</h1>
    <button onClick={changeShow}>点我</button>
    </div>
    )
}
```

9、React 中实现 v-for
-----------------

我们可以用 `v-for` 指令基于一个数组来渲染一个列表。`v-for` 指令需要使用 `item in items` 形式的特殊语法，其中 `items` 是源数据数组，而 `item` 则是被迭代的数组元素的**别名**。

### Vue 中的 v-for

```js
<ul>
<li v-for="item in items" :key="item.message">
{{ item.message }}
</li>
</ul>
```

### React中实现

JSX 允许在模板中插入数组，数组会自动展开所有成员：

```js
    function Demo() {
    
        const arr = [
        <li key={1}>林三心啊</li>,
        <li key={2}>林三心啊啊</li>,
        <li key={3}>林三心啊啊啊</li>,
    ]
    
    return (
    <ul>
{arr}
</ul >
)
}

```

但是我大多数情况会使用数组的`map`方法来协助渲染

```js
    function Demo() {
    
        const arr = [
        { message: '林三心啊', id: 1 },
        { message: '林三心啊啊', id: 2 },
    { message: '林三心啊啊啊', id: 3 }
]

return (
<ul>
    {
        arr.map(({ message, id }) => {
        return <li key={id}>{message}</li>
        })
    }
    </ul >
    )
}

```

10、React 中实现 computed
---------------------

### Vue 中的 computed

只要`name`或者`food`改变，`mag`会更新成相应的值

```js
<h1>{{msg}}</h1>

computed: { msg() { return `我是${this.name}，我爱吃${this.food}` } }
```

### React中实现

在 React 中需要通过`useMemo`这个 hook 来来实现`computed`的效果

```js
import { useState, useMemo } from 'react'
    function Demo() {
    const [name, setName] = useState('林三心')
    const [food, setFood] = useState('泡面')
    
    // 实现computed的功能
    const msg = useMemo(() => `我是${name}，我爱吃${food}`, [name, food]) // 监听name和food这两个变量
    
        const handleClick = (type: number) => {
            if (type === 1) {
            setName('大菜鸟')
                } else if (type === 2) {
                setFood('牛肉丸')
            }
        }
        
        return (
        <div>
        <button onClick={() => handleClick(1)}>修改name</button>
        <button onClick={() => handleClick(2)}>修改food</button>
        <h1>{msg}</h1>
        </div>
        )
    }
```

11、React 中实现 watch
------------------

```js
// useWatch.ts
import { useEffect, useRef } from 'react'

type Callback<T> = (prev?: T) => void
    interface Config {
    immdiate: Boolean
}

    const useWatch = <T>(data: T, callback: Callback<T>, config: Config = { immdiate: false }) => {
    const prev = useRef<T>()
    const { immdiate } = config
    const inited = useRef(false)
    const stop = useRef(false)
        useEffect(() => {
        const execute = () => callback(prev.current)
            if (!stop.current) {
                if (!inited.current) {
                inited.current = true
                immdiate && execute()
                    } else {
                    execute()
                }
                prev.current = data
            }
            }, [data])
            
            return () => stop.current = true
        }
        
        export default useWatch
```

使用

```js
import { useState } from 'react'
import useWatch from '/@/hooks/web/useWatch'
    function App() {
    const [num, setNum] = useState(1)
    useWatch(num, (pre) => console.log(pre, num), { immdiate: true })
    return (
    <div>
    <div style={{ color: '#fff' }}>{num}</div>
    <button onClick={() => setNum(num + 1)}>点我</button>
    </div>
    )
}

```

结语
--

![image.png](/images/jueJin/fab596381256459.png)

今年快结束了，希望大家身体健康，万事如意

我是林三心，一个热心的前端菜鸟程序员。如果你上进，喜欢前端，想学习前端，那咱们可以交朋友，一起摸鱼哈哈，**或者你有合适的前端岗位机会，可以让我试试的**，那可以加我的wx --> `meron857287645`