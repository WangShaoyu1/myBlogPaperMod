---
author: "徐小夕"
title: "记一次HEX和RGB互换算法的思考及应用"
date: 2020-08-19
description: "由于笔者最近在开发可视化平台,所以对动态编辑器这块做了一段时间的研究, 发现其中有个小模块的知识点比较有意思,所以在这里分享一下. 所以笔者在这里就分享一下HEX与RGB之间相互转换的原理和算法, 并且实现随机生成HEX值和随机生成RGB值的函数,最后带着大家深度理解和掌握颜色…"
tags: ["JavaScript","算法中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:12,comments:7,collects:15,views:2203,"
---
由于笔者最近在开发可视化平台,所以对动态编辑器这块做了一段时间的研究, 发现其中有个小模块的知识点比较有意思,所以在这里分享一下.

作为**前端工程师**, 我们平时在对接设计稿的时候, 是不是经常会涉及到颜色值的转换呢? 比如从**HEX**值转化到**RGB**值, 亦或者是从**RGB**值转换到**HEX**值, 这块在**PhotoShop**等设计软件中非常常见, 在做类似于画板, 设计类的IDE的时候也经常会用到它们的互相转换, 还有一种场景是,为了满足老板对高大上特效的要求, 我们要让动画在不同的时间显示不同的颜色,而且有过渡效果(过渡效果虽然可以通过**transiton**来实现),如下:

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

所以笔者在这里就分享一下**HEX**与**RGB**之间相互转换的原理和算法, 并且实现**随机生成HEX值**和**随机生成RGB值**的函数,最后带着大家深度理解和掌握颜色领域的应用.

1 文章摘要
------

*   HEX与16进制
*   HEX转RGB算法
*   RGB转HEX算法
*   应用场景

2 HEX(16进制)
-----------

> 十六进制（英文名称：Hexadecimal），是计算机中数据的一种表示方法。和我们平常的表示法不一样。它由0-9，A-F组成，字母不区分大小写。与10进制的对应关系是：0-9对应0-9；A-F对应10-15；N进制的数可以用0~(N-1)的数表示，超过9的用字母A-F。

以上概念非常重要, 这也是我们转换**RGB**的关键. 还有一个知识点需要我们掌握的就是**进制转换**. 在计算机基础中我们都知道如何将二进制转化为十进制, 10进制数转换成16进制的方法，和转换为2进制的方法类似，唯一的变化：除数由2变成16. 举个例子, 我们拿140来举例:

被除数

计算过程

商

余数

140

140/16

8

12

8

8/16

0

8

所以140转换为16进制，结果为：**8C** (由十六进制的定义我们知道14对应的字母为E)

以上就是掌握HEX和RGB互相转换的核心知识点, 接下来我们来看看互相转换的算法实现.

3 HEX转RGB算法
-----------

从 **HEX** 颜色值转换成 **RGB** 颜色值，本质上是**HEX的第一位数乘以16加上第二位数**. 举个例子: 转换颜色为 #1821DD的 HEX 值到 RGB 值.

```js
#1821DD ----------> rgb:

18 ----> r: r的值就是: 1 * 16 + 8 = 24

21 ----> g: g的值就是:　2 * 16 + 1 = 33

DD ----> b: b的值就是: 13 * 16 + 13 = 221
```

以上转换的结果为**rgb: (24, 33, 221)**, 怎么样, 是不是很简单? 接下来我们来看看具体的算法实现:

```ts
    const hex2rgb = (hex: string = ''):string => {
    //  针对于传入错误的hex,即长度不等于7或者不等于4的
        if(![4,7].includes(hex.length)) {
        throw new Error('格式错误')
    }
    
    let result = hex.slice(1)
    
    // 如果是颜色叠值, 统一转换成6位颜色值
        if(result.length === 3) {
        result = result.split('').map(a => `${a}${a}`).join('')
    }
    
const rgb:number[] = []

// 计算hex值
    for(let i=0, len = result.length; i< len; i+=2) {
    rgb[i / 2] = getHexVal(result[i]) * 16 + getHexVal(result[i+1])
}

    function getHexVal(letter:string):number {
    let num:number = -1;
        switch(letter.toUpperCase()) {
        case "A":
        num = 10
        break;
        case "B":
        num = 11
        break;
        case "C":
        num = 12
        break;
        case "D":
        num = 13
        break;
        case "E":
        num = 14
        break;
        case "F":
        num = 15
        break;
    }
    
        if(num < 0) {
        num = Number(letter)
    }
    
    return num
}

return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
}
```

当然还有更其他方法可以实现**REX**转**RGB**, 大家可以自行探索.

4 RGB转HEX算法
-----------

对于RGB转HEX, 方法类似, 只不过相当于上述方法的逆运算, 笔者实现一种思路, 大家可以参考学习:

```ts
    const rgb2hex = (rgb: string):string => {
    let str = rgb.replace(/rgb\((.*)\)/g, '$1')
    let strArr = str.split(',').map(t => t.trim())
    
let result:string[] = []

    for(let i:number = 0, len:number = strArr.length; i < len; i++) {
    let curVal = Number(strArr[i])
    let left = getHexStr(String(Math.floor(curVal / 16)))
    let right = getHexStr(String(Math.floor(curVal % 16)))
    result[i] = left  + right
}

    function getHexStr(v:string):string {
    let str:string = '';
        switch(v) {
        case '10':
        str = "A"
        break;
        case '11':
        str = "B"
        break;
        case '12':
        str = "C"
        break;
        case '13':
        str = "D"
        break;
        case '14':
        str = "E"
        break;
        case '15':
        str = "F"
        break;
    }
    
        if(!str) {
        str = v
    }
    
    return str
}

return `#${result.join('')}`
}
```

以上就是反转的算法, 大家掌握了吗?接下来我们来聊聊它的应用场景.

5 应用场景
------

其实颜色单位互换应用在很多领域, 笔者先罗列几个实际场景:

*   单位换算工具

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

*   WEB IDE调色板

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

*   动态背景

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)

其实还有很多应用, 大家可以自行发挥哈, 今天的学习就到这了, 请问今天你又博学了吗?