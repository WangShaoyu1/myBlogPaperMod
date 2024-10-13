---
author: "王宇"
title: "AzureIoTEdge模块间通讯sample"
date: 六月24,2024
description: "赵吉山"
tags: ["赵吉山"]
ShowReadingTime: "12s"
weight: 272
---
当涉及使用Azure IoT Edge在C++中进行模块间通信时

### 模块1（发送消息）

[?](#)

`#include <iostream>`

`#include <string>`

`#include "azure-iot-sdk-cpp/iothub_device_client_ll.h"`

`#include "azure-iot-sdk-cpp/iothub_message.h"`

`#include "azure-iot-sdk-cpp/iothub_module_client_ll.h"`

`#include "azure-iot-sdk-cpp/iothub_client_options.h"`

`#include "azure-iot-sdk-cpp/iothubtransportmqtt.h"`

`using` `namespace` `std;`

`static` `const` `char``* connectionString =` `"<module1-connection-string>"``;` `// 替换为模块1的连接字符串`

`static` `const` `char``* moduleId =` `"module1"``;`

`static` `const` `char``* outputName =` `"output1"``;`

`static` `IOTHUB_MODULE_CLIENT_LL_HANDLE moduleClient;`

`// 消息发送的回调函数`

`static` `void` `sendConfirmationCallback(IOTHUB_CLIENT_CONFIRMATION_RESULT result,` `void``* userContextCallback) {`

    `if` `(result == IOTHUB_CLIENT_CONFIRMATION_OK) {`

        `cout <<` `"Message sent to module2."` `<< endl;`

    `}` `else` `{`

        `cout <<` `"Failed to send message to module2."` `<< endl;`

    `}`

`}`

`int` `main() {`

    `// 初始化 IoT Hub SDK`

    `if` `(IoTHub_Init() != 0) {`

        `cout <<` `"Failed to initialize the IoT Hub SDK."` `<< endl;`

        `return` `-1;`

    `}`

    `// 创建 IoT Hub 模块客户端`

    `moduleClient = IoTHubModuleClient_LL_CreateFromEnvironment(MQTT_Protocol);`

    `if` `(moduleClient == nullptr) {`

        `cout <<` `"Failed to create IoT Hub module client."` `<< endl;`

        `IoTHub_Deinit();`

        `return` `-1;`

    `}`

    `// 打开 IoT Hub 模块客户端连接`

    `if` `(IoTHubModuleClient_LL_SetOption(moduleClient,` `"moduleId"``, moduleId) != IOTHUB_CLIENT_OK) {`

        `cout <<` `"Failed to set module ID."` `<< endl;`

        `IoTHubModuleClient_LL_Destroy(moduleClient);`

        `IoTHub_Deinit();`

        `return` `-1;`

    `}`

    `// 设置连接状态回调函数（此处未设置，留待后续扩展）`

    `if` `(IoTHubModuleClient_LL_SetConnectionStatusCallback(moduleClient, nullptr, nullptr) != IOTHUB_CLIENT_OK) {`

        `cout <<` `"Failed to set connection status callback."` `<< endl;`

        `IoTHubModuleClient_LL_Destroy(moduleClient);`

        `IoTHub_Deinit();`

        `return` `-1;`

    `}`

    `// 设置输入消息回调函数（此处未设置，留待后续扩展）`

    `if` `(IoTHubModuleClient_LL_SetMessageCallback(moduleClient, nullptr, nullptr) != IOTHUB_CLIENT_OK) {`

        `cout <<` `"Failed to set message callback."` `<< endl;`

        `IoTHubModuleClient_LL_Destroy(moduleClient);`

        `IoTHub_Deinit();`

        `return` `-1;`

    `}`

    `// 打开 IoT Hub 模块客户端连接`

    `if` `(IoTHubModuleClient_LL_Open(moduleClient, nullptr) != IOTHUB_CLIENT_OK) {`

        `cout <<` `"Failed to open IoT Hub module client."` `<< endl;`

        `IoTHubModuleClient_LL_Destroy(moduleClient);`

        `IoTHub_Deinit();`

        `return` `-1;`

    `}`

    `// 模拟发送消息给 module2`

    `string messageText =` `"Hello from module1"``;`

    `IOTHUB_MESSAGE_HANDLE messageHandle = IoTHubMessage_CreateFromString(messageText.c_str());`

    `if` `(messageHandle == nullptr) {`

        `cout <<` `"Failed to create IoT Hub message."` `<< endl;`

        `IoTHubModuleClient_LL_Destroy(moduleClient);`

        `IoTHub_Deinit();`

        `return` `-1;`

    `}`

    `// 发送消息到输出端口（output1）`

    `if` `(IoTHubModuleClient_LL_SendEventAsync(moduleClient, messageHandle, sendConfirmationCallback, nullptr) != IOTHUB_CLIENT_OK) {`

        `cout <<` `"Failed to send message asynchronously."` `<< endl;`

        `IoTHubMessage_Destroy(messageHandle);`

        `IoTHubModuleClient_LL_Destroy(moduleClient);`

        `IoTHub_Deinit();`

        `return` `-1;`

    `}`

    `IoTHubMessage_Destroy(messageHandle);`

    `// 等待一段时间以确保消息发送完成`

    `cout <<` `"Message sent asynchronously to module2."` `<< endl;`

    `this_thread::sleep_for(chrono::seconds(5));`

    `// 关闭 IoT Hub 模块客户端`

    `IoTHubModuleClient_LL_Destroy(moduleClient);`

    `IoTHub_Deinit();`

    `return` `0;`

`}`

### 模块2（接收消息）

[?](#)

`#include <iostream>`

`#include "azure-iot-sdk-cpp/iothub_device_client_ll.h"`

`#include "azure-iot-sdk-cpp/iothub_message.h"`

`#include "azure-iot-sdk-cpp/iothub_module_client_ll.h"`

`#include "azure-iot-sdk-cpp/iothub_client_options.h"`

`#include "azure-iot-sdk-cpp/iothubtransportmqtt.h"`

`using` `namespace` `std;`

`static` `const` `char``* connectionString =` `"<module2-connection-string>"``;` `// 替换为模块2的连接字符串`

`static` `const` `char``* moduleId =` `"module2"``;`

`static` `IOTHUB_MODULE_CLIENT_LL_HANDLE moduleClient;`

`// 消息接收的回调函数`

`static` `IOTHUBMESSAGE_DISPOSITION_RESULT receiveMessageCallback(IOTHUB_MESSAGE_HANDLE message,` `void``* userContextCallback) {`

    `const` `char``* messageString;`

    `size_t` `messageSize;`

    `// 从消息中获取数据`

    `if` `(IoTHubMessage_GetByteArray(message,` `reinterpret_cast``<``const` `unsigned` `char``**>(&messageString), &messageSize) != IOTHUB_MESSAGE_OK) {`

        `cout <<` `"Failed to get message data."` `<< endl;`

        `return` `IOTHUBMESSAGE_REJECTED;`

    `}`

    `// 输出接收到的消息内容`

    `cout <<` `"Received message from module1: "` `<< messageString << endl;`

    `// 确认接收消息`

    `IoTHubModuleClient_LL_SendMessageDisposition(moduleClient, message, IOTHUBMESSAGE_ACCEPTED);`

    `return` `IOTHUBMESSAGE_ACCEPTED;`

`}`

`int` `main() {`

    `// 初始化 IoT Hub SDK`

    `if` `(IoTHub_Init() != 0) {`

        `cout <<` `"Failed to initialize the IoT Hub SDK."` `<< endl;`

        `return` `-1;`

    `}`

    `// 创建 IoT Hub 模块客户端`

    `moduleClient = IoTHubModuleClient_LL_CreateFromEnvironment(MQTT_Protocol);`

    `if` `(moduleClient == nullptr) {`

        `cout <<` `"Failed to create IoT Hub module client."` `<< endl;`

        `IoTHub_Deinit();`

        `return` `-1;`

    `}`

    `// 设置模块 ID`

    `if` `(IoTHubModuleClient_LL_SetOption(moduleClient,` `"moduleId"``, moduleId) != IOTHUB_CLIENT_OK) {`

        `cout <<` `"Failed to set module ID."` `<< endl;`

        `IoTHubModuleClient_LL_Destroy(moduleClient);`

        `IoTHub_Deinit();`

        `return` `-1;`

    `}`

    `// 设置连接状态回调函数（此处未设置，留待后续扩展）`

    `if` `(IoTHubModuleClient_LL_SetConnectionStatusCallback(moduleClient, nullptr, nullptr) != IOTHUB_CLIENT_OK) {`

        `cout <<` `"Failed to set connection status callback."` `<< endl;`

        `IoTHubModuleClient_LL_Destroy(moduleClient);`

        `IoTHub_Deinit();`

        `return` `-1;`

    `}`

    `// 设置输入消息回调函数`

    `if` `(IoTHubModuleClient_LL_SetInputMessageCallback(moduleClient,` `"input1"``, receiveMessageCallback, nullptr) != IOTHUB_CLIENT_OK) {`

        `cout <<` `"Failed to set message callback."` `<< endl;`

        `IoTHubModuleClient_LL_Destroy(moduleClient);`

        `IoTHub_Deinit();`

        `return` `-1;`

    `}`

    `// 输出模块等待消息`

    `cout <<` `"Waiting for messages from module1..."` `<< endl;`

    `// 保持运行状态`

    `while` `(``true``) {`

        `IoTHubModuleClient_LL_DoWork(moduleClient);`

        `this_thread::sleep_for(chrono::seconds(1));`

    `}`

    `// 关闭 IoT Hub 模块客户端`

    `IoTHubModuleClient_LL_Destroy(moduleClient);`

    `IoTHub_Deinit();`

    `return` `0;`

`}`

### 代码注释说明

*   **IoT Hub 初始化**：初始化 IoT Hub SDK，确保能够正确使用 Azure IoT Edge 相关的功能。
*   **模块客户端创建**：使用 `IoTHubModuleClient_LL_CreateFromEnvironment` 函数创建 IoT Hub 模块客户端。
*   **连接设置和回调函数设置**：设置模块 ID、连接状态回调和消息接收回调函数，以便处理连接状态变化和接收到的消息。
*   **消息发送和接收处理**：在模块1中，创建消息并通过 `IoTHubModuleClient_LL_SendEventAsync` 函数发送到模块2；在模块2中，使用 `IoTHubModuleClient_LL_SetInputMessageCallback` 函数监听来自模块1的消息。
*   \*\*消息处理

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)