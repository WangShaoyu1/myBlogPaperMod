---
author: "京东云开发者"
title: "一站式统一返回值封装、异常处理、异常错误码解决方案—最强的Sping Boot接口优雅响应处理器"
date: 2024-08-21
description: "1. 前言 统一返回值封装、统一异常处理和异常错误码体系的意义在于提高代码的可维护性和可读性，使得代码更加健壮和稳定。统一返回值封装可以避免每一个接口都需要手工拼装响应报文；统一异常处理可以将异常处理"
tags: ["后端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读12分钟"
weight: 1
selfDefined:"likes:14,comments:0,collects:26,views:543,"
---
1\. 前言
======

统一返回值封装、统一异常处理和异常错误码体系的意义在于提高代码的可维护性和可读性，使得代码更加健壮和稳定。统一返回值封装可以避免每一个接口都需要手工拼装响应报文；统一异常处理可以将异常处理的逻辑集中到一个地方，避免代码中出现大量的try-catch语句，降低了代码的复杂度，提高了代码的可读性；异常体系的设计可以清晰地区分不同类型的异常，使得开发者能够更加精准地处理异常情况，并且能够更好地定位和解决问题。

Graceful Response是一个Spring Boot体系下的优雅响应处理组件，提供一站式统一返回值封装、全局异常处理、自定义异常错误码、自定义参数校验异常码等功能，使用Graceful Response进行web接口开发不仅可以节省大量的时间，还可以提高代码质量，使代码逻辑更清晰。

强烈推荐你花3分钟学会它！

Graceful Response的Github地址： [github.com/feiniaojin/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffeiniaojin%2Fgraceful-response "https://github.com/feiniaojin/graceful-response") ，欢迎star！

Graceful Response的案例工程代码：[github.com/feiniaojin/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffeiniaojin%2Fgraceful-response-example.git "https://github.com/feiniaojin/graceful-response-example.git")

2\. Spring Boot Web API接口数据返回的现状
================================

我们进行Spring Boo Web API接口开发时，通常大部分的Controller代码是这样的：

```kotlin
    public class Controller {
    @GetMapping("/query")
    @ResponseBody
        public Response query(Parameter params) {
        
        Response res = new Response();
            try {
            //1.校验params参数，非空校验、长度校验
                if (illegal(params)) {
                res.setCode(1);
                res.setMsg("error");
                return res;
            }
            //2.调用Service的一系列操作
            Data data = service.query(params);
            //3.执行正确时，将操作结果设置到res对象中
            res.setData(data);
            res.setCode(0);
            res.setMsg("ok");
            return res;
                } catch (BizException1 e) {
                //4.异常处理：一堆丑陋的try...catch，如果有错误码的，还需要手工填充错误码
                res.setCode(1024);
                res.setMsg("error");
                return res;
                    } catch (BizException2 e) {
                    //4.异常处理：一堆丑陋的try...catch，如果有错误码的，还需要手工填充错误码
                    res.setCode(2048);
                    res.setMsg("error");
                    return res;
                        } catch (Exception e) {
                        //4.异常处理：一堆丑陋的try...catch，如果有错误码的，还需要手工填充错误码
                        res.setCode(1);
                        res.setMsg("error");
                        return res;
                    }
                }
            }
```

这段代码存在什么问题呢？真正的业务逻辑被冗余代码淹没，可读性太差。

真正执行业务的代码只有

```ini
Data data=service.query(params);
```

其他代码不管是正常执行还是异常处理，都是为了异常封装、把结果封装为特定的格式，例如以下格式：

```css
    {
    "code": 0,
    "msg": "ok",
        "data": {
        "id": 1,
        "name": "username"
    }
}
```

这样的逻辑每个接口都需要处理一遍，都是繁琐的重复劳动。

现在，只需要引入Graceful Response组件并通过@EnableGracefulResponse启用，就可以直接返回业务结果并自动完成response的格式封装。

以下是使用Graceful Response之后的代码，实现同样的返回值封装、异常处理、异常错误码功能，但可以看到代码变得非常简洁，可读性非常强。

```less
    public class Controller {
    @GetMapping("/query")
    @ResponseBody
        public Data query(Parameter params) {
        return service.query(params);
    }
}
```

3\. 快速入门
========

3.1 引入maven依赖
-------------

graceful-response已发布至maven中央仓库，可以直接引入到项目中，maven依赖如下：

```xml
<dependency>
<groupId>com.feiniaojin</groupId>
<artifactId>graceful-response</artifactId>
<version>{此处替换为最新的版本号}</version>
</dependency>
```

以下链接可以查看maven中央仓库中最新的版本：

```bash
https://central.sonatype.com/artifact/com.feiniaojin/graceful-response/3.0/versions
```

3.2 在启动类中引入@EnableGracefulResponse注解
------------------------------------

```less
@EnableGracefulResponse
@SpringBootApplication
    public class ExampleApplication {
        public static void main(String[] args) {
        SpringApplication.run(ExampleApplication.class, args);
    }
}
```

3.3 Controller方法直接返回结果
----------------------

•普通的查询

```less
@Controller
    public class Controller {
    @RequestMapping("/get")
    @ResponseBody
        public UserInfoView get(Long id) {
        log.info("id={}", id);
        return UserInfoView.builder().id(id).name("name" + id).build();
    }
}
```

UserInfoView的源码：

```less
@Data
@Builder
    public class UserInfoView {
    private Long id;
    private String name;
}
```

这个接口直接返回了 UserInfoView的实例对象，调用接口时，Graceful Response将自动封装为以下格式：

```css
    {
        "status": {
        "code": "0",
        "msg": "ok"
        },
            "payload": {
            "id": 1,
            "name": "name1"
        }
    }
```

可以看到UserInfoView被自动封装到payload字段中。

Graceful Response提供了两种风格的Response，可以通过在application.properties文件中配置`gr.responseStyle=1`，将以以下的格式进行返回：

```css
    {
    "code": "0",
    "msg": "ok",
        "data": {
        "id": 1,
        "name": "name1"
    }
}
```

如果这两种风格也不能满足需要，我们还可以根据自己的需要进行自定义返回的Response格式。详细见本文 4.3自定义Respnse格式。

•异常处理的场景

通过Graceful Response，我们不需要专门在Controller中处理异常，详细见 4.1 Graceful Response异常错误码处理。

•返回值为空的场景

某些Command类型的方法只执行修改操作，不返回数据，这个时候我们可以直接在Controller中返回void，Graceful Response会自动封装默认的操作成功Response报文。

```less
@Controller
    public class Controller {
    @RequestMapping("/void")
    @ResponseBody
        public void testVoidResponse() {
        //省略业务操作
    }
}
```

testVoidResponse方法的返回时void，调用这个接口时，将返回：

```css
    {
        "status": {
        "code": "200",
        "msg": "success"
        },
    "payload": {}
}
```

3.4 Service方法业务处理
-----------------

在引入Graceful Response后，Service层的方法的可读性可以得到极大的提升。

•接口直接返回业务数据类型，而不是Response，更具备可读性

```csharp
    public interface ExampleService {
    UserInfoView query1(Query query);
}
```

•Service接口实现类中，直接抛自定义的业务异常，Graceful Response将其转化为返回错误码和错误提示

```java
    public class ExampleServiceImpl implements ExampleService {
    @Resource
    private UserInfoMapper mapper;
    
        public UserInfoView query1(Query query) {
        UserInfo userInfo = mapper.findOne(query.getId());
            if (Objects.isNull(userInfo)) {
            //这里直接抛自定义异常，异常通过@ExceptionMapper修饰，提供异常码和异常提示
            throw new NotFoundException();
        }
        // 省略后续业务操作
    }
}
``````scala
/**
* NotFoundException的定义，使用@ExceptionMapper注解修饰
* code:代表接口的异常码
* msg:代表接口的异常提示
*/
@ExceptionMapper(code = "1404", msg = "找不到对象")
    public class NotFoundException extends RuntimeException {
    
}
``````less
//Controller不再捕获处理异常
@RequestMapping("/get")
@ResponseBody
    public UserInfoView get(Query query)) {
    return exampleService.query1(query);
}
```

当Service方法抛出NotFoundException异常时，接口将直接返回错误码，不需要手工set，极大地简化了异常处理逻辑。

```css
    {
        "status": {
        "code": "1404",
        "msg": "找不到对象"
        },
    "payload": {}
}
```

验证：启动example工程后，请求

```bash
http://localhost:9090/example/notfound
```

3.5 通用异常类和通用工具类
---------------

`@ExceptionMapper`设计的初衷是将异常与错误码关联起来，用户只需要抛异常，不需要再关注异常与错误码的对应关系。

部分用户反馈，希望在不自定义新异常类的情况下，也能可以按照预期返回错误码和异常信息，因此从`2.1`版本开始，新增了`GracefulResponseException`异常类，用户只需要抛出该异常即可。

```csharp
    public class Service {
    
        public void method() {
        throw new GracefulResponseException("自定义的错误码","自定义的错误信息");
    }
}
```

为简化使用，从`2.1`版本开始提供`GracefulResponse`通用工具类，在需要抛出`GracefulResponseException`时，只需要调用`raiseException`方法即可。 这样设计原因是用户抛通用异常，其实已经不关心具体是什么异常了，用户实际上只是想要错误码和错误信息。

示例如下：

```csharp
    public class Service {
    
        public void method() {
        
        //当condition==true时，抛出GracefulResponseException异常，返回自定义的错误码和错误信息
            if (condition) {
            GracefulResponse.raiseException("自定义的错误码", "自定义的错误信息");
        }
        //省略其他业务逻辑
    }
}
```

3.6 参数校验异常以及错误码
---------------

在`3.0`版本以前，如果引用validation框架并发生了校验异常，Graceful Response在默认情况下会捕获并返回code=1，参数校验发生的异常信息会丢失；如果使用异常别名功能，可以对大的校验异常返回统一的错误码，但是不够灵活且依旧没有解决参数异常提示的问题。

Graceful Response从3.0版本开始，引入`@ValidationStatusCode`注解，可以非常方便地支持validation校验异常。

`@ValidationStatusCode`注解目前只有一个`code`属性，用于指定参数校验异常时的错误码，错误提示则取自validation校验框架。

*   对入参类进行参数校验

```less
@Data
    public class UserInfoQuery {
    
    @NotNull(message = "userName is null !")
    @Length(min = 6, max = 12)
    @ValidationStatusCode(code = "520")
    private String userName;
    
}
```

当`userName`字段任意一项校验不通过时，接口将会返回异常码`520`和校验注解中的`message`：

```css
    {
        "status": {
        "code": "520",
        "msg": "userName is null !"
        },
    "payload": {}
}
```

详细见example工程ExampleController的validateDto方法  
`http://localhost:9090/example/validateDto`

> 注意：@ValidationStatusCode校验参数对象字段的情况，code取值顺序为：会先取字段上的注解，再去该属性所在对象的类（即UserInfoQuery类）上的注解，再取全局配置的参数异常码`gr.defaultValidateErrorCode`，最后取默认的全局默认的错误码（默认code=1）

*   直接在Controller中校验方法入参

直接在Controller方法中进行参数校验：

```less
@Validated
    public class ExampleController {
    
    @RequestMapping("/validateMethodParam")
    @ResponseBody
    @ValidationStatusCode(code = "1314")
    public void validateMethodParam(@NotNull(message = "userId不能为空") Long userId,
        @NotNull(message = "userName不能为空") Long userName) {
        //省略业务逻辑
    }
}
```

当userId、或者userName校验不通过时，将会返回code=1314，msg为对应的校验信息。

```css
    {
        "status": {
        "code": "1314",
        "msg": "userId不能为空"
        },
    "payload": {}
}
```

详细见example工程ExampleController的validateMethodParam方法  
`http://localhost:9090/example/validateMethodParam`

> 注意：@ValidationStatusCode校验Controller方法参数字段的情况，code取值顺序为：会先取当前方法上的注解，再去该方法所在类（即ExampleController类）上的注解，再取全局配置的参数异常码`gr.defaultValidateErrorCode`，最后取默认的全局默认的错误码（默认code=1）

4\. 进阶用法
========

4.1 Graceful Response异常错误码处理
----------------------------

以下是使用Graceful Response进行异常、错误码处理的开发步骤。

•创建自定义异常

通过继承RuntimeException类创建自定义的异常，采用 `@ExceptionMapper`注解修饰，注解的 code属性为返回码，msg属性为错误提示信息。

关于是继承RuntimeException还是继承Exception，读者可以根据实际情况去选择，Graceful Response对两者都支持。

```scala
@ExceptionMapper(code = "1007", msg = "有内鬼，终止交易")
    public static final class RatException extends RuntimeException {
    
}
```

•Service执行具体逻辑

Service执行业务逻辑的过程中，需要抛异常的时候直接抛出去即可。由于已经通过@ExceptionMapper定义了该异常的错误码，我们不需要再单独的维护异常码枚举与异常类的关系。

```csharp
//Service层伪代码
    public class Service {
        public void illegalTransaction() {
        //需要抛异常的时候直接抛
            if (check()) {
            throw new RatException();
        }
        doIllegalTransaction();
    }
}
```

Controller层调用Service层伪代码：

```typescript
    public class Controller {
    @RequestMapping("/test3")
        public void test3() {
        //Controller中不会进行异常处理，也不会手工set错误码，只关心核心操作，其他的统统交给Graceful Response
        exampleService.illegalTransaction();
    }
}
```

在浏览器中请求controller的/test3方法，有异常时将会返回：

```css
    {
        "status": {
        "code": "1007",
        "msg": "有内鬼，终止交易"
        },
            "payload": {
        }
    }
```

4.2 外部异常别名
----------

案例工程( [github.com/feiniaojin/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffeiniaojin%2Fgraceful-response-example.git "https://github.com/feiniaojin/graceful-response-example.git") )启动后， 通过浏览器访问一个不存在的接口，例如 [http://localhost:9090/example/get2?id=1](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A9090%2Fexample%2Fget2%3Fid%3D1 "http://localhost:9090/example/get2?id=1")  
如果没开启Graceful Response，将会跳转到404页面，主要原因是应用内部产生了 NoHandlerFoundException异常。如果开启了Graceful Response，默认会返回code=1的错误码。

这类非自定义的异常，如果需要自定义一个错误码返回，将不得不对每个异常编写Advice逻辑，在Advice中设置错误码和提示信息，这样做也非常繁琐。

Graceful Response可以非常轻松地解决给这类外部异常定义错误码和提示信息的问题。

以下为操作步骤：

•创建异常别名，并用 `@ExceptionAliasFor`注解修饰

```scala
@ExceptionAliasFor(code = "1404", msg = "Not Found", aliasFor = NoHandlerFoundException.class)
    public class NotFoundException extends RuntimeException {
}
```

code：捕获异常时返回的错误码

msg：异常提示信息

aliasFor：表示将成为哪个异常的别名，通过这个属性关联到对应异常。

•注册异常别名

创建一个继承了`AbstractExceptionAliasRegisterConfig`的配置类，在实现的registerAlias方法中进行注册。

```scala
@Configuration
    public class GracefulResponseConfig extends AbstractExceptionAliasRegisterConfig {
    
    @Override
        protected void registerAlias(ExceptionAliasRegister aliasRegister) {
        aliasRegister.doRegisterExceptionAlias(NotFoundException.class);
    }
}
```

•浏览器访问不存在的URL

再次访问 [http://localhost:9090/example/get2?id=1](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A9090%2Fexample%2Fget2%3Fid%3D1 "http://localhost:9090/example/get2?id=1") ,服务端将返回以下json，正是在ExceptionAliasFor中定义的内容

```css
    {
    "code": "1404",
    "msg": "not found",
        "data": {
    }
}
```

4.3 自定义Response格式
-----------------

Graceful Response内置了两种风格的响应格式，可以在`application.properties`文件中通过`gr.responseStyle`进行配置。

•gr.responseStyle=0，或者不配置（默认情况）

将以以下的格式进行返回：

```css
    {
        "status": {
        "code": "1007",
        "msg": "有内鬼，终止交易"
        },
            "payload": {
        }
    }
```

•gr.responseStyle=1

将以以下的格式进行返回：

```css
    {
    "code": "1404",
    "msg": "not found",
        "data": {
    }
}
```

•自定义响应格式

如果以上两种格式均不能满足业务需要，可以通过自定义去满足，Response

例如以下响应：

```typescript
    public class CustomResponseImpl implements Response {
    
    private String code;
    
    private Long timestamp = System.currentTimeMillis();
    
    private String msg;
    
    private Object data = Collections.EMPTY_MAP;
    
    @Override
        public void setStatus(ResponseStatus statusLine) {
        this.code = statusLine.getCode();
        this.msg = statusLine.getMsg();
    }
    
    @Override
    @JsonIgnore
        public ResponseStatus getStatus() {
        return null;
    }
    
    @Override
        public void setPayload(Object payload) {
        this.data = payload;
    }
    
    @Override
    @JsonIgnore
        public Object getPayload() {
        return null;
    }
    
        public String getCode() {
        return code;
    }
    
        public void setCode(String code) {
        this.code = code;
    }
    
        public String getMsg() {
        return msg;
    }
    
        public void setMsg(String msg) {
        this.msg = msg;
    }
    
        public Object getData() {
        return data;
    }
    
        public void setData(Object data) {
        this.data = data;
    }
    
        public Long getTimestamp() {
        return timestamp;
    }
}
```

注意，不需要返回的属性可以返回null或者加上`@JsonIgnore`注解

•配置gr.responseClassFullName

将CustomResponseImpl的全限定名配置到gr.responseClassFullName属性。

gr.responseClassFullName=com.feiniaojin.gracefuresponse.example.config.CustomResponseImpl

注意，配置gr.responseClassFullName后，gr.responseStyle将不再生效。

实际的响应报文如下：

```css
    {
    "code":"200",
    "timestamp":1682489591319,
    "msg":"success",
        "data":{
        
    }
}
```

如果还是不能满足需求，那么可以考虑同时自定义实现Response和ResponseFactory这两个接口。

5\. 常用配置
========

Graceful Response在版本迭代中，根据用户反馈提供了一些常用的配置项，列举如下：

*   gr.printExceptionInGlobalAdvice  
    是否打印异常日志，默认为false
*   gr.responseClassFullName  
    自定义Response类的全限定名，默认为空。 配置gr.responseClassFullName后，gr.responseStyle将不再生效
*   gr.responseStyle  
    Response风格，不配置默认为0
*   gr.defaultSuccessCode  
    自定义的成功响应码，不配置则为0
*   gr.defaultSuccessMsg  
    自定义的成功提示，默认为ok
*   gr.defaultErrorCode  
    自定义的失败响应码，默认为1
*   gr.defaultErrorMsg  
    自定义的失败提示，默认为error
*   gr.defaultValidateErrorCode  
    全局的参数校验错误码，默认等于gr.defaultErrorCode

6\. 总结
======

本文介绍了`Graceful Response`这个框架的使用，读者在使用过程中遇到问题，欢迎到GitHub提交issue进行反馈，帮助我们将Graceful Response优化得更好。