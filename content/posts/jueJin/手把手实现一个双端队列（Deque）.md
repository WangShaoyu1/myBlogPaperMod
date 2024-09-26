---
author: "mysteryven"
title: "手把手实现一个双端队列（Deque）"
date: 2021-01-01
description: "今天讲解的双端队列原理很简单、但是功能却非常强大，很适合假期阅读。完整代码在文末。数组是一个非常有用的数据结构，对于大多数编程语言来说，数组往往存储在一块连续的内存空间中（JS的数组不是），它支持快速访问任意索引的元素（起始值+索引*偏移量），这是它最大的优势，它可…"
tags: ["算法"]
ShowReadingTime: "阅读5分钟"
weight: 895
---
大家新年快乐呀，有没有出去玩呢？

今天讲解的双端队列原理很简单、但是功能却非常强大，很适合假期阅读。完整代码在文末。

数组是一个非常有用的数据结构，对于大多数编程语言来说，数组往往存储在一块连续的内存空间中（JS 的数组不是），它支持快速访问任意索引的元素（起始值 + 索引 \* 偏移量），这是它最大的优势，它可以让我们可以以 O(1) 的时间访问到数组中的任意值。

不过，万物有优就有劣，在原生数组插入、删除元素是一个很头疼的事，特别是数组的开头。如果我们需要在开头插入一个元素，那所有的元素都要往后移动一位，以此来腾出一个位置。

今天我们基于数组实现的双端队列（Deque）就可以解决上面这些问题，它让我们在数组开头结尾进行插入、删除元素时，平均时间复杂度做到 O(1)。

当然了，这只是它的一个特性。我们还可以基于我们实现的双端队列，很轻松的实现栈、循环队列。

首先，我们通过接口来看一下我们的队列的主要功能：

java

 代码解读

复制代码

`public interface Deque<E> {     int getSize();     void isEmpty();     void addFront(E e);     void addLast(E e);     E removeFront();     E removeLast();     E getFront();     E getLast(); }`

我们只使用 `addLast` 和 `removeLast` 就变成了一个栈。我们只使用 `addLast` 和 `removeFront` 就变成了一个队列。

大家已经通过我们定义的接口，大概知道我们的双端队列具有什么功能了吧，现在我们就要一个个的把他们实现。在实现各个方法之前，我们需要先放出我们的构造函数：

java

 代码解读

复制代码

`public class ArrayDeque<E> {     private E[] data;     private int front;     private int tail;     private int size;     public ArrayDeque(int capacity) {         data = (E[]) new Object[capacity];         front = tail = size = 0;     }          public ArrayDeque() {         this(10);     } }`

现在不知道为什么会定义某些变量，没关系，我们看下去就知道了。

我们使用了 `size` 变量来保存我们队列的大小，在添加、删除时，都会对它进行变化。 我们先实现最简单的 `getSize` 方法：

java

 代码解读

复制代码

`public int getSize() {     return size; }`

接下来还有用到 `size` 这个变量的地方，我们会用它来判断队列是空，还是满。

java

 代码解读

复制代码

`public boolean isEmpty() {     return size == 0; }`

那满的时候呢？也是只需要一个条件：

java

 代码解读

复制代码

`size == data.length`

有些同学可能注意到了，我们在初始化时，保留了头指针（front）和尾指针 (tail) 两个变量。其实，我们是可以根据头指针和尾指针的相对位置来判空或判满的。而我们这里使用的是 `size` 变量，这样比较简单，同时，也没有浪费一个空间，浪费一个空间其实也没啥。有兴趣的同学可以考虑一下如何使用头指针和尾指针来进行操作。

我们会使用 `front` 指向我们队列的第一个元素，并不一定是数组的第一个。使用 `tail` 指向我们队列的最后一根元素，并不一定是数组的最后一个。

当我们在队列开头添加元素的时候，`front` 会向「左移」；

当我们在队列开头删除元素的时候，`front` 会向「右移」；

当我们在队列结尾添加元素的时候，`tail` 会向「右移」；

当我们在队列结尾删除元素的时候，`tail` 会向「左移」；

不论是 `front` 还是 `tail`，类似于轮播图，不考虑队列满和空的情况。左移到头了，就回到数组结尾。右移到头了就回到数组开头。

我们来看如何在数组的开始添加一个元素，这个要分为两种情况。

当 front 不指向索引 0 时： ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83e22a43863c49278b95bfd438cd22ef~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

在当前情况下，插入元素其实就是在索引为 1 的位置赋值就好。`size` 要加 1。

当 `front` 正好指向索引为 0 时： ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ef00797f58349df845cab84c862fb46~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

我们的下一个 `front` 应该是数组的最后一个位置，也就是 `data.length - 1`。

下面是我们添加部分的代码：

java

 代码解读

复制代码

`public void addFront(E e) {     if (size == data.length) {         resize(2 * data.length);      }     front = front == 0 ? data.length - 1 : front - 1;     data[front] = e;     size++; }`

