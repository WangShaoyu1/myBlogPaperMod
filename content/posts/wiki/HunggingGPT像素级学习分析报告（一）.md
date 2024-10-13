---
author: "王宇"
title: "HunggingGPT像素级学习分析报告（一）"
date: 四月24,2023
description: "GPT相关"
tags: ["GPT相关"]
ShowReadingTime: "12s"
weight: 199
---
*   1[结论](#结论)
*   2[与业务相关的启发](#与业务相关的启发)
*   3[前言](#前言)
    *   3.1[一、行业背景](#一、行业背景)
    *   3.2[二、Hugging GPT发布及能力](#二、HuggingGPT发布及能力)
*   4[上机模拟](#上机模拟)
    *   4.1[1\. 推荐配置](#1.推荐配置)
    *   4.2[2\. 运行](#2.运行)
        *   4.2.1[a. 运行项目](#a.运行项目)
        *   4.2.2[b. 链路调用](#b.链路调用)
        *   4.2.3[c. 举例分析](#c.举例分析)
            *   4.2.3.1[ⅰ. 用户输入](#ⅰ.用户输入)
            *   4.2.3.2[ⅱ. 任务规划](#ⅱ.任务规划)
            *   4.2.3.3[ⅲ. 模型选择](#ⅲ.模型选择)
        *   4.2.4[d. 模型执行](#d.模型执行)
        *   4.2.5[e. 结果生成](#e.结果生成)
*   5[效果分析](#效果分析)
    *   5.1[实验1](#实验1)
    *   5.2[实验2](#实验2)
    *   5.3[实验3](#实验3)
    *   5.4[实验4](#实验4)
    *   5.5[实验5](#实验5)
    *   5.6[实验结论](#实验结论)

结论
--

1、总的来说，Hugging GPT和微软之前开源的“Visual ChatGPT”一样，此类项目的象征意义要远大于现实意义，逻辑满分，应用效果值得深思和拓展。Jarvis代表的是大多数技术同仁对于人工智能发展共同愿景;  
2、Hugging GPT可以理解为借助ChatGPT的逻辑推理能力，使用Hugging GPT提供的工程化的任务模板、各个步骤下的prompt design模板来生成 输入到ChatGPT用到的prompt；并从场景逻辑上将任务分类，从工程实现上细化了这些模型的调用方式，并最终聚合结果反馈给用户；  
3、最优模型选择上，只是利用模型在Hugging Face平台上的点赞likes数量（本人本地项目中改为下载量downloads，学术文档[https://arxiv.org/pdf/2303.17580.pdf](https://arxiv.org/pdf/2303.17580.pdf) 上也是downloads，可理解为项目bug）有些简单，**能不能考虑多其他的标签来优化一个模型的匹配度值得思考和优化**；  
4、提示prompt对于ChatGPT输出准确的答案真的很重要，引导式，角色定位，描述细节等等做到细致才会用的好ChatGPT和其他的AIGC工具。

与业务相关的启发
--------

在这其中受到的启发有：

1、产品实践一个人工智能算法相关的项目，硬件配置要符合项目要求，如果涉及到训练相关的，没有强大的显卡是做不了这个事情，此种需求最经济的方式是使用云服务商对应服务；

2、对话管理模块，结合上下文这种，使用ChatGPT挺好用，这要求提示prompt做好引导，给出模板示例。所以针对业务场景设计一个prompt design系统很有价值；

3、目前对于AI的多任务治理、任务自动处理，这种强通用能力目前能力还在发展中；

4、单个食材识别，目前已有模型库做得很好，但要求图片清楚无误，同时对摆放位置要求较高；

5、识别出来食材后，图片转文本之后，可利用ChatGPT生成菜谱，效果不错，但是需求生成食谱步骤图片，目前对应的效果不好；

前言
--

### 一、行业背景

基于对大规模文本语料库的大规模预训练和来自人类反馈（RLHF）的强化学习，LLM可以在语言理解、生成、交互和推理方面产生卓越的能力。

尽管取得了这些巨大的成功，但目前的LLM技术仍然不完善，在构建先进的人工智能系统的过程中面临着一些紧迫的挑战。我们从以下方面进行讨论：

1.  1.  局限于文本生成的输入和输出形式， 当前的LLM缺乏处理视觉和语音等复杂信息的能力，无论它们在自然语言处理任务中取得了重大成就；
    2.  在现实场景中，一些复杂任务通常由多个子任务组成，因此需要多个模型的调度和协作，这也超出了语言模型的力；
    3.  对于一些具有挑战性的任务，LLM表明在零样本学习或者少样本学习中表现出良好的效果，但表现仍然比一些专家差不少(例如，微调模型）

为了解决复杂的AI任务，LLM需要和外部AI模型相辅而行，互相配合。因此，关键点就变成了怎么选择合适的中间件来作为桥梁链接LLM和各种各样的AI模型。每个AI模型都能通过总结其模型功能来表示为一种语言形式，因此，可以提出一个新的概念：“语言是LLM连接AI模型的通用接口”。也就是说，通过将这些模型描述合并到提示prompt中，LLM可被认为是管理AI模型的大脑，如计划、调度和合作等等。那怎么获取大量而又高质量的AI模型描述呢？一些开源机器学习社区提供大量适用模型，具有良好的模型描述，以解决特定的AI任务。基于以上，是不是可以通过一个基于语言的界面，连接LLM和开源机器学习社区，来解决复杂的AI任务？答案是可行。

### 二、Hugging GPT发布及能力

LLM选择的是ChatGPT，开源的机器学习社区选择是[hugging face（机器学习界的Github）](https://huggingface.co/)，两者之间的连接系统被命名为Hungging GPT，能处理用户多模态信息输入（多模态感知能力），并解决各种各样复杂的AI任务。Hungging GPT解决一个AI任务，可分解为如下4个步骤：

1.  1.  任务规划：使用ChatGPT来分析用户的请求及理解用户意图并将其分解为可能可解决的结构化任务，并通过Hugging GPT理解任务之间的逻辑关系并决定执行顺序【并通过Hugging GPT设计好提示系统以便于ChatGPT生成任务计划】；**HuggingGPT辅助ChatGPT完成任务计划**

为了promote ChatGPT更有效执行任务planning，Hugging GPT应用基于规范的指令和基于演示的解析到提示设计系统中。

1.  Hugging GPT设计了4个插槽供任务解析，分别是任务ID、任务type、任务dependencies、任务arguments，任务规范提供了一个统一的模版供ChatGPT通过插槽归档的方式来执行任务解析。任务type有lanuage、visual、video、audio，也可理解为NLP、CV、Video、Audio任务；具体看Hugging GPT中总结有：“token-classification”, “text2text-generation”, “summarization”, “translation”, “question-answering”, “conversational”, “text-generation”, “sentence-similarity”, “tabular-classification”, “object-detection”, “image-classification”, “image-to-image”, “image-to-text”, “text-to-image”, “text-to-video”, “visual-question-answering”, “document-question-answering”, “image-segmentation”, “depth-estimation”, “text-to-speech”, “automatic-speech-recognition”, “audio-to-audio”, “audio-classification”, “canny-control”, “hed-control”, “mlsd-control”, “normal-control”, “openpose-control”, “canny-text-to-image”, “depth-text-to-image”, “hed-text-to-image”, “mlsd-text-to-image”, “normal-text-to-image”, “openpose-text-to-image”, “seg-text-to-image”，共35种；
2.  Hugging GPT引入上下文学习来实现更好的任务解析和任务计划，就是项目中/server/demo文件夹中的json文件，通过在提示中注入一些演示，能够让ChatGPT更好理解意图和标准，每一个演示是一组任务计划的输入和输出—来自用户的请求和要解析出来的预期任务序列。此外这些演示由从用户请求解析的任务之间的依赖关系组成，能够有效帮助Hugging GPT理解任务之间的逻辑关系，并决定任务的执行循顺序和资源依赖。

1.  1.  模型选择：为了解决规划中的任务，ChatGPT基于Hugging Face平台上的模型描述选择专业模型；

1.  基于上下文的任务模型分配，通过用户的输入和在提示中解析出来的任务，Hugging GPT能够为任务选择最合适的模型；为了应对提示中对于上下文长度的限制，Hugging GPT基于任务类型筛选，并只保留符合的模型，同时将筛选出来的模型在Hugging Face根据下载量进行排名。

1.  1.  模型执行：启用和执行已选择的模型，并将执行结果返回给ChatGPT；

1.  一旦任务确定了对应的模型，接下来就进入了任务执行阶段。为了稳定性和加速计算，Hugging GPT采用混合推理端点（本地+云端），并允许没有资源依赖的任务并行运行；
2.  对于推理耗时、网络限制、**某些用到的模型不存**在的情况下，为了爆出系统稳定有效，Hugging GPT将这些模型和一些常用模型放在本地。本地模型数量少一些但执行速度快，Hugging Face上的云端模型正相反–数量多但**执行速度慢一些**；因此，本地模型优先级高于云端模型，只有当无法执行本地模型时，Hugging GPT才会选择执行Hugging GPT上的云端模型；

1.  1.  响应生成：最后，使用ChatGPT整合所有模型的预测，并为用户生成答案。

1.  所以任务执行完毕之后，Hugging GPT会将之前三个阶段所有的信息整合为一个简要的总结，其中最重要的是已结构化格式表达的推理结果，ChatGPT将这些信息作为输入并生成人类惯用表达方式的语言

Hugging GPT目前已有的能力如下：围绕着ChatGPT，目前已集成了数百个建立在Hugging GPT平台的AI模型，涵盖文本分类、物体检测、语义分割、图像生成、问题问答、文本转语音、文本转视频等等，具有处理多模态信息和复杂AI任务的能力。

Hugging GPT的从以下3个方面来体现通用AI能力：

*   *   Huuginging GPT使用ChatGPT作为接口来将用户请求转到专业模型，有效结合了ChatGPT的语言理解能力和其他专业AI模型的专业能力；
    *   Hugging GPT不局限于视觉感知任务，还能通过ChatGPT来组织各种模型之间的合作来处理任何模式或领域的任务；
    *   Hugging GPT 基于模型描述来分配和组织任务，通过仅提供模型描述，能够连续和方便地集成各种专家模型，而不用改变任何结构和提示设置。

上机模拟
----

### 1\. 推荐配置

[?](#)

`● Ubuntu` `16.04` `LTS`

`● VRAM >= 24GB`

`● RAM > 12GB (minimal), 16GB (standard), 80GB (full)`

`● Disk > 284GB`

  `○ 42GB` `for` `damo-vilab/text-to-video-ms-``1``.7b`

  `○ 126GB` `for` `ControlNet`

  `○ 66GB` `for` `stable-diffusion-v1-``5`

  `○ 50GB` `for` `others`

推荐配置这块实操说明：

1.  windows系统和Ubuntu皆可以，不推荐macOS（大多数都不兼容NVIDIA）；
2.  电脑需要配置NVIDIA显卡，最好是物理内存大于8G，其中加上电脑共享GPU内存，是可以满足如上配置的24G显卡要求。本人使用的 RTX 3080TI 16G，电脑共享GPU内存为32G。[2023年Q1季度显卡芯片性能排行](https://cdn.nlark.com/yuque/0/2023/jpeg/136198/1682152579308-a3a64719-86fc-4997-9830-414836ed91b5.jpeg?x-oss-process=image%2Fresize%2Cw_1080%2Climit_0%2Finterlace%2C1)；
3.  电脑物理内存最好是64G及以上，加上电脑动态虚拟内存，可满足如上配置中full模式下内存80G的要求；
4.  项目中常用模型下载后共有270G左右，下载时间需要考虑。3M/s的话，也需要不间断一天左右时间；

### 2\. 运行

#### a. 运行项目

配置好如上环境后，接下来按照操作流程：

[?](#)

`git clone https:``//github.com/microsoft/JARVIS.git`

[?](#)

`# setup env`

`cd server`

`conda create -n jarvis python=``3.8`

`conda activate jarvis`

`conda install pytorch torchvision torchaudio pytorch-cuda=``11.7` `-c pytorch -c nvidia`

`pip install -r requirements.txt`

``# download models. Make sure that `git-lfs` is installed.``

`cd models`

``bash download.sh # required when `inference_mode` is `local` or `hybrid`.``

`# run server`

`cd ..`

``# required when `inference_mode` is `local` or `hybrid`,start port`` `8005`

`python models_server.py --config configs/config.``default``.yaml`

`#` `for` `text-davinci-``003``,start port` `8004`

`python awesome_chat.py --config configs/config.``default``.yaml --mode server`

[?](#)

`cd web`

`npm install`

`npm run dev`

#### b. 链路调用

调用链是：

1.  用户通过web前端界面输入请求内容——>
2.  8004接口响应—分析用户请求意图，模型选择——>
3.  然后调用8005接口–模型执行、生成结果;

#### c. 举例分析

##### ⅰ. 用户输入

内容：tell me the content about the image /example/vege-meat.jpg,and generate a recipe picture according to the foodstuff

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/781d62bed9494bb1836afd31560c88b3~tplv-k3u1fbpfcp-zoom-1.image)

##### ⅱ. 任务规划

**第一步**：生成promt

**第二步**：调用接口：[https://api.openai.com/v1/completions](https://api.openai.com/v1/completions) ；

参数中：

1.  model:text-davinci-003
2.  prompt: 如下–完整的prompt。具体来看，prompt中的提示词大量由项目中/server/demos/demo\_parse\_task.json，中组成，并配合 用户输入的内容。demo\_parse\_task.json中的内容为6对上下文，每一对都包含一个user和assistant的输入与输出 作为上下文【个人理解是告诉ChatGPT回答这个问题的“训练数据”】【将这些上下文单独放到chat.open.com中也是类似的效果，模型不同略不一样】，**也就是说Hugging GPT提供模板作为prompt，输入到ChatGPT完成生成任务规划**；

**第三步**：生成任务规划结果。

1.  结果由ChatGPT生成，返回任务类型列表list，每条数据包含有任务类型type、任务ID、任务参数args，详细结果如下–完整的任务规划列表数据

[?](#)

`#``1` `Task Planning Stage: The AI assistant can parse user input to several tasks: [{``"task"``: task,` `"id"``: task_id,` `"dep"``: dependency_task_id,` `"args"``: {``"text"``: text or <GENERATED>-dep_id,` `"image"``: image_url or <GENERATED>-dep_id,` `"audio"``: audio_url or <GENERATED>-dep_id}}]. The special tag` `"<GENERATED>-dep_id"` `refer to the one generated text/image/audio in the dependency task (Please consider whether the dependency task generates resources of` `this` `type.) and` `"dep_id"` `must be in` `"dep"` `list. The` `"dep"` `field denotes the ids of the previous prerequisite tasks which generate a` `new` `resource that the current task relies on. The` `"args"` `field must in [``"text"``,` `"image"``,` `"audio"``], nothing` `else``. The task MUST be selected from the following options:` `"token-classification"``,` `"text2text-generation"``,` `"summarization"``,` `"translation"``,` `"question-answering"``,` `"conversational"``,` `"text-generation"``,` `"sentence-similarity"``,` `"tabular-classification"``,` `"object-detection"``,` `"image-classification"``,` `"image-to-image"``,` `"image-to-text"``,` `"text-to-image"``,` `"text-to-video"``,` `"visual-question-answering"``,` `"document-question-answering"``,` `"image-segmentation"``,` `"depth-estimation"``,` `"text-to-speech"``,` `"automatic-speech-recognition"``,` `"audio-to-audio"``,` `"audio-classification"``,` `"canny-control"``,` `"hed-control"``,` `"mlsd-control"``,` `"normal-control"``,` `"openpose-control"``,` `"canny-text-to-image"``,` `"depth-text-to-image"``,` `"hed-text-to-image"``,` `"mlsd-text-to-image"``,` `"normal-text-to-image"``,` `"openpose-text-to-image"``,` `"seg-text-to-image"``. There may be multiple tasks of the same type. Think step by step about all the tasks needed to resolve the user``'s request. Parse out as few tasks as possible while ensuring that the user request can be resolved. Pay attention to the dependencies and order among tasks. If the user input can'``t be parsed, you need to reply empty JSON []. <im_start>user`

`Give you some pictures e1.jpg, e2.png, e3.jpg, help me count the number of sheep?<im_end>`

`<im_start>assistant`

`[{``"task"``:` `"image-to-text"``,` `"id"``:` `0``,` `"dep"``: [-``1``],` `"args"``: {``"image"``:` `"e1.jpg"` `}}, {``"task"``:` `"object-detection"``,` `"id"``:` `1``,` `"dep"``: [-``1``],` `"args"``: {``"image"``:` `"e1.jpg"` `}}, {``"task"``:` `"visual-question-answering"``,` `"id"``:` `2``,` `"dep"``: [``1``],` `"args"``: {``"image"``:` `"<GENERATED>-1"``,` `"text"``:` `"How many sheep in the picture"``}} }}, {``"task"``:` `"image-to-text"``,` `"id"``:` `3``,` `"dep"``: [-``1``],` `"args"``: {``"image"``:` `"e2.png"` `}}, {``"task"``:` `"object-detection"``,` `"id"``:` `4``,` `"dep"``: [-``1``],` `"args"``: {``"image"``:` `"e2.png"` `}}, {``"task"``:` `"visual-question-answering"``,` `"id"``:` `5``,` `"dep"``: [``4``],` `"args"``: {``"image"``:` `"<GENERATED>-4"``,` `"text"``:` `"How many sheep in the picture"``}} }}, {``"task"``:` `"image-to-text"``,` `"id"``:` `6``,` `"dep"``: [-``1``],` `"args"``: {``"image"``:` `"e3.jpg"` `}},  {``"task"``:` `"object-detection"``,` `"id"``:` `7``,` `"dep"``: [-``1``],` `"args"``: {``"image"``:` `"e3.jpg"` `}}, {``"task"``:` `"visual-question-answering"``,` `"id"``:` `8``,` `"dep"``: [``7``],` `"args"``: {``"image"``:` `"<GENERATED>-7"``,` `"text"``:` `"How many sheep in the picture"``}}]<im_end>`

`<im_start>user`

`Look at /e.jpg, can you tell me how many objects in the picture? Give me a picture and video similar to` `this` `one.<im_end>`

`<im_start>assistant`

`[{``"task"``:` `"image-to-text"``,` `"id"``:` `0``,` `"dep"``: [-``1``],` `"args"``: {``"image"``:` `"/e.jpg"` `}}, {``"task"``:` `"object-detection"``,` `"id"``:` `1``,` `"dep"``: [-``1``],` `"args"``: {``"image"``:` `"/e.jpg"` `}}, {``"task"``:` `"visual-question-answering"``,` `"id"``:` `2``,` `"dep"``: [``1``],` `"args"``: {``"image"``:` `"<GENERATED>-1"``,` `"text"``:` `"how many objects in the picture?"` `}}, {``"task"``:` `"text-to-image"``,` `"id"``:` `3``,` `"dep"``: [``0``],` `"args"``: {``"text"``:` `"<GENERATED-0>"` `}}, {``"task"``:` `"image-to-image"``,` `"id"``:` `4``,` `"dep"``: [-``1``],` `"args"``: {``"image"``:` `"/e.jpg"` `}}, {``"task"``:` `"text-to-video"``,` `"id"``:` `5``,` `"dep"``: [``0``],` `"args"``: {``"text"``:` `"<GENERATED-0>"` `}}]<im_end>`

`<im_start>user`

`given a document /images/e.jpeg, answer me what is the student amount? And describe the image with your voice<im_end>`

`<im_start>assistant`

`{``"task"``:` `"document-question-answering"``,` `"id"``:` `0``,` `"dep"``: [-``1``],` `"args"``: {``"image"``:` `"/images/e.jpeg"``,` `"text"``:` `"what is the student amount?"` `}}, {``"task"``:` `"visual-question-answering"``,` `"id"``:` `1``,` `"dep"``: [-``1``],` `"args"``: {``"image"``:` `"/images/e.jpeg"``,` `"text"``:` `"what is the student amount?"` `}}, {``"task"``:` `"image-to-text"``,` `"id"``:` `2``,` `"dep"``: [-``1``],` `"args"``: {``"image"``:` `"/images/e.jpg"` `}}, {``"task"``:` `"text-to-speech"``,` `"id"``:` `3``,` `"dep"``: [``2``],` `"args"``: {``"text"``:` `"<GENERATED>-2"` `}}]<im_end>`

`<im_start>user`

`Given an image /example.jpg, first generate a hed image, then based on the hed image generate a` `new` `image where a girl is reading a book<im_end>`

`<im_start>assistant`

`[{``"task"``:` `"openpose-control"``,` `"id"``:` `0``,` `"dep"``: [-``1``],` `"args"``: {``"image"``:` `"/example.jpg"` `}},  {``"task"``:` `"openpose-text-to-image"``,` `"id"``:` `1``,` `"dep"``: [``0``],` `"args"``: {``"text"``:` `"a girl is reading a book"``,` `"image"``:` `"<GENERATED>-0"` `}}]<im_end>`

`<im_start>user`

`please show me a video and an image of (based on the text)` `'a boy is running'` `and dub it<im_end>`

`<im_start>assistant`

`[{``"task"``:` `"text-to-video"``,` `"id"``:` `0``,` `"dep"``: [-``1``],` `"args"``: {``"text"``:` `"a boy is running"` `}}, {``"task"``:` `"text-to-speech"``,` `"id"``:` `1``,` `"dep"``: [-``1``],` `"args"``: {``"text"``:` `"a boy is running"` `}}, {``"task"``:` `"text-to-image"``,` `"id"``:` `2``,` `"dep"``: [-``1``],` `"args"``: {``"text"``:` `"a boy is running"` `}}]<im_end>`

`<im_start>user`

`please show me a joke and an image of cat<im_end>`

`<im_start>assistant`

`[{``"task"``:` `"conversational"``,` `"id"``:` `0``,` `"dep"``: [-``1``],` `"args"``: {``"text"``:` `"please show me a joke of cat"` `}}, {``"task"``:` `"text-to-image"``,` `"id"``:` `1``,` `"dep"``: [-``1``],` `"args"``: {``"text"``:` `"a photo of cat"` `}}]<im_end>`

`<im_start>user`

`The chat log [ [] ] may contain the resources I mentioned. Now I input { tell me the content about the image /example/vege-meat.jpg,and generate a recipe picture according to the foodstuff }. Pay attention to the input and output types of tasks and the dependencies between tasks.<im_end>`

`<im_start>assistant`

[?](#)

`{`

  `"id"``:``"cmpl-7895qWMaFr1owxmoVhLFrt6vyRlap"``,`

  `"object"``:``"text_completion"``,`

  `"created"``:``1682175934``,`

  `"model"``:``"text-davinci-003"``,`

  `"choices"``:[`

    `{`

      `"text"``:[`

        `{`

          `"task"``:``"image-to-text"``,`

          `"id"``:``0``,`

          `"dep"``:Array[``1``],`

          `"args"``:{`

            `"image"``:``"/example/vege-meat.jpg"`

          `}`

        `},`

        `{`

          `"task"``:``"text-generation"``,`

          `"id"``:``1``,`

          `"dep"``:Array[``1``],`

          `"args"``:{`

            `"text"``:``"<GENERATED>-0"`

          `}`

        `},`

        `{`

          `"task"``:``"text-to-image"``,`

          `"id"``:``2``,`

          `"dep"``:Array[``1``],`

          `"args"``:{`

            `"text"``:``"<GENERATED>-1"`

          `}`

        `}`

      `],`

      `"index"``:``0``,`

      `"logprobs"``:``null``,`

      `"finish_reason"``:``"stop"`

    `}`

  `],`

  `"usage"``:{`

    `"prompt_tokens"``:``1927``,`

    `"completion_tokens"``:``113``,`

    `"total_tokens"``:``2040`

  `}`

`}`

##### ⅲ. 模型选择

经过上一个任务规划后，下一步将是模型选择：

[?](#)

`[`

  `{`

    `"task"``:` `"image-to-text"``,`

    `"id"``:` `0``,`

    `"dep"``: [`

      `-``1`

    `],`

    `"args"``: {`

      `"image"``:` `"/example/vege-meat.jpg"`

    `}`

  `},`

  `{`

    `"task"``:` `"text-generation"``,`

    `"id"``:` `1``,`

    `"dep"``: [`

      `0`

    `],`

    `"args"``: {`

      `"text"``:` `"<GENERATED>-0"`

    `}`

  `},`

  `{`

    `"task"``:` `"text-to-image"``,`

    `"id"``:` `2``,`

    `"dep"``: [`

      `1`

    `],`

    `"args"``: {`

      `"text"``:` `"<GENERATED>-1"`

    `}`

  `}`

`]`

Hugging GPT，会针对当前的任务tpye给出一个建议的模型选择：

1.  如果任务type是："-text-to-image"结尾，那么建议用本地模型—-lllyasviel/sd-controlnet/xxx系列，原因是：“ControlNet is the best model for this task.”
2.  如果任务type是：[“summarization”, “translation”, “conversational”, “text-generation”, “text2text-generation”]("summarization", "translation", "conversational", "text-generation", "text2text-generation")中任意一种，那么建议用ChatGPT，原因是：“ChatGPT performs well on some NLP tasks as well.”
3.  如果是其他类型任务type，项目中有一个文件/server/data/p0\_models.jsonl，里面列举了常用673个model的，可解决24类Task，如下所示：

[?](#)

`[``'text-classification'``,` `'token-classification'``,` `'text2text-generation'``,` `'summarization'``,` `'translation'``,` `'question-answering'``,` `'conversational'``,` `'text-generation'``,` `'sentence-similarity'``,` `'tabular-classification'``,` `'object-detection'``,` `'image-classification'``,` `'image-to-text'``,` `'text-to-image'``,` `'image-to-image'``,` `'visual-question-answering'``,` `'document-question-answering'``,` `'image-segmentation'``,` `'depth-estimation'``,` `'text-to-video'``,` `'text-to-speech'``,` `'automatic-speech-recognition'``,` `'audio-to-audio'``,` `'audio-classification'``]`

1.  上述3种Task，“text-to-image”,“text-generation”,“image-to-text”,分别选择是如下模型：

1.  “text-to-image”：{‘local’: [‘runwayml/stable-diffusion-v1-5’]('runwayml/stable-diffusion-v1-5'), ‘huggingface’: [‘andite/anything-v4.0’]('andite/anything-v4.0')}
2.  “text-generation”：ChatGPT
3.  “image-to-text”：{‘local’: [‘nlpconnect/vit-gpt2-image-captioning’]('nlpconnect/vit-gpt2-image-captioning'), ‘huggingface’: [‘kha-white/manga-ocr-base’, ‘microsoft/trocr-base-printed’, ‘nlpconnect/vit-gpt2-image-captioning’]('kha-white/manga-ocr-base', 'microsoft/trocr-base-printed', 'nlpconnect/vit-gpt2-image-captioning')}

里面有一个逻辑：

1.  如果可用模型中只有一个，不管是local本地的还是hugging 线上的，都选择这个模型；
2.  如果可用模型中有多个，就涉及到如何选择最合适的模型。choose\_model函数用于选择最合适的模型，其需要传入（input, command, 候选模型信息, api\_key, api\_type, api\_endpoint），其中候选模型信息中含有字段：likes、tags、description、id等信息；
3.  将这些组合信息作为prompt，传给ChatGPT，返回最合适的模型名称。选择的核心变量有两个：是否是local、模型点赞like数量，其实，只是通过这两个变量来决定使用哪个模型model有一点简单、粗暴；

[?](#)

`[{``'role'``:` `'system'``,` `'content'``:` `'#2 Model Selection Stage: Given the user request and the parsed tasks, the AI assistant helps the user to select a suitable model from a list of models to process the user request. The assistant should focus more on the description of the model and find the model that has the most potential to solve requests and tasks. Also, prefer models with local inference endpoints for speed and stability.'``}, {``'role'``:` `'user'``,` `'content'``:` `'tell me the content about the image /example/vege-meat.jpg,and generate a recipe picture according to the foodstuff'``}, {``'role'``:` `'assistant'``,` `'content'``:` `"{'task': 'text-to-image', 'id': 2, 'dep': [1], 'args': {'text': 'a table topped with bowls of vegetables and a bowl of meat '}}"``}, {``'role'``:` `'user'``,` `'content'``:` `'Please choose the most suitable model from [{'``id``': '``runwayml/stable-diffusion-v1-``5``', '``inference endpoint``': ['``runwayml/stable-diffusion-v1-``5``'], '``likes``': 6367, '``description``': '``\n\n# Stable Diffusion v1-``5` `Model Card\n\nStable Diffusion is a latent text-to-image diffusion model cap``', '``tags``': ['``stable-diffusion``', '``stable-diffusion-diffusers``', '``text-to-image``']}, {'``id``': '``andite/anything-v4.``0``', '``inference endpoint``': ['``andite/anything-v4.``0``'], '``likes``': 1815, '``description``': '``\n\nFantasy.ai is the official and exclusive hosted AI generation platform that holds a commercial use``', '``tags``': ['``stable-diffusion``', '``stable-diffusion-diffusers``', '``text-to-image``', '``diffusers``']}] for the task {'``task``': '``text-to-image``', '``id``': 2, '``dep``': [1], '``args``': {'``text``': '``a table topped with bowls of vegetables and a bowl of meat` `'}}. The output must be in a strict JSON format: {"id": "id", "reason": "your detail reasons for the choice"}.'``}]`

ChatGPT返回的内容是：“text-to-image”：

[?](#)

`{`

  `"id"``:` `"runwayml/stable-diffusion-v1-5"``,`

  `"reason"``:` `"This model is specifically designed for text-to-image diffusion tasks, has a high number of likes, and has a local inference endpoint that guarantees faster and stable processing."`

`}`

[?](#)

`[{``'role'``:` `'system'``,` `'content'``:` `'#2 Model Selection Stage: Given the user request and the parsed tasks, the AI assistant helps the user to select a suitable model from a list of models to process the user request. The assistant should focus more on the description of the model and find the model that has the most potential to solve requests and tasks. Also, prefer models with local inference endpoints for speed and stability.'``}, {``'role'``:` `'user'``,`

`'content'``:` `'tell me the content about the image /example/vege-meat.jpg,and generate a recipe picture according to the foodstuff'``}, {``'role'``:` `'assistant'``,` `'content'``:` `"{'task': 'image-to-text', 'id': 0, 'dep': [-1], 'args': {'image': 'public//example/vege-meat.jpg'}}"``}, {``'role'``:` `'user'``,` `'content'``:` `'Please choose the most suitable model from [{'``id``': '``nlpconnect/vit-gpt2-image-captioning``', '``inference endpoint``': ['``nlpconnect/vit-gpt2-image-captioning``'], '``likes``': 219, '``description``': '``\n\n# nlpconnect/vit-gpt2-image-captioning\n\nThis is an image captioning model trained by` `@ydshieh` `in [``', '``tags``': ['``image-to-text``', '``image-captioning``']}, {'``id``': '``Salesforce/blip-image-captioning-large``', '``inference endpoint``': ['``Salesforce/blip-image-captioning-large``', '``nlpconnect/vit-gpt2-image-captioning``'], '``likes``': 52, '``description``': '``\n\n# BLIP: Bootstrapping Language-Image Pre-training` `for` `Unified Vision-Language Understanding and Ge``', '``tags``': ['``image-captioning``']}] for the task {'``task``': '``image-to-text``', '``id``': 0, '``dep``': [-1], '``args``': {'``image``': '``public``//example/vege-meat.jpg``'}}. The output must be in a strict JSON format: {"id": "id", "reason": "your detail reasons for the choice"}.'``}]`

ChatGPT返回的内容是：“image-to-text”：

[?](#)

`{`

  `"id"``:` `"nlpconnect/vit-gpt2-image-captioning"``,`

  `"reason"``:` `"This model is specifically designed for image captioning tasks, has a high number of likes, and has a local inference endpoint that guarantees faster and stable processing."`

`}`

#### d. 模型执行

确定了选择的模型model后，如果是本地模型，调用本地模型：

逻辑如下：

1、将任务分类为：contronlet神经网络、NLP task、CV task、Audio task；针对每一类任务、已选择的model\_id，分别写调用方法、解析响应方法

如果是在线模型，调用在线模型：

1.  需要使用到Hugging face的接口调用方法，详情见：[InferenceApi](https://huggingface.co/docs/huggingface_hub/guides/inference)，项目中出现根据任务的不同的两种调用方式，一种是通过url调用方式："[https://api-inference.huggingface.co/models/{model\_id}"](https://api-inference.huggingface.co/models/{model_id}")，另外一种是：InferenceApi(repo\_id=“model\_id”, token=API\_TOKEN)；

在模型执行过程中，如果有生成文件，如图片、音频、视频等，生成完毕之后会保存在系统中。

#### e. 结果生成

之后就是将模型执行阶段的结果，结合Hugging GPT预设的propmpt，组成新的prompt，输入到ChatGPT中：

[?](#)

`[{``'role'``:` `'system'``,` `'content'``:` `'#4 Response Generation Stage: With the task execution logs, the AI assistant needs to describe the process and inference results.'``}, {``'role'``:` `'user'``,` `'content'``:` `'tell me the content abo ut the image /example/vege-meat.jpg,and generate a recipe picture according to the foodstuff'``}, {``'role'``:` `'assistant'``,` `'content'``:` `"Before give you a response, I want to introduce my workflow for your request, which is shown in the fo llowing JSON data: [{'task': {'task': 'image-to-text', 'id': 0, 'dep': [-1], 'args': {'image': 'public//example/vege-meat.jpg'}}, 'inference result': {'generated text': 'a table topped with bowls of vegetables and a bowl of meat '}, 'choose model result': {'id': 'nlpconnect/vit-gpt2-image-captioning', 'reason': 'This model is best suited for the task of image-to-text as it is specifically designed for image captioning and has the highest number of likes'}}, {' task': {'task': 'text-generation', 'id': 1, 'dep': [0], 'args': {'text': 'a table topped with bowls of vegetables and a bowl of meat '}}, 'inference result': {'response': 'One way to use the vegetables and meat in this photo is to c reate a healthy stir fry. Begin by heating some oil in a large skillet. Add diced onions and minced garlic and sauté until lightly browned. Add chopped or shredded vegetables - like broccoli, carrots, and bell peppers - to the skill ed to generate a text description of the image, which was: "``a table topped with bowls of vegetables and a bowl of meat``". \n\nThe second model, ChatGPT, was used to generate a recipe based on the text description, which was: "``One way to use the vegetables and meat in` `this` `photo is to create a healthy stir fry. Begin by heating some oil in a large skillet. Add diced onions and minced garlic and sauté until lightly browned. Add chopped or shredded vegetables - like broccoli, carrots, and bell peppers - to the skillet and cook until just tender. Add the diced meat followed by seasonings of your choice - like soy sauce, sesame oil, and sriracha - and an optional touch of sweetness like honey or brown sugar. Finally, stir everything together until evenly mixed and serve hot.``"\n\nThe third model, runwayml/stable-diffusion-v1-5, was used to generate an image based on the recipe, which can be found at the following URL: /images/54eb.png.\n\nI hope this answers your question. Is there anything else I can help you with?"``,``"index"``:``0``,``"logprobs"``:``null``,``"finish_reason"``:``"stop"``}],``"usage"``:{``"prompt_tokens"``:``716``,``"completion_tokens"``:``337``,``"total_tokens"``:``1053``}}`

ChatGPT返回的内容是：“generate”：

备注：在Web页面上，“/images/9541.png”是带链接可以点击的

[?](#)

`Based on the inference results, I can generate a recipe picture according to the foodstuff in the image you provided. The image you provided shows a table with bowls of vegetables and a bowl of meat, which can be used to make a delicious and healthy meal. Try` `this` `recipe: Sauteed vegetables and meat with garlic and herbs.`

`- Start by heating a pan over medium heat`

`- Add a tablespoon of olive oil and a clove of garlic (minced)`

`- Add the vegetables and cook until they become tender`

`- Add the meat, season with salt and pepper`

`- Cook until the meat is cooked through`

`- Add in chopped fresh herbs like parsley, chives, etc.`

`- Serve and enjoy!`

`The complete path or url of the generated image is /images/``9541``.png.`

`To generate the recipe picture, I used three tasks: image-to-text, text-generation, and text-to-image. For the image-to-text task, I used the model nlpconnect/vit-gpt2-image-captioning, which is best suited` `for` `the task of image-to-`

`text as it is specifically designed` `for` `image captioning and has a higher number of likes. For the text-generation task, I used the model ChatGPT, which performs well on some NLP tasks as well. For the text-to-image task, I used the model runwayml/stable-diffusion-v1-``5``, which has the highest number of likes and is the most suitable` `for` `text-to-image tasks.`

`I hope` `this` `answers your question. Is there anything` `else` `I can help you with?`

效果分析
----

### 实验1

**输入：**

tell me the content about the image /example/vege-meat.jpg,and generate a recipe picture according to those food ingredients

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95b02f1c87694cb090a0af0669ec17f5~tplv-k3u1fbpfcp-zoom-1.image)

**输出：**

HuggingGPT :  
Based on the inference results, I can generate a recipe picture according to the foodstuff in the image you provided. The image you provided shows a table with bowls of vegetables and a bowl of meat, which can be used to make a delicious and healthy meal. Try this recipe: Sauteed vegetables and meat with garlic and herbs.

*   Start by heating a pan over medium heat
*   Add a tablespoon of olive oil and a clove of garlic (minced)
*   Add the vegetables and cook until they become tender
*   Add the meat, season with salt and pepper
*   Cook until the meat is cooked through
*   Add in chopped fresh herbs like parsley, chives, etc.
*   Serve and enjoy!

The complete path or url of the generated image is [Image](Image)

To generate the recipe picture, I used three tasks: image-to-text, text-generation, and text-to-image. For the image-to-text task, I used the model nlpconnect/vit-gpt2-image-captioning, which is best suited for the task of image-to-text as it is specifically designed for image captioning and has a higher number of likes. For the text-generation task, I used the model ChatGPT, which performs well on some NLP tasks as well. For the text-to-image task, I used the model runwayml/stable-diffusion-v1-5, which has the highest number of likes and is the most suitable for text-to-image tasks.

I hope this answers your question. Is there anything else I can help you with?

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ef724c3fc46e4ae6916ba8a088cc9df0~tplv-k3u1fbpfcp-zoom-1.image)

### 实验2

**输入：**

Given a collection of image A: /examples/a.jpg, B: /examples/b.jpg, C: /examples/c.jpg, please tell me how many zebras in these picture?

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4818daa0d9549fd9c199dde3ed887c5~tplv-k3u1fbpfcp-zoom-1.image)![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f11affd0a104ebd91bb9dc1f9e76e72~tplv-k3u1fbpfcp-zoom-1.image)![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c5115465135643c1992dd9735697a04c~tplv-k3u1fbpfcp-zoom-1.image)

**输出：** **犯了事实性错误，答案是2只斑马，实际图中有4只**

HuggingGPT :

Based on the inference results, there are two zebras in the picture. The workflow I used to answer your request is as follows:

First, I used the image-to-text model nlpconnect/vit-gpt2-image-captioning to generate a text description for each image. For image A, the generated text was “a cat sitting on a window sill looking out”. For image B, the generated text was “a zebra standing in a field of tall grass”. For image C, the generated text was “two zebras standing in a field of dry grass”.

Then, I used the object-detection model facebook/detr-resnet-50 to detect objects in each image. For image A, the model detected a cat and a potted plant. For image B, the model detected a zebra. For image C, the model detected three zebras.

Finally, I used the visual-question-answering model dandelin/vilt-b32-finetuned-vqa to answer the question “How many zebras in the picture?”. For image A, the model predicted 0 zebras. For image B, the model predicted 1 zebra. For image C, the model predicted 2 zebras.

Therefore, based on the inference results, **there are two zebras in the picture**. The complete path or urls of files in inference results are:Image A: Image B：Image C:

Do you have any other questions?

### 实验3

**输入：**

Draw a picture about “A field of wildflowers stretches out as far as the eye can see, each one a different color and shape. In the distance, a massive tree towers over the landscape, its branches reaching up to the sky like tentacles.”

**输出：** **图片效果分辨率低，细节处理粗糙，毫无美感**

**HuggingGPT :**

I have carefully considered your request and based on the inference results, I have generated an image of a field of wildflowers stretching out as far as the eye can see, each one a different color and shape. In the distance, a massive tree towers over the landscape, its branches reaching up to the sky like tentacles. The model I used to generate this image is runwayml/stable-diffusion-v1-5, which is the most suitable for the task as it is a latent text-to-image diffusion model capable of generating high-quality images from text descriptions. The inference result is the generated image which can be found at the following URL: [Image](/pages/createpage.action?spaceKey=VDP&title=Image&linkCreation=true&fromPageId=101814576)([http://localhost:8004/images/7e3c.png](http://localhost:8004/images/7e3c.png)). I hope this answers your request. Is there anything else I can help you with?

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21b32e4f5a9346f382b42ca5df6511fe~tplv-k3u1fbpfcp-zoom-1.image)

**Midjourney效果：**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7a6ccb0c38347d0812f533da2d85863~tplv-k3u1fbpfcp-zoom-1.image)

### 实验4

**输入：**

Given two images:/example/egg.jpg、/example/chili2.jpg，what are they and generate a recipe picture

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/729b8801d2564d36916f6e7158d0541c~tplv-k3u1fbpfcp-zoom-1.image) ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d052448ed5e4a2bae45fe89bfbdfd44~tplv-k3u1fbpfcp-zoom-1.image)

**输出：—-输出的食谱recipe，完全离题。每次输入后结果都不一样**

**HuggingGPT :**

Based on the inference results, I have generated a recipe picture that contains the food ingredients and steps. The ingredients are **eggs and chili peppers**, and the steps are

*   scramble the eggs in a large bowl,
*   cook the chili peppers in a skillet until they are slightly charred,
*   add the peppers to the eggs and mix together,
*   pour the mixture into the white bowl and serve.

The generated image can be found at the following URL: [Image](/pages/createpage.action?spaceKey=VDP&title=Image&linkCreation=true&fromPageId=101814576)([http://localhost:8004/images/5358.png](http://localhost:8004/images/5358.png)). To generate this recipe picture, I used the following models: nlpconnect/vit-gpt2-image-captioning for image-to-text, ChatGPT for text-generation, and runwayml/stable-diffusion-v1-5 for text-to-image. I hope this answer is helpful. Is there anything else I can help you with?

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f30194449714f0ba4a44c89324f06dc~tplv-k3u1fbpfcp-zoom-1.image)

### 实验5

**输入：**

Generate a video about"a blue bird is flying around the apple tree, the sky is bright"

**输出：—-生成的视频比较模糊**

**HuggingGPT :**

I have carefully considered your request and based on the inference results, I have generated a video about ‘a blue bird is flying around the apple tree, the sky is bright’. The model used for this task is ‘damo-vilab/text-to-video-ms-1.7b’ and the inference result is ‘[video](video)’. I hope this response meets your needs. Is there anything else I can help you with?

点击链接查看：[3d31.mp4](3d31.mp4)  
([https://www.yuque.com/666come/zh982x/sclvmxtnhvufkuf0#gQRe0](https://www.yuque.com/666come/zh982x/sclvmxtnhvufkuf0#gQRe0))

### 实验结论

1、理论逻辑能够跑通，文章中的实验数据成立，但实际上案例特别是生成图片这块效果很差；  
2、实验4 输入相同的内容，返回的内容不一样，问题出现在第一步任务解析上，每次返回的任务类型不一样，有时候第一步是image-to-text，有时候是image-classification，这就导致最后的结果不同  
3、实验2出现了事实性错误  
4、实验5中生成的视频比较模糊

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)