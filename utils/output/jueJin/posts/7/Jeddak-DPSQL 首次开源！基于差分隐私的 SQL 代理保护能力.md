---
author: "字节跳动技术团队"
title: "Jeddak-DPSQL 首次开源！基于差分隐私的 SQL 代理保护能力"
date: 2023-05-30
description: "本文主要介绍火山引擎安全研究团队在差分隐私技术应用上的首个开源项目 —— Jeddak-DPSQL。"
tags: ["开源中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读7分钟"
weight: 1
selfDefined:"likes:5,comments:0,collects:12,views:23561,"
---
1\. 背景
======

火山引擎对于用户敏感数据尤为重视，在火山引擎提供的数据分析产品中，广泛采用差分隐私技术对用户敏感信息进行保护。此类数据产品通常构建于 ClickHouse 等数据引擎之上，以 SQL 查询方式来执行计算逻辑，且查询逻辑往往较为复杂，因此对差分隐私的应用提出了以下要求：

*   零改造、零感知：最大程度避免影响业务现有查询方式，最好做到业务零感知、零改造；
*   良好、灵活的适配性：能够适配不同数据引擎的查询语法，以及能够处理包含多层嵌套、多重计算、多表连接等情形的复杂 SQL 语句；
*   安全性与可用性平衡：能够根据业务数据质量要求，计算合理的隐私预算，在安全性和数据可用性之间保持平衡；

针对以上需求，火山引擎安全研究团队开发了 Jeddak-DPSQL：一种基于差分隐私的 SQL 代理工具。Jeddak-DPSQL 能够兼容多种数据引擎和SQL方言，内嵌多种差分噪声扰动算法，具备隐私预算管理能力，并且能够与底层数据引擎结合，在数据分析师无感的情况下，对 SQL 语句进行自动化分析和结果加噪处理。作为数据安全和隐私合规治理的标准能力之一，Jeddak-DPSQL 已经在抖音集团相关业务中得到了普遍应用与验证。

在实际解决公司内部面临的问题风险后，我们决定对 Jeddak-DPSQL 进行开源，希望能够为同样面临该类问题的企业和个人提供一定参考和帮助，同时也希望能够有更多的外部开发者能够一起对该开源项目进行共建，完善 Jeddak-DPSQL 产品功能，共同构建更完备的应用生态。

2\. 全面了解 Jeddak-DPSQL
=====================

2.1 Jeddak-DPSQL 介绍
-------------------

Jeddak-DPSQL 采用**中心化** **差分隐私**  **（Centralized Differential Privacy，简称 CDP，适用于数据管理者可信的场景）**  模式，以中间件的形式接收 SQL 统计查询请求，返回满足差分隐私的查询结果。一个典型的查询请求处理流程如下：

*   首先，核心服务接受客户提交的 SQL 查询语句，对该语句进行解析和重写，以便于计算隐私噪声(如将 AVG 计算改为 SUM/COUNT）；
*   然后，核心服务调用元数据管理服务，计算重写后的 SQL 查询所对应的数据表敏感度，同时在数据库上执行重写后的 SQL 查询，得到原始的查询结果；
*   最后，核心服务调用隐私预算管理服务得到为该查询分配的隐私预算，并结合敏感度在原始的查询结果中添加噪声并返回。

![图片](/images/jueJin/ae3c08beea664f4.png)

2.2 Jeddak-DPSQL 解决的问题
----------------------

### 案例背景

假设有一个数据库 business，存储用户消费数据，使用 clickhouse 引擎，其中一个表 user 存储用户信息，表中存在以下列：uid，name，age，sex，city，代表用户id、姓名、年龄、性别、城市。

**查询需求**

我们要查询用户数量和平均年龄的城市分布，使用 SQL 语句 1：

```sql
SELECT  COUNT(*) AS cnt，AVG(age) as agev, city
FROM business.user
group by city
```

### 风险

如果不应用隐私保护技术，可能面临差分攻击的风险，比如攻击者通过某渠道得知张三的 uid 为 803719，构造下面的 SQL 语句 2：

```sql
SELECT  COUNT(*) AS cnt，AVG(age) as agev, city
FROM business.user
WHERE uid != 803719
group by city
```

通过执行上面的 SQL 语句1和 SQL 语句2，可分别得到两个查询结果：

![图片](/images/jueJin/502b7c7e18254e3.png)

那么就可以通过比较两次查询结果得知**张三所在的城市是北京，年龄大约 61 岁**（120008_x49.3276 = 5919706.62，120007_x49.3275 = 5919645.29，5919706.62 - 5919645.29 约等于 61）

以上是一个简单的例子，现实场景中，攻击者可能通过背景知识构造更多样、更复杂的查询语句达到窃取隐私的目的。

因此，在上述 SQL 查询场景下，可以通过接入 Jeddak-DPSQL 对 SQL 进行分析和重写，最终执行重写后的 SQL 能够保证返回给使用者的数据满足差分隐私要求，进而达到对个人隐私保护的效果。

2.3 Jeddak-DPSQL 在火山引擎的应用验证
---------------------------

1.  Jeddak-DPSQL已接入火山引擎的增长分析（finder)、A/B 测试等产品，间接服务300+外部客户，日均处理查询请求 200+。Jeddak-DPSQL服务不仅帮助业务满足了隐私保护和业务合规的需求，同时也成为创新型隐私计算技术应用的典范案例。
2.  开放隐私计算 OpenMPC 对外公布了“隐私计算 2021 年度优秀应用案例 TOP 10”。**火山引擎** **云安全凭借“融合** **差分隐私** **的火山引擎 DPSQL 服务”案例，成功入选 TOP 10。**

3\. 如何使用 Jeddak-DPSQL
=====================

**git** **开源** **项目地址：**  **[github.com/bytedance/J…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fbytedance%2FJeddak-DPSQL "https://github.com/bytedance/Jeddak-DPSQL")**

3.1 下载
------

```bash
git clone https://github.com/bytedance/Jeddak-DPSQL
```

3.2 快速部署
--------

完成 Jeddak-DPSQL 下载后，按照 README 中的部署引导部分完成服务部署，整个部署过程包括以下步骤：

*   服务依赖包安装：进入项目根目录，使用 pip install -r requirements.txt 安装服务所需完整 pip 包
*   MetaData 存储准备：在使用DPSQL 时，需要维护源数据表的 MetaData 信息，为后续加噪计算敏感度作准备。Jeddak-DPSQL 使用 Mysql 对相应元数据信息进行存储，因此需要用户提前在自己的Mysql数据库中创建相应的表
*   隐私预算消耗存储准备：使用 Jeddak-DPSQL 系统过程，可以记录对表级别的数据查询时的隐私预算消耗。主要通过Mysql进行记录，因此需要用户提前在自己的Mysql数据库中创建相应的表
*   数据库连接配置：Jeddak-DPSQL 中使用数据库主要有 Mysql 和 Redis，因此需要对这两个数据库连接地址进行配置
*   服务启动：完成上述配置后可以在项目根目录运行 bootstrap.sh 脚本启动服务

3.3 正式使用
--------

完成 Jeddak-DPSQL 部署后，按照 README 中的快速开始部分可以进行功能体验，整个过程如下：

*   选择要测试的数据源(Hive 或 ClickHouse)，导入要进行查询测试的原始数据集
*   初始化metadata和隐私预算

   1. 生成 metadata

   2. 启动dpsql服务后， 调用接口 `/api/v1/metadata/generate`，生成metadata，可参考：

```python
def meta_generate():
    args = {
        "db_config": {
        "host": <hive_host>,
        "database": <hive_dbname>,
        "username": <hive_username>,
        "password": <hive_password>
        },
        "table_name": "us_accidents_dec21_updated",
        "db_type": db_type
    }
    route_path = "/api/v1/metadata/generate"# local service,  host:127.0.0.1, port:5000url = "http://%s:%s/%s" % (host, port, route_path)
headers = {"content-type": "application/json"}
r = requests.post(url, json=args, headers=headers)

if __name__ == '__main__':
meta_generate()
```

3.  确认metadata 生成完成
4.  调用 `/api/v1/metadata/get` 接口，确认 metadata 生成完成

```python

def meta_get():
    args = {
    "prefix": <hive_host>,
    "db_name": <hive_dbname>,
    "table_name": "us_accidents_dec21_updated"
}
route_path = "/api/v1/metadata/get"# local service,  host:127.0.0.1, port:5000url = "http://%s:%s/%s" % (host, port, route_path)
headers = {"content-type": "application/json"}
r =  requests.get(url, json=args, headers=headers)
print(r.text)
```

*    调用隐私保护查询接口，获得经过差分隐私保护的查询结果

```python

def query_sql_noise(sql, data_source):
    key = {
    "sql": sql,
        "dbconfig": {
        "reader": data_source,
        "host": <hive_host>,
        "database": <hive_dbname>,
        "port": <hive_port>
        },
            "queryconfig": {
            "traceid": "traceid",
        }
    }
    route_path = "/api/v1/query"url = "http://%s:%s/%s" % (host, port, route_path)
headers = {"content-type": "application/json"}
r = requests.post(url, json=key, headers=headers)
return res
if __name__ == "__main__":
sql = "select count(severityc) from menu_page group by severity"
section = "hivereader"
res = query_sql_noise(sql, section)
print(res)
```

更多接口使用方式可以参考项目 README 中的 API Documentation 部分

4\. 后续计划
========

由于当前是 Jeddak-DPSQL 的首个开源版本，因此还存在很多不完善的地方，希望大家能够多多谅解。Jeddak-DPSQL 计划进行长期维护，欢迎大家使用，也希望有更多的外部开发者能够一起对该开源项目进行共建，完善产品功能，构建更完备的应用生态。

5\. 关于安全研究
==========

火山引擎安全研究部门的愿景是创新突破前沿安全理论技术，赋能数字经济。部门当前以数据安全中心私有化单品-可信隐私计算产品 Jeddak 为载体，从可信计算、联邦学习、多方安全计算、差分隐私、密文计算、共识计算等方向着手，开展隐私计算技术的前沿研究和应用探索。基于这些领域最新前沿理论技术，创新研发、突破瓶颈，实现数据全生命周期安全与隐私保护，以及可信隐私计算等应用服务落地：赋能业务、保驾护航；更进一步打破数据孤岛，推动数据多源融合与流通交易，发挥数据价值。