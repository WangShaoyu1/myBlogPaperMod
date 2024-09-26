---
author: "老马啸西风"
title: "字符串值提取工具-08-java执行xml解析,xpath"
date: 2024-08-18
description: "#值提取系列[字符串值提取工具-01-概览](https://houbb.github.io/2024/08/05/value-extraction-01-overview)[字符串值提取"
tags: ["Java"]
ShowReadingTime: "阅读1分钟"
weight: 576
---
值提取系列
=====

[字符串值提取工具-01-概览](https://link.juejin.cn?target=https%3A%2F%2Fhoubb.github.io%2F2024%2F08%2F05%2Fvalue-extraction-01-overview "https://houbb.github.io/2024/08/05/value-extraction-01-overview")

[字符串值提取工具-02-java 调用 js](https://link.juejin.cn?target=https%3A%2F%2Fhoubb.github.io%2F2024%2F08%2F05%2Fvalue-extraction-02-java-call-js "https://houbb.github.io/2024/08/05/value-extraction-02-java-call-js")

[字符串值提取工具-03-java 调用 groovy](https://link.juejin.cn?target=https%3A%2F%2Fhoubb.github.io%2F2024%2F08%2F05%2Fvalue-extraction-03-java-call-groovy "https://houbb.github.io/2024/08/05/value-extraction-03-java-call-groovy")

[字符串值提取工具-04-java 调用 java? Janino 编译工具](https://link.juejin.cn?target=https%3A%2F%2Fhoubb.github.io%2F2024%2F08%2F05%2Fvalue-extraction-04-java-call-java "https://houbb.github.io/2024/08/05/value-extraction-04-java-call-java")

[字符串值提取工具-05-java 调用 shell](https://link.juejin.cn?target=https%3A%2F%2Fhoubb.github.io%2F2024%2F08%2F05%2Fvalue-extraction-05-java-call-shell "https://houbb.github.io/2024/08/05/value-extraction-05-java-call-shell")

[字符串值提取工具-06-java 调用 python](https://link.juejin.cn?target=https%3A%2F%2Fhoubb.github.io%2F2024%2F08%2F05%2Fvalue-extraction-06-java-call-python "https://houbb.github.io/2024/08/05/value-extraction-06-java-call-python")

[字符串值提取工具-07-java 调用 go](https://link.juejin.cn?target=https%3A%2F%2Fhoubb.github.io%2F2024%2F08%2F05%2Fvalue-extraction-07-java-call-go "https://houbb.github.io/2024/08/05/value-extraction-07-java-call-go")

[字符串值提取工具-08-java 通过 xml-path 解析 xml](https://link.juejin.cn?target=https%3A%2F%2Fhoubb.github.io%2F2024%2F08%2F05%2Fvalue-extraction-08-java-xpath "https://houbb.github.io/2024/08/05/value-extraction-08-java-xpath")

[字符串值提取工具-09-java 执行 json 解析, json-path](https://link.juejin.cn?target=https%3A%2F%2Fhoubb.github.io%2F2024%2F08%2F05%2Fvalue-extraction-09-java-json-path "https://houbb.github.io/2024/08/05/value-extraction-09-java-json-path")

[字符串值提取工具-10-java 执行表达式引擎](https://link.juejin.cn?target=https%3A%2F%2Fhoubb.github.io%2F2024%2F08%2F05%2Fvalue-extraction-10-java-expression "https://houbb.github.io/2024/08/05/value-extraction-10-java-expression")

场景
==

我们希望通过 java 执行 xml-path 解析 xml。

基础支持
====

[XPath XML 文档中查找信息的语言](https://link.juejin.cn?target=https%3A%2F%2Fhoubb.github.io%2F2017%2F06%2F21%2Fconfig-xml-xpath-intro "https://houbb.github.io/2017/06/21/config-xml-xpath-intro")

核心实现
====

代码
--

java

 代码解读

复制代码

`/**  *  * @since 0.4.0  */ public class ValueExtractionXmlPath extends AbstractValueExtractionAdaptor<Document> {     // 创建 XPath 对象     private final XPathFactory xPathFactory = XPathFactory.newInstance();     private final XPath xpath = xPathFactory.newXPath();     @Override     protected Document prepare(ValueExtractionContext context) {         try {             final String xml = (String) context.getDataMap().get("xml");             // 将 XML 字符串解析为 Document 对象             DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();             DocumentBuilder builder = factory.newDocumentBuilder();             Document document = builder.parse(new ByteArrayInputStream(xml.getBytes(StandardCharsets.UTF_8)));             return document;         } catch (ParserConfigurationException e) {             throw new RuntimeException(e);         } catch (SAXException e) {             throw new RuntimeException(e);         } catch (IOException e) {             throw new RuntimeException(e);         }     }     @Override     protected Object evaluate(Document prepareObject, String script, ValueExtractionContext context) {         try {             // 编译并执行 XPath 表达式             XPathExpression expr = xpath.compile(script);             return expr.evaluate(prepareObject);         } catch (XPathExpressionException e) {             throw new RuntimeException(e);         }     } }`

测试代码
----

java

 代码解读

复制代码

`@Test public void test() {     String xml = "        <company>\n" +             "            <employee>\n" +             "                <name>John Doe</name>\n" +             "                <position>Software Engineer</position>\n" +             "                <salary>75000</salary>\n" +             "            </employee>\n" +             "            <employee>\n" +             "                <name>Jane Smith</name>\n" +             "                <position>Project Manager</position>\n" +             "                <salary>85000</salary>\n" +             "            </employee>\n" +             "        </company>";     // 测试 getValueByXPath 方法     String script = "//employee[1]/name/text()";     // 创建绑定并设置参数     Map<String, Object> bindings = new HashMap<>();     bindings.put("xml", xml);     String result = ValueExtractionBs.newInstance()             .scripts(Arrays.asList(script))             .valueExtraction(ValueExtractions.xmlPath())             .dataMap(bindings)             .extract().toString();     Assert.assertEquals("{//employee[1]/name/text()=John Doe}", result); }`