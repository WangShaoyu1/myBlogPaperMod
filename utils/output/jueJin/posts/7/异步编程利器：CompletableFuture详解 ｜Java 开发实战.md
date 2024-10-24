---
author: "捡田螺的小男孩"
title: "异步编程利器：CompletableFuture详解 ｜Java 开发实战"
date: 2021-06-06
description: "我们异步执行一个任务时，一般是用线程池Executor去创建。如果不需要有返回值， 任务实现Runnable接口；如果需要有返回值，任务实现Callable接口，调用Executor的submi"
tags: ["后端","Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读12分钟"
weight: 1
selfDefined:"likes:345,comments:0,collects:765,views:73529,"
---
前言
--

> 文正在参加「Java主题月 - Java 开发实战」，[详情查看 (活动链接)](https://juejin.cn/post/6968267217121050660 "https://juejin.cn/post/6968267217121050660")

我们异步执行一个任务时，一般是用线程池Executor去创建。如果不需要有返回值， 任务实现Runnable接口；如果需要有返回值，任务实现Callable接口，调用Executor的submit方法，再使用Future获取即可。如果多个线程存在依赖组合的话，我们怎么处理呢？可使用同步组件CountDownLatch、CyclicBarrier等，但是比较麻烦。其实有简单的方法，就是用CompeletableFuture。最近刚好使用CompeletableFuture优化了项目中的代码，所以跟大家一起学习CompletableFuture。

![image.png](/images/jueJin/bf8ed4c2fd7a480.png)

*   公众号:**捡田螺的小男孩**
*   [github地址](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fwhx123%2FJavaHome "https://github.com/whx123/JavaHome")

一个例子回顾 Future
-------------

因为CompletableFuture实现了Future接口，我们先来回顾Future吧。

Future是Java5新加的一个接口，它提供了一种异步并行计算的功能。如果主线程需要执行一个很耗时的计算任务，我们就可以通过future把这个任务放到异步线程中执行。主线程继续处理其他任务，处理完成后，再通过Future获取计算结果。

来看个简单例子吧，假设我们有两个任务服务，一个查询用户基本信息，一个是查询用户勋章信息。如下，

```java
    public class UserInfoService {
    
        public UserInfo getUserInfo(Long userId) throws InterruptedException {
        Thread.sleep(300);//模拟调用耗时
        return new UserInfo("666", "捡田螺的小男孩", 27); //一般是查数据库，或者远程调用返回的
    }
}

    public class MedalService {
    
        public MedalInfo getMedalInfo(long userId) throws InterruptedException {
        Thread.sleep(500); //模拟调用耗时
        return new MedalInfo("666", "守护勋章");
    }
}
```

接下来，我们来演示下，在主线程中是如何使用Future来进行异步调用的。

```java
    public class FutureTest {
    
        public static void main(String[] args) throws ExecutionException, InterruptedException {
        
        ExecutorService executorService = Executors.newFixedThreadPool(10);
        
        UserInfoService userInfoService = new UserInfoService();
        MedalService medalService = new MedalService();
        long userId =666L;
        long startTime = System.currentTimeMillis();
        
        //调用用户服务获取用户基本信息
            FutureTask<UserInfo> userInfoFutureTask = new FutureTask<>(new Callable<UserInfo>() {
            @Override
                public UserInfo call() throws Exception {
                return userInfoService.getUserInfo(userId);
            }
            });
            executorService.submit(userInfoFutureTask);
            
            Thread.sleep(300); //模拟主线程其它操作耗时
            
                FutureTask<MedalInfo> medalInfoFutureTask = new FutureTask<>(new Callable<MedalInfo>() {
                @Override
                    public MedalInfo call() throws Exception {
                    return medalService.getMedalInfo(userId);
                }
                });
                executorService.submit(medalInfoFutureTask);
                
                UserInfo userInfo = userInfoFutureTask.get();//获取个人信息结果
                MedalInfo medalInfo = medalInfoFutureTask.get();//获取勋章信息结果
                
                System.out.println("总共用时" + (System.currentTimeMillis() - startTime) + "ms");
            }
        }
        
```

运行结果:

```
总共用时806ms
```

如果我们不使用Future进行并行异步调用，而是在主线程串行进行的话，耗时大约为300+500+300 = 1100 ms。可以发现，**future+线程池**异步配合，提高了程序的执行效率。

但是Future对于结果的获取，不是很友好，只能通过**阻塞**或者**轮询的方式**得到任务的结果。

*   Future.get() 就是阻塞调用，在线程获取结果之前**get方法会一直阻塞**。
*   Future提供了一个isDone方法，可以在程序中**轮询这个方法查询**执行结果。

**阻塞的方式和异步编程的设计理念相违背，而轮询的方式会耗费无谓的CPU资源**。因此，JDK8设计出CompletableFuture。CompletableFuture提供了一种观察者模式类似的机制，可以让任务执行完成后通知监听的一方。

一个例子走进CompletableFuture
-----------------------

我们还是基于以上Future的例子，改用CompletableFuture 来实现

```ini
    public class FutureTest {
    
        public static void main(String[] args) throws InterruptedException, ExecutionException, TimeoutException {
        
        UserInfoService userInfoService = new UserInfoService();
        MedalService medalService = new MedalService();
        long userId =666L;
        long startTime = System.currentTimeMillis();
        
        //调用用户服务获取用户基本信息
        CompletableFuture<UserInfo> completableUserInfoFuture = CompletableFuture.supplyAsync(() -> userInfoService.getUserInfo(userId));
        
        Thread.sleep(300); //模拟主线程其它操作耗时
        
        CompletableFuture<MedalInfo> completableMedalInfoFuture = CompletableFuture.supplyAsync(() -> medalService.getMedalInfo(userId));
        
        UserInfo userInfo = completableUserInfoFuture.get(2,TimeUnit.SECONDS);//获取个人信息结果
        MedalInfo medalInfo = completableMedalInfoFuture.get();//获取勋章信息结果
        System.out.println("总共用时" + (System.currentTimeMillis() - startTime) + "ms");
        
    }
}
```

可以发现，使用CompletableFuture，代码简洁了很多。CompletableFuture的supplyAsync方法，提供了异步执行的功能，线程池也不用单独创建了。实际上，它CompletableFuture使用了默认线程池是**ForkJoinPool.commonPool**。

CompletableFuture提供了几十种方法，辅助我们的异步任务场景。这些方法包括**创建异步任务、任务异步回调、多个任务组合处理**等方面。我们一起来学习吧

CompletableFuture使用场景
---------------------

![image.png](/images/jueJin/0fb5ce9a8da7473.png)

### 创建异步任务

CompletableFuture创建异步任务，一般有supplyAsync和runAsync两个方法

![image.png](/images/jueJin/3fea04421bac41e.png)

*   supplyAsync执行CompletableFuture任务，支持返回值
*   runAsync执行CompletableFuture任务，没有返回值。

#### supplyAsync方法

```swift
//使用默认内置线程池ForkJoinPool.commonPool()，根据supplier构建执行任务
public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier)
//自定义线程，根据supplier构建执行任务
public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier, Executor executor)
```

#### runAsync方法

```java
//使用默认内置线程池ForkJoinPool.commonPool()，根据runnable构建执行任务
public static CompletableFuture<Void> runAsync(Runnable runnable)
//自定义线程，根据runnable构建执行任务
public static CompletableFuture<Void> runAsync(Runnable runnable,  Executor executor)
```

实例代码如下：

```csharp
    public class FutureTest {
    
        public static void main(String[] args) {
        //可以自定义线程池
        ExecutorService executor = Executors.newCachedThreadPool();
        //runAsync的使用
        CompletableFuture<Void> runFuture = CompletableFuture.runAsync(() -> System.out.println("run,关注公众号:捡田螺的小男孩"), executor);
        //supplyAsync的使用
            CompletableFuture<String> supplyFuture = CompletableFuture.supplyAsync(() -> {
            System.out.print("supply,关注公众号:捡田螺的小男孩");
            return "捡田螺的小男孩"; }, executor);
            //runAsync的future没有返回值，输出null
            System.out.println(runFuture.join());
            //supplyAsync的future，有返回值
            System.out.println(supplyFuture.join());
            executor.shutdown(); // 线程池需要关闭
        }
    }
    //输出
    run,关注公众号:捡田螺的小男孩
    null
    supply,关注公众号:捡田螺的小男孩捡田螺的小男孩
    
```

### 任务异步回调

![image.png](/images/jueJin/148d40ed2ee74f4.png)

#### 1\. thenRun/thenRunAsync

```arduino
public CompletableFuture<Void> thenRun(Runnable action);
public CompletableFuture<Void> thenRunAsync(Runnable action);
```

CompletableFuture的thenRun方法，通俗点讲就是，**做完第一个任务后，再做第二个任务**。某个任务执行完成后，执行回调方法；但是前后两个任务**没有参数传递，第二个任务也没有返回值**

```csharp
    public class FutureThenRunTest {
    
        public static void main(String[] args) throws ExecutionException, InterruptedException {
        
        CompletableFuture<String> orgFuture = CompletableFuture.supplyAsync(
            ()->{
            System.out.println("先执行第一个CompletableFuture方法任务");
            return "捡田螺的小男孩";
        }
        );
        
            CompletableFuture thenRunFuture = orgFuture.thenRun(() -> {
            System.out.println("接着执行第二个任务");
            });
            
            System.out.println(thenRunFuture.get());
        }
    }
    //输出
    先执行第一个CompletableFuture方法任务
    接着执行第二个任务
    null
```

**thenRun 和thenRunAsync有什么区别呢**？可以看下源码哈：

```java
private static final Executor asyncPool = useCommonPool ?
ForkJoinPool.commonPool() : new ThreadPerTaskExecutor();

    public CompletableFuture<Void> thenRun(Runnable action) {
    return uniRunStage(null, action);
}

    public CompletableFuture<Void> thenRunAsync(Runnable action) {
    return uniRunStage(asyncPool, action);
}
```

如果你执行第一个任务的时候，传入了一个自定义线程池：

*   调用thenRun方法执行第二个任务时，则第二个任务和第一个任务是**共用同一个线程池**。
*   调用thenRunAsync执行第二个任务时，则第一个任务使用的是你自己传入的线程池，**第二个任务使用的是ForkJoin线程池**

**TIPS:** 后面介绍的thenAccept和thenAcceptAsync，thenApply和thenApplyAsync等，它们之间的区别也是这个哈。

#### 2.thenAccept/thenAcceptAsync

CompletableFuture的thenAccept方法表示，第一个任务执行完成后，执行第二个回调方法任务，会将该任务的执行结果，作为入参，传递到回调方法中，但是回调方法是**没有返回值**的。

```csharp
    public class FutureThenAcceptTest {
    
        public static void main(String[] args) throws ExecutionException, InterruptedException {
        
        CompletableFuture<String> orgFuture = CompletableFuture.supplyAsync(
            ()->{
            System.out.println("原始CompletableFuture方法任务");
            return "捡田螺的小男孩";
        }
        );
        
            CompletableFuture thenAcceptFuture = orgFuture.thenAccept((a) -> {
                if ("捡田螺的小男孩".equals(a)) {
                System.out.println("关注了");
            }
            
            System.out.println("先考虑考虑");
            });
            
            System.out.println(thenAcceptFuture.get());
        }
    }
```

#### 3\. thenApply/thenApplyAsync

CompletableFuture的thenApply方法表示，第一个任务执行完成后，执行第二个回调方法任务，会将该任务的执行结果，作为入参，传递到回调方法中，并且回调方法是有返回值的。

```csharp
    public class FutureThenApplyTest {
    
        public static void main(String[] args) throws ExecutionException, InterruptedException {
        
        CompletableFuture<String> orgFuture = CompletableFuture.supplyAsync(
            ()->{
            System.out.println("原始CompletableFuture方法任务");
            return "捡田螺的小男孩";
        }
        );
        
            CompletableFuture<String> thenApplyFuture = orgFuture.thenApply((a) -> {
                if ("捡田螺的小男孩".equals(a)) {
                return "关注了";
            }
            
            return "先考虑考虑";
            });
            
            System.out.println(thenApplyFuture.get());
        }
    }
    //输出
    原始CompletableFuture方法任务
    关注了
```

#### 4\. exceptionally

CompletableFuture的exceptionally方法表示，某个任务执行异常时，执行的回调方法;并且有**抛出异常作为参数**，传递到回调方法。

```php
    public class FutureExceptionTest {
    
        public static void main(String[] args) throws ExecutionException, InterruptedException {
        
        CompletableFuture<String> orgFuture = CompletableFuture.supplyAsync(
            ()->{
            System.out.println("当前线程名称：" + Thread.currentThread().getName());
            throw new RuntimeException();
        }
        );
        
            CompletableFuture<String> exceptionFuture = orgFuture.exceptionally((e) -> {
            e.printStackTrace();
            return "你的程序异常啦";
            });
            
            System.out.println(exceptionFuture.get());
        }
    }
    //输出
    当前线程名称：ForkJoinPool.commonPool-worker-1
    java.util.concurrent.CompletionException: java.lang.RuntimeException
    at java.util.concurrent.CompletableFuture.encodeThrowable(CompletableFuture.java:273)
    at java.util.concurrent.CompletableFuture.completeThrowable(CompletableFuture.java:280)
    at java.util.concurrent.CompletableFuture$AsyncSupply.run(CompletableFuture.java:1592)
    at java.util.concurrent.CompletableFuture$AsyncSupply.exec(CompletableFuture.java:1582)
    at java.util.concurrent.ForkJoinTask.doExec(ForkJoinTask.java:289)
    at java.util.concurrent.ForkJoinPool$WorkQueue.runTask(ForkJoinPool.java:1056)
    at java.util.concurrent.ForkJoinPool.runWorker(ForkJoinPool.java:1692)
    at java.util.concurrent.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:157)
    Caused by: java.lang.RuntimeException
    at cn.eovie.future.FutureWhenTest.lambda$main$0(FutureWhenTest.java:13)
    at java.util.concurrent.CompletableFuture$AsyncSupply.run(CompletableFuture.java:1590)
    ... 5 more
    你的程序异常啦
```

#### 5\. whenComplete方法

CompletableFuture的whenComplete方法表示，某个任务执行完成后，执行的回调方法，**无返回值**；并且whenComplete方法返回的CompletableFuture的**result是上个任务的结果**。

```csharp
    public class FutureWhenTest {
    
        public static void main(String[] args) throws ExecutionException, InterruptedException {
        
        CompletableFuture<String> orgFuture = CompletableFuture.supplyAsync(
            ()->{
            System.out.println("当前线程名称：" + Thread.currentThread().getName());
                try {
                Thread.sleep(2000L);
                    } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                return "捡田螺的小男孩";
            }
            );
            
                CompletableFuture<String> rstFuture = orgFuture.whenComplete((a, throwable) -> {
                System.out.println("当前线程名称：" + Thread.currentThread().getName());
                System.out.println("上个任务执行完啦，还把" + a + "传过来");
                    if ("捡田螺的小男孩".equals(a)) {
                    System.out.println("666");
                }
                System.out.println("233333");
                });
                
                System.out.println(rstFuture.get());
            }
        }
        //输出
        当前线程名称：ForkJoinPool.commonPool-worker-1
        当前线程名称：ForkJoinPool.commonPool-worker-1
        上个任务执行完啦，还把捡田螺的小男孩传过来
        666
        233333
        捡田螺的小男孩
```

#### 6\. handle方法

CompletableFuture的handle方法表示，**某个任务执行完成后，执行回调方法，并且是有返回值的**;并且handle方法返回的CompletableFuture的result是**回调方法**执行的结果。

```csharp
    public class FutureHandlerTest {
    
        public static void main(String[] args) throws ExecutionException, InterruptedException {
        
        CompletableFuture<String> orgFuture = CompletableFuture.supplyAsync(
            ()->{
            System.out.println("当前线程名称：" + Thread.currentThread().getName());
                try {
                Thread.sleep(2000L);
                    } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                return "捡田螺的小男孩";
            }
            );
            
                CompletableFuture<String> rstFuture = orgFuture.handle((a, throwable) -> {
                
                System.out.println("上个任务执行完啦，还把" + a + "传过来");
                    if ("捡田螺的小男孩".equals(a)) {
                    System.out.println("666");
                    return "关注了";
                }
                System.out.println("233333");
                return null;
                });
                
                System.out.println(rstFuture.get());
            }
        }
        //输出
        当前线程名称：ForkJoinPool.commonPool-worker-1
        上个任务执行完啦，还把捡田螺的小男孩传过来
        666
        关注了
```

### 多个任务组合处理

![image.png](/images/jueJin/67db247b585a48b.png)

#### AND组合关系

![image.png](/images/jueJin/38ce935a546c42c.png)

thenCombine / thenAcceptBoth / runAfterBoth都表示：**将两个CompletableFuture组合起来，只有这两个都正常执行完了，才会执行某个任务**。

区别在于：

*   thenCombine：会将两个任务的执行结果作为方法入参，传递到指定方法中，且**有返回值**
*   thenAcceptBoth: 会将两个任务的执行结果作为方法入参，传递到指定方法中，且**无返回值**
*   runAfterBoth 不会把执行结果当做方法入参，且没有返回值。

```arduino
    public class ThenCombineTest {
    
        public static void main(String[] args) throws InterruptedException, ExecutionException, TimeoutException {
        
        CompletableFuture<String> first = CompletableFuture.completedFuture("第一个异步任务");
        ExecutorService executor = Executors.newFixedThreadPool(10);
        CompletableFuture<String> future = CompletableFuture
        //第二个异步任务
        .supplyAsync(() -> "第二个异步任务", executor)
        // (w, s) -> System.out.println(s) 是第三个任务
            .thenCombineAsync(first, (s, w) -> {
            System.out.println(w);
            System.out.println(s);
            return "两个异步任务的组合";
            }, executor);
            System.out.println(future.join());
            executor.shutdown();
            
        }
    }
    //输出
    第一个异步任务
    第二个异步任务
    两个异步任务的组合
```

#### OR 组合的关系

![image.png](/images/jueJin/2d5e83e5fc4b404.png)

applyToEither / acceptEither / runAfterEither 都表示：将两个CompletableFuture组合起来，只要其中一个执行完了,就会执行某个任务。

区别在于：

*   applyToEither：会将已经执行完成的任务，作为方法入参，传递到指定方法中，且有返回值
*   acceptEither: 会将已经执行完成的任务，作为方法入参，传递到指定方法中，且无返回值
*   runAfterEither： 不会把执行结果当做方法入参，且没有返回值。

```kotlin
    public class AcceptEitherTest {
        public static void main(String[] args) {
        //第一个异步任务，休眠2秒，保证它执行晚点
            CompletableFuture<String> first = CompletableFuture.supplyAsync(()->{
                try{
                
                Thread.sleep(2000L);
            System.out.println("执行完第一个异步任务");}
                catch (Exception e){
                return "第一个任务异常";
            }
            return "第一个异步任务";
            });
            ExecutorService executor = Executors.newSingleThreadExecutor();
            CompletableFuture<Void> future = CompletableFuture
            //第二个异步任务
                .supplyAsync(() -> {
                System.out.println("执行完第二个任务");
            return "第二个任务";}
            , executor)
            //第三个任务
            .acceptEitherAsync(first, System.out::println, executor);
            
            executor.shutdown();
        }
    }
    //输出
    执行完第二个任务
    第二个任务
```

### AllOf

所有任务都执行完成后，才执行 allOf返回的CompletableFuture。如果任意一个任务异常，allOf的CompletableFuture，执行get方法，会抛出异常

```kotlin
    public class allOfFutureTest {
        public static void main(String[] args) throws ExecutionException, InterruptedException {
        
            CompletableFuture<Void> a = CompletableFuture.runAsync(()->{
            System.out.println("我执行完了");
            });
                CompletableFuture<Void> b = CompletableFuture.runAsync(() -> {
                System.out.println("我也执行完了");
                });
                    CompletableFuture<Void> allOfFuture = CompletableFuture.allOf(a, b).whenComplete((m,k)->{
                    System.out.println("finish");
                    });
                }
            }
            //输出
            我执行完了
            我也执行完了
            finish
```

### AnyOf

任意一个任务执行完，就执行anyOf返回的CompletableFuture。如果执行的任务异常，anyOf的CompletableFuture，执行get方法，会抛出异常

```csharp
    public class AnyOfFutureTest {
        public static void main(String[] args) throws ExecutionException, InterruptedException {
        
            CompletableFuture<Void> a = CompletableFuture.runAsync(()->{
                try {
                Thread.sleep(3000L);
                    } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("我执行完了");
                });
                    CompletableFuture<Void> b = CompletableFuture.runAsync(() -> {
                    System.out.println("我也执行完了");
                    });
                        CompletableFuture<Object> anyOfFuture = CompletableFuture.anyOf(a, b).whenComplete((m,k)->{
                        System.out.println("finish");
                        //            return "捡田螺的小男孩";
                        });
                        anyOfFuture.join();
                    }
                }
                //输出
                我也执行完了
                finish
```

### thenCompose

thenCompose方法会在某个任务执行完成后，将该任务的执行结果,作为方法入参,去执行指定的方法。该方法会返回一个新的CompletableFuture实例

*   如果该CompletableFuture实例的result不为null，则返回一个基于该result新的CompletableFuture实例；
*   如果该CompletableFuture实例为null，然后就执行这个新任务

```arduino
    public class ThenComposeTest {
        public static void main(String[] args) throws ExecutionException, InterruptedException {
        
        CompletableFuture<String> f = CompletableFuture.completedFuture("第一个任务");
        //第二个异步任务
        ExecutorService executor = Executors.newSingleThreadExecutor();
        CompletableFuture<String> future = CompletableFuture
        .supplyAsync(() -> "第二个任务", executor)
            .thenComposeAsync(data -> {
            System.out.println(data); return f; //使用第一个任务作为返回
            }, executor);
            System.out.println(future.join());
            executor.shutdown();
            
        }
    }
    //输出
    第二个任务
    第一个任务
```

CompletableFuture使用有哪些注意点
-------------------------

CompletableFuture 使我们的异步编程更加便利的、代码更加优雅的同时，我们也要关注下它，使用的一些注意点。

![image.png](/images/jueJin/eafdc009ff94437.png)

### 1\. Future需要获取返回值，才能获取异常信息

```ini
ExecutorService executorService = new ThreadPoolExecutor(5, 10, 5L,
TimeUnit.SECONDS, new ArrayBlockingQueue<>(10));
    CompletableFuture<Void> future = CompletableFuture.supplyAsync(() -> {
    int a = 0;
    int b = 666;
    int c = b / a;
    return true;
    },executorService).thenAccept(System.out::println);
    
    //如果不加 get()方法这一行，看不到异常信息
    //future.get();
```

Future需要获取返回值，才能获取到异常信息。如果不加 get()/join()方法，看不到异常信息。小伙伴们使用的时候，注意一下哈,考虑是否加try...catch...或者使用exceptionally方法。

### 2\. CompletableFuture的get()方法是阻塞的。

CompletableFuture的get()方法是阻塞的，如果使用它来获取异步调用的返回值，需要添加超时时间~

```csharp
//反例
CompletableFuture.get();
//正例
CompletableFuture.get(5, TimeUnit.SECONDS);
```

### 3\. 默认线程池的注意点

CompletableFuture代码中又使用了默认的线程池，处理的线程个数是电脑CPU核数-1。在**大量请求过来的时候，处理逻辑复杂的话，响应会很慢**。一般建议使用自定义线程池，优化线程池配置参数。

### 4\. 自定义线程池时，注意饱和策略

CompletableFuture的get()方法是阻塞的，我们一般建议使用`future.get(3, TimeUnit.SECONDS)`。并且一般建议使用自定义线程池。

但是如果线程池拒绝策略是`DiscardPolicy`或者`DiscardOldestPolicy`，当线程池饱和时，会直接丢弃任务，不会抛弃异常。因此建议，CompletableFuture线程池策略**最好使用AbortPolicy**，然后耗时的异步线程，做好**线程池隔离**哈。

参考与感谢
-----

*   [Java8 CompletableFuture 用法全解](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fqq_31865983%2Farticle%2Fdetails%2F106137777 "https://blog.csdn.net/qq_31865983/article/details/106137777")
*   [详解 java CompletableFuture](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FtDr9Bh0x4RiXU66VknoGOw "https://mp.weixin.qq.com/s/tDr9Bh0x4RiXU66VknoGOw")
*   [基础篇：异步编程不会？我教你啊！](https://juejin.cn/post/6902655550031413262#heading-5 "https://juejin.cn/post/6902655550031413262#heading-5")
*   [CompletableFuture get方法一直阻塞或抛出TimeoutException](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fxiaolyuh123%2Farticle%2Fdetails%2F85023269 "https://blog.csdn.net/xiaolyuh123/article/details/85023269")
*   [编程老司机带你玩转 CompletableFuture 异步编程](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F111841508 "https://zhuanlan.zhihu.com/p/111841508")
*   [解决CompletableFuture异常阻塞](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fweixin_42742643%2Farticle%2Fdetails%2F111638260 "https://blog.csdn.net/weixin_42742643/article/details/111638260")