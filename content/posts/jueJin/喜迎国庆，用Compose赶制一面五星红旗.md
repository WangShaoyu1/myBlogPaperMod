---
author: "稀有猿诉"
title: "喜迎国庆，用Compose赶制一面五星红旗"
date: 2024-09-30
description: "普天同庆的国庆长假到了，让我们用学过的JetpackCompose知识来画一个迎风飘扬的五星红旗吧！"
tags: ["Android","AndroidJetpack","Kotlin"]
ShowReadingTime: "阅读9分钟"
weight: 898
---
我们学习Jetpack Compose已经有一段时间了，通过前面的学习已能掌握足够的技巧以在实战中应用。恰逢普天庆国庆，利用我们学过的知识，使用Jetpack Compose来画一个迎风飘扬的五星红旗吧！废话不多说，先来看一眼效果图。

![图1. 效果图展示转存失败，建议直接上传图片文件](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/5e9824765d404781980b6dedd9ef9e84~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iA5pyJ54y_6K-J:q75.awebp?rk3s=f64ab15b&x-expires=1728259320&x-signature=2BKZg9ycX5g5Z9JkwVh81N3GNt4%3D)

### 五星红旗的设计标准

需要特别注意，五星红旗有明确的设计标准的，在[国旗法中有明确的制法说明](https://link.juejin.cn?target=https%3A%2F%2Fwww.gov.cn%2Fxinwen%2F2020-12%2F24%2Fcontent_5572913.htm "https://www.gov.cn/xinwen/2020-12/24/content_5572913.htm")。

总结一下要点：宽与高之比为3比2，五颗星都在左上四分之一小矩形内，最大星直径约为高的十分之一，四个小五解星的一个角要指向大五角星的中心。

### 如何画五角星

五星红旗并不是特别复杂，拆解一下，其组成图案就是矩形和五角星了，矩形是基本的图形可以直接画。需要研究一下五角星怎么画。

画对称多边形的方法都要借助圆，因为几何图形最容易画的同时也是最标准的就是圆了，再借助角度从圆上取点，把点连成线就是多边形。多边形的顶角度数不一样，因此把圆分成多少份，就能画出不同的多边形了。

五角星也要借助圆，把五角星五个顶点连线就是一个正五边形了，所以在圆上取5个等分点，也即每隔72度取一个点，然后把这5个点每隔一点连成线，就是五角星了。如下图所示：

![图3. 五角星画法](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/fe47d87f74254c89b9d37b1cf3719ecb~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iA5pyJ54y_6K-J:q75.awebp?rk3s=f64ab15b&x-expires=1728259320&x-signature=fUwSkb0rR2dChqv8%2FUO9%2FOqliDk%3D)

这种画法对手工尺规作图很友好，对程序来说，就没那么友好了。程序化的API需要明确的坐标点，把点串连成路径（Path）。这里需要的五角星是填充的，所以如果能知道5个顶点，和凹进来的五个点，只要把这10个点串起来，就能组成一个闭合的图形，得到我们想要五角星了。

五角星的外面五个点和内部五个点能组成两个正五边形，这两个正五边形的外接圆是两个同心圆，外顶点与内顶点刚好相差36度，正五边形的顶点之间是72度。所以，我们通过画两个半径不同的同心圆，每个圆分成5份，大圆的点与小圆的点交错开，就能画出一个五角星了。圆心和半径是关键的参数，通过圆心与半径，就能精细调整五角星的形状。

![图4. 填充式五角星](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/a0d8f388d81545baa3364c06bd7b6c3b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iA5pyJ54y_6K-J:q75.awebp?rk3s=f64ab15b&x-expires=1728259320&x-signature=h0AluQWDLmBaB3g1HwjXMBs5M6M%3D)

因为五角星是填充色，所以我们把最外层的五个点与内层的五个点连串一起组成一个闭合的图形。通过前面的[降Compose十八掌之『利涉大川』| Canvas](https://juejin.cn/post/7381826917086920742 "https://juejin.cn/post/7381826917086920742")学习，我们知道可以用路径（Path）来画图形，一共10个点把圆分成10分，所以角度是36度，半径是一大一小交错开来：

Kotlin

 代码解读

复制代码

   `val path = Path().apply {         val pointNumber = 5         val angle = PI.toFloat() / pointNumber         val innerRadius = radius * cos(angle) / 2f         for (i in pointNumber * 2 downTo 0) {             val r = if (i % 2 == 1) radius else innerRadius             val omega = angle * i             val x = center.x + r * sin(omega)             val y = center.y + r * cos(omega)             lineTo(x, y)         }     }     drawPath(         path = path,         color = color,         style = Fill     )`

### 画五星红旗

根据制法以及画五角星的方法，我们总结一下设计要点：

1.  用一个高height作为主要参数，那么宽就是其1.5倍，其他的参数都与height有关系，所以改变height就可以完全控制整个旗子的大小；
2.  大五星圆心x是宽的1/6，y是height的1/4，可以看出比例是一致的，所以可以先计算y，再乘1.5就是x；
3.  大五星的外接圆直径约是height的3/10，半径就是高度的3/20，这样大五星就完全确定了；
4.  小五星的直径是高的1/10，半径就是1/20；从上到下命名为a，b，c，d；
5.  小五星a的圆心x在宽的1/3，y在高的1/10
6.  小五星b的圆心x在宽的2/5，y在高的1/5
7.  小五星c的圆心x在宽的2/5，y在高的7/20
8.  小五星d的圆心x在宽的1/3，y在高的9/20
9.  小五星的角要对着大五星的圆心，也就是要把小五星旋转一下。一个办法对Path做变幻，但其实不用那么复杂。我们在画五角星时，选择点时加上一个偏移角度beta就可以了，这样尖角就有旋转角度了。这个旋转角度可以用小五星的圆心与alpha的圆心来求得，就是这两个圆心连线与水平x轴的夹角，用反正切atan来求。

综上，就可以写代码啦：

Kotlin

 代码解读

复制代码

`@Composable fun FiveStarsRedFlag(height: Dp = 200.dp) {     val stickWidth = 10.dp     val flagWidth = height.times(1.5f)     val flagHeight = height     val canvasWidth = flagWidth.plus(stickWidth)     val canvasHeight = height.times(2f)     Canvas(modifier = Modifier.size(canvasWidth, canvasHeight)) {         // The background         drawRect(color = Color.Red, size = Size(flagWidth.toPx(), flagHeight.toPx()))         // The stick         drawRect(color = Color.LightGray, size = Size(stickWidth.toPx(), canvasHeight.toPx()))         val centerY = flagHeight.toPx() / 4f         val centerX = flagWidth.toPx() / 6f         val radius = flagHeight.toPx() * 3f / 20f         val smallRadius = flagHeight.toPx() / 20f         val alphaCenter = Offset(centerX, centerY)         // 大五角星 alpha         drawStar(             alphaCenter = alphaCenter,             center = alphaCenter,             radius = radius,             color = Color.Yellow         )         // 小五星 a         drawStar(             alphaCenter = alphaCenter,             center = Offset(flagWidth.toPx() / 3f, flagHeight.toPx() / 10f),             radius = smallRadius,             color = Color.Yellow         )         // 小五星 b         drawStar(             alphaCenter = alphaCenter,             center = Offset(flagWidth.toPx() * 0.4f, flagHeight.toPx() / 5f),             radius = smallRadius,             color = Color.Yellow         )         // 小五星 c         drawStar(             alphaCenter = alphaCenter,             center = Offset(flagWidth.toPx() * 0.4f, flagHeight.toPx() * 7 / 20f),             radius = smallRadius,             color = Color.Yellow         )         // 小五星 d         drawStar(             alphaCenter = alphaCenter,             center = Offset(flagWidth.toPx() / 3f, flagHeight.toPx() * 9 / 20f),             radius = smallRadius,             color = Color.Yellow         )    } } fun DrawScope.drawStar(alphaCenter: Offset, center: Offset, radius: Float, color: Color) {     val pointNumber = 5     val angle = PI.toFloat() / pointNumber     val innerRadius = radius * cos(angle) / 2f     val beta = if (alphaCenter == center) {         0f     } else {         PI.toFloat() / 2f - atan((center.y - alphaCenter.y) / (center.x - alphaCenter.x))     }     val path = Path().apply {         for (i in 0 .. pointNumber * 2) {             val r = if (i % 2 == 1) radius else innerRadius             val omega = angle * i + beta             val x = center.x + r * sin(omega)             val y = center.y + r * cos(omega)             lineTo(x, y)         }         close()     }     drawPath(         path = path,         color = color,         style = Fill     ) }`

为了检查画图结果是否符合设计，我们可以画出制法中的那样的格子：

Kotlin

 代码解读

复制代码

        `if (DEBUG) {             val strokeWidth = 0.8.dp.toPx()             // Slice             drawLine(                 Color.Black,                 Offset(stickWidth.toPx(), flagHeight.toPx() / 2f),                 Offset(flagWidth.toPx(), flagHeight.toPx() / 2f),                 strokeWidth = strokeWidth * 2f             )             drawLine(                 Color.Black,                 Offset(flagWidth.toPx() / 2f, 0f),                 Offset(flagWidth.toPx() / 2f, flagHeight.toPx()),                 strokeWidth = strokeWidth * 2f             )             // Grid             for (i in 1 until 10) {                 drawLine(                     Color.Black,                     Offset(stickWidth.toPx(), flagHeight.toPx() * i / 20f),                     Offset(flagWidth.toPx() / 2f, flagHeight.toPx() * i / 20f),                     strokeWidth = strokeWidth                 )             }             for (i in 1 until 14) {                 drawLine(                     Color.Black,                     Offset(stickWidth.toPx() + flagWidth.toPx() * i / 30f, 0f),                     Offset(stickWidth.toPx() + flagWidth.toPx() * i / 30f, flagHeight.toPx() / 2f),                     strokeWidth = strokeWidth                 )             }        }`

拿带格子的效果图，与制法设计图对比，可以发现一模一样，完全符合设计。

![图5. 带格子的效果图转存失败，建议直接上传图片文件](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f91cd4cdb0054384b22fe9106af3a77e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56iA5pyJ54y_6K-J:q75.awebp?rk3s=f64ab15b&x-expires=1728259320&x-signature=AR56aIGkPZbnHetYjP9zg0fvzLM%3D)

好了，到这里，我们的五星红旗就画完了。未完，别走啊，我们还要让旗子飘扬起来。

### 让五星红旗飘扬起来

旗子飘扬的真实形态是三维的曲面，比如用三角函数曲面计算每一个坐标点x, y, z，就像[这篇文章](https://juejin.cn/post/7206950454098247736 "https://juejin.cn/post/7206950454098247736")中的做法那样。

但在Compose中无法实现，因为Compose，虽然也可以做三维的变幻，但都是针对整个图层的，没有办法针对图形中的每个坐标点去单独做变幻，这也是与三维图形库如OpenGL ES的最大区别。

在Compose中要想每个坐标点都不一样，只能绘制曲线，曲线 的点再由动画动态的去改变，这样就会有类似波动一样的效果，但都局限在二维。为此，我们需要用Path来画背景，上边和下边都用曲线，曲线的点用动画来不断的波动，这样就能有点波动的感觉了：

Kotlin

 代码解读

复制代码

    `val infiniteTransition = rememberInfiniteTransition(label = "infinite transition")     val amplitude = with(LocalDensity.current) { height.div(8f).toPx() }     val heightPx = with(LocalDensity.current) { height.toPx() }     val waveDuration = 2000     val ya by infiniteTransition.animateFloat(         initialValue = amplitude / 2f,         targetValue = -amplitude / 2f,         animationSpec = infiniteRepeatable(tween(waveDuration), RepeatMode.Reverse),         label = "ya"     )     val yb by infiniteTransition.animateFloat(         initialValue = -amplitude / 2f,         targetValue = amplitude / 2f,         animationSpec = infiniteRepeatable(tween(waveDuration), RepeatMode.Reverse),         label = "yb"     )     val yc by infiniteTransition.animateFloat(         initialValue = amplitude / 2f,         targetValue = -amplitude / 2f,         animationSpec = infiniteRepeatable(tween(waveDuration), RepeatMode.Reverse),         label = "yc"     )     val ye by infiniteTransition.animateFloat(         initialValue = heightPx + amplitude / 2f,         targetValue = heightPx - amplitude / 2f,         animationSpec = infiniteRepeatable(tween(waveDuration), RepeatMode.Reverse),         label = "ye"     )     val yf by infiniteTransition.animateFloat(         initialValue = heightPx - amplitude / 2f,         targetValue = heightPx + amplitude / 2f,         animationSpec = infiniteRepeatable(tween(waveDuration), RepeatMode.Reverse),         label = "yf"     )     val yg by infiniteTransition.animateFloat(         initialValue = heightPx + amplitude / 2f,         targetValue = heightPx - amplitude / 2f,         animationSpec = infiniteRepeatable(tween(waveDuration), RepeatMode.Reverse),         label = "yg"     )          Canvas(         modifier = Modifier.size(canvasWidth, height)     ) {         val stickOffset = Offset(stickWidth.toPx(), 0f)         // The background         val pathBG = Path().apply {             moveTo(0f, 0f)             cubicTo(flagWidth.toPx() / 3f, ya, flagWidth.toPx() * 2f / 3f, yb, flagWidth.toPx(), yc)             lineTo(flagWidth.toPx(), ye)             cubicTo(flagWidth.toPx() * 2f / 3f, yf, flagWidth.toPx() / 3f, yg, 0f, size.height)             lineTo(0f, 0f)             translate(stickOffset)         }         drawPath(path = pathBG, color = Color.Red, style = Fill)    }`

也可以用GraphicsLayer，再添加一点点Y轴和Z轴的旋转，就更像那么回事了：

Kotlin

 代码解读

复制代码

`val rotateY by infiniteTransition.animateFloat(         initialValue = -3f,         targetValue = 6f,         animationSpec = infiniteRepeatable(tween(3000), RepeatMode.Reverse),         label = "rotateY"     ) Canvas(         modifier = Modifier             .size(canvasWidth, height)             .graphicsLayer {                 transformOrigin = TransformOrigin(0f, 0f)                 rotationZ = 2f                 rotationY = rotateY             }     ) { ... }`

至此，我们的五星红旗就算做完了，当然了可对背景的左边和右边也加上波动，就会更像一些了，完整代码可以[看这里](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Falexhilton%2FEffectiveCompose%2Fblob%2Fmain%2Fapp%2Fsrc%2Fmain%2Fjava%2Fnet%2Ftoughcoder%2Feffectivecompose%2FWavingFlag.kt "https://github.com/alexhilton/EffectiveCompose/blob/main/app/src/main/java/net/toughcoder/effectivecompose/WavingFlag.kt")。

让我们小结一下，看似简单的一个五星红旗，实现起来其实并不容易，用到了好多数学知识，书到用时方恨少，数学真的太重要了，无处不在。UI开发会涉及大量的数学（特别是几何）知识，要想做好UI必须 要有良好的数学功底，难度并不小。

### 仅供娱乐，请勿参考

以上的实现方式其实仅供娱乐，在真实的项目中不建议这样一笔一笔的用Canvas来画。建议的实现方式应该是找一个（或者让设计师提供）现成的五星红旗图形资源，然后当成图片来展示 出来。

这样做的好处是把设计与代码实现分离开来，当需要调整设计效果时，不必去修改代码，毕竟替换一个资源比起修改代码的风险要小很多，虽然说可能也只是调整一个整数（颜色），但毕竟是改代码了，风险还是有的。再者，分离开来能让设计工作由更为专业的人士来做，而不必受到（或者考虑）代码实现的限制。还有就是，用代码一笔一笔的画，无论研发效率还是运行效率其实都不高，远不如显示一张图片性能好。

### 最后

祝愿伟大的祖国繁荣昌盛，国泰民安！祝愿所有的朋友国庆快乐，天天开心！

### References

*   [Five-pointed star using CSS](https://link.juejin.cn?target=https%3A%2F%2Fcodepen.io%2Fjonkemp%2Fpen%2FEVgaLR "https://codepen.io/jonkemp/pen/EVgaLR")
*   [Algorithm for drawing a 5 point star](https://link.juejin.cn?target=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F14580033%2Falgorithm-for-drawing-a-5-point-star "https://stackoverflow.com/questions/14580033/algorithm-for-drawing-a-5-point-star")
*   [How to Draw a 5-point Star](https://link.juejin.cn?target=https%3A%2F%2Fwww.instructables.com%2FHow-to-draw-a-5-point-star%2F "https://www.instructables.com/How-to-draw-a-5-point-star/")
*   [Waving Flag animation with CSS](https://link.juejin.cn?target=https%3A%2F%2Fcodepen.io%2Fudit007%2Fpen%2FXWJooNQ "https://codepen.io/udit007/pen/XWJooNQ")
*   [CSS3 Waving Flags](https://link.juejin.cn?target=https%3A%2F%2Fcodepen.io%2Fchristopheschwyzer%2Fpen%2FnMoWBa "https://codepen.io/christopheschwyzer/pen/nMoWBa")

> 欢迎搜索并关注 _公众号[「稀有猿诉」](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fmp%2Fqrcode%3Fscene%3D10000004%26size%3D512%26__biz%3DMzU1MDg0NDczNA%3D%3D%26mid%3D2247484417%26idx%3D1%26sn%3D60c15f0d3c4be75e37748c2472a74102 "https://mp.weixin.qq.com/mp/qrcode?scene=10000004&size=512&__biz=MzU1MDg0NDczNA==&mid=2247484417&idx=1&sn=60c15f0d3c4be75e37748c2472a74102")_ 获取更多的优质文章！
> 
> 保护原创，请勿转载！