import {spawn} from 'child_process';

const process = spawn('cmd.exe', ['/c', 'start', 'node', 'anotherProcess.js'], {
    detached: true,
    stdio: 'inherit',
    shell: true
});


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