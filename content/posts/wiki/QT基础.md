---
author: "王宇"
title: "QT基础"
date: 四月03,2024
description: "陆元伟"
tags: ["陆元伟"]
ShowReadingTime: "12s"
weight: 260
---
**槽机制**
=======

使用信号槽机制（signals and slots）使得对象之间可以直接通信  
自定义槽函数（点击事件）

1、槽函数在Qt5中可以是任意类成员函数（一般都是），全局函数，静态函数，lambda表达式（无函数名的隐式函数）

\* 2、槽函数需要与信号的（返回值，参数）相对应；信号返回值 -> 槽函数返回值 | 信号参数 -> 槽函数参数

\* 3、信号没有返回值，槽函数返回值：void

connect(btn2,&QPushButton::clicked,this,&MainBody::click);

设置btnt2的点击事件回调MainBody的click处理

  

QDialog显示一个弹框
=============

  
构造函数：  
QDialog(QWidget \*parent = nullptr, Qt::WindowFlags flags = Qt::WindowFlags())  
模态对话框相关函数：  
void setModal(bool modal)：设置对话框是否为模态（默认为非模态）。  
int exec()：以模态方式显示对话框，阻塞当前窗口的事件循环，并返回对话框的退出码。  
void accept()：关闭对话框，并设置结果码为Accepted，通常用于“确认”按钮的点击事件处理。  
void reject()：关闭对话框，并设置结果码为Rejected，通常用于“取消”按钮的点击事件处理。  
非模态对话框相关函数：  
void show()：以非模态方式显示对话框。  
void hide()：隐藏对话框。  
bool isVisible() const：判断对话框是否可见。  
其他常用函数：  
void setWindowTitle(const QString &title)：设置对话框的标题。  
void setFixedSize(const QSize &size)：设置对话框的固定大小。

  

**基础UI**

**QLabel**
==========

QLabel 类提供了两个构造函数，分别是：

QLabel(QWidget \*parent = Q\_NULLPTR, Qt::WindowFlags f = Qt::WindowFlags())  
QLabel(const QString &text, QWidget \*parent = Q\_NULLPTR, Qt::WindowFlags f = Qt::WindowFlags())

各个参数的含义分别是：

*   text 参数用于指定文本框中显示的文字；
*   parent 参数用于指定文本框的父窗口；
*   WindowFlags 是一种枚举类型，f 参数用来设置文本框的一些系统属性和外观属性，默认值为 Qt::Widget，表示当不指定父窗口时，文本框将作为一个独立窗口，反之则作为父窗口中的一个控件。f 参数的可选值有很多，比如 Qt::Window 表示文本框将作为一个独立的窗口，它自带边框和标题栏，Qt::ToolTip 表示文本框将作为一个提示窗口，不带边框和标题栏等等，

  

QLabel文本框的使用
------------

QLabel 类本身提供有很多属性和方法，它还从父类继承了很多属性和方法。下表给大家罗列了 QLabel 类常用的一些属性和方法：  
  

表 1 QLabel 常用属性

属 性

含 义

属 性

含 义

alignment

保存 QLabel 控件中内容的对齐方式，默认情况下，QLabel 控件中的内容保持左对齐和垂直居中。  
  
该属性的值可以通过调用 alignment() 方法获得，可以借助 setAlignment() 方法修改。

text

保存 QLabel 控件中的文本，如果 QLabel 控件中没有文本，则 text 的值为空字符串，  
  
该属性的值可以通过 text() 方法获得，可以借助 setText() 方法修改。

pixmap

保存 QLabel 控件内显示的图片，如果控件内没有设置图片，pixmap 的值为 0。  
  
该属性的值可以通过调用 pixmap() 方法获得，可以借助 setPixmap() 方法修改。

selectedText

保存 QLabel 控件中被选择了的文本，当没有文本被选择时，selectedText 的值为空字符串。  
  
该属性的值可以通过调用 selectedText() 方法获得。

hasSelectedText

判断用户是否选择了 QLabel 控件内的部分文本，如果是则返回 true，反之则返回 false。默认情况下，该属性的值为 false。

indent

保存 QLabel 控件内文本的缩进量，文本的缩进方向和 alignment 属性的值有关。  
  
该属性的值可以通过调用 indent() 方法获得，可以借助 setIndent() 方法修改。

margin

保存 QLabel 控件中内容与边框之间的距离（边距），margin 的默认值为 0。  
  
该属性的值可以通过调用 margin() 方法获得，可以借助 setMargin() 方法修改。

wordWrap

保存 QLabel 控件内文本的换行策略。当该属性的值为 true 时，控件内的文本会在必要时自动换行。默认情况下，控件内的文本是禁止自动换行的。  
  
该属性的值可以通过 wordWrap() 方法获得，可以借助 setWordWrap() 方法修改。

  
除了上表中提到了获取和修改属性值得成员方法外，下表给大家罗列了一些常用的操作 QLabel 控件的成员方法，它们有些定义在 QLabel 类内，有些是通过继承父类得到的：  
  

表 2 操作QLabel的常用方法

成员方法

功 能

成员方法

功 能

hide()

隐藏文本框。

clear()

清空 QLabel 控件内所有显示的内容。

setToolTip(QString)

设置信息提示，当用户的鼠标放在QLabel 文本框上时会自动跳出文字。 

setToolTipDuration(int)

设置提示信息出现的时间，单位是毫秒。 

setStyleSheet(QString)

设置 QLabel 文本框的样式。

setGeometry(int x, int y, int w, int h)

设置 QLabel 文本框的位置 (x, y) 以及尺寸 (w, h)。

QLabel文本框的信号和槽
--------------

