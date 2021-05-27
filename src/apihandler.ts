import fs from 'fs'
import path from 'path'
import { Task } from './Task';

const CWD = process.env.INIT_CWD;
const TASK_PATH = path.join(CWD,'.avermodule','tasks');
const packageJson:any = JSON.parse(fs.readFileSync(path.join(CWD,"package.json")).toString());

type handlerf = (query: any, body: any)=>Promise<string>;

async function getTitle (query: any, body: any):Promise<string>{
    return packageJson.name.toString();
}

async function getTasks (query: any, body: any):Promise<string>{
    let tasks: string[] = fs.readdirSync(TASK_PATH);
    let res: Task[] = [];
    for(let taskFile of tasks) {
        res.push(new Task(undefined, path.join(TASK_PATH, taskFile)))
    }
    return JSON.stringify(res,null,2);
}

const handler: {[key:string]: handlerf} = {
    getTitle, getTasks
}


export default handler;