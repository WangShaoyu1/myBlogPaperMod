---
author: "小u"
title: "springboot优雅的改进你的输出日志，让你快速的定位问题超详细的初始化教程"
date: 2024-04-13
description: "springboot优雅的改进你的输出日志，让你快速的定位问题超详细的初始化教程一个好的项目，一定会输出很多的日志，来让开发者，快速的去定位一些问题。下面我将带来一些在springboot中，你可"
tags: ["后端","面试","Java"]
ShowReadingTime: "阅读4分钟"
weight: 203
---
springboot优雅的改进你的输出日志，让你快速的定位问题 超详细的初始化教程
-----------------------------------------

一个好的项目，一定会输出很多的日志，来让开发者，快速的去定位一些问题。下面我将带来一些在springboot中，你可以选择做的初始化技巧。这些都是比较通用的，可以直接进行复制使用，所以我这里不做过多的讲解。

项目状态监听
------

这个是用来监听你的项目是否正确的运行。

typescript

 代码解读

复制代码

`package com.xiaou.listener; ​ import lombok.extern.slf4j.Slf4j; import org.springframework.boot.ansi.AnsiColor; import org.springframework.boot.ansi.AnsiOutput; import org.springframework.boot.context.event.ApplicationReadyEvent; import org.springframework.context.ApplicationListener; import org.springframework.stereotype.Component; ​ /**  * 项目启动成功日志打印监听器  */ @Component @Slf4j public class StartedListener implements ApplicationListener<ApplicationReadyEvent> { ​     /**      * 项目启动成功将会在日志中输出对应的启动信息      *      * @param applicationReadyEvent      */     @Override     public void onApplicationEvent(ApplicationReadyEvent applicationReadyEvent) {         String serverPort = applicationReadyEvent.getApplicationContext().getEnvironment().getProperty("server.port");         String serverUrl = String.format("http://%s:%s", "127.0.0.1", serverPort);         log.info(AnsiOutput.toString(AnsiColor.BRIGHT_BLUE, "your project server started at: ", serverUrl));         log.info(AnsiOutput.toString(AnsiColor.BRIGHT_BLUE, "your project server's doc started at:", serverUrl + "/doc.html"));         log.info(AnsiOutput.toString(AnsiColor.BRIGHT_YELLOW, "your project server has started successfully!"));     } }`

这个实现的功能如下：

![image-20240413192231879](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/108557b9192d4d02893484d260ffa547~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2331&h=319&s=98880&e=png&b=1e1f22)

请求方法监听
------

ini

 代码解读

复制代码

