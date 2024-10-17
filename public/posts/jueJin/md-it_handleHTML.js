import markdownIt from 'markdown-it';
import hljs from 'highlight.js';
import path from 'path';
import {fileURLToPath} from 'url';
import {readFile, writeToFile} from "../../../utils/util.js";

// 获取当前模块文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const md = markdownIt({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return `<pre class="hljs"><code>${hljs.highlight(lang, str, true).value}</code></pre>`;
            } catch (__) {
            }
        }

        return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    }
});

// 将 HTML 转化为 Markdown
const cleanedArticle = await readFile(path.resolve(__dirname, './compare.html'));

await writeToFile(md.render(cleanedArticle), path.resolve(__dirname, './result/md_it_2.md'));