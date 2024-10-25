---
author: "华为云开发者联盟"
title: "一文教你在MindSpore中实现A2C算法训练"
date: 2024-06-07
description: "文中的配置定义了 Actor-Critic 算法在 MindSpore 框架中的具体实现，包括 Actor 和 Learner 的设置、策略和网络的参数，以及训练和评估环境的配置。"
tags: ["人工智能","强化学习","算法中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:1,comments:0,collects:0,views:317,"
---
本文分享自华为云社区[《MindSpore A2C 强化学习》](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%2F428508%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs/428508?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")，作者：irrational。

Advantage Actor-Critic (A2C)算法是一个强化学习算法，它结合了策略梯度（Actor）和价值函数（Critic）的方法。A2C算法在许多强化学习任务中表现优越，因为它能够利用价值函数来减少策略梯度的方差，同时直接优化策略。

### A2C算法的核心思想

*   **Actor**：根据当前策略选择动作。
*   **Critic**：评估一个状态-动作对的值（通常是使用状态值函数或动作值函数）。
*   **优势函数（Advantage Function）**：用来衡量某个动作相对于平均水平的好坏，通常定义为A(s,a)=Q(s,a)−V(s)。

### A2C算法的伪代码

以下是A2C算法的伪代码：

```perl
Initialize policy network (actor) π with parameters θ
Initialize value network (critic) V with parameters w
Initialize learning rates α_θ for policy network and α_w for value network

for each episode do
Initialize state s
while state s is not terminal do
# Actor: select action a according to the current policy π(a|s; θ)
a = select_action(s, θ)

# Execute action a in the environment, observe reward r and next state s'
r, s' = environment.step(a)

# Critic: compute the value of the current state V(s; w)
V_s = V(s, w)

# Critic: compute the value of the next state V(s'; w)
V_s_prime = V(s', w)

# Compute the TD error (δ)
δ = r + γ * V_s_prime - V_s

# Critic: update the value network parameters w
w = w + α_w * δ * ∇_w V(s; w)

# Compute the advantage function A(s, a)
A = δ

# Actor: update the policy network parameters θ
θ = θ + α_θ * A * ∇_θ log π(a|s; θ)

# Move to the next state
s = s'
end while
end for

```

### 解释

1.  **初始化**：初始化策略网络（Actor）和价值网络（Critic）的参数，以及它们的学习率。
2.  **循环每个Episode**：在每个Episode开始时，初始化状态。
3.  **选择动作**：根据当前策略从Actor中选择动作。
4.  **执行动作**：在环境中执行动作，并观察奖励和下一个状态。
5.  **计算状态值**：用Critic评估当前状态和下一个状态的值。
6.  **计算TD误差**：计算时序差分误差（Temporal Difference Error），它是当前奖励加上下一个状态的折扣值与当前状态值的差。
7.  **更新Critic**：根据TD误差更新价值网络的参数。
8.  **计算优势函数**：使用TD误差计算优势函数。
9.  **更新Actor**：根据优势函数更新策略网络的参数。
10.  **更新状态**：移动到下一个状态，重复上述步骤，直到Episode结束。

这个伪代码展示了A2C算法的核心步骤，实际实现中可能会有更多细节，如使用折扣因子γ、多个并行环境等。

代码如下：

```ini
import argparse

from mindspore import context
from mindspore import dtype as mstype
from mindspore.communication import init

from mindspore_rl.algorithm.a2c import config
from mindspore_rl.algorithm.a2c.a2c_session import A2CSession
from mindspore_rl.algorithm.a2c.a2c_trainer import A2CTrainer

parser = argparse.ArgumentParser(description="MindSpore Reinforcement A2C")
parser.add_argument("--episode", type=int, default=10000, help="total episode numbers.")
parser.add_argument(
"--device_target",
type=str,
default="CPU",
choices=["CPU", "GPU", "Ascend", "Auto"],
help="Choose a devioptions.device_targece to run the ac example(Default: Auto).",
)
parser.add_argument(
"--precision_mode",
type=str,
default="fp32",
choices=["fp32", "fp16"],
help="Precision mode",
)
parser.add_argument(
"--env_yaml",
type=str,
default="../env_yaml/CartPole-v0.yaml",
help="Choose an environment yaml to update the a2c example(Default: CartPole-v0.yaml).",
)
parser.add_argument(
"--algo_yaml",
type=str,
default=None,
help="Choose an algo yaml to update the a2c example(Default: None).",
)
parser.add_argument(
"--enable_distribute",
type=bool,
default=False,
help="Train in distribute mode (Default: False).",
)
parser.add_argument(
"--worker_num",
type=int,
default=2,
help="Worker num (Default: 2).",
)
options, _ = parser.parse_known_args()
```

首先初始化参数，然后我这里用cpu运行：options.device\_targe = “CPU”

```ini
episode=options.episode
"""Train a2c"""
if options.device_target != "Auto":
context.set_context(device_target=options.device_target)
if context.get_context("device_target") in ["CPU", "GPU"]:
context.set_context(enable_graph_kernel=True)
context.set_context(mode=context.GRAPH_MODE)
compute_type = (
mstype.float32 if options.precision_mode == "fp32" else mstype.float16
)
    config.algorithm_config["policy_and_network"]["params"][
    "compute_type"
    ] = compute_type
    if compute_type == mstype.float16 and options.device_target != "Ascend":
    raise ValueError("Fp16 mode is supported by Ascend backend.")
    is_distribte = options.enable_distribute
    if is_distribte:
    init()
    context.set_context(enable_graph_kernel=False)
    config.deploy_config["worker_num"] = options.worker_num
    a2c_session = A2CSession(options.env_yaml, options.algo_yaml, is_distribte)
```

设置上下文管理器

```python
import sys
import time
from io import StringIO

class RealTimeCaptureAndDisplayOutput(object):
def __init__(self):
self._original_stdout = sys.stdout
self._original_stderr = sys.stderr
self.captured_output = StringIO()

def write(self, text):
self._original_stdout.write(text)  # 实时打印
self.captured_output.write(text)   # 保存到缓冲区

def flush(self):
self._original_stdout.flush()
self.captured_output.flush()

def __enter__(self):
sys.stdout = self
sys.stderr = self
return self

def __exit__(self, exc_type, exc_val, exc_tb):
sys.stdout = self._original_stdout
sys.stderr = self._original_stderr


episode=10
# dqn_session.run(class_type=DQNTrainer, episode=episode)
with RealTimeCaptureAndDisplayOutput() as captured_new:
a2c_session.run(class_type=A2CTrainer, episode=episode)


import re
import matplotlib.pyplot as plt

# 原始输出
raw_output = captured_new.captured_output.getvalue()

# 使用正则表达式从输出中提取loss和rewards
loss_pattern = r"loss=(\d+\.\d+)"
reward_pattern = r"running_reward=(\d+\.\d+)"
loss_values = [float(match.group(1)) for match in re.finditer(loss_pattern, raw_output)]
reward_values = [float(match.group(1)) for match in re.finditer(reward_pattern, raw_output)]

# 绘制loss曲线
plt.plot(loss_values, label='Loss')
plt.xlabel('Episode')
plt.ylabel('Loss')
plt.title('Loss Curve')
plt.legend()
plt.show()

# 绘制reward曲线
plt.plot(reward_values, label='Rewards')
plt.xlabel('Episode')
plt.ylabel('Rewards')
plt.title('Rewards Curve')
plt.legend()
plt.show()

```

展示结果：  
![image.png](/images/jueJin/171746978705644.png)

![image.png](/images/jueJin/171746977848661.png)

下面我将详细解释你提供的 MindSpore A2C 算法训练配置参数的含义：

### Actor 配置

```python
    'actor': {
    'number': 1,
    'type': mindspore_rl.algorithm.a2c.a2c.A2CActor,
        'params': {
        'collect_environment': PyFuncWrapper<
        (_envs): GymEnvironment<>
        >,
        'eval_environment': PyFuncWrapper<
        (_envs): GymEnvironment<>
        >,
        'replay_buffer': None,
        'a2c_net': ActorCriticNet<
        (common): Dense<input_channels=4, output_channels=128, has_bias=True>
        (actor): Dense<input_channels=128, output_channels=2, has_bias=True>
        (critic): Dense<input_channels=128, output_channels=1, has_bias=True>
        (relu): LeakyReLU<>
        >},
        'policies': [],
    'networks': ['a2c_net']
}
```

*   `number`: Actor 的实例数量，这里设置为1，表示使用一个 Actor 实例。
*   `type`: Actor 的类型，这里使用 `mindspore_rl.algorithm.a2c.a2c.A2CActor`。
*   `params`: Actor 的参数配置。
    *   `collect_environment` 和 `eval_environment`: 使用 `PyFuncWrapper` 包装的 `GymEnvironment`，用于数据收集和评估环境。
    *   `replay_buffer`: 设置为 `None`，表示不使用经验回放缓冲区。
    *   `a2c_net`: Actor-Critic 网络，包含一个公共层、一个 Actor 层和一个 Critic 层，以及一个 Leaky ReLU 激活函数。
*   `policies` 和 `networks`: Actor 关联的策略和网络，这里主要是 `a2c_net`。

### Learner 配置

```ini
    'learner': {
    'number': 1,
    'type': mindspore_rl.algorithm.a2c.a2c.A2CLearner,
        'params': {
        'gamma': 0.99,
        'state_space_dim': 4,
        'action_space_dim': 2,
        'a2c_net': ActorCriticNet<
        (common): Dense<input_channels=4, output_channels=128, has_bias=True>
        (actor): Dense<input_channels=128, output_channels=2, has_bias=True>
        (critic): Dense<input_channels=128, output_channels=1, has_bias=True>
        (relu): LeakyReLU<>
        >,
        'a2c_net_train': TrainOneStepCell<
        (network): Loss<
        (a2c_net): ActorCriticNet<
        (common): Dense<input_channels=4, output_channels=128, has_bias=True>
        (actor): Dense<input_channels=128, output_channels=2, has_bias=True>
        (critic): Dense<input_channels=128, output_channels=1, has_bias=True>
        (relu): LeakyReLU<>
        >
        (smoothl1_loss): SmoothL1Loss<>
        >
        (optimizer): Adam<>
        (grad_reducer): Identity<>
        >
        },
    'networks': ['a2c_net_train', 'a2c_net']
}
```

*   `number`: Learner 的实例数量，这里设置为1，表示使用一个 Learner 实例。
*   `type`: Learner 的类型，这里使用 `mindspore_rl.algorithm.a2c.a2c.A2CLearner`。
*   `params`: Learner 的参数配置。
    *   `gamma`: 折扣因子，用于未来奖励的折扣计算。
    *   `state_space_dim`: 状态空间的维度，这里为4。
    *   `action_space_dim`: 动作空间的维度，这里为2。
    *   `a2c_net`: Actor-Critic 网络定义，与 Actor 中相同。
    *   `a2c_net_train`: 用于训练的网络，包含损失函数（SmoothL1Loss）、优化器（Adam）和梯度缩减器（Identity）。
*   `networks`: Learner 关联的网络，包括 `a2c_net_train` 和 `a2c_net`。

### Policy and Network 配置

```go
    'policy_and_network': {
    'type': mindspore_rl.algorithm.a2c.a2c.A2CPolicyAndNetwork,
        'params': {
        'lr': 0.01,
        'state_space_dim': 4,
        'action_space_dim': 2,
        'hidden_size': 128,
        'gamma': 0.99,
        'compute_type': mindspore.float32,
            'environment_config': {
            'id': 'CartPole-v0',
            'entry_point': 'gym.envs.classic_control:CartPoleEnv',
            'reward_threshold': 195.0,
            'nondeterministic': False,
            'max_episode_steps': 200,
            '_kwargs': {},
            '_env_name': 'CartPole'
        }
    }
}
```

*   `type`: 策略和网络的类型，这里使用 `mindspore_rl.algorithm.a2c.a2c.A2CPolicyAndNetwork`。
*   `params`: 策略和网络的参数配置。
    *   `lr`: 学习率，这里为0.01。
    *   `state_space_dim` 和 `action_space_dim`: 状态和动作空间的维度。
    *   `hidden_size`: 隐藏层的大小，这里为128。
    *   `gamma`: 折扣因子。
    *   `compute_type`: 计算类型，这里为 `mindspore.float32`。
    *   `environment_config`: 环境配置，包括环境 ID、入口、奖励阈值、最大步数等。

### Collect Environment 配置

```arduino
    'collect_environment': {
    'number': 1,
    'type': mindspore_rl.environment.gym_environment.GymEnvironment,
    'wrappers': [mindspore_rl.environment.pyfunc_wrapper.PyFuncWrapper],
        'params': {
            'GymEnvironment': {
            'name': 'CartPole-v0',
            'seed': 42
            },
            'name': 'CartPole-v0'
        }
    }
```

*   `number`: 环境实例数量，这里为1。
*   `type`: 环境的类型，这里使用 `mindspore_rl.environment.gym_environment.GymEnvironment`。
*   `wrappers`: 环境使用的包装器，这里是 `PyFuncWrapper`。
*   `params`: 环境的参数配置，包括环境名称 `CartPole-v0` 和随机种子 `42`。

### Eval Environment 配置

```arduino
    'eval_environment': {
    'number': 1,
    'type': mindspore_rl.environment.gym_environment.GymEnvironment,
    'wrappers': [mindspore_rl.environment.pyfunc_wrapper.PyFuncWrapper],
        'params': {
            'GymEnvironment': {
            'name': 'CartPole-v0',
            'seed': 42
            },
            'name': 'CartPole-v0'
        }
    }
```

*   配置与 `collect_environment` 类似，用于评估模型性能。

总结一下，这些配置定义了 Actor-Critic 算法在 MindSpore 框架中的具体实现，包括 Actor 和 Learner 的设置、策略和网络的参数，以及训练和评估环境的配置。这个还是比较基础的。

![cke_66080.png](/images/jueJin/285008600051998.png)

### HDC 2024，6月21日-23日，东莞松山湖，期待与您相见！

**更多详情请关注官网：**

中文：[developer.huawei.com/home/hdc](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.huawei.com%2Fhome%2Fhdc "https://developer.huawei.com/home/hdc")

英文：[developer.huawei.com/home/en/hdc](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.huawei.com%2Fhome%2Fen%2Fhdc "https://developer.huawei.com/home/en/hdc")

[**点击关注，第一时间了解华为云新鲜技术~**](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")