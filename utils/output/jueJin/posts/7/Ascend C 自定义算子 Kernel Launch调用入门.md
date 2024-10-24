---
author: "华为云开发者联盟"
title: "Ascend C 自定义算子 Kernel Launch调用入门"
date: 2024-04-09
description: "Ascend C对外开放核函数的基础调用（Kernel Launch）方式，是为了简化Ascend C 自定义算子的开发流程，提供更易用的调试调优功能。"
tags: ["人工智能","敏捷开发中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:2,comments:0,collects:0,views:363,"
---
本文分享自华为云社区《[Ascend C 自定义算子 Kernel Launch调用入门](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%2F425299%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs/425299?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")》，作者： jackwangcumt。

1 Kernel Launch概述
-----------------

根据官方说明文档的介绍，Ascend C对外开放核函数的基础调用（Kernel Launch）方式，是为了简化Ascend C 自定义算子的开发流程，提供更易用的调试调优功能。当开发者完成算子核函数的开发和Tiling实现后，即可通过AscendCL运行时接口，完成算子的调用并实现自己的推理应用；同时提供简易的kernel开发工程，开发者仅需提供kernel侧实现，基于工程框架可以快速实现Kernel Launch。本文实验前提是完成了《Ascend C 自定义PRelu算子》博文的相关算子开发工程。网址为：[bbs.huaweicloud.com/blogs/42524…](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%2F425244 "https://bbs.huaweicloud.com/blogs/425244") 。请注意：

*   8.0.RC1.alpha002 当前版本，Kernel Launch开放式编程为试用特性，不支持应用于商用产品中。
*   8.0.RC1.alpha002 当前版本暂不支持获取用户workspace特性。

2 Kernel Launch调用方式
-------------------

ACLRT\_LAUNCH\_KERNEL调用方式对内核调用符方式进行了功能加强，核函数的调用是异步的，调用接口的使用方法如下：

```scss
ACLRT_LAUNCH_KERNEL(kernel_name)(blockDim, stream, argument list);
```

*   kernel\_name：算子核函数的名称。
*   blockDim：规定了核函数将会在几个核上执行。每个执行该核函数的核会被分配一个逻辑ID，即block\_idx，可以在核函数的实现中调用[GetBlockIdx](https://link.juejin.cn?target=https%3A%2F%2Fwww.hiascend.com%2Fdocument%2Fdetail%2Fzh%2FCANNCommunityEdition%2F80RC1alpha003%2Fapiref%2Fopdevgapi%2Fatlasascendc_api_07_0172.html "https://www.hiascend.com/document/detail/zh/CANNCommunityEdition/80RC1alpha003/apiref/opdevgapi/atlasascendc_api_07_0172.html")来获取block\_idx。
*   stream，类型为aclrtStream，stream用于维护一些异步操作的执行顺序，确保按照应用程序中的代码调用顺序在Device上执行。
*   argument list：参数列表，与核函数的参数列表保持一致。

为帮助开发者快速的完成算子的Kernel Launch调试，官方提供了简易的算子工程，我们可以基于该算子工程中的样例代码和工程框架进行算子开发。算子工程支持的如下：

*   该工程支持调试功能，如[PRINTF](https://link.juejin.cn?target=https%3A%2F%2Fwww.hiascend.com%2Fdocument%2Fdetail%2Fzh%2FCANNCommunityEdition%2F80RC1alpha003%2Fapiref%2Fopdevgapi%2Fatlasascendc_api_07_0188.html "https://www.hiascend.com/document/detail/zh/CANNCommunityEdition/80RC1alpha003/apiref/opdevgapi/atlasascendc_api_07_0188.html")功能、[DumpTensor](https://link.juejin.cn?target=https%3A%2F%2Fwww.hiascend.com%2Fdocument%2Fdetail%2Fzh%2FCANNCommunityEdition%2F80RC1alpha003%2Fapiref%2Fopdevgapi%2Fatlasascendc_api_07_0187.html "https://www.hiascend.com/document/detail/zh/CANNCommunityEdition/80RC1alpha003/apiref/opdevgapi/atlasascendc_api_07_0187.html")。
*   工程编译生成的应用程序，可通过msprof命令行方式采集和解析性能数据。

可以参考工程样例：[gitee.com/ascend/samp…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fascend%2Fsamples%2Fblob%2Fmaster%2Foperator%2FAddCustomSample%2FKernelLaunch%2FAddKernelInvocationTilingNeo "https://gitee.com/ascend/samples/blob/master/operator/AddCustomSample/KernelLaunch/AddKernelInvocationTilingNeo") ，其目录结构如下所示：

```arduino
AddKernelInvocationNeo
|-- cmake                                                 // CMake编译文件
|-- scripts
|  ├── gen_data.py                                     // 输入数据和真值数据生成脚本文件
|  ├── verify_result.py                                // 验证输出数据和真值数据是否一致的验证脚本
|-- CMakeLists.txt                                        // CMake编译配置文件
|-- add_custom.cpp                                     // 矢量算子kernel实现
|-- data_utils.h                                          // 数据读入写出函数
|-- main.cpp                                              // 主函数，调用算子的应用程序，含CPU域及NPU域调用
|-- run.sh                                                // 编译运行算子的脚本
```

基于该算子工程，开发者进行算子开发的步骤如下：

*   完成算子kernel侧实现。
    
*   编写算子调用应用程序main.cpp。
    
*   编写CMake编译配置文件CMakeLists.txt。
    
*   根据实际需要修改输入数据和真值数据生成脚本文件gen\_data.py和验证输出数据和真值数据是否一致的验证脚本verify\_result.py。
    
*   根据实际需要修改编译运行算子的脚本run.sh并执行该脚本，完成算子的编译运行和结果验证。
    

3 Kernel Launch实现
-----------------

在PReluSample目录下新建一个目录KernelLaunch，用于存放Kernel Launch调用方式的工程代码，我这里参考官方的[gitee.com/ascend/samp…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fascend%2Fsamples%2Ftree%2Fmaster%2Foperator%2FLeakyReluCustomSample%2FKernelLaunch%2F "https://gitee.com/ascend/samples/tree/master/operator/LeakyReluCustomSample/KernelLaunch/")

LeakyReluKernelInvocation样例工程，并修改了相关参数，p\_relu\_custom.cpp 代码如下所示：

```scss
#include "kernel_operator.h"
using namespace AscendC;

constexpr int32_t BUFFER_NUM = 2;
constexpr int32_t TOTAL_LENGTH = 8 * 200 * 1024;
constexpr int32_t TILE_NUM = 32;
constexpr float alpha = 0.002;

    class KernelPRelu {
    public:
__aicore__ inline KernelPRelu() {}
__aicore__ inline void Init(GM_ADDR x, GM_ADDR y, uint32_t totalLength, uint32_t tileNum, float alpha)
    {
    PRINTF("[npu debug] >>> GetBlockNum() %d", GetBlockNum());
    ASSERT(GetBlockNum() != 0 && "block dim can not be zero!");
    this->blockLength = totalLength / GetBlockNum();
    this->tileNum = tileNum;
    this->alpha = static_cast<float>(alpha);
    ASSERT(tileNum != 0 && "tile num can not be zero!");
    this->tileLength = this->blockLength / tileNum / BUFFER_NUM;
    
    // get start index for current core, core parallel
    xGm.SetGlobalBuffer((__gm__ float*)x + this->blockLength * GetBlockIdx(), this->blockLength);
    yGm.SetGlobalBuffer((__gm__ float*)y + this->blockLength * GetBlockIdx(), this->blockLength);
    // pipe alloc memory to queue, the unit is Bytes
    pipe.InitBuffer(inQueueX, BUFFER_NUM, this->tileLength * sizeof(float));
    pipe.InitBuffer(outQueueY, BUFFER_NUM, this->tileLength * sizeof(float));
    pipe.InitBuffer(tmpBuffer1, this->tileLength * sizeof(float));
    //pipe.InitBuffer(tmpBuffer2, this->tileLength * sizeof(float));
}
__aicore__ inline void Process()
    {
    // loop count need to be doubled, due to double buffer
    int32_t loopCount = this->tileNum * BUFFER_NUM;
    // tiling strategy, pipeline parallel
        for (int32_t i = 0; i < loopCount; i++) {
        CopyIn(i);
        Compute(i);
        CopyOut(i);
    }
}

private:
__aicore__ inline void CopyIn(int32_t progress)
    {
    // alloc tensor from queue memory
    LocalTensor<float> xLocal = inQueueX.AllocTensor<float>();
    // copy progress_th tile from global tensor to local tensor
    DataCopy(xLocal, xGm[progress * this->tileLength], this->tileLength);
    // enque input tensors to VECIN queue
    inQueueX.EnQue(xLocal);
}
__aicore__ inline void Compute(int32_t progress)
    {
    // deque input tensors from VECIN queue
    LocalTensor<float> xLocal = inQueueX.DeQue<float>();
    LocalTensor<float> yLocal = outQueueY.AllocTensor<float>();
    LocalTensor<float> tmpTensor1 = tmpBuffer1.Get<float>();
    float inputVal = 0.0;
    Maxs(tmpTensor1, xLocal, inputVal, this->tileLength); // x >= 0  --> x
    // x < 0
    Mins(xLocal, xLocal, inputVal, this->tileLength);
    Muls(xLocal, xLocal, this->alpha, this->tileLength);
    Add(yLocal, xLocal, tmpTensor1, this->tileLength);
    outQueueY.EnQue<float>(yLocal);
    // free input tensors for reuse
    inQueueX.FreeTensor(xLocal);
}
__aicore__ inline void CopyOut(int32_t progress)
    {
    // deque output tensor from VECOUT queue
    LocalTensor<float> yLocal = outQueueY.DeQue<float>();
    // copy progress_th tile from local tensor to global tensor
    DataCopy(yGm[progress * this->tileLength], yLocal, this->tileLength);
    // free output tensor for reuse
    outQueueY.FreeTensor(yLocal);
}

private:
TPipe pipe;
TBuf<QuePosition::VECCALC> tmpBuffer1;
//TBuf<QuePosition::VECCALC> tmpBuffer1, tmpBuffer2;
// create queues for input, in this case depth is equal to buffer num
TQue<QuePosition::VECIN, BUFFER_NUM> inQueueX;
// create queue for output, in this case depth is equal to buffer num
TQue<QuePosition::VECOUT, BUFFER_NUM> outQueueY;
GlobalTensor<float> xGm, yGm;
uint32_t blockLength;
uint32_t tileNum;
uint32_t tileLength;
float alpha;
};
    extern "C" __global__ __aicore__ void p_relu_custom(GM_ADDR x, GM_ADDR y) {
    //GET_TILING_DATA(tiling_data, tiling);
    // TODO: user kernel impl
    KernelPRelu op;
    op.Init(x, y, TOTAL_LENGTH, TILE_NUM, alpha);
    op.Process();
}

#ifndef __CCE_KT_TEST__
// call of kernel function
void p_relu_custom_do(uint32_t blockDim, void* l2ctrl, void* stream, uint8_t* x, uint8_t* y)
    {
    p_relu_custom<<<blockDim, l2ctrl, stream>>>(x, y);
}
#endif
```

main.cpp 代码如下所示 :

```scss
/*
* Copyright (c) Huawei Technologies Co., Ltd. 2022-2023. All rights reserved.
* This file constains code of cpu debug and npu code.We read data from bin file
* and write result to file.
*/
#include "data_utils.h"
#ifndef __CCE_KT_TEST__
#include "acl/acl.h"
extern void p_relu_custom_do(uint32_t coreDim, void* l2ctrl, void* stream, uint8_t* x, uint8_t* y);
#else
#include "tikicpulib.h"
extern "C" __global__ __aicore__ void p_relu_custom(GM_ADDR x, GM_ADDR y);
#endif

int32_t main(int32_t argc, char* argv[])
    {
    uint32_t blockDim = 8;
    size_t inputByteSize = 8 * 200 * 1024 * sizeof(float);
    size_t outputByteSize = 8 * 200 * 1024 * sizeof(float);
    
    #ifdef __CCE_KT_TEST__
    // CPU
    uint8_t* x = (uint8_t*)AscendC::GmAlloc(inputByteSize);
    uint8_t* y = (uint8_t*)AscendC::GmAlloc(outputByteSize);
    printf("[cpu debug]>>> inputByteSize: %d\n", inputByteSize);
    
    ReadFile("./input/input_x.bin", inputByteSize, x, inputByteSize);
    AscendC::SetKernelMode(KernelMode::AIV_MODE);
    ICPU_RUN_KF(p_relu_custom, blockDim, x, y); // use this macro for cpu debug
    WriteFile("./output/output_y.bin", y, outputByteSize);
    AscendC::GmFree((void *)x);
    AscendC::GmFree((void *)y);
    
    #else
    // NPU
    //CHECK_ACL(aclInit(nullptr));
    CHECK_ACL(aclInit("./acl.json"));
    aclrtContext context;
    int32_t deviceId = 0;
    CHECK_ACL(aclrtSetDevice(deviceId));
    CHECK_ACL(aclrtCreateContext(&context, deviceId));
    aclrtStream stream = nullptr;
    CHECK_ACL(aclrtCreateStream(&stream));
    
    uint8_t *xHost, *yHost;
    uint8_t *xDevice, *yDevice;
    CHECK_ACL(aclrtMallocHost((void**)(&xHost), inputByteSize));
    CHECK_ACL(aclrtMallocHost((void**)(&yHost), outputByteSize));
    CHECK_ACL(aclrtMalloc((void**)&xDevice, inputByteSize, ACL_MEM_MALLOC_HUGE_FIRST));
    CHECK_ACL(aclrtMalloc((void**)&yDevice, outputByteSize, ACL_MEM_MALLOC_HUGE_FIRST));
    
    ReadFile("./input/input_x.bin", inputByteSize, xHost, inputByteSize);
    CHECK_ACL(aclrtMemcpy(xDevice, inputByteSize, xHost, inputByteSize, ACL_MEMCPY_HOST_TO_DEVICE));
    
    p_relu_custom_do(blockDim, nullptr, stream, xDevice, yDevice);
    CHECK_ACL(aclrtSynchronizeStream(stream));
    
    CHECK_ACL(aclrtMemcpy(yHost, outputByteSize, yDevice, outputByteSize, ACL_MEMCPY_DEVICE_TO_HOST));
    WriteFile("./output/output_y.bin", yHost, outputByteSize);
    
    CHECK_ACL(aclrtFree(xDevice));
    CHECK_ACL(aclrtFree(yDevice));
    CHECK_ACL(aclrtFreeHost(xHost));
    CHECK_ACL(aclrtFreeHost(yHost));
    
    CHECK_ACL(aclrtDestroyStream(stream));
    CHECK_ACL(aclrtDestroyContext(context));
    CHECK_ACL(aclrtResetDevice(deviceId));
    CHECK_ACL(aclFinalize());
    #endif
    return 0;
}
```

执行如下代码进行NPU上板调试和CPU调试：

```arduino
#npu
bash run.sh Ascend310P1 npu_onboard
# cpu
bash run.sh Ascend310P1 cpu
```

![QQ截图20240408155058.png](/images/jueJin/b0d8c7132ba4458.png)

![QQ截图20240408155212.png](/images/jueJin/1b76dec02c9c49d.png)

[**点击关注，第一时间了解华为云新鲜技术~**](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")