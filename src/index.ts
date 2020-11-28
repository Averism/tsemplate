#!/usr/bin/env node

import path from "path"
import { __String } from "typescript";

export default function main(mode: string):number{
    switch(mode){
        case 'reconfigure': require('./module-utils/reconfigure'); break;
        default: console.error("[tsemplate error] UNKNOWN MODE:",mode)
    }
    return 0;
}

main(process.argv[2]); 