import path from 'path';
import fs from 'fs';
import { TaskManager } from './Task';
import {put, get} from './utils/objUtils'
import {getList} from './utils/dataUtils'

function mkdir(path: string){
    if(!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}

export default async function postinstall(tm: TaskManager){
    const CWD = process.env.INIT_CWD;

    const packageJson = JSON.parse(fs.readFileSync(path.join(CWD,"package.json")).toString());
    if( get(packageJson,'averModule.framework.init') )
        return;

    const ARCHETYPE_REPO_INDEX = get(packageJson, "averModule.framework.archetypeRepoIndex") 
        || "https://devstaticrepo.averism.com/a3/index.json";

    const LICENSE_LIST = JSON.stringify([
        {
            key: "gpl-3.0",
            description: '<a href="https://www.gnu.org/licenses/gpl-3.0.en.html" target="_blank">GNU Public License 3.0   </a>'
        }
    ])

    const AVERMODULE_DIR = path.join(CWD,'.avermodule');
    const TASK_DIR = path.join(AVERMODULE_DIR,'tasks');   

    mkdir(AVERMODULE_DIR);
    mkdir(TASK_DIR);

    tm.group = 'framework initialization';
    tm.priority = 'severe';
    tm.actionid = 'fw_pi_act';

    tm.createTask({
        id: 'fw_pi_id',
        title: 'project name',
        description: "insert the project's name",
        sortid: 'fw_pi_00'
    })

    tm.createTask({
        id: 'fw_pi_lc',
        title: 'project license',
        description: "pick the project's license",
        sortid: 'fw_pi_01',
        lookup: LICENSE_LIST
    })

    tm.createTask({
        id: 'fw_pi_a3',
        title: 'pick an archetype',
        description: 'pick an archetype for the project',
        sortid: 'fw_pi_04',
        lookup: ARCHETYPE_REPO_INDEX
    })

    put(packageJson,'averModule.framework.init', true);
    fs.writeFileSync(path.join(CWD,"package.json"),JSON.stringify(packageJson,null,2));
}