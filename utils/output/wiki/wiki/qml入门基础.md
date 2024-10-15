---
author: "王宇"
title: "qml入门基础"
date: 七月20,2024
description: "陆元伟"
tags: ["陆元伟"]
ShowReadingTime: "12s"
weight: 258
---
*   1[](#qml入门基础-)
*   2[什么是QML?](#qml入门基础-什么是QML?)
    *   2.1[优点：](#qml入门基础-优点：)
    *   2.2[缺点：](#qml入门基础-缺点：)
*   3[运行配置](#qml入门基础-运行配置)
*   4[QML基础语法](#qml入门基础-QML基础语法)
    *   4.1[属性绑定](#qml入门基础-属性绑定)
    *   4.2 [锚定（Anchoring）](#qml入门基础-锚定（Anchoring）)
*   5[QML中的基本元素](#qml入门基础-QML中的基本元素)
*   6[在QtCreator中预览Qml](#qml入门基础-在QtCreator中预览Qml)




================================================================================================================================================================================================================================================================================================================================================================

什么是QML?
=======

QML是一种基于ECMAScript（JavaScript的一个变种）和Qt元对象系统的声明式编程语言。它允许开发者以更直观、更简洁的方式描述用户界面的结构和行为，而不是通过传统的编程方式（如编写大量的代码来处理UI元素的位置、大小、颜色等）。QML文件通常以`.qml`为扩展名，并**通过Qt Quick模块提供的元素和属性来构建界面**。

### 优点：

可视化设计：QML是一种基于标记的语言，使用了层叠样式表（CSS）类似的语法，使得界面设计变得直观轻松。  
跨平台支持：QML与其他主流操作系统和设备无关，可以在多个平台上运行，包括桌面、移动和嵌入式设备。  
快速迭代：QML具有热重载功能，可以实时编辑和查看界面的更改，加快了开发和调试的速度。  
良好的动画和效果支持：QML通过内置的动画和效果组件，使得界面的交互和动态效果实现变得简单。  
灵活和可维护性：QML允许将界面元素分解为可重用的组件，使得代码结构化，易于拓展和维护。

### 缺点：

学习曲线：QML需要学习新的语法和概念，相对于传统的C++开发，可能需要一些时间来适应和掌握。  
性能：与原生C++应用程序相比，QML在某些情况下可能会有性能上的损失，尤其是在复杂界面或需要大量渲染的场景中。

运行配置
====

  

[?](#)

`CMakeLists.txt添加库`

`#添加依赖库`

`find_package(Qt5 锚定（Anchoring）`

`QML提供了灵活的布局机制，其中锚定是一种常用的方式。通过锚定，你可以将子元素相对于其父元素或其他元素进行定位。在上面的例子中，anchors.centerIn: parent表示将Text元素居中于其父元素（即Rectangle）中。 COMPONENTS Core Quick）`

`#添加qml文件`

`add_executable(xxx ${sources} qml.qrc)`

`#连接依赖库`

`target_link_libraries(xxx`

`Qt5::Core`

`Qt5::Quick)`

  

  

main.qml文件

[?](#)

`import` `QtQuick` `2.12`

`import` `QtQuick.Window` `2.12`

`Window {`

    `visible:` `true`

    `width:` `640`

    `height:` `480`

    `title: qsTr(``"Hello World"``)`

`}`

  

  

  

加载运行Qml文件

  

[?](#)

`#include <QApplication>`

`#include<QQmlApplicationEngine>`

`int` `main(``int` `length,` `char` `*args[]) {`

    `QGuiApplication app(length, args);`

    `QQmlApplicationEngine engine;`

    `engine.load(QUrl(QStringLiteral(``"qrc:/main.qml"``)));`

`}`

  

编译运行后，即可出现一个如下界面。

  

![](/download/attachments/129185786/image2024-7-20_15-29-14.png?version=1&modificationDate=1721460554737&api=v2)

  

  

至此一个qml项目编译成功

  

QML基础语法
=======

  

一个基本的QML文档结构通常包括`import`语句、一个根元素以及可能的子元素。例如：

[?](#)

`import` `QtQuick` `2.15` 

`Rectangle {` 

    `width:` `640` 

    `height:` `480` 

    `color:` `"lightblue"` 

    `Text {` 

        `text:` `"Hello, QML!"` 

        `anchors.centerIn: parent` 

    `}` 

`}`

  
在这个例子中，`import QtQuick 2.15`导入了Qt Quick模块，使得我们可以使用它提供的所有元素和属性。`Rectangle`是根元素，定义了一个蓝色的矩形区域。在矩形内部，我们添加了一个`Text`元素，并设置了其文本内容和位置。

### 属性绑定

QML中的属性绑定是声明式编程的核心。它允许你定义一个属性依赖于其他属性的值，当依赖的属性变化时，绑定的属性也会自动更新。使用`:`（冒号）来绑定属性，如上例中的`width: 640`和`height: 480`。

###  锚定（Anchoring）

QML提供了灵活的布局机制，其中锚定是一种常用的方式。通过锚定，你可以将子元素相对于其父元素或其他元素进行定位。在上面的例子中，`anchors.centerIn: parent`表示将`Text`元素居中于其父元素（即`Rectangle`）中。

QML中的基本元素
=========

QML提供了多种基础元素，用于构建用户界面，包括但不限于：

*   **Rectangle**：矩形，可用于背景或容器。
*   **Text**：文本显示。
*   **Button**：按钮，用户可点击的元素。
*   **Image**：图像显示。
*   **ListView**、**GridView**：列表和网格视图，用于展示数据集合。
*   **MouseArea**：鼠标交互区域，可以捕捉鼠标事件（如点击、移动等）。

  

  

在QtCreator中预览Qml
================

  

选中qml文件。在QtCreator左边的设计按钮中点击

![](/download/attachments/129185786/image2024-7-20_17-11-53.png?version=1&modificationDate=1721466714086&api=v2)

  

出现如下预览界面

![](/download/attachments/129185786/image2024-7-20_17-12-28.png?version=1&modificationDate=1721466748198&api=v2)

  

  

更多内容：

[qml基础教程](https://qthub.com/static/doc/qmlbook/cn/quick_starter/)

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)