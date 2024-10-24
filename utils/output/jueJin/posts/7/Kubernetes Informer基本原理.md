---
author: "政采云技术"
title: "Kubernetes Informer基本原理"
date: 2024-01-30
description: "本文分析 k8s controller 中 informer 启动的基本流程 不论是 k8s 自身组件，还是自己编写 controller，都需要通过 apiserver 监听 etcd 事件来完成自"
tags: ["Kubernetes中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:7,comments:2,collects:2,views:8286,"
---
![文章顶部.png](/images/jueJin/b637793da67b4e0.png) ![avatar](/images/jueJin/5e43f7b747594c4.png)

本文分析 k8s controller 中 informer 启动的基本流程

不论是 k8s 自身组件，还是自己编写 controller，都需要通过 apiserver 监听 etcd 事件来完成自己的控制循环逻辑。

如何高效可靠进行事件监听，k8s 客户端工具包 client-go 提供了一个通用的 informer 包，通过 informer，可以方便和高效的进行 controller 开发。

informer 包提供了如下的一些功能：

1、本地缓存(store)

2、索引机制(indexer)

3、Handler 注册功能(eventHandler)

### 1、informer 架构

整个 informer 机制架构如下图（[图片源自 Client-go](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fkubernetes%2Fsample-controller%2Fblob%2Fmaster%2Fdocs%2Fcontroller-client-go.md "https://github.com/kubernetes/sample-controller/blob/master/docs/controller-client-go.md")）:

![avatar](/images/jueJin/c8f65927a47f40d.png)

可以看到这张图分为上下两个部分，上半部分由 client-go 提供，下半部分则是需要自己实现的控制循环逻辑

本文主要分析上半部分的逻辑，包括下面几个组件：

#### 1.1、Reflector：

从图上可以看到 Reflector 是一个和 apiserver 交互的组件，通过 list 和 watch api 将资源对象压入队列

#### 1.2、DeltaFifo：

DeltaFifo的结构体示意如下：

```c
    type DeltaFIFO struct {
    ...
    // We depend on the property that items in the s    et are in
    // the queue and vice versa, and that all Deltas in this
    // map have at least one Delta.
    items map[string]Deltas
    queue []string
    ...
}
​
```

主要分为两部分，fifo 和 delta

（1）fifo：先进先出队列

对应结构体中的 queue，结构体示例如下：

```arduino
[default/centos-fd77b5886-pfrgn, xxx, xxx]
```

（2）delta：对应结构体中的items，存储了资源对象并且携带了资源操作类型的一个 map，结构体示例如下：

```css
map:{"default/centos-fd77b5886-pfrgn":[{Replaced &Pod{ObjectMeta: ${pod参数}], "xxx": [{},{}]}
```

消费者从 queue 中 pop 出对象进行消费，并从 items 获取具体的消费操作（执行动作 Update/Deleted/Sync，和执行的对象 object spec）

#### 1.3、Indexer：

client-go 用来存储资源对象并自带索引功能的本地存储，deltaFIFO 中 pop 出的对象将存储到 Indexer。

indexer 与 etcd 集群中的数据保持一致，从而 client-go 可以直接从本地缓存获取资源对象，减少 apiserver 和 etcd 集群的压力。

### 2、一个基本例子

```go
    func main() {
    ​
    stopCh := make(chan struct{})
    defer close(stopCh)
    
    // （1）New a k8s clientset
    masterUrl := "172.27.32.110:8080"
    config, err := clientcmd.BuildConfigFromFlags(masterUrl, "")
        if err != nil {
        klog.Errorf("BuildConfigFromFlags err, err: %v", err)
    }
    
    clientset, err := k.NewForConfig(config)
        if err != nil {
        klog.Errorf("Get clientset err, err: %v", err)
    }
    
    // （2）New a sharedInformers factory
    sharedInformers := informers.NewSharedInformerFactory(clientset, defaultResync)
    
    
    // （3）Register a informer
    //  f.informers[informerType] = informer,
    //  the detail for informer is build in NewFilteredPodInformer()
    podInformer := sharedInformers.Core().V1().Pods().Informer()
    
    // （4）Register event handler
        podInformer.AddEventHandler(cache.ResourceEventHandlerFuncs{
            AddFunc: func(obj interface{}) {
            mObj := obj.(v1.Object)
            klog.Infof("Get new obj: %v", mObj)
            klog.Infof("Get new obj name: %s", mObj.GetName())
            },
            })
            
            // （5）Start all informers
            sharedInformers.Start(stopCh)
            
            // （6）A cronjob for cache sync
                if !cache.WaitForCacheSync(stopCh, podInformer.HasSynced) {
                klog.Infof("Cache sync fail!")
            }
            
            // （7）Use lister
            podLister := sharedInformers.Core().V1().Pods().Lister()
            pods, err := podLister.List(labels.Everything())
                if err != nil {
                klog.Infof("err: %v", err)
            }
            klog.Infof("len(pods), %d", len(pods))
                for _, v := range pods {
                klog.Infof("pod: %s", v.Name)
            }
            
            <- stopChan
        }
```

上面就是一个简单的 informer 的使用例子，整个过程如上述几个步骤,着重说一下（2）、（3）、（4）、（5）四个步骤

### 3、流程分析

#### 3.1、New a sharedInformers factory

```go
sharedInformers := informers.NewSharedInformerFactory(clientset, defaultResync)
​
    factory := &sharedInformerFactory{
    client:           client,
    namespace:        v1.NamespaceAll,
    defaultResync:    defaultResync,
    informers:        make(map[reflect.Type]cache.SharedIndexInformer),
    startedInformers: make(map[reflect.Type]bool),
    customResync:     make(map[reflect.Type]time.Duration),
}
```

这个过程就是创建一个 informer 的工厂 sharedInformerFactory，sharedInformerFactory 中有一个 informers 对象，里面是一个 informer 的 map，sharedInformerFactory 是为了防止过多的重复 informer 监听 apiserver，导致 apiserver 压力过大，在同一个服务中，不同的 controller 使用同一个 informer

#### 3.2、Register a informer

这个过程主要是生成和注册 informer 到 sharedInformerFactory

```scss
podInformer := sharedInformers.Core().V1().Pods().Informer()
​
    func (f *podInformer) Informer() cache.SharedIndexInformer {
    return f.factory.InformerFor(&corev1.Pod{}, f.defaultInformer)
}
​
### f.factory.InformerFor:
### 注册 informer
    func (f *sharedInformerFactory) InformerFor(obj runtime.Object, newFunc internalinterfaces.NewInformerFunc) cache.SharedIndexInformer {
    ...
    informer = newFunc(f.client, resyncPeriod)
    f.informers[informerType] = informer
    return informer
}
​
### f.defaultInformer:
### 生成 informer
    func (f *podInformer) defaultInformer(client k.Interface, resyncPeriod time.Duration) cache.SharedIndexInformer {
    return NewFilteredPodInformer(client, f.namespace, resyncPeriod, cache.Indexers{cache.NamespaceIndex: cache.MetaNamespaceIndexFunc}, f.tweakListOptions)
}
​
    func NewFilteredPodInformer(client k.Interface, namespace string, resyncPeriod time.Duration, indexers cache.Indexers, tweakListOptions internalinterfaces.TweakListOptionsFunc) cache.SharedIndexInformer {
    return cache.NewSharedIndexInformer(
        &cache.ListWatch{
            ListFunc: func(options metav1.ListOptions) (runtime.Object, error) {
                if tweakListOptions != nil {
                tweakListOptions(&options)
            }
            return client.CoreV1().Pods(namespace).List(context.TODO(), options)
            },
                WatchFunc: func(options metav1.ListOptions) (watch.Interface, error) {
                    if tweakListOptions != nil {
                    tweakListOptions(&options)
                }
                return client.CoreV1().Pods(namespace).Watch(context.TODO(), options)
                },
                },
                &corev1.Pod{},
                resyncPeriod,
                indexers,
                )
            }
            ​
            ### cache.NewSharedIndexInformer:
                func NewSharedIndexInformer(lw ListerWatcher, exampleObject runtime.Object, defaultEventHandlerResyncPeriod time.Duration, indexers Indexers) SharedIndexInformer {
            realClock := &clock.RealClock{}
                sharedIndexInformer := &sharedIndexInformer{
                processor:                       &sharedProcessor{clock: realClock},
                indexer:                         NewIndexer(DeletionHandlingMetaNamespaceKeyFunc, indexers),
                listerWatcher:                   lw,
                objectType:                      exampleObject,
                resyncCheckPeriod:               defaultEventHandlerResyncPeriod,
                defaultEventHandlerResyncPeriod: defaultEventHandlerResyncPeriod,
                cacheMutationDetector:           NewCacheMutationDetector(fmt.Sprintf("%T", exampleObject)),
                clock:                           realClock,
            }
            return sharedIndexInformer
        }
```

首先通过 f.defaultInformer 方法生成 informer，然后通过 f.factory.InformerFor 方法，将 informer 注册到 sharedInformerFactory

#### 3.3、Register event handler

这个过程展示如何注册一个回调函数，以及如何触发这个回调函数

```go
### podInformer.AddEventHandler：
    func (s *sharedIndexInformer) AddEventHandler(handler ResourceEventHandler) {
    s.AddEventHandlerWithResyncPeriod(handler, s.defaultEventHandlerResyncPeriod)
}
​
    func (s *sharedIndexInformer) AddEventHandlerWithResyncPeriod(handler ResourceEventHandler, resyncPeriod time.Duration) {
    ​
    ...
    listener := newProcessListener(handler, resyncPeriod, determineResyncPeriod(resyncPeriod, s.resyncCheckPeriod), s.clock.Now(),  initialBufferSize)
        if !s.started {
        s.processor.addListener(listener)
        return
    }
    ...
}
​
### s.processor.addListener(listener)：
    func (p *sharedProcessor) addListener(listener *processorListener) {
    p.addListenerLocked(listener)
        if p.listenersStarted {
        p.wg.Start(listener.run)
        p.wg.Start(listener.pop)
    }
}
​
### listener.run：
    func (p *processorListener) run() {
    // this call blocks until the channel is closed.  When a panic happens during the notification
    // we will catch it, **the offending item will be skipped!**, and after a short delay (one second)
    // the next notification will be attempted.  This is usually better than the alternative of never
    // delivering again.
    stopCh := make(chan struct{})
        wait.Until(func() {
            for next := range p.nextCh {
            switch notification := next.(type) {        // 通过next结构体本身的类型来判断事件类型
            case updateNotification:
            p.handler.OnUpdate(notification.oldObj, notification.newObj)
            case addNotification:
            p.handler.OnAdd(notification.newObj)
            case deleteNotification:
            p.handler.OnDelete(notification.oldObj)
            default:
            utilruntime.HandleError(fmt.Errorf("unrecognized notification: %T", next))
        }
    }
    // the only way to get here is if the p.nextCh is empty and closed
    close(stopCh)
    }, 1*time.Second, stopCh)
}
​
### listener.pop：
    func (p *processorListener) pop() {
    ​
var nextCh chan<- interface{}
var notification interface{}
    for {
        select {
        case nextCh <- notification:
        // Notification dispatched
        var ok bool
        notification, ok = p.pendingNotifications.ReadOne()
        if !ok { // Nothing to pop
        nextCh = nil // Disable this select case
    }
    case notificationToAdd, ok := <-p.addCh:
        if !ok {
        return
    }
    if notification == nil { // No notification to pop (and pendingNotifications is empty)
    // Optimize the case - skip adding to pendingNotifications
    notification = notificationToAdd
    nextCh = p.nextCh
    } else { // There is already a notification waiting to be dispatched
    p.pendingNotifications.WriteOne(notificationToAdd)
}
}
}
}
​
```

这个过程总结就是：

（1）AddEventHandler 到 sharedProcessor，注册事件回调函数到 sharedProcessor

（2）listener pop 方法里会监听 p.addCh，通过 nextCh = p.nextCh 将 addCh 将事件传递给 p.nextCh

（3）listener run 方法里会监听 p.nextCh，收到信号之后，判断是属于什么类型的方法，并且执行前面注册的 Handler

所以后面需要关注当资源对象发生变更时，是如何将变更信号给 p.addCh，进一步触发回调函数的

#### 3.4、Start all informers

通过 sharedInformers.Start(stopCh)启动所有的 informer，代码如下：

```go
// Start initializes all requested informers.
    func (f *sharedInformerFactory) Start(stopCh <-chan struct{}) {
        for informerType, informer := range f.informers {
            if !f.startedInformers[informerType] {
            go informer.Run(stopCh)
            f.startedInformers[informerType] = true
        }
    }
}
```

我们的例子中其实就只启动了 PodInformer，接下来看到 podInformer 的 Run 方法做了什么

```go
### go informer.Run(stopCh)：

    func (s *sharedIndexInformer) Run(stopCh <-chan struct{}){
    defer utilruntime.HandleCrash()
    
    fifo := NewDeltaFIFOWithOptions(DeltaFIFOOptions{   // Deltafifo
    KnownObjects:          s.indexer,
    EmitDeltaTypeReplaced: true,
    })
        cfg := &Config{
        Queue:            fifo,         // Deltafifo
        ListerWatcher:    s.listerWatcher,  // listerWatcher
        ObjectType:       s.objectType,
        FullResyncPeriod: s.resyncCheckPeriod,
        RetryOnError:     false,
        ShouldResync:     s.processor.shouldResync,
        // HandleDeltas, added to process, and done in processloop
        Process:           s.HandleDeltas,
        WatchErrorHandler: s.watchErrorHandler,
    }
    
        func() {
        ...
        s.controller = New(cfg)
        ...
    }
    
    s.controller.Run(stopCh)
}
### s.controller.Run(stopCh)
    func (c *controller) Run(stopCh <-chan struct{}) {
    
    r := NewReflector(
    c.config.ListerWatcher,
    c.config.ObjectType,
    c.config.Queue,
    c.config.FullResyncPeriod,
    )
    c.reflector = r
    
    // Run reflector
    wg.StartWithChannel(stopCh, r.Run)
    
    // Run processLoop, pop from deltafifo and do ProcessFunc,
    // ProcessFunc is the s.HandleDeltas before
    wait.Until(c.processLoop, time.Second, stopCh)
}
```

可以看到上面的逻辑首先生成一个 DeltaFifo，然后接下来的逻辑分为两块，生产和消费：

##### （1）生产—r.Run:

主要的逻辑就是利用 list and watch 将资源对象包括操作类型压入队列 DeltaFifo

```go
#### r.Run：

    func (r *Reflector) Run(stopCh <-chan struct{}) {
    // 执行listAndWatch
    if err := r.ListAndWatch(stopCh);
}

// 执行ListAndWatch流程
    func (r *Reflector)ListAndWatch(stopCh <-chan struct{}) error{
    // 1、list：
    // （1）、list pods, 实际调用的是podInformer里的ListFunc方法,
    // client.CoreV1().Pods(namespace).List(context.TODO(), options)
    
    r.listerWatcher.List(opts)
    // （2）、获取资源版本号，用于watch
    resourceVersion = listMetaInterface.GetResourceVersion()
    
    //  （3）、数据转换，转换成列表
    items, err := meta.ExtractList(list)
    
    // （4）、将资源列表中的资源对象和版本号存储到DeltaFifo中
    r.syncWith(items, resourceVersion);
    
    // 2、watch,无限循环去watch apiserver，当watch到事件的时候，执行watchHandler将event事件压入fifo
        for {
        // （1）、watch pods, 实际调用的是podInformer里的WatchFunc方法,
        // client.CoreV1().Pods(namespace).Watch(context.TODO(), options)
        w, err := r.listerWatcher.Watch(options)
        
        // （2）、watchHandler
        // watchHandler watches pod，更新DeltaFifo信息，并且更新resourceVersion
        if err := r.watchHandler(start, w, &resourceVersion, resyncerrc, stopCh);
    }
}

### r.watchHandler
// watchHandler watches w and keeps *resourceVersion up to date.
    func (r *Reflector) watchHandler(start time.Time, w watch.Interface, resourceVersion *string, errc chan error, stopCh <-chan struct{}) error {
    ...
    loop:
        for {
            select {
            case event, ok := <-w.ResultChan():
            newResourceVersion := meta.GetResourceVersion()
                switch event.Type {
                case watch.Added:
                err := r.store.Add(event.Object)    // Add event to srore, store的具体方法在fifo中
                    if err != nil {
                    utilruntime.HandleError(fmt.Errorf("%s: unable to add watch event object (%#v) to store: %v", r.name, event.Object, err))
                }
                ...
            }
            *resourceVersion = newResourceVersion
            r.setLastSyncResourceVersion(newResourceVersion)
            eventCount++
        }
    }
    ...
}

### r.store.Add：
## 即为deltaFifo的add方法：

    func (f *DeltaFIFO) Add(obj interface{}) error {
    ...
    return f.queueActionLocked(Added, obj)
    ...
}

    func (f *DeltaFIFO) queueActionLocked(actionType DeltaType, obj interface{}) error {
    id, err := f.KeyOf(obj)
        if err != nil {
    return KeyError{obj, err}
}
newDeltas := append(f.items[id], Delta{actionType, obj})
newDeltas = dedupDeltas(newDeltas)
    if len(newDeltas) > 0 {
        if _, exists := f.items[id]; !exists {
        f.queue = append(f.queue, id)
    }
    
    f.items[id] = newDeltas
    f.cond.Broadcast()          // 通知所有阻塞住的消费者
}
...
return nil
}
```

##### （2）消费—c.processLoop：

消费逻辑就是从 DeltaFifo pop 出对象，然后做两件事情：（1）触发前面注册的 eventhandler （2）更新本地索引缓存 indexer，保持数据和 etcd 一致

```go
    func (c *controller) processLoop() {
        for {
        obj, err := c.config.Queue.Pop(PopProcessFunc(c.config.Process))
    }
}

### Queue.Pop：
## Queue.Pop是一个带有处理函数的pod方法，首先先看Pod逻辑，即为deltaFifo的pop方法：
    func (f *DeltaFIFO) Pop(process PopProcessFunc) (interface{}, error) {
    for {                       // 无限循环
        for len(f.queue) == 0 {
        f.cond.Wait()       // 阻塞直到生产端broadcast方法通知
    }
id := f.queue[0]
item, ok := f.items[id]
delete(f.items, id)
err := process(item)        // 执行处理方法
    if e, ok := err.(ErrRequeue); ok {
    f.addIfNotPresent(id, item)     // 如果处理失败的重新加入到fifo中重新处理
    err = e.Err
}
return item, err
}
}

### c.config.Process：
## c.config.Process是在初始化controller的时候赋值的，即为前面的s.HandleDeltas

### s.HandleDeltas：
    func (s *sharedIndexInformer) HandleDeltas(obj interface{}) error {
    s.blockDeltas.Lock()
    defer s.blockDeltas.Unlock()
    // from oldest to newest
        for _, d := range obj.(Deltas) {
            switch d.Type {
            case Sync, Replaced, Added, Updated:
            s.cacheMutationDetector.AddObject(d.Object)
                if old, exists, err := s.indexer.Get(d.Object); err == nil && exists {
                    if err := s.indexer.Update(d.Object); err != nil {
                    return err
                }
                isSync := false
                    switch {
                    case d.Type == Sync:
                    // Sync events are only propagated to listeners that requested resync
                    isSync = true
                    case d.Type == Replaced:
                        if accessor, err := meta.Accessor(d.Object); err == nil {
                            if oldAccessor, err := meta.Accessor(old); err == nil {
                            // Replaced events that didn't change resourceVersion are treated as resync events
                            // and only propagated to listeners that requested resync
                            isSync = accessor.GetResourceVersion() == oldAccessor.GetResourceVersion()
                        }
                    }
                }
                s.processor.distribute(updateNotification{oldObj: old, newObj: d.Object}, isSync)
                    } else {
                        if err := s.indexer.Add(d.Object); err != nil {
                        return err
                    }
                    s.processor.distribute(addNotification{newObj: d.Object}, false)
                }
                case Deleted:
                    if err := s.indexer.Delete(d.Object); err != nil {
                    return err
                }
                s.processor.distribute(deleteNotification{oldObj: d.Object}, false)
            }
        }
        return nil
    }
```

可以看到上面主要执行两部分逻辑：

##### s.processor.distribute

```go
#### s.processor.distribute：
### 例如新增通知：s.processor.distribute(addNotification{newObj: d.Object}, false)
### 其中addNotification就是add类型的通知，后面会通过notification结构体的类型来执行不同的eventHandler

    func (p *sharedProcessor) distribute(obj interface{}, sync bool) {
    p.listenersLock.RLock()
    defer p.listenersLock.RUnlock()
    
        if sync {
            for _, listener := range p.syncingListeners {
            listener.add(obj)
        }
            } else {
                for _, listener := range p.listeners {
                listener.add(obj)
            }
        }
    }
    
        func (p *processorListener) add(notification interface{}) {
        p.addCh <- notification     // 新增notification到addCh
    }
```

这里 p.addCh 对应到前面说的关注对象 p.addCh，processorListener 收到 addCh 信号之后传递给 nextCh，然后通过 notification 结构体的类型来执行不同的 eventHandler

##### s.indexer 的增删改：

这个就是本地数据的缓存和索引，自定义控制逻辑里面会通过 indexer 获取操作对象的具体参数，这里就不展开细讲了。

### 4、总结

至此一个 informer 的 client-go 部分的流程就走完了，可以看到启动 informer 主要流程就是：

1、Reflector ListAndWatch：

（1）通过一个 reflector run 起来一个带有 list 和 watch api 的 client

（2）list 到的 pod 列表通过 DeltaFifo 存储，并更新最新的 ResourceVersion

（3）继续监听 pod，监听到的 pod 操作事件继续存储到 DeltaFifo 中

2、DeltaFifo 生产和消费：

（1）生产：list and watch 到的事件生产压入队列 DeltaFifo

（2）消费：执行注册的 eventHandler，并更新本地 indexer

所以 informer 本质其实就是一个通过 deltaFifo 建立生产消费机制，并且带有本地缓存和索引，以及可以注册回调事件的 apiServer 的客户端库。

### 5、参考

*   [github.com/kubernetes/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fkubernetes%2Fsample-controller%2Ftree%2Fmaster "https://github.com/kubernetes/sample-controller/tree/master")
*   [jimmysong.io/kubernetes-…](https://link.juejin.cn?target=https%3A%2F%2Fjimmysong.io%2Fkubernetes-handbook%2Fdevelop%2Fclient-go-informer-sourcecode-analyse.html "https://jimmysong.io/kubernetes-handbook/develop/client-go-informer-sourcecode-analyse.html")

推荐阅读
----

[JDK17 与 JDK11 特性差异浅谈](https://juejin.cn/post/7327725018686980106 "https://juejin.cn/post/7327725018686980106")

[业务分析师眼中的数据中台](https://juejin.cn/post/7327353536404275226 "https://juejin.cn/post/7327353536404275226")

[政采云大数据权限系统设计和实现](https://juejin.cn/post/7326979270881902642 "https://juejin.cn/post/7326979270881902642")

[JDK11 与 JDK8 特性差异浅谈](https://juejin.cn/post/7325132087282974747 "https://juejin.cn/post/7325132087282974747")

[Mysql全文索引](https://juejin.cn/post/7324712506749288475 "https://juejin.cn/post/7324712506749288475")

招贤纳士
----

政采云技术团队（Zero），Base 杭州，一个富有激情和技术匠心精神的成长型团队。规模 500 人左右，在日常业务开发之外，还分别在云原生、区块链、人工智能、低代码平台、中间件、大数据、物料体系、工程平台、性能体验、可视化等领域进行技术探索和实践，推动并落地了一系列的内部技术产品，持续探索技术的新边界。此外，团队还纷纷投身社区建设，目前已经是 google flutter、scikit-learn、Apache Dubbo、Apache Rocketmq、Apache Pulsar、CNCF Dapr、Apache DolphinScheduler、alibaba Seata 等众多优秀开源社区的贡献者。

如果你想改变一直被事折腾，希望开始折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊……如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的技术团队的成长过程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 [zcy-tc@cai-inc.com](https://link.juejin.cn?target=mailto%3Azcy-tc%40cai-inc.com "mailto:zcy-tc@cai-inc.com")

微信公众号
-----

文章同步发布，政采云技术团队公众号，欢迎关注 ![文章顶部.png](/images/jueJin/aaafc13f1d1e414.png)