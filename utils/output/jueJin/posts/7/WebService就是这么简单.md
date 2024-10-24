---
author: "Java3y"
title: "WebService就是这么简单"
date: 2018-03-18
description: "首先我们来谈一下为什么需要学习webService这样的一个技术吧 天气预报这么一个功能并不是简单的JS组件就能够实现的，它的数据是依赖数据库分析出来的，甚至需要卫星探测我们个人建站是不可能搞这么一个数据库的吧。 于是乎，webService就诞生了，webserv…"
tags: ["Java","服务器","Java EE中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读21分钟"
weight: 1
selfDefined:"likes:156,comments:0,collects:192,views:27320,"
---
WebService介绍
============

首先我们来谈一下为什么需要学习webService这样的一个技术吧....

问题一
---

如果我们的网站需要提供一个**天气预报**这样一个需求的话，那我们该怎么做？？？？？

天气预报这么一个功能并不是简单的JS组件就能够实现的，它的数据是依赖数据库分析出来的，甚至需要卫星探测..我们个人建站是不可能搞这么一个数据库的吧。

那么既然我们自己干不了，我们可以去找别人吗？？？我们**从搜索引擎搜索，可以发现很多提供天气预报的网站，但是它返回的是一个网页，而我们仅仅需要的是对应的数据**！

我们可能就在想，我们**能不能仅仅只要它返回的数据，而并不是经过加工处理后返回的网页呢**？？

于是乎，webService就诞生了，webservice就是一个部署在Web服务器上的，**它向外界暴露出一个能够通过Web进行调用的API**。也就是说：**当我们想要获取天气预报的信息，我们可以调用别人写好的service服务，我们调用就能够得到结果了**！

问题二
---

可是我们写网站主流的就有好几个平台：Java、.net、PHP等等，那么**部署在Web服务器上的服务器也就是webserice怎么能够就让我们不同的平台都能够调用呢**？？

我们知道**java、.net这样的平台他们语言的基本数据类型、复杂数据类型就可能不一样，那么怎么能够实现调用的呢**？？？

来引用一段话

> 大家在写应用程序查询数据库时，并没有考虑过为什么可以将查询结果返回给上层的应用程序，甚至认为，这就是数据库应该做的，其实不然，这是数据库通过TCP/IP协议与另一个应用程序进行交流的结果，而上层是什么样的应用程序，是用什么语言，数据库本身并不知道，它只知道接收到了一份协议，这就是SQL92查询标准协议。

无论是Java、.net、PHP等等的平台，**只要是网页开发都是可以通过http协议来进行通信的，并且返回的数据要是通用的话，那么我们早就学过这样的一种技术【XML】**

所以**webservice实际上就是http+XML**

![这里写图片描述](/images/jueJin/16236708fd605e6.png)

对webservice的理解
--------------

WebService，顾名思义就是基于Web的服务。它使用Web(HTTP)方式，接收和响应外部系统的某种请求。从而实现远程调用.

我们可以调用互联网上查询天气信息Web服务，然后将它嵌入到我们的程序(C/S或B/S程序)当中来，当用户从我们的网点看到天气信息时，他会认为我们为他提供了很多的信息服务，但其实我们什么也没有做，只是简单调用了一下服务器上的一段代码而已。

学习WebService可以将你的服务(一段代码)发布到互联网上让别人去调用,也可以调用别人机器上发布的WebService,就像使用自己的代码一样.。

* * *

回顾Socket
========

我们在学习Java基础网络编程章节已经知道了Scoket这么一个连接了。

Socket服务端
---------

```

    public class SocketSer {
    
        public static void main(String[] args) throws Exception {
        
        ServerSocket ss = new ServerSocket(6666);
        boolean flag = true;
            while (flag) {
            //接收客户端的请求
            System.out.println("监听客户端的数据:");
            Socket sc = ss.accept();
            InputStream is = sc.getInputStream();
            byte[] buffer = new byte[1024];
            int len = -1;
            len = is.read(buffer);
            String getData = new String(buffer, 0, len);
            System.out.println("从客户端获取的数据:" + getData);
            //业务处理 大小写转化
            String outPutData = getData.toUpperCase();
            
            //向客户端写数据
            OutputStream os = sc.getOutputStream();
            os.write(outPutData.getBytes("UTF-8"));
            
            //释放资源
            os.close();
            is.close();
            sc.close();
        }
        ss.close();
    }
    
}
```

Socket客服端
---------

```

    public class SocketClient {
    
        public static void main(String[] args) throws Exception {
        //获取用户输入的数据
        Scanner input = new Scanner(System.in);
        System.out.println("请输入数据:");
        String inputData = input.nextLine();
        
        //开启一个Socket端口
        Socket sc = new Socket("127.0.0.1", 6666);
        OutputStream os = sc.getOutputStream();
        os.write(inputData.getBytes());
        
        //获取服务端回传的数据
        InputStream is = sc.getInputStream();
        byte[] buffer = new byte[1024];
        int len = -1;
        len = is.read(buffer);
        String getData = new String(buffer, 0, len);
        System.out.println("从服务端获取的数据:" + getData);
        //是否流
        is.close();
        os.close();
        sc.close();
    }
    
}
```

当我们从客户端输入数据以后，那么服务端就会把数据转成是大写

![这里写图片描述](/images/jueJin/162367090e81317.png)

![这里写图片描述](/images/jueJin/16236708fd7abe0.png)

其实HTTP协议就是基于Socket对其进行封装，我们也可以在IE浏览器中对其进行访问.我们一样能够获取得到数据！

![这里写图片描述](/images/jueJin/162367090e67147.png)

![这里写图片描述](/images/jueJin/162367090e791c9.png)

* * *

Scoket与HTTP简述
-------------

![这里写图片描述](/images/jueJin/162367090e52726.png)

ISO的七层模型 ： 物理层、数据链路层、网络层、传输层、表示层、会话层、应用层

*   Socket访问 ： **Socket属于传输层，它是对Tcp/ip协议的实现，包含TCP/UDP,它是所有通信协议的基础，Http协议需要Socket支持，以Socket作为基础**
    
*   Socket通信特点：
    
    *   开启端口，该通信是 长连接的通信 ，**很容易被防火墙拦截，可以通过心跳机制来实现 ，开发难度大**
    *   传输的数据一般是字符串 ，可读性不强
    *   socket端口不便于推广
    *   性能相对于其他的通信协议是最优的
*   Http协议访问 ：属于应用层的协议，对Socket进行了封装
    
    *   **跨平台**
    *   **传数据不够友好**
    *   **对第三方应用提供的服务，希望对外暴露服务接口** 问题：
*   ```markdown
    **数据封装不够友好 ：可以用xml封装数据 **
    
    ```
*   ```markdown
    **希望给第三方应用提供web方式的服务  （http + xml） = web  Service**
    
    ```

* * *

webService相关术语
==============

*   名词1：XML. **Extensible Markup Language** －扩展性标记语言
    *   XML，用于传输格式化的数据，是Web服务的基础。
    *   namespace-命名空间。
    *   xmlns=“http://itcast.cn” 使用默认命名空间。
    *   xmlns:itcast=“http://itcast.cn”使用指定名称的命名空间。
*   名词2：WSDL – **WebService Description Language** – Web服务描述语言。
    *   通过XML形式说明服务在什么地方－地址。
    *   通过XML形式说明服务提供什么样的方法 – 如何调用。
*   名词3：**SOAP-Simple Object Access Protocol**(简单对象访问协议)
    *   SOAP作为一个基于XML语言的协议用于有网上传输数据。
    *   SOAP = 在HTTP的基础上+XML数据。
    *   SOAP是基于HTTP的。
    *   SOAP的组成如下：
        *   Envelope – 必须的部分。以XML的根元素出现。
        *   Headers – 可选的。
        *   Body – 必须的。在body部分，包含要执行的服务器的方法。和发送到服务器的数据。

* * *

快速入门
====

首先，我们来尝试一下调用别人写好的webService，来体验一把：我们访问[www.webxml.com.cn/zh\_cn/index…](https://link.juejin.cn?target=http%3A%2F%2Fwww.webxml.com.cn%2Fzh_cn%2Findex.aspx "http://www.webxml.com.cn/zh_cn/index.aspx")

![这里写图片描述](/images/jueJin/16236707f1c9fcf.png)

进入到里边

![这里写图片描述](/images/jueJin/16236707f1d9623.png)

当我们输入一个号码，它就能够查询出我们的手机位置信息：

![](/images/jueJin/1623670828926a9.png)

我们现在要做的就是**将这个服务让我们自己写的应用程序中也可以调用**，那怎么做呢？？？

http-get方式访问webservice
----------------------

![这里写图片描述](/images/jueJin/16236707f2f3fee.png)

```

    public void get(String mobileCode ,String userID ) throws Exception{
    URL url=new URL("http://ws.webxml.com.cn/WebServices/MobileCodeWS.asmx/getMobileCodeInfo?mobileCode="+mobileCode+
    "&userID="+userID);
    HttpURLConnection conn=(HttpURLConnection) url.openConnection();
    conn.setConnectTimeout(5000);
    conn.setRequestMethod("GET");
    if(conn.getResponseCode()==HttpURLConnection.HTTP_OK){ //结果码=200
    InputStream is=conn.getInputStream();
    //内存流 ，
    ByteArrayOutputStream boas=new ByteArrayOutputStream();
    byte[] buffer=new byte[1024];
    int len=-1;
        while((len=is.read(buffer))!=-1){
        boas.write(buffer, 0, len);
    }
    System.out.println("GET请求获取的数据:"+boas.toString());
    boas.close();
    is.close();
}
}
```

![这里写图片描述](/images/jueJin/16236707f315ba2.png)

* * *

Http-Client 框架POST请求
--------------------

为什么要使用HttpClient工具：

*   原生态的Socket基于传输层,现在我们要访问的WebService是基于HTTP的属于应用层,所以我们的Socket通信要借助HttpClient发HTTP请求,这样**格式才能匹配**

HttpClient使用步骤如下：

1.  创建 HttpClient 的实例
2.  创建某种连接方法的实例，在这里是 GetMethod。在 GetMethod 的构造函数中传入待连接的地址
3.  配置要传输的参数，和消息头信息
4.  调用第一步中创建好的实例的 execute 方法来执行第二步中创建好的 method 实例
5.  通过response读取字符串
6.  释放连接。无论执行方法是否成功，都必须释放连接

```

//2.Post请求 ：通过Http-Client 框架来模拟实现 Http请求
    public void post(String mobileCode ,String userID) throws Exception{
    
    /**HttpClient访问网络的实现步骤：
    *  1. 准备一个请求客户端:浏览器
    *  2. 准备请求方式： GET 、POST
    *  3. 设置要传递的参数
    *  4.执行请求
    *  5. 获取结果
    */
    HttpClient client=new HttpClient();
    PostMethod postMethod=new PostMethod("http://ws.webxml.com.cn/WebServices/MobileCodeWS.asmx/getMobileCodeInfo");
    //3.设置请求参数
    postMethod.setParameter("mobileCode", mobileCode);
    postMethod.setParameter("userID", userID);
    //4.执行请求 ,结果码
    int code=client.executeMethod(postMethod);
    //5. 获取结果
    String result=postMethod.getResponseBodyAsString();
    System.out.println("Post请求的结果："+result);
}


//2.Post请求 ：通过Http-Client 框架来模拟实现 Http请求
    public void soap() throws Exception{
    
    HttpClient client=new HttpClient();
    PostMethod postMethod=new PostMethod("http://ws.webxml.com.cn/WebServices/MobileCodeWS.asmx");
    //3.设置请求参数
    postMethod.setRequestBody(new FileInputStream("c:/soap.xml"));
    //修改请求的头部
    postMethod.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    //4.执行请求 ,结果码
    int code=client.executeMethod(postMethod);
    System.out.println("结果码:"+code);
    //5. 获取结果
    String result=postMethod.getResponseBodyAsString();
    System.out.println("Post请求的结果："+result);
}

```

* * *

wsimport
========

上面我们使用的是GET方式或者使用Http-Client框架来调用webservice的服务，其实这两种方式也有弊端

*   传递参数麻烦【get方式都写在请求地址上、post方式要一个一个封装】
*   解析结果麻烦【根据返回的XML来解析字符串】

如果**我们可以把整个对象传递进去，返回的结果更加友好的话，就好像我们平常调用Java类一样使用webservice就好咯**！

Java也提供了类似的方法，**把webservice服务搞成是Java类让我们自己调用**，既然是Java类的话，那么我们使用起来就非常方便了！

把webservice服务搞成是Java类让我们自己调用其实就是**Java帮我们生成本地代理，再通过本地代理来访问webservice**

快速入门
----

wsimport是Java自带的一个命令，我们想要使用该命令，就必须**配置环境变量**，并且**jdk的版本最好是1.7或以上**

值得注意的是：**ide带的JDK版本要和wsimport生成本地的版本一致，不然就用不了！！！**

*   wsimport使用： **wsimport命令后面跟着的是WSDL的url路径** 语法 `wsimport [opations] <wsdl_uri>`
    *   ```dts
        wsdl_uri:wsdl 的统一资源标识符
        ```
    *   ```nginx
        d  ：指定要输出的文件的位置
        ```
    *   ```actionscript
        s  ：表示要解析java的源码 ，默认解析出的是class字节码
        ```
    *   ```css
        p  ： 指定输出的包名
        ```

![这里写图片描述](/images/jueJin/16236707f39a28b.png)

首先我们先把cmd的路径退到桌面上：

![这里写图片描述](/images/jueJin/1623670812c3381.png)

然后对WSDL文件生成本地代理

![这里写图片描述](/images/jueJin/1623670812f45b9.png)

![这里写图片描述](/images/jueJin/1623670814c5475.png)

该本地代理其实就是一堆的字节码文件

![这里写图片描述](/images/jueJin/1623670817353b5.png)

将得到的字节码文件打包成jar，那么我们只要在项目中导入jar包，就可以调用了！

语法

```

jar cvf  test.jar【jar包的名称】 打包目录

```

![这里写图片描述](/images/jueJin/1623670831b37d4.png)

本来我是想将本地代理的class文件生成jar包，然后导入到idea环境下，那么直接调用就行了。**可是idea老是报出找不到对应的类，找了半天也找不到，很烦呀**！！！！我考虑了以下的几种情况

*   \*\* 生成的class文件的JVM和idea下的JVM环境不匹配【后来切换了也不行】\*\*
*   **idea缓存原因，把idea所有缓存去掉也不行**
*   **生成的本地代理包名cn不行【？？？idea就是对cn这个包名报错，后来我改成自定义的包名也不行】**

最后我还是没有找到办法，如果知道是什么原因的，麻烦在评论中告诉我吧....因此这次的测试import，我就不仅仅生成class字节码文件，还生成了.java文件。我就直接使用java文件来测试了。

在zhongfucheng目录下生成本地代理，把java源码也带上

![这里写图片描述](/images/jueJin/16236708353ed8a.png)

于是我就把java源码复制到我的项目中，用java源码来进行测试

![这里写图片描述](/images/jueJin/162367083870aa1.png)

* * *

解析WSDL
------

有的同学可能会疑问，为啥wsimport能那么厉害，将`http://ws.webxml.com.cn/WebServices/MobileCodeWS.asmx?WSDL`这么一个url生成本地代理，其实我们看了WSDL文件就知道了。

![这里写图片描述](/images/jueJin/162367084d0852d.png)

值得注意的是，本地代理仅仅是有其方法，类，并不能解析出具体的实现的。具体的操作其实还是webservice去完成的。代理这么一个概念就更加清晰了。

自定义webservice服务
===============

我们在上一章节中已经使用wsimport生成本地代理来调用webservice的服务了，其实**我们自己写的web应用程序也是可以发布webservice的**

我们发布了webservice的话，那么其他人也是可以调用我们自己写的webservice！

那么我们怎么自定义webservice然后发布出去呢？？？

在jdk 1.6 版本以后 ，\*\*通过jax-ws 包提供对webservice的支持 \*\*

*   **该方式通过注解的方式来声明webservice**
*   **通过 jdk EndPoint.publish()发布webserive服务**

* * *

快速入门
----

写一个实体：

```

    public class Phone {
    private String name;//操作系统名
    private String owner;//拥有者
    private int total;//市场占有率
        public String getName() {
        return name;
    }
        public void setName(String name) {
        this.name = name;
    }
        public String getOwner() {
        return owner;
    }
        public void setOwner(String owner) {
        this.owner = owner;
    }
        public int getTotal() {
        return total;
    }
        public void setTotal(int total) {
        this.total = total;
    }
    
}

```

发布service，通过注解来让WSDL文件更加可读...

```

package cn.it.ws.d;

import cn.it.ws.model.Phone;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebResult;
import javax.jws.WebService;
import javax.xml.ws.Endpoint;
/*
*手机的业务类，该业务类通过webservice 对外提供服务
* 1. 声明： @webservice
* 2. 发布 EndPoint
*/

@WebService (serviceName="PhoneManager",//修改服务名
targetNamespace="http://dd.ws.it.cn") //修改命名空间 ，默认包名，取反
//声明该业务类 对外提供webservice服务   ,默认只是对public 修饰的方法对外以webservice形式发布
    public class PhoneService {
    
    /**@WebMethod(operationName="getMObileInfo"): 修改方法名
    * @WebResult(name="phone")：修改返回参数名
    * @WebParam(name="osName")：修改输入参数名
    */
    
    @WebMethod(operationName="getMObileInfo")
        public @WebResult(name="phone") Phone getPhoneInfo(@WebParam(name="osName")String osName){
        Phone phone=new Phone();
            if(osName.endsWith("android")){
            phone.setName("android");phone.setOwner("google");phone.setTotal(80);
                }else if(osName.endsWith("ios")){
                phone.setName("ios");phone.setOwner("apple");phone.setTotal(15);
                    }else{
                    phone.setName("windows phone");phone.setOwner("microsoft");phone.setTotal(5);
                }
                return phone;
            }
            @WebMethod(exclude=true)//把该方法排除在外
                public void sayHello(String city){
                System.out.println("你好："+city);
            }
                private void sayLuck(String city){
                System.out.println("好友："+city);
            }
                void sayGoodBye(String city){
                System.out.println("拜拜:"+city);
            }
                protected void saySayalala(String city){
                System.out.println("再见！"+city);
            }
            
                public static void main(String[] args) {
                String address1="http://127.0.0.1:8888/ws/phoneService";
                //		String address2="http://127.0.0.1:8888/ws/phoneManager";
                /**
                * 发布webservice服务
                * 1.address：服务的地址
                * 2：implementor 服务的实现对象
                */
                
                Endpoint.publish(address1, new PhoneService());
                //		Endpoint.publish(address2, new PhoneService());
                System.out.println("wsdl地址 :"+address1+"?WSDL");
            }
            
        }
        
```

1.  在类上添加@WebService注解,代表发布一个WebService服务
2.  通过EndPoint(端点服务)发布一个webService。Endpoint也是jdk提供的一个专门用于发布服务的类，它的publish方法接收两个参数，一个是本地的服务地址，二是提供服务的类。它位于javax.xml.ws.\*包中。
3.  Endpoint.publish(String address, Object implementor) 静态方法在给定地址处针对指定的实现者对象创建并发布端点
4.  给类添加上@WebService注解后，类中所有的非静态方法都将会对外公布
5.  如果希望某个方法不对外公开，可以在方法上添加@WebMethod(exclude=true)，阻止对外公开。
6.  如果一个类上，被添加了@WebService注解，则必须此类至少有一个可以公开的方法，否则将会启动失败。 protected、private、final、static方法不能对外公开

```

@WebService	// 添加了此注解,代表是一个WebService
    public class HelloWorld {
    // 非 static final private 方法默认会发布
        public String sayHi(String name) {
        return "hello" + name;
    }
    @WebMethod(exclude=true)
        public void exclude(){
        // 被注解排除的方法
    }
        protected void protected1(){
        //受保护的方法默认不发布
    }
        private void private1(){
        // 私有方法默认不发布
    }
        public static void static1(){
        // static 方法默认不发布
    }
        public final void final1(){
        // final 方法默认不发布
    }
}
```

![这里写图片描述](/images/jueJin/162367084736b9c.png)

生成的webservice能够在浏览器访问

![这里写图片描述](/images/jueJin/162367085b0dff9.png)

* * *

SOAP协议
======

![这里写图片描述](/images/jueJin/162367084ae6b72.png)

![这里写图片描述](/images/jueJin/162367085becf82.png)

![这里写图片描述](/images/jueJin/1623670869f4016.png)

**目前WebService的协议主要有SOAP1.1和1.2。**

*   两者的命名空间不同。
    *   Soap1.1的命名空间：
        *   xmlns:soap=“http://schemas.xmlsoap.org/soap/envelope/ “
    *   Soap1.2 命名空间：
        *   ```vim
            xmlns:soap="http://www.w3.org/2003/05/soap-envelope“
            ```
*   SOAP1.1版本与SOAP1.2版本在头信息上存在差异。
    *   SOAP1.1存在SOAPAction的请求头。
    *   SOAP1.2没有SOAPAction的请求头。
*   基于SOAP1.1生成的WSDL和基于SOAP1.2生成的WSDL也不一样。 主要看命名空间。
*   在CXF中两种协议请求的方式也不一样。
    *   1.1为content-Type:text/xm;charset=UTF-8
    *   1.2为content-Type:application/soap+xml;charset=UTF-8

![这里写图片描述](/images/jueJin/162367086ae3f6e.png)

![这里写图片描述](/images/jueJin/16236708795f702.png)

![这里写图片描述](/images/jueJin/162367087ffe8d1.png)

SOA、UDDI概念
==========

SOA
---

Soa（**Service-Oriented Architecture）** ：**面向服务的架构，它是一种思想，IBM大力倡导**是即插即用的，IBM大力提倡，希望**以组装电脑的方式来开发应用**

组成：

*   ```markdown
    面向web的服务，面向web的组件  ：WebService ： 硬盘、cpu、内存条
    
    ```
*   ```markdown
    企业服务总线 （EnterPrise Service Bus ：ESB）。主板
    
    ```

uddi
----

uddi （Universal Description, Discovery and Integration）**统一描述、发现、集成**

*   它是目录服务，通过该服务可以注册和发布webservcie，以便第三方的调用者统一调用
*   用得并不太多。

实现接口的webservice
===============

服务端
---

```

import javax.jws.WebService;

/**面向接口的webservice发布方式
*
*
*/
@WebService
    public interface JobService {
    public String getJob();
}



``````



import javax.jws.WebService;

@WebService(endpointInterface="cn.it.ws.e.JobService")//设置服务端点接口 ，指定对外提供服务的接口
    public class JobServiceImpl implements JobService {
    
    @Override
        public String getJob() {
        return "JEE研发工程师|Android研发工程师|数据库工程师|前端工程师|测试工程师|运维工程师";
    }
        public void say(){
        System.out.println("早上好!");
    }
}

```

客户端
---

```

import javax.xml.ws.Endpoint;

    public class Test {
    
        public static void main(String[] args) {
        JobService jobService=new JobServiceImpl();
        String address="http://192.168.114.10:9999/ws/jobservice";
        Endpoint.publish(address, jobService);
        System.out.println("wsdl地址:"+address+"?WSDL");
        
    }
    
}
```

CXF框架
=====

> Apache CXF 是一个开源的 Services 框架，CXF 帮助您来构建和开发 Services 这些 Services 可以支持多种协议，比如：SOAP、POST/HTTP、RESTful HTTP CXF 大大简化了 Service可以天然地和 Spring 进行无缝集成。

**CXF介绍 ：soa的框架**

*   ```asciidoc
    * cxf 是 Celtrix （ESB框架）和 XFire（webserivice） 合并而成，并且捐给了apache
    ```
*   ```asciidoc
    * CxF的核心是org.apache.cxf.Bus(总线)，类似于Spring的 ApplicationContext
    ```
*   ```asciidoc
    * CXF默认是依赖于Spring的
    ```
*   ```mipsasm
    * Apache CXF 发行包中的jar，如果全部放到lib中，需要 JDK1.6 及以上，否则会报JAX-WS版本不一致的问题
    
    ```
*   ```asciidoc
    * CXF 内置了Jetty服务器 ，它是servlet容器，好比tomcat
    ```

**CXF特点**

*   与Spring、Servlet做了无缝对接，cxf框架里面集成了Servlet容器Jetty
*   支持注解的方式来发布webservice
*   能够显示一个webservice的服务列表
*   能够添加拦截器：输入拦截器、输出拦截器 ：
*   输入日志信息拦截器、输出日志拦截器、用户权限认证的拦截器

CXF开发
-----

要想使用CXF框架，那么就先导入jar包

*   asm-3.3.jar
*   commons-logging-1.1.1.jar
*   cxf-2.4.2.jar
*   jetty-continuation-7.4.5.v20110725.jar
*   jetty-http-7.4.5.v20110725.jar
*   jetty-io-7.4.5.v20110725.jar
*   jetty-security-7.4.5.v20110725.jar
*   jetty-server-7.4.5.v20110725.jar
*   jetty-util-7.4.5.v20110725.jar
*   neethi-3.0.1.jar
*   wsdl4j-1.6.2.jar
*   xmlschema-core-2.0.jar

接口

```

import javax.jws.WebParam;
import javax.jws.WebResult;
import javax.jws.WebService;

@WebService(serviceName="languageManager")
    public interface LanguageService {
    public @WebResult(name="language")String getLanguage(@WebParam(name="position")int position);
    
}
```

实现：

```

package cn.it.ws.cxf.a;

import org.apache.cxf.frontend.ServerFactoryBean;
import org.apache.cxf.interceptor.LoggingInInterceptor;
import org.apache.cxf.interceptor.LoggingOutInterceptor;
import org.apache.cxf.jaxws.JaxWsServerFactoryBean;

/**开发语言排行描述服务
*
*
* @author 李俊  2015年5月17日
*/
    public class LanguageServiceImpl implements LanguageService {
    /* (non-Javadoc)
    * @see cn.it.ws.cxf.a.LanguageService#getLanguage(int)
    */
    @Override
        public String getLanguage(int position){
        String language=null;
            switch (position) {
            case 1:
            language="java";
            break;
            case 2:
            language="C";
            break;
            case 3:
            language="Objective-C";
            break;
            case 4:
            language="C#";
            break;
            
            default:
            break;
        }
        return language;
    }
    /**通过cxf框架发布webservice
    *  1. ServerFactoryBean
    *    - 不设置注解也可以发布webservice服务， 不支持注解
    *    - 不支持拦截器的添加
    *  2. JaxWsServerFactoryBean
    *    - 支持注解
    *    - 可以添加拦截器
    *  3. webservice 访问流程：
    *    1. 检测本地代理描述的wsdl是否与服务端的wsdl一致 ，俗称为握手
    *    2. 通过soap协议实现通信 ，采用的是post请求 ， 数据封装在满足soap规约的xml中
    *    3. 返回数据 同样采用的是soap通信，  数据封装在满足soap规约的xml中
    * @param args
    
        public static void main(String[] args) {
        LanguageService languageService=new LanguageServiceImpl();
        ServerFactoryBean bean=new ServerFactoryBean();
        //Endpoint :地址  ， 实现对象
        bean.setAddress("http://192.168.114.10:9999/ws/cxf/languangeService");
        bean.setServiceClass(LanguageService.class);//对外提供webservcie的业务类或者接口
        bean.setServiceBean(languageService);//服务的实现bean
        bean.create();//创建，发布webservice
        System.out.println("wsdl地址:http://192.168.114.10:9999/ws/cxf/languangeService?WSDL");
    }
    */
        public static void main(String[] args) {
        LanguageService languageService=new LanguageServiceImpl();
        JaxWsServerFactoryBean bean=new JaxWsServerFactoryBean();
        //Endpoint :地址  ， 实现对象
        bean.setAddress("http://192.168.114.10:9999/ws/cxf/languangeService");
        bean.setServiceClass(LanguageService.class);//对外提供webservcie的业务类或者接口
        bean.setServiceBean(languageService);//服务的实现bean
        //添加输入拦截器  :输入显示日志信息的拦截器
        bean.getInInterceptors().add(new LoggingInInterceptor());
        //添加输出拦截器  :输出显示日志信息的拦截器
        bean.getOutInterceptors().add(new LoggingOutInterceptor());
        
        bean.create();//创建，发布webservice
        System.out.println("wsdl地址:http://192.168.114.10:9999/ws/cxf/languangeService?WSDL");
    }
    
}

```

* * *

CXF与Spring集成
------------

*   建立一个web项目
*   准备所有jar包,将CXF\_HOME\\lib项目下的所有jar包,全部都拷贝新项目的lib目录下.其中里面已经包含了Sring3.0的jar包 其中jetty 服务器的包可以不要.因为我们要部署的tomcat服务器中了
*   在web.xml中配置cxf的核心servlet，CXFServlet
*   此配置文件的作用类 拦截/ws/\*的所有请求 类似Struts2的过滤器

web.xml配置文件：

```

<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://java.sun.com/xml/ns/javaee"
xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"
version="3.0">
<display-name>CXF_Server</display-name>
<!-- 添加  CXF 的Servlet ，处理 webservice的请求 -->
<servlet>
<servlet-name>cxf</servlet-name>
<servlet-class>org.apache.cxf.transport.servlet.CXFServlet</servlet-class>
<load-on-startup>0</load-on-startup>
</servlet>
<servlet-mapping>
<servlet-name>cxf</servlet-name>
<url-pattern>/ws/*</url-pattern>
</servlet-mapping>
<!-- Spring 监听添加 -->
<listener>
<listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
</listener>
<context-param>
<param-name>contextConfigLocation</param-name>
<param-value>classpath:applicationContext.xml</param-value>
</context-param>
</web-app>
```

实体：

```

    public class Employee {
    private Integer  id;
    private String name;
    private Integer age;
        public Integer getId() {
        return id;
    }
        public void setId(Integer id) {
        this.id = id;
    }
        public String getName() {
        return name;
    }
        public void setName(String name) {
        this.name = name;
    }
        public Integer getAge() {
        return age;
    }
        public void setAge(Integer age) {
        this.age = age;
    }
    
}

```

接口：

```


package cn.it.ws.cxf.b;

import java.util.List;

import javax.jws.WebParam;
import javax.jws.WebResult;
import javax.jws.WebService;

import cn.it.ws.cxf.bean.Employee;
@WebService(serviceName="EmployeeService")
    public interface EmployeeManager {
    
    void add(@WebParam(name="employee")Employee employee);
    
    @WebResult(name="employees")List<Employee> query();
    
}
```

接口实现：

```

package cn.it.ws.cxf.b;

import java.util.ArrayList;
import java.util.List;

import cn.it.ws.cxf.bean.Employee;

/**员工管理的业务实现类
* @author 李俊  2015年5月17日
*/
    public class EmployeeManagerImpl implements EmployeeManager {
    private List<Employee> employees=new ArrayList<>();
    @Override
        public void add(Employee employee){
        //添加到集合中
        employees.add(employee);
    }
    @Override
        public List<Employee> query(){
        return employees;
    }
    
}

```

Spring配置信息：

```

<?xml version="1.0" encoding="UTF-8"?>
<beans
xmlns="http://www.springframework.org/schema/beans"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:p="http://www.springframework.org/schema/p"
xmlns:jaxws="http://cxf.apache.org/jaxws"
xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
http://cxf.apache.org/jaxws http://cxf.apache.org/schemas/jaxws.xsd">


<bean id="employeeManagerImpl" class="cn.it.ws.cxf.b.EmployeeManagerImpl"></bean>
<!-- 配置cxf
地址：      http://192.168.114.10:8080/CXF_Server/ws/employeeManager
组成 ：  http://192.168.114.10:8080 +CXF_Server（ 项目名）+ws（过滤的路径）+/employeeManager(自定义部分)
服务类 ：
服务的实现类：
拦截器
-->
<jaxws:server address="/employeeManager" serviceClass="cn.it.ws.cxf.b.EmployeeManager">
<jaxws:serviceBean>
<ref bean="employeeManagerImpl"/>
</jaxws:serviceBean>
<!-- 配置输入显示日志信息的拦截器   -->
<jaxws:inInterceptors>
<bean class="org.apache.cxf.interceptor.LoggingInInterceptor"></bean>
</jaxws:inInterceptors>
<jaxws:outInterceptors>
<bean class="org.apache.cxf.interceptor.LoggingOutInterceptor"></bean>
</jaxws:outInterceptors>
</jaxws:server>


</beans>
```

IDEA下使用webservice
=================

我们的Intellij idea是一个非常好用的java ide，当然了，它也支持webservice开发。非常好用...由于在网上见到的教程非常多，我就贴几个我认为比较好的教程：

[www.biliyu.com/article/986…](https://link.juejin.cn?target=http%3A%2F%2Fwww.biliyu.com%2Farticle%2F986.html "http://www.biliyu.com/article/986.html")

[blog.csdn.net/u010323023/…](https://link.juejin.cn?target=http%3A%2F%2Fblog.csdn.net%2Fu010323023%2Farticle%2Fdetails%2F52926051 "http://blog.csdn.net/u010323023/article/details/52926051")

[blog.csdn.net/dreamfly88/…](https://link.juejin.cn?target=http%3A%2F%2Fblog.csdn.net%2Fdreamfly88%2Farticle%2Fdetails%2F52350370 "http://blog.csdn.net/dreamfly88/article/details/52350370")

获取天气预报
------

我们现在webservice就基本入门了，现在我想要做的就是自己写的网站能够拿到天气预报的信息，于是我去[www.webxml.com.cn/zh\_cn/index…](https://link.juejin.cn?target=http%3A%2F%2Fwww.webxml.com.cn%2Fzh_cn%2Findex.aspx "http://www.webxml.com.cn/zh_cn/index.aspx")找到了天气预报的服务

这个是天气预报的WSDL地址：[ws.webxml.com.cn/WebServices…](https://link.juejin.cn?target=http%3A%2F%2Fws.webxml.com.cn%2FWebServices%2FWeatherWS.asmx "http://ws.webxml.com.cn/WebServices/WeatherWS.asmx")，那么我们只要解析该WSDL服务即可

![这里写图片描述](/images/jueJin/16236708807f9ff.png)

如果不想得到所有的信息，那么我们可以在服务上找到我们想要对应的数据，也就是说：

![这里写图片描述](/images/jueJin/16236708862a41b.png)

![这里写图片描述](/images/jueJin/1623670889616d5.png)

* * *

总结
==

*   应用webservice的原因就在于我们需要一些服务、这些服务是我们自己不能手动写的。比如天气预报，于是就出现了webService技术。**webService能够让我们可以获取网上别人发布出来的服务。我们只要调用它，就可以获取相关的数据了。**
*   Socket其实就是对TCP/IP协议的一个封装，而我们在网上使用的是HTTP协议。WebService也是Web应用程序。它也当然支持HTTP协议了。不过WebService需要给不同语言都能够使用，因此它使用XML来进行传输。
*   于是，它就有自己一种协议\*\*:SOAP(简单对象访问协议)。其实SOAP就是Http+XML\*\*。
*   我们可以使用http-get方式访问webservice，由于它使用的是原生Socket来进行访问。会有点复杂。于是我们可以借助Http-Client 框架来访问WebService。Http-Client 框架比HTTP-GET方式会简单一点。但还是不够简洁。
*   最后，**我们可以使用Java自带的WsImport来实现本地代理。这种方法会将WebService翻译成Java类，我们使用类一样去访问WebService就行了。非常好用。**
*   我们是可以自己写webService的。**对服务类上加上注解。通过EndPoint(端点服务)就能够把我们webService服务类发布出去了。**
    *   为了让WDSL文件更加读取，可以使用注解的方式来写好对应的参数名称。
    *   也可以控制某方法是否被发布出去
*   **SOAP其实上就是使用XML进行传输的HTTP协议。**
*   **SOA:面向服务架构。即插即用。也就是耦合非常低，用的时候加上就行了。**
*   UDDI （Universal Description, Discovery and Integration）统一描述、发现、集成，其实就是一个webservice的目录结构，不过我们很少把webservice发布到上面去
*   实现接口的webservice只是在类上对其的一种抽象而已，没什么大不了的。
*   **CXF框架可以与spring无缝连接，就不用我们自己Endpoint了。它还能记录日志之类的。**
*   **我们还可以使用Idea下的webservice，能够使用图形画面的方式获取本地代理和生成WSDL文件。**

> 如果文章有错的地方欢迎指正，大家互相交流。习惯在微信看技术文章，想要获取更多的Java资源的同学，可以**关注微信公众号:Java3y**