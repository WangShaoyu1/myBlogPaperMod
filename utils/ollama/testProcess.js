import {spawn} from 'child_process';

const process = spawn('cmd.exe', ['/c', '/wait', 'node', 'anotherProcess.js'], {
    stdio: 'inherit',
});

const timeout = setTimeout(() => {
    console.log('未收到输入，关闭子进程...');
    process.kill(); // 关闭子进程
}, 10000); // 10秒后

new Promise((resolve, reject) => {
    if (process.stdin) {
        process.stdin.on('data', data => {
            const output = data.toString();
            console.log(`stdin:${output}`);  // 打印实时输出
        });
    }
    // 监听标准输出，查找成功标识
    if (process.stdout) {
        process.stdout.on('data', (data) => {
            const output = data.toString();
            console.log(`stdout:${output}`);  // 打印实时输出

            // 检查是否包含成功标志
            if (output.includes('success')) {
                console.log('下载成功，子进程将进入输入模式...');

                // 清除超时
                clearTimeout(timeout);

                // 不再提示输入，子进程将处理输入
            }
            setTimeout(() => {
                resolve();
            });
        });
    }
    // 监听标准错误输出
    if (process.stderr) {
        // 监听标准错误输出
        process.stderr.on('data', (data) => {
            const output = data.toString();
            console.log(`stdout:${output}`);  // 打印实时输出
        });
    }

    // 监听进程结束事件
    process.on('exit', (code) => {
        if (code !== 0) {
            console.log(`code-error:${code}`);  // 打印实时输出
        } else {
            console.log(`code-correct:${code}`);  // 打印实时输出
        }
    });
})