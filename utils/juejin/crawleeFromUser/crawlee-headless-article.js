import {chromium} from 'playwright'
import {load} from 'cheerio'
import {readFile, writeToFile, extractNumber, readJsonFilesFromFolder, getRandomDelay} from "../../util.js"

const baseUrl = 'https://juejin.cn'
const browser = await chromium.launch({headless: false})
const page = await browser.newPage();

const isArticleUpdate = true; // 是否更新 作者下的文章
const userLevel = 20;

async function readCombineData() {
    return await readFile(`../../output/juejin/followerRank/combineSepLevelData/${userLevel}_combine_data.json`);
}

// -------------5、获取被优质作者关注的团队列表-------------
if (isArticleUpdate) {
    const articleListFromOneAuthor = {};
    const startTime = Date.now(); // 开始时间

    for (const item of JSON.parse(await readCombineData()).allData) {
        if (item.articleList.length) {
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
                await page.waitForTimeout(getRandomDelay(1, 4));

                const isBottom = await page.evaluate(({startTime}) => {
                    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
                    const clientHeight = window.innerHeight;

                    // 检查是否滚动到底部
                    return ((scrollTop + clientHeight) >= scrollHeight) || ((Date.now() - startTime) / 1000).toFixed(2) > 120;
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