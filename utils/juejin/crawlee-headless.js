import {chromium} from 'playwright'
import {load} from 'cheerio'
import {writeToFile,} from "../util.js"

const baseUrl = 'https://juejin.cn'
const browser = await chromium.launch({headless: false})
const page = await browser.newPage();

await page.goto('https://juejin.cn')
let circleTime = 0, itemHeight = 1200;


while (circleTime < 5) {
    await page.mouse.wheel(0, itemHeight * 3);
    await page.waitForTimeout(3000);
    circleTime++;
}

const $ = load(await page.content());

const urls = Array.from($('.entry-list .title-row a')).map(a => `${baseUrl}${a.attribs.href}`);

writeToFile(JSON.stringify({urls}, null, 2), `./output/juejin/url/pageUrls.json`).then(() => console.log('pageUrls.json written successfully'));

await page.waitForTimeout(10000);
await browser.close();