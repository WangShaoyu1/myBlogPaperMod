---
author: "政采云技术"
title: "聊聊 nestjs 中的依赖注入"
date: 2022-01-05
description: "前言 首先 nestjs 是什么？引用其官网的原话 A progressive Nodejs framework for building efficient, reliable and scala"
tags: ["前端","JavaScript","NestJS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读12分钟"
weight: 1
selfDefined:"likes:110,comments:0,collects:121,views:8500,"
---
![](/images/jueJin/d4eb6a01e656484.png)

![百里.png](/images/jueJin/ecad6919f2f7484.png)

> 这是第 129 篇不掺水的原创，想获取更多原创好文，请搜索公众号关注我们吧~ 本文首发于政采云前端博客：[聊聊 nestjs 中的依赖注入](https://link.juejin.cn?target=https%3A%2F%2Fzoo.team%2Farticle%2Fnestjs "https://zoo.team/article/nestjs")

前言
--

首先 nestjs 是什么？引用其官网的原话 `A progressive Node.js framework for building efficient, reliable and scalable server-side applications.`，翻译一下就是：“一个可以用来搭建高效、可靠且可扩展的服务端应用的node框架”。目前在 github 上有 42.4k 的 star 数，人气还是很高的。

在使用过程中会发现 nest 框架和后端同学使用的 Springboot 以及前端三大框架之一的 Angular 都有很多相似之处。没错这三个框架都有相似的设计，并都实现了依赖注入。

可能对大部分前端同学来说，`依赖注入`这个词还比较陌生，本文就围绕`依赖注入`这个话题，展开讨论一下依赖注入是什么？以及在 nestjs 中详细的实现过程。

重要概念
----

### 概念解释

先来看看几个重要概念的解释

*   依赖倒置原则( DIP )：抽象不应该依赖实现，实现也不应该依赖实现，实现应该依赖抽象。
*   依赖注入（dependency injection，简写为 DI）：依赖是指依靠某种东西来获得支持。将创建对象的任务转移给其他class，并直接使用依赖项的过程，被称为“依赖项注入”。
*   控制反转（Inversion of Control, 简写为 IoC）：指一个类不应静态配置其依赖项，应由其他一些类从外部进行配置。

### 结合代码

光看上面的解释可能并不好理解？那么我们把概念和具体的代码结合起来看。

1.  根据 nest 官网教程，用脚手架创建一个项目，创建好的项目中有 main.ts 文件为入口文件，引入了 app.module.ts 文件，而 app.module.ts 文件引入了 app.controller.ts。先看一下代码的逻辑：

```typescript
// src/main.ts文件
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

    async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
}
bootstrap();
``````typescript
// src/app.module.ts文件
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

    @Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService],
    })
export class AppModule {}
``````typescript
// src/app.controller.ts文件
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
    export class AppController {
constructor(private readonly appService: AppService) {}

@Get()
    getHello(): string {
    return this.appService.getHello();
}
}
``````typescript
// src/app.service.ts文件
import { Injectable } from '@nestjs/common';

@Injectable()
    export class AppService {
        getHello(): string {
        return 'Hello World!';
    }
}

```

现在我们执行 npm start 启动服务，访问 localhost:3000 就会执行这个 AppController 类中的 getHello 方法了。我们来看 app.controller.ts 文件。可以看到构造函数的参数签名中第一个参数 appService 是 AppService 的一个实例。

```typescript
constructor(private readonly appService: AppService){}
```

但是在代码里并有没有看到实例化这个 AppService 的地方。这里其实是把创建这个实例对象的工作交给了nest框架，而不是 AppController 自己来创建这个对象，这就是所谓的`控制反转`。而把创建好的 AppService 实例对象作为 AppController 实例化时的参数传给构造器就是`依赖注入`了。

### 依赖注入的方式

依赖注入的实现主要有三种方式

1.  构造器注入： 依赖关系通过 class 构造器提供；
2.  setter 注入：用 setter 方法注入依赖项；
3.  接口注入：依赖项提供一个注入方法，该方法将把依赖项注入到传递给它的任何客户端中。客户端必须实现一个接口，该接口的 setter 方法接收依赖； 在 nest 中采用了第一种方式——构造器注入。

### 优点

那么 nestjs 框架用了`依赖注入`和`控制反转`有什么好处呢？

其实`DI` 和`IoC` 是实现`依赖倒置原则`的具体手段。`依赖倒置原则`是设计模式五大原则（SOLID）中的第五项原则，也许上面这个 AppController 的例子还看不出 DIP 有什么用，因为 DIP 也不是今天的重点，这里就不多赘述了，但是通过上面的例子我们至少能体会到以下两个优点：

1.  减少样板代码，不需要再在业务代码中写大量实例化对象的代码了；
2.  可读性和可维护性更高了，松耦合，高内聚，符合单一职责原则，一个类应该专注于履行其职责，而不是创建履行这些职责所需的对象。

元数据反射
-----

我们都知道 ts 中的类型信息是在运行时是不存在的，那运行时是如何根据参数的类型注入对应实例的呢？

答案就是：元数据反射

先说反射，反射就是在运行时动态获取一个对象的一切信息：方法/属性等等，特点在于**动态类型反推导**。不管是在 ts 中还是在其他类型语言中，反射的本质在于元数据。在 TypeScript 中，反射的原理是通过编译阶段对对象注入元数据信息，在运行阶段读取注入的元数据，从而得到对象信息。

元数据反射（Reflect Metadata） 是 ES7 的一个提案，它主要用来在声明的时候添加和读取元数据。TypeScript 在 1.5+ 的版本已经支持它。要在 ts 中启用元数据反射相关功能需要：

*   `npm i reflect-metadata --save`。
*   在 `tsconfig.json` 里配置 `emitDecoratorMetadata` 选项为`true`。

### 定义元数据

`Reflect.defineMetadata(metadataKey, data, target)`

可以定义一个类的元数据；

### 获取元数据

`Reflect.getMetadata(metadataKey, target)`，`Reflect.getMetadata(metadataKey, instance, methodName)`

可以获取类或者方法上定义的元数据。

### 内置元数据

TypeScript 结合自身语言的特点，为使用了装饰器的代码声明注入了 3 组元数据：

*   `design:type`：成员类型
*   `design:paramtypes`：成员所有参数类型
*   `design:returntype`：成员返回类型

### 示例一：元数据的定义与获取

```typescript
import 'reflect-metadata';

    class A {
        sayHi() {
        console.log('hi');
    }
}

    class B {
        sayHello() {
        console.log('hello');
    }
}

    function Module(metadata) {
    const propsKeys = Object.keys(metadata);
        return (target) => {
            for (const property in metadata) {
                if (metadata.hasOwnProperty(property)) {
                Reflect.defineMetadata(property, metadata[property], target);
            }
        }
        };
    }
    
        @Module({
        controllers: [B],
        providers: [A],
        })
    class C {}
    
    const providers = Reflect.getMetadata('providers', C);
    const controllers = Reflect.getMetadata('controllers', C);
    
console.log(providers, controllers); // [ [class A] ] [ [class B] ]



(new (providers[0])).sayHi(); // 'hi'
```

在这个例子里，我们定义了一个名为 Module 的装饰器，这个装饰器的主要作用就是往装饰的类上添加一些元数据。然后用装饰器装饰 C 类。我们就可以获取到这个参数中的信息了;

### 示例二：依赖注入的简单实现

```typescript
import 'reflect-metadata';

type Constructor<T = any> = new (...args: any[]) => T;

const Test = (): ClassDecorator => (target) => {};

    class OtherService {
    a = 1;
}

@Test()
    class TestService {
constructor(public readonly otherService: OtherService) {}

    testMethod() {
    console.log(this.otherService.a);
}
}

    const Factory = <T>(target: Constructor<T>): T => {
    // 获取所有注入的服务
const providers = Reflect.getMetadata('design:paramtypes', target); // [OtherService]
const args = providers.map((provider: Constructor) => new provider());
return new target(...args);
};

Factory(TestService).testMethod(); // 1
```

这里例子就是依赖注入简单的示例，这里 Test 装饰器虽然什么都没做，但是如上所说，只要使用了装饰器，ts 就会默认给类或对应方法添加`design:paramtypes`的元数据，这样就可以通过`Reflect.getMetadata('design:paramtypes', target)`拿到类型信息了。

nest中的实现
--------

下面来看 nest 框架内部是怎么来实现的

### 执行逻辑

在入口文件 main.ts 中有这样一行代码

```typescript
const app = await NestFactory.create(AppModule);
```

在源码 nest/packages/core/nest-application.ts 找到 NestFactory.create 方法，这里用注释解释说明了与依赖注入相关的几处代码（下同）。

```typescript
public async create<T extends INestApplication = INestApplication>(
module: any,
serverOrOptions?: AbstractHttpAdapter | NestApplicationOptions,
options?: NestApplicationOptions,
    ): Promise<T> {
    const [httpServer, appOptions] = this.isHttpServer(serverOrOptions)
? [serverOrOptions, options]
: [this.createHttpAdapter(), serverOrOptions];

const applicationConfig = new ApplicationConfig();
// 1. 实例化IoC容器，这个容器就是用来存放所有对象的地方
const container = new NestContainer(applicationConfig);
this.setAbortOnError(serverOrOptions, options);
this.registerLoggerConfiguration(appOptions);

// 2. 执行初始化逻辑，是依赖注入的核心逻辑所在
await this.initialize(module, container, applicationConfig, httpServer);

// 3. 实例化NestApplication类
const instance = new NestApplication(
container,
httpServer,
applicationConfig,
appOptions,
);
const target = this.createNestInstance(instance);
// 4. 生成一个Proxy代理对象，将对NestApplication实例上部分属性的访问代理到httpServer，在nest中httpServer默认就是express实例对象，所以默认情况下，express的中间件都是可以使用的
return this.createAdapterProxy<T>(target, httpServer);
}
```

### IoC 容器

在目录 nest/packages/core/injector/container.ts，找到了 NestContainer 类，里面有很多成员属性和方法，可以看到其中的私有属性 modules 是一个 ModulesContainer 实例对象，而 ModulesContainer 类是 Map 类的一个子类。

```typescript


    export class NestContainer {
    ...
    private readonly modules = new ModulesContainer();
    ...
}
``````typescript
    export class ModulesContainer extends Map<string, Module> {
    private readonly _applicationId = uuid();
    
        get applicationId(): string {
        return this._applicationId;
    }
}
```

### 依赖注入过程

先来看`this.initialize`方法：

```typescript
private async initialize(
module: any,
container: NestContainer,
config = new ApplicationConfig(),
httpServer: HttpServer = null,
    ) {
    // 1. 实例加载器
    const instanceLoader = new InstanceLoader(container);
    const metadataScanner = new MetadataScanner();
    // 2. 依赖扫描器
    const dependenciesScanner = new DependenciesScanner(
    container,
    metadataScanner,
    config,
    );
    container.setHttpAdapter(httpServer);
    
    const teardown = this.abortOnError === false ? rethrow : undefined;
    await httpServer?.init();
        try {
        this.logger.log(MESSAGES.APPLICATION_START);
        
        await ExceptionsZone.asyncRun(
            async () => {
            // 3. 扫描依赖
            await dependenciesScanner.scan(module);
            // 4. 生成依赖的实例
            await instanceLoader.createInstancesOfDependencies();
            dependenciesScanner.applyApplicationProviders();
            },
            teardown,
            this.autoFlushLogs,
            );
                } catch (e) {
                this.handleInitializationError(e);
            }
        }
```

*   `new InstanceLoader()`实例化 InstanceLoader 类，并把刚才的 IoC 容器作为参数传入，这个类是专门用来生成需要注入的实例对象的；
*   实例化 MetadataScanner 类和 DependenciesScanner 类，MetadataScanner 类是一个用来获取`元数据`的工具类，而 DependenciesScanner 类是用来扫描出所有 modules 中的依赖项的。上面的 app.module.ts 中 Module 装饰器的参数中传入了`controllers`、`providers`等其他选项，这个 Module 装饰器的作用就是标明 AppModule 类的一些依赖项；

```typescript
    @Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService],
    })
export class AppModule {}
```

*   调用依赖扫描器的 scan 方法，扫描依赖；

```typescript
    public async scan(module: Type<any>) {
    // 1. 把一些内建module添加到IoC容器中
    await this.registerCoreModule();
    // 2. 把传入的module添加到IoC容器中
    await this.scanForModules(module);
    // 3. 扫描当前IoC容器中所有module的依赖
    await this.scanModulesForDependencies();
    this.calculateModulesDistance();
    
    this.addScopedEnhancersMetadata();
    this.container.bindGlobalScope();
}
```

这里所说的 module 可以理解为是模块，但并不是 es6 语言中的模块化的 module，而是app.module.ts 中定义的类, 而 nest 内部也有一个内建的`Module`类，框架会根据 app.module.ts 中定义的 module 类去实例化一个内建的 Moudle 类。下面 addModule 方法是把 module 添加到 IoC 容器的方法，可以看到，这里针对每个 module 会生成一个 token，然后实例化内建的 Module 类，并放到容器的modules属性上，token 作为 Map 结构的 key，Module 实例作为值。

```typescript
public async addModule(
metatype: Type<any> | DynamicModule | Promise<DynamicModule>,
scope: Type<any>[],
    ): Promise<Module | undefined> {
    // In DependenciesScanner#scanForModules we already check for undefined or invalid modules
    // We still need to catch the edge-case of `forwardRef(() => undefined)`
        if (!metatype) {
        throw new UndefinedForwardRefException(scope);
    }
    // 生成token
    const { type, dynamicMetadata, token } = await this.moduleCompiler.compile(
    metatype,
    );
        if (this.modules.has(token)) {
        return this.modules.get(token);
    }
    // 实例化内建Module类
    const moduleRef = new Module(type, this);
    moduleRef.token = token;
    // 添加在modules上
    this.modules.set(token, moduleRef);
    
    await this.addDynamicMetadata(
    token,
    dynamicMetadata,
    [].concat(scope, type),
    );
    
        if (this.isGlobalModule(type, dynamicMetadata)) {
        this.addGlobalModule(moduleRef);
    }
    return moduleRef;
}
```

*   `scanModulesForDependencies`方法会找到容器中每个 module 上的一些元数据，把对应的元数据分别添加到刚才添加到容器中的 module 上面，这些元数据就是根据上面提到的 Module 装饰器的参数生成的；
*   `instanceLoader.createInstancesOfDependencies()`

```typescript
    private async createInstances(modules: Map<string, Module>) {
    await Promise.all(
        [...modules.values()].map(async moduleRef => {
        await this.createInstancesOfProviders(moduleRef);
        await this.createInstancesOfInjectables(moduleRef);
        await this.createInstancesOfControllers(moduleRef);
        
        const { name } = moduleRef.metatype;
        this.isModuleWhitelisted(name) &&
        this.logger.log(MODULE_INIT_MESSAGE`${name}`);
        }),
        );
    }
```

遍历 modules 然后生成 provider、Injectable、controller 的实例。生成实例的顺序上也是有讲究的，controller 是最后生成的。在生成实例的过程中，nest 还会先去找到构造器中的依赖项：

```typescript
const dependencies = isNil(inject)
? this.reflectConstructorParams(wrapper.metatype as Type<any>)
: inject;
``````typescript
    reflectConstructorParams<T>(type: Type<T>): any[] {
    const paramtypes = Reflect.getMetadata(PARAMTYPES_METADATA, type) || [];
    const selfParams = this.reflectSelfParams<T>(type);
    
    selfParams.forEach(({ index, param }) => (paramtypes[index] = param));
    return paramtypes;
}
```

*   上面代码中的的常量`PARAMTYPES_METADATA`就是 ts 中内置的；metadataKey `design:paramtypes`，获取到构造参数类型信息；然后就可以先实例化依赖项；

```typescript
    async instantiateClass(instances, wrapper, targetMetatype, contextId = constants_2.STATIC_CONTEXT, inquirer) {
    const { metatype, inject } = wrapper;
    const inquirerId = this.getInquirerId(inquirer);
    const instanceHost = targetMetatype.getInstanceByContextId(contextId, inquirerId);
    const isInContext = wrapper.isStatic(contextId, inquirer) ||
    wrapper.isInRequestScope(contextId, inquirer) ||
    wrapper.isLazyTransient(contextId, inquirer) ||
    wrapper.isExplicitlyRequested(contextId, inquirer);
        if (shared_utils_1.isNil(inject) && isInContext) {
        instanceHost.instance = wrapper.forwardRef
        ? Object.assign(instanceHost.instance, new metatype(...instances))
        : new metatype(...instances);
    }
        else if (isInContext) {
        const factoryReturnValue = targetMetatype.metatype(...instances);
        instanceHost.instance = await factoryReturnValue;
    }
    instanceHost.isResolved = true;
    return instanceHost.instance;
}
```

*   依赖项全部实例化后再调用`instantiateClass`方法，依赖项作为第一个参数 instances 传入。这里的`new metatype(...instances)` 把依赖项的实例作为参数全部传入。

### 执行流程图

`NestFactory.create`方法的执行逻辑大概如下

![](/images/jueJin/96a647936e5d4ed.png)

总结
--

1.  元数据反射是实现依赖注入的基础；
2.  总结依赖注入的过程，nest 主要做了三件事情
    1.  知道哪些类需要哪些对象
    2.  创建对象
    3.  并提供所有这些对象

参考
--

*   [nestjs官方文档](https://link.juejin.cn?target=https%3A%2F%2Fdocs.nestjs.com "https://docs.nestjs.com")
*   [深入理解Typescript——Reflect Metadata](https://link.juejin.cn?target=https%3A%2F%2Fjkchao.github.io%2Ftypescript-book-chinese%2Ftips%2Fmetadata.html%23%25E5%259F%25BA%25E7%25A1%2580 "https://jkchao.github.io/typescript-book-chinese/tips/metadata.html#%E5%9F%BA%E7%A1%80")
*   [Dependency injection in Angular](https://link.juejin.cn?target=https%3A%2F%2Fangular.io%2Fguide%2Fdependency-injection "https://angular.io/guide/dependency-injection")
*   [装饰器](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2Fdecorators.html "https://www.typescriptlang.org/docs/handbook/decorators.html")
*   [从 JavaScript 到 TypeScript 4 - 装饰器和反射](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000011520817 "https://segmentfault.com/a/1190000011520817")
*   [反射的本质——元数据](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.aliyun.com%2Farticle%2F382120 "https://developer.aliyun.com/article/382120")
*   《大话设计模式》——程杰

推荐阅读
----

*   [sketch插件开发指南](https://juejin.cn/post/7033911797279096845 "https://juejin.cn/post/7033911797279096845")
*   [在 Vue 中为什么不推荐用 index 做 key](https://juejin.cn/post/7026119446162997261 "https://juejin.cn/post/7026119446162997261")
*   [浅析Web录屏技术方案与实现](https://juejin.cn/post/7028723258019020836 "https://juejin.cn/post/7028723258019020836")

开源作品
----

*   政采云前端小报

**开源地址 [www.zoo.team/openweekly/](https://link.juejin.cn?target=https%3A%2F%2Fwww.zoo.team%2Fopenweekly%2F "https://www.zoo.team/openweekly/")** (小报官网首页有微信交流群)

*   商品选择 sku 插件

**开源地址 [github.com/zcy-inc/sku…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fzcy-inc%2FskuPathFinder-back "https://github.com/zcy-inc/skuPathFinder-back")**

招贤纳士
----

政采云前端团队（ZooTeam），一个年轻富有激情和创造力的前端团队，隶属于政采云产品研发部，Base 在风景如画的杭州。团队现有 60 余个前端小伙伴，平均年龄 27 岁，近 4 成是全栈工程师，妥妥的青年风暴团。成员构成既有来自于阿里、网易的“老”兵，也有浙大、中科大、杭电等校的应届新人。团队在日常的业务对接之外，还在物料体系、工程平台、搭建平台、性能体验、云端应用、数据分析及可视化等方向进行技术探索和实战，推动并落地了一系列的内部技术产品，持续探索前端技术体系的新边界。

如果你想改变一直被事折腾，希望开始能折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变既定的节奏，将会是“5 年工作时间 3 年工作经验”；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊… 如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的前端团队的成长历程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 `ZooTeam@cai-inc.com`

![](/images/jueJin/98d3aa3d1f8646a.png)