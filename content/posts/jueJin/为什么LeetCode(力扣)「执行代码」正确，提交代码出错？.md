---
author: "负雪明烛"
title: "为什么LeetCode(力扣)「执行代码」正确，提交代码出错？"
date: 2021-11-16
description: "为什么有时在LeetCode（力扣）上，RunCode（执行代码）正确，Submit（提交代码）时提示WrongAnswer（解答错误）？真不是LeetCode出bug了。"
tags: ["算法"]
ShowReadingTime: "阅读3分钟"
weight: 669
---
**为什么有时在 LeetCode （力扣）上，Run Code（执行代码） 正确，Submit（提交代码）时提示 Wrong Answer（解答错误）？**

看这篇文章你就懂了，真不是 LeetCode 出 Bug 了。

* * *

大家好，我是 **「负雪明烛」**，一位坚持 7 年写了 1000 篇 LeetCode 算法题题解的程序员。欢迎关注。 ​

面试必会的算法题系列在写作中——

1.  [面试必会的算法题——前缀和](https://link.juejin.cn?target=https%3A%2F%2Feditor.csdn.net%2Fmd%2F%3FarticleId%3D120132922 "https://editor.csdn.net/md/?articleId=120132922")
2.  [面试必会的算法题——求加法](https://link.juejin.cn?target=https%3A%2F%2Feditor.csdn.net%2Fmd%2F%3FarticleId%3D121027694 "https://editor.csdn.net/md/?articleId=121027694")

今天分享的是刷题小经验 —— **为什么一个测试用例，在「执行代码」的结果正确，「提交」运行出错？** ​

往事
==

谈起这个话题，我忍不住想起往事。 ​

第一次遇到这个问题是我在大二刚开始刷 LeetCode 的时候（还没中文版力扣），那时候我的主语言是 Java，在本地编译器 Eclipse 上写完代码粘贴到 LeetCode 的代码框里，点击「Run Code」后，看测试用例能通过，然后就「Submit」了。 ​

满心期待着出现了一个绿色的 **Accept!** ​

几秒种后，我傻眼了，我看到的是红色的 **Wrong Answer！**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3f24e47d38d450781fb3895757135bc~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

当时是新入门的小白，完全不能理解为什么会出错，还以为是 LeetCode 出现 Bug 了 😂 ​

当时我的同学中在刷题的只有我一个，也没有微信群交流，只能自己想办法。捯饬了半天才在网上找到了答案——**原来这和 LeetCode 的评测机制有关。** ​

复现
==

下面我就在中文力扣上复现一下当时的场景。 ​

就像下面这样，LeetCode 第 1 题：两数之和。

假如我的代码是下面这样，注意 `visited` 定义的位置：

cpp

 代码解读

复制代码

`unordered_map<int, int> visited; class Solution { public:     vector<int> twoSum(vector<int>& nums, int target) {         for (int i = 0; i < nums.size(); ++i) {             if (visited.count(target - nums[i])) {                 return {visited[target - nums[i]], i};             }             visited[nums[i]] = i;         }         return {};     } };`

题目默认的测试用例是 ： ​

> \[2,7,11,15\]
> 
> 9

点击「执行代码」—— OK，没问题，输出和预期结果一致。 ​

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8df2c248208a481d9166282b2fa07e03~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) ​

那就点击「提交」呗 —— 出现了「解答错误」！ ​

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5dee0798b0ee45328828f3f1a570c180~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) ​

出错的测试用例是：

> \[3,3\]
> 
> 6

然鹅，我看自己的代码应该没问题呢。所以我把这个测试用例放到测试用例的执行框里，点击「执行代码」，结果是 `[0, 1]` ！和预期结果是一样的！ ​

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab554267a3d0477fa9a454eec2f1d5bb~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

这到底是怎么回事呢？是力扣有 Bug 吗？ ​

原因
==

其实不是力扣有 Bug，是我们没有理解力扣的评测机制。 ​

