import {chromium} from 'playwright'
import {load} from 'cheerio'
import {readFile, writeToFile, extractNumber} from "../util.js"

const baseUrl = 'https://juejin.cn'
const browser = await chromium.launch({headless: false})
const page = await browser.newPage();
const isTabUpdate = false;
const isDetailListUpdate = false;
const isAuthorListUpdate = true;

const hQAuthorTabList = await readFile('../output/juejin/hQAuthorTabList.json');
const hQAuthorDetailList = await readFile('../output/juejin/hQAuthorDetailList.json');
const hQAuthorList = await readFile('../output/juejin/hQAuthorList.json');
const visitedAuthorUrls = await readFile('../output/juejin/url/visitedAuthorUrls.txt');
const hQFollowerList = await readFile('../output/juejin/hQFollowerList.json');

//------------------- 优质作者榜 -------------------
// --------1、获取优质作者榜分类列表------------------
if (!hQAuthorTabList || isTabUpdate) {
    await page.goto('https://juejin.cn/hot/authors/6809637769959178254')
    await page.waitForLoadState('load');
    await page.waitForSelector('.hot-side-nav', {timeout: 150000});
    await page.waitForTimeout(3000);
    await page.click('span:has-text("优质作者榜")');

    const $ = load(await page.content());
    const authorTabs = $(".vertical .active-nav").next().find("a");
    const linksArray = [];

    authorTabs.each(function () {
        const href = `${baseUrl}${$(this).attr("href")}`,
            text = $(this).text().trim();

        // 将 href 和 text 作为一个对象添加到数组中
        if (href && text) {
            linksArray.push({href: href, text: text});
        }
    });

    writeToFile(JSON.stringify({authorTabs: linksArray}, null, 2), `./output/juejin/hQAuthorTabList.json`).then(() => console.log('hQAuthorTabList.json written successfully'));
}

// --------2、获取优质作者榜作者列表------------------
if (!hQAuthorDetailList || isDetailListUpdate) {
    const authorListArray = [];
    for (const link of JSON.parse(hQAuthorTabList).authorTabs) {
        try {
            await getDetailForTab(link.href).then(async (result) => {
                authorListArray.push(Object.assign(link, {detail: result}));
            })
        } catch (e) {
            console.error(e);
        }
    }
    await writeToFile(JSON.stringify({authorList: authorListArray}, null, 2), `./output/juejin/hQAuthorDetailList.json`)
        .then(() => console.log(`hQAuthorDetailList written successfully`));
    const hQAuthorList = authorListArray.map(item => item.detail.map(author => author.href)).flat();
    writeToFile(JSON.stringify({hQAuthorList}, null, 2), `./output/juejin/hQAuthorList.json`)
        .then(() => console.log('hQAuthorList.json written successfully'));
}


//------------- 3、优质作者榜详情，获取关注着列表 -------------
if (!hQAuthorList || isAuthorListUpdate) {
    const followerListArray = [];
    const startTime = Date.now(); // 开始时间
    const noVisitedAuthorUrls = JSON.parse(hQAuthorList).hQAuthorList.filter(item => !visitedAuthorUrls.includes(item));

    for (const item of SON.parse(hQAuthorList).hQAuthorList) {
        try {
            await getFollowerList(`${item}/followers`).then(async (result) => {
                followerListArray.push({
                    author: item, list: result.sort((a, b) => {
                        return b.level.rankNumber - a.level.rankNumber;
                    })

                });
                writeToFile(`${item}\n`, `./output/juejin/visitedAuthorUrls.txt`, true).then(() => console.log('visitedAuthorUrls.txt written successfully'));
            })
        } catch (e) {
            console.error(`Error getting all follower lis: ${item},Detail reason is: ${e}`);
        }
    }

    await writeToFile(JSON.stringify({followerList: followerListArray}, null, 2), `./output/juejin/hQFollowerList.json`)
        .then(() => console.log(`hQFollowerList written successfully`));

    console.log(`All hQFollowerList cost time taken: ${((Date.now() - startTime) / 1000).toFixed(2)} seconds`);
}

