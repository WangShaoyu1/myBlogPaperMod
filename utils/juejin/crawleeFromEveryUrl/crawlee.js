import {CheerioCrawler, PuppeteerCrawler, PlaywrightCrawler, log} from 'crawlee';
import {router} from "./route.js";

log.setLevel((log.LEVELS.DEBUG))
log.debug('Setting up crawler.');

const crawler = new PlaywrightCrawler({
    requestHandler: router,
    maxConcurrency: 20,
    minConcurrency: 2,
    maxRequestsPerCrawl: Infinity,
    requestHandlerTimeoutSecs: 200,
})

await crawler.run(['https://juejin.cn'])