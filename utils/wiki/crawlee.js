import {CheerioCrawler, PuppeteerCrawler, PlaywrightCrawler, log} from 'crawlee';
import {router} from "./route.js";
import {parseCookies} from '../util.js'

log.setLevel((log.LEVELS.DEBUG))
log.debug('Setting up crawler.');

const cookieString = 'b-user-id=21cc9acf-3a12-9910-5968-c54934dafd7e; JSESSIONID=DAEC8B29F5D847DA399AD57B6B884823'
const crawler = new PlaywrightCrawler({
    requestHandler: router,
    maxConcurrency: 2,
    minConcurrency: 1,
    persistCookiesPerSession: true,
    preNavigationHooks: [
        // crawlingContext 有如下属性：id,crawler,log,request,session,enqueueLinks,addRequests,pushData,useState,sendRequest,getKeyValueStore,injectFile,
        // injectJQuery,blockRequests,waitForSelector,parseWithCheerio,infiniteScroll,saveSnapshot,enqueueLinksByClickingElements,
        // compileScript,closeCookieModals,page,browserController,proxyInfo?
        async ({page, request}, gotOptions) => {
            await page.context().addCookies(parseCookies(cookieString))
        }
    ]
})

await crawler.run(['https://wiki.yingzi.com/pages/viewpage.action?pageId=91135086'])