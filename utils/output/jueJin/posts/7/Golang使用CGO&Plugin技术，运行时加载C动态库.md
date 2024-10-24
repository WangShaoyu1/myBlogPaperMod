---
author: "字节跳动技术团队"
title: "Golang使用CGO&Plugin技术，运行时加载C动态库"
date: 2022-07-14
description: "本文介绍一种 Golang 程序在运行时加载 C 动态库的技术，跳过了 Golang 项目编译阶段需要链接 C 动态库的过程，提高了 Golang 项目开发部署的灵活性。"
tags: ["Go中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读4分钟"
weight: 1
selfDefined:"likes:9,comments:2,collects:22,views:9968,"
---
文章简介
====

本文介绍一种 Golang 程序在运行时加载 C 动态库的技术，跳过了 Golang 项目编译阶段需要链接 C 动态库的过程，提高了 Golang 项目开发部署的灵活性。

技术背景
====

Golang 程序调用 OpenCC 动态库的函数，执行文本繁体转简体操作。 需要在编译时不链接动态库，只在程序运行时加载 OpenCC 动态库。

OpenCC 库是使用 C++ 编写的繁简体转换程序，提供 C 语言 API 接口。 开源项目地址：[github.com/BYVoid/Open…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FBYVoid%2FOpenCC "https://github.com/BYVoid/OpenCC")

CGO 技术是让 Golang 语言使用 C 语言代码的一种方式，可以在 Golang 程序编译的时候链接 C 动态库。C 语言经过数十年的发展，有丰富的开源项目。在 Golang 生态还不是很完善的情况下，我们经常需要使用一些成熟的C开源项目。

Plugin 是 Golang 1.8 版本引入了一个新的插件系统，允许程序员使用动态链接库构建松散耦合的模块化程序，在程序运行时动态加载和绑定。

本文循序渐进地讲解 2 种解决方案：

解决方案 1：使用 CGO 技术，编译时绑定 OpenCC 的接口。

解决方案 2：引入 Plugin 技术，程序运行时加载动态库。

解决方案1
-----

方案 1 是最初的解决方案，使用 CGO 技术，在编译的时候绑定 OpenCC 的接口。

Golang -> CGO -> libopencc.so

编写CGO接口定义文件：

```arduino
// opencc.h
#include <stdlib.h>

void* Opencc_New(const char *configFile);
void* Opencc_Delete(void *id);
const char *Opencc_Convert(void *id, const char *input);
void Opencc_Free_String(char *p);
``````arduino
// opencc.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "opencc/src/opencc.h"

    const char *Convert(const char *input, const char *config) {
        if(strlen(config) > 16) {
        return 0;
    }
    
    char configFile[256] = "/usr/share/opencc/";
    strcat(configFile, config);
    strcat(configFile, ".json");
    
    opencc_t p = opencc_open(configFile);
    char *out = opencc_convert_utf8(p, input, strlen(input));
    out[strlen(input)] = '\0';
    
    opencc_close(p);
    
    return out;
}

    void Convert_free_string(char *p) {
    opencc_convert_utf8_free(p);
}

    void* Opencc_New(const char *configFile) {
    return opencc_open(configFile);
}

    void Opencc_Delete(void *id) {
    opencc_close(id);
}

    const char *Opencc_Convert(void *id, const char *input) {
    char *output = opencc_convert_utf8(id, input, strlen(input));
    output[strlen(input)] = '\0';
    return output;
}

    void Opencc_Free_String(char *p) {
    opencc_convert_utf8_free(p);
}
``````go
// opencc.go
package opencc

import "unsafe"
// #cgo LDFLAGS: -L${SRCDIR}/output/lib -lopencc
// #include "opencc.h"

import "C"

    func NewConverter(config string) unsafe.Pointer {
    return C.Opencc_New(C.CString(config))
}

    func Convert(p unsafe.Pointer, input string) string {
    inputChars := C.CString(input)
    outputChars := C.Opencc_Convert(p, inputChars)
    
    defer C.Opencc_Free_String(inputChars)
    defer C.Opencc_Free_String(outputChars)
    
    result := C.GoString(outputChars)
    return result
}

    func Close(p unsafe.Pointer) {
    C.Opencc_Delete(p)
}

    func ConvertOneTime(input string, config string) string {
    p := NewConverter(config)
    defer Close(p)
    return Convert(p, input)
}

    func ConvertAsync(input string, config string, callback func(output string)) {
        go func() {
        callback(ConvertOneTime(input, config))
        }()
    }
``````go
// test.go 调用OpenCC动态库的函数。
package main

import "fmt"
import "your/repository/go-opencc"

const (
input = "中国鼠标软件打印机"
config_s2t = "/usr/share/opencc/s2t.json"
config_t2s = "/usr/share/opencc/t2s.json"
)

    func main() {
    fmt.Println("Test Converter class:")
    c := opencc.NewConverter(config_s2t)
    defer c.Close()
    output := c.Convert(input)
    fmt.Println(output)
    
    fmt.Println("Test Convert function:")
    s := opencc.Convert(input, config_s2t)
    fmt.Println(s)
    fmt.Println(opencc.Convert(s, config_t2s))
    
    fmt.Println("Test ConvertAsync function:")
    retChan := make(chan string)
        opencc.ConvertAsync(input, config_s2t, func(output string) {
        retChan <- output
        })
        
        fmt.Println(<- retChan)
    }
```

方案 1，可以正确链接 libopencc.so 文件，并成功执行 Convert 函数进行繁简体转换。 但是有个问题，该方案在 Mac 系统上不容易进行编译，需要在 Mac 系统里安装 OpenCC 项目。假如调用 OpenCC 的项目有 10 人共同开发，就需要在 10 人的 Mac 电脑上进行编译，开发协作困难，不方便部署。

解决方案2
-----

引入 Plugin 技术，程序运行时加载动态库。

Golang -> Plugin -> libgo\_opencc.so -> CGO -> libopencc.so

编写 Plugin 动态链接库。

```go
// opencc_lib.go
package main

import (
"unsafe"

opencc "your/repository/go-opencc"
)

type openccConverter string

// NewConverter 创建Converter
    func (s openccConverter) NewConverter(config string) unsafe.Pointer {
    return opencc.NewConverter(config)
}

// Convert 转换函数
    func (s openccConverter) Convert(p unsafe.Pointer, input string) string {
    return opencc.Convert(p, input)
}

// Close 释放Converter占用的内存资源(不再使用Converter了)
    func (s openccConverter) Close(p unsafe.Pointer) {
    opencc.Close(p)
}

// ConvertOneTime 转换函数(转换一次，该函数每次调用都会加载配置文件，有性能影响)
    func (s openccConverter) ConvertOneTime(input string, config string) string {
    return opencc.ConvertOneTime(input, config)
}

// OpenccConverter export symble
var OpenccConverter openccConverter
```

编译动态库 build.sh 创建 output 目录，编译生成 ./output/lib/libgo\_opencc.so 动态库。

```bash
#!/bin/bash

mkdir -p output

cd opencc
./build.sh
cd ..

cp -rf opencc/output/* ./output

go build -buildmode=plugin -o ./output/lib/libgo_opencc.so ./lib/opencc_lib.go
```

使用 Plugin 加载 libgo\_opencc.so，调用 OpenCC 的函数。

```go
package main

import (
"os"
"plugin"
"testing"
"unsafe"
"fmt"
)

// 实现 opencc_lib.go 的接口
    type OpenccConverter interface {
    NewConverter(config string) unsafe.Pointer
    Convert(p unsafe.Pointer, input string) string
    Close(p unsafe.Pointer)
    ConvertOneTime(input string, config string) string
}

    func TestOpenccSo(t *testing.T) {
    openccPlugin, pluginErr := plugin.Open("/your/path/to/go-opencc/output/lib/libgo_opencc.so")
        if pluginErr != nil {
        panic(pluginErr)
    }
    
    symbol, cerr := openccPlugin.Lookup("OpenccConverter")
        if cerr != nil {
        fmt.Errorf("%+v", cerr)
        os.Exit(1)
    }
    
    plug, ok := symbol.(OpenccConverter)
        if !ok {
        fmt.Errorf("unexpected type from module symbol")
        os.Exit(1)
    }
    
    config := "/usr/share/opencc/hk2s.json"
    pointer := plug.NewConverter(config)
    defer plug.Close(pointer)
    
    input := "傳統漢字"
    
    output := plug.Convert(pointer, input)
    
    fmt.Printf("output: %s", output)
}

// 运行测试 TestOpenccSo，输出 “传统汉字”。
```

方案 2，实现了在程序运行时通过 Plugin 技术加载 libgo\_opencc.so 动态库，再由 libgo\_opencc.so 链接到 libopencc.so，即可在 Mac、Linux 系统上编译 Golang 程序，无需每台开发机都部署 OpenCC 项目。最终发布到生产环境时，由编译打包平台将 libgo\_opencc.so 和 libopencc.so 一起打包发布。

**加入我们**
========

我们来自字节跳动飞书商业应用研发部(Lark Business Applications)，目前我们在北京、深圳、上海、武汉、杭州、成都、广州、三亚都设立了办公区域。我们关注的产品领域主要在企业经验管理软件上，包括飞书 OKR、飞书绩效、飞书招聘、飞书人事等 HCM 领域系统，也包括飞书审批、OA、法务、财务、采购、差旅与报销等系统。欢迎各位加入我们。

扫码发现职位&投递简历

![](/images/jueJin/89441f9ea2164d6.png)

官网投递：[job.toutiao.com/s/FyL7DRg](https://link.juejin.cn?target=https%3A%2F%2Fjob.toutiao.com%2Fs%2FFyL7DRg "https://job.toutiao.com/s/FyL7DRg")