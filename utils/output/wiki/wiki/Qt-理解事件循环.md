---
author: "王宇"
title: "Qt-理解事件循环"
date: 四月01,2024
description: "陆元伟"
tags: ["陆元伟"]
ShowReadingTime: "12s"
weight: 260
---
事件与事件循环
-------

### Hello World

从Hello World说起吧

    #include <stdio.h>
    int main(int argc, char *argv[]) 
    {
        printf("Hello World");
        return 0;
    }

这是一段大家都很熟悉的命令行程序，运行起来会在终端输出”Hello World”，之后程序就退出了。

### 循环处理

我们稍微加点需求: 程序能够一直运行，每次用户输入一些信息并按下回车时，打印出用户的输入。直到输入的内容为“quit”时才退出。

按照这个需求，代码实现如下：

    #include <stdio.h>
    #include <string.h>
    int main(int argc, char* argv[])
    {
        char input[1024];   //假设输入长度不超过1024
        const char quitStr[] = "quit";
        bool quit = false;
        while (false == quit) {
            scanf_s("%s", input, sizeof input);
            printf("user input: %s\n", input);
            if (0 == memcmp(input, quitStr, sizeof quitStr)) {
                quit = true;
            }
        }
        return 0;
    }

我们使用了一个while循环。在这个循环体内，不停地处理用户的输入。当输入的内容为”quit”时，循环终止条件被设置为true，循环将终止。

### 类比事件循环的概念

在上面这个例子中，“用户输入并按下回车”这件事情，我们可以称作一个“事件”或者“用户输入事件”，不停的去处理“事件”的这段代码，

我们可以称作“事件循环”, 也可以叫做”消息循环”，是一回事。

一般对于带UI窗口的程序来说，“事件”是由操作系统或程序框架在不同的时刻发出的。

当用户按下鼠标、敲下键盘，或者是窗口需要重新绘制的时候，计时器触发的时候，都会发出一个相应的事件。

我们把“事件循环”的代码 提炼/抽象 如下：

    function loop() {
        initialize();
        bool shouldQuit = false;
        while(false == shouldQuit)
        {
            var message = get_next_message();
            process_message(message);
            if (message == QUIT) 
            {
                shouldQuit = true;
            }
        }
    }

在事件循环中, 不停地去获取下一个事件，然后做出处理。直到quit事件发生，循环结束。

有“取事件”的过程，那么自然有“存储事件”的地方，要么是操作系统存储，要么是软件框架存储。

存储事件的地方，我们称作 “事件队列” Event Queue

处理事件，我们也称作 “事件分发” Event Dispatch

  

Qt的事件循环
-------

Qt作为一个跨平台的UI框架，其事件循环实现原理, 就是把不同平台的事件循环进行了封装，并提供统一的抽象接口。

和Qt做了类似工作的，还有glfw、SDL等等很多开源库。

### QEventLoop类

QEventLoop即Qt中的事件循环类，主要接口如下：

    int exec(QEventLoop::ProcessEventsFlags flags = AllEvents)
    void exit(int returnCode = 0)
    bool isRunning() const
    bool processEvents(QEventLoop::ProcessEventsFlags flags = AllEvents)
    void processEvents(QEventLoop::ProcessEventsFlags flags, int maxTime)
    void wakeUp()

  

其中exec是启动事件循环，调用exec以后，调用exec的函数就会被“阻塞”，直到EventLoop里面的while循环结束。

### QCoreApplication 主事件循环

一般的Qt程序，main函数中都有一个QCoreApplication/QGuiApplication/QApplication，并在末尾调用 exec。

    int main(int argc, char *argv[])
    {
        QCoreApplication app(argc, argv);
        //或者QGuiApplication， 或者 QApplication
        ...
        ...
        return app.exec();
    }

  

Application类中，除去启动参数、版本等相关东西后，关键就是维护了一个QEventLoop，Application的exec就是QEventLoop的exec。

不过Application中的这个EventLoop，我们称作“主事件循环”Main EventLoop。

所有的事件分发、事件处理都从这里开始。

Application还提供了sendEvent和poseEvent两个函数，分别用来发送事件。

sendEvent发出的事件会立即被处理，也就是“同步”执行。

postEvent发送的事件会被加入事件队列，在下一轮事件循环时才处理，也就是“异步”执行。

还有一个特殊的sendPostedEvents，是将已经加入队列中的准备异步执行的事件立即同步执行。

Qt的事件分发和事件处理
------------

以QWidget为例来说明。

QWidget是Widget框架中，大部分UI组件的基类。QWidget类拥有一些名字为xxxEvent的虚函数,比如：

    virtual void keyPressEvent(QKeyEvent *event)
    virtual void keyReleaseEvent(QKeyEvent *event)

keyPressEvent就表示按键按下时的处理，keyReleaseEvent表示按键松开时的处理。

主事件循环中(注册过QWidget类之后)，事件分发会在按键按下时调用QWidget的keyPressEvent函数，按键松开时调用QWidget的keyReleaseEvent函数。

### 重载事件

有了上面的事件处理机制，我们就可以在自己的QWidget子类中，通过重载keyPressEvent、keyReleaseEvent等等事件处理函数，做一些自定义的事件处理。

### QEvent

每一个事件处理函数，都是带有参数的，这个参数是QEvent的子类，携带了各种事件的参数。比如

按键事件 void keyPressEvent(QKeyEvent \*event) 中的QKeyEvent, 就包括了按下的按键值key、 count等等。

### 事件过滤器

Qt还提供了事件过滤机制，在事件分发之前先过滤一部分事件。

用法如下：

     class KeyPressEater : public QObject
      {
          Q_OBJECT
          ...
    
      protected:
          bool eventFilter(QObject *obj, QEvent *event) override;
      };
    
      bool KeyPressEater::eventFilter(QObject *obj, QEvent *event)
      {
          if (event->type() == QEvent::KeyPress) {
              QKeyEvent *keyEvent = static_cast<QKeyEvent *>(event);
              qDebug("Ate key press %d", keyEvent->key());
              return true;
          } else {
              // standard event processing
              return QObject::eventFilter(obj, event);
          }
      }
    
      。。。
    
       monitoredObj->installEventFilter(filterObj);

  

自定义一个QObject子类，重载eventFilter函数。之后在要过滤的QObject对象上，调用installEventFilter函数以安装过滤器上去。

过滤器函数的返回值为bool，true表示这个事件被过滤掉了，不用再往下分发了。false表示没有过滤。

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)