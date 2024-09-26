---
author: "Livingbody"
title: "Task7、先懂反爬再应对反爬"
date: 2021-10-24
description: "Task7、先懂反爬再应对反爬7.1、常见的反爬爬虫像一只虫子，密密麻麻地爬行到每一个角落获取数据，虫子或许无害，但总是不受欢迎的。因为爬虫技术造成的大量IP访问网站侵占带宽资源、以及用户隐私和"
tags: ["爬虫","后端"]
ShowReadingTime: "阅读6分钟"
weight: 270
---
Task7、先懂反爬再应对反爬
---------------

7.1、常见的反爬
---------

爬虫像一只虫子，密密麻麻地爬行到每一个角落获取数据，虫子或许无害，但总是不受欢迎的。

因为爬虫技术造成的大量IP访问网站侵占带宽资源、以及用户隐私和知识产权等危害，很多互联网企业都会花大力气进行“反爬虫”。

你的爬虫会遭遇比如被网站封IP、比如各种奇怪的验证码、userAgent访问限制、各种动态加载、post请求参数动态变化、禁止页面调试等都有可能出现

常见的反爬虫措施有：

*   登录验证、验证码、滑块
*   登录请求参数token
*   通过Headers反爬虫
*   基于用户行为反爬虫
*   基于动态页面的反爬虫
*   字体反爬
*   .......

7.2、基本的反反爬
----------

**反反爬的主要思路**：尽可能的去模拟浏览器，浏览器在如何操作，代码中就如何去实现。

### 7.1、请求头：User-agent

这是个很常见的，不做过多阐述，如下，这是我访问某某网站的，然后图上标注的就是user-agent

具体使用如下：

python

 代码解读

复制代码

`import requests headers = {     'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36'} res = requests.get(url='https://www.baidu.com/', headers=headers)`

在这里的User-Agent可以使用多个随机的，意识就是假如你请求20次，你可以自己构造多个不同的User-Agent随机使用一次不重样的，防止过于频繁，这也是常见的方式。

那么多的User-Agent要怎么收集呢？

1、这里有个库： fake-useragent

我们可以使用fake-useragent库来实现随机更换User-Agent

pip install fake-useragent

