import {CheerioCrawler, PuppeteerCrawler, PlaywrightCrawler, log} from 'crawlee';
import {router} from "./route.js";
import {parseCookies} from '../util.js'

log.setLevel((log.LEVELS.DEBUG))
log.debug('Setting up crawler.');

const cookieString = 'b-user-id=21cc9acf-3a12-9910-5968-c54934dafd7e; JSESSIONID=D1BFC532338B37BEE617B9FE2B30EDF6'
const crawler = new PlaywrightCrawler({
    requestHandler: router,
    maxConcurrency: 10,
    minConcurrency: 10,
    persistCookiesPerSession: true,
    maxRequestsPerCrawl: 10000,
    requestHandlerTimeoutSecs: 150,
    preNavigationHooks: [
        // crawlingContext 有如下属性：id,crawler,log,request,session,enqueueLinks,addRequests,pushData,useState,sendRequest,getKeyValueStore,injectFile,
        // injectJQuery,blockRequests,waitForSelector,parseWithCheerio,infiniteScroll,saveSnapshot,enqueueLinksByClickingElements,
        // compileScript,closeCookieModals,page,browserController,proxyInfo?
        async ({page, request}, gotOptions) => {
            await page.context().addCookies(parseCookies(cookieString))
        }
    ]
})

await crawler.run(['https://wiki.yingzi.com'])