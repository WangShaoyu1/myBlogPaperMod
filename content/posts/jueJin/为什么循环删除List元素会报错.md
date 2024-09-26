---
author: "三火哥"
title: "为什么循环删除List元素会报错"
date: 2023-11-01
description: "List，Set，Map在循环里删除元素失败根因分析，只有了解源码实现原理，指定预防措施，才能避免问题的再次发生"
tags: ["后端","面试","Java"]
ShowReadingTime: "阅读4分钟"
weight: 578
---
描述
--

大家在工作中应该都会遇到从List集合中删除某一个或多个元素的业务场景

相信大家都会避开在循环里面删除元素，使用其他方式处理

很多面试官也都会问为什么循环里面不能删除元素？

示例
--

JAVA

 代码解读

复制代码

`public static void main(String[] args) {       List<String> list = new ArrayList<>();       list.add("test0");       list.add("test1");       list.add("test2");       list.add("test3");       list.add("test4");       list.add("test5");       System.out.println(list);       list.remove(3);       System.out.println(list);       list.remove("test1");       System.out.println(list);       for (int i = 0; i < list.size(); i++) {           if (i == 2) {               list.remove(i);           }       }       System.out.println(list);       Iterator<String> it = list.iterator();       while (it.hasNext()) {           if (it.next().equals("test2")) {               it.remove();           }       }       System.out.println(list);       for (String s : list) {           if ("test5".equals(s)) {               list.remove(s);           }       }       System.out.println(list);  } 打印结果 [test0, test1, test2, test3, test4, test5] [test0, test1, test2, test4, test5] [test0, test2, test4, test5] [test0, test2, test5] [test0, test5] Exception in thread "main" java.util.ConcurrentModificationException 	at java.util.ArrayList$Itr.checkForComodification(ArrayList.java:909) 	at java.util.ArrayList$Itr.next(ArrayList.java:859) 	at com.fc.store.Test.main(Test.java:46)`

##### 从打印结果可以看到

1.  根据索引删除 --正常
2.  根据元素删除 --正常
3.  循环根据索引删除 --正常
4.  迭代删除原始 --正常
5.  循环根据元素删除 --不正常

执行过程
----

JAVA

 代码解读

复制代码

`List<String> list = new ArrayList<>(); 集合初始化时  transient Object[] elementData;  空数组 private int size;  长度为0 protected transient int modCount = 0;   修改次数为0 添加元素 list.add("test0");  elementData[0] = "test0"; size = 1; modCount = 1; list.add("test1");  elementData[0] = "test0"; elementData[1] = "test1"; size = 2; modCount = 2; list.add("test2");  elementData[0] = "test0"; elementData[1] = "test1"; elementData[2] = "test2"; size = 3; modCount = 3; list.add("test3");  elementData[0] = "test0"; elementData[1] = "test1"; elementData[2] = "test2"; elementData[3] = "test3"; size = 4; modCount = 4; list.add("test4"); elementData[0] = "test0"; elementData[1] = "test1"; elementData[2] = "test2"; elementData[3] = "test3"; elementData[4] = "test4"; size = 5; modCount = 5; list.add("test5"); elementData[0] = "test0"; elementData[1] = "test1"; elementData[2] = "test2"; elementData[3] = "test3"; elementData[4] = "test4"; elementData[5] = "test5"; size = 6; modCount = 6; 可以发现每添加一个元素，集合size会增加1， 修改次数会增加1 根据索引删除 list.remove(3); elementData[0] = "test0"; elementData[1] = "test1"; elementData[2] = "test2"; elementData[4] = "test4"; elementData[5] = "test5"; size = 5; modCount = 7; 根据元素删除 list.remove("test1"); elementData[0] = "test0"; elementData[1] = "test2"; elementData[2] = "test4"; elementData[5] = "test5"; size = 4; modCount = 8; 循环根据索引删除 for (int i = 0; i < list.size(); i++) {       if (i == 2) {           list.remove(i);       }   } elementData[0] = "test0"; elementData[1] = "test2"; elementData[5] = "test5"; size = 3; modCount = 9; 循环根据索引删除 Iterator<String> it = list.iterator();   while (it.hasNext()) {       if (it.next().equals("test2")) {           it.remove();       }   }   elementData[0] = "test0"; elementData[5] = "test5"; size = 2; modCount = 10; 可以发现每删除一个元素后，集合size会减1，修改次数会增加1 循环根据元素删除 for (String s : list) {       if ("test2".equals(s)) {           list.remove(s);       }   } 就抛异常了，因为Iterator的next方法会校验是否修改 此时：expectedModCount = 10， modCount = 11 public E next() {     checkForComodification(); } final void checkForComodification() {       if (modCount != expectedModCount) {         throw new ConcurrentModificationException();       } }`

