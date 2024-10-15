import TurnDownService from 'turndown';  // 引入 Turndown 库
import {writeToFile, readFile} from "../../../utils/util.js";
import path from 'path';
import {fileURLToPath} from 'url';
// 获取当前模块文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const turnDownService = new TurnDownService({});  // 创建 Turndown 实例
// 添加自定义代码块转换规则
turnDownService.addRule('highlightedCodeBlocks', {
    filter: function (node) {
        // 匹配 <pre> 包含 <code> 以及语言类名的结构
        return (
            node.nodeName === 'PRE' &&
            node.querySelector('code') &&
            node.querySelector('code').classList.contains('hljs')
        );
    },
    replacement: function (content, node) {
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
const cleanedArticle = await readFile(path.resolve(__dirname, './compare.html'));

await writeToFile(turnDownService.turndown(cleanedArticle), path.resolve(__dirname, './result/1.md'));