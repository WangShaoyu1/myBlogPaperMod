---
author: "Java3y"
title: "Java面试前需要了解的东西"
date: 2018-06-24
description: "上一篇写了自己面试的经历和一些在面试的时候遇到的题目(笔试题和面试题)。 我在面试前针对Java基础也花了不少的时间，期间也将自己写过的博文粗略地刷了一遍，同时也在网上找了不少比较好的资料(部分是没看完的)。在这里给大家分享一下~~~ 这是我刷完自己写过的笔记写的一篇文章导航，…"
tags: ["Java","数据库","面试","Java EE中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:28,comments:0,collects:32,views:1221,"
---
一、前言
====

> 只有光头才能变强

回顾前面：

*   [广州三本找Java实习经历](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247484273%26idx%3D1%26sn%3D1eb9112e1ab1004b3040a66b76ad5646%26chksm%3Debd74270dca0cb663beb878ae31e39c3cc14bc56f1db62f426f5b4cb34b9a804a0bf7cbd9a27%23rd "https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247484273&idx=1&sn=1eb9112e1ab1004b3040a66b76ad5646&chksm=ebd74270dca0cb663beb878ae31e39c3cc14bc56f1db62f426f5b4cb34b9a804a0bf7cbd9a27#rd")

上一篇写了自己面试的经历和一些在面试的时候遇到的题目(笔试题和面试题)。

我在面试前针对Java基础也花了不少的时间，期间也将自己写过的博文粗略地刷了一遍，同时也在网上**找了不少比较好的资料**(部分是没看完的)。在这里给大家分享一下~~~

这是我刷完自己写过的笔记写的一篇**文章导航**，针对于PC端的：[zhongfucheng.bitcron.com/post/shou-j…](https://link.juejin.cn?target=https%3A%2F%2Fzhongfucheng.bitcron.com%2Fpost%2Fshou-ji%2Fpcduan-wen-zhang-dao-hang "https://zhongfucheng.bitcron.com/post/shou-ji/pcduan-wen-zhang-dao-hang")。**比较重要的知识点也画了思维导图**，后面新发的文章也会补充上去的。

可能会感兴趣的资料：

*   思维导图原图：[zhongfucheng.bitcron.com/post/shou-j…](https://link.juejin.cn?target=https%3A%2F%2Fzhongfucheng.bitcron.com%2Fpost%2Fshou-ji%2Fnao-tu-da-quan "https://zhongfucheng.bitcron.com/post/shou-ji/nao-tu-da-quan")
*   视频网盘：[zhongfucheng.bitcron.com/post/shou-j…](https://link.juejin.cn?target=https%3A%2F%2Fzhongfucheng.bitcron.com%2Fpost%2Fshou-ji%2Fshi-pin-wang-pan "https://zhongfucheng.bitcron.com/post/shou-ji/shi-pin-wang-pan")

二、在学习的时候整理的面试题
==============

之前在学习或者整理知识点的时候也喜欢去找找面试题看，以下是我个人整理的面试题：

2.1集合
-----

1.  ArrayList和Vector的区别
2.  HashMap和Hashtable的区别
3.  List和Map的区别
4.  Set里的元素是不能重复的，那么用什么方法来区分重复与否呢? 是用==还是equals()?
5.  Collection和Collections的区别
6.  说出ArrayList,LinkedList的存储性能和特性
7.  Enumeration和Iterator接口的区别
8.  ListIterator有什么特点
9.  并发集合类是什么？
10.  Java中HashMap的key值要是为类对象则该类需要满足什么条件？
11.  ArrayList集合加入1万条数据，应该怎么提高效率
12.  与Java集合框架相关的有哪些最好的实践

答案：

*   [Java集合总结【面试题+脑图】，将知识点一网打尽！](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000014403696 "https://segmentfault.com/a/1190000014403696")：https://segmentfault.com/a/1190000014403696

2.2Servlet+Tomcat面试题
--------------------

1.  Tomcat的缺省端口是多少，怎么修改
2.  Tomcat 有哪几种Connector 运行模式(优化)？
3.  Tomcat有几种部署方式
4.  Servlet生命周期
5.  get方式和post方式有何区别
6.  doGet与doPost方法的两个参数是什么
7.  获取页面的元素的值有几种方式，分别说一下
8.  request.getAttribute()和request.getParameter()区别
9.  forward和redirect的区别
10.  tomcat容器是如何创建servlet类实例？用到了什么原理
11.  什么是cookie？Session和cookie有什么区别？
12.  Servlet安全性问题

答案：

*   [Tomcat+Servlet面试题都在这里](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000013119518 "https://segmentfault.com/a/1190000013119518")：https://segmentfault.com/a/1190000013119518

2.3JSP面试题
---------

1.  jsp静态包含和动态包含的区别
2.  jsp有哪些内置对象?作用分别是什么?
3.  jsp和servlet的区别、共同点、各自应用的范围？
4.  属性作用域范围
5.  写出5种JSTL常用标签
6.  写一个自定义标签要继承什么类
7.  JSP是如何被执行的？执行效率比SERVLET低吗？
8.  如何避免jsp页面自动生成session对象？
9.  jsp的缺点？
10.  说出Servlet和CGI的区别？
11.  简述JSP的设计模式。

答案：

*   [JSP面试题都在这里](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000013185611 "https://segmentfault.com/a/1190000013185611")：https://segmentfault.com/a/1190000013185611

2.4JDBC
-------

1.  JDBC操作数据库的步骤 ？
2.  JDBC中的Statement 和PreparedStatement，CallableStatement的区别？
3.  JDBC中大数据量的分页解决方法?
4.  说说数据库连接池工作原理和实现方案？
5.  Java中如何进行事务的处理?
6.  写出一段JDBC连接本机MySQL数据库的代码
7.  JDBC是如何实现Java程序和JDBC驱动的松耦合的？
8.  execute，executeQuery，executeUpdate的区别是什么？
9.  JDBC的脏读是什么？哪种数据库隔离级别能防止脏读？
10.  什么是幻读，哪种隔离级别可以防止幻读？
11.  JDBC的DriverManager是用来做什么的？
12.  JDBC的ResultSet是什么？
13.  有哪些不同的ResultSet？
14.  JDBC的DataSource是什么，有什么好处
15.  JDBC中存在哪些不同类型的锁？
16.  java.util.Date和java.sql.Date有什么区别？
17.  如果java.sql.SQLException: No suitable driver found该怎么办？
18.  JDBC的RowSet是什么，有哪些不同的RowSet？
19.  什么是JDBC的最佳实践？

答案：

*   [JDBC常见面试题](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000013312766 "https://segmentfault.com/a/1190000013312766")：https://segmentfault.com/a/1190000013312766

2.5数据库
------

1.  什么是存储过程？有哪些优缺点？
2.  三个范式是什么
3.  什么是视图？以及视图的使用场景有哪些？
4.  drop、delete与truncate分别在什么场景之下使用？
5.  索引是什么？有什么作用以及优缺点？
6.  什么是事务？
7.  数据库的乐观锁和悲观锁是什么？
8.  超键、候选键、主键、外键分别是什么？
9.  SQL 约束有哪几种？
10.  数据库运行于哪种状态下可以防止数据的丢失？
11.  Mysql存储引擎
12.  MyIASM和Innodb两种引擎所使用的索引的数据结构是什么？
13.  varchar和char的区别
14.  mysql有关权限的表都有哪几个
15.  数据表损坏的修复方式有哪些？
16.  MySQL中InnoDB引擎的行锁是通过加在什么上完成
17.  数据库优化的思路
18.  Oracle和Mysql的区别

答案：

*   [数据库面试题(开发者必看)](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000013517914 "https://segmentfault.com/a/1190000013517914")：https://segmentfault.com/a/1190000013517914

2.6HTTP
-------

1.  Http与Https的区别：
2.  什么是Http协议无状态协议?怎么解决Http协议无状态协议?
3.  URI和URL的区别
4.  常用的HTTP方法有哪些？
5.  HTTP请求报文与响应报文格式
6.  HTTPS工作原理
7.  一次完整的HTTP请求所经历的步骤
8.  常见的HTTP相应状态码
9.  HTTP1.1版本新特性
10.  HTTP优化方案

答案：

*   [HTTP面试题都在这里](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000013271378 "https://segmentfault.com/a/1190000013271378")：https://segmentfault.com/a/1190000013271378

2.7XML+JSON
-----------

1.  什么是JSON和XML
2.  JSON与XML区别是什么？ 有什么共同点
3.  JSON、XML解析有那些方式？
4.  XML和JSON优缺点
5.  XPath 是什么
6.  XML 命名空间是什么？它为什么很重要
7.  DOM 和 和 SAX 解析器有什么区别
8.  XSLT 是什么?

答案：

*   [XML+JSON面试题都在这里](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000013285207 "https://segmentfault.com/a/1190000013285207")：https://segmentfault.com/a/1190000013285207

2.8过滤器和监听器面试题
-------------

1.  监听器有哪些作用和用法？
2.  过滤器有哪些作用和用法？
3.  web.xml 的作用？
4.  Servlet 3中的异步处理指的是什么？

答案：

*   [过滤器监听器面试题都在这里](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000013263161 "https://segmentfault.com/a/1190000013263161")：https://segmentfault.com/a/1190000013263161

2.9AJAX
-------

1.  什么是AJAX，为什么要使用Ajax
2.  AJAX应用和传统Web应用有什么不同？
3.  请介绍一下XMLhttprequest对象
4.  介绍一下XMLHttpRequest对象的常用方法和属性
5.  Ajax的实现流程是怎样的？
6.  AJAX请求总共有多少种CALLBACK
7.  XMLHttpRequest对象在IE和Firefox中创建方式有没有不同。
8.  AJAX有哪些有点和缺点？
9.  请解释一下 JavaScript 的同源策略。
10.  阐述一下异步加载JS。
11.  如何解决跨域问题?
12.  Ajax 解决浏览器缓存问题？

答案：

*   [AJAX面试题都在这里](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000013291898 "https://segmentfault.com/a/1190000013291898")：https://segmentfault.com/a/1190000013291898

2.10Hibernate
-------------

1.  Hibernate工作原理及为什么要用？
2.  Hibernate是如何延迟加载(懒加载)?
3.  Hibernate中怎样实现类之间的关系?(如：一对多、多对多的关系)
4.  hibernate的三种状态之间如何转换
5.  比较hibernate的三种检索策略优缺点
6.  hibernate都支持哪些缓存策略
7.  hibernate里面的sorted collection 和ordered collection有什么区别
8.  说下Hibernate的缓存机制
9.  Hibernate的查询方式有几种
10.  如何优化Hibernate？
11.  谈谈Hibernate中inverse的作用
12.  JDBC hibernate 和 ibatis 的区别
13.  在数据库中条件查询速度很慢的时候,如何优化?
14.  什么是SessionFactory,她是线程安全么
15.  get和load区别
16.  persist和save的区别
17.  merge的含义
18.  主键生成策略有哪些
19.  简述hibernate中getCurrentSession和openSession区别
20.  Hibernate中的命名SQL查询指的是什么?
21.  可不可以将Hibernate的实体类定义为final类?

答案：

*   [Hibernate最全面试题](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000013635882 "https://segmentfault.com/a/1190000013635882")：https://segmentfault.com/a/1190000013635882

2.11Mybatis
-----------

1.  #{}和${}的区别是什么？
2.  当实体类中的属性名和表中的字段名不一样 ，怎么办 ？
3.  如何获取自动生成的(主)键值?
4.  在mapper中如何传递多个参数?
5.  Mybatis动态sql是做什么的？都有哪些动态sql？能简述一下动态sql的执行原理不？
6.  Mybatis的Xml映射文件中，不同的Xml映射文件，id是否可以重复？
7.  为什么说Mybatis是半自动ORM映射工具？它与全自动的区别在哪里？
8.  通常一个Xml映射文件，都会写一个Dao接口与之对应，请问，这个Dao接口的工作原理是什么？Dao接口里的方法，参数不同时，方法能重载吗？
9.  Mybatis比IBatis比较大的几个改进是什么
10.  接口绑定有几种实现方式,分别是怎么实现的?
11.  Mybatis是如何进行分页的？分页插件的原理是什么？
12.  简述Mybatis的插件运行原理，以及如何编写一个插件
13.  Mybatis是否支持延迟加载？如果支持，它的实现原理是什么？
14.  Mybatis都有哪些Executor执行器？它们之间的区别是什么？
15.  MyBatis与Hibernate有哪些不同？

答案：

*   [Mybatis常见面试题](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000013678579 "https://segmentfault.com/a/1190000013678579")：https://segmentfault.com/a/1190000013678579

三、网上优质的面试题
==========

以下基本都是我看过，或者没看完的优质面试题博文(也有部分没有看，但觉得不错的面试题)~~~

3.1有答案的面试题
----------

一、优质面试题整理---1：

*   [www.cnblogs.com/lanxuezaipi…](https://link.juejin.cn?target=http%3A%2F%2Fwww.cnblogs.com%2Flanxuezaipiao%2Fp%2F3371224.html "http://www.cnblogs.com/lanxuezaipiao/p/3371224.html")

二、优质面试题整理---2(里边有7个部分的)：

*   [www.cnblogs.com/wmyskxz/p/9…](https://link.juejin.cn?target=http%3A%2F%2Fwww.cnblogs.com%2Fwmyskxz%2Fp%2F9070737.html "http://www.cnblogs.com/wmyskxz/p/9070737.html")

三、优质面试题整理---3：

*   [blog.csdn.net/jackfrued/a…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fjackfrued%2Farticle%2Fdetails%2F44921941 "https://blog.csdn.net/jackfrued/article/details/44921941")

四、优质面试题整理---4：

*   [mp.weixin.qq.com/s/jl8K-1DW2…](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2Fjl8K-1DW2L2JMl4DQ-aMIA "https://mp.weixin.qq.com/s/jl8K-1DW2L2JMl4DQ-aMIA")

五、优质面试题整理---5：

*   [zhuanlan.zhihu.com/p/23533393](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F23533393 "https://zhuanlan.zhihu.com/p/23533393")

六、优质面试题整理---6(牛客网120题)：

*   [www.nowcoder.com/ta/review-j…](https://link.juejin.cn?target=https%3A%2F%2Fwww.nowcoder.com%2Fta%2Freview-java%2Freview%3Fquery%3D%26asc%3Dtrue%26order%3D%26page%3D1 "https://www.nowcoder.com/ta/review-java/review?query=&asc=true&order=&page=1")

七、优质面试题整理---7：

*   [www.cnblogs.com/w1570631036…](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fw1570631036%2Fp%2F8549333.html "https://www.cnblogs.com/w1570631036/p/8549333.html")

3.2没有答案的面试题
-----------

此部分大多数没有答案的，但都是比较优质的面试题

推荐一：

*   [www.jianshu.com/p/a07d1d400…](https://link.juejin.cn?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2Fa07d1d4004b0 "https://www.jianshu.com/p/a07d1d4004b0")

推荐二：

*   [juejin.cn/post/684490…](https://juejin.cn/post/6844903567338242061 "https://juejin.cn/post/6844903567338242061")

推荐三：

*   [zhuanlan.zhihu.com/p/33495324](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F33495324 "https://zhuanlan.zhihu.com/p/33495324")

四、除面试题之外还要了解的地方
===============

互联网校招指南：

*   [zhuanlan.zhihu.com/p/24887478](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F24887478 "https://zhuanlan.zhihu.com/p/24887478")

程序员简历：

*   [github.com/geekcompany…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fgeekcompany%2FResumeSample%2Fblob%2Fmaster%2Fjava.md "https://github.com/geekcompany/ResumeSample/blob/master/java.md")

三方协议究竟是什么？(我之前看完，**个人简单总结**一下：如果你不是非常确定毕业前留在某间公司，就不要着急签第三方！【我是非专业人员，这方面得多自己考虑，以上是我的**个人**对三方协议的理解】)

*   [zhuanlan.zhihu.com/p/27812661](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F27812661 "https://zhuanlan.zhihu.com/p/27812661")
*   [zhuanlan.zhihu.com/p/27251453](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F27251453 "https://zhuanlan.zhihu.com/p/27251453")
*   [www.zhihu.com/question/55…](https://link.juejin.cn?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F55830264%2Fanswer%2F150124081 "https://www.zhihu.com/question/55830264/answer/150124081")
*   [www.zhihu.com/question/26…](https://link.juejin.cn?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F264144015%2Fanswer%2F277539104 "https://www.zhihu.com/question/264144015/answer/277539104")

简历投递平台(我投递过的)：

*   BOSS直聘
*   前程无忧
*   实习憎

优质的面经+资料：

*   [www.54tianzhisheng.cn/2017/09/17/…](https://link.juejin.cn?target=http%3A%2F%2Fwww.54tianzhisheng.cn%2F2017%2F09%2F17%2FInterview-summary%2F "http://www.54tianzhisheng.cn/2017/09/17/Interview-summary/")

五、总结
====

网上的资源还是多呀，上面基本都是我在逛博客，找资料的时候积累收藏起来的。当然了，网上的资源很多很多，如果你也收藏了自认为比较好的资源，不妨在评论区分享出来一起学习学习~~

这些网上这么多的面试题也不可能全部看完，根据自己的情况来看吧。看面试题也是校验自己是否真正理解了这个知识点，也很有可能会有新的收获。

最后，祝在找工作的朋友们能找到一份心仪的工作，在工作的朋友们能够加薪，在读书的朋友们学业进步哈~~

> 如果文章有错的地方欢迎指正，大家互相交流。习惯在微信看技术文章，想要获取更多的Java资源的同学，可以**关注微信公众号:Java3y**。

**文章的目录导航**：

*   [zhongfucheng.bitcron.com/post/shou-j…](https://link.juejin.cn?target=https%3A%2F%2Fzhongfucheng.bitcron.com%2Fpost%2Fshou-ji%2Fwen-zhang-dao-hang "https://zhongfucheng.bitcron.com/post/shou-ji/wen-zhang-dao-hang")