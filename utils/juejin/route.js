import {createPlaywrightRouter, Dataset} from 'crawlee';
import TurnDownService from 'turndown';  // 引入 Turndown 库
import {
    writeToFile,
    removeSpaces,
    mergeContentMarkdown,
    removeDomTags,
    getRandomDelay,
    replaceDoubleWithSingleQuotes
} from "../util.js"

const turnDownService = new TurnDownService();  // 创建 Turndown 实例
export const router = createPlaywrightRouter()
let weight = 50;

router.addHandler('DETAIL', async ({page, request, enqueueLinks, log}) => {
    log.debug(`Visiting detail page: ${request.url}`);
    let startTime = Date.now(), endTime;
    weight++

    // 在每次请求之间添加人为的延迟，单位为毫秒
    await new Promise(resolve => setTimeout(resolve, getRandomDelay(20, 300))); // n 秒间隔

    try {
        await page.waitForSelector('html', {timeout: 60000});
        // 并发获取页面元素的内容
        const [title, author, publishTime, readTime, metaTags, description, articleHtml] = await Promise.all([
            page.locator(".article-title").textContent().then(removeSpaces),
            page.locator(".author-name .name").textContent().then(removeSpaces),
            page.locator(".meta-box .time").textContent().then(removeSpaces),
            page.locator(".meta-box .read-time").textContent().then(removeSpaces),
            page.getAttribute("meta[name='keywords']", "content").then(removeSpaces),
            page.getAttribute("meta[name='description']", "content").then(removeSpaces).then(replaceDoubleWithSingleQuotes),
            page.locator("#article-root").innerHTML()
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
            articleContent: turnDownService.turndown(cleanedArticle)
        });

        // 并行写入 markdown 文件和已爬取的链接
        await Promise.all([
            writeToFile(mdContent, `../content/posts/jueJin/${title}.md`),
            writeToFile(`${title} ${request.url}\n`, './output/juejin/crawled_links.txt')
        ]);
    } catch (error) {
        log.error(`Error processing detail page: ${error}`);
    }
    endTime = Date.now();
    console.log(`总共花费的时间为：${(endTime - startTime) / 1000}秒`);
})

router.addHandler('RECOMMEND', async ({page, enqueueLinks, request, log}) => {
    log.debug(`Enqueueing recommend for: ${request.url}`);

    // We are now on a category page. We can use this to paginate through and enqueue all products,
    // as well as any subsequent pages we find

    await page.waitForSelector('.main-container', {timeout: 60000});
    await enqueueLinks({
        urls: [request.url],
        label: 'DETAIL',
    })
    await enqueueLinks({
        selector: '.block-body .entry-list > a',
        label: 'DETAIL', // <= note the different label
    });
    await enqueueLinks({
        selector: '.recommended-area .entry-list .title-row > a',
        label: 'DETAIL', // <= note the different label
    });
});

// This is a fallback route which will handle the start URL, as well as the LIST labeled URLs.
router.addDefaultHandler(async ({request, page, enqueueLinks, log}) => {
    log.debug(`Enqueueing start from page: ${request.url}`);
    // This means we're on the start page, with no label.
    // On this page, we just want to enqueue all the category pages.

    await page.waitForSelector('.entry-list', {timeout: 60000});
    const elements = (await page.$$('.entry-list .title-row a')).slice(0, 20);

    for (const element of elements) {
        const href = await element.getAttribute('href');
        await enqueueLinks({
            urls: [href],
            label: 'RECOMMEND',
        });
    }
});