> 力扣的判题机在读取您的代码后，对每个测试用例，都会初始化一次类，但全局变量和类内静态变量需要您手动初始化。

**你可以把力扣的评测过程想象成下面这样：** ​

cpp

 代码解读

复制代码

`unordered_map<int, int> visited; class Solution { public:     vector<int> twoSum(vector<int>& nums, int target) {         // 你的代码     } }; int main() {     string line;     while (getline(cin, line)) {         // 读取输入的 nums         vector<int> nums = stringToIntegerVector(line);         // 读取输入的 target         getline(cin, line);         int target = stringToInteger(line);                  // 每次实例化一个 Solution()，并执行其 twoSum 方法         vector<int> ret = Solution().twoSum(nums, target); 		         // 输出结果         string out = integerVectorToString(ret);         cout << out << endl;     }     return 0; }`

看到了吗？ ​

*   对于每个测试用例，力扣会实例化一个 `Solution()`，并执行其 `twoSum` 方法
*   如果把 `visited` 放在了类 `Solution` 的外边，作为「全局变量」，那么对于所有测试用例是共享的。**因此上一个测试用例的运行结果会影响下一个测试用例，导致「解答错误」。**
*   把「解答错误」的测试用例放到「测试用例」框里，再运行的结果是对的，因为只运行了一个测试用例，不会互相干扰。

正确做法
====

为了避免「全局变量」或者「类内的静态变量」在不同测试用例之间的干扰，我们有两种办法：

1.  **推荐做法**：不使用「全局变量」或者「类内的静态变量」；
2.  在 类内/函数内 对「全局变量」或者「类内的静态变量」执行初始化。

比方说，我们把 `visited` 的位置调整到 **类内/函数内** ，从而避免了「全局变量」。

cpp

 代码解读

复制代码

`class Solution { private:     // 类内     unordered_map<int, int> visited; public:     vector<int> twoSum(vector<int>& nums, int target) {         // 函数内         // unordered_map<int, int> visited;         for (int i = 0; i < nums.size(); ++i) {             if (visited.count(target - nums[i])) {                 return {visited[target - nums[i]], i};             }             visited[nums[i]] = i;         }         return {};     } };`

或者在函数内初始化 `visited`，比如在 `twoSum()` 方法中执行 `visited.clear()`。

cpp

 代码解读

复制代码

`unordered_map<int, int> visited; class Solution { public:     vector<int> twoSum(vector<int>& nums, int target) {         visited.clear();         for (int i = 0; i < nums.size(); ++i) {             if (visited.count(target - nums[i])) {                 return {visited[target - nums[i]], i};             }             visited[nums[i]] = i;         }         return {};     } };`

上面写法中，**我最推荐把 `visited` 变量写到 `twoSum` 以内。** ​

为什么呢？ ​

这样符合「**最小作用域原则**」。 ​

> 最小作用域原则是指：把每个变量定义成只对需要看到它的、最小范围的代码段可见。

这样能规避很多意想不到的错误。

总结
==

在刷题的时候，应尽量避免使用「全局变量」或者「类内的静态变量」，因为它们可能导致不同「测试用例」互相干扰，导致「解答错误」。 ​

定义变量应遵循「最小作用域原则」，能规避很多意想不到的错误。 ​

明白了 LeetCode（力扣）的评测机制之后，能让我们刷题不糊涂👨‍💻👩‍💻 ​

参考：

1.  [support.leetcode-cn.com/hc/kb/artic…](https://link.juejin.cn?target=https%3A%2F%2Fsupport.leetcode-cn.com%2Fhc%2Fkb%2Farticle%2F1194344%2F "https://support.leetcode-cn.com/hc/kb/article/1194344/")
2.  [www.ituring.com.cn/article/216…](https://link.juejin.cn?target=https%3A%2F%2Fwww.ituring.com.cn%2Farticle%2F216213 "https://www.ituring.com.cn/article/216213")