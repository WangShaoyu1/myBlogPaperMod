import * as readline from "node:readline";
// 创建接口
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 提问并获取输入
rl.question('请输入内容: ', (input) => {
    console.log(`你输入的内容是: ${input}`);

    // 关闭接口
    rl.close();
});
