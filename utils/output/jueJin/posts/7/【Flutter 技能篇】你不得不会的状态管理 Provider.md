---
author: ""
title: "【Flutter 技能篇】你不得不会的状态管理 Provider"
date: 2021-01-20
description: "Provider，Google 官方推荐的一种 Flutter 页面状态管理组件，它的实质其实就是对 InheritedWidget 的包装，使它们更易于使用和重用。关于 InheritedWidget 不做过多介绍，本篇文章主要较全面地介绍 Provider 的相关用法，能在…"
tags: ["Flutter","前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读12分钟"
weight: 1
selfDefined:"likes:102,comments:0,collects:101,views:7910,"
---
![](/images/jueJin/e24013c5e9ce444.png)

> 这是第 86 篇不掺水的原创，想获取更多原创好文，请搜索公众号关注我们吧~ 本文首发于政采云前端博客：[【Flutter 技能篇】你不得不会的状态管理 Provider](https://link.juejin.cn?target=https%3A%2F%2Fzoo.team%2Farticle%2Fflutter-and-provider "https://zoo.team/article/flutter-and-provider")

![](/images/jueJin/4952aa11e84b43b.png)

前言
--

Provider，Google 官方推荐的一种 Flutter 页面状态管理组件，它的实质其实就是对 InheritedWidget 的包装，使它们更易于使用和重用。关于 InheritedWidget 不做过多介绍，本篇文章主要较全面地介绍 Provider 的相关用法，能在业务场景中有所运用。

本篇文章示例源码：[github.com/xiaomanziji…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fxiaomanzijia%2FFlutterProvider "https://github.com/xiaomanzijia/FlutterProvider")

用法
--

### Step1:添加依赖

```dart
dependencies:
flutter:
sdk: flutter
# The following adds the Cupertino Icons font to your application.
# Use with the CupertinoIcons class for iOS style icons.
provider: ^4.0.4

```

### Step2:观察结构

执行`flutter pub get`后，可以在工程看到 provider 的 sdk 源码，结构如下：

![图片](/images/jueJin/44711db9a2ba457.png)

### Step3:示例简介

本示例将讲解 Provider 基础组件的使用，包括但不限于 ChangeNotifier, NotifierProvider, Consumer, Selector, ProxyProvider, FutureProvider, StreamProvider。

![图片](/images/jueJin/4d713b7679ca481.png)

### Step4:创建一个ChangeNotifier

我们先新建一个 Model1，继承 ChangeNotifier，使之成为我们的数据提供者之一。

```dart
    class Model1 extends ChangeNotifier {
    int _count = 1;
    int get count => _count;
        set count(int value) {
        _count = value;
        notifyListeners();
    }
}
```

追踪 ChangeProvider 源码，我们发现它并不属于 Provider，它其实是定义在 Flutter SDK foundation 下面的 change\_provider.dart 文件。ChangeNotifier 实现了 Listenable 抽象类，里面维护了一个 ObserverList。 Listenable 类源码：

```dart
    abstract class Listenable {
    const Listenable();
    factory Listenable.merge(List<Listenable> listenables) = _MergingListenable;
    void addListener(VoidCallback listener);
    void removeListener(VoidCallback listener);
}
```

可以看出，主要提供了 addListener 和 removeListener 两个方法。 ChangeNotifier 类源码：

```dart
    class ChangeNotifier implements Listenable {
    ObserverList<VoidCallback> _listeners = ObserverList<VoidCallback>();
        bool _debugAssertNotDisposed() {
            assert(() {
                if (_listeners == null) {
                    throw FlutterError.fromParts(<DiagnosticsNode>[
                    ErrorSummary('A $runtimeType was used after being disposed.'),
                    ErrorDescription('Once you have called dispose() on a $runtimeType, it can no longer be used.')
                    ]);
                }
                return true;
                }());
                return true;
            }
            @protected
                bool get hasListeners {
                assert(_debugAssertNotDisposed());
                return _listeners.isNotEmpty;
            }
                void addListener(VoidCallback listener) {
                assert(_debugAssertNotDisposed());
                _listeners.add(listener);
            }
            @override
                void removeListener(VoidCallback listener) {
                assert(_debugAssertNotDisposed());
                _listeners.remove(listener);
            }
            @mustCallSuper
                void dispose() {
                assert(_debugAssertNotDisposed());
                _listeners = null;
            }
            @protected
            @visibleForTesting
                void notifyListeners() {
                assert(_debugAssertNotDisposed());
                    if (_listeners != null) {
                    final List<VoidCallback> localListeners = List<VoidCallback>.from(_listeners);
                        for (VoidCallback listener in localListeners) {
                            try {
                            if (_listeners.contains(listener))
                            listener();
                                } catch (exception, stack) {
                                FlutterError.reportError(FlutterErrorDetails(
                                exception: exception,
                                stack: stack,
                                library: 'foundation library',
                                context: ErrorDescription('while dispatching notifications for $runtimeType'),
                                    informationCollector: () sync* {
                                    yield DiagnosticsProperty<ChangeNotifier>(
                                    'The $runtimeType sending notification was',
                                    this,
                                    style: DiagnosticsTreeStyle.errorProperty,
                                    );
                                    },
                                    ));
                                }
                            }
                        }
                    }
                }
```

除了实现 addListener 和 removeListener 外，还提供了 dispose 和 notifyListeners 两个方法。Model1 中，当我们更改 count 值时，就会调用 notifyListeners 方法通知UI更新。

### Step5:创建ChangeNotifierProvider

示例简介

![图片](/images/jueJin/ef40ad1cd11e4c3.png)

#### 方式一：通过ChangeNotifierProvider

```dart
return ChangeNotifierProvider(
    create: (context) {
    return Model1();
    },
    child: MaterialApp(
    theme: ArchSampleTheme.theme,
    home: SingleStatsView(),
    ),
    );
```

这里通过 ChangeNotifierProvider 的 create 把 ChangeNotifier（即 Model1）建立联系，作用域的范围在 child 指定的 MaterialApp，这里我们将 SingleStatsView 作为首页，SingleStatsView 里面使用了 Model1 作为数据源。需要注意的是，不要把所有状态的作用域都放在 MaterialApp，根据实际业务需求严格控制作用域范围，全局状态多了会严重影响应用的性能。

```dart
    class SingleStatsView extends StatelessWidget {
    @override
        Widget build(BuildContext context) {
        return Center(
        child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
            FlatButton(
            color: Colors.blue,
            child: Text('Model1 count++'),
                onPressed: () {
                Provider.of<Model1>(context, listen: false).count++;
                },
                ),
                Padding(
                padding: const EdgeInsets.only(bottom: 8.0),
                child: Text('Model count值变化监听',
                style: Theme.of(context).textTheme.title),
                ),
                Padding(
                padding: const EdgeInsets.only(bottom: 8.0),
                child: Text('Model1 count:${Provider.of<Model1>(context).count}',
                style: Theme.of(context)
                .textTheme
                .subhead
                .copyWith(color: Colors.green)),
                ),
                ],
                ),
                );
            }
        }
```

#### 方式二：通过ChangeNotifierProvider.value

```dart
return ChangeNotifierProvider.value(
value: Model1(),
child: MaterialApp(
theme: ArchSampleTheme.theme,
home: SingleStatsView(),
));
```

可以看出，和方式一相差无几，方式一用的 create 创建的 ChangeNotifier，这里用的 value 创建。追溯 ChangeNotifierProvider 源码：

```dart
    class ChangeNotifierProvider<T extends ChangeNotifier> extends ListenableProvider<T> {
        static void _dispose(BuildContext context, ChangeNotifier notifier) {
        notifier?.dispose();
    }
    
        ChangeNotifierProvider({
        Key key,
        @required Create<T> create,
        bool lazy,
        Widget child,
        }) : super(
        key: key,
        create: create,
        dispose: _dispose,
        lazy: lazy,
        child: child,
        );
        
            ChangeNotifierProvider.value({
            Key key,
            @required T value,
            Widget child,
            }) : super.value(
            key: key,
            value: value,
            child: child,
            );
        }
```

### Step6:在页面中监听状态变更，其他使用方式

示例

![图片](/images/jueJin/de96dd1d5d9f48b.png)

我们先了解下 ValueListenableBuilder，它可以监听指定值的变化进行 UI 更新，用法如下：

#### ValueNotifier

1.新建ValueNotifier

```dart
final ValueNotifier<int> _counter = ValueNotifier<int>(0);
```

在 builder 方法将之指定到 Model1 的 count ，这样当 Model1 中的 count 变化时 \_counter 也能监听到。

```dart
_counter.value = Provider.of<Model1>(context).count;
```

2.关联ValueListenableBuilder ValueListenableBuilder 的 valueListenable 可以绑定一个 ValueNotifier，用于监听 ValueNotifier 的值变化。

```dart
ValueListenableBuilder(
valueListenable: _counter,
builder: (context, count, child) => Text(
'ValueListenableBuilder count:$count'),
),
```

ValueNotifier源码：

```dart
    class ValueNotifier<T> extends ChangeNotifier implements ValueListenable<T> {
    ValueNotifier(this._value);
    @override
    T get value => _value;
    T _value;
        set value(T newValue) {
        if (_value == newValue)
        return;
        _value = newValue;
        notifyListeners();
    }
    @override
    String toString() => '${describeIdentity(this)}($value)';
}
```

可以看出，ValueNotifer 也是继承 ChangeNotifier，并实现了 ValueListenable，特别之处是在 set value 的时候调用了 notifyListeners，从而实现了状态变更监听。

#### MultiProvider

示例简介

![图片](/images/jueJin/fa931c73557f448.png)

一旦业务场景复杂，我们的页面可能需要监听多个 ChangeNotifier 的数据源，这时候MultiProvider 就派上用场了。该示例在 SingleStatsView 上进行了扩展，这里我们新建一个 MultiStatsView，监听 Model1 和 Model2 的数据变化。

Model2

```dart
    class Model2 extends ChangeNotifier {
    int _count = 1;
    int get count => _count;
        set count(int value) {
        _count = value;
        notifyListeners();
    }
}
```

MultiStatsView

```dart
    class MultiStatsView extends StatelessWidget {
    @override
        Widget build(BuildContext context) {
        return Center(
        child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
            FlatButton(
            color: Colors.blue,
            child: Text('Model1 count++'),
                onPressed: () {
                Provider.of<Model1>(context, listen: false).count++;
                },
                ),
                FlatButton(
                color: Colors.blue,
                child: Text('Model2 count++'),
                    onPressed: () {
                    Provider.of<Model2>(context, listen: false).count++;
                    },
                    ),
                    Padding(
                    padding: const EdgeInsets.only(bottom: 8.0),
                    child: Text('Model count值变化监听',
                    style: Theme.of(context).textTheme.title),
                    ),
                    Padding(
                    padding: const EdgeInsets.only(bottom: 8.0),
                    child: Text('Model1 count:${Provider.of<Model1>(context).count}',
                    style: Theme.of(context)
                    .textTheme
                    .subhead
                    .copyWith(color: Colors.green)),
                    ),
                    Padding(
                    padding: const EdgeInsets.only(bottom: 24.0),
                    child: Text('Model2 count:${Provider.of<Model2>(context).count}',
                    style: Theme.of(context)
                    .textTheme
                    .subhead
                    .copyWith(color: Colors.red)),
                    ),
                    ],
                    ),
                    );
                }
            }
```

使用 MultiProvider 关联 MultiStatsView，可以看出 MultiProvider 提供了 providers 数组，我们可以把 ChangeNotifierProvider 放进去。

```dart
return MultiProvider(
    providers: [
    ChangeNotifierProvider.value(value: Model1()),
    ChangeNotifierProvider.value(value: Model2()),
    ],
    child: MaterialApp(
    theme: ArchSampleTheme.theme,
        localizationsDelegates: [
        ArchSampleLocalizationsDelegate(),
        ProviderLocalizationsDelegate(),
        ],
        home: MultiStatsView(),
        ),
        );
```

若针对 MultiStatsView 仅提供 Model1 关联的 ChangeNotifierProvider，你会看到如下报错：

```dart
══╡ EXCEPTION CAUGHT BY WIDGETS LIBRARY ╞═══════════════════════════════════════════════════════════
The following ProviderNotFoundException was thrown building MultiStatsView(dirty, dependencies:
[_LocalizationsScope-[GlobalKey#48c61], _InheritedTheme, _DefaultInheritedProviderScope<Model1>]):
Error: Could not find the correct Provider<Model2> above this MultiStatsView Widget
To fix, please:
* Ensure the Provider<Model2> is an ancestor to this MultiStatsView Widget
* Provide types to Provider<Model2>
* Provide types to Consumer<Model2>
* Provide types to Provider.of<Model2>()
* Ensure the correct `context` is being used.
```

这是因为 Model2 没有注册导致。

#### ProxyProvider

从3.0.0开始，开始提供`ProxyProvider`。`ProxyProvider`可以将其他 provider 的值聚合为一个新对象，并且将结果传递给`Provider`。新对象会在其依赖的宿主 provider 更新后被更新。

新建一个 User 类

```dart
    class User {
    var name;
    User(this.name);
}
```

我们把 Model1 通过`ProxyProvider`聚合成 User 对象，然后取 User 对象中的`name`进行渲染。s

```dart
ProxyProvider<Model1, User>(
update: (context, value, previous) => User("change value ${value.count}"),
builder: (context, child) => Text(
'ProxyProvider: ${Provider.of<User>(context).name}',
style: Theme.of(context).textTheme.title),
)
```

可以看出，通过`ProxyProvider`方式，我们直接调用`Provider.of<User>(context)`取值，关联`User`的Provider我们并没有注册，也能有效运行。

#### FutureProvider

通过名字可以看出，这个 Provider 和异步执行有关，用法类似于`FutureBuilder`。这里用`FutureProvider`模拟2秒后更新 Model1 的初始值。可以在`initialData`指定初始值，create 方法指定具体的异步任务，builder 方法中可以用`Provider.of`取出异步任务执行返回的值进行页面渲染。还可以定义`catchError`捕获异常，`updateShouldNotify`比较新旧值是否 rebuild，新的 create/update 回调函数是懒加载的，也就是说它们在对应的值第一次被读取的时候才被调用，而非 provider 首次被创建时。如果不需要这个特性，可以将`lazy`属性值置为 false。

```dart
FutureProvider<Model1>(
    create: (context) {
    return Future.delayed(Duration(seconds: 2))
    .then((value) => Model1()..count = 11);
    },
    initialData: Model1(),
    builder: (context, child) => Text(
    'FutureProvider ${Provider.of<Model1>(context).count}',
    style: Theme.of(context).textTheme.title),
    ),
```

#### StreamProvider

通过名字可以看出，`StreamProvider`也是一个异步执行有关的 Provider，用法类似于 StreamBuilder。这里用`StreamProvider`模拟每隔1秒更新 Model1 的初始值。其余参数和`FutureProvider`用法类似。

```dart
    StreamProvider(create: (context) {
    return Stream.periodic(Duration(seconds: 1), (data) => Model1()..count = data);
    },
    initialData: Model1(),
    builder: (context, child) => Text(
    'StreamProvider: ${Provider.of<Model1>(context).count}',
    style: Theme.of(context).textTheme.title),
    ),
```

#### Consumer

具体用法如下，builder 中的参数分别是 Context context， T value, Widget child，value 即Model1，**value 的类型和 Model1 类型一致**，builder 方法返回的是 Widget，也就是被 Consumer 包裹的 widget，当监听的 model 值发生改变，此 widget 会被 Rebuild。

```dart
Consumer<Model1>(
    builder: (context, model, child) {
    return Text('Model1 count:${model.count}');
    },
    )
```

#### Selector

可以看出，Selector 和 Consumer 很相似，唯一不同的是，Selector 可以自定义返回类型，如下 Selector，我们这里监听 Model1 中的 count 变化，所以这里返回类型定义为 Int 类型。其中 builder 方法中的参数分别是 Context context, T value, Widget child，**这里的 value 的类型和 Selector 中定义的返回类型一致**。builder 方法返回的是 Widget，也就是被 Selector 包裹的 widget，我们可以指定监听 ChangeNotifier 中的某个值的变化，从而可触发此 widget Rebuild。

```dart
Selector<Model1, int>(
builder: (context, count, child) => Text(
"Selector示例演示: $count",
style: Theme.of(context).textTheme.title,
),
selector: (context, model) => model.count,
),
```

源码：

```dart
    class Selector<A, S> extends Selector0<S> {
        Selector({
        Key key,
        @required ValueWidgetBuilder<S> builder,
        @required S Function(BuildContext, A) selector,
        ShouldRebuild<S> shouldRebuild,
        Widget child,
        })  : assert(selector != null),
        super(
        key: key,
        shouldRebuild: shouldRebuild,
        builder: builder,
        selector: (context) => selector(context, Provider.of(context)),
        child: child,
        );
    }
```

可以看出 Selector 继承自 Selector0，追踪 Selector0 源码，它通过 buildWithChild 创建 Widget

```dart
    class _Selector0State<T> extends SingleChildState<Selector0<T>> {
    T value;
    Widget cache;
    Widget oldWidget;
    @override
        Widget buildWithChild(BuildContext context, Widget child) {
        final selected = widget.selector(context);
        var shouldInvalidateCache = oldWidget != widget ||
        (widget._shouldRebuild != null && widget._shouldRebuild.call(value, selected)) ||
        (widget._shouldRebuild == null && !const DeepCollectionEquality().equals(value, selected));
            if (shouldInvalidateCache) {
            value = selected;
            oldWidget = widget;
            cache = widget.builder(
            context,
            selected,
            child,
            );
        }
        return cache;
    }
}
```

这里的 A，S，可以看出 A 是 selector 函数的入参，S 是函数的返回值，这里将 A 通过Provider.of(context) 转换成了 Provider。对比上述 Selector 的例子，这里的A对应 Model1，S 对应 count。这里还有一个 shouldRebuild，看看函数的定义：

```dart
typedef ShouldRebuild<T> = bool Function(T previous, T next);
```

通过比较前一个值和当前值，决定是否重新 rebuild 页面，如果返回 true，则页面会被重新渲染一次，返回 false，页面不会被重新渲染。具体判断逻辑可以参考 \_Selector0State 的 buildWithChild 方法。

**可以看出，相对于 Consumer ，Selector 缩小了数据监听的范围，并且可以根据自身的业务逻辑自定义是否刷新页面，从而避免了很多不必要的页面刷新，从而提高了性能。**

在 Provider SDK 代码结构的 selector.dart 文件里，可以看出还定义了 Selector2、Selector3、Selector4、Selector5、Selector6。这里以 Selector2 做示例讲解其用法：

```dart
    class Selector2<A, B, S> extends Selector0<S> {
        Selector2({
        Key key,
        @required ValueWidgetBuilder<S> builder,
        @required S Function(BuildContext, A, B) selector,
        ShouldRebuild<S> shouldRebuild,
        Widget child,
        })  : assert(selector != null),
        super(
        key: key,
        shouldRebuild: shouldRebuild,
        builder: builder,
        selector: (context) => selector(
        context,
        Provider.of(context),
        Provider.of(context),
        ),
        child: child,
        );
    }
```

可以看出，Selector2 同样也是继承了 Selector0，不同的是 selector 函数有了两个入参 A 和B，S 是函数的返回值。也就是说可以通过 Selector2 监听2个 Provider，可以从这2个 Provider 中自定义 S 的值变化监听。其他 Selector 只是监听的 Provider 更多罢了。 如果大于6个 Provider 需要监听，就需要自定义 Selector 方法了。 示例中我们用 Selector2 同时监听 Model1 和 Model2 的变化，对两个 Model 中的 count 进行加和计算。

```dart
Selector2<Model1, Model2, int>(
    selector: (context, model1, model2) {
    return model1.count + model2.count;
    },
        builder: (context, totalCount, child) {
        return Text(
        'Model1和Model2 count合计:$totalCount');
    }
```

Selector3, Selector4…，还有 Consumer2，Consumer3…，这里就不做赘述了。

#### Consumer和Selector性能验证

经过上面的示例，我们已经对 Consumer 和 Selector 有所了解。Consumer 可以避免 widget 多余的 rebuild，当 Consumer 中监听的 value 不发生变化，其包裹的 widget 不会 Rebuild。 Selector 在 Consumer 基础上提供了更加精确的监听，还支持自定义 rebuild，可以更加灵活地控制 widget rebuild 问题。

下面我们一起来验证下 Consumer 和 Selector rebuild 的情况。Step3 图示中，我们定义了两个按钮，一个用于累加 Model1 中的 count，一个用于累加 Model2 中的 count；同时演示了 Selector2 和 Consumer 的用法；定义了 Widget1，Widget2，带 Selector 的 Widget4，用于验证 rebuild 情况。Model1的 count 值用绿色标识，Model2 的 count 值用红色标识。

本篇文章示例源码：[github.com/xiaomanziji…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fxiaomanzijia%2FFlutterProvider "https://github.com/xiaomanzijia/FlutterProvider")

Widget1,在 build 方法中打印 “Widget1 build”。

```dart
    class Widget1 extends StatefulWidget {
    @override
    State<StatefulWidget> createState() => StateWidget1();
}
    class StateWidget1 extends State<Widget1> {
    @override
        Widget build(BuildContext context) {
        print('Widget1 build');
        return Text('Widget1', style: Theme.of(context).textTheme.subhead);
    }
}
```

Widget2, 在 build 方法中打印 "Widget2 build"。 Widget3, 监听了 Model2 count 变化，在 builder 方法中打印 “Widget3 build”。

Widget4，在 build 方法中打印 "Widget4 build"，build 方法返回一个 Selector，在 Selector 的 builder 方法中打印 “Widget4 Selector build”，Selector 监听 Model1 count 变化。

```dart
    class Widget4 extends StatefulWidget {
    @override
    State<StatefulWidget> createState() => StateWidget4();
}
    class StateWidget4 extends State<Widget4> {
    @override
        Widget build(BuildContext context) {
        print('Widget4 build');
        return Selector<Model1, int>(
            builder: (context, count, child) {
            print('Widget4 Selector build');
            return Text('Widget4 Model1 count:$count', style: Theme.of(context).textTheme.subhead.copyWith(color: Colors.green),);
            },
            selector: (context, model) => model.count,
            );
        }
    }
```

所有条件具备，我们运行 StatsView 页面，日志打印如下：

```dart
Selector2 build
Model1 Consumer build
Model2 Consumer build
Widget1 build
Widget2 build
Widget3 build
Widget4 build
Widget4 Selector build
```

可以看出，widget 渲染顺序是根据页面元素布局顺序从上到下开始渲染。 点击 Model1 count++ 按钮，可以看到所有绿色标识的地方，count 已更新。日志打印如下：

```dart
Selector2 build
Model1 Consumer build
Model2 Consumer build
Widget1 build
Widget2 build
Widget3 build
Widget4 build
Widget4 Selector build
```

啥！！！怎么和第一次加载页面日志一样，更新 Model1 的 count，不应该只 build 监听 Model1 相关的 widget 吗？我们改下代码，把 Widget4 作为全局变量，在 initState 的时候初始化。

```dart
    class StateStatsView extends State<StatsView> {
    final ValueNotifier<int> _counter = ValueNotifier<int>(0);
    var widget4;
    @override
        void initState() {
        widget4 = Widget4();
        super.initState();
    }
    @override
        Widget build(BuildContext context) {
        _counter.value = Provider.of<Model1>(context).count;
        return Center(
        child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
            ..., //此处省略部分实例源码
            Widget1(),
            Widget2(),
            Widget3(),
            widget4,
            ],
            ),
            );
        }
    }
```

运行后再次点击 Model1 count++ 按钮，日志打印如下：

```dart
Selector2 build
Model1 Consumer build
Model2 Consumer build
Widget1 build
Widget2 build
Widget3 build
Widget4 Selector build
```

可以看到，“Widget4 build” 的日志不会再打印，但是 “Widget4 Selector build” 的日志仍在打印。我们再改下代码，把 Widget4 中的 selector 作为全局变量，在 initState 的时候初始化。

```dart
    class Widget4 extends StatefulWidget {
    @override
    State<StatefulWidget> createState() => StateWidget4();
}
    class StateWidget4 extends State<Widget4> {
    Selector<Model1, int> selector;
    @override
        void initState() {
        selector = buildSelector();
        super.initState();
    }
    @override
        Widget build(BuildContext context) {
        print('Widget4 build');
        return selector;
    }
        Selector<Model1, int> buildSelector() {
        return Selector<Model1, int>(
            builder: (context, count, child) {
            print('Widget4 Selector build');
            return Text('Widget4 Model1 count:$count', style: Theme.of(context).textTheme.subhead.copyWith(color: Colors.green),);
            },
            selector: (context, model) => model.count,
            );
        }
    }
```

运行后再次点击Model1 count++按钮，日志打印如下：

```dart
Selector2 build
Model1 Consumer build
Model2 Consumer build
Widget1 build
Widget2 build
Widget3 build
```

可以看到，“Widget4 Selector build” 的日志没有打印了，Widget4 中监听的 Model1 中的 count 也正常更新了。 通过前面3步的验证，我们可以得知**当 ChangeNotifier（这里即 Model1）通知更新（notifyListener）时，在 Model1 作用域下的 Widget 都会触发 build，Selector，Consumer 实质也就是一个Widget，当我们的数据需要 Selector 或 Consumer 包裹时，建议在 initState 的时候先把 widget 创建好，可以避免不必要的 build。**

### 其他

#### 1.listen

如果我们把 “Model1 count++” 按钮点击事件代码改下

```dart
FlatButton(
color: Colors.blue,
child: Text('Model1 count++'),
    onPressed: () {
    Provider.of<Model1>(context).count++;
    },
    ),
```

区别在于少了 listen:false，点击按钮你会看到下面的错误日志：

```dart
Tried to listen to a value exposed with provider, from outside of the widget tree.
This is likely caused by an event handler (like a button's onPressed) that called
Provider.of without passing `listen: false`.
To fix, write:
Provider.of<Model1>(context, listen: false);
It is unsupported because may pointlessly rebuild the widget associated to the
event handler, when the widget tree doesn't care about the value.
```

官方注释页对 listen 做了说明，listen=true，意味着被监听的 ChangeNotifier 中的值发生变化，对应的 widget 就会被 rebuild，listen=false，则不会被 rebuild。在 widget 树外调用 Provider.of 方法，必须加上 listen:false。

#### 2.扩展

Provider 从 4.1.0 版本开始支持了扩展方法，当前示例基于 4.0.5+1 讲解，这里暂不做赘述，具体可看[Changelog](https://link.juejin.cn?target=https%3A%2F%2Fpub.flutter-io.cn%2Fpackages%2Fprovider%2Fchangelog "https://pub.flutter-io.cn/packages/provider/changelog")。

before

after

Provider.of(context, listen: false)

context.read()

Provider.of(context)

context.watch

### 其他状态管理组件

组件

介绍

[Provider](https://link.juejin.cn?target=https%3A%2F%2Fpub.dev%2Fpackages%2Fprovider "https://pub.dev/packages/provider")

官方推荐，基于 InheritedWidget 实现

[ScopedModel](https://link.juejin.cn?target=https%3A%2F%2Fpub.dev%2Fpackages%2Fscoped_model "https://pub.dev/packages/scoped_model")

基于 InheritedWidget 实现，和 [Provider](https://link.juejin.cn?target=https%3A%2F%2Fpub.dev%2Fpackages%2Fprovider "https://pub.dev/packages/provider") 原理和写法都很类似

[BLoC](https://link.juejin.cn?target=https%3A%2F%2Fpub.dev%2Fpackages%2Fflutter_bloc "https://pub.dev/packages/flutter_bloc")

基于 Stream 实现的 ，该模式需要对响应式编程（比如 RxDart，RxJava）有一定的理解。核心概念：输入事件`Sink<Event> input`，输出事件`Stream<Data> output`

[Redux](https://link.juejin.cn?target=https%3A%2F%2Fpub.flutter-io.cn%2Fpackages%2Fflutter_redux "https://pub.flutter-io.cn/packages/flutter_redux")

Web 开发中 React 生态链中 Redux 包的 Flutter 实现，在前端比较流行，一种单向数据流架构。核心概念：存储对象`Store`、事件操作`Action`、处理和分发事件`Reducer`、组件刷新`View`

[Mobx](https://link.juejin.cn?target=https%3A%2F%2Fpub.dev%2Fpackages%2Fflutter_mobx "https://pub.dev/packages/flutter_mobx")

本来是一个 JavaScript 的状态管理库，后迁移到 dart 版本。核心概念：`Observables`、`Actions`、`Reactions`

这里不对其他组件做赘述，读者有兴趣可以研究一下，了解其他组件的实现原理。

### 总结

本篇文章主要介绍了官方推荐使用的 [Provider](https://link.juejin.cn?target=https%3A%2F%2Fpub.dev%2Fpackages%2Fprovider "https://pub.dev/packages/provider") 组件，结合源码和平时业务开发过程中遇到的问题，介绍了几种常用的使用方式，希望大家能熟练使用，在业务场景中能灵活运用。

推荐阅读
----

[结合React源码，五分钟带你掌握优先队列](https://juejin.cn/post/6917022255180414984 "https://juejin.cn/post/6917022255180414984")

[编写高质量可维护的代码：组件的抽象与粒度](https://juejin.cn/post/6901210381574733832 "https://juejin.cn/post/6901210381574733832")

招贤纳士
----

政采云前端团队（ZooTeam），一个年轻富有激情和创造力的前端团队，隶属于政采云产品研发部，Base 在风景如画的杭州。团队现有 40 余个前端小伙伴，平均年龄 27 岁，近 3 成是全栈工程师，妥妥的青年风暴团。成员构成既有来自于阿里、网易的“老”兵，也有浙大、中科大、杭电等校的应届新人。团队在日常的业务对接之外，还在物料体系、工程平台、搭建平台、性能体验、云端应用、数据分析及可视化等方向进行技术探索和实战，推动并落地了一系列的内部技术产品，持续探索前端技术体系的新边界。

如果你想改变一直被事折腾，希望开始能折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变既定的节奏，将会是“5 年工作时间 3 年工作经验”；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊… 如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的前端团队的成长历程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 `ZooTeam@cai-inc.com`

![](/images/jueJin/8d61907dd886479.png)