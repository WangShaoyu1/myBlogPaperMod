---
author: "王宇"
title: "Fay数字人AIAgent版学习报告分析（一）"
date: 十一月14,2023
description: "GPT相关"
tags: ["GPT相关"]
ShowReadingTime: "12s"
weight: 187
---
*   1[1\. 分析入口main.py文件](#Fay数字人AIAgent版学习报告分析（一）-分析入口main.py文件)
*   2[2\. 分析主体内容页面](#Fay数字人AIAgent版学习报告分析（一）-分析主体内容页面)
    *   2.1[2.1. 调用图](#Fay数字人AIAgent版学习报告分析（一）-调用图)
    *   2.2[2.2. 调用分析](#Fay数字人AIAgent版学习报告分析（一）-调用分析)

1\. 分析入口main.py文件
=================

 展开源码

[expand source](#)[?](#)

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

31

32

33

34

35

36

37

38

39

40

41

42

43

44

45

46

47

48

49

50

51

52

53

54

55

56

57

58

59

60

61

62

63

64

65

`import` `os`

`import` `sys`

`from` `io` `import` `BytesIO`

`from` `PyQt5` `import` `QtGui`

`from` `PyQt5.QtWidgets` `import` `QApplication`

`from` `ai_module` `import` `ali_nls`

`from` `core` `import` `wsa_server`

`from` `gui` `import` `flask_server`

`from` `gui.window` `import` `MainWindow`

`from` `utils` `import` `config_util`

`from` `scheduler.thread_manager` `import` `MyThread`

`from` `core.content_db` `import` `Content_Db`

`import` `sys`

`sys.setrecursionlimit(sys.getrecursionlimit()` `*` `5``)`

`def` `__clear_samples():`

    `if` `not` `os.path.exists(``"./samples"``):`

        `os.mkdir(``"./samples"``)`

    `for` `file_name` `in` `os.listdir(``'./samples'``):`

        `if` `file_name.startswith(``'sample-'``):`

            `os.remove(``'./samples/'` `+` `file_name)`

`def` `__clear_songs():`

    `if` `not` `os.path.exists(``"./songs"``):`

        `os.mkdir(``"./songs"``)`

    `for` `file_name` `in` `os.listdir(``'./songs'``):`

        `if` `file_name.endswith(``'.mp3'``):`

            `os.remove(``'./songs/'` `+` `file_name)`

`def` `__clear_logs():`

    `if` `not` `os.path.exists(``"./logs"``):`

        `os.mkdir(``"./logs"``)`

    `for` `file_name` `in` `os.listdir(``'./logs'``):`

        `if` `file_name.endswith(``'.log'``):`

            `os.remove(``'./logs/'` `+` `file_name)`

`if` `__name__` `=``=` `'__main__'``:`

    `__clear_samples()`

    `__clear_songs()`

    `__clear_logs()`

    `config_util.load_config()`

    `dbstatus` `=` `os.path.exists(``"fay.db"``)`

    `if` `(dbstatus` `=``=` `False``):`

        `contentdb` `=` `Content_Db()`

        `contentdb.init_db()`

    `ws_server` `=` `wsa_server.new_instance(port``=``10002``)`

    `ws_server.start_server()`

    `web_ws_server` `=` `wsa_server.new_web_instance(port``=``10003``)`

    `web_ws_server.start_server()`

    `# Edit by xszyou in 20230516:增加本地asr后，aliyun调成可选配置`

    `if` `config_util.ASR_mode` `=``=` `"ali"``:`

        `ali_nls.start()`

    `flask_server.start()`

    `app` `=` `QApplication(sys.argv)`

    `app.setWindowIcon(QtGui.QIcon(``'icon.png'``))`

    `win` `=` `MainWindow()`

    `win.show()`

    `app.exit(app.exec_())`

  

该入口文件实现了如下几个功能：

1.  定义了3个清除示例、歌曲、日志的方法，\_\_clear\_samples、\_\_clear\_songs、\_\_clear\_logs
2.  line48加载配置
3.  line49~line52检测是否存在数据库文件，没有的话创造一个db类，并初始化
4.  line53~line56，开启数字人服务器、web服务器，里面的实现方法没有太多业务相关逻辑，不过里面的写法，从技术层面上看可以参考；
5.  line58~line59，**如果ASR模式是“ali”，初始化阿里语音模块**
6.  line60，启动（flask）Web服务器
7.  line61~line64，创建一个图像界面库，详情见中文文档：[https://maicss.gitbook.io/pyqt-chinese-tutoral/](https://maicss.gitbook.io/pyqt-chinese-tutoral/)，主体内容是通过web页面实现（line60实现），图形界面加载已启动的Web服务（URL）；

2\. 分析主体内容页面
============

通过前面的分析得知：页面主体内容是通过Web服务器，回到line60，flask\_server.start()，分析下该python文件：

 展开源码

[expand source](#)[?](#)

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

31

32

33

34

35

36

37

38

39

40

41

42

43

44

45

46

47

48

49

50

51

52

53

54

55

56

57

58

59

60

61

62

63

64

65

66

67

68

69

70

71

72

73

74

75

76

77

78

79

80

81

82

83

84

85

86

87

88

89

90

91

92

93

94

95

96

97

98

99

100

101

102

103

104

105

106

107

108

109

110

111

112

113

114

115

116

117

118

119

120

121

122

123

124

125

126

127

128

129

130

131

132

`import` `imp`

`import` `json`

`import` `time`

`import` `pyaudio`

`from` `flask` `import` `Flask, render_template, request`

`from` `flask_cors` `import` `CORS`

`import` `fay_booter`

`from` `core.tts_voice` `import` `EnumVoice`

`from` `gevent` `import` `pywsgi`

`from` `scheduler.thread_manager` `import` `MyThread`

`from` `utils` `import` `config_util, util`

`from` `core` `import` `wsa_server`

`from` `core` `import` `fay_core`

`from` `core.content_db` `import` `Content_Db`

`from` `ai_module` `import` `yolov8`

`__app` `=` `Flask(__name__)`

`CORS(__app, supports_credentials``=``True``)`

`def` `__get_template():`

    `return` `render_template(``'index.html'``)`

`def` `__get_device_list():`

    `audio` `=` `pyaudio.PyAudio()`

    `device_list` `=` `[]`

    `for` `i` `in` `range``(audio.get_device_count()):`

        `devInfo` `=` `audio.get_device_info_by_index(i)`

        `if` `devInfo[``'hostApi'``]` `=``=` `0``:`

            `device_list.append(devInfo[``"name"``])`

    `return` `list``(``set``(device_list))`

`@__app``.route(``'/api/submit'``, methods``=``[``'post'``])`

`def` `api_submit():`

    `data` `=` `request.values.get(``'data'``)`

    `# print(data)`

    `config_data` `=` `json.loads(data)`

    `if``(config_data[``'config'``][``'source'``][``'record'``][``'enabled'``]):`

        `config_data[``'config'``][``'source'``][``'record'``][``'channels'``]` `=` `0`

        `audio` `=` `pyaudio.PyAudio()`

        `for` `i` `in` `range``(audio.get_device_count()):`

            `devInfo` `=` `audio.get_device_info_by_index(i)`

            `if` `devInfo[``'name'``].find(config_data[``'config'``][``'source'``][``'record'``][``'device'``]) >``=` `0` `and` `devInfo[``'hostApi'``]` `=``=` `0``:`

                 `config_data[``'config'``][``'source'``][``'record'``][``'channels'``]` `=` `devInfo[``'maxInputChannels'``]`

    `config_util.save_config(config_data[``'config'``])`

    `return` `'{"result":"successful"}'`

`@__app``.route(``'/api/control-eyes'``, methods``=``[``'post'``])`

`def` `control_eyes():`

    `eyes` `=` `yolov8.new_instance()`

    `if``(``not` `eyes.get_status()):`

       `eyes.start()`

       `util.log(``1``,` `"YOLO v8正在启动..."``)`

    `else``:`

       `eyes.stop()`

       `util.log(``1``,` `"YOLO v8正在关闭..."``)`

    `return` `'{"result":"successful"}'`

`@__app``.route(``'/api/get-data'``, methods``=``[``'post'``])`

`def` `api_get_data():`

    `wsa_server.get_web_instance().add_cmd({`

        `"voiceList"``: [`

            `{``"id"``: EnumVoice.XIAO_XIAO.name,` `"name"``:` `"晓晓"``},`

            `{``"id"``: EnumVoice.YUN_XI.name,` `"name"``:` `"云溪"``}`

        `]`

    `})`

    `wsa_server.get_web_instance().add_cmd({``"deviceList"``: __get_device_list()})`

    `return` `json.dumps({``'config'``: config_util.config})`

`@__app``.route(``'/api/start-live'``, methods``=``[``'post'``])`

`def` `api_start_live():`

    `# time.sleep(5)`

    `fay_booter.start()`

    `time.sleep(``1``)`

    `wsa_server.get_web_instance().add_cmd({``"liveState"``:` `1``})`

    `return` `'{"result":"successful"}'`

`@__app``.route(``'/api/stop-live'``, methods``=``[``'post'``])`

`def` `api_stop_live():`

    `# time.sleep(1)`

    `fay_booter.stop()`

    `time.sleep(``1``)`

    `wsa_server.get_web_instance().add_cmd({``"liveState"``:` `0``})`

    `return` `'{"result":"successful"}'`

`@__app``.route(``'/api/send'``, methods``=``[``'post'``])`

`def` `api_send():`

    `data` `=` `request.values.get(``'data'``)`

    `info` `=` `json.loads(data)`

    `text` `=` `fay_core.send_for_answer(info[``'msg'``],info[``'sendto'``])`

    `return` `'{"result":"successful","msg":"'``+``text``+``'"}'`

`@__app``.route(``'/api/get-msg'``, methods``=``[``'post'``])`

`def` `api_get_Msg():`

    `contentdb` `=` `Content_Db()`

    `list` `=` `contentdb.get_list(``'all'``,``'desc'``,``1000``)`

    `relist` `=` `[]`

    `i` `=` `len``(``list``)``-``1`

    `while` `i >``=` `0``:`

        `relist.append(``dict``(``type``=``list``[i][``0``],way``=``list``[i][``1``],content``=``list``[i][``2``],createtime``=``list``[i][``3``],timetext``=``list``[i][``4``]))`

        `i` `-``=` `1`

    `return` `json.dumps({``'list'``: relist})`

`@__app``.route(``'/'``, methods``=``[``'get'``])`

`def` `home_get():`

    `return` `__get_template()`

`@__app``.route(``'/'``, methods``=``[``'post'``])`

`def` `home_post():`

    `return` `__get_template()`

`def` `run():`

    `server` `=` `pywsgi.WSGIServer((``'0.0.0.0'``,``5000``), __app)`

    `server.serve_forever()`

`def` `start():`

    `MyThread(target``=``run).start()`

该文件做了如下几件事情：

1.  服务器跨域相关配置、静态模板文件配置；
2.  使用跨平台音频I/O库，使用 PyAudio 你可以在 Python 程序中播放和录制音频。详细使用见如下两篇文档：[PyAudio Documentation官方文档](https://people.csail.mit.edu/hubert/pyaudio/docs/) 、 [PyAudio 音频 I/O 库](https://www.oschina.net/p/pyaudio?hmsr=aladdin1e1) 。
3.  获取音频输入相关设备列表（麦克风）；
4.  定义访问路径、接口，含有get、post请求，总结一下各个接口作用

/api/submit

点击保存配置

  

/api/get-data

获取和虚拟人问答相关的属性默认配置：

*   人设基础属性：例如：人物年龄、性别等；
*   QA问答库配置，例如：QA问答库
*   麦克风相关配置
*   其他

  

...

见调用图

  

  

  

  

2.1. 调用图
--------

![](/download/attachments/109733889/yuque_diagram1.png?version=3&modificationDate=1699863030005&api=v2)

  

  

2.2. 调用分析
---------

         整体上看，在system.conf文件中，进行chat\_module的选择、更换，换言之，是利用不同公司、不同阶段对外发布的大模型为底座，据此做一个上层的AI应用。这些大模型的专业能力，基于聊天场景的话，大同小异，并不能体现出彼此之间的“聊天”专业性的差别。有一些大模型，也使用到了提示词“prompt”，但这些提示词并没有体现出“专业性”，都属于通用提示词，太泛了。

         虚拟人形象选用的live2D（一个开源项目：[https://github.com/stevenjoezhang/live2d-widget](https://github.com/stevenjoezhang/live2d-widget)），这块目前在项目中是一个独立模块，没有口型匹配与动作匹配。

  

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)