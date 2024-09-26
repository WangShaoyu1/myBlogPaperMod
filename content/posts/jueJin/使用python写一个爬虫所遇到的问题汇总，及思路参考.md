---
author: "wjt"
title: "使用python写一个爬虫所遇到的问题汇总，及思路参考"
date: 2021-06-11
description: "1、前言网页上我们能看到的东西，都是可以爬取的。富文本除外。爬取数据的过程一般来说分为2个阶段：2、发起请求2.1请求头的伪装（比较常见的反爬虫策略，会验证请求头里的哪些东西）2.2有一"
tags: ["Python","后端"]
ShowReadingTime: "阅读6分钟"
weight: 252
---
1、前言
====

*   网页上我们能看到的东西，都是可以爬取的。富文本除外。
*   爬取数据的过程一般来说分为2个阶段：

> 第一个阶段：发起请求

> 第二个阶段：使用正则表达式或第三方库解析数据（BeautifulSoup）。

2、发起请求
======

2.1 请求头的伪装（比较常见的反爬虫策略，会验证请求头里的哪些东西）
-----------------------------------

python

 代码解读

复制代码

`from fake_useragent import UserAgent  # 爬虫请求头伪装 import json from urllib3.exceptions import InsecureRequestWarning from urllib3 import disable_warnings disable_warnings(InsecureRequestWarning)  # 禁止https(ssl)问题的报错 ua = UserAgent()  # 爬虫请求头伪装 proxies = { "http": "http://"+proxies_ip,   # http  型的 "https": "http://"+proxies_ip   # https 型的 } # 定制请求头 my_headers = { 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9', 'User-Agent': ua.chrome, } response = requests.get(uri,  headers=my_headers,proxies=proxies)`

> 一般来说按照以上的方式来配置请求头大部分的网站你都可以正常爬取了

2.2 有一些网站在爬取过程中需要登录，那么你需要自定义请求头里的cookie
=======================================

