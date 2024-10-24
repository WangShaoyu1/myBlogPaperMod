---
author: "京东云开发者"
title: "系统整容纪：揭秘Java编程之美：掌握这些编码规范，让你的代码一跃成为行业典范"
date: 2024-07-23
description: "本文通过介绍随处可见并且极其容易忽略的代码规范背后的深因，来使得读者受到启发或加深理解，并且为养成良好的编码习惯打下坚实的基础。 分享工作中的点点滴滴，贯彻千里之行，始于足下，最终以微不足道的量变引起"
tags: ["代码规范中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读46分钟"
weight: 1
selfDefined:"likes:1,comments:0,collects:4,views:176,"
---
本文通过介绍随处可见并且极其容易忽略的代码规范背后的深因，来使得读者受到启发或加深理解，并且为养成良好的编码习惯打下坚实的基础。
----------------------------------------------------------------

分享工作中的点点滴滴，贯彻千里之行，始于足下，最终以微不足道的量变引起化蝶的质变精神。以自己为例拒绝在舒适的中央区域安逸的躺着，以便在不知不觉中被社会所淘汰，也不盲目的直接跃迁进困哪区域，在受挫的同时又跌回原有的舒适区域内，造成这样一个浑浑噩噩的让人无法进步的循环怪圈内，保持在舒适边缘的拉伸区，既跳出了舒适区又具有一定的挑战性，使得自己在保持快速进步的同时还能够渐渐树立起自信心，可谓是一举多得，系统的维护改造也是如此道理。**如果大家觉得有用，欢迎大家点赞、收藏+关注，哇咔咔😀！**
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

一、什么是编码规范
---------

在Java的世界里，编码规范不仅仅是一堆乏味的规则和条款，它们是通往代码优雅之路的黄砖路。想象一下，没有编码规范的Java代码库就像是一场没有裁判的足球赛，混乱不堪，每个人都在按自己的规则踢球。但别担心，今天我们将带你走进编码规范的奇妙世界，探索那些让你的代码从"看起来还行"升级为"哇，这是谁写的神仙代码"的秘密。

我们将一起探索为什么命名一个变量为temp123可能会让你的同事在code review时掉头就跑，为何空格和缩进在代码中的角色比配角还重要，以及如何通过简单的规则让你的代码变得更加清晰、易读，就像是在阅读一篇畅销小说。

准备好了吗？让我们一起开始我们的编码规范之旅，让你的Java代码不仅仅是运行的艺术，更是视觉的享受。 Buckle up（系好安全带），这将是一次有趣的旅程！

二、为什么要重视编码规范
------------

想要成为代码界的建筑大师吗？嗯，让我们从最基础的部分讲起——基础的重要性。你有没有听过那句老话，“只要功夫深，铁杵磨成针”？如果你想让你的代码像针一样锋利、精确，那么你得开始磨练你的基础功夫了。

想象一下，你正在建造一座高楼。如果地基不牢固，那么不管你的建筑有多华丽，最终都会成为倾斜的比萨塔的亲戚。同样的，编程也是这样。如果你的基础不牢固，那么不管你用了多少高级技巧，你的代码最终可能就是一个功能混乱的软件比萨塔。

记住，“千里之行，始于足下”。每一行代码，每一个函数，都是你软件高楼的一砖一瓦。而这些砖瓦的质量，取决于你对基础知识的掌握程度。正如“滴水石穿”，持之以恒的练习和对基础的不断打磨，最终会让你的编程技能坚不可摧。

再来，你听说过“冰冻三尺，非一日之寒”吗？优秀的代码库也是如此，它们的优秀并非一蹴而就，而是基于坚实的基础，经过长时间的积累和迭代。

最后，让我们以“愚公移山”的精神结束这段讨论。面对看似无穷无尽的编程知识，我们可能会感到力不从心。但只要我们坚持不懈，就没有什么山是移不走的，没有什么基础是打不牢的。

所以，亲爱的代码工匠们，让我们从今天开始，把握好每一个学习的机会，把基础打得牢牢的。记住，伟大的软件建筑，都是从一行简单的代码开始的。

三、编码细则极其背后的深因
-------------

### 命名规范

1.类名使用UpperCamelCase风格，必须遵从驼峰形式，但以下情形例外：（领 域模型的相关命名）DO / BO / DTO / VO / DAO

深因：

一致性：类名遵循UpperCamelCase（大驼峰式）增加了代码的一致性，使得类名容易识别和区分。

可读性：大驼峰式命名使得多个单词的组合在视觉上更为清晰，有助于理解类的用途。

领域模型例外：DO (Data Object), BO (Business Object), DTO (Data Transfer Object), VO (Value Object), DAO (Data Access Object) 是业界广泛认可的缩写，代表了特定的设计模式和概念。它们的使用在领域驱动设计中具有特定含义，保持这些缩写可以让开发人员快速理解类的职责。

正例（遵循规范）:

UserProfile - 明确遵从大驼峰式命名。

UserDTO - 表示一个用于数据传输的对象，DTO作为普遍接受的缩写被保留。

反例（违反规范）:

userProfile - 类名以小写字母开头，不符合大驼峰式命名规则。

UserDataObject - 应缩写为UserDO，因为DO是一个被广泛认可的领域模型命名缩写。

通过此规范，可以确保代码的整洁性、一致性和专业性，同时也尊重了行业内的共识和最佳实践。

2.抽象类命名使用Abstract或Base开头

深因：

明确性：以Abstract或Base开头的命名立即明确了该类的抽象性质，让其他开发者一眼就能识别出这是一个不应被直接实例化的类。

可维护性：当项目规模扩大时，清晰的命名规范有助于维持代码的可维护性，减少查找和理解各个类之间关系的时间。

一致性：统一的命名规范有助于保持代码库的一致性，使得新加入的开发人员能更快地熟悉代码库。

避免命名冲突：在有些情况下，抽象类和具体实现类可能会有相似的功能描述，以Abstract或Base开头可以减少命名上的冲突。

正例（遵循规范）:

AbstractVehicle：一个定义了交通工具通用属性和方法的抽象类，正确地使用了Abstract前缀。

BaseService：定义了服务层基本功能的抽象类，使用了Base前缀，明确表示这是一个基础类，用于被继承。

反例（违反规范）:

Vehicle：假如这是一个抽象类，但没有使用Abstract或Base前缀，这使得它看起来像是一个可直接实例化的类。

Service：如果这是一个旨在被其他服务类继承的基础抽象类，但命名中缺少了表明其抽象性质或基础性质的前缀。

通过引入这条规范，可以提高代码的可读性和维护性，同时减少因命名不当引起的混淆。

3.异常类命名使用Exception结尾

深因：

清晰性：命名中使用Exception结尾能立即明确该类是一个异常类，有助于开发者快速识别其用途和性质。

一致性：这一命名规范与Java标准异常类的命名保持一致，如NullPointerException、IndexOutOfBoundsException等，有助于保持代码的一致性，减少学习成本。

可读性：在阅读代码时，能够通过异常类名直接了解到该异常的大致类型，提高了代码的可读性。

预防错误：明确的命名有助于防止将异常类与普通类混淆，减少因错误处理异常或误用类而引发的bug。

正例（遵循规范）:

UserNotFoundException：明确表示寻找用户失败时抛出的异常，正确地使用了Exception结尾。

InvalidInputException：表示输入无效时抛出的异常，使用了Exception结尾，清晰地表明了其是一个异常类。

反例（违反规范）:

UserNotFound：虽然意图表达寻找用户失败的情况，但由于没有使用Exception结尾，使得它看起来更像是一个普通类而非异常类。

InvalidInput：这个名字没有明确表明它是一个异常类，可能会被误解为一个方法名或变量名，而不是一个应该被抛出和捕获的异常类型。

通过遵循这条规范，开发者可以更容易地编写和维护清晰、一致且易于理解的异常处理代码。

4.单元测试类命名以它要测试的类的名称开始，以Test结尾

深因：

直观性：当测试类以被测试类的名称开始，紧随其后加上Test作为后缀，这种命名方式直观地表明了测试类的目的和它所测试的具体类，提高了可读性和易理解性。

可查找性：这种命名约定使得开发者可以轻松地通过类名找到对应的测试类，或通过测试类推断出它测试的目标类，从而提高开发效率。

一致性：遵循这一命名规范可以在整个项目或团队中保持一致性，减少因个人偏好导致的命名混乱，使代码库更加整洁。

组织性：在大型项目中，可能会有大量的测试类。这种命名规则有助于在项目结构中保持组织性，使测试包结构清晰、有序。

正例（遵循规范）:

假设有一个类名为UserService，那么对应的单元测试类应该命名为UserServiceTest。这明确了UserServiceTest是用于测试UserService类的功能。

对于类PaymentProcessor，其单元测试类应该命名为PaymentProcessorTest，这样一来，仅通过名字就能清楚地知道这是PaymentProcessor类的测试。

反例（违反规范）:

如果有一个类名为OrderManager，而其测试类被命名为TestOrderManager或仅仅是OrderTests，这虽然在一定程度上表明了测试目标，但不符合“以被测试类的名称开始，以Test结尾”的规范，可能会导致查找和理解上的不便。

对于InventoryService类，如果其测试类被命名为InventoryChecks，这种命名虽然描述了测试的一般内容，但没有遵循规定的命名模式，降低了命名的一致性和直观性。

遵循这条规范，有助于维护代码的清晰度和组织性，同时也方便团队成员之间的协作和沟通。

5.方法名、参数名、成员/局部变量都统一使用lowerCamelCase，必须遵从驼峰形式

深因：

一致性：在整个项目中统一使用lowerCamelCase（小驼峰命名法）可以保持代码的一致性，使得代码更加整洁和统一。

可读性：lowerCamelCase通过在单词之间使用大小写来区分，无需额外的分隔符，从而提高了代码的可读性和易于理解。

遵循约定：在多数编程语言中，lowerCamelCase是方法名、参数名、成员变量和局部变量的普遍约定，遵循这些约定有助于维持代码风格的一致性，同时也方便其他开发者阅读和理解代码。

减少错误：统一的命名规范有助于减少由于命名不一致导致的混淆和错误。

正例（遵循规范）:

方法名：calculateTotalPrice，清晰地表明这是一个计算总价的方法。

参数名：customerName，明确指出传入的是顾客的名字。

成员变量：shoppingCart，代表购物车对象。

局部变量：itemCount，表示物品数量。

反例（违反规范）:

方法名：CalculateTotalPrice或calculate\_total\_price。前者使用了PascalCase（大驼峰命名法），后者使用了snake\_case（下划线命名法），都不符合lowerCamelCase的规范。

参数名：CustomerName或customer\_name，同样违反了使用lowerCamelCase的规范。

成员变量：ShoppingCart或shopping\_cart，没有遵循小驼峰命名法。

局部变量：ItemCount或item\_count，同样违反了小驼峰命名法的规定。

通过遵循lowerCamelCase命名规范，可以使代码更加统一和易于理解，促进团队内部和跨团队之间的有效沟通。

6.代码中的命名均不能以下划线或美元符号开始，也不能以下划线或美元符号结束

深因：

清晰性：避免使用下划线或美元符号作为命名的开始或结束，可以使得代码命名更加清晰，易于阅读和理解。这些符号在很多语言中有特殊含义，过度使用可能导致混淆。

一致性：统一的命名规范有助于保持代码的一致性，减少因个人命名偏好导致的风格差异，使代码库整体更加规范和整洁。

可维护性：清晰和一致的命名规范有助于提高代码的可维护性，便于团队协作和代码的长期维护。

避免冲突：在某些编程语言中，下划线或美元符号用于特殊变量或内部语言机制，避免使用这些符号作为普通命名的一部分，可以减少与语言特性的冲突。

正例（遵循规范）:

变量名：userName，明确且易于理解，且没有使用下划线或美元符号作为开头或结尾。

方法名：calculateTotal，遵循了规范，清晰表达了方法的功能。

反例（违反规范）:

变量名：_userName或userName_，以及userName或userNameuserName或userNameuserName或userName，这些命名都违反了不使用下划线或美元符号开头或结尾的规范。

方法名：_calculateTotal或calculateTotal_，以及calculateTotal或calculateTotalcalculateTotal或calculateTotalcalculateTotal或calculateTotal，同样违反了规范。

通过遵守这条规范，可以使代码更加清晰和规范，减少潜在的混淆，促进代码的健康发展和团队间的有效沟通。

7.常量命名应该全部大写，单词间用下划线隔开，力求语义表达完整清楚，不要嫌名字长

深因：

可识别性：全部大写字母加下划线的命名方式使常量在代码中非常容易识别，区分于变量和其他类型的命名。

清晰性：强调语义表达的完整性有助于提高代码的清晰度，即使名称较长，也能确保其意图和用途一目了然。

一致性：遵循此规范能在整个项目或团队中保持命名的一致性，减少因个人偏好导致的风格差异。

避免冲突：通常变量和函数使用小驼峰或大驼峰命名法，常量使用全大写与下划线的方式可以有效避免命名冲突。

正例（遵循规范）:

MAX\_USER\_COUNT：表明了这是一个表示用户数量上限的常量，名称完整表达了其意图。

DEFAULT\_PAGE\_SIZE：清楚地指出这是默认页面大小的常量，语义明确。

反例（违反规范）:

MaxUser或maxUser：虽然意图指代最大用户数，但不符合全大写和单词间用下划线隔开的规范，且看起来更像是变量而非常量。

defaultsize或defaultSize：名称不仅没有全部大写，而且单词间没有使用下划线隔开，语义表达也不够清晰。

通过遵循这条规范，可以显著提高代码中常量的可识别性和清晰性，有助于维护和理解代码。

8.对于Service和DAO类，基于SOA的理念，暴露出来的服务一定是接口，内部的实现类用Impl的后缀与接口区别

深因：

解耦: 通过定义接口，将实现与调用解耦，便于在不同实现间切换，提高了代码的灵活性和可维护性。

易于扩展: 接口定义了一组规范，使得未来扩展或修改功能时，只需添加或修改具体实现类，而不需要修改调用方代码。

便于测试: 接口使得可以使用Mock对象来替代具体实现，便于进行单元测试。

清晰的结构: 接口和实现类的命名规范有助于快速识别类的作用，增加了代码的可读性。

正例（遵循规范）:

接口命名为UserService，表明这是一个用户服务的接口。

实现类命名为UserServiceImpl，清楚地表明这是UserService接口的一个具体实现。

```java
    public interface UserService {
    void addUser(User user);
}


    public class UserServiceImpl implements UserService {
    @Override
        public void addUser(User user) {
        // 实现添加用户的逻辑
    }
}
```

反例（违反规范）:

接口和实现类命名为UserService和UserServiceImplementation，或者仅仅是在实现类上使用Service作为后缀。这种命名方式不够简洁，且可能导致命名的不一致性。

实现类没有明确使用Impl后缀，例如只是UserManager，这样就不容易区分哪些是接口，哪些是实现类。

通过遵循这条规范，可以提高代码的结构清晰度，便于维护和扩展，同时也符合SOA（面向服务的架构）的设计理念。

9.包名统一使用小写，点分隔符之间有且仅有一个自然语义的英语单词。包名统一使用单数形式，但是类名如果有复数含义，类名可以使用复数形式

深因：

避免平台差异：不同的操作系统对文件名的大小写敏感性不同。统一使用小写可以避免跨平台开发时的混淆和错误。

提高可读性：点分隔符和自然语义的英语单词组合，使得包路径易于理解，反映了项目的结构和内容。

保持一致性：使用单数形式的包名，保持了命名的简洁和一致性，避免了复数形式可能带来的混淆。

灵活性和准确性：允许类名使用复数形式，为表达“集合”或“多个实体”的概念提供了灵活性，使得类的命名更加准确和直观。

正例（遵循规范）:

包名：com.example.project.user，使用了小写，点分隔符后是单数形式的自然语义英语单词。

类名：若类表示多个用户，可以命名为Users。

package com.example.project.user;

public class Users {

// 类实现

}

反例（违反规范）:

包名：com.Example.Project.Users，使用了大写字母和复数形式，违反了包名全小写和单数形式的规范。

包名：com.example.project.user\_info，使用了下划线而不是点分隔符，且包含了多于一个自然语义的英语单词。

package com.Example.Project.Users; // 错误的包命名

public class UserList {

// 类实现

}

通过遵循这条规范，可以使得包结构更加清晰，易于管理，同时也提高了代码的可读性和一致性。

10.POJO类中的任何布尔类型的变量，都不要加is，否则部分框架解析会引起序列化错误

深因：

兼容性问题：在Java Bean规范中，布尔类型的属性通常通过is前缀的getter方法来访问。但是，在使用某些序列化框架时，如果字段名本身以is开头，可能会导致框架在生成的getter/setter方法命名上产生混淆，引起序列化或反序列化错误。

清晰的命名约定：避免在变量名中使用is前缀，可以使得命名约定更加清晰。通过getter和setter方法的命名来表达属性的意图，而不是通过变量名本身。

提高代码的可读性和维护性：统一的命名规范有助于提高代码的可读性和维护性，特别是在团队协作中。

正例（遵循规范）:

假设有一个布尔类型的变量，表示用户是否已经激活：

public class User {

private boolean active; // 不使用is前缀

public boolean isActive() {

return active;

}

public void setActive(boolean active) {

this.active = active;

}

}

反例（违反规范）:

在变量命名中使用is前缀，可能会与自动生成的getter方法冲突，导致序列化框架解析错误：

public class User {

private boolean isActive; // 使用了is前缀

public boolean isActive() {

return isActive;

}

public void setActive(boolean isActive) {

this.isActive = isActive;

}

}

在这个反例中，某些序列化框架可能期望访问器方法为getIsActive()而不是isActive()，因此，遵循不在布尔类型变量名中使用is前缀的规范，可以避免这类问题。

11.类型与中括号紧挨相连来表示数组

深因：

一致性：将类型和中括号紧挨相连有助于保持代码的一致性，使得数组类型的声明更加清晰和一致。

提高可读性：这种声明方式明确了数组的类型，使得阅读和理解代码变得更加容易。

避免误解：在某些情况下，将中括号放在变量名而不是类型名旁边可能会导致误解，尤其是在声明多个变量时。

正例（遵循规范）:

int\[\] numbers;String\[\] names;

在这个例子中，类型（int、String）与中括号紧挨相连，清晰地表示了变量是数组类型。

反例（违反规范）:

虽然这种声明方式在Java中是合法的，但它不符合“类型与中括号紧挨相连来表示数组”的规范。特别是在声明多个数组或非数组变量时，可能会导致混淆：

int numbers\[\], size; // size不是数组类型，但这种声明方式可能会导致误解。

通过遵循这条规范，可以提高代码的清晰度和一致性，避免可能的误解，使得代码更加易于阅读和维护。

12.禁止在POJO类中，同时存在对应属性xxx的isXxx()和getXxx()方法

深因：

避免混淆: 同一个属性存在isXxx()和getXxx()方法会造成混淆，不清楚哪个方法应该被使用，尤其是在框架利用反射时。

框架兼容性: 一些框架在处理布尔属性时，对isXxx()和getXxx()方法有特定的预期和处理逻辑。同时存在这两种方法可能导致框架的反射机制工作不正常，进而影响序列化和反序列化行为。

代码清晰性: 保持每个属性只有一个访问器方法可以使得代码更加清晰，易于理解和维护。

Java Bean规范: 根据Java Bean规范，布尔类型的属性应当使用isXxx()形式的访问器方法，而非布尔类型的属性应使用getXxx()方法。

正例（遵循规范）:

对于布尔类型的属性active，只提供isActive()方法：

public class User {

private boolean active;

public boolean isActive() {

return active;

}

public void setActive(boolean active) {

this.active = active;

}

}

反例（违反规范）:

对于同一个布尔类型的属性active，同时提供了isActive()和getActive()方法：

public class User {

private boolean active;

public boolean getActive() {

return active;

}

public boolean isActive() {

return active;

}

public void setActive(boolean active) {

this.active = active;

}

}

在这个反例中，同一个属性active提供了两个访问器方法，这可能会导致在使用Java Bean相关框架时出现问题。遵循此规范，确保每个属性只有一种符合其类型的访问器方法，有助于提高代码质量和减少潜在的错误。

### 注释规范

1.所有的字段和方法必须要用javadoc注释

深因：

提高代码的可读性和可维护性：通过Javadoc注释，开发者可以快速理解每个字段和方法的用途、参数、返回值等，无需深入阅读实现代码。

促进团队协作：在团队开发中，详细的文档可以帮助新成员快速理解项目，减少沟通成本。

自动生成文档：Javadoc注释可以被工具用来生成标准的HTML格式的API文档，便于分享和查阅。

规范编码风格：强制要求使用Javadoc注释可以规范开发者的编码风格，使得代码整体质量更高。

正例（遵循规范）:

/\*\*

*   用户类。

\*/

public class User {

/\*\*

*   用户的名字。

\*/

private String name;

/\*\*

*   获取用户的名字。
    

*   @return 用户的名字
    

\*/

public String getName() {

return name;

}

/\*\*

*   设置用户的名字。
    

*   @param name 用户的新名字
    

\*/

public void setName(String name) {

this.name = name;

}

}

反例（违反规范）:

public class User {

private String name; // 缺少Javadoc注释

public String getName() { // 缺少Javadoc注释

return name;

}

public void setName(String name) { // 缺少Javadoc注释

this.name = name;

}

}

在反例中，字段和方法都没有Javadoc注释，这使得其他开发者或使用者难以快速理解其用途和功能。

遵循这条规范，可以显著提升代码的可读性和易维护性，同时也有助于自动生成文档。

2.所有的枚举类型字段必须要有注释，说明每个数据项的用途

深因：

明确枚举项的含义：枚举类型通常用来表示一组固定的常量，每个枚举项都有其特定的用途和意义。注释可以帮助开发者快速理解每个枚举项的具体含义，提高代码的可读性。

提高代码的可维护性：随着时间的推移，项目中的枚举类型可能会被多次修改或扩展。有注释的枚举项可以让后来者更容易理解每个枚举项的用途，减少因误解造成的错误。

促进团队协作：在团队协作中，清晰的注释可以减少成员之间的沟通成本，特别是对于新加入的团队成员，有助于他们更快地理解项目代码。

正例（遵循规范）:

/\*\*

*   表示用户状态的枚举。

\*/

public enum UserStatus {

/\*\*

*   激活状态。用户已激活且可以正常使用系统。

\*/

ACTIVE,

/\*\*

*   禁用状态。用户已被禁用，不能登录或使用系统。

\*/

DISABLED,

/\*\*

*   等待激活。用户已注册但尚未激活。

\*/

PENDING\_ACTIVATION

}

反例（违反规范）:

public enum UserStatus {

ACTIVE, // 缺少注释

DISABLED, // 缺少注释

PENDING\_ACTIVATION // 缺少注释

}

在反例中，UserStatus枚举的每个项都没有注释，这使得其他开发者难以理解每个枚举项的具体含义和用途。

遵循这条规范，通过为每个枚举项添加清晰的注释，可以显著提升代码的可读性和可维护性。

3.方法内部单行注释，在被注释语句上方另起一行，使用//注释。方法内部多行注释使用/\*\*/注释，注意与代码对齐

深因：

提高可读性：通过在被注释语句上方另起一行进行单行注释，可以使得注释更加突出，易于阅读。多行注释同样需要对齐，以保持代码的整洁和一致性。

区分注释类型：使用//进行单行注释和使用/\*\*/进行多行注释可以帮助区分注释的用途和长度，使得代码更加清晰。

维护代码风格一致性：统一的注释风格有助于维护代码的整体风格一致性，无论是在同一项目内还是跨项目。

正例（遵循规范）:

public void updateUserInfo() {

// 检查用户是否登录

if (user.isLoggedIn()) {

user.updateLastLoginTime(); // 更新最后登录时间

}

/\*

*   多行注释
    
*   更新用户状态和时间
    

\*/

user.setStatus("active");

user.setUpdateTime(System.currentTimeMillis());

}

在这个例子中，单行注释使用//并放在被注释语句的上方，而多行注释使用/\*\*/并与代码对齐，保持了代码的清晰和整洁。

反例（违反规范）:

public void updateUserInfo() {

user.updateLastLoginTime(); // 检查用户是否登录并更新最后登录时间

/\* 更新用户状态

和时间 \*/

user.setStatus("active");

user.setUpdateTime(System.currentTimeMillis());

}

在这个反例中，单行注释和被注释的语句在同一行，多行注释没有与代码对齐，这些做法都降低了代码的可读性和整洁性。

遵循这条规范，通过在方法内部恰当地使用单行和多行注释，可以大大提高代码的可读性和维护性。

### 常量定义规范

1.long或者Long初始赋值时，必须使用大写的L，不能是小写的l，小写容易跟数字

深因：

提高代码可读性：小写的l和数字1在很多字体中非常相似，这可能导致阅读代码时的混淆和错误。使用大写的L可以明显区分，提高代码的可读性。

减少错误：在长整型数值的赋值过程中，使用清晰明确的标识可以避免由于误读导致的错误，尤其是在涉及到数值计算的场景中。

统一编码风格：规定在所有场合下使用大写的L为long或Long类型赋值，可以统一代码风格，减少团队内部的差异。

正例（遵循规范）:

long count = 1000L;

Long total = 5000L;

在这个例子中，所有的long或Long类型赋值都使用了大写的L，清晰且易于区分。

反例（违反规范）:

long count = 1000l;

Long total = 5000l;

在这个反例中，long或Long类型赋值使用了小写的l，这在某些字体中可能与数字1混淆，降低了代码的可读性。

遵循这条规范，通过使用大写的L为long或Long类型赋值，可以有效避免混淆和错误，提高代码的整体可读性。

2.不允许任何魔法值（即未经定义的常量）直接出现在代码中

深因：

提高代码的可读性：使用有意义的常量名代替魔法值可以让代码更易于理解。读者可以通过常量名了解其用途，而不是试图解释一个裸露的数值或字符串的含义。

便于维护：当需要修改一个在多处使用的值时，使用常量可以让你只需要修改定义常量的地方，而不需要逐个修改多处的硬编码值。

减少错误：直接在代码中使用硬编码值，特别是在多处使用时，容易引入错误。例如，如果需要更改该值，可能会遗漏某些实例，导致不一致。

正例（遵循规范）:

public class Config {

public static final int MAX\_USER\_COUNT = 100;

}

// 使用常量

if (userCount > Config.MAX\_USER\_COUNT) {

// 处理超出用户数限制的情况

}

在这个例子中，100被定义为一个有意义的常量MAX\_USER\_COUNT，使用这个常量来代替魔法值。

反例（违反规范）:

// 直接使用魔法值

if (userCount > 100) {

// 处理超出用户数限制的情况

}

在这个反例中，100直接硬编码在判断语句中，这是一个魔法值的典型使用场景，它降低了代码的可读性和可维护性。

遵循这条规范，通过将魔法值替换为有意义的常量，可以显著提高代码的可读性、可维护性，并减少因硬编码引入的错误。

### 集合规范

1.  使用集合转数组的方法，必须使用toArray(T\[\] array)，传入类型完全一样的数组，大小list.size()

深因：

类型安全：使用toArray(T\[\] array)方法并传入类型完全一样的数组可以保证转换结果的类型安全。这样可以避免在运行时因类型不匹配而抛出异常。

性能优化：如果传入的数组大小与集合大小一致（list.size()），则该数组将被直接使用，避免了额外的数组分配和复制，提高了效率。

避免使用反射：与toArray()方法相比，toArray(T\[\] array)避免了在内部使用反射来创建返回数组，因此可以提高性能。

正例（遵循规范）:

List list = new ArrayList<>();

list.add("apple");

list.add("banana");

// 使用toArray(T\[\] array)传入类型完全一样的数组，大小为list.size()

String\[\] array = list.toArray(new String\[list.size()\]);

在这个例子中，传入了一个类型和大小都符合要求的数组给toArray方法，这是符合规范的做法。

反例（违反规范）:

List list = new ArrayList<>();

list.add("apple");

list.add("banana");

// 使用无参toArray()方法

Object\[\] array = list.toArray();

// 或使用大小不符合list.size()的数组

String\[\] smallerArray = list.toArray(new String\[0\]);

在这两个反例中，第一个示例使用了无参的toArray()方法，返回了一个Object\[\]类型的数组，这不是类型安全的。第二个示例虽然使用了toArray(T\[\] array)方法，但传入的数组大小不是list.size()，这可能导致额外的数组分配和复制，降低了效率。

遵循这条规范，通过使用toArray(T\[\] array)方法并传入一个大小为list.size()的类型匹配数组，可以在类型安全的同时提高性能。

2.使用工具类Arrays.asList()把数组转换成集合时，不能使用其修改集合相关的方法，它的add/remove/clear方法会抛出UnsupportedOperationException异常

深因：

避免运行时异常：Arrays.asList()返回的是一个固定大小的列表，它基于原数组，仅支持那些不会改变数组大小的操作。尝试执行add、remove或clear等修改操作会抛出UnsupportedOperationException。避免使用这些操作可以防止运行时异常。

提醒开发者注意返回类型限制：明确这一规范可以提醒开发者，通过Arrays.asList()获得的列表在功能上与ArrayList等完全实现了List接口的集合类有所不同，需要谨慎处理。

促进正确的集合操作使用：引导开发者在需要进行元素增删的场景中，选择更合适的集合类型，如直接使用ArrayList等，或者在需要对Arrays.asList()返回的列表进行修改操作时，先将其转换为一个支持所有List操作的新列表。

正例（遵循规范）:

String\[\] array = {"apple", "banana", "cherry"};

List list = new ArrayList<>(Arrays.asList(array));

// 修改集合

list.add("date");

list.remove("banana");

在这个例子中，通过将Arrays.asList()的结果放入一个新的ArrayList中，我们可以自由地对返回的集合进行修改。

反例（违反规范）:

String\[\] array = {"apple", "banana", "cherry"};

List list = Arrays.asList(array);

// 尝试修改集合

list.add("date"); // 抛出UnsupportedOperationException

list.remove("banana"); // 抛出UnsupportedOperationException

在这个反例中，直接使用Arrays.asList()返回的列表进行修改操作，将会导致UnsupportedOperationException异常。

遵循这条规范，可以避免在运行时因尝试修改不支持修改操作的集合而产生异常，确保代码的健壮性。

3.ArrayList的subList结果不可强转成ArrayList，否则会抛出ClassCastException异常

深因：

类型不兼容：ArrayList的subList方法返回的是java.util.List接口的一个视图，而不是ArrayList实例。这个视图是内部类（如ArrayList$SubList），并不是ArrayList类本身。因此，尝试将其强制转换为ArrayList会因类型不匹配而抛出ClassCastException。

保持视图的动态性：subList返回的列表视图提供了对原列表的部分视图，对这个视图的所有操作都会反映在原列表上（反之亦然）。这种设计意味着视图与原列表紧密相连，而直接转换为ArrayList不仅不可能，也会误导开发者忽视subList与原列表的动态关系。

促进正确的API使用：明确这一规范可以鼓励开发者使用正确的类型和方法来处理集合和子集合，避免不必要的类型转换错误，提高代码质量和可维护性。

正例（遵循规范）:

ArrayList list = new ArrayList<>(Arrays.asList("apple", "banana", "cherry", "date"));

List subList = list.subList(1, 3);

// 正确使用subList结果

System.out.println(subList);

在这个例子中，subList的结果被正确地处理为List类型，没有进行不当的类型转换。

反例（违反规范）:

ArrayList list = new ArrayList<>(Arrays.asList("apple", "banana", "cherry", "date"));

// 尝试将subList结果强转为ArrayList

ArrayList subList = (ArrayList)list.subList(1, 3); // 抛出ClassCastException

在这个反例中，尝试将subList的结果强制转换为ArrayList类型，这将导致ClassCastException异常。

遵循这条规范，可以避免不必要的类型转换异常，更加准确地使用Java集合框架提供的API，提高代码的健壮性和可读性。

4.在subList场景中，高度注意对原列表的修改，会导致子列表的遍历、增加、删除均产生ConcurrentModificationException异常

深因：

维护一致性：subList方法返回的子列表是原列表的一个视图，这意味着对原列表或子列表的任何修改都会反映在另一方。如果在遍历子列表的同时修改原列表，将破坏列表的结构，因此为了维护操作的一致性和预期行为，Java会抛出ConcurrentModificationException。

防止不可预见的行为：在对原列表进行修改后继续操作子列表可能会导致不可预见的行为，因为子列表的内容、大小和预期操作结果可能已经由于原列表的修改而发生变化。

提升代码稳定性和可靠性：通过避免在子列表操作过程中修改原列表，可以防止运行时异常，从而提高代码的稳定性和可靠性。

正例（遵循规范）:

ArrayList list = new ArrayList<>(Arrays.asList("apple", "banana", "cherry", "date"));

List subList = list.subList(1, 3);

// 在操作子列表之前不修改原列表

subList.remove("banana"); // 安全操作

System.out.println(list); // 输出修改后的原列表和子列表

在这个例子中，在对子列表操作之前没有对原列表进行修改，遵循了规范。

反例（违反规范）:

ArrayList list = new ArrayList<>(Arrays.asList("apple", "banana", "cherry", "date"));

List subList = list.subList(1, 3);

// 在遍历子列表时修改原列表

list.add("fig"); // 修改原列表

subList.get(0); // 尝试访问子列表，可能抛出ConcurrentModificationException

在这个反例中，修改原列表后尝试访问子列表，这种操作违反了规范，因为它可能导致ConcurrentModificationException异常。

遵循这条规范，可以避免因为列表的并发修改而导致的异常，保证代码的稳定性和预期行为。

5.不要在foreach循环里进行元素的remove/add操作，remove元素请使用Iterator方式

深因：

避免ConcurrentModificationException异常：在foreach循环中对集合进行修改（如添加或删除元素）会导致快速失败（fail-fast）机制触发，抛出ConcurrentModificationException。这是因为foreach循环基于集合的Iterator，而直接修改集合会导致迭代器的状态与集合的状态不一致。

保持代码的稳定性和可预测性：使用迭代器的remove方法可以安全地在遍历过程中删除元素，因为它会正确地更新迭代器的状态，避免异常发生，从而保持代码的稳定性和可预测性。

提高代码可读性和维护性：遵循此规范有助于提高代码的可读性和维护性，因为使用迭代器进行元素的删除是一种更明确和安全的方式，其他开发者能够更容易理解代码的意图。

正例（遵循规范）:

List list = new ArrayList<>(Arrays.asList("apple", "banana", "cherry"));

Iterator iterator = list.iterator();

while (iterator.hasNext()) {

String fruit = iterator.next();

if ("banana".equals(fruit)) {

iterator.remove(); // 使用Iterator的remove方法安全删除元素

}

}

System.out.println(list); // 输出: \[apple, cherry\]

在这个例子中，通过使用Iterator的remove方法安全地在遍历过程中删除元素，遵循了规范。

反例（违反规范）:

List list = new ArrayList<>(Arrays.asList("apple", "banana", "cherry"));

for (String fruit : list) {

if ("banana".equals(fruit)) {

list.remove(fruit);

}

}

在这个反例中，尝试在foreach循环中直接从集合中删除元素，这违反了规范，因为这样做可能会导致ConcurrentModificationException异常。

遵循这条规范，可以避免在遍历集合时因修改集合而导致的异常，保证代码执行的稳定性和安全性。

6.集合初始化时，指定集合初始值大小

深因：

提高性能：指定集合初始值大小可以减少在添加元素时动态扩容的次数，从而减少内存分配和复制旧数组到新数组的开销，特别是在我们预先知道将要存储多少元素时。

减少内存浪费：通过精确或接近精确指定初始容量，可以避免分配比实际需要更多的内存空间，从而减少内存浪费。

提升代码的可读性和意图明确性：在初始化时指定集合大小，可以让后来的代码维护者更清楚地了解开发者的意图，即对集合大小的预期。

正例（遵循规范）:

// 假设我们已知需要存储5个元素

List list = new ArrayList<>(5);

在这个例子中，我们预先知道列表将存储5个元素，因此在初始化时指定了初始容量为5。这样可以减少动态扩容的次数。

反例（违反规范）:

// 未指定初始值大小

List list = new ArrayList<>();

// 假设后续代码中添加了大量元素

for (int i = 0; i < 1000; i++) {

list.add("element" + i);

}

在这个反例中，初始化时没有指定集合的初始大小。如果后续代码需要添加大量元素，这将导致多次动态数组扩容，从而影响性能。

遵循这条规范，可以帮助提高集合操作的性能，减少内存浪费，同时使代码更加清晰和高效。

不行了，不行了太水了，我装不下去了哈哈，搞点容易被忽略但又确实很重要的规范来讲吧😀

### 大杂烩

1.禁止使用构造方法BigDecimal(double)的方式把double值转化为BigDecimal对象

做过对数字敏感业务的大佬们应该对这个不陌生吧，尤其是做过财务的大佬，想必体验会更深刻，计算值不对，看代码没问题，但是最终结果就是不对，直到你发现精度丢失😃

深因：

精度问题：直接使用 BigDecimal(double) 构造方法可能会导致精度不准确。double 类型的值在转换为 BigDecimal 对象时，可能无法精确表示原始 double 值，因为 double 是一个浮点类型，其表示方式和精度与 BigDecimal 的不同。

可预测性：使用 String 参数或 BigDecimal.valueOf(double) 方法创建 BigDecimal 对象可以避免因浮点表示导致的预料之外的精度问题，使结果更加可预测。

避免隐藏的bug：不精确的转换可能在数值处理中引入难以发现的错误，特别是在财务计算或需要高精度的场景中，这些错误可能导致严重后果。

正例（遵循规范）:

BigDecimal correct = new BigDecimal("0.1");

// 或者

BigDecimal alsoCorrect = BigDecimal.valueOf(0.1);

这两种方式都能准确地表示 0.1，而不会引入由 double 类型的精度问题导致的误差。

反例（违反规范）:

BigDecimal problematic = new BigDecimal(0.1);

这种方式使用 double 构造方法创建 BigDecimal 实例，可能无法精确表示 0.1，因为 0.1 在 double 类型中是一个近似值。

遵循这条规范，可以确保使用 BigDecimal 时的精度和可预测性，避免在财务计算和需要高度精确的应用中引入隐蔽的错误。

2.避免采用取反逻辑运算符，'!'运算符不利于快速理解

这个规则看起来没什么特别深奥的，但是确实是容易被大家忽略的，在下就曾经踩过此雷，注释和逻辑中的！用的都是非常规的反向注释和逻辑，结果导致理解起来容易出错，甚至在下看见过一个if里边包了很多个判断条件，各种小括号，而且都是用的反向！逻辑，搞得一点也看不懂，真是耗时又耗力，而且极其容易出错

深因：

提高代码可读性：避免使用取反逻辑运算符 '!' 可以使代码逻辑更直观，更易于理解。对于一些人来说，直接处理肯定的情况比处理否定的情况更为直接和易懂。

减少理解错误：在复杂的逻辑表达式中，使用 '!' 可能会增加理解和解析表达式所需的认知负担，尤其是在多重否定（如 !!）或者是在多个逻辑运算混合使用时。

避免逻辑错误：简化逻辑表达式有助于减少逻辑错误的发生，特别是在进行条件判断时，直接的条件判断比间接的取反判断更不容易出错。

正例（遵循规范）:

if (isAvailable) {

// 执行操作

}

在这个例子中，直接检查条件是否满足，而不是它的否定形式，这使得逻辑更直接、更清晰。

反例（违反规范）:

if (!isUnavailable) {

// 执行操作

}

这个例子使用了取反逻辑运算符 '!' 来检查条件，这要求阅读代码的人需要进行双重否定的逻辑推理，增加了理解代码的难度。

遵循这条规范有助于提高代码的可读性和直观性，减少因逻辑理解错误而引入的bug，特别是在条件判断复杂或多重逻辑运算时尤为重要。

3.Mybatis自带的queryForList(String statementName,int start,int size)不推荐使用

深因：

性能问题：queryForList(String statementName, int start, int size) 方法在处理分页时，会先查询出所有符合条件的记录，然后在返回结果列表中根据 start 和 size 参数返回子列表。这意味着，如果数据量很大，即使只需要很少的数据，也会先加载全部数据到内存中，这将导致严重的性能问题。

资源浪费：由于该方法首先加载所有数据到内存，对于数据库和应用服务器来说，这无疑增加了额外的负担，可能导致内存溢出或响应时间变长，影响用户体验。

现代替代方案：随着MyBatis版本的更新，更推荐使用分页插件来进行分页查询。这些方法更加高效，因为它们能够直接在数据库层面上限制查询的范围，避免不必要的数据加载和处理。

正例（遵循规范）:

使用插件进行分页查询：

PageHelper.startPage(pageNum, pageSize);

List list = sqlSession.selectList("statementName");

反例（违反规范）:

int start = 0; // 开始的记录索引

int size = 10; // 需要获取的记录数量

List list = sqlSession.queryForList("statementName", start, size);

在这个反例中，使用了不推荐的 queryForList(String statementName, int start, int size) 方法进行分页查询，可能会导致性能问题和资源浪费。

遵循这条规范，可以提高应用的性能和资源使用效率，同时也是向现代化MyBatis使用方式迈进的一步。

4.线程池不允许使用Executors去创建，而是通过ThreadPoolExecutor的方式，这样的处理方式让写的人员更加明确线程池的运行规则，规避资源耗尽的风险

深因：

明确线程池参数：通过直接使用 ThreadPoolExecutor 构造方法创建线程池，可以让开发者明确指定线程池的核心参数，如核心线程数、最大线程数、存活时间、工作队列等，这有助于开发者深入理解线程池的工作原理和性能特性。

避免资源耗尽：使用 Executors 类的静态方法创建线程池（如 Executors.newCachedThreadPool() 和 Executors.newFixedThreadPool()）时，可能会由于不恰当的配置导致资源耗尽。例如，newCachedThreadPool 默认允许创建的线程数量几乎是无限的，这可能会导致大量线程同时运行，从而耗尽系统资源。

增强可维护性：明确线程池的配置参数，有助于后期维护和调优，因为这些参数直接影响到线程池的性能和系统资源的使用。

正例（遵循规范）:

int corePoolSize = 10;

int maximumPoolSize = 100;

long keepAliveTime = 1L;

TimeUnit unit = TimeUnit.MINUTES;

BlockingQueue workQueue = new LinkedBlockingQueue<>(100);

ThreadPoolExecutor executor = new ThreadPoolExecutor(

corePoolSize,

maximumPoolSize,

keepAliveTime,

unit,

workQueue

);

在这个例子中，通过 ThreadPoolExecutor 直接构造线程池，所有重要的参数都被明确指定，更加透明和可控。

反例（违反规范）:

ExecutorService executor = Executors.newFixedThreadPool(100);

// 或者

ExecutorService executor = Executors.newCachedThreadPool();

这两个反例虽然可以快速方便地创建线程池，但隐藏了线程池的具体实现细节和参数配置，可能会因为不合理的默认配置导致性能问题或资源耗尽。

遵循这条规范，可以提升线程池的使用效率和安全性，减少因线程池不当使用导致的系统资源问题。

5.多线程并行处理定时任务时，Timer运行多个TimeTask时，只要其中之一没有捕获抛出的异常，其它任务便会自动终止运行，使用ScheduledExecutorService则没有这个问题

深因：

增强的健壮性：使用 ScheduledExecutorService 相比于 Timer，其能够确保即使某个定时任务因异常终止，其他任务仍然可以继续运行。这是因为 ScheduledExecutorService 内部对任务的调度是相互独立的。

更灵活的错误处理：ScheduledExecutorService 允许开发者对每个任务的执行进行更细粒度的控制，包括异常处理。这样，开发者可以针对特定的异常情况实施相应的处理策略，而不是让一个未捕获的异常影响到整个定时任务的执行。

更丰富的功能：ScheduledExecutorService 提供了比 Timer 更为丰富和灵活的调度功能，包括但不限于支持多线程并行执行任务、支持任务的周期性执行以及延迟执行等。

正例（遵循规范）:

```scss
ScheduledExecutorService executor = Executors.newScheduledThreadPool(5);
    executor.scheduleAtFixedRate(() -> {
    // 安全执行的任务1
    }, 0, 10, TimeUnit.SECONDS);
        executor.scheduleAtFixedRate(() -> {
        // 安全执行的任务2
        // 即使这里发生异常，不会影响任务1的执行
        }, 0, 10, TimeUnit.SECONDS);
```

在这个例子中，使用 ScheduledExecutorService 创建了一个包含5个线程的线程池，并安排了两个任务定期执行。每个任务的执行是独立的，一个任务的失败不会影响到另一个。

反例（违反规范）:

```typescript
Timer timer = new Timer();
    timer.schedule(new TimerTask() {
    @Override
        public void run() {
        // 任务1
    }
    }, 0, 10000);
        timer.schedule(new TimerTask() {
        @Override
            public void run() {
            // 任务2，如果这里抛出未捕获的异常，其他任务也会停止执行
        }
        }, 0, 10000);
```

在这个反例中，使用 Timer 安排了两个定时任务。如果任务2抛出了未捕获的异常，将会导致整个 Timer 的执行线程终止，从而导致任务1也会停止执行。

遵循这条规范，可以提高多线程并行处理定时任务的健壮性和可靠性，避免单个任务失败导致整个定时任务系统的崩溃。

6.必须回收自定义的ThreadLocal变量，尤其在线程池场景下，线程经常会被复用，如果不清理自定义的 ThreadLocal变量，可能会影响后续业务逻辑和造成内存泄露等问题

深因：

防止内存泄露：ThreadLocal 变量存储在每个 Thread 的一个 ThreadLocalMap 中，如果不手动清理，即使外部引用被回收，ThreadLocal 变量仍然可能长时间存活在 Thread 中，导致内存泄露，尤其是在使用线程池时，线程是被复用的，这种情况更为严重。

保证数据隔离性：在线程池场景下，线程被复用，如果不清理 ThreadLocal，可能会导致一些敏感数据被后续执行的任务访问到，这违反了数据隔离的原则，可能影响业务逻辑的正确性。

提高系统稳定性：及时清理 ThreadLocal 变量，可以避免不必要的资源占用和潜在的内存泄露问题，从而提高系统的稳定性和性能。

正例（遵循规范）:

public class ExampleThreadLocal {

private static final ThreadLocal myThreadLocal = new ThreadLocal<>();

public void doSomething() {

try {

myThreadLocal.set(new Object()); // 使用 ThreadLocal

// 业务逻辑

} finally {

myThreadLocal.remove(); // 在 finally 块中清理 ThreadLocal

}

}

}

在这个例子中，myThreadLocal 在使用完毕后，通过 finally 块确保了其被清理，这样即使在使用线程池的情况下，也不会有内存泄露或数据污染的风险。

反例（违反规范）:

public class ExampleThreadLocal {

private static final ThreadLocal myThreadLocal = new ThreadLocal<>();

public void doSomething() {

myThreadLocal.set(new Object()); // 使用 ThreadLocal 但没有清理

// 业务逻辑，缺少清理操作

}

}

在这个反例中，myThreadLocal 被设置了值，但在方法结束时没有被清理。这在单次使用 Thread 的场景中可能看起来没什么问题，但如果在线程池场景下，这个 Thread 可能被重复利用，会导致内存泄露和数据污染。

遵循这条规范，可以有效避免使用 ThreadLocal 变量时的内存泄露问题，并保持数据的隔离性，提升系统的稳定性和安全性。

四、总结
----

在遥远的Java王国中，住着一群热爱代码的居民。他们日以继夜地编写代码，希望能创造出令人惊叹的软件奇迹。然而，并非所有代码都能成为传说中的英雄。为什么呢？因为，在这片繁荣的土地上，有一个被忽视的古老法典——Java基本编码规范。

有人可能会问：“为什么我们需要编码规范？难道让代码能跑就不够好吗？”哦，亲爱的朋友，这就好比问为什么超级英雄要穿紧身衣一样。答案很简单——为了让一切看起来更加整洁、有序，以及……好吧，主要是为了看起来酷炫。

编码规范的重要性不仅仅在于它让代码看起来像是由单一神秘编程大师在一夜之间完成的，而且它还帮助我们避免了许多潜在的灾难。比如，一个没有遵循规范的代码库，就像是一个没有交通规则的城市，处处是事故现场，每个人都自行其是，结果只能是混乱一片。

回想下我们之前由于编码问题几个教训：有生产事故的，有遇到问题难以排查的等等。

命名规范：想象一下，如果你的同事把所有的变量都命名为 a1，a2，b1……这不是在写代码，这简直是在玩一场“猜猜我是谁”的游戏！

缩进和格式化：没有一致的缩进和格式化，阅读代码就像是在解读古埃及象形文字。每个人都觉得自己是对的，但最后只能靠猜。

避免使用ThreadLocal未清理：这就像是你的室友用过浴室后不打扫——一次两次还好，时间长了，你会发现自己生活在一个生物危机现场。

因此，亲爱的Java居民们，让我们一起遵守这些神圣的编码准则吧。就像穿上了超级英雄的紧身衣，让我们的代码更加健壮、优雅，并且……当然，更加酷炫！

记住，好的编码规范不仅能让你的代码“活”得更久，还能让后来者在阅读你的代码时，不至于想要穿越时空来找你算账。最后，让我们共勉之——在代码的世界里，每一个规范的遵守，都是向着成为编程界超级英雄迈出的一步。