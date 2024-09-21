// fileUtils.js

import fs from 'fs/promises';
import path from 'path';
import {fileURLToPath} from 'url';
import {JSDOM} from 'jsdom'

// 获取当前模块文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 公共函数：将内容写入文件（如果文件不存在则自动创建）
export async function writeToFile(content, relativeFilePath) {
    try {
        // 基于模块的目录，将相对路径转换为绝对路径
        const absolutePath = path.resolve(__dirname, relativeFilePath.trim());
        // 获取文件的目录路径
        const directory = path.dirname(absolutePath);

        // 递归创建目录（如果目录不存在则会自动创建）
        await fs.mkdir(directory, {recursive: true});

        // 确保将内容追加到文件中，如果文件不存在则创建文件
        await fs.writeFile(absolutePath, content, 'utf8');
        console.log(`File written successfully to ${absolutePath}`);
    } catch (error) {
        console.error(`Error writing to file: ${error}`);
    }
}

// 组合markdown内容
export async function mergeContentMarkdown({author, title, date, readTime, description, tags, weight, articleContent}) {
    const preface =
`---
author: "${author}"
title: "${title}"
date: ${date}
description: "${description}"
tags: ${tags}
ShowReadingTime: "${readTime}"
weight: ${weight}
---\n`
    return preface + articleContent;
}

// 移除字符串中的空格
export function removeSpaces(str) {
    return str.replace(/\s+/g, '')
}

// 匹配并移除所有 <tagName> 标签及其内容
export function removeDomTags(htmlString, tagName) {

    const regex = new RegExp(`<${tagName}[^>]*?>[\\s\\S]*?<\\/${tagName}>`, 'gi');
    return htmlString.replace(regex, '');
}