import {chromium} from 'playwright'
import {load} from 'cheerio'
import {writeToFile,} from "../util.js"

const baseUrl = 'https://wiki.yingzi.com'
const browser = await chromium.launch({headless: false})
const page = await browser.newPage();

await page.goto('https://wiki.yingzi.com/spaces/exportspacehtml.action?key=VDP')

// 输入账号、密码
await page.type('input[id="os_username"]', 'wangyu');
await page.type('input[id="os_password"]', '135875ww#');

// 点击"登录"按钮
await page.keyboard.press('Enter');
await page.waitForLoadState('load');


// 点击"自定义导出"按钮
await page.click('label:has-text("自定义导出")');
await page.waitForTimeout(3000);
const $ = load(await page.content());

const urls = Array.from($('.tree-container label a')).map(a => `${baseUrl}${a.attribs.href}`);

writeToFile(JSON.stringify({urls}, null, 2), `./output/wiki/url/pageUrls.json`).then(() => console.log('pageUrls.json written successfully'));

await page.waitForTimeout(100000);
await browser.close();