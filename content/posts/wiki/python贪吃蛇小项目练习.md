---
author: "王宇"
title: "python贪吃蛇小项目练习"
date: 三月22,2024
description: "python语言学习"
tags: ["python语言学习"]
ShowReadingTime: "12s"
weight: 162
---
*   1[1\. 背景](#python贪吃蛇小项目练习-背景)
    *   1.1[1.1. GitHub上的开源小游戏](#python贪吃蛇小项目练习-GitHub上的开源小游戏)
*   2[2\. 需求](#python贪吃蛇小项目练习-需求)
    *   2.1[2.1. 进入游戏前选择游戏模式（简单模式、一般模式）](#python贪吃蛇小项目练习-进入游戏前选择游戏模式（简单模式、一般模式）)
    *   2.2[2.2. 跟据不同的游戏模式改变贪吃蛇的速度（阅读代码发现通过两个参数分别控制我方和敌方贪吃蛇的速度）](#python贪吃蛇小项目练习-跟据不同的游戏模式改变贪吃蛇的速度（阅读代码发现通过两个参数分别控制我方和敌方贪吃蛇的速度）)
    *   2.3[2.3. 添加游戏背景音乐（3首音乐，开始对局随机播放）](#python贪吃蛇小项目练习-添加游戏背景音乐（3首音乐，开始对局随机播放）)
*   3[3\. 操作](#python贪吃蛇小项目练习-操作)
    *   3.1[3.1. 1.在gluttonous模块下，增加游戏选择模式代码](#python贪吃蛇小项目练习-1.在gluttonous模块下，增加游戏选择模式代码)
        *   3.1.1[3.1.1. 效果图展示](#python贪吃蛇小项目练习-效果图展示)
            *   3.1.1.1[3.1.1.1. 启动主程序](#python贪吃蛇小项目练习-启动主程序)
            *   3.1.1.2[3.1.1.2. 模式简要说明](#python贪吃蛇小项目练习-模式简要说明)
            *   3.1.1.3[3.1.1.3. 进入游戏界面](#python贪吃蛇小项目练习-进入游戏界面)
        *   3.1.2[3.1.2. 思考](#python贪吃蛇小项目练习-思考)
    *   3.2[3.2. 改变贪吃蛇的速度，调整游戏难易度](#python贪吃蛇小项目练习-改变贪吃蛇的速度，调整游戏难易度)
        *   3.2.1[3.2.1. 通过分析原代码得知控制我方贪吃蛇的速度默认是180，敌方贪吃蛇是150](#python贪吃蛇小项目练习-通过分析原代码得知控制我方贪吃蛇的速度默认是180，敌方贪吃蛇是150)
        *   3.2.2[3.2.2. 根据子类继承父类的特性，把对应速度参数化，在父类传参，带给子类使用。分析得知Snake( )← Arena( ) ← HelloWorld( )](#python贪吃蛇小项目练习-根据子类继承父类的特性，把对应速度参数化，在父类传参，带给子类使用。分析得知Snake\(\)←Arena\(\)←HelloWorld\(\))
        *   3.2.3[3.2.3. 父类传参，层层传递下去](#python贪吃蛇小项目练习-父类传参，层层传递下去)
        *   3.2.4[3.2.4. 效果展示](#python贪吃蛇小项目练习-效果展示)
            *   3.2.4.1[3.2.4.1. 已经实现简单模式，贪吃蛇的速度较慢，难度低](#python贪吃蛇小项目练习-已经实现简单模式，贪吃蛇的速度较慢，难度低)
            *   3.2.4.2[3.2.4.2. 已经实现一般模式，贪吃蛇的速度正常](#python贪吃蛇小项目练习-已经实现一般模式，贪吃蛇的速度正常)
    *   3.3[3.3. 添加游戏背景音乐，提升体验](#python贪吃蛇小项目练习-添加游戏背景音乐，提升体验)
        *   3.3.1[3.3.1. 需要达到能播放背景，需要导入对应的库，导入代码后进行调试](#python贪吃蛇小项目练习-需要达到能播放背景，需要导入对应的库，导入代码后进行调试)
        *   3.3.2[3.3.2. 调试代码确认在本地运行该模块能正常播放音乐](#python贪吃蛇小项目练习-调试代码确认在本地运行该模块能正常播放音乐)
        *   3.3.3[3.3.3. 将这段代码融通到业务中，开始游戏初始化的时候调播放](#python贪吃蛇小项目练习-将这段代码融通到业务中，开始游戏初始化的时候调播放)
        *   3.3.4[3.3.4. 分析代码，游戏结束时调结束](#python贪吃蛇小项目练习-分析代码，游戏结束时调结束)
        *   3.3.5[3.3.5. 游戏结束后，点击界面会开始新的游戏对局](#python贪吃蛇小项目练习-游戏结束后，点击界面会开始新的游戏对局)
        *   3.3.6[3.3.6. 效果展示](#python贪吃蛇小项目练习-效果展示.1)
            *   3.3.6.1[3.3.6.1. 体验游戏已经实现进入游戏，随机播报3首歌曲中的任意一首。游戏结束，就结束播报，点击继续游戏，从新随机播报歌曲。](#python贪吃蛇小项目练习-体验游戏已经实现进入游戏，随机播报3首歌曲中的任意一首。游戏结束，就结束播报，点击继续游戏，从新随机播报歌曲。)
*   4[4\. 总结](#python贪吃蛇小项目练习-总结)

1\. 背景
======

1.1. GitHub上的开源小游戏
------------------

[https://github.com/crossin/gluttonous.git](https://github.com/crossin/gluttonous.git)

简单熟悉作者代码，并根据自己的想法来写代码实现一些优化需求的功能迭代

2\. 需求
======

2.1. 进入游戏前选择游戏模式（简单模式、一般模式）
---------------------------

2.2. 跟据不同的游戏模式改变贪吃蛇的速度（阅读代码发现通过两个参数分别控制我方和敌方贪吃蛇的速度）
---------------------------------------------------

2.3. 添加游戏背景音乐（3首音乐，开始对局随机播放）
----------------------------

3\. 操作
======

3.1. 1.在gluttonous模块下，增加游戏选择模式代码
--------------------------------

[?](#)

`import` `tkinter as tk`

`from tkinter` `import` `messagebox`

`def simple_mode():`

    `messagebox.showinfo(``"简单模式"``,` `"贪吃蛇速度会减慢"``)`

    `root.destroy()  # 关闭GUI界面`

    `# 简单模式下调用原来的代码`

    `cocos.director.director.init(caption=``"Gluttonous Python"``)`

    `cocos.director.director.run(cocos.scene.Scene(HelloWorld()))`

`def general_mode():`

    `messagebox.showinfo(``"一般模式"``,` `"正常的贪吃蛇游戏规则"``)`

    `root.destroy()  # 关闭GUI界面`

    `# 一般模式下调用原来的代码`

    `cocos.director.director.init(caption=``"Gluttonous Python"``)`

    `cocos.director.director.run(cocos.scene.Scene(HelloWorld()))`

`def on_button_click(mode):`

    `if` `mode ==` `'simple'``:`

        `simple_mode()`

    `elif mode ==` `'general'``:`

        `general_mode()`

`def create_ui():`

    `global root  # 声明root为全局变量，以便在on_button_click中使用`

    `root = tk.Tk()`

    `root.title(``"模式选择器"``)`

    `frame = tk.Frame(root)`

    `frame.pack(pady=``60``, padx=``60``)`

    `simple_button = tk.Button(frame, text=``"简单模式"``, command=lambda: on_button_click(``'simple'``))`

    `simple_button.pack(side=tk.LEFT, padx=``5``)`

    `general_button = tk.Button(frame, text=``"一般模式"``, command=lambda: on_button_click(``'general'``))`

    `general_button.pack(side=tk.LEFT, padx=``5``)`

    `root.mainloop()`

`if` `__name__ ==` `"__main__"``:`

    `create_ui()`

  

### 3.1.1. 效果图展示

#### 3.1.1.1. 启动主程序

![](/download/attachments/122522165/image2024-3-19_15-54-10.png?version=1&modificationDate=1710834850279&api=v2)

#### 3.1.1.2. 模式简要说明

![](/download/attachments/122522165/image2024-3-19_15-54-54.png?version=1&modificationDate=1710834894520&api=v2)

#### 3.1.1.3. 进入游戏界面

![](/download/attachments/122522165/image2024-3-19_15-56-19.png?version=1&modificationDate=1710834980196&api=v2)

### 3.1.2. 思考

这里新增代码完全可以新增一个mode.py模块来承载上述代码，通过导入相应的模块来调用方法来实现需求，会显得代码层次感更高，更易于后期维护。

3.2. 改变贪吃蛇的速度，调整游戏难易度
---------------------

### 3.2.1. 通过分析原代码得知控制我方贪吃蛇的速度默认是180，敌方贪吃蛇是150

![](/download/attachments/122522165/image2024-3-21_14-9-39.png?version=1&modificationDate=1711001379824&api=v2)

### 3.2.2. 根据子类继承父类的特性，把对应速度参数化，在父类传参，带给子类使用。分析得知Snake( )← Arena( ) ← HelloWorld( )

![](/download/attachments/122522165/image2024-3-21_14-26-22.png?version=1&modificationDate=1711002383342&api=v2)

![](/download/attachments/122522165/image2024-3-21_14-57-55.png?version=1&modificationDate=1711004275740&api=v2)

### 3.2.3. 父类传参，层层传递下去

![](/download/attachments/122522165/image2024-3-21_14-28-53.png?version=1&modificationDate=1711002533360&api=v2)

### 3.2.4. 效果展示

#### 3.2.4.1. 已经实现简单模式，贪吃蛇的速度较慢，难度低

#### 3.2.4.2. 已经实现一般模式，贪吃蛇的速度正常

3.3. 添加游戏背景音乐，提升体验
------------------

### 3.3.1. 需要达到能播放背景，需要导入对应的库，导入代码后进行调试

[?](#)

`import` `time`

`import` `pygame`

`import` `random`

`class` `MusicPlayer:  # 注意类名的大小写，Python中类名通常使用大驼峰命名法`

    `def __init__(self):`

        `pygame.mixer.init()  # 初始化pygame的mixer模块`

        `self.background_music_list = [`

            `'D:/gluttonous/刘德华 - 17岁 (Live).mp3'``,`

            `'D:/gluttonous/刘德华 - 暗里着迷 (Live).mp3'``,`

            `'D:/gluttonous/刘德华 - 中国人(Live).mp3'`

        `]  # 加载背景音乐文件`

        `self.background_musics = [pygame.mixer.Sound(music)` `for` `music in`

                                  `self.background_music_list]  # 加载背景音乐到pygame的mixer中`

    `def play_random_background_music(self):`

        `# 如果当前有音乐正在播放，则先停止它`

        `if` `pygame.mixer.get_num_channels() >` `0``:`

            `for` `i in range(pygame.mixer.get_num_channels()):`

                `pygame.mixer.Channel(i).stop()`

                `# 从列表中随机选择一个背景音乐并播放`

        `random_music = random.choice(self.background_musics)`

        `random_music.play(-``1``)  # -``1``表示循环播放`

`''``'`

`# 以下调试代码`

`# 创建MusicPlayer类的实例`

`music_player = MusicPlayer()`

`# 调用实例的play_random_background_music方法`

`music_player.play_random_background_music()`

`# 等待``30``秒`

`time.sleep(``30``)`

`# 退出pygame的mixer和pygame本身`

`pygame.mixer.quit()`

`pygame.quit()`

`''``'`

### 3.3.2. 调试代码确认在本地运行该模块能正常播放音乐

![](/download/attachments/122522165/image2024-3-22_17-34-8.png?version=1&modificationDate=1711100048697&api=v2)

### 3.3.3. 将这段代码融通到业务中，开始游戏初始化的时候调播放

![](/download/attachments/122522165/image2024-3-22_17-36-51.png?version=1&modificationDate=1711100211790&api=v2)

### 3.3.4. 分析代码，游戏结束时调结束

![](/download/attachments/122522165/image2024-3-22_17-39-17.png?version=1&modificationDate=1711100358155&api=v2)

### 3.3.5. 游戏结束后，点击界面会开始新的游戏对局

![](/download/attachments/122522165/image2024-3-22_17-44-33.png?version=1&modificationDate=1711100673635&api=v2)

![](/download/attachments/122522165/image2024-3-22_17-41-59.png?version=1&modificationDate=1711100519583&api=v2)

### 3.3.6. 效果展示

#### 3.3.6.1. 体验游戏已经实现进入游戏，随机播报3首歌曲中的任意一首。游戏结束，就结束播报，点击继续游戏，从新随机播报歌曲。

4\. 总结
======

1.对于初学者来说能实现需求已经很满足了，可能代码层面会有一些冗余，实现的逻辑也许有更简单的方式方法，望大佬多指点。

2.学会灵活借助ai工具，如文心一言，很多时候都可以提高写代码的效率。

3.已经成功实现三个需求的开发

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)