---
author: "翼飞"
title: "SpringBoot优雅实现邮箱验证码功能：最佳实践与关键细节解析"
date: 2024-09-01
description: "在实现邮箱验证码功能时，表面上只是发送一封带有验证码的邮件，但实际上背后需要处理的细节远不止于此。本文将详细探讨如何利用SpringEmail、Freemarker和Redis来实现一个高效的邮箱验"
tags: ["SpringBoot","FreeMarker","后端"]
ShowReadingTime: "阅读10分钟"
weight: 957
---
一、简介
----

在实现邮箱验证码功能时，虽然表面上看只是发送一封带有验证码的邮件，但实际上背后涉及的**细节远不止于此**。本文将详细探讨如何利用**Spring Email**、**Freemarker**和**Redis**来构建一个高效的邮箱验证码系统。我们将深入分析**验证码的时效管理**，探讨为什么使用Redis的ZSet集合来存储验证码是更优的选择。同时，介绍如何通过**异步操作**来优化用户体验，确保邮件发送和验证码存储能够高效、可靠地完成,以及如何对**接口进行限流**。最后，我们将展示一个完整的实现示例，帮助你全面掌握这一关键功能的开发。

二、验证码时效管理
---------

有些平台在发送验证码时，会提示验证码在几分钟内有效，但当我因为网络问题多次收到几封邮件时，往往只有最后一封邮件的验证码是有效的，这波属实是搞不懂了。

在讨论验证码时效管理时，传统的 Key-Value 存储方式确实容易引发一些问题。因为当一个邮箱多次请求验证码时，新生成的验证码会覆盖旧的验证码，从而导致前面收到的验证码变得无效。这违背了“验证码在几分钟内有效”的承诺，给用户带来了不好的体验。

为了优化用户体验，我们可以考虑使用集合（Set 或 ZSet）来存储验证码信息，从而解决这个问题。以下为不同存储方式的介绍:

#### Key-Value 存储方式

在最简单的 Key-Value 方式中，每个邮箱只与一个验证码对应。当新的验证码生成时，旧的验证码会被覆盖：

Key

Value

