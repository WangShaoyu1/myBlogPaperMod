import {chromium} from 'playwright'
import {load} from 'cheerio'
import {readFile, writeToFile, extractNumber, readJsonFilesFromFolder, getRandomDelay} from "../../util.js"

const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36',
    'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
    'Mozilla/5.0 (Linux; Android 10; SM-A505FN) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.152 Mobile Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 9; SM-J730GM) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Mobile Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:68.0) Gecko/20100101 Firefox/68.0',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:78.0) Gecko/20100101 Firefox/78.0',
    'Mozilla/5.0 (Linux; Android 10; SM-A107F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Mobile Safari/537.36',
    'Mozilla/5.0 (iPad; CPU OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (X11; Fedora; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15',
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
    'Mozilla/5.0 (Linux; Android 8.1.0; Nexus 6P Build/OPM6.171019.030.K1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36'
];
const baseUrl = 'https://juejin.cn'
const browser = await chromium.launch({headless: false})
const page = await browser.newPage();
await page.setExtraHTTPHeaders({
    'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
});
const isArticleUpdate = true; // 是否更新 作者下的文章
const userLevel = 7;

async function readCombineData() {
    return await readFile(`../../output/juejin/followerRank/combineSepLevelData/${userLevel}_combine_data.json`);
}

// -------------5、获取被优质作者关注的团队列表-------------
if (isArticleUpdate) {
    const articleListFromOneAuthor = {};
    const startTime = Date.now(); // 开始时间

    for (const item of JSON.parse(await readCombineData()).allData) {
        if (item.articleList && item.articleList.length) {
            continue
        }
        try {
            await getArticleList(item).then(async (result) => {
                const existingData = JSON.parse(await readCombineData());

                Object.assign(articleListFromOneAuthor, item, {articleList: result});

                existingData.allData.forEach((elem) => {
                    if (elem.id === articleListFromOneAuthor.id) {
                        Object.assign(elem, articleListFromOneAuthor)
                    }
                })

                await writeToFile(JSON.stringify(existingData, null, 2), `./output/juejin/followerRank/combineSepLevelData/${userLevel}_combine_data.json`)
                    .then(() => console.log(`${item.name}\`s article list written successfully`));

                await writeToFile(`${result.join("\n")}`, `./output/juejin/followerRank/combineSepLevelData/visitedUrls/level_${userLevel}_articleList.txt`, true).then(() => console.log(`level_${item.level.rankNumber}_articleList.txt written successfully`));
            })
        } catch (e) {
            console.error(`Error getting all article list,Detail reason is: ${e.message}`);
        }
    }


    console.log(`All articleList above ${userLevel} cost time taken: ${((Date.now() - startTime) / 1000).toFixed(2)} seconds`);
}
//------------- 函数类型的工具函数 -------------
// 获取某个作者的文章列表
async function getArticleList(item) {
    const startTime = Date.now(); // 函数开始时间
    const href = item.href.includes("posts") ? item.href : `${item.href}/posts`;

    return new Promise(async (resolve, reject) => {
        try {
            await page.goto(href, {waitUntil: 'load', timeout: 60000});
            await page.waitForLoadState('load');

            while (true) {
                await page.mouse.wheel(0, 1000);
                await page.waitForTimeout(getRandomDelay(1, 40));

                const isBottom = await page.evaluate(({startTime}) => {
                    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
                    const clientHeight = window.innerHeight;

                    // 检查是否滚动到底部
                    return ((scrollTop + clientHeight) >= scrollHeight) || (((Date.now() - startTime) / 1000).toFixed(2) > 120);
                }, {startTime});

                // 如果已经滚动到底部，退出循环
                if (isBottom) {
                    console.log("已经滚动到页面底部，停止滚动。");
                    break;
                } else {
                    console.log("未滚动到页面底部，继续滚动。");
                }
            }

            const articleList = await page.evaluate(({baseUrl}) => {
                return Array.from(document.querySelectorAll('.list-body .post-list-box .entry-list>li'))
                    .map(elem => `${baseUrl}${elem.querySelector('.title')?.getAttribute('href')}` || '')
            }, {baseUrl});
            await page.waitForTimeout(3000);
            resolve(articleList);
        } catch (e) {
            console.error(`Error getting ${item.name}\`s articleList; Detail reason is: ${e.message}`);
            reject(e);
        } finally {
            console.log(`This Time taken to get ${item.name}\`s articleList is: ${((Date.now() - startTime) / 1000).toFixed(2)} seconds`);
        }
    });
}

// --------3、结束------------------
await page.waitForTimeout(5000);
await browser.close();