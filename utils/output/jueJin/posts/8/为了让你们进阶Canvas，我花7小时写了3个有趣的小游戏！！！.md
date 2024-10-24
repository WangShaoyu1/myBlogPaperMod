---
author: "Sunshine_Lin"
title: "为了让你们进阶Canvas，我花7小时写了3个有趣的小游戏！！！"
date: 2021-07-26
description: "前言 大家好，我是林三心，相信大家看了我前一篇canvas入门文章为了让她10分钟入门canvas，我熬夜写了3个小项目和这篇文章，对canvas已经有了入门级的了解。今天，我又用canvas写了三个"
tags: ["前端","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:567,comments:0,collects:732,views:18195,"
---
「本文已参与好文召集令活动，点击查看：[后端、大前端双赛道投稿，2万元奖池等你挑战！](https://juejin.cn/post/6978685539985653767 "https://juejin.cn/post/6978685539985653767")」

前言
--

大家好，我是林三心，相信大家看了我前一篇canvas入门文章[为了让她10分钟入门canvas，我熬夜写了3个小项目和这篇文章](https://juejin.cn/post/6986785259966857247 "https://juejin.cn/post/6986785259966857247")，对canvas已经有了入门级的了解。今天，我又用canvas写了三个有趣的小游戏，来哄你们开心，没错，我的心里只有你们，没有她。

![image.png](/images/jueJin/1638d63f2e754ef.png)

![截屏2021-07-25 上午12.15.24.png](/images/jueJin/7eabe684f6a949d.png)

现在是凌晨0点15分，咱们开搞🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍，一边调试一边把这篇文章写了！！！

贪吃蛇🐍
-----

最终效果如下： ![贪吃蛇.gif](/images/jueJin/c9a17c2d38af4b7.png) 实现步骤分为以下几步：

*   1、把蛇画出来
*   2、让蛇动起来
*   3、随机投放食物
*   4、蛇吃食物
*   5、边缘检测与撞自己检测

### 1\. 把蛇画出来

其实画蛇很简单，蛇就是由`蛇头和蛇身`组成，而其实都可以用`正方格`来表示，`蛇头`就是一个方格，而`蛇身`可以是很多个方格

画方格可以用`ctx.fillRect`来画，蛇头使用`head`表示，而蛇身使用`数组body`来表示 ![截屏2021-07-24 下午10.43.46.png](/images/jueJin/1041ce7bd584457.png)

```js
// html
<canvas id="canvas" width="800" height="800"></canvas>

// js


draw()

    function draw() {
    const canvas = document.getElementById('canvas')
    
    const ctx = canvas.getContext('2d')
    
    // 小方格的构造函数
        function Rect(x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
    }
    
        Rect.prototype.draw = function () {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.strokeRect(this.x, this.y, this.width, this.height)
    }
    
    // 蛇的构造函数
        function Snake(length = 0) {
        
        this.length = length
        // 蛇头
        this.head = new Rect(canvas.width / 2, canvas.height / 2, 40, 40, 'red')
        
        // 蛇身
    this.body = []
    
    let x = this.head.x - 40
    let y = this.head.y
    
        for (let i = 0; i < this.length; i++) {
        const rect = new Rect(x, y, 40, 40, 'yellow')
        this.body.push(rect)
        x -= 40
    }
}

    Snake.prototype.drawSnake = function () {
    // 绘制蛇头
    this.head.draw()
    // 绘制蛇身
        for (let i = 0; i < this.body.length; i++) {
        this.body[i].draw()
    }
}

const snake = new Snake(3)
snake.drawSnake()
}
```

### 2\. 让蛇动起来

蛇动起来有两种情况：

*   1、蛇一开始就会默认向右移动
*   2、通过方向键控制，往不同方向移动 这两种情况每秒都是移动`一个方格的位置`

让蛇动起来，其实原理很简单，我就以蛇向右移动来举例子吧： ![截屏2021-07-24 下午10.57.06.png](/images/jueJin/1c84595acd37485.png)

*   1、蛇头先右移一个方格距离，蛇身不动
*   2、蛇身`首部`加一个方格
*   3、蛇身`尾部`的方格去除
*   4、利用定时器，造成蛇不断向右移动的视觉

```js
    Snake.prototype.moveSnake = function () {
    // 将蛇头上一次状态，拼到蛇身首部
    const rect = new Rect(this.head.x, this.head.y, this.head.width, this.head.height, 'yellow')
    this.body.unshift(rect)
    
    this.body.pop()
    
    // 根据方向，控制蛇头的坐标
        switch (this.direction) {
        case 0:
        this.head.x -= this.head.width
        break
        case 1:
        this.head.y -= this.head.height
        break
        case 2:
        this.head.x += this.head.width
        break
        case 3:
        this.head.y += this.head.height
        break
    }
}

    document.onkeydown = function (e) {
    // 键盘事件
    e = e || window.event
    // 左37  上38  右39  下40
        switch (e.keyCode) {
        case 37:
        console.log(37)
        // 三元表达式，防止右移动时按左，下面同理(贪吃蛇可不能直接掉头)
        snake.direction = snake.direction === 2 ? 2 : 0
        snake.moveSnake()
        break
        case 38:
        console.log(38)
        snake.direction = snake.direction === 3 ? 3 : 1
        break
        case 39:
        console.log(39)
        snake.direction = snake.direction === 0 ? 0 : 2
        break
        case 40:
        console.log(40)
        snake.direction = snake.direction === 1 ? 1 : 3
        break
        
    }
}

const snake = new Snake(3)
// 默认direction为2，也就是右
snake.direction = 2
snake.drawSnake()

    function animate() {
    // 先清空
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // 移动
    snake.moveSnake()
    // 再画
    snake.drawSnake()
}

    var timer = setInterval(() => {
    animate()
    }, 100)
}
```

实现效果如下：

![蛇动起来.gif](/images/jueJin/1f45bd60bb9545f.png)

### 3\. 随机投放食物

随机投放食物，也就是在画布中随机画一个方格，要注意以下两点：

*   1、坐标要在画布`范围内`
*   2、食物`不能投到蛇身或者蛇头上`(这样会把蛇砸晕的嘿嘿)

```js
    function randomFood(snake) {
    let isInSnake = true
    let rect
        while (isInSnake) {
        const x = Math.round(Math.random() * (canvas.width - 40) / 40) * 40
        const y = Math.round(Math.random() * (canvas.height - 40) / 40) * 40
        console.log(x, y)
        // 保证是40的倍数啊
        rect = new Rect(x, y, 40, 40, 'blue')
        // 判断食物是否与蛇头蛇身重叠
            if ((snake.head.x === x && snake.head.y === y) || snake.body.find(item => item.x === x && item.y === y)) {
            isInSnake = true
            continue
                } else {
                isInSnake = false
            }
        }
        return rect
    }
    
    const snake = new Snake(3)
    // 默认direction为2，也就是右
    snake.direction = 2
    snake.drawSnake()
    // 创建随机食物实例
    var food = randomFood(snake)
    // 画出食物
    food.draw()
    
        function animate() {
        // 先清空
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        // 移动
        snake.moveSnake()
        // 再画
        snake.drawSnake()
        food.draw()
    }
```

效果如下，随机食物画出来了： ![截屏2021-07-24 下午11.17.03.png](/images/jueJin/8c1197ee84ed413.png)

### 4\. 蛇吃食物

其实蛇吃食物，很简单理解，也就是蛇头移动到跟食物的`坐标重叠`时，就算是吃到食物了，注意两点：

*   1、吃到食物后，蛇身要`延长一个空格`
*   2、吃到食物后，随机食物要`变换位置`

```js
const canvas = document.getElementById('canvas')

const ctx = canvas.getContext('2d')

// 定义一个全局的是否吃到食物的一个变量
let isEatFood = false


    Snake.prototype.moveSnake = function () {
    // 将蛇头上一次状态，拼到蛇身首部
    const rect = new Rect(this.head.x, this.head.y, this.head.width, this.head.height, 'yellow')
    this.body.unshift(rect)
    
    // 判断蛇头是否与食物重叠，重叠就是吃到了，没重叠就是没吃到
    isEatFood = food && this.head.x === food.x && this.head.y === food.y
    
    // 咱们上面在蛇身首部插入方格
        if (!isEatFood) {
        // 没吃到就要去尾，相当于整条蛇没变长
        this.body.pop()
            } else {
            // 吃到了就不去尾，相当于整条蛇延长一个方格
            
            // 并且吃到了，就要重新生成一个随机食物
            food = randomFood(this)
            food.draw()
            isEatFood = false
        }
        
        // 根据方向，控制蛇头的坐标
            switch (this.direction) {
            case 0:
            this.head.x -= this.head.width
            break
            case 1:
            this.head.y -= this.head.height
            break
            case 2:
            this.head.x += this.head.width
            break
            case 3:
            this.head.y += this.head.height
            break
        }
    }
```

### 5\. 碰边界与碰自己

众所周知，蛇头碰到边界，或者碰到蛇身，都会终止游戏

```js
    Snake.prototype.drawSnake = function () {
    // 如果碰到了
        if (isHit(this)) {
        // 清除定时器
        clearInterval(timer)
        const con = confirm(`总共吃了${this.body.length - this.length}个食物，重新开始吗`)
        // 是否重开
            if (con) {
            draw()
        }
        return
    }
    // 绘制蛇头
    this.head.draw()
    // 绘制蛇身
        for (let i = 0; i < this.body.length; i++) {
        this.body[i].draw()
    }
}


    function isHit(snake) {
    const head = snake.head
    // 是否碰到左右边界
    const xLimit = head.x < 0 || head.x >= canvas.width
    // 是否碰到上下边界
    const yLimit = head.y < 0 || head.y >= canvas.height
    // 是否撞到蛇身
    const hitSelf = snake.body.find(({ x, y }) => head.x === x && head.y === y)
    // 三者其中一个为true则游戏结束
    return xLimit || yLimit || hitSelf
}
```

自此，贪吃蛇🐍小游戏完成喽： ![贪吃蛇.gif](/images/jueJin/c9a17c2d38af4b7.png)

### 6\. 全部代码：

```js

draw()

    function draw() {
    const canvas = document.getElementById('canvas')
    
    const ctx = canvas.getContext('2d')
    
    // 定义一个全局的是否吃到食物的一个变量
    let isEatFood = false
    
    // 小方格的构造函数
        function Rect(x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
    }
    
        Rect.prototype.draw = function () {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.strokeRect(this.x, this.y, this.width, this.height)
    }
    
    // 蛇的构造函数
        function Snake(length = 0) {
        
        this.length = length
        // 蛇头
        this.head = new Rect(canvas.width / 2, canvas.height / 2, 40, 40, 'red')
        
        // 蛇身
    this.body = []
    
    let x = this.head.x - 40
    let y = this.head.y
    
        for (let i = 0; i < this.length; i++) {
        const rect = new Rect(x, y, 40, 40, 'yellow')
        this.body.push(rect)
        x -= 40
    }
}

    Snake.prototype.drawSnake = function () {
    // 如果碰到了
        if (isHit(this)) {
        // 清除定时器
        clearInterval(timer)
        const con = confirm(`总共吃了${this.body.length - this.length}个食物，重新开始吗`)
        // 是否重开
            if (con) {
            draw()
        }
        return
    }
    // 绘制蛇头
    this.head.draw()
    // 绘制蛇身
        for (let i = 0; i < this.body.length; i++) {
        this.body[i].draw()
    }
}

    Snake.prototype.moveSnake = function () {
    // 将蛇头上一次状态，拼到蛇身首部
    const rect = new Rect(this.head.x, this.head.y, this.head.width, this.head.height, 'yellow')
    this.body.unshift(rect)
    
    // 判断蛇头是否与食物重叠，重叠就是吃到了，没重叠就是没吃到
    isEatFood = food && this.head.x === food.x && this.head.y === food.y
    
    // 咱们上面在蛇身首部插入方格
        if (!isEatFood) {
        // 没吃到就要去尾，相当于整条蛇没变长
        this.body.pop()
            } else {
            // 吃到了就不去尾，相当于整条蛇延长一个方格
            
            // 并且吃到了，就要重新生成一个随机食物
            food = randomFood(this)
            food.draw()
            isEatFood = false
        }
        
        // 根据方向，控制蛇头的坐标
            switch (this.direction) {
            case 0:
            this.head.x -= this.head.width
            break
            case 1:
            this.head.y -= this.head.height
            break
            case 2:
            this.head.x += this.head.width
            break
            case 3:
            this.head.y += this.head.height
            break
        }
    }
    
        document.onkeydown = function (e) {
        // 键盘事件
        e = e || window.event
        // 左37  上38  右39  下40
            switch (e.keyCode) {
            case 37:
            console.log(37)
            // 三元表达式，防止右移动时按左，下面同理(贪吃蛇可不能直接掉头)
            snake.direction = snake.direction === 2 ? 2 : 0
            snake.moveSnake()
            break
            case 38:
            console.log(38)
            snake.direction = snake.direction === 3 ? 3 : 1
            break
            case 39:
            console.log(39)
            snake.direction = snake.direction === 0 ? 0 : 2
            break
            case 40:
            console.log(40)
            snake.direction = snake.direction === 1 ? 1 : 3
            break
            
        }
    }
    
        function randomFood(snake) {
        let isInSnake = true
        let rect
            while (isInSnake) {
            const x = Math.round(Math.random() * (canvas.width - 40) / 40) * 40
            const y = Math.round(Math.random() * (canvas.height - 40) / 40) * 40
            console.log(x, y)
            // 保证是40的倍数啊
            rect = new Rect(x, y, 40, 40, 'blue')
            // 判断食物是否与蛇头蛇身重叠
                if ((snake.head.x === x && snake.head.y === y) || snake.body.find(item => item.x === x && item.y === y)) {
                isInSnake = true
                continue
                    } else {
                    isInSnake = false
                }
            }
            return rect
        }
        
            function isHit(snake) {
            const head = snake.head
            // 是否碰到左右边界
            const xLimit = head.x < 0 || head.x >= canvas.width
            // 是否碰到上下边界
            const yLimit = head.y < 0 || head.y >= canvas.height
            // 是否撞到蛇身
            const hitSelf = snake.body.find(({ x, y }) => head.x === x && head.y === y)
            // 三者其中一个为true则游戏结束
            return xLimit || yLimit || hitSelf
        }
        
        const snake = new Snake(3)
        // 默认direction为2，也就是右
        snake.direction = 2
        snake.drawSnake()
        // 创建随机食物实例
        var food = randomFood(snake)
        // 画出食物
        food.draw()
        
            function animate() {
            // 先清空
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            // 移动
            snake.moveSnake()
            // 再画
            snake.drawSnake()
            food.draw()
        }
        
            var timer = setInterval(() => {
            animate()
            }, 100)
        }
```

星星连线
----

效果如下，是不是很酷炫呢，兄弟们（[背景图片](https://link.juejin.cn?target=https%3A%2F%2Fimage.baidu.com%2Fsearch%2Fdetail%3Fct%3D503316480%26z%3D9%26ipn%3Dd%26word%3D%25E5%2585%2589%25E8%2583%25BD%25E4%25BD%25BF%25E8%2580%2585%26step_word%3D%26hs%3D0%26pn%3D0%26spn%3D0%26di%3D1980%26pi%3D0%26rn%3D1%26tn%3Dbaiduimagedetail%26is%3D0%252C0%26istype%3D0%26ie%3Dutf-8%26oe%3Dutf-8%26in%3D%26cl%3D2%26lm%3D-1%26st%3Dundefined%26cs%3D2835075056%252C3833573215%26os%3D3464699116%252C4100809266%26simid%3D5214747%252C605858583%26adpicid%3D0%26lpn%3D0%26ln%3D1560%26fr%3D%26fmq%3D1627141100748_R%26fm%3D%26ic%3Dundefined%26s%3Dundefined%26hd%3Dundefined%26latest%3Dundefined%26copyright%3Dundefined%26se%3D%26sme%3D%26tab%3D0%26width%3D0%26height%3D0%26face%3Dundefined%26ist%3D%26jit%3D%26cg%3D%26bdtype%3D0%26oriquery%3D%26objurl%3Dhttps%253A%252F%252Fgimg2.baidu.com%252Fimage_search%252Fsrc%253Dhttp%253A%252F%252Fimg.zcool.cn%252Fcommunity%252F0128ac5d2a0338a80120b5ab29051f.jpg%25402o.jpg%2526refer%253Dhttp%253A%252F%252Fimg.zcool.cn%2526app%253D2002%2526size%253Df9999%252C10000%2526q%253Da80%2526n%253D0%2526g%253D0n%2526fmt%253Djpeg%253Fsec%253D1629733107%2526t%253D83a732b85359a8b4063775fedcd6141a%26fromurl%3Dippr_z2C%2524qAzdH3FAzdH3Fooo_z%2526e3Bzv55s_z%2526e3Bv54_z%2526e3BvgAzdH3Fo56hAzdH3FZMzv8MzQdNzY%253DAzdH3F8_z%2526e3Bip4s%26gsm%3D1%26rpstart%3D0%26rpnum%3D0%26islist%3D%26querylist%3D%26nojc%3Dundefined "https://image.baidu.com/search/detail?ct=503316480&z=9&ipn=d&word=%E5%85%89%E8%83%BD%E4%BD%BF%E8%80%85&step_word=&hs=0&pn=0&spn=0&di=1980&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&istype=0&ie=utf-8&oe=utf-8&in=&cl=2&lm=-1&st=undefined&cs=2835075056%2C3833573215&os=3464699116%2C4100809266&simid=5214747%2C605858583&adpicid=0&lpn=0&ln=1560&fr=&fmq=1627141100748_R&fm=&ic=undefined&s=undefined&hd=undefined&latest=undefined&copyright=undefined&se=&sme=&tab=0&width=0&height=0&face=undefined&ist=&jit=&cg=&bdtype=0&oriquery=&objurl=https%3A%2F%2Fgimg2.baidu.com%2Fimage_search%2Fsrc%3Dhttp%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0128ac5d2a0338a80120b5ab29051f.jpg%402o.jpg%26refer%3Dhttp%3A%2F%2Fimg.zcool.cn%26app%3D2002%26size%3Df9999%2C10000%26q%3Da80%26n%3D0%26g%3D0n%26fmt%3Djpeg%3Fsec%3D1629733107%26t%3D83a732b85359a8b4063775fedcd6141a&fromurl=ippr_z2C%24qAzdH3FAzdH3Fooo_z%26e3Bzv55s_z%26e3Bv54_z%26e3BvgAzdH3Fo56hAzdH3FZMzv8MzQdNzY%3DAzdH3F8_z%26e3Bip4s&gsm=1&rpstart=0&rpnum=0&islist=&querylist=&nojc=undefined") 可以自己去下载一下）：

![星星连线.gif](/images/jueJin/9887034ec4e6410.png)

这个小游戏可分为以下几步：

*   1、画出单个小星星并使他`移动`
*   2、造出`一百个`小星星
*   3、星星之间靠近时，进行`连线`
*   4、鼠标`移动生成`小星星
*   5、鼠标点击产生`5个小星星`

### 1\. 画出单个小星星，并使他移动

其实移动星星很简单，就是清除后重新绘制星星，并利用定时器，就会有移动的视觉了。注意点在于：`碰到边界要反弹`。

```js
// html
<style>
    #canvas {
    background: url(./光能使者.jpg) 0 0/cover no-repeat;
}
</style>
<canvas id="canvas"></canvas>

// js

const canvas = document.getElementById('canvas')

const ctx = canvas.getContext('2d')

// 获取当前视图的宽度和高度
let aw = document.documentElement.clientWidth || document.body.clientWidth
let ah = document.documentElement.clientHeight || document.body.clientHeight
// 赋值给canvas
canvas.width = aw
canvas.height = ah

// 屏幕变动时也要监听实时宽高
    window.onresize = function () {
    aw = document.documentElement.clientWidth || document.body.clientWidth
    ah = document.documentElement.clientHeight || document.body.clientHeight
    // 赋值给canvas
    canvas.width = aw
    canvas.height = ah
}

// 本游戏无论是实心，还是线条，色调都是白色
ctx.fillStyle = 'white'
ctx.strokeStyle = 'white'

    function Star(x, y, r) {
    // x，y是坐标，r是半径
    this.x = x
    this.y = y
    this.r = r
    // speed参数，在  -3 ~ 3 之间取值
    this.speedX = (Math.random() * 3) * Math.pow(-1, Math.round(Math.random()))
    this.speedY = (Math.random() * 3) * Math.pow(-1, Math.round(Math.random()))
}

    Star.prototype.draw = function () {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
}

    Star.prototype.move = function () {
    this.x -= this.speedX
    this.y -= this.speedY
    // 碰到边界时，反弹，只需要把speed取反就行
    if (this.x < 0 || this.x > aw) this.speedX *= -1
    if (this.y < 0 || this.y > ah) this.speedY *= -1
}

// 随机在canvas范围内找一个坐标画星星
const star = new Star(Math.random() * aw, Math.random() * ah, 3)
star

// 星星的移动
    setInterval(() => {
    ctx.clearRect(0, 0, aw, ah)
    star.move()
    star.draw()
    }, 50)
```

达到以下`移动以及反弹`的效果：

![星星反弹.gif](/images/jueJin/fb768cbe366f42c.png)

### 2、画100个小星星

创建一个`数组stars`来存储这些星星

```js
const stars = []
    for (let i = 0; i < 100; i++) {
    // 随机在canvas范围内找一个坐标画星星
    stars.push(new Star(Math.random() * aw, Math.random() * ah, 3))
}

// 星星的移动
    setInterval(() => {
    ctx.clearRect(0, 0, aw, ah)
    // 遍历移动渲染
        stars.forEach(star => {
        star.move()
        star.draw()
        })
        }, 50)
```

效果如下：

![100个星星.gif](/images/jueJin/397260469b8e434.png)

### 3\. 星星之间靠近时，进行连线

当两个星星的x和y相差都小于50时，就进行连线，连线只需要使用`ctx.moveTo和ctx.lineTo`就可以了

```js
    function drawLine(startX, startY, endX, endY) {
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.stroke()
    ctx.closePath()
}

// 星星的移动
    setInterval(() => {
    ctx.clearRect(0, 0, aw, ah)
    // 遍历移动渲染
        stars.forEach(star => {
        star.move()
        star.draw()
        })
            stars.forEach((star, index) => {
            // 类似于冒泡排序那样，去比较，确保所有星星两两之间都比较到
                for (let i = index + 1; i < stars.length; i++) {
                    if (Math.abs(star.x - stars[i].x) < 50 && Math.abs(star.y - stars[i].y) < 50) {
                    drawLine(star.x, star.y, stars[i].x, stars[i].y)
                }
            }
            })
            }, 50)
```

大家可以想一想，为什么`两个forEach`不能何在一起去执行。这是个值得思考的问题，或者大家可以合并在一起执行，试试效果，获取就懂了。算是给大家留的一个作业哈！

效果如下：

![连线星星.gif](/images/jueJin/847a6208155642b.png)

### 4.鼠标移动时带着小星星

也就是鼠标到哪，那个小星星就到哪，并且这个小星星走到哪都会跟距离近的小星星`连线`

```js
const mouseStar = new Star(0, 0, 3)

    canvas.onmousemove = function (e) {
    mouseStar.x = e.clientX
    mouseStar.y = e.clientY
}

// 星星的移动
    setInterval(() => {
    ctx.clearRect(0, 0, aw, ah)
    // 鼠标星星渲染
    mouseStar.draw()
    // 遍历移动渲染
        stars.forEach(star => {
        star.move()
        star.draw()
        })
            stars.forEach((star, index) => {
            // 类似于冒泡排序那样，去比较，确保所有星星两两之间都比较到
                for (let i = index + 1; i < stars.length; i++) {
                    if (Math.abs(star.x - stars[i].x) < 50 && Math.abs(star.y - stars[i].y) < 50) {
                    drawLine(star.x, star.y, stars[i].x, stars[i].y)
                }
            }
            // 判断鼠标星星连线
                if (Math.abs(mouseStar.x - star.x) < 50 && Math.abs(mouseStar.y - star.y) < 50) {
                drawLine(mouseStar.x, mouseStar.y, star.x, star.y)
            }
            })
            }, 50)
```

效果如下：

![鼠标星星.gif](/images/jueJin/c8c1e1bd6fba449.png)

### 5\. 鼠标点击生成五个小星星

思路就是，鼠标点击，生成5个小星星，并加到`数组stars`中

```js
    window.onclick = function (e) {
        for (let i = 0; i < 5; i++) {
        stars.push(new Star(e.clientX, e.clientY, 3))
    }
}
```

效果如下：

![点击生成星星.gif](/images/jueJin/fbfd32bdb2a84f7.png)

最终效果： ![星星连线.gif](/images/jueJin/9887034ec4e6410.png)

### 6\. 全部代码

```js
const canvas = document.getElementById('canvas')

const ctx = canvas.getContext('2d')

// 获取当前视图的宽度和高度
let aw = document.documentElement.clientWidth || document.body.clientWidth
let ah = document.documentElement.clientHeight || document.body.clientHeight
// 赋值给canvas
canvas.width = aw
canvas.height = ah

// 屏幕变动时也要监听实时宽高
    window.onresize = function () {
    aw = document.documentElement.clientWidth || document.body.clientWidth
    ah = document.documentElement.clientHeight || document.body.clientHeight
    // 赋值给canvas
    canvas.width = aw
    canvas.height = ah
}

// 本游戏无论是实心，还是线条，色调都是白色
ctx.fillStyle = 'white'
ctx.strokeStyle = 'white'

    function Star(x, y, r) {
    // x，y是坐标，r是半径
    this.x = x
    this.y = y
    this.r = r
    // speed参数，在  -3 ~ 3 之间取值
    this.speedX = (Math.random() * 3) * Math.pow(-1, Math.round(Math.random()))
    this.speedY = (Math.random() * 3) * Math.pow(-1, Math.round(Math.random()))
}

    Star.prototype.draw = function () {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
}

    Star.prototype.move = function () {
    this.x -= this.speedX
    this.y -= this.speedY
    // 碰到边界时，反弹，只需要把speed取反就行
    if (this.x < 0 || this.x > aw) this.speedX *= -1
    if (this.y < 0 || this.y > ah) this.speedY *= -1
}

    function drawLine(startX, startY, endX, endY) {
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.stroke()
    ctx.closePath()
}

const stars = []
    for (let i = 0; i < 100; i++) {
    // 随机在canvas范围内找一个坐标画星星
    stars.push(new Star(Math.random() * aw, Math.random() * ah, 3))
}

const mouseStar = new Star(0, 0, 3)

    canvas.onmousemove = function (e) {
    mouseStar.x = e.clientX
    mouseStar.y = e.clientY
}
    window.onclick = function (e) {
        for (let i = 0; i < 5; i++) {
        stars.push(new Star(e.clientX, e.clientY, 3))
    }
}

// 星星的移动
    setInterval(() => {
    ctx.clearRect(0, 0, aw, ah)
    // 鼠标星星渲染
    mouseStar.draw()
    // 遍历移动渲染
        stars.forEach(star => {
        star.move()
        star.draw()
        })
            stars.forEach((star, index) => {
            // 类似于冒泡排序那样，去比较，确保所有星星两两之间都比较到
                for (let i = index + 1; i < stars.length; i++) {
                    if (Math.abs(star.x - stars[i].x) < 50 && Math.abs(star.y - stars[i].y) < 50) {
                    drawLine(star.x, star.y, stars[i].x, stars[i].y)
                }
            }
            
                if (Math.abs(mouseStar.x - star.x) < 50 && Math.abs(mouseStar.y - star.y) < 50) {
                drawLine(mouseStar.x, mouseStar.y, star.x, star.y)
            }
            })
            }, 50)
```

3\. 五子棋
-------

看看将实现的效果：

![截屏2021-07-25 下午12.21.39.png](/images/jueJin/b9e5dafca2064e4.png) 五子棋分为以下步骤：

*   1、画出棋盘
*   2、黑白棋切换着下，`不能覆盖已下的坑位`
*   3、判断是否`五连子`，是的话就赢了
*   4、彩蛋：跟`AI下棋`（实现单人玩游戏）

### 1\. 画出棋盘

其实很简单，利用`ctx.moveTo和ctx.lineTo`，横着画15条线，竖着画15条线，就OK了。

```js
// html
    #canvas {
    background: #e3cdb0;
}
<canvas id="canvas" width="600" height="600"></canvas>


// js
play()

    function play() {
    const canvas = document.getElementById('canvas')
    
    const ctx = canvas.getContext('2d')
    
    // 绘制棋盘
    
    // 水平，总共15条线
        for (let i = 0; i < 15; i++) {
        ctx.beginPath()
        ctx.moveTo(20, 20 + i * 40)
        ctx.lineTo(580, 20 + i * 40)
        ctx.stroke()
        ctx.closePath()
    }
    
    // 垂直，总共15条线
        for (let i = 0; i < 15; i++) {
        ctx.beginPath()
        ctx.moveTo(20 + i * 40, 20)
        ctx.lineTo(20 + i * 40, 580)
        ctx.stroke()
        ctx.closePath()
    }
}
```

这样就画出了棋盘：

![截屏2021-07-25 下午12.25.09.png](/images/jueJin/269ed72ba34f474.png)

### 2\. 黑白棋切换着下

*   1、鼠标点击事件，获取坐标，将棋画出来（`ctx.arc`）
*   2、确保已下的棋位不能重复下

第一步，获取鼠标坐标，但是我们要注意一件事，棋子只能下在线的`交叉处`，所以拿到鼠标坐标后，要做一下处理，四舍五入，以`最近`的一个`线交叉点`为圆的`圆心`

第二步，如何确保棋位不重复下呢？咱们可以使用一个`二维数组`来记录，初始是0，下过黑棋就变为1，下过白棋就变为2，但是这里要注意一点，`数组索引的x，y跟画布坐标的x，y是相反的`，所以后面代码里坐标反过来，希望大家能思考一下为啥。

![截屏2021-07-25 下午12.33.29.png](/images/jueJin/46fcf06e840141e.png)

```js
// 是否下黑棋
// 黑棋先走
let isBlack = true


// 棋盘二维数组
let cheeks = []

    for (let i = 0; i < 15; i++) {
    cheeks[i] = new Array(15).fill(0)
}

    canvas.onclick = function (e) {
    const clientX = e.clientX
    const clientY = e.clientY
    // 对40进行取整，确保棋子落在交叉处
    const x = Math.round((clientX - 20) / 40) * 40 + 20
    const y = Math.round((clientY - 20) / 40) * 40 + 20
    // cheeks二维数组的索引
    // 这么写有点冗余，这么写你们好理解一点
    const cheeksX = (x - 20) / 40
    const cheeksY = (y - 20) / 40
    // 对应元素不为0说明此地方已有棋，返回
    if (cheeks[cheeksY][cheeksX]) return
    // 黑棋为1，白棋为2
    cheeks[cheeksY][cheeksX] = isBlack ? 1 : 2
    ctx.beginPath()
    // 画圆
    ctx.arc(x, y, 20, 0, 2 * Math.PI)
    // 判断走黑还是白
    ctx.fillStyle = isBlack ? 'black' : 'white'
    ctx.fill()
    ctx.closePath()
    // 切换黑白
    isBlack = !isBlack
}
```

![下棋.gif](/images/jueJin/aa99f1659e7946c.png) 效果如下：

### 3\. 判断是否五连子

如何判断呢？有四种情况：`上下五连子，左右吴连子，左上右下五连子，右上左下五连子`，只要咱们每次落子的时候全部判断一次就好了。

![截屏2021-07-25 下午12.55.53.png](/images/jueJin/54f1f02a38b54ec.png)

顺便附上所有代码

```js
play()

    function play() {
    const canvas = document.getElementById('canvas')
    
    const ctx = canvas.getContext('2d')
    
    // 绘制棋盘
    
    // 水平，总共15条线
        for (let i = 0; i < 15; i++) {
        ctx.beginPath()
        ctx.moveTo(20, 20 + i * 40)
        ctx.lineTo(580, 20 + i * 40)
        ctx.stroke()
        ctx.closePath()
    }
    
    // 垂直，总共15条线
        for (let i = 0; i < 15; i++) {
        ctx.beginPath()
        ctx.moveTo(20 + i * 40, 20)
        ctx.lineTo(20 + i * 40, 580)
        ctx.stroke()
        ctx.closePath()
    }
    
    // 是否下黑棋
    // 黑棋先走
    let isBlack = true
    
    
    // 棋盘二维数组
let cheeks = []

    for (let i = 0; i < 15; i++) {
    cheeks[i] = new Array(15).fill(0)
}

    canvas.onclick = function (e) {
    const clientX = e.clientX
    const clientY = e.clientY
    // 对40进行取整，确保棋子落在交叉处
    const x = Math.round((clientX - 20) / 40) * 40 + 20
    const y = Math.round((clientY - 20) / 40) * 40 + 20
    // cheeks二维数组的索引
    // 这么写有点冗余，这么写你们好理解一点
    const cheeksX = (x - 20) / 40
    const cheeksY = (y - 20) / 40
    // 对应元素不为0说明此地方已有棋，返回
    if (cheeks[cheeksY][cheeksX]) return
    // 黑棋为1，白棋为2
    cheeks[cheeksY][cheeksX] = isBlack ? 1 : 2
    ctx.beginPath()
    // 画圆
    ctx.arc(x, y, 20, 0, 2 * Math.PI)
    // 判断走黑还是白
    ctx.fillStyle = isBlack ? 'black' : 'white'
    ctx.fill()
    ctx.closePath()
    
    // canvas画图是异步的，保证画出来再去检测输赢
        setTimeout(() => {
            if (isWin(cheeksX, cheeksY)) {
            const con = confirm(`${isBlack ? '黑棋' : '白棋'}赢了！是否重新开局？`)
            // 重新开局
            ctx.clearRect(0, 0, 600, 600)
            con && play()
        }
        // 切换黑白
        isBlack = !isBlack
        }, 0)
    }
    // 判断是否五连子
        function isWin(x, y) {
        const flag = isBlack ? 1 : 2
        // 上和下
            if (up_down(x, y, flag)) {
            return true
        }
        
        // 左和右
            if (left_right(x, y, flag)) {
            return true
        }
        // 左上和右下
            if (lu_rd(x, y, flag)) {
            return true
        }
        
        // 右上和左下
            if (ru_ld(x, y, flag)) {
            return true
        }
        
        return false
    }
    
        function up_down(x, y, flag) {
        let num = 1
        // 向上找
            for (let i = 1; i < 5; i++) {
            let tempY = y - i
            console.log(x, tempY)
            if (tempY < 0 || cheeks[tempY][x] !== flag) break
            if (cheeks[tempY][x] === flag) num += 1
        }
        // 向下找
            for (let i = 1; i < 5; i++) {
            let tempY = y + i
            console.log(x, tempY)
            if (tempY > 14 || cheeks[tempY][x] !== flag) break
            if (cheeks[tempY][x] === flag) num += 1
        }
        return num >= 5
    }
    
        function left_right(x, y, flag) {
        let num = 1
        // 向左找
            for (let i = 1; i < 5; i++) {
            let tempX = x - i
            if (tempX < 0 || cheeks[y][tempX] !== flag) break
            if (cheeks[y][tempX] === flag) num += 1
        }
        // 向右找
            for (let i = 1; i < 5; i++) {
            let tempX = x + i
            if (tempX > 14 || cheeks[y][tempX] !== flag) break
            if (cheeks[y][tempX] === flag) num += 1
        }
        return num >= 5
        
    }
    
        function lu_rd(x, y, flag) {
        let num = 1
        // 向左上找
            for (let i = 1; i < 5; i++) {
            let tempX = x - i
            let tempY = y - i
            if (tempX < 0 || tempY < 0 || cheeks[tempY][tempX] !== flag) break
            if (cheeks[tempY][tempX] === flag) num += 1
        }
        // 向右下找
            for (let i = 1; i < 5; i++) {
            let tempX = x + i
            let tempY = y + i
            if (tempX > 14 || tempY > 14 || cheeks[tempY][tempX] !== flag) break
            if (cheeks[tempY][tempX] === flag) num += 1
        }
        
        return num >= 5
    }
    
        function ru_ld(x, y, flag) {
        let num = 1
        // 向右上找
            for (let i = 1; i < 5; i++) {
            let tempX = x - i
            let tempY = y + i
            if (tempX < 0 || tempY > 14 || cheeks[tempY][tempX] !== flag) break
            if (cheeks[tempY][tempX] === flag) num += 1
        }
        // 向左下找
            for (let i = 1; i < 5; i++) {
            let tempX = x + i
            let tempY = y - i
            if (tempX > 14 || tempY < 0 || cheeks[tempY][tempX] !== flag) break
            if (cheeks[tempY][tempX] === flag) num += 1
        }
        
        return num >= 5
    }
    
}

```

### 4\. 彩蛋：与AI下棋

其实很简单，每次下完棋，设置一个函数：随机找位置下棋。这样就实现了和电脑下棋，单人游戏的功能了，这个功能我已经实现，但是我就不写出来了，交给大家吧，当做是大家巩固这篇文章的作业。哈哈哈哈

结语
--

睡了睡了，这篇文章连续写了我7个小时，其实这三个小游戏还有很多可以优化的地方，大家可以提出来，互相学习。喜欢的兄弟姐妹点点赞哈，谢谢大家！！

> 如果你觉得此文对你有一丁点帮助，点个赞，鼓励一下林三心哈哈。或者加入我的群哈哈，咱们一起摸鱼一起学习 : meron857287645