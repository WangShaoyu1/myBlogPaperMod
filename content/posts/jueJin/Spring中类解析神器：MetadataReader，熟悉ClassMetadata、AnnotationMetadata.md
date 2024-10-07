---
author: "秃了也弱了"
title: "Spring中类解析神器：MetadataReader，熟悉ClassMetadata、AnnotationMetadata"
date: 2024-04-15
description: "@[TOC]一、认识MetadataReader我们平时对一个类的解析，通常会用到反射的技术，比如：在Spring中需要去解析类的信息，比如类名、类中的方法、类上的注解，这些都可以称之为类的元数"
tags: ["后端"]
ShowReadingTime: "阅读3分钟"
weight: 959
---
@\[TOC\]

一、认识MetadataReader
==================

我们平时对一个类的解析，通常会用到反射的技术，比如：

java

 代码解读

复制代码

`Class<?> aClass = Class.forName("com.qstcloud.qcard.portal.context.domain.Test"); aClass.getMethods(); aClass.getDeclaredFields(); // ...`

在Spring中需要去解析类的信息，比如类名、类中的方法、类上的注解，这些都可以称之为类的元数据，所以Spring中对类的元数据做了抽象，并提供了一些工具类。

MetadataReader表示类的元数据读取器，默认实现类为`SimpleMetadataReader`。

需要注意的是，SimpleMetadataReader去解析类时，使用的`ASM`技术。 我们都知道，`Class.forName`执行之后，就会将这个类加载到JVM中，哪怕我们根本用不到这个类，也会被加载。 ​ Spring启动的时候需要去扫描所有的类，如果指定的包路径比较宽泛，那么扫描的类是非常多的，那如果在Spring启动时就把这些类全部加载进JVM了，这样对应用非常不友好，所以使用了ASM技术。

后续我们进一步分析MetadataReader的源码，就知道Spring的处理比我们自己处理到底高明在哪里了。

二、使用MetadataReader
==================

java

 代码解读

复制代码

`SimpleMetadataReaderFactory simpleMetadataReaderFactory = new SimpleMetadataReaderFactory(); // 构造一个MetadataReader MetadataReader metadataReader = simpleMetadataReaderFactory.getMetadataReader("com.test.Test"); // 得到一个ClassMetadata，并获取了类名 ClassMetadata classMetadata = metadataReader.getClassMetadata(); System.out.println(classMetadata.getClassName()); // 获取一个AnnotationMetadata，并获取类上的注解信息 AnnotationMetadata annotationMetadata = metadataReader.getAnnotationMetadata(); for (String annotationType : annotationMetadata.getAnnotationTypes()) {     System.out.println(annotationType); }`

我们可以看到，使用MetadataReader对类进行解析，非常的方便，不需要我们编写大量的反射代码，Spring直接给我们处理好了。

三、源码分析
======

1、认识MetadataReaderFactory
-------------------------

MetadataReaderFactory是一个创建MetadataReader的工厂，有两个方法，可以通过类的全限定名或者类的Resource进行获取MetadataReader：

java

 代码解读

复制代码

`public interface MetadataReaderFactory { 	// 类全限定名 	MetadataReader getMetadataReader(String className) throws IOException; 	// 类的Resource 	MetadataReader getMetadataReader(Resource resource) throws IOException; }`

2、认识MetadataReader
------------------

MetadataReader接口有三个方法：

java

 代码解读

复制代码

`public interface MetadataReader { 	// 获取资源 	Resource getResource(); 	// 获取ClassMetadata，里面包含一个类的基本信息 	ClassMetadata getClassMetadata(); 	// 获取AnnotationMetadata ，里面包含一个类中注解的信息 	AnnotationMetadata getAnnotationMetadata(); }`

3、认识ClassMetadata
-----------------

ClassMetadata是一个接口，它的优势是`以一种不需要加载特定类的形式`定义该类的抽象元数据。 也就是说，通过ClassMetadata获取类的信息，并不需要加载该类的JVM中。

