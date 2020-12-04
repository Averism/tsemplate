#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function main(mode) {
    switch (mode) {
        //your command line parsing logic here
        default: console.error("[tsemplate error] UNKNOWN MODE:", mode);
    }
    return 0;
}
exports.default = main;
main(process.argv[2]);
