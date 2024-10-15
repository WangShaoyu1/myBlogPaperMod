import {writeToFile, readJsonFilesFromFolder} from "../../../util.js"

let allModelsList = await readJsonFilesFromFolder('../followees');
const minLevel = 1, maxLevel = 8;
for (let i = minLevel; i <= maxLevel; i++) {
    await storeDifLevelDate(i);
}

async function storeDifLevelDate(level) {
    return new Promise(async (resolve, reject) => {
        let handledModelsList = allModelsList
            .map((item) => Object.values(item)[0]['list'])
            .flat()
            .sort((a, b) => {
                return b.level.rankNumber - a.level.rankNumber;
            })
            .filter((item) => item.level.rankNumber >= level)

        await writeToFile(JSON.stringify({followers: handledModelsList}, null, 2), `./output/juejin/followerRank/gte_${level}_followees.json`)
            .then(() => {
                console.log(`gte_${level}_followees.json written successfully`)
                resolve();
            });
    })
}


