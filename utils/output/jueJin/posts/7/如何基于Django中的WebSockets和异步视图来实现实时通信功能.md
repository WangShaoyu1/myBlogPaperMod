---
author: "华为云开发者联盟"
title: "如何基于Django中的WebSockets和异步视图来实现实时通信功能"
date: 2024-04-22
description: "本文分享自华为云社区《结合Django中的WebSockets和异步视图实现实时通信功能的完整指南》，探讨如何利用Django中的WebSockets和异步视图来实现实时通信功能。"
tags: ["敏捷开发","后端","Python中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:2,comments:0,collects:2,views:122,"
---
本文分享自华为云社区《[结合Django中的WebSockets和异步视图实现实时通信功能的完整指南](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%2F425973%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs/425973?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")》，作者： 柠檬味拥抱。

在现代Web应用程序中，实时通信已经成为了必不可少的功能之一。无论是在线聊天、实时数据更新还是实时通知，都需要通过实时通信技术来实现。Django作为一个强大的Web框架，提供了许多工具来构建各种类型的Web应用程序，但是在实时通信方面，传统的请求-响应模式显然无法满足需求。在这篇文章中，我们将探讨如何利用Django中的WebSockets和异步视图来实现实时通信功能。

WebSockets简介
------------

WebSockets是一种在单个TCP连接上提供全双工通信的协议。与HTTP请求-响应模式不同，WebSockets允许服务器和客户端之间进行持续的双向通信，从而实现了实时性。在Django中，我们可以使用第三方库`django-channels`来实现WebSocket的支持。

![](/images/jueJin/81519d4845ec4ef.png)

异步视图
----

Django 3.1引入了异步视图的支持，使得我们可以编写异步处理请求的视图函数。这对于处理长时间运行的任务或需要等待外部资源响应的请求非常有用。

结合WebSockets与异步视图
-----------------

下面我们将通过一个案例来演示如何在Django中结合WebSockets和异步视图来实现实时通信功能。假设我们正在开发一个简单的实时聊天应用。

### 安装依赖

首先，我们需要安装`django-channels`库：

```
pip install channels
```

### 配置项目

在项目的`settings.py`中，添加`channels`应用：

```ini
    INSTALLED_APPS = [
    ...
    'channels',
    ...
]
```

然后，创建一个名为`routing.py`的新文件，在其中定义WebSocket路由：

```python
# routing.py

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from myapp.consumers import ChatConsumer

    websocket_urlpatterns = [
    path('ws/chat/', ChatConsumer.as_asgi()),
]

    application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
    URLRouter(
    websocket_urlpatterns
    )
    ),
    })
```

### 创建Consumer

接下来，我们创建一个消费者（Consumer）来处理WebSocket连接：

```python
# consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
async def connect(self):
self.room_name = 'chat_room'
self.room_group_name = f'chat_{self.room_name}'

# 加入聊天室群组
await self.channel_layer.group_add(
self.room_group_name,
self.channel_name
)

await self.accept()

async def disconnect(self, close_code):
# 离开聊天室群组
await self.channel_layer.group_discard(
self.room_group_name,
self.channel_name
)

async def receive(self, text_data):
text_data_json = json.loads(text_data)
message = text_data_json['message']

# 发送消息到聊天室群组
await self.channel_layer.group_send(
self.room_group_name,
    {
    'type': 'chat_message',
    'message': message
}
)

async def chat_message(self, event):
message = event['message']

# 发送消息给WebSocket连接
    await self.send(text_data=json.dumps({
    'message': message
    }))
```

### 编写前端代码

在前端页面中，我们需要使用JavaScript来连接WebSocket并处理消息的发送和接收：

```ini
// chat.js

const chatSocket = new WebSocket('ws://localhost:8000/ws/chat/');

    chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    const message = data['message'];
    // 处理收到的消息
    console.log(message);
    };
    
        chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
        };
        
            document.querySelector('#chat-message-input').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                const messageInputDom = document.querySelector('#chat-message-input');
                const message = messageInputDom.value;
                    chatSocket.send(JSON.stringify({
                    'message': message
                    }));
                    messageInputDom.value = '';
                }
                });
```

![](/images/jueJin/3694efd6a0a7435.png)

### 集成到模板

最后，我们在Django模板中集成JavaScript代码：

```xml
<!-- chat.html -->

<!DOCTYPE html>
<html>
<head>
<title>Chat</title>
</head>
<body>
<textarea id="chat-message-input"></textarea>
<script src="{% static 'chat.js' %}"></script>
</body>
</html>
```

### 引入异步视图

在Django 3.1之前，视图函数都是同步执行的，这意味着一个视图函数中的代码会一直执行直到返回一个HTTP响应给客户端。然而，有些任务可能是耗时的，比如调用外部API或者执行复杂的计算。在这种情况下，同步视图会阻塞整个应用程序，导致性能下降。

为了解决这个问题，Django引入了异步视图，它们使用Python的`async`和`await`语法来支持异步编程模式。异步视图允许在处理请求时挂起执行，等待IO操作完成而不会阻塞整个应用程序。

结合WebSockets与异步视图的优势
--------------------

结合WebSockets与异步视图可以使得实时通信应用具备更高的性能和可扩展性。当有大量连接同时进行通信时，异步视图可以有效地管理这些连接，而不会因为一个连接的阻塞而影响其他连接的处理。这种方式下，应用程序能够更好地应对高并发情况，保持稳定性和高效性。

![](/images/jueJin/cd2ac8414fba475.png)

完善实时聊天应用
--------

除了上述示例中的基本聊天功能之外，我们还可以对实时聊天应用进行一些扩展，比如：

1.  用户认证：在连接WebSocket时进行用户认证，确保只有已登录的用户可以进入聊天室。
2.  聊天室管理：创建多个聊天室，并允许用户选择加入不同的聊天室。
3.  消息存储：将聊天记录保存到数据库中，以便用户在断线重连后可以查看历史消息。
4.  消息通知：实现消息通知功能，当用户收到新消息时，通过浏览器通知或邮件提醒用户。
5.  实时在线用户列表：显示当前在线用户列表，并在用户进入或离开聊天室时实时更新。

实时地理位置共享
--------

假设我们正在开发一个实时地理位置共享应用，用户可以在地图上实时看到其他用户的位置。以下是一个简单的示例代码：

#### 后端代码

```python
# consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer

class LocationConsumer(AsyncWebsocketConsumer):
async def connect(self):
self.room_name = 'location_room'
self.room_group_name = f'location_{self.room_name}'

# 加入地理位置共享房间
await self.channel_layer.group_add(
self.room_group_name,
self.channel_name
)

await self.accept()

async def disconnect(self, close_code):
# 离开地理位置共享房间
await self.channel_layer.group_discard(
self.room_group_name,
self.channel_name
)

async def receive(self, text_data):
text_data_json = json.loads(text_data)
latitude = text_data_json['latitude']
longitude = text_data_json['longitude']

# 发送位置信息到地理位置共享房间
await self.channel_layer.group_send(
self.room_group_name,
    {
    'type': 'location_message',
    'latitude': latitude,
    'longitude': longitude
}
)

async def location_message(self, event):
latitude = event['latitude']
longitude = event['longitude']

# 发送位置信息给WebSocket连接
    await self.send(text_data=json.dumps({
    'latitude': latitude,
    'longitude': longitude
    }))
```

#### 前端代码

```ini
// location.js

const locationSocket = new WebSocket('ws://localhost:8000/ws/location/');

    locationSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    const latitude = data['latitude'];
    const longitude = data['longitude'];
    // 在地图上显示用户位置
    updateMap(latitude, longitude);
    };
    
        locationSocket.onclose = function(e) {
        console.error('Location socket closed unexpectedly');
        };
        
            function sendLocation(latitude, longitude) {
                locationSocket.send(JSON.stringify({
                'latitude': latitude,
                'longitude': longitude
                }));
            }
```

在这个示例中，用户通过前端界面在地图上选择或移动位置，然后通过WebSocket发送位置信息到服务器。服务器接收到位置信息后，将其广播给所有连接的用户，前端界面接收到位置信息后，在地图上实时更新其他用户的位置。

这样的实时地理位置共享功能可以应用在社交应用、实时导航应用等场景中，为用户提供更好的交互体验。

实时数据可视化
-------

假设我们有一个数据监控系统，需要实时展示各种传感器的数据。以下是一个简单的示例代码：

#### 后端代码

```python
# consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer

class SensorDataConsumer(AsyncWebsocketConsumer):
async def connect(self):
self.room_name = 'sensor_data_room'
self.room_group_name = f'sensor_data_{self.room_name}'

# 加入传感器数据共享房间
await self.channel_layer.group_add(
self.room_group_name,
self.channel_name
)

await self.accept()

async def disconnect(self, close_code):
# 离开传感器数据共享房间
await self.channel_layer.group_discard(
self.room_group_name,
self.channel_name
)

async def receive(self, text_data):
text_data_json = json.loads(text_data)
sensor_id = text_data_json['sensor_id']
sensor_value = text_data_json['sensor_value']

# 发送传感器数据到传感器数据共享房间
await self.channel_layer.group_send(
self.room_group_name,
    {
    'type': 'sensor_data_message',
    'sensor_id': sensor_id,
    'sensor_value': sensor_value
}
)

async def sensor_data_message(self, event):
sensor_id = event['sensor_id']
sensor_value = event['sensor_value']

# 发送传感器数据给WebSocket连接
    await self.send(text_data=json.dumps({
    'sensor_id': sensor_id,
    'sensor_value': sensor_value
    }))
```

#### 前端代码

```ini
// sensor_data.js

const sensorDataSocket = new WebSocket('ws://localhost:8000/ws/sensor_data/');

    sensorDataSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    const sensorId = data['sensor_id'];
    const sensorValue = data['sensor_value'];
    // 更新传感器数据图表
    updateChart(sensorId, sensorValue);
    };
    
        sensorDataSocket.onclose = function(e) {
        console.error('Sensor data socket closed unexpectedly');
        };
        
            function sendSensorData(sensorId, sensorValue) {
                sensorDataSocket.send(JSON.stringify({
                'sensor_id': sensorId,
                'sensor_value': sensorValue
                }));
            }
```

在这个示例中，传感器设备通过WebSocket将实时数据发送到服务器，服务器接收到数据后将其广播给所有连接的用户，前端界面接收到数据后，使用JavaScript图表库将实时数据实时展示在图表中。

这样的实时数据可视化功能可以应用在数据监控、实时分析等场景中，为用户提供实时的数据展示和监控功能。

![](/images/jueJin/0cc4ff11c9c5473.png)

### 高级功能和进阶应用

除了基本的实时聊天功能之外，结合WebSockets和异步视图还可以实现一系列高级功能和进阶应用。以下是一些示例：

#### 1\. 实时地理位置共享

利用WebSocket和异步视图，可以实现用户之间实时的地理位置共享。当用户移动时，前端应用可以将用户的位置信息发送到服务器，服务器再将这些信息广播给其他用户。这种功能在社交应用、地图导航应用等场景中非常有用。

#### 2\. 实时数据可视化

在数据分析和监控领域，实时数据可视化是一项重要的任务。通过WebSocket和异步视图，可以实时将数据传输到前端，并利用JavaScript图表库（如Highcharts、Chart.js等）实时展示数据变化趋势、实时监控系统状态等。

#### 3\. 在线协作编辑

利用WebSocket和异步视图，可以实现多人在线协作编辑功能，类似于Google Docs。当一个用户编辑文档时，其余用户可以实时看到编辑内容的变化，从而实现多人实时协作编辑。

#### 4\. 实时游戏

实时游戏对于实时通信的需求非常高。结合WebSocket和异步视图，可以实现实时的多人在线游戏，比如棋牌游戏、实时战略游戏等，提供流畅的游戏体验。

#### 5\. 实时搜索和过滤

在网站和应用中，用户可能需要实时搜索和过滤数据。通过WebSocket和异步视图，可以实时向服务器发送搜索关键词或过滤条件，并实时获取服务器返回的搜索结果或过滤后的数据，从而提高用户体验。

#### 6\. 实时投票和问卷调查

在线投票和问卷调查通常需要实时获取投票结果或问卷填写情况。结合WebSocket和异步视图，可以实时更新投票结果图表或问卷统计数据，让用户实时了解当前的投票情况或问卷填写进度。

总结
--

本文介绍了如何利用Django中的WebSockets和异步视图来实现实时通信功能。我们首先了解了WebSockets的基本概念和工作原理，以及Django中使用`django-channels`库来支持WebSockets的方法。接着，我们深入探讨了异步视图的概念和用法，以及如何结合WebSockets和异步视图来实现实时通信功能。

通过一个简单的实时聊天应用的示例，我们演示了如何创建WebSocket消费者（Consumer）来处理WebSocket连接，并利用异步视图来处理WebSocket连接中的事件。我们还介绍了如何在前端页面中使用JavaScript来连接WebSocket，并实时处理接收到的消息。

随后，我们进一步探讨了结合WebSockets和异步视图的优势，并提供了一系列高级功能和进阶应用的示例，包括实时地理位置共享、实时数据可视化等。这些功能和应用可以为开发者提供更多的创新和可能性，从而满足不同场景下的实时通信需求

[**点击关注，第一时间了解华为云新鲜技术~**](https://link.juejin.cn?target=https%3A%2F%2Fbbs.huaweicloud.com%2Fblogs%3Futm_source%3Djuejin%26utm_medium%3Dbbs-ex%26utm_campaign%3Dother%26utm_content%3Dcontent "https://bbs.huaweicloud.com/blogs?utm_source=juejin&utm_medium=bbs-ex&utm_campaign=other&utm_content=content")