import fs from 'fs'
import path from 'path'
const cwd: string = process.env.INIT_CWD;

//SETTING UP package.json
let packageJson: any = JSON.parse(fs.readFileSync(path.join(cwd,"package.json")).toString());
if(!packageJson.averModule) packageJson.averModule = {};
packageJson.averModule.tsemplate = {
    reconfigure: path.join(path.relative(cwd,process.cwd()),'src','module-utils','reconfigure.ts'),
    priority: 0
}
if(!packageJson.devDependencies) packageJson.devDependencies = {};
packageJson.devDependencies["@types/mocha"] = "^8.0.3";
packageJson.devDependencies["mocha"] = "^8.0.3";
packageJson.devDependencies["nyc"] = "^15.1.0";

packageJson.scripts.test = "mocha";
packageJson.scripts.cov = "nyc mocha"

if(!packageJson.nyc) packageJson.nyc = {
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
  }

fs.writeFileSync(path.join(cwd,"package.json"),JSON.stringify(packageJson,null,2));


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

if(!fs.existsSync(path.join(cwd,"tsconfig.json")))
    fs.writeFileSync(path.join(cwd,"tsconfig.json"),JSON.stringify(tsconfig,null,2));

console.log(`
tsemplate module has added few dependencies to your package.json
please run 

npm install
\u001b[42m
to install these dependencies before continuing
\u001b[0m`)

