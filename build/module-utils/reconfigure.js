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
            .concat([packageJson.scripts.reconfigure || "echo finished reconfiguring"])
            .join(" && ");
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
            console.log("reconfiguring for ", mode);
            if (mode == "module") {
                if (!fs_1.default.existsSync(path_1.default.join(cwd, "tsconfig.json")))
                    fs_1.default.writeFileSync(path_1.default.join(cwd, "tsconfig.json"), JSON.stringify(buildconfig, null, 2));
                packageJson.scripts['build:ts.d'] = "tsc -d --project tsconfig.build.json --emitDeclarationOnly";
                packageJson.scripts['build:ts'] = "tsc --project tsconfig.build.json";
                packageJson.scripts.build = "rm -rf build && mkdir build && npm run build:ts && npm run build:ts.d";
            }
        }
        fs_1.default.writeFileSync(path_1.default.join(cwd, "package.json"), JSON.stringify(packageJson, null, 2));
    });
}
const buildconfig = {
    "compilerOptions": {
        "noImplicitAny": true,
        "target": "es6",
        "outDir": "build",
        "sourceMap": false,
        "moduleResolution": "node",
        "pretty": false,
        "esModuleInterop": true,
        "module": "commonjs",
    },
    "include": [
        "src/**/*",
        "index.ts",
    ],
    "exclude": [
        "node_modules",
        "**/*.spec.ts"
    ],
    "compileOnSave": true,
    "lib": ["es2017", "es6"]
};
reconfigure();
