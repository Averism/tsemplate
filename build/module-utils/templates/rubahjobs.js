"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readme = exports.index = exports.packagejson = void 0;
exports.packagejson = {
    "command": "load_json",
    "location": "package.json"
};
exports.index = {
    "command": "line_read",
    "location": "src/index.ts"
};
exports.readme = {
    "command": "line_write",
    "location": "readme.md",
    "commentStyle": "html",
    "dependson": ["package", "index"]
};
