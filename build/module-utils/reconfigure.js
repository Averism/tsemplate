"use strict";
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
const tsconfig_1 = require("./tsconfig");
const crl = () => readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const cwd = process.env.INIT_CWD;
function reconfigure() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("reconfiguring tsemplate");
        //SETTING UP RECONFIGURE SCRIPT
        let packageJson = JSON.parse(fs_1.default.readFileSync(path_1.default.join(cwd, "package.json")).toString());
        packageJson.scripts.reconfigure = Object.keys(packageJson.averModule)
            .sort((a, b) => packageJson.averModule[a].priority - packageJson.averModule[a].priority)
            .filter(x => packageJson.averModule[x].reconfigure)
            .filter(x => x != packageJson.name)
            .map(x => packageJson.averModule[x].reconfigure)
            .concat(["echo finished reconfiguring"])
            .join(" && ");
        if (packageJson.averModule.tsemplate.firstrun) {
            delete packageJson.averModule.tsemplate.firstrun;
            console.log(`
tsemplate module has added few dependencies to your package.json
please run 

\u001b[42m\u001b[30mnpm run reconfigure && npm install\u001b[0m

to install these dependencies and configure your project before continuing
`);
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
            packageJson.scripts['build:ts.d'] = "tsc -d --project tsconfig.build.json --emitDeclarationOnly";
            packageJson.scripts['build:ts'] = "tsc --project tsconfig.build.json";
            packageJson.scripts.build = "rm -rf build && mkdir build && npm run build:ts && npm run build:ts.d";
            packageJson.main = "build/index.js";
            packageJson.bin = "build/index.js";
            packageJson.types = "build/index.d.js";
            let index = fs_1.default.readFileSync(path_1.default.join(cwd, "src", "index.ts")).toString();
            let i = index.indexOf("//your command line parsing logic here") + 38;
            index = index.substr(0, i) + "\n        case 'reconfigure': require('./module-utils/reconfigure'); break;"
                + index.substr(i);
            fs_1.default.writeFileSync(path_1.default.join(cwd, "src", "index.ts"), index);
            fs_1.default.writeFileSync(path_1.default.join(cwd, "src", "module-util", "postinstall.ts"), "\\\\YOUR POSTINSTALL SCRIPT HERE");
            fs_1.default.writeFileSync(path_1.default.join(cwd, "src", "module-util", "reconfigure.ts"), "\\\\YOUR RECONFIGURE SCRIPT HERE");
            packageJson.scripts.postinstall = "node -r ts-node/register src/module-utils/postinstall.ts && " +
                "node -r ts-node/register src/module-utils/reconfigure.ts";
        }
        else {
            // APPLICATION RECONFIGURATION GOES HERE
        }
        fs_1.default.writeFileSync(path_1.default.join(cwd, "package.json"), JSON.stringify(packageJson, null, 2));
    });
}
reconfigure();
