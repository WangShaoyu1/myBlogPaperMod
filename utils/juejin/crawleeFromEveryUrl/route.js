import {createPlaywrightRouter, Dataset} from 'crawlee';
import {
    writeToFile,
    removeSpaces,
    mergeContentMarkdown,
    removeDomTags,
    getRandomDelay,
    replaceDoubleWithSingleQuotes,
    removeSpecialChars, readJsonFilesFromFolder, readFile, processElementInHtml
} from "../../util.js"

export const router = createPlaywrightRouter()
let weight = 50;

router.addHandler('DETAIL', async ({page, request, enqueueLinks, log}) => {
    log.debug(`Visiting detail page: ${request.url}`);
    let startTime = Date.now(), endTime;
    weight++

    // 在每次请求之间添加人为的延迟，单位为毫秒
    await new Promise(resolve => setTimeout(resolve, getRandomDelay(2, 12))); // n 秒间隔

    try {
        await page.waitForSelector('html', {timeout: 150000});
        // 并发获取页面元素的内容
        const [title, author, publishTime, readTime, metaTags, description, articleHtml, likes, comments, collects, views] = await Promise.all([
            page.locator(".article-title").textContent({timeout: 150000}).then(removeSpaces).then(removeSpecialChars),
            page.locator(".author-name .name").textContent({timeout: 150000}).then(removeSpaces),
            page.locator(".meta-box .time").textContent({timeout: 150000}).then(removeSpaces),
            page.locator(".meta-box .read-time").textContent({timeout: 150000}).then(removeSpaces),
            page.getAttribute("meta[name='keywords']", "content", {timeout: 150000}).then(removeSpaces),
            page.getAttribute("meta[name='description']", "content", {timeout: 150000}).then(removeSpaces).then(replaceDoubleWithSingleQuotes).then(removeSpecialChars),
            page.locator("#article-root").innerHTML({timeout: 150000}),
            page.getAttribute(".article-suspended-panel .with-badge:nth-child(1)","content",{timeout:"150000"}).then(removeSpaces),
            page.getAttribute(".article-suspended-panel .with-badge:nth-child(2)","content",{timeout:"150000"}).then(removeSpaces),
            page.getAttribute(".article-suspended-panel .with-badge:nth-child(3)","content",{timeout:"150000"}).then(removeSpaces),
            page.locator(".meta-box .views-count").textContent({timeout: 150000}).then(removeSpaces),
        ]);

        // 处理 tags
        const tags = metaTags ? JSON.stringify(metaTags.split(',')) : [];
        log.debug(`tags: ${tags}`);
        log.debug(`title: ${title}`);

        // 获取并处理文章内容，移除 <style> 标签及里面的内容
        const rmDomArticle = removeDomTags(articleHtml, 'style');
        const cleanedArticle = await processElementInHtml(rmDomArticle);

        const results = {title, author, publishTime, readTime, tags, description, article: cleanedArticle}

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

        // 并行写入 markdown 文件和已爬取的链接
        await Promise.all([
            writeToFile(mdContent, `./output/jueJin/posts/${title}.md`),
            writeToFile(`${title} ${request.url}\n`, './output/juejin/followerRank/combineSepLevelData/visitedUrls/done/crawled_links.txt')
        ]);
    } catch (error) {
        log.error(`Error processing detail page: ${error}`);
    }
    endTime = Date.now();
    console.log(`总共花费的时间为：${(endTime - startTime) / 1000}秒`);
})
// This is a fallback route which will handle the start URL, as well as the LIST labeled URLs.
router.addDefaultHandler(async ({request, page, enqueueLinks, log}) => {
    log.debug(`Enqueueing start from page: ${request.url}`);
    // let allUrls = (await readJsonFilesFromFolder('../output/juejin/followerRank/combineSepLevelData/visitedUrls/splitLevelUrl/level_20/level_20_articleList_part_1.txt'))[0].urls,
    //     visitedUrls = await readFile('../output/juejin/followerRank/combineSepLevelData/visitedUrls/done/crawled_links.txt'),
    //     urls = allUrls.filter(url => !visitedUrls.includes(url)).slice(0, 1)

    await enqueueLinks({
        urls: ['https://juejin.cn/post/7109652073402073102'],
        label: 'DETAIL',
    })
});

