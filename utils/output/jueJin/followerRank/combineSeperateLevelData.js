import {writeToFile, readFile} from "../../../util.js"
import path from 'path';
import {fileURLToPath} from 'url';
// 获取当前模块文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const constant = 1;
const allFollowerList = await readFile(`./gte_${constant}_followers.json`);
const allFolloweeList = await readFile(`./gte_${constant}_followees.json`);
const allFollowTeamList = await readFile(`./gte_${constant}_followTeam.json`);
const minLevel = 1, maxLevel = 8, teamLevel = 20;

for (const i of [...Array.from({length: maxLevel - minLevel + 1}, (v, k) => k + minLevel), teamLevel]) {
    await combineDataForEachLevel(i);
}

async function combineDataForEachLevel(level) {
    return new Promise(async (resolve, reject) => {
        let handledModelsList = [allFollowerList, allFolloweeList, allFollowTeamList]
            .map((item) => JSON.parse(item)['followers'])
            .flat()
            .sort((a, b) => {
                return b.level.rankNumber - a.level.rankNumber;
            })
            .filter((item, index, self) => index === self.findIndex(t => t.href === item.href))
            .map(elem => Object.assign({id: elem.href.match(/\d+/)[0]}, elem))
            .filter((item) => item.level.rankNumber === level)

        await writeToFile(JSON.stringify({allData: handledModelsList}, null, 2),
            path.resolve(__dirname, `./combineSepLevelData/${level}_combine_data.json`))
            .then(() => {
                console.log(`${level}_combine_data.json written successfully`)
                resolve()
            });
    })
}


