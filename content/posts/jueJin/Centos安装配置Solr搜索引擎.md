---
author: "正直的金鱼"
title: "Centos安装配置Solr搜索引擎"
date: 2024-07-29
description: "Centos安装配置Solr搜索引擎创建好后从Solr中查询数据并提供快速、准确、可靠搜索的RESTfulWeb服务就很容易了。(\*^_^*)"
tags: ["后端"]
ShowReadingTime: "阅读1分钟"
weight: 780
---
### 前提条件：

*   至少1GB的内存
*   安装了python-software-properties软件包。yum install python-software-properties
*   安装了最新版Java

### 安装步骤：

（1）下载Solr的tar文件，该版本非最新版，具体步骤大同小异

bash

 代码解读

复制代码

`wget https://archive.apache.org/dist/lucene/solr/5.5.4/solr-5.5.4.tgz`

（2）解压tar文件

bash

 代码解读

复制代码

`tar xzf solr-5.5.4.tgz`

（3）执行安装脚本

bash

 代码解读

复制代码

`solr-5.5.4/bin/install_solr_service.sh`

安装大概会花费1分钟时间，一旦安装完成，可以访问http://your\_server\_ip:8983/solr 。web界面如下：

![b0d0674da45732598a398e5832a647e7.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/7a76ee037f704647a6ef0caf7b19f0b0~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5q2j55u055qE6YeR6bG8:q75.awebp?rk3s=f64ab15b&x-expires=1727659979&x-signature=7YInHb94NeGNyKHb%2BK6pB8UezdA%3D)

也可以输入命令service solr status查看服务状态。正常情况如下

powershell

 代码解读

复制代码

`Found 1 Solr nodes:  ​ Solr process 2750 running on port 8983 ​ . . .`

### 配置solr进行简单的数据导入

（1）在solrconfig.xml中添加下面的配置这段代码指定了数据导入配置文件的路径。该配置文件作为Solr的一部分随Solr一同安装。将这段代码中的路径更新到该文件在你机器上的位置。

xml

 代码解读

复制代码

`<requestHandler name="/dataimport" class="org.apache.solr.handler.dataimport.DataImportHandler"> 	<lst name="defaults"> 		<str name="config">/path/to/my/dbconfigfile.xml</str> 	</lst> </requestHandler>`

（2）在dbconfig文件中添加下面的内容。将数据库表导入Solr中进行索引。这段代码中，我们使用数据选择查询来指定数据源。

xml

 代码解读

复制代码

`<dataConfig> <dataSource driver="org.hsqldb.jdbcDriver"  			url="jdbc:hsqldb:./example-DIH/hsqldb/ex" 			user="sa" password="secret" /> <document> 	<entity name="products" query="select * from products " 			deltaQuery="select id from products 			where updated_date > 			'${dataimporter.last_index_time}'" 	/> </document> </dataConfig>`

（3）返回shell提示符，运行下面的命令进行数据导入和索引：

bash

 代码解读

复制代码

`bin/solr -e dih`

一旦所有数据在Solr中进行了索引，创建从Solr中查询数据并提供快速、准确、可靠搜索的RESTful Web服务就很容易了。(\*^\_^\*)

该内容为本人原创，已同步到csdn.[  
dzqdzq123](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fdzqdzq123 "https://blog.csdn.net/dzqdzq123")好看请点个赞吧！