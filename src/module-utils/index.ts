#!/usr/bin/env node

export default function main(mode: string):number{
    switch(mode){
        //your command line parsing logic here
        default: console.error("[tsemplate error] UNKNOWN MODE:",mode)
    }
    return 0;
}

main(process.argv[2]); 