//------------- 函数类型的工具函数 -------------
// 获取分类下的作者列表
async function getDetailForTab(href) {
    return new Promise(async (resolve, reject) => {
        try {
            await page.goto(href);
            await page.waitForLoadState('load');
            await page.waitForSelector('.hot-list .author-item-link', {timeout: 150000});

            // 直接在浏览器环境中获取数据
            const authorListArray = await page.evaluate(({baseUrl}) => {
                const authors = Array.from(document.querySelectorAll('.hot-list .author-item-link'));

                function extractNumber(input) {
                    const match = input.match(/(\d+(?:\.\d+)?)([kK]?|[wW]?)/);
                    if (!match) return 0; // 没有匹配到数字，返回 null

                    const number = parseFloat(match[1]) * (match[2].toLowerCase() === 'k' ? 1000 : match[2].toLowerCase() === 'w' ? 10000 : 1);
                    return Math.round(number); // 返回取整后的数字
                }

                return authors.map(author => ({
                    author: author.querySelector('.name')?.innerText.trim() || 'No Author',
                    rank: author.querySelector('.rank img')?.getAttribute('title') || 'No Rank',
                    avatar: author.querySelector('.author-detail img')?.getAttribute('src') || 'No Avatar',
                    articleCount: {
                        desc: author.querySelector('.author-desc .author-text:nth-child(1)')?.innerText.trim() || 'No Count',
                        number: extractNumber(author.querySelector('.author-desc .author-text:nth-child(1)')?.innerText.trim() || 'No Number')
                    },
                    articleLikeCount: {
                        desc: author.querySelector('.author-desc .author-text:nth-child(2)')?.innerText.trim() || 'No Count',
                        number: extractNumber(author.querySelector('.author-desc .author-text:nth-child(2)')?.innerText.trim() || 'No Number')
                    },
                    articleCollectCount: {
                        desc: author.querySelector('.author-desc .author-text:nth-child(3)')?.innerText.trim() || 'No Count',
                        number: extractNumber(author.querySelector('.author-desc .author-text:nth-child(3)')?.innerText.trim() || 'No Number')
                    },
                    followerCount: {
                        desc: author.querySelector('.author-desc .author-text:nth-child(4)')?.innerText.trim() || 'No Count',
                        number: extractNumber(author.querySelector('.author-desc .author-text:nth-child(4)')?.innerText.trim() || 'No Number')
                    },
                    href: `${baseUrl}${author.getAttribute('href')}` || 'No Href',
                }));
            }, {baseUrl});

            resolve(authorListArray);
        } catch (e) {
            console.error(`Error getting detail for tab: ${href},  Detail reason is: ${e}`);
            reject(e);
        }
    });
}

// 获取关注者列表
async function getFollowerList(href) {
    const functionStartTime = Date.now(); // 函数开始时间
    return new Promise(async (resolve, reject) => {
        try {
            await page.goto(href, {waitUntil: 'load', timeout: 60000});
            await page.waitForLoadState('load');
            await page.waitForSelector('.tag-list', {timeout: 150000});
            let followerList = [];
            console.log(`Start getting follower list for author: ${href}`);
            // 直接在浏览器环境中获取数据
            const followInfo = await page.evaluate(() => {
                const [following, followers] = Array.from(document.querySelectorAll('.follow-block .follow-item .item-count'));

                return {
                    following: Number(following.innerText.replace(/,/g, '')),
                    followers: Number(followers.innerText.replace(/,/g, ''))
                };
            });

            console.log(`following: ${followInfo.following}, followers: ${followInfo.followers}`);

            while (followerList.length < followInfo.followers) {
                await page.waitForSelector('.tag-list', {timeout: 150000});
                followerList = await page.evaluate(({baseUrl}) => {
                    const followers = Array.from(document.querySelectorAll('.tag-list .item'));
                    const extractLevel = (text) => {
                        const match = text.match(/LV\.(\d+)/);
                        return match ? Number(match[1]) : 0;
                    }

                    return followers
                        .map(follower => ({
                            name: follower.querySelector('.name')?.innerText.trim() || 'No Name',
                            avatar: follower.querySelector('.avatar-img')?.getAttribute('src') || 'No Avatar',
                            href: `${baseUrl}${follower.querySelector('.username').getAttribute('href')}` || '',
                            level: {
                                desc: follower.querySelector('.rank img')?.getAttribute('title') || 'No Level',
                                rankNumber: extractLevel(follower.querySelector('.rank img')?.getAttribute('title') || 'No Rank'),
                            },
                        }))
                }, {baseUrl});

                if ((followInfo.followers - followerList.length) / followInfo.followers < 1 / 100) {
                    break;
                }
                await page.mouse.wheel(0, 1200);
                await page.waitForTimeout(1000);
            }

            await page.waitForTimeout(2000);
            resolve(followerList);
        } catch (e) {
            console.error(`Error getting follower list for author: ${href};  Detail reason is: ${e}`);
            reject(e);
        } finally {
            console.log(`This Time taken to get follower list for ${href}: ${((Date.now() - functionStartTime) / 1000).toFixed(2)} seconds`);
        }
    });
}

// --------3、结束------------------
await page.waitForTimeout(10000);
await browser.close();