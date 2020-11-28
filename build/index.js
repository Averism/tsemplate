#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
function main(mode) {
    switch (mode) {
        case 'reconfigure':
            require('./module-utils/reconfigure');
            break;
        default: console.error("[tsemplate error] UNKNOWN MODE:", mode);
    }
    return 0;
}
exports.default = main;
/* istanbul ignore if */
if (process.argv[1] == path_1.default.join(process.cwd(), "src", "index.ts"))
    main(process.argv[2]);
