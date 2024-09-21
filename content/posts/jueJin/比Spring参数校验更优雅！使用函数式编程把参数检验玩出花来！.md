---
author: "桦说编程"
title: "比Spring参数校验更优雅！使用函数式编程把参数检验玩出花来！"
date: 2024-09-21
description: "Spring支持的BeanValidation学习成本高，使用了反射等复杂技术。相反，使用使用函数式思想实现参数校验，使得验证逻辑更加简洁、灵活，"
tags: ["后端","Java","函数式编程"]
ShowReadingTime: "阅读4分钟"
weight: 59
---
比Spring参数校验更优雅！使用函数式编程把参数检验玩出花来！
================================

未经允许禁止转载！

使用 Vavr 验证库来替代标准的 Java Bean Validation（如 `@NotBlank`, `@Size` 等注解）可以通过函数式的方式来处理验证逻辑。Vavr 是一个支持不可变数据结构和函数式编程的库，可以让代码更加简洁和函数式。

要使用 Vavr 的验证器，我们可以利用 Vavr 下`Validation` 类，它提供了一种函数式的方式来处理验证，允许收集多个错误，而不仅仅是遇到第一个错误就终止。

1\. BeanValidator 实现的问题
-----------------------

以下是使用BeanValidator实现参数校验的[代码](https://juejin.cn/post/7295540969407250441?searchId=202409201701118695F8D1C383C27EC14B "https://juejin.cn/post/7295540969407250441?searchId=202409201701118695F8D1C383C27EC14B")：

java

复制代码

`@Data public class User {   // bean validator 使用注解实现参数校验   @NotBlank(message = "用户姓名不能为空")   private String name;   @NotBlank(message = "密码不能为空")   @Size(min = 6, message = "密码长度不能少于6位")   private String password;   @Min(value = 0, message = "年龄不能小于0岁")   @Max(value = 150, message = "年龄不应超过150岁")   private Integer age;      @Pattern(regexp = "^((13[0-9])|(15[^4])|(18[0-9])|(17[0-9])|(147))\d{8}$", message = "手机号格式不正确")   private String phone; }`

Spring 提供了对 BeanValidator 的支持，可以在不同的层级（controller、service、repository）使用。

缺点：

1.  要求被验证的对象是可变的 JavaBean（具有getter，setter方法），JavaBean是一种常见的反模式。
2.  校验逻辑的复杂应用有很大的学习成本，比如自定义验证注解、分组校验等。
3.  异常处理逻辑一般需要配合Spring全局异常处理。

最佳实践：

PlanA: 实践中建议仅在 controller 层面校验前端传入的 json 参数，不使用自定义注解，分组校验等复杂功能。

PlanB: 直接使用函数式验证。

2\. 使用 Vavr 重新设计 `User` 类的验证逻辑
------------------------------

### 2.1 使用到的函数式思想：

1.  校验结果视为值，返回结果为和类型，即异常结果或正常结果。这里的异常结果指的是校验失败的参数列表，正常结果指的是新创建的对象。
2.  复用函数，这里具体指校验逻辑和构造器方法（或者静态方法创建对象）
3.  Applicative functor，本文不想讨论难以理解的函数式概念。这里可以简单理解成封装函数、同时支持 apply（map）的容器。
4.  收集所有校验异常结果，此处的处理和提前返回（卫模式、短路操作）不同。

以下是使用 Vavr 中参数校验的代码：

java

复制代码

`PersonValidator personValidator = new PersonValidator(); // Valid(Person(John Doe, 30)) Validation<Seq<String>, Person> valid = personValidator.validatePerson("John Doe", 30); // Invalid(List(Name contains invalid characters: '!4?', Age must be greater than 0)) Validation<Seq<String>, Person> invalid = personValidator.validatePerson("John? Doe!4", -1);`

首先，需要定义一个验证器类，而不是直接在 `User` 类上使用注解。这个验证器类会对 `User` 的字段进行验证，并返回一个 `Validation` 对象。

### 2.2 验证器实现

java

复制代码

`// 使用实体类，这个类是无状态的 public class UserValidator {     // 验证用户     public Validation<Seq<String>, User> validateUser(String name, String password, Integer age, String phone) {         return Validation.combine(                 validateName(name),                 validatePassword(password),                 validateAge(age),                 validatePhone(phone))           .ap(User::new);     }     // 验证用户名     private Validation<String, String> validateName(String name) {         return (name == null || name.trim().isEmpty())                 ? Invalid("用户姓名不能为空")                 : Valid(name);     }     // 验证密码     private Validation<String, String> validatePassword(String password) {         if (password == null || password.isEmpty()) {             return Invalid("密码不能为空");         }         if (password.length() < 6) {             return Invalid("密码长度不能少于6位");         }         return Valid(password);     }     // 验证年龄     private Validation<String, Integer> validateAge(Integer age) {         if (age == null) {             return Invalid("年龄不能为空");         }         if (age < 0) {             return Invalid("年龄不能小于0岁");         }         if (age > 150) {             return Invalid("年龄不应超过150岁");         }         return Valid(age);     }     // 验证手机号     private Validation<String, String> validatePhone(String phone) {         String phoneRegex = "^((13[0-9])|(15[^4])|(18[0-9])|(17[0-9])|(147))\\d{8}$";         if (phone == null || !phone.matches(phoneRegex)) {             return Invalid("手机号格式不正确");         }         return Valid(phone);     } }`

### 2.3 使用

java

复制代码

`public class UserValidationExample {     public static void main(String[] args) {         UserValidator validator = new UserValidator();         // 示例：测试一个有效用户         Validation<Seq<String>, User> validUser = validator.validateUser("Alice", "password123", 25, "13912345678");         if (validUser.isValid()) {             System.out.println("Valid user: " + validUser.get());         } else {             System.out.println("Validation errors: " + validUser.getError());         }         // 示例：测试一个无效用户         Validation<Seq<String>, User> invalidUser = validator.validateUser("", "123", -5, "12345");         if (invalidUser.isValid()) {             System.out.println("Valid user: " + invalidUser.get());         } else {             System.out.println("Validation errors: " + invalidUser.getError());         }     } }`

1.  **`Validation.combine()`**：将多个验证结果组合起来。每个验证返回的是 `Validation<String, T>`，其中 `String` 是错误消息，`T` 是验证成功时的值。
    
2.  **`User::new`**：这是一个方法引用，表示如果所有的字段都验证成功，就调用 `User` 的构造函数创建一个新的 `User` 对象。
    
3.  **验证错误的收集**：Vavr 的验证机制允许收集多个错误，而不是像传统 Java Bean Validation 那样一旦遇到错误就停止。这样，你可以返回所有的验证错误，让用户一次性修复。
    

### 2.4 结果示例

1.  对于一个有效的用户：
    
    bash
    
    复制代码
    
    `Valid user: User(name=Alice, password=password123, age=25, phone=13912345678)`
    
2.  对于一个无效的用户：
    
    bash
    
    复制代码
    
    `Validation errors: List(用户姓名不能为空, 密码长度不能少于6位, 年龄不能小于0岁, 手机号格式不正确)`
    

3\. 源码解析
--------

如果你仅关注使用的话，此段内容可以跳过。

此处仅分析其核心代码：

java

复制代码

`// Validation#combine 返回 Builder 类型 final class Builder<E, T1, T2> {     private Validation<E, T1> v1;     private Validation<E, T2> v2;     public <R> Validation<Seq<E>, R> ap(Function2<T1, T2, R> f) {  				// 注意这里的执行顺序: v1#ap -> v2#ap         return v2.ap(v1.ap(Validation.valid(f.curried())));     } }`

`f.curried` 返回结果为 T1 => T2 => R，valid 方法使用 Validation 容器封装了函数：

csharp

复制代码

`// validation 为和类型，有且仅有两种实现 public interface Validation<E, T> extends Value<T>, Serializable {   static <E, T> Validation<E, T> valid(T value) {       return new Valid<>(value);   }   static <E, T> Validation<E, T> invalid(E error) {       Objects.requireNonNull(error, "error is null");       return new Invalid<>(error);   } }`

最关键的代码为 ap（apply的缩写）：

java

复制代码

`default <U> Validation<Seq<E>, U> ap(Validation<Seq<E>, ? extends Function<? super T, ? extends U>> validation) {     Objects.requireNonNull(validation, "validation is null");     if (isValid()) {         if (validation.isValid()) {           	// 正常处理逻辑             final Function<? super T, ? extends U> f = validation.get();             final U u = f.apply(this.get());             return valid(u);         } else {           	// 保留原有的失败结果             final Seq<E> errors = validation.getError();             return invalid(errors);         }     } else {         if (validation.isValid()) {           	// 初始化失败结果             final E error = this.getError();             return invalid(List.of(error));         } else {           	// 校验失败，收集失败结果             final Seq<E> errors = validation.getError();             final E error = this.getError();             return invalid(errors.append(error));         }     } }`

这里的实现非常巧妙，柯里化的函数在正常处理逻辑中不断执行，最后调用成功，返回正确的函数结果。执行流程中有异常结果后，分成三中情况进行处理，分别是初始化，保留结果，进一步收集结果。

4\. 总结与最佳实践
-----------

1.  这种方式使用 Vavr 提供的函数式验证工具，使得验证逻辑更加简洁、灵活，并且可以收集多个错误进行统一处理，避免散弹枪问题。
    
2.  对于需要返回单一错误的情况（实际上不多），也可以使用这种方法，然后取用任意一条结果。
    
3.  Validation支持多条无关参数的校验。当涉及到多参数的校验时，建议进行手动编码。
    

java

复制代码

`record Person(name, age) {} static final String ADULT_CONTENT = "adult"; static final int ADULT_AGE = 18; public Validation<Seq<String>, Person> validatePerson2(String name, int age) {     return Validation.combine(validateName(name), validateAge(age)).ap(Person::new)         .flatMap(this::validateAdult); } private Validation<Seq<String>, Person> validateAdult(Person p) {     return p.age < ADULT_AGE && p.name.contains(ADULT_CONTENT)         ? Validation.invalid(API.List("Illegal name"))         : Validation.valid(p); }`

此外，对于某些参数传参，建议使用对象组合，比如range参数有两种做法，第一种可以传入 from, to, 校验条件为 from < to, 校验后对象包含属性Range，之后在额外校验中校验 Range；第二种可以限制传入参数为 Range。