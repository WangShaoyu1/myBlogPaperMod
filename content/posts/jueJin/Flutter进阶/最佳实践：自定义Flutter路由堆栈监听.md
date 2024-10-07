---
author: "SoaringHeart"
title: "Flutter进阶/最佳实践：自定义Flutter路由堆栈监听"
date: 2024-09-28
description: "一、需求来源项目中需要判断路由堆栈是否包含哪个页面，如果包含就退回到此页面，如果没有就创建跳转。就是如此简单的需求困扰了半年多时间，今天看项目代码时偶然发现一种可能得实现方式，经过测试，完美解决此问"
tags: ["前端","Flutter"]
ShowReadingTime: "阅读3分钟"
weight: 811
---
### 一、需求来源

项目中需要判断路由堆栈是否包含哪个页面，如果包含就退回到此页面，如果没有就创建跳转。就是如此简单的需求困扰了半年多时间，今天看项目代码时偶然发现一种可能得实现方式，经过测试，完美解决此问题，可视为目前的最佳实践。

#### 二、寻找解决之道

1、之前知道sdk中有 RouteAware 的堆栈数组，但是 \_listeners 是私有属性，此路不通。

scala

 代码解读

复制代码

`class RouteObserver<R extends Route<dynamic>> extends NavigatorObserver { ...   final Map<R, Set<RouteAware>> _listeners = <R, Set<RouteAware>>{}; ... }`

2、stackflow 上没找到。

3、把 [getx](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fjonataslaw%2Fgetx "https://github.com/jonataslaw/getx") 的[issues](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fjonataslaw%2Fgetx%2Fissues "https://github.com/jonataslaw/getx/issues") 都翻遍了也没有找到合适的解决办法。

#### 三、解决之道

当偶然看到同事用监听器只获取当前路由时，突然发现这不正是我苦苦寻找良久的路由堆栈监听的切入口嘛。官方不暴露堆栈我自己实现一个不就完了。

dart

 代码解读

复制代码

`class CustomRouteObserver extends RouteObserver<PageRoute<dynamic>> {   @override   void didPush(Route<dynamic> route, Route<dynamic>? previousRoute) {     super.didPush(route, previousRoute); ...   }   @override   void didPop(Route<dynamic> route, Route<dynamic>? previousRoute) {     super.didPop(route, previousRoute); ...   }`

#### 四、route\_stack\_manager 使用

dart

 代码解读

复制代码

  `navigatorObservers: [     RouteManagerObserver(),   ],`

in PageFive:

dart

 代码解读

复制代码

  `void onNext() {     DLog.d(RouteManager().toString());   }`

打印：

python

 代码解读

复制代码

`[log] DLog 2024-09-28 10:46:16.173479 RouteManager: {   "isDebug": true,   "routes": [     "MaterialPageRoute<dynamic>(RouteSettings("/", null), animation: AnimationController#38614(⏭ 1.000; paused; for MaterialPageRoute<dynamic>(/)))",     "MaterialPageRoute<dynamic>(RouteSettings("/PageOne", null), animation: AnimationController#bd787(⏭ 1.000; paused; for MaterialPageRoute<dynamic>(/PageOne)))",     "MaterialPageRoute<dynamic>(RouteSettings("/PageTwo", null), animation: AnimationController#e1844(⏭ 1.000; paused; for MaterialPageRoute<dynamic>(/PageTwo)))",     "MaterialPageRoute<dynamic>(RouteSettings("/PageThree", null), animation: AnimationController#4492e(⏭ 1.000; paused; for MaterialPageRoute<dynamic>(/PageThree)))",     "MaterialPageRoute<dynamic>(RouteSettings("/PageFour", null), animation: AnimationController#a9e6b(⏭ 1.000; paused; for MaterialPageRoute<dynamic>(/PageFour)))",     "MaterialPageRoute<dynamic>(RouteSettings("/PageFive", null), animation: AnimationController#911b9(⏭ 1.000; paused; for MaterialPageRoute<dynamic>(/PageFive)))"   ],   "routeNames": [     "/",     "/PageOne",     "/PageTwo",     "/PageThree",     "/PageFour",     "/PageFive"   ],   "preRouteName": "/PageFour",   "current": "/PageFive" }`

#### 五、源码

##### 1、定义堆栈管理监听数据类 RouteManager

dart

 代码解读

复制代码

