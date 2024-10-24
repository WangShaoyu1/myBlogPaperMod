---
author: "Gaby"
title: "别忘了Js数组去重也是面试常考的点"
date: 2021-11-09
description: "由于JS去重可以使用多种方法实现，所以在面试中常用来考察，你对知识掌握的全面程度。很多时候一开始就想了一两种方法，后来仔细回忆了下这个题，觉得该问题实现方法确实不止一两种。看看吧，你能想起来几种呢。 "
tags: ["面试","JavaScript中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读2分钟"
weight: 1
selfDefined:"likes:23,comments:0,collects:54,views:1737,"
---
由于JS去重可以使用多种方法实现，所以在面试中常用来考察，你对知识掌握的全面程度。很多时候一开始就想了一两种方法，后来仔细回忆了下这个题，觉得该问题实现方法确实不止一两种。看看吧，你能想起来几种呢。

### 一、利用ES6中的 Set 方法去重

注：Set为ES6新增的一个对象，允许存储任何类型（原始值或引用值）的唯一值

```js
// 方法 1
let arr = [1,0,0,2,4,9,8,3,1];

    function unique(arr) {
    return Array.from(new Set(arr))
}
console.log(unique(arr));   // [1,0,2,4,9,8,3]
``````js
// 方法 2
let arr = [1,0,0,2,4,9,8,3,1];

console.log(...new Set(arr));　// [1,0,2,4,9,8,3]
```

### 二、利用ES6中的Map方法去重

```js
/*
创建一个空Map数据结构，遍历需要去重的数组，把数组的每一个元素作为key存到Map中。由于Map中不会出现相同的key值，所以最终得到的就是去重后的结果。
*/
let arr = [1, 0, 8, 3, -9, 1, 0, -9, 7]
    function unique(arr) {
    let map = new Map();
    console.log(map)
    //let arr1 = new Array();      // 数组用于返回结果
let arr1 = []
    for (let i = 0, len = arr.length; i < len; i++) {
    if (map.has(arr[i])) {      // 判断是否存在该key值
    map.set(arr[i], true);
}
    else {
    map.set(arr[i], false);
    arr1.push(arr[i]);
}
}
return arr1;
}
console.log(unique(arr)); // 1, 0, 8, 3, -9, 7
```

### 三、利用数组的filter方法去重

注：filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素，array.filter(function(currentValue,index,arr), thisValue)

　　　　currentValue：当前元素的值(必选参数)、index：当前元素的索引值(可选)、arr：当前元素属于的数组对象(可选)、thisValue：对象作为该执行回调时使用，传递给函数，用作 "this" 的值，默认undefined(可选)

```js
var arr = [1,2,8,9,5,8,4,0,4];
/*
模拟: 原始数组：[1,2,8,9,5,8,4,0,4]
索引值：0,1,2,3,4,5,6,7,8
伪新数组：[1,2,8,9,5,8,4,0,4]
使用indexOf方法找到数组中的元素在元素在中第一次出现的索引值
索引值：0,1,2,3,4,2,6,7,6
返回前后索引值相同的元素：
新数组：[1,2,8,9,5,4,0]
*/
    function unique( arr ){
    // 如果新数组的当前元素的索引值 == 该元素在原始数组中的第一个索引，则返回当前元素
        return arr.filter(function(item,index){
        return arr.indexOf(item,0) === index;
        });
    }
    console.log(unique(arr));    //  1, 2, 8, 9, 5, 4, 0
```

### 四、利用hasOwnProperty

利用hasOwnProperty 判断是否存在对象属性

```js
    function unique(arr) {
    let obj = {};
        return arr.filter(function(item, index, arr){
        return obj.hasOwnProperty(typeof item + item) ? false : (obj[typeof item + item] = true)
        })
    }
    
    let arr = [1,0,0,2,4,4,8,3,1];
console.log(unique(arr));   // [1,0,2,4,8,3]
```

### 五、利用数组的indexOf方法去重

注：array.indexOf(item,statt) 返回数组中某个指定的元素的位置，没有则返回-1 利用foreach+indexOf数组去重也是可以，跟这个类似

```js
var arr =[1,-5,-4,0,-4,7,7,3];
    function unique(arr){
    var arr1 = [];       // 新建一个数组来存放arr中的值
        for(var i=0,len=arr.length;i<len;i++){
            if(arr1.indexOf(arr[i]) === -1){
            arr1.push(arr[i]);
        }
    }
    return arr1;
}
console.log(unique(arr));    // 1, -5, -4, 0, 7, 3
```

### 六、利用数组的sort方法去重（相邻元素对比法）

注：array.sort( function ) 参数必须是函数，可选，默认升序

```js
var arr =  [5,7,1,8,1,8,3,4,9,7];
    function unique( arr ){
    arr = arr.sort();
    console.log(arr);
    
    var arr1 = [arr[0]];
        for(var i=1,len=arr.length;i<len;i++){
            if(arr[i] !== arr[i-1]){
            arr1.push(arr[i]);
        }
    }
    return arr1;
}
console.log(unique(arr))l;   //  1, 1, 3, 4, 5, 7, 7, 8, 8, 9
```

### 七、利用数组的includes去重

注：arr.includes(指定元素(必填),指定索引值(可选,默认值为0) )，有值返回true，没有则返回false

```js
    function unique( arr ){
    var arr1 = [];
        for(var i=0,len=arr.length;i<len;i++){
        if( !arr1.includes( arr[i] ) ){      // 检索arr1中是否含有arr中的值
        arr1.push(arr[i]);
    }
}
return arr1;
}

let arr = [1,0,0,2,4,4,8,3,1];
console.log(unique(arr));   // [1,0,2,4,8,3]
```

### 八、利用reduce+includes

```js
    function unique(arr){
    return arr.reduce((prev,cur) => prev.includes(cur) ? prev : [...prev,cur],[]);
}

let arr = [1,0,0,2,4,4,8,3,1];
console.log(unique(arr));   // [1,0,2,4,8,3]
```

### 九、使用双重for循环，再利用数组的splice方法去重（ES5常用）

```js
var arr = [1, 5, 6, 0, 7, 3, 0, 5, 9,5,5];
    function unique(arr) {
        for (var i = 0, len = arr.length; i < len; i++) {
            for (var j = i + 1, len = arr.length; j < len; j++) {
                if (arr[i] === arr[j]) {
                arr.splice(j, 1);
                j--;        // 每删除一个数j的值就减1
                len--;      // j值减小时len也要相应减1（减少循环次数，节省性能）
                // console.log(j,len)
            }
        }
    }
    return arr;
}
console.log(unique(arr));       //  1, 5, 6, 0, 7, 3, 9
```

### 十、利用函数递归去重

```js
var arr = [1,1,5,6,0,9,3,0,6]
    function unique( arr ){
    var arr1 = arr;
    var len = arr1.length;
        arr1.sort((a,b)=>{
        return a-b
        })
            function loop(index){
                if(index >= 1){
                    if(arr1[index] === arr1[index-1] ){
                    arr1.splice(index,1);
                }
                loop(index - 1);  // 递归loop，然后数组去重
            }
        }
        loop(len-1);
        return arr1
    }
    console.log(unique(arr));    //   0, 1, 3, 5, 6, 9
```

### 十一、利用对象的属性不能相同的特点去重（不建议用，有缺陷）

注：用数组项作为对象的属性会自动去除相同的值

```js
var arr = [1,3,8,9,3,5,4,4,6,6,2];
    function unique(arr){
    var arr1 = [];
    var obj = {};
        for(var i =0,len=arr.length;i<len;i++){
            if(!obj[arr[i]]){
            arr1.push(arr[i]);
            obj[arr[i]] = 1;
                }else{
                obj[arr[i]]++;
            }
        }
        return arr1;
    }
    console.log(unique(arr));   //  1, 3, 8, 9, 5, 4, 6, 2
```