过期时间

 [email@example.com](https://link.juejin.cn?target=mailto%3Aemail%40example.com "mailto:email@example.com") 

code

60s

这种方式的问题在于，旧的验证码会被覆盖，用户只能使用最新的验证码，尽管之前收到的验证码可能也在有效期内。

#### 使用Set集合存储方式

我们可以使用 Set 集合存储多次请求生成的验证码：

Key

Set

过期时间

 [email@example.com](https://link.juejin.cn?target=mailto%3Aemail%40example.com "mailto:email@example.com") 

{code1, code2}

60s

这种方式虽然可以存储多个验证码，但它并不能记录每个验证码的生成时间。因此，过期管理变得复杂：所有验证码只能一起过期，无法单独控制每个验证码的有效期。

#### **使用ZSet进行存储**

ZSet（有序集合）提供了一种更灵活的方式来管理验证码。我们可以将验证码和它的生成时间一起存储到 ZSet 中：

Key

ZSet

过期时间

 [email@example.com](https://link.juejin.cn?target=mailto%3Aemail%40example.com "mailto:email@example.com") 

\[{code1, timestamp1}, {code2, timestamp2}\]

60s

通过 ZSet 的方式，我们不仅可以存储多个验证码，还可以根据时间戳对它们进行排序，并精准控制每个验证码的有效期。当用户请求验证时，我们可以判断哪个验证码在有效期内，从而避免无效验证码的困扰。

#### 方案选择

最终选择使用Redis中Zset进行存储，说说区别:

*   **Set**：只存储数据的唯一性，无序排列。适用于不需要记录顺序的场景，但在验证码管理中，由于无法跟踪验证码生成时间，使用 Set 并不理想。
*   **ZSet**：不仅存储数据，还将每个数据与一个分数（如时间戳）关联，数据按分数排序。这样可以实现对验证码的有效期管理，确保每个验证码在独立的时间段内有效，用户体验更佳。

三、异步操作优化
--------

#### 异步操作的两个关键点

1.  **发送验证码作为异步操作**：发送验证码通常涉及网络请求或外部服务调用，这类操作可能会有一定的延迟。如果同步执行，可能会阻塞主线程，影响用户体验。因此，将发送验证码的操作异步化，可以提高系统的响应速度和整体性能。
2.  **存储验证码到 Redis 作为后续操作**：只有在验证码成功发送之后，才需要将验证码存储到 Redis 中。这样可以避免在发送验证码失败时，仍然保存无效的验证码数据。这种操作顺序的合理性，确保了数据的一致性和操作的准确性。

#### 为什么使用 `CompletableFuture`

在没有引入消息队列（MQ）的情况下，`CompletableFuture` 提供了一个简洁而强大的异步编程模型。它允许我们定义一系列的异步操作，并且可以灵活地指定操作之间的依赖关系。以下是代码示例：

less

 代码解读

复制代码

`CompletableFuture.runAsync(() -> {     // 发送验证码 }).thenRunAsync(() -> { // 当发送验证码错误的时候，不会执行存储验证码到redis     // 存储验证码到redis  });`

#### 优点总结

*   **非阻塞执行**：使用 `CompletableFuture` 可以将耗时的操作异步执行，避免阻塞主线程，提高系统的吞吐量和响应性。
*   **简化代码逻辑**：异步链式调用让代码结构更加清晰，逻辑顺序更为直观，易于维护。
*   **错误处理更加灵活**：如果发送验证码的操作出现错误，存储验证码的操作将不会执行。`CompletableFuture` 可以轻松地管理依赖操作之间的关系，确保逻辑上的正确性和数据的一致性。

四、发送邮箱验证码限流
-----------

对于邮箱验证码如何限流，可以参考这两篇限流文章，可以对`发送验证码进行60s内防重复提交，每小时、每天发送验证码针对ip限制发送次数`

[Redis如何多规则限流和防重复提交？](https://juejin.cn/post/7401053200948183055 "https://juejin.cn/post/7401053200948183055")

[Redis如何多规则限流和Redis防重复提交 | 重构篇](https://juejin.cn/post/7401053200948183055 "https://juejin.cn/post/7401053200948183055")

五、为什么使用 Freemarker 模版引擎生成邮件内容
-----------------------------

在项目中使用 Freemarker 模版引擎生成邮件内容而不是直接使用常量，主要有以下几个原因：

1.  **统一管理与维护**：通过 Freemarker 模版引擎，可以将所有邮件内容的结构和样式集中在模板文件中进行管理。这样，当邮件的样式或内容需要调整时，只需修改模板文件即可，无需在代码中逐一修改常量。
    
2.  **动态内容生成**：Freemarker 模板引擎支持将动态数据插入到模板中，生成个性化的邮件内容。对于欢迎通知、日志预警、邮箱验证码等场景，可以轻松定制邮件内容，提高灵活性和可维护性。
    
3.  **样式调整方便**：模板引擎允许我们灵活地控制邮件的布局和样式。当需要统一调整邮件样式时，只需修改模板，不必在代码中逐一调整常量定义的内容。
    

六、开始实战
------

> 正式编码会自定义线程池，以及一系列工具类，对于这些辅助操作，请移步到源码查看

### 1\. 引入依赖

xml

 代码解读

复制代码

`<dependency>     <groupId>org.springframework.boot</groupId>     <artifactId>spring-boot-starter-mail</artifactId> </dependency> <dependency>     <groupId>org.springframework.boot</groupId>     <artifactId>spring-boot-starter-freemarker</artifactId> </dependency>`

### 2\. 在配置文件中配置您的邮箱信息

我使用的QQ邮箱，需要在设置中获取到这个授权码

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/45ec4e18904b48f69b4a4ed5ced45b65~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg57-86aOe:q75.awebp?rk3s=f64ab15b&x-expires=1727846936&x-signature=2ghx5ICCxlfD2uUHa%2Fn9fWFxLiU%3D)

yaml

 代码解读

复制代码

`spring:   ## 邮箱配置   mail:     ## 配置邮件服务器的地址     host: smtp.qq.com     ## 配置邮件服务器的端口（465或587）     port: 465     ## 配置邮箱账号     username: ${company.email}     ## 配置邮箱授权码     password: XXX     # 配置默认编码     default-encoding: UTF-8     properties:       mail:         smtp:           socketFactory:             ## SSL 连接配置             class: javax.net.ssl.SSLSocketFactory         ## 是否开启 debug，这样方便开发者查看邮件发送日志         debug: false`

### 3\. 编写 Freemarker 文件

后续采用html发送邮箱验证码，所以 ftl 文件采用html的形式编写

html

 代码解读

复制代码

`<!DOCTYPE html> <html lang="zh-CN"> <head>     <meta charset="UTF-8">     <meta http-equiv="X-UA-Compatible" content="IE=edge">     <meta name="viewport" content="width=device-width, initial-scale=1.0">     <title>邮箱验证码</title>     <style>         body {             font-family: Arial, sans-serif;             background-color: #f7f7f7;             padding: 20px;         }         .container {             max-width: 600px;             margin: 0 auto;             background-color: #fff;             padding: 20px;             border-radius: 5px;             box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);         }         h1 {             color: #333;             text-align: center;         }         p {             color: #666;             font-size: 16px;             line-height: 1.6;         }         .highlight {             color: #007bff;             font-weight: bold;         }         .code-container {             background-color: #f0f0f0;             padding: 10px;             text-align: center;             border-radius: 5px;             margin-top: 10px;         }         .code {             font-size: 24px;             font-weight: bold;             margin: 0;             padding: 5px; /* 添加内边距增加文字间距 */         }         .company-link {             color: #007bff;             text-decoration: none;         }         .footer {             background: linear-gradient(to right, #007bff, #00bfff);             height: 10px;             border-radius: 5px;             margin-top: 20px;         }     </style> </head> <body> <div class="container">     <h1>尊敬的用户，</h1>     <p>您收到来自 <a href="${companyWebsite! 'baidu.com'}" class="company-link">${companyName! '默认公司名'}</a>         的邮件，用于验证您的邮箱地址。</p>     <div class="code-container">         <p class="code">${verifyCode}</p>     </div>     <p>请使用此验证码完成验证过程 ( 有效时间 ${validTime} 分钟 )。</p>     <p>如果您没有请求此验证码，请忽略此邮件。</p>     <p>感谢您的配合，</p>     <p><a href="${companyWebsite! 'baidu.com'}" class="company-link">${companyName! '默认公司名'}</a></p>     <div class="footer"></div> </div> </body> </html>`

### 4\. 发送邮箱验证码 & 校验邮箱验证码

代码注释描述的很详细，这里我简单介绍一下

*   **Freemarker 模板引擎生成包含验证码的邮件内容**

代码中使用了 Freemarker 模板引擎来生成包含验证码的邮件内容。通过构建 `SendCodeFtlDto` 对象，将公司名称、公司官网、验证码等信息传递给 Freemarker 模板 `email_code.ftl`，生成完整的 HTML 邮件内容。这种方式使得邮件内容的维护更加灵活，模板可以根据需求进行修改，而不需要调整代码。

*   **校验 Redis 验证码采用滚动验证**

在校验邮箱验证码时，代码使用了滚动时间窗口的方式，从 Redis 中获取指定时间范围内（例如三分钟）的验证码，并进行验证。如果验证码有效，系统会立即删除该验证码，防止其被重复使用。这种滚动验证机制提高了验证码校验的灵活性和安全性，确保验证码只能在指定时间段内使用。

*   **使用 `CompletableFuture` 实现异步操作**

为了提高性能和响应速度，代码采用了 `CompletableFuture` 实现异步操作。首先异步发送验证码邮件，接着在邮件发送成功后异步将验证码存储到 Redis 中。`CompletableFuture` 的使用使得两个操作可以非阻塞地执行，同时保证了操作的顺序性——只有在邮件发送成功后才会存储验证码，从而提高了系统的可靠性。

java

 代码解读

复制代码

`/**  * 发送邮箱服务实现类  *  * @author YiFei  */ @Slf4j @Service @RequiredArgsConstructor public class EmailServiceImpl implements IEmailService {     // 防止报错     @Resource     private final JavaMailSender javaMailSender;     private final CompanyConfiguration companyConfiguration;     private final TaskExecutor ioIntensiveExecutor;     private final RedisUtil redisUtil;     private final Configuration configuration;     /**      * 使用邮箱发送验证码      *      * @param email 需要送达的邮箱      */     @Override     public void sendEmailCode(String email) {         // TODO 数据库存储到 email_table 里面         // 1. 生成验证码         String code = RandomUtil.randomString(MailConstants.EMAIL_CODE_NUM);         // 2. 构建  sendCodeFtlDto 对象 （用于生成ftl的信息）         SendCodeFtlDto sendCodeFtlDto = SendCodeFtlDto.builder()                 .companyName(companyConfiguration.getName())            // 公司名                 .companyWebsite(companyConfiguration.getWebsite())      // 公司官网                 .validTime(MailConstants.EMAIL_CODE_TIME_OUT)           // 有效时长                 .verifyCode(code).build();         // 3. 通过 CompletableFuture 发送邮箱验证码         CompletableFuture.runAsync(() -> {             try (StringWriter stringWriter = new StringWriter()) {                 // 4. 构建 email_code.ftl 模板                 Template template = configuration.getTemplate(FreemarkerConstants.EMAIL_SEND_CODE_FTL_PATH);                 template.process(sendCodeFtlDto, stringWriter);                 // 5. 发送 email_code.html 文档                 sendEmailWithHtmlContent(email,                         SystemConstants.EMAIL_CODE_TEMPLATE_SUBJECT.formatted(companyConfiguration.getName()),                         stringWriter.toString()                 );             } catch (Exception e) {                 // TODO 数据库存储错误信息到 email_table 里面                 log.error("记录错误日志，案例说应该持久化到数据库", e);                 throw new RuntimeException(e);             }         }, ioIntensiveExecutor).thenRunAsync(() -> {             // 6. 将验证码存储到 redis ( 默认转大写 )             redisUtil.addCacheZSetValue(RedisKeyConstants.EMAIL_CODE_CACHE_PREFIX + email                     , code.toUpperCase(), Instant.now().toEpochMilli(), sendCodeFtlDto.getValidTime(), TimeUnit.MINUTES);         }, ioIntensiveExecutor);     }     /**      * 校验邮箱验证码      *      * @param email     邮箱      * @param emailCode 验证码      * @return 是否校验成功      */     @Override     public boolean checkEmailCode(String email, String emailCode) {         // 1. 获取当前时间         Instant currentTime = Instant.now();         // 2. 减去对应分钟数         Instant adjustedTime = currentTime.minus(Duration.ofMinutes(MailConstants.EMAIL_CODE_TIME_OUT));         // 3. 获取缓存中在3分钟之类的值         String redisEmailCodeKey = RedisKeyConstants.EMAIL_CODE_CACHE_PREFIX + email;         Set<String> cacheZSetByScore = redisUtil.getCacheZSetByScore(                 redisEmailCodeKey,              // redis 中存储key                 adjustedTime.toEpochMilli(),    // 开始时间 (三分钟前)                 currentTime.toEpochMilli(),     // 结束时间 (当前时间)                 0, -1         );         // 4. 校验是否存在该值 ( 默认转大写 )         boolean result = cacheZSetByScore.contains(emailCode.toUpperCase());         if (result) {             // 5. 验证成功 删除 redis 缓存数据防止二次使用             redisUtil.deleteObject(redisEmailCodeKey);         }         return result;     }     /**      * 发送包含 HTML 内容的邮件      *      * @param sendToEmail 收件人邮箱地址      * @param subject     邮件主题      * @param html        HTML 格式的邮件内容      * @throws MessagingException 发送邮件过程中可能抛出的异常      */     private void sendEmailWithHtmlContent(String sendToEmail, String subject, String html) throws MessagingException {         // 创建 MimeMessage 对象         MimeMessage mimeMessage = javaMailSender.createMimeMessage();         // 使用 MimeMessageHelper 对象设置邮件的发送者、接收者、主题和内容         MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);         mimeMessageHelper.setFrom(companyConfiguration.getName() + '<' + companyConfiguration.getEmail() + ">");         mimeMessageHelper.setTo(sendToEmail);         mimeMessageHelper.setSubject(subject);         mimeMessageHelper.setText(html, true);         // 发送邮件         javaMailSender.send(mimeMessage);     } }`

七、演示
----

直接使用服务器部署好的项目进行演示 ( **注:项目有很多有趣的功能，通过邮箱验证码注册后即可体验** )

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/7546a53ebfe947cfad57d3cd7106d54e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg57-86aOe:q75.awebp?rk3s=f64ab15b&x-expires=1727846936&x-signature=mjDOKUtdK9uorE6ERRSYy0CRtSA%3D)

八、源码
----

> [源码地址](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Ffateyifei%2Fyf "https://gitee.com/fateyifei/yf") | [👀 在线演示](https://link.juejin.cn?target=http%3A%2F%2F110.41.173.220%2Fyf-vue-admin%2Flogin "http://110.41.173.220/yf-vue-admin/login") | 觉得不错可以给个start
> 
> 前端源码位置 : [登录页源码](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Ffateyifei%2Fyf%2Fblob%2Fmaster%2Fyf-vue-admin%2Fsrc%2Fviews%2Flogin%2Findex.vue "https://gitee.com/fateyifei/yf/blob/master/yf-vue-admin/src/views/login/index.vue")
> 
> 后端源码位置 : [邮箱服务源码](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Ffateyifei%2Fyf%2Ftree%2Fmaster%2Fyf-boot-admin%2Fyf-integration%2Fyf-message%2Fyf-mail%2Fsrc%2Fmain%2Fjava%2Fcom%2Fyf "https://gitee.com/fateyifei/yf/tree/master/yf-boot-admin/yf-integration/yf-message/yf-mail/src/main/java/com/yf")
> 
> 注意事项 :
> 
> *   1.  平台一人一号，账号可以通过邮箱、第三方平台自动注册。用户名密码方式登录请联系管理员手动添加、手机号不可用。（敏感数据以做信息脱敏）
> *   2.  在线聊天功能（消息已做脏词过滤，群发、系统、AI消息不会被平台记录）
> *   3.  欢迎大家提出意见，欢迎畅聊与项目相关问题