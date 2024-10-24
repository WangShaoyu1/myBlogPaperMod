---
author: "Java3y"
title: "Java高并发秒杀系统【观后总结】"
date: 2018-03-16
description: "在慕课网上发现了一个JavaWeb项目，内容讲的是高并发秒杀，觉得挺有意思的，就进去学习了一番。 记录在该项目中学到了什么玩意 我结合其资料和观看视频的时候整理出从该项目学到了什么 使用jdbc的getGeneratekeys获取自增主键值，这个属性还是挺有用的。 写…"
tags: ["Java","Java EE中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读15分钟"
weight: 1
selfDefined:"likes:374,comments:0,collects:225,views:19017,"
---
项目简介
====

在慕课网上发现了一个JavaWeb项目，内容讲的是高并发秒杀，觉得挺有意思的，就进去学习了一番。

记录在该项目中学到了什么玩意..

该项目源码对应的gitHub地址（由观看其视频的人编写，并非视频源代码）：[github.com/codingXiaxw…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FcodingXiaxw%2Fseckill "https://github.com/codingXiaxw/seckill")

我结合其资料和观看视频的时候整理出从该项目学到了什么...

项目Dao层
======

日志记录工具：
-------

```


<!--1.日志 java日志有:slf4j,log4j,logback,common-logging
slf4j:是规范/接口
日志实现:log4j,logback,common-logging
使用:slf4j+logback
-->

```

Mybatis之前没注意到的配置属性：
-------------------

**使用jdbc的getGeneratekeys获取自增主键值**，这个属性还是挺有用的。

```

<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
<!--配置全局属性-->
<settings>
<!--使用jdbc的getGeneratekeys获取自增主键值-->
<setting name="useGeneratedKeys" value="true"/>
<!--使用列别名替换列名&emsp;&emsp;默认值为true
select name as title(实体中的属性名是title) form table;
开启后mybatis会自动帮我们把表中name的值赋到对应实体的title属性中
-->
<setting name="useColumnLabel" value="true"/>

<!--开启驼峰命名转换Table:create_time到 Entity(createTime)-->
<setting name="mapUnderscoreToCamelCase" value="true"/>
</settings>

</configuration>
```

Mybatis返回的对象如果有关联字段，除了使用resultMap还有下面这种方式（虽然我还是觉得resultMap会方便一点）

```

<select id="queryByIdWithSeckill" resultType="SuccessKilled">

<!--根据seckillId查询SuccessKilled对象，并携带Seckill对象-->
<!--如何告诉mybatis把结果映射到SuccessKill属性同时映射到Seckill属性-->
<!--可以自由控制SQL语句-->
SELECT
sk.seckill_id,
sk.user_phone,
sk.create_time,
sk.state,
s.seckill_id "seckill.seckill_id",
s.name "seckill.name",
s.number "seckill",
s.start_time "seckill.start_time",
s.end_time "seckill.end_time",
s.create_time "seckill.create_time"
FROM success_killed sk
INNER JOIN seckill s ON sk.seckill_id=s.seckill_id
WHERE sk.seckill_id=#{seckillId}
AND sk.user_phone=#{userPhone}
</select>
```

数据库连接池可能用到的属性：
--------------

```

<!--c3p0私有属性-->
<property name="maxPoolSize" value="30"/>
<property name="minPoolSize" value="10"/>
<!--关闭连接后不自动commit-->
<property name="autoCommitOnClose" value="false"/>

<!--获取连接超时时间-->
<property name="checkoutTimeout" value="1000"/>
<!--当获取连接失败重试次数-->
<property name="acquireRetryAttempts" value="2"/>
```

spring与Junit整合：
---------------

```

/**
* Created by codingBoy on 16/11/27.
* 配置spring和junit整合，这样junit在启动时就会加载spring容器
*/
@RunWith(SpringJUnit4ClassRunner.class)
//告诉junit spring的配置文件
@ContextConfiguration({"classpath:spring/spring-dao.xml"})
    public class SeckillDaoTest {
    
    //注入Dao实现类依赖
    @Resource
    private SeckillDao seckillDao;
    
    
    @Test
        public void queryById() throws Exception {
        long seckillId=1000;
        Seckill seckill=seckillDao.queryById(seckillId);
        System.out.println(seckill.getName());
        System.out.println(seckill);
    }
}
```

Mybatis参数为一个以上时
---------------

之前在学习MyBatis的时候，**如果参数超过了一个，那么是使用Map集合来进行装载的！**

在这次教程中发现，可以不用Map集合（如果都是基本数据类型）！

例子：**使用@Param就行了！**

```

int reduceNumber(@Param("seckillId") long seckillId, @Param("killTime") Date killTime);
```

**在XML文件中可以直接忽略parameterType了！**

避免重复插入数据时抛出异常
-------------

如果主键重复插入数据的时候，Mybatis正常是会抛出异常的，我们又不希望它抛出异常，那么我们可以这样做：

写ignore..

![](/images/jueJin/1622f2a8387b17f.png)

Service层
========

tdo
---

> 一个dto包作为传输层,dto和entity的区别在于:entity用于业务数据的封装，**而dto用于完成web和service层的数据传递。**

对于dto这个概念，在之前我是接触过一次的，但是没有好好地实践起来。这次看到了它的用法了。

我的理解是：**Service与Web层数据传递数据的再包装了一个对象而已**。因为很多时候Service层返回的数据如果使用的是POJO，POJO很多的属性是多余的，还有一些想要的数据又包含不了。此时，**dto又可以再一次对要传输的数据进行抽象，封装想获取的数据**。

定义多个异常对象
--------

之前的异常对象都是针对整个业务的，**其实还是可以细分多个异常类的出来的**。比如“重复秒杀”，”秒杀关闭“这些都是属于秒杀的业务。

这样做的好处就是看到抛出的异常就能够知道是具体哪部分错了。

**对于视频中在Service层就catch住了很多异常，我觉得可以在Service层直接抛出，在Controller也能抛出，直接使用统一异常处理器类来管理会更加方便！**

![](/images/jueJin/1622f2a6a9ec75b.png)

提倡使用注解方式使用事务
------------

![](/images/jueJin/1622f2a6a9f394f.png)

![](/images/jueJin/1622f2a6aa4d394.png)

我觉得就是代码更加清晰吧，使用注解的话。

在视频下面还有同学说如果在Service中调用事务方法会有些坑，我暂时还没遇到过。先存起来吧：

> 并发性上不去是因为当多个线程同时访问一行数据时，产生了事务，因此产生写锁，每当一个获取了事务的线程把锁释放，另一个排队线程才能拿到写锁，QPS和事务执行的时间有密切关系，事务执行时间越短，并发性越高，这也是要将费时的I/O操作移出事务的原因。

> 关于同类中调用事务方法的时候有个坑，同学们需要注意下AOP切不到调用事务方法。事务不会生效，解决办法有几种，可以搜一下，找一下适合自己的方案。本质问题时类内部调用时AOP不会用代理调用内部方法。

> “关于同类中调用事务方法的时候有个坑” 解决方案 1、如果是基于接口动态代理 是没有问题的，直接使用接口调用 2、如果是基于class的动态代理 可以用 AopContext.currentProxy() 解决，注意剥离方法一定是public 修饰 ！！

MD5暴露接口
-------

其实我也在想MD5暴露出去的url是不是真的有用，也见到有人提问了。

[www.imooc.com/qadetail/16…](https://link.juejin.cn?target=https%3A%2F%2Fwww.imooc.com%2Fqadetail%2F164058 "https://www.imooc.com/qadetail/164058")

回答者：

> 不能说没作用，如果不加密，用户截取了你的访问地址，他看到了当前秒杀ID为1000，他完全可以推测出其他的秒杀地址，或者说他可以造出一批地址；视频中秒杀在数据库中判断了秒杀时间，其他时间他自然是秒杀不到，但是对数据库也有一定的冲击，如果他用定时器或者循环秒杀软件，你的系统承受力是个问题；另一方面对于一些还没开始的秒杀，他模拟地址以后，完全可以用定时器一直访问。加密以后由于他拿不到混淆码，就只能通过点击链接进行秒杀……

**简单理解：通过MD5加密以后，用户在秒杀之前模拟不出真实的地址，还是有一定作用的。**

枚举类
---

> 在return new SeckillExecution(seckillId,1,"秒杀成功",successKilled);代码中\*\*，我们返回的state和stateInfo参数信息应该是输出给前端的，但是我们不想在我们的return代码中硬编码这两个参数，所以我们应该考虑用枚举的方式将这些常量封装起来\*\*，

```


    public enum SeckillStatEnum {
    
    SUCCESS(1,"秒杀成功"),
    END(0,"秒杀结束"),
    REPEAT_KILL(-1,"重复秒杀"),
    INNER_ERROR(-2,"系统异常"),
    DATE_REWRITE(-3,"数据篡改");
    
    private int state;
    private String info;
    
        SeckillStatEnum(int state, String info) {
        this.state = state;
        this.info = info;
    }
    
        public int getState() {
        return state;
    }
    
    
        public String getInfo() {
        return info;
    }
    
    
    public static SeckillStatEnum stateOf(int index)
        {
        for (SeckillStatEnum state : values())
            {
            if (state.getState()==index)
                {
                return state;
            }
        }
        return null;
    }
}
```

Web层开发技巧
========

Restful接口设计学习
-------------

之前就已经接触过RESTful这样的思想理念的，可是在第一个项目中是没有用起来的。因为还是不大习惯，怕写成不伦不类的RESTful接口，打算在第二个项目中将RESTful全部应用起来。

![](/images/jueJin/1622f2a6ab0de72.png)

![](/images/jueJin/1622f2a6ac399f7.png)

![](/images/jueJin/1622f2a704ade68.png)

![](/images/jueJin/1622f2a7417c33b.png)

参考博文：[kb.cnblogs.com/page/512047…](https://link.juejin.cn?target=http%3A%2F%2Fkb.cnblogs.com%2Fpage%2F512047%2F "http://kb.cnblogs.com/page/512047/")

SpringMVC之前不知道的细节
-----------------

**@DateTimeFormat注解对时间进行格式化！（这个我暂时没有试验）**

```

<!--配置spring mvc-->
<!--1,开启springmvc注解模式
a.自动注册DefaultAnnotationHandlerMapping,AnnotationMethodHandlerAdapter
b.默认提供一系列的功能:数据绑定，数字和日期的format@NumberFormat,@DateTimeFormat
c:xml,json的默认读写支持-->
<mvc:annotation-driven/>

<!--2.静态资源默认servlet配置-->
<!--
1).加入对静态资源处理：js,gif,png
2).允许使用 "/" 做整体映射
-->
<mvc:default-servlet-handler/>
```

![](/images/jueJin/1622f2a7609e429.png)

![](/images/jueJin/1622f2a760c737f.png)

返回统一格式的JSON
-----------

之前在Web层与Service中封装了dto来进行这两层的数据进行传输，而我们一般都是在Controller返回JSON给前端进行解析。

最好的做法就是将JSON的格式也统一化。这样做就能够很好地形成规范了！

```

//将所有的ajax请求返回类型，全部封装成json数据
    public class SeckillResult<T> {
    
    private boolean success;
    private T data;
    private String error;
    
        public SeckillResult(boolean success, T data) {
        this.success = success;
        this.data = data;
    }
    
        public SeckillResult(boolean success, String error) {
        this.success = success;
        this.error = error;
    }
    
        public boolean isSuccess() {
        return success;
    }
    
        public void setSuccess(boolean success) {
        this.success = success;
    }
    
        public T getData() {
        return data;
    }
    
        public void setData(T data) {
        this.data = data;
    }
    
        public String getError() {
        return error;
    }
    
        public void setError(String error) {
        this.error = error;
    }
}
```

获取JSON数据方式
----------

之前获取JSON都是使用`object.properties`的方式来获取的，这次还看到了另一种方式：

![](/images/jueJin/1622f2a76ddc31d.png)

JavaScript模块化
-------------

之前在项目中写JS代码都是要什么功能，写到哪里的。**看了这次视频，发现JS都可以模块化！！！**

**JS模块化起来可读性还是比之前要好的，这是我之前没有接触过的，以后写JS代码就要注意了！**

下面贴上一段代码来感受一下：

```

/**
*  模块化javaScript
* Created by jianrongsun on 17-5-25.
*/
    var seckill = {
    // 封装秒杀相关的ajax的url
        URL: {
            now: function () {
            return "/seckill/time/now";
            },
                exposer: function (seckillId) {
                return "/seckill/" + seckillId + "/exposer";
                },
                    execution: function (seckillId, md5) {
                    return "/seckill/" + seckillId + "/" + md5 + "/execution";
                }
                },
                // 验证手机号码
                    validatePhone: function (phone) {
                    return !!(phone && phone.length === 11 && !isNaN(phone));
                    },
                    // 详情页秒杀业务逻辑
                        detail: {
                        // 详情页开始初始化
                            init: function (params) {
                            console.log("获取手机号码");
                            // 手机号验证登录，计时交互
                            var userPhone = $.cookie('userPhone');
                            // 验证手机号
                                if (!seckill.validatePhone(userPhone)) {
                                console.log("未填写手机号码");
                                // 验证手机控制输出
                                var killPhoneModal = $("#killPhoneModal");
                                    killPhoneModal.modal({
                                    show: true,  // 显示弹出层
                                    backdrop: 'static',  // 静止位置关闭
                                    keyboard: false    // 关闭键盘事件
                                    });
                                    
                                        $("#killPhoneBtn").click(function () {
                                        console.log("提交手机号码按钮被点击");
                                        var inputPhone = $("#killPhoneKey").val();
                                        console.log("inputPhone" + inputPhone);
                                            if (seckill.validatePhone(inputPhone)) {
                                            // 把电话写入cookie
                                            $.cookie('userPhone', inputPhone, {expires: 7, path: '/seckill'});
                                            // 验证通过 刷新页面
                                            window.location.reload();
                                                } else {
                                                // todo 错误文案信息写到前端
                                                $("#killPhoneMessage").hide().html("<label class='label label-danger'>手机号码错误</label>").show(300);
                                            }
                                            });
                                                } else {
                                                console.log("在cookie中找到了电话号码，开启计时");
                                                // 已经登录了就开始计时交互
                                                var startTime = params['startTime'];
                                                var endTime = params['endTime'];
                                                var seckillId = params['seckillId'];
                                                console.log("开始秒杀时间=======" + startTime);
                                                console.log("结束秒杀时间========" + endTime);
                                                    $.get(seckill.URL.now(), {}, function (result) {
                                                        if (result && result['success']) {
                                                        var nowTime = seckill.convertTime(result['data']);
                                                        console.log("服务器当前的时间==========" + nowTime);
                                                        // 进行秒杀商品的时间判断，然后计时交互
                                                        seckill.countDown(seckillId, nowTime, startTime, endTime);
                                                            } else {
                                                            console.log('结果:' + result);
                                                            console.log('result' + result);
                                                        }
                                                        });
                                                    }
                                                    
                                                }
                                                },
                                                    handlerSeckill: function (seckillId, mode) {
                                                    // 获取秒杀地址
                                                    mode.hide().html('<button class="btn btn-primary btn-lg" id="killBtn">开始秒杀</button>');
                                                    console.debug("开始进行秒杀地址获取");
                                                        $.get(seckill.URL.exposer(seckillId), {}, function (result) {
                                                            if (result && result['success']) {
                                                            var exposer = result['data'];
                                                                if (exposer['exposed']) {
                                                                console.log("有秒杀地址接口");
                                                                // 开启秒杀，获取秒杀地址
                                                                var md5 = exposer['md5'];
                                                                var killUrl = seckill.URL.execution(seckillId, md5);
                                                                console.log("秒杀的地址为:" + killUrl);
                                                                // 绑定一次点击事件
                                                                    $("#killBtn").one('click', function () {
                                                                    console.log("开始进行秒杀,按钮被禁用");
                                                                    // 执行秒杀请求，先禁用按钮
                                                                    $(this).addClass("disabled");
                                                                    // 发送秒杀请求
                                                                        $.post(killUrl, {}, function (result) {
                                                                        var killResult = result['data'];
                                                                        var state = killResult['state'];
                                                                        var stateInfo = killResult['stateInfo'];
                                                                        console.log("秒杀状态" + stateInfo);
                                                                        // 显示秒杀结果
                                                                        mode.html('<span class="label label-success">' + stateInfo + '</span>');
                                                                        
                                                                        });
                                                                        
                                                                        });
                                                                        mode.show();
                                                                            } else {
                                                                            console.warn("还没有暴露秒杀地址接口,无法进行秒杀");
                                                                            // 未开启秒杀
                                                                            var now = seckill.convertTime(exposer['now']);
                                                                            var start = seckill.convertTime(exposer['start']);
                                                                            var end = seckill.convertTime(exposer['end']);
                                                                            console.log("当前时间" + now);
                                                                            console.log("开始时间" + start);
                                                                            console.log("结束时间" + end);
                                                                            console.log("开始倒计时");
                                                                            console.debug("开始进行倒计时");
                                                                            seckill.countDown(seckillId, now, start, end);
                                                                        }
                                                                            } else {
                                                                            console.error("服务器端查询秒杀商品详情失败");
                                                                            console.log('result' + result.valueOf());
                                                                        }
                                                                        });
                                                                        },
                                                                            countDown: function (seckillId, nowTime, startTime, endTime) {
                                                                            console.log("秒杀的商品ID:" + seckillId + ",服务器当前时间：" + nowTime + ",开始秒杀的时间:" + startTime + ",结束秒杀的时间" + endTime);
                                                                            //  获取显示倒计时的文本域
                                                                            var seckillBox = $("#seckill-box");
                                                                            //  获取时间戳进行时间的比较
                                                                            nowTime = new Date(nowTime).valueOf();
                                                                            startTime = new Date(startTime).valueOf();
                                                                            endTime = new Date(endTime).valueOf();
                                                                            console.log("转换后的Date类型当前时间戳" + nowTime);
                                                                            console.log("转换后的Date类型开始时间戳" + startTime);
                                                                            console.log("转换后的Date类型结束时间戳" + endTime);
                                                                                if (nowTime < endTime && nowTime > startTime) {
                                                                                // 秒杀开始
                                                                                console.log("秒杀可以开始,两个条件符合");
                                                                                seckill.handlerSeckill(seckillId, seckillBox);
                                                                            }
                                                                                else if (nowTime > endTime) {
                                                                                alert(nowTime > endTime);
                                                                                // console.log(nowTime + ">" + startTime);
                                                                                console.log(nowTime + ">" + endTime);
                                                                                
                                                                                // 秒杀结束
                                                                                console.warn("秒杀已经结束了,当前时间为:" + nowTime + ",秒杀结束时间为" + endTime);
                                                                                seckillBox.html("秒杀结束");
                                                                                    } else {
                                                                                    console.log("秒杀还没开始");
                                                                                    alert(nowTime < startTime);
                                                                                    // 秒杀未开启
                                                                                    var killTime = new Date(startTime + 1000);
                                                                                    console.log(killTime);
                                                                                    console.log("开始计时效果");
                                                                                        seckillBox.countdown(killTime, function (event) {
                                                                                        // 事件格式
                                                                                        var format = event.strftime("秒杀倒计时: %D天 %H时 %M分 %S秒");
                                                                                        console.log(format);
                                                                                        seckillBox.html(format);
                                                                                            }).on('finish.countdown', function () {
                                                                                            // 事件完成后回调事件，获取秒杀地址，控制业务逻辑
                                                                                            console.log("准备执行回调,获取秒杀地址,执行秒杀");
                                                                                            console.log("倒计时结束");
                                                                                            seckill.handlerSeckill(seckillId, seckillBox);
                                                                                            });
                                                                                        }
                                                                                        },
                                                                                            cloneZero: function (time) {
                                                                                            var cloneZero = ":00";
                                                                                                if (time.length < 6) {
                                                                                                console.warn("需要拼接时间");
                                                                                                time = time + cloneZero;
                                                                                                return time;
                                                                                                    } else {
                                                                                                    console.log("时间是完整的");
                                                                                                    return time;
                                                                                                }
                                                                                                },
                                                                                                    convertTime: function (localDateTime) {
                                                                                                    var year = localDateTime.year;
                                                                                                    var monthValue = localDateTime.monthValue;
                                                                                                    var dayOfMonth = localDateTime.dayOfMonth;
                                                                                                    var hour = localDateTime.hour;
                                                                                                    var minute = localDateTime.minute;
                                                                                                    var second = localDateTime.second;
                                                                                                    return year + "-" + monthValue + "-" + dayOfMonth + " " + hour + ":" + minute + ":" + second;
                                                                                                }
                                                                                                };
                                                                                                
```

高并发性能优化
=======

前三篇已经做好了这个系统了，但是作为一个秒杀系统而言，它能支持的并发量是很低的。那我们现在要考虑怎么调优。

分析
--

秒杀的地址接口可以借助redis来进行优化，不用多次访问数据库。

秒杀操作是与数据库的事务相关的，不能使用缓存来替代了。下面给出的方案是需要修改源码的，难度是比较难的。

![](/images/jueJin/1622f2a76d0c298.png)

![](/images/jueJin/1622f2a77234603.png)

![](/images/jueJin/1622f2a79533499.png)

![](/images/jueJin/1622f2a7a581f29.png)

![](/images/jueJin/1622f2a7b2dd980.png)

下面分析瓶颈究竟在哪：

*   **Mysql执行单条的SQL语句其实是非常快的。**
*   **主要是行级锁事务的等待，网络的延迟和GC回收！**

![](/images/jueJin/1622f2a7b2cdb86.png)

![](/images/jueJin/1622f2a7b913eb2.png)

![](/images/jueJin/1622f2a7bdf1959.png)

![](/images/jueJin/1622f2a7dcab2b5.png)

![](/images/jueJin/1622f2a7e59d167.png)

![](/images/jueJin/1622f2a7f40a9ea.png)

解决思路：
-----

![](/images/jueJin/1622f2a7ff41f7a.png)

![](/images/jueJin/1622f2a7fff3220.png)

解决秒杀接口
------

对于秒杀接口而言，需要使用到Redis将数据进行缓存起来。那么用户就访问就不用去访问数据库了，我们给Redis缓存的数据就好了。

![](/images/jueJin/1622f2a813b187f.png)

这次使用Jedis来操作Redis.

还有值得 注意的地方：**我们可以使用ProtostuffIOUtil来代替JDK的序列化，因为这个的序列化功能比JDK的要做得好很多！**

```

package com.suny.dao.cache;

import com.dyuproject.protostuff.LinkedBuffer;
import com.dyuproject.protostuff.ProtostuffIOUtil;
import com.dyuproject.protostuff.runtime.RuntimeSchema;
import com.suny.entity.Seckill;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

/**
* 操作Redis的dao类
* Created by 孙建荣 on 17-5-27.下午4:44
*/
    public class RedisDao {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    
    private final JedisPool jedisPool;
    
    private RuntimeSchema<Seckill> schema = RuntimeSchema.createFrom(Seckill.class);
    
        public RedisDao(String ip, int port) {
        jedisPool = new JedisPool(ip, port);
    }
    
        public Seckill getSeckill(long seckillId) {
        // redis操作业务逻辑
            try (Jedis jedis = jedisPool.getResource()) {
            String key = "seckill:" + seckillId;
            // 并没有实现内部序列化操作
            //get->byte[]字节数组->反序列化>Object(Seckill)
            // 采用自定义的方式序列化
            // 缓存获取到
            byte[] bytes = jedis.get(key.getBytes());
                if (bytes != null) {
                // 空对象
                Seckill seckill = schema.newMessage();
                ProtostuffIOUtil.mergeFrom(bytes, seckill, schema);
                // seckill被反序列化
                return seckill;
            }
                } catch (Exception e) {
                logger.error(e.getMessage(), e);
            }
            return null;
        }
        
            public String putSeckill(Seckill seckill) {
        //  set Object(Seckill) -> 序列化 -> byte[]
            try (Jedis jedis = jedisPool.getResource()) {
            String key = "seckill:" + seckill.getSeckillId();
            byte[] bytes = ProtostuffIOUtil.toByteArray(seckill, schema,
            LinkedBuffer.allocate(LinkedBuffer.DEFAULT_BUFFER_SIZE));
            // 超时缓存
            int timeout=60*60;
            return jedis.setex(key.getBytes(), timeout, bytes);
                } catch (Exception e) {
                logger.error(e.getMessage(), e);
            }
            return null;
        }
        
        
    }
    
    
``````

<!--导入连接redis的JAR包-->
<dependency>
<groupId>redis.clients</groupId>
<artifactId>jedis</artifactId>
<version>2.9.0</version>
</dependency>

<!--添加序列化依赖-->
<dependency>
<groupId>com.dyuproject.protostuff</groupId>
<artifactId>protostuff-core</artifactId>
<version>1.1.1</version>
</dependency>
<dependency>
<groupId>com.dyuproject.protostuff</groupId>
<artifactId>protostuff-runtime</artifactId>
<version>1.1.1</version>
</dependency>
```

RedisDao并不受Mybatis的代理影响，于是是需要我们自己手动创建的。

![](/images/jueJin/1622f2a83821fd0.png)

最终，我们的service逻辑就会变成这样子：

![](/images/jueJin/1622f2a83a5b008.png)

秒杀操作优化
------

再次回到我们的秒杀操作，其实需要优化的地方就是我们的GC和行级锁等待的时间。

![](/images/jueJin/1622f2a838b0137.png)

我们之前的逻辑是这样的：**先执行减库存操作，再插入购买成功的记录**

**其实，我们可以先插入成功购买的记录，再执行减库存的操作！**

*   那这两者有啥区别呢？？？**减库存的操作会导致行级锁的等待，而我们先进行insert的话，那么就不会被行级锁所干扰了。并且，我们这中两个操作是在同一个事物中的，并不会出现“超卖”的情况！**

> 关于先执行insert与先执行update的区别,**两个事务同时insert的情况下,没有锁竞争,执行速度会快,当两个事务先update同一行数据,会有一个事务获得行锁,锁在事务提交之前都不会释放,所以让锁被持有的时间最短能提升效率**

所以我们service层的逻辑可以改成这样：

![](/images/jueJin/1622f2a84be0fa4.png)

这不是最终的方案，如果为了性能的优化我们还可以将SQL在Mysql中运行，不受Spring的事务来管理。**在Mysql使用存储过程来进行提交性能**

```


-- 秒杀执行储存过程
DELIMITER ? -- console ; 转换为
?
-- 定义储存过程
-- 参数： in 参数   out输出参数
-- row_count() 返回上一条修改类型sql(delete,insert,update)的影响行数
-- row_count:0:未修改数据 ; >0:表示修改的行数； <0:sql错误
CREATE PROCEDURE `seckill`.`execute_seckill`
(IN v_seckill_id BIGINT, IN v_phone BIGINT,
IN v_kill_time  TIMESTAMP, OUT r_result INT)
BEGIN
DECLARE insert_count INT DEFAULT 0;
START TRANSACTION;
INSERT IGNORE INTO success_killed
(seckill_id, user_phone, create_time)
VALUES (v_seckill_id, v_phone, v_kill_time);
SELECT row_count()
INTO insert_count;
IF (insert_count = 0)
THEN
ROLLBACK;
SET r_result = -1;
ELSEIF (insert_count < 0)
THEN
ROLLBACK;
SET r_result = -2;
ELSE
UPDATE seckill
SET number = number - 1
WHERE seckill_id = v_seckill_id
AND end_time > v_kill_time
AND start_time < v_kill_time
AND number > 0;
SELECT row_count()
INTO insert_count;
IF (insert_count = 0)
THEN
ROLLBACK;
SET r_result = 0;
ELSEIF (insert_count < 0)
THEN
ROLLBACK;
SET r_result = -2;
ELSE
COMMIT;
SET r_result = 1;

END IF;
END IF;
END;
?
--  储存过程定义结束
DELIMITER ;
SET @r_result = -3;
--  执行储存过程
CALL execute_seckill(1003, 13502178891, now(), @r_result);
-- 获取结果
SELECT @r_result;
```

![](/images/jueJin/1622f2a8e49239b.png)

Mybatis调用存储过程其实和JDBC是一样的:

![](/images/jueJin/1622f2c67b44484.png)

在使用存储过程的时候，我们需要4个参数，其实result是在存储过程中被赋值的。**我们可以通过MapUtils来获取相对应的值。这是我之前没有接触过的。**

![](/images/jueJin/1622f2a8e475d5c.png)

![](/images/jueJin/1622f2a8e85851c.png)

最后，对于部署的系统架构应该是这样子的：

![](/images/jueJin/1622f2a8efd00a2.png)

总结
==

花了点时间看了该视频教程，觉得还是学到了不少的东西的。之前没有接触过优化的相关问题，现在给我打开了思路，以及学到了不少的开发规范的问题，也是很赞的。如果是初学者的话是可以去学学的。

> 如果文章有错的地方欢迎指正，大家互相交流。习惯在微信看技术文章，想要获取更多的Java资源的同学，可以**关注微信公众号:Java3y**