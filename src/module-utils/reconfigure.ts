import fs from 'fs'
import path from 'path'
import readline from 'readline'
import {buildconfig, webconfig} from './templates/tsconfig'
import cp from 'child_process'
import * as strings from './templates/strings'
import * as jobs from './templates/rubahjobs'

const crl = () => readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const cwd: string = process.env.INIT_CWD;
const fd: string = path.join('node_modules','tsemplate');

async function reconfigure() {

    console.log("reconfiguring tsemplate");
    
    let packageJson: any = JSON.parse(fs.readFileSync(path.join(cwd,"package.json")).toString());

    if(packageJson.averModule.tsemplate.firstrun){
        delete packageJson.averModule.tsemplate.firstrun;

        console.log(strings.afterFirstReconfigure)
        fs.writeFileSync(path.join(cwd,"README.md"),strings.readme1);
        fs.writeFileSync(path.join(cwd,"package.json"),JSON.stringify(packageJson,null,2));
        return;
    }

    //Setup the Project Name
    if(packageJson.name == "nameplaceholder"){
        const rl = crl();
        const nameQuestion = (resolve: any, reject: any):any => rl.question(
            "please enter your project name: ", ans => {
                if(ans.length>0){
                    rl.close();
                    resolve(ans);
                } else {
                    return new Promise(nameQuestion)
                }
        })
        packageJson.name = await new Promise(nameQuestion) || 'myproject';
    }
    
    let mode = packageJson.averModule.tsemplate.mode
    if(mode != "module" && mode != "application"){
        const rl = crl();
        mode = await new Promise(resolve => rl.question(
            "do you want to develop (module)/application/staticweb?", ans => {
            rl.close();
            resolve(ans);
        })) || 'module';
        packageJson.averModule.tsemplate.mode = mode;
        if(mode == "app" || mode == "application") mode = "application"
        else if(mode == "static" || mode == "web" || mode == "staticweb") mode = "staticweb"
        else mode = "module";
    }
    console.log("reconfiguring for",mode);
    if(mode == "module") {
        if(!fs.existsSync(path.join(cwd,"tsconfig.build.json")))
            fs.writeFileSync(path.join(cwd,"tsconfig.build.json"),JSON.stringify(buildconfig,null,2));
        fs.writeFileSync(path.join(cwd,"README.md"),strings.readmeModule);
        packageJson.scripts.reconfigure = "node -r ts-node/register src/module-utils/reconfigure.ts";
        packageJson.scripts['build:ts.d'] = "tsc -d --project tsconfig.build.json --emitDeclarationOnly";
        packageJson.scripts['build:ts'] = "tsc --project tsconfig.build.json";
        packageJson.scripts.build = "rm -rf build && mkdir build && npm run build:ts && npm run build:ts.d";
        packageJson.scripts.reconfigure = "node -r ts-node/register src/module-utils/reconfigure.ts";
        packageJson.main = "build/index.js";
        packageJson.bin = "build/index.js";
        packageJson.types = "build/index.d.ts";
        if(fs.readFileSync(path.join(cwd, "src","index.ts")).toString() == "//Your main script here")
            fs.copyFileSync(path.join("src","module-utils","templates","module_index.ts"),path.join(cwd, "src","index.ts"))
        if(!fs.existsSync(path.join(cwd, "src", "module-utils"))) fs.mkdirSync(path.join(cwd, "src", "module-utils"));
        if(!fs.existsSync(path.join(cwd,"src","module-utils","postinstall.ts")))
            fs.writeFileSync(path.join(cwd,"src","module-utils","postinstall.ts"),"//YOUR POSTINSTALL SCRIPT HERE");
        if(!fs.existsSync(path.join(cwd,"src","module-utils","reconfigure.ts")))
            fs.writeFileSync(path.join(cwd,"src","module-utils","reconfigure.ts"),"//YOUR RECONFIGURE SCRIPT HERE");
        packageJson.scripts.postinstall = "node -r ts-node/register src/module-utils/postinstall.ts && "+
            "node -r ts-node/register src/module-utils/reconfigure.ts";
    } else if(mode == "staticweb") {
        fs.writeFileSync(path.join(cwd,"tsconfig.json"),JSON.stringify(webconfig,null,2));
        let wpconf = fs.readFileSync(path.join(fd,'template','webpackconfig.js')).toString();
        fs.writeFileSync(path.join(cwd,"webpack.config.js"),wpconf);
        if(!fs.existsSync(path.join(cwd, "asset"))) fs.mkdirSync(path.join(cwd, "asset"));
        fs.copyFileSync(path.join(fd,'template','favicon.png'), path.join(cwd, "asset", "favicon.png"));
        packageJson.favicon = 'asset/favicon.png'
        packageJson.devDependencies['webpack'] = "^5.36.2";
        packageJson.devDependencies["webpack-cli"] = "^4.6.0";
        packageJson.devDependencies["ts-loader"] = "^9.1.1";
        packageJson.devDependencies["html-webpack-plugin"] = "^5.3.1";
        packageJson.devDependencies["favicons-webpack-plugin"] = "^5.0.2";
        packageJson.devDependencies["http-server"] = "^0.12.3";
        packageJson.devDependencies["@types/http-server"] = "^0.10.1";
        packageJson.scripts['build'] = "webpack";
        packageJson.scripts['dev'] = "http-server dist -p 8080";
    } else {
        // APPLICATION RECONFIGURATION GOES HERE
    }

    //initializing rubah folder
    if(!fs.existsSync(path.join(cwd, ".avermodule"))) fs.mkdirSync(path.join(cwd, ".avermodule"));
    if(!fs.existsSync(path.join(cwd, ".avermodule", "rubah"))) fs.mkdirSync(path.join(cwd, ".avermodule", "rubah"));
    let jobsPath = path.join(cwd, ".avermodule", "rubah","jobs");
    if(!fs.existsSync(jobsPath)) fs.mkdirSync(jobsPath);

    //Setting Up basic rubah jobs
    fs.writeFileSync(path.join(jobsPath,"package.json"),JSON.stringify(jobs.packagejson));
    fs.writeFileSync(path.join(jobsPath,"readme.json"),JSON.stringify(jobs.readme(mode)));
    
    if(mode == "module") {
        fs.writeFileSync(path.join(jobsPath,"index.json"),JSON.stringify(jobs.index));
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