import express from 'express'
import exec from 'child_process'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config();

let app = express();
const URL = 'http://localhost:8412';
const rootDir = path.join(__dirname,'..');

app.get('/', (req, res) => {
    let str = fs.readFileSync(path.join(rootDir,'assets','index.html')).toString();
    res.send(str)
  })
  
app.listen(8412, () => {
    if(process.env.BROWSER) 
        console.log(exec.execSync(`${process.env.BROWSER} "${URL}"`).toString());
    else
        console.log("please open the dashboard at http://localhost:8412")
})