`package com.xiaou.log; ​ import com.alibaba.fastjson.JSON; import com.google.common.collect.Maps; import org.apache.commons.lang3.StringUtils; import org.apache.commons.lang3.time.StopWatch; import org.springframework.web.bind.annotation.RequestMethod; import org.springframework.web.util.ContentCachingRequestWrapper; import org.springframework.web.util.ContentCachingResponseWrapper; ​ import javax.servlet.http.HttpServletRequest; import javax.servlet.http.HttpServletResponse; import java.util.Enumeration; import java.util.Map; import java.util.Objects; ​ /**  * HttpLogEntity构造器  */ public class HttpLogEntityBuilder { ​     /**      * 构建HTTP日志对象      *      * @param requestWrapper      * @param responseWrapper      * @param stopWatch      * @return      */     public static HttpLogEntity build(ContentCachingRequestWrapper requestWrapper, ContentCachingResponseWrapper responseWrapper, StopWatch stopWatch) {         HttpLogEntity httpLogEntity = new HttpLogEntity();         httpLogEntity.setRequestUri(requestWrapper.getRequestURI())                 .setMethod(requestWrapper.getMethod())                 .setRemoteAddr(requestWrapper.getRemoteAddr())                 .setIp(getIpAddress(requestWrapper))                 .setRequestHeaders(getRequestHeaderMap(requestWrapper));         if (requestWrapper.getMethod().equals(RequestMethod.GET.name())) {             httpLogEntity.setRequestParams(JSON.toJSONString(requestWrapper.getParameterMap()));         } else {             httpLogEntity.setRequestParams(new String(requestWrapper.getContentAsByteArray()));         }         String responseContentType = responseWrapper.getContentType();         if (StringUtils.equals("application/json;charset=UTF-8", responseContentType)) {             httpLogEntity.setResponseData(new String(responseWrapper.getContentAsByteArray()));         } else {             httpLogEntity.setResponseData("Stream Body...");         }         httpLogEntity.setStatus(responseWrapper.getStatusCode())                 .setResponseHeaders(getResponseHeaderMap(responseWrapper))                 .setResolveTime(stopWatch.toString());         return httpLogEntity;     } ​     /**      * 获取IP地址      *      * @param request      * @return      */     public static String getIpAddress(HttpServletRequest request) {         if (request == null) {             return "unknown";         }         String ip = request.getHeader("x-forwarded-for");         if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {             ip = request.getHeader("Proxy-Client-IP");         }         if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {             ip = request.getHeader("X-Forwarded-For");         }         if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {             ip = request.getHeader("WL-Proxy-Client-IP");         }         if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {             ip = request.getHeader("X-Real-IP");         } ​         if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {             ip = request.getRemoteAddr();         } ​         return "0:0:0:0:0:0:0:1".equals(ip) ? "127.0.0.1" : ip;     } ​     /**      * 获取请求头MAP      *      * @param request      * @return      */     public static Map<String, String> getRequestHeaderMap(HttpServletRequest request) {         Map<String, String> result = Maps.newHashMap();         if (Objects.nonNull(request)) {             Enumeration<String> headerNames = request.getHeaderNames();             if (Objects.nonNull(request)) {                 while (headerNames.hasMoreElements()) {                     String headerName = headerNames.nextElement();                     String headerValue = request.getHeader(headerName);                     result.put(headerName, headerValue);                 }             }         }         return result;     } ​     /**      * 获取响应头MAP      *      * @param response      * @return      */     public static Map<String, String> getResponseHeaderMap(HttpServletResponse response) {         Map<String, String> result = Maps.newHashMap();         if (Objects.nonNull(response)) {             String contentType = response.getContentType();             result.put("contentType", contentType);         }         return result;     } ​ }`

ini

 代码解读

复制代码

`package com.xiaou.log; ​ import lombok.extern.slf4j.Slf4j; import org.apache.commons.lang3.time.StopWatch; import org.springframework.core.annotation.Order; import org.springframework.web.filter.OncePerRequestFilter; import org.springframework.web.util.ContentCachingRequestWrapper; import org.springframework.web.util.ContentCachingResponseWrapper; ​ import javax.servlet.FilterChain; import javax.servlet.ServletException; import javax.servlet.annotation.WebFilter; import javax.servlet.http.HttpServletRequest; import javax.servlet.http.HttpServletResponse; import java.io.IOException; ​ /**  * 打印HTTP调用日志过滤器，使用者可以按需将其注入到过滤器容器中使用  * 这里只提供基础的过滤实现  */ @WebFilter(filterName = "httpLogFilter") @Slf4j @Order(Integer.MAX_VALUE) public class HttpLogFilter extends OncePerRequestFilter { ​     @Override     protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {         StopWatch stopWatch = StopWatch.createStarted();         ContentCachingRequestWrapper requestWrapper = new ContentCachingRequestWrapper(request);         ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(response);         filterChain.doFilter(requestWrapper, responseWrapper);         HttpLogEntity httpLogEntity = HttpLogEntityBuilder.build(requestWrapper, responseWrapper, stopWatch);         httpLogEntity.print();         responseWrapper.copyBodyToResponse();     } ​ }`

less

 代码解读

复制代码

