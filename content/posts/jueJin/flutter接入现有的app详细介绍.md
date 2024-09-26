---
author: "brzhang"
title: "flutter接入现有的app详细介绍"
date: 2018-08-14
description: "接入的方式，我是参考的官方的介绍文档，我这里尝试的是android的接入方式，还算比较顺利。fluttercreate-tmodulemy_flutter，执行完毕之后，应该是这个样子。这几行代码的意思就是说，将你刚才创建的那个module作为android模块引…"
tags: ["Android","gradle","Flutter","Dart"]
ShowReadingTime: "阅读7分钟"
weight: 807
---
老套路： 让我们看一下效果呗：

![2018-08-14 15_20_19.gif](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/14/16537df4e38eb46d~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

### 接入方式

接入的方式，我是参考的官方的[介绍文档](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fflutter%2Fflutter%2Fwiki%2FAdd-Flutter-to-existing-apps%23experiment-turn-the-flutter-project-into-a-module "https://github.com/flutter/flutter/wiki/Add-Flutter-to-existing-apps#experiment-turn-the-flutter-project-into-a-module")，我这里尝试的是android的接入方式，还算比较顺利。

1、在你的Android工程目录同级目录下执行命令 `flutter create -t module my_flutter` ，执行完毕之后，应该是这个样子。

![image.png](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/14/16537df4e36025ae~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

2、打开你的Android工程的setting.gradle文件，行起一行，加上：

 代码解读

复制代码

`setBinding(new Binding([gradle: this]))                                 // new evaluate(new File(                                                      // new         settingsDir.parentFile,                                               // new         'tip_flutter/.android/include_flutter.groovy'                          // new ))`

这几行代码的意思就是说，将你刚才创建的那个module作为android模块引入到Android工程中。 3、最后打开你的app目录下的build.gradle，在依赖中加上

 代码解读

复制代码

 `//flutter     implementation project(':flutter')`

ok，同步一下，你就将flutter引入到的你现有的android工程了，ios的步骤就不作介绍了，参照文档，实际上不复杂。

### 遇到问题

当然，我上面说的过程相当顺利，但是，我接入的过程并没有这么顺利，我各种都会尝试一下。 1、比如，我们不在Android工程的同级目录去`flutter create -t module my_flutter`会怎么样，我尝试了，只需要对路径加上你工程目录名即可，这么写

 代码解读

复制代码

`setBinding(new Binding([gradle: this]))                                 // new evaluate(new File(                                                      // new         settingsDir.parentFile,                                               // new         '你工程目录名/tip_flutter/.android/include_flutter.groovy'                          // new ))`

也ok，但是不雅观，那ios引入这个flutter模块，岂非需要到你android工程中来找，所以，独立于Android工程会更优雅点，保持物理解耦。 2、有些小伙伴可能配置了`buildTypes`，当然，同步的话肯定是失败的，解决的办法是修改你的.android目录的flutter目录中的build.gradle。保持和你的app的buildTypes一致即可。

3、debug跑的很好，release跪了，这个肯定就是混淆的问题了，可以参考

 代码解读

复制代码

`-keep class io.flutter.app.** { *; } -keep class io.flutter.plugin.**  { *; } -keep class io.flutter.util.**  { *; } -keep class io.flutter.view.**  { *; } -keep class io.flutter.**  { *; } -keep class io.flutter.plugins.**  { *; }`

4、[找不到libflutter.so](https://link.juejin.cn?target=http%3A%2F%2Fxn--libflutter-sj2pe11bku5c.so "http://xn--libflutter-sj2pe11bku5c.so") 这个明显就是没有加载到对应的cpu架构支持的so库，请[参考这里](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fflutter%2Fflutter%2Fissues%2F16917 "https://github.com/flutter/flutter/issues/16917"),有人直接

 代码解读

复制代码

`ndk {                 abiFilters "armeabi","armeabi-v7a"。。。。把所有的都加上，这，你的包大的你受得了么。             }`

总结，其实接入的过程并没有那么顺利，哈哈，还是蛮多坑的，不过一般都能找到解决办法。

### 使用姿势

原生模块要拉起flutter模块的方式官方提供了两种： 1、直接createView创造一个flutterView，把他添加到你的布局中，这里的route1。

 代码解读

复制代码

`View flutterView = Flutter.createView(       MainActivity.this,       getLifecycle(),       "route1"     );     FrameLayout.LayoutParams layout = new FrameLayout.LayoutParams(600, 800);     layout.leftMargin = 100;     layout.topMargin = 200;     addContentView(flutterView, layout);`

相信你一开始不知道是什么，这实际上是flutter管理页面的一种方式，使用路由来处理，可以为每个页面配置好路由，这里route1表示那个页面的名字，这样就可以直接跳到名字为route1的按个页面，如果写`"/"`，那就是直接跳到main.dart的那个页面了，这里继续深究，为什么`"/"`跳到main，那是因为main.dart里面的这句话 `void main() => runApp(new MyApp());`,可以理解他是根。 2、使用fragment的方式

 代码解读

复制代码

`FragmentTransaction tx = getSupportFragmentManager().beginTransaction();    tx.replace(R.id.someContainer, Flutter.createFragment("route1"));    tx.commit();`

好了，以上就是两种元素模块应用flutter模块的方式，实际上机智的你会发现是一种而已，都是添加了一个flutterView到原生中而已，而你看源码，发现flutterView实际上是SurfaceView而已，只不过实现了一个特殊的接口`BinaryMessenger`。

### flutter调用原生模块

光打开一个flutter实现的页面，非常简单，可是里面展示的数据从哪里来呢？通常有两种方式， a、nativie把数据发送过去给到flutter端。 b、flutter端向native端要数据。 这里，我们首先来看第二种，`flutter端向native端要数据`,因为第二种官方提到的比较多，通常flutter调用原生的方式是通过`MethodChannel`来做的，具体怎么做，我们先来了解下。

 代码解读

复制代码

`MethodChannel(getFlutterView(), "app.channel.shared.data")       .setMethodCallHandler(MethodChannel.MethodCallHandler() {         @Override         public void onMethodCall(MethodCall methodCall, MethodChannel.Result result) {           if (methodCall.method.contentEquals("getSharedText")) {             result.success("some thing want to send to flutter");             sharedText = null;           }         }       });`

我们看下的源码定义,这里截取部分

 代码解读

复制代码

`public final class MethodChannel {     private static final String TAG = "MethodChannel#";     private final BinaryMessenger messenger;     private final String name;     private final MethodCodec codec;     public MethodChannel(BinaryMessenger messenger, String name) {         this(messenger, name, StandardMethodCodec.INSTANCE);     }`

前面提到过，第一个参数是`BinaryMessenger`，由于`FlutterView`实现了这个接口，所以，官方demo中传给的是`getFlutterView()`。

那么很显然，我们前面提到的`使用姿势`章节介绍了两种方式，第一种方式，FlutterView很明显就在那里，你很容易拿到他，然后开启一个MethodChannel。那么第二种方式呢？不急，看看`FlutterFragment`是个什么鬼。

 代码解读

复制代码

`public class FlutterFragment extends Fragment {   public static final String ARG_ROUTE = "route";   private String mRoute = "/";   @Override   public void onCreate(Bundle savedInstanceState) {     super.onCreate(savedInstanceState);     if (getArguments() != null) {       mRoute = getArguments().getString(ARG_ROUTE);     }   }   @Override   public void onInflate(Context context, AttributeSet attrs, Bundle savedInstanceState) {     super.onInflate(context, attrs, savedInstanceState);   }   @Override   public FlutterView onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {     return Flutter.createView(getActivity(), getLifecycle(), mRoute);   } }`

打开一看很简单，`onCreateView`返回的其实就是一个FlutterView，这也就是前面提到的，实际上原生引用flutter模块其实就是往已有的布局上加FlutterView而已。

好，弄清楚了两种方式之后，下面，我以第二种方式的形式来介绍一下，具体如何操作。

 代码解读

复制代码

`public class FlutterBaseFragment extends FlutterFragment {     private static final String METHOD_CHANNEL = "tip.flutter.io/method";     public static FlutterBaseFragment newInstance(String route) {         Bundle args = new Bundle();         args.putString(ARG_ROUTE, route);         FlutterBaseFragment fragment = new FlutterBaseFragment();         fragment.setArguments(args);         return fragment;     }     @SuppressWarnings("unchecked")     @Override     public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {         super.onViewCreated(view, savedInstanceState);         new MethodChannel((FlutterView) getView(), METHOD_CHANNEL).setMethodCallHandler(                 new MethodChannel.MethodCallHandler() {                     @Override                     public void onMethodCall(MethodCall call, final MethodChannel.Result result) {                         if (call.method.equals("getBatteryLevel")) {                             int batteryLevel = getBatteryLevel();                             if (batteryLevel != -1) {                                 result.success(batteryLevel);                             } else {                                 result.error("UNAVAILABLE", "Battery level not available.", null);                             }                         } else {                             result.notImplemented();                         }                     }                 });     }     private int getBatteryLevel() {...} }`

以上就是原生的实现部分，然后，flutter那边如何调用呢？

 代码解读

复制代码

`class _MyHomePageState extends State<MyHomePage> {   static const platform = const MethodChannel('tip.flutter.io/method');   String _batteryLevel = 'Unknown battery level.';   Future<Null> _getBatteryLevel() async {     String batteryLevel;     try {       final int result = await platform.invokeMethod('getBatteryLevel');       batteryLevel = 'Battery level at $result % .';     } on PlatformException catch (e) {       batteryLevel = "Failed to get battery level: '${e.message}'.";     }     setState(() {       _batteryLevel = batteryLevel;     });   }`

很熟悉吧，这就是官方demo而已。

那么，通过MethodChannel发送给flutter的数据难道就没有要求么？任意类型的数据都能发送么？很抱歉，并不是，比如，你自定义的class显然是不可以的。他支持的类型只有以下：

![image.png](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/14/16537df4e35280d6~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

so、我们要发送自定义类型数据过去如何办？

显然，我们需要转换为dart支持的类型，也许，你可能想到了Object->Json，然后，到了flutter那边，在变为Json对象即可。 不过也有其他的方式，比如，你们恰好使用的是protobuf的话，那么直接传byte\[\]肯定很不错啦，再者，你还可以实现自定义协议，如果有足够的时间的话。总之传递的数据需要是平台之间都能识别的类型。

### 原生向flutter发送数据

原生向flutter发送数据，这个感觉起来怪怪的，那么，具体的场景是什么，举个例子是不是好理解点，好的，比如，手机充电状态的改变，这个变动的消息，如何传达到flutter那边呢？

这时候，就需要用到EventChannel，实际上和MethodChannel发送数据过去的方式没啥区别，只不过，我们理解， MethodChannel是flutter端主动请求，拿到了数据，而，EventChannel可能理解为是从原生主动推送过去的。

 代码解读

复制代码

`new EventChannel((FlutterView) getView(), EVENT_CHANNEL).setStreamHandler(new EventChannel.StreamHandler() {             @Override             public void onListen(Object arguments, final EventChannel.EventSink events) {                 Timer timer = new Timer();                 timer.schedule(new TimerTask() {                     @Override                     public void run() {                         events.success("当前时间毫秒" + System.currentTimeMillis() / 1000);                     }                 }, 1000, 1000);             }             @Override             public void onCancel(Object arguments) {     ...             }         });`

那么，flutter端的代码，怎么收到这个EventChannel推送过去的数据呢？

 代码解读

复制代码

`Future<Null> _lisEvent() async {     String eventStr;     try {       _streamSubscription =           eventChannel.receiveBroadcastStream().listen((data) {         eventStr = 'event get data is $data ';         setState(() {           _eventStr = eventStr;         });       });     } on PlatformException catch (e) {       eventStr = "event get data err: '${e.message}'.";       setState(() {         _eventStr = eventStr;       });     }   }`

### 总结

原生拉起flutter做的页面以及flutter调用原生模块以及原生模块推送数据到flutter经过验证都是ok的，因此flutter接入现有的app这条路是可行的，接入flutter之后，`包大小会激增5.5M+`,主要是因为需要用到这个so库，如果能够从网络获取多好，可惜目前只能打包到apk中。在加上业务生成的一些文件，总体上来说，写一个简单的业务，`就差不多使得包大小增加了8M左右啦`，

![image.png](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/14/16537df4e37a32ce~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

这一点对于包大小有强迫症的童鞋需要慎重考虑了。