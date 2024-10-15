---
author: "王宇"
title: "百度人脸识别API使用"
date: 七月12,2024
description: "摄像头使用相关"
tags: ["摄像头使用相关"]
ShowReadingTime: "12s"
weight: 291
---
### API准备工作

1.  **获取百度人脸识别API Key和Secret Key**
    
    *   注册并获取API Key和Secret Key，用于访问百度人脸识别API。
2.  **获取访问令牌**
    
    *   使用API Key和Secret Key获取访问令牌（Access Token），用于访问API接口。

### 图像处理流程

1.  **拍照**
    
    *   使用Android相机API拍摄照片，并将照片保存为Bitmap对象。
2.  **将Bitmap转换为Base64**
    
    *   将Bitmap对象转换为Base64编码的字符串，便于传输和处理。
3.  **调用百度人脸识别API**
    
    *   构建JSON请求体，包含Base64编码的图像数据和其他参数（如人脸属性要求）。
    *   发送POST请求到百度人脸识别API的检测接口。
4.  **处理API响应**
    
    *   获取API返回的JSON响应，解析其中的人脸检测结果或其他相关信息。

### 示例代码

以下是一个简化的示例代码，演示了如何在Android应用中使用摄像头拍照，并利用百度人脸识别API进行人脸检测。

xml配置

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

`<?``xml` `version``=``"1.0"` `encoding``=``"utf-8"``?>`

`<``manifest` `xmlns:android``=``"[http://schemas.android.com/apk/res/android](http://schemas.android.com/apk/res/android)"`

    `xmlns:tools``=``"[http://schemas.android.com/tools](http://schemas.android.com/tools)"``>`

    `<``uses-permission` `android:name``=``"android.permission.CAMERA"` `/>`

    `<``uses-feature` `android:name``=``"android.hardware.camera"` `android:required``=``"true"` `/>`

    `<``uses-permission` `android:name``=``"android.permission.INTERNET"``/>`

    `<``application`

        `android:allowBackup``=``"true"`

        `android:dataExtractionRules``=``"@xml/data_extraction_rules"`

        `android:fullBackupContent``=``"@xml/backup_rules"`

        `android:icon``=``"@mipmap/ic_launcher"`

        `android:label``=``"@string/app_name"`

        `android:roundIcon``=``"@mipmap/ic_launcher_round"`

        `android:supportsRtl``=``"true"`

        `android:theme``=``"@style/Theme.MyCameraApp"`

        `tools:targetApi``=``"31"``>`

        `<``activity`

            `android:name``=``".MainActivity"`

            `android:exported``=``"true"`

            `android:label``=``"@string/app_name"`

            `android:theme``=``"@style/Theme.MyCameraApp"``>`

            `<``intent-filter``>`

                `<``action` `android:name``=``"android.intent.action.MAIN"` `/>`

                `<``category` `android:name``=``"android.intent.category.LAUNCHER"` `/>`

            `</``intent-filter``>`

        `</``activity``>`

    `</``application``>`

`</``manifest``>`

  

java代码

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

59

60

61

62

63

64

65

66

67

68

69

70

71

72

73

74

75

76

77

78

79

80

81

82

83

84

85

86

87

88

89

90

91

92

93

94

95

96

97

98

99

100

101

102

103

104

105

106

107

108

109

110

111

112

113

114

115

116

117

118

119

120

121

122

123

124

125

126

127

128

129

130

131

132

133

134

135

136

137

138

139

140

141

142

143

144

145

146

147

`import` `android.content.Intent;`

`import` `android.graphics.Bitmap;`

`import` `android.os.Bundle;`

`import` `android.provider.MediaStore;`

`import` `android.util.Base64;`

`import` `android.view.View;`

`import` `android.widget.Button;`

`import` `android.widget.TextView;`

`import` `androidx.annotation.Nullable;`

`import` `androidx.appcompat.app.AppCompatActivity;`

`import` `org.json.JSONException;`

`import` `org.json.JSONObject;`

`import` `java.io.ByteArrayOutputStream;`

`import` `java.io.IOException;`

`import` `okhttp3.*;`

