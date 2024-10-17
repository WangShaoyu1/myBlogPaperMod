import {chromium} from 'playwright'
import {load} from 'cheerio'
import {readFile, writeToFile, extractNumber, readJsonFilesFromFolder, getRandomDelay} from "../util.js"

const baseUrl = 'https://juejin.cn'
const browser = await chromium.launch({headless: false})
const page = await browser.newPage();
const isTabUpdate = false; // 是否更新分类列表
const isDetailListUpdate = false; // 是否更新分类列表下 优质作者列表（不同期数评选的作者是不同的）
const isAuthorFollowerListUpdate = false; // 是否更新 优质作者被关注者列表
const isAuthorFolloweeListUpdate = false // 是否更新 被优质作者关注的作者列表
const isAuthorFollowTeamUpdate = false; // 是否更新 被优质作者关注的团队列表

const hQAuthorTabList = await readFile('../output/juejin/hQAuthorTabList.json');
const hQAuthorDetailList = await readFile('../output/juejin/hQAuthorDetailList.json');
const hQAuthorList = await readFile('../output/juejin/hQAuthorList.json');
const visitedAuthorFollowerUrls = await readFile('../output/juejin/visitedAuthorFollowerUrls.txt');
const visitedAuthorFolloweeUrls = await readFile('../output/juejin/visitedAuthorFolloweeUrls.txt');
const hQFollowList = await readJsonFilesFromFolder('../output/juejin/followers');

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
        const href = `${baseUrl}${$(this).attr("href")}`, text = $(this).text().trim();

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

//------------- 3、优质作者榜详情，获取其关注者列表 -------------
if (!hQAuthorList || isAuthorFollowerListUpdate) {
    const followerListArray = {};
    const startTime = Date.now(); // 开始时间
    const noVisitedAuthorFollowerUrls = JSON.parse(hQAuthorList).hQAuthorList.filter(item => !visitedAuthorFollowerUrls.includes(item));

    for (const item of noVisitedAuthorFollowerUrls) {
        const userNumber = url => url.match(/\/(\d+)/)?.[1] || null
        try {
            await getFollowerOrFolloweeOrFollowTeamList(`${item}/followers`, 'follower').then(async (result) => {
                Object.assign(followerListArray, {
                    author: item, list: result.sort((a, b) => {
                        return b.level.rankNumber - a.level.rankNumber;
                    })

                });
                await writeToFile(`${item}\n`, `./output/juejin/visitedAuthorFollowerUrls.txt`, true).then(() => console.log('visitedAuthorFollowerUrls.txt written successfully'));
                await writeToFile(JSON.stringify({followerList: followerListArray}, null, 2), `./output/juejin/followers/${userNumber(item)}.json`)
                    .then(() => console.log(`hQFollowList written successfully`));
            })
        } catch (e) {
            console.error(`Error getting all follower lis: ${item},Detail reason is: ${e}`);
        }
    }


    console.log(`All hQFollowList cost time taken: ${((Date.now() - startTime) / 1000).toFixed(2)} seconds`);
}

// -------------4、获取被优质作者关注的作者列表-------------
if (!hQAuthorList || isAuthorFolloweeListUpdate) {
    const followeeListArray = {};
    const startTime = Date.now(); // 开始时间
    const noVisitedAuthorFolloweeUrls = JSON.parse(hQAuthorList).hQAuthorList.filter(item => !visitedAuthorFolloweeUrls.includes(item));

    for (const item of noVisitedAuthorFolloweeUrls) {
        const userNumber = url => url.match(/\/(\d+)/)?.[1] || null
        try {
            await getFollowerOrFolloweeOrFollowTeamList(`${item}/following`, 'followee').then(async (result) => {
                Object.assign(followeeListArray, {
                    author: item, list: result.sort((a, b) => {
                        return b.level.rankNumber - a.level.rankNumber;
                    })

                });
                await writeToFile(`${item}\n`, `./output/juejin/visitedAuthorFolloweeUrls.txt`, true).then(() => console.log('visitedAuthorFolloweeUrls.txt written successfully'));
                await writeToFile(JSON.stringify({followeeList: followeeListArray}, null, 2), `./output/juejin/followees/${userNumber(item)}.json`)
                    .then(() => console.log(`hQFolloweeList written successfully`));
            })
        } catch (e) {
            console.error(`Error getting all followee lis: ${item},Detail reason is: ${e}`);
        }
    }

    console.log(`All hQFollowList cost time taken: ${((Date.now() - startTime) / 1000).toFixed(2)} seconds`);

}

