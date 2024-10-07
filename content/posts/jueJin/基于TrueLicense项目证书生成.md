---
author: "骑着蚂蚁去上天"
title: "基于TrueLicense项目证书生成"
date: 2021-01-04
description: "一、项目背景开发的软件产品在交付使用的时候，往往有一段时间的试用期，这期间我们不希望自己的代码被客户二次拷贝，这个时候license就派上用场了，license的功能包括设定有效期、绑定ip"
tags: ["后端","Java"]
ShowReadingTime: "阅读3分钟"
weight: 978
---
一、项目背景
------

*   开发的软件产品在交付使用的时候，往往有一段时间的试用期，这期间我们不希望自己的代码被客户二次拷贝，这个时候 license 就派上用场了，license 的功能包括设定有效期、绑定 ip、绑定 mac 等。
    
*   授权方直接生成一个 license 给使用方使用，如果需要延长试用期，也只需要重新生成一份 license 即可，无需手动修改源代码。
    

二、项目结构
------

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/19607d038beb46ad801c179f359087a7~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp)

上面图片是整个 license 项目的整体目录结构：

*   license：项目统一版本管理
    
*   license-api：第三方项目需要使用证书验证时需要依赖的jar包
    
*   license-common：共用包，提供给 api、generate 项目使用
    
*   license-generate：license 生成服务，用于生成 license
    

三、License 项目启动加载
----------------

java

 代码解读

复制代码

`package com.xlh.license.api.init;​import com.xlh.license.api.license.LicenseVerify;import com.xlh.license.api.param.LicenseVerifyParam;import com.xlh.license.common.constant.RestConstant;import lombok.extern.slf4j.Slf4j;import org.springframework.context.ApplicationListener;import org.springframework.context.event.ContextRefreshedEvent;import org.springframework.stereotype.Component;​import java.util.concurrent.atomic.AtomicBoolean;​/** * @Author: xlh * @Description: license 启动注册 * @Date: Create in 17:09 2020/9/17 0017 */@Slf4j@Componentpublic class LicenseListener implements ApplicationListener<ContextRefreshedEvent> {    /**     * 证书subject     */    private String subject = "公司名称";​    /**     * 公钥别称     */    private String publicAlias = "publicCert";​    /**     * 访问公钥库的密码     */    private String storePass = "public_password1234";​    private final static AtomicBoolean atomicBol = new AtomicBoolean(false);​    @Override    public void onApplicationEvent(ContextRefreshedEvent event) {        if (!atomicBol.get()) {            log.info(RestConstant.LICENSE_INSTALLING);            LicenseVerifyParam param = new LicenseVerifyParam();            param.setSubject(subject);            param.setPublicAlias(publicAlias);            param.setStorePass(storePass);            LicenseVerify licenseVerify = new LicenseVerify();            //安装License            licenseVerify.install(param);            log.info(RestConstant.LICENSE_FINISH);            atomicBol.set(true);        }    }} package com.xlh.license.api.license;​import com.xlh.license.api.holder.LicenseManagerHolder;import com.xlh.license.api.param.LicenseVerifyParam;import com.xlh.license.api.cache.CacheLicenseContextHolder;import com.xlh.license.common.constant.CommonConstant;import com.xlh.license.common.constant.RestConstant;import com.xlh.license.common.exception.LicenseException;import com.xlh.license.common.param.CustomKeyStoreParam;import de.schlichtherle.license.*;import lombok.extern.slf4j.Slf4j;import org.springframework.core.io.ClassPathResource;import org.springframework.util.FileCopyUtils;​import java.io.File;import java.io.InputStream;import java.text.DateFormat;import java.text.MessageFormat;import java.text.SimpleDateFormat;import java.util.Date;import java.util.prefs.Preferences;​/** * @Author: xlh * @Description: License校验类 * @Date: Create in 17:06 2020/9/17 0017 */@Slf4jpublic class LicenseVerify {​    private static String LICENSE_PATH;​    private static String PUBLIC_KEY_STORE_PATH;​    private static final String PREFIX = "license";​    private static final String SUFFIX = ".lic";​    {        ClassPathResource resource = new ClassPathResource(CommonConstant.LICENSE_FILE);        LICENSE_PATH = resource.getPath();        resource = new ClassPathResource(CommonConstant.PUBLIC_KEY_STORE_FILE);        PUBLIC_KEY_STORE_PATH = resource.getPath();    }​    /**     * 安装License证书     * @param param     * @return     */    public synchronized LicenseContent install(LicenseVerifyParam param){        if (null == LICENSE_PATH || "" == LICENSE_PATH) {            throw new LicenseException(RestConstant.ERROR_CODE, RestConstant.NOT_FOUND_LICENSE);        }​        if (null == PUBLIC_KEY_STORE_PATH || "" == PUBLIC_KEY_STORE_PATH) {            throw new LicenseException(RestConstant.ERROR_CODE, RestConstant.NOT_FOUND_PUBLIC_KEY_STORE);        }​        param.setLicensePath(LICENSE_PATH);        param.setPublicKeysStorePath(PUBLIC_KEY_STORE_PATH);        LicenseContent result;        DateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");        // 安装License        try{            LicenseManager licenseManager = LicenseManagerHolder.getInstance(initLicenseParam(param));            licenseManager.uninstall();            ClassPathResource resource = new ClassPathResource(param.getLicensePath());            InputStream inputStream = resource.getInputStream();            File license = File.createTempFile(PREFIX, SUFFIX);            byte[] bytes = FileCopyUtils.copyToByteArray(inputStream);            FileCopyUtils.copy(bytes, license);            result = licenseManager.install(license);            log.info(MessageFormat.format(RestConstant.INSTALL_LICENSE_EFFECTIVE,                    format.format(result.getNotBefore()),format.format(result.getNotAfter())));            CacheLicenseContextHolder.setLicense(result.getNotAfter());        }catch (Exception e){            log.error(RestConstant.LICENSE_FAILURE,e);            throw new LicenseException(RestConstant.ERROR_CODE, e.getMessage());        }        return result;    }​    /**     * 校验License证书     * @return     */    public boolean verify(){        DateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");        Date expiryTime = CacheLicenseContextHolder.getLicense();        log.info(MessageFormat.format(RestConstant.LICENSE_EXPIRY_TIME, format.format(expiryTime)));        boolean result = expiryTime.after(new Date());        if (!result) {            throw new LicenseException(RestConstant.ERROR_CODE, RestConstant.LICENSE_INVALID);        }        return true;    }        /**     * 初始化证书生成参数     * @param param     * @return     */    private LicenseParam initLicenseParam(LicenseVerifyParam param){        Preferences preferences = Preferences.userNodeForPackage(LicenseVerify.class);​        CipherParam cipherParam = new DefaultCipherParam(param.getStorePass());​        KeyStoreParam publicStoreParam = new CustomKeyStoreParam(LicenseVerify.class                ,param.getPublicKeysStorePath()                ,param.getPublicAlias()                ,param.getStorePass()                ,null);        return new DefaultLicenseParam(param.getSubject()                ,preferences                ,publicStoreParam                ,cipherParam);    }}`