`public` `class` `MainActivity` `extends` `AppCompatActivity {`

    `private` `static` `final` `int` `REQUEST_IMAGE_CAPTURE =` `1``;` `// 请求拍照的请求码`

    `private` `Bitmap imageBitmap;` `// 保存拍摄的图片的Bitmap对象`

    `private` `TextView resultTextView;` `// 显示处理结果的TextView`

    `// 百度人脸识别API的API Key和Secret Key`

    `public` `static` `final` `String API_KEY =` `""``;`

    `public` `static` `final` `String SECRET_KEY =` `""``;`

    `// OkHttpClient实例，用于发送HTTP请求`

    `static` `final` `OkHttpClient HTTP_CLIENT =` `new` `OkHttpClient();`

    `@Override`

    `protected` `void` `onCreate(Bundle savedInstanceState) {`

        `super``.onCreate(savedInstanceState);`

        `setContentView(R.layout.activity_main);` `// 设置布局文件`

        `// 获取布局中的按钮和TextView`

        `Button takePhotoButton = findViewById(R.id.button_take_photo);`

        `Button processButton = findViewById(R.id.button_process);`

        `resultTextView = findViewById(R.id.textview_result);`

        `// 拍照按钮点击事件监听器`

        `takePhotoButton.setOnClickListener(``new` `View.OnClickListener() {`

            `@Override`

            `public` `void` `onClick(View v) {`

                `dispatchTakePictureIntent();` `// 调用方法启动相机拍照`

            `}`

        `});`

        `// 处理按钮点击事件监听器`

        `processButton.setOnClickListener(``new` `View.OnClickListener() {`

            `@Override`

            `public` `void` `onClick(View v) {`

                `if` `(imageBitmap !=` `null``) {`

                    `// 在新线程中处理图像`

                    `new` `Thread(() -> {`

                        `String base64Image = bitmapToBase64(imageBitmap);` `// 将Bitmap转换为Base64编码字符串`

                        `try` `{`

                            `String result = processImage(base64Image);` `// 调用百度人脸识别API处理图像`

                            `runOnUiThread(() -> resultTextView.setText(result));` `// 在UI线程更新处理结果显示`

                        `}` `catch` `(IOException | JSONException e) {`

                            `e.printStackTrace();`

                            `runOnUiThread(() -> resultTextView.setText(``"处理图像时出错: "` `+ e.getMessage()));` `// 显示处理图像时的错误信息`

                        `}`

                    `}).start();`

                `}` `else` `{`

                    `resultTextView.setText(``"请先拍照"``);` `// 如果没有拍摄照片，则提示用户先拍照`

                `}`

            `}`

        `});`

    `}`

    `// 启动相机拍照Intent`

    `private` `void` `dispatchTakePictureIntent() {`

        `Intent takePictureIntent =` `new` `Intent(MediaStore.ACTION_IMAGE_CAPTURE);` `// 创建启动相机拍照的Intent`

        `if` `(takePictureIntent.resolveActivity(getPackageManager()) !=` `null``) {`

            `startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAPTURE);` `// 启动拍照Activity，并等待结果返回`

        `}`

    `}`

    `@Override`

    `protected` `void` `onActivityResult(``int` `requestCode,` `int` `resultCode,` `@Nullable` `Intent data) {`

        `super``.onActivityResult(requestCode, resultCode, data);`

        `if` `(requestCode == REQUEST_IMAGE_CAPTURE && resultCode == RESULT_OK) {`

            `Bundle extras = data.getExtras();`

            `imageBitmap = (Bitmap) extras.get(``"data"``);` `// 获取拍摄的照片Bitmap对象`

        `}`

    `}`

    `// 将Bitmap对象转换为Base64编码字符串`

    `private` `String bitmapToBase64(Bitmap bitmap) {`

        `ByteArrayOutputStream byteArrayOutputStream =` `new` `ByteArrayOutputStream();`

        `bitmap.compress(Bitmap.CompressFormat.JPEG,` `100``, byteArrayOutputStream);` `// 将Bitmap压缩为JPEG格式，质量为100%`

        `byte``[] byteArray = byteArrayOutputStream.toByteArray();` `// 将压缩后的数据转换为字节数组`

        `return` `Base64.encodeToString(byteArray, Base64.DEFAULT);` `// 使用Base64进行编码，返回编码后的字符串`

    `}`

    `// 使用百度人脸识别API处理图像`

    `private` `String processImage(String base64Image)` `throws` `IOException, JSONException {`

        `MediaType mediaType = MediaType.parse(``"application/json"``);`

        `// 构建JSON请求体，设置请求参数`

        `String json =` `new` `JSONObject()`

                `.put(``"image"``, base64Image)` `// 图像数据，Base64编码字符串`

                `.put(``"image_type"``,` `"BASE64"``)` `// 图像数据类型，此处为BASE64`

                `.put(``"face_field"``,` `"age,expression,face_shape,gender,glasses,landmark,landmark150,quality,eye_status,emotion,face_type,mask,spoofing"``)` `// 请求返回的人脸属性信息`

                `.put(``"face_type"``,` `"LIVE"``)` `// 人脸类型，此处为活体检测`

                `.put(``"liveness_control"``,` `"NONE"``)` `// 活体检测控制，默认为NONE`

                `.toString();`

        `RequestBody body = RequestBody.create(mediaType, json);`

        `// 创建HTTP请求，向百度人脸识别API发送POST请求`

        `Request request =` `new` `Request.Builder()`

                `.url(``"[https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=](https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=)"` `+ getAccessToken()) // 请求URL，包含访问令牌`

                `.post(body)` `// 设置请求体为JSON数据`

                `.addHeader(``"Content-Type"``,` `"application/json"``)` `// 设置请求头，指定Content-Type为JSON格式`

                `.build();`

        `// 发送HTTP请求，并获取响应`

        `Response response = HTTP_CLIENT.newCall(request).execute();`

        `return` `response.body().string();` `// 返回百度人脸识别API的响应结果字符串`

    `}`

    `// 获取百度人脸识别API的访问令牌`

    `private` `String getAccessToken()` `throws` `IOException, JSONException {`

        `MediaType mediaType = MediaType.parse(``"application/x-www-form-urlencoded"``);`

        `// 创建获取访问令牌的请求体，包含client_credentials授权方式和API Key/Secret Key`

        `RequestBody body = RequestBody.create(mediaType,` `"grant_type=client_credentials&client_id="` `+ API_KEY`

                `+` `"&client_secret="` `+ SECRET_KEY);`

        `// 创建HTTP请求，向百度人脸识别API获取访问令牌`

        `Request request =` `new` `Request.Builder()`

                `.url(``"[https://aip.baidubce.com/oauth/2.0/token](https://aip.baidubce.com/oauth/2.0/token)"``)`

                `.post(body)` `// 设置请求体为URL编码格式`

                `.addHeader(``"Content-Type"``,` `"application/x-www-form-urlencoded"``)` `// 设置请求头，指定Content-Type为URL编码格式`

                `.build();`

        `// 发送HTTP请求，并获取响应`

        `Response response = HTTP_CLIENT.newCall(request).execute();`

        `return` `new` `JSONObject(response.body().string()).getString(``"access_token"``);` `// 解析响应JSON，获取访问令牌`

    `}`

`}`

关于获取百度人脸识别API的API Key和Secret Key需要进行以下步骤：

1.  **注册百度账号**：如果还没有百度账号，需要先注册一个。可以访问百度注册页面进行注册。
    
2.  **创建应用**：登录百度账号后，进入[百度AI开放平台](https://ai.baidu.com/)。在控制台中，创建一个新的应用或者选择已有的应用（确保该应用支持人脸识别服务）。
    
3.  **获取API Key和Secret Key**：
    
    *   在控制台的应用详情页中，可以找到API Key和Secret Key。这两个密钥用于通过API访问百度人脸识别服务。
    *   将获取到的API Key和Secret Key填写到你的应用程序中，例如在上面提到的Android应用程序中的`API_KEY`和`SECRET_KEY`变量中。

确保在使用API Key和Secret Key时，遵循百度的安全最佳实践，不要将这些密钥硬编码在公开的代码库或者客户端应用中，以防止泄露和滥用。

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)