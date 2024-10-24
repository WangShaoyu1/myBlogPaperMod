---
author: "字节跳动技术团队"
title: "AutoML - Hyperparameter Optimization"
date: 2022-11-15
description: "AutoML 目的是将模型结构和参数的搜索从手工变为自动化方法，降低机器学习专家的计算资源成本，提升公司进行机器学习应用的能力。本文从易用性和加深对业务数据理解两方面进行分享。"
tags: ["机器学习","算法中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读10分钟"
weight: 1
selfDefined:"likes:13,comments:0,collects:6,views:5453,"
---
> 我们来自字节跳动飞书商业应用研发部(Lark Business Applications)，目前我们在北京、深圳、上海、武汉、杭州、成都、广州、三亚都设立了办公区域。我们关注的产品领域主要在企业经验管理软件上，包括飞书 OKR、飞书绩效、飞书招聘、飞书人事等 HCM 领域系统，也包括飞书审批、OA、法务、财务、采购、差旅与报销等系统。欢迎各位加入我们。
> 
> 本文作者：飞书商业应用研发部 魏一

> 欢迎大家关注[**飞书技术**](https://juejin.cn/user/712139266595784 "https://juejin.cn/user/712139266595784")，每周定期更新飞书技术团队技术干货内容，想看什么内容，欢迎大家评论区留言~

为什么使用 Hyperparameter Optimization
=================================

自动化机器学习系统的各个部件，让机器学习的规模依赖于计算资源而不是专业人力。

AutoML 的目的是将模型结构和参数的搜索从手工方法变成自动化方法。其意义在于，让公司进行机器学习的能力，规模从依赖机器学习专家转化为依赖计算资源。因为长久的看来计算资源的成本比机器学习专家要低，因此 AutoML 会总体大大增加公司进行机器学习应用的能力。

![](/images/jueJin/15a39190ec144f9.png)

[AutoML Tables](https://link.juejin.cn?target=https%3A%2F%2Fcloud.google.com%2Fautoml-tables%2Fdocs%3Fhl%3Dzh-cn "https://cloud.google.com/automl-tables/docs?hl=zh-cn")

![](/images/jueJin/1c5bb95126d347e.png)

自动化不一定取代人工，也可以助力人工。

AutoML 主要用于自动的进行模型的优化，模型优化可以分为两个部分：

1.  特征的选择
2.  表现的优化
    *   超参数优化「Hyperparameter Optimization, HPO」
    *   网络结构搜索「Neural Architecture Search, NAS」
3.  性能的优化

主要包括是提升模型的性能，比如**剪枝「Pruning」和量化「Quantization」**。

易于使用
----

*   中心节点：负责收集和汇总训练的结果，分发需要尝试的超参数
*   计算节点：负责使用中心节点传来的超参数，运行训练脚本，返回训练结果

![](/images/jueJin/df2fdffb19f54de.png)

训练脚本满足两个基本需求：

1.  需要调优的超参数可以从配置里面读入
2.  能够返回训练的结果「类似于callback」

model.py

```Python
params = {'features': 512,'lr': 0.001,'momentum': 0}

optimized_params = get_next_parameter()
params.update(optimized_params)

...

class NeuralNetwork(nn.Module):
...

for t in range(epochs):
train(...)

accuracy = test(...)
report_result(accuracy)
```

main.py

```Python
    search_space = {
    'features': {'_type': 'choice', '_value': [128, 256, 512, 1024]},
    'lr': {'_type': 'loguniform', '_value': [0.0001, 0.1]},
'momentum': {'_type': 'uniform', '_value': [0, 1]}
}

experiment = Experiment(trial_command='python3 model.py',
search_space=search_space)
experiment.run(8080)
```

* * *

常见的搜索空间

*   候选集
    *   数值型，比如embedding size 从 4，8， 16， 32，64中选取
    *   枚举型，比如不同的优化器
*   实数性
    *   从区间内，根据不同的分布选取一个随机实/整数，比如uniform、loguniform ……

HPO迭代思路
-------

*   专业知识 - 大量尝试 - 提升效率 - 加速迭代效率
    *   择优更新 - 选择更优的策略进行变换
        *   利用现有数据进行预测

* * *

传统的通用方法
=======

Batch
-----

给出几组比较有潜力的参数。把这些参数都去尝试一下，就是最简单的batch方法。

最简单的方式进行超参数选择，同时可以并行，但需要最多的先验知识。

![image.png](/images/jueJin/c2edffbcb7784f7.png)

Anneal
------

设置一个先验的概率，然后根据这个概率去抽取一个参数组合。

注意：要保证当前表现好的参数组合有比较大的概率被抽到。

  

例如：使用几何分布选取下一轮迭代的基础参数组合

先验的概率：为 1 / 第k好的实验下标 「注：下标按照表现排序，最好的在最前面」

```Python
rng = np.random.RandomState(seed)
good_idx = rng.geometric(1.0 / avg_best_idx), size=size) - 1
```

超参数随着实验的进行，可选的范围逐渐缩小

例如在区间内随机选取 U(l, h)，当前较优参数的值为 x，那么下一次选取时的范围变为：

U(x - w/2, x + w/2)，其中 w = W / (1 + T \* shrink\_coef)

T：当前已完成的trail数量

shrink\_coef：大于0小于1的常数

Evolution
---------

方法1:

*   竞赛模式：从现有的数据中两两进行随机组合，在每组效果好的参数上进行随机变化，去重，获得新的参数

方法2:

*   自然界中：
    *   表现优异的个体往往更加容易留下后代。Aging evolution算法通过采样形成一个候选集，选择候选集中准确率最高的参数组合进行繁衍，以此模拟这个过程
    *   年轻的个体相比于年老的个体一般具有更好的潜能，更有可能留下后代。Aging evolution算法每次会去除种群中一个最老的个体，并加入一个新个体，以此模拟这个过程
    *   后代往往会遗传父母的一些特征，并在此基础上进行变异。

![](/images/jueJin/ad4204a1d1f540a.png)

Hyperband
---------

哪些因素造成了训练时长的变化？

*   训练轮数
*   样本数量
*   特征数量
*   ……

将这些限制因素考虑为预算，通过合理的预算在无/有限分配的超参数组合上分配，获得最大的收益「模型表现最好」

\=> 将超参数调优的问题变为无限臂老虎机上进行非随机地探索的过程

![image.png](/images/jueJin/5d1bca33c6eb4b8.png)

![](/images/jueJin/7a32169d11f0477.png)

基本的思路：Early-stop 尽早的结束潜力不大的参数组合的训练，但是：

![](/images/jueJin/337a9bbe32d644d.png)

设计一个预算限制，根据不同的预算限制和需要探索的参数的组合，分配给每个组合一定的资源：

*   B：总预算「上面提到的三个限制因素」
*   R：每次迭代的资源数量
*   S：需要进行的迭代数量「每次迭代包含多次尝试」
*   η： Successive Halving 中被保留的超参数组合的比例

![](/images/jueJin/42f81f0586194ca.png)

实例：

![](/images/jueJin/44934f1179b3498.png)

##### Median Stop

无需模型、适用范围广

在第s步，如果实验t至今最优的结果差于第0到t-1次实验「之前所有」在第s步时的平均值的中位数，那么则停止当前实验的训练。

平均值的计算：

![](/images/jueJin/36cbfe95c0bc4b7.png)

第s步：一般不从取前几步的结果，就像之前图所示，前期结果的置信度不高，过早结束可能会错过最优解。「需要一个warm-up的过程」

```Python
_completed_avg_history = defaultdict(list)

for trial_job_id in trial_job_ids:
cnt, history_sum = 0, 0
for each in _running_history[trial_job_id]:
cnt += 1
history_sum += each
s_completed_avg_history[trial_job_id].append(history_sum / cnt)
# 记录 O[1:s, T]
……

avg_array = []  # 第0到t-1次实验「之前所有」在第s步时的平均值
for id_ in _completed_avg_history:
if len(_completed_avg_history[id_]) >= curr_step:
avg_array.append(_completed_avg_history[id_][curr_step - 1])

median = avg_array[(len(avg_array)-1) // 2]
improved = False if best_history < median else True
```

* * *

❗️没有充分的考虑和利用历史信息

![UML 图.jpg](/images/jueJin/f900f9992cea46e.png)

利用全局信息更充分的探索潜力较大的区域

* * *

TPE
---

Tree-structured Parzen Estimator Approach属于 Sequential Model-Based Global Optimization 「SMBO」

![](/images/jueJin/eda7835465c5414.png)

这里的Tree表示什么：超参数是一个个进行优化的，tree指的是一种层级结构。也就是说超参数组成了一个树形结构。

在超参数的选取时，我们希望新的超参数能够带来最大的收益。因此定义： Expected Improvement 「EI」

![](/images/jueJin/df59e1737d10482.png)

![image.png](/images/jueJin/c44c03a8ad37429.png)

结合起来，

![](/images/jueJin/8e8b705d72dd4d9.png)

也就是说对于给定的历史数据，希望最小化 g(x) / l(x)。

![UML 图 (1).jpg](/images/jueJin/41135545dd4b4a2.png)

```Python
rng = np.random.default_rng(seed)

below, above = split_history(param_history)  # split history into good ones and bad ones

counts: List[int] = np.bincount(below)
p = (counts + prior_weight) / sum(counts + prior_weight) # add k smoothing
samples = rng.choice(size, 20, p=p)
below_llik = np.log(p[samples])  # the probablity of these samples to be good (llik means log-likelyhood)

counts: List[int] = np.bincount(above)
p = (counts + prior_weight) / sum(counts + prior_weight)
above_llik = np.log(p[samples])  # the probablity of above samples to be bad

best = samples[np.argmax(below_llik - above_llik)]  # which one has best probability to be good
```

❗️TPE在进行超参数选择的时候考虑到了历史信息，但没有考虑到部分超参数的关联性

GP
--

Gaussian Processes：相似的输入应该有相似的输出

假设有数据 D = {(x1, f1), {x2, f2}, {x3, f3}}，目标是获得 f(x)。假设数据来自 N ～ (0, K)

![](/images/jueJin/f79ba99e8d2c4c5.png)

如果现在有一个新输入 x\* _，_ 假设 x\* 和现有的数据来自同一个分布，为了确保f_和之前的数据具有关联，所以将已有的f和f_共同构成一个新的高斯分布。

![image.png](/images/jueJin/69bcf51e16494a4.png)

如果已有高斯分布，那个可以计算 µ1|2 和 Σ1|2

![image.png](/images/jueJin/199893517fbc467.png)

因此可以计算出x_对应f_的均值和方差

![image.png](/images/jueJin/5f342951d8b44c6.png)

实例：

![](/images/jueJin/db0e6a60229d41f.png)

如何进行预测？未知点x的预测值f有更大的概率大于当前最优的f+。

![](/images/jueJin/194d2efa0832474.png)

GP和其他的贝叶斯优化「Bayesian Optimization」方法提供了一个更优的超参数选取方案。BOHB「Bayesian Optimization Hyperband」将贝叶斯优化和Hyperband结合起来。整体框架还是和Hyperband保持一致，但每轮优化开始时使用贝叶斯优化替换随机，根据上轮迭代的结果，选择更优的可尝试参数组合。

SMAC
----

**S**equential **M**odel-Based Optimization for General **A**lgorithm **C**onfiguration

高斯过程更适合与处理超参数空间为连续或数值类型的情况。但经常会出现离散「例如选择优化器」，甚至条件关系「例如与优化器相关特有的超参数」的超参数。

GP可以通过设计巧妙的方法解决这个问题「比如设计特定的核函数」，但解决起来并不自然。

需要的是 预测值 + 不确定性 并且模型不能过于复杂。 —— 随机森林

  

同样数据集为：{(x\_1, f(x\_1)), (x\_2, f(x\_2)), ..., (x\_n, f(x\_n))}

这里的x\_n是模型的超参数，而f(x\_n)是在该模型超参数配置下，在某个固定的数据集上的表现

![](/images/jueJin/cef4fdd2013e4f8.png)

通过建立一个随机森林模型去拟合f；该过程可以类比高斯回归过程中n个点所构成的多维正态分布。

对于新加入的点x，在随机森林的每个树上有一个预测结果，把所有树的预测结果求平均即得到均值，预测结果求标准差即为标准差。

在高斯回归过程中，对于新加入的点x与之前的点构成新的多维正态分布，然后求解新加入点的边际分布即可得到新加入的点的均值与标准差。

在对新的超参数组合进行搜索的时候，会同时在已经表现比较好的超参数组合附近进行搜索，和随机选取点进行预测。

DNGO
----

Deep Networks for Global Optimization

使用DNN替换随机森林。

需要能够获得 预测值 + 不确定性，DNN如何实现？

\=》 MLP + Bayesian Linear Regression

  

*   MLP部分

通过历史数据进行训练，预测目标是超参数对应的结果。但在预测时使用最后一层的输出作为basis function，用作Bayesian Linear Regression的输入。

```Python
class Net(nn.Module):
def __init__(self, n_inputs, n_units=[50, 50, 50]):
super(Net, self).__init__()
self.fc1 = nn.Linear(n_inputs, n_units[0])
self.fc2 = nn.Linear(n_units[0], n_units[1])
self.fc3 = nn.Linear(n_units[1], n_units[2])
self.out = nn.Linear(n_units[2], 1)

def forward(self, x):
x = torch.tanh(self.fc1(x))
x = torch.tanh(self.fc2(x))
x = torch.tanh(self.fc3(x))

return self.out(x)

def basis_funcs(self, x):
x = torch.tanh(self.fc1(x))
x = torch.tanh(self.fc2(x))
x = torch.tanh(self.fc3(x))
return x
```  

*   Bayesian Linear Regression

根据MLP得到的basis function进行预测，返回均值和方差。

预测方法：Gibbs Sampling

例如想要获得位置的f(x, y)「联合分布」，假设是高斯分布：

![image.png](/images/jueJin/d3e6fcd1c48747b.png)

一个很简单的例子：

Data：{(x1, y1), ..., (xn, yn)}

参数为：β0 (the intercept), β1 (the gradient) and precision τ

![image.png](/images/jueJin/f95ea4d8e40a478.png)

假设参数的先验分布为：

![](/images/jueJin/6e8a48a8bfb244a.png)

经过一系列的推导，可以得到：

![](/images/jueJin/f3049e4458a046b.png)

![](/images/jueJin/004f02ea261446b.png)

![](/images/jueJin/cf5c0a1c5436448.png)

```Python
def gibbs(y, x):
iters = 1000

init = {"beta_0": 0,"beta_1": 0,"tau": 2}  # specify hyper parameters     hypers = {"mu_0": 0,"tau_0": 1,"mu_1": 0,"tau_1": 1,"alpha": 2,"beta": 1}

beta_0 = init["beta_0"]
beta_1 = init["beta_1"]
tau = init["tau"]

sample_weight = np.zeros((iters, 3))  # trace to store values of beta_0, beta_1, tau

for it in range(iters):
beta_0 = sample_beta_0(y, x, beta_1, tau, hypers["mu_0"], hypers["tau_0"])
beta_1 = sample_beta_1(y, x, beta_0, tau, hypers["mu_1"], hypers["tau_1"])
tau = sample_tau(y, x, beta_0, beta_1, hypers["alpha"], hypers["beta"])
sample_weight[it, :] = np.array((beta_0, beta_1, tau))

return sample_weight


weights = sample_weight(y, x, iters, init, hypers)

predictions = [w[0] + w[1]*x_test + w[2] for w in weights]
```

![](/images/jueJin/15b95487848b442.png)

神经网络自身也有超参数，最终的选取通过使用多个数据集，利用GP选择最优的超参数。

相比于随机森林，模型更为复杂，文中提供的结果显示效果优于SMAC，性能优于GP。

深度学习适用的方法
=========

深度学习超参数/结构的搜索面临的两大主要问题

1.  训练耗时
2.  可搜索组合多

Evolution
---------

PBT

全称：Population Based Training

结合最优探索和并行尝试，在训练的过程中不断的进行模型的评估和排序。如果排名较低，则将被替换「用表现好的模型结果和超参数」，在此基础上进行探索。

![](/images/jueJin/c65b5e506866457.png)

![](/images/jueJin/ef7a330e89a441a.png)

Reinforcement Learning
----------------------

RNN + RL

![](/images/jueJin/775137a71855410.png)

![](/images/jueJin/b6f7ae8569d142f.png)

结果好，但耗时很长。

Differentiable Architecture Search
----------------------------------

![image.png](/images/jueJin/cdb8fd3dc3ac4da.png)

实例：embedding size搜索
-------------------

1.  对每个模型结构选择的地方，建立一个mixed operation。这个mixed operation有参数a，作为权重。模型本身的参数我们设置为w
2.  当模型还没有收敛时，做：
    *   更新mixed operation的模型结构参数a。在模型的每个mixed operation当中sample一个op。对于sample的ops, 本来模型的loss如果记为 L(op1, op2, ... opn)，则我们计算一个L(op1 \* a1', op2 \* a2' ..., opn \* an'），其中ai'是a在opi上被选择的那个权重值
    *   在模型的每个mixed operation当中sample一个op，对模型本身的参数w做gradient descent。

![](/images/jueJin/bb5e820f9ee04db.png)

总结
==

1.  易于使用，提升效率；
2.  加深对业务数据的理解。

Reference
=========

*   [AutoML For Lite模型 Design Doc](https://link.juejin.cn?target=https%3A%2F%2Fbytedance.us.feishu.cn%2Fdocs%2FdoccnTyIz0HQyIOILOISylTPVkb "https://bytedance.us.feishu.cn/docs/doccnTyIz0HQyIOILOISylTPVkb")
*   [bytedance.feishu.cn/minutes/obc…](https://bytedance.feishu.cn/minutes/obcna441t7lfj99f11uezlpi "https://bytedance.feishu.cn/minutes/obcna441t7lfj99f11uezlpi")
*   [www.jmlr.org/papers/volu…](https://link.juejin.cn?target=https%3A%2F%2Fwww.jmlr.org%2Fpapers%2Fvolume13%2Fbergstra12a%2Fbergstra12a.pdf "https://www.jmlr.org/papers/volume13/bergstra12a/bergstra12a.pdf")
*   [arxiv.org/pdf/1703.01…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fpdf%2F1703.01041.pdf "https://arxiv.org/pdf/1703.01041.pdf")
*   [arxiv.org/pdf/1711.09…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fpdf%2F1711.09846v1.pdf "https://arxiv.org/pdf/1711.09846v1.pdf")
*   [arxiv.org/pdf/1603.06…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fpdf%2F1603.06560.pdf "https://arxiv.org/pdf/1603.06560.pdf")
*   [arxiv.org/pdf/1802.01…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fpdf%2F1802.01548.pdf "https://arxiv.org/pdf/1802.01548.pdf")
*   [proceedings.neurips.cc/paper/2011/…](https://link.juejin.cn?target=https%3A%2F%2Fproceedings.neurips.cc%2Fpaper%2F2011%2Ffile%2F86e8f7ab32cfd12577bc2619bc635690-Paper.pdf "https://proceedings.neurips.cc/paper/2011/file/86e8f7ab32cfd12577bc2619bc635690-Paper.pdf")
*   [papers.nips.cc/paper/4443-…](https://link.juejin.cn?target=https%3A%2F%2Fpapers.nips.cc%2Fpaper%2F4443-algorithms-for-hyper-parameter-optimization.pdf "https://papers.nips.cc/paper/4443-algorithms-for-hyper-parameter-optimization.pdf")
*   [arxiv.org/abs/1807.01…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fabs%2F1807.01774 "https://arxiv.org/abs/1807.01774")
*   [www.microsoft.com/en-us/resea…](https://link.juejin.cn?target=https%3A%2F%2Fwww.microsoft.com%2Fen-us%2Fresearch%2Fpublication%2Fmetis-robustly-tuning-tail-latencies-cloud-systems%2F "https://www.microsoft.com/en-us/research/publication/metis-robustly-tuning-tail-latencies-cloud-systems/")
*   [www.cs.ubc.ca/~hutter/pap…](https://link.juejin.cn?target=https%3A%2F%2Fwww.cs.ubc.ca%2F~hutter%2Fpapers%2F10-TR-SMAC.pdf "https://www.cs.ubc.ca/~hutter/papers/10-TR-SMAC.pdf")
*   [arxiv.org/pdf/1502.05…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fpdf%2F1502.05700.pdf "https://arxiv.org/pdf/1502.05700.pdf")
*   [arxiv.org/pdf/1211.09…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fpdf%2F1211.0906.pdf "https://arxiv.org/pdf/1211.0906.pdf")
*   [static.googleusercontent.com/media/resea…](https://link.juejin.cn?target=https%3A%2F%2Fstatic.googleusercontent.com%2Fmedia%2Fresearch.google.com%2Fen%2F%2Fpubs%2Farchive%2F46180.pdf "https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/46180.pdf")
*   [arxiv.org/abs/1611.01…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fabs%2F1611.01578 "https://arxiv.org/abs/1611.01578")
*   [arxiv.org/abs/1812.03…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fabs%2F1812.03443 "https://arxiv.org/abs/1812.03443")
*   [arxiv.org/abs/1812.09…](https://link.juejin.cn?target=https%3A%2F%2Farxiv.org%2Fabs%2F1812.09926 "https://arxiv.org/abs/1812.09926")
*   [Embedding Size Tuning using SparseNAS Design Doc V2](https://bytedance.feishu.cn/wiki/wikcn4icsvgFD4VOwfeQOAq3ZEb "https://bytedance.feishu.cn/wiki/wikcn4icsvgFD4VOwfeQOAq3ZEb")

**加入我们**
========

扫码发现职位&投递简历

![](/images/jueJin/8a605793d3d94be.png)

官网投递：[job.toutiao.com/s/FyL7DRg](https://link.juejin.cn/?target=https%3A%2F%2Fjob.toutiao.com%2Fs%2FFyL7DRg "https://link.juejin.cn/?target=https%3A%2F%2Fjob.toutiao.com%2Fs%2FFyL7DRg")