---
author: ""
title: "npm 私库从搭建到数据迁移最后容灾备份的一些解决方案"
date: 2020-12-09
description: "按照国际惯例，正文开始之前，我们先简单介绍下目前市面上的 npm 私库开源框架。 Verdaccio 是 sinopia 开源框架的一个分支。它提供了自己的小数据库，以及代理其他注册中心的能力（例如。npmjs.org 网站)，配置以及部署相对简单，一步到胃。如果公司的私包…"
tags: ["前端中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读9分钟"
weight: 1
selfDefined:"likes:113,comments:11,collects:119,views:4807,"
---
![](/images/jueJin/390e29834bd5468.png)

> 这是第 80 篇不掺水的原创，想获取更多原创好文，请搜索公众号关注我们吧~ 本文首发于政采云前端博客：[npm 私库从搭建到数据迁移最后容灾备份的一些解决方案](https://link.juejin.cn?target=https%3A%2F%2Fzoo.team%2Farticle%2Fset-up-the-npm-private-library "https://zoo.team/article/set-up-the-npm-private-library")

![](/images/jueJin/f044dfd61aea41e.png)

前言
--

按照国际惯例，正文开始之前，我们先简单介绍下目前市面上的 npm 私库开源框架。

*   Verdaccio

Verdaccio 是 sinopia 开源框架的一个分支。它提供了自己的小数据库，以及代理其他注册中心的能力（例如。npmjs.org 网站)，配置以及部署相对简单，一步到"胃"。如果公司的私包比较少的话或者你想偷懒，可以考虑一下。

*   Cnpmjs.org

大名鼎鼎的 cnpm，想必各位早就感受到了它的速度之“快”，没错，它的 register 服务就是[淘宝镜像](https://link.juejin.cn?target=https%3A%2F%2Fregistry.npm.taobao.org%2F "https://registry.npm.taobao.org/")。主要是基于Koa、MySQL 和简单存储服务的企业专用 npm 注册和 web 服务，其中最强大的功能就是它的同步模块机制（定时同步所有源 registry 的模块、只同步已经存在于数据库的模块、只同步 popular 模块）。

*   Nexus

后端开发的小伙伴应该比较熟悉。Nexus2 主要是用于 maven/gralde 仓库的统一管理，而 Nexus3 则添加了npm插件，可以对 npm 提供支持，其中 npm 仓库有三种类型，分别是 hosted（私有仓库）、proxy（代理仓库）、group（组合仓库）。

总体来讲，抛开 Nexus，虽然 Cnpmjs.org 在部署过程以及总体设计方案上相对于 Verdaccio 复杂的多，但是它提供更高的拓展性，定制性，可以支持多种业务使用场景。接下来，我们分别从 Cnpmjs.org 容器化部署、数据迁移、OSS 容灾备份等内容，层层展开。

Cnpmjs.org 容器化部署
----------------

目前，公司的应用部署基本都是容器化部署，内部搭建了 ipaas 平台，应用流程化部署以及一键发布。而 **Cnpmjs.org** 也附带了 Dockerfile 以及 docker-compose.yml 文件，所以，这里大致讲解下怎么用 **docker** 部署吧。

*   首先让我们看看 **Dockerfile** 文件

```dockerfile
FROM node:12
MAINTAINER zian yuanzhian@cai-inc.com

# Working enviroment
ENV \
CNPM_DIR="/var/app/cnpmjs.org" \
CNPM_DATA_DIR="/var/data/cnpm_data"

# shell格式
# 在docker build 时运行
RUN mkdir -p ${CNPM_DIR}

# 指定工作目录：用 WORKDIR 指定的工作目录，会在构建镜像的每一层中都存在
WORKDIR ${CNPM_DIR}

# 复制指令：从上下文目录中复制目录或文件到容器里指定的路径
COPY package.json ${CNPM_DIR}

RUN npm set registry https://registry.npm.taobao.org

RUN npm install --production

COPY .  ${CNPM_DIR}
COPY docs/dockerize/config.js  ${CNPM_DIR}/config/

# 声明端口（7001为register服务、7002为web服务）
EXPOSE 7001/tcp 7002/tcp

# 匿名数据卷：在启动容器时忘记挂载数据卷，会自动挂载到匿名卷。
VOLUME ["/var/data/cnpm_data"]

RUN chmod +x ${CNPM_DIR}/docker-entrypoint_prod.sh

# Entrypoint
# exec格式
# 在docker run 时运行
# dockerfile存在多个 CMD 命令，仅最后一个生效
# CMD ["node", "dispatch.js"]
CMD ["npm", "run", "prod"]
```

这里把 **CMD** 命令修改为`["npm", "run", "prod"]`，因为增加了一层不同环境的 **shell** 脚本，目前全局变量全都存放在这里。

示例：docker-entrypoint\_env.sh

```shell
export DB='db_cnpmjs'
export DB_USRNAME='root'
export DB_PASSWORD='123456'
export DB_HOST='127.0.0.1'

export BINDING_HOST='0.0.0.0'

DEBUG=cnpm* node dispatch.js
```

*   再修改下 **docker-compose.yml** 文件，这里把 **mysql-db** 这个服务删掉了，原因是可通过 **/docs/dockerize/config.js** 下的配置文件去连接公司测试环境的 **mysql** 数据库，则不需要构建生成 **mysql-db镜像** 。

```compose.yml
version: '3' # docker版本
services: # 配置的容器列表
web: # 自定义，服务名称
build: # 基于dockerfile构建镜像(可增加args)
context: .
dockerfile: Dockerfile ## 依赖的Dockerfile文件
image: cnpmjs.org # 镜像名称或id
volumes:
- cnpm-files-volume:/var/data/cnpm_data
ports:
- "7001:7001"
- "7002:7002"
```

注意点：1、全局配置文件路径： **/docs/dockerize/config.js** ；2、**bindingHost** 为 0.0.0.0 。

*   最后，在控制台敲下`docker-compose up -d`，即以守护进程模式形式启动应用，然后打开浏览器入`http://127.0.0.1:7002`，就会看到 web 页面。执行 `npm config set registry http://127.0.0.1:7001` 可设置为搭建的私库的镜像源地址，这里推荐使用 `nrm`，可自由切换 npm 源。

展示站点如下图：

![](/images/jueJin/0813e94d563c46f.png)

注意点：1、当你改变本地代码之后，先执行 **docker-compose build** 构建新的镜像，然后执行 **docker-compose up -d** 取代运行中的容器。

数据迁移
----

由于公司之前用的 **Verdaccio** 搭建的私库，要切换使用新的 **npm 私库**，意味着要把之前发布过的私包全部迁移过来。大概统计了下，有400 多个 package，总共有 7000 多个版本，按照正常逻辑，做数据迁移首先会从数据库下手，但是 **Verdaccio** 并不依赖数据库。刚开始没有一点头绪，大概看了下 **Cnpmjs.org** 的源码，了解到当我们 **publish** 模块时， 它是怎么把 **npm 模块** 的元数据存储到数据库，下面我们一步步来揭开她的面纱。

通过路由文件（`/routes/registry.js`）我们很容易找到`/controllers/registry/package/save.js`，这个文件便是我们想要的。

核心代码：

```js
var pkg = this.request.body; // 这里拿到npm模块元数据，即package.json文件经过libnpmpublish模块处理过的json数据
var username = this.user.name; // 当前用户名
var name = this.params.name || this.params[0]; // npm模块名
var filename = Object.keys(pkg._attachments || {})[0]; // npm模块的压缩后的文件名
var version = Object.keys(pkg.versions || {})[0]; // npm模块的最新版本

``````js
// upload attachment

// base64解码，获取模块文件二进制数据。从libnpmpublish模块了解到tardata.toString('base64')，即npm模块文件流转base64字符串
var tarballBuffer = Buffer.from(attachment.data, 'base64');
// 默认使用fs-cnpm，将npm模块文件保存到本地，默认保存路径：path.join(process.env.HOME, '.cnpmjs.org', 'nfs')
var uploadResult = yield nfs.uploadBuffer(tarballBuffer, options);

var versionPackage = pkg.versions[version];
    var dist = {
    shasum: shasum,
    size: attachment.length
    };
    
    // if nfs upload return a key, record it
        if (uploadResult.url) {
        dist.tarball = uploadResult.url;
            } else if (uploadResult.key) {
            dist.key = uploadResult.key;
            dist.tarball = uploadResult.key;
        }
            var mod = {
            name: name,
            version: version,
            author: username,
            package: versionPackage
            };
            
            mod.package.dist = dist;
            
            // 模块数据保存到数据库
            var addResult = yield packageService.saveModule(mod);
```

即只要我们能够拿到 npm 模块的元数据（即 package.json 被处理过的 json 数据），就能把模块文件上传到文件系统或者 OSS 服务，同时数据落库。**Verdaccio** 有两个 api 可以拿到其私库 npm 模块全量数据和当前 npm 模块的 json 数据，路径分别是`/-/verdaccio/packages`，`/-/verdaccio/sidebar/$PKG$`，其中有 scope 的模块的请求路径是`/-/verdaccio/sidebar/$SCOPE$/$PKG$`。

思路已经很明确了，开始动起来吧！新增 save\_zcy.js 文件，基于原来的`/controllers/registry/package/save.js`稍加改造下。

核心代码：

```js
// 请求远程文件，并返回二进制流
    const handleFiles = function (url) {
        return new Promise((resolve, reject) => {
            try {
                http.get(url, res => {
                res.setEncoding('binary') // 二进制
                let files = ''
                res.on('data', chunk => { // 加载到内存
                files += chunk
                }).on('end', () => { // 加载完
                resolve(files)
                })
                })
                    } catch (error) {
                    reject(error)
                }
                })
                };
                
                // 获取远程模块文件的二进制数据
                    yield handleFiles(dist.tarball).then(res => {
                    // 利用 Buffer 转为对象
                    const tardata = Buffer.from(res, 'binary')
                    pkg._attachments = {};
                        pkg._attachments[filename] = {
                        'content_type': 'application/octet-stream',
                        'data': tardata.toString('base64'), // 从缓冲区读取数据，使用base64编码并转换成字符串
                        'length': tardata.length,
                        };
                            }, error => {
                            this.status = 400;
                                this.body = {
                                error,
                                reason: error,
                                };
                                return;
                                });
```

接下来我们把控制器 save\_zcy.js 接入到 registry 服务的 app 路由上。

```js
// 新增 fetchPackageZcy、savePackageZcy 控制器
app.get('/:name/:version', syncByInstall, fetchPackageZcy, savePackageZcy, getOneVersion);
app.get('/:name', syncByInstall, fetchPackageZcy, savePackageZcy, listAllVersions);
```

控制器 fetchPackageZcy 作用是请求上面的 api（/-/verdaccio/sidebar/SCOPESCOPESCOPE/PKGPKGPKG 或 /-/verdaccio/sidebar/PKGPKGPKG）来拉取对应模块的 json 数据。

![213BFDE6-B389-4376-A959-DC9E2F71FDF7.png](/images/jueJin/4ee40a7766ac407.png)

Ok，接下来我们写一个定时任务，每隔一段时间执行 `npm install [name]`，这样原来私库的 npm 包都能够 install 并进入到上面的控制器逻辑，大功告成！

OSS 容灾备份
--------

首先，简单说明下为什么要做 **OSS 容灾备份**，有以下几点。

*   如果服务器上磁盘损坏，易丢失文件，有一定的风险
*   若服务器磁盘爆满，可自动降级上传模块文件到 **OSS**

基于以上几点，我们整理了下容灾备份方案：

*   **package publish**

![](/images/jueJin/06b600e8297a434.png)

即发布模块文件时本地存储，同时上传到 **oss** 作为备份，用到的插件分别是 **fs-cnpm**、**oss-cnpm**。

*   **package install**

![](/images/jueJin/df3ff3801cf7475.png)

即下载模块文件时，先判断是否是私包（即是包名否有带 **scope**），如果不是私包代理到上游 **registry**，若是私包先判断服务器本地是否有该私包文件，如果不存在先去 **oss** 下载到本地 **nfs** 目录下，如果存在则直接从 **nfs** 目录找到模块文件，然后读取并写到 **downloads** 目录下，最后调用 **fs.createReadStream** 方法流读取该文件。

**isEnsureFileExists** 即判断模块文件本地是否存在，代码如下：

```js
const mkdirp = require('mkdirp');
const fs = require('fs');

    function ensureFileExists(filepath) {
        return function (callback) {
        fs.access(filepath, fs.constants.F_OK, callback);
        };
    }
```

注意，在 oss 下载模块文件到 nfs 之前，一定要先创建模块文件目录，方法如下：

```js
const mkdirp = require('mkdirp');

    function ensureDirExists(filepath) {
        return function (callback) {
        mkdirp(path.dirname(filepath), callback);
        };
    }
```

邮件通知
----

**Cnpmjs.org** 本来就带有邮件通知的功能，但只应用错误日志上报。由于我们的私包大部分都是业务组件、工具等，有时候发布正式版本的业务组件需要通知到业务组件的使用方。目前，我们采用 **maintainers** 来维护，包含模块的维护者及使用者。

示例：

```json
    "maintainers": [
        {
        "name": "yuanzhian",
        "email": "yuanzhian@cai-inc.com"
    }
]
```

邮箱配置如下：

```js
    mail: {
    enable: true,
    appname: 'cnpmjs.org',
    from: process.env.EMAIL_HOST,
    host: 'smtp.mxhichina.com',
    service: 'qiye.aliyun', // 使用了内置传输发送邮件,查看支持列表：https://nodemailer.com/smtp/well-known/
    port: 465, // SMTP 端口
    secureConnection: true, // 使用了 SSL
        auth: {
        user: process.env.EMAIL_HOST,
        pass: process.env.EMAIL_PSD, //
    }
}
```

写在文末
----

未来，我们还可以在 **Cnpmjs.org** 上做很多定制化开发，比如接入公司内部权限系统、web 页面重构、对接业务组件在线文档等等。如果你正好也需要搭建 npm 私有库，希望这篇文章对你有所帮助。

推荐阅读
----

[分分钟教会你搭建企业级的 npm 私有仓库](https://juejin.im/editor/posts/5eef64de518825658c1ad1f6 "https://juejin.im/editor/posts/5eef64de518825658c1ad1f6")

[编写高质量可维护的代码：组件的抽象与粒度](https://juejin.cn/post/6901210381574733832 "https://juejin.cn/post/6901210381574733832")

招贤纳士
----

政采云前端团队（ZooTeam），一个年轻富有激情和创造力的前端团队，隶属于政采云产品研发部，Base 在风景如画的杭州。团队现有 40 余个前端小伙伴，平均年龄 27 岁，近 3 成是全栈工程师，妥妥的青年风暴团。成员构成既有来自于阿里、网易的“老”兵，也有浙大、中科大、杭电等校的应届新人。团队在日常的业务对接之外，还在物料体系、工程平台、搭建平台、性能体验、云端应用、数据分析及可视化等方向进行技术探索和实战，推动并落地了一系列的内部技术产品，持续探索前端技术体系的新边界。

如果你想改变一直被事折腾，希望开始能折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变既定的节奏，将会是“5 年工作时间 3 年工作经验”；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊… 如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的前端团队的成长历程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 `ZooTeam@cai-inc.com`

![](/images/jueJin/a3110d4d271e41d.png)