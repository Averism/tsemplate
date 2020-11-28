"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cwd = process.env.INIT_CWD;
//SETTING UP package.json
let packageJson = JSON.parse(fs_1.default.readFileSync(path_1.default.join(cwd, "package.json")).toString());
if (!packageJson.averModule)
    packageJson.averModule = {};
packageJson.averModule.tsemplate = {
    reconfigure: path_1.default.join(path_1.default.relative(cwd, process.cwd()), 'src', 'module-utils', 'reconfigure.ts'),
    priority: 0
};
if (!packageJson.devDependencies)
    packageJson.devDependencies = {};
packageJson.devDependencies["@types/mocha"] = "^8.0.3";
packageJson.devDependencies["mocha"] = "^8.0.3";
packageJson.devDependencies["nyc"] = "^15.1.0";
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
fs_1.default.writeFileSync(path_1.default.join(cwd, "package.json"), JSON.stringify(packageJson, null, 2));
//SETTING UP tsconfig.json
const tsconfig = {
    "compilerOptions": {
        "noImplicitAny": true,
        "target": "es6",
        "outDir": "temp",
        "sourceMap": true,
        "moduleResolution": "node",
        "pretty": true,
        "esModuleInterop": true,
        "module": "commonjs",
        "experimentalDecorators": true,
        "lib": [
            "es2017",
            "es6",
        ]
    },
    "include": [
        "src/**/*",
        "index.ts",
        "test/*"
    ],
    "exclude": [
        "node_modules",
        "**/*.spec.ts"
    ],
    "compileOnSave": true,
    "lib": [
        "es2017",
        "es6",
    ]
};
if (!fs_1.default.existsSync(path_1.default.join(cwd, "tsconfig.json")))
    fs_1.default.writeFileSync(path_1.default.join(cwd, "tsconfig.json"), JSON.stringify(tsconfig, null, 2));
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
    ".nyc_output",
    "temp",
    ".DS_Store"
]);
if (fs_1.default.existsSync(path_1.default.join(cwd, ".gitignore"))) {
    let existing = fs_1.default.readFileSync(path_1.default.join(cwd, ".gitignore")).toString().split('\n');
    for (let s of existing)
        gitignore.add(s);
}
fs_1.default.writeFileSync(path_1.default.join(cwd, ".gitignore"), Array.from(gitignore).join('\n'));
if (fs_1.default.existsSync(path_1.default.join(cwd, ".npmignore"))) {
    let existing = fs_1.default.readFileSync(path_1.default.join(cwd, ".npmignore")).toString().split('\n');
    for (let s of existing)
        npmignore.add(s);
}
fs_1.default.writeFileSync(path_1.default.join(cwd, ".npmignore"), Array.from(gitignore).join('\n'));
console.log(`
tsemplate module has added few dependencies to your package.json
please run 

\u001b[42m\u001b[30mnpm install\u001b[0m

to install these dependencies before continuing
`);
