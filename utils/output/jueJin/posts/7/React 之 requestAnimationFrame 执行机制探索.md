---
author: "冴羽"
title: "React 之 requestAnimationFrame 执行机制探索"
date: 2022-11-14
description: "本篇我们讲讲 requestAnimationFrame 这个 API，就算不谈 React，2022 年了，这个 API 多少也是要知道一点的。"
tags: ["React.js","JavaScript","前端框架中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:84,comments:33,collects:74,views:9642,"
---
本文为稀土掘金技术社区首发签约文章，14天内禁止转载，14天后未获授权禁止转载，侵权必究！

前言
--

本篇我们讲讲 requestAnimationFrame 这个 API，就算不谈 React，2022 年了，这个 API 多少也是要知道一点的。

requestAnimationFrame
---------------------

requestAnimationFrame，简写 `rAF`，[引用 MDN 的介绍：](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWindow%2FrequestAnimationFrame "https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame")

> window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行

基本用法示例：

```jsx
    class App extends React.Component {
        componentDidMount() {
        const test = document.querySelector("#test");
            document.querySelector('button').addEventListener('click', () => {
            animation()
            });
            
            let count = 0;
                function animation() {
                if (count > 200) return;
                
                test.style.marginLeft = `${count}px`;
                count++;
                window.requestAnimationFrame(animation);
            }
            
        }
            render() {
            return (
            <div>
            <button style={{marginBottom: '10px'}}>开始</button>
            <div id="test" style={{width: '100px', height: '100px', backgroundColor: '#333'}} />
            </div>
            )
        }
    }
```

在这个例子中，我们点击按钮，执行 animation 函数，在 animation 函数中，执行 `requestAnimationFrame(animation)`，requestAnimationFrame 中又执行 animation，如此循环调用，直到临界条件（count > 200）。

动画效果如下（因为是 GIF 图的缘故，所以看起来有些卡顿，实际动画效果很流畅。）：

![4.gif](/images/jueJin/28631046f0944c2.png)

cancelAnimationFrame
--------------------

requestAnimationFrame 函数的返回值是一个 long 整数，请求 ID，是回调列表中唯一的标识。

你可以把这个值传给 `window.cancelAnimationFrame()` 以取消回调函数。

借助 cancelAnimationFrame，我们可以实现停止动画的效果：

```jsx
    class App extends React.Component {
        componentDidMount() {
        
        const test = document.querySelector("#test");
        let cancelReq;
        
            document.querySelector('#start').addEventListener('click', () => {
            animation()
            });
            
                document.querySelector('#stop').addEventListener('click', () => {
                window.cancelAnimationFrame(cancelReq);
                });
                
                let count = 0;
                    function animation() {
                    if (count > 200) return;
                    
                    test.style.marginLeft = `${count}px`;
                    count++;
                    cancelReq = window.requestAnimationFrame(animation);
                }
                
            }
                render() {
                return (
                <div>
                <button id="start" style={{marginBottom: '10px'}}>开始</button>
                <button id="stop" style={{marginBottom: '10px'}}>停止</button>
                <div id="test" style={{width: '100px', height: '100px', backgroundColor: '#333'}} />
                </div>
                )
            }
        }
```

动画效果如下：

![5.gif](/images/jueJin/8563fcafb6254d9.png)

执行时机
----

现在我们思考第一个问题，cancelAnimationFrame 的具体执行时机是什么时候？

根据前面 MDN 的介绍，我们知道，**回调函数会在浏览器下次重绘之前执行**，但这到底是什么意思呢？

我们在 [《React 之从视觉暂留到 FPS、刷新率再到显卡、垂直同步再到16ms的故事》](https://juejin.cn/post/7164394153848078350 "https://juejin.cn/post/7164394153848078350")这篇的最后，使用了这样一张图： ![image.png](/images/jueJin/f9f648e47f304af.png) 这张图描述了浏览器在一帧中需要完成的内容，从中我们可以看到 requestAnimationFrame 的执行时机，在 `Layout` 和 `Paint` 之前，为了让大家更好的体会这个执行时机，我们看个例子：

```javascript
const test = document.querySelector("#test");
test.style.transform = 'translate(0, 0)';

    document.querySelector('button').addEventListener('click', () => {
    
    test.style.transform = 'translate(400px, 0)';
    
        requestAnimationFrame(() => {
        test.style.transition = 'transform 3s linear';
        test.style.transform = 'translate(200px, 0)';
        });
        
        });
```

在这个例子中，我们一开始设置元素的 transform 为 `translate(0, 0)`，在点击的时候，设置 `translate(400px, 0)`，然后在 requestAnimationFrame 的回调中设置 `translate(200px, 0)`，你觉得 test 元素会向右移动还是向左移动呢？

我们先思考一下，在 `Life of a frame` 这张图中，我们也看到了，rAF 的执行时机在 JS 之后，Layout、Paint 之前，这也就意味着，`test.style.transform = 'translate(400px, 0)'` 和 `test.style.transform = 'translate(200px, 0)'`会在同一帧执行，所以后者会覆盖前者，这就相当于你只设置了 `translate(200px, 0)`，虽然有些违反直觉，但根据规范，应该是向右移动。

我们在 Chrome 下测试一下，发现也确实是向右移动：

![6.gif](/images/jueJin/91cffcdfa1ba4e1.png)

但如果你在 Chrome 尝试复现这个 demo 或者在其他浏览器上测试的时候，结果可能是向左移动。有的是因为浏览器实现问题，有的则是莫名的原因，比如在 Chrome 中，如果要复现向右移动，注意选择无痕模式，并关闭掉其他 tab 页。

那如果你想让这段代码稳定向右呢？那你就不要设置 `translate(400px, 0)`

那如果你想让这段代码稳定向左呢？你可以再套一个 requestAnimationFrame：

```javascript
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
        test.style.transition = 'transform 3s linear';
        test.style.transform = 'translate(200px, 0)';
        });
        })
```

这是因为 requestAnimationFrame 每帧只会执行 1 次。

在 React 的源码中就有这样的[测试代码](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Freact%2Fblob%2Fcae635054e17a6f107a39d328649137b83f25972%2Ffixtures%2Fscheduler%2Findex.html%23L200 "https://github.com/facebook/react/blob/cae635054e17a6f107a39d328649137b83f25972/fixtures/scheduler/index.html#L200")：

```javascript
    function logWhenFramesStart(testNumber, cb) {
        requestAnimationFrame(() => {
        updateTestResult(testNumber, 'frame 1 started');
            requestAnimationFrame(() => {
            updateTestResult(testNumber, 'frame 2 started');
                requestAnimationFrame(() => {
                updateTestResult(testNumber, 'frame 3 started... we stop counting now.');
                cb();
                });
                });
                });
            }
```

执行次数
----

在 [MDN 的介绍](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWindow%2FrequestAnimationFrame "https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame")中，有这样一句：

> 回调函数执行次数通常是每秒 60 次，但在大多数遵循 W3C 建议的浏览器中，回调函数执行次数通常与浏览器屏幕刷新次数相匹配。

我们先看前半句：“**回调函数执行次数通常是每秒 60 次**”，我们可以写个 demo 计算一下每次执行的间隔时间，requestAnimationFrame 的回调函数正好会被传入 DOMHighResTimeStamp 参数，它表示当前回调函数被触发的时间：

```javascript
let previousTimeStamp;

    class App extends React.Component {
        componentDidMount() {
        //...
        
            function animation(timestamp) {
            //...
            
                if (previousTimeStamp) {
                const elapsed = timestamp - previousTimeStamp;
                console.log(elapsed);
            }
            previousTimeStamp = timestamp
            
            window.requestAnimationFrame(animation);
        }
        
    }
        render() {
        //...
    }
}
```

打印结果如下：

![image.png](/images/jueJin/2619e519f18a4a2.png)

我们会发现间隔差不多是 16.66ms，每一秒差不多就是执行 60 次。

但是注意接下来这句：

> 但在大多数遵循 W3C 建议的浏览器中，回调函数执行次数通常与浏览器屏幕刷新次数相匹配

这就意味着，如果我们是比如每次执行的时候向右移动 1px，在高刷新率的屏幕中，因为每秒执行的次数更多，动画就会运行得更快。

因为我的设备无法修改刷新率，所以不能演示了，不过我们讨论一个问题：如果我们希望动画在不同刷新率的机器上速度差不多，怎么办？

我们可以借助回调函数传入的 DOMHighResTimeStamp 参数，判断出时间间隔，当间隔大于某个固定时间的时候，才执行动画效果，示例代码如下：

```javascript
let previousTimeStamp = 0;
    class App extends React.Component {
        componentDidMount() {
        //...
        
        let count = 0;
            function animation(timestamp) {
            if (count > 200) return;
            
            const elapsed = timestamp - previousTimeStamp;
                if (elapsed > 30) {
                test.style.marginLeft = `${count}px`;
                count++;
                previousTimeStamp = timestamp;
                console.log(elapsed)
            }
            
            requestAnimationFrame(animation);
        }
    }
        render() {
        //...
    }
}
```

打印结果如下：

![image.png](/images/jueJin/9ea08621c1a84e7.png)

现在间隔时间变成了 33ms，为什么是 33ms 而不是 30ms 或者 31ms 呢？因为就算控制了间隔时间，它还是按照帧来执行的，一帧 16.6，两帧 33.2，到第二帧的时候才符合了 `>30`这个条件。

兼容性
---

[requestAnimationFrame 兼容性](https://link.juejin.cn?target=https%3A%2F%2Fcaniuse.com%2F%3Fsearch%3DrequestAnimationFrame "https://caniuse.com/?search=requestAnimationFrame")如下：

![image.png](/images/jueJin/4b11415540044fe.png)

这兼容性，总结起来，就是还不错，用的时候也可以加个 polyfill，你可以使用 setTimeout 来模拟兜底，在 React 中就有[这样的代码](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Freact%2Fblob%2F4ea063b56ff7ccc69c4cc67c30fd6f31f9880464%2Fpackages%2Freact-dom-bindings%2Fsrc%2Fclient%2FReactDOMHostConfig.js%23L402 "https://github.com/facebook/react/blob/4ea063b56ff7ccc69c4cc67c30fd6f31f9880464/packages/react-dom-bindings/src/client/ReactDOMHostConfig.js#L402")：

```javascript
export const scheduleTimeout: any =
typeof setTimeout === 'function' ? setTimeout : (undefined: any);

const localRequestAnimationFrame =
typeof requestAnimationFrame === 'function'
? requestAnimationFrame
: scheduleTimeout;
```

这让人不禁思考一个问题，直接用 setTimeout 替代 requestAnimationFrame，效果是差不多的吗？

我们可以直接写一个 demo 试试：

```javascript
    document.querySelector('button').addEventListener('click', () => {
    animation()
    });
    
    let count = 0;
        function animation() {
        if (count > 200) return;
        
        test.style.marginLeft = `${count}px`;
        count++;
        
        setTimeout(animation, 0);
    }
```

动画效果如下：

![7.gif](/images/jueJin/3ec2eff684fa41f.png)

你会发现，使用 setTimeout 比用 requestAnimationFrame 动画快一些，我们尝试打印下间隔时间：

```javascript
let previousTimeStamp = 0;
const now = () => performance.now();

let count = 0;
    function animation() {
    if (count > 200) return;
    
    test.style.marginLeft = `${count}px`;
    count++;
    
    const elapsed = now() - previousTimeStamp;
    console.log(elapsed);
    previousTimeStamp = now()
    
    setTimeout(animation, 0);
}
```

打印结果如下：

![image.png](/images/jueJin/b592d9004085487.png)

间隔确实更短了一点，这是为什么呢？

其实也很容易理解，在 60Hz 下，浏览器只用在 16.6ms 完成 JS 执行、Layout、Paint 等内容就行，当执行完setTimeout 回调后，浏览器发现还有时间，于是又执行了几次 setTimeout 回调，最后再一起渲染，所以在原本一帧的时间内执行了多次 setTimeout 回调，动画自然就会快很多。

从性能图中也可以看出，在一帧的时间内执行了多次 setTimeout 函数：

![image.png](/images/jueJin/fea6f43bc12f4b1.png)

useAnimationFrame
-----------------

既然放在了 React 系列，我还是要强行跟 React 扯点关系。

我们可以将 requestAnimationFrame 封装成 hooks，方便在组件中使用，当然这已经有现成的 [use-animation-frame 包](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fuse-animation-frame "https://www.npmjs.com/package/use-animation-frame")可以使用，使用起来效果如下：

```javascript
import useAnimationFrame from 'use-animation-frame';

    const Counter = () => {
    const [time, setTime] = useState(0);
    useAnimationFrame(e => setTime(e.time));
    return <div>Running for:<br/>{time.toFixed(1)}s</div>;
    };
```

[use-animation-frame 源码](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffranciscop%2Fuse-animation-frame%2Fblob%2Fmaster%2Fsrc%2Findex.js "https://github.com/franciscop/use-animation-frame/blob/master/src/index.js")也很简单：

```javascript
import { useLayoutEffect, useRef } from "react";

// Reusable component that also takes dependencies
    export default (cb) => {
        if (typeof performance === "undefined" || typeof window === "undefined") {
        return;
    }
    
    const cbRef = useRef();
    const frame = useRef();
    const init = useRef(performance.now());
    const last = useRef(performance.now());
    
    cbRef.current = cb;
    
        const animate = (now) => {
        // In seconds ~> you can do ms or anything in userland
            cbRef.current({
            time: (now - init.current) / 1000,
            delta: (now - last.current) / 1000,
            });
            last.current = now;
            frame.current = requestAnimationFrame(animate);
            };
            
                useLayoutEffect(() => {
                frame.current = requestAnimationFrame(animate);
                return () => frame.current && cancelAnimationFrame(frame.current);
                }, []);
                };
```

React 系列
--------

1.  [React 之 createElement 源码解读](https://juejin.cn/post/7160981608885927972 "https://juejin.cn/post/7160981608885927972")
2.  [React 之元素与组件的区别](https://juejin.cn/post/7161320926728945701 "https://juejin.cn/post/7161320926728945701")
3.  [React 之 Refs 的使用和 forwardRef 的源码解读](https://juejin.cn/post/7161719602652086308 "https://juejin.cn/post/7161719602652086308")
4.  [React 之 Context 的变迁与背后实现](https://juejin.cn/post/7162002168529027079 "https://juejin.cn/post/7162002168529027079")
5.  [React 之 Race Condition](https://juejin.cn/post/7163202327594139679 "https://juejin.cn/post/7163202327594139679")
6.  [React 之 Suspense](https://juejin.cn/post/7163934860694781989 "https://juejin.cn/post/7163934860694781989")
7.  [React 之从视觉暂留到 FPS、刷新率再到显卡、垂直同步再到16ms的故事](https://juejin.cn/post/7164394153848078350 "https://juejin.cn/post/7164394153848078350")

React 系列的预热系列，带大家从源码的角度深入理解 React 的各个 API 和执行过程，全目录不知道多少篇，预计写个 50 篇吧。