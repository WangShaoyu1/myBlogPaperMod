---
author: "Sunshine_Lin"
title: "前端组件库的Form组件字段校验，到底是怎么做到的？"
date: 2023-09-11
description: "前言 大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心。 我们平时开发的时候，肯定都会接触到表单吧，那大家有没有想过一件事情，为啥你每次输入的时候，就能马上触"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:30,comments:2,collects:54,views:4162,"
---
前言
--

大家好，我是林三心，用最通俗易懂的话讲最难的知识点是我的座右铭，基础是进阶的前提是我的初心。

![](/images/jueJin/d5784e76ffef435.png)

我们平时开发的时候，肯定都会接触到表单吧，那大家有没有想过一件事情，为啥你每次输入的时候，就能马上触发到表单的校验呢？

![](/images/jueJin/1e9b3ebf3b5048e.png)

有些兄弟就会好奇，这些个 input 框改变的时候，是怎么能触发到顶部 form 的校验的呢？

我们使用表单时，代码大概是这样的

```html
<template>
<div style="margin-left: 300px; margin-top: 300px">
<test-form :rules="rules" :data="formData">
<test-form-item field="name">
<test-input v-model="formData.name" />
</test-form-item>
</test-form>
</div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import TestForm from './Form.vue';
import TestFormItem from './Form-Item.vue'
import TestInput from './Input.vue';

// 规则
    const rules = {
        name: {
        required: true
    }
}
// 数据
    const formData = reactive({
    name: '林三心'
    })
    </script>
```

其实校验的核心功能就是三个东西

*   表单规则：在 test-form 中
*   表单字段：在 test-form-item 中
*   表单值：在 test-input 中

我们可以通过`表单字段`去获取到实时的`表单值`，接着去`表单规则`中去匹配，就可以获取到校验结果了~

实现效果
----

看一下，本文章想要实现的效果如下，别看这个功能只是组件库中一个很简单的功能，但是这几天面试下来，发现面试者很少人能回答得上来~

![](/images/jueJin/7d6797e9a6f344d.png)

Provide & Inject
----------------

在讲实现之前我们先来讲讲 Provide & Inject，他是一种 vue3 中组件之间传值的方式，我用一个简单的例子来给大家说明

```html
// 父组件
<script lang='ts' setup>
import { provide } from 'vue'

    provide('form', {
        rules: {
    name: { required: true }
}
})
</script>

// 子组件
<script lang='ts' setup>
import { provide, inject } from 'vue'

const formInject = inject('form')
console.log(formInject)
    // { rules: {
//      name: { required: true }
//      } }

    provide('form-item', {
    field: 'name'
    })
    </script>
    
    // 孙子组件
    <script lang='ts' setup>
    import { inject } from 'vue'
    
    const formInject = inject('form')
    const formItemInject = inject('form-item')
    
    console.log(formInject)
        // { rules: {
    //      name: { required: true }
//  } }

console.log(formInject)
    //{
    //  field: 'name'
//}

</script>
```

基本实现原理
------

我们上面说了，实现表单校验的三个重要因素是

*   表单规则：在 test-form 中
*   表单字段：在 test-form-item 中
*   表单值：在 test-input 中

只有将这三个东西结合起来，才能做到校验，我画了个图，大家可以看看

![](/images/jueJin/c0862a1064d645b.png)

大致分为几步：

*   1、Form 将 rules、validate函数 传给 From-Item
*   2、Form-Item 将 field、onChange函数 传给 Input
*   3、Input的 value 改变时触发 validate、onChange函数，去执行校验，并且决定展不展示错误提示

具体实现
----

### Form

Form 要做到 将 rules、validate函数 传给 Form-Item

```html
<template>
<form>
<slot></slot>
</form>
</template>

<script lang="ts" setup>
import { provide, reactive } from 'vue'
const props = defineProps<{ rules: any; data: any }>();
// 字段有多个，所以需要维护一个错误表
const errorMap = reactive<any>({})

// 校验函数
    const validateFn = (field: string): Promise<void> => {
        return new Promise((resolve, reject) => {
        const { rules, data } = props;
    const ruleItem = rules[field]
const dataItem = data[field]
    if (ruleItem.required && dataItem === '') {
    return reject()
}
resolve()
});
};

// 执行校验
    const validate = (field: string) => {
        validateFn(field).then(() => {
        errorMap[field] = false
            }).catch(() => {
            errorMap[field] = true
            })
        }
        
        
        // 注入
            provide('test-form', {
            validate,
            getErrorMap: () => errorMap
            })
            </script>
```

### From-Item

Form-Item 要做到 将 field、onChange函数 传给 Input

```html
<template>
<div>
<slot></slot>
<div style="color: red" v-if="data.showError">字段必填</div>
</div>
</template>

<script lang="ts" setup>
import { provide, inject, reactive } from 'vue';
const props = defineProps<{ field: string }>();
const testForm = inject<{ validate: (field: string) => Promise<any>; getErrorMap: any }>('test-form');
    const data = reactive({
    showError: false,
    });
    
    // value change时执行
        const onChange = () => {
            setTimeout(() => {
                if (testForm) {
            const showError = testForm.getErrorMap()[props.field]
            // 决定展示不展示错误提示
            data.showError =showError
        }
        })
    }
    
    // 注入
        provide('test-form-item', {
        getField: () => props.field,
        onChange
        });
        </script>
```

### Input

Input 要做到 value 改变时触发 validate、onChange函数，去执行校验，并且决定展不展示错误提示

```html
<template>
<input @input="onChange" :value="data.inputValue" />
</template>

<script lang="ts" setup>
import { reactive, watch, inject } from 'vue';

const props = defineProps<{ modelValue: string }>();
const emits = defineEmits(['update:modelValue']);

// 接收注入
const testForm = inject<{ validate: (field: string) => Promise<any>; getErrorMap: any }>(
'test-form',
);
const testFormItem = inject<{ getField: () => string; onChange: () => void }>('test-form-item')

// 内部维护 value
    const data = reactive({
    inputValue: props.modelValue,
    });
    
    watch(
    () => props.modelValue,
        v => {
        data.inputValue = v;
        },
        );
        
        // value change 时，执行 validate、onChange
            const onChange = (e: Event) => {
            emits('update:modelValue', (e.target as HTMLInputElement).value);
                if (testForm && testFormItem) {
                testForm.validate(testFormItem.getField())
                testFormItem.onChange()
            }
            };
            </script>
```

小结
--

其实上面就是埋点库中，全局点击上报的一种解决方案，看似小问题，但是其实面试了这么多人，感觉只有很少一部分人能回答的比较好~

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

![image.png](/images/jueJin/07b3fa7fffa44cf.png)