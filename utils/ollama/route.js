import {createPlaywrightRouter, Dataset} from 'crawlee';
import {writeToFile, removeSpaces, convertToMb, getRandomDelay, readJsonFilesFromFolder} from "../util.js"
import {spawn, exec} from 'child_process';
import ProgressBar from 'progress';

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
        const commandStr = commandStrMatch ? commandStrMatch[1] : 'run'
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
            downAllModel(handledModelsList, {minSize: 500, maxSize: 600, commandStr});
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

    // 工具函数，筛选出小于 options.maxSize 的模型
    function filterModels(models) {
        return models.filter(model => {
            return model.modelSize <= options.maxSize && model.modelSize >= options.minSize;
        });
    }

    // 创建进度条
    function createProgressBar(total) {
        return new ProgressBar('正在下载模型 [:bar] :current/:total :percent', {
            total: total, width: 40, complete: '=', incomplete: ' ', renderThrottle: 16, clear: false
        });
    }

    // 执行下载命令
    function downloadModel(model, progressBar) {
        return new Promise((resolve, reject) => {
            console.log(`开始下载模型: ${model.modelName}, 大小: ${model.modelSize}Mb`);
            const startTime = Date.now();  // 记录开始时间

            // 在新的 CMD 控制台中执行命令，通过spawn，执行 ollama 下载指令
            const process = spawn('cmd.exe', ['/c', 'start', 'ollama', options.commandStr, model.modelName], {
                stdio: 'inherit',
                shell: true,
                detached: true,
            });
            // 设置超时时间
            const timeoutDuration = 9000; // 超时时间（毫秒）
            let timeout;
            // 创建重置超时函数
            const resetTimeout = () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    console.log('未收到输入，关闭子进程。。。');
                    process.kill();// 关闭子进程
                }, timeoutDuration);
            };
            // 初始化超时
            resetTimeout();
            // 监听标准输入，重置超时
            if (process.stdin) {
                process.stdin.on('data', resetTimeout);
            }
            // 监听标准输出，查找成功标识
            if (process.stdout) {
                process.stdout.on('data', (data) => {
                    const output = data.toString();
                    console.log(output);  // 打印实时输出
                    // 假设有进度信息可以提取，更新进度条
                    if (output.includes('pulling')) {  // 替换为实际的进度标识
                        progressBar.tick();  // 更新进度条
                    }

                    if (output.includes('success')) {
                        const endTime = Date.now();  // 记录结束时间
                        const timeTaken = ((endTime - startTime) / 1000).toFixed(2);  // 计算下载耗时
                        console.log(`模型 ${model.modelName} 下载成功，耗时: ${timeTaken} 秒`);

                        // 下载成功后，结束当前 Promise，更新timeout
                        clearTimeout(timeout);
                        setTimeout(() => {
                            resolve();
                        }, 1000)
                    }
                });
            }
            // 监听标准错误输出
            if (process.stderr) {
                // 监听标准错误输出
                process.stderr.on('data', (data) => {
                    console.error(`执行下载命令：ollama ${options.commandStr} ${model.modelName}下载失败:`, data.toString());
                    // 下载失败时，结束当前 Promise 并抛出错误，更新timeout
                    clearTimeout(timeout);
                    setTimeout(() => {
                        reject(data.toString());
                    }, 1000)
                });
            }

            // 监听进程结束事件
            process.on('exit', (code) => {
                if (code !== 0) {
                    reject(`模型 ${model.modelName} 下载进程异常退出，代码: ${code}`);
                } else {
                    console.log(`模型 ${model.modelName} 之前已经下载成功，cmd控制台正常退出，代码: ${code}`);
                    setTimeout(() => {
                        resolve();
                    }, 1000)
                }
            });
        });
    }

    // 顺序下载模型
    async function downloadModelsSequentially(models) {
        const filteredModels = filterModels(models);
        const progressBar = createProgressBar(filteredModels.length);
        const startTime = Date.now();  // 记录总开始时间

        await writeToFile(JSON.stringify(filteredModels, null, 2), './output/ollama/filteredModels.txt', false).then(results => {
            console.log(`共筛选出${filteredModels.length}个模型`);
        });
        await writeToFile(JSON.stringify(models, null, 2), './output/ollama/models.txt', false).then(results => {
            console.log(`原始共有${models.length}个模型`);
        });

        for (const model of filteredModels) {
            try {
                await downloadModel(model, progressBar);
            } catch (error) {
                console.error(`模型 ${model.modelName} 下载出错: ${error}`);
                // 你可以在这里决定是否继续或中断整个下载流程
            }
        }
        const endTime = Date.now();  // 记录总结束时间
        const totalTime = ((endTime - startTime) / 1000).toFixed(2);  // 计算总耗时
        console.log(`所有模型下载完成，总耗时: ${totalTime} 秒`);
    }

    // 开始执行下载任务
    downloadModelsSequentially(modelList).then(() => {
        console.log('所有模型下载完成');
    });
}