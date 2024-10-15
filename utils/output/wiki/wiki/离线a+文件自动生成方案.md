---
author: "王宇"
title: "离线a+文件自动生成方案"
date: 七月02,2024
description: "十七、前端管理"
tags: ["十七、前端管理"]
ShowReadingTime: "12s"
weight: 567
---
现状
--

使用一个离线a+需要以下步骤

1.  .登录ftt后台，复制所需a+的ID
2.  到项目sdk里执行talk执行一次，复制返回的json数据
3.  .在当前项目里新建一个json文件，复制刚刚的json文件
4.  .调用这个项目本地文件

  

不足
--

1.  重复工作量很多
2.  容易出错
3.  手动的流程无法在后台配置化实现后工作

  

  

分析
--

经过尝试，每个请求都需要header带上鉴权信息，那这个值在哪里获取？

![](/download/attachments/129174469/image2024-7-2_16-25-58.png?version=1&modificationDate=1719908758842&api=v2)

  

当然是登录接口![(微笑)](/s/-vky9ok/8401/008d09724398b50e93468e30a239d4f6d750af9b/_/images/icons/emoticons/smile.svg)

![](/download/attachments/129174469/image2024-7-2_16-27-26.png?version=1&modificationDate=1719908846978&api=v2)

  

动手
--

通过先请求login接口获取token，带上后面所有请求的header上

[?](#)

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

`const axios = require(``"axios"``);`

`const path = require(``'path'``);`

`const fs = require(``"fs"``);`

`let token;`

`const login = async () => {`

  `const p = await axios.post(`

    `"[https://vdh-open.test.yingzi.com/haiadmin/api/v1/login](https://vdh-open.test.yingzi.com/haiadmin/api/v1/login)"``,`

    `{`

      `username:` `"xxx"``,` `// 自己的用户名`

      `password:` `"xxx"``,` `// 自己的密码`

    `}`

  `);`

  `token = await p.data.data.accessToken;`

  `return` `token;`

`};`

`const getList = async () => {`

  `try` `{`

    `const ax = await axios.post(`

      `"[https://vdh-open.test.yingzi.com/haiadmin/api/v1/getAvatarArichInfoList](https://vdh-open.test.yingzi.com/haiadmin/api/v1/getAvatarArichInfoList)"``,`

      `{`

        `language:` `"cn"``,`

        `pageNo: 1,`

        `pageSize: 5,`

        `avatarId:` `"11100090000932790000000000000000"``,`

        `name:` `""``,`

        `type: 1,`

        `arichId:` `""``,`

        `domainId:` `"70"``,`

      `},`

      `{`

        `headers: {`

          `Authorization: token,`

        `},`

      `}`

    `);`

    `const res = ax.data.data.ArichInfoList;`

    `return` `res`

  `}` `catch` `(error) {`

    `if` `(error.response.status === 401) {`

      `console.log(``"token expired"``);`

    `}`

  `}`

`};`

`function` `writeFile(filePath, data) {`

    `fs.writeFile(filePath, JSON.stringify(data,` `null``, 2), (err) => {`

      `if` `(err) {`

        `console.error(``'Failed to write file'``, err);`

      `}` `else` `{`

        `console.log(``'File written successfully'``);`

      `}`

    `});`

  `}`

`const getAplus = async (item) => {`

    `const response = await axios.post(``'[https://vdh-api.test.yingzi.com/haigate/api/v1/haiApid2Anim'](https://vdh-api.test.yingzi.com/haigate/api/v1/haiApid2Anim')``, {`

        `text:` `"1718713042592633360hfuqn"``,`

        `reqId:` `"1719221125498"``,`

        `sdkVer:` `"v6.0.0"``,`

        `avatarId:` `"11100090000932790000000000000000"``,`

        `lang:` `"cn"``,`

        `aplusId: item.arichId,`

    `})`

    `const filePath = path.join(__dirname,` `'public'```, `${item.name}.json`)``

    `fs.exists(item.name, exs => {`

        `if` `(exs) {`

            `fs.unlink(filePath, error => {`

                `if` `(error) {`

                    `console.error(``'Failed to delete the file'``, error)`

                    `return`

                `}`

                `writeFile(filePath, response.data)`

            `})`

        `}` `else` `{`

          `writeFile(filePath, response.data)`

        `}`

    `})`

`}`

`const start = async () => {`

  `await login();`

  `const res = await getList();`

  `const promises = res.map(item => getAplus(item));`

  `await Promise.all(promises)`

      `.then(() => console.log(``"All data has been written successfully."``))`

      `.``catch``(error => console.error(``"An error occurred:"``, error));`

`};`

`start();`

  

效果拔群！

  

![](/download/thumbnails/129174469/image2024-7-2_16-30-38.png?version=1&modificationDate=1719909038984&api=v2)

  

  

Copilot对我的代码解释
--------------

这段JavaScript代码主要执行以下操作：

1.  **引入依赖**：使用`require`引入`axios`（用于HTTP请求）、`path`（用于处理文件路径）和`fs`（用于文件系统操作）模块。
    
2.  **登录操作** (`login`函数)：
    
    *   使用`axios.post`向指定的登录URL发送POST请求，包含用户名和密码。
    *   从响应中获取`accessToken`并保存在`token`变量中。
3.  **获取列表** (`getList`函数)：
    
    *   使用`axios.post`向指定的URL发送POST请求，请求头中包含步骤2中获取的`token`。
    *   从响应中提取列表信息并返回。
4.  **写入文件** (`writeFile`函数)：
    
    *   使用`fs.writeFile`将传入的数据写入到指定的文件路径。数据在写入前会被转换为JSON格式。
5.  **获取并处理数据** (`getAplus`函数)：
    
    *   对于`getList`函数返回的每个列表项，使用`axios.post`发送请求获取更多信息。
    *   检查目标文件是否存在，如果存在则先删除，然后调用`writeFile`函数将获取的数据写入文件。
6.  **启动程序** (`start`函数)：
    
    *   首先调用`login`函数进行登录。
    *   然后调用`getList`函数获取列表。
    *   对于列表中的每一项，调用`getAplus`函数处理并写入文件。
    *   使用`Promise.all`等待所有的`getAplus`调用完成。
7.  **执行**：在文件的最后，调用`start`函数开始执行上述流程。
    

整个脚本的目的是登录到一个API，获取一系列数据，对每项数据进行进一步的请求，然后将结果保存到本地文件系统中。

* * *

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)