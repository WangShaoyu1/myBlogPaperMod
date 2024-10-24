---
author: "政采云技术"
title: "最熟悉的陌生人rc-form"
date: 2021-07-14
description: "本文已参与好文召集令活动，点击查看：后端、大前端双赛道投稿，2万元奖池等你挑战！ rc-form 是谁? 我们也许会经常使用例如 Ant Design、Element UI、Vant 等第三方组件库来"
tags: ["前端","React.js","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:72,comments:2,collects:42,views:6395,"
---
本文已参与好文召集令活动，点击查看：[后端、大前端双赛道投稿，2万元奖池等你挑战！](https://juejin.cn/post/6978685539985653767 "https://juejin.cn/post/6978685539985653767") ![](/images/jueJin/d4eb6a01e656484.png)

> 这是第 107 篇不掺水的原创，想获取更多原创好文，请搜索公众号关注我们吧~ 本文首发于政采云前端博客：[最熟悉的陌生人rc-form](https://link.juejin.cn?target=https%3A%2F%2Fzoo.team%2Farticle%2Frc-from "https://zoo.team/article/rc-from")

![清风.png](/images/jueJin/d418387923574e8.png)

### rc-form 是谁?

我们也许会经常使用例如 Ant Design、Element UI、Vant 等第三方组件库来快速在项目中完成页面的布局效果和简单的交互功能。

但是我们可能会忽略掉在这些优秀的第三方库中的某些组件可能也依赖于其他优秀的库！正如我们使用频率很高的 Ant Design 中的 Form 组件（这里我说的是 React 版本的）。

其实这些优秀的开源库内部使用了优秀的第三方库 rc-form，正如我们经常使用的 getFieldDecorator、getFieldsValue、setFieldsValue、validateFields 等这些 Api，其实这些都是 rc-form 暴露出来的方法。

### 为什么要使用 rc-form?

> 我们都知道 React 框架设计模式和 Vue 不同，Vue 中作者已经帮我们实现了数据的双向绑定，数据驱动视图，视图驱动数据的改变，但是 React 中需要我们手动调用 setState 实现数据驱动视图的改变，请看下面的代码。

```js
import React, { Component } from "react";

    export default class index extends Component {
        state = {
        value1: "peter",
        value2: "123",
        value3: "23",
        };
        
            onChange1 = ({ target: { value } }) => {
            this.setState({ value1: value });
            };
            
                onChange2 = ({ target: { value } }) => {
                this.setState({ value2: value });
                };
                
                    onChange3 = ({ target: { value } }) => {
                    this.setState({ value3: value });
                    };
                    
                        submit = async () => {
                        const { value1, value2, value3 } = this.state;
                            const obj = {
                            value1,
                            value2,
                            value3,
                            };
                            const res = await axios("url", obj)
                            };
                            
                                render() {
                                const { value1, value2, value3 } = this.state;
                                return (
                                <div>
                                <form action="">
                                <label for="">用户名: </label>
                                <input type="text" value={value1} onChange={this.onChange1} />
                                <br />
                                <label for="">密码: </label>
                                <input type="text" value={value2} onChange={this.onChange2} />
                                <br />
                                <label for="">年龄: </label>
                                <input type="text" value={value3} onChange={this.onChange3} />
                                <br />
                                <button onClick={this.submit}>提交</button>
                                </form>
                                </div>
                                );
                            }
                        }
```

*   上面是一个表单登录的简单功能！要想实现表单数据的实时更新需要在表单 onChange 的时候手动更新 state 状态;
    
*   从上面代码中可以看出，这样写功能也能实现，但是当我们的表单多的时候，难道页面要写十几个 onChange 事件去实现页面的数据驱动视图的更新吗？这样考虑一下其实是不妥的;
    
*   这个时候 rc-form 就应运而生了，rc-form 创建一个数据集中管理仓库，这个仓库负责统一收集表单数据验证、重置、设置、获取值等逻辑操作，这样我们就把重复无用功交给 rc-form 来处理了，以达到代码的高度可复用性!
    

### 主要 Api 简要说明

Api 名称

说明

类型

getFieldDecorator

用于和表单进行双向绑定，

Function(name)

getFieldsValue

获取一组字段名对应的值，会按照对应结构返回。默认返回现存字段值，当调用 `getFieldsValue(true)` 时返回所有值

(nameList?: [NamePath](https://link.juejin.cn?target=https%3A%2F%2Fant.design%2Fcomponents%2Fform-cn%2F%23NamePath "https://ant.design/components/form-cn/#NamePath")\[\], filterFunc?: (meta: { touched: boolean, validating: boolean }) => boolean) => any

getFieldValue

获取对应字段名的值

(name: [NamePath](https://link.juejin.cn?target=https%3A%2F%2Fant.design%2Fcomponents%2Fform-cn%2F%23NamePath "https://ant.design/components/form-cn/#NamePath")) => any

setFieldsValue

设置一组表单的值

(values) => void

setFields

设置一组字段状态

(fields: [FieldData](https://link.juejin.cn?target=https%3A%2F%2Fant.design%2Fcomponents%2Fform-cn%2F%23FieldData "https://ant.design/components/form-cn/#FieldData")\[\]) => void

validateFields

触发表单验证

(nameList?: [NamePath](https://link.juejin.cn?target=https%3A%2F%2Fant.design%2Fcomponents%2Fform-cn%2F%23NamePath "https://ant.design/components/form-cn/#NamePath")\[\]) => Promise

isFieldValidating

检查一组字段是否正在校验

(name: [NamePath](https://link.juejin.cn?target=https%3A%2F%2Fant.design%2Fcomponents%2Fform-cn%2F%23NamePath "https://ant.design/components/form-cn/#NamePath")) => boolean

getFieldProps

获取对应字段名的属性

(name: [NamePath](https://link.juejin.cn?target=https%3A%2F%2Fant.design%2Fcomponents%2Fform-cn%2F%23NamePath "https://ant.design/components/form-cn/#NamePath")) => any

### 使用 rc-form

```jsx
import { createForm } from "../../rc-form";
// import ReactClass from './ReactClass'

    const RcForm = (props) => {
        const {
        form: { getFieldDecorator, validateFields },
        } = props;
        
            const handleSubmit = (e) => {
            e && e.stopPropagation();
                validateFields((err, value) => {
                    if (!err) {
                    console.log(value);
                }
                });
                };
                return (
                <div style={{ padding: 20, background: "#fff" }} >
                <form>
                <label>姓名:</label>
                    {getFieldDecorator("username", {
                    rules: [{ required: true, message: "请输入用户名!" }],
                    initialValue:'initialValue',
                })(<input type="text" />)}
                <br />
                <label>密码:</label>
                    {getFieldDecorator("password", {
                        rules: [
                        { required: true, message: "请输入密码!" },
                    { pattern: /^[a-z0-9_-]{6,18}$/, message:'只允许数字!' }
                    ],
                })(<input type="password" style={{ marginTop: "15px" }} /> )}
                <br />
                <button onClick={handleSubmit} style={{ marginTop: "15px" }}>
                提交
                </button>
                </form>
                </div>
                );
                };
                export default createForm()(RcForm);
                
```

> 注意: 经过 createForm 方法处理的组件（就是 Ant Design 中 Form 的 create( ) 方法），会自动向组件没注入 form 对象，组件本身也就拥有了这些 Api 。

*   Demo 只是简单的基于 rc-form 实现了表单的装饰、表单验证、数据收集等功能。那么如何实现更加具有针对性的，适用多种业务场景的表单组件呢?
    
*   绕开优秀的开源的组件库不说，如果哪一天这些优秀的开源作品不再开源了，那我们怎么办？
    
*   为了避免这种情况发生，或者如果仅是为了我们自己的职业生涯规划，使自己更上一层楼的话也是有必要的去学习一下优秀的三方库的设计理念。就算看一下别人的代码风格也是有必要的。其实还是需要我们自己了解 rc-form 的设计思路的；只有了解了这些优秀开源作品的精髓，我们即使不用开源库，也可以封装自己的代码库以及类似 Ant Design 中 Form 这些优秀的组件的。
    

### 从 createForm 开始

都知道我们平时编写业务组件一般只要用到表单都会用到 createForm 或者 Form.create( ) 这些方法对自己的组件进行包装，那么我们就从这里开始我们的故事。

```javascript
import createBaseForm from './createBaseForm';

    function createForm(options) {
    return createBaseForm(options, [mixin]);
}

export default createForm;
```

可以看到其实 createForm 只是做了一层封装，真正的调用函数是 createBaseForm，那么着重看一下 createBaseForm 函数内部实现。

![createBaseForm](/images/jueJin/31017cf7cf1a400.png)

上面的图片中可以看出这个函数利用闭包特性返回一个新函数，这个函数的参数其实就是你的业务组件对象，经过 createBaseForm 内部加工之后返回给你的是一个注入了 form 对象的组件。也就是我们常说的这个 createBaseForm 是一个高阶组件。

那么也就清楚了 Ant Design 的 `Form.create()` 方法就是 `rc-form` 中的 `createBaseForm` 方法的替代！经过 `createBaseForm` 包装的组件将会注入 form 对象， 而 `form` 属性中提供的 getFieldDecorator 以及 fieldsStore 实例则是实现数据自动收集的关键。

### 浅析内部实现

我们就先从最初的的渲染表单的逻辑开始，我们业务场景中用到的表单组件都会使用 getFieldDecorator 包装一下。当然，我说的是 Ant Design 4.0 以前的版本， 那么我们就先从这里开始看起。

这里首先说明一下，此篇文章我只是浅析一下整个表单数据双向绑定的简单过程，因为这个是 rc-form 的核心，精力有限具体的细节处理留待以后慢慢研究。那么我们就来看一下 `getFieldDecorator` 方法做了些什么？

```js
    getFieldDecorator(name, fieldOption) {
    const props = this.getFieldProps(name, fieldOption);
        return fieldElem => {
        // We should put field in record if it is rendered
        this.renderFields[name] = true;
        
        const fieldMeta = this.fieldsStore.getFieldMeta(name);
        const originalProps = fieldElem.props;
        fieldMeta.originalProps = originalProps;
        fieldMeta.ref = fieldElem.ref;
            const decoratedFieldElem = React.cloneElement(fieldElem, {
            ...props,
            ...this.fieldsStore.getFieldValuePropValue(fieldMeta),
            });
            return supportRef(fieldElem) ? (
            decoratedFieldElem
            ) : (
            <FieldElemWrapper name={name} form={this}>
        {decoratedFieldElem}
        </FieldElemWrapper>
        );
        };
        },
```

此处我删除了一些无关紧要的代码，因为这样看起来更加清晰明了。 首先对传入的表单组件调用 getFieldProps 方法进行了 props 的构建处理，接着返回一个函数，这个函数参数就是我们使用 getFieldDecorator 传入的表单组件，调用 fieldsStore 中的 getFieldMeta 获取表单组件的配置数据，兼容原有组件的配置属性以及对不支持 ref 组件的处理，最终返回一个克隆后的挂载处理后的一些配置对象的组件！

#### fieldsStore

既然用到了 fieldsStore，那么这里要说一下 fieldsStore，fieldsStore 中包含了当前 form 的主要信息和一些处理表单数据的方法。

```js
    class FieldsStore {
        constructor(fields) {
        this.fields = internalFlattenFields(fields);
        this.fieldsMeta = {};
    }
}
```

fieldMeta 可以看成是一个表单项的描述，以传入的 name 为索引 key，支持嵌套、存储表单数据， 即配置信息不涉及值的问题，主要包括：

*   name 字段的名称
*   originalProps 被 getFieldDecorator( ) 装饰的组件的原始 props
*   rules 校验的规则
*   trigger 触发数据收集的时机 默认 `onChange`
*   validate 校验规则和触发事件
*   valuePropName 子节点的值的属性，例如 checkbox 应该设为 `checked`
*   getValueFromEvent 如何从 event 中获取组件的值
*   hidden 为 true 时，校验或者收集数据时会忽略这个字段

fields 主要用于记录每个表单的实时属性，主要包括：

*   dirty 数据是否已经改变，但未校验
    
*   errors 校验文案
    
*   name 字段名称
    
*   touched 数据是否更新过
    
*   value 字段的值
    
*   validating 校验状态
    

那么接下来还是要看一下 getFieldProps 方法内部是如何实现 props 构建的?

```javascript
    getFieldProps(name, usersFieldOption = {}) {
    // 重新组装 props
        const fieldOption = {
        name,
        trigger: DEFAULT_TRIGGER,
        valuePropName: 'value',
        validate: [],
        ...usersFieldOption,
        };
            const {
            rules,
            trigger,
            validateTrigger = trigger,
            validate,
            } = fieldOption;
            const fieldMeta = this.fieldsStore.getFieldMeta(name);
            // 初始值处理
                if ('initialValue' in fieldOption) {
                fieldMeta.initialValue = fieldOption.initialValue;
            }
            // 组装 inputProps
                const inputProps = {
                ...this.fieldsStore.getFieldValuePropValue(fieldOption),
                ref: this.getCacheBind(name, `${name}__ref`, this.saveRef),
                };
                    if (fieldNameProp) {
                    inputProps[fieldNameProp] = formName ? `${formName}_${name}` : name;
                }
                
                // 收集验证规则
                const validateRules = normalizeValidateRules(validate, rules, validateTrigger);
                const validateTriggers = getValidateTriggers(validateRules);
                    validateTriggers.forEach((action) => {
                    if (inputProps[action]) return;
                    inputProps[action] = this.getCacheBind(name, action, this.onCollectValidate);
                    });
                    
                    // 不走效验的组件使用 onCollect 收集组件的值
                        if (trigger && validateTriggers.indexOf(trigger) === -1) {
                        inputProps[trigger] = this.getCacheBind(name, trigger, this.onCollect);
                    }
                    
                    return inputProps;
                    },
```

删除了一些细节代码, 先来看看 getFieldProps 首先进行了默认值的处理，如果用户没有设置 `trigger` 和 `valuePropName` 则使用默认值，随后调用 `fieldsStore` 中的`getFieldMeta` 方法，`fieldsStore` 实例对象在整个过程中尤为关键，它的作用是作为一个数据中心，让我们免除了手动去维护 `form` 中绑定的各个值。那么我们看一下 `fieldsStore.getFieldMeta` 做了那些工作？

```javascript
    getFieldMeta(name) {
    this.fieldsMeta[name] = this.fieldsMeta[name] || {};
    return this.fieldsMeta[name];
}
```

此函数作用在于根据组件传递的 name 属性获取数据中心的 fieldMeta，如果没有则默认空对象，也就是首次渲染返回初始值。 重要的是 inputProps 的组装环节，第一步调用 `getFieldValuePropValue` 方法获取当前 props，然后加入 ref 属性，接下来是效验规则的收集。

```js
const validateRules = normalizeValidateRules(validate, rules, validateTrigger);
const validateTriggers = getValidateTriggers(validateRules);
    validateTriggers.forEach((action) => {
    if (inputProps[action]) return;
    inputProps[action] = this.getCacheBind(name, action, this.onCollectValidate);
    });
    
        if (trigger && validateTriggers.indexOf(trigger) === -1) {
        inputProps[trigger] = this.getCacheBind(name, trigger, this.onCollect);
    }
```

`validateRules` 即是所有的表单组件效验规则，`validateTriggers` 即所有效验规则触发的事件名， 那么我们就看一下 `nomalizeValidateRules` 以及 `getValidateTriggers` 方法是如何收集验证规则的。

```js
    function normalizeValidateRules(validate, rules, validateTrigger) {
        const validateRules = validate.map((item) => {
            const newItem = {
            ...item,
            trigger: item.trigger || [],
            };
                if (typeof newItem.trigger === 'string') {
                newItem.trigger = [newItem.trigger];
            }
            return newItem;
            });
                if (rules) {
                    validateRules.push({
                    trigger: validateTrigger
                    ? [].concat(validateTrigger)
                    : [],
                    rules,
                    });
                }
                return validateRules;
            }
            
                function getValidateTriggers(validateRules) {
                return validateRules
                .filter(item => !!item.rules && item.rules.length)
                .map(item => item.trigger)
                .reduce((pre, curr) => pre.concat(curr), []);
            }
            
```

其会将 `validate`、 `rules` 组合，返回一个数组，其内部的元素为一个个规则对象，并且每个元素都存在一个可以为空的 `trigger` 数组，并且将 `validateTrigger` 作为 `rule` 的 `triggers` 推入 `validateRules` 中，我们回回头看一下 `validateTrigger`。

```js
    const fieldOption = {
    name,
    trigger: DEFAULT_TRIGGER,
    valuePropName: 'value',
    validate: [],
    ...usersFieldOption,
    };
    
        const {
        rules,
        trigger,
        validateTrigger = trigger,
        validate,
        } = fieldOption;
```

这里可以看出如果用户配置了触发验证方法时默认使用配置的 `trigger`，如果用户没有设置 `trigger` 则默认使用默认 `onChange`。

`getValidateTriggers` 则是将所有触发事件统一收集至一个数组，随后通过 forEach 循环将所有 `validateTriggers` 中的事件都绑定上同一个处理函数 getCacheBind 上。

```js
    validateTriggers.forEach((action) => {
    if (inputProps[action]) return;
    inputProps[action] = this.getCacheBind(
    name,
    action,
    this.onCollectValidate
    );
    });
```

下面再来看一下触发验证规则绑定事件 action 的 getCacheBind 函数做了哪些操作？

```js
    getCacheBind(name, action, fn) {
        if (!this.cachedBind[name]) {
        this.cachedBind[name] = {};
    }
    const cache = this.cachedBind[name];
    if (
    !cache[action] ||
    cache[action].oriFn !== fn
        ) {
            cache[action] = {
            fn: fn.bind(this, name, action),
            oriFn: fn,
            };
        }
        return cache[action].fn;
        },
```

暂且忽略 cachedBind 方法，这里可以看到 getCacheBind 方法主要对传入的 fn 做了一个改变 this 指向的逻辑处理，真正的处理函数则是 `onCollectValidate`，那我们来看一下 `onCollectValidate` 做了什么？

```js
    onCollectValidate(name_, action, ...args) {
    const { field, fieldMeta } = this.onCollectCommon(name_, action, args);
        const newField = {
        ...field,
        dirty: true,
        };
        this.fieldsStore.setFieldsAsDirty();
        
            this.validateFieldsInternal([newField], {
            action,
            options: {firstFields: !!fieldMeta.validateFirst,},
            });
            },
            
```

当 `onCollectValidate` 被调用，也就是数据校验函数被触发时，首先调用了 onCollectCommon 方法，那么这个函数是干什么的？

```js
    onCollectCommon(name, action, args) {
    const fieldMeta = this.fieldsStore.getFieldMeta(name);
        if (fieldMeta[action]) {
        fieldMeta[action](...args);
            } else if (fieldMeta.originalProps && fieldMeta.originalProps[action]) {
            fieldMeta.originalProps[action](...args);
        }
        const value = fieldMeta.getValueFromEvent ?
        fieldMeta.getValueFromEvent(...args) :
        getValueFromEvent(...args);
            if (onValuesChange && value !== this.fieldsStore.getFieldValue(name)) {
            const valuesAll = this.fieldsStore.getAllValues();
            const valuesAllSet = {};
            valuesAll[name] = value;
            Object.keys(valuesAll).forEach(key => set(valuesAllSet, key, valuesAll[key]));
                onValuesChange({
                [formPropName]: this.getForm(),
                ...this.props
                }, set({}, name, value), valuesAllSet);
            }
            const field = this.fieldsStore.getField(name);
            return ({ name, field: { ...field, value, touched: true }, fieldMeta });
            },
            
```

`onCollectCommon` 主要是获取了包装组件最新的值，随后将其包装在对象中返回，返回后将其组装为一个新的名为 `newField` 的对象。

而 `fieldsStore.setFieldsAsDirty` 则是标记包装组件的校验状态，暂且略过，随后执行 `validateFieldsInternal`，我们看一下 validateFieldsInternal 函数。

```js
validateFieldsInternal(
fields,
{ fieldNames, action, options = {} },
callback,
    ) {
    const allRules = {};
    const allValues = {};
    const allFields = {};
    const alreadyErrors = {};
        fields.forEach(field => {
        const name = field.name;
            if (options.force !== true && field.dirty === false) {
                if (field.errors) {
                set(alreadyErrors, name, { errors: field.errors });
            }
            return;
        }
        const fieldMeta = this.fieldsStore.getFieldMeta(name);
            const newField = {
            ...field,
            };
            newField.errors = undefined;
            newField.validating = true;
            newField.dirty = true;
            allRules[name] = this.getRules(fieldMeta, action);
            allValues[name] = newField.value;
            allFields[name] = newField;
            });
            this.setFields(allFields);
            // in case normalize
                Object.keys(allValues).forEach(f => {
                allValues[f] = this.fieldsStore.getFieldValue(f);
                });
                    if (callback && isEmptyObject(allFields)) {
                    callback(
                    isEmptyObject(alreadyErrors) ? null : alreadyErrors,
                    this.fieldsStore.getFieldsValue(fieldNames),
                    );
                    return;
                }
                // console.log(allRules);
                const validator = new AsyncValidator(allRules);
                    if (validateMessages) {
                    // console.log(validateMessages);
                    validator.messages(validateMessages);
                }
                    validator.validate(allValues, options, errors => {
                        const errorsGroup = {
                        ...alreadyErrors,
                        };
                        // ...
                        const expired = [];
                        const nowAllFields = {};
                            Object.keys(allRules).forEach(name => {
                            const fieldErrors = get(errorsGroup, name);
                            const nowField = this.fieldsStore.getField(name);
                            // avoid concurrency problems
                                if (!eq(nowField.value, allValues[name])) {
                                    expired.push({
                                    name,
                                    });
                                        } else {
                                        nowField.errors = fieldErrors && fieldErrors.errors;
                                        nowField.value = allValues[name];
                                        nowField.validating = false;
                                        nowField.dirty = false;
                                        nowAllFields[name] = nowField;
                                    }
                                    });
                                    this.setFields(nowAllFields);
                                    // ...
                                }
                                
```

因为 `validateFieldsInternal` 主要逻辑都是在调用 `AsyncValidator` 进行异步校验以及对特殊场景的处理，我们暂时略过只看数据收集部分，我们看到在最后调用了 `this.setFields(allFields);` 并传入了新的值，接下来就看一下 `setFields` 方法。

```js
    setFields(maybeNestedFields, callback) {
    const fields = this.fieldsStore.flattenRegisteredFields(maybeNestedFields);
    this.fieldsStore.setFields(fields);
        if (onFieldsChange) {
        const changedFields = Object.keys(fields)
        .reduce((acc, name) => set(acc, name, this.fieldsStore.getField(name)), {});
            onFieldsChange({
            [formPropName]: this.getForm(),
            ...this.props
            }, changedFields, this.fieldsStore.getNestedAllFields());
        }
        this.forceUpdate(callback);
        },
        
```

我们可以看到，`setFields` 首先对传入的值进行与初始化相似的验证，随后调用 fieldsStore 实例中的 setFields 方法将值存入 `fieldsStore`， 暂时忽略 `onFieldsChange`，之后调用 `forceUpdate` 更新视图。到此，我们简单的描述了整个流程。

#### 表单数据双向绑定

表单数据更新大致流程如下：

![forceUpdate](/images/jueJin/89ccfd515d48482.png)

**总结:**

*   用户输入或者选择表单组件的行为都会触发 getFieldDecorator(HOC) 高阶组件，进而调用 getFieldProps 组装组件 props，这个方法中如果表单组件中配置了 validateRules 以及 validateTriggers 的话（也就是 rules 对象）就调用 onCollectValidate 方法收集效验规则。然后就是设置表单组件的最新的值到 fieldsStore 中， 并调用 this.forceUpdate( ) 更新 UI 视图！
    
*   如果我们没有配置 validateRules 以及 validateTriggers 等规则，那就使用 onCollect 方法收集最新的数据并更新到 fieldsStore 中。不对表单进行单独验证,，从而在设置最新值 setFields 方法中调用 this.forceUpdate( ) 更新 UI 视图！
    

#### 整体设计思路

![fremework](/images/jueJin/08d067e47d49477.png)

**总结:**

*   总之 rc-form 内部有自己的状态管理，fieldsStore 记录着所有表单项的信息，通过 getFieldDecorator 和表单进行双向绑定；
*   真正的区别在于用不用表单规则验证，不用就 onCollect，否则使用 onCollectValidate，但是必然都会使用 onCollectCommon；
*   onCollectCommon 方法内部展示了 onCollect 取值的细节，forceUpdate 在更新组件后，触发 render 方法，接着又回到一开始 getFieldDecorator 中获取 fieldStore 内的值，返回被修改后的组件。

> 想一下假如当我改变输入框的值得时候是不是会引起表单的重新渲染的问题。 所以这也就导致了渲染性能的问题! 那么必然会有优化的方法，有兴趣的可以看看 rc-field-form。

文章只是整体浅析实现思路，如有不同意见，欢迎联系我交流！

推荐阅读
----

[Vite 特性和部分源码解析](https://link.juejin.cn?target=https%3A%2F%2Fzoo.team%2Farticle%2Fabout-vite "https://zoo.team/article/about-vite")

[我在工作中是如何使用 git 的](https://juejin.cn/post/6974184935804534815 "https://juejin.cn/post/6974184935804534815")

[Serverless Custom (Container) Runtime](https://juejin.cn/post/6981921291980767269 "https://juejin.cn/post/6981921291980767269")

开源作品
----

*   政采云前端小报

**开源地址 [www.zoo.team/openweekly/](https://link.juejin.cn?target=https%3A%2F%2Fwww.zoo.team%2Fopenweekly%2F "https://www.zoo.team/openweekly/")** (小报官网首页有微信交流群)

招贤纳士
----

政采云前端团队（ZooTeam），一个年轻富有激情和创造力的前端团队，隶属于政采云产品研发部，Base 在风景如画的杭州。团队现有 40 余个前端小伙伴，平均年龄 27 岁，近 3 成是全栈工程师，妥妥的青年风暴团。成员构成既有来自于阿里、网易的“老”兵，也有浙大、中科大、杭电等校的应届新人。团队在日常的业务对接之外，还在物料体系、工程平台、搭建平台、性能体验、云端应用、数据分析及可视化等方向进行技术探索和实战，推动并落地了一系列的内部技术产品，持续探索前端技术体系的新边界。

如果你想改变一直被事折腾，希望开始能折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变既定的节奏，将会是“5 年工作时间 3 年工作经验”；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊… 如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的前端团队的成长历程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 `ZooTeam@cai-inc.com`

![](/images/jueJin/98d3aa3d1f8646a.png)