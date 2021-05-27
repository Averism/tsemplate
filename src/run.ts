import express from 'express'
import exec from 'child_process'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import postinstall from './postinstall'
import { TaskManager } from './Task'
import {URL} from 'url'
import handler from './apihandler'

export async function run(){
    dotenv.config();


    let app = express();
    app.use(express.json());
    const INDEX_URL = 'http://localhost:8412';
    const moduleDir = path.join(__dirname,'..');
    const CWD = process.env.INIT_CWD;

    let tm: TaskManager = new TaskManager(path.join(CWD,'.avermodule','tasks'));

    await postinstall(tm);

    app.get('*', (req, res) => {
        res.setHeader("Cache-Control", "no-cache");
        if(req.url=='/') {
            let str = fs.readFileSync(path.join(moduleDir,'assets','index.html')).toString();
            res.send(str)
        } else if (req.url.startsWith('/api/')) {
            let url = new URL("http://"+req.url);
            let pth = url.pathname;
            handler[pth.substr(1)](req.query, req.body).then(x=>res.send(x));
        } else if (req.url == "/favicon.ico") {1
            res.send("");
        } else {
            let str = fs.readFileSync(path.join(moduleDir,'assets',req.url)).toString();
            res.send(str)
        }
    })

    app.post('*', (req, res) => {
        res.setHeader("Cache-Control", "no-cache");
        if (req.url.startsWith('/api/')) {
            let url = new URL("http://"+req.url);
            let pth = url.pathname;
            let fn = req.url.substr(4);
            res.send("");
        } else {
            let str = fs.readFileSync(path.join(moduleDir,'assets',req.url)).toString();
            res.send(str)
        }
    })
    
    app.listen(8412, () => {
        if(process.env.BROWSER) 
            console.log(exec.execSync(`${process.env.BROWSER} "${INDEX_URL}"`).toString());
        else
            console.log("please open the dashboard at "+INDEX_URL)
    });
}