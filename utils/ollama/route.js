import {createPlaywrightRouter, Dataset} from 'crawlee';
import {writeToFile, removeSpaces, convertToMb, getRandomDelay, readJsonFilesFromFolder} from "../util.js"
import {spawn, exec} from 'child_process';

export const router = createPlaywrightRouter()
let alarmIndex = 0, alarmIndexMax = 0, startFirstTime = 0, endLastTime = 0;

router.addHandler('DETAIL', async ({page, request, enqueueLinks, log}) => {
    log.debug(`Visiting detail page: ${request.url}`);
    const modelNameFromUrl = request.url.split('/').pop();
    let startTime = Date.now(), endTime;

    // 记录第一个开始时间
    if (alarmIndex === 0) {
        startFirstTime = Date.now();
    }

    log.info(`modelNameFromUrl: ${modelNameFromUrl}`);

    try {
        await page.waitForSelector('html', {timeout: 60000});
        await page.waitForSelector('#command-input', {timeout: 60000});
        // 并发获取页面元素的内容,唯一元素用textContent,多个元素用allTextContents;取得某一个元素用first(0),nth(index)等,allTextContents()返回数组
        const [modelName_p, modelName_s, modelSize_p, modelSize_s, commandInput] =
            await Promise.all([
                page.locator("#primary-tags .truncate").allTextContents().then(removeSpaces),
                page.locator("#secondary-tags .truncate").allTextContents().then(removeSpaces),
                page.locator("#primary-tags .text-neutral-400").allTextContents().then(removeSpaces).then(convertToMb),
                page.locator("#secondary-tags .text-neutral-400").allTextContents().then(removeSpaces).then(convertToMb),
                page.inputValue("#command-input")
            ]);

        const modelNames = modelName_p.concat(modelName_s);
        const modelSize = modelSize_p.concat(modelSize_s);

        //获取执行命令，有的是run,有的是pull
        const commandStrMatch = commandInput.match(/ollama\s+(\w+)/);
        // const commandStr = commandStrMatch ? commandStrMatch[1] : 'run'
        const commandStr = 'pull';// pull 也有下载功能，但之后不运行直接结束；run 会下载并运行模型,导致后面不好控制下一个下载进程
        log.error(`commandInput: ${commandInput}, commandStr: ${commandStr}`);
        const results = modelNames.map((modelName, index) => {
            return {
                modelName: `${modelNameFromUrl}:${modelName}`,
                modelSize: modelSize[index][0],
                modelSizeInMb: modelSize[index][1],
            }
        });
        await Dataset.pushData({[modelNameFromUrl]: results});

        const writeToFileContent = `------------------- ${modelNameFromUrl} ----------------------------\n` + `${modelNames.map((item, index) => {
            return `${modelNameFromUrl}:${item}      ${modelSize[index][1]}\n`
        }).join('')}`;

        // 并行写入 markdown 文件和已爬取的链接
        await writeToFile(writeToFileContent, './output/ollama/result.txt', true)

        if (alarmIndex++ === alarmIndexMax - 1) {
            // 记录最后一个结束时间
            endLastTime = Date.now();
            console.log(`所有爬取数据共花费的时间为：${(endLastTime - startFirstTime) / 1000}秒`);
            let allModelsList = await readJsonFilesFromFolder('./storage/datasets/default');
            let handledModelsList = allModelsList.map((item) => Object.values(item)[0]).flat();

            // 并发下载模型
            downAllModel(handledModelsList, {minSize: 1000, maxSize: 3000, commandStr});
        }
    } catch (error) {
        log.error(`Error processing detail page: ${error}`);
    }
    endTime = Date.now();
    console.log(`本次爬取数据花费时间为：${(endTime - startTime) / 1000}秒`);
})

router.addDefaultHandler(async ({request, page, enqueueLinks, log}) => {
    log.debug(`Enqueueing start from page: ${request.url}`);
    // This means we're on the start page, with no label.
    // On this page, we just want to enqueue all the category pages.

    await page.waitForSelector('#repo', {timeout: 60000});
    // elements需要筛选掉Archive的模型，不再维护也不提供下载服务
    const elements = (await page.locator('#repo li a').filter({
        hasNotText: /archive/i
    }));
    const count = await elements.count();
    const selectModel = ['all']; // all代表所有模型，也可以指定模型名称，例如['qwen2', 'gemma2']

    for (let i = 0; i < count; i++) {
        const href = await elements.nth(i).getAttribute('href');
        const modelName = href.split('/').pop();

        if (selectModel.includes(modelName)) {
            alarmIndexMax++;
            await enqueueLinks({
                urls: [href], label: 'DETAIL'
            });
        }

        if (selectModel.includes('all')) {
            alarmIndexMax++;
            await enqueueLinks({
                urls: [href], label: 'DETAIL'
            });
        }
    }
});

