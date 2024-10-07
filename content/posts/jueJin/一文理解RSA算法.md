---
author: "念念清晰"
title: "一文理解RSA算法"
date: 2024-07-09
description: "先加签后加密还是先加密后加签？RSA和RSA2的区别？RSA能用来加解密吗？RSA加签示例RSA工具类"
tags: ["Java","算法"]
ShowReadingTime: "阅读10分钟"
weight: 288
---
什么是RSA
======

引用wiki百科的话说：

> **RSA加密算法**是一种[非对称加密算法](https://link.juejin.cn?target=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2F%25E9%259D%259E%25E5%25AF%25B9%25E7%25A7%25B0%25E5%258A%25A0%25E5%25AF%2586%25E6%25BC%2594%25E7%25AE%2597%25E6%25B3%2595 "https://zh.wikipedia.org/wiki/%E9%9D%9E%E5%AF%B9%E7%A7%B0%E5%8A%A0%E5%AF%86%E6%BC%94%E7%AE%97%E6%B3%95")，在[公开密钥加密](https://link.juejin.cn?target=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2F%25E5%2585%25AC%25E5%25BC%2580%25E5%25AF%2586%25E9%2592%25A5%25E5%258A%25A0%25E5%25AF%2586 "https://zh.wikipedia.org/wiki/%E5%85%AC%E5%BC%80%E5%AF%86%E9%92%A5%E5%8A%A0%E5%AF%86")和[电子商业](https://link.juejin.cn?target=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2F%25E7%2594%25B5%25E5%25AD%2590%25E5%2595%2586%25E4%25B8%259A "https://zh.wikipedia.org/wiki/%E7%94%B5%E5%AD%90%E5%95%86%E4%B8%9A")中被广泛使用。RSA是由[罗纳德·李维斯特](https://link.juejin.cn?target=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2F%25E7%25BD%2597%25E7%25BA%25B3%25E5%25BE%25B7%25C2%25B7%25E6%259D%258E%25E7%25BB%25B4%25E6%2596%25AF%25E7%2589%25B9 "https://zh.wikipedia.org/wiki/%E7%BD%97%E7%BA%B3%E5%BE%B7%C2%B7%E6%9D%8E%E7%BB%B4%E6%96%AF%E7%89%B9")（Ron Rivest）、[阿迪·萨莫尔](https://link.juejin.cn?target=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2F%25E9%2598%25BF%25E8%25BF%25AA%25C2%25B7%25E8%2590%25A8%25E8%258E%25AB%25E5%25B0%2594 "https://zh.wikipedia.org/wiki/%E9%98%BF%E8%BF%AA%C2%B7%E8%90%A8%E8%8E%AB%E5%B0%94")（Adi Shamir）和[伦纳德·阿德曼](https://link.juejin.cn?target=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2F%25E4%25BC%25A6%25E7%25BA%25B3%25E5%25BE%25B7%25C2%25B7%25E9%2598%25BF%25E5%25BE%25B7%25E6%259B%25BC "https://zh.wikipedia.org/wiki/%E4%BC%A6%E7%BA%B3%E5%BE%B7%C2%B7%E9%98%BF%E5%BE%B7%E6%9B%BC")（Leonard Adleman）在1977年一起提出的。

其实就是一个非对称加密算法。

RSA的作用
======

RSA本质上是一个加密算法，所以当然可以用来加解密。

不过一般把RSA当做签名算法使用，配合散列算法如SHA-1，SHA-256来使用。验签算法的全名叫做`SHA1withRSA`和`SHA256withSHA`

其中`SHA256withSHA`就是常说的RSA2算法了

加密与加签的区别？
=========

加密的重点是保证数据的**安全性**，确保数据可以送达到目的地并且通过私钥可以解密数据。

而加签的重点是确保数据的**完整性**，接收方通过签名来判断数据是否被修改过，但是通过签名是无法还原数据的。所以一般地，签名算法还要搭配对称加密算法来使用。这是因为对称加密算法更快。

RSA的加解密使用案例
===========

java

 代码解读

复制代码

`public class RSADemo {    public static void main(String[] args) throws Exception {         // 支持的算法：RSA SHA等 ,注意没有RSA2哦，RSA2是一个验签的名称全称SHA256withRSA         KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");         // 位数是可以指定大小的。当长度是512时，最多加密53字节明文。1024===117bytes。2048===245bytes         keyPairGenerator.initialize(2048);         KeyPair keyPair = keyPairGenerator.generateKeyPair();         PublicKey publicKey = keyPair.getPublic();         PrivateKey privateKey = keyPair.getPrivate();         // 把公钥私钥输出         System.out.println(Base64.getEncoder().encodeToString(publicKey.getEncoded()));         System.out.println(Base64.getEncoder().encodeToString(privateKey.getEncoded()));         // 加密         Cipher cipher = Cipher.getInstance("RSA");         cipher.init(Cipher.ENCRYPT_MODE, publicKey);         String number = "hello world!";         System.out.println("明文：" + number);         System.out.println("加密后用Base64编码的字符串：");         // base64编码容易阅读         String encrypt = Base64.getEncoder().encodeToString(cipher.doFinal(number.getBytes()));         System.out.println(encrypt);         cipher.init(Cipher.DECRYPT_MODE, privateKey);         // 因为上文做过编码，所以这里要用base64解码         byte[] decodeBytes = Base64.getDecoder().decode(encrypt);         byte[] bytes = cipher.doFinal(decodeBytes);         System.out.println("解密后的字符串：");         System.out.println(new String(bytes, StandardCharsets.UTF_8));     } }`

RSA加签/验签使用示例
============

**其中的公私钥可以通过加解密的案例获取**

其中的RSAUtils见下文

java

 代码解读

复制代码

`/**  * SHA256withRSA  验签  */ public class SHA256withRSADemo {     // 验签的全称就是SHA256withRSA,代表是使用sha256算法生成摘要，再使用rsa算法进行加密     // 同理，我们可以替换成 MD5withRSA SHA1withRSA 等     private static final String SIGNATURE_ALGORITHM = "SHA256withRSA";     private final static String PUBLIC_KEY_NAME = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvJWHTWgcfPjzWTt1OAUAvOnd8N/ITzP+Xe1PY2fMhFNzmRV9a78fAZ5C6ynFzsQGJNffvlw4HoB6HsUWmGymkR9950hqXXiMpbNoQ4MqEtxPKx1Blusp3E8tJ9ABzrSat4/PfkQ+Iw9t5sHQhSFt2kJCD7KUw9gW8hVMnQTngMlgvt1U9ozj7tBdQMRduk/KkA1G/ZxvYWb5ZcFb0PeHoUDuEr6HXOycxm6cRZBjly97IrfUCEemKKKPmjacntaP+pgS0cc9jWIYAeMhhjmRa7hY2pn6Q3mSiq+V9ruUnKQOlyLcQ1Y1wrfOydo0e/3jAzoLeJR8uWUnZQcxmnuzUwIDAQAB";     private final static String PRIVATE_KEY_NAME = "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC8lYdNaBx8+PNZO3U4BQC86d3w38hPM/5d7U9jZ8yEU3OZFX1rvx8BnkLrKcXOxAYk19++XDgegHoexRaYbKaRH33nSGpdeIyls2hDgyoS3E8rHUGW6yncTy0n0AHOtJq3j89+RD4jD23mwdCFIW3aQkIPspTD2BbyFUydBOeAyWC+3VT2jOPu0F1AxF26T8qQDUb9nG9hZvllwVvQ94ehQO4Svodc7JzGbpxFkGOXL3sit9QIR6Yooo+aNpye1o/6mBLRxz2NYhgB4yGGOZFruFjamfpDeZKKr5X2u5ScpA6XItxDVjXCt87J2jR7/eMDOgt4lHy5ZSdlBzGae7NTAgMBAAECggEAHX4/Ml5xciQXHuH7I584rdLfiH/fGm/1vKfUDiZaKGnKvurK+jJiPYUMTy3xxzQGB/YRAnr2teJ+9tf5AC6h4DluHeFH7UVgrbuAt2pIhrmY0hPZwaoWmmNxmvPfjH3XYpTlrQgsNZyAoiG2pFOFlChfn4fc10Iw2Hx3RmlRcWUId9dx742nDxTKjRgvTkk+epjFw2Ey02B222N6oyY3uEEgXHp/1cs53I25iaj5eni8L8BXmGogNF9uPpp8eEHTwp+YCn1sPHe4nZDnPm+ExMU92LcbTCkaeesFpD+ifbyAT8eGvZfOXsa+R3zGDEakFPgpY9flbz9QgydSYTnkaQKBgQDb+zfvZfOUajXSeqDhMDWtWlPsrtgu7Eryueh87gLSoVZGFH851vYCMkAj62PNo++F1ZPJJ+XOsHvaiW6hrXXgrmKU7F/QL6DLjMxhS6KzQ67KMbYVe56ilLfcW8sFdmGXK78+f5Q0zD8/bRFpvsjPU3VqLIYZbRq6YXZAB0FzmQKBgQDbdkHunNw7tJzmKsOtiECiXYSxT4eD98sh/LOEZG1JM0w84J2h6aTwLg/FdWYKnkkrs4HyWvaDZbo3rld7l6p9qFCM0VLUAuDBQRyTQxmRAhwZgcpHlRRuOwqH9P/NMfLwZnXS6ZJS7BPm6bb7iuY3U2XPHfEbrGICjQ4m0xLxywKBgQDA4+XGO4V8bC1JpFGRY+6NVRkl/qJ9cqC9eZqMgT9kZif6R1rP4tfQUTPAy1S2KruKhR6TUjLGLCZOGBg0GJ+2JfM3VpUlPb4m/gzwe5vsyLppfXGGIOGW+gTGao74+TbVkXyeVswkB7yl5wNP0ATRFwNr2CK2BN9c8rz3o+UWcQKBgQCgEQjVuKMJCRrG5boC/7XktsDpclAs+La3+1AT6AutsDSS0mEmjvs2EuJ96rqaVAiaTzsgQSg7fh7sLcSw6FX5gKH/k00ORWsYiR0Ga5JiKV/FWtzmiN116Kotr4xDZYMDxDd7tdB7mqSJbz1/CjgPckx3XCdXP8vcgHUp7BmNMQKBgFRZbnts4P+z+hgA8sjxYB7F2TXS6mcJJrBvXE0fi2XWn61M7NR3KBBH7rJ1tZG5AyIDuZf0/3boAtilrc+2dkpivqmuhHupjwxCZRIT0AqhndoAFuUTaLxkRHRrrzufvf04MjMKljQxbCnStCKf686G5Sii1DZ9dOuoc95vcjtN";     public static void main(String[] args) throws Exception {         // 准备数据         String msg = "hello";         // 验签         PublicKey publicKey = RSAUtils.getPublicKey(PUBLIC_KEY_NAME);         PrivateKey priKey = RSAUtils.getPrivateKey(PRIVATE_KEY_NAME);         Signature signature = Signature.getInstance(SIGNATURE_ALGORITHM);         signature.initSign(priKey);         signature.update(msg.getBytes(StandardCharsets.UTF_8));         byte[] sign = signature.sign();         System.out.println("加签后的签名：");         System.out.println(Base64.getEncoder().encodeToString(sign));         // 验证签名的Signature需要重新生成         Signature signature2 = Signature.getInstance(SIGNATURE_ALGORITHM);         signature2.initVerify(publicKey);         signature2.update(msg.getBytes(StandardCharsets.UTF_8));         boolean verify = signature2.verify(sign);         System.out.println("验签结果" + verify);     } }`

根据字符获取Java对象`KeyPair时`，对象说明

1）KeyPairGenerator类用于生成公钥和私钥对。 密钥对生成器使用getInstance工厂方法（返回给定类的实例的静态方法）构造。

2）KeyPair类是密钥对（一个公钥和一个私钥）的简单持有者。 它不强制执行任何安全性，并且在初始化时应该像PrivateKey那样对待。

3）KeyFactory类

4）PKCS8EncodedKeySpec类代表私有密钥的ASN.1编码，根据ASN.1类型PrivateKeyInfo进行编码。

5）X509EncodedKeySpec类表示公钥的ASN.1编码，根据ASN.1类型SubjectPublicKeyInfo进行编码。

6）Cipher类提供加密和解密的加密密码的功能。 它构成了Java加密扩展（JCE）框架的核心。

7）Signature类用于向应用程序提供数字签名算法的功能。 数字签名用于数字数据的认证和完整性保证。

RSA本质上是一个非对称加密算法，验签是其延伸的作用，要搭配散列算法使用，比如MD5、SHA256等

先加签后加密还是先加密后加签？
===============

一般来说，先加签再加密。

因为同一明文加密后的密文是随机的。所以如果先加密后加签，加签的内容是随机的密文，保证了随机的密文的完整性而没有保证明文的完整性。

加密之后密文的完整性是可以通过解密的过程来校验的。因此检验加密后的密文完整性没有意义。

“在同时需要对数据进行对称加密和数字签名时，使用先签名后加密的方式”。

说明：**先签名后加密是指先对消息进行签名，然后对消息的签名值和消息一起进行加密。如果采用先加密后签名的方式，接收方只能知道该消息是由签名者发送过来的，但并不能确定签名者是否是该消息的创建者。比如在发送一个认证凭据时采用先加密后签名的方式，消息在发送过程中就有可能被第三方截获并将认证凭据密文的签名值修改为自己的签名，然后发送给接收方。第三方就有可能在不需知道认证凭据的情况下通过这种方式来通过认证获取权限。**

采用先签名后加密方式可以避免这类问题的发生，因为只有在知道消息明文的情况下才能对其进行签名。

那么先加签后加密一定不安全吗？也不一定，

使用私钥加签还是公钥加签
============

记住：私钥加签公钥解。私钥只能留在发送信息者的手里。

RSAUtils工具类
===========

java

 代码解读

复制代码

`package org.example.rsa; import javax.crypto.Cipher; import java.io.ByteArrayOutputStream; import java.security.*; import java.security.spec.PKCS8EncodedKeySpec; import java.security.spec.X509EncodedKeySpec; import java.util.Base64;   /**  * RSA算法加密/解密和签名/验签工具类  * 生成密钥对（公钥和私钥）  * 加密内容与签名内容进行Base64加密解密（有利于HTTP协议下传输）  */ public class RSAUtils {     /**      * 算法名称      */     private static final String ALGORITHM = "RSA";     /**      * 签名算法 MD5withRSA 或 SHA1WithRSA 等      */     public static final String SIGNATURE_ALGORITHM = "MD5withRSA";     /**      * 密钥长度默认是1024位:      * 加密的明文最大长度 = 密钥长度 - 11（单位是字节，即byte）      */     private static final int KEY_SIZE = 1024;     /**      * RSA最大加密明文大小      */     private static final int MAX_ENCRYPT_BLOCK = 117;       /**      * RSA最大解密密文大小      */     private static final int MAX_DECRYPT_BLOCK = 128;       private RSAUtils() {     }       /**      * 获取密钥对      *      * @return 密钥对      */     public static KeyPair getKeyPair() throws Exception {         KeyPairGenerator generator = KeyPairGenerator.getInstance(ALGORITHM);         generator.initialize(KEY_SIZE);         return generator.generateKeyPair();     }       /**      * 私钥字符串转PrivateKey实例      *      * @param privateKey 私钥字符串      * @return      */     public static PrivateKey getPrivateKey(String privateKey) throws Exception {         KeyFactory keyFactory = KeyFactory.getInstance(ALGORITHM);         byte[] decodedKey = Base64.getDecoder().decode(privateKey.getBytes("UTF-8"));// 对私钥进行Base64编码解密         PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(decodedKey);         return keyFactory.generatePrivate(keySpec);     }       /**      * 公钥字符串转PublicKey实例      *      * @param publicKey 公钥字符串      * @return      */     public static PublicKey getPublicKey(String publicKey) throws Exception {         KeyFactory keyFactory = KeyFactory.getInstance(ALGORITHM);         byte[] decodedKey = Base64.getDecoder().decode(publicKey.getBytes("UTF-8")); // 对公钥进行Base64编码解密         X509EncodedKeySpec keySpec = new X509EncodedKeySpec(decodedKey);         return keyFactory.generatePublic(keySpec);     }       /**      * 公钥加密      *      * @param data      待加密数据      * @param publicKey 公钥      * @return      */     public static String encryptByPublicKey(String data, PublicKey publicKey) {         try (                 ByteArrayOutputStream out = new ByteArrayOutputStream();         ) {             Cipher cipher = Cipher.getInstance(ALGORITHM);             cipher.init(Cipher.ENCRYPT_MODE, publicKey);             int inputLen = data.getBytes("UTF-8").length;             int offset = 0;             byte[] cache;             int i = 0;             // 对数据分段加密             while (inputLen - offset > 0) {                 if (inputLen - offset > MAX_ENCRYPT_BLOCK) {                     cache = cipher.doFinal(data.getBytes("UTF-8"), offset, MAX_ENCRYPT_BLOCK);                 } else {                     cache = cipher.doFinal(data.getBytes("UTF-8"), offset, inputLen - offset);                 }                 out.write(cache, 0, cache.length);                 i++;                 offset = i * MAX_ENCRYPT_BLOCK;             }             byte[] encryptedData = out.toByteArray();             // 获取加密内容使用Base64进行编码加密,并以UTF-8为标准转化成字符串             // 加密后的字符串             //return new String(Base64.encodeBase64String(encryptedData));             return new String(Base64.getEncoder().encode(encryptedData), "UTF-8");         } catch (Exception e) {             e.printStackTrace();         }         return null;     }       /**      * 私钥解密      *      * @param data       待解密数据      * @param privateKey 私钥      * @return      */     public static String decryptByPrivateKey(String data, PrivateKey privateKey) {         try (                 ByteArrayOutputStream out = new ByteArrayOutputStream();         ) {             Cipher cipher = Cipher.getInstance(ALGORITHM);             cipher.init(Cipher.DECRYPT_MODE, privateKey);               // 对待解密数据进行Base64编码解密             byte[] dataBytes = Base64.getDecoder().decode(data.getBytes("UTF-8"));             int inputLen = dataBytes.length;             int offset = 0;             byte[] cache;             int i = 0;             // 对数据分段解密             while (inputLen - offset > 0) {                 if (inputLen - offset > MAX_DECRYPT_BLOCK) {                     cache = cipher.doFinal(dataBytes, offset, MAX_DECRYPT_BLOCK);                 } else {                     cache = cipher.doFinal(dataBytes, offset, inputLen - offset);                 }                 out.write(cache, 0, cache.length);                 i++;                 offset = i * MAX_DECRYPT_BLOCK;             }             byte[] decryptedData = out.toByteArray();             // 解密后的内容             return new String(decryptedData, "UTF-8");         } catch (Exception e) {             e.printStackTrace();         }         return null;     }       /**      * 私钥签名      *      * @param data       待签名数据      * @param privateKey 私钥      * @return 签名      */     public static String sign(String data, PrivateKey privateKey) throws Exception {         byte[] keyBytes = privateKey.getEncoded();         PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(keyBytes);         KeyFactory keyFactory = KeyFactory.getInstance(ALGORITHM);         PrivateKey key = keyFactory.generatePrivate(keySpec);         Signature signature = Signature.getInstance(SIGNATURE_ALGORITHM);         signature.initSign(key);         signature.update(data.getBytes());         return new String(Base64.getEncoder().encode(signature.sign()));  // 对签名内容进行Base64编码加密     }       /**      * 公钥验签      *      * @param srcData   原始字符串      * @param publicKey 公钥      * @param sign      签名      * @return 是否验签通过      */     public static boolean verify(String srcData, PublicKey publicKey, String sign) throws Exception {         byte[] keyBytes = publicKey.getEncoded();         X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyBytes);         KeyFactory keyFactory = KeyFactory.getInstance(ALGORITHM);         PublicKey key = keyFactory.generatePublic(keySpec);         Signature signature = Signature.getInstance(SIGNATURE_ALGORITHM);         signature.initVerify(key);         signature.update(srcData.getBytes());         return signature.verify(Base64.getDecoder().decode(sign.getBytes())); // 对验签结果进行Base64编码解密     }       public static void main(String[] args) {         try {             // 生成密钥对             KeyPair keyPair = getKeyPair();             String privateKey = new String(Base64.getEncoder().encode(keyPair.getPrivate().getEncoded()), "UTF-8");             String publicKey = new String(Base64.getEncoder().encode(keyPair.getPublic().getEncoded()), "UTF-8");             System.out.println("私钥:" + privateKey);             System.out.println("公钥:" + publicKey);             // RSA加密             String data = "签名算法可以是NIST标准DSA，使用DSA和SHA-1。 使用SHA-1消息摘要算法的DSA算法可以指定为SHA1withDSA 。 在RSA的情况下，\n" +                     "存在对消息多个选择摘要算法，所以签名算法可被指定为，例如， MD2withRSA ， MD5withRSA ，或SHA1withRSA 。 必须指定算法名称，因为没有默认值。";             String encryptData = encryptByPublicKey(data, getPublicKey(publicKey));             System.out.println("加密后内容:" + encryptData);             // RSA解密             String decryptData = decryptByPrivateKey(encryptData, getPrivateKey(privateKey));             System.out.println("解密后内容:" + decryptData);               // RSA签名             String sign = sign(data, getPrivateKey(privateKey));             System.out.println("签名内容:" + sign);             // RSA验签             boolean result = verify(data, getPublicKey(publicKey), sign);             System.out.print("验签结果:" + result);           } catch (Exception e) {             e.printStackTrace();             System.out.print("加密解密异常");         }     } }`