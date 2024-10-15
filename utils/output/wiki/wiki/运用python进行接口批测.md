---
author: "王宇"
title: "运用python进行接口批测"
date: 九月29,2024
description: "python语言学习"
tags: ["python语言学习"]
ShowReadingTime: "12s"
weight: 163
---
*   1[1\. 背景](#id-运用python进行接口批测-背景)
*   2[2\. 工具](#id-运用python进行接口批测-工具)
*   3[3\. 编码](#id-运用python进行接口批测-编码)
*   4[4\. 测试演示](#id-运用python进行接口批测-测试演示)
    *   4.1[4.1. 测试集展示](#id-运用python进行接口批测-测试集展示)
    *   4.2[4.2. 测试工具展示](#id-运用python进行接口批测-测试工具展示)
    *   4.3[4.3. 测试结果展示](#id-运用python进行接口批测-测试结果展示)
*   5[5\. 使用说明](#id-运用python进行接口批测-使用说明)

1\. 背景
======

FTT后台有一个地方测试应用的话术，前期针对话术的测试尤为关键，但是人工一个一个的输入去测试特别的慢，系统又没有批测导入的功能，便于提供效率于是有了通过python调接口的想法，获取excel表格的测试话术，根据返回结果提取对应字段。有了调接口的python代码后，其扩展性也比较大，后续调其他接口只需要切换对应的接口和提取对应的字段即可。  
  

系统现有测试界面如下：[https://vdh-open.test.yingzi.com/userSpace/application/answer\_editing](https://vdh-open.test.yingzi.com/userSpace/application/answer_editing)

  
![](/download/attachments/134055222/image2024-9-4_15-6-52.png?version=1&modificationDate=1725433613007&api=v2)

2\. 工具
======

pycharm

3\. 编码
======

[?](#)

`import` `requests`

`import` `pandas as pd`

`from openpyxl` `import` `Workbook`

`number_str = input(``"请输入测试集总数: "``)`

`# 尝试将字符串转换为整数`

`number =` `int``(number_str)`

`def main(data_list):`

    `dis_result = []`

    `ser_result = []`

    `for` `i in range(number):`

        `key = data_list[i]`

        `cookies = {`

            `'Hm_lvt_040bdf184a20fce7945737e94b12ff7f'``:` `'1696987756'``,`

            `'isLogin'``:` `'1'``,`

            `'sensorsdata2015jssdkcross'``:` `'%7B%22distinct_id%22%3A%22821438399468318720%22%2C%22first_id%22%3A%2218cde39f7b84f8-0601e573ac901e4-26001951-1327104-18cde39f7b9edd%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMThjZGUzOWY3Yjg0ZjgtMDYwMWU1NzNhYzkwMWU0LTI2MDAxOTUxLTEzMjcxMDQtMThjZGUzOWY3YjllZGQiLCIkaWRlbnRpdHlfbG9naW5faWQiOiI4MjE0MzgzOTk0NjgzMTg3MjAifQ%3D%3D%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%22821438399468318720%22%7D%2C%22%24device_id%22%3A%22189fd2fb039627-01ce585a75d9ef-26031c51-1327104-189fd2fb03ad13%22%7D'``,`

            `'tfstk'``:` `'fOvrirOLtYHrCTYGIgBF0NXdwG6RLT0sYp_CxHxhVablF4dqKUTXPkOWxw8elZplrg_7L6bDoaTWNHZJMFtgFLGRdJWRp90s5AM_23BdKkriliQJmnIhQ5Jpt3KRpodEG0GM2WP1YjRlKeXcngshK7Vk-SXckMI3rM2o0mSdo82hZMDcnGS3E9XH-nmVvjkf-NwVb_maEnleQJwQmNKluR-v3gj7w3b4Jyp2g_7iUZy3KKSyDZBaTRlCSCQ51wLmh8WemM8V1QuaUe-HXBf2LzmWSHR2JT9mx7bMNU1BeszuZGWPz1vlZuylH6A23T9oJ5KX0afNhIGxP66yzCQOZj3v8n7W-L50zq_B1n9lgF0b3eCetL6DEqDN4AadmFJHpQz3T_jA0Niq0bfsoHHt2eH49WCJMi7s20FL9_jA0Niq0WFdwOIV50nR.'``,`

            `'cookiesession1'``:` `'678B287B222F77574F15A2944FDEA72A'``,`

            `'Hm_lvt_085e0fa100dbc0e0e42931c16bf3e9e6'``:` `'1725264234'``,`

            `'HMACCOUNT'``:` `'A807A56C7F489161'``,`

            `'Hm_lpvt_085e0fa100dbc0e0e42931c16bf3e9e6'``:` `'1725264235'``,`

            `'user_token'``:` `'DdAIJiHcEu2US843wgvTmavyKmlfPxHt'``,`

            `'user_token'``:` `'DdAIJiHcEu2US843wgvTmavyKmlfPxHt'``,`

        `}`

        `headers = {`

            `'Accept'``:` `'application/json, text/plain, */*'``,`

            `'Accept-Language'``:` `'zh-CN,zh;q=0.9,en;q=0.8'``,`

            `'Authorization'``:` `'DdAIJiHcEu2US843wgvTmavyKmlfPxHt'``,`

            `'Connection'``:` `'keep-alive'``,`

            `'Content-Type'``:` `'application/json'``,`

            `#` `'Cookie'``:` `'Hm_lvt_040bdf184a20fce7945737e94b12ff7f=1696987756; isLogin=1; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22821438399468318720%22%2C%22first_id%22%3A%2218cde39f7b84f8-0601e573ac901e4-26001951-1327104-18cde39f7b9edd%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMThjZGUzOWY3Yjg0ZjgtMDYwMWU1NzNhYzkwMWU0LTI2MDAxOTUxLTEzMjcxMDQtMThjZGUzOWY3YjllZGQiLCIkaWRlbnRpdHlfbG9naW5faWQiOiI4MjE0MzgzOTk0NjgzMTg3MjAifQ%3D%3D%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%22821438399468318720%22%7D%2C%22%24device_id%22%3A%22189fd2fb039627-01ce585a75d9ef-26031c51-1327104-189fd2fb03ad13%22%7D; tfstk=fOvrirOLtYHrCTYGIgBF0NXdwG6RLT0sYp_CxHxhVablF4dqKUTXPkOWxw8elZplrg_7L6bDoaTWNHZJMFtgFLGRdJWRp90s5AM_23BdKkriliQJmnIhQ5Jpt3KRpodEG0GM2WP1YjRlKeXcngshK7Vk-SXckMI3rM2o0mSdo82hZMDcnGS3E9XH-nmVvjkf-NwVb_maEnleQJwQmNKluR-v3gj7w3b4Jyp2g_7iUZy3KKSyDZBaTRlCSCQ51wLmh8WemM8V1QuaUe-HXBf2LzmWSHR2JT9mx7bMNU1BeszuZGWPz1vlZuylH6A23T9oJ5KX0afNhIGxP66yzCQOZj3v8n7W-L50zq_B1n9lgF0b3eCetL6DEqDN4AadmFJHpQz3T_jA0Niq0bfsoHHt2eH49WCJMi7s20FL9_jA0Niq0WFdwOIV50nR.; cookiesession1=678B287B222F77574F15A2944FDEA72A; Hm_lvt_085e0fa100dbc0e0e42931c16bf3e9e6=1725264234; HMACCOUNT=A807A56C7F489161; Hm_lpvt_085e0fa100dbc0e0e42931c16bf3e9e6=1725264235; user_token=DdAIJiHcEu2US843wgvTmavyKmlfPxHt; user_token=DdAIJiHcEu2US843wgvTmavyKmlfPxHt'``,`

            `'Origin'``:` `'[https://vdh-open.test.yingzi.com](https://vdh-open.test.yingzi.com)'``,`

            `'Referer'``:` `'[https://vdh-open.test.yingzi.com/userSpace/application/answer_editing'](https://vdh-open.test.yingzi.com/userSpace/application/answer_editing')``,`

            `'Sec-Fetch-Dest'``:` `'empty'``,`

            `'Sec-Fetch-Mode'``:` `'cors'``,`

            `'Sec-Fetch-Site'``:` `'same-origin'``,`

            `'User-Agent'``:` `'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'``,`

            `'sec-ch-ua'``:` `'"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"'``,`

            `'sec-ch-ua-mobile'``:` `'?0'``,`

            `'sec-ch-ua-platform'``:` `'"Windows"'``,`

        `}`

        `json_data = {`

            `'userId'``:` `'11200010000538020000000000000000'``,`

            `'text'``: key,`

            `'avatarId'``:` `'11200010000538020000000000000000'``,`

            `'lang'``:` `'cn'``,`

            `'domainId'``:` `'70'``,`

        `}`

        `response = requests.post(`

            `'[https://vdh-open.test.yingzi.com/haigate/api/v1/chatSerial'](https://vdh-open.test.yingzi.com/haigate/api/v1/chatSerial')``,`

            `cookies=cookies,`

            `headers=headers,`

            `json=json_data,`

        `)`

        `result = response.json()`

        `try``:`

            `d_data = result[``'data'``][``'answer'``]`

            `s_data = result[``'data'``][``'service'``]`

        `except KeyError:`

            `# 处理可能的 KeyError，比如如果` `'data'` `或` `'answer'``/``'service'` `不在响应中`

            `d_data = None`

            `s_data = None`

        `dis_result.append(d_data)`

        `ser_result.append(s_data)`

    `return` `dis_result, ser_result`

`def read():`

    `# 指定Excel文件的路径`

    `file_path =` `'C:/Users/luyiye/Desktop/新建 XLSX 工作表.xlsx'`

    `# 使用pandas的read_excel函数读取Excel文件的A列`

    `df = pd.read_excel(file_path, usecols=``"A"``, header=None)  # header=None表示不使用文件中的列名作为DataFrame的列名`

    `# 获取A列（在DataFrame中是第一列，索引为``0``）的前三个数据`

    `# 注意：Python的索引是从``0``开始的，所以前三个元素的索引是``0``,` `1``,` `2`

    `data = df.iloc[:number,` `0``]  # 使用iloc来按位置索引，:``3``表示从索引``0``到``2``（不包括``3``）`

    `# 如果你想要将这些数据作为列表而不是Series对象，可以使用tolist()方法`

    `data_list = data.tolist()`

    `return` `data_list`

`def save(key_test, dis, ser):`

    `# 创建一个Workbook对象`

    `wb = Workbook()`

    `# 激活当前工作表`

    `ws = wb.active`

    `# 可以通过标题给工作表重命名`

    `ws.title =` `"我的数据"`

    `# 给单元格赋值，设置表头`

    `ws.append([``"测试问题"``,` `"回复"``,` `"命中技能"``])`

    `# 遍历dis_result和ser_result，确保它们长度相同`

    `# 使用zip函数将它们组合在一起，然后遍历每个元素对`

    `for` `key_test, dis, ser in zip(key_test, dis, ser):`

        `# 使用append方法追加一行数据`

        `ws.append([key_test, dis, ser])`

        `# 保存文件`

    `wb.save(``"C:/Users/luyiye/Desktop/example.xlsx"``)`

`dis_result, ser_result = main(read())`

`data_list = read()`

`save(key_test=data_list, dis=dis_result, ser=ser_result)`

  

4\. 测试演示
========

4.1. 测试集展示
----------

![](/download/attachments/134055222/image2024-9-4_11-14-34.png?version=1&modificationDate=1725419674329&api=v2)

4.2. 测试工具展示
-----------

![](/download/attachments/134055222/image2024-9-4_11-15-24.png?version=1&modificationDate=1725419724198&api=v2)

4.3. 测试结果展示
-----------

![](/download/attachments/134055222/image2024-9-6_10-30-20.png?version=1&modificationDate=1725589821038&api=v2)

5\. 使用说明
========

电脑有安装开发工具pycharm，复制对应的代码，根据本地测试集excel文件存放路径进行修改。这里同时教大家一个快速获取接口python调用代码【web打开开发调试工具，刷新界面，找到对应的接口，右键Copy——>Copy as cURL (bash) 去到[https://curlconverter.com/](https://curlconverter.com/)粘贴直接生成调用接口代码】。

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)