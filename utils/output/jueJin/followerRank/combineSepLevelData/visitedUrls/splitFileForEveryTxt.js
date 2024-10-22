import fs from 'fs/promises';
import path from 'path';

const splitUrls = async (inputFiles, urlsPerFile = 100) => {
    for (const [index, file] of inputFiles.entries()) {
        const data = await fs.readFile(file, 'utf8');
        const urls = data.split('\n').filter(Boolean);
        await fs.mkdir(`splitLevelUrl/level_${levelArray[index]}`, {recursive: true});

        for (let i = 0; i < urls.length; i += urlsPerFile) {
            const outputFile = path.join(`splitLevelUrl/level_${levelArray[index]}`, path.basename(file, '.txt') + `_part_${Math.floor(i / urlsPerFile) + 1}.txt`);
            await fs.writeFile(outputFile, urls.slice(i, i + urlsPerFile).join('\n'));
        }
    }
};

const levelArray = [3, 4, 5, 6, 7, 8, 20]
const inputFiles = levelArray.map(elem => `level_${elem}_articleList.txt`);
splitUrls(inputFiles).then(r => console.log("split txt file successful!"));
