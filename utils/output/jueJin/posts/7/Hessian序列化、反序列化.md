---
author: "字节跳动技术团队"
title: "Hessian序列化、反序列化"
date: 2022-08-11
description: "程序运行中产生数据在传输中，只能使用二进制流进行，简单场景数据传输反序列化，复杂场景数据传输序列化和反序列化。本文对jdk、fastjson、hessian三种序列化协议进行实验对比较。"
tags: ["后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:7,comments:0,collects:18,views:5681,"
---
问题与思考
=====

1.  序列化参数有枚举属性，序列化端增加一个枚举，能否正常反序列化？
2.  序列化子类，它和父类有同名参数，反序列化时，同名参数能否能正常赋值？
3.  序列化对象增加参数，反序列化类不增加参数，能否正常反序列化？
4.  用于序列化传输的属性，用包装器比较好，还是基本类型比较好？

为什么要使用序列化和反序列化？
===============

1.  程序在运行过程中，产生的数据，不能一直保存在内存中，需要暂时或永久存储到介质（如磁盘、数据库、文件）里进行保存，也可能通过网络发送给协作者。程序获取原数据，需要从介质，或网络传输获得。传输的过程中，只能使用二进制流进行传输。
2.  简单的场景，基本类型数据传输。通过双方约定好参数类型，数据接收方按照既定规则对二进制流进行反序列化。

![图片](/images/jueJin/dfc19bb7c436435.png)

3.  复杂的场景，传输数据的参数类型可能包括：基本类型、包装器类型、自定义类、枚举、时间类型、字符串、容器等。很难简单通过约定来反序列化二进制流。需要一个通用的协议，共双方使用，进行序列化和反序列化。

三种序列化协议及对比
==========

![image.png](/images/jueJin/725bb9d08e12410.png)

对比
--

```ini
Father father = new Father();
father.name = "厨师";
father.comment = "川菜馆";
father.simpleInt = 1;
father.boxInt = new Integer(10);
father.simpleDouble = 1;
father.boxDouble = new Double(10);
father.bigDecimal = new BigDecimal(11.5);
```

运行结果
----

```ini
jdk序列化结果长度：626，耗时：55
jdk反序列化结果：Father{version=0, name='厨师', comment='川菜馆', boxInt=10, simpleInt=1, boxDouble=10.0, simpleDouble=1.0, bigDecimal=11.5}耗时：87

hessian序列化结果长度：182，耗时：56
hessian反序列化结果：Father{version=0, name='厨师', comment='川菜馆', boxInt=10, simpleInt=1, boxDouble=10.0, simpleDouble=1.0, bigDecimal=11.5}耗时：7

Fastjson序列化结果长度：119，耗时：225
Fastjson反序列化结果：Father{version=0, name='厨师', comment='川菜馆', boxInt=10, simpleInt=1, boxDouble=10.0, simpleDouble=1.0, bigDecimal=11.5}耗时：69
```

分析
--

*   jdk 序列化耗时最短，但是序列化结果长度最长，是其它两种的 3 ～ 5 倍。
*   fastjson 序列化结果长度最短，但是耗时是其它两种的 4 倍左右。
*   hessian 序列化耗时与 jdk 差别不大，远小于 fastjson 序列化耗时。且与 jdk 相比，序列化结果占用空间非常有优势。另外，hessian 的反序列化速度最快，耗时是其它两种的 1/10。
*   综上比较，hessian 在序列化和反序列化表现中，性能最优。

Hessian 序列化实战
=============

实验准备
----

### 父类

```arduino
    public class Father implements Serializable {
    
    /**
    * 静态类型不会被序列化
    */
    private static final long serialVersionUID = 1L;
    
    /**
    * transient 不会被序列化
    */
    transient int version = 0;
    
    /**
    * 名称
    */
    public String name;
    
    /**
    * 备注
    */
    public String comment;
    
    /**
    * 包装器类型1
    */
    public Integer boxInt;
    
    /**
    * 基本类型1
    */
    public int simpleInt;
    
    /**
    * 包装器类型2
    */
    public Double boxDouble;
    
    /**
    * 基本类型2
    */
    public double simpleDouble;
    
    /**
    * BigDecimal
    */
    public BigDecimal bigDecimal;
    
        public Father() {
    }
    
    @Override
        public String toString() {
        return "Father{" +
        "version=" + version +
        ", name='" + name + ''' +
        ", comment='" + comment + ''' +
        ", boxInt=" + boxInt +
        ", simpleInt=" + simpleInt +
        ", boxDouble=" + boxDouble +
        ", simpleDouble=" + simpleDouble +
        ", bigDecimal=" + bigDecimal +
        '}';
    }
}
```

### 子类

```arduino
    public class Son extends Father {
    
    /**
    * 名称，与father同名属性
    */
    public String name;
    
    /**
    * 自定义类
    */
    public Attributes attributes;
    
    /**
    * 枚举
    */
    public Color color;
    
        public Son() {
    }
    
}
```

### 属性-自定义类

```arduino
    public class Attributes implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    public int value;
    
    public String msg;
    
        public Attributes() {
    }
    
        public Attributes(int value, String msg) {
        this.value = value;
        this.msg = msg;
    }
    
}
```

### 枚举

```arduino
    public enum Color {
    
    RED(1, "red"),
    YELLOW(2, "yellow")
    ;
    
    public int value;
    
    public String msg;
    
        Color() {
    }
    
        Color(int value, String msg) {
        this.value = value;
        this.msg = msg;
    }
}
```

**使用到的对象及属性设置**

```ini
Son son = new Son();
son.name = "厨师";    // 父子类同名字段，只给子类属性赋值
son.comment = "川菜馆";
son.simpleInt = 1;
son.boxInt = new Integer(10);
son.simpleDouble = 1;
son.boxDouble = new Double(10);
son.bigDecimal = new BigDecimal(11.5);
son.color = Color.RED;
son.attributes = new Attributes(11, "hello");
```

运行结果分析
------

使用 Hessian 序列化，结果写入文件，使用 vim 打开。使用 16 进制方式查看，查看命令：%!xxd

```yaml
00000000: 4307 6474 6f2e 536f 6e9a 046e 616d 6504  C.dto.Son..name.
00000010: 6e61 6d65 0763 6f6d 6d65 6e74 0662 6f78  name.comment.box
00000020: 496e 7409 7369 6d70 6c65 496e 7409 626f  Int.simpleInt.bo
00000030: 7844 6f75 626c 650c 7369 6d70 6c65 446f  xDouble.simpleDo
00000040: 7562 6c65 0a61 7474 7269 6275 7465 7305  uble.attributes.
00000050: 636f 6c6f 720a 6269 6744 6563 696d 616c  color.bigDecimal
00000060: 6002 e58e a8e5 b888 4e03 e5b7 9de8 8f9c  `.......N.......
00000070: e9a6 869a 915d 0a5c 430e 6474 6f2e 4174  .....].\C.dto.At
00000080: 7472 6962 7574 6573 9205 7661 6c75 6503  tributes..value.
00000090: 6d73 6761 9b05 6865 6c6c 6f43 0964 746f  msga..helloC.dto
000000a0: 2e43 6f6c 6f72 9104 6e61 6d65 6203 5245  .Color..nameb.RE
000000b0: 4443 146a 6176 612e 6d61 7468 2e42 6967  DC.java.math.Big
000000c0: 4465 6369 6d61 6c91 0576 616c 7565 6304  Decimal..valuec.
000000d0: 3131 2e35 0a                             11.5.
```

对其中的十六进制数逐个分析，可以拆解为一下结构：参考 hessian 官方文档，链接：[hessian.caucho.com/doc/hessian…](https://link.juejin.cn?target=http%3A%2F%2Fhessian.caucho.com%2Fdoc%2Fhessian-serialization.html "http://hessian.caucho.com/doc/hessian-serialization.html")

序列化原理
-----

![图片](/images/jueJin/48a403cc4b3f46c.png)

### 序列化规则

1.  被序列化的类必须实现了 Serializable 接口

![图片](/images/jueJin/2d7c5c89771f4b5.png)

2.  静态属性和 transient 变量，不会被序列化。

![图片](/images/jueJin/deb55f6f48e7443.png)

3.  枚举类型在序列化后，存储的是枚举变量的名字
4.  序列化结果的结构：类定义开始标识 C -> 类名长度+类名 -> 属性数量 -> （逐个）属性名长度+属性名 -> 开始实例化标识 -> （按照属性名顺序，逐个设置）属性值（发现某个属性是一个对象，循环这个过程）

![图片](/images/jueJin/406a963e2c314ed.png)

反序列化
----

![图片](/images/jueJin/41824f2807f6407.png)

**通俗原理图**

![图片](/images/jueJin/a884ce24a8ad4c5.png)

![图片](/images/jueJin/65cbee7527e64ae.png)

解释：这是前边的序列化文件，可以对着这个结构理解反序列化的过程。

![图片](/images/jueJin/94cbbb294393412.png)

解释：读取到“C”之后，它就知道接下来是一个类的定义，接着就开始读取类名，属性个数和每个属性的名称。并把这个类的定义缓存到一个\_classDefs 的 list 里。

![图片](/images/jueJin/c5e20cf0f0f6443.png)

解释：通过读取序列化文件，获得类名后，会加载这个类，并生成这个类的反序列化器。这里会生成一个\_fieldMap，key 为反序列化端这个类所有属性的名称，value 为属性对应的反序列化器。

![图片](/images/jueJin/232f4b93c7854e0.png)

解释：读到 6 打头的 2 位十六进制数时，开始类的实例化和赋值。

### 遗留问题解答

*   增加枚举类型，反序列化不能正常读取。

![图片](/images/jueJin/22744571c2cb4f9.png)

> 原因：枚举类型序列化结果中，枚举属性对应的值是枚举名。反序列化时，通过枚举类类名+枚举名反射生成枚举对象。枚举名找不到就会报错。

*   反序列化为子类型，同名属性值无法正常赋值。

![图片](/images/jueJin/296420e056f84ac.png)

![图片](/images/jueJin/18357241b0c64e9.png)

![图片](/images/jueJin/733618fe978c4a2.png)

*   序列化对象增加参数，反序列化可以正常运行。

![图片](/images/jueJin/06632d9fc20c403.png)

> 原因：反序列化时，是先通过类名加载同名类，并生成同名类的反序列化器，同名类每个属性对应的反序列化器存储在一个 map 中。在反序列化二进制文件时，通过读取到的属性名，到 map 中获取对应的反序列化器。若获取不到，默认是 NullFieldDeserializer.DESER。待到读值的时候，仅读值，不作 set 操作

*   序列化和反序列化双方都使用对象类型时，更改属性类型，若序列化方不传输数据，序列化结果是‘N’，能正常反序列化。但是对于一方是基本类型，更改属性类型后，因为 hessian 对于基本类型使用不同范围的值域，所以无法正常序列化。

参考文档
====

*   [Hessian Lite序列化简析](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F44787200 "https://zhuanlan.zhihu.com/p/44787200")
*   [Hessian 反序列化及相关利用链](https://link.juejin.cn?target=https%3A%2F%2Fpaper.seebug.org%2F1131%2F "https://paper.seebug.org/1131/")
*   [hessian 官方文档：序列化规则](https://link.juejin.cn?target=http%3A%2F%2Fhessian.caucho.com%2Fdoc%2Fhessian-serialization.html%23anchor10 "http://hessian.caucho.com/doc/hessian-serialization.html#anchor10")
*   [ASCII 编码对照表](https://link.juejin.cn?target=http%3A%2F%2Fascii.911cha.com%2F "http://ascii.911cha.com/")

**加入我们**
========

我们来自字节跳动飞书商业应用研发部(Lark Business Applications)，目前我们在北京、深圳、上海、武汉、杭州、成都、广州、三亚都设立了办公区域。我们关注的产品领域主要在企业经验管理软件上，包括飞书 OKR、飞书绩效、飞书招聘、飞书人事等 HCM 领域系统，也包括飞书审批、OA、法务、财务、采购、差旅与报销等系统。欢迎各位加入我们。

扫码发现职位&投递简历

![](/images/jueJin/c81e1b604273496.png)

官网投递：[job.toutiao.com/s/FyL7DRg](https://link.juejin.cn?target=https%3A%2F%2Fjob.toutiao.com%2Fs%2FFyL7DRg "https://job.toutiao.com/s/FyL7DRg")