> 参考：[docs.python-requests.org/zh\_CN/lates…](https://link.juejin.cn?target=https%3A%2F%2Fdocs.python-requests.org%2Fzh_CN%2Flatest%2Fuser%2Fquickstart.html%23cookie "https://docs.python-requests.org/zh_CN/latest/user/quickstart.html#cookie")

2.3 如果目标网站在爬取的过程中：还伴随着验证码
=========================

> 图形验证码可以使用一些第三方API对图片进行解析。不过，遇到这个验证码，我建议还是降低爬虫的频率吧！

2.4 常见的异常
---------

*   当你看到你的程序抛出了抛出`ConnectionError`错误，那一般就是因为目标网站监测出你是爬虫了。

2、内容解析find\_all()使用说明（参考Beautiful Soup 4.9.0 文档）
================================================

bash

 代码解读

复制代码

`find_all() 方法签名：find_all（name，attrs，recursive，string，limit，** kwargs） 该find_all()方法浏览标记的后代，并检索与过滤器匹配的所有后代。我在“种类的过滤器”中给出了几个示例，但这里还有更多示例： soup.find_all("title") # [<title>The Dormouse's story</title>] soup.find_all("p", "title") # [<p class="title"><b>The Dormouse's story</b></p>] soup.find_all("a") # [<a class="sister" href="http://example.com/elsie" id="link1">Elsie</a>, #  <a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>, #  <a class="sister" href="http://example.com/tillie" id="link3">Tillie</a>] soup.find_all(id="link2") # [<a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>] import re soup.find(string=re.compile("sisters")) # 'Once upon a time there were three little sisters; and their names were\n' 其中一些应该看起来很熟悉，但另一些则是新的。为string或传递值是什么意思id？为什么 找到带有CSS类“ title”的<p>标签？让我们看看的参数。find_all("p", "title")find_all() 该name参数 传递一个值name，您将告诉Beautiful Soup仅考虑带有特定名称的标签。文本字符串以及名称不匹配的标签都将被忽略。 这是最简单的用法： soup.find_all("title") # [<title>The Dormouse's story</title>] 从各种过滤器中回想一下，to的值name可以是字符串，正则表达式，列表，函数或值True。 关键字参数 任何无法识别的参数将被转换为标签属性之一的过滤器。如果您为名为的参数传递值id，Beautiful Soup将根据每个标签的'id'属性进行过滤： soup.find_all(id='link2') # [<a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>] 如果您输入的值href，Beautiful Soup将根据每个标签的'href'属性进行过滤： soup.find_all(href=re.compile("elsie")) # [<a class="sister" href="http://example.com/elsie" id="link1">Elsie</a>] 您可以基于字符串，正则表达式，列表，函数或值True过滤属性。 此代码查找其id属性具有值的所有标记，而不管该值是什么： soup.find_all(id=True) # [<a class="sister" href="http://example.com/elsie" id="link1">Elsie</a>, #  <a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>, #  <a class="sister" href="http://example.com/tillie" id="link3">Tillie</a>] 您可以通过传入多个关键字参数来一次过滤多个属性： soup.find_all(href=re.compile("elsie"), id='link1') # [<a class="sister" href="http://example.com/elsie" id="link1">Elsie</a>] 某些属性（例如HTML 5中的data- *属性）具有不能用作关键字参数名称的名称： data_soup = BeautifulSoup('<div data-foo="value">foo!</div>', 'html.parser') data_soup.find_all(data-foo="value") # SyntaxError: keyword can't be an expression 您可以在搜索中使用这些属性，方法是将它们放入字典中并将该字典find_all()作为 attrs参数传递： data_soup.find_all(attrs={"data-foo": "value"}) # [<div data-foo="value">foo!</div>] 您不能使用关键字参数来搜索HTML的“名称”元素，因为Beautiful Soup使用该name参数来包含标签本身的名称。相反，您可以在attrs参数中为'name'赋值 ： name_soup = BeautifulSoup('<input name="email"/>', 'html.parser') name_soup.find_all(name="email") # [] name_soup.find_all(attrs={"name": "email"}) # [<input name="email"/>]`

3、源码参考
======

3.1、获取代理（白嫖代理）
--------------

[无忧代理-可白嫖3个小时](https://link.juejin.cn?target=http%3A%2F%2Fwww.data5u.com%2F%3Fdeveloper%3Dbc69f7732907c4350b796dd2b806b9e1 "http://www.data5u.com/?developer=bc69f7732907c4350b796dd2b806b9e1") [快代理-白嫖4小时](https://link.juejin.cn?target=https%3A%2F%2Fwww.kuaidaili.com%2Ffree%2F "https://www.kuaidaili.com/free/")

*   我的demo里使用的是快代理，目标网站貌似反爬虫机制不是特强，所以我就没做请求头伪装。不过，抓下来的代理100个里面只有1-2个可以用。就算是做成了多线程，也是满得要死。

bash

 代码解读

复制代码

`#!/usr/bin/env python   # _*_ coding:utf-8 _*_   #   # @Version : 1.0   # @Time    : 20120/10/24 # @Author  : wjt # @File    : parsing_html # @Description: 获取快代理IP 集合 from bs4 import BeautifulSoup import requests import re import time def get_html(url):     """     获取页面的html文件     :param url: 待获取页面的链接     :param open_proxy: 是否开启代理，默认为False     :param ip_proxies: 若开启，代理地址     :return:     """     try:         pattern = re.compile(r'//(.*?)/')         host_url = pattern.findall(url)[0]         headers = {             "Host": host_url,             "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:60.0) Gecko/20100101 Firefox/60.0",             "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",             "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",             "Accept-Encoding": "gzip, deflate",             "Connection": "keep-alive",         }         res = requests.get(url, headers=headers, timeout=5)         # res.encoding = res.apparent_encoding  # 自动确定html编码,由于这里可能导致乱码，先注释掉         print("抓取代理IP Html页面获取成功 " + url)         return res.text     # 只返回页面的源码     except Exception as e:         print("抓取代理IP Html页面获取失败 " + url)         print(e) def get_kuaidaili_free_ip(begin_page_number):     """     获取快代理的免费ip,一次只获取100个     :param ip_proxies: 要使用的代理ip（这里是用代理ip去爬代理ip）     :param save_path: 代理ip保存路径     :param open_proxy: 是否开启代理，默认为False     :return:     """     ip_list_sum = []    # 代理ip列表     a = 1     while a<=1:  # 获取页数         #开始爬取         r = get_html("https://www.kuaidaili.com/free/inha/" + str(begin_page_number+a) + "/")         # print("-10"+"\\"+"n")         if(r == "-10\n"):             return print("爬取代理IP操作太频繁！")         # 页面解析         soup = BeautifulSoup(r, "html.parser")         tags_ip = soup.tbody.find_all(attrs={"data-title": "IP"} )         tags_port = soup.tbody.find_all(attrs={"data-title": "PORT"} )         min_index =0         max_index = len(tags_ip)-1         while min_index<=max_index:             ip_info = tags_ip[min_index].get_text()+":"+tags_port[min_index].get_text()             ip_list_sum.append(ip_info)             min_index+=1         a+=1     return ip_list_sum      # if __name__ == "__main__": #    get_kuaidaili_free_ip(1)`
    

3.2、爬取目标网站：根据百度关键词搜索
--------------------

bash

 代码解读

复制代码

`#!/usr/bin/env python   # _*_ coding:utf-8 _*_   #   # @Version : 1.0   # @Time    : 20120/10/24 # @Author  : wjt # @File    : my_reptiles.py # @Description: 爬取目标网站百度关键词搜索 import requests from bs4 import BeautifulSoup import re import json import time import datetime import threading  # 多线程 import os  # 文件操作 import parsing_html   #引入获取代理的类 from fake_useragent import UserAgent #爬虫请求头伪装 ip_list =[]  #代理IP集合 begin_page_number = 0  #代理IP源开始爬取页码 # 根据关键字搜索 def get_baidu_wd(my_wd,proxies_ip):     # 构建查询条件     my_params = {'wd': my_wd}          proxies = {         "http": "http://"+proxies_ip,   # http  型的         "https": "http://"+proxies_ip   # https 型的     }     try:         ua = UserAgent() #爬虫请求头伪装         # 定制请求头         my_headers = {             "User-Agent":ua.random,             "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",             "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",             "Accept-Encoding": "gzip, deflate",             "Connection": "close",         }           r = requests.get('https://www.baidu.com/s?ie=UTF-8',                            params=my_params, headers=my_headers,proxies = proxies,timeout=2, verify=False)     except (requests.exceptions.ConnectTimeout,requests.exceptions.ProxyError,Exception):         print(proxies_ip+"超时！")     else:         if r.status_code == 200:             print(proxies_ip+"成功！")     finally:         pass           #开始抓取任务的 def newmethod304():     global ip_list     global begin_page_number     while 1==1:         if len(ip_list) == 0:             time.sleep(1)             ip_list = parsing_html.get_kuaidaili_free_ip(begin_page_number)         while len(ip_list) !=0:             proxies_ip = ip_list.pop().replace('\n','') #移除列表中的一个元素（默认最后一个元素），并且返回该元素的值             # 创建新线程             myThread1(proxies_ip).start()             begin_page_number+=1    #线程任务 class myThread1(threading.Thread):     def __init__(self,proxies_ip):         threading.Thread.__init__(self)         self.proxies_ip = proxies_ip     def run(self):         print("开始线程：" + self.proxies_ip)         get_baidu_wd('周杰伦',self.proxies_ip)   if __name__ == '__main__':     newmethod304()`

    

4、参考
====

[Requests官方参考文档](https://link.juejin.cn?target=https%3A%2F%2Frequests.readthedocs.io%2Fzh_CN%2Flatest%2F "https://requests.readthedocs.io/zh_CN/latest/")

[Beautiful Soup 4.9.0 文档，内容解析参考](https://link.juejin.cn?target=https%3A%2F%2Fwww.crummy.com%2Fsoftware%2FBeautifulSoup%2Fbs4%2Fdoc%2F "https://www.crummy.com/software/BeautifulSoup/bs4/doc/")

[fake-useragent参考](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fqq_29186489%2Farticle%2Fdetails%2F78496747 "https://blog.csdn.net/qq_29186489/article/details/78496747")