源码解析
----

List 的add和remove方法每次操作都会对modCount++

JAVA

 代码解读

复制代码

`public boolean add(E e) {       ensureCapacityInternal(size + 1); // Increments modCount!!       elementData[size++] = e;       return true;   } public E remove(int index) {       rangeCheck(index);       modCount++;       E oldValue = elementData(index);       int numMoved = size - index - 1;       if (numMoved > 0)       System.arraycopy(elementData, index+1, elementData, index,       numMoved);       elementData[--size] = null; // clear to let GC do its work       return oldValue;   } public boolean remove(Object o) {       if (o == null) {           for (int index = 0; index < size; index++)  {             if (elementData[index] == null) {                   fastRemove(index);                   return true;               }           }     } else {           for (int index = 0; index < size; index++) {             if (o.equals(elementData[index])) {                   fastRemove(index);                   return true;              }         }       }       return false;   } private void fastRemove(int index) {       modCount++;       int numMoved = size - index - 1;       if (numMoved > 0)           System.arraycopy(elementData, index+1, elementData, index,  numMoved);       elementData[--size] = null; // clear to let GC do its work   } private void ensureCapacityInternal(int minCapacity) {       ensureExplicitCapacity(calculateCapacity(elementData, minCapacity));   }      private void ensureExplicitCapacity(int minCapacity) {       modCount++;   }`

Iterator 会继承List的modCount，并赋值给expectedModCount

JAVA

 代码解读

复制代码

`private class Itr implements Iterator<E> {       int cursor; // index of next element to return       int lastRet = -1; // index of last element returned; -1 if no such       int expectedModCount = modCount; }`

Iterator 的next方法会校验modCount和expectedModCount 是否相同

JAVA

 代码解读

复制代码

`public E next() {       checkForComodification();       int i = cursor;       if (i >= size)           throw new NoSuchElementException();       Object[] elementData = ArrayList.this.elementData;       if (i >= elementData.length)           throw new ConcurrentModificationException();       cursor = i + 1;       return (E) elementData[lastRet = i];   } final void checkForComodification() {       if (modCount != expectedModCount)           throw new ConcurrentModificationException();   }`

由于在Iterator的便利中使用了List的remove方法，导致modCount增加了 所以在下次next方法中判断modCount和expectedModCount不一致就直接抛出了异常

解决方案
----

第一种使用迭代器删除

JAVA

 代码解读

复制代码

`Iterator<String> it = list.iterator();   while (it.hasNext()) {       if (it.next().equals("test2")) {           it.remove();       }   }`  

第二种for循环删除后要立即退出

JAVA

 代码解读

复制代码

`for (String s : list) {       if ("test5".equals(s)) {           list.remove(s);           return;       }   } JAVA8语法 list.removeIf("test5"::equals);`

Set，Map 同理
----------

同样Set，Map循环里面删除报错也是同样的原理

往往大家在遇到问题后，都只是找到了主要原因，但是并没有找到根本原因。

只有通过深入分析找到根本原因，制定预防措施（加入CR清单，添加扫码规则，制定奖惩措施），才能够真正避免问题