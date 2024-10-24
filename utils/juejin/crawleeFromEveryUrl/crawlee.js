import {CheerioCrawler, PuppeteerCrawler, PlaywrightCrawler, log} from 'crawlee';
import {router} from "./route.js";

log.setLevel((log.LEVELS.DEBUG))
log.debug('Setting up crawler.');

const crawler = new PlaywrightCrawler({
    requestHandler: router,
    maxRequestsPerCrawl: Infinity,
    requestHandlerTimeoutSecs: 200,
    autoscaledPoolOptions: {
        maxConcurrency: 3,
        minConcurrency: 1,
        desiredConcurrencyRatio: 0.9,  // 保持接近目标并发数
        scaleUpStepRatio: 0.15,        // 并发增加步长
        scaleDownStepRatio: 0.15,      // 并发减少步长
        autoscaleIntervalSecs: 5       // 自动缩放的时间间隔
    }
})

await crawler.run(['https://juejin.cn'])