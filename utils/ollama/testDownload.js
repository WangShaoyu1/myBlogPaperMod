import {downAllModel} from './route.js'
import {readJsonFilesFromFolder} from '../util.js'

let allModelsList = await readJsonFilesFromFolder('./storage/datasets/default_copy');
let handledModelsList = allModelsList.map((item) => Object.values(item)[0]).flat();

downAllModel(handledModelsList, {minSize: 6000, maxSize: 10000, commandStr: 'pull'});