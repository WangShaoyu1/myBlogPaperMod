---
author: "Sunshine_Lin"
title: "太震撼了！我把七大JS排序算法做成了可视化！！！太好玩了！"
date: 2021-09-05
description: "前言 大家好，我是林三心。写这篇文章是有原因的，偶然我看到了一个Java的50种排序算法的可视化的视频，但是此视频却没给出具体的实现教程，于是我心里就想着，我可以用JavaScript + canva"
tags: ["前端","JavaScript","算法中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:743,comments:0,collects:650,views:35309,"
---
前言
--

大家好，我是林三心。写这篇文章是有原因的，偶然我看到了一个`Java的50种排序算法的可视化`的视频，但是此视频却没给出具体的实现教程，于是我心里就想着，我可以用`JavaScript + canvas`去实现这个酷炫的效果。每种排序算法的动画效果基本都不一样哦。例如`冒泡排序`是这样的

![冒泡排序2.gif](/images/jueJin/901cc299974a437.png)

实现思路
----

### 想实现的效果

从封面可以看到，无论是哪种算法，一开始都是第一张图，而最终目的是要变成第二张图的效果

![截屏2021-09-05 下午6.05.45.png](/images/jueJin/b1dac00f079b401.png)

![截屏2021-09-05 下午6.06.03.png](/images/jueJin/38f29f83e624461.png)

### 极坐标

讲实现思路之前，我先给大家复习一下高中的一个知识——**极坐标**。哈哈，不知道还有几个人记得他呢？

*   O：极点，也就是原点
*   ρ：极径
*   θ：极径与X轴夹角
*   `x = ρ * cosθ`，因为`x / ρ = cosθ`
*   `y = ρ * sinθ`，因为`y / ρ = sinθ`

![截屏2021-09-05 下午6.26.31.png](/images/jueJin/53c240cf5641444.png)

那我们想实现的结果，又跟**极坐标**有何关系呢？其实是有关系的，比如我现在有一个排序好的数组，他具有37个元素，那我们可以把这`37个元素`转化为极坐标中的`37个点`，怎么转呢？

```js
    const arr = [
    0, 1, 2, 3, 4, 5, 6, 7, 8,
    9, 10, 11, 12, 13, 14, 15, 16, 17,
    18, 19, 20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30, 31, 32, 33, 34, 35, 36
]
```

我们可以这么转：

*   `元素对应的索引index * 10 -> 角度θ`(为什么要乘10呢，因为要凑够360°嘛)
*   `元素对应的值arr[index] -> 极径ρ`

按照上面的规则来转的话，那我们就可以在极坐标上得到这37个点（在canvas中Y轴是由上往下的，下面这个图也是按canvas的，但是Y轴我还是画成正常方向，所以这个图其实是反的，但是是有原因的哈）：

```js
(0 -> θ = 00°，ρ = 0) (1 -> θ = 10°，ρ = 1) (2 -> θ = 20°，ρ = 2) (3 -> θ = 30°，ρ = 3)
(4 -> θ = 40°，ρ = 4) (5 -> θ = 50°，ρ = 5) (6 -> θ = 60°，ρ = 6) (7 -> θ = 70°，ρ = 7)
(8 -> θ = 80°，ρ = 8) (9 -> θ = 90°，ρ = 9) (10 -> θ = 100°，ρ = 10) (11 -> θ = 110°，ρ = 11)
(12 -> θ = 120°，ρ = 12) (13 -> θ = 130°，ρ = 13) (14 -> θ = 140°，ρ = 14) (15 -> θ = 150°，ρ = 15)
(16 -> θ = 160°，ρ = 16) (17 -> θ = 170°，ρ = 17) (18 -> θ = 180°，ρ = 18) (19 -> θ = 190°，ρ = 19)
(20 -> θ = 200°，ρ = 20) (21 -> θ = 210°，ρ = 21) (22 -> θ = 220°，ρ = 22) (23 -> θ = 230°，ρ = 23)
(24 -> θ = 240°，ρ = 24) (25 -> θ = 250°，ρ = 25) (26 -> θ = 260°，ρ = 26) (27 -> θ = 270°，ρ = 27)
(28 -> θ = 280°，ρ = 28) (29 -> θ = 290°，ρ = 29) (30 -> θ = 300°，ρ = 30) (31 -> θ = 310°，ρ = 31)
(32 -> θ = 320°，ρ = 32) (33 -> θ = 330°，ρ = 33) (34 -> θ = 340°，ρ = 34) (35 -> θ = 350°，ρ = 35)
(36 -> θ = 360°，ρ = 36)
```

![截屏2021-09-05 下午7.11.07.png](/images/jueJin/567cdf62397e411.png)

有没有发现，跟咱们想实现的最终效果的轨迹很像呢？

![截屏2021-09-05 下午6.06.03.png](/images/jueJin/38f29f83e624461.png)

### 随机打散

那说完最终的效果，咱们来下想想如何一开始先把数组的各个元素打散在极坐标上呢？其实很简单，咱们可以先把生成一个乱序的数组，比如

```js
    const arr = [
    25, 8, 32, 1, 19, 14, 0, 29, 17,
    6, 7, 26, 3, 30, 31, 16, 28, 15,
    24, 10, 21, 2, 9, 4, 35, 5, 36,
    33, 11, 27, 34, 22, 13, 18, 23, 12, 20
]
```

然后还是用上面那个规则，去转换极坐标

*   `元素对应的索引index * 10 -> 角度θ`(为什么要乘10呢，因为要凑够360°嘛)
*   `元素对应的值arr[index] -> 极径ρ` 那么我们可以的到这37个点，自然就可以实现**打散**的效果

```js
(25 -> θ = 00°，ρ = 25) (8 -> θ = 10°，ρ = 8) (32 -> θ = 20°，ρ = 32) (1 -> θ = 30°，ρ = 1)
(19 -> θ = 40°，ρ = 19) (14 -> θ = 50°，ρ = 14) (0 -> θ = 60°，ρ = 0) (29 -> θ = 70°，ρ = 29)
(17 -> θ = 80°，ρ = 17) (6 -> θ = 90°，ρ = 6) (7 -> θ = 100°，ρ = 7) (26 -> θ = 110°，ρ = 26)
(3 -> θ = 120°，ρ = 3) (30 -> θ = 130°，ρ = 30) (31 -> θ = 140°，ρ = 31) (16 -> θ = 150°，ρ = 16)
(28 -> θ = 160°，ρ = 28) (15 -> θ = 170°，ρ = 15) (24 -> θ = 180°，ρ = 24) (10 -> θ = 190°，ρ = 10)
(21 -> θ = 200°，ρ = 21) (2 -> θ = 210°，ρ = 2) (9 -> θ = 220°，ρ = 9) (4 -> θ = 230°，ρ = 4)
(35 -> θ = 240°，ρ = 35) (5 -> θ = 250°，ρ = 5) (36 -> θ = 260°，ρ = 36) (33 -> θ = 270°，ρ = 33)
(11 -> θ = 280°，ρ = 11) (27 -> θ = 290°，ρ = 27) (34 -> θ = 300°，ρ = 34) (22 -> θ = 310°，ρ = 22)
(13 -> θ = 320°，ρ = 13) (18 -> θ = 330°，ρ = 18) (23 -> θ = 340°，ρ = 23) (12 -> θ = 350°，ρ = 12)
(20 -> θ = 360°，ρ = 20)
```

![截屏2021-09-05 下午7.32.17.png](/images/jueJin/c96eff25507041c.png)

### 实现效果

综上所述，咱们想实现效果，也就有了思路

*   1、先生成一个`乱序数组`
*   2、用canvas画布画出此`乱序数组`所有元素对应的`极坐标对应的点`
*   3、对`乱序数组`进行`排序`
*   4、排序过程中`不断清空画布`，并`重画`数组所有元素对应的极坐标对应的点
*   5、直到排序完成，终止画布操作

![截屏2021-09-05 下午7.41.54.png](/images/jueJin/5b2cb5b32d744dc.png)

开搞！！！
-----

咱们，做事情一定要有条有理才行，还记得上面说的步骤吗？

*   1、先生成一个`乱序数组`
*   2、用canvas画布画出此`乱序数组`所有元素对应的`极坐标对应的点`
*   3、对`乱序数组`进行`排序`
*   4、排序过程中`不断清空画布`，并`重画`数组所有元素对应的极坐标对应的点
*   5、直到排序完成，终止画布操作 咱们就按照这个步骤，来一步一步实现效果，兄弟们，冲啊！！！

### 生成乱序数组

咱们上面举的例子是37个元素，但是37个肯定是太少了，咱们搞多点吧，我搞了这么一个数组nums：我先生成一个`0 - 179`的有序数组，然后打乱，并塞进数组nums中，此操作我执行4次。为什么是`0 - 179`，因为`0 - 179`刚好有180个数字

身位一个程序员，我肯定不可能自己手打这么多元素的啦。。来。。上代码

```js
let nums = []
    for (let i = 0; i < 4; i++) {
    // 生成一个 0 - 179的有序数组
    const arr = [...Array(180).keys()] // Array.keys()可以学一下，很有用
const res = []
    while (arr.length) {
    // 打乱
    const randomIndex = Math.random() * arr.length - 1
    res.push(arr.splice(randomIndex, 1)[0])
}
nums = [...nums, ...res]
}
```

经过上面操作，也就是我的nums中拥有`4 * 180 = 720`个元素，nums中的元素都是`0 - 179`范围内的

### canvas画乱序数组

画canvas之前，肯定要现在html页面上，编写一个canvas的节点，这里我宽度设置1000，高度也是1000，并且背景颜色是黑色

```js
<canvas id="canvas" width="1000" height="1000" style="background: #000;"></canvas>
```

上面看到了，极点(原点)是在坐标正中间的，但是canvas的初始原点是在画布的左上角，我们需要把canvas的原点移动到画布的正中间，那正中间的坐标是多少呢？还记得咱们宽高都是1000吗？那画布中心点坐标不就是`(500, 500)`，咱们可以使用canvas的`ctx.translate(500, 500)`来移动中心点位置。因为咱们画的点都是白色的，所以咱们顺便把`ctx.fillStyle`设置为`white`

> 有一点注意了哈，canvas里的Y轴是自上向下的，与常规的Y轴的相反的。

![截屏2021-09-05 下午8.55.39.png](/images/jueJin/3932a6df1fc0412.png)

```js
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
ctx.fillStyle = 'white' // 设置画画的颜色
ctx.translate(500, 500) // 移动中心点到(500, 500)
```

那到底该怎么画点呢？按照之前的，其实光计算出`角度θ`和`极径ρ`是不够的，因为canvas画板不认这两个东西啊。。那canvas认啥呢，他只认`(x, y)`，所以咱们只要通过`角度θ`和`极径ρ`去算出`(x, y)`，就好了，还记得前面极坐标的公式吗

*   `x = ρ * cosθ`，因为`x / ρ = cosθ`
*   `y = ρ * sinθ`，因为`y / ρ = sinθ`

由于咱们是要铺散点是要铺出一个圆形来，那么一个圆形的角度是`0° - 360°`，但是我们不要360°，咱们只要`0° - 359°`，因为`0°和360°`是同一个直线。咱们一个直线上有一个度数就够了。所以咱们要求出`0° - 359°`每个角度所对应的`cosθ和sinθ`(这里咱们只算整数角度，不算小数角度)

```js
const CosandSin = []
    for (let i = 0; i < 360; i++) {
    const jiaodu = i / 180 * Math.PI
    CosandSin.push({ cos: Math.cos(jiaodu), sin: Math.sin(jiaodu) })
}
```

这时候又有新问题了，咱们一个圆上的整数角度只有`0° - 359°`这`360个整数角`，但是`nums`中有`720个元素`啊，那怎么分配画布呢？很简单啊，一个角度上画2个元素，那不就刚好 `2 * 360 = 720`

行，咱们废话不多说，开始画初始散点吧。咱们也知道咱们需要画720个点，对于这种多个相同的东西，咱们要多多使用`面向对象`这种编程思想

```js
// 单个长方形构造函数
    function Rect(x, y, width, height) {
    this.x = x // 坐标x
    this.y = y // 坐标y
    this.width = width // 长方形的宽
    this.height = height // 长方形的高
}

// 单个长方形的渲染函数
    Rect.prototype.draw = function () {
    ctx.beginPath() // 开始画一个
    ctx.fillRect(this.x, this.y, this.width, this.height) // 画一个
    ctx.closePath() // 结束画一个
}

const CosandSin = []
    for (let i = 0; i < 360; i++) {
    const jiaodu = i / 180 * Math.PI
    CosandSin.push({ cos: Math.cos(jiaodu), sin: Math.sin(jiaodu) })
}

    function drawAll(arr) {
    const rects = [] // 用来存储720个长方形
        for (let i = 0; i < arr.length; i++) {
    const num = arr[i]
    const { cos, sin } = CosandSin[Math.floor(i / 2)] // 一个角画两个
    const x = num * cos // x = ρ * cosθ
    const y = num * sin // y = ρ * sinθ
    rects.push(new Rect(x, y, 5, 3)) // 收集所有长方形
}
rects.forEach(rect => rect.draw()) // 遍历渲染
}
drawAll(nums) // 执行渲染函数
```

来页面中看看效果吧。此时就完成了初始的散点渲染

![截屏2021-09-05 下午6.05.45.png](/images/jueJin/da72e774f83845f.png)

### 边排序边重画

其实很简单，就是排序一次，就清空画布，然后重新执行上面的渲染函数`drawAll`就行了。由于性能原因，我先把`drawAll`封装成一个`Promise函数`

```js
    function drawAll(arr) {
        return new Promise((resolve) => {
            setTimeout(() => {
            ctx.clearRect(-500, -500, 1000, 1000) // 清空画布
            const rects = [] // 用来存储720个长方形
                for (let i = 0; i < arr.length; i++) {
            const num = arr[i]
            const { cos, sin } = CosandSin[Math.floor(i / 2)] // 一个角画两个
            const x = num * cos // x = ρ * cosθ
            const y = num * sin // y = ρ * sinθ
            rects.push(new Rect(x, y, 5, 3)) // 收集所有长方形
        }
        rects.forEach(rect => rect.draw()) // 遍历渲染
        resolve('draw success')
        }, 10)
        })
    }
```

然后咱们拿一个排序算法例子来讲一讲，就拿个`冒泡排序`来讲吧

```js
    async function bubbleSort(arr) {
    var len = arr.length;
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < len - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {        //相邻元素两两对比
            var temp = arr[j + 1];        //元素交换
            arr[j + 1] = arr[j];
            arr[j] = temp;
        }
    }
    await drawAll(arr) // 一边排序一边重新画
}
return arr;
}
```

然后在页面里放一个按钮，用来执行开始排序

```js
<button id="btn">开始排序</button>

    document.getElementById('btn').onclick = function () {
    bubbleSort(nums)
}
```

效果如下，是不是很开心哈哈哈！！！

![冒泡排序gift.gif](/images/jueJin/46e51040360f4cc.png)

### 完整代码

这是完整代码

```js
<canvas id="canvas" width="1000" height="1000" style="background: #000;"></canvas>
<button id="btn">开始排序</button>
``````js
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
ctx.fillStyle = 'white' // 设置画画的颜色
ctx.translate(500, 500) // 移动中心点到(500, 500)

let nums = []
    for (let i = 0; i < 4; i++) {
    // 生成一个 0 - 180的有序数组
const arr = [...Array(180).keys()]
const res = []
    while (arr.length) {
    // 打乱
    const randomIndex = Math.random() * arr.length - 1
    res.push(arr.splice(randomIndex, 1)[0])
}
nums = [...nums, ...res]
}

// 单个长方形构造函数
    function Rect(x, y, width, height) {
    this.x = x // 坐标x
    this.y = y // 坐标y
    this.width = width // 长方形的宽
    this.height = height // 长方形的高
}

// 单个长方形的渲染函数
    Rect.prototype.draw = function () {
    ctx.beginPath() // 开始画一个
    ctx.fillRect(this.x, this.y, this.width, this.height) // 画一个
    ctx.closePath() // 结束画一个
}

const CosandSin = []
    for (let i = 0; i < 360; i++) {
    const jiaodu = i / 180 * Math.PI
    CosandSin.push({ cos: Math.cos(jiaodu), sin: Math.sin(jiaodu) })
}

    function drawAll(arr) {
        return new Promise((resolve) => {
            setTimeout(() => {
            ctx.clearRect(-500, -500, 1000, 1000) // 清空画布
            const rects = [] // 用来存储720个长方形
                for (let i = 0; i < arr.length; i++) {
            const num = arr[i]
            const { cos, sin } = CosandSin[Math.floor(i / 2)] // 一个角画两个
            const x = num * cos // x = ρ * cosθ
            const y = num * sin // y = ρ * sinθ
            rects.push(new Rect(x, y, 5, 3)) // 收集所有长方形
        }
        rects.forEach(rect => rect.draw()) // 遍历渲染
        resolve('draw success')
        }, 10)
        })
    }
    drawAll(nums) // 执行渲染函数
    
        async function bubbleSort(arr) {
        var len = arr.length;
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < len - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {        //相邻元素两两对比
                var temp = arr[j + 1];        //元素交换
                arr[j + 1] = arr[j];
                arr[j] = temp;
            }
        }
        await drawAll(arr) // 一边排序一边重新画
    }
    return arr;
}

    document.getElementById('btn').onclick = function () {
    bubbleSort(nums) // 点击执行
}
```

正片开始！！！
-------

首先说明，哈哈

*   我是算法渣渣
*   每种算法排序，动画都不一样
*   drawAll放在不同地方也可能有不同效果

### 冒泡排序

```js
    async function bubbleSort(arr) {
    var len = arr.length;
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < len - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {        //相邻元素两两对比
            var temp = arr[j + 1];        //元素交换
            arr[j + 1] = arr[j];
            arr[j] = temp;
        }
    }
    await drawAll(arr) // 一边排序一边重新画
}
return arr;
}

    document.getElementById('btn').onclick = function () {
    bubbleSort(nums) // 点击执行
}
```

![冒泡排序gift.gif](/images/jueJin/46e51040360f4cc.png)

### 选择排序

```js
    async function selectionSort(arr) {
    var len = arr.length;
    var minIndex, temp;
        for (var i = 0; i < len - 1; i++) {
        minIndex = i;
            for (var j = i + 1; j < len; j++) {
            if (arr[j] < arr[minIndex]) {     //寻找最小的数
            minIndex = j;                 //将最小数的索引保存
        }
    }
    temp = arr[i];
    arr[i] = arr[minIndex];
    arr[minIndex] = temp;
    await drawAll(arr)
}
return arr;
}
    document.getElementById('btn').onclick = function () {
    selectionSort(nums)
}
```

![选择排序gif.gif](/images/jueJin/ad094322a96844a.png)

### 插入排序

```js
    async function insertionSort(arr) {
        if (Object.prototype.toString.call(arr).slice(8, -1) === 'Array') {
            for (var i = 1; i < arr.length; i++) {
            var key = arr[i];
            var j = i - 1;
                while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
            await drawAll(arr)
        }
        return arr;
            } else {
            return 'arr is not an Array!';
        }
    }
        document.getElementById('btn').onclick = function () {
        insertionSort(nums)
    }
```

![插入排序gif.gif](/images/jueJin/a04f515f6701405.png)

### 堆排序

```js
    async function heapSort(array) {
        if (Object.prototype.toString.call(array).slice(8, -1) === 'Array') {
        //建堆
        var heapSize = array.length, temp;
            for (var i = Math.floor(heapSize / 2) - 1; i >= 0; i--) {
            heapify(array, i, heapSize);
            await drawAll(array)
        }
        
        //堆排序
            for (var j = heapSize - 1; j >= 1; j--) {
            temp = array[0];
            array[0] = array[j];
            array[j] = temp;
            heapify(array, 0, --heapSize);
            await drawAll(array)
        }
        return array;
            } else {
            return 'array is not an Array!';
        }
    }
        function heapify(arr, x, len) {
            if (Object.prototype.toString.call(arr).slice(8, -1) === 'Array' && typeof x === 'number') {
            var l = 2 * x + 1, r = 2 * x + 2, largest = x, temp;
                if (l < len && arr[l] > arr[largest]) {
                largest = l;
            }
                if (r < len && arr[r] > arr[largest]) {
                largest = r;
            }
                if (largest != x) {
                temp = arr[x];
                arr[x] = arr[largest];
                arr[largest] = temp;
                heapify(arr, largest, len);
            }
                } else {
                return 'arr is not an Array or x is not a number!';
            }
        }
            document.getElementById('btn').onclick = function () {
            heapSort(nums)
        }
```

![堆排序gif.gif](/images/jueJin/6960a0a08f134fa.png)

### 快速排序

```js
    async function quickSort(array, left, right) {
    drawAll(nums)
        if (Object.prototype.toString.call(array).slice(8, -1) === 'Array' && typeof left === 'number' && typeof right === 'number') {
            if (left < right) {
            var x = array[right], i = left - 1, temp;
                for (var j = left; j <= right; j++) {
                    if (array[j] <= x) {
                    i++;
                    temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
            }
            await drawAll(nums)
            await quickSort(array, left, i - 1);
            await quickSort(array, i + 1, right);
            await drawAll(nums)
        }
        return array;
            } else {
            return 'array is not an Array or left or right is not a number!';
        }
    }
        document.getElementById('btn').onclick = function () {
        quickSort(nums, 0, nums.length - 1)
    }
```

![快排gif.gif](/images/jueJin/f771dca1825a44b.png)

### 基数排序

```js
    async function radixSort(arr, maxDigit) {
    var mod = 10;
    var dev = 1;
    var counter = [];
        for (var i = 0; i < maxDigit; i++, dev *= 10, mod *= 10) {
            for (var j = 0; j < arr.length; j++) {
            var bucket = parseInt((arr[j] % mod) / dev);
                if (counter[bucket] == null) {
                counter[bucket] = [];
            }
            counter[bucket].push(arr[j]);
        }
        var pos = 0;
            for (var j = 0; j < counter.length; j++) {
            var value = null;
                if (counter[j] != null) {
                    while ((value = counter[j].shift()) != null) {
                    arr[pos++] = value;
                    await drawAll(arr)
                }
            }
        }
    }
    return arr;
}
    document.getElementById('btn').onclick = function () {
    radixSort(nums, 3)
}
```

![基数排序gif.gif](/images/jueJin/9fcce989d27d4ad.png)

### 希尔排序

```js
    async function shellSort(arr) {
    var len = arr.length,
    temp,
    gap = 1;
    while (gap < len / 5) {          //动态定义间隔序列
    gap = gap * 5 + 1;
}
    for (gap; gap > 0; gap = Math.floor(gap / 5)) {
        for (var i = gap; i < len; i++) {
        temp = arr[i];
            for (var j = i - gap; j >= 0 && arr[j] > temp; j -= gap) {
            arr[j + gap] = arr[j];
        }
        arr[j + gap] = temp;
        await drawAll(arr)
    }
}
return arr;
}
    document.getElementById('btn').onclick = function () {
    shellSort(nums)
}

```

![基数排序gif.gif](/images/jueJin/a6a41e8a5094437.png)

参考
--

*   排序算法参考：[十大经典排序算法总结（JavaScript描述）](https://juejin.cn/post/6844903444365443080 "https://juejin.cn/post/6844903444365443080")

总结
--

如果你觉得此文对你有一丁点帮助，点个赞，鼓励一下林三心哈哈。

**如果你想一起学习前端或者摸鱼，那你可以加我，加入我的摸鱼学习群，点击这里** ---> [摸鱼沸点](https://juejin.cn/pin/7035153948126216206 "https://juejin.cn/pin/7035153948126216206")

**如果你是有其他目的的，别加我，我不想跟你交朋友，我只想简简单单学习前端，不想搞一些有的没的！！！**