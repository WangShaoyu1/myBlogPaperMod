---
author: "捡田螺的小男孩"
title: "喜提一个bug，聊聊 @NotEmpty和 @NotBlank的区别"
date: 2024-08-05
description: "大家好，我是田螺。 上个版本，测试给我提了一个bug，说一个来源字段，传个空字符串，也能更新成功，建议做一下校验。"
tags: ["后端","Java中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读1分钟"
weight: 1
selfDefined:"likes:16,comments:0,collects:18,views:4005,"
---
前言
--

大家好，我是**田螺**。

上个版本，测试给我提了一个`bug`，说一个来源字段，传个空字符串，也能更新成功，**建议做一下校验**。

*   **关注公众号**：捡田螺的小男孩（很多后端干货文章）

我想了一下，我的属性**确实有校验呀**：

```ini
@NotEmpty(message = "source must not be empty")
private String source;
```

`@NotEmpty` 跟 `StringUtils.isEmpty` 校验效果是一样的，点进去源码一看，发现**确实用得不太对**：

```typescript
    public static boolean isEmpty(CharSequence cs) {
    return cs == null || cs.length() == 0;
}
```

如果传空字符串的话，`@NotEmpty` **并不能校验出来**。

1\. 复现demo
----------

```ini
String source ="  ";
System.out.println(StringUtils.isEmpty(source));
//输出长度
System.out.println(source.length());
```

运行结果：

```arduino
false
2
```

传一个空字符串，运行的结果是`false`。

> 因为isEmpty校验的是，不能为null，而且长度必须大于0，而空的字符串，长度是大于0的，所以返回false。

2\. 正确的使用方式
-----------

我们在校验空字符串的时候，要用`StringUtils.isBlank`。它用于**检查字符串是否为空白**（**null、长度为 0 或仅包含空白字符**）

```ini
String source ="  ";
System.out.println(StringUtils.isBlank(source));

```

运行结果：

```arduino
true
```

大家可以看下它的源码：

```arduino
    public static boolean isBlank(CharSequence cs) {
    int strLen = length(cs);
        if (strLen == 0) {
        return true;
            } else {
                for(int i = 0; i < strLen; ++i) {
                    if (!Character.isWhitespace(cs.charAt(i))) {
                    return false;
                }
            }
            
            return true;
        }
    }
```

有这个`Character.isWhitespace`，嘻嘻，真相。因此，大家在日常开发中，做校验的时候，要注意这个哈。

3\. @NotNull和@NotEmpty和@NotBlank区别
----------------------------------

常用的注解还有@NotNull，我们说说它们三的区别吧：

*   @NotNull: 不能为null，但可以为空（如空字符串或空集合）
*   @NotEmpty: 不能为null,可以为空的字符串，**但长度必须大于0**
*   @NotBlank：不能为 null，不能为空字符串

最后
--

*   **关注公众号**：捡田螺的小男孩（很多后端干货文章）