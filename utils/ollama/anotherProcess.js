import {spawn} from 'child_process';

const models = ['qwen2:0.5b', 'nomic-embed-text:v1.5', 'bge-large:335m', 'all-minilm:22m', 'all-minilm:33m']

function download(modelName) {
    return new Promise((resolve, reject) => {

        // const process = spawn('powershell.exe', ['/c', `ollama pull ${modelName}`], {
        //     stdio: 'pipe',
        //     shell: true,
        // });
        const process = spawn('ollama', ['pull', modelName], {
            stdio: 'inherit', // 继承父进程的控制台，避免错误
            shell: false, // 不使用 shell
        });
        if (process.stdout) {
            process.stdout.on('data', (data) => {
                const output = data.toString();
                console.log(`stdout:${output}`);  // 打印实时输出
                // 假设有进度信息可以提取，更新进度条
                if (output.includes('pulling')) {  // 替换为实际的进度标识
                    console.log('pulling');
                }

                if (output.includes('success')) {
                    resolve(`${modelName} 下载成功`);
                }
            });
        }
        // 监听标准错误输出
        if (process.stderr) {
            // 监听标准错误输出
            process.stderr.on('data', (data) => {
                // reject(`下载失败了，原因是：${data.toString()}`);
                resolve(`${modelName} 下载成功,并打印日志：${data.toString()}`);
            });
        }

        // 监听进程结束事件
        process.on('exit', (code) => {
            if (code !== 0) {
                reject(`程结束事件非零，代码: ${code}`);
            } else {
                resolve(`程结束事件，下载成功，代码: ${code}`);
            }
        });
    })
}

async function downloadAll(models) {
    for (const model of models) {
        try {
            const result = await download(model);
            console.log(`下载成功：${result}`);
        } catch (e) {
            console.error(`error: ${e}`);
        }
    }
}

if (false) {
    downloadAll(models.slice(0, 2)).then(() => {
        console.log('全部下载完成');
    });
}

function getOllamaList() {
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
            // console.log(`ollama list 事件非零，代码: ${code}`);
        } else {
            const pattern = /^[a-zA-Z0-9\-]+:[^\s]+/gm;
            const nameList = output.match(pattern) || [];
            console.log(`nameList:${nameList.length}`);  // 打印实时输出
            console.log(`ollama list 程结束事件，下载成功，代码: ${code}`);
        }
    });
}

getOllamaList()