`// //  RouteManager.dart //  route_stack_manager // //  Created by shang on 2024/9/28 09:51. //  Copyright © 2024/9/28 shang. All rights reserved. // import 'dart:convert'; import 'package:flutter/cupertino.dart'; import 'dart:developer' as developer; /// 路由堆栈管理器 class RouteManager {   static final RouteManager _instance = RouteManager._();   RouteManager._();   factory RouteManager() => _instance;   static RouteManager get instance => _instance;   /// 是都打印日志   bool isDebug = false;   /// 路由堆栈   final List<Route<dynamic>> _routes = [];   /// 当前路由堆栈   List<Route<dynamic>> get routes => _routes;   /// 当前路由名堆栈   List<String?> get routeNames => routes.map((e) => e.settings.name).toList();   /// 之前路由   Route<dynamic>? preRoute;   /// 当前路由   String? get preRouteName => preRoute?.settings.name;   /// 当前路由   Route<dynamic>? get lastRoute => routes.isEmpty ? null : routes.last;   /// 当前路由   String? get current => lastRoute?.settings.name;   /// 进出堆栈过滤条件(默认仅支持PageRoute, 过滤弹窗)   bool Function(Route<dynamic> route) filterRoute =       (route) => route is PageRoute && route.settings.name != null;   /// 更新回调   ValueChanged<RouteManager>? onChanged;   /// 是否存在路由堆栈中   bool contain(String routeName) {     return routeNames.contains(routeName);   }   /// 路由对应的参数   Object? getArguments(String routeName) {     final route = routes.firstWhere((e) => e.settings.name == routeName);     return route.settings.arguments;   }   /// 入栈   void push(Route<dynamic> route) {     if (!filterRoute(route)) {       debugPrint("❌push ${[route.runtimeType, route.settings.name]}");       return;     }     if (_routes.isNotEmpty &&         _routes.last.settings.name == route.settings.name) {       return;     }     _routes.add(route);   }   /// 出栈   void pop(Route<dynamic> route) {     if (!filterRoute(route)) {       return;     }     _routes.removeWhere((e) => e.settings.name == route.settings.name);   }   Map<String, dynamic> toJson() {     final data = <String, dynamic>{};     data['isDebug'] = isDebug;     data['routes'] = routes.map((e) => e.toString()).toList();     data['routeNames'] = routeNames;     data['preRouteName'] = preRouteName;     data['current'] = current;     return data;   }   @override   String toString() {     const encoder = JsonEncoder.withIndent('  ');     final descption = encoder.convert(toJson());     return "$runtimeType: $descption";   }   void logRoutes() {     onChanged?.call(this);     if (!isDebug) {       return;     }     developer.log(toString());   } }`

##### 2、定义堆栈管理监听器类 RouteManagerObserver

typescript

 代码解读

复制代码

`// //  RouteManagerObserver.dart //  route_stack_manager // //  Created by shang on 2024/9/28 09:51. //  Copyright © 2024/9/28 shang. All rights reserved. // import 'package:flutter/cupertino.dart'; import 'route_manager.dart'; /// 堆栈管理器路由监听器 class RouteManagerObserver extends RouteObserver<PageRoute<dynamic>> {   PageRoute<dynamic>? currentRoute;   @override   void didPush(Route<dynamic> route, Route<dynamic>? previousRoute) {     super.didPush(route, previousRoute);     RouteManager().push(route);     RouteManager().preRoute = previousRoute;     RouteManager().logRoutes();   }   @override   void didPop(Route<dynamic> route, Route<dynamic>? previousRoute) {     super.didPop(route, previousRoute);     RouteManager().pop(route);     RouteManager().preRoute = route;     RouteManager().logRoutes();   }   @override   void didReplace({Route<dynamic>? newRoute, Route<dynamic>? oldRoute}) {     super.didReplace(newRoute: newRoute, oldRoute: oldRoute);     if (oldRoute != null && newRoute != null) {       RouteManager().pop(oldRoute);       RouteManager().push(newRoute);       RouteManager().preRoute = oldRoute;       RouteManager().logRoutes();     }   }   @override   void didRemove(Route<dynamic> route, Route<dynamic>? previousRoute) {     super.didRemove(route, previousRoute);     RouteManager().pop(route);     RouteManager().logRoutes();   } }`

### 总结

###### 1、核心思路是通过 RouteObserver 为切入点，自己定义路由管理堆栈。

###### 2、Route route 有可能是 bottomSheet 等其他类型；默认只保留 PageRoute，可通过 filterRoute 方法自定义过滤条件；

###### 3、已封装为 package 库 [route\_stack\_manager](https://link.juejin.cn?target=https%3A%2F%2Fpub.dev%2Fpackages%2Froute_stack_manager "https://pub.dev/packages/route_stack_manager")

[github](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fshang1219178163%2Froute_stack_manager "https://github.com/shang1219178163/route_stack_manager")