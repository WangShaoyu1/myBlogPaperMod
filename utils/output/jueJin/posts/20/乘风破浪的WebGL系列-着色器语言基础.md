---
author: ""
title: "乘风破浪的WebGL系列-着色器语言基础"
date: 2020-12-15
description: "学习 WebGL 程序需要学习两个新东西，一个是WebGL API，另一个是着色器语言。其中着色器语言是用来控制 GPU 渲染的编程语言，而 WebGL API 则是 JavaScript 和着色器语言之间的桥梁，JavaScript 通过 WebGL API 间接地控制 GP…"
tags: ["JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读13分钟"
weight: 1
selfDefined:"likes:15,comments:0,collects:13,views:1629,"
---
> 希沃ENOW大前端
> 
> [公司官网：CVTE(广州视源股份)](https://link.juejin.cn?target=http%3A%2F%2Fwww.cvte.com%2F "http://www.cvte.com/")
> 
> 团队：CVTE旗下未来教育希沃软件平台中心enow团队

**本文作者：** ![](/images/jueJin/1a58e37005c249c.png)

前言
--

学习 `WebGL` 程序需要学习两个新东西，一个是`WebGL API`，另一个是着色器语言。其中着色器语言是用来控制 `GPU` 渲染的编程语言，而 `WebGL API` 则是 `JavaScript` 和着色器语言之间的桥梁，`JavaScript` 通过 `WebGL API` 间接地控制 `GPU` 的执行，例如我们在初始化着色时使用的 `createShader` 和 `compileShader` 等接口，就是 `JavaScript` 通过 `WebGL API` 来编译着色器代码，并在 `GPU` 中执行，初始化 `GPU` 状态。

本节内容主要是为了方便你看明白后续文章中的代码示例，同时熟悉 `GLSL ES` 语法也能够让你更灵活地写出着色器。关于 `API` 的介绍和编程语言的介绍会相对枯燥一点，你也可以初略看下，回头不清楚再翻回来查阅。

WebGL API 基础
------------

所谓 API 就是一套应用程序编程接口，为了能够在 Web 上控制显卡硬件创建三维场景，对显卡的硬件细节进行了封装抽象，提供了一系列可以控制 GPU 渲染管线的函数，这些函数的集合就是 WebGL API。

### 获取上下文

通过 Canvas 画布对象的 getContext 方法可以获得一个 WebGL 的上下文 CanvasRenderingContext，该对象的方法和属性就是 WebGL API。这些方法和属性的制定参照的是 OpenGL ES。

```ini
gl = canvas.getContext("webgl");
gl = canvas.getContext("webgl2"); // webgl2.0，目前 safari 上还没有默认打开
```

### 初始化着色器

初始化着色器，即将字符串形式的 GLSL ES 代码编译为显卡中可以运行的着色器程序，具体可以分以下几个步骤：

1.  创建着色器对象 `gl.createShader(type)` 根据传入的参数创建一个顶点着色器或片元着色器。
    
2.  向着色器对象中填充着色器程序的源代码 `gl.shaderSource(shader, source)`
    
3.  编译着色器对象 `gl.compileShader(shader)` GLSL ES 程序需要编译成二进制的可执行格式，WebGL 系统真正使用的是这种可执行格式。
    
4.  创建程序对象 `gl.createProgram()` 着色器对象管理一个顶点着色器或者一个片元着色器，而程序对象是管理着色器对象的容器，在 WebGL 中，一个程序对象必须包含一个顶点着色器对象和一个片元着色器对象。
    
    ![](/images/jueJin/2f83854e988f411.png)
5.  为程序对象分配着色器 `gl.attachShader(program, shader)`
    
6.  连接程序对象 `gl.linkProgram(program)` 为程序对象分配了顶点着色器和片元着色器后，还需要将两者连接起来，保证两者的 varying 变量一一对应、保证两者中同名的 uniform 变量也是同类型的、保证着色器中的 attribute、uniform 和 varying 变量的个数没有超过着色器的上限。连接后，应该检查是否连接成功，可以通过调用 `getProgramParameter(program, pname)` 方法来确认，如下：
    

```javascript
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program))
}
```

7.  使用程序对象 `gl.useProgram(programe)` 该函数的存在使得WebGL具有了一个强大的特性，那就是在绘制前准备多个程序对象，然后在绘制的时候根据需要切换程序对象。

以上就是初始化着色器的相应步骤，具体实现代码如下：

```javascript
// 初始化着色器方法
    function initShader(gl, vertexSource, fragmentSource) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    // 将着色器源码附加到着色器上
    gl.shaderSource(vertexShader, vertexSource);
    gl.shaderSource(fragmentShader, fragmentSource);
    
    // 编译着色器
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);
    
    // 创建一个程序对象
    const program = gl.createProgram();
    // 将编译好的着色器附加到程序对象上
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    // 链接程序对象
    gl.linkProgram(program);
    // WebGL引擎使用该程序对象
    gl.useProgram(program);
    
    return program;
}
```

### 向着色器传递数据

向着色器传递数据可以通过 attribute 和 uniform 变量，具体使用哪个取决于数据本身，attribute 变量传输的是那些与顶点相关的数据，而 uniform 变量传递的是与顶点无关或者对于所有顶点都相同的数据。 向着色器传递数据，即将数据绑定到相应的着色器变量上，在 WebGL 中，大致的流程如下：

1.  在着色器中定义相应的变量

```typescript
// 顶点着色器
attribute vec4 a_Position;
    void main() {
    gl_Position = a_Position;
    gl_PointSize = 10.0;
}

// 片元着色器
uniform vec4 u_FragColor;
    void main() {
    gl_FragColor = u_FragColor;
}
```

(`attribute`和`uniform`是类似于`const`的声明, 在本文的后面着色器语言基础中有介绍到)

2.  获取变量位置

对于 attribute 变量，使用 `getAttribLocation(program, name)` 获取变量位置，对于 uniform 变量使用 `getUniformLocation(program, name)`

3.  向变量赋值

WebGL 提供了多个 API 来向 uniform 和 attribute 变量赋值

```javascript
gl.vertexAttrib1f(location, v0)
...
gl.vertexAttrib4f(location, v0, v1, v2, v3)
gl.uniform1f(location, v0)
...
gl.uniform4f(location, v0, v1, v2, v3)
```

对于 attribute 变量，如果是绘制由多个顶点组成的图形，就需要一次性将多个点传到顶点着色器中，这就需要使用到缓存区对象，用法如下：

```javascript
var arr = [-.5, .5, .3, .2];
var vertices = new Float32Array(arr); // 使用类型化数组，可以优化性能
var vertexBuffer = gl.createBuffer(); // 创建缓冲区对象
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // 指定缓冲区对象的处理方法(gl.ARRAY_BUFFER)
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // 将数据写入缓冲区对象
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0); // 将缓冲区中的数据分配给变量
gl.enableVertexAttribArray(a_Position); // 启用变量
```

关于缓存区的使用，后面会有单独文章进行介绍，这里就不再赘述了。

关于 WebGL API 就简单介绍这些，更多的 API 信息，你可以查看相应的 [WebGL 规范](https://link.juejin.cn?target=https%3A%2F%2Fwww.khronos.org%2Fregistry%2Fwebgl%2Fspecs%2Flatest%2F1.0%2F "https://www.khronos.org/registry/webgl/specs/latest/1.0/")。

着色器语言基础
-------

这里的着色器语言指的是 GLSL ES 编程语言，它是在 OpenGL 着色器语言（GLSL）的基础上，删除和简化一部分功能后形成的。GLSL ES 的语法和 C 语言比较类似，GLSL ES 新增了一些内置变量、数据类型和数学函数，同时也缺失了一部分 C 语言有的特性。

### 数据类型和变量声明

声明一个变量的结构如下： _**\[<存储限定符>\] <数据类型> <变量名>**_

#### 1.变量命名

GLSL ES 规定的变量命名和 C 语言类似，都是只能包括字母、数字和下划线，同时首字母不能是数字，另外，变量名不能以 gl\_、webgl\_和\_webgl\_开头，不能和已有的关键字重复。

#### 2.存储限定符

限定符

描述

特殊说明

const

同 JavaScript 中的定义一样，表示变量值不能被改变

示例：const init size = 100

attribute

attribute 变量只能定义在顶点着色器中，它的作用是接收 JavaScript 程序传递过来的与逐顶点有关的数据，比如顶点的坐标、颜色、法线等。

示例：attribute float a\_PointSize; (不同顶点接收到的值可能不一样)。

顶点着色器中能够容纳的 attribute 变量的最大数目与设备有关，可以通过访问 gl\_MaxVertexAttribs 变量获得，一般至少支持 8 个。

attribute 变量的类型只能是 float、vec(n) 类型 和 mat(n) 类型。

uniform

uniform 变量可以定义在顶点着色器和片元着色器中，它的作用是接收 JavaScript 程序传递过来的与顶点无关或者对于所有顶点都相同的数据，比如针对所有顶点的变换矩阵等。

示例：uniform mat4 u\_Matrix; (所有顶点都共享相同的 u\_Matrix 值)。

顶点着色器和片元着色器中能够容纳的 uniform 变量的最大数目与设备有关，且各不相同，可分别通过 gl\_MaxVertexUniformVectors 和 gl\_MaxFragmentUniformVectors 变量获得。

uniform 变量可以是除了数组和结构体之外的任意类型。

varying

使用 varying 限制符，必须同时在顶点着色器和片元着色器中声明，它的作用是从顶点着色器向片元着色器传输数据，即在顶点着色器中声明，在片元着色器中使用。它所修饰的变量在传递给片元着色器之前会进行插值化处理。

示例：varying vec2 v\_TexCood;

varying 变量的最大数目与设备有关，一般至少支持 8 个。

和 attribute 变量一样，varying 变量的类型只能是 float、vec(n) 类型 和 mat(n) 类型。

#### 3.数据类型

##### 基本类型

类型

描述

int

整型数

float

单精度浮点数类型

bool

布尔值（true 或 false）

值得一提的是 GLSL ES 不支持字符串类型。

##### 数组

GLSL ES 支持数组类型，但是其只支持一维数组，而且数组对象不支持 pop 或 push 等方法，同时数组不能在声明时被一次性地初始化，而必须对每个元素显示地初始化。

```javascript
// 1.声明时指定数组大小
float arr[2];
arr[0] = 1.0;
arr[1] = 2.0;
```

##### 向量和矩阵

向量和矩阵是 GLSL ES 中非常重要的数据结构，这两种类型很适合用来处理计算机图形。向量和矩阵类型的变量都包含多个元素，每个元素是一个数值（整型数、浮点数或布尔值）。

类别

数据类型

描述

向量

vec2、vec3、vec4

具有 2、3、4 个浮点类型的元素的向量

ivec2、ivec3、ivec4

具有 2、3、4 个整型类型的元素的向量

bvec2、bvec3、bvec4

具有 2、3、4 个布尔类型的元素的向量

矩阵

mat2、mat3、mat4

具有 2 x 2、3 x 3、4 x 4 个浮点类型的元素的矩阵

关于矩阵的存储方式，可以分为行主序和列主序，行主序是指以行作为优先单位，在内存中逐行存储，如下图所示：

![](/images/jueJin/0f16a7bba712489.png)

而列主序则是指以列作为优先单位，在内存中逐列存储，如下图所示： ![](/images/jueJin/d72c1c77eb91448.png)

在 GLSL ES 里，矩阵是以列主序存储的，如上图，在 GLSL ES 里面，可做如下描述：

```javascript
mat4 m4 = mat4 (
0.0, 1.0, 2.0, 3.0,
4.0, 5.0, 6.0, 7.0,
8.0, 9.0, 10.0, 11.0,
12.0, 13.0, 14.0, 15.0
)
```

GLSL ES 提供了非常灵活的方式来创建向量和矩阵，如下：

```javascript
vec2 v2 = vec3(1.0, 2.0);      // 设 v2 为 (1.0, 2.0)
vec3 v3 = vec3(1.0);           // 设 v3 为 (1.0, 1.0, 1.0)
vec4 v4 = vec4(v2, v3);        // 使用 v2 填充 v4, 再用 v3 填满剩下的，最终 v4 为 (1.0, 2.0, 1.0, 1.0)

mat2 m2_1 = (
0.0, 1.0,
2.0, 3.0
);                             // 传入每一个元素的数值来构造矩阵
mat m2_2 = mat2(v2, v2);       // 使用 2 个二维向量来构造一个 2 x 2 的矩阵
mat m2_3 = mat2(0.0, 1,0, v2); // 使用 2 个浮点数和一个二维向量来构造矩阵
mat m2_4 = mat2(2.0);          // 生成一个 2 x 2 的矩阵，对角线上的元素都是 2.0
```

访问向量和矩阵里的元素的方式也非常灵活，支持通过点运算符（.）或者 \[\] 符号这两种方式来获取。

###### 1.向量元素访问

访问向量中的各个分量可以将向量看做一个数组，通过下标的方式进行访问。

```javascript
vec4 a_Color = vec4(0.1, 0.2, 0.3, 1.0);
a_Color[0]  // 0.1，获取向量 a_Color的 红色通道分量
```

由于向量可以用来存储顶点坐标、颜色和纹理坐标，所以 GLSL ES 支持以下三种分量名称获取向量分量：

类别

描述

x, y, z, w

用来获取顶点坐标分类

r, g, b, a

用来获取颜色分类

s, t, p, q

用来获取纹理坐标分量

```javascript
vec4 a_Color = vec4(0.1, 0.2, 0.3, 1.0);
a_Color.r  // 0.1，获取向量 a_Color的 红色通道分量
a_Color.rb // (0.1, 0.3)，获取多个分量
```

事实上，任何向量的 x、r 和 s 分量都会返回第一个分量， y、g 和 t 分量都会返回第二个分量，以此类推，所以你也可以随意地交换使用它们。

2.矩阵元素访问 使用 \[\] 运算符获取矩阵元素，第一个 \[\] 运算符表示获取矩阵中的某一列元素，而如果使用连续两个 \[\] 运算符，则表示获取矩阵中的某一列的某个元素。

```javascript
mat4 m4 = mat4 (
0.0, 1.0, 2.0, 3.0,
4.0, 5.0, 6.0, 7.0,
8.0, 9.0, 10.0, 11.0,
12.0, 13.0, 14.0, 15.0
)

m4[0] // 获取矩阵的第一列元素，即 [0.0, 1.0, 2.0, 3.0]
m4[0][1] // 获取矩阵的第一列的第二元素，即 (1.0)
```

##### 取样器（纹理）

采样器是着色语言中不同于 C 语言的一种特殊的基本数据类型，其专门用来进行纹理采样的相关操作。一般情况下，一个采样器变量代表一副或一套纹理贴图，常用的取样器类型有以下几种：

取样器类型

描述

sampler2D

用于访问浮点型的二维纹理

sampler3D

用于访问浮点型的三维纹理

samplerCube

用于访问浮点型的立方贴图纹理

一般情况下采样器都是用 uniform 限定符来修饰，如下

```ini
uniform sampler2D u_Sampler;
```

### 运算、程序流、函数

GLSL  ES  的运算符、程序流还有函数定义和 C 语言或者 JavaScript 差别不大，这里就不做赘述了，需要的可以查阅相关文档 [OpenGL ES 规范](https://link.juejin.cn?target=https%3A%2F%2Fwww.khronos.org%2Ffiles%2Fopengles_shading_language.pdf%23page%3D46%26zoom%3D100%2C153%2C153 "https://www.khronos.org/files/opengles_shading_language.pdf#page=46&zoom=100,153,153")。

### 预处理指令和精度限定词

#### 预处理指令

预处理指令用来在真正编译前对代码进行预处理，如下代码表示如果定义了内置 GL\_ES 宏，则限定 float 的精度为 mediump。

```arduino
#ifdef GL_ES
precision mediump float;
#endif
```

在 GLSL ES 中可能用到的三种预处理指令：

```arduino
1.判断条件为 true 则执行
#if 表达式
#endif

2.判断是否定义了某宏
#ifdef 某宏
#endif

2.如果没有定义某宏，则执行
#ifndef 某宏
#endif
```

#### 精度限定词

精度限定词用于限定指定类型数据使用的精度，其作用是帮助着色器程序减少内存的开销，例如当 WebGL 程序需要运行在一些内存有限的硬件上时，就可能需要设置为低精度。目前 WebGL 程序支持 `highp` 、 `mediump` 和 `lowp` 三种精度，声明格式如下：

_**<精度限定词> <数据类型>**_

着色器已经实现了默认的精度，如下：

着色器类型

数据类型

默认精度

顶点着色器

int

highp

float

highp

sampler2D

lowp

samplerCube

lowp

片元着色器

int

mediump

float

无

sampler2D

lowp

samplerCube

lowp

其中片元着色器中的 float 类型没有默认精度，因此，如果在片元着色器中显示声明了 float 类型变量，又没有定义精度值，则通过捕获异常，可以看到如下报错信息： ![](/images/jueJin/88fff50c56434e6.png)

### 内置变量和内置函数

#### 常见内置变量

类别

内置变量

顶点着色器内置变量

gl\_Position（顶点坐标）、gl\_PointSize（顶点大小）、gl\_Normal（顶点法线）

片元着色器内置变量

gl\_FragColor（片元颜色）、gl\_FragCoord（片元坐标）、gl\_FragDepth（片元深度）

#### 常见内置函数

类别

内置函数

角度函数

radians（角度制转弧度制），degrees（弧度制转角度值）

三角函数

sin（正弦），cos（余弦），tan（正切），asin（反正弦），acos（反余弦），atan（反正切）

指数函数

pow（x"），exp（自然指数），log（自然对数），exp2（2"），log2（以2为底对数），

sqrt（开平方），inversesqrt（开平方的倒数）

通用函数

abs（绝对值），min（最小值），max（最大值），mod（取余数），sign（取正负号），loor（向下取整），ceil（向上取整），clamp（限定范围），mix（线性内插），step（步进函数），smoothstep（内插步进函数）、fract（获取小数部分）

几何函数

length（矢量长度），distance（两点间距离），dot（内积），cross（外积），nor-malize（归一化），reflect（矢量反射），faceforward（使向量"朝前"）

矩阵函数

matrixCmpMult（逐元素乘法）

失量函数

lessThan（逐元素小于），lessThanEqual（逐元素小于等于），greaterThan（逐元素大于），greaterThanEqual（逐元素大于等于），equal（逐元素相等），notE-qual（逐元素不等），any（任一元素为true则为true），all（所有元素为true则为true），not（逐元素取补）

纹理查询函数

texture2D（在二维纹理中获取纹素），textureCube（在立方体纹理中获取纹素），texture2DProj（texture2D的投影版本）

关于着色器语言的语法知识就介绍到这里，后续如果需要了解更多具体的信息，可以查看 [OpenGL ES 规范](https://link.juejin.cn?target=https%3A%2F%2Fwww.khronos.org%2Ffiles%2Fopengles_shading_language.pdf%23page%3D46%26zoom%3D100%2C153%2C153 "https://www.khronos.org/files/opengles_shading_language.pdf#page=46&zoom=100,153,153")。

参考资料
----

*   OpenGL编程指南（第8版）
*   掘金小册《WebGL 入门与实践》[深入理解 GLSL 语法](https://juejin.cn/book/6844733755580481543/section/6844733755932803086 "https://juejin.cn/book/6844733755580481543/section/6844733755932803086")