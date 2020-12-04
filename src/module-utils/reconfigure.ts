import fs from 'fs'
import path from 'path'
import readline from 'readline'
const crl = () => readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const cwd: string = process.env.INIT_CWD;

async function reconfigure() {

    console.log("reconfiguring tsemplate");
    
    //SETTING UP RECONFIGURE SCRIPT
    let packageJson: any = JSON.parse(fs.readFileSync(path.join(cwd,"package.json")).toString());
    packageJson.scripts.reconfigure = Object.keys(packageJson.averModule)
        .sort((a,b)=>packageJson.averModule[a].priority - packageJson.averModule[a].priority)
        .filter(x=>packageJson.averModule[x].reconfigure)
        .filter(x=>x!=packageJson.name)
        .map(x=>packageJson.averModule[x].reconfigure)
        .concat([packageJson.scripts.reconfigure || "echo finished reconfiguring"])
        .join(" && ");
    
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
    console.log("reconfiguring for ",mode);
    if(mode == "module") {
        if(!fs.existsSync(path.join(cwd,"tsconfig.json")))
            fs.writeFileSync(path.join(cwd,"tsconfig.json"),JSON.stringify(buildconfig,null,2));
        packageJson.scripts['build:ts.d'] = "tsc -d --project tsconfig.build.json --emitDeclarationOnly";
        packageJson.scripts['build:ts'] = "tsc --project tsconfig.build.json";
        packageJson.scripts.build = "rm -rf build && mkdir build && npm run build:ts && npm run build:ts.d";
    } else {
        // APPLICATION RECONFIGURATION GOES HERE
    }

    fs.writeFileSync(path.join(cwd,"package.json"),JSON.stringify(packageJson,null,2));
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
  }

reconfigure();