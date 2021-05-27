import fetch, { Response } from 'node-fetch';
import fs from 'fs';
import {join} from 'path';

const CWD = process.env.INIT_CWD;

async function getFromHttp(uri: string): Promise<string> {
    return await fetch(uri).then((res: Response)=>res.text());
}

async function getFromFile(uri: string): Promise<string> {
    let path = uri.substr(7);
    if(path.startsWith("pwd/")) path = join(CWD,path)
    else path = join('/',path)
    return fs.readFileSync(path).toString();
}

export async function getList(uri: string):Promise<string> {
    return await (uri.startsWith("file://")?getFromFile(uri):getFromHttp(uri));
}