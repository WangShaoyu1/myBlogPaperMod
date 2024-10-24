---
author: "MacroZheng"
title: "升级 SpringBoot 26x 版本后，Swagger 没法用了。。。"
date: 2022-03-22
description: "最近升级了最新的SpringBoot 26x版本，之前的项目升级后发现有好多坑，不仅有循环依赖的问题，连Swagger都没法用了！今天给大家分享下升级过程，填一填这些坑！"
tags: ["后端","Java","Spring Boot中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:46,comments:13,collects:90,views:14398,"
---
> 最近想体验下最新版本的SpringBoot，逛了下官网，发现SpringBoot目前最新版本已经是`2.6.4`了，版本更新确实够快的。之前的项目升级了`2.6.4`版本后发现有好多坑，不仅有循环依赖的问题，连Swagger都没法用了！今天给大家分享下升级过程，填一填这些坑！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

聊聊SpringBoot版本
--------------

首先我们来聊聊SpringBoot的版本，目前最新版本是`2.6.4`版本，`2.7.x`即将发布，`2.4.x`及以下版本已经停止维护了，目前的主流版本应该是`2.5.x`和`2.6.x`。具体可以看下下面这张表。

![](/images/jueJin/fcb18f9de49c46f.png)

升级过程
----

> 下面我们将之前的`mall-tiny-swagger`项目升级下，看看到底有哪些坑，这些坑该如何解决！

### 添加依赖

首先在`pom.xml`中修改SpringBoot的版本号，注意从`2.4.x`版本开始，SpringBoot就不再使用`.RELEASE`后缀了。

```xml
<parent>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-parent</artifactId>
<version>2.6.4</version>
<relativePath/> <!-- lookup parent from repository -->
</parent>
```

### 循环依赖

*   启动项目后，由于SpringBoot禁止了`循环引用`，我们会遇到第一个问题，`securityConfig`和`umsAdminServiceImpl`循环引用了，具体日志如下；

![](/images/jueJin/d82c3e8aba45499.png)

*   具体来说就是我们的`SecurityConfig`引用了`UmsAdminService`；

![](/images/jueJin/be99b5c5bfb54c5.png)

*   而`UmsAdminServiceImpl`又引用了`PasswordEncoder`；

![](/images/jueJin/4137242ec2504f8.png)

*   由于`SecurityConfig`继承了`WebSecurityConfigurerAdapter`，而Adapter又引用了`PasswordEncoder`，这样就导致了循环引用。

![](/images/jueJin/77d886d150584fd.png)

*   要解决这个问题其实很简单，你可以修改`application.yml`直接允许循环引用，不过这个方法有点粗暴，在没有其他方法的时候可以使用；

```yaml
spring:
main:
allow-circular-references: true
```

*   其实循环引用主要是因为会导致Spring不知道该先创建哪个Bean才会被禁用的，我们可以使用`@Lazy`注解指定某个Bean进行懒加载就可以优雅解决该问题，比如在`SecurityConfig`中懒加载`UmsAdminService`。

![](/images/jueJin/2ccd1d051a1844c.png)

### 启动出错

*   再次启动SpringBoot应用后会出现一个空指针异常，一看就是Swagger问题，原来挺好用的Swagger不能用了！

![](/images/jueJin/9ee9c143f546419.png)

*   在Swagger的配置类中添加如下Bean可以解决该问题；

```java
/**
* Swagger2API文档的配置
*/
@Configuration
    public class Swagger2Config {
    
    @Bean
        public static BeanPostProcessor springfoxHandlerProviderBeanPostProcessor() {
            return new BeanPostProcessor() {
            
            @Override
                public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
                    if (bean instanceof WebMvcRequestHandlerProvider || bean instanceof WebFluxRequestHandlerProvider) {
                    customizeSpringfoxHandlerMappings(getHandlerMappings(bean));
                }
                return bean;
            }
            
                private <T extends RequestMappingInfoHandlerMapping> void customizeSpringfoxHandlerMappings(List<T> mappings) {
                List<T> copy = mappings.stream()
                .filter(mapping -> mapping.getPatternParser() == null)
                .collect(Collectors.toList());
                mappings.clear();
                mappings.addAll(copy);
            }
            
            @SuppressWarnings("unchecked")
                private List<RequestMappingInfoHandlerMapping> getHandlerMappings(Object bean) {
                    try {
                    Field field = ReflectionUtils.findField(bean.getClass(), "handlerMappings");
                    field.setAccessible(true);
                    return (List<RequestMappingInfoHandlerMapping>) field.get(bean);
                        } catch (IllegalArgumentException | IllegalAccessException e) {
                        throw new IllegalStateException(e);
                    }
                }
                };
            }
            
        }
```

### 文档无法显示

*   再次启动后访问Swagger文档，会发现之前好好的文档也无法显示了，访问地址：[http://localhost:8088/swagger-ui/](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8088%2Fswagger-ui%2F "http://localhost:8088/swagger-ui/")

![](/images/jueJin/756ebd19888a4db.png)

*   修改`application.yml`文件，MVC默认的路径匹配策略为`PATH_PATTERN_PARSER`，需要修改为`ANT_PATH_MATCHER`；

```yaml
spring:
mvc:
pathmatch:
matching-strategy: ANT_PATH_MATCHER
```

*   再次启动后发现Swagger已经可以正常使用了！

![](/images/jueJin/18a9e53aa416466.png)

聊聊springfox
-----------

提到Swagger，我们一般在SpringBoot中集成的都是springfox给我们提供的工具库，看了下官网，该项目已经快两年没有发布新版本了。

![](/images/jueJin/6faff6e3373e4ae.png)

再看下Maven仓库中的版本，依旧停留在之前的`3.0.0`版本。如果springfox再不出新版本的话，估计随着SpringBoot版本的更新，兼容性会越来越差的！

![](/images/jueJin/e38a443c4dde4a0.png)

总结
--

今天带大家体验了一把SpringBoot升级`2.6.x`版本的过程，主要解决了循环依赖和Swagger无法使用的问题，希望对大家有所帮助！

如果你想了解更多SpringBoot实战技巧的话，可以试试这个带全套教程的实战项目（50K+Star）：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

参考资料
----

官网地址：[github.com/springfox/s…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fspringfox%2Fspringfox "https://github.com/springfox/springfox")

项目源码地址
------

[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall-learning%2Ftree%2Fmaster%2Fmall-tiny-swagger2 "https://github.com/macrozheng/mall-learning/tree/master/mall-tiny-swagger2")