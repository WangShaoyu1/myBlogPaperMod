---
author: "yck"
title: "UIStackView 看我就够了"
date: 2016-07-25
description: "UIStackView 的使用
UIStackView 是 iOS9新增的一个布局技术。熟练掌握相当节省布局时间。UIStackView 是 UIView 的子类，是用来约束子控件的一个控件。但他的作用仅限于此，他不能用来呈现自身的内容，类似于 backgroundColor。当然了，这个控件相当易学，属性只有4个。
"
tags: ["iOS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读3分钟"
weight: 1
selfDefined:"likes:19,comments:0,collects:3,views:5355,"
---
UIStackView 是 iOS9新增的一个布局技术。熟练掌握相当节省布局时间。  
UIStackView 是 UIView 的子类，是用来约束子控件的一个控件。但他的作用仅限于此，他不能用来呈现自身的内容，类似于 `backgroundColor`。当然了，这个控件相当易学，属性只有4个。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)  

屏幕快照 2016-07-20 16.52.41

*   Axls: 子控件的布局方向，水平或者垂直
*   Alignment: 类似于 UILabel 的 Alignment 属性
*   Distributlon: 子控件的大小
*   Spacing: 子控件间的间距

可以看到在属性左边有个加号，点开来是这样的：  

![](/images/jueJin/46af512827761ed.png)  

屏幕快照 2016-07-20 16.57.50

这其实是 UIStackView 也集成了 Size Class，Size Class 是用来布局不同尺寸屏幕的。在这里可以通过选择不同的尺寸来更新子控件约束。

使用
--

接下来我们在 IB 中使用 UIStackView 来完成以下布局：

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)  

屏幕快照 2016-07-20 17.23.53

首先上面的 ImageView 是直接做约束完成的。  
然后我们可以选择左下角的三个 Label,然后点击右下角第一个图标合成 UIStackView:  

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)  

屏幕快照 2016-07-20 17.26.30

因为三个 Label 间是有间距的，所以接下来我们修改 Spacing 属性：  

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)  

屏幕快照 2016-07-20 17.29.29

这样就很方便的做好了 UIStackView 内部子视图的布局，然后只需要给 UIStackView 设置离左边和下边的约束即可，因为这个 UIStackView 内部的子视图都是 UILabel, UILabel 都是有他自身的固有大小的，所以不需要设置4个布局。

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)  

屏幕快照 2016-07-20 17.31.28

这样我们就完成了左边三个 Lable 的布局。接下来我们来布局右边的2个控件。

还是和刚才一样，选择 Image 和 label，并且组成一个 UIStackView 并设置好 UIStackView 的布局约束：  

![](/images/jueJin/9537534194bb6a5.png)  

屏幕快照 2016-07-20 17.33.03

接下来布局内部子控件约束：  

![](/images/jueJin/543fa64982282e0.png)  

屏幕快照 2016-07-20 17.33.34

做好这两步你会发现 IB 还是报错，这是因为 UIStackView 并不知道他内部的 image 的宽高，这时候我们可以让 image 有他的固有大小：  

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)  

屏幕快照 2016-07-20 17.35.10

将 intrinsic Size 的属性改为 Placeholder，这时候就解决了报错，至此，整个 View 的约束已经做完，是不是发现比之前全部用 Auto Layout 快多了。

当然了 UIStackView 也是可以用代码创建的。

 代码解读

复制代码

`class UIStackView : UIView { init(arrangedSubviews views: [UIView])  var arrangedSubviews: [UIView] { get } func addArrangedSubview(view: UIView)  func removeArrangedSubview(view: UIView)  func insertArrangedSubview(view: UIView, atIndex stackIndex: Int) ...  }`

第一个方法是用来创建一个 UIStackView 的，传入 views 里的数组的顺序代表了 UIStackView 里子视图的顺序。  
第二个方法是用来获得 UIStackView 里有哪些子视图的。

后面3个方法和 UIView 里的方法是类似的。  
看到 `addArrangedSubview` 和 `removeArrangedSubview` 你是不是想到了`addSubView` 和`removfromSuperView`。

下面有张表，可以区别这四个方法：  

![](https://t11.baidu.com/it/u=1683902884,1968350863&fm=58)  

屏幕快照 2016-07-20 17.44.56

从表中可以看出，添加 UIStackView 的子视图应该用 `addArrangedSubview`，移除 UIStackView 某个子视图应该用 `removeArrangedSubview`。

UIStackView 用来约束子视图的属性有以下几个

 代码解读

复制代码

`var axis: UILayoutConstraintAxis  var distribution: UIStackViewDistribution  var alignment: UIStackViewAlignment  var spacing: CGFloat  var baselineRelativeArrangement: Bool  var layoutMarginsRelativeArrangement: Bool`

这些就是使用代码来创建 UIStackView 了。

UIStackView 还是蛮简单的，但是功能却十分强大。这篇文章应该能让大家了解 UIStackView 的基本使用了。