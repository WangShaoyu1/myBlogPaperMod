---
author: "无名之苝"
title: "可靠React组件设计的7个准则之终篇"
date: 2019-08-20
description: "本篇文章重点阐述 可测试和富有意义。因水平有限，文中部分翻译可能不够准确，如果你有更好的想法，欢迎在评论区指出。 尽管 组合、复用 和 纯组件 三个准则在掘金平台似乎不太受欢迎，不过本着有始有终的原则，当然我个人始终还是觉得此篇文章非常优质，还是坚持翻译完了。本篇是最后 可靠R…"
tags: ["React.js","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读11分钟"
weight: 1
selfDefined:"likes:57,comments:0,collects:55,views:4042,"
---
> 翻译：刘小夕
> 
> 原文链接：[dmitripavlutin.com/7-architect…](https://link.juejin.cn?target=https%3A%2F%2Fdmitripavlutin.com%2F7-architectural-attributes-of-a-reliable-react-component%2F "https://dmitripavlutin.com/7-architectural-attributes-of-a-reliable-react-component/")

本篇文章重点阐述 可测试和富有意义。因水平有限，文中部分翻译可能不够准确，如果你有更好的想法，欢迎在评论区指出。

尽管 `组合`、`复用` 和 `纯组件` 三个准则在掘金平台似乎不太受欢迎，不过本着有始有终的原则，当然我个人始终还是觉得此篇文章非常优质，还是坚持翻译完了。本篇是最后 `可靠React组件设计` 的最后一篇，希望对你的组件设计有所帮助。

更多文章可戳: [github.com/YvetteLau/B…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYvetteLau%2FBlog "https://github.com/YvetteLau/Blog")

———————————————我是一条分割线————————————————

如果你还没有阅读过前几个原则:

*   [可靠React组件设计的7个准则之SRP](https://juejin.cn/post/6844903908372905998 "https://juejin.cn/post/6844903908372905998")
*   [可靠React组件设计的7个准则之封装](https://juejin.cn/post/6844903909148852237 "https://juejin.cn/post/6844903909148852237")
*   [可靠React组件设计的7个准则之组合和复用](https://juejin.cn/post/6844903910809813005 "https://juejin.cn/post/6844903910809813005")
*   [可靠React组件设计的7个准则之纯组件](https://juejin.cn/post/6844903912663678990 "https://juejin.cn/post/6844903912663678990")

可测试和经过测试
--------

> **经过测试**的组件验证了其在给定输入的情况下，输出是否符合预期。
> 
> **可测试**组件易于测试。

如何确保组件按预期工作？你可以不以为然地说：“我通过手动验证其正确性”。

如果你计划手动验证每个组件的修改，那么迟早，你会跳过这个繁琐的环节，进而导致你的组件迟早会出现缺陷。

这就是为什么自动化组件验证很重要：进行单元测试。单元测试确保每次进行修改时，组件都能正常工作。

单元测试不仅涉及早期错误检测。 另一个重要方面是能够验证组件架构是否合理。

我发现以下几点特别重要：

> 一个不可测试或难以测试的组件很可能设计得很糟糕。

组件很难测试往往是因为它有很多 `props`、依赖项、需要原型和访问全局变量，而这些都是设计糟糕的标志。

当组件的架构设计很脆弱时，就会变得难以测试，而当组件难以测试的时候，你大概念会跳过编写单元测试的过程，最终的结果就是：组件未测试。

![](/images/jueJin/16c9a5ff5fd1144.png)

总之，需要应用程序未经测试的原因都是因为设计不当，即使你想测试这样的应用，你也做不到。

### 案例学习：可测试意味着良好的设计

我们来测试一下 [封装章节](https://juejin.cn/post/6844903909148852237#heading-3 "https://juejin.cn/post/6844903909148852237#heading-3")的两个版本的 `<Controls>` 组件。

```
import assert from 'assert';
import { shallow } from 'enzyme';

    class Controls extends Component {
        render() {
        return (
        <div className="controls">
        <button onClick={() => this.updateNumber(+1)}>
        Increase
        </button>
        <button onClick={() => this.updateNumber(-1)}>
        Decrease
        </button>
        </div>
        );
    }
        updateNumber(toAdd) {
            this.props.parent.setState(prevState => ({
            number: prevState.number + toAdd
            }));
        }
    }
    
        class Temp extends Component {
            constructor(props) {
            super(props);
            this.state = { number: 0 };
        }
            render() {
            return null;
        }
    }
    
        describe('<Controls />', function () {
            it('should update parent state', function () {
            const parent = shallow(<Temp />);
            const wrapper = shallow(<Controls parent={parent} />);
            
            assert(parent.state('number') === 0);
            
            wrapper.find('button').at(0).simulate('click');
            assert(parent.state('number') === 1);
            
            wrapper.find('button').at(1).simulate('click');
            assert(parent.state('number') === 0);
            });
            });
```

我们可以看到 `<Controls>` 测试起来很复杂，因为它依赖父组件的实现细节。

测试时，需要一个额外的组件 `<Temp>`，它模拟父组件，验证 `<Controls>` 是否正确修改了父组件的状态。

当 `<Controls>` 独立于父组件的实现细节时，测试会变得更加容易。现在我们来看看正确封装的版本是如何测试的:

```
import assert from 'assert';
import { shallow } from 'enzyme';
import { spy } from 'sinon';

    function Controls({ onIncrease, onDecrease }) {
    return (
    <div className="controls">
    <button onClick={onIncrease}>Increase</button>
    <button onClick={onDecrease}>Decrease</button>
    </div>
    );
}

    describe('<Controls />', function () {
        it('should execute callback on buttons click', function () {
        const increase = sinon.spy();
        const descrease = sinon.spy();
        const wrapper = shallow(
        <Controls onIncrease={increase} onDecrease={descrease} />
        );
        
        wrapper.find('button').at(0).simulate('click');
        assert(increase.calledOnce);
        wrapper.find('button').at(1).simulate('click');
        assert(descrease.calledOnce);
        });
        });
        
```

良好封装的组件，测试起来简单明了，相反，没有正确封装的组件难以测试。

可测试性是确定组件结构良好程度的实用标准。

富有意义
----

> 很容易一个有意义的组件作用是什么。

代码的可读性是非常重要的，你使用了多少次模糊代码？你看到了字符串，但是不知道意思是什么。

开发人员大部分时间都在阅读和理解代码，而不是实际编写代码。我们花75％的时间理解代码，花20％的时间修改现有代码，只有5％编写新的代码。

在可读性方面花费的额外时间可以减少未来队友和自己的理解时间。当应用程序增长时，命名实践变得很重要，因为理解工作随着代码量的增加而增加。

阅读有意义的代码很容易。然而，想要编写有意义的代码，需要清晰的代码实践和不断的努力来清楚地表达自己。

### 组件命名

#### 帕斯卡命名法

组件名是由一个或多个帕斯卡单词（主要是名词）串联起来的，比如：`<DatePicker>`、`<GridItem>`、`Application`、`<Header>`。

#### 专业化

组件越专业化，其名称可能包含的单词越多。

名为 `<HeaderMenu>` 的组件表示头部有一个菜单。 名称 `<SidebarMenuItem>` 表示位于侧栏中的菜单项。

当名称有意义地暗示意图时，组件易于理解。为了实现这一点，通常你必须使用详细的名称。那很好：更详细比不太清楚要好。

假设您导航一些项目文件并识别2个组件： `<Authors>` 和 `<AuthorsList>`。 仅基于名称，您能否得出它们之间的区别？ 很可能不能。

为了获取详细信息，你不得不打开 `<Authors>` 源文件并浏览代码。字后，你知道 `<Authors>` 从服务器获取作者列表并呈现 `<AuthorsList>` 组件。

更专业的名称而不是 `<Authors>` 不会创建这种情况。更好的名称如：`<FetchAuthors>`，`<AuthorsContainer>` 或 `<AuthorsPage>` 。

#### 一个单词 - 一个概念

一个词代表一个概念。例如，呈现项目概念的集合由列表单词表示。

每个概念对应一个单词，然后在整个应用程序中保持关系一致。结果是可预测的单词概念映射关系。

当许多单词表示相同的概念时，可读性会受到影响。例如，你定义一个呈现订单列表组件为：`<OrdersList>`，定义另一个呈现费用列表的组件为： `<ExpensesTable>`。

渲染项集合的相同概念由2个不同的单词表示：`list` 和 `table`。 对于相同的概念，没有理由使用不同的词。 它增加了混乱并打破了命名的一致性。

将组件命名为 `<OrdersList>` 和 `<ExpensesList>` （使用 `list`）或 `<OrdersTable>` 和`<ExpensesTable>`（使用 `table` ）。使用你觉得更好的词，只要保持一致。

#### 注释

组件，方法和变量的有意义的名称足以使代码可读。 因此，注释大多是多余的。

### 案例研究：编写自解释代码

常见的滥用注释是对无法识别和模糊命名的解释。让我们看看这样的例子：

```
// <Games> 渲染 games 列表
// "data" prop contains a list of game data
    function Games({ data }) {
    // display up to 10 first games
    const data1 = data.slice(0, 10);
    // Map data1 to <Game> component
    // "list" has an array of <Game> components
        const list = data1.map(function (v) {
        // "v" has game data
        return <Game key={v.id} name={v.name} />;
        });
        return <ul>{list}</ul>;
    }
    
    <Games
data=[{ id: 1, name: 'Mario' }, { id: 2, name: 'Doom' }]
/>
```

上例中的注释澄清了模糊的代码。 `<Games>`，`data`, `data1`, `v`,，数字 `10` 都是无意义的，难以理解。

如果重构组件，使用有意义的 `props` 名和变量名，那么注释就可以被省略：

```
const GAMES_LIMIT = 10;

    function GamesList({ items }) {
    const itemsSlice = items.slice(0, GAMES_LIMIT);
        const games = itemsSlice.map(function (gameItem) {
        return <Game key={gameItem.id} name={gameItem.name} />;
        });
        return <ul>{games}</ul>;
    }
    
    <GamesList
items=[{ id: 1, name: 'Mario' }, { id: 2, name: 'Doom' }]
/>
```

不要使用注释去解释你的代码，而是代码即注释。(小夕注：代码即注释很多人未必能做到，另外因团队成员水平不一致，大家还是应该编写适当的注释)

#### 表现力阶梯

我将一个组件表现力分为4个台阶。 组件在楼梯上的位置越低，意味着需要更多的努力才能理解。

![](/images/jueJin/16ca9d72bce172a.png)

> 你可以通过以下几种方式来了解组件的作用：

*   读取变量名 和 `props`
*   阅读文档/注释
*   浏览代码
*   咨询作者

如果变量名和 `props` 提供了足够的信息足以让你理解这个组件的作用和使用方式，那就是一种超强的表达能力。 尽量保持这种高质量水平。

有些组件具有复杂的逻辑，即使是好的命名也无法提供必要的细节。那么就需要阅读文档。

如果缺少文档或没有文档中没有回答所有问题，则必须浏览代码。由于花费了额外的时间，这不是最佳选择，但这是可以接受的。

在浏览代码也无助于理解组件时，下一步是向组件的作者询问详细信息。这绝对是错误的命名，并应该避免进入这一步。最好让作者重构代码，或者自己重构代码。

持续改进
----

重写是写作的本质。专业作家一遍又一遍地重写他们的句子。

要生成高质量的文本，您必须多次重写句子。阅读书面文字，简化令人困惑的地方，使用更多的同义词，删除杂乱的单词 - 然后重复，直到你有一段愉快的文字。

有趣的是，相同的重写概念适用于设计组件。有时，在第一次尝试时几乎不可能创建正确的组件结构，因为：

*   紧迫的项目排期不允许在系统设计上花费足够的时间
*   最初选择的方法是错误的
*   刚刚找到了一个可以更好地解决问题的开源库
*   或任何其他原因。

组件越复杂，就越需要验证和重构。

![](/images/jueJin/16caab3cf9047c4.png)

组件是否实现了单一职责，是否封装良好，是否经过充分测试？如果您无法回答某个肯定，请确定脆弱部分（通过与上述7个原则进行比较）并重构该组件。

实际上，开发是一个永不停止的过程，可以审查以前的决策并进行改进。

可靠性很重要
------

组件的质量保证需要努力和定期审查。这个投资是值得的，因为正确的组件是精心设计的系统的基础。这种系统易于维护和增长，其复杂性线性增加。

因此，在任何项目阶段，开发都相对方便。

另一方面，随着系统大小的增加，你可能忘记计划并定期校正结构，减少耦合。仅仅是是实现功能。

但是，在系统变得足够紧密耦合的不可避免的时刻，满足新要求变得呈指数级复杂化。你无法控制代码，系统的脆弱反而控制了你。错误修复会产生新的错误，代码更新需要一系列相关的修改。

悲伤的故事要怎么结束？你可能会抛弃当前系统并从头开始重写代码，或者很可能继续吃仙人掌。我吃了很多仙人掌，你可能也是，这不是最好的感觉。

解决方案简单但要求苛刻：编写可靠的组件。

结论
--

前文所说的7个准则从不用的角度阐述了同一个思想：

> 可靠的组件实现一个职责，隐藏其内部结构并提供有效的 `props` 来控制其行为。

单一职责和封装是 `solid` 设计的基础。(maybe你需要了解一下 solid 原则是什么。)

单一职责建议创建一个只实现一个职责的组件，并有一个改变的理由。

良好封装的组件隐藏其内部结构和实现细节，并定义 `props` 来控制行为和输出。

组合结构大的组件。只需将它们分成较小的块，然后使用组合进行整合，使复杂组件变得简单。

可复用的组件是精心设计的系统的结果。尽可能重复使用代码以避免重复。

网络请求或全局变量等副作用使组件依赖于环境。通过为相同的 `prop` 值返回相同的输出来使它们变得纯净。

有意义的组件命名和表达性代码是可读性的关键。你的代码必须易于理解和阅读。

测试不仅是一种自动检测错误的方式。如果你发现某个组件难以测试，则很可能是设计不正确。

成功的应用站在可靠的组件的肩膀上，因此编写可靠、可扩展和可维护的组件非常中重要。

在编写React组件时，你认为哪些原则有用？

**最后谢谢各位小伙伴愿意花费宝贵的时间阅读本文，如果本文给了您一点帮助或者是启发，请不要吝啬你的赞和Star，您的肯定是我前进的最大动力。[github.com/YvetteLau/B…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FYvetteLau%2FBlog "https://github.com/YvetteLau/Blog")**

> ### 关注公众号，加入技术交流群

![](/images/jueJin/16d1120a80282ab.png)