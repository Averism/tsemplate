"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const readline_1 = __importDefault(require("readline"));
const tsconfig_1 = require("./templates/tsconfig");
const child_process_1 = __importDefault(require("child_process"));
const strings = __importStar(require("./templates/strings"));
const jobs = __importStar(require("./templates/rubahjobs"));
const crl = () => readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const cwd = process.env.INIT_CWD;
function reconfigure() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("reconfiguring tsemplate");
        let packageJson = JSON.parse(fs_1.default.readFileSync(path_1.default.join(cwd, "package.json")).toString());
        if (packageJson.averModule.tsemplate.firstrun) {
            delete packageJson.averModule.tsemplate.firstrun;
            console.log(strings.afterFirstReconfigure);
            fs_1.default.writeFileSync(path_1.default.join(cwd, "README.md"), strings.readme1);
            fs_1.default.writeFileSync(path_1.default.join(cwd, "package.json"), JSON.stringify(packageJson, null, 2));
            return;
        }
        let mode = packageJson.averModule.tsemplate.mode;
        if (mode != "module" && mode != "application") {
            const rl = crl();
            mode = (yield new Promise(resolve => rl.question("do you want to develop a (module) or an application?", ans => {
                rl.close();
                resolve(ans);
            }))) || 'module';
            packageJson.averModule.tsemplate.mode = mode;
            if (mode == "app" || mode == "application")
                mode = "application";
            else
                mode = "module";
        }
        console.log("reconfiguring for", mode);
        if (mode == "module") {
            if (!fs_1.default.existsSync(path_1.default.join(cwd, "tsconfig.build.json")))
                fs_1.default.writeFileSync(path_1.default.join(cwd, "tsconfig.build.json"), JSON.stringify(tsconfig_1.buildconfig, null, 2));
            fs_1.default.writeFileSync(path_1.default.join(cwd, "README.md"), strings.readmeModule);
            packageJson.scripts.reconfigure = "node -r ts-node/register src/module-utils/reconfigure.ts";
            packageJson.scripts['build:ts.d'] = "tsc -d --project tsconfig.build.json --emitDeclarationOnly";
            packageJson.scripts['build:ts'] = "tsc --project tsconfig.build.json";
            packageJson.scripts.build = "rm -rf build && mkdir build && npm run build:ts && npm run build:ts.d";
            packageJson.scripts.reconfigure = "node -r ts-node/register src/module-utils/reconfigure.ts";
            packageJson.main = "build/index.js";
            packageJson.bin = "build/index.js";
            packageJson.types = "build/index.d.js";
            if (!fs_1.default.existsSync(path_1.default.join(cwd, "src", "module-utils")))
                fs_1.default.mkdirSync(path_1.default.join(cwd, "src", "module-utils"));
            if (!fs_1.default.existsSync(path_1.default.join(cwd, "src", "module-utils", "postinstall.ts")))
                fs_1.default.writeFileSync(path_1.default.join(cwd, "src", "module-utils", "postinstall.ts"), "//YOUR POSTINSTALL SCRIPT HERE");
            if (!fs_1.default.existsSync(path_1.default.join(cwd, "src", "module-utils", "reconfigure.ts")))
                fs_1.default.writeFileSync(path_1.default.join(cwd, "src", "module-utils", "reconfigure.ts"), "//YOUR RECONFIGURE SCRIPT HERE");
            packageJson.scripts.postinstall = "node -r ts-node/register src/module-utils/postinstall.ts && " +
                "node -r ts-node/register src/module-utils/reconfigure.ts";
        }
        else {
            // APPLICATION RECONFIGURATION GOES HERE
        }
        //initializing rubah folder
        if (!fs_1.default.existsSync(path_1.default.join(cwd, ".avermodule")))
            fs_1.default.mkdirSync(path_1.default.join(cwd, ".avermodule"));
        if (!fs_1.default.existsSync(path_1.default.join(cwd, ".avermodule", "rubah")))
            fs_1.default.mkdirSync(path_1.default.join(cwd, ".avermodule", "rubah"));
        let jobsPath = path_1.default.join(cwd, ".avermodule", "rubah", "jobs");
        if (!fs_1.default.existsSync(jobsPath))
            fs_1.default.mkdirSync(jobsPath);
        //Setting Up basic rubah jobs
        fs_1.default.writeFileSync(path_1.default.join(jobsPath, "package.json"), JSON.stringify(jobs.packagejson));
        fs_1.default.writeFileSync(path_1.default.join(jobsPath, "index.json"), JSON.stringify(jobs.index));
        fs_1.default.writeFileSync(path_1.default.join(jobsPath, "readme.json"), JSON.stringify(jobs.readme));
        for (let moduleName in packageJson.averModule) {
            if (moduleName == packageJson.name)
                continue;
            let pkgjson = JSON.parse(fs_1.default.readFileSync(`node_modules/${moduleName}/package.json`).toString());
            console.log(`reconfiguring ${moduleName}`);
            console.log(child_process_1.default.execSync(`node_modules/${moduleName}/${pkgjson.main} reconfigure`).toString());
        }
        fs_1.default.writeFileSync(path_1.default.join(cwd, "package.json"), JSON.stringify(packageJson, null, 2));
    });
}
reconfigure();
