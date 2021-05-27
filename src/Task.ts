import fs from 'fs';
import path from 'path';

const CWD = process.env.INIT_CWD;

export class Task{
    id: string;
    group: string;
    title: string;
    description: string;
    patternfilter: string;
    sortid: string;
    lookup: string;
    priority: string;
    actionid: string;
    constructor(copyFrom?: Task, path?: string){
        if(copyFrom) {
            Object.assign(this,copyFrom);
        }else if(path) {
            let temp = JSON.parse(fs.readFileSync(path).toString());
            Object.assign(this,temp);
        }
    }
}

export class TaskManager{
    id: string;
    group: string;
    title: string;
    description: string;
    patternfilter: string;
    sortid: string;
    lookup: string;
    priority: string;
    taskPath: string;
    actionid: string;

    constructor(taskPath: string = path.join(CWD,".avermodule",'task')) {
        this.taskPath = taskPath;
    }

    createTask(opts: {
        id: string;
        title: string;
        description: string;
        group?: string;
        patternfilter?: string;
        sortid?: string;
        lookup?: string;
        priority?: string;
        actionid?: string;
    }): Task{
        let result = new Task();
        result.id = opts.id;
        result.title = opts.title;
        result.description = opts.description;
        result.group = opts.group || this.group;
        result.patternfilter = opts.patternfilter || this.patternfilter;
        result.sortid = opts.sortid || this.sortid;
        result.lookup = opts.lookup || this.lookup;
        result.priority = opts.priority || this.priority;
        result.actionid = opts.actionid || this.actionid;
        fs.writeFileSync(path.join(this.taskPath,result.id), JSON.stringify(result,null,2));
        return result;
    }
}

export default new TaskManager();