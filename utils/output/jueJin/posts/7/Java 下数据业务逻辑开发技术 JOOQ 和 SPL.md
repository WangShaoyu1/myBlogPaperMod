---
author: "捡田螺的小男孩"
title: "Java 下数据业务逻辑开发技术 JOOQ 和 SPL"
date: 2022-10-17
description: "很多开源技术都可以在Java下实现以数据库为核心的业务逻辑，其中JOOQ的计算能力比Hibernate强，可移植性比MyBatis强，受到越来越多的关注。esProc SPL是新晋的数据计算语言，同样"
tags: ["后端","Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读17分钟"
weight: 1
selfDefined:"likes:18,comments:1,collects:43,views:11161,"
---
很多开源技术都可以在Java下实现以数据库为核心的业务逻辑，其中JOOQ的计算能力比Hibernate强，可移植性比MyBatis强，受到越来越多的关注。esProc SPL是新晋的数据计算语言，同样在计算能力和可移植性方面优势突出。下面对二者进行多方面的比较，从中找出开发效率更高的数据业务逻辑开发技术。JOOQ商业版主要支持了商业数据库和存储过程，不在此次讨论范围。

语言特征
----

**编程风格**

JOOQ支持完整的面向对象的编程风格，可以将多个对象（方法）组合起来，形成类似SQL的语法逻辑。JOOQ可以使用Java的Lambda表达式、函数调用接口和流程控制语法，理论上也支持面向函数和面向过程，但这些表达式\\语法没有为JOOQ的结构化数据对象（Result）而设计，使用时还不够方便。

SPL支持面向对象、面向函数、面向过程的编程风格，并进行大幅简化。SPL有对象的概念，可以用点号访问属性并进行多步骤计算，但没有继承重载这些内容。SPL的Lambda表达式比SQL更加简单易用，函数调用接口和流程控制语法专为结构化数据对象（序表）而设计，使用更加方便。

**运行模式**

JOOQ是编译执行的Java代码，性能高一些，灵活性较差。但JOOQ本身没有计算能力，执行后只生成SQL语句，再交由数据库计算并返回结果，实际性能并不高，有些业务逻辑需要反复读写数据库，性能就更差了。SPL是解释型语言，编码更灵活，相同代码性能会差一点。但是，SPL有不依赖数据库的独立计算能力，无需反复读写数据库，内置大量时间复杂度更低的基础运算，计算性能经常能超过编译型语言。

**外部类库**

JOOQ可以引入其他任意的第三方Java类库，用来弥补自身的短板，比如利用Stream增加自己的独立计算能力，但这些类库没有为结构化数据对象而设计，提供的功能比较有限。SPL内置专业的数据处理函数，提供了大量开发效率更高、时间复杂度更低的基本运算，通常不需要外部Java类库，特殊情况可在自定义函数中调用。

**IDE和调试**

两者都有图形化IDE和完整的调试功能。JOOQ使用Java IDE，好处是更通用，缺点是没有为数据处理做优化，无法方便地观察结构化数据对象。SPL的IDE专为数据处理而设计，结构化数据对象呈现为表格形式，观察更加方便。

**学习难度**

JOOQ需要学习三种语法，SQL、通用Java、JOOQ。其中，SQL的语言能力要高于一般水平，才能转化为JOOQ语法；开发时主要使用JOOQ语法，难度不高，但转化过程较复杂；通用Java的语言能力可以低于一般水平。SPL的目标是简化Java甚至SQL的编码，无论入门学习还是深入开发，难度都不高。但涉及到高性能计算时需要学习较多特有的算法，难度也会提高。

**代码量**

SQL擅长结构化数据计算，语法较简练，代码量较低，但为了把SQL翻译成JOOQ，需要引入很多函数，存在过度封装的现象，实际代码量较大。JOOQ的流程控制要借助Java语法，但Java语法没有为结构化数据对象而设计，代码量也不低。

SPL的表达能力强于SQL，远强于JOOQ，可用更低的代码量实现结构化数据计算，SPL的流程处理语句专为结构化数据对象而设计，代码量低于Java。

结构化数据对象
-------

结构化数据对象用于将数据库表对象化，是数据处理和业务逻辑开发的基础，专业的结构化数据对象可以方便地与数据库交换数据，支持丰富的计算函数，并简化流程处理的难度。

**定义**

JOOQ的结构化数据对象由记录和记录集合组成。记录对象的种类很多，第一类是Record对象，适合字段的数量、类型、名字都是动态生成的情况，Record虽然很灵活但面向对象的程度较低，用法比较麻烦，比如要通过getValue(M)来获得第M个字段。第二类是Record\[N\]对象，N从1到22，比如Record3，适合字段类型和字段数量已知但不超过22个，而字段名是动态生成的情况，Record\[N\]灵活性差些但面向对象的程度稍高，用法方便些，比如可以通过valueM取得第M个字段。第三类记录对象由JOOQ的代码工具根据库表结构生成，有几个表就有几个对象，字段的数量、类型、名字都和库表字段严格对应，比如OrdersRecord、EmployeesRecord，这种记录对象不灵活但面向对象的程度很高，用法也很方便，可以直接通过字段名取字段。第三类对应库表，可称之为固定数据结构的记录对象，前两类通常来自对库表的查询计算，可称之为动态数据结构的记录对象。这三类比较常用，还有些不常用的记录对象，比如用户自定义记录类型UDT，这里就不展开说了。JOOQ的记录对象种类繁多，用法差异较大，增加了开发的难度，这主要因为业务逻辑存在大量动态数据结构，而Java是编译型语言，只擅长表达固定数据结构，如果硬要表达动态数据结构，就只能设计复杂的接口规则，或者根据字段数量预定义大量对象。

JOOQ记录集合的种类相对较少，常用的有原生对象Result，及其父类ArrayList，有时候也会用Stream。

SPL的结构化数据对象同样由记录（Record）和记录集合（序表）组成。SPL的记录对象只有一种，主要因为SPL是解释型语言，动态数据结构和固定数据结构表达起来同样方便，接口都很简单，没必要分成多个。此外，记录对象与单记录集合虽然本质不同，但业务意义相似，用起来容易混淆。SPL是解释型语言，可以通过灵活的接口使两者的外部用法保持一致，从而进一步提高易用性。相反，JOOQ是编译型语言，很难设计出这种灵活的接口，只能提供两类不同的接口，分别用来处理记录对象和单记录集合。

**读数据库**

JOOQ读取外部数据库表，生成固定记录集合：

```ini
java.sql.Connection conn = DriverManager.getConnection(url, userName, password);
DSLContext context = DSL.using(conn, SQLDialect.MYSQL);
Result<OrdersRecord> R1=context.select().from(ORDERS).fetchInto(ORDERS);
```

查询外部数据库表，生成动态记录集合：

```sql
Result<Record3<Integer,String,Double>>R2=context.select(ORDERS.SELLERID,ORDERS.CLIENT,ORDERS.AMOUNT).from(ORDERS).fetch();
```

动态记录集合的后续用法稍显麻烦，但可以兼容固定记录集合，下面文章中主要用动态记录集合。

SPL读取或查询外部数据库表，生成序表：

A

1

\=conn=connect("mysql8")

2

\=conn.query("select \* from Orders")

3

\=conn.query("select SellerID,Client,Amount from Orders")

SPL不分固定记录集合或动态记录集合，生成方法一致，后续用法相同。

**写数据库**

将处理后的结构化数据对象持久化保存到数据库，JOOQ提供了三种函数，分别是insert、update、delete。修改记录r，再更新到数据库：

```scss
r.setValue(ORDERS.AMOUNT,r.getValue(ORDERS.AMOUNT).doubleValue()+100);
r.update();
```

上面是单条记录的更新。要注意的是，数据库表必须有主键，自动生成的记录类才会继承UpdatableRecordImpl，只有继承UpdatableRecordImpl的记录类才支持update函数。 批量写入数据库是数据业务逻辑常见的场景，JOOQ也能实现。批量修改记录集合T，并更新到数据库：

```scss
R1.forEach(r->{r.setValue(ORDERS.AMOUNT,r.getValue(ORDERS.AMOUNT).doubleValue()+100);});
R1.forEach(r->{r.update();});
```

上面代码循环记录集合，手工更新每一条记录，从而实现对整体集合的更新。可以看到，JOOQ通过硬写代码实现批量写入，没有进行封装，很多时候不方便。如果一批记录既有修改又有新增还有删除，就必须区分三类记录，再用不同的函数循环写入，常见的办法是继承记录类，新加一个“标识”属性予以区分，或者保存一个未修改的原始记录集合T，将修改后的集合NT与原始集合进行手工比对。无论哪种方法，手工实现的过程都很麻烦。

SPL对数据库的写入进行了封装，只用一个update函数就实现单条和批量记录的新增、修改、删除，且支持混合更新。比如：原序表为T，经过增删改一系列处理后的序表为NT,将变化结果持久化到数据库的orders表：

```less
conn.update(NT:T,orders)
```

**访问字段**

JOOQ读取单条记录的Client字段：

```scss
R1.get(0).getClient();
R1.get(0).get(ORDERS.CLIENT);
```

上面代码体现了JOOQ的核心优势：支持纯粹的面向对象的字段访问方式，不掺杂字符串、数字常量，或其他非Java的表达式，代码风格高度统一。遗憾之处在于，上面代码只适用于固定结构化数据对象。如果是查询计算生成的动态记录对象，就只能使用字符串字段名或数字序号访问字段：

```csharp
R2.get(0).get("Client");
R2.get(0).get(1);
```

动态记录对象更加普遍，上面的字段访问方式不算纯粹的面向对象，代码风格不一致，不支持自动补全，编写时普遍麻烦。

SPL支持纯粹的面向对象的字段访问方式，不分固定或动态，编写时普遍方便：

```scss
T(1).Client
```

当然也支持字符串字段名或数字序号访问字段：

```scss
T(1).field(2)
T(1).field("Client")
```

SPL在面向对象方面更加纯粹，风格更统一，编写代码更加方便。此外，SPL提供了很多JOOQ不支持的便利功能：默认字段名，可以用点号直接访问，比如取第2个字段：T(1).#2；取多个字段，返回集合的集合：T.(\[Client,Amount\])

**有序访问**

有序访问是业务逻辑开发的难点之一，JOOQ的记录集合继承自Java的有序集合ArrayList，具备一定的有序访问能力，支持按下标取记录和按区间取记录：

```scss
R.get(3)
R.subList(3,5);
```

再进一步的功能，就需要硬编码实现了，比如后3条：

```ini
Collections.reverse(R);
R.subList(0,3);
```

至于按位置集合取记录、步进取记录等功能，硬编码就更麻烦了。

SPL序表同样是有序集合，提供了顺序相关的基本功能，比如按下标取、按区间取：

```scss
T(3)
T.to(3,5)
```

序表是专业的结构化数据对象，许多顺序相关的高级功能JOOQ Result没有支持，序表则直接提供了，比如按倒数序号取记录，可以直接用负号表示：

```scss
T.m(-3)							//倒数第3条
T.m(to(-3,-5))						//倒数区间
```

再比如按位置集合取记录、步进取记录：

```scss
T.m(1,3,5,7:10)						//序号是1、3、5、7-10的记录
T.m(-1,-3,-5)						//倒数第1，3，5条
T.step(2,1)						//每2条取第1条（等价于奇数位置）
```

结构化数据计算
-------

结构化数据计算能力是数据业务逻辑的核心功能，下面从简单到复杂选取几个常见题目，比较JOOQ和SPL的计算代码。

**改名**

```csharp
//等价的SQL
select SellerID eid,Amount amt from Orders
//JOOQ
context.select(ORDERS.SELLERID.as("eid"),ORDERS.AMOUNT.as("amt")).from(ORDERS).fetch()
//SPL
Orders.new(SellerID:EID, Amount:amt)
```

JOOQ的语法逻辑与SQL基本一致，可以达到用面向对象的方式模拟SQL的目的，这是JOOQ的重要优点。相应的也有缺点，JOOQ的一项运算需要多个函数的组合才能实现，每个函数都有自己的参数和语法规则，学习和编写难度较大。此外，很多函数里的字段名必须附带表名，即使单表计算也是如此，这说明JOOQ的语法不够专业，还有很大的改进空间。

SPL直接用面向对象的语法实现计算，一项运算对应一个函数，引用字段不必附带表名，语法更专业，代码更简短。

**条件查询**

```scss
//等价的SQL
select * from Orders where
((SellerID=2 and Amount<3000) or (SellerID=3 and Amount>=2000 and Amount<5000))
and
year(OrderDate)>2010
//JOOQ
context.select().from(ORDERS)
.where(
((ORDERS.SELLERID.equal(2).and(ORDERS.AMOUNT.lessThan(3000.0)))
.or((ORDERS.SELLERID.equal(3).and(ORDERS.AMOUNT.greaterOrEqual(2000.0).and(ORDERS.AMOUNT.lessThan(5000.0))))))
.and(year(ORDERS.ORDERDATE).greaterThan(2012)))
.fetch();
//SPL
Orders.select(
((SellerID==2 && Amount<3000) || (SellerID==3 && Amount>=2000 && Amount<5000))
&&
year(OrderDate)>2010)
```

SQL的条件表达式本身足够简单，JOOQ虽然在模拟SQL，但对条件表达式进行了过度封装，函数数量过多，多层括号难阅读，远不如SQL好理解。SPL用一个函数实现条件查询，条件表达式简短易读。

**分组汇总**

```sql
//等价的SQL：
select Client, extract(year from OrderDate) y,count(1) cnt
from Orders
group by Client, extract(year from OrderDate)
having amt<20000
//JOOQ
context.select(ORDERS.CLIENT,year(ORDERS.ORDERDATE).as("y"),sum(ORDERS.AMOUNT).as("amt"),count(one()).as("cnt"))
.from(ORDERS)
.groupBy(ORDERS.CLIENT,year(ORDERS.ORDERDATE))
.having(field("amt").lessThan(20000)).fetch();
//SPL
Orders.groups(Client,year(OrderDate):y;sum(Amount):amt,count(1):cnt)
.select(amt<20000)
```

为了模拟SQL，JOOQ使用了很多函数，规则很复杂，导致代码过长。SPL直接用面向对象的语法，规则简单，代码更短。

前面都是较简单计算，类似的计算还包括排序、去重、关联、集合交并差等计算，这里不再一一列举，总的来说，JOOQ进行简单计算时比SQL和SPL代码长，很多时候不易理解，开发效率较低。

**各组前3名**

```csharp
//等价的SQL
select * from (select *, row_number() over (partition by Client order by Amount) rn from Orders) T where rn<=3
//JOOQ
WindowDefinition CA = name("CA").as(partitionBy(ORDERS.CLIENT).orderBy(ORDERS.AMOUNT));
context.select().from(select(ORDERS.ORDERID,ORDERS.CLIENT,ORDERS.SELLERID,ORDERS.AMOUNT,ORDERS.ORDERDATE,rowNumber().over(CA).as("rn")).from(ORDERS).window(CA) ).where(field("rn").lessOrEqual(3)).fetch();
//SPL
Orders.group(Client).(~.top(3;Amount)).conj()
```

这道题目稍有难度，JOOQ虽然模拟出了SQL，但使用了很多函数，代码长度远超SQL，语法也越来越不像SQL，编写理解更加困难。SPL先对客户分组，再求各组（即~）的前3名，最后合并各组计算结果，不仅代码更简短，且更易理解。

JOOQ使用了窗口函数，只适合特定版本的数据库，比如MySQL8，不能通用于其他版本的数据库，要想在MySQL5下实现同样的计算，代码改动非常麻烦。SPL有独立计算能力，代码可通用于任何数据库。

**某支股票最大连续上涨天数**

JOOQ：

```less
WindowDefinition woDay1 = name("woDay").as(orderBy(APPL.DAY));
Table<?>T0=table(select(APPL.DAY.as("DAY"),when(APPL.PRICE.greaterThan(lag(APPL.PRICE).over(woDay1)),0).otherwise(1).as("risingflag")).from(APPL).window(woDay1)).as("T0");
WindowDefinition woDay2 = name("woDay1").as(orderBy(T0.field("DAY")));
Table<?>T1=table(select(sum(T0.field("risingflag").cast(java.math.BigDecimal.class)).over(woDay2).as("norisingdays")).from(T0).window(woDay2)).as("T1");
Table<?>T2=table(select(count(one()).as("continuousdays")).from(T1).groupBy(T1.field("norisingdays"))).as("T2");
Result<?> result=context.select(max(T2.field("continuousdays"))).from(T2).fetch();
```

这个问题难度较高，需要综合运用多种简单计算。JOOQ很难直接表达连续上涨的概念，只能使用技巧变相实现，即通过累计不涨天数来计算连续上涨天数。具体是，先按时间顺序给每条记录打涨跌标记risingflag，如果下跌，则标为1，如果上涨，则标为0；再按时间顺序累计每条记录的不涨天数norisingdays，只有当前记录下跌时，这个数字才会变大，如果当前记录上涨，则这个数字不变；再按不涨天数norisingdays分组，求各组记录数，显然，连续下跌的一批记录的norisingdays不同，每条记录都会分到不同的组，该组计数为1，这个值不是解题目标，而连续上涨的一批记录的norisingdays相同，可以分到同一组，该组计数即连续上涨的天数，这个值是解题目标；最后用max函数求出最大的连续上涨天数。

JOOQ的编程过程是先写SQL，再翻译成JOOQ，对于简单计算来说，SQL比较好写，翻译也不会太难，但对于本题这种综合性计算来说，计算逻辑的技巧性比较强，SQL不好写，翻译的难度更大。此外，JOOQ表面上是方便调试的Java，但本质却是SQL，和SQL一样难以调试，这又为将来的维护工作埋下了大坑。

SPL代码简单多了：

```sql
APPL.sort(day).group@i(price<price[-1]).max(~.count())
```

这条SPL语句的计算逻辑和JOOQ是相同的，也是将连涨记录分到同一组中再求最大的组成员数，但表达起来要方便很多。group@i()表示遍历序表，如果符合条件则开始新的一组（并使之前的记录分到同一组），price<price\[-1\]这个条件表示股价下跌，则之前股价上涨的记录会分到同一组。\[-1\]表示上一条，是相对位置的表示方法，price\[-1\]表示上一个交易日的股价，比整体移行（lag.over）更直观。

相对位置属于有序计算，SPL是专业的结构化计算语言，支持有序计算，代码因此更简单。除了有序集合，SPL还可以简化多种复杂计算，包括多步骤计算、集合计算、复杂的关联计算。相反，这几类计算都是JOOQ不擅长的，通常要通过特殊技巧实现，代码很难写。

**SPL函数选项和层次参数**

值得一提的是，为了进一步提高开发效率，SPL还提供了独特的函数语法。有大量功能类似的函数时，JOOQ只能用不同的名字或者参数进行区分，使用不太方便。而SPL提供了非常独特的函数选项，使功能相似的函数可以共用一个函数名，只用函数选项区分差别。比如，select函数的基本功能是过滤，如果只过滤出符合条件的第1条记录，可使用选项@1：

```csharp
T.select@1(Amount>1000)
```

对有序数据用二分法进行快速过滤，使用@b：

```java
T.select@b(Amount>1000)
```

函数选项还可以组合搭配，比如：

```csharp
Orders.select@1b(Amount>1000)
```

有些函数的参数很复杂，可能会分成多层。JOOQ对此并没有特别的语法方案，只能拆成多个函数互相嵌套，尽力模拟成SQL语法，导致代码冗长繁琐。而SPL创造性地发明了层次参数简化了复杂参数的表达，通过分号、逗号、冒号自高而低将参数分为三层。比如关联两个表：

```less
join(Orders:o,SellerId ; Employees:e,EId)
```

流程处理
----

JOOQ支持部分存储过程语法，包括循环语句和判断语句，但这属于商业版功能，且权限要求高、安全隐患大，难以移植，一般很少用到。除了存储过程，JOOQ还可以利用Java实现流程处理，对数据库没有权限要求，安全隐患小，且可无缝移植。比如，根据规则计算奖金：

```scss
    Orders.forEach(r->{
    Double amount=r.getValue(ORDERS.AMOUNT);
        if (amount>10000) {
        r.setValue(ORDERS.BONUS), amount * 0.05);
            }else if(amount>=5000 && amount<10000){
            r.setValue(ORDERS.BONUS),amount*0.03);
                }else if(amount>=2000 && amount<5000){
                r.setValue(ORDERS.BONUS),amount*0.02);
            }
            });
```

forEach循环函数针对JOOQ的结构化数据对象进行了优化，可以通过Lambda表达式简化循环结构的定义，可以方便地处理集合对象的每个成员（代码中的循环变量r）。forEach函数配合Lambda语法，整体代码要比传统循环语句简单些。但也应该注意到，forEach函数里使用字段需要附带循环变量名，对单表计算来说是多余的，同样使用Lambda语法的SQL就可以省略变量名。此外，定义循环变量名也是多余的，SQL就不用定义。这些缺点都说明JOOQ在流程处理方面还不够专业，代码还有很大的优化空间。

SPL也有针对结构化数据对象进行优化的循环函数，直接用括号表示。同样根据规则计算奖金：

```less
Orders.(Bonus=if(Amount>10000,Amount*0.05,
if(Amount>5000 && Amount<10000, Amount*0.03,
if(Amount>=2000 && Amount<5000, Amount*0.02)
)))
```

SPL的循环函数同样支持Lambda表达式，而且接口更简单，不必定义循环变量，使用字段时不必引用变量名，比JOOQ更方便，专业性也更强。除了循环函数，SPL还有更多专业的流程处理功能，比如：每轮循环取一批而不是一条记录；某字段值变化时循环一轮。

SPL专业的流程处理功能，配合专业的结构化数据对象和结构化数据计算能力，可大幅提高数据业务逻辑的开发效率。一个完整的例子：计算出奖金，并向数据库插入新记录。JOOQ需要生成多个文件，编写大段代码才能实现，SPL就简单多了：

A

B

C

1

\=db=connect@e("dbName")

/连接数据库，开启事务

2

\=db.query@1("select sum(Amount) from sales where sellerID=? and year(OrderDate)=? and month(OrderDate)=?", p\_SellerID,year(now()),month(now()))

/查询当月销售额

3

\=if(A2>=10000 :200, A2<10000 && A2>=2000 :100, 0)

/本月累计奖金

4

\=p\_Amount\*0.05

/本单固定奖金

5

\=BONUS=A3+A4

/总奖金

6

\=create(ORDERID,CLIENT,SELLERID,AMOUNT,BONUS,ORDERDATE)

/创建订单的数据结构

7

\=A6.record(\[p\_OrderID,p\_Client,p\_SellerID,p\_Amount,BONUS,date(now())\])

/生成一条订单记录

8

\>db.update@ik(A7,sales;ORDERID)

/尝试写入库表

9

\=db.error()

/入库结果

10

if A9==0

\>A1.commit()

/成功，则提交事务

11

else

\>A1.rollback()

/失败，则回滚事务

12

\>db.close()

/关闭数据库连接

13

return A9

/返回入库结果

利用SPL的流程处理语句，可以实现存储过程的所有能力，包括游标的循环和判断。SPL不依赖数据库，不需要数据库权限，没有安全隐患，相当于库外的存储过程，同时，这些功能也都是开源的。

应用结构
----

**Java集成**

JOOQ本身就是Java，可被其他Java代码直接调用。

SPL是基于JVM的数据计算语言，提供了易用的JDBC接口，可被JAVA代码无缝集成。比如，将业务逻辑代码存为脚本文件，在JAVA中以存储过程的形式调用文件名：

```ini
Class.forName("com.esproc.jdbc.InternalDriver");
Connection connection =DriverManager.getConnection("jdbc:esproc:local://");
Statement statement = connection.createStatement();
ResultSet result = statement.executeQuery("call genBonus()");
```

**热部署**

JOOQ（Java）是编译型语言，不支持热部署，修改代码后需要重新编译并重启整个应用，加大了维护难度，降低了系统稳定性。

SPL是解释型语言，代码以脚本文件的形式外置于JAVA，支持热部署，修改后不必编译，也不必重启应用。由于SPL代码不依赖JAVA，业务逻辑和前端代码物理分离，耦合性也更低。

**代码移植**

JOOQ的部分代码可以移植，比不可移植的MyBatis方便。比如业务逻辑中常用于分页的limit(M).offset(N)，在Oracle11g数据库下会被翻译为rownum子查询；如果数据库改为MSSQL2012，只要重新生成并部署实体类，不必修改业务逻辑，同样的代码就会翻译成offset next语句。

能够移植的代码毕竟是少数，大部分JOOQ代码都是不可以移植的，比如前面例子里的窗口函数。移植时需要读懂原JOOQ代码，反翻译成原SQL，再改成新SQL，最后翻译成新JOOQ代码，过程较繁难度较高。业务逻辑普遍具有复杂性，移植工作就更难了。

SPL具有独立计算能力，不必借用SQL，凭借丰富的内置函数库就能实现复杂的结构化数据计算，计算代码可在数据库间无缝移植。在数据库取数代码中，SPL也要执行方言SQL生成序表，虽然取数SQL比较简单，手工移植不难，但仍有一定工作量，为了使取数代码便于移植，SPL专门提供了不依赖特定数据库的通用SQL，可在主流数据库间无缝移植。

通过多方面的比较可知：JOOQ可以进行较简单的查询统计，但对于较复杂的业务逻辑开发就显得比较繁琐，尤其是有序计算、多步骤计算、集合计算、复杂的关联查询，存在翻译SQL的工作量大，代码冗长，难以修改，难以移植等问题。SPL语法简练、表达效率高、代码移植方便，结构化数据对象更专业，函数更丰富且计算能力更强，流程处理更方便，开发效率远高于JOOQ。

资料
--

*   [SPL下载](https://link.juejin.cn?target=http%3A%2F%2Fc.raqsoft.com.cn%2Farticle%2F1595816810031 "http://c.raqsoft.com.cn/article/1595816810031")
*   [SPL源代码](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FSPLWare%2FesProc "https://github.com/SPLWare/esProc")