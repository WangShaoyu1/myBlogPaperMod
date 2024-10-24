---
author: "字节跳动技术团队"
title: "Android 系统 Bar 沉浸式完美兼容方案"
date: 2022-03-16
description: "自 Android 50 版本，Android 带来了沉浸式系统 bar，为简化系统 bar 沉浸式的使用，以及统一机型、版本差异所造成的效果差异，本文将介绍系统 bar 的组成以及沉浸式适配方案。"
tags: ["Android","交互设计中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:276,comments:38,collects:461,views:28372,"
---
引言
--

自 Android 5.0 版本，Android 带来了沉浸式系统 bar（状态栏和导航栏），Android 的视觉效果进一步提高，各大 app 厂商也在大多数场景上使用沉浸式效果。但由于 Android 碎片化比较严重，每个版本的系统 bar 效果可能会有所差异，导致开发者往往需要进行兼容适配。为了简化系统 bar 沉浸式的使用，以及统一机型、版本差异所造成的效果差异，本文将介绍系统 bar 的组成以及沉浸式适配方案。

背景
--

### 问题一：沉浸式下无法设置背景色

对于大于等于 Android 5.0 版本的系统，在 Activity 的 onCreate 时，通过给 window 设置属性：

```javascript
window.addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS)
window.addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION)
```

即可开启沉浸式系统 bar，效果如下：

![图片](/images/jueJin/0ec362e6fc58473.png)

Android 5.0 沉浸式状态栏

![图片](/images/jueJin/f880af31b2d74a3.png)

Android 5.0 沉浸式导航栏

但是设置沉浸式之后，原来通过 `window.statusBarColor` 和 `window.statusBarColor` 设置的颜色也不可用，也就是说不支持自定义半透明系统 bar 的颜色。

### 问题二：无法全透明导航栏

系统默认的状态栏和导航栏都有一个半透明的蒙层，虽然不支持设置颜色，但通过设置以下代码，可让状态栏变为全透明：

```ini
window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS)
window.decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
or View.SYSTEM_UI_FLAG_LAYOUT_STABLE)
window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS)
window.statusBarColor = Color.TRANSPARENT
```

效果如下：

![图片](/images/jueJin/8f58da54071f474.png)

Android 10.0 沉浸式全透明状态栏

通过类似的方式尝试将导航栏设置为全透明：

```ini
window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION)
window.decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
or View.SYSTEM_UI_FLAG_LAYOUT_STABLE or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION)
window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS)
window.navigationBarColor = Color.TRANSPARENT
```

但发现导航栏半透明背景依然无法去掉：

![图片](/images/jueJin/bf22bee193784cd.png)

### 问题三：亮色系统 bar 版本差异

对于大于等于 Android 6.0 版本的系统，如果背景是浅色的，可通过设置状态栏和导航栏文字颜色为深色，也就是导航栏和状态栏为浅色（只有 Android 8.0 及以上才支持导航栏文字颜色修改）：

```ini
window.decorView.systemUiVisibility =
View.SYSTEM_UI_FLAG_LAYOUT_STABLE or View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR

window.decorView.systemUiVisibility =
window.decorView.systemUiVisibility or if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR else 0
```

效果如下：

![图片](/images/jueJin/70e577e0839942d.png)

Android 8.0 亮色状态栏

![图片](/images/jueJin/ad9544fbfe954ac.png)

Android 8.0 亮色导航栏

但是在亮色系统 bar 基础上开启沉浸式后，在 8.0 至 9.0 系统中，导航栏深色导航 icon 不生效，而 10.0 以上版本能显示深色导航 icon：

![图片](/images/jueJin/ea2eac021a01444.png)

Android 8.0 亮色沉浸式亮色导航栏

![图片](/images/jueJin/215fb8e52ffa456.png)

Android 10.0 亮色沉浸式亮色导航栏

问题分析
----

### 问题一：沉浸式下无法设置背景色

查看源码发现设置状态栏和导航栏背景颜色时，是不能为沉浸式的：

![图片](/images/jueJin/aa19d11ba784410.png)

### 问题二：无法全透明导航栏

当设置导航栏为透明色（`Color.TRANSPARENT`）时，导航栏会变成半透明，当设置其他颜色，则是正常的，例如设置颜色为 0x700F7FFF，显示效果如下：

![图片](/images/jueJin/1dbc256ace8e49a.png)

Android 10.0 沉浸式导航栏

为什么会出现这个情况呢，通过调试进入源码，发现 activity 的 `onApplyThemeResource` 方法中有一个逻辑：

```ini
// Get the primary color and update the TaskDescription for this activity
TypedArray a = theme.obtainStyledAttributes(
com.android.internal.R.styleable.ActivityTaskDescription);
    if (mTaskDescription.getPrimaryColor() == 0) {
    int colorPrimary = a.getColor(
    com.android.internal.R.styleable.ActivityTaskDescription_colorPrimary, 0);
        if (colorPrimary != 0 && Color.alpha(colorPrimary) == 0xFF) {
        mTaskDescription.setPrimaryColor(colorPrimary);
    }
}
```

也就是说如果设置的导航栏颜色为 0（纯透明）时，将会为其修改为内置的颜色：`ActivityTaskDescription_colorPrimary`，因此就会出现灰色蒙层效果。

### 问题三：亮色系统 bar 版本差异

通过查看源码发现，与设置状态栏和导航栏背景颜色类似，设置导航栏 icon 颜色也是不能为沉浸式：

![图片](/images/jueJin/0bf1288173484a9.png)

解决沉浸式兼容性问题
----------

对于问题二无法全透明导航栏，由上述问题分析中的代码可以看出，当且仅当设置的导航栏颜色为纯透明时（0），才会置换为半透明的蒙层。那么，我们可以将纯透明这种情况修改颜色为 0x01000000，这样也能达到接近纯透明的效果：

![图片](/images/jueJin/73445096de38498.png)

对于问题一，难以通过常规方式进行沉浸式下的系统 bar 背景颜色设置。而对于问题三，通过常规方式需要分别对各个版本进行适配，对于国内手机来说，适配难度更大。

为了解决兼容性问题，以及更好的管理状态栏和导航栏，我们是否能自己实现状态栏和导航栏的背景 View 呢？

通过 Layout Inspector 可以看出，导航栏和状态栏本质上也是一个 view：

![图片](/images/jueJin/45979958c09f4ca.png)

在 activity 创建的时候，会创建两个 view（navigationBarBackground 和 statusBarBackground），将其加到 decorView 中，从而可以控制状态栏的颜色。那么，是否能把系统的这两个 view 隐藏起来，替换成自定义的 view 呢？

因此，为了提高兼容性，以及更好的管理状态栏和导航栏，我们可以将系统的 navigationBarBackground 和 statusBarBackground 隐藏起来，替换成自定义的 view，而不再通过 `FLAG_TRANSLUCENT_STATUS` 和 `FLAG_TRANSLUCENT_NAVIGATION` 来设置。

### 实现沉浸式状态栏

1.  添加自定义的状态栏。通过创建一个 view ，让其高度等于状态栏的高度，并将其添加到 decorView 中：

```ini
    View(window.context).apply {
    id = R.id.status_bar_view
    val params = FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, statusHeight)
    params.gravity = Gravity.TOP
    layoutParams = params
    (window.decorView as ViewGroup).addView(this)
}
```

2.  隐藏系统的状态栏。由于 activity 在 `onCreate` 时，并没有创建状态栏的 view（statusBarBackground），因此无法直接将其隐藏。这里可以通过对 decorView 添加 `OnHierarchyChangeListener` 监听来捕获到 statusBarBackground：

```kotlin
    (window.decorView as ViewGroup).setOnHierarchyChangeListener(object : ViewGroup.OnHierarchyChangeListener {
        override fun onChildViewAdded(parent: View?, child: View?) {
            if (child?.id == android.R.id.statusBarBackground) {
            child.scaleX = 0f
        }
    }
    
        override fun onChildViewRemoved(parent: View?, child: View?) {
    }
    })
```

注意：这里将 child 的 `scaleX` 设为 0 即可将其隐藏起来，那么为什么不能设置 `visibility` 为 `GONE` 呢？这是因为后续在应用主题时（`onApplyThemeResource`），系统会将 `visibility` 又重新设置为 `VISIBLE`。

隐藏之后，半透明的状态栏不显示，但是顶部会出现空白：

![图片](/images/jueJin/26a1b9990e774ca.png)

通过 Layout Inspector 发现，decorView 的第一个元素（内容 view ）会存在一个 padding：

![图片](/images/jueJin/c5831c99ac20423.png)

因此，可以通过设置 paddingTop 为 0 将其去除：

```scss
val view = (window.decorView as ViewGroup).getChildAt(0)
view.addOnLayoutChangeListener { v, _, _, _, _, _, _, _, _ ->
    if (view.paddingTop > 0) {
    view.setPadding(0, 0, 0, view.paddingBottom)
    val content = findViewById<View>(android.R.id.content)
    content.requestLayout()
}
}
```

注意：这里需要监听 view 的 layout 变化，否则只有一开始设置则后面又被修改了。

### 实现沉浸式导航栏

导航栏的自定义与状态栏类似，不过会存在一些差异。先创建一个自定义 view 将其添加到 decorView 中，然后把原来系统的 navigationBarBackground 隐藏：

```kotlin
    window.decorView.findViewById(R.id.navigation_bar_view) ?: View(window.context).apply {
    id = R.id.navigation_bar_view
    val resourceId = resources.getIdentifier( navigation_bar_height ,  dimen ,  android )
    val navigationBarHeight = if (resourceId > 0) resources.getDimensionPixelSize(resourceId) else 0
    val params = FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, navigationBarHeight)
    params.gravity = Gravity.BOTTOM
    layoutParams = params
    (window.decorView as ViewGroup).addView(this)
    
        (window.decorView as ViewGroup).setOnHierarchyChangeListener(object : ViewGroup.OnHierarchyChangeListener {
            override fun onChildViewAdded(parent: View?, child: View?) {
                if (child?.id == android.R.id.navigationBarBackground) {
                child.scaleX = 0f
                    } else if (child?.id == android.R.id.statusBarBackground) {
                    child.scaleX = 0f
                }
            }
            
                override fun onChildViewRemoved(parent: View?, child: View?) {
            }
            })
        }
```

注意：这里 `onChildViewAdded` 方法中，因为只能设置一次 `OnHierarchyChangeListener` ，需要同时考虑状态栏和导航栏。

通过这个方式，能将导航栏替换为自定义的 view ，但是存在一个问题，由于 navigationBarHeight 是固定的，如果用户切换了导航栏的样式，再回到 app 时，导航栏的高度不会重新调整。为了让导航栏看的清楚，设置其颜色为 0x7F00FF7F：

![图片](/images/jueJin/30eb2744ddcf409.png)

从图中可以看出，导航栏切换之后高度没有发生变化。为了解决这个问题，需要通过对 navigationBarBackground 设置 `OnLayoutChangeListener` 来监听导航栏高度的变化，并通过 liveData 关联到 view 中，代码实现如下：

```kotlin
val heightLiveData = MutableLiveData<Int>()
heightLiveData.value = 0
window.decorView.setTag(R.id.navigation_height_live_data, heightLiveData)

    val navigationBarView = window.decorView.findViewById(R.id.navigation_bar_view) ?: View(window.context).apply {
    id = R.id.navigation_bar_view
    val params = FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, heightLiveData.value ?: 0)
    params.gravity = Gravity.BOTTOM
    layoutParams = params
    (window.decorView as ViewGroup).addView(this)
    
        if (this@immersiveNavigationBar is FragmentActivity) {
            heightLiveData.observe(this@immersiveNavigationBar) {
            val lp = layoutParams
            lp.height = heightLiveData.value ?: 0
            layoutParams = lp
        }
    }
    
        (window.decorView as ViewGroup).setOnHierarchyChangeListener(object : ViewGroup.OnHierarchyChangeListener {
            override fun onChildViewAdded(parent: View?, child: View?) {
                if (child?.id == android.R.id.navigationBarBackground) {
                child.scaleX = 0f
                
                child.addOnLayoutChangeListener { _, _, top, _, bottom, _, _, _, _ ->
                heightLiveData.value = bottom - top
            }
                } else if (child?.id == android.R.id.statusBarBackground) {
                child.scaleX = 0f
            }
        }
        
            override fun onChildViewRemoved(parent: View?, child: View?) {
        }
        })
    }
```

通过上面方式，可以解决切换导航栏样式后自定义的导航栏高度问题：

![图片](/images/jueJin/04a4cf914faf42c.png)

### 完整代码

```kotlin
@file:Suppress("DEPRECATION")

package com.bytedance.heycan.systembar.activity

import android.app.Activity
import android.graphics.Color
import android.os.Build
import android.util.Size
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.widget.FrameLayout
import androidx.fragment.app.FragmentActivity
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.bytedance.heycan.systembar.R

/**
* Created by dengchunguo on 2021/4/25
*/
    fun Activity.setLightStatusBar(isLightingColor: Boolean) {
    val window = this.window
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (isLightingColor) {
            window.decorView.systemUiVisibility =
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE or View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
                } else {
                window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            }
        }
    }
    
        fun Activity.setLightNavigationBar(isLightingColor: Boolean) {
        val window = this.window
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && isLightingColor) {
            window.decorView.systemUiVisibility =
            window.decorView.systemUiVisibility or if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR else 0
        }
    }
    
    /**
    * 必须在Activity的onCreate时调用
    */
        fun Activity.immersiveStatusBar() {
        val view = (window.decorView as ViewGroup).getChildAt(0)
        view.addOnLayoutChangeListener { v, _, _, _, _, _, _, _, _ ->
        val lp = view.layoutParams as FrameLayout.LayoutParams
            if (lp.topMargin > 0) {
            lp.topMargin = 0
            v.layoutParams = lp
        }
            if (view.paddingTop > 0) {
            view.setPadding(0, 0, 0, view.paddingBottom)
            val content = findViewById<View>(android.R.id.content)
            content.requestLayout()
        }
    }
    
    val content = findViewById<View>(android.R.id.content)
    content.setPadding(0, 0, 0, content.paddingBottom)
    
        window.decorView.findViewById(R.id.status_bar_view) ?: View(window.context).apply {
        id = R.id.status_bar_view
        val params = FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, statusHeight)
        params.gravity = Gravity.TOP
        layoutParams = params
        (window.decorView as ViewGroup).addView(this)
        
            (window.decorView as ViewGroup).setOnHierarchyChangeListener(object : ViewGroup.OnHierarchyChangeListener {
                override fun onChildViewAdded(parent: View?, child: View?) {
                    if (child?.id == android.R.id.statusBarBackground) {
                    child.scaleX = 0f
                }
            }
            
                override fun onChildViewRemoved(parent: View?, child: View?) {
            }
            })
        }
        setStatusBarColor(Color.TRANSPARENT)
    }
    
    /**
    * 必须在Activity的onCreate时调用
    */
        fun Activity.immersiveNavigationBar(callback: (() -> Unit)? = null) {
        val view = (window.decorView as ViewGroup).getChildAt(0)
        view.addOnLayoutChangeListener { v, _, _, _, _, _, _, _, _ ->
        val lp = view.layoutParams as FrameLayout.LayoutParams
            if (lp.bottomMargin > 0) {
            lp.bottomMargin = 0
            v.layoutParams = lp
        }
            if (view.paddingBottom > 0) {
            view.setPadding(0, view.paddingTop, 0, 0)
            val content = findViewById<View>(android.R.id.content)
            content.requestLayout()
        }
    }
    
    val content = findViewById<View>(android.R.id.content)
    content.setPadding(0, content.paddingTop, 0, -1)
    
    val heightLiveData = MutableLiveData<Int>()
    heightLiveData.value = 0
    window.decorView.setTag(R.id.navigation_height_live_data, heightLiveData)
    callback?.invoke()
    
        window.decorView.findViewById(R.id.navigation_bar_view) ?: View(window.context).apply {
        id = R.id.navigation_bar_view
        val params = FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, heightLiveData.value ?: 0)
        params.gravity = Gravity.BOTTOM
        layoutParams = params
        (window.decorView as ViewGroup).addView(this)
        
            if (this@immersiveNavigationBar is FragmentActivity) {
                heightLiveData.observe(this@immersiveNavigationBar) {
                val lp = layoutParams
                lp.height = heightLiveData.value ?: 0
                layoutParams = lp
            }
        }
        
            (window.decorView as ViewGroup).setOnHierarchyChangeListener(object : ViewGroup.OnHierarchyChangeListener {
                override fun onChildViewAdded(parent: View?, child: View?) {
                    if (child?.id == android.R.id.navigationBarBackground) {
                    child.scaleX = 0f
                    bringToFront()
                    
                    child.addOnLayoutChangeListener { _, _, top, _, bottom, _, _, _, _ ->
                    heightLiveData.value = bottom - top
                }
                    } else if (child?.id == android.R.id.statusBarBackground) {
                    child.scaleX = 0f
                }
            }
            
                override fun onChildViewRemoved(parent: View?, child: View?) {
            }
            })
        }
        setNavigationBarColor(Color.TRANSPARENT)
    }
    
    /**
    * 当设置了immersiveStatusBar时，如需使用状态栏，可调佣该函数
    */
        fun Activity.fitStatusBar(fit: Boolean) {
        val content = findViewById<View>(android.R.id.content)
            if (fit) {
            content.setPadding(0, statusHeight, 0, content.paddingBottom)
                } else {
                content.setPadding(0, 0, 0, content.paddingBottom)
            }
        }
        
            fun Activity.fitNavigationBar(fit: Boolean) {
            val content = findViewById<View>(android.R.id.content)
                if (fit) {
                content.setPadding(0, content.paddingTop, 0, navigationBarHeightLiveData.value ?: 0)
                    } else {
                    content.setPadding(0, content.paddingTop, 0, -1)
                }
                    if (this is FragmentActivity) {
                        navigationBarHeightLiveData.observe(this) {
                            if (content.paddingBottom != -1) {
                            content.setPadding(0, content.paddingTop, 0, it)
                        }
                    }
                }
            }
            
            val Activity.isImmersiveNavigationBar: Boolean
            get() = window.attributes.flags and WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION != 0
            
            val Activity.statusHeight: Int
                get() {
                val resourceId =
                resources.getIdentifier("status_bar_height", "dimen", "android")
                    if (resourceId > 0) {
                    return resources.getDimensionPixelSize(resourceId)
                }
                return 0
            }
            
            val Activity.navigationHeight: Int
                get() {
                return navigationBarHeightLiveData.value ?: 0
            }
            
            val Activity.screenSize: Size
                get() {
                    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                    Size(windowManager.currentWindowMetrics.bounds.width(), windowManager.currentWindowMetrics.bounds.height())
                        } else {
                        Size(windowManager.defaultDisplay.width, windowManager.defaultDisplay.height)
                    }
                }
                
                    fun Activity.setStatusBarColor(color: Int) {
                    val statusBarView = window.decorView.findViewById<View?>(R.id.status_bar_view)
                        if (color == 0 && Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
                        statusBarView?.setBackgroundColor(STATUS_BAR_MASK_COLOR)
                            } else {
                            statusBarView?.setBackgroundColor(color)
                        }
                    }
                    
                        fun Activity.setNavigationBarColor(color: Int) {
                        val navigationBarView = window.decorView.findViewById<View?>(R.id.navigation_bar_view)
                            if (color == 0 && Build.VERSION.SDK_INT <= Build.VERSION_CODES.M) {
                            navigationBarView?.setBackgroundColor(STATUS_BAR_MASK_COLOR)
                                } else {
                                navigationBarView?.setBackgroundColor(color)
                            }
                        }
                        
                        @Suppress("UNCHECKED_CAST")
                        val Activity.navigationBarHeightLiveData: LiveData<Int>
                            get() {
                            var liveData = window.decorView.getTag(R.id.navigation_height_live_data) as? LiveData<Int>
                                if (liveData == null) {
                                liveData = MutableLiveData()
                                window.decorView.setTag(R.id.navigation_height_live_data, liveData)
                            }
                            return liveData
                        }
                        
                        val Activity.screenWidth: Int get() = screenSize.width
                        
                        val Activity.screenHeight: Int get() = screenSize.height
                        
                        private const val STATUS_BAR_MASK_COLOR = 0x7F000000
```

扩展
--

### 对话框适配

有时候需要通过 Dialog 来显示一个提示对话框、loading 对话框等，当显示一个对话框时，即使设置了 activity 为深色状态栏和导航栏文字颜色，这时候状态栏和导航栏的文字颜色又变成白色，如下所示：

![图片](/images/jueJin/9dc87d05a09b46d.png)

这是因为对 activity 设置的状态栏和导航栏颜色是作用 于 activity 的 window，而 dialog 和 activity 不是同一个 window，因此 dialog 也需要单独设置。

### 完整代码

```kotlin
@file:Suppress( DEPRECATION )

package com.bytedance.heycan.systembar.dialog

import android.app.Dialog
import android.os.Build
import android.view.View
import android.view.ViewGroup

/**
* Created by dengchunguo on 2021/4/25
*/
    fun Dialog.setLightStatusBar(isLightingColor: Boolean) {
    val window = this.window ?: return
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (isLightingColor) {
            window.decorView.systemUiVisibility =
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE or View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
                } else {
                window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            }
        }
    }
    
        fun Dialog.setLightNavigationBar(isLightingColor: Boolean) {
        val window = this.window ?: return
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && isLightingColor) {
            window.decorView.systemUiVisibility =
            window.decorView.systemUiVisibility or if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR else 0
        }
    }
    
        fun Dialog.immersiveStatusBar() {
        val window = this.window ?: return
            (window.decorView as ViewGroup).setOnHierarchyChangeListener(object : ViewGroup.OnHierarchyChangeListener {
                override fun onChildViewAdded(parent: View?, child: View?) {
                    if (child?.id == android.R.id.statusBarBackground) {
                    child.scaleX = 0f
                }
            }
            
                override fun onChildViewRemoved(parent: View?, child: View?) {
            }
            })
        }
        
            fun Dialog.immersiveNavigationBar() {
            val window = this.window ?: return
                (window.decorView as ViewGroup).setOnHierarchyChangeListener(object : ViewGroup.OnHierarchyChangeListener {
                    override fun onChildViewAdded(parent: View?, child: View?) {
                        if (child?.id == android.R.id.navigationBarBackground) {
                        child.scaleX = 0f
                            } else if (child?.id == android.R.id.statusBarBackground) {
                            child.scaleX = 0f
                        }
                    }
                    
                        override fun onChildViewRemoved(parent: View?, child: View?) {
                    }
                    })
                }
```

效果如下：

![图片](/images/jueJin/519ab1d088cb4ec.png)

快速使用
----

### Activity 沉浸式

```scss
immersiveStatusBar() // 沉浸式状态栏
immersiveNavigationBar() // 沉浸式导航栏

setLightStatusBar(true) // 设置浅色状态栏背景（文字为深色）
setLightNavigationBar(true) // 设置浅色导航栏背景（文字为深色）

setStatusBarColor(color) // 设置状态栏背景色
setNavigationBarColor(color) // 设置导航栏背景色

    navigationBarHeightLiveData.observe(this) {
    // 监听导航栏高度变化
}
```

### Dialog 沉浸式

```scss
val dialog = Dialog(this, R.style.Heycan_SampleDialog)
dialog.setContentView(R.layout.dialog_loading)
dialog.immersiveStatusBar()
dialog.immersiveNavigationBar()
dialog.setLightStatusBar(true)
dialog.setLightNavigationBar(true)
dialog.show()
```

### Demo 效果

![图片](/images/jueJin/88696764529545c.png)

可实现与 iOS 类似的页面沉浸式导航条效果：

![图片](/images/jueJin/6453830dc13e485.png)

加入我们
----

我们是**字节跳动影像团队**，目前研发包括剪映、CapCut、轻颜、醒图、Faceu 在内的多款产品，业务覆盖多元化影像创作场景，截止 2021 年 6 月，剪映、轻颜相机、CapCut 等多次登顶国内外 APP Store 免费应用榜第一，并继续保持高速增长。加入我们，一起打造全球最受用户欢迎的影像创作产品。

**社招投递链接**：[job.toutiao.com/s/NFYMcaq](https://link.juejin.cn?target=https%3A%2F%2Fjob.toutiao.com%2Fs%2FNFYMcaq "https://job.toutiao.com/s/NFYMcaq")

**校招投递链接**：[job.toutiao.com/s/NkecFwb](https://link.juejin.cn?target=https%3A%2F%2Fjob.toutiao.com%2Fs%2FNkecFwb "https://job.toutiao.com/s/NkecFwb")

了解更多岗位👉 [bytedance.feishu.cn/docx/doxcnM…](https://bytedance.feishu.cn/docx/doxcnMxgSioztbDuQqZ3eWDAvMc "https://bytedance.feishu.cn/docx/doxcnMxgSioztbDuQqZ3eWDAvMc")