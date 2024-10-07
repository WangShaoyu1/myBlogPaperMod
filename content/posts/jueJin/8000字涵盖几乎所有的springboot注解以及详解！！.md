---
author: "小u"
title: "8000字涵盖几乎所有的springboot注解以及详解！！"
date: 2024-02-21
description: "8000字涵盖几乎所有的springboot注解以及详解！！SpringBoot注解是一种元数据，提供关于Spring应用程序的数据。SpringBoot是建立在Spring之上的，并包含了Sp"
tags: ["后端","面试","SpringBoot"]
ShowReadingTime: "阅读27分钟"
weight: 162
---
8000字涵盖几乎所有的springboot注解以及详解！！
------------------------------

Spring Boot注解是一种`元数据`，提供关于Spring应用程序的数据。Spring Boot是建立在Spring之上的，并包含了Spring的所有功能。由于其快速的生产就绪环境，使开发人员能够直接专注于逻辑而不必苦于配置和设置，因此它正成为开发人员的首选。Spring Boot是一个基于微服务的框架，在其中制作生产就绪的应用程序需要很少的时间。下面是Spring Boot的一些特点：

*   它允许避免Spring中存在的繁重的XML配置。
*   它提供了易于维护和创建REST端点的功能。
*   它包括嵌入式Tomcat服务器。
*   部署非常容易，war和jar文件可以轻松部署到Tomcat服务器中。

> 位于org.springframework.boot.autoconfigure和org.springframework.boot.autoconfigure.condition包中，通常被称为Spring Boot注解。

常用的Spring Boot注释及其用途和示例
-----------------------

### 1) @SpringBootApplication：

这个注解用于启动一个Spring Boot应用程序。它结合了三个注解：`@Configuration`、`@EnableAutoConfiguration`和`@ComponentScan`。

示例：

java

 代码解读

复制代码

`@SpringBootApplication public class MyApplication {     public static void main(String[] args) {         SpringApplication.run(MyApplication.class, args);     } }`

这个就不用多少了，想必学过springboot的第一步都是这个吧。

### **2）@RestController：**

此注解用于指示类是 RESTful 控制器。它结合了 .`@Controller` 和`@ResponseBody`

**例：**

java

 代码解读

复制代码

`@RestController public class MyController {     @GetMapping("/hello")     public String hello() {         return "Hello, World!";     } }`

这个是在spring4之后引入的，有了他无需使用\*@ResponseBody\*注解来注释控制器类的每个请求处理方法。

我们可以来看一个对比

java

 代码解读

复制代码

`@Controller @RequestMapping("/api/v1") public class EmployeeController {     @Autowired     private EmployeeRepository employeeRepository;     @GetMapping("/employees")     public @ResponseBody List<Employee> getAllEmployees() {         return employeeRepository.findAll();     }     @GetMapping("/employees/{id}")     public @ResponseBody ResponseEntity<Employee> getEmployeeById(@PathVariable(value = "id") Long employeeId)         throws ResourceNotFoundException {         Employee employee = employeeRepository.findById(employeeId)           .orElseThrow(() -> new ResourceNotFoundException("Employee not found for this id :: " + employeeId));         return ResponseEntity.ok().body(employee);     }          @PostMapping("/employees")     public @ResponseBody Employee createEmployee(@Valid @RequestBody Employee employee) {         return employeeRepository.save(employee);     }     @PutMapping("/employees/{id}")     public @ResponseBody ResponseEntity<Employee> updateEmployee(@PathVariable(value = "id") Long employeeId,          @Valid @RequestBody Employee employeeDetails) throws ResourceNotFoundException {         Employee employee = employeeRepository.findById(employeeId)         .orElseThrow(() -> new ResourceNotFoundException("Employee not found for this id :: " + employeeId));         employee.setEmailId(employeeDetails.getEmailId());         employee.setLastName(employeeDetails.getLastName());         employee.setFirstName(employeeDetails.getFirstName());         final Employee updatedEmployee = employeeRepository.save(employee);         return ResponseEntity.ok(updatedEmployee);     }     @DeleteMapping("/employees/{id}")     public @ResponseBody Map<String, Boolean> deleteEmployee(@PathVariable(value = "id") Long employeeId)          throws ResourceNotFoundException {         Employee employee = employeeRepository.findById(employeeId)        .orElseThrow(() -> new ResourceNotFoundException("Employee not found for this id :: " + employeeId));         employeeRepository.delete(employee);         Map<String, Boolean> response = new HashMap<>();         response.put("deleted", Boolean.TRUE);         return response;     } }`

在这个里面，我们对每一个返回值都进行了@ResponseBody的修饰。

要在我们的示例中使用@RestController，我们需要做的就是修改\*@Controller_以_@RestController_并从每个方法中删除_@ResponseBody\*。生成的类应如下所示：

java

 代码解读

复制代码

`@RestController @RequestMapping("/api/v1") public class EmployeeController {     @Autowired     private EmployeeRepository employeeRepository;     @GetMapping("/employees")     public List<Employee> getAllEmployees() {         return employeeRepository.findAll();     }     @GetMapping("/employees/{id}")     public ResponseEntity<Employee> getEmployeeById(@PathVariable(value = "id") Long employeeId)         throws ResourceNotFoundException {         Employee employee = employeeRepository.findById(employeeId)           .orElseThrow(() -> new ResourceNotFoundException("Employee not found for this id :: " + employeeId));         return ResponseEntity.ok().body(employee);     }          @PostMapping("/employees")     public Employee createEmployee(@Valid @RequestBody Employee employee) {         return employeeRepository.save(employee);     }     @PutMapping("/employees/{id}")     public ResponseEntity<Employee> updateEmployee(@PathVariable(value = "id") Long employeeId,          @Valid @RequestBody Employee employeeDetails) throws ResourceNotFoundException {         Employee employee = employeeRepository.findById(employeeId)         .orElseThrow(() -> new ResourceNotFoundException("Employee not found for this id :: " + employeeId));         employee.setEmailId(employeeDetails.getEmailId());         employee.setLastName(employeeDetails.getLastName());         employee.setFirstName(employeeDetails.getFirstName());         final Employee updatedEmployee = employeeRepository.save(employee);         return ResponseEntity.ok(updatedEmployee);     }     @DeleteMapping("/employees/{id}")     public Map<String, Boolean> deleteEmployee(@PathVariable(value = "id") Long employeeId)          throws ResourceNotFoundException {         Employee employee = employeeRepository.findById(employeeId)        .orElseThrow(() -> new ResourceNotFoundException("Employee not found for this id :: " + employeeId));         employeeRepository.delete(employee);         Map<String, Boolean> response = new HashMap<>();         response.put("deleted", Boolean.TRUE);         return response;     } }`

