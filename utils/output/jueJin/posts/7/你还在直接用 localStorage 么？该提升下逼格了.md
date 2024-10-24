---
author: "Gaby"
title: "你还在直接用 localStorage 么？该提升下逼格了"
date: 2022-06-01
description: "很多人在用 `localStorage` 的时候喜欢直接用，明文存储，直接将信息暴露在；浏览器中，虽然一般场景下都能应付得了且简单粗暴，但特殊需求情况下就不行了，该学学封装提升下逼格了！"
tags: ["JavaScript","架构","面试中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读5分钟"
weight: 1
selfDefined:"likes:1100,comments:261,collects:1600,views:93412,"
---
持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第5天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

废话只说一句：码字不易求个👍，收藏 === 学会,快行动起来吧！🙇‍🙇‍🙇‍。

感谢点赞、收藏、关注和提出建议的小伙伴，希望大家工作顺利、老板能给你们加鸡腿!

为回馈掘金的小伙伴们，特地做了个文档站点，将前端面试题、常用知识点及日常封装的工具类系统的整理在该站点上，希望能帮到更多的小伙伴[☞传送门](https://link.juejin.cn?target=https%3A%2F%2Fdocs.ycsnews.com%2F "https://docs.ycsnews.com/")，目前，本站内容正紧锣密鼓的更新中！

很多人在用 `localStorage` 或 `sessionStorage` 的时候喜欢直接用，明文存储，直接将信息暴露在；浏览器中，虽然一般场景下都能应付得了且简单粗暴，但特殊需求情况下，比如设置定时功能，就不能实现。就需要对其进行二次封装，为了在使用上增加些安全感，那加密也必然是少不了的了。为方便项目使用，特对常规操作进行封装。不完善之处会进一步更新...(更新于：2022.07.04 17:30) 已更新。

### 设计

封装之前先梳理下所需功能，并要做成什么样，采用什么样的规范，部分主要代码片段是以 `localStorage`作为示例，最后会贴出完整代码的。可以结合项目自行优化，也可以直接使用。

```js
// 区分存储类型 type
// 自定义名称前缀 prefix
// 支持设置过期时间 expire
// 支持加密可选，开发环境下未方便调试可关闭加密

// 支持数据加密 这里采用 crypto-js 加密 也可使用其他方式

// 判断是否支持 Storage isSupportStorage

// 设置 setStorage

// 获取 getStorage

// 是否存在 hasStorage

// 获取所有key getStorageKeys

// 根据索引获取key getStorageForIndex

// 获取localStorage长度 getStorageLength

// 获取全部 getAllStorage

// 删除 removeStorage

// 清空 clearStorage

//定义参数 类型 window.localStorage,window.sessionStorage,
    const config = {
    type: 'localStorage', // 本地存储类型 localStorage/sessionStorage
    prefix: 'xxx_0.0.1', // 名称前缀 建议：项目名 + 项目版本
    expire: 1, //过期时间 单位：秒
    isEncrypt: true // 默认加密 为了调试方便, 开发过程中可以不加密
}
```

### 设置 setStorage

Storage 本身是不支持过期时间设置的，要支持设置过期时间，可以效仿 Cookie 的做法，`setStorage(key,value,expire)` 方法，接收三个参数，第三个参数就是设置过期时间的，用相对时间，单位秒，要对所传参数进行类型检查。可以设置统一的过期时间，也可以对单个值得过期时间进行单独配置。两种方式按需配置。

代码实现：

```js
// 设置 setStorage
    export const setStorage = (key, value, expire = 0) => {
        if (value === '' || value === null || value === undefined) {
        value = null;
    }
    
    if (isNaN(expire) || expire < 0) throw new Error('Expire must be a number');
    
    expire = (expire ? expire : config.expire) * 1000;
        let data = {
        value: value, // 存储值
        time: Date.now(), //存值时间戳
        expire: expire // 过期时间
        };
        const encryptString = config.isEncrypt
        ? encrypt(JSON.stringify(data))
        : JSON.stringify(data);
        window[config.type].setItem(autoAddPrefix(key), encryptString);
        };
```

### 获取 getStorage

首先要对 `key` 是否存在进行判断，防止获取不存在的值而报错。对获取方法进一步扩展，只要在有效期内获取 `Storage` 值，就对过期时间进行续期，如果过期则直接删除该值。并返回 `null`

```js
// 获取 getStorage
    export const getStorage = key => {
    let value = null;
    key = autoAddPrefix(key);
    // key 不存在判断
    if (
    !window[config.type].getItem(key) ||
    JSON.stringify(window[config.type].getItem(key)) === 'null'
        ) {
        return null;
    }
    
    // 优化 持续使用中续期
    const storage = config.isEncrypt
    ? JSON.parse(decrypt(window[config.type].getItem(key)))
    : JSON.parse(window[config.type].getItem(key));
    const nowTime = Date.now();
    // 过期删除
        if (storage.expire && storage.expire < nowTime - storage.time) {
        removeStorage(key);
        return null;
            } else {
            // // 未过期期间被调用 则自动续期 进行保活
            // setStorage(autoRemovePrefix(key), storage.value);
                if (isJson(storage.value)) {
                value = JSON.parse(storage.value);
                    } else {
                    value = storage.value;
                }
                return value;
            }
            };
```

### 获取所有值

```js
// 获取全部 getAllStorage
    export const getStorageAll = () => {
    const len = getStorageLength(); // 获取长度
    let arr = []; // 定义数据集
        for (let i = 0; i < len; i++) {
        const key = window[config.type].key(i);
        // 获取key 索引从0开始
        const getKey = autoRemovePrefix(key);
        // 获取key对应的值
        const storage = config.isEncrypt
        ? JSON.parse(decrypt(window[config.type].getItem(key)))
        : JSON.parse(window[config.type].getItem(key));
        
        const nowTime = Date.now();
            if (storage.expire && nowTime - storage.time > storage.expire) {
            removeStorage(getKey);
                } else {
                let getVal = storage.value;
                // console.log(Object.prototype.toString.call(value));
                    if (isJson(getVal)) {
                    getVal = JSON.parse(getVal);
                }
                // 放进数组
                arr.push({ key: getKey, val: getVal });
            }
        }
        return arr;
        };
```

### 删除 removeStorage

```js
// 名称前自动添加前缀
    const autoAddPrefix = (key) => {
    const prefix = config.prefix ? config.prefix + '_' : '';
    return  prefix + key;
}

// 删除 removeStorage
    export const removeStorage = (key) => {
    window[config.type].removeItem(autoAddPrefix(key));
}
```

### 清空 clearStorage

```js
// 清空 clearStorage
    export const clearStorage = () => {
    window[config.type].clear();
}
```

### 加密、解密

加密采用的是 `crypto-js`

```js
// 安装crypto-js
npm install crypto-js

// 引入 crypto-js 有以下两种方式
import CryptoJS from "crypto-js";
// 或者
const CryptoJS = require("crypto-js");
```

对 `crypto-js` 设置密钥和密钥偏移量,可以采用将一个私钥经 `MD5` 加密生成16位密钥获得。

```js
// 十六位十六进制数作为密钥
const SECRET_KEY = CryptoJS.enc.Utf8.parse("3333e6e143439161");
// 十六位十六进制数作为密钥偏移量
const SECRET_IV = CryptoJS.enc.Utf8.parse("e3bbe7e3ba84431a");
```

对加密方法进行封装

```js
/**
* 加密方法
* @param data
* @returns {string}
*/
    export function encrypt(data) {
        if (typeof data === "object") {
            try {
            data = JSON.stringify(data);
                } catch (error) {
                console.log("encrypt error:", error);
            }
        }
        const dataHex = CryptoJS.enc.Utf8.parse(data);
            const encrypted = CryptoJS.AES.encrypt(dataHex, SECRET_KEY, {
            iv: SECRET_IV,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
            });
            return encrypted.ciphertext.toString();
        }
```

对解密方法进行封装

```js
/**
* 解密方法
* @param data
* @returns {string}
*/
    export function decrypt(data) {
    const encryptedHexStr = CryptoJS.enc.Hex.parse(data);
    const str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        const decrypt = CryptoJS.AES.decrypt(str, SECRET_KEY, {
        iv: SECRET_IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
        });
        const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        return decryptedStr.toString();
    }
```

在存储数据及获取数据中进行使用：

这里我们主要看下进行加密和解密部分，部分方法在下面代码段中并未展示，请注意，不能直接运行。

```js
    const config = {
    type: 'localStorage', // 本地存储类型 sessionStorage
    prefix: 'xxx_0.0.1', // 名称前缀 建议：项目名 + 项目版本
    expire: 1, //过期时间 单位：秒
    isEncrypt: true // 默认加密 为了调试方便, 开发过程中可以不加密
}

// 设置 setStorage
    export const setStorage = (key, value, expire = 0) => {
        if (value === '' || value === null || value === undefined) {
        value = null;
    }
    
    if (isNaN(expire) || expire < 0) throw new Error('Expire must be a number');
    
    expire = (expire ? expire : config.expire) * 1000;
        let data = {
        value: value, // 存储值
        time: Date.now(), //存值时间戳
        expire: expire // 过期时间
        };
        const encryptString = config.isEncrypt
        ? encrypt(JSON.stringify(data))
        : JSON.stringify(data);
        window[config.type].setItem(autoAddPrefix(key), encryptString);
        };
        
        // 获取 getStorage
            export const getStorage = key => {
            let value = null;
            key = autoAddPrefix(key);
            // key 不存在判断
            if (
            !window[config.type].getItem(key) ||
            JSON.stringify(window[config.type].getItem(key)) === 'null'
                ) {
                return null;
            }
            
            // 优化 持续使用中续期
            const storage = config.isEncrypt
            ? JSON.parse(decrypt(window[config.type].getItem(key)))
            : JSON.parse(window[config.type].getItem(key));
            const nowTime = Date.now();
            // 过期删除
                if (storage.expire && storage.expire < nowTime - storage.time) {
                removeStorage(key);
                return null;
                    } else {
                    // // 未过期期间被调用 则自动续期 进行保活
                    // setStorage(autoRemovePrefix(key), storage.value);
                        if (isJson(storage.value)) {
                        value = JSON.parse(storage.value);
                            } else {
                            value = storage.value;
                        }
                        return value;
                    }
                    };
```

### 使用

使用的时候你可以通过 `import` 按需引入，也可以挂载到全局上使用，一般建议少用全局方式或全局变量，为后来接手项目继续开发维护的人，追查代码留条便捷之路！不要为了封装而封装，尽可能基于项目需求和后续的通用，以及使用上的便捷。比如获取全部存储变量，如果你项目上都未曾用到过，倒不如删减掉，留着过年也不见得有多香，不如为减小体积做点贡献！

```js
import {isSupportStorage, hasStorage, setStorage,getStorage,getStorageKeys,getStorageForIndex,getStorageLength,removeStorage,getStorageAll,clearStorage} from '@/utils/storage'

setStorage('token', 'xxx');
getStorage('token');
```

想省事点就全局注册下，推荐全局用。

```js
// main.js
import Storage from '@/libs/storage';
Vue.use(Storage);

// 使用
this.$storage.set('token', 'xxx');
this.$storage.get('token');
```

![image.png](/images/jueJin/5081f9be56e4429.png)

### 完整代码

该代码已进一步完善，需要的可以直接进一步优化，也可以将可优化或可扩展的建议，留言说明，我会进一步迭代的。可以根据自己的需要删除一些不用的方法，以减小文件大小。

```js
/***
* title: storage.js
* Author: Gaby
* Email:
* Time: 2022/6/8 15:53
* last: 2022/7/4 15:53
* Desc: 对本地存储进行封装, 命名规范、设置过期时间、安全加密
*/

import CryptoJS from 'crypto-js';

// 十六位十六进制数作为密钥
const SECRET_KEY = CryptoJS.enc.Utf8.parse('3333e6e143439161');
// 十六位十六进制数作为密钥偏移量
const SECRET_IV = CryptoJS.enc.Utf8.parse('e3bbe7e3ba84431a');

// 类型 window.localStorage,window.sessionStorage,
    const config = {
    type: 'sessionStorage', // 本地存储类型 localStorage sessionStorage
    prefix: 'xxx_0.0.1', // 名称前缀 建议：项目名 + 项目版本
    expire: 0, //过期时间 单位：秒
    isEncrypt: false // 默认加密 为了调试方便, 开发过程中可以不加密
    };
    
    // 判断是否支持 Storage
        export const isSupStorage = () => {
            if (!window) {
            throw new Error('当前环境非浏览器，无法消费全局window实例。');
        }
            if (!window.localStorage) {
            throw new Error('当前环境非无法使用localStorage');
        }
            if (!window.sessionStorage) {
            throw new Error('当前环境非无法使用sessionStorage');
        }
        
        return typeof Storage !== 'undefined' ? true : false;
        };
        
        // 设置 setStorage
            export const setStorage = (key, value, expire = 0) => {
                if (value === '' || value === null || value === undefined) {
                value = null;
            }
            
            if (isNaN(expire) || expire < 0) throw new Error('Expire must be a number');
            
            expire = (expire ? expire : config.expire) * 1000;
                let data = {
                value: value, // 存储值
                time: Date.now(), //存值时间戳
                expire: expire // 过期时间
                };
                const encryptString = config.isEncrypt
                ? encrypt(JSON.stringify(data))
                : JSON.stringify(data);
                window[config.type].setItem(autoAddPrefix(key), encryptString);
                };
                
                // 获取 getStorage
                    export const getStorage = key => {
                    let value = null;
                    key = autoAddPrefix(key);
                    // key 不存在判断
                    if (
                    !window[config.type].getItem(key) ||
                    JSON.stringify(window[config.type].getItem(key)) === 'null'
                        ) {
                        return null;
                    }
                    
                    // 优化 持续使用中续期
                    const storage = config.isEncrypt
                    ? JSON.parse(decrypt(window[config.type].getItem(key)))
                    : JSON.parse(window[config.type].getItem(key));
                    const nowTime = Date.now();
                    // 过期删除
                        if (storage.expire && storage.expire < nowTime - storage.time) {
                        removeStorage(key);
                        return null;
                            } else {
                            // // 未过期期间被调用 则自动续期 进行保活
                            // setStorage(autoRemovePrefix(key), storage.value);
                                if (isJson(storage.value)) {
                                value = JSON.parse(storage.value);
                                    } else {
                                    value = storage.value;
                                }
                                return value;
                            }
                            };
                            
                            // 是否存在 hasStorage
                                export const hasStorage = key => {
                                key = autoAddPrefix(key);
                                    let arr = getStorageAll().filter(item => {
                                    return item.key === key;
                                    });
                                    return arr.length ? true : false;
                                    };
                                    
                                    // 获取所有key
                                        export const getStorageKeys = () => {
                                        let items = getStorageAll();
                                        let keys = [];
                                            for (let index = 0; index < items.length; index++) {
                                            keys.push(items[index].key);
                                        }
                                        return keys;
                                        };
                                        
                                        // 根据索引获取key
                                            export const getStorageForIndex = index => {
                                            return window[config.type].key(index);
                                            };
                                            
                                            // 获取localStorage长度
                                                export const getStorageLength = () => {
                                                return window[config.type].length;
                                                };
                                                
                                                // 获取全部 getAllStorage
                                                    export const getStorageAll = () => {
                                                    const len = getStorageLength(); // 获取长度
                                                    let arr = []; // 定义数据集
                                                        for (let i = 0; i < len; i++) {
                                                        const key = window[config.type].key(i);
                                                        // 获取key 索引从0开始
                                                        const getKey = autoRemovePrefix(key);
                                                        // 获取key对应的值
                                                        const storage = config.isEncrypt
                                                        ? JSON.parse(decrypt(window[config.type].getItem(key)))
                                                        : JSON.parse(window[config.type].getItem(key));
                                                        
                                                        const nowTime = Date.now();
                                                            if (storage.expire && nowTime - storage.time > storage.expire) {
                                                            removeStorage(getKey);
                                                                } else {
                                                                let getVal = storage.value;
                                                                // console.log(Object.prototype.toString.call(value));
                                                                    if (isJson(getVal)) {
                                                                    getVal = JSON.parse(getVal);
                                                                }
                                                                // 放进数组
                                                                arr.push({ key: getKey, val: getVal });
                                                            }
                                                        }
                                                        return arr;
                                                        };
                                                        
                                                        // 删除 removeStorage
                                                            export const removeStorage = key => {
                                                            window[config.type].removeItem(autoAddPrefix(key));
                                                            };
                                                            
                                                            // 清空 clearStorage
                                                                export const clearStorage = () => {
                                                                window[config.type].clear();
                                                                };
                                                                
                                                                // 判断是否可用 JSON.parse
                                                                    export const isJson = value => {
                                                                        if (Object.prototype.toString.call(value) === '[object String]') {
                                                                            try {
                                                                            const obj = JSON.parse(value);
                                                                            const objType = Object.prototype.toString.call(obj);
                                                                            return objType === '[object Object]' || objType === '[object Array]';
                                                                                } catch (e) {
                                                                                // console.log('error：' + value + '!!!' + e);
                                                                                return false;
                                                                            }
                                                                        }
                                                                        return false;
                                                                        };
                                                                        
                                                                        // 名称前自动添加前缀
                                                                            const autoAddPrefix = key => {
                                                                            const prefix = config.prefix ? config.prefix + '_' : '';
                                                                            return prefix + key;
                                                                            };
                                                                            
                                                                            // 移除已添加的前缀
                                                                                const autoRemovePrefix = key => {
                                                                                const len = config.prefix ? config.prefix.length + 1 : '';
                                                                                return key.substr(len);
                                                                                };
                                                                                
                                                                                /**
                                                                                * 加密方法
                                                                                * @param data
                                                                            * @returns {string}
                                                                            */
                                                                                const encrypt = data => {
                                                                                    if (typeof data === 'object') {
                                                                                        try {
                                                                                        data = JSON.stringify(data);
                                                                                            } catch (error) {
                                                                                            console.log('encrypt error:', error);
                                                                                        }
                                                                                    }
                                                                                    const dataHex = CryptoJS.enc.Utf8.parse(data);
                                                                                        const encrypted = CryptoJS.AES.encrypt(dataHex, SECRET_KEY, {
                                                                                        iv: SECRET_IV,
                                                                                        mode: CryptoJS.mode.CBC,
                                                                                        padding: CryptoJS.pad.Pkcs7
                                                                                        });
                                                                                        return encrypted.ciphertext.toString();
                                                                                        };
                                                                                        
                                                                                        /**
                                                                                        * 解密方法
                                                                                        * @param data
                                                                                    * @returns {string}
                                                                                    */
                                                                                        const decrypt = data => {
                                                                                        const encryptedHexStr = CryptoJS.enc.Hex.parse(data);
                                                                                        const str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
                                                                                            const decrypt = CryptoJS.AES.decrypt(str, SECRET_KEY, {
                                                                                            iv: SECRET_IV,
                                                                                            mode: CryptoJS.mode.CBC,
                                                                                            padding: CryptoJS.pad.Pkcs7
                                                                                            });
                                                                                            const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
                                                                                            return decryptedStr.toString();
                                                                                            };
                                                                                            
                                                                                                export default {
                                                                                                    install(Vue) {
                                                                                                    // 挂载全局
                                                                                                        if (!Vue.$storage) {
                                                                                                            Vue.$storage = {
                                                                                                            set: setStorage,
                                                                                                            get: getStorage,
                                                                                                            getAll: getStorageAll,
                                                                                                            getLen: getStorageLength,
                                                                                                            isSub: isSupStorage,
                                                                                                            isJson: isJson,
                                                                                                            has: hasStorage,
                                                                                                            del: removeStorage,
                                                                                                            clear: clearStorage
                                                                                                            };
                                                                                                                } else {
                                                                                                                Vue.$storage.set = setStorage;
                                                                                                                Vue.$storage.get = getStorage;
                                                                                                                Vue.$storage.getAll = getStorageAll;
                                                                                                                Vue.$storage.getLen = getStorageLength;
                                                                                                                Vue.$storage.isSub = isSupStorage;
                                                                                                                Vue.$storage.isJson = isJson;
                                                                                                                Vue.$storage.has = hasStorage;
                                                                                                                Vue.$storage.del = removeStorage;
                                                                                                                Vue.$storage.clear = clearStorage;
                                                                                                            }
                                                                                                                Vue.mixin({
                                                                                                                    created: function () {
                                                                                                                    this.$storage = Vue.$storage;
                                                                                                                }
                                                                                                                });
                                                                                                            }
                                                                                                            };
```