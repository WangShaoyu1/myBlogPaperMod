---
author: "叶知秋水"
title: "React.ForwardRef探索：更简单的替代方案"
date: 2024-07-06
description: "介绍react的ref、forwardRef的使用场景，包括函数组件和类组件的。深入分析其优缺点，及替换方案。"
tags: ["前端","React.js"]
ShowReadingTime: "阅读7分钟"
weight: 138
---
![未命名__2024-07-06+05_38_11.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9769722a25f4db4bb59c235d7877280~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1350&h=575&s=227267&e=jpg&b=f0f0f0)

理解React中的ref
============

当我们向一个原生HTML元素，比如`<input>`，传递一个ref时，它会自动附加到DOM节点上。这样我们就可以使用这个节点的原生DOM API。

jsx

 代码解读

复制代码

`import React, { useRef, useEffect } from 'react'; const App = () => {   const inputRef = useRef(null);   useEffect(() => {     if (inputRef.current) {       // 访问DOM节点       inputRef.current.focus();     }   }, []);   return <input ref={inputRef} />; };`

对于类组件，ref会附加到类的实例上，允许我们访问其内部属性和方法，这不需要什么额外的操作。

js

 代码解读

复制代码

`// 子组件 class ChildComponent extends Component {   doSomething = () => {     console.log('子组件的方法被调用');   } } // 父组件 class ParentComponent extends Component {   childRef = React.createRef();   render() {     return <ChildComponent ref={this.childRef} />;   }   componentDidMount() {     // 调用子组件的方法     if (this.childRef.current) {       this.childRef.current.doSomething();     }   } }`

然而，对于函数组件，会显示警告，因为 `ref` 是一个特殊的属性，它不是传递给组件的 props 的一部分，而是 React 用来提供对 DOM 元素或组件实例的直接访问的引用。

js

 代码解读

复制代码

`const Child = (props) => {   console.log(props); //输出{name: '123'}   return <div ref={props.ref}>1231231231</div>; }; export default () => {   const childRef = useRef(null);   window.childRef = childRef;   return <Child ref={childRef} name="123" />; };`

正常情况下函数组件只有一个形参，props里拿不到ref的值。

为了使ref能够在函数组件中工作，我们需要使用forwardRef API将其包装起来：

jsx

 代码解读

复制代码

`import React, { forwardRef, useRef } from 'react'; const Child = forwardRef((props, ref) => {   return <div ref={ref} />; }); const App = () => {   const childRef = useRef(null);   return <Child ref={childRef} />; };`

上面两个例子中，类组件挂载了ref就能立即访问子组件的实例，而函数组件由于自身只是一个函数不是类，所以没有实例一说。

类组件是否需要forwardRef
=================

用类组件里的ChildComponent也可以使用forwardRef。

js

 代码解读

复制代码

`class ChildComponent extends Component {   doSomething = () => {     console.log('子组件的方法被调用');   }   render() {        return (            <div tabIndex="0" ref={this.props.ref}>                Child Component           </div>        );    } } // 使用 forwardRef 包装类组件  const ForwardedChildComponent = forwardRef((props, ref) => {      return <ChildComponent {...props} ref={ref} />;  });`

那这会不会显得多此一举？

使用 `forwardRef` 转发类组件并不完全是多此一举。虽然在某些情况下，直接在函数组件中使用 `ref` 可能看起来更简单，但 `forwardRef` 提供了一些重要的好处，特别是在与类组件一起使用时：

1.  **保持组件的声明性**：`forwardRef` 允许你以声明性的方式将 `ref` 转发到子组件，这与 React 的组件化哲学一致。
    
2.  **兼容性**：如果你的应用程序中混合使用了函数组件和类组件，`forwardRef` 可以确保 `ref` 可以在它们之间无缝传递。
    
3.  **DOM 元素访问**：当你需要从父组件访问子组件的 DOM 元素时（例如，为了设置焦点或测量尺寸），`forwardRef` 可以很容易地实现这一点，即使子组件是一个类组件。
    
4.  **组件实例方法**：如果你需要从父组件调用子组件的特定方法，`forwardRef` 可以让你做到这一点，特别是当结合 `useImperativeHandle` 钩子时。
    
5.  **避免额外的渲染**：在某些情况下，如果父组件需要根据子组件的状态或属性更新 `ref`，直接使用 `ref` 可能会导致子组件进行不必要的重新渲染。`forwardRef` 可以帮助避免这种情况。
    
6.  **库和第三方组件**：如果你在使用第三方库或组件，这些组件可能是类组件，`forwardRef` 可以让你更容易地与这些组件集成。
    
7.  **未来迁移的灵活性**：随着 React 社区越来越多地采用函数组件和 Hooks，使用 `forwardRef` 可以为你的应用程序提供更大的灵活性，以便在未来迁移到函数组件。
    

总之，虽然在某些情况下使用 `forwardRef` 可能看起来有些多余，但它提供了一些重要的好处，特别是在处理复杂的组件树和需要与现有代码库集成时。

函数组件如何通过ref暴露接入点
================

在类组件中，我们暴露给ref的是组件的实例，那在函数组件里是否有可能暴露一些方法和属性呢？

这需要用到`useImperativeHandle`

js

 代码解读

复制代码

