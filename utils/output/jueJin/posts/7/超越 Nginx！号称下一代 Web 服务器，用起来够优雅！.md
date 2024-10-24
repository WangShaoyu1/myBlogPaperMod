---
author: "MacroZheng"
title: "超越 Nginx！号称下一代 Web 服务器，用起来够优雅！"
date: 2022-04-12
description: "最近发现了一款全新的Web服务器，Star数超越Nginx，标星38K+Star。试用了一下，发现它使用起来比Nginx优雅多了，功能也很强大，推荐给大家！"
tags: ["后端","Java","Nginx中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读8分钟"
weight: 1
selfDefined:"likes:1500,comments:189,collects:2300,views:203871,"
---
> Nginx是一款非常流行的Web服务器，在Github上已有`16K+Star`，我们经常用它来做静态资源托管或反向代理。最近发现了一款全新的Web服务器`Caddy`，Star数超越Nginx，标星`38K+Star`。试用了一下`Caddy`，发现它使用起来比Nginx优雅多了，功能也很强大，推荐给大家！

SpringBoot实战电商项目mall（50k+star）地址：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

Caddy简介
-------

Caddy是一款功能强大，扩展性高的Web服务器，目前在Github上已有`38K+Star`。Caddy采用Go语言编写，可用于静态资源托管和反向代理。

![](/images/jueJin/22838fde048a4d7.png)

Caddy具有如下主要特性：

*   对比Nginx复杂的配置，其独创的`Caddyfile`配置非常简单；
*   可以通过其提供的`Admin API`实现动态修改配置；
*   默认支持自动化HTTPS配置，能自动申请HTTPS证书并进行配置；
*   能够扩展到数以万计的站点；
*   可以在任意地方执行，没有额外的依赖；
*   采用Go语言编写，内存安全更有保证。

安装
--

> 首先我们直接在CentOS 8上安装Caddy，使用DNF工具安装无疑是最简单的，Docker安装方式之后也会介绍。

*   使用如下命令通过DNF工具安装Caddy，安装成功后Caddy会被注册成系统服务；

```bash
dnf install 'dnf-command(copr)'
dnf copr enable @caddy/caddy
dnf install caddy
```

*   使用`systemctl status caddy`查看Caddy的状态，可以发现Caddy已被注册为系统服务，但是还没开启。

![](/images/jueJin/775f0dce685d4d1.png)

使用
--

> 下面我们体验下Caddy的基本使用，对于Web服务器来说都是常用的操作，你准能用的上！

### 基本使用

> 首先我们来个Caddy的入门使用，让Caddy运行在`2015`端口上并返回`Hello, world!`。

*   直接使用`caddy`命令将输出Caddy的常用命令，基本看介绍就知道如何使用了，标出来的是常用命令；

![](/images/jueJin/7c28921ef8f64ea.png)

*   使用`caddy start`命令可以让Caddy服务在后台运行；

![](/images/jueJin/e09153414f2a402.png)

*   Caddy默认使用JSON格式的配置文件，但由于JOSN格式配置书写比较麻烦，又提供了`Caddyfile`这种更加简洁的配置形式，使用如下命令能自动把`Caddyfile`转化为JSON配置；

```bash
caddy adapter
```

*   我们可以先创建一个名称为`Caddyfile`的文件，文件内容如下，然后使用`caddy adapter`将它转换为JSON配置，再使用`caddy reload`使配置生效，该配置将监听`2015`端口，并返回`Hello, world!`；

```arduino
:2015

respond "Hello, world!"
```

*   然后我们使用curl命令访问`localhost:2015`，将返回指定的信息；

![](/images/jueJin/fa84e360dde54de.png)

*   当然我们还可以使用Caddy提供的`Admin API`来查看配置信息，使用如下命令即可；

```bash
curl localhost:2019/config/
```

*   当前JSON配置如下，如果你直接使用JSON配置的话需要书写如下配置，使用`Caddyfile`确实方便很多！

```json
    {
        "apps": {
            "http": {
                "servers": {
                    "srv0": {
                    "listen": [":2015"],
                        "routes": [{
                            "handle": [{
                            "body": "Hello, world!",
                            "handler": "static_response"
                        }]
                    }]
                }
            }
        }
    }
}
```

### `Caddyfile`基本语法

*   下面案例将使用`Caddyfile`来进行配置，我们有必要了解下它的语法，`Caddyfile`的具体语法规则如下。

![](/images/jueJin/553713d0a8ae42c.png)

*   介绍下上图中的关键字，有助于理解。

关键字

解释

使用

Global options block

服务器全局配置

可用于配置是否启用HTTPS和Admin API等

Snippet

可以复用的配置片段

定义好后认可以通过`import`关键字引用

Site Block

单个网站配置

通过`file_server`可以配置静态代理，通过`reverse_proxy`可以配置动态代理

Matcher definition

匹配定义

默认情况下指令会产生全局影响，通过它可以指定影响范围

Comment

注释

使用`#`符号开头

Site address

网站地址

默认使用HTTPS，如需开启HTTP，需要指定`http://`开头

Directive

指令

指令赋予了Caddy强大的功能

### 反向代理

> 反向代理就是当请求访问你的代理服务器时，代理服务器会对你的请求进行转发，可以转发到静态的资源路径上去，也可以转发到动态的服务接口上去。下面我们以对域名进行代理为例，来讲讲如何进行静态代理和动态代理。

#### 静态代理

> 静态代理就是将请求代理到不同的静态资源路径上去，这里我们将对`docs.macrozheng.com`的请求代理到我的文档项目中，对`mall.macrozheng.com`的请求代理到mall的前端项目中。

*   首先我们修改下本机的host文件：

```
192.168.3.106 docs.macrozheng.com
192.168.3.106 mall.macrozheng.com
```

*   然后将我们的文档项目和mall前端项目上传到Caddy的html目录中去，并进行解压操作：

![](/images/jueJin/dbc0fc8b2eb2419.png)

*   修改`Caddyfile`文件，使用如下配置，修改完成后使用`caddy reload`命令刷新配置；

```javascript
    http://docs.macrozheng.com {
    root * /mydata/caddy/html/docs
    file_server browse
}

    http://mall.macrozheng.com {
    root * /mydata/caddy/html/mall
    file_server browse
}
```

*   如果你的`Caddyfile`文件格式不太合格的话，会出现如下警告，直接使用`caddy fmt --overwrite`格式化并重写配置即可解决；

![](/images/jueJin/07beee1f10b348d.png)

*   通过`docs.macrozheng.com`即可访问部署好的文档项目了：

![](/images/jueJin/bfcaba6179bc4a9.png)

*   通过`mall.macrozheng.com`即可访问到部署好的前端项目了。

![](/images/jueJin/ccd81bea17624b8.png)

#### 动态代理

> 动态代理就是把代理服务器的请求转发到另一个服务上去，这里我们将把对`api.macrozheng.com`的请求代理到演示环境的API服务上去。

*   首先我们修改下本机的host文件，添加如下规则：

```bash
192.168.3.106 api.macrozheng.com
```

*   修改`Caddyfile`文件，使用如下配置，修改完成后使用`caddy reload`命令刷新配置；

```arduino
    http://api.macrozheng.com {
    reverse_proxy http://admin-api.macrozheng.com
}
```

*   之后通过`api.macrozheng.com/swagger-ui.html`即可访问到`mall-admin`的API文档页面了。

![](/images/jueJin/78dc0351ec8b4af.png)

### 文件压缩

> 如果我们的服务器带宽比较低，网站访问速度会很慢，这时我们可以通过让Caddy开启Gzip压缩来提高网站的访问速度。这里我们以mall的前端项目为例来演示下它的提速效果。

*   我们需要修改`Caddyfile`文件，使用`encode`指令开启Gzip压缩，修改完成后使用`caddy reload`命令刷新配置；

```javascript
    http://mall.macrozheng.com {
    root * /mydata/caddy/html/mall
        encode {
        gzip
    }
    file_server browse
}
```

*   有个比较大的JS文件压缩前是`1.7M`；

![](/images/jueJin/2f65fe32a88d40b.png)

*   压缩后为`544K`，访问速度也有很大提示；

![](/images/jueJin/5c5781f981684a1.png)

*   另外我们可以看下响应信息，如果有`Content-Encoding: gzip`这个响应头表明Gzip压缩已经启用了。

![](/images/jueJin/1794dfca3ecf4d4.png)

### 地址重写

> 有的时候我们的网站更换了域名，但还有用户在使用老的域名访问，这时可以通过Caddy的地址重写功能来让用户跳转到新的域名进行访问。

*   我们需要修改`Caddyfile`文件，使用`redir`指令重写地址，修改完成后使用`caddy reload`命令刷新配置；

```arduino
    http://docs.macrozheng.com {
    redir http://www.macrozheng.com
}
```

*   此时访问旧域名`docs.macrozheng.com`会直接跳转到`www.macrozheng.com`去。

### 按目录划分

> 有时候我们需要使用同一个域名来访问不同的前端项目，这时候就需要通过子目录来区分前端项目了。

*   比如说我们需要按以下路径来访问各个前端项目；

```bash
www.macrozheng.com #访问文档项目
www.macrozheng.com/admin #访问后台项目
www.macrozheng.com/app #访问移动端项目
```

*   我们需要修改`Caddyfile`文件，使用`route`指令定义路由，修改完成后使用`caddy reload`命令刷新配置。

```bash
    http://www.macrozheng.com {
        route /admin/* {
        uri strip_prefix /admin
            file_server {
            root /mydata/caddy/html/admin
        }
    }
        route /app/* {
        uri strip_prefix /app
            file_server {
            root /mydata/caddy/html/app
        }
    }
        file_server * {
        root /mydata/caddy/html/www
    }
}
```

### HTTPS

> Caddy能自动支持HTTPS，无需手动配置证书，这就是之前我们在配置域名时需要使用`http://`开头的原因，要想使用Caddy默认的HTTPS功能，按如下步骤操作即可。

*   首先我们需要修改域名的DNS解析，直接在购买域名的网站上设置即可，这里以`docs.macrozheng.com`域名为例；
    
*   之后使用如下命令验证DNS解析记录是否正确，注意配置的服务器的`80`和`443`端口需要在外网能正常访问；
    

```bash
curl "https://cloudflare-dns.com/dns-query?name=docs.macrozheng.com&type=A" \
-H "accept: application/dns-json"
```

*   修改`Caddyfile`配置文件，进行如下配置；

```javascript
    docs.macrozheng.com {
    root * /mydata/caddy/html/docs
    file_server browse
}
```

*   然后使用`caddy run`命令启动Caddy服务器即可，是不是非常方便！

```bash
caddy run
```

### Docker支持

> 当然Caddy也是支持使用Docker进行安装使用的，其使用和直接在CentOS上安装基本一致。

*   首先使用如下命令下载Caddy的Docker镜像；

```bash
docker pull caddy
```

*   然后在`/mydata/caddy/`目录下创建`Caddyfile`配置文件，文件内容如下；

```arduino
http://192.168.3.105:80

respond "Hello, world!"
```

*   之后使用如下命令启动caddy服务，这里将宿主机上的`Caddyfile`配置文件、Caddy的数据目录和网站目录挂载到了容器中；

```bash
docker run -p 80:80 -p 443:443 --name caddy \
-v /mydata/caddy/Caddyfile:/etc/caddy/Caddyfile \
-v /mydata/caddy/data:/data \
-v /mydata/caddy/html:/usr/share/caddy \
-d caddy
```

*   之后使用`docker exec`进入caddy容器内部执行命令；

```bash
docker exec -it caddy /bin/sh
```

*   输入Caddy命令即可操作，之后的操作就和我们直接在CentOS上安装一样了。

![](/images/jueJin/5a2a161c0e3e4cc.png)

总结
--

今天体验了一把Caddy，其强大的指令功能，让我们无需多余的配置即可实现各种功能，使用起来确实非常优雅！尤其是其能自动配置实现HTTPS，非常不错！Nginx能实现的功能Caddy基本都能实现，大家可以对比下之前写的[Nginx使用教程](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2F9VZi2suAlomu1IRGy-qdCA "https://mp.weixin.qq.com/s/9VZi2suAlomu1IRGy-qdCA") ，你就会发现使用Caddy来实现有多么优雅！

如果你想了解更多SpringBoot实战技巧的话，可以试试这个带全套教程的实战项目（50K+Star）：[github.com/macrozheng/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fmall "https://github.com/macrozheng/mall")

参考资料
----

*   项目地址：[github.com/caddyserver…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcaddyserver%2Fcaddy "https://github.com/caddyserver/caddy")
*   官方文档：[caddyserver.com/](https://link.juejin.cn?target=https%3A%2F%2Fcaddyserver.com%2F "https://caddyserver.com/")