`resize` 是什么呢？它的主要作用是动态扩容或缩容，在我们这里，队列满了，我们就扩大为原来的 1 倍，同时在队列实际存储的元素只有 1 / 4 的时候，我们缩容为原来的 1/2 。

有些同学会问，为啥不是在原来 1/2 的时候缩小为原来的 1/2 呢？这是为了避免在数组原来的 1/2 那个临界点频繁扩容、缩容。队列满的时候我们会扩容，扩大后的元素只站总容量的 1/2 ，此时删一个就触发缩容了，以此反复。于是我们选择 1/4 的时候缩容。

java

 代码解读

复制代码

`private void resize(int newCapacity) {     E[] newData = (E[]) new Object[newCapacity];     for (int i = 0; i < data.length; i++) {         newData[i] = data[(front + i) % data.length];     }     data = newData;     front = 0;     tail = size; }`

值得注意的是，我们拷贝完要重置 `front` 和 `tail` 的指向。

我们再来分析如何在数组的开始删除一个元素：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf06e9d580194c209d970fa6012e2b54~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

此时删除元素很简单，就是让当前 `front` 所指向的元素等于 null, 同时 `front` 加 1。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d45aa4d61dd429aac2144df1585a0a7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

当我们的 `front` 指向最后一个元素时，是我们需要考虑的另外一个情况，我们队列中元素的整体顺序是：3， 6， 5， 1， 2，3。 那此时删除，就是让当前 `front` 所指向的元素等于 null，同时让 `front` 指向索引 0 。

虽然情况分为两种，但是二者的代码是一致的：

java

 代码解读

复制代码

`public E removeFront() {     if (isEmpty()) {         throw new IllegalArgumentException("Deque is empty");     }     E ret = data[front];     data[front] = null;     front += (front + 1) % data.length;     size--;     if (getSize() == data.length / 4 && getSize() / 2 != 0) {         resize(data.length / 2);     }     return ret; }`

我们已经分析完在开始添加、删除元素了。剩下还有两个：在数组尾部添加和删除元素。理解了上面的过程，其实这两个方法是相对简单的，只不过操作的指针变为 `tail`，有同学不会的，评论区问吧，我都在的。

java

 代码解读

复制代码

`public void addLast(E e) {     if (getSize() == data.length) {         resize(2 * data.length);     }     data[tail] = e;     tail = (tail + 1) % data.length;     size++; }`

java

 代码解读

复制代码

`public E removeLast() {     if (isEmpty()) {         throw new IllegalArgumentException("Deque is empty");     }     tail = tail == 0 ? data.length - 1 : tail - 1;     E ret = data[tail];     data[tail] = null;     size--;     if (getSize() == data.length / 4 && getSize() / 2 != 0) {         resize(data.length / 2);     }     return ret; }`

怎么样，这样我们就分析完了一个双端队列，完整代码如下：

java

 代码解读

复制代码

`public class ArrayDeque<E> {     private E[] data;     private int front;     private int tail;     private int size;     public ArrayDeque(int capacity) {         data = (E[]) new Object[capacity];         front = tail = size = 0;     }     public ArrayDeque() {         this(10);     }     public int getSize() {         return size;     }     public void addFront(E e) {         if (getSize() == data.length) {             resize(2 * data.length);         }         front = front == 0 ? data.length - 1 : front - 1;         data[front] = e;         size++;     }     public void addLast(E e) {         if (getSize() == data.length) {             resize(2 * data.length);         }         data[tail] = e;         tail = (tail + 1) % data.length;         size++;     }     private void resize(int newCapacity) {         E[] newData = (E[]) new Object[newCapacity];         for (int i = 0; i < data.length; i++) {             newData[i] = data[(front + i) % data.length];         }         data = newData;         front = 0;         tail = size;     }     public boolean isEmpty() {         return size == 0;     }     public E removeFront() {         if (isEmpty()) {             throw new IllegalArgumentException("Deque is empty");         }         E ret = data[front];         data[front] = null;         front += (front + 1) % data.length;         size--;         if (getSize() == data.length / 4 && getSize() / 2 != 0) {             resize(data.length / 2);         }         return ret;     }     public E removeLast() {         if (isEmpty()) {             throw new IllegalArgumentException("Deque is empty");         }         tail = tail == 0 ? data.length - 1 : tail - 1;         E ret = data[tail];         data[tail] = null;         size--;         if (getSize() == data.length / 4 && getSize() / 2 != 0) {             resize(data.length / 2);         }         return ret;     }     public E getFront() {         if (isEmpty()) {             throw new IllegalArgumentException("Deque is empty");         }         return data[front];     }     public E getLast() {         if (isEmpty()) {             throw new IllegalArgumentException("Deque is empty");         }         return data[tail == 0 ? data.length - 1 : tail - 1];     } }`