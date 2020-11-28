import fs from 'fs'
import path from 'path'
const cwd: string = process.env.INIT_CWD;
console.log(fs.readFileSync(path.join(cwd,"package.json")).toString());