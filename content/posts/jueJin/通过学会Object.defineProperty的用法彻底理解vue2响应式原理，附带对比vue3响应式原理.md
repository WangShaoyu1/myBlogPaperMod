---
author: "天天鸭"
title: "通过学会Object.defineProperty的用法彻底理解vue2响应式原理，附带对比vue3响应式原理"
date: 2024-03-29
description: "最近在看vue2的源码的响应式原理有感，就想把Object.defineProperty知识记录下来，方便学习"
tags: ["JavaScript","Vue.js","前端"]
ShowReadingTime: "阅读3分钟"
weight: 807
---
### 背景：

最近在看vue2的源码有感，想起以前刚入选行没多久时背面经的时候面试官一问到：你知道vue2的响应式原理吗？？然后自己就巴拉巴拉地说什么：通过Object.defineProperty然后get、set.....一通输出，其实自己并没有真正理解这个原理直到自己慢慢深入去学习，如果面试官深入问必然就凉了，然后就想写这编文章了，这文章说的没有多深入主要是让人更好地理解这个思路。

可以对比vue3使用proxy实现响应式原理看这样理解更充分：[通过学会Proxy代理的用法彻底理解vue3响应式原理思路，附带对比vue2响应式原理](https://juejin.cn/post/7352079427864018955 "https://juejin.cn/post/7352079427864018955")

### Object.defineProperty的作用简述：

Object.defineProperty() **方法用于在对象上定义一个新属性或修改现有属性。** 通过这个方法，可以精确地控制属性的特性，如可枚举性、可配置性、可写性等。这个方法提供了更高级别的属性定义，可以用于创建高度定制化的对象属性。

### 用法：

Object.defineproperty(myobj, prop, desc) 可以接收三个参数

*   myobj : 第一个参数：就是要在哪个对象身上添加或者修改属性
    
*   prop : 第二个参数就是添加或修改的属性名
    
*   desc ： 可选项，一般是一个对象
    

简单的例子说明：

css

 代码解读

复制代码

    `let  personObj = {         name:"测试啊",         age: 18     }         Object.defineProperty(personObj,'sex',{      value:"男"    })    console.log(person)   // 打印出来  { name:"测试啊", age: 18, sex:男 }`

如上代码所示，这就添加了一个sex属性

#### **第三个参数讲解：**

第三个参数是可选的，具体属性如下：

1.  writable： 是否可重写，默认值是false
    
2.  value： 当前值
    
3.  get： 读取时内部调用的函数，默认值是undefined
    
4.  set： 写入时内部调用的函数，默认值是undefined
    
5.  enumerable： 表示能否通过for in循环访问属性，默认值为false
    
6.  configurable： 是否可再次修改配置，项默认值是false
    

如下使用的例子：

php

 代码解读

复制代码

 `let  personObj = {         name:"测试啊",         age: 18     }         Object.defineProperty(personObj,'sex',{      value:"男",       enumerable:true,    //是否可以枚举，默认值是false       writable:true,      //属性是否可以被修改，默认值是false       configurable:true   //是否可以被删除，默认值是false    })`

**重点来了小伙伴们** ，上面其它属性是一带而过，开始讲最重要的两个属性 set和get这也是vue2双向绑定的绝对核心，至于这两个属性什么作用的？  
**先说一个注意事项：** 当使用了getter或setter方法，不允许使用writable和value这两个属性(如果使用，会直接报错滴)

这里直接上个例子对着说吧

typescript

 代码解读

复制代码

`let  personObj = {         name:"测试啊",         age: 18     }         Object.defineProperty(personObj,'age',{          //当有人读取personObj的age属性时，get函数(getter)就会被调用，且返回值就是age的值         get(){             console.log('有人触发get读取age属性了')             return number         },                  //当有人修改person的age属性时，set函数(setter)就会被调用，且会收到修改的具体值         set(value){             console.log('有人修改了age属性，且值是',value)             number = value         }    })`
   

**小结一下：**  

*   get：当有人读取personObj的age属性时，就会被调用，且返回值就是age的值
*   set：当有人修改personObj的age属性时，就会被调用，且会收到修改的具体值

#### 基本使用也说了，通过上面的基础知识就很好理解vue2的响应式原理了：

大白话就是vue写在data里面的变量，在页面初始化的时候会通过Object.defineProperty递归去拦截所有属性，然后通过get把对应属性的依赖收集放到一个数组里面，当我们改变一个data里面的属性时，Object.defineProperty就用forEach去循环更新依赖数组里面的属性，这样就实现了双向绑定。

**知识延伸：** `Object.defineProperty` 不能直接监听原生数组下标的变化。所以vue2修改数组下标双向绑定是不生效的，要通过push()、 pop() 、splice() 等， 这也是vue3响应式原理改用proxy替代Object.defineProperty的原因