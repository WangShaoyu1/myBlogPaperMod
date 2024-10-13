---
author: "王宇"
title: "Electron内部打开exe"
date: 四月02,2024
description: "Electron"
tags: ["Electron"]
ShowReadingTime: "12s"
weight: 517
---
**main/index.ts**

[?](#)

`const exec = require(``'child_process'``)`

`// ...`

`// 在窗口加载完成后，使用 child_process.spawn() 方法来启动`

`mainWindow.webContents.on(``'did-finish-load'``, () => {`

    `const child = exec.spawn(``'D:/Git/git-bash.exe'``)`

    `child.on(``'error'``, err => {`

      `console.error(err)`

    `})`

  `})`

**spawn与exec的相同点**
------------------

1、都用于开一个子进程执行指定命令。

2、都可以自定义子进程的运行环境。

3、都返回一个ChildProcess对象，所以他们都可以取得子进程的标准输入流、标准输出流和标准错误流。

  

  

**spawn与exec的不同点**
------------------

1、接受参数的方式:spawn使用了参数数组，而exec则直接接在命令后。

比如要运行 `du -sh /disk1` 命令， 使用spawn函数需要写成`spawn('du', ['-sh ', '/disk1'])`，而使用exec函数时，可以直接写成`exec('du -sh /disk1')`。exec是会先进行Shell语法解析，因此用exec函数可以更方便的使用复杂的Shell命令，包括管道、重定向等。

2、子进程返回给Node的数据量:spawn没有限制子进程可以返回给Node的数据大小，而exec则在options配置对象中有maxBuffer参数限制，且默认为200K，如果超出，那么子进程将会被杀死，并报错：`Error：maxBuffer exceeded`，虽然可以手动调大maxBuffer参数，但是并不被推荐。由此可窥见一番Node.js设置这两个API时的部分本意，spawn应用来运行返回大量数据的子进程，如图像处理，文件读取等。而exec则应用来运行只返回少量返回值的子进程，如只返回一个状态码。

3、exec方法相比spawn方法，多提供了一个回调函数，可以更便捷得获取子进程输出。这与从返回的ChildProcess对象的stdout或stderr监听data事件来获得输出的区别是: data事件的方式，会在子进程一有数据时就触发，并把数据返回给Node。而回调函数，则会先将数据缓存在内存中（数据量小于maxBuffer参数），等待子进程运行完毕后，再调用回调函数，并把最终数据交给回调函数。

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)