有了这个注解大大的提高了代码的可读性。

### **3）@RequestMapping：**

此注解用于将 Web 请求映射到特定的处理程序方法。它可以在类或方法级别应用。

**例：**

java

 代码解读

复制代码

`@RestController @RequestMapping("/api") public class MyController {     @GetMapping("/hello")     public String hello() {         return "Hello, World!";     } }`

### **4）@Autowired：**

这个注解是用来自动连接Spring beans中的依赖关系的。它可以应用于字段、构造函数或方法。

简单来说他有俩个功能

*   _@Autowired_注解用于自动注入 bean。
*   _@Autowired_注解用于[构造函数注入](https://link.juejin.cn?target=https%3A%2F%2Fwww.javaguides.net%2F2023%2F01%2Fspring-boot-constructor-injection.html "https://www.javaguides.net/2023/01/spring-boot-constructor-injection.html")、[Setter 注入](https://link.juejin.cn?target=https%3A%2F%2Fwww.javaguides.net%2F2023%2F01%2Fspring-boot-setter-injection-example.html "https://www.javaguides.net/2023/01/spring-boot-setter-injection-example.html")和[字段注入](https://link.juejin.cn?target=https%3A%2F%2Fwww.javaguides.net%2F2023%2F01%2Fspring-boot-field-injection-example.html "https://www.javaguides.net/2023/01/spring-boot-field-injection-example.html")。

**例：**

java

 代码解读

复制代码

`@Service public class MyService {     private MyRepository repository;     @Autowired     public MyService(MyRepository repository) {         this.repository = repository;     } }`

java

 代码解读

复制代码

    `@Autowired     private EmployeeRepository employeeRepository;`

### **5）. @Component：**

@Component注解是Spring框架中用来标识类为Spring管理的组件的注解之一。它的作用是将一个类标识为Spring容器管理的组件，让Spring能够自动扫描并将其实例化，从而可以在应用中通过依赖注入等方式使用。@Component注解通常用于标识业务逻辑层、持久层、控制器等组件，让Spring容器能够管理它们的生命周期并进行依赖注入。

简单来说，**@Component注解用于将一个类标识为Spring容器管理的组件。**

**例：**

java

 代码解读

复制代码

`@Component public class MyComponent {     // ... }`

### **6）. @Service：**

这个注解是用来表示一个类是特殊类型的Spring bean，通常用于业务逻辑。

也就是我们常说的service层

**例：**

java

 代码解读

复制代码

`@Service public class MyService {     // ... }`

### **7）. @Repository：**

此注解用于指示类是 Spring bean 的一种特殊类型，通常用于数据库访问。

**例：**

java

 代码解读

复制代码

`import org.springframework.stereotype.Repository; @Repository public class UserRepository {     public void saveUser(User user) {         // 实现保存用户到数据库的逻辑     }     public User getUserById(Long id) {         // 实现根据用户ID从数据库获取用户的逻辑         return null;     }     // 其他数据访问操作方法... }`

在这个例子中，UserRepository类被标注为@Repository，表示它是一个由Spring容器管理的数据访问组件，用于执行与用户数据相关的持久化操作。

这个注解可能有些人比较陌生。其实@Repository和@Controller、@Service、@Component的作用差不多，都是把对象交给spring管理。@Repository用在持久层的接口上，这个注解是将接口的一个实现类交给spring管理。

也就是和@Mapper非常的相似：

@Mapper是属于mybatis的注解。在程序中，mybatis需要找到对应的mapper，在编译时候动态生成代理类，实现数据库查询功能。 @Mapper和@Repository注解的使用方式一样，都是在持久层的接口上添加注解。

我们为什么平常不使用这个依旧没有报错呢？

其实是因为在spring的配置文件中，配置了MapperScannerConfigure这个bean，他会扫描持久层接口创建实现类交给spring来管理。

同样的，我们经常在启动类中添加@MapperScan和MapperScannerConfigure的作用是一样的。

### **8）. @Configuration：**

此注解用于将类声明为配置类。它通常与方法结合使用。`@Bean`

**例：**

java

 代码解读

复制代码

`import org.springframework.boot.SpringApplication; import org.springframework.context.annotation.Bean; import org.springframework.context.annotation.Configuration; import com.companyname.projectname.customer.CustomerService; import com.companyname.projectname.order.OrderService; @Configuration public class Application {      @Bean      public CustomerService customerService() {          return new CustomerService();      }        @Bean      public OrderService orderService() {          return new OrderService();      } }`

上面的 _AppConfig_ 类等效于以下 Spring XML：

xml

 代码解读

复制代码

`<beans>         <bean id="customerService" class="com.companyname.projectname.CustomerService"/>         <bean id="orderService" class="com.companyname.projectname.OrderService"/> </beans>`

这个在实际开发中，一般用于去配置一些属性，比如说swagger的配置，mybatis的配置等等。

### **9）. @Value：**

此注解用于将属性文件或其他来源的值注入到 Spring Bean 中。

**例：**

java

 代码解读

复制代码

`import org.springframework.beans.factory.annotation.Value; import org.springframework.stereotype.Component; @Component public class MyComponent {     @Value("${my.property}")     private String myProperty;     public void displayPropertyValue() {         System.out.println("The value of my.property is: " + myProperty);     } }`

在这个例子中，@Value("${my.property}")将Spring的属性值注入到myProperty字段中。假设在应用的配置文件中有一个名为"my.property"的属性，那么这个属性的值将会被注入到myProperty字段中。

这个我再写一个代码生成器的时候经常用到，这样可以有效的避免硬编码的出现。

### **10）. @EnableAutoConfiguration：**

此注解用于启用 Spring Boot 的自动配置机制。它根据类路径依赖项和属性自动配置应用程序。他可以简化配置过程，从而实现快速开发。

**例：**

java

 代码解读

复制代码

`@SpringBootApplication @EnableAutoConfiguration public class MyApplication {     // ... }`

有@EnableAutoConfiguration的情况下：

*   Spring Boot将会根据项目的依赖和配置，自动配置应用程序的各个组件，例如数据源、JPA、Web等。
*   MyService类会被自动扫描并纳入Spring容器管理。

没有@EnableAutoConfiguration的情况下：

*   我们需要手动配置应用程序的各个组件，例如配置数据源、JPA、Web等，这会增加开发工作量。
*   MyService类不会被自动扫描，需要显式配置才能被Spring容器管理

如果发现正在应用不需要的特定自动配置类，则可以使用 @EnableAutoConfiguration 的 exclude 属性 来禁用它们

例如

java

 代码解读

复制代码

`@EnableAutoConfiguration(excludeName = {"org.springframework.boot.autoconfigure.thymeleaf.ThymeleafAutoConfiguration", "org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration"})`

### **11）. @GetMapping、@PostMapping、@PutMapping、@DeleteMapping**：

这些注解用于将特定的 HTTP 方法映射到处理程序方法。它们是相应 HTTP 方法的快捷方式。

例如：

java

 代码解读

复制代码

`@RestController @RequestMapping("/api") public class MyController {     @GetMapping("/hello")     public String hello() {         return "Hello, World!";     }          @PostMapping("/data")     public void saveData(@RequestBody Data data) {         // Save data     } }`

### **12）. @PathVariable：**

该注解用于将方法参数绑定到请求 URL 中的路径变量。

**例：**

若方法参数名称和需要绑定的url中变量名称一致时,可以简写:

java

 代码解读

复制代码

`@RestController @RequestMapping("/api") public class MyController {     @GetMapping("/users/{id}")     public User getUser(@PathVariable Long id) {         // 根据给定的ID检索用户     } }`

若方法参数名称和需要绑定的url中变量名称不一致时，写成:

java

 代码解读

复制代码

`@RestController @RequestMapping("/api") public class MyController {     @GetMapping("/users/{id}")     public User getUser(@PathVariable("id") Long Id) {         // 根据给定的ID检索用户     } }`

### **13）. @RequestParam：**

该注解用于将方法参数绑定到请求参数。

**例：**

java

 代码解读

复制代码

`@RestController @RequestMapping("/api") public class MyController {     @GetMapping("/users")     public List<User> getUsers(@RequestParam("status") String status) {         // 根据给定的状态检索用户     } }`

@RequestParam和@PathVariable都是Spring MVC中用于从HTTP请求中获取参数的注解，那么他们的区别是什么呢？

**@RequestParam**

*   用于从请求的查询参数中获取值。
*   查询参数通常是通过URL中的`?`后跟键值对的形式传递的，例如`?name=John&age=25`。
*   在方法参数中使用@RequestParam注解，并指定参数的名称，Spring会自动将请求中对应名称的参数值注入到方法参数中。
*   适用于GET请求和POST请求中使用`application/x-www-form-urlencoded`方式提交参数的情况。

示例：

java

 代码解读

复制代码

`@GetMapping("/users") public String getUserByName(@RequestParam("name") String name) {     // 根据姓名查询用户     return "User name: " + name; }`

**@PathVariable**

*   用于从URL路径中获取值。
*   URL路径中的部分可以通过占位符的形式表示，例如`/users/{id}`，其中{id}就是一个占位符。
*   在方法参数中使用@PathVariable注解，并指定占位符的名称，Spring会自动将URL路径中对应位置的值注入到方法参数中。
*   适用于RESTful风格的请求，其中URL路径包含资源的唯一标识符或其他参数。

示例：

java

 代码解读

复制代码

`@GetMapping("/users/{id}") public String getUserById(@PathVariable("id") Long id) {     // 根据ID查询用户     return "User ID: " + id; }`

总的来说，@RequestParam用于**获取查询参数**，而@PathVariable用于获取**URL路径中的参数**。

### **14）. @RequestBody：**

此注解用于将请求体绑定到方法参数。它通常用于 RESTful API 中，用于接收 JSON 或 XML 有效负载。**例：**

java

 代码解读

复制代码

`@RestController @RequestMapping("/api") public class MyController {     @PostMapping("/users")     public void createUser(@RequestBody User user) {         // Create a new user     } }`

在这个例子中，Spring会自动根据请求的Content-Type将请求体转换为`User`对象。

假设请求的Content-Type为application/json，请求体的内容如下：

json

 代码解读

复制代码

`{   "name": "xiaou",   "age": 25 }`

当请求到达/api/users时，Spring会自动将请求体中的JSON内容转换为User对象，并将其作为参数传递给createUser()方法。

那么他和前一个的区别呢？

他们的区别主要有三点

1.  **作用对象**：
    *   `@RequestParam` 主要用于从 URL 查询参数中获取值，即处理 HTTP 请求中的查询参数。
    *   `@RequestBody` 主要用于从 HTTP 请求体中获取值，即处理 HTTP 请求中的请求体内容。
2.  **数据类型**：
    *   `@RequestParam` 通常用于简单数据类型的参数获取，如字符串、数字等。
    *   `@RequestBody` 通常用于复杂数据类型的参数获取，如 JSON、XML 等格式的数据，将其转换为对应的 Java 对象。
3.  **用途**：
    *   `@RequestParam` 适用于处理表单提交或 GET 请求中的查询参数，常用于获取请求中的少量简单参数。
    *   `@RequestBody` 适用于处理 POST 请求中的请求体内容，常用于获取请求中的复杂对象或大量数据。

java

 代码解读

复制代码

`// 使用@RequestParam处理查询参数 @GetMapping("/users") public String getUserByName(@RequestParam("name") String name) {     // 根据姓名查询用户     return "User name: " + name; } // 使用@RequestBody处理请求体内容 @PostMapping("/users") public String createUser(@RequestBody User user) {     // 处理接收到的用户对象     return "User created: " + user.toString(); }`

不知道看到这里大家有没有已经有点乱了。

我现在对这三个做一个最简单的总结

@PathVariable 用于从 URL 路径中获取参数值

@RequestParam 用于获取请求 URL 中的查询参数值

@RequestBody 用于获取 HTTP 请求体中的参数值

### **15）. @Qualifier：**

此注解用于指定当有多个相同类型的 Bean 可用时要注入哪个 Bean。

这个的使用场景多用于：

使用 `@Autowired` 注解是 **Spring** 依赖注入的绝好方法。但是有些场景下仅仅靠这个注解不足以让Spring知道到底要注入哪个 **bean**。默认情况下，`@Autowired` 按类型装配 **Spring Bean**。如果容器中有多个相同类型的 **bean**，则框架将抛出 `NoUniqueBeanDefinitionException`， 以提示有多个满足条件的 **bean** 进行自动装配。程序无法正确做出判断使用哪一个，

java

 代码解读

复制代码

    `@Component("fooFormatter")     public class FooFormatter implements Formatter {         public String format() {             return "foo";         }     }     @Component("barFormatter")     public class BarFormatter implements Formatter {         public String format() {             return "bar";         }     }     @Component     public class FooService {         @Autowired         private Formatter formatter;                  //todo      }`

通过使用 `@Qualifier` 注解，我们可以消除需要注入哪个 **bean** 的问题

java

 代码解读

复制代码

    `@Component     public class FooService {         @Autowired         @Qualifier("fooFormatter")         private Formatter formatter;                  //todo      }`

### **16）. @ConditionalOnProperty：**

此注解用于根据属性的值有条件地启用或禁用 Bean 或配置。

**例：**

java

 代码解读

复制代码

`@Configuration @ConditionalOnProperty(name = "my.feature.enabled", havingValue = "true") public class MyConfiguration {     // 当启用时的功能配置 }`

### **17）. @Scheduled：**

此注解用于以固定的时间间隔调度方法的执行。

**例：**

java

 代码解读

复制代码

`@Component public class MyScheduler {     @Scheduled(fixedDelay = 5000)     public void doSomething() {         // 定期执行任务     } }`

### **18）. @Cacheable、@CachePut、@CacheEvict：**

这些注解用于缓存方法结果。它们允许您分别缓存方法的返回值、更新缓存或去除缓存。

java

 代码解读

复制代码

`@Service public class MyService {     @Cacheable("users")     public User getUserById(Long id) {         // 从数据库检索用户     }          @CachePut("users")     public User updateUser(User user) {         // 更新数据库和缓存中的用户     }          @CacheEvict("users")     public void deleteUser(Long id) {         // 从数据库删除用户并从缓存中移除     } }`

其他注解解析
------

这些注解我不是特别的常用，所以就简单的做一个解析。

有关网络的：

### 网络注解

1.  `@CookieValue`:
    
    *   用于从HTTP请求中提取特定cookie的值。
        
    *   通常用于控制器方法的参数上。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@GetMapping("/showUser") public String showUser(@CookieValue("username") String username) {     // 使用提取的cookie值执行逻辑     return "User: " + username; }`
        
2.  `@ModelAttribute`:
    
    *   用于将请求参数绑定到Model对象，通常用于将表单数据传递给处理器方法。
        
    *   也可以用于在每次请求处理前填充模型对象的属性。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@PostMapping("/saveUser") public String saveUser(@ModelAttribute User user) {     // 保存用户逻辑     return "redirect:/users"; }`
        
3.  `@ResponseStatus`:
    
    *   用于指定处理器方法的响应状态码。
        
    *   通常与`@ControllerAdvice`结合使用，用于全局异常处理器方法上。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@ResponseStatus(HttpStatus.NOT_FOUND) public class ResourceNotFoundException extends RuntimeException {     // 自定义异常 } @ControllerAdvice public class GlobalExceptionHandler {     @ExceptionHandler(ResourceNotFoundException.class)     @ResponseStatus(HttpStatus.NOT_FOUND)     public String handleResourceNotFoundException() {         return "resourceNotFound";     } }`
        
4.  `@ExceptionHandler`:
    
    *   用于在Controller类中定义处理特定异常的方法。
        
    *   当控制器方法抛出指定类型的异常时，将调用带有`@ExceptionHandler`注解的方法来处理该异常。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@Controller public class MyController {     @ExceptionHandler(Exception.class)     public ModelAndView handleException(Exception ex) {         ModelAndView modelAndView = new ModelAndView("error");         modelAndView.addObject("errorMessage", ex.getMessage());         return modelAndView;     } }`
        

对于这个ExceptionHandler，我把她放到不常用列表，因为一般对于我这种开发，都是代码生成器生成的，所以不常用。

下面是一些数据注解：

### 数据注解

这些注解通常用于Java持久化API（JPA）中，用于定义实体类和数据库表之间的映射关系。

1.  `@Entity`:
    
    *   用于标识一个类是一个JPA实体，通常对应数据库中的一张表。
        
    *   必须与`@Table`注解一起使用，指定实体映射到数据库中的哪个表。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@Entity @Table(name = "employees") public class Employee {     // 实体类的属性和方法 }`
        
2.  `@Table`:
    
    *   用于指定实体类映射到数据库中的表的详细信息。
        
    *   可以指定表的名称、schema、索引等信息。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@Entity @Table(name = "products", schema = "inventory") public class Product {     // 实体类的属性和方法 }`
        
3.  `@Id`:
    
    *   用于指定实体类的主键字段。
        
    *   每个实体类必须有一个字段被`@Id`注解标识，用作唯一标识。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@Entity @Table(name = "employees") public class Employee {     @Id     private Long id;     // 其他属性和方法 }`
        
4.  `@GeneratedValue`:
    
    *   用于指定主键的生成策略。
        
    *   通常与`@Id`一起使用，指定主键字段的值是自动生成的。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@Entity @Table(name = "employees") public class Employee {     @Id     @GeneratedValue(strategy = GenerationType.IDENTITY)     private Long id;     // 其他属性和方法 }`
        
5.  `@Column`:
    
    *   用于指定实体类属性与数据库表中列的映射关系。
        
    *   可以指定列名、长度、是否允许为空等信息。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@Entity @Table(name = "employees") public class Employee {     @Id     @GeneratedValue(strategy = GenerationType.IDENTITY)     private Long id;          @Column(name = "emp_name", length = 50, nullable = false)     private String name;     // 其他属性和方法 }`
        
6.  `@Transient`:
    
    *   用于指定实体类的某个字段不需要持久化到数据库。
        
    *   标记为`@Transient`的字段将不会被保存到数据库表中。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@Entity @Table(name = "employees") public class Employee {     @Id     @GeneratedValue(strategy = GenerationType.IDENTITY)     private Long id;          @Column(name = "emp_name", length = 50, nullable = false)     private String name;          @Transient     private transientField;     // 其他属性和方法 }`
        

7.`@PersistenceContext`:

*   用于注入一个`EntityManager`对象，用于管理实体对象的持久化操作。
    
*   通常用于容器管理的Bean中，如Spring管理的服务类。
    
*   示例代码：
    
    java
    
     代码解读
    
    复制代码
    
    `@Service public class EmployeeService {     @PersistenceContext     private EntityManager entityManager;     // 其他方法 }`
    

8.`@Query`:

*   用于声明自定义的JPQL（Java Persistence Query Language）查询。
    
*   可以在Repository接口的方法上使用，也可以在实体类的方法上使用。
    
*   示例代码：
    
    java
    
     代码解读
    
    复制代码
    
    `@Repository public interface EmployeeRepository extends JpaRepository<Employee, Long> {     @Query("SELECT e FROM Employee e WHERE e.department = ?1")     List<Employee> findByDepartment(Department department); }`
    

9.`@NamedQuery`:

*   用于在实体类上声明一个命名查询。
    
*   命名查询是预定义的JPQL查询，可以在多个位置引用。
    
*   示例代码：
    
    java
    
     代码解读
    
    复制代码
    
    `@Entity @NamedQuery(name = "Employee.findAll", query = "SELECT e FROM Employee e") public class Employee {     // 实体类的属性和方法 }`
    

10.`@Param`:

*   用于在JPQL查询中引用命名参数。
    
*   在`@Query`注解中使用，并与查询语句中的命名参数一起使用。
    
*   示例代码：
    
    java
    
     代码解读
    
    复制代码
    
    `@Repository public interface EmployeeRepository extends JpaRepository<Employee, Long> {     @Query("SELECT e FROM Employee e WHERE e.department = :dept")     List<Employee> findByDepartment(@Param("dept") Department department); }`
    

11.`@JoinTable`:

*   用于指定实体类之间的多对多关联关系的中间表信息。
    
*   通常用于描述两个实体之间的多对多关系。
    
*   示例代码：
    
    java
    
     代码解读
    
    复制代码
    
    `@Entity public class Student {     @ManyToMany     @JoinTable(name = "student_course",                joinColumns = @JoinColumn(name = "student_id"),                inverseJoinColumns = @JoinColumn(name = "course_id"))     private List<Course> courses;     // 其他属性和方法 }`
    

12.`@JoinColumn`:

*   用于指定实体之间关联关系的外键列信息。
    
*   通常用于描述实体之间的一对多或多对一关系。
    
*   示例代码：
    
    java
    
     代码解读
    
    复制代码
    
    `@Entity public class Employee {     @ManyToOne     @JoinColumn(name = "department_id")     private Department department;     // 其他属性和方法 }`
    

### **验证注释**

这些注解通常用于Java中的Bean Validation（JSR-380）规范中，用于对JavaBean属性进行验证。

1.  `@Valid`:
    
    *   用于指示在验证嵌套对象时应该递归执行验证。
        
    *   通常与复杂对象的属性一起使用，以确保嵌套对象的所有属性都被验证。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `public class Address {     @NotNull     private String street;     // 其他属性和方法 } public class User {     @Valid     private Address address;     // 其他属性和方法 }`
        
2.  `@NotNull`:
    
    *   用于验证属性值不能为null。
        
    *   通常用于String、Collection、Map或基本数据类型上。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `public class User {     @NotNull     private String username;     // 其他属性和方法 }`
        
3.  `@Size`:
    
    *   用于验证属性值的长度是否在指定范围内。
        
    *   可以用于String、Collection、Map或数组上。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `public class User {     @Size(min = 2, max = 50)     private String name;     // 其他属性和方法 }`
        
4.  `@Min`:
    
    *   用于验证属性值是否大于等于指定的最小值。
        
    *   通常用于数值类型的属性。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `public class User {     @Min(18)     private int age;     // 其他属性和方法 }`
        
5.  `@Max`:
    
    *   用于验证属性值是否小于等于指定的最大值。
        
    *   通常用于数值类型的属性。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `public class User {     @Max(100)     private int age;     // 其他属性和方法 }`
        
6.  `@Email`:
    
    *   用于验证属性值是否符合Email地址的格式。
        
    *   通常用于String类型的属性。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `public class User {     @Email     private String email;     // 其他属性和方法 }`
        
7.  `@Pattern`:
    
    *   用于验证属性值是否匹配指定的正则表达式。
        
    *   可以自定义验证规则。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `public class User {     @Pattern(regexp = "^[A-Za-z0-9]+$")     private String username;     // 其他属性和方法 }`
        

### **Security** 注释

这些注解通常用于Spring Security和OAuth2框架中，用于配置安全相关的功能和授权机制。

1.  `@EnableWebSecurity`:
    
    *   用于启用Spring Security的Web安全功能。
        
    *   通常用于配置类上，指示Spring Boot应用程序使用Spring Security。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@EnableWebSecurity @Configuration public class WebSecurityConfig extends WebSecurityConfigurerAdapter {     // 配置安全规则等 }`
        
2.  `@Configuration`:
    
    *   用于标识一个类作为配置类，通常与其他注解一起使用。
        
    *   在Spring应用程序中，被用于定义Bean和配置应用程序的各种特性。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@Configuration public class AppConfig {     // 配置Bean等 }`
        
3.  `@EnableGlobalMethodSecurity`:
    
    *   用于启用全局方法级别的安全性。
        
    *   可以配置PreAuthorize、PostAuthorize、Secured和RolesAllowed等注解。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@EnableGlobalMethodSecurity(prePostEnabled = true) @Configuration public class MethodSecurityConfig extends GlobalMethodSecurityConfiguration {     // 配置方法级别的安全规则 }`
        
4.  `@PreAuthorize`:
    
    *   用于在方法执行之前进行权限验证。
        
    *   可以使用Spring表达式语言（SpEL）指定访问规则。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@PreAuthorize("hasRole('ROLE_ADMIN')") public void deleteUser(User user) {     // 删除用户逻辑 }`
        
5.  `@PostAuthorize`:
    
    *   用于在方法执行之后进行权限验证。
        
    *   可以使用Spring表达式语言（SpEL）指定访问规则。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@PostAuthorize("returnObject.owner == authentication.name") public Object findDocument() {     // 返回文档逻辑 }`
        
6.  `@Secured`:
    
    *   用于在方法级别限制访问，需要指定用户具有哪些角色才能调用该方法。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@Secured("ROLE_ADMIN") public void deleteUser(User user) {     // 删除用户逻辑 }`
        
7.  `@RolesAllowed`:
    
    *   用于在方法级别限制访问，需要指定用户具有哪些角色才能调用该方法。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@RolesAllowed("ROLE_ADMIN") public void deleteUser(User user) {     // 删除用户逻辑 }`
        
8.  `@EnableOAuth2Client`, `@EnableResourceServer`, `@EnableAuthorizationServer`:
    
    *   这些注解通常用于OAuth2相关的配置，用于启用OAuth2客户端、资源服务器和授权服务器功能。
        
    *   通常用于配置类上，以启用相应的OAuth2功能。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@Configuration @EnableOAuth2Client public class OAuth2ClientConfig {     // 配置OAuth2客户端 } @Configuration @EnableResourceServer public class ResourceServerConfig extends ResourceServerConfigurerAdapter {     // 配置资源服务器 } @Configuration @EnableAuthorizationServer public class AuthorizationServerConfig extends AuthorizationServerConfigurerAdapter {     // 配置授权服务器 }`
        

### **测试注解**

这些注解通常用于JUnit和Spring Framework中，用于测试相关的功能

1.  `@RunWith`:
    
    *   用于指定测试运行器，JUnit4中使用。
        
    *   在JUnit5中被`@ExtendWith`所取代。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@RunWith(SpringRunner.class) public class MySpringTest {     // 测试代码 }`
        
2.  `@SpringBootTest`:
    
    *   用于启动完整的Spring应用程序上下文进行集成测试。
        
    *   自动配置应用程序上下文。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@SpringBootTest public class MyIntegrationTest {     // 集成测试代码 }`
        
3.  `@WebMvcTest`:
    
    *   用于针对Spring MVC应用程序进行单元测试。
        
    *   仅加载与Web相关的组件，如控制器、过滤器等。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@WebMvcTest(UserController.class) public class UserControllerTest {     // 控制器单元测试代码 }`
        
4.  `@DataJpaTest`:
    
    *   用于测试JPA持久化层的单元测试。
        
    *   自动配置内存型数据库（如H2）并扫描`@Entity`注解。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@DataJpaTest public class UserRepositoryTest {     // JPA单元测试代码 }`
        
5.  `@RestClientTest`:
    
    *   用于测试Spring RestTemplate或WebClient客户端的单元测试。
        
    *   自动配置RestTemplate或WebClient Bean。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@RestClientTest(MyRestClient.class) public class MyRestClientTest {     // Rest客户端单元测试代码 }`
        
6.  `@MockBean`:
    
    *   用于创建Mock对象并将其注入Spring上下文中。
        
    *   用于替换Spring Bean进行单元测试。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@SpringBootTest public class MyServiceTest {     @MockBean     private SomeDependency mockDependency;          // 单元测试代码 }`
        
7.  `@AutoConfigureMockMvc`:
    
    *   用于在Spring MVC测试中自动配置MockMvc。
        
    *   用于对控制器进行模拟请求。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@WebMvcTest(UserController.class) @AutoConfigureMockMvc public class UserControllerTest {     @Autowired     private MockMvc mockMvc;          // 控制器测试代码 }`
        
8.  `@Test`, `@Before`, `@After`, `@BeforeEach`, `@AfterEach`, `@BeforeAll`, `@AfterAll`:
    
    *   用于JUnit测试方法的生命周期管理。
        
    *   `@Test`用于标记测试方法，其他注解用于在测试方法执行前后执行特定操作。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@Test public void testSomething() {     // 测试方法 } @BeforeEach public void setUp() {     // 执行测试方法之前的操作 } @AfterEach public void tearDown() {     // 执行测试方法之后的操作 }`
        
9.  `@DisplayName`:
    
    *   用于为测试类或测试方法指定自定义名称。
        
    *   用于生成更有意义的测试报告。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@Test @DisplayName("测试用户注册功能") public void testUserRegistration() {     // 测试方法 }`
        
10.  `@Disabled`:
    
    *   用于禁用测试类或测试方法。
        
    *   在调试或开发阶段暂时不需要执行某些测试时使用。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@Test @Disabled("暂时禁用，等待修复") public void testSomething() {     // 测试方法 }`
        
11.  `@ParameterizedTest`, `@ValueSource`, `@CsvSource`:
    
    *   用于参数化测试，允许多次运行相同的测试方法，但使用不同的参数。
        
    *   `@ValueSource`用于指定单个参数的值列表，`@CsvSource`用于指定多个参数的值列表。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@ParameterizedTest @ValueSource(strings = {"apple", "banana", "orange"}) public void testFruit(String fruit) {     // 使用不同的水果参数进行测试 } @ParameterizedTest @CsvSource({"apple, 1", "banana, 2", "orange, 3"}) public void testFruit(String fruit, int count) {     // 使用不同的水果和数量参数进行测试 }`
        
12.  `@ExtendWith`:
    
    *   用于扩展测试运行时的功能，例如参数解析、条件评估等。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@ExtendWith(MyExtension.class) public class MyTest {     // 测试方法 }`
        

### **消息注释**

这些注解通常用于Spring框架中的JMS（Java Message Service）消息传递功能，用于简化JMS消息的生产和消费。

1.  `@EnableJms`:
    
    *   用于启用JMS功能。
        
    *   通常用于配置类上，以开启对JMS相关注解的支持。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@Configuration @EnableJms public class AppConfig {     // 其他配置代码 }`
        
2.  `@JmsListener`:
    
    *   用于声明一个方法是一个JMS消息监听器，用于接收JMS消息。
        
    *   可以指定监听的队列或主题。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@JmsListener(destination = "myQueue") public void receiveMessage(String message) {     // 处理收到的消息 }`
        
3.  `@SendTo`:
    
    *   用于在消息处理方法上指定回复消息的目的地。
        
    *   通常与`@JmsListener`一起使用。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@JmsListener(destination = "inputQueue") @SendTo("outputQueue") public String handleMessage(String message) {     // 处理消息并返回结果 }`
        
4.  `@MessageMapping`:
    
    *   用于标识一个方法用于处理特定消息目的地的消息。
        
    *   通常与Spring的WebSocket支持一起使用，处理WebSocket消息。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@MessageMapping("/hello") @SendTo("/topic/greetings") public Greeting greeting(HelloMessage message) {     // 处理消息并返回结果 }`
        
5.  `@Payload`:
    
    *   用于在JMS消息处理方法中指定消息体的参数。
        
    *   用于获取JMS消息的内容。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@JmsListener(destination = "myQueue") public void receiveMessage(@Payload String message) {     // 处理消息 }`
        
6.  `@Header`:
    
    *   用于在JMS消息处理方法中指定消息头的参数。
        
    *   用于获取JMS消息的头信息。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@JmsListener(destination = "myQueue") public void receiveMessage(@Header("X-Custom-Header") String customHeader) {     // 处理消息头 }`
        

### **面向切面的编程 （AOP） 注解**：

这些注解通常用于Spring框架中的面向切面编程（AOP，Aspect-Oriented Programming），用于实现横切关注点的模块化

1.  `@Aspect`:
    
    *   用于定义一个切面，将横切逻辑封装在切面中。
        
    *   切面是包含切入点和通知的类。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@Aspect @Component public class LoggingAspect {     // 切面类的实现 }`
        
2.  `@Pointcut`:
    
    *   用于定义一个切入点，指定在哪些连接点上应用切面逻辑。
        
    *   可以在多个通知中重复使用同一个切入点。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@Pointcut("execution(* com.example.service.*.*(..))") private void serviceLayer() {}`
        
3.  `@Before`:
    
    *   用于定义一个前置通知，在方法执行之前执行切面逻辑。
        
    *   在连接点之前执行。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@Before("serviceLayer()") public void beforeAdvice() {     // 执行前置通知逻辑 }`
        
4.  `@After`:
    
    *   用于定义一个后置通知，在方法执行之后执行切面逻辑（无论方法是否抛出异常）。
        
    *   在连接点之后执行。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@After("serviceLayer()") public void afterAdvice() {     // 执行后置通知逻辑 }`
        
5.  `@AfterReturning`:
    
    *   用于定义一个返回后通知，在方法正常返回后执行切面逻辑。
        
    *   只在方法正常返回时执行，在方法抛出异常时不执行。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@AfterReturning(pointcut = "serviceLayer()", returning = "result") public void afterReturningAdvice(Object result) {     // 执行返回后通知逻辑 }`
        
6.  `@AfterThrowing`:
    
    *   用于定义一个异常通知，在方法抛出异常后执行切面逻辑。
        
    *   只在方法抛出异常时执行，在方法正常返回时不执行。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@AfterThrowing(pointcut = "serviceLayer()", throwing = "exception") public void afterThrowingAdvice(Exception exception) {     // 执行异常通知逻辑 }`
        
7.  `@Around`:
    
    *   用于定义一个环绕通知，在方法执行前后执行切面逻辑，并控制方法的执行。
        
    *   在连接点之前和之后执行。
        
    *   示例代码：
        
        java
        
         代码解读
        
        复制代码
        
        `@Around("serviceLayer()") public Object aroundAdvice(ProceedingJoinPoint joinPoint) throws Throwable {     // 执行前置逻辑     Object result = joinPoint.proceed(); // 执行被通知的方法     // 执行后置逻辑     return result; }`
        

下面的就一句话概括了。因为基本上很不常用。

### 执行器注释

*   `@EnableActuator`: 用于启用 Spring Boot Actuator 模块，提供应用程序的监控和管理功能。
*   `@Endpoint`: 用于创建自定义的端点，允许暴露自定义的监控和管理端点。
*   `@RestControllerEndpoint`: 用于创建一个基于 REST 风格的端点，将其作为 REST 控制器来使用。
*   `@ReadOperation`: 用于指定端点处理 GET 请求的方法。
*   `@WriteOperation`: 用于指定端点处理 POST 请求的方法。
*   `@DeleteOperation`: 用于指定端点处理 DELETE 请求的方法。

### 配置属性注释

*   `@ConfigurationProperties`: 用于将配置文件中的属性映射到 Java Bean 中。
*   `@ConstructorBinding`: 用于将配置属性绑定到构造函数参数，通常与 `@ConfigurationProperties` 结合使用。
*   `@Validated`: 用于标记需要验证的配置属性类，通常与 JSR-380（Bean Validation）结合使用。

### 国际化和本地化

*   `@EnableMessageSource`: 用于启用消息资源处理功能，通常用于启用国际化和本地化。
*   `@EnableWebMvc`: 用于启用 Spring MVC 功能，通常用于配置类上，以开启对 Spring MVC 的支持。
*   `@LocaleResolver`: 用于解析请求的区域设置（Locale）信息。
*   `@MessageBundle`: 用于指定国际化消息资源文件的基础名称。
*   `@MessageSource`: 用于获取消息资源，通常与 `@Autowired` 一起使用。

### 日志记录和监控

*   `@Slf4j`, `@Log4j2`, `@Log`: 用于简化日志记录器的创建，分别对应不同的日志框架（SLF4J、Log4j2、JDK Logging）。
*   `@Timed`, `@Counted`, `@ExceptionMetered`: 用于添加指标来监视方法的执行时间、调用次数和异常情况。

### 数据验证

*   `@NotNull`, `@NotBlank`, `@Email`, `@Size`, `@Pattern`: 用于对字段进行基本的验证，例如非空、非空白、邮箱格式、大小范围、正则表达式匹配等。
*   `@Positive`, `@PositiveOrZero`, `@Negative`, `@NegativeOrZero`: 用于验证数字是否为正数、非负数、负数或非正数。

### GraphQL 注解

*   `@GraphQLApi`: 用于标识一个类为 GraphQL API 类。
*   `@GraphQLQuery`, `@GraphQLMutation`, `@GraphQLSubscription`: 用于定义查询、变更和订阅操作。
*   `@GraphQLArgument`, `@GraphQLContext`, `@GraphQLNonNull`, `@GraphQLInputType`, `@GraphQLType`: 用于定义 GraphQL 的参数、上下文、非空类型、输入类型和类型。

### 集成注解

*   `@IntegrationComponentScan`: 用于扫描集成组件。
*   `@MessagingGateway`, `@Transformer`, `@Splitter`, `@Aggregator`, `@ServiceActivator`, `@InboundChannelAdapter`, `@OutboundChannelAdapter`, `@Router`, `@BridgeTo`: 用于配置和定义集成组件。

### Flyway 数据库迁移

*   `@FlywayTest`: 用于测试 Flyway 数据库迁移的注解。
*   `@FlywayTestExtension`: 用于扩展 Flyway 测试功能。
*   `@FlywayTestExtension.Test`: 用于标记测试方法。
*   `@FlywayTestExtension.BeforeMigration`: 用于在迁移之前执行。
*   `@FlywayTestExtension.AfterMigration`: 用于在迁移之后执行。

### JUnit 5 注解

*   `@ExtendWith`: 用于扩展 JUnit 5 的功能。
*   `@TestInstance`: 用于配置测试实例的生命周期。
*   `@TestTemplate`: 用于指定测试模板方法。
*   `@DisplayNameGeneration`: 用于自定义测试显示名称的生成策略。
*   `@Nested`: 用于创建嵌套测试类。
*   `@Tag`: 用于标记测试，以便根据标签运行测试。
*   `@DisabledOnOs`, `@EnabledOnOs`, `@DisabledIf`, `@EnabledIf`: 用于根据条件禁用或启用测试。

### API 文档注解

*   `@Api`, `@ApiOperation`, `@ApiParam`, `@ApiModel`, `@ApiModelProperty`: 用于定义和描述 API 文档的相关信息。

### 异常处理注解

*   `@ControllerAdvice`: 用于定义全局的异常处理器。
*   `@ExceptionHandler`: 用于处理特定异常的方法。

### GraphQL 注解

*   `@GraphQLSchema`, `@GraphQLQueryResolver`, `@GraphQLMutationResolver`, `@GraphQLSubscriptionResolver`, `@GraphQLResolver`: 用于定义 GraphQL 架构和解析器。

### 服务器发送的事件（SSE）注释

*   `@SseEmitter`: 用于创建 SSE 事件的发射器。
*   `@SseEventSink`: 用于注入 SSE 事件的接收器。

### WebFlux 注解

*   `@RestController`, `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`, `@PatchMapping`: 用于定义 WebFlux RESTful 控制器和请求映射。

### 千分尺度量注释

@Timed：此注解用于测量方法的执行时间。

@Counted：此注解用于计算调用方法的次数。

@Gauge：此注释用于将方法公开为仪表度量。

@ExceptionMetered：此注释用于测量方法引发的异常率。

总结
--

这不是一个详尽的列表，Spring Boot 提供了跨各种模块和功能的更多注释。有关注解及其用法的完整列表，我建议参考官方的 Spring Boot 文档和特定于模块的文档。这里只是对一些常见的注释进行了一些总结，但是已经涵盖了基本上所有的项目所用到的注解了。

参考资料：

[@Repository注解的作用和用法，以及和@Mapper的区别-CSDN博客](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Ffengling_smile%2Farticle%2Fdetails%2F129853866 "https://blog.csdn.net/fengling_smile/article/details/129853866")

[@Repository注解的作用-CSDN博客](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fwqh0830%2Farticle%2Fdetails%2F96109587 "https://blog.csdn.net/wqh0830/article/details/96109587")

[Spring 注解 @Qualifier 详细解析 - 知乎 (zhihu.com)](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F100371910%3Ffrom_voters_page%3Dtrue "https://zhuanlan.zhihu.com/p/100371910?from_voters_page=true")