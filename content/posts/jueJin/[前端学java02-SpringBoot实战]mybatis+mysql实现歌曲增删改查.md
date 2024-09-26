---
author: "woow_wu7"
title: "[前端学java02-SpringBoot实战]mybatis+mysql实现歌曲增删改查"
date: 2021-02-14
description: "1.点击头像=>settings=>Developersettings=>OAuthApps=>RegisteranewOAuthapplication=>...a.携带3获得的相关parameter请求授权登陆地址，成功会扭转到redire…"
tags: ["前端"]
ShowReadingTime: "阅读11分钟"
weight: 426
---
导航
==

[\[react\] Hooks](https://juejin.im/post/6844904045342113799 "https://juejin.im/post/6844904045342113799")

[\[React 从零实践01-后台\] 代码分割](https://juejin.im/post/6879020830253285384 "https://juejin.im/post/6879020830253285384")  
[\[React 从零实践02-后台\] 权限控制](https://juejin.im/post/6881481205657632781 "https://juejin.im/post/6881481205657632781")  
[\[React 从零实践03-后台\] 自定义hooks](https://juejin.im/post/6887132776512880654 "https://juejin.im/post/6887132776512880654")  
[\[React 从零实践04-后台\] docker-compose 部署react+egg+nginx+mysql](https://juejin.im/post/6892390655126241287 "https://juejin.im/post/6892390655126241287")  
[\[React 从零实践05-后台\] Gitlab-CI使用Docker自动化部署](https://juejin.cn/post/6897884843275714567 "https://juejin.cn/post/6897884843275714567")

[\[源码-webpack01-前置知识\] AST抽象语法树](https://juejin.im/post/6844904115265339406 "https://juejin.im/post/6844904115265339406")  
[\[源码-webpack02-前置知识\] Tapable](https://juejin.im/post/6844904115269550087 "https://juejin.im/post/6844904115269550087")  
[\[源码-webpack03\] 手写webpack - compiler简单编译流程](https://juejin.im/post/6844903973002936327 "https://juejin.im/post/6844903973002936327")  
[\[源码\] Redux React-Redux01](https://juejin.im/post/6844904137952329742 "https://juejin.im/post/6844904137952329742")  
[\[源码\] axios](https://juejin.im/post/6844904147532120072 "https://juejin.im/post/6844904147532120072")  
[\[源码\] vuex](https://juejin.im/post/6844904166293241863 "https://juejin.im/post/6844904166293241863")  
[\[源码-vue01\] data响应式 和 初始化渲染](https://juejin.im/post/6844904181094957069 "https://juejin.im/post/6844904181094957069")  
[\[源码-vue02\] computed 响应式 - 初始化，访问，更新过程](https://juejin.im/post/6844904184035147790 "https://juejin.im/post/6844904184035147790")  
[\[源码-vue03\] watch 侦听属性 - 初始化和更新](https://juejin.im/post/6844904186652409863 "https://juejin.im/post/6844904186652409863")  
[\[源码-vue04\] Vue.set 和 vm.$set](https://juejin.im/post/6844904190918000654 "https://juejin.im/post/6844904190918000654")  
[\[源码-vue05\] Vue.extend](https://juejin.im/post/6844904201944825863 "https://juejin.im/post/6844904201944825863")

[\[源码-vue06\] Vue.nextTick 和 vm.$nextTick](https://juejin.im/post/6847902219107303438 "https://juejin.im/post/6847902219107303438")  
[\[部署01\] Nginx](https://juejin.im/post/6844904095464030215 "https://juejin.im/post/6844904095464030215")  
[\[部署02\] Docker 部署vue项目](https://juejin.im/post/6844904099024994312 "https://juejin.im/post/6844904099024994312")  
[\[部署03\] gitlab-CI](https://juejin.im/post/6844904103944912904 "https://juejin.im/post/6844904103944912904")

[\[数据结构和算法01\] 二分查找和排序](https://juejin.cn/post/6907145602400780296/ "https://juejin.cn/post/6907145602400780296/")

[\[深入01\] 执行上下文](https://juejin.im/post/6844904046050934792 "https://juejin.im/post/6844904046050934792")  
[\[深入02\] 原型链](https://juejin.im/post/6844904048873701389 "https://juejin.im/post/6844904048873701389")  
[\[深入03\] 继承](https://juejin.im/post/6844904050895372295 "https://juejin.im/post/6844904050895372295")  
[\[深入04\] 事件循环](https://juejin.im/post/6844904051562250254 "https://juejin.im/post/6844904051562250254")  
[\[深入05\] 柯里化 偏函数 函数记忆](https://juejin.im/post/6844904052879261710 "https://juejin.im/post/6844904052879261710")  
[\[深入06\] 隐式转换 和 运算符](https://juejin.im/post/6844904052937981959 "https://juejin.im/post/6844904052937981959")  
[\[深入07\] 浏览器缓存机制（http缓存机制）](https://juejin.im/post/6844904053013479432 "https://juejin.im/post/6844904053013479432")  
[\[深入08\] 前端安全](https://juejin.im/post/6844904053235793927 "https://juejin.im/post/6844904053235793927")  
[\[深入09\] 深浅拷贝](https://juejin.im/post/6844904053764259854 "https://juejin.im/post/6844904053764259854")  
[\[深入10\] Debounce Throttle](https://juejin.im/post/6844904054330490894 "https://juejin.im/post/6844904054330490894")  
[\[深入11\] 前端路由](https://juejin.im/post/6844904054846390279 "https://juejin.im/post/6844904054846390279")  
[\[深入12\] 前端模块化](https://juejin.im/post/6844904056557682701 "https://juejin.im/post/6844904056557682701")  
[\[深入13\] 观察者模式 发布订阅模式 双向数据绑定](https://juejin.im/post/6844904058604486663 "https://juejin.im/post/6844904058604486663")  
[\[深入14\] canvas](https://juejin.im/post/6844904063029477389 "https://juejin.im/post/6844904063029477389")  
[\[深入15\] webSocket](https://juejin.im/post/6844904066808561677 "https://juejin.im/post/6844904066808561677")  
[\[深入16\] webpack](https://juejin.im/post/6844904070201753608 "https://juejin.im/post/6844904070201753608")  
[\[深入17\] http 和 https](https://juejin.im/post/6844904085750038542 "https://juejin.im/post/6844904085750038542")  
[\[深入18\] CSS-interview](https://juejin.im/post/6844904090644774926 "https://juejin.im/post/6844904090644774926")  
[\[深入19\] 手写Promise](https://juejin.im/post/6844903823429861389 "https://juejin.im/post/6844903823429861389")  
[\[深入20\] 手写函数](https://juejin.im/post/6844904131577004040 "https://juejin.im/post/6844904131577004040")  
[\[深入21\] 数据结构和算法 - 二分查找和排序](https://juejin.cn/post/6907145602400780296/ "https://juejin.cn/post/6907145602400780296/")  
[\[深入22\] js和v8垃圾回收机制](https://juejin.cn/post/6911192116651622413 "https://juejin.cn/post/6911192116651622413")  
[\[深入23\] JS设计模式 - 代理，策略，单例](https://juejin.cn/post/6918744081460002824 "https://juejin.cn/post/6918744081460002824")

[\[前端学java01-SpringBoot实战\] 环境配置和HelloWorld服务](https://juejin.cn/post/6927306093970325517 "https://juejin.cn/post/6927306093970325517")  
[\[前端学java02-SpringBoot实战\] mybatis + mysql 实现歌曲增删改查](https://juejin.cn/post/6929145638898794503 "https://juejin.cn/post/6929145638898794503")

(一) 前置知识
========

### (1) 一些单词

matlab

 代码解读

复制代码

`pet 宠物 configuration 配置 assistant 助理，售货员 resources 资源，系统资源文件夹 amend 修正，修订 authorize 授权v authorization 授权n bio 个人描述 refactor 重构 extract 提取 // extract common part from 'if' 从if语句中提取出相同的部分 mapper 映射器，变换器 persistent 持久的 judge 判断 sign in 登入 sign out 登出 sign up 注册`

### (2) 如何给类或方法添加注释

*   把光标停在 ( 类名或者方法名 ) 上，然后 `Alt+Enter`，出现几个选项，选择`Add Javadoc`就OK了

### (3) @Controller

*   当给类添加了`@Controller注解`时，SpringBoot就会自动识别扫描该类，把它作为`bean`去管理，同时也识别该类是一个`controller`
*   重点注意 controller server mapper 三者的关系

### (4) IDEA常用快捷键

*   `ctrl+p` 方法参数提示
*   `ctrl+alt+l` 代码格式化
*   `ctrol+alt+o` 删除没有使用到的引入的文件或依赖
*   `sout` System.out.println()

### (5) SpringBoot工程文件说明

*   `src/main/java` 所有的java代码
*   `src/main/resources` 配置文件和静态文件
    *   `resources/templates` 模板文件
    *   `resources/static` 静态文件，比如css，img文件
    *   `resources/application.properties` 配置文件，当然也可以改成`application.yml`

### (6) GitHub 授权登陆

*   1.`点击头像 => settings => Developer settings => OAuth Apps => Register a new OAuth application => ...`
*   2.[官网授权登陆教程 - \[ 获取 Client ID 和 Authorization callback URL \]](https://link.juejin.cn?target=https%3A%2F%2Fdocs.github.com%2Fen%2Fdevelopers%2Fapps%2Fcreating-an-oauth-app "https://docs.github.com/en/developers/apps/creating-an-oauth-app")
*   3.通过上面的12两步，可以获取到 **`Client ID`** 和 **`Authorization callback URL`**
*   4.[官网授权登陆教程 - \[ 具体的跳转流程 \]](https://link.juejin.cn?target=https%3A%2F%2Fdocs.github.com%2Fen%2Fdevelopers%2Fapps%2Fauthorizing-oauth-apps "https://docs.github.com/en/developers/apps/authorizing-oauth-apps")
    *   a. 携带3获得的相关parameter请求授权登陆地址，成功会扭转到redirect\_uri地址，同时返回 ( **code** ) 和 ( **state** )
    *   b. 用 ( **code** ) 换取 ( **access\_token** )
    *   c. 用 ( **access\_token** ) 访问github的 ( **user** ) 接口，获取用户信息
*   5.测试：`https://api.github.com/user?access_token=xxx`

### (7) IDEA 找不到 Database 选项卡

*   搜索 `Plugins => Database Navigator` 并安装该插件
*   这里我没用这个插件，而是使用 `Navicat` 来设计管理数据库

### (8) mysql的一些基础知识

*   [安装-免费的社区版本-最底部-MySQL Community Server](https://link.juejin.cn?target=https%3A%2F%2Fdev.mysql.com%2Fdownloads%2Fmysql%2F "https://dev.mysql.com/downloads/mysql/")
*   [教程](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fqq_34889607%2Farticle%2Fdetails%2F80613028 "https://blog.csdn.net/qq_34889607/article/details/80613028")
*   [常用命令教程](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fqq_38328378%2Farticle%2Fdetails%2F80858073 "https://blog.csdn.net/qq_38328378/article/details/80858073")
*   注意点: 最后面的分号一定要加
*   常用命令
    *   连接数据库 `mysql -h主机地址 -u用户名 －p用户密码`
    *   退出mysql `exit`
    *   查看数据库 `show databases;`
    *   创建数据库 `create database 数据库名;`
    *   删除数据库 `drop database 数据库名;`
    *   **使用数据库** **`use 数据库名;`**
    *   **查看当前使用的数据库** **`select database();`**
    *   查看表 `show tables;`
    *   创建表 `create table 表名 (dde列名 类型);`
    *   删除表 `droop table 表名;`
    *   **显示表结构** **`desc 表名;`**
    *   修改密码 `mysqladmin -uroot -p123456 password 12345678;`
    *   **查看数据库的安装路径** **`show variables like "%char%";`** ![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ad44b8b1d1b4eeba3c05441cf280669~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### (9) @Autowired 和 new 的区别？

*   `@Autowired`
    *   注解方式是由spring创建的对象 ( **单例** ) 对象 作用域是整个项目 项目一启动就创建了
*   `new`
    *   new出来的对象作用域只在你对应的类中 每个调用的时候都是会创建一个新的对象，是 ( **多例** )

### (10) po dto entity bean 等文件夹的区别

*   [相关资料](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2FEasonJim%2Fp%2F7967949.html "https://www.cnblogs.com/EasonJim/p/7967949.html")
*   **`po`** `entity bean` 三个类似，都是持久化对象persistent，即 `数据库中的一条记录对象`
*   **`dto`** 是经过处理后的po，`和ui层即前端页面对应`

### (11) controller层，server层，mapper层，之间的关系

*   **`controller`**
    *   负责http请求，将参数等信息传递给server层，并将结果返回给客户端
*   **`server`**
    *   负责处理逻辑
    *   当需要同时处理多个表的关系时，一般都交给sever来组装处理，比如合并多个model
    *   接收controller传递的参数，并调用mapper
*   **`mapper`** ( DAO )
    *   负责对数据库增删改查

### (12) java中的 ( 数组 )

*   使用大括号包裹的成员 `int[] a = {1, 2, 3, 4}`
*   刚开始把我搞蒙蔽，注意不是ts中的 `let a: number[] = [1,2,3,4]`

ini

 代码解读

复制代码

`int[] a = {1, 2, 3, 4}`

### (13) RESTful API 接口规范

*   [RESTful API](https://link.juejin.cn?target=http%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2014%2F05%2Frestful_api.html "http://www.ruanyifeng.com/blog/2014/05/restful_api.html")

### (14) Map

*   `Map` 中 `键和值一一映射，可以通过键来获取值`
*   `Object put(Object k, Object v)` 存
*   `Object get(Object k)` 取

typescript

 代码解读

复制代码

`public class CollectionsDemo {    public static void main(String[] args) {       Map m1 = new HashMap(); // new HashMap()       m1.put("Zara", "8");       m1.put("Mahnaz", "31");       System.out.println(" Map Elements");       System.out.print("\t" + m1);    } } 结果： Map Elements         {Mahnaz=31, Zara=8}`

### (14) springboot中如何解析前端传来的json类型的参数

*   **因为**：前端在 `POST` 请求中，一般设置的header中的 `Content-Type: application/json`
*   **所以**：`POST`请求出入的参数被放在`body`中，以`JSON`形式传给后端
*   **解决**: 利用 `@RequestBody` 获取到body对象，然后通过 `Map` 做映射，通过`get`获取属性

less

 代码解读

复制代码

   `// 新增     @PostMapping("/musics")     public void addMusics(             @RequestBody Map<String, Object> body     ) {         String name = (String) body.get("name");         String album = (String) body.get("album");         String singer = (String) body.get("singer");         musicService.add(name, album, singer);     }`

### (15) String -> Timestamp -> datetime 三者的转换

*   `java中的Timestamp` 相当于 `数据库中的datatime`
*   **`Timestamp.valueOf(String v)`**

ini

 代码解读

复制代码

`public Boolean edit(Map<String, Object> body) {     int id = (int) body.get("id");     String name = (String) body.get("name");     String album = (String) body.get("album");     String singer = (String) body.get("singer");          // ( Timestamp ) 类型对应的是数据库中的 ( datetime ) 类型     Timestamp startTime = Timestamp.valueOf((String) body.get("startTime"));          // Timestamp.valueOf(string v) 将string转成timestamp     Timestamp endTime = Timestamp.valueOf((String) body.get("endTime"));           int status = musicMapper.editMusic(name, album, singer, startTime, endTime, id);     Boolean aBoolean = judgeIsSuccess(status);     return aBoolean; }`

### (16) 热更新

*   当每次修改java代码时都必须手动 run Application 很麻烦
*   `spring-boot-devtools` 可以实现热更新
*   **设置过程**
    *   1.引入`spring-boot-devtools`的maven包
    *   2.**`setting => Build,Execution,Deployment => Compiler => 勾上Build project automaticallly`**
        *   第2步有个缺点，就是必须在没有running或debugging的情况才热更新
    *   3.`ctrl + shift + a` 调出 `action`
    *   4.在 `action` 中搜索 `Registry`
    *   5.在 `Registry` 中勾选 **`compiler.autoMake.allow.when.app.running`**
    *   6.如果前端展示是直接写的html，则还可以添加一个浏览器插件 **`LiveReload`**
        *   如果是vue或者react的单页项目就不需要了
        *   注意：(一般情况，请忽略该注意 )
            *   描述：当只是修改html时，是不会再重启java程序的，因为本身并没有去修改server相关的代码
            *   非要解决：需要配置如下
            *   `application.properties => spring.devtools.restart.exclude=static/**,public/**`

xml

 代码解读

复制代码

`<!-- spring-boot-devtools 热更新 --> <dependency>   <groupId>org.springframework.boot</groupId>   <artifactId>spring-boot-devtools</artifactId>   <optional>true</optional>   <scope>true</scope> </dependency>`

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/696c6dc7cb184e2f9c4122c5b45d685e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)  
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff2aaf4e7012439b8d81ab6fd4253430~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)  
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03dea0d9d04d453bb2131e63ba3637d0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)  
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0b6c27acf774e40961ae532d2fcf660~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)  
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a30b782108fb4ef481240c9b3b3b273a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

(二) 从零开始一个项目
============

(1) 新建一个SpringBoot项目 ( Spring Assistant)
----------------------------------------

*   **安装插件**：`file => setting => plugins => 在Marketplace中搜索并安装插件 => Spring Assistant`
*   **新建项目**：`file => New Project => Spring Assistant => Next => Web => Spring Web => Finish`
*   使用 Spring Assistant 和使用 maven 创建项目的区别？
    *   主要就是Spring Assistant配置好了web开发的 pom.xml 中的配置项
    *   使用maven需要自己配置 `parent` `spring-boot-starter-web` `spring-boot-starter-thymeleaf` 等

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dfcb8a570d1f4e998af0626aa057a7e2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)  
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21790cd9ba58457d9c0d2b2aef5ee94d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)  
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a7ab92c654c4bdaaaab179b6237e7ef~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/036f46bde2b648d8bfbc643e69497b5f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) ![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0871127ec9004841aaf7aad3aefd9c75~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

*   也可以勾选下面这四个 ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1f2352480f1404c800f57bfaeb84239~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

(2) 配置文件的分离
-----------

*   怎么样根据不同的环境，来读取不同的配置文件?? ( 类似于前端的环境变量，比如process.env.NODE\_ENV )
*   springboot的配置文件有以下
    *   **application.properties**
    *   **application-dev.properties 开发环境**
    *   **application-prod.properties 运行环境**
    *   **application-test.properties 测试环境**

ini

 代码解读

复制代码

`在不同环境的配置文件中，设置同步变量的不同值即可 如下： ------- server.port = 7777 # 第一段的github起到分类的作用，便于识别 # 1. 比如： server 和 github 就是不同的两种类型 # 2. 使用时需要使用 @Value 注解来引入这里定义的属性变量 github.client.client_id = 982573d16925889ea84c github.client.client_secret = 9a2e9710af69531e51254e6902ab834905a7a755 github.client.redirect_uri = http://localhost:7777/callback`

(3) 利用 mybatis 操作 mysql 实现CURD
------------------------------

### 1\. 安装相关的maven依赖

*   因为：是通过 `Spring Assistant` 创建的项目
*   所以：自动配好了 `parent spring-boot-starter-web spring-boot-starter` 等maven依赖

xml

 代码解读

复制代码

`pom.xml ------- 2022.04.19 更新 <!-- jdbc依赖 --> <!-- 该场景启动器的主要作用：具有 ( 事务，jdbc，数据源 ) --> <!-- 该场景启动器不包含：数据库驱动，因为SpringBoot并不知道我们使用什么数据库，所以需要安装数据库驱动 --> <dependency>   <groupId>org.springframework.boot</groupId>   <artifactId>spring-boot-starter-jdbc</artifactId> </dependency> <!-- mysql数据库驱动, 版本需要和你安装的mysql版本保持一致 --> <dependency>   <groupId>mysql</groupId>   <artifactId>mysql-connector-java</artifactId>   <version>8.0.21</version>   <scope>runtime</scope> </dependency> <!-- mybatis --> <dependency>   <groupId>org.mybatis.spring.boot</groupId>   <artifactId>mybatis-spring-boot-starter</artifactId>   <version>2.1.3</version> </dependency>`

### 2\. 在 application.properties 中配置数据源组件配置项

ini

 代码解读

复制代码

`application.properties ------- # 定义数据源组件 # 已弃用 spring.datasource.driver-class-name=com.mysql.jdbc.Driver # 注意 spring.datasource.url="jdbc:mysql://localhost:3306/数据库名称?时区信息" # 注意 上面的时区信息不能少，不然会报错 # 分别是 ( 数据库url ) ( 数据库驱动 ) ( 用户名 ) ( 密码 ) spring.datasource.url=jdbc:mysql://localhost:3306/7-community-java?serverTimezone=GMT%2B8&useSSL=false spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver spring.datasource.username=root spring.datasource.password=root`

### 3\. `插入数据到数据库`

##### 3-1 新建model，通过new Model()将数据绑定到实例属性上，然后将实例传入mapper的insert方法中

*   `model` 主要是用于`数据库操作相关`的`对象`，专门命名为model
*   model 会在 mapper 或 controller 中用到

vbnet

 代码解读

复制代码

`model ------- public class UserModel {     private Integer id;     private String name;     private String accountId;     private String token;     private Long gmtCreate;     private Long gmtModified;     getter adnd setter and toString... }`

##### 3-2 新建mapper通过 @Mapper @Insert 将数据插入数据库

*   `mapper` 主要用于操作数据库
*   注意
    *   mapper 是 **`interface`**
    *   mapper中的 `UserMapper.insert()` 方法是在 `controller` 中被调用的

java

 代码解读

复制代码

`mapper ------- @Mapper public interface UserMapper {     @Insert("insert into user (name, account_id, token, gmt_create, gmt_modified) values (#{name}, #{accountId}, #{token}, #{gmtCreate}, #{gmtModified})")     void insert(UserModel user); }`

#### 3-3 新建 controller，通过 @Autowired 引入mapper，并调用mapper中的insert()方法

scss

 代码解读

复制代码

`controller ------- import com.example.demo.model.UserModel; @Controller public class AuthorizeController {     @Autowired     private UserMapper userMapper;     @GetMapping("/callback")     public String callback() {         UserModel user = new UserModel(); // 注意区分@Autowired 和 new 的区别 	user.setToken(UUID.randomUUID().toString());         user.setName(gitHubUser.getName());         ...         userMapper.insert(user);         // 1. 登陆后获取用户信息后，将数据写入user对象中         // 2. 调用 mapper 中的 userMapper.insert(user) 将user存入数据库     } }`

* * *

* * *

* * *

### 4\. `增删改查数据库数据`

*   通过4-123步就能通过接口访问到music列表数据
*   数据库表如下图 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d0cf6df1cba24ce3972c57c4cf5cd0c9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

##### 4.1 新建model - MusicModel

typescript

 代码解读

复制代码

`model - MusicModel ------- // model // model 专门用来做数据库相关的模型对象 @Data public class MusicModel {     private Integer id;     private String name;     private String album;     private String singer;     private String endTime;     private String startTime;     getter sertter toString 等  }`

##### 4.2 新建 mapper - MusicMapper

java

 代码解读

复制代码

 `mapper - MusicMapper  -------   // mapper // 1. mapper文件夹主要是用来映射数据库的相关操作 // 2. 注意：mapper 是 interface @Mapper public interface MusicMapper {     @Select(             "SELECT * from music where"                     + " name like CONCAT('%',#{searchKey},'%') or "                     + " album like CONCAT('%',#{searchKey},'%') or "                     + " singer like CONCAT('%',#{searchKey},'%')"                     + " limit #{offset},#{pageSize}"     )     public List<MusicModel> selectMusics(Integer pageSize, Integer offset, String searchKey); // 查找 - 分页 + 条件模糊查询     @Select("SELECT * from music limit #{offset},#{pageSize}")     public List<MusicModel> selectMusicsOnlyPagination(Integer pageSize, Integer offset); // 查找 - 分页查询     @Select("SELECT * from music")     public List<MusicModel> selectAllMusics(); // 查找 - 总数据     @Insert("insert into music (name, album, singer, startTime, endTime) values (#{name}, #{album}, #{singer}, #{startTime}, #{endTime})")     public int insertMusic(String name, String album, String singer, Date startTime, Date endTime); // 插入     @Update("update music set name=#{name},album=#{album},singer=#{singer},startTime=#{startTime},endTime=#{endTime} where id=#{id}")     public int editMusic(String name, String album, String singer, Timestamp startTime, Timestamp endTime, int id);     @Delete("delete from music where id=#{id}")     public int deleteMusic(int id); // 删除 }`

##### 4.3 新建 service - MusicService

ini

 代码解读

复制代码

`ervice - MusicService ------- // service // 1. 主要用于处理获取请求参数后的处理逻辑 // 2. server 是连接 controller 和 mapper(DAO) 的桥梁 @Service public class MusicService {     @Autowired     private MusicMapper musicMapper;     // 逻辑抽离 - 判断操作是否成功，比如添加，删除     private Boolean judgeIsSuccess(int status) {         if (status > 0) {             System.out.println("操作成功");             return true;         } else {             System.out.println("操作失败");             return false;         }     }     // 列表     public PaginationDTO list(Integer pageSize, Integer current, String searchKey) {         Integer offset = pageSize * (current - 1); // 分页的偏移量         List<MusicModel> musicModels;         if (searchKey != null) { // searchKey 是否存在             musicModels = musicMapper.selectMusics(pageSize, offset, searchKey); // 分页 + 条件         } else {             musicModels = musicMapper.selectMusicsOnlyPagination(pageSize, offset); // 分页         }         List<MusicModel> totalMusics = musicMapper.selectAllMusics(); // 总数据是为了获取 total         PaginationDTO paginationDTO = new PaginationDTO(); // 这里之所以要new，是因为其他方法中也可能会用到paginationDTO,所以必须不能是单列         paginationDTO.musics = musicModels;         paginationDTO.total = totalMusics.toArray().length;         paginationDTO.current = current;         paginationDTO.pageSize = pageSize;         return paginationDTO;     }     // 新增     public Boolean add(String name, String album, String singer) {         Date startTime = new Date(); // 注意：数据库中的data是 ( datetime ) 格式         Date endTime = new Date();         int status = musicMapper.insertMusic(name, album, singer, startTime, endTime);         Boolean aBoolean = judgeIsSuccess(status);         return aBoolean;     }     // 修改     public Boolean edit(Map<String, Object> body) {         int id = (int) body.get("id");         String name = (String) body.get("name");         String album = (String) body.get("album");         String singer = (String) body.get("singer");         Timestamp startTime = Timestamp.valueOf((String) body.get("startTime")); // ( Timestamp ) 类型对应的是数据库中的 ( datetime ) 类型         Timestamp endTime = Timestamp.valueOf((String) body.get("endTime"));         int status = musicMapper.editMusic(name, album, singer, startTime, endTime, id);         Boolean aBoolean = judgeIsSuccess(status);         return aBoolean;     }     // 删除     public Boolean delete(int id) {         int status = musicMapper.deleteMusic(id);         Boolean aBoolean = judgeIsSuccess(status);         return aBoolean;     } }`

##### 4.4 新建 controller - Musics

less

 代码解读

复制代码

`controller - Musics ------- //@Controller //@ResponseBody @RestController // 是上面两个注解的合集 public class MusicController {     @Autowired     MusicService musicService;     // 列表     // @RequestMapping(value="/musics", method = {RequestMethod.GET})     @GetMapping("/musics")     public PaginationDTO getMusics(             @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,             @RequestParam(name = "current", defaultValue = "1") Integer current,             @RequestParam(name = "searchKey", required = false) String searchKey     ) {         PaginationDTO musics = musicService.list(pageSize, current, searchKey);         System.out.println(musics);         return musics;     }     // 新增     @PostMapping("/musics/add")     public Map<String, Object> addMusics(             @RequestBody Map<String, Object> body     ) {         String name = (String) body.get("name");         String album = (String) body.get("album");         String singer = (String) body.get("singer");         Boolean isSuccess = musicService.add(name, album, singer);         body.put("isSuccess", isSuccess); // 是否成功         return body;     }     // 修改     @PostMapping("/musics/edit")     public Map<String, Object> editMusics(             @RequestBody Map<String, Object> body     ) {         Boolean isSuccess = musicService.edit(body);         body.put("isSuccess", isSuccess); // 是否成功         return body;     }     // 删除     @PostMapping("/musics/delete")     public Map<String, Object> deleteMusics(             @RequestBody Map<String, Object> body     ) {         int id = (int) body.get("id");         Boolean isSuccess = musicService.delete(id);         body.put("isSuccess", isSuccess); // 是否成功         return body;     } }`

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ede9e65dcfc94801b10313913e0c5d7b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

项目源码
====

*   [项目源码](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fwoow-wu7%2F7-react-admin-java "https://github.com/woow-wu7/7-react-admin-java")
*   [线上访问地址-歌曲增删改查](https://link.juejin.cn?target=http%3A%2F%2F120.53.220.141%3A81%2Fadmin-home "http://120.53.220.141:81/admin-home")

资料
==

*   注解 [juejin.cn/post/684490…](https://juejin.cn/post/6844903813631983623 "https://juejin.cn/post/6844903813631983623")
*   常用快捷键 [zhuanlan.zhihu.com/p/61690346](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F61690346 "https://zhuanlan.zhihu.com/p/61690346")