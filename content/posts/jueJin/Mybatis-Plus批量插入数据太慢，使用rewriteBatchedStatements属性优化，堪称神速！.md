---
author: "DT辰白"
title: "Mybatis-Plus批量插入数据太慢，使用rewriteBatchedStatements属性优化，堪称神速！"
date: 2021-06-14
description: "前言最近小编手上一堆项目，实在特别忙，每天一堆批量操作，更新、导入、新增、删除，公司使用的Mybatis-Plus操作SQL，用过Mybatis-Plus的小伙伴一定知道他有很多API提供给我们使用"
tags: ["MySQL"]
ShowReadingTime: "阅读2分钟"
weight: 1093
---
前言
==

最近小编手上一堆项目，实在特别忙，每天一堆批量操作，更新、导入、新增、删除，公司使用的Mybatis-Plus操作SQL，用过Mybatis-Plus的小伙伴一定知道他有很多API提供给我们使用，真爽，再不用写那么多繁琐的SQL语句，**saveBatch**是Plus的批量插入函数，大家平时工作肯定都用过，下面我们就来一个案例进入今天的主题。

* * *

一、rewriteBatchedStatements参数
============================

> MySQL的JDBC连接的url中要加rewriteBatchedStatements参数，并保证5.1.13以上版本的驱动，才能实现高性能的批量插入。MySQL JDBC驱动在默认情况下会无视executeBatch()语句，把我们期望批量执行的一组sql语句拆散，一条一条地发给MySQL数据库，批量插入实际上是单条插入，直接造成较低的性能。只有把rewriteBatchedStatements参数置为true, 驱动才会帮你批量执行SQL，另外这个选项对INSERT/UPDATE/DELETE都有效

添加rewriteBatchedStatements=true这个参数后的执行速度比较：

二、批量添加员工信息
==========

1.普通saveBatch批量插入
-----------------

我们循环1万次，把每个实例员工对象装到员工集合（List）中,然后调用Mybatis-Plus的saveBatch方法，传入List集合，实现批量员工的插入，然后我们在方法开始结束的地方，计算当前函数执行时长。

java

 代码解读

复制代码

`@PostMapping("/addBath") @ResponseBody public CommonResult<Employee> addBath(){     long startTime = System.currentTimeMillis();     List<Employee> list = new ArrayList<>();     // 循环批量添加1万条员工数据     for (int i = 0; i < 10000; i++) {         Employee employee = new Employee();         employee.setName("DT测试"+i);         employee.setAge(20);         employee.setSalary(9000D);         employee.setDepartmentId(i);         list.add(employee);     }     boolean batch = employeeService.saveBatch(list);     if(batch){         long endTime = System.currentTimeMillis();         System.out.println("函数执行时间：" + (endTime - startTime) + "ms");         return CommonResult.success();     }     return CommonResult.error(); }`

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3f28e3f19e24f5db32411e07f4e2cf4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 为了测试的细致，我多点了几下这个方法，下面是每次记录的时长：

**批量添加1万条员工数据，测试结果如下：**

第一次：（2秒多）

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cec8cad4c29b48e5b45c75aca406ca8f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 第二次：（接近2秒）

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db104e0135b1415baa81d4d532dc44d0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

第三次：（接近2秒）

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/131ef7311fce4797845befa574abe7b8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

差不多添加1万条数据在2秒左右，这个时候我们加大量10万条，再测试：

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6fb00fa2dce3499291b60769f92239c1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**批量添加10万条员工数据，测试结果如下：**

第一次：（19.341 秒）

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8831c0642b9c4e65a97687a1c2d46b56~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

第二次：（18.298 秒）

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e071cb9447d44d38ab70dfacda1e9673~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

顿时我傻了，10万条数据批量添加要20秒左右，这要是再加个10万条，那不崩掉，于是我就各种找解决方案，最后锁定一个数据库连接的属性rewriteBatchedStatements，下面我们就添加上该属性试试速度与激情。

2.设置rewriteBatchedStatements=true批量插入
-------------------------------------

下面我们为数据库的连接加上**rewriteBatchedStatements=true**的属性，再测试批量加入的耗时。

java

 代码解读

复制代码

`rewriteBatchedStatements=true`

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b24de69d278244a0bf601749bc412175~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**批量添加1万条员工数据，测试结果如下：**

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8dd70b6feab64cd8991dd3b026635e08~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

质的飞跃啊！牛逼，可以看出批处理的速度还是非常给力的。

> 1万条数据：2s -->>> 0.5s

**批量添加10万条员工数据，测试结果如下：**

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62c972344b69459a955e9cd427f1ecea~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

效果惊呆了吧？？？直接起飞啊。

> 1万条数据：20s -->>> 5s

总结
==

所以，如果你想验证rewriteBatchedStatements在你的系统里是否已经生效，记得要使用较大的batch，以上就是我的这次总结了，如果有更好的，或者更专业的记得留下你的指教呀～，更多好文请关注[：https://blog.csdn.net/qq\_41107231?spm=1001.2014.3001.5343](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fqq_41107231%3Fspm%3D1001.2014.3001.5343 "https://blog.csdn.net/qq_41107231?spm=1001.2014.3001.5343")