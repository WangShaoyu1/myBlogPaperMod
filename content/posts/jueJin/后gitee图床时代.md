---
author: "米洛丶"
title: "后gitee图床时代"
date: 2022-04-01
description: "一起养成写作习惯！这是我参与「掘金日新计划·4月更文挑战」的第1天，点击查看活动详情。大伙儿好久不见，又厚颜无耻地来参加更文计划了！我今天我们就来聊聊图床的事情。万恶的防盗链大概在几周之前"
tags: ["后端"]
ShowReadingTime: "阅读6分钟"
weight: 659
---
一起养成写作习惯！这是我参与「掘金日新计划 · 4 月更文挑战」的第1天，[点击查看活动详情](https://juejin.cn/post/7080800226365145118 "https://juejin.cn/post/7080800226365145118")。

> 大家好~我是`米洛`！  
> 我正在从0到1打造一个开源的接口测试平台, 也在编写一套与之对应的`教程`，希望大家多多支持。  
> 欢迎关注我的公众号`米洛的测开日记`，获取最新文章教程!

大伙儿`好久不见`，又厚颜无耻地来参加更文计划了！我今天我们就来聊聊`图床`的事情。

### 万恶的防盗链

大概在几周之前，国内最大的类github网站开启了`防盗链`模式。什么是防盗链呢？这介绍防盗链之前我们先来说下`图床`的概念，对于图床大家肯定不陌生。

当我有一张本地图片，我想发给其他人看，其他人看到的肯定都不是我本地的数据，肯定是属于某个站点的`静态资源`或者是base64编码的图片数据。但后者开销较大，稍微大点的图片数据都会很大。

那么我们就有了图床的概念，图床简单的说就是把用户上传的图片存储起来，并能够提供url访问该图片，这样岂不是解决了我们的本地图片无法给人看的问题了？特别是咱们写文章的，经常一大把图片，如果有一个稳定的图床，那么我们文章内容里的图片`就都可以替换成图床提供的url`（大家都知道url是唯一的）。

所以很多网站比如`语雀`，`掘金`等都会有自己的图床，但他们往往会限制用户的使用。因为不限制的话，不但要被人狠狠白嫖，还会被耗费很多流量资源。

所以防盗链技术就出现了，简单的说它就是让用户只能在对应网站的服务域名范围内或者白名单域名内看到对应的`图片`，对于其他站点，通通都是403。比如我随便复制一下简书的图片:

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62647b9c57e64b6d9ca087da638220d0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

可以看到是会被禁止的，现在`防盗链`已经成为了一个趋势了。在几个月之前，gi某ee还是能`白嫖`图床的，现如今他们也明确禁止了。

参考知乎文章: [gitee图床是加了防盗链吗？我图片302重定向到gitee的默认图标了](https://link.juejin.cn?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F524099214%2Fanswer%2F2413763881 "https://www.zhihu.com/question/524099214/answer/2413763881")

### 何去何从

那么有没有能够`继续白嫖`的图床呢，或者说明确支持你白嫖的图床！！当然是有的，那就是`七牛云`。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3fc9b9f905a1462081e6aeade36b586b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

(虽然任何一个宣传永久免费的最后都收费了，但起码这口号我好像看他喊了好几年了，起码人家也明确支持了免费使用。)

七牛云有完善的对象存储，10个G的容量+10个G的流量（我相信小站点几乎用不完），也可以防盗链。但它有个致命的缺点: 需要域名！！！

`否则它给你提供的域名是一个无规律的网址，并且30天后会自动回收。`

但我们搞个域名还不是分分钟的事情，只要不买com、cn的域名，价格我们都能接受。推荐大家可以去国内较大的云服务器厂商看看，找一个合适的域名，我是花了200左右大洋买了个10年的域名，算起来也是相当划算了。（如果这次七牛也不让白嫖那就dt了！）

那我们今天就研究下怎么玩转`七牛云`！

### 第一步: 买域名

如果你只是想`体验`下，可以跳过。

### 第二步: 注册七牛账号并申请存储空间

官网大家就自己找找吧，不难。进入控制台申请存储空间，记得这里要选私有。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f71bb98072174950af0cc661a33dba53~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31e8d20fede9439b8c3e86831ceed410~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

在没有绑定域名的情况下，我们只会拥有一个`临时域名`。所以有条件的朋友们还是用`自己的域名`吧。

这里绑定域名会有对应的教程，大家点进去跟着操作就行了。

### 第三步: 获取自己的token/secret\_key

进入[秘钥管理](https://link.juejin.cn?target=https%3A%2F%2Fportal.qiniu.com%2Fuser%2Fkey "https://portal.qiniu.com/user/key")页面找到自己的秘钥:

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2281c001e13c40e5a8438ab02748331b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

没有的话记得自己添加哟~

### 第四步: 找到对应的sdk

以Python为例子，我们可以找到对应的[Python sdk地址](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.qiniu.com%2Fkodo%2F1242%2Fpython "https://developer.qiniu.com/kodo/1242/python")

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7347b81a5d840ae9236507e4a6848fe~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

左侧还有更多`语言`的sdk选择。

接着按照sdk提供的api去完成图片的crud即可了。

* * *

以Python为例，我们就来实战下:

*   安装qiniu

 代码解读

复制代码

`pip3 install qiniu`

*   上传文件(通过文件路径)

python

 代码解读

复制代码

`# -*- coding: utf-8 -*- # flake8: noqa from qiniu import Auth, put_file, etag import qiniu.config #需要填写你的 Access Key 和 Secret Key access_key = 'Access_Key' secret_key = 'Secret_Key' #构建鉴权对象 q = Auth(access_key, secret_key) #要上传的空间 bucket_name = 'Bucket_Name' #上传后保存的文件名 key = 'my-python-logo.png' #生成上传 Token，可以指定过期时间等 token = q.upload_token(bucket_name, key, 3600) #要上传文件的本地路径 localfile = './sync/bbb.jpg' ret, info = put_file(token, key, localfile, version='v2')  print(info) assert ret['key'] == key assert ret['hash'] == etag(localfile)`

*   上传文件（通过stream）

python

 代码解读

复制代码

`from qiniu import Auth, put_stream, etag import qiniu.config #需要填写你的 Access Key 和 Secret Key access_key = 'Access_Key' secret_key = 'Secret_Key' #构建鉴权对象 q = Auth(access_key, secret_key) #要上传的空间 bucket_name = 'Bucket_Name' filepath = "目标文件路径比如/home/zhangsan.png" token = q.upload_token(bucket_name, key, 3600) file_name = os.path.basename(filepath) # 这里的stream是文件流对象比如: open(file) as stream ret, info = put_stream(token, key, stream, file_name, len(content)) if ret['key'] != key:     raise Exception("上传失败")`

*   更新文件
    
    和上传类似的代码，oss里面只存在上传和下载的概念，更新的话默认都是覆盖的。
    
*   删除文件
    

python

 代码解读

复制代码

`# -*- coding: utf-8 -*- # flake8: noqa from qiniu import Auth from qiniu import BucketManager access_key = 'Access_Key' secret_key = 'Secret_Key' #初始化Auth状态 q = Auth(access_key, secret_key) #初始化BucketManager bucket = BucketManager(q) #你要测试的空间， 并且这个key在你空间中存在 bucket_name = 'Bucket_Name' key = 'python-logo.png' #删除bucket_name 中的文件 key ret, info = bucket.delete(bucket_name, key) print(info) assert ret == {}`

*   下载文件
    
    其实很多时候我们不需要下载文件的数据，七牛提供的下载也是包裹为url供我们下载，我们一般可以用这样的方式获取文件路径:
    
    域名/文件路径
    
    比如我上传的文件路径叫: `user/woody.png`，我的域名是cdn.pity.fun, 那么我的这个图片的地址即:
    

`http://cdn.pity.fun/user/woody.png`，大家上传完毕后可以用测试域名打开图片试试看，也可以在文件管理里面查看图片，会提供对应的链接。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bdd93c0a96f643539236b5160b0a6d40~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 注意

七牛云的图片默认的缓存时间非常久，会导致你覆盖图片后浏览器拿到的还是旧的图片，所以我们最好根据改动频率设置一下对应的缓存时间:

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b593c030e82346dcb5e8696d1f704136~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

我这里设置的是5分钟，它这样做的好处就是节流，不需要重复去请求资源。

### 其他图床

其他的收费的图床都很靠谱，我这个主要是针对`白嫖党`，或者说是给那些预算不高的朋友一个可靠的选择。

今天的内容就讲到这里，好久没写文了，有点语无伦次了哈。