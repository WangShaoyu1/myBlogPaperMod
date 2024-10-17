import {writeToFile, readFile} from "../../../util.js"
import path from 'path';
import {fileURLToPath} from 'url';
// 获取当前模块文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const minLevel = 1, maxLevel = 8;
for (let i = minLevel; i <= maxLevel; i++) {
    await combineGteDataForLevel(i);
}

async function combineGteDataForLevel(level) {
    let allFollowerList = await readFile(`./gte_${level}_followers.json`);
    let allFolloweeList = await readFile(`./gte_${level}_followees.json`);
    let allFollowTeamList = await readFile(`./gte_${level}_followTeam.json`);

    return new Promise(async (resolve, reject) => {
        let handledModelsList = [allFollowerList, allFolloweeList, allFollowTeamList]
            .map((item) => JSON.parse(item)['followers'])
            .flat()
            .sort((a, b) => {
                return b.level.rankNumber - a.level.rankNumber;
            })
            .filter((item, index, self) => index === self.findIndex(t => t.href === item.href))
            .map(elem => Object.assign({id: elem.href.match(/\d+/)[0]}, elem));

        await writeToFile(JSON.stringify({allData: handledModelsList}, null, 2),
            path.resolve(__dirname, `./combineGteData/gte_${level}_combine_data.json`))
            .then(() => {
                console.log(`gte_${level}_combine_data.json written successfully`)
                resolve()
            });
    })
}