export function downAllModel(modelList, options) {
    const defaultOptions = {commandStr: 'run', minSize: 0, maxSize: 500}
    options = Object.assign(defaultOptions, options);

    // 工具函数，筛选出小于 options.maxSize 的模型;并且过滤掉已下载的模型;并且过滤掉相同大小的模型(量下载下不动了，耗时太多。每个模型的最后10%耗时太久)
    function filterModels(models) {
        return getOllamaList().then((nameList) => {
            return models.filter(model => model.modelSize <= options.maxSize && model.modelSize >= options.minSize)
                .filter(item => !nameList.includes(item.modelName))
                .sort((a, b) => a.modelSize - b.modelSize)
                .filter((item, index, self) => index === self.findIndex(t => t.modelSize === item.modelSize));
        });
    }

    // 获取已下载模型列表，下载过了就不用再下载了
    function getOllamaList() {
        return new Promise((resolve, reject) => {
            const process = spawn('ollama', ['list'], {
                stdio: 'pipe', // 继承父进程的控制台，避免错误
                shell: false, // 不使用 shell
            });
            let output = ''; // 用于存储输出

            if (process.stdout) {
                process.stdout.on('data', (data) => {
                    output += data.toString();
                });
            }

            // 监听进程结束事件
            process.on('exit', (code) => {
                if (code !== 0) {
                    reject(`ollama list 进程结束事件非零，代码: ${code}`);
                } else {
                    const pattern = /^[a-zA-Z0-9\-]+:[^\s]+/gm;
                    const nameList = output.match(pattern) || [];
                    console.log(`列表中已下载了${nameList.length}个模型`);
                    resolve(nameList);
                }
            });
        })
    }

    // 执行下载命令
    function downloadModel(model, retries = 5) {
        return new Promise((resolve, reject) => {
            console.log(`开始下载模型: ${model.modelName}, 大小: ${model.modelSize}Mb`);
            const startTime = Date.now();  // 记录开始时间

            // 在新的 CMD 控制台中执行命令，通过spawn，执行 ollama 下载指令
            const process = spawn('ollama', [options.commandStr, model.modelName], {
                stdio: 'inherit',
                shell: false,
            });

            // 监听进程结束事件
            process.on('exit', (code) => {
                if (code !== 0) {
                    console.error(`模型 ${model.modelName} 下载失败，退出代码为: ${code}`);
                    if (retries > 0) {
                        console.log(`重试中... 剩余次数: ${retries}`);
                        // downloadModel(model, retries - 1).then(resolve).catch(reject);
                        return resolve(downloadModel(model, retries - 1));
                    } else {
                        reject(`模型 ${model.modelName} 下载失败，已达到最大重试次数`);
                    }
                } else {
                    console.log(`模型 ${model.modelName} 下载进程，退出代码为: ${code}。下载耗时: ${((Date.now() - startTime) / 1000).toFixed(2)} 秒`);
                    setTimeout(() => {
                        resolve(`模型 ${model.modelName} 下载成功`);
                    }, 3000);
                }
            });
        });
    }

    // 顺序下载模型
    async function downloadModelsSequentially(models) {
        const filteredModels = await filterModels(models);
        const startTime = Date.now();  // 记录总开始时间

        await writeToFile(JSON.stringify(filteredModels, null, 2), './output/ollama/filteredModels.txt', false).then(results => {
            console.log(`共筛选出${filteredModels.length}个模型`);
        });
        await writeToFile(JSON.stringify(models, null, 2), './output/ollama/models.txt', false).then(results => {
            console.log(`原始共有${models.length}个模型`);
        });

        for (const model of filteredModels) {
            try {
                await downloadModel(model);
            } catch (error) {
                console.error(`模型 ${model.modelName} 下载出错: ${error}`);
                // 你可以在这里决定是否继续或中断整个下载流程
            }
        }
        const endTime = Date.now();  // 记录总结束时间
        console.log(`所有模型下载完成，总耗时: ${((endTime - startTime) / 1000).toFixed(2)} 秒`);
    }

    // 开始执行下载任务
    downloadModelsSequentially(modelList).then(() => {
        console.log('所有模型下载完成');
    });
}