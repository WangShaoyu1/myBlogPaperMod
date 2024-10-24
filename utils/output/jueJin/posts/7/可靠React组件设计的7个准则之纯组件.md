---
author: "无名之苝"
title: "可靠React组件设计的7个准则之纯组件"
date: 2019-08-14
description: "原文的篇幅非常长，不过内容太过于吸引我，还是忍不住要翻译出来。此篇文章对编写可重用和可维护的React组件非常有帮助。但因为篇幅实在太长，我对文章进行了分割，本篇文章重点阐述 纯组件和几乎纯组件 。因水平有限，文中部分翻译可能不够准确，如果你有更好的想法，欢迎在评论区指出。 在…"
tags: ["React.js","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:61,comments:0,collects:45,views:5078,"
---
> 翻译：刘小夕
> 
> 原文链接：[dmitripavlutin.com/7-architect…](https://link.juejin.cn?target=https%3A%2F%2Fdmitripavlutin.com%2F7-architectural-attributes-of-a-reliable-react-component%2F "https://dmitripavlutin.com/7-architectural-attributes-of-a-reliable-react-component/")

原文的篇幅**非常**长，不过内容太过于吸引我，还是忍不住要翻译出来。此篇文章对编写可重用和可维护的React组件非常有帮助。但因为篇幅实在太长，我对文章进行了分割，本篇文章重点阐述 纯组件和几乎纯组件 。因水平有限，文中部分翻译可能不够准确，如果你有更好的想法，欢迎在评论区指出。

**更多优质文章可戳:** [github.com/YvetteLau/B…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYvetteLau%2FBlog "https://github.com/YvetteLau/Blog")

———————————————我是一条分割线————————————————

纯组件和几乎纯组件
---------

> 纯组件总是为相同的属性值渲染相同的元素。几乎纯的组件总是为相同的属性值呈现相同的元素，但是会产生副作用。

在函数编程属于中，对于给定的相同输入，纯函数总是返回相同的输出，并且不会对外界产生副作用。

```
    function sum(a, b) {
    return a + b;
}
sum(5, 10); // => 15
```

对于给定的两个数字，`sum()` 函数总是会返回相同的结果。

当一个函数输入相同，而输出不同时，它就不是一个纯函数。当这个函数依赖于全局的状态时，就不是一个纯函数，例如：

```
let said = false;

    function sayOnce(message) {
        if (said) {
        return null;
    }
    said = true;
    return message;
}

sayOnce('Hello World!'); // => 'Hello World!'
sayOnce('Hello World!'); // => null
```

`sayOnce('Hello World!')` 第一次调用时，返回 `Hello World`.

即使输入参数相同，都是 `Hello World`，但是第二次调用 `sayOnce('Hello World!')`，返回的结果是 `null` 。这里有一个非纯函数的**特征**：依赖全局状态 `said`

`sayOnce()` 的函数体内，`said = true` 修改了全局状态，对外界产生的副作用，这也是非纯函数的特征之一。

而纯函数没有副作用且不依赖于全局状态。只要输入相同，输出一定相同。因此，纯函数的结果是可预测的，确定的，可以复用，并且易于测试。

`React` 组件也应该考虑设计为纯组件，当 `prop` 的值相同时， 纯组件(注意区分`React.PureComponent`)渲染的内容相同，一起来看例子:

```
    function Message({ text }) {
    return <div className="message">{text}</div>;
}

<Message text="Hello World!" />
// => <div class="message">Hello World</div>
```

当传递给 `Message` 的 `prop` 值相同时，其渲染的元素也相同。

想要确保所有的组件都是纯组件是不可能的，有时候，你需要知道与外界交互，例如下面的例子：

```
    class InputField extends Component {
        constructor(props) {
        super(props);
        this.state = { value: '' };
        this.handleChange = this.handleChange.bind(this);
    }
    
        handleChange({ target: { value } }) {
        this.setState({ value });
    }
    
        render() {
        return (
        <div>
        <input
        type="text"
    value={this.state.value}
onChange={this.handleChange}
/>
You typed: {this.state.value}
</div>
);
}
}

```

`<InputField>` 组件，不接受任何 `props`，而是根据用户的输入内容渲染输出。`<InputField>` 必须是非纯组件，因为它需要通过 `input` 输入框与外界交互。

非纯组件是必要的，大多数应用程序中都需要全局状态，网络请求，本地存储等。你所能做的就是将 纯组件和非纯组件隔离，也就是说将你的组件进行**提纯**。

![](/images/jueJin/16c7ffd96d460d8.png)

非纯代码显式的表明了它有副作用，或者是依赖全局状态。在隔离状态下，不纯代码对系统其它部分的不可预测的影响较小。

让我们详细介绍一下提纯的例子。

### 案例研究：从全局变量中提取纯组件

我不喜欢全局变量，因为它们打破了封装，创造了不可预测的行为，并且使测试变得困难。

全局变量可以作为可变对象或者是不可变对象使用。

可变的全局变量使得组件的行为难以控制，数据可以随意的注入和修改，影响[协调](https://link.juejin.cn?target=https%3A%2F%2Freact.docschina.org%2Fdocs%2Freconciliation.html "https://react.docschina.org/docs/reconciliation.html")过程，这显然是错误的。

如果你需要可变的全局状态，那么你可以考虑使用 `Redux` 来管理你的应用程序状态。

不可变的全局变量通常是应用程序的配置对象，这个对象中包含站点名称、登录用户名或者其它的配置信息。

以下代码定义一个包含站点名称的配置对象：

```
    export const globalConfig = {
    siteName: 'Animals in Zoo'
    };
```

`<Header>` 组件渲染应用的头部，包括展示站点名称: `Animals in Zoo`

```
import { globalConfig } from './config';

    export default function Header({ children }) {
    const heading =
    globalConfig.siteName ? <h1>{globalConfig.siteName}</h1> : null;
    return (
    <div>
{heading}
{children}
</div>
);
}
```

`<Header>` 组件使用 `globalConfig.siteName` 来展示站点名称，当 `globalConfig.siteName` 未定义时，不显示。

首先需要注意的是 `<Header>` 是非纯组件。即使传入的 `children` 值相同，也会因为 `globalConfig.siteName` 值的不同返回不同的结果。

```
// globalConfig.siteName is 'Animals in Zoo'
<Header>Some content</Header>
// Renders:
<div>
<h1>Animals in Zoo</h1>
Some content
</div>
```

或:

```
// globalConfig.siteName is `null`
<Header>Some content</Header>
// Renders:
<div>
Some content
</div>
```

其次，测试变得困难重重，为了测试组件如何处理站点名为 `null`，我们不得不手动地设置 `globalConfig.siteName = null`

```
import assert from 'assert';
import { shallow } from 'enzyme';
import { globalConfig } from './config';
import Header from './Header';

    describe('<Header />', function () {
        it('should render the heading', function () {
        const wrapper = shallow(
        <Header>Some content</Header>
        );
        assert(wrapper.contains(<h1>Animals in Zoo</h1>));
        });
        
            it('should not render the heading', function () {
            // Modification of global variable:
            globalConfig.siteName = null;
            const wrapper = shallow(
            <Header>Some content</Header>
            );
            assert(appWithHeading.find('h1').length === 0);
            });
            });
```

为了测试而修改 `globalConfig.siteName = null` 是不方便的。发生这种情况是因为 `<Heading>` 对全局变量有很强的依赖。

为了解决这个问题，可以将全局变量作为组件的输入，而非将其注入到组件的作用域中。

我们来修改一下 `<Header>` 组件，使其多接受一个 `siteNmae` 的`prop`， 然后使用 `recompose` 库中的 [`defaultProps`](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Facdlite%2Frecompose%2Fblob%2Fmaster%2Fdocs%2FAPI.md%23defaultprops "https://github.com/acdlite/recompose/blob/master/docs/API.md#defaultprops") 高阶组件来包装组件，`defaultProps` 可以保证在没有传入`props`时，使用默认值。

```
import { defaultProps } from 'recompose';
import { globalConfig } from './config';

    export function Header({ children, siteName }) {
    const heading = siteName ? <h1>{siteName}</h1> : null;
    return (
    <div className="header">
{heading}
{children}
</div>
);
}

    export default defaultProps({
    siteName: globalConfig.siteName
    })(Header);
```

`<Header>` 变成了一个纯函数组合，不再直接依赖 `globalConfig` 变量，让测试变得简单。

同时，当我们没有设置 `siteName`时，`defaultProps` 会传入 `globalConfig.siteName` 作为 `siteName` 属性值。这就是不纯代码被分离和隔离开的地方。

现在让我们测试纯版本的 `<Header>` 组件：

```
import assert from 'assert';
import { shallow } from 'enzyme';
import { Header } from './Header'; // Import the pure Header

    describe('<Header />', function () {
        it('should render the heading', function () {
        const wrapper = shallow(
        <Header siteName="Animals in Zoo">Some content</Header>
        );
        assert(wrapper.contains(<h1>Animals in Zoo</h1>));
        });
        
            it('should not render the heading', function () {
            const wrapper = shallow(
            <Header siteName={null}>Some content</Header>
            );
            assert(appWithHeading.find('h1').length === 0);
            });
            });
```

现在好了，测试纯组件 `<Header>` 很简单。测试做了一件事：验证组件是否呈现给定输入的预期元素。无需导入、访问或修改全局变量，无副作用。设计良好的组件易于测试。

### 案例研究：从网络请求中提取纯组件

回顾 `<WeatherFetch>` 组件，当其挂载时，它会发出网络请求去获取天气信息。

```
    class WeatherFetch extends Component {
        constructor(props) {
        super(props);
        this.state = { temperature: 'N/A', windSpeed: 'N/A' };
    }
    
        render() {
        const { temperature, windSpeed } = this.state;
        return (
        <WeatherInfo temperature={temperature} windSpeed={windSpeed} />
        );
    }
    
        componentDidMount() {
            axios.get('http://weather.com/api').then(function (response) {
            const { current } = response.data;
                this.setState({
                temperature: current.temperature,
                windSpeed: current.windSpeed
                })
                });
            }
        }
        
```

`<WeatherFetch>` 是非纯组件，因为相同的输入会产生不同的输出，因为组件渲染依赖于服务端的返回结果。

不幸的是，`HTTP` 请求的副作用是无法消除的，`<WeatherFetch>` 的职责就是从服务端请求数据。

但是你可以让 `<WeatherFetch>` 为相同的属性值渲染相同的内容。这样就可以将副作用隔离到 `prop` 的函数属性 `fetch()` 上。这样的一个组件类型被称为几乎纯组件。

我们来将非纯组件`<WeatherFetch>`改写成几乎纯组件。 `Redux` 可以很好的帮助我们将副作用的实现细节从组件中提取出来。因此，我们需要设置一些 `Redux` 的结构。

`fetch()` `action creater` 启动服务器调用：

```
    export function fetch() {
        return {
        type: 'FETCH'
        };
    }
```

`redux-saga` 拦截了 `Fetch action`， 实际想服务端请求，当请求完成时，派发 `FETCH_SUCCESS` 的 `action`

```
import { call, put, takeEvery } from 'redux-saga/effects';

    export default function* () {
        yield takeEvery('FETCH', function* () {
        const response = yield call(axios.get, 'http://weather.com/api');
        const { temperature, windSpeed } = response.data.current;
            yield put({
            type: 'FETCH_SUCCESS',
            temperature,
            windSpeed
            });
            });
        }
```

这个 `reducer` 负责更新应用的状态。

```
const initialState = { temperature: 'N/A', windSpeed: 'N/A' };

    export default function (state = initialState, action) {
        switch (action.type) {
        case 'FETCH_SUCCESS':
            return {
            ...state,
            temperature: action.temperature,
            windSpeed: action.windSpeed
            };
            default:
            return state;
        }
    }
```

ps: 为了简单起见，省略了 `Redux store` 和 `sagas` 的初始化。

尽管使用 `Redux` 需要额外的结构，例如: `actions` ,`reducers` 和 `sagas`，但是它有助于使得 `<WeatherFetch>` 成为几乎纯组件。

我们来修改一下 `<WeatherFetch>` ，使其和 `Redux` 结合起来。

```
import { connect } from 'react-redux';
import { fetch } from './action';

    export class WeatherFetch extends Component {
        render() {
        const { temperature, windSpeed } = this.props;
        return (
        <WeatherInfo temperature={temperature} windSpeed={windSpeed} />
        );
    }
    
        componentDidMount() {
        this.props.fetch();
    }
}

    function mapStateToProps(state) {
        return {
        temperature: state.temperate,
        windSpeed: state.windSpeed
        };
    }
    export default connect(mapStateToProps, { fetch });
    
```

`connect(mapStateToProps, { fetch })` HOC 包装了 `<WeatherFetch>`.

当组件挂载时，`action creator` `this.props.fetch()` 被调用，触发服务端请求，当请求完成时， `Redux` 更新应用的 `state`，使得 `<WeatherFetch>` 从 `props` 中接收 `temperature` 和 `windSpeed`。

`this.props.fetch` 是为了隔离产生副作用的非纯代码。因为 `Redux` 的存在，组件内部不再需要使用 `axois` 库，请求 `URL` 或者是处理 `promise`。此外，新版本的 `<WeatherFetch>`会为相同的`props`值渲染相同的元素。这个组件变成了几乎纯组件。

与非纯版本相比，测试几乎纯版本 `<WeatherFetch>` 更加容易：

```
import assert from 'assert';
import { shallow, mount } from 'enzyme';
import { spy } from 'sinon';
// Import the almost-pure version WeatherFetch
import { WeatherFetch } from './WeatherFetch';
import WeatherInfo from './WeatherInfo';

    describe('<WeatherFetch />', function () {
        it('should render the weather info', function () {
    function noop() { }
    const wrapper = shallow(
    <WeatherFetch temperature="30" windSpeed="10" fetch={noop} />
    );
    assert(wrapper.contains(
    <WeatherInfo temperature="30" windSpeed="10" />
    ));
    });
    
        it('should fetch weather when mounted', function () {
        const fetchSpy = spy();
        const wrapper = mount(
        <WeatherFetch temperature="30" windSpeed="10" fetch={fetchSpy} />
        );
        assert(fetchSpy.calledOnce);
        });
        });
```

你需要检查，给定的 `prop` 值，`<WeatherFetch>`的渲染结果是否与预期一致，并在挂载时调用 `fetch()`。简单且明了。

### 将几乎纯组件转换成纯组件

实际上，在这一步，你不在需要分离不纯的代码，几乎纯组件具有良好的可预测性，并且易于测试。

但是...我们一起来看看兔子洞究竟有多深。几乎纯版本的 `<WeatherFetch>` 组件可以被转换成一个理想的纯组件。

我们来将 `fetch` 回调提取到 `recompose` 库的 [`lifecycle()`](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Facdlite%2Frecompose%2Fblob%2Fmaster%2Fdocs%2FAPI.md%23lifecycle "https://github.com/acdlite/recompose/blob/master/docs/API.md#lifecycle") 高阶组件中。

```
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { fetch } from './action';

    export function WeatherFetch({ temperature, windSpeed }) {
    return (
    <WeatherInfo temperature={temperature} windSpeed={windSpeed} />
    );
}

    function mapStateToProps(state) {
        return {
        temperature: state.temperate,
        windSpeed: state.windSpeed
        };
    }
    
    export default compose(
    connect(mapStateToProps, { fetch }),
        lifecycle({
            componentDidMount() {
            this.props.fetch();
        }
        })
        )(WeatherFetch);
        
```

`lifecycle()` 高阶组件接受一个有生命周期方法的对象。 调用 `this.props.fecth()` 方法的 `componentDidMount()` 由高阶组件处理，将副作用从 `<WeatherFetch>` 中提取出来。

现在，`<WeatherFetch>` 是一个纯组件，它不再有副作用，并且当输入的属性值 `temperature` 和 `windSpeed` 相同时，输出总是相同。

虽然纯版本的 `<WeatherFetch>` 在可预测性和捡东西方面很好，但是它需要类似 `compose()` 、`lifecycle()` 等高阶组件，因此，通常，是否将几乎纯组件转换成纯组件需要我们去权衡。

**最后谢谢各位小伙伴愿意花费宝贵的时间阅读本文，如果本文给了您一点帮助或者是启发，请不要吝啬你的赞和Star，您的肯定是我前进的最大动力。[github.com/YvetteLau/B…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYvetteLau%2FBlog "https://github.com/YvetteLau/Blog")**

> ### 关注公众号，加入技术交流群

![](/images/jueJin/16d1120a80282ab.png)