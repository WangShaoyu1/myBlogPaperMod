---
author: ""
title: "云音乐iOS端网络图片下载优化实践"
date: 2022-08-29
description: "云音乐中业务大量的使用网络加载的图片，图片的下载速度，消耗的资源带宽越来越成为影响用户体验的一种问题。"
tags: ["iOS中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读11分钟"
weight: 1
selfDefined:"likes:37,comments:6,collects:74,views:5840,"
---
> 图片来自：[unsplash.com](https://link.juejin.cn?target=https%3A%2F%2Funsplash.com "https://unsplash.com")  
> 本文作者： lgq

背景
--

图片展示，在各大APP中不可或缺，众所周知云音乐是一款带有社交属性的音乐软件，那么在任何社交场景，都会有展示图片的诉求，并且常常会有重图片场景，比如一个云音乐中Mlog的Feed流场景全都是图片，或者就是Mlog中的图集，都需要展示大量的图片，要是图片无法及时的展示出来，不能及时的被用户消费，那么会造成用户浏览信息不顺畅，导致用户的流失，因此优化图片下载迫在眉睫。

现有图片下载技术
--------

这里简单了解下云音乐APP中接入的图片资源服务，它可以通过拼接参数，在远端进行裁剪，质量压缩从而下载到不同的图片。[更多信息参考](https://link.juejin.cn?target=https%3A%2F%2Fsf.163.com%2Fhelp%2Fdocuments%2F66982522786074624 "https://sf.163.com/help/documents/66982522786074624")

影响图片下载的因素
---------

1.  图片大小
2.  网络情况
3.  本地缓存
4.  cdn缓存

综上所述，如何提高图片的下载速度可以从上面几点开始优化。

### 优化方式

#### 网络优化

*   传统 HTTP1.0 的架构下没法多路复用，采用 HTTP2.0 的方式，请求同一ip域名的资源可以从节省大量建连及传输时间。
*   除此之外笔者在做音视频场景较重的页面时，发现音视频流媒体的数据有时候会抢占大量带宽，导致图片下载非常的慢，这时需要对音视频场景资源下载做适当的控制，如限流等操作，具体看业务优先级。如音视频场景使用socket下载时可以适当调中recv buffer 大小。

#### 图片大小优化

*   格式优化 这是最容易想的到的也是最有效的，如果正常使用jpg，png等常规图片，那图片的大小会是比较大的，目前我们的nos服务支持指定类型，将图片转成特定的格式，所以我们这里使用webp，从而减少图片的大小。（只需要在请求参数中拼接类型为webp即可）

**那除此之外呢，我们还可以做一些什么？**

*   按需裁剪 比如一个 100 \* 100 的控件，3 倍屏的情况下，我们只需要下载 300 \* 300 的图就可以了，如果图片超过个尺寸，我们去下载那么大的也没有意义。所以根据控件大小，可以决定我们下的图片大小，从而减小我们所需下载的图片。
    
*   压缩质量 比如要求没有那么高的场景我们只需要质量为 80 的图就可以了。
    

**思考** 以上几项做完，我们可以发现速度至少提升 30%，但是是不是可以做的更多，或者这个方案有什么纰漏？

**取证** 为此我们简单的拉取了一下后台数据。发现有以下问题：

1.  URL拼接的参数不同，导致无法命中本地缓存，这样会有重复下载的问题，比如用户头像，用户头像再各个场景重复出现，而且大小不一，会下载多次这样会导致一定的资源浪费。同时由于链接参数各异 **cdn命中度不高**
2.  不同机型的UI尺寸大小可能不太一致，导致下载的片尺寸会不一样，机型种类越多，拼接的尺寸情况也越多，服务端需要重复裁剪。
3.  质量参数由上层业务自行决定，会导致不同端没有约定好，下载到各式各样的图片

**解决手段**

1.  URL 参数标准化 所谓的标准化是规范大前端使用的参数拼接，分为顺序标准化，参数值拟合。 我们知道一个下载图片的URL链接`http://path?imageView=1&enlarge=1&quality=80&thumbnail=80x80&type=webp`。

*   其中参数我们按首字母排序，这样在参数要求一致的情况下，不会出现重复请求。
*   thumbnail 参数其实对应的是需要下载的图片大小，我们做拟合（根据后端统计的到的数据），分成多档（档位可以配置），按照宽边对其等比例缩放，这样可以尽可能少的避免机型屏幕差一点点，出现了其他size的case。
*   quality也同样分级，分成多档（档位可以配置）。
*   去重，参数可能多拼接，对冗余参数去重复

2.  本地大小图片重用 简单理解是本地有大图，取小图的时候无需额外网络请求，直接本地裁剪。 我们优化了读取本地缓存的逻辑，在取缓存的时候，我们会进行关联查找，找到可用的图片进行裁剪，直接返回。 具体规则如下：

*   不同裁剪参数可以转化，x，z裁剪参数可以转为y，y不可以转x，z。都可以转为相同的裁剪参数。其中x（内缩略）,y（裁剪缩略）,z（外缩略）的含义在[本篇文档中有](https://link.juejin.cn?target=https%3A%2F%2Fsf.163.com%2Fhelp%2Fdocuments%2F66982522786074624 "https://sf.163.com/help/documents/66982522786074624")，代表着不同的填充模式。
*   质量高的图片可以复用为质量低的图片，质量低的图片不可以复用为质量高的图片

iOS 代码实现
--------

说完了方案之后，我们可以上代码了，这里是 iOS的实现方案：

首先我们是基于SDWebImage进行一定的封装，先简单了解下SDWebImage中大概的流程。

![SDWebImage原流程](/images/jueJin/f0f2e3af04d93be.png)

从图中我们可以看出，下载图片主要是使用了imageLoader，查找缓存这里是用了imageCache，这两个都在manager中被管理

### 改造流程

![改造后的流程](/images/jueJin/51fc59fd2a16ddf.png)

我们只需要在数据流转的最开始对URL进行Fix，同时在查找缓存的时候对图片增加额外查找即可。

### URL FIX

我们给URL增加一个分类，对URL进行一个fix操作，方案就是用系统提供的 `NSURLComponts`对齐进行操作，提取出他的参数，进行去重，标准化，同时我们有一些历史原因，一些老的参数将其转为正确的格式，最后一步进行排序，fix流程就完成了。

```ini
    - (NSURL *)demo_fixImageURL {
    
    NSURLComponts *componts = [NSURLComponts compontsWithURL:self
    resolvingAgainstBaseURL:YES];
    NSMutableArray<NSURLQueryItem *> *queryItems = componts.queryItems.mutableCopy;
    
    ... 从URL取出 NSURLQueryItem 省略一些代码
    
        if (qualityItem) {
        //quality 拟合， 将质量参数分为几档
        NSString *defaultQualityStr = @"39,69,89";
        
        //这里是伪代码，就是为了获取配置信息
        NSArray<NSString *> *qualityLevel = CustomConfigQualityLevels;
        
        //固定 4档
            if (qualityLevel.count == 3) {
            NSInteger quality = [qualityItem.value intValue];
            NSString *fixQuality = @"";
                if (quality <= [[qualityLevel _objectAtIndex:0] intValue]) {
                fixQuality = [@(ImageQualityLevelLow) stringValue];
                    } else if (quality <= [[qualityLevel _objectAtIndex:1] intValue]) {
                    fixQuality = [@(ImageQualityLevelMed) stringValue];
                        } else if (quality <= [[qualityLevel _objectAtIndex:2] intValue]) {
                        fixQuality = [@(ImageQualityLevelHigh) stringValue];
                            } else {
                            fixQuality = [@(ImageQualityLevelOrigin) stringValue];
                        }
                        NSURLQueryItem *fixQualityItem = [[NSURLQueryItem alloc] initWithName:@"quality" value:fixQuality];
                        [queryItems removeObject:qualityItem];
                        [queryItems addObject:fixQualityItem];
                    }
                }
                
                    if (sizeItem) {
                    //size 按照宽边拟合 分为几档且 等比缩放
                    NSString *defaultSizeStr = @"30,60,90,120,180,256,315,512,720,1024";
                    
                    //这里是伪代码 就是为了获取配置信息
                    NSArray<NSString *> *sizeLevels = CustomConfigSizeLevels;
                    NSString *originSizeStr = sizeItem.value;
                    
                    CGSize originSize = CGSizeZero;
                    
                    NSString *separatedStr = nil;
                        for (NSString *separated in @[@"x", @"z", @"y"]) {
                        NSArray *sizeList = [originSizeStr compontsSeparatedByString:separated];
                            if (sizeList.count == 2) {
                            originSize = CGSizeMake([sizeList[0] intValue], [sizeList[1] intValue]);
                            separatedStr = separated;
                            break;
                        }
                    }
                    
                    CGSize finalSize = CGSizeZero;
                        if (!CGSizeEqualToSize(originSize, CGSizeZero)) {
                        BOOL isW = originSize.width > originSize.height;
                        NSInteger len = isW ? originSize.width : originSize.height;
                        NSInteger requestSize = 0;
                            for (NSString *sizeLevel in sizeLevels) {
                            NSInteger sizeNumber = [sizeLevel integerValue];
                                if (sizeNumber >= len) {
                                    if (requestSize == 0) {
                                    requestSize = sizeNumber;
                                        } else {
                                        requestSize = MIN(requestSize, sizeNumber);
                                    }
                                }
                            }
                                if (isW) {
                                    if (originSize.width != 0) {
                                    NSInteger h = (requestSize / (originSize.width * 1.f)) * originSize.height;
                                    finalSize = CGSizeMake(requestSize, floor(h));
                                }
                                
                                    } else {
                                        if (originSize.height != 0) {
                                        NSInteger w = (requestSize / (originSize.height * 1.f)) * originSize.width;
                                        finalSize = CGSizeMake(w, floor(requestSize));
                                    }
                                }
                            }
                            
                                if (!CGSizeEqualToSize(finalSize, CGSizeZero)) {
                                NSString *fixSize = [NSString stringWithFormat:@"%ld%@%ld",(NSInteger)finalSize.width, separatedStr, (NSInteger)finalSize.height];
                                NSURLQueryItem *fixSizeItem = [[NSURLQueryItem alloc] initWithName:@"thumbnail" value:fixSize];
                                [queryItems removeObject:sizeItem];
                                [queryItems addObject:fixSizeItem];
                            }
                            
                        }
                        
                        //去重复
                        NSMutableArray<NSString *> *keys = @[].mutableCopy;
                            queryItems = [queryItems bk_select:^BOOL(NSURLQueryItem *obj) {
                            BOOL containsObject = [keys containsObject:obj.name];
                            [keys addObject:obj.name];
                            return !containsObject;
                            }].mutableCopy;
                            
                            //首字母排序
                                queryItems = [queryItems sortedArrayUsingComparator:^NSComparisonResult(NSURLQueryItem *obj1, NSURLQueryItem *obj2) {
                                return [obj1.name compare:obj2.name options:NSCaseInsensitiveSearch];
                                }].mutableCopy;
                                
                                //最终组合
                                componts.queryItems = queryItems.copy;
                                NSURL *finalURL = componts.URL;
                                
                                return finalURL;
                            }
                            
```

### SDWebImageManager

修复了URL之后，下一步要做什么，如何将修复后的URL传递下去呢？也可以从上面的SDWebImage流程中看出，所有的图片下载流程，离不开SDWebImageManager，所以我们继承 `SDWebImageManager`，重写以下方法

```erlang
- (SDWebImageCombidOperation *)loadImageWithURL:(nullable NSURL *)url
options:(SDWebImageOptions)options
context:(nullable SDWebImageContext *)context
progress:(nullable SDImageLoaderProgressBlock)progressBlock
completed:(nonnull SDInternalCompletionBlock)completedBlock
```

后续如果要走修复流程的只需要用我们封装好的manager即可，实现如果下

```objectivec
- (SDWebImageCombidOperation *)loadImageWithURL:(nullable NSURL *)url
options:(SDWebImageOptions)options
context:(nullable SDWebImageContext *)context
progress:(nullable SDImageLoaderProgressBlock)progressBlock
completed:(nonnull SDInternalCompletionBlock)completedBlock
    corp:(BOOL)corp {
    
    NSURL *fixURL = [self.class fixURLWithUrl:url];
    SDInternalCompletionBlock fixBlock = completedBlock;
        if (![fixURL.absoluteString isEqualToString:url.absoluteString] && corp) {
        fixBlock = [self.class fixcompletedBlockWithOriginCompletedBlock:completedBlock url:url];
    }
        return [super loadImageWithURL:fixURL options:options context:context progress:progressBlock completed:^void(UIImage * _Nullable image, NSData * _Nullable data, NSError * _Nullable error, SDImageCacheType cacheType, BOOL finished, NSURL * _Nullable imageURL) {
        
            if (fixBlock) {
            fixBlock(image,data,error,cacheType,finished,imageURL);
        }
        }];
        
    }
    
```

细心的同学可以发现我们增加了一个参数 `corp`,如果上层业务就是需要按照他传入的大小来的话，我们做一层裁剪缩放操作。具体操作放在了`fixBlock`中。**默认是不进行fix的，因为本身nos服务器下发的图片也不一定是业务传入希望的尺寸。**

fixblock 核心的代码是用了sd\_webimage自带的裁剪

```ini
cutImage = [image sd_resizedImageWithSize:requestSize scaleMode:[urlInfo.cropStr isEqualToString:@"x"] ? SDImageScaleModeAspectFit : SDImageScaleModeAspectFill];

```

代码到这里基本`fixURL`操作基本完成，但是如果需要兼容老的缓存（本地已经有的，而且永久缓存（特殊case），但是线上已经下架的资源图片的），在fixblock中，我们在加载失败的情况下，用老的URL捞了一次本地缓存。

```css
[[self sharedManager] loadImageWithURL:url options:options | SDWebImageFromCacheOnly context:mutContext.copy progress:nil completed:completedBlock];
```

注意：**已经fix过的URL不会再fix，是否是永久缓存是通过imageCache区分的**

SDWebImageFromCacheOnly 表示只从缓存了读取，避免了重复发请求的问题。

### imageCache

上面说到要实现复用，需要修改imageCache，这里不得不提以下SDWebImage找到缓存的流程

![SDWebImage查询缓存](/images/jueJin/521565f12d1e22c.png)

从图中可以看出，URL需要转为cacheKey，然后再从内存或者磁盘中捞出缓存。那么我们如何改造呢，因为我们需要通过URL找到本地可以重用的图片

cacheKey需要保留一定规则，通过cache可以看到原始URL的一些东西。所以我们cachekey是这么生成的

```ini
    + (NSString *)cacheKeyForURL:(NSURL *)url  {
    
    NSURL *wUrl = url;
    NSString *host = wUrl.host;
    NSString *absoluteString = wUrl.absoluteString;
    if (!host)
        {
        return absoluteString;
    }
    
    NSRange hostRange = [absoluteString rangeOfString:host];
    if (hostRange.location + hostRange.length < absoluteString.length)
        {
        NSString *subString = [absoluteString substringFromIndex:hostRange.location + hostRange.length];
        if (subString.length != 0)
            {
            return subString;
        }
    }
    return absoluteString;
}
```

简而言之，就是去掉host，保留剩余的参数。**ps：因为fixURL去过请求参数重复，所以cacheKey也能同一张图片保证唯一。**

那通过URL怎么找到本地的其他图片呢，如何关联上呢？

![cacheKey关联imageInfo](/images/jueJin/a7fda682fb31f44.png)

可以通过path，再查找关联的cachekey，然后找到对应的图片

找到图片后，选择出一张可以使用的，对其进行裁剪操作，流程如下： ![裁剪流程](/images/jueJin/fb46a5bd17aad9f.png)

我们这里对缓存的图片信息封装了一个对象，注意 会用数据库持久化 `ImageCacheKeyAndURLObject`数组,他的key是请求URL链接中的 `path`，注意数据库有上限大小，同时会在适当的时机清理（如图片缓存过期等）

下面是封装持久化的对象

```objectivec
@interface WebImageCacheImageInfo : NSObject

@property (nonatomic) BOOL isAnimation;
@property (nonatomic) CGFloat sizeW;
@property (nonatomic) CGFloat sizeH;

- (CGSize)size;

@end

@interface WebImageURLInfo : NSObject

@property (nonatomic) CGSize requestSize;
@property (nonatomic) NSString *cropStr;
@property (nonatomic) NSInteger quality;
@property (nonatomic) NSInteger enlarge;

@end

@interface WebImageCacheKeyAndURLObject : NSObject<NMModel>


@property (nonatomic, readonly) NSString *path;
@property (nonatomic) NSString *cacheKey;
@property (nonatomic, nullable) NSURL *url;
@property (nonatomic, nullable) WebImageCacheImageInfo *imageInfo;

- (NSArray<WebImageCacheKeyAndURLObject *> *)relationObjects;
- (nullable WebImageCacheKeyAndURLObject *)canReuseObject;
- (WebImageURLInfo *)urlInfo;
- (void)storeImage:(UIImage *)image;
- (void)remove;
@end

```

如何存储图片信息呢

```ini
    - (void)storeImage:(UIImage *)image {
        if (self.path.length == 0) {
        return;
    }
    BOOL isAniamtion = image.sd_isAnimated;
    CGSize size = image.size;
        if (image) {
        _imageInfo = [WebImageCacheImageInfo new];
        _imageInfo.sizeH = size.height;
        _imageInfo.sizeW = size.width;
        _imageInfo.isAnimation = isAniamtion;
    }
    
    NSMutableArray<WebImageCacheKeyAndURLObject *> *items = [[self searchfromDBUsePath:self.path] mutableCopy];
        if (items.count == 0) {
        items = @[].mutableCopy;
    }
        if ([items containsObject:self]) {
        [items removeObject:self];
    }
    [items addObject:self];
    [self saveDBForPath:self.path item:items];
}
```

如何判断图片是否可以复用呢？

```ini
    - (WebImageCacheKeyAndURLObject *)canReuseObject {
    
    WebImageURLInfo *info = self.urlInfo;
        if (CGSizeEqualToSize(CGSizeZero, info.requestSize)) {
        return nil;
    }
    NSArray<WebImageCacheKeyAndURLObject *> *relationObjects = [self relationObjects];
    
    // 非动图 尺寸非0
    
        relationObjects = [relationObjects bk_select:^BOOL(WebImageCacheKeyAndURLObject *obj) {
        return !obj.imageInfo.isAnimation && obj.imageInfo.size.width > 0 && obj.imageInfo.size.height > 0;
        }];
        
        @weakify(self)
            relationObjects = [relationObjects bk_select:^BOOL(WebImageCacheKeyAndURLObject *obj) {
            @strongify(self)
            return ![obj.cacheKey isEqualToString:self.cacheKey];
            }];
            
            // 质量大于请求的图
                relationObjects = [relationObjects bk_select:^BOOL(WebImageCacheKeyAndURLObject *obj) {
                
                WebImageURLInfo *objInfo = obj.urlInfo;
                
                NSInteger quality = objInfo.quality == 0 ? 75 : objInfo.quality;
                NSInteger requestQuality = info.quality == 0 ? 75 : info.quality;
                return quality >= requestQuality;
                }];
                
                //缩放能支持的
                NSArray<WebImageCacheKeyAndURLObject *> *canUses = nil;
                    if ([info.cropStr isEqualToString:@"x"] || [info.cropStr isEqualToString:@"z"]) {
                        canUses = [relationObjects bk_select:^BOOL(WebImageCacheKeyAndURLObject *obj) {
                        WebImageURLInfo *objInfo = obj.urlInfo;
                            if ([objInfo.cropStr isEqualToString:@"x"] || [objInfo.cropStr isEqualToString:@"z"]) {
                            CGSize displaySize = WebImageDisplaySizeForImageSizeContentSizeContentMode(obj.imageInfo.size, info.requestSize, [info.cropStr isEqualToString:@"x"] ? UIViewContentModeScaleAspectFit :  UIViewContentModeScaleAspectFill);
                            
                            CGFloat p = 0;
                                if (info.requestSize.width > 0) {
                                p = displaySize.width / obj.imageInfo.size.width;
                                    } else {
                                    p = displaySize.height / obj.imageInfo.size.height;
                                }
                                return p <= 1;
                                    } else {
                                    // y 不可以转z/x
                                    return NO;
                                }
                                }];
                                    } else if ([info.cropStr isEqualToString:@"y"]) {
                                        canUses = [relationObjects bk_select:^BOOL(WebImageCacheKeyAndURLObject *obj) {
                                        WebImageURLInfo *objInfo = obj.urlInfo;
                                            if ([objInfo.cropStr isEqualToString:@"x"] || [objInfo.cropStr isEqualToString:@"z"]) {
                                            CGSize displaySize = WebImageDisplaySizeForImageSizeContentSizeContentMode(obj.imageInfo.size, info.requestSize, UIViewContentModeScaleAspectFill);
                                            CGFloat p = 0;
                                                if (info.requestSize.width > 0) {
                                                p = displaySize.width / obj.imageInfo.size.width;
                                                    } else {
                                                    p = displaySize.height / obj.imageInfo.size.height;
                                                }
                                                return p <= 1;
                                                    } else  if ([objInfo.cropStr isEqualToString:@"y"]) {
                                                    return (obj.imageInfo.size.width >= info.requestSize.width && obj.imageInfo.size.height >= info.requestSize.height);
                                                }
                                                return NO;
                                                }];
                                            }
                                            return canUses.firstObject;
                                        }
                                        
```

要过滤动图，因为动图本地裁剪比较难处理，而且占比不高，所以这里先忽略他，`WebImageCacheKeyAndURLObject`记录了`cacheKey`等一些关联信息，核心还记录了实际缓存的图片尺寸。方便查询。`WebImageDisplaySizeForImageSizeContentSizeContentMode`就是传入图片大小，容器大小，填充模式计算出缩放后的图片大小。

关联关系有了，再什么时机去查找呢？ 我们继承SDImageCache，重写了他

```objectivec
- (nullable NSData *)diskImageDataBySearchingAllPathsForKey:(nullable NSString *)key;
```

这个方法，在找不到data的情况下更进一步查找。找到的关联图片进行裁剪，使用和上面一样的修正方法

```ini
    if ([objInfo.cropStr isEqualToString:@"x"] || [objInfo.cropStr isEqualToString:@"z"]) {
    result = [result fixResizedImageWithSize:requestSize scaleMode:[objInfo.cropStr isEqualToString:@"x"] ? UIViewContentModeScaleAspectFit : UIViewContentModeScaleAspectFill needCorp:NO];
        } else if ([objInfo.cropStr isEqualToString:@"y"]) {
        result = [result fixResizedImageWithSize:requestSize scaleMode:UIViewContentModeScaleAspectFill needCorp:YES];
    }
    
```

这里补充下fixsize方法

```objectivec
    - (UIImage *)fixResizedImageWithSize:(CGSize)size scaleMode:(UIViewContentMode)scaleMode needCorp:(BOOL)needCorp {
    
        if (scaleMode != UIViewContentModeScaleAspectFit && scaleMode!= UIViewContentModeScaleAspectFill) {
        return self;
    }
    
    // 如果是fill模式，实际size会大于容器size 如果需要裁剪为容器大小就不走这一步了
        if (scaleMode == UIViewContentModeScaleAspectFill && !needCorp) {
        size = WebImageDisplaySizeForImageSizeContentSizeContentMode(self.size, size, scaleMode);
    }
    
    UIImage *fixImage = [self sd_resizedImageWithSize:size scaleMode:scaleMode == UIViewContentModeScaleAspectFit ? SDImageScaleModeAspectFit : SDImageScaleModeAspectFill];
    return fixImage;
    
}
```

这样我们就可以得到修复后的图片，流程完成。

### UIImageView 及 UIButton 等分类

我们包装一层自己的下载，然后传入我们的manager即可。

```ini
    context = @{
SDWebImageContextCustomManager:[WebImageManager sharedManager]
};
```

### 额外说一点

CDN命中率和这个资源是否曾经被请求过有关，命中CDN的key又是请求的URL，所以大前端请求都保持一致的规则很重要！这样每一端都可以蹭到其他端预热过的图片资源。

### 总结

我们核心点就`修正了URL`改造了`SDWebImageManager`,`SDImageCache`,并且建立了`CacheKey`关联关系，并且`兼容一些老逻辑`这样本地流程就都算走通了。本文除了常规优化图片的思路外提供了一种新的思路，本地利用已经下载过的大小图做文章，从而起到加速及节流的效果，并取得一定的收益，如果读者也是采用类似拼接url下载图片的方式的话，这种优化方式可以一试。全部做完取得成果具体数值不便展示，大概为提升下载速度 50%，同时能节省一定的 CDN带宽，日均节约至少 10% 。

> 本文发布自网易云音乐技术团队，文章未经授权禁止任何形式的转载。我们常年招收各类技术岗位，如果你准备换工作，又恰好喜欢云音乐，那就加入我们 grp.music-fe(at)corp.netease.com！