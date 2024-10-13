import fs from 'fs';
import path from 'path';

function findMdFiles(dir) {
    let mdFiles = [];
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // 递归查找子文件夹中的 .md 文件
            mdFiles = mdFiles.concat(findMdFiles(fullPath));
        } else if (file.endsWith('.md')) {
            mdFiles.push(fullPath);
        }
    });

    return mdFiles;
}

function combineMdFiles(inputSource, outputFile) {
    let mdFiles = [];

    if (Array.isArray(inputSource)) {
        // 如果输入的是文件数组，过滤出有效的 .md 文件
        mdFiles = inputSource.filter(file => file.endsWith('.md') && fs.existsSync(file));
    } else if (fs.statSync(inputSource).isDirectory()) {
        // 如果输入的是文件夹，递归查找 .md 文件
        mdFiles = findMdFiles(inputSource);
    }

    if (mdFiles.length === 0) {
        console.log('没有找到任何 .md 文件');
        return;
    }

    // 合并 .md 文件内容
    const combinedContent = mdFiles.map((file, index) => {
        const content = fs.readFileSync(file, 'utf-8');
        const header = `<center>第 ${index + 1} 篇</center>\n\n`;  // 每篇的顶部添加标识
        return `${header}# ${path.basename(file)}\n\n${content}`;
    }).join('\n\n---\n\n');  // 文件之间插入两行空白和分隔符

    // 写入到输出文件
    fs.writeFileSync(outputFile, combinedContent);
    console.log(`所有 .md 文件已成功合并到 ${outputFile}`);
}

// 使用示例
const inputDir = '../../content/posts/juejin'; // 输入文件夹路径
const inputFiles = ['../../content/posts/papermod/papermod-installation.md', '../../content/posts/papermod/面试官：为什么忘记密码要重置而不是告诉你原密码？.md']; // 或输入文件数组

// 合并文件：可以是文件夹或文件数组
combineMdFiles(inputDir, '../output/juejin/combined_output.md');

// combineMdFiles(inputFiles, '../output/juejin/combined_output.md');
