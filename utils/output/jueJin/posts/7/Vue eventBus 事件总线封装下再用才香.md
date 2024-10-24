---
author: "Gaby"
title: "Vue eventBus 事件总线封装下再用才香"
date: 2022-06-22
description: "现在的项目中是不是在使用 eventbus 的时候，还有很多人都是直接创建一个vue 实例直接使用的，哪里需要哪里引入，而没有简单的处理下。这里就封装个简单灵活的，可以直接用在项目上。"
tags: ["JavaScript","面试","架构中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:44,comments:33,collects:87,views:11158,"
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第23天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

废话只说一句：码字不易求个👍，收藏 === 学会,快行动起来吧！🙇‍🙇‍🙇‍。

现在的项目中是不是在使用 eventbus 的时候，还有很多人都是直接创建一个vue 实例直接使用的，哪里需要哪里引入，而没有简单的处理下。接下来就先说下这种方式。

### 空vue实例构建的事件总线

在改造一个项目的时候就发现，里面的 bus.js 文件中就是这么处理的。两行代码搞定。

```js
import Vue from "vue";
export default new Vue()
```

使用的时候，就没那么简单了，有这么一个空的容器，在需要传值的组件里就得引入这个文件。然后通过 bus.on()绑定事件，通过bus.on() 绑定事件，通过 bus.on()绑定事件，通过bus.emit()进行分发事件。

```js
import bus from'@/utils/bus'
// 绑定事件
bus.$on('event',()=>{....})

// 监听事件
bus.$emit('event',this.tasks)
```

这种方式使用起来也简单但也不太方便，毕竟到处都要引入下，那有没有什么办法可以解决呢。继续...

### 简单的方式

先来个简单的吧，虽然看上去有点不太习惯，但的确也挺好使的，而且直接挂载到vue实例上，哪里用哪里直接 `this` 即可，相对来说方便多了，不用到处引入文件了。挂载方式如下：

```js
    new Vue({
        beforeCreate() {
        // 尽量早地执行挂载全局事件总线对象的操作
        Vue.prototype.$bus = this;
        },
        router,
        store,
        render: h => h(App)
        }).$mount('#app');
```

这种方式虽然挂载简单，但是使用上还是有点不能尽如人意，不信你看：

```js
// 绑定事件
this.$bus.$on('send', ()=>{ // 使用事件 });

// 分发事件
this.$bus.$emit('send', 'emit');
```

猛地一看，这不挺好的么，挺简单的啊！可是我有洁癖怎么办，我有强迫症怎么办，我就不想看到两个 `$`符怎么办我就只想要下面的这种方式的：

```js
// 绑定事件
this.$bus.on('send', ()=>{ // 使用事件 });

// 分发事件
this.$bus.emit('send', 'emit');
```

那你说，人家都是 `$on`、`$emit`的用的，怎么就不行了啊，实在不行就自己改造个吧，说干就干，who 怕 who，安排！

### 复杂又简单的方式

先构思下，想要个什么样效果的，比如，我不想要用的时候都要引入下文件，要一次引入，处处可用; 我不想要两个 `$` 的调用方式，或者说可以随心情的使用; 再者通过Vue对象也可以直接使用。

思路大概理了理，那就开干呗，简单干脆点，直接上代码！

```js
// /utils/bus.js
'use strict';
import Vue from 'vue';

    function VueBus(Vue) {
    let bus = new Vue();
    
        Object.defineProperties(bus, {
            on: {
                get() {
                return this.$on.bind(this);
            }
            },
                once: {
                    get() {
                    return this.$once.bind(this);
                }
                },
                    off: {
                        get() {
                        return this.$off.bind(this);
                    }
                    },
                        emit: {
                            get() {
                            return this.$emit.bind(this);
                        }
                    }
                    });
                    
                        Object.defineProperty(Vue, 'bus', {
                            get() {
                            return bus;
                        }
                        });
                        
                            Object.defineProperty(Vue.prototype, '$bus', {
                                get() {
                                return bus;
                            }
                            });
                                if (typeof window !== 'undefined' && window.Vue) {
                                window.Vue.use(VueBus);
                            }
                            
                            return bus;
                        }
                        
                        export default VueBus;
                        
                        /**
                        * import { EventBus } from '@/libs/bus';
                        *
                        * EventBus.$bus.on('interceptors', () => {});
                        * EventBus.$bus.emit('interceptors', 'value');
                        */
                        const EventBus = new Vue();
                        export { EventBus };
```

来看看使用方式吧，是不是跟想象的一样简单，在 `main.js` 中引入，并通过 `vue.use()` 注入进来，加载方式就这么简单。

```js
import EventBus from '@/libs/bus';

Vue.use(EventBus);
```

使用上更灵活了，想怎么用就怎么用，支持以下几种方式，至于`$off`、`$once`使用上通 `$on`、`$emit`一样。

```js
// 绑定事件
this.$bus.on('send', this.handleSend); // 推荐
this.$bus.$on('send', this.handleSend);
Vue.bus.on('send', this.handleSend);
Vue.bus.$on('send', this.handleSend);

// 分发事件
this.$bus.emit('send', ''); // 推荐
this.$bus.$emit('send', 'emit');
Vue.bus.emit('send', 'emit');
Vue.bus.$emit('send', 'emit');
```

还可以按需引入使用，有时候在非组件的 js 文件中使用，就需要直接引用了，那么就可以:

```js
import { EventBus } from '@/libs/bus';

EventBus.$bus.on('interceptors', () => {});
EventBus.$bus.emit('interceptors', 'value');
```

上面这几种方式均可。是不是更灵活了呢。想怎么用就怎么用,再也不用担心会写错调用方式了。如果你觉得太灵活，可以删减并且对团队进行规范约束，采用一种方式执行。

事物都有两面性，没有好坏之分，且全在于使用者，好钢用在刀刃上，不滥用即可。有其他更好的方式则优先使用。