里面包含了获取类基本属性的所有方法，包括类名、类的接口、父类、内部类等等信息。

4、认识AnnotationMetadata
----------------------

AnnotationMetadata是一个接口，它的优势是`以不需要加载特定类的形式`定义对该类注解内容。 也就是说，通过AnnotationMetadata获取类的注解信息，并不需要加载该类的JVM中。

里面包含了获取类中注解的信息。

5、MetadataReader在Spring的应用
--------------------------

Spring在进行包扫描时，就用到了MetadataReader。

因为扫描需要读取包路径下所有的类，所以使用MetadataReader，不需要加载额外的类到JVM中。 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a79692960c2e4cc1b579b3d70b3dcd00~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1526&h=928&s=169766&e=png&b=fefcfc)

6、举一反三：扫描标注了我们自定义注解的所有类
-----------------------

通过Spring的扫描器，我们可以自定义我们自己的扫描器，扫描我们想要的结果：

java

 代码解读

复制代码

`import org.springframework.beans.factory.config.BeanDefinition; import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider; import org.springframework.core.type.classreading.MetadataReader; import org.springframework.core.type.classreading.MetadataReaderFactory; import org.springframework.core.type.filter.TypeFilter; import java.io.IOException; import java.lang.annotation.ElementType; import java.lang.annotation.Retention; import java.lang.annotation.RetentionPolicy; import java.lang.annotation.Target; import java.util.Set; @Target(ElementType.TYPE) @Retention(RetentionPolicy.RUNTIME) @interface MyAnnotation { } @MyAnnotation public class Test {     public static void main(String[] args) throws IOException {         ClassPathScanningCandidateComponentProvider provider = new ClassPathScanningCandidateComponentProvider(false);         provider.addIncludeFilter(new TypeFilter() {             /**              * 自定义过滤器，只扫描标注@MyAnnotation的类              */             @Override             public boolean match(MetadataReader metadataReader, MetadataReaderFactory metadataReaderFactory) throws IOException {                 if (metadataReader.getAnnotationMetadata().hasAnnotation(MyAnnotation.class.getName())) {                     return true;                 }                 return false;             }         });         // 获取扫描结果，并并且会自动封装到BeanDefinition         Set<BeanDefinition> candidateComponents = provider.findCandidateComponents("com.test");         for (BeanDefinition candidateComponent : candidateComponents) {         	// 输出我们Test类             System.out.println(candidateComponent.getBeanClassName());         }     } }`

也可以修改扫描的判断，来扫描我们的接口（比如mybatis的接口）

java

 代码解读

复制代码

`import org.springframework.beans.factory.annotation.AnnotatedBeanDefinition; import org.springframework.beans.factory.config.BeanDefinition; import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider; import org.springframework.core.type.AnnotationMetadata; import org.springframework.core.type.classreading.MetadataReader; import org.springframework.core.type.classreading.MetadataReaderFactory; import org.springframework.core.type.filter.TypeFilter; import java.io.IOException; import java.util.Set; public class Test {     public static void main(String[] args) throws IOException {         ClassPathScanningCandidateComponentProvider provider = new ClassPathScanningCandidateComponentProvider(false){             @Override             protected boolean isCandidateComponent(AnnotatedBeanDefinition beanDefinition) {                 AnnotationMetadata metadata = beanDefinition.getMetadata();                 return metadata.isInterface(); // 只扫接口             }         };         provider.addIncludeFilter(new TypeFilter() {             @Override             public boolean match(MetadataReader metadataReader, MetadataReaderFactory metadataReaderFactory) throws IOException {                 return metadataReader.getClassMetadata().isInterface(); // 只扫接口             }         });         // 获取扫描结果，并并且会自动封装到BeanDefinition         Set<BeanDefinition> candidateComponents = provider.findCandidateComponents("com.test");         for (BeanDefinition candidateComponent : candidateComponents) {         	// 输出我们的所有接口             System.out.println(candidateComponent.getBeanClassName());         }     } }`