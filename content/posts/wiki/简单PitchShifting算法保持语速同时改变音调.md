---
author: "王宇"
title: "简单PitchShifting算法保持语速同时改变音调"
date: 九月24,2024
description: "语音相关"
tags: ["语音相关"]
ShowReadingTime: "12s"
weight: 584
---
Web Audio API 在每个 AudioSourceNode 上提供了一个 playbackRate 参数。这个参数值可以影响任何 sound Buffer。注意，在这种情况下，音高和样本的时长都会受到影响。有一些复杂的方法试图只影响音高而不影响音频的时长，但是要以通用的方式做到这一点是非常困难的，否则就会在混合中引入奇奇怪怪的东西。(原话引用自[https://juejin.cn/post/7355748120507465766](https://juejin.cn/post/7355748120507465766))

  

[?](#)

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

31

32

33

34

35

36

37

38

39

40

41

42

43

44

45

46

47

48

49

50

51

52

53

54

55

56

57

58

`try` `{`

  `this``.audioCtx.decodeAudioData(`

    `this``.buf,`

    `(buffer) => {`

      `// 创建 OfflineAudioContext`

      `const` `offlineCtx =` `new` `OfflineAudioContext(`

        `buffer.numberOfChannels,`

        `buffer.length,`

        `buffer.sampleRate`

      `);`

      `// 创建 BufferSource`

      `const` `source = offlineCtx.createBufferSource();`

      `source.buffer = buffer;`

      `// 创建 ScriptProcessorNode`

      `const` `processor = offlineCtx.createScriptProcessor(``4096``,` `1``,` `1``);`

      `// Pitch Shifting 处理`

      `processor.onaudioprocess = (event) => {`

        `const` `inputData = event.inputBuffer.getChannelData(``0``);`

        `const` `outputData = event.outputBuffer.getChannelData(``0``);`

        `// 简单的 Pitch Shifting 算法`

          `const` `pitchFactor =` `1``;` `// 调整音调的因子，1.0 为原始音调，>1.0 提高音调，<1.0 降低音调`

          `for` `(let i =` `0``; i < inputData.length; i++) {`

          `const` `index = Math.floor(i / pitchFactor);`

          `if` `(index < inputData.length) {`

            `outputData[i] = inputData[index];`

          `}` `else` `{`

            `outputData[i] =` `0``;` `// 超出范围的部分填充为 0`

          `}`

          `}`

      `};`

      `// 连接节点`

      `source.connect(processor);`

      `processor.connect(offlineCtx.destination);`

      `// 开始处理`

      `source.start(``0``);`

      `offlineCtx.startRendering().then((renderedBuffer) => {`

        `// 创建新的 AudioBufferSourceNode`

        `this``.source =` `this``.audioCtx.createBufferSource();`

        `this``.source.buffer = renderedBuffer;`

        `this``.source.playbackRate.value =` `1.0``;` `// 保持语速不变`

        `this``.gainNode.gain.value =` `1``;`

        `this``.source.connect(``this``.gainNode);`

        `e && e();`

      `});`

    `},`

    `() => {`

      `this``.sync() ?` `this``.decode(e) : alert(``"sync error"``);`

    `}`

  `);`

`}` `catch` `(e) {`

  `console.log(``"decode error: "``, e.message), alert(``"decode error"``);`

`}`

使用AI解释一下：

Pitch Shifting 是一种音频处理技术，用于改变音频信号的音调而不改变其播放速度。其基本原理是通过调整音频信号的频率成分来实现音调的变化。以下是一些常见的 Pitch Shifting 方法：

1.  **时间域方法**：通过改变音频信号的采样率来实现音调的变化。这种方法简单但会同时改变音频的播放速度。
    
2.  **频域方法**：通过快速傅里叶变换（FFT）将音频信号转换到频域，然后调整频率成分，再通过逆快速傅里叶变换（IFFT）将信号转换回时域。这种方法可以独立控制音调和播放速度。
    
3.  **相位声码器（Phase Vocoder）**：通过分析音频信号的相位信息来实现音调的变化。这种方法可以在保持播放速度不变的情况下改变音调。
    
4.  **粒子合成（Granular Synthesis）**：将音频信号分割成小的粒子（grains），然后通过调整这些粒子的播放顺序和速度来实现音调的变化。
    

在你的代码中，使用的是一种简单的时间域方法，通过调整采样点的索引来改变音调。以下是如何修改代码以提高音调：

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)