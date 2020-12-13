"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const tsconfig_1 = require("./templates/tsconfig");
const cwd = process.env.INIT_CWD;
//SETTING UP package.json
let packageJson = JSON.parse(fs_1.default.readFileSync(path_1.default.join(cwd, "package.json")).toString());
if (!packageJson.averModule)
    packageJson.averModule = {};
if (!packageJson.averModule.tsemplate) {
    packageJson.averModule.tsemplate = {
        reconfigure: "tsemplate reconfigure",
        priority: 0,
        firstrun: true
    };
}
if (!packageJson.devDependencies)
    packageJson.devDependencies = {};
packageJson.devDependencies["@types/mocha"] = "^8.0.3";
packageJson.devDependencies["mocha"] = "^8.0.3";
packageJson.devDependencies["nyc"] = "^15.1.0";
packageJson.devDependencies["rubah"] = "github:averism/rubah";
packageJson.scripts.test = "mocha";
packageJson.scripts.cov = "nyc mocha";
if (!packageJson.nyc)
    packageJson.nyc = {
        "require": [
            "ts-node/register"
        ],
        "extension": [
            ".ts"
        ],
        "reporter": [
            "text",
            "html"
        ],
        "excludeNodeModules": true,
        "instrument": true,
        "sourceMap": true,
        "produce-source-map": true
    };
//initializing source folder
if (!fs_1.default.existsSync(path_1.default.join(cwd, "src")))
    fs_1.default.mkdirSync(path_1.default.join(cwd, "src"));
if (!fs_1.default.existsSync(path_1.default.join(cwd, "src", "index.ts")))
    fs_1.default.copyFileSync(path_1.default.join("src", "module-utils", "templates", "index.ts"), path_1.default.join(cwd, "src", "index.ts"));
packageJson.scripts.rubah = "rubah generate";
packageJson.scripts.start = "rubah generate && node -r ts-node/register src/index.ts";
//initializing test folder
if (!fs_1.default.existsSync(path_1.default.join(cwd, "test")))
    fs_1.default.mkdirSync(path_1.default.join(cwd, "test"));
fs_1.default.writeFileSync(path_1.default.join(cwd, "package.json"), JSON.stringify(packageJson, null, 2));
if (!fs_1.default.existsSync(path_1.default.join(cwd, "tsconfig.json")))
    fs_1.default.writeFileSync(path_1.default.join(cwd, "tsconfig.json"), JSON.stringify(tsconfig_1.tsconfig, null, 2));
//SETTING UP .gitignore and .npmignore
let gitignore = new Set([
    "coverage",
    "node_modules",
    ".nyc_output",
    "temp",
    ".DS_Store"
]);
let npmignore = new Set([
    "coverage",
    "node_modules",
    "src",
    "test",
    "tsconfig*.json",
    "docs",
    ".nyc_output",
    "temp",
    ".DS_Store"
]);
if (fs_1.default.existsSync(path_1.default.join(cwd, ".gitignore"))) {
    let existing = fs_1.default.readFileSync(path_1.default.join(cwd, ".gitignore")).toString().split('\n');
    for (let s of existing)
        gitignore.add(s.trim());
}
fs_1.default.writeFileSync(path_1.default.join(cwd, ".gitignore"), Array.from(gitignore).join('\n'));
if (fs_1.default.existsSync(path_1.default.join(cwd, ".npmignore"))) {
    let existing = fs_1.default.readFileSync(path_1.default.join(cwd, ".npmignore")).toString().split('\n');
    for (let s of existing)
        npmignore.add(s.trim());
}
fs_1.default.writeFileSync(path_1.default.join(cwd, ".npmignore"), Array.from(npmignore).join('\n'));
