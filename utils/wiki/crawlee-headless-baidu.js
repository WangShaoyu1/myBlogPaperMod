import {chromium} from 'playwright'
import * as cheerio from 'cheerio'

const repositories = []
const BASE_URL = 'https://baidu.com'
const REPOSITORIES_URL = `${BASE_URL}/repositories`

const browser = await chromium.launch({headless: false})
const page = await browser.newPage();

await page.goto('https://www.baidu.com')

await page.type('input[name="wd"]', 'Playwright');
// 点击"搜索"按钮
await page.keyboard.press('Enter');
await page.waitForLoadState('load');
await page.waitForTimeout(10000);

// 点击左边菜单栏
await page.click('button:has-text("Accept all")');
await browser.close();