`package com.xiaou.log; ​ import lombok.Getter; import lombok.NoArgsConstructor; import lombok.Setter; import lombok.experimental.Accessors; import lombok.extern.slf4j.Slf4j; import org.apache.commons.lang3.time.DateFormatUtils; ​ import java.util.Date; import java.util.Map; ​ /**  * http调用日志实体  */ @NoArgsConstructor @Getter @Setter @Accessors(chain = true) @Slf4j public class HttpLogEntity { ​     /**      * 请求资源      */     private String requestUri; ​     /**      * 被调方法      */     private String method; ​     /**      * 调用者地址      */     private String remoteAddr; ​     /**      * 调用的IP地址      */     private String ip; ​     /**      * 请求头      */     private Map<String, String> requestHeaders; ​     /**      * 请求参数      */     private String requestParams; ​     /**      * 响应状态      */     private Integer status; ​     /**      * 响应头      */     private Map<String, String> responseHeaders; ​     /**      * 响应数据      */     private String responseData; ​     /**      * 接口耗时      */     private String resolveTime; ​     /**      * 打印日志      */     public void print() {         log.info("====================HTTP CALL START====================");         log.info("callTime: {}", DateFormatUtils.ISO_8601_EXTENDED_DATETIME_FORMAT.format(new Date()));         log.info("requestUri: {}", getRequestUri());         log.info("method: {}", getMethod());         log.info("remoteAddr: {}", getRemoteAddr());         log.info("ip: {}", getIp());         log.info("requestHeaders: {}", getRequestHeaders());         log.info("requestParams: {}", getRequestParams());         log.info("status: {}", getStatus());         log.info("responseHeaders: {}", getResponseHeaders());         log.info("responseData: {}", getResponseData());         log.info("resolveTime: {}", getResolveTime());         log.info("====================HTTP CALL FINISH====================");     } ​     @Override     public String toString() {         StringBuilder stringBuilder = new StringBuilder();         stringBuilder.append("====================HTTP CALL START====================");         stringBuilder.append("callTime: ");         stringBuilder.append(DateFormatUtils.ISO_8601_EXTENDED_DATETIME_FORMAT.format(new Date()));         stringBuilder.append(System.lineSeparator()); ​         stringBuilder.append("requestUri: ");         stringBuilder.append(getRequestUri());         stringBuilder.append(System.lineSeparator()); ​         stringBuilder.append("method: ");         stringBuilder.append(getMethod());         stringBuilder.append(System.lineSeparator()); ​         stringBuilder.append("remoteAddr: ");         stringBuilder.append(getRemoteAddr());         stringBuilder.append(System.lineSeparator()); ​         stringBuilder.append("ip: ");         stringBuilder.append(getIp());         stringBuilder.append(System.lineSeparator()); ​         stringBuilder.append("requestHeaders: ");         stringBuilder.append(getRequestHeaders());         stringBuilder.append(System.lineSeparator()); ​         stringBuilder.append("requestParams: ");         stringBuilder.append(getRequestParams());         stringBuilder.append(System.lineSeparator()); ​         stringBuilder.append("status: ");         stringBuilder.append(getStatus());         stringBuilder.append(System.lineSeparator()); ​         stringBuilder.append("responseHeaders: ");         stringBuilder.append(getResponseHeaders());         stringBuilder.append(System.lineSeparator()); ​ ​         stringBuilder.append("responseData: ");         stringBuilder.append(getResponseData());         stringBuilder.append(System.lineSeparator()); ​ ​         stringBuilder.append("resolveTime: ");         stringBuilder.append(getResolveTime());         stringBuilder.append(System.lineSeparator()); ​         stringBuilder.append("====================HTTP CALL FINISH====================");         return stringBuilder.toString();     } ​ }`

实现功能：

![image-20240413193015032](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbf1349f33894806b45022b0faa3b3e2~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2170&h=801&s=94348&e=png&b=1e1f22)

需要注意的是，要像让这个拦截器生效，需要在springboot启动类添加@ServletComponentScan

跨域
--

java

 代码解读

复制代码

