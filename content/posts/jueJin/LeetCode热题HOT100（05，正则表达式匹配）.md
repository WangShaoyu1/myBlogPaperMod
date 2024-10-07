---
author: "Taoye"
title: "LeetCode热题HOT100（05，正则表达式匹配）"
date: 2020-11-11
description: "不够优秀，发量尚多，千锤百炼，方可成佛。算法的重要性不言而喻，无论你是研究者，还是最近比较火热的IT打工人，都理应需要一定的算法能力，这也是面试的必备环节，算法功底的展示往往能让面试官眼前一亮，这也是在大多数竞争者中脱颖而出的重要影响因素。然而往往大多数人比较注重自身的实…"
tags: ["算法"]
ShowReadingTime: "阅读7分钟"
weight: 681
---
LeetCode 热题 HOT 100（05，正则表达式匹配）
-------------------------------

不够优秀，发量尚多，千锤百炼，方可成佛。

算法的重要性不言而喻，无论你是研究者，还是最近比较火热的IT **打工人**，都理应需要一定的算法能力，这也是面试的必备环节，算法功底的展示往往能让面试官眼前一亮，这也是在大多数竞争者中脱颖而出的重要影响因素。

然而往往大多数人比较注重自身的实操能力，着重于对功能的实现，却忽视了对算法能力的提高。有的时候采用不同的算法来解决同一个问题，运行效率相差还是挺大的，毕竟我们最终还是需要站在客户的角度思考问题嘛，能给用户带来更加极致的体验当然再好不过了。

万法皆空，因果不空。Taoye之前也不怎么情愿花费太多的时间放在算法上，算法功底也是相当的薄弱。这不，进入到了一个新的学习阶段，面对导师的各种“严刑拷打”和与身边人的对比，才开始意识到自己“菜”的事实。

这次的题目是LeeTCode 热题 HOT 100的第六题，难度属于**困难**，主要考查的是正则匹配问题。

感觉这道题还是有点东西的，也是花费了不少时间才搞懂。

我们都知道正则表达式主要用来进行字符匹配的，在爬虫中，我们会在向服务器发出一个请求并得到相应结果之后，通过特定的方式在响应结果中提取我们所需要的目标数据，而其中一种方式就可以通过正则表表达式来进行解析。

这道题的难度还是有点的，让我更加体会到了算法“孰能生巧”这一特性，这就像刷数学题一样，题目见过就有思路，没见过根本完全无法动手。这道题也是一样，主要可以通过动态规划算法来进行求解，当然也有其他可供用的算法，本文主要使用的是动态规划算法。

下面，我们就来看看这道题吧。

### **题目：正则表达式匹配**

给你一个字符串 s 和一个字符规律 p，请你来实现一个支持 '.' 和 '\*' 的正则表达式匹配。

*   '.' 匹配任意单个字符
*   '\*' 匹配零个或多个前面的那一个元素 所谓匹配，是要涵盖 整个 字符串 s的，而不是部分字符串。

