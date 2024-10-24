import {createPlaywrightRouter, Dataset} from 'crawlee';
import {
    writeToFile,
    removeSpaces,
    mergeContentMarkdown,
    removeDomTags,
    getRandomDelay,
    replaceDoubleWithSingleQuotes,
    removeSpecialChars, readJsonFilesFromFolder, readFile, processElementInHtml, convertToNumber
} from "../../util.js"
import {logError, logMessage} from "../../log.js"

export const router = createPlaywrightRouter()
let weight = 1;
let authorLevel = 8;
router.addHandler('DETAIL', async ({page, request, enqueueLinks, log}) => {
    log.debug(`Visiting detail page: ${request.url}`);
    let startTime = Date.now(), endTime;
    logMessage('info', `start:${new Date().toLocaleString()} ${request.url}`)
    // 在每次请求之间添加人为的延迟，单位为毫秒
    await new Promise(resolve => setTimeout(resolve, getRandomDelay(2, 30))); // n 秒间隔

    try {
        await page.waitForSelector('html', {timeout: 150000});
        // 并发获取页面元素的内容,page.evaluate不能传递函数，智能通过字符串传递函数逻辑，也不失为一个好方法
        const {
            title, author, publishTime, readTime, metaTags, description, articleHtml, likes, comments,
            collects, views
        } = await page.evaluate(({a, b, c}) => {
            removeSpecialChars = new Function('return ' + a)();
            replaceDoubleWithSingleQuotes = new Function('return ' + b)();
            convertToNumber = new Function('return ' + c)();
            return {
                title: removeSpecialChars(document.querySelector(".article-title")?.innerText || ''),
                author: document.querySelector(".author-name .name")?.innerText || '',
                publishTime: document.querySelector(".meta-box .time")?.innerText || '',
                readTime: document.querySelector(".meta-box .read-time")?.innerText || '',
                metaTags: document.querySelector("meta[name='keywords']")?.content || '',
                description: replaceDoubleWithSingleQuotes(removeSpecialChars(document.querySelector("meta[name='description']")?.content || '')),
                articleHtml: document.querySelector("#article-root")?.innerHTML || '',
                likes: convertToNumber(document.querySelectorAll(".article-suspended-panel .with-badge:nth-of-type(1)")[0]?.getAttribute("badge") || ''),
                comments: convertToNumber(document.querySelectorAll(".article-suspended-panel .with-badge:nth-of-type(2)")[0]?.getAttribute("badge") || ''),
                collects: convertToNumber(document.querySelectorAll(".article-suspended-panel .with-badge:nth-of-type(3)")[0]?.getAttribute("badge") || ''),
                views: convertToNumber(document.querySelector(".meta-box .views-count")?.innerText || ''),
            }
        }, {
            a: removeSpecialChars.toString(),
            b: replaceDoubleWithSingleQuotes.toString(),
            c: convertToNumber.toString()
        })
        // 处理 tags
        const tags = metaTags ? JSON.stringify(metaTags.split(',')) : [];
        log.debug(`tags: ${tags}`);
        log.debug(`title: ${title}`);

        // 获取并处理文章内容，移除 <style> 标签及里面的内容
        const rmDomArticle = removeDomTags(articleHtml, 'style');
        const cleanedArticle = await processElementInHtml(rmDomArticle);

        const results = {
            title, author, publishTime, readTime, tags, description, article: cleanedArticle,
            selfDefined: `likes:${likes},comments:${comments},collects:${collects},likes:${views}`
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
            likes,
            comments,
            collects,
            views,
            articleContent: cleanedArticle
        });
        if (title) {
            // 并行写入 markdown 文件和已爬取的链接
            await Promise.all([
                writeToFile(mdContent, `./output/jueJin/posts/${authorLevel}/${title}.md`),
                writeToFile(`${request.url} ${title} \n`, './output/juejin/followerRank/combineSepLevelData/visitedUrls/done/crawled_links.txt', true)
            ]);
        }
        // 写入日志系统
        logMessage('info', `${title ? 'success' : 'failed'}:${new Date().toLocaleString()} ${request.url}`)
    } catch (error) {
        log.error(`Error processing detail page: ${error}`);
        logError(`${request.url} ${new Date().toLocaleString()} ${error}`)
    }
    endTime = Date.now();
    console.log(`总共花费的时间为：${(endTime - startTime) / 1000}秒`);
})
// This is a fallback route which will handle the start URL, as well as the LIST labeled URLs.
router.addDefaultHandler(async ({request, page, enqueueLinks, log}) => {
    log.debug(`Enqueueing start from page: ${request.url}`);
    let willVisitUrls = (await readFile(`../../output/jueJin/followerRank/combineSepLevelData/visitedUrls/level_${authorLevel}_articleList.txt`)).split("\n"),
        visitedUrl = await readFile('../../output/jueJin/followerRank/combineSepLevelData/visitedUrls/done/crawled_links.txt'),
        urls = willVisitUrls.filter(url => !visitedUrl.includes(url))

    await enqueueLinks({
        // urls:["https://juejin.cn/post/7109652073402073102"],
        urls,
        label: 'DETAIL',
    })
});