`package com.xiaou.cors; ​ import lombok.AllArgsConstructor; import lombok.Getter; import org.springframework.core.annotation.Order; ​ import javax.servlet.*; import javax.servlet.annotation.WebFilter; import javax.servlet.http.HttpServletResponse; import java.io.IOException; ​ /**  * 支持跨域全局过滤器  */ @WebFilter(filterName = "corsFilter") @Order(1) public class CorsFilter implements Filter { ​     @Override     public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {         HttpServletResponse response = (HttpServletResponse) servletResponse;         addCorsResponseHeader(response);         filterChain.doFilter(servletRequest, servletResponse);     } ​     /**      * 添加跨域的响应头      *      * @param response      */     private void addCorsResponseHeader(HttpServletResponse response) {         response.setHeader(CorsConfigEnum.CORS_ORIGIN.getKey(), CorsConfigEnum.CORS_ORIGIN.getValue());         response.setHeader(CorsConfigEnum.CORS_CREDENTIALS.getKey(), CorsConfigEnum.CORS_CREDENTIALS.getValue());         response.setHeader(CorsConfigEnum.CORS_METHODS.getKey(), CorsConfigEnum.CORS_METHODS.getValue());         response.setHeader(CorsConfigEnum.CORS_MAX_AGE.getKey(), CorsConfigEnum.CORS_MAX_AGE.getValue());         response.setHeader(CorsConfigEnum.CORS_HEADERS.getKey(), CorsConfigEnum.CORS_HEADERS.getValue());     } ​     /**      * 跨域设置枚举类      */     @AllArgsConstructor     @Getter     public enum CorsConfigEnum {         /**          * 允许所有远程访问          */         CORS_ORIGIN("Access-Control-Allow-Origin", "*"),         /**          * 允许认证          */         CORS_CREDENTIALS("Access-Control-Allow-Credentials", "true"),         /**          * 允许远程调用的请求类型          */         CORS_METHODS("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE, PUT"),         /**          * 指定本次预检请求的有效期，单位是秒          */         CORS_MAX_AGE("Access-Control-Max-Age", "3600"),         /**          * 允许所有请求头          */         CORS_HEADERS("Access-Control-Allow-Headers", "*"); ​         private String key;         private String value; ​     } ​ }`

这个就不多说了。

banner
------

最后再来一个这个可能知道的人很多，也算是一点乐趣吧，就是在resouce目录里面添加上banner.txt这个文件。之后文件里面的内容，就是会在springboot启动前所打印。

> 这个华而不实，自己练手项目可以玩一玩

例如我经常用的一个七彩大佛

![image-20240413193335822](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/898ff44b2a73479a9a59d8c34fe6757f~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1475&h=1071&s=66243&e=png&b=1e1f22)

附上代码：

ruby

 代码解读

复制代码

```${AnsiColor.BRIGHT_GREEN}$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ ${AnsiColor.BRIGHT_YELLOW}$$                                _.ooOoo._                               $$ ${AnsiColor.BRIGHT_RED}$$                               o888888888o                              $$ ${AnsiColor.BRIGHT_CYAN}$$                               88"  .  "88                              $$ ${AnsiColor.BRIGHT_MAGENTA}$$                               (|  ^_^  |)                              $$ ${AnsiColor.BRIGHT_GREEN}$$                               O\   =   /O                              $$ ${AnsiColor.BRIGHT_RED}$$                            ____/`-----'____                           $$ ${AnsiColor.BRIGHT_CYAN}$$                          .'  \|       |$$  `.                         $$ ${AnsiColor.BRIGHT_MAGENTA}$$                         /  \|||   :   |||$$  \                        $$ ${AnsiColor.BRIGHT_GREEN}$$                        /  _|||||  -:-  |||||-  \                       $$ ${AnsiColor.BRIGHT_YELLOW}$$                        |   | \\   -   $$/ |   |                       $$ ${AnsiColor.BRIGHT_GREEN}$$                        | _|  ''-----/''  |   |                       $$ ${AnsiColor.BRIGHT_YELLOW}$$                        \  .-___  `-`  ____/-. /                       $$ ${AnsiColor.BRIGHT_CYAN}$$                      ___`. .'   /--.--\   `. . ___                     $$ ${AnsiColor.BRIGHT_RED}$$                    ."" '<  `._____<|>_/____.'  >'"".                  $$ ${AnsiColor.BRIGHT_GREEN}$$                  | | :  `- `.;`.\ _ /``;.`/ - ` : | |                 $$ ${AnsiColor.BRIGHT_YELLOW}$$                  \  \ `-.   _ ___\ /___ _/   .-` /  /                 $$ ${AnsiColor.BRIGHT_CYAN}$$            ========`-.____`-._________/____.-`____.-'========         $$ ${AnsiColor.BRIGHT_MAGENTA}$$                                  `=---='                               $$ ${AnsiColor.BRIGHT_YELLOW}$$            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^        $$ ${AnsiColor.BRIGHT_GREEN}$$                     佛祖保佑          永无BUG         永不修改            $$ ${AnsiColor.BRIGHT_YELLOW}$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ ${AnsiColor.BRIGHT_YELLOW}```