import TurnDownService from 'turndown';  // 引入 Turndown 库
import {writeToFile, readFile} from "../../../utils/util.js";
import path from 'path';
import {fileURLToPath} from 'url';

// 获取当前模块文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const turnDownService = new TurnDownService({});  // 创建 Turndown 实例
// 添加自定义代码块转换规则
turnDownService.addRule('preCodeBlocks', {
    filter: function (node) {
        return (
            node.nodeName === 'PRE' &&
            node.firstChild &&
            node.firstChild.nodeName === 'CODE'
        );
    },
    replacement: function (content, node) {
        const codeNode = node.firstChild;
        const language = codeNode.getAttribute('class')?.split('-')[1]; // 获取代码语言
        return `\`\`\`${language || ''}\n${codeNode.textContent}\n\`\`\``;
    }
});


const cleanedArticle = await readFile(path.resolve(__dirname, './compare.html'));

await writeToFile(turnDownService.turndown(cleanedArticle), path.resolve(__dirname, './result/1.md'));