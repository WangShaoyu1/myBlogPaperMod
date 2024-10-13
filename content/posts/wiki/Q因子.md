---
author: "王宇"
title: "Q因子"
date: 九月24,2024
description: "双二阶滤波器相关"
tags: ["双二阶滤波器相关"]
ShowReadingTime: "12s"
weight: 572
---
> **BiquadFilterNode.Q 类型为双精度浮点**

[Q因子](https://zhida.zhihu.com/search?content_id=224171071&content_type=Article&match_order=1&q=Q%E5%9B%A0%E5%AD%90&zhida_source=entity)，或质量因子.默认值为 1,范围在 0.0001 至 1000.

biquadFilter.Q属性在Web Audio API的BiquadFilterNode中起到控制滤波器共振或尖锐度的作用。

Q值（Quality factor）是一个无量纲的数值，用来描述滤波器的带宽相对于中心频率的宽度。

具体影响如下：

•低Q值：表示滤波器的带宽相对较宽，过渡平滑。对于带通和带阻滤波器，这会使得通过或阻断的频段范围更广；对于低通和高通滤波器，则意味着过渡区域更加平缓。

•高Q值：表示滤波器的带宽相对较窄，有更尖锐的峰值或谷值。在带通和带阻滤波器中，它会让通过或阻断的频段非常狭窄；而在低通和高通滤波器中，会产生更急剧的截止效果。

简而言之，调整Q值可以帮助你控制过滤效果的锐利度或是选择性，使得音频处理更加符合特定需求。

**最小demo**

[?](#)

`<!DOCTYPE html>`

`<``html` `lang``=``"en"``>`

`<``head``>`

    `<``meta` `charset``=``"UTF-8"``>`

    `<``meta` `name``=``"viewport"` `content``=``"width=device-width, initial-scale=1.0"``>`

    `<``title``>Document</``title``>`

`</``head``>`

`<``body``>`

    `demo`

    `<``button` `onclick``=``"start()"``>开始</``button``>`

    `<``input` `type``=``"range"` `id``=``"qSlider"` `min``=``"0.1"` `max``=``"20"` `step``=``"0.01"` `value``=``"1"``>`

`</``body``>`

`<``script``>`

`let audioContext`

`function start () {`

`audioContext = new (window.AudioContext || window.webkitAudioContext)();`

    `function createNoise() {`

        `const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 5, audioContext.sampleRate);`

            `const noiseBufferSource = noiseBuffer.getChannelData(0);`

            `for (let i = 0; i <` `noiseBufferSource.length``; i++) {`

                `noiseBufferSource[i] = Math.random() * 2 - 1;`

            `}`

            `const` `bufferSourceNode` `=` `audioContext``.createBufferSource();`

            `bufferSourceNode.buffer` `=` `noiseBuffer``;`

            `bufferSourceNode.loop` `=` `true``;`

            `return bufferSourceNode;`

    `}`

    `const` `biquadFilter` `=` `audioContext``.createBiquadFilter();`

    `biquadFilter.type` `=` `'bandpass'``; // 以带通滤波器为例，更明显地展示Q值变化效果`

    `biquadFilter.frequency.value` `=` `1000``; // 中心频率`

    `biquadFilter.Q.value` `=` `1``; // 初始Q值`

    `const` `noiseSource` `=` `createNoise``();`

    `noiseSource.connect(biquadFilter);`

    `biquadFilter.connect(audioContext.destination);`

    `const` `qSlider` `=` `document``.getElementById('qSlider');`

    `qSlider.addEventListener('input', function() {`

    `biquadFilter.Q.value` `=` `parseFloat``(this.value);`

    `});`

    `// 开始播放`

    `noiseSource.start();`

`}`

`</script>`

`</``html``>`

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)