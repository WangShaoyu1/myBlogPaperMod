import {chromium} from 'playwright'

const browser = await chromium.launch({headless: false})
const page = await browser.newPage();

await page.goto('https://wiki.yingzi.com/pages/viewpage.action?pageId=91135086')

// 输入账号、密码
await page.type('input[id="os_username"]', 'wangyu');
await page.type('input[id="os_password"]', '135875ww#');

// 点击"登录"按钮
await page.keyboard.press('Enter');
await page.waitForLoadState('load');
await page.waitForTimeout(10000);

// 点击左边菜单栏
await page.click('button:has-text("Accept all")');
await browser.close();