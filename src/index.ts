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

/* istanbul ignore if */
if(process.argv[1] == path.join(process.cwd(),"src","index.ts"))
    main(process.argv[2]); 