2、自行从这个网站收集： [useragent.kuzhazha.com/](https://link.juejin.cn?target=http%3A%2F%2Fuseragent.kuzhazha.com%2F "http://useragent.kuzhazha.com/")

3、自行构建，如下

python

 代码解读

复制代码

`import random def get_ua():     first_num = random.randint(55, 62)     third_num = random.randint(0, 3200)     fourth_num = random.randint(0, 140)     os_type = [         '(Windows NT 6.1; WOW64)', '(Windows NT 10.0; WOW64)', '(X11; Linux x86_64)',         '(Macintosh; Intel Mac OS X 10_12_6)'     ]     chrome_version = 'Chrome/{}.0.{}.{}'.format(first_num, third_num, fourth_num)     ua = ' '.join(['Mozilla/5.0', random.choice(os_type), 'AppleWebKit/537.36',                    '(KHTML, like Gecko)', chrome_version, 'Safari/537.36']                   )     return ua print(get_ua())`

scss

 代码解读

复制代码

`Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.2732.77 Safari/537.36`

### 7.2、 通过referer字段或者是其他字段来反爬

反爬原理：爬虫默认情况下不会带上referer字段 解决方法：添加referer字段

7.3、通过cookie来反爬
---------------

如果目标网站不需要登录 每次请求带上前一次返回的cookie，比如requests模块的session 如果目标网站需要登录， 则准备多个账号，通过一个程序获取账号对应的cookie，组成cookie池，其他程序使用这些cookie

假设你的程序携带了cookie，过段时间访问出现问题，一般是cookie失效，那么这个时候就需要重新登录去获取cookie，有的cookie的有效时间可能是一天或者一天以上；还有种可能就是当你用这个cookie请求数据的同时，有人用了相同的账号登录网站，那么此时你的请求就会出现问题，这种情况就是cookie的唯一性

### 7.4、通过js来反爬

普通的爬虫默认情况下无法执行js，获取js执行之后的结果，所以很多时候对方服务器会通过js的技术实现反爬

#### 7.4.1 通过js实现禁止调试

如这个网站：当我们调试这个网站就会出现如下的情况，无法去调试

面对这种情况我们可以试用如下的方式，找到debug的函数，禁止调用它，我们就可以正常调试了

类似的解决方法也有很多，也可以通过抓包去截取js文件，改写js文件，并重新注入该网站，已到达我们的改写目的

#### 7.4.2 通过js生成了请求参数

反爬原理：js生成了请求参数

像这种情况是目前最常见的反爬技术，也是爬虫走向中高阶的必备之路，像前面的七麦网站就是这种情况

解决方法：分析js，观察加密的实现过程，这里就涉及到js逆向的知识了，或者使用selenium动态加载来实现，但这种方法局限性很大

#### 7.4.3 通过js实现了数据的加密

反爬原理：js实现了数据的加密

解决方法：分析js，观察加密的实现过程，通过js2py获取js的执行结果，或者使用selenium来实现

7.5、通过验证码来反爬
------------

反爬原理：对方服务器通过弹出验证码强制验证用户浏览行为

解决方法：打码平台或者是机器学习的方法识别验证码，其中打码平台廉价易用，更值得推荐，不过如果是遇到简单的数字验证码或者滑块都是可以自行去解决的

Task7、作业
--------

上诉介绍了 请求头：User-agent 的构建思路，那么你有什么类似的方法自己构建一个呢？答案不唯一

python

 代码解读

复制代码

`# 就这样构建呗 USER_AGENT_LIST = [     "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/22.0.1207.1 Safari/537.1",     "Mozilla/5.0 (X11; CrOS i686 2268.111.0) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.57 Safari/536.11",     "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.6 (KHTML, like Gecko) Chrome/20.0.1092.0 Safari/536.6",     "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/536.6 (KHTML, like Gecko) Chrome/20.0.1090.0 Safari/536.6",     "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/19.77.34.5 Safari/537.1",     "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/536.5 (KHTML, like Gecko) Chrome/19.0.1084.9 Safari/536.5",     "Mozilla/5.0 (Windows NT 6.0) AppleWebKit/536.5 (KHTML, like Gecko) Chrome/19.0.1084.36 Safari/536.5",     "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.3 (KHTML, like Gecko) Chrome/19.0.1063.0 Safari/536.3",     "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/536.3 (KHTML, like Gecko) Chrome/19.0.1063.0 Safari/536.3",     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_0) AppleWebKit/536.3 (KHTML, like Gecko) Chrome/19.0.1063.0 Safari/536.3",     "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/536.3 (KHTML, like Gecko) Chrome/19.0.1062.0 Safari/536.3",     "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.3 (KHTML, like Gecko) Chrome/19.0.1062.0 Safari/536.3",     "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/536.3 (KHTML, like Gecko) Chrome/19.0.1061.1 Safari/536.3",     "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.3 (KHTML, like Gecko) Chrome/19.0.1061.1 Safari/536.3",     "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/536.3 (KHTML, like Gecko) Chrome/19.0.1061.1 Safari/536.3",     "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/536.3 (KHTML, like Gecko) Chrome/19.0.1061.0 Safari/536.3",     "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/535.24 (KHTML, like Gecko) Chrome/19.0.1055.1 Safari/535.24",     "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/535.24 (KHTML, like Gecko) Chrome/19.0.1055.1 Safari/535.24",     "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/531.21.8 (KHTML, like Gecko) Version/4.0.4 Safari/531.21.10",     "Mozilla/5.0 (Windows; U; Windows NT 5.2; en-US) AppleWebKit/533.17.8 (KHTML, like Gecko) Version/5.0.1 Safari/533.17.8",     "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.19.4 (KHTML, like Gecko) Version/5.0.2 Safari/533.18.5",     "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-GB; rv:1.9.1.17) Gecko/20110123 (like Firefox/3.x) SeaMonkey/2.0.12",     "Mozilla/5.0 (Windows NT 5.2; rv:10.0.1) Gecko/20100101 Firefox/10.0.1 SeaMonkey/2.7.1",     "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_8; en-US) AppleWebKit/532.8 (KHTML, like Gecko) Chrome/4.0.302.2 Safari/532.8",     "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_4; en-US) AppleWebKit/534.3 (KHTML, like Gecko) Chrome/6.0.464.0 Safari/534.3",     "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_5; en-US) AppleWebKit/534.13 (KHTML, like Gecko) Chrome/9.0.597.15 Safari/534.13",     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_2) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.186 Safari/535.1",     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/535.2 (KHTML, like Gecko) Chrome/15.0.874.54 Safari/535.2",     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/535.7 (KHTML, like Gecko) Chrome/16.0.912.36 Safari/535.7",     "Mozilla/5.0 (Macintosh; U; Mac OS X Mach-O; en-US; rv:2.0a) Gecko/20040614 Firefox/3.0.0 ",     "Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10.5; en-US; rv:1.9.0.3) Gecko/2008092414 Firefox/3.0.3",     "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.5; en-US; rv:1.9.1) Gecko/20090624 Firefox/3.5",     "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; en-US; rv:1.9.2.14) Gecko/20110218 AlexaToolbar/alxf-2.0 Firefox/3.6.14",     "Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10.5; en-US; rv:1.9.2.15) Gecko/20110303 Firefox/3.6.15",     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:2.0.1) Gecko/20100101 Firefox/4.0.1" ]`