来源：力扣（LeetCode） 链接：[leetcode-cn.com/problems/re…](https://link.juejin.cn?target=https%3A%2F%2Fleetcode-cn.com%2Fproblems%2Fregular-expression-matching "https://leetcode-cn.com/problems/regular-expression-matching")

### **示例**

*   示例1

输入：s = "aa" p = "a" 输出：false 解释："a" 无法匹配 "aa" 整个字符串。

*   示例2

输入：s = "aa" p = "a\*" 输出：true 解释：因为 '\*' 代表可以匹配零个或多个前面的那一个元素, 在这里前面的元素就是 'a'。因此，字符串 "aa" 可被视为 'a' 重复了一次。

*   示例3

输入：s = "ab" p = "._" 输出：true 解释："._" 表示可匹配零个或多个（'\*'）任意字符（'.'）。

*   示例4

输入：s = "aab" p = "c_a_b" 输出：true 解释：因为 '\*' 表示零个或多个，这里 'c' 为 0 个, 'a' 被重复一次。因此可以匹配字符串 "aab"。

*   示例5

输入：s = "mississippi" p = "mis_is_p\*." 输出：false

### **思路**

前面也提到了，爬虫中会经常会使用到正则表达式，既然如此，肯定是有特定的模块可供调用的，而我们可以通过`re`模块来实现这一功能：

python

 代码解读

复制代码

`class Solution(object):     def isMatch(self, s, p):         return True if re.match(p+'$',s) else False`

需求虽已实现，但显然我们需要手动来实现这一功能，而非调用第三方模块。

在正式通过动态规划解决该题之前，我们有必要先了解下动态规划，其能解决哪些问题。

*   计数问题，比如在一个矩阵当中，**有多少种方式**能从左上角走到右下角。（每次行走方向只能往下或往右）
*   求最值问题，比如有三种硬币，面值分别是2元、3元、7元，则27元**最少**能用多少枚硬币组成
*   存在性问题，比如说我们的这道题，**是否能够**在目标字符串中匹配成功

当然了，我们肯定是不能一概而论的。具体问题，具体分析，还是要根据实际情况来判断目标问题是否能够通过动态规划来解决。

要在问题中使用动态规划，我们一般需要四个步骤：

1.  确定状态（最后一步、化为子问题）。解动态规划时需要定义一个数组，而确定状态就是要明白数组的每个元素dp\[i\]或者dp\[i\]\[j\]代表什么意思（读到这里，可能会有点糊涂，没事，下面会有示例来具体解释）
2.  转移方程，就是通过上一步骤当中的子问题来得到目标问题的子问题
3.  初始条件和边界情况，动态规划一般是通过前一个节点来获取下一节点的值，所以我们需要明确其初始条件和数组dp的边界条件。就像数学归纳法，或是数列当中递推公式。
4.  计算顺序，就是明确实现需求之前的上一个步骤要获得什么

**读到这里，可能会有点糊涂，没事，下面会用示例来具体解释：**

**示例1：**有三种硬币，面值分别是2元、3元、7元，则27元**最少**能用多少枚硬币组成

确定状态（最后一步、化为子问题）：我们知道，题目需要的是**最少**能用多少枚硬币组成，我们需要定义一个长度为27的数组dp，而dp\[i\]就代表了对应总额所需要的最少硬币数目。我们假设最后一枚硬币面值为aka\_kak​，且最少需要kkk枚硬币组成，则除去最后一枚硬币的总值为27−ak27-a\_k27−ak​，且前面k−1k-1k−1枚硬币的枚数所组成的面值也应该是最少的。所以，我们把原问题就转化为了子问题：最少可以通过多少枚硬币组成27−ak27-a\_k27−ak​元（k−1k-1k−1枚）

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a34e9a3a31b476da37cfa908c14a11a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

转移方程：通过如上分析，我们可以得到如下递推公式（转移方程），代表的意思就是除去最后一枚硬币的面值总额所需要的最少硬币数 + 1

f(x)\=min{f(x−2),f(x−5),f(x−7)}+1f(x) = min\\{f(x-2), f(x-5), f(x-7)\\} + 1f(x)\=min{f(x−2),f(x−5),f(x−7)}+1

初始条件和边界情况：初始条件就是f(0)，表示的就是0元可以通过0枚硬币组成，而边界情况就是每当面值总额减2、5、7的时候都应该大于0，否则的话无法组成目标面额总值（根据题意自行理解）

计算顺序：要想获得f(x)，就必须得到f(x-2)、f(x-5)、f(x-7)的值，也就是除去一枚硬币面额所需要的最少硬币数目

通过如上分析，可以得到如下Java算法;

ini

 代码解读

复制代码

`public int coinChange(int[] coin_list, int coin_value) {     int[] f = new int[coin_value + 1];     f[0] = 0;     for (int i = 1; i <= coin_value; i++) {         f[i] = Integer.MAX_VALUE;         for (int j = 0; j < coin_list.length; j++) {             if (i >= coin_list[j] && f[i - coin_list[j]] != Integer.MAX_VALUE) {                 f[i] = Math.min(f[i], f[i - coin_list[j]] + 1);             }         }     }     if (f[coin_value] == Integer.MAX_VALUE) { f[coin_value] = -1; }     return f[coin_value]; }`

\*\*示例2：\*\*在一个矩阵当中，**有多少种方式**能从左上角走到右下角。（每次行走方向只能往下或往右），比如从(0, 0)出发，有多少种路线走到(4, 5)

时间关系，这里简单分析下。

走到(4, 5)的上一格有两种，一个是(3, 5)，另一个是(4, 4)，所以走到(4, 5)的路线总数就等于上述两种的总和，对此，我们可以得到如下关系，其中f\[i\]\[j\]表示的是走到(i, j)的路线种数

f\[i\]\[j\]\=f\[i−1\]\[j\]+f\[i\]\[j−1\]f\[i\]\[j\] = f\[i-1\]\[j\] + f\[i\]\[j-1\]f\[i\]\[j\]\=f\[i−1\]\[j\]+f\[i\]\[j−1\]

Python实现的代码如下：

ini

 代码解读

复制代码

`def calc_run_number(m, n):     import numpy as np     f = np.zeros([m, n])     for i in range(m):         for j in range(n):             if (i ==0 or j == 0): f[i][j] = 1             else: f[i, j] = f[i-1][j] + f[i][j-1]     return f[m-1][n-1`

像类似的案例其实还有很多的，主要还是要多多联系才行。

现在，我们回归到正则匹配这道题，再次看下题面：

> 给你一个字符串 s 和一个字符规律 p，请你来实现一个支持 '.' 和 '\*' 的正则表达式匹配。 . 匹配任意单个字符

*   匹配零个或多个前面的那一个元素 所谓匹配，是要涵盖 整个 字符串 s的，而不是部分字符串。

前面也有说到，使用动态规划之前需要定义一个数组来存储数据状态，这道题中涉及s和p两个字符串，所以我们需要定义二维数组，也就是矩阵dp。假设s和p的长度分别为s\_len和p\_len，则dp数组的shape值应该为(s\_len + 1, p\_len + 1)，其中+1主要是的因为需要额外引入一行一列，用于表示空字符""的匹配情况，这里可以理解成初始值的引入。

**dp\[i\]\[j\]表示的就是s\[:i\]能否通过dp\[:j\]正则表达式来进行匹配，其值为True或False。True表示的是能匹配成功，比如`s:abc p:a.c`，而False表示的是不能匹配，比如`s:abc p:ab*`，这一点一定要理解清楚，非常重要，也是解这道题的关键之一。**

我们需要对dp数组进行初始化，不如通过如下方式将内部所有元素初始化为False:，且`dp[0][0]=True`，因为空字符s自然能用空字符p来进行匹配：

scss

 代码解读

复制代码

`dp = [[False] * (p_len + 1) for temp in range(s_len + 1)]; dp[0][0] = True`

随后，需要将dp第一行进行额外处理，也就是初始状态的定义。这里的有个条件来对`*`进行判断，假如说`*`前面的一个字符存在，则需要将该位置上的dp值定义为与前两个值相同，因为在正则表达式中，`*`表示的是能匹配零个或多个前面的那一个元素（注意：这是在第一行进行定义，也就是说此时s可以看做`""`空字符，通过`p[:j]`正则来对其进行匹配）：

less

 代码解读

复制代码

`for one_row_item in range(p_len):     if p[one_row_item] == '*' and dp[0][one_row_item - 1]:         dp[0][one_row_item + 1] = True`

第一行处理完成，随后就需要对其他行的dp值进行填充，而填充的依据就是根据上一行来进行分类判断：假设遍历条件满足：p\[j - 1\] == s\[i - 1\] or p\[j - 1\] == '.'，也就是说s和p对应的字符相同，或能通过`.`匹配任意字符，则将设置`dp[i][j] = dp[i - 1][j - 1]`，因为此时dp\[i\]\[j\]的匹配情况是由dp\[i-1\]\[j-1\]来决定的；假如说此时的正则字符为`*`，则`dp[i][j]`需要根据`dp[i][j - 2]、dp[i][j - 1]、dp[i - 1][j]`共同决定，完整算法思想如下：

less

 代码解读

复制代码

`class Solution:     def isMatch(self, s: str, p: str) -> bool:         s_len, p_len = len(s), len(p)         dp = [[False] * (p_len + 1) for temp in range(s_len + 1)]; dp[0][0] = True         for one_row_item in range(p_len):             if p[one_row_item] == '*' and dp[0][one_row_item - 1]:                 dp[0][one_row_item + 1] = True         for i in range(1, s_len + 1):             for j in range(1, p_len + 1):                 if p[j - 1] == s[i - 1] or p[j - 1] == '.': dp[i][j] = dp[i - 1][j - 1]                 elif p[j - 1] == '*':                     if p[j - 2] != s[i - 1]: dp[i][j] = dp[i][j - 2]                     if p[j - 2] == s[i - 1] or p[j - 2] == '.':                         dp[i][j] = dp[i][j - 2] or dp[i][j - 1] or dp[i - 1][j]         return dp[s_len][p_len]`

总的来说，这道题还是有难度的，至少是目前刷到最难的一题了，也是花费了不少时间来理解，理解了也很难通过文字来进行描述，主要还是要通过阅读算法代码来理解其核心思想。

像这种通过动态规划算法来解决的问题还是要多做多练，才能孰能生巧。

我是Taoye，爱专研，爱分享，热衷于各种技术，学习之余喜欢下象棋、听音乐、聊动漫，希望借此一亩三分地记录自己的成长过程以及生活点滴，也希望能结实更多志同道合的圈内朋友，更多内容欢迎来访微信公主号：**玩世不恭的Coder**。

**推荐阅读：**

[LeetCode 热题 HOT 100（00，两数之和）](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4NjMyMDM4Mg%3D%3D%26mid%3D2247483915%26idx%3D1%26sn%3De896b873e473b98ae9779e67ba73330f%26chksm%3Debdff19adca8788cd9e397e8f1b65dc72b90f6777863d48246172636bbaa85f325f12c89d48e%26token%3D498842369%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4NjMyMDM4Mg==&mid=2247483915&idx=1&sn=e896b873e473b98ae9779e67ba73330f&chksm=ebdff19adca8788cd9e397e8f1b65dc72b90f6777863d48246172636bbaa85f325f12c89d48e&token=498842369&lang=zh_CN#rd") [LeetCode 热题 HOT 100（01，两数相加）](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4NjMyMDM4Mg%3D%3D%26mid%3D2247483926%26idx%3D1%26sn%3D771f69bc69a2a182b5d4c64d6bdd4f49%26chksm%3Debdff187dca87891882011a7c01d59591466acaa38d8906e0a3535266d26eb12e48c77d10019%26token%3D683403238%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4NjMyMDM4Mg==&mid=2247483926&idx=1&sn=771f69bc69a2a182b5d4c64d6bdd4f49&chksm=ebdff187dca87891882011a7c01d59591466acaa38d8906e0a3535266d26eb12e48c77d10019&token=683403238&lang=zh_CN#rd") [LeetCode 热题 HOT 100（02，无重复字符的最长子串）](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4NjMyMDM4Mg%3D%3D%26mid%3D2247483933%26idx%3D1%26sn%3D1031fef8a07ba7b6f675a8c206703b34%26chksm%3Debdff18cdca8789ad5501a2d457df96871aa39c2413db55d5beb626a0fa508ba02c42a83bd81%26token%3D17952165%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4NjMyMDM4Mg==&mid=2247483933&idx=1&sn=1031fef8a07ba7b6f675a8c206703b34&chksm=ebdff18cdca8789ad5501a2d457df96871aa39c2413db55d5beb626a0fa508ba02c42a83bd81&token=17952165&lang=zh_CN#rd") [LeetCode 热题 HOT 100（03，寻找两个正序数组的中位数）](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4NjMyMDM4Mg%3D%3D%26mid%3D2247483974%26idx%3D1%26sn%3D5729b1a4068c90435884ea5796886bff%26chksm%3Debdff1d7dca878c16a5d7284e38ff1b3a1c167c83e86168b10e1f636435b61cd00ff9454fc8c%26token%3D17952165%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4NjMyMDM4Mg==&mid=2247483974&idx=1&sn=5729b1a4068c90435884ea5796886bff&chksm=ebdff1d7dca878c16a5d7284e38ff1b3a1c167c83e86168b10e1f636435b61cd00ff9454fc8c&token=17952165&lang=zh_CN#rd") [LeetCode 热题 HOT 100（04，最长回文子串））](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4NjMyMDM4Mg%3D%3D%26mid%3D2247483974%26idx%3D2%26sn%3Daa43fc5f8684948506c5c18b6c379c67%26chksm%3Debdff1d7dca878c139511a041141edb666426071e1bb212206669634ec502dcdd805b2f328e8%26token%3D17952165%26lang%3Dzh_CN%23rd "https://mp.weixin.qq.com/s?__biz=MzI4NjMyMDM4Mg==&mid=2247483974&idx=2&sn=aa43fc5f8684948506c5c18b6c379c67&chksm=ebdff1d7dca878c139511a041141edb666426071e1bb212206669634ec502dcdd805b2f328e8&token=17952165&lang=zh_CN#rd")

**参考资料：**

\[1\] LeetCode官方：[leetcode-cn.com/problems/re…](https://link.juejin.cn?target=https%3A%2F%2Fleetcode-cn.com%2Fproblems%2Fregular-expression-matching%2Fsolution%2Fzheng-ze-biao-da-shi-pi-pei-by-leetcode-solution%2F "https://leetcode-cn.com/problems/regular-expression-matching/solution/zheng-ze-biao-da-shi-pi-pei-by-leetcode-solution/")

\[2\] 动态规划算法：[www.bilibili.com/video/BV1xb…](https://link.juejin.cn?target=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1xb411e7ww%3Ffrom%3Dsearch%26seid%3D9800329040911246241 "https://www.bilibili.com/video/BV1xb411e7ww?from=search&seid=9800329040911246241")