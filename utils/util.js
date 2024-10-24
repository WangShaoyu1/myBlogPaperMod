// fileUtils.js

import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import {fileURLToPath} from 'url';
import {createWriteStream} from 'fs';
import TurnDownService from "turndown";
import {JSDOM} from 'jsdom';

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
export async function mergeContentMarkdown({author, title, date, readTime, description, tags, weight, articleContent,likes, comments, collects, views}) {
    const preface = `---
author: "${author}"
title: "${title}"
date: ${date}
description: "${description}"
tags: ${tags}
ShowReadingTime: "${readTime}"
weight: ${weight}
selfDefined:"likes:${likes},comments:${comments},collects:${collects},views:${views},"
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
    return str.replace(/[\/\\:*"<>|?？]/g, '').replace(/\.+$/, '');
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
    const delay = Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;
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
export function convertToNumber(value) {
    if (typeof value !== 'string') {
        throw new Error('Input must be a string');
    }

    // 处理空字符串
    if (value.trim() === '') {
        return 0;
    }

    // 去除逗号
    value = value.replace(/,/g, '');

    // 检查是否以 'k'、'm' 或 'w' 结尾
    if (value.endsWith('k')) {
        return parseFloat(value) * 1000;
    } else if (value.endsWith('m')) {
        return parseFloat(value) * 1000000;
    } else if (value.endsWith('w')) {
        return parseFloat(value) * 10000;
    } else {
        // 解析普通数字
        return parseFloat(value);
    }
}

// 处理markdown中的图片问题
export async function processImageInMarkdown(inputPath, outputDir, hugoSpecialPath) {
    const defaultImagePath = 'https://t11.baidu.com/it/u=1683902884,1968350863&fm=58';

    // 辅助函数：处理文件名
    const sanitizeFileName = (url) => {
        // 提取文件名，移除无效字符
        const fileName = path.basename(url.split(/[?#]/)[0]);
        return fileName.replace(/[<>:"\/\\|?*]/g, ''); // 移除无效字符
    };

    // 辅助函数：创建目录
    const ensureDirectoryExistence = async (filePath) => {
        const dirName = path.dirname(filePath);
        try {
            await fs.access(dirName);
        } catch (error) {
            await fs.mkdir(dirName, {recursive: true});
        }
    };

    // 下载图片的函数，带重试机制
    const downloadImage = async (url, filePath, retries = 3) => {
        let attempts = 0;

        while (attempts < retries) {
            try {
                const response = await axios({
                    url, method: 'GET', responseType: 'stream',
                });

                // 确保目录存在
                await ensureDirectoryExistence(filePath);

                // 写入文件
                const writer = response.data.pipe(createWriteStream(filePath));
                return new Promise((resolve, reject) => {
                    writer.on('finish', () => resolve(true));
                    writer.on('error', reject);
                });
            } catch (error) {
                attempts++;
                console.log(`下载失败，第 ${attempts} 次重试...原因是:${error.message}`);

                if (attempts >= retries) {
                    console.log(`下载失败，已重试 ${retries} 次。`);
                    return false;
                }
            }
        }
    }
    // 替换图片地址的核心函数
    const replaceImagePaths = async (content, outputDir) => {
        const imageRegex = /!\[.*?\]\((https?:\/\/.*?)\)/g;
        const matches = [];
        let match;

        // 收集所有匹配的URL
        while ((match = imageRegex.exec(content)) !== null) {
            matches.push(match[1]);
        }

        // 循环处理每个匹配的URL
        for (const imageUrl of matches) {
            const imageFileName = sanitizeFileName(imageUrl).substring(0, 20) + '.png'; // 限制文件名长度
            // const localImagePath = path.join(outputDir, imageFileName);
            const localImagePath = `${hugoSpecialPath}${imageFileName}`;

            // 下载图片，使用默认图片作为备选
            const success = await downloadImage(imageUrl, localImagePath);
            const finalImagePath = success ? localImagePath : defaultImagePath;

            // 替换所有匹配到的URL
            content = content.replace(imageUrl, finalImagePath);
        }

        return content;  // 返回处理好的内容
    };

    // 处理单个 markdown 文件
    const processMarkdownFile = async (filePath, outputDir) => {
        const content = await fs.readFile(filePath, 'utf-8');
        const updatedContent = await replaceImagePaths(content, outputDir);
        await fs.writeFile(filePath, updatedContent, 'utf-8');
        console.log(`处理完成: ${filePath}`);
    };

    // 处理文件夹中的所有 markdown 文件
    const processMarkdownFolder = async (folderPath, outputDir) => {
        const files = await fs.readdir(folderPath);
        const markdownFiles = files.filter(file => file.endsWith('.md'));
        for (const file of markdownFiles) {
            const filePath = path.join(folderPath, file);
            await processMarkdownFile(filePath, outputDir);
        }
    };

    // 判断是处理单个文件还是文件夹
    const stat = await fs.lstat(inputPath);
    if (stat.isDirectory()) {
        await processMarkdownFolder(inputPath, outputDir);
    } else if (stat.isFile() && inputPath.endsWith('.md')) {
        await processMarkdownFile(inputPath, outputDir);
    } else {
        console.error('无效的路径，请提供 markdown 文件或文件夹路径。');
    }
};

// 处理HTML中的图片问题
export async function processImageInHtml(htmlContent) {
    const outputDir = path.resolve(__dirname, '../', 'static/images/jueJin/')
    const hugoSpecialPath = '/images/jueJin/'
    const defaultImagePath = 'https://t11.baidu.com/it/u=1683902884,1968350863&fm=58';

    // 辅助函数：处理文件名
    const sanitizeFileName = (url) => {
        const fileName = path.basename(url.split(/[?#]/)[0]);
        return fileName.replace(/[<>:"\/\\|?*]/g, '').substring(0, 15) + '.png'; // 限制文件名长度
    };

    // 辅助函数：创建目录
    const ensureDirectoryExistence = async (filePath) => {
        const dirName = path.dirname(filePath);
        try {
            await fs.access(dirName);
        } catch (error) {
            await fs.mkdir(dirName, {recursive: true});
        }
    };

    // 下载图片的函数，带重试机制
    const downloadImage = async (url, filePath, retries = 3) => {
        let attempts = 0;

        while (attempts < retries) {
            try {
                const response = await axios({
                    url, method: 'GET', responseType: 'stream',
                });

                await ensureDirectoryExistence(filePath);

                const writer = response.data.pipe(createWriteStream(filePath));
                return new Promise((resolve, reject) => {
                    writer.on('finish', () => resolve(true));
                    writer.on('error', reject);
                });
            } catch (error) {
                attempts++;
                console.log(`下载失败，第 ${attempts} 次重试...原因是:${error.message}`);

                if (attempts >= retries) {
                    console.log(`下载失败，已重试 ${retries} 次。`);
                    return false;
                }
            }
        }
    };

    // 替换图片地址的核心函数
    const replaceImagePathsByString = async (htmlContent) => {
        const imageRegex = /<img[^>]+src="(https?:\/\/[^"]+)"/g;
        const matches = [];
        let match;

        while ((match = imageRegex.exec(htmlContent)) !== null) {
            matches.push(match[1]);
        }
        for (const imageUrl of matches) {
            const imageFileName = sanitizeFileName(imageUrl);
            const localImagePath = path.join(outputDir, imageFileName);
            const imagePathInHugo = `${hugoSpecialPath}${imageFileName}`;

            const success = await downloadImage(imageUrl, localImagePath);
            const finalImagePath = success ? imagePathInHugo : defaultImagePath;

            htmlContent = htmlContent.replace(imageUrl, finalImagePath);
        }

        return htmlContent;
    };
    const replaceImagePathsByDom = async (htmlContent) => {
        // 使用 jsdom 创建一个 DOM 实例
        const dom = new JSDOM(htmlContent);
        const doc = dom.window.document;

        // 查找所有 img 标签
        const imgElements = doc.querySelectorAll('img');

        // 创建一个数组来存储所有的 imageUrls
        const imageUrls = [];

        // 循环处理每个 img 元素
        for (const img of imgElements) {
            const imageUrl = img.src; // 提取 src 属性
            imageUrls.push(imageUrl);

            const imageFileName = sanitizeFileName(imageUrl);
            const localImagePath = path.join(outputDir, imageFileName);
            const imagePathInHugo = `${hugoSpecialPath}${imageFileName}`;
            const success = await downloadImage(imageUrl, localImagePath);

            // 替换 img 标签的 src 属性
            img.src = success ? imagePathInHugo : defaultImagePath;
        }

        // 将修改后的 Document 对象转换回 HTML 字符串
        return doc.body.innerHTML;
    };

    return new Promise((resolve, reject) => {
        resolve(replaceImagePathsByDom(htmlContent))
    })
}

// 处理markdown中的代码问题
export async function processCodeInHtml(htmlContent) {
    const turnDownService = new TurnDownService({});  // 创建 Turndown 实例
    // 添加自定义代码块转换规则
    turnDownService.addRule('highlightedCodeBlocks', {
        filter: function (node) {
            // 匹配 <pre> 包含 <code> 以及语言类名的结构
            return (node.nodeName === 'PRE' && node.querySelector('code') && node.querySelector('code').classList.contains('hljs'));
        }, replacement: function (content, node) {
            // 提取代码语言
            const languageElement = node.querySelector('.code-block-extension-lang');
            const language = languageElement ? languageElement.textContent.trim() : '';

            // 提取每一行代码并添加层级缩进
            const codeLines = node.querySelectorAll('.code-block-extension-codeLine');
            let indentLevel = 0; // 用于跟踪当前缩进级别
            const codeContent = Array.from(codeLines)
                .map(line => {
                    const lineText = line.textContent.trim();

                    // 计算当前行的缩进层级
                    if (lineText.endsWith('{') || lineText.endsWith('[')) {
                        indentLevel++;
                    } else if (lineText.endsWith('}') || lineText.endsWith(']')) {
                        indentLevel--;
                    }

                    // 确保 indentLevel 不小于 0
                    indentLevel = Math.max(indentLevel, 0);

                    // 返回带有缩进的行
                    return '    '.repeat(indentLevel) + lineText;
                })
                .join('\n'); // 用换行符连接每一行代码

            // 返回格式化后的 Markdown 代码块
            return `\`\`\`${language}\n${codeContent}\n\`\`\``;
        }
    });

    return new Promise((resolve, reject) => {
        resolve(turnDownService.turndown(htmlContent))
    })
}

export async function processElementInHtml(htmlContent) {
    let finalString = '';
    await processImageInHtml(htmlContent)
        .then(result => processCodeInHtml(result))
        .then(result => {
            finalString = result
        });

    return finalString;
}