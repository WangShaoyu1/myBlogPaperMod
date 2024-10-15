---
author: "王宇"
title: "linux相关命令"
date: 三月18,2024
description: "陆元伟"
tags: ["陆元伟"]
ShowReadingTime: "12s"
weight: 260
---
  

**file** xxx.so查看so库文件信息

参数

*   \-b 　列出辨识结果时，不显示文件名称。
*   \-c 　详细显示指令执行过程，便于排错或分析程序执行的情形。
*   \-f<名称文件> 　指定名称文件，其内容有一个或多个文件名称时，让file依序辨识这些文件，格式为每列一个文件名称。
*   \-L 　直接显示符号连接所指向的文件的类别。
*   \-m<魔法数字文件> 　指定魔法数字文件。
*   \-v 　显示版本信息。
*   \-z 　尝试去解读压缩文件的内容。

**readelf -h xxx.so查看so库文件头信息**

`readelf` 用来显示一个或者多个 `elf` 格式的目标文件的信息，可以通过它的选项来控制显示哪些信息

这个程序和 `objdump` 提供的功能类似，但是它显示的信息更为具体

*   `-a` , `--all` 显示全部信息,等价于 `-h -l -S -s -r -d -V -A -I` 。
*   `-h` , `--file-header` 显示 `elf` 文件开始的文件头信息.
*   `-l` , `--program-headers` , `--segments` 显示程序头（段头）信息(如果有的话)。
*   `-S` , `--section-headers` , `--sections` 显示节头信息(如果有的话)。
*   `-g` , `--section-groups` 显示节组信息(如果有的话)。
*   `-t` , `--section-details` 显示节的详细信息( `-S` 的)。
*   `-s` , `--syms` , `--symbols` 显示符号表段中的项（如果有的话）。
*   `-e` , `--headers` 显示全部头信息，等价于: `-h -l -S`
*   `-n` , `--notes` 显示 `note` 段（内核注释）的信息。
*   `-r` , `--relocs` 显示可重定位段的信息。
*   `-u` , `--unwind` 显示 `unwind` 段信息。当前只支持 `IA64 ELF` 的 `unwind` 段信息。
*   `-d` , `--dynamic` 显示动态段的信息。
*   `-V` , `--version-info` 显示版本段的信息。
*   `-A` , `--arch-specific` 显示 `CPU` 构架信息。
*   `-D` , `--use-dynamic` 使用动态段中的符号表显示符号，而不是使用符号段。
*   `-x` , `--hex-dump=` 以16进制方式显示指定段内内容。 `number` 指定段表中段的索引,或字符串指定文件中的段名。
*   `-w[liaprmfFsoR]` or –debug-dump\[=line,=info,=abbrev,=pubnames,=aranges,=macro,=frames,=frames-interp,=str,=loc,=Ranges\] 显示调试段中指定的内容。
*   `-I` , `--histogram` 显示符号的时候，显示 `bucket list` 长度的柱状图。
*   `-v` , `--version` 显示 `readelf` 的版本信息。
*   `-H` , `--help` 显示 `readelf` 所支持的命令行选项。
*   `-W` , `--wide` 宽行输出。

`@file` 可以将选项集中到一个文件中，然后使用这个 `@file` 选项载入。

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)