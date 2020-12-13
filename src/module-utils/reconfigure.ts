import fs from 'fs'
import path from 'path'
import readline from 'readline'
import {buildconfig} from './templates/tsconfig'
import cp from 'child_process'

const crl = () => readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const cwd: string = process.env.INIT_CWD;

async function reconfigure() {

    console.log("reconfiguring tsemplate");
    
    //SETTING UP RECONFIGURE SCRIPT
    let packageJson: any = JSON.parse(fs.readFileSync(path.join(cwd,"package.json")).toString());

    if(packageJson.averModule.tsemplate.firstrun){
        delete packageJson.averModule.tsemplate.firstrun;

        console.log(`
tsemplate module has added few dependencies to your package.json
please run 

\u001b[42m\u001b[30mnpm run reconfigure && npm install\u001b[0m

to install these dependencies and configure your project before continuing
`)
        fs.writeFileSync(path.join(cwd,"package.json"),JSON.stringify(packageJson,null,2));
        return;
    }
    
    let mode = packageJson.averModule.tsemplate.mode
    if(mode != "module" && mode != "application"){
        const rl = crl();
        mode = await new Promise(resolve => rl.question(
            "do you want to develop a (module) or an application?", ans => {
            rl.close();
            resolve(ans);
        })) || 'module';
        packageJson.averModule.tsemplate.mode = mode;
        if(mode == "app" || mode == "application") mode = "application"
        else mode = "module";
    }
    console.log("reconfiguring for",mode);
    if(mode == "module") {
        if(!fs.existsSync(path.join(cwd,"tsconfig.build.json")))
            fs.writeFileSync(path.join(cwd,"tsconfig.build.json"),JSON.stringify(buildconfig,null,2));
        packageJson.scripts.reconfigure = "node -r ts-node/register src/module-utils/reconfigure.ts";
        packageJson.scripts['build:ts.d'] = "tsc -d --project tsconfig.build.json --emitDeclarationOnly";
        packageJson.scripts['build:ts'] = "tsc --project tsconfig.build.json";
        packageJson.scripts.build = "rm -rf build && mkdir build && npm run build:ts && npm run build:ts.d";
        packageJson.scripts.reconfigure = "node -r ts-node/register src/module-utils/reconfigure.ts";
        packageJson.main = "build/index.js";
        packageJson.bin = "build/index.js";
        packageJson.types = "build/index.d.js";
        if(!fs.existsSync(path.join(cwd, "src", "module-utils"))) fs.mkdirSync(path.join(cwd, "src", "module-utils"));
        if(!fs.existsSync(path.join(cwd,"src","module-utils","postinstall.ts")))
            fs.writeFileSync(path.join(cwd,"src","module-utils","postinstall.ts"),"//YOUR POSTINSTALL SCRIPT HERE");
        if(!fs.existsSync(path.join(cwd,"src","module-utils","reconfigure.ts")))
            fs.writeFileSync(path.join(cwd,"src","module-utils","reconfigure.ts"),"//YOUR RECONFIGURE SCRIPT HERE");
        packageJson.scripts.postinstall = "node -r ts-node/register src/module-utils/postinstall.ts && "+
            "node -r ts-node/register src/module-utils/reconfigure.ts";
    } else {
        // APPLICATION RECONFIGURATION GOES HERE
    }

    for(let moduleName in packageJson.averModule){
        if(moduleName == packageJson.name) continue;
        let pkgjson = JSON.parse(fs.readFileSync(`node_modules/${moduleName}/package.json`).toString());
        console.log(`reconfiguring ${moduleName}`);
        console.log(cp.execSync(`node_modules/${moduleName}/${pkgjson.main} reconfigure`).toString());
    }

    fs.writeFileSync(path.join(cwd,"package.json"),JSON.stringify(packageJson,null,2));
}
reconfigure();