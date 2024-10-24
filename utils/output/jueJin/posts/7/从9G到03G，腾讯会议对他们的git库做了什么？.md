---
author: "腾讯云开发者"
title: "从9G到03G，腾讯会议对他们的git库做了什么？"
date: 2023-07-31
description: "过去三年在线会议需求井喷，腾讯会议用户量骤增到3亿。快速迭代的背后，腾讯会议团队发现：业务保留了长达5年的历史数据，大量未进行 lfs 转换，新 clone 仓库本地空间占177G+。"
tags: ["Git中文技术社区","前端开发社区","前端技术交流","前端框架教程","JavaScript 学习资源","CSS 技巧与最佳实践","HTML5 最新动态","前端工程师职业发展","开源前端项目","前端技术趋势"]
ShowReadingTime: "阅读15分钟"
weight: 1
selfDefined:"likes:149,comments:30,collects:136,views:24635,"
---
![](/images/jueJin/967fdfc65f66409.png)

![动图封面](/images/jueJin/6c2cc535d690428.png)

导读

过去三年在线会议需求井喷，腾讯会议用户量骤增到3亿。快速迭代的背后，腾讯会议团队发现：业务保留了长达5年的历史数据，大量未进行 lfs 转换，新 clone 仓库本地空间占17.7G+。本地磁盘面临严重告急，强烈影响团队 clone 效率。当务之急是将仓库进行瘦身。本栏目特邀腾讯会议的智子研发团队成员李双君，回顾腾讯会议客户端的瘦身历程和经验，欢迎阅读。

目录

1 瘦身成效

2 瘦身前事项

3 瘦身整体方案

4 瘦身具体命令执行

5 新代码库验证

6 解决其它设备本地老分支 push 问题

7 其他平台适配

8 最后的验证

9 瘦身完毕后的知会

10 兜底回滚方案

11 踩坑记录及应对

12 写在最后

\*作者所在的腾讯会议智子研发团队是腾讯会议的终端团队，负责腾讯会议 Win、Mac、Linux、Android、iOS、小程序、Web 等全栈开发，致力于打造一流的端产品体验。

01、瘦身成效
-------

腾讯会议瘦身完毕后整体收益：

*   Git 仓库大小，9G 到350M。
    
*   新 clone 仓库占用空间，从17.7G 到12.2G。
    
*   平常拉代码速度(北京地区测试)：macbook m1 pro：提升45%；devcloud win：提升56%。
    
*   包构建流水线全量拉代码耗时，从16分钟减少到5分钟以内。
    

![](/images/jueJin/e6520fbb1be9421.png)

02、瘦身前事项
--------

### 2.1 环境准备

使用有线网，看看能否通过其他办法给机器的上传和下载速度提速？不建议在家中开代理来瘦身，因为家里网速一般都没有公司快；如果在家操作，提前配置好远程桌面，远程公司电脑来瘦身。