// -------------5、获取被优质作者关注的团队列表-------------
if (!hQAuthorList || isAuthorFollowTeamUpdate) {
    const followTeamListArray = {};
    const startTime = Date.now(); // 开始时间

    for (const item of JSON.parse(hQAuthorList).hQAuthorList) {
        const userNumber = url => url.match(/\/(\d+)/)?.[1] || null
        try {
            await getFollowerOrFolloweeOrFollowTeamList(`${item}/following-teams`, 'follow-team').then(async (result) => {
                Object.assign(followTeamListArray, {
                    author: item, list: result.sort((a, b) => {
                        return b.level.rankNumber - a.level.rankNumber;
                    })

                });
                await writeToFile(JSON.stringify({followeeList: followTeamListArray}, null, 2), `./output/juejin/followTeams/${userNumber(item)}.json`)
                    .then(() => console.log(`hQFollowTeamList written successfully`));
            })
        } catch (e) {
            console.error(`Error getting all followTeam list: ${item},Detail reason is: ${e}`);
        }
    }


    console.log(`All hQFollowList cost time taken: ${((Date.now() - startTime) / 1000).toFixed(2)} seconds`);
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
                    rank: author.querySelector('.followerRank img')?.getAttribute('title') || 'No Rank',
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

// 获取关注者列表或者被关注者列表
async function getFollowerOrFolloweeOrFollowTeamList(href, type) {
    const functionStartTime = Date.now(); // 函数开始时间
    return new Promise(async (resolve, reject) => {
        try {
            await page.goto(href, {waitUntil: 'load', timeout: 60000});
            await page.waitForLoadState('load');
            // await page.waitForSelector('.tag-list', {timeout: 1500});
            let followList = [], teamCircleNumber = [];
            console.log(`Start getting ${type} list for author: ${href}`);
            // 直接在浏览器环境中获取数据
            const followInfo = await page.evaluate(() => {
                const [following, followers] = Array.from(document.querySelectorAll('.follow-block .follow-item .item-count'));

                return {
                    following: Number(following.innerText.replace(/,/g, '')),
                    followers: Number(followers.innerText.replace(/,/g, ''))
                };
            });

            //获取不同条件下的循环条件、循环终止条件
            function setWhileCondition() {
                let circleCondition, breakCondition;
                switch (type) {
                    case 'follower':
                        circleCondition = followList.length < followInfo.followers;
                        breakCondition = (followInfo.followers - followList.length < 5) ||
                            ((followInfo.followers - followList.length) / followInfo.followers < 1 / 100) ||
                            (((Date.now() - functionStartTime) / 1000) > 3600 && (followInfo.followers / ((Date.now() - functionStartTime) / 1000) < 8));
                        break;
                    case 'followee':
                        circleCondition = followList.length < followInfo.following;
                        breakCondition = (followInfo.following - followList.length <= 2) ||
                            ((followInfo.following - followList.length) / followInfo.following < 1 / 100)
                        break;
                    case 'follow-team':
                        circleCondition = teamCircleNumber.length <= 3;
                        breakCondition = teamCircleNumber.length >= 3;
                        break;
                }
                return {circleCondition, breakCondition};
            }

            while (setWhileCondition().circleCondition) {
                if (type === 'follow-team') {
                    teamCircleNumber.push(1);
                }
                // await page.waitForSelector('.tag-list', {timeout: 1500});
                followList = await page.evaluate(({baseUrl, type}) => {
                    const followers = Array.from(document.querySelectorAll('.tag-list .item'));
                    const extractLevel = (text) => {
                        const match = text.match(/LV\.(\d+)/);
                        return match ? Number(match[1]) : 0;
                    }

                    return followers
                        .map(follower => {
                            if (type === 'follow-team') {
                                return {
                                    name: follower.querySelector('.title')?.innerText.trim() || 'No Name',
                                    avatar: follower.querySelector('.avatar-img')?.getAttribute('src') || 'No Avatar',
                                    href: `${baseUrl}${follower.querySelector('.link')?.getAttribute('href')}` || '',
                                    level: {
                                        desc: follower.querySelector('.followerRank img')?.getAttribute('title') || 'No Level',
                                        rankNumber: 20,
                                    },
                                }
                            } else {
                                return {
                                    name: follower.querySelector('.name')?.innerText.trim() || 'No Name',
                                    avatar: follower.querySelector('.avatar-img')?.getAttribute('src') || 'No Avatar',
                                    href: `${baseUrl}${follower.querySelector('.username')?.getAttribute('href')}` || '',
                                    level: {
                                        desc: follower.querySelector('.username img')?.getAttribute('title') || 'No Level',
                                        rankNumber: extractLevel(follower.querySelector('.username img')?.getAttribute('title') || 'No Rank'),
                                    },
                                }
                            }
                        })
                }, {baseUrl, type});

                console.log(
                    type === 'follower' ? followInfo.followers : followInfo.following,
                    followList.length,
                    (type === 'follower' ? followInfo.followers : followInfo.following) - followList.length
                );

                if (setWhileCondition().breakCondition) {
                    break;
                }

                await page.mouse.wheel(0, 1200);
                await page.waitForTimeout(1000);
            }

            await page.waitForTimeout(getRandomDelay(2, 12));
            resolve(followList);
        } catch (e) {
            console.error(`Error getting ${type} list for author: ${href};  Detail reason is: ${e}`);
            reject(e);
        } finally {
            console.log(`This Time taken to get ${type} list for ${href}: ${((Date.now() - functionStartTime) / 1000).toFixed(2)} seconds`);
        }
    });
}

// --------3、结束------------------
await page.waitForTimeout(5000);
await browser.close();