// fileUtils.js

import fs from 'fs/promises';
import path from 'path';
import https from 'https';
import {fileURLToPath} from 'url';

// 获取当前模块文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 公共函数：将内容写入文件（如果文件不存在则自动创建）
export async function writeToFile(content, relativeFilePath, append = false) {
    try {
        // 基于模块的目录，将相对路径转换为绝对路径
        const absolutePath = path.resolve(__dirname, relativeFilePath.trim());
        // 获取文件的目录路径
        const directory = path.dirname(absolutePath);

        // 递归创建目录（如果目录不存在则会自动创建）
        await fs.mkdir(directory, {recursive: true});

        // 根据 append 参数决定是追加还是覆盖
        if (append) {
            // 将内容追加到文件中，如果文件不存在则创建文件
            await fs.appendFile(absolutePath, content, 'utf8');
            console.log(`Content appended successfully to ${absolutePath}`);
        } else {
            // 覆盖文件内容，如果文件不存在则创建文件
            await fs.writeFile(absolutePath, content, 'utf8');
            console.log(`File written successfully to ${absolutePath}`);
        }
    } catch (error) {
        console.error(`Error writing to file: ${error}`);
    }
}

// 公共函数：读取文件内容
export async function readFile(filePath) {
    try {
        // 检查文件是否存在
        await fs.access(filePath);

        // 如果存在则读取文件内容
        const content = await fs.readFile(filePath, 'utf-8');
        return content
    } catch (error) {
        // 处理文件不存在的情况
        if (error.code === 'ENOENT') {
            console.error(`File not found: ${filePath}`);
        } else {
            console.error('Error reading file:', error);
        }
        return ''
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
export function removeSpaces(input) {
    if (typeof input === 'string') {
        // 如果是字符串，直接移除空格
        return input.replace(/\s+/g, '');
    } else if (Array.isArray(input)) {
        // 如果是数组，遍历数组并移除每个字符串的空格
        return input.map(item => typeof item === 'string' ? item.replace(/\s+/g, '') : item);
    } else {
        throw new Error("输入必须是字符串或字符串数组");
    }
}

//  将双引号替换为单引号
export function replaceDoubleWithSingleQuotes(input) {
    // 如果是字符串，直接处理
    if (typeof input === 'string') {
        return input.replace(/"/g, "'");
    }
    // 检查输入类型，如果是数组则进行处理
    else if (Array.isArray(input)) {
        return input.map(str => str.replace(/"/g, "'"));
    }
    // 如果输入既不是字符串也不是数组，返回原输入
    return input;
}

// 去掉特殊字符
export function removeSpecialChars(str) {
    return str.replace(/[\/\\:*"<>|\.]/g, '');
}

// 匹配并移除所有 <tagName> 标签及其内容
export function removeDomTags(htmlString, tagName) {

    const regex = new RegExp(`<${tagName}[^>]*?>[\\s\\S]*?<\\/${tagName}>`, 'gi');
    return htmlString.replace(regex, '');
}

// 将size大小转换为MB，无论是gb还是kb
export function convertToMb(input) {
    // 定义内部处理函数，适用于单个字符串
    const convertSingle = (sizeStr) => {
        sizeStr = sizeStr.trim().toLowerCase();

        let sizeInMb;

        if (sizeStr.endsWith('kb')) {
            let sizeInKb = parseFloat(sizeStr.replace('kb', ''));
            sizeInMb = (sizeInKb / 1024).toFixed(3);  // 保留三位小数
        } else if (sizeStr.endsWith('gb')) {
            let sizeInGb = parseFloat(sizeStr.replace('gb', ''));
            sizeInMb = (sizeInGb * 1024).toString();
        } else if (sizeStr.endsWith('mb')) {
            sizeInMb = parseFloat(sizeStr.replace('mb', '')).toString();
        } else {
            throw new Error("无法识别的单位: " + sizeStr);
        }

        return [parseFloat(sizeInMb), `${sizeInMb}MB`];
    };

    // 判断输入类型，如果是字符串，直接处理；如果是数组，遍历处理
    if (typeof input === 'string') {
        return convertSingle(input);
    } else if (Array.isArray(input)) {
        return input.map(item => convertSingle(item));
    } else {
        throw new Error("输入必须是字符串或字符串数组");
    }
}

// 生成随机时间间隔
export function getRandomDelay(minSeconds, maxSeconds) {
    const delay = Math.floor(Math.random() * (maxSeconds - minSeconds + 1
    )) + minSeconds;
    return delay * 1000; // 转换为毫秒
}

// 读取指定文件夹中的 JSON 文件
export async function readJsonFilesFromFolder(folderPath) {
    const files = await fs.readdir(folderPath);
    const jsonDataArray = [];

    for (const file of files) {
        // 检查文件扩展名是否为 .json
        if (path.extname(file) === '.json') {
            const filePath = path.join(folderPath, file);
            const fileContent = await fs.readFile(filePath, 'utf8');
            try {
                const jsonData = JSON.parse(fileContent);
                jsonDataArray.push(jsonData);
            } catch (error) {
                console.error(`无法解析 JSON 文件 ${file}:`, error);
            }
        }
    }

    return jsonDataArray; // 返回组合后的数据
}

// 从cookie字符串中解析cookie对象
export function parseCookies(cookieString) {
    const domain = 'wiki.yingzi.com';
    const expires = Math.floor(Date.now() / 1000) + 15 * 24 * 60 * 60; // 半个月后的 UNIX 时间戳（秒）,Playwright 要求的 expires字段
    const path = '/';

    return cookieString.replace(/; /g, ';').split(';').map(cookie => {
        const [name, value] = cookie.split('=');
        return {name, value, domain, path};
    });
}

// 去掉字符串中的 特殊字符，特别是出现如下这种，hugo解析会报错
// pages/viewpage.action?pageId=91158375#id-3、Demo技术对接过程中的一些思考- 3%E3%80%81Demo%E6%8A%80%E6%9C
export function removeSpecialCharacters(str) {
    return str.replace(/(pages\/viewpage\.action\?pageId=[^#]*)#.*?(?=\))/, '$1');
}

// 从字符串中提取数字,例如：'1.2k' => 1200，‘1.2w’ => 12000
export function extractNumber(input) {
    const match = input.match(/(\d+(?:\.\d+)?)([kK]?|[wW]?)/);
    if (!match) return 0; // 没有匹配到数字，返回 null

    const number = parseFloat(match[1]) * (match[2].toLowerCase() === 'k' ? 1000 : match[2].toLowerCase() === 'w' ? 10000 : 1);
    return Math.round(number); // 返回取整后的数字
}

// 下载图片
export async function downloadImage(url, filepath, retries = 3) {
    const fileStream = await fs.open(filepath, 'w');
    const file = fileStream.createWriteStream();

    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                if (retries > 0) {
                    console.log(`Retrying ${url} (${retries} retries left)`);
                    return resolve(downloadImage(url, filepath, retries - 1)); // 重试
                } else {
                    return reject(new Error(`Failed to download: ${url}`));
                }
            }

            response.pipe(file);
            file.on('finish', () => {
                file.close(() => resolve(filepath)); // 下载完成后关闭文件流
            });
        }).on('error', async (err) => {
            await fs.unlink(filepath); // 出现错误时删除文件
            if (retries > 0) {
                console.log(`Retrying ${url} (${retries} retries left)`);
                return resolve(downloadImage(url, filepath, retries - 1)); // 重试
            } else {
                return reject(err);
            }
        });
    });
};

// 替换 Markdown 中的图片链接为本地路径
export async function replaceMarkdownImages(markdownContent, downloadFolder, defaultImagePath) {
    const imageRegex = /!\[.*?\]\((https?:\/\/[^\)]+)\)/g; // 匹配 Markdown 图片语法中的 URL
    let match;

    // 遍历所有匹配的图片链接
    while ((match = imageRegex.exec(markdownContent)) !== null) {
        const url = match[1]; // 获取图片的 URL
        const imageName = path.basename(url).split('?')[0]; // 提取图片名
        let localImagePath = path.join(downloadFolder, imageName);

        try {
            // 尝试下载图片
            await downloadImage(url, localImagePath);
            console.log(`Downloaded: ${url} -> ${localImagePath}`);
        } catch (error) {
            // 下载失败，使用默认图片
            console.error(`Failed to download ${url}, using default image.`);
            localImagePath = defaultImagePath;
        }

        // 替换 Markdown 中的图片链接为本地路径
        markdownContent = markdownContent.replace(url, localImagePath);
    }

    return markdownContent;
};

// 处理 Markdown 文件
export async function processMarkdownFile(markdownFilePath, downloadFolder, defaultImagePath) {
    try {
        // 读取 Markdown 文件内容
        let markdownContent = await fs.readFile(markdownFilePath, 'utf-8');

        // 确保图片下载文件夹存在
        try {
            await fs.access(downloadFolder);
        } catch {
            await fs.mkdir(downloadFolder);
        }

        // 替换 Markdown 中的图片链接
        const updatedMarkdown = await replaceMarkdownImages(markdownContent, downloadFolder, defaultImagePath);

        // 将更新后的内容保存回 Markdown 文件
        await fs.writeFile(markdownFilePath, updatedMarkdown);
        console.log('Markdown file updated with local images.');
    } catch (error) {
        console.error('Error processing Markdown file:', error);
    }
};