使用性能较好的机器，硬盘空间至少要有 xxxG 剩余 (可以提前演练，看看究竟要多大磁盘空间？会议最起码得要求有600G 空余）。会议本次瘦身使用的设备是 MAC Book M1 Pro（16寸）笔记本电脑。

### 2.2 周知

工作开发群或者邮件等通知瘦身时间和注意事项:

**瘦身时间：** 选一个大家基本上都不会提交代码的时间，比如十一国庆或者春节；会议选的是春节期间。

**注意事项：** (开发重点关注)

瘦身期间会锁库，必须提前推送代码到远端，否则需要手动同步； 锁库期间无法进行 MR，且已创建 MR 会失效； 因删除历史记录，会导致本地仓库与远端冲突，请恢复后重新 clone 代码； 需要查询或处理更老的代码，需要去备份仓库查看。

### 2.3 代码库锁定

禁止代码库写操作，一般公司的代码管理平台可以提供这个功能，Git 项目的 owner 有权限。

### 2.4 第三方 Git 平台禁用

如果 Git 项目被第三方 Git 平台使用了，要保证瘦身前仓库的同步任务禁用。

比如，会议使用了 Ugit（UGit 是腾讯内部的一款自研 Git 客户端，主要是为腾讯内部研发环境特点而定制），就要如下禁用项目同步：

![](/images/jueJin/276c3fff2fbf4c0.png)

03、瘦身整体方案
---------

原仓库继续保留作为备份仓库，另外新建仓库，新仓库沿用原仓库的项目名称、版本库路径和 id，并同步原项目数据。

之所以这么做，是为了保证其他平台无缝对接新的 Git 仓库，不用再更换 Git 地址，另外有些通过 api 调用的系统和工具也不受到影响。

**瘦身内容：**

*   历史记录删除，只保留最近半年的历史记录。
    
*   将历史大文件以及未加入 lfs 的大文件进行 lfs 处理。
    

04、瘦身具体命令执行
-----------

### 4.1 clone 项目，拉取所有文件版本到本地

git clone [example.com/test.git](https://link.juejin.cn?target=https%3A%2F%2Fexample.com%2Ftest.git "https://example.com/test.git")

为了后面的比对验证，可以拷贝一份 test 文件夹放到和 test 同级目录下面的新建的 copyForCompare 文件夹中。

```bash
ulimit -n 9999999 # 解决可能出现的报错too many open files的问题
ulimit -n # 查看改成9999999了没
```

遍历拉取所有分支的 lfs 最新文件，并追踪远端分支到本地
=============================

以下这段 shell 脚本可以直接拷贝到终端运行，也可以创建一个.sh 文件放到根目录执行
=============================================

```bash
cur_index=1
j=1
git branch -r | grep -v '->' |
while read remote
do
echo ”deal $cur_index th branch“
cur_index=$[cur_index+1]
git branch --track "${remote#origin/}" "$remote"
echo "begin to lfs fetch branch $remote"
git lfs fetch origin $remote
if [ $? -eq 0 ]; then
echo "fetch branch $remote success"
else
echo "fetch branch $remote failed"
lfs_fetch_fail_array[$j]=$remote
j=$[j+1]
fi
done
if [ ${#lfs_fetch_fail_array[*]} -gt 0 ]; then
echo "git lfs fetch error branches are: ${lfs_fetch_fail_array[*]}"
else
echo "fetch all branches success. done."
fi
```

获取所有分支的文件和 lfs 文件版本
===================

```sql
git fetch --all
git lfs fetch --all
```

4.2 使用 git filter-branch 截断历史记录

这次瘦身只保留最近半年的历史记录，2022.6.1之前的提交记录都删除，所以截断的 commit 节点按如下所述来找：

提前用 sourceTree（或者别的 Git 界面工具）找出来需要截断的那个 commit，以主干 master 为例，找到 master 分支上提交的并且只有一个父的提交节点（如果提交节点有多个父，那么所有父节点都要处理），该节点必须是所有分支的父节点，否则需要考虑其他分支特殊处理的情况，该情况后面的【特殊分支处理】会有说明。

![](/images/jueJin/636d65588d0d434.png)

可以看到选中的截断 commit id 是 ff75cc5cdbf0423a24b4f5438e52683210813ba0

*   **根据上面的 commit id，带入下面的命令，找出其父**

git cat-file -p ff75cc5cdbf0423a24b4f5438e52683210813ba0

![](/images/jueJin/46c96f15df32404.png)

可以看到只有一个父，其父是7ffe6782272879056ca9618f1d85a5f9716f8e90 ，所以该提交 id 就是要置为空的。如果有多个父都需要处理。

*   **执行命令**

注意：对于普通提交节点，下面命令的 parent 值是"-p parentId"；对于合并提交节点，下面命令的 parent 值是"-p parentId1 -p parentId2 -p parentId3 ..."

```css
git filter-branch --force --parent-filter '
read parent
if [ "$parent" = "-p 7ffe6782272879056ca9618f1d85a5f9716f8e90" ]
then
echo
else
echo "$parent"
fi' --tag-name-filter cat -- --all
```

*   **重点验证：上述命令执行完毕后，一定要用如下命令检查是否修改成功**

注意：因为执行完了命令已经修改了历史记录，此时 Git log 命令执行会慢点，大概5分钟可以出结果，另外可以用这个在线时间戳转换工具来转换时间戳。

工具链接：[www.beijing-time.org/shijianchuo…](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fwww.beijing-time.org%2Fshijianchuo%2F "https://link.zhihu.com/?target=https%3A//www.beijing-time.org/shijianchuo/")

如果执行成功会把之前的文件版本取最新的 add 到这个截断的提交节点里面，如下图：

```scss
git log --all-match --author="xxxx" --grep="auto update .code.yml by robot" --name-status --before="1654043400" --after="1654012800" --all
```

![](/images/jueJin/8b27eb4ed0ac4b8.png)

### 4.3 使用 git-filter-repo 清理截断日期前的所有历史记录，并将截断节点的提交信息修改

注意此步骤要谨慎处理，因为这步会真正地删除提交记录。

提前安装好 git-filter-repo，执行下面的 python 代码。

```ini
import os
try:
import git_filter_repo as fr
except ImportError:
raise SystemExit("Error: Couldn't find git_filter_repo.py. Did you forget to make a symlink to git-filter-repo named git_filter_repo.py or did you forget to put the latter in your PYTHONPATH?")

k_work_dir = "/Volumes/SolidCompany/S_Shoushen/test"
# 2022.6.1 00:00:00
k_clean_history_deadline = b"1654012800"
# 2022.6.1 07:05:07
k_clean_deadline_commit_date = b"1654038307"
k_clean_deadline_commit_author_name = b"xxxxx"
k_new_root_commit_message = "仓库瘦身历史记录裁剪，截断提交记录后新根结点新增历史文件；如果想查看更多历史记录，请去备份仓库：https://example.com/test_backup.git"

def commitCallBackFun(commit, metadata):
[time_stamp, timezone] = commit.committer_date.split()
if time_stamp == k_clean_deadline_commit_date and commit.author_name == k_clean_deadline_commit_author_name:
commit.message = k_new_root_commit_message.encode("utf-8")
if time_stamp >= k_clean_history_deadline:
return
commit.file_changes = []

def main():
os.chdir(k_work_dir)
print("git work dir is", os.getcwd())
args = fr.FilteringOptions.parse_args(['--force', '--debug'])
filter = fr.RepoFilter(args, commit_callback = commitCallBackFun)
filter.run()

if __name__ == '__main__':
main()
```

验证下截断提交结点的提交信息更改成功了没？

```css
git log --all-match --author="xxx" --grep="仓库瘦身历史记录裁剪" --name-status --before="1654043400" --after="1654012800"
```

如下就对了：

![](/images/jueJin/be8dc435404a41c.png)

以上执行完后做个简单验证：

用 BeyondCompare 工具跟刚开始备份的 copyForCompare 目录下的 test 仓库对比，看看有没有增删改文件，期望应该没有任何变化才对。

*   **特殊分支处理**

说明：以上历史记录裁剪并删除历史提交记录执行完后，对于基于截断**提交节点前**的提交节点创建出来的分支或者其子分支会出现文件被删除或者整个分支被删除的情况。

![](/images/jueJin/599baa976fee4e4.png)

**所以要提前弄清楚有没有在截断节点之前早就创建出来一直在用的分支，** 如果有就得特殊处理上面的2和3步骤了：

**第2步**中截断历史记录的时候，要类似分析 master 分支那样分析其它需要保留的特殊分支，找出各自的截断节点的父提交 id；然后执行的 shell 脚本里面条件判断改成判断所有的父提交 id；类似这样：

```css
git filter-branch --force --parent-filter '
read parent
if [ "$parent" = "-p 85f5ee6314f4f46cc47eb02c6af93bd3020a1053 -p cd207e9b3372f68a6d1ffe06fcf189d952e3bf9f" ] || [ "$parent" = "-p 7ffe6782272879056ca9618f1d85a5f9716f8e90" ]
then
echo
else
echo "$parent"
fi' --tag-name-filter cat -- --all
```

**第3步**中删除截断节点前提交记录的 python 脚本里面，按照分支名字和自己分支的截断日期来做比对逻辑进行删除提交记录的操作。类似如下：

```ini
#!/usr/bin/env python3
import os
try:
import git_filter_repo as fr
except ImportError:
raise SystemExit("Error: Couldn't find git_filter_repo.py. Did you forget to make a symlink to git-filter-repo named git_filter_repo.py or did you forget to put the latter in your PYTHONPATH?")

k_work_dir = "/Users/jevon/Disk/work/appShoushen/shoushen/test"

# 2022.6.1 07:05:07
k_master_cut_date = b"1654038307"

# 2022.3.25 19:32:00
k_private_new_saas_sdk_master_cut_date = b"1648207920"

k_new_root_commit_message = "仓库瘦身历史记录裁剪，截断提交记录后新根结点新增历史文件；如果想查看更多历史记录，请去备份仓库：https://example.com/test_backup.git"

def commitCallBackFun(commit, metadata):
[time_stamp, timezone] = commit.committer_date.split()
# 每个特殊分支的截断提交点的提交信息修改
if (time_stamp == k_master_cut_date and commit.author_name == b"xxx_author1") or \
(time_stamp == k_private_new_saas_sdk_master_cut_date and commit.author_name == b"xxx_author2"):
commit.message = k_new_root_commit_message.encode("utf-8")

# 每个特殊分支的截断提交点前的提交记录,需要根据各自截止日期来做比对删除日期前的历史记录
strBranch = commit.branch.decode("utf-8")
if strBranch.endswith("refs/heads/master"):
if time_stamp < k_master_cut_date:
commit.file_changes = []
elif strBranch.endswith("refs/heads/private/feature/3.12.1/new-saas-sdk-master"):
if time_stamp < k_private_new_saas_sdk_master_cut_date:
commit.file_changes = []
def main():
os.chdir(k_work_dir)
print("git work dir is", os.getcwd())
args = fr.FilteringOptions.parse_args(['--force', '--debug'])
filter = fr.RepoFilter(args, commit_callback = commitCallBackFun)
filter.run()

if __name__ == '__main__':
main()
```

以上\[特殊分支处理\]没有实验过，但是个解决思路，具体实践结果待补充，也欢迎实验过的同学交流。

### 4.4 进行 lfs 转换

```bash
rm -Rf .git/refs/original
rm -Rf .git/logs
git branch | wc -l # 看一下本地分支总数
# 拷贝原来的仓库到新目录下面
git clone file:///Users/jevon/Disk/work/appShoushen/shoushen/test  /Users/jevon/Disk/work/appShoushen/shoushen/test_new
cd test_new
git branch -r | grep -v '->' |
while read remote
do
git branch --track "${remote#origin/}" "$remote"
done
git fetch --all git branch | wc -l # 看一下本地分支总数，和拷贝之前是否一样
# 分析仓库中占用空间较大的文件类型（演练的时候可以提前分析出来，节省瘦身时间）
git lfs migrate info --top=100 --everything
```

命令结果如下，是按照文件所有的历史版本累加统计的，只有未加入 lfs 的才会统计。

![](/images/jueJin/124e116784b7435.png)

```css
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | sed -n 's/^blob //p' | sort --numeric-sort --key=2 | cut -c 1-12,41- | $(command -v gnumfmt || echo numfmt) --field=2 --to=iec-i --suffix=B --padding=7 --round=nearest | grep MiB
```

该命令执行结果如下，是把所有大于 1Mb 的文件版本都列出来了，不进行累加，从小到大排序，已经加入 lfs 的不会统计。

![](/images/jueJin/a8741082850c423.png)

```ini
# lfs转换
# --include=之后填入根据实际分析的大文件列表
git lfs migrate import --everything --include="*.jar,tool/ATG/index.js,xxx"
# 上面lfs转换执行完后，看一下根目录的.gitattribute文件里面是不是加入了新的lfs文件了
```

4.5 新建新仓库，推送所有历史记录修改

新创建目标仓库 test\_backup.git ，然后运行下面代码：

```csharp
git remote remove origin
git remote add origin https://example.com/test_backup.git
git remote set-url origin https://example.com/test_backup.git
git remote -v # 确保设置成功新仓库地址
```

此时可以用下面的命令看看还有没有大文件了（可选）。

```css
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | sed -n 's/^blob //p' | sort --numeric-sort --key=2 | cut -c 1-12,41- | $(command -v gnumfmt || echo numfmt) --field=2 --to=iec-i --suffix=B --padding=7 --round=nearest | grep MiB
```

用以下命令看看还有没有未转换的大的 lfs 文件了（可选）。

```css
git lfs migrate info --top=100 --everything
# 推送历史记录修改到目标新仓库：
git push origin --no-verify --all
git push origin --no-verify --tags
```

### 4.6 回到原来的 test 目录，推送 lfs 文件

```bash
cd ../test
git config lfs. https://example.com/test_backup.git /info/lfs.access basic
git lfs env # 看一下改成了basic了吗
# 设置成远端目标仓库test_backup.git
git remote remove origin
git remote add origin https://example.com/test_backup.git
git remote set-url origin https://example.com/test_backup.git
git remote -v # 确保设置成功新仓库地址
```

![](/images/jueJin/b6d27a4c682341f.png)

将 upload\_objects.sh 拷贝到 test 目录，然后执行 sh ./upload\_objects.sh

upload\_objects.sh 内容如下：

```bash
#!/bin/bash

set -e

count=$(find .git/lfs/objects -type f | wc -l)
echo "-- total objects count is $count"

index=0
concurrency=25

find .git/lfs/objects -type f | awk -F '/' '{print $NF}' | while read -r obj; do
echo "-- $(date) -- uploading ($index/$count) $obj"
git lfs push origin --object-id "$obj" &
index=$((index+1))
if [[ $index%$concurrency -eq 0 ]]; then
echo -e "\r\n-- $(date) -- waiting --------------------------\r\n"
wait
fi
done
```

注意脚本里面的并发值不能设置太高，不然会报错./upload\_objects.sh: line 12: echo: write error: Interrupted system call，测试发现设置25是比较合适的。

![](/images/jueJin/db865619c93b4b8.png)

确保像上图这样，最后一个也上传成功。

05、新代码库验证
---------

```bash
git clone https://example.com/test_backup.git
```

使用 git lfs pull 先拉取主干分支所有的历史文件进行测试，**保留瘦身的本地仓库；**  后续如果发现有其他分支的 lfs 文件没有上传成功，再单独上传即可。

上传命令:

```kotlin
git lfs push --object-id origin "$objId"
```

对比新旧代码库主干最新代码是否一致，可使用 beyond compare 工具进行验证。四端编译不同代表性的分支运行验证。

06、解决其它设备本地老分支 push 问题
----------------------

在公司的代码管理平台上设置瘦身后的 test\_backup 仓库单文件大小上限为1.5M。

一般公司自己的代码管理平台都会提供设置单个 git 文件上传大小上限的功能，得管理员才有权限设置；腾讯的代码管理平台是像下图这样设置的：

![](/images/jueJin/f0fbf8c60b29445.png)

解释：之后的步骤将会把新老仓库互换，新旧仓库互换后，其它机器本地的老仓库分支还是有 push 上去的风险，这样就会把瘦身前的历史记录又推送到瘦身后的 Git 仓库，造成瘦身白费。

07、其他平台适配
---------

### 7.1 代码管理平台

找代码管理平台协助完成下面的操作：（需要提前预约沟通好）

会议用的代码管理平台是工蜂：

项目名称、版本库路径互换：test\_backup 重命名为 test，test 重命名为 test\_backup。 将两个项目项目 id 进行调换：新项目沿用旧项目的项目 id，以此保证通过 api 调用的系统和工具不受到影响。 项目数据同步：同步项目成员和权限相关的数据、保护分支规则组到新仓库。

自己工蜂适配（可以提前进行）。对照老工蜂的所有配置，在新工蜂上手动同步修改。

### 7.2 第三方 Git 工具

如果使用了第三方 Git 工具平台做过瘦身仓库与其他项目仓库的同步，需要处理下（会议使用了 UGit 第三方工具）：

通知 UGit 相关负责人把旧的工作区移除一下，重新 clone test 仓库。 把 Ugit 里面 test 仓库的同步任务恢复（如有需要）。

### 7.3 出包流水线构建平台

因为执行完瘦身后，Git 的 commit id 都变了，历史记录也变了，而 coding 的构建机如果不清理缓存删掉老仓库的话，会导致构建机本地仓库历史与远端冲突，执行 Git 命令会异常，所以 coding 必须要清理掉老仓库，重新 clone。

08、最后的验证
--------

代码管理平台以及出包构建平台都处理完成后，进行最后的验证。

本地验证：

本地是否能正常 clone 代码。 本地对比新旧仓库主干最新代码是否一致。 本地随机抽取分支对比新旧仓库文件个数以及最新代码是否一致。 本地编译验证，程序启动主流程验证。

出包构建平台验证：

主干分支、发布分支、个人需求分支、个人分支等的构建验证。

代码管理平台验证：

代码库基础、高级配置是否正确 保护分支规则配置是否正确，是否有效 项目成员是否和原仓库一致 MR 是否可正常发起、合并，能否正常调起检测流水线

代码库写权限恢复：

保证瘦身后的 Git 仓库恢复写权限；备份仓库禁用写权限。

09、瘦身完毕后的知会
-----------

知会参考模板：

xxx 仓库瘦身完成了！接下来需要开发重点关注：本地旧仓库已经失效，必须删掉重新 clone 代码【最最重要】未提前push到远端的本地新增代码需要手动同步旧的未完成的MR已经失效，需要关闭后重新发起需要查询或处理更老的代码，需要去备份仓库查看（xxxx/xxxx.git）开发过程中有任何疑问，欢迎请随时联系 xxx

10、兜底回滚方案
---------

因为使用了备份仓库，所以不会修改原始仓库，但只有代码管理平台(工蜂)在第七步的时候修改了原始仓库，对于这个工蜂的协助修改，需要提前确认好工蜂那边做好了回滚的方案。

11、踩坑记录及应对
----------

### 11.1 上传 lfs 的时候报错 User is null or anonymous user

![](/images/jueJin/14799c8f2c7c4e4.png)

LFS: Git:User is null or anonymous user.

解决：git config lfs.[example.com/test\_backup…](https://link.juejin.cn?target=https%3A%2F%2Fexample.com%2Ftest_backup.git%2Finfo%2Flfs.access "https://example.com/test_backup.git/info/lfs.access") basic

输入 git lfs env 看一下输出结果改成了 basic 了吗？

![](/images/jueJin/a48d8e515071420.png)

### 11.2 git push 的时候报错

![](/images/jueJin/3b6deeeebf274d8.png)

把远程链接改成 https 的：

```arduino
git remote set-url origin https://example.com/test_backup.git
git remote -v
```

如果~/.gitconfig 中有如下的内容要先注释掉。

```scss
url.git@example.com:.insteadof=http://example.com/ url.git@example.com:.insteadof=https://example.com/
```

最后再 push 即可。

如果上述还不行，那么在命令行中执行：

```arduino
git config --global https.postbuffer 1572864000git config --global https.lowSpeedLimit 0git config --global https.lowSpeedTime 999999
```

如仍然无法解决，可能是用户的客户端默认有设默认值限制 git 传输包的大小，可执行指令：

```lua
git config --global core.packedGitLimit 2048m
git config --global core.packedGitWindowSize 2048m
```

### 11.3 window 如何在 git batch 里面运行 git-filter-repo？

安装 python：打开 cmd 窗口，运行 python -m pip install git-filter-repo，安装 git-filter-repo；

用 everything 查找 git-filter-repo.exe；

cmd 窗口，运行 git --exec-path，得到路径类似：C:\\Program Files\\Git\\mingw64\\libexec\\git-core；

把上面找到的 git-filter-repo.exe 拷贝到 git-core 文件夹里面；

此时在 git batch 窗口中，输入命令 git filter-repo(注意输入的git后面没有-)，会提示 No arguments specified.证明 ok 了。

### 11.4 如果想让 git-filter-repo 作为一个 python 库来使用，实现更复杂的功能该怎么办？

比如，不想这么用了 git-filter-repo --force --commit-callback "xxxx python code..."，因为这么用只能写回调的 python 代码，太弱了。

解决：python3 -m pip install --user git-filter-repo，不行就 python3 -m pip install git-filter-repo，安装这个 git-filter-repo包，然后就可以在 python 代码中作为库使用：import git\_filter\_repo as fr。

### 11.5 瘦身后发现 coding 的 win 构建机器在 clone 代码时出问题，怎么办？

卡在 git lfs pull：

![](/images/jueJin/5a8d51bc83454b8.png)

卡在 git checkout --force xxxxx 提交 id：

![](/images/jueJin/4245b13703fb4a1.png)

卡在 checking out files：

![](/images/jueJin/6298092bcfb1408.png)

调查发现，是 lfs 进程卡住，不知道什么样的场景触发的，官方有个类似 issue，以上问题均是因为 git 或者 git lfs 版本过低导致的，升级到高版本即可解决。

据当时出错 case 总结得出结论，以下 git 和 git lfs 的版本号可以保证稳定运行不出问题，如果版本号低于以下所示，最好升级。

![](/images/jueJin/5cc22a602904418.png)

### 11.6 执行 git lfs fetch 的时候报错 too many open files 的问题

解决办法：ulimit -n 9999999

12、写在最后
-------

仓库瘦身是个细致耗时的工作，需要谨慎认真地完成。最后腾讯会议客户端仓库的大小也从 9G 瘦身到 350M ，实现的效果还是不错的。

本次我们分享了仓库瘦身的全历程，把执行命令也公示给各位读者。希望可以帮助到为类似困境而头疼的开发者们。这篇文章对您有帮助的话，欢迎转发分享。

\-End-

原创作者｜李双君

技术责编｜陈从贵、郭浩伟

![](/images/jueJin/d2697dd057154b5.png)

欢迎在[腾讯云开发者公众号](https://link.juejin.cn?target=https%3A%2F%2Fcloud.tencent.com%2Fdeveloper%2Ftools%2Fexternal-entry%3Fchannel%3Dzhihu%26id%3D35 "https://cloud.tencent.com/developer/tools/external-entry?channel=zhihu&id=35")分享你使用Git库的小技巧，我们将选取1则最有意义的评论，送出腾讯云开发者-透明手袋1个（见下图）。8月2日中午12点开奖。

![](/images/jueJin/b0e7adad5c254c9.png)