经过上述加载之后会在父线程中将 license 过期时间进行缓存，每次调用的时候会获取父线程缓存的时间去判断 license 是否失效，如果失效则会抛出异常信息，通过统一封装后返回给前端进行展示，后台记录相应的日志信息

typescript

 代码解读

复制代码

`package com.xlh.license.api.cache;​import java.util.Date;​/** * @Author: xlh * @Description: license缓存 * @Date: Create in 11:01 2020/10/12 0012 */public class CacheLicenseContextHolder {​    private final static InheritableThreadLocal<Date> LICENSE_THREAD_LOCAL = new InheritableThreadLocal<>();​    public static void setLicense(Date expiryTime) {        LICENSE_THREAD_LOCAL.set(expiryTime);    }​    public static Date getLicense() {        return LICENSE_THREAD_LOCAL.get();    }​    public static void clearLicense() {        LICENSE_THREAD_LOCAL.remove();    }}`

四、客户端验证 License
---------------

scala

 代码解读

复制代码

`package com.xlh.license.api.interceptor;​import com.xlh.license.api.license.LicenseVerify;import lombok.extern.slf4j.Slf4j;import org.springframework.stereotype.Component;import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;​import javax.servlet.http.HttpServletRequest;import javax.servlet.http.HttpServletResponse;​/** * @Author: xlh * @Description: license检查器 * @Date: Create in 17:13 2020/9/17 0017 */@Slf4j@Componentpublic class LicenseInterceptor extends HandlerInterceptorAdapter {​    @Override    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {        LicenseVerify licenseVerify = new LicenseVerify();        //校验License        licenseVerify.verify();        return true;    }}`

五、使用 JDK 的 keytool 工具生成公私钥证书
----------------------------

vbnet

 代码解读

复制代码

`#生成命令keytool -genkeypair -keysize 1024 -validity 3650 -alias "privateKey" -keystore "privateKeys.keystore" -storepass "public_password1234" -keypass "private_password1234" -dname "CN=localhost, OU=localhost, O=localhost, L=SH, ST=SH, C=CN"​#导出命令keytool -exportcert -alias "privateKey" -keystore "privateKeys.keystore" -storepass "public_password1234" -file "certfile.cer"​#导入命令keytool -import -alias "publicCert" -file "certfile.cer" -keystore "publicCerts.keystore" -storepass "public_password1234"`

上述命令执行完成之后，会在当前路径下生成三个文件，分别是：privateKeys.keystore、publicCerts.keystore，文件privateKeys.keystore用于项目生成license文件，而文件publicCerts.keystore则随应用代码部署到客户服务器，用户解密 license 文件并校验其许可信息。

六、生成 Licesne 文件
---------------

json

 代码解读

复制代码

`{    "subject": "公司名称",    "privateAlias": "privateKey",    "keyPass": "private_password1234",    "storePass": "public_password1234",    "privateKeysStorePath": "privateKeys.keystore",    "expiryTime": "2199-12-01 23:59:59",    "consumerType": "User",    "consumerAmount": 1,    "description": "公司名称《2020-09-23 至 2199-12-01》版权所有",    "licenseModel": {        "ipAddress": ["10.23.16.14", "10.23.16.128", "10.23.16.12", "10.23.16.111", "172.17.0.1"],        "macAddress": ["44:39:C4:32:E7:1E", "8c:89:a5:bb:e9:5c", "44:39:C4:32:E7:F6", "44:39:C4:4F:DD:65", "02-42-6E-B7-E8-3C"],        "cpuSerial": "-1",        "mainBoardSerial": "-1"    }}`

项目地址：[gitee.com/xlh-kmx/lic…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fxlh-kmx%2Flicense "https://gitee.com/xlh-kmx/license")

##### 以上是我在项目中使用 License 的总结，如有问题请指出， 后续会将项目放至 GIT 仓库，如急需，可与我联系，谢谢！！！