`function ParentComponent() {   const ref = useRef(null);   function handleRef(refValue) {     // 这里 refValue 就是 ref 的当前值   }   return <ChildComponent refCallback={handleRef} />; } function ChildComponent({ refCallback }) {   useImperativeHandle(refCallback, () => ({     // 这里可以返回一个对象，其方法或属性将作为 ref 的回调函数   }));   return <div>Child</div>; }`

更简单的替代方案
========

既然props无法直接读取ref，那我们可以使用callback函数，这算是一种折中的办法吧，函数组件和类组件都可以用。

js

 代码解读

复制代码

`class ChildComponent extends React.Component {   componentDidMount() {     if (this.props.refCallback222) {       this.props.refCallback222(this);     }   }   render() {     return <div>1231231231</div>;   } } export default () => {   const childRef = useRef(null);   return (     <>       {/* <Child ref={childRef} name="123" /> */}       <ChildComponent         refCallback222={(vm) => (childRef.current = vm)}         name="123"       />     </>   ); };`

当然，还有更简单的，使用自定义ref属性。我们可以使用任何其他属性名称，如`firstInputRef`，代替`ref`。这种模式与函数组件自动工作，解决了上述所有问题：

jsx

 代码解读

复制代码

`import React, { Ref, useRef, useEffect } from 'react'; interface ChildProps {   firstInputRef: Ref<HTMLInputElement>; } const Child = ({ firstInputRef }: ChildProps) => {   return (     <div>       <input ref={firstInputRef} />     </div>   ); }; const App = () => {   const inputRef = useRef(null);   useEffect(() => {     if (inputRef.current) {       console.log(inputRef.current);     }   }, []);   return <Child firstInputRef={inputRef} />; };`

**结论**

在React中，`forwardRef`是一个高阶组件，它允许一个组件将`ref`属性传递给其子组件。这在React组件树中非常有用，尤其是在以下情况下：

1.  访问子组件的方法或属性：当你需要访问一个子组件的实例属性或调用其方法时，`forwardRef`可以使得父组件能够直接引用子组件的`ref`。
    
2.  DOM操作：如果你需要直接操作子组件的DOM元素，`forwardRef`可以让你将`ref`传递给子组件，然后使用原生DOM API进行操作。
    
3.  集成第三方组件：当使用第三方组件库时，如果这些组件需要访问DOM或需要被父组件引用，`forwardRef`可以使得这种集成更加容易。
    
4.  解决组件嵌套问题：在深层嵌套的组件结构中，`forwardRef`可以帮助你绕过多层组件，直接访问到底层组件的`ref`。
    
5.  高阶组件（HOC）：在使用高阶组件时，如果HOC需要将`ref`传递给被包装的组件，`forwardRef`可以使得这种传递成为可能。
    
6.  函数式组件和类组件的兼容性：在React 16.3之前，`ref`只能传递给DOM元素或类组件的实例。`forwardRef`使得函数式组件也能够接收`ref`，提高了代码的灵活性。
    

**forwardRef的问题**

*   **不支持多个Refs**：forwardRef只允许一个参数，这使得在没有变通方法的情况下处理多个refs变得繁琐。例如：

jsx

 代码解读

复制代码

`import React, { forwardRef, Ref, useImperativeHandle, useRef } from 'react'; interface FormHandles {   inputRef1: Ref<HTMLInputElement>;   inputRef2: Ref<HTMLInputElement>; } const Form = forwardRef((props, ref) => {   const inputRef1 = useRef(null);   const inputRef2 = useRef(null);   useImperativeHandle(ref, () => ({     inputRef1,     inputRef2   }));   return (     <form>       <input ref={inputRef1} />       <input ref={inputRef2} />     </form>   ); }); const App = () => {   const formRef = useRef<FormHandles>(null);   return <Form ref={formRef} />; };`

*   **开发工具中的匿名函数**：使用forwardRef中的箭头函数会在开发工具中显示为匿名函数，除非你两次命名该函数。
*   **Dev Tools中的匿名函数**：使用带有forwardRef的箭头函数会导致Dev Tools中的匿名函数，除非您命名该函数两次：

javascript

 代码解读

复制代码

`const NamedComponent = forwardRef<HTMLDivElement>((props, ref) => (   <div ref={ref}>Named Component</div> ));`

*   **额外的样板代码**：我们需要使用额外的API和导入，这增加了代码的复杂性，降低了可读性。
*   **嵌套组件**：通过多层组件传递refs增加了不必要的复杂性。
*   **不具描述性的属性名称**：通用的ref名称如ref不具描述性，使人不清楚ref被附加在哪里。
*   **泛型类型问题**：forwardRef破坏了TypeScript的泛型，使得类型推断更困难且不可靠。
*   **潜在的性能问题**：将组件包装在forwardRef中可能会减慢渲染速度，尤其是在有大量组件的压力测试中。

即使从React中移除forwardRef，也不会有太大影响。实际上，已经有一个开放的RFC提议将其移除。

在大多数情况下，使用自定义ref属性是比forwardRef更好的解决方案。它简化了我们的代码，提高了可读性，并避免了多个问题。forwardRef只在特定场景下是必需的，比如单一元素代理组件或模拟实例refs。随着新的RFC可能移除forwardRef，我们可以期待一种更简单、更直观的方式来处理React中的refs。