QLabel 控件只用来显示文本、图像等内容，很好与用户交互。但是，当 QLabel 控件内包含超链接内容时，可以使用 QLabel 类提供的两个信号函数：  
  

表 2 QLabel信号函数

信号函数

功 能

信号函数

功 能

linkActivated(const QString &link)

用户点击超链接时触发，link 参数用于向槽函数传输超链接的 URL。

linkHovered(const QString &link)

用户的鼠标悬停到超链接位置时触发，link 参数用于向槽函数传输超链接的 URL。

  
QLabel 控件提供了很多槽函数，如下表所示：  
  

表 3 QLabel槽函数

槽函数

功 能

槽函数

功 能

clear()

清空 QLabel 控件内所有的内容。

setMovie(QMovie \*movie)

清空 QLabel 控件内所有的内容，改为显示指定的 movie 动画。

setNum(int num)

清空 QLabel 控件内所有的内容，改为显示 num 整数的值。

setNum(double num)

清空 QLabel 控件内所有的内容，改为显示 num 小数的值。

setPicture(const QPicture &picture)

清空 QLabel 控件内所有的内容，改为显示经 QPicture 类处理的图像。

setPixmap(const QPixmap &)

清空 QLabel 控件内所有的内容，改为显示经 QPixmap 类处理的图像。

setText(const QString &)

清空 QLabel 控件内所有的内容，改为显示指定的文本。

  
除了表 2、3 罗列的这些信号和槽函数外，QLabel 类还从父类处继承了一些信号和槽函数.

  
**QPushButton**
==================

QPushButton 类提供了 3 个构造函数，分别是：

QPushButton(QWidget \*parent = Q\_NULLPTR)  
QPushButton(const QString &text, QWidget \*parent = Q\_NULLPTR)  
QPushButton(const QIcon &icon, const QString &text, QWidget \*parent = Q\_NULLPTR)

parent 参数用于指定父窗口；text 参数用于设置按钮上要显示的文字；icon 参数用于设置按钮上要显示的图标。

QPushButton按钮的使用
----------------

QPushButton 类提供了很多实用的属性和方法，它还从父类继承了很多属性和方法。下表给大家罗列了一些比较常用的属性和方法：  
  

表 1 QPushButton常用属性

属 性

含 义

属 性

含 义

text

保存按钮上要显示的文字。  
  
该属性的值可以通过 text() 方法获取，也可以通过 setText(const QString &text) 方法修改。

icon

保存按钮左侧要显示的图标。  
  
该属性的值可以通过 icon() 方法获取，也可以通过 setIcon(const QIcon &icon) 方法修改。

iconsize

保存按钮左侧图标的尺寸。  
  
该属性的值可以通过 iconSize() 方法获取，也可以通过 setIconSize(const QSize &size) 方法修改。

size

保存按钮的尺寸。  
  
该属性的值可以通过 size() 方法获取，也可以通过 resize(int w, int h) 或者 resize(const QSize &) 方法修改。

font

保存按钮上文字的字体和大小。  
  
该属性的值可以通过 font() 方法获取，也可以通过 setFont(const QFont &) 方法修改。

flat

初始状态下，按钮是否显示边框。flat 属性的默认值为 flase，表示按钮带有边框。  
  
该属性的值可以通过 isFlat() 方法获取，也可以通过 setFlat(bool) 方法修改。

enabled

指定按钮是否可以被按下。  
  
该属性的默认值为 true，表示按钮可以被按下，即按钮处于启用状态。当该属性的值为 false 时，按钮将不能被点击，按钮处于禁用状态。  
  
该属性的值可以通过 isEnabled() 方法获取，也可以通过 setEnabled(bool) 方法进行修改。

autoDefault

当用户按下 Enter 回车键时，是否触发点击按钮的事件。  
  
当按钮的父窗口为 QDialog 窗口时，该属性的值为 true；其它情况下，该属性的默认值为 false。  
  
该属性的值可以通过 autoFault() 方法获取，也可以通过 setAutoFault(bool) 方法修改。

  
除了表 1 中罗列的获取、修改属性值的方法外，QPushButton 类常用的成员方法还有：  
  

表 2 QPushButton常用方法

方 法

功 能

方 法

功 能

move(int x, int y)

手动指定按钮位于父窗口中的位置。

setStyleSheet(const QString &styleSheet)

自定义按钮的样式，包括按钮上文字或图片的显示效果，按钮的形状等等。

setGeometry(int x, int y, int w, int h)

同时指定按钮的尺寸和位置。

adjustSize()

根据按钮上要显示的内容，自动调整按钮的大小。

setDisabled(bool disable)

指定按钮是否可以被按下。当 disable 值为 true 时，表示按钮不能被按下，即禁用按钮的功能。

QPushButton按钮的信号和槽
------------------

GUI 程序中，按钮的主要任务是完成和用户之间的交互，下表罗列了 QPushButton 类常用的信号函数和槽函数：  
  

表 3 QPushButton信号和槽

信号函数

功 能

clicked()  
clicked(bool checked = false)

用户点击按钮并释放（或者按下按钮对应的快捷键）后，触发此信号。

pressed()

用户按下按钮时会触发此信号。

released()

用户松开按钮时会触发此信号。

槽函数

功 能

click()

单击指定的按钮。

setIconSize()

重新设置按钮上图片的尺寸。

hide()

隐藏按钮控件。

setMenu(QMenu \*menu)

弹出与按钮关联的菜单。

组件布局

垂直布局，将所有控件从上到下（或者从下到上）依次摆放  
QVBoxLayout  
水平布局  
QHBoxLayout  
网格布局  
QGridLayout

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)