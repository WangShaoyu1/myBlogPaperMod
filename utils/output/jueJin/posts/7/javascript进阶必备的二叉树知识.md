---
author: "徐小夕"
title: "javascript进阶必备的二叉树知识"
date: 2020-06-28
description: "每当放完小长假，我都会习惯性的反思和复盘一下自己的技术，尤其是端午节。为什么我会写二叉树的文章呢？其实这涉及到程序员的一个成长性的问题。对于0-3年的前端程序员来说，可能很少有机会涉及到数据结构和算法的工作中，除非去大厂或者做架构相关的工作。但是很多工作2-3年的前端工程师，业…"
tags: ["JavaScript","数据结构中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读6分钟"
weight: 1
selfDefined:"likes:72,comments:9,collects:146,views:8189,"
---
前言
--

每当放完小长假，我都会习惯性的反思和复盘一下自己的技术，尤其是**端午节**。为什么我会写**二叉树**的文章呢？其实这涉及到程序员的一个**成长性**的问题。对于**0-3年**的**前端程序员**来说，可能很少有机会涉及到数据结构和算法的工作中，除非去大厂或者做架构相关的工作。但是很多工作2-3年的前端工程师，业务工作已经相对熟悉了，各种技术或多或少也都使用过，那么在这个阶段，对于每个有追求的程序员，是不是应该突破一下自己的技术瓶颈，去研究一些更深层次的知识呢？没错，这个阶段我们最应该了解的就是**数据结构**，**算法**，**设计模式**相关的知识，**设计模式**和**算法**笔者在之前的文章中已经系统的总结过了，感兴趣的可以学习了解一下。

接下来笔者就系统的总结一下二叉树相关的知识，并且通过实际代码一步步来带大家实现一个**二叉搜索树**。

二叉树介绍
-----

二叉树（**Binary tree**）是树形结构的一个重要类型。许多实际问题抽象出来的数据结构往往是二叉树形式，即使是一般的树也能简单地转换为二叉树，而且二叉树的存储结构及其算法都较为简单，因此二叉树显得特别重要。**二叉树特点是每个结点最多只能有两棵子树，且有左右之分**。

![](/images/jueJin/172f679490686ad.png)

二叉树中的节点最多只能有两个子节点：**左侧子节点**和**右侧子节点**。我们接下来主要来实现一个**二叉搜索树（BST）**。它是二叉树的一种，但是只允许你在左侧节点存储比父节点小的值，在右侧节点存储比父节点大（或者等于）的值。如下图：

![](/images/jueJin/172f68bafa7e428.png)

接下来我们就一起实现一下BST树。

实现一个二叉搜索（BST）树
--------------

在实现之前，我们需要先分析一下BST（二叉搜索）树。我们要想构建一棵实用的树，我们需要**节点**和**方法**，如下图所示：

![](/images/jueJin/172f69704eb5cb4.png)

我们先实现一个基类，如下：

```
    function BinarySearchTree() {
        let Node = function(key) {
        this.key = key;
        this.left = null;
        this.right = null;
    }
    let root = null;
}
```

我们按照上图的二叉搜索树的结构组织方式，来实现二叉树的基本方法。

```
// 插入
    this.insert = function(key) {
    let newNode = new Node(key);
        if(root === null) {
        root = newNode;
            }else {
            insertNode(root, newNode);
        }
    }
```

其中**insertNode**方法用来判断在根节点不为空时的执行逻辑，具体代码如下：

```
    function insertNode(node, newNode) {
    // 如果新节点值小于当前节点值，则插入左子节点
        if(newNode.key < node.key) {
            if(node.left === null) {
            node.left = newNode;
                }else{
                insertNode(node.left, newNode);
            }
                }else {
                // 如果新节点值大于当前节点值，则插入右子节点
                    if(node.right === null) {
                    node.right = newNode;
                        }else {
                        insertNode(node.right, newNode);
                    }
                }
            }
```

以上代码即实现了**BST**的插入部分逻辑，具体使用方式如下：

```
let tree = new BinarySearchTree()
tree.insert(19)
tree.insert(10)
tree.insert(20)
```

以上代码生成的二叉树结构如下：

![](/images/jueJin/172f6bdd0170e0c.png)

树的遍历
----

树的遍历是指**访问树的每个节点并对它们进行某种操作的过程**。具体分为**中序遍历**，**先序遍历**和**后序遍历**。接下来我会一一介绍给大家。

### 中序遍历

**中序遍历**是一种以**从最小到最大的顺序访问所有节点**的遍历方式，具体实现如下：

```
    this.inOrderTraverse = function(cb) {
    inOrderTraverseNode(root, cb)
}

    function inOrderTraverseNode(node, cb) {
        if(node !== null) {
        inOrderTraverseNode(node.left, cb)
        cb(node.key)
        inOrderTraverseNode(node.right, cb)
    }
}
```

具体遍历过程如下图所示：

![](/images/jueJin/172f6c7ba99c9ee.png)

### 先序遍历

**先序遍历是以优先于后代节点的顺序访问每一个节点**。具体实现如下：

```
    this.preOrderTraverse = function(cb) {
    preOrderTraverseNode(root, cb)
}

    function preOrderTraverseNode(node, cb) {
        if(node !== null) {
        cb(node.key)
        preOrderTraverseNode(node.left, cb)
        preOrderTraverseNode(node.right, cb)
    }
}
```

具体遍历如下图所示：

![](/images/jueJin/172f6cc6a2c3805.png)

### 后序遍历

**后序遍历是先访问节点的后代节点，再访问节点本身。**。具体实现如下：

```
    this.postOrderTraverse = function(cb) {
    preOrderTraverseNode(root, cb)
}

    function postOrderTraverseNode(node, cb) {
        if(node !== null) {
        postOrderTraverseNode(node.left, cb)
        postOrderTraverseNode(node.right, cb)
        cb(node.key)
    }
}
```

具体遍历顺序如下图所示：

![](/images/jueJin/172f6cfe6822e84.png)

树的搜索
----

我们一般的搜索会有最值搜索（也就是最大值，最小值，中值）和对特定值的搜索，接下来我们就来实现它们。

### 搜索特定的值

在BST树中搜索特定的值，具体实现如下：

```
    this.search = function(key) {
    return searchNode(root, key)
}

    function searchNode(ndoe, key) {
        if(node === null) {
        return false
    }
        if(key < node.key) {
        return searchNode(node.left, key)
            }else if(key > node.key) {
            return searchNode(node.right, key)
                }else {
                return true
            }
        }
```

实现逻辑也很简单，这里大家可以研究一下。

### 搜索最小值

由二叉树的结构特征我们可以发现，二叉树的最左端就是最小值，二叉树的最右端就是最大值，所以我们可以通过遍历来找到最小值，代码如下：

```
    this.min = function() {
    return minNode(root)
}

    function minNode(node) {
        if(node) {
            while(node && node.left !== null) {
            node = node.left;
        }
        return node.key
    }
    return null
}
```

### 搜索最大值

和求最小值一样，最大值也可以用类似的方法，代码如下：

```
    this.max = function() {
    return maxNode(root)
}

    function maxNode(node) {
        if(node) {
            while(node && node.right !== null) {
            node = node.right;
        }
        return node.key
    }
    return null
}
```

### 移除节点

移除BST中的节点相对来说比较复杂，需要考虑很多情况，具体情况如下：

1.  移除一个叶节点
    
    ![](/images/jueJin/172f6e8480bf408.png)
    
2.  移除有一个左侧或右侧子节点的节点
    
    ![](/images/jueJin/172f6e9f0abae2d.png)
    
3.  移除有两个子节点的节点
    
    ![](/images/jueJin/172f6eda833bb87.png)
    

了解了上述3种情况之后我们开始实现删除节点的逻辑：

```
    this.remove = function(key) {
    root = removeNode(root, key)
}

    function removeNode(node, key) {
        if(node === null) {
        return null
    }
        if(key < node.key) {
        node.left = removeNode(node.left, key)
        return node
            }else if(key > node.key) {
            node.right = removeNode(node.right, key)
            return node
                }else {
                // 一个叶节点
                    if(node.left === null && node.right === null) {
                    node = null;
                    return node
                }
                // 只有一个子节点的节点
                    if(node.left === null) {
                    node = node.right;
                    return node
                        }else if(node.right === null) {
                        node = node.left;
                        return node
                    }
                    // 有两个子节点的节点情况
                    let aux = findMinNode(node.right);
                    node.key = aux.key;
                    node.right = removeNode(node.right, aux.key);
                    return node
                }
            }
            
                function findMinNode(node) {
                    if(node) {
                        while(node && node.left !== null) {
                        node = node.left;
                    }
                    return node
                }
                return null
            }
```

至此，一棵完整的搜索二叉树就实现了，是不是很有成就感呢？本文的源码以上传至笔者的github，感兴趣的朋友可以感受一下。

二叉树的应用
------

二叉树一般可以用来：

*   生成树结构
*   数据库的搜索算法
*   利用二叉树加密
*   计算目录和子目录中所有文件的大小，
*   打印一个结构化的文档
*   在游戏中用来做路径规划等

扩展
--

其实**树**的类型还有很多种，这些不同类型的树在计算机中有很广泛的用途，比如**红黑树**，**B树**，**自平衡二叉查找树**，**空间划分树**，**散列树**，**希尔伯特R树**等，如果对这些树敢兴趣的朋友可以深入研究一下，毕竟对自己未来的技术视野还是很有帮助的。

最后
--

如果想学习更多**前端技能**,**实战**和**学习路线**, 欢迎在公众号《趣谈前端》加入我们的技术群一起学习讨论，共同探索前端的边界。

![](/images/jueJin/170060658dd3db9.png)

参考文献
----

二叉树 - [baike.baidu.com/item/二叉树](https://link.juejin.cn?target=https%3A%2F%2Fbaike.baidu.com%2Fitem%2F%25E4%25BA%258C%25E5%258F%2589%25E6%25A0%2591 "https://baike.baidu.com/item/%E4%BA%8C%E5%8F%89%E6%A0%91")

更多推荐
----

*   [当后端一次性丢给你10万条数据, 作为前端工程师的你,要怎么处理?](https://juejin.cn/post/6844904184689475592 "https://juejin.cn/post/6844904184689475592")
*   [程序员必备的几种常见排序算法和搜索算法总结](https://juejin.cn/post/6844904133271486478 "https://juejin.cn/post/6844904133271486478")
*   [基于nodeJS从0到1实现一个CMS全栈项目（上）](https://juejin.cn/post/6844903952761225230 "https://juejin.cn/post/6844903952761225230")
*   [基于nodeJS从0到1实现一个CMS全栈项目（中）（含源码）](https://juejin.cn/post/6844903954522832909 "https://juejin.cn/post/6844903954522832909")
*   [CMS全栈项目之Vue和React篇（下）（含源码）](https://juejin.cn/post/6844903955797901319 "https://juejin.cn/post/6844903955797901319")
*   [从零到一教你基于vue开发一个组件库](https://juejin.cn/post/6844904085808742407 "https://juejin.cn/post/6844904085808742407")
*   [从0到1教你搭建前端团队的组件系统（高级进阶必备）](https://juejin.cn/post/6844904068431740936 "https://juejin.cn/post/6844904068431740936")