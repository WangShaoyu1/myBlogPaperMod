---
author: "王宇"
title: "图片识别API效果对比（完结~~~）"
date: 九月05,2024
description: "2024~~八月份"
tags: ["2024~~八月份"]
ShowReadingTime: "12s"
weight: 92
---
*   1[1\. 讯飞开放平台](#id-图片识别API效果对比（完结~~~）-讯飞开放平台)
    *   1.1[1.1. 人脸特征分析接口API](#id-图片识别API效果对比（完结~~~）-人脸特征分析接口API)
    *   1.2[1.2. 人脸检测和属性分析接口API](#id-图片识别API效果对比（完结~~~）-人脸检测和属性分析接口API)
    *   1.3[1.3. 年龄、性别、颜值、表情API与枚举值](#id-图片识别API效果对比（完结~~~）-年龄、性别、颜值、表情API与枚举值)
        *   1.3.1[1.3.1. 年龄](#id-图片识别API效果对比（完结~~~）-年龄)
        *   1.3.2[1.3.2. 性别](#id-图片识别API效果对比（完结~~~）-性别)
        *   1.3.3[1.3.3. 颜值](#id-图片识别API效果对比（完结~~~）-颜值)
        *   1.3.4[1.3.4. 表情](#id-图片识别API效果对比（完结~~~）-表情)
*   2[2\. 图片处理](#id-图片识别API效果对比（完结~~~）-图片处理)
    *   2.1[2.1. 原图片](#id-图片识别API效果对比（完结~~~）-原图片)
    *   2.2[2.2. 处理后的图片](#id-图片识别API效果对比（完结~~~）-处理后的图片)
    *   2.3[2.3. 图像处理程序](#id-图片识别API效果对比（完结~~~）-图像处理程序)
*   3[3\. 真实图片处理结果分析](#id-图片识别API效果对比（完结~~~）-真实图片处理结果分析)
    *   3.1[3.1. 人脸检测和属性分析](#id-图片识别API效果对比（完结~~~）-人脸检测和属性分析)
    *   3.2[3.2. 人脸特征分析](#id-图片识别API效果对比（完结~~~）-人脸特征分析)
*   4[4\. GPT4o试一试](#id-图片识别API效果对比（完结~~~）-GPT4o试一试)
*   5[5\. 结论](#id-图片识别API效果对比（完结~~~）-结论)

1\. 讯飞开放平台
==========

1.1. 人脸特征分析接口API
----------------

限制条件：

1.  图片大小不能超过800k，这就需要压缩
2.  任意操作系统，但因**不支持跨域**不适用于浏览器，请在后端调用接口
3.  图片周边不能有太多无关背景干扰，这就需要以人像为中心裁剪图片

**图片1**

图片

API类别

接口返回

结论

响应平均时间 

![](/download/thumbnails/129190536/test1-boy-c.jpg?version=1&modificationDate=1722501561138&api=v2)

年龄

 [test1-boy-c-all.txt](/download/attachments/129190536/test1-boy-c-all.txt?version=1&modificationDate=1725162407709&api=v2)

*   年龄识别**错误**

1.08 秒

性别

*   性别识别**错误**

0.74 秒

颜值

*   颜值识别**正确**

11.21 秒

表情

*   表情识别 **不确定**

0.7 秒

**图片2**

图片

API类别

接口返回

结论

响应平均时间 

![](/download/thumbnails/129190536/test3-boy.jpg?version=1&modificationDate=1722603440635&api=v2)

年龄

[test3-boy-all.txt](/download/attachments/129190536/test3-boy-all.txt?version=1&modificationDate=1725162440264&api=v2)

*   年龄识别**正确**

3.1秒

性别

*   性别识别**正确**

2.97秒

颜值

*   颜值识别**正确**

8.28秒

表情

*   表情识别 **不确定**

0.33秒

**图片3**

图片

API类别

接口返回

结论

响应平均时间 

![](/download/thumbnails/129190536/test4-boy.jpg?version=1&modificationDate=1722608022937&api=v2)

年龄

[test4-boy-all.txt](/download/attachments/129190536/test4-boy-all.txt?version=1&modificationDate=1725162464426&api=v2)

*   年龄识别**正确**

3.03秒

性别

*   性别识别**正确**

3.03秒

颜值

*   颜值识别**正确**

0.37秒

表情

*   表情识别 **不确定**

0.37秒

1.2. 人脸检测和属性分析接口API
-------------------

限制条件：

1.  base64编码后大小不超过4M
2.  清晰的人脸照片，人脸大小不小于30\*30像素，其中人脸俯仰角、左右偏航角、人脸翻转角60°以内识别效果更好

图片

API类别

API

接口返回

备注

![](/download/attachments/129190536/image2024-7-29_22-13-10.png?version=1&modificationDate=1722262391343&api=v2)

  

  

  

  

  

人脸检测和属性分析

  

  

  

  

  

https: //[api.xf-yun.com/v1/private/s67c9c78c](http://api.xf-yun.com/v1/private/s67c9c78c)

这是一名男性，戴眼镜，短发，表情正常，没有胡子，没戴口罩

识别正确

![](/download/thumbnails/129190536/test3-boy.jpg?version=1&modificationDate=1722603440635&api=v2)

这是一名男性，戴眼镜，短发，表情正常，没有胡子，没戴口罩

识别正确

![](/download/thumbnails/129190536/test4-boy.jpg?version=1&modificationDate=1722608022937&api=v2)

这是一名女性，不戴眼镜，短发，表情正常，没有胡子，没戴口罩

性别错误，其他识别正确

1.3. 年龄、性别、颜值、表情API与枚举值
-----------------------

### 1.3.1. 年龄

接口API：[http://tupapi.xfyun.cn/v1/age](http://tupapi.xfyun.cn/v1/age)

返回主要看label字段内容

label值范围及对应年龄段：

label值

对应年龄段(岁)

label值

对应年龄段(岁)

label值

对应年龄段(岁)

label值

对应年龄段(岁)

0

0-1

7

41-50

1

2-5

8

51-60

2

6-10

9

61-80

3

11-15

10

80以上

4

16-20

11

其他

5

21-25

12

26-30

6

31-40

  

  

### 1.3.2. 性别

接口API：[http://tupapi.xfyun.cn/v1/sex](http://tupapi.xfyun.cn/v1/sex)

*   0–男人
*   1–女人
*   2–难以辨认
*   3–多人

### 1.3.3. 颜值

接口API：[http://tupapi.xfyun.cn/v1/face\_score](http://tupapi.xfyun.cn/v1/face_score)

*   0–漂亮
*   1–好看
*   2–普通
*   3–难看
*   4–其他
*   5–半人脸
*   6–多人

### 1.3.4. 表情

接口API：[http://tupapi.xfyun.cn/v1/expression](http://tupapi.xfyun.cn/v1/expression)

*   0–其他(非人脸表情图片)
*   1–其他表情
*   2–喜悦
*   3–愤怒
*   4–悲伤
*   5–悲伤
*   6–厌恶
*   7--中性

2\. 图片处理
========

目前交互屏拍摄的照片，存在拍摄景深、模糊、人脸过小、图片体积较大等问题，因此需要将照片做一定的图像处理，来满足需求

2.1. 原图片
--------

![](/download/thumbnails/129190536/IMG_20240729_221016.jpg?version=1&modificationDate=1725196233232&api=v2)![](/download/thumbnails/129190536/IMG_20240729_221022.jpg?version=1&modificationDate=1725196235023&api=v2)![](/download/thumbnails/129190536/IMG_20240805_155819.jpg?version=1&modificationDate=1725196235864&api=v2)![](/download/thumbnails/129190536/IMG_20240729_221031.jpg?version=1&modificationDate=1725196235522&api=v2)![](/download/thumbnails/129190536/IMG_20240805_155846.jpg?version=1&modificationDate=1725196237678&api=v2)![](/download/thumbnails/129190536/IMG_20240805_155854.jpg?version=1&modificationDate=1725196238330&api=v2)![](/download/thumbnails/129190536/IMG_20240805_155828.jpg?version=1&modificationDate=1725196236184&api=v2)![](/download/thumbnails/129190536/IMG_20240805_155834.jpg?version=1&modificationDate=1725196236941&api=v2)![](/download/thumbnails/129190536/IMG_20240805_155939.jpg?version=1&modificationDate=1725196239375&api=v2)![](/download/thumbnails/129190536/IMG_20240805_160143.jpg?version=1&modificationDate=1725196244092&api=v2)![](/download/thumbnails/129190536/IMG_20240805_155938.jpg?version=1&modificationDate=1725196239041&api=v2)![](/download/thumbnails/129190536/IMG_20240805_155947.jpg?version=1&modificationDate=1725196239680&api=v2)![](/download/thumbnails/129190536/IMG_20240805_155849.jpg?version=1&modificationDate=1725196238024&api=v2)![](/download/thumbnails/129190536/IMG_20240805_155909.jpg?version=1&modificationDate=1725196238610&api=v2)![](/download/thumbnails/129190536/IMG_20240805_155959.jpg?version=1&modificationDate=1725196240598&api=v2)![](/download/thumbnails/129190536/IMG_20240805_160228.jpg?version=1&modificationDate=1725196245356&api=v2)![](/download/thumbnails/129190536/IMG_20240805_160021.jpg?version=1&modificationDate=1725196241262&api=v2)![](/download/thumbnails/129190536/IMG_20240805_160020.jpg?version=1&modificationDate=1725196240936&api=v2)![](/download/thumbnails/129190536/IMG_20240805_160245.jpg?version=1&modificationDate=1725196246332&api=v2)![](/download/thumbnails/129190536/IMG_20240805_160113.jpg?version=1&modificationDate=1725196242868&api=v2)![](/download/thumbnails/129190536/IMG_20240805_160124.jpg?version=1&modificationDate=1725196243551&api=v2)![](/download/thumbnails/129190536/IMG_20240805_160149.jpg?version=1&modificationDate=1725196244776&api=v2)![](/download/thumbnails/129190536/IMG_20240805_160114.jpg?version=1&modificationDate=1725196243231&api=v2)![](/download/thumbnails/129190536/IMG_20240805_155832.jpg?version=1&modificationDate=1725196236563&api=v2)![](/download/thumbnails/129190536/IMG_20240805_155843.jpg?version=1&modificationDate=1725196237304&api=v2)![](/download/thumbnails/129190536/IMG_20240805_160227.jpg?version=1&modificationDate=1725196245043&api=v2)![](/download/thumbnails/129190536/IMG_20240805_155956.jpg?version=1&modificationDate=1725196240024&api=v2)![](/download/thumbnails/129190536/IMG_20240805_160112.jpg?version=1&modificationDate=1725196242616&api=v2)![](/download/thumbnails/129190536/IMG_20240805_160146.jpg?version=1&modificationDate=1725196244463&api=v2)![](/download/thumbnails/129190536/IMG_20240805_160049.jpg?version=1&modificationDate=1725196241808&api=v2)![](/download/thumbnails/129190536/IMG_20240805_160048.jpg?version=1&modificationDate=1725196241553&api=v2)![](/download/thumbnails/129190536/IMG_20240805_155957.jpg?version=1&modificationDate=1725196240332&api=v2)![](/download/thumbnails/129190536/IMG_20240805_160058.jpg?version=1&modificationDate=1725196242101&api=v2)![](/download/thumbnails/129190536/IMG_20240805_160128.jpg?version=1&modificationDate=1725196243839&api=v2)![](/download/thumbnails/129190536/IMG_20240805_160059.jpg?version=1&modificationDate=1725196242360&api=v2)![](/download/thumbnails/129190536/IMG_20240805_160247.jpg?version=1&modificationDate=1725196246601&api=v2)![](/download/thumbnails/129190536/IMG_20240805_160242.jpg?version=1&modificationDate=1725196246045&api=v2)![](/download/thumbnails/129190536/IMG_20240805_160231.jpg?version=1&modificationDate=1725196245674&api=v2)

2.2. 处理后的图片
-----------

![](/download/thumbnails/129190536/cropped_IMG_20240729_221016.jpg?version=1&modificationDate=1725196914623&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240729_221022.jpg?version=1&modificationDate=1725196914800&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_155846.jpg?version=1&modificationDate=1725196915729&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_155832.jpg?version=1&modificationDate=1725196915308&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_155834.jpg?version=1&modificationDate=1725196915467&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_155843.jpg?version=1&modificationDate=1725196915605&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_155828.jpg?version=1&modificationDate=1725196915130&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_160112.jpg?version=1&modificationDate=1725196917373&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_155956.jpg?version=1&modificationDate=1725196916259&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_160113.jpg?version=1&modificationDate=1725196917500&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_160124.jpg?version=1&modificationDate=1725196917768&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_160149.jpg?version=1&modificationDate=1725196918346&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_160048.jpg?version=1&modificationDate=1725196916798&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_160128.jpg?version=1&modificationDate=1725196917895&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_160020.jpg?version=1&modificationDate=1725196916647&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_160231.jpg?version=1&modificationDate=1725196918861&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_155849.jpg?version=1&modificationDate=1725196915879&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_160228.jpg?version=1&modificationDate=1725196918729&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240729_221031.jpg?version=1&modificationDate=1725196915007&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_160242.jpg?version=1&modificationDate=1725196919005&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_160227.jpg?version=1&modificationDate=1725196918573&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_155938.jpg?version=1&modificationDate=1725196915991&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_160059.jpg?version=1&modificationDate=1725196917234&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_155957.jpg?version=1&modificationDate=1725196916379&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_155939.jpg?version=1&modificationDate=1725196916137&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_160049.jpg?version=1&modificationDate=1725196916934&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_160058.jpg?version=1&modificationDate=1725196917064&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_160245.jpg?version=1&modificationDate=1725196919141&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_160143.jpg?version=1&modificationDate=1725196918036&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_160114.jpg?version=1&modificationDate=1725196917618&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_155959.jpg?version=1&modificationDate=1725196916504&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_160146.jpg?version=1&modificationDate=1725196918213&api=v2)![](/download/thumbnails/129190536/cropped_IMG_20240805_160247.jpg?version=1&modificationDate=1725196919275&api=v2)

2.3. 图像处理程序
-----------

人脸提取，使用Dlib的HOG人脸检测器

**人脸提取\_image\_reg.py**  展开源码

[expand source](#)[?](#)

`import` `cv2`

`import` `dlib`

`# 使用Dlib的HOG人脸检测器`

`def` `crop_face_dlib(image_path, output_path, crop_width``=``900``, crop_height``=``900``, margin``=``0.2``):`

    `# Load the image`

    `image` `=` `cv2.imread(image_path)`

    `gray` `=` `cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)`

    `# Initialize dlib's face detector (HOG-based)`

    `detector` `=` `dlib.get_frontal_face_detector()`

    `# Detect faces in the image`

    `faces` `=` `detector(gray)`

    `if` `len``(faces)` `=``=` `0``:`

        `print``(``"No face detected."``)`

        `return`

    `# Select the first detected face`

    `face` `=` `faces[``0``]`

    `x, y, w, h` `=` `face.left(), face.top(), face.width(), face.height()`

    `# Calculate the crop range (ensuring it's within image bounds)`

    `center_x, center_y` `=` `x` `+` `w` `/``/` `2``, y` `+` `h` `/``/` `2`

    `# 为头顶顶部预留额外空间`

    `top_extra_margin` `=` `int``(h` `*` `margin)`

    `crop_x1` `=` `max``(center_x` `-` `crop_width` `/``/` `2``,` `0``)`

    `crop_y1` `=` `max``(center_y` `-` `top_extra_margin` `-` `crop_height` `/``/` `2``,` `0``)`

    `crop_x2` `=` `min``(center_x` `+` `crop_width` `/``/` `2``, image.shape[``1``])`

    `crop_y2` `=` `min``(center_y` `+` `crop_height` `/``/` `2``, image.shape[``0``])`

    `cropped_image` `=` `image[crop_y1:crop_y2, crop_x1:crop_x2]`

    `# Save the cropped image`

    `cv2.imwrite(output_path, cropped_image)`

    `print``(f``"Cropped image saved to {output_path}"``)`

  

输入对应源文件图片，进行处理即可

**图片处理\_process\_image.py**  展开源码

[expand source](#)[?](#)

`import` `shutil`

`from` `utils.iflytek.image_reg` `import` `crop_face, crop_face_dlib`

`from` `utils.iflytek.image_compression` `import` `*`

`Input_folder` `=` `fr``"D:\gitlab\flaskProjectNew\utils\iflytek\img\Pictures"`

`Output_folder` `=` `fr``"D:\gitlab\flaskProjectNew\utils\iflytek\img\crop"`

`def` `process_image(input_path, cropped_path, output_path, max_size_kb``=``800``):`

    `try``:`

        `# 裁剪人像`

        `if` `crop_face_dlib(input_path, cropped_path):`

            `# 压缩图像`

            `compress_image(cropped_path, output_path, max_size_kb)`

            `print``(f``"Processed and saved to {output_path}"``)`

        `else``:`

            `print``(f``"No face detected in {input_path}"``)`

    `except` `Exception as e:`

        `print``(f``"Error processing {input_path}: {e}"``)`

`def` `process_images_in_folder(input_folder, output_folder, max_size_kb``=``800``):`

    `# 清空或创建输出文件夹`

    `clear_or_create_folder(output_folder)`

    `# 遍历输入文件夹中的所有文件`

    `for` `filename` `in` `os.listdir(input_folder):`

        `if` `not` `filename.lower().endswith((``'.png'``,` `'.jpg'``,` `'.jpeg'``,` `'.gif'``,` `'.bmp'``)):`

            `continue`

        `input_path` `=` `os.path.join(input_folder, filename)`

        `cropped_path` `=` `os.path.join(output_folder, f``"cropped_{filename}"``)`

        `output_path` `=` `os.path.join(output_folder, f``"compressed_{filename}"``)`

        `process_image(input_path, cropped_path, output_path, max_size_kb)`

`def` `clear_or_create_folder(folder_path):`

    `# 如果文件夹存在，清空其中内容`

    `if` `os.path.exists(folder_path):`

        `shutil.rmtree(folder_path)`

    `# 重新创建文件夹`

    `os.makedirs(folder_path)`

`process_images_in_folder(Input_folder, Output_folder)`

  

3\. 真实图片处理结果分析
==============

3.1. 人脸检测和属性分析
--------------

针对真实处理后的图片，即通过2.2中的图片，进行人脸特征分析、人脸检测和属性分析，对应的是1.1与1.2中的操作。

完全正确率为：25/33=75.7%；识别错误分布为：发型错误3次（产品需求上没应用场景），性别错误6次（致命错误），未成功识别1次

单接口响应速度：0.4秒

优化措施：对图像进行预处理，可以增强图像质量，从而提高检测准确度。预处理方法有：伽玛校正、直方图均衡等

API类别：    人脸检测和属性分析

API：    https: //[api.xf-yun.com/v1/private/s67c9c78c](http://api.xf-yun.com/v1/private/s67c9c78c)

结果汇总文档：[result.log](/download/attachments/129190536/iflytek.log?version=1&modificationDate=1725208754886&api=v2)

序号

图片

文件名

接口返回

备注

1

![](/download/thumbnails/129190536/cropped_IMG_20240729_221016.jpg?version=1&modificationDate=1725196914623&api=v2)

cropped\_IMG\_20240729\_221016

这是一名男性，戴眼镜，短发，表情正常，没有胡子，没戴口罩

识别正确

2

![](/download/thumbnails/129190536/cropped_IMG_20240729_221022.jpg?version=1&modificationDate=1725196914800&api=v2)

cropped\_IMG\_20240729\_221022

这是一名男性，戴眼镜，短发，表情正常，没有胡子，没戴口罩

识别正确

3

![](/download/thumbnails/129190536/cropped_IMG_20240729_221031.jpg?version=1&modificationDate=1725196915007&api=v2) 

cropped\_IMG\_20240729\_221031

这是一名男性，戴眼镜，短发，表情正常，没有胡子，没戴口罩

识别正确

4

![](/download/thumbnails/129190536/cropped_IMG_20240805_155828.jpg?version=1&modificationDate=1725196915130&api=v2)

cropped\_IMG\_20240805\_155828

这是一名男性，戴眼镜，短发，表情高兴，没有胡子，没戴口罩

识别正确

5

![](/download/thumbnails/129190536/cropped_IMG_20240805_155832.jpg?version=1&modificationDate=1725196915308&api=v2)

cropped\_IMG\_20240805\_155832

这是一名男性，不戴眼镜，短发，表情悲伤，没有胡子，没戴口罩

识别正确

6

![](/download/thumbnails/129190536/cropped_IMG_20240805_155834.jpg?version=1&modificationDate=1725196915467&api=v2)

cropped\_IMG\_20240805\_155834

这是一名男性，不戴眼镜，短发，表情正常，没有胡子，没戴口罩

识别正确

7

![](/download/thumbnails/129190536/cropped_IMG_20240805_155843.jpg?version=1&modificationDate=1725196915605&api=v2)

  

cropped\_IMG\_20240805\_155843

这是一名女性，不戴眼镜，长发，表情高兴，没有胡子，没戴口罩

性别错误，发型错误，其他识别正确

8

![](/download/thumbnails/129190536/cropped_IMG_20240805_155846.jpg?version=1&modificationDate=1725196915729&api=v2)

cropped\_IMG\_20240805\_155846

这是一名男性，不戴眼镜，短发，表情高兴，没有胡子，没戴口罩

识别正确

9

![](/download/thumbnails/129190536/cropped_IMG_20240805_155849.jpg?version=1&modificationDate=1725196915879&api=v2)

cropped\_IMG\_20240805\_155849

这是一名男性，不戴眼镜，短发，表情正常，没有胡子，没戴口罩

识别正确

10

![](/download/thumbnails/129190536/cropped_IMG_20240805_155938.jpg?version=1&modificationDate=1725196915991&api=v2)

cropped\_IMG\_20240805\_155938

这是一名女性，不戴眼镜，长发，表情高兴，没有胡子，没戴口罩

性别错误，发型错误，其他识别正确

11

![](/download/thumbnails/129190536/cropped_IMG_20240805_155939.jpg?version=1&modificationDate=1725196916137&api=v2)

cropped\_IMG\_20240805\_155939

这是一名男性，戴眼镜，短发，表情正常，没有胡子，没戴口罩

识别正确

12

![](/download/thumbnails/129190536/cropped_IMG_20240805_155956.jpg?version=1&modificationDate=1725196916259&api=v2)

cropped\_IMG\_20240805\_155956

这是一名男性，戴眼镜，短发，表情正常，没有胡子，没戴口罩

识别正确

13

![](/download/thumbnails/129190536/cropped_IMG_20240805_155957.jpg?version=1&modificationDate=1725196916379&api=v2)

cropped\_IMG\_20240805\_155957

这是一名男性，戴眼镜，短发，表情正常，没有胡子，没戴口罩

识别正确

14

![](/download/thumbnails/129190536/cropped_IMG_20240805_155959.jpg?version=1&modificationDate=1725196916504&api=v2)

cropped\_IMG\_20240805\_155959

这是一名女性，戴眼镜，短发，表情正常，没有胡子，没戴口罩

性别错误，其他识别正确

15

![](/download/thumbnails/129190536/cropped_IMG_20240805_160020.jpg?version=1&modificationDate=1725196916647&api=v2)

cropped\_IMG\_20240805\_160020

未检测到人脸

  

16

![](/download/thumbnails/129190536/cropped_IMG_20240805_160048.jpg?version=1&modificationDate=1725196916798&api=v2)

cropped\_IMG\_20240805\_160048

这是一名女性，戴眼镜，长发，表情高兴，没有胡子，没戴口罩

识别正确

17

![](/download/thumbnails/129190536/cropped_IMG_20240805_160049.jpg?version=1&modificationDate=1725196916934&api=v2)

cropped\_IMG\_20240805\_160049

这是一名女性，戴眼镜，短发，表情正常，没有胡子，没戴口罩

性别错误，其他识别正确

18

![](/download/thumbnails/129190536/cropped_IMG_20240805_160058.jpg?version=1&modificationDate=1725196917064&api=v2)

cropped\_IMG\_20240805\_160058

这是一名女性，戴眼镜，长发，表情高兴，没有胡子，没戴口罩

识别正确

19

![](/download/thumbnails/129190536/cropped_IMG_20240805_160059.jpg?version=1&modificationDate=1725196917234&api=v2)

cropped\_IMG\_20240805\_160059

这是一名女性，戴眼镜，长发，表情正常，没有胡子，没戴口罩

识别正确

20

![](/download/thumbnails/129190536/cropped_IMG_20240805_160112.jpg?version=1&modificationDate=1725196917373&api=v2)

cropped\_IMG\_20240805\_160112

这是一名女性，戴眼镜，长发，表情高兴，没有胡子，没戴口罩

识别正确

21

![](/download/thumbnails/129190536/cropped_IMG_20240805_160113.jpg?version=1&modificationDate=1725196917500&api=v2)

cropped\_IMG\_20240805\_160113

这是一名男性，戴眼镜，短发，表情正常，没有胡子，没戴口罩

识别正确

22

![](/download/thumbnails/129190536/cropped_IMG_20240805_160114.jpg?version=1&modificationDate=1725196917618&api=v2)

cropped\_IMG\_20240805\_160114

这是一名男性，戴眼镜，短发，表情正常，没有胡子，没戴口罩

识别正确

23

![](/download/thumbnails/129190536/cropped_IMG_20240805_160124.jpg?version=1&modificationDate=1725196917768&api=v2)

cropped\_IMG\_20240805\_160124

这是一名女性，不戴眼镜，长发，表情高兴，没有胡子，没戴口罩

性别错误，其他识别正确

24

![](/download/thumbnails/129190536/cropped_IMG_20240805_160128.jpg?version=1&modificationDate=1725196917895&api=v2)

cropped\_IMG\_20240805\_160128

这是一名女性，戴眼镜，长发，表情高兴，没有胡子，没戴口罩

性别错误，其他识别正确

25

![](/download/thumbnails/129190536/cropped_IMG_20240805_160143.jpg?version=1&modificationDate=1725196918036&api=v2)

cropped\_IMG\_20240805\_160143

这是一名女性，不戴眼镜，光头，表情高兴，没有胡子，没戴口罩

发型错误，其他识别正确

26

![](/download/thumbnails/129190536/cropped_IMG_20240805_160146.jpg?version=1&modificationDate=1725196918213&api=v2)

cropped\_IMG\_20240805\_160146

这是一名女性，不戴眼镜，长发，表情高兴，没有胡子，没戴口罩

识别正确

27

![](/download/thumbnails/129190536/cropped_IMG_20240805_160149.jpg?version=1&modificationDate=1725196918346&api=v2)

cropped\_IMG\_20240805\_160149

这是一名女性，戴眼镜，长发，表情高兴，没有胡子，没戴口罩

识别正确

28

 ![](/download/thumbnails/129190536/cropped_IMG_20240805_160227.jpg?version=1&modificationDate=1725196918573&api=v2)

cropped\_IMG\_20240805\_160227

这是一名女性，不戴眼镜，长发，表情高兴，没有胡子，没戴口罩

识别正确

29

![](/download/thumbnails/129190536/cropped_IMG_20240805_160228.jpg?version=1&modificationDate=1725196918729&api=v2)

cropped\_IMG\_20240805\_160228

这是一名女性，不戴眼镜，长发，表情悲伤，没有胡子，没戴口罩

识别正确

30

  

![](/download/thumbnails/129190536/cropped_IMG_20240805_160231.jpg?version=1&modificationDate=1725196918861&api=v2)

cropped\_IMG\_20240805\_160231

  

这是一名女性，不戴眼镜，长发，表情高兴，没有胡子，没戴口罩

识别正确

31

![](/download/thumbnails/129190536/cropped_IMG_20240805_160242.jpg?version=1&modificationDate=1725196919005&api=v2)

cropped\_IMG\_20240805\_160242

这是一名女性，不戴眼镜，长发，表情高兴，没有胡子，没戴口罩

识别正确

32

![](/download/thumbnails/129190536/cropped_IMG_20240805_160245.jpg?version=1&modificationDate=1725196919141&api=v2)

cropped\_IMG\_20240805\_160245

这是一名女性，戴眼镜，长发，表情高兴，没有胡子，没戴口罩

识别正确

33

![](/download/thumbnails/129190536/cropped_IMG_20240805_160247.jpg?version=1&modificationDate=1725196919275&api=v2)

cropped\_IMG\_20240805\_160247

这是一名女性，戴眼镜，长发，表情高兴，没有胡子，没戴口罩

识别正确

3.2. 人脸特征分析
-----------

完全正确率为：26/33=78.7%；识别错误分布为：年龄错误6次（识别为 其他，有1次偏大到了40+岁），性别错误1次

单接口响应速度：95%的时间上，接口响应在0.5秒以下，少量耗时较长

API类别：    人脸特征分析

序号

图片

文件名

接口返回

备注

1

![](/download/thumbnails/129190536/cropped_IMG_20240729_221016.jpg?version=1&modificationDate=1725196914623&api=v2)

cropped\_IMG\_20240729\_221016

*   年龄识别**正确**， 响应平均时间5.93秒
*   性别识别**正确**， 响应平均时间5.63秒
*   颜值识别**正确**， 响应平均时间0.43秒
*   表情识别 **正确**， 响应平均时间5.68秒

 识别正确

2

![](/download/thumbnails/129190536/cropped_IMG_20240729_221022.jpg?version=1&modificationDate=1725196914800&api=v2)

cropped\_IMG\_20240729\_221022

*   年龄识别**正确**， 响应平均时间3.0秒
*   性别识别**正确**， 响应平均时间0.46秒
*   颜值识别**正确**， 响应平均时间0.4秒
*   表情识别 **正确**， 响应平均时间0.4秒

识别正确

3

![](/download/thumbnails/129190536/cropped_IMG_20240729_221031.jpg?version=1&modificationDate=1725196915007&api=v2) 

cropped\_IMG\_20240729\_221031

*   年龄识别**正确**， 响应平均时间0.4秒
*   性别识别**正确**， 响应平均时间0.39秒
*   颜值识别**正确**， 响应平均时间0.48秒
*   表情识别 **正确**， 响应平均时间0.38秒

识别正确

4

![](/download/thumbnails/129190536/cropped_IMG_20240805_155828.jpg?version=1&modificationDate=1725196915130&api=v2)

cropped\_IMG\_20240805\_155828

*   年龄识别**正确**， 响应平均时间0.36秒
*   性别识别**正确**， 响应平均时间0.37秒
*   颜值识别**正确**， 响应平均时间0.35秒
*   表情识别 **正确**， 响应平均时间0.37秒

识别正确

5

![](/download/thumbnails/129190536/cropped_IMG_20240805_155832.jpg?version=1&modificationDate=1725196915308&api=v2)

cropped\_IMG\_20240805\_155832

*   年龄识别**正确**， 响应平均时间3.06秒
*   性别识别**正确**， 响应平均时间0.36秒
*   颜值识别**正确**， 响应平均时间0.34秒
*   表情识别**正确**， 响应平均时间0.35秒

识别正确

6

![](/download/thumbnails/129190536/cropped_IMG_20240805_155834.jpg?version=1&modificationDate=1725196915467&api=v2)

cropped\_IMG\_20240805\_155834

*   年龄识别**正确**， 响应平均时间0.37秒
*   性别识别**正确**， 响应平均时间0.36秒
*   颜值识别**正确**， 响应平均时间0.34秒
*   表情识别 **正确**， 响应平均时间0.35秒

识别正确

7

![](/download/thumbnails/129190536/cropped_IMG_20240805_155843.jpg?version=1&modificationDate=1725196915605&api=v2)

  

cropped\_IMG\_20240805\_155843

*   年龄识别**正确**， 响应平均时间0.38秒
*   性别识别**正确**， 响应平均时间0.38秒
*   颜值识别**正确**， 响应平均时间0.36秒
*   表情识别 **正确**， 响应平均时间0.38秒

识别正确

8

![](/download/thumbnails/129190536/cropped_IMG_20240805_155846.jpg?version=1&modificationDate=1725196915729&api=v2)

cropped\_IMG\_20240805\_155846

*   年龄识别**正确**， 响应平均时间0.37秒
*   性别识别**正确**， 响应平均时间0.42秒
*   颜值识别**正确**， 响应平均时间0.32秒
*   表情识别 **正确**， 响应平均时间0.39秒

识别正确

9

![](/download/thumbnails/129190536/cropped_IMG_20240805_155849.jpg?version=1&modificationDate=1725196915879&api=v2)

cropped\_IMG\_20240805\_155849

*   年龄识别**正确**， 响应平均时间0.38秒
*   性别识别**正确**， 响应平均时间0.39秒
*   颜值识别**正确**， 响应平均时间0.37秒
*   表情识别 **正确**， 响应平均时间0.33秒

识别正确

10

![](/download/thumbnails/129190536/cropped_IMG_20240805_155938.jpg?version=1&modificationDate=1725196915991&api=v2)

cropped\_IMG\_20240805\_155938

*   年龄识别**错误**， 响应平均时间0.38秒
*   性别识别**正确**， 响应平均时间0.37秒
*   颜值识别**正确**， 响应平均时间0.4\`秒
*   表情识别 **正确**， 响应平均时间0.33秒

年龄错误，其他识别正确

11

![](/download/thumbnails/129190536/cropped_IMG_20240805_155939.jpg?version=1&modificationDate=1725196916137&api=v2)

cropped\_IMG\_20240805\_155939

*   年龄识别**正确**， 响应平均时间0.38秒
*   性别识别**正确**， 响应平均时间0.36秒
*   颜值识别**正确**， 响应平均时间0.34\`秒
*   表情识别 **正确**， 响应平均时间0.37秒

识别正确

12

![](/download/thumbnails/129190536/cropped_IMG_20240805_155956.jpg?version=1&modificationDate=1725196916259&api=v2)

cropped\_IMG\_20240805\_155956

*   年龄识别**正确**， 响应平均时间0.37秒
*   性别识别**正确**， 响应平均时间0.37秒
*   颜值识别**正确**， 响应平均时间0.33\`秒
*   表情识别 **正确**， 响应平均时间0.32秒

识别正确

13

![](/download/thumbnails/129190536/cropped_IMG_20240805_155957.jpg?version=1&modificationDate=1725196916379&api=v2)

cropped\_IMG\_20240805\_155957

*   年龄识别**正确**， 响应平均时间0.37秒
*   性别识别**正确**， 响应平均时间0.37秒
*   颜值识别**正确**， 响应平均时间0.33秒
*   表情识别 **正确**， 响应平均时间0.32秒

识别正确

14

![](/download/thumbnails/129190536/cropped_IMG_20240805_155959.jpg?version=1&modificationDate=1725196916504&api=v2)

cropped\_IMG\_20240805\_155959

*   年龄识别**错误**， 响应平均时间0.4秒
*   性别识别**正确**， 响应平均时间0.39秒
*   颜值识别**正确**， 响应平均时间10.73秒
*   表情识别 **正确**， 响应平均时间0.36秒

年龄错误，其他识别正确

15

![](/download/thumbnails/129190536/cropped_IMG_20240805_160020.jpg?version=1&modificationDate=1725196916647&api=v2)

cropped\_IMG\_20240805\_160020

*   年龄识别**错误**， 响应平均时间0.37秒
*   性别识别**正确**， 响应平均时间0.34秒
*   颜值识别**错误**， 响应平均时间0.4秒
*   表情识别 **正确**， 响应平均时间0.37秒

年龄错误，颜值识别为多人，其他识别正确

16

![](/download/thumbnails/129190536/cropped_IMG_20240805_160048.jpg?version=1&modificationDate=1725196916798&api=v2)

cropped\_IMG\_20240805\_160048

*   年龄识别**正确**， 响应平均时间0.36秒
*   性别识别**错误**， 响应平均时间0.35秒
*   颜值识别**正确**， 响应平均时间0.34秒
*   表情识别 **正确**， 响应平均时间0.37秒

性别错误，其他识别正确

17

![](/download/thumbnails/129190536/cropped_IMG_20240805_160049.jpg?version=1&modificationDate=1725196916934&api=v2)

cropped\_IMG\_20240805\_160049

*   年龄识别**正确**， 响应平均时间0.4秒
*   性别识别**正确**， 响应平均时间0.38秒
*   颜值识别**正确**， 响应平均时间0.36秒
*   表情识别 **正确**， 响应平均时间0.4秒

识别正确

18

![](/download/thumbnails/129190536/cropped_IMG_20240805_160058.jpg?version=1&modificationDate=1725196917064&api=v2)

cropped\_IMG\_20240805\_160058

*   年龄识别**正确**， 响应平均时间0.39秒
*   性别识别**正确**， 响应平均时间3.04秒
*   颜值识别**正确**， 响应平均时间0.36秒
*   表情识别 **正确**， 响应平均时间0.37秒

识别正确

19

![](/download/thumbnails/129190536/cropped_IMG_20240805_160059.jpg?version=1&modificationDate=1725196917234&api=v2)

cropped\_IMG\_20240805\_160059

*   年龄识别**正确**， 响应平均时间0.34秒
*   性别识别**正确**， 响应平均时间0.36秒
*   颜值识别**正确**， 响应平均时间0.35秒
*   表情识别 **正确**， 响应平均时间0.33秒

识别正确

20

![](/download/thumbnails/129190536/cropped_IMG_20240805_160112.jpg?version=1&modificationDate=1725196917373&api=v2)

cropped\_IMG\_20240805\_160112

*   年龄识别**正确**， 响应平均时间0.37秒
*   性别识别**正确**， 响应平均时间0.36秒
*   颜值识别**正确**， 响应平均时间0.42秒
*   表情识别 **正确**， 响应平均时间0.36秒

识别正确

21

![](/download/thumbnails/129190536/cropped_IMG_20240805_160113.jpg?version=1&modificationDate=1725196917500&api=v2)

cropped\_IMG\_20240805\_160113

*   年龄识别**正确**， 响应平均时间0.37秒
*   性别识别**正确**， 响应平均时间0.37秒
*   颜值识别**正确**， 响应平均时间0.36秒
*   表情识别 **正确**， 响应平均时间0.36秒

识别正确

22

![](/download/thumbnails/129190536/cropped_IMG_20240805_160114.jpg?version=1&modificationDate=1725196917618&api=v2)

cropped\_IMG\_20240805\_160114

*   年龄识别**正确**， 响应平均时间0.37秒
*   性别识别**正确**， 响应平均时间0.38秒
*   颜值识别**正确**， 响应平均时间0.34秒
*   表情识别 **正确**， 响应平均时间0.38秒

识别正确

23

![](/download/thumbnails/129190536/cropped_IMG_20240805_160124.jpg?version=1&modificationDate=1725196917768&api=v2)

cropped\_IMG\_20240805\_160124

*   年龄识别**错误**， 响应平均时间0.37秒
*   性别识别**正确**， 响应平均时间0.37秒
*   颜值识别**正确**， 响应平均时间0.47秒
*   表情识别 **正确**， 响应平均时间0.35秒

年龄错误，其他识别正确

24

![](/download/thumbnails/129190536/cropped_IMG_20240805_160128.jpg?version=1&modificationDate=1725196917895&api=v2)

cropped\_IMG\_20240805\_160128

*   年龄识别**错误**， 响应平均时间0.38秒
*   性别识别**正确**， 响应平均时间0.36秒
*   颜值识别**正确**， 响应平均时间0.41秒
*   表情识别 **正确**， 响应平均时间0.39秒

年龄错误，其他识别正确

25

![](/download/thumbnails/129190536/cropped_IMG_20240805_160143.jpg?version=1&modificationDate=1725196918036&api=v2)

cropped\_IMG\_20240805\_160143

*   年龄识别**正确**， 响应平均时间0.36秒
*   性别识别**正确**， 响应平均时间0.35秒
*   颜值识别**正确**， 响应平均时间0.33秒
*   表情识别 **正确**， 响应平均时间0.35秒

识别正确

26

![](/download/thumbnails/129190536/cropped_IMG_20240805_160146.jpg?version=1&modificationDate=1725196918213&api=v2)

cropped\_IMG\_20240805\_160146

*   年龄识别**正确**， 响应平均时间0.39秒
*   性别识别**正确**， 响应平均时间0.35秒
*   颜值识别**正确**， 响应平均时间0.36秒
*   表情识别 **正确**， 响应平均时间0.37秒

识别正确

27

![](/download/thumbnails/129190536/cropped_IMG_20240805_160149.jpg?version=1&modificationDate=1725196918346&api=v2)

cropped\_IMG\_20240805\_160149

*   年龄识别**正确**， 响应平均时间0.38秒
*   性别识别**正确**， 响应平均时间0.44秒
*   颜值识别**正确**， 响应平均时间10.72秒
*   表情识别 **正确**， 响应平均时间0.36秒

识别正确

28

 ![](/download/thumbnails/129190536/cropped_IMG_20240805_160227.jpg?version=1&modificationDate=1725196918573&api=v2)

cropped\_IMG\_20240805\_160227

*   年龄识别**正确**， 响应平均时间0.37秒
*   性别识别**正确**， 响应平均时间0.37秒
*   颜值识别**正确**， 响应平均时间0.32秒
*   表情识别 **正确**， 响应平均时间0.4秒

识别正确

29

![](/download/thumbnails/129190536/cropped_IMG_20240805_160228.jpg?version=1&modificationDate=1725196918729&api=v2)

cropped\_IMG\_20240805\_160228

*   年龄识别**正确**， 响应平均时间0.4秒
*   性别识别**正确**， 响应平均时间0.42秒
*   颜值识别**正确**， 响应平均时间0.4秒
*   表情识别 **正确**， 响应平均时间0.37秒

识别正确

30

  

![](/download/thumbnails/129190536/cropped_IMG_20240805_160231.jpg?version=1&modificationDate=1725196918861&api=v2)

cropped\_IMG\_20240805\_160231

  

*   年龄识别**错误**， 响应平均时间0.36秒
*   性别识别**正确**， 响应平均时间0.39秒
*   颜值识别**正确**， 响应平均时间0.34秒
*   表情识别 **正确**， 响应平均时间0.38秒

年龄错误，其他识别正确

31

![](/download/thumbnails/129190536/cropped_IMG_20240805_160242.jpg?version=1&modificationDate=1725196919005&api=v2)

cropped\_IMG\_20240805\_160242

*   年龄识别**正确**， 响应平均时间3.02秒
*   性别识别**正确**， 响应平均时间0.37秒
*   颜值识别**正确**， 响应平均时间0.35秒
*   表情识别 **正确**， 响应平均时间0.33秒

识别正确

32

![](/download/thumbnails/129190536/cropped_IMG_20240805_160245.jpg?version=1&modificationDate=1725196919141&api=v2)

cropped\_IMG\_20240805\_160245

*   年龄识别**正确**， 响应平均时间0.4秒
*   性别识别**正确**， 响应平均时间0.42秒
*   颜值识别**正确**， 响应平均时间0.34秒
*   表情识别 **正确**， 响应平均时间0.35秒

识别正确

33

![](/download/thumbnails/129190536/cropped_IMG_20240805_160247.jpg?version=1&modificationDate=1725196919275&api=v2)

cropped\_IMG\_20240805\_160247

*   年龄识别**正确**， 响应平均时间0.38秒
*   性别识别**正确**， 响应平均时间0.37秒
*   颜值识别**正确**， 响应平均时间0.4秒
*   表情识别 **正确**， 响应平均时间0.36秒

识别正确

  

4\. GPT4o试一试
============

响应很快，但没办法一次性输入太多的图片分析，chatgpt官网会限制使用。通过API接口可以得到如下结果：

完整数据：

 [![](/rest/documentConversion/latest/conversion/thumbnail/134055483/1)](/download/attachments/129190536/vision.log?version=1&modificationDate=1725467081676&api=v2) text file

性别识别正确：100%

年龄识别：87%（哈哈，不同的角度影响识别，识别准确率可达90%以上）

响应速度：3.97秒

GPT4o

序号

图片

文件名

接口返回

备注

1

![](/download/thumbnails/129190536/cropped_IMG_20240729_221016.jpg?version=1&modificationDate=1725196914623&api=v2)

cropped\_IMG\_20240729\_221016

这是一名男性，年龄35-45岁，颜值普通，戴眼镜，短发，表情正常，没有胡子，没有戴口罩

识别正确

2

![](/download/thumbnails/129190536/cropped_IMG_20240729_221022.jpg?version=1&modificationDate=1725196914800&api=v2)

cropped\_IMG\_20240729\_221022

这是一名男性，年龄在30-40岁之间，颜值普通，戴眼镜，短发，表情正常，没有胡子，没有戴口罩

识别正确

3

![](/download/thumbnails/129190536/cropped_IMG_20240729_221031.jpg?version=1&modificationDate=1725196915007&api=v2) 

cropped\_IMG\_20240729\_221031

这是一名男性，年龄在30-40岁之间，颜值普通，戴眼镜，短发，表情正常，没有胡子，没有戴口罩

识别正确

4

![](/download/thumbnails/129190536/cropped_IMG_20240805_155828.jpg?version=1&modificationDate=1725196915130&api=v2)

cropped\_IMG\_20240805\_155828

这是一名男性，年龄30-35岁，颜值普通，戴眼镜，短发，表情正常，有胡子，没戴口罩

年龄错误，其他识别正确

5

![](/download/thumbnails/129190536/cropped_IMG_20240805_155832.jpg?version=1&modificationDate=1725196915308&api=v2)

cropped\_IMG\_20240805\_155832

这是一名男性，年龄25-35岁，颜值普通，没戴眼镜，短发，表情正常，没有胡子，没戴口罩

眼镜错误，其他识别正确

6

![](/download/thumbnails/129190536/cropped_IMG_20240805_155834.jpg?version=1&modificationDate=1725196915467&api=v2)

cropped\_IMG\_20240805\_155834

这是一名男性，年龄大约在25-35岁之间，颜值普通，戴眼镜，短发，表情正常，有胡子，没戴口罩

识别正确

7

![](/download/thumbnails/129190536/cropped_IMG_20240805_155843.jpg?version=1&modificationDate=1725196915605&api=v2)

  

cropped\_IMG\_20240805\_155843

这是一名男性，年龄在25-35岁之间，颜值普通，没戴眼镜，短发，表情开心，没有胡子，没戴口罩

识别正确

8

![](/download/thumbnails/129190536/cropped_IMG_20240805_155846.jpg?version=1&modificationDate=1725196915729&api=v2)

cropped\_IMG\_20240805\_155846

这是一名男性，年龄30-35岁，颜值普通，没戴眼镜，短发，表情正常，没有胡子，没戴口罩

年龄错误，识别正确

9

![](/download/thumbnails/129190536/cropped_IMG_20240805_155849.jpg?version=1&modificationDate=1725196915879&api=v2)

cropped\_IMG\_20240805\_155849

这是一名男性，年龄30-35岁，颜值普通，没戴眼镜，短发，表情正常，有胡子，没戴口罩

年龄错误，识别正确

10

![](/download/thumbnails/129190536/cropped_IMG_20240805_155938.jpg?version=1&modificationDate=1725196915991&api=v2)

cropped\_IMG\_20240805\_155938

这是一名男性，年龄30-35岁，颜值普通，没戴眼镜，短发，表情正常，没有胡子，没戴口罩

年龄错误，眼镜错误，识别正确

11

![](/download/thumbnails/129190536/cropped_IMG_20240805_155939.jpg?version=1&modificationDate=1725196916137&api=v2)

cropped\_IMG\_20240805\_155939

这是一名男性，年龄25-35岁，颜值普通，没戴眼镜，短发，表情正常，没有胡子，没戴口罩

眼镜错误，其他识别正确

12

![](/download/thumbnails/129190536/cropped_IMG_20240805_155956.jpg?version=1&modificationDate=1725196916259&api=v2)

cropped\_IMG\_20240805\_155956

这是一名男性，年龄在25-35岁，颜值普通，戴眼镜，短发，表情正常，没有胡子，没戴口罩

识别正确

13

![](/download/thumbnails/129190536/cropped_IMG_20240805_155957.jpg?version=1&modificationDate=1725196916379&api=v2)

cropped\_IMG\_20240805\_155957

这是一名男性，年龄评估值为30-35岁，颜值普通，戴眼镜，短发，表情正常，没有胡子，没有戴口罩

识别正确

14

![](/download/thumbnails/129190536/cropped_IMG_20240805_155959.jpg?version=1&modificationDate=1725196916504&api=v2)

cropped\_IMG\_20240805\_155959

这是一名男性，年龄25-30岁，颜值普通，没戴眼镜，短发，表情正常，没有胡子，没戴口罩

眼镜错误，其他识别正确

15

![](/download/thumbnails/129190536/cropped_IMG_20240805_160020.jpg?version=1&modificationDate=1725196916647&api=v2)

cropped\_IMG\_20240805\_160020

这是一名男性，年龄估计在30-35岁之间，颜值普通，戴眼镜，短发，表情正常，没有胡子，没有戴口罩

识别正确

16

![](/download/thumbnails/129190536/cropped_IMG_20240805_160048.jpg?version=1&modificationDate=1725196916798&api=v2)

cropped\_IMG\_20240805\_160048

这是一名女性，年龄在30-35岁，颜值普通，戴眼镜，短发，表情正常，没有胡子，没戴口罩

识别正确

17

![](/download/thumbnails/129190536/cropped_IMG_20240805_160049.jpg?version=1&modificationDate=1725196916934&api=v2)

cropped\_IMG\_20240805\_160049

这是一名男性，年龄在25-35岁之间，颜值普通，戴眼镜，短发，表情正常，没有胡子，没有戴口罩

识别正确

18

![](/download/thumbnails/129190536/cropped_IMG_20240805_160058.jpg?version=1&modificationDate=1725196917064&api=v2)

cropped\_IMG\_20240805\_160058

这是一名女性，年龄在30-40岁之间，颜值普通，戴眼镜，短发，表情正常，没有胡子，没有戴口罩

识别正确

19

![](/download/thumbnails/129190536/cropped_IMG_20240805_160059.jpg?version=1&modificationDate=1725196917234&api=v2)

cropped\_IMG\_20240805\_160059

这是一名女性，年龄在30-40岁，颜值普通，戴眼镜，短发，表情正常，没有胡子，没戴口罩

识别正确

20

![](/download/thumbnails/129190536/cropped_IMG_20240805_160112.jpg?version=1&modificationDate=1725196917373&api=v2)

cropped\_IMG\_20240805\_160112

这是一名女性，年龄30-40岁，颜值普通，没戴眼镜，长发，表情正常，没有胡子，没戴口罩

眼镜错误，其他识别正确

21

![](/download/thumbnails/129190536/cropped_IMG_20240805_160113.jpg?version=1&modificationDate=1725196917500&api=v2)

cropped\_IMG\_20240805\_160113

这是一名男性，年龄大约35-45岁，颜值普通，戴眼镜，短发，表情正常，没有胡子，没有戴口罩

识别正确

22

![](/download/thumbnails/129190536/cropped_IMG_20240805_160114.jpg?version=1&modificationDate=1725196917618&api=v2)

cropped\_IMG\_20240805\_160114

这是一名男性，年龄在20-30岁之间，颜值普通，没戴眼镜，短发，表情正常，没有胡子，没戴口罩

眼镜错误，其他识别正确

23

![](/download/thumbnails/129190536/cropped_IMG_20240805_160124.jpg?version=1&modificationDate=1725196917768&api=v2)

cropped\_IMG\_20240805\_160124

这是一名男性，年龄在25-30岁之间，颜值普通，戴眼镜，短发，表情开心，没有胡子，没有戴口罩

识别正确

24

![](/download/thumbnails/129190536/cropped_IMG_20240805_160128.jpg?version=1&modificationDate=1725196917895&api=v2)

cropped\_IMG\_20240805\_160128

这是一名男性，年龄大约在25-35岁，颜值普通，戴眼镜，短发，表情开心，没有胡子，没有戴口罩

识别正确

25

![](/download/thumbnails/129190536/cropped_IMG_20240805_160143.jpg?version=1&modificationDate=1725196918036&api=v2)

cropped\_IMG\_20240805\_160143

这是一名女性，年龄30-35岁，颜值普通，戴眼镜，短发，表情正常，没有胡子，没有戴口罩

识别正确

26

![](/download/thumbnails/129190536/cropped_IMG_20240805_160146.jpg?version=1&modificationDate=1725196918213&api=v2)

cropped\_IMG\_20240805\_160146

这是一名女性，年龄30-40岁，颜值普通，戴眼镜，短发，表情正常，没有胡子，没戴口罩

识别正确

27

![](/download/thumbnails/129190536/cropped_IMG_20240805_160149.jpg?version=1&modificationDate=1725196918346&api=v2)

cropped\_IMG\_20240805\_160149

这是一名女性，年龄在30-35岁之间，颜值普通，戴眼镜，短发，表情正常，没有胡子，没戴口罩

识别正确

28

 ![](/download/thumbnails/129190536/cropped_IMG_20240805_160227.jpg?version=1&modificationDate=1725196918573&api=v2)

cropped\_IMG\_20240805\_160227

这是一名女性，年龄在25-35岁之间，颜值普通，没戴眼镜，短发，表情正常，没有胡子，没戴口罩

识别正确

29

![](/download/thumbnails/129190536/cropped_IMG_20240805_160228.jpg?version=1&modificationDate=1725196918729&api=v2)

cropped\_IMG\_20240805\_160228

这是一名女性，年龄估计为30-40岁，颜值普通，没戴眼镜，短发，表情正常，没有胡子，没戴口罩

识别正确

30

  

![](/download/thumbnails/129190536/cropped_IMG_20240805_160231.jpg?version=1&modificationDate=1725196918861&api=v2)

cropped\_IMG\_20240805\_160231

  

这是一名女性，年龄25-35岁，颜值普通，没戴眼镜，短发，表情正常，没有胡子，没戴口罩

识别正确

31

![](/download/thumbnails/129190536/cropped_IMG_20240805_160242.jpg?version=1&modificationDate=1725196919005&api=v2)

cropped\_IMG\_20240805\_160242

这是一名女性，年龄约在25-30岁，颜值普通，没戴眼镜，长发，表情正常，没有胡子，没戴口罩

识别正确

32

![](/download/thumbnails/129190536/cropped_IMG_20240805_160245.jpg?version=1&modificationDate=1725196919141&api=v2)

cropped\_IMG\_20240805\_160245

这是一名女性，年龄在20-30岁之间，颜值好看，戴眼镜，长发，表情正常，没有胡子，没戴口罩

识别正确

33

![](/download/thumbnails/129190536/cropped_IMG_20240805_160247.jpg?version=1&modificationDate=1725196919275&api=v2)

cropped\_IMG\_20240805\_160247

这是一名女性，年龄20-30岁，颜值普通，戴眼镜，长发，表情正常，没有胡子，没戴口罩

识别正确

  

5\. 结论
======

结论：总的来说，gpt4-o，准确率还是比讯飞强一些，没有出现性别识别错误。结论依赖主观判断，有一定偏差；响应速度，讯飞快一些（针对 人脸特征分析API）

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)