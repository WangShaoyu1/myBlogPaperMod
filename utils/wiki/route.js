import {createPlaywrightRouter, Dataset} from 'crawlee';
import TurnDownService from 'turndown';  // 引入 Turndown 库
import {
    writeToFile,
    readFile,
    removeSpaces,
    mergeContentMarkdown,
    removeDomTags,
    getRandomDelay,
    replaceDoubleWithSingleQuotes,
    readJsonFilesFromFolder,
    removeSpecialCharacters
} from "../util.js"

const turnDownService = new TurnDownService();  // 创建 Turndown 实例
export const router = createPlaywrightRouter()
let weight = 50;

router.addHandler('DETAIL', async ({page, request, enqueueLinks, log}) => {
    log.debug(`Visiting detail page: ${request.url}`);
    let startTime = Date.now(), endTime;
    weight++
    writeToFile(JSON.stringify(request.url, null, 2), `./output/wiki/url/visitedUrls.txt`, true).then(() => console.log('visitedUrls.txt written successfully'));

    // 在每次请求之间添加人为的延迟，单位为毫秒
    await new Promise(resolve => setTimeout(resolve, getRandomDelay(20, 120))); // n 秒间隔

    try {
        await page.waitForSelector('html', {timeout: 150000});

        // 并发获取页面元素的内容
        const [title, author, publishTime, readTime, metaTags, description, articleHtml] = await Promise.all([
            page.getAttribute("meta[name='ajs-latest-published-page-title']", "content", {timeout: 150000}).then(removeSpaces),
            page.getAttribute("meta[name='ajs-user-display-name']", "content", {timeout: 150000}).then(removeSpaces),
            page.locator(".page-metadata-modification-info .last-modified").textContent({timeout: 150000}).then(removeSpaces),
            // page.locator(".page-metadata-modification-info .read-time").textContent().then(removeSpaces),
            "12s",
            page.getAttribute("meta[name='ajs-parent-page-title']", "content", {timeout: 150000}).then(removeSpaces),
            page.getAttribute("meta[name='ajs-parent-page-title']", "content", {timeout: 150000}).then(removeSpaces),
            // page.getAttribute("meta[name='description']", "content").then(removeSpaces).then(replaceDoubleWithSingleQuotes),
            page.locator("#main-content").innerHTML({timeout: 150000})
        ]);

        // 处理 tags
        const tags = metaTags ? JSON.stringify(metaTags.split(',')) : [];
        log.debug(`tags: ${tags}`);
        log.debug(`title: ${title}`);

        // 获取并处理文章内容，移除 <style> 标签及里面的内容
        const cleanedArticle = removeDomTags(articleHtml, 'style');

        const results = {
            title, author, publishTime, readTime, tags, description, article: turnDownService.turndown(cleanedArticle)
        }

        await Dataset.pushData(results);

        const mdContent = await mergeContentMarkdown({
            title,
            author,
            date: publishTime,
            readTime,
            tags,
            description,
            weight,
            articleContent: removeSpecialCharacters(turnDownService.turndown(cleanedArticle))
        });

        // 并行写入 markdown 文件和已爬取的链接
        await Promise.all([
            writeToFile(mdContent, `../content/posts/wiki/${title}.md`),
            writeToFile(`${title} ${request.url}\n`, './output/wiki/crawled_links.txt')
        ]);
    } catch (error) {
        log.error(`Error processing detail page: ${error}`);
    }
    endTime = Date.now();
    console.log(`总共花费的时间为：${(endTime - startTime) / 1000}秒`);
})

// This is a fallback route which will handle the start URL, as well as the LIST labeled URLs.
router.addDefaultHandler(async ({request, page, enqueueLinks, log, session}) => {
    log.debug(`Enqueueing start from page: ${request.url}`);
    let allUrls = (await readJsonFilesFromFolder('../output/wiki/url'))[0].urls,
        visitedUrls = await readFile('../output/wiki/url/visitedUrls.txt'),
        urls = allUrls.filter(url => !visitedUrls.includes(url))

    await enqueueLinks({
        urls,
        label: 'DETAIL',
    })
});

